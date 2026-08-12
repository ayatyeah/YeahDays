import type { PvRecorder } from "@picovoice/pvrecorder-node";
import { speak } from "./openai.js";
import { playWav } from "./audio.js";
import { GREETING, BOOT_GREETING } from "./systemPrompt.js";
import { log } from "./logger.js";
import { setState } from "./state.js";

let activeRecorder: PvRecorder | null = null;

/** Вызвать один раз после createRecorder() — say() будет глушить его на время своей речи. */
export function bindRecorder(recorder: PvRecorder): void {
  activeRecorder = recorder;
}

/**
 * GREETING звучит на КАЖДОЕ срабатывание кодового слова (особенно часто
 * теперь, при локальном детекторе — там "одним дыханием" не работает, и
 * приветствие произносится перед каждой командой без исключения). Без
 * кеша это лишний TTS-запрос в OpenAI и заметная задержка на ровном
 * месте каждый раз ради одной и той же фразы — синтезируем один раз и
 * дальше проигрываем готовый буфер.
 */
const audioCache = new Map<string, Buffer>();

/**
 * Озвучить текст и дождаться конца воспроизведения. Останавливает запись
 * на время своей же речи и включает заново после — без этого микрофон
 * ловит собственный голос ДиДи из колонок как "начало фразы" сразу после
 * ответа: следующая запись цепляет её же реплику или эхо в комнате,
 * получается "отвечает сама себе" и лишние платные вызовы транскрипции
 * на 12-секундные обрывки шума.
 */
export async function say(text: string): Promise<void> {
  // Раньше это был console.log — в упакованном приложении (без окна
  // консоли) он никуда не виден вообще, ни сама фраза, ни ошибка синтеза/
  // воспроизведения, если та случится дальше без try/catch у вызывающего
  // кода (как раньше было с say(BOOT_GREETING) в startVoiceLoop.ts). log()
  // хотя бы попадает в живой журнал на вкладке "Статус".
  log(`[ДиДи] ${text}`);
  try {
    let wav = audioCache.get(text);
    if (!wav) {
      wav = await speak(text);
      if (text === GREETING || text === BOOT_GREETING) audioCache.set(text, wav);
    }
    activeRecorder?.stop();
    setState("speaking");
    try {
      await playWav(wav);
    } finally {
      activeRecorder?.start();
    }
  } catch (e) {
    log(`[voice] не удалось озвучить "${text}": ${e instanceof Error ? e.message : e}`, "error");
    throw e;
  }
}

export interface StreamingSpeech {
  /** Кусок текста, как он приходит из потокового ответа модели (necessarily не целое предложение). */
  push(chunk: string): void;
  /** true, если хоть одно предложение уже поставлено в очередь на озвучку. */
  hasSpoken(): boolean;
  /** Вызвать, когда модель закончила генерацию. Ждёт, пока доиграет всё поставленное в очередь, и включает микрофон обратно. */
  finish(): Promise<void>;
}

/** Разбивает буфер на завершённые предложения; хвост без конечной пунктуации возвращает отдельно, ждать его окончания в следующих чанках. */
function extractSentences(buffer: string): { sentences: string[]; rest: string } {
  const matches = buffer.match(/[^.!?…]+[.!?…]+[\s"»]*/g);
  if (!matches) return { sentences: [], rest: buffer };
  const consumed = matches.join("");
  return { sentences: matches.map((s) => s.trim()).filter(Boolean), rest: buffer.slice(consumed.length) };
}

/**
 * Озвучивает ответ модели по мере генерации, не дожидаясь, пока модель
 * допечатает его целиком: как только накопленный текст складывается в
 * завершённое предложение, синтез WAV для него запускается сразу, в
 * фоне, пока модель продолжает генерировать остальной ответ — а
 * проигрывание идёт по очереди строго по порядку предложений (иначе
 * вторая фраза могла бы прозвучать раньше первой, если её синтез
 * оказался быстрее). Recorder глушится ОДИН раз на весь ответ, а не на
 * каждое предложение — иначе между предложениями были бы лишние паузы
 * на stop()/start() микрофона.
 */
export function startStreamingSpeech(): StreamingSpeech {
  let buffer = "";
  let muted = false;
  let finished = false;
  let queuedAny = false;
  const pending: Array<{ text: string; wav: Promise<Buffer> }> = [];

  function enqueue(text: string): void {
    if (!text) return;
    queuedAny = true;
    if (!muted) {
      activeRecorder?.stop();
      muted = true;
    }
    const cached = audioCache.get(text);
    pending.push({ text, wav: cached ? Promise.resolve(cached) : speak(text) });
  }

  const consumer = (async () => {
    for (;;) {
      const next = pending.shift();
      if (!next) {
        if (finished) break;
        await new Promise((resolve) => setTimeout(resolve, 20));
        continue;
      }
      log(`[ДиДи] ${next.text}`);
      try {
        setState("speaking");
        await playWav(await next.wav);
      } catch (e) {
        log(`[voice] не удалось озвучить "${next.text}": ${e instanceof Error ? e.message : e}`, "error");
      }
    }
  })();

  return {
    push(chunk: string) {
      buffer += chunk;
      const { sentences, rest } = extractSentences(buffer);
      buffer = rest;
      for (const s of sentences) enqueue(s);
    },
    hasSpoken() {
      return queuedAny;
    },
    async finish() {
      const tail = buffer.trim();
      buffer = "";
      if (tail) enqueue(tail);
      finished = true;
      await consumer;
      if (muted) {
        activeRecorder?.start();
        muted = false;
      }
    },
  };
}
