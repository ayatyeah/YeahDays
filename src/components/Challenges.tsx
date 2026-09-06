"use client";

import { useMemo } from "react";
import {
  useUserStore,
  isChallengeActive,
  challengeDayLevel,
  challengeDaysLeft,
  type Challenge,
} from "@/store/useUserStore";
import { dateKey, currentSlot, STATS } from "@/lib/domain";
import { cn } from "@/lib/cn";
import { YgIcon } from "@/components/yg-icons";

const SLOT_LABEL: Record<string, string> = {
  morning: "утро",
  afternoon: "день",
  evening: "вечер",
};

/**
 * Ежедневные челленджи.
 *
 * В отличие от целей («сделай N за месяц, когда получится») челлендж —
 * это обязательство на каждый день, и день имеет уровень: жёлтый или
 * зелёный. Отсюда и цвета в календаре.
 */
export default function Challenges() {
  const challenges = useUserStore((s) => s.challenges);
  const logChallenge = useUserStore((s) => s.logChallenge);

  const today = dateKey();
  const active = useMemo(
    () => challenges.filter((c) => isChallengeActive(c, today)),
    [challenges, today],
  );

  if (active.length === 0) return null;

  return (
    <section className="mt-5">
      <h2 className="mb-3 text-[15px] font-semibold text-[var(--color-fg-dim)]">
        Челленджи
      </h2>
      <div className="space-y-2.5">
        {active.map((c) => (
          <ChallengeRow
            key={c.id}
            challenge={c}
            today={today}
            onLog={(delta) => logChallenge(c.id, delta)}
          />
        ))}
      </div>
    </section>
  );
}

function ChallengeRow({
  challenge: c,
  today,
  onLog,
}: {
  challenge: Challenge;
  today: string;
  onLog: (delta: number) => void;
}) {
  const done = c.log[today] ?? 0;
  const level = challengeDayLevel(c, today);
  const left = challengeDaysLeft(c);
  const stat = STATS[c.stat];

  const pct = Math.min(100, Math.round((done / c.green) * 100));
  const yellowAt = Math.round((c.yellow / c.green) * 100);

  const color =
    level === "green"
      ? "var(--color-stability)"
      : level === "yellow"
        ? "var(--color-wealth)"
        : stat.hex;

  // Быстрые кнопки: для подходов — размер подхода, иначе штучно.
  const setSize = c.sets?.[0]?.reps;
  const steps = setSize ? [10, setSize] : [1, 5];

  return (
    <div className="press rounded-3xl surface p-4">
      <div className="flex items-start gap-2">
        <span className="text-[16px]" style={{ color: stat.hex }} aria-hidden>
          <YgIcon name={stat.icon} className="h-[18px] w-[18px]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[16px] font-semibold">{c.title}</p>
          <p className="mt-0.5 text-[13px] text-[var(--color-muted)]">
            {done} из {c.green} {c.unit}
            {level === "green"
              ? " · день зелёный"
              : level === "yellow"
                ? ` · жёлтый, до зелёного ${c.green - done}`
                : ` · до жёлтого ${Math.max(0, c.yellow - done)}`}
          </p>
        </div>
        <span className="shrink-0 text-[12px] tabular-nums text-[var(--color-muted)]">
          {left >= 0 ? `${left} дн` : "финиш"}
        </span>
      </div>

      {/* Полоса с меткой жёлтого порога */}
      <div className="relative mt-3 h-2 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
        <div
          className="absolute top-0 h-full w-px bg-[var(--color-muted)] opacity-60"
          style={{ left: `${yellowAt}%` }}
          aria-hidden
        />
      </div>

      {/* Подходы по времени суток */}
      {c.sets && c.sets.length > 0 && (
        <div className="mt-2.5 flex gap-1.5">
          {c.sets.map((s, i) => {
            const filled = done >= c.sets!.slice(0, i + 1).reduce((a, x) => a + x.reps, 0);
            const isNow = s.slot === currentSlot();
            return (
              <div
                key={`${s.slot}-${i}`}
                className={cn(
                  "flex-1 rounded-xl border px-2 py-1.5 text-center text-[12px] transition",
                  filled
                    ? "border-transparent bg-[var(--color-surface-2)] text-[var(--color-fg)]"
                    : "border-[var(--color-border)] text-[var(--color-muted)]",
                  isNow && !filled && "border-[var(--color-fg-dim)]",
                )}
              >
                {filled ? <YgIcon name="check" className="h-3.5 w-3.5" strokeWidth={2.4} /> : s.reps} · {SLOT_LABEL[s.slot]}
              </div>
            );
          })}
        </div>
      )}

      {/* Быстрый ввод */}
      <div className="mt-3 flex gap-2">
        {steps.map((n) => (
          <button
            key={n}
            onClick={() => onLog(n)}
            className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] py-2 text-[15px] font-semibold transition active:scale-[0.98]"
          >
            +{n}
          </button>
        ))}
        <button
          onClick={() => onLog(-(steps[0] ?? 1))}
          disabled={done === 0}
          aria-label="Убрать"
          className="rounded-xl border border-[var(--color-border)] px-3 py-2 text-[15px] text-[var(--color-muted)] transition disabled:opacity-40"
        >
          −
        </button>
      </div>
    </div>
  );
}
