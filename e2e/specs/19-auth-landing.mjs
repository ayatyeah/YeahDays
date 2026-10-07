/**
 * Экраны входа и регистрации и перевод лендинга.
 *
 * Вход и регистрация — разные экраны с переключателем сверху: переход между
 * ними не теряет адрес возврата. Лендинг на английском и казахском
 * переводится целиком — раньше у него не было словаря, и половина текста
 * оставалась русской.
 */

import { check, session, test } from "../harness.mjs";

test("Вход: переключатель «Вход | Регистрация» ведёт на нужный экран и не теряет адрес возврата", async () => {
  const { browser, page } = await session();
  await page.goto("/login?callbackUrl=%2Fprogress", { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Войти в YeahGrind" }).waitFor({ timeout: 10_000 });
  await page.getByRole("navigation", { name: "Вход или регистрация" }).getByRole("link", { name: "Регистрация" }).tap();
  await page.waitForURL(/\/register/, { timeout: 10_000 });
  await page.getByRole("heading", { name: "Создать аккаунт" }).waitFor({ timeout: 10_000 });
  check(decodeURIComponent(page.url()).includes("callbackUrl=/progress"), "регистрация открылась с тем же адресом возврата");
  await page.getByRole("navigation", { name: "Вход или регистрация" }).getByRole("link", { name: "Вход" }).tap();
  await page.waitForURL(/\/login/, { timeout: 10_000 });
  check(decodeURIComponent(page.url()).includes("callbackUrl=/progress"), "и обратно на вход — тоже");
  await browser.close();
});

test("Лендинг: на английском и казахском переведён целиком", async () => {
  for (const [locale, words, button] of [["en", ["Not perfect.", "Start your journey"], "English"], ["kk", ["Мінсіз емес.", "Өз жолыңды бастау"], "Қазақша"]]) {
    const { browser, page } = await session();
    await page.goto("/", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: button }).first().tap();
    await page.waitForTimeout(800);
    const text = await page.locator("main, body").first().innerText();
    check(words.every((w) => text.includes(w)), `${locale}: главные фразы переведены (${words.join(", ")})`);
    check(!/Начать свой путь|Не идеальнее/.test(text), `${locale}: русских фраз героя не осталось`);
    await browser.close();
  }
});
