"""Config flow and options flow of the Alarm Clocks integration."""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.const import CONF_NAME
from homeassistant.core import callback
from homeassistant.helpers import selector
from homeassistant.util import slugify

from .const import (
    CONF_ALARM_SCRIPT,
    CONF_ALARM_TIME,
    CONF_AUTO_DISMISS,
    CONF_DAYS,
    CONF_DISMISS_SCRIPT,
    CONF_ENABLED,
    CONF_POST_OFFSET,
    CONF_POST_SCRIPT,
    CONF_PRE_OFFSET,
    CONF_PRE_SCRIPT,
    CONF_SNOOZE_DURATION,
    CONF_SNOOZE_SCRIPT,
    DEFAULT_ALARM_TIME,
    DEFAULT_AUTO_DISMISS,
    DEFAULT_DAYS,
    DEFAULT_NAME,
    DEFAULT_POST_OFFSET,
    DEFAULT_PRE_OFFSET,
    DEFAULT_SNOOZE_DURATION,
    DOMAIN,
    SCRIPT_KEYS,
)

_LOGGER = logging.getLogger(__name__)

USER_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_NAME, default=DEFAULT_NAME): selector.TextSelector(),
    }
)


def _default_options() -> dict[str, Any]:
    """Default options for a new alarm clock."""
    return {
        CONF_ENABLED: False,
        CONF_ALARM_TIME: DEFAULT_ALARM_TIME,
        CONF_DAYS: list(DEFAULT_DAYS),
        CONF_SNOOZE_DURATION: DEFAULT_SNOOZE_DURATION,
        CONF_PRE_OFFSET: DEFAULT_PRE_OFFSET,
        CONF_POST_OFFSET: DEFAULT_POST_OFFSET,
        CONF_AUTO_DISMISS: DEFAULT_AUTO_DISMISS,
        CONF_ALARM_SCRIPT: "",
        CONF_PRE_SCRIPT: "",
        CONF_POST_SCRIPT: "",
        CONF_SNOOZE_SCRIPT: "",
        CONF_DISMISS_SCRIPT: "",
    }


class AlarmClockConfigFlow(ConfigFlow, domain=DOMAIN):
    """Set up a new alarm clock."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Ask for the name of the new alarm clock."""
        if user_input is not None:
            name = user_input[CONF_NAME].strip()

            await self.async_set_unique_id(slugify(name))
            self._abort_if_unique_id_configured()

            return self.async_create_entry(
                title=name, data={}, options=_default_options()
            )

        return self.async_show_form(step_id="user", data_schema=USER_SCHEMA)

    async def async_step_reconfigure(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Rename an alarm clock."""
        entry = self._get_reconfigure_entry()

        if user_input is not None:
            # The unique ID deliberately stays unchanged so that a renamed
            # alarm clock remains the same config entry.
            return self.async_update_reload_and_abort(
                entry, title=user_input[CONF_NAME].strip()
            )

        return self.async_show_form(
            step_id="reconfigure",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_NAME, default=entry.title): selector.TextSelector(),
                }
            ),
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        """Return the options flow."""
        return AlarmClockOptionsFlow()


class AlarmClockOptionsFlow(OptionsFlow):
    """Configure the optional scripts."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Edit the script assignments."""
        if user_input is not None:
            # The values maintained by the entities (time, days, offsets)
            # must be preserved.
            options = {**self.config_entry.options}
            for key in SCRIPT_KEYS:
                options[key] = user_input.get(key, "") or ""
            return self.async_create_entry(data=options)

        script_selector = selector.EntitySelector(
            selector.EntitySelectorConfig(domain="script")
        )
        current = self.config_entry.options
        schema = vol.Schema(
            {
                vol.Optional(
                    key,
                    description={"suggested_value": current.get(key) or None},
                ): script_selector
                for key in SCRIPT_KEYS
            }
        )
        return self.async_show_form(step_id="init", data_schema=schema)
