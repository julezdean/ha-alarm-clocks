"""Shared fixtures for the Alarm Clocks integration tests."""

from __future__ import annotations

from collections.abc import Generator
from typing import Any

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from homeassistant.core import HomeAssistant

from custom_components.alarm_clocks.const import (
    CONF_ALARM_TIME,
    CONF_AUTO_DISMISS,
    CONF_DAYS,
    CONF_ENABLED,
    CONF_POST_OFFSET,
    CONF_PRE_OFFSET,
    CONF_SNOOZE_DURATION,
    DOMAIN,
)


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(
    enable_custom_integrations: None,
) -> Generator[None, None, None]:
    """Load custom integrations in every test."""
    yield


@pytest.fixture
def options() -> dict[str, Any]:
    """Default options of an active alarm clock (Monday to Friday, 07:00)."""
    return {
        CONF_ENABLED: True,
        CONF_ALARM_TIME: "07:00:00",
        CONF_DAYS: [True, True, True, True, True, False, False],
        CONF_SNOOZE_DURATION: 9,
        CONF_PRE_OFFSET: 0,
        CONF_POST_OFFSET: 0,
        CONF_AUTO_DISMISS: 10,
    }


@pytest.fixture
def config_entry(options: dict[str, Any]) -> MockConfigEntry:
    """Config entry for one alarm clock."""
    return MockConfigEntry(
        domain=DOMAIN,
        title="Alarm 1",
        data={},
        options=options,
        unique_id="wecker_1",
    )


@pytest.fixture
async def setup_alarm(
    hass: HomeAssistant, config_entry: MockConfigEntry
) -> MockConfigEntry:
    """Set up the integration with a single alarm clock."""
    config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(config_entry.entry_id)
    await hass.async_block_till_done()
    return config_entry
