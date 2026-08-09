import OpenAI, { toFile } from "openai";
import type { ChatCompletionMessageParam, ChatCompletionTool } from "openai/resources/chat/completions";
import { config } from "./config.js";

export const client = new OpenAI({ apiKey: config.openaiApiKey });

/**
 * Пробовал добавить сюда prompt со словарной подсказкой (имена, которые
 * модель норовит расслышать неправильно) — на слабом/неоднозначном звуке
 * модель вместо транскрипции стала дословно повторять сам prompt обратно
 * ("Джарвис, YeahGrind, Chrome, YouTube, Valorant, Google Диск" — да,
 * буква в букву). Известный побочный эффект такого промптинга, особенно
 * когда он оформлен как голый список слов, а не естественная фраза.
 * Убрано — ломало вообще все ответы, а не только редкие имена.
 */
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
 * OpenAI TTS отдаёт WAV с плейсхолдером 0xFFFFFFFF вместо настоящего
 * размера в полях RIFF и data (формат для потокового чтения) — большинство
 * плееров это проглатывают, но .NET Media.SoundPlayer (через который идёт
 * воспроизведение в audio.ts) строго проверяет размер и отказывается
 * открывать такой файл ("файл не может быть открыт"). У нас уже есть весь
 * буфер целиком, так что просто прописываем настоящие размеры.
 */
function fixWavHeader(buf: Buffer): Buffer {
  if (buf.length < 44 || buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WAVE") {
    return buf; // не WAV — не трогаем
  }
  const out = Buffer.from(buf);
  out.writeUInt32LE(out.length - 8, 4); // RIFF chunk size

  let offset = 12;
  while (offset + 8 <= out.length) {
    const chunkId = out.toString("ascii", offset, offset + 4);
    const declaredSize = out.readUInt32LE(offset + 4);
    if (chunkId === "data") {
      out.writeUInt32LE(out.length - offset - 8, offset + 4);
      break;
    }
    if (declaredSize === 0xffffffff || offset + 8 + declaredSize > out.length) break;
    offset += 8 + declaredSize + (declaredSize % 2); // чанки WAV выровнены по 2 байта
  }
  return out;
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
  return fixWavHeader(Buffer.from(arrayBuffer));
}
