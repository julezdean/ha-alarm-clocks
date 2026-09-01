"""Binary sensor: ringing."""

from __future__ import annotations

from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntity,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .coordinator import AlarmClockConfigEntry, AlarmClockCoordinator
from .entity import AlarmClockEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: AlarmClockConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the binary sensor."""
    coordinator = entry.runtime_data
    async_add_entities(
        [AlarmClockRingingSensor(coordinator)]
    )


class AlarmClockRingingSensor(AlarmClockEntity, BinarySensorEntity):
    """Indicates whether the alarm clock is ringing.

    The state is set exclusively by the integration and is changed through
    the services alarm_clocks.trigger_alarm, alarm_clocks.snooze and
    alarm_clocks.dismiss.
    """

    _attr_device_class = BinarySensorDeviceClass.RUNNING
    _attr_icon = "mdi:bell-ring"

    def __init__(self, coordinator: AlarmClockCoordinator) -> None:
        """Set up the sensor."""
        super().__init__(coordinator, "ringing")

    @property
    def is_on(self) -> bool:
        """Whether the alarm clock is ringing."""
        return self.coordinator.data.ringing

