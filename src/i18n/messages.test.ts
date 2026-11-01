import { expect, it } from "vitest";
import { messages } from "./messages";
import { formatMessage } from "./useT";
it("all locales contain the same keys and interpolation parameters", () => {
 const keys = Object.keys(messages.ru).sort();
 for (const locale of ["en", "kk"] as const) {
  expect(Object.keys(messages[locale]).sort()).toEqual(keys);
  for (const key of keys as (keyof typeof messages.ru)[]) {
   expect(messages[locale][key].trim()).not.toBe("");
   expect(messages[locale][key].match(/\{\w+\}/g) ?? []).toEqual(messages.ru[key].match(/\{\w+\}/g) ?? []);
  }
 }
 expect(formatMessage("en", "flow.completed", { count: 3 })).toBe("Completed today: 3");
});
