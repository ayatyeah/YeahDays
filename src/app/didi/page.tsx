"use client";

import Link from "next/link";
import DidiPanel from "@/components/DidiPanel";
import DidiChat from "@/components/DidiChat";

/**
 * Отдельная страница ДиДи: статус фонового процесса + переключатель
 * (DidiPanel, уже стоит в профиле) и текстовый чат с ней. Не раздел
 * нижней навигации — как /manage, отдельная страница, куда ведёт ссылка
 * из профиля: это возможности для настройки/общения с ассистентом, а не
 * часть ежедневного цикла задач, вокруг которого построены основные вкладки.
 */
export default function DidiPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mb-4 flex items-baseline justify-between">
        <h1 className="text-[26px] font-bold tracking-tight">СалемАй</h1>
        <Link
          href="/account"
          className="text-[12.5px] text-[var(--color-muted)] transition hover:text-[var(--color-fg)]"
        >
          ← Профиль
        </Link>
      </header>

      <DidiPanel />

      <div className="mt-3 flex flex-1 flex-col">
        <DidiChat />
      </div>
    </div>
  );
}
