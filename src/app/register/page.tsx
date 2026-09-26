"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Logo from "@/components/Logo";
import Button from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";

const inputClass =
  "h-13 w-full rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 text-[16px] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-fg-dim)]";

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
  const callbackUrl = params.get("callbackUrl") || "/app";

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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

      const signInRes = await signIn("credentials", {
        identifier: email,
        password,
        redirect: false,
      });
      if (signInRes?.error) {
        // Аккаунт создан, но автовход не сработал — не тупик, просто на /login.
        router.push("/login");
        return;
      }
      router.push(callbackUrl);
    } catch {
      setError("Сеть недоступна, попробуй ещё раз");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-[380px]">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Logo glow className="h-10 w-auto" />
          <h1 className="text-[22px] font-bold tracking-tight">Создать аккаунт</h1>
        </div>

        <Link href={`/login/lms?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="mb-5 flex min-h-13 items-center justify-center rounded-2xl border-2 border-[var(--color-border)] px-3 text-center font-semibold">
          О входе через Microsoft AITU
        </Link>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            name="name"
            placeholder="Имя"
            maxLength={40}
            required
            className={inputClass}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className={inputClass}
          />
          <div className="flex gap-3">
            <input
              name="username"
              placeholder="Логин"
              maxLength={20}
              required
              className={inputClass}
            />
            <input
              type="number"
              inputMode="numeric"
              name="birthYear"
              placeholder="Год рождения"
              required
              className={inputClass}
            />
          </div>
          <PasswordInput
            name="password"
            placeholder="Пароль (минимум 8 символов)"
            required
            minLength={8}
            className={inputClass}
          />
          <PasswordInput
            name="confirm"
            placeholder="Повтори пароль"
            required
            minLength={8}
            className={inputClass}
          />

          {error && (
            <p className="text-[15px] text-[var(--color-strength)]">{error}</p>
          )}

          <Button type="submit" variant="primary" size="lg" disabled={busy} className="mt-1 w-full">
            {busy ? "Создаём…" : "Зарегистрироваться"}
          </Button>
        </form>

        <p className="mt-5 text-center text-[15px] leading-snug text-[var(--color-muted)]">
          Google можно привязать после — в профиле, для быстрого входа с
          других устройств.
        </p>

        <p className="mt-4 text-center text-[15px] text-[var(--color-muted)]">
          Уже есть аккаунт?{" "}
          <Link
            href={callbackUrl === "/app" ? "/login" : `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="font-semibold text-[var(--color-fg)]"
          >
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
