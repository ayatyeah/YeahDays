import { describe, expect, it } from "vitest";
import {
  DEFAULT_NOTIFY,
  buildSchedule,
  inQuietHours,
  shiftOutOfQuiet,
  taskNotifications,
  todoNotification,
  type NotifyPrefs,
} from "./notifyPlan";

const prefs: NotifyPrefs = { ...DEFAULT_NOTIFY, quietFrom: 23, quietTo: 7 };

/** Полдень выбранного дня — удобная нейтральная точка отсчёта. */
function noon(day = 10): number {
  return new Date(2026, 0, day, 12, 0, 0, 0).getTime();
}

describe("inQuietHours", () => {
  it("понимает интервал через полночь", () => {
    expect(inQuietHours(23, 23, 7)).toBe(true);
    expect(inQuietHours(3, 23, 7)).toBe(true);
    expect(inQuietHours(7, 23, 7)).toBe(false);
    expect(inQuietHours(15, 23, 7)).toBe(false);
  });

  it("выключенные тихие часы никого не блокируют", () => {
    expect(inQuietHours(3, 8, 8)).toBe(false);
  });
});

describe("shiftOutOfQuiet", () => {
  it("переносит ночное напоминание на утро", () => {
    const at = new Date(2026, 0, 10, 2, 30).getTime();
    const moved = new Date(shiftOutOfQuiet(at, prefs));
    expect(moved.getHours()).toBe(7);
    expect(moved.getDate()).toBe(10);
  });

  it("вечернее уезжает на утро следующего дня", () => {
    const at = new Date(2026, 0, 10, 23, 30).getTime();
    const moved = new Date(shiftOutOfQuiet(at, prefs));
    expect(moved.getHours()).toBe(7);
    expect(moved.getDate()).toBe(11);
  });

  it("дневное не трогает", () => {
    const at = noon();
    expect(shiftOutOfQuiet(at, prefs)).toBe(at);
  });
});

describe("taskNotifications", () => {
  it("для короткой задачи не шлёт напоминание о половине времени", () => {
    const items = taskNotifications(
      { id: "t1", title: "Отжимания", duration: 5, acceptedAt: noon() },
      prefs,
    );
    expect(items.some((i) => i.key.endsWith(":half"))).toBe(false);
    expect(items.some((i) => i.key.endsWith(":end"))).toBe(true);
  });

  it("для длинной задачи ставит половину, конец и перебор по порядку", () => {
    const items = taskNotifications(
      { id: "t2", title: "Английский", duration: 60, acceptedAt: noon() },
      prefs,
    );
    const at = (suffix: string) =>
      items.find((i) => i.key.endsWith(suffix))!.at;
    expect(at(":half")).toBeLessThan(at(":end"));
    expect(at(":end")).toBeLessThan(at(":over"));
    expect(at(":over")).toBeLessThan(at(":stale"));
  });

  it("молчит, если напоминания о задачах выключены", () => {
    const items = taskNotifications(
      { id: "t3", title: "Бег", duration: 30, acceptedAt: noon() },
      { ...prefs, tasks: false },
    );
    expect(items).toHaveLength(0);
  });

  it("кладёт id задачи — по нему работает кнопка «Сделал»", () => {
    const items = taskNotifications(
      { id: "t4", title: "Чтение", duration: 30, acceptedAt: noon() },
      prefs,
    );
    expect(items.every((i) => i.taskId === "t4")).toBe(true);
  });
});

describe("todoNotification", () => {
  it("предупреждает заранее, а не в момент начала", () => {
    const item = todoNotification({
      id: "d1",
      title: "Созвон",
      day: "2026-01-10",
      hour: 14,
    })!;
    const at = new Date(item.at);
    expect(at.getHours()).toBe(13);
    expect(at.getMinutes()).toBe(55);
  });

  it("отбивает битую дату", () => {
    expect(
      todoNotification({ id: "d2", title: "X", day: "не дата", hour: 9 }),
    ).toBeNull();
  });
});

describe("buildSchedule", () => {
  it("выкидывает всё, что уже в прошлом", () => {
    const items = buildSchedule({
      active: {
        id: "t5",
        title: "Планка",
        duration: 10,
        acceptedAt: noon() - 3600_000,
      },
      todos: [],
      prefs,
      now: noon(),
    });
    expect(items.every((i) => i.at > noon())).toBe(true);
  });

  it("не будит ночью ради таймера задачи", () => {
    const lateNight = new Date(2026, 0, 10, 22, 50).getTime();
    const items = buildSchedule({
      active: {
        id: "t6",
        title: "Отчёт",
        duration: 30,
        acceptedAt: lateNight,
      },
      todos: [],
      prefs,
      now: lateNight,
    });
    for (const item of items) {
      expect(inQuietHours(new Date(item.at).getHours(), 23, 7)).toBe(false);
    }
  });

  it("отдаёт расписание по возрастанию времени", () => {
    const items = buildSchedule({
      active: {
        id: "t7",
        title: "Английский",
        duration: 60,
        acceptedAt: noon(),
      },
      todos: [
        { id: "d3", title: "Созвон", day: "2026-01-10", hour: 18 },
        { id: "d4", title: "Зал", day: "2026-01-10", hour: 15 },
      ],
      prefs,
      now: noon(),
    });
    const times = items.map((i) => i.at);
    expect([...times].sort((a, b) => a - b)).toEqual(times);
  });
});
