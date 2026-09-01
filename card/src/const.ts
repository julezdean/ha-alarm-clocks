export const CARD_VERSION = "1.0.0";

/** Domain of the Alarm Clocks integration. */
export const ALARM_CLOCKS_DOMAIN = "alarm_clocks";

export const ALARM_CARD_TAG = "alarm-clocks-card";
export const ALARM_CARD_EDITOR_TAG = "alarm-clocks-card-editor";
export const LIST_CARD_TAG = "alarm-clocks-list-card";
export const LIST_CARD_EDITOR_TAG = "alarm-clocks-list-card-editor";

export const REPO_URL = "https://github.com/julezdean/ha-alarm-clocks";

/** Weekday order used by the integration (0 = Monday). */
export const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type Weekday = (typeof WEEKDAYS)[number];

/** States of `sensor.<alarm>_status`, mirrored from const.py. */
export const STATUS = {
  DISABLED: "disabled",
  ARMED: "armed",
  RINGING: "ringing",
  SNOOZED: "snoozed",
  PRE_ACTIVE: "pre_active",
  POST_PENDING: "post_pending",
} as const;

export type AlarmStatus = (typeof STATUS)[keyof typeof STATUS] | "unknown";

export const UNAVAILABLE_STATES = ["unavailable", "unknown", "none", ""];

export const STATUS_ICONS: Record<AlarmStatus, string> = {
  disabled: "mdi:alarm-off",
  armed: "mdi:alarm-check",
  ringing: "mdi:bell-ring",
  snoozed: "mdi:alarm-snooze",
  pre_active: "mdi:weather-sunset-up",
  post_pending: "mdi:clock-end",
  unknown: "mdi:alarm-note",
};
