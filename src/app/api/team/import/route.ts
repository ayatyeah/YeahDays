/**
 * POST /api/team/import — загрузка CSV в формате YouTrack (как
 * project-management/youtrack-backlog.csv). Задачи с существующим номером
 * обновляются, новые создаются. Только владелец.
 */
import { prisma } from "@/lib/db";
import { diffFields, rowsFromCsv } from "@/lib/tracker";
import { json, teamWriter } from "@/lib/trackerAccess";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const me = await teamWriter();
  if (!("email" in me)) return me;
  if (!me.isOwner) return json({ error: "Only the owner can import" }, 403);
  const text = await req.text();
  if (text.length > 1_000_000) return json({ error: "File is larger than 1 MB" }, 413);
  const { tasks, skipped } = rowsFromCsv(text);
  let created = 0;
  let updated = 0;
  for (const { number, fields } of tasks) {
    await prisma.$transaction(async (tx) => {
      const before = await tx.trackerTask.findUnique({ where: { number } });
      if (!before) {
        await tx.trackerTask.create({ data: { ...fields, summary: fields.summary!, number, createdBy: me.name, activity: { create: { actor: me.name, field: "imported", toValue: fields.summary! } } } });
        created++;
        return;
      }
      const changes = diffFields(before as unknown as Record<string, unknown>, fields);
      if (!changes.length) return;
      await tx.trackerTask.update({ where: { number }, data: { ...fields, activity: { create: changes.map((c) => ({ ...c, actor: `${me.name} (import)` })) } } });
      updated++;
    });
  }
  return json({ created, updated, skipped });
}
