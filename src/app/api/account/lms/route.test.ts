import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  auth: vi.fn(), sync: vi.fn(), rate: vi.fn(),
  connection: { findUnique: vi.fn(), updateMany: vi.fn(), deleteMany: vi.fn() },
  account: { findFirst: vi.fn() },
}));
vi.mock("@/auth", () => ({ auth: mocks.auth }));
vi.mock("@/lib/db", () => ({ prisma: { lmsConnection: mocks.connection, account: mocks.account } }));
vi.mock("@/lib/lmsSync", () => ({ syncLmsCalendar: mocks.sync }));
vi.mock("@/lib/rateLimit", () => ({ rateLimit: mocks.rate }));
vi.mock("@/lib/lmsConnection", () => ({ decryptLmsUrl: () => "private-url" }));
import { GET, POST, DELETE } from "./route";

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
    expect(mocks.connection.deleteMany).toHaveBeenCalledWith({ where: { userId: "alice" } });
  });
  it("reports missing calendar instead of pretending sync succeeded", async () => {
    mocks.connection.findUnique.mockResolvedValue(null);
    expect((await POST()).status).toBe(409);
    expect(mocks.sync).not.toHaveBeenCalled();
  });
});
