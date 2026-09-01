import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";

import { LIST_CARD_EDITOR_TAG, ALARM_CLOCKS_DOMAIN } from "../const";
import { fireEvent } from "../lib/actions";
import { createLocalizer } from "../lib/localize";
import type { HomeAssistant, MacaAlarmListCardConfig } from "../types";

interface FormSchemaItem {
  name: string;
  type?: string;
  selector?: unknown;
  schema?: FormSchemaItem[];
}

const SCHEMA: FormSchemaItem[] = [
  { name: "title", selector: { text: {} } },
  {
    name: "devices",
    selector: { device: { filter: { integration: ALARM_CLOCKS_DOMAIN }, multiple: true } },
  },
  {
    name: "",
    type: "grid",
    schema: [
      { name: "show_next_alarm", selector: { boolean: {} } },
      { name: "hide_disabled", selector: { boolean: {} } },
    ],
  },
];

@customElement(LIST_CARD_EDITOR_TAG)
export class MacaAlarmListCardEditor extends LitElement {
  @state() public hass?: HomeAssistant;

  @state() private _config?: MacaAlarmListCardConfig;

  public setConfig(config: MacaAlarmListCardConfig): void {
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

  private _valueChanged = (event: CustomEvent<{ value: MacaAlarmListCardConfig }>): void => {
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
    "alarm-clocks-list-card-editor": MacaAlarmListCardEditor;
  }
}
