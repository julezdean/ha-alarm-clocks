# Alarm Clocks & Wake-up Routines

A native Home Assistant integration for alarm clocks with snooze, automatic
dismiss and freely assignable actions before, during and after the wake-up.

Every alarm clock is its own device with its own entities. Adding another one
is a single click on **Add integration**, with no configuration files and no
restart.

![The alarm clock card, collapsed as a compact list and with a row expanded to its full detail](https://raw.githubusercontent.com/julezdean/ha-alarm-clocks/main/images/screenshot-cards.png)

## How it works

The integration decides **when** something should happen. The one thing it
does by itself is ring: with a media player chosen, it plays a bundled
ringtone there while the alarm rings, and stops it again (see
[Alarm sound](#alarm-sound)). Everything else you notice — lights, music,
blinds, coffee — comes from your own actions, which is what makes the
wake-up yours.

A wake-up runs through five phases. Each has its own sequence of actions,
picked with the same action editor as a script and all optional, under
**Configure** on the integration entry:

| Phase | Actions start | Stopped | Typical use |
| --- | --- | --- | --- |
| Pre | the pre offset before the alarm time | only when switched off | slowly fade the lights in |
| Alarm | when the alarm rings | on snooze, on dismiss, when switched off | play music, full brightness |
| Snooze | the moment you snooze | only when switched off | lights off again |
| Dismiss | the moment the alarm ends | only when switched off | stop the music, a notification |
| Post | the post delay after the dismiss | at their time limit, when switched off | coffee machine, blinds |

Stopping a sequence also stops a script it calls directly
(`action: script.wake_up`), but not one it starts with `script.turn_on`: that
one runs detached and keeps going. Stopping ends steps, not their effects
either. Music a `media_player.play_media` started keeps playing after the alarm
actions stop, which is what the dismiss actions are for. The built-in alarm
sound is the exception: the integration stops it itself.

A direct call waits for the script to end, so the steps after it only run
once it has, and not at all when it runs until the alarm is dismissed. What
should happen alongside goes into a *Run in parallel* block with the script
call; a script called directly inside it is still stopped with the sequence:

```yaml
- parallel:
    - action: script.wake_up
    - action: light.turn_on
      target:
        entity_id: light.bedroom
```

The pre actions deliberately keep running once the alarm rings, so a pre
phase can carry on past it. The post phase lasts until the post actions are
done: the state is `post_active` while they run, and a one-shot alarm clock
switches itself off only after them. So that a sequence that never ends
cannot keep it switched on, the post actions have a time limit, 60 minutes
unless set otherwise in the post step, after which they are stopped.

Every sequence gets the data of its event as variables — `name`,
`device_id`, `entry_id` and whatever the event carries, such as `source` or
`snooze_until` — plus `phase`, and runs in the event's context, so the
logbook ties the two together.

```yaml
- action: notify.mobile_app_phone
  data:
    message: "{{ name }}: snoozed until {{ snooze_until }}"
```

Without a single action assigned, the integration is still fully functional:
it tracks the state, keeps `sensor.<a>_state` up to date and fires an event at
each of the five points. That is the alternative route — drive everything from
your own automations through the events instead of through actions. Both can
be mixed.

A pre or post offset of zero skips that phase entirely, a snooze duration of
zero disables snoozing. A running pre or post phase cannot be cancelled on
its own: `alarm_clocks.dismiss` only ends a ringing or snoozing alarm.
Switching the alarm clock off ends every phase and stops every sequence; a
ringing or snoozing alarm is dismissed properly on the way, dismiss actions
included, but no post phase follows.

When the alarm time or the weekdays change during the pre phase, the pre
phase follows the new alarm time as long as its pre start has already
passed. Otherwise it ends and starts over at the new pre start; its actions
keep running in between.

## Alarm sound

Pick a media player and a ringtone, in the card or through
`select.<a>_media_player` and `select.<a>_ringtone`. While the alarm rings,
the tone plays on that player over and over. Snoozing, dismissing — by hand
or automatically — and switching the alarm clock off stop it; when a snooze
ends, it starts over.

`number.<a>_volume` is the volume the player rings at. The player gets its
previous volume back when the sound stops, also after Home Assistant was
restarted while ringing. At zero, the default, the volume is left as it is.

Four tones ship with the integration: Classic, Digital, Chime and Gentle.
Home Assistant serves them itself, at `/alarm_clocks/sounds/<tone>.wav`, so
the media player has to reach Home Assistant under the URL set in
**Settings → System → Network**. Without a media player, the default, the
alarm stays silent, as in earlier versions.

An Echo is different: Amazon does not let it play a file from a URL. With an
Echo chosen, the ringtones are the sounds of Amazon's own library instead,
the 41 that Home Assistant's
[Alexa integration](https://www.home-assistant.io/integrations/alexa_devices/)
offers, from Sirens to Church bell. They go through that integration's
`alexa_devices.send_sound`, or for an Echo from
[Alexa Media Player](https://github.com/alandtse/alexa_media_player)
through `play_media` of type `sound`. An Echo reports nothing while it plays
one, so the sound is repeated every five seconds rather than when it ends.
Switching between an Echo and another player picks that player's default
tone — Sirens or Classic — when the chosen one does not fit.

The sound runs beside the alarm actions, not as one of them. Music that the
alarm actions start still needs dismiss actions to stop it.

## Features

- Alarm time, seven weekdays, snooze duration, pre offset, post offset and
  auto dismiss deadline as individual entities, usable in dashboards and
  automations
- An alarm without any selected weekday acts as a one-shot alarm and disables
  itself after it has rung
- Every phase can be switched off individually by setting its value to zero
- Snooze and dismiss as buttons, and every action as a service
- A built-in alarm sound on any media player, with four bundled ringtones and
  its own volume, stopped on snooze and dismiss
- Five phases with an action sequence each, every one of which also fires an
  event
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
dismiss durations. The optional actions are assigned through **Configure** on
the integration entry, one phase at a time.

## Entities

For an alarm clock named `Alarm 1`:

| Entity | Meaning |
| --- | --- |
| `switch.alarm_1_enabled` | Arm the alarm clock |
| `switch.alarm_1_monday` … `_sunday` | Weekdays (no day selected = one-shot alarm) |
| `time.alarm_1_alarm_time` | Alarm time |
| `number.alarm_1_snooze_duration` | Snooze duration in minutes (0–30, 0 = snoozing off) |
| `number.alarm_1_pre_offset` | Minutes before the alarm time for the pre phase (0–60, 0 = no pre phase) |
| `number.alarm_1_post_offset` | Minutes after the dismiss for the post phase (0–60, 0 = no post phase) |
| `number.alarm_1_auto_dismiss` | Minutes until the automatic dismiss (0 = off) |
| `select.alarm_1_media_player` | Media player the alarm sound plays on (`none` = no sound) |
| `select.alarm_1_ringtone` | Ringtone: `classic`, `digital`, `chime`, `gentle`; for an Echo one of Amazon's sounds |
| `number.alarm_1_volume` | Volume while ringing in percent (0–100, 0 = leave the player's volume alone) |
| `binary_sensor.alarm_1_ringing` | The alarm is currently ringing (read-only) |
| `sensor.alarm_1_next_alarm` | Next alarm time; the end of a snooze takes precedence |
| `sensor.alarm_1_state` | `disabled`, `armed`, `pre_active`, `ringing`, `snoozed`, `post_pending`, `post_active` |
| `sensor.alarm_1_snooze_until` | Diagnostic: end of the running snooze |
| `sensor.alarm_1_post_due` | Diagnostic: when the post actions start, while they are pending |
| `button.alarm_1_snooze` / `_dismiss` | Actions |

The first part of the entity ID comes from the name you choose when adding
the alarm; the second part is a fixed English key and is therefore identical
on every instance, regardless of the configured language. The display names,
in contrast, follow the language of Home Assistant.

## Lovelace card

The card is part of the integration. On startup it is served and registered as
a Lovelace resource automatically, so no separate installation is required. The
resource URL carries the version from `manifest.json`, so the browser picks up
the new file after an update.

If Lovelace manages its resources through YAML, the integration does not write
to that configuration. In that case the log names the URL to add manually as a
JavaScript module.

One card, `custom:alarm-clocks-card`, shows one or several alarm clocks. Each
one is a row that can be collapsed to a compact line or expanded to its full
detail: alarm time, weekdays, alarm sound, settings, snooze and dismiss.

```yaml
type: custom:alarm-clocks-card
title: Bedroom
devices:
  - device_id: 4f2c9c1d8f3e4b0a9c7d6e5f4a3b2c1d
    name: Bedroom alarm
    expanded: true
```

With no `devices`, the card shows every alarm clock it finds, sorted by name.
Every display option — weekdays, settings, the test button, whether a row can
be expanded at all and which one starts open — can be set once on the card as
the default for every alarm, and overridden per alarm, so a mix of
always-open, always-collapsed and togglable alarms can still sit in one card.
Whether opening one togglable row closes the others is a card-wide choice.
The visual editor is built for exactly this: the card-wide defaults have their
own section at the top, and past that is a list of alarms, each opened through
its own pencil icon into a detail page that also lists what that alarm sets
itself and lets you drop each back to the default. Details and
every field are in [card/README.md](card/README.md).

The card talks to the integration through the services
`alarm_clocks.snooze`, `alarm_clocks.dismiss` and
`alarm_clocks.trigger_alarm`, and finds the entities of an alarm clock through
the entity registry. An alarm clock without any visible entities there — for
example because they were all disabled — is left out of the card rather than
shown broken.

## Services

| Service | Effect |
| --- | --- |
| `alarm_clocks.snooze` | Snooze; the optional field `duration` (minutes) overrides the configured duration and also works when the configured duration is zero |
| `alarm_clocks.dismiss` | End ringing or snoozing and start the post phase; no effect in any other state, including the pre and the post phase |
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
| `alarm_clocks_dismissed` | The alarm ended (`source`: `manual`, `auto`, `cleanup`); `cleanup` when the alarm clock was switched off while ringing, snoozing or in the pre phase |
| `alarm_clocks_post_trigger` | The post delay after the dismiss has elapsed; the post actions start and the state turns `post_active` until they are done |

Every event additionally carries `entry_id`, `device_id` and `name`.
`alarm_clocks_dismissed` fires once per wake-up: switching the alarm clock off
in its post phase, which comes after the dismiss, fires no second one.

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
- Action sequences do not survive a restart of Home Assistant. A ringing alarm
  starts its alarm actions over; pre, snooze, dismiss and post actions that
  were running are not repeated. A post phase cut short this way ends the
  cycle, so a one-shot alarm clock switches itself off on startup.
- If the regular alarm time is reached while the alarm clock is already
  ringing, it is ignored and the next occurrence is scheduled.
- The alarm sound starts again when the media player reports it has
  finished, that is when it goes from playing to idle, paused or on. A
  player that never reports playing plays the tone once. A player switched
  off while ringing is left off.
- On an Echo the sound repeats every five seconds, whatever its length, so a
  short one leaves a pause and a long one is cut into. Every repetition goes
  through Amazon's cloud.
- An Echo plays only Amazon's sounds, through Home Assistant's Alexa
  integration or Alexa Media Player. Through Music Assistant or any other
  integration it is treated as an ordinary player and stays silent.
- A new media player, ringtone or volume applies from the next time the
  alarm rings, not to one that is ringing.
- The media player is stored by its entity ID. After renaming that, choose
  it again.
- The integration ships its own icon, which Home Assistant only reads from
  version 2026.3 onwards. On older versions the integrations page shows an
  "icon not available" placeholder instead. Everything else works.

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
- **The alarm sound stays silent:** check that `select.<a>_media_player`
  names a player, and the log for a warning about `play_media` or
  `send_sound`. An Echo that says direct music streaming is not supported
  was reached through an integration other than the two above. A message
  that the Home Assistant URL cannot be determined means the URLs under
  **Settings → System → Network** are not set; one the player cannot reach
  shows up as the player failing to load the file.
- **The actions of a phase do not run:** check them under **Configure**. An
  invalid sequence is refused there already; one that became invalid later,
  for example because an integration it uses was removed, is skipped with an
  error in the log. With the debug logging above, the log also shows every
  run of a sequence and each of its steps.

## Issues and contributions

Bug reports are welcome, please open an issue. This is a personal project,
so pull requests are generally not accepted; if something does not work for
your setup, an issue describing it is the more useful route.

## Development

Nothing in this section is needed to use the integration. The Lovelace card
ships pre-built and is registered automatically, so there is no build step for
users. This is only for working on the project itself.

The integration lives in `custom_components/alarm_clocks`, the Lovelace card
in `card/`.

```bash
pip install -r requirements_test.txt
# The integration depends on the frontend component, which needs the
# matching frontend package in the test environment:
pip install "home-assistant-frontend==$(python -c "import json, pathlib, homeassistant; m = pathlib.Path(homeassistant.__file__).parent / 'components/frontend/manifest.json'; print(json.loads(m.read_text())['requirements'][0].split('==')[1])")"
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
