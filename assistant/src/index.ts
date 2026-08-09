import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { runWakeLoop } from "./audio.js";
import { chatStep, transcribeWav } from "./openai.js";
import { say } from "./voice.js";
import { confirmVoice } from "./confirm.js";
import { TOOLS, TOOL_SPECS } from "./tools.js";
import { SYSTEM_PROMPT, GREETING } from "./systemPrompt.js";

/** Предохранитель от зацикливания модели на вызовах инструментов. */
const MAX_TOOL_ROUNDS = 6;

async function runConversation(
  userText: string,
  recordCommand: () => Promise<Buffer>,
): Promise<string> {
  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userText },
  ];

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const msg = await chatStep(messages, TOOL_SPECS);
    messages.push(msg as ChatCompletionMessageParam);

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
        } catch (e) {
          result = `Ошибка: ${e instanceof Error ? e.message : String(e)}`;
        }
      }

      messages.push({ role: "tool", tool_call_id: call.id, content: result });
    }
  }

  return "Слишком много шагов подряд — останавливаюсь, чтобы не зациклиться.";
}

async function main() {
  console.log("ДиДи запущена. Жду кодовое слово…");
  await runWakeLoop(async (recordCommand) => {
    await say(GREETING);

    const commandWav = await recordCommand();
    const text = await transcribeWav(commandWav);
    if (!text || text.trim().length < 2) {
      await say("Не расслышала, повтори, пожалуйста.");
      return;
    }
    console.log(`[вы] ${text}`);

    const reply = await runConversation(text, recordCommand);
    await say(reply);
  });
}

main().catch((e) => {
  console.error("[ДиДи] фатальная ошибка:", e);
  process.exit(1);
});
