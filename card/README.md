# Alarm Clocks Card

Source of the Lovelace cards that ship with the **Alarm Clocks & Wake-up Routines**
integration.

An alarm clock consists of 20 entities, seven of them individual weekday
switches. In a standard entities card that turns into a long, unreadable list.
These cards condense it into one view that is still operable at six in the
morning.

There is nothing to install separately: the integration ships the built bundle
in `custom_components/alarm_clocks/frontend/` and registers it with the
frontend on startup. This document covers the card options and how to build
the cards from source.

## Features

- **One field of configuration.** Only the alarm clock device is selected; the
  card finds all related entities through the entity registry.
- **State dependent interface.** Armed, ringing, snoozed, disabled and post
  pending each have their own colour, icon and actions.
- **Weekdays as a pill row** instead of seven switch rows; with no active day
  a "one-shot" badge is shown.
- **Snooze and dismiss** only appear when they actually do something.
- **Keyboard-free time input.** Hours and minutes have their own step buttons; holding one repeats and speeds up. Arrow keys work on both segments, and the mouse wheel steps a segment once it is focused. A pencil button opens the Home Assistant time dialog for exact input.
- **Collapsible settings** for snooze duration, pre offset, post offset and
  auto dismiss, with the limits taken straight from the number entities.
- **Overview card** listing all alarm clocks compactly.
- **Robust:** missing, disabled or unavailable entities produce a readable
  message instead of a JavaScript error.
- **Themes, dark mode, German and English** are picked up automatically.
- No runtime dependencies except Lit, which is bundled.

## Configuration

The minimum; everything else is optional:

```yaml
type: custom:alarm-clocks-card
device_id: 4f2c9c1d8f3e4b0a9c7d6e5f4a3b2c1d
```

The device ID is set through a picker in the visual editor, so you never have
to look it up by hand.

### Options: `custom:alarm-clocks-card`

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `device_id` | string | – | Device of the alarm clock. Can be omitted if there is exactly one alarm clock. |
| `entity` | string | – | Alternative to `device_id`: any entity of the alarm clock, from which the card derives the device. |
| `name` | string | device name | Overrides the displayed name. |
| `show_days` | boolean | `true` | Show the weekday row. |
| `show_next_alarm` | boolean | `true` | Show the remaining time and the next alarm time. |
| `show_settings` | boolean | `true` | Show the settings section. |
| `settings_expanded` | boolean | `false` | Start with the settings expanded. |
| `show_test_button` | boolean | `false` | Show a button for `alarm_clocks.trigger_alarm`. |
| `minute_step` | number | `5` | Step width of the minutes on the time stepper. |

### Options: `custom:alarm-clocks-list-card`

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | string | – | Heading of the card. |
| `devices` | list | all | Device IDs of the alarm clocks to show. Empty means all of them. |
| `show_next_alarm` | boolean | `true` | Show the remaining time instead of the state. |
| `hide_disabled` | boolean | `false` | Hide disabled alarm clocks. |

## Examples

Compact, only time and state:

```yaml
type: custom:alarm-clocks-card
device_id: 4f2c9c1d8f3e4b0a9c7d6e5f4a3b2c1d
show_days: false
show_settings: false
```

Fully equipped, with a test button for the initial setup:

```yaml
type: custom:alarm-clocks-card
device_id: 4f2c9c1d8f3e4b0a9c7d6e5f4a3b2c1d
name: Bedroom alarm
settings_expanded: true
show_test_button: true
```

Through an entity instead of the device:

```yaml
type: custom:alarm-clocks-card
entity: sensor.alarm_1_state
```

An overview of all alarm clocks with the detail card of the main one below:

```yaml
type: vertical-stack
cards:
  - type: custom:alarm-clocks-list-card
    title: Alarm clocks
    hide_disabled: true
  - type: custom:alarm-clocks-card
    device_id: 4f2c9c1d8f3e4b0a9c7d6e5f4a3b2c1d
```

Two alarm clocks side by side:

```yaml
type: grid
columns: 2
square: false
cards:
  - type: custom:alarm-clocks-card
    device_id: 4f2c9c1d8f3e4b0a9c7d6e5f4a3b2c1d
    show_settings: false
  - type: custom:alarm-clocks-card
    device_id: 9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d
    show_settings: false
```

## Supported entities

The cards work exclusively with the entities created by the Alarm Clocks
integration. They are matched through the `translation_key` from the entity
registry, so renaming the device or an entity is harmless.

| Entity | Role in the card |
| --- | --- |
| `switch.<a>_enabled` | Toggle in the top right |
| `switch.<a>_monday` … `_sunday` | Weekday row |
| `time.<a>_alarm_time` | Main value, opens the time picker |
| `sensor.<a>_state` | State display and action logic |
| `sensor.<a>_next_alarm` | Remaining time and next alarm time |
| `number.<a>_snooze_duration` | Settings |
| `number.<a>_pre_offset` | Settings |
| `number.<a>_post_offset` | Settings |
| `number.<a>_auto_dismiss` | Settings |
| `binary_sensor.<a>_ringing` | Fallback for the state, ringing duration |

Services used: `alarm_clocks.snooze`, `alarm_clocks.dismiss`,
`alarm_clocks.trigger_alarm`, `switch.toggle`, `number.set_value`.

Not shown are `sensor.<a>_snooze_until` (that point in time is already part of
`sensor.<a>_next_alarm`) and the two buttons `button.<a>_snooze` and
`button.<a>_dismiss` (the card calls the services directly so that an optional
snooze duration stays possible).

If one of these entities is missing, only the corresponding part of the card
is dropped. Entities added by a later version of the integration are ignored
until the card knows about them.

## Troubleshooting

**"Custom element doesn't exist: alarm-clocks-card"**
The resource is not loaded. Check the resource entry (the type has to be
*JavaScript module*) and hard reload the browser. On iOS, "Reset app data" in
the companion app helps as well.

**"The entities of this alarm could not be mapped"**
The selected device has no visible Alarm Clocks entities. Usually they are
disabled under **Settings → Devices & services → Entities**.

**"There is more than one alarm clock"**
Set `device_id` in the card or pick an alarm clock in the visual editor.

**The weekdays cannot be tapped**
The weekday switches are `config` entities. If they were disabled, the row is
greyed out. Re-enable them in the entity registry.

**"No alarm" although an alarm time is set**
`sensor.<a>_next_alarm` is deliberately unavailable while the alarm clock is
switched off. Switch it on and the time appears.

**Snooze does not react**
`alarm_clocks.snooze` only has an effect while the alarm is ringing or
snoozing. In every other state the card hides the button.

## Development

Requires Node.js 20 or newer.

```bash
npm install
npm run typecheck   # TypeScript without emit
npm run build       # dist/alarm-clocks-card.js
npm test            # smoke test against the bundle (jsdom)
npm run watch       # rebuild on change
```

To test against a running instance, copy the built file to
`custom_components/alarm_clocks/frontend/` on that instance and restart Home
Assistant.

Project layout:

```text
src/
├── main.ts                 registration of both cards
├── const.ts                domain, tags, states, icons
├── types.ts                local types of the frontend interface
├── styles.ts               theme tokens and shared styles
├── cards/                  alarm-clocks-card, alarm-clocks-list-card
├── components/             weekday picker, settings row
├── editors/                visual configuration editors
└── lib/                    discovery, model, actions, time, i18n
```

## Notes for working on the cards

This is a personal project; bug reports are welcome as issues, pull requests
are generally not accepted.

After any change run `npm run typecheck`, `npm run build` and `npm test`, then
copy the resulting `dist/alarm-clocks-card.js` to
`custom_components/alarm_clocks/frontend/`, because that copy is what the
integration ships. CI fails when the two files differ.

New languages go into `src/lib/localize.ts`: add the object for the language
and register it in `RESOURCES`. Missing keys fall back to English
automatically.

## License

MIT, see the [LICENSE](../LICENSE) of the repository.
