/**
 * Профиль, настройки, нижняя навигация и жесты шторки.
 *
 * Здесь проверяется не «функция работает», а то, что человек физически
 * может до неё добраться пальцем: панель внизу переключает разделы и не
 * накрывает последнюю карточку, настройки открываются поверх профиля и
 * закрываются, а шторка слушается свайпа, затемнения и Escape.
 *
 * Жесты приходится собирать руками через dispatchEvent: page.touchscreen
 * умеет только tap, а у WebKit нет конструктора Touch — Playwright строит
 * точки касания сам, и это единственный способ провести палец по экрану с
 * промежуточными шагами (см. playwright.dev/docs/touch-events).
 */

import { check, checkText, checkVisible, newUser, openSection, session, sql, test } from "../harness.mjs";

/* ────────────────────────  Помощники  ──────────────────────── */

/** Все пять вкладок в том же порядке, что и в панели. */
const TABS = [
  { label: "Главная", path: "/app" },
  { label: "Сегодня", path: "/today" },
  { label: "Календарь", path: "/calendar" },
  { label: "Прогресс", path: "/progress" },
  { label: "Профиль", path: "/account" },
];

/** Нижняя панель. Боковая навигация на телефоне скрыта, берём видимую. */
const bottomNav = (page) => page.locator("nav:visible").first();

/** Открытая шторка целиком (портал в body): затемнение + лист. */
const sheet = (page) => page.locator("div.fixed.inset-0.z-50").last();
/** Сам лист — он же прокручиваемый контейнер и приёмник жеста. */
const sheetPanel = (page) => sheet(page).locator("> div.z-10");
/** Затемнение под листом. */
const sheetScrim = (page) => sheet(page).locator("> div.absolute.inset-0");

/** Точка касания в том виде, в каком её ждёт Playwright. */
const touchPoint = (x, y) => ({
  identifier: 1,
  clientX: x,
  clientY: y,
  pageX: x,
  pageY: y,
  screenX: x,
  screenY: y,
});

/**
 * Провести пальцем от одной точки к другой с промежуточными шагами.
 *
 * Шаги обязательны: и оболочка, и шторка принимают решение «это свайп или
 * прокрутка» на ПЕРВОМ движении, поэтому прыжок сразу в конечную точку
 * проверял бы не тот код, который работает на живом телефоне.
 *
 * Паузы между шагами тоже обязательны: шторка смотрит на скорость жеста
 * (px/мс). События, выпущенные подряд без задержки, дают скорость, какой у
 * живого пальца не бывает, и короткое движение «закрывало» бы лист.
 * 16 мс — примерно кадр, то есть темп настоящего пролистывания.
 */
async function swipe(locator, from, to, steps = 12, frameMs = 16) {
  const init = (points) => ({
    bubbles: true,
    cancelable: true,
    composed: true,
    touches: points,
    targetTouches: points,
    changedTouches: points,
  });
  const start = touchPoint(from[0], from[1]);
  await locator.dispatchEvent("touchstart", init([start]));
  for (let i = 1; i <= steps; i++) {
    const x = Math.round(from[0] + ((to[0] - from[0]) * i) / steps);
    const y = Math.round(from[1] + ((to[1] - from[1]) * i) / steps);
    await locator.dispatchEvent("touchmove", init([touchPoint(x, y)]));
    await new Promise((r) => setTimeout(r, frameMs));
  }
  const end = touchPoint(to[0], to[1]);
  await locator.dispatchEvent("touchend", {
    bubbles: true,
    cancelable: true,
    composed: true,
    touches: [],
    targetTouches: [],
    changedTouches: [end],
  });
}

/** Дождаться условия, опрашивая его, — вместо сна наугад. */
async function until(fn, message, timeout = 15_000, step = 250) {
  const deadline = Date.now() + timeout;
  for (;;) {
    if (await fn()) return;
    if (Date.now() > deadline) throw new Error(`не дождался: ${message}`);
    await new Promise((r) => setTimeout(r, step));
  }
}

/** Снимок, в котором уже есть заработанный прогресс — его жалко потерять. */
function planWithOneDone() {
  return [
    {
      id: "e2e-done-1",
      actionId: "e2e-action-1",
      snapshot: {
        id: "e2e-action-1",
        title: "Пройтись двадцать минут",
        why: "Голова проясняется",
        category: "fitness",
        difficulty: 2,
        duration: 20,
        energy: "low",
        timePreference: "any",
        impact: 2,
      },
      xp: 40,
      date: new Date().toISOString().slice(0, 10),
      completed: true,
      acceptedAt: Date.now() - 3600_000,
      completedAt: Date.now() - 1800_000,
    },
  ];
}

/* ────────────────────────  Нижняя навигация  ──────────────────────── */

test("Навигация: пять вкладок переключаются, активная подсвечена, адрес меняется", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, "/account");

  const nav = bottomNav(page);
  await checkVisible(nav, "нижняя панель на месте");

  for (const { label, path } of TABS) {
    await nav.getByRole("button", { name: label, exact: true }).tap();
    await page.waitForURL((u) => u.pathname === path, { timeout: 10_000 });
    check(new URL(page.url()).pathname === path, `«${label}» открывает ${path}`);

    const active = nav.locator('button[aria-current="page"]');
    check((await active.count()) === 1, `подсвечена ровно одна вкладка на ${path}`);
    check(
      (await active.getAttribute("aria-label")) === label,
      `подсвечена именно «${label}»`,
    );
  }

  await browser.close();
});

test("Навигация: горизонтальный свайп по экрану меняет раздел", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  // «Прогресс» стоит между «Календарём» и «Профилем» — с него проверяются
  // оба направления, и на нём нет колоды, которая забирает жест себе.
  await openSection(page, "/progress");

  const pane = page.locator("[data-section-active]");
  // влево — следующий раздел справа
  await swipe(pane, [320, 420], [110, 424]);
  await page.waitForURL((u) => u.pathname === "/account", { timeout: 10_000 });
  check(true, "свайп влево увёл на «Профиль»");

  // вправо — обратно
  await swipe(page.locator("[data-section-active]"), [80, 420], [300, 416]);
  await page.waitForURL((u) => u.pathname === "/progress", { timeout: 10_000 });
  check(true, "свайп вправо вернул на «Прогресс»");

  await checkText(
    bottomNav(page).locator('button[aria-current="page"]'),
    "Прогресс",
    "панель внизу догнала свайп",
  );

  await browser.close();
});

test("Навигация: прокрутка профиля не прячет последнюю строку под панелью", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, "/account");

  const pane = page.locator('[data-section="account"]');
  await pane.evaluate((el) => el.scrollTo({ top: el.scrollHeight, behavior: "auto" }));
  await page.waitForTimeout(600);
  check(
    await pane.evaluate((el) => el.scrollHeight > el.clientHeight + 40),
    "профиль длиннее экрана — есть что прокручивать",
  );

  const last = pane.getByText("Одно действие в день").last();
  await checkVisible(last, "последняя строка раздела видна после прокрутки");

  const lastBox = await last.boundingBox();
  const navBox = await bottomNav(page).boundingBox();
  check(
    lastBox !== null && navBox !== null && lastBox.y + lastBox.height <= navBox.y + 1,
    `низ последней строки (${lastBox && Math.round(lastBox.y + lastBox.height)}) выше панели (${navBox && Math.round(navBox.y)})`,
  );

  await browser.close();
});

/* ────────────────────────  Профиль и настройки  ──────────────────────── */

test("Профиль: шестерёнка открывает настройки поверх профиля и закрывает их", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, "/account");

  const gear = page.getByRole("button", { name: "Настройки" });
  await gear.tap();
  await sheetPanel(page).waitFor({ state: "visible", timeout: 10_000 });

  await checkText(sheetPanel(page).locator("h2").first(), "Настройки", "шторка настроек открылась");
  await checkVisible(sheetPanel(page).getByText("Внешний вид"), "внутри — настройки приложения");
  check(
    (await gear.getAttribute("aria-expanded")) === "true",
    "шестерёнка знает, что настройки открыты",
  );
  // «Поверх профиля», а не отдельной страницей: адрес прежний, заголовок
  // раздела остался в дереве.
  check(new URL(page.url()).pathname === "/account", "адрес остался профильным");
  check(
    (await page.locator('[data-section="account"] h1').count()) === 1,
    "профиль никуда не делся — панель именно поверх него",
  );

  await page.keyboard.press("Escape");
  await sheet(page).waitFor({ state: "detached", timeout: 10_000 });
  check(true, "настройки закрылись");
  await checkVisible(page.locator('[data-section="account"] h1'), "и мы снова в профиле");

  await browser.close();
});

test("Профиль: переключатель тёмной темы реально меняет оформление", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, "/account");

  const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const themeAttr = () => page.evaluate(() => document.documentElement.dataset.theme ?? "");

  const before = await bg();
  check((await themeAttr()) !== "light", "по умолчанию тема тёмная");

  await page.getByRole("button", { name: "Настройки" }).tap();
  await sheetPanel(page).waitFor({ state: "visible", timeout: 10_000 });
  const toggle = sheetPanel(page).getByRole("switch", { name: "Тёмная тема" });
  check((await toggle.getAttribute("aria-checked")) === "true", "переключатель стоит на тёмной");

  await toggle.tap();
  await until(async () => (await themeAttr()) === "light", "html переоделся в светлую тему");
  const after = await bg();
  check(after !== before, `фон страницы поменялся (${before} → ${after})`);
  check((await toggle.getAttribute("aria-checked")) === "false", "переключатель погас");

  // И обратно — переключение работает в обе стороны.
  await toggle.tap();
  await until(async () => (await themeAttr()) !== "light", "вернулись к тёмной теме");
  check((await bg()) === before, "фон вернулся к исходному");

  await browser.close();
});

test("Профиль: новое имя видно в карточке и уезжает на сервер", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, "/account");

  await page.getByRole("button", { name: "Изменить имя" }).tap();
  await sheetPanel(page).waitFor({ state: "visible", timeout: 10_000 });
  await checkText(sheetPanel(page).locator("h2").first(), "Как тебя звать?", "форма имени открылась");

  const field = sheetPanel(page).locator("input");
  await field.fill("Дана");
  await sheetPanel(page).getByRole("button", { name: "Сохранить" }).tap();
  await sheet(page).waitFor({ state: "detached", timeout: 10_000 });

  await checkVisible(
    page.locator('[data-section="account"]').getByText("Дана", { exact: true }).first(),
    "имя обновилось в карточке профиля",
  );

  // Синхронизация с дебаунсом — опрашиваем базу, а не спим наугад.
  await until(
    () => sql(`select data->>'name' from "UserState" where "userId"='${user.id}'`) === "Дана",
    "имя доехало до сервера",
  );
  check(true, "снимок UserState на сервере знает новое имя");

  await browser.close();
});

test("Профиль: поле имени открывается в фокусе и целиком помещается на экране", async () => {
  // На телефоне форму съедает клавиатура: лист обязан подняться на её
  // высоту (useKeyboardInset). В WebKit на Linux клавиатуры нет, поэтому
  // проверяем то, что от этого зависит: поле сразу в фокусе, видно целиком
  // и принимает набор — без этого подъём листа нечему помогать.
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, "/account");

  await page.getByRole("button", { name: "Изменить имя" }).tap();
  const field = sheetPanel(page).locator("input");
  await field.waitFor({ state: "visible", timeout: 10_000 });
  await page.waitForTimeout(500); // лист доезжает снизу — мерить надо стоящий

  check(
    await field.evaluate((el) => el === document.activeElement),
    "поле сразу в фокусе — печатать можно, ничего не нажимая",
  );

  const box = await field.boundingBox();
  const view = page.viewportSize();
  check(box !== null && box.y >= 0, "поле не уехало за верх экрана");
  check(
    box !== null && box.y + box.height <= view.height,
    `поле целиком в экране (низ ${box && Math.round(box.y + box.height)} из ${view.height})`,
  );

  const save = sheetPanel(page).getByRole("button", { name: "Сохранить" });
  const saveBox = await save.boundingBox();
  check(
    saveBox !== null && saveBox.y + saveBox.height <= view.height,
    "кнопка «Сохранить» тоже видна, а не под краем экрана",
  );

  await field.fill("");
  await field.type("Айсулу");
  check((await field.inputValue()) === "Айсулу", "набранное попадает в поле");

  await browser.close();
});

test("Профиль: «Сбросить прогресс» спрашивает подтверждение, «Отмена» ничего не трогает", async () => {
  const user = await newUser({ state: { plan: planWithOneDone() } });
  const { browser, page } = await session({ user });
  await openSection(page, "/account");

  const doneStat = page
    .locator('[data-section="account"]')
    .locator("p", { hasText: /^Выполнено$/ })
    .locator("xpath=preceding-sibling::p[1]");
  await checkText(doneStat, "1", "в профиле есть заработанный прогресс");

  await page.getByRole("button", { name: "Настройки" }).tap();
  await sheetPanel(page).waitFor({ state: "visible", timeout: 10_000 });
  await sheetPanel(page).getByRole("button", { name: "Сбросить прогресс" }).click();

  // Поверх настроек встаёт вторая шторка — она и есть подтверждение.
  await until(
    async () => (await page.locator("div.fixed.inset-0.z-50").count()) === 2,
    "подтверждение открылось поверх настроек",
  );
  const confirm = sheetPanel(page);
  await checkText(confirm.locator("h2").first(), "Сбросить прогресс?", "спросили, прежде чем стирать");
  await checkText(confirm, "Это нельзя отменить", "объяснили последствия");

  await confirm.getByRole("button", { name: "Отмена" }).click();
  await until(
    async () => (await page.locator("div.fixed.inset-0.z-50").count()) === 1,
    "подтверждение закрылось",
  );

  await page.keyboard.press("Escape");
  await sheet(page).waitFor({ state: "detached", timeout: 10_000 });
  await checkText(doneStat, "1", "после «Отмены» прогресс на месте");
  check(
    sql(`select jsonb_array_length(data->'plan') from "UserState" where "userId"='${user.id}'`) === "1",
    "и на сервере план не тронут",
  );

  await browser.close();
});

test("Профиль: код для внешнего сервиса выдаётся и он непустой", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, "/account");

  await page.getByRole("button", { name: "Настройки" }).tap();
  await sheetPanel(page).waitFor({ state: "visible", timeout: 10_000 });

  const card = sheetPanel(page).locator("section", { hasText: "Код для внешнего сервиса" }).last();
  await card.getByRole("button", { name: "Получить код" }).click();

  const code = card.locator("code");
  await code.waitFor({ state: "visible", timeout: 15_000 });
  const value = (await code.innerText()).trim();
  check(value.length >= 4, `код показан и непустой (${value.length} знаков)`);
  await checkText(card, "Истекает через", "рядом видно, сколько код живёт");
  check(
    sql(`select count(*) from "PairingCode" where "userId"='${user.id}' and "consumedAt" is null`) !== "0",
    "код действительно заведён на сервере",
  );

  await browser.close();
});

/* ────────────────────────  Шторка  ──────────────────────── */

test("Шторка: закрывается свайпом вниз пальцем", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, "/account");

  await page.getByRole("button", { name: "Изменить имя" }).tap();
  const panel = sheetPanel(page);
  await panel.waitFor({ state: "visible", timeout: 10_000 });
  await page.waitForTimeout(500);

  const box = await panel.boundingBox();
  const x = Math.round(box.x + box.width / 2);
  const top = Math.round(box.y + 16); // ручка и шапка — зона захвата листа

  // Короткое движение лист не закрывает: случайное касание не должно
  // сбрасывать форму.
  await swipe(panel, [x, top], [x, top + 30], 6);
  await page.waitForTimeout(500);
  await checkVisible(panel, "от короткого движения лист остался на месте");

  await swipe(panel, [x, top], [x, top + 260], 14);
  await sheet(page).waitFor({ state: "detached", timeout: 10_000 });
  check(true, "свайп вниз закрыл шторку");
  await checkVisible(page.locator('[data-section="account"] h1'), "под ней снова профиль");

  await browser.close();
});

test("Шторка: закрывается тапом по затемнению и по Escape", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, "/account");

  await page.getByRole("button", { name: "Изменить имя" }).tap();
  await sheetPanel(page).waitFor({ state: "visible", timeout: 10_000 });
  await page.waitForTimeout(400);
  const scrimBox = await sheetScrim(page).boundingBox();
  await page.touchscreen.tap(Math.round(scrimBox.width / 2), 60);
  await sheet(page).waitFor({ state: "detached", timeout: 10_000 });
  check(true, "тап по затемнению закрыл шторку");

  await page.getByRole("button", { name: "Изменить имя" }).tap();
  await sheetPanel(page).waitFor({ state: "visible", timeout: 10_000 });
  await page.keyboard.press("Escape");
  await sheet(page).waitFor({ state: "detached", timeout: 10_000 });
  check(true, "Escape закрыл шторку");

  await browser.close();
});

test("Шторка: длинное содержимое прокручивается и от этого не закрывается", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, "/account");

  await page.getByRole("button", { name: "Настройки" }).tap();
  const panel = sheetPanel(page);
  await panel.waitFor({ state: "visible", timeout: 10_000 });
  await page.waitForTimeout(600);

  check(
    await panel.evaluate((el) => el.scrollHeight > el.clientHeight + 40),
    "настройки длиннее листа — есть что прокручивать",
  );

  await panel.evaluate((el) => el.scrollTo({ top: 240, behavior: "auto" }));
  await page.waitForTimeout(300);
  const scrolled = await panel.evaluate((el) => el.scrollTop);
  check(scrolled > 0, `содержимое прокрутилось (scrollTop ${Math.round(scrolled)})`);
  await checkVisible(panel, "лист при прокрутке остался открыт");

  // Прокрученный лист тянуть вниз нельзя: жест принадлежит содержимому,
  // иначе настройки закрывались бы при каждой попытке вернуться наверх.
  const box = await panel.boundingBox();
  const x = Math.round(box.x + box.width / 2);
  const mid = Math.round(box.y + box.height / 2);
  await swipe(panel, [x, mid], [x, mid + 220], 14);
  await page.waitForTimeout(600);
  await checkVisible(panel, "движение пальцем по содержимому не закрыло настройки");

  // А нижняя часть настроек после прокрутки реально доступна.
  await panel.evaluate((el) => el.scrollTo({ top: el.scrollHeight, behavior: "auto" }));
  await page.waitForTimeout(400);
  await checkVisible(
    panel.getByText("Код для внешнего сервиса"),
    "до последней группы настроек можно домотать",
  );

  await browser.close();
});

test("Профиль: ползунок приоритета не уводит раздел вбок", async () => {
  // Регрессия: палец по ползунку ходит влево-вправо, и жест перехватывал
  // свайп между разделами — вместе со значением уезжал весь экран.
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, "/account");

  const slider = page.locator('input[type="range"]').first();
  await slider.scrollIntoViewIfNeeded();
  const box = await slider.boundingBox();
  const before = await slider.inputValue();

  // тянем от текущей точки к правому краю ползунка, с промежуточными шагами
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height / 2);
  await page.mouse.down();
  for (let i = 5; i <= 10; i++) {
    await page.mouse.move(box.x + (box.width * i) / 10, box.y + box.height / 2);
    await page.waitForTimeout(16);
  }
  await page.mouse.up();
  await page.waitForTimeout(400);

  check(page.url().includes("/account"), `раздел остался на месте (${page.url()})`);
  check(
    Number(await slider.inputValue()) > Number(before),
    `значение выросло: было ${before}, стало ${await slider.inputValue()}`,
  );
  await browser.close();
});
