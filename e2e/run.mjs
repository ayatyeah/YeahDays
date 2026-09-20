/**
 * Запуск набора: `npm run test:e2e` (или `node e2e/run.mjs имя-теста`).
 *
 * Тесты ходят на ОТДЕЛЬНЫЙ сервер (npm run dev:e2e, порт 3100), у которого
 * своя база yeahdays_dev. Сайт на 3000 при этом может работать с боевой
 * базой — и хорошо, что может: иначе первый же прогон удалял бы живые
 * аккаунты. Сервер тестов поднимается отдельной командой, а не отсюда:
 * так видно его лог и не приходится гадать, чей процесс занял порт.
 */

import { readdirSync } from "node:fs";
import { join } from "node:path";
import { BASE, ROOT, assertLocalDb, cleanupStale, cleanupUsers, runAll } from "./harness.mjs";

const filter = process.argv[2];

assertLocalDb();
cleanupStale();

try {
  const res = await fetch(`${BASE}/login`, { redirect: "manual" });
  if (!res.ok && res.status !== 307 && res.status !== 308) throw new Error(String(res.status));
} catch {
  console.error(`Нет ответа от ${BASE}. Запусти сервер для тестов: npm run dev:e2e`);
  process.exit(2);
}

const dir = join(ROOT, "e2e", "specs");
for (const file of readdirSync(dir).sort()) {
  if (file.endsWith(".mjs")) await import(join(dir, file));
}

const started = Date.now();
let results = [];
try {
  results = await runAll({ filter });
} finally {
  cleanupUsers();
}

const failed = results.filter((r) => !r.ok);
const checks = results.reduce((n, r) => n + r.checks.length, 0);
console.log(
  `\n${results.length - failed.length}/${results.length} сценариев, ${checks} проверок, ${Math.round((Date.now() - started) / 1000)} с`,
);
if (failed.length) {
  console.log(`Упало: ${failed.map((f) => f.name).join("; ")}`);
  console.log("Скриншоты и текст экрана — в e2e/.out");
}
process.exit(failed.length ? 1 : 0);
