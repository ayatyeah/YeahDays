import { mkdirSync } from "node:fs";
import { test, check, newUser, session } from "../harness.mjs";

test("Монохром: экраны, логотип, кольца и учебные карточки на трёх языках", async () => {
  const day = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Almaty",
  }).format(new Date());
  const user = await newUser({
    state: {
      todos: [
        "Прочитать 15 страниц",
        "20 минут английского",
        "Выйти на прогулку",
      ].map((title, i) => ({
        id: `mono-${i}`,
        title,
        date: day,
        priority: "normal",
        subtasks: [],
        done: false,
        doneDays: [],
        createdAt: Date.now(),
        completedAt: null,
      })),
    },
  });
  const { browser, page } = await session({
    user,
    serviceWorkers: "block",
    initScript: () => {
      localStorage.setItem("yd-install-dismissed", "1");
      localStorage.setItem(
        "yeahdays-theme",
        JSON.stringify({ state: { theme: "light" }, version: 0 }),
      );
    },
  });
  const out = "artifacts/monochrome";
  mkdirSync(out, { recursive: true });
  try {
    await page.route("**/api/learning", (r) =>
      r.fulfill({
        json: {
          revision: 999,
          available: true,
          xp: 100,
          coins: 40,
          owned: ["default"],
          equipped: "default",
          skills: [
            {
              id: "cv",
              title: "Computer Vision",
              subject: { name: "Computer Vision", materials: "" },
              minutes: 20,
              goal: "Понять основы",
              createdAt: new Date().toISOString(),
              quests: Array.from({ length: 6 }, (_, i) => ({
                id: `q${i}`,
                title: "Свёртки и фильтры",
                lesson: "Материалы занятия",
                exercise: "Объясни своими словами",
                completed: i < 2,
                completedAt: i < 2 ? new Date().toISOString() : null,
                feedback: "",
                attempts: 0,
                boss: i === 5,
              })),
            },
          ],
        },
      }),
    );
    for (const locale of ["ru", "en", "kk"]) {
      await page.evaluate(
        (locale) =>
          localStorage.setItem(
            "yg-locale",
            JSON.stringify({ state: { locale }, version: 0 }),
          ),
        locale,
      );
      for (const width of [390, 1440]) {
        await page.setViewportSize({
          width,
          height: width === 390 ? 844 : 900,
        });
        await page.goto("/learn", { waitUntil: "networkidle" });
        await page.reload({ waitUntil: "networkidle" });
        await page.locator(".learning-event").first().waitFor();
        check(
          (await page.locator(".learning-event").count()) >= 4,
          `все курсы ${locale}/${width}`,
        );
        check(
          (await page
            .locator(
              '.learning-event[href="/events/computer-vision-midterm"] .learning-event-badges',
            )
            .count()) === 1,
          "CV с бейджами",
        );
        check(
          await page.evaluate(
            () => document.documentElement.scrollWidth === innerWidth,
          ),
          `нет горизонтального скролла ${locale}/${width}`,
        );
        if (locale === "en")
          check(
            !/[А-Яа-яЁё]/.test(
              (
                await page
                  .locator(".learning-event-badges, .learning-event-progress")
                  .allTextContents()
              ).join(" "),
            ),
            "бейджи и счётчики переведены целиком",
          );
        const logo = page.locator(".mono-brand img");
        check(
          await logo.evaluate((i) => i.complete && i.naturalWidth > 0),
          "логотип загрузился",
        );
        check(
          await page
            .locator(".learning-event")
            .evaluateAll((els) =>
              els.every(
                (el) =>
                  getComputedStyle(el).backgroundColor === "rgb(23, 23, 25)",
              ),
            ),
          "все карточки экзаменов чёрные",
        );
        await page.screenshot({
          path: `${out}/learn-${locale}-${width}.png`,
          fullPage: true,
        });
        await page.goto("/events/computer-vision-midterm", {
          waitUntil: "networkidle",
        });
        check(
          (await page.locator(".companion-mini-guide").count()) === 0,
          "на ивенте нет баннера маскота",
        );
        await page.evaluate(() => window.scrollTo(0, 0));
        if (width === 1440)
          check(
            await page.locator(".yg-sidebar").evaluate((el) => {
              const style = getComputedStyle(el);
              return (
                style.position === "fixed" &&
                style.top === "0px" &&
                Math.abs(
                  el.getBoundingClientRect().top +
                    (visualViewport?.offsetTop ?? 0),
                ) < 2
              );
            }),
            "сайдбар закреплён у верхнего края на ивенте",
          );
        await page.screenshot({
          path: `${out}/event-${locale}-${width}.png`,
          fullPage: true,
        });
      }
    }
    await page.evaluate(() =>
      localStorage.setItem(
        "yg-locale",
        JSON.stringify({ state: { locale: "ru" }, version: 0 }),
      ),
    );
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      for (const route of ["today", "progress"]) {
        await page.goto(`/${route}`, { waitUntil: "networkidle" });
        await page
          .locator(route === "today" ? ".flow-next" : ".mono-rings")
          .waitFor();
        await page.screenshot({
          path: `${out}/${route}-ru-${width}.png`,
          fullPage: true,
        });
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/today", { waitUntil: "networkidle" });
    check(
      await page
        .locator(".mono-helper-row img")
        .evaluate((i) => i.complete && i.naturalWidth > 0),
      "маленький маскот загрузился напрямую",
    );
    await page
      .getByRole("button", { name: "Добавить задачу", exact: true })
      .click();
    await page.locator("input[data-quick-todo]").fill("Проверить новый дизайн");
    await page.locator("input[data-quick-todo]").press("Enter");
    check(
      (await page
        .locator(".companion-task")
        .filter({ hasText: "Проверить новый дизайн" })
        .count()) === 1,
      "плюс открывает рабочую форму добавления",
    );
    await page.goto("/today", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Время для фокуса/ }).click();
    await page.getByRole("timer").waitFor();
    check(
      (await page.locator("dialog img").count()) === 0,
      "в помощнике нет огромного маскота",
    );
    await page
      .getByRole("button", { name: "Закрыть помощника", exact: true })
      .click();
    await page.goto("/events/research-methods-quiz-1", {
      waitUntil: "networkidle",
    });
    await page
      .getByRole("button", { name: "Начать с первой части", exact: true })
      .click();
    await page.locator("article").waitFor();
    await page.screenshot({ path: `${out}/notes-ru-390.png`, fullPage: false });
    await page
      .getByRole("button", { name: /Начать квиз по этой части/ })
      .click();
    await page.locator("section h2[lang='en']").waitFor();
    await page.screenshot({ path: `${out}/quiz-ru-390.png`, fullPage: false });
    await page.locator("section button[lang='en']").first().click();
    await page.screenshot({
      path: `${out}/quiz-answer-ru-390.png`,
      fullPage: false,
    });
  } catch (error) {
    await page.screenshot({ path: `${out}/error.png`, fullPage: false });
    throw error;
  } finally {
    await browser.close();
  }
});
