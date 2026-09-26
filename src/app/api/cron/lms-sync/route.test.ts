import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  sync: vi.fn(), connections: { findMany: vi.fn(), updateMany: vi.fn() }, user: { findUnique: vi.fn() },
}));
vi.mock("@/lib/db", () => ({ prisma: { lmsConnection: mocks.connections, user: mocks.user } }));
vi.mock("@/lib/lmsSync", () => ({ syncLmsCalendar: mocks.sync }));
vi.mock("@/lib/lmsConnection", () => ({ decryptLmsUrl: (url: string) => url }));
import { POST } from "./route";
const request = (dry = false) => new Request(`http://localhost/api/cron/lms-sync${dry ? "?dry=1" : ""}`, {
  method: "POST", headers: { authorization: "Bearer test-secret" },
});
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("CRON_SECRET", "test-secret"); vi.stubEnv("LMS_SYNC_USER_ID", ""); vi.stubEnv("LMS_ICAL_URL", "");
  mocks.connections.findMany.mockResolvedValue([
    { userId: "alice", encryptedUrl: "alice-calendar", timezone: "Asia/Almaty" },
    { userId: "bob", encryptedUrl: "bob-calendar", timezone: "Asia/Almaty" },
  ]);
  mocks.sync.mockResolvedValue({ ok: true, created: 2 });
});
afterEach(() => vi.unstubAllEnvs());
describe("multi-user LMS cron", () => {
  it("rejects unauthenticated cron calls before reading connections", async () => {
    expect((await POST(new Request("http://localhost"))).status).toBe(401);
    expect(mocks.connections.findMany).not.toHaveBeenCalled();
  });
  it("keeps each student's URL and user ID together", async () => {
    expect((await (await POST(request())).json()).users).toBe(2);
    expect(mocks.sync).toHaveBeenNthCalledWith(1, "alice", "alice-calendar", "Asia/Almaty", false);
    expect(mocks.sync).toHaveBeenNthCalledWith(2, "bob", "bob-calendar", "Asia/Almaty", false);
  });
  it("continues after one calendar fails without exposing its secret", async () => {
    mocks.sync.mockRejectedValueOnce(new Error("private-token"));
    const response = await (await POST(request())).json();
    expect(response.ok).toBe(false);
    expect(response.results[1]).toMatchObject({ userId: "bob", ok: true });
    expect(JSON.stringify(response)).not.toContain("private-token");
  });
  it("dry-run does not update status and asks sync not to write", async () => {
    await POST(request(true));
    expect(mocks.connections.updateMany).not.toHaveBeenCalled();
    expect(mocks.sync.mock.calls.every((call) => call[3] === true)).toBe(true);
  });
  it("does not restart legacy sync after a linked owner disconnects", async () => {
    vi.stubEnv("LMS_SYNC_USER_ID", "owner"); vi.stubEnv("LMS_ICAL_URL", "old-calendar");
    mocks.user.findUnique.mockResolvedValue({ banned: false, accounts: [{ id: "linked-lms" }] });
    await POST(request());
    expect(mocks.sync).toHaveBeenCalledTimes(2);
  });
});
