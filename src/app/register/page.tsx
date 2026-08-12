"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Logo from "@/components/Logo";
import Button from "@/components/ui/Button";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.5 5C9.6 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.3C41.4 36 44 30.6 44 24c0-1.3-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}

const inputClass =
  "h-13 w-full rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 text-[15px] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-fg-dim)]";

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
  const callbackUrl = params.get("callbackUrl") || "/today";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
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
          <h1 className="text-[20px] font-bold tracking-tight">Создать аккаунт</h1>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Имя"
            maxLength={40}
            required
            className={inputClass}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className={inputClass}
          />
          <div className="flex gap-3">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Логин"
              maxLength={20}
              required
              className={inputClass}
            />
            <input
              type="number"
              inputMode="numeric"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              placeholder="Год рождения"
              required
              className={inputClass}
            />
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль (минимум 8 символов)"
            required
            minLength={8}
            className={inputClass}
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Повтори пароль"
            required
            minLength={8}
            className={inputClass}
          />

          {error && (
            <p className="text-[13px] text-[var(--color-strength)]">{error}</p>
          )}

          <Button type="submit" variant="primary" size="lg" disabled={busy} className="mt-1 w-full">
            {busy ? "Создаём…" : "Зарегистрироваться"}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-[12px] text-[var(--color-muted)]">
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          или
          <span className="h-px flex-1 bg-[var(--color-border)]" />
        </div>

        <button
          disabled={busy}
          onClick={() => {
            setBusy(true);
            void signIn("google", { callbackUrl });
          }}
          className="flex h-13 w-full items-center justify-center gap-2.5 rounded-2xl bg-white text-[14px] font-semibold text-[#1f1f1f] transition active:scale-[0.99] disabled:opacity-60"
        >
          <GoogleIcon className="h-5 w-5" />
          Продолжить с Google
        </button>

        <p className="mt-6 text-center text-[13px] text-[var(--color-muted)]">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="font-semibold text-[var(--color-fg)]">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
