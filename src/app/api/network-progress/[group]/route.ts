import {auth} from '@/auth';
import {prisma} from '@/lib/db';
import {Prisma} from '@prisma/client';
import {groups,questionsFor} from '@/lib/events/networkFinal/quizzes';
import {emptyProgress,mergeNetwork,type NetworkProgress} from '@/lib/events/networkFinal/progress';

type Context={params:Promise<{group:string}>};
async function identity(context:Context){
  const userId=(await auth())?.user?.id;
  const {group}=await context.params;
  if(!userId || !groups.some(g=>g.id===group))return null;
  return {userId,eventId:'network-bank:'+group};
}
export async function GET(req:Request,context:Context){
  const key=await identity(context);
  if(!key || req.headers.get('x-progress-owner')!==key.userId)return new Response(null,{status:403});
  const row=await prisma.eventProgress.findUnique({where:{userId_eventId:key}});
  return Response.json(row?.data??emptyProgress,{headers:{'Cache-Control':'private, no-store'}});
}
export async function PUT(req:Request,context:Context){
  const key=await identity(context);
  if(!key || req.headers.get('x-progress-owner')!==key.userId)return new Response(null,{status:403});
  const bank=new Map(questionsFor((await context.params).group).filter(q=>q.correct.length).map(q=>[q.id,q]));
  let incoming:NetworkProgress;
  try{
    const raw=await req.text();
    if(raw.length>64000)throw Error();
    incoming=JSON.parse(raw);
    const stamp=(v:number)=>Number.isSafeInteger(v)&&v>=0&&v<=Date.now()+300000;
    if(!stamp(incoming.time)||!incoming.history||Array.isArray(incoming.history)||typeof incoming.history!=='object')throw Error();
    for(const [id,item] of Object.entries(incoming.history))if(!bank.has(id)||!stamp(item.time)||typeof item.ok!=='boolean')throw Error();
    const a=incoming.attempt;
    if(a!==null && (!Array.isArray(a.ids)||!a.ids.length||a.ids.length>bank.size||new Set(a.ids).size!==a.ids.length||a.ids.some(id=>!bank.has(id))||!Number.isInteger(a.index)||a.index<0||a.index>=a.ids.length||typeof a.done!=='boolean'||!Array.isArray(a.answers)||a.answers.length>a.ids.length||(a.done&&a.answers.length!==a.ids.length)||a.answers.some((xs,i)=>!Array.isArray(xs)||xs.length!==bank.get(a.ids[i])!.correct.length||new Set(xs).size!==xs.length||xs.some(x=>!Number.isInteger(x)||x<0||x>=bank.get(a.ids[i])!.options.length))))throw Error();
  }catch{return new Response(null,{status:400});}
  await prisma.$transaction(async tx=>{
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtextextended(${JSON.stringify(key)},0))::text`;
    const row=await tx.eventProgress.findUnique({where:{userId_eventId:key}});
    const merged=mergeNetwork(row?.data as NetworkProgress??emptyProgress,incoming);
    const data={data:merged as unknown as Prisma.InputJsonValue,percent:Math.round(Object.values(merged.history).filter(x=>x.ok).length*100/bank.size)};
    await tx.eventProgress.upsert({where:{userId_eventId:key},create:{...key,...data},update:data});
  });
  return new Response(null,{status:204});
}
