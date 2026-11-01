"use client";
import { useLocaleStore } from "./locale";
import { messages, type MessageKey } from "./messages";
export function formatMessage(locale: "ru" | "en" | "kk", key: MessageKey, params: Record<string, string | number> = {}) {
 return (messages[locale] ?? messages.ru)[key].replace(/\{(\w+)\}/g, (token, name: string) => String(params[name] ?? token));
}
export function useT() {
 const locale = useLocaleStore(s => s.locale);
 return (key: MessageKey, params?: Record<string, string | number>) => formatMessage(locale, key, params);
}
