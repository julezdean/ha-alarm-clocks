"""The built-in ringtone of an alarm clock.

While the alarm rings, a tone plays on the chosen media player, at the chosen
volume, over and over. Snooze, dismiss and switching the alarm clock off stop
it and give the player its old volume back.

There are two ways of playing it, chosen by the integration behind the
player:

- Most players play one of the bundled WAV files from a URL of Home
  Assistant. A file plays once, so it is started again whenever the player
  reports it has finished.
- An Echo plays nothing from a URL; Amazon refuses it. It plays a sound from
  Amazon's own library instead, through alexa_devices.send_sound (Home
  Assistant's Alexa integration) or play_media of type sound (Alexa Media
  Player). An Echo reports no state while it does, so the sound is repeated
  on a clock.

This runs beside the action sequences, not through them: they are the
user's, and the sound is not one of their steps.
"""

from __future__ import annotations

import asyncio
import logging
from datetime import datetime
from typing import Any

import voluptuous as vol

from homeassistant.components.media_player import (
    ATTR_MEDIA_CONTENT_ID,
    ATTR_MEDIA_CONTENT_TYPE,
    ATTR_MEDIA_VOLUME_LEVEL,
    DOMAIN as MEDIA_PLAYER_DOMAIN,
    SERVICE_PLAY_MEDIA,
    MediaPlayerState,
    MediaType,
)
from homeassistant.components.media_player.browse_media import (
    async_process_play_media_url,
)
from homeassistant.const import (
    ATTR_DEVICE_ID,
    ATTR_ENTITY_ID,
    SERVICE_MEDIA_STOP,
    SERVICE_VOLUME_SET,
)
from homeassistant.core import CALLBACK_TYPE, Event, EventStateChangedData, HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.event import (
    async_track_state_change_event,
    async_track_time_interval,
)

from .const import (
    ALEXA_REPEAT,
    ALEXA_SOUNDS,
    DEFAULT_ALEXA_SOUND,
    DEFAULT_RINGTONE,
    PLATFORM_ALEXA_DEVICES,
    PLATFORM_ALEXA_MEDIA,
    RINGTONES,
    SOUNDS_URL,
)

_LOGGER = logging.getLogger(__name__)

# States a player falls back to once a file has played to its end. A player
# switched off or gone unavailable is left alone: someone meant that.
_FINISHED_STATES = frozenset(
    {MediaPlayerState.IDLE, MediaPlayerState.PAUSED, MediaPlayerState.ON}
)

# alexa_devices.send_sound, by name: the integration is optional.
_SERVICE_SEND_SOUND = "send_sound"
_ATTR_SOUND = "sound"
# Alexa Media Player's media type for a sound from Amazon's library.
_MEDIA_TYPE_SOUND = "sound"


def ringtone_path(ringtone: str) -> str:
    """The path a bundled ringtone is served at."""
    return f"{SOUNDS_URL}/{ringtone}.wav"


def alexa_platform(hass: HomeAssistant, player: str | None) -> str | None:
    """The Alexa integration behind a player, or None for any other player."""
    if not player:
        return None
    entry = er.async_get(hass).async_get(player)
    if entry is not None and entry.platform in (
        PLATFORM_ALEXA_DEVICES,
        PLATFORM_ALEXA_MEDIA,
    ):
        return entry.platform
    return None


def ringtones_for(hass: HomeAssistant, player: str | None) -> tuple[str, ...]:
    """The tones a player can ring with."""
    return ALEXA_SOUNDS if alexa_platform(hass, player) else RINGTONES


def default_ringtone_for(hass: HomeAssistant, player: str | None) -> str:
    """The tone a player rings with when the chosen one does not fit it."""
    return DEFAULT_ALEXA_SOUND if alexa_platform(hass, player) else DEFAULT_RINGTONE


def effective_ringtone(hass: HomeAssistant, player: str | None, ringtone: str) -> str:
    """The chosen tone if the player can play it, its default otherwise."""
    if ringtone in ringtones_for(hass, player):
        return ringtone
    return default_ringtone_for(hass, player)


class AlarmClockSound:
    """Plays the ringtone of one alarm clock and stops it again."""

    def __init__(self, hass: HomeAssistant, title: str) -> None:
        """Set up without anything playing."""
        self.hass = hass
        self._title = title
        # Start, replay and stop each make several service calls; the lock
        # keeps a stop from landing between the calls of a start.
        self._lock = asyncio.Lock()
        self._player: str | None = None
        self._platform: str | None = None
        self._ringtone: str | None = None
        self._url: str | None = None
        self._unsub: CALLBACK_TYPE | None = None
        # Set once the player was seen playing the tone, so that a player
        # leaving what it played before the alarm does not count as the tone
        # having finished.
        self._seen_playing = False

    @property
    def active(self) -> bool:
        """True while the ringtone is meant to be playing."""
        return self._player is not None

    async def async_start(self, player: str, ringtone: str, volume: int) -> float | None:
        """Start ringing on a player.

        Returns the volume level the player had before, when the alarm set
        its own, so that it can be restored; None when there is nothing to
        restore.
        """
        async with self._lock:
            self._release()
            platform = alexa_platform(self.hass, player)
            ringtone = effective_ringtone(self.hass, player, ringtone)

            url: str | None = None
            if platform is None:
                try:
                    url = async_process_play_media_url(self.hass, ringtone_path(ringtone))
                except HomeAssistantError as err:
                    _LOGGER.error("%s: the ringtone cannot be played: %s", self._title, err)
                    return None

            previous: float | None = None
            if volume > 0:
                state = self.hass.states.get(player)
                level = state.attributes.get(ATTR_MEDIA_VOLUME_LEVEL) if state else None
                if isinstance(level, (int, float)):
                    previous = float(level)
                await self._async_call(
                    MEDIA_PLAYER_DOMAIN,
                    SERVICE_VOLUME_SET,
                    {ATTR_ENTITY_ID: player, ATTR_MEDIA_VOLUME_LEVEL: volume / 100},
                )

            self._player = player
            self._platform = platform
            self._ringtone = ringtone
            self._url = url
            if platform is None:
                self._unsub = async_track_state_change_event(
                    self.hass, [player], self._handle_player_change
                )
            else:
                self._unsub = async_track_time_interval(
                    self.hass, self._handle_repeat, ALEXA_REPEAT
                )
            await self._async_play()
            return previous

    async def async_stop(self, restore_volume: float | None) -> None:
        """Stop ringing and restore the player's volume, if one is given."""
        async with self._lock:
            player = self._player
            platform = self._platform
            self._release()
            if player is None:
                return
            # A sound on an Echo is over within seconds; not repeating it is
            # all the stopping it needs.
            if platform is None:
                await self._async_call(
                    MEDIA_PLAYER_DOMAIN, SERVICE_MEDIA_STOP, {ATTR_ENTITY_ID: player}
                )
            if restore_volume is not None:
                await self._async_call(
                    MEDIA_PLAYER_DOMAIN,
                    SERVICE_VOLUME_SET,
                    {ATTR_ENTITY_ID: player, ATTR_MEDIA_VOLUME_LEVEL: restore_volume},
                )

    @callback
    def async_shutdown(self) -> None:
        """Stop following the player, without touching it.

        For unloading: a restart while ringing starts the tone again anyway,
        and while Home Assistant stops, the player is not reachable reliably.
        """
        self._release()

    @callback
    def _release(self) -> None:
        if self._unsub is not None:
            self._unsub()
            self._unsub = None
        self._player = None
        self._platform = None
        self._ringtone = None
        self._url = None
        self._seen_playing = False

    @callback
    def _handle_player_change(self, event: Event[EventStateChangedData]) -> None:
        """Play the file again once the player has finished it."""
        old = event.data["old_state"]
        new = event.data["new_state"]
        if self._player is None or old is None or new is None:
            return
        if new.state == MediaPlayerState.PLAYING:
            self._seen_playing = True
            return
        if (
            self._seen_playing
            and old.state == MediaPlayerState.PLAYING
            and new.state in _FINISHED_STATES
        ):
            self.hass.async_create_task(self._async_replay())

    @callback
    def _handle_repeat(self, _now: datetime) -> None:
        """Play the Echo's sound again."""
        self.hass.async_create_task(self._async_replay())

    async def _async_replay(self) -> None:
        async with self._lock:
            if self._player is not None:
                await self._async_play()

    async def _async_play(self) -> None:
        """Play the tone once; the caller holds the lock."""
        player, ringtone = self._player, self._ringtone
        assert player is not None and ringtone is not None

        if self._platform == PLATFORM_ALEXA_DEVICES:
            entry = er.async_get(self.hass).async_get(player)
            if entry is None or entry.device_id is None:
                _LOGGER.warning("%s: %s has no device to send the sound to", self._title, player)
                return
            await self._async_call(
                PLATFORM_ALEXA_DEVICES,
                _SERVICE_SEND_SOUND,
                {ATTR_DEVICE_ID: entry.device_id, _ATTR_SOUND: ringtone},
            )
            return

        if self._platform == PLATFORM_ALEXA_MEDIA:
            await self._async_call(
                MEDIA_PLAYER_DOMAIN,
                SERVICE_PLAY_MEDIA,
                {
                    ATTR_ENTITY_ID: player,
                    ATTR_MEDIA_CONTENT_ID: ringtone,
                    ATTR_MEDIA_CONTENT_TYPE: _MEDIA_TYPE_SOUND,
                },
            )
            return

        self._seen_playing = False
        await self._async_call(
            MEDIA_PLAYER_DOMAIN,
            SERVICE_PLAY_MEDIA,
            {
                ATTR_ENTITY_ID: player,
                ATTR_MEDIA_CONTENT_ID: self._url,
                ATTR_MEDIA_CONTENT_TYPE: MediaType.MUSIC,
            },
        )
        # A player that was playing something else may report the tone as
        # playing without a state change in between.
        state = self.hass.states.get(player) if self._player else None
        if state is not None and state.state == MediaPlayerState.PLAYING:
            self._seen_playing = True

    async def _async_call(self, domain: str, service: str, data: dict[str, Any]) -> None:
        """Call a service; a failure is logged, never raised.

        A player that is unreachable at six in the morning must not keep the
        alarm clock from ringing, snoozing or being dismissed.
        """
        try:
            await self.hass.services.async_call(domain, service, data, blocking=True)
        except (HomeAssistantError, vol.Invalid) as err:
            _LOGGER.warning(
                "%s: %s.%s failed: %s", self._title, domain, service, err
            )
