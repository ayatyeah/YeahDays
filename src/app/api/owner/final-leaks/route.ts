import {NextResponse} from 'next/server';
import {Prisma} from '@prisma/client';
import {prisma} from '@/lib/db';
import {requireAdmin} from '@/lib/owner';
import {allowedMutationOrigin,boundedJson,RequestBodyError} from '@/lib/requestSecurity';
import {parseLeakBatch,questionFingerprint} from '@/lib/finalLeaks/schema';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(){
 if(!await requireAdmin())return NextResponse.json({error:'Not authorized'},{status:403});
 try{return NextResponse.json(await prisma.finalLeakBatch.findMany({orderBy:{createdAt:'desc'}}),{headers:{'Cache-Control':'no-store'}});}catch{return NextResponse.json({error:'База временно недоступна'},{status:503});}
}
export async function POST(req:Request){
 if(!allowedMutationOrigin(req))return NextResponse.json({error:'Invalid origin'},{status:403});
 if(!await requireAdmin())return NextResponse.json({error:'Not authorized'},{status:403});
 let batch;try{batch=parseLeakBatch(await boundedJson(req,2_000_000));}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Некорректный JSON'},{status:e instanceof RequestBodyError?e.status:400});}
 try{
  const result=await prisma.$transaction(async tx=>{
   const existing=await tx.finalLeakBatch.findUnique({where:{id:batch.id}});
   if(existing){if(JSON.stringify(parseLeakBatch(existing.data))===JSON.stringify(batch)&&existing.published)return {count:batch.questions.length,alreadyImported:true};throw Error('CONFLICT');}
   const current=await tx.finalLeakBatch.findMany({where:{published:true},select:{data:true}});
   const seen=new Set(current.flatMap(row=>parseLeakBatch(row.data).questions.map(questionFingerprint)));
   if(batch.questions.some(q=>seen.has(questionFingerprint(q))))throw Error('DUPLICATE');
   await tx.finalLeakBatch.create({data:{id:batch.id,title:batch.title,data:batch as unknown as Prisma.InputJsonValue}});
   return {count:batch.questions.length,alreadyImported:false};
  },{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});
  return NextResponse.json(result);
 }catch(e){const message=e instanceof Error?e.message:'';if(['CONFLICT','DUPLICATE'].includes(message)||e instanceof Prisma.PrismaClientKnownRequestError&&['P2002','P2034'].includes(e.code))return NextResponse.json({error:message==='DUPLICATE'?'Часть вопросов уже опубликована. Удали дубликаты из импорта.':'Этот id уже занят или банк изменился параллельно. Обнови список; не перезаписывай существующий пакет.'},{status:409});return NextResponse.json({error:'Не удалось сохранить. Можно безопасно повторить загрузку с тем же id.'},{status:503});}
}
export async function PATCH(req:Request){
 if(!allowedMutationOrigin(req)||!await requireAdmin())return NextResponse.json({error:'Not authorized'},{status:403});
 try{const b=await boundedJson(req);if(typeof b.id!=='string'||b.published!==false)return NextResponse.json({error:'Можно только скрыть пакет: {id, published:false}'},{status:400});await prisma.finalLeakBatch.update({where:{id:b.id},data:{published:false}});return NextResponse.json({ok:true});}catch{return NextResponse.json({error:'Не удалось скрыть пакет'},{status:400});}
}
