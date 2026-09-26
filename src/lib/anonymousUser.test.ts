import { beforeEach, expect, it, vi } from "vitest";
const findUnique = vi.hoisted(() => vi.fn());
vi.mock("@/lib/db", () => ({ prisma: { user: { findUnique } } }));
import { resolveAnonymousUserId } from "./anonymousUser";
beforeEach(() => vi.clearAllMocks());
it("does not treat an LMS-only account without email/password as anonymous", async () => {
  findUnique.mockResolvedValue({ email: null, username: null, passwordHash: null, banned: false, accounts: [{ id: "lms" }] });
  expect(await resolveAnonymousUserId("student")).toBe("");
});
it("accepts a new device and a real anonymous account", async () => {
  findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce({ accounts: [], banned: false });
  expect(await resolveAnonymousUserId("device")).toBe("device");
  expect(await resolveAnonymousUserId("device")).toBe("device");
});
it.each([{ email: "a@b.c" }, { username: "alice" }, { passwordHash: "hash" }, { banned: true }])("rejects registered/disabled users %j", async (fields) => {
  findUnique.mockResolvedValue({ accounts: [], ...fields });
  expect(await resolveAnonymousUserId("student")).toBe("");
});
