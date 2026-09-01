"""The Alarm Clocks integration: multiple alarms with snooze, pre and post actions."""

from __future__ import annotations

import logging
from pathlib import Path

import voluptuous as vol

from homeassistant.components.http import StaticPathConfig
from homeassistant.components.lovelace import DOMAIN as LOVELACE_DOMAIN
from homeassistant.config_entries import ConfigEntry, ConfigEntryState
from homeassistant.const import ATTR_DEVICE_ID, ATTR_ENTITY_ID
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.loader import async_get_integration
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.typing import ConfigType

from .const import (
    ATTR_DAYS,
    CARD_FILENAME,
    CARD_REGISTERED,
    CARD_URL,
    ATTR_DURATION,
    ATTR_TIME,
    DOMAIN,
    MAX_SNOOZE_DURATION,
    MIN_SNOOZE_DURATION,
    PLATFORMS,
    SERVICE_DISMISS,
    SERVICE_SET_ALARM,
    SERVICE_SNOOZE,
    SERVICE_TRIGGER_ALARM,
    WEEKDAYS,
)
from .coordinator import AlarmClockConfigEntry, AlarmClockCoordinator

_LOGGER = logging.getLogger(__name__)

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

_TARGET_SCHEMA = {
    vol.Optional(ATTR_DEVICE_ID): vol.All(cv.ensure_list, [cv.string]),
    vol.Optional(ATTR_ENTITY_ID): cv.entity_ids,
}

SNOOZE_SCHEMA = vol.Schema(
    {
        **_TARGET_SCHEMA,
        vol.Optional(ATTR_DURATION): vol.All(
            vol.Coerce(int), vol.Range(min=MIN_SNOOZE_DURATION, max=MAX_SNOOZE_DURATION)
        ),
    }
)

DISMISS_SCHEMA = vol.Schema(_TARGET_SCHEMA)

TRIGGER_ALARM_SCHEMA = vol.Schema(_TARGET_SCHEMA)

SET_ALARM_SCHEMA = vol.Schema(
    {
        **_TARGET_SCHEMA,
        vol.Optional(ATTR_TIME): cv.time,
        vol.Optional(ATTR_DAYS): vol.All(cv.ensure_list, [vol.In(WEEKDAYS)]),
    }
)


def _async_resolve_coordinators(
    hass: HomeAssistant, call: ServiceCall
) -> list[AlarmClockCoordinator]:
    """Resolve the target devices or entities of a service call."""
    entry_ids: set[str] = set()

    device_reg = dr.async_get(hass)
    for device_id in call.data.get(ATTR_DEVICE_ID, []):
        device = device_reg.async_get(device_id)
        if device is None:
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="device_not_found",
                translation_placeholders={"device_id": device_id},
            )
        entry_ids.update(device.config_entries)

    entity_reg = er.async_get(hass)
    for entity_id in call.data.get(ATTR_ENTITY_ID, []):
        entity = entity_reg.async_get(entity_id)
        if entity is None or entity.config_entry_id is None:
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="entity_not_found",
                translation_placeholders={"entity_id": entity_id},
            )
        entry_ids.add(entity.config_entry_id)

    coordinators: list[AlarmClockCoordinator] = []
    for entry_id in entry_ids:
        entry = hass.config_entries.async_get_entry(entry_id)
        if (
            entry is not None
            and entry.domain == DOMAIN
            and entry.state is ConfigEntryState.LOADED
        ):
            coordinators.append(entry.runtime_data)

    if not coordinators:
        raise ServiceValidationError(
            translation_domain=DOMAIN, translation_key="no_alarm_clocks_target"
        )
    return coordinators


async def _async_card_resources(hass: HomeAssistant):
    """Return the Lovelace resource collection, or None when unavailable.

    The structure of ``hass.data["lovelace"]`` changed over Home Assistant
    versions: it used to be a plain dict and is a dataclass in newer releases.
    Both are handled here.
    """
    data = hass.data.get(LOVELACE_DOMAIN)
    if data is None:
        return None
    if isinstance(data, dict):
        return data.get("resources")
    return getattr(data, "resources", None)


async def _async_register_card(hass: HomeAssistant) -> None:
    """Serve the bundled Lovelace card and register it as a Lovelace resource.

    Registering a real resource is what the frontend reliably picks up. The
    version is part of the URL so browsers fetch the new file after an update.
    """
    if hass.data.setdefault(DOMAIN, {}).get(CARD_REGISTERED):
        return

    path = Path(__file__).parent / "frontend" / CARD_FILENAME
    if not await hass.async_add_executor_job(path.is_file):
        _LOGGER.warning("Lovelace card %s not found, it will not be registered", path)
        return

    try:
        await hass.http.async_register_static_paths(
            [StaticPathConfig(CARD_URL, str(path), False)]
        )
    except (HomeAssistantError, RuntimeError, ValueError) as err:
        # Without the card the integration remains fully functional.
        _LOGGER.error("Lovelace card could not be served: %s", err)
        return

    hass.data[DOMAIN][CARD_REGISTERED] = True

    integration = await async_get_integration(hass, DOMAIN)
    url = f"{CARD_URL}?v={integration.version}"

    resources = await _async_card_resources(hass)
    if resources is None or not hasattr(resources, "async_create_item"):
        # Lovelace is missing or runs with YAML managed resources, where the
        # integration must not write. The user has to add the resource once.
        _LOGGER.warning(
            "Could not register the Lovelace card automatically. Add %s as a "
            "JavaScript module under Settings -> Dashboards -> Resources",
            url,
        )
        return

    try:
        await resources.async_get_info()
        existing = [
            item
            for item in (resources.async_items() or [])
            if str(item.get("url", "")).split("?", 1)[0] == CARD_URL
        ]
        if not existing:
            await resources.async_create_item({"res_type": "module", "url": url})
            _LOGGER.debug("Lovelace card registered as a resource: %s", url)
        elif existing[0].get("url") != url:
            await resources.async_update_item(existing[0]["id"], {"url": url})
            _LOGGER.debug("Lovelace card resource updated to %s", url)
    except (HomeAssistantError, KeyError, TypeError, ValueError) as err:
        _LOGGER.warning(
            "Could not register the Lovelace card automatically (%s). Add %s as "
            "a JavaScript module under Settings -> Dashboards -> Resources",
            err,
            url,
        )


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register the services of the integration."""

    async def _handle_snooze(call: ServiceCall) -> None:
        for coordinator in _async_resolve_coordinators(hass, call):
            await coordinator.async_snooze(call.data.get(ATTR_DURATION))

    async def _handle_dismiss(call: ServiceCall) -> None:
        for coordinator in _async_resolve_coordinators(hass, call):
            await coordinator.async_dismiss()

    async def _handle_trigger_alarm(call: ServiceCall) -> None:
        for coordinator in _async_resolve_coordinators(hass, call):
            await coordinator.async_trigger_alarm()

    async def _handle_set_alarm(call: ServiceCall) -> None:
        for coordinator in _async_resolve_coordinators(hass, call):
            await coordinator.async_set_alarm(
                call.data.get(ATTR_TIME), call.data.get(ATTR_DAYS)
            )

    hass.services.async_register(DOMAIN, SERVICE_SNOOZE, _handle_snooze, SNOOZE_SCHEMA)
    hass.services.async_register(
        DOMAIN, SERVICE_DISMISS, _handle_dismiss, DISMISS_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_TRIGGER_ALARM, _handle_trigger_alarm, TRIGGER_ALARM_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_SET_ALARM, _handle_set_alarm, SET_ALARM_SCHEMA
    )

    await _async_register_card(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: AlarmClockConfigEntry) -> bool:
    """Set up a single alarm clock."""
    coordinator = AlarmClockCoordinator(hass, entry)
    await coordinator.async_setup()
    entry.runtime_data = coordinator

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(entry.add_update_listener(async_update_options))
    return True


async def async_update_options(hass: HomeAssistant, entry: AlarmClockConfigEntry) -> None:
    """Apply changed options without a reload so timers keep running."""
    await entry.runtime_data.async_apply_options()


async def async_unload_entry(hass: HomeAssistant, entry: AlarmClockConfigEntry) -> bool:
    """Unload a single alarm clock."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        await entry.runtime_data.async_shutdown()
    return unload_ok


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Remove the persisted runtime state when the entry is deleted."""
    from .store import AlarmClockStore

    await AlarmClockStore(hass, entry.entry_id).async_remove()
