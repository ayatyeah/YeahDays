"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import Button from "@/components/ui/Button";
import { haptic } from "@/lib/motion";

interface Props {
  code: string;
  /** имя пригласившего; null — ссылка устарела или выдумана */
  inviter: string | null;
  signedIn: boolean;
  /** человек открыл свою же ссылку — проверял, как она выглядит */
  own: boolean;
}

export default function InviteAccept({ code, inviter, signedIn, own }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const back = encodeURIComponent(`/invite/${code}`);

  async function accept() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invite: code }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!json.ok) {
        setError(json.error ?? "Не получилось");
        setBusy(false);
        return;
      }
      haptic("success");
      // в профиль: там карточка «Друзья», и новый друг уже в ней
      router.replace("/account");
    } catch {
      setError("Нет связи, попробуй ещё раз");
      setBusy(false);
    }
  }

  let title: string;
  let text: string;
  if (!inviter) {
    title = "Ссылка не работает";
    text = "Её перевыпустили или в ней опечатка. Попроси у друга новую.";
  } else if (own) {
    title = "Это твоя ссылка";
    text = "Отправь её другу — когда он откроет, вы появитесь друг у друга в друзьях.";
  } else {
    title = `${inviter} зовёт тебя в друзья`;
    text = "Будете видеть серии и уровни друг друга. Задачи и расписание остаются личными.";
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-[380px] text-center">
        <Logo glow className="mx-auto h-10 w-auto" />
        <h1 className="mt-6 text-[22px] font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-[16px] leading-snug text-[var(--color-fg-dim)]">{text}</p>

        {error && <p className="mt-4 text-[15px] text-[var(--color-strength)]">{error}</p>}

        <div className="mt-8 flex flex-col gap-3">
          {inviter && !own && signedIn && (
            <Button variant="primary" size="lg" className="w-full" disabled={busy} onClick={() => void accept()}>
              {busy ? "Добавляю…" : "Добавить в друзья"}
            </Button>
          )}
          {inviter && !own && !signedIn && (
            <>
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => router.push(`/register?callbackUrl=${back}`)}
              >
                Зарегистрироваться
              </Button>
              <Link
                href={`/login?callbackUrl=${back}`}
                className="text-[15px] text-[var(--color-muted)] transition hover:text-[var(--color-fg-dim)]"
              >
                У меня уже есть аккаунт
              </Link>
            </>
          )}
          {(!inviter || own) && (
            <Button size="lg" className="w-full" onClick={() => router.push("/app")}>
              В приложение
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
