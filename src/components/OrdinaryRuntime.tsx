'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useOrdinaryVersion } from './AppModeProvider';
import dynamic from 'next/dynamic';
import { useUiStore } from '@/store/useUiStore';
const CreateTaskModal = dynamic(() => import('./CreateTaskModal'), { ssr: false });
import DomTranslator from '@/i18n/DomTranslator';
import InputFocusGuard from './InputFocusGuard';
import RuntimeDiagnostics from './RuntimeDiagnostics';
import VisitBeacon from './VisitBeacon';

export default function OrdinaryRuntime() {
  const createOpen = useUiStore(s => s.createOpen);
  const ordinary = useOrdinaryVersion(); const {data:session}=useSession();
  useEffect(()=>{
    if(ordinary && session?.user?.id) void fetch('/api/app-mode',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mode:'normal'})});
  },[ordinary,session?.user?.id]);
  if(!ordinary)return null;
  return <><InputFocusGuard/><RuntimeDiagnostics/><DomTranslator/><VisitBeacon/>{createOpen && <CreateTaskModal/>}</>;
}
