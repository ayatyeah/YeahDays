import type { PlainLesson } from '@/lib/events/awsStudy/lessons';
import styles from './aws-one-day.module.css';

export default function AwsPlainLesson({ lesson }: { lesson: PlainLesson }) {
  return <section aria-label="Объяснение темы простыми словами">
    <h3>Сначала поймём идею</h3><p>{lesson.idea}</p>
    <section className={styles.analogy}><h4>Представь знакомую ситуацию</h4><p>{lesson.analogy}</p></section>
    <h3>Слова, которые понадобятся</h3>
    <p>Английские термины оставлены рядом: именно так они встречаются в исходных вопросах.</p>
    <dl className={styles.glossary}>{lesson.terms.map(item => <div key={item.term}><dt>{item.term}</dt><dd>{item.meaning}</dd></div>)}</dl>
    <h3>Разберём по шагам</h3>
    {lesson.walkthrough.map(part => <section className={styles.concept} key={part.title}><h4>{part.title}</h4><p>{part.text}</p></section>)}
    <section className={styles.case}><h3>Пример: от условия до решения</h3><p><strong>Задача:</strong> {lesson.scenario.task}</p><ol>{lesson.scenario.steps.map(step => <li key={step}>{step}</li>)}</ol>
      <h4>Меняем условие</h4><p>{lesson.scenario.change}</p><p className={styles.storage}>Сначала попробуй ответить сам. Найди, какое требование изменилось и как оно влияет на выбор.</p>
      <details><summary>Посмотреть, как меняется решение</summary><p>{lesson.scenario.changedAnswer}</p></details>
    </section>
    <h3>Где легко запутаться</h3><ul className={styles.recall}>{lesson.traps.map(trap => <li key={trap}>{trap}</li>)}</ul>
    <h3>Проверка понимания, а не памяти</h3><p>Ответь своими словами до открытия разбора. Хороший ответ связывает условие, выбор и причину — даже без точного воспроизведения текста.</p>
    {lesson.checks.map((check, index) => <section className={styles.scenario} key={check.question}><h4>{index + 1}. {check.question}</h4><details><summary>Сравнить своё объяснение</summary><p>{check.answer}</p></details></section>)}
    <p className={styles.storage}>Примеры и задачи в этом разделе составлены для обучения. Это не дополнительные вопросы из AWS Academy. Исходные 220 вопросов и их варианты находятся ниже и в тестах.</p>
  </section>;
}
