"""The Alarm Clocks integration: multiple alarms with snooze, pre and post actions."""

from __future__ import annotations

import logging
from pathlib import Path

import voluptuous as vol

from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig
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


async def _async_register_card(hass: HomeAssistant) -> None:
    """Serve the bundled Lovelace card and register it with the frontend.

    This way the user neither has to install the card separately nor add it
    under Dashboards -> Resources.
    """
    if hass.data.setdefault(DOMAIN, {}).get(CARD_REGISTERED):
        return

    path = Path(__file__).parent / "frontend" / CARD_FILENAME
    if not await hass.async_add_executor_job(path.is_file):
        _LOGGER.warning(
            "Lovelace card %s not found, it will not be registered", path
        )
        return

    try:
        await hass.http.async_register_static_paths(
            [StaticPathConfig(CARD_URL, str(path), False)]
        )
        integration = await async_get_integration(hass, DOMAIN)
        frontend.add_extra_js_url(hass, f"{CARD_URL}?v={integration.version}")
    except (HomeAssistantError, RuntimeError, ValueError) as err:
        # Without the card the integration remains fully functional.
        _LOGGER.error("Lovelace card could not be registered: %s", err)
        return

    hass.data[DOMAIN][CARD_REGISTERED] = True
    _LOGGER.debug("Lovelace card registered at %s", CARD_URL)


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
