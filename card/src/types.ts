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
 * Per-alarm overrides. Every field falls back to the same-named card option
 * when unset, so a plain device id (no overrides at all) is also valid in
 * `devices`.
 */
export interface MacaAlarmDeviceConfig {
  device_id: string;
  name?: string;
  show_days?: boolean;
  show_next_alarm?: boolean;
  show_settings?: boolean;
  show_test_button?: boolean;
  minute_step?: number;
  expanded?: boolean;
}

export interface MacaAlarmCardConfig extends LovelaceCardConfig {
  title?: string;
  /**
   * Omitted or empty: every alarm clock found in the registry, sorted by
   * name, all sharing the card's own options below. A list of entries (plain
   * device ids or `MacaAlarmDeviceConfig` objects): exactly those alarms, in
   * that order, each able to override the card's options for itself.
   */
  devices?: (string | MacaAlarmDeviceConfig)[];
  hide_disabled?: boolean;
  show_days?: boolean;
  show_next_alarm?: boolean;
  show_settings?: boolean;
  show_test_button?: boolean;
  minute_step?: number;
  /** Whether a row can be expanded and collapsed by clicking it. Default `true`. */
  expandable?: boolean;
  /**
   * Default for any alarm that does not set its own `expanded`. With
   * `expandable: false`, that is the fixed state of the row. With
   * `expandable: true`, the first alarm (in `devices` order, or sorted by
   * name when `devices` is empty) that resolves to `true` seeds the
   * accordion; only one row is expanded at a time after that.
   */
  expanded?: boolean;
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
