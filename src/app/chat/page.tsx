'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Modal from '@/components/ui/Modal';
import { AI_SCOPES, AI_ACCESS_VERSION, type AiScope } from '@/lib/aiAccess';
import type { ChatMessage } from '@/lib/aiChat';
type Thread = { id: string; title: string; messageCount: number; savedAt: string };
type SavedChat = { id: string; title: string; messages: ChatMessage[]; savedAt: string };
type Chat = { messages: ChatMessage[]; revision: number; busy: boolean; available: boolean };
export default function ChatPage() {
  const {data,status}=useSession();
  if(status==='loading')return <p>Открываем чат…</p>;
  if(!data?.user?.id)return <Link href="/login">Войти в аккаунт</Link>;
  return <Conversation key={data.user.id}/>;
}
function Conversation() {
  const [chat,setChat]=useState<Chat|null>(null);const [text,setText]=useState('');const [scopes,setScopes]=useState<AiScope[]>([]);const [draft,setDraft]=useState<AiScope[]>([]);const [accessOpen,setAccessOpen]=useState(false);const [preview,setPreview]=useState('');const [previewError,setPreviewError]=useState('');const [previewBusy,setPreviewBusy]=useState(false);const previewGeneration=useRef(0);const [busy,setBusy]=useState(false);const [error,setError]=useState('');
  const [historyOpen,setHistoryOpen]=useState(false);
  const [threads,setThreads]=useState<Thread[]>([]);
  const [saved,setSaved]=useState<SavedChat|null>(null);
  const [historyError,setHistoryError]=useState('');
  const [historyBusy,setHistoryBusy]=useState(false);
  const [visibleCount,setVisibleCount]=useState(40);
  const operation=useRef(false);
  const displayed=saved?.messages??chat?.messages??[];
  const alive=useRef(true);const generation=useRef(0);const retry=useRef({text:'',access:'',id:''});const bottom=useRef<HTMLDivElement>(null);
  const apply=(data:Chat,g:number)=>{if(alive.current&&g===generation.current)setChat(old=>!old||data.revision>=old.revision?data:old);};
  useEffect(()=>{alive.current=true;const load=async()=>{const g=generation.current;try{const r=await fetch('/api/ai/chat',{cache:'no-store'});const d=await r.json();if(!r.ok)throw new Error(d.error);apply(d,g);}catch(e){if(alive.current&&g===generation.current)setError((e as Error).message);}};void load();const timer=setInterval(()=>{if(document.visibilityState==='visible')void load();},10000);return()=>{alive.current=false;generation.current++;clearInterval(timer);};},[]);
  useEffect(()=>{bottom.current?.scrollIntoView({block:'nearest'});},[chat?.messages.length]);
  async function send(e:FormEvent){e.preventDefault();if(operation.current||busy||chat?.busy||saved||!text.trim())return;operation.current=true;const g=generation.current;setBusy(true);setError('');if(retry.current.text!==text||retry.current.access!==scopes.join(','))retry.current={text,access:scopes.join(','),id:crypto.randomUUID()};const consent=scopes.length?{accepted:true,version:AI_ACCESS_VERSION,scopes:[...scopes]}:null;setScopes([]);setDraft([]);try{const r=await fetch('/api/ai/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text,consent,requestId:retry.current.id,expectedRevision:chat?.revision})});const d=await r.json();if(!r.ok)throw new Error(d.error);apply(d,g);if(alive.current&&g===generation.current){setText('');setScopes([]);setDraft([]);retry.current={text:'',access:'',id:''};}}catch(e){if(alive.current&&g===generation.current)setError((e as Error).message);}finally{operation.current=false;if(alive.current&&g===generation.current)setBusy(false);}}
  async function clear(){if(!confirm('Удалить сообщения текущего чата со всех устройств? Сохранённые разговоры останутся в истории.'))return;const g=++generation.current;operation.current=false;setBusy(true);try{const r=await fetch('/api/ai/chat',{method:'DELETE'});const d=await r.json();if(!r.ok)throw new Error(d.error);apply(d,g);setError('');setSaved(null);setVisibleCount(40);setScopes([]);setDraft([]);retry.current={text:'',access:'',id:''};}catch(e){if(alive.current)setError((e as Error).message);}finally{if(alive.current)setBusy(false);}}
  async function loadHistory() {
    setHistoryBusy(true);setHistoryError('');
    try {const r=await fetch('/api/ai/chat/history',{cache:'no-store'});const d=await r.json();if(!r.ok)throw new Error(d.error);if(alive.current)setThreads(d.threads);}
    catch(e){if(alive.current)setHistoryError((e as Error).message);}finally{if(alive.current)setHistoryBusy(false);}
  }
  async function openSaved(id:string) {
    if(operation.current)return;operation.current=true;setHistoryBusy(true);setHistoryError('');
    try{const r=await fetch('/api/ai/chat/history?id='+encodeURIComponent(id),{cache:'no-store'});const d=await r.json();if(!r.ok)throw new Error(d.error);if(alive.current){setSaved(d);setVisibleCount(40);setScopes([]);setDraft([]);setHistoryOpen(false);}}
    catch(e){if(alive.current)setHistoryError((e as Error).message);}finally{operation.current=false;if(alive.current)setHistoryBusy(false);}
  }
  async function historyAction(action:'new'|'restore'|'delete'|'deleteAll',id?:string) {
    if(operation.current||busy)return;
    if(action==='delete'&&!confirm('Удалить этот сохранённый разговор?'))return;
    if(action==='deleteAll'&&!confirm('Удалить текущий чат и ВСЕ сохранённые разговоры со всех устройств?'))return;
    if((action==='new'||action==='restore')&&text.trim()&&!confirm('Черновик сообщения будет удалён. Продолжить?'))return;
    operation.current=true;const g=++generation.current;setBusy(true);setHistoryError('');setError('');
    try{const r=await fetch('/api/ai/chat/history',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,id})});const d=await r.json();if(!r.ok)throw new Error(d.error);if(!alive.current||g!==generation.current)return;apply(d,g);
      if(action!=='delete'||saved?.id===id)setSaved(null);
      if(action!=='delete'){setText('');setScopes([]);setDraft([]);setVisibleCount(40);setHistoryOpen(false);retry.current={text:'',access:'',id:''};}
      await loadHistory();
    }catch(e){if(alive.current){setError((e as Error).message);setHistoryError((e as Error).message);}}finally{operation.current=false;if(alive.current)setBusy(false);}
  }
  return <main className="mx-auto w-full max-w-3xl space-y-5"><header className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-3xl font-bold">ИИ-помощник</h1><p className="mt-2 text-sm text-[var(--color-fg-dim)]">Разберёмся вместе</p></div><div className="flex flex-wrap gap-4"><button className="min-h-11 text-sm underline" onClick={()=>{setHistoryOpen(true);void loadHistory();}}>История чатов</button><button disabled={busy||chat?.busy} className="min-h-11 text-sm underline disabled:opacity-50" onClick={()=>void historyAction('new')}>Новый чат</button><button disabled={!!saved} className="min-h-11 text-sm underline disabled:opacity-50" onClick={()=>void clear()}>Очистить текущий</button></div></header><p className="text-xs text-[var(--color-fg-dim)]">Сообщения отправляются в OpenAI. История сохраняется в аккаунте и видна только тебе. «Новый чат» сохраняет текущий разговор отдельно. Ответы могут содержать ошибки.</p>
    {saved&&<section className="space-y-2 rounded-2xl border border-[var(--color-border-strong)] p-4"><p className="text-xs text-[var(--color-fg-dim)]">Сохранённый разговор · {new Date(saved.savedAt).toLocaleString('ru-RU')}</p><h2 className="font-semibold break-words">{saved.title}</h2><div className="flex flex-wrap gap-4"><button disabled={busy||chat?.busy} className="min-h-11 text-sm underline disabled:opacity-50" onClick={()=>void historyAction('restore',saved.id)}>Продолжить этот разговор</button><button className="min-h-11 text-sm underline" onClick={()=>{setSaved(null);setVisibleCount(40);}}>Вернуться в текущий чат</button></div><p className="text-xs">При продолжении текущий разговор сохранится в истории. Доступ к данным нужно разрешить заново.</p></section>}
    {error&&<p role="alert" className="text-[var(--color-strength)]">{error}</p>}
    {chat&&!chat.available&&<p role="status">ИИ пока не подключён на сервере.</p>}
    {!chat&&!error&&<p role="status">Загружаем историю…</p>}
    {chat&&!saved&&!chat.messages.length&&<section className="grid gap-3 rounded-2xl bg-[var(--color-surface)] p-5"><h2 className="font-semibold">С чего начнём?</h2>{['Объясни TCP и UDP на простом примере','Помоги подготовиться к экзамену','Как распределить задачи на сегодня?'].map(s=><button key={s} className="min-h-11 rounded-xl border border-[var(--color-border-strong)] p-3 text-left text-sm" onClick={()=>setText(s)}>{s}</button>)}</section>}
    {displayed.length>visibleCount&&<button className="min-h-11 text-sm underline" onClick={()=>setVisibleCount(n=>n+40)}>Показать предыдущие сообщения</button>}
    <div className="space-y-4" aria-label="История переписки">{displayed.slice(-visibleCount).map(m=><article key={m.id} className={'rounded-2xl p-4 '+(m.role==='user'?'ml-6 bg-[var(--color-intelligence)]/20':'mr-4 bg-[var(--color-surface)]')}><p className="mb-2 text-xs font-semibold">{m.role==='user'?'Ты':'✦ ИИ-помощник'}{m.access?' · с разрешёнными данными':m.withPlan?' · с контекстом плана':''}</p><p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{m.text}</p></article>)}<div ref={bottom}/></div>
    {(busy||chat?.busy)&&<p role="status">ИИ готовит ответ…</p>}
    {!saved&&<form onSubmit={send} className="grid gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"><div className="space-y-2"><p className="font-semibold text-sm">{scopes.length?'Доступ разрешён для следующего сообщения':'Доступ к данным YeahGrind выключен'}</p><p className="text-xs text-[var(--color-fg-dim)]">{scopes.length?AI_SCOPES.filter(s=>scopes.includes(s.id)).map(s=>s.label).join(' · '):'Без разрешения ИИ видит только переписку. Выбери, какие свои данные отправить для персонального ответа.'}</p><div className="flex flex-wrap gap-3"><button type="button" disabled={busy||chat?.busy} className="min-h-11 rounded-xl border border-[var(--color-border-strong)] px-3 text-sm disabled:opacity-50" onClick={()=>{setScopes([]);setDraft([]);setPreview('');setPreviewError('');previewGeneration.current++;setAccessOpen(true);}}>Разрешить доступ к данным</button>{scopes.length>0&&<button type="button" disabled={busy||chat?.busy} className="min-h-11 text-sm underline" onClick={()=>{setScopes([]);setDraft([]);}}>Снять разрешение</button>}</div></div><textarea aria-label="Сообщение ИИ" className="w-full rounded-xl bg-[var(--color-surface-2)] p-3 text-base" rows={3} maxLength={6000} value={text} onChange={e=>setText(e.target.value)} placeholder="Спроси об учёбе или планировании…" required/><button className="min-h-11 rounded-xl bg-[var(--color-intelligence)] px-4 py-3 font-semibold text-[var(--color-bg)] disabled:opacity-50" disabled={!chat?.available||busy||chat?.busy||!text.trim()}>Отправить</button></form>}
    <Modal open={historyOpen} onClose={()=>setHistoryOpen(false)} title="История чатов">
      <div className="space-y-3"><p className="text-sm text-[var(--color-fg-dim)]">Новый разговор не стирает предыдущий. Здесь можно открыть и продолжить сохранённые чаты.</p><button className="min-h-11 text-sm underline" disabled={busy} onClick={()=>{setSaved(null);setVisibleCount(40);setHistoryOpen(false);}}>Текущий разговор</button>
      {historyBusy&&<p role="status">Загружаем…</p>}{historyError&&<p role="alert">{historyError}</p>}
      {!historyBusy&&!threads.length&&<p className="py-3 text-sm">Сохранённых разговоров пока нет. Текущая переписка уже сохраняется автоматически.</p>}
      {threads.map(t=><div key={t.id} className="flex items-start gap-2 rounded-xl border border-[var(--color-border-strong)] p-3"><button className="min-h-11 min-w-0 flex-1 text-left disabled:opacity-50" disabled={historyBusy||busy} onClick={()=>void openSaved(t.id)}><span className="block break-words font-semibold">{t.title}</span><span className="mt-1 block text-xs text-[var(--color-fg-dim)]">{new Date(t.savedAt).toLocaleDateString('ru-RU')} · {t.messageCount} сообщений</span></button><button className="min-h-11 px-2 text-sm underline" aria-label={'Удалить разговор '+t.title} disabled={busy||historyBusy} onClick={()=>void historyAction('delete',t.id)}>Удалить</button></div>)}
      <button className="min-h-11 text-sm underline text-[var(--color-strength)]" disabled={busy} onClick={()=>void historyAction('deleteAll')}>Удалить всю историю</button>
      </div>
    </Modal>
    <Modal open={accessOpen} onClose={()=>{setAccessOpen(false);previewGeneration.current++;setPreviewBusy(false);}} title="Доступ ИИ к твоему YeahGrind">
      <div className="space-y-4"><p className="text-sm">Выбранные данные будут прочитаны из твоего аккаунта и переданы OpenAI только со следующим сообщением. Доступ только на чтение: ИИ не меняет задачи и не публикует сообщения от твоего имени.</p>
      {AI_SCOPES.map(s=><label key={s.id} className="flex gap-3 rounded-xl border border-[var(--color-border-strong)] p-3"><input type="checkbox" className="mt-1 self-start" checked={draft.includes(s.id)} onChange={e=>{setDraft(old=>e.target.checked?[...old,s.id]:old.filter(id=>id!==s.id));setPreview('');setPreviewError('');previewGeneration.current++;setPreviewBusy(false);}}/><span><span className="block font-semibold">{s.label}</span><span className="mt-1 block text-xs text-[var(--color-fg-dim)]">{s.description}</span></span></label>)}
      <p className="text-xs text-[var(--color-fg-dim)]">Пароли, токены, email, чужие публикации и сообщения не включаются. Это снимок синхронизированных данных, а не полный доступ к LMS.</p>
      <button type="button" disabled={!draft.length||previewBusy} className="min-h-11 text-sm underline disabled:opacity-50" onClick={async()=>{const g=++previewGeneration.current;setPreviewBusy(true);setPreviewError('');try{const q=new URLSearchParams();draft.forEach(s=>q.append('scope',s));const r=await fetch('/api/ai/context?'+q,{cache:'no-store'});const d=await r.json();if(!r.ok)throw new Error(d.error);if(alive.current&&g===previewGeneration.current)setPreview(JSON.stringify(d.context,null,2));}catch(e){if(alive.current&&g===previewGeneration.current)setPreviewError((e as Error).message);}finally{if(alive.current&&g===previewGeneration.current)setPreviewBusy(false);}}}>{previewBusy?'Загружаем…':'Посмотреть, какие данные будут переданы'}</button>
      {previewError&&<p role="alert">{previewError}</p>}{preview&&<pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-[var(--color-surface-2)] p-3 text-xs">{preview}</pre>}
      <p className="text-xs">Разрешение сбросится после отправки. Уже отправленные данные нельзя отозвать у провайдера. При снятии разрешения ответы, основанные на этих данных, остаются видны тебе, но больше не передаются в контекст ИИ. Их можно удалить кнопкой «Очистить текущий».</p>
      <button type="button" className="min-h-12 w-full rounded-xl bg-[var(--color-intelligence)] p-3 font-semibold text-[var(--color-bg)] disabled:opacity-50" disabled={!draft.length} onClick={()=>{setScopes([...draft]);setAccessOpen(false);previewGeneration.current++;setPreviewBusy(false);}}>Разрешаю передать выбранные данные</button>
      <button type="button" className="min-h-11 w-full text-sm" onClick={()=>{setScopes([]);setAccessOpen(false);previewGeneration.current++;setPreviewBusy(false);}}>Продолжить без доступа</button>
      </div>
    </Modal>
  </main>;
}
