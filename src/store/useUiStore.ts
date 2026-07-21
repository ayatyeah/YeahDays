"use client";

import { create } from "zustand";

interface UiState {
  createOpen: boolean;
  createForDate: string | null;
  openCreate: (date?: string | null) => void;
  closeCreate: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  createOpen: false,
  createForDate: null,
  openCreate: (date = null) => set({ createOpen: true, createForDate: date }),
  closeCreate: () => set({ createOpen: false, createForDate: null }),
}));
