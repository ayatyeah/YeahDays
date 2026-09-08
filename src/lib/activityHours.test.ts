import { describe, it, expect } from "vitest";
import { activityByHour, hourWindow } from "@/lib/activityHours";

const NOW = new Date(2026, 8, 9, 12, 0);
const at = (daysAgo: number, hour: number) =>
  new Date(2026, 8, 9 - daysAgo, hour, 30).getTime();

describe("activityByHour", () => {
  it("считает закрытия по часам и находит пик", () => {
    const plan = [
      { completedAt: at(0, 21) },
      { completedAt: at(1, 21) },
      { completedAt: at(2, 9) },
    ];
    const r = activityByHour([plan], NOW);
    expect(r.total).toBe(3);
    expect(r.peak).toBe(21);
    expect(r.hours[21]!.count).toBe(2);
    expect(r.hours[9]!.count).toBe(1);
  });

  it("складывает несколько источников", () => {
    const r = activityByHour([[{ completedAt: at(0, 8) }], [{ completedAt: at(0, 8) }]], NOW);
    expect(r.hours[8]!.count).toBe(2);
  });

  it("старше окна не учитывается", () => {
    const r = activityByHour([[{ completedAt: at(40, 10) }]], NOW, 30);
    expect(r.total).toBe(0);
    expect(r.peak).toBeNull();
  });

  it("невыполненное не считается", () => {
    const r = activityByHour([[{ completedAt: null }, {}]], NOW);
    expect(r.total).toBe(0);
  });

  it("массив часов всегда полный — по нему рисуются сутки", () => {
    expect(activityByHour([[]], NOW).hours).toHaveLength(24);
  });
});

describe("hourWindow", () => {
  it("окно часа, полночь заворачивается", () => {
    expect(hourWindow(21)).toBe("21:00–22:00");
    expect(hourWindow(23)).toBe("23:00–00:00");
  });
});
