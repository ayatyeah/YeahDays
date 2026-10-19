import { Prisma } from '@prisma/client';
import { prisma } from './db';
import { type ResearchData, RESEARCH_VERSION, studyWeek, TASKS } from './research';
export const researchJson = (data: ResearchData) => data as unknown as Prisma.InputJsonValue;
export function researchConfig() {
  const contact = process.env.RESEARCH_CONTACT?.trim() || '';
  const deleteAt = process.env.RESEARCH_DELETE_AT || '';
  const enabled = process.env.RESEARCH_ENABLED === 'true' && !!contact && Date.parse(deleteAt) > Date.now() + 28 * 86_400_000;
  return { enabled, contact, deleteAt, version: RESEARCH_VERSION };
}
export function publicResearch(row: { participantId: string; condition: string; pilot: boolean; enrolledAt: Date; withdrawnAt: Date | null; data: unknown } | null) {
  if (!row) return null;
  const data = row.data as ResearchData;
  return { participantId: row.participantId, condition: row.condition, pilot: row.pilot, enrolledAt: row.enrolledAt, withdrawnAt: row.withdrawnAt, week: studyWeek(row.enrolledAt, Date.now()), tasks: TASKS.map(t => ({ ...t, started: data.events.some(e => e.task_id === t.id && e.event_type === 'task_start'), completed: data.events.some(e => e.task_id === t.id && e.event_type === 'task_complete') })), points: 10 * data.events.filter(e => e.event_type === 'task_complete').length, interviewSubmitted: !!data.interview };
}
export async function mutateResearch(userId: string, change: (data: ResearchData, row: { enrolledAt: Date; withdrawnAt: Date | null; condition: string }) => void) {
  return prisma.$transaction(async tx => {
    await tx.$queryRaw`SELECT "userId" FROM "ResearchParticipant" WHERE "userId" = ${userId} FOR UPDATE`;
    const row = await tx.researchParticipant.findUnique({ where: { userId } });
    if (!row) throw new Error('Сначала вступите в исследование');
    if (row.withdrawnAt) throw new Error('Участие завершено');
    const data = row.data as unknown as ResearchData;
    change(data, row);
    return tx.researchParticipant.update({ where: { userId }, data: { data: researchJson(data) } });
  });
}
