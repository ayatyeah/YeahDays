import { describe, it, expect } from "vitest";
import { subjectOf, timeSpentBySubject, fmtHours } from "@/lib/timeSpent";
import type { Todo } from "@/store/useUserStore";

function todo(p: Partial<Todo> & { id: string; title: string }): Todo {
  return {
    date: "2026-09-07",
    priority: "normal",
    subtasks: [],
    done: false,
    doneDays: [],
    createdAt: 1,
    completedAt: null,
    ...p,
  } as Todo;
}

describe("subjectOf", () => {
  it("отрезает форму занятия и аудиторию", () => {
    expect(subjectOf("Cloud Computing — практика, 307K (Korkem)")).toBe(
      "Cloud Computing",
    );
    expect(subjectOf("Research Methods and Tools — лекция, C1.1.252L (Main)")).toBe(
      "Research Methods and Tools",
    );
  });

  it("двоеточие тоже отделяет предмет", () => {
    expect(subjectOf("Philosophy: Attendance (Group SE-2425)")).toBe("Philosophy");
  });

  it("обычная задача остаётся собой", () => {
    expect(subjectOf("Завтрак")).toBe("Завтрак");
    expect(subjectOf("Турник, брусья, бег 5 км")).toBe("Турник, брусья, бег 5 км");
  });
});

describe("timeSpentBySubject", () => {
  // среда, 9 сентября 2026
  const from = new Date(2026, 8, 9);

  it("считает минуты и сортирует по убыванию", () => {
    const todos = [
      todo({ id: "a", title: "Cloud Computing — лекция", hour: 13, duration: 105, date: "2026-09-08" }),
      todo({ id: "b", title: "Flutter / Dart", hour: 9, duration: 60, date: "2026-09-08" }),
    ];
    const r = timeSpentBySubject(todos, 7, from);
    expect(r.map((b) => b.subject)).toEqual(["Cloud Computing", "Flutter / Dart"]);
    expect(r[0]!.minutes).toBe(105);
  });

  it("повторяющаяся задача считается за каждый выпавший день", () => {
    const daily = todo({
      id: "d",
      title: "Медитация",
      hour: 7,
      duration: 20,
      date: "2026-09-03",
      repeat: { kind: "daily" } as Todo["repeat"],
    });
    const r = timeSpentBySubject([daily], 7, from);
    expect(r[0]!.minutes).toBe(20 * 7);
  });

  it("выполненные дни попадают в doneMinutes", () => {
    const daily = todo({
      id: "d",
      title: "Медитация",
      hour: 7,
      duration: 30,
      date: "2026-09-03",
      repeat: { kind: "daily" } as Todo["repeat"],
      doneDays: ["2026-09-08", "2026-09-09"],
    });
    const r = timeSpentBySubject([daily], 7, from);
    expect(r[0]!.doneMinutes).toBe(60);
  });

  it("задачи без часа не участвуют — у них нет длительности в плане дня", () => {
    expect(timeSpentBySubject([todo({ id: "x", title: "Купить хлеб" })], 7, from)).toEqual([]);
  });

  it("две формы одного предмета складываются", () => {
    const todos = [
      todo({ id: "a", title: "Philosophy — лекция, онлайн", hour: 12, duration: 60, date: "2026-09-08" }),
      todo({ id: "b", title: "Philosophy — практика, 103P", hour: 14, duration: 60, date: "2026-09-08" }),
    ];
    const r = timeSpentBySubject(todos, 7, from);
    expect(r).toHaveLength(1);
    expect(r[0]!.minutes).toBe(120);
  });
});

describe("fmtHours", () => {
  it("часы и минуты по-русски", () => {
    expect(fmtHours(45)).toBe("45 мин");
    expect(fmtHours(120)).toBe("2 ч");
    expect(fmtHours(390)).toBe("6 ч 30 мин");
  });
});
