'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { QUESTIONS, RATINGS, RESEARCH_VERSION } from '@/lib/research';
import type { publicResearch } from '@/lib/researchDb';
import styles from './research.module.css';
type Participant = NonNullable<ReturnType<typeof publicResearch>>;
type Config = { enabled: boolean; contact: string; deleteAt: string };
export default function ResearchPage() {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [config, setConfig] = useState<Config | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [consents, setConsents] = useState([false, false, false, false]);
  const [answers, setAnswers] = useState(QUESTIONS.map(() => ''));
  const [ratings, setRatings] = useState<(number | null)[]>([null, null, null]);
  const [feedback, setFeedback] = useState('');
  const [withdraw, setWithdraw] = useState(false);
  const request = useCallback(async (body?: object) => {
    const r = await fetch('/api/research', body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : { cache: 'no-store' });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Не удалось загрузить данные');
    if (!body || !('action' in body) || body.action !== 'activity') setParticipant(data.participant);
    if (data.config) setConfig(data.config);
  }, []);
  useEffect(() => { request().catch(e => setError(e.message)); }, [request]);
  // Interaction-driven, never an idle timer: an open tab alone is not a session.
  const active = !!participant && !participant.withdrawnAt && participant.week >= 1 && participant.week <= 4;
  useEffect(() => {
    if (!active) return;
    let last = 0;
    const record = () => {
      if (document.visibilityState !== 'visible' || !document.hasFocus() || Date.now() - last < 60000) return;
      last = Date.now();
      request({ action: 'activity' }).catch(e => setError(e.message));
    };
    record();
    window.addEventListener('pointerdown', record);
    window.addEventListener('keydown', record);
    window.addEventListener('focus', record);
    return () => { window.removeEventListener('pointerdown', record); window.removeEventListener('keydown', record); window.removeEventListener('focus', record); };
  }, [active, request]);
  async function act(body: object) {
    setBusy(true); setError('');
    try { await request(body); } catch (e) { setError(e instanceof Error ? e.message : 'Не удалось сохранить'); }
    finally { setBusy(false); }
  }
  async function getFeedback() {
    setBusy(true); setError('');
    try {
      const r = await fetch('/api/research/feedback', { method: 'POST' });
      const d = await r.json(); if (!r.ok) throw new Error(d.error);
      setFeedback(d.text);
    } catch (e) { setError(e instanceof Error ? e.message : 'Обратная связь недоступна'); }
    finally { setBusy(false); }
  }
  return <main className={styles.page}>
    <Link href="/app">← YeahGrind</Link>
    <header><p className={styles.eyebrow}>ИССЛЕДОВАНИЕ · 4 НЕДЕЛИ</p><h1>Маленькие действия.<br />Ваш опыт имеет значение.</h1><p>Изучаем вовлечённость, мотивацию и выполнение задач в приложении с игровыми элементами.</p></header>
    {error && <p role="alert" className={styles.error}>{error}</p>}
    {!config && !error && <p role="status">Загружаем исследование…</p>}
    {config && !participant && <section className={styles.card}>
      <h2>Перед началом</h2><p>30 взрослых участников, две случайно назначаемые группы, четыре недели. В обеих версиях одинаковые задания, сроки и очки. В одной версии обратная связь заранее задана, в другой её формирует ИИ. Преимущество какой-либо версии заранее не предполагается.</p>
      <p>Записываем случайный код участника, группу, события взаимодействия с этой страницей, время открытия и завершения заданий в UTC. Сессия заканчивается после 30 минут без взаимодействия. Таймер задания считает полное время между открытием и завершением, включая перерывы.</p>
      <p>В версии с ИИ только коды заданий, типы и время событий передаются OpenAI (gpt-4o-mini). Имя, контакты, личные планы и ответы интервью туда не передаются. На четвёртой неделе предложим шесть письменных вопросов и три необязательные оценки.</p>
      <p>Доступ к данным имеет команда исследования. Связь: {config.contact || 'будет указана до начала набора'}. Удаление данных: {config.deleteAt || 'дата будет указана до начала набора'}. Можно отказаться без последствий; кнопка выхода удаляет события и ответы, оставляя только код, группу и отметку выхода для учёта выбывших.</p>
      <p>Для сравнимости выполняйте задания только здесь, без помощи других ИИ-разделов приложения. Не указывайте имена и другие личные сведения в интервью. Выполнение заданий подтверждаете вы сами; содержимое записей не собирается.</p>
      {['Мне исполнилось 18 лет', 'Я не участвовал(а) в разработке или тестировании этого прототипа', 'Я прочитал(а) условия и добровольно согласен(на) на участие и обработку указанных данных', 'Я согласен(на) на передачу указанных событий в OpenAI, если мне назначена версия с ИИ'].map((label, i) => <label className={styles.check} key={label}><input type="checkbox" checked={consents[i]} onChange={e => setConsents(v => v.map((x, j) => j === i ? e.target.checked : x))} />{label}</label>)}
      <button disabled={busy || !config.enabled || !consents.every(Boolean)} onClick={() => act({ action: 'enroll', version: RESEARCH_VERSION, adult: consents[0], notDeveloper: consents[1], consent: consents[2], aiConsent: consents[3] })}>Начать участие</button>
      {!config.enabled && <p>Набор пока закрыт. Команда готовит условия исследования.</p>}
    </section>}
    {participant?.withdrawnAt && <section className={styles.card}><h2>Участие прекращено</h2><p>События и ответы интервью удалены. Спасибо за уделённое время.</p></section>}
    {participant && !participant.withdrawnAt && <>
      <section className={styles.card}><div className={styles.stats}><span>Неделя {Math.min(4, participant.week)} из 4</span><strong>{participant.points} очков</strong></div><progress max={12} value={participant.tasks.filter(t => t.completed).length} /><p>Выполнено {participant.tasks.filter(t => t.completed).length} из 12 заданий · по 10 очков за каждое</p><small>Код участника: {participant.participantId}{participant.pilot ? ' · технический пилот' : ''}</small></section>
      <section className={styles.card}><h2>Обратная связь</h2><p>Можно запросить подсказку по работе с заданиями.</p><button disabled={busy || !active} onClick={getFeedback}>Получить обратную связь</button>{feedback && <p role="status">{feedback}</p>}</section>
      {[1, 2, 3, 4].map(week => <section className={styles.card} key={week}><h2>Неделя {week}</h2>{participant.tasks.filter(t => t.week === week).map(task => <article className={styles.task} key={task.id}><h3>{task.title}</h3>{task.started && <p>{task.instruction}</p>}<p>{task.completed ? 'Завершено · +10 очков' : task.started ? 'Таймер запущен; перерывы входят во время выполнения.' : week > participant.week ? 'Откроется на следующей неделе участия' : 'Откройте задание, когда готовы начать.'}</p>{!task.completed && <button disabled={busy || !active || week > participant.week} onClick={() => act({ action: task.started ? 'complete' : 'start', taskId: task.id })}>{task.started ? 'Завершить' : 'Открыть и начать'}</button>}</article>)}</section>)}
      <section className={styles.card}><h2>Ваш опыт</h2>{participant.interviewSubmitted ? <p>Ответы сохранены. Спасибо!</p> : participant.week < 4 ? <p>Интервью откроется на четвёртой неделе.</p> : <form onSubmit={e => { e.preventDefault(); act({ action: 'interview', answers, ratings }); }}><p>Опишите опыт своими словами. Не включайте имена, контакты и другие личные сведения.</p>{QUESTIONS.map((q, i) => <label className={styles.field} key={q}>{q}<textarea required maxLength={3000} value={answers[i]} onChange={e => setAnswers(v => v.map((a, j) => j === i ? e.target.value : a))} /></label>)}<p>Необязательные оценки: 1 — совсем не согласен(на), 5 — полностью согласен(на).</p>{RATINGS.map((q, i) => <label className={styles.field} key={q}>{q}<select value={ratings[i] ?? ''} onChange={e => setRatings(v => v.map((r, j) => j === i ? e.target.value ? Number(e.target.value) : null : r))}><option value="">Пропустить</option>{[1,2,3,4,5].map(n => <option key={n}>{n}</option>)}</select></label>)}<button disabled={busy}>Отправить ответы</button></form>}</section>
      <section className={styles.card}><h2>Участие добровольное</h2><p>Вы можете прекратить участие и удалить события и ответы. Повторное вступление с этим аккаунтом недоступно.</p>{withdraw ? <><button disabled={busy} onClick={() => act({ action: 'withdraw' })}>Подтверждаю выход и удаление данных</button> <button onClick={() => setWithdraw(false)}>Отмена</button></> : <button onClick={() => setWithdraw(true)}>Прекратить участие…</button>}</section>
    </>}
  </main>;
}
