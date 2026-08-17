"use client";

import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import {
  useUserStore,
  isTodoOnDay,
  isTodoDone,
  selectActiveDays,
  PRIORITY_COLOR,
  PRIORITY_LABEL,
  TODO_PRIORITY_XP,
  type Todo,
  type TodoPriority,
} from "@/store/useUserStore";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { dateKey, STATS } from "@/lib/domain";
import { routineLabelAt } from "@/lib/routine";
import { categorizeTodo, fmtDuration } from "@/lib/todoCategory";
import { cn } from "@/lib/cn";

/** Часы, которые показываем по умолчанию (сон не расписываем). */
const DEFAULT_FROM = 6;
const DEFAULT_TO = 23;
/** px на час — минимальная высота пустой строки сетки. */
const ROW_HEIGHT = 76;
const PRIORITY_ORDER: TodoPriority[] = ["low", "normal", "high"];
const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120, 180];
const ALL_HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTE_OPTIONS = [0, 10, 20, 30, 40, 50];

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
  const plan = useUserStore((s) => s.plan);
  const addTodo = useUserStore((s) => s.addTodo);
  const updateTodo = useUserStore((s) => s.updateTodo);
  const removeTodo = useUserStore((s) => s.removeTodo);
  const toggleTodo = useUserStore((s) => s.toggleTodo);

  const [expanded, setExpanded] = useState(!compact);
  const [showNight, setShowNight] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [sheetOpen, setSheetOpen] = useState(false);
  /** view — экран просмотра (тап по карточке); edit — знакомая форма («Изменить» в шапке). */
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fTitle, setFTitle] = useState("");
  const [fNote, setFNote] = useState("");
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

  /**
   * Раскладка по часу задачи, без попытки визуализировать пересечения по
   * времени колонками. Было три захода на "честном" пересечении (абсолютные
   * пиксели → кластеры + колонки), и каждый ломался заново: пиксельная
   * математика не помещала короткие задачи впритык друг к другу в читаемую
   * высоту, а кластеризация по реальному overlap корректно, но неюзабельно
   * схлопывала 3+ карточки в один ряд поровну — когда перетащенная длинная
   * задача начинала "перекрывать" пару соседних, всё превращалось в ряд
   * нечитаемых иконок без подписей. Для личного ежедневника это не рабочий
   * стол диспетчера встреч: настоящее одновременное пересечение — почти
   * всегда случайность (перетащил не в тот час), а не сценарий, который
   * стоит поддерживать колонками. Теперь просто: у каждой задачи есть свой
   * час — она стоит в его строке, друг под другом, всегда во всю ширину.
   * Наложиться в принципе не может (гарантия браузерного потока), а редкое
   * реальное двойное бронирование просто видно как две карточки подряд.
   */
  const hourRows = useMemo(() => {
    const visible = scheduled.filter((t) => !overdueIds.has(t.id));
    const sorted = [...visible].sort((a, b) => (a.minute ?? 0) - (b.minute ?? 0));
    const map = new Map<number, Todo[]>();
    for (const t of sorted) {
      const arr = map.get(t.hour!) ?? [];
      arr.push(t);
      map.set(t.hour!, arr);
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

  /**
   * Час назначения при вертикальном перетаскивании — по РЕАЛЬНОМУ DOM-
   * элементу под точкой отпускания (у него есть data-hour), а не по формуле
   * "пиксели / ROW_HEIGHT". Формула предполагала, что каждый час занимает
   * ровно ROW_HEIGHT — верно, только пока час пуст; строка с несколькими
   * задачами внутри выше, и формула на такой сетке промахивалась мимо
   * соседних часов (в т.ч. не давала попасть ровно на нужный час) и после
   * переноса выглядела как рандомный скачок. document.elementFromPoint
   * не ошибается, какая бы ни была высота строк.
   */
  function handleDragEnd(t: Todo, offset: { x: number; y: number }, targetHour: number | null) {
    // Горизонтально дальше, чем вертикально — свайп "выполнено", не сдвиг часа.
    if (Math.abs(offset.x) > Math.abs(offset.y) && Math.abs(offset.x) > 56) {
      toggleTodo(t.id, day);
      return;
    }
    if (targetHour == null || targetHour === t.hour) return;
    // minute: 0 — иначе задача с ненулевой минутой (скажем, 14:30) при
    // переносе на 15:00 садится на 15:30, её длительность реально наезжает
    // на соседние задачи по времени, и кластеризация (справедливо) начинает
    // считать их одновременными — несколько НЕ связанных с переносом задач
    // визуально сжимаются в один ряд. Перенос часом всегда даёт чистое :00,
    // точную минуту можно выставить потом через шторку.
    updateTodo(t.id, { hour: targetHour, minute: 0 });
  }

  /**
   * Перетаскивание задачи из лотка "Без часа" прямо на сетку часов —
   * альтернатива открытию шторки ради одного тапа на "Час". Тот же приём:
   * час берём из data-hour реального элемента под точкой отпускания.
   */
  function handleTrayDrop(t: Todo, info: PanInfo) {
    const hourEl = document
      .elementFromPoint(info.point.x, info.point.y)
      ?.closest<HTMLElement>("[data-hour]");
    if (!hourEl) return; // отпустили не над сеткой — чип просто вернётся на место
    const hour = Number(hourEl.dataset.hour);
    if (!Number.isFinite(hour)) return;
    updateTodo(t.id, { hour, minute: 0 });
  }

  function openSheet(t: Todo | null, presetHour?: number) {
    setEditingId(t?.id ?? null);
    setFTitle(t?.title ?? "");
    setFNote(t?.note ?? "");
    setFPriority(t?.priority ?? "normal");
    setFHour(t ? t.hour : presetHour);
    setFMinute(t?.minute ?? 0);
    setFDuration(t?.duration ?? 60);
    setFDone(t ? isTodoDone(t, day) : false);
    // Новую задачу смотреть нечего — сразу в форму. Существующую — сперва
    // экран просмотра, "Изменить" в шапке уводит в форму.
    setMode(t ? "view" : "edit");
    setSheetOpen(true);
  }
  function closeSheet() {
    setSheetOpen(false);
  }
  function saveSheet() {
    const title = fTitle.trim();
    if (!title) return;
    const note = fNote.trim() || undefined;
    const minute = fHour !== undefined ? fMinute : undefined;
    if (editingId) {
      updateTodo(editingId, { title, note, priority: fPriority, hour: fHour, minute, duration: fDuration });
      const wasDone = onDay.find((t) => t.id === editingId);
      if (wasDone && isTodoDone(wasDone, day) !== fDone) toggleTodo(editingId, day);
    } else {
      addTodo({ title, note, date: day, priority: fPriority, hour: fHour, minute, duration: fDuration });
    }
    closeSheet();
  }
  function deleteSheet() {
    if (editingId) removeTodo(editingId);
    closeSheet();
  }

  /* ── Экран просмотра: данные текущей задачи ── */
  const viewingTodo = useMemo(
    () => onDay.find((t) => t.id === editingId) ?? null,
    [onDay, editingId],
  );
  const viewCategory = viewingTodo ? categorizeTodo(viewingTodo.title) : null;
  const viewXp = viewingTodo ? TODO_PRIORITY_XP[viewingTodo.priority] : 0;
  /** Вес — тот же TODO_PRIORITY_XP, что уже определяет ценность задачи в
   *  системе: чем важнее задача, тем больше её доля в закрытии дня. */
  const dayWeightTotal = useMemo(
    () => onDay.reduce((sum, t) => sum + TODO_PRIORITY_XP[t.priority], 0),
    [onDay],
  );
  const viewPercent =
    viewingTodo && dayWeightTotal ? Math.round((viewXp / dayWeightTotal) * 100) : 0;
  const dayActive = useMemo(
    () => selectActiveDays(plan, todos).has(day),
    [plan, todos, day],
  );

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

          {/* Сетка часов: подпись + стопка задач в одной строке flex — задачи
              просто стоят друг под другом в потоке, без пиксельной математики
              и без риска наложения (см. комментарий у hourRows выше). */}
          <div ref={containerRef} className="flex flex-col">
            {hours.map((h) => {
              const isNow = isToday && h === nowHour;
              const routine = routineLabelAt(weekday, h);
              const rows = hourRows.get(h) ?? [];
              return (
                <div
                  key={h}
                  data-hour={h}
                  className={cn(
                    "flex border-b border-[var(--color-border)] last:border-b-0",
                    isNow && "bg-[var(--color-surface-2)]",
                  )}
                >
                  <div
                    style={{ minHeight: ROW_HEIGHT }}
                    className={cn(
                      "flex w-14 shrink-0 items-center justify-center text-[12px] tabular-nums",
                      isNow ? "font-bold text-[var(--color-fg)]" : "text-[var(--color-muted)]",
                    )}
                  >
                    {String(h).padStart(2, "0")}:00
                  </div>
                  <div
                    style={{ minHeight: ROW_HEIGHT }}
                    className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 px-2 py-2"
                  >
                    {rows.length === 0 ? (
                      <button
                        type="button"
                        onClick={() => openSheet(null, h)}
                        className="flex h-full w-full items-center text-left text-[13px] text-[var(--color-muted)] transition hover:text-[var(--color-fg-dim)]"
                      >
                        {routine ?? "Добавить задачу"}
                      </button>
                    ) : (
                      rows.map((t) => (
                        <TimelineChip
                          key={t.id}
                          todo={t}
                          done={isTodoDone(t, day)}
                          onToggleDone={() => toggleTodo(t.id, day)}
                          onOpen={() => openSheet(t)}
                          dragConstraints={containerRef}
                          onDragged={(offset, targetHour) => handleDragEnd(t, offset, targetHour)}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
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

      <Modal
        open={sheetOpen}
        onClose={closeSheet}
        title={mode === "edit" ? (editingId ? "Задача" : "Новая задача") : undefined}
        headerAction={
          mode === "view" && (
            <button
              type="button"
              onClick={() => setMode("edit")}
              className="press shrink-0 rounded-xl bg-[var(--color-surface-2)] px-3.5 py-2 text-[13px] font-semibold transition hover:bg-[var(--color-border)]"
            >
              Изменить
            </button>
          )
        }
      >
        {mode === "view" && viewingTodo && viewCategory ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[19px]"
                style={{
                  background: `color-mix(in srgb, ${STATS[viewCategory.stat].color} 18%, var(--color-surface-2) 90%)`,
                }}
                aria-hidden
              >
                {viewCategory.icon}
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <h3
                  className={cn(
                    "text-[17px] font-bold leading-tight",
                    isTodoDone(viewingTodo, day) && "text-[var(--color-muted)] line-through",
                  )}
                >
                  {viewingTodo.title}
                </h3>
                <p
                  className="mt-0.5 text-[11px] font-bold uppercase tracking-wide"
                  style={{ color: STATS[viewCategory.stat].color }}
                >
                  {STATS[viewCategory.stat].label}
                  {viewCategory.subLabel ? ` · ${viewCategory.subLabel}` : ""}
                </p>
              </div>
            </div>

            {viewingTodo.note && (
              <p className="rounded-2xl bg-[var(--color-surface-2)] px-4 py-3 text-[13.5px] leading-snug text-[var(--color-fg-dim)]">
                {viewingTodo.note}
              </p>
            )}

            <div className="grid grid-cols-3 gap-2">
              <ViewMeta
                label="Час"
                value={
                  viewingTodo.hour != null
                    ? `${String(viewingTodo.hour).padStart(2, "0")}:${String(viewingTodo.minute ?? 0).padStart(2, "0")}`
                    : "—"
                }
              />
              <ViewMeta label="Длительность" value={fmtDuration(viewingTodo.duration ?? 60)} />
              <ViewMeta label="Важность" value={PRIORITY_LABEL[viewingTodo.priority]} />
            </div>

            <div
              className="flex items-center gap-3 rounded-2xl px-4 py-3.5"
              style={{
                background: `color-mix(in srgb, ${STATS[viewCategory.stat].color} 12%, var(--color-surface-2) 92%)`,
              }}
            >
              <span className="text-[22px]" aria-hidden>
                {STATS[viewCategory.stat].icon}
              </span>
              <div>
                <p className="text-[15px] font-bold" style={{ color: STATS[viewCategory.stat].color }}>
                  +{viewXp} XP
                </p>
                <p className="text-[12px] text-[var(--color-fg-dim)]">
                  в {STATS[viewCategory.stat].label.toLowerCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-2xl bg-[var(--color-surface-2)] px-4 py-3">
              <span className="text-[16px]" aria-hidden>
                🔥
              </span>
              <p className="text-[12.5px] font-medium text-[var(--color-fg-dim)]">
                {dayActive ? "Этот день уже в серии" : "Выполнение закроет этот день в серию"}
              </p>
            </div>

            <div>
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className="text-[12px] font-semibold text-[var(--color-fg-dim)]">
                  Покрытие дня
                </span>
                <span className="text-[12px] font-bold tabular-nums">{viewPercent}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${viewPercent}%`, background: STATS[viewCategory.stat].color }}
                />
              </div>
              <p className="mt-1.5 text-[11px] leading-snug text-[var(--color-muted)]">
                Чем важнее задача, тем больше её вклад в закрытие дня.
              </p>
            </div>

            <Button
              variant={isTodoDone(viewingTodo, day) ? "surface" : "primary"}
              className="w-full"
              onClick={() => toggleTodo(viewingTodo.id, day)}
            >
              {isTodoDone(viewingTodo, day) ? "Снять отметку" : "Отметить выполненным"}
            </Button>
          </div>
        ) : (
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
            <SheetLabel>Заметка (необязательно)</SheetLabel>
            <textarea
              value={fNote}
              onChange={(e) => setFNote(e.target.value)}
              placeholder="Подробности, которые не влезли в название"
              maxLength={1000}
              rows={3}
              className="w-full resize-none rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-[14px] leading-snug outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-fg-dim)]"
            />
          </div>

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
        )}
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
        /*
         * Раньше плашка заливалась цветом приоритета целиком — на плотном
         * плане, где почти все задачи "normal", это давало один и тот же
         * блёклый оттенок сплошь по всему расписанию: цвет переставал
         * что-либо различать. Теперь фон нейтральный (та же поверхность,
         * что у карточек по всему приложению), а цвет приоритета остаётся
         * только в точке и тонкой рамке — акцент вместо заливки, и высокий
         * приоритет реально выделяется на фоне остальных, а не тонет в них.
         */
        :global(.glass-chip) {
          background: var(--color-surface);
          border: 1px solid color-mix(in srgb, var(--chip-color) 42%, var(--color-border-strong) 62%);
          box-shadow: var(--shadow-1);
          transition:
            box-shadow 0.15s,
            border-color 0.15s,
            transform 0.15s;
        }
        :global(.glass-chip:hover) {
          border-color: color-mix(in srgb, var(--chip-color) 62%, var(--color-border-strong) 38%);
        }
        :global(.glass-chip:active) {
          box-shadow: 0 6px 16px -6px color-mix(in srgb, var(--chip-color) 55%, transparent);
        }
      `}</style>
    </section>
  );
}

/**
 * Карточка задачи в сетке часов: цветной бейдж-иконка по угаданной
 * категории, заголовок + подпись стата, чекбокс выполнения. Приоритет
 * (тап по карточке → шторка) тут больше не редактируется в один тап —
 * бейдж занят категорией, а быстрый свайп/чекбокс делают более частое
 * действие (отметить сделанным) доступным без открытия шторки вообще.
 * На всю ширину строки — не пилюля впритык к тексту: с бейджем и
 * подписью карточка перестаёт быть "пустым прямоугольником", контент
 * уже заполняет доступное место сам.
 */
function TimelineChip({
  todo,
  done,
  onToggleDone,
  onOpen,
  dragConstraints,
  onDragged,
}: {
  todo: Todo;
  done: boolean;
  onToggleDone: () => void;
  onOpen: () => void;
  dragConstraints: React.RefObject<HTMLDivElement | null>;
  onDragged: (offset: { x: number; y: number }, targetHour: number | null) => void;
}) {
  const cat = categorizeTodo(todo.title);
  const statColor = STATS[cat.stat].color;
  // onTap стреляет по времени нажатия, а не по расстоянию — быстрый перенос
  // чипа укладывается в то же окно и открыл бы шторку сразу вслед за
  // переносом без этого флага (тот же приём, что и у TrayChip ниже).
  const justDraggedRef = useRef(false);
  const chipRef = useRef<HTMLDivElement>(null);
  return (
    <motion.div
      ref={chipRef}
      drag
      dragConstraints={dragConstraints}
      dragElastic={0.1}
      dragMomentum={false}
      dragSnapToOrigin
      onDragStart={() => {
        justDraggedRef.current = true;
        // На момент onDragEnd карточка ещё визуально стоит в точке
        // отпускания (dragSnapToOrigin отъезжает НАЗАД уже ПОСЛЕ) — без
        // этого elementFromPoint ниже находил бы саму карточку, а не
        // строку часа под ней.
        if (chipRef.current) chipRef.current.style.pointerEvents = "none";
      }}
      onDragEnd={(_, info) => {
        const hourEl = document
          .elementFromPoint(info.point.x, info.point.y)
          ?.closest<HTMLElement>("[data-hour]");
        if (chipRef.current) chipRef.current.style.pointerEvents = "";
        const targetHour = hourEl ? Number(hourEl.dataset.hour) : null;
        onDragged(info.offset, targetHour !== null && Number.isFinite(targetHour) ? targetHour : null);
        requestAnimationFrame(() => {
          justDraggedRef.current = false;
        });
      }}
      onTap={() => {
        if (justDraggedRef.current) return;
        onOpen();
      }}
      // Раньше был layout (плавный переезд карточки при смене часа) — но
      // framer пересчитывает эту FLIP-анимацию на КАЖДЫЙ ре-рендер сетки,
      // не только на перенос: открыл и закрыл шторку редактирования — и
      // карточка уже «залипала» между старой и новой позицией, наезжая на
      // соседей (воспроизвелось и без единого drag). Без layout смена часа
      // — просто мгновенный скачок на новое место, менее красиво, зато
      // никогда не зависает в промежуточном кадре.
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
      className={cn(
        "glass-chip group relative flex w-full cursor-grab items-center gap-3 overflow-hidden rounded-2xl p-2.5 active:cursor-grabbing",
        done && "opacity-55",
      )}
      style={{
        // @ts-expect-error -- кастомное свойство для CSS ниже
        "--chip-color": statColor,
      }}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[16px]"
        style={{
          background: `color-mix(in srgb, ${statColor} 18%, var(--color-surface-2) 90%)`,
        }}
        aria-hidden
      >
        {cat.icon}
      </div>
      <div className="min-w-0 flex-1 text-left">
        <p
          className={cn(
            "line-clamp-2 text-[13px] font-semibold leading-tight text-[var(--color-fg)]",
            done && "text-[var(--color-muted)] line-through",
          )}
        >
          {todo.title}
        </p>
        <p
          className="mt-0.5 truncate text-[10px] font-bold uppercase tracking-wide"
          style={{ color: statColor }}
        >
          {STATS[cat.stat].label}
          {cat.subLabel ? ` · ${cat.subLabel}` : ""}
        </p>
      </div>
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onToggleDone();
        }}
        aria-label={done ? "Снять отметку о выполнении" : "Отметить выполненным"}
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-[12px] font-bold transition",
          done
            ? "border-[var(--color-stability)] bg-[var(--color-stability)] text-white"
            : "border-[var(--color-border-strong)] text-transparent",
        )}
      >
        ✓
      </button>
    </motion.div>
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
  const chipRef = useRef<HTMLButtonElement>(null);
  return (
    <motion.button
      ref={chipRef}
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
        // Иначе handleTrayDrop's elementFromPoint на отпускании нашёл бы
        // саму кнопку (она физически ещё там, snap-back — уже после).
        if (chipRef.current) chipRef.current.style.pointerEvents = "none";
      }}
      onDragEnd={(_, info) => {
        if (chipRef.current) chipRef.current.style.pointerEvents = "";
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

/** Мета-плитка на экране просмотра задачи — по образцу Meta из ActionCard. */
function ViewMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[var(--color-surface-2)] px-2.5 py-2.5 text-center">
      <p className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]">{label}</p>
      <p className="mt-0.5 truncate text-[12.5px] font-semibold">{value}</p>
    </div>
  );
}
