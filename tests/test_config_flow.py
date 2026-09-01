"""Tests for the config flow and the options flow."""

from __future__ import annotations

from homeassistant import config_entries
from homeassistant.const import CONF_NAME
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType

from custom_components.alarm_clocks.const import (
    CONF_ALARM_SCRIPT,
    CONF_ALARM_TIME,
    CONF_DISMISS_SCRIPT,
    CONF_ENABLED,
    CONF_POST_SCRIPT,
    CONF_PRE_SCRIPT,
    CONF_SNOOZE_SCRIPT,
    DOMAIN,
)


async def test_user_flow_creates_entry(hass: HomeAssistant) -> None:
    """An alarm clock can be created without further input."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "user"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {CONF_NAME: "Alarm 1"}
    )
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "Alarm 1"
    assert result["options"][CONF_ENABLED] is False
    assert result["options"][CONF_ALARM_TIME] == "07:00:00"


async def test_user_flow_duplicate_name_aborts(hass: HomeAssistant) -> None:
    """The same name is not created twice."""
    for expected in (FlowResultType.CREATE_ENTRY, FlowResultType.ABORT):
        result = await hass.config_entries.flow.async_init(
            DOMAIN, context={"source": config_entries.SOURCE_USER}
        )
        result = await hass.config_entries.flow.async_configure(
            result["flow_id"], {CONF_NAME: "Alarm 1"}
        )
        await hass.async_block_till_done()
        assert result["type"] is expected




async def test_options_flow_sets_scripts(hass: HomeAssistant, setup_alarm) -> None:
    """The options flow stores the script assignments."""
    result = await hass.config_entries.options.async_init(setup_alarm.entry_id)
    assert result["type"] is FlowResultType.FORM

    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {CONF_ALARM_SCRIPT: "script.wakeup_light"}
    )
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert setup_alarm.options[CONF_ALARM_SCRIPT] == "script.wakeup_light"
    assert setup_alarm.options[CONF_PRE_SCRIPT] == ""
    assert setup_alarm.options[CONF_POST_SCRIPT] == ""
    assert setup_alarm.options[CONF_SNOOZE_SCRIPT] == ""
    assert setup_alarm.options[CONF_DISMISS_SCRIPT] == ""
    assert setup_alarm.runtime_data.config.alarm_script == "script.wakeup_light"
