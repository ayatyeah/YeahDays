/**
 * GET /api/team/tasks — все задачи трекера, участники и текущий пользователь.
 * POST /api/team/tasks — новая задача со следующим номером YG-n.
 */
import { prisma } from "@/lib/db";
import { cleanFields } from "@/lib/tracker";
import { deny, json, readJson, teamUser, teamWriter } from "@/lib/trackerAccess";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const me = await teamUser();
  if (!me || me === "anonymous") return deny(me);
  const [tasks, members, comments] = await Promise.all([
    prisma.trackerTask.findMany({ orderBy: { number: "asc" } }),
    prisma.trackerMember.findMany({ orderBy: { addedAt: "asc" } }),
    prisma.trackerComment.groupBy({ by: ["taskNumber"], _count: { _all: true } }),
  ]);
  const commentCount = Object.fromEntries(comments.map((c) => [c.taskNumber, c._count._all]));
  return json({ me, members, tasks: tasks.map((t) => ({ ...t, comments: commentCount[t.number] ?? 0 })) });
}

export async function POST(req: Request) {
  const me = await teamWriter();
  if (!("email" in me)) return me;
  let body: unknown;
  try { body = await readJson(req); } catch { return json({ error: "Invalid JSON" }, 400); }
  const { fields, error } = cleanFields(body);
  if (error) return json({ error }, 400);
  if (!fields.summary) return json({ error: "Summary is required" }, 400);
  // Номер — следующий после максимального; при гонке двух созданий повторяем.
  for (let attempt = 0; attempt < 3; attempt++) {
    const last = await prisma.trackerTask.findFirst({ orderBy: { number: "desc" }, select: { number: true } });
    const number = (last?.number ?? 0) + 1;
    try {
      const task = await prisma.trackerTask.create({
        data: { ...fields, summary: fields.summary, number, createdBy: me.name, activity: { create: { actor: me.name, field: "created", toValue: fields.summary } } },
      });
      return json({ task }, 201);
    } catch (e) {
      if ((e as { code?: string }).code !== "P2002") throw e;
    }
  }
  return json({ error: "Could not allocate a task number, try again" }, 409);
}
