import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { createRecorder, calibrateSilenceThreshold, recordUntilSilence, recordSpeech } from "./audio.js";
import { transcribeWav } from "./openai.js";
import { say, bindRecorder } from "./voice.js";
import { confirmVoice } from "./confirm.js";
import { GREETING, BOOT_GREETING } from "./systemPrompt.js";
import { startPresenceLoop, isEnabled } from "./presence.js";
import { logEvent, logChatMessage } from "./yeahgrind.js";
import { logHeard } from "./heardLog.js";
import { runConversationTurn, trimHistory, freshHistory } from "./conversation.js";
import { startChatLoop } from "./chat.js";
import { tryQuickCommand } from "./quickCommands.js";

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

/**
 * Память диалога: сколько молчания считаем "надолго" и разговор закончен.
 * Пока не истекло — следующая фраза идёт в тот же контекст БЕЗ повторного
 * "Джарвис". Дальше по счётчику: любая тишина комнаты, которую распознает
 * как фразу и ошибочно сочтёт обращённой к ДиДи (см. предупреждение в
 * README про ложные срабатывания STT), в этом окне тоже попадёт в диалог —
 * плата за "не повторять кодовое слово каждый раз".
 */
const MEMORY_WINDOW_MS = Number(process.env.MEMORY_WINDOW_MINUTES ?? "5") * 60_000;
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

async function main() {
  startPresenceLoop();
  void startChatLoop(); // текстовый чат страницы /didi — независимо от голосового цикла ниже

  const recorder = createRecorder();
  bindRecorder(recorder);
  await calibrateSilenceThreshold(recorder);
  console.log('ДиДи запущена. Слушаю — скажи "Джарвис" в любой фразе.');

  // Приветствие произносится ОДИН РАЗ при старте процесса (автозапуск при
  // входе в Windows или ручной npm start) — не путать с GREETING, который
  // звучит на каждое кодовое слово.
  await say(BOOT_GREETING);

  let history: ChatCompletionMessageParam[] | null = null;
  let conversationDeadline = 0;

  for (;;) {
    const wav = await recordUntilSilence(recorder);
    if (!wav) continue; // короткий шум/щелчок — не фраза, даже в Whisper не идём

    let text: string;
    try {
      text = await transcribeWav(wav);
    } catch (e) {
      console.warn("[STT] ошибка транскрипции:", e instanceof Error ? e.message : e);
      continue;
    }
    if (!text) continue;

    const continuing = history !== null && Date.now() < conversationDeadline;
    let commandText: string;

    if (continuing) {
      commandText = text;
      console.log(`[вы, продолжение] ${text}`);
      void logEvent("heard", text);
      void logHeard(wav, text);
    } else {
      const remainder = extractAfterWake(text);
      if (remainder === null) {
        console.log(`[распознала, но не кодовое слово] "${text}"`);
        continue;
      }
      if (!isEnabled()) {
        console.log("[ДиДи] на паузе (выключено из панели в браузере) — игнорирую");
        continue;
      }

      console.log(`[вы] ${text}`);
      void logEvent("heard", text);
      void logHeard(wav, text);

      commandText = remainder;
      if (commandText.length < 2) {
        // сказали только кодовое слово — здороваемся и отдельно слушаем
        // команду, но не вечно: WAKE_COMMAND_TIMEOUT_MS на начало фразы,
        // дальше молча возвращаемся к фоновому прослушиванию, а не висим
        // в ожидании команды, которая, может, вообще не прозвучит
        await say(GREETING);
        const cmdWav = await recordUntilSilence(recorder, WAKE_COMMAND_TIMEOUT_MS);
        if (!cmdWav) {
          console.log("[ДиДи] тишина после пробуждения — возвращаюсь к фоновому прослушиванию");
          continue;
        }
        commandText = await transcribeWav(cmdWav);
        if (!commandText || commandText.trim().length < 2) {
          await say("Не расслышала, повтори, пожалуйста.");
          continue;
        }
        console.log(`[вы] ${commandText}`);
        void logHeard(cmdWav, commandText);
      }
      history = freshHistory(); // новый разговор
    }

    // Голосовой обмен — тоже в ленту чата на /didi (role="user"), не
    // только в технический лог событий: иначе голос и текст выглядели бы
    // как два разных места, хотя по смыслу одна переписка.
    void logChatMessage("user", commandText);

    // Быстрые команды — без единого обращения к GPT: и дешевле, и мгновенно.
    const quick = tryQuickCommand(commandText);
    if (quick.handled) {
      console.log(`[быстрая команда] ${commandText} → ${quick.reply}`);
      if (quick.resetHistory) {
        history = null;
        conversationDeadline = 0;
      }
      void logEvent("reply", quick.reply!);
      void logChatMessage("assistant", quick.reply!);
      await say(quick.reply!);
      continue;
    }

    const recordCommand = () => recordSpeech(recorder);
    const reply = await runConversationTurn(history!, commandText, (q) => confirmVoice(q, recordCommand));
    history = trimHistory(history!);
    conversationDeadline = Date.now() + MEMORY_WINDOW_MS;

    void logEvent("reply", reply);
    void logChatMessage("assistant", reply);
    await say(reply);
  }
}

main().catch((e) => {
  console.error("[ДиДи] фатальная ошибка:", e);
  process.exit(1);
});
