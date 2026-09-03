# Changelog

All notable changes to this project are documented in this file. The format
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the
versioning [Semantic Versioning](https://semver.org/).

## [Unreleased]

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
