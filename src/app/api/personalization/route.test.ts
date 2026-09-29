import { beforeEach, expect, it, vi } from "vitest";
import { emptyPersonalization, POLICY_VERSION } from "@/lib/personalization";
const m = vi.hoisted(() => ({ auth: vi.fn(), rate: vi.fn(), mutate: vi.fn(), read: vi.fn(), state: vi.fn(), learning: vi.fn() }));
vi.mock("@/auth", () => ({ auth: m.auth }));
vi.mock("@/lib/rateLimit", () => ({ rateLimit: m.rate }));
vi.mock("@/lib/personalizationDb", () => ({ mutatePersonalization: m.mutate }));
vi.mock("@/lib/db", () => ({ prisma: { personalizationProfile: { findUnique: m.read }, userState: { findUnique: m.state }, learningProfile: { findUnique: m.learning } } }));
import { GET, POST } from "./route";
const req = (body: object) => new Request("https://test/api/personalization", { method: "POST", body: JSON.stringify(body) });
let p = emptyPersonalization();
beforeEach(() => { vi.resetAllMocks(); p = emptyPersonalization(); m.auth.mockResolvedValue({ user: { id: "alice" } }); m.rate.mockReturnValue(true); m.mutate.mockImplementation(async (_id, fn) => { await fn(p); return { profile: p }; }); });
it("requires a session", async () => { m.auth.mockResolvedValue(null); expect((await GET()).status).toBe(401); expect((await POST(req({ action: "heartbeat" }))).status).toBe(401); expect(m.mutate).not.toHaveBeenCalled(); });
it("binds consent to the session, records current version and excludes existing completions", async () => {
  m.state.mockResolvedValue({ data: { todos: [{ id: "old", done: true }] } });
  expect((await POST(req({ action: "consent", version: POLICY_VERSION, enabled: true, timezone: "Asia/Almaty", userId: "bob" }))).status).toBe(200);
  expect(m.mutate.mock.calls[0][0]).toBe("alice"); expect(p.seen).toEqual(["todo:old"]); expect(p.receipts).toHaveLength(1);
});
it("allows acceptance without tracking and erases analytics on withdrawal", async () => {
  p.enabled = true; p.seen = ["a"]; p.days = { today: { seconds: 100, visits: 1, tasks: 1, actions: 0, quests: 0, sections: {} } };
  expect((await POST(req({ action: "consent", version: POLICY_VERSION, enabled: false, timezone: "Asia/Almaty" }))).status).toBe(200);
  expect(p.enabled).toBe(false); expect(p.days).toEqual({}); expect(p.seen).toEqual([]); expect(p.acceptedAt).toBeTruthy();
});
it("ignores heartbeat without consent and rejects old policy versions", async () => {
  await POST(req({ action: "heartbeat", seconds: 999999, tasks: 999999 })); expect(p.days).toEqual({}); expect(m.state).not.toHaveBeenCalled();
  expect((await POST(req({ action: "consent", version: "old", enabled: true, timezone: "UTC" }))).status).toBe(400);
});
