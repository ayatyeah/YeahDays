"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { EVENT_DESIGNS, type EventDesign } from "@/lib/eventAppearance";
export { EVENT_DESIGNS, type EventDesign };
export function eventDesignForUser(preferences: unknown, userId?: string | null): EventDesign {
  if (!userId || !preferences || typeof preferences !== "object") return "prime";
  const value = Object.prototype.hasOwnProperty.call(preferences, userId) ? (preferences as Record<string, unknown>)[userId] : undefined;
  return EVENT_DESIGNS.includes(value as EventDesign) ? value as EventDesign : "prime";
}

export type Theme = "dark" | "light";

interface ThemeState {
  theme: Theme;
  eventDesignByUser: Record<string, EventDesign>;
  pendingEventDesignByUser: Record<string, EventDesign>;
  acknowledgeEventDesign: (owner: string, design: EventDesign) => void;
  setEventDesign: (userId: string, design: EventDesign) => void;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      eventDesignByUser: {},
      pendingEventDesignByUser: {},
      acknowledgeEventDesign: (owner, design) => set(s => {
        if (s.pendingEventDesignByUser[owner] !== design) return {};
        const pending = { ...s.pendingEventDesignByUser };
        delete pending[owner];
        return { pendingEventDesignByUser: pending };
      }),
      setEventDesign: (userId, design) => {
        if (!userId || !EVENT_DESIGNS.includes(design)) return;
        set(s => ({ eventDesignByUser: { ...s.eventDesignByUser, [userId]: design }, pendingEventDesignByUser: { ...s.pendingEventDesignByUser, [userId]: design } }));
      },
      toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
      setTheme: (theme) => set({ theme }),
    }),
    { name: "yeahdays-theme" },
  ),
);
