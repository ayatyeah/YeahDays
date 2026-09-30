import { prisma } from './db';
import { projectContext, type AiScope } from './aiAccess';
export async function loadAiContext(userId: string, scopes: AiScope[]) {
  if (!scopes.length) return undefined;
  const has=(s:AiScope)=>scopes.includes(s);
  const [state,learning,activity,profile,lms,user] = await Promise.all([
    has('plan')||has('progress')||has('profile') ? prisma.userState.findUnique({where:{userId},select:{data:true}}):null,
    has('learning')||has('progress') ? prisma.learningProfile.findUnique({where:{userId},select:{data:true}}):null,
    has('progress') ? prisma.personalizationProfile.findUnique({where:{userId},select:{data:true}}):null,
    has('profile') ? prisma.communityProfile.findUnique({where:{userId},select:{bio:true,subjects:true,goals:true}}):null,
    has('plan') ? prisma.lmsConnection.findUnique({where:{userId},select:{lastSyncedAt:true,timezone:true}}):null,
    has('profile') ? prisma.user.findUnique({where:{id:userId},select:{name:true}}):null,
  ]);
  return projectContext(scopes,{state:state?.data,learning:learning?.data,activity:activity?.data,profile,lms,name:user?.name});
}
