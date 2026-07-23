import { describe, it, expect } from "vitest";
import {
  questProgress,
  isQuestDone,
  daysLeft,
  effectiveGoals,
  type Quest,
  type PlannedTask,
} from "./useUserStore";
import { DEFAULT_GOALS, dateKey, type Action, type CategoryKey } from "@/lib/domain";

const T0 = new Date("2026-07-01T00:00:00Z").getTime();

function act(category: CategoryKey): Action {
  return {
    id: `a-${category}`,
    title: "Тест",
    why: "Проверка",
    category,
    difficulty: 2,
    duration: 15,
    energy: "medium",
    timePreference: "any",
    impact: 3,
  };
}

/** Выполненная задача указанной категории. */
function done(category: CategoryKey, completedAt: number): PlannedTask {
  return {
    id: `p-${category}-${completedAt}`,
    actionId: `a-${category}`,
    snapshot: act(category),
    xp: 20,
    date: "2026-07-10",
    completed: true,
    acceptedAt: completedAt,
    completedAt,
  };
}

const quest = (over: Partial<Quest> = {}): Quest => ({
  id: "q1",
  title: "20 действий · Сила",
  stat: "strength",
  target: 20,
  deadline: "2026-08-01",
  createdAt: T0,
  ...over,
});

describe("прогресс цели", () => {
  it("считает только действия нужного стата", () => {
    const plan = [
      done("fitness", T0 + 1000), // сила
      done("health", T0 + 2000), // сила
      done("learning", T0 + 3000), // интеллект — мимо
    ];
    expect(questProgress(quest(), plan)).toBe(2);
  });

  it("не засчитывает сделанное ДО постановки цели", () => {
    const plan = [done("fitness", T0 - 5000), done("fitness", T0 + 5000)];
    expect(questProgress(quest(), plan)).toBe(1);
  });

  it("не засчитывает невыполненные", () => {
    const plan = [{ ...done("fitness", T0 + 1000), completed: false }];
    expect(questProgress(quest(), plan)).toBe(0);
  });

  it("цель закрывается по достижении цифры", () => {
    const plan = Array.from({ length: 5 }, (_, i) => done("fitness", T0 + i));
    expect(isQuestDone(quest({ target: 5 }), plan)).toBe(true);
    expect(isQuestDone(quest({ target: 6 }), plan)).toBe(false);
  });
});

describe("дни до дедлайна", () => {
  it("считает разницу в днях", () => {
    expect(daysLeft("2026-07-20", "2026-07-18")).toBe(2);
    expect(daysLeft("2026-07-18", "2026-07-18")).toBe(0);
    expect(daysLeft("2026-07-16", "2026-07-18")).toBe(-2);
  });
});

describe("влияние цели на колоду", () => {
  const today = "2026-07-18";

  it("без целей приоритеты не меняются", () => {
    expect(effectiveGoals(DEFAULT_GOALS, [], [], today)).toEqual(DEFAULT_GOALS);
  });

  it("активная цель поднимает вес своего стата", () => {
    const g = effectiveGoals(DEFAULT_GOALS, [quest()], [], today);
    expect(g.strength).toBeGreaterThan(DEFAULT_GOALS.strength);
    expect(g.intelligence).toBe(DEFAULT_GOALS.intelligence); // чужие не трогаем
  });

  it("чем ближе дедлайн при отставании, тем сильнее давление", () => {
    const relaxed = effectiveGoals(
      DEFAULT_GOALS,
      [quest({ deadline: "2026-09-01", target: 20 })],
      [],
      today,
    );
    const urgent = effectiveGoals(
      DEFAULT_GOALS,
      [quest({ deadline: "2026-07-20", target: 20 })],
      [],
      today,
    );
    expect(urgent.strength).toBeGreaterThan(relaxed.strength);
  });

  it("выполненная цель перестаёт давить", () => {
    const plan = Array.from({ length: 5 }, (_, i) => done("fitness", T0 + i));
    const g = effectiveGoals(
      DEFAULT_GOALS,
      [quest({ target: 5 })],
      plan,
      today,
    );
    expect(g.strength).toBe(DEFAULT_GOALS.strength);
  });

  it("просроченная цель не давит — она уже не поможет", () => {
    const g = effectiveGoals(
      DEFAULT_GOALS,
      [quest({ deadline: "2026-07-01" })],
      [],
      today,
    );
    expect(g.strength).toBe(DEFAULT_GOALS.strength);
  });

  it("вес не вылезает за 1", () => {
    const g = effectiveGoals(
      { strength: 0.95, intelligence: 0.5, wealth: 0.5, stability: 0.5 },
      [quest({ deadline: today, target: 100 })],
      [],
      today,
    );
    expect(g.strength).toBeLessThanOrEqual(1);
  });

  it("дефолтная дата берётся из сегодня", () => {
    const future = dateKey(new Date(Date.now() + 10 * 864e5));
    const g = effectiveGoals(DEFAULT_GOALS, [
      quest({ deadline: future, createdAt: Date.now() - 1000 }),
    ], []);
    expect(g.strength).toBeGreaterThan(DEFAULT_GOALS.strength);
  });
});
