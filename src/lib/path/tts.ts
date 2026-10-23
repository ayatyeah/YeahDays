/**
 * Озвучка видео голосом Gemini (Google AI). Текст сценария уходит в Google,
 * обратно приходит WAV 24 кГц моно — храним как есть, длительность берём из
 * заголовка файла: по ней строятся субтитры и склейка сцен.
 *
 * Ключ — GOOGLE_GEMINI_API_SECRET (или GEMINI_API_KEY). Модель и голос
 * меняются переменными GEMINI_TTS_MODEL / GEMINI_TTS_VOICE без правки кода.
 */

import { recordAiUsage } from "@/lib/aiUsage";
import { fakeEnabled, fakeSpeech } from "./fake";

export class TtsError extends Error {}

export interface Speech {
  data: Buffer;
  mime: string;
  seconds: number;
}

const STYLE: Record<string, string> = {
  ru: "спокойный дружелюбный преподаватель, объясняет чётко, в умеренном темпе",
  en: "calm, friendly teacher explaining clearly at a moderate pace",
  kk: "сабырлы, мейірімді мұғалім, анық әрі баяу түсіндіреді",
};

export const ttsAvailable = () => fakeEnabled() || !!geminiKey();
const geminiKey = () => (process.env.GOOGLE_GEMINI_API_SECRET || process.env.GEMINI_API_KEY || "").trim();

/** Длительность WAV по заголовку: размер блока data / байт в секунду. */
export function wavSeconds(wav: Buffer) {
  if (wav.length < 44 || wav.toString("ascii", 0, 4) !== "RIFF" || wav.toString("ascii", 8, 12) !== "WAVE") throw new TtsError("не WAV");
  let offset = 12;
  let byteRate = 0;
  while (offset + 8 <= wav.length) {
    const id = wav.toString("ascii", offset, offset + 4);
    const size = wav.readUInt32LE(offset + 4);
    if (id === "fmt ") byteRate = wav.readUInt32LE(offset + 16);
    if (id === "data") {
      if (!byteRate) throw new TtsError("нет формата");
      return Math.min(size, wav.length - offset - 8) / byteRate;
    }
    offset += 8 + size + (size % 2);
  }
  throw new TtsError("нет аудиоданных");
}

/** Сырые 16-битные PCM-сэмплы → WAV (если модель вернёт audio/l16). */
export function pcmToWav(pcm: Buffer, rate = 24000) {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVEfmt ", 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(rate, 24);
  header.writeUInt32LE(rate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

/**
 * Модели по порядку. У каждой своя суточная квота (на бесплатном тарифе —
 * около 10 запросов), поэтому на 429 и на ошибку формата переходим к
 * следующей. Модели 2.5 не принимают стилевую подсказку, 3.1-preview отдаёт
 * только сырой PCM.
 */
const MODELS = [
  { model: "gemini-3.8-flash-tts", style: true, mime: "audio/wav" },
  { model: "gemini-3.8-flash-lite-tts", style: true, mime: "audio/wav" },
  { model: "gemini-2.5-flash-preview-tts", style: false, mime: "audio/wav" },
  { model: "gemini-2.5-pro-preview-tts", style: false, mime: "audio/wav" },
  { model: "gemini-3.1-flash-tts-preview", style: true, mime: "audio/l16" },
];

class Retryable extends TtsError {}

async function geminiOnce(text: string, language: string, spec: (typeof MODELS)[number]): Promise<Speech> {
  const key = geminiKey();
  if (!key) throw new TtsError("Озвучка не подключена: нужен ключ Gemini на сервере");
  const content = { type: "text", text, ...(spec.style ? { annotations: [{ type: "speech_metadata", style: STYLE[language] ?? STYLE.ru }] } : {}) };
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
    method: "POST",
    signal: AbortSignal.timeout(90_000),
    headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: spec.model,
      input: [{ type: "user_input", content: [content] }],
      response_format: { type: "audio", mime_type: spec.mime, sample_rate: 24000 },
      generation_config: { speech_config: [{ voice: process.env.GEMINI_TTS_VOICE || "Kore" }] },
    }),
  });
  if (!response.ok) throw new Retryable(`Gemini TTS ${spec.model}: ${response.status}`);
  const body = await response.json();
  recordAiUsage("voice", { input_tokens: body.usage?.total_input_tokens, output_tokens: body.usage?.total_output_tokens });
  const audio = (body.steps ?? [])
    .flatMap((step: { content?: { type: string; data?: string; mime_type?: string }[] }) => step.content ?? [])
    .find((c: { type: string; data?: string }) => c.type === "audio" && c.data);
  if (!audio) throw new Retryable(`Gemini TTS ${spec.model}: нет аудио`);
  const raw = Buffer.from(audio.data, "base64");
  const data = /l16|pcm/i.test(audio.mime_type ?? spec.mime) ? pcmToWav(raw) : raw;
  return { data, mime: "audio/wav", seconds: wavSeconds(data) };
}

/**
 * Озвучить текст: модель из GEMINI_TTS_MODEL (если задана) или первая из
 * списка; при отказе — следующая. Ошибка — только если не смогла ни одна.
 */
export async function speak(text: string, language: string): Promise<Speech> {
  if (fakeEnabled()) return fakeSpeech(text);
  const preferred = process.env.GEMINI_TTS_MODEL;
  const chain = preferred ? [...MODELS.filter((m) => m.model === preferred), ...MODELS.filter((m) => m.model !== preferred)] : MODELS;
  let last: unknown;
  for (const spec of chain) {
    try {
      return await geminiOnce(text, language, spec);
    } catch (error) {
      last = error;
      if (!(error instanceof Retryable) && !(error instanceof Error && error.name === "TimeoutError")) throw error;
    }
  }
  console.error("[tts]", last);
  throw new TtsError("Все модели озвучки отказали — вероятно, закончилась дневная квота Gemini");
}
