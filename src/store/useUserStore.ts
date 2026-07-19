"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DIFFICULTY_XP,
  type Difficulty,
  type StatKey,
} from "@/lib/categories";
import { levelForXp } from "@/lib/leveling";

export interface Task {
  id: string;
  title: string;
  category: StatKey;
  difficulty: Difficulty;
  xp: number;
  completed: boolean;
  createdAt: number;
  completedAt: number | null;
  /** YYYY-MM-DD, план на день (для календаря) */
  dueDate: string | null;
}

export interface Stats {
  body: number;
  mind: number;
  discipline: number;
}

interface UserState {
  name: string;
  createdAt: number;
  tasks: Task[];
  /** последний уровень, для которого пользователю показали трансформацию */
  seenLevel: number;

  // actions
  setName: (name: string) => void;
  addTask: (input: {
    title: string;
    category: StatKey;
    difficulty: Difficulty;
    dueDate?: string | null;
  }) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  markSeenLevel: (level: number) => void;
  resetAll: () => void;
}

function makeId() {
  // без Date.now()-only коллизий: время + случайная часть
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: "Странник",
      createdAt: Date.now(),
      tasks: [],
      seenLevel: 1,

      setName: (name) => set({ name: name.trim() || "Странник" }),

      addTask: ({ title, category, difficulty, dueDate = null }) =>
        set((s) => ({
          tasks: [
            {
              id: makeId(),
              title: title.trim(),
              category,
              difficulty,
              xp: DIFFICULTY_XP[difficulty],
              completed: false,
              createdAt: Date.now(),
              completedAt: null,
              dueDate,
            },
            ...s.tasks,
          ],
        })),

      toggleTask: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  completed: !t.completed,
                  completedAt: !t.completed ? Date.now() : null,
                }
              : t,
          ),
        })),

      deleteTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      markSeenLevel: (level) => set({ seenLevel: level }),

      resetAll: () =>
        set({
          tasks: [],
          seenLevel: 1,
          name: "Странник",
          createdAt: Date.now(),
        }),
    }),
    {
      name: "yeahdays-store",
      version: 1,
      partialize: (s) => ({
        name: s.name,
        createdAt: s.createdAt,
        tasks: s.tasks,
        seenLevel: s.seenLevel,
      }),
    },
  ),
);

/**
 * Надёжное определение конца гидратации из localStorage.
 * Нужно, чтобы (а) не мигать SSR-значениями и (б) не показывать
 * оверлей повышения уровня до чтения сохранённого seenLevel.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (useUserStore.persist.hasHydrated()) setHydrated(true);
    const unsub = useUserStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );
    return unsub;
  }, []);
  return hydrated;
}

/* ---------- селекторы (производные величины) ---------- */

export function selectCompleted(tasks: Task[]) {
  return tasks.filter((t) => t.completed);
}

export function selectTotalXp(tasks: Task[]) {
  return selectCompleted(tasks).reduce((sum, t) => sum + t.xp, 0);
}

export function selectStats(tasks: Task[]): Stats {
  const stats: Stats = { body: 0, mind: 0, discipline: 0 };
  for (const t of tasks) {
    if (t.completed) stats[t.category] += t.xp;
  }
  return stats;
}

export function selectLevel(tasks: Task[]) {
  return levelForXp(selectTotalXp(tasks));
}
