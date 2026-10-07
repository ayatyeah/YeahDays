"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Logo from "@/components/Logo";
import OwnerAnalytics from "@/components/OwnerAnalytics";
import { cn } from "@/lib/cn";
import { agoLabel, type Presence } from "@/lib/presence";

type Tab = "users" | "requests" | "devices" | "analytics";

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
  presence: Presence;
}

type UserFilter = "all" | "online" | "new";

const DAY = 24 * 60 * 60_000;

interface ResetRequest {
  id: string;
  email: string;
  phone: string;
  birthYear: number;
  telegram: string;
  status: string;
  createdAt: string;
}

interface OwnerDevice {
  id: string;
  label: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  lastSentAt: string | null;
  userId: string;
  userLabel: string;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Владельческая консоль (/admin, доступ гейтится на сервере в page.tsx).
 * Видеть пользователей (кто в сети — по учёту активности, см. lib/presence.ts)
 * и вручную менять им пароль, разбирать заявки с публичной формы
 * /forgot-password (сайт не шлёт email/SMS, так что это не автосброс, а
 * ручная обработка через telegram из заявки). Плюс вкладка «Аналитика» со
 * сводными числами по сервису (OwnerAnalytics).
 *
 * Страница своя, не раздел приложения: Shell не рисует вокруг неё навигацию,
 * ширину задаёт app/admin/page.tsx.
 */
export default function OwnerConsole({
  /** true — вход открыт запасными admin/admin, об этом нужно сказать прямо */
  showCredentialsWarning = false,
}: {
  showCredentialsWarning?: boolean;
}) {
  const [tab, setTab] = useState<Tab>("users");
  const [users, setUsers] = useState<OwnerUser[] | null>(null);
  const [requests, setRequests] = useState<ResetRequest[] | null>(null);
  const [devices, setDevices] = useState<OwnerDevice[] | null>(null);
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

  const loadDevices = () =>
    fetch("/api/owner/devices")
      .then((r) => r.json())
      .then((json: { devices?: OwnerDevice[] }) => setDevices(json.devices ?? []));

  useEffect(() => {
    void loadUsers();
    void loadRequests();
    void loadDevices();
  }, []);

  // «В сети» живёт минутами: пока список пользователей на экране, тихо
  // перечитываем его раз в 30 секунд (и сразу — когда вкладку вернули).
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (tab !== "users") return;
    const refresh = () => {
      if (document.visibilityState !== "visible") return;
      setNow(Date.now());
      void loadUsers().catch(() => {});
    };
    const timer = window.setInterval(refresh, 30_000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [tab]);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<UserFilter>("all");
  const stats = useMemo(() => {
    const list = users ?? [];
    return {
      total: list.length,
      online: list.filter((u) => u.presence.state === "online").length,
      day: list.filter((u) => u.presence.lastActiveAt && now - Date.parse(u.presence.lastActiveAt) < DAY).length,
      week: list.filter((u) => now - Date.parse(u.createdAt) < 7 * DAY).length,
    };
  }, [users, now]);
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (users ?? []).filter((u) => {
      if (filter === "online" && u.presence.state !== "online") return false;
      if (filter === "new" && now - Date.parse(u.createdAt) >= 7 * DAY) return false;
      return !q || [u.name, u.email, u.username].some((v) => v?.toLowerCase().includes(q));
    });
  }, [users, query, filter, now]);

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
      <header className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Logo className="h-7 w-auto" />
          <h1 className="text-[22px] font-bold tracking-tight sm:text-[26px]">Консоль</h1>
        </div>
        <div className="flex shrink-0 items-baseline gap-4">
          <Link
            href="/today"
            className="text-[15px] text-[var(--color-muted)] transition hover:text-[var(--color-fg)]"
          >
            в приложение →
          </Link>
          <button
            onClick={async () => {
              await fetch("/api/admin/login", { method: "DELETE" }).catch(() => {});
              window.location.href = "/admin/login";
            }}
            className="text-[15px] text-[var(--color-muted)] transition hover:text-[var(--color-fg)]"
          >
            выйти
          </button>
        </div>
      </header>

      {/* Пароль по умолчанию — это отсутствие пароля: адрес консоли рано или
          поздно попадёт в чей-то браузерный журнал. Говорим об этом каждый
          раз, пока переменные не заданы. */}
      {showCredentialsWarning && (
        <p className="mb-4 rounded-2xl border border-[var(--color-strength)] px-4 py-3 text-[14px] leading-snug text-[var(--color-fg-dim)]">
          Вход работает по запасным <b>admin / admin</b> — их знает любой, кто
          видел исходники. Задай на сервере переменные <b>ADMIN_USER</b> и{" "}
          <b>ADMIN_PASSWORD</b>, и это предупреждение пропадёт.
        </p>
      )}

      <div className="mb-5 grid grid-cols-2 gap-2 lg:grid-cols-4">
        {(
          [
            ["Пользователей", stats.total, null],
            ["В сети сейчас", stats.online, "online"],
            ["Активны за сутки", stats.day, null],
            ["Новых за неделю", stats.week, null],
          ] as [string, number, string | null][]
        ).map(([label, value, kind]) => (
          <div key={label} className="rounded-2xl surface px-4 py-3">
            <p className="text-[13px] text-[var(--color-muted)]">{label}</p>
            <p className="mt-0.5 flex items-center gap-2 text-[26px] font-bold tabular-nums">
              {kind === "online" && <StatusDot state="online" />}
              {users === null ? "…" : value}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(
          [
            ["users", "Пользователи"],
            ["requests", `Заявки${pendingCount ? ` · ${pendingCount}` : ""}`],
            ["devices", `Устройства${devices ? ` · ${devices.length}` : ""}`],
            ["analytics", "Аналитика"],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "rounded-2xl border py-2.5 text-[15px] font-medium transition",
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
        <div>
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Имя, почта или логин"
              className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 text-[15px] outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-fg-dim)] sm:max-w-sm"
            />
            <div className="flex gap-1.5">
              {(
                [
                  ["all", `Все · ${stats.total}`],
                  ["online", `В сети · ${stats.online}`],
                  ["new", `Новые · ${stats.week}`],
                ] as [UserFilter, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={cn(
                    "h-11 rounded-2xl border px-3.5 text-[14px] font-medium whitespace-nowrap transition",
                    filter === key
                      ? "border-[var(--color-fg)] bg-[var(--color-surface-2)]"
                      : "border-[var(--color-border)] text-[var(--color-muted)]",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {users === null ? (
            <p className="text-[15px] text-[var(--color-muted)]">Загрузка…</p>
          ) : shown.length === 0 ? (
            <p className="text-[15px] text-[var(--color-muted)]">
              {users.length === 0 ? "Пока нет пользователей." : "Никого не нашлось."}
            </p>
          ) : (
            <>
              {/* Широкий экран — таблица: консоль открывают в основном с ноутбука. */}
              <div className="hidden overflow-hidden rounded-2xl border border-[var(--color-border)] md:block">
                <table className="w-full text-left text-[14px]">
                  <thead className="bg-[var(--color-surface)] text-[12px] uppercase tracking-wide text-[var(--color-muted)]">
                    <tr>
                      <th className="px-4 py-2.5 font-medium">Пользователь</th>
                      <th className="px-4 py-2.5 font-medium">Активность</th>
                      <th className="px-4 py-2.5 font-medium">Вход</th>
                      <th className="px-4 py-2.5 font-medium">С нами</th>
                      <th className="px-4 py-2.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {shown.map((u) => (
                      <tr key={u.id} className={cn("border-t border-[var(--color-border)] align-middle", u.banned && "opacity-50")}>
                        <td className="max-w-[320px] px-4 py-3">
                          <p className="truncate font-medium">
                            {u.name || u.username || u.email || u.id}
                            {u.banned && <BannedTag />}
                          </p>
                          <p className="truncate text-[12px] text-[var(--color-muted)]">
                            {[u.email, u.username && `@${u.username}`, u.birthYear].filter(Boolean).join(" · ")}
                          </p>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <PresenceLabel presence={u.presence} now={now} />
                        </td>
                        <td className="px-4 py-3 text-[13px] text-[var(--color-muted)]">
                          {[...u.providers, u.hasPassword ? "пароль" : null].filter(Boolean).join(", ") || "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-[13px] text-[var(--color-muted)]">
                          {fmtDate(u.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1.5">
                            <UserActions user={u} onPassword={setPasswordTarget} onBan={toggleBan} onDelete={setDeleteTarget} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Телефон — карточки. */}
              <div className="space-y-1.5 md:hidden">
                {shown.map((u) => (
                  <div key={u.id} className="rounded-2xl surface px-3 py-2.5">
                    <div className={cn("min-w-0", u.banned && "opacity-50")}>
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-[15px] font-medium">
                          {u.name || u.username || u.email || u.id}
                          {u.banned && <BannedTag />}
                        </p>
                        <span className="shrink-0 text-[12px]">
                          <PresenceLabel presence={u.presence} now={now} />
                        </span>
                      </div>
                      <p className="truncate text-[12px] text-[var(--color-muted)]">
                        {[
                          u.email,
                          u.username && `@${u.username}`,
                          u.birthYear,
                          `с ${fmtDate(u.createdAt)}`,
                          u.providers.join(", "),
                          u.hasPassword ? "есть пароль" : "без пароля",
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <div className="mt-2.5 flex gap-1.5">
                      <UserActions user={u} onPassword={setPasswordTarget} onBan={toggleBan} onDelete={setDeleteTarget} stretch />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {tab === "requests" && (
        <div className="space-y-1.5">
          {requests === null ? (
            <p className="text-[15px] text-[var(--color-muted)]">Загрузка…</p>
          ) : requests.length === 0 ? (
            <p className="text-[15px] text-[var(--color-muted)]">Заявок пока нет.</p>
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
                  <p className="truncate text-[15px] font-medium">{r.email}</p>
                  <p className="truncate text-[12px] text-[var(--color-muted)]">
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

      {/* Аналитика грузится только когда вкладку открыли: это полтора десятка
          запросов к базе, а в консоль чаще заходят сменить кому-то пароль. */}
      {tab === "analytics" && <OwnerAnalytics />}

      {tab === "devices" && (
        <div className="space-y-1.5">
          {devices === null ? (
            <p className="text-[15px] text-[var(--color-muted)]">Загрузка…</p>
          ) : devices.length === 0 ? (
            <p className="text-[15px] text-[var(--color-muted)]">
              Ни одно устройство ещё не подписалось на уведомления.
            </p>
          ) : (
            devices.map((d) => (
              <div
                key={d.id}
                className={cn("rounded-2xl surface px-3 py-2.5", !d.enabled && "opacity-50")}
              >
                <p className="truncate text-[15px] font-medium">
                  {d.label}
                  <span
                    className={cn(
                      "ml-1.5 text-[12px] font-bold uppercase",
                      d.enabled ? "text-[var(--color-stability)]" : "text-[var(--color-muted)]",
                    )}
                  >
                    {d.enabled ? "активно" : "выключено"}
                  </span>
                </p>
                <p className="truncate text-[12px] text-[var(--color-muted)]">
                  {d.userLabel} · с {fmtDate(d.createdAt)} · обновлено {fmtDateTime(d.updatedAt)}
                  {d.lastSentAt && ` · последняя отправка ${fmtDateTime(d.lastSentAt)}`}
                </p>
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

function StatusDot({ state }: { state: Presence["state"] }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block h-2.5 w-2.5 shrink-0 rounded-full",
        state === "online" && "bg-[var(--color-stability)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-stability)_25%,transparent)]",
        state === "away" && "bg-[var(--color-muted)]",
        state === "unknown" && "border border-[var(--color-border)]",
      )}
    />
  );
}

/** «в сети» / «5 мин назад» / «нет данных» — у кого учёт активности выключен. */
function PresenceLabel({ presence, now }: { presence: Presence; now: number }) {
  return (
    <span
      className="inline-flex items-center gap-2"
      title={presence.state === "unknown" ? "Учёт активности выключен — статус неизвестен" : undefined}
    >
      <StatusDot state={presence.state} />
      {presence.state === "online" ? (
        <span className="font-medium text-[var(--color-stability)]">в сети</span>
      ) : presence.lastActiveAt ? (
        <span className="text-[var(--color-fg-dim)]">{agoLabel(presence.lastActiveAt, now)}</span>
      ) : (
        <span className="text-[var(--color-muted)]">нет данных</span>
      )}
    </span>
  );
}

function BannedTag() {
  return (
    <span className="ml-1.5 text-[12px] font-bold uppercase text-[var(--color-strength)]">
      забанен
    </span>
  );
}

function UserActions({
  user,
  onPassword,
  onBan,
  onDelete,
  stretch = false,
}: {
  user: OwnerUser;
  onPassword: (u: OwnerUser) => void;
  onBan: (u: OwnerUser) => void;
  onDelete: (u: OwnerUser) => void;
  /** на телефоне кнопки делят строку поровну */
  stretch?: boolean;
}) {
  return (
    <>
      <Button size="sm" className={cn(stretch && "flex-1")} onClick={() => onPassword(user)}>
        Пароль
      </Button>
      <Button size="sm" className={cn(stretch && "flex-1")} onClick={() => void onBan(user)}>
        {user.banned ? "Разбанить" : "Забанить"}
      </Button>
      <Button size="sm" variant="danger" className={cn(stretch && "flex-1")} onClick={() => onDelete(user)}>
        Удалить
      </Button>
    </>
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
        <p className="text-[16px] leading-snug text-[var(--color-fg-dim)]">
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
          className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 text-[16px] outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-fg-dim)]"
        />
        {error && <p className="text-[15px] text-[var(--color-strength)]">{error}</p>}
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
