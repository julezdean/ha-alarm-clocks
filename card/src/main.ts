import { ALARM_CARD_TAG, CARD_VERSION, LIST_CARD_TAG, REPO_URL } from "./const";

import "./cards/alarm-clocks-card";
import "./cards/alarm-clocks-list-card";

window.customCards = window.customCards ?? [];

window.customCards.push(
  {
    type: ALARM_CARD_TAG,
    name: "Alarm Clock Card",
    description:
      "Alarm time, weekdays, snooze and dismiss for a single alarm clock.",
    preview: true,
    documentationURL: REPO_URL,
  },
  {
    type: LIST_CARD_TAG,
    name: "Alarm Clock List Card",
    description: "Compact overview of all alarm clocks.",
    preview: true,
    documentationURL: REPO_URL,
  },
);

/* eslint-disable no-console */
console.info(
  `%c ALARM-CLOCKS-CARD %c ${CARD_VERSION} `,
  "color: white; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; background: white; font-weight: 700;",
);
