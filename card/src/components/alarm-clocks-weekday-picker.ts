import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import type { DayView } from "../lib/model";
import { createLocalizer, languageOf } from "../lib/localize";
import { weekdayLabels } from "../lib/time";
import type { HomeAssistant } from "../types";
import { themeTokens } from "../styles";

@customElement("alarm-clocks-weekday-picker")
export class MacaWeekdayPicker extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @property({ attribute: false }) public days: DayView[] = [];

  @property({ type: Boolean }) public compact = false;

  protected override render(): TemplateResult | typeof nothing {
    if (!this.days.length) {
      return nothing;
    }
    const language = languageOf(this.hass);
    const localize = createLocalizer(this.hass);
    const short = weekdayLabels(language, "short");
    const long = weekdayLabels(language, "long");
    const narrow = weekdayLabels(language, "narrow");

    return html`
      <div class="days" role="group">
        ${this.days.map((day) => {
          const label = this.compact ? narrow[day.index] : short[day.index];
          return html`
            <button
              type="button"
              role="switch"
              class=${classMap({ day: true, active: day.active })}
              aria-checked=${day.active ? "true" : "false"}
              aria-label=${localize("action.toggle_day", { day: long[day.index] })}
              title=${long[day.index]}
              ?disabled=${!day.available}
              @click=${() => this._toggle(day)}
            >
              <span aria-hidden="true">${label}</span>
            </button>
          `;
        })}
      </div>
    `;
  }

  private _toggle(day: DayView): void {
    if (!day.entityId) {
      return;
    }
    this.dispatchEvent(
      new CustomEvent("day-toggled", {
        detail: { entityId: day.entityId },
        bubbles: true,
        composed: true,
      }),
    );
  }

  public static override styles = [
    themeTokens,
    css`
      .days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 6px;
      }

      .day {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 0;
        min-height: var(--alarm-clocks-tap-target);
        padding: 0 2px;
        border: none;
        border-radius: 10px;
        background: var(--alarm-clocks-chip-background);
        color: var(--secondary-text-color);
        font-family: inherit;
        font-size: 0.85rem;
        font-weight: 500;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        transition: background-color 160ms ease-out, color 160ms ease-out;
        -webkit-tap-highlight-color: transparent;
      }

      .day.active {
        background: var(--alarm-clocks-accent);
        color: var(--text-primary-color, #fff);
        /* Not colour alone: active days are also bold and outlined. */
        font-weight: 700;
        box-shadow: inset 0 0 0 2px var(--alarm-clocks-accent);
      }

      .day:disabled {
        opacity: 0.4;
        cursor: default;
      }

      .day:focus-visible {
        outline: 2px solid var(--alarm-clocks-accent);
        outline-offset: 2px;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "alarm-clocks-weekday-picker": MacaWeekdayPicker;
  }
}
