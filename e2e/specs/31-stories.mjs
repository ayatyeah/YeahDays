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
  await player.getByText("Budgeted Cost of Work Scheduled").waitFor({ timeout: 10_000 });
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
