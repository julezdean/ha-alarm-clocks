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
    Platform.SELECT,
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

# One action sequence per phase, as a list of actions (the format of the
# action selector and of a script's sequence).
CONF_PRE_ACTIONS: Final = "pre_actions"
CONF_ALARM_ACTIONS: Final = "alarm_actions"
CONF_SNOOZE_ACTIONS: Final = "snooze_actions"
CONF_DISMISS_ACTIONS: Final = "dismiss_actions"
CONF_POST_ACTIONS: Final = "post_actions"
CONF_POST_TIMEOUT: Final = "post_timeout"

# The built-in ringtone: which media player rings, with which tone and how
# loud. Without a media player there is no sound.
CONF_MEDIA_PLAYER: Final = "media_player"
CONF_RINGTONE: Final = "ringtone"
CONF_VOLUME: Final = "volume"
# A rising volume: from volume_start to volume over volume_ramp seconds.
CONF_VOLUME_START: Final = "volume_start"
CONF_VOLUME_RAMP: Final = "volume_ramp"

PHASE_PRE: Final = "pre"
PHASE_ALARM: Final = "alarm"
PHASE_SNOOZE: Final = "snooze"
PHASE_DISMISS: Final = "dismiss"
PHASE_POST: Final = "post"

# Phase -> options key of its action sequence, in the order of a wake-up.
ACTION_KEYS: Final[dict[str, str]] = {
    PHASE_PRE: CONF_PRE_ACTIONS,
    PHASE_ALARM: CONF_ALARM_ACTIONS,
    PHASE_SNOOZE: CONF_SNOOZE_ACTIONS,
    PHASE_DISMISS: CONF_DISMISS_ACTIONS,
    PHASE_POST: CONF_POST_ACTIONS,
}

# Script fields of config entry version 1, replaced by the action sequences.
LEGACY_SCRIPT_KEYS: Final[dict[str, str]] = {
    PHASE_PRE: "pre_script",
    PHASE_ALARM: "alarm_script",
    PHASE_SNOOZE: "on_snooze_script",
    PHASE_DISMISS: "on_dismiss_script",
    PHASE_POST: "post_script",
}

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
DEFAULT_POST_TIMEOUT: Final = 60
DEFAULT_RINGTONE: Final = "classic"
# Zero leaves the volume of the media player as it is.
DEFAULT_VOLUME: Final = 0
DEFAULT_VOLUME_START: Final = 10
# Zero means no ramp: the alarm rings at its volume right away.
DEFAULT_VOLUME_RAMP: Final = 0

MIN_SNOOZE_DURATION: Final = 0
MAX_SNOOZE_DURATION: Final = 30
MIN_OFFSET: Final = 0
MAX_OFFSET: Final = 60
MIN_AUTO_DISMISS: Final = 0
MAX_AUTO_DISMISS: Final = 120
MIN_POST_TIMEOUT: Final = 1
MAX_POST_TIMEOUT: Final = 240
MIN_VOLUME: Final = 0
MAX_VOLUME: Final = 100
VOLUME_STEP: Final = 5
MIN_VOLUME_RAMP: Final = 0
# The ramp never outlasts the automatic dismiss; without one, half an hour.
MAX_VOLUME_RAMP: Final = 1800
VOLUME_RAMP_STEP: Final = 10

# Bundled ringtones, one WAV file each in sounds/ (see scripts/make_ringtones.py).
RINGTONES: Final = ("classic", "digital", "chime", "gentle")

# An Echo plays no file from a URL, only sounds from Amazon's own library.
# These are the ones Home Assistant's alexa_devices integration offers; Alexa
# Media Player plays the same IDs.
ALEXA_SOUNDS: Final = (
    "air_horn_03",
    "amzn_sfx_cat_meow_1x_01",
    "amzn_sfx_church_bell_1x_02",
    "amzn_sfx_crowd_applause_01",
    "amzn_sfx_dog_med_bark_1x_02",
    "amzn_sfx_doorbell_01",
    "amzn_sfx_doorbell_chime_01",
    "amzn_sfx_doorbell_chime_02",
    "amzn_sfx_large_crowd_cheer_01",
    "amzn_sfx_lion_roar_02",
    "amzn_sfx_rooster_crow_01",
    "amzn_sfx_scifi_alarm_01",
    "amzn_sfx_scifi_alarm_04",
    "amzn_sfx_scifi_engines_on_02",
    "amzn_sfx_scifi_sheilds_up_01",
    "amzn_sfx_trumpet_bugle_04",
    "amzn_sfx_wolf_howl_02",
    "bell_02",
    "boing_01",
    "boing_03",
    "buzzers_pistols_01",
    "camera_01",
    "christmas_05",
    "clock_01",
    "futuristic_10",
    "halloween_bats",
    "halloween_crows",
    "halloween_footsteps",
    "halloween_wind",
    "halloween_wolf",
    "holiday_halloween_ghost",
    "horror_10",
    "med_system_alerts_minimal_dragon_short",
    "med_system_alerts_minimal_owl_short",
    "med_system_alerts_minimals_blue_wave_small",
    "med_system_alerts_minimals_galaxy_short",
    "med_system_alerts_minimals_panda_short",
    "med_system_alerts_minimals_tiger_short",
    "med_ui_success_generic_1-1",
    "squeaky_12",
    "zap_01",
)
DEFAULT_ALEXA_SOUND: Final = "amzn_sfx_scifi_alarm_01"
PLATFORM_ALEXA_DEVICES: Final = "alexa_devices"
PLATFORM_ALEXA_MEDIA: Final = "alexa_media"
# An Echo reports no state while it plays a sound, so the sound is repeated
# on a clock instead of when it has finished. Every repetition goes through
# Amazon's cloud, which is why this is not shorter.
ALEXA_REPEAT: Final = timedelta(seconds=5)
# How often a rising volume takes its next step. Every step is a volume_set,
# on an Echo through Amazon's cloud like the repeated sound.
VOLUME_RAMP_INTERVAL: Final = timedelta(seconds=10)
# Option of the media player select that means no sound at all.
MEDIA_PLAYER_NONE: Final = "none"

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
STATE_POST_ACTIVE: Final = "post_active"

ALARM_CLOCK_STATES: Final = [
    STATE_DISABLED,
    STATE_ARMED,
    STATE_RINGING,
    STATE_SNOOZED,
    STATE_PRE_ACTIVE,
    STATE_POST_PENDING,
    STATE_POST_ACTIVE,
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
ATTR_PHASE: Final = "phase"

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
TIMER_POST_TIMEOUT: Final = "post_timeout"

# How long after a missed end of snooze (e.g. because Home Assistant was
# restarted) the alarm is still caught up.
RESUME_GRACE: Final = timedelta(hours=1)

# ---------------------------------------------------------------------------
# Bundled Lovelace card
# ---------------------------------------------------------------------------
CARD_FILENAME: Final = "alarm-clocks-card.js"
CARD_URL: Final = f"/{DOMAIN}/{CARD_FILENAME}"
CARD_REGISTERED: Final = "card_registered"

# ---------------------------------------------------------------------------
# Bundled ringtones
# ---------------------------------------------------------------------------
SOUNDS_URL: Final = f"/{DOMAIN}/sounds"
SOUNDS_REGISTERED: Final = "sounds_registered"

STORAGE_VERSION: Final = 1
STORAGE_KEY_TEMPLATE: Final = f"{DOMAIN}.{{entry_id}}"
