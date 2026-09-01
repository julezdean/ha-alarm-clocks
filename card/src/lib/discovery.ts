import { ALARM_CLOCKS_DOMAIN, WEEKDAYS } from "../const";
import type { HomeAssistant } from "../types";

/**
 * Roles an Alarm Clocks entity can play. The integration sets
 * `translation_key = key` on every entity (see `AlarmClockEntity.__init__`),
 * so `<domain>.<translation_key>` identifies the role unambiguously and
 * survives renaming of the entity or the device.
 */
export type RoleKey =
  | "enabled"
  | "alarmTime"
  | "snoozeDuration"
  | "preOffset"
  | "postOffset"
  | "autoDismiss"
  | "ringing"
  | "snoozeActive"
  | "nextAlarm"
  | "status"
  | "snoozeUntil"
  | "snoozeButton"
  | "dismissButton"
  | "day0"
  | "day1"
  | "day2"
  | "day3"
  | "day4"
  | "day5"
  | "day6";

const ROLE_BY_REGISTRY_KEY: Record<string, RoleKey> = {
  "switch.enabled": "enabled",
  "time.alarm_time": "alarmTime",
  "number.snooze_duration": "snoozeDuration",
  "number.pre_offset": "preOffset",
  "number.post_offset": "postOffset",
  "number.auto_dismiss": "autoDismiss",
  "binary_sensor.ringing": "ringing",
  "binary_sensor.snooze_active": "snoozeActive",
  "sensor.next_alarm": "nextAlarm",
  "sensor.state": "status",
  "sensor.snooze_until": "snoozeUntil",
  "button.snooze": "snoozeButton",
  "button.dismiss": "dismissButton",
  ...Object.fromEntries(
    WEEKDAYS.map((day, index) => [`switch.day_${day}`, `day${index}` as RoleKey]),
  ),
};

export type MacaEntityMap = Partial<Record<RoleKey, string>>;

function domainOf(entityId: string): string {
  return entityId.split(".", 1)[0];
}

function isMacaEntity(hass: HomeAssistant, entityId: string): boolean {
  return hass.entities?.[entityId]?.platform === ALARM_CLOCKS_DOMAIN;
}

/** All device ids that have at least one entity from the Alarm Clocks integration. */
export function findMacaDevices(hass: HomeAssistant): string[] {
  const devices = new Set<string>();
  for (const entry of Object.values(hass.entities ?? {})) {
    if (entry.platform === ALARM_CLOCKS_DOMAIN && entry.device_id) {
      devices.add(entry.device_id);
    }
  }
  return [...devices];
}

/** Resolve the device a card config points at. */
export function resolveDeviceId(
  hass: HomeAssistant,
  config: { device_id?: string; entity?: string },
): { deviceId?: string; error?: "none" | "multiple" | "not_found" } {
  if (config.device_id) {
    return hass.devices?.[config.device_id]
      ? { deviceId: config.device_id }
      : { error: "not_found" };
  }

  if (config.entity) {
    const deviceId = hass.entities?.[config.entity]?.device_id;
    return deviceId ? { deviceId } : { error: "not_found" };
  }

  const candidates = findMacaDevices(hass);
  if (candidates.length === 1) {
    return { deviceId: candidates[0] };
  }
  return { error: candidates.length === 0 ? "none" : "multiple" };
}

/**
 * Map every Alarm Clocks entity of a device to its role. Unknown translation keys are
 * ignored, so entities added by a later version of the integration cannot
 * break the card.
 */
export function discoverEntities(hass: HomeAssistant, deviceId: string): MacaEntityMap {
  const map: MacaEntityMap = {};
  for (const entry of Object.values(hass.entities ?? {})) {
    if (entry.device_id !== deviceId || entry.platform !== ALARM_CLOCKS_DOMAIN) {
      continue;
    }
    if (!entry.translation_key) {
      continue;
    }
    const role = ROLE_BY_REGISTRY_KEY[`${domainOf(entry.entity_id)}.${entry.translation_key}`];
    if (role) {
      map[role] = entry.entity_id;
    }
  }
  return map;
}

/** Display name of a device, falling back to the status entity. */
export function deviceName(hass: HomeAssistant, deviceId: string, entities: MacaEntityMap): string {
  const device = hass.devices?.[deviceId];
  const fromDevice = device?.name_by_user || device?.name;
  if (fromDevice) {
    return fromDevice;
  }
  const statusEntity = entities.status ? hass.states[entities.status] : undefined;
  return statusEntity?.attributes.friendly_name ?? deviceId;
}

export { isMacaEntity };
