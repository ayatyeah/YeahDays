import { describe, it, expect } from "vitest";
import {
  localHour,
  localDateKey,
  preferredHour,
  morningMessage,
  eveningMessage,
} from "./push";

/** Полдень UTC — удобная опора для проверки часовых поясов. */
const NOON_UTC = new Date("2026-07-23T12:00:00Z");

describe("локальное время подписчика", () => {
  it("UTC отдаёт свой же час", () => {
    expect(localHour(0, NOON_UTC)).toBe(12);
  });

  it("Алматы (UTC+5, offset -300) — на 5 часов вперёд", () => {
    expect(localHour(-300, NOON_UTC)).toBe(17);
  });

  it("Нью-Йорк (UTC-4, offset 240) — на 4 часа назад", () => {
    expect(localHour(240, NOON_UTC)).toBe(8);
  });

  it("дата считается по локальному дню, а не по UTC", () => {
    const lateUtc = new Date("2026-07-23T21:00:00Z");
    // UTC+5 → уже 2 часа ночи 24-го
    expect(localDateKey(-300, lateUtc)).toBe("2026-07-24");
    expect(localDateKey(0, lateUtc)).toBe("2026-07-23");
  });
});

describe("подбор времени напоминания", () => {
  it("без данных остаётся дефолт", () => {
    expect(preferredHour([], 20)).toBe(20);
    expect(preferredHour([21, 21], 20)).toBe(20); // выборки мало
  });

  it("подстраивается под час, когда человек реально закрывает дела", () => {
    // стабильно занимается в 22 → напоминаем в 21
    expect(preferredHour([22, 22, 22, 22, 22, 21], 20)).toBe(21);
  });

  it("не вылезает за разумные границы суток", () => {
    expect(preferredHour([0, 0, 0, 0, 0, 0], 20)).toBeGreaterThanOrEqual(6);
    expect(preferredHour([23, 23, 23, 23, 23], 20)).toBeLessThanOrEqual(23);
  });
});

describe("тексты уведомлений", () => {
  it("утром зовёт к плану, если он уже собран", () => {
    const m = morningMessage({ doneToday: 0, plannedToday: 3, streak: 4 });
    expect(m.body).toContain("3");
    expect(m.url).toBe("/today");
  });

  it("утром зовёт к колоде, если план пуст", () => {
    const m = morningMessage({ doneToday: 0, plannedToday: 0, streak: 4 });
    expect(m.url).toBe("/");
    expect(m.body).toContain("4"); // упоминаем стрик как мотивацию
  });

  it("вечером хвалит, если день уже закрыт", () => {
    const e = eveningMessage({ doneToday: 2, plannedToday: 3, streak: 5 });
    expect(e.title).toMatch(/засчитан/i);
  });

  it("вечером предупреждает про стрик, если ничего не сделано", () => {
    const e = eveningMessage({ doneToday: 0, plannedToday: 1, streak: 7 });
    expect(e.title).toContain("7");
  });

  it("новичку без стрика не давит цифрами", () => {
    const e = eveningMessage({ doneToday: 0, plannedToday: 0, streak: 0 });
    expect(e.title).not.toMatch(/\d/);
  });
});
