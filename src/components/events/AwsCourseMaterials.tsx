'use client';

import { useSyncExternalStore } from 'react';
import catalog from '@/lib/events/awsMaterials/catalog.json';
import { studyTopics } from '@/lib/events/awsStudy/topics';
import { moduleSummaries } from '@/lib/events/awsMaterials/summaries';
import styles from './aws-course-materials.module.css';

function subscribe(listener: () => void) {
  window.addEventListener('hashchange', listener);
  return () => window.removeEventListener('hashchange', listener);
}
const snapshot = () => window.location.hash;
const serverSnapshot = () => '#files';
export default function AwsCourseMaterials() {
  const hash = useSyncExternalStore(subscribe, snapshot, serverSnapshot).split('/');
  const course = catalog.find(course => course.id === hash[1]) ?? catalog[0];
  const courseId = course.id;
  const module = course.modules.find(module => module.number === Number(hash[2])) ?? course.modules[0];
  const moduleNumber = module.number;
  const topic = studyTopics.find(topic => topic.course === courseId && topic.modules.includes(moduleNumber));
  const guide = module.items.find(item => /student guide/i.test(item.title));
  const summary = moduleSummaries[`${courseId}-${moduleNumber}`];
  return <section className={styles.root} lang="ru" aria-label="Материалы модулей AWS">
    <p>Материалы из двух пройденных курсов AWS Academy. Начинай со Student Guide: в нём слайды и текстовые пояснения. Оригиналы открываются в твоём аккаунте AWS Academy.</p>
    <div className={styles.courses} aria-label="Курс AWS">{catalog.map(item => <button key={item.id} type="button" aria-pressed={item.id === courseId} onClick={() => { window.location.hash = `files/${item.id}/1`; }}><strong>{item.title}</strong><span>{item.modules.length} модулей</span></button>)}</div>
    <label className={styles.mobileChooser}>Модуль<select value={moduleNumber} onChange={event => { window.location.hash = `files/${courseId}/${event.target.value}`; }}>{course.modules.map(item => <option key={item.number} value={item.number}>{item.title}</option>)}</select></label>
    <div className={styles.layout}>
      <nav className={styles.modules} aria-label={`Модули ${course.title}`}>{course.modules.map(item => <button key={item.number} type="button" aria-current={item.number === moduleNumber ? 'true' : undefined} onClick={() => { window.location.hash = `files/${courseId}/${item.number}`; }}>{item.title}</button>)}</nav>
      <article className={styles.paper} key={`${courseId}:${moduleNumber}`}>
        <p className={styles.eyebrow}>{course.title} · Модуль {moduleNumber}</p><h2>{module.title.replace(/^Module \d+\s*[-:]\s*/, '')}</h2>
        {guide && <a className={styles.primary} href={guide.url} target="_blank" rel="noreferrer">Открыть Student Guide ↗</a>}
        {summary && <section className={styles.summary}>
          <h3>Главное простыми словами</h3><p>{summary.idea}</p>
          <ul>{summary.points.map(point => <li key={point}>{point}</li>)}</ul>
          <aside className={styles.study}><h3>Пример</h3><p>{summary.example}</p></aside>
          <h3>Проверь понимание</h3><p>{summary.check}</p>
          <p className={styles.eyebrow}>Краткий разбор основных тем Student Guide на русском. Примеры составлены для объяснения; полный материал — в оригинальном пособии.</p>
        </section>}
        <h3>Содержание модуля</h3><p>Порядок и названия разделов сохранены из AWS Academy.</p>
        <ul className={styles.resources}>{module.items.filter(item => !/student guide|knowledge check/i.test(item.title)).map(item => <li key={item.url}><a href={item.url} target="_blank" rel="noreferrer">{item.title}<span aria-hidden="true">↗</span></a></li>)}</ul>
        {topic && <aside className={styles.study}><h3>Разобраться и закрепить</h3><p>{topic.goal}</p><a href={`#aws-notes/${topic.id}`}>Понятный конспект и тесты по теме →</a></aside>}
        {module.readings.length > 0 && <details><summary>Дополнительное чтение из курса · {module.readings.length}</summary><ul className={styles.resources}>{module.readings.map(item => <li key={item.url}><a href={item.url} target="_blank" rel="noreferrer">{item.title}<span aria-hidden="true">↗</span></a></li>)}</ul></details>}
        <a href={course.source} target="_blank" rel="noreferrer">Полное оглавление курса в AWS Academy ↗</a>
      </article>
    </div>
  </section>;
}
