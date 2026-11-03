import { describe, expect, it } from "vitest";
import { parseQuizView } from "./viewState";

describe("PM quiz view recovery", () => {
  it("rejects stale or invalid questions and validates recovered controls", () => {
    expect(parseQuizView({ tab: "questions", active: "pm-real-3-19", variant: "3" })).toMatchObject({ variant: "3", active: "pm-real-3-19" });
    expect(parseQuizView({ tab: "questions", active: "pm-real-3-18", variant: "3" })).toBeNull();
    expect(parseQuizView(null)).toBeNull();
    expect(parseQuizView({ tab: "questions", active: "missing" })).toBeNull();
    const view = parseQuizView({ tab: "questions", active: "pm-real-4-18", variant: "4", lecture: "broken", filter: "broken", draft: { "pm-real-4-18": 2, "pm-real-1-1": 7 }, revealed: { "pm-real-4-18": true, missing: true }, scroll: -10 });
    expect(view).toMatchObject({ active: "pm-real-4-18", variant: "4", lecture: "all", filter: "all", scroll: 0, draft: { "pm-real-4-18": 2 }, revealed: { "pm-real-4-18": true } });
  });
});
