import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

import "./alarm-clocks-weekday-picker";
import "./alarm-clocks-time-stepper";
import "./alarm-clocks-setting-row";

import { ALARM_ITEM_TAG, STATUS, STATUS_ICONS } from "../const";
import { dismiss, setNumber, showMoreInfo, snooze, toggleSwitch, triggerAlarm, setTime } from "../lib/actions";
import { createLocalizer, languageOf, type Localizer } from "../lib/localize";
import type { AlarmView } from "../lib/model";
import { formatAbsolute, formatClock, formatDuration, formatRelative } from "../lib/time";
import { controlStyles, themeTokens } from "../styles";
import type { HomeAssistant } from "../types";

/**
 * One alarm clock, collapsed (a compact row) or expanded (time stepper,
 * weekdays, actions, settings). Which rows are expanded and whether that is
 * possible at all is decided by the parent card; this component only tracks
 * the interaction state local to a single alarm.
 */
@customElement(ALARM_ITEM_TAG)
export class MacaAlarmItem extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @property({ attribute: false }) public view?: AlarmView;

  @property({ type: Number }) public now = Date.now();

  @property({ type: Boolean }) public narrow = false;

  @property({ type: Boolean }) public expanded = false;

  @property({ type: Boolean }) public expandable = true;

  @property({ type: Boolean }) public showDays = true;

  @property({ type: Boolean }) public showNextAlarm = true;

  @property({ type: Boolean }) public showSettings = true;

  @property({ type: Boolean }) public showTestButton = false;

  @property({ type: Number }) public minuteStep = 5;

  @state() private _pendingTime?: { hours: number; minutes: number };

  private _timeTimer?: number;

  private _pendingSince = 0;

  protected override render(): TemplateResult | typeof nothing {
    const hass = this.hass;
    const view = this.view;
    if (!hass || !view) {
      return nothing;
    }

    const localize = createLocalizer(hass);
    this._settlePendingTime(view);

    return html`
      <div
        class=${classMap({
          item: true,
          [`status-${view.status}`]: true,
          disabled: !view.enabled,
        })}
      >
        <div class="row">
          <div class="icon" aria-hidden="true">
            <ha-icon icon=${STATUS_ICONS[view.status] ?? STATUS_ICONS.unknown}></ha-icon>
          </div>
          ${this.expanded
            ? this._renderExpandedInfo(view, localize)
            : this._renderCollapsedInfo(view, localize)}
          ${this.expanded ? this._renderToggle(view, localize) : this._renderCollapsedRight(view, localize)}
          ${this._renderExpandButton(localize)}
        </div>
        ${this.expanded ? this._renderBody(view, localize) : nothing}
      </div>
    `;
  }

  // -- collapsed --------------------------------------------------------------

  private _renderCollapsedInfo(view: AlarmView, localize: Localizer): TemplateResult {
    const language = languageOf(this.hass);
    return html`
      <button type="button" class="info" @click=${this._openInfo}>
        <span class="name">${view.name}</span>
        <span class="sub">${this._subtitle(view, localize, language)}</span>
      </button>
    `;
  }

  private _renderCollapsedRight(view: AlarmView, localize: Localizer): TemplateResult {
    const time = view.alarmTime
      ? `${String(view.alarmTime.hours).padStart(2, "0")}:${String(view.alarmTime.minutes).padStart(2, "0")}`
      : localize("label.no_time");

    return html`
      <span class="time">${time}</span>
      ${view.canDismiss
        ? html`
            <div class="row-actions">
              ${view.canSnooze
                ? html`<button
                      type="button"
                      class="icon-btn"
                      aria-label=${localize("action.snooze")}
                      title=${localize("action.snooze")}
                      @click=${() => this._snooze(view)}
                    >
                      <ha-icon icon="mdi:alarm-snooze"></ha-icon>
                    </button>`
                : nothing}
              <button
                type="button"
                class="icon-btn danger-icon"
                aria-label=${localize("action.dismiss")}
                title=${localize("action.dismiss")}
                @click=${() => this._dismiss(view)}
              >
                <ha-icon icon="mdi:alarm-off"></ha-icon>
              </button>
            </div>
          `
        : this._renderToggle(view, localize)}
    `;
  }

  private _subtitle(view: AlarmView, localize: Localizer, language: string): string {
    const status = localize(`status.${view.status}`);
    if (!this.showNextAlarm) {
      return status;
    }
    // The pre and the post phase name themselves, followed by the time left
    // until the point they lead up to: the alarm, or the post actions.
    const phaseTarget = this._phaseTarget(view);
    if (phaseTarget) {
      return `${status} · ${formatRelative(phaseTarget, this.now, localize)}`;
    }
    if (
      view.status === STATUS.RINGING ||
      view.status === STATUS.POST_PENDING ||
      view.status === STATUS.POST_ACTIVE ||
      !view.nextAlarm
    ) {
      return status;
    }
    if (view.status === STATUS.SNOOZED) {
      return `${status} · ${localize("label.until", {
        time: formatClock(view.nextAlarm, language),
      })}`;
    }
    return formatRelative(view.nextAlarm, this.now, localize);
  }

  /** What the pre phase or a pending post phase counts down to, if known. */
  private _phaseTarget(view: AlarmView): Date | undefined {
    if (view.status === STATUS.PRE_ACTIVE) {
      return view.nextAlarm;
    }
    if (view.status === STATUS.POST_PENDING) {
      return view.postDue;
    }
    return undefined;
  }

  // -- expanded -----------------------------------------------------------

  private _renderExpandedInfo(view: AlarmView, localize: Localizer): TemplateResult {
    const statusLabel = localize(`status.${view.status}`);
    return html`
      <button type="button" class="info title" @click=${this._openInfo} title=${view.name}>
        <span class="name">${view.name}</span>
        <span class="status">
          <span class="dot" aria-hidden="true"></span>${statusLabel}
        </span>
      </button>
    `;
  }

  private _renderBody(view: AlarmView, localize: Localizer): TemplateResult {
    return html`
      <div class="body">
        ${this._renderHero(view, localize)}
        ${this.showDays ? this._renderDays(view) : nothing}
        ${this._renderActions(view, localize)}
        ${this.showSettings && view.settings.length ? this._renderSettings(view) : nothing}
      </div>
    `;
  }

  private _renderHero(view: AlarmView, localize: Localizer): TemplateResult {
    const language = languageOf(this.hass);
    const editable = Boolean(view.entities.alarmTime);
    const time = this._pendingTime ?? view.alarmTime;

    if (!time) {
      return html`
        <div class="hero">
          <span class="no-time">${localize("label.no_time")}</span>
          <div class="meta">${this._renderMeta(view, localize, language)}</div>
        </div>
      `;
    }

    return html`
      <div class="hero">
        <alarm-clocks-time-stepper
          .hass=${this.hass}
          .hours=${time.hours}
          .minutes=${time.minutes}
          .minuteStep=${this.minuteStep}
          .disabled=${!editable}
          @time-changed=${this._onTimeChanged}
        ></alarm-clocks-time-stepper>
        <div class="meta">${this._renderMeta(view, localize, language)}</div>
      </div>
    `;
  }

  /**
   * Apply a stepped time.
   *
   * The display follows immediately while the service call is debounced, so
   * holding a button does not fire dozens of calls. The stepped value stays on
   * screen until the entity reports it back; clearing it on a timer made the
   * time jump back to the old value while it was still on its way.
   */
  private _onTimeChanged = (event: CustomEvent<{ hours: number; minutes: number }>): void => {
    this._pendingTime = { hours: event.detail.hours, minutes: event.detail.minutes };
    this._pendingSince = Date.now();
    if (this._timeTimer !== undefined) {
      window.clearTimeout(this._timeTimer);
    }
    this._timeTimer = window.setTimeout(() => {
      this._timeTimer = undefined;
      const entityId = this.view?.entities.alarmTime;
      const pending = this._pendingTime;
      if (this.hass && entityId && pending) {
        void setTime(this.hass, entityId, pending.hours, pending.minutes);
      }
    }, 600);
  };

  /** Drop the stepped value once the entity confirms it, or after a timeout. */
  private _settlePendingTime(view: AlarmView): void {
    const pending = this._pendingTime;
    if (!pending) {
      return;
    }
    const confirmed =
      view.alarmTime?.hours === pending.hours && view.alarmTime?.minutes === pending.minutes;
    const expired = Date.now() - this._pendingSince > 15000;
    if (confirmed || expired) {
      this._pendingTime = undefined;
    }
  }

  private _renderMeta(
    view: AlarmView,
    localize: Localizer,
    language: string,
  ): TemplateResult | typeof nothing {
    if (!this.showNextAlarm) {
      return nothing;
    }

    if (view.status === STATUS.RINGING) {
      const since = view.ringingSince
        ? localize("label.ringing_since", {
            duration: formatDuration(this.now - view.ringingSince.getTime(), localize),
          })
        : localize("status.ringing");
      return html`<span class="primary">${since}</span>`;
    }

    if (view.status === STATUS.POST_PENDING || view.status === STATUS.POST_ACTIVE) {
      const status = localize(`status.${view.status}`);
      const phaseTarget = this._phaseTarget(view);
      return phaseTarget
        ? html`<span class="primary">${status} · ${formatRelative(phaseTarget, this.now, localize)}</span>`
        : html`<span class="primary">${status}</span>`;
    }

    if (!view.nextAlarm) {
      // `sensor.<alarm>_next_alarm` is unavailable while the alarm is off.
      return html`<span class="primary muted">${localize("label.no_alarm")}</span>`;
    }

    const relative = formatRelative(view.nextAlarm, this.now, localize);
    const absolute =
      view.status === STATUS.SNOOZED
        ? localize("label.until", { time: formatClock(view.nextAlarm, language) })
        : formatAbsolute(view.nextAlarm, this.now, language, localize);

    return html`
      <span class="primary">${relative}</span>
      <span class="secondary">${absolute}</span>
      ${view.isOneShot ? html`<span class="badge">${localize("label.one_shot")}</span>` : nothing}
    `;
  }

  private _renderDays(view: AlarmView): TemplateResult {
    return html`
      <alarm-clocks-weekday-picker
        .hass=${this.hass}
        .days=${view.days}
        .compact=${this.narrow}
        @day-toggled=${this._onDayToggled}
      ></alarm-clocks-weekday-picker>
    `;
  }

  private _renderActions(view: AlarmView, localize: Localizer): TemplateResult | typeof nothing {
    const showTest = this.showTestButton && !view.canDismiss;
    if (!view.canDismiss && !showTest) {
      return nothing;
    }

    return html`
      <div class="actions">
        ${view.canSnooze
          ? html`<button
              type="button"
              class="btn"
              ?disabled=${!view.entities.snoozeButton && !view.entities.status}
              @click=${() => this._snooze(view)}
            >
              <ha-icon icon="mdi:alarm-snooze"></ha-icon>${localize("action.snooze")}
            </button>`
          : nothing}
        ${view.canDismiss
          ? html`<button type="button" class="btn danger" @click=${() => this._dismiss(view)}>
              <ha-icon icon="mdi:alarm-off"></ha-icon>${localize("action.dismiss")}
            </button>`
          : nothing}
        ${showTest
          ? html`<button
              type="button"
              class="btn"
              ?disabled=${!view.canTest}
              @click=${() => this._test(view)}
            >
              <ha-icon icon="mdi:play-circle-outline"></ha-icon>${localize("action.test")}
            </button>`
          : nothing}
      </div>
    `;
  }

  private _renderSettings(view: AlarmView): TemplateResult {
    return html`
      <div class="settings">
        ${view.settings.map(
          (setting) => html`
            <alarm-clocks-setting-row
              .hass=${this.hass}
              .setting=${setting}
              @setting-changed=${this._onSettingChanged}
              @setting-more-info=${this._onSettingMoreInfo}
            ></alarm-clocks-setting-row>
          `,
        )}
      </div>
    `;
  }

  // -- shared ---------------------------------------------------------------

  private _renderToggle(view: AlarmView, localize: Localizer): TemplateResult | typeof nothing {
    if (!view.entities.enabled) {
      return nothing;
    }
    return html`
      <button
        type="button"
        role="switch"
        class=${classMap({ toggle: true, on: view.enabled })}
        aria-checked=${view.enabled ? "true" : "false"}
        aria-label=${`${view.name}: ${localize(view.enabled ? "action.disable" : "action.enable")}`}
        @click=${() => this._toggle(view)}
      >
        <span class="knob"></span>
      </button>
    `;
  }

  private _renderExpandButton(localize: Localizer): TemplateResult | typeof nothing {
    if (!this.expandable) {
      return nothing;
    }
    return html`
      <button
        type="button"
        class="icon-btn expand-btn"
        aria-expanded=${this.expanded ? "true" : "false"}
        aria-label=${localize(this.expanded ? "action.collapse" : "action.expand")}
        @click=${this._onExpandClick}
      >
        <ha-icon icon=${this.expanded ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
      </button>
    `;
  }

  // -- interactions -----------------------------------------------------------

  private _onExpandClick = (): void => {
    const deviceId = this.view?.deviceId;
    if (deviceId) {
      this.dispatchEvent(
        new CustomEvent("toggle-expand", { detail: { deviceId }, bubbles: true, composed: true }),
      );
    }
  };

  private _openInfo = (): void => {
    const entityId = this.view?.entities.status ?? this.view?.entities.enabled;
    this._openEntity(entityId);
  };

  private _openEntity(entityId?: string): void {
    if (entityId) {
      showMoreInfo(this, entityId);
    }
  }

  private _toggle(view: AlarmView): void {
    if (this.hass && view.entities.enabled) {
      void toggleSwitch(this.hass, view.entities.enabled);
    }
  }

  private _onDayToggled = (event: CustomEvent<{ entityId: string }>): void => {
    if (this.hass) {
      void toggleSwitch(this.hass, event.detail.entityId);
    }
  };

  private _onSettingChanged = (event: CustomEvent<{ entityId: string; value: number }>): void => {
    if (this.hass) {
      void setNumber(this.hass, event.detail.entityId, event.detail.value);
    }
  };

  private _onSettingMoreInfo = (event: CustomEvent<{ entityId: string }>): void => {
    this._openEntity(event.detail.entityId);
  };

  private _snooze(view: AlarmView): void {
    if (this.hass) {
      void snooze(this.hass, view.deviceId);
    }
  }

  private _dismiss(view: AlarmView): void {
    if (this.hass) {
      void dismiss(this.hass, view.deviceId);
    }
  }

  private _test(view: AlarmView): void {
    if (this.hass) {
      void triggerAlarm(this.hass, view.deviceId);
    }
  }

  // -- styles ---------------------------------------------------------------

  public static override styles = [
    themeTokens,
    controlStyles,
    css`
      :host {
        display: block;
        /*
         * The row's own rendered width, not the viewport's: a card can be a
         * narrow column in an otherwise wide window (a grid layout, a
         * sidebar), where a viewport media query would never fire.
         */
        container-type: inline-size;
      }

      .item {
        --status-color: var(--alarm-clocks-disabled);
      }

      .item.status-armed,
      .item.status-pre_active,
      .item.status-post_pending,
      .item.status-post_active {
        --status-color: var(--alarm-clocks-armed);
      }

      .item.status-ringing {
        --status-color: var(--alarm-clocks-ringing);
      }

      .item.status-snoozed {
        --status-color: var(--alarm-clocks-snoozed);
      }

      .row {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 56px;
        padding: 8px;
      }

      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: var(--alarm-clocks-chip-background);
        background: color-mix(in srgb, var(--status-color) 18%, transparent);
        color: var(--status-color);
      }

      .icon ha-icon {
        --mdc-icon-size: 22px;
      }

      .info {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
        min-width: 0;
        padding: 4px 0;
        border: none;
        background: transparent;
        color: inherit;
        font-family: inherit;
        text-align: left;
        cursor: pointer;
      }

      .info:focus-visible {
        outline: 2px solid var(--alarm-clocks-accent);
        outline-offset: 2px;
        border-radius: 6px;
      }

      .name {
        max-width: 100%;
        color: var(--primary-text-color);
        font-size: 0.95rem;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .title .name {
        font-size: 1rem;
        font-weight: 600;
      }

      .sub {
        max-width: 100%;
        color: var(--secondary-text-color);
        font-size: 0.8rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .status {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--secondary-text-color);
        font-size: 0.82rem;
      }

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--status-color);
      }

      .time {
        flex: 0 0 auto;
        color: var(--primary-text-color);
        font-size: 1.05rem;
        font-variant-numeric: tabular-nums;
      }

      .row-actions {
        display: flex;
        flex: 0 0 auto;
        gap: 2px;
      }

      .danger-icon {
        color: var(--alarm-clocks-ringing);
      }

      .expand-btn {
        flex: 0 0 auto;
      }

      .expand-btn ha-icon {
        --mdc-icon-size: 20px;
      }

      .toggle {
        position: relative;
        flex: 0 0 auto;
        width: 46px;
        height: 28px;
        padding: 0;
        border: none;
        border-radius: 999px;
        background: var(--alarm-clocks-chip-background);
        cursor: pointer;
        transition: background-color 180ms ease-out;
        -webkit-tap-highlight-color: transparent;
      }

      .toggle.on {
        background: var(--alarm-clocks-accent);
      }

      .toggle:focus-visible {
        outline: 2px solid var(--alarm-clocks-accent);
        outline-offset: 2px;
      }

      .knob {
        position: absolute;
        top: 3px;
        left: 3px;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: var(--card-background-color, #fff);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        transition: transform 180ms ease-out;
      }

      .toggle.on .knob {
        transform: translateX(18px);
      }

      .body {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 0 8px 16px;
      }

      .hero {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        gap: 4px 16px;
      }

      .no-time {
        color: var(--secondary-text-color);
        font-size: 2.4rem;
        font-weight: 300;
        line-height: 1.1;
      }

      .item.disabled alarm-clocks-time-stepper {
        opacity: 0.75;
      }

      .meta {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }

      .meta .primary {
        color: var(--primary-text-color);
        font-size: 0.95rem;
        font-weight: 500;
      }

      .meta .primary.muted {
        color: var(--secondary-text-color);
        font-weight: 400;
      }

      .meta .secondary {
        color: var(--secondary-text-color);
        font-size: 0.82rem;
      }

      .badge {
        align-self: flex-start;
        margin-top: 2px;
        padding: 2px 8px;
        border-radius: 999px;
        background: var(--alarm-clocks-chip-background);
        color: var(--secondary-text-color);
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .actions .btn {
        flex: 1 1 130px;
      }

      .actions ha-icon {
        --mdc-icon-size: 20px;
      }

      .settings {
        display: flex;
        flex-direction: column;
        gap: 2px;
        border-top: 1px solid var(--divider-color);
        padding-top: 6px;
      }

      @container (max-width: 340px) {
        .time {
          display: none;
        }

        .actions .btn {
          flex: 1 1 100%;
        }
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "alarm-clocks-item": MacaAlarmItem;
  }
}
