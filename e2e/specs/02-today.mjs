/**
 * Раздел «Сегодня»: свои задачи и почасовое расписание.
 *
 * Это второй по важности путь после входа: колода предлагает, а здесь
 * человек ведёт то, что придумал сам, — пары, дедлайны, бытовые дела.
 * Поэтому проверяем не только «нажалось», но и что изменение доехало до
 * сервера: задача, которая живёт только в памяти вкладки, для человека
 * равна потерянной.
 *
 * Про устройство экрана, которое видно из тестов:
 *  — разделы оболочки не размонтируются, а прячутся, поэтому все локаторы
 *    ограничены своим `[data-section="…"]`: иначе `[data-hour]` находится
 *    и в «Сегодня», и в «Календаре»;
 *  — расписание в «Сегодня» компактное и свёрнуто — его сначала «показать»;
 *  — лоток «Просрочено» с кнопкой «Разобрать всё» есть только у полного
 *    расписания (Календарь), в компактном его нет вовсе (см. последний тест);
 *  — состояние уезжает на сервер с задержкой (дебаунс ~1,5 с), поэтому
 *    серверные проверки идут через ожидание, а не сразу после нажатия.
 */

import { check, checkText, newUser, openSection, session, sql, test } from "../harness.mjs";

/* ────────────────────────  Время глазами приложения  ──────────────────────── */

/* Вкладка в тестах живёт в Asia/Almaty (см. harness), а машина может стоять
   в другой зоне. «Сегодня» и «который час» считаем так же, как их считает
   браузер теста, иначе тест около полуночи готовит задачи не на тот день. */
const DAY_FMT = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Almaty" });
const TIME_FMT = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Almaty",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Ключ дня (YYYY-MM-DD) со сдвигом в сутках. */
function dayKey(shiftDays = 0) {
  return DAY_FMT.format(new Date(Date.now() + shiftDays * 86_400_000));
}

/** Сколько минут прошло с полуночи по часам приложения. */
function nowMinutes() {
  const [h, m] = TIME_FMT.format(new Date()).split(":").map(Number);
  return h * 60 + m;
}

/**
 * Час, который ещё не наступил. Задача в прошедшем часу считается
 * просроченной и в сетку не попадает — тест про «тап по карточке» на ней
 * ловил бы не баг, а собственную неаккуратность со временем.
 */
function futureHour() {
  const h = Math.floor(nowMinutes() / 60);
  return h < 23 ? h + 1 : 23;
}

/** Задача, у которой час уже кончился, — та самая «просроченная». */
function pastSlot(minutesAgo) {
  const start = Math.max(0, nowMinutes() - minutesAgo);
  return { hour: Math.floor(start / 60), minute: start % 60, duration: 5 };
}

/* ────────────────────────  Данные и ожидания  ──────────────────────── */

let todoSeq = 0;

/** Заготовка задачи для снимка UserState (формат — Todo из useUserStore). */
function todo(over = {}) {
  return {
    id: `e2e-todo-${todoSeq++}`,
    title: "Задача",
    date: dayKey(),
    priority: "normal",
    subtasks: [],
    done: false,
    doneDays: [],
    createdAt: 1,
    completedAt: null,
    ...over,
  };
}

/** Задачи так, как их видит сервер. */
function serverTodos(user) {
  const raw = sql(
    `select coalesce(data->'todos', '[]'::jsonb) from "UserState" where "userId"='${user.id}'`,
  );
  return raw ? JSON.parse(raw) : [];
}

/**
 * Ждать состояния, а не спать наугад.
 *
 * Здесь два источника задержки: пружинки framer (строка уезжает не мгновенно)
 * и синхронизация с сервером (дебаунс ~1,5 с плюс запрос). Фиксированный
 * `waitForTimeout` в обоих случаях либо врёт, либо тормозит набор.
 */
async function until(fn, message, timeout = 10_000) {
  const deadline = Date.now() + timeout;
  for (;;) {
    let ok = false;
    try {
      ok = await fn();
    } catch {
      ok = false;
    }
    if (ok) {
      check(true, message);
      return;
    }
    if (Date.now() > deadline) break;
    await new Promise((r) => setTimeout(r, 200));
  }
  check(false, message);
}

/* ────────────────────────  Экран  ──────────────────────── */

/** Открыть «Сегодня» и вернуть локатор раздела. */
async function openToday(page) {
  await openSection(page, "/today");
  const sec = page.locator('[data-section="today"]');
  await sec.locator(".one-action-plan > summary").click();
  await sec.getByText("Добавить или изменить задачи", { exact: true }).click();
  return sec;
}

/** Развернуть расписание: в «Сегодня» оно свёрнуто до нажатия «показать». */
async function showSchedule(sec) {
  await sec.getByText("Расписание и инструменты", { exact: true }).click();
  await sec.getByRole("button", { name: "показать", exact: true }).tap();
  await sec.locator("[data-hour]").first().waitFor({ timeout: 10_000 });
}

/** Видимые строки «Моих задач» (уезжающие с анимацией уже не в счёт). */
function rows(sec) {
  return sec.locator(".list-virtual > div:visible");
}

/**
 * Строка конкретной задачи.
 *
 * Считаем строки локаторами, а не по тексту списка: у `.list-virtual > *`
 * стоит `content-visibility: auto`, и у списка, до которого ещё не
 * долистали, `innerText` пустой — проверка «в списке написано то-то»
 * падала бы там, где на экране всё в порядке.
 */
function row(sec, title) {
  return sec.locator(".list-virtual > div:visible").filter({ hasText: title });
}

/** Карточки расписания в строке часа. */
function chips(sec, hour) {
  return sec.locator(`[data-hour="${hour}"] .glass-chip`);
}

/* ────────────────────────  Мои задачи  ──────────────────────── */

test("Сегодня: новая задача появляется в списке и доезжает до сервера", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  const sec = await openToday(page);

  await sec.getByPlaceholder("Что нужно сделать?").fill("Сдать лабу по физике");
  await sec.getByRole("button", { name: "+", exact: true }).tap();

  await until(
    async () => (await row(sec, "Сдать лабу по физике").count()) === 1,
    "задача встала в список",
  );
  check(
    (await sec.getByPlaceholder("Что нужно сделать?").inputValue()) === "",
    "поле ввода очистилось под следующую задачу",
  );
  await checkText(
    sec.locator("h2").filter({ hasText: "Мои задачи" }),
    "Мои задачи · 1",
    "счётчик активных задач обновился",
  );

  // Отдельная и главная проверка: с телефона перешли на ноут — задача там.
  await until(
    () => serverTodos(user).some((t) => t.title === "Сдать лабу по физике"),
    "задача сохранилась на сервере",
    15_000,
  );
  await browser.close();
});

test("Сегодня: отметка «выполнено» ставится и снимается", async () => {
  const user = await newUser({
    state: { todos: [todo({ id: "e2e-done", title: "Прочитать главу" })] },
  });
  const { browser, page } = await session({ user });
  const sec = await openToday(page);

  await row(sec, "Прочитать главу").getByRole("button", { name: "выполнить" }).tap();
  await until(
    async () => (await rows(sec).count()) === 0,
    "выполненная задача ушла из фильтра «активные»",
  );
  await until(
    () => serverTodos(user).some((t) => t.id === "e2e-done" && t.done === true),
    "сервер знает, что задача закрыта",
    15_000,
  );

  // Снимаем отметку — задача возвращается в активные.
  await sec.getByRole("button", { name: "все", exact: true }).tap();
  await row(sec, "Прочитать главу").getByRole("button", { name: "снять отметку" }).tap();
  await sec.getByRole("button", { name: "активные", exact: true }).tap();
  await until(
    async () => (await row(sec, "Прочитать главу").count()) === 1,
    "снятая отметка вернула задачу в активные",
  );
  // Снятие отметки — такое же изменение, как и её постановка: на другом
  // устройстве задача не должна остаться закрытой.
  await until(
    () => serverTodos(user).some((t) => t.id === "e2e-done" && t.done === false),
    "сервер знает, что отметку сняли",
    15_000,
  );
  await browser.close();
});

test("Сегодня: поиск оставляет в списке только найденное", async () => {
  const user = await newUser({
    state: {
      todos: [
        todo({ title: "Позвонить в банк" }),
        todo({ title: "Прочитать главу" }),
        // Поиск специально идёт по всем дням: ищут обычно то, что «где-то было».
        todo({ title: "Закрыть счёт в банке", date: dayKey(3) }),
      ],
    },
  });
  const { browser, page } = await session({ user });
  const sec = await openToday(page);

  await until(async () => (await rows(sec).count()) === 2, "в дне видны обе сегодняшние задачи");

  // Все три условия в одном ожидании: список перестраивается с анимацией,
  // и не совпавшая строка ещё пару кадров уезжает, пока найденные въезжают.
  await sec.getByPlaceholder("Поиск по всем задачам").fill("банк");
  await until(
    async () =>
      (await row(sec, "Позвонить в банк").count()) === 1 &&
      // поиск идёт по всем дням, а не только по открытому
      (await row(sec, "Закрыть счёт в банке").count()) === 1 &&
      (await row(sec, "Прочитать главу").count()) === 0,
    "в списке остались только совпавшие задачи, включая задачу другого дня",
  );

  await sec.getByPlaceholder("Поиск по всем задачам").fill("");
  await until(async () => (await rows(sec).count()) === 2, "пустой поиск вернул обычный список дня");
  await browser.close();
});

test("Сегодня: переключатели «активные / все / готовы»", async () => {
  const user = await newUser({
    state: {
      todos: [
        todo({ title: "Прочитать главу" }),
        todo({ title: "Купить продукты", done: true, completedAt: 2 }),
      ],
    },
  });
  const { browser, page } = await session({ user });
  const sec = await openToday(page);

  await until(
    async () =>
      (await row(sec, "Прочитать главу").count()) === 1 &&
      (await row(sec, "Купить продукты").count()) === 0,
    "«активные» показывают только незакрытую задачу",
  );

  await sec.getByRole("button", { name: "все", exact: true }).tap();
  await until(async () => (await rows(sec).count()) === 2, "«все» показывают обе задачи");

  await sec.getByRole("button", { name: "готовы", exact: true }).tap();
  await until(
    async () =>
      (await row(sec, "Купить продукты").count()) === 1 &&
      (await row(sec, "Прочитать главу").count()) === 0,
    "«готовы» показывают только закрытую задачу",
  );
  await browser.close();
});

test("Сегодня: приоритет и повтор задачи меняются в её карточке", async () => {
  const user = await newUser({
    state: { todos: [todo({ id: "e2e-prio", title: "Сходить на тренировку" })] },
  });
  const { browser, page } = await session({ user });
  const sec = await openToday(page);

  const card = row(sec, "Сходить на тренировку");
  await card.getByRole("button", { name: "подробнее" }).tap();
  await card.getByRole("button", { name: "Важно", exact: true }).tap();
  await card.getByRole("button", { name: "каждый день", exact: true }).tap();
  await until(
    async () => await card.getByRole("button", { name: "на завтра →" }).isDisabled(),
    "повторяющуюся задачу больше нельзя перенести на завтра — она задаёт ритм",
  );

  // Свернём карточку: в развёрнутой слово «Важно» есть и на кнопке выбора,
  // а проверять надо подпись самой задачи.
  await card.getByRole("button", { name: "подробнее" }).tap();
  await until(
    async () => (await card.innerText()).includes("Важно"),
    "в строке задачи появилась пометка важности",
  );

  await until(
    () =>
      serverTodos(user).some(
        (t) => t.id === "e2e-prio" && t.priority === "high" && t.repeat?.kind === "daily",
      ),
    "приоритет и повтор доехали до сервера",
    15_000,
  );
  await browser.close();
});

test("Сегодня: удалённую задачу возвращает кнопка «Вернуть»", async () => {
  const user = await newUser({
    state: { todos: [todo({ id: "e2e-undo", title: "Отменить подписку" })] },
  });
  const { browser, page } = await session({ user });
  const sec = await openToday(page);

  const card = row(sec, "Отменить подписку");
  await card.getByRole("button", { name: "подробнее" }).tap();
  await card.getByRole("button", { name: "удалить", exact: true }).tap();

  await until(async () => (await rows(sec).count()) === 0, "задача ушла из списка");
  await checkText(sec, "Удалено: Отменить подписку", "приложение говорит, что именно удалено");

  await sec.getByRole("button", { name: "Вернуть", exact: true }).tap();
  await until(
    async () => (await row(sec, "Отменить подписку").count()) === 1,
    "«Вернуть» поставила задачу обратно",
  );
  await until(
    () => serverTodos(user).some((t) => t.title === "Отменить подписку"),
    "возвращённая задача осталась и на сервере",
    15_000,
  );
  await browser.close();
});

test("Сегодня: подзадача добавляется и отмечается", async () => {
  const user = await newUser({
    state: { todos: [todo({ id: "e2e-sub", title: "Подготовить доклад" })] },
  });
  const { browser, page } = await session({ user });
  const sec = await openToday(page);

  const card = row(sec, "Подготовить доклад");
  await card.getByRole("button", { name: "подробнее" }).tap();
  // У формы подзадачи нет кнопки — только Enter, как в любом списке дел.
  await card.getByPlaceholder("+ подзадача").fill("Собрать источники");
  await card.getByPlaceholder("+ подзадача").press("Enter");

  await until(
    async () => (await card.innerText()).includes("0/1"),
    "подзадача добавилась, счётчик показывает 0/1",
  );
  check(
    (await card.getByPlaceholder("+ подзадача").inputValue()) === "",
    "поле подзадачи очистилось под следующую",
  );

  await card.getByRole("button", { name: "подзадача", exact: true }).tap();
  await until(async () => (await card.innerText()).includes("1/1"), "подзадача отмечена: 1/1");
  await until(
    () =>
      serverTodos(user).some(
        (t) =>
          t.id === "e2e-sub" &&
          t.subtasks[0]?.title === "Собрать источники" &&
          t.subtasks[0]?.done === true,
      ),
    "подзадача и её отметка сохранились на сервере",
    15_000,
  );
  await browser.close();
});

/* ────────────────────────  Расписание по часам  ──────────────────────── */

test("Сегодня: тап по пустому часу ставит задачу в этот час", async () => {
  const hour = futureHour();
  const user = await newUser();
  const { browser, page } = await session({ user });
  const sec = await openToday(page);
  await showSchedule(sec);

  await sec.locator(`[data-hour="${hour}"] button`).first().tap();
  await page.getByPlaceholder("Например: созвон с командой").fill("Созвон с куратором");
  await page.getByRole("button", { name: "Сохранить" }).tap();

  await until(
    async () => (await chips(sec, hour).count()) === 1,
    `карточка встала в строку ${hour}:00`,
  );
  await checkText(chips(sec, hour), "Созвон с куратором", "в карточке нужное название");
  await until(
    () => serverTodos(user).some((t) => t.title === "Созвон с куратором" && t.hour === hour),
    "час задачи доехал до сервера",
    15_000,
  );
  await browser.close();
});

test("Сегодня: карточка расписания открывает просмотр, «Изменить» правит задачу", async () => {
  const hour = futureHour();
  const user = await newUser({
    state: {
      todos: [
        todo({ id: "e2e-chip", title: "Пара по матанализу", hour, minute: 0, duration: 60 }),
      ],
    },
  });
  const { browser, page } = await session({ user });
  const sec = await openToday(page);
  await showSchedule(sec);

  await chips(sec, hour).first().tap();
  await page.getByRole("button", { name: "Изменить" }).waitFor({ timeout: 10_000 });
  const view = await page.locator("body").innerText();
  check(view.includes("Покрытие дня"), "открылся именно экран просмотра задачи");
  check(
    view.includes(`${String(hour).padStart(2, "0")}:00`),
    `на экране просмотра виден час задачи (${hour}:00)`,
  );

  await page.getByRole("button", { name: "Изменить" }).tap();
  const title = page.getByPlaceholder("Например: созвон с командой");
  await title.waitFor({ timeout: 10_000 });
  check(
    (await title.inputValue()) === "Пара по матанализу",
    "форма открылась с текущим названием, а не пустой",
  );

  await title.fill("Пара по матанализу, ауд. 312");
  await page.getByRole("button", { name: "Сохранить" }).tap();

  await until(
    async () => (await chips(sec, hour).first().innerText()).includes("ауд. 312"),
    "правка видна на карточке в расписании",
  );
  await until(
    () =>
      serverTodos(user).some(
        (t) => t.id === "e2e-chip" && t.title === "Пара по матанализу, ауд. 312",
      ),
    "правка доехала до сервера",
    15_000,
  );
  await browser.close();
});

test("Сегодня: «Отменить в этот день» убирает пару только из этого дня", async () => {
  const hour = futureHour();
  const today = dayKey();
  const user = await newUser({
    state: {
      todos: [
        todo({
          id: "e2e-repeat",
          title: "Пара по матанализу",
          hour,
          minute: 0,
          duration: 60,
          repeat: { kind: "daily" },
        }),
      ],
    },
  });
  const { browser, page } = await session({ user });
  const sec = await openToday(page);
  await showSchedule(sec);

  await chips(sec, hour).first().tap();
  await page.getByRole("button", { name: "Отменить в этот день" }).tap();

  await until(async () => (await chips(sec, hour).count()) === 0, "пара ушла из сегодняшнего дня");
  await until(
    async () => (await row(sec, "Пара по матанализу").count()) === 0,
    "и из списка «Мои задачи» тоже",
  );
  await until(
    () =>
      serverTodos(user).some(
        (t) =>
          t.id === "e2e-repeat" &&
          t.repeat?.kind === "daily" &&
          JSON.stringify(t.skipDays) === JSON.stringify([today]),
      ),
    "на сервере снят ровно один день, сам повтор цел",
    15_000,
  );

  // Смотреть другой день в «Сегодня» нельзя, а неделя в Календаре не всегда
  // содержит завтра (воскресенье — последний её день). Поэтому за
  // доказательством «убралось только отсюда» идём на экран управления днём.
  await page.goto("/manage", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "День", exact: true }).tap();
  await page.locator('input[type="date"]').fill(dayKey(1));
  await until(
    async () => (await page.locator(".list-virtual").first().innerText()).includes("Пара по матанализу"),
    "завтра пара на месте",
  );
  await browser.close();
});

test("Сегодня: просроченное разбирается одной кнопкой «Разобрать всё»", async () => {
  // Лоток «Просрочено» живёт у полного расписания (Календарь): в компактном
  // виде на «Сегодня» его нет, там просроченное видно только в «Моих задачах».
  const today = dayKey();
  const user = await newUser({
    state: {
      todos: [
        todo({ id: "e2e-od1", title: "Отправить отчёт", ...pastSlot(45) }),
        todo({ id: "e2e-od2", title: "Забрать посылку", ...pastSlot(35) }),
        todo({
          id: "e2e-od3",
          title: "Пара по матанализу",
          ...pastSlot(90),
          duration: 10,
          repeat: { kind: "daily" },
        }),
      ],
    },
  });
  const { browser, page } = await session({ user });
  await openSection(page, "/calendar");
  const cal = page.locator('[data-section="calendar"]');

  const resolve = cal.getByRole("button", { name: /Разобрать всё/ });
  await resolve.waitFor({ timeout: 10_000 });
  await checkText(resolve, "Разобрать всё (3)", "приложение посчитало все три просроченных дела");
  await resolve.tap();

  await until(
    async () => (await cal.getByText("Отправить отчёт").count()) === 0,
    "просроченные дела убрались с экрана дня",
  );
  await until(
    () => {
      const list = serverTodos(user);
      const one = list.find((t) => t.id === "e2e-od1");
      const two = list.find((t) => t.id === "e2e-od2");
      const pair = list.find((t) => t.id === "e2e-od3");
      return (
        one?.date === dayKey(1) &&
        two?.date === dayKey(1) &&
        // повтор не переносят — он задаёт ритм, его просто снимают с этого дня
        pair?.date === today &&
        pair?.skipDays?.includes(today) === true
      );
    },
    "разовые уехали на завтра, повтор снят только с сегодняшнего дня",
    15_000,
  );
  await browser.close();
});
