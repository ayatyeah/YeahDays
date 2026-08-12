import type { PvRecorder } from "@picovoice/pvrecorder-node";
import { createRecorder, calibrateSilenceThreshold, recordUntilSilence, recordSpeech } from "./audio.js";
import { transcribeWav } from "./openai.js";
import { say, bindRecorder, startStreamingSpeech } from "./voice.js";
import { confirmVoice } from "./confirm.js";
import { GREETING, BOOT_GREETING } from "./systemPrompt.js";
import { isEnabled } from "./presence.js";
import { logEvent, logChatMessage } from "./yeahgrind.js";
import { logHeard } from "./heardLog.js";
import { runConversationTurn, freshHistory } from "./conversation.js";
import { tryQuickCommand } from "./quickCommands.js";
import { log } from "./logger.js";
import { setState } from "./state.js";
import type { WakewordDetector } from "./wakeword.js";

/**
 * Кодовая фраза ищется не классификатором, а обычным распознаванием речи —
 * прогоняем всё через Whisper и ищем в тексте слово, близкое к «салем»
 * (нечёткое сравнение, Levenshtein), либо «salem» латиницей.
 *
 * Локальный детектор (openWakeWord) сейчас НЕ используется — единственная
 * готовая предобученная модель в библиотеке заточена под фразу "hey
 * jarvis" и физически не отличит "Салем" от шума; своя модель для нового
 * слова не обучена (это отдельная задача с синтезом обучающих сэмплов и
 * тренировкой ONNX, не разовая правка). См. tryStartLocalWakeword в
 * wakeword.ts — код рабочий и ждёт своей модели, просто не вызывается.
 */
const WAKE_VARIANTS = ["салем", "салам", "salem"];
const MAX_EDIT_DISTANCE = 2;

/** Сколько ждать начала команды после срабатывания кодового слова, прежде чем тихо вернуться к фоновому прослушиванию. */
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
let detectorRef: WakewordDetector | null = null;
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
  try {
    detectorRef?.stop();
  } catch {
    // не запускался или уже остановлен
  }
}

/**
 * Всё, что происходит с расшифрованной командой ПОСЛЕ того, как кодовое
 * слово так или иначе сработало (локально или через STT) — общее для
 * обоих путей детекции, чтобы не дублировать логику быстрых команд,
 * подтверждений и обращения к GPT.
 */
async function handleCommand(recorder: PvRecorder, commandText: string): Promise<void> {
  void logChatMessage("user", commandText);

  const quick = await tryQuickCommand(commandText);
  if (quick.handled) {
    log(`[быстрая команда] ${commandText} → ${quick.reply}`);
    void logEvent("reply", quick.reply!);
    void logChatMessage("assistant", quick.reply!);
    await say(quick.reply!);
    return;
  }

  const recordCommand = () => recordSpeech(recorder);
  const history = await freshHistory(); // каждая команда — новый разговор, без памяти между репликами

  // Озвучиваем по предложениям по мере генерации, не дожидаясь всего
  // ответа целиком — see voice.ts::startStreamingSpeech.
  const speech = startStreamingSpeech();
  const reply = await runConversationTurn(
    history,
    commandText,
    (q) => confirmVoice(q, recordCommand),
    (chunk) => speech.push(chunk),
  );
  // Редкий случай: пустой content или "слишком много шагов" — этот текст
  // никогда не проходил через onTextChunk, значит ничего не поставлено в
  // очередь озвучки. Досылаем его целиком, чтобы не остаться немой.
  if (!speech.hasSpoken()) speech.push(reply);
  await speech.finish();

  void logEvent("reply", reply);
  void logChatMessage("assistant", reply);
}

/** Записывает и распознаёт команду после срабатывания кодового слова — общее для обоих путей. */
async function captureAndHandleCommand(recorder: PvRecorder): Promise<void> {
  if (!isEnabled()) {
    log("[СалемАй] на паузе (выключено из панели) — игнорирую");
    return;
  }
  await say(GREETING);
  setState("listening");
  // 0.4с, а не дефолтный 1с: тут уже точно не фоновый шум — человек только
  // что услышал "Да?" и явно пытается что-то сказать, а не бормочет мимо
  // микрофона. Короткая команда вроде "стоп" не должна отбрасываться как
  // обрывок (реальный случай: "обрывок 0.99с" выбрасывал настоящую команду).
  const cmdWav = await recordUntilSilence(recorder, WAKE_COMMAND_TIMEOUT_MS, 0.4);
  if (!cmdWav) {
    log("[СалемАй] тишина после пробуждения — возвращаюсь к фоновому прослушиванию");
    return;
  }
  setState("thinking");
  const commandText = await transcribeWav(cmdWav);
  if (!commandText || commandText.trim().length < 2) {
    await say("Не расслышала, повтори, пожалуйста.");
    return;
  }
  log(`[вы] ${commandText}`);
  void logHeard(cmdWav, commandText);
  await handleCommand(recorder, commandText);
}

/**
 * Локальный путь (openWakeWord, Python-подпроцесс): кадры с микрофона
 * кормятся детектору напрямую, ничего не уходит в OpenAI, пока он не
 * сообщит о срабатывании — в отличие от STT-пути, где КАЖДАЯ распознанная
 * фраза сначала едет в Whisper. Плата: "одним дыханием" ("Джарвис, добавь
 * молоко") больше не работает — детектор ловит только сам факт кодового
 * слова, не текст следом, поэтому команда всегда пишется отдельным,
 * вторым заходом после короткой паузы (как у обычных умных колонок).
 */
/** true — вышел штатно (стоп из UI); false — детектор умер по ходу дела, вызывающий код переключается на STT-путь. */
async function runLocalWakeLoop(recorder: PvRecorder, detector: WakewordDetector): Promise<boolean> {
  let woke = false;
  detector.onWake((score) => {
    woke = true;
    log(`[wakeword] локально распознано "Джарвис" (score=${score.toFixed(2)})`);
  });

  for (;;) {
    if (stopRequested) return true;
    if (!detector.isAlive()) return false;

    let frame: Int16Array;
    try {
      frame = await recorder.read();
    } catch (e) {
      if (stopRequested) return true;
      log(`[audio] ошибка чтения микрофона: ${e instanceof Error ? e.message : e}`, "error");
      continue;
    }
    if (stopRequested) return true;

    detector.feed(frame);
    if (!woke) continue;
    woke = false;

    try {
      await captureAndHandleCommand(recorder);
    } catch (e) {
      log(`[СалемАй] ошибка обработки команды: ${e instanceof Error ? e.message : e}`, "error");
    } finally {
      // Что бы ни случилось внутри (тишина, ошибка, обычный ответ) — цикл
      // возвращается ждать кодовое слово, орб должен вернуться в спокойное
      // состояние вне зависимости от того, на каком шаге всё закончилось.
      setState("idle");
    }
  }
}

/** Запасной путь без локального детектора — как было раньше: всё слышимое едет в Whisper, там же ищем кодовое слово. */
async function runSttWakeLoop(recorder: PvRecorder): Promise<void> {
  for (;;) {
    if (stopRequested) break;

    setState("listening");
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

    setState("thinking");
    let text: string;
    try {
      text = await transcribeWav(wav);
    } catch (e) {
      log(`[STT] ошибка транскрипции: ${e instanceof Error ? e.message : e}`, "warn");
      setState("idle");
      continue;
    }
    if (!text) {
      setState("idle");
      continue;
    }

    const remainder = extractAfterWake(text);
    if (remainder === null) {
      log(`[распознала, но не кодовое слово] "${text}"`);
      setState("idle");
      continue;
    }
    if (!isEnabled()) {
      log("[СалемАй] на паузе (выключено из панели) — игнорирую");
      setState("idle");
      continue;
    }

    log(`[вы] ${text}`);
    void logEvent("heard", text);
    void logHeard(wav, text);

    try {
      if (remainder.length >= 2) {
        // сказано одним дыханием — команда сразу, без отдельного захода
        await handleCommand(recorder, remainder);
      } else {
        await captureAndHandleCommand(recorder);
      }
    } finally {
      setState("idle");
    }
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
  setState("idle");

  const recorder = createRecorder();
  recorderRef = recorder;
  bindRecorder(recorder);
  await calibrateSilenceThreshold(recorder);

  // Локальный детектор пока не запускаем — см. комментарий у WAKE_VARIANTS
  // выше: готовая модель понимает только "hey jarvis", под "Салем" своей
  // пока нет. runLocalWakeLoop/tryStartLocalWakeword остаются в коде
  // рабочими на будущее, просто не вызываются — весь путь идёт через Whisper.
  log('СалемАй запущена. Слушаю через Whisper, скажи "Салем" в любой фразе.');

  // Приветствие произносится ОДИН РАЗ при старте цикла — не путать с
  // GREETING, который звучит на каждое кодовое слово.
  await say(BOOT_GREETING);

  try {
    await runSttWakeLoop(recorder);
  } finally {
    try {
      recorder.stop();
      recorder.release();
    } catch {
      // уже остановлен/освобождён
    }
    recorderRef = null;
    detectorRef = null;
    running = false;
    log("Голосовой цикл остановлен.");
  }
}
