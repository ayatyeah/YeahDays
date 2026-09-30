import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";
import { askChat, type ChatMessage } from "@/lib/aiChat";
import { requestScopes, permittedHistory, AI_ACCESS_VERSION, type AiScope } from "@/lib/aiAccess";
import { loadAiContext } from "@/lib/aiContext";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const json = (value: unknown, status = 200) => NextResponse.json(value, { status, headers: { "Cache-Control": "private, no-store" } });
const available = () => !!process.env.OPENAI_API_KEY?.trim();
const view = (row: any) => ({ messages: (row?.messages ?? []) as ChatMessage[], revision: row?.revision ?? 0, busy: !!row?.pendingId && Date.now() - new Date(row.pendingAt).getTime() < 120000, available: available() });
export async function GET() {
  const userId = (await auth())?.user?.id; if (!userId) return json({ error: "Войди в аккаунт" }, 401);
  try { return json(view(await prisma.aiChat.findUnique({ where: { userId } }))); } catch { return json({ error: "Не удалось загрузить переписку" }, 503); }
}
export async function DELETE() {
  const userId = (await auth())?.user?.id; if (!userId) return json({ error: "Войди в аккаунт" }, 401);
  try {
    const row = await prisma.aiChat.upsert({ where: { userId }, create: { userId, messages: [] }, update: { messages: [], pendingId: null, pendingAt: null, revision: { increment: 1 } } });
    return json(view(row));
  } catch { return json({ error: "Не удалось очистить переписку" }, 503); }
}
export async function POST(req: Request) {
  const userId = (await auth())?.user?.id; if (!userId) return json({ error: "Войди в аккаунт" }, 401);
  if (!rateLimit(`chat:${userId}`, 8, 60000)) return json({ error: "Подожди минуту перед следующим сообщением" }, 429);
  if (!available()) return json({ error: "ИИ пока не подключён на сервере" }, 503);
  let body: any;
  let scopes: AiScope[] = [];
  try {
    const reader = req.body?.getReader(); if (!reader) throw new Error(); let size = 0; const chunks = [];
    while (true) { const item = await reader.read(); if (item.done) break; size += item.value.length; if (size > 26000) { await reader.cancel(); throw new Error(); } chunks.push(item.value); }
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!body || typeof body.message !== "string" || !body.message.trim() || body.message.length > 6000 || typeof body.requestId !== "string" || !/^[0-9a-f-]{36}$/i.test(body.requestId)) throw new Error();
  } catch { return json({ error: "Напиши сообщение до 6000 символов" }, 400); }
  try { scopes = requestScopes(body); } catch { return json({ error: "Сначала выбери данные и подтверди разрешение на доступ для этого сообщения." }, 400); }
  let reserved = false;
  try {
    const reservation = await prisma.$transaction(async tx => {
      await tx.aiChat.upsert({ where: { userId }, create: { userId, messages: [] }, update: {} });
      await tx.$queryRaw`SELECT "userId" FROM "AiChat" WHERE "userId" = ${userId} FOR UPDATE`;
      const row = await tx.aiChat.findUniqueOrThrow({ where: { userId } });
      if ((row.messages as ChatMessage[]).some(m => m.id === body.requestId)) return { row, kind: "done" };
      if ((row.messages as ChatMessage[]).length >= 200) return { row, kind: "full" };
      if (body.expectedRevision !== undefined && body.expectedRevision !== row.revision) return { row, kind: "changed" };
      if (view(row).busy) return { row, kind: "busy" };
      if (!rateLimit(`chat:daily:${userId}`, 60, 86400000) || !rateLimit("chat:daily:global", 1000, 86400000)) return { row, kind: "limit" };
      await tx.aiChat.update({ where: { userId }, data: { pendingId: body.requestId, pendingAt: new Date() } });
      return { row, kind: "reserved" };
    }, { timeout: 15000 });
    if (reservation.kind === "done") return json(view(reservation.row));
    if (reservation.kind === "changed") return json({ error: "Чат изменён на другом устройстве. Дождись обновления истории и отправь сообщение снова." }, 409);
    if (reservation.kind === "full") return json({ error: "В разговоре уже 200 сообщений. Нажми «Новый чат» — этот сохранится в истории." }, 409);
    if (reservation.kind === "busy") return json({ error: "Предыдущий ответ ещё готовится. Подожди немного." }, 409);
    if (reservation.kind === "limit") return json({ error: "Дневной лимит чата исчерпан. Продолжим завтра." }, 429);
    reserved = true;
    const history = reservation.row.messages as ChatMessage[];
    const context = await loadAiContext(userId, scopes);
    // Do not dispatch a request whose conversation was cleared while reading context.
    const current = await prisma.aiChat.findUnique({ where: { userId }, select: { pendingId: true } });
    if (current?.pendingId !== body.requestId) return json({ error: "Запрос отменён. Отправь сообщение заново." }, 409);
    const answer = await askChat(permittedHistory(history, scopes), body.message.trim(), context);
    const at = new Date().toISOString();
    const access = scopes.length ? { scopes, version: AI_ACCESS_VERSION, at } : undefined;
    const messages: ChatMessage[] = [...history, { id: body.requestId, role: "user" as const, text: body.message.trim(), at, access }, { id: `${body.requestId}:reply`, role: "assistant" as const, text: answer, at, access }];
    const updated = await prisma.aiChat.updateMany({ where: { userId, pendingId: body.requestId }, data: { messages: messages as unknown as Prisma.InputJsonValue, pendingId: null, pendingAt: null, revision: { increment: 1 } } });
    if (!updated.count) return json({ error: "Переписка была очищена или изменена. Ответ не сохранён." }, 409);
    return json(view(await prisma.aiChat.findUnique({ where: { userId } })));
  } catch (e) {
    if (reserved) await prisma.aiChat.updateMany({ where: { userId, pendingId: body.requestId }, data: { pendingId: null, pendingAt: null } }).catch(() => {});
    return json({ error: e instanceof Error && e.message === "limit" ? "OpenAI временно ограничил запросы. Попробуй позже." : "Не удалось получить ответ. Сообщение можно отправить повторно." }, 502);
  }
}
