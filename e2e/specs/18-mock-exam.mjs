/**
 * Пробный мидтерм: открытые вопросы с проверкой ИИ.
 *
 * Настоящий OpenAI в тестах не зовём (у сервера тестов нет ключа): ответ
 * проверки подменяем в браузере. Проверяем то, что делает приложение:
 * черновик переживает перезагрузку, без согласия ответ не уходит, оценка
 * показывается с разбором, эталон и критерии открываются.
 */

import { check, newUser, openSection, session, test } from "../harness.mjs";

const EVENT = "/events/computer-vision-midterm";

test("Пробный мидтерм: ответ сохраняется, без согласия не уходит, ИИ ставит баллы с разбором, эталон открывается", async () => {
  const user = await newUser();
  // ответ проверки подменяем через page.route, а под service worker'ом он до подмены не доходит
  const { browser, page } = await session({ user, serviceWorkers: "block" });
  const sent = [];
  await page.route("**/api/study-events/grade", async (route) => {
    if (route.request().method() === "GET") return route.fulfill({ json: { available: true } });
    sent.push(JSON.parse(route.request().postData() ?? "{}"));
    return route.fulfill({ json: { score: 4, points: 6, verdict: "partial", correct: ["Resize to a fixed size"], missing: ["A reason for denoising"], mistakes: [], tip: "Tie every operation to the scenario." } });
  });

  await openSection(page, EVENT);
  await page.getByText("Готовность к квизу").waitFor({ timeout: 15_000 });
  await page.getByText(/Пробный мидтерм · \d+ вариантов/).waitFor({ timeout: 10_000 });
  await page.getByRole("button", { name: /Variant 1|Вариант 1/ }).first().tap();
  await page.getByText(/Question 1/).first().waitFor({ timeout: 10_000 });

  const first = page.getByRole("textbox").first();
  await first.fill("Resize every image to 224x224; Gaussian blur against noise; normalize brightness.");
  await page.reload({ waitUntil: "networkidle" });
  await page.getByText("Готовность к квизу").waitFor({ timeout: 15_000 });
  await page.getByRole("button", { name: /Variant 1|Вариант 1/ }).first().tap();
  check((await page.getByRole("textbox").first().inputValue()).startsWith("Resize every image"), "черновик ответа пережил перезагрузку");

  const button = page.getByRole("button", { name: "Проверить ИИ" }).first();
  check(await button.isDisabled(), "без согласия на отправку в OpenAI проверить нельзя");
  await page.getByRole("checkbox").first().check();
  await button.tap();
  const verdict = page.getByRole("status").filter({ hasText: /ИИ: 4 из 6/ });
  await verdict.waitFor({ timeout: 10_000 });
  const text = await verdict.innerText();
  check(text.includes("Не хватает") && text.includes("A reason for denoising"), "оценка пришла с разбором, чего не хватило");
  check(sent.length === 1 && sent[0].consent === "event-grade-v1" && sent[0].taskId && sent[0].answer.startsWith("Resize"), "на проверку ушли id задания, ответ и отметка о согласии — без критериев");

  await page.getByRole("button", { name: "Эталон и критерии" }).first().tap();
  await page.getByText("Как написать на экзамене").first().waitFor({ timeout: 5_000 });
  check(true, "эталон и критерии открываются");
  await browser.close();
});
