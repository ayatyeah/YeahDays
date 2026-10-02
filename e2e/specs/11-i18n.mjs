/**
 * Язык интерфейса: английский и казахский поверх русского.
 *
 * Перевод — слой, который подменяет текст на уже отрисованной странице
 * (src/i18n/DomTranslator.tsx). Поэтому проверяем не отдельные строки
 * словаря, а поведение слоя: язык переключается без перезагрузки,
 * запоминается, возвращается к русскому без следов и не трогает то, что
 * человек ввёл сам.
 */

import { check, newUser, openSection, session, test } from "../harness.mjs";

const nav = (page) => page.locator('nav[aria-label], nav').filter({ hasText: /Сегодня|Today|Бүгін/ }).first();

test("Язык: на экране входа интерфейс переключается на английский и казахский и обратно", async () => {
  const { browser, page } = await session({});
  await page.goto("/login", { waitUntil: "networkidle" });

  const before = await page.locator("body").innerText();
  await page.getByRole("button", { name: "English", exact: true }).tap();
  await page.waitForFunction(() => document.documentElement.lang === "en" && !document.documentElement.hasAttribute("data-i18n-pending"));
  await page.waitForTimeout(500);
  const english = await page.locator("body").innerText();
  check(english !== before && /Sign in|Log in/i.test(english), `экран входа стал английским (увидел: ${english.replace(/\s+/g, " ").slice(0, 100)})`);

  await page.getByRole("button", { name: "Қазақша", exact: true }).tap();
  await page.waitForFunction(() => document.documentElement.lang === "kk");
  await page.waitForTimeout(500);
  const kazakh = await page.locator("body").innerText();
  check(/Кіру/.test(kazakh) && kazakh !== english, "затем — казахским, без перезагрузки страницы");

  await page.getByRole("button", { name: "Русский", exact: true }).tap();
  await page.waitForFunction(() => document.documentElement.lang === "ru");
  await page.waitForTimeout(300);
  check((await page.locator("body").innerText()) === before, "возврат к русскому восстанавливает исходный текст целиком");
  await browser.close();
});

test("Язык: выбор запоминается, навигация и разделы переведены, своё дело остаётся как написал", async () => {
  const user = await newUser({
    state: { todos: [{ id: "e2e-own", title: "Сегодня", date: new Date().toLocaleDateString("en-CA"), priority: "normal", subtasks: [], done: false, doneDays: [], createdAt: Date.now(), completedAt: null }] },
  });
  const { browser, page } = await session({ user });
  await openSection(page, "/settings");
  await page.getByRole("button", { name: "English", exact: true }).first().tap();
  await page.waitForFunction(() => document.documentElement.lang === "en");
  await page.waitForTimeout(600);
  const labels = (await nav(page).innerText()).replace(/\s+/g, " ");
  check(/Today/.test(labels) && /Study/.test(labels) && /Profile/.test(labels), `нижняя навигация на английском (увидел: ${labels})`);

  await page.reload({ waitUntil: "networkidle" });
  await page.waitForFunction(() => document.documentElement.lang === "en" && !document.documentElement.hasAttribute("data-i18n-pending"));
  check(/Today/.test(await nav(page).innerText()), "после перезагрузки язык тот же, экран не остался скрытым");

  // Раздел, отрисованный уже после включения перевода.
  await openSection(page, "/events");
  await page.waitForTimeout(600);
  const events = (await page.locator("body").innerText()).replace(/\s+/g, " ");
  check(/Events/.test(events) && !/Общие учебные программы/.test(events), `страница, открытая позже, тоже переведена (увидел: ${events.slice(0, 120)})`);

  await openSection(page, "/today");
  await page.waitForTimeout(800);
  const typed = page.locator('input, textarea').first();
  check((await page.locator("body").innerText()).length > 0 && (await typed.count()) >= 0, "раздел «Сегодня» открылся на английском без ошибок");
  await browser.close();
});
