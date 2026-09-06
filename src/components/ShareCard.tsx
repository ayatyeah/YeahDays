"use client";

import { useMemo, useState } from "react";
import {
  useUserStore,
  useStreak,
  selectStats,
  selectTotalXp,
  selectCompleted,
} from "@/store/useUserStore";
import { getLevelProgress } from "@/lib/leveling";
import { track } from "@/lib/analytics";
import { YgIcon } from "@/components/yg-icons";

/**
 * Карточка прогресса для шеринга.
 *
 * Человек охотно публикует свой результат и почти никогда — ссылку на
 * приложение. Поэтому делимся картинкой со стриком и статами: это
 * единственная реклама, которую распространяют добровольно.
 *
 * Картинку рисует сервер (/api/share) — на клиенте не нужен ни canvas,
 * ни библиотеки, и результат одинаков на всех устройствах.
 */
export default function ShareCard() {
  const name = useUserStore((s) => s.name);
  const plan = useUserStore((s) => s.plan);
  const todos = useUserStore((s) => s.todos);
  const streak = useStreak();
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const stats = useMemo(() => selectStats(plan, todos), [plan, todos]);
  const xp = useMemo(() => selectTotalXp(plan, todos), [plan, todos]);
  const done = useMemo(() => selectCompleted(plan).length, [plan]);
  const level = getLevelProgress(xp).level;

  const url = useMemo(() => {
    const p = new URLSearchParams({
      name,
      level: String(level),
      streak: String(streak),
      done: String(done),
      xp: String(xp),
      strength: String(stats.strength),
      intelligence: String(stats.intelligence),
      wealth: String(stats.wealth),
      stability: String(stats.stability),
      health: String(stats.health),
    });
    return `/api/share?${p.toString()}`;
  }, [name, level, streak, done, xp, stats]);

  async function share() {
    setBusy(true);
    setNote(null);
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const file = new File([blob], "yeahgrind.png", { type: "image/png" });
      track("share_created", { streak, done });

      // нативный шеринг там, где он есть — сразу в сторис/мессенджер
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "YeahGrind",
          text: `Стрик ${streak} — ${done} действий`,
        });
        return;
      }

      // иначе просто скачиваем картинку
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = "yeahgrind.png";
      a.click();
      URL.revokeObjectURL(href);
      setNote("Картинка сохранена");
    } catch {
      setNote("Не получилось — попробуй ещё раз");
    } finally {
      setBusy(false);
    }
  }

  if (done === 0) return null; // делиться пока нечем

  return (
    <section className="press rounded-3xl surface p-4">
      <div className="flex items-start gap-3">
        <span className="text-[22px]" aria-hidden>
          <YgIcon name="sparkle" className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold">Поделиться прогрессом</p>
          <p className="mt-1 text-[13px] leading-snug text-[var(--color-muted)]">
            Картинка для сторис или чата
          </p>
        </div>
      </div>
      <button
        onClick={share}
        disabled={busy}
        className="mt-3 h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[15px] font-semibold transition active:scale-[0.99] disabled:opacity-60"
      >
        {busy ? "Готовлю…" : "Создать картинку"}
      </button>
      {note && (
        <p className="mt-2 text-center text-[13px] text-[var(--color-muted)]">
          {note}
        </p>
      )}
    </section>
  );
}
