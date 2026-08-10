import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { envPath } from "./config.js";

/**
 * Простое key=value хранилище настроек поверх того же файла, который
 * читает dotenv в config.ts (см. комментарий там про userData vs cwd).
 * Не полноценный dotenv-парсер — ровно то, что нужно этому приложению.
 */
const KNOWN_KEYS = [
  "OPENAI_API_KEY",
  "YEAHGRIND_BASE_URL",
  "YEAHGRIND_USER_ID",
  "ASSISTANT_SECRET",
  "AUDIO_DEVICE_INDEX",
] as const;

export type SettingsPatch = Partial<Record<(typeof KNOWN_KEYS)[number], string>>;

export async function readRawSettings(): Promise<Record<string, string>> {
  try {
    const text = await readFile(envPath, "utf8");
    const out: Record<string, string> = {};
    for (const line of text.split("\n")) {
      const m = /^([A-Z_]+)=(.*)$/.exec(line.trim());
      if (m) out[m[1]!] = m[2]!.replace(/^"(.*)"$/, "$1");
    }
    return out;
  } catch {
    return {};
  }
}

/** Пишет настройки на диск. Требует перезапуск приложения, чтобы применились — config.ts читает файл один раз при старте. */
export async function writeSettings(patch: SettingsPatch): Promise<void> {
  const current = await readRawSettings();
  const merged = { ...current, ...patch };
  await mkdir(path.dirname(envPath), { recursive: true });
  const lines = KNOWN_KEYS.filter((k) => merged[k]).map((k) => `${k}=${merged[k]}`);
  await writeFile(envPath, `${lines.join("\n")}\n`, "utf8");
}
