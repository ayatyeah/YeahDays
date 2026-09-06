import { describe, it, expect } from "vitest";
import { planNow, todoToAction, todoIdFromAction, LEAD_MIN } from "@/lib/planNow";
import type { Todo } from "@/store/useUserStore";

// 6 сентября 2026 — воскресенье; часы задаём локально, как их видит клиент.
const DAY = "2026-09-06";
const at = (h: number, m = 0) => new Date(2026, 8, 6, h, m);

function todo(p: Partial<Todo> & { id: string; title: string }): Todo {
  return {
    date: DAY,
    priority: "normal",
    subtasks: [],
    done: false,
    doneDays: [],
    createdAt: 1,
    completedAt: null,
    ...p,
  } as Todo;
}

const workout = todo({ id: "w", title: "Турник, брусья, бег 5 км", hour: 6, minute: 30, duration: 90 });
const shower = todo({ id: "s", title: "Душ и завтрак", hour: 8, duration: 60 });
const untimed = todo({ id: "u", title: "Купить хлеб" });

describe("planNow: что по плану сейчас", () => {
  it("в 06:00 уже показывает зарядку на 06:30 — за LEAD_MIN до старта", () => {
    expect(LEAD_MIN).toBe(30);
    const r = planNow([workout, shower, untimed], at(6, 0));
    expect(r.work?.main?.title).toBe("Турник, брусья, бег 5 км");
    expect(r.work?.startMin).toBe(6 * 60 + 30);
    expect(r.work?.endMin).toBe(8 * 60);
    expect(r.next?.main?.title).toBe("Душ и завтрак");
  });

  it("в 05:50 зарядка ещё «дальше», сейчас по плану пусто", () => {
    const r = planNow([workout, shower], at(5, 50));
    expect(r.work).toBeNull();
    expect(r.next?.main?.title).toBe("Турник, брусья, бег 5 км");
    expect(r.anchor).toBeNull();
  });

  it("в 07:30 зарядка идёт; душ — дальше", () => {
    const r = planNow([workout, shower], at(7, 30));
    expect(r.work?.id).toBe("todo:w");
    expect(r.next?.id).toBe("todo:s");
  });

  it("сделанная сегодня не поднимается — галочка уже стоит", () => {
    const done = { ...workout, done: true };
    const r = planNow([done, shower], at(6, 45));
    expect(r.work).toBeNull();
    expect(r.next?.id).toBe("todo:s");
  });

  it("повторяющаяся: сделанная в этот день не показывается, в другой — да", () => {
    const daily = todo({
      id: "d",
      title: "Медитация",
      hour: 7,
      duration: 20,
      repeat: { kind: "daily" } as Todo["repeat"],
      doneDays: [DAY],
    });
    expect(planNow([daily], at(7, 5)).work).toBeNull();
    expect(planNow([daily], at(7, 5), "2026-09-07").work?.id).toBe("todo:d");
  });

  it("после всех задач — ни сейчас, ни дальше", () => {
    const r = planNow([workout, shower], at(21, 0));
    expect(r.work).toBeNull();
    expect(r.next).toBeNull();
  });

  it("задача без часа и чужого дня не участвует", () => {
    const other = todo({ id: "o", title: "Чужой день", hour: 6, date: "2026-09-05" });
    const r = planNow([untimed, other], at(6, 0));
    expect(r.work).toBeNull();
    expect(r.next).toBeNull();
  });

  it("две наложившиеся — первой та, что началась раньше", () => {
    const lecture = todo({ id: "l", title: "Лекция", hour: 11, duration: 110 });
    const call = todo({ id: "c", title: "Созвон", hour: 12, duration: 30 });
    expect(planNow([call, lecture], at(12, 10)).work?.id).toBe("todo:l");
  });
});

describe("todoToAction", () => {
  it("id с префиксом, категория из названия, время в описании", () => {
    const a = todoToAction(workout);
    expect(a.id).toBe("todo:w");
    expect(todoIdFromAction(a.id)).toBe("w");
    expect(todoIdFromAction("fitness-1")).toBeNull();
    expect(a.category).toBe("fitness");
    expect(a.duration).toBe(90);
    expect(a.why).toContain("06:30–08:00");
    expect(a.custom).toBe(true);
  });

  it("без длительности — час и сложность «норма»", () => {
    const a = todoToAction(shower);
    expect(a.duration).toBe(60);
    expect(a.difficulty).toBe(2);
  });
});

describe("пары и LMS: значки университета", () => {
  const uni = (title: string) => todoToAction(todo({ id: "x", title, hour: 11, duration: 110 }));

  it("лекция → доска, практика → тетрадь, категория «Учёба»", () => {
    expect(uni("Computer Networks — лекция, 301L (Korkem)")).toMatchObject({ icon: "lecture", category: "learning" });
    expect(uni("Philosophy — практика, 103P (Korkem)")).toMatchObject({ icon: "practice", category: "learning" });
  });

  it("онлайн-пара → монитор", () => {
    expect(uni("Project Management — лекция, онлайн").icon).toBe("online");
    expect(uni("Cloud Computing — практика, online").icon).toBe("online");
  });

  it("события LMS: посещаемость, дедлайн, экзамен", () => {
    expect(uni("Philosophy: Attendance (Group SE-2425)").icon).toBe("attendance");
    expect(uni("Assignment 2 is due").icon).toBe("assignment");
    expect(uni("Computer Vision — Midterm exam").icon).toBe("exam");
  });

  it("зарядка не стала парой", () => {
    expect(uni("Турник, брусья, бег 5 км").icon).toBe("dumbbell");
  });
});
