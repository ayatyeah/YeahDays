"use client";
import { useCallback, useEffect, useSyncExternalStore } from "react";
import { useLocaleStore, type Locale } from "./locale";
import { createTranslator, type Dictionary, type Translate } from "./translate";
import additions from "./core-additions.json";
import english from "./dict/en.json";
const translators: Partial<Record<Locale, Translate>> = { en: createTranslator({ ...english, ...(additions.en as Dictionary) }) };
const pending: Partial<Record<Locale, Promise<void>>> = {};
const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; };
function load(locale: Locale) {
  if (locale === "ru" || translators[locale] || pending[locale]) return;
  pending[locale] = (locale === "en" ? import("./dict/en.json") : import("./dict/kk.json")).then(module => {
    translators[locale] = createTranslator({ ...module.default, ...(additions[locale] as Dictionary) });
    listeners.forEach(fn => fn());
  }).catch(() => { delete pending[locale]; });
}
/** Existing Russian message IDs, resolved during React render, never by editing the DOM. */
export function useCopy() {
  const locale = useLocaleStore(s => s.locale);
  const ready = useSyncExternalStore(subscribe, () => !!translators[locale], () => locale === "en");
  useEffect(() => { load(locale); }, [locale]);
  return useCallback((id: string, values: Record<string, string | number> = {}) => {
    const text = locale !== "ru" && ready ? translators[locale]?.(id) ?? id : id;
    return text.replace(/\{(\w+)\}/g, (token, key: string) => String(values[key] ?? token));
  }, [locale, ready]);
}
