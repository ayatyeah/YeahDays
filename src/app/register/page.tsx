"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { credentialsSignIn, enterApp, safeCallbackUrl, warmSignIn } from "@/lib/fastSignIn";
import GoogleButton from "@/components/GoogleButton";
import Logo from "@/components/Logo";
import Button from "@/components/ui/Button";

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
  const callbackUrl = safeCallbackUrl(params.get("callbackUrl"));

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // Токен для автовхода берём заранее, пока человек заполняет форму.
  useEffect(() => { void warmSignIn(); }, []);

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
    <div className="flex min-h-dvh flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-[380px]">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Logo glow className="h-10 w-auto" />
          <h1 className="text-[22px] font-bold tracking-tight">Создать аккаунт</h1>
        </div>

        {/* Самый короткий путь — сверху: одно нажатие, без пароля и анкеты. */}
        <GoogleButton callbackUrl={callbackUrl} disabled={busy} className="mb-3" />
        <Link href={`/login/lms?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="mb-5 flex min-h-13 items-center justify-center rounded-2xl border-2 border-[var(--color-border)] px-3 text-center font-semibold">
          Зарегистрироваться через Microsoft AITU
        </Link>

        <div className="mb-5 flex items-center gap-3 text-[13px] text-[var(--color-muted)]">
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          или с логином и паролем
          <span className="h-px flex-1 bg-[var(--color-border)]" />
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
            <p className="text-[15px] text-[var(--color-strength)]">{error}</p>
          )}

          <Button type="submit" variant="primary" size="lg" disabled={busy} className="mt-1 w-full">
            {busy ? "Создаём…" : "Зарегистрироваться"}
          </Button>
        </form>

        <p className="mt-4 text-center text-[15px] text-[var(--color-muted)]">
          Уже есть аккаунт?{" "}
          <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-semibold text-[var(--color-fg)]">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
