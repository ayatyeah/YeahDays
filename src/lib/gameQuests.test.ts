import { describe, expect, it } from "vitest";
import { questsFor, weakestStat, weekKeyOf, type QuestInput } from "./gameQuests";
import type { PlannedTask, Todo } from "@/store/useUserStore";

const DAY = "2026-09-21"; // понедельник

function todo(patch: Partial<Todo>): Todo {
  return {
    id: Math.random().toString(36).slice(2),
    title: "Дело",
    date: DAY,
    priority: "normal",
    subtasks: [],
    done: false,
    doneDays: [],
    createdAt: 0,
    completedAt: null,
    ...patch,
  } as Todo;
}

function input(patch: Partial<QuestInput> = {}): QuestInput {
  return {
    day: DAY,
    now: new Date(`${DAY}T13:00:00`).getTime(),
    plan: [],
    todos: [],
    streak: 0,
    stats: { strength: 10, intelligence: 50, wealth: 30, stability: 40, health: 20 },
    ...patch,
  };
}

describe("questsFor", () => {
  it("даёт два дневных квеста и один недельный", () => {
    const list = questsFor(input());
    expect(list.filter((q) => q.scope === "day")).toHaveLength(2);
    expect(list.filter((q) => q.scope === "week")).toHaveLength(1);
  });

  it("на один и тот же день набор одинаковый, на другой — свой", () => {
    const same = questsFor(input()).map((q) => q.id);
    expect(questsFor(input()).map((q) => q.id)).toEqual(same);

    const other = questsFor(input({ day: "2026-09-22" })).map((q) => q.id);
    expect(other).not.toEqual(same);
  });

  it("не предлагает «до обеда», когда утренних дел нет вовсе", () => {
    const evening = questsFor(
      input({ todos: [todo({ hour: 19, minute: 0 })] }),
    );
    expect(evening.some((q) => q.id.startsWith("morning:"))).toBe(false);
  });

  it("считает выполненное по тем же отметкам, что и остальной экран", () => {
    const withClasses = input({
      todos: [
        todo({ title: "Матанализ — лекция", hour: 9, doneDays: [], done: true }),
        todo({ title: "Физика — лекция", hour: 11 }),
      ],
    });
    const quest = questsFor(withClasses).find((q) => q.id.startsWith("classes:"));
    expect(quest).toBeDefined();
    expect(quest!.target).toBe(2);
    expect(quest!.done).toBe(1);
    expect(quest!.complete).toBe(false);
  });

  it("квест из колоды закрывается закрытыми карточками", () => {
    const plan = [
      { date: DAY, completed: true, snapshot: { category: "sport" } },
      { date: DAY, completed: true, snapshot: { category: "sport" } },
      { date: DAY, completed: false, snapshot: { category: "sport" } },
    ] as unknown as PlannedTask[];
    const quest = questsFor(input({ plan })).find((q) => q.id.startsWith("deck:"));
    if (quest) {
      expect(quest.done).toBe(2);
      expect(quest.complete).toBe(true);
    }
  });

  it("цель по серии всегда выше текущей — держать, а не любоваться", () => {
    const q = questsFor(input({ streak: 4 })).find((x) => x.id.startsWith("week_streak:"));
    if (q) {
      expect(q.target).toBeGreaterThan(4);
      expect(q.done).toBe(4);
    }
  });

  it("прогресс не убегает за цель", () => {
    const plan = Array.from({ length: 9 }, () => ({
      date: DAY,
      completed: true,
      snapshot: { category: "sport" },
    })) as unknown as PlannedTask[];
    for (const q of questsFor(input({ plan }))) {
      expect(q.done).toBeLessThanOrEqual(q.target);
    }
  });
});

describe("weakestStat", () => {
  it("находит самый отстающий", () => {
    expect(
      weakestStat({ strength: 10, intelligence: 50, wealth: 30, stability: 40, health: 20 }),
    ).toBe("strength");
  });
});

describe("weekKeyOf", () => {
  it("вся неделя с понедельника по воскресенье — один ключ", () => {
    const monday = weekKeyOf(new Date("2026-09-21T10:00:00"));
    const sunday = weekKeyOf(new Date("2026-09-27T23:00:00"));
    expect(monday).toBe(sunday);
    expect(weekKeyOf(new Date("2026-09-28T00:30:00"))).not.toBe(monday);
  });
});
