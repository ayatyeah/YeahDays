import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/owner';
import { prisma } from '@/lib/db';
import { metrics, totalMetrics, type ResearchData, RESEARCH_VERSION } from '@/lib/research';
export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  try {
    const interviews = new URL(req.url).searchParams.get('dataset') === 'interviews';
    const rows = await prisma.researchParticipant.findMany({ where: { pilot: false }, orderBy: { enrolledAt: 'asc' } });
    const now = Date.now();
    const participants = rows.map(row => {
      const data = row.data as unknown as ResearchData;
      const identity = { participant_id: row.participantId, condition: row.condition, app_consent_at: data.appConsent?.at ?? null, interface_version: data.appConsent?.version ?? 'standalone-v1', mixed_interface: data.appConsent?.migrated === true || !!data.ordinaryAccessAt, ordinary_version_used_at: data.ordinaryAccessAt ?? null, enrolled_at: row.enrolledAt.toISOString(), withdrawn_at: row.withdrawnAt?.toISOString() ?? null };
      if (interviews) return { ...identity, interview: row.withdrawnAt ? null : data.interview };
      return { ...identity, total: row.withdrawnAt ? null : totalMetrics(row.enrolledAt, data, now), weeks: row.withdrawnAt ? [] : metrics(row.enrolledAt, data, now), events: row.withdrawnAt ? [] : data.events, interview_submitted: !!data.interview };
    });
    return NextResponse.json({ protocol: RESEARCH_VERSION, generated_at: new Date(now).toISOString(), dataset: interviews ? 'restricted_interviews' : 'behavior', participants }, { headers: { 'Cache-Control': 'private, no-store', 'Content-Disposition': `attachment; filename="research-${interviews ? 'interviews' : 'behavior'}.json"` } });
  } catch { return NextResponse.json({ error: 'Export unavailable' }, { status: 503 }); }
}
