import { describe, it, expect } from "vitest";
import {
  unfold,
  unescapeText,
  parseLine,
  parseDateValue,
  zonedWallToUtc,
  partsInZone,
  parseEvents,
} from "./ical.mjs";

describe("unfold", () => {
  it("склеивает строки, перенесённые по правилу RFC 5545", () => {
    const folded = "DESCRIPTION:начало\r\n длинного\r\n\tописания";
    expect(unfold(folded)).toBe("DESCRIPTION:началодлинногоописания");
  });

  it("не трогает обычный перенос без ведущего пробела", () => {
    expect(unfold("A:1\r\nB:2")).toBe("A:1\nB:2");
  });
});

describe("unescapeText", () => {
  it("разворачивает \\n, \\, и \\;", () => {
    expect(unescapeText("строка\\nвторая\\, и\\; ещё")).toBe("строка\nвторая, и; ещё");
  });

  it("экранированный бэкслеш перед n остаётся бэкслешем и буквой", () => {
    // Наивная цепочка replace(/\\n/) превратила бы это в перевод строки.
    expect(unescapeText("C:\\\\next")).toBe("C:\\next");
  });
});

describe("parseLine", () => {
  it("разбирает имя, параметры и значение", () => {
    const p = parseLine("DTSTART;VALUE=DATE:20260915");
    expect(p.name).toBe("DTSTART");
    expect(p.params.VALUE).toBe("DATE");
    expect(p.value).toBe("20260915");
  });

  it("не режет значение по двоеточию внутри кавычек параметра", () => {
    const p = parseLine('DTSTART;TZID="GMT+05:00":20260915T235900');
    expect(p.params.TZID).toBe("GMT+05:00");
    expect(p.value).toBe("20260915T235900");
  });
});

describe("parseDateValue", () => {
  it("VALUE=DATE — событие на весь день", () => {
    const d = parseDateValue("20260915", { VALUE: "DATE" }, "Asia/Almaty");
    expect(d.allDay).toBe(true);
    expect(d.utcMs).toBe(Date.UTC(2026, 8, 15));
  });

  it("суффикс Z читается как UTC", () => {
    const d = parseDateValue("20260915T185900Z", {}, "Asia/Almaty");
    expect(d.allDay).toBe(false);
    expect(d.utcMs).toBe(Date.UTC(2026, 8, 15, 18, 59, 0));
  });

  it("время с TZID переводится в UTC по указанной зоне", () => {
    const d = parseDateValue("20260915T235900", { TZID: "Asia/Almaty" }, "UTC");
    // Алматы UTC+5 → 23:59 местного это 18:59 UTC того же дня.
    expect(d.utcMs).toBe(Date.UTC(2026, 8, 15, 18, 59, 0));
  });

  it("мусорное значение не роняет разбор", () => {
    expect(parseDateValue("что-то не то", {}, "UTC")).toBeNull();
  });
});

describe("часовые пояса", () => {
  it("zonedWallToUtc и partsInZone обратны друг другу", () => {
    const utc = zonedWallToUtc(2026, 9, 15, 23, 59, 0, "Asia/Almaty");
    expect(partsInZone(utc, "Asia/Almaty")).toMatchObject({
      year: 2026,
      month: 9,
      day: 15,
      hour: 23,
      minute: 59,
    });
  });

  it("полночь по местному времени не уезжает на сутки назад", () => {
    const utc = zonedWallToUtc(2026, 9, 4, 0, 0, 0, "Asia/Almaty");
    expect(partsInZone(utc, "Asia/Almaty")).toMatchObject({ day: 4, hour: 0 });
  });
});

describe("parseEvents", () => {
  const ics = [
    "BEGIN:VCALENDAR",
    "PRODID:-//Moodle Pty Ltd//NONSGML Moodle Version 2026042002//EN",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    "UID:1234567@lms.astanait.edu.kz",
    "SUMMARY:Assignment 1 is due",
    "DESCRIPTION:Сдать отчёт\\, приложить код",
    "DTSTART:20260915T185900Z",
    "DTEND:20260915T185900Z",
    "CATEGORIES:Computer Vision | Kaiyrkhan Nurym",
    "END:VEVENT",
    "BEGIN:VEVENT",
    "UID:7654321@lms.astanait.edu.kz",
    "SUMMARY:Quiz 2 closes",
    "DTSTART:20260920T120000Z",
    "DTEND:20260920T130000Z",
    "CATEGORIES:Cloud Computing | Bakiyeva Aigerim",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  it("вытаскивает оба события со всеми полями", () => {
    const events = parseEvents(ics, "Asia/Almaty");
    expect(events).toHaveLength(2);

    expect(events[0]).toMatchObject({
      uid: "1234567@lms.astanait.edu.kz",
      summary: "Assignment 1 is due",
      description: "Сдать отчёт, приложить код",
      categories: ["Computer Vision | Kaiyrkhan Nurym"],
    });
    expect(events[0].start.utcMs).toBe(Date.UTC(2026, 8, 15, 18, 59, 0));
  });

  it("пустой календарь Moodle даёт ноль событий, а не падение", () => {
    const empty = [
      "BEGIN:VCALENDAR",
      "METHOD:PUBLISH",
      "PRODID:-//Moodle Pty Ltd//NONSGML Moodle Version 2026042002//EN",
      "VERSION:2.0",
      "END:VCALENDAR",
    ].join("\r\n");
    expect(parseEvents(empty, "Asia/Almaty")).toEqual([]);
  });
});
