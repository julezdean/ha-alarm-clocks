import { UNAVAILABLE_STATES } from "../const";
import type { HassEntity } from "../types";
import type { Localizer } from "./localize";

/** Parse a timestamp sensor state into a Date, or undefined if it has none. */
export function parseTimestamp(entity?: HassEntity): Date | undefined {
  if (!entity || UNAVAILABLE_STATES.includes(entity.state)) {
    return undefined;
  }
  const parsed = new Date(entity.state);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

/** Parse a `time` entity state ("06:30:00") into hours and minutes. */
export function parseTimeState(entity?: HassEntity): { hours: number; minutes: number } | undefined {
  if (!entity || UNAVAILABLE_STATES.includes(entity.state)) {
    return undefined;
  }
  const match = /^(\d{1,2}):(\d{2})/.exec(entity.state);
  if (!match) {
    return undefined;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) {
    return undefined;
  }
  return { hours, minutes };
}

export function formatTimeState(entity: HassEntity | undefined, localize: Localizer): string {
  const parsed = parseTimeState(entity);
  if (!parsed) {
    return localize("label.no_time");
  }
  return `${String(parsed.hours).padStart(2, "0")}:${String(parsed.minutes).padStart(2, "0")}`;
}

/**
 * Human readable duration with at most two units, e.g. "7 Std. 20 Min.".
 * Durations below a minute collapse to "1 Min." so the value never reads as 0.
 */
export function formatDuration(milliseconds: number, localize: Localizer): string {
  const totalMinutes = Math.max(1, Math.round(Math.abs(milliseconds) / 60000));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];
  if (days > 0) {
    parts.push(`${days} ${localize("unit.day")}`);
    if (hours > 0) {
      parts.push(`${hours} ${localize("unit.hour")}`);
    }
  } else if (hours > 0) {
    parts.push(`${hours} ${localize("unit.hour")}`);
    if (minutes > 0) {
      parts.push(`${minutes} ${localize("unit.minute")}`);
    }
  } else {
    parts.push(`${minutes} ${localize("unit.minute")}`);
  }
  return parts.join(" ");
}

/** "in 7 Std. 20 Min." / "vor 2 Min." / "jetzt". */
export function formatRelative(target: Date, now: number, localize: Localizer): string {
  const delta = target.getTime() - now;
  if (Math.abs(delta) < 30000) {
    return localize("time.now");
  }
  const duration = formatDuration(delta, localize);
  return delta > 0
    ? localize("time.in", { duration })
    : localize("time.ago", { duration });
}

function clockFormatter(language: string): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(language, { hour: "2-digit", minute: "2-digit" });
}

export function formatClock(date: Date, language: string): string {
  return clockFormatter(language).format(date);
}

/** "Heute, 06:30" / "Morgen, 06:30" / "Fr., 06:30". */
export function formatAbsolute(date: Date, now: number, language: string, localize: Localizer): string {
  const today = new Date(now);
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const dayOffset = Math.floor((date.getTime() - startOfToday) / 86400000);
  const time = formatClock(date, language);

  if (dayOffset === 0) {
    return `${localize("time.today")}, ${time}`;
  }
  if (dayOffset === 1) {
    return `${localize("time.tomorrow")}, ${time}`;
  }
  const weekday = new Intl.DateTimeFormat(language, { weekday: "short" }).format(date);
  return `${weekday}, ${time}`;
}

const weekdayCache = new Map<string, string[]>();

/**
 * Localized weekday names starting at Monday, matching the integration's order.
 * 2024-01-01 is a Monday, so it works as a stable reference week.
 */
export function weekdayLabels(language: string, style: "short" | "narrow" | "long"): string[] {
  const cacheKey = `${language}|${style}`;
  const cached = weekdayCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  const formatter = new Intl.DateTimeFormat(language, { weekday: style });
  const labels: string[] = [];
  for (let index = 0; index < 7; index += 1) {
    labels.push(formatter.format(new Date(Date.UTC(2024, 0, 1 + index, 12))));
  }
  weekdayCache.set(cacheKey, labels);
  return labels;
}
