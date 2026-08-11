import type { PvRecorder } from "@picovoice/pvrecorder-node";
import { speak } from "./openai.js";
import { playWav } from "./audio.js";
import { GREETING, BOOT_GREETING } from "./systemPrompt.js";

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
  console.log(`[ДиДи] ${text}`);
  let wav = audioCache.get(text);
  if (!wav) {
    wav = await speak(text);
    if (text === GREETING || text === BOOT_GREETING) audioCache.set(text, wav);
  }
  activeRecorder?.stop();
  try {
    await playWav(wav);
  } finally {
    activeRecorder?.start();
  }
}
