import { describe, it, expect } from "vitest";
import { mergeSnapshots, sameSnapshot } from "./syncMerge";
const task = (id: string) => ({ id, title: id, done: false });
describe("offline devices", () => {
  it("keeps independent edits and additions from both devices", () => {
    const base = { todos: [task("a"), task("b")], name: "A" };
    const phone = { ...base, todos: [{ ...task("a"), done: true }, task("b"), task("c")] };
    const laptop = { ...base, todos: [task("a"), { ...task("b"), title: "edited" }, task("d")] };
    const result = mergeSnapshots(base, phone, laptop);
    expect(result.todos).toEqual(expect.arrayContaining([{ ...task("a"), done: true }, { ...task("b"), title: "edited" }, task("c"), task("d")]));
    expect(mergeSnapshots(base, phone, result)).toEqual(result);
  });
  it("does not resurrect a deleted task from an offline device", () => {
    const base = { todos: [task("a")] };
    const edited = { todos: [{ ...task("a"), done: true }] };
    expect(mergeSnapshots(base, edited, { todos: [] }).todos).toEqual([]);
    expect(mergeSnapshots(base, { todos: [] }, edited).todos).toEqual([]);
  });
  it("combines edits to different fields of the same task", () => {
    const base = { todos: [task("a")] };
    expect(mergeSnapshots(base, { todos: [{ ...task("a"), done: true }] }, { todos: [{ ...task("a"), title: "new" }] }).todos[0]).toEqual({ id: "a", title: "new", done: true });
  });
  it("preserves account fields on first migration while importing new tasks", () => {
    expect(mergeSnapshots(null, { name: "Guest", todos: [task("a")] }, { name: "Owner", todos: [task("b")] })).toEqual({ name: "Owner", todos: [task("b"), task("a")] });
  });
  it("retains edits made while a request was in flight", () => {
    const sent = { todos: [task("a")] };
    const current = { todos: [task("a"), task("b")] };
    const response = { todos: [{ ...task("a"), done: true }] };
    expect(mergeSnapshots(sent, current, response).todos).toEqual([{ ...task("a"), done: true }, task("b")]);
  });
});

it("ignores PostgreSQL JSONB object key order and timestamps", () => {
 expect(sameSnapshot({ todos: [{ id: "a", done: true }], updatedAt: 1 }, { updatedAt: 2, todos: [{ done: true, id: "a" }] })).toBe(true);
});
