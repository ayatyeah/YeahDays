/** POST /api/team/tasks/YG-n/comments — комментарий к задаче от своего имени. */
import { prisma } from "@/lib/db";
import { parseKey } from "@/lib/tracker";
import { json, readJson, teamWriter } from "@/lib/trackerAccess";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: Promise<{ key: string }> }) {
  const me = await teamWriter();
  if (!("email" in me)) return me;
  const number = parseKey((await params).key);
  if (!number) return json({ error: "Unknown task" }, 404);
  let body: unknown;
  try { body = await readJson(req); } catch { return json({ error: "Invalid JSON" }, 400); }
  const text = typeof (body as { text?: unknown })?.text === "string" ? (body as { text: string }).text.trim().slice(0, 4000) : "";
  if (!text) return json({ error: "Comment is empty" }, 400);
  const task = await prisma.trackerTask.findUnique({ where: { number }, select: { number: true } });
  if (!task) return json({ error: "Unknown task" }, 404);
  const comment = await prisma.trackerComment.create({ data: { taskNumber: number, author: me.name, text } });
  return json({ comment }, 201);
}
