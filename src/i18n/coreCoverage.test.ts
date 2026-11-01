import { expect, it } from "vitest";
import { createTranslator } from "./translate";
import keys from "./core-keys.json";
import en from "./dict/en.json";
import kk from "./dict/kk.json";
import extra from "./core-additions.json";
it("provides English and Kazakh for every migrated core message ID", () => {
 for (const [locale, dictionary] of Object.entries({ en: { ...en, ...extra.en }, kk: { ...kk, ...extra.kk } })) {
  const translate = createTranslator(dictionary);
  const missing = keys.filter(key => /[А-Яа-яЁё]/.test(key) && translate(key) === null);
  expect(missing, locale).toEqual([]);
 }
});
