/**
 * Импорт дедлайнов из календаря Moodle (AITU LMS) в задачи YeahGrind.
 *
 * Использование:
 *   node scripts/lms-import.mjs icalexport.ics              # разбор, без записи
 *   node scripts/lms-import.mjs icalexport.ics --apply      # записать в аккаунт
 *
 * Откуда брать .ics: LMS → Calendar → Export calendar → All events +
 * Custom range → кнопка Export. Веб-сервисы Moodle (/webservice/rest,
 * /login/token.php) в AITU закрыты на nginx (403), поэтому файл — рабочий
 * путь, а не обходной.
 *
 * Переменные окружения (.env):
 *   LMS_IMPORT_KEY     — сырой ключ из scripts/create-api-key.mjs
 *   YEAHGRIND_USER_ID  — чей аккаунт наполняем (привязан к ключу пейринг-кодом)
 *   YEAHGRIND_URL      — база API, по умолчанию http://localhost:3000
 *
 * По умолчанию скрипт НИЧЕГО не пишет — только показывает, что получилось
 * из файла. Запись включается явным --apply: у /api/integrations/add-todo
 * нет ни дедупликации, ни удаления, так что случайный лишний прогон
 * чистится только руками.
 */

import "dotenv/config";
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { parseEvents } from "./lib/ical.mjs";
import { eventsToTodos, DEFAULT_ZONE } from "./lib/moodle.mjs";

/** Журнал уже импортированных UID — защита от повторного прогона. */
const LEDGER_PATH = new URL("../.lms-import-state.json", import.meta.url);

/** "1 задачу" / "3 задачи" / "5 задач" — иначе вывод режет глаз. */
function plural(n, one, few, many) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} ${one}`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} ${few}`;
  return `${n} ${many}`;
}

function parseArgs(argv) {
  const args = { file: null, apply: false, zone: DEFAULT_ZONE, priority: "high" };
  for (const arg of argv) {
    if (arg === "--apply") args.apply = true;
    else if (arg.startsWith("--zone=")) args.zone = arg.slice(7);
    else if (arg.startsWith("--priority=")) args.priority = arg.slice(11);
    else if (!arg.startsWith("--")) args.file = arg;
  }
  return args;
}

async function readLedger() {
  if (!existsSync(LEDGER_PATH)) return {};
  try {
    return JSON.parse(await readFile(LEDGER_PATH, "utf8"));
  } catch {
    // Побитый журнал не повод падать — хуже всего тут молча ничего не
    // импортировать, поэтому считаем, что импорта не было.
    console.warn("! журнал импорта не читается, считаю его пустым");
    return {};
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.file) {
    console.error("Использование: node scripts/lms-import.mjs <файл.ics> [--apply]");
    process.exit(1);
  }

  const ics = await readFile(args.file, "utf8");
  const events = parseEvents(ics, args.zone);

  if (events.length === 0) {
    console.log("В файле нет ни одного события (VEVENT).");
    console.log("Обычно это значит, что при экспорте был выбран узкий период");
    console.log('либо в календаре пока нет дедлайнов. Проверь "All events" + "Custom range".');
    return;
  }

  const parsed = eventsToTodos(events, { zone: args.zone, priority: args.priority });
  const ledger = await readLedger();
  const fresh = parsed.filter(({ uid }) => !ledger[uid]);
  const skipped = parsed.length - fresh.length;

  console.log(`Событий в файле: ${events.length}`);
  console.log(`Задач после схлопывания дублей: ${parsed.length}`);
  if (skipped > 0) console.log(`Уже импортировано раньше, пропускаю: ${skipped}`);
  console.log("");

  let minutesDropped = 0;
  for (const { todo } of fresh) {
    const time =
      todo.hour === undefined
        ? "весь день"
        : `${String(todo.hour).padStart(2, "0")}:${String(todo.minute ?? 0).padStart(2, "0")}`;
    if (todo.minute) minutesDropped++;
    const dur = todo.duration ? ` (${todo.duration} мин)` : "";
    console.log(`  ${todo.date}  ${time.padEnd(9)}${dur}  ${todo.title}`);
  }
  console.log("");

  if (minutesDropped > 0) {
    console.log(
      `! У ${plural(minutesDropped, "задачи", "задач", "задач")} время не кратно часу, ` +
        "но add-todo принимает только hour —",
    );
    console.log("  минуты при записи потеряются (23:59 станет 23:00).");
    console.log("");
  }

  if (!args.apply) {
    console.log(
      `Это разбор без записи. Чтобы залить ${plural(fresh.length, "задачу", "задачи", "задач")} — добавь --apply.`,
    );
    return;
  }

  if (fresh.length === 0) {
    console.log("Нечего заливать — всё уже импортировано.");
    return;
  }

  const key = process.env.LMS_IMPORT_KEY;
  const userId = process.env.YEAHGRIND_USER_ID;
  const baseUrl = process.env.YEAHGRIND_URL || "http://localhost:3000";
  if (!key || !userId) {
    console.error("Нужны LMS_IMPORT_KEY и YEAHGRIND_USER_ID в .env — без них писать некуда.");
    process.exit(1);
  }

  console.log(`Заливаю ${fresh.length} задач в ${baseUrl} ...`);
  let ok = 0;

  for (const { uid, todo } of fresh) {
    const res = await fetch(`${baseUrl}/api/integrations/add-todo`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({ userId, ...todo }),
    });

    if (!res.ok) {
      // Останавливаемся на первой ошибке, а не гоним дальше: 401/403
      // означают проблему с ключом или привязкой, и остальные запросы
      // упадут так же — незачем засорять лог сотней одинаковых строк.
      console.error(`\n✗ ${todo.title}: ${res.status} ${await res.text()}`);
      console.error("Останавливаюсь. Успешно записано до этого: " + ok);
      break;
    }

    const { id } = await res.json();
    ledger[uid] = { id, title: todo.title, date: todo.date, at: Date.now() };
    ok++;
    process.stdout.write(".");
  }

  // Журнал пишем даже после обрыва — иначе повторный прогон продублирует
  // то, что уже успело записаться.
  await writeFile(LEDGER_PATH, JSON.stringify(ledger, null, 2) + "\n");
  console.log(`\nГотово: записано ${ok} из ${fresh.length}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
