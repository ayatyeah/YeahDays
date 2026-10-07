/**
 * Ивент «Подготовка к мидтерму» по Computer Vision.
 *
 * Пять лекций и блок практики в формате мидтерма. Тест проверяет ход:
 * ивент в списке, конспект с таблицами переводится, квиз части — 20
 * вопросов с разбором неверных вариантов; в практике — код OpenCV.
 * Сами вопросы и правила покрыты юнит-тестами содержимого.
 */

import { check, newUser, openSection, session, test } from "../harness.mjs";

test("Зрение: ивент в списке, конспект переводится, квиз по части — 20 вопросов, в практике — код OpenCV", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, "/events");
  await page.getByRole("link", { name: /Computer Vision/ }).tap();
  await page.getByText("Готовность к квизу").waitFor({ timeout: 15_000 });
  const map = await page.locator("body").innerText();
  check(/Lecture 5|Лекция 5/.test(map) && /Exam practice|Практика/.test(map), "в маршруте пять лекций и блок практики");

  await page.getByRole("button", { name: "Начать с первой части" }).tap();
  await page.locator("article").waitFor({ timeout: 10_000 });
  check((await page.locator("article table").count()) >= 2, "в конспекте первой части есть таблицы");
  await page.getByRole("button", { name: "Перевести на русский" }).tap();
  await page.getByRole("button", { name: /Показать оригинал/ }).waitFor({ timeout: 10_000 });

  await page.getByRole("button", { name: /Начать квиз по этой части · 20 вопросов/ }).tap();
  for (let i = 1; i <= 20; i++) {
    await page.getByText(`Вопрос ${i} из 20`).waitFor({ timeout: 10_000 });
    await page.locator("section button[lang=en]").first().tap();
    const feedback = page.getByRole("status").filter({ hasText: /Верно|Неверно/ });
    await feedback.waitFor({ timeout: 10_000 });
    if (i === 1) check(((await feedback.innerText()).match(/✗/g) ?? []).length >= 1, "под ответом разобраны неверные варианты");
    await page.getByRole("button", { name: i === 20 ? "Завершить квиз" : "Дальше", exact: true }).tap();
  }
  await page.getByText(/Верных ответов: \d+ из 20/).waitFor({ timeout: 10_000 });
  await page.getByRole("button", { name: "К маршруту" }).tap();
  await page.getByText(/Шагов пройдено:\s*1 из/).waitFor({ timeout: 10_000 });
  check(true, "квиз части засчитан в маршрут");

  await page.getByText(/OpenCV basics and bug hunting|Основы OpenCV/).first().tap();
  await page.locator("article").waitFor({ timeout: 10_000 });
  check((await page.locator("article").innerText()).includes("cv2."), "в практике разобран код OpenCV");
  await browser.close();
});
