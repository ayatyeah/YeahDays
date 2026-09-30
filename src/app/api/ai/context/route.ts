import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { loadAiContext } from '@/lib/aiContext';
import { parseScopes } from '@/lib/aiAccess';
export const dynamic='force-dynamic';
export async function GET(req:Request) {
  const id=(await auth())?.user?.id;if(!id)return NextResponse.json({error:'Нужен вход'},{status:401});
  let scopes;try{scopes=parseScopes(new URL(req.url).searchParams.getAll('scope'));}catch{return NextResponse.json({error:'Выбери категории данных'},{status:400});}
  try{return NextResponse.json({context:await loadAiContext(id,scopes)??null},{headers:{'Cache-Control':'private, no-store'}});}catch{return NextResponse.json({error:'Не удалось загрузить предварительный просмотр'},{status:503});}
}
