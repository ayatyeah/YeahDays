import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { rateLimit } from '@/lib/rateLimit';
import type { ChatMessage } from '@/lib/aiChat';
export const dynamic='force-dynamic';
const json=(data:unknown,status=200)=>NextResponse.json(data,{status,headers:{'Cache-Control':'private, no-store'}});
class HistoryError extends Error { constructor(message:string,public status=400){super(message);} }
export async function GET(req:Request) {
  const userId=(await auth())?.user?.id;if(!userId)return json({error:'Нужен вход'},401);
  try {
    const id=new URL(req.url).searchParams.get('id');
    if(id){const row=await prisma.aiChatArchive.findFirst({where:{id,userId},select:{id:true,title:true,messages:true,savedAt:true}});return row?json(row):json({error:'Разговор не найден'},404);}
    return json({threads:await prisma.aiChatArchive.findMany({where:{userId},orderBy:{savedAt:'desc'},take:100,select:{id:true,title:true,messageCount:true,savedAt:true}})});
  }catch{return json({error:'Не удалось загрузить историю'},503);}
}
export async function POST(req:Request) {
  const userId=(await auth())?.user?.id;if(!userId)return json({error:'Нужен вход'},401);
  if(!rateLimit(`chat-history:${userId}`,20,60000))return json({error:'Подожди минуту'},429);
  let body:any;try{const reader=req.body?.getReader();if(!reader)throw new Error();const chunks=[];let size=0;while(true){const part=await reader.read();if(part.done)break;size+=part.value.length;if(size>1000){await reader.cancel();throw new Error();}chunks.push(part.value);}body=JSON.parse(Buffer.concat(chunks).toString('utf8'));if(!['new','restore','delete','deleteAll'].includes(body?.action))throw new Error();if(['restore','delete'].includes(body.action)&&(typeof body.id!=='string'||body.id.length>100))throw new Error();}catch{return json({error:'Некорректное действие'},400);}
  try {
    const row=await prisma.$transaction(async tx=>{
      await tx.aiChat.upsert({where:{userId},create:{userId,messages:[]},update:{}});
      await tx.$queryRaw`SELECT "userId" FROM "AiChat" WHERE "userId" = ${userId} FOR UPDATE`;
      const current=await tx.aiChat.findUniqueOrThrow({where:{userId}});
      if(body.action==='delete'){await tx.aiChatArchive.deleteMany({where:{id:body.id,userId}});return current;}
      if(body.action==='deleteAll'){
        await tx.aiChatArchive.deleteMany({where:{userId}});
        return tx.aiChat.update({where:{userId},data:{messages:[],pendingId:null,pendingAt:null,revision:{increment:1}}});
      }
      if(current.pendingId&&current.pendingAt&&Date.now()-current.pendingAt.getTime()<120000)throw new HistoryError('Дождись ответа ИИ или очисти текущий чат перед переключением',409);
      const target=body.action==='restore'?await tx.aiChatArchive.findFirst({where:{id:body.id,userId}}):null;
      if(body.action==='restore'&&!target)throw new HistoryError('Разговор не найден',404);
      const messages=current.messages as ChatMessage[];
      if(messages.length){
        const count=await tx.aiChatArchive.count({where:{userId}});
        if(count>=(target?101:100))throw new HistoryError('Сохранено 100 разговоров. Удали ненужный, чтобы начать новый.');
        await tx.aiChatArchive.create({data:{userId,title:(messages.find(m=>m.role==='user')?.text||'Разговор').replace(/\s+/g,' ').slice(0,80),messages:current.messages as Prisma.InputJsonValue,messageCount:messages.length}});
      }
      if(target)await tx.aiChatArchive.delete({where:{id:target.id}});
      return tx.aiChat.update({where:{userId},data:{messages:(target?.messages??[]) as Prisma.InputJsonValue,pendingId:null,pendingAt:null,revision:{increment:1}}});
    },{timeout:15000});
    return json({messages:row.messages,revision:row.revision,busy:!!row.pendingId&&!!row.pendingAt&&Date.now()-row.pendingAt.getTime()<120000,available:!!process.env.OPENAI_API_KEY?.trim()});
  }catch(e){return json({error:e instanceof HistoryError?e.message:'Не удалось изменить историю'},e instanceof HistoryError?e.status:503);}
}
