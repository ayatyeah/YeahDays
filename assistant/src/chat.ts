import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { config } from "./config.js";
import { runConversationTurn, trimHistory, freshHistory } from "./conversation.js";
import { NEGATIVE, POSITIVE } from "./confirm.js";
import { tryQuickCommand } from "./quickCommands.js";

/** Как часто опрашивать очередь сообщений со страницы /didi. */
const CHAT_POLL_MS = 2000;
/** Сколько ждать ответа "да"/"нет" на подтверждение, прежде чем считать отменённым. */
const CONFIRM_TIMEOUT_MS = 5 * 60_000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface ChatMessage {
  id: string;
  content: string;
  at: number;
}

async function call(path: string, init?: RequestInit) {
  const res = await fetch(`${config.yeahgrindBaseUrl}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${config.assistantSecret}`,
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`YeahGrind API ${path} → ${res.status}`);
  return res.json();
}

async function pullPending(): Promise<ChatMessage[]> {
  const params = new URLSearchParams({ userId: config.yeahgrindUserId });
  const res = (await call(`/api/assistant/chat/pull?${params}`)) as { messages: ChatMessage[] };
  return res.messages;
}

async function postReply(content: string): Promise<void> {
  await call("/api/assistant/chat/reply", {
    method: "POST",
    body: JSON.stringify({ userId: config.yeahgrindUserId, content }),
  });
}

/**
 * Подтверждение destructive-инструмента через сам чат: задаём вопрос
 * ответным сообщением и ждём следующее сообщение пользователя как ответ —
 * тот же критерий да/нет, что и в голосовом confirmVoice (confirm.ts).
 * Голосовое подтверждение здесь неуместно: если человек печатает, а не
 * говорит, требовать от него сказать "да" вслух — не то, чего он ждёт.
 */
async function textConfirm(question: string): Promise<boolean> {
  await postReply(`${question} (напиши «да» или «нет»)`);
  const deadline = Date.now() + CONFIRM_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const pending = await pullPending();
    if (pending.length > 0) {
      const text = pending[0]!.content.toLowerCase();
      if (NEGATIVE.test(text)) return false;
      if (POSITIVE.test(text)) return true;
      return false; // неоднозначный ответ — по умолчанию отказ, как и в голосе
    }
    await sleep(CHAT_POLL_MS);
  }
  return false; // не дождались ответа
}

/**
 * Независимый от голосового цикл: опрашивает очередь сообщений со страницы
 * /didi, прогоняет через тот же conversation.ts (общие инструменты,
 * задачи YeahGrind, OS-контроль), пишет ответ обратно. Разговор помнит
 * всё с запуска процесса — не нужен таймаут, как у голоса: печатать
 * что-то ДиДи ненамеренно, в отличие от того, что она может услышать
 * в комнате, нельзя.
 */
export async function startChatLoop(): Promise<void> {
  let history: ChatCompletionMessageParam[] = await freshHistory();

  for (;;) {
    try {
      // По одному сообщению за раз, не пачкой: textConfirm внутри
      // runConversationTurn сам вызывает pullPending() за следующим
      // сообщением как ответом "да/нет". Если бы тут забирали сразу
      // несколько, то самое подтверждение оказалось бы уже помеченным
      // pulledAt этой выборкой — и textConfirm ждал бы то, что на самом
      // деле уже лежит в локальном массиве, никем не обработанное.
      const pending = await pullPending();
      const msg = pending[0];
      if (msg) {
        console.log(`[чат] ${msg.content}`);

        // Быстрые команды — без обращения к GPT, дешевле и мгновенно.
        const quick = await tryQuickCommand(msg.content);
        if (quick.handled) {
          if (quick.resetHistory) history = await freshHistory();
          console.log(`[чат, быстрая команда] → ${quick.reply}`);
          await postReply(quick.reply!);
          continue;
        }

        const reply = await runConversationTurn(history, msg.content, textConfirm);
        history = trimHistory(history);
        console.log(`[чат → ответ] ${reply}`);
        await postReply(reply);
        continue; // сразу проверить очередь ещё раз, не дожидаясь sleep
      }
    } catch (e) {
      console.warn("[чат] ошибка опроса:", e instanceof Error ? e.message : e);
    }
    await sleep(CHAT_POLL_MS);
  }
}
