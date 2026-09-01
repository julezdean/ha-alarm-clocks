"""State machine and scheduling of a single alarm clock.

The coordinator works purely event driven: there is no polling and no
per-minute tick, just one timer for every relevant point in time.
"""

from __future__ import annotations

import logging
from datetime import datetime, time as dt_time, timedelta
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EVENT_CORE_CONFIG_UPDATE, EVENT_HOMEASSISTANT_STARTED
from homeassistant.core import CALLBACK_TYPE, CoreState, Event, HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError, ServiceNotFound
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.event import async_track_point_in_time
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator
from homeassistant.util import dt as dt_util

from .const import (
    ATTR_DEVICE_ID,
    ATTR_DURATION,
    ATTR_ENTRY_ID,
    ATTR_NAME,
    ATTR_SNOOZE_UNTIL,
    ATTR_SOURCE,
    CONF_ALARM_TIME,
    CONF_DAYS,
    CONF_ENABLED,
    DOMAIN,
    EVENT_ALARM_TRIGGERED,
    EVENT_DISMISSED,
    EVENT_POST_TRIGGER,
    EVENT_PRE_TRIGGER,
    EVENT_SNOOZED,
    RESUME_GRACE,
    SOURCE_AUTO,
    SOURCE_CLEANUP,
    SOURCE_MANUAL,
    SOURCE_SCHEDULE,
    SOURCE_SNOOZE_END,
    STATE_ARMED,
    STATE_DISABLED,
    STATE_POST_PENDING,
    STATE_PRE_ACTIVE,
    STATE_RINGING,
    STATE_SNOOZED,
    TIMER_ALARM,
    TIMER_AUTO_DISMISS,
    TIMER_POST,
    TIMER_PRE,
    TIMER_SNOOZE_END,
)
from .models import RuntimeState, AlarmClockConfig, AlarmClockSnapshot
from .store import AlarmClockStore

_LOGGER = logging.getLogger(__name__)


class AlarmClockCoordinator(DataUpdateCoordinator[AlarmClockSnapshot]):
    """Holds configuration, runtime state and timers of one alarm clock."""

    config_entry: ConfigEntry

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        """Set up the coordinator without polling (push based only)."""
        super().__init__(
            hass,
            _LOGGER,
            config_entry=entry,
            name=entry.title,
            update_interval=None,
        )
        self.config = AlarmClockConfig.from_options(entry.options)
        self.runtime = RuntimeState()
        self._store = AlarmClockStore(hass, entry.entry_id)
        self._timers: dict[str, CALLBACK_TYPE] = {}
        self._unsubs: list[CALLBACK_TYPE] = []
        self._device_id: str | None = None

    # ------------------------------------------------------------------
    # Lifecycle
    # ------------------------------------------------------------------
    async def async_setup(self) -> None:
        """Restore the state, register listeners and arm the timers."""
        self.runtime = RuntimeState.from_dict(await self._store.async_load())

        self._unsubs.append(
            self.hass.bus.async_listen(EVENT_CORE_CONFIG_UPDATE, self._handle_core_config)
        )

        if self.hass.state is CoreState.running:
            await self._async_resume()
        else:
            # Only resume after startup so that referenced scripts and
            # entities are guaranteed to be loaded.
            self._unsubs.append(
                self.hass.bus.async_listen_once(
                    EVENT_HOMEASSISTANT_STARTED, self._handle_started
                )
            )
            self._async_push()

    async def async_shutdown(self) -> None:
        """Tear down all timers and listeners."""
        self._async_cancel_timers()
        for unsub in self._unsubs:
            unsub()
        self._unsubs.clear()
        await super().async_shutdown()

    async def async_remove_storage(self) -> None:
        """Remove the persisted state."""
        await self._store.async_remove()

    async def _async_update_data(self) -> AlarmClockSnapshot:
        """Never used for polling, only returns the current snapshot."""
        return self._build_snapshot()

    async def _handle_started(self, _event: Event) -> None:
        """Resume the state once Home Assistant has started."""
        await self._async_resume()

    async def _async_resume(self) -> None:
        """Check the stored state and take over the scheduling.

        A snooze or a post action that was still pending when Home Assistant
        stopped is picked up here, so it is not silently lost.
        """
        now = dt_util.now()

        if self.runtime.snooze_until and self.runtime.snooze_until <= now:
            missed_by = now - self.runtime.snooze_until
            self.runtime.snooze_until = None
            if self.config.enabled and missed_by <= RESUME_GRACE:
                _LOGGER.info(
                    "%s: end of snooze was missed by %s during downtime, catching the "
                    "alarm up",
                    self.config_entry.title,
                    missed_by,
                )
                await self._async_start_ringing(SOURCE_SNOOZE_END)
                return
            _LOGGER.info(
                "%s: end of snooze is too far in the past (%s) and is discarded",
                self.config_entry.title,
                missed_by,
            )

        if self.runtime.ringing:
            if self.config.enabled:
                # The ringing survived a restart. The alarm script was killed
                # in the process and is therefore started again; the auto
                # dismiss deadline continues from its original point in time
                # and is re-armed in _async_reschedule.
                _LOGGER.info(
                    "%s: resuming the alarm after the restart",
                    self.config_entry.title,
                )
                await self._async_script_call("turn_on", self.config.alarm_script)
            else:
                self.runtime.ringing = False
                self.runtime.ringing_since = None

        if self.runtime.post_due_at and self.runtime.post_due_at <= now:
            _LOGGER.debug(
                "%s: catching up the pending post action",
                self.config_entry.title,
            )
            await self._async_run_post()
            return

        await self._async_save()
        self._async_reschedule()
        self._async_push()

    # ------------------------------------------------------------------
    # Derived state
    # ------------------------------------------------------------------
    @property
    def snooze_active(self) -> bool:
        """True while the end of the snooze lies in the future."""
        return (
            self.runtime.snooze_until is not None
            and self.runtime.snooze_until > dt_util.now()
        )

    @property
    def pre_active(self) -> bool:
        """True while the pre phase before the alarm is running."""
        return (
            self.runtime.pre_until is not None
            and self.runtime.pre_until > dt_util.now()
        )

    @property
    def state(self) -> str:
        """Current state of the state machine."""
        if self.runtime.ringing:
            return STATE_RINGING
        if self.snooze_active:
            return STATE_SNOOZED
        if not self.config.enabled:
            return STATE_DISABLED
        if self.runtime.post_due_at is not None:
            return STATE_POST_PENDING
        if self.pre_active:
            return STATE_PRE_ACTIVE
        return STATE_ARMED

    @property
    def next_alarm(self) -> datetime | None:
        """Next alarm time; the end of a running snooze takes precedence."""
        if self.snooze_active:
            return self.runtime.snooze_until
        if not self.config.enabled:
            return None
        return self._next_regular_alarm(dt_util.now())

    @property
    def device_id(self) -> str | None:
        """Device ID of the alarm clock (used in event payloads)."""
        if self._device_id is None:
            device = dr.async_get(self.hass).async_get_device(
                identifiers={(DOMAIN, self.config_entry.entry_id)}
            )
            self._device_id = device.id if device else None
        return self._device_id

    def _next_regular_alarm(self, now: datetime) -> datetime | None:
        """Calculate the next regular alarm time.

        If weekdays are selected, the next active weekday is used. Otherwise
        the alarm counts as one-shot and fires today or tomorrow.
        """
        alarm_time = self.config.alarm_time

        if self.config.is_one_shot:
            today = self._combine(now, alarm_time)
            return today if today > now else self._combine(now + timedelta(days=1), alarm_time)

        for offset in range(8):
            candidate = self._combine(now + timedelta(days=offset), alarm_time)
            if self.config.days[candidate.weekday()] and candidate > now:
                return candidate
        return None

    @staticmethod
    def _combine(reference: datetime, alarm_time: dt_time) -> datetime:
        """Combine a date and the alarm time into a local point in time.

        The alarm time is interpreted as wall clock time. When the clocks go
        forward there are wall clock times that do not exist on that day (for
        example 02:30). The round trip through UTC then moves the alarm to the
        first valid point in time instead of skipping it. For times that occur
        twice (when the clocks go back) the first occurrence wins.
        """
        tzinfo = dt_util.get_default_time_zone()
        naive = datetime.combine(reference.date(), alarm_time)
        candidate = naive.replace(tzinfo=tzinfo)
        normalized = dt_util.as_local(dt_util.as_utc(candidate))
        if normalized.replace(tzinfo=None) != naive:
            return normalized
        return candidate

    def _build_snapshot(self) -> AlarmClockSnapshot:
        """Build the snapshot the entities read."""
        return AlarmClockSnapshot(
            state=self.state,
            ringing=self.runtime.ringing,
            snooze_active=self.snooze_active,
            snooze_until=self.runtime.snooze_until if self.snooze_active else None,
            next_alarm=self.next_alarm,
            post_due_at=self.runtime.post_due_at,
        )

    @callback
    def _async_push(self) -> None:
        """Push the current state to all entities."""
        self.async_set_updated_data(self._build_snapshot())

    async def _async_save(self) -> None:
        """Persist the runtime state."""
        await self._store.async_save(self.runtime.as_dict())

    # ------------------------------------------------------------------
    # Timer
    # ------------------------------------------------------------------
    @callback
    def _async_set_timer(self, key: str, when: datetime | None, action: Any) -> None:
        """Keep exactly one timer per key."""
        if (unsub := self._timers.pop(key, None)) is not None:
            unsub()
        if when is None:
            return
        self._timers[key] = async_track_point_in_time(self.hass, action, when)
        _LOGGER.debug("%s: timer '%s' armed for %s", self.config_entry.title, key, when)

    @callback
    def _async_cancel_timers(self) -> None:
        """Cancel all timers."""
        for unsub in self._timers.values():
            unsub()
        self._timers.clear()

    @callback
    def _async_reschedule(self) -> None:
        """Re-arm all timers based on the current state."""
        now = dt_util.now()

        next_regular = self._next_regular_alarm(now) if self.config.enabled else None
        self._async_set_timer(TIMER_ALARM, next_regular, self._handle_alarm)

        # The pre phase ends when the alarm it belongs to is due.
        if self.runtime.pre_until is not None and self.runtime.pre_until <= now:
            self.runtime.pre_until = None

        pre_at: datetime | None = None
        if next_regular and self.config.pre_offset > 0:
            candidate = next_regular - timedelta(minutes=self.config.pre_offset)
            if candidate > now:
                pre_at = candidate
            elif self.runtime.pre_until is None and next_regular > now:
                # Scheduling changed inside a running pre phase, keep it.
                self.runtime.pre_until = next_regular
        self._async_set_timer(TIMER_PRE, pre_at, self._handle_pre)

        self._async_set_timer(
            TIMER_SNOOZE_END,
            self.runtime.snooze_until if self.snooze_active else None,
            self._handle_snooze_end,
        )

        auto_at: datetime | None = None
        if self.runtime.ringing and self.config.auto_dismiss > 0:
            started = self.runtime.ringing_since or now
            auto_at = started + timedelta(minutes=self.config.auto_dismiss)
        self._async_set_timer(TIMER_AUTO_DISMISS, auto_at, self._handle_auto_dismiss)

        self._async_set_timer(TIMER_POST, self.runtime.post_due_at, self._handle_post)

    # ------------------------------------------------------------------
    # Configuration changes
    # ------------------------------------------------------------------
    async def async_apply_options(self) -> None:
        """Apply changed options (idempotent)."""
        previous = self.config
        self.config = AlarmClockConfig.from_options(self.config_entry.options)

        # Cleanup: disabling while ringing or snoozing ends the alarm.
        if (
            previous.enabled
            and not self.config.enabled
            and (self.runtime.ringing or self.snooze_active)
        ):
            await self.async_dismiss(source=SOURCE_CLEANUP)
            return

        self._async_reschedule()
        self._async_push()

    async def async_set_options(self, **values: Any) -> None:
        """Write the options and apply them right away."""
        self.hass.config_entries.async_update_entry(
            self.config_entry,
            options={**self.config_entry.options, **values},
        )
        await self.async_apply_options()

    async def async_set_enabled(self, enabled: bool) -> None:
        """Enable or disable the alarm clock."""
        await self.async_set_options(**{CONF_ENABLED: enabled})

    async def async_set_day(self, index: int, enabled: bool) -> None:
        """Set a single weekday."""
        days = list(self.config.days)
        days[index] = enabled
        await self.async_set_options(**{CONF_DAYS: days})

    async def async_set_alarm_time(self, value: dt_time) -> None:
        """Set the alarm time."""
        await self.async_set_options(
            **{CONF_ALARM_TIME: value.replace(second=0, microsecond=0).isoformat()}
        )

    async def async_set_alarm(
        self, alarm_time: dt_time | None = None, days: list[str] | None = None
    ) -> None:
        """Set alarm time and/or weekdays in one step (service)."""
        from .const import WEEKDAYS  # local import to avoid a cycle

        values: dict[str, Any] = {}
        if alarm_time is not None:
            values[CONF_ALARM_TIME] = alarm_time.replace(
                second=0, microsecond=0
            ).isoformat()
        if days is not None:
            values[CONF_DAYS] = [key in days for key in WEEKDAYS]
        if values:
            await self.async_set_options(**values)

    # ------------------------------------------------------------------
    # Actions of the state machine
    # ------------------------------------------------------------------
    async def async_trigger_alarm(self, source: str = SOURCE_MANUAL) -> None:
        """Trigger the alarm."""
        if not self.config.enabled:
            _LOGGER.debug(
                "%s: alarm ignored, the alarm clock is disabled", self.config_entry.title
            )
            return
        if self.runtime.ringing:
            _LOGGER.debug(
                "%s: alarm ignored, the alarm clock is already ringing", self.config_entry.title
            )
            return
        await self._async_start_ringing(source)

    async def _async_start_ringing(self, source: str) -> None:
        """Set the ringing state and start the alarm script."""
        self.runtime.ringing = True
        self.runtime.ringing_since = dt_util.now()
        self.runtime.snooze_until = None
        self.runtime.pre_until = None
        await self._async_save()

        self._fire(EVENT_ALARM_TRIGGERED, {ATTR_SOURCE: source})
        await self._async_script_call("turn_on", self.config.alarm_script)

        self._async_reschedule()
        self._async_push()

    async def async_snooze(self, duration: int | None = None) -> None:
        """Snooze the alarm."""
        if not (self.runtime.ringing or self.snooze_active):
            _LOGGER.debug(
                "%s: snooze ignored, neither ringing nor snoozing",
                self.config_entry.title,
            )
            return

        minutes = duration if duration is not None else self.config.snooze_duration
        if minutes <= 0:
            _LOGGER.debug(
                "%s: snooze ignored, the snooze duration is set to zero",
                self.config_entry.title,
            )
            return

        self.runtime.ringing = False
        self.runtime.ringing_since = None
        self.runtime.snooze_until = dt_util.now() + timedelta(minutes=minutes)
        await self._async_save()

        await self._async_script_call("turn_off", self.config.alarm_script)
        self._fire(
            EVENT_SNOOZED,
            {
                ATTR_DURATION: minutes,
                ATTR_SNOOZE_UNTIL: self.runtime.snooze_until.isoformat(),
            },
        )
        await self._async_script_call("turn_on", self.config.snooze_script)

        self._async_reschedule()
        self._async_push()

    async def async_dismiss(self, source: str = SOURCE_MANUAL) -> None:
        """Dismiss the alarm."""
        if not (self.runtime.ringing or self.snooze_active):
            _LOGGER.debug(
                "%s: dismiss ignored, neither ringing nor snoozing",
                self.config_entry.title,
            )
            return

        self.runtime.ringing = False
        self.runtime.ringing_since = None
        self.runtime.snooze_until = None
        self.runtime.pre_until = None
        if self.config.post_offset > 0:
            self.runtime.post_due_at = dt_util.now() + timedelta(
                minutes=self.config.post_offset
            )
        else:
            self.runtime.post_due_at = None
        await self._async_save()

        await self._async_script_call("turn_off", self.config.alarm_script)
        self._fire(EVENT_DISMISSED, {ATTR_SOURCE: source})
        await self._async_script_call("turn_on", self.config.dismiss_script)

        self._async_reschedule()
        self._async_push()

        # A post offset of zero disables the post action entirely. The one-shot
        # alarm still has to disable itself, that is core logic and not part of
        # the post action.
        if self.config.post_offset <= 0:
            await self._async_finish_cycle(run_post_action=False)

    async def _async_run_post(self) -> None:
        """Run the post action once the post offset has elapsed."""
        await self._async_finish_cycle(run_post_action=True)

    async def _async_finish_cycle(self, *, run_post_action: bool) -> None:
        """End the alarm cycle: optional post action, then one-shot handling."""
        self.runtime.post_due_at = None
        await self._async_save()

        if not self.config.enabled:
            _LOGGER.debug(
                "%s: end of cycle skipped, the alarm clock is disabled",
                self.config_entry.title,
            )
            self._async_reschedule()
            self._async_push()
            return

        if run_post_action:
            self._fire(EVENT_POST_TRIGGER, {})
            await self._async_script_call("turn_on", self.config.post_script)

        if self.config.is_one_shot:
            _LOGGER.debug(
                "%s: one-shot alarm clock disables itself after ringing",
                self.config_entry.title,
            )
            await self.async_set_enabled(False)
            return

        self._async_reschedule()
        self._async_push()

    # ------------------------------------------------------------------
    # Timer handlers
    # ------------------------------------------------------------------
    async def _handle_alarm(self, _now: datetime) -> None:
        """The regular alarm time has been reached."""
        self._timers.pop(TIMER_ALARM, None)
        if not self.config.enabled or self.runtime.ringing:
            self._async_reschedule()
            self._async_push()
            return
        await self._async_start_ringing(SOURCE_SCHEDULE)

    async def _handle_pre(self, now: datetime) -> None:
        """The pre phase before the alarm has started."""
        self._timers.pop(TIMER_PRE, None)
        if not self.config.enabled or self.config.pre_offset <= 0:
            self._async_reschedule()
            self._async_push()
            return

        # The pre phase lasts until the alarm it belongs to is due. It also
        # applies when no pre script is configured, so that the state does not
        # depend on the configuration.
        alarm_at = self._next_regular_alarm(dt_util.now())
        self.runtime.pre_until = alarm_at
        await self._async_save()

        self._fire(EVENT_PRE_TRIGGER, {})
        await self._async_script_call("turn_on", self.config.pre_script)

        self._async_reschedule()
        self._async_push()

    async def _handle_snooze_end(self, _now: datetime) -> None:
        """The snooze has elapsed, trigger the alarm again."""
        self._timers.pop(TIMER_SNOOZE_END, None)
        self.runtime.snooze_until = None
        await self._async_start_ringing(SOURCE_SNOOZE_END)

    async def _handle_auto_dismiss(self, _now: datetime) -> None:
        """No reaction within the auto dismiss period."""
        self._timers.pop(TIMER_AUTO_DISMISS, None)
        await self.async_dismiss(source=SOURCE_AUTO)

    async def _handle_post(self, _now: datetime) -> None:
        """The post offset has elapsed."""
        self._timers.pop(TIMER_POST, None)
        await self._async_run_post()

    async def _handle_core_config(self, _event: Event) -> None:
        """React to time zone changes and similar core configuration updates."""
        _LOGGER.debug(
            "%s: core configuration changed, re-arming the timers",
            self.config_entry.title,
        )
        self._async_reschedule()
        self._async_push()

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------
    async def _async_script_call(self, service: str, entity_id: str | None) -> None:
        """Start or stop an optional script."""
        if not entity_id:
            return
        if self.hass.states.get(entity_id) is None:
            _LOGGER.warning(
                "%s: script %s does not exist and is skipped",
                self.config_entry.title,
                entity_id,
            )
            return
        try:
            await self.hass.services.async_call(
                "script", service, {"entity_id": entity_id}, blocking=False
            )
        except (ServiceNotFound, HomeAssistantError) as err:
            _LOGGER.error(
                "%s: calling script.%s for %s failed: %s",
                self.config_entry.title,
                service,
                entity_id,
                err,
            )

    @callback
    def _fire(self, event_type: str, data: dict[str, Any]) -> None:
        """Fire an event on the HA event bus."""
        self.hass.bus.async_fire(
            event_type,
            {
                ATTR_ENTRY_ID: self.config_entry.entry_id,
                ATTR_DEVICE_ID: self.device_id,
                ATTR_NAME: self.config_entry.title,
                **data,
            },
        )


type AlarmClockConfigEntry = ConfigEntry[AlarmClockCoordinator]
