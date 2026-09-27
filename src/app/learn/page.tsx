"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useLearningStore } from "@/store/useLearningStore";
import { useLearningActions } from "@/components/useLearningActions";
import { rewardFor } from "@/lib/learning";
import { dateKey } from "@/lib/domain";
import { isTodoOnDay, useUserStore } from "@/store/useUserStore";
import { useSyncStatus } from "@/store/useSyncStatus";

const field = "mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 text-[16px]";
export default function LearningPage() {
  const { owner, busy, error, action } = useLearningActions();
  const data = useLearningStore(s => s.owner === owner ? s.data : null);
  const loadError = useLearningStore(s => s.error);
  const [goal, setGoal] = useState("");
  const [minutes, setMinutes] = useState(20);
  const [selected, setSelected] = useState("");
  const [questId, setQuestId] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => { setGoal(""); setSelected(""); setQuestId(""); setAnswer(""); setMessage(""); }, [owner]);
  const skill = data?.skills.find(s => s.id === selected) ?? data?.skills.find(s => s.quests.some(q => !q.completed)) ?? data?.skills[0];
  const quest = skill?.quests.find(q => q.id === questId) ?? skill?.quests.find(q => !q.completed) ?? skill?.quests.at(-1);
  const complete = skill?.quests.filter(q => q.completed).length ?? 0;
  async function create(event: React.FormEvent) {
    event.preventDefault(); setMessage("");
    const result = await action({ action: "create", goal, minutes, requestId: crypto.randomUUID() });
    if (result) { setSelected(result.skillId); setQuestId(""); setAnswer(""); setGoal(""); setMessage("Маршрут готов. Начни с первого квеста."); }
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault(); if (!skill || !quest) return;
    setQuestId(quest.id);
    const result = await action({ action: "answer", skillId: skill.id, questId: quest.id, answer });
    if (result) setMessage(result.result.awarded ? `Квест пройден! +${result.result.xp} XP · +${result.result.coins} монет` : result.result.passed ? "Этот квест уже пройден — награда сохранена." : "Пока не зачтено. Посмотри подсказку и попробуй ещё раз — монеты не теряются.");
  }
  async function schedule() {
    if (!skill || !quest) return;
    const day = dateKey(); const store = useUserStore.getState(); const title = `Учёба: ${quest.title}`;
    if (store.todos.some(t => t.title === title && t.date === day)) { setMessage("Этот квест уже есть в сегодняшнем плане."); return; }
    const now = new Date(); let slot: number | undefined;
    for (let start = Math.max(8 * 60, Math.ceil((now.getHours() * 60 + now.getMinutes()) / 10) * 10); start + skill.minutes <= 22 * 60; start += 10) {
      if (!store.todos.some(t => t.source !== "lms" && t.hour !== undefined && isTodoOnDay(t, day) && start < t.hour * 60 + (t.minute ?? 0) + (t.duration ?? 60) && start + skill.minutes > t.hour * 60 + (t.minute ?? 0))) { slot = start; break; }
    }
    store.addTodo({ title, date: day, duration: skill.minutes, hour: slot === undefined ? undefined : Math.floor(slot / 60), minute: slot === undefined ? undefined : slot % 60, note: "Квест в разделе «Прокачать навык». Награда начисляется после проверки ответа." });
    setMessage(slot === undefined ? "Квест добавлен в список на сегодня без времени: свободного окна до 22:00 нет." : "Квест добавлен в свободное окно сегодняшнего расписания.");
    await useSyncStatus.getState().syncNow?.();
  }
  return <div className="mx-auto w-full max-w-5xl space-y-5 pb-6">
    <header className="flex flex-wrap items-center justify-between gap-3"><div><Link href="/account" className="text-sm underline">← Профиль</Link><h1 className="ios-title mt-2">Прокачать навык</h1></div><Link href="/shop" className="rounded-2xl border border-[var(--color-border)] px-4 py-3 text-sm font-semibold">◈ {data?.coins ?? "…"} · Магазин</Link></header>
    <section className="rounded-3xl border border-violet-400/30 bg-gradient-to-br from-violet-500/15 via-[var(--color-surface)] to-sky-500/10 p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">Учись · практикуйся · открывай образы</p>
      <h2 className="mt-3 text-2xl font-bold">Небольшой квест. Настоящий навык.</h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--color-muted)]">Выбери цель — получи маршрут из 6 квестов. Читай, решай и получай обратную связь. В финале — босс с самостоятельной задачей.</p>
      <div className="mt-4 flex flex-wrap gap-3 text-sm"><span className="rounded-xl bg-[var(--color-bg)] px-3 py-2">Учебный уровень {1 + Math.floor((data?.xp ?? 0) / 100)}</span><span className="rounded-xl bg-[var(--color-bg)] px-3 py-2">{data?.xp ?? 0} учебного XP</span><span className="rounded-xl bg-[var(--color-bg)] px-3 py-2">+20 монет за квест · +60 за босса</span></div>
    </section>
    {!data && <div role="status" className="surface rounded-2xl p-4">{loadError || "Загружаем учебный прогресс…"}{loadError && owner && <Button className="mt-3" onClick={() => void useLearningStore.getState().load(owner)}>Повторить</Button>}</div>}
    {data && <>
      {!data.available && <p role="status" className="surface rounded-2xl p-4 text-sm">ИИ ещё не подключён на сервере. Маршруты и проверка ответов станут доступны после настройки ключа.</p>}
      <details className="surface rounded-3xl p-5" open={data.skills.length === 0 || undefined}>
        <summary className="cursor-pointer font-semibold">+ Новый учебный маршрут</summary>
        <form onSubmit={create} className="mt-4 space-y-4">
          <label className="block text-sm">Чему хочешь научиться?<textarea className={field} rows={3} required minLength={5} maxLength={600} value={goal} disabled={busy} onChange={e => setGoal(e.target.value)} placeholder="Хочу освоить циклы Python с нуля. Или: хочу увереннее говорить по-английски, уровень A2." /></label>
          <label className="block text-sm">Время на квест<select className={field} value={minutes} disabled={busy} onChange={e => setMinutes(Number(e.target.value))}>{[10, 20, 30].map(m => <option key={m} value={m}>{m} минут</option>)}</select></label>
          <p className="text-xs text-[var(--color-muted)]">Цель и ответы отправляются в OpenAI для подготовки заданий и проверки. ИИ может ошибаться; код оценивается без запуска.</p>
          <Button type="submit" variant="primary" disabled={busy || !data.available}>{busy ? "ИИ работает…" : "Создать маршрут"}</Button>
        </form>
      </details>
      {data.skills.length > 0 && <label className="block text-sm">Мои маршруты<select className={field} value={skill?.id ?? ""} disabled={busy} onChange={e => { setSelected(e.target.value); setQuestId(""); setAnswer(""); setMessage(""); }}>{data.skills.map(s => <option key={s.id} value={s.id}>{s.title} · {s.quests.filter(q => q.completed).length}/6</option>)}</select></label>}
      {skill && quest && <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <section className="surface rounded-3xl p-4"><h2 className="font-semibold">Карта навыка · {complete}/6</h2><ol className="mt-4 space-y-2">{skill.quests.map((q, i) => <li key={q.id}><button disabled={busy || i > complete} onClick={() => { setQuestId(q.id); setAnswer(""); setMessage(""); }} className={`w-full rounded-2xl border p-3 text-left text-sm disabled:opacity-40 ${q.id === quest.id ? "border-violet-400 bg-violet-500/10" : "border-[var(--color-border)]"}`}><span className="mr-2">{q.completed ? "✓" : q.boss ? "◆" : i + 1}</span>{q.title}{q.boss && <span className="mt-1 block text-xs">Босс · самостоятельный проект</span>}</button></li>)}</ol>{complete === 6 && <p className="mt-4 text-sm">Маршрут пройден! Можно повторять уроки или начать новую цель.</p>}</section>
        <section className="surface min-w-0 rounded-3xl p-5">
          <div className="flex flex-wrap justify-between gap-2 text-xs text-[var(--color-muted)]"><span>{quest.boss ? "Финальный босс" : "Учебный квест"} · {skill.minutes} минут</span><span>+{rewardFor(quest.boss).xp} XP · +{rewardFor(quest.boss).coins} монет</span></div>
          <h2 className="mt-3 text-xl font-bold">{quest.title}</h2><p className="mt-4 whitespace-pre-wrap break-words text-sm leading-relaxed">{quest.lesson}</p>
          <div className="mt-5 rounded-2xl border border-violet-400/30 bg-violet-500/5 p-4"><h3 className="font-semibold">Твоя практика</h3><p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">{quest.exercise}</p></div>
          {quest.feedback && <div role="status" className="mt-4 rounded-2xl bg-[var(--color-surface-2)] p-4"><p className="font-semibold">{quest.completed ? "✓ Зачтено" : "Разбор ответа"}</p><p className="mt-2 whitespace-pre-wrap break-words text-sm">{quest.feedback}</p></div>}
          {!quest.completed ? <form onSubmit={submit} className="mt-4 space-y-3"><label className="block text-sm">Твой ответ<textarea className={field} rows={6} required maxLength={6000} value={answer} disabled={busy} onChange={e => setAnswer(e.target.value)} placeholder="Напиши решение своими словами или вставь свой код…" /></label><div className="flex flex-wrap gap-2"><Button type="submit" variant="primary" disabled={busy || !data.available}>{busy ? "Проверяем…" : "Проверить ответ"}</Button><Button type="button" disabled={busy} onClick={() => void schedule()}>В план на сегодня</Button></div><p className="text-xs text-[var(--color-muted)]">Награда за решение — один раз. Ошибки не отнимают XP и монеты.</p></form> : complete < 6 && <Button className="mt-4" onClick={() => { setQuestId(""); setAnswer(""); setMessage(""); }}>Следующий квест →</Button>}
        </section>
      </div>}
    </>}
    {error && <p role="alert" className="rounded-2xl border border-[var(--color-strength)] p-4 text-sm">{error}</p>}
    {message && <p role="status" className="surface rounded-2xl p-4 text-sm">{message}</p>}
  </div>;
}
