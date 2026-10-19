import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { rateLimit } from '@/lib/rateLimit';
import { type ResearchData, studyWeek } from '@/lib/research';
import { mutateResearch } from '@/lib/researchDb';
export const runtime = 'nodejs';
const json = (v: unknown, status = 200) => NextResponse.json(v, { status, headers: { 'Cache-Control': 'private, no-store' } });
export async function POST() {
  const userId = (await auth())?.user?.id;
  if (!userId) return json({ error: 'Войдите в аккаунт' }, 401);
  if (!rateLimit(`research-feedback:${userId}`, 4, 60_000)) return json({ error: 'Попробуйте через минуту' }, 429);
  try {
    const row = await prisma.researchParticipant.findUnique({ where: { userId } });
    if (!row || row.withdrawnAt || studyWeek(row.enrolledAt, Date.now()) > 4) return json({ error: 'Участие не активно' }, 403);
    if (row.condition === 'A') return json({ source: 'standard', text: 'Выберите доступное задание, прочитайте инструкцию и выполняйте шаги по порядку. После выполнения отметьте результат. Каждое задание приносит 10 очков.' });
    const data = row.data as unknown as ResearchData;
    if (!data.aiConsent) return json({ error: 'Нет согласия на передачу событий' }, 403);
    const key = process.env.OPENAI_API_KEY;
    if (!key) return json({ error: 'ИИ временно недоступен' }, 503);
    // Explicit projection: no account IDs, names, plans, answers or personal content.
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST', signal: AbortSignal.timeout(20000), headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: 'gpt-4o-mini', store: false, max_output_tokens: 220,
        instructions: 'Дай короткую доброжелательную обратную связь на русском по истории выполнения заданий. Не меняй задания, их сложность, срок, награды или количество. Не придумывай причины поведения и не делай выводов об эмоциях. При пустой истории предложи начать с первого задания. До 3 предложений.',
        input: JSON.stringify({ week: studyWeek(row.enrolledAt, Date.now()), events: data.events.filter(e => ['session_start', 'task_start', 'task_complete'].includes(e.event_type)).slice(-80) }),
      }),
    });
    if (!response.ok) throw new Error('provider');
    const result = await response.json();
    const text = result.output?.flatMap((v: { content?: { type: string; text?: string }[] }) => v.content || []).filter((v: { type: string }) => v.type === 'output_text').map((v: { text: string }) => v.text).join('');
    if (result.status !== 'completed' || !text) throw new Error('provider');
    await mutateResearch(userId, data => { data.events.push({ event_type: 'ai_feedback', event_timestamp: new Date().toISOString(), task_id: null }); });
    return json({ source: 'gpt-4o-mini', text });
  } catch {
    try { await mutateResearch(userId, data => { data.events.push({ event_type: 'ai_failure', event_timestamp: new Date().toISOString(), task_id: null }); }); } catch { /* withdrawn or unavailable */ }
    return json({ error: 'Обратная связь временно недоступна. Можно продолжить задания.' }, 503);
  }
}
