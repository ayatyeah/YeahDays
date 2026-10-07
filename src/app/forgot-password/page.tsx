"use client";

import { useState } from "react";
import Link from "next/link";
import AuthShell, { AuthError, AuthField, authInput, authPrimary } from "@/components/auth/AuthShell";

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
    <AuthShell
      mode="neutral"
      title="Забыли пароль?"
      subtitle="Автоматического сброса пароля нет — оставь контакты, и я поменяю пароль вручную и напишу тебе в Telegram."
      tabs={false}
    >
      {sent ? (
        <div className="rounded-2xl border border-[#d3f693]/30 bg-[#d3f693]/10 p-4 text-center">
          <p className="text-[15px] font-semibold text-[#d3f693]">Заявка отправлена</p>
          <p className="mt-2 text-[15px] leading-snug text-[#b4b8ae]">Я свяжусь с тобой в Telegram и помогу восстановить доступ.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4">
          <AuthField label="Email от аккаунта">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus className={authInput} />
          </AuthField>
          <AuthField label="Номер телефона">
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 700 000 00 00" required className={authInput} />
          </AuthField>
          <div className="grid grid-cols-2 gap-3">
            <AuthField label="Год рождения">
              <input type="number" inputMode="numeric" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} placeholder="2006" required className={authInput} />
            </AuthField>
            <AuthField label="Telegram">
              <input value={telegram} onChange={(e) => setTelegram(e.target.value)} placeholder="@username" required className={authInput} />
            </AuthField>
          </div>

          {error && <AuthError>{error}</AuthError>}

          <button type="submit" disabled={busy} className={authPrimary}>
            {busy ? "Отправляем…" : "Отправить заявку"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-[15px] text-[#a0a39c]">
        Помнишь пароль?{" "}
        <Link href="/login" className="font-semibold text-[#d3f693] underline-offset-2 hover:underline">
          Войти
        </Link>
      </p>
    </AuthShell>
  );
}
