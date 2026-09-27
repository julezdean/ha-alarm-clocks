import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";

import { ALARM_CARD_EDITOR_TAG, ALARM_CLOCKS_DOMAIN } from "../const";
import { fireEvent } from "../lib/actions";
import { normalizeDeviceConfig } from "../lib/discovery";
import { createLocalizer, type Localizer } from "../lib/localize";
import { controlStyles } from "../styles";
import type { HomeAssistant, MacaAlarmCardConfig, MacaAlarmDeviceConfig } from "../types";

interface FormSchemaItem {
  name: string;
  type?: string;
  selector?: unknown;
  schema?: FormSchemaItem[];
}

/** Everything left at the card level: just the heading above the alarm list. */
const CARD_SCHEMA: FormSchemaItem[] = [{ name: "title", selector: { text: {} } }];

/** A single-field form: just the device picker, reused for the "add" slot and the detail page. */
const PICKER_SCHEMA: FormSchemaItem[] = [
  { name: "device_id", selector: { device: { filter: { integration: ALARM_CLOCKS_DOMAIN } } } },
];

/** The detail page: every option, for this one alarm. */
const DEVICE_SCHEMA: FormSchemaItem[] = [
  { name: "name", selector: { text: {} } },
  {
    name: "minute_step",
    selector: { number: { min: 1, max: 30, step: 1, mode: "box", unit_of_measurement: "min" } },
  },
  {
    name: "",
    type: "grid",
    schema: [
      { name: "expandable", selector: { boolean: {} } },
      { name: "expanded", selector: { boolean: {} } },
      { name: "hide_disabled", selector: { boolean: {} } },
      { name: "show_days", selector: { boolean: {} } },
      { name: "show_next_alarm", selector: { boolean: {} } },
      { name: "show_settings", selector: { boolean: {} } },
      { name: "show_test_button", selector: { boolean: {} } },
    ],
  },
];

@customElement(ALARM_CARD_EDITOR_TAG)
export class MacaAlarmCardEditor extends LitElement {
  @state() public hass?: HomeAssistant;

  @state() private _config?: MacaAlarmCardConfig;

  /** Which device (by index) has its own detail page open; the list otherwise. */
  @state() private _editingIndex?: number;

  public setConfig(config: MacaAlarmCardConfig): void {
    this._config = config;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) {
      return nothing;
    }
    const localize = createLocalizer(this.hass);
    const devices = (this._config.devices ?? []).map(normalizeDeviceConfig);

    const editing = this._editingIndex !== undefined ? devices[this._editingIndex] : undefined;
    if (editing) {
      return this._renderDetail(editing, this._editingIndex!, localize);
    }

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${CARD_SCHEMA}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>

      <div class="devices">
        <span class="heading">${localize("editor.devices")}</span>
        ${devices.map((entry, index) => this._renderDeviceRow(entry, index, localize))}
        <div class="device-row add-row">
          <ha-form
            class="picker"
            .hass=${this.hass}
            .data=${{ device_id: undefined }}
            .schema=${PICKER_SCHEMA}
            .computeLabel=${this._computeLabel}
            @value-changed=${this._onAddDeviceChanged}
          ></ha-form>
          <ha-icon icon="mdi:plus" aria-label=${localize("editor.add_device")}></ha-icon>
        </div>
      </div>
    `;
  }

  /** One row in the list: the resolved name plus edit and remove. */
  private _renderDeviceRow(
    entry: MacaAlarmDeviceConfig,
    index: number,
    localize: Localizer,
  ): TemplateResult {
    return html`
      <div class="device-row">
        <span class="device-name">${this._deviceLabel(entry)}</span>
        <button
          type="button"
          class="icon-btn"
          aria-label=${localize("editor.edit_device")}
          title=${localize("editor.edit_device")}
          @click=${() => this._editDevice(index)}
        >
          <ha-icon icon="mdi:pencil-outline"></ha-icon>
        </button>
        <button
          type="button"
          class="icon-btn danger-icon"
          aria-label=${localize("editor.remove_device")}
          title=${localize("editor.remove_device")}
          @click=${() => this._removeDevice(index)}
        >
          <ha-icon icon="mdi:trash-can-outline"></ha-icon>
        </button>
      </div>
    `;
  }

  /** The detail page for one alarm: a back arrow, the device picker, every option. */
  private _renderDetail(
    entry: MacaAlarmDeviceConfig,
    index: number,
    localize: Localizer,
  ): TemplateResult {
    const onChanged = (event: CustomEvent<{ value: MacaAlarmDeviceConfig }>): void =>
      this._onDeviceChanged(index, event);

    return html`
      <div class="detail-header">
        <button
          type="button"
          class="icon-btn"
          aria-label=${localize("editor.back")}
          title=${localize("editor.back")}
          @click=${this._closeDetail}
        >
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </button>
        <span class="detail-title">${this._deviceLabel(entry)}</span>
      </div>
      <ha-form
        .hass=${this.hass}
        .data=${entry}
        .schema=${PICKER_SCHEMA}
        .computeLabel=${this._computeLabel}
        @value-changed=${onChanged}
      ></ha-form>
      <ha-form
        .hass=${this.hass}
        .data=${entry}
        .schema=${DEVICE_SCHEMA}
        .computeLabel=${this._computeDeviceLabel}
        @value-changed=${onChanged}
      ></ha-form>
    `;
  }

  private _deviceLabel(entry: MacaAlarmDeviceConfig): string {
    if (entry.name) {
      return entry.name;
    }
    const device = this.hass?.devices?.[entry.device_id];
    return device?.name_by_user || device?.name || entry.device_id;
  }

  private _computeLabel = (schema: FormSchemaItem): string => {
    const localize = createLocalizer(this.hass);
    if (schema.name === "device_id") {
      return localize("editor.pick_device");
    }
    return localize(`editor.${schema.name}`);
  };

  /** Same as `_computeLabel`, but "expanded" reads as this one alarm's own state. */
  private _computeDeviceLabel = (schema: FormSchemaItem): string => {
    if (schema.name === "expanded") {
      return createLocalizer(this.hass)("editor.device_expanded");
    }
    return this._computeLabel(schema);
  };

  private _valueChanged = (event: CustomEvent<{ value: MacaAlarmCardConfig }>): void => {
    event.stopPropagation();
    fireEvent(this, "config-changed", { config: event.detail.value });
  };

  private _editDevice = (index: number): void => {
    this._editingIndex = index;
  };

  private _closeDetail = (): void => {
    this._editingIndex = undefined;
  };

  private _onDeviceChanged(index: number, event: CustomEvent<{ value: MacaAlarmDeviceConfig }>): void {
    event.stopPropagation();
    const devices = (this._config?.devices ?? []).map(normalizeDeviceConfig);
    devices[index] = event.detail.value;
    this._updateDevices(devices);
  }

  private _removeDevice(index: number): void {
    const devices = (this._config?.devices ?? [])
      .map(normalizeDeviceConfig)
      .filter((_entry, entryIndex) => entryIndex !== index);
    this._updateDevices(devices);
  }

  private _onAddDeviceChanged = (event: CustomEvent<{ value: { device_id?: string } }>): void => {
    event.stopPropagation();
    const deviceId = event.detail.value.device_id;
    if (!deviceId) {
      return;
    }
    const devices = [...(this._config?.devices ?? []).map(normalizeDeviceConfig), { device_id: deviceId }];
    this._updateDevices(devices);
  };

  private _updateDevices(devices: MacaAlarmDeviceConfig[]): void {
    if (!this._config) {
      return;
    }
    fireEvent(this, "config-changed", { config: { ...this._config, devices } });
  }

  public static override styles = [
    controlStyles,
    css`
      ha-form {
        display: block;
      }

      .devices {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-top: 16px;
      }

      .heading {
        color: var(--secondary-text-color);
        font-size: 0.82rem;
      }

      .device-row {
        display: flex;
        align-items: center;
        gap: 2px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 2px 4px 2px 12px;
        min-height: 40px;
      }

      .device-name {
        flex: 1 1 auto;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .picker {
        flex: 1 1 auto;
        min-width: 0;
      }

      .danger-icon {
        color: var(--error-color, #db4437);
      }

      .add-row {
        display: flex;
        align-items: center;
        gap: 8px;
        border-style: dashed;
        color: var(--secondary-text-color);
      }

      .detail-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }

      .detail-title {
        font-size: 1rem;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "alarm-clocks-card-editor": MacaAlarmCardEditor;
  }
}
