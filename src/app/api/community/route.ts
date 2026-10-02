import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { rateLimit } from '@/lib/rateLimit';
import { communityHome, communityAction, teamView } from '@/lib/communityDb';
import { discoverTeams, feed, followList, isSocialAction, notices, profileView, searchPeople, socialAction, socialHome, suggestions, thread } from '@/lib/socialDb';
import { CommunityError } from '@/lib/community';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const json = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'private, no-store' } });
function error(e: unknown) { return json({ error: e instanceof CommunityError ? e.message : 'Не удалось связаться с сообществом. Попробуй ещё раз.' }, e instanceof CommunityError ? e.status : 503); }
export async function GET(req: Request) {
  const id = (await auth())?.user?.id; if (!id) return json({ error: 'Нужен вход' },401);
  try {
    const q = new URL(req.url).searchParams;
    if (q.has('feed')) return json(await feed(id, q.get('feed')!, q.get('before')));
    if (q.has('post')) return json(await thread(id, q.get('post')!));
    if (q.has('people')) return json(await searchPeople(id, q.get('people')!));
    if (q.has('suggestions')) return json(await suggestions(id));
    if (q.has('notices')) return json(await notices(id));
    if (q.has('discover')) return json(await discoverTeams(id, q.get('discover')!));
    if (q.has('followers')) return json(await followList(id, q.get('followers')!, 'followers'));
    if (q.has('following')) return json(await followList(id, q.get('following')!, 'following'));
    if (q.has('profile')) return json(await profileView(id, q.get('profile')!));
    if (q.has('team')) return json(await teamView(id, q.get('team')!));
    const [home, social] = await Promise.all([communityHome(id), socialHome(id)]);
    return json({ ...home, social });
  } catch(e) { return error(e); }
}
export async function POST(req: Request) {
  const id = (await auth())?.user?.id; if (!id) return json({ error: 'Нужен вход' },401);
  if (!rateLimit(`community:${id}`,60,60000)) return json({ error: 'Слишком часто. Подожди минуту.' },429);
  try {
    const reader=req.body?.getReader(); if(!reader) throw new CommunityError('Пустой запрос'); const chunks=[]; let size=0;
    while(true){const part=await reader.read();if(part.done)break;size+=part.value.length;if(size>24000){await reader.cancel();throw new CommunityError('Слишком длинный текст');}chunks.push(part.value);}
    let body;try{body=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw new CommunityError('Некорректный запрос');}
    if(!body || typeof body!=='object' || Array.isArray(body))throw new CommunityError('Некорректный запрос');
    return json({ ok:true, ...(isSocialAction(body.action) ? await socialAction(id,body) : await communityAction(id,body)) });
  } catch(e) { return error(e); }
}
