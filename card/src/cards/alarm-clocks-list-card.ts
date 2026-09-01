import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

import { LIST_CARD_EDITOR_TAG, LIST_CARD_TAG, STATUS, STATUS_ICONS } from "../const";
import { dismiss, showMoreInfo, snooze, toggleSwitch } from "../lib/actions";
import { findMacaDevices } from "../lib/discovery";
import { createLocalizer, languageOf, type Localizer } from "../lib/localize";
import { buildAlarmView, type AlarmView } from "../lib/model";
import { formatClock, formatRelative } from "../lib/time";
import { controlStyles, errorStyles, themeTokens } from "../styles";
import type {
  HomeAssistant,
  LovelaceCardEditor,
  LovelaceGridOptions,
  MacaAlarmListCardConfig,
} from "../types";

const TICK_INTERVAL = 30_000;

@customElement(LIST_CARD_TAG)
export class MacaAlarmListCard extends LitElement {
  @state() private _config?: MacaAlarmListCardConfig;

  @state() private _now = Date.now();

  private _hass?: HomeAssistant;

  private _views: AlarmView[] = [];

  private _tickTimer?: number;

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/alarm-clocks-list-card-editor");
    return document.createElement(LIST_CARD_EDITOR_TAG) as LovelaceCardEditor;
  }

  public static getStubConfig(): MacaAlarmListCardConfig {
    return { type: `custom:${LIST_CARD_TAG}` };
  }

  public setConfig(config: MacaAlarmListCardConfig): void {
    if (!config) {
      throw new Error("Invalid configuration");
    }
    if (config.devices !== undefined && !Array.isArray(config.devices)) {
      throw new Error("`devices` must be a list of device ids");
    }
    this._config = { show_next_alarm: true, hide_disabled: false, ...config };
    this._views = [];
  }

  public set hass(hass: HomeAssistant) {
    const previous = this._hass;
    this._hass = hass;
    if (this._shouldRefresh(previous, hass)) {
      this.requestUpdate();
    }
  }

  public get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  private _shouldRefresh(previous: HomeAssistant | undefined, next: HomeAssistant): boolean {
    if (!previous || !this._views.length) {
      return true;
    }
    if (previous.entities !== next.entities || previous.devices !== next.devices) {
      return true;
    }
    if (previous.locale !== next.locale || previous.themes !== next.themes) {
      return true;
    }
    return this._views.some((view) =>
      view.trackedEntityIds.some((entityId) => previous.states[entityId] !== next.states[entityId]),
    );
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this._tickTimer = window.setInterval(() => {
      this._now = Date.now();
    }, TICK_INTERVAL);
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._tickTimer !== undefined) {
      window.clearInterval(this._tickTimer);
      this._tickTimer = undefined;
    }
  }

  public getCardSize(): number {
    return 1 + Math.max(1, this._views.length);
  }

  public getGridOptions(): LovelaceGridOptions {
    return {
      columns: 12,
      rows: 1 + Math.max(1, this._views.length),
      min_columns: 6,
      min_rows: 2,
    };
  }

  protected override render(): TemplateResult | typeof nothing {
    const hass = this._hass;
    const config = this._config;
    if (!hass || !config) {
      return nothing;
    }

    const localize = createLocalizer(hass);
    const deviceIds =
      config.devices && config.devices.length ? config.devices : findMacaDevices(hass);

    this._views = deviceIds
      .filter((deviceId) => hass.devices?.[deviceId])
      .map((deviceId) => buildAlarmView(hass, deviceId))
      .filter((view) => !view.incomplete)
      .sort((a, b) => a.name.localeCompare(b.name, languageOf(hass)));

    const visible = config.hide_disabled
      ? this._views.filter((view) => view.enabled)
      : this._views;

    if (!visible.length) {
      return html`
        <ha-card .header=${config.title}>
          <div class="error">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            <span>${localize("error.no_alarms")}</span>
          </div>
        </ha-card>
      `;
    }

    return html`
      <ha-card .header=${config.title}>
        <div class="list">${visible.map((view) => this._renderRow(view, localize))}</div>
      </ha-card>
    `;
  }

  private _renderRow(view: AlarmView, localize: Localizer): TemplateResult {
    const language = languageOf(this._hass);
    const time = view.alarmTime
      ? `${String(view.alarmTime.hours).padStart(2, "0")}:${String(view.alarmTime.minutes).padStart(2, "0")}`
      : localize("label.no_time");

    return html`
      <div class=${classMap({ row: true, [`status-${view.status}`]: true })}>
        <div class="icon" aria-hidden="true">
          <ha-icon icon=${STATUS_ICONS[view.status] ?? STATUS_ICONS.unknown}></ha-icon>
        </div>
        <button type="button" class="info" @click=${() => this._openInfo(view)}>
          <span class="name">${view.name}</span>
          <span class="sub">${this._subtitle(view, localize, language)}</span>
        </button>
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
        aria-label=${`${view.name}: ${localize(view.enabled ? "action.disable" : "action.enable")}`}
        @click=${() => this._toggle(view)}
      >
        <span class="knob"></span>
      </button>
    `;
  }

  private _subtitle(view: AlarmView, localize: Localizer, language: string): string {
    if (view.status === STATUS.RINGING || view.status === STATUS.POST_PENDING) {
      return localize(`status.${view.status}`);
    }
    if (this._config?.show_next_alarm === false || !view.nextAlarm) {
      return localize(`status.${view.status}`);
    }
    if (view.status === STATUS.SNOOZED) {
      return `${localize("status.snoozed")} · ${localize("label.until", {
        time: formatClock(view.nextAlarm, language),
      })}`;
    }
    return formatRelative(view.nextAlarm, this._now, localize);
  }

  private _openInfo(view: AlarmView): void {
    const entityId = view.entities.status ?? view.entities.enabled;
    if (entityId) {
      showMoreInfo(this, entityId);
    }
  }

  private _toggle(view: AlarmView): void {
    if (this._hass && view.entities.enabled) {
      void toggleSwitch(this._hass, view.entities.enabled);
    }
  }

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

  public static override styles = [
    themeTokens,
    controlStyles,
    errorStyles,
    css`
      :host {
        display: block;
      }

      .list {
        display: flex;
        flex-direction: column;
        padding: 4px 8px 8px;
      }

      .row {
        --status-color: var(--alarm-clocks-disabled);
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 56px;
        padding: 4px 8px;
      }

      .row + .row {
        border-top: 1px solid var(--divider-color);
      }

      .row.status-armed,
      .row.status-pre_active,
      .row.status-post_pending {
        --status-color: var(--alarm-clocks-armed);
      }

      .row.status-ringing {
        --status-color: var(--alarm-clocks-ringing);
      }

      .row.status-snoozed {
        --status-color: var(--alarm-clocks-snoozed);
      }

      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: var(--alarm-clocks-chip-background);
        background: color-mix(in srgb, var(--status-color) 18%, transparent);
        color: var(--status-color);
      }

      .icon ha-icon {
        --mdc-icon-size: 20px;
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

      .sub {
        max-width: 100%;
        color: var(--secondary-text-color);
        font-size: 0.8rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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

      .toggle {
        position: relative;
        flex: 0 0 auto;
        width: 42px;
        height: 26px;
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
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--card-background-color, #fff);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        transition: transform 180ms ease-out;
      }

      .toggle.on .knob {
        transform: translateX(16px);
      }

      @media (max-width: 340px) {
        .time {
          display: none;
        }
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "alarm-clocks-list-card": MacaAlarmListCard;
  }
}
