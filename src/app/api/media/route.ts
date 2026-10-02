/**
 * POST /api/media?kind=post|avatar — загрузить фото (тело запроса — сам файл).
 * Возвращает id и адрес; к посту фото привязывается отдельным действием
 * при публикации (см. socialDb.ts).
 */

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { CommunityError } from "@/lib/community";
import { rateLimit } from "@/lib/rateLimit";
import { requireMember } from "@/lib/socialDb";
import { MAX_UPLOAD, storeImage } from "@/lib/socialMedia";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const userId = (await auth())?.user?.id;
  if (!userId) return NextResponse.json({ error: "Нужен вход" }, { status: 401 });
  if (!rateLimit(`media:${userId}`, 20, 60_000)) return NextResponse.json({ error: "Слишком часто. Подожди минуту." }, { status: 429 });
  try {
    await requireMember(userId);
    const tooBig = new CommunityError("Фото больше 12 МБ — выбери поменьше");
    if (Number(req.headers.get("content-length") ?? 0) > MAX_UPLOAD) throw tooBig;
    // Читаем по частям и считаем сами: заголовку о размере верить нельзя, а без предела тело заняло бы всю память.
    const reader = req.body?.getReader();
    if (!reader) throw new CommunityError("Файл пустой");
    const chunks: Uint8Array[] = [];
    let size = 0;
    for (;;) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.length;
      if (size > MAX_UPLOAD) { await reader.cancel(); throw tooBig; }
      chunks.push(part.value);
    }
    const kind = new URL(req.url).searchParams.get("kind") === "avatar" ? "avatar" : "post";
    return NextResponse.json(await storeImage(userId, Buffer.concat(chunks), kind));
  } catch (e) {
    return NextResponse.json({ error: e instanceof CommunityError ? e.message : "Не удалось загрузить фото" }, { status: e instanceof CommunityError ? e.status : 503 });
  }
}
