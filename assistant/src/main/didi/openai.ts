import OpenAI, { toFile } from "openai";
import type {
  ChatCompletionMessage,
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
  ChatCompletionTool,
} from "openai/resources/chat/completions";
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
/**
 * На слабом/неоднозначном звуке (дыхание, шум комнаты, тихое бормотание)
 * Whisper иногда не возвращает пустую строку, а ГАЛЛЮЦИНИРУЕТ правдоподобный
 * текст — и, что характерно, часто не на русском, а на случайном другом
 * языке ("อ่า", корейская тарабарщина), несмотря на language:"ru". Раз
 * пользователь говорит по-русски (или изредка "Jarvis" на латинице), текст
 * вне кириллицы/латиницы/цифр/пунктуации почти наверняка такая галлюцинация,
 * а не реальная речь — считаем это тишиной, а не распознанной фразой.
 */
const HALLUCINATION_RE = /^[\sа-яёА-ЯЁ0-9a-zA-Z.,!?;:'"()\-—–…«»]*$/;

export async function transcribeWav(wav: Buffer): Promise<string> {
  const file = await toFile(wav, "command.wav", { type: "audio/wav" });
  const res = await client.audio.transcriptions.create({
    file,
    model: config.transcribeModel,
    language: "ru",
  });
  const text = res.text.trim();
  return HALLUCINATION_RE.test(text) ? text : "";
}

/**
 * Один шаг диалога: модель либо отвечает текстом, либо просит вызвать
 * инструменты. Собран через stream:true, а не одним ожиданием полного
 * ответа — при обычных (не-инструментальных) репликах onTextChunk
 * получает текст кусками по мере генерации, и вызывающий код (voiceLoop.ts)
 * может начинать озвучивать уже готовые предложения, не дожидаясь, пока
 * модель допечатает весь ответ целиком. При раунде с вызовом инструмента
 * контента обычно нет вообще — onTextChunk просто не вызывается.
 */
export async function chatStep(
  messages: ChatCompletionMessageParam[],
  tools: ChatCompletionTool[],
  onTextChunk?: (chunk: string) => void,
): Promise<ChatCompletionMessage> {
  const stream = await client.chat.completions.create({
    model: config.chatModel,
    messages,
    tools,
    tool_choice: "auto",
    stream: true,
    stream_options: { include_usage: true },
  });

  let content = "";
  const toolCalls: Record<
    number,
    { id: string; type: "function"; function: { name: string; arguments: string } }
  > = {};

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta;
    if (delta?.content) {
      content += delta.content;
      onTextChunk?.(delta.content);
    }
    if (delta?.tool_calls) {
      for (const tc of delta.tool_calls) {
        const entry = (toolCalls[tc.index] ??= {
          id: "",
          type: "function",
          function: { name: "", arguments: "" },
        });
        if (tc.id) entry.id = tc.id;
        if (tc.function?.name) entry.function.name += tc.function.name;
        if (tc.function?.arguments) entry.function.arguments += tc.function.arguments;
      }
    }
    if (chunk.usage) {
      console.log(
        `[usage] ${config.chatModel}: prompt=${chunk.usage.prompt_tokens} completion=${chunk.usage.completion_tokens} total=${chunk.usage.total_tokens} (история из ${messages.length} сообщений)`,
      );
    }
  }

  const toolCallList: ChatCompletionMessageToolCall[] = Object.values(toolCalls).map((tc) => ({
    id: tc.id,
    type: "function",
    function: tc.function,
  }));

  return {
    role: "assistant",
    content: content || null,
    refusal: null,
    ...(toolCallList.length > 0 ? { tool_calls: toolCallList } : {}),
  } as ChatCompletionMessage;
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
