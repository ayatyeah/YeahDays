import { describe, expect, it } from "vitest";
import { completions, emptyPersonalization, POLICY_VERSION, publicPersonalization, recordActivity } from "./personalization";
const now = Date.parse("2026-09-29T10:00:00Z");
const enabled = () => ({ ...emptyPersonalization(), enabled: true, version: POLICY_VERSION });
describe("opt-in activity and achievements", () => {
  it("collects nothing before current consent", () => {
    for (const p of [emptyPersonalization(), { ...enabled(), version: "old" }]) { recordActivity(p, now, "today", [{ key: "x", kind: "tasks" }], true); expect(p.days).toEqual({}); }
  });
  it("deduplicates tabs and retries and does not grant XP for time", () => {
    const p = enabled(); const done = [{ key: "x", kind: "tasks" as const }];
    recordActivity(p, now, "calendar", done, true); recordActivity(p, now + 1000, "calendar", done, true);
    const result = publicPersonalization(p); expect(result.totals).toMatchObject({ seconds: 15, tasks: 1, visits: 1 }); expect(result).not.toHaveProperty("xp");
    recordActivity(p, now + 15000, "calendar", done, true); expect(publicPersonalization(p).totals.seconds).toBe(30);
  });
  it("baseline completions are excluded and repeats count once per day", () => {
    const entries = completions({ todos: [{ id: "old", done: true }, { id: "repeat", repeat: {}, doneDays: ["2026-09-28", "2026-09-29"] }], plan: [{ id: "duplicate", actionId: "todo:old", completed: true }] }, { skills: [{ id: "s", quests: [{ id: "q", completed: true }] }] });
    const p = enabled(); p.seen = ["todo:old", "todo:repeat:2026-09-28"];
    recordActivity(p, now, "today", entries, false); recordActivity(p, now, "today", entries, false);
    expect(publicPersonalization(p).totals).toMatchObject({ tasks: 1, actions: 0, quests: 1, seconds: 0 });
  });
  it("does not retain arbitrary paths, query strings, titles or notes in activity", () => {
    const p = enabled(); recordActivity(p, now, "/secret?token=private", completions({ todos: [{ id: "t", title: "secret text", note: "private", done: true }] }, null), true);
    expect(JSON.stringify(p)).not.toContain("secret"); expect(JSON.stringify(p)).not.toContain("private");
  });
});
