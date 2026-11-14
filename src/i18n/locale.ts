"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "ru" | "en" | "kk";

export const LOCALES: { id: Locale; label: string }[] = [
  { id: "en", label: "English" },
  { id: "ru", label: "Русский" },
  { id: "kk", label: "Қазақша" },
];

/** Тот же ключ читает инлайн-скрипт в layout.tsx — менять вместе. */
export const LOCALE_KEY = "yg-locale";

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

/**
 * Язык интерфейса. Хранится на устройстве, как и тема: это настройка
 * экрана, а не аккаунта — телефон может быть на казахском, а общий
 * ноутбук на русском.
 */
export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: "en",
      setLocale: (locale) => set({ locale }),
    }),
    { name: LOCALE_KEY, version: 1, migrate: () => ({ locale: "en" as Locale }) },
  ),
);

/**
 * На каком языке показывать названия из двуязычного содержимого (лекции и
 * части ивентов): по-русски — русским, остальным — по-английски, это язык
 * самого курса. Казахского варианта у содержимого нет.
 */
export function useContentLang(): "ru" | "en" {
  return useLocaleStore((s) => (s.locale === "ru" ? "ru" : "en"));
}
