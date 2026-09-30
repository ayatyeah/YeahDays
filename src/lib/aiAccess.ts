import type { ChatMessage } from './aiChat';
export const AI_ACCESS_VERSION = '2026-09-30-v1';
export const AI_SCOPES = [
  { id: 'plan', label: 'План и расписание', description: 'До 40 задач, 20 действий, 7 дней расписания и состояние подключения LMS. Без заметок и секретной ссылки.' },
  { id: 'learning', label: 'Учёба', description: 'До 15 учебных целей, названия предметов и статусы квестов. Без ответов, приложенных материалов и переписок.' },
  { id: 'progress', label: 'Прогресс', description: 'Количество выполненных задач, учебный XP, монеты и до 7 дней добровольно включённой статистики.' },
  { id: 'profile', label: 'Мои цели и профиль', description: 'Имя, выбранные приоритеты, собственные предметы и цели из профиля сообщества.' },
] as const;
export type AiScope = typeof AI_SCOPES[number]['id'];
export function parseScopes(value: unknown): AiScope[] {
  if (!Array.isArray(value) || value.length > AI_SCOPES.length || value.some(x => !AI_SCOPES.some(s => s.id === x)) || new Set(value).size !== value.length) throw new Error('consent');
  return value as AiScope[];
}
export function requestScopes(body: Record<string, any>): AiScope[] {
  if (body.withPlan === true) throw new Error('consent'); // Older clients must use the new explicit consent screen.
  if (body.consent === undefined || body.consent === null) return [];
  if (body.consent.version !== AI_ACCESS_VERSION || body.consent.accepted !== true) throw new Error('consent');
  const scopes = parseScopes(body.consent.scopes); if (!scopes.length) throw new Error('consent'); return scopes;
}
// Prior answers can quote private context. Once permission narrows, drop that turn
// and every subsequent turn from model history (they may also quote it).
export function permittedHistory(history: ChatMessage[], scopes: AiScope[]) {
  const firstRestricted = history.findIndex(m => (m.access?.scopes ?? (m.withPlan ? ['plan'] : [])).some(s => !scopes.includes(s as AiScope)));
  return firstRestricted < 0 ? history : history.slice(0, firstRestricted);
}
const text = (value: unknown, max = 200) => typeof value === 'string' ? value.slice(0,max) : undefined;
const number = (value: unknown) => typeof value === 'number' && Number.isFinite(value) ? value : undefined;
const list = (value: unknown): any[] => Array.isArray(value) ? value.filter(v => v !== null && v !== undefined) : [];
const object = (value: any) => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
export function projectContext(scopes: AiScope[], rows: { state?: any; learning?: any; activity?: any; profile?: any; lms?: any; name?: string|null }, now = new Date()) {
  const state=object(rows.state), learning=object(rows.learning), profile=object(rows.profile);
  const todos=list(state.todos); const skills=list(learning.skills);
  const context: Record<string, unknown> = { asOf: now.toISOString(), scopes, coverage: 'Ограниченный снимок синхронизированных данных YeahGrind. Не полный доступ к Moodle или аккаунту; можно только читать.' };
  if(scopes.includes('plan')) {
    const today = now.toISOString().slice(0,10);
    const selected = [...todos].filter(t=>t&&typeof t==='object'&&!t.done).sort((a,b)=>String(a.date||'9999').localeCompare(String(b.date||'9999'))).slice(0,40);
    context.plan={tasks:selected.map(t=>({title:text(t.title),date:text(t.date,10),hour:number(t.hour),minute:number(t.minute),duration:number(t.duration),priority:text(t.priority,20),source:text(t.source,20),repeat:t.repeat?{kind:text(t.repeat.kind,20),weekday:number(t.repeat.weekday)}:null,doneDays:list(t.doneDays).slice(-30).map(d=>text(d,10)),skipDays:list(t.skipDays).slice(-30).map(d=>text(d,10))})),
      actions:list(state.plan).filter(t=>t&&typeof t==='object'&&!t.completed).slice(-20).map(t=>({title:text(t.snapshot?.title||t.title),date:text(t.date,10),duration:number(t.snapshot?.duration||t.duration)})),
      schedule:Object.entries(object(state.schedule)).filter(([day])=>day>=today&&/^\d{4}-\d{2}-\d{2}$/.test(day)).sort(([a],[b])=>a.localeCompare(b)).slice(0,7).map(([date,slots])=>({date,slots:Object.entries(object(slots)).slice(0,24).map(([hour,value])=>({hour:text(hour,5),title:text(value)}))})),
      lms:{connected:!!rows.lms,lastSyncedAt:rows.lms?.lastSyncedAt??null,timezone:text(rows.lms?.timezone,80)}};
  }
  if(scopes.includes('learning'))context.learning=skills.slice(0,15).map(s=>({title:text(s.title),goal:text(s.goal,300),subject:text(s.subject?.name),quests:list(s.quests).slice(0,10).map(q=>({title:text(q.title),completed:q.completed===true}))}));
  if(scopes.includes('profile'))context.profile={name:text(rows.name,80),priorities:Object.fromEntries(['strength','intelligence','wealth','stability','health'].map(k=>[k,number(state.goals?.[k])])),goalsWithDeadlines:list(state.quests).slice(0,20).map(q=>({title:text(q.title),target:number(q.target),deadline:text(q.deadline,10)})),bio:text(profile.bio,500),subjects:list(profile.subjects).slice(0,8).map(s=>text(s,120)),goals:list(profile.goals).slice(0,8).map(s=>text(s,120))};
  if(scopes.includes('progress'))context.progress={completedTasks:todos.filter(t=>t?.done===true).length,completedActions:list(state.plan).filter(t=>t?.completed===true).length,learningXp:number(learning.xp),coins:number(learning.coins),completedQuests:skills.reduce((n,s)=>n+list(s.quests).filter(q=>q?.completed===true).length,0),activity:rows.activity?.enabled===true?Object.entries(object(rows.activity.days)).sort(([a],[b])=>b.localeCompare(a)).slice(0,7).map(([day,value])=>{const v=object(value);return {day,seconds:number(v.seconds),tasks:number(v.tasks),quests:number(v.quests)};}):null};
  return context;
}
