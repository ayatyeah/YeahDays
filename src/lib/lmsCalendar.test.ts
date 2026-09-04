import { describe, it, expect } from "vitest";
import { courseName, todoTitle, eventToDraft, planSync } from "@/lib/lmsCalendar";
import type { IcalEvent } from "@/lib/ical";
import type { Todo } from "@/lib/externalState";

/** Событие в том виде, в каком его отдаёт parseEvents. */
function event(overrides: Partial<IcalEvent> = {}): IcalEvent {
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

/** Уже существующая задача пользователя. */
function todo(title: string, date: string): Todo {
  return {
    id: "x",
    title,
    date,
    priority: "normal",
    subtasks: [],
    done: false,
    doneDays: [],
    createdAt: 0,
    completedAt: null,
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

describe("eventToDraft", () => {
  it("дедлайн 23:59 по Алматы попадает на свой день, час и минуту", () => {
    // 18:59 UTC = 23:59 в Алматы (UTC+5) того же числа.
    expect(eventToDraft(event())).toMatchObject({
      title: "Computer Vision: Assignment 1 is due",
      date: "2026-09-15",
      hour: 23,
      minute: 59,
      priority: "high",
    });
  });

  it("ночной дедлайн не уезжает на предыдущий день", () => {
    // Главная ловушка всего импорта: 21:00 UTC 3 сентября — это уже
    // 02:00 4 сентября в Алматы. Наивное чтение UTC-даты дало бы 09-03.
    const night = event({
      start: { allDay: false, utcMs: Date.UTC(2026, 8, 3, 21, 0, 0) },
      end: null,
    });
    expect(eventToDraft(night)).toMatchObject({ date: "2026-09-04", hour: 2 });
  });

  it("у нулевого интервала длительности нет", () => {
    expect(eventToDraft(event())).not.toHaveProperty("duration");
  });

  it("ненулевой интервал переводится в минуты", () => {
    const pair = event({
      start: { allDay: false, utcMs: Date.UTC(2026, 8, 20, 4, 0, 0) },
      end: { allDay: false, utcMs: Date.UTC(2026, 8, 20, 5, 50, 0) },
    });
    expect(eventToDraft(pair)?.duration).toBe(110);
  });

  it("событие на весь день не получает ни часа, ни минут", () => {
    const allDay = event({ start: { allDay: true, utcMs: Date.UTC(2026, 8, 15) }, end: null });
    const draft = eventToDraft(allDay);
    expect(draft?.date).toBe("2026-09-15");
    expect(draft).not.toHaveProperty("hour");
    expect(draft).not.toHaveProperty("minute");
  });

  it("описание из Moodle переезжает в заметку", () => {
    expect(eventToDraft(event({ description: "  Сдать отчёт  " }))?.note).toBe("Сдать отчёт");
  });

  it("пустое описание заметку не создаёт", () => {
    expect(eventToDraft(event())).not.toHaveProperty("note");
  });

  it("без DTSTART задачи не будет", () => {
    expect(eventToDraft(event({ start: null }))).toBeNull();
  });
});

describe("planSync", () => {
  it("на пустом списке задач создаёт всё", () => {
    const plan = planSync([event(), event({ uid: "2", summary: "Quiz closes" })], []);
    expect(plan.create).toHaveLength(2);
    expect(plan.alreadyPresent).toBe(0);
  });

  it("повторный прогон не создаёт ничего — главное свойство синка", () => {
    const events = [event()];
    const first = planSync(events, []);
    // Имитируем, что созданное лежит в задачах пользователя.
    const saved = first.create.map((d) => todo(d.title, d.date));
    const second = planSync(events, saved);
    expect(second.create).toHaveLength(0);
    expect(second.alreadyPresent).toBe(1);
  });

  it("два одинаковых события в одном файле дают одну задачу", () => {
    expect(planSync([event(), event()], []).create).toHaveLength(1);
  });

  it("сравнение по заголовку регистронезависимо и без краевых пробелов", () => {
    const existing = [todo("  computer vision: assignment 1 is due  ", "2026-09-15")];
    expect(planSync([event()], existing).alreadyPresent).toBe(1);
  });

  it("не трогает посторонние задачи пользователя", () => {
    const mine = [todo("Сходить в зал", "2026-09-15")];
    const plan = planSync([event()], mine);
    expect(plan.create).toHaveLength(1);
    expect(plan.alreadyPresent).toBe(0);
  });

  it("перенесённый дедлайн создаёт вторую задачу, старую не трогает", () => {
    // Осознанный компромисс: править чужую задачу синк не имеет права,
    // человек мог перенести её сам. Обе видны — лишнюю удалит руками.
    const existing = [todo("Computer Vision: Assignment 1 is due", "2026-09-15")];
    const moved = event({ start: { allDay: false, utcMs: Date.UTC(2026, 8, 22, 18, 59, 0) } });
    expect(planSync([moved], existing).create).toHaveLength(1);
  });

  it("события без даты считаются отдельно и не роняют прогон", () => {
    const plan = planSync([event({ start: null }), event()], []);
    expect(plan.unusable).toBe(1);
    expect(plan.create).toHaveLength(1);
  });
});
