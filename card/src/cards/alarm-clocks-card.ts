import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";

import "../components/alarm-clocks-item";

import { ALARM_CARD_EDITOR_TAG, ALARM_CARD_TAG } from "../const";
import { findMacaDevices } from "../lib/discovery";
import { createLocalizer, languageOf } from "../lib/localize";
import { buildAlarmView, type AlarmView } from "../lib/model";
import { controlStyles, errorStyles, themeTokens } from "../styles";
import type {
  HomeAssistant,
  LovelaceCardEditor,
  LovelaceGridOptions,
  MacaAlarmCardConfig,
} from "../types";

const DEFAULTS = {
  hide_disabled: false,
  show_days: true,
  show_next_alarm: true,
  show_settings: true,
  show_test_button: false,
  expandable: true,
  expanded: false,
};

/** Relative times are re-rendered on this interval, nothing else ticks. */
const TICK_INTERVAL = 30_000;

@customElement(ALARM_CARD_TAG)
export class MacaAlarmCard extends LitElement {
  @state() private _config?: MacaAlarmCardConfig;

  @state() private _now = Date.now();

  @state() private _narrow = false;

  /** The one expanded device in accordion mode; unset while `expandable` is false. */
  @state() private _expandedDeviceId?: string;

  private _expandedSeeded = false;

  private _hass?: HomeAssistant;

  private _views: AlarmView[] = [];

  private _tickTimer?: number;

  private _resizeObserver?: ResizeObserver;

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/alarm-clocks-card-editor");
    return document.createElement(ALARM_CARD_EDITOR_TAG) as LovelaceCardEditor;
  }

  public static getStubConfig(hass: HomeAssistant): MacaAlarmCardConfig {
    const devices = findMacaDevices(hass);
    if (devices.length === 1) {
      // The common case: one alarm clock. Show it fully open right away,
      // instead of a one-row list that still needs a click.
      return { type: `custom:${ALARM_CARD_TAG}`, devices, expanded: true };
    }
    return { type: `custom:${ALARM_CARD_TAG}` };
  }

  public setConfig(config: MacaAlarmCardConfig): void {
    if (!config) {
      throw new Error("Invalid configuration");
    }
    if (config.devices !== undefined && !Array.isArray(config.devices)) {
      throw new Error("`devices` must be a list of device ids");
    }
    this._config = { ...DEFAULTS, ...config };
    this._views = [];
    this._expandedSeeded = false;
    this._expandedDeviceId = undefined;
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

  /**
   * Only re-render when something the card actually shows has changed.
   * `hass` is replaced on every state change in the whole instance, so a
   * naive property would repaint the card constantly.
   */
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
    const rows = this._views.length || 1;
    const expandedCount =
      this._config?.expandable === false
        ? this._config.expanded
          ? rows
          : 0
        : this._expandedDeviceId
          ? 1
          : 0;
    return 1 + (rows - expandedCount) + expandedCount * 5;
  }

  public getGridOptions(): LovelaceGridOptions {
    // The height follows the number of alarms and which one is expanded,
    // both of which change at runtime.
    return {
      columns: 12,
      rows: "auto",
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
    const deviceIds = config.devices?.length ? config.devices : findMacaDevices(hass);

    this._views = deviceIds
      .filter((deviceId) => hass.devices?.[deviceId])
      .map((deviceId) => buildAlarmView(hass, deviceId))
      .filter((view) => !view.incomplete)
      .sort((a, b) => a.name.localeCompare(b.name, languageOf(hass)));

    const visible = config.hide_disabled ? this._views.filter((view) => view.enabled) : this._views;

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

    if (!this._expandedSeeded) {
      this._expandedSeeded = true;
      if (config.expandable !== false && config.expanded) {
        this._expandedDeviceId = visible[0].deviceId;
      }
    }

    return html`
      <ha-card .header=${config.title}>
        <div class="list">${visible.map((view) => this._renderItem(view))}</div>
      </ha-card>
    `;
  }

  private _renderItem(view: AlarmView): TemplateResult {
    const config = this._config!;
    const expandable = config.expandable !== false;
    const expanded = expandable ? view.deviceId === this._expandedDeviceId : config.expanded === true;

    return html`
      <alarm-clocks-item
        .hass=${this._hass}
        .view=${view}
        .now=${this._now}
        .narrow=${this._narrow}
        .expanded=${expanded}
        .expandable=${expandable}
        .showDays=${config.show_days !== false}
        .showNextAlarm=${config.show_next_alarm !== false}
        .showSettings=${config.show_settings !== false}
        .showTestButton=${config.show_test_button === true}
        .minuteStep=${config.minute_step ?? 5}
        @toggle-expand=${this._onToggleExpand}
      ></alarm-clocks-item>
    `;
  }

  private _onToggleExpand = (event: CustomEvent<{ deviceId: string }>): void => {
    const deviceId = event.detail.deviceId;
    this._expandedDeviceId = this._expandedDeviceId === deviceId ? undefined : deviceId;
  };

  // -- styles ---------------------------------------------------------------

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

      alarm-clocks-item {
        display: block;
      }

      alarm-clocks-item + alarm-clocks-item {
        border-top: 1px solid var(--divider-color);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "alarm-clocks-card": MacaAlarmCard;
  }
}
