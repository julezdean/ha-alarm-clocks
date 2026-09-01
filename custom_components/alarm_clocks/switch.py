"""Switch entities: the enable switch and the seven weekdays."""

from __future__ import annotations

from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import CONF_ENABLED, WEEKDAYS
from .coordinator import AlarmClockConfigEntry, AlarmClockCoordinator
from .entity import AlarmClockEntity

DAY_ICONS = {
    "mon": "mdi:calendar-today",
    "tue": "mdi:calendar-today",
    "wed": "mdi:calendar-today",
    "thu": "mdi:calendar-today",
    "fri": "mdi:calendar-today",
    "sat": "mdi:calendar-weekend",
    "sun": "mdi:calendar-weekend",
}


async def async_setup_entry(
    hass: HomeAssistant,
    entry: AlarmClockConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the switches for this alarm clock."""
    coordinator = entry.runtime_data
    entities: list[AlarmClockEntity] = [AlarmClockEnabledSwitch(coordinator)]
    entities.extend(
        AlarmClockDaySwitch(coordinator, index, key) for index, key in enumerate(WEEKDAYS)
    )
    async_add_entities(entities)


class AlarmClockEnabledSwitch(AlarmClockEntity, SwitchEntity):
    """Arms the alarm clock."""

    _attr_icon = "mdi:alarm-check"

    def __init__(self, coordinator: AlarmClockCoordinator) -> None:
        """Set up the switch."""
        super().__init__(coordinator, CONF_ENABLED)

    @property
    def is_on(self) -> bool:
        """Whether the alarm clock is enabled."""
        return self.config.enabled

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Enable the alarm clock."""
        await self.coordinator.async_set_enabled(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Disable the alarm clock (ends an ongoing alarm)."""
        await self.coordinator.async_set_enabled(False)


class AlarmClockDaySwitch(AlarmClockEntity, SwitchEntity):
    """A single weekday of the alarm clock."""

    _attr_entity_category = EntityCategory.CONFIG

    def __init__(self, coordinator: AlarmClockCoordinator, index: int, key: str) -> None:
        """Set up the weekday switch."""
        super().__init__(coordinator, f"day_{key}")
        self._index = index
        self._attr_icon = DAY_ICONS[key]

    @property
    def is_on(self) -> bool:
        """Whether the alarm rings on this weekday."""
        return self.config.days[self._index]

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Enable the weekday."""
        await self.coordinator.async_set_day(self._index, True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Disable the weekday."""
        await self.coordinator.async_set_day(self._index, False)
