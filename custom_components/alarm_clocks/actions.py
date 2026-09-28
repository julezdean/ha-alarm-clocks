"""Action sequences of the phases of an alarm clock.

Every phase (pre, alarm, snooze, dismiss, post) has an optional sequence of
actions, as a script would have. They run through Home Assistant's script
helper, which is what makes stopping them reliable: stopping a sequence also
stops a script it called directly (``action: script.x``), not just the
sequence's own steps.
"""

from __future__ import annotations

import asyncio
import logging
from collections.abc import Mapping
from typing import Any

import voluptuous as vol

from homeassistant.core import Context, HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.script import (
    SCRIPT_MODE_RESTART,
    Script,
    async_validate_actions_config,
)

from .const import ACTION_KEYS, DOMAIN

_LOGGER = logging.getLogger(__name__)


async def async_validate_actions(
    hass: HomeAssistant, actions: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    """Validate a raw action sequence; raises vol.Invalid or HomeAssistantError."""
    return await async_validate_actions_config(hass, cv.SCRIPT_SCHEMA(actions))


class AlarmClockActions:
    """Holds one script helper per phase and runs or stops it."""

    def __init__(self, hass: HomeAssistant, title: str) -> None:
        """Set up without any sequences."""
        self.hass = hass
        self._title = title
        self._raw: dict[str, list[dict[str, Any]]] = {}
        self._scripts: dict[str, Script] = {}

    async def async_update(self, actions: Mapping[str, list[dict[str, Any]]]) -> None:
        """Take over changed sequences.

        A phase whose sequence is unchanged keeps its script object. That is
        not an optimisation: the options are rewritten on every change of
        the alarm time or a weekday, and a rebuilt object would lose its hold
        on a run in progress, which then could no longer be stopped.
        """
        changed: list[str] = []
        for phase in ACTION_KEYS:
            raw = list(actions.get(phase, []))
            if phase in self._raw and self._raw[phase] == raw:
                continue
            # Recorded before the first await, so that a second update
            # arriving meanwhile sees the phase as handled already.
            self._raw[phase] = raw
            changed.append(phase)

        for phase in changed:
            if (previous := self._scripts.pop(phase, None)) is not None:
                await previous.async_stop()
            raw = self._raw[phase]
            if not raw:
                continue
            try:
                sequence = await async_validate_actions(self.hass, raw)
            except (vol.Invalid, HomeAssistantError) as err:
                _LOGGER.error(
                    "%s: the %s actions are invalid and are skipped: %s",
                    self._title,
                    phase,
                    err,
                )
                continue
            self._scripts[phase] = Script(
                self.hass,
                sequence,
                f"{self._title} {phase}",
                DOMAIN,
                running_description=f"{phase} actions",
                script_mode=SCRIPT_MODE_RESTART,
                logger=_LOGGER,
            )

    def has_actions(self, phase: str) -> bool:
        """True when the phase has a runnable sequence."""
        return phase in self._scripts

    async def async_run(
        self, phase: str, variables: dict[str, Any], context: Context
    ) -> None:
        """Run the sequence of a phase to its end, stopped or not.

        A stop arrives here as a CancelledError from the script helper. It
        ends the run like any other end; only a cancellation of the calling
        task itself (unloading the entry) is passed on.
        """
        script = self._scripts.get(phase)
        if script is None:
            return
        try:
            await script.async_run(variables, context)
        except asyncio.CancelledError:
            task = asyncio.current_task()
            if task is not None and task.cancelling():
                raise
        except Exception as err:  # noqa: BLE001 - a broken user sequence must not break the alarm clock
            _LOGGER.error("%s: the %s actions failed: %s", self._title, phase, err)

    def is_running(self, phase: str) -> bool:
        """True while a run of the phase is in progress."""
        script = self._scripts.get(phase)
        return script is not None and script.is_running

    async def async_stop(self, phase: str) -> None:
        """Stop a running sequence of a phase."""
        if self.is_running(phase):
            await self._scripts[phase].async_stop()

    async def async_stop_all(self) -> None:
        """Stop the running sequences of every phase."""
        for phase in ACTION_KEYS:
            await self.async_stop(phase)
