import type { PvRecorder } from "@picovoice/pvrecorder-node";
import { createRecorder, calibrateSilenceThreshold, recordUntilSilence, recordSpeech, stopPlayer } from "./audio.js";
import { transcribeWav } from "./openai.js";
import { say, bindRecorder, startStreamingSpeech, pickFillerPhrase } from "./voice.js";
import { confirmVoice } from "./confirm.js";
import { GREETING, BOOT_GREETING } from "./systemPrompt.js";
import { isEnabled } from "./presence.js";
import { logEvent, logChatMessage } from "./yeahgrind.js";
import { logHeard } from "./heardLog.js";
import { runConversationTurn, freshHistory, recordTurn, resetRecentMemory } from "./conversation.js";
import { tryQuickCommand } from "./quickCommands.js";
import { log } from "./logger.js";
import { setState } from "./state.js";
import { tryStartLocalWakeword, type WakewordDetector } from "./wakeword.js";

/**
 * Основной путь — локальный детектор на Vosk с ограниченной грамматикой
 * (см. wakeword.ts + wakeword/vosk_detect.py): список из нескольких слов
 * жёстко ограничивает, что модель вообще может "услышать", поэтому она не
 * путает короткое кодовое слово со случайными словами, как это делал
 * Whisper с открытым словарём. Раньше здесь был openWakeWord, но его
 * единственная готовая модель заточена под "hey jarvis" и не подходит для
 * "СалемАй"; обучать свою ONNX-модель — Linux-only пайплайн с датасетами
 * на несколько ГБ, отдельная большая задача, не разовая правка.
 *
 * Этот STT-путь (Whisper) остаётся ЗАПАСНЫМ — включается, если Vosk не
 * поднялся (см. tryStartLocalWakeword). Тут кодовая фраза ищется не
 * классификатором, а обычным распознаванием речи: прогоняем всё через
 * Whisper и ищем в тексте слово, близкое к «салемай» (нечёткое сравнение,
 * Levenshtein), либо «salemai» латиницей.
 *
 * Изначально было одно короткое «салем» — на живых логах выяснилось, что
 * Whisper стабильно понимает целые фразы, но КОРОТКОЕ одиночное слово (1-1.3с)
 * почти всегда рассыпает в случайный шум ("Jem", "Аням", "Alyam", "Вилям" —
 * реальные расшифровки одной и той же попытки сказать "Салем"). Более
 * длинное слово даёт Whisper больше материала для опоры и статистически
 * гораздо надёжнее распознаётся коротким отдельным произнесением — это
 * пригодится именно на запасном пути, раз уж он всё ещё есть.
 */
const WAKE_VARIANTS = ["салемай", "salemai"];
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

/**
 * Индекс конца слова-кандидата на кодовую фразу в тексте, или -1, если не
 * нашли. Сверяем не только одиночные слова, но и склейку СОСЕДНЕЙ пары —
 * составное "СалемАй" Whisper вполне может расшифровать как два токена
 * ("салем ай"), и одиночное сравнение такое не поймает.
 */
function findWakeWordEnd(text: string): number {
  const lower = text.toLowerCase();
  const wordRe = /[а-яёa-z]+/gi;
  const words: { word: string; end: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = wordRe.exec(lower))) {
    words.push({ word: m[0], end: m.index + m[0].length });
  }

  for (let i = 0; i < words.length; i++) {
    const candidates = [words[i]!];
    if (i + 1 < words.length) {
      candidates.push({ word: words[i]!.word + words[i + 1]!.word, end: words[i + 1]!.end });
    }
    for (const { word, end } of candidates) {
      for (const variant of WAKE_VARIANTS) {
        if (levenshtein(word, variant) <= MAX_EDIT_DISTANCE) {
          return end;
        }
      }
    }
  }
  return -1;
}

/** Текст после кодовой фразы в той же реплике ("СалемАй, добавь молоко") — команда сразу. Иначе null. */
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
async function handleCommand(
  recorder: PvRecorder,
  commandText: string,
  historyPromise?: Promise<Awaited<ReturnType<typeof freshHistory>>>,
): Promise<void> {
  void logChatMessage("user", commandText);

  const quick = await tryQuickCommand(commandText);
  if (quick.handled) {
    log(`[быстрая команда] ${commandText} → ${quick.reply}`);
    void logEvent("reply", quick.reply!);
    void logChatMessage("assistant", quick.reply!);
    if (quick.resetHistory) resetRecentMemory();
    await say(quick.reply!);
    return;
  }

  const recordCommand = () => recordSpeech(recorder);
  // Базовая история (system + факты + скользящее окно последних команд —
  // см. conversation.ts::recordTurn) не зависит от текста ЭТОЙ команды,
  // поэтому вызывающий код (captureAndHandleCommand) может запустить её
  // ЗАРАНЕЕ, параллельно с распознаванием речи, а не последовательно после.
  const history = await (historyPromise ?? freshHistory());
  const turnStart = history.length;

  // Озвучиваем по предложениям по мере генерации, не дожидаясь всего
  // ответа целиком — see voice.ts::startStreamingSpeech. Филлер-фраза идёт
  // в ту же очередь первой, чтобы не молчать все 8-10с, пока GPT думает —
  // реальный ответ дозвучит следом, как только подтянутся его предложения.
  const speech = startStreamingSpeech();
  speech.sayNow(pickFillerPhrase());
  const reply = await runConversationTurn(
    history,
    commandText,
    (q) => confirmVoice(q, recordCommand),
    (chunk) => speech.push(chunk),
  );
  // Запоминаем ход целиком (вопрос + промежуточные вызовы тулов + ответ) —
  // следующее пробуждение кодовым словом увидит его в freshHistory().
  recordTurn(history.slice(turnStart));
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
  // Не зависит от результата распознавания — запускаем сразу же, пока
  // расшифровывается сама команда, а не после: экономит целый сетевой
  // поход в оба конца на каждую фразу (ждали бы его иначе строго после STT).
  const historyPromise = freshHistory();
  const commandText = await transcribeWav(cmdWav);
  if (!commandText || commandText.trim().length < 2) {
    await say("Не расслышала, повтори, пожалуйста.");
    return;
  }
  log(`[вы] ${commandText}`);
  void logHeard(cmdWav, commandText);
  await handleCommand(recorder, commandText, historyPromise);
}

/**
 * Локальный путь (Vosk с ограниченной грамматикой, Python-подпроцесс):
 * кадры с микрофона кормятся детектору напрямую, ничего не уходит в
 * OpenAI, пока он не сообщит о срабатывании — в отличие от STT-пути, где
 * КАЖДАЯ распознанная фраза сначала едет в Whisper. Плата: "одним
 * дыханием" ("СалемАй, добавь молоко") не работает — детектор ловит
 * только сам факт кодового слова, не текст следом, поэтому команда
 * всегда пишется отдельным, вторым заходом после короткой паузы (как у
 * обычных умных колонок).
 */
/** true — вышел штатно (стоп из UI); false — детектор умер по ходу дела, вызывающий код переключается на STT-путь. */
async function runLocalWakeLoop(recorder: PvRecorder, detector: WakewordDetector): Promise<boolean> {
  let woke = false;
  detector.onWake((text) => {
    woke = true;
    log(`[wakeword] локально распознано "${text}"`);
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
      // Раньше тонуло молча — снаружи выглядело так, будто попытка сказать
      // кодовое слово вообще не заметилась. Whisper иногда честно не
      // разбирает короткий обрывок (тишина/невнятно) и возвращает пустую
      // строку — это не ошибка, но должно быть видно в журнале, а не
      // выглядеть неотличимо от "микрофон вообще не сработал".
      log("[STT] записала, но не разобрала ни слова — тихо/невнятно");
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

/** Голосовой цикл ДиДи: слушает микрофон, ждёт "СалемАй", выполняет команды. Один запуск — до stopVoiceLoop(). */
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

  const detector = await tryStartLocalWakeword();
  detectorRef = detector;
  if (detector) {
    log('СалемАй запущена. Кодовое слово распознаётся локально (Vosk) — в OpenAI ничего не уходит, пока не скажешь "СалемАй".');
  } else {
    log('СалемАй запущена. Локальный детектор недоступен — слушаю через Whisper, скажи "СалемАй" в любой фразе.', "warn");
  }

  // Приветствие произносится ОДИН РАЗ при старте цикла — не путать с
  // GREETING, который звучит на каждое кодовое слово.
  await say(BOOT_GREETING);

  try {
    if (detector) {
      const stoppedCleanly = await runLocalWakeLoop(recorder, detector);
      if (!stoppedCleanly && !stopRequested) {
        log(
          "Локальный детектор упал по ходу работы — до конца этого запуска перехожу на распознавание через Whisper (перезапусти голос со Статуса, чтобы попробовать локальный снова).",
          "warn",
        );
        await runSttWakeLoop(recorder);
      }
    } else {
      await runSttWakeLoop(recorder);
    }
  } finally {
    try {
      recorder.stop();
      recorder.release();
    } catch {
      // уже остановлен/освобождён
    }
    try {
      detector?.stop();
    } catch {
      // уже остановлен
    }
    stopPlayer(); // не оставляем висящий powershell.exe после остановки голоса
    recorderRef = null;
    detectorRef = null;
    running = false;
    log("Голосовой цикл остановлен.");
  }
}
