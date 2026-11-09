"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import questions from "@/lib/events/computerNetworksEndterm/vrt.json";

const PAGE_SIZE = 15;
const panel = "rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6";

export default function NetworksVrt({ onExit }: { onExit: () => void }) {
  const [set, setSet] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const query = search.trim().toLocaleLowerCase();
  const filtered = questions.filter(q =>
    (set === "all" || q.set === Number(set)) &&
    `${q.id} ${q.prompt} ${q.options.join(" ")} ${q.answer} ${q.explanation}`.toLocaleLowerCase().includes(query),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return <section className="space-y-5" data-no-i18n data-testid="cn-vrt">
    <Button variant="ghost" onClick={onExit}>← К лекциям и конспектам</Button>
    <header className={`${panel} space-y-3`}>
      <h1 className="text-2xl font-bold">ВРТ — вопросы</h1>
      <p className="text-[var(--color-muted)]">100 вопросов · 4 набора · ответы и объяснения</p>
      <p>Сначала сформулируй ответ самостоятельно, затем раскрой объяснение. Вопросы в наборах могут повторяться.</p>
      <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
        <label className="space-y-1 text-sm"><span className="block">Набор ВРТ</span>
          <select aria-label="Набор ВРТ" value={set} onChange={e => { setSet(e.target.value); setPage(0); }} className="min-h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-base text-[var(--color-fg)]">
            <option value="all">Все наборы</option>
            {[1, 2, 3, 4].map(n => <option key={n} value={n}>Набор {n}</option>)}
          </select>
        </label>
        <label className="space-y-1 text-sm"><span className="block">Поиск по ВРТ</span>
          <input aria-label="Поиск по ВРТ" type="search" value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} placeholder="Тема, вопрос или термин" className="min-h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-base text-[var(--color-fg)]" />
        </label>
      </div>
    </header>
    <p role="status" aria-live="polite" className="text-sm text-[var(--color-muted)]">Найдено: {filtered.length} · страница {page + 1} / {pages}</p>
    <div key={`${set}:${query}:${page}`} className="space-y-4">
      {visible.map(q => <article key={q.id} className={`${panel} space-y-3`} data-testid="vrt-question" data-question-id={q.id}>
        <p className="text-sm text-[var(--color-muted)]">Набор {q.set} · вопрос {q.number}{q.topic !== null ? ` · модуль ${q.topic}` : ""}</p>
        <h2 className="whitespace-pre-line break-words text-lg font-semibold" data-selection-question lang="en">{q.prompt}</h2>
        {q.options.length > 0 && <ol className="list-[upper-alpha] space-y-2 pl-6">
          {q.options.map((option, i) => <li key={i} className="whitespace-pre-line break-words pl-1 leading-relaxed" data-selection-question lang="en">{option}</li>)}
        </ol>}
        {q.caution && <p className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 text-sm leading-relaxed" data-testid="vrt-caution" data-selection-question lang="ru">{q.caution}</p>}
        <details className="border-t border-[var(--color-border)] pt-1">
          <summary className="min-h-11 cursor-pointer py-3 font-semibold">Показать ответ и объяснение</summary>
          <div className="space-y-3 pb-2">
            {q.answer && <div><h3 className="mb-1 text-sm font-semibold text-[var(--color-muted)]">Ответ</h3><p className="whitespace-pre-line break-words font-semibold" data-testid="vrt-answer" data-selection-question lang="en">{q.answer}</p></div>}
            <div><h3 className="mb-1 text-sm font-semibold text-[var(--color-muted)]">Объяснение</h3><p className="whitespace-pre-line break-words leading-relaxed" data-testid="vrt-explanation" data-selection-question lang="ru">{q.explanation}</p></div>
          </div>
        </details>
      </article>)}
    </div>
    {filtered.length === 0 && <p className={panel}>Ничего не найдено. Попробуй другой запрос или выбери все наборы.</p>}
    {pages > 1 && <nav className="flex flex-wrap justify-between gap-3" aria-label="Страницы ВРТ">
      <Button disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))}>← Предыдущая страница</Button>
      <Button disabled={page + 1 >= pages} onClick={() => setPage(p => Math.min(pages - 1, p + 1))}>Следующая страница →</Button>
    </nav>}
  </section>;
}
