import { describe, it, expect } from "vitest";
import {
  ROUTINE,
  routineForDay,
  routineLabelAt,
  currentRoutineBlock,
} from "./routine";

/** Собрать дату на нужный день недели и час (для детерминизма). */
function at(weekday: number, hour: number): Date {
  // 2026-07-26 — воскресенье (getDay()===0); идём вперёд до нужного дня
  const base = new Date(2026, 6, 26, hour, 0, 0);
  const shift = (weekday - base.getDay() + 7) % 7;
  base.setDate(base.getDate() + shift);
  return base;
}

describe("структура маршрута", () => {
  it("id блоков уникальны", () => {
    const ids = ROUTINE.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("рабочие блоки всегда с главной задачей и аналогами", () => {
    for (const b of ROUTINE) {
      if (b.anchor) continue;
      expect(b.main, `${b.id}: нет главной задачи`).toBeTruthy();
      expect((b.analogs ?? []).length, `${b.id}: нет аналогов`).toBeGreaterThanOrEqual(1);
    }
  });

  it("аналог всегда легче или короче главной — иначе он не «полегче»", () => {
    for (const b of ROUTINE) {
      if (b.anchor || !b.main) continue;
      for (const alt of b.analogs ?? []) {
        const easier =
          alt.difficulty < b.main.difficulty || alt.duration < b.main.duration;
        expect(easier, `${b.id}: аналог «${alt.title}» не легче главной`).toBe(true);
      }
    }
  });

  it("часовые полосы одного дня не пересекаются", () => {
    for (let wd = 0; wd < 7; wd++) {
      const blocks = routineForDay(wd);
      for (let i = 1; i < blocks.length; i++) {
        expect(
          blocks[i].start,
          `день ${wd}: блок «${blocks[i].label}» лезет на предыдущий`,
        ).toBeGreaterThanOrEqual(blocks[i - 1].end);
      }
    }
  });
});

describe("поиск по времени и дню", () => {
  it("во вторник в 8 утра по плану Next.js", () => {
    const b = currentRoutineBlock(at(2, 9));
    expect(b?.label).toContain("Next.js");
    expect(b?.main?.title).toContain("Next.js");
  });

  it("в понедельник в 6:30 — пробежка", () => {
    const b = currentRoutineBlock(at(1, 6));
    expect(b?.main?.title).toContain("Бег");
  });

  it("обед не попадает в колоду (это якорь)", () => {
    const b = currentRoutineBlock(at(3, 12));
    expect(b).toBeNull();
  });

  it("глубокая ночь — плана нет", () => {
    const b = currentRoutineBlock(at(4, 3));
    expect(b).toBeNull();
  });

  it("подпись расписания знает про обед и сон", () => {
    expect(routineLabelAt(1, 12)).toBe("Обед");
    expect(routineLabelAt(1, 23)).toBe("Сон");
  });

  it("подпись держится весь многочасовой блок", () => {
    // 08–12 в понедельник — TypeScript и в 8, и в 11
    expect(routineLabelAt(1, 8)).toContain("TypeScript");
    expect(routineLabelAt(1, 11)).toContain("TypeScript");
  });
});
