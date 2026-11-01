import { beforeEach, expect, it, vi } from "vitest";
const m = vi.hoisted(() => ({ users: vi.fn(), subs: vi.fn(), due: vi.fn(), claim: vi.fn(), digestClaim: vi.fn(), send: vi.fn(), cleanup: vi.fn() }));
vi.mock("./db", () => ({ prisma: {
  user: { findMany: m.users },
  pushSubscription: { findMany: m.subs, updateMany: m.digestClaim },
  scheduledNotification: { findMany: m.due, updateMany: m.claim, deleteMany: m.cleanup },
} }));
vi.mock("./push", () => ({ pushConfigured: true, sendPush: m.send, localHour: () => 8, localDateKey: () => "2026-11-01", morningMessage: () => ({ title: "Morning" }), eveningMessage: () => ({ title: "Evening" }) }));
import { runDigest } from "./pushDigest";
import { runDispatch } from "./pushDispatch";
beforeEach(() => { vi.resetAllMocks(); m.send.mockResolvedValue("sent"); m.digestClaim.mockResolvedValue({ count: 1 }); });
const ids = Array.from({ length: 61 }, (_, i) => `id${String(i).padStart(3, "0")}`);
it("sends a digest across multiple bounded pages without dropping subscriptions", async () => {
  m.subs.mockImplementation(({ where, take }) => ids.filter(id => !where.id || id > where.id.gt).slice(0, take).map(id => ({ id, tzOffset: 0, morningHour: 8, eveningHour: 20, lastSentAt: null, lastKind: null, user: { state: { data: {} } } })));
  expect(await runDigest()).toMatchObject({ ok: true, sent: 61 });
  expect(m.send).toHaveBeenCalledTimes(61);
  expect(m.subs).toHaveBeenCalledTimes(3);
  expect(m.subs.mock.calls.every(([q]) => q.take === 25)).toBe(true);
});
it("schedules every user page and drains due notifications in bounded batches", async () => {
  m.users.mockImplementation(({ where, take }) => ids.filter(id => !where.id || id > where.id.gt).slice(0, take).map(id => ({ id, pushSubs: [], state: { data: {} } })));
  const claimed = new Set<string>();
  m.due.mockImplementation(({ take }) => ids.filter(id => !claimed.has(id)).slice(0, take).map(id => ({ id, kind: "todo", user: { state: { data: {} }, pushSubs: [{ tzOffset: 0 }] } })));
  m.claim.mockImplementation(({ where }) => { claimed.add(where.id); return { count: 1 }; });
  expect(await runDispatch()).toMatchObject({ ok: true, sent: 61, scheduled: 0 });
  expect(m.users).toHaveBeenCalledTimes(3);
  expect(m.due).toHaveBeenCalledTimes(3);
  expect(m.send).toHaveBeenCalledTimes(61);
});
