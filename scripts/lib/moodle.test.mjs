import { describe, it, expect } from "vitest";
import { courseName, todoTitle, eventToTodo, eventsToTodos } from "./moodle.mjs";

/** Событие в том виде, в каком его отдаёт parseEvents. */
function event(overrides = {}) {
  return {
    uid: "1@lms.astanait.edu.kz",
    summary: "Assignment 1 is due",
    description: "",
    categories: ["Computer Vision | Kaiyrkhan Nurym"],
    start: { allDay: false, utcMs: Date.UTC(2026, 8, 15, 18, 59, 0) },
    end: { allDay: false, utcMs: Date.UTC(2026, 8, 15, 18, 59, 0) },
    ...overrides,
  };
}

describe("courseName", () => {
  it("отрезает преподавателя после вертикальной черты", () => {
    expect(courseName(["Computer Vision | Kaiyrkhan Nurym"])).toBe("Computer Vision");
  });

  it("без черты возвращает название целиком", () => {
    expect(courseName(["Philosophy"])).toBe("Philosophy");
  });

  it("пустые категории — пустая строка, а не падение", () => {
    expect(courseName([])).toBe("");
    expect(courseName(undefined)).toBe("");
  });
});

describe("todoTitle", () => {
  it("ставит предмет перед названием", () => {
    expect(todoTitle(event())).toBe("Computer Vision: Assignment 1 is due");
  });

  it("без курса — только название события", () => {
    expect(todoTitle(event({ categories: [] }))).toBe("Assignment 1 is due");
  });
});

describe("eventToTodo", () => {
  it("дедлайн 23:59 по Алматы попадает на свой день и час", () => {
    // 18:59 UTC = 23:59 в Алматы (UTC+5) того же числа.
    expect(eventToTodo(event())).toMatchObject({
      title: "Computer Vision: Assignment 1 is due",
      date: "2026-09-15",
      hour: 23,
      priority: "high",
    });
  });

  it("ночной дедлайн не уезжает на предыдущий день", () => {
    // Это главная ловушка всего импорта: 21:00 UTC 3 сентября — это уже
    // 02:00 4 сентября в Алматы. Наивное чтение UTC-даты дало бы 09-03.
    const night = event({ start: { allDay: false, utcMs: Date.UTC(2026, 8, 3, 21, 0, 0) }, end: null });
    expect(eventToTodo(night)).toMatchObject({ date: "2026-09-04", hour: 2 });
  });

  it("минуты дедлайна сохраняются — предпросмотр не должен округлять 23:59 до 23:00", () => {
    expect(eventToTodo(event()).minute).toBe(59);
  });

  it("у нулевого интервала длительности нет", () => {
    expect(eventToTodo(event())).not.toHaveProperty("duration");
  });

  it("ненулевой интервал переводится в минуты", () => {
    const pair = event({
      start: { allDay: false, utcMs: Date.UTC(2026, 8, 20, 4, 0, 0) },
      end: { allDay: false, utcMs: Date.UTC(2026, 8, 20, 5, 50, 0) },
    });
    expect(eventToTodo(pair).duration).toBe(110);
  });

  it("событие на весь день не получает час", () => {
    const allDay = event({
      start: { allDay: true, utcMs: Date.UTC(2026, 8, 15) },
      end: null,
    });
    const todo = eventToTodo(allDay);
    expect(todo.date).toBe("2026-09-15");
    expect(todo).not.toHaveProperty("hour");
  });

  it("без DTSTART задачи не будет — роут всё равно требует date", () => {
    expect(eventToTodo(event({ start: null }))).toBeNull();
  });
});

describe("eventsToTodos", () => {
  it("схлопывает повторы по UID", () => {
    const todos = eventsToTodos([event(), event(), event({ uid: "2@lms" })]);
    expect(todos).toHaveLength(2);
  });

  it("без UID дублем считается совпадение названия и даты", () => {
    const todos = eventsToTodos([event({ uid: "" }), event({ uid: "" })]);
    expect(todos).toHaveLength(1);
  });

  it("возвращает uid рядом с задачей — по нему ведётся журнал импорта", () => {
    const [first] = eventsToTodos([event()]);
    expect(first.uid).toBe("1@lms.astanait.edu.kz");
    expect(first.todo.date).toBe("2026-09-15");
  });
});
