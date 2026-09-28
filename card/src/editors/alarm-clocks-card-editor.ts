import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";

import {
  ACCORDION_DEFAULT,
  DEVICE_DEFAULTS,
  cardExpandedApplies,
  cardOption,
  type DeviceOptionKey,
} from "../cards/alarm-clocks-card";
import { ALARM_CARD_EDITOR_TAG } from "../const";
import { fireEvent } from "../lib/actions";
import { findMacaDevices, normalizeDeviceConfig } from "../lib/discovery";
import { createLocalizer, languageOf, type Localizer } from "../lib/localize";
import { controlStyles } from "../styles";
import type { HomeAssistant, MacaAlarmCardConfig, MacaAlarmDeviceConfig } from "../types";

interface FormSchemaItem {
  name: string;
  type?: string;
  selector?: unknown;
  disabled?: boolean;
  schema?: FormSchemaItem[];
}

interface PickerOption {
  value: string;
  label: string;
}

const DEVICE_OPTION_KEYS = Object.keys(DEVICE_DEFAULTS) as DeviceOptionKey[];

/** The card's own heading, the one field that is not a default for the alarms. */
const TITLE_SCHEMA: FormSchemaItem[] = [{ name: "title", selector: { text: {} } }];

/** The card-wide defaults, the fallback for any alarm that does not set its own.
 *  `expanded` is greyed out wherever the card would set it aside anyway. */
function defaultsSchema(config: MacaAlarmCardConfig): FormSchemaItem[] {
  return [
    {
      name: "minute_step",
      selector: { number: { min: 1, max: 30, step: 1, mode: "box", unit_of_measurement: "min" } },
    },
    {
      name: "",
      type: "grid",
      schema: [
        { name: "expandable", selector: { boolean: {} } },
        { name: "accordion", selector: { boolean: {} } },
        { name: "expanded", selector: { boolean: {} }, disabled: !cardExpandedApplies(config) },
        { name: "hide_disabled", selector: { boolean: {} } },
        { name: "show_days", selector: { boolean: {} } },
        { name: "show_next_alarm", selector: { boolean: {} } },
        { name: "show_settings", selector: { boolean: {} } },
        { name: "show_test_button", selector: { boolean: {} } },
      ],
    },
  ];
}

/**
 * A plain dropdown rather than HA's device selector: that one can filter by
 * integration but has no way to leave out single devices, so an alarm already
 * in the list would be offered again. The options come from the same
 * discovery the card uses, so it also offers nothing the card could not show.
 */
function pickerSchema(options: PickerOption[]): FormSchemaItem[] {
  return [{ name: "device_id", selector: { select: { mode: "dropdown", options } } }];
}

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

/** The one key in `next` whose value differs from `previous`; forms change one field at a time. */
function firstChangedKey(
  previous: Record<string, unknown>,
  next: Record<string, unknown>,
): string | undefined {
  return Object.keys(next).find((key) => next[key] !== previous[key]);
}

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

    const resolved = this._resolvedCardData();
    const addOptions = this._pickerOptions();

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${resolved}
        .schema=${TITLE_SCHEMA}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>

      <div class="section defaults">
        <span class="heading">${localize("editor.defaults_heading")}</span>
        <span class="hint">${localize("editor.defaults_hint")}</span>
        <ha-form
          .hass=${this.hass}
          .data=${resolved}
          .schema=${defaultsSchema(this._config)}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._valueChanged}
        ></ha-form>
      </div>

      <div class="section devices">
        <span class="heading">${localize("editor.devices")}</span>
        ${devices.map((entry, index) => this._renderDeviceRow(entry, index, localize))}
        ${addOptions.length
          ? html`
              <div class="device-row add-row">
                <ha-form
                  class="picker"
                  .hass=${this.hass}
                  .data=${{ device_id: undefined }}
                  .schema=${pickerSchema(addOptions)}
                  .computeLabel=${this._computeLabel}
                  @value-changed=${this._onAddDeviceChanged}
                ></ha-form>
                <ha-icon icon="mdi:plus" aria-label=${localize("editor.add_device")}></ha-icon>
              </div>
            `
          : html`<span class="hint">${localize("editor.all_devices_added")}</span>`}
      </div>
    `;
  }

  /** The card's own option fields with `DEVICE_DEFAULTS` filled in, so an unset field still
   *  shows what it actually resolves to instead of looking switched off. */
  private _resolvedCardData(): MacaAlarmCardConfig {
    const config = this._config!;
    const resolved: Record<string, unknown> = { ...config };
    for (const key of DEVICE_OPTION_KEYS) {
      resolved[key] = config[key] ?? DEVICE_DEFAULTS[key];
    }
    resolved.accordion = config.accordion ?? ACCORDION_DEFAULT;
    return resolved as MacaAlarmCardConfig;
  }

  /** Same idea, per alarm: the entry's own value, then the card's, then `DEVICE_DEFAULTS`. */
  private _resolvedDeviceData(entry: MacaAlarmDeviceConfig): MacaAlarmDeviceConfig {
    const config = this._config;
    const resolved: Record<string, unknown> = { ...entry };
    for (const key of DEVICE_OPTION_KEYS) {
      resolved[key] = entry[key] ?? cardOption(config, key) ?? DEVICE_DEFAULTS[key];
    }
    return resolved as unknown as MacaAlarmDeviceConfig;
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

  /** The detail page for one alarm: a back arrow, the device picker, every option,
   *  and which of them this alarm sets itself rather than taking from the card. */
  private _renderDetail(
    entry: MacaAlarmDeviceConfig,
    index: number,
    localize: Localizer,
  ): TemplateResult {
    const resolved = this._resolvedDeviceData(entry);
    const onChanged = (event: CustomEvent<{ value: MacaAlarmDeviceConfig }>): void =>
      this._onDeviceChanged(index, resolved, event);
    const overridden = DEVICE_OPTION_KEYS.filter((key) => entry[key] !== undefined);

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
        .data=${resolved}
        .schema=${pickerSchema(this._pickerOptions(index))}
        .computeLabel=${this._computeLabel}
        @value-changed=${onChanged}
      ></ha-form>
      <ha-form
        .hass=${this.hass}
        .data=${resolved}
        .schema=${DEVICE_SCHEMA}
        .computeLabel=${this._computeDeviceLabel}
        @value-changed=${onChanged}
      ></ha-form>

      <div class="section overrides">
        <span class="heading">${localize("editor.overrides_heading")}</span>
        ${overridden.length
          ? html`
              <span class="hint">${localize("editor.overrides_hint")}</span>
              <div class="chips">
                ${overridden.map((key) => {
                  const label = this._computeDeviceLabel({ name: key });
                  const action = localize("editor.reset_override", { label });
                  return html`
                    <button
                      type="button"
                      class="chip"
                      aria-label=${action}
                      title=${action}
                      @click=${() => this._resetOverride(index, key)}
                    >
                      <span>${label}</span>
                      <ha-icon icon="mdi:close"></ha-icon>
                    </button>
                  `;
                })}
              </div>
            `
          : html`<span class="hint">${localize("editor.overrides_none")}</span>`}
      </div>
    `;
  }

  /** Device ids already picked elsewhere in this card; `excludeIndex` exempts an entry's own slot. */
  private _usedDeviceIds(excludeIndex?: number): string[] {
    return (this._config?.devices ?? [])
      .map(normalizeDeviceConfig)
      .filter((_entry, index) => index !== excludeIndex)
      .map((entry) => entry.device_id);
  }

  /**
   * Every alarm clock not yet in the card, sorted by name. With `excludeIndex`
   * (a detail page), that entry's own device stays in, even when discovery no
   * longer finds it, so the field never shows an empty value for a set one.
   */
  private _pickerOptions(excludeIndex?: number): PickerOption[] {
    const used = new Set(this._usedDeviceIds(excludeIndex));
    const ids = findMacaDevices(this.hass!).filter((id) => !used.has(id));
    const own = excludeIndex !== undefined ? this._config?.devices?.[excludeIndex] : undefined;
    const ownId = own !== undefined ? normalizeDeviceConfig(own).device_id : undefined;
    if (ownId && !ids.includes(ownId)) {
      ids.push(ownId);
    }
    return ids
      .map((id) => ({ value: id, label: this._deviceLabel({ device_id: id }) }))
      .sort((a, b) => a.label.localeCompare(b.label, languageOf(this.hass)));
  }

  private _deviceLabel(entry: MacaAlarmDeviceConfig): string {
    if (entry.name) {
      return entry.name;
    }
    const device = this.hass?.devices?.[entry.device_id];
    return device?.name_by_user || device?.name || entry.device_id;
  }

  private _computeLabel = (schema: Pick<FormSchemaItem, "name">): string => {
    const localize = createLocalizer(this.hass);
    if (schema.name === "device_id") {
      return localize("editor.pick_device");
    }
    return localize(`editor.${schema.name}`);
  };

  /** Same as `_computeLabel`, but "expanded" reads as this one alarm's own state. */
  private _computeDeviceLabel = (schema: Pick<FormSchemaItem, "name">): string => {
    if (schema.name === "expanded") {
      return createLocalizer(this.hass)("editor.device_expanded");
    }
    return this._computeLabel(schema);
  };

  /**
   * `.data` shows resolved values so an untouched field never looks switched
   * off when it is not; only the one field the form actually changed is
   * written back, so every other field keeps falling back to the card's
   * default (or `DEVICE_DEFAULTS`) instead of freezing at today's value.
   */
  private _valueChanged = (event: CustomEvent<{ value: MacaAlarmCardConfig }>): void => {
    event.stopPropagation();
    if (!this._config) {
      return;
    }
    const key = firstChangedKey(this._resolvedCardData(), event.detail.value);
    if (!key) {
      return;
    }
    fireEvent(this, "config-changed", {
      config: { ...this._config, [key]: (event.detail.value as Record<string, unknown>)[key] },
    });
  };

  private _editDevice = (index: number): void => {
    this._editingIndex = index;
  };

  private _closeDetail = (): void => {
    this._editingIndex = undefined;
  };

  /** Same one-field-at-a-time write as `_valueChanged`, scoped to this one alarm. */
  private _onDeviceChanged(
    index: number,
    resolved: MacaAlarmDeviceConfig,
    event: CustomEvent<{ value: MacaAlarmDeviceConfig }>,
  ): void {
    event.stopPropagation();
    const key = firstChangedKey(
      resolved as unknown as Record<string, unknown>,
      event.detail.value as unknown as Record<string, unknown>,
    );
    if (!key) {
      return;
    }
    const devices = (this._config?.devices ?? []).map(normalizeDeviceConfig);
    devices[index] = {
      ...devices[index],
      [key]: (event.detail.value as unknown as Record<string, unknown>)[key],
    };
    this._updateDevices(devices);
  }

  /** Drop this alarm's own value for `key`, so it follows the card again. */
  private _resetOverride(index: number, key: DeviceOptionKey): void {
    const devices = (this._config?.devices ?? []).map(normalizeDeviceConfig);
    const { [key]: _dropped, ...rest } = devices[index];
    devices[index] = rest as MacaAlarmDeviceConfig;
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

      .section {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-top: 16px;
      }

      .heading {
        color: var(--primary-text-color);
        font-size: 0.95rem;
        font-weight: 500;
      }

      .hint {
        color: var(--secondary-text-color);
        font-size: 0.82rem;
        line-height: 1.35;
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

      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .chip {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        border: 1px solid var(--divider-color);
        border-radius: 16px;
        padding: 4px 6px 4px 12px;
        background: none;
        color: var(--primary-text-color);
        font: inherit;
        font-size: 0.85rem;
        cursor: pointer;
      }

      .chip ha-icon {
        --mdc-icon-size: 16px;
        color: var(--secondary-text-color);
      }

      .chip:hover,
      .chip:focus-visible {
        border-color: var(--primary-color);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "alarm-clocks-card-editor": MacaAlarmCardEditor;
  }
}
