/**
 * Практикум Computer Vision и ИИ-помощник в ивенте.
 *
 * Тренажёр, «Найди баг» и песочница работают без сети и без ИИ — их гоняем
 * как есть. Отчёт по варианту и помощника ведёт OpenAI, у тестового сервера
 * ключа нет: ответы подменяем в браузере (под service worker'ом подмена не
 * срабатывает — его блокируем) и проверяем то, что делает приложение.
 */

import { check, newUser, openSection, session, test } from "../harness.mjs";

const EVENT = "/events/computer-vision-midterm";

async function openEvent(page) {
  await openSection(page, EVENT);
  await page.getByText("Готовность к квизу").waitFor({ timeout: 15_000 });
}

/** Значение ползунка: fill() у range в WebKit нет, ставим как браузер. */
async function slide(locator, value) {
  await locator.evaluate((el, v) => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(el, v);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }, String(value));
}

test("Практикум CV: тренажёр проверяет ответ и показывает решение, «Найди баг» ведёт раунд", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openEvent(page);
  const quick = page.getByRole("navigation", { name: "Быстрый доступ" });
  const labels = await quick.getByRole("button").allInnerTexts();
  check(["Пробные варианты · 8", "Тренажёр расчётов", "Найди баг", "Песочница OpenCV", "✦ ИИ-помощник"].every((l) => labels.includes(l)), "под заголовком ивента — быстрый доступ к вариантам, практикуму и помощнику");
  await page.getByText("Практикум").first().scrollIntoViewIfNeeded();

  await quick.getByRole("button", { name: "Тренажёр расчётов" }).tap();
  await page.getByRole("button", { name: "Проверить" }).waitFor({ timeout: 10_000 });
  const prompt = await page.locator("[lang=en]").first().innerText();
  for (const box of await page.getByRole("textbox").all()) await box.fill("-12345");
  await page.getByRole("button", { name: "Проверить" }).tap();
  await page.getByRole("status").filter({ hasText: "Есть ошибки" }).waitFor({ timeout: 5_000 });
  check(true, "заведомо неверный ответ — «есть ошибки»");
  await page.getByRole("button", { name: "Показать решение" }).tap();
  await page.getByRole("button", { name: "Скрыть решение" }).waitFor({ timeout: 5_000 });
  check(true, "решение открывается");
  await page.getByRole("button", { name: "Новая задача →" }).tap();
  await page.waitForTimeout(300);
  check((await page.locator("[lang=en]").first().innerText()) !== prompt, "«Новая задача» даёт другое условие");

  await page.getByRole("button", { name: "← К маршруту" }).tap();
  await page.getByRole("button", { name: "Игра «Найди баг»" }).tap();
  await page.getByRole("button", { name: "Начать раунд" }).tap();
  await page.getByText(/Сниппет\s*1\s*из\s*10/).waitFor({ timeout: 5_000 });
  await page.getByRole("button", { name: "Строка 1", exact: true }).tap();
  await page.getByText("Чем заменить эту строку?").waitFor({ timeout: 5_000 });
  await page.locator("button[lang=en]").first().tap();
  const verdict = page.getByRole("status").filter({ hasText: /Верно!|Почти\./ });
  await verdict.waitFor({ timeout: 5_000 });
  check(/падает с ошибкой|работает, но результат неверный/.test(await verdict.innerText()), "после выбора — разбор: падает код или тихо портит результат");
  await page.getByRole("button", { name: "Следующий сниппет →" }).tap();
  await page.getByText(/Сниппет\s*2\s*из\s*10/).waitFor({ timeout: 5_000 });
  check(true, "раунд идёт дальше");
  await browser.close();
});

test("Песочница OpenCV: картинка обрабатывается, код и shape видны, ошибки — как у cv2", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openEvent(page);
  await page.getByRole("navigation", { name: "Быстрый доступ" }).getByRole("button", { name: "Песочница OpenCV" }).tap();
  const canvas = page.getByLabel("Результат обработки");
  await canvas.waitFor({ timeout: 10_000 });
  await page.waitForFunction(() => (document.querySelector("canvas")?.width ?? 0) > 50, null, { timeout: 10_000 });
  const code = () => page.locator("pre").last().innerText();
  check(/THRESH_OTSU.*# T = \d+/.test(await code()), "по умолчанию — серое, размытие и Otsu с найденным порогом в коде");

  await page.getByRole("button", { name: "BGR как есть" }).tap();
  await page.getByRole("alert").filter({ hasText: "CV_8UC1" }).waitFor({ timeout: 5_000 });
  check(true, "Otsu на цветной — ошибка cv2 про CV_8UC1");

  await page.getByRole("button", { name: "Серое" }).tap();
  await slide(page.getByLabel("Размер ядра"), 4);
  await page.getByRole("alert").filter({ hasText: "ksize.width % 2 == 1" }).waitFor({ timeout: 5_000 });
  check(true, "чётное ядро GaussianBlur — та же ошибка, что в Colab");

  await slide(page.getByLabel("Размер ядра"), 5);
  await slide(page.getByLabel("Масштаб"), 50);
  await page.waitForTimeout(300);
  check(/cv2\.resize\(img, \(\d+, \d+\)\)/.test(await code()) && /print\(out\.shape\)\s+# \(\d+, \d+\)/.test(await code()), "resize с (ширина, высота) и итоговый shape без канала у серого");
  await browser.close();
});

test("Отчёт по варианту: после трёх проверенных ответов ИИ называет слабые темы и ведёт в тренажёр", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user, serviceWorkers: "block" });
  const reports = [];
  await page.route("**/api/study-events/grade", async (route) => {
    if (route.request().method() === "GET") return route.fulfill({ json: { available: true } });
    return route.fulfill({ json: { score: 1, points: 4, verdict: "partial", correct: [], missing: ["bias not added"], mistakes: [], tip: "Add b." } });
  });
  await page.route("**/api/study-events/report", async (route) => {
    reports.push(JSON.parse(route.request().postData() ?? "{}"));
    return route.fulfill({ json: { summary: "Теряешь баллы на расчётах.", topics: [{ title: "Linear classifier", why: "Забыт bias.", parts: ["cv-l3-p1"], trainers: ["linear"] }], plan: ["Реши 3 задачи s = Wx + b"] } });
  });
  await openEvent(page);
  await page.getByRole("button", { name: /Variant 1|Вариант 1/ }).first().tap();
  await page.getByText(/Question 1/).first().waitFor({ timeout: 10_000 });
  const boxes = page.getByRole("textbox");
  for (let i = 0; i < 3; i++) await boxes.nth(i).fill(`Answer number ${i + 1} with some reasoning.`);
  await page.getByRole("checkbox").first().check();
  await page.getByRole("button", { name: /Проверить все ответы ИИ/ }).tap();
  await page.getByRole("heading", { name: "Отчёт по варианту" }).waitFor({ timeout: 15_000 });
  if (await page.getByRole("checkbox").first().isVisible() && !(await page.getByRole("checkbox").first().isChecked())) await page.getByRole("checkbox").first().check();
  await page.getByRole("button", { name: "Собрать отчёт ИИ" }).tap();
  await page.getByText("Теряешь баллы на расчётах.").waitFor({ timeout: 10_000 });
  check(reports.length === 1 && reports[0].consent === "event-report-v1" && reports[0].items.length === 3, "в отчёт ушли итоги трёх проверок с отметкой о согласии");
  check(!JSON.stringify(reports[0]).includes("Answer number"), "сами ответы в отчёт не уходят");
  await page.getByRole("button", { name: /Тренажёр: s = Wx \+ b/ }).tap();
  await page.getByRole("button", { name: "Проверить" }).waitFor({ timeout: 10_000 });
  check(true, "кнопка темы открывает тренажёр нужного вида");
  await browser.close();
});

test("ИИ-помощник: видит открытую часть конспекта, без согласия не отправляет, переписка переживает перезагрузку", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user, serviceWorkers: "block" });
  const sent = [];
  await page.route("**/api/study-events/tutor", async (route) => {
    if (route.request().method() === "GET") return route.fulfill({ json: { available: true } });
    sent.push(JSON.parse(route.request().postData() ?? "{}"));
    return route.fulfill({ status: 200, contentType: "text/plain; charset=utf-8", body: "**Коротко:** в OpenCV цвета идут как `BGR`.\n- первый пункт\n- второй пункт" });
  });
  await openEvent(page);
  await page.getByRole("button", { name: "Начать с первой части" }).tap();
  await page.getByRole("button", { name: /Начать квиз по этой части/ }).waitFor({ timeout: 10_000 });

  await page.getByRole("button", { name: "Открыть ИИ-помощника" }).tap();
  const panel = page.getByRole("dialog", { name: "ИИ-помощник" });
  await panel.waitFor({ timeout: 5_000 });
  check((await panel.innerText()).includes("Видит: Конспект"), "панель показывает, что помощник видит конспект");

  await panel.getByRole("button", { name: "Объясни эту часть проще" }).tap();
  await panel.getByRole("alert").filter({ hasText: "галочку согласия" }).waitFor({ timeout: 5_000 });
  check(sent.length === 0 && (await panel.getByRole("textbox").inputValue()) === "Объясни эту часть проще", "без согласия вопрос не уходит, а остаётся в поле");

  await panel.getByRole("checkbox").check();
  await panel.getByRole("button", { name: "Отправить" }).tap();
  await panel.getByText("первый пункт").waitFor({ timeout: 10_000 });
  check((await panel.locator("code").first().innerText()) === "BGR", "ответ отрисован: жирный, код, список");
  check(sent.length === 1 && sent[0].consent === "event-tutor-v1" && sent[0].focus.view === "read" && /^cv-/.test(sent[0].focus.partId ?? ""), "ушли вопрос, id открытой части и отметка о согласии");
  check(sent[0].messages.at(-1).text === "Объясни эту часть проще" && !("notes" in sent[0].focus), "текст конспекта клиент не шлёт — сервер берёт его сам");

  await page.reload({ waitUntil: "networkidle" });
  await page.getByText("Готовность к квизу").waitFor({ timeout: 15_000 });
  await page.getByRole("button", { name: "Открыть ИИ-помощника" }).tap();
  await panel.getByText("первый пункт").waitFor({ timeout: 5_000 });
  check(true, "переписка пережила перезагрузку");
  await panel.getByRole("button", { name: "Новый чат" }).tap();
  check(!(await panel.innerText()).includes("первый пункт"), "«Новый чат» очищает переписку");
  await panel.getByRole("button", { name: "Закрыть помощника" }).tap();
  await panel.waitFor({ state: "detached", timeout: 5_000 });
  check(true, "панель закрывается");
  await browser.close();
});
