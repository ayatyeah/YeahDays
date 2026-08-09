import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { chatStep } from "./openai.js";
import { TOOLS, TOOL_SPECS } from "./tools.js";
import { SYSTEM_PROMPT } from "./systemPrompt.js";
import { logEvent } from "./yeahgrind.js";

/** Предохранитель от зацикливания модели на вызовах инструментов за один ход. */
const MAX_TOOL_ROUNDS = 6;
/** Не даём истории расти бесконечно в долгой сессии — system + последние N. */
const MAX_HISTORY_MESSAGES = 24;

export function freshHistory(): ChatCompletionMessageParam[] {
  return [{ role: "system", content: SYSTEM_PROMPT }];
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
