"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlanItem from "@/components/PlanItem";
import TimelineSchedule from "@/components/TimelineSchedule";
import Modal from "@/components/ui/Modal";
import {
  useUserStore,
  useHydrated,
  useStreak,
  useBestStreak,
  dayLevel,
} from "@/store/useUserStore";
import { dateKey } from "@/lib/domain";
import { cn } from "@/lib/cn";

const MONTHS = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];
const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const WEEKDAY_LONG = [
  "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье",
];

function keyOf(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** Сдвиг дня на N суток — сам разбирает и снова собирает YYYY-MM-DD, без библиотек дат. */
function shiftDay(key: string, delta: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y!, m! - 1, d! + delta);
  return dateKey(dt);
}

function dayLabel(key: string, todayKey: string): string {
  if (key === todayKey) return "Сегодня";
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y!, m! - 1, d!);
  const dow = WEEKDAY_LONG[(dt.getDay() + 6) % 7];
  return `${d} ${MONTHS[m! - 1]!.toLowerCase()}, ${dow!.toLowerCase()}`;
}

/**
 * Раньше главным был месячный грид, а почасовой план — маленьким блоком
 * снизу. Перевернули: день с плашками по часам — то, чем реально
 * пользуются каждый день, он и должен быть первым, что видно. Месячная
 * сетка (цвета дней, стрик по календарю, список дел прошлого дня) —
 * не то, что открывают каждый раз, поэтому теперь за отдельной кнопкой.
 */
export default function CalendarSection() {
  const hydrated = useHydrated();
  const plan = useUserStore((s) => s.plan);
  const challenges = useUserStore((s) => s.challenges);
  const toggleTask = useUserStore((s) => s.toggleTask);
  const removeTask = useUserStore((s) => s.removeTask);

  const today = new Date();
  const todayKey = dateKey(today);

  const [selected, setSelected] = useState(todayKey);
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [monthOpen, setMonthOpen] = useState(false);

  const streak = useStreak();
  const best = useBestStreak();

  /** date → {taken, done} */
  const byDate = useMemo(() => {
    const map = new Map<string, { taken: number; done: number }>();
    for (const t of plan) {
      const e = map.get(t.date) ?? { taken: 0, done: 0 };
      e.taken++;
      if (t.completed) e.done++;
      map.set(t.date, e);
    }
    return map;
  }, [plan]);

  const selectedTasks = useMemo(
    () => plan.filter((t) => t.date === selected),
    [plan, selected],
  );

  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const startDow = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    const arr: (number | null)[] = [];
    for (let i = 0; i < startDow; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [view]);

  function shiftMonth(delta: number) {
    setView((v) => {
      const m = v.m + delta;
      return { y: v.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 };
    });
  }

  function openMonth() {
    const [y, m] = selected.split("-").map(Number);
    setView({ y: y!, m: m! - 1 });
    setMonthOpen(true);
  }

  /** Одна ячейка дня в месячной сетке — общая и для мобильной модалки, и для десктоп-панели справа, чтобы не дублировать разметку и логику цвета/точки. */
  function renderDayCell(d: number | null, i: number) {
    if (d === null) return <div key={i} />;
    const k = keyOf(view.y, view.m, d);
    const e = byDate.get(k);
    const isToday = k === todayKey;
    const isSel = k === selected;
    const full = e && e.done > 0 && e.done === e.taken;
    const partial = e && e.done > 0 && e.done < e.taken;
    // уровень дня по челленджам: зелёный — все нормы взяты,
    // жёлтый — взята хотя бы минимальная планка
    const level = dayLevel(challenges, k);

    return (
      <button
        key={i}
        onClick={() => setSelected(k)}
        className={cn(
          // active:scale вместо framer-motion: 42 ячейки × подписка
          // на motion-значения заметно тормозили открытие календаря
          "relative flex aspect-square flex-col items-center justify-center rounded-2xl border text-[14px] transition-transform duration-100 active:scale-[0.92]",
          isSel
            ? "border-[var(--color-fg)] bg-[var(--color-surface-2)]"
            : "border-transparent hover:bg-[var(--color-surface)]",
          isToday && !isSel && "text-[var(--color-stability)]",
        )}
        style={
          !isSel && (level !== "none" || full)
            ? {
                background: `color-mix(in srgb, ${
                  level === "green"
                    ? "var(--color-stability)"
                    : level === "yellow"
                      ? "var(--color-wealth)"
                      : "var(--color-stability)"
                } ${level === "none" ? 14 : 24}%, transparent)`,
              }
            : undefined
        }
      >
        <span className={cn(isSel && "font-bold")}>{d}</span>
        {e && (
          <span className="absolute bottom-1.5 flex gap-0.5">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: full
                  ? "var(--color-stability)"
                  : partial
                    ? "var(--color-wealth)"
                    : "var(--color-border)",
              }}
            />
          </span>
        )}
      </button>
    );
  }

  if (!hydrated) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-fg)]" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="mb-4 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="truncate text-[22px] font-bold tracking-tight">
            {dayLabel(selected, todayKey)}
          </h1>
          <p className="mt-0.5 text-[13px] text-[var(--color-muted)]">
            🔥 {streak} подряд · рекорд {best}
          </p>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <NavBtn onClick={() => setSelected((k) => shiftDay(k, -1))}>‹</NavBtn>
          {selected !== todayKey && (
            <button
              onClick={() => setSelected(todayKey)}
              className="press flex h-9 items-center rounded-xl surface px-3 text-[13.5px] font-medium text-[var(--color-fg-dim)]"
            >
              Сегодня
            </button>
          )}
          <NavBtn onClick={() => setSelected((k) => shiftDay(k, 1))}>›</NavBtn>
          {/* Спец-кнопка — вход в месячный вид через модалку. На lg:+ месяц
              уже виден постоянно в правой колонке, кнопка там не нужна. */}
          <button
            onClick={openMonth}
            aria-label="Посмотреть месяц"
            className="press flex h-9 w-9 items-center justify-center rounded-xl surface text-[15px] lg:hidden"
          >
            🗓️
          </button>
        </div>
      </header>

      {/*
        lg:+: почасовой план дня слева (основное), постоянно видимый месяц
        справа — на мобильном тот же месяц прячется за кнопкой 🗓️ в
        модалке (см. выше), тут смысла его дублировать нет — узкий экран,
        а план дня и так требует прокрутки.
      */}
      <div className="lg:flex lg:items-start lg:gap-6">
        {/* lg:min-w-0 обязателен. У флекс-элемента min-width по умолчанию
            auto — колонка отказывается сжиматься уже своего содержимого, а
            содержимое тут широкое (лента «Просрочено» из чипов shrink-0).
            Без этого расписание распирало строку, месяц справа уезжал за
            границу и обрезался родителем с overflow: hidden — при том, что
            страница формально никуда не переполнялась. */}
        <div className="lg:min-w-0 lg:flex-1">
          {/* Почасовой план дня — теперь главное содержимое раздела, не блок
              внизу. key={selected} — чистый локальный стейт (свёрнуто/ночные
              часы) при переключении дня, а не протечка с прошлого. */}
          <TimelineSchedule key={selected} day={selected} />
        </div>

        <div className="mt-5 hidden lg:mt-0 lg:block lg:w-[320px] lg:shrink-0">
          <section className="rounded-3xl surface p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[15px] font-semibold">
                {MONTHS[view.m]} <span className="text-[var(--color-muted)]">{view.y}</span>
              </p>
              <div className="flex gap-1.5">
                <NavBtn onClick={() => shiftMonth(-1)}>‹</NavBtn>
                <NavBtn onClick={() => shiftMonth(1)}>›</NavBtn>
              </div>
            </div>

            <div className="mb-1.5 grid grid-cols-7 gap-1 text-center text-[12px] text-[var(--color-muted)]">
              {WEEKDAYS.map((w) => (
                <div key={w}>{w}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">{cells.map((d, i) => renderDayCell(d, i))}</div>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[12px] text-[var(--color-muted)]">
              <Legend color="var(--color-stability)" label="день закрыт" />
              <Legend color="var(--color-wealth)" label="частично" />
              <Legend color="var(--color-border)" label="не начат" />
            </div>
          </section>

          <section className="mt-5 rounded-3xl surface p-4 text-center">
            <p className="text-[12px] uppercase tracking-wider text-[var(--color-muted)]">Стрик</p>
            <p className="mt-1 text-3xl font-black leading-none tabular-nums">🔥 {streak}</p>
            <p className="mt-1.5 text-[12px] text-[var(--color-muted)]">
              Рекорд: {best} {best === 1 ? "день" : "дн."}
            </p>
          </section>
        </div>
      </div>

      <Modal open={monthOpen} onClose={() => setMonthOpen(false)} title="Как идёт месяц">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[15px] font-semibold">
            {MONTHS[view.m]} <span className="text-[var(--color-muted)]">{view.y}</span>
          </p>
          <div className="flex gap-1.5">
            <NavBtn onClick={() => shiftMonth(-1)}>‹</NavBtn>
            <NavBtn onClick={() => shiftMonth(1)}>›</NavBtn>
          </div>
        </div>

        <div className="mb-1.5 grid grid-cols-7 gap-1 text-center text-[12px] text-[var(--color-muted)]">
          {WEEKDAYS.map((w) => (
            <div key={w}>{w}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">{cells.map((d, i) => renderDayCell(d, i))}</div>

        <div className="mt-3 flex items-center justify-center gap-4 text-[12px] text-[var(--color-muted)]">
          <Legend color="var(--color-stability)" label="день закрыт" />
          <Legend color="var(--color-wealth)" label="частично" />
          <Legend color="var(--color-border)" label="не начат" />
        </div>

        <section className="mt-5">
          <h2 className="mb-2.5 text-[14px] font-semibold text-[var(--color-fg-dim)]">
            {selected === todayKey ? "Сегодня" : selected}
          </h2>

          {selectedTasks.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-[var(--color-border)] px-4 py-7 text-center text-[14px] text-[var(--color-muted)]">
              В этот день действий не было.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              <AnimatePresence initial={false}>
                {selectedTasks.map((t) => (
                  <PlanItem
                    key={t.id}
                    task={t}
                    onToggle={toggleTask}
                    onRemove={removeTask}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </Modal>
    </div>
  );
}

function NavBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-xl surface text-lg text-[var(--color-fg-dim)]"
    >
      {children}
    </motion.button>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
