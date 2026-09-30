import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { rateLimit } from '@/lib/rateLimit';
import { communityHome, communityAction, publicProfile, teamView } from '@/lib/communityDb';
import { CommunityError } from '@/lib/community';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const json = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'private, no-store' } });
function error(e: unknown) { return json({ error: e instanceof CommunityError ? e.message : 'Не удалось связаться с сообществом. Попробуй ещё раз.' }, e instanceof CommunityError ? e.status : 503); }
export async function GET(req: Request) {
  const id = (await auth())?.user?.id; if (!id) return json({ error: 'Нужен вход' },401);
  try { const q = new URL(req.url).searchParams; return json(q.has('profile') ? await publicProfile(id,q.get('profile')!) : q.has('team') ? await teamView(id,q.get('team')!) : await communityHome(id)); } catch(e) { return error(e); }
}
export async function POST(req: Request) {
  const id = (await auth())?.user?.id; if (!id) return json({ error: 'Нужен вход' },401);
  if (!rateLimit(`community:${id}`,60,60000)) return json({ error: 'Слишком часто. Подожди минуту.' },429);
  try {
    const reader=req.body?.getReader(); if(!reader) throw new CommunityError('Пустой запрос'); const chunks=[]; let size=0;
    while(true){const part=await reader.read();if(part.done)break;size+=part.value.length;if(size>24000){await reader.cancel();throw new CommunityError('Слишком длинный текст');}chunks.push(part.value);}
    let body;try{body=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw new CommunityError('Некорректный запрос');}
    if(!body || typeof body!=='object' || Array.isArray(body))throw new CommunityError('Некорректный запрос');
    return json({ ok:true, ...await communityAction(id,body) });
  } catch(e) { return error(e); }
}
