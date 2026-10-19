import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { APP_MODE_COOKIE, parseAppMode } from '@/lib/appMode';
import { mutateResearch } from '@/lib/researchDb';
export async function POST(req: Request) {
  const origin=req.headers.get('origin');
  if(origin && origin!==new URL(req.url).origin)return NextResponse.json({error:'Invalid origin'},{status:403});
  let body;try{const raw=await req.text();if(raw.length>1000)throw new Error();body=JSON.parse(raw);}catch{return NextResponse.json({error:'Некорректный запрос'},{status:400});}
  const mode=parseAppMode(body?.mode);if(!mode)return NextResponse.json({error:'Выберите версию'},{status:400});
  const userId=(await auth())?.user?.id;
  if(userId){
    try {
      const row=await prisma.researchParticipant.findUnique({where:{userId},select:{withdrawnAt:true}});
      if(row && !row.withdrawnAt)await mutateResearch(userId,data=>{
        data.selectedVersion=mode;
        if(mode==='normal' && !data.ordinaryAccessAt){data.ordinaryAccessAt=new Date().toISOString();data.events.push({event_type:'version_switch',event_timestamp:data.ordinaryAccessAt,task_id:null});}
      });
    }catch{return NextResponse.json({error:'Не удалось сохранить выбор. Попробуйте ещё раз.'},{status:503});}
  }
  const response=NextResponse.json({mode,redirect:mode==='rmt'?'/rmt':userId?'/app':'/ordinary'},{headers:{'Cache-Control':'private, no-store'}});
  response.cookies.set(APP_MODE_COOKIE,mode,{httpOnly:true,secure:new URL(req.url).protocol==='https:',sameSite:'lax',path:'/',maxAge:365*24*60*60});
  return response;
}
