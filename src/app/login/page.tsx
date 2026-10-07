"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthShell, { AuthDivider, AuthError, AuthField, MicrosoftIcon, authInput, authPrimary, authSecondary } from "@/components/auth/AuthShell";
import GoogleButton from "@/components/GoogleButton";
import { credentialsSignIn, enterApp, safeCallbackUrl, warmSignIn } from "@/lib/fastSignIn";
import { oauthErrorMessage } from "@/lib/oauthErrors";
import PasswordInput from "@/components/ui/PasswordInput";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const params = useSearchParams();
  const callbackUrl = safeCallbackUrl(params.get("callbackUrl"));
  const providerError = oauthErrorMessage(params.get("error"));

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // Служебный токен берём заранее, пока человек печатает, — вход потом идёт одним запросом.
  useEffect(() => { void warmSignIn(); }, []);

  /**
   * Поля неуправляемые (defaultValue + чтение при отправке), а не через
   * useState. Управляемое поле до гидрации пустое, и первые набранные
   * символы React стирал при монтировании: на медленном телефоне человек
   * печатал email, а он исчезал. Значения здесь нужны только в момент
   * отправки, поэтому берём их прямо из формы.
   */
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const identifier = String(form.get("identifier") ?? "");
    const password = String(form.get("password") ?? "");
    setError(null);
    setBusy(true);

    try {
      if (!(await credentialsSignIn(identifier, password))) {
        setError("Неверный логин или пароль");
        setBusy(false);
        return;
      }
    } catch {
      setError("Сеть недоступна, попробуй ещё раз");
      setBusy(false);
      return;
    }
    // Кнопка остаётся «Входим…» до самой загрузки приложения — см. fastSignIn.ts.
    enterApp(callbackUrl);
  }

  return (
    <AuthShell mode="login" title="Войти в YeahGrind" subtitle="Рады видеть снова — план на сегодня уже ждёт." callbackUrl={callbackUrl}>
      {providerError && <div className="mb-4"><AuthError>{providerError}</AuthError></div>}

      <form onSubmit={submit} className="flex flex-col gap-4">
        <AuthField label="Email или логин">
          <input name="identifier" placeholder="you@example.com" autoComplete="username" required autoFocus className={authInput} />
        </AuthField>
        <AuthField
          label="Пароль"
          aside={<Link href="/forgot-password" className="font-normal text-[#a0a39c] underline-offset-2 transition hover:text-[#d3f693] hover:underline">Забыли пароль?</Link>}
        >
          <PasswordInput name="password" placeholder="••••••••" autoComplete="current-password" required className={authInput} />
        </AuthField>

        {error && <AuthError>{error}</AuthError>}

        <button type="submit" disabled={busy} className={authPrimary}>
          {busy ? "Входим…" : <>Войти <span aria-hidden>↗</span></>}
        </button>
      </form>

      <AuthDivider>или</AuthDivider>

      <div className="flex flex-col gap-3">
        <GoogleButton callbackUrl={callbackUrl} disabled={busy} className="h-12" />
        <Link href={`/login/lms?callbackUrl=${encodeURIComponent(callbackUrl)}`} className={authSecondary}>
          <MicrosoftIcon />
          Microsoft AITU
        </Link>
      </div>

      <p className="mt-6 text-center text-[15px] text-[#a0a39c]">
        Ещё нет аккаунта?{" "}
        <Link
          href={callbackUrl === "/app" ? "/register" : `/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="font-semibold text-[#d3f693] underline-offset-2 hover:underline"
        >
          Создать за минуту
        </Link>
      </p>
    </AuthShell>
  );
}
