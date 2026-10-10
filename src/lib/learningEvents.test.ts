import { describe, it, expect } from "vitest";
import { EVENTS } from "./events";
import { steps, readiness } from "./events/engine";
import {
  orderLearningEvents,
  summarizeLearningProgress,
  type LearningEventSummary,
} from "./learningEvents";
import { plural } from "./plural";
describe("learning overview", () => {
  it("matches the course readiness without sending question banks", () => {
    for (const event of EVENTS) {
      const list = steps(event),
        weights = { part: 0.2, lecture: 0.3, final: 0.5, deep: 0 };
      const summary: LearningEventSummary = {
        id: event.id,
        course: event.course,
        title: event.title,
        lectures: event.lectures.length,
        mocks: 0,
        practice: null,
        stepIds: list.map((s) => s.id),
        stepWeights: list.map(
          (s) => weights[s.kind] / list.filter((t) => t.kind === s.kind).length,
        ),
      };
      const progress = Object.fromEntries(
        list
          .filter((_, i) => i % 2 === 0)
          .map((s) => [s.id, { best: 0.8, last: 0.5, attempts: 2 }]),
      );
      const actual = summarizeLearningProgress(summary, progress);
      expect(actual.readiness).toBe(readiness(event, progress).percent);
      expect(actual.done).toBe(readiness(event, progress).done);
    }
  });
  it("puts started courses first, then newest, without hiding any course", () => {
    const events = ["old", "started", "new"].map(
      (id) => ({ id }) as LearningEventSummary,
    );
    expect(
      orderLearningEvents(events, { started: { done: 1, readiness: 2 } }).map(
        (e) => e.id,
      ),
    ).toEqual(["started", "new", "old"]);
  });
  it("handles Russian lecture endings", () => {
    expect(
      [0, 1, 4, 11, 21, 24].map((n) => plural(n, "лекция", "лекции", "лекций")),
    ).toEqual(["лекций", "лекция", "лекции", "лекций", "лекция", "лекции"]);
  });
});
