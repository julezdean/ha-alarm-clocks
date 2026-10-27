import { MEDIA_PLAYER_NONE, STATUS, UNAVAILABLE_STATES, WEEKDAYS } from "../const";
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
  /** Unit after the value; minutes when unset. */
  unitKey?: string;
  /** What zero reads as when `zeroMeansOff`; "off" when unset. */
  zeroLabelKey?: string;
}

export interface SoundOption {
  value: string;
  /** Display name: a player's friendly name, or a localisation key for the rest. */
  label: string;
  labelIsKey: boolean;
}

/** The built-in alarm sound: which speaker, which ringtone, how loud. */
export interface SoundView {
  mediaPlayerEntity: string;
  player: string;
  players: SoundOption[];
  ringtoneEntity?: string;
  ringtone?: string;
  ringtones: SoundOption[];
  volume?: SettingView;
  /** Where a rising volume starts, and how long it rises; absent with an older integration. */
  volumeStart?: SettingView;
  volumeRamp?: SettingView;
  /** True while a speaker is chosen, so that the tone and volume matter. */
  enabled: boolean;
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
  /** Start of the post actions while they are pending; absent without `sensor.<alarm>_post_due`. */
  postDue?: Date;
  ringingSince?: Date;
  days: DayView[];
  isOneShot: boolean;
  settings: SettingView[];
  /** Absent with an integration older than the sound, or its select disabled. */
  sound?: SoundView;
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

function buildSound(hass: HomeAssistant, entities: MacaEntityMap): SoundView | undefined {
  const mediaPlayerEntity = entities.mediaPlayer;
  const playerState = stateOf(hass, mediaPlayerEntity);
  // Not `isUsable`: "none" is a real option here, the one for no sound.
  if (
    !mediaPlayerEntity ||
    !playerState ||
    (playerState.state !== MEDIA_PLAYER_NONE && !isUsable(playerState))
  ) {
    return undefined;
  }
  const options = Array.isArray(playerState!.attributes.options)
    ? (playerState!.attributes.options as string[])
    : [];
  const players = options.map((value) =>
    value === MEDIA_PLAYER_NONE
      ? { value, label: "label.no_sound", labelIsKey: true }
      : {
          value,
          label: String(hass.states[value]?.attributes.friendly_name ?? value),
          labelIsKey: false,
        },
  );
  // Speakers by name, "no sound" first.
  players.sort((a, b) =>
    a.labelIsKey === b.labelIsKey ? a.label.localeCompare(b.label) : a.labelIsKey ? -1 : 1,
  );

  const ringtoneState = stateOf(hass, entities.ringtone);
  const ringtones =
    isUsable(ringtoneState) && Array.isArray(ringtoneState!.attributes.options)
      ? (ringtoneState!.attributes.options as string[]).map((value) => ({
          value,
          label: `ringtone.${value}`,
          labelIsKey: true,
        }))
      : [];

  const volume = buildSetting(hass, entities, "volume", "label.volume", true);
  const volumeStart = buildSetting(hass, entities, "volumeStart", "label.volume_start", false);
  const volumeRamp = buildSetting(hass, entities, "volumeRamp", "label.volume_ramp", true);
  return {
    mediaPlayerEntity,
    player: playerState!.state,
    players,
    ringtoneEntity: ringtones.length ? entities.ringtone : undefined,
    ringtone: ringtones.length ? ringtoneState!.state : undefined,
    ringtones,
    volume: volume && {
      ...volume,
      unitKey: "unit.percent",
      zeroLabelKey: "label.volume_unchanged",
    },
    volumeStart: volumeStart && { ...volumeStart, unitKey: "unit.percent" },
    volumeRamp: volumeRamp && { ...volumeRamp, unitKey: "unit.seconds_short" },
    enabled: playerState!.state !== MEDIA_PLAYER_NONE,
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
    postDue: parseTimestamp(stateOf(hass, entities.postDue)),
    ringingSince: ringingSince && !Number.isNaN(ringingSince.getTime()) ? ringingSince : undefined,
    days,
    isOneShot: days.every((day) => !day.active),
    settings,
    sound: buildSound(hass, entities),
    // `alarm_clocks.snooze` is a no-op unless the alarm rings or snoozes. A
    // snooze duration of zero switches snoozing off in the integration.
    canSnooze:
      (status === STATUS.RINGING || status === STATUS.SNOOZED) &&
      (settings.find((setting) => setting.role === "snoozeDuration")?.value ?? 0) > 0,
    // `alarm_clocks.dismiss` only ends ringing or snoozing; the pre and the
    // post phase cannot be cancelled, only switching the alarm off ends them.
    canDismiss: status === STATUS.RINGING || status === STATUS.SNOOZED,
    canTest: enabled && status !== STATUS.RINGING,
    incomplete: trackedEntityIds.length === 0,
  };
}
