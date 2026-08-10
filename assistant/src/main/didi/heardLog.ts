import { mkdir, appendFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DIR = "heard-log";
const TRANSCRIPT_FILE = path.join(DIR, "transcripts.log");

/**
 * Сохраняет запись (аудио + текст) каждой распознанной фразы, адресованной
 * ДиДи — по просьбе пользователя, чтобы видеть, что реально услышала
 * модель (для отладки распознавания и как задел на будущее дообучение).
 * Best-effort: сбой записи на диск не должен ронять разговор.
 */
export async function logHeard(wav: Buffer, text: string): Promise<void> {
  try {
    await mkdir(DIR, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    await writeFile(path.join(DIR, `${stamp}.wav`), wav);
    await appendFile(TRANSCRIPT_FILE, `[${new Date().toISOString()}] ${text}\n`);
  } catch (e) {
    console.warn("[heard-log] не записалось:", e instanceof Error ? e.message : e);
  }
}
