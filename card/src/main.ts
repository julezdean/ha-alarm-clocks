import { ALARM_CARD_TAG, CARD_VERSION, REPO_URL } from "./const";

import "./cards/alarm-clocks-card";

window.customCards = window.customCards ?? [];

window.customCards.push({
  type: ALARM_CARD_TAG,
  name: "Alarm Clock Card",
  description:
    "One or several alarm clocks: alarm time, weekdays, snooze and dismiss, each row optionally collapsible.",
  preview: true,
  documentationURL: REPO_URL,
});

/* eslint-disable no-console */
console.info(
  `%c ALARM-CLOCKS-CARD %c ${CARD_VERSION} `,
  "color: #1c1c1c; background: #ffa600; font-weight: 700;",
  "color: #b36f00; background: white; font-weight: 700;",
);
