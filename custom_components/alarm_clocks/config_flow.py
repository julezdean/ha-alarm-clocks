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
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import selector
from homeassistant.util import slugify

from .actions import async_validate_actions
from .const import (
    ACTION_KEYS,
    CONF_ALARM_TIME,
    CONF_AUTO_DISMISS,
    CONF_DAYS,
    CONF_ENABLED,
    CONF_POST_OFFSET,
    CONF_POST_TIMEOUT,
    CONF_PRE_OFFSET,
    CONF_SNOOZE_DURATION,
    DEFAULT_ALARM_TIME,
    DEFAULT_AUTO_DISMISS,
    DEFAULT_DAYS,
    DEFAULT_NAME,
    DEFAULT_POST_OFFSET,
    DEFAULT_POST_TIMEOUT,
    DEFAULT_PRE_OFFSET,
    DEFAULT_SNOOZE_DURATION,
    DOMAIN,
    MAX_POST_TIMEOUT,
    MIN_POST_TIMEOUT,
    PHASE_POST,
)
from .models import parse_actions

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
        CONF_POST_TIMEOUT: DEFAULT_POST_TIMEOUT,
        **{key: [] for key in ACTION_KEYS.values()},
    }


class AlarmClockConfigFlow(ConfigFlow, domain=DOMAIN):
    """Set up a new alarm clock."""

    # Version 2 replaced the script fields with action sequences; see
    # async_migrate_entry. A major version, so that an older release refuses
    # a migrated entry instead of silently running none of its actions.
    VERSION = 2

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
    """Configure the action sequences, one phase per step."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Pick the phase to edit."""
        return self.async_show_menu(step_id="init", menu_options=list(ACTION_KEYS))

    async def async_step_pre(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Edit the pre actions."""
        return await self._async_step_phase("pre", user_input)

    async def async_step_alarm(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Edit the alarm actions."""
        return await self._async_step_phase("alarm", user_input)

    async def async_step_snooze(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Edit the snooze actions."""
        return await self._async_step_phase("snooze", user_input)

    async def async_step_dismiss(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Edit the dismiss actions."""
        return await self._async_step_phase("dismiss", user_input)

    async def async_step_post(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Edit the post actions and their time limit."""
        return await self._async_step_phase("post", user_input)

    async def _async_step_phase(
        self, phase: str, user_input: dict[str, Any] | None
    ) -> ConfigFlowResult:
        """Show and store the action sequence of one phase."""
        key = ACTION_KEYS[phase]
        errors: dict[str, str] = {}

        if user_input is not None:
            actions = parse_actions(user_input.get(key))
            try:
                if actions:
                    await async_validate_actions(self.hass, actions)
            except (vol.Invalid, HomeAssistantError) as err:
                _LOGGER.debug("Invalid %s actions: %s", phase, err)
                errors[key] = "invalid_actions"
            else:
                # The values maintained by the entities (time, days, offsets)
                # and the other phases must be preserved. The raw sequence is
                # stored: the validated one holds templates and is no JSON.
                options = {**self.config_entry.options, key: actions}
                if phase == PHASE_POST:
                    options[CONF_POST_TIMEOUT] = int(
                        user_input.get(CONF_POST_TIMEOUT, DEFAULT_POST_TIMEOUT)
                    )
                return self.async_create_entry(data=options)

        current = self.config_entry.options
        fields: dict[Any, Any] = {
            vol.Optional(
                key,
                description={"suggested_value": current.get(key) or None},
            ): selector.ActionSelector(),
        }
        if phase == PHASE_POST:
            fields[
                vol.Required(
                    CONF_POST_TIMEOUT,
                    default=current.get(CONF_POST_TIMEOUT, DEFAULT_POST_TIMEOUT),
                )
            ] = selector.NumberSelector(
                selector.NumberSelectorConfig(
                    min=MIN_POST_TIMEOUT,
                    max=MAX_POST_TIMEOUT,
                    step=1,
                    unit_of_measurement="min",
                    mode=selector.NumberSelectorMode.BOX,
                )
            )
        return self.async_show_form(
            step_id=phase, data_schema=vol.Schema(fields), errors=errors
        )
