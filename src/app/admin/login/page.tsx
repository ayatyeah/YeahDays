"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import Button from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";

const inputClass =
  "h-13 w-full rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 text-[16px] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-fg-dim)]";

/**
 * Вход в консоль по логину и паролю.
 *
 * Страница намеренно безымянная: ни «админка» в заголовке вкладки, ни
 * ссылок на неё в интерфейсе — попасть сюда можно десятью нажатиями по
 * логотипу или по прямому адресу. Это не защита (защита — пароль и лимит
 * попыток), а обычная гигиена: незачем показывать дверь всем подряд.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: String(form.get("username") ?? ""),
          password: String(form.get("password") ?? ""),
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!json.ok) {
        setError(json.error ?? "Не получилось");
        setBusy(false);
        return;
      }
      router.replace("/admin");
    } catch {
      setError("Нет связи");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-[380px]">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Logo className="h-10 w-auto" />
          <h1 className="text-[22px] font-bold tracking-tight">Консоль</h1>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            name="username"
            placeholder="Логин"
            autoFocus
            autoComplete="off"
            required
            className={inputClass}
          />
          <PasswordInput name="password" placeholder="Пароль" required className={inputClass} />

          {error && <p className="text-[15px] text-[var(--color-strength)]">{error}</p>}

          <Button type="submit" variant="primary" size="lg" disabled={busy} className="mt-1 w-full">
            {busy ? "Проверяю…" : "Войти"}
          </Button>
        </form>
      </div>
    </div>
  );
}
