/**
 * POST /api/voice/chat — голосовая/текстовая команда со страницы СалемАй
 * в PWA (src/components/SalemAiVoice.tsx). Самостоятельный GPT-цикл с
 * вызовом инструментов, НЕ через десктоп-процесс (тот может быть выключен,
 * а телефон должен работать сам по себе) — но сами действия (add_todo и
 * т.д.) идут теми же внутренними запросами к /api/assistant, что и у
 * десктоп-версии, чтобы не дублировать бизнес-логику (валидацию, upsert
 * состояния) в третьем месте.
 *
 * Responses API (client.responses.create), не Chat Completions — только
 * там есть встроенный web_search как ОТДЕЛЬНЫЙ инструмент (модель сама
 * решает, искать ли), см. assistant/src/main/didi/openai.ts::chatStep для
 * того же выбора и объяснения. Формат tools/input — плоский, без вложенного
 * .function, сверен по типам самого SDK (openai/resources/responses).
 *
 * Один запрос — один ход: без истории между вызовами. Кнопка на странице
 * — это дискретная команда ("добавь", "отметь"), а не длинный диалог;
 * упрощение осознанное, можно добавить историю позже, если понадобится.
 *
 * POST { message: string } → { reply: string }
 */
import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { ResponseInputItem, Tool } from "openai/resources/responses/responses";
import { auth } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const apiKey = process.env.OPENAI_API_KEY ?? "";
const client = apiKey ? new OpenAI({ apiKey }) : null;
// gpt-5-mini: сильнее gpt-4.1-mini на reasoning-бенчмарках, empirически
// подтверждён рабочим с web_search в Responses API — см. assistant/config.ts
// за тем же выбором и объяснением, почему прежний gpt-4.1-mini был ошибкой.
const MODEL = "gpt-5-mini";
const MAX_ROUNDS = 4;

const SYSTEM_PROMPT = `Тебя зовут СалемАй. Ты голосовой помощник внутри приложения YeahGrind —
управляешь задачами и настроением пользователя через инструменты, а
для остального (текущие события, факты, что угодно вне YeahGrind) —
можешь искать в интернете (web_search), если вопрос явно об этом.

Отвечай кратко и по делу — это голосовая команда, а не текст. Обычно
1-2 предложения, без списков и форматирования. Всегда по-русски.

Дату для инструментов вычисляй сама из текущей даты, которую видишь в
system-сообщении ниже — пользователь может сказать "завтра", "в пятницу"
и т.д., переводи это в YYYY-MM-DD.`;

const TOOLS: Tool[] = [
  {
    type: "function",
    name: "get_today_status",
    description: "Прочитать план на сегодня, задачи и настроение пользователя.",
    parameters: { type: "object", properties: {}, additionalProperties: false },
    strict: false,
  },
  {
    type: "function",
    name: "add_todo",
    description: "Добавить задачу на сегодня или другую дату.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string", description: "Текст задачи" },
        hour: { type: "number", description: "Час 0-23, если задача привязана ко времени" },
        duration: { type: "number", description: "Сколько минут займёт" },
        priority: { type: "string", enum: ["low", "normal", "high"] },
        date: { type: "string", description: "YYYY-MM-DD, по умолчанию сегодня" },
      },
      required: ["title"],
      additionalProperties: false,
    },
    strict: false,
  },
  {
    type: "function",
    name: "complete_todo",
    description: "Отметить задачу выполненной по её id (id узнаётся через get_today_status).",
    parameters: {
      type: "object",
      properties: {
        id: { type: "string" },
        done: { type: "boolean", description: "true — выполнено, false — снять отметку" },
      },
      required: ["id"],
      additionalProperties: false,
    },
    strict: false,
  },
  {
    type: "function",
    name: "set_mood",
    description: "Записать текущее настроение/энергию пользователя на сегодня.",
    parameters: {
      type: "object",
      properties: {
        energy: { type: "string", enum: ["low", "medium", "high"] },
        minutes: { type: "number", description: "Сколько минут готов вложить сегодня" },
      },
      required: ["energy"],
      additionalProperties: false,
    },
    strict: false,
  },
  { type: "web_search" },
];

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function currentDateContext(): string {
  const now = new Date();
  const weekday = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"][now.getDay()];
  return `Сегодня ${todayKey()}, ${weekday}, сейчас ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}.`;
}

/** Общий секрет для внутреннего вызова /api/assistant — тот же канал, что у десктоп-приложения. */
async function callAssistantApi(origin: string, userId: string, action: string, args: Record<string, unknown>) {
  const secret = process.env.ASSISTANT_SECRET ?? "";
  const res = await fetch(`${origin}/api/assistant`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${secret}` },
    body: JSON.stringify({ action, userId, date: args.date ?? todayKey(), ...args }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`assistant api ${action} → ${res.status}: ${text}`);
  return text;
}

async function getTodayStatus(origin: string, userId: string): Promise<string> {
  const secret = process.env.ASSISTANT_SECRET ?? "";
  const params = new URLSearchParams({ userId, date: todayKey() });
  const res = await fetch(`${origin}/api/assistant?${params}`, {
    headers: { authorization: `Bearer ${secret}` },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`assistant api status → ${res.status}: ${text}`);
  return text;
}

async function runTool(
  name: string,
  args: Record<string, unknown>,
  origin: string,
  userId: string,
): Promise<string> {
  switch (name) {
    case "get_today_status":
      return getTodayStatus(origin, userId);
    case "add_todo":
      return callAssistantApi(origin, userId, "add_todo", args);
    case "complete_todo":
      return callAssistantApi(origin, userId, "complete_todo", { ...args, day: todayKey() });
    case "set_mood":
      return callAssistantApi(origin, userId, "set_mood", args);
    default:
      return `Неизвестный инструмент: ${name}`;
  }
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (!client || !process.env.ASSISTANT_SECRET) {
    return NextResponse.json({ error: "СалемАй не настроена на сервере" }, { status: 503 });
  }

  let body: { message?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const message = typeof body.message === "string" ? body.message.trim().slice(0, 2000) : "";
  if (!message) {
    return NextResponse.json({ error: "message required" }, { status: 400 });
  }

  const origin = new URL(req.url).origin;
  const input: ResponseInputItem[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "system", content: currentDateContext() },
    { role: "user", content: message },
  ];

  try {
    for (let round = 0; round < MAX_ROUNDS; round++) {
      const response = await client.responses.create({
        model: MODEL,
        input,
        tools: TOOLS,
      });

      const functionCalls = response.output.filter((item) => item.type === "function_call");
      if (functionCalls.length === 0) {
        return NextResponse.json({ reply: response.output_text?.trim() || "Готово." });
      }

      // response.output допускает варианты (computer-use и т.п.), которых у
      // нас в tools нет и в рантайме взяться неоткуда — echo обратно в
      // input безопасен, тип шире факта.
      input.push(...(response.output as ResponseInputItem[]));
      for (const call of functionCalls) {
        let args: Record<string, unknown> = {};
        try {
          args = JSON.parse(call.arguments || "{}");
        } catch {
          // модель иногда возвращает битый JSON — не роняем весь ход
        }
        let result: string;
        try {
          result = await runTool(call.name, args, origin, userId);
        } catch (e) {
          result = `Ошибка: ${e instanceof Error ? e.message : String(e)}`;
        }
        input.push({ type: "function_call_output", call_id: call.call_id, output: result });
      }
    }
    return NextResponse.json({ reply: "Слишком много шагов подряд — останавливаюсь." });
  } catch (e) {
    console.error("voice chat failed:", e);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}
