import { LitElement, css, html, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { createLocalizer } from "../lib/localize";
import type { SettingView } from "../lib/model";
import type { HomeAssistant } from "../types";
import { controlStyles, themeTokens } from "../styles";

@customElement("alarm-clocks-setting-row")
export class MacaSettingRow extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @property({ attribute: false }) public setting!: SettingView;

  protected override render(): TemplateResult {
    const localize = createLocalizer(this.hass);
    const label = localize(this.setting.labelKey);
    const isOff = this.setting.zeroMeansOff && this.setting.value === 0;
    const display = isOff
      ? localize("label.off")
      : `${this.setting.value} ${localize("unit.minutes_short")}`;

    return html`
      <div class="row">
        <span class="label">${label}</span>
        <div class="control">
          <button
            type="button"
            class="icon-btn"
            aria-label=${localize("action.decrease", { label })}
            ?disabled=${this.setting.value <= this.setting.min}
            @click=${() => this._step(-1)}
          >
            <ha-icon icon="mdi:minus"></ha-icon>
          </button>
          <button
            type="button"
            class="value"
            aria-label=${`${label}: ${display}`}
            @click=${this._openMoreInfo}
          >
            ${display}
          </button>
          <button
            type="button"
            class="icon-btn"
            aria-label=${localize("action.increase", { label })}
            ?disabled=${this.setting.value >= this.setting.max}
            @click=${() => this._step(1)}
          >
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
        </div>
      </div>
    `;
  }

  private _step(direction: number): void {
    const next = Math.min(
      this.setting.max,
      Math.max(this.setting.min, this.setting.value + direction * this.setting.step),
    );
    if (next === this.setting.value) {
      return;
    }
    this.dispatchEvent(
      new CustomEvent("setting-changed", {
        detail: { entityId: this.setting.entityId, value: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _openMoreInfo = (): void => {
    this.dispatchEvent(
      new CustomEvent("setting-more-info", {
        detail: { entityId: this.setting.entityId },
        bubbles: true,
        composed: true,
      }),
    );
  };

  public static override styles = [
    themeTokens,
    controlStyles,
    css`
      .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        min-height: 44px;
      }

      .label {
        color: var(--secondary-text-color);
        font-size: 0.9rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .control {
        display: flex;
        align-items: center;
        flex: 0 0 auto;
        gap: 2px;
      }

      .value {
        min-width: 64px;
        padding: 6px 8px;
        border: none;
        border-radius: 8px;
        background: transparent;
        color: var(--primary-text-color);
        font-family: inherit;
        font-size: 0.9rem;
        font-variant-numeric: tabular-nums;
        text-align: center;
        cursor: pointer;
      }

      .value:hover {
        background: var(--alarm-clocks-chip-background);
      }

      .value:focus-visible {
        outline: 2px solid var(--alarm-clocks-accent);
        outline-offset: 2px;
      }

      ha-icon {
        --mdc-icon-size: 20px;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "alarm-clocks-setting-row": MacaSettingRow;
  }
}
