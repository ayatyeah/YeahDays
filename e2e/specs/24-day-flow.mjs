import { mkdirSync } from "node:fs";
import { test, check, newUser, session } from "../harness.mjs";
test("День: следующий шаг, подзадачи, результат и отмена", async () => {
  const day = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Almaty",
  }).format(new Date());
  const user = await newUser({
    state: {
      todos: [
        {
          id: "flow-task",
          title: "Подготовить доклад",
          date: day,
          duration: 10,
          priority: "high",
          subtasks: [],
          done: false,
          doneDays: [],
          createdAt: Date.now(),
          completedAt: null,
        },
      ],
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
  mkdirSync("artifacts/day-flow", { recursive: true });
  try {
    await page.goto("/today", { waitUntil: "networkidle" });
    await page.locator(".one-action-plan > summary").click();
    await page
      .getByRole("button", { name: "Начать с этого", exact: true })
      .click();
    await page
      .getByLabel("Первый маленький шаг", { exact: true })
      .fill("Написать три тезиса");
    await page
      .getByRole("button", { name: "Добавить шаг", exact: true })
      .click();
    await page
      .getByRole("checkbox", { name: "Написать три тезиса", exact: true })
      .check();
    await page
      .getByRole("button", { name: "Дело выполнено", exact: true })
      .click();
    await page.getByRole("region", { name: "Результат действия" }).waitFor();
    check(
      await page
        .locator(".flow-result")
        .innerText()
        .then((s) => s.includes("Подготовить доклад")),
      "результат содержит выполненное дело",
    );
    await page
      .getByRole("button", { name: "Отменить выполнение", exact: true })
      .click();
    check(
      await page
        .getByRole("button", {
          name: "Выполнить: Подготовить доклад",
          exact: true,
        })
        .isVisible(),
      "отмена вернула задачу в план",
    );
    await page
      .getByRole("button", { name: "Начать с этого", exact: true })
      .click();
    check(
      await page
        .getByRole("checkbox", { name: "Написать три тезиса", exact: true })
        .isChecked(),
      "подшаг не потерян при отмене",
    );
    await page
      .getByRole("button", { name: "Вернуться к плану", exact: true })
      .click();
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await page
        .locator('[data-section="today"]')
        .evaluate((el) => el.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(250);
      await page.screenshot({
        path: `artifacts/day-flow/today-${width}.png`,
        fullPage: true,
      });
      check(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        "нет горизонтального переполнения",
      );
    }
    await page
      .getByRole("button", {
        name: "Выполнить: Подготовить доклад",
        exact: true,
      })
      .click();
    await page.getByRole("region", { name: "Результат действия" }).waitFor();
    await page.screenshot({
      path: "artifacts/day-flow/result.png",
      fullPage: true,
    });
  } finally {
    await browser.close();
  }
});
