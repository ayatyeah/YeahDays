import type { PvRecorder } from "@picovoice/pvrecorder-node";
import { speak } from "./openai.js";
import { playWav } from "./audio.js";

let activeRecorder: PvRecorder | null = null;

/** Вызвать один раз после createRecorder() — say() будет глушить его на время своей речи. */
export function bindRecorder(recorder: PvRecorder): void {
  activeRecorder = recorder;
}

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
  const wav = await speak(text);
  activeRecorder?.stop();
  try {
    await playWav(wav);
  } finally {
    activeRecorder?.start();
  }
}
