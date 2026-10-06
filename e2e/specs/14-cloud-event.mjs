/**
 * Ивент «Подготовка к мидтерму» по Cloud Computing.
 *
 * Здесь квиз по части — это вся часть: 20 вопросов, и у каждого неверного
 * варианта своё объяснение. Тест проверяет ход (ответ на вопрос не знает),
 * сами вопросы и правила покрыты юнит-тестами содержимого.
 */

import { check, newUser, openSection, session, test } from "../harness.mjs";

const EVENT = "/events/cloud-computing-midterm";

test("Облако: ивент в списке, конспект со схемами переводится, квиз по части — 20 вопросов с разбором вариантов", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, "/events");
  await page.getByRole("link", { name: /Cloud Computing/ }).tap();
  await page.getByText("Готовность к квизу").waitFor({ timeout: 15_000 });
  const map = await page.locator("body").innerText();
  check(map.includes("Lecture 5") || map.includes("Лекция 5"), "в маршруте пять лекций");

  await page.getByRole("button", { name: "Начать с первой части" }).tap();
  await page.locator("article").waitFor({ timeout: 10_000 });
  check((await page.locator("article table").count()) >= 2, "в конспекте первой части есть таблицы");
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
