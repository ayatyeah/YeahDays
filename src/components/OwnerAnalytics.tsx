"use client";

import { useEffect, useState } from "react";

interface Count {
  name: string;
  count: number;
}

interface Spend {
  calls: number;
  tokens: number;
}

interface Report {
  id: string;
  question: string;
  answer: string;
  text: string;
  status: string;
  createdAt: string;
}

interface Analytics {
  generatedAt: string;
  users: {
    total: number;
    banned: number;
    new7: number;
    new30: number;
    registrations: { day: string; count: number }[];
  };
  active: { day: number; week: number; month: number };
  signIn: Count[];
  features: Count[];
  ai: { name: string; today: Spend; week: Spend; month: Spend }[];
  events: { participants: number; sharing: number; averagePercent: number; ready: number; newReports: number };
  challenge30: {
    drafts: number;
    running: number;
    finished: number;
    levels: { easy: number; medium: number; hard: number };
    successDays: number;
    hours: number;
    tokens: number;
    generationsToday: number;
  };
}

const PROVIDERS: Record<string, string> = {
  google: "Google",
  "microsoft-entra-id": "Microsoft AITU",
};

function Tile({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl surface px-3 py-2.5">
      <p className="text-[12px] text-[var(--color-muted)]">{label}</p>
      <p className="mt-0.5 text-[22px] font-bold leading-tight">{value}</p>
      {hint && <p className="text-[12px] text-[var(--color-muted)]">{hint}</p>}
    </div>
  );
}

/** Строки «название — число» с полоской доли от `total`. */
function Bars({ rows, total }: { rows: Count[]; total: number }) {
  return (
    <div className="space-y-2 rounded-2xl surface px-3 py-3">
      {rows.map((r) => (
        <div key={r.name}>
          <div className="flex justify-between gap-3 text-[14px]">
            <span className="min-w-0 truncate">{r.name}</span>
            <span className="shrink-0 text-[var(--color-muted)]">
              {r.count}
              {total > 0 && ` · ${Math.round((r.count / total) * 100)}%`}
            </span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
            <div
              className="h-full rounded-full bg-[var(--color-fg)]"
              style={{ width: `${total > 0 ? Math.min(100, (r.count / total) * 100) : 0}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 mt-5 text-[13px] font-semibold uppercase tracking-wide text-[var(--color-muted)]">
      {children}
    </h2>
  );
}

/**
 * Вкладка «Аналитика» владельческой консоли.
 *
 * Здесь только сводные числа — кто именно что делал, отсюда не видно, и так
 * задумано (см. lib/ownerAnalytics.ts). Графики нарисованы блоками, без
 * библиотеки: один столбчатый ряд не стоит лишних килобайт в бандле.
 */
export default function OwnerAnalytics() {
  const [data, setData] = useState<Analytics | null>(null);
  const [error, setError] = useState("");
  const [reports, setReports] = useState<Report[] | null>(null);

  const loadReports = () =>
    fetch("/api/owner/event-reports", { cache: "no-store" })
      .then((r) => r.json())
      .then((json: { reports?: Report[] }) => setReports(json.reports ?? []))
      .catch(() => setReports([]));

  async function setStatus(report: Report, status: string) {
    setReports((list) => list?.map((r) => (r.id === report.id ? { ...r, status } : r)) ?? list);
    await fetch("/api/owner/event-reports", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: report.id, status }),
    }).catch(() => {});
  }

  useEffect(() => {
    fetch("/api/owner/analytics", { cache: "no-store" })
      .then(async (r) => {
        const json = await r.json();
        if (!r.ok) throw new Error(json.error ?? "Не удалось загрузить аналитику");
        setData(json as Analytics);
      })
      .catch((e: Error) => setError(e.message));
    void loadReports();
  }, []);

  if (error) return <p className="text-[15px] text-[var(--color-strength)]">{error}</p>;
  if (!data) return <p className="text-[15px] text-[var(--color-muted)]">Загрузка…</p>;

  const { users, active, challenge30: c } = data;
  const peak = Math.max(1, ...users.registrations.map((d) => d.count));
  const plans = c.drafts + c.running + c.finished;

  return (
    <div>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        <Tile label="Аккаунтов" value={users.total} hint={users.banned ? `заблокировано: ${users.banned}` : undefined} />
        <Tile label="Новых за 7 дней" value={users.new7} hint={`за 30 дней: ${users.new30}`} />
        <Tile label="Активны за сутки" value={active.day} hint={`за 7 дней: ${active.week}`} />
        <Tile label="Активны за 30 дней" value={active.month} hint={users.total ? `${Math.round((active.month / users.total) * 100)}% аккаунтов` : undefined} />
      </div>
      <p className="mt-2 text-[12px] leading-snug text-[var(--color-muted)]">
        Активный — аккаунт, который за это время менял свой план (была синхронизация).
      </p>

      <Heading>Регистрации за 30 дней</Heading>
      <div className="rounded-2xl surface px-3 py-3">
        <div role="img" aria-label="Регистрации по дням за 30 дней" className="flex h-24 items-end gap-0.5">
          {users.registrations.map((d) => (
            <div
              key={d.day}
              title={`${d.day}: ${d.count}`}
              className={d.count ? "flex-1 rounded-sm bg-[var(--color-fg)]" : "flex-1 rounded-sm bg-[var(--color-surface-2)]"}
              style={{ height: `${Math.max(4, (d.count / peak) * 100)}%` }}
            />
          ))}
        </div>
        <div className="mt-1.5 flex justify-between text-[12px] text-[var(--color-muted)]">
          <span>{users.registrations[0]?.day}</span>
          <span>максимум за день: {peak === 1 && users.new30 === 0 ? 0 : peak}</span>
          <span>сегодня</span>
        </div>
      </div>

      <Heading>Чем пользуются</Heading>
      <Bars rows={data.features} total={users.total} />

      <Heading>Как входят</Heading>
      <Bars rows={data.signIn.map((s) => ({ ...s, name: PROVIDERS[s.name] ?? s.name }))} total={users.total} />

      <Heading>Челлендж 30</Heading>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        <Tile label="Идут сейчас" value={c.running} hint={`черновиков: ${c.drafts} · завершено: ${c.finished}`} />
        <Tile label="Отмечено часов" value={c.hours} hint={`зачтённых дней: ${c.successDays}`} />
        <Tile label="Токенов на планы" value={c.tokens.toLocaleString("ru-RU")} hint={plans ? `≈ ${Math.round(c.tokens / plans).toLocaleString("ru-RU")} на план` : undefined} />
        <Tile label="Генераций сегодня" value={c.generationsToday} hint="лимит: 2 на человека в день" />
      </div>
      <div className="mt-1.5">
        <Bars
          rows={[
            { name: "Лёгкий · 3 ч", count: c.levels.easy },
            { name: "Средний · 6 ч", count: c.levels.medium },
            { name: "Тяжёлый · 12 ч", count: c.levels.hard },
          ]}
          total={plans}
        />
      </div>

      <Heading>Расход ИИ</Heading>
      <div className="overflow-x-auto rounded-2xl surface px-3 py-3">
        <table className="w-full min-w-[420px] text-left text-[14px]">
          <thead className="text-[12px] text-[var(--color-muted)]">
            <tr>
              <th className="pb-2 font-normal">Функция</th>
              <th className="pb-2 text-right font-normal">Сегодня</th>
              <th className="pb-2 text-right font-normal">7 дней</th>
              <th className="pb-2 text-right font-normal">30 дней</th>
            </tr>
          </thead>
          <tbody>
            {data.ai.map((f) => (
              <tr key={f.name} className="border-t border-[var(--color-border)]">
                <td className="py-2 pr-3">{f.name}</td>
                {[f.today, f.week, f.month].map((v, i) => (
                  <td key={i} className="py-2 text-right tabular-nums">
                    {v.tokens.toLocaleString("ru-RU")}
                    <span className="block text-[12px] text-[var(--color-muted)]">{v.calls} выз.</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-[12px] text-[var(--color-muted)]">
          Числа — токены (вход + выход). Учёт ведётся с момента выкатки этой вкладки; более ранние вызовы видны только в кабинете OpenAI.
        </p>
      </div>

      <Heading>Ивенты</Heading>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        <Tile label="Проходят ивенты" value={data.events.participants} hint="аккаунтов с сохранённым прогрессом" />
        <Tile label="Средняя готовность" value={`${data.events.averagePercent}%`} />
        <Tile label="Готовы на 85%+" value={data.events.ready} />
        <Tile label="В рейтинге друзей" value={data.events.sharing} hint="включили показ результата" />
      </div>

      <Heading>{`Ошибки в вопросах${data.events.newReports ? ` · новых: ${data.events.newReports}` : ""}`}</Heading>
      <div className="space-y-1.5">
        {reports === null ? (
          <p className="text-[15px] text-[var(--color-muted)]">Загрузка…</p>
        ) : reports.length === 0 ? (
          <p className="text-[15px] text-[var(--color-muted)]">Сообщений пока нет.</p>
        ) : (
          reports.map((r) => (
            <div key={r.id} className={r.status === "done" ? "rounded-2xl surface px-3 py-2.5 opacity-50" : "rounded-2xl surface px-3 py-2.5"}>
              <p className="text-[14px] font-medium" lang="en">{r.question}</p>
              <p className="mt-1 text-[12px] text-[var(--color-muted)]" lang="en">Верный ответ сейчас: {r.answer}</p>
              <p className="mt-2 text-[14px]">{r.text}</p>
              <div className="mt-2 flex items-center justify-between gap-3 text-[12px] text-[var(--color-muted)]">
                <span>{new Date(r.createdAt).toLocaleString("ru-RU")}</span>
                <button className="underline" onClick={() => void setStatus(r, r.status === "done" ? "new" : "done")}>
                  {r.status === "done" ? "вернуть в новые" : "разобрано"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="mt-4 text-[12px] text-[var(--color-muted)]">
        Собрано {new Date(data.generatedAt).toLocaleString("ru-RU")} · только сводные числа, без личных данных.
      </p>
    </div>
  );
}
