'use client';
import { useEffect, useState } from 'react';
import { useNotebookHash } from './useNotebookHash';
import sections from '@/lib/events/awsTerms/terms.json';
import styles from './aws-terms.module.css';

const total = sections.reduce((sum, section) => sum + section.terms.length, 0);
export default function AwsTerms() {
  const hash = useNotebookHash();
  useEffect(() => {
    const target = document.getElementById(`term-${hash.split('/')[1]}`);
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }, [hash]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const needle = query.trim().toLocaleLowerCase();
  const visible = sections.filter(section => category === 'all' || category === section.id).map(section => ({ ...section, terms: section.terms.filter(term => [term.name, term.meaning, term.example, term.distinction].join(' ').toLocaleLowerCase().includes(needle)) })).filter(section => section.terms.length);
  const found = visible.reduce((sum, section) => sum + section.terms.length, 0);
  return <section className={styles.root} lang="ru" aria-label="Словарь AWS">
    <p>Словарь по Cloud Foundations и Cloud Developing с дополнительной картой типов баз данных. Всего карточек: {total}. В каждой — объяснение, пример и важное различие. Это учебное объяснение, а не полный каталог всех продуктов AWS.</p>
    <a className="f-button" href="#terms-quiz">Проверить себя · {total} вопросов →</a>
    <div className={styles.filters}>
      <label>Найти термин<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Например: DynamoDB, очередь, ключ"/></label>
      <label>Раздел<select value={category} onChange={event => setCategory(event.target.value)}><option value="all">Все разделы</option>{sections.map(section => <option key={section.id} value={section.id}>{section.title}</option>)}</select></label>
      <button type="button" onClick={() => { setQuery(''); setCategory('all'); }} disabled={!query && category === 'all'}>Сбросить</button>
    </div>
    <p role="status">Показано {found} из {total}</p>
    {found === 0 && <p className={styles.empty}>Совпадений нет. Попробуй сокращение (S3, RDS, IAM), русское название или выбери «Все разделы».</p>}
    {visible.map(section => <section key={section.id} className={styles.section} aria-labelledby={`terms-${section.id}`}>
      <h2 id={`terms-${section.id}`}>{section.title}</h2>
      <dl className={styles.cards}>{section.terms.map(term => <div id={`term-${term.id}`} tabIndex={-1} style={{ scrollMarginTop: 160 }} className={styles.card} key={term.id}>
        <dt>{term.name}</dt><dd><p>{term.meaning}</p><p><strong>Пример:</strong> {term.example}</p><p className={styles.distinction}><strong>Важно различать:</strong> {term.distinction}</p></dd>
      </div>)}</dl>
    </section>)}
    <details className={styles.sources}><summary>На чём основан словарь</summary><p>Авторские объяснения по темам двух курсов и их Knowledge Checks. Дополнительные типы БД включены для общей картины; не каждый термин является отдельным экзаменационным вопросом. Старые названия из курса обозначены отдельно.</p><ul>
      <li><a href="https://awsacademy.instructure.com/courses/188512/modules" target="_blank" rel="noreferrer">AWS Academy Cloud Foundations</a></li>
      <li><a href="https://awsacademy.instructure.com/courses/193042/modules" target="_blank" rel="noreferrer">AWS Academy Cloud Developing</a></li>
      <li><a href="https://docs.aws.amazon.com/decision-guides/latest/decision-guides/databases-on-aws-how-to-choose.html" target="_blank" rel="noreferrer">AWS: выбор базы данных</a></li>
      <li><a href="https://docs.aws.amazon.com/whitepapers/latest/aws-overview/amazon-web-services-cloud-platform.html" target="_blank" rel="noreferrer">AWS: сервисы по категориям</a></li>
      <li><a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html" target="_blank" rel="noreferrer">DynamoDB: ключи, индексы и Streams</a></li>
    </ul></details>
  </section>;
}
