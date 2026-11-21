'use client';
import {useEffect, useMemo, useSyncExternalStore} from 'react';
import {useSession} from 'next-auth/react';

type Lang='en'|'ru';
type Field='question'|'explanation';
type Choices=Partial<Record<Field,Lang|null>>;
const empty:Choices={};

function languageStore(owner:string) {
  const headers={'x-quiz-owner':owner,'Content-Type':'application/json'};
  const key='yg.quiz.languages:'+owner;
  let values:Choices={}, pending:Choices={}, initialized=false, syncing=false, version=0;
  const listeners=new Set<()=>void>();
  function notify(){listeners.forEach(fn=>fn());}
  function cache(){try{localStorage.setItem(key,JSON.stringify({values,pending}));}catch{}}
  async function sync(){
    if(!owner || syncing)return;
    syncing=true;
    const startVersion=version;
    try {
      for(const field of ['question','explanation'] as const){
        while(pending[field]){
          const value=pending[field];
          const response=await fetch('/api/quiz-preferences',{method:'PATCH',headers,body:JSON.stringify({field,value}),keepalive:true});
          if(!response.ok)return;
          if(pending[field]===value)delete pending[field];
          cache();
        }
      }
      const before=version;
      const response=await fetch('/api/quiz-preferences',{headers,cache:'no-store'});
      if(response.ok && before===version){values={...await response.json(),...pending};cache();notify();}
    }catch{/* Keep offline selections until the next sync. */}
    finally{syncing=false;}
    if(Object.keys(pending).length && version!==startVersion)void sync();
  }
  function refresh(){void sync();}
  function init(){
    if(initialized)return;
    initialized=true;
    try{const stored=JSON.parse(localStorage.getItem(key)??'null');if(stored){values=stored.values??{};pending=stored.pending??{};notify();}}catch{}
    refresh();
  }
  return {subscribe(fn:()=>void){listeners.add(fn);return ()=>{listeners.delete(fn);};},read:()=>values,init,refresh,
    choose(field:Field,value:Lang){version++;values={...values,[field]:value};if(owner)pending[field]=value;cache();notify();void sync();}
  };
}
const stores=new Map<string,ReturnType<typeof languageStore>>();
export function useQuizLanguages(){
  const {data}=useSession();
  const owner=data?.user?.id??'';
  const store=useMemo(()=>{let instance=stores.get(owner);if(!instance){instance=languageStore(owner);stores.set(owner,instance);}return instance;},[owner]);
  const choices=useSyncExternalStore(store.subscribe,store.read,()=>empty);
  useEffect(()=>{
    store.init();
    const refresh=()=>store.refresh();
    window.addEventListener('online',refresh);
    window.addEventListener('focus',refresh);
    return ()=>{
      window.removeEventListener('online',refresh);
      window.removeEventListener('focus',refresh);
    };
  },[store]);
  return {choices,choose:store.choose};
}
