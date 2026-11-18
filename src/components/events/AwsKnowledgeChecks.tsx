'use client';

import { useEffect, useState } from 'react';
import questions from '@/lib/events/awsCloudDeveloping/questions.json';
import modules from '@/lib/events/awsCloudDeveloping/modules.json';
import { parseAwsAnswers, type AwsAnswers } from '@/lib/events/awsCloudDeveloping/progress';
import { matchesAnswer } from '@/lib/events/quizAnswers';
import { shuffle } from '@/lib/events/engine';
import EventQuiz from './EventQuiz';
import styles from './aws-knowledge-checks.module.css';

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
  const selected = questions.filter(q => !module || q.module === module);
  const mistakes = queue.filter((q, i) => !matchesAnswer(result[i], q.answers));
  const savedMistakes = selected.filter(q => answers[q.id] && !matchesAnswer(answers[q.id], q.answers));
  const unseen = selected.filter(q => !answers[q.id]);
  function start(items = selected) {
    if (!items.length) return;
    setQueue(items); setResult([]); setRun(n => n + 1); setMode('quiz');
  }
  const savedNotice = storageError ? <p role="alert">{ru ? 'Не удалось сохранить ответы в браузере. Можно продолжать, но после закрытия прогресс может потеряться.' : 'Answers could not be saved in this browser. You can continue, but progress may be lost when you leave.'}</p> : null;
  if (mode === 'quiz') return <section className={styles.quiz} aria-label="AWS Knowledge Check" data-no-i18n>
    {savedNotice}
    <EventQuiz key={run} eventId="cloud-computing-final"
      step={{ title: { ru: `AWS Cloud Developing · ${queue.length} вопросов`, en: `AWS Cloud Developing · ${queue.length} questions` } }}
      quiz={queue.map(q => ({ id: q.id, q: q.prompt, options: q.options, correct: q.answers, why: { ru: q.explanation, en: q.explanation }, caution: q.caution, studyLink: { href: q.source, title: `AWS Academy · Module ${q.module}` } }))}
      lang={lang} music={music} onMusic={() => setMusic(v => !v)} onAnswer={save}
      onExit={() => setMode('intro')}
      onFinish={values => { setResult(values); setMode('result'); }}/>
  </section>;
  if (mode === 'result') return <section className="g-note-paper" data-no-i18n>
    <h2>{ru ? 'Knowledge Check завершён' : 'Knowledge Check complete'}</h2>
    <p className={styles.score}>{queue.length - mistakes.length} / {queue.length} · {Math.round((queue.length - mistakes.length) / queue.length * 100)}%</p>
    {savedNotice}
    <div className={styles.actions}><button className="f-button" onClick={() => start(queue)}>{ru ? 'Пройти ещё раз' : 'Try again'}</button>
      {mistakes.length > 0 && <button className="f-button f-button-outline" onClick={() => start(mistakes)}>{ru ? 'Повторить ошибки' : 'Retry mistakes'} ({mistakes.length})</button>}
      <button className="f-button f-button-outline" onClick={() => setMode('intro')}>{ru ? 'К модулям' : 'Back to modules'}</button></div>
    {mistakes.map(q => <article className={styles.review} key={q.id} lang="en"><h3>{q.prompt}</h3><p><strong>Correct:</strong> {q.answers.map(i => q.options[i]).join('; ')}</p><p>{q.explanation}</p>{q.caution && <p>{q.caution}</p>}</article>)}
  </section>;
  return <section className="g-note-paper" data-testid="aws-knowledge-checks" data-no-i18n>
    <p className="f-section-kicker">AWS Academy · Cloud Developing</p>
    <h2>{ru ? 'Все Knowledge Checks курса' : 'All course Knowledge Checks'}</h2>
    <p>{ru ? '120 вопросов · 12 модулей · оригинальные английские вопросы, варианты и объяснения AWS. Выбирай ответ, читай разбор и переходи дальше. Поддерживаются вопросы с несколькими правильными ответами.' : '120 questions · 12 modules · original English questions, choices and AWS explanations. Answer, read the feedback and move on. Multiple-answer questions are supported.'}</p>
    <p>{ru ? 'Сохранённая выгрузка от 13 ноября 2026: модули 2–13, по 10 вопросов. Это проверки курса, а не подтверждённый список вопросов будущего экзамена. Для объяснения по-русски открой ИИ-помощника внутри теста.' : 'Saved collection from 13 November 2026: modules 2–13, ten questions each. These are course checks, not a confirmed list for a future exam. Use the AI assistant in the quiz for a Russian explanation.'}</p>
    <label className={styles.select}>{ru ? 'Набор вопросов' : 'Question set'}<select value={module} onChange={e => setModule(Number(e.target.value))}>
      <option value={0}>{ru ? 'Все модули — 120 вопросов' : 'All modules — 120 questions'}</option>
      {modules.map(m => <option key={m.module} value={m.module}>{m.moduleTitle}</option>)}
    </select></label>
    <p aria-live="polite">{ru ? 'Отвечено' : 'Answered'}: {selected.length - unseen.length} / {selected.length} · {ru ? 'Верно' : 'Correct'}: {selected.filter(q => matchesAnswer(answers[q.id], q.answers)).length}</p>
    {savedNotice}
    <div className={styles.actions}>
      <button className="f-button" disabled={!ready} onClick={() => start()}>{ru ? 'Начать тест' : 'Start quiz'} · {selected.length}</button>
      {unseen.length > 0 && unseen.length < selected.length && <button className="f-button f-button-outline" disabled={!ready} onClick={() => start(unseen)}>{ru ? 'Оставшиеся вопросы' : 'Unanswered questions'} · {unseen.length}</button>}
      {savedMistakes.length > 0 && <button className="f-button f-button-outline" disabled={!ready} onClick={() => start(savedMistakes)}>{ru ? 'Повторить ошибки' : 'Retry mistakes'} · {savedMistakes.length}</button>}
      {module === 0 && <button className="f-button f-button-outline" disabled={!ready} onClick={() => start(shuffle(questions).slice(0,30))}>{ru ? 'Случайные 30' : 'Random 30'}</button>}
    </div>
    <div className={styles.modules}>{modules.map(m => {
      const bank = questions.filter(q => q.module === m.module);
      const correct = bank.filter(q => matchesAnswer(answers[q.id], q.answers)).length;
      return <article key={m.module}><h3>{m.moduleTitle}</h3><p>{ru ? 'Верно' : 'Correct'}: {correct} / {bank.length}</p><button className="f-button f-button-outline" disabled={!ready} onClick={() => { setModule(m.module); start(bank); }}>{ru ? 'Пройти 10 вопросов' : 'Start 10 questions'}</button><a href={m.url} target="_blank" rel="noreferrer">{ru ? 'Открыть источник в AWS Academy ↗' : 'Open source in AWS Academy ↗'}</a></article>;
    })}</div>
    <p className="f-fine">{ru ? 'Прогресс хранится отдельно для твоего аккаунта в этом браузере. После выхода из попытки можно продолжить оставшиеся вопросы.' : 'Progress is stored for your account in this browser. After leaving a quiz, use Unanswered questions to continue.'}</p>
  </section>;
}
