"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  useUserStore,
  useHydrated,
  selectToday,
  dayLevel,
  isChallengeActive,
  type PlannedTask,
} from "@/store/useUserStore";
import { ACTION_POOL } from "@/lib/actionPool";
import {
  CATEGORIES,
  CATEGORY_LIST,
  dateKey,
  type Action,
  type CategoryKey,
} from "@/lib/domain";
import { LogoLoader } from "@/components/Logo";
import TimelineSchedule from "@/components/TimelineSchedule";
import TodoList from "@/components/TodoList";
import { formatDuration } from "@/components/ActiveTask";
import { cn } from "@/lib/cn";

type Tab = "actions" | "day" | "challenges";

/**
 * Админ-панель.
 *
 * Обычные экраны специально узкие: колода решает, что показать, а человек
 * только свайпает. Но иногда нужно залезть руками — скрыть надоевшее
 * действие, поправить задним числом день, подкрутить челлендж. Всё это
 * живёт здесь, чтобы не засорять основной поток.
 */
export default function AdminPage() {
  const hydrated = useHydrated();
  const [tab, setTab] = useState<Tab>("actions");

  if (!hydrated) return <LogoLoader />;

  return (
    <div className="flex flex-1 flex-col">
      <header className="mb-4 flex items-baseline justify-between">
        <h1 className="text-[26px] font-bold tracking-tight">Управление</h1>
        <Link
          href="/account"
          className="text-[12.5px] text-[var(--color-muted)] transition hover:text-[var(--color-fg)]"
        >
          в профиль →
        </Link>
      </header>

      <div className="mb-4 grid grid-cols-3 gap-2">
        {(
          [
            ["actions", "Действия"],
            ["day", "День"],
            ["challenges", "Челленджи"],
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

      {tab === "actions" && <ActionsTab />}
      {tab === "day" && <DayTab />}
      {tab === "challenges" && <ChallengesTab />}
    </div>
  );
}

/* ────────────────────────  Действия  ──────────────────────── */

function ActionsTab() {
  const disabled = useUserStore((s) => s.disabledActions);
  const toggleDisabled = useUserStore((s) => s.toggleDisabledAction);
  const excluded = useUserStore((s) => s.excludedCategories);
  const toggleExcluded = useUserStore((s) => s.toggleExcludedCategory);
  const customActions = useUserStore((s) => s.customActions);

  const [cat, setCat] = useState<CategoryKey | "all">("all");
  const [q, setQ] = useState("");

  const all = useMemo(
    () => [...customActions, ...ACTION_POOL],
    [customActions],
  );

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return all.filter((a) => {
      if (cat !== "all" && a.category !== cat) return false;
      if (needle && !a.title.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [all, cat, q]);

  const disabledSet = new Set(disabled);

  return (
    <>
      {/* Направления целиком */}
      <section className="mb-4">
        <h2 className="mb-2 text-[12.5px] font-semibold text-[var(--color-fg-dim)]">
          Направления
        </h2>
        <div className="grid grid-cols-3 gap-1.5">
          {CATEGORY_LIST.map((c) => {
            const off = excluded.includes(c.key);
            return (
              <button
                key={c.key}
                onClick={() => toggleExcluded(c.key)}
                className={cn(
                  "rounded-xl border px-2 py-2 text-[11px] transition",
                  off
                    ? "border-[var(--color-border)] text-[var(--color-muted)] line-through opacity-60"
                    : "border-[var(--color-fg-dim)]",
                )}
              >
                {c.icon} {c.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] leading-snug text-[var(--color-muted)]">
          Зачёркнутые направления не попадают в колоду вообще.
        </p>
      </section>

      {/* Поиск и фильтр */}
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Поиск по названию"
        className="mb-2 h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 text-[13.5px] outline-none focus:border-[var(--color-fg-dim)]"
      />
      <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1">
        <FilterChip active={cat === "all"} onClick={() => setCat("all")}>
          все · {all.length}
        </FilterChip>
        {CATEGORY_LIST.map((c) => (
          <FilterChip
            key={c.key}
            active={cat === c.key}
            onClick={() => setCat(c.key)}
          >
            {c.icon} {c.label}
          </FilterChip>
        ))}
      </div>

      <p className="mb-2 text-[11.5px] text-[var(--color-muted)]">
        Показано {list.length} · скрыто вручную {disabled.length}
      </p>

      <div className="space-y-1.5">
        {list.map((a) => {
          const off = disabledSet.has(a.id);
          return (
            <button
              key={a.id}
              onClick={() => toggleDisabled(a.id)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-2xl surface px-3 py-2.5 text-left transition",
                off && "opacity-45",
              )}
            >
              <span className="text-[14px]" aria-hidden>
                {CATEGORIES[a.category].icon}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block truncate text-[13px] font-medium",
                    off && "line-through",
                  )}
                >
                  {a.title}
                </span>
                <span className="block truncate text-[11px] text-[var(--color-muted)]">
                  {a.duration} мин · сложность {a.difficulty}
                  {a.progression ? ` · ступень ${a.progression.step}` : ""}
                  {a.custom ? " · своё" : ""}
                </span>
              </span>
              <span className="shrink-0 text-[11px] text-[var(--color-muted)]">
                {off ? "скрыто" : "вкл"}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-xl border px-2.5 py-1.5 text-[11.5px] transition",
        active
          ? "border-[var(--color-fg)] bg-[var(--color-surface-2)]"
          : "border-[var(--color-border)] text-[var(--color-muted)]",
      )}
    >
      {children}
    </button>
  );
}

/* ────────────────────────  День  ──────────────────────── */

function DayTab() {
  const plan = useUserStore((s) => s.plan);
  const challenges = useUserStore((s) => s.challenges);
  const updateTask = useUserStore((s) => s.updateTask);
  const removeTask = useUserStore((s) => s.removeTask);
  const addTaskForDay = useUserStore((s) => s.addTaskForDay);
  const logChallenge = useUserStore((s) => s.logChallenge);

  const [day, setDay] = useState(dateKey());
  const [adding, setAdding] = useState(false);

  const tasks = useMemo(() => selectToday(plan, day), [plan, day]);
  const level = dayLevel(challenges, day);

  return (
    <>
      <div className="mb-3 flex items-center gap-2">
        <input
          type="date"
          value={day}
          onChange={(e) => setDay(e.target.value || dateKey())}
          className="h-11 flex-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-[13.5px] outline-none"
        />
        <span
          className="h-11 w-11 shrink-0 rounded-2xl border border-[var(--color-border)]"
          style={{
            background:
              level === "green"
                ? "color-mix(in srgb, var(--color-stability) 40%, transparent)"
                : level === "yellow"
                  ? "color-mix(in srgb, var(--color-wealth) 40%, transparent)"
                  : "transparent",
          }}
          title={`Уровень дня: ${level}`}
        />
      </div>

      {/* Задачи дня */}
      <h2 className="mb-2 text-[12.5px] font-semibold text-[var(--color-fg-dim)]">
        Действия ({tasks.length})
      </h2>
      {tasks.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[var(--color-border)] px-4 py-4 text-center text-[12px] text-[var(--color-muted)]">
          В этот день ничего не было
        </p>
      ) : (
        <div className="space-y-1.5">
          {tasks.map((t) => (
            <TaskRow
              key={t.id}
              task={t}
              onToggle={() =>
                updateTask(t.id, {
                  completed: !t.completed,
                  completedAt: !t.completed ? Date.now() : null,
                })
              }
              onRemove={() => removeTask(t.id)}
            />
          ))}
        </div>
      )}

      <button
        onClick={() => setAdding((v) => !v)}
        className="mt-2 w-full rounded-2xl border border-dashed border-[var(--color-border)] py-2.5 text-[12.5px] text-[var(--color-muted)] transition hover:text-[var(--color-fg)]"
      >
        {adding ? "закрыть" : "+ добавить действие в этот день"}
      </button>

      {adding && (
        <AddActionPicker
          onPick={(a, completed) => {
            addTaskForDay(a, day, completed);
            setAdding(false);
          }}
        />
      )}

      {/* Челленджи этого дня */}
      <h2 className="mb-2 mt-6 text-[12.5px] font-semibold text-[var(--color-fg-dim)]">
        Челленджи в этот день
      </h2>
      <div className="space-y-1.5">
        {challenges.filter((c) => isChallengeActive(c, day)).length === 0 && (
          <p className="rounded-2xl border border-dashed border-[var(--color-border)] px-4 py-4 text-center text-[12px] text-[var(--color-muted)]">
            В этот день челленджей не было
          </p>
        )}
        {challenges
          .filter((c) => isChallengeActive(c, day))
          .map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-2 rounded-2xl surface px-3 py-2.5"
            >
              <span className="min-w-0 flex-1 truncate text-[12.5px]">
                {c.title}
              </span>
              <button
                onClick={() => logChallenge(c.id, -1, day)}
                className="h-8 w-8 rounded-lg border border-[var(--color-border)] text-[13px]"
                aria-label="минус"
              >
                −
              </button>
              <span className="w-12 text-center text-[12.5px] font-semibold tabular-nums">
                {c.log[day] ?? 0}
              </span>
              <button
                onClick={() => logChallenge(c.id, 1, day)}
                className="h-8 w-8 rounded-lg border border-[var(--color-border)] text-[13px]"
                aria-label="плюс"
              >
                +
              </button>
            </div>
          ))}
      </div>

      {/* Задачи и почасовое расписание выбранного дня */}
      <TodoList day={day} />
      <TimelineSchedule day={day} />
    </>
  );
}

function TaskRow({
  task,
  onToggle,
  onRemove,
}: {
  task: PlannedTask;
  onToggle: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl surface px-3 py-2.5">
      <button
        onClick={onToggle}
        className={cn(
          "h-6 w-6 shrink-0 rounded-lg border text-[12px] transition",
          task.completed
            ? "border-transparent bg-[var(--color-stability)] text-[var(--color-bg)]"
            : "border-[var(--color-border)]",
        )}
        aria-label={task.completed ? "снять" : "отметить"}
      >
        {task.completed ? "✓" : ""}
      </button>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block truncate text-[13px]",
            task.completed && "text-[var(--color-muted)] line-through",
          )}
        >
          {task.snapshot.title}
        </span>
        <span className="block text-[11px] text-[var(--color-muted)]">
          {task.xp} XP
          {task.durationMs ? ` · заняло ${formatDuration(task.durationMs)}` : ""}
        </span>
      </span>
      <button
        onClick={onRemove}
        className="shrink-0 px-1 text-[12px] text-[var(--color-muted)] transition hover:text-[var(--color-strength)]"
        aria-label="удалить"
      >
        ✕
      </button>
    </div>
  );
}

function AddActionPicker({
  onPick,
}: {
  onPick: (a: Action, completed: boolean) => void;
}) {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return ACTION_POOL.slice(0, 12);
    return ACTION_POOL.filter((a) =>
      a.title.toLowerCase().includes(needle),
    ).slice(0, 20);
  }, [q]);

  return (
    <div className="mt-2 rounded-2xl surface p-3">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Найти действие"
        autoFocus
        className="mb-2 h-10 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-[13px] outline-none"
      />
      <div className="max-h-64 space-y-1 overflow-y-auto">
        {list.map((a) => (
          <div key={a.id} className="flex items-center gap-1.5">
            <span className="min-w-0 flex-1 truncate text-[12.5px]">
              {CATEGORIES[a.category].icon} {a.title}
            </span>
            <button
              onClick={() => onPick(a, false)}
              className="shrink-0 rounded-lg border border-[var(--color-border)] px-2 py-1 text-[11px]"
            >
              в план
            </button>
            <button
              onClick={() => onPick(a, true)}
              className="shrink-0 rounded-lg border border-[var(--color-border)] px-2 py-1 text-[11px] font-semibold"
            >
              выполнено
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────  Челленджи  ──────────────────────── */

function ChallengesTab() {
  const challenges = useUserStore((s) => s.challenges);
  const removeChallenge = useUserStore((s) => s.removeChallenge);
  const addChallenge = useUserStore((s) => s.addChallenge);

  const [title, setTitle] = useState("");
  const [unit, setUnit] = useState("раз");
  const [yellow, setYellow] = useState(5);
  const [green, setGreen] = useState(7);
  const [days, setDays] = useState(30);

  return (
    <>
      <div className="space-y-1.5">
        {challenges.map((c) => {
          const doneDays = Object.keys(c.log).filter(
            (d) => (c.log[d] ?? 0) >= c.green,
          ).length;
          return (
            <div
              key={c.id}
              className="press rounded-2xl surface p-3"
            >
              <div className="flex items-start gap-2">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold">
                    {c.title}
                  </span>
                  <span className="block text-[11px] text-[var(--color-muted)]">
                    жёлтый {c.yellow} · зелёный {c.green} {c.unit} · {c.days} дн
                    · с {c.startDate}
                  </span>
                  <span className="block text-[11px] text-[var(--color-muted)]">
                    зелёных дней: {doneDays}
                    {c.sets
                      ? ` · подходы ${c.sets.map((s) => s.reps).join("/")}`
                      : ""}
                  </span>
                </span>
                <button
                  onClick={() => removeChallenge(c.id)}
                  className="shrink-0 px-1 text-[12px] text-[var(--color-muted)] transition hover:text-[var(--color-strength)]"
                  aria-label="удалить челлендж"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="mb-2 mt-5 text-[12.5px] font-semibold text-[var(--color-fg-dim)]">
        Новый челлендж
      </h2>
      <div className="space-y-2 rounded-2xl surface p-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Название"
          className="h-10 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-[13px] outline-none"
        />
        <input
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="Единица (задач, отжиманий)"
          className="h-10 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-[13px] outline-none"
        />
        <div className="grid grid-cols-3 gap-2">
          <NumField label="жёлтый" value={yellow} onChange={setYellow} />
          <NumField label="зелёный" value={green} onChange={setGreen} />
          <NumField label="дней" value={days} onChange={setDays} />
        </div>
        <button
          disabled={!title.trim()}
          onClick={() => {
            addChallenge({
              title: title.trim(),
              unit: unit.trim() || "раз",
              stat: "stability",
              yellow,
              green: Math.max(green, yellow),
              days,
              startDate: dateKey(),
            });
            setTitle("");
          }}
          className="h-11 w-full rounded-2xl bg-[var(--color-fg)] text-[13.5px] font-semibold text-[var(--color-bg)] disabled:opacity-40"
        >
          Создать
        </button>
      </div>
    </>
  );
}

function NumField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10.5px] text-[var(--color-muted)]">
        {label}
      </span>
      <input
        type="number"
        min={1}
        value={value}
        onChange={(e) => onChange(Math.max(1, Number(e.target.value) || 1))}
        className="h-10 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 text-[13px] tabular-nums outline-none"
      />
    </label>
  );
}
