"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
export const OUTFITS = [
  {
    id: "classic",
    label: "Классика",
    image: "/companion/seated.webp",
    preview: "/landing/looks/black-tee.webp",
  },
  {
    id: "cozy",
    label: "Уютный",
    image: "/landing/looks/streetwear.webp",
    preview: "/landing/looks/streetwear.webp",
  },
  {
    id: "active",
    label: "Активный",
    image: "/landing/looks/sport-wave.webp",
    preview: "/landing/looks/sport-wave.webp",
  },
  {
    id: "campus",
    label: "Кампус",
    image: "/landing/looks/campus.webp",
    preview: "/landing/looks/campus.webp",
  },
] as const;
type CompanionState = {
  outfit: string;
  setOutfit: (id: string) => void;
  deadline: number | null;
  remaining: number;
  started: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
};
export const useCompanionStore = create<CompanionState>()(
  persist(
    (set, get) => ({
      outfit: "classic",
      setOutfit: (outfit) => {
        if (OUTFITS.some((o) => o.id === outfit)) set({ outfit });
      },
      deadline: null,
      remaining: 25 * 60,
      started: false,
      start: () =>
        set({
          deadline: Date.now() + Math.max(1, get().remaining) * 1000,
          started: true,
        }),
      pause: () =>
        set({
          remaining: Math.max(
            0,
            Math.ceil(((get().deadline ?? Date.now()) - Date.now()) / 1000),
          ),
          deadline: null,
        }),
      reset: () => set({ deadline: null, remaining: 25 * 60, started: false }),
    }),
    { name: "yeahgrind-companion" },
  ),
);
