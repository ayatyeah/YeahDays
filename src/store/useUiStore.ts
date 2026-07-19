"use client";

import { create } from "zustand";

interface UiState {
  createOpen: boolean;
  /** предзаполненная дата при создании из календаря (YYYY-MM-DD) */
  createForDate: string | null;
  wardrobeOpen: boolean;
  openCreate: (date?: string | null) => void;
  closeCreate: () => void;
  openWardrobe: () => void;
  closeWardrobe: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  createOpen: false,
  createForDate: null,
  wardrobeOpen: false,
  openCreate: (date = null) => set({ createOpen: true, createForDate: date }),
  closeCreate: () => set({ createOpen: false, createForDate: null }),
  openWardrobe: () => set({ wardrobeOpen: true }),
  closeWardrobe: () => set({ wardrobeOpen: false }),
}));
