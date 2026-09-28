"""Tests for the config flow, the options flow and the entry migration."""

from __future__ import annotations

from pytest_homeassistant_custom_component.common import MockConfigEntry

from homeassistant import config_entries
from homeassistant.config_entries import ConfigEntryState
from homeassistant.const import CONF_NAME
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.helpers import entity_registry as er

from custom_components.alarm_clocks.const import (
    CONF_ALARM_ACTIONS,
    CONF_ALARM_TIME,
    CONF_DISMISS_ACTIONS,
    CONF_ENABLED,
    CONF_POST_ACTIONS,
    CONF_POST_TIMEOUT,
    CONF_PRE_ACTIONS,
    CONF_SNOOZE_ACTIONS,
    DEFAULT_POST_TIMEOUT,
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
    assert result["options"][CONF_ALARM_ACTIONS] == []
    assert result["options"][CONF_POST_TIMEOUT] == DEFAULT_POST_TIMEOUT
    assert result["result"].version == 2
    assert result["result"].minor_version == 2


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


async def _open_phase(hass: HomeAssistant, entry: MockConfigEntry, phase: str) -> dict:
    """Open the options flow and pick a phase from its menu."""
    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["type"] is FlowResultType.MENU
    assert result["menu_options"] == ["pre", "alarm", "snooze", "dismiss", "post"]

    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": phase}
    )
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == phase
    return result


async def test_options_flow_sets_actions_of_one_phase(
    hass: HomeAssistant, setup_alarm: MockConfigEntry
) -> None:
    """A phase step stores its sequence and leaves everything else alone."""
    time_before = setup_alarm.options[CONF_ALARM_TIME]
    actions = [{"action": "script.wakeup_light"}]

    result = await _open_phase(hass, setup_alarm, "alarm")
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {CONF_ALARM_ACTIONS: actions}
    )
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert setup_alarm.options[CONF_ALARM_ACTIONS] == actions
    assert setup_alarm.options[CONF_ALARM_TIME] == time_before
    for key in (CONF_PRE_ACTIONS, CONF_SNOOZE_ACTIONS, CONF_DISMISS_ACTIONS, CONF_POST_ACTIONS):
        assert setup_alarm.options.get(key, []) == []
    assert setup_alarm.runtime_data.config.actions["alarm"] == actions


async def test_options_flow_clears_actions(
    hass: HomeAssistant, config_entry: MockConfigEntry
) -> None:
    """Submitting an empty picker removes the sequence of that phase."""
    config_entry.add_to_hass(hass)
    hass.config_entries.async_update_entry(
        config_entry,
        options={**config_entry.options, CONF_DISMISS_ACTIONS: [{"event": "x"}]},
    )
    assert await hass.config_entries.async_setup(config_entry.entry_id)
    await hass.async_block_till_done()

    result = await _open_phase(hass, config_entry, "dismiss")
    result = await hass.config_entries.options.async_configure(result["flow_id"], {})
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert config_entry.options[CONF_DISMISS_ACTIONS] == []


async def test_options_flow_post_step_sets_time_limit(
    hass: HomeAssistant, setup_alarm: MockConfigEntry
) -> None:
    """Only the post step has the time limit."""
    result = await _open_phase(hass, setup_alarm, "pre")
    assert CONF_POST_TIMEOUT not in result["data_schema"].schema

    result = await _open_phase(hass, setup_alarm, "post")
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {CONF_POST_ACTIONS: [{"event": "coffee"}], CONF_POST_TIMEOUT: 15},
    )
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert setup_alarm.options[CONF_POST_TIMEOUT] == 15
    assert setup_alarm.runtime_data.config.post_timeout == 15


async def test_options_flow_rejects_invalid_actions(
    hass: HomeAssistant, setup_alarm: MockConfigEntry
) -> None:
    """An invalid sequence is refused in the form, not at the next alarm."""
    result = await _open_phase(hass, setup_alarm, "alarm")
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {CONF_ALARM_ACTIONS: [{"delay": "not a duration"}]}
    )

    assert result["type"] is FlowResultType.FORM
    assert result["errors"] == {CONF_ALARM_ACTIONS: "invalid_actions"}
    assert setup_alarm.options.get(CONF_ALARM_ACTIONS, []) == []


async def test_migration_turns_scripts_into_direct_calls(
    hass: HomeAssistant, options: dict
) -> None:
    """Version 1 script fields become sequences calling the script directly."""
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Alarm 1",
        data={},
        options={
            **options,
            "alarm_script": "script.music",
            "pre_script": "script.sunrise",
            "post_script": "",
            "on_snooze_script": "none",
            "on_dismiss_script": "script.lights_off",
        },
        unique_id="wecker_1",
        version=1,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    assert entry.state is ConfigEntryState.LOADED
    assert (entry.version, entry.minor_version) == (2, 2)
    assert entry.options[CONF_ALARM_ACTIONS] == [{"action": "script.music"}]
    assert entry.options[CONF_PRE_ACTIONS] == [{"action": "script.sunrise"}]
    assert entry.options[CONF_DISMISS_ACTIONS] == [{"action": "script.lights_off"}]
    assert entry.options[CONF_POST_ACTIONS] == []
    assert entry.options[CONF_SNOOZE_ACTIONS] == []
    assert entry.options[CONF_POST_TIMEOUT] == DEFAULT_POST_TIMEOUT
    for legacy in ("alarm_script", "pre_script", "post_script", "on_snooze_script", "on_dismiss_script"):
        assert legacy not in entry.options
    # Everything the entities maintain is kept.
    assert entry.options[CONF_ALARM_TIME] == options[CONF_ALARM_TIME]


def _register_script(hass: HomeAssistant, key: str, entity_id: str) -> None:
    """A script entity whose key differs from its entity ID, as after a rename."""
    registry = er.async_get(hass)
    entry = registry.async_get_or_create("script", "script", key, suggested_object_id=key)
    registry.async_update_entity(entry.entity_id, new_entity_id=entity_id)


async def test_migration_calls_scripts_by_their_key(
    hass: HomeAssistant, options: dict
) -> None:
    """A script's action is named after its key, not after its entity ID."""
    _register_script(
        hass, "wecker_alarm_schlafzimmer", "script.wecker_alarm_alexa_schlafzimmer"
    )
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Alarm 1",
        data={},
        options={**options, "alarm_script": "script.wecker_alarm_alexa_schlafzimmer"},
        version=1,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    assert entry.options[CONF_ALARM_ACTIONS] == [
        {"action": "script.wecker_alarm_schlafzimmer"}
    ]


async def test_migration_repairs_script_calls_from_beta_1(
    hass: HomeAssistant, options: dict
) -> None:
    """Entries migrated by 3.0.0-beta.1 (2.1) get the script key; edits stay."""
    _register_script(
        hass, "wecker_alarm_schlafzimmer", "script.wecker_alarm_alexa_schlafzimmer"
    )
    _register_script(hass, "coffee", "script.coffee")
    edited = [{"action": "script.wecker_alarm_alexa_schlafzimmer"}, {"delay": 5}]
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Alarm 1",
        data={},
        options={
            **options,
            CONF_ALARM_ACTIONS: [{"action": "script.wecker_alarm_alexa_schlafzimmer"}],
            CONF_POST_ACTIONS: [{"action": "script.coffee"}],
            CONF_DISMISS_ACTIONS: edited,
            CONF_PRE_ACTIONS: [],
            CONF_SNOOZE_ACTIONS: [],
        },
        version=2,
        minor_version=1,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    assert entry.minor_version == 2
    assert entry.options[CONF_ALARM_ACTIONS] == [
        {"action": "script.wecker_alarm_schlafzimmer"}
    ]
    assert entry.options[CONF_POST_ACTIONS] == [{"action": "script.coffee"}]
    assert entry.options[CONF_DISMISS_ACTIONS] == edited


async def test_migration_refuses_a_newer_version(
    hass: HomeAssistant, options: dict
) -> None:
    """An entry written by a newer release is not loaded."""
    entry = MockConfigEntry(
        domain=DOMAIN, title="Alarm 1", data={}, options=options, version=3
    )
    entry.add_to_hass(hass)
    assert not await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.MIGRATION_ERROR
