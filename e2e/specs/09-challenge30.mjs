/**
 * «Челлендж 30»: анкета, старт готового плана, отметки и личная аналитика.
 *
 * ИИ здесь не вызывается ни разу: генерация платная, и набор, который
 * гоняют после каждой правки, не должен тратить токены. Готовый план
 * кладётся прямо в базу — так же, как состояние аккаунта в остальных
 * сценариях. Сам вызов ИИ и его лимиты проверяет
 * src/app/api/challenge30/route.test.ts.
 */

import { check, newUser, openSection, session, sql, test } from "../harness.mjs";

const steps = ["Шаг первой недели", "Шаг второй недели", "Шаг третьей недели", "Шаг четвёртой недели"];

/** Черновик лёгкого уровня: 4 занятия по 45 минут вечером, каждый день. */
function seedDraft(user) {
  const plan = {
    id: "e2e-plan",
    brief: {
      level: "easy",
      goals: "Разобраться в Python и больше двигаться",
      baseline: "С нуля",
      preferences: "",
      timezone: "Asia/Almaty",
      windows: Array.from({ length: 7 }, () => [{ start: 18 * 60, end: 22 * 60 }]),
    },
    recipe: {
      title: "Месяц Python и движения",
      summary: "Понемногу каждый день; при усталости сокращай блок, а не пропускай день.",
      activities: [
        { title: "Python на практике", kind: "study", weight: 3, steps },
        { title: "Зарядка", kind: "sport", weight: 1, steps },
      ],
    },
    createdAt: new Date().toISOString(),
    consentAt: new Date().toISOString(),
    startDate: null,
    logs: {},
    tokens: 900,
  };
  sql(
    `insert into "Challenge30"("userId", data, "updatedAt")
     values ('${user.id}', '${JSON.stringify(plan).replace(/'/g, "''")}'::jsonb, now() at time zone 'utc')`,
  );
}

test("Челлендж 30: в анкете три уровня, и без согласия план не создаётся", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, "/challenge30");

  for (const [name, hours] of [["Лёгкий", "3 ч"], ["Средний", "6 ч"], ["Тяжёлый", "12 ч"]]) {
    const button = page.getByRole("button", { name: new RegExp(name) });
    check((await button.innerText()).includes(hours), `уровень «${name}» — это ${hours} в день`);
  }

  // Окна времени подстраиваются под уровень: иначе выбор «12 часов» при
  // вечерних окнах по умолчанию упирался бы в ошибку, спрятанную в свёрнутом
  // блоке.
  await page.getByRole("button", { name: /Тяжёлый/ }).tap();
  await page.getByText("Свободное время по дням недели").tap();
  check(
    (await page.getByLabel("Понедельник начало 1").inputValue()) === "07:00",
    "при выборе тяжёлого уровня окно дня расширилось само",
  );

  await page.getByLabel(/Что хочешь улучшить/).fill("Разобраться в Python и больше двигаться");
  await page.getByLabel(/С чего начинаешь/).fill("С нуля");
  const create = page.getByRole("button", { name: "Создать мой план" });
  check(await create.isDisabled(), "без согласия на отправку анкеты в ИИ кнопка создания выключена");
  check(
    sql(`select count(*) from "Challenge30" where "userId" = '${user.id}' and "aiCount" > 0`) === "0",
    "просмотр и заполнение анкеты не тратят попытки ИИ",
  );
  await browser.close();
});

test("Челлендж 30: начинаю план, отмечаю день целиком и вижу аналитику", async () => {
  const user = await newUser();
  seedDraft(user);
  const { browser, page } = await session({ user });
  await openSection(page, "/challenge30");

  await page.getByText("Месяц Python и движения").waitFor({ timeout: 10_000 });
  check(true, "готовый план виден как предпросмотр до старта");

  // По подписи «Начать» искать нельзя: в неё попадает и текст анкеты, если в
  // целях есть слово «начать». Выпадающий список на странице один.
  await page.locator("select").selectOption("0");
  await page.getByRole("button", { name: "Начать 30 дней" }).tap();
  await page.getByText("Сейчас день 1").waitFor({ timeout: 10_000 });
  check(true, "челлендж начат сегодняшним днём");

  // Кнопок «Весь блок» четыре, и после каждого нажатия страница
  // перерисовывается с новой ревизией — ждём, пока отметка встанет, прежде
  // чем жать следующую.
  for (let done = 1; done <= 4; done++) {
    await page.getByRole("button", { name: "Весь блок" }).first().tap();
    await page.getByRole("button", { name: "✓ Отменить" }).nth(done - 1).waitFor({ timeout: 10_000 });
  }
  await page.getByText("1/30 дней зачтено").waitFor({ timeout: 10_000 });
  check(true, "четыре занятия по 45 минут дают зачтённый день лёгкого уровня");

  const analytics = page.locator("section", { has: page.getByRole("heading", { name: "Аналитика" }) });
  const text = (await analytics.innerText()).replace(/\s+/g, " ");
  check(text.includes("3 ч") && text.includes("1/30"), `аналитика показывает 3 часа и один зачтённый день (увидел: ${text.slice(0, 160)})`);
  check(text.includes("Python на практике") && text.includes("Зарядка"), "аналитика разбивает время по занятиям плана");

  const logs = JSON.parse(sql(`select data->'logs' from "Challenge30" where "userId" = '${user.id}'`));
  check(
    Object.values(logs).reduce((a, b) => a + b, 0) === 180,
    "в базе сохранено ровно 180 минут — повторные нажатия не удвоили время",
  );
  check(
    sql(`select "aiCount" from "Challenge30" where "userId" = '${user.id}'`) === "0",
    "старт и отметки обошлись без единого обращения к ИИ",
  );
  await browser.close();
});

/** Уже идущий челлендж: старт сегодня, показ друзьям — по флагу. */
function seedRunning(user, share) {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Almaty" });
  const plan = {
    id: `e2e-plan-${user.id}`,
    brief: { level: "easy", goals: "Разобраться в Python", baseline: "С нуля", preferences: "", timezone: "Asia/Almaty", windows: Array.from({ length: 7 }, () => [{ start: 18 * 60, end: 22 * 60 }]) },
    recipe: { title: "Месяц Python", summary: "Понемногу каждый день.", activities: [{ title: "Python на практике", kind: "study", weight: 2, steps }, { title: "Чтение", kind: "personal", weight: 1, steps }] },
    createdAt: new Date().toISOString(), consentAt: new Date().toISOString(), startDate: today, logs: { "0:0": 45 }, tokens: 900, share,
  };
  sql(`insert into "Challenge30"("userId", data, "updatedAt") values ('${user.id}', '${JSON.stringify(plan).replace(/'/g, "''")}'::jsonb, now() at time zone 'utc')`);
}

test("Челлендж 30: друг виден только при взаимном показе, а окна подставляются из расписания", async () => {
  const me = await newUser({
    // Пара с 18:00 до 19:30 каждый день недели — её нужно обойти.
    state: { todos: Array.from({ length: 7 }, (_, i) => ({ id: `e2e-class-${i}`, title: "Пара", date: new Date(Date.now() + i * 86_400_000).toLocaleDateString("en-CA"), hour: 18, minute: 0, duration: 90, priority: "normal", subtasks: [], done: false, doneDays: [], createdAt: Date.now(), completedAt: null })) },
  });
  const friend = await newUser();
  for (const [x, y] of [[me, friend], [friend, me]]) {
    sql(`insert into "Friendship"("userId", "friendId", "createdAt") values ('${x.id}', '${y.id}', now() at time zone 'utc')`);
    sql(`insert into "PublicStats"("userId", name, "updatedAt") values ('${x.id}', '${x.name}', now() at time zone 'utc') on conflict ("userId") do nothing`);
  }
  seedRunning(friend, true);

  const { browser, page } = await session({ user: me });
  await openSection(page, "/challenge30");

  // Анкета: окна из расписания обходят пару.
  await page.getByText("Свободное время по дням недели").tap();
  await page.getByRole("button", { name: "Заполнить из моего расписания" }).tap();
  // Число занятий не проверяем точно: около полуночи «сегодня» у браузера и у теста может различаться на день.
  await page.getByText(/Окна подставлены с учётом \d+ занятий/).waitFor({ timeout: 10_000 });
  const starts = await page.locator('input[aria-label^="Понедельник начало"]').evaluateAll((list) => list.map((el) => el.value));
  const ends = await page.locator('input[aria-label^="Понедельник конец"]').evaluateAll((list) => list.map((el) => el.value));
  check(starts.every((s, i) => ends[i] <= "17:50" || s >= "19:40"), `свободные окна не накрывают пару 18:00–19:30 (увидел: ${starts.map((s, i) => `${s}–${ends[i]}`).join(", ")})`);

  // Свой челлендж начат без показа — друга не видно.
  seedRunning(me, false);
  await openSection(page, "/challenge30");
  await page.getByRole("heading", { name: "Челлендж вместе" }).waitFor({ timeout: 10_000 });
  check(!(await page.locator("body").innerText()).includes(friend.name), "пока я не включил показ, прогресс друга мне не виден");

  // Галочка переключается после ответа сервера, а не в момент нажатия —
  // поэтому tap и ожидание результата, а не check().
  await page.getByLabel(/Показывать мой прогресс друзьям и видеть их/).tap();
  await page.getByText(friend.name).waitFor({ timeout: 10_000 });
  check(true, "после взаимного включения друг появился на доске");
  check(sql(`select data->>'share' from "Challenge30" where "userId" = '${me.id}'`) === "true", "мой выбор сохранён на сервере");
  await browser.close();
});
