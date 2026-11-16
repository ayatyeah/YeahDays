import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { boundedJson, RequestBodyError, allowedMutationOrigin } from '@/lib/requestSecurity';
import { rateLimit } from '@/lib/rateLimit';
import { dailyLimit } from '@/lib/aiLimit';
import { geminiAvailable } from '@/lib/geminiTutor';
import { ESSAY_CONSENT, countWords } from '@/lib/philosophy/practice';
import { reviewEssay } from '@/lib/philosophy/feedback';
export const runtime = 'nodejs';
const json = (value: unknown, status = 200) => NextResponse.json(value,{status,headers:{'Cache-Control':'private, no-store'}});
export async function POST(req: Request) {
  if (!allowedMutationOrigin(req)) return json({error:'invalid_origin'},403);
  const userId = (await auth())?.user?.id;
  if (!userId) return json({error:'Войди в аккаунт, чтобы получить разбор. / Sign in for feedback.'},401);
  try {
    const body = await boundedJson(req, 70_000);
    if (body.consent !== ESSAY_CONSENT) return json({error:'Подтверди отправку текста в Google Gemini. / Confirm sending your text to Google Gemini.'},400);
    const {news,draft,mode,lang} = body;
    if (typeof news !== 'string' || news.trim().length < 20 || news.length > 6000 || typeof draft !== 'string' || draft.trim().length < 20 || draft.length > 20000 || !['plan','paragraph','essay'].includes(String(mode)) || !['ru','en'].includes(String(lang))) return json({error:'Добавь новость и свой текст (от 20 символов). / Add the news and your writing (at least 20 characters).'},400);
    if (!geminiAvailable()) return json({error:'ИИ временно недоступен. Черновик остаётся у тебя. / AI is unavailable; your draft is safe.'},503);
    if (!rateLimit(`philosophy:${userId}`,3,60_000) || !await dailyLimit(`philosophy:${userId}`,20) || !await dailyLimit('philosophy:global',500)) return json({error:'Лимит проверок достигнут. Попробуй позже. / Review limit reached. Try later.'},429);
    const feedback = await reviewEssay({news:news.trim(),draft:draft.trim(),mode:mode as 'plan'|'paragraph'|'essay',lang:lang as 'ru'|'en'},req.signal);
    return json({feedback,wordCount:countWords(draft),total: mode === 'essay' ? feedback.criteria.reduce((n,c)=>n+c.score,0):null});
  } catch(error) {
    if (error instanceof RequestBodyError) return json({error:'Некорректный или слишком большой запрос. / Invalid or oversized request.'},error.status);
    return json({error:'Не удалось получить полный разбор. Текст сохранён в редакторе — попробуй ещё раз. / Review failed; your text is still in the editor. Please retry.'},502);
  }
}
