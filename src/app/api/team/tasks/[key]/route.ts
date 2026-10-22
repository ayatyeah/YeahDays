/**
 * GET/PATCH/DELETE /api/team/tasks/YG-n — карточка задачи, правка полей
 * с записью в журнал, удаление (только владелец).
 */
import { prisma } from "@/lib/db";
import { cleanFields, diffFields, parseKey } from "@/lib/tracker";
import { deny, json, readJson, teamUser, teamWriter } from "@/lib/trackerAccess";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ key: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const me = await teamUser();
  if (!me || me === "anonymous") return deny(me);
  const number = parseKey((await params).key);
  if (!number) return json({ error: "Unknown task" }, 404);
  const task = await prisma.trackerTask.findUnique({
    where: { number },
    include: { comments: { orderBy: { createdAt: "asc" } }, activity: { orderBy: { at: "desc" }, take: 200 } },
  });
  if (!task) return json({ error: "Unknown task" }, 404);
  return json({ me, task });
}

export async function PATCH(req: Request, { params }: Ctx) {
  const me = await teamWriter();
  if (!("email" in me)) return me;
  const number = parseKey((await params).key);
  if (!number) return json({ error: "Unknown task" }, 404);
  let body: unknown;
  try { body = await readJson(req); } catch { return json({ error: "Invalid JSON" }, 400); }
  const { fields, error } = cleanFields(body);
  if (error) return json({ error }, 400);
  const result = await prisma.$transaction(async (tx) => {
    const before = await tx.trackerTask.findUnique({ where: { number } });
    if (!before) return null;
    const changes = diffFields(before as unknown as Record<string, unknown>, fields);
    if (!changes.length) return before;
    return tx.trackerTask.update({
      where: { number },
      data: { ...fields, activity: { create: changes.map((c) => ({ ...c, actor: me.name })) } },
    });
  });
  if (!result) return json({ error: "Unknown task" }, 404);
  return json({ task: result });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const me = await teamWriter();
  if (!("email" in me)) return me;
  if (!me.isOwner) return json({ error: "Only the owner can delete tasks" }, 403);
  const number = parseKey((await params).key);
  if (!number) return json({ error: "Unknown task" }, 404);
  const removed = await prisma.trackerTask.deleteMany({ where: { number } });
  return removed.count ? json({ ok: true }) : json({ error: "Unknown task" }, 404);
}
