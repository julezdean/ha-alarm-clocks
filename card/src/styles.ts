import { css } from "lit";

/**
 * All colours come from Home Assistant theme variables so the cards follow
 * light mode, dark mode and custom themes without any hard coded values.
 */
export const themeTokens = css`
  :host {
    --alarm-clocks-accent: var(--state-switch-active-color, var(--primary-color));
    --alarm-clocks-disabled: var(--state-inactive-color, var(--disabled-text-color));
    --alarm-clocks-ringing: var(--error-color, #db4437);
    --alarm-clocks-snoozed: var(--warning-color, #ffa600);
    --alarm-clocks-armed: var(--success-color, var(--primary-color));
    --alarm-clocks-surface: var(--ha-card-background, var(--card-background-color));
    --alarm-clocks-chip-background: var(--secondary-background-color);
    --alarm-clocks-radius: var(--ha-card-border-radius, 12px);
    --alarm-clocks-tap-target: 40px;
  }
`;

export const controlStyles = css`
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: var(--alarm-clocks-tap-target);
    padding: 0 16px;
    border: none;
    border-radius: 999px;
    background: var(--alarm-clocks-chip-background);
    color: var(--primary-text-color);
    font-family: inherit;
    font-size: 0.95rem;
    font-weight: 500;
    line-height: 1;
    cursor: pointer;
    transition: background-color 180ms ease-out, opacity 180ms ease-out;
    -webkit-tap-highlight-color: transparent;
  }

  .btn:hover:not(:disabled) {
    background: var(--divider-color);
  }

  .btn:disabled {
    opacity: 0.45;
    cursor: default;
  }

  .btn.primary {
    background: var(--alarm-clocks-accent);
    color: var(--text-primary-color, #fff);
  }

  .btn.danger {
    background: var(--alarm-clocks-ringing);
    color: var(--text-primary-color, #fff);
  }

  .btn:focus-visible,
  .icon-btn:focus-visible {
    outline: 2px solid var(--alarm-clocks-accent);
    outline-offset: 2px;
  }

  .icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--alarm-clocks-tap-target);
    height: var(--alarm-clocks-tap-target);
    padding: 0;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: var(--secondary-text-color);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .icon-btn:hover:not(:disabled) {
    background: var(--alarm-clocks-chip-background);
  }

  .icon-btn:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;

export const errorStyles = css`
  .error {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    color: var(--primary-text-color);
    font-size: 0.95rem;
    line-height: 1.4;
  }

  .error ha-icon {
    flex: 0 0 auto;
    color: var(--warning-color, #ffa600);
  }
`;
