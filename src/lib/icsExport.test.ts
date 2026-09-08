import { describe, it, expect } from "vitest";
import { buildIcs } from "@/lib/icsExport";
import type { Todo } from "@/store/useUserStore";

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

const MONDAY = new Date(2026, 8, 7); // понедельник

describe("buildIcs", () => {
  it("собирает валидный каркас календаря", () => {
    const ics = buildIcs([], { from: MONDAY });
    expect(ics.startsWith("BEGIN:VCALENDAR")).toBe(true);
    expect(ics.trimEnd().endsWith("END:VCALENDAR")).toBe(true);
    expect(ics).toContain("VERSION:2.0");
    // строки разделяются CRLF, как требует формат
    expect(ics.includes("\r\n")).toBe(true);
  });

  it("пара становится событием с началом и концом", () => {
    const ics = buildIcs([todo({ id: "a", title: "Cloud Computing", hour: 13, minute: 5, duration: 105 })], {
      from: MONDAY,
      days: 1,
    });
    expect(ics).toContain("DTSTART:20260907T130500");
    expect(ics).toContain("DTEND:20260907T145000");
    expect(ics).toContain("SUMMARY:Cloud Computing");
  });

  it("повтор разворачивается в отдельные события по дням", () => {
    const weekly = todo({
      id: "w",
      title: "Лекция",
      hour: 10,
      duration: 60,
      repeat: { kind: "weekly", weekday: 1 } as Todo["repeat"],
    });
    const ics = buildIcs([weekly], { from: MONDAY, days: 15 });
    expect((ics.match(/BEGIN:VEVENT/g) ?? []).length).toBe(3); // 7, 14, 21 сентября
  });

  it("отменённый день не попадает в выгрузку", () => {
    const weekly = todo({
      id: "w",
      title: "Лекция",
      hour: 10,
      duration: 60,
      repeat: { kind: "weekly", weekday: 1 } as Todo["repeat"],
      skipDays: ["2026-09-14"],
    });
    const ics = buildIcs([weekly], { from: MONDAY, days: 15 });
    expect((ics.match(/BEGIN:VEVENT/g) ?? []).length).toBe(2);
    expect(ics).not.toContain("DTSTART:20260914");
  });

  it("события LMS и выполненное не выгружаются", () => {
    const lms = todo({ id: "l", title: "Attendance", hour: 12, duration: 50, source: "lms" });
    const done = todo({ id: "d", title: "Сделано", hour: 9, duration: 30, done: true });
    expect(buildIcs([lms, done], { from: MONDAY, days: 1 })).not.toContain("BEGIN:VEVENT");
  });

  it("запятые и переводы строк экранируются", () => {
    const ics = buildIcs(
      [todo({ id: "x", title: "Пара, аудитория 305; корпус", hour: 9, duration: 60, note: "первая\nвторая" })],
      { from: MONDAY, days: 1 },
    );
    expect(ics).toContain("SUMMARY:Пара\\, аудитория 305\\; корпус");
    expect(ics).toContain("DESCRIPTION:первая\\nвторая");
  });

  it("задача без часа пропускается — событию нужно время", () => {
    expect(buildIcs([todo({ id: "n", title: "Когда-нибудь" })], { from: MONDAY, days: 1 })).not.toContain(
      "BEGIN:VEVENT",
    );
  });

  it("длинное название сворачивается по правилам формата", () => {
    const long = "Очень длинное название пары, которое заведомо превышает семьдесят пять октетов и должно свернуться";
    const ics = buildIcs([todo({ id: "L", title: long, hour: 8, duration: 60 })], { from: MONDAY, days: 1 });
    const summaryLine = ics.split("\r\n").find((l) => l.startsWith("SUMMARY:"))!;
    expect(summaryLine.length).toBeLessThanOrEqual(75);
  });
});
