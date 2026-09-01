"""Time entity: the alarm time."""

from __future__ import annotations

from datetime import time as dt_time

from homeassistant.components.time import TimeEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import CONF_ALARM_TIME
from .coordinator import AlarmClockConfigEntry, AlarmClockCoordinator
from .entity import AlarmClockEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: AlarmClockConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the alarm time entity."""
    async_add_entities([AlarmClockAlarmTime(entry.runtime_data)])


class AlarmClockAlarmTime(AlarmClockEntity, TimeEntity):
    """Alarm time of the alarm clock."""

    _attr_icon = "mdi:alarm"

    def __init__(self, coordinator: AlarmClockCoordinator) -> None:
        """Set up the alarm time entity."""
        super().__init__(coordinator, CONF_ALARM_TIME)

    @property
    def native_value(self) -> dt_time:
        """Currently configured alarm time."""
        return self.config.alarm_time

    async def async_set_value(self, value: dt_time) -> None:
        """Set a new alarm time."""
        await self.coordinator.async_set_alarm_time(value)
