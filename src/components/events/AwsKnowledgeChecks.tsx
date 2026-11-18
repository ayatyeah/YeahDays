'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { dayPracticeSet, type DayPracticeKind } from '@/lib/events/awsCloudDeveloping/practiceSets';
import questions from '@/lib/events/awsCloudDeveloping/questions.json';
import explanations from '@/lib/events/awsCloudDeveloping/explanations.ru.json';
import modules from '@/lib/events/awsCloudDeveloping/modules.json';
import { parseAwsAnswers, type AwsAnswers } from '@/lib/events/awsCloudDeveloping/progress';
import { matchesAnswer } from '@/lib/events/quizAnswers';
import { shuffle } from '@/lib/events/engine';
import EventQuiz from './EventQuiz';
import styles from './aws-knowledge-checks.module.css';

const AwsOneDay = dynamic(() => import('./AwsOneDay'), { loading: () => <p role="status">Загружаю план подготовки…</p> });
const russian: Record<string, { summary: string; options: string[] }> = explanations;
type Props = { userId: string; lang: 'en' | 'ru' };
export default function AwsKnowledgeChecks(props: Props) {
  return <Workspace key={props.userId} {...props}/>;
}
function Workspace({ userId, lang }: Props) {
  const ru = lang === 'ru';
  const storageKey = `yg-aws-developing-checks-v1:${userId}`;
  const [answers, setAnswers] = useState<AwsAnswers>({});
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [module, setModule] = useState(0);
  const [queue, setQueue] = useState(questions);
  const [mode, setMode] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [result, setResult] = useState<number[][]>([]);
  const [run, setRun] = useState(0);
  const [music, setMusic] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [explanationLang, setExplanationLang] = useState<'ru' | 'en'>('ru');
  const [practice, setPractice] = useState<'all' | 'random' | 'errors' | 'day'>('all');
  const [dayStage, setDayStage] = useState('plan');
  useEffect(() => {
    try { setAnswers(parseAwsAnswers(localStorage.getItem(storageKey))); }
    catch { setStorageError(true); }
    setReady(true);
  }, [storageKey]);
  function save(id: string, value: number[]) {
    const next = { ...answers, [id]: value };
    setAnswers(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); setStorageError(false); }
    catch { setStorageError(true); }
  }
  const moduleQuestions = questions.filter(q => !module || q.module === module);
  const selected = practice === 'errors' ? moduleQuestions.filter(q => answers[q.id] && !matchesAnswer(answers[q.id], q.answers)) : moduleQuestions;
  const mistakes = queue.filter((q, i) => !matchesAnswer(result[i], q.answers));
  const savedMistakes = selected.filter(q => answers[q.id] && !matchesAnswer(answers[q.id], q.answers));
  const unseen = selected.filter(q => !answers[q.id]);
  function start(items = practice === 'random' ? shuffle(selected).slice(0, 30) : selected) {
    if (!items.length) return;
    setMenuOpen(false); setQueue(items); setResult([]); setRun(n => n + 1); setMode('quiz');
  }
  function startDay(modules: number[], kind: DayPracticeKind) {
    start(dayPracticeSet(answers, modules, kind));
  }
  const savedNotice = storageError ? <p role="alert">{ru ? 'Не удалось сохранить ответы в браузере. Можно продолжать, но после закрытия прогресс может потеряться.' : 'Answers could not be saved in this browser. You can continue, but progress may be lost when you leave.'}</p> : null;
  const heading = module ? modules.find(m => m.module === module)!.moduleTitle : practice === 'random' ? 'Случайные 30' : practice === 'errors' ? 'Работа над ошибками' : 'Все модули · 120 вопросов';
  function navigate(nextModule: number, nextPractice: typeof practice = 'all') {
    setModule(nextModule); setPractice(nextPractice); setMode('intro'); setMenuOpen(false);
  }
  const content = mode === 'quiz' ? <section className={styles.quiz} aria-label="AWS Knowledge Check" data-no-i18n>
    {savedNotice}
    <EventQuiz key={run} eventId="cloud-computing-final"
      step={{ title: { ru: `AWS Cloud Developing · ${queue.length} вопросов`, en: `AWS Cloud Developing · ${queue.length} questions` } }}
      quiz={queue.map(q => ({ id: q.id, q: q.prompt, options: q.options, correct: q.answers, why: { ru: russian[q.id].summary, en: q.explanation }, optionExplanations: russian[q.id].options, caution: q.caution, studyLink: { href: q.source, title: `AWS Academy · Module ${q.module}` } }))}
      lang={explanationLang} onLang={() => setExplanationLang(v => v === 'ru' ? 'en' : 'ru')} explainOptionsOpen music={music} onMusic={() => setMusic(v => !v)} onAnswer={save}
      onExit={() => setMode('intro')}
      onFinish={values => { setResult(values); setMode('result'); }}/>
  </section> : mode === 'result' ? <section className="g-note-paper" data-no-i18n>
    <h2>{ru ? 'Knowledge Check завершён' : 'Knowledge Check complete'}</h2>
    <p className={styles.score}>{queue.length - mistakes.length} / {queue.length} · {Math.round((queue.length - mistakes.length) / queue.length * 100)}%</p>
    {savedNotice}
    <div className={styles.actions}><button className="f-button" onClick={() => start(queue)}>{ru ? 'Пройти ещё раз' : 'Try again'}</button>
      {mistakes.length > 0 && <button className="f-button f-button-outline" onClick={() => start(mistakes)}>{ru ? 'Повторить ошибки' : 'Retry mistakes'} ({mistakes.length})</button>}
      <button className="f-button f-button-outline" onClick={() => setMode('intro')}>{practice === 'day' ? 'Вернуться к плану дня' : ru ? 'К модулям' : 'Back to modules'}</button></div>
    {mistakes.map(q => <article className={styles.review} key={q.id} lang="en"><h3>{q.prompt}</h3><p><strong>Correct:</strong> {q.answers.map(i => q.options[i]).join('; ')}</p><p lang="ru">{russian[q.id].summary}</p><details><summary>Разбор всех вариантов</summary>{q.options.map((option, i) => <div key={i}><p>{q.answers.includes(i) ? '✓' : '✗'} {option}</p><p lang="ru">{russian[q.id].options[i]}</p></div>)}</details>{q.caution && <p>{q.caution}</p>}</article>)}
  </section> : practice === 'day' ? <AwsOneDay userId={userId} answers={answers} ready={ready} active={dayStage} onNavigate={setDayStage} onPractice={startDay}/> : <section className="g-note-paper" data-testid="aws-knowledge-checks" data-no-i18n>
    <p className="f-section-kicker">AWS Academy · Cloud Developing</p>
    <h2>{heading}</h2>
    <p>Оригинальные английские вопросы и варианты AWS Academy. После ответа — русский разбор принципа и каждого варианта; оригинальное объяснение AWS доступно по кнопке переключения языка.</p>
    <p className="f-fine">Модули 2–13, по 10 вопросов · выгрузка от 13 ноября 2026. Это проверки курса, а не подтверждённый список будущего экзамена. Русские разборы подготовлены для обучения; спорные формулировки курса отмечены отдельно.</p>
    <p aria-live="polite">{ru ? 'Отвечено' : 'Answered'}: {selected.length - unseen.length} / {selected.length} · {ru ? 'Верно' : 'Correct'}: {selected.filter(q => matchesAnswer(answers[q.id], q.answers)).length}</p>
    {savedNotice}
    <div className={styles.actions}>
      <button className="f-button" onClick={() => start()} disabled={!ready || !selected.length}>{ru ? 'Начать тест' : 'Start quiz'} · {practice === 'random' ? Math.min(30, selected.length) : selected.length}</button>
      {unseen.length > 0 && unseen.length < selected.length && <button className="f-button f-button-outline" disabled={!ready} onClick={() => start(unseen)}>{ru ? 'Оставшиеся вопросы' : 'Unanswered questions'} · {unseen.length}</button>}
      {savedMistakes.length > 0 && <button className="f-button f-button-outline" disabled={!ready} onClick={() => start(savedMistakes)}>{ru ? 'Повторить ошибки' : 'Retry mistakes'} · {savedMistakes.length}</button>}
    </div>
    {practice === 'errors' && !selected.length && <p>Сохранённых ошибок пока нет. Пройди любой модуль — вопросы с неверными ответами появятся здесь.</p>}
    {module > 0 && <a className={styles.source} href={modules.find(m => m.module === module)!.url} target="_blank" rel="noreferrer">Источник: AWS Academy · Module {module} ↗</a>}
    <div className={styles.guide}><h3>Как проходить с пользой</h3><ol><li>Сначала попробуй вспомнить решение, затем выбирай вариант.</li><li>После ответа найди решающее условие и объясни, почему остальные варианты не подходят.</li><li>Вернись к ошибкам в следующей сессии. Правильная догадка тоже требует повторения.</li></ol></div>
    <p className="f-fine">{ru ? 'Прогресс хранится отдельно для твоего аккаунта в этом браузере. После выхода из попытки можно продолжить оставшиеся вопросы.' : 'Progress is stored for your account in this browser. After leaving a quiz, use Unanswered questions to continue.'}</p>
  </section>;
  return <div className={styles.layout} data-no-i18n>
    <aside className={styles.sidebar}>
      <button className={styles.mobileToggle} aria-expanded={menuOpen} aria-controls="aws-course-navigation" onClick={() => setMenuOpen(v => !v)}>Разделы курса <span>{menuOpen ? '−' : '+'}</span></button>
      <nav id="aws-course-navigation" aria-label="AWS: практика и модули" className={`${styles.navigation} ${menuOpen ? styles.open : ''}`}>
        <p className={styles.navHeading}>Подготовка</p>
        <button aria-current={practice === 'day' ? 'page' : undefined} onClick={() => navigate(0, 'day')}><span>Глубокое изучение за 1 день<small>6 блоков · около 8 часов</small></span></button>
        <p className={styles.navHeading}>Практика</p>
        {([{id:'all', title:'Все вопросы', count:120}, {id:'random', title:'Случайные 30', count:30}, {id:'errors', title:'Мои ошибки', count:questions.filter(q => answers[q.id] && !matchesAnswer(answers[q.id], q.answers)).length}] as const).map(item => <button key={item.id} aria-current={!module && practice === item.id ? 'page' : undefined} onClick={() => navigate(0, item.id)}><span>{item.title}</span><small>{item.count}</small></button>)}
        <p className={styles.navHeading}>Модули курса</p>
        {modules.map(m => { const bank=questions.filter(q => q.module===m.module); const correct=bank.filter(q => matchesAnswer(answers[q.id], q.answers)).length; return <button key={m.module} aria-current={module===m.module ? 'page' : undefined} onClick={() => navigate(m.module)}><span>{m.moduleTitle}<small>{correct} / 10 верно</small></span></button>; })}
      </nav>
    </aside>
    <div className={styles.content}>{content}</div>
  </div>;
}

