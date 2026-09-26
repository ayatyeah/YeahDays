import { beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => {
  const tx = { userState: { upsert: vi.fn(), findUnique: vi.fn(), update: vi.fn() }, $queryRaw: vi.fn() };
  return { tx, prisma: { $transaction: vi.fn(async (fn) => fn(tx)) }, fetch: vi.fn(), push: vi.fn() };
});
vi.mock("@/lib/db", () => ({ prisma: mocks.prisma }));
vi.mock("@/lib/lmsClient", () => ({ fetchLmsCalendar: mocks.fetch }));
vi.mock("@/lib/push", () => ({ pushConfigured: true, sendPushToUser: mocks.push }));
import { syncLmsCalendar } from "./lmsSync";
const ics = 'BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nUID:42@lms\r\nSUMMARY:Assignment\r\nDTSTART:20260926T210000Z\r\nEND:VEVENT\r\nEND:VCALENDAR';
beforeEach(() => {
  vi.clearAllMocks(); mocks.fetch.mockResolvedValue(ics);
  mocks.tx.userState.findUnique.mockResolvedValue({ data: { name: "Alice", todos: [], moods: { today: { energy: "high" } } }, clientAt: new Date(0) });
});
it("imports into only the selected account, preserves profile and tags LMS deadlines", async () => {
  const result = await syncLmsCalendar("alice", "alice-calendar");
  expect(result.created).toBe(1);
  const write = mocks.tx.userState.update.mock.calls[0][0];
  expect(write.where).toEqual({ userId: "alice" });
  expect(write.data.data).toMatchObject({ name: "Alice", moods: { today: { energy: "high" } } });
  expect(write.data.data.todos[0]).toMatchObject({ source: "lms", title: "Assignment", date: "2026-09-27", hour: 2, done: false });
  expect(mocks.push.mock.calls[0][0]).toBe("alice");
});
it("does not duplicate existing deadlines or clear their completion", async () => {
  mocks.tx.userState.findUnique.mockResolvedValue({ data: { todos: [{ title: "Assignment", date: "2026-09-27", done: true }] }, clientAt: new Date(0) });
  expect((await syncLmsCalendar("alice", "alice-calendar")).created).toBe(0);
  expect(mocks.tx.userState.update).not.toHaveBeenCalled();
  expect(mocks.push).not.toHaveBeenCalled();
});
it("dry-run does not write state or send notifications", async () => {
  const result = await syncLmsCalendar("alice", "alice-calendar", "Asia/Almaty", true);
  expect(result).toMatchObject({ created: 0, wouldCreate: 1 });
  expect(mocks.tx.userState.upsert).not.toHaveBeenCalled();
  expect(mocks.tx.userState.update).not.toHaveBeenCalled();
  expect(mocks.push).not.toHaveBeenCalled();
});
it("failed imports do not touch state", async () => {
  mocks.fetch.mockRejectedValue(new Error("calendar unavailable"));
  await expect(syncLmsCalendar("alice", "alice-calendar")).rejects.toThrow();
  expect(mocks.prisma.$transaction).not.toHaveBeenCalled();
});
