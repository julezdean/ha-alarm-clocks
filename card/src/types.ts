/**
 * Minimal, hand-written typings for the parts of the Home Assistant frontend
 * this project touches. Keeping them local avoids a dependency on
 * `custom-card-helpers`, which lags behind the frontend.
 */

export interface HassEntityAttributes {
  friendly_name?: string;
  device_class?: string;
  icon?: string;
  unit_of_measurement?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  [key: string]: unknown;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  last_changed: string;
  last_updated: string;
  attributes: HassEntityAttributes;
}

/** Entry shape of `hass.entities` (entity registry, display variant). */
export interface EntityRegistryDisplayEntry {
  entity_id: string;
  name?: string;
  device_id?: string;
  area_id?: string;
  entity_category?: "config" | "diagnostic";
  translation_key?: string;
  platform?: string;
  has_entity_name?: boolean;
}

/** Entry shape of `hass.devices`. */
export interface DeviceRegistryDisplayEntry {
  id: string;
  name?: string | null;
  name_by_user?: string | null;
  area_id?: string | null;
}

export interface HassServiceTarget {
  entity_id?: string | string[];
  device_id?: string | string[];
  area_id?: string | string[];
}

export interface FrontendLocaleData {
  language: string;
  [key: string]: unknown;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities: Record<string, EntityRegistryDisplayEntry>;
  devices: Record<string, DeviceRegistryDisplayEntry>;
  locale: FrontendLocaleData;
  language?: string;
  themes?: unknown;
  callService(
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: HassServiceTarget,
  ): Promise<unknown>;
}

export interface LovelaceCardConfig {
  type: string;
  [key: string]: unknown;
}

export interface LovelaceCard extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: LovelaceCardConfig): void;
  getCardSize?(): number;
}

export interface LovelaceCardEditor extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: LovelaceCardConfig): void;
}

/** Grid options for the Sections view (HA 2024.11+). */
export interface LovelaceGridOptions {
  columns?: number;
  rows?: number | "auto";
  min_columns?: number;
  min_rows?: number;
  max_columns?: number;
}

/**
 * Every display option, shared by the card (as the default for any alarm
 * that does not set its own) and by a `MacaAlarmDeviceConfig` entry (as an
 * override for just that one alarm). Unset anywhere falls back to
 * `DEVICE_DEFAULTS` (see `cards/alarm-clocks-card.ts`).
 */
export interface MacaAlarmDisplayOptions {
  hide_disabled?: boolean;
  show_days?: boolean;
  show_next_alarm?: boolean;
  show_settings?: boolean;
  show_test_button?: boolean;
  minute_step?: number;
  /** Whether a row can be expanded and collapsed by clicking it. Default `true`. */
  expandable?: boolean;
  /**
   * With `expandable: false`, the fixed state of a row. With
   * `expandable: true`, whether it starts open: every such row without
   * `accordion`, only the first one (in `devices` order, or sorted by name
   * when `devices` is empty) with it.
   */
  expanded?: boolean;
}

/** A plain device id with no overrides at all is also valid in `devices`. */
export interface MacaAlarmDeviceConfig extends MacaAlarmDisplayOptions {
  device_id: string;
  name?: string;
}

export interface MacaAlarmCardConfig extends LovelaceCardConfig, MacaAlarmDisplayOptions {
  title?: string;
  /**
   * Card-wide only, since it is about how rows relate to each other. `true`
   * (default): opening a row closes the others. `false`: every row toggles on
   * its own. See `cardExpandedApplies` for what it does to a card-wide `expanded`.
   */
  accordion?: boolean;
  /**
   * Omitted or empty: every alarm clock found in the registry, sorted by
   * name. A list of entries (plain device ids or `MacaAlarmDeviceConfig`
   * objects): exactly those alarms, in that order. Either way, an alarm that
   * does not set one of the options above uses the card's own, and an alarm
   * whose card also does not set it uses `DEVICE_DEFAULTS`.
   */
  devices?: (string | MacaAlarmDeviceConfig)[];
}

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description?: string;
      preview?: boolean;
      documentationURL?: string;
    }>;
  }
}
