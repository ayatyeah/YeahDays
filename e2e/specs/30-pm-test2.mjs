/**
 * Ивент «Подготовка к MCQ Test 2» по Project Management.
 *
 * Как у облака: квиз по части — вся часть, 20 вопросов, у каждого неверного
 * варианта своё объяснение. Здесь же — итоговый квиз на 50 вопросов (формат
 * настоящего теста) и фаст-мод. Тест проверяет ход, а не ответы: сами
 * вопросы и правила покрыты юнит-тестами содержимого.
 */

import { check, newUser, openSection, session, test } from "../harness.mjs";

test("PM: ивент в списке, семь лекций, конспект со схемой переводится, квиз по части — 20 вопросов с разбором", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, "/events");
  await page.getByRole("link", { name: /Project Management/ }).tap();
  await page.getByText("Готовность к квизу").waitFor({ timeout: 15_000 });
  const map = await page.locator("body").innerText();
  check(/Lecture 10|Лекция 10/.test(map), "в маршруте есть лекция 10");
  check(/Lecture 4|Лекция 4/.test(map), "в маршруте есть лекция 4");
  check(map.includes("50 вопросов"), "итоговый квиз — 50 вопросов");

  await page.getByRole("button", { name: "Начать с первой части" }).tap();
  await page.locator("article").waitFor({ timeout: 10_000 });
  check((await page.locator("article table").count()) >= 1, "в конспекте первой части есть таблица");
  check((await page.locator("article svg[role=img]").count()) >= 1, "в конспекте первой части есть схема");
  await page.getByRole("button", { name: "Перевести на русский" }).tap();
  await page.getByRole("button", { name: /Показать оригинал/ }).waitFor({ timeout: 10_000 });
  check(true, "конспект переводится на русский");

  await page.getByRole("button", { name: /Начать квиз по этой части · 20 вопросов/ }).tap();
  await page.getByText("Вопрос 1 из 20").waitFor({ timeout: 10_000 });
  await page.locator("section button[lang=en]").first().tap();
  const feedback = page.getByRole("status").filter({ hasText: /Верно|Неверно/ });
  await feedback.waitFor({ timeout: 10_000 });
  check(((await feedback.innerText()).match(/✗/g) ?? []).length >= 1, "под ответом разобраны неверные варианты");
  for (let i = 1; i <= 20; i++) {
    if (i > 1) {
      await page.getByText(`Вопрос ${i} из 20`).waitFor({ timeout: 10_000 });
      await page.locator("section button[lang=en]").first().tap();
      await page.getByRole("status").filter({ hasText: /Верно|Неверно/ }).waitFor({ timeout: 10_000 });
    }
    await page.getByRole("button", { name: i === 20 ? "Завершить квиз" : "Дальше", exact: true }).tap();
  }
  await page.getByText(/Верных ответов: \d+ из 20/).waitFor({ timeout: 10_000 });
  await page.getByRole("button", { name: "К маршруту" }).tap();
  await page.getByText(/Шагов пройдено:\s*1 из/).waitFor({ timeout: 10_000 });
  check(true, "квиз части засчитан в маршрут");
  await browser.close();
});

test("PM: «Учить вопросами» без конспекта, ошибки возвращаются; пробный тест — 50 вопросов на время, итог в баллах из 18", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  page.on("dialog", (d) => void d.accept());
  await openSection(page, "/events");
  await page.getByRole("link", { name: /Project Management/ }).tap();
  await page.getByText("Не хочешь читать конспекты?").waitFor({ timeout: 15_000 });

  await page.getByRole("button", { name: "Начать · 10 вопросов" }).tap();
  await page.getByRole("button", { name: "Начать · 10 вопросов" }).tap();
  await page.getByText(/^Вопрос 1 из 10$/).waitFor({ timeout: 10_000 });
  let wrong = 0;
  for (let i = 1; i < 30; i++) {
    await page.locator("section button[lang=en]").first().tap();
    const status = page.getByRole("status").filter({ hasText: /Верно|Неверно/ });
    await status.waitFor({ timeout: 10_000 });
    if ((await status.innerText()).includes("вопрос вернётся")) wrong++;
    const last = page.getByRole("button", { name: "Итоги раунда" });
    if (await last.count()) {
      await last.tap();
      break;
    }
    await page.getByRole("button", { name: "Дальше", exact: true }).tap();
  }
  await page.getByText("Раунд закончен").waitFor({ timeout: 10_000 });
  check(true, `раунд пройден, ошибок вернулось: ${wrong}`);
  const body = await page.locator("body").innerText();
  check(/Освоено \d+ из \d+/.test(body), "видно, сколько освоено");

  await page.getByRole("button", { name: "⏱ Пробный тест" }).tap();
  await page.getByText(/^Вопрос 1 из 50$/).waitFor({ timeout: 10_000 });
  check((await page.getByRole("timer").innerText()).includes("50:00") || (await page.getByRole("timer").innerText()).includes("49:"), "таймер на 50 минут");
  for (let i = 0; i < 3; i++) {
    await page.locator("section button[lang=en]").first().tap();
    await page.getByRole("button", { name: "Дальше →" }).tap();
  }
  check((await page.locator("body").innerText()).includes("отвечено 3 из 50"), "счётчик ответов");
  await page.getByRole("button", { name: "Сдать тест" }).last().tap();
  await page.getByText(/из 18$/).first().waitFor({ timeout: 10_000 });
  check((await page.locator("body").innerText()).includes("Разбор ошибок"), "после теста — разбор ошибок");
  await browser.close();
});

test("PM: «Твой маршрут» — семь лекций и итоговый квиз; лента роликов с персонажами листается, после каждого ролика — «Проверь себя»", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, "/learn");
  const hubRoute = page.getByRole("region", { name: "Твой маршрут" });
  await hubRoute.waitFor({ timeout: 15_000 });
  check((await hubRoute.innerText()).includes("0 из 8 завершено"), "в «Учёбе» — маршрут ивента: 8 остановок");
  check(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), "лента маршрута не растягивает «Учёбу» вбок");

  await openSection(page, "/events");
  await page.getByRole("link", { name: /Project Management/ }).tap();
  const route = page.getByRole("region", { name: "Твой маршрут" });
  await route.waitFor({ timeout: 15_000 });
  check((await route.locator("li").count()) === 8, "в маршруте ивента 8 остановок");
  check((await route.locator('li[aria-current="step"]').innerText()).includes("Затраты и группы"), "текущая остановка — первая лекция");

  await page.getByRole("button", { name: "🎬 Лента" }).first().tap();
  // Сначала выбор: все ролики, лекция или часть.
  await page.getByRole("heading", { name: "🎬 Ролики" }).waitFor({ timeout: 15_000 });
  await page.getByRole("button", { name: "▶ Смотреть все" }).tap();
  const feed = page.getByRole("dialog", { name: "Лента коротких видео" });
  await feed.waitFor({ timeout: 10_000 });
  await feed.locator('section[data-kind="video"][data-id="pm-l4-p1-v1"]').waitFor({ timeout: 10_000 });
  check((await feed.locator("section[data-index]").first().getAttribute("data-kind")) === "video", "лента начинается с ролика с персонажами");
  await feed.locator('section[data-id="pm-l4-p1-v1"] img[src^="/cast/"]').first().waitFor({ timeout: 10_000 });
  check(true, "в ролике — персонажи");
  await feed.getByRole("button", { name: "Сохранить" }).first().tap();
  check((await feed.getByRole("button", { name: /♥ 1/ }).count()) === 1, "клип сохранён ♥");
  await feed.getByRole("button", { name: /♥ 1/ }).tap();
  await feed.locator('section[data-id="pm-l4-p1-v1"]').waitFor({ timeout: 10_000 });
  check((await feed.locator("section[data-index]").count()) === 1, "в сохранённых — сохранённый ролик");
  await feed.getByRole("button", { name: /♥ 1/ }).tap();
  await feed.locator('section[data-id="check:pm-l4-p1-v1"]').waitFor({ state: "attached", timeout: 10_000 });
  // Сразу после ролика — «Проверь себя»: два вопроса по его теме.
  check((await feed.locator("section[data-index]").nth(1).getAttribute("data-id")) === "check:pm-l4-p1-v1", "после ролика — карточка «Проверь себя»");
  await feed.locator("div.snap-y").evaluate((el) => el.scrollTo({ top: el.clientHeight * 1 }));
  await feed.getByText(/Проверь себя/).first().waitFor({ timeout: 10_000 });
  await feed.locator('section[data-id="check:pm-l4-p1-v1"] button[lang=en]').first().tap();
  await feed.getByRole("status").filter({ hasText: /Верно|Неверно/ }).waitFor({ timeout: 10_000 });
  await feed.getByRole("button", { name: "Следующий вопрос →" }).tap();
  await feed.locator('section[data-id="check:pm-l4-p1-v1"] button[lang=en]').first().tap();
  await feed.getByText(/Итог: \d из 2/).waitFor({ timeout: 10_000 });
  check(true, "два вопроса по теме ролика отвечаются с разбором, в конце — итог");
  await feed.getByRole("button", { name: "Закрыть ленту" }).tap();
  await page.getByRole("heading", { name: "🎬 Ролики" }).waitFor({ timeout: 10_000 });
  check(true, "из ленты — обратно к выбору роликов");
  await page.getByRole("button", { name: "← К маршруту" }).tap();
  await route.waitFor({ timeout: 10_000 });
  await browser.close();
});

test("PM: ролики по лекциям и частям; scroll-mode — конспект экранами, тест части засчитывается", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, "/events");
  await page.getByRole("link", { name: /Project Management/ }).tap();
  await page.getByRole("region", { name: "Твой маршрут" }).waitFor({ timeout: 15_000 });

  // Выбор роликов: все 78, семь лекций, у каждой части — свои.
  await page.getByRole("button", { name: "🎬 Лента" }).first().tap();
  await page.getByRole("heading", { name: "🎬 Ролики" }).waitFor({ timeout: 15_000 });
  check(await page.getByText(/^78 видео · \d+ мин$/).isVisible(), "всего 78 роликов");
  check((await page.locator('section[aria-label^="Лекция "]').count()) === 7, "семь лекций с роликами");
  const l5 = page.locator('section[aria-label="Лекция 5"]');
  await l5.getByRole("button", { name: /Часть 2/ }).tap();
  const feed = page.getByRole("dialog", { name: "Лента коротких видео" });
  await feed.locator('section[data-kind="video"]').first().waitFor({ timeout: 10_000 });
  const ids = await feed.locator('section[data-kind="video"]').evaluateAll((els) => els.map((el) => el.getAttribute("data-id")));
  check(ids.length === 3 && ids.every((id) => id?.startsWith("pm-l5-p2-")), `в ленте части — только её 3 ролика (${ids.join(", ")})`);
  check(await feed.getByText(/🎬 Лекция 5 · часть 2 · /).isVisible(), "сверху подписано, что листаешь");
  await feed.getByRole("button", { name: "Закрыть ленту" }).tap();
  await page.getByRole("button", { name: "← К маршруту" }).tap();
  await page.getByRole("button", { name: "🎬 Ролики лекции · 12 видео" }).first().waitFor({ timeout: 10_000 });
  check(true, "у лекции на маршруте — кнопка её роликов");

  // Scroll-mode с маршрута: первая непройденная часть, конспект экранами, потом тест.
  await page.getByRole("button", { name: "📜 Scroll-mode" }).first().tap();
  const scroll = page.getByRole("dialog", { name: "Scroll-mode" });
  await scroll.locator('section[data-kind="cover"]').first().waitFor({ timeout: 15_000 });
  check(await scroll.getByText("Лекция 4 · часть 1 из 4").first().isVisible(), "начинается с первой части первой лекции");
  const box = scroll.locator("div.snap-y");
  const goTo = (index) => box.evaluate((el, i) => { el.scrollTop = i * el.clientHeight; }, index);
  await goTo(1);
  await scroll.locator('section[data-kind="page"]').first().locator("h2, li, p").first().waitFor({ timeout: 10_000 });
  check((await scroll.locator('section[data-kind="page"]').count()) >= 2, "конспект части — несколько экранов");
  const kinds = await scroll.locator("section[data-index]").evaluateAll((els) => els.map((el) => el.getAttribute("data-kind")));
  const first = kinds.indexOf("question");
  check(kinds[first - 1] === "test" && kinds.slice(first, first + 20).every((k) => k === "question") && kinds[first + 20] === "result", "после конспекта — тест части: 20 вопросов и итог");
  for (let k = 0; k < 20; k++) {
    await goTo(first + k);
    const card = scroll.locator(`section[data-index="${first + k}"]`);
    await card.locator("button[lang=en]").first().tap({ timeout: 10_000 });
    await card.getByRole("status").waitFor({ timeout: 10_000 });
  }
  await goTo(first + 20);
  await scroll.locator(`section[data-index="${first + 20}"]`).getByText(/^\d+ из 20$/).waitFor({ timeout: 10_000 });
  check(true, "все 20 вопросов отвечены — итог теста");
  await scroll.getByRole("button", { name: "Закрыть scroll-mode" }).tap();
  const partRow = page.locator('section[id="route-pm-l4"] li').first();
  await partRow.waitFor({ timeout: 10_000 });
  check(/\d+%/.test(await partRow.innerText()), "результат теста засчитан в маршрут части");

  // Режим запоминается: часть открывается в scroll-mode; «Обычный» возвращает страницу конспекта.
  await partRow.locator("button").first().tap();
  await scroll.waitFor({ timeout: 10_000 });
  await scroll.getByRole("button", { name: "📖 Обычный" }).tap();
  await page.getByRole("button", { name: /Начать квиз по этой части/ }).waitFor({ timeout: 10_000 });
  check(true, "переключатель возвращает обычный конспект");
  await page.getByRole("button", { name: "← К маршруту" }).tap();
  await partRow.locator("button").first().tap();
  await page.getByRole("button", { name: /Начать квиз по этой части/ }).waitFor({ timeout: 10_000 });
  check((await scroll.count()) === 0, "выбор «Обычный» запомнился");
  await browser.close();
});

test("PM: scroll-mode запоминает место — экран конспекта и недоотвеченный тест", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, "/events");
  await page.getByRole("link", { name: /Project Management/ }).tap();
  await page.getByRole("region", { name: "Твой маршрут" }).waitFor({ timeout: 15_000 });
  const scroll = page.getByRole("dialog", { name: "Scroll-mode" });
  const box = scroll.locator("div.snap-y");
  const goTo = (index) => box.evaluate((el, i) => { el.scrollTop = i * el.clientHeight; }, index);
  const where = () => box.evaluate((el) => Math.round(el.scrollTop / el.clientHeight));
  const reopen = async () => {
    await scroll.getByRole("button", { name: "Закрыть scroll-mode" }).tap();
    await page.getByRole("button", { name: "📜 Scroll-mode" }).first().tap();
    await scroll.locator("section[data-index]").first().waitFor({ state: "attached", timeout: 15_000 });
    await page.waitForTimeout(800);
  };

  await page.getByRole("button", { name: "📜 Scroll-mode" }).first().tap();
  await scroll.locator('section[data-kind="cover"]').first().waitFor({ timeout: 15_000 });
  await goTo(3);
  await scroll.locator('section[data-index="3"]').locator("h2, p").first().waitFor({ timeout: 10_000 });
  await page.waitForTimeout(800);
  await reopen();
  check((await where()) === 3, "вернулся на тот же экран конспекта");
  check(await scroll.getByText("Продолжаешь с места, где остановился").isVisible(), "плашка: продолжаешь с места");

  // Два ответа в тесте — выйти — вернуться: те же вопросы, ответы на месте.
  const kinds = await scroll.locator("section[data-index]").evaluateAll((els) => els.map((el) => el.getAttribute("data-kind")));
  const first = kinds.indexOf("question");
  const asked = [];
  for (let k = 0; k < 2; k++) {
    await goTo(first + k);
    const card = scroll.locator(`section[data-index="${first + k}"]`);
    asked.push(await card.locator("h2").innerText({ timeout: 10_000 }));
    await card.locator("button[lang=en]").first().tap();
    await card.getByRole("status").waitFor({ timeout: 10_000 });
  }
  await goTo(first + 2);
  await scroll.locator(`section[data-index="${first + 2}"] h2`).waitFor({ timeout: 10_000 });
  await page.waitForTimeout(800);
  await reopen();
  check((await where()) === first + 2, "вернулся на третий вопрос теста");
  await goTo(first);
  const back = scroll.locator(`section[data-index="${first}"]`);
  check((await back.locator("h2").innerText({ timeout: 10_000 })) === asked[0], "тот же вопрос, что был");
  check(await back.getByRole("status").isVisible(), "данный ответ сохранился");
  await browser.close();
});
