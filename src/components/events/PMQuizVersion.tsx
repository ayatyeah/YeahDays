"use client";
export type PMQuizMode = "learn" | "sprints";
export default function PMQuizVersion({ mode, onChange }: { mode: PMQuizMode; onChange: (mode: PMQuizMode) => void }) {
  return <label className="mx-auto flex min-h-11 w-full max-w-6xl items-center gap-3 py-1 text-sm font-semibold">Версия
    <select aria-label="Версия квиза" data-testid="pm-quiz-version" value={mode} onChange={e => onChange(e.target.value as PMQuizMode)} className="min-h-11 min-w-0 flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-base">
      <option value="learn">1 · Обучение</option><option value="sprints">2 · Спринты — как тест</option>
    </select>
  </label>;
}
