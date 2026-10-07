/**
 * Ивент «Подготовка к защите проекта» (YeahTrack, Project Management).
 *
 * Он одной команды и открывается только по ссылке: в общем списке ивентов
 * его быть не должно. Внутри — конспект по разделу отчёта с фото из него,
 * квиз части на 15 вопросов и карточки «вопрос комиссии → ответ».
 */

import { check, newUser, openSection, session, test } from "../harness.mjs";

const EVENT = "/events/yeahtrack-defense";

test("Защита: ивент только по ссылке, конспект с фото из отчёта, квиз на 15 вопросов и вопросы комиссии", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, "/events");
  const list = await page.locator("body").innerText();
  // курс выводится заглавными через CSS, а innerText отдаёт текст уже в верхнем регистре
  check(!/yeahtrack/i.test(list) && /cloud computing/i.test(list), "в общем списке ивентов его нет, остальные на месте");

  await openSection(page, EVENT);
  await page.getByText("Готовность к квизу").waitFor({ timeout: 15_000 });
  const map = await page.locator("body").innerText();
  check(map.includes("Block 7") || map.includes("Блок 7"), "по прямой ссылке открывается маршрут из семи блоков");

  await page.getByRole("button", { name: "Начать с первой части" }).tap();
  await page.locator("article").waitFor({ timeout: 10_000 });
  // картинка ленивая: пока до неё не докрутили, у неё нулевая высота
  const photo = page.locator('article img[src*="/events/pm/"]').first();
  await photo.scrollIntoViewIfNeeded();
  await page.waitForFunction((img) => img.complete && img.naturalWidth > 0, await photo.elementHandle(), { timeout: 10_000 });
  check((await page.locator("article table").count()) >= 2, "в конспекте есть таблицы, а фото из отчёта загрузилось");

  await page.getByRole("button", { name: /Начать квиз по этой части · 15 вопросов/ }).tap();
  for (let i = 1; i <= 15; i++) {
    await page.getByText(`Вопрос ${i} из 15`).waitFor({ timeout: 10_000 });
    await page.locator("section button[lang=en]").first().tap();
    await page.getByRole("status").filter({ hasText: /Верно|Неверно/ }).waitFor({ timeout: 10_000 });
    await page.getByRole("button", { name: i === 15 ? "Завершить квиз" : "Дальше", exact: true }).tap();
  }
  await page.getByText(/Верных ответов: \d+ из 15/).waitFor({ timeout: 10_000 });
  await page.getByRole("button", { name: "К маршруту" }).tap();
  await page.getByText(/Шагов пройдено:\s*1 из/).waitFor({ timeout: 10_000 });
  check(true, "квиз части засчитан в маршрут");

  await page.getByRole("button", { name: /^Вопросы комиссии · \d+/ }).tap();
  await page.getByRole("heading", { name: "Вопросы комиссии" }).waitFor({ timeout: 10_000 });
  check(true, "карточки подписаны как вопросы комиссии, а не термины");
  await browser.close();
});
