/**
 * Каркас сквозных тестов: браузер, тестовые аккаунты, проверки.
 *
 * Тесты кликают по настоящему приложению в настоящем движке браузера —
 * по умолчанию в WebKit, том же, что в Safari на iPhone. Именно там ловятся
 * вещи, которых не видно в Chromium: жесты, клавиатура, `touch-action`,
 * порядок гидрации. Для того, чего в WebKit на Linux нет (push-уведомления),
 * отдельные тесты просят Chromium.
 *
 * Правила, на которых всё держится:
 *  — каждый тест заводит СВОИ аккаунты (`newUser`) и сам их за собой убирает;
 *    так тесты не мешают друг другу и могут идти парами;
 *  — состояние аккаунта задаётся сразу в базе, а не прокликиванием
 *    онбординга: иначе каждый тест начинался бы с одних и тех же пяти
 *    экранов;
 *  — при падении сохраняем скриншот и текст страницы в e2e/.out — по ним
 *    видно, что именно увидел «пользователь».
 */

import bcrypt from "bcryptjs";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, devices, webkit } from "playwright";

export const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
export const OUT = join(ROOT, "e2e", ".out");
export const BASE = process.env.E2E_BASE ?? "http://localhost:3000";
const DB = process.env.E2E_DB ?? "yeahdays_dev";
const PASSWORD = "testpass123";

/* ────────────────────────  База  ──────────────────────── */

/**
 * Предохранитель. Тесты создают и удаляют аккаунты — по боевой базе такое
 * запускать нельзя ни разу. Имя базы должно быть локальным и явно dev.
 */
export function assertLocalDb() {
  if (!/dev|test/.test(DB)) {
    throw new Error(`E2E: база «${DB}» не похожа на тестовую — отказываюсь запускаться`);
  }
  const url = process.env.DATABASE_URL ?? "";
  if (url && !/localhost|127\.0\.0\.1|\/var\/run\/postgresql/.test(url)) {
    throw new Error("E2E: DATABASE_URL смотрит не на локальную базу — отказываюсь запускаться");
  }
}

/** Выполнить SQL в тестовой базе и вернуть строки как текст. */
export function sql(query) {
  return execFileSync("psql", ["-d", DB, "-Atc", query], { encoding: "utf8" }).trim();
}

/** То же, но результат — массив строк, разбитых по «|». */
export function rows(query) {
  const out = sql(query);
  return out ? out.split("\n").map((l) => l.split("|")) : [];
}

/* ────────────────────────  Аккаунты  ──────────────────────── */

let seq = 0;
const created = new Set();

/**
 * Тестовый аккаунт.
 *
 * Пишем прямо в базу, а не через /api/auth/register: у настоящей
 * регистрации есть защита от перебора (30 попыток в час с адреса), и набор
 * из пары десятков тестов упирался в неё на середине — тесты начинали
 * падать не потому, что приложение сломалось. Сама форма регистрации при
 * этом проверяется отдельным тестом, который ходит по ней по-человечески.
 *
 * `state` кладётся в UserState — это снимок, который приложение тянет при
 * входе. По умолчанию человек «уже освоился»: онбординг и гайд пройдены.
 * Тест про онбординг просит `fresh: true`.
 */
export async function newUser({ fresh = false, state = {} } = {}) {
  const id = `${Date.now().toString(36)}${seq++}`;
  const user = {
    name: `Тест ${seq}`,
    email: `e2e-${id}@test.local`,
    username: `e2e${id}`,
    password: PASSWORD,
    birthYear: 2004,
  };
  // Раунды те же, что в регистрации, — вход проверяет настоящий bcrypt.
  const hash = bcrypt.hashSync(PASSWORD, 12);
  // id задаём сами: psql к результату RETURNING дописывает строку о числе
  // вставленных строк, и она попадала в идентификатор.
  user.id = randomUUID();
  sql(
    `insert into "User"(id, name, email, username, "passwordHash", "birthYear", "createdAt", "updatedAt")
     values ('${user.id}', '${user.name}', '${user.email}', '${user.username}',
             '${hash}', ${user.birthYear}, now() at time zone 'utc', now() at time zone 'utc')`,
  );
  created.add(user.email);

  if (!fresh) {
    const snapshot = {
      name: user.name,
      onboarded: true,
      seenGuide: true,
      // Список должен совпадать с src/lib/features.ts: непросмотренная
      // новинка открывает шторку поверх экрана, и тапы тестов уходят в неё.
      seenFeatures: ["cn-midterm-2026-10", "social-2026-10", "events-2026-10", "challenge30-2026-10", "community-2026-09", "challenges", "todos", "schedule", "timeslots", "push", "personal-duration"],
      todos: [],
      plan: [],
      updatedAt: 1,
      ...state,
    };
    // clientAt строго в UTC: колонка без часового пояса, а локальный
    // Postgres живёт в зоне Алматы — now() ушло бы на 5 часов в будущее, и
    // сервер отклонял бы все правки клиента как «старые».
    sql(
      `insert into "UserState"("userId", data, "clientAt", "updatedAt")
       values ('${user.id}', '${JSON.stringify(snapshot).replace(/'/g, "''")}'::jsonb, to_timestamp(1), now() at time zone 'utc')
       on conflict ("userId") do update set data = excluded.data, "clientAt" = excluded."clientAt"`,
    );
  }
  return user;
}

/**
 * Подмести тестовые аккаунты, оставшиеся от прерванных прогонов.
 *
 * Прогон можно остановить на середине (Ctrl+C, упавший сервер), и тогда
 * аккаунты остаются в базе. Сами по себе они безобидны, но копятся и
 * мешают читать таблицы глазами. Всё с суффиксом @test.local старше часа —
 * точно мусор: живые тесты столько не идут.
 */
export function cleanupStale() {
  sql(`delete from "User" where email like 'e2e-%@test.local' and "createdAt" < now() at time zone 'utc' - interval '1 hour'`);
}

/** Убрать всё, что тест насоздавал (каскад унесёт задачи, дружбу, челленджи). */
export function cleanupUsers() {
  if (created.size === 0) return;
  const list = [...created].map((e) => `'${e}'`).join(",");
  sql(`delete from "User" where email in (${list})`);
  created.clear();
}

/* ────────────────────────  Браузер  ──────────────────────── */

const engines = { webkit, chromium };

/**
 * Готовая вкладка «айфона»: при `user` — уже с выполненным входом.
 *
 * `waitUntil: "networkidle"` перед вводом не прихоть: до гидрации поля
 * живут своей жизнью, и тест, который печатает слишком рано, врёт.
 */
export async function session({ user, engine = "webkit", permissions, initScript } = {}) {
  const browser = await engines[engine].launch();
  const context = await browser.newContext({
    ...devices["iPhone 13"],
    baseURL: BASE,
    locale: "ru-RU",
    timezoneId: "Asia/Almaty",
    permissions,
  });
  if (initScript) await context.addInitScript(initScript);
  const page = await context.newPage();
  // Запоминаем последнюю открытую вкладку: с неё снимается скриншот, если
  // тест упадёт. Иначе каждый тест пришлось бы передавать её руками.
  current.page = page;
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e.message)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  if (user) {
    await page.goto("/login", { waitUntil: "networkidle" });
    await page.fill('input[name="identifier"]', user.email);
    await page.fill('input[name="password"]', user.password);
    await page.click('button[type=submit]');
    await page.waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: 30_000 });
    // После входа приложение загружается целиком и подтягивает снимок
    // аккаунта. Человек в эту секунду никуда не уходит — и тест не должен:
    // иначе загрузка обрывается на полпути, и первый обмен с сервером
    // достаётся следующей странице.
    await page.waitForLoadState("networkidle");
  }
  return { browser, context, page, errors };
}

/** Открыть раздел приложения и дождаться, пока он ожил. */
export async function openSection(page, path) {
  await page.goto(path, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
}

/* ────────────────────────  Проверки  ──────────────────────── */

export class Failure extends Error {}

export function check(condition, message) {
  if (!condition) throw new Failure(message);
  current.checks.push(message);
}

export async function checkVisible(locator, message) {
  check(await locator.first().isVisible(), message);
}

export async function checkText(locator, needle, message) {
  const text = await locator.first().innerText();
  check(text.includes(needle), `${message} (увидел: ${text.replace(/\s+/g, " ").slice(0, 120)})`);
}

/* ────────────────────────  Реестр и прогон  ──────────────────────── */

const registry = [];
let current = { checks: [] };

/** Зарегистрировать тест. Имя — то, что человек делает руками. */
export function test(name, fn) {
  registry.push({ name, fn });
}

export function listTests() {
  return registry.map((t) => t.name);
}

async function saveArtifacts(name, page) {
  mkdirSync(OUT, { recursive: true });
  const slug = name.replace(/[^\wа-яё]+/gi, "-").slice(0, 60);
  try {
    await page.screenshot({ path: join(OUT, `${slug}.png`), fullPage: false });
    writeFileSync(join(OUT, `${slug}.txt`), await page.locator("body").innerText());
  } catch {
    /* страница могла уже закрыться */
  }
}

/**
 * Прогнать зарегистрированные тесты по очереди.
 *
 * Последовательно, а не пачкой: тесты делят одну базу и один dev-сервер, и
 * параллельный прогон превратил бы редкие настоящие поломки в постоянный
 * шум. Скорость здесь не главное — набор целиком укладывается в минуты.
 */
export async function runAll({ filter } = {}) {
  assertLocalDb();
  const results = [];
  for (const t of registry) {
    if (filter && !t.name.toLowerCase().includes(filter.toLowerCase())) continue;
    current = { checks: [], page: null };
    const started = Date.now();
    try {
      await t.fn();
      results.push({ name: t.name, ok: true, checks: current.checks, ms: Date.now() - started });
      console.log(`✓ ${t.name}  (${current.checks.length} проверок, ${Date.now() - started} мс)`);
    } catch (e) {
      if (current.page) await saveArtifacts(t.name, current.page);
      results.push({ name: t.name, ok: false, error: String(e.message).split("\n")[0], checks: current.checks });
      console.log(`✗ ${t.name}\n    ${String(e.message).split("\n")[0]}`);
      // Полный текст ошибки (лог ожидания Playwright) — по E2E_VERBOSE=1, обычно хватает первой строки.
      if (process.env.E2E_VERBOSE) console.log(String(e.stack ?? e.message));
      for (const c of current.checks) console.log(`    прошло: ${c}`);
    }
  }
  cleanupUsers();
  return results;
}
