/**
 * Консоль владельца: скрытый вход по логотипу, логин с паролем, выход.
 *
 * Дверь спрятана, но не заперта на честное слово: пароль проверяется на
 * сервере, попытки ограничены, кука подписана. Тесты проверяют и то, что
 * дверь открывается своим, и то, что чужим она не поддаётся.
 */

import { check, checkText, newUser, openSection, session, test } from "../harness.mjs";

test("Консоль: десять нажатий по логотипу открывают вход в консоль", async () => {
  const { browser, page } = await session();
  await page.goto("/login", { waitUntil: "networkidle" });

  const logo = page.locator('img[alt="YeahGrind"]').first();
  for (let i = 0; i < 10; i++) await logo.tap();
  await page.waitForURL(/\/admin\/login/, { timeout: 15_000 });
  check(true, "после десяти нажатий открылся вход в консоль");
  await browser.close();
});

test("Консоль: случайные редкие нажатия по логотипу никуда не уводят", async () => {
  const { browser, page } = await session();
  await page.goto("/login", { waitUntil: "networkidle" });

  const logo = page.locator('img[alt="YeahGrind"]').first();
  // девять нажатий подряд — мало, а после паузы счёт начинается заново
  for (let i = 0; i < 9; i++) await logo.tap();
  await page.waitForTimeout(1200);
  for (let i = 0; i < 5; i++) await logo.tap();
  await page.waitForTimeout(500);
  check(!page.url().includes("/admin"), `остались на месте (${page.url()})`);
  await browser.close();
});

test("Консоль: чужой пароль не пускает, свой — пускает", async () => {
  const { browser, page } = await session();
  await page.goto("/admin/login", { waitUntil: "networkidle" });

  await page.fill('input[name="username"]', "admin");
  await page.fill('input[name="password"]', "не тот пароль");
  await page.tap('button[type=submit]');
  await page.getByText("Неверный логин или пароль").waitFor({ timeout: 15_000 });
  check(true, "неверная пара отклонена");

  await page.fill('input[name="password"]', "admin");
  await page.tap('button[type=submit]');
  await page.waitForURL(/\/admin$/, { timeout: 20_000 });
  await checkText(page.locator("h1"), "Владелец", "консоль открылась");
  await checkText(
    page.locator("body"),
    "ADMIN_PASSWORD",
    "и честно предупреждает про запасной пароль",
  );
  await browser.close();
});

test("Консоль: без входа в консоль не попасть, а после выхода — снова", async () => {
  // Обычный пользователь приложения: вошёл, но владельцем не является.
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, "/admin");
  check(page.url().includes("/admin/login"), `отправили на вход (${page.url()})`);

  await page.fill('input[name="username"]', "admin");
  await page.fill('input[name="password"]', "admin");
  await page.tap('button[type=submit]');
  await page.waitForURL(/\/admin$/, { timeout: 20_000 });
  check(true, "по логину и паролю пустили");

  await page.getByRole("button", { name: "выйти" }).tap();
  await page.waitForURL(/\/admin\/login/, { timeout: 20_000 });
  await page.goto("/admin", { waitUntil: "networkidle" });
  check(page.url().includes("/admin/login"), "после выхода консоль снова закрыта");
  await browser.close();
});

test("Консоль: данные пользователей отдаются только со входом", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  const status = await page.evaluate(async () => (await fetch("/api/owner/users")).status);
  check(status === 403, `без входа в консоль список пользователей закрыт (ответ ${status})`);
  await browser.close();
});
