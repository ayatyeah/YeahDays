import { check, newUser, openSection, session, test } from "../harness.mjs";

test("CN inline: lecture cards open full materials and preserve quiz progress", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user, engine: "chromium" });
  try {
    await openSection(page, "/events/computer-networks-endterm");
    const progress = { "cne-m8": { best: 0.75, last: 0.75, attempts: 2 } };
    const saved = await page.request.put("/api/study-events/computer-networks-endterm", { data: { progress } });
    check(saved.ok(), "existing quiz result saved for test account");
    await page.evaluate(() => {
      localStorage.setItem("yg-event-notes-length", "short");
      localStorage.setItem("yg-event-lang", "ru");
      localStorage.setItem("yg-event-notes-mode", "scroll");
    });
    await page.reload();
    const first = page.getByRole("button", { name: /^Часть 1\. Модуль 8/ });
    await first.getByText("75%", { exact: true }).waitFor();
    check((await first.innerText()).includes("Полный конспект RU/EN"), "lecture card advertises updated material");
    await first.click();
    const notes = page.getByTestId("lecture-notes");
    const study = page.getByTestId("network-part-study");
    await notes.waitFor();
    const translation = page.getByTestId("notes-fixed-translation");
    await notes.locator("h3").last().scrollIntoViewIfNeeded();
    check(await translation.evaluate(el => { const r = el.getBoundingClientRect(); return getComputedStyle(el).position === "fixed" && r.top >= 0 && r.bottom < innerHeight && r.right <= innerWidth; }), "translation stays visible after scrolling on mobile");
    await translation.getByRole("button").click();
    await notes.locator('[data-selection-notes][lang="en"]').waitFor();
    check(await notes.locator("[data-selection-notes]").getAttribute("lang") === "en", "fixed translation switches to English");
    await translation.getByRole("button").click();
    await notes.locator('[data-selection-notes][lang="ru"]').waitFor();
    check(await notes.locator("[data-selection-notes]").getAttribute("lang") === "ru", "fixed translation switches back to Russian");
    check(await notes.getAttribute("data-notes-version") === "full", "lecture card overrides old short/scroll preference");
    check((await notes.innerText()).includes("192.168.1.254"), "question-focused routing explanation is in the existing part");
    await study.getByRole("button", { name: "Самопроверка · 3", exact: true }).click();
    check(await study.locator("article").count() === 3, "recall contains only this module");
    await study.locator("summary").first().click();
    check((await study.locator("details[open]").innerText()).includes("Remote network"), "recall explanation available inline");
    await study.getByRole("button", { name: "Все вопросы части · 65", exact: true }).click();
    check(await study.locator("article").count() === 65, "all module questions available inline");
    const routeQuestion = study.locator("article").filter({ hasText: "E699 ·" });
    await routeQuestion.locator("summary").click();
    check((await routeQuestion.locator("details[open]").innerText()).includes("192.168.1.254"), "specific next-hop explanation revealed");
    await page.getByRole("group", { name: "Язык конспекта" }).getByRole("button", { name: "EN", exact: true }).click();
    check((await routeQuestion.locator("details[open]").innerText()).includes("A remote route reaches"), "inline answer follows RU/EN switch");
    await study.getByRole("button", { name: "Конспект", exact: true }).click();
    check((await notes.innerText()).includes("192.168.1.254"), "updated English notes in the same reader");
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "inline materials fit mobile viewport");
    await page.setViewportSize({ width: 1280, height: 900 });
    await study.scrollIntoViewIfNeeded();
    await page.screenshot({ path: "e2e/.out/cn-inline-desktop.png" });
    await page.getByRole("button", { name: "Начать квиз по этой части · 8 вопросов", exact: true }).click();
    await page.getByText("Вопрос 1 из 8", { exact: true }).waitFor();
    check(true, "original eight-question quiz remains available");
    const after = await (await page.request.get("/api/study-events/computer-networks-endterm")).json();
    check(JSON.stringify(after.progress) === JSON.stringify(progress), "reading materials and starting quiz preserve saved scores and attempts");
    await page.reload();
    await first.getByText("75%", { exact: true }).waitFor();
    const modules = [[8,5,65],[9,5,49],[10,5,65],[11,6,64],[12,7,56],[13,7,39],[14,8,67],[15,9,70],[16,10,83]];
    for (const [module, lecture, count] of modules) {
      const fold = page.locator(`#route-cne-l${lecture}`);
      if (!await fold.evaluate(el => el.open)) await fold.locator("summary").first().click();
      await fold.getByRole("button", { name: new RegExp(`^Часть \\d+\\. Модуль ${module} —`) }).click();
      await notes.waitFor();
      check(await study.getAttribute("data-module") === String(module) && await study.getByRole("button", { name: `Все вопросы части · ${count}`, exact: true }).count() === 1, `module ${module} opens its own full notes and question bank`);
      await page.getByRole("button", { name: "← К маршруту", exact: true }).click();
    }
  } finally { await browser.close(); }
});
