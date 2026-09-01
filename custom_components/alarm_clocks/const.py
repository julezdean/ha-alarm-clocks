"""Constants for the Alarm Clocks integration."""

from __future__ import annotations

from datetime import timedelta
from typing import Final

from homeassistant.const import Platform

DOMAIN: Final = "alarm_clocks"

PLATFORMS: Final[list[Platform]] = [
    Platform.BINARY_SENSOR,
    Platform.BUTTON,
    Platform.NUMBER,
    Platform.SENSOR,
    Platform.SWITCH,
    Platform.TIME,
]

# ---------------------------------------------------------------------------
# Configuration keys (stored in ConfigEntry.options)
# ---------------------------------------------------------------------------
CONF_ENABLED: Final = "enabled"
CONF_ALARM_TIME: Final = "alarm_time"
CONF_DAYS: Final = "days"
CONF_SNOOZE_DURATION: Final = "snooze_duration"
CONF_PRE_OFFSET: Final = "pre_offset"
CONF_POST_OFFSET: Final = "post_offset"
CONF_AUTO_DISMISS: Final = "auto_dismiss"

CONF_ALARM_SCRIPT: Final = "alarm_script"
CONF_PRE_SCRIPT: Final = "pre_script"
CONF_POST_SCRIPT: Final = "post_script"
CONF_SNOOZE_SCRIPT: Final = "on_snooze_script"
CONF_DISMISS_SCRIPT: Final = "on_dismiss_script"


SCRIPT_KEYS: Final = (
    CONF_ALARM_SCRIPT,
    CONF_PRE_SCRIPT,
    CONF_POST_SCRIPT,
    CONF_SNOOZE_SCRIPT,
    CONF_DISMISS_SCRIPT,
)

# ---------------------------------------------------------------------------
# Defaults
# ---------------------------------------------------------------------------
DEFAULT_NAME: Final = "Alarm"
DEFAULT_ALARM_TIME: Final = "07:00:00"
DEFAULT_DAYS: Final[list[bool]] = [False] * 7
DEFAULT_SNOOZE_DURATION: Final = 9
DEFAULT_PRE_OFFSET: Final = 0
DEFAULT_POST_OFFSET: Final = 0
DEFAULT_AUTO_DISMISS: Final = 10

MIN_SNOOZE_DURATION: Final = 0
MAX_SNOOZE_DURATION: Final = 30
MIN_OFFSET: Final = 0
MAX_OFFSET: Final = 60
MIN_AUTO_DISMISS: Final = 0
MAX_AUTO_DISMISS: Final = 120

# Weekdays in the order of datetime.weekday() (0 = Monday)
WEEKDAYS: Final = ("mon", "tue", "wed", "thu", "fri", "sat", "sun")

# ---------------------------------------------------------------------------
# States of the state machine
# ---------------------------------------------------------------------------
STATE_DISABLED: Final = "disabled"
STATE_ARMED: Final = "armed"
STATE_RINGING: Final = "ringing"
STATE_SNOOZED: Final = "snoozed"
STATE_PRE_ACTIVE: Final = "pre_active"
STATE_POST_PENDING: Final = "post_pending"

ALARM_CLOCK_STATES: Final = [
    STATE_DISABLED,
    STATE_ARMED,
    STATE_RINGING,
    STATE_SNOOZED,
    STATE_PRE_ACTIVE,
    STATE_POST_PENDING,
]

# ---------------------------------------------------------------------------
# Events on the HA event bus
# ---------------------------------------------------------------------------
EVENT_PRE_TRIGGER: Final = "alarm_clocks_pre_trigger"
EVENT_ALARM_TRIGGERED: Final = "alarm_clocks_alarm_triggered"
EVENT_SNOOZED: Final = "alarm_clocks_snoozed"
EVENT_DISMISSED: Final = "alarm_clocks_dismissed"
EVENT_POST_TRIGGER: Final = "alarm_clocks_post_trigger"

# ---------------------------------------------------------------------------
# Services
# ---------------------------------------------------------------------------
SERVICE_SNOOZE: Final = "snooze"
SERVICE_DISMISS: Final = "dismiss"
SERVICE_TRIGGER_ALARM: Final = "trigger_alarm"
SERVICE_SET_ALARM: Final = "set_alarm"

ATTR_DURATION: Final = "duration"
ATTR_TIME: Final = "time"
ATTR_DAYS: Final = "days"
ATTR_SOURCE: Final = "source"
ATTR_NAME: Final = "name"
ATTR_ENTRY_ID: Final = "entry_id"
ATTR_DEVICE_ID: Final = "device_id"
ATTR_SNOOZE_UNTIL: Final = "snooze_until"

SOURCE_SCHEDULE: Final = "schedule"
SOURCE_MANUAL: Final = "manual"
SOURCE_SNOOZE_END: Final = "snooze_end"
SOURCE_AUTO: Final = "auto"
SOURCE_CLEANUP: Final = "cleanup"

# ---------------------------------------------------------------------------
# Timer keys
# ---------------------------------------------------------------------------
TIMER_ALARM: Final = "alarm"
TIMER_PRE: Final = "pre"
TIMER_SNOOZE_END: Final = "snooze_end"
TIMER_AUTO_DISMISS: Final = "auto_dismiss"
TIMER_POST: Final = "post"

# How long after a missed end of snooze (e.g. because Home Assistant was
# restarted) the alarm is still caught up.
RESUME_GRACE: Final = timedelta(hours=1)

# ---------------------------------------------------------------------------
# Bundled Lovelace card
# ---------------------------------------------------------------------------
CARD_FILENAME: Final = "alarm-clocks-card.js"
CARD_URL: Final = f"/{DOMAIN}/{CARD_FILENAME}"
CARD_REGISTERED: Final = "card_registered"

STORAGE_VERSION: Final = 1
STORAGE_KEY_TEMPLATE: Final = f"{DOMAIN}.{{entry_id}}"
