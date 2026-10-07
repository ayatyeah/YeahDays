import { test, check, newUser, session } from "../harness.mjs";

test("Учёба: обзор, маршрут, практика и создание", async () => {
  const user = await newUser();
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
  const titles = [
    "Основы изображений",
    "Линейные модели",
    "Свёртки и фильтры",
    "Нейронные сети",
    "Практика",
    "Финальный проект",
  ];
  const state = {
    revision: 100,
    available: true,
    xp: 100,
    coins: 40,
    owned: ["default"],
    equipped: "default",
    skills: [
      {
        id: "cv",
        title: "Изображения и модели",
        subject: { name: "Computer Vision", materials: "" },
        goal: "Понять основы компьютерного зрения",
        minutes: 20,
        createdAt: new Date().toISOString(),
        quests: titles.map((title, i) => ({
          id: `q${i}`,
          title,
          lesson:
            "Фильтр проходит по изображению и выделяет локальные признаки.\n\nНапример, края и текстуры.",
          exercise: "Объясни, зачем фильтру смотреть на соседние пиксели.",
          boss: i === 5,
          completed: i < 2,
          attempts: 0,
          feedback: "",
          completedAt: i < 2 ? new Date().toISOString() : null,
        })),
      },
    ],
  };
  let attempts = 0,
    created = false;
  try {
    await page.route("**/api/learning/subjects", (r) =>
      r.fulfill({
        json: {
          subjects: ["Computer Vision", "Cloud Computing"],
          connected: true,
        },
      }),
    );
    await page.route("**/api/learning", async (r) => {
      if (r.request().method() === "GET") return r.fulfill({ json: state });
      const body = r.request().postDataJSON();
      if (body.action === "answer") {
        check(
          body.skillId === "cv" && body.questId === "q2",
          "ответ отправлен для выбранного квеста",
        );
        attempts++;
        state.revision++;
        const q = state.skills[0].quests[2];
        q.feedback =
          attempts === 1
            ? "Уточни, какую информацию дают соседние пиксели."
            : "Верно: соседние пиксели помогают находить локальные признаки.";
        if (attempts > 1) {
          q.completed = true;
          q.completedAt = new Date().toISOString();
          state.xp += 50;
          state.coins += 20;
        }
        return r.fulfill({
          json: {
            state,
            result: {
              passed: attempts > 1,
              awarded: attempts > 1,
              xp: attempts > 1 ? 50 : 0,
              coins: attempts > 1 ? 20 : 0,
            },
          },
        });
      }
      if (body.action === "create") {
        check(
          body.subject.name === "Cloud Computing" && body.minutes === 10,
          "предмет и длительность переданы серверу",
        );
        created = true;
        state.revision++;
        state.skills.push({
          ...structuredClone(state.skills[0]),
          id: "cloud",
          subject: { name: "Cloud Computing", materials: "" },
          title: "Облачные платформы",
          quests: state.skills[0].quests.map((q) => ({
            ...q,
            completed: false,
            feedback: "",
            completedAt: null,
          })),
        });
        return r.fulfill({ json: { state, skillId: "cloud" } });
      }
      throw Error("Unexpected learning request");
    });
    await page.goto("/learn", { waitUntil: "networkidle" });
    await page.reload({ waitUntil: "networkidle" });
    await page
      .getByRole("button", { name: "Продолжить", exact: true })
      .waitFor();
    check(
      (await page.locator(".learning-hero-mascot").count()) === 1,
      "один маскот в обзоре",
    );
    await page.screenshot({
      path: "artifacts/learning-concepts/implemented-mobile.png",
      fullPage: true,
    });
    await page.locator(".learning-subject").first().click();
    await page.locator(".learning-route").waitFor();
    check(
      await page.locator(".learning-route button").nth(3).isDisabled(),
      "будущий квест заблокирован",
    );
    check(
      (await page.locator(".learning-page img").count()) === 0,
      "маршрут без декоративных маскотов",
    );
    await page.screenshot({
      path: "artifacts/learning-concepts/implemented-route.png",
      fullPage: true,
    });
    await page.locator(".learning-route button").nth(2).click();
    await page.getByRole("tab", { name: "Практика", exact: true }).waitFor();
    await page.screenshot({
      path: "artifacts/learning-concepts/implemented-lesson.png",
      fullPage: true,
    });
    await page.getByRole("tab", { name: "Практика", exact: true }).click();
    await page
      .getByLabel("Твой ответ", { exact: true })
      .fill("Первый вариант ответа");
    await page
      .getByRole("button", { name: "Проверить ответ", exact: true })
      .click();
    await page
      .getByText("Уточни, какую информацию дают соседние пиксели.", {
        exact: true,
      })
      .waitFor();
    await page
      .getByLabel("Твой ответ", { exact: true })
      .fill("Соседние пиксели дают локальный контекст для обнаружения краёв.");
    await page
      .getByRole("button", { name: "В план на сегодня", exact: true })
      .click();
    await page
      .getByRole("status")
      .filter({ hasText: /Квест добавлен/ })
      .waitFor();
    await page
      .getByRole("button", { name: "Проверить ответ", exact: true })
      .click();
    await page.getByText("Зачтено", { exact: true }).waitFor();
    check(
      page.url().includes("quest=q2"),
      "после проверки открыт прежний квест с обратной связью",
    );
    await page
      .getByRole("button", { name: "Следующий квест", exact: true })
      .click();
    await page
      .getByRole("heading", { name: "Нейронные сети", exact: true })
      .waitFor();
    await page.goto("/learn?view=lesson&skill=cv&quest=q5", {
      waitUntil: "networkidle",
    });
    check(
      (await page.locator(".learning-notice").allTextContents()).some((x) =>
        x.includes("Сначала заверши"),
      ),
      "прямая ссылка не открывает будущий урок",
    );
    await page.goto("/learn?view=create", { waitUntil: "networkidle" });
    await page.getByLabel("Предмет", { exact: true }).fill("Cloud Computing");
    await page.getByLabel("Время на квест", { exact: true }).selectOption("10");
    await page
      .getByRole("button", { name: "Создать маршрут", exact: true })
      .click();
    await page.locator(".learning-route").waitFor();
    check(created, "новый маршрут создан");
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/learn", { waitUntil: "networkidle" });
      await page.locator(".learning-continue").waitFor();
      check(
        await page.evaluate(
          () => document.documentElement.scrollWidth === innerWidth,
        ),
        `обзор без горизонтального скролла на ${width}px`,
      );
    }
    await page.screenshot({
      path: "artifacts/learning-concepts/implemented-desktop.png",
      fullPage: true,
    });
    state.available = false;
    state.revision++;
    await page.goto("/learn?view=create", { waitUntil: "networkidle" });
    await page.reload({ waitUntil: "networkidle" });
    check(
      await page
        .getByRole("button", { name: "Создать маршрут", exact: true })
        .isDisabled(),
      "при недоступном ИИ создание заблокировано",
    );
  } catch (error) {
    console.log(await page.locator("body").innerText());
    await page.screenshot({
      path: "artifacts/learning-concepts/implementation-error.png",
    });
    throw error;
  } finally {
    await browser.close();
  }
});
