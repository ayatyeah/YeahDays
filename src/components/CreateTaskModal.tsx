"use client";

import { useState } from "react";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import { useUiStore } from "@/store/useUiStore";
import { useUserStore } from "@/store/useUserStore";
import {
  CATEGORY_LIST,
  DIFFICULTY_LABEL,
  ENERGY_LABEL,
  STATS,
  xpForAction,
  type CategoryKey,
  type Difficulty,
  type EnergyLevel,
  type Impact,
} from "@/lib/domain";
import { cn } from "@/lib/cn";
import { YgIcon } from "@/components/yg-icons";

const DIFFICULTIES: Difficulty[] = [1, 2, 3, 4, 5];
const ENERGIES: EnergyLevel[] = ["low", "medium", "high"];
const DURATIONS = [5, 10, 20, 30, 45, 60];

/**
 * Создание собственного действия.
 *
 * Пользователь заполняет те же параметры, что есть у контента из пула —
 * поэтому его действия участвуют в скоринге наравне с остальными,
 * а не живут отдельным «списком задач».
 */
export default function CreateTaskModal() {
  const open = useUiStore((s) => s.createOpen);
  const close = useUiStore((s) => s.closeCreate);
  const addCustomAction = useUserStore((s) => s.addCustomAction);
  const acceptAction = useUserStore((s) => s.acceptAction);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CategoryKey>("fitness");
  const [difficulty, setDifficulty] = useState<Difficulty>(2);
  const [duration, setDuration] = useState(20);
  const [energy, setEnergy] = useState<EnergyLevel>("medium");
  const [addToToday, setAddToToday] = useState(true);

  const impact = Math.min(5, Math.max(1, difficulty)) as Impact;
  const xp = xpForAction({ difficulty, impact, duration });
  const stat = STATS[CATEGORY_LIST.find((c) => c.key === category)!.stat];

  function reset() {
    setTitle("");
    setCategory("fitness");
    setDifficulty(2);
    setDuration(20);
    setEnergy("medium");
    setAddToToday(true);
  }

  function submit() {
    const t = title.trim();
    if (!t) return;
    const action = {
      id: `custom-${Date.now().toString(36)}`,
      title: t,
      why: "Твоё собственное действие",
      category,
      difficulty,
      duration,
      energy,
      timePreference: "any" as const,
      impact,
      custom: true,
    };
    addCustomAction(action);
    if (addToToday) acceptAction(action);
    reset();
    close();
  }

  return (
    <Modal open={open} onClose={close} title="Своё действие">
      <div className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Например: 30 минут гитары"
          maxLength={70}
          autoFocus
          className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 text-[16px] outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-fg-dim)]"
        />

        {/* Категория */}
        <div>
          <Label>Категория</Label>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORY_LIST.map((c) => (
              <button
                key={c.key}
                onClick={() => setCategory(c.key)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition",
                  category === c.key
                    ? "border-[var(--color-fg)] bg-[var(--color-surface-2)]"
                    : "border-[var(--color-border)] text-[var(--color-muted)]",
                )}
              >
                <YgIcon name={c.icon} className="h-4 w-4" />
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Сложность */}
        <div>
          <Label>Сложность · {DIFFICULTY_LABEL[difficulty]}</Label>
          <div className="grid grid-cols-5 gap-1.5">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={cn(
                  "rounded-xl border py-2 text-[15px] font-bold tabular-nums transition",
                  difficulty === d
                    ? "border-[var(--color-fg)] bg-[var(--color-surface-2)]"
                    : "border-[var(--color-border)] text-[var(--color-muted)]",
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Длительность */}
        <div>
          <Label>Длительность</Label>
          <div className="grid grid-cols-6 gap-1.5">
            {DURATIONS.map((m) => (
              <button
                key={m}
                onClick={() => setDuration(m)}
                className={cn(
                  "rounded-xl border py-2 text-[13px] font-semibold tabular-nums transition",
                  duration === m
                    ? "border-[var(--color-fg)] bg-[var(--color-surface-2)]"
                    : "border-[var(--color-border)] text-[var(--color-muted)]",
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Энергия */}
        <div>
          <Label>Сколько сил нужно</Label>
          <div className="grid grid-cols-3 gap-1.5">
            {ENERGIES.map((e) => (
              <button
                key={e}
                onClick={() => setEnergy(e)}
                className={cn(
                  "rounded-xl border py-2 text-[13px] font-medium transition",
                  energy === e
                    ? "border-[var(--color-fg)] bg-[var(--color-surface-2)]"
                    : "border-[var(--color-border)] text-[var(--color-muted)]",
                )}
              >
                {ENERGY_LABEL[e]}
              </button>
            ))}
          </div>
        </div>

        {/* Итог */}
        <div
          className="flex items-center justify-between rounded-2xl px-4 py-3"
          style={{ background: `${stat.hex}14` }}
        >
          <span className="inline-flex items-center gap-1.5 text-[15px] font-medium" style={{ color: stat.hex }}>
            <YgIcon name={stat.icon} className="h-4 w-4" />
      {stat.label}
          </span>
          <span className="text-[16px] font-bold tabular-nums" style={{ color: stat.hex }}>
            +{xp} XP
          </span>
        </div>

        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={addToToday}
            onChange={(e) => setAddToToday(e.target.checked)}
            className="h-4 w-4 rounded accent-[var(--color-fg)]"
          />
          <span className="text-[15px] text-[var(--color-fg-dim)]">
            Сразу добавить в план на сегодня
          </span>
        </label>

        <div className="flex gap-2.5 pt-1">
          <Button className="flex-1" onClick={close}>
            Отмена
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            disabled={!title.trim()}
            onClick={submit}
          >
            Создать
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[13px] font-semibold text-[var(--color-fg-dim)]">
      {children}
    </p>
  );
}
