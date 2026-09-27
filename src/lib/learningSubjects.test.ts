import { expect, it } from "vitest";
import { subjectsFromEvents, parseLearningSubject } from "./learningSubjects";
import { parseEvents } from "./ical";
it("extracts and deduplicates course categories without guessing subjects from assignment titles", () => {
  const events = parseEvents(`BEGIN:VCALENDAR
BEGIN:VEVENT
UID:1
SUMMARY:Quiz
CATEGORIES:Computer Networks | Teacher
END:VEVENT
BEGIN:VEVENT
UID:2
CATEGORIES:computer networks | Other Teacher
END:VEVENT
BEGIN:VEVENT
UID:3
SUMMARY:Philosophy: essay
END:VEVENT
END:VCALENDAR`, "Asia/Almaty");
  expect(subjectsFromEvents(events)).toEqual(["Computer Networks"]);
});
it("supports old generic routes and validates bounded subject materials", () => {
  expect(parseLearningSubject(undefined)).toBeUndefined();
  expect(parseLearningSubject({ name: " Math ", materials: " Integrals " })).toEqual({ name: "Math", materials: "Integrals" });
  for (const value of [null, {}, { name: "x", materials: "" }, { name: "Math", materials: "a".repeat(4001) }]) expect(() => parseLearningSubject(value)).toThrow();
});
