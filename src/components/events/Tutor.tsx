"use client";

import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";
import type { StudyEvent } from "@/lib/events/types";
import type { TutorFocus } from "@/lib/tutor";
import { useTutorFocus } from "@/lib/tutorFocus";
import { useLocaleStore } from "@/i18n/locale";
import { usePersonalizationStore } from "@/store/usePersonalizationStore";

/**
 * ИИ-помощник по подготовке: плавающая кнопка и панель чата (на телефоне —
 * шторка снизу, на компьютере — карточка справа). Видит, что открыто на
 * экране (lib/tutorFocus.ts), и выделенный на странице текст; подсказки-
 * кнопки меняются вместе с экраном. Переписка — только в этом браузере.
 */

const CONSENT = "event-tutor-v1";
const KEEP = 40;
const SEND = 12;

interface Message {
  role: "user" | "assistant";
  text: string;
  /** Ответ оборвали кнопкой «Стоп». */
  stopped?: boolean;
}

/* ───────────── разметка ответа: маленькое подмножество Markdown ───────────── */

function inlineMd(text: string): ReactNode[] {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g).map((piece, i) => {
    if (piece.startsWith("`") && piece.endsWith("`") && piece.length > 2)
      return <code key={i} className="rounded-md bg-[var(--color-bg)] px-1 py-0.5 font-mono text-[0.9em]">{piece.slice(1, -1)}</code>;
    if (piece.startsWith("**") && piece.endsWith("**") && piece.length > 4) return <strong key={i}>{piece.slice(2, -2)}</strong>;
    if (piece.startsWith("*") && piece.endsWith("*") && piece.length > 2) return <em key={i}>{piece.slice(1, -1)}</em>;
    return <Fragment key={i}>{piece}</Fragment>;
  });
}

export function TutorText({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const lines = text.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const key = out.length;
    if (line.trimStart().startsWith("```")) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) code.push(lines[i++]);
      i++;
      out.push(<pre key={key} className="overflow-x-auto rounded-xl bg-[var(--color-bg)] px-3 py-2 font-mono text-[12.5px] leading-snug">{code.join("\n")}</pre>);
      continue;
    }
    if (/^\s*([-*•])\s+/.test(line) || /^\s*\d+[.)]\s+/.test(line)) {
      const ordered = /^\s*\d+[.)]\s+/.test(line);
      const items: string[] = [];
      while (i < lines.length && (ordered ? /^\s*\d+[.)]\s+/ : /^\s*([-*•])\s+/).test(lines[i])) items.push(lines[i++].replace(/^\s*(?:[-*•]|\d+[.)])\s+/, ""));
      const List = ordered ? "ol" : "ul";
      out.push(<List key={key} className={cn("space-y-1 pl-5", ordered ? "list-decimal" : "list-disc")}>{items.map((it, n) => <li key={n}>{inlineMd(it)}</li>)}</List>);
      continue;
    }
    if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        if (!/^\|[\s\-:|]+\|$/.test(lines[i].trim())) rows.push(lines[i].trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
        i++;
      }
      out.push(
        <div key={key} className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <tbody>
              {rows.map((r, n) => (
                <tr key={n} className={n === 0 ? "font-semibold" : ""}>{r.map((c, k) => <td key={k} className="border-b border-[var(--color-border)] px-2 py-1 align-top">{inlineMd(c)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }
    i++;
    if (/^#{1,4}\s/.test(line)) out.push(<p key={key} className="pt-1 font-bold">{inlineMd(line.replace(/^#+\s/, ""))}</p>);
    else if (line.startsWith("> ")) out.push(<blockquote key={key} className="border-l-2 border-violet-400 pl-3 text-[var(--color-fg-dim)]">{inlineMd(line.slice(2))}</blockquote>);
    else if (line.trim()) out.push(<p key={key}>{inlineMd(line)}</p>);
  }
  return <div className="space-y-2 break-words">{out}</div>;
}

/* ───────────── подсказки под экран ───────────── */

function suggestions(f: TutorFocus): string[] {
  switch (f.view) {
    case "read":
    case "video":
      return ["Объясни эту часть проще", "Главное из этой части за 5 пунктов", "Проверь моё понимание: задай 3 вопроса", "Пример из жизни к этой теме"];
    case "quiz":
      return f.quiz?.picked === undefined
        ? ["О чём этот вопрос? Без ответа", "Объясни понятие из вопроса"]
        : ["Почему верен этот ответ?", "Разбери мою ошибку", "Дай похожий вопрос"];
    case "result":
      return ["Что повторить после этого квиза?", "Проверь моё понимание по этой теме"];
    case "mock":
      return f.mock?.answer
        ? ["Проверь мой ответ по критериям", "Чего не хватает до полного балла?", "Покажи образцовый ответ"]
        : ["Подсказка, не ответ", "Как будут оценивать этот пункт?", "Покажи образцовый ответ"];
    case "trainer":
      return ["Подскажи первый шаг", "Где ошибка?", "Объясни формулу", "Дай похожую задачу"];
    case "bughunt":
      return f.bug?.line === undefined ? ["Подскажи, куда смотреть", "Какие баги бывают в таком коде?"] : ["Объясни этот баг", "Ещё пример такой ошибки"];
    case "sandbox":
      return ["Что делает этот конвейер?", "Почему получился такой результат?", "Как это спросят на экзамене?"];
    case "sheet":
    case "cards":
      return ["Проверь меня по шпаргалке", "Что из этого чаще всего спрашивают?"];
    default:
      return ["Что повторить сегодня?", "Составь план до экзамена", "Проверь меня по слабой теме", "Объясни самую сложную тему"];
  }
}

const VIEW_NAME: Record<string, string> = {
  map: "Маршрут ивента",
  read: "Конспект",
  video: "Видео-конспект",
  quiz: "Квиз",
  result: "Итоги квиза",
  mock: "Пробный вариант",
  trainer: "Тренажёр",
  bughunt: "Найди баг",
  sandbox: "Песочница OpenCV",
  sheet: "Шпаргалка",
  cards: "Карточки",
  game: "Игра",
};

/* ───────────── хранение переписки ───────────── */

const storeKey = (userId: string, eventId: string) => `yg-tutor:${userId}:${eventId}`;

function loadChat(key: string): Message[] {
  try {
    const raw = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(raw) ? raw.filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.text === "string").slice(-KEEP) : [];
  } catch {
    return [];
  }
}

function saveChat(key: string, list: Message[]) {
  try {
    if (list.length) localStorage.setItem(key, JSON.stringify(list.slice(-KEEP)));
    else localStorage.removeItem(key);
  } catch {
    /* переполнено или запрещено — переписка просто не переживёт перезагрузку */
  }
}

/* ───────────── компонент ───────────── */

export default function Tutor({ event, userId }: { event: StudyEvent; userId: string }) {
  const { base, detail, label, open, ask, setOpen } = useTutorFocus();
  const locale = useLocaleStore((s) => s.locale);
  const aiAllowed = usePersonalizationStore((s) => s.data?.ai === true);
  const key = storeKey(userId, event.id);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ text: string } | null>(null);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [consent, setConsent] = useState(false);
  const [screen, setScreen] = useState(true);
  const [quote, setQuote] = useState("");
  const [selection, setSelection] = useState("");
  const [copied, setCopied] = useState(-1);
  const [vv, setVv] = useState<{ height: number; bottom: number } | null>(null);
  // Панель — в портале: внутри страницы её перекрывали нижняя навигация и
  // подсказка установки (свой контекст наложения у обёртки страницы).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const panel = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const abort = useRef<AbortController | null>(null);
  const lastSelection = useRef<{ text: string; at: number }>({ text: "", at: 0 });
  const handledAsk = useRef(0);
  const messagesRef = useRef<Message[]>([]);
  messagesRef.current = messages;

  const focus: TutorFocus = { ...base, ...detail };
  const canSend = available === true && (aiAllowed || consent);

  useEffect(() => setMessages(loadChat(key)), [key]);

  // Есть ли ИИ — спрашиваем при первом открытии.
  useEffect(() => {
    if (!open || available !== null) return;
    void fetch("/api/study-events/tutor")
      .then((r) => r.json())
      .then((b: { available?: boolean }) => setAvailable(b.available === true))
      .catch(() => setAvailable(false));
  }, [open, available]);

  // Выделенный на странице текст (вне панели) — можно спросить про него.
  useEffect(() => {
    const onSelect = () => {
      const sel = window.getSelection();
      const text = sel?.toString().trim() ?? "";
      if (text && sel?.anchorNode && panel.current?.contains(sel.anchorNode)) return;
      setSelection(text.length > 2 ? text : "");
      if (text.length > 2) lastSelection.current = { text, at: Date.now() };
    };
    document.addEventListener("selectionchange", onSelect);
    return () => document.removeEventListener("selectionchange", onSelect);
  }, []);

  // Клавиатура на телефоне: держим шторку над ней (visualViewport).
  useEffect(() => {
    const view = window.visualViewport;
    if (!open || !view) return;
    const update = () => setVv({ height: view.height, bottom: Math.max(0, window.innerHeight - view.height - view.offsetTop) });
    update();
    view.addEventListener("resize", update);
    view.addEventListener("scroll", update);
    return () => {
      view.removeEventListener("resize", update);
      view.removeEventListener("scroll", update);
    };
  }, [open]);

  // На телефоне страница под шторкой не прокручивается.
  useEffect(() => {
    if (!open || !window.matchMedia("(max-width: 639px)").matches) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  // Прокрутка вниз за ответом, пока он печатается.
  useLayoutEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open, error]);

  useEffect(() => {
    const el = field.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
  }, [input, open]);

  const send = useCallback(
    async (raw: string, options: { replace?: boolean } = {}) => {
      const text = raw.trim();
      if (!text || busy) return;
      if (!canSend) {
        setInput(text);
        if (available === true) setError({ text: "Отметь галочку согласия ниже — и отправь ещё раз" });
        return;
      }
      const prev = messagesRef.current;
      const history: Message[] = options.replace ? prev.slice(0, -1) : [...prev, { role: "user", text }];
      setMessages([...history, { role: "assistant", text: "" }]);
      setInput("");
      setError(null);
      setBusy(true);
      const ctrl = new AbortController();
      abort.current = ctrl;
      let acc = "";
      const sentFocus: TutorFocus = screen ? { ...focus, selection: quote || undefined } : { selection: quote || undefined };
      try {
        const response = await fetch("/api/study-events/tutor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: ctrl.signal,
          body: JSON.stringify({
            eventId: event.id,
            focus: sentFocus,
            messages: history.slice(-SEND).map(({ role, text: t }) => ({ role, text: t })),
            lang: locale,
            consent: CONSENT,
          }),
        });
        if (!response.ok || !response.body) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.error || "Помощник не ответил — попробуй ещё раз");
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          const shown = acc;
          setMessages((m) => [...m.slice(0, -1), { role: "assistant", text: shown }]);
        }
        if (!acc.trim()) throw new Error("Помощник не ответил — попробуй ещё раз");
        const final: Message[] = [...history, { role: "assistant", text: acc }];
        setMessages(final);
        saveChat(key, final);
        setQuote("");
      } catch (e) {
        if (ctrl.signal.aborted && acc.trim()) {
          const final: Message[] = [...history, { role: "assistant", text: acc, stopped: true }];
          setMessages(final);
          saveChat(key, final);
        } else {
          // Ничего не пришло — возвращаем как было, вопрос — обратно в поле.
          setMessages(prev);
          if (!options.replace) setInput(text);
          if (!ctrl.signal.aborted) setError({ text: e instanceof TypeError || !(e instanceof Error) ? "Нет связи — проверь интернет" : e.message });
        }
      } finally {
        setBusy(false);
        abort.current = null;
      }
    },
    // focus пересобирается каждый рендер; всё, что нужно, в списке
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [busy, canSend, available, screen, quote, event.id, locale, key, base, detail],
  );

  // Вопрос из другого экрана («✦ Спросить помощника», «Подсказка от ИИ»).
  useEffect(() => {
    if (!open || !ask || ask.at === handledAsk.current || available === null) return;
    handledAsk.current = ask.at;
    if (canSend) void send(ask.text);
    else setInput(ask.text);
  }, [open, ask, available, canSend, send]);

  function openPanel() {
    const recent = selection || (Date.now() - lastSelection.current.at < 4000 ? lastSelection.current.text : "");
    if (recent) setQuote(recent.slice(0, 800));
    setOpen(true);
    if (window.matchMedia("(pointer: fine)").matches) window.setTimeout(() => field.current?.focus(), 250);
  }

  function clear() {
    if (busy) abort.current?.abort();
    setMessages([]);
    saveChat(key, []);
    setError(null);
  }

  async function copy(text: string, n: number) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(n);
      window.setTimeout(() => setCopied(-1), 1500);
    } catch {
      /* без буфера обмена — ничего страшного */
    }
  }

  const where = VIEW_NAME[focus.view ?? "map"] ?? "Ивент";
  const what = focus.view === "mock" || focus.view === "trainer" || focus.view === "bughunt" || focus.view === "quiz" ? label : "";
  const tips = quote ? ["Объясни выделенное", ...suggestions(focus).slice(0, 2)] : suggestions(focus);
  const mobile = typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches;

  if (!mounted) return null;
  return createPortal(
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            key="fab"
            type="button"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={openPanel}
            aria-label="Открыть ИИ-помощника"
            className="press fixed bottom-[calc(6rem+var(--install-offset,0px))] right-4 z-40 flex h-12 items-center gap-2 rounded-full bg-gradient-to-br from-violet-500 to-sky-500 px-4 font-semibold text-white shadow-[0_10px_28px_-6px_rgba(124,58,237,0.6)] lg:bottom-6"
          >
            <span aria-hidden className="text-lg leading-none">✦</span>
            <span className={cn("text-sm", !selection && "hidden sm:inline")}>{selection ? "Спросить про выделенное" : "Помощник"}</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-[69] bg-black/40 sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="panel"
              ref={panel}
              role="dialog"
              aria-label="ИИ-помощник"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 340 }}
              style={mobile && vv ? { bottom: vv.bottom, height: Math.min(vv.height - 8, Math.round(vv.height * 0.92)) } : undefined}
              className="fixed inset-x-0 bottom-0 z-[70] flex h-[88dvh] flex-col overflow-hidden rounded-t-3xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-2xl sm:inset-x-auto sm:bottom-4 sm:right-4 sm:h-[min(720px,calc(100dvh-2rem))] sm:w-[420px] sm:rounded-3xl"
            >
              <header className="flex items-start gap-3 border-b border-[var(--color-border)] px-4 pb-3 pt-3">
                <div aria-hidden className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-sky-500 text-white">✦</div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold leading-tight">ИИ-помощник</p>
                  <button
                    type="button"
                    onClick={() => setScreen((s) => !s)}
                    aria-pressed={screen}
                    title={screen ? "Нажми, чтобы не передавать экран" : "Нажми, чтобы помощник видел экран"}
                    className={cn("mt-1 flex max-w-full items-center gap-1.5 rounded-full px-2 py-0.5 text-xs", screen ? "bg-violet-500/15 text-[var(--color-fg)]" : "bg-[var(--color-surface-2)] text-[var(--color-muted)] line-through")}
                  >
                    <span aria-hidden>{screen ? "👁" : "🚫"}</span>
                    <span className="truncate">
                      Видит: {where}
                      {what && <span lang="en"> · {what}</span>}
                      {!what && focus.step && focus.view !== "mock" && <span lang="en"> · {focus.step}</span>}
                    </span>
                  </button>
                </div>
                {messages.length > 0 && (
                  <button type="button" onClick={clear} className="rounded-full px-2 py-1.5 text-xs text-[var(--color-muted)] hover:bg-[var(--color-surface-2)]">
                    Новый чат
                  </button>
                )}
                <button type="button" onClick={() => setOpen(false)} aria-label="Закрыть помощника" className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface-2)] text-lg leading-none">
                  ×
                </button>
              </header>

              <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4 text-[14.5px] leading-relaxed">
                {messages.length === 0 && (
                  <div className="space-y-3 pt-2">
                    <p className="text-[15px]">Я вижу, что у тебя открыто, и помогу с подготовкой: объясню проще, подскажу шаг, проверю ответ или устрою мини-опрос.</p>
                    <p className="text-sm text-[var(--color-muted)]">Выдели текст в конспекте — и спроси про него. Переписка хранится только на этом устройстве.</p>
                    <div className="grid gap-2">
                      {tips.map((t) => (
                        <button key={t} type="button" disabled={busy || available === false} onClick={() => void send(t)} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5 text-left text-sm transition hover:border-violet-400/60 disabled:opacity-50">
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((m, n) =>
                  m.role === "user" ? (
                    <div key={n} className="flex justify-end">
                      <div lang={locale} className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-violet-500/25 px-3.5 py-2">{m.text}</div>
                    </div>
                  ) : (
                    <div key={n} className="group space-y-1">
                      <div lang={locale} className="max-w-[95%] rounded-2xl rounded-bl-md bg-[var(--color-surface-2)] px-3.5 py-2.5">
                        {m.text ? <TutorText text={m.text} /> : <span className="inline-flex gap-1 py-1" aria-label="Помощник печатает"><Dot d={0} /><Dot d={0.15} /><Dot d={0.3} /></span>}
                        {busy && n === messages.length - 1 && m.text && <span aria-hidden className="ml-0.5 inline-block h-4 w-1.5 animate-pulse rounded-sm bg-violet-400 align-middle" />}
                        {m.stopped && <p className="mt-1 text-xs text-[var(--color-muted)]">Остановлено</p>}
                      </div>
                      {m.text && !(busy && n === messages.length - 1) && (
                        <div className="flex gap-3 pl-1 text-xs text-[var(--color-muted)]">
                          <button type="button" onClick={() => void copy(m.text, n)} className="hover:text-[var(--color-fg)]">{copied === n ? "Скопировано" : "Копировать"}</button>
                          {n === messages.length - 1 && !busy && (
                            <button type="button" onClick={() => void send(messages[n - 1]?.text ?? "", { replace: true })} className="hover:text-[var(--color-fg)]">Ответить иначе</button>
                          )}
                        </div>
                      )}
                    </div>
                  ),
                )}

                {error && (
                  <div role="alert" className="flex flex-wrap items-center gap-2 rounded-2xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm">
                    <span className="flex-1">{error.text}</span>
                    {input.trim() && canSend && !busy && (
                      <button type="button" className="font-semibold underline" onClick={() => void send(input)}>Повторить</button>
                    )}
                  </div>
                )}
                {available === false && <p role="status" className="rounded-2xl bg-[var(--color-surface-2)] px-3 py-2 text-sm">ИИ ещё не подключён — помощник заработает, как только его включат.</p>}
              </div>

              <footer className="space-y-2 border-t border-[var(--color-border)] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
                {messages.length > 0 && (
                  <div className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-0.5 [scrollbar-width:none]">
                    {tips.map((t) => (
                      <button key={t} type="button" disabled={busy || available === false} onClick={() => void send(t)} className="shrink-0 rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs transition hover:border-violet-400/60 disabled:opacity-50">
                        {t}
                      </button>
                    ))}
                  </div>
                )}
                {quote && (
                  <div className="flex items-start gap-2 rounded-xl bg-violet-500/10 px-3 py-1.5 text-xs">
                    <span className="shrink-0 font-semibold">Выделено:</span>
                    <span lang="en" className="line-clamp-2 flex-1 italic">«{quote}»</span>
                    <button type="button" aria-label="Убрать выделенное" onClick={() => setQuote("")} className="shrink-0 text-base leading-none">×</button>
                  </div>
                )}
                {available === true && !aiAllowed && (
                  <label className="flex items-start gap-2 px-1 text-xs text-[var(--color-muted)]">
                    <input type="checkbox" className="mt-0.5" checked={consent} onChange={(e) => { setConsent(e.target.checked); if (e.target.checked) setError(null); }} />
                    <span>Отправлять мой вопрос и то, что открыто на экране, в OpenAI для ответа. Ничего не хранится на сервере.</span>
                  </label>
                )}
                <form
                  className="flex items-end gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void send(input);
                  }}
                >
                  <textarea
                    ref={field}
                    value={input}
                    rows={1}
                    maxLength={2000}
                    lang={locale}
                    aria-label="Вопрос помощнику"
                    placeholder={quote ? "Что непонятно в выделенном?" : "Спроси что угодно по теме…"}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && window.matchMedia("(pointer: fine)").matches) {
                        e.preventDefault();
                        void send(input);
                      }
                    }}
                    className="max-h-[132px] min-h-11 flex-1 resize-none rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3.5 py-2.5 text-[16px] leading-snug outline-none focus:border-violet-400/70"
                  />
                  {busy ? (
                    <button type="button" onClick={() => abort.current?.abort()} aria-label="Остановить ответ" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-2)] text-sm">
                      ■
                    </button>
                  ) : (
                    <button type="submit" disabled={!input.trim() || available === false} aria-label="Отправить" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-sky-500 text-lg font-bold text-white disabled:opacity-40">
                      ↑
                    </button>
                  )}
                </form>
              </footer>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>,
    document.body,
  );
}

function Dot({ d }: { d: number }) {
  return (
    <motion.span
      className="h-1.5 w-1.5 rounded-full bg-[var(--color-muted)]"
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1, repeat: Infinity, delay: d }}
    />
  );
}
