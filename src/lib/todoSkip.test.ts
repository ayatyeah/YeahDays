import { describe, it, expect } from "vitest";
import { isTodoOnDay, type Todo } from "@/store/useUserStore";

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

describe("отмена повторяющейся задачи в отдельный день", () => {
  const lecture = todo({
    id: "l",
    title: "Cloud Computing — лекция",
    hour: 13,
    duration: 105,
    repeat: { kind: "weekly", weekday: 1 } as Todo["repeat"],
  });

  it("без отмен идёт каждую свою неделю", () => {
    expect(isTodoOnDay(lecture, "2026-09-07")).toBe(true); // понедельник
    expect(isTodoOnDay(lecture, "2026-09-14")).toBe(true);
  });

  it("отменённый день пропадает, остальные остаются", () => {
    const cancelled = { ...lecture, skipDays: ["2026-09-14"] };
    expect(isTodoOnDay(cancelled, "2026-09-07")).toBe(true);
    expect(isTodoOnDay(cancelled, "2026-09-14")).toBe(false);
    expect(isTodoOnDay(cancelled, "2026-09-21")).toBe(true);
  });

  it("история выполнений не страдает: отменённый день просто не показывается", () => {
    const cancelled = { ...lecture, doneDays: ["2026-09-07"], skipDays: ["2026-09-14"] };
    expect(cancelled.doneDays).toContain("2026-09-07");
    expect(isTodoOnDay(cancelled, "2026-09-14")).toBe(false);
  });

  it("у разовой задачи отмены не действуют — её просто удаляют", () => {
    const once = todo({ id: "o", title: "Разовая", skipDays: ["2026-09-07"] });
    expect(isTodoOnDay(once, "2026-09-07")).toBe(true);
  });

  it("пустой список отмен ничего не меняет", () => {
    expect(isTodoOnDay({ ...lecture, skipDays: [] }, "2026-09-07")).toBe(true);
  });
});
