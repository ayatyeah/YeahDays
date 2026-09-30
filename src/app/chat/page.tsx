'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import type { ChatMessage } from '@/lib/aiChat';
type Chat = { messages: ChatMessage[]; revision: number; busy: boolean; available: boolean };
export default function ChatPage() {
  const {data,status}=useSession();
  if(status==='loading')return <p>Открываем чат…</p>;
  if(!data?.user?.id)return <Link href="/login">Войти в аккаунт</Link>;
  return <Conversation key={data.user.id}/>;
}
function Conversation() {
  const [chat,setChat]=useState<Chat|null>(null);const [text,setText]=useState('');const [plan,setPlan]=useState(false);const [busy,setBusy]=useState(false);const [error,setError]=useState('');
  const alive=useRef(true);const generation=useRef(0);const retry=useRef({text:'',plan:false,id:''});const bottom=useRef<HTMLDivElement>(null);
  const apply=(data:Chat,g:number)=>{if(alive.current&&g===generation.current)setChat(old=>!old||data.revision>=old.revision?data:old);};
  useEffect(()=>{alive.current=true;const load=async()=>{const g=generation.current;try{const r=await fetch('/api/ai/chat',{cache:'no-store'});const d=await r.json();if(!r.ok)throw new Error(d.error);apply(d,g);}catch(e){if(alive.current&&g===generation.current)setError((e as Error).message);}};void load();const timer=setInterval(()=>{if(document.visibilityState==='visible')void load();},10000);return()=>{alive.current=false;generation.current++;clearInterval(timer);};},[]);
  useEffect(()=>{bottom.current?.scrollIntoView({block:'nearest'});},[chat?.messages.length]);
  async function send(e:FormEvent){e.preventDefault();if(busy||chat?.busy||!text.trim())return;const g=generation.current;setBusy(true);setError('');if(retry.current.text!==text||retry.current.plan!==plan)retry.current={text,plan,id:crypto.randomUUID()};try{const r=await fetch('/api/ai/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text,withPlan:plan,requestId:retry.current.id})});const d=await r.json();if(!r.ok)throw new Error(d.error);apply(d,g);if(alive.current&&g===generation.current){setText('');retry.current={text:'',plan:false,id:''};}}catch(e){if(alive.current&&g===generation.current)setError((e as Error).message);}finally{if(alive.current&&g===generation.current)setBusy(false);}}
  async function clear(){if(!confirm('Удалить историю этого чата со всех твоих устройств?'))return;const g=++generation.current;setBusy(true);try{const r=await fetch('/api/ai/chat',{method:'DELETE'});const d=await r.json();if(!r.ok)throw new Error(d.error);apply(d,g);setError('');retry.current={text:'',plan:false,id:''};}catch(e){if(alive.current)setError((e as Error).message);}finally{if(alive.current)setBusy(false);}}
  return <main className="mx-auto w-full max-w-3xl space-y-5"><header className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-3xl font-bold">ИИ-помощник</h1><p className="mt-2 text-sm text-[var(--color-fg-dim)]">Разберёмся вместе</p></div><button className="min-h-11 text-sm underline" onClick={()=>void clear()}>Очистить чат</button></header><p className="text-xs text-[var(--color-fg-dim)]">Сообщения отправляются в OpenAI. История видна только тебе; сохраняются последние 40 сообщений. Ответы могут содержать ошибки.</p>
    {error&&<p role="alert" className="text-[var(--color-strength)]">{error}</p>}
    {chat&&!chat.available&&<p role="status">ИИ пока не подключён на сервере.</p>}
    {!chat&&!error&&<p role="status">Загружаем историю…</p>}
    {chat&&!chat.messages.length&&<section className="grid gap-3 rounded-2xl bg-[var(--color-surface)] p-5"><h2 className="font-semibold">С чего начнём?</h2>{['Объясни TCP и UDP на простом примере','Помоги подготовиться к экзамену','Как распределить задачи на сегодня?'].map(s=><button key={s} className="min-h-11 rounded-xl border border-[var(--color-border-strong)] p-3 text-left text-sm" onClick={()=>setText(s)}>{s}</button>)}</section>}
    <div className="space-y-4" aria-label="История переписки">{chat?.messages.map(m=><article key={m.id} className={'rounded-2xl p-4 '+(m.role==='user'?'ml-6 bg-[var(--color-intelligence)]/20':'mr-4 bg-[var(--color-surface)]')}><p className="mb-2 text-xs font-semibold">{m.role==='user'?'Ты':'✦ ИИ-помощник'}{m.withPlan?' · с контекстом плана':''}</p><p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{m.text}</p></article>)}<div ref={bottom}/></div>
    {(busy||chat?.busy)&&<p role="status">ИИ готовит ответ…</p>}
    <form onSubmit={send} className="grid gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"><label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={plan} onChange={e=>setPlan(e.target.checked)}/>Учитывать мой план в этом сообщении</label><p className="text-xs text-[var(--color-fg-dim)]">При включении отправим названия и время до 20 незавершённых задач. ИИ не меняет твой план автоматически.</p><textarea aria-label="Сообщение ИИ" className="w-full rounded-xl bg-[var(--color-surface-2)] p-3 text-base" rows={3} maxLength={6000} value={text} onChange={e=>setText(e.target.value)} placeholder="Спроси об учёбе или планировании…" required/><button className="min-h-11 rounded-xl bg-[var(--color-intelligence)] px-4 py-3 font-semibold text-[var(--color-bg)] disabled:opacity-50" disabled={!chat?.available||busy||chat?.busy||!text.trim()}>Отправить</button></form>
  </main>;
}
