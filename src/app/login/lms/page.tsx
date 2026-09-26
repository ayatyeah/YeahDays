"use client";

import { Suspense, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import Button from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";

const errors: Record<string, string> = {
  lms_credentials: "LMS не приняла логин или пароль. Проверь данные учётной записи университета.",
  lms_rate_limit: "Слишком много попыток. Попробуй через 15 минут.",
  lms_linked: "Этот LMS-аккаунт уже привязан к другому профилю или у профиля есть другая привязка.",
  lms_session: "Сначала войди в свой аккаунт YeahGrind, затем подключи LMS в настройках.",
  lms_unavailable: "LMS сейчас недоступна или требует дополнительного шага входа. Проверь вход на сайте университета и попробуй снова.",
};
const inputClass = "h-13 w-full rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 text-[16px] outline-none focus:border-[var(--color-fg-dim)]";

export default function Page() {
  return <Suspense fallback={null}><LmsForm /></Suspense>;
}

function LmsForm() {
  const params = useSearchParams();
  const router = useRouter();
  const { status } = useSession();
  const linking = params.get("link") === "1";
  const requested = params.get("callbackUrl") || "/app";
  const destination = requested.startsWith("/") && !requested.startsWith("//") && !requested.includes("\\") ? requested : "/app";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [synced, setSynced] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const fields = new FormData(formElement);
    setBusy(true); setError("");
    try {
      const result = await signIn("lms-aitu", {
        username: fields.get("username"), password: fields.get("password"), link: linking ? "1" : "0", redirect: false,
      });
      if (!result || result.error) {
        setError(errors[result?.code ?? ""] || errors.lms_unavailable);
        return;
      }
      formElement.reset();
      setSynced(true);
      try {
        const response = await fetch("/api/account/lms", { method: "POST" });
        if (!response.ok) {
          setError("Вход выполнен, но дедлайны пока не загрузились. Повтори подключение или обновление LMS в настройках.");
          return;
        }
      } catch {
        setError("Вход выполнен. Обновить дедлайны можно в настройках LMS, когда появится связь.");
        return;
      }
      router.push(linking ? "/settings" : destination);
      router.refresh();
    } catch { setError("Нет связи с сервером. Попробуй ещё раз."); }
    finally { setBusy(false); }
  }

  return <main className="flex min-h-dvh items-center justify-center px-5 py-10">
    <div className="w-full max-w-[380px]">
      <Logo className="mx-auto mb-6 h-10 w-auto" />
      <h1 className="text-center text-[22px] font-bold">{linking ? "Подключить LMS AITU" : "Войти через LMS AITU"}</h1>
      <p className="my-4 text-[14px] text-[var(--color-muted)]">
        {linking ? "Дедлайны из твоего аккаунта университета появятся в этом профиле." : "При первом входе создадим личный аккаунт и загрузим твои дедлайны из календаря LMS."}
        {" "}Пароль передаётся LMS для проверки и не сохраняется в YeahGrind.
      </p>
      {!synced && <form onSubmit={submit} className="flex flex-col gap-3">
        <label className="text-sm">Логин LMS<input name="username" autoComplete="username" required maxLength={200} className={`${inputClass} mt-1`} /></label>
        <label className="text-sm">Пароль LMS<PasswordInput name="password" autoComplete="current-password" required maxLength={1024} className={`${inputClass} mt-1`} /></label>
        <Button type="submit" variant="primary" disabled={busy || (linking && status !== "authenticated")}>
          {busy ? "Проверяем LMS и загружаем дедлайны…" : linking ? "Подключить" : "Войти / зарегистрироваться"}
        </Button>
        {linking && status === "unauthenticated" && <p role="alert">Для привязки сначала войди в YeahGrind.</p>}
      </form>}
      {error && <p role="alert" className="mt-4 text-sm text-[var(--color-strength)]">{error}</p>}
      {synced && !busy && <Link href={linking ? "/settings" : destination} className="mt-4 block text-center underline">Продолжить</Link>}
      {!synced && <Link href="/login" className="mt-6 block text-center text-sm underline">{linking ? "Войти в YeahGrind" : "Уже есть аккаунт YeahGrind? Войди и привяжи LMS в настройках"}</Link>}
    </div>
  </main>;
}
