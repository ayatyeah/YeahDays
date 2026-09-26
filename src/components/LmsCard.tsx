"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useSyncStatus } from "@/store/useSyncStatus";

type Status = { linked: boolean; connected: boolean; lastSyncedAt?: string; lastError?: string };
export default function LmsCard() {
  const { data: session, status } = useSession();
  const [info, setInfo] = useState<Status | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [reload, setReload] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setInfo(null); setMessage("");
    if (status !== "authenticated") return;
    fetch("/api/account/lms", { cache: "no-store", signal: controller.signal })
      .then(async (r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setInfo).catch(() => { if (!controller.signal.aborted) setMessage("Не удалось загрузить подключение LMS"); });
    return () => controller.abort();
  }, [status, session?.user?.id, reload]);

  async function act(method: "POST" | "DELETE") {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/account/lms", { method });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Не удалось обновить LMS");
      const state = await fetch("/api/account/lms", { cache: "no-store" });
      if (!state.ok) throw new Error("Не удалось загрузить статус LMS");
      setInfo(await state.json());
      setMessage(method === "DELETE" ? "Обновление отключено. Уже загруженные задачи сохранены." : `Календарь обновлён. Новых дедлайнов: ${result.created}.`);
      if (method === "POST") await useSyncStatus.getState().syncNow?.();
    } catch (e) { setMessage(e instanceof Error ? e.message : "Нет связи с сервером"); }
    finally { setBusy(false); }
  }

  return <section className="rounded-3xl surface p-5">
    <h3 className="text-[15px] font-semibold">LMS AITU</h3>
    <p className="mt-1 text-[13px] text-[var(--color-muted)]">Твои дедлайны из университета — в личном календаре. Автообновление три раза в день.</p>
    {status === "unauthenticated" ? <Link href="/login/lms" className="mt-3 block underline">Войти через LMS</Link> : <>
      {info && <p className="mt-3 text-sm">{info.connected ? "Календарь подключён" : info.linked ? "Вход через LMS подключён, календарь пока не подключён" : "LMS ещё не подключена"}</p>}
      {info?.lastSyncedAt && <p className="mt-1 text-xs text-[var(--color-muted)]">Обновлено: {new Date(info.lastSyncedAt).toLocaleString("ru-RU")}</p>}
      {info?.lastError && <p className="mt-2 text-sm text-[var(--color-strength)]">{info.lastError}</p>}
      {info?.connected && <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" disabled={busy} onClick={() => void act("POST")}>{busy ? "Подожди…" : "Обновить дедлайны"}</Button>
        <Button size="sm" disabled={busy} onClick={() => void act("DELETE")}>Отключить календарь</Button>
      </div>}
      {info && !busy && <Link href="/login/lms?link=1" className="mt-3 block text-sm underline">{info.connected ? "Подключить повторно" : "Подключить через логин LMS"}</Link>}
      {!info && status === "authenticated" && <Button size="sm" onClick={() => setReload((n) => n + 1)} className="mt-3">Проверить подключение</Button>}
    </>}
    {message && <p role="status" className="mt-3 text-sm">{message}</p>}
  </section>;
}
