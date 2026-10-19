import { randomInt, randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { rateLimit } from '@/lib/rateLimit';
import { MAIN_APP_CONSENT, activity, initialResearch, parseInterview, RESEARCH_VERSION, studyWeek, taskAction, type ResearchData } from '@/lib/research';
import { mutateResearch, publicResearch, researchConfig, researchJson } from '@/lib/researchDb';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const json = (v: unknown, status = 200) => NextResponse.json(v, { status, headers: { 'Cache-Control': 'private, no-store' } });
export async function GET() {
  const userId = (await auth())?.user?.id;
  if (!userId) return json({ error: 'Войдите в аккаунт' }, 401);
  try { return json({ config: researchConfig(), participant: publicResearch(await prisma.researchParticipant.findUnique({ where: { userId } })) }); }
  catch { return json({ error: 'Исследовательский режим пока недоступен' }, 503); }
}
export async function POST(req: Request) {
  const userId = (await auth())?.user?.id;
  if (!userId) return json({ error: 'Войдите в аккаунт' }, 401);
  if (!rateLimit(`research:${userId}`, 30, 60_000)) return json({ error: 'Попробуйте через минуту' }, 429);
  const raw = await req.text();
  if (raw.length > 22000) return json({ error: 'Слишком большой запрос' }, 400);
  let body;
  try { body = JSON.parse(raw); } catch { return json({ error: 'Некорректный JSON' }, 400); }
  if (!body || !['enroll', 'activity', 'start', 'complete', 'interview', 'withdraw', 'consent'].includes(body.action)) return json({ error: 'Некорректное действие' }, 400);
  try {
    if (['enroll', 'consent'].includes(body.action) && (body.version !== RESEARCH_VERSION || body.appVersion !== MAIN_APP_CONSENT || body.adult !== true || body.notDeveloper !== true || body.consent !== true || body.aiConsent !== true)) return json({ error: 'Нужно подтвердить текущие условия участия' }, 400);
    if (body.action === 'enroll') {
      if (!researchConfig().enabled) return json({ error: 'Набор ещё не открыт' }, 409);
      if (body.version !== RESEARCH_VERSION || body.adult !== true || body.notDeveloper !== true || body.consent !== true || body.aiConsent !== true) return json({ error: 'Нужно подтвердить условия участия' }, 400);
      const row = await prisma.$transaction(async tx => {
        // Serializes allocation even when the participant table is empty.
        await tx.$queryRaw`SELECT pg_advisory_xact_lock(630319)::text`;
        const existing = await tx.researchParticipant.findUnique({ where: { userId } });
        if (existing) return existing;
        const rows = await tx.researchParticipant.findMany({ where: { pilot: false }, select: { condition: true } });
        if (rows.length >= 30) throw new Error('Набор завершён');
        // Random permuted blocks of two, maximum 15 accounts per condition.
        const a = rows.filter(r => r.condition === 'A').length;
        const b = rows.length - a;
        const condition = a === b ? (randomInt(2) ? 'A' : 'B') : a < b ? 'A' : 'B';
        return tx.researchParticipant.create({ data: { userId, participantId: randomUUID(), condition, data: researchJson({ ...initialResearch(), selectedVersion: 'rmt', appConsent: { version: MAIN_APP_CONSENT, at: new Date().toISOString() }, consentInformation: { contact: researchConfig().contact, deleteAt: researchConfig().deleteAt } }) } });
      });
      return json({ participant: publicResearch(row) });
    }
    if (body.action === 'withdraw') {
      // Same lock as event writes: withdrawal cannot race with an in-flight event.
      await prisma.$transaction(async tx => {
        await tx.$queryRaw`SELECT "userId" FROM "ResearchParticipant" WHERE "userId" = ${userId} FOR UPDATE`;
        const previous = await tx.researchParticipant.findUniqueOrThrow({ where: { userId } });
        const previousData = previous.data as unknown as ResearchData;
        const receipt = previousData.consentInformation;
        await tx.researchParticipant.update({ where: { userId }, data: { withdrawnAt: previous.withdrawnAt ?? new Date(), data: researchJson({ ...initialResearch(), aiConsent: false, ...(previousData.ordinaryAccessAt ? { ordinaryAccessAt: previousData.ordinaryAccessAt } : {}), ...(previousData.appConsent ? { appConsent: previousData.appConsent } : {}), ...(receipt ? { consentInformation: receipt } : {}) }) } });
      });
      return json({ participant: publicResearch(await prisma.researchParticipant.findUnique({ where: { userId } })) });
    }
    const row = await mutateResearch(userId, (data, row) => {
      const now = Date.now(); const week = studyWeek(row.enrolledAt, now);
      if (body.action === 'consent') {
        if (data.appConsent?.version === MAIN_APP_CONSENT) return;
        data.selectedVersion = 'rmt';
        data.appConsent = { version: MAIN_APP_CONSENT, at: new Date(now).toISOString(), migrated: true };
        data.events.push({ event_type: 'app_consent', event_timestamp: new Date(now).toISOString(), task_id: null });
        return;
      }
      if (data.appConsent?.version !== MAIN_APP_CONSENT) throw new Error('Подтвердите условия основной версии');
      if (body.action === 'interview') {
        if (week < 4) throw new Error('Интервью откроется на четвёртой неделе');
        if (!data.interview) data.interview = { ...parseInterview(body), at: new Date(now).toISOString() };
      } else {
        if (week < 1 || week > 4) throw new Error('Период выполнения заданий завершён');
        if (body.action === 'activity') activity(data, now);
        else taskAction(data, row.enrolledAt, body.action, body.taskId, now);
      }
    });
    return json({ participant: publicResearch(row) });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const expected = ['Подтвердите условия основной версии', 'Набор завершён', 'Сначала вступите в исследование', 'Участие завершено', 'Интервью откроется на четвёртой неделе', 'Период выполнения заданий завершён', 'Задание пока недоступно', 'Сначала откройте задание', 'Заполните шесть ответов; оценки — от 1 до 5 или пропуск'];
    return json({ error: expected.includes(message) ? message : 'Не удалось сохранить данные' }, expected.includes(message) ? 400 : 503);
  }
}
