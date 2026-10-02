/**
 * GET /api/media/<id> — отдать фото.
 *
 * Только вошедшим: сообщество закрыто от внешнего мира, и прямая ссылка
 * на картинку не должна открываться без аккаунта. Картинка по id никогда
 * не меняется, поэтому браузер может хранить её сколько угодно.
 */

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/owner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  // Владельцу фото нужны для разбора жалоб, а в консоль он может входить и без обычной сессии.
  const viewer = (await auth())?.user?.id;
  const admin = !viewer && (await requireAdmin());
  if (!viewer && !admin) return new Response(null, { status: 401 });
  const { id } = await context.params;
  try {
    const media = await prisma.socialMedia.findUnique({ where: { id }, select: { data: true, mime: true, userId: true, user: { select: { banned: true, communityProfile: { select: { hidden: true } } } } } });
    // Скрыл себя — фото перестают отдаваться другим, как и посты; автору и владельцу сервиса они видны.
    const withheld = media && media.userId !== viewer && !admin && (media.user.banned || media.user.communityProfile?.hidden);
    if (!media || withheld) return new Response(null, { status: 404 });
    return new Response(Buffer.from(media.data), {
      headers: { "Content-Type": media.mime, "Cache-Control": "private, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" },
    });
  } catch {
    return new Response(null, { status: 503 });
  }
}
