import { describe, it, expect } from "vitest";
import { todoStartMin, todoEndMin, hoursCoveredAfterStart, fmtMin } from "@/lib/todoSpan";

describe("todoStartMin / todoEndMin", () => {
  it("двухчасовая лекция 11:00 + 110 мин кончается в 12:50", () => {
    const t = { hour: 11, minute: 0, duration: 110 };
    expect(todoStartMin(t)).toBe(11 * 60);
    expect(todoEndMin(t)).toBe(12 * 60 + 50);
  });

  it("без длительности конец — граница часа старта, как и было", () => {
    // Задача «на 14:00» остаётся делом часа 14 и не просрочена в 14:01.
    expect(todoEndMin({ hour: 14 })).toBe(15 * 60);
    expect(todoEndMin({ hour: 14, minute: 30 })).toBe(15 * 60);
  });

  it("без часа — null, а не NaN", () => {
    expect(todoStartMin({})).toBeNull();
    expect(todoEndMin({ duration: 60 })).toBeNull();
  });
});

describe("hoursCoveredAfterStart", () => {
  it("лекция 11:00–12:50 накрывает только 12", () => {
    expect(hoursCoveredAfterStart({ hour: 11, duration: 110 })).toEqual([12]);
  });

  it("трёхчасовая философия 12:00–14:50 накрывает 13 и 14", () => {
    expect(hoursCoveredAfterStart({ hour: 12, duration: 170 })).toEqual([13, 14]);
  });

  it("пара 13:05–13:55 не накрывает 14 — кончается до его начала", () => {
    expect(hoursCoveredAfterStart({ hour: 13, minute: 5, duration: 50 })).toEqual([]);
  });

  it("ровно до 13:00 — час 13 НЕ занят, задача кончилась в момент его начала", () => {
    expect(hoursCoveredAfterStart({ hour: 12, duration: 60 })).toEqual([]);
  });

  it("13:00 + 61 мин — уже цепляет 14", () => {
    expect(hoursCoveredAfterStart({ hour: 13, duration: 61 })).toEqual([14]);
  });

  it("без длительности ничего не накрывает", () => {
    expect(hoursCoveredAfterStart({ hour: 9 })).toEqual([]);
  });

  it("обрезается по последнему видимому часу сетки", () => {
    expect(hoursCoveredAfterStart({ hour: 21, duration: 240 }, 22)).toEqual([22]);
  });

  it("не вылезает за 23", () => {
    expect(hoursCoveredAfterStart({ hour: 22, duration: 300 })).toEqual([23]);
  });
});

describe("fmtMin", () => {
  it("минуты от полуночи в ЧЧ:ММ", () => {
    expect(fmtMin(12 * 60 + 50)).toBe("12:50");
    expect(fmtMin(9 * 60)).toBe("09:00");
  });
});
