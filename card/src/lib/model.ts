import { STATUS, UNAVAILABLE_STATES, WEEKDAYS } from "../const";
import type { AlarmStatus } from "../const";
import type { HassEntity, HomeAssistant } from "../types";
import { deviceName, discoverEntities, type MacaEntityMap, type RoleKey } from "./discovery";
import { parseTimeState, parseTimestamp } from "./time";

export interface DayView {
  index: number;
  entityId?: string;
  active: boolean;
  available: boolean;
}

export interface SettingView {
  role: RoleKey;
  labelKey: string;
  entityId: string;
  value: number;
  min: number;
  max: number;
  step: number;
  zeroMeansOff: boolean;
}

export interface AlarmView {
  deviceId: string;
  name: string;
  entities: MacaEntityMap;
  /** Every entity id the card depends on, for change detection. */
  trackedEntityIds: string[];
  status: AlarmStatus;
  available: boolean;
  enabled: boolean;
  alarmTime?: { hours: number; minutes: number };
  nextAlarm?: Date;
  snoozeUntil?: Date;
  ringingSince?: Date;
  days: DayView[];
  isOneShot: boolean;
  settings: SettingView[];
  canSnooze: boolean;
  canDismiss: boolean;
  canTest: boolean;
  /** True when not a single known entity could be mapped. */
  incomplete: boolean;
}

function stateOf(hass: HomeAssistant, entityId?: string): HassEntity | undefined {
  return entityId ? hass.states[entityId] : undefined;
}

function isUsable(entity?: HassEntity): boolean {
  return !!entity && !UNAVAILABLE_STATES.includes(entity.state);
}

function numberOf(entity?: HassEntity): number | undefined {
  if (!isUsable(entity)) {
    return undefined;
  }
  const value = Number(entity!.state);
  return Number.isFinite(value) ? value : undefined;
}

function buildSetting(
  hass: HomeAssistant,
  entities: MacaEntityMap,
  role: RoleKey,
  labelKey: string,
  zeroMeansOff: boolean,
): SettingView | undefined {
  const entityId = entities[role];
  const entity = stateOf(hass, entityId);
  const value = numberOf(entity);
  if (!entityId || value === undefined) {
    return undefined;
  }
  return {
    role,
    labelKey,
    entityId,
    value,
    min: typeof entity!.attributes.min === "number" ? entity!.attributes.min : 0,
    max: typeof entity!.attributes.max === "number" ? entity!.attributes.max : 999,
    step: typeof entity!.attributes.step === "number" ? entity!.attributes.step : 1,
    zeroMeansOff,
  };
}

/**
 * Derive the status. The status sensor is authoritative; if it is missing or
 * unavailable the state is reconstructed from the remaining entities so the
 * card stays useful instead of showing an error.
 */
function deriveStatus(
  hass: HomeAssistant,
  entities: MacaEntityMap,
): { status: AlarmStatus; available: boolean } {
  const statusEntity = stateOf(hass, entities.status);
  if (isUsable(statusEntity)) {
    return { status: statusEntity!.state as AlarmStatus, available: true };
  }

  const ringing = stateOf(hass, entities.ringing);
  const snoozing = stateOf(hass, entities.snoozeActive);
  const enabled = stateOf(hass, entities.enabled);

  if (ringing?.state === "on") {
    return { status: STATUS.RINGING, available: true };
  }
  if (snoozing?.state === "on") {
    return { status: STATUS.SNOOZED, available: true };
  }
  if (isUsable(enabled)) {
    return { status: enabled!.state === "on" ? STATUS.ARMED : STATUS.DISABLED, available: true };
  }
  return { status: "unknown", available: false };
}

export function buildAlarmView(hass: HomeAssistant, deviceId: string): AlarmView {
  const entities = discoverEntities(hass, deviceId);
  const { status, available } = deriveStatus(hass, entities);

  const enabledEntity = stateOf(hass, entities.enabled);
  const enabled = enabledEntity ? enabledEntity.state === "on" : status !== STATUS.DISABLED;

  const days: DayView[] = WEEKDAYS.map((_day, index) => {
    const entityId = entities[`day${index}` as RoleKey];
    const entity = stateOf(hass, entityId);
    return {
      index,
      entityId,
      active: entity?.state === "on",
      available: isUsable(entity),
    };
  });

  const ringingEntity = stateOf(hass, entities.ringing);
  const ringingSince =
    status === STATUS.RINGING && ringingEntity?.last_changed
      ? new Date(ringingEntity.last_changed)
      : undefined;

  const settings = [
    buildSetting(hass, entities, "snoozeDuration", "label.snooze_duration", true),
    buildSetting(hass, entities, "preOffset", "label.pre_offset", true),
    buildSetting(hass, entities, "postOffset", "label.post_offset", true),
    buildSetting(hass, entities, "autoDismiss", "label.auto_dismiss", true),
  ].filter((setting): setting is SettingView => setting !== undefined);

  const trackedEntityIds = Object.values(entities).filter(
    (entityId): entityId is string => typeof entityId === "string",
  );

  return {
    deviceId,
    name: deviceName(hass, deviceId, entities),
    entities,
    trackedEntityIds,
    status,
    available,
    enabled,
    alarmTime: parseTimeState(stateOf(hass, entities.alarmTime)),
    nextAlarm: parseTimestamp(stateOf(hass, entities.nextAlarm)),
    snoozeUntil: parseTimestamp(stateOf(hass, entities.snoozeUntil)),
    ringingSince: ringingSince && !Number.isNaN(ringingSince.getTime()) ? ringingSince : undefined,
    days,
    isOneShot: days.every((day) => !day.active),
    settings,
    // `alarm_clocks.snooze` and `alarm_clocks.dismiss` are no-ops unless the alarm rings or snoozes.
    // A snooze duration of zero switches snoozing off in the integration.
    canSnooze:
      (status === STATUS.RINGING || status === STATUS.SNOOZED) &&
      (settings.find((setting) => setting.role === "snoozeDuration")?.value ?? 0) > 0,
    canDismiss: status === STATUS.RINGING || status === STATUS.SNOOZED,
    canTest: enabled && status !== STATUS.RINGING,
    incomplete: trackedEntityIds.length === 0,
  };
}
