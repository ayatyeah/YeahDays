"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";

/**
 * ID аккаунта, который нужно скопировать в настройки desktop-приложения
 * ДиДи (поле YEAHGRIND_USER_ID), чтобы она читала и писала задачи именно
 * этого аккаунта, а не анонимного device-id. Только для вошедших через
 * Google — у анонимного устройства свой device-id уже есть в localStorage
 * и работает без этого экрана; здесь конкретно про привязку к аккаунту.
 */
export default function DidiSyncId() {
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);

  if (!session?.user?.id) return null;
  const id = session.user.id;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // буфер обмена недоступен (не https, нет разрешения) — молча игнорируем
    }
  };

  return (
    <section className="mt-3 rounded-3xl surface p-4">
      <p className="text-[13px] font-semibold">ID для синхронизации с ДиДи</p>
      <p className="mt-1 text-[11.5px] leading-snug text-[var(--color-muted)]">
        Скопируй и вставь в поле «YEAHGRIND_USER_ID» в настройках приложения
        ДиДи на компьютере — она начнёт читать и писать задачи именно этого
        аккаунта.
      </p>
      <div className="mt-3 flex items-center gap-2">
        <code className="min-w-0 flex-1 truncate rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-[12px]">
          {id}
        </code>
        <Button size="sm" onClick={() => void copy()}>
          {copied ? "Скопировано" : "Копировать"}
        </Button>
      </div>
    </section>
  );
}
