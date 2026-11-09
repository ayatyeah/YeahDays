import { check, newUser, openSection, session, test } from "../harness.mjs";

test("CN VRT: separate bank, filters, specific explanations and untouched progress", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user, engine: "chromium" });
  try {
    await openSection(page, "/events/computer-networks-endterm");
    const progress = { "cne-m8": { best: 0.75, last: 0.75, attempts: 2 } };
    const saved = await page.request.put("/api/study-events/computer-networks-endterm", { data: { progress } });
    check(saved.ok(), "seed existing quiz progress");
    await page.reload();
    await page.getByRole("button", { name: "ВРТ — вопросы", exact: true }).click();
    const root = page.getByTestId("cn-vrt");
    await root.getByRole("heading", { name: "ВРТ — вопросы", exact: true }).waitFor();
    check((await root.getByRole("status").innerText()).includes("Найдено: 100"), "all 100 entries available in separate bank");
    check(await root.getByTestId("vrt-question").count() === 15, "15 cards per page");
    check(await root.locator("details[open]").count() === 0, "answers initially hidden");
    const sets = root.getByLabel("Набор ВРТ", { exact: true });
    const search = root.getByLabel("Поиск по ВРТ", { exact: true });
    for (const set of ["1", "2", "3", "4"]) {
      await sets.selectOption(set);
      check((await root.getByRole("status").innerText()).includes("Найдено: 25"), `set ${set} contains 25 entries`);
    }
    await sets.selectOption("1");
    await root.getByRole("button", { name: "Следующая страница →", exact: true }).click();
    check(await root.getByTestId("vrt-question").count() === 10, "last set page contains remaining 10 entries");
    await sets.selectOption("all");
    await search.fill("vrt-1-19");
    const ack = root.locator('[data-question-id="vrt-1-19"]');
    await ack.waitFor();
    check(await root.getByTestId("vrt-question").count() === 1, "search finds exact question");
    await ack.locator("summary").click();
    check((await ack.getByTestId("vrt-answer").innerText()).includes("3001"), "two consecutive TCP payloads require ACK 3001");
    check((await ack.getByTestId("vrt-explanation").innerText()).includes("3001"), "ACK rationale includes the calculated next byte");
    check(await ack.locator("h2[data-selection-question][lang=en]").count() === 1 && await ack.locator('[data-testid="vrt-explanation"][data-selection-question][lang=ru]').count() === 1, "selection translation knows prompt and explanation languages");
    for (const id of ["vrt-3-15", "vrt-3-22", "vrt-4-11", "vrt-4-25"]) {
      await search.fill(id);
      const card = root.locator(`[data-question-id="${id}"]`);
      await card.getByTestId("vrt-caution").waitFor();
      check((await card.getByTestId("vrt-caution").innerText()).length > 10, `${id} flags incomplete condition`);
      await card.locator("summary").click();
      check((await card.getByTestId("vrt-explanation").innerText()).length > 60, `${id} explains how to solve with missing information`);
    }
    await search.fill("no_such_vrt_question_999");
    await root.getByText("Ничего не найдено. Попробуй другой запрос или выбери все наборы.").waitFor();
    check(await root.getByTestId("vrt-question").count() === 0, "empty search is clear");
    await search.fill("");
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.evaluate(() => document.documentElement.dataset.theme = "light");
    await page.screenshot({ path: "e2e/.out/cn-vrt-light-desktop.png" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => document.documentElement.dataset.theme = "dark");
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "mobile dark layout has no horizontal overflow");
    await page.screenshot({ path: "e2e/.out/cn-vrt-dark-mobile.png" });
    await root.getByRole("button", { name: "← К лекциям и конспектам", exact: true }).click();
    await page.getByRole("button", { name: "ВРТ — вопросы", exact: true }).waitFor();
    const after = await (await page.request.get("/api/study-events/computer-networks-endterm")).json();
    check(JSON.stringify(after.progress) === JSON.stringify(progress), "reading VRT leaves quiz results and attempts unchanged");
  } finally { await browser.close(); }
});
