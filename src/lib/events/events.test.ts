import { describe, expect, it } from "vitest";
import { EVENTS } from "./index";
import { draw, nextStep, readiness, record, steps, type Progress } from "./engine";

/** Детерминированный генератор — чтобы «случайные» наборы в тестах повторялись. */
function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const event = EVENTS[0];
const all = event.lectures.flatMap((l) => l.parts.flatMap((p) => p.questions));

describe("содержимое ивента", () => {
  it("у каждого вопроса свой id, есть верный вариант и объяснение на двух языках", () => {
    expect(new Set(all.map((q) => q.id)).size).toBe(all.length);
    for (const q of all) {
      expect(q.options.length, q.id).toBeGreaterThanOrEqual(2);
      expect(new Set(q.options).size, q.id).toBe(q.options.length);
      expect(q.options[q.answer], q.id).toBeTruthy();
      expect(q.why.en.length, q.id).toBeGreaterThan(10);
      expect(q.why.ru.length, q.id).toBeGreaterThan(10);
    }
  });

  it("у каждой части есть конспект на английском и русском с одинаковой структурой", () => {
    const shape = (text: string) => text.split("\n").map((l) => (l.startsWith("## ") ? "h" : l.startsWith("- ") ? "b" : l.startsWith("> ") ? "q" : l.startsWith("= ") ? "c" : "p")).join("");
    for (const lecture of event.lectures) {
      for (const p of lecture.parts) {
        expect(p.notes.en.length, p.id).toBeGreaterThan(400);
        expect(shape(p.notes.ru), p.id).toBe(shape(p.notes.en));
      }
    }
  });

  it("банка хватает на квизы нужного размера: 5–10 по части, 15–20 по лекции, 40–50 итоговый", () => {
    const list = steps(event);
    for (const s of list.filter((s) => s.kind === "part")) expect(s.count, s.id).toBeGreaterThanOrEqual(5), expect(s.count).toBeLessThanOrEqual(10);
    for (const s of list.filter((s) => s.kind === "lecture")) expect(s.count, s.id).toBeGreaterThanOrEqual(15), expect(s.count).toBeLessThanOrEqual(20);
    const final = list.at(-1)!;
    expect(final.kind).toBe("final");
    expect(final.count).toBeGreaterThanOrEqual(40);
    expect(final.count).toBeLessThanOrEqual(50);
  });

  it("верный ответ не выдаёт себя длиной: он самый длинный не чаще, чем подсказала бы случайность", () => {
    const choice = all.filter((q) => !q.fixed);
    const longest = choice.filter((q) => q.options.every((o, i) => i === q.answer || o.length < q.options[q.answer].length));
    const shortest = choice.filter((q) => q.options.every((o, i) => i === q.answer || o.length > q.options[q.answer].length));
    // При четырёх вариантах случайность даёт 25%. Порог чуть выше — запас на
    // вопросы, где верный ответ нельзя сократить, не исказив.
    expect(longest.length / choice.length).toBeLessThan(0.33);
    expect(shortest.length / choice.length).toBeLessThan(0.4);
  });
});

describe("прохождение", () => {
  it("маршрут: части лекции → квиз по лекции → … → итоговый квиз", () => {
    const kinds = steps(event).map((s) => s.kind);
    expect(kinds.filter((k) => k === "lecture").length).toBe(event.lectures.length);
    expect(kinds.at(-1)).toBe("final");
    // Квиз по лекции стоит сразу после её последней части.
    const firstLectureQuiz = kinds.indexOf("lecture");
    expect(firstLectureQuiz).toBe(event.lectures[0].parts.length);
  });

  it("каждая попытка — другой набор и порядок вопросов и вариантов", () => {
    const step = steps(event).at(-1)!;
    const a = draw(event, step, seeded(1));
    const b = draw(event, step, seeded(2));
    expect(a.map((x) => x.id)).not.toEqual(b.map((x) => x.id));
    expect(new Set(a.map((x) => x.id)).size).toBe(a.length);
    // Верный вариант не стоит всегда на одном месте.
    expect(new Set(a.filter((x) => x.options.length === 4).map((x) => x.correct)).size).toBe(4);
    // После перемешивания индекс по-прежнему указывает на верный текст.
    for (const item of a) {
      const source = all.find((x) => x.id === item.id)!;
      expect(item.options[item.correct]).toBe(source.options[source.answer]);
    }
  });

  it("квиз по части берёт вопросы только этой части, по лекции — из всех её частей", () => {
    const list = steps(event);
    const partStep = list[0];
    expect(draw(event, partStep, seeded(3)).every((x) => x.id.startsWith(`${partStep.id}-`))).toBe(true);
    const lectureStep = list.find((s) => s.kind === "lecture" && s.lecture === 1)!;
    const quiz = draw(event, lectureStep, seeded(4));
    const partsHit = new Set(quiz.map((x) => x.id.replace(/-\d+$/, "")));
    expect(partsHit.size).toBe(event.lectures[1].parts.length);
    expect(quiz.every((x) => x.lecture === 1)).toBe(true);
  });

  it("итоговый квиз покрывает все лекции примерно поровну", () => {
    const quiz = draw(event, steps(event).at(-1)!, seeded(5));
    const perLecture = event.lectures.map((_, li) => quiz.filter((x) => x.lecture === li).length);
    expect(Math.min(...perLecture)).toBeGreaterThanOrEqual(10);
    expect(Math.max(...perLecture) - Math.min(...perLecture)).toBeLessThanOrEqual(1);
  });

  it("готовность растёт от 0 до 100, лучший результат не падает от плохого повтора", () => {
    let progress: Progress = {};
    expect(readiness(event, progress).percent).toBe(0);
    expect(nextStep(event, progress)!.id).toBe(steps(event)[0].id);
    for (const step of steps(event)) {
      const quiz = draw(event, step, seeded(6));
      progress = record(progress, step, quiz, quiz.map((x) => x.correct));
    }
    expect(readiness(event, progress)).toMatchObject({ percent: 100, parts: 100, lectures: 100, final: 100 });
    expect(nextStep(event, progress)).toBeNull();

    const final = steps(event).at(-1)!;
    const quiz = draw(event, final, seeded(7));
    progress = record(progress, final, quiz, quiz.map(() => -1));
    expect(progress[final.id]).toMatchObject({ best: 1, last: 0, attempts: 2 });
    expect(readiness(event, progress).percent).toBe(100);
    const lectureCells = Object.values(progress[final.id].byLecture!);
    expect(lectureCells.reduce((n, [, total]) => n + total, 0)).toBe(quiz.length);
  });

  it("без итогового квиза готовность не поднимается выше половины", () => {
    let progress: Progress = {};
    for (const step of steps(event).filter((s) => s.kind !== "final")) {
      const quiz = draw(event, step, seeded(8));
      progress = record(progress, step, quiz, quiz.map((x) => x.correct));
    }
    expect(readiness(event, progress).percent).toBe(50);
  });
});
