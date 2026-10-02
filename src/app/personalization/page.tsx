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
  const [custom, setCustom] = useState(false); const [optIn, setOptIn] = useState(true); const [aiOptIn, setAiOptIn] = useState(true); const [busy, setBusy] = useState(false);
  async function save(enabled: boolean, ai: boolean) { if (!owner) return; setBusy(true); await store.request(owner, { action: "consent", version: POLICY_VERSION, enabled, ai, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }); setBusy(false); }
  const needsAcceptance = data?.version !== POLICY_VERSION;
  return <div className="mx-auto max-w-3xl space-y-5 px-4 pb-8">
    <Link href="/account" className="text-sm underline">← Профиль</Link><h1 className="ios-title">{needsAcceptance ? "Одно согласие на всё" : "Мой ритм и приватность"}</h1>
    {!data ? <p role="status">{store.error || "Загружаем настройки…"}{owner && <Button onClick={() => void store.request(owner)}>Повторить</Button>}</p> : <>
      <section className="surface space-y-4 rounded-3xl p-5">
        {needsAcceptance ? <>
          <h2 className="text-lg font-semibold">Прими один раз — и больше не спросим</h2>
          <p className="text-sm">Раньше согласие спрашивалось отдельно в чате с ИИ, в челлендже и для статистики. Теперь это одно решение. Нажимая «Принять всё», ты:</p>
          <ul className="list-disc space-y-2 pl-5 text-sm">
            <li>принимаешь <Link href="/privacy" target="_blank" rel="noopener" className="underline">политику конфиденциальности</Link> версии {POLICY_VERSION};</li>
            <li>становишься участником сообщества под своим аккаунтом: другие вошедшие пользователи видят твоё имя, персонажа, уровень и серию, могут найти тебя и подписаться. Скрыть себя можно в сообществе одним переключателем;</li>
            <li>разрешаешь ИИ-функциям (чат, планировщик, ИИ-подготовка, челлендж) передавать в OpenAI то, что нужно для ответа: твой запрос и связанные с ним данные аккаунта — план, учебный прогресс, цели;</li>
            <li>разрешаешь учёт активности: время в приложении, посещаемые разделы и выполненные дела — для твоей статистики, достижений и обезличенной аналитики сервиса.</li>
          </ul>
          <p className="text-xs text-[var(--color-muted)]">Не записываем содержимое экрана и нажатые клавиши. Любую часть можно отключить здесь же в любой момент.</p>
          <Button variant="primary" className="h-auto min-h-11 w-full whitespace-normal" disabled={busy} onClick={() => void save(true, true)}>{busy ? "Сохраняем…" : "Принять всё и продолжить"}</Button>
          {!custom ? <button className="w-full text-sm underline" onClick={() => setCustom(true)}>Выбрать самому, что разрешить</button> : <div className="space-y-3 rounded-2xl border border-[var(--color-border)] p-4">
            <p className="text-sm">Политика принимается в любом случае — без неё приложением пользоваться нельзя; вместе с ней ты появляешься в сообществе, где себя можно скрыть. Остальное по желанию:</p>
            <label className="flex items-start gap-3 text-sm"><input className="mt-1" type="checkbox" checked={aiOptIn} onChange={e => setAiOptIn(e.target.checked)} /><span>Передача данных в ИИ<span className="block text-xs text-[var(--color-muted)]">Без этого ИИ-функции будут спрашивать разрешение каждый раз.</span></span></label>
            <label className="flex items-start gap-3 text-sm"><input className="mt-1" type="checkbox" checked={optIn} onChange={e => setOptIn(e.target.checked)} /><span>Учёт активности<span className="block text-xs text-[var(--color-muted)]">Без этого не будет статистики времени и достижений «Моего ритма».</span></span></label>
            <Button className="h-auto min-h-11 w-full whitespace-normal" disabled={busy} onClick={() => void save(optIn, aiOptIn)}>Принять политику с этим выбором</Button>
          </div>}
        </> : <>
          <h2 className="text-lg font-semibold">Твои настройки приватности</h2>
          <p className="text-sm">Политика версии {POLICY_VERSION} принята. <Link href="/privacy" target="_blank" rel="noopener" className="underline">Прочитать ↗</Link></p>
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] p-4"><div className="min-w-0 flex-1"><p className="font-semibold">Передача данных в ИИ: {data.ai ? "разрешена" : "выключена"}</p><p className="text-xs text-[var(--color-muted)]">{data.ai ? "ИИ-функции не спрашивают разрешение каждый раз." : "ИИ-функции будут спрашивать разрешение перед каждой отправкой."}</p></div><Button size="sm" disabled={busy} onClick={() => void save(data.enabled, !data.ai)}>{data.ai ? "Выключить" : "Разрешить"}</Button></div>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] p-4"><div className="min-w-0 flex-1"><p className="font-semibold">Учёт активности: {data.enabled ? "включён" : "выключен"}</p><p className="text-xs text-[var(--color-muted)]">Отключение удаляет накопленную статистику и достижения этого раздела. Задачи, XP, монеты и скины сохраняются.</p></div><Button size="sm" disabled={busy} onClick={() => void save(!data.enabled, !!data.ai)}>{data.enabled ? "Отключить и удалить" : "Включить"}</Button></div>
          </div>
        </>}
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
