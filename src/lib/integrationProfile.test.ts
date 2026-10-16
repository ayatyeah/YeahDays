import { describe, it, expect } from "vitest";
import { challenge30Summary, habitChallenges, hourlySchedule, learningSummary, plusDay, recentDays, upcomingTodos } from "./integrationProfile";
import type { Todo } from "./externalState";

const todo = (over: Partial<Todo>): Todo => ({
  id: "t", title: "Задача", date: "2026-10-17", priority: "normal", subtasks: [], done: false, doneDays: [], createdAt: 0, completedAt: null, ...over,
});

describe("plusDay", () => {
  it("переходит через конец месяца", () => expect(plusDay("2026-10-31", 1)).toBe("2026-11-01"));
});

describe("upcomingTodos", () => {
  it("берёт невыполненные задачи на ближайшие дни, без сегодняшних и выполненных", () => {
    const list = upcomingTodos(
      [
        todo({ id: "a", title: "Дедлайн LMS", date: "2026-10-18", source: "lms" }),
        todo({ id: "b", title: "Сегодня", date: "2026-10-16" }),
        todo({ id: "c", title: "Уже сделано", date: "2026-10-17", done: true }),
        todo({ id: "d", title: "Через месяц", date: "2026-11-20" }),
      ],
      "2026-10-16",
    );
    expect(list.map((t) => t.id)).toEqual(["a"]);
    expect(list[0].source).toBe("lms");
  });

  it("повторяющаяся задача попадает на каждый свой день", () => {
    const daily = todo({ id: "r", date: "2026-10-01", repeat: { kind: "daily" }, doneDays: ["2026-10-17"] });
    const days = upcomingTodos([daily], "2026-10-16", 3).map((t) => t.date);
    expect(days).toEqual(["2026-10-18", "2026-10-19"]);
  });
});

describe("hourlySchedule и recentDays", () => {
  it("почасовой план сортируется по часу, пустые дни отбрасываются", () => {
    const res = hourlySchedule({ schedule: { "2026-10-16": { "18": "Лаба", "9": "Пара", "12": " " } } }, ["2026-10-16", "2026-10-17"]);
    expect(res).toEqual([{ date: "2026-10-16", hours: [{ hour: 9, what: "Пара" }, { hour: 18, what: "Лаба" }] }]);
  });

  it("собирает чек-ины и итоги дня, пропуская пустые дни", () => {
    const res = recentDays(
      { moods: { "2026-10-16": { energy: "low", minutes: 30 } }, retros: { "2026-10-15": { score: 4, note: "норм" } } },
      "2026-10-16",
    );
    expect(res).toEqual([
      { date: "2026-10-16", energy: "low", freeMinutes: 30, dayScore: null, note: null },
      { date: "2026-10-15", energy: null, freeMinutes: null, dayScore: 4, note: "норм" },
    ]);
  });
});

describe("челленджи и обучение", () => {
  it("привычка: номер дня, сегодня и зелёные дни", () => {
    const [c] = habitChallenges(
      { challenges: [{ title: "Отжимания", unit: "раз", stat: "strength", yellow: 20, green: 50, days: 30, startDate: "2026-10-10", log: { "2026-10-15": 60, "2026-10-16": 25 } }] },
      "2026-10-16",
    );
    expect(c).toMatchObject({ day: 7, today: 25, greenDays: 1, finished: false });
    expect(c.last7[0]).toBe(25);
  });

  it("челлендж 30 дней без старта — null", () => {
    expect(challenge30Summary(null, "2026-10-16")).toBeNull();
  });

  it("обучение: квесты пройдено/всего и следующий", () => {
    const res = learningSummary({
      xp: 120, coins: 0, owned: [], equipped: "default" as never,
      skills: [{ id: "s", goal: "Выучить React", title: "React", minutes: 30, createdAt: "", quests: [
        { id: "q1", title: "JSX", lesson: "", exercise: "", rubric: "", boss: false, completed: true, attempts: 1, feedback: "", completedAt: null },
        { id: "q2", title: "Хуки", lesson: "", exercise: "", rubric: "", boss: false, completed: false, attempts: 0, feedback: "", completedAt: null },
      ] }],
    });
    expect(res?.skills[0]).toMatchObject({ questsDone: 1, questsTotal: 2, next: "Хуки" });
  });
});

describe("challenge30Summary на настоящем плане", () => {
  it("считает день, минуты сегодня и выполненные дни", async () => {
    const { parseBrief, parseRecipe, defaultWindows, blocksFor, logBlock } = await import("./challenge30");
    const plan = {
      id: "p",
      brief: parseBrief({ level: "easy", goals: "Разобраться в Python и больше двигаться", baseline: "С нуля", preferences: "", timezone: "Asia/Almaty", windows: defaultWindows("easy") }),
      recipe: parseRecipe({ title: "Месяц роста", summary: "Каждый день", activities: [
        { title: "Python", kind: "study", weight: 2, steps: ["Шаг недели 1", "Шаг недели 2", "Шаг недели 3", "Шаг недели 4"] },
        { title: "Зарядка", kind: "sport", weight: 1, steps: ["Шаг недели 1", "Шаг недели 2", "Шаг недели 3", "Шаг недели 4"] },
      ] }),
      createdAt: "2026-10-01T00:00:00Z", consentAt: "2026-10-01T00:00:00Z", startDate: "2026-10-14", logs: {} as Record<string, number>,
    };
    for (const b of blocksFor(plan, 0)) logBlock(plan, 0, b.id, b.minutes, new Date("2026-10-14T12:00:00Z"));
    const s = challenge30Summary(plan, "2026-10-16")!;
    expect(s).toMatchObject({ title: "Месяц роста", day: 3, targetMinutesPerDay: 180, successDays: 1, todayMinutes: 0, finished: false });
    expect(s.activities.map((a) => a.title)).toEqual(["Python", "Зарядка"]);
    expect(s.totalMinutes).toBe(180);
  });
});
