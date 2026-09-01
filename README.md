# Alarm Clocks & Wake-up Routines

A native Home Assistant integration for alarm clocks with snooze, automatic
dismiss and freely assignable scripts before, during and after the wake-up.

Every alarm clock is its own device with its own entities. Adding another one
is a single click on **Add integration**, with no configuration files and no
restart.

## How it works

The integration decides **when** something should happen. It never makes a
sound and never switches a light by itself: there is no built-in siren, no
media player and no light control. Everything you actually notice comes from
your own scripts, which is what makes the wake-up yours.

There are five points where the integration calls a script, all optional and
all assigned under **Configure** on the integration entry:

| Script | Runs | Typical use |
| --- | --- | --- |
| Pre | the pre offset before the alarm time | slowly fade the lights in |
| Alarm | while the alarm is ringing | play music, full brightness |
| Snooze | the moment you snooze | lights off again |
| Dismiss | the moment the alarm ends | a notification |
| Post | the post offset after the dismiss | coffee machine, blinds |

The alarm script is stopped automatically on snooze and on dismiss, so a
script that loops or fades over several minutes does not keep running.

Without a single script assigned, the integration is still fully functional:
it tracks the state, keeps `sensor.<a>_state` up to date and fires an event at
each of the five points. That is the alternative route — drive everything from
your own automations through the events instead of through scripts. Both can
be mixed.

Each phase can also be switched off: a pre or post offset of zero skips that
phase entirely, a snooze duration of zero disables snoozing.

## Features

- Alarm time, seven weekdays, snooze duration, pre offset, post offset and
  auto dismiss deadline as individual entities, usable in dashboards and
  automations
- An alarm without any selected weekday acts as a one-shot alarm and disables
  itself after it has rung
- Every phase can be switched off individually by setting its value to zero
- Snooze and dismiss as buttons, and every action as a service
- Five hook points for your own scripts, each of which also fires an event
- Event driven: no polling and no per-minute tick, just one timer per
  relevant point in time. The next alarm is a timestamp sensor, from which the
  frontend renders the remaining time as "in 7 hours"
- A running snooze and a pending post action survive a restart of Home
  Assistant
- Daylight saving time is handled as wall clock time; times that do not exist
  on a given day are moved to the first valid point in time

## Installation

### HACS

1. HACS → Integrations → three-dot menu → **Custom repositories**
2. Add the repository URL, category **Integration**
3. Install "Alarm Clocks & Wake-up Routines"
4. Restart Home Assistant

### Manual

1. Copy the folder `custom_components/alarm_clocks` to
   `config/custom_components/alarm_clocks`
2. Restart Home Assistant

## Setup

**Settings → Devices & services → Integrations → Add integration →
Alarm Clocks & Wake-up Routines**

The form only asks for a **name**. It becomes the device name (for example
`Alarm 1`) and determines the entity IDs.

Everything else is configured afterwards through the entities of the alarm
clock: alarm time, weekdays, snooze duration and the pre, post and auto
dismiss durations. The optional scripts are assigned through **Configure** on
the integration entry.

## Entities

For an alarm clock named `Alarm 1`:

| Entity | Meaning |
| --- | --- |
| `switch.alarm_1_enabled` | Arm the alarm clock |
| `switch.alarm_1_monday` … `_sunday` | Weekdays (no day selected = one-shot alarm) |
| `time.alarm_1_alarm_time` | Alarm time |
| `number.alarm_1_snooze_duration` | Snooze duration in minutes (0–30, 0 = snoozing off) |
| `number.alarm_1_pre_offset` | Minutes before the alarm time for the pre phase (0–60, 0 = no pre phase) |
| `number.alarm_1_post_offset` | Minutes after the dismiss for the post action (0–60, 0 = no post action) |
| `number.alarm_1_auto_dismiss` | Minutes until the automatic dismiss (0 = off) |
| `binary_sensor.alarm_1_ringing` | The alarm is currently ringing (read-only) |
| `sensor.alarm_1_next_alarm` | Next alarm time; the end of a snooze takes precedence |
| `sensor.alarm_1_state` | `disabled`, `armed`, `pre_active`, `ringing`, `snoozed`, `post_pending` |
| `sensor.alarm_1_snooze_until` | Diagnostic: end of the running snooze |
| `button.alarm_1_snooze` / `_dismiss` | Actions |

The first part of the entity ID comes from the name you choose when adding
the alarm; the second part is a fixed English key and is therefore identical
on every instance, regardless of the configured language. The display names,
in contrast, follow the language of Home Assistant.

## Lovelace card

The card is part of the integration and is served and registered with the
frontend automatically on startup. Neither a separate installation nor an
entry under **Dashboards → Resources** is required. After an update of the
integration the browser picks up the new version, because the URL carries the
version from `manifest.json` as a parameter.

Two cards are included.

### `custom:alarm-clocks-card`

A single alarm clock with state, alarm time, weekdays and snooze and dismiss
buttons.

```yaml
type: custom:alarm-clocks-card
device_id: <device ID of the alarm clock>
title: Bedroom
show_days: true
show_next_alarm: true
show_settings: true
settings_expanded: false
show_test_button: false
```

Every field except `device_id` is optional, and the card can be configured
entirely through the graphical card editor. If there is exactly one alarm
clock, the card finds it by itself.

### `custom:alarm-clocks-list-card`

All alarm clocks below each other.

```yaml
type: custom:alarm-clocks-list-card
devices: []          # empty = all alarm clocks
hide_disabled: false
show_next_alarm: true
```

The cards talk to the integration through the services
`alarm_clocks.snooze`, `alarm_clocks.dismiss` and
`alarm_clocks.trigger_alarm`, and find the entities of an alarm clock through
the entity registry. If individual entities are disabled there, the card
shows a corresponding hint.

## Services

| Service | Effect |
| --- | --- |
| `alarm_clocks.snooze` | Snooze; the optional field `duration` (minutes) overrides the configured duration and also works when the configured duration is zero |
| `alarm_clocks.dismiss` | End ringing or snoozing and start the post action |
| `alarm_clocks.trigger_alarm` | Trigger the alarm immediately (test) |
| `alarm_clocks.set_alarm` | Set the fields `time` and/or `days` |

The target is always the alarm clock device or one of its entities.

```yaml
action: alarm_clocks.snooze
target:
  device_id: <device ID of the alarm clock>
data:
  duration: 5
```

```yaml
action: alarm_clocks.set_alarm
target:
  device_id: <device ID of the alarm clock>
data:
  time: "06:30:00"
  days: [mon, tue, wed, thu, fri]
```

## Events

| Event | When |
| --- | --- |
| `alarm_clocks_pre_trigger` | The pre offset before the alarm time is reached; the state turns `pre_active` until the alarm rings |
| `alarm_clocks_alarm_triggered` | The alarm starts (`source`: `schedule`, `manual`, `snooze_end`) |
| `alarm_clocks_snoozed` | A snooze started (`duration`, `snooze_until`) |
| `alarm_clocks_dismissed` | The alarm ended (`source`: `manual`, `auto`, `cleanup`) |
| `alarm_clocks_post_trigger` | The post offset after the dismiss has elapsed |

Every event additionally carries `entry_id`, `device_id` and `name`.

```yaml
triggers:
  - trigger: event
    event_type: alarm_clocks_alarm_triggered
conditions:
  - condition: template
    value_template: "{{ trigger.event.data.name == 'Alarm 1' }}"
actions:
  - action: light.turn_on
    target:
      entity_id: light.bedroom
    data:
      brightness_pct: 20
      color_temp_kelvin: 2200
```

## Known limitations

- `binary_sensor.<a>_ringing` is read-only. Use `alarm_clocks.trigger_alarm`
  and `alarm_clocks.dismiss` to change it.
- A snooze whose end fell into a downtime of Home Assistant is only caught up
  within one hour, and discarded afterwards.
- A regular alarm time that falls entirely into a downtime is skipped.
- If the regular alarm time is reached while the alarm clock is already
  ringing, it is ignored and the next occurrence is scheduled.

## Troubleshooting

Enable debug logging:

```yaml
logger:
  default: warning
  logs:
    custom_components.alarm_clocks: debug
```

- **The alarm does not go off:** check `switch.<a>_enabled` and verify that
  `sensor.<a>_next_alarm` shows a point in time in the future. Without a
  selected weekday the alarm rings every day until it disables itself after
  the first wake-up.
- **The alarm script does not run:** check the assignment under
  **Configure**; if the script entity is missing, the log contains a warning.

## Issues and contributions

Bug reports are welcome, please open an issue. This is a personal project,
so pull requests are generally not accepted; if something does not work for
your setup, an issue describing it is the more useful route.

## Development

Nothing in this section is needed to use the integration. The Lovelace cards
ship pre-built and are registered automatically, so there is no build step for
users. This is only for working on the project itself.

The integration lives in `custom_components/alarm_clocks`, the Lovelace cards
in `card/`.

```bash
pip install -r requirements_test.txt
pytest

cd card
npm ci
npm run typecheck
npm test
npm run build      # writes dist/alarm-clocks-card.js
```

After a card build, copy `card/dist/alarm-clocks-card.js` to
`custom_components/alarm_clocks/frontend/`, which is the copy the integration
ships. CI fails when the two files differ.

Card options are documented in [card/README.md](card/README.md).
