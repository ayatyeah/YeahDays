/**
 * /api/assistant/notify — мгновенный push от голосового помощника
 * (SalemAI) на все устройства аккаунта, где стоит PWA. Не через очередь
 * ScheduledNotification/минутный крон (см. /api/push/dispatch) — тот
 * путь для запланированных на будущее напоминаний; тут ассистент решил
 * что-то сказать ПРЯМО СЕЙЧАС, доставка должна быть без задержки.
 */

import { NextResponse } from "next/server";
import { sendPushToUser } from "@/lib/push";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(req: Request): boolean {
  const secret = process.env.ASSISTANT_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const { userId, title, text } = (body ?? {}) as Record<string, unknown>;
  const userIdStr = String(userId ?? "");
  const titleStr = String(title ?? "СалемАй").trim();
  const textStr = String(text ?? "").trim();
  if (!userIdStr || !textStr) {
    return NextResponse.json({ error: "userId и text обязательны" }, { status: 400 });
  }

  const result = await sendPushToUser(userIdStr, {
    title: titleStr,
    body: textStr,
    url: "/today",
    tag: "salemai-assistant",
    kind: "day",
  });

  return NextResponse.json({ ok: true, ...result });
}
