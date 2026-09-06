"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import Button from "@/components/ui/Button";

const inputClass =
  "h-13 w-full rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 text-[16px] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-fg-dim)]";

/**
 * Публичная форма «забыли пароль». Сайт не шлёт email/SMS, поэтому это не
 * автосброс — заявка складывается в очередь (PasswordResetRequest) и её
 * разбирает владелец вручную в /admin, связавшись через telegram.
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [telegram, setTelegram] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, birthYear, telegram }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Не получилось отправить заявку");
        setBusy(false);
        return;
      }
      setSent(true);
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
          <h1 className="text-[22px] font-bold tracking-tight">Забыли пароль?</h1>
        </div>

        {sent ? (
          <div className="surface rounded-2xl p-4 text-center">
            <p className="text-[15px] font-medium">Заявка отправлена</p>
            <p className="mt-2 text-[15px] leading-snug text-[var(--color-fg-dim)]">
              Я свяжусь с тобой в Telegram и помогу восстановить доступ.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-5 text-[15px] leading-snug text-[var(--color-fg-dim)]">
              Автоматического сброса пароля нет — оставь контакты, и я поменяю
              пароль вручную и напишу тебе в Telegram.
            </p>
            <form onSubmit={submit} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email от аккаунта"
                required
                autoFocus
                className={inputClass}
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Номер телефона"
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
              <input
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder="Telegram (@username)"
                required
                className={inputClass}
              />

              {error && (
                <p className="text-[15px] text-[var(--color-strength)]">{error}</p>
              )}

              <Button type="submit" variant="primary" size="lg" disabled={busy} className="mt-1 w-full">
                {busy ? "Отправляем…" : "Отправить заявку"}
              </Button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-[15px] text-[var(--color-muted)]">
          Вспомнил пароль?{" "}
          <Link href="/login" className="font-semibold text-[var(--color-fg)]">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
