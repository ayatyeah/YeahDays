/**
 * /api/assistant/chat/pull — ДиДи забирает отсюда сообщения, написанные
 * из браузера на странице /didi. Строго ПО ОДНОМУ за вызов: chat.ts
 * обрабатывает сообщения последовательно, и подтверждение destructive-
 * инструмента (textConfirm) само дёргает этот же эндпоинт за следующим
 * сообщением как ответом "да/нет". Если бы тут забирались пачкой, всё,
 * что не первое, тут же помечалось бы pulledAt и терялось навсегда, так
 * и не обработавшись — chat.ts на них больше не подписан.
 *
 * GET ?userId= → следующее непрочитанное сообщение role="user" (или пусто)
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(req: Request): boolean {
  const secret = process.env.ASSISTANT_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId") ?? "";
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const pending = await prisma.assistantChat.findMany({
    where: { userId, role: "user", pulledAt: null },
    orderBy: { createdAt: "asc" },
    take: 1,
  });
  if (pending.length > 0) {
    await prisma.assistantChat.updateMany({
      where: { id: { in: pending.map((m) => m.id) } },
      data: { pulledAt: new Date() },
    });
  }

  return NextResponse.json({
    messages: pending.map((m) => ({ id: m.id, content: m.content, at: m.createdAt.getTime() })),
  });
}
