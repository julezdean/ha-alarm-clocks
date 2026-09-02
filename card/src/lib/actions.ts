import { ALARM_CLOCKS_DOMAIN } from "../const";
import type { HomeAssistant } from "../types";

export function fireEvent<T>(node: HTMLElement, type: string, detail?: T): void {
  node.dispatchEvent(
    new CustomEvent(type, { detail, bubbles: true, composed: true, cancelable: false }),
  );
}

export function showMoreInfo(node: HTMLElement, entityId: string): void {
  fireEvent(node, "hass-more-info", { entityId });
}

export function snooze(hass: HomeAssistant, deviceId: string, duration?: number): Promise<unknown> {
  return hass.callService(
    ALARM_CLOCKS_DOMAIN,
    "snooze",
    duration === undefined ? {} : { duration },
    { device_id: deviceId },
  );
}

export function dismiss(hass: HomeAssistant, deviceId: string): Promise<unknown> {
  return hass.callService(ALARM_CLOCKS_DOMAIN, "dismiss", {}, { device_id: deviceId });
}

export function triggerAlarm(hass: HomeAssistant, deviceId: string): Promise<unknown> {
  return hass.callService(ALARM_CLOCKS_DOMAIN, "trigger_alarm", {}, { device_id: deviceId });
}

export function toggleSwitch(hass: HomeAssistant, entityId: string): Promise<unknown> {
  return hass.callService("switch", "toggle", {}, { entity_id: entityId });
}

export function setNumber(
  hass: HomeAssistant,
  entityId: string,
  value: number,
): Promise<unknown> {
  return hass.callService("number", "set_value", { value }, { entity_id: entityId });
}

export function setTime(
  hass: HomeAssistant,
  entityId: string,
  hours: number,
  minutes: number,
): Promise<unknown> {
  const time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
  return hass.callService("time", "set_value", { time }, { entity_id: entityId });
}
