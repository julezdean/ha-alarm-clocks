import type { HomeAssistant } from "../types";

type Resource = Record<string, string>;

const de: Resource = {
  "status.disabled": "Deaktiviert",
  "status.armed": "Bereit",
  "status.ringing": "Klingelt",
  "status.snoozed": "Schlummert",
  "status.pre_active": "Vorlauf",
  "status.post_pending": "Nachlauf",
  "status.unknown": "Unbekannt",

  "action.snooze": "Schlummern",
  "action.dismiss": "Ausschalten",
  "action.cancel": "Abbrechen",
  "action.test": "Testen",
  "action.enable": "Wecker einschalten",
  "action.disable": "Wecker ausschalten",
  "action.toggle_day": "{day} umschalten",
  "action.decrease": "{label} verringern",
  "action.increase": "{label} erhöhen",
  "action.expand": "Aufklappen",
  "action.collapse": "Zuklappen",

  "label.no_alarm": "Kein Alarm",
  "label.one_shot": "Einmalig",
  "label.settings": "Einstellungen",
  "label.hours": "Stunden",
  "label.minutes": "Minuten",
  "label.snooze_duration": "Snooze",
  "label.pre_offset": "Vorlauf",
  "label.post_offset": "Nachlauf",
  "label.auto_dismiss": "Auto-Aus",
  "label.ringing_since": "seit {duration}",
  "label.until": "bis {time}",
  "label.post_pending": "Post-Aktion läuft",
  "label.off": "aus",
  "label.no_time": "--:--",

  "time.in": "in {duration}",
  "time.ago": "vor {duration}",
  "time.now": "jetzt",
  "time.today": "Heute",
  "time.tomorrow": "Morgen",
  "unit.day": "Tg.",
  "unit.hour": "Std.",
  "unit.minute": "Min.",
  "unit.minutes_short": "min",

  "error.unavailable": "Der Wecker ist derzeit nicht verfügbar.",
  "error.no_alarms": "Keine Wecker gefunden.",

  "editor.devices": "Wecker (leer = alle)",
  "editor.name": "Name (optional)",
  "editor.title": "Titel (optional)",
  "editor.show_days": "Wochentage anzeigen",
  "editor.show_next_alarm": "Nächsten Alarm anzeigen",
  "editor.show_settings": "Einstellungen anzeigen",
  "editor.minute_step": "Minutenschritt",
  "editor.show_test_button": "Test-Button anzeigen",
  "editor.hide_disabled": "Ausblenden, wenn deaktiviert",
  "editor.expandable": "Auf-/Zuklappen erlauben",
  "editor.expanded": "Zeilen aufgeklappt starten",
  "editor.device_expanded": "Aufgeklappt starten",
  "editor.add_device": "Wecker hinzufügen",
  "editor.edit_device": "Bearbeiten",
  "editor.remove_device": "Entfernen",
  "editor.back": "Zurück",
  "editor.pick_device": "Wecker auswählen",
};

const en: Resource = {
  "status.disabled": "Disabled",
  "status.armed": "Armed",
  "status.ringing": "Ringing",
  "status.snoozed": "Snoozed",
  "status.pre_active": "Pre phase",
  "status.post_pending": "Post action",
  "status.unknown": "Unknown",

  "action.snooze": "Snooze",
  "action.dismiss": "Dismiss",
  "action.cancel": "Cancel",
  "action.test": "Test",
  "action.enable": "Turn alarm on",
  "action.disable": "Turn alarm off",
  "action.toggle_day": "Toggle {day}",
  "action.decrease": "Decrease {label}",
  "action.increase": "Increase {label}",
  "action.expand": "Expand",
  "action.collapse": "Collapse",

  "label.no_alarm": "No alarm",
  "label.one_shot": "One-shot",
  "label.settings": "Settings",
  "label.hours": "Hours",
  "label.minutes": "Minutes",
  "label.snooze_duration": "Snooze",
  "label.pre_offset": "Pre",
  "label.post_offset": "Post",
  "label.auto_dismiss": "Auto off",
  "label.ringing_since": "for {duration}",
  "label.until": "until {time}",
  "label.post_pending": "Post action pending",
  "label.off": "off",
  "label.no_time": "--:--",

  "time.in": "in {duration}",
  "time.ago": "{duration} ago",
  "time.now": "now",
  "time.today": "Today",
  "time.tomorrow": "Tomorrow",
  "unit.day": "d",
  "unit.hour": "h",
  "unit.minute": "min",
  "unit.minutes_short": "min",

  "error.unavailable": "This alarm is currently unavailable.",
  "error.no_alarms": "No alarm clocks found.",

  "editor.devices": "Alarms (empty = all)",
  "editor.name": "Name (optional)",
  "editor.title": "Title (optional)",
  "editor.show_days": "Show weekdays",
  "editor.show_next_alarm": "Show next alarm",
  "editor.show_settings": "Show settings",
  "editor.minute_step": "Minute step",
  "editor.show_test_button": "Show test button",
  "editor.hide_disabled": "Hide when disabled",
  "editor.expandable": "Allow collapsing",
  "editor.expanded": "Start rows expanded",
  "editor.device_expanded": "Start expanded",
  "editor.add_device": "Add alarm clock",
  "editor.edit_device": "Edit",
  "editor.remove_device": "Remove",
  "editor.back": "Back",
  "editor.pick_device": "Pick an alarm clock",
};

const RESOURCES: Record<string, Resource> = { de, en };

export function languageOf(hass?: HomeAssistant): string {
  const raw = hass?.locale?.language ?? hass?.language ?? "en";
  return raw.split("-")[0].toLowerCase();
}

export type Localizer = (key: string, replacements?: Record<string, string | number>) => string;

export function createLocalizer(hass?: HomeAssistant): Localizer {
  const table = RESOURCES[languageOf(hass)] ?? en;
  return (key, replacements) => {
    let value = table[key] ?? en[key] ?? key;
    if (replacements) {
      for (const [name, replacement] of Object.entries(replacements)) {
        value = value.replace(`{${name}}`, String(replacement));
      }
    }
    return value;
  };
}
