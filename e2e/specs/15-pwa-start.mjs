/**
 * Запуск PWA: разделы-оболочки открываются из кэша service worker'а сразу,
 * а не после сети (иначе человек секунды смотрит на белый экран).
 *
 * Как понять, что ответ пришёл из кэша: подменяем копию /today в кэше на ту
 * же страницу с меткой на <body>. Метка видна после перезагрузки — значит,
 * отдали кэш; пропала из кэша чуть позже — значит, копия обновилась в фоне.
 */

import { check, newUser, openSection, session, test } from "../harness.mjs";

/** Ждать, пока fn() не вернёт правду: проверки идут в кэш, они асинхронные. */
async function until(page, fn, timeout = 30_000) {
  for (const end = Date.now() + timeout; Date.now() < end; await page.waitForTimeout(300)) {
    if (await fn()) return true;
  }
  return false;
}

/** Есть ли копия раздела в кэше оболочки. */
const cached = (page, path) =>
  page.evaluate(async (path) => {
    const name = (await caches.keys()).find((k) => k.startsWith("yg-shell-"));
    return !!name && !!(await (await caches.open(name)).match(path));
  }, path);

/** Дождаться, пока воркер управляет вкладкой и положил /today в кэш. */
async function shellReady(page) {
  await page.waitForFunction(() => !!navigator.serviceWorker?.controller, null, { timeout: 30_000 });
  check(await until(page, () => cached(page, "/today")), "воркер положил оболочку /today в кэш");
}

/** Метка на копии /today в кэше: есть ли она сейчас. */
const cachedMarked = (page) =>
  page.evaluate(async () => {
    const name = (await caches.keys()).find((k) => k.startsWith("yg-shell-"));
    const res = await (await caches.open(name)).match("/today");
    return !!res && (await res.text()).includes("data-from-cache");
  });

/** Поставить метку на копию /today в кэше. */
const markCached = (page) =>
  page.evaluate(async () => {
    const name = (await caches.keys()).find((k) => k.startsWith("yg-shell-"));
    const cache = await caches.open(name);
    const res = await cache.match("/today");
    const html = (await res.text()).replace("<body", '<body data-from-cache="1"');
    await cache.put("/today", new Response(html, { headers: res.headers }));
  });

test("PWA: раздел открывается из кэша сразу, копия обновляется в фоне", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, "/today");
  await shellReady(page);

  await markCached(page);
  await page.reload({ waitUntil: "domcontentloaded" });
  check((await page.locator("body[data-from-cache]").count()) === 1, "после перезагрузки страница пришла из кэша, а не с сервера");

  check(await until(page, async () => !(await cachedMarked(page)), 15_000), "в фоне копия в кэше заменилась свежей с сервера");
  await browser.close();
});

test("PWA: без сессии раздел из кэша уводит на вход, а выход стирает копии разделов", async () => {
  const user = await newUser();
  const { browser, context, page } = await session({ user });
  await openSection(page, "/today");
  await shellReady(page);

  // Сессия кончилась, а копия раздела в кэше осталась: сервер этот запуск
  // не видит, на вход уводит проверка в браузере.
  await markCached(page);
  const cookies = await context.cookies();
  await context.clearCookies();
  await page.reload({ waitUntil: "domcontentloaded" });
  check((await page.locator("body[data-from-cache]").count()) === 1, "раздел открылся из кэша — сервер этот запуск не видел");
  await page.waitForURL((u) => u.pathname === "/login", { timeout: 15_000 });
  check(page.url().includes("callbackUrl=%2Ftoday"), "без сессии увело на вход с возвратом на /today");

  await context.addCookies(cookies);
  await openSection(page, "/account");
  await shellReady(page);
  await page.getByRole("button", { name: "Выйти", exact: true }).first().tap();
  await page.waitForURL((u) => u.pathname === "/" || u.pathname === "/login", { timeout: 20_000 });
  const shellPaths = () =>
    page.evaluate(async () => {
      const name = (await caches.keys()).find((k) => k.startsWith("yg-shell-"));
      if (!name) return [];
      return (await (await caches.open(name)).keys()).map((r) => new URL(r.url).pathname);
    });
  // воркер стирает копии сам, по сообщению — даём ему пару секунд
  await until(page, async () => !(await shellPaths()).includes("/today"), 5_000);
  const left = await shellPaths();
  check(!left.some((p) => ["/app", "/today", "/calendar", "/progress", "/account", "/settings"].includes(p)), `после выхода копий разделов в кэше нет (осталось: ${left.join(", ") || "—"})`);
  await browser.close();
});
