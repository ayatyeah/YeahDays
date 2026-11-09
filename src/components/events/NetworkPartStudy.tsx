"use client";
import { useState, type ReactNode } from "react";
import Button from "@/components/ui/Button";
import bank from "@/lib/events/computerNetworksEndterm/bank.json";
import recall from "@/lib/events/computerNetworksEndterm/express.json";

/** Study material stays inside the existing lecture part, alongside its graded quiz. */
export default function NetworkPartStudy({ module, lang, children }: { module: number; lang: "ru" | "en"; children: ReactNode }) {
  const [tab, setTab] = useState<"notes" | "recall" | "questions">("notes");
  const cards = bank.filter(q => q.topic === module);
  const prompts = recall.filter(q => q.module === module);
  const panel = "space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6";
  return <section className="space-y-4" data-testid="network-part-study" data-module={module} data-no-i18n>
    <nav aria-label="Материалы этой части" className="flex flex-wrap gap-2">
      <Button aria-pressed={tab === "notes"} variant={tab === "notes" ? "primary" : "ghost"} onClick={() => setTab("notes")}>Конспект</Button>
      <Button aria-pressed={tab === "recall"} variant={tab === "recall" ? "primary" : "ghost"} onClick={() => setTab("recall")}>Самопроверка · {prompts.length}</Button>
      <Button aria-pressed={tab === "questions"} variant={tab === "questions" ? "primary" : "ghost"} onClick={() => setTab("questions")}>Все вопросы части · {cards.length}</Button>
    </nav>
    {tab === "notes" && children}
    {tab === "recall" && <div className="space-y-3">
      <h2 className="text-xl font-bold">Экспресс-самопроверка · модуль {module}</h2>
      <p>Сначала ответь вслух без подсказки. Затем раскрой объяснение. Эти упражнения не меняют результат квиза.</p>
      {prompts.map(q => <article key={q.id} className={panel}><h3 className="font-semibold" data-selection-question lang="ru">{q.question}</h3><details><summary className="cursor-pointer py-2">Проверить объяснение</summary><p className="mt-3 leading-relaxed" data-selection-question lang="ru">{q.answer}</p><p className="mt-3 text-sm" data-selection-question lang="en">{q.english}</p></details></article>)}
    </div>}
    {tab === "questions" && <div className="space-y-3">
      <h2 className="text-xl font-bold">Вопросы с разбором · модуль {module}</h2>
      <p>Весь банк этой темы прямо в части лекции. Квиз ниже выбирает 8 вопросов для тренировки; здесь можно разобрать все. Карточки с оговорками не входят в автоматическое оценивание.</p>
      {cards.map(q => <article key={q.id} className={panel}>
        <p className="text-xs text-[var(--color-muted)]">{q.id} · {q.source}</p>
        <h3 className="font-semibold" data-selection-question lang="en">{q.prompt}</h3>
        <ol className="list-decimal space-y-2 pl-6" data-selection-question lang="en">{q.options.map((o,i) => <li key={i}>{o}</li>)}</ol>
        {q.caution && <p className="rounded-xl bg-amber-500/10 p-3 text-sm">{q.caution}</p>}
        <details><summary className="cursor-pointer py-2 font-semibold">Ответ и объяснение</summary><p className="mt-3 font-medium" data-selection-question lang="en">{q.answerText}</p><p className="mt-3 whitespace-pre-line leading-relaxed" data-selection-question lang={lang}>{lang === "en" ? q.explanationEn : q.explanation}</p></details>
      </article>)}
    </div>}
  </section>;
}
