import Link from "next/link";
import Logo from "@/components/Logo";

const INSTALLER_URL =
  "https://github.com/ayatyeah/YeahDays/releases/latest/download/SalemAI-Setup.exe";

/**
 * Гейт на скачивание — не отдельная проверка сессии здесь, её уже сделал
 * middleware (см. src/middleware.ts, PUBLIC_PATHS не включает /download):
 * до этой страницы недошедший неавторизованный просто не долетит.
 */
export default function DownloadPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5 py-10 text-center">
      <div className="w-full max-w-[420px]">
        <Logo glow className="mx-auto h-10 w-auto" />
        <h1 className="mt-5 text-[22px] font-bold tracking-tight">Скачать СалемАй</h1>
        <p className="mt-2 text-[14px] leading-snug text-[var(--color-muted)]">
          Голосовой помощник для Windows — читает и пишет задачи прямо в
          твой аккаунт YeahGrind. После установки открой вкладку «Профиль»
          здесь на сайте и скопируй ID для синхронизации в настройки
          приложения.
        </p>

        <a
          href={INSTALLER_URL}
          className="press mt-7 flex h-14 w-full items-center justify-center rounded-2xl bg-[var(--color-fg)] text-[15px] font-semibold text-[var(--color-bg)]"
        >
          Скачать для Windows
        </a>

        <Link
          href="/account"
          className="mt-4 inline-block text-[13px] text-[var(--color-muted)] transition hover:text-[var(--color-fg)]"
        >
          ID для синхронизации — в профиле
        </Link>
      </div>
    </div>
  );
}
