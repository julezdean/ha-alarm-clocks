"""Data models of the Alarm Clocks integration."""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass, field
from datetime import datetime, time as dt_time
from typing import Any

from homeassistant.util import dt as dt_util

from .const import (
    ACTION_KEYS,
    CONF_ALARM_TIME,
    CONF_AUTO_DISMISS,
    CONF_DAYS,
    CONF_ENABLED,
    CONF_POST_OFFSET,
    CONF_POST_TIMEOUT,
    CONF_PRE_OFFSET,
    CONF_SNOOZE_DURATION,
    DEFAULT_ALARM_TIME,
    DEFAULT_AUTO_DISMISS,
    DEFAULT_POST_OFFSET,
    DEFAULT_POST_TIMEOUT,
    DEFAULT_PRE_OFFSET,
    DEFAULT_SNOOZE_DURATION,
)


def parse_actions(value: Any) -> list[dict[str, Any]]:
    """Normalise an action sequence; unset or empty means no actions.

    The action selector returns a single action as a mapping rather than a
    one-item list, so both are accepted.
    """
    if isinstance(value, Mapping):
        return [dict(value)]
    if isinstance(value, (list, tuple)):
        return [dict(item) for item in value if isinstance(item, Mapping)]
    return []


def _parse_days(value: Any) -> tuple[bool, ...]:
    """Convert weekdays into a seven-item bool tuple (0 = Monday)."""
    if isinstance(value, (list, tuple)):
        days = [bool(item) for item in value][:7]
        days.extend([False] * (7 - len(days)))
        return tuple(days)
    return (False,) * 7


def _parse_time(value: Any) -> dt_time:
    """Read the alarm time from 'HH:MM' or 'HH:MM:SS'."""
    if isinstance(value, dt_time):
        return value.replace(second=0, microsecond=0)
    parsed = dt_util.parse_time(str(value)) if value is not None else None
    if parsed is None:
        parsed = dt_util.parse_time(DEFAULT_ALARM_TIME)
    assert parsed is not None  # DEFAULT_ALARM_TIME always parses
    return parsed.replace(second=0, microsecond=0)


def _parse_int(value: Any, default: int) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


@dataclass(slots=True)
class AlarmClockConfig:
    """User configurable part of an alarm clock."""

    enabled: bool = False
    alarm_time: dt_time = field(default_factory=lambda: _parse_time(DEFAULT_ALARM_TIME))
    days: tuple[bool, ...] = (False,) * 7
    snooze_duration: int = DEFAULT_SNOOZE_DURATION
    pre_offset: int = DEFAULT_PRE_OFFSET
    post_offset: int = DEFAULT_POST_OFFSET
    auto_dismiss: int = DEFAULT_AUTO_DISMISS
    post_timeout: int = DEFAULT_POST_TIMEOUT
    # Phase -> raw action sequence as stored in the options.
    actions: dict[str, list[dict[str, Any]]] = field(default_factory=dict)

    @property
    def is_one_shot(self) -> bool:
        """True when no weekday is selected (one-shot alarm)."""
        return not any(self.days)

    @classmethod
    def from_options(cls, options: Mapping[str, Any]) -> AlarmClockConfig:
        """Build the configuration from the config entry options."""
        return cls(
            enabled=bool(options.get(CONF_ENABLED, False)),
            alarm_time=_parse_time(options.get(CONF_ALARM_TIME, DEFAULT_ALARM_TIME)),
            days=_parse_days(options.get(CONF_DAYS)),
            snooze_duration=_parse_int(
                options.get(CONF_SNOOZE_DURATION), DEFAULT_SNOOZE_DURATION
            ),
            pre_offset=_parse_int(options.get(CONF_PRE_OFFSET), DEFAULT_PRE_OFFSET),
            post_offset=_parse_int(options.get(CONF_POST_OFFSET), DEFAULT_POST_OFFSET),
            auto_dismiss=_parse_int(
                options.get(CONF_AUTO_DISMISS), DEFAULT_AUTO_DISMISS
            ),
            post_timeout=_parse_int(
                options.get(CONF_POST_TIMEOUT), DEFAULT_POST_TIMEOUT
            ),
            actions={
                phase: parse_actions(options.get(key))
                for phase, key in ACTION_KEYS.items()
            },
        )


@dataclass(slots=True)
class RuntimeState:
    """Volatile runtime state that has to survive a restart."""

    ringing: bool = False
    ringing_since: datetime | None = None
    snooze_until: datetime | None = None
    post_due_at: datetime | None = None
    # Alarm time the running pre phase belongs to; None when no pre phase runs.
    pre_until: datetime | None = None
    # The post actions are running. Their run does not survive a restart,
    # this only tells the restart that the cycle still has to be finished.
    post_active: bool = False

    def as_dict(self) -> dict[str, Any]:
        """Serialise for persistence."""
        return {
            "ringing": self.ringing,
            "ringing_since": self.ringing_since.isoformat()
            if self.ringing_since
            else None,
            "snooze_until": self.snooze_until.isoformat()
            if self.snooze_until
            else None,
            "post_due_at": self.post_due_at.isoformat() if self.post_due_at else None,
            "pre_until": self.pre_until.isoformat() if self.pre_until else None,
            "post_active": self.post_active,
        }

    @classmethod
    def from_dict(cls, data: Mapping[str, Any] | None) -> RuntimeState:
        """Restore from persistence."""
        if not data:
            return cls()

        def _dt(key: str) -> datetime | None:
            raw = data.get(key)
            if not raw:
                return None
            parsed = dt_util.parse_datetime(str(raw))
            return dt_util.as_local(parsed) if parsed else None

        return cls(
            ringing=bool(data.get("ringing", False)),
            ringing_since=_dt("ringing_since"),
            snooze_until=_dt("snooze_until"),
            post_due_at=_dt("post_due_at"),
            pre_until=_dt("pre_until"),
            post_active=bool(data.get("post_active", False)),
        )


@dataclass(frozen=True, slots=True)
class AlarmClockSnapshot:
    """Externally visible state read by the entities."""

    state: str
    ringing: bool
    snooze_active: bool
    snooze_until: datetime | None
    next_alarm: datetime | None
    post_due_at: datetime | None
