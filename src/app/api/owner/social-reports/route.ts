/**
 * /api/owner/social-reports — жалобы на посты сообщества для /admin.
 *
 * GET    → нерассмотренные жалобы с текстом поста и именем автора.
 * PATCH  { id } → отклонить жалобу (пост остаётся).
 * DELETE { postId } → удалить пост; его жалобы уходят вместе с ним.
 *
 * Лента общая для всех вошедших, поэтому модерация у владельца сервиса, а
 * не у организатора команды, как в командных обсуждениях.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/owner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const denied = () => NextResponse.json({ error: "Not authorized" }, { status: 403 });

export async function GET() {
  if (!(await requireAdmin())) return denied();
  try {
    const rows = await prisma.socialReport.findMany({
      where: { resolved: false },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: { id: true, reason: true, createdAt: true, post: { select: { id: true, text: true, parentId: true, user: { select: { name: true } } } } },
    });
    return NextResponse.json(
      { reports: rows.map((r) => ({ id: r.id, reason: r.reason, createdAt: r.createdAt, postId: r.post.id, text: r.post.text, comment: !!r.post.parentId, author: r.post.user.name || "Студент" })) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ error: "Не удалось загрузить жалобы" }, { status: 503 });
  }
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) return denied();
  try {
    const body = await req.json();
    if (typeof body.id !== "string") throw new Error("bad");
    await prisma.socialReport.update({ where: { id: body.id }, data: { resolved: true } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Не удалось обновить" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) return denied();
  try {
    const body = await req.json();
    if (typeof body.postId !== "string") throw new Error("bad");
    await prisma.socialPost.deleteMany({ where: { id: body.postId } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Не удалось удалить" }, { status: 400 });
  }
}
