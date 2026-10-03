/**
 * Вход в продукт: регистрация, онбординг, вход, выход.
 *
 * Это единственный путь, который проходит КАЖДЫЙ новый человек, и каждая
 * поломка здесь стоит всех остальных вместе взятых: если тут не пройти,
 * дальше приложения просто нет.
 */

import { BASE, check, checkText, newUser, openSection, session, sql, test } from "../harness.mjs";

const PASSWORD = "testpass123";

test("новый человек: регистрация → онбординг → гайд → чек-ин → колода", async () => {
  const stamp = Date.now().toString(36);
  const email = `e2e-reg-${stamp}@test.local`;
  const { browser, page } = await session();

  await page.goto("/register", { waitUntil: "networkidle" });
  await page.fill('input[name="name"]', "Айгерим");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="username"]', `e2ereg${stamp}`);
  await page.fill('input[name="birthYear"]', "2005");
  await page.fill('input[name="password"]', PASSWORD);
  await page.fill('input[name="confirm"]', PASSWORD);
  await page.tap('button[type=submit]');
  await page.waitForURL(/\/app/, { timeout: 30_000 });
  check(sql(`select count(*) from "User" where email='${email}'`) === "1", "аккаунт создан");

  // Онбординг: «Начать», имя, ещё два шага, «Погнали».
  await page.getByRole("button", { name: "Начать" }).tap();
  await page.fill('input[placeholder="Твоё имя"]', "Айгерим");
  await page.getByRole("button", { name: "Далее" }).tap();
  await page.getByRole("button", { name: "Далее" }).tap();
  await page.fill('input[placeholder="Например: позвонить в банк"]', "Сдать лабу");
  await page.getByRole("button", { name: "Погнали" }).tap();
  await page.waitForTimeout(800);
  check(!(await page.getByRole("button", { name: "Погнали" }).isVisible()), "онбординг завершился");

  // Гайд по приложению.
  const guide = page.getByRole("button", { name: "Понятно" });
  if (await guide.isVisible()) await guide.tap();
  await page.waitForTimeout(500);

  // Чек-ин: два ответа — и появляется колода.
  await checkText(page.locator("h1"), "Как ты сегодня?", "встречает чек-ин");
  await page.getByRole("tab", { name: /Бодрый|Норм|Сонный|Мало|Полон/ }).first().tap();
  await page.getByRole("button", { name: "Показать действия на сегодня" }).tap();
  await page.waitForTimeout(1200);
  check(
    !(await page.getByRole("button", { name: "Показать действия на сегодня" }).isVisible()),
    "чек-ин пройден, дальше колода",
  );

  sql(`delete from "User" where email='${email}'`);
  await browser.close();
});

test("быстрые нажатия «Далее» не выбрасывают на пустой экран", async () => {
  const user = await newUser({ fresh: true });
  const { browser, page } = await session({ user });
  await page.waitForTimeout(800);

  await page.getByRole("button", { name: "Начать" }).tap();
  // Короткий таймаут: кнопка по ходу серии исчезает, и ждать её по 30 с —
  // это пять минут теста на ровном месте.
  const next = page.getByRole("button", { name: "Далее" });
  for (let i = 0; i < 5; i++) {
    await next.tap({ noWaitAfter: true, timeout: 1500 }).catch(() => {});
  }
  await page.waitForTimeout(600);

  const text = await page.locator("body").innerText();
  check(text.trim().length > 40, "экран не опустел после серии быстрых нажатий");
  check(
    (await page.getByRole("button", { name: "Далее" }).isVisible()) ||
      (await page.getByRole("button", { name: "Погнали" }).isVisible()),
    "онбординг остался управляемым",
  );
  await browser.close();
});

test("вход: неверный пароль ругается, верный пускает", async () => {
  const user = await newUser();
  const { browser, page } = await session();

  await page.goto("/login", { waitUntil: "networkidle" });
  await page.fill('input[name="identifier"]', user.email);
  await page.fill('input[name="password"]', "не тот пароль");
  await page.tap('button[type=submit]');
  await page.getByText("Неверный логин или пароль").waitFor({ timeout: 15_000 });
  check(true, "неверный пароль объяснён словами");

  await page.fill('input[name="password"]', user.password);
  await page.tap('button[type=submit]');
  await page.waitForURL(/\/app/, { timeout: 30_000 });
  check(true, "верный пароль пускает в приложение");
  await browser.close();
});

test("вход по логину, а не только по email", async () => {
  const user = await newUser();
  const { browser, page } = await session();
  await page.goto("/login", { waitUntil: "networkidle" });
  await page.fill('input[name="identifier"]', user.username);
  await page.fill('input[name="password"]', user.password);
  await page.tap('button[type=submit]');
  await page.waitForURL(/\/app/, { timeout: 30_000 });
  check(true, "логин работает наравне с email");
  await browser.close();
});

test("текст, набранный до «оживления» страницы, не пропадает", async () => {
  // Регрессия: поля были управляемыми, и React стирал первые символы при
  // гидрации — на медленном телефоне email исчезал прямо во время набора.
  const user = await newUser();
  const { browser, page } = await session();
  await page.goto("/login", { waitUntil: "commit" });
  await page.fill('input[name="identifier"]', user.email);
  await page.fill('input[name="password"]', user.password);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);
  check(
    (await page.inputValue('input[name="identifier"]')) === user.email,
    "набранный email остался в поле",
  );
  await page.tap('button[type=submit]');
  await page.waitForURL(/\/app/, { timeout: 30_000 });
  check(true, "и таким входом тоже пускает");
  await browser.close();
});

test("глазок показывает и снова прячет пароль", async () => {
  const user = await newUser();
  const { browser, page } = await session();
  await page.goto("/login", { waitUntil: "networkidle" });
  await page.fill('input[name="password"]', user.password);

  const field = page.locator('input[name="password"]');
  check((await field.getAttribute("type")) === "password", "по умолчанию пароль скрыт");

  await page.getByRole("button", { name: "Показать пароль" }).tap();
  check((await field.getAttribute("type")) === "text", "по глазку пароль виден");
  check((await field.inputValue()) === user.password, "и это именно то, что набрано");

  await page.getByRole("button", { name: "Скрыть пароль" }).tap();
  check((await field.getAttribute("type")) === "password", "второе нажатие снова прячет");

  // Глазок не должен мешать войти — он внутри формы, но не кнопка отправки.
  await page.fill('input[name="identifier"]', user.email);
  await page.tap('button[type=submit]');
  await page.waitForURL(/\/app/, { timeout: 30_000 });
  check(true, "вход по-прежнему работает");
  await browser.close();
});

test("выход из аккаунта возвращает на витрину", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, "/account");
  await page.getByRole("button", { name: "Выйти", exact: true }).first().tap();
  // Приложение отправляет на витрину, а та без сессии уводит на вход —
  // важно не «куда именно», а что сессии больше нет.
  await page.waitForURL((u) => u.pathname === "/" || u.pathname === "/login", { timeout: 20_000 });

  await page.goto("/app", { waitUntil: "networkidle" });
  check(page.url().includes("/login"), "без входа приложение закрыто");
  await browser.close();
});

test("закрытые страницы просят войти и возвращают обратно", async () => {
  const { browser, page } = await session();
  await page.goto("/progress", { waitUntil: "networkidle" });
  check(
    decodeURIComponent(page.url()).includes(`${BASE}/login?callbackUrl=/progress`),
    `после входа вернёт на /progress (сейчас ${page.url()})`,
  );
  await browser.close();
});

test("вход: один запрос вместо четырёх, раздел открывается сам, чужой адрес возврата не уводит с сайта", async () => {
  const user = await newUser();
  const { browser, page } = await session();
  const auth = [];
  page.on("request", (r) => r.url().includes("/api/auth/") && auth.push(`${r.method()} ${new URL(r.url()).pathname}`));

  // Закрытый раздел до входа: сервер уводит на /login — именно такой ответ раньше застревал в памяти роутера.
  await page.goto("/progress", { waitUntil: "networkidle" });
  await page.fill('input[name="identifier"]', user.email);
  await page.fill('input[name="password"]', user.password);
  await page.tap('button[type=submit]');
  await page.waitForURL(/\/progress/, { timeout: 30_000 });
  await page.waitForLoadState("networkidle");
  check((await page.locator('input[name="identifier"]').count()) === 0, "после входа открылся сам раздел, а не снова форма входа — перезагружать не нужно");
  const before = auth.slice(0, auth.indexOf("POST /api/auth/callback/credentials") + 1);
  check(before.filter((r) => r.startsWith("POST")).length === 1 && !auth.includes("GET /api/auth/providers"), `вход — один запрос, без лишних служебных (было: ${auth.slice(0, 6).join(", ")})`);

  // Адрес возврата на чужой сайт игнорируется.
  await page.context().clearCookies();
  await page.goto("/login?callbackUrl=" + encodeURIComponent("https://example.com/steal"), { waitUntil: "networkidle" });
  await page.fill('input[name="identifier"]', user.email);
  await page.fill('input[name="password"]', user.password);
  await page.tap('button[type=submit]');
  await page.waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: 30_000 });
  check(page.url().startsWith(BASE + "/app"), `чужой адрес возврата не сработал — открылось приложение (сейчас ${page.url()})`);
  await browser.close();
});
