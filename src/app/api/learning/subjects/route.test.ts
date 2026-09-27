import { beforeEach, expect, it, vi } from "vitest";
const m = vi.hoisted(() => ({ auth: vi.fn(), find: vi.fn(), fetch: vi.fn(), decrypt: vi.fn(), rate: vi.fn() }));
vi.mock("@/auth", () => ({ auth: m.auth }));
vi.mock("@/lib/db", () => ({ prisma: { lmsConnection: { findUnique: m.find } } }));
vi.mock("@/lib/lmsConnection", () => ({ decryptLmsUrl: m.decrypt }));
vi.mock("@/lib/lmsClient", () => ({ fetchLmsCalendar: m.fetch }));
vi.mock("@/lib/rateLimit", () => ({ rateLimit: m.rate }));
vi.mock("@/lib/lmsAccount", () => ({ LMS_PROVIDER: "lms-aitu" }));
import { GET } from "./route";
beforeEach(() => { vi.resetAllMocks(); m.auth.mockResolvedValue({ user: { id: "alice" } }); m.rate.mockReturnValue(true); });
it("requires authentication before reading calendar credentials", async () => {
  m.auth.mockResolvedValue(null); expect((await GET()).status).toBe(401); expect(m.find).not.toHaveBeenCalled();
});
it("reads only the session user's calendar and returns names without credentials or event details", async () => {
  m.find.mockResolvedValue({ encryptedUrl: "cipher", timezone: "Asia/Almaty" }); m.decrypt.mockReturnValue("private-url");
  m.fetch.mockResolvedValue("BEGIN:VCALENDAR\nBEGIN:VEVENT\nUID:1\nCATEGORIES:Math | Teacher\nDESCRIPTION:Private assignment\nEND:VEVENT\nEND:VCALENDAR");
  const response = await GET(); expect(await response.json()).toEqual({ connected: true, subjects: ["Math"] });
  expect(m.find).toHaveBeenCalledWith({ where: { userId: "alice" } }); expect(m.fetch).toHaveBeenCalledWith("private-url");
});
it("handles disconnected calendars and hides upstream errors", async () => {
  m.find.mockResolvedValue({ encryptedUrl: null }); expect(await (await GET()).json()).toEqual({ connected: false, subjects: [] }); expect(m.fetch).not.toHaveBeenCalled();
  m.find.mockRejectedValue(new Error("secret-url")); const response = await GET(); expect(response.status).toBe(502); expect(await response.text()).not.toContain("secret-url");
});
