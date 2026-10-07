/**
 * Ивенты раздела «Учёба»: общий для всех ивент «Подготовка к квизу» —
 * конспект по частям, перевод, квиз после части, сохранение результата.
 *
 * Содержимое ивента статичное, ИИ не участвует, так что набор ничего не
 * тратит. Верные ответы тест не знает и знать не должен: он проверяет ход
 * квиза (вопросы меняются, результат считается и сохраняется), а сами
 * вопросы и правила подсчёта покрыты src/lib/events/events.test.ts.
 */

import { check, newUser, openSection, session, sql, test } from "../harness.mjs";

const EVENT = "/events/research-methods-quiz-1";

/** Пройти квиз, каждый раз выбирая первый вариант; вернуть тексты вопросов. */
async function passQuiz(page, total) {
  const questions = [];
  for (let i = 1; i <= total; i++) {
    await page.getByText(`Вопрос ${i} из ${total}`).waitFor({ timeout: 10_000 });
    questions.push(await page.locator("section h2").first().innerText());
    await page.locator("section button[lang=en]").first().tap();
    await page.getByRole("status").filter({ hasText: /Верно|Неверно/ }).waitFor({ timeout: 10_000 });
    await page.getByRole("button", { name: i === total ? "Завершить квиз" : "Дальше", exact: true }).tap();
  }
  return questions;
}

test("Ивенты: из «Учёбы» нахожу ивент, читаю часть лекции и перевожу конспект на русский", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, "/learn");

  await page.getByRole("link", { name: /ивенты/i }).first().tap();
  await page.waitForURL((u) => u.pathname === "/events", { timeout: 15_000 });
  check(true, "плашка «Ивенты» в «Учёбе» ведёт к списку ивентов");

  await page.getByRole("link", { name: /Подготовка к квизу №1/ }).tap();
  await page.getByText("Готовность к квизу").waitFor({ timeout: 15_000 });
  check((await page.locator("body").innerText()).includes("не пройдено"), "новый человек видит маршрут с непройденными шагами");

  await page.getByRole("button", { name: "Начать с первой части" }).tap();
  await page.getByRole("heading", { name: "What research is and the researcher's mindset" }).waitFor({ timeout: 10_000 });
  check((await page.locator("article").innerText()).includes("Myth and reality"), "конспект открывается на английском — на языке квиза");

  await page.getByRole("button", { name: "Перевести на русский" }).tap();
  await page.getByText("Миф и реальность").waitFor({ timeout: 10_000 });
  check(true, "одна кнопка переводит конспект на русский");
  await page.getByRole("button", { name: /Показать оригинал/ }).tap();
  await page.getByText("Myth and reality").waitFor({ timeout: 10_000 });
  check(true, "и обратно на английский");
  await browser.close();
});

test("Ивенты: квиз по части считается, сохраняется и при повторе даёт другой набор вопросов", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, EVENT);

  await page.getByRole("button", { name: "Начать с первой части" }).tap();
  await page.getByRole("button", { name: /Начать квиз по этой части · 8 вопросов/ }).tap();

  const music = page.getByRole("button", { name: /Музыка/ });
  check((await music.innerText()).includes("вкл"), "во время квиза музыка включена по умолчанию");
  await music.tap();
  check((await music.innerText()).includes("выкл"), "музыку можно выключить одной кнопкой");

  const first = await passQuiz(page, 8);
  await page.getByText(/Верных ответов: \d из 8/).waitFor({ timeout: 10_000 });
  check(new Set(first).size === 8, "в квизе 8 разных вопросов");

  const stored = await page.evaluate(() => Object.entries(localStorage).filter(([k]) => k.startsWith("yg-event:")).map(([, v]) => JSON.parse(v)));
  check(stored.length === 1 && stored[0]["rm-w1-p1"]?.attempts === 1, "результат попытки сохранён за этим аккаунтом");

  await page.getByRole("button", { name: /Пройти ещё раз/ }).tap();
  const second = await passQuiz(page, 8);
  check(first.join("|") !== second.join("|"), "при повторе вопросы идут в другом порядке или другом составе");

  await page.getByRole("button", { name: "К маршруту" }).tap();
  await page.getByText("Шагов пройдено: 1 из").waitFor({ timeout: 10_000 });
  const row = page.getByRole("button", { name: /Часть 1\./ }).first();
  check(/\d+%/.test(await row.innerText()), "в маршруте у пройденной части стоит процент вместо «не пройдено»");

  await page.reload({ waitUntil: "networkidle" });
  await page.getByText("Шагов пройдено: 1 из").waitFor({ timeout: 10_000 });
  check(true, "после перезагрузки страницы прогресс на месте");
  await browser.close();
});

/* ────────────────  Шпаргалка, карточки, план, рейтинг, синхронизация  ──────────────── */

/** Подружить двух тестовых людей так же, как это делает приложение: связь в обе стороны и имя в публичной сводке. */
function befriend(a, b) {
  for (const [x, y] of [[a, b], [b, a]]) {
    sql(`insert into "Friendship"("userId", "friendId", "createdAt") values ('${x.id}', '${y.id}', now() at time zone 'utc')`);
    sql(`insert into "PublicStats"("userId", name, "updatedAt") values ('${x.id}', '${x.name}', now() at time zone 'utc') on conflict ("userId") do nothing`);
  }
}

test("Ивенты: шпаргалка открывается и переводится, карточки терминов проходятся до конца колоды", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, EVENT);

  await page.getByRole("button", { name: "Шпаргалка на одну страницу" }).tap();
  await page.getByText("AND narrows, OR broadens").waitFor({ timeout: 10_000 });
  await page.getByRole("button", { name: "Перевести на русский" }).tap();
  await page.getByText("AND сужает, OR расширяет").waitFor({ timeout: 10_000 });
  check(true, "шпаргалка есть на английском и на русском");

  await page.getByRole("button", { name: "← К маршруту" }).tap();
  await page.getByRole("button", { name: /Карточки терминов/ }).tap();
  await page.getByText(/Знаю 0 из \d+/).waitFor({ timeout: 10_000 });
  const total = Number((await page.getByText(/Знаю 0 из \d+/).innerText()).match(/из (\d+)/)[1]);

  // Первую карточку откладываем: она должна вернуться, а счётчик — не вырасти.
  const first = await page.locator("section h2").first().innerText();
  await page.getByRole("button", { name: "Показать определение" }).tap();
  await page.getByRole("button", { name: "Ещё повторить" }).tap();
  check((await page.getByText(/Знаю \d+ из/).innerText()).startsWith("Знаю 0"), "отложенная карточка не считается выученной");

  let sawAgain = false;
  for (let i = 0; i < total; i++) {
    if ((await page.locator("section h2").first().innerText()) === first) sawAgain = true;
    await page.getByRole("button", { name: "Показать определение" }).tap();
    await page.getByRole("button", { name: "Знаю", exact: true }).tap();
  }
  check(sawAgain, "отложенная карточка встретилась ещё раз");
  await page.getByText(`Все ${total} терминов разобраны`).waitFor({ timeout: 10_000 });
  check(true, "колода заканчивается, когда каждая карточка получила «Знаю»");
  await browser.close();
});

test("Ивенты: дата квиза раскладывает шаги по дням и добавляет их в мой план", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, EVENT);

  // Дату считаем в самом браузере: «сегодня» у приложения — по его часам,
  // и около полуночи оно может отличаться от «сегодня» у запускающего тест.
  const iso = await page.evaluate(() => {
    const exam = new Date(Date.now() + 5 * 86_400_000);
    return `${exam.getFullYear()}-${String(exam.getMonth() + 1).padStart(2, "0")}-${String(exam.getDate()).padStart(2, "0")}`;
  });
  await page.getByLabel("Дата квиза").fill(iso);
  await page.getByText("До квиза 5 дн.").waitFor({ timeout: 10_000 });
  check((await page.getByText("≈").count()) === 5, "шаги разложены на пять дней до квиза");

  await page.getByRole("button", { name: "Добавить в мой план" }).tap();
  await page.getByText("В план добавлено дней: 5").waitFor({ timeout: 15_000 });
  const todos = await page.evaluate(() => JSON.parse(localStorage.getItem("yeahdays-store")).state.todos);
  const mine = todos.filter((t) => (t.note ?? "").includes("[event:research-methods-quiz-1:"));
  check(mine.length === 5 && mine.every((t) => t.hour === 19), "в плане пять дел на 19:00 — по одному на день");

  // Повторное добавление заменяет прежний план, а не удваивает его.
  await page.getByRole("button", { name: "Добавить в мой план" }).tap();
  await page.waitForTimeout(800);
  const again = await page.evaluate(() => JSON.parse(localStorage.getItem("yeahdays-store")).state.todos.filter((t) => (t.note ?? "").includes("[event:")).length);
  check(again === 5, "пересчёт плана не дублирует дела");
  await browser.close();
});

test("Ивенты: результат уезжает на сервер, друг из рейтинга виден, а мой — только после включения показа", async () => {
  const me = await newUser();
  const friend = await newUser();
  befriend(me, friend);
  sql(`insert into "EventProgress"("userId", "eventId", data, percent, share, "updatedAt") values ('${friend.id}', 'research-methods-quiz-1', '{}'::jsonb, 72, true, now() at time zone 'utc')`);

  const { browser, page } = await session({ user: me });
  await openSection(page, EVENT);
  await page.getByText("Друзей в рейтинге: 1").waitFor({ timeout: 15_000 });
  check((await page.locator("section", { hasText: "Рейтинг друзей" }).last().innerText()).includes("72%"), "друг, включивший показ, виден в рейтинге со своим процентом");

  await page.getByRole("button", { name: "Начать с первой части" }).tap();
  await page.getByRole("button", { name: /Начать квиз по этой части/ }).tap();
  await passQuiz(page, 8);
  await page.getByText(/Верных ответов/).waitFor({ timeout: 10_000 });
  await page.waitForTimeout(1500);
  check(sql(`select share from "EventProgress" where "userId" = '${me.id}'`) === "f", "результат сохранён на сервере, но в рейтинг без согласия не попал");
  check(sql(`select (data->'rm-w1-p1'->>'attempts') from "EventProgress" where "userId" = '${me.id}'`) === "1", "на сервере записана попытка квиза");

  // Сообщение об ошибке в вопросе из разбора ошибок или из самого квиза.
  const report = page.getByRole("button", { name: "Сообщить об ошибке в вопросе" }).first();
  if (await report.count()) {
    await report.tap();
    await page.getByLabel("Что не так с вопросом или ответом?").fill("Проверка: кажется, верным должен быть другой вариант");
    await page.getByRole("button", { name: "Отправить", exact: true }).tap();
    await page.getByText("Спасибо — сообщение отправлено.").waitFor({ timeout: 10_000 });
    check(sql(`select count(*) from "EventReport" where "userId" = '${me.id}'`) === "1", "сообщение об ошибке дошло до сервера");
  }

  await page.getByRole("button", { name: "К маршруту" }).tap();
  await page.getByLabel(/Показывать мою готовность друзьям/).check();
  await page.waitForTimeout(1500);
  check(sql(`select share from "EventProgress" where "userId" = '${me.id}'`) === "t", "после включения показа результат участвует в рейтинге");

  // Второе устройство: чистый браузер того же человека получает прогресс с сервера.
  const second = await session({ user: me });
  await openSection(second.page, EVENT);
  await second.page.getByText("Шагов пройдено: 1 из").waitFor({ timeout: 15_000 });
  check(true, "на втором устройстве прогресс подтянулся с сервера");
  await second.browser.close();
  await browser.close();
});
