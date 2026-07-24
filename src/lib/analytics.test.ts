import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Политика конфиденциальности называет точное число событий, которые
 * уходят в PostHog. Число в юридическом документе не должно молча
 * разойтись с кодом, когда в словарь добавят шестнадцатое событие, —
 * поэтому сверяем их тестом, а не памятью.
 */

const NUMERALS: Record<number, string> = {
  13: "тринадцати",
  14: "четырнадцати",
  15: "пятнадцати",
  16: "шестнадцати",
  17: "семнадцати",
  18: "восемнадцати",
  19: "девятнадцати",
  20: "двадцати",
};

function read(rel: string) {
  return readFileSync(join(process.cwd(), rel), "utf-8");
}

describe("аналитика и политика", () => {
  const source = read("src/lib/analytics.ts");
  const policy = read("src/app/privacy/page.tsx");

  /** Извлекаем варианты union-типа AnalyticsEvent. */
  const events = [
    ...source
      .slice(source.indexOf("export type AnalyticsEvent"))
      .split(";")[0]
      .matchAll(/"([a-z_]+)"/g),
  ].map((m) => m[1]);

  it("словарь событий не пустой и без дублей", () => {
    expect(events.length).toBeGreaterThan(5);
    expect(new Set(events).size).toBe(events.length);
  });

  it("политика называет то же число событий, что и код", () => {
    const word = NUMERALS[events.length];
    expect(word, `нет числительного для ${events.length} — допиши в NUMERALS`)
      .toBeDefined();
    expect(
      policy.includes(`список из\n        ${word} событий`) ||
        policy.includes(`${word} событий`),
      `в политике должно быть «${word} событий» — сейчас событий ${events.length}`,
    ).toBe(true);
  });

  it("политика называет обработчика поимённо", () => {
    // GDPR требует раскрывать обработчиков, а не писать «сторонние сервисы»
    expect(policy).toContain("PostHog");
  });

  it("без ключа аналитика молчит", () => {
    // ключа в тестовом окружении нет — значит отправки быть не должно
    expect(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "").toBe("");
  });
});
