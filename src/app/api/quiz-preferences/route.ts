import {auth} from '@/auth';
import {prisma} from '@/lib/db';
import {allowedMutationOrigin, boundedJson} from '@/lib/requestSecurity';

export async function GET(request:Request) {
  const owner=(await auth())?.user?.id;
  if(!owner || request.headers.get('x-quiz-owner')!==owner) return new Response(null,{status:403});
  const row=await prisma.user.findUniqueOrThrow({where:{id:owner},select:{quizQuestionLanguage:true,quizExplanationLanguage:true}});
  return Response.json({question:row.quizQuestionLanguage,explanation:row.quizExplanationLanguage},{headers:{'Cache-Control':'private, no-store'}});
}

export async function PATCH(request:Request) {
  const owner=(await auth())?.user?.id;
  if(!owner || !allowedMutationOrigin(request) || request.headers.get('x-quiz-owner')!==owner) return new Response(null,{status:403});
  const body=await boundedJson(request,256).catch(()=>null);
  if(!body || typeof body!=='object' || !('field' in body) || !('value' in body) ||
    (body.field!=='question' && body.field!=='explanation') || (body.value!=='en' && body.value!=='ru')) return new Response(null,{status:400});
  await prisma.user.update({where:{id:owner},data:body.field==='question'?{quizQuestionLanguage:body.value}:{quizExplanationLanguage:body.value}});
  return new Response(null,{status:204});
}
