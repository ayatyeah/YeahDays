"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { POLICY_VERSION } from "@/lib/personalization";
import { usePersonalizationStore } from "@/store/usePersonalizationStore";
export default function PersonalizationPage() {
  const { data: session } = useSession(); const owner = session?.user?.id;
  const store = usePersonalizationStore(); const data = store.owner === owner ? store.data : null;
  const [optIn, setOptIn] = useState(false); const [read, setRead] = useState(false); const [busy, setBusy] = useState(false);
  async function save(enabled: boolean) { if (!owner) return; setBusy(true); await store.request(owner, { action: "consent", version: POLICY_VERSION, enabled, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }); setBusy(false); }
  const needsAcceptance = data?.version !== POLICY_VERSION;
  return <div className="mx-auto max-w-3xl space-y-5 px-4 pb-8">
    <Link href="/account" className="text-sm underline">← Профиль</Link><h1 className="ios-title">Мой ритм и достижения</h1>
    {!data ? <p role="status">{store.error || "Загружаем настройки…"}{owner && <Button onClick={() => void store.request(owner)}>Повторить</Button>}</p> : <>
      <section className="surface space-y-3 rounded-3xl p-5">
        <h2 className="text-lg font-semibold">{needsAcceptance ? "Новая политика конфиденциальности" : "Твои настройки приватности"}</h2>
        <p className="text-sm">Версия от 29 сентября 2026. Мы уточнили данные аккаунта, LMS, ИИ, учебного прогресса и новый добровольный учёт активности.</p>
        <Link href="/privacy" target="_blank" rel="noopener" className="block underline">Прочитать политику полностью ↗</Link>
        <p className="text-sm text-[var(--color-muted)]">Для персонализации считаем активное время в приложении, посещаемые разделы, возвращения и выполнения задач, действий и квестов. Не записываем содержимое экрана или нажатые клавиши. Без согласия этот учёт не работает.</p>
        {needsAcceptance ? <>
          <label className="flex items-start gap-3 text-sm"><input className="mt-1" type="checkbox" checked={read} onChange={e => setRead(e.target.checked)} />Я прочитал(а) и принимаю политику конфиденциальности версии {POLICY_VERSION}.</label>
          <label className="flex items-start gap-3 text-sm"><input className="mt-1" type="checkbox" checked={optIn} onChange={e => setOptIn(e.target.checked)} />Разрешаю учёт активности для персональных подсказок, статистики и достижений. Необязательно; можно отключить в любой момент.</label>
          <Button disabled={busy || !read} onClick={() => void save(optIn)}>{busy ? "Сохраняем…" : "Принять выбранные настройки"}</Button>
        </> : <><p className="text-sm">Политика принята. Учёт активности: <strong>{data.enabled ? "включён" : "выключен"}</strong>.</p><Button disabled={busy} onClick={() => void save(!data.enabled)}>{data.enabled ? "Отключить и удалить статистику активности" : "Разрешить учёт активности"}</Button><p className="text-xs text-[var(--color-muted)]">Отключение удаляет новую статистику и достижения этого раздела. Задачи, учебные XP, монеты и купленные скины сохраняются.</p></>}
        <div className="flex gap-4 text-sm"><a href="/api/account" className="underline">Выгрузить данные</a><Link href="/account" className="underline">Управление аккаунтом</Link></div>
      </section>
      {!needsAcceptance && data.enabled && <>
        <div className="grid grid-cols-2 gap-3">{[["Активное время", `${Math.floor(data.totals.seconds / 60)} мин`], ["Задачи выполнены", data.totals.tasks], ["Действия выполнены", data.totals.actions], ["Квесты пройдены", data.totals.quests], ["Активные дни", data.activeDays], ["Возвращения", data.totals.visits]].map(([label, value]) => <div key={label} className="surface rounded-2xl p-4"><p className="text-2xl font-bold">{value}</p><p className="text-xs text-[var(--color-muted)]">{label}</p></div>)}</div>
        <p className="text-xs text-[var(--color-muted)]">Считаем с момента включения. Время приблизительное: только активная вкладка, пауза после минуты без действий. Выполнения фиксируются после синхронизации при использовании приложения. Часовой пояс: {data.timezone}.</p>
        <section className="surface rounded-3xl p-5"><h2 className="font-semibold">Цель дня · {Math.min(data.todayCompleted, data.dailyTarget)}/{data.dailyTarget}</h2><progress className="mt-3 w-full" value={Math.min(data.todayCompleted, data.dailyTarget)} max={data.dailyTarget} /><p className="mt-2 text-sm">{data.todayCompleted >= data.dailyTarget ? "Цель достигнута! Можно закончить на сегодня." : `Попробуй завершить ${data.dailyTarget} небольших дела или квеста. Цель подстраивается по последним семи дням с учтённой активностью.`}</p><Link href="/today" className="mt-3 block underline">К дневному плану →</Link></section>
        <section className="space-y-3"><h2 className="text-lg font-semibold">Достижения</h2><div className="grid grid-cols-2 gap-3">{data.badges.map(b => <div key={b.name} className={`surface rounded-2xl border p-4 ${b.unlocked ? "border-violet-400" : "border-[var(--color-border)]"}`}><p className="font-semibold">{b.unlocked ? "✦ " : "◇ "}{b.name}</p><p className="mt-1 text-xs">{b.value}/{b.target} выполнений</p></div>)}</div><p className="text-xs text-[var(--color-muted)]">Достижения отмечают выполненные дела. Время в приложении не приносит XP и монеты.</p></section>
        <Button disabled={busy} onClick={() => owner && void store.request(owner, { action: "refresh" })}>Обновить прогресс</Button>
      </>}
      {store.error && <p role="alert">{store.error}</p>}
    </>}
  </div>;
}
