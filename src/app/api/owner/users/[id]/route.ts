/**
 * DELETE /api/owner/users/[id] — удалить пользователя целиком. Каскадом
 * (onDelete: Cascade в схеме) уходит всё привязанное: Account, Session,
 * Event, UserState, PushSubscription, ScheduledNotification, Assistant*.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminSelfId, requireAdmin } from "@/lib/owner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const allowed = await requireAdmin();
  if (!allowed) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { id } = await params;
  const self = await adminSelfId();
  if (self && id === self) {
    return NextResponse.json({ error: "Нельзя удалить себя" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
