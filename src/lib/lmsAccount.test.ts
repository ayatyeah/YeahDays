import { beforeEach, describe, expect, it, vi } from "vitest";
const { tx, prisma } = vi.hoisted(() => {
  const tx = {
    account: { findUnique: vi.fn(), findFirst: vi.fn(), create: vi.fn() },
    user: { create: vi.fn(), findUniqueOrThrow: vi.fn() },
    lmsConnection: { upsert: vi.fn() },
  };
  return { tx, prisma: { $transaction: vi.fn(async (fn) => fn(tx)) } };
});
vi.mock("@/lib/db", () => ({ prisma }));
vi.mock("@/lib/lmsConnection", () => ({ encryptLmsUrl: (value: string) => `encrypted:${value}` }));
import { saveLmsAccount, LMS_PROVIDER } from "./lmsAccount";

beforeEach(() => { vi.clearAllMocks(); tx.account.findUnique.mockResolvedValue(null); tx.account.findFirst.mockResolvedValue(null); });
describe("LMS account ownership", () => {
  it("creates a new user without storing password/email or trusting the supplied name as an identity", async () => {
    tx.user.create.mockResolvedValue({ id: "alice", name: "alice", banned: false });
    await saveLmsAccount({ id: "42", calendarUrl: "private-calendar" }, "alice");
    expect(tx.user.create).toHaveBeenCalledWith({ data: { name: "alice" } });
    expect(tx.account.create).toHaveBeenCalledWith({ data: { userId: "alice", provider: LMS_PROVIDER, type: "credentials", providerAccountId: "42" } });
    expect(tx.lmsConnection.upsert.mock.calls[0][0].create).toEqual({ userId: "alice", encryptedUrl: "encrypted:private-calendar" });
  });
  it("returns the existing profile after repeated login, even if the LMS username changed", async () => {
    tx.account.findUnique.mockResolvedValue({ userId: "alice", user: { id: "alice", banned: false } });
    expect((await saveLmsAccount({ id: "42", calendarUrl: null }, "new-name")).id).toBe("alice");
    expect(tx.user.create).not.toHaveBeenCalled();
    expect(tx.lmsConnection.upsert).not.toHaveBeenCalled();
  });
  it("rejects linking somebody else's LMS identity to the current account", async () => {
    tx.account.findUnique.mockResolvedValue({ userId: "alice", user: { id: "alice", banned: false } });
    await expect(saveLmsAccount({ id: "42", calendarUrl: "secret" }, "alice", "bob")).rejects.toThrow();
    expect(tx.lmsConnection.upsert).not.toHaveBeenCalled();
  });
  it("rejects switching an existing profile to a different student's LMS account", async () => {
    tx.account.findFirst.mockResolvedValue({ providerAccountId: "99" });
    await expect(saveLmsAccount({ id: "42", calendarUrl: "secret" }, "alice", "bob")).rejects.toThrow();
    expect(tx.account.create).not.toHaveBeenCalled();
  });
  it("links to the authenticated existing profile without creating another user", async () => {
    tx.user.findUniqueOrThrow.mockResolvedValue({ id: "local", banned: false });
    await saveLmsAccount({ id: "42", calendarUrl: null }, "alice", "local");
    expect(tx.user.create).not.toHaveBeenCalled();
    expect(tx.account.create.mock.calls[0][0].data.userId).toBe("local");
  });
  it("does not let a banned student back in through LMS", async () => {
    tx.account.findUnique.mockResolvedValue({ userId: "alice", user: { id: "alice", banned: true } });
    await expect(saveLmsAccount({ id: "42", calendarUrl: "secret" }, "alice")).rejects.toThrow();
    expect(tx.lmsConnection.upsert).not.toHaveBeenCalled();
  });
});
