/**
 * Research Methods и Cloud Computing после переработки: фаст-мод, квиз-кейс
 * в формате преподавателя (часть A — тест на устройстве, часть B — ИИ) и
 * банк реальных вопросов мидтерма по Cloud.
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

test("RMT: фаст-мод — блок за блоком, отметки переживают перезагрузку", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openEvent(page, RMT);
  await page.getByRole("navigation", { name: "Быстрый доступ" }).getByRole("button", { name: /Фаст-мод/ }).tap();
  await page.getByRole("heading", { name: "⚡ Фаст-мод" }).waitFor({ timeout: 10_000 });
  check(/Прочитано\s*0\s*из\s*\d+/.test(await page.locator("body").innerText()), "в начале ничего не прочитано");
  await page.getByRole("button", { name: "Понятно — дальше →" }).first().tap();
  await page.getByText(/Прочитано\s*1\s*из/).waitFor({ timeout: 5_000 });
  check(true, "«Дальше» отмечает блок прочитанным и открывает следующий");
  await page.reload({ waitUntil: "networkidle" });
  await page.getByText("Готовность к квизу").waitFor({ timeout: 15_000 });
  await page.getByRole("button", { name: "Продолжить фаст-мод" }).tap();
  await page.getByText(/Прочитано\s*1\s*из/).waitFor({ timeout: 5_000 });
  check(true, "после перезагрузки отметка на месте, кнопка зовёт продолжить");
  await browser.close();
});

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
  await page.getByText(/Пробный квиз-кейс · 8 вариантов/).waitFor({ timeout: 10_000 });
  await page.getByRole("button", { name: /SafeDrive/ }).first().tap();
  await page.getByText(/Part A/).first().waitFor({ timeout: 10_000 });

  const before = await page.getByRole("status").count();
  await page.locator("button[lang=en][aria-pressed]").first().tap();
  await page.getByRole("status").nth(before).waitFor({ timeout: 5_000 });
  const verdict = await page.getByRole("status").nth(before).innerText();
  check(/Верно|Неверно/.test(verdict) && /из 0[.,]5/.test(verdict), "тестовый подпункт проверен сразу: верно/неверно и баллы из 0.5");
  check(await page.locator("button[lang=en][aria-pressed]").first().isDisabled(), "выбор окончательный — как на квизе");
  check(graded.length === 0, "часть A не ходит в ИИ");

  const box = page.getByRole("textbox").first();
  await box.fill("Development output: the SafeDrive prototype. Research output: the comparison of fatigue between the two groups.");
  await page.getByRole("checkbox").first().check();
  await page.getByRole("button", { name: "Проверить ИИ" }).first().tap();
  await page.getByRole("status").filter({ hasText: /ИИ: 0[.,]5 из 0[.,]5/ }).waitFor({ timeout: 10_000 });
  check(graded.length === 1 && /rmv1-b/.test(graded[0].taskId), "часть B проверяет ИИ по подпункту варианта");
  await browser.close();
});

test("Cloud: модули Cloud Foundations, реальные вопросы мидтерма и фаст-мод на месте", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openEvent(page, CLOUD);
  const text = await page.locator("body").innerText();
  check(["Lecture 6", "Lecture 10", "Real midterm questions"].every((t) => text.includes(t)) || /Лекция 6/.test(text), "в маршруте новые лекции и банк реальных вопросов");
  check(/Фаст-мод · ≈ \d/.test(text), "есть карточка фаст-мода");
  await page.getByRole("navigation", { name: "Быстрый доступ" }).getByRole("button", { name: /Фаст-мод/ }).tap();
  await page.getByRole("heading", { name: "⚡ Фаст-мод" }).waitFor({ timeout: 10_000 });
  check((await page.locator("ol > li").count()) >= 6, "в фаст-моде не меньше шести блоков");
  await browser.close();
});
