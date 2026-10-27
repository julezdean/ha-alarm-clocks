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
from homeassistant.helpers import device_registry as dr, entity_registry as er

from custom_components.alarm_clocks.const import (
    ALEXA_SOUNDS,
    CONF_AUTO_DISMISS,
    CONF_MEDIA_PLAYER,
    CONF_RINGTONE,
    CONF_VOLUME,
    CONF_VOLUME_RAMP,
    CONF_VOLUME_START,
    DEFAULT_ALEXA_SOUND,
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
    async_mock_service(hass, "alexa_devices", "send_sound")

    # A callback, so that a call is recorded the moment it is made and a
    # clear() in a test cannot race a recording still on its way.
    @callback
    def _record(event: Event) -> None:
        if event.data["domain"] in ("media_player", "alexa_devices"):
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


# ---------------------------------------------------------------------------
# Echo: a sound from Amazon's library, repeated on a clock
# ---------------------------------------------------------------------------
ECHO = "media_player.echo_bedroom"


def _add_echo(hass: HomeAssistant, platform: str) -> str | None:
    """An Echo of the given Alexa integration, at 30 %; returns its device ID."""
    device_id = None
    if platform == "alexa_devices":
        entry = MockConfigEntry(domain="alexa_devices")
        entry.add_to_hass(hass)
        device_id = dr.async_get(hass).async_get_or_create(
            config_entry_id=entry.entry_id, identifiers={("alexa_devices", "G1")}
        ).id
    er.async_get(hass).async_get_or_create(
        "media_player",
        platform,
        "G1",
        suggested_object_id="echo_bedroom",
        device_id=device_id,
    )
    hass.states.async_set(ECHO, "idle", {"volume_level": 0.3})
    return device_id


def _echo_summary(calls: list[Any]) -> list[tuple[str, Any]]:
    out = []
    for call in calls:
        data = call["service_data"]
        if call["service"] == "send_sound":
            out.append(("send_sound", (data["device_id"], data["sound"])))
        elif call["service"] == "play_media":
            assert data["entity_id"] == ECHO
            out.append(("play_media", (data["media_content_type"], data["media_content_id"])))
        else:
            assert data["entity_id"] == ECHO
            out.append((call["service"], data.get("volume_level")))
    return out


async def test_echo_through_alexa_devices(
    hass: HomeAssistant,
    freezer: FrozenDateTimeFactory,
    calls: list[Any],
    setup_alarm: MockConfigEntry,
) -> None:
    """send_sound to the Echo's device, again every 5 s, until the dismiss."""
    device_id = _add_echo(hass, "alexa_devices")
    coordinator = setup_alarm.runtime_data
    await coordinator.async_set_options(
        **{CONF_MEDIA_PLAYER: ECHO, CONF_RINGTONE: "bell_02"}
    )

    await coordinator.async_trigger_alarm()
    await hass.async_block_till_done()
    sound = ("send_sound", (device_id, "bell_02"))
    assert _echo_summary(calls) == [("volume_set", 0.5), sound]

    calls.clear()
    await _advance(hass, freezer, seconds=5)
    assert _echo_summary(calls) == [sound]

    calls.clear()
    await coordinator.async_dismiss()
    await _advance(hass, freezer, seconds=10)
    # Nothing to stop on an Echo: no more repetitions, the volume back.
    assert _echo_summary(calls) == [("volume_set", 0.3)]


async def test_echo_through_alexa_media(
    hass: HomeAssistant,
    freezer: FrozenDateTimeFactory,
    calls: list[Any],
    setup_alarm: MockConfigEntry,
) -> None:
    """Alexa Media Player gets play_media of type sound, repeated the same way."""
    _add_echo(hass, "alexa_media")
    coordinator = setup_alarm.runtime_data
    await coordinator.async_set_options(
        **{CONF_MEDIA_PLAYER: ECHO, CONF_VOLUME: 0, CONF_RINGTONE: "bell_02"}
    )

    await coordinator.async_trigger_alarm()
    await _advance(hass, freezer, seconds=5)
    await coordinator.async_snooze()
    await _advance(hass, freezer, seconds=10)

    sound = ("play_media", ("sound", "bell_02"))
    assert _echo_summary(calls) == [sound, sound]


async def test_echo_loop_ignores_the_player_state(
    hass: HomeAssistant, calls: list[Any], setup_alarm: MockConfigEntry
) -> None:
    """An Echo going from playing to idle does not start the sound again."""
    _add_echo(hass, "alexa_devices")
    coordinator = setup_alarm.runtime_data
    await coordinator.async_set_options(**{CONF_MEDIA_PLAYER: ECHO})
    await coordinator.async_trigger_alarm()
    calls.clear()

    hass.states.async_set(ECHO, "playing", {"volume_level": 0.5})
    hass.states.async_set(ECHO, "idle", {"volume_level": 0.5})
    await hass.async_block_till_done()
    assert calls == []


async def test_ringtones_follow_the_player(
    hass: HomeAssistant, calls: list[Any], setup_alarm: MockConfigEntry
) -> None:
    """An Echo offers Amazon's sounds; switching to it drops a bundled tone."""
    _add_echo(hass, "alexa_devices")
    ringtone = "select.alarm_1_ringtone"
    assert hass.states.get(ringtone).attributes["options"] == [
        "classic",
        "digital",
        "chime",
        "gentle",
    ]

    await hass.services.async_call(
        "select",
        "select_option",
        {"entity_id": "select.alarm_1_media_player", "option": ECHO},
        blocking=True,
    )
    state = hass.states.get(ringtone)
    assert state.attributes["options"] == list(ALEXA_SOUNDS)
    assert state.state == DEFAULT_ALEXA_SOUND
    assert setup_alarm.runtime_data.config.ringtone == DEFAULT_ALEXA_SOUND

    # Back to a speaker that plays files: the Amazon sound gives way again.
    await hass.services.async_call(
        "select",
        "select_option",
        {"entity_id": "select.alarm_1_media_player", "option": PLAYER},
        blocking=True,
    )
    assert hass.states.get(ringtone).state == "classic"


async def test_unfitting_stored_ringtone_falls_back(
    hass: HomeAssistant, calls: list[Any], setup_alarm: MockConfigEntry
) -> None:
    """A tone stored for another kind of player rings as the player's default."""
    device_id = _add_echo(hass, "alexa_devices")
    coordinator = setup_alarm.runtime_data
    # Written past the select, as an automation could: "chime" is a file.
    await coordinator.async_set_options(**{CONF_MEDIA_PLAYER: ECHO})
    assert coordinator.config.ringtone == "chime"
    assert hass.states.get("select.alarm_1_ringtone").state == DEFAULT_ALEXA_SOUND

    await coordinator.async_trigger_alarm()
    await hass.async_block_till_done()
    assert ("send_sound", (device_id, DEFAULT_ALEXA_SOUND)) in _echo_summary(calls)


# ---------------------------------------------------------------------------
# Rising volume
# ---------------------------------------------------------------------------


def _volumes(calls: list[Any]) -> list[float]:
    """The volume levels set, in order."""
    return [
        call["service_data"]["volume_level"]
        for call in calls
        if call["service"] == "volume_set"
    ]


def _player_follows_volume(hass: HomeAssistant) -> None:
    """Let the player report the volume it was set to, as a real one does.

    Without it every step would look like a change by hand.
    """

    @callback
    def _set(call: ServiceCall) -> None:
        state = hass.states.get(PLAYER)
        hass.states.async_set(
            PLAYER,
            state.state,
            {**state.attributes, "volume_level": call.data["volume_level"]},
        )

    hass.services.async_register("media_player", "volume_set", _set)


async def _ramp(coordinator, **values: int) -> None:
    await coordinator.async_set_options(
        **{CONF_VOLUME: 70, CONF_VOLUME_START: 10, CONF_VOLUME_RAMP: 60, **values}
    )


async def test_volume_rises_to_its_end(
    hass: HomeAssistant,
    freezer: FrozenDateTimeFactory,
    calls: list[Any],
    setup_alarm: MockConfigEntry,
) -> None:
    """10 % to 70 % over a minute, a step every 10 s, then it holds."""
    _player_follows_volume(hass)
    coordinator = setup_alarm.runtime_data
    await _ramp(coordinator)

    await coordinator.async_trigger_alarm()
    await hass.async_block_till_done()
    for _ in range(8):
        await _advance(hass, freezer, seconds=10)

    assert _volumes(calls) == [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]

    calls.clear()
    await coordinator.async_dismiss()
    await hass.async_block_till_done()
    # The player's own volume from before the alarm.
    assert _volumes(calls) == [0.3]


async def test_ramp_stops_at_a_volume_changed_by_hand(
    hass: HomeAssistant,
    freezer: FrozenDateTimeFactory,
    calls: list[Any],
    setup_alarm: MockConfigEntry,
) -> None:
    """Someone turns it down: the ramp leaves it there."""
    _player_follows_volume(hass)
    coordinator = setup_alarm.runtime_data
    await _ramp(coordinator)
    await coordinator.async_trigger_alarm()
    await _advance(hass, freezer, seconds=10)
    assert _volumes(calls) == [0.1, 0.2]

    hass.states.async_set(PLAYER, "idle", {"volume_level": 0.05})
    await hass.async_block_till_done()
    for _ in range(6):
        await _advance(hass, freezer, seconds=10)

    assert _volumes(calls) == [0.1, 0.2]
    assert coordinator.runtime.ringing


async def test_ramp_starts_over_after_a_snooze(
    hass: HomeAssistant,
    freezer: FrozenDateTimeFactory,
    calls: list[Any],
    setup_alarm: MockConfigEntry,
) -> None:
    """When the snooze ends, the volume rises from the start again."""
    _player_follows_volume(hass)
    coordinator = setup_alarm.runtime_data
    await _ramp(coordinator)
    await coordinator.async_trigger_alarm()
    for _ in range(3):
        await _advance(hass, freezer, seconds=10)
    await coordinator.async_snooze()
    calls.clear()

    await _advance(hass, freezer, minutes=9, seconds=1)
    await _advance(hass, freezer, seconds=10)

    assert _volumes(calls) == [0.1, 0.2]


async def test_ramp_never_outlasts_the_auto_dismiss(
    hass: HomeAssistant,
    freezer: FrozenDateTimeFactory,
    calls: list[Any],
    setup_alarm: MockConfigEntry,
) -> None:
    """A ten-minute ramp with a one-minute auto dismiss reaches its end in one."""
    _player_follows_volume(hass)
    coordinator = setup_alarm.runtime_data
    ramp = "number.alarm_1_volume_ramp"
    assert hass.states.get(ramp).attributes["max"] == 600  # 10 min auto dismiss

    await coordinator.async_set_options(**{CONF_AUTO_DISMISS: 1})
    await hass.async_block_till_done()
    assert hass.states.get(ramp).attributes["max"] == 60

    await _ramp(coordinator, **{CONF_VOLUME_RAMP: 600})
    assert coordinator.config.ramp_seconds == 60
    await coordinator.async_trigger_alarm()
    for _ in range(3):
        await _advance(hass, freezer, seconds=10)

    # Half way through the shortened ramp: 10 + (70 - 10) * 30 / 60.
    assert _volumes(calls)[-1] == 0.4


async def test_restart_resumes_the_ramp_where_it_was(
    hass: HomeAssistant,
    freezer: FrozenDateTimeFactory,
    calls: list[Any],
    setup_alarm: MockConfigEntry,
) -> None:
    """Restarted half way, the volume carries on from half way, not from 10 %."""
    _player_follows_volume(hass)
    coordinator = setup_alarm.runtime_data
    await _ramp(coordinator)
    await coordinator.async_trigger_alarm()
    for _ in range(3):
        await _advance(hass, freezer, seconds=10)

    assert await hass.config_entries.async_reload(setup_alarm.entry_id)
    await hass.async_block_till_done()
    assert setup_alarm.runtime_data.runtime.ringing
    calls.clear()
    await _advance(hass, freezer, seconds=10)

    assert _volumes(calls) == [0.5]
    calls.clear()
    await setup_alarm.runtime_data.async_dismiss()
    await hass.async_block_till_done()
    # Still the volume from before the alarm, not the ramp's.
    assert _volumes(calls) == [0.3]


async def test_no_ramp_without_a_volume_to_rise_to(
    hass: HomeAssistant, calls: list[Any], setup_alarm: MockConfigEntry
) -> None:
    """Volume zero leaves the player alone, ramp or not."""
    coordinator = setup_alarm.runtime_data
    await _ramp(coordinator, **{CONF_VOLUME: 0})
    assert coordinator.config.ramp_seconds == 0
    await coordinator.async_trigger_alarm()
    await hass.async_block_till_done()
    assert _volumes(calls) == []
