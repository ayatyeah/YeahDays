import type { Metadata } from "next";
import { YgIcon } from "@/components/yg-icons";

export const metadata: Metadata = {
  title: "Нет сети — YeahGrind",
};

/**
 * Экран, который отдаёт service worker, когда сети нет, а нужной страницы
 * ещё не оказалось в кэше.
 *
 * Важно, что он статический и без единого клиентского скрипта: это последний
 * рубеж, и он обязан отрисоваться в условиях, где не работает вообще ничего.
 * Текст без извинений и без «попробуйте позже» — прогресс лежит на
 * устройстве, приложение продолжит работать, как только вернётся связь.
 */
export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-8 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl surface text-[34px]">
        <YgIcon name="wifi-off" className="h-9 w-9 text-[var(--color-muted)]" />
      </div>
      <h1 className="text-[22px] font-bold tracking-tight">Нет сети</h1>
      <p className="mt-2 max-w-[300px] text-[15px] leading-snug text-[var(--color-fg-dim)]">
        Этот экран ещё не сохранён на устройстве. Открытые разделы работают
        офлайн — прогресс никуда не денется и уедет на сервер, как только
        появится связь.
      </p>
      <a
        href="/app"
        className="press mt-6 flex h-11 items-center rounded-2xl bg-[var(--color-fg)] px-5 text-[15px] font-semibold text-[var(--color-bg)]"
      >
        К приложению
      </a>
    </div>
  );
}
