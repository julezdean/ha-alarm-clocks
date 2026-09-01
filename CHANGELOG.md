# Changelog

All notable changes to this project are documented in this file. The format
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the
versioning [Semantic Versioning](https://semver.org/).

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
