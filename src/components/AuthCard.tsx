"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

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

export default function AuthCard() {
  const { data: session, status } = useSession();
  const [busy, setBusy] = useState(false);

  if (status === "loading") {
    return (
      <div className="h-[68px] animate-pulse rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]" />
    );
  }

  if (session?.user) {
    const u = session.user;
    return (
      <section className="flex items-center gap-3 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        {u.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={u.image}
            alt=""
            className="h-11 w-11 shrink-0 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-2)] text-lg font-bold">
            {(u.name ?? u.email ?? "?").slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold">
            {u.name ?? "Аккаунт"}
          </p>
          <p className="truncate text-[12px] text-[var(--color-muted)]">
            {u.email}
          </p>
        </div>
        <button
          onClick={() => signOut()}
          className="shrink-0 rounded-xl px-3 py-2 text-[12.5px] font-medium text-[var(--color-muted)] transition hover:text-[var(--color-strength)]"
        >
          Выйти
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <p className="text-[13px] font-semibold">Сохрани прогресс</p>
      <p className="mt-1 text-[12px] leading-snug text-[var(--color-muted)]">
        Войди — и твои действия, стрик и персонаж будут доступны на любом
        устройстве.
      </p>
      <button
        disabled={busy}
        onClick={() => {
          setBusy(true);
          signIn("google");
        }}
        className="mt-3 flex h-11 w-full items-center justify-center gap-2.5 rounded-2xl bg-white text-[14px] font-semibold text-[#1f1f1f] transition active:scale-[0.99] disabled:opacity-60"
      >
        <GoogleIcon className="h-5 w-5" />
        Войти через Google
      </button>
    </section>
  );
}
