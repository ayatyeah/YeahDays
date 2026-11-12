import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { EVENT_COURSES, eventCourseHref } from "./courses";
import { eventSummaries } from "./summaries";

describe("event course navigation", () => {
  it("places every published event in exactly one course", () => {
    const ids = EVENT_COURSES.flatMap(course => course.eventIds);
    expect(new Set(ids).size).toBe(ids.length);
    expect([...ids].sort()).toEqual(eventSummaries().map(event => event.id).sort());
  });
  it("provides a distinct existing logo and return route for every course", () => {
    expect(new Set(EVENT_COURSES.map(course => course.logo)).size).toBe(EVENT_COURSES.length);
    for (const course of EVENT_COURSES) {
      expect(existsSync(resolve(process.cwd(), `public${course.logo}`))).toBe(true);
      for (const id of course.eventIds) expect(eventCourseHref(id)).toBe(`/events/courses/${course.id}`);
    }
    expect(eventCourseHref("unknown-event")).toBe("/events");
  });
});
