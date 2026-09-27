/**
 * Smoke test for the built bundle.
 *
 *   npm run build && npm test
 *
 * Renders the card against a fake `hass` object that mirrors the entities the
 * Alarm Clocks integration creates, and asserts on the visible text plus the
 * service calls that user interaction produces.
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
const DEVICE2 = "device-2";
const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

/** Every entity of one alarm clock, mirroring what the integration creates. */
function addDeviceEntities(entities, states, id, slug, opts = {}) {
  const add = (entityId, translationKey, state, attributes = {}) => {
    entities[entityId] = {
      entity_id: entityId,
      device_id: id,
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

  add(`switch.${slug}_aktiviert`, "enabled", opts.enabled === false ? "off" : "on");
  WEEKDAYS.forEach((day, index) => {
    add(`switch.${slug}_${day}`, `day_${day}`, index < 5 ? "on" : "off");
  });
  add(`time.${slug}_weckzeit`, "alarm_time", opts.time ?? "06:30:00");
  add(`number.${slug}_snooze_dauer`, "snooze_duration", "9", { min: 1, max: 30, step: 1 });
  add(`number.${slug}_pre`, "pre_offset", "0", { min: 0, max: 60, step: 1 });
  add(`number.${slug}_post`, "post_offset", "0", { min: 0, max: 60, step: 1 });
  add(`number.${slug}_auto`, "auto_dismiss", "10", { min: 0, max: 120, step: 1 });
  add(`binary_sensor.${slug}_klingelt`, "ringing", opts.status === "ringing" ? "on" : "off");
  add(`binary_sensor.${slug}_snooze_aktiv`, "snooze_active", opts.status === "snoozed" ? "on" : "off");
  add(`sensor.${slug}_nachster_alarm`, "next_alarm", new Date(Date.now() + 7_200_000).toISOString());
  add(`sensor.${slug}_status`, "state", opts.status ?? (opts.enabled === false ? "disabled" : "armed"));
  add(`sensor.${slug}_snooze_bis`, "snooze_until", "unknown");
  add(`button.${slug}_snooze`, "snooze", "unknown");
  add(`button.${slug}_dismiss`, "dismiss", "unknown");
}

function makeHass(overrides = {}) {
  const entities = {};
  const states = {};
  const calls = [];

  const devices = overrides.devices ?? [{ id: DEVICE, slug: "wecker_1", name: "Wecker 1" }];
  const deviceRegistry = {};
  for (const device of devices) {
    addDeviceEntities(entities, states, device.id, device.slug, device);
    deviceRegistry[device.id] = { id: device.id, name: device.name, name_by_user: null };
  }

  for (const [entityId, patch] of Object.entries(overrides.states ?? {})) {
    states[entityId] = { ...states[entityId], ...patch };
  }

  return {
    calls,
    hass: {
      states,
      entities: overrides.entities ?? entities,
      devices: overrides.deviceRegistry ?? deviceRegistry,
      locale: { language: overrides.language ?? "de" },
      callService: (...args) => {
        calls.push(args);
        return Promise.resolve();
      },
    },
  };
}

async function mount(config, hass) {
  const card = document.createElement("alarm-clocks-card");
  card.setConfig(config);
  card.hass = hass;
  document.body.appendChild(card);
  await card.updateComplete;
  return card;
}

/** querySelector that also looks inside the shadow roots of nested components. */
function deepQuery(root, selector) {
  const direct = root.querySelector(selector);
  if (direct) return direct;
  for (const el of root.querySelectorAll("*")) {
    if (el.shadowRoot) {
      const found = deepQuery(el.shadowRoot, selector);
      if (found) return found;
    }
  }
  return null;
}

/** querySelectorAll that also looks inside the shadow roots of nested components. */
function deepQueryAll(root, selector) {
  const results = [...root.querySelectorAll(selector)];
  for (const el of root.querySelectorAll("*")) {
    if (el.shadowRoot) {
      results.push(...deepQueryAll(el.shadowRoot, selector));
    }
  }
  return results;
}

/** The time shown by the stepper component, as "HH:MM". */
function steppedTime(card) {
  const stepper = deepQuery(card.shadowRoot, "alarm-clocks-time-stepper");
  if (!stepper) return "";
  return `${String(stepper.hours).padStart(2, "0")}:${String(stepper.minutes).padStart(2, "0")}`;
}

/** Visible text only, crossing into every nested shadow root, without <style>. */
function collectText(root, out) {
  for (const node of root.childNodes) {
    if (node.nodeType === 3) {
      out.push(node.textContent);
    } else if (node.nodeType === 1) {
      if (node.tagName === "STYLE") continue;
      if (node.shadowRoot) collectText(node.shadowRoot, out);
      collectText(node, out);
    }
  }
}
function visibleText(card) {
  const root = card.shadowRoot.querySelector("ha-card");
  if (!root) return "";
  const out = [];
  collectText(root, out);
  return out.join(" ").replace(/\s+/g, " ").trim();
}

const results = [];
function check(name, fn) {
  fn();
  results.push(name);
}

// --- armed, expanded ---------------------------------------------------------
{
  const { hass } = makeHass();
  const card = await mount({ type: "custom:alarm-clocks-card", devices: [DEVICE], expanded: true }, hass);
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
    const picker = deepQuery(card.shadowRoot, "alarm-clocks-weekday-picker");
    const days = picker.shadowRoot.querySelectorAll('button[role="switch"]');
    assert.equal(days.length, 7);
    assert.equal(days[0].getAttribute("aria-checked"), "true");
    assert.equal(days[6].getAttribute("aria-checked"), "false");
  });
  card.remove();
}

// --- ringing, expanded --------------------------------------------------------
{
  const { hass, calls } = makeHass({
    states: {
      "sensor.wecker_1_status": { state: "ringing" },
      "binary_sensor.wecker_1_klingelt": { state: "on" },
    },
  });
  const card = await mount({ type: "custom:alarm-clocks-card", devices: [DEVICE], expanded: true }, hass);
  const text = visibleText(card);
  check("ringing: offers snooze and dismiss", () => {
    assert.match(text, /Klingelt/);
    assert.match(text, /Schlummern/);
    assert.match(text, /Ausschalten/);
  });
  check("ringing: snooze calls alarm_clocks.snooze on the device", () => {
    const buttons = deepQueryAll(card.shadowRoot, ".actions .btn");
    buttons[0].click();
    assert.deepEqual(calls.at(-1), ["alarm_clocks", "snooze", {}, { device_id: DEVICE }]);
    buttons[1].click();
    assert.deepEqual(calls.at(-1), ["alarm_clocks", "dismiss", {}, { device_id: DEVICE }]);
  });
  card.remove();
}

// --- disabled, next_alarm unavailable -----------------------------------------
{
  const { hass } = makeHass({
    states: {
      "sensor.wecker_1_status": { state: "disabled" },
      "switch.wecker_1_aktiviert": { state: "off" },
      "sensor.wecker_1_nachster_alarm": { state: "unavailable" },
    },
  });
  const card = await mount({ type: "custom:alarm-clocks-card", devices: [DEVICE], expanded: true }, hass);
  check("disabled: unavailable next_alarm renders as 'Kein Alarm'", () => {
    const text = visibleText(card);
    assert.match(text, /Deaktiviert/);
    assert.match(text, /Kein Alarm/);
  });
  card.remove();
}

// --- one-shot ------------------------------------------------------------------
{
  const overrides = { states: {} };
  for (const day of WEEKDAYS) {
    overrides.states[`switch.wecker_1_${day}`] = { state: "off" };
  }
  const { hass } = makeHass(overrides);
  const card = await mount({ type: "custom:alarm-clocks-card", devices: [DEVICE], expanded: true }, hass);
  check("one-shot: shows the badge when no weekday is active", () => {
    assert.match(visibleText(card), /Einmalig/);
  });
  card.remove();
}

// --- error states ----------------------------------------------------------
{
  const { hass } = makeHass();
  const card = await mount({ type: "custom:alarm-clocks-card", devices: ["nope"] }, hass);
  check("unknown device id: falls back to 'no alarms' instead of a crash", () => {
    assert.match(visibleText(card), /Keine Wecker gefunden/);
  });
  card.remove();
}
{
  const { hass } = makeHass({ entities: {} });
  const card = await mount({ type: "custom:alarm-clocks-card", devices: [DEVICE] }, hass);
  check("no entities: falls back to 'no alarms' instead of a crash", () => {
    assert.match(visibleText(card), /Keine Wecker gefunden/);
  });
  card.remove();
}

// --- interaction -------------------------------------------------------------
{
  const { hass, calls } = makeHass();
  const card = await mount({ type: "custom:alarm-clocks-card", devices: [DEVICE], expanded: true }, hass);
  const picker = deepQuery(card.shadowRoot, "alarm-clocks-weekday-picker");
  await picker.updateComplete;
  picker.shadowRoot.querySelectorAll('button[role="switch"]')[5].click();
  deepQuery(card.shadowRoot, "button.toggle").click();
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

// --- settings ------------------------------------------------------------------
{
  const { hass, calls } = makeHass();
  const card = await mount(
    { type: "custom:alarm-clocks-card", devices: [DEVICE], expanded: true },
    hass,
  );
  const rows = deepQueryAll(card.shadowRoot, "alarm-clocks-setting-row");
  check("settings: one row per number entity, shown directly (not collapsible)", () => {
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

// --- collapsed row, expand/collapse --------------------------------------------
{
  const { hass } = makeHass();
  const card = await mount({ type: "custom:alarm-clocks-card", devices: [DEVICE] }, hass);
  check("collapsed by default: shows the compact row, not the full body", () => {
    const text = visibleText(card);
    assert.match(text, /Wecker 1/);
    assert.match(text, /06:30/);
    assert.equal(deepQuery(card.shadowRoot, "alarm-clocks-time-stepper"), null);
  });

  const expandButton = deepQuery(card.shadowRoot, "button.expand-btn");
  expandButton.click();
  await card.updateComplete;
  check("clicking the chevron expands the row", () => {
    assert.equal(steppedTime(card), "06:30");
  });

  deepQuery(card.shadowRoot, "button.expand-btn").click();
  await card.updateComplete;
  check("clicking it again collapses the row", () => {
    assert.equal(deepQuery(card.shadowRoot, "alarm-clocks-time-stepper"), null);
  });
  card.remove();
}

// --- accordion: only one row expanded at a time --------------------------------
{
  const { hass } = makeHass({
    devices: [
      { id: DEVICE, slug: "wecker_1", name: "Wecker 1", time: "06:30:00" },
      { id: DEVICE2, slug: "wecker_2", name: "Wecker 2", time: "08:15:00" },
    ],
  });
  const card = await mount({ type: "custom:alarm-clocks-card", devices: [DEVICE, DEVICE2] }, hass);

  const expandButtons = () => deepQueryAll(card.shadowRoot, "button.expand-btn");
  expandButtons()[0].click();
  await card.updateComplete;
  check("expanding the first row shows its time", () => {
    assert.equal(steppedTime(card), "06:30");
    assert.equal(deepQueryAll(card.shadowRoot, "alarm-clocks-time-stepper").length, 1);
  });

  expandButtons()[1].click();
  await card.updateComplete;
  check("expanding the second row collapses the first", () => {
    assert.equal(steppedTime(card), "08:15");
    assert.equal(deepQueryAll(card.shadowRoot, "alarm-clocks-time-stepper").length, 1);
  });
  card.remove();
}

// --- expandable: false ----------------------------------------------------------
{
  const { hass } = makeHass();
  const fixedOpen = await mount(
    { type: "custom:alarm-clocks-card", devices: [DEVICE], expandable: false, expanded: true },
    hass,
  );
  check("expandable: false, expanded: true: always shows the full body, no chevron", () => {
    assert.equal(steppedTime(fixedOpen), "06:30");
    assert.equal(deepQuery(fixedOpen.shadowRoot, "button.expand-btn"), null);
  });
  fixedOpen.remove();

  const { hass: hass2 } = makeHass();
  const fixedClosed = await mount(
    { type: "custom:alarm-clocks-card", devices: [DEVICE], expandable: false, expanded: false },
    hass2,
  );
  check("expandable: false, expanded: false: always shows the compact row, no chevron", () => {
    assert.equal(deepQuery(fixedClosed.shadowRoot, "alarm-clocks-time-stepper"), null);
    assert.equal(deepQuery(fixedClosed.shadowRoot, "button.expand-btn"), null);
  });
  fixedClosed.remove();
}

// --- multiple devices, hide_disabled --------------------------------------------
{
  const { hass } = makeHass({
    devices: [
      { id: DEVICE, slug: "wecker_1", name: "Wecker 1" },
      { id: DEVICE2, slug: "wecker_2", name: "Wecker 2", enabled: false },
    ],
  });
  const all = await mount({ type: "custom:alarm-clocks-card", devices: [] }, hass);
  check("devices: [] shows every alarm clock found in the registry", () => {
    assert.equal(all.shadowRoot.querySelectorAll("alarm-clocks-item").length, 2);
  });
  all.remove();

  const { hass: hass2 } = makeHass({
    devices: [
      { id: DEVICE, slug: "wecker_1", name: "Wecker 1" },
      { id: DEVICE2, slug: "wecker_2", name: "Wecker 2", enabled: false },
    ],
  });
  const filtered = await mount(
    { type: "custom:alarm-clocks-card", devices: [DEVICE, DEVICE2], hide_disabled: true },
    hass2,
  );
  check("hide_disabled: true hides the switched off alarm", () => {
    assert.equal(filtered.shadowRoot.querySelectorAll("alarm-clocks-item").length, 1);
    assert.match(visibleText(filtered), /Wecker 1/);
    assert.doesNotMatch(visibleText(filtered), /Wecker 2/);
  });
  filtered.remove();
}

// --- localization ---------------------------------------------------------
{
  const { hass } = makeHass({ language: "en" });
  const card = await mount(
    { type: "custom:alarm-clocks-card", devices: [DEVICE], expanded: true },
    hass,
  );
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
    { type: "custom:alarm-clocks-card", devices: [DEVICE], expanded: true, minute_step: 5 },
    hass,
  );
  const stepper = deepQuery(card.shadowRoot, "alarm-clocks-time-stepper");

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

  check("time stepper: the wheel is ignored while the segment is not focused", () => {
    const before = stepper.hours;
    const [hoursEl] = stepper.shadowRoot.querySelectorAll('[role="spinbutton"]');
    hoursEl.dispatchEvent(new window.WheelEvent("wheel", { deltaY: -100, bubbles: true }));
    assert.equal(stepper.hours, before);
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
