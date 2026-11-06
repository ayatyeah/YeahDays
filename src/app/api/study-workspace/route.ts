import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { rateLimit } from '@/lib/rateLimit';
import { dailyLimit } from '@/lib/aiLimit';
import { activity, taskAction, studyWeek } from '@/lib/research';
import { newStudyData, studySnapshot, setStudyMode, feedbackEvents, fixedStudyFeedback, type StudyData } from '@/lib/studyWorkspace';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const json = (v: unknown, status = 200) => NextResponse.json(v, { status, headers: { 'Cache-Control': 'private, no-store' } });
const asJson = (data: StudyData) => data as unknown as Prisma.InputJsonValue;
export async function GET() {
  const userId = (await auth())?.user?.id;
  if (!userId) return json({ error: 'unauthorized' }, 401);
  try {
    const row = await prisma.studyWorkspace.findUnique({ where: { userId } });
    return json({ study: row ? studySnapshot(row.enrolledAt, row.data as unknown as StudyData) : null });
  } catch { return json({ error: 'unavailable' }, 503); }
}
export async function POST(req: Request) {
  const userId = (await auth())?.user?.id;
  if (!userId) return json({ error: 'unauthorized' }, 401);
  if (!rateLimit(`study-workspace:${userId}`, 30, 60_000)) return json({ error: 'rate_limit' }, 429);
  let body;
  try {
    const raw = await req.text(); if (raw.length > 2000) return json({ error: 'invalid_request' }, 400);
    body = JSON.parse(raw);
    if (!body || !['begin', 'start', 'complete', 'mode', 'feedback'].includes(body.action)) return json({ error: 'invalid_request' }, 400);
  } catch { return json({ error: 'invalid_request' }, 400); }
  const locale: keyof typeof fixedStudyFeedback = body.locale === 'en' ? 'en' : body.locale === 'kk' ? 'kk' : 'ru';
  try {
    if (body.action === 'feedback') {
      const row = await prisma.studyWorkspace.findUnique({ where: { userId } });
      if (!row) return json({ error: 'not_started' }, 409);
      const data = row.data as unknown as StudyData;
      let text = fixedStudyFeedback[locale];
      if (data.mode === 'ai') {
        if (!data.aiConsent || !data.aiConsentAt) return json({ error: 'consent_required' }, 403);
        if (!rateLimit(`study-feedback:${userId}`, 4, 60_000) || !(await dailyLimit(`study-feedback-day:${userId}`, 30)) || !(await dailyLimit('study-feedback-global', 500))) return json({ error: 'rate_limit' }, 429);
        const key = process.env.OPENAI_API_KEY;
        if (!key) return json({ error: 'ai_unavailable' }, 503);
        const response = await fetch('https://api.openai.com/v1/responses', { method: 'POST', signal: AbortSignal.timeout(20_000), headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: 'gpt-4o-mini', store: false, max_output_tokens: 240,
            instructions: `Give friendly study feedback in ${locale === 'en' ? 'English' : locale === 'kk' ? 'Kazakh' : 'Russian'}, up to 3 sentences. Use only the supplied week and task events. Tasks are plan (write three steps on paper), focus (work five minutes), review (write a result, a difficulty and next step on paper). Do not change tasks, rewards, difficulty or deadlines. Do not infer emotions, schedules, paper content or knowledge. Suggest a currently available unfinished step; with no history suggest the first plan. If all available tasks are complete, acknowledge that.`,
            input: JSON.stringify({ week: studyWeek(row.enrolledAt, Date.now()), events: feedbackEvents(data) }) }) });
        if (!response.ok) return json({ error: 'ai_unavailable' }, 503);
        const result = await response.json();
        text = result.output?.flatMap((x: { content?: { type: string; text?: string }[] }) => x.content ?? []).filter((x: { type: string }) => x.type === 'output_text').map((x: { text: string }) => x.text).join('');
        if (result.status !== 'completed' || !text) return json({ error: 'ai_unavailable' }, 503);
      }
      // Do not overwrite task changes or a mode change while the provider was working.
      const updated = await prisma.$transaction(async tx => {
        await tx.$queryRaw`SELECT "userId" FROM "StudyWorkspace" WHERE "userId" = ${userId} FOR UPDATE`;
        const current = await tx.studyWorkspace.findUniqueOrThrow({ where: { userId } });
        const next = current.data as unknown as StudyData;
        if (next.mode !== data.mode || next.aiConsentAt !== data.aiConsentAt || next.events.length !== data.events.length) throw new Error('mode_changed');
        next.feedback = text; next.feedbackLocale = locale;
        return tx.studyWorkspace.update({ where: { userId }, data: { data: asJson(next) } });
      });
      return json({ study: studySnapshot(updated.enrolledAt, updated.data as unknown as StudyData) });
    }
    const row = await prisma.$transaction(async tx => {
      // A per-account lock also serializes the very first insert.
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`study-workspace:${userId}`}, 0))::text`;
      if (body.action === 'begin') {
        const existing = await tx.studyWorkspace.findUnique({ where: { userId } });
        if (existing) return existing;
        const data = newStudyData(); activity(data, Date.now());
        return tx.studyWorkspace.create({ data: { userId, data: asJson(data) } });
      }
      await tx.$queryRaw`SELECT "userId" FROM "StudyWorkspace" WHERE "userId" = ${userId} FOR UPDATE`;
      const current = await tx.studyWorkspace.findUnique({ where: { userId } });
      if (!current) throw new Error('not_started');
      const data = current.data as unknown as StudyData;
      if (body.action === 'mode') setStudyMode(data, body.mode, body.consent, Date.now());
      else {
        if (typeof body.taskId !== 'string') throw new Error('invalid_request');
        taskAction(data, current.enrolledAt, body.action, body.taskId, Date.now());
        data.feedback = ''; data.feedbackLocale = '';
      }
      return tx.studyWorkspace.update({ where: { userId }, data: { data: asJson(data) } });
    });
    return json({ study: studySnapshot(row.enrolledAt, row.data as unknown as StudyData) });
  } catch (e) {
    const message = e instanceof Error ? e.message : '';
    const expected = ['invalid_request', 'invalid_mode', 'consent_required', 'not_started', 'mode_changed', 'Задание пока недоступно', 'Сначала откройте задание'];
    return json({ error: expected.includes(message) ? message : 'unavailable' }, expected.includes(message) ? 409 : 503);
  }
}
