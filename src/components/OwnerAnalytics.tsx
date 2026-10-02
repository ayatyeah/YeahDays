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

interface SocialReport {
  id: string;
  postId: string;
  text: string;
  images: string[];
  author: string;
  comment: boolean;
  reason: string;
  createdAt: string;
}

/** Столбики по дням: самый высокий — максимум периода, пустой день — тонкая серая черта. */
function DayBars({ values, label, days }: { values: number[]; label: string; days: string[] }) {
  const peak = Math.max(1, ...values);
  return (
    <div className="rounded-2xl surface px-3 py-3">
      <div role="img" aria-label={label} className="flex h-24 items-end gap-0.5">
        {values.map((value, i) => (
          <div
            key={days[i]}
            title={`${days[i]}: ${value}`}
            className={value ? "flex-1 rounded-sm bg-[var(--color-fg)]" : "flex-1 rounded-sm bg-[var(--color-surface-2)]"}
            style={{ height: `${Math.max(4, (value / peak) * 100)}%` }}
          />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[12px] text-[var(--color-muted)]">
        <span>{days[0]}</span>
        <span>максимум за день: {values.some(Boolean) ? peak : 0}</span>
        <span>сегодня</span>
      </div>
    </div>
  );
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
  visits: {
    daily: { day: string; visitors: number; signedIn: number; views: number }[];
    today: { visitors: number; signedIn: number; views: number };
    week: { visitors: number; views: number };
    month: { visitors: number; views: number };
    sections: { path: string; name: string; views: number }[];
  };
  activity: {
    tracked: number;
    daily: { day: string; active: number; minutes: number }[];
    activeWeek: number;
    activeMonth: number;
    minutesPerActiveDay: number;
    sessions: number;
    done: { tasks: number; actions: number; quests: number };
    sections: { name: string; minutes: number; percent: number }[];
    retention: { name: string; eligible: number; returned: number; percent: number }[];
  };
  funnel: { name: string; count: number; percent: number; fromPrevious: number | null }[];
  consent: { accepted: number; activity: number; ai: number };
  community: { published: number; posts: number; postsWeek: number; comments: number; likes: number; follows: number; teams: number; openTeams: number; reports: number; photos: number; hidden: number };
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
  const [social, setSocial] = useState<SocialReport[] | null>(null);

  const loadSocial = () =>
    fetch("/api/owner/social-reports", { cache: "no-store" })
      .then((r) => r.json())
      .then((json: { reports?: SocialReport[] }) => setSocial(json.reports ?? []))
      .catch(() => setSocial([]));

  /** Отклонить жалобу или удалить пост — в обоих случаях жалоба уходит из списка. */
  async function moderate(report: SocialReport, remove: boolean) {
    if (remove && !confirm("Удалить этот пост у всех? Отменить нельзя.")) return;
    setSocial((list) => list?.filter((r) => (remove ? r.postId !== report.postId : r.id !== report.id)) ?? list);
    await fetch("/api/owner/social-reports", {
      method: remove ? "DELETE" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(remove ? { postId: report.postId } : { id: report.id }),
    }).catch(() => {});
  }

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
    void loadSocial();
  }, []);

  if (error) return <p className="text-[15px] text-[var(--color-strength)]">{error}</p>;
  if (!data) return <p className="text-[15px] text-[var(--color-muted)]">Загрузка…</p>;

  const { users, active, challenge30: c, visits, activity, community } = data;
  const peak = Math.max(1, ...users.registrations.map((d) => d.count));
  const plans = c.drafts + c.running + c.finished;
  const guestsToday = visits.today.visitors - visits.today.signedIn;

  return (
    <div>
      <Heading>Посещения</Heading>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        <Tile label="Посетителей сегодня" value={visits.today.visitors} hint={`вошедших: ${visits.today.signedIn} · гостей: ${guestsToday}`} />
        <Tile label="Просмотров сегодня" value={visits.today.views} />
        <Tile label="За 7 дней" value={visits.week.visitors} hint={`просмотров: ${visits.week.views}`} />
        <Tile label="За 30 дней" value={visits.month.visitors} hint={`просмотров: ${visits.month.views}`} />
      </div>
      <div className="mt-1.5">
        <DayBars values={visits.daily.map((d) => d.visitors)} days={visits.daily.map((d) => d.day)} label="Посетители по дням за 30 дней" />
      </div>
      <p className="mt-2 text-[12px] leading-snug text-[var(--color-muted)]">
        Посетитель — устройство за день, без cookie и без хранения IP. Сумма за неделю и месяц складывает дни: человек, заходивший три дня, посчитан трижды. Счёт идёт с момента выкатки.
      </p>
      {visits.sections.length > 0 && (
        <div className="mt-1.5">
          <Bars rows={visits.sections.slice(0, 12).map((x) => ({ name: x.name, count: x.views }))} total={visits.month.views} />
        </div>
      )}

      <Heading>Аккаунты</Heading>
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

      <Heading>Воронка</Heading>
      <div className="space-y-2 rounded-2xl surface px-3 py-3">
        {data.funnel.map((step) => (
          <div key={step.name}>
            <div className="flex justify-between gap-3 text-[14px]">
              <span className="min-w-0 truncate">{step.name}</span>
              <span className="shrink-0 text-[var(--color-muted)]">
                {step.count} · {step.percent}%{step.fromPrevious !== null && step.fromPrevious <= 100 && ` · от прошлого шага ${step.fromPrevious}%`}
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
              <div className="h-full rounded-full bg-[var(--color-fg)]" style={{ width: `${step.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[12px] leading-snug text-[var(--color-muted)]">
        Где сильнее всего падает доля — там люди и уходят.
      </p>

      <Heading>Активность</Heading>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        <Tile label="С учётом активности" value={activity.tracked} hint={users.total ? `${Math.round((activity.tracked / users.total) * 100)}% аккаунтов` : undefined} />
        <Tile label="Активны за 7 дней" value={activity.activeWeek} hint={`за 30 дней: ${activity.activeMonth}`} />
        <Tile label="Минут в активный день" value={activity.minutesPerActiveDay} hint={`заходов за 30 дней: ${activity.sessions}`} />
        <Tile label="Выполнено за 30 дней" value={activity.done.tasks + activity.done.actions + activity.done.quests} hint={`дел ${activity.done.tasks} · действий ${activity.done.actions} · квестов ${activity.done.quests}`} />
      </div>
      <div className="mt-1.5">
        <DayBars values={activity.daily.map((d) => d.active)} days={activity.daily.map((d) => d.day)} label="Активные аккаунты по дням за 30 дней" />
      </div>
      <p className="mt-2 text-[12px] leading-snug text-[var(--color-muted)]">
        Только аккаунты, разрешившие учёт активности, — это выборка, а не все. Время считается по активной вкладке.
      </p>
      {activity.sections.length > 0 && (
        <div className="mt-1.5 space-y-2 rounded-2xl surface px-3 py-3">
          <p className="text-[12px] text-[var(--color-muted)]">Где проводят время (за 30 дней)</p>
          {activity.sections.map((x) => (
            <div key={x.name}>
              <div className="flex justify-between gap-3 text-[14px]">
                <span className="min-w-0 truncate">{x.name}</span>
                <span className="shrink-0 text-[var(--color-muted)]">{x.minutes} мин · {x.percent}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                <div className="h-full rounded-full bg-[var(--color-fg)]" style={{ width: `${x.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <Heading>Удержание</Heading>
      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
        {activity.retention.map((r) => (
          <Tile key={r.name} label={r.name} value={r.eligible ? `${r.percent}%` : "—"} hint={r.eligible ? `вернулись ${r.returned} из ${r.eligible}` : "пока мало данных"} />
        ))}
      </div>
      <p className="mt-2 text-[12px] leading-snug text-[var(--color-muted)]">
        Доля тех, кто вернулся после своего первого активного дня. Считаются только аккаунты, у которых этот срок уже прошёл.
      </p>

      <Heading>Согласия</Heading>
      <div className="grid grid-cols-3 gap-1.5">
        <Tile label="Приняли политику" value={data.consent.accepted} hint={users.total ? `${Math.round((data.consent.accepted / users.total) * 100)}%` : undefined} />
        <Tile label="Учёт активности" value={data.consent.activity} />
        <Tile label="Данные для ИИ" value={data.consent.ai} />
      </div>

      <Heading>Сообщество</Heading>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        <Tile label="Участников" value={community.published} hint={`скрыли себя: ${community.hidden}`} />
        <Tile label="Постов" value={community.posts} hint={`за 7 дней: ${community.postsWeek} · фото: ${community.photos}`} />
        <Tile label="Лайков и комментариев" value={community.likes + community.comments} hint={`подписок: ${community.follows}`} />
        <Tile label="Команд" value={community.teams} hint={`открытых: ${community.openTeams}`} />
      </div>

      <Heading>{`Жалобы на посты${social?.length ? ` · ${social.length}` : ""}`}</Heading>
      <div className="space-y-1.5">
        {social === null ? (
          <p className="text-[15px] text-[var(--color-muted)]">Загрузка…</p>
        ) : social.length === 0 ? (
          <p className="text-[15px] text-[var(--color-muted)]">Жалоб нет.</p>
        ) : (
          social.map((r) => (
            <div key={r.id} className="rounded-2xl surface px-3 py-2.5">
              <p className="text-[12px] text-[var(--color-muted)]">{r.comment ? "Комментарий" : "Пост"} · {r.author} · {new Date(r.createdAt).toLocaleString("ru-RU")}</p>
              <p className="mt-1 whitespace-pre-wrap break-words text-[14px]">{r.text}</p>
              {r.images.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {r.images.map((src) => <a key={src} href={src} target="_blank" rel="noopener"><img src={src} alt="Фото из поста" className="h-24 w-24 rounded-lg object-cover" /></a>)}
                </div>
              )}
              <p className="mt-2 text-[14px]"><b>Жалоба:</b> {r.reason}</p>
              <div className="mt-2 flex gap-4 text-[13px]">
                <button className="underline text-[var(--color-strength)]" onClick={() => void moderate(r, true)}>удалить пост</button>
                <button className="underline" onClick={() => void moderate(r, false)}>отклонить жалобу</button>
              </div>
            </div>
          ))
        )}
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
