import { NextResponse } from 'next/server';
import { cronAuthorized } from '@/lib/cronAuth';
import { purgeExpiredResearch } from '@/lib/researchRetention';
export const runtime = 'nodejs';
export async function POST(req: Request) {
  if (!cronAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try { return NextResponse.json({ deleted: await purgeExpiredResearch() }, { headers: { 'Cache-Control': 'no-store' } }); }
  catch { return NextResponse.json({ error: 'Cleanup unavailable' }, { status: 503 }); }
}
