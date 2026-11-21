'use client';
import readings from '@/lib/philosophy/reading-index.json';
import guide from '@/lib/philosophy/study-guide.json';
import { countWords } from '@/lib/philosophy/practice';
import styles from './philosophy.module.css';

export default function StudyGuide({ section }: { section: 'example' | 'thinkers' | 'lectures' }) {
  const essay = guide.essay.paragraphs.map(p => p.text).join('\n\n');
  return <div lang="ru" className={styles.studyGuide}>
    {section === 'example' && <>
      <section className={styles.panel}>
        <p className={styles.eyebrow}>READ → UNDERSTAND → TRY</p>
        <h2>Одно полное эссе. Разберём по частям.</h2>
        <p>{guide.essay.case}</p><p className={styles.small}>{guide.essay.notice}</p>
        <details open><summary>Полное эссе на английском · {countWords(essay)} слов</summary>
          <article lang="en" className={styles.modelEssay}><h3>{guide.essay.title}</h3>{guide.essay.paragraphs.map(p => <p key={p.title}>{p.text}</p>)}</article>
        </details>
      </section>
      <div className={styles.lessons}>{guide.essay.paragraphs.map((p, i) => <details key={p.title} open={i === 0}>
        <summary>{i + 1}. {p.title} — разбор абзаца</summary>
        <blockquote lang="en" className={styles.englishExample}>{p.text}</blockquote>
        <h3>Зачем нужен этот абзац</h3><p>{p.explanation}</p>
        <h3>Его конструкция</h3><p>{p.structure}</p>
        <h3>Фраза, которую можно адаптировать</h3><p lang="en">{p.phrase}</p>
        <h3>Теперь твоя попытка</h3><p>{p.exercise}</p>
      </details>)}</div>
      <section className={styles.panel}><h2>Как написать своё, если пока трудно</h2><ol>
        <li>Выбери другой кейс во вкладке «Пишу и проверяю». Напиши по-русски одну проблему и свою позицию.</li>
        <li>Задай три вопроса: что это, откуда мы знаем, что важнее. На каждый дай короткий ответ.</li>
        <li>Выбери подходящую идею философа. Объясни её одним предложением, затем свяжи с конкретной деталью кейса.</li>
        <li>Добавь сильное возражение и свой ответ. Используй because, however, in this case, therefore.</li>
        <li>Переведи мысль простым английским. Сначала проверь один абзац через ИИ, исправь его и только потом собирай полное эссе.</li>
        <li>Закрой подсказки и повтори от руки за 50 минут. Ориентир — минимум 350 слов; не растягивай текст пустыми фразами.</li>
      </ol></section>
    </>}
    {section === 'thinkers' && <>
      <section className={styles.panel}><p className={styles.eyebrow}>THREE AT A TIME</p><h2>Философы по трое</h2>
        <p>Начни с первых трёх групп — это опоры для трёх частей эссе. Затем повторяй по одной дополнительной тройке. Здесь все 28 мыслителей, названных в текущем конспекте и практикуме, включая теоретиков культуры и общества.</p>
        <p>{guide.scope}</p><p>Не нужно вставлять всех троих в каждый абзац: выбирай идею, которая объясняет именно твой кейс. Некоторые имена повторяются намеренно.</p>
      </section>
      {guide.groups.map((g, i) => <section key={g.title} className={styles.panel}>
        <p className={styles.eyebrow}>GROUP {String(i + 1).padStart(2, '0')}</p><h2>{g.title}</h2><p>{g.question}</p>
        <div className={styles.thinkerGrid}>{g.ids.map(id => {
          const person = guide.thinkers[id as keyof typeof guide.thinkers];
          return <article key={id} className={styles.thinker}><h3>{person.name}</h3><small lang="en">{id}</small>
            <h4>Идея простыми словами</h4><p>{person.idea}</p><h4>Как применить к IT</h4><p>{person.application}</p>
            <details><summary>Фраза для эссе и частая ошибка</summary><p lang="en">{person.english}</p><p><strong>Не перепутай:</strong> {person.mistake}</p></details>
          </article>;
        })}</div>
        <p className={styles.small}>Проверь себя: закрой карточки, объясни разницу между тремя идеями и придумай по одному примеру.</p>
      </section>)}
      <section className={styles.panel}><h2>Ещё {readings.length} мыслителей из материалов LMS</h2>
        <p>Раскрой имя, объясни идею своими словами и найди деталь новости, к которой она применима. Ссылка ведёт к оригиналу в Moodle.</p>
        {readings.map(person => <details key={person.name}><summary>{person.name}</summary><p>{person.idea}</p><a href={`https://lms.astanait.edu.kz/mod/resource/view.php?id=${person.id}`}>{person.title}, с. {person.page}</a></details>)}
      </section>
    </>}
    {section === 'lectures' && <>
      <section className={styles.panel}><p className={styles.eyebrow}>LECTURES 01—10</p><h2>От первой лекции до последней — простыми словами</h2><p>{guide.scope}</p><p>Порядок: прочитай пример → объясни главную идею своими словами → реши мини-задание → открой ответ. Полный двуязычный конспект и ссылки на LMS находятся ниже.</p></section>
      <div className={styles.lessons}>{guide.lessons.map(l => <details key={l.number} open={l.number === 1}>
        <summary>{String(l.number).padStart(2, '0')}. {l.title}</summary><h3>{l.question}</h3><p>{l.explanation}</p>
        <h3>Разбираем по шагам</h3><ol>{l.steps.map(s => <li key={s}>{s}</li>)}</ol>
        <h3>Как применить в final</h3><p>{l.application}</p><p><strong>Частая ошибка:</strong> {l.mistake}</p>
        <p lang="en" className={styles.englishExample}>{l.english}</p><h3>Проверь понимание</h3><p>{l.exercise}</p>
        <details><summary>Показать возможный ответ</summary><p>{l.answer}</p></details>
      </details>)}</div>
    </>}
  </div>;
}
