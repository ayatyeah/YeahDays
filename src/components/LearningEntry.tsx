"use client";
import Link from "next/link";
export default function LearningEntry() {
  return <div className="my-4 grid grid-cols-2 gap-3">
    <Link href="/learn" className="surface rounded-2xl border border-[var(--color-border)] p-4"><span className="text-lg">✦</span><p className="mt-2 font-semibold">Прокачать навык</p><p className="mt-1 text-xs text-[var(--color-muted)]">Квесты, практика и учебный XP</p></Link>
    <Link href="/shop" className="surface rounded-2xl border border-[var(--color-border)] p-4"><span className="text-lg">◈</span><p className="mt-2 font-semibold">Магазин скинов</p><p className="mt-1 text-xs text-[var(--color-muted)]">Новый образ за знания</p></Link>
    <Link href="/personalization" className="surface col-span-2 rounded-2xl border border-[var(--color-border)] p-4"><p className="font-semibold">Мой ритм и достижения</p><p className="mt-1 text-xs text-[var(--color-muted)]">Активность, цель дня и настройки приватности</p></Link>
  </div>;
}
