"use client";

import { useEffect, useState } from "react";
import { getUserId } from "@/lib/userId";
import Button from "@/components/ui/Button";

/**
 * Код для привязки YeahGrind-аккаунта внутри стороннего сервиса
 * (StudyLoop и любой следующий) — тот же принцип, что и у DidiSyncId, но
 * не постоянный id, а одноразовый короткоживущий код: обменивается на
 * userId через /api/keys/redeem сервисным ключом, дальше сервис хранит
 * userId у себя. Работает и для анонимного устройства (getUserId), не
 * только для вошедшего аккаунта — привязка не требует логина в YeahGrind
 * с точки зрения стороннего сервиса.
 */
export default function PairingCodeCard() {
  const [pair, setPair] = useState<{ code: string; expiresAt: number } | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!pair) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [pair]);

  const remainingMs = pair ? pair.expiresAt - now : 0;
  const expired = !!pair && remainingMs <= 0;

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const userId = getUserId();
      const res = await fetch("/api/keys/pair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const json = (await res.json()) as { code?: string; expiresAt?: number; error?: string };
      if (!res.ok || !json.code || !json.expiresAt) {
        setError(json.error ?? "Не получилось получить код");
        return;
      }
      setNow(Date.now());
      setPair({ code: json.code, expiresAt: json.expiresAt });
    } catch {
      setError("Нет связи с сервером");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!pair) return;
    try {
      await navigator.clipboard.writeText(pair.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // буфер обмена недоступен — молча игнорируем
    }
  }

  const mm = Math.max(0, Math.floor(remainingMs / 60_000));
  const ss = Math.max(0, Math.floor((remainingMs % 60_000) / 1000));

  return (
    <section className="mt-6 rounded-3xl surface p-4">
      <p className="text-[13px] font-semibold">Код для внешнего сервиса</p>
      <p className="mt-1 text-[11.5px] leading-snug text-[var(--color-muted)]">
        Разово привяжи аккаунт к стороннему сервису (например, StudyLoop):
        получи код и введи его в настройках этого сервиса. Действует 10 минут,
        одноразовый.
      </p>

      {pair && !expired ? (
        <div className="mt-3 flex items-center gap-2">
          <code className="min-w-0 flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-center text-[16px] font-bold tracking-[0.2em]">
            {pair.code}
          </code>
          <Button size="sm" onClick={() => void copy()}>
            {copied ? "Скопировано" : "Копировать"}
          </Button>
        </div>
      ) : (
        <div className="mt-3">
          <Button size="sm" onClick={() => void generate()} disabled={loading}>
            {loading ? "Получаю…" : expired ? "Получить новый код" : "Получить код"}
          </Button>
        </div>
      )}

      {pair && !expired && (
        <p className="mt-2 text-[11px] tabular-nums text-[var(--color-muted)]">
          Истекает через {mm}:{String(ss).padStart(2, "0")}
        </p>
      )}
      {error && (
        <p className="mt-2 text-[11px] text-[var(--color-strength)]">{error}</p>
      )}
    </section>
  );
}
