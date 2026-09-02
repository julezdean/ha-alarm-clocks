/**
 * Smoke test for the built bundle.
 *
 *   npm run build && npm test
 *
 * Renders both cards against a fake `hass` object that mirrors the entities the
 * Alarm Clocks integration creates, and asserts on the visible text plus the service
 * calls that user interaction produces.
 */
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  pretendToBeVisual: true,
  url: "http://localhost/",
});

for (const key of [
  "window",
  "document",
  "HTMLElement",
  "customElements",
  "CustomEvent",
  "Event",
  "Node",
  "requestAnimationFrame",
  "cancelAnimationFrame",
  "getComputedStyle",
  "CSSStyleSheet",
]) {
  globalThis[key] = key === "window" ? dom.window : dom.window[key];
}

await import("../dist/alarm-clocks-card.js");

const DEVICE = "device-1";
const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

function makeHass(overrides = {}) {
  const entities = {};
  const states = {};
  const calls = [];

  const add = (entityId, translationKey, state, attributes = {}) => {
    entities[entityId] = {
      entity_id: entityId,
      device_id: DEVICE,
      platform: "alarm_clocks",
      translation_key: translationKey,
    };
    states[entityId] = {
      entity_id: entityId,
      state,
      last_changed: new Date(Date.now() - 120_000).toISOString(),
      last_updated: new Date().toISOString(),
      attributes,
    };
  };

  add("switch.wecker_1_aktiviert", "enabled", "on");
  WEEKDAYS.forEach((day, index) => {
    add(`switch.wecker_1_${day}`, `day_${day}`, index < 5 ? "on" : "off");
  });
  add("time.wecker_1_weckzeit", "alarm_time", "06:30:00");
  add("number.wecker_1_snooze_dauer", "snooze_duration", "9", { min: 1, max: 30, step: 1 });
  add("number.wecker_1_pre", "pre_offset", "0", { min: 0, max: 60, step: 1 });
  add("number.wecker_1_post", "post_offset", "0", { min: 0, max: 60, step: 1 });
  add("number.wecker_1_auto", "auto_dismiss", "10", { min: 0, max: 120, step: 1 });
  add("binary_sensor.wecker_1_klingelt", "ringing", "off");
  add("binary_sensor.wecker_1_snooze_aktiv", "snooze_active", "off");
  add("sensor.wecker_1_nachster_alarm", "next_alarm", new Date(Date.now() + 7_200_000).toISOString());
  add("sensor.wecker_1_status", "state", "armed");
  add("sensor.wecker_1_snooze_bis", "snooze_until", "unknown");
  add("button.wecker_1_snooze", "snooze", "unknown");
  add("button.wecker_1_dismiss", "dismiss", "unknown");

  for (const [entityId, patch] of Object.entries(overrides.states ?? {})) {
    states[entityId] = { ...states[entityId], ...patch };
  }

  return {
    calls,
    hass: {
      states,
      entities: overrides.entities ?? entities,
      devices: { [DEVICE]: { id: DEVICE, name: "Wecker 1", name_by_user: null } },
      locale: { language: overrides.language ?? "de" },
      callService: (...args) => {
        calls.push(args);
        return Promise.resolve();
      },
    },
  };
}

async function mount(tag, config, hass) {
  const card = document.createElement(tag);
  card.setConfig(config);
  card.hass = hass;
  document.body.appendChild(card);
  await card.updateComplete;
  return card;
}

/** The time shown by the stepper component, as "HH:MM". */
function steppedTime(card) {
  const stepper = card.shadowRoot.querySelector("alarm-clocks-time-stepper");
  if (!stepper) return "";
  return `${String(stepper.hours).padStart(2, "0")}:${String(stepper.minutes).padStart(2, "0")}`;
}

/** Visible text only, without the injected <style> blocks. */
function visibleText(card) {
  const root = card.shadowRoot.querySelector("ha-card");
  return (root?.textContent ?? "").replace(/\s+/g, " ").trim();
}

const results = [];
function check(name, fn) {
  fn();
  results.push(name);
}

// --- armed ------------------------------------------------------------------
{
  const { hass } = makeHass();
  const card = await mount("alarm-clocks-card", { type: "custom:alarm-clocks-card", device_id: DEVICE }, hass);
  const text = visibleText(card);
  check("armed: shows name, status and alarm time", () => {
    assert.match(text, /Wecker 1/);
    assert.match(text, /Bereit/);
    assert.equal(steppedTime(card), "06:30");
    assert.match(text, /in 2 Std\./);
  });
  check("armed: no snooze or dismiss button", () => {
    assert.doesNotMatch(text, /Schlummern/);
    assert.doesNotMatch(text, /Ausschalten/);
  });
  check("armed: weekday picker exposes seven switches", () => {
    const picker = card.shadowRoot.querySelector("alarm-clocks-weekday-picker");
    const days = picker.shadowRoot.querySelectorAll('button[role="switch"]');
    assert.equal(days.length, 7);
    assert.equal(days[0].getAttribute("aria-checked"), "true");
    assert.equal(days[6].getAttribute("aria-checked"), "false");
  });
  card.remove();
}

// --- ringing ----------------------------------------------------------------
{
  const { hass, calls } = makeHass({
    states: {
      "sensor.wecker_1_status": { state: "ringing" },
      "binary_sensor.wecker_1_klingelt": { state: "on" },
    },
  });
  const card = await mount("alarm-clocks-card", { type: "custom:alarm-clocks-card", device_id: DEVICE }, hass);
  const text = visibleText(card);
  check("ringing: offers snooze and dismiss", () => {
    assert.match(text, /Klingelt/);
    assert.match(text, /Schlummern/);
    assert.match(text, /Ausschalten/);
  });
  check("ringing: snooze calls alarm_clocks.snooze on the device", () => {
    const buttons = [...card.shadowRoot.querySelectorAll(".actions .btn")];
    buttons[0].click();
    assert.deepEqual(calls.at(-1), ["alarm_clocks", "snooze", {}, { device_id: DEVICE }]);
    buttons[1].click();
    assert.deepEqual(calls.at(-1), ["alarm_clocks", "dismiss", {}, { device_id: DEVICE }]);
  });
  card.remove();
}

// --- disabled, next_alarm unavailable ---------------------------------------
{
  const { hass } = makeHass({
    states: {
      "sensor.wecker_1_status": { state: "disabled" },
      "switch.wecker_1_aktiviert": { state: "off" },
      "sensor.wecker_1_nachster_alarm": { state: "unavailable" },
    },
  });
  const card = await mount("alarm-clocks-card", { type: "custom:alarm-clocks-card", device_id: DEVICE }, hass);
  check("disabled: unavailable next_alarm renders as 'Kein Alarm'", () => {
    const text = visibleText(card);
    assert.match(text, /Deaktiviert/);
    assert.match(text, /Kein Alarm/);
  });
  card.remove();
}

// --- one-shot ---------------------------------------------------------------
{
  const overrides = { states: {} };
  for (const day of WEEKDAYS) {
    overrides.states[`switch.wecker_1_${day}`] = { state: "off" };
  }
  const { hass } = makeHass(overrides);
  const card = await mount("alarm-clocks-card", { type: "custom:alarm-clocks-card", device_id: DEVICE }, hass);
  check("one-shot: shows the badge when no weekday is active", () => {
    assert.match(visibleText(card), /Einmalig/);
  });
  card.remove();
}

// --- error states -----------------------------------------------------------
{
  const { hass } = makeHass();
  const card = await mount("alarm-clocks-card", { type: "custom:alarm-clocks-card", device_id: "nope" }, hass);
  check("unknown device: friendly error instead of a crash", () => {
    assert.match(visibleText(card), /existiert nicht mehr/);
  });
  card.remove();
}
{
  const { hass } = makeHass({ entities: {} });
  const card = await mount("alarm-clocks-card", { type: "custom:alarm-clocks-card", device_id: DEVICE }, hass);
  check("no entities: friendly error instead of a crash", () => {
    assert.match(visibleText(card), /konnten nicht zugeordnet werden/);
  });
  card.remove();
}

// --- interaction ------------------------------------------------------------
{
  const { hass, calls } = makeHass();
  const card = await mount("alarm-clocks-card", { type: "custom:alarm-clocks-card", device_id: DEVICE }, hass);
  const picker = card.shadowRoot.querySelector("alarm-clocks-weekday-picker");
  await picker.updateComplete;
  picker.shadowRoot.querySelectorAll('button[role="switch"]')[5].click();
  card.shadowRoot.querySelector("button.toggle").click();
  check("interaction: day and enable toggles call switch.toggle", () => {
    assert.deepEqual(calls[0], ["switch", "toggle", {}, { entity_id: "switch.wecker_1_sat" }]);
    assert.deepEqual(calls[1], ["switch", "toggle", {}, { entity_id: "switch.wecker_1_aktiviert" }]);
  });

  let renders = 0;
  const originalUpdate = card.update.bind(card);
  card.update = (changed) => {
    renders += 1;
    originalUpdate(changed);
  };
  card.hass = { ...hass };
  await card.updateComplete;
  check("performance: unrelated hass updates do not re-render", () => {
    assert.equal(renders, 0);
  });
  card.remove();
}

// --- settings ---------------------------------------------------------------
{
  const { hass, calls } = makeHass();
  const card = await mount(
    "alarm-clocks-card",
    { type: "custom:alarm-clocks-card", device_id: DEVICE, settings_expanded: true },
    hass,
  );
  const rows = card.shadowRoot.querySelectorAll("alarm-clocks-setting-row");
  check("settings: one row per number entity", () => {
    assert.equal(rows.length, 4);
  });
  await rows[0].updateComplete;
  check("settings: plus button respects min/max and calls number.set_value", () => {
    rows[0].shadowRoot.querySelectorAll("button.icon-btn")[1].click();
    assert.deepEqual(calls.at(-1), [
      "number",
      "set_value",
      { value: 10 },
      { entity_id: "number.wecker_1_snooze_dauer" },
    ]);
  });
  card.remove();
}

// --- list card --------------------------------------------------------------
{
  const { hass, calls } = makeHass();
  const card = await mount(
    "alarm-clocks-list-card",
    { type: "custom:alarm-clocks-list-card", title: "Wecker" },
    hass,
  );
  check("list: renders one row per alarm", () => {
    const rows = card.shadowRoot.querySelectorAll(".row");
    assert.equal(rows.length, 1);
    assert.match(visibleText(card), /Wecker 1/);
  });
  check("list: toggle calls switch.toggle", () => {
    card.shadowRoot.querySelector("button.toggle").click();
    assert.deepEqual(calls.at(-1), [
      "switch",
      "toggle",
      {},
      { entity_id: "switch.wecker_1_aktiviert" },
    ]);
  });
  card.remove();
}

// --- localization -----------------------------------------------------------
{
  const { hass } = makeHass({ language: "en" });
  const card = await mount("alarm-clocks-card", { type: "custom:alarm-clocks-card", device_id: DEVICE }, hass);
  check("localization: falls back to English for non-German locales", () => {
    assert.match(visibleText(card), /Armed/);
  });
  card.remove();
}

for (const name of results) {
  console.log(`  ok  ${name}`);
}
// --- time stepper -----------------------------------------------------------
{
  const { hass, calls } = makeHass();
  const card = await mount(
    "alarm-clocks-card",
    { type: "custom:alarm-clocks-card", device_id: DEVICE, minute_step: 5 },
    hass,
  );
  const stepper = card.shadowRoot.querySelector("alarm-clocks-time-stepper");

  check("time stepper: renders hours and minutes as spin buttons", () => {
    const spinners = stepper.shadowRoot.querySelectorAll('[role="spinbutton"]');
    assert.equal(spinners.length, 2);
  });

  check("time stepper: arrow keys change the value", () => {
    const [hoursEl, minutesEl] = stepper.shadowRoot.querySelectorAll('[role="spinbutton"]');
    hoursEl.dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
    assert.equal(stepper.hours, 7);
    minutesEl.dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    assert.equal(stepper.minutes, 25);
  });

  check("time stepper: hours wrap around midnight", () => {
    stepper.hours = 23;
    const [hoursEl] = stepper.shadowRoot.querySelectorAll('[role="spinbutton"]');
    hoursEl.dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
    assert.equal(stepper.hours, 0);
  });

  check("time stepper: minutes snap to the configured step", () => {
    stepper.minutes = 23;
    const [, minutesEl] = stepper.shadowRoot.querySelectorAll('[role="spinbutton"]');
    minutesEl.dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
    assert.equal(stepper.minutes, 30);
  });

  check("time stepper: does not call the service on every step", () => {
    const before = calls.length;
    const [hoursEl] = stepper.shadowRoot.querySelectorAll('[role="spinbutton"]');
    for (let i = 0; i < 5; i += 1) {
      hoursEl.dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
    }
    assert.equal(calls.length, before);
  });
}

console.log(`\n${results.length} checks passed`);
process.exit(0);
