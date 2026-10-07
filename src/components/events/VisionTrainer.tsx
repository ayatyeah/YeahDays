"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import EventNotes from "@/components/EventNotes";
import { cn } from "@/lib/cn";
import { checkField, generate, TRAINER_KINDS, type TrainerKind } from "@/lib/visionTrainer";
import { openTutor, useTutorDetail } from "@/lib/tutorFocus";

/**
 * Тренажёр расчётов: задача с новыми числами, поля для ответа, проверка
 * сразу и без ИИ, пошаговое решение. Счёт по типам задач — на устройстве:
 * это тренировка, в готовность ивента он не идёт.
 */

type Stats = Record<string, { solved: number; tried: number; streak: number; best: number }>;
const key = (userId: string) => `yg-trainer:${userId}`;
const newSeed = () => Math.floor(Math.random() * 2 ** 31);

function loadStats(userId: string): Stats {
  try {
    return JSON.parse(localStorage.getItem(key(userId)) ?? "{}") as Stats;
  } catch {
    return {};
  }
}

export default function VisionTrainer({ userId, initialKind, onExit }: { userId: string; initialKind?: TrainerKind; onExit: () => void }) {
  const [kind, setKind] = useState<TrainerKind>(initialKind ?? "linear");
  const [seed, setSeed] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Record<string, boolean> | null>(null);
  const [solution, setSolution] = useState(false);
  const [stats, setStats] = useState<Stats>({});

  // seed выбираем после монтирования: случайное число на сервере и в браузере разошлось бы
  useEffect(() => {
    setSeed(newSeed());
    setStats(loadStats(userId));
  }, [userId]);

  const task = useMemo(() => (seed ? generate(kind, seed) : null), [kind, seed]);
  useTutorDetail(task && { trainer: { kind, seed, inputs: values, checked: result !== null } }, TRAINER_KINDS.find((k) => k.kind === kind)?.title ?? "");
  const mine = stats[kind] ?? { solved: 0, tried: 0, streak: 0, best: 0 };
  const allRight = result !== null && Object.values(result).every(Boolean);

  function next(k: TrainerKind = kind) {
    setKind(k);
    setSeed(newSeed());
    setValues({});
    setResult(null);
    setSolution(false);
  }

  function check() {
    if (!task) return;
    const r = Object.fromEntries(task.fields.map((f) => [f.id, checkField(f, values[f.id] ?? "")]));
    const ok = Object.values(r).every(Boolean);
    setResult(r);
    if (ok) setSolution(true);
    // первая проверка задачи идёт в счёт; повторные после исправления — нет
    if (result === null) {
      const s = { ...mine, tried: mine.tried + 1, solved: mine.solved + (ok ? 1 : 0), streak: ok ? mine.streak + 1 : 0 };
      s.best = Math.max(s.best, s.streak);
      const all = { ...stats, [kind]: s };
      setStats(all);
      try {
        localStorage.setItem(key(userId), JSON.stringify(all));
      } catch {
        /* без хранилища счёт проживёт до закрытия */
      }
    }
  }

  return (
    <div className="space-y-5 pb-10">
      <header className="space-y-2">
        <button className="text-sm underline" onClick={onExit}>← К маршруту</button>
        <h1 className="text-2xl font-bold">Тренажёр расчётов</h1>
        <p className="text-sm text-[var(--color-muted)]">Каждый раз новые числа. Пиши ответ — проверка сразу, а в решении видно шаг с ошибкой. Это почти половина баллов мидтерма.</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {TRAINER_KINDS.map((k) => (
          <button
            key={k.kind}
            onClick={() => next(k.kind)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition",
              k.kind === kind ? "border-[var(--color-fg)] bg-[var(--color-surface-2)] font-semibold" : "border-[var(--color-border)] text-[var(--color-muted)]",
            )}
          >
            {k.title} <span className="text-xs opacity-60">{k.exam}</span>
          </button>
        ))}
      </div>

      <p className="text-sm text-[var(--color-muted)]">
        Решено с первого раза: <b className="text-[var(--color-fg)]">{mine.solved}</b> из {mine.tried} · серия <b className="text-[var(--color-fg)]">{mine.streak}</b> · лучшая {mine.best}
      </p>

      {task && (
        <section className="space-y-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div lang="en"><EventNotes text={task.prompt} lang="en" /></div>

          <div className="grid gap-3 sm:grid-cols-2">
            {task.fields.map((f) => {
              const ok = result?.[f.id];
              const ring = result === null ? "border-[var(--color-border)]" : ok ? "border-emerald-400" : "border-red-400";
              return (
                <label key={f.id} className="block" lang="en">
                  <span className="mb-1 block text-sm font-medium">{f.label}{result !== null && <span className="ml-1">{ok ? "✓" : "✗"}</span>}</span>
                  {f.type === "choice" ? (
                    <select
                      value={values[f.id] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
                      className={cn("h-11 w-full rounded-2xl border-2 bg-[var(--color-surface-2)] px-3 text-[15px] outline-none", ring)}
                    >
                      <option value="" disabled>—</option>
                      {f.options!.map((o, i) => <option key={o} value={String(i)}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      inputMode="decimal"
                      value={values[f.id] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === "Enter") check(); }}
                      className={cn("h-11 w-full rounded-2xl border-2 bg-[var(--color-surface-2)] px-3 font-mono text-[16px] outline-none", ring)}
                    />
                  )}
                  {f.hint && <span className="mt-1 block text-xs text-[var(--color-muted)]">{f.hint}</span>}
                </label>
              );
            })}
          </div>

          {result !== null && (
            <p role="status" className={cn("rounded-2xl border px-4 py-2.5 text-sm font-semibold", allRight ? "border-emerald-400/60 bg-emerald-500/10" : "border-amber-400/60 bg-amber-500/10")}>
              {allRight ? `Верно! Серия: ${mine.streak}` : "Есть ошибки — исправь поля с ✗ или открой решение"}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={check}>Проверить</Button>
            <Button variant="ghost" onClick={() => setSolution((s) => !s)}>{solution ? "Скрыть решение" : "Показать решение"}</Button>
            <Button onClick={() => next()}>Новая задача →</Button>
            <Button variant="ghost" onClick={() => openTutor(result !== null && !allRight ? "Где ошибка в моём решении? Подскажи, не решая всё целиком." : "Подскажи первый шаг к этой задаче, не решая её целиком.")}>✦ Подсказка от ИИ</Button>
          </div>

          {solution && (
            <div lang="en" className="rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] px-4 py-3 text-sm">
              <EventNotes text={task.steps} lang="en" />
            </div>
          )}
        </section>
      )}
    </div>
  );
}
