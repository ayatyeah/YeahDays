"use client";
import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useUserStore, isTodoOnDay, isTodoDone } from "@/store/useUserStore";
import { dateKey } from "@/lib/domain";
import { useCompanionStore } from "@/store/useCompanionStore";
import { YgIcon } from "@/components/yg-icons";

export default function CompanionAssistant({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const titleId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState<"menu" | "split" | "short" | "focus">(
    "menu",
  );
  const [taskId, setTaskId] = useState("");
  const [steps, setSteps] = useState("");
  const [saved, setSaved] = useState(false);
  const todos = useUserStore((s) => s.todos);
  const updateTodo = useUserStore((s) => s.updateTodo);
  const timer = useCompanionStore();
  const [now, setNow] = useState(Date.now());
  const tasks = todos.filter(
    (t) => isTodoOnDay(t, dateKey()) && !isTodoDone(t, dateKey()),
  );
  const short = tasks.filter((t) => t.duration && t.duration <= 10);
  const seconds = timer.deadline
    ? Math.max(0, Math.ceil((timer.deadline - now) / 1000))
    : timer.remaining;
  useEffect(() => {
    if (!open) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [open]);
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open) {
      setMode("menu");
      setSaved(false);
      el.showModal();
      el.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
      document.body.dataset.modalOpen = "1";
    } else {
      el.close();
      return;
    }
    return () => {
      el.close();
      delete document.body.dataset.modalOpen;
    };
  }, [open, mounted]);
  function saveSteps() {
    const task = todos.find((t) => t.id === taskId);
    const titles = steps
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 20);
    if (!task || !titles.length) return;
    updateTodo(task.id, {
      subtasks: [
        ...task.subtasks,
        ...titles.map((title) => ({
          id: crypto.randomUUID(),
          title,
          done: false,
        })),
      ],
    });
    setSaved(true);
    setSteps("");
  }
  if (!mounted) return null;
  return createPortal(
    <dialog
      ref={dialog}
      className="companion-dialog"
      aria-labelledby={titleId}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="companion-sheet">
        <Image
          className="companion-peek"
          src="/companion/peek.webp"
          width={220}
          height={160}
          alt=""
        />
        <div className="companion-handle" />
        <button
          className="companion-close"
          onClick={onClose}
          aria-label="Закрыть помощника"
        >
          ×
        </button>
        <h2 id={titleId} tabIndex={-1}>
          {mode === "focus" ? "Время для себя" : "Давай упростим день"}
        </h2>
        <p className="companion-subtitle">
          {mode === "menu"
            ? "Один маленький шаг. Я рядом."
            : "Двигайся в своём темпе."}
        </p>
        {mode === "menu" && (
          <div className="companion-options">
            <button
              onClick={() => {
                setMode("split");
                setTaskId(tasks[0]?.id ?? "");
              }}
            >
              <span className="companion-option-icon">
                <YgIcon name="cards" />
              </span>
              <span>
                <b>Разбить задачу</b>
                <small>Сделаем её маленькими шагами</small>
              </span>
              <YgIcon name="chevron" />
            </button>
            <button onClick={() => setMode("short")}>
              <span className="companion-option-icon peach">
                <YgIcon name="clock" />
              </span>
              <span>
                <b>Найти 10 минут</b>
                <small>Выбрать короткое дело на сегодня</small>
              </span>
              <YgIcon name="chevron" />
            </button>
            <button onClick={() => setMode("focus")}>
              <span className="companion-option-icon lilac">
                <YgIcon name="bolt" />
              </span>
              <span>
                <b>Начать фокус</b>
                <small>25 минут для одного дела</small>
              </span>
              <YgIcon name="chevron" />
            </button>
          </div>
        )}
        {mode === "split" && (
          <div className="companion-form">
            {tasks.length ? (
              <>
                <label>
                  Выбери задачу
                  <select
                    value={taskId}
                    onChange={(e) => {
                      setTaskId(e.target.value);
                      setSaved(false);
                    }}
                  >
                    {tasks.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Маленькие шаги — каждый с новой строки
                  <textarea
                    rows={3}
                    value={steps}
                    onChange={(e) => {
                      setSteps(e.target.value);
                      setSaved(false);
                    }}
                    placeholder={
                      "Открыть материалы\nРазобрать один пример\nЗаписать вывод"
                    }
                  />
                </label>
                <button
                  className="companion-primary"
                  disabled={!steps.trim()}
                  onClick={saveSteps}
                >
                  Сохранить шаги
                </button>
                {saved && <p role="status">Шаги добавлены в задачу.</p>}
              </>
            ) : (
              <p>
                Добавь свою задачу в плане дня — и здесь можно будет разбить её
                на шаги.
              </p>
            )}
          </div>
        )}
        {mode === "short" && (
          <div className="companion-options">
            {short.length ? (
              short.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    useCompanionStore.setState({
                      deadline: null,
                      remaining: (t.duration ?? 10) * 60,
                      started: false,
                    });
                    setMode("focus");
                  }}
                >
                  <span>
                    <b>{t.title}</b>
                    <small>{t.duration} минут · можно начать с этого</small>
                  </span>
                  <YgIcon name="chevron" />
                </button>
              ))
            ) : (
              <>
                <p>
                  В плане пока нет задач до 10 минут. Выбери небольшое действие
                  из колоды.
                </p>
                <Link
                  href="/app"
                  onClick={onClose}
                  className="companion-primary"
                >
                  Подобрать действие
                </Link>
              </>
            )}
          </div>
        )}
        {mode === "focus" && (
          <div className="companion-focus">
            <div className="companion-clock" role="timer">
              {String(Math.floor(seconds / 60)).padStart(2, "0")}:
              {String(seconds % 60).padStart(2, "0")}
            </div>
            <p>
              {seconds === 0
                ? "Готово. Сделай паузу — ты её заслужил."
                : "Закрывай помощника, если нужно. Таймер продолжит идти."}
            </p>
            <div className="companion-focus-actions">
              <button
                className="companion-primary"
                onClick={() => {
                  setNow(Date.now());
                  if (timer.deadline && seconds > 0) timer.pause();
                  else {
                    if (seconds === 0) timer.reset();
                    useCompanionStore.getState().start();
                  }
                }}
              >
                {timer.deadline && seconds > 0
                  ? "Пауза"
                  : timer.started && seconds > 0
                    ? "Продолжить"
                    : "Начать"}
              </button>
              <button onClick={timer.reset}>Сбросить</button>
            </div>
          </div>
        )}
        <button
          className="companion-dismiss"
          onClick={mode === "menu" ? onClose : () => setMode("menu")}
        >
          {mode === "menu" ? "Не сейчас" : "Назад"}
        </button>
      </div>
    </dialog>,
    document.body,
  );
}
