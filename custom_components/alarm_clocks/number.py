"""Number entities: snooze duration, pre/post offset and auto dismiss."""

from __future__ import annotations

from dataclasses import dataclass

from homeassistant.components.number import NumberEntity, NumberEntityDescription, NumberMode
from homeassistant.const import EntityCategory, UnitOfTime
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import (
    CONF_AUTO_DISMISS,
    CONF_POST_OFFSET,
    CONF_PRE_OFFSET,
    CONF_SNOOZE_DURATION,
    MAX_AUTO_DISMISS,
    MAX_OFFSET,
    MAX_SNOOZE_DURATION,
    MIN_AUTO_DISMISS,
    MIN_OFFSET,
    MIN_SNOOZE_DURATION,
)
from .coordinator import AlarmClockConfigEntry, AlarmClockCoordinator
from .entity import AlarmClockEntity


@dataclass(frozen=True, kw_only=True)
class AlarmClockNumberDescription(NumberEntityDescription):
    """Description of an alarm clock number entity."""

    option_key: str


NUMBERS: tuple[AlarmClockNumberDescription, ...] = (
    AlarmClockNumberDescription(
        key=CONF_SNOOZE_DURATION,
        translation_key=CONF_SNOOZE_DURATION,
        option_key=CONF_SNOOZE_DURATION,
        icon="mdi:timer-sand",
        native_min_value=MIN_SNOOZE_DURATION,
        native_max_value=MAX_SNOOZE_DURATION,
        native_step=1,
        native_unit_of_measurement=UnitOfTime.MINUTES,
        entity_category=EntityCategory.CONFIG,
    ),
    AlarmClockNumberDescription(
        key=CONF_PRE_OFFSET,
        translation_key=CONF_PRE_OFFSET,
        option_key=CONF_PRE_OFFSET,
        icon="mdi:clock-start",
        native_min_value=MIN_OFFSET,
        native_max_value=MAX_OFFSET,
        native_step=1,
        native_unit_of_measurement=UnitOfTime.MINUTES,
        entity_category=EntityCategory.CONFIG,
    ),
    AlarmClockNumberDescription(
        key=CONF_POST_OFFSET,
        translation_key=CONF_POST_OFFSET,
        option_key=CONF_POST_OFFSET,
        icon="mdi:clock-end",
        native_min_value=MIN_OFFSET,
        native_max_value=MAX_OFFSET,
        native_step=1,
        native_unit_of_measurement=UnitOfTime.MINUTES,
        entity_category=EntityCategory.CONFIG,
    ),
    AlarmClockNumberDescription(
        key=CONF_AUTO_DISMISS,
        translation_key=CONF_AUTO_DISMISS,
        option_key=CONF_AUTO_DISMISS,
        icon="mdi:alarm-off",
        native_min_value=MIN_AUTO_DISMISS,
        native_max_value=MAX_AUTO_DISMISS,
        native_step=1,
        native_unit_of_measurement=UnitOfTime.MINUTES,
        entity_category=EntityCategory.CONFIG,
    ),
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: AlarmClockConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the number entities."""
    coordinator = entry.runtime_data
    async_add_entities(
        AlarmClockNumber(coordinator, description) for description in NUMBERS
    )


class AlarmClockNumber(AlarmClockEntity, NumberEntity):
    """A configurable minute value of the alarm clock."""

    entity_description: AlarmClockNumberDescription
    _attr_mode = NumberMode.BOX

    def __init__(
        self, coordinator: AlarmClockCoordinator, description: AlarmClockNumberDescription
    ) -> None:
        """Set up the number entity."""
        super().__init__(coordinator, description.key)
        self.entity_description = description

    @property
    def native_value(self) -> float:
        """Current value in minutes."""
        return float(getattr(self.config, self.entity_description.option_key))

    async def async_set_native_value(self, value: float) -> None:
        """Store the new value."""
        await self.coordinator.async_set_options(
            **{self.entity_description.option_key: int(value)}
        )
