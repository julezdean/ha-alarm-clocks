import { LitElement, css, html, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { createLocalizer } from "../lib/localize";
import type { HomeAssistant } from "../types";
import { controlStyles, themeTokens } from "../styles";

/** Delay before a held button starts repeating, in milliseconds. */
const HOLD_DELAY = 450;
/** Repeat interval at the start of a hold, in milliseconds. */
const REPEAT_START = 180;
/** Fastest repeat interval a hold accelerates to, in milliseconds. */
const REPEAT_MIN = 60;
/** Vertical distance for one step when dragging, in pixels. */
const DRAG_STEP = 18;

type Segment = "hours" | "minutes";

/**
 * Time input that works without a keyboard.
 *
 * Hours and minutes are stepped with large tap targets above and below the
 * digits. Holding a button repeats and accelerates, dragging vertically over
 * the digits steps as well, and the mouse wheel is supported on the desktop.
 * Both segments are focusable spin buttons, so arrow keys work too.
 */
@customElement("alarm-clocks-time-stepper")
export class AlarmClocksTimeStepper extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @property({ type: Number }) public hours = 0;

  @property({ type: Number }) public minutes = 0;

  /** Step width for the minutes, in minutes. */
  @property({ type: Number }) public minuteStep = 5;

  @property({ type: Boolean }) public disabled = false;

  private _holdTimer?: number;

  private _repeatTimer?: number;

  private _repeatDelay = REPEAT_START;

  private _dragOrigin?: { y: number; hours: number; minutes: number };

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopHold();
  }

  protected override render(): TemplateResult {
    const localize = createLocalizer(this.hass);

    return html`
      <div class="stepper" ?data-disabled=${this.disabled}>
        ${this._renderSegment("hours", this.hours, 23, localize("label.hours"))}
        <span class="colon" aria-hidden="true">:</span>
        ${this._renderSegment("minutes", this.minutes, 59, localize("label.minutes"))}
      </div>
    `;
  }

  private _renderSegment(
    segment: Segment,
    value: number,
    max: number,
    label: string,
  ): TemplateResult {
    const localize = createLocalizer(this.hass);
    return html`
      <div class="segment">
        <button
          type="button"
          class="arrow"
          tabindex="-1"
          aria-label=${localize("action.increase", { label })}
          ?disabled=${this.disabled}
          @pointerdown=${(event: PointerEvent) => this._startHold(event, segment, 1)}
          @pointerup=${this._stopHold}
          @pointercancel=${this._stopHold}
          @pointerleave=${this._stopHold}
        >
          <ha-icon icon="mdi:chevron-up"></ha-icon>
        </button>

        <div
          class="value"
          role="spinbutton"
          tabindex=${this.disabled ? -1 : 0}
          aria-label=${label}
          aria-valuenow=${value}
          aria-valuemin="0"
          aria-valuemax=${max}
          aria-valuetext=${String(value).padStart(2, "0")}
          @keydown=${(event: KeyboardEvent) => this._onKeyDown(event, segment)}
          @wheel=${(event: WheelEvent) => this._onWheel(event, segment)}
          @pointerdown=${(event: PointerEvent) => this._startDrag(event, segment)}
          @pointermove=${(event: PointerEvent) => this._onDrag(event, segment)}
          @pointerup=${this._endDrag}
          @pointercancel=${this._endDrag}
        >
          ${String(value).padStart(2, "0")}
        </div>

        <button
          type="button"
          class="arrow"
          tabindex="-1"
          aria-label=${localize("action.decrease", { label })}
          ?disabled=${this.disabled}
          @pointerdown=${(event: PointerEvent) => this._startHold(event, segment, -1)}
          @pointerup=${this._stopHold}
          @pointercancel=${this._stopHold}
          @pointerleave=${this._stopHold}
        >
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </button>
      </div>
    `;
  }

  private _step(segment: Segment, direction: number): void {
    if (this.disabled) {
      return;
    }
    let { hours, minutes } = this;
    if (segment === "hours") {
      hours = (hours + direction + 24) % 24;
    } else {
      const step = Math.max(1, Math.round(this.minuteStep));
      // Snap to the grid first, so an odd starting value lands on it.
      const snapped = Math.round(minutes / step) * step;
      const next = snapped + direction * step;
      minutes = ((next % 60) + 60) % 60;
    }
    this.hours = hours;
    this.minutes = minutes;
    this.dispatchEvent(
      new CustomEvent("time-changed", {
        detail: { hours, minutes },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _startHold(event: PointerEvent, segment: Segment, direction: number): void {
    if (this.disabled) {
      return;
    }
    event.preventDefault();
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
    this._step(segment, direction);
    this._repeatDelay = REPEAT_START;
    this._holdTimer = window.setTimeout(() => {
      const repeat = (): void => {
        this._step(segment, direction);
        this._repeatDelay = Math.max(REPEAT_MIN, this._repeatDelay - 12);
        this._repeatTimer = window.setTimeout(repeat, this._repeatDelay);
      };
      repeat();
    }, HOLD_DELAY);
  }

  private _stopHold = (): void => {
    if (this._holdTimer !== undefined) {
      window.clearTimeout(this._holdTimer);
      this._holdTimer = undefined;
    }
    if (this._repeatTimer !== undefined) {
      window.clearTimeout(this._repeatTimer);
      this._repeatTimer = undefined;
    }
  };

  private _startDrag(event: PointerEvent, _segment: Segment): void {
    if (this.disabled) {
      return;
    }
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
    this._dragOrigin = { y: event.clientY, hours: this.hours, minutes: this.minutes };
  }

  private _onDrag(event: PointerEvent, segment: Segment): void {
    if (!this._dragOrigin) {
      return;
    }
    event.preventDefault();
    const steps = Math.trunc((this._dragOrigin.y - event.clientY) / DRAG_STEP);
    if (steps === 0) {
      return;
    }
    this._dragOrigin.y -= steps * DRAG_STEP;
    this._step(segment, steps > 0 ? 1 : -1);
    for (let i = 1; i < Math.abs(steps); i += 1) {
      this._step(segment, steps > 0 ? 1 : -1);
    }
  }

  private _endDrag = (): void => {
    this._dragOrigin = undefined;
  };

  private _onWheel(event: WheelEvent, segment: Segment): void {
    if (this.disabled || event.deltaY === 0) {
      return;
    }
    event.preventDefault();
    this._step(segment, event.deltaY < 0 ? 1 : -1);
  }

  private _onKeyDown(event: KeyboardEvent, segment: Segment): void {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      this._step(segment, 1);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      this._step(segment, -1);
    }
  }

  static override styles = [
    themeTokens,
    controlStyles,
    css`
      .stepper {
        display: flex;
        align-items: center;
        gap: 2px;
        touch-action: none;
        user-select: none;
      }

      .stepper[data-disabled] {
        opacity: 0.6;
      }

      .segment {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .arrow {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-width: 56px;
        height: 30px;
        padding: 0;
        border: none;
        border-radius: 8px;
        background: transparent;
        color: var(--secondary-text-color);
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
      }

      .arrow:hover:not(:disabled) {
        background: var(--alarm-clocks-chip-background);
      }

      .arrow:active:not(:disabled) {
        background: var(--divider-color);
      }

      .arrow:disabled {
        opacity: 0.4;
        cursor: default;
      }

      .arrow ha-icon {
        --mdc-icon-size: 22px;
      }

      .value {
        min-width: 56px;
        padding: 2px 4px;
        border-radius: 8px;
        color: var(--primary-text-color);
        font-size: 2.4rem;
        font-weight: 300;
        font-variant-numeric: tabular-nums;
        line-height: 1.1;
        letter-spacing: -0.02em;
        text-align: center;
        cursor: ns-resize;
      }

      .value:focus-visible {
        outline: 2px solid var(--alarm-clocks-accent);
        outline-offset: 2px;
      }

      .colon {
        align-self: center;
        margin-top: 2px;
        color: var(--primary-text-color);
        font-size: 2.4rem;
        font-weight: 300;
        line-height: 1.1;
      }

      @media (max-width: 340px) {
        .value,
        .colon {
          font-size: 2rem;
        }

        .arrow {
          min-width: 48px;
        }
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "alarm-clocks-time-stepper": AlarmClocksTimeStepper;
  }
}
