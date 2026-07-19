"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import {
  CATEGORY_LIST,
  DIFFICULTY_LABEL,
  DIFFICULTY_XP,
  type Difficulty,
  type StatKey,
} from "@/lib/categories";
import { useUserStore } from "@/store/useUserStore";
import { useUiStore } from "@/store/useUiStore";

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

export default function CreateTaskModal() {
  const { createOpen, createForDate, closeCreate } = useUiStore();
  const addTask = useUserStore((s) => s.addTask);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<StatKey>("body");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [dueDate, setDueDate] = useState<string>("");

  // сброс/предзаполнение при открытии
  useEffect(() => {
    if (createOpen) {
      setTitle("");
      setCategory("body");
      setDifficulty("medium");
      setDueDate(createForDate ?? "");
    }
  }, [createOpen, createForDate]);

  const canSubmit = title.trim().length > 0;

  function submit() {
    if (!canSubmit) return;
    addTask({
      title,
      category,
      difficulty,
      dueDate: dueDate || null,
    });
    closeCreate();
  }

  return (
    <Modal open={createOpen} onClose={closeCreate} title="Новая задача">
      <div className="space-y-5">
        {/* Название */}
        <div>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Что нужно сделать?"
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-[var(--color-fg)] outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-fg-dim)]"
          />
        </div>

        {/* Категория */}
        <div>
          <p className="mb-2 text-xs uppercase tracking-wider text-[var(--color-muted)]">
            Сфера
          </p>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORY_LIST.map((c) => (
              <button
                key={c.key}
                onClick={() => setCategory(c.key)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-xs font-medium transition",
                  category === c.key
                    ? "border-transparent text-[var(--color-bg)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-fg-dim)] hover:text-[var(--color-fg)]",
                )}
                style={
                  category === c.key ? { backgroundColor: c.color } : undefined
                }
              >
                <span className="text-lg">{c.emoji}</span>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Сложность */}
        <div>
          <p className="mb-2 text-xs uppercase tracking-wider text-[var(--color-muted)]">
            Сложность
          </p>
          <div className="grid grid-cols-3 gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={cn(
                  "rounded-xl border px-2 py-2.5 text-sm font-medium transition",
                  difficulty === d
                    ? "border-[var(--color-xp)] bg-[var(--color-surface-2)] text-[var(--color-fg)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-fg-dim)] hover:text-[var(--color-fg)]",
                )}
              >
                <div>{DIFFICULTY_LABEL[d]}</div>
                <div className="text-[10px] text-[var(--color-xp)]">
                  +{DIFFICULTY_XP[d]} XP
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Дата (для календаря) */}
        <div>
          <p className="mb-2 text-xs uppercase tracking-wider text-[var(--color-muted)]">
            На день <span className="normal-case">(необязательно)</span>
          </p>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-[var(--color-fg)] outline-none focus:border-[var(--color-fg-dim)] [color-scheme:dark]"
          />
        </div>

        <div className="flex gap-2 pt-1">
          <Button variant="ghost" className="flex-1" onClick={closeCreate}>
            Отмена
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            disabled={!canSubmit}
            onClick={submit}
          >
            Создать
          </Button>
        </div>
      </div>
    </Modal>
  );
}
