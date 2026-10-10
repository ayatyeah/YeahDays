"use client";
import { isLmsDeadline } from "@/lib/lmsEventKind";
import { useEffect, useState } from "react";
import Link from "next/link";
import AppBrand from "@/components/mono/AppBrand";
import ProgressRing from "@/components/mono/ProgressRing";
import { useRouter, useSearchParams } from "next/navigation";
import { YgIcon } from "@/components/yg-icons";
import { plural } from "@/lib/plural";
import {
  learningVisitKey,
  orderLearningEvents,
  summarizeLearningProgress,
  type LearningEventSummary,
  type LearningEventProgress,
} from "@/lib/learningEvents";
import { loadProgress } from "@/lib/events/storage";
import "./learning.css";
import Button from "@/components/ui/Button";
import { useLearningStore } from "@/store/useLearningStore";
import { useLearningActions } from "@/components/useLearningActions";
import { rewardFor } from "@/lib/learning";
import { dateKey } from "@/lib/domain";
import { isTodoOnDay, useUserStore } from "@/store/useUserStore";
import { useSyncStatus } from "@/store/useSyncStatus";

const field =
  "mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 text-[16px]";
export default function LearningPage({
  events,
}: {
  events: LearningEventSummary[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const requestedView = params.get("view") ?? "hub";
  const view = ["hub", "create", "route", "lesson"].includes(requestedView)
    ? requestedView
    : "hub";
  const selected = params.get("skill") ?? "";
  const questId = params.get("quest") ?? "";
  const [lessonTab, setLessonTab] = useState<"lesson" | "practice">("lesson");
  const [help, setHelp] = useState(false);
  const [eventProgress, setEventProgress] = useState<
    Record<string, LearningEventProgress>
  >({});
  const [eventVisits, setEventVisits] = useState<Record<string, number>>({});
  function navigate(next: string, skillId = "", nextQuest = "") {
    const query = new URLSearchParams();
    if (next !== "hub") query.set("view", next);
    if (skillId) query.set("skill", skillId);
    if (nextQuest) query.set("quest", nextQuest);
    router.push(`/learn${query.size ? `?${query}` : ""}`);
  }

  const { owner, busy, error, action } = useLearningActions();
  const data = useLearningStore((s) => (s.owner === owner ? s.data : null));
  const loadError = useLearningStore((s) => s.error);
  const [goal, setGoal] = useState("");
  const [mode, setMode] = useState<"subject" | "goal">("subject");
  const [subjectName, setSubjectName] = useState("");
  const [materials, setMaterials] = useState("");
  const [reloadSubjects, setReloadSubjects] = useState(0);
  const [subjects, setSubjects] = useState<{
    owner: string;
    names: string[];
    connected: boolean;
  } | null>(null);
  const [subjectsError, setSubjectsError] = useState("");
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  useEffect(() => {
    setSubjectName("");
    setMaterials("");
    setSubjects(null);
    setSubjectsError("");
  }, [owner]);
  useEffect(() => {
    if (!owner || mode !== "subject") return;
    const controller = new AbortController();
    setLoadingSubjects(true);
    setSubjectsError("");
    fetch("/api/learning/subjects", {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok)
          throw new Error(body.error || "Не удалось загрузить предметы");
        return body;
      })
      .then((body) => {
        if (!controller.signal.aborted)
          setSubjects({
            owner,
            names: body.subjects,
            connected: body.connected,
          });
      })
      .catch((error) => {
        if (!controller.signal.aborted) setSubjectsError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingSubjects(false);
      });
    return () => controller.abort();
  }, [owner, mode, reloadSubjects]);
  const mySubjects = subjects?.owner === owner ? subjects : null;
  const [minutes, setMinutes] = useState(20);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    setGoal("");
    setAnswer("");
    setMessage("");
  }, [owner]);
  useEffect(() => {
    setAnswer("");
    setMessage("");
    setLessonTab("lesson");
    setHelp(false);
  }, [selected, questId, view]);
  useEffect(() => {
    setEventProgress({});
    setEventVisits({});
    if (owner) {
      try {
        setEventVisits(
          JSON.parse(localStorage.getItem(learningVisitKey(owner)) ?? "{}"),
        );
      } catch {
        /* storage unavailable */
      }
    }
    if (owner)
      setEventProgress(
        Object.fromEntries(
          events.map((e) => {
            const progress = loadProgress(owner, e.id);
            return [e.id, summarizeLearningProgress(e, progress)];
          }),
        ),
      );
  }, [owner, events]);
  const orderedEvents = orderLearningEvents(events, eventProgress);
  const lastStartedEvent = orderedEvents
    .filter((e) => eventProgress[e.id]?.done)
    .sort((a, b) => (eventVisits[b.id] ?? 0) - (eventVisits[a.id] ?? 0))[0];
  const skill =
    data?.skills.find((s) => s.id === selected) ??
    data?.skills.find((s) => s.quests.some((q) => !q.completed)) ??
    data?.skills[0];
  const quest =
    skill?.quests.find((q) => q.id === questId) ??
    skill?.quests.find((q) => !q.completed) ??
    skill?.quests.at(-1);
  const locked =
    !!skill &&
    !!quest &&
    !quest.completed &&
    skill.quests.find((q) => !q.completed)?.id !== quest.id;
  const complete = skill?.quests.filter((q) => q.completed).length ?? 0;
  async function create(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    const result = await action({
      action: "create",
      goal: goal.trim() || `Разобрать основы предмета «${subjectName.trim()}»`,
      minutes,
      requestId: crypto.randomUUID(),
      ...(mode === "subject"
        ? { subject: { name: subjectName, materials } }
        : {}),
    });
    if (result) {
      navigate("route", result.skillId);
      setAnswer("");
      setGoal("");
      setMessage("Маршрут готов. Начни с первого квеста.");
    }
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!skill || !quest) return;
    const result = await action({
      action: "answer",
      skillId: skill.id,
      questId: quest.id,
      answer,
    });
    if (result)
      setMessage(
        result.result.awarded
          ? `Квест пройден! +${result.result.xp} XP · +${result.result.coins} монет`
          : result.result.passed
            ? "Этот квест уже пройден — награда сохранена."
            : "Пока не зачтено. Посмотри подсказку и попробуй ещё раз — монеты не теряются.",
      );
  }
  async function schedule() {
    if (!skill || !quest) return;
    const day = dateKey();
    const store = useUserStore.getState();
    const title = `Учёба: ${quest.title}`;
    if (store.todos.some((t) => t.title === title && t.date === day)) {
      setMessage("Этот квест уже есть в сегодняшнем плане.");
      return;
    }
    const now = new Date();
    let slot: number | undefined;
    for (
      let start = Math.max(
        8 * 60,
        Math.ceil((now.getHours() * 60 + now.getMinutes()) / 10) * 10,
      );
      start + skill.minutes <= 22 * 60;
      start += 10
    ) {
      if (
        !store.todos.some(
          (t) =>
            !isLmsDeadline(t) &&
            t.hour !== undefined &&
            isTodoOnDay(t, day) &&
            start < t.hour * 60 + (t.minute ?? 0) + (t.duration ?? 60) &&
            start + skill.minutes > t.hour * 60 + (t.minute ?? 0),
        )
      ) {
        slot = start;
        break;
      }
    }
    store.addTodo({
      title,
      date: day,
      duration: skill.minutes,
      hour: slot === undefined ? undefined : Math.floor(slot / 60),
      minute: slot === undefined ? undefined : slot % 60,
      note: "Квест в разделе «Прокачать навык». Награда начисляется после проверки ответа.",
    });
    setMessage(
      slot === undefined
        ? "Квест добавлен в список на сегодня без времени: свободного окна до 22:00 нет."
        : "Квест добавлен в свободное окно сегодняшнего расписания.",
    );
    await useSyncStatus.getState().syncNow?.();
  }
  const createForm = (
    <>
      {" "}
      <form onSubmit={create} className="mt-4 space-y-4">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Тип обучения"
        >
          {(
            [
              ["subject", "Предмет из универа"],
              ["goal", "Своя цель"],
            ] as const
          ).map(([value, label]) => (
            <Button
              key={value}
              type="button"
              variant={mode === value ? "primary" : "surface"}
              disabled={busy}
              aria-pressed={mode === value}
              onClick={() => setMode(value)}
            >
              {label}
            </Button>
          ))}
        </div>
        {mode === "subject" && (
          <div className="space-y-3 rounded-2xl border border-[var(--color-border)] p-4">
            <label className="block text-sm">
              Предмет
              <input
                className={field}
                list="university-subjects"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                required
                minLength={2}
                maxLength={180}
                disabled={busy}
                placeholder="Выбери из списка или введи, например Computer Networks"
              />
              <datalist id="university-subjects">
                {mySubjects?.names.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </label>
            <div className="flex flex-wrap gap-2">
              {mySubjects?.names.map((name) => (
                <button
                  key={name}
                  type="button"
                  disabled={busy}
                  aria-pressed={subjectName === name}
                  onClick={() => setSubjectName(name)}
                  className={`rounded-xl border px-3 py-2 text-xs ${subjectName === name ? "border-violet-400 bg-violet-500/15" : "border-[var(--color-border)]"}`}
                >
                  {name}
                </button>
              ))}
            </div>
            <p role="status" className="text-xs text-[var(--color-muted)]">
              {loadingSubjects
                ? "Ищем предметы в твоём календаре LMS…"
                : subjectsError ||
                  (mySubjects?.connected
                    ? mySubjects.names.length
                      ? "Это предметы с событиями в календаре LMS. Список может быть неполным; любой предмет можно вписать вручную."
                      : "В календаре пока нет названий предметов. Введи свой вручную."
                    : "Подключи личный календарь LMS в настройках для загрузки предметов или введи название вручную.")}
            </p>
            <div className="flex gap-3 text-xs">
              <button
                type="button"
                className="underline"
                disabled={loadingSubjects || busy}
                onClick={() => setReloadSubjects((v) => v + 1)}
              >
                Обновить предметы
              </button>
              <Link href="/settings" className="underline">
                Настройки LMS
              </Link>
            </div>
            <label className="block text-sm">
              Конспект или темы из силлабуса · необязательно
              <textarea
                className={field}
                rows={4}
                maxLength={4000}
                value={materials}
                disabled={busy}
                onChange={(e) => setMaterials(e.target.value)}
                placeholder="Вставь нужный фрагмент лекции, список тем или требования к знаниям…"
              />
            </label>
            <p className="text-xs text-[var(--color-muted)]">
              Лекции из LMS автоматически не загружаются. С конспектом задания
              опираются на твой материал; без него — на общие знания по
              предмету.
            </p>
          </div>
        )}
        <label className="block text-sm">
          {mode === "subject"
            ? "Какую тему разобрать? · необязательно"
            : "Чему хочешь научиться?"}
          <textarea
            className={field}
            rows={3}
            required={mode === "goal"}
            minLength={5}
            maxLength={600}
            value={goal}
            disabled={busy}
            onChange={(e) => setGoal(e.target.value)}
            placeholder={
              mode === "subject"
                ? "Например: подготовиться к теме TCP/IP, разобраться в адресации и подсетях. Если оставить пустым — начнём с основ."
                : "Хочу освоить циклы Python с нуля. Или: хочу увереннее говорить по-английски, уровень A2."
            }
          />
        </label>
        <label className="block text-sm">
          Время на квест
          <select
            aria-label="Время на квест"
            className={field}
            value={minutes}
            disabled={busy}
            onChange={(e) => setMinutes(Number(e.target.value))}
          >
            {[10, 20, 30].map((m) => (
              <option key={m} value={m}>
                {m} минут
              </option>
            ))}
          </select>
        </label>
        <p className="text-xs text-[var(--color-muted)]">
          Предмет, цель, добавленные материалы и ответы отправляются в OpenAI
          для подготовки заданий и проверки. ИИ может ошибаться; код оценивается
          без запуска.
        </p>
        <Button
          type="submit"
          variant="primary"
          disabled={busy || !data?.available}
        >
          {busy ? "ИИ работает…" : "Создать маршрут"}
        </Button>
      </form>
    </>
  );
  const total = skill?.quests.length ?? 0;
  const percent = total ? Math.round((complete / total) * 100) : 0;
  const nextQuest = skill?.quests.find((q) => !q.completed) ?? skill?.quests[0];
  const openLesson = (id: string) => {
    if (skill) navigate("lesson", skill.id, id);
  };
  const completedQuests =
    data?.skills.flatMap((s) => s.quests).filter((q) => q.completed) ?? [];
  const weekCount = completedQuests.filter(
    (q) =>
      q.completedAt && Date.parse(q.completedAt) >= Date.now() - 7 * 86400000,
  ).length;
  return (
    <div
      className={`learning-page ${view === "lesson" ? "learning-focus" : ""}`}
    >
      {view === "hub" && <AppBrand />}
      <header className="learning-header">
        <div>
          {view !== "hub" && (
            <button
              className="learning-back"
              disabled={busy}
              onClick={() =>
                navigate(
                  view === "lesson" ? "route" : "hub",
                  view === "lesson" ? skill?.id : "",
                )
              }
            >
              <YgIcon name="chevron" />{" "}
              {view === "lesson" ? "К маршруту" : "Учёба"}
            </button>
          )}
          <h1>
            {view === "hub"
              ? "Учёба"
              : view === "create"
                ? "Новый маршрут"
                : view === "lesson"
                  ? "Твоё занятие"
                  : (skill?.subject?.name ?? skill?.title ?? "Твой маршрут")}
          </h1>
          {view === "hub" && <p>Понимать. Пробовать. Расти.</p>}
        </div>
        {view !== "lesson" && (
          <Link
            href="/shop"
            className="learning-wallet"
            aria-label={`Магазин, ${data?.coins ?? 0} монет`}
          >
            <YgIcon name="coin" />
            {data?.coins ?? "…"}
          </Link>
        )}
      </header>
      {!data && (
        <div className="learning-notice" role="status">
          {loadError || "Загружаем учебный прогресс…"}
          {loadError && owner && (
            <Button
              onClick={() => void useLearningStore.getState().load(owner)}
            >
              Повторить
            </Button>
          )}
        </div>
      )}
      {data && !data?.available && (
        <p className="learning-notice" role="status">
          Подготовка новых ИИ-маршрутов и проверка ответов пока недоступны.
          Сохранённые материалы и учебные ивенты можно открывать.
        </p>
      )}
      {view === "hub" && (
        <nav className="mono-learning-links" aria-label="Разделы учёбы">
          <a href="#learning-subjects">Мои предметы</a>
          <a href="#learning-exams">Подготовка к экзаменам</a>
        </nav>
      )}
      {view === "hub" && (
        <div className="learning-layout">
          <div className="learning-main">
            {data && (
              <section className="learning-continue">
                <div className="learning-continue-copy">
                  <span className="learning-eyebrow">
                    {skill
                      ? complete === total
                        ? "МОЖНО ПОВТОРИТЬ"
                        : "ПРОДОЛЖИТЬ"
                      : "ТВОЙ ПЕРВЫЙ ШАГ"}
                  </span>
                  <h2>
                    {skill?.subject?.name ??
                      skill?.title ??
                      "Чему научимся сегодня?"}
                  </h2>
                  <p>
                    {nextQuest?.title ??
                      "Выбери предмет или свою цель. Разберём её за шесть небольших квестов."}
                  </p>
                  {skill && (
                    <>
                      <small>
                        {complete} из {total} квестов · {skill.minutes} минут на
                        занятие
                      </small>
                      <progress
                        value={complete}
                        max={total || 1}
                        aria-label="Прогресс текущего маршрута"
                      />
                    </>
                  )}
                  <button
                    className="learning-primary"
                    onClick={() =>
                      skill
                        ? navigate("lesson", skill.id, nextQuest?.id)
                        : navigate("create")
                    }
                  >
                    {skill
                      ? complete === total
                        ? "Повторить"
                        : "Продолжить"
                      : "Создать маршрут"}
                    <YgIcon name="chevron" />
                  </button>
                </div>
                {skill && (
                  <ProgressRing
                    value={complete}
                    max={total}
                    label={`Прогресс: ${complete} из ${total}`}
                    tone="sage"
                  >
                    {complete}/{total}
                  </ProgressRing>
                )}
              </section>
            )}
            <section>
              <div className="learning-section-title">
                <h2 id="learning-subjects">Мои предметы</h2>
                <button disabled={!data} onClick={() => navigate("create")}>
                  + Новый маршрут
                </button>
              </div>
              <div className="learning-subjects">
                {data?.skills.map((s, i) => {
                  const done = s.quests.filter((q) => q.completed).length;
                  return (
                    <button
                      key={s.id}
                      className={`learning-subject learning-tone-${i % 3}`}
                      onClick={() => navigate("route", s.id)}
                    >
                      <span className="learning-subject-icon">
                        <YgIcon
                          name={
                            i % 3 === 0
                              ? "book"
                              : i % 3 === 1
                                ? "bulb"
                                : "cards"
                          }
                        />
                      </span>
                      <span className="learning-subject-content">
                        <b>{s.subject?.name ?? s.title}</b>
                        <small>
                          {done} из {s.quests.length} квестов
                        </small>
                        <progress
                          aria-label={`Прогресс: ${s.title}`}
                          value={done}
                          max={s.quests.length || 1}
                        />
                        <span className="learning-next">
                          {s.quests.find((q) => !q.completed)?.title ??
                            "Маршрут пройден"}
                        </span>
                      </span>
                      <YgIcon name="chevron" />
                    </button>
                  );
                })}
              </div>
              {data?.skills.length === 0 && (
                <p className="learning-empty">
                  Здесь появятся твои маршруты. Можно начать с предмета из
                  университета или любой интересной темы.
                </p>
              )}
            </section>
            <section>
              <div className="learning-section-title">
                <h2 id="learning-exams">Подготовка к экзаменам</h2>
                <Link href="/events">
                  Все ивенты <YgIcon name="chevron" />
                </Link>
              </div>
              <div className="learning-events">
                {orderedEvents.map((e, i) => (
                  <Link
                    href={`/events/${e.id}`}
                    key={e.id}
                    className="learning-event"
                  >
                    <span className="learning-eyebrow">{e.course}</span>
                    <h3>{e.title}</h3>
                    <p>{`${e.lectures} ${plural(e.lectures, "лекция", "лекции", "лекций")} · Конспекты и квизы`}</p>
                    <div className="learning-event-badges">
                      {e.mocks > 0 && (
                        <span>
                          {e.mocks}{" "}
                          {plural(
                            e.mocks,
                            "пробный вариант",
                            "пробных варианта",
                            "пробных вариантов",
                          )}
                        </span>
                      )}
                      {e.practice && <span>Практикум</span>}
                      <span>
                        <YgIcon name="bulb" /> ИИ-помощник
                      </span>
                    </div>
                    <div className="learning-event-progress">
                      <small>
                        {owner ? (
                          <>
                            {eventProgress[e.id]?.done ?? 0} /{" "}
                            {e.stepIds.length}{" "}
                            {plural(
                              e.stepIds.length,
                              "проверка",
                              "проверки",
                              "проверок",
                            )}
                          </>
                        ) : (
                          "Учебная программа"
                        )}
                      </small>
                      <YgIcon name="chevron" />
                    </div>
                    <progress
                      value={eventProgress[e.id]?.done ?? 0}
                      max={e.stepIds.length || 1}
                      aria-label={`Пройденные проверки: ${e.course}`}
                    />
                  </Link>
                ))}
              </div>
            </section>
          </div>
          <aside className="learning-aside">
            <section className="learning-rhythm">
              <span className="learning-eyebrow">ТВОЙ УЧЕБНЫЙ РИТМ</span>
              <h2>За 7 дней: {weekCount}</h2>
              <p>Каждое разобранное задание — ещё один шаг к пониманию.</p>
              <div className="learning-metrics">
                <span>
                  <b>{data?.xp ?? 0}</b>учебного XP
                </span>
                <span>
                  <b>{completedQuests.length}</b>квестов пройдено
                </span>
              </div>
            </section>
            <section className="learning-help-card">
              <h2>Разберём сложное</h2>
              <p>
                Готовишься к экзамену? В ивенте помощник видит твой конспект и
                вариант.
              </p>
              <Link
                href={
                  lastStartedEvent
                    ? `/events/${lastStartedEvent.id}`
                    : "/events"
                }
              >
                <YgIcon name="book" /> Помощник по экзамену{" "}
                <YgIcon name="chevron" />
              </Link>
              <Link href="/chat">
                <YgIcon name="bulb" /> ИИ-помощник <YgIcon name="chevron" />
              </Link>
              {skill && (
                <button
                  onClick={() => navigate("lesson", skill.id, nextQuest?.id)}
                >
                  <YgIcon name="book" /> К занятию <YgIcon name="chevron" />
                </button>
              )}
            </section>
            <Link href="/challenge30" className="learning-challenge">
              <YgIcon name="flame" />
              <span>
                <b>Челлендж 30</b>
                <small>Учёба в своём ритме, день за днём</small>
              </span>
              <YgIcon name="chevron" />
            </Link>
          </aside>
        </div>
      )}
      {view === "create" && data && (
        <section className="learning-create">
          <p className="learning-subtitle">
            Предмет или личная цель → шесть квестов → практика и обратная связь.
          </p>
          {createForm}
        </section>
      )}
      {view === "route" && skill && (
        <div className="learning-route-layout">
          <section>
            <div className="learning-route-progress">
              <span>
                {complete} из {total} квестов
              </span>
              <progress value={complete} max={total || 1} />
              <b>{percent}%</b>
            </div>
            <ol className="learning-route">
              {skill.quests.map((q, i) => {
                const blocked = !q.completed && i > complete;
                return (
                  <li
                    key={q.id}
                    data-done={q.completed}
                    data-current={q.id === nextQuest?.id}
                  >
                    <span className="learning-node">
                      {q.completed ? (
                        <YgIcon name="check" />
                      ) : q.boss ? (
                        <YgIcon name="bolt" />
                      ) : (
                        i + 1
                      )}
                    </span>
                    <button
                      disabled={busy || blocked}
                      onClick={() => openLesson(q.id)}
                    >
                      <b>{q.title}</b>
                      <small>
                        {q.boss ? "Финальный проект" : "Учебный квест"} ·{" "}
                        {skill.minutes} мин
                      </small>
                      {q.id === nextQuest?.id && !q.completed && (
                        <span className="learning-start">
                          Начать <YgIcon name="chevron" />
                        </span>
                      )}
                      {blocked && <small>После предыдущего квеста</small>}
                    </button>
                  </li>
                );
              })}
            </ol>
            {complete === total && (
              <p className="learning-notice">
                Маршрут пройден! Любое занятие можно повторить.
              </p>
            )}
          </section>
          <aside className="learning-route-note">
            <h2>Один шаг за раз</h2>
            <p>{skill.goal}</p>
            <p>
              Читай объяснение, пробуй самостоятельно и проверяй ответ. Ошибки
              не отнимают XP и монеты.
            </p>
            <button
              className="learning-secondary"
              disabled={busy}
              onClick={() => void schedule()}
            >
              <YgIcon name="calendar" /> Добавить в план
            </button>
          </aside>
        </div>
      )}
      {view === "lesson" && skill && quest && (
        <section className="learning-lesson">
          <div className="learning-lesson-meta">
            <span>
              Квест {skill.quests.findIndex((q) => q.id === quest.id) + 1} /{" "}
              {total} · {skill.minutes} мин
            </span>
            <span>+{rewardFor(quest.boss).xp} XP</span>
          </div>
          <h2>{quest.title}</h2>
          {locked ? (
            <div className="learning-notice">
              Сначала заверши предыдущий квест.
              <button
                className="learning-primary"
                onClick={() => navigate("route", skill.id)}
              >
                К маршруту
              </button>
            </div>
          ) : (
            <>
              <div
                className="learning-tabs"
                role="tablist"
                aria-label="Материалы занятия"
              >
                <button
                  role="tab"
                  id="lesson-tab"
                  aria-controls="lesson-panel"
                  aria-selected={lessonTab === "lesson"}
                  onClick={() => setLessonTab("lesson")}
                >
                  Разобраться
                </button>
                <button
                  role="tab"
                  id="practice-tab"
                  aria-controls="practice-panel"
                  aria-selected={lessonTab === "practice"}
                  onClick={() => setLessonTab("practice")}
                >
                  Практика
                </button>
              </div>
              <div
                id={lessonTab === "lesson" ? "lesson-panel" : "practice-panel"}
                role="tabpanel"
                aria-labelledby={
                  lessonTab === "lesson" ? "lesson-tab" : "practice-tab"
                }
                className="learning-reading"
              >
                {lessonTab === "lesson" ? quest.lesson : quest.exercise}
              </div>
              {lessonTab === "lesson" && (
                <button
                  className="learning-secondary"
                  onClick={() => setLessonTab("practice")}
                >
                  Попробовать на практике <YgIcon name="chevron" />
                </button>
              )}
              {quest.feedback && (
                <div role="status" className="learning-feedback">
                  <b>{quest.completed ? "Зачтено" : "Разбор ответа"}</b>
                  <p>{quest.feedback}</p>
                </div>
              )}
              {lessonTab === "practice" && !quest.completed && (
                <form onSubmit={submit} className="learning-answer">
                  <label htmlFor="learning-answer">Твой ответ</label>
                  <textarea
                    id="learning-answer"
                    className={field}
                    rows={5}
                    required
                    maxLength={6000}
                    value={answer}
                    disabled={busy}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Объясни своими словами или вставь свой код…"
                  />
                  <div className="learning-answer-actions">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={busy || !data?.available}
                    >
                      {busy ? "Проверяем…" : "Проверить ответ"}
                    </Button>
                    <button
                      type="button"
                      className="learning-secondary"
                      disabled={busy}
                      onClick={() => void schedule()}
                    >
                      В план на сегодня
                    </button>
                  </div>
                  <small>
                    Награда за решение — один раз. Ошибки не отнимают XP.
                  </small>
                </form>
              )}
              {quest.completed && (
                <button
                  className="learning-primary"
                  onClick={() =>
                    nextQuest && !nextQuest.completed
                      ? openLesson(nextQuest.id)
                      : navigate("route", skill.id)
                  }
                >
                  {nextQuest && !nextQuest.completed
                    ? "Следующий квест"
                    : "К маршруту"}
                  <YgIcon name="chevron" />
                </button>
              )}
              <button
                className="learning-help-toggle"
                aria-expanded={help}
                onClick={() => setHelp((v) => !v)}
              >
                <YgIcon name="bulb" /> Нужна помощь с темой?{" "}
                <YgIcon name="chevron" />
              </button>
              {help && (
                <div className="learning-help-expanded">
                  <div>
                    <p>
                      Начни с одного вопроса: какая часть объяснения непонятна?
                      Открой помощника и укажи тему «{quest.title}».
                    </p>
                    <Link href="/chat">Задать вопрос в ИИ-помощнике</Link>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      )}
      {data && (view === "route" || view === "lesson") && !skill && (
        <div className="learning-notice">
          Маршрут не найден.{" "}
          <button onClick={() => navigate("hub")}>К предметам</button>
        </div>
      )}
      {error && (
        <p role="alert" className="learning-notice learning-error">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="learning-notice">
          {message}
        </p>
      )}
    </div>
  );
}
