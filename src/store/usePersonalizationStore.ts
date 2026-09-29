"use client";
import { create } from "zustand";
import type { publicPersonalization } from "@/lib/personalization";
type Data = ReturnType<typeof publicPersonalization>;
export const usePersonalizationStore = create<{
  owner: string | null; data: Data | null; error: string;
  reset: (owner: string | null) => void;
  request: (owner: string, body?: object) => Promise<boolean>;
}>((set, get) => ({
  owner: null, data: null, error: "",
  reset: owner => set({ owner, data: null, error: "" }),
  request: async (owner, body) => {
    try {
      const res = await fetch("/api/personalization", body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), cache: "no-store" } : { cache: "no-store" });
      const data = await res.json();
      if (get().owner !== owner) return false;
      if (!res.ok) throw new Error(data.error || "Не удалось загрузить приватность");
      if (!get().data || data.revision >= get().data!.revision) set({ data, error: "" });
      return true;
    } catch (e) { if (get().owner === owner) set({ error: e instanceof Error ? e.message : "Нет связи с сервером" }); return false; }
  },
}));
