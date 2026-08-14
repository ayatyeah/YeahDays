/**
 * GET /api/owner/devices — все push-подписки всех аккаунтов, для вкладки
 * "Устройства" в /admin. Не путать с /api/push/devices (та же таблица, но
 * только СВОИ устройства по сессии) — здесь владелец видит вообще все.
 * Отдаём только то, что нужно для списка/диагностики: без endpoint/p256dh/
 * auth (сырые push-креды пользователя, незачем гонять их в JSON админки).
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireOwner } from "@/lib/owner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireOwner();
  if (!session) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const subs = await prisma.pushSubscription.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      label: true,
      enabled: true,
      createdAt: true,
      updatedAt: true,
      lastSentAt: true,
      user: { select: { id: true, name: true, email: true, username: true } },
    },
  });

  return NextResponse.json({
    devices: subs.map((s) => ({
      id: s.id,
      label: s.label ?? "Неизвестное устройство",
      enabled: s.enabled,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      lastSentAt: s.lastSentAt,
      userId: s.user.id,
      userLabel: s.user.name || s.user.username || s.user.email || s.user.id,
    })),
  });
}
