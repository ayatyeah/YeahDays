'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { MAIN_APP_CONSENT, QUESTIONS, RATINGS, RESEARCH_VERSION, DAY } from '@/lib/research';
import type { publicResearch } from '@/lib/researchDb';
import type { TabKey } from '@/lib/nav';
import { signOut } from '@/lib/signOut';
import DataControls from '@/components/DataControls';
import s from './study.module.css';

type Participant = NonNullable<ReturnType<typeof publicResearch>>;
type Config = { enabled: boolean; contact: string; deleteAt: string };
const tabs = [
  { id: 'home', href: '/rmt', label: 'Главная', icon: '◈' },
  { id: 'today', href: '/rmt/tasks', label: 'Задания', icon: '✓' },
  { id: 'calendar', href: '/rmt/calendar', label: 'Календарь', icon: '▦' },
  { id: 'progress', href: '/rmt/progress', label: 'Прогресс', icon: '↗' },
  { id: 'account', href: '/rmt/account', label: 'Профиль', icon: '○' },
];
const date = (value: string | number | Date) => new Date(value).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', timeZone: 'Asia/Almaty' });
const minutes = (seconds: number | null) => seconds === null ? '—' : seconds < 60 ? `${Math.round(seconds)} с` : `${Math.round(seconds / 60)} мин`;

export default function StudyApp({ view }: { view: TabKey }) {
  const { data: session } = useSession();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [consents, setConsents] = useState([false, false, false, false]);
  const [answers, setAnswers] = useState(QUESTIONS.map(() => ''));
  const [ratings, setRatings] = useState<(number | null)[]>([null, null, null]);
  const [feedback, setFeedback] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [withdraw, setWithdraw] = useState(false);
  const [now, setNow] = useState(Date.now());
  const request = useCallback(async (body?: Record<string, unknown>) => {
    const response = await fetch('/api/research', body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : { cache: 'no-store' });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Не удалось загрузить данные');
    if (body?.action !== 'activity') setParticipant(result.participant);
    if (result.config) setConfig(result.config);
    return result;
  }, []);
  useEffect(() => { request().catch(e => setError(e.message)).finally(() => setLoading(false)); }, [request]);
  const active = !!participant && !participant.withdrawnAt && !participant.needsAppConsent && participant.week >= 1 && participant.week <= 4;
  useEffect(() => {
    if (!active) return;
    let last = 0;
    const record = () => {
      if (document.visibilityState !== 'visible' || !document.hasFocus() || Date.now() - last < 60000) return;
      last = Date.now(); request({ action: 'activity' }).catch(e => setError(e.message));
    };
    record();
    for (const event of ['pointerdown', 'keydown', 'focus', 'scroll']) window.addEventListener(event, record, { passive: true });
    return () => { for (const event of ['pointerdown', 'keydown', 'focus', 'scroll']) window.removeEventListener(event, record); };
  }, [active, request]);
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  async function getFeedback() {
    setFeedbackError('');
    try {
      const response = await fetch('/api/research/feedback', { method: 'POST' });
      const result = await response.json(); if (!response.ok) throw new Error(result.error);
      setFeedback(result.text);
    } catch (e) { setFeedbackError(e instanceof Error ? e.message : 'Обратная связь недоступна'); }
  }
  async function act(body: Record<string, unknown>) {
    setBusy(true); setError('');
    try { await request(body); if (body.action === 'complete') await getFeedback(); }
    catch (e) { setError(e instanceof Error ? e.message : 'Не удалось сохранить'); }
    finally { setBusy(false); }
  }
  const completed = participant?.tasks.filter(t => t.completed).length ?? 0;
  const week = Math.min(4, participant?.week ?? 1);
  const available = participant?.tasks.filter(t => t.week <= week && !t.completed) ?? [];
  const next = available.find(t => t.started) ?? available[0];
  const allowed = participant && !participant.withdrawnAt && !participant.needsAppConsent;
  const taskCard = (task: Participant['tasks'][number]) => <article className={`${s.task} ${task.completed ? s.done : ''}`} key={task.id}>
    <div className={s.taskIcon} aria-hidden>{task.completed ? '✓' : task.id.endsWith('focus') ? '◷' : task.id.endsWith('review') ? '↗' : '≡'}</div>
    <div className={s.taskBody}><div className={s.taskMeta}>НЕДЕЛЯ {task.week} <span>+10 очков</span></div><h3>{task.title}</h3>
      {task.started ? <p>{task.instruction}</p> : <p>Откройте задание, когда будете готовы начать.</p>}
      {task.completed ? <span className={s.tag}>Завершено · +10 очков</span> : <>
        {task.startedAt && <p className={s.timing}>Прошло {minutes(Math.max(0, (now - Date.parse(task.startedAt)) / 1000))}. Перерывы входят во время.</p>}
        <button disabled={busy || !active || task.week > week} onClick={() => act({ action: task.started ? 'complete' : 'start', taskId: task.id })}>{task.started ? 'Завершить' : 'Открыть и начать'} <span aria-hidden>→</span></button>
      </>}
    </div>
  </article>;
  const feedbackCard = <section className={`${s.card} ${s.feedback}`}><div className={s.eyebrow}>ОБРАТНАЯ СВЯЗЬ</div><h2>Поддержка на следующем шаге</h2><p>{feedback || 'Получите обратную связь, прежде чем продолжить. После завершения задания она появится здесь автоматически.'}</p><button className={s.secondary} disabled={busy || !active} onClick={async () => { setBusy(true); await getFeedback(); setBusy(false); }}>Получить обратную связь <span aria-hidden>↗</span></button>{feedbackError && <p role="alert" className={s.error}>{feedbackError}</p>}</section>;
  return <div className={s.frame} data-study-app>
    <aside className={s.sidebar}><Link href="/rmt" className={s.brand}><span className={s.brandMark}>Y</span>YeahGrind<span className={s.brandDot}>●</span></Link><p className={s.sideCaption}>Маленькие шаги. Видимый прогресс.</p><nav aria-label="Основная навигация">{tabs.map(tab => <Link key={tab.id} href={tab.href} aria-current={view === tab.id ? 'page' : undefined}><span aria-hidden>{tab.icon}</span>{tab.label}{tab.id === 'today' && !!available.length && <small>{available.length}</small>}</Link>)}</nav><div className={s.sideBottom}><Link href="/">← Сменить версию</Link><span className={s.eyebrow}>ВАШ МАРШРУТ</span><strong>4 недели действий</strong><p>Один понятный шаг за раз.</p><Link href="/rmt-privacy">Как мы используем данные ↗</Link></div></aside>
    <div className={s.workspace}>
      <header className={s.topbar}><Link href="/rmt" className={s.mobileBrand}>YeahGrind<span>●</span></Link><Link href="/" className={s.breadcrumb}>Сменить версию</Link><span className={s.breadcrumb}>{tabs.find(t => t.id === view)?.label}</span><div className={s.topRight}>{participant && !participant.withdrawnAt && <span className={s.tag}>Неделя {week} / 4</span>}<Link href="/rmt/account" className={s.avatar} aria-label="Открыть профиль">{session?.user?.name?.slice(0, 1).toUpperCase() || 'Y'}</Link></div></header>
      <main className={s.main}>
        {error && <div role="alert" className={s.error}>{error}{!config && <button onClick={() => { setError(''); setLoading(true); request().catch(e => setError(e.message)).finally(() => setLoading(false)); }}>Повторить</button>}</div>}
        {loading && <section className={s.card} role="status">Загружаем ваш день…</section>}
        {!loading && config && (!participant || participant.needsAppConsent) && !participant?.withdrawnAt && <>
          <div className={s.pageTitle}><span className={s.eyebrow}>ДОБРО ПОЖАЛОВАТЬ В YEAHGRIND</span><h1>Начните с одного<br />небольшого действия.</h1><p>Задания, обратная связь и ваш прогресс — в одном месте.</p></div>
          <section className={s.card}><span className={s.eyebrow}>ПЕРЕД НАЧАЛОМ</span><h2>{participant ? 'Приложение обновилось' : 'Четыре недели, чтобы попробовать'}</h2>
            {participant && <p>Задания теперь встроены в основной сайт. Ваша группа, дата начала и выполненные задания сохраняются. Подтвердите обновлённые условия, чтобы продолжить.</p>}
            <p>Мы изучаем опыт использования приложения с игровыми элементами. 30 совершеннолетних участников случайно распределяются между двумя версиями: с заранее заданной обратной связью и с обратной связью от ИИ. Задания, сроки, очки и интерфейс одинаковы. Преимущество какой-либо версии заранее не предполагается.</p>
            <div className={s.consentFacts}><div><strong>12 заданий</strong><span>по три на каждую неделю</span></div><div><strong>10 очков</strong><span>за каждое завершение</span></div><div><strong>Ваш выбор</strong><span>можно выйти в любое время</span></div></div>
            <details><summary>Какие данные собираются и как их удалить</summary><p>Сохраняем случайный код, группу, время взаимодействия с основными разделами сайта, открытия и завершения заданий в UTC. Сессия заканчивается после 30 минут без взаимодействия. Время задания включает перерывы. Выполнение подтверждаете вы сами; записи на бумаге и личное содержание заданий не собираются.</p><p>Если назначена версия с ИИ, OpenAI (gpt-4o-mini) получает только типы и время событий и коды заданий. Имена, контакты и интервью туда не передаются. В конце — шесть письменных вопросов и три необязательные оценки. Доступ к данным имеет команда исследования. Контакт: {config.contact || 'будет указан до набора'}. Удаление данных: {config.deleteAt ? date(config.deleteAt) : 'будет указано до набора'}.</p><p>Выход в профиле удаляет события и интервью, оставляя код, группу и отметку выхода для учёта выбывших до срока удаления. Удаление аккаунта удаляет и эту отметку. Участие добровольное. Чаты и персональные рекомендации обычной версии здесь не используются. Переключение на обычную версию отмечается в данных исследования как смешанное использование; оно не меняет вашу группу A/B.</p></details>
            {['Мне исполнилось 18 лет', 'Я не участвовал(а) в разработке или тестировании прототипа', 'Я прочитал(а) условия и добровольно согласен(на) на участие и сбор указанных данных в основных разделах сайта', 'Я согласен(на) на передачу указанных событий в OpenAI, если мне назначена версия с ИИ'].map((label, i) => <label className={s.check} key={label}><input type="checkbox" checked={consents[i]} onChange={e => setConsents(v => v.map((x, j) => j === i ? e.target.checked : x))} /><span>{label}</span></label>)}
            <button disabled={busy || (!participant && !config.enabled) || !consents.every(Boolean)} onClick={() => act({ action: participant ? 'consent' : 'enroll', version: RESEARCH_VERSION, appVersion: MAIN_APP_CONSENT, adult: consents[0], notDeveloper: consents[1], consent: consents[2], aiConsent: consents[3] })}>{participant ? 'Подтвердить и продолжить' : 'Начать участие'} →</button>
            {!participant && !config.enabled && <p>Набор пока закрыт.</p>}<p><button className={s.textButton} onClick={() => signOut({ callbackUrl: '/' })}>Не участвовать и выйти</button></p>
          </section>
        </>}
        {participant?.withdrawnAt && <section className={s.card}><h1>Спасибо за ваше время</h1><p>Участие прекращено. События и ответы интервью удалены. Повторное вступление с этим аккаунтом недоступно.</p><Link href="/rmt/account">Управление аккаунтом →</Link></section>}
        {allowed && <>
          {view === 'home' && <>
            <div className={s.pageTitle}><span className={s.eyebrow}>{date(now)} · ВАШ ДЕНЬ</span><h1>{active ? 'Хороший день начинается\nс маленького шага.' : 'Четыре недели позади.'}</h1><p>{active ? 'Не нужно делать всё сразу. Выберите одно задание и начните.' : 'Посмотрите свой прогресс и поделитесь опытом в итоговом интервью.'}</p></div>
            <div className={s.stats}><div><span>Выполнено</span><strong>{completed}<small> / 12</small></strong></div><div><span>Ваши очки</span><strong>{participant.points}<small> XP</small></strong></div><div><span>Маршрут</span><strong>{week}<small> / 4 недели</small></strong></div></div>
            <div className={s.columns}><section><div className={s.sectionHead}><h2>Следующий шаг</h2><Link href="/rmt/tasks">Все задания ↗</Link></div>{next && active ? taskCard(next) : <div className={s.card}><span className={s.largeCheck}>✓</span><h2>{completed === 12 ? 'Все задания завершены' : active ? 'На этой неделе всё готово' : 'Период заданий завершён'}</h2><p>{active ? 'Посмотрите маршрут следующих недель в календаре.' : 'Ваши результаты сохранены.'}</p><Link href={active ? '/rmt/calendar' : '/rmt/progress'}>{active ? 'Открыть календарь' : 'Перейти к итогам'} →</Link></div>}</section>{feedbackCard}</div>
            <section className={s.card}><div className={s.sectionHead}><h2>Ваш маршрут</h2><span>{Math.round(completed / 12 * 100)}%</span></div><progress max={12} value={completed} aria-label="Общий прогресс"/><div className={s.route}>{[1,2,3,4].map(w => <Link key={w} href="/rmt/calendar" className={w === week ? s.currentWeek : ''}><span>0{w}</span><strong>Неделя {w}</strong><small>{participant.tasks.filter(t => t.week === w && t.completed).length} из 3 завершено</small></Link>)}</div></section>
          </>}
          {view === 'today' && <><div className={s.pageTitle}><span className={s.eyebrow}>ОДНО ЗА ДРУГИМ</span><h1>Ваши задания</h1><p>Три задания каждую неделю. За каждое завершение — 10 очков.</p></div><div className={s.columns}><div>{[1,2,3,4].filter(w => w <= week).map(w => <section key={w}><div className={s.sectionHead}><h2>Неделя {w}</h2><span>{participant.tasks.filter(t => t.week === w && t.completed).length} / 3</span></div>{participant.tasks.filter(t => t.week === w).map(taskCard)}</section>)}</div><div>{feedbackCard}<section className={s.card}><h3>Начинайте, когда готовы</h3><p>Таймер включится после открытия задания. Отмечайте завершение только после выполнения инструкции. Перерывы учитываются.</p></section></div></div></>}
          {view === 'calendar' && <><div className={s.pageTitle}><span className={s.eyebrow}>ПОНЯТНЫЙ ПЛАН</span><h1>Ваши четыре недели</h1><p>Задания открываются по неделям. У всех участников один и тот же маршрут.</p></div><div className={s.calendar}>{[1,2,3,4].map(w => { const begins = new Date(participant.enrolledAt).getTime() + (w - 1) * 7 * DAY; return <section className={`${s.card} ${w === week ? s.currentCard : ''}`} key={w}><div className={s.sectionHead}><span className={s.weekNumber}>0{w}</span><span className={s.tag}>{w > week ? 'Скоро' : w === week && active ? 'Сейчас' : 'Открыта'}</span></div><h2>Неделя {w}</h2><p>{date(begins)} — {date(begins + 7 * DAY - 1)}</p><ul className={s.taskList}>{participant.tasks.filter(t => t.week === w).map(t => <li key={t.id}><span aria-hidden>{t.completed ? '✓' : '○'}</span>{t.title}</li>)}</ul>{w === 4 && <p className={s.note}>+ итоговое интервью о вашем опыте</p>}<Link href={w <= week ? '/rmt/tasks' : '/rmt'}>{w <= week ? 'Перейти к заданиям' : 'Вернуться на главную'} →</Link></section>; })}</div></>}
          {view === 'progress' && <><div className={s.pageTitle}><span className={s.eyebrow}>КАЖДЫЙ ШАГ СЧИТАЕТСЯ</span><h1>Ваш прогресс</h1><p>Ваши собственные результаты. Без рейтинга и сравнения с другими.</p></div><div className={s.stats}><div><span>Очки</span><strong>{participant.points}</strong></div><div><span>Завершено из доступных</span><strong>{completed}<small> / {participant.summary.assigned}</small></strong></div><div><span>Сессии</span><strong>{participant.summary.sessions}</strong></div></div><section className={s.card}><h2>Достижения</h2><div className={s.badges}>{[{n:1,title:'Первый шаг',icon:'✦'}, {n:3,title:'Три действия',icon:'✧'}, {n:6,title:'Половина пути',icon:'◈'}, {n:12,title:'Полный маршрут',icon:'★'}].map(b => <div key={b.n} className={completed >= b.n ? s.earned : ''}><span aria-hidden>{b.icon}</span><strong>{b.title}</strong><small>{completed >= b.n ? 'Открыто' : `${b.n} завершений`}</small></div>)}</div></section><section className={s.card}><h2>По неделям</h2><div className={s.weekStats}>{participant.weeks.map(w => <div key={w.week}><span>Неделя {w.week}</span><progress max={3} value={w.completed} aria-label={`Завершения за неделю ${w.week}`}/><strong>{w.observed ? `${w.completed} / 3` : 'Скоро'}</strong></div>)}</div><p className={s.note}>Медианное время задания: {minutes(participant.summary.median_task_seconds)}. Включает перерывы. Неполные недели не считаются завершёнными.</p></section>
            <section className={s.card}><span className={s.eyebrow}>ВАШ ОПЫТ</span><h2>Что было полезно для вас?</h2>{participant.interviewSubmitted ? <p role="status">Ответы сохранены. Спасибо!</p> : participant.week < 4 ? <p>Шесть коротких вопросов появятся на четвёртой неделе. Здесь можно будет рассказать о том, что помогало и что хотелось бы изменить.</p> : <form onSubmit={e => { e.preventDefault(); act({ action: 'interview', answers, ratings }); }}><p>Пишите своими словами, без имён и контактных данных.</p>{QUESTIONS.map((q,i) => <label className={s.field} key={q}>{i+1}. {q}<textarea required maxLength={3000} value={answers[i]} onChange={e => setAnswers(v => v.map((a,j) => j===i ? e.target.value : a))}/></label>)}<p>Необязательно: 1 — совсем не согласен(на), 5 — полностью согласен(на).</p>{RATINGS.map((q,i) => <label className={s.field} key={q}>{q}<select value={ratings[i] ?? ''} onChange={e => setRatings(v => v.map((r,j) => j===i ? e.target.value ? Number(e.target.value) : null : r))}><option value="">Пропустить</option>{[1,2,3,4,5].map(n => <option key={n}>{n}</option>)}</select></label>)}<button disabled={busy}>Отправить ответы →</button></form>}</section>
          </>}
        </>}
        {view === 'account' && <><div className={s.pageTitle}><span className={s.eyebrow}>ВЫ УПРАВЛЯЕТЕ УЧАСТИЕМ</span><h1>Ваш профиль</h1><p>{session?.user?.name || 'Аккаунт YeahGrind'}</p></div><section className={s.card}><h2>Данные и участие</h2>{participant && <><p className={s.identifier}>Код участника: {participant.participantId}</p><p>Начало: {date(participant.enrolledAt)} · {participant.pilot ? 'технический пилот' : 'четыре недели'}</p></>}<p>Связь с командой: {config?.contact || 'balmagambet.ayat@gmail.com'}</p><p>Удаление исследовательских данных: {config?.deleteAt ? date(config.deleteAt) : 'указывается в условиях участия'}.</p><Link href="/rmt-privacy">Политика конфиденциальности ↗</Link></section><section className={s.card}><h2>Ваши данные</h2><DataControls/></section>{participant && !participant.withdrawnAt && <section className={s.card}><h2>Прекратить участие</h2><p>Можно выйти в любой момент. События и интервью будут удалены; повторное вступление недоступно.</p>{withdraw ? <><button disabled={busy} onClick={() => act({action:'withdraw'})}>Подтверждаю выход и удаление данных</button><button className={s.textButton} onClick={() => setWithdraw(false)}>Отмена</button></> : <button className={s.secondary} onClick={() => setWithdraw(true)}>Прекратить участие…</button>}</section>}<button className={s.secondary} onClick={() => signOut({callbackUrl:'/'})}>Выйти из аккаунта</button></>}
      </main>
      <footer className={s.footer}><Link href="/">Сменить версию</Link><span>YeahGrind · маленькие действия каждый день</span><Link href="/rmt-terms">Условия</Link><Link href="/rmt-privacy">Приватность</Link></footer>
    </div>
    <nav className={s.mobileNav} aria-label="Мобильная навигация">{tabs.map(t => <Link href={t.href} key={t.id} aria-current={view===t.id ? 'page' : undefined}><span aria-hidden>{t.icon}</span>{t.label}</Link>)}</nav>
  </div>;
}
