/**
 * /api/push/devices — список подписанных на push устройств текущего
 * аккаунта, для раздела "Ваши устройства" в профиле. Не путать с
 * /api/push/subscribe (та подписывает/отписывает ТЕКУЩЕЕ устройство по его
 * endpoint) — здесь можно посмотреть и удалить ЛЮБОЕ своё устройство по id,
 * поэтому авторизация строго по сессии, без userId из тела запроса.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const subs = await prisma.pushSubscription.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: { id: true, label: true, enabled: true, createdAt: true, updatedAt: true },
  });

  return NextResponse.json({
    devices: subs.map((s) => ({
      id: s.id,
      label: s.label ?? "Неизвестное устройство",
      enabled: s.enabled,
      createdAt: s.createdAt.getTime(),
      updatedAt: s.updatedAt.getTime(),
    })),
  });
}

export async function DELETE(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}) as Record<string, unknown>);
  const id = typeof body.id === "string" ? body.id : "";
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  // deleteMany + userId в where — не delete({where:{id}}), чтобы нельзя
  // было по чужому id удалить чужую же подписку.
  await prisma.pushSubscription.deleteMany({ where: { id, userId } });
  return NextResponse.json({ ok: true });
}
