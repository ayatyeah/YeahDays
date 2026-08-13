"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type Tab = "users" | "requests";

interface OwnerUser {
  id: string;
  name: string | null;
  email: string | null;
  username: string | null;
  birthYear: number | null;
  createdAt: string;
  hasPassword: boolean;
  banned: boolean;
  providers: string[];
}

interface ResetRequest {
  id: string;
  email: string;
  phone: string;
  birthYear: number;
  telegram: string;
  status: string;
  createdAt: string;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Владельческая консоль (/admin, доступ гейтится на сервере в page.tsx).
 * Две задачи: видеть пользователей и вручную менять им пароль, и разбирать
 * заявки с публичной формы /forgot-password (сайт не шлёт email/SMS, так что
 * это не автосброс, а ручная обработка через telegram из заявки).
 */
export default function OwnerConsole() {
  const [tab, setTab] = useState<Tab>("users");
  const [users, setUsers] = useState<OwnerUser[] | null>(null);
  const [requests, setRequests] = useState<ResetRequest[] | null>(null);
  const [passwordTarget, setPasswordTarget] = useState<OwnerUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<OwnerUser | null>(null);

  const loadUsers = () =>
    fetch("/api/owner/users")
      .then((r) => r.json())
      .then((json: { users?: OwnerUser[] }) => setUsers(json.users ?? []));

  const loadRequests = () =>
    fetch("/api/owner/reset-requests")
      .then((r) => r.json())
      .then((json: { requests?: ResetRequest[] }) => setRequests(json.requests ?? []));

  useEffect(() => {
    void loadUsers();
    void loadRequests();
  }, []);

  const toggleBan = async (u: OwnerUser) => {
    const banned = !u.banned;
    setUsers((prev) => (prev ? prev.map((x) => (x.id === u.id ? { ...x, banned } : x)) : prev));
    try {
      const res = await fetch(`/api/owner/users/${u.id}/ban`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banned }),
      });
      // сервер мог отклонить (например, бан себя же) — перечитываем
      // реальное состояние вместо того, чтобы доверять оптимистичному
      if (!res.ok) void loadUsers();
    } catch {
      void loadUsers();
    }
  };

  const toggleRequestStatus = async (r: ResetRequest) => {
    const next = r.status === "done" ? "new" : "done";
    setRequests((prev) =>
      prev ? prev.map((x) => (x.id === r.id ? { ...x, status: next } : x)) : prev,
    );
    await fetch(`/api/owner/reset-requests/${r.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
  };

  const pendingCount = requests?.filter((r) => r.status !== "done").length ?? 0;

  return (
    <div className="flex flex-1 flex-col">
      <header className="mb-4 flex items-baseline justify-between">
        <h1 className="text-[26px] font-bold tracking-tight">Владелец</h1>
        <Link
          href="/today"
          className="text-[12.5px] text-[var(--color-muted)] transition hover:text-[var(--color-fg)]"
        >
          в приложение →
        </Link>
      </header>

      <div className="mb-4 grid grid-cols-2 gap-2">
        {(
          [
            ["users", "Пользователи"],
            ["requests", `Заявки${pendingCount ? ` · ${pendingCount}` : ""}`],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "rounded-2xl border py-2.5 text-[12.5px] font-medium transition",
              tab === key
                ? "border-[var(--color-fg)] bg-[var(--color-surface-2)]"
                : "border-[var(--color-border)] text-[var(--color-muted)]",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <div className="space-y-1.5">
          {users === null ? (
            <p className="text-[13px] text-[var(--color-muted)]">Загрузка…</p>
          ) : users.length === 0 ? (
            <p className="text-[13px] text-[var(--color-muted)]">Пока нет пользователей.</p>
          ) : (
            users.map((u) => (
              <div key={u.id} className="rounded-2xl surface px-3 py-2.5">
                <div className={cn("min-w-0", u.banned && "opacity-50")}>
                  <p className="truncate text-[13px] font-medium">
                    {u.name || u.username || u.email || u.id}
                    {u.banned && (
                      <span className="ml-1.5 text-[10px] font-bold uppercase text-[var(--color-strength)]">
                        забанен
                      </span>
                    )}
                  </p>
                  <p className="truncate text-[11px] text-[var(--color-muted)]">
                    {[u.email, u.username && `@${u.username}`, u.birthYear]
                      .filter(Boolean)
                      .join(" · ")}
                    {" · с "}
                    {fmtDate(u.createdAt)}
                    {u.providers.length > 0 && ` · ${u.providers.join(", ")}`}
                    {u.hasPassword ? " · есть пароль" : " · без пароля"}
                  </p>
                </div>
                <div className="mt-2.5 flex gap-1.5">
                  <Button size="sm" className="flex-1" onClick={() => setPasswordTarget(u)}>
                    Пароль
                  </Button>
                  <Button size="sm" className="flex-1" onClick={() => void toggleBan(u)}>
                    {u.banned ? "Разбанить" : "Забанить"}
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    className="flex-1"
                    onClick={() => setDeleteTarget(u)}
                  >
                    Удалить
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "requests" && (
        <div className="space-y-1.5">
          {requests === null ? (
            <p className="text-[13px] text-[var(--color-muted)]">Загрузка…</p>
          ) : requests.length === 0 ? (
            <p className="text-[13px] text-[var(--color-muted)]">Заявок пока нет.</p>
          ) : (
            requests.map((r) => (
              <div
                key={r.id}
                className={cn(
                  "flex items-center gap-2.5 rounded-2xl surface px-3 py-2.5",
                  r.status === "done" && "opacity-50",
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium">{r.email}</p>
                  <p className="truncate text-[11px] text-[var(--color-muted)]">
                    {r.phone} · {r.birthYear} · telegram {r.telegram} · {fmtDate(r.createdAt)}
                  </p>
                </div>
                <Button size="sm" onClick={() => void toggleRequestStatus(r)}>
                  {r.status === "done" ? "Вернуть в очередь" : "Отметить решённым"}
                </Button>
              </div>
            ))
          )}
        </div>
      )}

      <PasswordModal
        user={passwordTarget}
        onClose={() => setPasswordTarget(null)}
        onDone={() => {
          setPasswordTarget(null);
          void loadUsers();
        }}
      />
      <DeleteModal
        user={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDone={() => {
          setDeleteTarget(null);
          void loadUsers();
        }}
      />
    </div>
  );
}

function DeleteModal({
  user,
  onClose,
  onDone,
}: {
  user: OwnerUser | null;
  onClose: () => void;
  onDone: () => void;
}) {
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!user) return;
    setBusy(true);
    try {
      await fetch(`/api/owner/users/${user.id}`, { method: "DELETE" });
      onDone();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={!!user} onClose={onClose} title="Удалить пользователя?">
      <div className="space-y-3">
        <p className="text-[13.5px] leading-snug text-[var(--color-fg-dim)]">
          {user?.email ?? user?.id} и все его данные (план, задачи, история,
          push-подписки) удалятся без возможности восстановить.
        </p>
        <div className="flex gap-2.5">
          <Button className="flex-1" onClick={onClose}>
            Отмена
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            disabled={busy}
            onClick={() => void submit()}
          >
            {busy ? "Удаляю…" : "Удалить"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function PasswordModal({
  user,
  onClose,
  onDone,
}: {
  user: OwnerUser | null;
  onClose: () => void;
  onDone: () => void;
}) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPassword("");
    setError(null);
  }, [user]);

  const submit = async () => {
    if (!user) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/owner/users/${user.id}/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(json.error ?? "Не получилось");
        return;
      }
      onDone();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={!!user} onClose={onClose} title={user ? `Пароль для ${user.email ?? user.id}` : ""}>
      <div className="space-y-3">
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Новый пароль (минимум 8 символов)"
          autoFocus
          className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 text-[15px] outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-fg-dim)]"
        />
        {error && <p className="text-[12.5px] text-[var(--color-strength)]">{error}</p>}
        <div className="flex gap-2.5">
          <Button className="flex-1" onClick={onClose}>
            Отмена
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            disabled={busy || password.length < 8}
            onClick={() => void submit()}
          >
            {busy ? "Сохраняю…" : "Сохранить"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
