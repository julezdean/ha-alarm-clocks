"""Select entities: the media player that rings and the ringtone it plays."""

from __future__ import annotations

from homeassistant.components.media_player import DOMAIN as MEDIA_PLAYER_DOMAIN
from homeassistant.components.select import SelectEntity
from homeassistant.const import EntityCategory
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.event import (
    async_track_state_added_domain,
    async_track_state_removed_domain,
)

from .const import CONF_MEDIA_PLAYER, CONF_RINGTONE, MEDIA_PLAYER_NONE, RINGTONES
from .coordinator import AlarmClockConfigEntry, AlarmClockCoordinator
from .entity import AlarmClockEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: AlarmClockConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the select entities."""
    coordinator = entry.runtime_data
    async_add_entities(
        [AlarmClockMediaPlayerSelect(coordinator), AlarmClockRingtoneSelect(coordinator)]
    )


class AlarmClockMediaPlayerSelect(AlarmClockEntity, SelectEntity):
    """The media player the ringtone plays on, or none for no sound.

    The options are the media players Home Assistant knows right now, so
    they follow players being added and removed. A chosen player that has
    gone missing stays among them, so that the choice is still shown rather
    than turning into an unknown state.
    """

    _attr_icon = "mdi:speaker"
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(self, coordinator: AlarmClockCoordinator) -> None:
        """Set up the select."""
        super().__init__(coordinator, CONF_MEDIA_PLAYER)

    async def async_added_to_hass(self) -> None:
        """Follow the media players coming and going."""
        await super().async_added_to_hass()
        self.async_on_remove(
            async_track_state_added_domain(
                self.hass, MEDIA_PLAYER_DOMAIN, self._handle_players_changed
            )
        )
        self.async_on_remove(
            async_track_state_removed_domain(
                self.hass, MEDIA_PLAYER_DOMAIN, self._handle_players_changed
            )
        )

    @callback
    def _handle_players_changed(self, _event: Event) -> None:
        self.async_write_ha_state()

    @property
    def options(self) -> list[str]:
        """No sound, then every media player."""
        players = set(self.hass.states.async_entity_ids(MEDIA_PLAYER_DOMAIN))
        if self.config.media_player:
            players.add(self.config.media_player)
        return [MEDIA_PLAYER_NONE, *sorted(players)]

    @property
    def current_option(self) -> str:
        """The chosen player, or none."""
        return self.config.media_player or MEDIA_PLAYER_NONE

    async def async_select_option(self, option: str) -> None:
        """Store the chosen player; it rings from the next alarm on."""
        await self.coordinator.async_set_options(
            **{CONF_MEDIA_PLAYER: None if option == MEDIA_PLAYER_NONE else option}
        )


class AlarmClockRingtoneSelect(AlarmClockEntity, SelectEntity):
    """One of the bundled ringtones."""

    _attr_icon = "mdi:music-note"
    _attr_entity_category = EntityCategory.CONFIG
    _attr_options = list(RINGTONES)

    def __init__(self, coordinator: AlarmClockCoordinator) -> None:
        """Set up the select."""
        super().__init__(coordinator, CONF_RINGTONE)

    @property
    def current_option(self) -> str:
        """The chosen ringtone."""
        return self.config.ringtone

    async def async_select_option(self, option: str) -> None:
        """Store the chosen ringtone; it plays from the next alarm on."""
        await self.coordinator.async_set_options(**{CONF_RINGTONE: option})
