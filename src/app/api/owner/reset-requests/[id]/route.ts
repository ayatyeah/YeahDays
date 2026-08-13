/**
 * PATCH /api/owner/reset-requests/[id] — отметить заявку решённой/новой.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireOwner } from "@/lib/owner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireOwner();
  if (!session) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }
  const status = (body as Record<string, unknown> | null)?.status;
  if (status !== "new" && status !== "done") {
    return NextResponse.json({ error: "Некорректный статус" }, { status: 400 });
  }

  await prisma.passwordResetRequest
    .update({ where: { id }, data: { status } })
    .catch(() => null);

  return NextResponse.json({ ok: true });
}
