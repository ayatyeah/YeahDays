import { describe, it, expect } from "vitest";
import {
  dayContext,
  chooseStudy,
  readVisitTimes,
  taskLearningHref,
} from "./dayFlow";
import type { Todo } from "@/store/useUserStore";
const now = new Date(2026, 9, 10, 10, 0);
const todo = (over: Partial<Todo> = {}): Todo => ({
  id: "a",
  title: "Read",
  date: "2026-10-10",
  priority: "normal",
  subtasks: [],
  done: false,
  doneDays: [],
  createdAt: 0,
  completedAt: null,
  ...over,
});
describe("day flow", () => {
  it("reserves five minutes before next class and does not recommend a long task", () => {
    const c = dayContext(
      [
        todo({ id: "class", hour: 10, minute: 20, duration: 60 }),
        todo({ id: "long", duration: 20 }),
        todo({ id: "short", duration: 10 }),
      ],
      now,
      25,
      "high",
    );
    expect(c.budget).toBe(15);
    expect(c.task?.id).toBe("short");
  });
  it("does not schedule anything during a class or a cancelled repeat", () => {
    expect(
      dayContext([todo({ hour: 9, minute: 30, duration: 90 })], now, 25, "high")
        .budget,
    ).toBe(0);
    expect(
      dayContext(
        [
          todo({
            hour: 9,
            repeat: { kind: "daily" },
            skipDays: ["2026-10-10"],
          }),
        ],
        now,
        25,
        "high",
      ).current,
    ).toBeUndefined();
  });
  it("deadlines do not block free time, completed and future tasks are excluded", () => {
    const c = dayContext(
      [
        todo({ source: "lms", hour: 10, duration: 60 }),
        todo({ id: "done", done: true }),
        todo({ id: "future", date: "2026-10-11" }),
      ],
      now,
      25,
      "low",
    );
    expect(c.current).toBeUndefined();
    expect(c.budget).toBe(10);
    expect(c.task?.id).toBe("a");
    expect(c.deadline?.id).toBe("a");
  });
  it("chooses a relevant deadline before recency, but respects duration", () => {
    const studies = [
      {
        id: "a",
        title: "A",
        detail: "Cloud Computing",
        href: "/a",
        minutes: 10,
        visited: 20,
      },
      {
        id: "b",
        title: "B",
        detail: "Computer Vision",
        href: "/b",
        minutes: 20,
        visited: 10,
      },
    ];
    expect(chooseStudy(studies, 25, "Computer Vision assignment")?.id).toBe(
      "b",
    );
    expect(chooseStudy(studies, 15, "Computer Vision assignment")?.id).toBe(
      "a",
    );
    expect(chooseStudy(studies, 5)).toBeUndefined();
  });
});

it("ignores damaged per-account visit history", () => {
  expect(readVisitTimes("null")).toEqual({});
  expect(readVisitTimes("not json")).toEqual({});
  expect(readVisitTimes('{"a":4,"b":"wrong","c":-2}')).toEqual({ a: 4 });
});

it("links existing event plans and quests without accepting external links", () => {
  expect(
    taskLearningHref("Notes [event:computer-vision-midterm:2026-10-10]"),
  ).toBe("/events/computer-vision-midterm");
  expect(taskLearningHref("/learn?view=lesson&skill=cv&quest=q2")).toBe(
    "/learn?view=lesson&skill=cv&quest=q2",
  );
  expect(taskLearningHref("https://example.com")).toBeUndefined();
  expect(taskLearningHref("/learn?view=lesson")).toBeUndefined();
});

it("keeps unfinished timed tasks available after their slot", () => {
  expect(
    dayContext(
      [todo({ id: "missed", hour: 8, duration: 10 })],
      now,
      15,
      "medium",
    ).task?.id,
  ).toBe("missed");
});
