"""Checks the separation of entity ID and display name.

The entity ID comes from the internal English key and is therefore the same
on every instance; the display name follows the language of Home Assistant.
"""

from __future__ import annotations

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from homeassistant.core import HomeAssistant


@pytest.mark.parametrize(
    ("language", "expected_names"),
    [
        (
            "de",
            {
                "switch.alarm_1_enabled": "Alarm 1 Aktiviert",
                "switch.alarm_1_monday": "Alarm 1 Montag",
                "time.alarm_1_alarm_time": "Alarm 1 Weckzeit",
                "binary_sensor.alarm_1_ringing": "Alarm 1 Klingelt",
                "sensor.alarm_1_next_alarm": "Alarm 1 Nächster Alarm",
            },
        ),
        (
            "en",
            {
                "switch.alarm_1_enabled": "Alarm 1 Enabled",
                "switch.alarm_1_monday": "Alarm 1 Monday",
                "time.alarm_1_alarm_time": "Alarm 1 Alarm time",
                "binary_sensor.alarm_1_ringing": "Alarm 1 Ringing",
                "sensor.alarm_1_next_alarm": "Alarm 1 Next alarm",
            },
        ),
    ],
)
async def test_entity_ids_are_language_independent(
    hass: HomeAssistant,
    config_entry: MockConfigEntry,
    language: str,
    expected_names: dict[str, str],
) -> None:
    """Same entity IDs in every language, translated display names."""
    await hass.config.async_update(language=language)
    config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(config_entry.entry_id)
    await hass.async_block_till_done()

    for entity_id, name in expected_names.items():
        state = hass.states.get(entity_id)
        assert state is not None, entity_id
        assert state.attributes["friendly_name"] == name
