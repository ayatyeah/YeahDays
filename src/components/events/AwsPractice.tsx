'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { courseStorage, studyCounts, studyExplanations } from '@/lib/events/awsStudy/bank';
import { examVariant, moduleBank, prepareAttempt, questionCourse, type AwsCourse, type AwsQuestion } from '@/lib/events/awsStudy/practice';
import { parseAwsAnswers, type AwsAnswers } from '@/lib/events/awsCloudDeveloping/progress';
import { matchesAnswer } from '@/lib/events/quizAnswers';
import { topicForQuestion } from '@/lib/events/awsStudy/topics';
import { examOverlap } from '@/lib/events/awsStudy/examOverlap';
import EventQuiz from './EventQuiz';
import quizStyles from './aws-knowledge-checks.module.css';
import styles from './aws-practice.module.css';

type Props = { course?: AwsCourse; module?: number; embedded?: boolean };
export default function AwsPractice(props: Props) {
  const { data: session } = useSession();
  if (!session?.user?.id) return <p>Войди в аккаунт, чтобы пройти тест и сохранить прогресс.</p>;
  return <Practice key={`${session.user.id}:${props.course}:${props.module}`} {...props} userId={session.user.id}/>;
}
function Practice({ userId, course: fixedCourse, module: fixedModule, embedded }: Props & { userId: string }) {
  const [course, setCourse] = useState<AwsCourse | 'both'>(fixedCourse ?? 'both');
  const [module, setModule] = useState(fixedModule ?? 0);
  const [variant, setVariant] = useState(0);
  const [count, setCount] = useState('all');
  const [random, setRandom] = useState(false);
  const [filter, setFilter] = useState('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterPanelId = useId();
  const [answers, setAnswers] = useState<AwsAnswers>({});
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [queue, setQueue] = useState<AwsQuestion[]>([]);
  const [result, setResult] = useState<number[][] | null>(null);
  const [run, setRun] = useState(0);
  const [music, setMusic] = useState(false);
  const [lang, setLang] = useState<'ru' | 'en'>('ru');
  const frame = useRef<HTMLElement>(null);
  useEffect(() => {
    try { setAnswers(Object.assign({}, ...Object.values(courseStorage).map(key => parseAwsAnswers(localStorage.getItem(`${key}:${userId}`), studyCounts)))); }
    catch { setError(true); }
    setReady(true);
  }, [userId]);
  useEffect(() => {
    if (!run) return;
    frame.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    frame.current?.querySelector<HTMLHeadingElement>('h2, h3')?.focus({ preventScroll: true });
  }, [run, result]);
  const bank = variant === 6 ? moduleBank('developing').filter(q => examOverlap.some(match => match.questionId === q.id)) : variant ? examVariant(variant) : moduleBank(course, module);
  const pool = bank.filter(q => filter === 'errors' ? answers[q.id] && !matchesAnswer(answers[q.id], q.answers) : filter === 'unanswered' ? !answers[q.id] : true);
  const requested = count === 'all' ? pool.length : Number(count);
  const size = Number.isFinite(requested) && requested >= 1 ? Math.min(Math.floor(requested), pool.length) : 0;
  function start(items = prepareAttempt(pool, size, random)) {
    if (!items.length) return;
    setQueue(items); setResult(null); setFiltersOpen(false); setRun(n => n + 1);
  }
  function save(id: string, value: number[]) {
    setAnswers(previous => ({ ...previous, [id]: value }));
    const key = `${courseStorage[id.startsWith('aws-found-') ? 'foundations' : 'developing']}:${userId}`;
    try { localStorage.setItem(key, JSON.stringify({ ...parseAwsAnswers(localStorage.getItem(key), studyCounts), [id]: value })); setError(false); }
    catch { setError(true); }
  }
  const mistakes = queue.filter((q, index) => !matchesAnswer(result?.[index], q.answers));
  const notice = error && <p role="alert">Ответы не удалось сохранить в браузере. Тест доступен, но прогресс этой попытки может потеряться после закрытия.</p>;
  if (queue.length && !result) return <section ref={frame} className={quizStyles.quiz} aria-label="Тест AWS" data-no-i18n>{notice}<EventQuiz key={run} eventId="cloud-computing-final"
    step={{ title: { ru: `AWS · ${queue.length} вопросов`, en: `AWS · ${queue.length} questions` } }}
    quiz={queue.map(q => ({ id: q.id, q: q.prompt, options: q.options, correct: q.answers, why: { ru: studyExplanations[q.id].summary, en: q.explanation }, optionExplanations: studyExplanations[q.id].options, caution: q.caution, studyLink: { href: `/events/cloud-computing-final#aws-notes/${topicForQuestion(q).id}/${q.id}`, title: `${questionCourse(q) === 'foundations' ? 'Foundations' : 'Developing'} · модуль ${q.module}` } }))}
    lang={lang} onLang={() => setLang(value => value === 'ru' ? 'en' : 'ru')} explainOptionsOpen music={music} onMusic={() => setMusic(value => !value)} onAnswer={save}
    onExit={() => { setQueue([]); setResult(null); }} onFinish={values => setResult(values)}/></section>;
  if (result) return <section ref={frame} className={styles.panel} aria-label="Результат теста">{notice}<h3 tabIndex={-1}>Результат: {queue.length - mistakes.length} из {queue.length}</h3><p>{Math.round((queue.length - mistakes.length) / queue.length * 100)}% правильных ответов в этой попытке.</p><div className={styles.actions}><button onClick={() => start(queue)}>Повторить эту попытку</button>{mistakes.length > 0 && <button onClick={() => start(mistakes)}>Разобрать ошибки · {mistakes.length}</button>}<button onClick={() => { setQueue([]); setResult(null); }}>К настройкам теста</button></div>{mistakes.map(q => <details key={q.id}><summary lang="en">{q.prompt}</summary><p>{studyExplanations[q.id].summary}</p>{q.options.map((option, index) => <p key={option}><strong lang="en">{q.answers.includes(index) ? '✓' : '✗'} {option}</strong><br/>{studyExplanations[q.id].options[index]}</p>)}<a href={`#aws-notes/${topicForQuestion(q).id}/${q.id}`}>Повторить тему →</a></details>)}</section>;
  return <section className={styles.panel} data-testid="aws-knowledge-checks" aria-label="Настройки теста AWS" lang="ru" data-no-i18n>
    <h3>{embedded ? 'Закрепи этот модуль тестом' : 'Тесты AWS · 220 оригинальных вопросов'}</h3>
    <p>Вопросы и варианты — на исходном английском. После ответа — разбор на русском, почему каждый вариант подходит или нет.</p>
    {fixedCourse === 'developing' && [1, 14].includes(fixedModule ?? 0) && <p className={styles.note}>{fixedModule === 1 ? 'У вводного модуля нет собственного Knowledge Check. Здесь — вопросы модулей 2 и 4 о разработке и доступе.' : 'У модуля сертификации нет собственного Knowledge Check. Здесь — повторение из всех 120 вопросов Developing.'}</p>}
    <p className={styles.selectionSummary} aria-live="polite">Вопросов в попытке: {size} из {pool.length}. {random ? 'Случайный порядок, без повторов.' : 'По исходному порядку.'}</p>
    {notice}
    <div className={styles.primaryActions}>
      <button type="button" className={styles.filterToggle} aria-expanded={filtersOpen} aria-controls={filterPanelId} onClick={() => setFiltersOpen(value => !value)}>Фильтр <span aria-hidden="true">{filtersOpen ? '−' : '+'}</span></button>
      <button type="button" className={styles.startButton} disabled={!ready || !size} onClick={() => start()}>Начать тест · {size}</button>
    </div>
    <div id={filterPanelId} className={styles.filtersPanel} hidden={!filtersOpen}>
      {!embedded && <div className={styles.fields}>
        <label>Курс<select value={course} onChange={event => { setCourse(event.target.value as typeof course); setModule(0); setVariant(0); setCount('all'); }}><option value="both">Оба курса · 220</option><option value="foundations">Cloud Foundations · 100</option><option value="developing">Cloud Developing · 120</option></select></label>
        <label>Модуль<select value={module} disabled={course === 'both'} onChange={event => { setModule(Number(event.target.value)); setVariant(0); setCount('all'); }}><option value={0}>Все модули</option>{course !== 'both' && Array.from({ length: course === 'foundations' ? 10 : 12 }, (_, i) => i + (course === 'foundations' ? 1 : 2)).map(n => <option key={n} value={n}>Модуль {n} · 10 вопросов</option>)}</select></label>
        <label>Готовый вариант<select value={variant} onChange={event => { const value = Number(event.target.value); setVariant(value); setFilter('all'); setCount('all'); setCourse(value === 6 ? 'developing' : 'both'); setModule(0); if (value) setRandom(false); }}><option value={0}>Своя подборка</option><option value={6}>Совпадения с 47 вопросами · 25</option>{[1,2,3,4,5].map(n => <option key={n} value={n}>Вариант {n} · 44 вопроса</option>)}</select></label>
      </div>}
      {variant > 0 && variant <= 5 && <p className={styles.note}>Пять вариантов без повторов между ними: по 2 вопроса из каждого из 22 Knowledge Checks. Все пять вместе покрывают 220 вопросов. Выбран вариант {variant}.</p>}
      {!embedded && variant === 6 && <aside className={styles.note}><strong>Сравнение с 47 вопросами с фотографий</strong><p>25 из 47 (53%) совпадают по условию с Developing, модули 2–6. У 22 совпадает и набор вариантов; у №25, №27 и №47 есть различия. Порядок вариантов может отличаться. Остальные 22 не имеют прямого совпадения; среди них Azure, общая теория, Docker и отдельные темы AWS.</p><p>В этой подборке сохранены вопросы и варианты из исходного банка AWS.</p></aside>}
      <div className={styles.fields}>
        <label>Какие вопросы<select value={filter} onChange={event => { setFilter(event.target.value); setCount('all'); }}><option value="all">Все в подборке</option><option value="unanswered">Ещё не отвеченные</option><option value="errors">Мои ошибки</option></select></label>
        <label>Количество вопросов<input type="number" inputMode="numeric" min={1} max={Math.max(1,pool.length)} step={1} value={count === 'all' ? pool.length : count} onChange={event => setCount(event.target.value)}/></label>
        <label>Порядок<select value={random ? 'random' : 'original'} onChange={event => setRandom(event.target.value === 'random')}><option value="original">По порядку</option><option value="random">Случайный</option></select></label>
      </div>
      <div className={styles.filterFooter}><p className={styles.note}>Порядок вариантов ответа сохраняется.</p><button type="button" disabled={!pool.length} onClick={() => setCount('all')}>Выбрать все · {pool.length}</button></div>
    </div>
    {!pool.length && <p>В этой подборке пока нет вопросов. Открой фильтр и выбери другую подборку или сначала пройди тест.</p>}
    <p className={styles.note}>Ответы сохраняются для твоего аккаунта и общие с подготовкой за 1 день. Это учебные Knowledge Checks, а не гарантия вопросов будущего экзамена.</p>
  </section>;
}
