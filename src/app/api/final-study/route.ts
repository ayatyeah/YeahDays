import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { rateLimit } from '@/lib/rateLimit';
import { dailyLimit } from '@/lib/aiLimit';
import { createFinalStudy, mutateFinalStudy, readProfile, standardTasks, type FinalStudy } from '@/lib/finalStudy';
import { generateFinalTasks } from '@/lib/finalStudyAi';
import { allowedMutationOrigin, boundedJson, RequestBodyError } from '@/lib/requestSecurity';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const json = (value: unknown, status = 200) => NextResponse.json(value, { status, headers: { 'Cache-Control': 'private, no-store' } });
const asJson = (data: FinalStudy) => data as unknown as Prisma.InputJsonValue;

export async function GET() {
  const userId = (await auth())?.user?.id;
  if (!userId) return json({ error: 'unauthorized' }, 401);
  try {
    const row = await prisma.finalStudyWorkspace.findUnique({ where: { userId } });
    return json({ study: row?.data ?? null });
  } catch { return json({ error: 'unavailable' }, 503); }
}

export async function POST(req: Request) {
  const userId = (await auth())?.user?.id;
  if (!userId) return json({ error: 'unauthorized' }, 401);
  if (!allowedMutationOrigin(req)) return json({ error: 'invalid_origin' }, 403);
  if (!req.headers.get('content-type')?.startsWith('application/json')) return json({ error: 'invalid_request' }, 400);
  if (!rateLimit(`final-study:${userId}`, 30, 60_000)) return json({ error: 'rate_limit' }, 429);
  let body: Record<string, unknown>;
  try {
    body = await boundedJson(req);
    if (!body || !['create', 'start', 'complete', 'reflection', 'survey'].includes(String(body.action))) throw Error();
  } catch (error) { return json({ error: 'invalid_request' }, error instanceof RequestBodyError ? error.status : 400); }
  try {
    let created: FinalStudy | null = null;
    if (body.action === 'create') {
      const existing = await prisma.finalStudyWorkspace.findUnique({ where: { userId } });
      if (existing) return json({ study: existing.data });
      const profile = readProfile(body.profile);
      if (profile.mode === 'ai') {
        if (body.consent !== true) return json({ error: 'consent_required' }, 403);
        if (!rateLimit(`final-generation:${userId}`, 2, 60_000) || !await dailyLimit(`final-generation:${userId}`, 6) || !await dailyLimit('final-generation-global', 200)) return json({ error: 'rate_limit' }, 429);
        const result = await generateFinalTasks(profile);
        created = createFinalStudy(profile, result.tasks, result.generation);
      } else created = createFinalStudy(profile, standardTasks(profile.minutes), null);
    }
    const row = await prisma.$transaction(async tx => {
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`final-study:${userId}`}, 0))::text`;
      const current = await tx.finalStudyWorkspace.findUnique({ where: { userId } });
      if (created) return current ?? tx.finalStudyWorkspace.create({ data: { userId, data: asJson(created) } });
      if (!current) throw Error('not_started');
      const data = current.data as unknown as FinalStudy;
      mutateFinalStudy(data, body);
      return tx.finalStudyWorkspace.update({ where: { userId }, data: { data: asJson(data) } });
    });
    return json({ study: row.data });
  } catch (error) {
    const code = error instanceof Error ? error.message : '';
    if (code === 'ai_unavailable' || (error instanceof Error && error.name === 'TimeoutError')) return json({ error: 'ai_unavailable' }, 503);
    if (['invalid_profile', 'invalid_request', 'invalid_task'].includes(code)) return json({ error: code }, 400);
    if (['not_started', 'start_first', 'previous_task'].includes(code)) return json({ error: code }, 409);
    return json({ error: 'unavailable' }, 503);
  }
}
