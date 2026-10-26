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

test("PM: «Твой маршрут» — семь лекций и итоговый квиз; лента коротких видео листается, между клипами — быстрый вопрос", async () => {
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
  const feed = page.getByRole("dialog", { name: "Лента коротких видео" });
  await feed.waitFor({ timeout: 10_000 });
  await feed.getByText(/Затраты и группы · часть 1/).first().waitFor({ timeout: 10_000 });
  check(true, "первый клип — первая часть первой лекции");
  await feed.getByRole("button", { name: "Сохранить" }).first().tap();
  check((await feed.getByRole("button", { name: /♥ 1/ }).count()) === 1, "клип сохранён ♥");
  await feed.locator("div.snap-y").evaluate((el) => el.scrollTo({ top: el.clientHeight * 3 }));
  await feed.getByText(/⚡ Быстрый вопрос/).waitFor({ timeout: 10_000 });
  await feed.locator("button[lang=en]").first().tap();
  await feed.getByRole("status").filter({ hasText: /Верно|Неверно/ }).waitFor({ timeout: 10_000 });
  check(true, "быстрый вопрос в ленте отвечается с разбором");
  await feed.getByRole("button", { name: "Закрыть ленту" }).tap();
  await route.waitFor({ timeout: 10_000 });
  await browser.close();
});
