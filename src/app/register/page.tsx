"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { credentialsSignIn, enterApp, safeCallbackUrl, warmSignIn } from "@/lib/fastSignIn";
import AuthShell, { AuthDivider, AuthError, AuthField, MicrosoftIcon, authInput, authPrimary, authSecondary } from "@/components/auth/AuthShell";
import GoogleButton from "@/components/GoogleButton";
import PasswordInput from "@/components/ui/PasswordInput";

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = safeCallbackUrl(params.get("callbackUrl"));

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // Токен для автовхода берём заранее, пока человек заполняет форму.
  useEffect(() => { void warmSignIn(); }, []);

  /** Поля неуправляемые — см. тот же комментарий на /login. */
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const username = String(form.get("username") ?? "").trim();
    const birthYear = String(form.get("birthYear") ?? "");
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");
    setError(null);

    if (password !== confirm) {
      setError("Пароли не совпадают");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, username, password, birthYear }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Не получилось зарегистрироваться");
        setBusy(false);
        return;
      }

      if (!(await credentialsSignIn(email, password))) {
        // Аккаунт создан, но автовход не сработал — не тупик, просто на /login.
        router.push("/login");
        return;
      }
      enterApp(callbackUrl);
    } catch {
      setError("Сеть недоступна, попробуй ещё раз");
      setBusy(false);
    }
  }

  return (
    <AuthShell mode="register" title="Создать аккаунт" subtitle="Меньше минуты. Быстрее всего — через Google, в одно нажатие." callbackUrl={callbackUrl}>
      {/* Самый короткий путь — сверху: одно нажатие, без пароля и анкеты. */}
      <div className="flex flex-col gap-3">
        <GoogleButton callbackUrl={callbackUrl} disabled={busy} className="h-12" />
        <Link href={`/login/lms?callbackUrl=${encodeURIComponent(callbackUrl)}`} className={authSecondary}>
          <MicrosoftIcon />
          Через Microsoft AITU
        </Link>
      </div>

      <AuthDivider>или по почте</AuthDivider>

      <form onSubmit={submit} className="flex flex-col gap-4">
        <AuthField label="Как тебя зовут">
          <input name="name" placeholder="Имя" autoComplete="given-name" maxLength={40} required className={authInput} />
        </AuthField>
        <AuthField label="Email">
          <input type="email" name="email" placeholder="you@example.com" autoComplete="email" required className={authInput} />
        </AuthField>
        <div className="grid grid-cols-2 gap-3">
          <AuthField label="Логин">
            <input name="username" placeholder="nickname" autoComplete="username" maxLength={20} required className={authInput} />
          </AuthField>
          <AuthField label="Год рождения">
            <input type="number" inputMode="numeric" name="birthYear" placeholder="2006" required className={authInput} />
          </AuthField>
        </div>
        <AuthField label="Пароль" hint="Минимум 8 символов">
          <PasswordInput name="password" placeholder="••••••••" autoComplete="new-password" required minLength={8} className={authInput} />
        </AuthField>
        <AuthField label="Повтори пароль">
          <PasswordInput name="confirm" placeholder="••••••••" autoComplete="new-password" required minLength={8} className={authInput} />
        </AuthField>

        {error && <AuthError>{error}</AuthError>}

        <button type="submit" disabled={busy} className={authPrimary}>
          {busy ? "Создаём…" : <>Создать аккаунт <span aria-hidden>↗</span></>}
        </button>
        <p className="text-center text-[12px] leading-relaxed text-[#a0a39c]">
          Что мы храним и зачем — в{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-[#f2f3ed]">политике конфиденциальности</Link>
          {" "}и{" "}
          <Link href="/terms" className="underline underline-offset-2 hover:text-[#f2f3ed]">условиях</Link>.
        </p>
      </form>

      <p className="mt-6 text-center text-[15px] text-[#a0a39c]">
        Уже есть аккаунт?{" "}
        <Link
          href={callbackUrl === "/app" ? "/login" : `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="font-semibold text-[#d3f693] underline-offset-2 hover:underline"
        >
          Войти
        </Link>
      </p>
    </AuthShell>
  );
}
