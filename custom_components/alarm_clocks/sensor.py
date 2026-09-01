"""Sensors: next alarm, state and snooze until."""

from __future__ import annotations

from datetime import datetime

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import ALARM_CLOCK_STATES
from .coordinator import AlarmClockConfigEntry, AlarmClockCoordinator
from .entity import AlarmClockEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: AlarmClockConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the sensors."""
    coordinator = entry.runtime_data
    async_add_entities(
        [
            AlarmClockNextAlarmSensor(coordinator),
            AlarmClockStateSensor(coordinator),
            AlarmClockSnoozeUntilSensor(coordinator),
        ]
    )

class AlarmClockNextAlarmSensor(AlarmClockEntity, SensorEntity):
    """Next alarm time as a timestamp."""

    _attr_device_class = SensorDeviceClass.TIMESTAMP
    _attr_icon = "mdi:alarm"

    def __init__(self, coordinator: AlarmClockCoordinator) -> None:
        """Set up the sensor."""
        super().__init__(coordinator, "next_alarm")

    @property
    def available(self) -> bool:
        """Available only while the alarm clock is enabled."""
        return super().available and self.config.enabled

    @property
    def native_value(self) -> datetime | None:
        """Next alarm; the end of a running snooze takes precedence."""
        return self.coordinator.data.next_alarm



class AlarmClockStateSensor(AlarmClockEntity, SensorEntity):
    """State of the alarm clock state machine."""

    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = ALARM_CLOCK_STATES
    _attr_icon = "mdi:state-machine"

    def __init__(self, coordinator: AlarmClockCoordinator) -> None:
        """Set up the sensor."""
        super().__init__(coordinator, "state")

    @property
    def native_value(self) -> str:
        """Current state."""
        return self.coordinator.data.state


class AlarmClockSnoozeUntilSensor(AlarmClockEntity, SensorEntity):
    """Point in time at which a running snooze ends."""

    _attr_device_class = SensorDeviceClass.TIMESTAMP
    _attr_entity_category = EntityCategory.DIAGNOSTIC
    _attr_icon = "mdi:alarm-snooze"

    def __init__(self, coordinator: AlarmClockCoordinator) -> None:
        """Set up the sensor."""
        super().__init__(coordinator, "snooze_until")

    @property
    def native_value(self) -> datetime | None:
        """End of the snooze, or None."""
        return self.coordinator.data.snooze_until
