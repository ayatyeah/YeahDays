'use client';

import { useEffect, useRef, useState } from 'react';
import { dayBlocks, dayMinutes, dayTiming } from '@/lib/events/awsCloudDeveloping/oneDay';
import questions from '@/lib/events/awsCloudDeveloping/questions.json';
import { matchesAnswer } from '@/lib/events/quizAnswers';
import type { AwsAnswers } from '@/lib/events/awsCloudDeveloping/progress';
import styles from './aws-one-day.module.css';

type Check = 'repeat' | 'understood';
type Saved = { checks: Record<string, Check>; notes: Record<string, string> };
const empty: Saved = { checks: {}, notes: {} };
function readSaved(raw: string | null): Saved {
  try {
    const value = JSON.parse(raw || '{}');
    const valid: Saved = { checks: {}, notes: {} };
    for (const block of dayBlocks) {
      if (value?.checks?.[block.id] === 'repeat' || value?.checks?.[block.id] === 'understood') valid.checks[block.id] = value.checks[block.id];
      if (typeof value?.notes?.[block.id] === 'string') valid.notes[block.id] = value.notes[block.id].slice(0, 6000);
    }
    return valid;
  } catch { return empty; }
}
export default function AwsOneDay({ userId, answers, ready, onPractice, active, onNavigate }: {
  userId: string; answers: AwsAnswers; ready: boolean; active: string; onNavigate: (stage: string) => void;
  onPractice: (modules: number[], kind: 'all' | 'diagnostic' | 'final' | 'mistakes') => void;
}) {
  const stageHeading = useRef<HTMLHeadingElement>(null);
  const [saved, setSaved] = useState<Saved>(empty);
  const [loaded, setLoaded] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const storageKey = `yg-aws-one-day-v1:${userId}`;
  useEffect(() => {
    try { setSaved(readSaved(localStorage.getItem(storageKey))); } catch { setSaveError(true); }
    setLoaded(true);
  }, [storageKey]);
  useEffect(() => {
    if (!loaded) return;
    stageHeading.current?.focus({ preventScroll: true });
    stageHeading.current?.scrollIntoView({ block: 'start' });
  }, [active, loaded]);
  function persist(next: Saved) {
    setSaved(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); setSaveError(false); } catch { setSaveError(true); }
  }
  const block = dayBlocks.find(b => b.id === active);
  const understood = dayBlocks.filter(b => saved.checks[b.id] === 'understood').length;
  const mistakes = questions.filter(q => answers[q.id] && !matchesAnswer(answers[q.id], q.answers));
  const weakModules = dayBlocks.filter(b => saved.checks[b.id] === 'repeat').flatMap(b => b.modules);
  const disabled = !ready || !loaded;
  return <section className={styles.workspace} lang="ru" data-testid="aws-one-day">
    <header className={`g-note-paper ${styles.header}`}>
      <p className="f-section-kicker">AWS · интенсив с пониманием</p>
      <h2>Глубокое изучение за 1 день</h2>
      <p>Шесть связанных тем → все 120 вопросов → объяснение без подсказок → повторная проверка. Около {dayMinutes / 60} часов с перерывами. Это интенсивное повторение: с нуля потребуется больше времени, а один день не гарантирует долговременное освоение.</p>
      <p className={styles.progress} aria-live="polite">Самооценка: понял {understood} / 6 блоков · отвечено {questions.filter(q => answers[q.id]).length} / 120 · ошибок {mistakes.length}</p>
      <progress value={understood} max={6} aria-label="Блоки, которые могу объяснить самостоятельно"/>
      {saveError && <p role="alert">Не удалось сохранить план в браузере. Записи пока доступны на этой странице; после закрытия могут потеряться.</p>}
    </header>
    <nav className={styles.steps} aria-label="Этапы однодневной подготовки">
      <button aria-current={active === 'plan' ? 'step' : undefined} onClick={() => onNavigate('plan')}>План дня</button>
      {dayBlocks.map((b, i) => <button key={b.id} aria-current={active === b.id ? 'step' : undefined} onClick={() => onNavigate(b.id)}>{i + 1}. {b.title}{saved.checks[b.id] === 'understood' ? ' · понял' : saved.checks[b.id] === 'repeat' ? ' · повторить' : ''}</button>)}
      <button aria-current={active === 'finish' ? 'step' : undefined} onClick={() => onNavigate('finish')}>Закрепление</button>
    </nav>
    {active === 'plan' && <article className="g-note-paper">
      <h2 ref={stageHeading} tabIndex={-1}>Маршрут на сегодня</h2>
      <p>Время отсчитывается от твоего начала. Перерывы входят в план: не пытайся компенсировать отставание бессонной ночью. Если тема новая, увеличь её время и продолжи завтра.</p>
      <ol className={styles.schedule}>
        <li><strong>00:00–00:20 · диагностика</strong><span>По одному вопросу из каждого модуля. До ответа сформулируй правило своими словами; правильную догадку считай сигналом для повторения.</span></li>
        <li><strong>00:20–02:20 · блоки 1 и 2</strong><span>Доступ и данные: 55 минут на каждый блок, между ними 10 минут отдыха.</span></li>
        <li><strong>02:20–02:30 · перерыв</strong><span>Отойди от экрана.</span></li>
        <li><strong>02:30–04:30 · блоки 3 и 4</strong><span>Serverless, контейнеры и кеш: по 55 минут, между ними 10 минут отдыха.</span></li>
        <li><strong>04:30–05:00 · длинный перерыв</strong><span>Поешь и отдохни.</span></li>
        <li><strong>05:00–07:00 · блоки 5 и 6</strong><span>Сообщения, workflows и выпуск: по 55 минут, между ними 10 минут отдыха.</span></li>
        <li><strong>07:00–07:25 · восстановление из памяти</strong><span>Без текста объясни шесть тем и вернись к утренним ошибкам. Не повторяй только номер правильного варианта.</span></li>
        <li><strong>07:25–08:00 · смешанная проверка и итог</strong><span>24 вопроса: по два из каждого модуля. Затем запиши, какие различия ещё путаются.</span></li>
      </ol>
      <div className={styles.actions}><button className="f-button" disabled={disabled} onClick={() => onPractice([], 'diagnostic')}>Диагностика · 12 вопросов</button><button className="f-button f-button-outline" onClick={() => onNavigate(dayBlocks[0].id)}>Открыть первый блок</button></div>
      <h3>Как работать внутри каждого блока · {dayTiming.block} минут</h3>
      <p>15 минут — прочитать принципы; 10 — сравнить альтернативы и разобрать кейс; 5 — ответить на новые ситуации без подсказки; 25 — пройти 20 вопросов и разобрать ошибки. Это ориентир, а не требование уложиться любой ценой.</p>
      <details><summary>Почему план устроен так</summary><p>Попытка вспомнить до чтения, корректирующая обратная связь и разнесённые повторения помогают учиться. Внутридневной повтор полезен, но не заменяет возвращение к материалу в следующие дни. Именно этот восьмичасовой план экспериментально не проверялся.</p><ul><li><a href="https://pubmed.ncbi.nlm.nih.gov/33683913/" target="_blank" rel="noreferrer">Исследования тренировочного тестирования ↗</a></li><li><a href="https://link.springer.com/article/10.1007/s10648-020-09572-8" target="_blank" rel="noreferrer">Метаанализ разнесённого извлечения из памяти ↗</a></li><li><a href="https://pubmed.ncbi.nlm.nih.gov/29733621/" target="_blank" rel="noreferrer">Перенос на новые вопросы ↗</a></li></ul></details>
    </article>}
    {block && <article key={block.id} className="g-note-paper">
      <p className="f-section-kicker">Модули {block.modules.join(' + ')} · 55 минут · 20 оригинальных вопросов</p>
      <h2 ref={stageHeading} tabIndex={-1}>{block.title}</h2><p><strong>После блока:</strong> {block.goal}</p>
      {block.concepts.map((concept, i) => <section className={styles.concept} key={concept.title}><h3>{i + 1}. {concept.title}</h3><p>{concept.text}</p></section>)}
      <h3>Не путай похожие понятия</h3>
      <div className={styles.comparisons}>{block.contrasts.map(c => <section key={c.left}><h4>{c.left} <span>и</span> {c.right}</h4><p>{c.rule}</p></section>)}</div>
      <section className={styles.case}><h3>Разбираем задачу целиком</h3><p><strong>Условие:</strong> {block.case.task}</p><ol>{block.case.reasoning.map(step => <li key={step}>{step}</li>)}</ol></section>
      <h3>А если условие изменится?</h3><p>Сначала ответь вслух или запиши мысль ниже. Эти учебные ситуации составлены для проверки понимания и не являются вопросами из AWS Knowledge Checks.</p>
      {block.transfer.map((t, i) => <section className={styles.scenario} key={t.question}><h4>Ситуация {i + 1}</h4><p>{t.question}</p><details><summary>Сравнить своё рассуждение с разбором</summary><p>{t.answer}</p></details></section>)}
      <h3>Закрой конспект и объясни</h3><ul className={styles.recall}>{block.recall.map(item => <li key={item}>{item}</li>)}</ul>
      <label className={styles.note}>Мой ответ и что ещё путается<textarea disabled={!loaded} value={saved.notes[block.id] || ''} maxLength={6000} rows={5} placeholder="Требование задачи → решающий признак → выбор → почему альтернативы не подходят" onChange={e => persist({ ...saved, notes: { ...saved.notes, [block.id]: e.target.value } })}/></label>
      <div className={styles.actions}><button className="f-button" disabled={disabled} onClick={() => onPractice(block.modules, 'all')}>Практика блока · 20 вопросов</button></div>
      <p>Отметь «понял», если можешь объяснить пункты выше без текста и решить изменённые ситуации. Это твоя самооценка, не автоматический зачёт по нажатию.</p>
      <div className={styles.actions}><button className="f-button f-button-outline" disabled={!loaded} aria-pressed={saved.checks[block.id] === 'repeat'} onClick={() => persist({ ...saved, checks: { ...saved.checks, [block.id]: 'repeat' } })}>Нужно повторить</button><button className="f-button f-button-outline" disabled={!loaded} aria-pressed={saved.checks[block.id] === 'understood'} onClick={() => persist({ ...saved, checks: { ...saved.checks, [block.id]: 'understood' } })}>Могу объяснить самостоятельно</button></div>
      <a href={block.source.url} target="_blank" rel="noreferrer">{block.source.title} ↗</a>
      <div className={styles.actions}><button className="f-button f-button-outline" onClick={() => onNavigate(dayBlocks[dayBlocks.indexOf(block) + 1]?.id || 'finish')}>Следующий этап →</button></div>
    </article>}
    {active === 'finish' && <article className="g-note-paper"><h2 ref={stageHeading} tabIndex={-1}>Закрепление без самообмана</h2><p>Сначала закрой материалы. Для каждой из шести тем назови: какую задачу решаем, какой сервис подходит, какое ограничение меняет выбор и почему ближайшая альтернатива хуже в этом условии.</p><h3>Вернись к сложному</h3><p>В банке сейчас {mistakes.length} ошибок; {dayBlocks.filter(b => saved.checks[b.id] === 'repeat').length} блоков отмечены для повторения. Правильные догадки банк автоматически не распознаёт — отмечай соответствующий блок как «Нужно повторить».</p><div className={styles.actions}><button className="f-button" disabled={disabled || !mistakes.length} onClick={() => onPractice([], 'mistakes')}>Повторить ошибки · {mistakes.length}</button><button className="f-button f-button-outline" disabled={disabled || !weakModules.length} onClick={() => onPractice(weakModules, 'all')}>Проверить отмеченные блоки</button><button className="f-button f-button-outline" disabled={disabled} onClick={() => onPractice([], 'final')}>Смешанная проверка · 24 вопроса</button></div><p>Смешанная проверка использует знакомый банк и обычную обратную связь после ответа. Её процент показывает результат этой подборки, а не вероятность сдачи экзамена.</p><h3>Что считать итогом дня</h3><ul className={styles.recall}><li>Все 12 модулей просмотрены и все 120 вопросов хотя бы раз разобраны.</li><li>Ты различаешь сервисы по условиям задачи, а не по знакомому слову.</li><li>Ты можешь объяснить новые ситуации из блоков без открытого ответа.</li><li>Остался конкретный список пробелов на завтра; повтори его после сна.</li></ul><p>Если времени осталось мало, приоритет — темы, которые ты не можешь объяснить, и ошибки с высокой уверенностью. Не нужно добиваться красивого процента повторением уже выученных букв.</p></article>}
    <p className={styles.storage}>Заметки и самооценка сохраняются для твоего аккаунта в этом браузере. Результаты вопросов хранятся отдельно.</p>
  </section>;
}
