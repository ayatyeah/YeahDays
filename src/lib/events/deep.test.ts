import { describe, expect, it } from "vitest";
import { completed, deepStep, deepSteps, draw, readiness, record, sanitizeProgress, steps, type Progress } from "./engine";
import { part, qx, tfx, type StudyEvent } from "./types";

function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const deep = Array.from({ length: 6 }, (_, i) => qx(`Deep question ${i}?`, `Right ${i}`, [[`Wrong A${i}`, "A is wrong because…", "A не подходит, потому что…"], [`Wrong B${i}`, "B is wrong because…", "B не подходит…"], [`Wrong C${i}`, "C is wrong because…", "C не подходит…"]], "Right because…", "Верно, потому что…"));
deep.push(tfx("A statement.", false, "It is false because…", "Неверно, потому что…", "True would ignore…", "«Верно» не учитывает…"));
const basic = Array.from({ length: 5 }, (_, i) => qx(`Q${i}?`, `R${i}`, [[`W1-${i}`, "w", "н"], [`W2-${i}`, "w", "н"], [`W3-${i}`, "w", "н"]], "because…", "потому что…"));
const event: StudyEvent = {
  id: "t", title: "T", course: "C", description: "d",
  lectures: [{ id: "l1", title: { en: "L1", ru: "Л1" }, parts: [part("l1-p1", { en: "P", ru: "Ч" }, { en: "x", ru: "x" }, basic, deep), part("l1-p2", { en: "P2", ru: "Ч2" }, { en: "x", ru: "x" }, basic)] }],
  counts: { part: 5, lecture: 5, final: 5 },
};

describe("разбор до косточек", () => {
  it("шаг есть только у части с банком, в маршрут и готовность не входит", () => {
    expect(deepStep(event, 0, 0)?.count).toBe(7);
    expect(deepStep(event, 0, 1)).toBeNull();
    expect(steps(event).some((s) => s.kind === "deep")).toBe(false);
    expect(deepSteps(event).map((s) => s.id)).toEqual(["l1-p1-deep"]);
    const step = deepStep(event, 0, 0)!;
    const progress = record({}, step, draw(event, step, seeded(1)), Array(7).fill(0));
    expect(readiness(event, progress).percent).toBe(0);
    expect(readiness(event, progress).done).toBe(0);
  });

  it("берёт все вопросы банка, а объяснения ловушек следуют за перемешанными вариантами", () => {
    const step = deepStep(event, 0, 0)!;
    const quiz = draw(event, step, seeded(2));
    expect(quiz.length).toBe(7);
    expect(new Set(quiz.map((q) => q.id)).size).toBe(7);
    for (const q of quiz) {
      expect(q.wrong).toHaveLength(q.options.length);
      expect(q.wrong![q.correct]).toBeNull();
      q.options.forEach((o, i) => {
        if (i === q.correct) return;
        const letter = /Wrong ([ABC])/.exec(o)?.[1];
        if (letter) expect(q.wrong![i]!.en.startsWith(letter)).toBe(true);
      });
    }
    const tf = quiz.find((q) => q.options[0] === "True")!;
    expect(tf.correct).toBe(1);
    expect(tf.wrong).toEqual([{ en: "True would ignore…", ru: "«Верно» не учитывает…" }, null]);
  });

  it("результат разбора переживает очистку прогресса, а чужие ключи — нет", () => {
    const clean = sanitizeProgress(event, { "l1-p1-deep": { best: 0.5, last: 0.5, attempts: 2 }, hacked: { best: 1 } });
    expect(Object.keys(clean)).toEqual(["l1-p1-deep"]);
  });
});

describe("ачивка за пройденный ивент", () => {
  it("даётся, когда пройден каждый шаг маршрута и итоговый квиз не ниже 80%", () => {
    const list = steps(event);
    let progress: Progress = {};
    for (const s of list) progress = record(progress, s, draw(event, s, seeded(3)), Array(s.count).fill(-1));
    expect(completed(event, progress)).toBe(false);
    const final = list.at(-1)!;
    const quiz = draw(event, final, seeded(4));
    progress = record(progress, final, quiz, quiz.map((q) => q.correct));
    expect(completed(event, progress)).toBe(true);
    // Без одного шага маршрута ачивки нет, даже с идеальным финалом.
    const { [list[0].id]: _skip, ...without } = progress;
    expect(completed(event, without)).toBe(false);
    // Разбор до косточек ничего не меняет.
    expect(completed(event, { ...without, "l1-p1-deep": { best: 1, last: 1, attempts: 1 } })).toBe(false);
  });
});
