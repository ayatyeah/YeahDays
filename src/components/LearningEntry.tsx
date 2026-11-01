"use client";
import { useCopy } from "@/i18n/useCopy";

import Link from "next/link";
export default function LearningEntry() {
  const tx = useCopy();
  return <div className="my-4 grid grid-cols-2 gap-3">
    <Link href="/learn" className="surface rounded-2xl border border-[var(--color-border)] p-4"><span className="text-lg">✦</span><p className="mt-2 font-semibold">{tx("Прокачать навык")}</p><p className="mt-1 text-xs text-[var(--color-muted)]">{tx("Квесты, практика и учебный XP")}</p></Link>
    <Link href="/shop" className="surface rounded-2xl border border-[var(--color-border)] p-4"><span className="text-lg">◈</span><p className="mt-2 font-semibold">{tx("Магазин скинов")}</p><p className="mt-1 text-xs text-[var(--color-muted)]">{tx("Новый образ за знания")}</p></Link>
    <Link href="/community" className="surface rounded-2xl border border-[var(--color-border)] p-4"><p className="font-semibold">{tx("Сообщество")}</p><p className="mt-1 text-xs text-[var(--color-muted)]">{tx("Команды, друзья и совместная учёба")}</p></Link>
    <Link href="/chat" className="surface rounded-2xl border border-[var(--color-border)] p-4"><p className="font-semibold">{tx("ИИ-помощник")}</p><p className="mt-1 text-xs text-[var(--color-muted)]">{tx("Объяснения и помощь с планом")}</p></Link>
    <Link href="/challenge30" className="surface col-span-2 rounded-2xl border border-[var(--color-border)] p-4"><p className="font-semibold">{tx("Челлендж 30")}</p><p className="mt-1 text-xs text-[var(--color-muted)]">{tx("3, 6 или 12 часов в день на важное — личный план на месяц")}</p></Link>
    <Link href="/personalization" className="surface col-span-2 rounded-2xl border border-[var(--color-border)] p-4"><p className="font-semibold">{tx("Мой ритм и достижения")}</p><p className="mt-1 text-xs text-[var(--color-muted)]">{tx("Активность, цель дня и настройки приватности")}</p></Link>
  </div>;
}
