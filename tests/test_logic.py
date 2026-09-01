"""State machine tests: alarm, snooze, dismiss, post and cleanup."""

from __future__ import annotations

from datetime import timedelta
from pathlib import Path

from freezegun.api import FrozenDateTimeFactory
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
)

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util

from custom_components.alarm_clocks.const import (
    CARD_FILENAME,
    CONF_PRE_OFFSET,
    CONF_SNOOZE_DURATION,
    CARD_REGISTERED,
    CARD_URL,
    CONF_DAYS,
    CONF_ENABLED,
    CONF_POST_OFFSET,
    DOMAIN,
    EVENT_ALARM_TRIGGERED,
    EVENT_DISMISSED,
    EVENT_POST_TRIGGER,
    STATE_ARMED,
    STATE_DISABLED,
    STATE_PRE_ACTIVE,
    STATE_RINGING,
    STATE_SNOOZED,
)


async def _advance(hass: HomeAssistant, freezer: FrozenDateTimeFactory, **kwargs) -> None:
    """Advance the clock and fire the due timers."""
    freezer.tick(timedelta(**kwargs))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()


def _entity_id(hass: HomeAssistant, entry: MockConfigEntry, platform: str, key: str) -> str:
    """Resolve an entity ID via its unique_id (language independent)."""
    entity_id = er.async_get(hass).async_get_entity_id(
        platform, DOMAIN, f"{entry.entry_id}_{key}"
    )
    assert entity_id is not None, f"{platform}.{key} fehlt"
    return entity_id


async def test_entities_created(hass: HomeAssistant, setup_alarm: MockConfigEntry) -> None:
    """All expected entities are created."""
    expected = [
        ("switch", "enabled"),
        ("switch", "day_mon"),
        ("switch", "day_sun"),
        ("time", "alarm_time"),
        ("number", "snooze_duration"),
        ("number", "pre_offset"),
        ("number", "post_offset"),
        ("number", "auto_dismiss"),
        ("binary_sensor", "ringing"),
        ("sensor", "next_alarm"),
        ("sensor", "state"),
        ("sensor", "snooze_until"),
        ("button", "snooze"),
        ("button", "dismiss"),
    ]
    for platform, key in expected:
        entity_id = _entity_id(hass, setup_alarm, platform, key)
        assert hass.states.get(entity_id) is not None, entity_id


async def test_alarm_snooze_dismiss_cycle(
    hass: HomeAssistant, setup_alarm: MockConfigEntry, freezer: FrozenDateTimeFactory
) -> None:
    """Full cycle: alarm, snooze, ringing again, dismiss, post."""
    coordinator = setup_alarm.runtime_data
    events: list[str] = []

    for event_type in (EVENT_ALARM_TRIGGERED, EVENT_DISMISSED, EVENT_POST_TRIGGER):
        hass.bus.async_listen(
            event_type, lambda event: events.append(event.event_type)
        )

    await coordinator.async_trigger_alarm()
    await hass.async_block_till_done()
    assert coordinator.state == STATE_RINGING
    ringing_id = _entity_id(hass, setup_alarm, "binary_sensor", "ringing")
    assert hass.states.get(ringing_id).state == "on"

    await coordinator.async_snooze(duration=1)
    await hass.async_block_till_done()
    assert coordinator.state == STATE_SNOOZED
    assert coordinator.snooze_active is True

    await _advance(hass, freezer, minutes=1, seconds=1)
    assert coordinator.state == STATE_RINGING

    await coordinator.async_dismiss()
    await hass.async_block_till_done()
    assert coordinator.state in (STATE_ARMED,)
    assert hass.states.get(ringing_id).state == "off"

    assert EVENT_ALARM_TRIGGERED in events
    assert EVENT_DISMISSED in events
    # The fixture uses a post offset of zero, which disables the post action.
    assert EVENT_POST_TRIGGER not in events


async def test_snooze_without_alarm_is_ignored(
    hass: HomeAssistant, setup_alarm: MockConfigEntry
) -> None:
    """Snoozing without ringing is a no-op."""
    coordinator = setup_alarm.runtime_data
    await coordinator.async_snooze()
    await hass.async_block_till_done()
    assert coordinator.state == STATE_ARMED


async def test_auto_dismiss(
    hass: HomeAssistant, setup_alarm: MockConfigEntry, freezer: FrozenDateTimeFactory
) -> None:
    """Without a reaction the alarm ends after the auto dismiss period."""
    coordinator = setup_alarm.runtime_data
    await coordinator.async_trigger_alarm()
    await hass.async_block_till_done()
    assert coordinator.state == STATE_RINGING

    await _advance(hass, freezer, minutes=10, seconds=5)
    assert coordinator.state == STATE_ARMED


async def test_disable_while_ringing_dismisses(
    hass: HomeAssistant, setup_alarm: MockConfigEntry
) -> None:
    """Disabling while ringing ends the alarm (cleanup)."""
    coordinator = setup_alarm.runtime_data
    await coordinator.async_trigger_alarm()
    await hass.async_block_till_done()

    await coordinator.async_set_enabled(False)
    await hass.async_block_till_done()

    assert coordinator.runtime.ringing is False
    assert coordinator.state == STATE_DISABLED


async def test_one_shot_disables_itself(
    hass: HomeAssistant, config_entry: MockConfigEntry, freezer: FrozenDateTimeFactory
) -> None:
    """An alarm clock without weekdays disables itself after the post action."""
    config_entry.add_to_hass(hass)
    hass.config_entries.async_update_entry(
        config_entry,
        options={
            **config_entry.options,
            CONF_DAYS: [False] * 7,
            CONF_POST_OFFSET: 1,
            CONF_ENABLED: True,
        },
    )
    assert await hass.config_entries.async_setup(config_entry.entry_id)
    await hass.async_block_till_done()

    coordinator = config_entry.runtime_data
    await coordinator.async_trigger_alarm()
    await hass.async_block_till_done()
    await coordinator.async_dismiss()
    await hass.async_block_till_done()

    await _advance(hass, freezer, minutes=1, seconds=5)
    assert coordinator.config.enabled is False


async def test_next_alarm_is_scheduled(
    hass: HomeAssistant, setup_alarm: MockConfigEntry
) -> None:
    """The next alarm lies in the future and matches the configured time."""
    coordinator = setup_alarm.runtime_data
    next_alarm = coordinator.next_alarm
    assert next_alarm is not None
    assert next_alarm > dt_util.now()
    assert (next_alarm.hour, next_alarm.minute) == (7, 0)
    assert next_alarm.weekday() < 5


async def test_services_registered(hass: HomeAssistant, setup_alarm: MockConfigEntry) -> None:
    """All services of the integration are registered."""
    for service in ("snooze", "dismiss", "trigger_alarm", "set_alarm"):
        assert hass.services.has_service(DOMAIN, service)


async def test_restart_resumes_snooze(
    hass: HomeAssistant, setup_alarm: MockConfigEntry, freezer: FrozenDateTimeFactory
) -> None:
    """A snooze survives a restart and rings afterwards."""
    coordinator = setup_alarm.runtime_data
    await coordinator.async_trigger_alarm()
    await hass.async_block_till_done()
    await coordinator.async_snooze(duration=5)
    await hass.async_block_till_done()
    assert coordinator.state == STATE_SNOOZED

    # "Restart": unload the entry, let time pass, load the entry again.
    assert await hass.config_entries.async_unload(setup_alarm.entry_id)
    await hass.async_block_till_done()

    freezer.tick(timedelta(minutes=6))
    assert await hass.config_entries.async_setup(setup_alarm.entry_id)
    await hass.async_block_till_done()

    assert setup_alarm.runtime_data.state == STATE_RINGING


async def test_card_is_registered(
    hass: HomeAssistant, setup_alarm: MockConfigEntry
) -> None:
    """The bundled Lovelace card is registered and served.

    The registered URL is checked instead of performing an HTTP request,
    because serving static files leaves a thread behind in the aiohttp test
    server that makes the cleanup check of the test framework fail.
    """
    assert hass.data[DOMAIN][CARD_REGISTERED] is True

    resources = hass.data["lovelace"]
    resources = (
        resources.get("resources")
        if isinstance(resources, dict)
        else resources.resources
    )
    urls = [item["url"] for item in resources.async_items()]
    assert any(url.startswith(CARD_URL) for url in urls), urls

    assert (
        Path(__file__).parents[1]
        / "custom_components"
        / "alarm_clocks"
        / "frontend"
        / CARD_FILENAME
    ).is_file()


async def test_pre_phase_sets_state(
    hass: HomeAssistant, config_entry: MockConfigEntry, freezer: FrozenDateTimeFactory
) -> None:
    """The pre phase before the alarm has its own state."""
    config_entry.add_to_hass(hass)
    hass.config_entries.async_update_entry(
        config_entry, options={**config_entry.options, CONF_PRE_OFFSET: 30}
    )
    assert await hass.config_entries.async_setup(config_entry.entry_id)
    await hass.async_block_till_done()

    coordinator = config_entry.runtime_data
    assert coordinator.state == STATE_ARMED

    next_alarm = coordinator.next_alarm
    assert next_alarm is not None

    # Jump to just after the start of the pre phase.
    freezer.move_to(next_alarm - timedelta(minutes=29, seconds=59))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert coordinator.state == STATE_PRE_ACTIVE

    # The pre phase ends when the alarm rings.
    freezer.move_to(next_alarm + timedelta(seconds=5))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert coordinator.state == STATE_RINGING
    assert coordinator.runtime.pre_until is None


async def test_snooze_duration_zero_disables_snoozing(
    hass: HomeAssistant, config_entry: MockConfigEntry
) -> None:
    """A snooze duration of zero switches snoozing off."""
    config_entry.add_to_hass(hass)
    hass.config_entries.async_update_entry(
        config_entry, options={**config_entry.options, CONF_SNOOZE_DURATION: 0}
    )
    assert await hass.config_entries.async_setup(config_entry.entry_id)
    await hass.async_block_till_done()

    coordinator = config_entry.runtime_data
    await coordinator.async_trigger_alarm()
    await hass.async_block_till_done()

    await coordinator.async_snooze()
    await hass.async_block_till_done()
    assert coordinator.state == STATE_RINGING

    button_id = _entity_id(hass, config_entry, "button", "snooze")
    assert hass.states.get(button_id).state == "unavailable"


async def test_post_offset_zero_still_disables_one_shot(
    hass: HomeAssistant, config_entry: MockConfigEntry
) -> None:
    """Without a post action a one-shot alarm still disables itself."""
    config_entry.add_to_hass(hass)
    hass.config_entries.async_update_entry(
        config_entry,
        options={**config_entry.options, CONF_DAYS: [False] * 7, CONF_POST_OFFSET: 0},
    )
    assert await hass.config_entries.async_setup(config_entry.entry_id)
    await hass.async_block_till_done()

    coordinator = config_entry.runtime_data
    await coordinator.async_trigger_alarm()
    await hass.async_block_till_done()
    await coordinator.async_dismiss()
    await hass.async_block_till_done()

    assert coordinator.config.enabled is False
