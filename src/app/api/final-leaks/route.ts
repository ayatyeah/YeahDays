import {NextResponse} from 'next/server';
import {auth} from '@/auth';
import {prisma} from '@/lib/db';
import {parseLeakBatch,publishQuestions} from '@/lib/finalLeaks/schema';
export const dynamic='force-dynamic';
export async function GET(){
 if(!(await auth())?.user?.id)return NextResponse.json({error:'Войди в аккаунт'},{status:401});
 try{const batches=await prisma.finalLeakBatch.findMany({where:{published:true},orderBy:{createdAt:'asc'}});return NextResponse.json({questions:batches.flatMap(b=>publishQuestions(parseLeakBatch(b.data)))},{headers:{'Cache-Control':'no-store'}});}catch{return NextResponse.json({error:'Не удалось загрузить вопросы. Попробуй ещё раз.'},{status:503});}
}
