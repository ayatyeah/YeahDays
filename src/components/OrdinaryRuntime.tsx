'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useOrdinaryVersion } from './AppModeProvider';
import CreateTaskModal from './CreateTaskModal';
import DomTranslator from '@/i18n/DomTranslator';
import VisitBeacon from './VisitBeacon';
import RoutePrefetch from './RoutePrefetch';
export default function OrdinaryRuntime() {
  const ordinary = useOrdinaryVersion(); const {data:session}=useSession();
  useEffect(()=>{
    if(ordinary && session?.user?.id) void fetch('/api/app-mode',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mode:'normal'})});
  },[ordinary,session?.user?.id]);
  if(!ordinary)return null;
  return <><DomTranslator/><VisitBeacon/><CreateTaskModal/><RoutePrefetch/></>;
}
