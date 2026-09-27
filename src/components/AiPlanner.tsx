"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useUserStore, isTodoOnDay } from "@/store/useUserStore";
import { useSyncStatus } from "@/store/useSyncStatus";
import { parseAiResult, prepareAiTodos, sameAiTodo, type AiMode, type AiResult } from "@/lib/aiPlanner";

const input = "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 text-[16px]";
export default function AiPlanner({ day }: { day: string }) {
  const { data: session, status } = useSession();
  const [mode, setMode] = useState<AiMode>("schedule");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [weekly, setWeekly] = useState(true);
  const [auto, setAuto] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [warnings, setWarnings] = useState<string[]>([]);
  const [preview, setPreview] = useState<AiResult | null>(null);
  const [added, setAdded] = useState<string[]>([]);
  const [available, setAvailable] = useState<boolean | null>(null);
  const owner = useRef(session?.user?.id); owner.current = session?.user?.id;
  const pending = useRef<AbortController | null>(null);
  const requestSettings = useRef({ mode, day, weekly });
  useEffect(() => {
    pending.current?.abort(); setBusy(false); setPreview(null); setAdded([]); setMessage(""); setError(""); setWarnings([]); setAvailable(null); setFile(null); setText("");
    if (status !== "authenticated") return;
    const controller = new AbortController();
    fetch("/api/ai/planner", { signal: controller.signal, cache: "no-store" }).then(async r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(v => { if (!controller.signal.aborted) setAvailable(v.available); })
      .catch(() => { if (!controller.signal.aborted) setError("Не удалось проверить доступность ИИ. Обнови страницу."); });
    return () => { controller.abort(); pending.current?.abort(); };
  }, [session?.user?.id, status]);

  async function apply(result: AiResult) {
    const config = requestSettings.current;
    const prepared = prepareAiTodos(result, config.mode, config.day, config.weekly);
    const ids: string[] = []; let skipped = 0;
    for (const todo of prepared.todos) {
      const store = useUserStore.getState();
      if (store.todos.some(existing => sameAiTodo(existing, todo))) { skipped++; continue; }
      store.addTodo(todo);
      ids.push(useUserStore.getState().todos[0].id);
    }
    setWarnings(prepared.warnings); setAdded(ids); setPreview(null);
    setMessage(`${result.message}\nДобавлено: ${ids.length}. Уже были в расписании: ${skipped}.`);
    if (ids.length) await useSyncStatus.getState().syncNow?.();
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    pending.current?.abort();
    const controller = new AbortController(); pending.current = controller;
    const user = owner.current;
    requestSettings.current = { mode, day, weekly };
    setBusy(true); setError(""); setMessage(""); setWarnings([]); setPreview(null); setAdded([]);
    try {
      let image: string | undefined;
      if (file && mode === "schedule") {
        if (file.size > 5_000_000) throw new Error("Максимальный размер скрина — 5 МБ");
        image = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error("Не удалось прочитать скрин")); reader.readAsDataURL(file); });
      }
      const context = mode === "advice" ? JSON.stringify(useUserStore.getState().todos.filter(t => isTodoOnDay(t, day)).slice(0, 60).map(t => ({ title: t.title.slice(0, 200), hour: t.hour, minute: t.minute, duration: t.duration, done: t.done || t.doneDays.includes(day) }))) : "";
      const response = await fetch("/api/ai/planner", { method: "POST", signal: controller.signal, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode, date: day, text, image, context }) });
      const body = await response.json();
      if (controller.signal.aborted || owner.current !== user) return;
      if (!response.ok) throw new Error(body.error || "ИИ временно недоступен");
      const result = parseAiResult(body);
      setWarnings(result.warnings); setMessage(result.message);
      if (mode !== "advice" && result.items.length) {
        if (auto) await apply(result); else setPreview(result);
      }
    } catch (e) { if (!controller.signal.aborted && owner.current === user) setError(e instanceof Error ? e.message : "Нет связи с сервером"); }
    finally { if (pending.current === controller) setBusy(false); }
  }
  async function undo() {
    added.forEach(id => useUserStore.getState().removeTodo(id));
    setAdded([]); setMessage("Добавление отменено.");
    await useSyncStatus.getState().syncNow?.();
  }
  return <details className="surface rounded-3xl p-4">
    <summary className="cursor-pointer text-base font-semibold">ИИ-помощник · расписание со скрина</summary>
    <p className="mt-2 text-sm text-[var(--color-muted)]">Распознаёт пары, создаёт задачи из текста и помогает спланировать день.</p>
    {status !== "authenticated" ? <Link className="mt-3 block underline" href="/login?callbackUrl=%2Fcalendar">Войти для использования ИИ</Link> : <form onSubmit={submit} className="mt-4 space-y-3">
      {available === false && <p role="status" className="text-sm">ИИ ещё не подключён на сервере.</p>}
      <label className="block text-sm">Что сделать<select className={`${input} mt-1`} value={mode} disabled={busy} onChange={e => { setMode(e.target.value as AiMode); setPreview(null); }}>
        <option value="schedule">Импортировать расписание</option><option value="tasks">Создать задачи из текста</option><option value="advice">Помочь с планом дня</option>
      </select></label>
      <p className="text-sm">Выбранная дата: {day}. {mode === "schedule" ? "Дни недели без дат относятся к этой неделе." : "Относительные даты считаются от неё."}</p>
      {mode === "schedule" && <>
        <label className="block text-sm">Скрин расписания (PNG, JPEG, WebP; до 5 МБ)<input className={`${input} mt-1`} type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={e => { setFile(e.target.files?.[0] ?? null); setPreview(null); }} /></label>
        <label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={weekly} disabled={busy} onChange={e => setWeekly(e.target.checked)} />Повторять пары каждую неделю, если на скрине нет конкретных дат</label>
      </>}
      <label className="block text-sm">{mode === "schedule" ? "Уточнение или расписание текстом" : "Твой запрос"}<textarea className={`${input} mt-1`} rows={3} maxLength={4000} value={text} disabled={busy} onChange={e => setText(e.target.value)} placeholder={mode === "schedule" ? "Моя группа CS-2401. Импортируй только её пары." : mode === "tasks" ? "Завтра в 18:30 подготовить доклад, в пятницу сдать лабораторную" : "Как распределить нагрузку сегодня?"} /></label>
      {mode !== "advice" && <label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={auto} disabled={busy} onChange={e => setAuto(e.target.checked)} />Сразу добавить результат в расписание</label>}
      <p className="text-xs text-[var(--color-muted)]">Скрин и запрос отправляются в OpenAI для обработки. Для совета по дню также передаются задачи выбранного дня.</p>
      <Button type="submit" variant="primary" disabled={busy || available !== true}>{busy ? "ИИ обрабатывает…" : "Выполнить"}</Button>
    </form>}
    {error && <p role="alert" className="mt-3 text-sm text-[var(--color-strength)]">{error}</p>}
    {message && <p role="status" className="mt-3 whitespace-pre-wrap text-sm">{message}</p>}
    {warnings.length > 0 && <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">{warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>}
    {preview && <div className="mt-3 space-y-2">
      <ul className="space-y-2 text-sm">{preview.items.map((item, i) => <li key={i}>{item.title} · {item.date ?? ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][item.weekday ?? 0]} {item.start} {item.end && `– ${item.end}`} {item.note}</li>)}</ul>
      <Button disabled={busy} onClick={() => void apply(preview)}>Добавить в расписание</Button>
    </div>}
    {added.length > 0 && <Button className="mt-3" onClick={() => void undo()}>Отменить добавление ({added.length})</Button>}
  </details>;
}
