import { notFound } from 'next/navigation';
import StudyApp from '@/components/study/StudyApp';
import type { TabKey } from '@/lib/nav';
const views:Record<string,TabKey>={'':'home',tasks:'today',calendar:'calendar',progress:'progress',account:'account'};
export default async function Page({params}:{params:Promise<{section?:string[]}>}){const {section}=await params;const view=views[(section??[]).join('/')];if(!view)notFound();return <StudyApp view={view}/>;}
