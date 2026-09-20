/**
 * Расписание на «Сегодня»: что происходит с делом, чей час уже прошёл.
 *
 * Регрессия: просроченное вычищалось из сетки часов, а лоток «Просрочено»
 * рисовался только в Календаре — на «Сегодня» дело пропадало совсем, и его
 * час выглядел свободным, будто ничего и не планировалось.
 */

import { check, newUser, openSection, session, sql, test } from "../harness.mjs";

const day = () => new Date().toISOString().slice(0, 10);

function todo(title, hour, extra = {}) {
  return {
    id: `e2e-${title}`,
    title,
    date: day(),
    hour,
    minute: 0,
    duration: 60,
    priority: "normal",
    subtasks: [],
    done: false,
    doneDays: [],
    createdAt: Date.now(),
    completedAt: null,
    ...extra,
  };
}

test("Расписание: просроченное дело видно на «Сегодня», а не исчезает", async () => {
  const hour = new Date().getHours();
  // Тест имеет смысл только когда сегодня уже есть прошедший час.
  if (hour < 2) return;

  const user = await newUser({ state: { todos: [todo("Пара по матану", hour - 2)] } });
  const { browser, page } = await session({ user });
  await openSection(page, "/today");

  const today = page.locator('[data-section="today"]');
  const show = today.getByRole("button", { name: "показать" });
  if (await show.isVisible()) await show.tap();
  await page.waitForTimeout(500);

  await today.getByText("Просрочено: 1").waitFor({ timeout: 10_000 });
  check(true, "просроченное подписано на «Сегодня»");
  // Карточка стоит в строке своего часа — проверяем именно сетку.
  const row = today.locator(`[data-hour="${hour - 2}"]`);
  await row.getByText("Пара по матану").first().waitFor({ timeout: 10_000 });
  check(true, "дело осталось в своём часе, хотя час уже прошёл");
  await browser.close();
});

test("Расписание: «Разобрать всё» на «Сегодня» переносит просроченное на завтра", async () => {
  const hour = new Date().getHours();
  if (hour < 2) return;

  const user = await newUser({
    state: { todos: [todo("Сдать лабу", hour - 2), todo("Позвонить в банк", hour - 1)] },
  });
  const { browser, page } = await session({ user });
  await openSection(page, "/today");

  const today = page.locator('[data-section="today"]');
  const show = today.getByRole("button", { name: "показать" });
  if (await show.isVisible()) await show.tap();
  await page.waitForTimeout(500);

  await today.getByRole("button", { name: /Разобрать всё \(2\)/ }).tap();
  await page.waitForTimeout(4000);

  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
  const moved = sql(
    `select count(*) from "UserState" u, jsonb_array_elements(u.data->'todos') t
     where u."userId"='${user.id}' and t->>'date'='${tomorrow}'`,
  );
  check(moved === "2", `оба дела уехали на завтра (сейчас ${moved})`);
  check(
    !(await today.getByText("Просрочено:").isVisible()),
    "строка про просроченное ушла вместе с делами",
  );
  await browser.close();
});
