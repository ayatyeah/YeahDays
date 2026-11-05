/**
 * Research Methods и Cloud Computing после переработки: фаст-мод, квиз-кейс
 * в формате преподавателя (часть A — тест на устройстве, часть B — ИИ) и
 * лекции Cloud.
 *
 * Ответ ИИ на часть B подменяем в браузере, как в остальных сценариях
 * пробных экзаменов: у сервера тестов нет ключа OpenAI.
 */

import { check, newUser, openSection, session, test } from "../harness.mjs";

const RMT = "/events/research-methods-quiz-1";
const CLOUD = "/events/cloud-computing-midterm";

async function openEvent(page, path) {
  await openSection(page, path);
  await page.getByText("Готовность к квизу").waitFor({ timeout: 15_000 });
}

test("RMT: квиз-кейс — часть A проверяется сразу с разбором, часть B уходит ИИ", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user, serviceWorkers: "block" });
  const graded = [];
  await page.route("**/api/study-events/grade", async (route) => {
    if (route.request().method() === "GET") return route.fulfill({ json: { available: true } });
    graded.push(JSON.parse(route.request().postData() ?? "{}"));
    return route.fulfill({ json: { score: 0.5, points: 0.5, verdict: "full", correct: ["Names both outputs"], missing: [], mistakes: [], tip: "" } });
  });
  await openEvent(page, RMT);
  await page.getByText(/Пробный квиз-кейс · 7 вариантов/).waitFor({ timeout: 10_000 });
  await page.getByRole("button", { name: /MedTime/ }).first().tap();
  await page.getByText(/Part A/).first().waitFor({ timeout: 10_000 });

  const before = await page.getByRole("status").count();
  await page.locator("button[lang=en][aria-pressed]").first().tap();
  await page.getByRole("status").nth(before).waitFor({ timeout: 5_000 });
  const verdict = await page.getByRole("status").nth(before).innerText();
  check(/Верно|Неверно/.test(verdict) && /из 0[.,]5/.test(verdict), "тестовый подпункт проверен сразу: верно/неверно и баллы из 0.5");
  check(await page.locator("button[lang=en][aria-pressed]").first().isDisabled(), "выбор окончательный — как на квизе");
  check(graded.length === 0, "часть A не ходит в ИИ");

  const box = page.getByRole("textbox").first();
  await box.fill("Development output: the MedTime prototype. Research output: the comparison of adherence between the two groups.");
  await page.getByRole("checkbox").first().check();
  await page.getByRole("button", { name: "Проверить ИИ" }).first().tap();
  await page.getByRole("status").filter({ hasText: /ИИ: 0[.,]5 из 0[.,]5/ }).waitFor({ timeout: 10_000 });
  check(graded.length === 1 && /rmv2-b/.test(graded[0].taskId), "часть B проверяет ИИ по подпункту варианта");
  await browser.close();
});

test("Cloud: лекции и итоговая тренировка", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  try {
    await openEvent(page, CLOUD);
    const text = await page.locator("body").innerText();
    check(/Lecture 6|Лекция 6/.test(text) && /Lecture 10|Лекция 10/.test(text), "лекции доступны");
    check(!/Real midterm questions|Реальные вопросы мидтерма/.test(text), "только лекционные разделы");
  } finally { await browser.close(); }
});
