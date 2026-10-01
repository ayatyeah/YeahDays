/**
 * Ивенты раздела «Учёба»: общий для всех ивент «Подготовка к квизу» —
 * конспект по частям, перевод, квиз после части, сохранение результата.
 *
 * Содержимое ивента статичное, ИИ не участвует, так что набор ничего не
 * тратит. Верные ответы тест не знает и знать не должен: он проверяет ход
 * квиза (вопросы меняются, результат считается и сохраняется), а сами
 * вопросы и правила подсчёта покрыты src/lib/events/events.test.ts.
 */

import { check, newUser, openSection, session, test } from "../harness.mjs";

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

  await page.getByRole("link", { name: /Ивенты/ }).first().tap();
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
