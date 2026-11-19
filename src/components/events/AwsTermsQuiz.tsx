'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import sections from '@/lib/events/awsTerms/terms.json';
import { termAttempt, termOptionCounts, termQuestions } from '@/lib/events/awsTerms/quiz';
import { parseAwsAnswers, type AwsAnswers } from '@/lib/events/awsCloudDeveloping/progress';
import { matchesAnswer } from '@/lib/events/quizAnswers';
import EventQuiz from './EventQuiz';
import styles from './aws-practice.module.css';
import quizStyles from './aws-knowledge-checks.module.css';
import termStyles from './aws-terms-quiz.module.css';

export default function AwsTermsQuiz() {
  const { data: session, status } = useSession();
  if (status === 'loading') return <p role="status">Открываем квиз по терминам…</p>;
  if (!session?.user?.id) return <section className={styles.panel}><h2>Квиз по терминам AWS</h2><p>Войди в аккаунт, чтобы пройти тест и сохранить ответы.</p><Link className="f-button" href="/login?callbackUrl=%2Fevents%2Fcloud-computing-final%23terms-quiz">Войти и начать</Link></section>;
  return <Quiz key={session.user.id} userId={session.user.id}/>;
}

function Quiz({ userId }: { userId: string }) {
  const [category, setCategory] = useState('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [count, setCount] = useState('all');
  const [random, setRandom] = useState(true);
  const [queue, setQueue] = useState<typeof termQuestions>([]);
  const [result, setResult] = useState<number[][] | null>(null);
  const [run, setRun] = useState(0);
  const [music, setMusic] = useState(false);
  const [saved, setSaved] = useState<AwsAnswers>({});
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const frame = useRef<HTMLElement>(null);
  const pending = useRef<AwsAnswers>({});
  const storage = useRef<Storage | null>(null);
  const key = `aws-terms-quiz:v1:${userId}`;
  const screen = result ? 'result' : queue.length ? 'quiz' : 'settings';

  useEffect(() => {
    try { storage.current = window.localStorage; setSaved(parseAwsAnswers(storage.current.getItem(key), termOptionCounts)); }
    catch { setError(true); }
    setReady(true);
    function sync(event: StorageEvent) {
      if (event.storageArea === storage.current && (event.key === key || event.key === null)) {
        setSaved({ ...parseAwsAnswers(event.newValue, termOptionCounts), ...pending.current });
      }
    }
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [key]);

  useEffect(() => {
    if (!run) return;
    frame.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    frame.current?.querySelector<HTMLHeadingElement>('h2, h3')?.focus({ preventScroll: true });
  }, [run, screen]);

  const pool = termQuestions.filter(question => category === 'all' || question.category === category);
  const requested = count === 'all' ? pool.length : Number(count);
  const size = Number.isFinite(requested) && requested >= 1 ? Math.min(Math.floor(requested), pool.length) : 0;
  const mistakes = queue.filter((question, index) => !matchesAnswer(result?.[index], question.correct));
  const answered = pool.filter(question => saved[question.id]).length;
  const correct = pool.filter(question => matchesAnswer(saved[question.id], question.correct)).length;

  function start(items = termAttempt(category, size, random)) {
    if (!items.length || !ready) return;
    setQueue(items);
    setFiltersOpen(false);
    setResult(null);
    setRun(value => value + 1);
  }
  function settings() { setQueue([]); setResult(null); setFiltersOpen(false); }
  function save(id: string, value: number[]) {
    pending.current = { ...pending.current, [id]: value };
    setSaved(previous => ({ ...previous, [id]: value }));
    try {
      storage.current = window.localStorage;
      const merged = { ...parseAwsAnswers(storage.current.getItem(key), termOptionCounts), ...pending.current };
      storage.current.setItem(key, JSON.stringify(merged));
      pending.current = {};
      setSaved(merged);
      setError(false);
    } catch { setError(true); }
  }
  const notice = error && <p role="alert">Хранилище ответов недоступно. Можно продолжить тест, но после закрытия несохранённые ответы могут потеряться.</p>;

  if (screen === 'quiz') return <section ref={frame} className={quizStyles.quiz} aria-label="Квиз по терминам AWS" lang="ru" data-no-i18n>
    {notice}
    <EventQuiz key={run} eventId="cloud-computing-final"
      step={{ title: { ru: 'Термины AWS · проверка понимания', en: 'Термины AWS · проверка понимания' } }}
      quiz={queue} lang="ru" music={music} onMusic={() => setMusic(value => !value)}
      explainOptionsOpen onAnswer={save} onExit={settings} onFinish={setResult}/>
  </section>;

  if (screen === 'result') return <section ref={frame} className={`${styles.panel} ${termStyles.panel}`} aria-label="Результат квиза по терминам" lang="ru" data-no-i18n>
    {notice}<h2 tabIndex={-1}>Верно: {queue.length - mistakes.length} из {queue.length}</h2>
    <p>{mistakes.length ? 'Повтори термины, которые пока путаются, и объясни их своими словами.' : 'Все ответы верны. Попробуй объяснить эти термины своими словами без вариантов ответа.'}</p>
    <div className={styles.actions}>
      <button type="button" onClick={() => start(queue)}>Повторить попытку</button>
      {mistakes.length > 0 && <button type="button" onClick={() => start(mistakes)}>Только ошибки · {mistakes.length}</button>}
      <button type="button" onClick={settings}>Настроить тест</button>
    </div>
    <a className={termStyles.back} href="#terms">← Открыть словарь</a>
    {mistakes.map(question => <details key={question.id}><summary>{question.name}</summary><p className={termStyles.explanation}>{question.why.ru}</p></details>)}
  </section>;

  return <section ref={frame} className={`${styles.panel} ${termStyles.panel}`} aria-label="Настройки квиза по терминам" lang="ru" data-no-i18n>
    <a className={termStyles.back} href="#terms">← К словарю терминов</a>
    <h2 tabIndex={-1}>Проверь понимание · {termQuestions.length} вопросов</h2>
    <p>По одному вопросу на каждую карточку словаря. Выбери верное объяснение среди близких понятий. Это авторский учебный тест; исходные 220 вопросов AWS находятся в отдельной папке.</p>
    {notice}
    <p id="terms-attempt-size">{category === 'all' ? 'Все разделы' : sections.find(section => section.id === category)?.title} · Вопросов: {size} из {pool.length} · {random ? 'Случайный порядок' : 'По порядку словаря'}.</p>
    <div className={termStyles.launch}>
      <button type="button" aria-expanded={filtersOpen} aria-controls="terms-quiz-filters" onClick={() => setFiltersOpen(value => !value)}>Фильтр <span aria-hidden="true">{filtersOpen ? '−' : '+'}</span></button>
      <button type="button" className={termStyles.start} disabled={!ready || !size} onClick={() => start()}>Начать тест</button>
    </div>
    <div id="terms-quiz-filters" hidden={!filtersOpen} className={termStyles.filters}>
      <div className={styles.fields}>
        <label>Раздел<select value={category} onChange={event => { setCategory(event.target.value); setCount('all'); }}><option value="all">Все термины</option>{sections.map(section => <option key={section.id} value={section.id}>{section.title}</option>)}</select></label>
        <label>Количество вопросов<input type="number" min="1" max={pool.length} step="1" inputMode="numeric" value={count === 'all' ? pool.length : count} aria-describedby="terms-attempt-size" onChange={event => setCount(event.target.value)}/></label>
        <label>Порядок<select value={random ? 'random' : 'ordered'} onChange={event => setRandom(event.target.value === 'random')}><option value="random">Случайный</option><option value="ordered">По порядку словаря</option></select></label>
      </div>
      <div className={styles.actions}>
        <button type="button" onClick={() => setCount('5')}>Короткая сессия · 5</button>
        <button type="button" onClick={() => setCount('all')}>Выбрать все · {pool.length}</button>
      </div>
    </div>
    {!size && <p role="alert">Открой «Фильтр» и укажи количество вопросов от 1.</p>}
    <p>{ready ? `Отвечено ранее в этом разделе: ${answered}. Последний ответ верный: ${correct}.` : 'Загружаем сохранённые ответы…'}</p>
    <p>Ответы сохраняются для твоего аккаунта в этом браузере. Выход из попытки возвращает к настройкам; новая попытка начинается с первого вопроса своей подборки.</p>
  </section>;
}
