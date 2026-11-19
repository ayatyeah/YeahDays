'use client';

import { useEffect, useRef, useState } from 'react';
import { studyTopics, studyMinutes, studyTiming, topicForQuestion } from '@/lib/events/awsStudy/topics';
import { studyQuestions, studyExplanations, studyCounts, studyPracticeSet, courseStorage, type StudyPractice } from '@/lib/events/awsStudy/bank';
import { parseAwsAnswers, type AwsAnswers } from '@/lib/events/awsCloudDeveloping/progress';
import { dayBlocks } from '@/lib/events/awsCloudDeveloping/oneDay';
import { matchesAnswer } from '@/lib/events/quizAnswers';
import EventQuiz from './EventQuiz';
import styles from './aws-one-day.module.css';
import navigation from './aws-knowledge-checks.module.css';

type SelfChecks = Record<string, 'repeat' | 'understood'>;
export default function AwsStudyDay({ userId, notesOnly = false }: { userId: string; notesOnly?: boolean }) {
  const [active, setActive] = useState('plan');
  const [answers, setAnswers] = useState<AwsAnswers>({});
  const [checks, setChecks] = useState<SelfChecks>({});
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [queue, setQueue] = useState<typeof studyQuestions>([]);
  const [result, setResult] = useState<number[][] | null>(null);
  const [run, setRun] = useState(0);
  const [music, setMusic] = useState(false);
  const [query, setQuery] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const checkKey = `yg-aws-one-day-v2:${userId}`;
  useEffect(() => {
    const sync = () => {
      const id = window.location.hash.split('/')[1];
      setQueue([]); setResult(null); setMenuOpen(false); setQuery('');
      setActive(studyTopics.some(t => t.id === id) ? id! : 'plan');
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);
  useEffect(() => {
    try {
      setAnswers(Object.assign({}, ...Object.values(courseStorage).map(key => parseAwsAnswers(localStorage.getItem(`${key}:${userId}`), studyCounts))));
      const raw = JSON.parse(localStorage.getItem(checkKey) || '{}');
      setChecks(Object.fromEntries(studyTopics.filter(t => raw?.[t.id] === 'repeat' || raw?.[t.id] === 'understood').map(t => [t.id, raw[t.id]])));
    } catch { setError(true); }
    setReady(true);
  }, [userId, checkKey]);
  useEffect(() => { if (ready) heading.current?.focus({ preventScroll: true }); }, [active, queue.length, result, ready]);
  function save(id: string, value: number[]) {
    setAnswers(previous => ({ ...previous, [id]: value }));
    const key = `${courseStorage[id.startsWith('aws-found-') ? 'foundations' : 'developing']}:${userId}`;
    try {
      const current = parseAwsAnswers(localStorage.getItem(key), studyCounts);
      localStorage.setItem(key, JSON.stringify({ ...current, [id]: value }));
      setError(false);
    } catch { setError(true); }
  }
  function mark(value: 'repeat' | 'understood') {
    const next = { ...checks, [active]: value };
    setChecks(next);
    try { localStorage.setItem(checkKey, JSON.stringify(next)); setError(false); } catch { setError(true); }
  }
  function navigate(id: string) {
    setQueue([]); setResult(null); setMenuOpen(false); setQuery(''); setActive(id);
    window.location.hash = `${notesOnly ? 'aws-notes' : 'one-day'}${id === 'plan' ? '' : `/${id}`}`;
  }
  function start(ids: string[], kind: StudyPractice) {
    const items = studyPracticeSet(answers, ids, kind);
    if (!items.length) return;
    setQueue(items); setResult(null); setRun(n => n + 1); setMenuOpen(false);
  }
  const topic = studyTopics.find(t => t.id === active);
  const items = topic ? studyPracticeSet(answers, [topic.id], 'all') : [];
  const mistakes = studyPracticeSet(answers, [], 'mistakes');
  const unseen = studyPracticeSet(answers, [], 'unanswered');
  const deep = topic?.course === 'developing' ? dayBlocks.find(b => `dev-${b.id}` === topic.id) : undefined;
  const understood = studyTopics.filter(t => checks[t.id] === 'understood').length;
  const missed = result ? queue.filter((q, i) => !matchesAnswer(result[i], q.answers)) : [];
  const filtered = items.filter(q => `${q.prompt} ${q.options.join(' ')} ${studyExplanations[q.id].summary}`.toLowerCase().includes(query.toLowerCase().trim()));
  return <div className={navigation.layout} data-no-i18n lang="ru">
    <aside className={navigation.sidebar}>
      <button className={navigation.mobileToggle} aria-expanded={menuOpen} aria-controls="aws-study-topics" onClick={() => setMenuOpen(v => !v)}>Темы подготовки · 11 <span>{menuOpen ? '−' : '+'}</span></button>
      <nav id="aws-study-topics" className={`${navigation.navigation} ${menuOpen ? navigation.open : ''}`} aria-label="Конспекты и план подготовки">
        <button aria-current={active === 'plan' ? 'page' : undefined} onClick={() => navigate('plan')}>{notesOnly ? 'Все конспекты' : 'План на 1 день'}</button>
        {(['foundations', 'developing'] as const).map(course => <div key={course}><p className={navigation.navHeading}>Cloud {course === 'foundations' ? 'Foundations · 100' : 'Developing · 120'}</p>{studyTopics.filter(t => t.course === course).map(t => <button key={t.id} aria-current={active === t.id ? 'page' : undefined} onClick={() => navigate(t.id)}><span>{t.title}<small>{studyPracticeSet(answers, [t.id], 'all').filter(q => matchesAnswer(answers[q.id], q.answers)).length} / 20 верно{checks[t.id] === 'understood' ? ' · понял' : checks[t.id] === 'repeat' ? ' · повторить' : ''}</small></span></button>)}</div>)}
      </nav>
    </aside>
    <div className={`${navigation.content} ${styles.workspace}`}>
      {error && <p role="alert">Не удалось прочитать или сохранить прогресс в браузере. Текущую работу можно продолжить, но после закрытия она может потеряться.</p>}
      {queue.length > 0 ? result ? <section className="g-note-paper">
        <h2 ref={heading} tabIndex={-1}>Закрепление завершено</h2><p>{queue.length - missed.length} / {queue.length} верно · {Math.round((queue.length - missed.length) / queue.length * 100)}%</p>
        <div className={styles.actions}><button className="f-button" onClick={() => { setQueue([]); setResult(null); }}>← Вернуться к конспекту</button>{missed.length > 0 && <button className="f-button f-button-outline" onClick={() => { setQueue(missed); setResult(null); setRun(n => n + 1); }}>Повторить ошибки · {missed.length}</button>}</div>
        <p>Разбери причину ошибки, затем попробуй снова без подсказок.</p>{missed.map(q => <article className={styles.concept} key={q.id}><h3 lang="en">{q.prompt}</h3><p>{studyExplanations[q.id].summary}</p><button className="f-button f-button-outline" onClick={() => navigate(topicForQuestion(q).id)}>Конспект: {topicForQuestion(q).title}</button></article>)}
      </section> : <EventQuiz key={run} eventId="cloud-computing-final" step={{ title: { ru: `Закрепление · ${queue.length} вопросов`, en: `Practice · ${queue.length} questions` } }}
        quiz={queue.map(q => ({ id: q.id, q: q.prompt, options: q.options, correct: q.answers, why: { ru: studyExplanations[q.id].summary, en: q.explanation }, optionExplanations: studyExplanations[q.id].options, caution: q.caution, studyLink: { href: `/events/cloud-computing-final#aws-notes/${topicForQuestion(q).id}`, title: topicForQuestion(q).title } }))}
        lang="ru" explainOptionsOpen music={music} onMusic={() => setMusic(v => !v)} onAnswer={save} onExit={() => setQueue([])} onFinish={setResult}/>
      : topic ? <article className="g-note-paper">
        <button className="f-button f-button-outline" onClick={() => navigate('plan')}>← {notesOnly ? 'Все конспекты' : 'План дня'}</button>
        <p className="f-section-kicker">Cloud {topic.course === 'foundations' ? 'Foundations' : 'Developing'} · модули {topic.modules.join(' + ')} · 20 вопросов</p>
        <h2 ref={heading} tabIndex={-1}>{topic.title}</h2><p><strong>Цель:</strong> {topic.goal}</p>
        <p>Порядок: прочитай принципы → объясни их без текста → пройди тест → открой разборы вопросов, где ошибся или угадал.</p>
        {topic.concepts.map(c => <section className={styles.concept} key={c.title}><h3>{c.title}</h3><p>{c.text}</p></section>)}
        {deep && <><h3>Различай альтернативы</h3>{deep.contrasts.map(c => <p key={c.left}><strong>{c.left} / {c.right}:</strong> {c.rule}</p>)}<section className={styles.case}><h3>Кейс: рассуждаем по шагам</h3><p>{deep.case.task}</p><ol>{deep.case.reasoning.map(s => <li key={s}>{s}</li>)}</ol></section>{deep.transfer.map(t => <details key={t.question}><summary>{t.question}</summary><p>{t.answer}</p></details>)}</>}
        <details><summary>Источники и уточнения AWS</summary><ul><li><a href={`https://awsacademy.instructure.com/courses/${topic.course === 'foundations' ? '188512' : '193042'}/modules`} target="_blank" rel="noreferrer">Исходный курс AWS Academy</a></li>{deep && <li><a href={deep.source.url} target="_blank" rel="noreferrer">{deep.source.title}</a></li>}{topic.id === 'network-compute' && <li><a href="https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html" target="_blank" rel="noreferrer">Network ACL и security groups</a></li>}{topic.id === 'storage-databases' && <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/multi-az-db-clusters-concepts.html" target="_blank" rel="noreferrer">RDS: особенности Multi-AZ DB clusters</a></li>}{topic.id === 'architecture-monitoring' && <li><a href="https://wa.aws.amazon.com/index.en.html" target="_blank" rel="noreferrer">AWS Well-Architected Framework</a></li>}</ul></details><h3>Проверь понимание без подсказок</h3><ul className={styles.recall}>{topic.recall.map(r => <li key={r}>{r}</li>)}</ul>
        <div className={styles.actions}><button className="f-button" disabled={!ready} onClick={() => start([topic.id], 'all')}>Закрепить тему · 20 вопросов</button><button className="f-button f-button-outline" disabled={!ready || !studyPracticeSet(answers, [topic.id], 'unanswered').length} onClick={() => start([topic.id], 'unanswered')}>Оставшиеся · {studyPracticeSet(answers, [topic.id], 'unanswered').length}</button><button className="f-button f-button-outline" disabled={!ready || !studyPracticeSet(answers, [topic.id], 'mistakes').length} onClick={() => start([topic.id], 'mistakes')}>Ошибки · {studyPracticeSet(answers, [topic.id], 'mistakes').length}</button></div>
        <h3>Конспект разборов · 20 исходных вопросов</h3><p>Вопросы и варианты оставлены на английском без изменений. Внутри каждого разбора — принцип решения и объяснение каждого варианта по-русски. Исторические и спорные формулировки отмечены в объяснениях.</p>
        <label className={styles.note}>Найти вопрос в этой теме<input className={styles.search} type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Сервис, термин или текст вопроса"/></label>
        {!filtered.length && <p>По этому запросу вопросов нет.</p>}
        {filtered.map(q => <details className={styles.questionNote} key={q.id}><summary><small>Модуль {q.module} · вопрос {q.number}</small><span lang="en">{q.prompt}</span></summary><p>{studyExplanations[q.id].summary}</p>{q.options.map((option, i) => <section key={i}><h4 lang="en">{q.answers.includes(i) ? '✓' : '✗'} {option}</h4><p><strong>{q.answers.includes(i) ? 'Почему подходит: ' : 'Почему не подходит: '}</strong>{studyExplanations[q.id].options[i]}</p></section>)}{q.caution && <p>{q.caution}</p>}<a href={q.source} target="_blank" rel="noreferrer">Исходный Knowledge Check ↗</a></details>)}
        <p>Самооценка: отмечай «понял», только если можешь объяснить выбор и альтернативы без текста.</p><div className={styles.actions}><button className="f-button f-button-outline" disabled={!ready} aria-pressed={checks[active] === 'repeat'} onClick={() => mark('repeat')}>Нужно повторить</button><button className="f-button f-button-outline" disabled={!ready} aria-pressed={checks[active] === 'understood'} onClick={() => mark('understood')}>Могу объяснить</button></div>
        <div className={styles.actions}><button className="f-button" onClick={() => navigate(studyTopics[studyTopics.indexOf(topic) + 1]?.id || 'plan')}>Следующая тема →</button></div>
      </article> : <section className="g-note-paper">
        <p className="f-section-kicker">Два курса · 22 модуля · 220 исходных вопросов</p>
        <h2 ref={heading} tabIndex={-1}>{notesOnly ? 'Конспекты разборов AWS' : 'Подготовка за 1 день · все 220 вопросов'}</h2>
        <p>11 тем по 20 вопросов. Сначала разбираешь принцип, затем закрепляешь его обычным тестом с объяснениями. Foundations даёт основу, Developing — применение в разработке.</p>
        <p aria-live="polite">Отвечено {220 - unseen.length} / 220 · верно {220 - unseen.length - mistakes.length} · ошибок {mistakes.length} · могу объяснить {understood} / 11 тем</p><div className={styles.progressTrack} role="progressbar" aria-valuenow={220 - unseen.length} aria-valuemin={0} aria-valuemax={220} aria-label="Количество вопросов с сохранённым ответом"><span className={styles.progressFill} style={{ transform: `scaleX(${(220 - unseen.length) / 220})` }}/></div>
        {!notesOnly && <><h3>Маршрут на {studyMinutes / 60} часов с перерывами</h3><p>Это плотное повторение уже пройденных курсов. Если тема новая, дай ей больше времени; просмотр 220 ответов сам по себе не означает освоение.</p><ol className={styles.schedule}><li><strong>00:00–00:30 · диагностика</strong><span>22 вопроса: по одному из каждого модуля обоих курсов. До выбора попробуй объяснить решение.</span></li><li><strong>00:30–04:10 · основа: темы 1–5</strong><span>По {studyTiming.topic} минут на тему и два перерыва по 10 минут. Все 100 вопросов Foundations.</span></li><li><strong>04:10–04:40 · большой перерыв</strong><span>Еда и отдых от экрана.</span></li><li><strong>04:40–08:50 · разработка: темы 6–11</strong><span>По 40 минут на тему и ещё 10 минут отдыха. Все 120 вопросов Developing. Короткие паузы можно распределить внутри блоков.</span></li><li><strong>08:50–09:15 · вспомнить без конспекта</strong><span>Назови решающее условие для выбора сервиса и объясни, почему ближайшая альтернатива не подходит.</span></li><li><strong>09:15–10:00 · итоговая проверка</strong><span>44 вопроса: по два из каждого модуля. Вернись к ошибкам после сна.</span></li></ol><p>Внутри 40 минут: 12 — теория, 5 — объяснить своими словами, 23 — 20 вопросов и разбор ошибок. Если не успеваешь понять, продли блок, а не пропускай объяснения.</p><div className={styles.actions}><button className="f-button" disabled={!ready} onClick={() => start([], 'diagnostic')}>Диагностика · 22 вопроса</button></div></>}
        <h3>Конспекты по темам</h3><div className={styles.topicList}>{studyTopics.map((t, i) => <button key={t.id} onClick={() => navigate(t.id)}><strong>{i + 1}. {t.title}</strong><span>{t.course === 'foundations' ? 'Foundations' : 'Developing'} · модули {t.modules.join(', ')} · 20 вопросов</span></button>)}</div>
        <h3>Закрепление и пробелы</h3><div className={styles.actions}><button className="f-button" disabled={!ready} onClick={() => start([], 'final')}>Смешанный тест · 44 вопроса</button><button className="f-button f-button-outline" disabled={!ready || !mistakes.length} onClick={() => start([], 'mistakes')}>Все ошибки · {mistakes.length}</button><button className="f-button f-button-outline" disabled={!ready || !unseen.length} onClick={() => start([], 'unanswered')}>Все оставшиеся · {unseen.length}</button><button className="f-button f-button-outline" disabled={!ready || !studyTopics.some(t => checks[t.id] === 'repeat')} onClick={() => start(studyTopics.filter(t => checks[t.id] === 'repeat').map(t => t.id), 'all')}>Темы «Нужно повторить»</button></div><p>Итоговый процент относится к знакомому банку, а не предсказывает оценку на экзамене. Правильные догадки отмечай для повторения самостоятельно.</p>
      </section>}
      <p className={styles.storage}>Ответы общие с AWS Knowledge Checks и сохраняются для твоего аккаунта в этом браузере. Конспекты и тесты используют все 100 вопросов Foundations и 120 Developing без изменения исходных формулировок.</p>
    </div>
  </div>;
}
