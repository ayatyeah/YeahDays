'use client';

import { useNotebookHash } from './useNotebookHash';
import { moduleGlossary } from '@/lib/events/awsMaterials/glossary';
import folders from './study-folders.module.css';
import dynamic from 'next/dynamic';
import { moduleWalkthrough } from '@/lib/events/awsMaterials/deepDive';
import catalog from '@/lib/events/awsMaterials/catalog.json';
import { studyTopics } from '@/lib/events/awsStudy/topics';
import { moduleSummaries } from '@/lib/events/awsMaterials/summaries';
import styles from './aws-course-materials.module.css';

const AwsPractice = dynamic(() => import('./AwsPractice'), { loading: () => <p role="status">Загружаем тест модуля…</p> });

export default function AwsCourseMaterials() {
  const hash = useNotebookHash().split('/');
  const course = catalog.find(course => course.id === hash[1]) ?? catalog[0];
  const courseId = course.id;
  const module = course.modules.find(module => module.number === Number(hash[2]));
  const coursePicker = <div className={styles.courses} aria-label="Курс AWS">{catalog.map(item => <button key={item.id} type="button" aria-pressed={item.id === courseId} onClick={() => { window.location.hash = `files/${item.id}`; }}><strong>{item.title}</strong><span>{item.modules.length} модулей</span></button>)}</div>;
  if (!module) return <section className={styles.root} lang="ru" aria-label="Папки модулей AWS">{coursePicker}<p>Выбери модуль. Внутри — короткий конспект, подробный разбор с примерами и тест по теме.</p><nav className={folders.grid} aria-label={`Модули ${course.title}`}>{course.modules.map(item => <a className={folders.folder} href={`#files/${courseId}/${item.number}/detailed`} key={item.number}><strong>{item.title}</strong><small>Кратко / Подробно · {courseId === 'developing' && [1,14].includes(item.number) ? 'Тест для повторения' : '10 вопросов'}</small><span aria-hidden="true">Открыть папку →</span></a>)}</nav></section>;
  const detailed = hash[3] !== 'short';
  const moduleNumber = module.number;
  const topic = studyTopics.find(topic => topic.course === courseId && topic.modules.includes(moduleNumber));
  const guide = module.items.find(item => /student guide/i.test(item.title));
  const { detail, sections } = moduleWalkthrough(`${courseId}-${moduleNumber}`);
  const summary = moduleSummaries[`${courseId}-${moduleNumber}`];
  return <section className={styles.root} lang="ru" aria-label="Материалы модулей AWS">
    <a className={folders.back} href={`#files/${courseId}`}>← К папкам модулей {course.title}</a>
      <article className={styles.paper} key={`${courseId}:${moduleNumber}`}>
        <p className={styles.eyebrow}>{course.title} · Модуль {moduleNumber}</p><h2>{module.title.replace(/^Module \d+\s*[-:]\s*/, '')}</h2>
        <nav className={folders.mode} aria-label="Объём модуля"><a href={`#files/${courseId}/${moduleNumber}/short`} aria-current={!detailed ? 'page' : undefined}>Короткий модуль</a><a href={`#files/${courseId}/${moduleNumber}/detailed`} aria-current={detailed ? 'page' : undefined}>Подробный модуль</a></nav>

        {summary && <section className={styles.summary}>
          <h3>Главное простыми словами</h3><p>{summary.idea}</p>
          <ul>{summary.points.map(point => <li key={point}>{point}</li>)}</ul>
          <aside className={styles.study}><h3>Пример</h3><p>{summary.example}</p></aside>
          <h3>Проверь понимание</h3><p>{summary.check}</p>

        </section>}
        {detailed && <section className={styles.deep} aria-label="Подробное объяснение модуля">
          <h3>Разберём незнакомые слова</h3><dl>{moduleGlossary(`${courseId}-${moduleNumber}`).map(({term,meaning}) => <div key={term}><dt>{term}</dt><dd>{meaning}</dd></div>)}</dl>
          {sections.length > 0 && <><h3>Как это работает</h3>{sections.map(part => <section key={part.title}><h4>{part.title.replace(/^\d+\. /, '')}</h4><p>{part.text}</p></section>)}</>}
          <h3>Разбор задачи по шагам</h3><p><strong>{detail.task}</strong></p><ol>{detail.steps.map(step => <li key={step}>{step}</li>)}</ol>
          <aside className={styles.study}><h3>А если поменять условие?</h3><p>{detail.change}</p><details><summary>Проверить своё рассуждение</summary><p>{detail.answer}</p></details></aside>
          <h3>Типичная ошибка</h3><p>{detail.trap}</p>
          <p className={styles.eyebrow}>Объяснения и учебные примеры составлены на русском для понимания темы. В тесте ниже сохранены исходные вопросы и варианты AWS Academy.</p>
        </section>}
        <AwsPractice key={`${courseId}-${moduleNumber}`} course={courseId as 'foundations' | 'developing'} module={moduleNumber} embedded/>
        {topic && <p><a href={`#aws-notes/${topic.id}`}>Связанный конспект: {topic.title} →</a></p>}
        <details><summary>Исходные материалы AWS Academy</summary>
          {guide && <a className={styles.primary} href={guide.url} target="_blank" rel="noreferrer">Открыть Student Guide ↗</a>}
          <p>Порядок и названия разделов сохранены из AWS Academy.</p>
          <ul className={styles.resources}>{module.items.filter(item => !/student guide|knowledge check/i.test(item.title)).map(item => <li key={item.url}><a href={item.url} target="_blank" rel="noreferrer">{item.title}<span aria-hidden="true">↗</span></a></li>)}</ul>
        </details>
        {module.readings.length > 0 && <details><summary>Дополнительное чтение из курса · {module.readings.length}</summary><ul className={styles.resources}>{module.readings.map(item => <li key={item.url}><a href={item.url} target="_blank" rel="noreferrer">{item.title}<span aria-hidden="true">↗</span></a></li>)}</ul></details>}
        <a href={course.source} target="_blank" rel="noreferrer">Полное оглавление курса в AWS Academy ↗</a>
      </article>
  </section>;
}
