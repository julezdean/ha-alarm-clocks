"""Buttons for snooze and dismiss."""

from __future__ import annotations

from homeassistant.components.button import ButtonEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .coordinator import AlarmClockConfigEntry, AlarmClockCoordinator
from .entity import AlarmClockEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: AlarmClockConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the buttons."""
    coordinator = entry.runtime_data
    async_add_entities(
        [
            AlarmClockSnoozeButton(coordinator),
            AlarmClockDismissButton(coordinator),
        ]
    )


class AlarmClockSnoozeButton(AlarmClockEntity, ButtonEntity):
    """Triggers a snooze."""

    _attr_icon = "mdi:alarm-snooze"

    def __init__(self, coordinator: AlarmClockCoordinator) -> None:
        """Set up the button."""
        super().__init__(coordinator, "snooze")

    @property
    def available(self) -> bool:
        """Unavailable while snoozing is switched off."""
        return super().available and self.coordinator.config.snooze_duration > 0

    async def async_press(self) -> None:
        """Trigger a snooze."""
        await self.coordinator.async_snooze()


class AlarmClockDismissButton(AlarmClockEntity, ButtonEntity):
    """Ends ringing or snoozing."""

    _attr_icon = "mdi:alarm-off"

    def __init__(self, coordinator: AlarmClockCoordinator) -> None:
        """Set up the button."""
        super().__init__(coordinator, "dismiss")

    async def async_press(self) -> None:
        """Trigger a dismiss."""
        await self.coordinator.async_dismiss()

