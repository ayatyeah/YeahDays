"use client";
import { useCopy } from "@/i18n/useCopy";

import { useT } from "@/i18n/useT";
import { useReadingPosition } from "./useReadingPosition";
import { lessonDraftKey, lessonVisitKey } from "@/lib/dayFlow";
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
import type { Progress } from "@/lib/events/engine";
import { routeStates } from "@/lib/events/route";
import RouteStepper from "@/components/events/RouteStepper";
import { useContentLang } from "@/i18n/locale";
import "./learning.css";
import Button from "@/components/ui/Button";
import { useLearningStore } from "@/store/useLearningStore";
import { useLearningActions } from "@/components/useLearningActions";
import LearningLesson from "./LearningLesson";
import { dateKey } from "@/lib/domain";
import { isTodoOnDay, isTodoDone, useUserStore } from "@/store/useUserStore";
import { useSyncStatus } from "@/store/useSyncStatus";
import PathwaysHub from "@/components/path/PathwaysHub";
import { STORIES, frameSrc, storySeconds } from "@/lib/stories";

const field =
  "mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 text-[16px]";
export default function LearningPage({
  events,
}: {
  events: LearningEventSummary[];
}) {
  const tx = useCopy();
  const t = useT();
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
  const [eventSteps, setEventSteps] = useState<Record<string, Progress>>({});
  const tl = useContentLang();
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
          throw new Error(body.error || tx("Не удалось загрузить предметы"));
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
  }, [owner, mode, reloadSubjects, tx]);
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
    if (owner) {
      const raw = Object.fromEntries(events.map((e) => [e.id, loadProgress(owner, e.id)]));
      setEventSteps(raw);
      setEventProgress(
        Object.fromEntries(
          events.map((e) => [e.id, summarizeLearningProgress(e, raw[e.id])]),
        ),
      );
    }
  }, [owner, events]);
  const orderedEvents = orderLearningEvents(events, eventProgress);
  const lastStartedEvent = orderedEvents
    .filter((e) => eventProgress[e.id]?.done)
    .sort((a, b) => (eventVisits[b.id] ?? 0) - (eventVisits[a.id] ?? 0))[0];
  // «Твой маршрут» — ивент, которым занимались последним, а если ни одного — самый свежий.
  const routeEvent = lastStartedEvent ?? orderedEvents[0];
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
  const [draftStatus, setDraftStatus] = useState("");
  useEffect(() => {
    setDraftStatus("");
    if (!owner || !skill || !quest || view !== "lesson") return;
    try {
      const visits = JSON.parse(
        localStorage.getItem(lessonVisitKey(owner)) ?? "{}",
      );
      localStorage.setItem(
        lessonVisitKey(owner),
        JSON.stringify({ ...visits, [skill.id]: Date.now() }),
      );
      const saved = JSON.parse(
        localStorage.getItem(lessonDraftKey(owner, skill.id, quest.id)) ??
          "null",
      );
      if (saved && !quest.completed) {
        setAnswer(
          typeof saved.answer === "string" ? saved.answer.slice(0, 6000) : "",
        );
        setLessonTab(saved.tab === "practice" ? "practice" : "lesson");
        setDraftStatus(t("lesson.draftRestored"));
      }
    } catch {
      /* No storage: keep the lesson usable. */
    }
  }, [owner, skill?.id, quest?.id, view]);
  useReadingPosition(
    owner && view === "lesson" && skill && quest
      ? `${owner}:${skill.id}:${quest.id}:${lessonTab}` : null,
    !!data,
  );
  function saveDraft(nextAnswer: string, nextTab: "lesson" | "practice") {
    if (!owner || !skill || !quest || quest.completed) return;
    try {
      localStorage.setItem(
        lessonDraftKey(owner, skill.id, quest.id),
        JSON.stringify({ answer: nextAnswer, tab: nextTab }),
      );
      setDraftStatus(t("lesson.draftSaved"));
    } catch {
      setDraftStatus(t("lesson.draftFailed"));
    }
  }
  function changeTab(tab: "lesson" | "practice") {
    setLessonTab(tab);
    saveDraft(answer, tab);
  }
  async function tomorrow() {
    if (!skill) return;
    const next = skill.quests.find((q) => !q.completed);
    if (!next) return;
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const day = dateKey(date);
    const title = tx("Учёба: {0}", {"0": next.title});
    const note = `/learn?view=lesson&skill=${encodeURIComponent(skill.id)}&quest=${encodeURIComponent(next.id)}`;
    const store = useUserStore.getState();
    if (!store.todos.some((t) => t.note === note && t.date === day))
      store.addTodo({
        title,
        date: day,
        duration: skill.minutes,
        note,
      });
    setMessage(tx("Следующий квест добавлен в план на завтра."));
    await useSyncStatus.getState().syncNow?.();
  }
  const complete = skill?.quests.filter((q) => q.completed).length ?? 0;
  async function create(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    const result = await action({
      action: "create",
      goal: goal.trim() || tx("Разобрать основы предмета «{0}»", {"0": subjectName.trim()}),
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
      setMessage(tx("Маршрут готов. Начни с первого квеста."));
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
    if (result?.result?.passed && owner && skill && quest) {
      try {
        localStorage.removeItem(lessonDraftKey(owner, skill.id, quest.id));
      } catch {}
      setDraftStatus("");
      const store = useUserStore.getState();
      const today = dateKey();
      const link = `/learn?view=lesson&skill=${encodeURIComponent(skill.id)}&quest=${encodeURIComponent(quest.id)}`;
      for (const task of store.todos)
        if (
          task.note === link &&
          task.date <= today &&
          !isTodoDone(task, today)
        )
          store.toggleTodo(task.id, today);
      void useSyncStatus.getState().syncNow?.();
    }
    if (result && !result.result.passed) setHelp(true);
    if (result)
      setMessage(
        result.result.awarded
          ? tx("Квест пройден! +{0} XP · +{1} монет", {"0": result.result.xp, "1": result.result.coins})
          : result.result.passed
            ? tx("Этот квест уже пройден — награда сохранена.")
            : tx("Пока не зачтено. Посмотри подсказку и попробуй ещё раз — монеты не теряются."),
      );
  }
  async function schedule() {
    if (!skill || !quest) return;
    const day = dateKey();
    const store = useUserStore.getState();
    const title = tx("Учёба: {0}", {"0": quest.title});
    if (store.todos.some((t) => t.title === title && t.date === day)) {
      setMessage(tx("Этот квест уже есть в сегодняшнем плане."));
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
      note: `/learn?view=lesson&skill=${encodeURIComponent(skill.id)}&quest=${encodeURIComponent(quest.id)}`,
    });
    setMessage(
      slot === undefined
        ? tx("Квест добавлен в список на сегодня без времени: свободного окна до 22:00 нет.")
        : tx("Квест добавлен в свободное окно сегодняшнего расписания."),
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
          aria-label={tx("Тип обучения")}
        >
          {(
            [
              ["subject", tx("Предмет из универа")],
              ["goal", tx("Своя цель")],
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
            <label className="block text-sm">{tx("Предмет")}<input
                className={field}
                list="university-subjects"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                required
                minLength={2}
                maxLength={180}
                disabled={busy}
                placeholder={tx("Выбери из списка или введи, например Computer Networks")}
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
                ? tx("Ищем предметы в твоём календаре LMS…")
                : tx(subjectsError) ||
                  (mySubjects?.connected
                    ? mySubjects.names.length
                      ? tx("Это предметы с событиями в календаре LMS. Список может быть неполным; любой предмет можно вписать вручную.")
                      : tx("В календаре пока нет названий предметов. Введи свой вручную.")
                    : tx("Подключи личный календарь LMS в настройках для загрузки предметов или введи название вручную."))}
            </p>
            <div className="flex gap-3 text-xs">
              <button
                type="button"
                className="underline"
                disabled={loadingSubjects || busy}
                onClick={() => setReloadSubjects((v) => v + 1)}
              >{tx("Обновить предметы")}</button>
              <Link prefetch={false} href="/settings" className="underline">{tx("Настройки LMS")}</Link>
            </div>
            <label className="block text-sm">{tx("Конспект или темы из силлабуса · необязательно")}<textarea
                className={field}
                rows={4}
                maxLength={4000}
                value={materials}
                disabled={busy}
                onChange={(e) => setMaterials(e.target.value)}
                placeholder={tx("Вставь нужный фрагмент лекции, список тем или требования к знаниям…")}
              />
            </label>
            <p className="text-xs text-[var(--color-muted)]">{tx("Лекции из LMS автоматически не загружаются. С конспектом задания опираются на твой материал; без него — на общие знания по предмету.")}</p>
          </div>
        )}
        <label className="block text-sm">
          {mode === "subject"
            ? tx("Какую тему разобрать? · необязательно")
            : tx("Чему хочешь научиться?")}
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
                ? tx("Например: подготовиться к теме TCP/IP, разобраться в адресации и подсетях. Если оставить пустым — начнём с основ.")
                : tx("Хочу освоить циклы Python с нуля. Или: хочу увереннее говорить по-английски, уровень A2.")
            }
          />
        </label>
        <label className="block text-sm">{tx("Время на квест")}<select
            aria-label={tx("Время на квест")}
            className={field}
            value={minutes}
            disabled={busy}
            onChange={(e) => setMinutes(Number(e.target.value))}
          >
            {[10, 20, 30].map((m) => (
              <option key={m} value={m}>
                {m}{tx(" минут")}</option>
            ))}
          </select>
        </label>
        <p className="text-xs text-[var(--color-muted)]">{tx("Предмет, цель, добавленные материалы и ответы отправляются в OpenAI для подготовки заданий и проверки. ИИ может ошибаться; код оценивается без запуска.")}</p>
        <Button
          type="submit"
          variant="primary"
          disabled={busy || !data?.available}
        >
          {busy ? tx("ИИ работает…") : tx("Создать маршрут")}
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
              {view === "lesson" ? tx("К маршруту") : tx("Учёба")}
            </button>
          )}
          <h1>
            {view === "hub"
              ? tx("Учёба")
              : view === "create"
                ? tx("Новый маршрут")
                : view === "lesson"
                  ? tx("Твоё занятие")
                  : (skill?.subject?.name ?? skill?.title ?? tx("Твой маршрут"))}
          </h1>
          {view === "hub" && <p>{tx("Понимать. Пробовать. Расти.")}</p>}
        </div>
        {view !== "lesson" && (
          <Link prefetch={false}
            href="/shop"
            className="learning-wallet"
            aria-label={tx("Магазин, {0} монет", {"0": data?.coins ?? 0})}
          >
            <YgIcon name="coin" />
            {data?.coins ?? "…"}
          </Link>
        )}
      </header>
      {!data && (
        <div className="learning-notice" role="status">
          {(loadError && tx(loadError)) || tx("Загружаем учебный прогресс…")}
          {loadError && owner && (
            <Button
              onClick={() => void useLearningStore.getState().load(owner)}
            >{tx("Повторить")}</Button>
          )}
        </div>
      )}
      {data && !data?.available && (
        <p className="learning-notice" role="status">{tx("Подготовка новых ИИ-маршрутов и проверка ответов пока недоступны. Сохранённые материалы и учебные ивенты можно открывать.")}</p>
      )}
      {view === "hub" && (
        <nav className="mono-learning-links" aria-label={tx("Разделы учёбы")}>
          <a href="#path-hub-title">{tx("Траектории")}</a>
          {!!data?.skills.length && <a href="#learning-subjects">{tx("Мои предметы")}</a>}
          <a href="#learning-exams">{tx("Подготовка к экзаменам")}</a>
          <a href="#learning-stories">{tx("Истории")}</a>
        </nav>
      )}
      {view === "hub" && (
        <div className="learning-layout">
          <div className="learning-main">
            {owner && routeEvent?.route && (() => {
              const states = routeStates(routeEvent.route, eventSteps[routeEvent.id] ?? {});
              return (
                <RouteStepper
                  eyebrow={routeEvent.course}
                  stops={routeEvent.route.map((stop, i) => ({ label: stop.label[tl], state: states[i], final: stop.final }))}
                  footer={
                    <Link prefetch={false} href={`/events/${routeEvent.id}`} className="learning-route-link">
                      {tx("{0} · {1}", {"0": tx(routeEvent.title), "1": states.includes("current") ? tx("продолжить") : tx("повторить")})}
                      <YgIcon name="chevron" />
                    </Link>
                  }
                />
              );
            })()}
            <PathwaysHub />
            {/* Прежние ИИ-маршруты из шести квестов — только у тех, кто их уже начал. */}
            {data && data.skills.length > 0 && (
              <section className="learning-continue">
                <div className="learning-continue-copy">
                  <span className="learning-eyebrow">
                    {skill
                      ? complete === total
                        ? tx("МОЖНО ПОВТОРИТЬ")
                        : tx("ПРОДОЛЖИТЬ")
                      : tx("ТВОЙ ПЕРВЫЙ ШАГ")}
                  </span>
                  <h2>
                    {skill?.subject?.name ??
                      skill?.title ??
                      tx("Чему научимся сегодня?")}
                  </h2>
                  <p>
                    {nextQuest?.title ??
                      tx("Выбери предмет или свою цель. Разберём её за шесть небольших квестов.")}
                  </p>
                  {skill && (
                    <>
                      <small>
                        {complete}{tx(" из ")}{total}{tx(" квестов · ")}{skill.minutes}{tx(" минут на занятие")}</small>
                      <progress
                        value={complete}
                        max={total || 1}
                        aria-label={tx("Прогресс текущего маршрута")}
                      />
                    </>
                  )}
                  <button
                    className="learning-primary"
                    onClick={() =>
                      skill
                        ? navigate("lesson", skill.id, nextQuest?.id)
                        : router.push("/learn/new")
                    }
                  >
                    {skill
                      ? complete === total
                        ? tx("Повторить")
                        : tx("Продолжить")
                      : tx("Создать маршрут")}
                    <YgIcon name="chevron" />
                  </button>
                </div>
                {skill && (
                  <ProgressRing
                    value={complete}
                    max={total}
                    label={tx("Прогресс: {0} из {1}", {"0": complete, "1": total})}
                    tone="sage"
                  >
                    {complete}/{total}
                  </ProgressRing>
                )}
              </section>
            )}
            {!!data?.skills.length && <section>
              <div className="learning-section-title">
                <h2 id="learning-subjects">{tx("Мои предметы")}</h2>
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
                          {done}{tx(" из ")}{s.quests.length}{tx(" квестов")}</small>
                        <progress
                          aria-label={tx("Прогресс: {0}", {"0": s.title})}
                          value={done}
                          max={s.quests.length || 1}
                        />
                        <span className="learning-next">
                          {s.quests.find((q) => !q.completed)?.title ??
                            tx("Маршрут пройден")}
                        </span>
                      </span>
                      <YgIcon name="chevron" />
                    </button>
                  );
                })}
              </div>
            </section>}
            <section>
              <div className="learning-section-title">
                <h2 id="learning-exams">{tx("Подготовка к экзаменам")}</h2>
                <Link prefetch={false} href="/events">{tx("Все ивенты ")}<YgIcon name="chevron" />
                </Link>
              </div>
              <div className="learning-events yg-stagger">
                {orderedEvents.map((e, i) => (
                  <Link prefetch={false}
                    href={`/events/${e.id}`}
                    key={e.id}
                    className="learning-event"
                  >
                    <span className="learning-eyebrow">{e.course}</span>
                    <h3>{tx(e.title)}</h3>
                    <p>{tx("{0} {1} · Конспекты и квизы", {"0": e.lectures, "1": tx(plural(e.lectures, "лекция", "лекции", "лекций"))})}</p>
                    <div className="learning-event-badges">
                      {e.mocks > 0 && (
                        <span>
                          {e.mocks}{" "}
                          {plural(
                            e.mocks,
                            tx("пробный вариант"),
                            tx("пробных варианта"),
                            tx("пробных вариантов"),
                          )}
                        </span>
                      )}
                      {e.practice && <span>{tx("Практикум")}</span>}
                      <span>
                        <YgIcon name="bulb" />{e.id === "project-management-quiz-2-real" ? tx(" Разборы и 2 конспекта") : tx(" ИИ-помощник")}</span>
                    </div>
                    <div className="learning-event-progress">
                      <small>
                        {owner ? (
                          <>
                            {eventProgress[e.id]?.done ?? 0} /{" "}
                            {e.stepIds.length}{" "}
                            {plural(
                              e.stepIds.length,
                              tx("проверка"),
                              tx("проверки"),
                              tx("проверок"),
                            )}
                          </>
                        ) : (
                          tx("Учебная программа")
                        )}
                      </small>
                      <YgIcon name="chevron" />
                    </div>
                    <progress
                      value={eventProgress[e.id]?.done ?? 0}
                      max={e.stepIds.length || 1}
                      aria-label={tx("Пройденные проверки: {0}", {"0": e.course})}
                    />
                  </Link>
                ))}
              </div>
            </section>
            {/* Истории — мультфильмы по лекциям: сюжет, где понятия лекции нужны героям. */}
            <section>
              <div className="learning-section-title">
                <h2 id="learning-stories" className="scroll-mt-4">{tx("Истории")}</h2>
              </div>
              <div className="yg-stagger grid gap-3 sm:grid-cols-2">
                {STORIES.map((story) => (
                  <Link prefetch={false} key={story.id} href={`/stories/${story.id}`} className="group overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                    <span className="relative block aspect-video overflow-hidden bg-[var(--color-surface-2)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={frameSrc(story, story.cover)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">{tx("▶ {0} мин", {"0": Math.round(storySeconds(story) / 60)})}</span>
                    </span>
                    <span className="block p-4">
                      <span className="learning-eyebrow" >{tx(story.lecture.label)}</span>
                      <span className="mt-1 block text-lg font-bold leading-tight" >{tx(story.title)}</span>
                      <span className="mt-1 block text-sm text-[var(--color-muted)]" >{tx(story.subtitle)}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </div>
          <aside className="learning-aside">
            <section className="learning-rhythm">
              <span className="learning-eyebrow">{tx("ТВОЙ УЧЕБНЫЙ РИТМ")}</span>
              <h2>{tx("За 7 дней: ")}{weekCount}</h2>
              <p>{tx("Каждое разобранное задание — ещё один шаг к пониманию.")}</p>
              <div className="learning-metrics">
                <span>
                  <b>{data?.xp ?? 0}</b>{tx("учебного XP")}</span>
                <span>
                  <b>{completedQuests.length}</b>{tx("квестов пройдено")}</span>
              </div>
            </section>
            <section className="learning-help-card">
              <h2>{tx("Разберём сложное")}</h2>
              <p>{tx("Готовишься к экзамену? В ивенте помощник видит твой конспект и вариант.")}</p>
              <Link prefetch={false}
                href={
                  lastStartedEvent
                    ? `/events/${lastStartedEvent.id}`
                    : "/events"
                }
              >
                <YgIcon name="book" />{tx(" Помощник по экзамену")}{" "}
                <YgIcon name="chevron" />
              </Link>
              <Link prefetch={false} href="/chat">
                <YgIcon name="bulb" />{tx(" ИИ-помощник ")}<YgIcon name="chevron" />
              </Link>
              {skill && (
                <button
                  onClick={() => navigate("lesson", skill.id, nextQuest?.id)}
                >
                  <YgIcon name="book" />{tx(" К занятию ")}<YgIcon name="chevron" />
                </button>
              )}
            </section>
            <Link prefetch={false} href="/challenge30" className="learning-challenge">
              <YgIcon name="flame" />
              <span>
                <b>{tx("Челлендж 30")}</b>
                <small>{tx("Учёба в своём ритме, день за днём")}</small>
              </span>
              <YgIcon name="chevron" />
            </Link>
          </aside>
        </div>
      )}
      {view === "create" && data && (
        <section className="learning-create">
          <p className="learning-subtitle">{tx("Предмет или личная цель → шесть квестов → практика и обратная связь.")}</p>
          {createForm}
        </section>
      )}
      {view === "route" && skill && (
        <div className="learning-route-layout">
          <section>
            <div className="learning-route-progress">
              <span>
                {complete}{tx(" из ")}{total}{tx(" квестов")}</span>
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
                        {q.boss ? tx("Финальный проект") : tx("Учебный квест")} ·{" "}
                        {skill.minutes}{tx(" мин")}</small>
                      {q.id === nextQuest?.id && !q.completed && (
                        <span className="learning-start">{tx("Начать ")}<YgIcon name="chevron" />
                        </span>
                      )}
                      {blocked && <small>{tx("После предыдущего квеста")}</small>}
                    </button>
                  </li>
                );
              })}
            </ol>
            {complete === total && (
              <p className="learning-notice">{tx("Маршрут пройден! Любое занятие можно повторить.")}</p>
            )}
          </section>
          <aside className="learning-route-note">
            <h2>{tx("Один шаг за раз")}</h2>
            <p>{skill.goal}</p>
            <p>{tx("Читай объяснение, пробуй самостоятельно и проверяй ответ. Ошибки не отнимают XP и монеты.")}</p>
            <button
              className="learning-secondary"
              disabled={busy}
              onClick={() => void schedule()}
            >
              <YgIcon name="calendar" />{tx(" Добавить в план")}</button>
          </aside>
        </div>
      )}
      {view === "lesson" && skill && quest && (
        <LearningLesson {...{ skill, quest, nextQuest, total, draftStatus, locked, lessonTab, busy, answer, help, tomorrow, navigate, changeTab, submit, setAnswer, saveDraft, schedule, openLesson, setHelp }} available={!!data?.available} />
      )}
      {data && (view === "route" || view === "lesson") && !skill && (
        <div className="learning-notice">{tx("Маршрут не найден.")}{" "}
          <button onClick={() => navigate("hub")}>{tx("К предметам")}</button>
        </div>
      )}
      {error && (
        <p role="alert" className="learning-notice learning-error">
          {tx(error)}
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
