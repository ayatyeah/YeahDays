import { describe, it, expect } from "vitest";
import {
  isTodoOnDay,
  isTodoDone,
  isTodoOverdue,
  type Todo,
} from "./useUserStore";

const base: Todo = {
  id: "t1",
  title: "Тест",
  date: "2026-07-20", // понедельник
  priority: "normal",
  subtasks: [],
  done: false,
  doneDays: [],
  createdAt: 0,
  completedAt: null,
};

// 2026-07-20 пн · 21 вт · 25 сб · 26 вс · 27 пн
const MON = "2026-07-20";
const TUE = "2026-07-21";
const SAT = "2026-07-25";
const SUN = "2026-07-26";
const NEXT_MON = "2026-07-27";

describe("разовые задачи", () => {
  it("показываются только в свой день", () => {
    expect(isTodoOnDay(base, MON)).toBe(true);
    expect(isTodoOnDay(base, TUE)).toBe(false);
  });

  it("считаются просроченными после своего дня", () => {
    expect(isTodoOverdue(base, TUE)).toBe(true);
    expect(isTodoOverdue(base, MON)).toBe(false);
  });

  it("выполненная не просрочена", () => {
    expect(isTodoOverdue({ ...base, done: true }, TUE)).toBe(false);
  });
});

describe("повторяющиеся задачи", () => {
  const daily: Todo = { ...base, repeat: { kind: "daily" } };
  const weekdays: Todo = { ...base, repeat: { kind: "weekdays" } };
  const weekends: Todo = { ...base, repeat: { kind: "weekends" } };
  const weekly: Todo = { ...base, repeat: { kind: "weekly" } };

  it("ежедневная показывается каждый день", () => {
    for (const d of [MON, TUE, SAT, SUN, NEXT_MON]) {
      expect(isTodoOnDay(daily, d)).toBe(true);
    }
  });

  it("по будням — только пн–пт", () => {
    expect(isTodoOnDay(weekdays, MON)).toBe(true);
    expect(isTodoOnDay(weekdays, TUE)).toBe(true);
    expect(isTodoOnDay(weekdays, SAT)).toBe(false);
    expect(isTodoOnDay(weekdays, SUN)).toBe(false);
  });

  it("по выходным — только сб и вс", () => {
    expect(isTodoOnDay(weekends, SAT)).toBe(true);
    expect(isTodoOnDay(weekends, SUN)).toBe(true);
    expect(isTodoOnDay(weekends, MON)).toBe(false);
  });

  it("еженедельная — в тот же день недели, что и создание", () => {
    expect(isTodoOnDay(weekly, MON)).toBe(true);
    expect(isTodoOnDay(weekly, NEXT_MON)).toBe(true);
    expect(isTodoOnDay(weekly, TUE)).toBe(false);
  });

  it("не показывается раньше дня создания", () => {
    expect(isTodoOnDay(daily, "2026-07-19")).toBe(false);
  });

  it("выполнение живёт по дням, а не флагом", () => {
    const t = { ...daily, doneDays: [MON] };
    expect(isTodoDone(t, MON)).toBe(true);
    expect(isTodoDone(t, TUE)).toBe(false);
  });

  it("повторяющаяся никогда не просрочена", () => {
    expect(isTodoOverdue(daily, NEXT_MON)).toBe(false);
  });
});
