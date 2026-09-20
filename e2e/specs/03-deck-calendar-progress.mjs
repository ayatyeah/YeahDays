/**
 * Три экрана, ради которых приложение открывают каждый день: колода
 * («Главная»), почасовой план («Календарь») и итоги («Прогресс»).
 *
 * Колода — единственное место, где решение принимается ЖЕСТОМ, а не
 * нажатием, поэтому её проверяем именно перетаскиванием карточки, а не
 * кнопками-дублёрами: сломаться может ровно жест (см. разбор осей в
 * SwipeDeck.tsx), а кнопки при этом продолжат работать и ничего не скажут.
 *
 * Жест ведём мышью, а не пальцем: в WebKit на Linux нет конструктора
 * Touch и нет initTouchEvent, так что настоящий touch-жест здесь
 * недоступен в принципе. framer-motion слушает pointer-события, а их
 * мышь порождает исправно — перетаскивание карточки доходит до
 * onDragEnd ровно так же, как на телефоне.
 */

import {
  check,
  checkText,
  checkVisible,
  newUser,
  openSection,
  session,
  sql,
  test,
} from "../harness.mjs";

/* ────────────────────────  Даты  ──────────────────────── */

/** Сегодня глазами браузера: контекст теста живёт в зоне Алматы. */
function todayKey() {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Almaty" }).format(new Date());
}

/** Сдвиг YYYY-MM-DD на N суток — считаем в UTC, чтобы не зависеть от зоны машины. */
function shiftKey(key, delta) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + delta)).toISOString().slice(0, 10);
}

/** День недели, 0 — понедельник (как в полоске недели календаря). */
function weekIndex(key) {
  const [y, m, d] = key.split("-").map(Number);
  return (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7;
}

/* ────────────────────────  Данные  ──────────────────────── */

/** Своё действие для колоды — с узнаваемым названием, чтобы ловить его по тексту. */
function action(id, title, category = "learning") {
  return {
    id,
    title,
    why: `Зачем это: ${title}`,
    category,
    difficulty: 2,
    duration: 20,
    energy: "medium",
    timePreference: "any",
    impact: 3,
    custom: true,
  };
}

function todo(id, title, day, extra = {}) {
  return {
    id,
    title,
    date: day,
    priority: "normal",
    subtasks: [],
    done: false,
    doneDays: [],
    ...extra,
  };
}

/**
 * Аккаунт, который открывает приложение прямо на колоде: чек-ин на сегодня
 * уже сделан, а колода собрана только из своих действий — иначе в ней
 * лежали бы 159 действий общего пула, и тест не знал бы, что именно
 * лежит сверху.
 */
function deckState(actions, extra = {}) {
  return {
    lastCheckIn: todayKey(),
    useOwnActionsOnly: true,
    customActions: actions,
    ...extra,
  };
}

const DECK = [
  action("e2e-deck-1", "Конспект по алгоритмам", "learning"),
  action("e2e-deck-2", "Двадцать минут бега", "fitness"),
  action("e2e-deck-3", "Разбор бюджета месяца", "money"),
];

/* ────────────────────────  Жесты и навигация  ──────────────────────── */

/** Верхняя карта колоды. В DOM стопка идёт снизу вверх (см. reverse в SwipeDeck). */
function topCard(page) {
  return page.locator("article").last();
}

async function topTitle(page) {
  return (await topCard(page).locator("h2").innerText()).trim();
}

async function waitForDeck(page) {
  await topCard(page).waitFor({ state: "visible", timeout: 20_000 });
  await page.waitForTimeout(400); // карты стопки доезжают пружиной
}

/**
 * Дождаться, пока сверху окажется другая карточка.
 *
 * Улетевшая карта живёт в DOM, пока доигрывает выход (AnimatePresence), и
 * всё это время остаётся последней — то есть «верхней» с точки зрения
 * поиска. Ждём состояние, а не фиксированную паузу.
 */
async function waitTopChanged(page, prev, timeout = 8000) {
  const until = Date.now() + timeout;
  let current = prev;
  while (Date.now() < until) {
    current = await topTitle(page).catch(() => prev);
    if (current !== prev) return current;
    await page.waitForTimeout(150);
  }
  return current;
}

/** Дождаться экрана активной задачи — «взял — сделай». */
async function waitActiveTask(page) {
  await page
    .getByRole("button", { name: /Сделал ·/ })
    .first()
    .waitFor({ state: "visible", timeout: 15_000 });
}

/**
 * Свайп верхней карты. Порог — 80px (SWIPE_DISTANCE), ведём заметно
 * дальше и мелкими шагами: одно длинное перемещение framer-motion
 * принимает за рывок и считает скорость, а нам нужна именно дистанция.
 */
async function swipe(page, dir) {
  const box = await topCard(page).boundingBox();
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  const sign = dir === "right" ? 1 : -1;
  await page.mouse.move(x, y);
  await page.mouse.down();
  for (let i = 1; i <= 12; i++) await page.mouse.move(x + sign * i * 18, y);
  await page.waitForTimeout(80);
  await page.mouse.up();
  // 0.22 с улетает карта + перерисовка колоды
  await page.waitForTimeout(900);
}

/** Переключить раздел нижней навигацией — как это делает человек. */
async function goTab(page, label) {
  await page.locator("nav").getByRole("button", { name: label, exact: true }).tap();
  await page.waitForTimeout(700);
}

/** Дождаться, пока снимок с нужным числом взятых действий доедет до сервера. */
async function waitServerPlan(page, userId, count, timeout = 15_000) {
  const until = Date.now() + timeout;
  while (Date.now() < until) {
    const n = Number(
      sql(`select coalesce(jsonb_array_length(data->'plan'), 0)
           from "UserState" where "userId"='${userId}'`),
    );
    if (n >= count) return true;
    await page.waitForTimeout(500);
  }
  return false;
}

/* ════════════════════════  Колода  ════════════════════════ */

test("Колода: свайп вправо берёт действие — оно в плане и в снимке на сервере", async () => {
  const user = await newUser({ state: deckState(DECK) });
  const { browser, page } = await session({ user });

  /*
   * Автосохранение придерживаем до самого свайпа.
   *
   * Сразу после сборки колоды приложение отмечает показанные карточки
   * (markSeen) и уносит снимок на сервер. Нам нужен снимок УЖЕ со взятым
   * действием, а не пустой — иначе тест проверял бы не то. Отказ в
   * сохранении для приложения — обычный офлайн: оно перепланирует
   * отправку на следующее изменение, то есть на наш свайп.
   */
  let hold = true;
  await page.route("**/api/state", async (route) => {
    if (hold && route.request().method() === "PUT") return route.abort();
    await route.continue();
  });

  await openSection(page, "/app");
  await waitForDeck(page);
  const taken = await topTitle(page);

  await swipe(page, "right");
  hold = false;

  // Взял — сделай: вместо колоды появляется активная задача.
  await waitActiveTask(page);
  await checkText(page.locator("body"), "Сделал ·", "взятое действие стало активной задачей");
  await checkText(page.locator("body"), taken, `активная задача — «${taken}»`);

  await goTab(page, "Сегодня");
  await checkText(
    page.locator('[data-section="today"]'),
    "Взято из колоды · 1",
    "в «Сегодня» появился ровно один взятый пункт",
  );
  await checkText(page.locator('[data-section="today"]'), taken, "и это то самое действие");

  check(await waitServerPlan(page, user.id, 1), "снимок со взятым действием доехал до сервера");
  const stored = sql(
    `select data->'plan'->0->'snapshot'->>'title' from "UserState" where "userId"='${user.id}'`,
  );
  check(stored === taken, `на сервере лежит «${taken}» (увидел: «${stored}»)`);

  await browser.close();
});

test("Колода: свайп влево пропускает — карточка сменяется, в план ничего не попадает", async () => {
  const user = await newUser({ state: deckState(DECK) });
  const { browser, page } = await session({ user });
  await openSection(page, "/app");
  await waitForDeck(page);

  const skipped = await topTitle(page);
  await swipe(page, "left");

  const next = await waitTopChanged(page, skipped);
  check(next !== skipped, `сверху новая карточка: было «${skipped}», стало «${next}»`);
  check(
    (await page.getByText("Сделал ·").count()) === 0,
    "активной задачи не появилось — «мимо» не берёт действие",
  );

  await goTab(page, "Сегодня");
  await checkText(
    page.locator('[data-section="today"]'),
    "Ничего не взято",
    "план на сегодня остался пустым",
  );

  await browser.close();
});

test("Колода: после вертикальной прокрутки горизонтальный свайп всё ещё берёт карточку", async () => {
  // Разбор осей в SwipeDeck (горизонталь — жесту, вертикаль — прокрутке)
  // легко сломать так, что после первой же прокрутки карточка перестаёт
  // тянуться. Проверяем связку: прокрутили раздел, потянули карточку
  // вниз (это не свайп) — и только потом вбок.
  const user = await newUser({ state: deckState(DECK) });
  const { browser, page } = await session({ user });
  await openSection(page, "/app");
  await waitForDeck(page);

  const box = await topCard(page).boundingBox();
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;

  // Прокручиваем сам раздел (в мобильном WebKit колеса мыши нет, а
  // прокрутка у каждого раздела своя — см. .section-pane в AppShell).
  const scrolled = await page.evaluate(() => {
    const pane = document.querySelector('[data-section="home"]');
    if (!pane) return -1;
    pane.scrollBy(0, 200);
    return pane.scrollTop;
  });
  check(scrolled >= 0, "раздел «Главная» прокручивается сам по себе");
  await page.waitForTimeout(400);
  await page.evaluate(() => document.querySelector('[data-section="home"]')?.scrollTo(0, 0));
  await page.waitForTimeout(400);

  // Короткое вертикальное движение по самой карточке: карточка тянется
  // только по X, поэтому такое движение обязано остаться без последствий.
  await page.mouse.move(x, y);
  await page.mouse.down();
  for (let i = 1; i <= 6; i++) await page.mouse.move(x, y + i * 12);
  await page.mouse.up();
  await page.waitForTimeout(600);

  const stillThere = await topTitle(page);
  check(
    (await page.getByText("Сделал ·").count()) === 0,
    "вертикальное движение по карточке ничего не взяло",
  );

  await swipe(page, "right");
  await waitActiveTask(page);
  await checkText(page.locator("body"), "Сделал ·", "горизонтальный свайп после прокрутки работает");
  await checkText(page.locator("body"), stillThere, `взялась та же карточка — «${stillThere}»`);

  await goTab(page, "Сегодня");
  await checkText(
    page.locator('[data-section="today"]'),
    "Взято из колоды · 1",
    "в плане ровно одно действие, лишних свайпов не случилось",
  );

  await browser.close();
});

test("Колода: кнопки «беру» и «не сейчас» под колодой делают то же, что жест", async () => {
  const user = await newUser({ state: deckState(DECK) });
  const { browser, page } = await session({ user });
  await openSection(page, "/app");
  await waitForDeck(page);

  const first = await topTitle(page);
  await page.getByRole("button", { name: "Не сейчас" }).tap();
  const second = await waitTopChanged(page, first);
  check(second !== first, `«не сейчас» пролистало: было «${first}», стало «${second}»`);

  await page.getByRole("button", { name: "Беру" }).tap();
  await waitActiveTask(page);
  await checkText(page.locator("body"), "Сделал ·", "«беру» взяло действие в план");
  await checkText(page.locator("body"), second, `в работе именно «${second}»`);

  await browser.close();
});

test("Колода: чек-ин про силы и минуты проходит и выводит на колоду", async () => {
  // Без lastCheckIn приложение встречает чек-ином — это вход в продукт.
  const user = await newUser({
    state: { useOwnActionsOnly: true, customActions: DECK },
  });
  const { browser, page } = await session({ user });
  await openSection(page, "/app");

  await checkText(page.locator("h1"), "Как ты сегодня?", "встречает чек-ин");

  const low = page.getByRole("tab", { name: "Мало сил" });
  await low.tap();
  const minutes = page.getByRole("tab", { name: "10 мин" });
  await minutes.tap();
  await page.waitForTimeout(400);

  check((await low.getAttribute("aria-selected")) === "true", "выбор «мало сил» встал на место");
  check((await minutes.getAttribute("aria-selected")) === "true", "бюджет 10 минут выбран");

  await page.getByRole("button", { name: "Показать действия на сегодня" }).tap();
  await waitForDeck(page);
  check(
    (await page.getByRole("button", { name: "Показать действия на сегодня" }).count()) === 0,
    "чек-ин закрылся",
  );
  await checkText(
    page.locator('[data-section="home"] h1'),
    "Что сделаешь сегодня?",
    "дальше — колода с подборкой на сегодня",
  );

  await browser.close();
});

/* ════════════════════════  Календарь  ════════════════════════ */

test("Календарь: другой день в полоске недели меняет показанный день", async () => {
  const today = todayKey();
  // Целимся в другой день ТОЙ ЖЕ недели: полоска показывает только её.
  const mine = weekIndex(today);
  const otherIndex = mine === 0 ? 1 : 0;
  const other = shiftKey(today, otherIndex - mine);

  const user = await newUser({
    state: {
      todos: [
        todo("e2e-t-today", "Пара по матанализу", today, { hour: 10, minute: 0, duration: 90 }),
        todo("e2e-t-other", "Семинар по истории", other, { hour: 11, minute: 0, duration: 60 }),
      ],
    },
  });
  const { browser, page } = await session({ user });
  await openSection(page, "/calendar");

  const section = page.locator('[data-section="calendar"]');
  await checkText(section.locator("h1"), "Сегодня", "открывается на сегодняшнем дне");
  // Смотрим весь раздел, а не только сетку часов: прошедшее дело сегодня
  // поднимается в лоток «Просрочено» над сеткой — оно всё равно про сегодня.
  await checkText(section, "Пара по матанализу", "видно дело сегодняшнего дня");
  check(
    !(await section.innerText()).includes("Семинар по истории"),
    "дело другого дня сегодня не показано",
  );

  await section.locator("div.grid.grid-cols-7").first().locator("button").nth(otherIndex).tap();
  await page.waitForTimeout(700);

  const title = await section.locator("h1").innerText();
  check(!title.includes("Сегодня"), `заголовок ушёл с «Сегодня» (стало: ${title})`);
  check(
    title.includes(String(Number(other.slice(8)))),
    `в заголовке число выбранного дня ${Number(other.slice(8))} (стало: ${title})`,
  );
  await checkText(section.locator(".glass-panel"), "Семинар по истории", "показан план выбранного дня");
  check(
    !(await section.innerText()).includes("Пара по матанализу"),
    "сегодняшнее дело на чужом дне не осталось",
  );

  await browser.close();
});

test("Календарь: задача через «+» появляется в выбранном дне и только в нём", async () => {
  const today = todayKey();
  const mine = weekIndex(today);
  const otherIndex = mine === 0 ? 1 : 0;
  const other = shiftKey(today, otherIndex - mine);

  const user = await newUser({ state: { todos: [] } });
  const { browser, page } = await session({ user });
  await openSection(page, "/calendar");

  const section = page.locator('[data-section="calendar"]');
  await section.locator("div.grid.grid-cols-7").first().locator("button").nth(otherIndex).tap();
  await page.waitForTimeout(600);

  await page.getByRole("button", { name: "Добавить задачу" }).tap();
  const sheet = page.locator("div.z-50").last();
  await sheet.locator('input[placeholder="Например: созвон с командой"]').fill("Защита курсовой");
  await sheet.getByRole("button", { name: "09:00" }).tap();
  await sheet.getByRole("button", { name: "Сохранить" }).tap();
  await page.waitForTimeout(800);

  await checkText(section.locator(".glass-panel"), "Защита курсовой", "задача встала в выбранный день");
  await checkText(section.locator(".glass-panel"), "09:00", "и именно на выбранный час");

  // Вернулись на сегодня — чужого дня здесь быть не должно.
  await section.locator("header").getByRole("button", { name: "Сегодня" }).tap();
  await page.waitForTimeout(700);
  check(
    !(await section.locator(".glass-panel").innerText()).includes("Защита курсовой"),
    "в сегодняшнем дне этой задачи нет — она принадлежит выбранному дню",
  );

  await browser.close();
});

test("Календарь: сетка часов открывается на текущем часе", async () => {
  const user = await newUser({
    state: {
      todos: [todo("e2e-t-now", "Лекция по сетям", todayKey(), { hour: 9, minute: 0, duration: 60 })],
    },
  });
  const { browser, page } = await session({ user });
  await openSection(page, "/calendar");
  await page.locator('[data-section="calendar"] .glass-panel').waitFor({ timeout: 20_000 });
  // прокрутка ставится не сразу: раздел домонтируется и меряет себя сам
  await page.waitForTimeout(1200);

  const view = await page.evaluate(() => {
    const box = document.querySelector('[data-section="calendar"] .glass-panel');
    const hour = new Date().getHours();
    const row = box?.querySelector(`[data-hour="${hour}"]`);
    return {
      hour,
      scrollTop: box?.scrollTop ?? -1,
      clientHeight: box?.clientHeight ?? 0,
      scrollHeight: box?.scrollHeight ?? 0,
      rowTop: row ? row.offsetTop : null,
      rowHeight: row ? row.offsetHeight : null,
    };
  });

  if (view.rowTop === null) {
    // Ночные часы сетка по умолчанию не расписывает (сон), показывать
    // нечего — тогда она честно стоит в начале дня.
    check(view.hour < 6, `строки текущего часа нет только ночью (час ${view.hour})`);
    check(view.scrollTop === 0, "ночью сетка открыта с начала дня");
  } else {
    check(
      view.rowTop >= view.scrollTop - 4 &&
        view.rowTop + view.rowHeight <= view.scrollTop + view.clientHeight + 4,
      `строка ${view.hour}:00 видна без прокрутки руками ` +
        `(scrollTop ${view.scrollTop}, строка ${view.rowTop}..${view.rowTop + view.rowHeight}, окно ${view.clientHeight})`,
    );
    // Если текущий час ниже первого экрана сетки — она обязана была
    // доехать сама, а не остаться на 06:00.
    if (view.rowTop + view.rowHeight > view.clientHeight) {
      check(view.scrollTop > 0, "сетка сама доехала до текущего часа, а не осталась на 06:00");
    } else {
      check(true, "текущий час и так на первом экране сетки");
    }
  }

  await browser.close();
});

test("Календарь: «Выгрузить в календарь» отдаёт файл .ics с парами", async () => {
  // Кнопка живёт в настройках (SettingsContent), хотя относится к расписанию.
  const today = todayKey();
  const user = await newUser({
    state: {
      todos: [
        todo("e2e-ics-1", "Cloud Computing — практика", today, { hour: 13, minute: 0, duration: 90 }),
      ],
    },
  });
  const { browser, page } = await session({ user });
  await openSection(page, "/settings");

  const button = page.getByRole("button", { name: /Выгрузить в календарь/ });
  await checkVisible(button, "в настройках есть выгрузка расписания");

  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 20_000 }),
    button.tap(),
  ]);
  check(
    download.suggestedFilename().endsWith(".ics"),
    `скачался файл календаря (${download.suggestedFilename()})`,
  );

  const path = await download.path();
  const text = await (await import("node:fs/promises")).readFile(path, "utf8");
  check(text.startsWith("BEGIN:VCALENDAR"), "внутри настоящий календарь");
  check(text.includes("Cloud Computing"), "в файле есть задача из расписания");

  await browser.close();
});

/* ════════════════════════  Прогресс  ════════════════════════ */

test("Прогресс: видны уровень с опытом, свод по времени и график по часам", async () => {
  const today = todayKey();
  const closedAt = Date.now() - 2 * 60 * 60 * 1000;
  const done = action("e2e-done-1", "Разбор конспекта", "learning");

  const user = await newUser({
    state: {
      plan: [
        {
          id: "e2e-plan-1",
          actionId: done.id,
          snapshot: done,
          xp: 32,
          date: today,
          completed: true,
          acceptedAt: closedAt - 600_000,
          completedAt: closedAt,
        },
      ],
      todos: [
        todo("e2e-p-1", "Cloud Computing — практика", today, { hour: 13, minute: 0, duration: 90 }),
        todo("e2e-p-2", "Physics: лабораторная", today, { hour: 15, minute: 0, duration: 60 }),
      ],
    },
  });
  const { browser, page } = await session({ user });
  await openSection(page, "/progress");

  const section = page.locator('[data-section="progress"]');
  // Подпись набрана капителью через CSS — на экране это «УРОВЕНЬ».
  await checkText(section, "УРОВЕНЬ", "виден блок уровня");
  const xp = (await section.innerText()).match(/(\d+)\s*XP/);
  check(xp !== null && Number(xp[1]) > 0, `опыт посчитан и показан (${xp?.[0]})`);
  await checkText(section, "до уровня", "видно, сколько осталось до следующего уровня");

  await checkText(section, "Куда уходит неделя", "есть свод по времени");
  await checkText(section, "Cloud Computing", "в своде видно, на что уходят часы");

  await checkText(section, "Когда ты закрываешь дела", "есть график активности по часам");
  await checkText(section, "Чаще всего —", "у графика подписан пиковый час");
  check(
    (await section.locator("span[title*='—']").count()) >= 24,
    "в графике по столбику на каждый час суток",
  );

  await checkText(section, "Характеристики", "видны характеристики персонажа");

  await browser.close();
});

test("Прогресс: закрытое из колоды действие поднимает опыт и счётчик выполненного", async () => {
  const user = await newUser({ state: deckState(DECK) });
  const { browser, page } = await session({ user });
  await openSection(page, "/progress");

  const section = page.locator('[data-section="progress"]');
  const before = (await section.innerText()).match(/(\d+)\s*XP/);
  check(before !== null && Number(before[1]) === 0, `на старте опыта нет (${before?.[0]})`);

  await goTab(page, "Главная");
  await waitForDeck(page);
  const taken = await topTitle(page);
  await swipe(page, "right");
  await waitActiveTask(page);
  await checkText(page.locator("body"), "Сделал ·", `«${taken}» взято в работу`);

  await page.getByRole("button", { name: /Сделал ·/ }).tap();
  await page.waitForTimeout(1200);
  check(
    (await page.getByText("Сделал ·").count()) === 0,
    "задача закрыта — на её месте снова колода",
  );

  await goTab(page, "Прогресс");
  const after = (await section.innerText()).match(/(\d+)\s*XP/);
  check(after !== null && Number(after[1]) > 0, `опыт вырос после выполнения (${after?.[0]})`);

  const metric = page.locator('[data-section="progress"]').getByText("Выполнено", { exact: true });
  await checkText(metric.locator(".."), "1", "счётчик «Выполнено» показывает одно закрытое дело");

  await browser.close();
});
