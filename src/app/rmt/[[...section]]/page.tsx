import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import StudyApp from '@/components/study/StudyApp';
import type { TabKey } from '@/lib/nav';
const views:Record<string,TabKey>={'':'home',tasks:'today',calendar:'calendar',progress:'progress',account:'account'};
export default async function Page({params}:{params:Promise<{section?:string[]}>}){
  const {section}=await params;const view=views[(section??[]).join('/')];if(!view)notFound();
  // The study is closed to new people: only enrolled participants keep access, so they can finish, export or withdraw.
  const userId=(await auth())?.user?.id;
  if(!userId)redirect('/login?callbackUrl=/rmt');
  const participant=await prisma.researchParticipant.findUnique({where:{userId},select:{userId:true}});
  if(!participant)redirect('/app');
  return <StudyApp view={view}/>;
}
