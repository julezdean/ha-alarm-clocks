import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

import "../components/alarm-clocks-weekday-picker";
import "../components/alarm-clocks-time-stepper";
import "../components/alarm-clocks-setting-row";

import {
  ALARM_CARD_EDITOR_TAG,
  ALARM_CARD_TAG,
  STATUS,
  STATUS_ICONS,
} from "../const";
import { dismiss, setNumber, showMoreInfo, snooze, toggleSwitch, triggerAlarm, setTime } from "../lib/actions";
import { findMacaDevices, resolveDeviceId } from "../lib/discovery";
import { createLocalizer, languageOf, type Localizer } from "../lib/localize";
import { buildAlarmView, type AlarmView } from "../lib/model";
import { formatAbsolute, formatDuration, formatRelative, formatClock } from "../lib/time";
import { controlStyles, errorStyles, themeTokens } from "../styles";
import type {
  HomeAssistant,
  LovelaceCardEditor,
  LovelaceGridOptions,
  MacaAlarmCardConfig,
} from "../types";

const DEFAULTS = {
  show_days: true,
  show_next_alarm: true,
  show_settings: true,
  settings_expanded: false,
  show_test_button: false,
};

/** Relative times are re-rendered on this interval, nothing else ticks. */
const TICK_INTERVAL = 30_000;

@customElement(ALARM_CARD_TAG)
export class MacaAlarmCard extends LitElement {
  @state() private _config?: MacaAlarmCardConfig;

  @state() private _now = Date.now();

  @state() private _settingsOpen = false;

  @state() private _narrow = false;

  @state() private _pendingTime?: { hours: number; minutes: number };

  private _timeTimer?: number;

  private _hass?: HomeAssistant;

  private _view?: AlarmView;

  private _tickTimer?: number;

  private _resizeObserver?: ResizeObserver;

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/alarm-clocks-card-editor");
    return document.createElement(ALARM_CARD_EDITOR_TAG) as LovelaceCardEditor;
  }

  public static getStubConfig(hass: HomeAssistant): MacaAlarmCardConfig {
    const devices = findMacaDevices(hass);
    return {
      type: `custom:${ALARM_CARD_TAG}`,
      ...(devices.length ? { device_id: devices[0] } : {}),
    };
  }

  public setConfig(config: MacaAlarmCardConfig): void {
    if (!config) {
      throw new Error("Invalid configuration");
    }
    if (config.device_id && typeof config.device_id !== "string") {
      throw new Error("`device_id` must be a string");
    }
    if (config.entity && typeof config.entity !== "string") {
      throw new Error("`entity` must be an entity id");
    }
    this._config = { ...DEFAULTS, ...config };
    this._settingsOpen = this._config.settings_expanded === true;
    this._view = undefined;
  }

  public set hass(hass: HomeAssistant) {
    const previous = this._hass;
    this._hass = hass;
    if (this._shouldRefresh(previous, hass)) {
      this._view = undefined;
      this.requestUpdate();
    }
  }

  public get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  /**
   * Only re-render when something the card actually shows has changed.
   * `hass` is replaced on every state change in the whole instance, so a
   * naive property would repaint the card constantly.
   */
  private _shouldRefresh(previous: HomeAssistant | undefined, next: HomeAssistant): boolean {
    if (!previous || !this._view) {
      return true;
    }
    if (previous.entities !== next.entities || previous.devices !== next.devices) {
      return true;
    }
    if (previous.locale !== next.locale || previous.themes !== next.themes) {
      return true;
    }
    return this._view.trackedEntityIds.some(
      (entityId) => previous.states[entityId] !== next.states[entityId],
    );
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this._tickTimer = window.setInterval(() => {
      this._now = Date.now();
    }, TICK_INTERVAL);

    if (typeof ResizeObserver !== "undefined") {
      this._resizeObserver = new ResizeObserver((entries) => {
        const width = entries[0]?.contentRect.width ?? 0;
        const narrow = width > 0 && width < 320;
        if (narrow !== this._narrow) {
          this._narrow = narrow;
        }
      });
      this._resizeObserver.observe(this);
    }
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._tickTimer !== undefined) {
      window.clearInterval(this._tickTimer);
      this._tickTimer = undefined;
    }
    this._resizeObserver?.disconnect();
    this._resizeObserver = undefined;
  }

  public getCardSize(): number {
    let size = 3;
    if (this._config?.show_days !== false) size += 1;
    if (this._config?.show_settings !== false) size += 1;
    return size;
  }

  public getGridOptions(): LovelaceGridOptions {
    let rows = 3;
    if (this._config?.show_days !== false) rows += 1;
    if (this._settingsOpen) rows += 2;
    return { columns: 12, rows, min_columns: 6, min_rows: 3 };
  }

  protected override render(): TemplateResult | typeof nothing {
    const hass = this._hass;
    const config = this._config;
    if (!hass || !config) {
      return nothing;
    }

    const localize = createLocalizer(hass);
    const { deviceId, error } = resolveDeviceId(hass, config);

    if (!deviceId) {
      const messageKey =
        error === "multiple"
          ? "error.multiple_devices"
          : error === "not_found"
            ? "error.device_not_found"
            : "error.no_device";
      return this._renderError(localize(messageKey));
    }

    const view = buildAlarmView(hass, deviceId);
    this._view = view;

    if (view.incomplete) {
      return this._renderError(localize("error.incomplete"));
    }

    const name = config.name ?? view.name;

    return html`
      <ha-card class=${classMap({ [`status-${view.status}`]: true, disabled: !view.enabled })}>
        <div class="content">
          ${this._renderHeader(view, name, localize)} ${this._renderHero(view, localize)}
          ${config.show_days !== false ? this._renderDays(view, localize) : nothing}
          ${this._renderActions(view, localize)}
          ${config.show_settings !== false && view.settings.length
            ? this._renderSettings(view, localize)
            : nothing}
        </div>
      </ha-card>
    `;
  }

  private _renderHeader(view: AlarmView, name: string, localize: Localizer): TemplateResult {
    const statusLabel = localize(`status.${view.status}`);
    return html`
      <div class="header">
        <div class="icon" aria-hidden="true">
          <ha-icon icon=${STATUS_ICONS[view.status] ?? STATUS_ICONS.unknown}></ha-icon>
        </div>
        <button
          type="button"
          class="title"
          @click=${this._openDeviceInfo}
          title=${name}
        >
          <span class="name">${name}</span>
          <span class="status">
            <span class="dot" aria-hidden="true"></span>${statusLabel}
          </span>
        </button>
        ${this._renderToggle(view, localize)}
      </div>
    `;
  }

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
        aria-label=${localize(view.enabled ? "action.disable" : "action.enable")}
        @click=${() => this._toggleEnabled(view)}
      >
        <span class="knob"></span>
      </button>
    `;
  }

  private _renderHero(view: AlarmView, localize: Localizer): TemplateResult {
    const language = languageOf(this._hass);
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
          .hass=${this._hass}
          .hours=${time.hours}
          .minutes=${time.minutes}
          .minuteStep=${this._config?.minute_step ?? 5}
          .disabled=${!editable}
          @time-changed=${this._onTimeChanged}
        ></alarm-clocks-time-stepper>
        <div class="meta">${this._renderMeta(view, localize, language)}</div>
        <button
          type="button"
          class="icon-btn edit-time"
          aria-label=${localize("action.edit_time")}
          title=${localize("action.edit_time")}
          ?disabled=${!editable}
          @click=${() => this._openEntity(view.entities.alarmTime)}
        >
          <ha-icon icon="mdi:pencil-outline"></ha-icon>
        </button>
      </div>
    `;
  }

  /**
   * Apply a stepped time.
   *
   * The display follows immediately while the service call is debounced, so
   * holding a button does not fire dozens of calls.
   */
  private _onTimeChanged = (event: CustomEvent<{ hours: number; minutes: number }>): void => {
    this._pendingTime = { hours: event.detail.hours, minutes: event.detail.minutes };
    if (this._timeTimer !== undefined) {
      window.clearTimeout(this._timeTimer);
    }
    this._timeTimer = window.setTimeout(() => {
      this._timeTimer = undefined;
      const entityId = this._view?.entities.alarmTime;
      const pending = this._pendingTime;
      if (this._hass && entityId && pending) {
        void setTime(this._hass, entityId, pending.hours, pending.minutes);
      }
      // Keep showing the pending value until the entity reports it back.
      window.setTimeout(() => {
        this._pendingTime = undefined;
      }, 2000);
    }, 600);
  };

  private _renderMeta(
    view: AlarmView,
    localize: Localizer,
    language: string,
  ): TemplateResult | typeof nothing {
    if (this._config?.show_next_alarm === false) {
      return nothing;
    }

    if (view.status === STATUS.RINGING) {
      const since = view.ringingSince
        ? localize("label.ringing_since", {
            duration: formatDuration(this._now - view.ringingSince.getTime(), localize),
          })
        : localize("status.ringing");
      return html`<span class="primary">${since}</span>`;
    }

    if (view.status === STATUS.POST_PENDING) {
      return html`<span class="primary">${localize("label.post_pending")}</span>`;
    }

    if (!view.nextAlarm) {
      // `sensor.<alarm>_next_alarm` is unavailable while the alarm is off.
      return html`<span class="primary muted">${localize("label.no_alarm")}</span>`;
    }

    const relative = formatRelative(view.nextAlarm, this._now, localize);
    const absolute =
      view.status === STATUS.SNOOZED
        ? localize("label.until", { time: formatClock(view.nextAlarm, language) })
        : formatAbsolute(view.nextAlarm, this._now, language, localize);

    return html`
      <span class="primary">${relative}</span>
      <span class="secondary">${absolute}</span>
      ${view.isOneShot
        ? html`<span class="badge">${localize("label.one_shot")}</span>`
        : nothing}
    `;
  }

  private _renderDays(view: AlarmView, _localize: Localizer): TemplateResult {
    return html`
      <alarm-clocks-weekday-picker
        .hass=${this._hass}
        .days=${view.days}
        .compact=${this._narrow}
        @day-toggled=${this._onDayToggled}
      ></alarm-clocks-weekday-picker>
    `;
  }

  private _renderActions(view: AlarmView, localize: Localizer): TemplateResult | typeof nothing {
    const showTest = this._config?.show_test_button === true && !view.canDismiss;
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

  private _renderSettings(view: AlarmView, localize: Localizer): TemplateResult {
    const summary = view.settings
      .map((setting) => {
        const value =
          setting.zeroMeansOff && setting.value === 0
            ? localize("label.off")
            : `${setting.value} ${localize("unit.minutes_short")}`;
        return `${localize(setting.labelKey)} ${value}`;
      })
      .join(" · ");

    return html`
      <div class="settings">
        <button
          type="button"
          class="settings-toggle"
          aria-expanded=${this._settingsOpen ? "true" : "false"}
          aria-label=${localize(this._settingsOpen ? "action.hide_settings" : "action.show_settings")}
          @click=${this._toggleSettings}
        >
          <span class="summary">${summary}</span>
          <ha-icon icon=${this._settingsOpen ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
        </button>
        ${this._settingsOpen
          ? html`<div class="settings-body">
              ${view.settings.map(
                (setting) => html`
                  <alarm-clocks-setting-row
                    .hass=${this._hass}
                    .setting=${setting}
                    @setting-changed=${this._onSettingChanged}
                    @setting-more-info=${this._onSettingMoreInfo}
                  ></alarm-clocks-setting-row>
                `,
              )}
            </div>`
          : nothing}
      </div>
    `;
  }

  private _renderError(message: string): TemplateResult {
    return html`
      <ha-card>
        <div class="error">
          <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
          <span>${message}</span>
        </div>
      </ha-card>
    `;
  }

  // -- interactions ---------------------------------------------------------

  private _toggleSettings = (): void => {
    this._settingsOpen = !this._settingsOpen;
  };

  private _openDeviceInfo = (): void => {
    const entityId = this._view?.entities.status ?? this._view?.entities.enabled;
    this._openEntity(entityId);
  };

  private _openEntity(entityId?: string): void {
    if (entityId) {
      showMoreInfo(this, entityId);
    }
  }

  private _toggleEnabled(view: AlarmView): void {
    if (this._hass && view.entities.enabled) {
      void toggleSwitch(this._hass, view.entities.enabled);
    }
  }

  private _onDayToggled = (event: CustomEvent<{ entityId: string }>): void => {
    if (this._hass) {
      void toggleSwitch(this._hass, event.detail.entityId);
    }
  };

  private _onSettingChanged = (event: CustomEvent<{ entityId: string; value: number }>): void => {
    if (this._hass) {
      void setNumber(this._hass, event.detail.entityId, event.detail.value);
    }
  };

  private _onSettingMoreInfo = (event: CustomEvent<{ entityId: string }>): void => {
    this._openEntity(event.detail.entityId);
  };

  private _snooze(view: AlarmView): void {
    if (this._hass) {
      void snooze(this._hass, view.deviceId);
    }
  }

  private _dismiss(view: AlarmView): void {
    if (this._hass) {
      void dismiss(this._hass, view.deviceId);
    }
  }

  private _test(view: AlarmView): void {
    if (this._hass) {
      void triggerAlarm(this._hass, view.deviceId);
    }
  }

  // -- styles ---------------------------------------------------------------

  public static override styles = [
    themeTokens,
    controlStyles,
    errorStyles,
    css`
      :host {
        display: block;
      }

      ha-card {
        --status-color: var(--alarm-clocks-disabled);
        overflow: hidden;
      }

      ha-card.status-armed,
      ha-card.status-pre_active,
      ha-card.status-post_pending {
        --status-color: var(--alarm-clocks-armed);
      }

      ha-card.status-ringing {
        --status-color: var(--alarm-clocks-ringing);
      }

      ha-card.status-snoozed {
        --status-color: var(--alarm-clocks-snoozed);
      }

      .content {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 14px 16px 16px;
      }

      .header {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
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

      .title {
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

      .title:focus-visible {
        outline: 2px solid var(--alarm-clocks-accent);
        outline-offset: 2px;
        border-radius: 6px;
      }

      .name {
        max-width: 100%;
        color: var(--primary-text-color);
        font-size: 1rem;
        font-weight: 600;
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

      .edit-time {
        align-self: flex-start;
        flex: 0 0 auto;
      }

      .edit-time ha-icon {
        --mdc-icon-size: 20px;
      }

      ha-card.disabled alarm-clocks-time-stepper {
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
        border-top: 1px solid var(--divider-color);
        padding-top: 6px;
      }

      .settings-toggle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        width: 100%;
        min-height: var(--alarm-clocks-tap-target);
        padding: 0;
        border: none;
        background: transparent;
        color: var(--secondary-text-color);
        font-family: inherit;
        font-size: 0.82rem;
        cursor: pointer;
      }

      .settings-toggle:focus-visible {
        outline: 2px solid var(--alarm-clocks-accent);
        outline-offset: 2px;
        border-radius: 6px;
      }

      .summary {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .settings-body {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding-top: 4px;
      }

      @media (max-width: 340px) {
        .time {
          font-size: 2rem;
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
    "alarm-clocks-card": MacaAlarmCard;
  }
}
