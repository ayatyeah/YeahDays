import Link from "next/link";
import { notFound } from "next/navigation";
import notes from "@/lib/events/cloudComputingEndterm/examNotes.json";
import questions from "@/lib/events/cloudComputingEndterm/questions.json";
import styles from "@/components/events/cloud-endterm.module.css";

export function generateStaticParams() { return [{ id: "cloud-computing-endterm" }]; }
export default async function ExamNotesPage({ params }: { params: Promise<{ id: string }> }) {
  if ((await params).id !== "cloud-computing-endterm") notFound();
  return <main className={styles.root} data-no-i18n>
    <Link className={styles.back} href="/events/cloud-computing-endterm">← К ивенту Cloud Computing</Link>
    <header className={styles.header}><div><p>Подготовка по 47 экзаменационным вопросам</p><h1>Конспект по частям</h1><p className={styles.subtitle}>Понятия, примеры и различия, которые помогают выбрать ответ.</p></div></header>
    <div className={styles.layout}>
      <aside className={styles.outline}><nav aria-label="Части конспекта"><h2>47 коротких частей</h2>{notes.map((n, i) => <a key={n.questionId} href={`#${n.questionId}`} className="block rounded-lg px-2 py-2 text-sm hover:bg-[var(--color-surface-2)]">{i + 1}. {n.title}</a>)}</nav></aside>
      <div className="min-w-0 space-y-6">{notes.map((n, i) => <article key={n.questionId} id={n.questionId} className={`${styles.reader} scroll-mt-24`}>
        <p className={styles.source}>Часть {i + 1} из {notes.length} · Вопрос {questions.find(q => q.id === n.questionId)?.number}</p>
        <h2>{n.title}</h2>{n.body.map((p, j) => <p key={j}>{p}</p>)}
        <details className={styles.check}><summary>Источники и документация</summary><ul className="space-y-2">{n.sources.map(s => <li key={s.url}><a className="underline" href={s.url} target="_blank" rel="noreferrer">{s.title}</a></li>)}</ul></details>
        <div className={styles.actions}>{i > 0 && <a className="underline" href={`#${notes[i - 1].questionId}`}>← Предыдущая часть</a>}{i < notes.length - 1 && <a className="underline" href={`#${notes[i + 1].questionId}`}>Следующая часть →</a>}</div>
      </article>)}</div>
    </div>
  </main>;
}
