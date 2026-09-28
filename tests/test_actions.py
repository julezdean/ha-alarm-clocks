"""Action sequences: when they run, when they stop, and what they end."""

from __future__ import annotations

import asyncio
from collections.abc import Callable
from datetime import timedelta
from typing import Any

import pytest
from freezegun.api import FrozenDateTimeFactory
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
)

from homeassistant.core import Event, HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.setup import async_setup_component
from homeassistant.util import dt as dt_util

from custom_components.alarm_clocks.const import (
    CONF_ALARM_ACTIONS,
    CONF_DAYS,
    CONF_DISMISS_ACTIONS,
    CONF_POST_ACTIONS,
    CONF_POST_OFFSET,
    CONF_POST_TIMEOUT,
    CONF_PRE_ACTIONS,
    CONF_PRE_OFFSET,
    DOMAIN,
    EVENT_ALARM_TRIGGERED,
    EVENT_DISMISSED,
    STATE_ARMED,
    STATE_DISABLED,
    STATE_POST_ACTIVE,
    STATE_POST_PENDING,
    STATE_PRE_ACTIVE,
    STATE_RINGING,
    STATE_SNOOZED,
)


def _long(name: str) -> list[dict[str, Any]]:
    """A sequence that announces its start, waits, and announces its end.

    It waits for an event the test fires (see _release) rather than for a
    delay: the frozen clock of these tests also stops the event loop's clock,
    which Home Assistant's timers get around but a delay does not.
    """
    return [
        {"event": f"{name}_started"},
        {"wait_for_trigger": [{"trigger": "event", "event_type": f"{name}_release"}]},
        {"event": f"{name}_finished"},
    ]


async def _release(hass: HomeAssistant, name: str) -> None:
    """Let a sequence built by _long finish.

    The sequence runs in a background task, which async_block_till_done only
    waits for when asked to; every other sequence must have ended by then.
    """
    hass.bus.async_fire(f"{name}_release")
    await hass.async_block_till_done(wait_background_tasks=True)


@pytest.fixture(autouse=True)
def fixed_clock(freezer: FrozenDateTimeFactory) -> None:
    """Monday noon, clear of every phase around the 07:00 alarm (see test_logic)."""
    freezer.move_to("2026-01-05 12:00:00-08:00")


async def _advance(hass: HomeAssistant, freezer: FrozenDateTimeFactory, **kwargs) -> None:
    """Advance the clock and fire the due timers and delays."""
    freezer.tick(timedelta(**kwargs))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()


async def _setup(
    hass: HomeAssistant, entry: MockConfigEntry, **options: Any
) -> MockConfigEntry:
    """Set up the alarm clock with changed options."""
    entry.add_to_hass(hass)
    hass.config_entries.async_update_entry(entry, options={**entry.options, **options})
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


def _record(hass: HomeAssistant, *event_types: str) -> list[Event]:
    """Collect the events of the given types."""
    events: list[Event] = []
    for event_type in event_types:
        hass.bus.async_listen(event_type, events.append)
    return events


async def _until(condition: Callable[[], bool]) -> None:
    """Let the loop run background tasks until the condition holds.

    For sequences that never end, which async_block_till_done would wait for
    forever. A fixed number of loop turns was not enough on a slower CI
    runner, so this waits for the condition itself; the assertion after it
    still fails if it never comes. asyncio.sleep with a duration never
    returns under the frozen clock, hence the zero-length turns.
    """
    for _ in range(1000):
        if condition():
            return
        await asyncio.sleep(0)


async def _to_pre_phase(
    hass: HomeAssistant, entry: MockConfigEntry, freezer, minutes_before: int | None = None
) -> None:
    """Move the clock into the pre phase, by default one minute after its start."""
    coordinator = entry.runtime_data
    next_alarm = coordinator.next_alarm
    if minutes_before is None:
        minutes_before = coordinator.config.pre_offset - 1
    freezer.move_to(next_alarm - timedelta(minutes=minutes_before))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert coordinator.state == STATE_PRE_ACTIVE


async def _ring_and_dismiss(hass: HomeAssistant, entry: MockConfigEntry) -> None:
    coordinator = entry.runtime_data
    await coordinator.async_trigger_alarm()
    await hass.async_block_till_done()
    await coordinator.async_dismiss()
    await hass.async_block_till_done()


async def test_actions_get_event_data_as_variables(
    hass: HomeAssistant, config_entry: MockConfigEntry
) -> None:
    """The sequence sees the event data plus the phase, in the event's context."""
    entry = await _setup(
        hass,
        config_entry,
        **{
            CONF_ALARM_ACTIONS: [
                {
                    "event": "seen",
                    "event_data": {
                        "phase": "{{ phase }}",
                        "source": "{{ source }}",
                        "name": "{{ name }}",
                        "device_id": "{{ device_id }}",
                        "entry_id": "{{ entry_id }}",
                    },
                }
            ]
        },
    )
    triggered = _record(hass, EVENT_ALARM_TRIGGERED)
    seen = _record(hass, "seen")

    await entry.runtime_data.async_trigger_alarm()
    await hass.async_block_till_done()

    assert len(seen) == 1
    assert seen[0].data == {
        "phase": "alarm",
        "source": "manual",
        "name": "Alarm 1",
        "device_id": entry.runtime_data.device_id,
        "entry_id": entry.entry_id,
    }
    assert seen[0].context.id == triggered[0].context.id


async def test_alarm_actions_stop_on_snooze_and_dismiss(
    hass: HomeAssistant, config_entry: MockConfigEntry, freezer: FrozenDateTimeFactory
) -> None:
    """The alarm sequence runs only while ringing."""
    entry = await _setup(hass, config_entry, **{CONF_ALARM_ACTIONS: _long("alarm")})
    coordinator = entry.runtime_data
    events = _record(hass, "alarm_started", "alarm_finished")

    await coordinator.async_trigger_alarm()
    await hass.async_block_till_done()
    assert coordinator._actions.is_running("alarm")

    await coordinator.async_snooze(duration=1)
    await hass.async_block_till_done()
    assert coordinator.state == STATE_SNOOZED
    assert not coordinator._actions.is_running("alarm")

    # The end of the snooze rings again and starts the sequence over.
    await _advance(hass, freezer, minutes=1, seconds=1)
    assert coordinator.state == STATE_RINGING
    assert coordinator._actions.is_running("alarm")

    await coordinator.async_dismiss()
    await hass.async_block_till_done()
    assert not coordinator._actions.is_running("alarm")

    await _release(hass, "alarm")
    assert [event.event_type for event in events] == ["alarm_started", "alarm_started"]


async def test_stopping_the_alarm_actions_stops_a_directly_called_script(
    hass: HomeAssistant, config_entry: MockConfigEntry
) -> None:
    """What the migration relies on: a direct script call stops with the sequence."""
    assert await async_setup_component(
        hass,
        "script",
        {"script": {"music": {"sequence": _long("music")}}},
    )
    entry = await _setup(
        hass, config_entry, **{CONF_ALARM_ACTIONS: [{"action": "script.music"}]}
    )

    # The blocking script call is a task async_block_till_done would wait for
    # until the script ends, so the loop only gets to run for a moment.
    await entry.runtime_data.async_trigger_alarm()
    await _until(lambda: hass.states.get("script.music").state == "on")
    assert hass.states.get("script.music").state == "on"

    await entry.runtime_data.async_dismiss()
    await _until(lambda: hass.states.get("script.music").state == "off")
    assert hass.states.get("script.music").state == "off"


async def test_a_directly_called_script_holds_up_the_steps_after_it(
    hass: HomeAssistant, config_entry: MockConfigEntry
) -> None:
    """A direct call waits for the script, so what follows it runs only after."""
    assert await async_setup_component(
        hass, "script", {"script": {"music": {"sequence": _long("music")}}}
    )
    entry = await _setup(
        hass,
        config_entry,
        **{CONF_ALARM_ACTIONS: [{"action": "script.music"}, {"event": "lights_on"}]},
    )
    lights = _record(hass, "lights_on")

    await entry.runtime_data.async_trigger_alarm()
    await _until(lambda: hass.states.get("script.music").state == "on")
    assert lights == []

    hass.bus.async_fire("music_release")
    await _until(lambda: len(lights) == 1)
    assert len(lights) == 1


async def test_a_script_in_a_parallel_block_runs_alongside_and_still_stops(
    hass: HomeAssistant, config_entry: MockConfigEntry
) -> None:
    """parallel lets the other steps run at once and keeps the stop on snooze."""
    assert await async_setup_component(
        hass, "script", {"script": {"music": {"sequence": _long("music")}}}
    )
    entry = await _setup(
        hass,
        config_entry,
        **{
            CONF_ALARM_ACTIONS: [
                {"parallel": [{"action": "script.music"}, {"event": "lights_on"}]}
            ]
        },
    )
    lights = _record(hass, "lights_on")

    await entry.runtime_data.async_trigger_alarm()
    await _until(lambda: hass.states.get("script.music").state == "on" and lights)
    assert hass.states.get("script.music").state == "on"
    assert len(lights) == 1

    await entry.runtime_data.async_snooze(duration=5)
    await _until(lambda: hass.states.get("script.music").state == "off")
    assert hass.states.get("script.music").state == "off"


async def test_migrated_script_with_a_renamed_entity_runs_and_stops(
    hass: HomeAssistant, options: dict[str, Any]
) -> None:
    """A 2.x script assignment keeps working when key and entity ID differ.

    The case that broke in 3.0.0-beta.1: the script's key is
    wecker_alarm_schlafzimmer, its entity ID was renamed, and the action
    named after the entity ID did not exist.
    """
    assert await async_setup_component(
        hass,
        "script",
        {"script": {"wecker_alarm_schlafzimmer": {"sequence": _long("music")}}},
    )
    er.async_get(hass).async_update_entity(
        "script.wecker_alarm_schlafzimmer",
        new_entity_id="script.wecker_alarm_alexa_schlafzimmer",
    )
    await hass.async_block_till_done()
    entity_id = "script.wecker_alarm_alexa_schlafzimmer"

    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Alarm 1",
        data={},
        options={**options, "alarm_script": entity_id},
        version=1,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    await entry.runtime_data.async_trigger_alarm()
    await _until(lambda: hass.states.get(entity_id).state == "on")
    assert hass.states.get(entity_id).state == "on"

    await entry.runtime_data.async_dismiss()
    await _until(lambda: hass.states.get(entity_id).state == "off")
    assert hass.states.get(entity_id).state == "off"


async def test_stopping_the_alarm_actions_leaves_a_turned_on_script_running(
    hass: HomeAssistant, config_entry: MockConfigEntry
) -> None:
    """The counterpart the docs warn about: script.turn_on detaches the script."""
    assert await async_setup_component(
        hass,
        "script",
        {"script": {"music": {"sequence": _long("music")}}},
    )
    entry = await _setup(
        hass,
        config_entry,
        **{
            CONF_ALARM_ACTIONS: [
                {"action": "script.turn_on", "target": {"entity_id": "script.music"}},
                {"wait_for_trigger": [{"trigger": "event", "event_type": "never"}]},
            ]
        },
    )

    await entry.runtime_data.async_trigger_alarm()
    await _until(lambda: hass.states.get("script.music").state == "on")
    assert hass.states.get("script.music").state == "on"

    # Waiting for the script to stay on would hold at once; wait for the stop.
    await entry.runtime_data.async_dismiss()
    await _until(lambda: not entry.runtime_data._actions.is_running("alarm"))
    assert not entry.runtime_data._actions.is_running("alarm")
    assert hass.states.get("script.music").state == "on"

    await hass.services.async_call(
        "script", "turn_off", {"entity_id": "script.music"}, blocking=True
    )


async def test_ringing_actions_survive_an_options_change(
    hass: HomeAssistant, config_entry: MockConfigEntry
) -> None:
    """Changing a weekday while ringing keeps the hold on the running sequence."""
    entry = await _setup(hass, config_entry, **{CONF_ALARM_ACTIONS: _long("alarm")})
    coordinator = entry.runtime_data

    await coordinator.async_trigger_alarm()
    await hass.async_block_till_done()
    await coordinator.async_set_day(6, True)
    await hass.async_block_till_done()
    assert coordinator._actions.is_running("alarm")

    await coordinator.async_dismiss()
    await hass.async_block_till_done()
    assert not coordinator._actions.is_running("alarm")


async def test_pre_actions_outlast_the_alarm(
    hass: HomeAssistant, config_entry: MockConfigEntry, freezer: FrozenDateTimeFactory
) -> None:
    """The pre sequence keeps running through ringing and dismiss."""
    entry = await _setup(
        hass,
        config_entry,
        **{CONF_PRE_OFFSET: 30, CONF_PRE_ACTIONS: _long("pre")},
    )
    coordinator = entry.runtime_data
    await _to_pre_phase(hass, entry, freezer)
    assert coordinator._actions.is_running("pre")

    await _advance(hass, freezer, minutes=30)
    assert coordinator.state == STATE_RINGING
    assert coordinator._actions.is_running("pre")

    await coordinator.async_dismiss()
    await hass.async_block_till_done()
    assert coordinator._actions.is_running("pre")


async def test_switching_off_during_pre_phase_stops_it(
    hass: HomeAssistant, config_entry: MockConfigEntry, freezer: FrozenDateTimeFactory
) -> None:
    """Switching off ends the pre phase, stops its actions, and closes the cycle."""
    entry = await _setup(
        hass, config_entry, **{CONF_PRE_OFFSET: 30, CONF_PRE_ACTIONS: _long("pre")}
    )
    coordinator = entry.runtime_data
    await _to_pre_phase(hass, entry, freezer)
    dismissed = _record(hass, EVENT_DISMISSED)

    await coordinator.async_set_enabled(False)
    await hass.async_block_till_done()

    assert coordinator.state == STATE_DISABLED
    assert coordinator.runtime.pre_until is None
    assert not coordinator._actions.is_running("pre")
    assert [event.data["source"] for event in dismissed] == ["cleanup"]


async def test_switching_off_while_ringing_still_dismisses(
    hass: HomeAssistant, config_entry: MockConfigEntry, freezer: FrozenDateTimeFactory
) -> None:
    """Dismiss actions run, the post phase does not, the snooze stops."""
    entry = await _setup(
        hass,
        config_entry,
        **{
            CONF_POST_OFFSET: 5,
            CONF_ALARM_ACTIONS: _long("alarm"),
            CONF_DISMISS_ACTIONS: [{"event": "lights_off"}],
            CONF_POST_ACTIONS: [{"event": "coffee"}],
        },
    )
    coordinator = entry.runtime_data
    events = _record(hass, EVENT_DISMISSED, "lights_off", "coffee")

    await coordinator.async_trigger_alarm()
    await hass.async_block_till_done()
    await coordinator.async_set_enabled(False)
    await hass.async_block_till_done()

    assert coordinator.state == STATE_DISABLED
    assert not coordinator._actions.is_running("alarm")
    assert coordinator.runtime.post_due_at is None
    assert [event.event_type for event in events] == [EVENT_DISMISSED, "lights_off"]
    assert events[0].data["source"] == "cleanup"

    await _advance(hass, freezer, minutes=6)
    assert "coffee" not in [event.event_type for event in events]


async def test_post_phase_lasts_until_its_actions_are_done(
    hass: HomeAssistant, config_entry: MockConfigEntry, freezer: FrozenDateTimeFactory
) -> None:
    """post_pending until the post delay, post_active until the actions end."""
    entry = await _setup(
        hass,
        config_entry,
        **{CONF_POST_OFFSET: 1, CONF_POST_ACTIONS: _long("post")},
    )
    coordinator = entry.runtime_data
    post_due_id = er.async_get(hass).async_get_entity_id(
        "sensor", DOMAIN, f"{entry.entry_id}_post_due"
    )

    await _ring_and_dismiss(hass, entry)
    assert coordinator.state == STATE_POST_PENDING
    due = coordinator.runtime.post_due_at
    assert due is not None
    assert dt_util.parse_datetime(hass.states.get(post_due_id).state) == due.replace(
        microsecond=0
    )

    await _advance(hass, freezer, minutes=1, seconds=1)
    assert coordinator.state == STATE_POST_ACTIVE
    assert hass.states.get(post_due_id).state == "unknown"

    await _advance(hass, freezer, minutes=5)
    assert coordinator.state == STATE_POST_ACTIVE

    await _release(hass, "post")
    assert coordinator.state == STATE_ARMED
    assert coordinator.runtime.post_active is False


async def test_one_shot_switches_off_after_its_post_actions(
    hass: HomeAssistant, config_entry: MockConfigEntry, freezer: FrozenDateTimeFactory
) -> None:
    """A one-shot alarm stays on through its post actions, but cannot ring again."""
    entry = await _setup(
        hass,
        config_entry,
        **{
            CONF_DAYS: [False] * 7,
            CONF_POST_OFFSET: 1,
            CONF_POST_ACTIONS: _long("post"),
        },
    )
    coordinator = entry.runtime_data
    finished = _record(hass, "post_finished")

    await _ring_and_dismiss(hass, entry)
    assert coordinator.next_alarm is None

    await _advance(hass, freezer, minutes=1, seconds=1)
    assert coordinator.state == STATE_POST_ACTIVE
    assert coordinator.config.enabled is True
    assert coordinator.next_alarm is None

    await _release(hass, "post")
    assert len(finished) == 1
    assert coordinator.config.enabled is False
    assert coordinator.state == STATE_DISABLED


async def test_post_time_limit_stops_the_actions(
    hass: HomeAssistant, config_entry: MockConfigEntry, freezer: FrozenDateTimeFactory
) -> None:
    """Post actions that run into the limit are stopped and the cycle ends."""
    entry = await _setup(
        hass,
        config_entry,
        **{
            CONF_DAYS: [False] * 7,
            CONF_POST_OFFSET: 1,
            CONF_POST_TIMEOUT: 2,
            CONF_POST_ACTIONS: _long("post"),
        },
    )
    coordinator = entry.runtime_data
    finished = _record(hass, "post_finished")

    await _ring_and_dismiss(hass, entry)
    await _advance(hass, freezer, minutes=1, seconds=1)
    assert coordinator.state == STATE_POST_ACTIVE

    await _advance(hass, freezer, minutes=2)
    assert not coordinator._actions.is_running("post")
    assert coordinator.config.enabled is False

    await _release(hass, "post")
    assert finished == []


async def test_switching_off_during_post_phase_stops_it_without_event(
    hass: HomeAssistant, config_entry: MockConfigEntry, freezer: FrozenDateTimeFactory
) -> None:
    """The cycle was dismissed already; switching off does not dismiss it twice."""
    entry = await _setup(
        hass,
        config_entry,
        **{CONF_POST_OFFSET: 1, CONF_POST_ACTIONS: _long("post")},
    )
    coordinator = entry.runtime_data
    await _ring_and_dismiss(hass, entry)
    await _advance(hass, freezer, minutes=1, seconds=1)
    assert coordinator.state == STATE_POST_ACTIVE
    dismissed = _record(hass, EVENT_DISMISSED)

    await coordinator.async_set_enabled(False)
    await hass.async_block_till_done()

    assert coordinator.state == STATE_DISABLED
    assert not coordinator._actions.is_running("post")
    assert coordinator.runtime.post_active is False
    assert dismissed == []


async def test_restart_during_post_phase_finishes_one_shot(
    hass: HomeAssistant, config_entry: MockConfigEntry, freezer: FrozenDateTimeFactory
) -> None:
    """Cut short by a restart, the post actions are not repeated; the cycle ends."""
    entry = await _setup(
        hass,
        config_entry,
        **{
            CONF_DAYS: [False] * 7,
            CONF_POST_OFFSET: 1,
            CONF_POST_ACTIONS: _long("post"),
        },
    )
    started = _record(hass, "post_started")
    await _ring_and_dismiss(hass, entry)
    await _advance(hass, freezer, minutes=1, seconds=1)
    assert entry.runtime_data.state == STATE_POST_ACTIVE

    assert await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    assert entry.runtime_data.config.enabled is False
    assert entry.runtime_data.runtime.post_active is False
    assert len(started) == 1


async def test_moving_the_alarm_inside_the_pre_window_keeps_the_pre_phase(
    hass: HomeAssistant, config_entry: MockConfigEntry, freezer: FrozenDateTimeFactory
) -> None:
    """New pre start already passed: the pre phase follows the new alarm time."""
    entry = await _setup(
        hass, config_entry, **{CONF_PRE_OFFSET: 20, CONF_PRE_ACTIONS: _long("pre")}
    )
    coordinator = entry.runtime_data
    alarm = coordinator.next_alarm
    await _to_pre_phase(hass, entry, freezer, minutes_before=10)  # 06:50
    started = _record(hass, "pre_started")

    # 07:05 has its pre start at 06:45, already passed.
    await coordinator.async_set_alarm(alarm_time=(alarm + timedelta(minutes=5)).time())
    await hass.async_block_till_done()

    assert coordinator.state == STATE_PRE_ACTIVE
    assert coordinator.runtime.pre_until == alarm + timedelta(minutes=5)
    assert coordinator._actions.is_running("pre")
    assert started == []


async def test_moving_the_alarm_past_the_pre_window_starts_it_over(
    hass: HomeAssistant, config_entry: MockConfigEntry, freezer: FrozenDateTimeFactory
) -> None:
    """New pre start still ahead: the pre phase ends and starts again then."""
    entry = await _setup(
        hass, config_entry, **{CONF_PRE_OFFSET: 20, CONF_PRE_ACTIONS: _long("pre")}
    )
    coordinator = entry.runtime_data
    alarm = coordinator.next_alarm
    await _to_pre_phase(hass, entry, freezer)  # 06:41
    started = _record(hass, "pre_started")

    # 07:30 has its pre start at 07:10, still ahead.
    await coordinator.async_set_alarm(alarm_time=(alarm + timedelta(minutes=30)).time())
    await hass.async_block_till_done()

    assert coordinator.state == STATE_ARMED
    assert coordinator.runtime.pre_until is None
    # Ending the phase does not stop its actions.
    assert coordinator._actions.is_running("pre")

    # Let that run end first. Otherwise the new pre start has to stop it
    # before its own run begins, which takes a varying number of loop turns
    # and made this test fail on CI while it passed locally.
    await _release(hass, "pre")

    await _advance(hass, freezer, minutes=30)  # 07:11, past the new pre start
    await _until(lambda: len(started) == 1)
    assert coordinator.state == STATE_PRE_ACTIVE
    assert len(started) == 1
