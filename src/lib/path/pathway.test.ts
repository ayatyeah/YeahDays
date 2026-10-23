import { describe, expect, it } from "vitest";
import { deadlineProximity, planDay, recommend, scheduleReview, strongestFactor, WEIGHTS, type PathwayInput } from "./pathway";

const now = new Date("2026-10-22T09:00:00Z");
const base = (): PathwayInput => ({
  skills: [
    { id: "sql", name: "SELECT", prerequisites: [] },
    { id: "join", name: "JOIN", prerequisites: ["sql"] },
    { id: "group", name: "GROUP BY", prerequisites: ["join"] },
  ],
  units: [
    { id: "u1", title: "Запросы SELECT", skillIds: ["sql"], minutes: 4, weight: 0.5, position: 0 },
    { id: "u2", title: "Соединения", skillIds: ["join"], minutes: 5, weight: 0.9, position: 1 },
    { id: "u3", title: "Группировка", skillIds: ["group"], minutes: 3, weight: 0.7, position: 2 },
  ],
  mastery: {},
  progress: {},
  today: "2026-10-22",
  now,
});
const mastered = { mastery: 0.9, answers: 5, masteredAt: "2026-10-20T00:00:00Z", reviewAt: "2026-10-30T00:00:00Z" };

describe("eligibility", () => {
  it("offers only units whose prerequisite skills are mastered", () => {
    expect(recommend(base()).map((r) => r.unitId)).toEqual(["u1"]);
    const input = base();
    input.mastery.sql = { mastery: 0.86, answers: 2 };
    expect(recommend(input).map((r) => r.unitId)).toEqual(["u1"]);
    input.mastery.sql = mastered;
    expect(recommend(input).map((r) => r.unitId)).toEqual(["u2"]);
  });

  it("brings a mastered unit back when its review is due", () => {
    const input = base();
    input.mastery.sql = { ...mastered, reviewAt: "2026-10-21T00:00:00Z" };
    const ranked = recommend(input);
    expect(ranked.map((r) => r.unitId).sort()).toEqual(["u1", "u2"]);
    const review = ranked.find((r) => r.unitId === "u1")!;
    expect(review.review).toBe(true);
    expect(review.reason).toEqual({ kind: "review", text: "Пора повторить: SELECT" });
  });

  it("holds for 100 simulated learners with random mastery", () => {
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 100; i++) {
      const input = base();
      for (const s of input.skills) if (rnd() > 0.4) input.mastery[s.id] = { mastery: rnd(), answers: Math.floor(rnd() * 6) };
      for (const r of recommend(input)) {
        const unit = input.units.find((u) => u.id === r.unitId)!;
        const prereqs = unit.skillIds.flatMap((id) => input.skills.find((s) => s.id === id)!.prerequisites);
        for (const p of prereqs) {
          const m = input.mastery[p];
          expect(m && m.mastery >= 0.85 && m.answers >= 3).toBe(true);
        }
      }
    }
  });
});

describe("priority and reasons", () => {
  it("uses 0.35 gap + 0.25 goal + 0.20 review + 0.20 deadline", () => {
    const [r] = recommend({ ...base(), deadline: "2026-10-23" });
    expect(r.factors).toEqual({ gap: 1, goal: 0.5, review: 0, deadline: 1 });
    expect(r.priority).toBeCloseTo(WEIGHTS.gap + WEIGHTS.goal * 0.5 + WEIGHTS.deadline);
  });

  it("explains every recommendation by its strongest factor", () => {
    const input = { ...base(), deadline: "2026-10-23" };
    input.mastery.sql = { mastery: 0.88, answers: 3 };
    input.mastery.join = { mastery: 0.8, answers: 4 };
    for (const r of recommend(input)) {
      const factor = strongestFactor(r.contributions);
      const expected = { review: ["review"], deadline: ["deadline"], gap: ["gap", "next", "new"], goal: ["goal"] }[factor];
      expect(expected).toContain(r.reason.kind);
    }
    // У JOIN вес для цели 0.9: его вклад (0.225) сильнее пробела 0.2 и дедлайна.
    expect(recommend(input)[0].reason).toEqual({ kind: "goal", text: "Важно для твоей цели" });
    const weak = base();
    weak.mastery.sql = { mastery: 0.88, answers: 3 };
    weak.mastery.join = { mastery: 0.3, answers: 4 };
    expect(recommend(weak)[0].reason).toEqual({ kind: "gap", text: "Пробел в навыке: JOIN" });
  });

  it("names the previous topic for a fresh unit after a mastered prerequisite", () => {
    const input = base();
    input.mastery.sql = mastered;
    expect(recommend(input)[0].reason).toEqual({ kind: "next", text: "Следующий шаг после темы «SELECT»" });
  });

  it("lowers priority for today only after postponing", () => {
    const input = base();
    input.mastery.sql = { ...mastered, reviewAt: "2026-10-21T00:00:00Z" };
    const before = recommend(input).find((r) => r.unitId === "u2")!.priority;
    input.progress.u2 = { postponedOn: "2026-10-22" };
    expect(recommend(input).find((r) => r.unitId === "u2")!.priority).toBeCloseTo(before / 2);
    input.progress.u2 = { postponedOn: "2026-10-21" };
    expect(recommend(input).find((r) => r.unitId === "u2")!.priority).toBeCloseTo(before);
  });

  it("scales deadline proximity from 1 (≤ 1 day) to 0 (> 14 days)", () => {
    expect(deadlineProximity("2026-10-23", "2026-10-22")).toBe(1);
    expect(deadlineProximity("2026-11-05", "2026-10-22")).toBe(0);
    expect(deadlineProximity("2026-11-10", "2026-10-22")).toBe(0);
    expect(deadlineProximity("2026-10-29", "2026-10-22")).toBeCloseTo(7 / 13);
    expect(deadlineProximity("2026-10-01", "2026-10-22")).toBe(0);
    expect(deadlineProximity("", "2026-10-22")).toBe(0);
  });
});

describe("day plan", () => {
  const rec = (unitId: string, minutes: number, priority: number, review = false) =>
    ({ unitId, title: unitId, minutes, priority, review, factors: { gap: 0, goal: 0, review: 0, deadline: 0 }, contributions: { gap: 0, goal: 0, review: 0, deadline: 0 }, reason: { kind: "goal" as const, text: "" } });

  it("never plans more minutes than the student has", () => {
    const plan = planDay([rec("a", 5, 0.9), rec("b", 5, 0.8), rec("c", 2, 0.5)], { energy: 4, minutes: 7 });
    expect(plan.map((p) => p.unitId)).toEqual(["a", "c"]);
  });

  it("prefers reviews and short units when energy is low", () => {
    const plan = planDay([rec("big", 5, 0.9), rec("short", 2, 0.4), rec("rev", 4, 0.3, true)], { energy: 1, minutes: 6 });
    expect(plan.map((p) => p.unitId)).toEqual(["rev", "short"]);
  });
});

describe("spaced review", () => {
  const day = 86_400_000;
  it("schedules 1, 3, 7 and 14 days and resets when mastery drops", () => {
    let state = { masteredAt: null as Date | null, reviewAt: null as Date | null, reviewStep: 0 };
    state = scheduleReview(state, { mastery: 0.9, answers: 3 }, now);
    expect(state.reviewAt!.getTime() - now.getTime()).toBe(day);
    const steps = [3, 7, 14, 14];
    let t = now;
    for (const gap of steps) {
      t = new Date(state.reviewAt!.getTime() + 1000);
      state = scheduleReview(state, { mastery: 0.9, answers: 6 }, t);
      expect(Math.round((state.reviewAt!.getTime() - t.getTime()) / day)).toBe(gap);
    }
    state = scheduleReview(state, { mastery: 0.5, answers: 8 }, new Date(state.reviewAt!.getTime() + 1000));
    expect(state).toEqual({ masteredAt: null, reviewAt: null, reviewStep: 0 });
  });

  it("does not advance the interval before the review is due", () => {
    const first = scheduleReview({ masteredAt: null, reviewAt: null, reviewStep: 0 }, { mastery: 0.9, answers: 3 }, now);
    const again = scheduleReview(first, { mastery: 0.95, answers: 4 }, new Date(now.getTime() + 3600_000));
    expect(again.reviewStep).toBe(0);
    expect(again.reviewAt).toEqual(first.reviewAt);
  });
});
