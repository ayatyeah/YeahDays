import Link from "next/link";
import Logo from "@/components/Logo";

export default function Page() {
  return <main className="flex min-h-dvh items-center justify-center px-5 py-10">
    <div className="w-full max-w-[400px]">
      <Logo className="mx-auto mb-6 h-10 w-auto" />
      <h1 className="text-center text-[22px] font-bold">Вход через Microsoft AITU</h1>
      <p className="mt-4 text-[15px] leading-relaxed">
        В LMS AITU студенты входят через OpenID Connect — учётную запись Microsoft университета.
        Этот вход в YeahGrind пока не подключён.
      </p>
      <p className="mt-3 text-sm text-[var(--color-muted)]">
        Пока можно войти или зарегистрироваться в YeahGrind обычным способом.
        Личный календарь LMS подключается отдельно в настройках — после входа в LMS через Microsoft.
      </p>
      <Link href="/login?callbackUrl=%2Fsettings" className="mt-6 flex min-h-12 items-center justify-center rounded-2xl bg-[var(--color-fg)] px-4 font-semibold text-[var(--color-bg)]">Войти в YeahGrind</Link>
      <Link href="/register?callbackUrl=%2Fsettings" className="mt-3 block text-center underline">Создать аккаунт YeahGrind</Link>
      <a href="https://lms.astanait.edu.kz/auth/oidc/?source=loginpage" target="_blank" rel="noopener noreferrer" className="mt-5 block text-center text-sm underline">Открыть Microsoft-вход на сайте LMS</a>
      <p className="mt-2 text-center text-xs text-[var(--color-muted)]">Эта ссылка открывает LMS университета и не авторизует в YeahGrind.</p>
    </div>
  </main>;
}
