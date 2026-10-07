"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Вопрос для самопроверки внутри конспекта («?? вопрос» и «?= ответ»).
 *
 * Не квиз: вариантов нет, человек отвечает про себя или вслух, открывает
 * ответ и сам отмечает, знал ли. Ничего не сохраняется — это способ
 * читать активно, а не ещё один счётчик.
 */
export default function CheckQuestion({ question, answer, lang }: { question: string; answer: string; lang: string }) {
  const [state, setState] = useState<"closed" | "open" | "known" | "repeat">("closed");
  const ru = lang === "ru";
  return (
    <div className={cn("rounded-2xl border px-4 py-3", state === "known" ? "border-emerald-400/60 bg-emerald-500/10" : state === "repeat" ? "border-amber-400/60 bg-amber-500/10" : "border-[var(--color-border-strong)] bg-[var(--color-surface-2)]")}>
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">{ru ? "Проверь себя" : "Check yourself"}</p>
      <p className="mt-1 font-medium">{question}</p>
      {state === "closed" ? (
        <button className="mt-2 text-sm font-semibold text-[var(--color-intelligence)] underline" onClick={() => setState("open")}>{ru ? "Показать ответ" : "Show the answer"}</button>
      ) : (
        <>
          <p className="mt-2 rounded-xl bg-[var(--color-bg)] px-3 py-2 text-sm">{answer}</p>
          {state === "open" && (
            <div className="mt-2 flex gap-2">
              <button className="rounded-xl bg-emerald-500/20 px-3 py-1.5 text-sm font-semibold" onClick={() => setState("known")}>{ru ? "Знаю" : "I knew it"}</button>
              <button className="rounded-xl bg-amber-500/20 px-3 py-1.5 text-sm font-semibold" onClick={() => setState("repeat")}>{ru ? "Повторить" : "Review again"}</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
