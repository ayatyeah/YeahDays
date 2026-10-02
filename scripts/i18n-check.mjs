// Какие строки интерфейса ещё не переведены.
//
//   node scripts/i18n-extract.mjs && node scripts/i18n-check.mjs
//
// Запускать после правок интерфейса: новые русские строки попадут в
// src/i18n/keys.json, а этот скрипт покажет, чего не хватает в словарях.
// Непереведённая строка не ломает экран — она просто остаётся по-русски.
import { readFileSync } from "node:fs";

const keys = JSON.parse(readFileSync("src/i18n/keys.json", "utf8"));
let missingTotal = 0;
for (const lang of ["en", "kk"]) {
  const dict = JSON.parse(readFileSync(`src/i18n/dict/${lang}.json`, "utf8"));
  const missing = keys.filter((k) => typeof dict[k] !== "string" || !dict[k].trim());
  const stale = Object.keys(dict).filter((k) => !keys.includes(k));
  console.log(`${lang}: переведено ${keys.length - missing.length} из ${keys.length}, нет перевода: ${missing.length}, устаревших ключей: ${stale.length}`);
  for (const k of missing.slice(0, 15)) console.log("   ·", JSON.stringify(k));
  if (missing.length > 15) console.log(`   … и ещё ${missing.length - 15}`);
  missingTotal += missing.length;
}
process.exit(missingTotal ? 1 : 0);
