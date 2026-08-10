import type { PvRecorder } from "@picovoice/pvrecorder-node";
import { createRecorder, calibrateSilenceThreshold, recordUntilSilence, recordSpeech } from "./audio.js";
import { transcribeWav } from "./openai.js";
import { say, bindRecorder } from "./voice.js";
import { confirmVoice } from "./confirm.js";
import { GREETING, BOOT_GREETING } from "./systemPrompt.js";
import { isEnabled } from "./presence.js";
import { logEvent, logChatMessage } from "./yeahgrind.js";
import { logHeard } from "./heardLog.js";
import { runConversationTurn, freshHistory } from "./conversation.js";
import { tryQuickCommand } from "./quickCommands.js";
import { log } from "./logger.js";

/**
 * Кодовая фраза ищется распознаванием речи (Whisper понимает русский), а
 * не локальным классификатором — ни Picovoice, ни openWakeWord не умеют
 * обучать русские слова, см. assistant/README.md. Сравнение нечёткое
 * (Levenshtein), потому что STT не всегда расслышит "джарвис" точь-в-точь —
 * и, как выяснилось на живом тесте, иногда транскрибирует его вообще
 * латиницей ("Jarvis") как известное имя, несмотря на language:"ru" —
 * поэтому вариантов два алфавита, а не только кириллица.
 */
const WAKE_VARIANTS = ["джарвис", "жарвис", "jarvis"];
const MAX_EDIT_DISTANCE = 2;

/** Сколько ждать начала команды после голого "Джарвис", прежде чем тихо вернуться к фоновому прослушиванию. */
const WAKE_COMMAND_TIMEOUT_MS = Number(process.env.WAKE_COMMAND_TIMEOUT_SECONDS ?? "3") * 1000;

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i]![0] = i;
  for (let j = 0; j <= b.length; j++) dp[0]![j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i]![j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1]![j - 1]!
          : 1 + Math.min(dp[i - 1]![j]!, dp[i]![j - 1]!, dp[i - 1]![j - 1]!);
    }
  }
  return dp[a.length]![b.length]!;
}

/** Индекс конца слова-кандидата на кодовую фразу в тексте, или -1, если не нашли. */
function findWakeWordEnd(text: string): number {
  const lower = text.toLowerCase();
  const wordRe = /[а-яёa-z]+/gi;
  let m: RegExpExecArray | null;
  while ((m = wordRe.exec(lower))) {
    const word = m[0];
    for (const variant of WAKE_VARIANTS) {
      if (levenshtein(word, variant) <= MAX_EDIT_DISTANCE) {
        return m.index + word.length;
      }
    }
  }
  return -1;
}

/** Текст после кодовой фразы в той же реплике ("Джарвис, добавь молоко") — команда сразу. Иначе null. */
function extractAfterWake(text: string): string | null {
  const end = findWakeWordEnd(text);
  if (end === -1) return null;
  return text
    .slice(end)
    .replace(/^[\s,.!?—-]+/, "")
    .trim();
}

let stopRequested = false;
let recorderRef: PvRecorder | null = null;
let running = false;

export function isVoiceLoopRunning(): boolean {
  return running;
}

/**
 * Останавливает цикл. Не мгновенно в строгом смысле: если сейчас идёт
 * ожидание речи (blocking read() у PvRecorder) — recorder.stop() обрывает
 * его сразу, но текущая итерация ещё доработает до ближайшей проверки
 * флага. На практике — доли секунды, не заметно на слух.
 */
export function stopVoiceLoop(): void {
  stopRequested = true;
  try {
    recorderRef?.stop();
  } catch {
    // recorder уже мог быть остановлен/освобождён — не критично
  }
}

/** Голосовой цикл ДиДи: слушает микрофон, ждёт "Джарвис", выполняет команды. Один запуск — до stopVoiceLoop(). */
export async function startVoiceLoop(): Promise<void> {
  if (running) {
    log("Голосовой цикл уже запущен — повторный запуск проигнорирован.", "warn");
    return;
  }
  running = true;
  stopRequested = false;

  const recorder = createRecorder();
  recorderRef = recorder;
  bindRecorder(recorder);
  await calibrateSilenceThreshold(recorder);
  log('ДиДи запущена. Слушаю — скажи "Джарвис" в любой фразе.');

  // Приветствие произносится ОДИН РАЗ при старте цикла — не путать с
  // GREETING, который звучит на каждое кодовое слово.
  await say(BOOT_GREETING);

  try {
    for (;;) {
      if (stopRequested) break;

      let wav: Buffer | null;
      try {
        wav = await recordUntilSilence(recorder);
      } catch (e) {
        if (stopRequested) break;
        log(`[audio] ошибка записи: ${e instanceof Error ? e.message : e}`, "error");
        continue;
      }
      if (stopRequested) break;
      if (!wav) continue; // короткий шум/щелчок — не фраза, даже в Whisper не идём

      let text: string;
      try {
        text = await transcribeWav(wav);
      } catch (e) {
        log(`[STT] ошибка транскрипции: ${e instanceof Error ? e.message : e}`, "warn");
        continue;
      }
      if (!text) continue;

      // Каждая команда требует свежего "Джарвис" — без окна памяти между
      // репликами: раньше любая распознанная фраза в комнате в течение
      // нескольких минут после ответа уходила в диалог без повторного
      // кодового слова — на практике это были ложные срабатывания.
      const remainder = extractAfterWake(text);
      if (remainder === null) {
        log(`[распознала, но не кодовое слово] "${text}"`);
        continue;
      }
      if (!isEnabled()) {
        log("[ДиДи] на паузе (выключено из панели) — игнорирую");
        continue;
      }

      log(`[вы] ${text}`);
      void logEvent("heard", text);
      void logHeard(wav, text);

      let commandText = remainder;
      if (commandText.length < 2) {
        // сказали только кодовое слово — здороваемся и отдельно слушаем
        // команду, но не вечно: WAKE_COMMAND_TIMEOUT_MS на начало фразы,
        // дальше молча возвращаемся к фоновому прослушиванию
        await say(GREETING);
        const cmdWav = await recordUntilSilence(recorder, WAKE_COMMAND_TIMEOUT_MS);
        if (!cmdWav) {
          log("[ДиДи] тишина после пробуждения — возвращаюсь к фоновому прослушиванию");
          continue;
        }
        commandText = await transcribeWav(cmdWav);
        if (!commandText || commandText.trim().length < 2) {
          await say("Не расслышала, повтори, пожалуйста.");
          continue;
        }
        log(`[вы] ${commandText}`);
        void logHeard(cmdWav, commandText);
      }

      // Голосовой обмен — тоже в ленту чата на /didi (role="user"), не
      // только в технический лог событий: иначе голос и текст выглядели бы
      // как два разных места, хотя по смыслу одна переписка.
      void logChatMessage("user", commandText);

      // Быстрые команды — без единого обращения к GPT: и дешевле, и мгновенно.
      const quick = await tryQuickCommand(commandText);
      if (quick.handled) {
        log(`[быстрая команда] ${commandText} → ${quick.reply}`);
        void logEvent("reply", quick.reply!);
        void logChatMessage("assistant", quick.reply!);
        await say(quick.reply!);
        continue;
      }

      const recordCommand = () => recordSpeech(recorder);
      const history = await freshHistory(); // каждая команда — новый разговор, без памяти между репликами
      const reply = await runConversationTurn(history, commandText, (q) => confirmVoice(q, recordCommand));

      void logEvent("reply", reply);
      void logChatMessage("assistant", reply);
      await say(reply);
    }
  } finally {
    try {
      recorder.stop();
      recorder.release();
    } catch {
      // уже остановлен/освобождён
    }
    recorderRef = null;
    running = false;
    log("Голосовой цикл остановлен.");
  }
}
