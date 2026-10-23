// Траектории: цель → стартовый тест → план дня → юнит → видео → адаптивная
// проверка → круг и лента. Нужен сервер с PATH_AI_FAKE=1 (фейковый ИИ):
// верный вариант в тестовых вопросах начинается со слова «Верно».
import { mkdirSync, writeFileSync } from "node:fs";
import { check, checkVisible, newUser, session, test } from "../harness.mjs";

const material = "LEFT JOIN возвращает все строки левой таблицы. Если пары нет, поля правой таблицы равны NULL. INNER JOIN оставляет только совпадения. GROUP BY собирает строки в группы. HAVING фильтрует группы после агрегации.";

async function answerUntilDone(page, { hint = false } = {}) {
  let asked = 0;
  for (; asked < 12; asked++) {
    await page.getByRole("button", { name: "Ответить" }).waitFor();
    if (hint && asked === 0) {
      await page.getByRole("button", { name: /^Подсказка/ }).click();
      await page.getByText("Подсказка 1:").waitFor();
    }
    const right = page.locator(".path-option", { hasText: /^Верно:/ });
    if (await right.count()) await right.first().click();
    else await page.getByLabel("Твой ответ").fill("Главная мысль юнита: строки слева сохраняются. Например, студенты без оценок остаются в выборке.");
    await page.getByRole("button", { name: "Ответить" }).click();
    await page.locator(".path-feedback").waitFor();
    if (await page.getByText("Проверка завершена.").isVisible()) return asked + 1;
    await page.getByRole("button", { name: "Дальше" }).click();
  }
  return asked;
}

const noOverflow = (page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);

test("Траектории: цель, стартовый тест, план, юнит, видео, проверка и круг", async () => {
  mkdirSync("artifacts/pathways", { recursive: true });
  const owner = await newUser();
  const friend = await newUser();
  const a = await session({ user: owner, serviceWorkers: "block" });
  let b;
  try {
    const page = a.page;
    await page.goto("/learn", { waitUntil: "load" });
    await page.getByRole("heading", { name: "Мои траектории" }).waitFor();
    await page.getByRole("link", { name: "Построить траекторию" }).click();
    await page.waitForURL("**/learn/new");
    await page.getByRole("heading", { name: "Чему научимся?" }).waitFor();
    await page.waitForTimeout(800);
    await page.getByLabel("Цель").fill("Подготовиться к мидтерму по SQL");
    await page.getByLabel(/Свой материал/).fill(material);
    await page.getByRole("button", { name: "Построить траекторию" }).click();
    await page.waitForURL(/\/learn\/g\/[^/]+$/, { timeout: 60_000 });
    const goalUrl = new URL(page.url()).pathname;
    await page.getByRole("heading", { name: /Траектория: Подготовиться/ }).waitFor();
    check(await page.getByText("Юнитов пройдено: 0 из 5").isVisible(), "карта: 5 юнитов, ничего не пройдено");

    // Стартовый тест — по вопросу на навык.
    await page.getByRole("button", { name: "Пройти тест" }).click();
    await page.getByText("Вопрос 1 из 5").waitFor();
    for (let i = 0; i < 5; i++) {
      await page.locator(".path-option", { hasText: /^Верно:/ }).first().click();
      await page.getByRole("button", { name: "Ответить" }).click();
      await page.getByText("Верно!", { exact: true }).waitFor();
      if (i < 4) await page.getByRole("button", { name: "Дальше" }).click();
    }
    await page.getByText("Проверка завершена.").waitFor();
    await page.getByRole("button", { name: "Готово" }).click();
    check(!(await page.getByRole("button", { name: "Пройти тест" }).isVisible()), "после стартового теста баннер исчезает");

    // Чек-ин → план дня с причиной и разбором факторов.
    await page.getByRole("button", { name: "Хорошо" }).click();
    await page.getByRole("button", { name: "15 мин" }).click();
    await page.getByRole("button", { name: "Собрать план на сегодня" }).click();
    await page.getByRole("heading", { name: "План на сегодня" }).waitFor();
    const minutes = await page.locator(".path-plan-item .path-chip").allInnerTexts();
    check(minutes.reduce((n, t) => n + (parseInt(t, 10) || 0), 0) <= 15, "план не больше свободных минут");
    const reason = (await page.locator(".path-plan-item .path-reason").first().innerText()).trim();
    check(/Пробел в навыке|Важно для твоей цели|Новая тема|Следующий шаг/.test(reason), `у шага есть причина: «${reason}»`);
    await page.getByRole("button", { name: "Почему?" }).first().click();
    await checkVisible(page.getByText("Пробел в знаниях"), "разбор причин по факторам");
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      check(await noOverflow(page), `экран цели без горизонтальной прокрутки на ${width}px`);
      await page.screenshot({ path: `artifacts/pathways/goal-${width}.png`, fullPage: true });
    }
    await page.setViewportSize({ width: 390, height: 844 });

    // Юнит пишется при открытии; цитата из материала.
    await page.locator(".path-plan-item").first().getByRole("link", { name: "Начать" }).click();
    await page.getByText(/Абзац 1 юнита/).waitFor({ timeout: 30_000 });
    await checkVisible(page.getByText("Из твоего материала:"), "юнит опирается на материал");

    // Видео: задача в фоне → плеер с расшифровкой и субтитрами.
    await page.getByRole("button", { name: "Сделать видео (~1 мин)" }).click();
    await page.getByRole("button", { name: "Смотреть" }).waitFor({ timeout: 45_000 });
    check(await page.locator(".path-video canvas").isVisible(), "плеер видео показан");
    check((await page.locator(".path-transcript button").count()) >= 15, "расшифровка по предложениям");
    await page.getByLabel("Поиск по расшифровке").fill("нет такого слова");
    await checkVisible(page.getByText("Ничего не нашлось"), "поиск по расшифровке работает");
    const vtt = await page.locator('a[href$="/captions"]').getAttribute("href");
    const captions = await page.evaluate((u) => fetch(u).then((r) => r.text()), vtt);
    check(captions.startsWith("WEBVTT"), "субтитры отдаются в WebVTT");
    await page.getByRole("tab", { name: "Источники" }).click();
    await checkVisible(page.getByText(/^¶1/), "панель источников с абзацами");
    await page.screenshot({ path: "artifacts/pathways/unit-video-390.png", fullPage: true });

    // Адаптивная проверка: подсказка, ответы до остановки, юнит пройден.
    await page.getByRole("button", { name: "Начать проверку" }).click();
    const asked = await answerUntilDone(page, { hint: true });
    check(asked >= 3 && asked <= 10, `проверка остановилась после ${asked} вопросов (3–10)`);
    await page.getByRole("button", { name: "Готово" }).click();
    await page.getByText("Пройден", { exact: true }).waitFor();
    await page.setViewportSize({ width: 320, height: 800 });
    check(await noOverflow(page), "экран юнита без горизонтальной прокрутки на 320px");
    await page.setViewportSize({ width: 390, height: 844 });

    // Круг: приглашение, челлендж недели.
    await page.goto(goalUrl, { waitUntil: "load" });
    await page.getByRole("tab", { name: "Круг" }).click();
    await page.getByText("1 из 3 юнитов").waitFor();
    const invite = await page.getByLabel("Ссылка-приглашение").inputValue();
    check(/\/learn\/join\/[\w-]+$/.test(invite), "у владельца есть ссылка-приглашение");

    b = await session({ user: friend, serviceWorkers: "block" });
    await b.page.goto(new URL(invite).pathname, { waitUntil: "load" });
    await b.page.getByRole("button", { name: "Присоединиться" }).click();
    await b.page.waitForURL(/\/learn\/g\/[^/]+$/);
    await b.page.getByRole("button", { name: "Пропустить" }).click();
    await b.page.getByRole("tab", { name: "Круг" }).click();
    await b.page.getByText("Участники", { exact: true }).waitFor();
    check((await b.page.locator(".path-member").count()) === 2, "друг видит обоих участников");
    check(!(await b.page.getByLabel("Ссылка-приглашение").count()), "участник не видит ссылку владельца");
    const event = b.page.locator(".path-event", { hasText: "юнит «Юнит 1: Основы» пройден" });
    await event.waitFor();
    check(!/\d+%/.test(await event.innerText()), "баллы владельца в ленте круга скрыты");

    // Репост цели в ленту сообщества → карточка ведёт в цель.
    await page.getByRole("button", { name: "Позвать в ленте сообщества" }).click();
    await page.getByText("Цель опубликована в ленте сообщества").waitFor();
    await page.goto("/community", { waitUntil: "load" });
    const card = page.locator("a", { hasText: "Учебная цель" }).first();
    await card.waitFor({ timeout: 20_000 });
    await card.click();
    await page.waitForURL((u) => u.pathname === goalUrl, { timeout: 20_000 });
    check(a.errors.filter((e) => !/Failed to load resource|favicon/i.test(e)).length === 0, `без ошибок в консоли (${a.errors.slice(0, 2).join(" | ")})`);
  } catch (error) {
    // Браузеры закрываются в finally раньше, чем раннер снимет экран, — сохраняем сами.
    mkdirSync("e2e/.out", { recursive: true });
    for (const [who, s] of [["owner", a], ["friend", b]]) {
      if (!s) continue;
      await s.page.screenshot({ path: `e2e/.out/pathways-${who}.png`, fullPage: true }).catch(() => {});
      writeFileSync(`e2e/.out/pathways-${who}.txt`, `${s.page.url()}\n${await s.page.innerText("body").catch(() => "")}\n${s.errors.join("\n")}`);
    }
    throw error;
  } finally {
    await a.browser.close();
    if (b) await b.browser.close();
  }
});
