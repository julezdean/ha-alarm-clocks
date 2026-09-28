# Changelog

All notable changes to this project are documented in this file. The format
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the
versioning [Semantic Versioning](https://semver.org/).

## [3.0.0] - 2026-09-28

Every phase of a wake-up now has a sequence of actions instead of a single
script. Assigned scripts are migrated on the first start, see **Breaking
changes** for what that changes in their behaviour.

Coming from 1.x, read the 2.0.0 notes below as well: they hold the changes
to the card, which dashboards need adjusted by hand. The cancelling of the
pre and post phase that 2.0.0 added is removed again here.

### Breaking changes

- The five script fields are replaced by one action sequence per phase. The
  config entry is migrated on the first start: every assigned script becomes
  a sequence calling it directly (`action: script.<key>`), by the script's key
  from the entity registry, which differs from its entity ID once that was
  renamed. The entry moves to version 2, which a 2.x release refuses to load;
  going back needs the backup from before the update. Entries migrated by
  3.0.0-beta.1, which used the entity ID and so could call a script that does
  not exist, are repaired on the first start as well.
- Because the migrated scripts are called directly, switching the alarm clock
  off now stops every one of them that is still running, not only the alarm
  script. The post script is waited for as well: the post phase lasts until it
  is done, under the new state `post_active`, and a one-shot alarm clock only
  switches itself off after it (within the post time limit, 60 minutes by
  default).
- The pre and the post phase can no longer be cancelled. `alarm_clocks.dismiss`
  only ends a ringing or snoozing alarm and does nothing in the pre phase or
  while the post phase is pending, and the card no longer offers "Cancel"
  there. Switching the alarm clock off ends both. Cancelling a single
  occurrence of a recurring alarm clock once its pre phase has started is
  gone with it.
- `sensor.<a>_state` has the additional value `post_active`.

### Added

- The options of an alarm clock are a menu of the five phases, each with an
  action editor as in a script. Every sequence gets the data of its event as
  variables plus `phase`, and runs in the event's context.
- A time limit for the post actions, set in the post step (1–240 minutes,
  60 by default). Post actions still running after it are stopped, so that a
  sequence that never ends cannot keep a one-shot alarm clock switched on.
- `sensor.<a>_post_due`, a diagnostic timestamp of when the post actions
  start while they are pending.
- The card shows the pre and the post phase with the time left: until the
  alarm in the pre phase, until the post actions while they are pending.

### Changed

- Switching the alarm clock off ends every phase and stops every running
  sequence. A ringing or snoozing alarm is still dismissed properly, dismiss
  actions included, but no post phase is scheduled any more. Switched off in
  the pre phase, `alarm_clocks_dismissed` fires with `source: cleanup`; in the
  post phase, which comes after the dismiss, no second one fires.
- When the alarm time or the weekdays change during the pre phase, the pre
  phase follows the new alarm time as long as its pre start has passed, and
  otherwise ends and starts over at the new pre start. Setting or enabling an
  alarm inside its pre window no longer enters the pre phase without having
  started it.
- The number entities for the pre and post offset are named "Pre offset" and
  "Post delay" (German "Pre-Vorlauf" and "Post-Verzögerung"), without the
  word script. Their entity IDs are unchanged.

### Fixed

- A pre phase whose alarm was moved kept counting down to the old alarm time,
  and switching the alarm clock off during the pre phase left the pre script
  running.
- The card's German text for a pending post action said it was running.

## [2.0.0] - 2026-09-28

The two Lovelace cards are now one, and its configuration changed with it.
Dashboards set up with 1.x need their cards adjusted, see **Breaking
changes** below. The integration itself, its entities, services and events
are unchanged apart from the addition to `alarm_clocks.dismiss`.

### Breaking changes

- `custom:alarm-clocks-list-card` no longer exists and shows as an unknown
  custom element. Use `custom:alarm-clocks-card` with `expandable: false`;
  `title`, `devices`, `show_next_alarm` and `hide_disabled` mean the same
  there.

  ```yaml
  type: custom:alarm-clocks-card
  expandable: false
  ```

- `custom:alarm-clocks-card` no longer reads `device_id`, `entity` or `name`
  on the card. Without `devices` it now shows every alarm clock, collapsed.
  The single, always open alarm clock of 1.x is:

  ```yaml
  type: custom:alarm-clocks-card
  devices:
    - device_id: 4f2c9c1d8f3e4b0a9c7d6e5f4a3b2c1d
      name: Bedroom            # only if the card had a name
  expandable: false
  expanded: true
  ```

- `settings_expanded` is gone. An expanded alarm shows its settings directly,
  without a second toggle; `show_settings: false` still hides them.

### Changed

- One card, `custom:alarm-clocks-card`, for one or any number of alarm clocks.
  Each is a row that collapses to a compact line with name, state, time and
  switch, or expands to the full detail. The list card and the detail card
  covered almost the same ground and forced one layout per card; now a card
  holds several alarms and each can be looked at in full without a second
  card.
- Whether a row can be toggled at all (`expandable`), whether it starts open
  (`expanded`) and whether opening one row closes the others (`accordion`) are
  options. Always open, always collapsed and togglable alarms can sit in the
  same card.
- Every display option can be set once on the card as the default for all
  alarms and overridden per alarm, together with a name of its own, by listing
  the alarm in `devices` as an object instead of a plain device ID. An
  explicit list keeps the order it is given in.
- The alarm time no longer has an edit button that opens the Home Assistant
  time dialog. The step buttons, arrow keys and mouse wheel cover exact input.

### Added

- `alarm_clocks.dismiss`, and the card's dismiss button, now also cancel a
  running pre phase or a pending post action; the card offers it as "Cancel"
  in those two states. Cancelling the pre phase skips only that one
  occurrence and leaves the alarm clock armed for its next one, cancelling
  the post action skips its script. Until now a wake-up that was no longer
  wanted could only be waited out or stopped by switching the alarm clock off.
- A visual editor for all of this: the card-wide defaults under their own
  heading, a list of alarms each with its own detail page, and on that page
  the fields the alarm sets itself, each of which can be dropped to follow the
  card again. Adding an alarm only offers the ones not yet in the card.

## [1.1.5] - 2026-09-08

### Changed

- HACS now installs the integration from an `alarm_clocks.zip` asset attached
  to the release instead of from the repository tree. GitHub only counts
  downloads of release assets, which is why the integration showed a star and
  an issue count in HACS but no download figure, unlike repositories that ship
  a release asset. A release workflow builds the archive from
  `custom_components/alarm_clocks/` and attaches it when a release is
  published, after checking that the tag matches the version in
  `manifest.json`. Releases up to 1.1.4 keep installing the way they did,
  since their `hacs.json` does not ask for a zip.

## [1.1.4] - 2026-09-07

### Fixed

- The card bundle shipped in 1.1.3 was the one built before the console banner
  was recoloured, so the released card still logged the old colours. Only the
  banner in the browser console was affected, nothing in the user interface.
- The build now writes the shipped bundle itself, as a second Rollup output,
  instead of leaving it to be copied by hand. That is what went wrong above: the
  bundle under `custom_components/` could fall behind `card/src` without anything
  noticing until the CI check ran, which is after the push. Watch builds still
  write only `dist/`, since they are unminified and would disagree with a
  production build of the same source.

## [1.1.3] - 2026-09-07

### Changed

- New brand icon. It shows what the integration does rather than the device it
  is named after: the ring is the cycle, the thickened arc is the span the
  wake-up occupies from the pre offset to the post offset, and the alarm moment
  sits on it as the only element at full opacity. The icon ships with the
  integration instead of being submitted to the brands repository, which Home
  Assistant reads from version 2026.3 onwards; older versions show a placeholder
  on the integrations page.
- The card's console banner follows the icon's amber instead of Home Assistant
  blue. Dark text on the badge, since white on that amber sits at about 1.96:1.

## [1.1.2] - 2026-09-03

### Fixed

- The cards no longer overlap their neighbours in the sections view. They
  reported a fixed row count to the grid, which the layout reads only once, so
  expanding the settings or adding an alarm grew the content beyond its cell.
  Buttons that ended up outside the cell could not be clicked. Both cards now
  size their row to the rendered content.

## [1.1.1] - 2026-09-02

### Fixed

- The `duration` field of the `snooze` service accepted a minimum of 1 minute in
  the user interface, while the service itself accepts 0. A duration of 0
  switches snoozing off and can now be selected in the user interface as well.

## [1.1.0] - 2026-09-02

### Changed

- The alarm time on the card can now be set without a keyboard. Hours and
  minutes have their own large step buttons and holding one repeats and speeds
  up. Arrow keys work on both segments, and the mouse wheel steps a segment
  once it is focused. The Home Assistant time dialog is still one tap away.
- The minute step is configurable per card through `minute_step` (default 5).
- Stepping updates the display immediately and sends one service call once the
  input settles, instead of one call per step. The stepped value stays visible
  until the entity confirms it, so the time no longer jumps back to the previous
  value while the update is on its way.

### Removed

- Swiping vertically over the digits no longer changes the time. It was too easy
  to trigger by accident while scrolling a dashboard on a touch screen.

## [1.0.5] - 2026-09-01

### Fixed

- The bundled Lovelace card is now registered as a real Lovelace resource
  instead of relying on `frontend.add_extra_js_url`, which did not reach the
  frontend on every setup and left the cards reported as unknown custom
  elements. An existing manual resource entry for the card is reused and kept
  up to date instead of being duplicated. When Lovelace manages its resources
  through YAML, the log explains which URL to add by hand.

## [1.0.2] - 2026-09-01

### Added

- Brand images shipped with the integration in `custom_components/alarm_clocks/brand/`,
  so Home Assistant shows the icon without a detour through the brands repository
  (requires Home Assistant 2026.3 or newer)

## [1.0.1] - 2026-09-01

### Changed

- Dashboard screenshot in the README

## [1.0.0] - 2026-08-31

### Added

- Alarm clocks as config entries: one device with its own entities per alarm,
  added through **Settings → Devices & services → Add integration**
- Entities per alarm clock: enable switch, seven weekday switches, alarm time,
  snooze duration, pre offset, post offset, auto dismiss, ringing binary
  sensor, next alarm, state and snooze until sensors, snooze and dismiss
  buttons
- A snooze duration, pre offset or post offset of zero switches that phase off
  entirely, including its script and event
- Five states covering the whole cycle: `disabled`, `armed`, `pre_active`,
  `ringing`, `snoozed` and `post_pending`
- Optional scripts for alarm, pre, post, snooze and dismiss, assigned through
  the options flow
- Services `snooze`, `dismiss`, `trigger_alarm` and `set_alarm`, targeting the
  alarm clock device or any of its entities
- Events `alarm_clocks_pre_trigger`, `alarm_clocks_alarm_triggered`,
  `alarm_clocks_snoozed`, `alarm_clocks_dismissed` and
  `alarm_clocks_post_trigger`
- Running snooze and pending post action survive a restart of Home Assistant
- Bundled Lovelace cards `custom:alarm-clocks-card` and
  `custom:alarm-clocks-list-card`, served and registered automatically
- English and German translations
