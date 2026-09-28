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
from homeassistant.core import (
    CALLBACK_TYPE,
    Context,
    CoreState,
    Event,
    HomeAssistant,
    callback,
)
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.event import async_track_point_in_time
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator
from homeassistant.util import dt as dt_util

from .const import (
    ATTR_DEVICE_ID,
    ATTR_DURATION,
    ATTR_ENTRY_ID,
    ATTR_NAME,
    ATTR_PHASE,
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
    PHASE_ALARM,
    PHASE_DISMISS,
    PHASE_POST,
    PHASE_PRE,
    PHASE_SNOOZE,
    RESUME_GRACE,
    SOURCE_AUTO,
    SOURCE_CLEANUP,
    SOURCE_MANUAL,
    SOURCE_SCHEDULE,
    SOURCE_SNOOZE_END,
    STATE_ARMED,
    STATE_DISABLED,
    STATE_POST_ACTIVE,
    STATE_POST_PENDING,
    STATE_PRE_ACTIVE,
    STATE_RINGING,
    STATE_SNOOZED,
    TIMER_ALARM,
    TIMER_AUTO_DISMISS,
    TIMER_POST,
    TIMER_POST_TIMEOUT,
    TIMER_PRE,
    TIMER_SNOOZE_END,
)
from .actions import AlarmClockActions
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
        self._actions = AlarmClockActions(hass, entry.title)
        # Set while a one-shot alarm clock switches itself off at the end of
        # its cycle, which unlike switching it off by hand aborts nothing.
        self._self_disabling = False
        self._unloading = False

    # ------------------------------------------------------------------
    # Lifecycle
    # ------------------------------------------------------------------
    async def async_setup(self) -> None:
        """Restore the state, register listeners and arm the timers."""
        self.runtime = RuntimeState.from_dict(await self._store.async_load())
        await self._actions.async_update(self.config.actions)

        self._unsubs.append(
            self.hass.bus.async_listen(EVENT_CORE_CONFIG_UPDATE, self._handle_core_config)
        )

        if self.hass.state is CoreState.running:
            await self._async_resume()
        else:
            # Only resume after startup so that the scripts and entities the
            # actions refer to are guaranteed to be loaded.
            self._unsubs.append(
                self.hass.bus.async_listen_once(
                    EVENT_HOMEASSISTANT_STARTED, self._handle_started
                )
            )
            self._async_push()

    async def async_shutdown(self) -> None:
        """Tear down all timers and listeners.

        Running action sequences end with the entry's background tasks. The
        runtime state is left as it is, so that the restart finds a post
        phase that was cut short.
        """
        self._unloading = True
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
        stopped is picked up here, so it is not silently lost. Post actions
        that were cut short by the restart are not repeated; the cycle is
        just finished.
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
                # The ringing survived a restart. The alarm actions were
                # stopped in the process and are therefore started again; the
                # auto dismiss deadline continues from its original point in
                # time and is re-armed in _async_reschedule.
                _LOGGER.info(
                    "%s: resuming the alarm after the restart",
                    self.config_entry.title,
                )
                self._async_start_actions(
                    PHASE_ALARM, self._payload({}), Context()
                )
            else:
                self.runtime.ringing = False
                self.runtime.ringing_since = None

        if self.runtime.post_active:
            _LOGGER.info(
                "%s: the post actions were cut short by the restart",
                self.config_entry.title,
            )
            self.runtime.post_active = False
            await self._async_save()
            if self.config.enabled and self.config.is_one_shot:
                await self._async_self_disable()
                return

        if self.runtime.post_due_at and self.runtime.post_due_at <= now:
            _LOGGER.debug(
                "%s: catching up the pending post action",
                self.config_entry.title,
            )
            await self._async_start_post()
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
        # The next wake-up takes precedence over what is left of the last.
        if self.pre_active:
            return STATE_PRE_ACTIVE
        if self.runtime.post_due_at is not None:
            return STATE_POST_PENDING
        if self.runtime.post_active:
            return STATE_POST_ACTIVE
        return STATE_ARMED

    @property
    def one_shot_spent(self) -> bool:
        """True once a one-shot alarm has rung and only its post phase is left.

        It stays switched on until its post actions are done, but must not
        ring a second time meanwhile.
        """
        return self.config.is_one_shot and (
            self.runtime.post_due_at is not None or self.runtime.post_active
        )

    @property
    def next_alarm(self) -> datetime | None:
        """Next alarm time; the end of a running snooze takes precedence."""
        if self.snooze_active:
            return self.runtime.snooze_until
        if not self.config.enabled or self.one_shot_spent:
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
            return (
                today
                if today > now
                else self._combine(now + timedelta(days=1), alarm_time)
            )

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

        next_regular = (
            self._next_regular_alarm(now)
            if self.config.enabled and not self.one_shot_spent
            else None
        )
        self._async_set_timer(TIMER_ALARM, next_regular, self._handle_alarm)

        # The pre phase always belongs to the next regular alarm. When that
        # moves (a new alarm time, a weekday, the pre offset), a running pre
        # phase follows it as long as the new pre start has already passed.
        # Otherwise it ends and starts over at the new pre start. Ending it
        # only changes the state; its actions keep running, stopping them is
        # reserved for switching the alarm clock off.
        pre_at: datetime | None = None
        pre_start = (
            next_regular - timedelta(minutes=self.config.pre_offset)
            if next_regular and self.config.pre_offset > 0
            else None
        )
        if pre_start is None or next_regular is None:
            self.runtime.pre_until = None
        elif pre_start > now:
            pre_at = pre_start
            self.runtime.pre_until = None
        elif self.runtime.pre_until is not None:
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
        await self._actions.async_update(self.config.actions)

        if previous.enabled and not self.config.enabled and not self._self_disabling:
            await self._async_abort()
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
        """Set the ringing state and start the alarm actions."""
        self.runtime.ringing = True
        self.runtime.ringing_since = dt_util.now()
        self.runtime.snooze_until = None
        self.runtime.pre_until = None
        await self._async_save()

        self._async_fire_and_run(PHASE_ALARM, EVENT_ALARM_TRIGGERED, {ATTR_SOURCE: source})

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

        await self._actions.async_stop(PHASE_ALARM)
        self._async_fire_and_run(
            PHASE_SNOOZE,
            EVENT_SNOOZED,
            {
                ATTR_DURATION: minutes,
                ATTR_SNOOZE_UNTIL: self.runtime.snooze_until.isoformat(),
            },
        )

        self._async_reschedule()
        self._async_push()

    async def async_dismiss(self, source: str = SOURCE_MANUAL) -> None:
        """End a ringing alarm or a running snooze.

        Stops the alarm actions, runs the dismiss actions and schedules the
        post phase, or ends the cycle right away when there is none. In any
        other state it is a no-op: the pre and the post phase cannot be
        cancelled, only switching the alarm clock off ends them.
        """
        if not (self.runtime.ringing or self.snooze_active):
            _LOGGER.debug(
                "%s: dismiss ignored, nothing is ringing or snoozing",
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

        await self._actions.async_stop(PHASE_ALARM)
        self._async_fire_and_run(PHASE_DISMISS, EVENT_DISMISSED, {ATTR_SOURCE: source})

        # A post offset of zero disables the post phase entirely. The
        # one-shot alarm still has to disable itself, that is core logic and
        # not part of the post phase.
        if self.config.post_offset <= 0:
            await self._async_end_cycle()
            return

        self._async_reschedule()
        self._async_push()

    async def _async_abort(self) -> None:
        """The alarm clock was switched off: end every phase, stop every run.

        A ringing or snoozing alarm is still dismissed properly, dismiss
        actions included: stopping the alarm actions ends their steps, not
        what they started, so music playing on a speaker would keep playing
        without them. The dismissed event is fired once per cycle, so a
        cycle that was dismissed already, and is only in its post phase,
        ends without another one.
        """
        was_ringing = self.runtime.ringing or self.snooze_active
        was_pre = self.pre_active

        self.runtime.ringing = False
        self.runtime.ringing_since = None
        self.runtime.snooze_until = None
        self.runtime.pre_until = None
        self.runtime.post_due_at = None
        self.runtime.post_active = False
        await self._async_save()

        self._async_set_timer(TIMER_POST_TIMEOUT, None, None)
        await self._actions.async_stop_all()

        if was_ringing:
            self._async_fire_and_run(
                PHASE_DISMISS, EVENT_DISMISSED, {ATTR_SOURCE: SOURCE_CLEANUP}
            )
        elif was_pre:
            self._fire(EVENT_DISMISSED, {ATTR_SOURCE: SOURCE_CLEANUP})

        self._async_reschedule()
        self._async_push()

    async def _async_start_post(self) -> None:
        """The post offset has elapsed: start the post actions."""
        self.runtime.post_due_at = None
        self.runtime.post_active = True
        await self._async_save()

        variables, context = self._async_fire_with_context(EVENT_POST_TRIGGER, {})
        if not self._actions.has_actions(PHASE_POST):
            # Without post actions the post phase is over the moment it starts.
            await self._async_post_finished()
            return

        self._async_set_timer(
            TIMER_POST_TIMEOUT,
            dt_util.now() + timedelta(minutes=self.config.post_timeout),
            self._handle_post_timeout,
        )
        self.config_entry.async_create_background_task(
            self.hass,
            self._async_run_post_actions({**variables, ATTR_PHASE: PHASE_POST}, context),
            f"{DOMAIN} {self.config_entry.title} post actions",
        )

        self._async_reschedule()
        self._async_push()

    async def _async_run_post_actions(
        self, variables: dict[str, Any], context: Context
    ) -> None:
        """Run the post actions, then finish the cycle."""
        await self._actions.async_run(PHASE_POST, variables, context)
        await self._async_post_finished()

    async def _async_post_finished(self) -> None:
        """The post actions are done, stopped by their time limit or absent."""
        if self._unloading or self.hass.is_stopping:
            # Cut short by a restart, which _async_resume takes care of.
            return
        if not self.runtime.post_active:
            # Switching the alarm clock off ended the post phase already.
            return

        self._async_set_timer(TIMER_POST_TIMEOUT, None, None)
        self.runtime.post_active = False
        await self._async_save()
        await self._async_end_cycle()

    async def _async_end_cycle(self) -> None:
        """End the alarm cycle; a one-shot alarm clock switches itself off."""
        if self.config.enabled and self.config.is_one_shot:
            _LOGGER.debug(
                "%s: one-shot alarm clock disables itself after its cycle",
                self.config_entry.title,
            )
            await self._async_self_disable()
            return

        self._async_reschedule()
        self._async_push()

    async def _async_self_disable(self) -> None:
        """Switch a one-shot alarm clock off without aborting anything."""
        self._self_disabling = True
        try:
            await self.async_set_enabled(False)
        finally:
            self._self_disabling = False

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
        # applies when no pre actions are configured, so that the state does
        # not depend on the configuration.
        alarm_at = self._next_regular_alarm(dt_util.now())
        self.runtime.pre_until = alarm_at
        await self._async_save()

        self._async_fire_and_run(PHASE_PRE, EVENT_PRE_TRIGGER, {})

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
        await self._async_start_post()

    async def _handle_post_timeout(self, _now: datetime) -> None:
        """The post actions ran into their time limit."""
        self._timers.pop(TIMER_POST_TIMEOUT, None)
        _LOGGER.warning(
            "%s: the post actions are still running after %s minutes and are stopped",
            self.config_entry.title,
            self.config.post_timeout,
        )
        # Stopping ends the run, which finishes the cycle as usual.
        await self._actions.async_stop(PHASE_POST)

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
    def _payload(self, data: dict[str, Any]) -> dict[str, Any]:
        """Event data: what identifies the alarm clock, plus the phase data."""
        return {
            ATTR_ENTRY_ID: self.config_entry.entry_id,
            ATTR_DEVICE_ID: self.device_id,
            ATTR_NAME: self.config_entry.title,
            **data,
        }

    @callback
    def _async_fire_with_context(
        self, event_type: str, data: dict[str, Any]
    ) -> tuple[dict[str, Any], Context]:
        """Fire an event and return its data and context for the actions."""
        payload = self._payload(data)
        context = Context()
        self.hass.bus.async_fire(event_type, payload, context=context)
        return payload, context

    @callback
    def _async_fire_and_run(
        self, phase: str, event_type: str, data: dict[str, Any]
    ) -> None:
        """Fire the event of a phase and start its actions.

        The actions get the event data as variables, plus the phase, and
        share the event's context, so the logbook ties them together.
        """
        payload, context = self._async_fire_with_context(event_type, data)
        self._async_start_actions(phase, payload, context)

    @callback
    def _async_start_actions(
        self, phase: str, payload: dict[str, Any], context: Context
    ) -> None:
        """Start the actions of a phase without waiting for them."""
        if not self._actions.has_actions(phase):
            return
        self.config_entry.async_create_background_task(
            self.hass,
            self._actions.async_run(phase, {**payload, ATTR_PHASE: phase}, context),
            f"{DOMAIN} {self.config_entry.title} {phase} actions",
        )

    @callback
    def _fire(self, event_type: str, data: dict[str, Any]) -> None:
        """Fire an event on the HA event bus, without running any actions."""
        self.hass.bus.async_fire(event_type, self._payload(data))

type AlarmClockConfigEntry = ConfigEntry[AlarmClockCoordinator]
