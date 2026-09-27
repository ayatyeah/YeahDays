"use client";
import { create } from "zustand";
import type { PublicLearningState } from "@/lib/learning";

type Store = { owner: string | null; data: PublicLearningState | null; error: string; loading: boolean;
  reset: (owner: string | null) => void; receive: (owner: string, data: PublicLearningState) => void; load: (owner: string) => Promise<void> };
export const useLearningStore = create<Store>((set, get) => ({
  owner: null, data: null, error: "", loading: false,
  reset: owner => set({ owner, data: null, error: "", loading: false }),
  receive: (owner, data) => {
    const current = get();
    if (current.owner === owner && (!current.data || data.revision >= current.data.revision)) set({ data, loading: false, error: "" });
  },
  load: async owner => {
    if (get().owner !== owner) get().reset(owner);
    set({ loading: true, error: "" });
    try {
      const response = await fetch("/api/learning", { cache: "no-store" }); const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Не удалось загрузить прогресс");
      get().receive(owner, body);
    } catch (e) { if (get().owner === owner) set({ loading: false, error: e instanceof Error ? e.message : "Нет связи с сервером" }); }
  },
}));
