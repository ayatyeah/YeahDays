"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import GoogleButton from "@/components/GoogleButton";
import Logo from "@/components/Logo";
import { credentialsSignIn, enterApp, safeCallbackUrl, warmSignIn } from "@/lib/fastSignIn";
import { oauthErrorMessage } from "@/lib/oauthErrors";
import Button from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";

const inputClass =
  "h-13 w-full rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 text-[16px] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-fg-dim)]";

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
    <div className="flex min-h-dvh flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-[380px]">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Logo glow className="h-10 w-auto" />
          <h1 className="text-[22px] font-bold tracking-tight">Вход</h1>
        </div>

        {providerError && <p role="alert" className="mb-4 text-sm text-[var(--color-strength)]">{providerError}</p>}

        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            name="identifier"
            placeholder="Email или логин"
            required
            autoFocus
            className={inputClass}
          />
          <PasswordInput name="password" placeholder="Пароль" required className={inputClass} />

          {error && (
            <p className="text-[15px] text-[var(--color-strength)]">{error}</p>
          )}

          <Button type="submit" variant="primary" size="lg" disabled={busy} className="mt-1 w-full">
            {busy ? "Входим…" : "Войти"}
          </Button>

          <Link
            href="/forgot-password"
            className="text-center text-[15px] text-[var(--color-muted)] transition hover:text-[var(--color-fg-dim)]"
          >
            Забыли пароль?
          </Link>
        </form>

        <div className="my-5 flex items-center gap-3 text-[13px] text-[var(--color-muted)]">
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          или
          <span className="h-px flex-1 bg-[var(--color-border)]" />
        </div>

        <Link
          href={`/login/lms?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="mb-3 flex h-13 w-full items-center justify-center rounded-2xl border-2 border-[var(--color-border)] text-[15px] font-semibold"
        >
          Вход через Microsoft AITU
        </Link>

        <GoogleButton callbackUrl={callbackUrl} disabled={busy} />

        <p className="mt-6 text-center text-[15px] text-[var(--color-muted)]">
          Ещё нет аккаунта?{" "}
          <Link
            href={callbackUrl === "/app" ? "/register" : `/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="font-semibold text-[var(--color-fg)]"
          >
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}
