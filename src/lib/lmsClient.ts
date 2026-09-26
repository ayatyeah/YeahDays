import { validateLmsUrl } from "@/lib/lmsConnection";

export const LMS_ORIGIN = "https://lms.astanait.edu.kz";
export class LmsError extends Error {
  constructor(public code: "credentials" | "unavailable" | "calendar") { super(code); }
}

export async function limitedText(response: Response, limit = 5 * 1024 * 1024): Promise<string> {
  if (!response.ok || !response.body) throw new LmsError("unavailable");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > limit) throw new LmsError("unavailable");
      chunks.push(value);
    }
  } finally { await reader.cancel(); }
  return Buffer.concat(chunks).toString("utf8");
}

function decode(value: string) {
  return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0*39;|&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

export function formInputs(html: string): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const tag of html.matchAll(/<input\b[^>]*>/gi)) {
    const attrs: Record<string, string> = {};
    for (const attr of tag[0].matchAll(/([\w-]+)\s*=\s*(["'])(.*?)\2/gs)) attrs[attr[1].toLowerCase()] = decode(attr[3]);
    if (attrs.name) fields[attrs.name] = attrs.value ?? "";
  }
  return fields;
}

function config(html: string): { userId?: number; sesskey?: string } {
  const raw = html.match(/M\.cfg\s*=\s*(\{[^\n]*?\})\s*;/)?.[1];
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

/** Cookies are scoped to this one login attempt; neither cookies nor passwords are persisted. */
export async function loginToLms(username: string, password: string) {
  const cookies = new Map<string, string>();
  const signal = AbortSignal.timeout(30_000);
  async function page(path: string, form?: URLSearchParams): Promise<string> {
    let url = new URL(path, LMS_ORIGIN);
    let body = form;
    for (let hop = 0; hop < 8; hop++) {
      if (url.origin !== LMS_ORIGIN || url.username || url.password) throw new LmsError("unavailable");
      const response = await fetch(url, {
        method: body ? "POST" : "GET", body,
        headers: { cookie: [...cookies].map(([k, v]) => `${k}=${v}`).join("; ") },
        redirect: "manual", cache: "no-store", signal,
      });
      for (const cookie of response.headers.getSetCookie()) {
        const pair = cookie.split(";", 1)[0];
        const split = pair.indexOf("=");
        if (split > 0) cookies.set(pair.slice(0, split), pair.slice(split + 1));
      }
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get("location");
        await response.body?.cancel();
        if (!location) throw new LmsError("unavailable");
        url = new URL(location, url);
        if (![307, 308].includes(response.status)) body = undefined;
        continue;
      }
      return limitedText(response);
    }
    throw new LmsError("unavailable");
  }

  try {
    const login = await page("/login/index.php");
    const token = formInputs(login).logintoken;
    if (!token) throw new LmsError("unavailable");
    const signedIn = await page("/login/index.php", new URLSearchParams({ username, password, logintoken: token, anchor: "" }));
    const identity = config(signedIn);
    if (!Number.isSafeInteger(identity.userId) || identity.userId! <= 1) throw new LmsError("credentials");
    // A pending MFA/password-change session can already contain a userId.
    // Require access to an authenticated page before issuing a YeahGrind session.
    const profile = await page("/user/profile.php");
    if (config(profile).userId !== identity.userId || !/id=["']page-user-profile["']/.test(profile)) {
      throw new LmsError("unavailable");
    }

    // Export failure must not turn a valid LMS login into a failed registration.
    let calendarUrl: string | null = null;
    try {
      const exportPage = await page("/calendar/export.php");
      if (config(exportPage).userId !== identity.userId) throw new LmsError("calendar");
      const fields = formInputs(exportPage);
      const form = new URLSearchParams();
      for (const [name, value] of Object.entries(fields)) {
        if (name === "sesskey" || name.startsWith("_qf__")) form.set(name, value);
      }
      if (!form.get("sesskey")) throw new LmsError("calendar");
      form.set("events[exportevents]", "all");
      form.set("period[timeperiod]", exportPage.includes('value="custom"') ? "custom" : "recentupcoming");
      form.set("generateurl", "1");
      const generated = decode(await page("/calendar/export.php", form));
      const candidate = generated.match(/https:\/\/lms\.astanait\.edu\.kz\/calendar\/export_execute\.php\?[^"'<>\s]+/)?.[0];
      if (candidate) {
        const safe = validateLmsUrl(candidate);
        if (new URL(safe).searchParams.get("userid") === String(identity.userId)) calendarUrl = safe;
      }
    } catch { /* The user can retry the connection from settings. */ }
    return { id: String(identity.userId), calendarUrl };
  } catch (error) {
    if (error instanceof LmsError) throw error;
    // Fetch errors can contain URLs and cookies. Never propagate them into Auth.js logs.
    throw new LmsError("unavailable");
  }
}

export async function fetchLmsCalendar(url: string): Promise<string> {
  try {
    const response = await fetch(validateLmsUrl(url), {
      headers: { accept: "text/calendar" }, redirect: "error",
      cache: "no-store", signal: AbortSignal.timeout(20_000),
    });
    const text = await limitedText(response);
    if (!text.includes("BEGIN:VCALENDAR") || !text.includes("END:VCALENDAR")) throw new LmsError("calendar");
    return text;
  } catch { throw new LmsError("calendar"); }
}
