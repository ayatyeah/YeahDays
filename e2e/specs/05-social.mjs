/**
 * Социальное и напоминания: приглашения, общий челлендж, пары, уведомления.
 *
 * Здесь проверяется то, что делают вдвоём: один зовёт — второй принимает,
 * один жмёт «+» — второй видит. Такие вещи ломаются тише всего: у себя на
 * экране всё выглядит правильно, а у друга ничего не произошло.
 */

import { check, checkText, newUser, openSection, session, sql, test } from "../harness.mjs";

test("Друзья: приглашение по ссылке доходит от одного к другому", async () => {
  const alice = await newUser();
  const bob = await newUser();
  const A = await session({ user: alice });
  // Системное «Поделиться» в тесте подменяем, чтобы поймать саму ссылку:
  // окно шаринга в браузере всё равно не открыть.
  await A.context.addInitScript(() => {
    navigator.share = async (d) => {
      window.__shared = d;
    };
  });
  await openSection(A.page, "/account");
  await A.page.getByRole("button", { name: "+ Пригласить" }).tap();
  await A.page.getByRole("button", { name: "Пригласить по ссылке" }).tap();
  await A.page.waitForFunction(() => window.__shared, null, { timeout: 15_000 });
  const url = (await A.page.evaluate(() => window.__shared)).url;
  check(/\/invite\/[A-Z0-9]{10}$/.test(url), `ссылка-приглашение получена: ${url}`);
  const path = new URL(url).pathname;
  await A.page.keyboard.press("Escape");

  const B = await session({ user: bob });
  await B.page.goto(path, { waitUntil: "networkidle" });
  await checkText(B.page.locator("h1"), alice.name, "приглашённый видит, кто его зовёт");
  await B.page.getByRole("button", { name: "Добавить в друзья" }).tap();
  await B.page.waitForURL(/\/account/, { timeout: 20_000 });
  await B.page.waitForTimeout(1500);
  await checkText(
    B.page.locator("section", { hasText: "Друзья" }).first(),
    alice.name,
    "новый друг сразу в списке, и с именем",
  );
  check(
    sql(`select count(*) from "Friendship" where "userId"='${alice.id}' or "userId"='${bob.id}'`) === "2",
    "связь взаимная",
  );

  // У пригласившего друг появляется без перезагрузки — по возвращении в приложение.
  await A.page.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
  await A.page.waitForTimeout(1500);
  await checkText(
    A.page.locator("section", { hasText: "Друзья" }).first(),
    bob.name,
    "у пригласившего друг появился без перезагрузки",
  );
  await A.browser.close();
  await B.browser.close();
});

test("Друзья: ссылку можно открыть без аккаунта, регистрация вернёт обратно", async () => {
  const alice = await newUser();
  const A = await session({ user: alice });
  await A.context.addInitScript(() => {
    navigator.share = async (d) => {
      window.__shared = d;
    };
  });
  await openSection(A.page, "/account");
  await A.page.getByRole("button", { name: "+ Пригласить" }).tap();
  await A.page.getByRole("button", { name: "Пригласить по ссылке" }).tap();
  await A.page.waitForFunction(() => window.__shared, null, { timeout: 15_000 });
  const path = new URL((await A.page.evaluate(() => window.__shared)).url).pathname;
  await A.browser.close();

  const guest = await session();
  await guest.page.goto(path, { waitUntil: "networkidle" });
  await checkText(guest.page.locator("h1"), "зовёт тебя в друзья", "страница открыта без входа");
  await guest.page.getByRole("button", { name: "Зарегистрироваться" }).tap();
  await guest.page.waitForURL(/register/, { timeout: 20_000 });
  check(
    decodeURIComponent(guest.page.url()).includes(`callbackUrl=${path}`),
    "после регистрации вернёт на приглашение",
  );
  await guest.browser.close();
});

test("Друзья: битая ссылка не притворяется рабочей", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await page.goto("/invite/ZZZZZZZZZZ", { waitUntil: "networkidle" });
  await checkText(page.locator("h1"), "Ссылка не работает", "про негодную ссылку сказано прямо");
  await browser.close();
});

test("Друзья: удаление спрашивает подтверждение и отменяется", async () => {
  const alice = await newUser();
  const bob = await newUser();
  makeFriends(alice, bob);

  const { browser, page } = await session({ user: alice });
  await openSection(page, "/account");
  await page.waitForTimeout(1200);
  await page.getByRole("button", { name: `Убрать ${bob.name}` }).tap();
  await page.getByText("Убрать из друзей?").waitFor({ timeout: 10_000 });
  check(true, "спросили подтверждение");
  await page.getByRole("button", { name: "Отмена" }).tap();
  await page.waitForTimeout(600);
  check(
    sql(`select count(*) from "Friendship" where "userId"='${alice.id}'`) === "1",
    "после отмены дружба на месте",
  );
  await browser.close();
});

/** Взаимная дружба прямо в базе: челлендж без друзей создать нельзя. */
function makeFriends(a, b) {
  sql(
    `insert into "Friendship"("userId","friendId","createdAt") values
     ('${a.id}','${b.id}',now()), ('${b.id}','${a.id}',now())
     on conflict do nothing`,
  );
  sql(
    `insert into "PublicStats"("userId",name,"updatedAt") values
     ('${a.id}','${a.name}',now()), ('${b.id}','${b.name}',now())
     on conflict ("userId") do update set name = excluded.name`,
  );
}

test("Челлендж: норма набирается, счёт растёт сразу и не теряет нажатия", async () => {
  const user = await newUser();
  makeFriends(user, await newUser());
  const { browser, page } = await session({ user });
  await openSection(page, "/account");

  await page.getByRole("button", { name: "+ Новый" }).tap();
  await page.fill('input[placeholder="Например: 50 отжиманий"]', "Отжимания");
  const norm = page.locator('input[inputmode="numeric"]');
  await norm.tap();
  await norm.press("Backspace");
  check((await norm.inputValue()) === "", "поле нормы очищается");
  await norm.type("50");
  check((await norm.inputValue()) === "50", `набирается 50 (сейчас ${await norm.inputValue()})`);
  await page.getByRole("button", { name: "Позвать друзей" }).tap();
  await page.waitForTimeout(1500);

  const plus = page.getByRole("button", { name: "Добавить подход" });
  for (let i = 0; i < 5; i++) await plus.tap({ noWaitAfter: true });
  await checkText(page.locator("li", { hasText: "Ты" }), "5 / 50", "счёт меняется сразу");
  await page.waitForTimeout(2500);
  check(
    sql(`select count from "SharedChallengeProgress" where "userId"='${user.id}'`) === "5",
    "на сервере ровно пять подходов, ни одного потерянного",
  );
  await checkText(page.locator("li", { hasText: "Ты" }), "5 / 50", "после ответа сервера счёт тот же");

  await page.getByRole("button", { name: "Убрать подход" }).tap();
  await page.waitForTimeout(1500);
  check(
    sql(`select count from "SharedChallengeProgress" where "userId"='${user.id}'`) === "4",
    "минус тоже доезжает",
  );
  await browser.close();
});

test("Челлендж: выход спрашивает подтверждение", async () => {
  const user = await newUser();
  makeFriends(user, await newUser());
  const { browser, page } = await session({ user });
  await openSection(page, "/account");
  await page.getByRole("button", { name: "+ Новый" }).tap();
  await page.fill('input[placeholder="Например: 50 отжиманий"]', "Планка");
  await page.getByRole("button", { name: "Позвать друзей" }).tap();
  await page.waitForTimeout(1500);

  await page.getByRole("button", { name: "Выйти из челленджа" }).tap();
  await page.getByText("Выйти из челленджа?").waitFor({ timeout: 10_000 });
  check(true, "спросили подтверждение");
  await page.getByRole("button", { name: "Отмена" }).tap();
  await page.waitForTimeout(500);
  check(
    sql(`select count(*) from "SharedChallengeMember" where "userId"='${user.id}'`) === "1",
    "после отмены челлендж на месте",
  );

  await page.getByRole("button", { name: "Выйти из челленджа" }).tap();
  await page.getByText("Выйти из челленджа?").waitFor({ timeout: 10_000 });
  // Кнопок «Выйти» на экране две: из аккаунта и в подтверждении. Шторка
  // рисуется порталом в конец body, поэтому нужная — последняя.
  await page.getByRole("button", { name: "Выйти", exact: true }).last().tap();
  await page.waitForTimeout(1500);
  check(
    sql(`select count(*) from "SharedChallengeMember" where "userId"='${user.id}'`) === "0",
    "подтверждённый выход срабатывает",
  );
  await browser.close();
});

test("Пары: расписание на неделю заводится одной формой", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, "/today");

  await checkVisibleText(page, "Добавь свои пары", "новому человеку предлагают завести расписание");
  await page.getByRole("button", { name: "Добавить расписание" }).tap();
  await page.fill('input[placeholder="Например: Матанализ"]', "Матанализ");
  await page.getByRole("button", { name: "Ср" }).tap();
  await page.getByRole("button", { name: "Пт" }).tap();
  await page.fill('input[type="time"]', "10:40");
  await page.getByRole("button", { name: "Добавить", exact: true }).tap();
  await checkText(
    page.locator("li", { hasText: "Матанализ" }),
    "Ср, Пт",
    "форма подтверждает, что пара добавлена на оба дня",
  );
  await page.getByRole("button", { name: "Готово" }).tap();
  await page.waitForTimeout(4000);

  const saved = sql(
    `select count(*) from "UserState" u, jsonb_array_elements(u.data->'todos') t
     where u."userId"='${user.id}' and t->>'title' like 'Матанализ%'`,
  );
  check(saved === "2", `на сервере две пары, по одной на день (сейчас ${saved})`);
  const minute = sql(
    `select distinct t->>'minute' from "UserState" u, jsonb_array_elements(u.data->'todos') t
     where u."userId"='${user.id}' and t->>'title' like 'Матанализ%'`,
  );
  check(minute === "40", `минуты сохранены как есть, без округления вверх (сейчас ${minute})`);
  check(
    !(await page.getByText("Добавь свои пары").isVisible()),
    "предложение исчезает, когда расписание есть",
  );
  await browser.close();
});

test("Напоминания: приложение просит включить их, когда впереди дело со временем", async () => {
  const now = new Date();
  const soon = new Date(now.getTime() + 90 * 60_000);
  const day = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const user = await newUser({
    state: {
      todos: [
        {
          id: "e2e-timed",
          title: "Матанализ — лекция",
          date: day,
          hour: soon.getHours(),
          minute: 0,
          duration: 90,
          priority: "normal",
          subtasks: [],
          done: false,
          doneDays: [],
          createdAt: Date.now(),
          completedAt: null,
        },
      ],
    },
  });

  // Push-уведомлений в WebKit на Linux нет — карточку проверяем в Chromium.
  const { browser, context, page } = await session({ user, engine: "chromium" });
  // Подмену включаем ПОСЛЕ входа: service worker, зарегистрированный на
  // странице логина, перехватывал переходы и вход не доезжал. А
  // Notification.permission притворяется «ещё не спрашивали» — в headless
  // браузере уведомления считаются заранее запрещёнными.
  await context.addInitScript(() => {
    Object.defineProperty(Notification, "permission", { get: () => "default" });
    navigator.serviceWorker.register("/sw.js");
  });
  await openSection(page, "/today");
  await page.waitForTimeout(2500);
  await checkText(
    page.locator("section", { hasText: "Напомнить перед началом?" }).first(),
    "Матанализ — лекция",
    "просьба включить напоминания называет ближайшее дело",
  );
  await page.getByRole("button", { name: "Не напоминать" }).click();
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  check(
    !(await page.getByText("Напомнить перед началом?").isVisible()),
    "после отказа не возвращается",
  );
  await browser.close();
});

/** Мелкий помощник: дождаться текста и заодно записать проверку. */
async function checkVisibleText(page, needle, message) {
  await page.getByText(needle).first().waitFor({ timeout: 15_000 });
  check(true, message);
}
