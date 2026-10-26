import { describe, expect, it } from "vitest";
import { answer, decode, encode, nextRound, pool, retryAt, RETRY_LIMIT, ROUND, stats, type DrillState } from "./drill";
import { clock, examPoints } from "./examSim";
import { part, qx, type StudyEvent } from "./types";

function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const bank = (tag: string, n: number) =>
  Array.from({ length: n }, (_, i) => qx(`${tag} question ${i}?`, `${tag} right ${i}`, [[`${tag} a ${i}`, "a is wrong", "а неверно"], [`${tag} b ${i}`, "b is wrong", "б неверно"], [`${tag} c ${i}`, "c is wrong", "в неверно"]], "because", "потому что"));
const notes = { en: "x", ru: "x" };
const event: StudyEvent = {
  id: "t", title: "T", course: "C", description: "d",
  lectures: [
    { id: "l1", title: { en: "L1", ru: "Л1" }, parts: [part("l1-p1", { en: "P1", ru: "Ч1" }, notes, bank("A", 6)), part("l1-p2", { en: "P2", ru: "Ч2" }, notes, bank("B", 6))] },
    { id: "l2", title: { en: "L2", ru: "Л2" }, parts: [part("l2-p1", { en: "P3", ru: "Ч3" }, notes, bank("C", 6))] },
  ],
  counts: { part: 5, lecture: 5, final: 5 },
};
const HOUR = 3600_000;

describe("учить вопросами: правила карточек", () => {
  it("верно с первого раза — освоено; ошибка — в работе, освоено после двух верных подряд", () => {
    let s: DrillState = answer({}, "q1", true, 0);
    expect(s.q1).toMatchObject({ level: 2, streak: 1, misses: 0 });
    s = answer(s, "q2", false, 0);
    expect(s.q2).toMatchObject({ level: 1, streak: 0, misses: 1 });
    s = answer(s, "q2", true, 1);
    expect(s.q2.level).toBe(1);
    s = answer(s, "q2", false, 2);
    expect(s.q2).toMatchObject({ level: 1, streak: 0, misses: 2 });
    s = answer(answer(s, "q2", true, 3), "q2", true, 4);
    expect(s.q2).toMatchObject({ level: 2, streak: 2, misses: 2 });
    // освоенное, на котором ошиблись, снова в работе
    expect(answer(s, "q1", false, 5).q1.level).toBe(1);
  });

  it("статистика считает только вопросы области", () => {
    let s: DrillState = answer({}, "l1-p1-1", true, 0);
    s = answer(s, "l2-p1-1", false, 0);
    s = answer(s, "чужой-вопрос", true, 0);
    expect(stats(event, s)).toEqual({ total: 18, mastered: 1, learning: 1, fresh: 16 });
    expect(stats(event, s, 1)).toEqual({ total: 6, mastered: 0, learning: 1, fresh: 5 });
    expect(pool(event, 0).map((e) => e.part)).toEqual([0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1]);
  });
});

describe("учить вопросами: раунд", () => {
  it("новые вопросы идут по порядку частей, без повторов, с перемешанными вариантами", () => {
    const round = nextRound(event, {}, "all", 0, seeded(1));
    expect(round).toHaveLength(ROUND);
    expect(new Set(round.map((q) => q.id)).size).toBe(ROUND);
    // первая часть целиком (6) и начало второй (4), третьей — нет
    expect(round.filter((q) => q.id.startsWith("l1-p1-")).length).toBe(6);
    expect(round.filter((q) => q.id.startsWith("l1-p2-")).length).toBe(4);
    expect(round.some((q) => q.id.startsWith("l2-"))).toBe(false);
    for (const q of round) expect(q.options[q.correct]).toMatch(/right/);
    expect(new Set(round.map((q) => q.correct)).size).toBeGreaterThan(1);
  });

  it("ошибки, которые отлежались, идут первыми, но не больше 40% раунда; свежие ошибки ждут", () => {
    let s: DrillState = {};
    for (let i = 1; i <= 6; i++) s = answer(s, `l1-p1-${i}`, false, 0);
    s = answer(s, "l1-p2-1", false, 10 * HOUR - 30_000);
    const round = nextRound(event, s, "all", 10 * HOUR, seeded(2));
    expect(round.filter((q) => q.id.startsWith("l1-p1-")).length).toBe(4);
    expect(round.some((q) => q.id === "l1-p2-1")).toBe(false);
    expect(round).toHaveLength(ROUND);
  });

  it("когда новых нет, берёт ошибки, затем освоенное — сначала то, что старше суток", () => {
    let s: DrillState = {};
    pool(event, 1).forEach((e, i) => { s = answer(s, e.question.id, true, i < 3 ? 0 : 30 * HOUR); });
    const round = nextRound(event, s, 1, 31 * HOUR, seeded(3));
    expect(round).toHaveLength(6);
    expect(nextRound(event, s, 1, 31 * HOUR, seeded(3), 3).map((q) => q.id).sort()).toEqual(["l2-p1-1", "l2-p1-2", "l2-p1-3"]);
  });

  it("ошибка возвращается через три вопроса, раунд растёт не больше чем на пять", () => {
    expect(retryAt(0, 10, 0)).toBe(4);
    expect(retryAt(8, 10, 1)).toBe(10);
    expect(retryAt(3, 12, RETRY_LIMIT)).toBeNull();
  });

  it("запись на устройстве переживает кодирование, мусор отбрасывается", () => {
    const s: DrillState = { a: { level: 1, streak: 1, at: 5000, misses: 2 }, b: { level: 2, streak: 3, at: 7000, misses: 0 } };
    expect(decode(encode(s))).toEqual(s);
    expect(decode('{"a":[3,0,1,0],"b":"x","c":[1,0,1]}')).toEqual({});
    expect(decode("не json")).toEqual({});
    expect(decode(null)).toEqual({});
  });
});

describe("пробный тест", () => {
  const format = { name: "MCQ Test 2", questions: 50, minutes: 50, points: 18 };
  it("баллы курса с точностью до десятых", () => {
    expect(examPoints(41, 50, format)).toBe(14.8);
    expect(examPoints(50, 50, format)).toBe(18);
    expect(examPoints(0, 50, format)).toBe(0);
    expect(examPoints(0, 0, format)).toBe(0);
  });
  it("часы: минуты и секунды, отрицательное — ноль", () => {
    expect(clock(50 * 60_000)).toBe("50:00");
    expect(clock(65_400)).toBe("01:06");
    expect(clock(-5)).toBe("00:00");
  });
});
