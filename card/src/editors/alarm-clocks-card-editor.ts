import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";

import { ALARM_CARD_EDITOR_TAG, ALARM_CLOCKS_DOMAIN } from "../const";
import { fireEvent } from "../lib/actions";
import { createLocalizer } from "../lib/localize";
import type { HomeAssistant, MacaAlarmCardConfig } from "../types";

interface FormSchemaItem {
  name: string;
  type?: string;
  selector?: unknown;
  schema?: FormSchemaItem[];
}

const SCHEMA: FormSchemaItem[] = [
  { name: "device_id", selector: { device: { filter: { integration: ALARM_CLOCKS_DOMAIN } } } },
  { name: "name", selector: { text: {} } },
  {
    name: "minute_step",
    selector: { number: { min: 1, max: 30, step: 1, mode: "box", unit_of_measurement: "min" } },
  },
  {
    name: "",
    type: "grid",
    schema: [
      { name: "show_days", selector: { boolean: {} } },
      { name: "show_next_alarm", selector: { boolean: {} } },
      { name: "show_settings", selector: { boolean: {} } },
      { name: "settings_expanded", selector: { boolean: {} } },
      { name: "show_test_button", selector: { boolean: {} } },
    ],
  },
];

@customElement(ALARM_CARD_EDITOR_TAG)
export class MacaAlarmCardEditor extends LitElement {
  @state() public hass?: HomeAssistant;

  @state() private _config?: MacaAlarmCardConfig;

  public setConfig(config: MacaAlarmCardConfig): void {
    this._config = config;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) {
      return nothing;
    }
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${SCHEMA}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _computeLabel = (schema: FormSchemaItem): string => {
    const localize = createLocalizer(this.hass);
    return localize(`editor.${schema.name}`);
  };

  private _valueChanged = (event: CustomEvent<{ value: MacaAlarmCardConfig }>): void => {
    event.stopPropagation();
    fireEvent(this, "config-changed", { config: event.detail.value });
  };

  public static override styles = css`
    ha-form {
      display: block;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "alarm-clocks-card-editor": MacaAlarmCardEditor;
  }
}
