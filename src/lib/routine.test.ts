import { describe, it, expect } from "vitest";
import {
  ROUTINE,
  routineForDay,
  routineLabelAt,
  currentRoutineBlock,
  routineNow,
} from "./routine";

/**
 * Личный маршрут отключён (ROUTINE пуст) — эти тесты проверяют контракт,
 * от которого зависят вызывающие места (TimelineSchedule/useRoutineBlock/
 * HomeSection): при пустом ROUTINE все функции поиска должны молча
 * возвращать null/[], а не падать и не подставлять дефолты.
 */
describe("маршрут отключён", () => {
  it("ROUTINE пуст", () => {
    expect(ROUTINE).toEqual([]);
  });

  it("routineForDay — пустой список для любого дня", () => {
    for (let wd = 0; wd < 7; wd++) {
      expect(routineForDay(wd)).toEqual([]);
    }
  });

  it("routineLabelAt — всегда null", () => {
    expect(routineLabelAt(1, 8)).toBeNull();
    expect(routineLabelAt(3, 12)).toBeNull();
  });

  it("currentRoutineBlock — всегда null", () => {
    expect(currentRoutineBlock(new Date())).toBeNull();
  });

  it("routineNow — work/anchor/next все null", () => {
    const now = routineNow(new Date());
    expect(now.work).toBeNull();
    expect(now.anchor).toBeNull();
    expect(now.next).toBeNull();
  });
});
