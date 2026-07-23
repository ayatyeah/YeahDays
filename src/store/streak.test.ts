import { describe, it, expect } from "vitest";
import { selectStreak, selectBestStreak, type PlannedTask } from "./useUserStore";
import { dateKey, type Action } from "@/lib/domain";

const action: Action = {
  id: "t1",
  title: "Тест",
  why: "Проверка",
  category: "fitness",
  difficulty: 1,
  duration: 10,
  energy: "low",
  timePreference: "any",
  impact: 1,
};

/** День со смещением от сегодня: -1 = вчера. */
function dayAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return dateKey(d);
}

/** План с выполненными действиями в указанные дни. */
function planFor(daysAgo: number[]): PlannedTask[] {
  return daysAgo.map((n, i) => ({
    id: `p${i}`,
    actionId: action.id,
    snapshot: action,
    xp: 20,
    date: dayAgo(n),
    completed: true,
    acceptedAt: 0,
    completedAt: 1,
  }));
}

describe("стрик", () => {
  it("считает серию подряд идущих дней", () => {
    expect(selectStreak(planFor([0, 1, 2]))).toBe(3);
  });

  it("не наказывает за незакрытый сегодняшний день", () => {
    // вчера и позавчера закрыты, сегодня ещё нет — серия жива
    expect(selectStreak(planFor([1, 2]))).toBe(2);
  });

  it("обрывается на пропуске", () => {
    // сегодня и позавчера, вчера пропущено
    expect(selectStreak(planFor([0, 2]))).toBe(1);
  });

  it("пустой план даёт ноль", () => {
    expect(selectStreak([])).toBe(0);
  });
});

describe("заморозка стрика", () => {
  it("спасает серию, закрывая пропущенный день", () => {
    const plan = planFor([0, 2, 3]); // вчера (1) пропущено
    expect(selectStreak(plan)).toBe(1);
    expect(selectStreak(plan, [dayAgo(1)])).toBe(4);
  });

  it("не влияет, если пропусков не было", () => {
    const plan = planFor([0, 1, 2]);
    expect(selectStreak(plan, [dayAgo(5)])).toBe(3);
  });

  it("учитывается и в лучшем стрике", () => {
    const plan = planFor([3, 5, 6]); // 4 пропущен
    expect(selectBestStreak(plan)).toBe(2);
    expect(selectBestStreak(plan, [dayAgo(4)])).toBe(4);
  });

  it("несколько заморозок подряд склеивают серию", () => {
    const plan = planFor([0, 3, 4]);
    expect(selectStreak(plan, [dayAgo(1), dayAgo(2)])).toBe(5);
  });
});
