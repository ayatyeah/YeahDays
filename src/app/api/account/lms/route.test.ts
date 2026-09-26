import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  auth: vi.fn(), sync: vi.fn(), rate: vi.fn(), fetchCalendar: vi.fn(),
  connection: { findUnique: vi.fn(), updateMany: vi.fn(), deleteMany: vi.fn(), upsert: vi.fn() },
  account: { findFirst: vi.fn() },
}));
vi.mock("@/auth", () => ({ auth: mocks.auth }));
vi.mock("@/lib/db", () => ({ prisma: { lmsConnection: mocks.connection, account: mocks.account } }));
vi.mock("@/lib/lmsSync", () => ({ syncLmsCalendar: mocks.sync }));
vi.mock("@/lib/rateLimit", () => ({ rateLimit: mocks.rate }));
vi.mock("@/lib/lmsConnection", async (importOriginal) => ({
  ...await importOriginal<typeof import("@/lib/lmsConnection")>(),
  decryptLmsUrl: () => "private-url", encryptLmsUrl: () => "encrypted-calendar",
}));
vi.mock("@/lib/lmsClient", () => ({ fetchLmsCalendar: mocks.fetchCalendar }));
import { GET, POST, DELETE, PUT } from "./route";

beforeEach(() => { vi.clearAllMocks(); mocks.auth.mockResolvedValue({ user: { id: "alice" } }); mocks.rate.mockReturnValue(true); });
describe("personal LMS API", () => {
  it("requires authentication for all methods", async () => {
    mocks.auth.mockResolvedValue(null);
    for (const handler of [GET, POST, DELETE]) expect((await handler()).status).toBe(401);
    expect(mocks.connection.findUnique).not.toHaveBeenCalled();
  });
  it("syncs only the session's owner and never returns their secret", async () => {
    mocks.connection.findUnique.mockResolvedValue({ userId: "alice", encryptedUrl: "ciphertext", timezone: "Asia/Almaty" });
    mocks.sync.mockResolvedValue({ ok: true, created: 3 });
    const result = await POST();
    expect(mocks.connection.findUnique).toHaveBeenCalledWith({ where: { userId: "alice" } });
    expect(mocks.sync).toHaveBeenCalledWith("alice", "private-url", "Asia/Almaty");
    expect(await result.json()).toEqual({ ok: true, created: 3 });
  });
  it("records a safe error if the calendar token has expired", async () => {
    mocks.connection.findUnique.mockResolvedValue({ encryptedUrl: "ciphertext", timezone: "Asia/Almaty" });
    mocks.sync.mockRejectedValue(new Error("URL with secret"));
    const result = await POST();
    expect(result.status).toBe(502);
    expect(await result.text()).not.toContain("secret");
    expect(mocks.connection.updateMany).toHaveBeenCalled();
  });
  it("disconnects only the current account", async () => {
    expect((await DELETE()).status).toBe(200);
    expect(mocks.connection.upsert).toHaveBeenCalledWith({ where: { userId: "alice" }, create: { userId: "alice", encryptedUrl: "" }, update: { encryptedUrl: "", lastSyncedAt: null, lastError: null } });
  });
  it("reports missing calendar instead of pretending sync succeeded", async () => {
    mocks.connection.findUnique.mockResolvedValue(null);
    expect((await POST()).status).toBe(409);
    expect(mocks.sync).not.toHaveBeenCalled();
  });
});

const connectionRequest = (url: string) => new Request("https://example.com/api/account/lms", {
  method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url, userId: "bob" }),
});
const calendar = "https://lms.astanait.edu.kz/calendar/export_execute.php?userid=42&authtoken=test";
it("requires a YeahGrind session to connect a calendar", async () => {
  mocks.auth.mockResolvedValue(null);
  expect((await PUT(connectionRequest(calendar))).status).toBe(401);
  expect(mocks.fetchCalendar).not.toHaveBeenCalled();
});
it("validates a calendar and binds only to the session, never the supplied userId", async () => {
  mocks.fetchCalendar.mockResolvedValue("BEGIN:VCALENDAR\nEND:VCALENDAR");
  expect(await (await PUT(connectionRequest(calendar))).json()).toEqual({ ok: true });
  expect(mocks.connection.upsert).toHaveBeenCalledWith({ where: { userId: "alice" },
    create: { userId: "alice", encryptedUrl: "encrypted-calendar", timezone: "Asia/Almaty" },
    update: { encryptedUrl: "encrypted-calendar", timezone: "Asia/Almaty", lastSyncedAt: null, lastError: null },
  });
  expect(mocks.account.findFirst).not.toHaveBeenCalled();
});
it("rejects arbitrary fetch URLs before issuing any network request", async () => {
  expect((await PUT(connectionRequest("https://127.0.0.1/private"))).status).toBe(400);
  expect(mocks.fetchCalendar).not.toHaveBeenCalled();
});
it("keeps the previous connection if a new calendar cannot be read", async () => {
  mocks.fetchCalendar.mockRejectedValue(new Error("contains a private token"));
  const response = await PUT(connectionRequest(calendar));
  expect(response.status).toBe(502);
  expect(await response.text()).not.toContain("private token");
  expect(mocks.connection.upsert).not.toHaveBeenCalled();
});

it("does not expose even the encrypted calendar secret in status", async () => {
  mocks.connection.findUnique.mockResolvedValue({ encryptedUrl: "never-expose-me", lastSyncedAt: null });
  const result = await (await GET()).json();
  expect(result.connected).toBe(true);
  expect(JSON.stringify(result)).not.toContain("never-expose-me");
});
