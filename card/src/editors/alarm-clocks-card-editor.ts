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

const CARD_SCHEMA: FormSchemaItem[] = [
  { name: "title", selector: { text: {} } },
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

/** A single-field form: just the device picker, reused for every row and the "add" slot. */
const PICKER_SCHEMA: FormSchemaItem[] = [
  { name: "device_id", selector: { device: { filter: { integration: ALARM_CLOCKS_DOMAIN } } } },
];

/** Shown once a row is expanded: every per-device override. */
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
      { name: "expanded", selector: { boolean: {} } },
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

  /** Which device row (by index) has its override form open; only one at a time. */
  @state() private _openIndex?: number;

  public setConfig(config: MacaAlarmCardConfig): void {
    this._config = config;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) {
      return nothing;
    }
    const localize = createLocalizer(this.hass);
    const devices = (this._config.devices ?? []).map(normalizeDeviceConfig);

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
          <ha-icon icon="mdi:plus"></ha-icon>
        </div>
      </div>
    `;
  }

  private _renderDeviceRow(
    entry: MacaAlarmDeviceConfig,
    index: number,
    localize: Localizer,
  ): TemplateResult {
    const open = this._openIndex === index;
    const onChanged = (event: CustomEvent<{ value: MacaAlarmDeviceConfig }>): void =>
      this._onDeviceChanged(index, event);

    return html`
      <div class="device-row">
        <div class="device-row-header">
          <ha-form
            class="picker"
            .hass=${this.hass}
            .data=${entry}
            .schema=${PICKER_SCHEMA}
            .computeLabel=${this._computeLabel}
            @value-changed=${onChanged}
          ></ha-form>
          <button
            type="button"
            class="icon-btn"
            aria-expanded=${open ? "true" : "false"}
            aria-label=${localize(open ? "action.collapse" : "action.expand")}
            @click=${() => this._toggleRow(index)}
          >
            <ha-icon icon=${open ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
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
        ${open
          ? html`<ha-form
              .hass=${this.hass}
              .data=${entry}
              .schema=${DEVICE_SCHEMA}
              .computeLabel=${this._computeDeviceLabel}
              @value-changed=${onChanged}
            ></ha-form>`
          : nothing}
      </div>
    `;
  }

  private _computeLabel = (schema: FormSchemaItem): string => {
    const localize = createLocalizer(this.hass);
    if (schema.name === "device_id") {
      return localize("editor.pick_device");
    }
    return localize(`editor.${schema.name}`);
  };

  /** Same as `_computeLabel`, but "expanded" reads as a single alarm's own state, not "every row". */
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

  private _toggleRow = (index: number): void => {
    this._openIndex = this._openIndex === index ? undefined : index;
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
    this._openIndex = undefined;
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
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 2px 4px 2px 12px;
      }

      .device-row-header {
        display: flex;
        align-items: center;
        gap: 2px;
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
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "alarm-clocks-card-editor": MacaAlarmCardEditor;
  }
}
