"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { LEVELS, blocksFor, clockText, dayIndex, defaultWindows, localDay, plusDays, stats, parseBrief, type Brief, type Level, type Plan30, type Block } from "@/lib/challenge30";
import { isTodoOnDay, useUserStore } from "@/store/useUserStore";
import { useSyncStatus } from "@/store/useSyncStatus";
import { isLmsDeadline } from "@/lib/lmsEventKind";
const field = "mt-2 min-w-0 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 text-base";
const panel = "rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5";
const hours = (minutes: number) => Math.round(minutes / 6) / 10;
const weekdays = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
type Data = { plan: Plan30 | null; revision: number; available: boolean; remaining: number; today: string; busy: boolean };
export default function Page() {
  const { data, status } = useSession();
  if (status === "loading") return <p>Открываем челлендж…</p>;
  if (!data?.user?.id) return <Link href="/login">Войти в аккаунт</Link>;
  return <Challenge key={data.user.id} />;
}
function Challenge() {
  const [data, setData] = useState<Data | null>(null); const [error, setError] = useState(""); const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  const alive = useRef(true); const operation = useRef(false); const ownWindows = useRef(false); // hand-edited windows are never replaced by level defaults
  const [brief, setBrief] = useState<Brief>({ level: "easy", goals: "", baseline: "", preferences: "", timezone: "Asia/Almaty", windows: defaultWindows("easy") });
  const [consent, setConsent] = useState(false); const [day, setDay] = useState(0); const [offset, setOffset] = useState(1);
  async function load() {
    try { const r = await fetch("/api/challenge30", { cache: "no-store" }); const d = await r.json(); if (!r.ok) throw new Error(d.error); if (alive.current) setData(d); }
    catch (e) { if (alive.current) setError((e as Error).message); }
  }
  useEffect(() => { alive.current = true; setBrief(b => ({ ...b, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Almaty" })); void load(); return () => { alive.current = false; }; }, []);
  useEffect(() => { const draft = data?.plan; if (draft && !draft.startDate) { ownWindows.current = true; setBrief(draft.brief); } }, [data?.plan?.id]); // editing a draft continues from its answers, not from an empty form
  useEffect(() => { if (data?.plan?.startDate) setDay(Math.min(29, Math.max(0, dayIndex(data.plan.startDate, data.today)))); }, [data?.plan?.id, data?.plan?.startDate]); // choose today's tab on opening/start only
  async function act(body: Record<string, unknown>) {
    if (!data || operation.current) return;
    operation.current = true; setBusy(true); setError(""); setMessage("");
    try {
      const r = await fetch("/api/challenge30", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, revision: data.revision, planId: data.plan?.id }) });
      const d = await r.json(); if (!r.ok) throw new Error(d.error);
      if (alive.current) setData(d); return d as Data;
    } catch (e) { if (alive.current) { setError((e as Error).message); await load(); } }
    finally { operation.current = false; if (alive.current) setBusy(false); }
  }
  async function generate(e: React.FormEvent) {
    e.preventDefault(); if (!consent) return;
    try { parseBrief(brief); } catch (e) { setError((e as Error).message); return; }
    setConsent(false);
    const result = await act({ action: "generate", brief, consent: "challenge30-v1" });
    if (result) { setDay(0); setMessage("План готов. Посмотри расписание и выбери дату старта."); }
  }
  const p = data?.plan; const start = p?.startDate ?? plusDays(localDay(p?.brief.timezone ?? brief.timezone), offset);
  const blocks = p ? blocksFor(p, day, start) : []; const target = LEVELS[p?.brief.level ?? brief.level].minutes;
  const st = useMemo(() => p ? stats(p, start) : null, [p, start]); const total = st?.successes ?? 0; const elapsed = p?.startDate ? dayIndex(p.startDate, data!.today) : -1;
  const editable = !!p?.startDate && day <= elapsed && day >= elapsed - 1 && elapsed < 31;
  function setWindow(d: number, i: number, part: "start" | "end", value: string) {
    const [h, m] = value.split(":").map(Number); ownWindows.current = true; setBrief(b => ({ ...b, windows: b.windows.map((ws, di) => di === d ? ws.map((w, wi) => wi === i ? { ...w, [part]: h * 60 + m } : w) : ws) }));
  }
  async function addToPlan() {
    if (!p?.startDate || day !== elapsed || operation.current) return;
    if (Intl.DateTimeFormat().resolvedOptions().timeZone !== p.brief.timezone) { setError("Для переноса в дневной план часовой пояс устройства должен совпадать с часовым поясом челленджа."); return; }
    const date = plusDays(p.startDate, day); let added = 0, skipped = 0;
    for (const b of blocks) {
      const marker = `[challenge30:${p.id}:${b.id}]`; const store = useUserStore.getState();
      if (store.todos.some(t => t.note?.includes(marker))) continue;
      if (store.todos.some(t => !isLmsDeadline(t) && isTodoOnDay(t, date) && t.hour !== undefined && b.start < t.hour * 60 + (t.minute ?? 0) + (t.duration ?? 60) && b.start + b.minutes > t.hour * 60 + (t.minute ?? 0))) { skipped++; continue; }
      store.addTodo({ title: b.title, date, hour: Math.floor(b.start / 60), minute: b.start % 60, duration: b.minutes, note: `${b.detail}\nФактическое время отметь в «Челлендж 30». ${marker}` }); added++;
    }
    await useSyncStatus.getState().syncNow?.(); setMessage(`Добавлено в дневной план: ${added}. Пересечения пропущены: ${skipped}. Повторные занятия не добавляются.`);
  }
  return <div className="mx-auto max-w-4xl space-y-5 pb-6">
    <header><Link href="/learn" className="text-sm underline">← Учёба и цели</Link><h1 className="ios-title mt-3">Челлендж 30</h1><p className="mt-2 text-[var(--color-muted)]">Месяц для того, что важно тебе.</p></header>
    {error && <p role="alert" className="rounded-2xl border border-red-400/50 p-4 text-sm">{error} <button className="underline" disabled={busy} onClick={() => void load()}>Обновить</button></p>}
    {message && <p role="status" className={panel}>{message}</p>}
    {!data ? <p>Загружаем челлендж…</p> : <>
      {!p?.startDate && <form onSubmit={generate} className={`${panel} space-y-5`}>
        <h2 className="text-xl font-bold">{p ? "Изменить черновик" : "Каким будет твой месяц?"}</h2>
        <fieldset disabled={busy || data.busy} className="space-y-5">
          <div className="grid grid-cols-3 gap-2">{(Object.keys(LEVELS) as Level[]).map(level => <button type="button" key={level} aria-pressed={brief.level === level} onClick={() => setBrief(b => ({ ...b, level, windows: ownWindows.current ? b.windows : defaultWindows(level) }))} className={`rounded-2xl border p-3 text-left ${brief.level === level ? "border-violet-400 bg-violet-500/15" : "border-[var(--color-border)]"}`}><span className="block text-sm">{LEVELS[level].label}</span><strong className="mt-2 block text-2xl">{LEVELS[level].minutes / 60} ч</strong><span className="text-xs text-[var(--color-muted)]">в день</span></button>)}</div>
          <p className="text-sm text-[var(--color-muted)]">Это суммарное время на учёбу, проекты, спорт и другие важные дела. Перерывы не засчитываются. {brief.level === "hard" && "12 часов требуют почти целого свободного дня: выбирай этот режим, только если он помещается вместе со сном и отдыхом."}</p>
          <label className="block text-sm">Что хочешь улучшить за 30 дней?<textarea required minLength={10} maxLength={600} rows={3} className={field} value={brief.goals} onChange={e => setBrief(b => ({ ...b, goals: e.target.value }))} placeholder="Например: разобраться в Python, подтянуть английский и больше двигаться. Python важнее всего." /></label>
          <label className="block text-sm">С чего начинаешь?<textarea required minLength={3} maxLength={300} rows={2} className={field} value={brief.baseline} onChange={e => setBrief(b => ({ ...b, baseline: e.target.value }))} placeholder="Python с нуля, английский A2, пока мало активности…" /></label>
          <label className="block text-sm">Что учитывать? · необязательно<textarea maxLength={300} rows={2} className={field} value={brief.preferences} onChange={e => setBrief(b => ({ ...b, preferences: e.target.value }))} placeholder="Люблю практику, занимаюсь дома, нужны небольшие шаги…" /></label>
          <details><summary className="cursor-pointer font-semibold">Свободное время по дням недели</summary><p className="mt-2 text-xs text-[var(--color-muted)]">Укажи окна без пар, работы, дороги и сна. Они повторяются каждую неделю. ИИ не читает твой календарь; проверь занятость сам. Занятия идут по 45 минут с перерывами по 10 минут. При смене уровня окна подстраиваются сами, пока ты не изменил их вручную.</p>
            <Button type="button" size="sm" className="mt-3 h-auto min-h-9 whitespace-normal" onClick={() => { ownWindows.current = true; setBrief(b => ({ ...b, windows: b.windows.map(() => b.windows[0].map(w => ({ ...w }))) })); }}>Скопировать понедельник на все дни</Button>
            {brief.windows.map((ws, d) => <div key={d} className="mt-4 border-b border-[var(--color-border)] pb-3"><p className="text-sm font-semibold">{weekdays[d]}</p>{ws.map((w, i) => <div key={i} className="mt-2 flex min-w-0 items-center gap-2"><input aria-label={`${weekdays[d]} начало ${i + 1}`} type="time" required className={`${field} mt-0 flex-1 p-2`} value={clockText(w.start)} onChange={e => setWindow(d, i, "start", e.target.value)} /><span>—</span><input aria-label={`${weekdays[d]} конец ${i + 1}`} type="time" required className={`${field} mt-0 flex-1 p-2`} value={clockText(w.end)} onChange={e => setWindow(d, i, "end", e.target.value)} />{ws.length > 1 && <button type="button" aria-label="Удалить окно" onClick={() => { ownWindows.current = true; setBrief(b => ({ ...b, windows: b.windows.map((list, di) => di === d ? list.filter((_, wi) => wi !== i) : list) })); }}>×</button>}</div>)}{ws.length < 3 && <button type="button" className="mt-2 text-xs underline" onClick={() => { ownWindows.current = true; setBrief(b => ({ ...b, windows: b.windows.map((list, di) => di === d ? [...list, { start: 8 * 60, end: 10 * 60 }] : list) })); }}>+ Ещё окно</button>}</div>)}
          </details>
          <label className="block text-sm">Часовой пояс<input className={field} required value={brief.timezone} onChange={e => setBrief(b => ({ ...b, timezone: e.target.value }))} maxLength={80} /></label>
          <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-1" /><span>Разрешаю отправить цели, исходный уровень, предпочтения и выбранную сложность в OpenAI для создания этого плана. <Link href="/privacy" className="underline">Политика</Link></span></label>
          <p className="text-xs text-[var(--color-muted)]">Одна генерация — основа на весь месяц. Дни, отметки и просмотр не расходуют токены. Осталось попыток сегодня: {data.remaining}/2. Повторная генерация заменит только черновик.</p>
          <Button type="submit" variant="primary" className="w-full" disabled={!consent || !data.available || data.remaining === 0}>{busy || data.busy ? "Составляем план…" : "Создать мой план"}</Button>
          {!data.available && <p role="status">ИИ пока не подключён на сервере.</p>}
        </fieldset>
      </form>}
      {data.busy && !busy && <Button onClick={() => void load()}>План создаётся — обновить</Button>}
      {p && <>
        <section className="rounded-3xl border border-violet-400/30 bg-gradient-to-br from-violet-500/15 to-sky-500/10 p-5">
          <p className="text-xs uppercase tracking-widest">{p.startDate ? "Твой маршрут" : "Предпросмотр · ещё не начат"} · {LEVELS[p.brief.level].label}</p><h2 className="mt-3 text-2xl font-bold">{p.recipe.title}</h2><p className="mt-3 text-sm leading-relaxed">{p.recipe.summary}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm"><span>{target / 60} ч в день</span><span>{total}/30 дней зачтено</span><span>{hours(st?.total ?? 0)} ч отмечено</span></div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--color-surface-2)]"><div className="h-full rounded-full bg-violet-400" style={{ width: `${total / 30 * 100}%` }} /></div>
          {p.startDate ? <p className="mt-3 text-xs">{p.startDate} — {plusDays(p.startDate, 29)} · {p.brief.timezone}{elapsed >= 30 ? " · 30 дней завершены" : elapsed < 0 ? " · Старт завтра" : ` · Сейчас день ${elapsed + 1}`}</p> : <div className="mt-4 flex flex-wrap gap-3"><label className="text-sm">Начать<select className={field} value={offset} onChange={e => setOffset(Number(e.target.value))}><option value={1}>Завтра</option><option value={0}>Сегодня</option></select></label><Button className="self-end" variant="primary" disabled={busy || data.busy} onClick={() => void act({ action: "start", offset })}>Начать 30 дней</Button></div>}
          <div className="mt-4 flex flex-wrap gap-2 text-xs">{[[1, "Первый шаг"], [7, "Неделя в ритме"], [15, "Экватор"], [30, "Все 30!"]].map(([n, title]) => <span key={n} className={`rounded-full border px-3 py-2 ${total >= Number(n) ? "border-violet-400 bg-violet-500/20" : "border-[var(--color-border)] text-[var(--color-muted)]"}`}>{total >= Number(n) ? "✓" : "◇"} {title} · {n}</span>)}</div>
        </section>
        <section className={panel}><h2 className="font-semibold">Твои 30 дней</h2><p className="mt-2 text-xs text-[var(--color-muted)]">Пропуск не обнуляет прогресс. Зачёт — за фактически отмеченное время; за сегодня и вчера можно исправить минуты. Это личный учёт, без проверки таймером.</p><div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10">{Array.from({ length: 30 }, (_, i) => <button key={i} aria-label={`День ${i + 1}`} aria-pressed={day === i} onClick={() => setDay(i)} className={`aspect-square rounded-xl border text-sm ${day === i ? "border-violet-400 ring-1 ring-violet-400" : "border-[var(--color-border)]"} ${st!.days[i] >= target ? "bg-emerald-500/20" : "bg-[var(--color-surface-2)]"}`}>{i + 1}{st!.days[i] >= target && " ✓"}</button>)}</div></section>
        {p.startDate && st && <section className={panel}><h2 className="font-semibold">Аналитика</h2>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">{[["Всего", `${hours(st.total)} ч`], ["Зачтено дней", `${total}/30`], ["Лучшая серия", `${st.streak} дн.`], ["В среднем за день", `${hours(st.total / Math.min(30, Math.max(1, elapsed + 1)))} ч`]].map(([name, value]) => <div key={name} className="rounded-2xl bg-[var(--color-surface-2)] p-3"><dt className="text-xs text-[var(--color-muted)]">{name}</dt><dd className="mt-1 text-lg font-bold">{value}</dd></div>)}</dl>
          <div role="img" aria-label="Отмеченное время по дням челленджа" className="mt-4 flex h-20 items-end gap-0.5">{st.days.map((n, i) => <div key={i} title={`День ${i + 1}: ${n} мин`} className={`flex-1 rounded-sm ${n >= target ? "bg-emerald-400" : n ? "bg-violet-400" : "bg-[var(--color-surface-2)]"}`} style={{ height: `${Math.max(6, Math.min(100, n / target * 100))}%` }} />)}</div>
          <p className="mt-2 text-xs text-[var(--color-muted)]">Столбик — день; зелёный — норма {target / 60} ч выполнена.</p>
          <ul className="mt-4 space-y-3">{st.activities.map((a, i) => <li key={i} className="text-sm"><div className="flex justify-between gap-3"><span className="min-w-0 break-words">{a.title}</span><span className="shrink-0 text-[var(--color-muted)]">{hours(a.done)} из {hours(a.planned)} ч</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--color-surface-2)]"><div className="h-full rounded-full bg-violet-400" style={{ width: `${a.planned ? Math.min(100, a.done / a.planned * 100) : 0}%` }} /></div></li>)}</ul>
        </section>}
        <section className={`${panel} space-y-4`}><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold">День {day + 1} · {plusDays(start, day)}</h2><p className="text-sm text-[var(--color-muted)]">Неделя {Math.min(4, Math.floor(day / 7) + 1)} · {st!.days[day]}/{target} мин</p></div>{p.startDate && day === elapsed && <Button size="sm" disabled={busy} onClick={() => void addToPlan()}>В дневной план</Button>}</div>
          {blocks.map(b => <BlockCard key={`${p.id}:${b.id}`} block={b} minutes={p.logs[b.id] ?? 0} disabled={busy || !editable} save={minutes => void act({ action: "log", day, blockId: b.id, minutes })} />)}
          <p className="text-xs text-[var(--color-muted)]">Перерывы остаются между блоками. Отметки в дневном плане и минуты челленджа ведутся отдельно.</p>
        </section>
        <Button variant="danger" disabled={busy} className="h-auto min-h-11 whitespace-normal" onClick={() => { if (confirm("Удалить этот челлендж и все его отметки? Занятия, уже добавленные в дневной план, останутся. Это действие нельзя отменить.")) void act({ action: "delete", confirm: true }); }}>Удалить челлендж и начать заново</Button>
      </>}
    </>}
  </div>;
}
function BlockCard({ block, minutes, disabled, save }: { block: Block; minutes: number; disabled: boolean; save: (n: number) => void }) {
  const [value, setValue] = useState(String(minutes)); useEffect(() => setValue(String(minutes)), [minutes]);
  return <article className="rounded-2xl border border-[var(--color-border)] p-4"><p className="text-xs text-[var(--color-muted)]">{clockText(block.start)}–{clockText(block.start + block.minutes)} · {block.minutes} мин</p><h3 className="mt-2 font-semibold">{block.title}</h3><p className="mt-2 whitespace-pre-wrap break-words text-sm">{block.detail}</p><div className="mt-3 flex flex-wrap items-end gap-2"><label className="text-xs">Сделано, мин<input aria-label={`Минуты: ${block.title}`} type="number" min={0} max={block.minutes} step={1} className={`${field} w-24`} disabled={disabled} value={value} onChange={e => setValue(e.target.value)} /></label><Button size="sm" disabled={disabled || value === "" || !Number.isInteger(Number(value)) || Number(value) < 0 || Number(value) > block.minutes} onClick={() => save(Number(value))}>Сохранить</Button><button className="px-1 py-2 text-sm underline disabled:opacity-40" disabled={disabled} onClick={() => save(minutes === block.minutes ? 0 : block.minutes)}>{minutes === block.minutes ? "✓ Отменить" : "Весь блок"}</button></div></article>;
}
