import { expect, it } from "vitest";
import { isLmsDeadline } from "./lmsEventKind";
import { newDeadlineNotice } from "./lmsCalendar";
import { planNow } from "./planNow";
import { timeSpentBySubject } from "./timeSpent";
import type { Todo } from "@/store/useUserStore";
const make = (title: string, source?: "lms"): Todo => ({ id: title, title, source, date: "2026-09-28", hour: 10, minute: 0, duration: 50, priority: "normal", done: false, doneDays: [], subtasks: [], createdAt: 0, completedAt: null });
it("separates imported and legacy assignments without treating manual lab sessions as deadlines", () => {
  expect(isLmsDeadline(make("Networks: Attendance", "lms"))).toBe(false);
  expect(isLmsDeadline(make("Networks: Посещаемость", "lms"))).toBe(false);
  expect(isLmsDeadline(make("Networks: lab 3 is due"))).toBe(true);
  expect(isLmsDeadline(make("Assignment", "lms"))).toBe(true);
  expect(isLmsDeadline(make("Networks — лабораторная работа"))).toBe(false);
});
it("counts only attendance time, including legacy tasks without source", () => {
  const todos = [make("Networks: Attendance", "lms"), make("Networks: lab 3 is due"), make("Networks: Assignment", "lms")];
  expect(timeSpentBySubject(todos, 1, new Date(2026, 8, 28))).toMatchObject([{ subject: "Networks", minutes: 50 }]);
});
it("does not announce attendance as a new deadline", () => {
  expect(newDeadlineNotice([make("Networks: Attendance", "lms")], "2026-09-28")).toBeNull();
  expect(newDeadlineNotice([make("Networks: Attendance", "lms"), make("Networks: lab 3 is due", "lms")], "2026-09-28")?.title).toBe("Новый дедлайн");
});
it("puts attendance in the current daily plan and excludes deadline-only events", () => {
  const attendance = make("Networks: Attendance", "lms");
  const deadline = make("Networks: lab 3 is due");
  const now = new Date(2026, 8, 28, 10, 5);
  expect(planNow([deadline], now).work).toBeNull();
  expect(planNow([deadline, attendance], now).work?.label).toBe(attendance.title);
});
