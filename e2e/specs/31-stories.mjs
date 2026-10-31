/**
 * «Истории» — мультфильмы по лекциям.
 *
 * Проверяется ход: история находится в «Учёбе» и у лекции в ивенте,
 * просмотр идёт со звуком, субтитры и кадр меняются вместе с репликой,
 * карточка термина — по-английски с русским пояснением, по сценам можно
 * прыгать, в конце — мораль и путь к конспекту и квизу.
 */

import { check, newUser, openSection, session, test } from "../harness.mjs";

test("Истории: из «Учёбы» смотрю историю лекции 4 — звук, субтитры, термины, сцены и финал", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user, engine: "chromium" });
  await openSection(page, "/learn");
  await page.locator("#learning-stories").waitFor({ timeout: 15_000 });
  await page.getByRole("link", { name: /QuickBite/ }).first().tap();

  const player = page.getByRole("dialog", { name: /История: QuickBite/ });
  await player.waitFor({ timeout: 15_000 });
  check((await player.locator("ol li").count()) === 8, "в истории восемь сцен");
  await player.getByRole("button", { name: "▶ Смотреть" }).tap();

  await player.getByText(/Это история команды QuickBite/).waitFor({ timeout: 10_000 });
  await page.waitForTimeout(2500);
  const playing = await page.evaluate(() => {
    const a = document.querySelector("audio");
    return !!a && !a.paused && a.currentTime > 0.5;
  });
  check(playing, "озвучка идёт");
  check((await player.getByText("Рассказчик").count()) >= 1, "у субтитра подписан говорящий");

  // Сцена «Earned value»: первая же реплика — с карточкой BCWS.
  await player.getByRole("button", { name: "Сцены истории" }).tap();
  await page.getByRole("dialog", { name: "Сцены" }).getByRole("button", { name: /^4\. Earned value/ }).tap();
  await player.getByText("Budgeted Cost for Work Scheduled").waitFor({ timeout: 10_000 });
  const card = player.locator(".story-term");
  check((await card.locator('[lang="en"]').first().innerText()).trim() === "BCWS", "термин — по-английски, как в тесте");
  check(/[А-Яа-я]/.test(await card.locator('[lang="ru"]').innerText()), "пояснение — по-русски");
  check(await page.evaluate(() => document.querySelector("audio")?.src.endsWith("/s04.m4a")), "играет звук своей сцены");

  // Пауза останавливает звук.
  await player.getByRole("button", { name: "Пауза" }).last().tap();
  check(await page.evaluate(() => document.querySelector("audio")?.paused), "пауза останавливает звук");

  // Последняя сцена и «следующая» — финал с моралью и путём к квизу.
  await player.getByRole("button", { name: "Сцены истории" }).tap();
  await page.getByRole("dialog", { name: "Сцены" }).getByRole("button", { name: /^8\. Demo Day/ }).tap();
  await player.getByRole("button", { name: "Следующая сцена" }).tap();
  await player.getByText("Project success = Cost Control + Smart Decisions + Teamwork").waitFor({ timeout: 10_000 });
  check(await player.getByRole("link", { name: "К лекции — конспект и квиз" }).isVisible(), "после истории — к конспекту и квизу");
  await browser.close();
});

test("Истории: у лекции 4 в ивенте PM — кнопка её истории", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, "/events/project-management-test-2");
  await page.getByRole("region", { name: "Твой маршрут" }).waitFor({ timeout: 15_000 });
  const lecture4 = page.locator('details[id="route-pm-l4"]');
  await lecture4.getByRole("link", { name: /📖 История лекции/ }).tap();
  await page.waitForURL(/\/stories\/pm-l4-quickbite/, { timeout: 15_000 });
  await page.getByRole("dialog", { name: /История: QuickBite/ }).waitFor({ timeout: 15_000 });
  check(true, "кнопка у лекции открывает её историю");
  await browser.close();
});

test("Истории: лекция 5 в списке, и герои двигаются — позы сменяются по ходу реплики", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user, engine: "chromium" });
  await openSection(page, "/learn");
  await page.locator("#learning-stories").waitFor({ timeout: 15_000 });
  check((await page.getByRole("link", { name: /QuickBite/ }).count()) >= 2, "в «Историях» — истории лекций 4 и 5");
  await page.getByRole("link", { name: /QuickBite растёт/ }).first().tap();
  const player = page.getByRole("dialog", { name: /История: QuickBite растёт/ });
  await player.waitFor({ timeout: 15_000 });
  await player.getByRole("button", { name: "▶ Смотреть" }).tap();
  await player.getByText(/Полгода после Demo Day/).waitFor({ timeout: 10_000 });
  // За несколько секунд реплики поверх основного кадра должна проявиться другая поза.
  const moved = await page
    .waitForFunction(
      () => [...document.querySelectorAll(".story-shot[data-kb] img[data-pose]")].some((img) => img.getAttribute("data-pose") !== "0" && getComputedStyle(img).opacity === "1"),
      null,
      { timeout: 8_000 },
    )
    .then(() => true)
    .catch(() => false);
  check(moved, "по ходу реплики сменилась поза героев");
  await browser.close();
});

test("Истории: лекция 6 — «Падение QuickBite» открывается из «Учёбы» и идёт с первой реплики", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user, engine: "chromium" });
  await openSection(page, "/learn");
  await page.locator("#learning-stories").waitFor({ timeout: 15_000 });
  check((await page.getByRole("link", { name: /QuickBite/ }).count()) >= 3, "в «Историях» — истории лекций 4, 5 и 6");
  await page.getByRole("link", { name: /Падение QuickBite/ }).first().tap();
  const player = page.getByRole("dialog", { name: /История: Падение QuickBite/ });
  await player.waitFor({ timeout: 15_000 });
  await player.getByRole("button", { name: "▶ Смотреть" }).tap();
  await player.getByText(/сеть MegaMart/).waitFor({ timeout: 10_000 });
  const frame = await page.locator(".story-shot[data-kb] img").first().evaluate((img) => img.complete && img.naturalWidth > 0);
  check(frame, "кадр первой сцены загрузился");
  await browser.close();
});

test("Истории: лекция 7 — «Последний спринт Сары» открывается кнопкой у лекции в ивенте и идёт с первой реплики", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user, engine: "chromium" });
  await openSection(page, "/events/project-management-test-2");
  await page.getByRole("region", { name: "Твой маршрут" }).waitFor({ timeout: 15_000 });
  // Лекции на карте свёрнуты (раскрыта текущая) — седьмую открываем через строку «Лекции».
  await page.getByRole("navigation", { name: "Лекции" }).getByRole("button", { name: /^7 · / }).tap();
  const lecture7 = page.locator('details[id="route-pm-l7"]');
  await lecture7.getByRole("link", { name: /📖 История лекции/ }).tap();
  await page.waitForURL(/\/stories\/pm-l7-saras-last-sprint/, { timeout: 15_000 });
  const player = page.getByRole("dialog", { name: /История: Последний спринт Сары/ });
  await player.waitFor({ timeout: 15_000 });
  await player.getByRole("button", { name: "▶ Смотреть" }).tap();
  await player.getByText(/QuickBite выжил/).waitFor({ timeout: 10_000 });
  const frame = await page.locator(".story-shot[data-kb] img").first().evaluate((img) => img.complete && img.naturalWidth > 0);
  check(frame, "кадр первой сцены загрузился");
  // Пробел ставит на паузу и снимает с неё — даже когда фокус на кнопке плеера.
  // Сначала дождаться, что звук пошёл: пока он грузится, пробел запускает, а не ставит паузу.
  await player.getByRole("button", { name: "Пауза" }).last().waitFor({ timeout: 10_000 });
  await page.keyboard.press("Space");
  const paused = await player.getByRole("button", { name: "Смотреть дальше" }).last().waitFor({ timeout: 3_000 }).then(() => true).catch(() => false);
  const at = await page.evaluate(() => document.querySelector("audio")?.paused);
  await page.keyboard.press("Space");
  const resumed = await player.getByRole("button", { name: "Пауза" }).last().waitFor({ timeout: 3_000 }).then(() => true).catch(() => false);
  check(paused && at === true && resumed, "пробел — пауза и снова дальше");
  await browser.close();
});

test("Истории: лекция 8 — финал «ХроноЕрнар» открывается кнопкой у лекции в ивенте и идёт с первой реплики", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user, engine: "chromium" });
  await openSection(page, "/events/project-management-test-2");
  await page.getByRole("region", { name: "Твой маршрут" }).waitFor({ timeout: 15_000 });
  await page.getByRole("navigation", { name: "Лекции" }).getByRole("button", { name: /^8 · / }).tap();
  await page.locator('details[id="route-pm-l8"]').getByRole("link", { name: /📖 История лекции/ }).tap();
  await page.waitForURL(/\/stories\/pm-l8-chronoyernar/, { timeout: 15_000 });
  const player = page.getByRole("dialog", { name: /История: ХроноЕрнар/ });
  await player.waitFor({ timeout: 15_000 });
  await player.getByRole("button", { name: "▶ Смотреть" }).tap();
  await player.getByText(/Где-то в Алматы/).waitFor({ timeout: 10_000 });
  const frame = await page.locator(".story-shot[data-kb] img").first().evaluate((img) => img.complete && img.naturalWidth > 0);
  check(frame, "кадр подвала загрузился");
  await browser.close();
});

test("Истории: перекладка — в «Сделке» герои живут на холсте, кадры под ним уходят", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user, engine: "chromium" });
  await page.goto("/stories/pm-l8-chronoyernar", { waitUntil: "networkidle" });
  const player = page.getByRole("dialog", { name: /История: ХроноЕрнар/ });
  await player.getByRole("button", { name: "▶ Смотреть" }).tap();
  await player.getByRole("button", { name: "Сцены истории" }).tap();
  await page.getByRole("dialog", { name: "Сцены" }).getByRole("button", { name: /^7\. Сделка/ }).tap();
  await page.waitForFunction(() => window.__storyStage?.scene === "s07" && window.__storyStage.ready(), null, { timeout: 30_000 });
  check((await page.locator(".story-shot").count()) === 0, "готовый холст заменил кадры");
  // Герои двигаются сами: два момента одной реплики — разные картинки.
  const [a, b] = await page.evaluate(() => {
    const shot = (t) => (window.__storyStage.draw(t), document.querySelector(".story-canvas").toDataURL("image/jpeg", 0.8));
    return [shot(3), shot(3.7)];
  });
  check(a.length > 20_000, "на холсте сцена, а не пустота");
  check(a !== b, "кадр меняется со временем — герои двигаются");
  await browser.close();
});

test("Истории: финал сезона — своя кнопка у лекции 8, весь фильм на холсте, бой в движении", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user, engine: "chromium" });
  await openSection(page, "/events/project-management-test-2");
  await page.getByRole("region", { name: "Твой маршрут" }).waitFor({ timeout: 15_000 });
  await page.getByRole("navigation", { name: "Лекции" }).getByRole("button", { name: /^8 · / }).tap();
  await page.locator('details[id="route-pm-l8"]').getByRole("link", { name: /🏁 Финал сезона/ }).tap();
  await page.waitForURL(/\/stories\/pm-finale-ayan-returns/, { timeout: 15_000 });
  const player = page.getByRole("dialog", { name: /История: Возвращение Аяна/ });
  await player.getByRole("button", { name: "▶ Смотреть" }).tap();
  await page.waitForFunction(() => window.__storyStage?.scene === "s01" && window.__storyStage.ready(), null, { timeout: 30_000 });
  check((await page.locator(".story-shot").count()) === 0, "первая же сцена — на холсте");
  await player.getByRole("button", { name: "Сцены истории" }).tap();
  await page.getByRole("dialog", { name: "Сцены" }).getByRole("button", { name: /^8\. / }).tap();
  await page.waitForFunction(() => window.__storyStage?.scene === "s08" && window.__storyStage.ready(), null, { timeout: 30_000 });
  // Удар: за доли секунды кадр заметно меняется — выпад, отдача, вспышка.
  const [a, b] = await page.evaluate(() => {
    const shot = (t) => (window.__storyStage.draw(t), document.querySelector(".story-canvas").toDataURL("image/jpeg", 0.8));
    return [shot(0.55), shot(0.8)];
  });
  check(a !== b, "бой идёт в движении");
  await browser.close();
});

test("Истории: телефон боком — кадр на весь экран, субтитры и кнопки поверх него; стоя — снова 16:9", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user, engine: "chromium" });
  await openSection(page, "/stories/pm-l4-quickbite");
  const player = page.getByRole("dialog", { name: /История: QuickBite/ });
  await player.waitFor({ timeout: 15_000 });
  await player.getByRole("button", { name: "▶ Смотреть" }).tap();
  await player.getByText(/Это история команды QuickBite/).waitFor({ timeout: 10_000 });
  // Поворот: размеры iPhone 13 боком.
  await page.setViewportSize({ width: 844, height: 390 });
  await page.waitForTimeout(500);
  const land = await page.evaluate(() => {
    const r = (sel) => document.querySelector(sel)?.getBoundingClientRect();
    const stage = r(".story-stage"), sub = r(".story-sub"), controls = r(".story-controls");
    return { stage: stage && stage.height >= innerHeight - 2 && stage.width >= innerWidth - 2, sub: sub && sub.bottom <= innerHeight && sub.top > innerHeight / 2, controls: controls && controls.bottom <= innerHeight + 1 };
  });
  check(land.stage && land.sub && land.controls, `боком: кадр на весь экран, субтитры и кнопки на экране (${JSON.stringify(land)})`);
  await page.setViewportSize({ width: 390, height: 664 });
  await page.waitForTimeout(500);
  const ratio = await page.evaluate(() => { const r = document.querySelector(".story-stage").getBoundingClientRect(); return r.width / r.height; });
  check(Math.abs(ratio - 16 / 9) < 0.05, `стоя кадр снова 16:9 (${ratio.toFixed(2)})`);
  await browser.close();
});
