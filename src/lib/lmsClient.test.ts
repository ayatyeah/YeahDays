import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchLmsCalendar, loginToLms, limitedText } from "./lmsClient";
import { decryptLmsUrl, encryptLmsUrl, validateLmsUrl } from "./lmsConnection";

const url = "https://lms.astanait.edu.kz/calendar/export_execute.php?userid=42&authtoken=secret&preset_what=all&preset_time=recentupcoming";
const cfg = (id = 42) => `<script>M.cfg = {"userId":${id}};</script>`;
const html = (text: string, headers?: HeadersInit) => new Response(text, { headers });
const login = '<input value="csrf" name="logintoken" type="hidden">';
const exportForm = cfg() + '<input name="sesskey" value="session"><input name="_qf__core_calendar_export_form" value="1">';
function mockLogin(exportResponse = `<input value="${url.replaceAll("&", "&amp;")}">`) {
  const mock = vi.fn()
    .mockResolvedValueOnce(html(login, { "set-cookie": "MoodleSession=first; Path=/; Secure" }))
    .mockResolvedValueOnce(new Response(null, { status: 303, headers: { location: "/my/", "set-cookie": "MoodleSession=second; Path=/" } }))
    .mockResolvedValueOnce(html(cfg()))
    .mockResolvedValueOnce(html(cfg() + '<body id="page-user-profile">'))
    .mockResolvedValueOnce(html(exportForm))
    .mockResolvedValueOnce(html(exportResponse));
  vi.stubGlobal("fetch", mock);
  return mock;
}
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("LMS web login", () => {
  it("carries CSRF/cookies through login, verifies identity and requests this user's calendar", async () => {
    const fetch = mockLogin();
    expect(await loginToLms("student", "password")).toEqual({ id: "42", calendarUrl: url });
    expect(fetch.mock.calls[1][1].body.get("logintoken")).toBe("csrf");
    expect(fetch.mock.calls[1][1].headers.cookie).toBe("MoodleSession=first");
    expect(fetch.mock.calls[2][1].headers.cookie).toBe("MoodleSession=second");
    expect(fetch.mock.calls[2][1].method).toBe("GET");
    expect(fetch.mock.calls[5][1].body.get("events[exportevents]")).toBe("all");
    expect(fetch.mock.calls[5][1].body.get("sesskey")).toBe("session");
  });
  it("rejects bad passwords and guest sessions", async () => {
    for (const id of [0, 1]) {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(html(login)).mockResolvedValueOnce(html(cfg(id))));
      await expect(loginToLms("student", "bad")).rejects.toMatchObject({ code: "credentials" });
    }
  });
  it("rejects sessions waiting for an MFA or required password step", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(html(login)).mockResolvedValueOnce(html(cfg()))
      .mockResolvedValueOnce(html(cfg() + '<body id="page-admin-tool-mfa-auth">')));
    await expect(loginToLms("student", "password")).rejects.toMatchObject({ code: "unavailable" });
  });
  it("never follows cross-origin redirects with credentials", async () => {
    const fetch = vi.fn().mockResolvedValueOnce(html(login)).mockResolvedValueOnce(new Response(null, {
      status: 307, headers: { location: "https://example.com/steal" },
    }));
    vi.stubGlobal("fetch", fetch);
    await expect(loginToLms("student", "password")).rejects.toMatchObject({ code: "unavailable" });
    expect(fetch).toHaveBeenCalledTimes(2);
  });
  it("does not accept somebody else's calendar as proof of identity", async () => {
    mockLogin(`<input value="${url.replace("userid=42", "userid=99")}">`);
    expect(await loginToLms("student", "password")).toEqual({ id: "42", calendarUrl: null });
  });
  it("allows login when calendar export is disabled", async () => {
    mockLogin("no export");
    expect((await loginToLms("student", "password")).calendarUrl).toBeNull();
  });
  it("sanitizes upstream errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("private url and password")));
    await expect(loginToLms("student", "password")).rejects.toThrow("unavailable");
  });
});

describe("calendar secret and fetch", () => {
  it("encrypts with fresh IVs and detects tampering", () => {
    vi.stubEnv("LMS_ENCRYPTION_KEY", "test-only-secret");
    const a = encryptLmsUrl(url);
    expect(a).not.toContain("secret");
    expect(encryptLmsUrl(url)).not.toBe(a);
    expect(decryptLmsUrl(a)).toBe(url);
    const parts = a.split(".");
    parts[1] = Buffer.alloc(16).toString("base64url");
    expect(() => decryptLmsUrl(parts.join("."))).toThrow();
  });
  it.each([
    "http://lms.astanait.edu.kz/calendar/export_execute.php?userid=1&authtoken=x",
    "https://127.0.0.1/calendar/export_execute.php?userid=1&authtoken=x",
    "https://lms.astanait.edu.kz.evil.com/calendar/export_execute.php?userid=1&authtoken=x",
    "https://lms.astanait.edu.kz/admin/?userid=1&authtoken=x",
    "https://name:pass@lms.astanait.edu.kz/calendar/export_execute.php?userid=1&authtoken=x",
  ])("rejects unsafe URL %s", (value) => expect(() => validateLmsUrl(value)).toThrow());
  it("accepts an empty calendar and rejects HTML error pages", async () => {
    const fetch = vi.fn().mockResolvedValueOnce(html("BEGIN:VCALENDAR\nEND:VCALENDAR")).mockResolvedValueOnce(html("Log in"));
    vi.stubGlobal("fetch", fetch);
    expect(await fetchLmsCalendar(url)).toContain("BEGIN:VCALENDAR");
    expect(fetch.mock.calls[0][1].redirect).toBe("error");
    await expect(fetchLmsCalendar(url)).rejects.toMatchObject({ code: "calendar" });
  });
  it("limits streamed response size", async () => {
    await expect(limitedText(html("too much data"), 4)).rejects.toThrow();
  });
});
