"""The built-in ringtone: when it plays, when it stops, and what it restores."""

from __future__ import annotations

from datetime import timedelta
from typing import Any

import pytest
from freezegun.api import FrozenDateTimeFactory
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
    async_mock_service,
)

from homeassistant.core import Event, HomeAssistant, ServiceCall, callback
from homeassistant.core_config import async_process_ha_core_config

from custom_components.alarm_clocks.const import (
    CONF_MEDIA_PLAYER,
    CONF_RINGTONE,
    CONF_VOLUME,
)

PLAYER = "media_player.bedroom"
BASE_URL = "http://ha.local:8123"


@pytest.fixture(autouse=True)
def fixed_clock(freezer: FrozenDateTimeFactory) -> None:
    """Monday noon, clear of every phase around the 07:00 alarm (see test_logic)."""
    freezer.move_to("2026-01-05 12:00:00-08:00")


@pytest.fixture
def options(options: dict[str, Any]) -> dict[str, Any]:
    """The default alarm clock, ringing on the bedroom speaker at 50 %."""
    return {
        **options,
        CONF_MEDIA_PLAYER: PLAYER,
        CONF_RINGTONE: "chime",
        CONF_VOLUME: 50,
    }


@pytest.fixture
async def calls(hass: HomeAssistant) -> list[ServiceCall]:
    """Every media player call, in order, against a player at 30 % volume."""
    await async_process_ha_core_config(hass, {"internal_url": BASE_URL})
    hass.states.async_set(PLAYER, "idle", {"volume_level": 0.3})
    recorded: list[ServiceCall] = []
    for service in ("play_media", "media_stop", "volume_set"):
        async_mock_service(hass, "media_player", service)

    # A callback, so that a call is recorded the moment it is made and a
    # clear() in a test cannot race a recording still on its way.
    @callback
    def _record(event: Event) -> None:
        if event.data["domain"] == "media_player":
            recorded.append(event.data)

    hass.bus.async_listen("call_service", _record)
    return recorded


def _summary(calls: list[Any]) -> list[tuple[str, Any]]:
    """Each call as (service, the value that matters)."""
    out = []
    for call in calls:
        data = call["service_data"]
        assert data["entity_id"] == PLAYER
        if call["service"] == "volume_set":
            out.append(("volume_set", data["volume_level"]))
        elif call["service"] == "play_media":
            out.append(("play_media", data["media_content_id"].split("?", 1)[0]))
        else:
            out.append((call["service"], None))
    return out


PLAY = ("play_media", f"{BASE_URL}/alarm_clocks/sounds/chime.wav")


async def _advance(hass: HomeAssistant, freezer: FrozenDateTimeFactory, **kwargs) -> None:
    freezer.tick(timedelta(**kwargs))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()


async def test_rings_at_its_own_volume(
    hass: HomeAssistant, calls: list[Any], setup_alarm: MockConfigEntry
) -> None:
    """Ringing sets the volume first, then plays the chosen tone."""
    await setup_alarm.runtime_data.async_trigger_alarm()
    await hass.async_block_till_done()

    assert _summary(calls) == [("volume_set", 0.5), PLAY]


@pytest.mark.parametrize("end", ["snooze", "dismiss", "switch_off"])
async def test_every_end_of_ringing_stops_and_restores(
    hass: HomeAssistant, calls: list[Any], setup_alarm: MockConfigEntry, end: str
) -> None:
    """Snooze, dismiss and switching off each stop the tone and restore 30 %."""
    coordinator = setup_alarm.runtime_data
    await coordinator.async_trigger_alarm()
    calls.clear()

    if end == "snooze":
        await coordinator.async_snooze()
    elif end == "dismiss":
        await coordinator.async_dismiss()
    else:
        await coordinator.async_set_enabled(False)
    await hass.async_block_till_done()

    assert _summary(calls) == [("media_stop", None), ("volume_set", 0.3)]
    assert coordinator.runtime.sound_restore_volume is None


async def test_auto_dismiss_stops(
    hass: HomeAssistant,
    freezer: FrozenDateTimeFactory,
    calls: list[Any],
    setup_alarm: MockConfigEntry,
) -> None:
    """The automatic dismiss stops the tone like a manual one."""
    await setup_alarm.runtime_data.async_trigger_alarm()
    calls.clear()

    await _advance(hass, freezer, minutes=10, seconds=1)

    assert _summary(calls) == [("media_stop", None), ("volume_set", 0.3)]


async def test_snooze_end_rings_again(
    hass: HomeAssistant,
    freezer: FrozenDateTimeFactory,
    calls: list[Any],
    setup_alarm: MockConfigEntry,
) -> None:
    """After the snooze the tone starts over, from the restored volume."""
    coordinator = setup_alarm.runtime_data
    await coordinator.async_trigger_alarm()
    await coordinator.async_snooze()
    calls.clear()

    await _advance(hass, freezer, minutes=9, seconds=1)

    assert _summary(calls) == [("volume_set", 0.5), PLAY]
    assert coordinator.runtime.sound_restore_volume == 0.3


async def test_plays_again_when_finished(
    hass: HomeAssistant, calls: list[Any], setup_alarm: MockConfigEntry
) -> None:
    """The tone loops while ringing, and stops looping with the dismiss."""
    coordinator = setup_alarm.runtime_data
    await coordinator.async_trigger_alarm()
    calls.clear()

    hass.states.async_set(PLAYER, "playing", {"volume_level": 0.5})
    hass.states.async_set(PLAYER, "idle", {"volume_level": 0.5})
    await hass.async_block_till_done()
    assert _summary(calls) == [PLAY]

    await coordinator.async_dismiss()
    calls.clear()
    hass.states.async_set(PLAYER, "playing", {"volume_level": 0.3})
    hass.states.async_set(PLAYER, "idle", {"volume_level": 0.3})
    await hass.async_block_till_done()
    assert calls == []


async def test_switched_off_player_is_left_alone(
    hass: HomeAssistant, calls: list[Any], setup_alarm: MockConfigEntry
) -> None:
    """Turning the speaker off is deliberate: the tone does not come back."""
    await setup_alarm.runtime_data.async_trigger_alarm()
    calls.clear()

    hass.states.async_set(PLAYER, "playing", {"volume_level": 0.5})
    hass.states.async_set(PLAYER, "off")
    await hass.async_block_till_done()

    assert calls == []


async def test_tone_replacing_music_still_loops(
    hass: HomeAssistant, calls: list[Any], setup_alarm: MockConfigEntry
) -> None:
    """A player that goes from music to the tone without leaving playing still loops."""
    hass.states.async_set(PLAYER, "playing", {"volume_level": 0.3})
    await setup_alarm.runtime_data.async_trigger_alarm()
    calls.clear()

    hass.states.async_set(PLAYER, "idle", {"volume_level": 0.5})
    await hass.async_block_till_done()
    assert _summary(calls) == [PLAY]


async def test_music_ending_during_the_start_is_not_the_tone(
    hass: HomeAssistant, calls: list[Any], setup_alarm: MockConfigEntry
) -> None:
    """The music stopping for the tone is not the tone finishing."""
    hass.states.async_set(PLAYER, "playing", {"volume_level": 0.3})

    @callback
    def _stop_the_music(_call: ServiceCall) -> None:
        # The player drops what it was playing, the tone not loaded yet.
        hass.states.async_set(PLAYER, "idle", {"volume_level": 0.5})

    hass.services.async_register("media_player", "play_media", _stop_the_music)
    await setup_alarm.runtime_data.async_trigger_alarm()
    await hass.async_block_till_done()

    assert _summary(calls) == [("volume_set", 0.5), PLAY]


async def test_no_player_no_sound(
    hass: HomeAssistant, calls: list[Any], setup_alarm: MockConfigEntry
) -> None:
    """Without a media player the alarm is silent, as before."""
    coordinator = setup_alarm.runtime_data
    await coordinator.async_set_options(**{CONF_MEDIA_PLAYER: None})
    await coordinator.async_trigger_alarm()
    assert coordinator.runtime.ringing
    await coordinator.async_dismiss()
    await hass.async_block_till_done()

    assert calls == []


async def test_volume_zero_leaves_the_volume_alone(
    hass: HomeAssistant, calls: list[Any], setup_alarm: MockConfigEntry
) -> None:
    """A volume of zero neither sets nor restores one."""
    coordinator = setup_alarm.runtime_data
    await coordinator.async_set_options(**{CONF_VOLUME: 0})
    await coordinator.async_trigger_alarm()
    await coordinator.async_dismiss()
    await hass.async_block_till_done()

    assert _summary(calls) == [PLAY, ("media_stop", None)]


async def test_restart_while_ringing_restores_the_original_volume(
    hass: HomeAssistant, calls: list[Any], setup_alarm: MockConfigEntry
) -> None:
    """After a restart the player has the alarm's volume, which is not restored."""
    await setup_alarm.runtime_data.async_trigger_alarm()
    hass.states.async_set(PLAYER, "idle", {"volume_level": 0.5})

    assert await hass.config_entries.async_reload(setup_alarm.entry_id)
    await hass.async_block_till_done()
    coordinator = setup_alarm.runtime_data
    assert coordinator.runtime.ringing
    calls.clear()

    await coordinator.async_dismiss()
    await hass.async_block_till_done()
    assert _summary(calls) == [("media_stop", None), ("volume_set", 0.3)]


async def test_unreachable_player_does_not_block_the_alarm(
    hass: HomeAssistant, setup_alarm: MockConfigEntry
) -> None:
    """Without any media player service the alarm still rings and ends."""
    await async_process_ha_core_config(hass, {"internal_url": BASE_URL})
    coordinator = setup_alarm.runtime_data
    await coordinator.async_trigger_alarm()
    assert coordinator.runtime.ringing
    await coordinator.async_dismiss()
    assert not coordinator.runtime.ringing


async def test_selects(
    hass: HomeAssistant, calls: list[Any], setup_alarm: MockConfigEntry
) -> None:
    """The selects show and change the player and the tone."""
    player = hass.states.get("select.alarm_1_media_player")
    assert player.state == PLAYER
    assert player.attributes["options"] == ["none", PLAYER]
    assert hass.states.get("select.alarm_1_ringtone").state == "chime"
    assert hass.states.get("number.alarm_1_volume").state == "50.0"

    hass.states.async_set("media_player.kitchen", "idle")
    await hass.async_block_till_done()
    assert hass.states.get("select.alarm_1_media_player").attributes["options"] == [
        "none",
        PLAYER,
        "media_player.kitchen",
    ]

    for entity_id, option in (
        ("select.alarm_1_media_player", "media_player.kitchen"),
        ("select.alarm_1_ringtone", "classic"),
    ):
        await hass.services.async_call(
            "select",
            "select_option",
            {"entity_id": entity_id, "option": option},
            blocking=True,
        )
    config = setup_alarm.runtime_data.config
    assert (config.media_player, config.ringtone) == ("media_player.kitchen", "classic")

    await hass.services.async_call(
        "select",
        "select_option",
        {"entity_id": "select.alarm_1_media_player", "option": "none"},
        blocking=True,
    )
    assert setup_alarm.runtime_data.config.media_player is None
    assert hass.states.get("select.alarm_1_media_player").state == "none"


async def test_missing_player_stays_selected(
    hass: HomeAssistant, setup_alarm: MockConfigEntry
) -> None:
    """A chosen player that is gone is still shown rather than unknown."""
    state = hass.states.get("select.alarm_1_media_player")
    assert state.state == PLAYER
    assert PLAYER in state.attributes["options"]


async def test_ringtones_are_served(
    hass: HomeAssistant, hass_client_no_auth, setup_alarm: MockConfigEntry
) -> None:
    """Every ringtone is reachable without authentication, as a speaker fetches it."""
    from custom_components.alarm_clocks.const import RINGTONES

    client = await hass_client_no_auth()
    for ringtone in RINGTONES:
        response = await client.get(f"/alarm_clocks/sounds/{ringtone}.wav")
        assert response.status == 200, ringtone
        assert (await response.read())[:4] == b"RIFF"
