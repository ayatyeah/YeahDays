import { describe, it, expect } from "vitest";
import { isTodoOnDay, type Todo, type RepeatKind } from "@/store/useUserStore";
import { isTodoOnDay as isTodoOnDayServer } from "@/lib/externalState";

/** Повторяющаяся задача с якорем в date. */
function todo(anchor: string, kind: RepeatKind, weekday?: number): Todo {
  return {
    id: "t",
    title: "Пробежка",
    date: anchor,
    priority: "normal",
    subtasks: [],
    repeat: { kind, weekday },
    done: false,
    doneDays: [],
    createdAt: 0,
    completedAt: null,
  };
}

/**
 * Клиентская и серверная копии isTodoOnDay живут в разных файлах
 * (src/store/useUserStore.ts и src/lib/externalState.ts, плюс третья в
 * dispatch). Разъехавшись, они дали бы задачу, которая видна в приложении,
 * но не получает уведомления — поэтому проверяем ОБЕ одним ответом.
 */
function onDay(t: Todo, day: string): boolean {
  const client = isTodoOnDay(t, day);
  const server = isTodoOnDayServer(t, day);
  expect(server, `клиент и сервер разошлись на ${day}`).toBe(client);
  return client;
}

describe("повтор «через день»", () => {
  const t = todo("2026-09-05", "everyOther");

  it("идёт от якоря: 5-е да, 6-е нет, 7-е да", () => {
    expect(onDay(t, "2026-09-05")).toBe(true);
    expect(onDay(t, "2026-09-06")).toBe(false);
    expect(onDay(t, "2026-09-07")).toBe(true);
    expect(onDay(t, "2026-09-08")).toBe(false);
  });

  it("до якоря не показывается", () => {
    expect(onDay(t, "2026-09-04")).toBe(false);
    expect(onDay(t, "2026-09-03")).toBe(false);
  });

  it("не сбивается на стыке 31-дневного месяца", () => {
    // Ровно тот случай, на котором ломается «по чётности числа»:
    // 31 октября и 1 ноября оба нечётные — вышло бы два дня подряд.
    const oct = todo("2026-10-01", "everyOther");
    expect(onDay(oct, "2026-10-31")).toBe(true);
    expect(onDay(oct, "2026-11-01")).toBe(false);
    expect(onDay(oct, "2026-11-02")).toBe(true);
  });

  it("держит ритм на длинной дистанции", () => {
    // Полгода спустя чередование не должно разъехаться. От 2026-09-05 до
    // 2027-03-05 ровно 181 день — нечётное, значит НЕ беговой; беговой
    // приходится на 6 марта. Считано по календарю, а не на глаз.
    expect(onDay(t, "2027-03-05")).toBe(false);
    expect(onDay(t, "2027-03-06")).toBe(true);
  });

  it("переживает переход через февраль", () => {
    const feb = todo("2027-02-27", "everyOther");
    expect(onDay(feb, "2027-02-27")).toBe(true);
    expect(onDay(feb, "2027-02-28")).toBe(false);
    expect(onDay(feb, "2027-03-01")).toBe(true);
  });
});

describe("остальные повторы не задеты", () => {
  it("каждый день", () => {
    const t = todo("2026-09-01", "daily");
    expect(onDay(t, "2026-09-05")).toBe(true);
    expect(onDay(t, "2026-09-06")).toBe(true);
  });

  it("по будням", () => {
    const t = todo("2026-09-01", "weekdays");
    expect(onDay(t, "2026-09-04")).toBe(true); // пятница
    expect(onDay(t, "2026-09-05")).toBe(false); // суббота
  });

  it("раз в неделю по заданному дню", () => {
    const t = todo("2026-09-01", "weekly", 1); // понедельник
    expect(onDay(t, "2026-09-07")).toBe(true);
    expect(onDay(t, "2026-09-08")).toBe(false);
  });
});
