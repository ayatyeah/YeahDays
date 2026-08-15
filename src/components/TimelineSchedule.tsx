"use client";

import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import {
  useUserStore,
  isTodoOnDay,
  isTodoDone,
  PRIORITY_COLOR,
  PRIORITY_LABEL,
  type Todo,
  type TodoPriority,
} from "@/store/useUserStore";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { dateKey } from "@/lib/domain";
import { routineLabelAt } from "@/lib/routine";
import { cn } from "@/lib/cn";

/** Часы, которые показываем по умолчанию (сон не расписываем). */
const DEFAULT_FROM = 6;
const DEFAULT_TO = 23;
/** px на час — задаёт и высоту строки, и масштаб длительности задачи. */
const ROW_HEIGHT = 56;
const MIN_BLOCK_HEIGHT = 30;
const PRIORITY_ORDER: TodoPriority[] = ["low", "normal", "high"];
const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120, 180];
const ALL_HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTE_OPTIONS = [0, 10, 20, 30, 40, 50];

function fmtDuration(mins: number): string {
  if (mins < 60) return `${mins}м`;
  if (mins % 60 === 0) return `${mins / 60}ч`;
  return `${Math.floor(mins / 60)}ч${mins % 60}м`;
}

/**
 * Почасовой план дня — стеклянные плашки задач поверх сетки часов.
 *
 * Дизайн-язык (тонированное стекло, «остров» текущего времени, свайп
 * вправо/влево — выполнено) взят из макета hourly-planner-liquid-glass.html
 * и адаптирован под тёмную тему сайта (макет был светлым — тот же приём
 * "матовое стекло поверх фона", что и в iOS Dark Mode, просто на тёмной
 * подложке вместо светлой).
 *
 * compact (сайдбар "Сегодня") — только сетка часов, без лотков/FAB/шторки:
 * там уже есть TodoList для не-почасовых задач, дублировать некуда.
 * !compact (Календарь) — полная версия: просроченное и нераспланированное
 * вынесены в лотки сверху, "остров" показывает "сейчас/далее", FAB и
 * шторка — единый способ завести/отредактировать задачу.
 */
export default function TimelineSchedule({
  day = dateKey(),
  compact = false,
}: {
  day?: string;
  compact?: boolean;
}) {
  const todos = useUserStore((s) => s.todos);
  const addTodo = useUserStore((s) => s.addTodo);
  const updateTodo = useUserStore((s) => s.updateTodo);
  const removeTodo = useUserStore((s) => s.removeTodo);
  const toggleTodo = useUserStore((s) => s.toggleTodo);

  const [expanded, setExpanded] = useState(!compact);
  const [showNight, setShowNight] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  /**
   * onTap у framer-motion срабатывает по ВРЕМЕНИ между нажатием и отпусканием,
   * а не по пройденному расстоянию — быстрый перенос задачи на другой час
   * укладывается в это окно, и onTap стреляет ВМЕСТЕ с onDragEnd. Без этого
   * флага перетаскивание тут же открывало шторку редактирования сразу после
   * переноса — человек ничего не касался, а карточка "Задача" уже открыта.
   */
  const justDraggedRef = useRef(false);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fTitle, setFTitle] = useState("");
  const [fPriority, setFPriority] = useState<TodoPriority>("normal");
  const [fHour, setFHour] = useState<number | undefined>(undefined);
  const [fMinute, setFMinute] = useState(0);
  const [fDuration, setFDuration] = useState(60);
  const [fDone, setFDone] = useState(false);

  const hours = useMemo(() => {
    if (showNight) return ALL_HOURS;
    return Array.from(
      { length: DEFAULT_TO - DEFAULT_FROM + 1 },
      (_, i) => i + DEFAULT_FROM,
    );
  }, [showNight]);
  const startHour = hours[0] ?? 0;
  const endHour = hours[hours.length - 1] ?? 23;

  const todayKey = dateKey();
  const isToday = day === todayKey;
  const nowHour = new Date().getHours();
  const weekday = useMemo(() => new Date(`${day}T00:00:00`).getDay(), [day]);

  const onDay = useMemo(() => todos.filter((t) => isTodoOnDay(t, day)), [todos, day]);

  const scheduled = useMemo(
    () => onDay.filter((t) => t.hour != null && t.hour >= startHour && t.hour <= endHour),
    [onDay, startHour, endHour],
  );
  /** Час прошёл сегодня, а дело не закрыто — не теряется в сетке, а всплывает наверх. */
  const overdue = useMemo(
    () =>
      isToday
        ? onDay.filter((t) => t.hour != null && t.hour < nowHour && !isTodoDone(t, day))
        : [],
    [onDay, isToday, nowHour, day],
  );
  const overdueIds = useMemo(() => new Set(overdue.map((t) => t.id)), [overdue]);
  const unscheduled = useMemo(
    () => onDay.filter((t) => t.hour == null && !overdueIds.has(t.id)),
    [onDay, overdueIds],
  );

  /** Группировка по часу — задачи в одно время встают бок о бок, не наложением. */
  const byHour = useMemo(() => {
    const map = new Map<number, Todo[]>();
    for (const t of scheduled) {
      if (overdueIds.has(t.id)) continue;
      const h = t.hour!;
      const list = map.get(h) ?? [];
      list.push(t);
      map.set(h, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => (a.minute ?? 0) - (b.minute ?? 0));
    }
    return map;
  }, [scheduled, overdueIds]);

  const filled = scheduled.length - overdue.length;

  const ongoing = isToday
    ? scheduled.find((t) => t.hour === nowHour && !isTodoDone(t, day) && !overdueIds.has(t.id))
    : undefined;
  const upcoming = isToday
    ? scheduled
        .filter((t) => t.hour! > nowHour && !isTodoDone(t, day))
        .sort((a, b) => a.hour! - b.hour!)[0]
    : undefined;

  function cyclePriority(t: Todo) {
    const next =
      PRIORITY_ORDER[(PRIORITY_ORDER.indexOf(t.priority) + 1) % PRIORITY_ORDER.length]!;
    updateTodo(t.id, { priority: next });
  }

  function handleDragEnd(t: Todo, offset: { x: number; y: number }) {
    // Горизонтально дальше, чем вертикально — свайп "выполнено", не сдвиг часа.
    if (Math.abs(offset.x) > Math.abs(offset.y) && Math.abs(offset.x) > 56) {
      toggleTodo(t.id, day);
      return;
    }
    const deltaHours = Math.round(offset.y / ROW_HEIGHT);
    if (!deltaHours) return;
    const next = Math.min(endHour, Math.max(startHour, t.hour! + deltaHours));
    if (next !== t.hour) updateTodo(t.id, { hour: next });
  }

  /**
   * Перетаскивание задачи из лотка "Без часа" прямо на сетку часов —
   * альтернатива открытию шторки ради одного тапа на "Час". Лоток и сетка
   * не связаны родитель/потомок (лоток выше сетки, отдельный блок), поэтому
   * offset (дельта от старта) тут бесполезен — берём абсолютную точку
   * указателя (info.point, координаты вьюпорта) и сверяем с реальным
   * прямоугольником сетки, а не с тем, где чип начал путь.
   */
  function handleTrayDrop(t: Todo, info: PanInfo) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || info.point.y < rect.top || info.point.y > rect.bottom) return; // отпустили не над сеткой — чип просто вернётся на место
    const hour = startHour + Math.floor((info.point.y - rect.top) / ROW_HEIGHT);
    const clamped = Math.min(endHour, Math.max(startHour, hour));
    updateTodo(t.id, { hour: clamped, minute: 0 });
  }

  function openSheet(t: Todo | null, presetHour?: number) {
    setEditingId(t?.id ?? null);
    setFTitle(t?.title ?? "");
    setFPriority(t?.priority ?? "normal");
    setFHour(t ? t.hour : presetHour);
    setFMinute(t?.minute ?? 0);
    setFDuration(t?.duration ?? 60);
    setFDone(t ? isTodoDone(t, day) : false);
    setSheetOpen(true);
  }
  function closeSheet() {
    setSheetOpen(false);
  }
  function saveSheet() {
    const title = fTitle.trim();
    if (!title) return;
    const minute = fHour !== undefined ? fMinute : undefined;
    if (editingId) {
      updateTodo(editingId, { title, priority: fPriority, hour: fHour, minute, duration: fDuration });
      const wasDone = onDay.find((t) => t.id === editingId);
      if (wasDone && isTodoDone(wasDone, day) !== fDone) toggleTodo(editingId, day);
    } else {
      addTodo({ title, date: day, priority: fPriority, hour: fHour, minute, duration: fDuration });
    }
    closeSheet();
  }
  function deleteSheet() {
    if (editingId) removeTodo(editingId);
    closeSheet();
  }

  return (
    <section className="mt-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-[13px] font-semibold text-[var(--color-fg-dim)]">
          Расписание дня
        </h2>
        {compact && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-[12px] font-medium text-[var(--color-muted)] transition hover:text-[var(--color-fg)]"
          >
            {expanded ? "свернуть" : `${filled || "—"} записей`}
          </button>
        )}
      </div>

      {!compact && overdue.length > 0 && (
        <div className="mb-3">
          <p className="mb-1.5 flex items-center gap-1.5 text-[12px] font-semibold text-[var(--color-strength)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-strength)]" />
            Просрочено
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {overdue.map((t) => (
              <TrayChip key={t.id} todo={t} onClick={() => openSheet(t)} />
            ))}
          </div>
        </div>
      )}

      {!compact && (
        <div className="mb-3">
          <p className="mb-1.5 text-[12px] font-semibold text-[var(--color-fg-dim)]">Без часа</p>
          {unscheduled.length === 0 ? (
            <button
              onClick={() => openSheet(null)}
              className="w-full rounded-2xl border border-dashed border-[var(--color-border)] px-4 py-3 text-left text-[12.5px] text-[var(--color-muted)] transition hover:text-[var(--color-fg-dim)]"
            >
              Добавь задачу — время можно назначить позже
            </button>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none", overflowY: "visible" }}>
              {unscheduled.map((t) => (
                <TrayChip
                  key={t.id}
                  todo={t}
                  onClick={() => openSheet(t)}
                  onDragEnd={(info) => handleTrayDrop(t, info)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {expanded && (
        <div
          className="glass-panel relative overflow-hidden rounded-3xl"
          // compact (виджет на "Сегодня") — сетка на все 24 часа без этого
          // ограничения раскрывала бы страницу на лишнюю тысячу пикселей
          // при разворачивании; тот же приём, что и у полного календаря,
          // просто ниже потолок — здесь это второстепенный виджет, а не
          // основной экран.
          style={{ maxHeight: compact ? "min(50vh, 360px)" : "min(70vh, 640px)", overflowY: "auto" }}
        >
          {!compact && isToday && (
            <div className="sticky top-2 z-10 mb-1 flex justify-center px-2">
              <div className="now-island flex max-w-full items-center gap-2 rounded-full px-3.5 py-2 text-[12px] font-semibold text-white">
                <span className="shrink-0 rounded-full bg-white/15 px-2 py-1 font-mono text-[11.5px] tabular-nums">
                  {String(new Date().getHours()).padStart(2, "0")}:
                  {String(new Date().getMinutes()).padStart(2, "0")}
                </span>
                {ongoing ? (
                  <>
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: PRIORITY_COLOR[ongoing.priority] }}
                    />
                    <span className="truncate">Сейчас: {ongoing.title}</span>
                  </>
                ) : upcoming ? (
                  <>
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: PRIORITY_COLOR[upcoming.priority] }}
                    />
                    <span className="truncate">
                      Далее в {String(upcoming.hour).padStart(2, "0")}:
                      {String(upcoming.minute ?? 0).padStart(2, "0")}: {upcoming.title}
                    </span>
                  </>
                ) : (
                  <span className="truncate opacity-70">Свободно до конца дня</span>
                )}
              </div>
            </div>
          )}

          <div className="flex">
            {/* Подписи часов — своя колонка, чтобы не мешать расчёту позиции плашек. */}
            <div className="w-14 shrink-0">
              {hours.map((h) => {
                const isNow = isToday && h === nowHour;
                return (
                  <div
                    key={h}
                    style={{ height: ROW_HEIGHT }}
                    className={cn(
                      "flex items-center justify-center border-b border-[var(--color-border)] text-[12px] tabular-nums last:border-b-0",
                      isNow ? "font-bold text-[var(--color-fg)]" : "text-[var(--color-muted)]",
                    )}
                  >
                    {String(h).padStart(2, "0")}:00
                  </div>
                );
              })}
            </div>

            {/* Сетка часов + плашки задач поверх (absolute, координаты — только относительно этого контейнера). */}
            <div ref={containerRef} className="relative min-w-0 flex-1">
              {hours.map((h) => {
                const isNow = isToday && h === nowHour;
                const routine = routineLabelAt(weekday, h);
                const hasBlocks = (byHour.get(h)?.length ?? 0) > 0;
                return (
                  <div
                    key={h}
                    style={{ height: ROW_HEIGHT }}
                    className={cn(
                      "border-b border-[var(--color-border)] px-2 last:border-b-0",
                      isNow && "bg-[var(--color-surface-2)]",
                    )}
                  >
                    {!hasBlocks && (
                      <button
                        type="button"
                        onClick={() => (compact ? openSheet(null, h) : openSheet(null, h))}
                        className="flex h-full w-full items-center text-left text-[13px] text-[var(--color-muted)] transition hover:text-[var(--color-fg-dim)]"
                      >
                        {routine ?? "Добавить задачу"}
                      </button>
                    )}
                  </div>
                );
              })}

              {Array.from(byHour.entries()).flatMap(([h, list]) =>
                list.map((t, i) => {
                  const top =
                    (h - startHour) * ROW_HEIGHT + ((t.minute ?? 0) / 60) * ROW_HEIGHT + 2;
                  const height = Math.max(
                    MIN_BLOCK_HEIGHT,
                    ((t.duration ?? 60) / 60) * ROW_HEIGHT - 4,
                  );
                  const widthPct = 100 / list.length;
                  const done = isTodoDone(t, day);
                  return (
                    <motion.div
                      key={t.id}
                      drag
                      dragConstraints={containerRef}
                      dragElastic={0.1}
                      dragMomentum={false}
                      dragSnapToOrigin
                      onDragStart={() => {
                        justDraggedRef.current = true;
                      }}
                      onDragEnd={(_, info) => {
                        handleDragEnd(t, info.offset);
                        // сбрасываем на следующий кадр — framer успевает
                        // выстрелить onTap сразу вслед за onDragEnd
                        requestAnimationFrame(() => {
                          justDraggedRef.current = false;
                        });
                      }}
                      onTap={() => {
                        if (justDraggedRef.current) return;
                        openSheet(t);
                      }}
                      layout
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      className="glass-chip group absolute cursor-grab overflow-hidden rounded-xl px-2 py-1 active:cursor-grabbing"
                      style={{
                        top,
                        height,
                        left: `calc(${i * widthPct}% + ${i > 0 ? 3 : 0}px)`,
                        width: `calc(${widthPct}% - 3px)`,
                        // @ts-expect-error -- кастомное свойство для CSS ниже
                        "--chip-color": PRIORITY_COLOR[t.priority],
                      }}
                    >
                      <div className="flex h-full items-start gap-1.5">
                        <button
                          type="button"
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            cyclePriority(t);
                          }}
                          className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                          style={{ background: PRIORITY_COLOR[t.priority] }}
                          aria-label="Сменить приоритет"
                        />
                        <span
                          className={cn(
                            "min-w-0 flex-1 truncate text-left text-[12px] font-medium leading-tight",
                            done && "text-[var(--color-muted)] line-through",
                          )}
                        >
                          {t.title}
                        </span>
                        <button
                          type="button"
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeTodo(t.id);
                          }}
                          className="shrink-0 text-[11px] text-[var(--color-muted)] opacity-0 transition hover:text-[var(--color-strength)] group-hover:opacity-100"
                          aria-label="Удалить задачу"
                        >
                          ✕
                        </button>
                      </div>
                    </motion.div>
                  );
                }),
              )}
            </div>
          </div>
        </div>
      )}

      {expanded && (
        <button
          onClick={() => setShowNight((v) => !v)}
          className="mt-2 w-full text-center text-[11.5px] text-[var(--color-muted)] transition hover:text-[var(--color-fg-dim)]"
        >
          {showNight ? "скрыть ночные часы" : "показать все 24 часа"}
        </button>
      )}

      {!compact && (
        <button
          onClick={() => openSheet(null)}
          aria-label="Добавить задачу"
          className="press fixed bottom-[calc(6rem+var(--install-offset,0px))] right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full text-[26px] font-semibold text-white shadow-[0_10px_24px_-4px_rgba(0,0,0,0.5)] lg:bottom-8"
          style={{ background: "linear-gradient(155deg, var(--color-intelligence), color-mix(in srgb, var(--color-intelligence) 70%, black))" }}
        >
          +
        </button>
      )}

      <Modal open={sheetOpen} onClose={closeSheet} title={editingId ? "Задача" : "Новая задача"}>
        <div className="space-y-4">
          <input
            value={fTitle}
            onChange={(e) => setFTitle(e.target.value)}
            placeholder="Например: созвон с командой"
            maxLength={80}
            autoFocus
            className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 text-[15px] outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-fg-dim)]"
          />

          <div>
            <SheetLabel>Важность</SheetLabel>
            <div className="grid grid-cols-3 gap-1.5">
              {PRIORITY_ORDER.map((p) => (
                <button
                  key={p}
                  onClick={() => setFPriority(p)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border py-2.5 text-[12px] font-semibold transition",
                    fPriority === p
                      ? "border-[var(--color-fg)] bg-[var(--color-surface-2)]"
                      : "border-[var(--color-border)] text-[var(--color-muted)]",
                  )}
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ background: PRIORITY_COLOR[p] }}
                  />
                  {PRIORITY_LABEL[p]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <SheetLabel>Час</SheetLabel>
            <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              <button
                onClick={() => setFHour(undefined)}
                className={cn(
                  "shrink-0 rounded-xl border px-3.5 py-2.5 text-[12.5px] font-semibold transition",
                  fHour === undefined
                    ? "border-[var(--color-fg)] bg-[var(--color-surface-2)]"
                    : "border-[var(--color-border)] text-[var(--color-muted)]",
                )}
              >
                Без часа
              </button>
              {ALL_HOURS.map((h) => (
                <button
                  key={h}
                  onClick={() => setFHour(h)}
                  className={cn(
                    "shrink-0 rounded-xl border px-3.5 py-2.5 text-[12.5px] font-semibold tabular-nums transition",
                    fHour === h
                      ? "border-[var(--color-fg)] bg-[var(--color-surface-2)]"
                      : "border-[var(--color-border)] text-[var(--color-muted)]",
                  )}
                >
                  {String(h).padStart(2, "0")}:00
                </button>
              ))}
            </div>
          </div>

          {fHour !== undefined && (
            <div>
              <SheetLabel>Минуты</SheetLabel>
              <div className="grid grid-cols-6 gap-1.5">
                {MINUTE_OPTIONS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setFMinute(m)}
                    className={cn(
                      "rounded-xl border py-2.5 text-[12.5px] font-semibold tabular-nums transition",
                      fMinute === m
                        ? "border-[var(--color-fg)] bg-[var(--color-surface-2)]"
                        : "border-[var(--color-border)] text-[var(--color-muted)]",
                    )}
                  >
                    :{String(m).padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <SheetLabel>Длительность</SheetLabel>
            <div className="grid grid-cols-4 gap-1.5">
              {DURATION_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setFDuration(d)}
                  className={cn(
                    "rounded-xl border py-2 text-[12px] font-semibold tabular-nums transition",
                    fDuration === d
                      ? "border-[var(--color-fg)] bg-[var(--color-surface-2)]"
                      : "border-[var(--color-border)] text-[var(--color-muted)]",
                  )}
                >
                  {fmtDuration(d)}
                </button>
              ))}
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={fDone}
              onChange={(e) => setFDone(e.target.checked)}
              className="h-4 w-4 rounded accent-[var(--color-fg)]"
            />
            <span className="text-[13px] text-[var(--color-fg-dim)]">Выполнено</span>
          </label>

          <div className="flex gap-2.5 pt-1">
            {editingId && (
              <Button variant="danger" onClick={deleteSheet}>
                Удалить
              </Button>
            )}
            <Button className="flex-1" onClick={closeSheet}>
              Отмена
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              disabled={!fTitle.trim()}
              onClick={saveSheet}
            >
              Сохранить
            </Button>
          </div>
        </div>
      </Modal>

      <style jsx>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.035);
          backdrop-filter: blur(20px) saturate(140%);
          -webkit-backdrop-filter: blur(20px) saturate(140%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.06),
            0 20px 44px -28px rgba(0, 0, 0, 0.7);
        }
        .now-island {
          background: rgba(10, 10, 14, 0.72);
          backdrop-filter: blur(18px) saturate(150%);
          -webkit-backdrop-filter: blur(18px) saturate(150%);
          box-shadow:
            0 8px 24px -8px rgba(0, 0, 0, 0.5),
            inset 0 1px 1px rgba(255, 255, 255, 0.12);
        }
        /* :global — styled-jsx только помечает свои JSX-теги скоуп-классом
           автоматически, а на motion.div (member-expression тег, не обычный
           div) эта разметка не срабатывает. Без :global правило молча не
           матчится вообще: ни фона, ни рамки, ни тени — просто голый текст
           поверх сетки. */
        :global(.glass-chip) {
          background: color-mix(in srgb, var(--chip-color) 16%, var(--color-surface));
          border: 1px solid color-mix(in srgb, var(--chip-color) 45%, transparent);
          background-image: linear-gradient(
            165deg,
            color-mix(in srgb, var(--chip-color) 10%, white) 0%,
            transparent 40%
          );
          transition:
            box-shadow 0.15s,
            transform 0.15s;
        }
        :global(.glass-chip:active) {
          box-shadow: 0 6px 16px -6px color-mix(in srgb, var(--chip-color) 60%, transparent);
        }
      `}</style>
    </section>
  );
}

function TrayChip({
  todo,
  onClick,
  onDragEnd,
}: {
  todo: Todo;
  onClick: () => void;
  /** Если задан — чип можно утащить (обычно на сетку часов), см. handleTrayDrop. */
  onDragEnd?: (info: PanInfo) => void;
}) {
  // onTap у framer-motion срабатывает по времени нажатия, а не по
  // расстоянию — быстрый перенос чипа на сетку укладывается в то же окно и
  // onTap стреляет вслед за onDragEnd, тут же открывая шторку редактирования
  // сразу после переноса (см. тот же флаг на карточках в сетке выше).
  const justDraggedRef = useRef(false);
  return (
    <motion.button
      onTap={() => {
        if (justDraggedRef.current) return;
        onClick();
      }}
      drag={!!onDragEnd}
      dragSnapToOrigin
      dragElastic={0.15}
      dragMomentum={false}
      whileDrag={{ scale: 1.06, zIndex: 40 }}
      onDragStart={() => {
        justDraggedRef.current = true;
      }}
      onDragEnd={(_, info) => {
        onDragEnd?.(info);
        requestAnimationFrame(() => {
          justDraggedRef.current = false;
        });
      }}
      className="glass-chip relative flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-[12.5px] font-medium active:cursor-grabbing"
      style={{
        // @ts-expect-error -- кастомное свойство для CSS в родителе
        "--chip-color": PRIORITY_COLOR[todo.priority],
        cursor: onDragEnd ? "grab" : "pointer",
      }}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: PRIORITY_COLOR[todo.priority] }} />
      <span className="max-w-[140px] truncate">{todo.title}</span>
    </motion.button>
  );
}

function SheetLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[12px] font-semibold text-[var(--color-fg-dim)]">{children}</p>
  );
}
