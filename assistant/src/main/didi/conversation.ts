import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { chatStep } from "./openai.js";
import { TOOLS, TOOL_SPECS } from "./tools.js";
import { SYSTEM_PROMPT } from "./systemPrompt.js";
import { logEvent, getFacts } from "./yeahgrind.js";

/** Предохранитель от зацикливания модели на вызовах инструментов за один ход. */
const MAX_TOOL_ROUNDS = 6;
/** Не даём истории расти бесконечно в долгой сессии — system + последние N. */
const MAX_HISTORY_MESSAGES = 24;

/**
 * Голосовые команды раньше начинались каждая с чистого листа — специально,
 * чтобы случайный разговор в комнате до срабатывания кодового слова не
 * попадал в контекст (см. assistant/.env.example). Но кодовое слово УЖЕ
 * фильтрует это на входе: сюда попадают только команды, которые прошли
 * через явное "СалемАй" — то, что было сказано ДО или ПОСЛЕ этого окна,
 * сюда не просачивается в принципе. Поэтому короткая память между
 * пробуждениями безопасна: это не то же самое, что "слушать всё подряд".
 *
 * Храним сами СООБЩЕНИЯ завершённых ходов (не только текст) — по одному
 * массиву на ход, чтобы можно было обрезать по числу ХОДОВ, а не по
 * произвольному числу сообщений (у хода с вызовом инструмента сообщений
 * больше, чем у простого текстового ответа).
 */
const MAX_RECENT_TURNS = 20;
let recentTurns: ChatCompletionMessageParam[][] = [];

/** Записать сообщения только что завершённого хода в скользящее окно памяти. */
export function recordTurn(messages: ChatCompletionMessageParam[]): void {
  if (messages.length === 0) return;
  recentTurns.push(messages);
  if (recentTurns.length > MAX_RECENT_TURNS) {
    recentTurns = recentTurns.slice(-MAX_RECENT_TURNS);
  }
}

/** "Салем, стоп" и подобное — явный сигнал "дальше это уже другая тема", см. quickCommands.ts::resetHistory. */
export function resetRecentMemory(): void {
  recentTurns = [];
}

const WEEKDAYS = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];

/**
 * "Добавь задачу на завтра" — GPT нигде больше не видит текущую дату
 * (модель не знает, какое сегодня число, только примерно когда её
 * обучили), поэтому без этого либо оставляет date пустым (уходит в
 * addTodo как "сегодня" по умолчанию), либо галлюцинирует случайную
 * дату — оба варианта тихо кладут задачу не туда, где её потом ищут.
 * Считается заново на каждый вызов (не константа в промпте), чтобы не
 * протухало, если процесс ДиДи живёт сутками.
 */
function currentDateContext(): string {
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate(),
  ).padStart(2, "0")}`;
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return (
    `Сегодня ${dateStr}, ${WEEKDAYS[now.getDay()]}, сейчас ${time}. ` +
    `Считай относительные даты ("завтра", "послезавтра", "в понедельник") от этого — ` +
    `параметр date у инструментов (add_todo и т.д.) всегда в формате YYYY-MM-DD.`
  );
}

/**
 * Системный промпт + текущая дата/время + долговременная память ("Салем,
 * запомни ...", см. quickCommands.ts) + скользящее окно последних
 * MAX_RECENT_TURNS команд. Долговременная память читается заново на
 * каждый вызов, так что свежедобавленный факт увидит уже следующая команда.
 */
export async function freshHistory(): Promise<ChatCompletionMessageParam[]> {
  const history: ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "system", content: currentDateContext() },
  ];
  try {
    const facts = await getFacts();
    if (facts.length > 0) {
      history.push({
        role: "system",
        content: `Вот что пользователь ранее попросил запомнить о себе:\n${facts.map((f) => `- ${f}`).join("\n")}`,
      });
    }
  } catch (e) {
    console.warn("[conversation] getFacts не прошёл:", e instanceof Error ? e.message : e);
  }
  for (const turn of recentTurns) history.push(...turn);
  return history;
}

export function trimHistory(history: ChatCompletionMessageParam[]): ChatCompletionMessageParam[] {
  if (history.length <= MAX_HISTORY_MESSAGES + 1) return history;
  return [history[0]!, ...history.slice(-MAX_HISTORY_MESSAGES)];
}

/**
 * Один ход диалога поверх переданной истории (мутирует её же). Общий для
 * голоса (index.ts) и текстового чата (chat.ts) — отличаются только тем,
 * как подтверждается destructive-инструмент: голосом (confirmVoice) или
 * следующим сообщением в чате (chat.ts::textConfirm). Логика вызова
 * инструментов и обрезки истории — одна на оба канала.
 */
export async function runConversationTurn(
  history: ChatCompletionMessageParam[],
  userText: string,
  confirm: (question: string) => Promise<boolean>,
  onTextChunk?: (chunk: string) => void,
): Promise<string> {
  history.push({ role: "user", content: userText });

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const msg = await chatStep(history, TOOL_SPECS, onTextChunk);
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
            const confirmed = await confirm(toolDef.describe(args));
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
