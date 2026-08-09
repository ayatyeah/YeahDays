import OpenAI, { toFile } from "openai";
import type { ChatCompletionMessageParam, ChatCompletionTool } from "openai/resources/chat/completions";
import { config } from "./config.js";

export const client = new OpenAI({ apiKey: config.openaiApiKey });

export async function transcribeWav(wav: Buffer): Promise<string> {
  const file = await toFile(wav, "command.wav", { type: "audio/wav" });
  const res = await client.audio.transcriptions.create({
    file,
    model: config.transcribeModel,
    language: "ru",
  });
  return res.text.trim();
}

/** Один шаг диалога: модель либо отвечает текстом, либо просит вызвать инструменты. */
export async function chatStep(
  messages: ChatCompletionMessageParam[],
  tools: ChatCompletionTool[],
) {
  const res = await client.chat.completions.create({
    model: config.chatModel,
    messages,
    tools,
    tool_choice: "auto",
  });
  const choice = res.choices[0];
  if (!choice?.message) throw new Error("OpenAI не вернул ответ");
  return choice.message;
}

/**
 * Синтез речи, возвращает WAV-буфер. Именно WAV (не mp3) — воспроизведение
 * идёт через Media.SoundPlayer в audio.ts, который умеет только WAV, зато
 * PlaySync() блокируется ровно до конца звука без ручного расчёта длительности.
 */
export async function speak(text: string): Promise<Buffer> {
  const res = await client.audio.speech.create({
    model: config.ttsModel,
    voice: config.ttsVoice as
      | "alloy"
      | "echo"
      | "fable"
      | "onyx"
      | "nova"
      | "shimmer",
    input: text,
    response_format: "wav",
  });
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
