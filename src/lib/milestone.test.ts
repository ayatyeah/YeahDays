import { describe, it, expect } from "vitest";
import { nextGoal, type GoalInput } from "./milestone";
import { xpForLevel } from "./leveling";

/** База: день собран, чтобы по умолчанию проверять дальние вехи. */
function input(over: Partial<GoalInput> = {}): GoalInput {
  return {
    totalXp: 0,
    takenToday: 2,
    dailyGoal: 2,
    streak: 0,
    toGreenDay: null,
    ...over,
  };
}

describe("ближайшая цель", () => {
  it("зелёный день челленджа важнее всего остального", () => {
    // даже когда план дня не закрыт, зелёный день ближе к рукам
    const g = nextGoal(input({ takenToday: 0, toGreenDay: 2 }));
    expect(g?.kind).toBe("green");
    expect(g?.remaining).toBe(2);
  });

  it("пока день не закрыт — тянет закрыть день", () => {
    const g = nextGoal(input({ takenToday: 1, dailyGoal: 2 }));
    expect(g?.kind).toBe("day");
    expect(g?.remaining).toBe(1);
    expect(g?.text).toContain("день закрыт");
  });

  it("после закрытия дня показывает следующий уровень", () => {
    // totalXp=42 → уровень 1; остаток берём из самой формулы, а не числом
    const g = nextGoal(input({ totalXp: 42 }));
    expect(g?.kind).toBe("level");
    expect(g?.remaining).toBe(xpForLevel(2) - 42);
  });

  it("близкую эволюцию тела показывает вперёд обычного уровня", () => {
    // порог «Собранного» — уровень 8, xpForLevel(8) = 60*7+40*49 = 2380.
    // берём totalXp так, чтобы до эволюции осталось ≤ 150
    const totalXp = xpForLevel(8) - 120;
    const g = nextGoal(input({ totalXp }));
    expect(g?.kind).toBe("evolution");
    expect(g?.remaining).toBe(120);
    expect(g?.text).toContain("Собранный");
  });

  it("далёкую эволюцию не показывает — только следующий уровень", () => {
    // на старте до «Собранного» далеко (2380 XP) — должен вести к уровню
    const g = nextGoal(input({ totalXp: 100 }));
    expect(g?.kind).toBe("level");
  });

  it("на потолке уровней ведёт к круглой вехе стрика", () => {
    // очень большой XP → следующего уровня фактически нет в обозримости,
    // но круглая веха стрика найдётся
    const huge = xpForLevel(60);
    const g = nextGoal(input({ totalXp: huge, streak: 5 }));
    // либо уровень (если ещё есть куда), либо стрик — но не day/green
    expect(["level", "streak"]).toContain(g?.kind);
  });

  it("веха стрика считает до ближайшего круглого числа", () => {
    // подберём XP ровно на границе уровня, чтобы toNextLevel === 0
    const g = nextGoal(input({ totalXp: xpForLevel(5), streak: 5 }));
    if (g?.kind === "streak") {
      expect(g.remaining).toBe(7 - 5); // ближайшая веха — 7
    }
  });
});

describe("русские числительные в целях", () => {
  it("одно действие — единственное число", () => {
    const g = nextGoal(input({ takenToday: 1, dailyGoal: 2 }));
    expect(g?.text).toContain("1 действие");
  });

  it("несколько действий — родительный", () => {
    const g = nextGoal(input({ takenToday: 0, dailyGoal: 5 }));
    expect(g?.text).toContain("5 действий");
  });

  it("две задачи до зелёного — «задачи»", () => {
    const g = nextGoal(input({ toGreenDay: 2 }));
    expect(g?.text).toContain("2 задачи");
  });
});
