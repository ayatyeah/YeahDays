import { newUser, session, check, test } from "../harness.mjs";
import assert from "node:assert/strict";
test("Компаньон: задачи, помощник, таймер и гардероб", async () => {
  const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Almaty",
  }).format(new Date());
  const todos = [
    "Выучить 10 новых слов",
    "Прочитать 15 страниц",
    "Сделать тренировку",
  ].map((title, i) => ({
    id: `companion-${i}`,
    title,
    date: day,
    duration: i === 0 ? 10 : 20,
    priority: "normal",
    subtasks: [],
    done: false,
    doneDays: [],
    createdAt: Date.now(),
  }));
  let browser;
  try {
    const user = await newUser({ state: { todos } });
    const s = await session({
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
    browser = s.browser;
    const p = s.page;
    await p.goto("/today", { waitUntil: "networkidle" });
    await p.locator(".one-action-plan > summary").click();
    await p.getByRole("button", { name: "Открыть помощника" }).waitFor();
    await p.waitForTimeout(700);

    assert.equal(await p.locator(".companion-task").count(), 3);
    await p
      .getByRole("button", {
        name: "Выполнить: Выучить 10 новых слов",
        exact: true,
      })
      .click();
    assert.match(await p.locator(".flow-compact-progress").innerText(), /1 из 3/);
    await p.getByRole("button", { name: "Открыть помощника" }).click();
    await p.locator("dialog[open]").waitFor();
    await p.waitForTimeout(350);
    await p.getByRole("button", { name: /Разбить задачу/ }).click();
    await p
      .locator("dialog textarea")
      .fill("Открыть книгу\nПрочитать один абзац");
    await p
      .getByRole("button", { name: "Сохранить шаги", exact: true })
      .click();
    await p.getByRole("status").filter({ hasText: "Шаги добавлены" }).waitFor();
    await p.getByRole("button", { name: "Назад", exact: true }).click();
    await p.getByRole("button", { name: /Начать фокус/ }).click();
    await p.getByRole("button", { name: "Начать", exact: true }).click();
    await p.waitForTimeout(2300);
    assert.notEqual(await p.getByRole("timer").innerText(), "25:00");
    await p.getByRole("button", { name: "Пауза", exact: true }).click();
    const paused = await p.getByRole("timer").innerText();
    await p.waitForTimeout(1100);
    assert.equal(await p.getByRole("timer").innerText(), paused);
    await p.getByRole("button", { name: "Закрыть помощника" }).click();
    await p.getByRole("button", { name: "Прогресс", exact: true }).click();
    await p.getByRole("heading", { name: "Твой ритм", exact: true }).waitFor();
    await p.waitForTimeout(500);
    await p.getByText("Образ компаньона", { exact: true }).click();
    await p.getByRole("button", { name: "Уютный", exact: true }).click();
    assert.equal(
      await p
        .getByRole("button", { name: "Уютный", exact: true })
        .getAttribute("aria-pressed"),
      "true",
    );
    await p.reload({ waitUntil: "networkidle" });
    await p.getByText("Образ компаньона", { exact: true }).click();
    assert.equal(
      await p
        .getByRole("button", { name: "Уютный", exact: true })
        .getAttribute("aria-pressed"),
      "true",
    );
    await p.getByRole("button", { name: "Классика", exact: true }).click();
    for (const width of [320, 390, 1440]) {
      await p.setViewportSize({ width, height: 844 });
      await p.goto("/today", { waitUntil: "networkidle" });
    await p.locator(".one-action-plan > summary").click();
      await p.getByRole("button", { name: "Открыть помощника" }).waitFor();
      await p.waitForTimeout(400);
      const metrics = await p.evaluate(() => ({
        width: document.documentElement.scrollWidth,
        viewport: innerWidth,
        nav: document.querySelector(".yg-bottom-nav").getBoundingClientRect()
          .bottom,
        height: innerHeight,
      }));
      assert.equal(metrics.width, metrics.viewport);
      if (width < 1024) assert.equal(Math.round(metrics.nav), metrics.height);
      console.log(width, metrics);
    }
    check(
      true,
      "задачи, подзадачи, пауза таймера, сохранение образа и границы навигации проверены",
    );
    console.log(
      "Page errors:",
      s.errors.filter((x) => !x.includes("favicon")),
    );
  } finally {
    await browser?.close();
  }
});

test("Компаньон: пустой план и панель на маленьком экране", async () => {
  const user = await newUser();
  const { browser, page } = await session({
    user,
    serviceWorkers: "block",
    initScript: () => {
      localStorage.setItem("yd-install-dismissed", "1");
      localStorage.setItem(
        "yeahdays-theme",
        JSON.stringify({ state: { theme: "dark" }, version: 0 }),
      );
    },
  });
  try {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/today", { waitUntil: "networkidle" });
    await page.locator(".one-action-plan > summary").click();
    await page.getByRole("button", { name: "Открыть помощника" }).waitFor();
    check(
      (await page.locator(".companion-empty").count()) === 1,
      "пустой план предлагает первое действие",
    );
    await page.getByRole("button", { name: "Открыть помощника" }).click();
    await page.getByRole("button", { name: /Найти 10 минут/ }).click();
    await page
      .getByRole("link", { name: "Подобрать действие", exact: true })
      .waitFor();
    await page.keyboard.press("Escape");
    check(
      (await page.locator("dialog[open]").count()) === 0,
      "Escape закрывает помощника",
    );
    await page.getByRole("button", { name: "Открыть помощника" }).click();
    await page.waitForTimeout(350);
    const rect = await page.locator("dialog[open]").boundingBox();
    check(
      rect.x >= 0 &&
        rect.y >= 0 &&
        rect.width <= 320 &&
        rect.y + rect.height <= 569,
      "панель не выходит за экран 320×568, даже при масштабе раздела",
    );
    const dismiss = page.locator("dialog[open]").getByRole("button", {
      name: "Не сейчас",
      exact: true,
    });
    await dismiss.scrollIntoViewIfNeeded();
    await dismiss.click();
    check(
      (await page.locator("dialog[open]").count()) === 0,
      "кнопка закрытия достижима прокруткой",
    );
  } finally {
    await browser.close();
  }
});
