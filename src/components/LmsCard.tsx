"use client";
import { useLocaleStore } from "@/i18n/locale";
import { useCopy } from "@/i18n/useCopy";


import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useSyncStatus } from "@/store/useSyncStatus";
import MicrosoftSignIn from "@/components/MicrosoftSignIn";

type Status = { linked: boolean; microsoftLinked: boolean; connected: boolean; source: "personal" | "legacy" | null; lastSyncedAt?: string; lastError?: string };
export default function LmsCard() {
  const tx = useCopy();
  const locale = useLocaleStore(s => s.locale);
  const { data: session, status } = useSession();
  const [info, setInfo] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [reload, setReload] = useState(0);
  const [calendarUrl, setCalendarUrl] = useState("");
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    setInfo(null); setMessage(""); setCalendarUrl(""); setEditing(false);
    setLoading(status !== "unauthenticated");
    if (status !== "authenticated") return;
    fetch("/api/account/lms", { cache: "no-store", signal: controller.signal })
      .then(async (r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((result) => { if (!controller.signal.aborted) setInfo(result); })
      .catch(() => { if (!controller.signal.aborted) setMessage(tx("Не удалось проверить подключение. Статус неизвестен — попробуй ещё раз.")); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [status, session?.user?.id, reload, tx]);

  async function act(method: "POST" | "DELETE") {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/account/lms", { method });
      const result = await response.json();
      const state = await fetch("/api/account/lms", { cache: "no-store" });
      if (!state.ok) throw new Error(tx("Не удалось загрузить статус LMS"));
      setInfo(await state.json());
      if (!response.ok) throw new Error(result.error || tx("Не удалось обновить LMS"));
      setMessage(method === "DELETE" ? tx("Обновление отключено. Уже загруженные задачи сохранены.") : tx("Календарь обновлён. Новых дедлайнов: {0}.", {"0": result.created}));
      if (method === "POST") await useSyncStatus.getState().syncNow?.();
    } catch (e) { setMessage(e instanceof Error ? e.message : tx("Нет связи с сервером")); }
    finally { setBusy(false); }
  }

  async function connect(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/account/lms", { method: "PUT",
        headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: calendarUrl }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || tx("Не удалось подключить календарь"));
      setCalendarUrl(""); setEditing(false);
      setInfo((previous) => ({ ...previous, linked: previous?.linked ?? false, microsoftLinked: previous?.microsoftLinked ?? false, connected: true, source: "personal", lastError: undefined, lastSyncedAt: undefined }));
      await act("POST");
    } catch (e) { setMessage(e instanceof Error ? e.message : tx("Нет связи с сервером")); }
    finally { setBusy(false); }
  }

  return <section className="rounded-3xl surface p-5">
    <h3 className="text-[15px] font-semibold">LMS AITU</h3>
    <p className="mt-1 text-[13px] text-[var(--color-muted)]">{tx("Твои дедлайны из университета — в личном календаре. Автообновление три раза в день.")}</p>
    {status === "unauthenticated" ? <Link href="/login?callbackUrl=%2Fsettings" className="mt-3 block underline">{tx("Войти в YeahGrind для подключения")}</Link> : <>
      {loading && <p role="status" className="mt-3 text-sm">{tx("Проверяем подключение LMS…")}</p>}
      {info && <div className="mt-4 space-y-3">
        <div className="rounded-xl border border-[var(--color-border)] p-3">
          <p className="text-sm font-medium">Microsoft AITU: {info.microsoftLinked ? tx("привязан") : tx("не привязан")}</p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">{tx("Это способ входа в YeahGrind. Дедлайны подключаются отдельно через календарь LMS.")}</p>
          {!info.microsoftLinked && <div className="mt-3"><MicrosoftSignIn /></div>}
        </div>
        <div className="rounded-xl border border-[var(--color-border)] p-3">
          <p className="text-sm font-medium">{tx("Календарь LMS: ")}{info.connected ? info.lastError ? tx("подключён, ошибка обновления") : tx("подключён") : tx("не подключён")}</p>
          {!info.connected && <p className="mt-1 text-xs text-[var(--color-muted)]">{tx("Добавь свою ссылку ниже, чтобы загружать дедлайны. Привязка Microsoft для этого не обязательна.")}</p>}
          {info.source === "legacy" && <p className="mt-1 text-xs text-[var(--color-muted)]">{tx("Используется ранее настроенный календарь. Время последнего обновления недоступно. Добавь ссылку заново, чтобы обновлять его здесь вручную.")}</p>}
          {info.source === "personal" && !info.lastSyncedAt && <p className="mt-1 text-xs text-[var(--color-muted)]">{tx("Успешного обновления ещё не было.")}</p>}
        </div>
      </div>}
      {info?.lastSyncedAt && <p className="mt-1 text-xs text-[var(--color-muted)]">{tx("Обновлено: ")}{new Date(info.lastSyncedAt).toLocaleString(locale)}</p>}
      {info?.lastError && <p className="mt-2 text-sm text-[var(--color-strength)]">{tx(info.lastError)}</p>}
      {info?.connected && <div className="mt-3 flex flex-wrap gap-2">
        {info.source === "personal" && <Button size="sm" disabled={busy} onClick={() => void act("POST")}>{busy ? tx("Подожди…") : tx("Обновить дедлайны")}</Button>}
        <Button size="sm" disabled={busy} onClick={() => void act("DELETE")}>{tx("Отключить календарь")}</Button>
      </div>}
      {info?.connected && !editing && <Button size="sm" disabled={busy} onClick={() => setEditing(true)} className="mt-3">{tx("Заменить ссылку календаря")}</Button>}
      {info && (!info.connected || editing) && <form onSubmit={connect} className="mt-4 space-y-3">
        <p className="text-sm leading-relaxed">{tx("Войди в LMS привычной кнопкой OpenID Connect. Затем открой календарь → Export calendar, выбери All events и Custom range (или Recent and next 60 days), нажми Get calendar URL и вставь ссылку сюда.")}</p>
        <a href="https://lms.astanait.edu.kz/calendar/export.php" target="_blank" rel="noopener noreferrer" className="block text-sm underline">{tx("Открыть экспорт календаря LMS")}</a>
        <label className="block text-sm">{tx("Личная ссылка календаря")}<input type="url" required maxLength={4096} autoComplete="off" spellCheck={false} value={calendarUrl} onChange={(event) => setCalendarUrl(event.target.value)} className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-3 text-[16px]" placeholder="https://lms.astanait.edu.kz/calendar/…" />
        </label>
        <p className="text-xs text-[var(--color-muted)]">{tx("Ссылка даёт доступ к твоему календарю. Мы сохраним её зашифрованной; не публикуй её в чатах.")}</p>
        <Button type="submit" size="sm" disabled={busy}>{busy ? tx("Подключаем…") : tx("Подключить мои дедлайны")}</Button>
        {editing && <Button type="button" size="sm" disabled={busy} onClick={() => { setEditing(false); setCalendarUrl(""); }}>{tx("Отмена")}</Button>}
      </form>}
      {!info && !loading && status === "authenticated" && <Button size="sm" onClick={() => setReload((n) => n + 1)} className="mt-3">{tx("Проверить подключение")}</Button>}
    </>}
    {message && <p role="status" className="mt-3 text-sm">{tx(message)}</p>}
  </section>;
}
