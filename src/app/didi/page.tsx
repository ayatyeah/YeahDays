"use client";

import { Suspense } from "react";
import Link from "next/link";
import DidiPanel from "@/components/DidiPanel";
import DidiChat from "@/components/DidiChat";
import SalemAiVoice from "@/components/SalemAiVoice";

/**
 * Отдельная страница СалемАй: статус фонового процесса + переключатель
 * (DidiPanel, уже стоит в профиле), голосовая команда прямо из браузера
 * (SalemAiVoice — работает сама по себе, без десктоп-приложения) и
 * текстовый чат (DidiChat — тот, наоборот, ждёт, пока десктоп-процесс
 * вычитает сообщение из очереди). Не раздел нижней навигации — как
 * /manage, отдельная страница, куда ведёт ссылка из профиля.
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

      <div className="mt-3">
        <Suspense fallback={null}>
          <SalemAiVoice />
        </Suspense>
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <DidiChat />
      </div>
    </div>
  );
}
