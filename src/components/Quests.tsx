"use client";

import { useMemo, useState } from "react";
import {
  useUserStore,
  questProgress,
  daysLeft,
  type Quest,
} from "@/store/useUserStore";
import { STAT_LIST, dateKey, type StatKey } from "@/lib/domain";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";

/** Дата через N дней в формате YYYY-MM-DD. */
function inDays(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return dateKey(d);
}

/**
 * Цели с горизонтом.
 *
 * Приоритеты отвечают на «что тебе интересно», цель — на «к чему ты идёшь
 * и сколько осталось». Активная цель ещё и подкручивает колоду: чем ближе
 * дедлайн и больше отставание, тем настойчивее движок подкидывает нужное.
 */
export default function Quests() {
  const quests = useUserStore((s) => s.quests);
  const plan = useUserStore((s) => s.plan);
  const addQuest = useUserStore((s) => s.addQuest);
  const removeQuest = useUserStore((s) => s.removeQuest);

  const [open, setOpen] = useState(false);
  const [stat, setStat] = useState<StatKey>("strength");
  const [target, setTarget] = useState(20);
  const [horizon, setHorizon] = useState(30);

  const today = dateKey();

  return (
    <section className="mt-6">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-[13px] font-semibold text-[var(--color-fg-dim)]">
          Цели
        </h2>
        <button
          onClick={() => setOpen(true)}
          className="text-[12px] font-medium text-[var(--color-muted)] transition hover:text-[var(--color-fg)]"
        >
          + Добавить
        </button>
      </div>

      {quests.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-[var(--color-border)] px-4 py-5 text-center text-[12px] leading-snug text-[var(--color-muted)]">
          Поставь цель с датой — например, 20 действий на силу за месяц.
          Колода начнёт подстраиваться под неё.
        </p>
      ) : (
        <div className="space-y-2.5">
          {quests.map((q) => (
            <QuestRow
              key={q.id}
              quest={q}
              done={questProgress(q, plan)}
              today={today}
              onRemove={() => removeQuest(q.id)}
            />
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Новая цель">
        <p className="text-[12px] leading-snug text-[var(--color-muted)]">
          Сколько действий и к какому сроку. Засчитываются любые выполненные
          действия выбранного направления.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {STAT_LIST.map((s) => (
            <button
              key={s.key}
              onClick={() => setStat(s.key)}
              className={cn(
                "rounded-2xl border py-2.5 text-[12.5px] font-medium transition",
                stat === s.key
                  ? "border-[var(--color-fg)] bg-[var(--color-surface-2)]"
                  : "border-[var(--color-border)] text-[var(--color-muted)]",
              )}
            >
              <span style={{ color: s.hex }}>{s.icon}</span> {s.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <p className="mb-1.5 text-[12px] text-[var(--color-muted)]">
            Сколько действий: <span className="font-semibold">{target}</span>
          </p>
          <input
            type="range"
            min={5}
            max={100}
            step={5}
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            className="w-full"
            aria-label="Сколько действий"
          />
        </div>

        <div className="mt-4">
          <p className="mb-1.5 text-[12px] text-[var(--color-muted)]">
            За сколько дней: <span className="font-semibold">{horizon}</span>
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[7, 14, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setHorizon(d)}
                className={cn(
                  "rounded-2xl border py-2 text-[12px] tabular-nums transition",
                  horizon === d
                    ? "border-[var(--color-fg)] bg-[var(--color-surface-2)]"
                    : "border-[var(--color-border)] text-[var(--color-muted)]",
                )}
              >
                {d} дн
              </button>
            ))}
          </div>
        </div>

        <p className="mt-3 text-[11.5px] text-[var(--color-muted)]">
          Это {(target / horizon).toFixed(1)} действия в день.
        </p>

        <div className="mt-5 flex gap-2.5">
          <Button className="flex-1" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => {
              const label = STAT_LIST.find((s) => s.key === stat)!.label;
              track("quest_created", { stat, target, horizon });
              addQuest({
                title: `${target} действий · ${label}`,
                stat,
                target,
                deadline: inDays(horizon),
              });
              setOpen(false);
            }}
          >
            Поставить цель
          </Button>
        </div>
      </Modal>
    </section>
  );
}

function QuestRow({
  quest,
  done,
  today,
  onRemove,
}: {
  quest: Quest;
  done: number;
  today: string;
  onRemove: () => void;
}) {
  const left = daysLeft(quest.deadline, today);
  const complete = done >= quest.target;
  const overdue = left < 0 && !complete;
  const pct = Math.min(100, Math.round((done / quest.target) * 100));
  const stat = useMemo(
    () => STAT_LIST.find((s) => s.key === quest.stat)!,
    [quest.stat],
  );

  // сколько нужно в день, чтобы успеть — честная цифра вместо ободрения
  const pace =
    complete || overdue
      ? null
      : ((quest.target - done) / Math.max(left + 1, 1)).toFixed(1);

  return (
    <div className="press rounded-3xl surface p-4">
      <div className="flex items-start gap-2">
        <span className="text-[15px]" style={{ color: stat.hex }} aria-hidden>
          {stat.icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-semibold">{quest.title}</p>
          <p className="mt-0.5 text-[11.5px] text-[var(--color-muted)]">
            {complete
              ? "Цель закрыта 🎉"
              : overdue
                ? `Срок вышел · ${done} из ${quest.target}`
                : `${done} из ${quest.target} · ${left === 0 ? "последний день" : `${left} дн осталось`}`}
          </p>
        </div>
        <button
          onClick={onRemove}
          aria-label="Убрать цель"
          className="shrink-0 rounded-lg px-2 py-1 text-[12px] text-[var(--color-muted)] transition hover:text-[var(--color-strength)]"
        >
          ✕
        </button>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${pct}%`,
            backgroundColor: complete ? "var(--color-stability)" : stat.hex,
          }}
        />
      </div>

      {pace && (
        <p className="mt-2 text-[11px] text-[var(--color-muted)]">
          Нужно {pace} в день, чтобы успеть
        </p>
      )}
    </div>
  );
}
