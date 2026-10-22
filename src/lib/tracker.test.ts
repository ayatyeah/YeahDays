import { describe, expect, it } from "vitest";
import { cleanFields, diffFields, parseCsv, parseKey, rowsFromCsv, taskKey, toCsv } from "./tracker";

describe("task keys", () => {
  it("formats and parses YG keys", () => {
    expect(taskKey(29)).toBe("YG-29");
    expect(parseKey("YG-29")).toBe(29);
    expect(parseKey(" yg-7 ")).toBe(7);
    expect(parseKey("DIP-3")).toBeNull();
    expect(parseKey("YG-")).toBeNull();
  });
});

describe("field validation", () => {
  it("keeps known string fields, trims and limits length", () => {
    const { fields, error } = cleanFields({ summary: "  Build quiz  ", state: "In Review", unknown: "x", links: "a".repeat(3000) });
    expect(error).toBeUndefined();
    expect(fields).toEqual({ summary: "Build quiz", state: "In Review", links: "a".repeat(2000) });
  });
  it("rejects bad enums, empty summary, non-strings and bad dates", () => {
    expect(cleanFields({ state: "Doing" }).error).toBe("Unknown state");
    expect(cleanFields({ priority: "Urgent" }).error).toBe("Unknown priority");
    expect(cleanFields({ summary: "  " }).error).toBe("Summary is required");
    expect(cleanFields({ estimate: 5 }).error).toBe("estimate must be text");
    expect(cleanFields({ dueDate: "24.10.2026" }).error).toBe("Due date must be YYYY-MM-DD");
    expect(cleanFields(null).error).toBe("Invalid body");
  });
  it("lists only changed fields for the activity log", () => {
    expect(diffFields({ state: "Open", assignee: "Ayat" }, { state: "Done", assignee: "Ayat" })).toEqual([
      { field: "state", fromValue: "Open", toValue: "Done" },
    ]);
  });
});

describe("CSV", () => {
  it("parses quoted cells with commas, quotes and newlines", () => {
    expect(parseCsv('a,b\n"x, y","say ""hi""\nline 2"\n')).toEqual([["a", "b"], ["x, y", 'say "hi"\nline 2']]);
  });
  it("round-trips tasks through export and import", () => {
    const csv = toCsv([{ number: 3, summary: "Interviews, 3–5", state: "In Progress", priority: "Critical", acceptance: 'Notes "pseudonymised"' }]);
    const { tasks, skipped } = rowsFromCsv(csv);
    expect(skipped).toEqual([]);
    expect(tasks).toEqual([{ number: 3, fields: expect.objectContaining({ summary: "Interviews, 3–5", state: "In Progress", priority: "Critical", acceptance: 'Notes "pseudonymised"' }) }]);
  });
  it("imports the YouTrack backlog columns and reports bad rows", () => {
    const csv = "Issue Id,Summary,Priority,State,Due Date\nYG-1,Create repo,Critical,Open,2026-10-22\n,No id,High,Open,\nYG-2,Bad state,High,Doing,\n";
    const { tasks, skipped } = rowsFromCsv(csv);
    expect(tasks.map((t) => t.number)).toEqual([1]);
    expect(tasks[0].fields.dueDate).toBe("2026-10-22");
    expect(skipped).toEqual(["Row 3: no YG-n Issue Id", "Row 4: Unknown state"]);
  });
});
