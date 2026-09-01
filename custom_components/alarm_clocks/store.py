"""Persistence of the alarm clock runtime state.

Without this storage a running snooze or a pending post action would not
survive a restart of Home Assistant.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import STORAGE_KEY_TEMPLATE, STORAGE_VERSION


class AlarmClockStore:
    """Thin wrapper around the HA store for a single alarm clock."""

    def __init__(self, hass: HomeAssistant, entry_id: str) -> None:
        """Set up the store for the given config entry."""
        self._store: Store[dict[str, Any]] = Store(
            hass,
            STORAGE_VERSION,
            STORAGE_KEY_TEMPLATE.format(entry_id=entry_id),
        )

    async def async_load(self) -> dict[str, Any] | None:
        """Load the stored state."""
        return await self._store.async_load()

    async def async_save(self, data: dict[str, Any]) -> None:
        """Save the state."""
        await self._store.async_save(data)

    async def async_remove(self) -> None:
        """Remove the stored state (when the config entry is deleted)."""
        await self._store.async_remove()
