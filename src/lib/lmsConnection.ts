import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

/** Только штатный экспорт AITU: пользовательский URL не должен открывать SSRF. */
export function validateLmsUrl(value: unknown): string {
  if (typeof value !== "string" || value.length > 4096) throw new Error("Вставь ссылку календаря LMS AITU");
  let url: URL;
  try { url = new URL(value.trim()); } catch { throw new Error("Некорректная ссылка календаря"); }
  if (url.origin !== "https://lms.astanait.edu.kz" || url.username || url.password ||
      url.pathname !== "/calendar/export_execute.php" || url.hash ||
      !url.searchParams.get("authtoken") || !url.searchParams.get("userid")) {
    throw new Error("Нужна ссылка Get calendar URL из календаря LMS AITU");
  }
  return url.toString();
}

export function validateLmsTimezone(value: unknown): string {
  const zone = value === undefined ? "Asia/Almaty" : value;
  if (typeof zone !== "string" || zone.length > 80) throw new Error("Некорректный часовой пояс");
  try { new Intl.DateTimeFormat("en", { timeZone: zone }).format(); }
  catch { throw new Error("Некорректный часовой пояс"); }
  return zone;
}

function key() {
  const secret = process.env.LMS_ENCRYPTION_KEY || process.env.AUTH_SECRET;
  if (!secret) throw new Error("LMS encryption is not configured");
  return createHash("sha256").update(secret).digest();
}

export function encryptLmsUrl(url: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(url, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), data].map((v) => v.toString("base64url")).join(".");
}

export function decryptLmsUrl(value: string): string {
  const [iv, tag, data] = value.split(".").map((v) => Buffer.from(v, "base64url"));
  const cipher = createDecipheriv("aes-256-gcm", key(), iv);
  cipher.setAuthTag(tag);
  return Buffer.concat([cipher.update(data), cipher.final()]).toString("utf8");
}
