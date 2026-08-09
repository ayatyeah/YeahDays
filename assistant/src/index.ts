import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { createRecorder, calibrateSilenceThreshold, recordUntilSilence, recordSpeech } from "./audio.js";
import { chatStep, transcribeWav } from "./openai.js";
import { say, bindRecorder } from "./voice.js";
import { confirmVoice } from "./confirm.js";
import { TOOLS, TOOL_SPECS } from "./tools.js";
import { SYSTEM_PROMPT, GREETING } from "./systemPrompt.js";
import { startPresenceLoop, isEnabled } from "./presence.js";
import { logEvent } from "./yeahgrind.js";
import { logHeard } from "./heardLog.js";

/** Предохранитель от зацикливания модели на вызовах инструментов за один ход. */
const MAX_TOOL_ROUNDS = 6;
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
/** Не даём истории расти бесконечно в длинной сессии — округляем до системного + последние N. */
const MAX_HISTORY_MESSAGES = 24;

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

/**
 * Один ход диалога поверх переданной истории (мутирует её же — так
 * следующий вызов в рамках окна памяти видит весь предыдущий обмен).
 * Возвращает финальный текстовый ответ.
 */
async function runConversationTurn(
  history: ChatCompletionMessageParam[],
  userText: string,
  recordCommand: () => Promise<Buffer>,
): Promise<string> {
  history.push({ role: "user", content: userText });

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const msg = await chatStep(history, TOOL_SPECS);
    history.push(msg as ChatCompletionMessageParam);

    if (!msg.tool_calls || msg.tool_calls.length === 0) {
      return msg.content?.trim() || "Готово.";
    }

    for (const call of msg.tool_calls) {
      if (call.type !== "function") continue;
      const toolDef = TOOLS[call.function.name];
      let result: string;

      if (!toolDef) {
        result = `Неизвестный инструмент: ${call.function.name}`;
      } else {
        let args: Record<string, unknown> = {};
        try {
          args = JSON.parse(call.function.arguments || "{}");
        } catch {
          // модель иногда возвращает битый JSON — не роняем весь разговор
        }
        try {
          if (toolDef.destructive) {
            const confirmed = await confirmVoice(toolDef.describe(args), recordCommand);
            result = confirmed
              ? await toolDef.execute(args)
              : "Отменено пользователем — действие не выполнено.";
          } else {
            result = await toolDef.execute(args);
          }
          void logEvent("tool", `${call.function.name}: ${result.slice(0, 300)}`);
        } catch (e) {
          result = `Ошибка: ${e instanceof Error ? e.message : String(e)}`;
          void logEvent("error", `${call.function.name}: ${result}`);
        }
      }

      history.push({ role: "tool", tool_call_id: call.id, content: result });
    }
  }

  return "Слишком много шагов подряд — останавливаюсь, чтобы не зациклиться.";
}

/** system + последние MAX_HISTORY_MESSAGES — не даём истории расти бесконечно. */
function trimHistory(history: ChatCompletionMessageParam[]): ChatCompletionMessageParam[] {
  if (history.length <= MAX_HISTORY_MESSAGES + 1) return history;
  return [history[0]!, ...history.slice(-MAX_HISTORY_MESSAGES)];
}

async function main() {
  startPresenceLoop();
  const recorder = createRecorder();
  bindRecorder(recorder);
  await calibrateSilenceThreshold(recorder);
  console.log('ДиДи запущена. Слушаю — скажи "Джарвис" в любой фразе.');

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
        // сказали только кодовое слово — здороваемся и отдельно слушаем команду
        await say(GREETING);
        const cmdWav = await recordSpeech(recorder);
        commandText = await transcribeWav(cmdWav);
        if (!commandText || commandText.trim().length < 2) {
          await say("Не расслышала, повтори, пожалуйста.");
          continue;
        }
        console.log(`[вы] ${commandText}`);
        void logHeard(cmdWav, commandText);
      }
      history = [{ role: "system", content: SYSTEM_PROMPT }]; // новый разговор
    }

    if (continuing) {
      console.log(`[вы, продолжение] ${text}`);
      void logEvent("heard", text);
      void logHeard(wav, text);
    }

    const reply = await runConversationTurn(history!, commandText, () => recordSpeech(recorder));
    history = trimHistory(history!);
    conversationDeadline = Date.now() + MEMORY_WINDOW_MS;

    void logEvent("reply", reply);
    await say(reply);
  }
}

main().catch((e) => {
  console.error("[ДиДи] фатальная ошибка:", e);
  process.exit(1);
});
