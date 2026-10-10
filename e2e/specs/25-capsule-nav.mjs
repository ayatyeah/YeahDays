import { mkdirSync } from "node:fs";
import { test, check, newUser, session } from "../harness.mjs";
test("Навигация: живая капсула, пять разделов и узкий экран", async () => {
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
  mkdirSync("artifacts/capsule-nav", { recursive: true });
  try {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto("/today", { waitUntil: "networkidle" });
    const nav = page.locator(".yg-capsule");
    await nav.waitFor();
    for (const index of [0, 1, 2, 3, 4, 0]) {
      await nav.locator("button").nth(index).click();
      await page.waitForFunction(
        (i) =>
          document
            .querySelectorAll(".yg-capsule button")
            [i]?.getAttribute("aria-current") === "page",
        index,
      );
      await page.waitForTimeout(300);
      const geometry = await nav.evaluate((el) => {
        const buttons = [...el.querySelectorAll("button")];
        return {
          count: buttons.length,
          active: buttons.filter(
            (b) => b.getAttribute("aria-current") === "page",
          ).length,
          buttons: buttons.map((b) => {
            const r = b.getBoundingClientRect();
            return {
              x: r.x,
              right: r.right,
              width: r.width,
              height: r.height,
              name: b.getAttribute("aria-label"),
            };
          }),
          labels: buttons.map(
            (b) =>
              getComputedStyle(b.querySelector(".yg-capsule-label")).opacity,
          ),
        };
      });
      check(
        geometry.count === 5 && geometry.active === 1,
        "пять разделов, одна активная вкладка",
      );
      check(
        geometry.buttons.every(
          (b) =>
            b.width >= 44 &&
            b.height >= 44 &&
            b.x >= 0 &&
            b.right <= 320 &&
            b.name,
        ),
        "доступные названия и области нажатия минимум 44px",
      );
      check(
        geometry.labels.filter((x) => x === "1").length === 1,
        "видна только активная подпись",
      );
    }
    for (const locale of ["ru", "en", "kk"]) {
      await page.evaluate(
        (l) =>
          localStorage.setItem(
            "yg-locale",
            JSON.stringify({ state: { locale: l }, version: 0 }),
          ),
        locale,
      );
      await page.reload({ waitUntil: "networkidle" });
      await nav.waitFor();
      for (const width of [320, 390]) {
        await page.setViewportSize({ width, height: 844 });
        await page.waitForTimeout(350);
        const clipped = await nav
          .locator("[aria-current] .yg-capsule-label>span")
          .evaluate((el) => el.scrollWidth > el.clientWidth + 1);
        check(
          !clipped,
          "активная подпись помещается на " + locale + " " + width,
        );
        await page.screenshot({
          path: `artifacts/capsule-nav/${locale}-${width}.png`,
          fullPage: false,
        });
      }
    }
    await page.goto("/events/computer-vision-midterm", {
      waitUntil: "networkidle",
    });
    check(
      (await nav.locator("button").nth(1).getAttribute("aria-current")) ===
        "page",
      "ивенты сохраняют активную Учёбу",
    );
    await page.setViewportSize({ width: 1440, height: 900 });
    check(!(await nav.isVisible()), "на десктопе остаётся сайдбар");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() =>
      localStorage.setItem(
        "yeahdays-theme",
        JSON.stringify({ state: { theme: "dark" }, version: 0 }),
      ),
    );
    await page.goto("/today", { waitUntil: "networkidle" });
    await nav.waitFor();
    await page.emulateMedia({ reducedMotion: "reduce" });
    check(
      (await nav
        .locator("button")
        .first()
        .evaluate((el) => getComputedStyle(el).transitionDuration)) === "0s",
      "учтено уменьшение движения",
    );
    await page.screenshot({
      path: "artifacts/capsule-nav/dark.png",
      fullPage: false,
    });
  } finally {
    await browser.close();
  }
});
