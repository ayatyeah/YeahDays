import OpenAI, { toFile } from "openai";
import type {
  ChatCompletionMessage,
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
  ChatCompletionTool,
} from "openai/resources/chat/completions";
import type { ResponseInputItem, Tool as ResponsesTool } from "openai/resources/responses/responses";
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
 * conversation.ts/tools.ts говорят на языке Chat Completions
 * (messages/ChatCompletionTool) — этот формат живёт в истории, в
 * recordTurn(), в фактах. web_search как ОТДЕЛЬНЫЙ инструмент, который
 * модель сама решает вызывать или нет, есть только в Responses API
 * (client.responses.create), не в Chat Completions — поэтому здесь
 * перевод в обе стороны, а не переписывание всего остального на новый
 * формат. Правильность форматов (event.delta, ResponseFunctionToolCall,
 * function_call_output) сверена по типам самого SDK (node_modules/openai),
 * а не по памяти — Responses API моложе большинства обучающих данных.
 */
function toResponsesInput(messages: ChatCompletionMessageParam[]): ResponseInputItem[] {
  const input: ResponseInputItem[] = [];
  for (const m of messages) {
    if (m.role === "tool") {
      input.push({
        type: "function_call_output",
        call_id: m.tool_call_id,
        output: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
      });
      continue;
    }
    if (m.role === "assistant" && m.tool_calls && m.tool_calls.length > 0) {
      if (m.content) {
        input.push({ role: "assistant", content: String(m.content) });
      }
      for (const tc of m.tool_calls) {
        if (tc.type !== "function") continue;
        input.push({
          type: "function_call",
          call_id: tc.id,
          name: tc.function.name,
          arguments: tc.function.arguments,
        });
      }
      continue;
    }
    if (m.role === "system" || m.role === "user" || m.role === "assistant") {
      input.push({ role: m.role, content: typeof m.content === "string" ? m.content : String(m.content ?? "") });
    }
    // developer/function roles не встречаются в этой истории — намеренно не обрабатываем
  }
  return input;
}

/** ChatCompletionTool (вложенный .function.*) → плоский формат Responses API, плюс web_search. */
function toResponsesTools(tools: ChatCompletionTool[]): ResponsesTool[] {
  const fnTools: ResponsesTool[] = tools
    .filter((t): t is ChatCompletionTool & { type: "function" } => t.type === "function")
    .map((t) => ({
      type: "function",
      name: t.function.name,
      description: t.function.description ?? null,
      parameters: (t.function.parameters as Record<string, unknown>) ?? {},
      strict: false,
    }));
  return [...fnTools, { type: "web_search" }];
}

/**
 * Один шаг диалога: модель либо отвечает текстом, либо просит вызвать
 * инструменты (включая встроенный web_search — сама решает, нужен ли
 * поиск, см. toResponsesTools). Собран через stream:true, а не одним
 * ожиданием полного ответа — при обычных (не-инструментальных) репликах
 * onTextChunk получает текст кусками по мере генерации, и вызывающий код
 * (voiceLoop.ts) может начинать озвучивать уже готовые предложения, не
 * дожидаясь, пока модель допечатает весь ответ целиком. При раунде с
 * вызовом инструмента контента обычно нет вообще — onTextChunk просто не
 * вызывается.
 */
export async function chatStep(
  messages: ChatCompletionMessageParam[],
  tools: ChatCompletionTool[],
  onTextChunk?: (chunk: string) => void,
): Promise<ChatCompletionMessage> {
  const stream = await client.responses.create({
    model: config.chatModel,
    input: toResponsesInput(messages),
    tools: toResponsesTools(tools),
    stream: true,
  });

  let content = "";
  const toolCallList: ChatCompletionMessageToolCall[] = [];

  for await (const event of stream) {
    if (event.type === "response.output_text.delta") {
      content += event.delta;
      onTextChunk?.(event.delta);
    } else if (event.type === "response.output_item.done" && event.item.type === "function_call") {
      toolCallList.push({
        id: event.item.call_id,
        type: "function",
        function: { name: event.item.name, arguments: event.item.arguments },
      });
    } else if (event.type === "response.completed" && event.response.usage) {
      const u = event.response.usage;
      console.log(
        `[usage] ${config.chatModel}: prompt=${u.input_tokens} completion=${u.output_tokens} total=${u.total_tokens} (история из ${messages.length} сообщений)`,
      );
    }
  }

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
