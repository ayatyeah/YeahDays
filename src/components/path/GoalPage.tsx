"use client";
import { useCopy } from "@/i18n/useCopy";

/**
 * Экран цели. «Сегодня» — чек-ин и план дня с причинами (FR-12–14),
 * «Карта» — навыки и предпосылки, «Освоение» — отчёт по навыкам (FR-30),
 * «Круг» — совместная учёба: участники, челлендж недели, лента (FR-32–34).
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { YgIcon } from "@/components/yg-icons";
import { call, percent, type GoalView } from "./client";
import Quiz from "./Quiz";
import "./path.css";

type Tab = "today" | "map" | "mastery" | "circle";
const TABS: [Tab, string][] = [
  ["today", "Сегодня"],
  ["map", "Карта навыков"],
  ["mastery", "Освоение"],
  ["circle", "Круг"],
];
const ENERGY = [
  [1, "Нет сил"],
  [2, "Так себе"],
  [3, "Нормально"],
  [4, "Хорошо"],
  [5, "Полон сил"],
] as const;
const FREE = [5, 10, 15, 20, 30, 45, 60];
const FACTOR: Record<string, string> = { gap: "Пробел в знаниях", goal: "Важность для цели", review: "Пора повторить", deadline: "Близость дедлайна" };

function eventText(kind: string, title: string) {
  if (kind === "joined") return "присоединяется к цели";
  if (kind === "unit_done") return `юнит «${title}» пройден`;
  if (kind === "skill_mastered") return `навык «${title}» освоен`;
  if (kind === "video_ready") return `новое видео к юниту «${title}»`;
  if (kind === "placement_done") return "стартовый тест пройден";
  return title;
}

export default function GoalPage({ goalId }: { goalId: string }) {
  const tx = useCopy();
  const router = useRouter();
  const [view, setView] = useState<GoalView | null>(null);
  const [tab, setTab] = useState<Tab>("today");
  const [quiz, setQuiz] = useState<"placement" | "review" | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [energy, setEnergy] = useState(3);
  const [free, setFree] = useState(20);
  const [editCheckIn, setEditCheckIn] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const v = await call<GoalView>(`/api/path/goals/${goalId}`);
      setView(v);
      setEnergy(v.checkIn?.energy ?? v.checkInDefaults.energy);
      setFree(v.checkIn?.minutes ?? v.checkInDefaults.minutes);
    } catch (e) {
      setError(e instanceof Error ? e.message : tx("Не получилось"));
    }
  }, [goalId, tx]);

  useEffect(() => {
    void load();
  }, [load]);

  async function act(action: string, body: Record<string, unknown> = {}, message = "") {
    setBusy(true);
    setNotice("");
    try {
      const res = await call<GoalView & { ok?: boolean; postId?: string }>(`/api/path/goals/${goalId}`, { action, ...body });
      if ("id" in res && res.id === goalId) setView(res);
      if (message) setNotice(message);
      return res;
    } catch (e) {
      setNotice(e instanceof Error ? e.message : tx("Не получилось"));
      return null;
    } finally {
      setBusy(false);
    }
  }

  const depth = useMemo(() => {
    const d: Record<string, number> = {};
    const byId = new Map((view?.skills ?? []).map((s) => [s.id, s]));
    const of = (id: string, seen = new Set<string>()): number => {
      if (d[id] !== undefined) return d[id];
      if (seen.has(id)) return 0;
      seen.add(id);
      const s = byId.get(id);
      return (d[id] = s && s.prerequisites.length ? 1 + Math.max(...s.prerequisites.map((p) => of(p, seen))) : 0);
    };
    view?.skills.forEach((s) => of(s.id));
    return d;
  }, [view]);

  if (error) return <div className="path-page"><Link href="/learn" className="path-back"><YgIcon name="chevron" />{tx(" Учёба")}</Link><p className="path-error" role="alert">{tx(error)}</p></div>;
  if (!view) return <div className="path-page"><p className="path-muted" role="status">{tx("Загружаем траекторию…")}</p></div>;

  const due = view.skills.filter((s) => s.reviewDue);
  const done = view.units.filter((u) => u.completed).length;
  const mastered = view.skills.filter((s) => s.mastered).length;
  const planMinutes = (view.plan ?? []).reduce((n, p) => n + (p.review ? Math.min(p.minutes, 3) : p.minutes), 0);
  const report = [...view.skills].sort((a, b) => (a.mastery === null ? 2 : a.mastery) - (b.mastery === null ? 2 : b.mastery));
  const inviteUrl = view.circle.invite && typeof window !== "undefined" ? `${window.location.origin}/learn/join/${view.circle.invite}` : "";

  return (
    <div className="path-page">
      <Link href="/learn" className="path-back"><YgIcon name="chevron" />{tx(" Учёба")}</Link>
      <header className="path-title">
        {view.subject && <span className="path-eyebrow" data-no-i18n>{view.subject}</span>}
        <h1 data-no-i18n>{view.title}</h1>
        <div className="path-row" style={{ marginTop: 10 }}>
          <span className="path-chip info">{tx("Юнитов пройдено: {0} из {1}", {"0": done, "1": view.units.length})}</span>
          <span className="path-chip good">{tx("Навыков освоено: {0} из {1}", {"0": mastered, "1": view.skills.length})}</span>
          <span className="path-chip">{tx("Участников: {0}", {"0": view.circle.members.length})}</span>
        </div>
      </header>

      {!view.placementDone && quiz !== "placement" && (
        <section className="path-card path-stack" style={{ marginBottom: 14 }}>
          <h2>{tx("Стартовый тест")}</h2>
          <p className="path-muted">{tx("По вопросу на каждый навык ({0} шт.) — траектория начнётся с того, чего ты ещё не знаешь. Можно пропустить.", {"0": Math.min(10, view.skills.length)})}</p>
          <div className="path-row">
            <button className="path-btn" onClick={() => setQuiz("placement")}>{tx("Пройти тест")}</button>
            <button className="path-btn ghost" disabled={busy} onClick={() => void act("skipPlacement")}>{tx("Пропустить")}</button>
          </div>
        </section>
      )}
      {quiz && (
        <div style={{ marginBottom: 14 }}>
          <Quiz goalId={goalId} kind={quiz} onDone={() => void load()} onClose={() => { setQuiz(null); void load(); }} />
        </div>
      )}

      <div className="path-tabs" role="tablist" aria-label={tx("Разделы цели")}>
        {TABS.map(([id, label]) => <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}>{label}</button>)}
      </div>
      {notice && <p className="path-muted" role="status" style={{ marginBottom: 10 }}>{notice}</p>}

      {tab === "today" && (
        <div className="path-stack">
          {due.length > 0 && !quiz && (
            <section className="path-card path-row">
              <div className="path-grow">
                <h2>{tx("Пора повторить")}</h2>
                <p className="path-muted" data-no-i18n>{due.map((s) => s.name).join(", ")}</p>
              </div>
              <button className="path-btn" onClick={() => setQuiz("review")}>{tx("Повторить")}</button>
            </section>
          )}
          {(!view.checkIn || editCheckIn) ? (
            <section className="path-card path-stack" aria-label={tx("Чек-ин")}>
              <h2>{tx("Как ты сегодня?")}</h2>
              <div>
                <span className="path-label">{tx("Энергия")}</span>
                <div className="path-choice" role="group" aria-label={tx("Энергия")}>
                  {ENERGY.map(([n, label]) => <button key={n} aria-pressed={energy === n} onClick={() => setEnergy(n)}>{label}</button>)}
                </div>
              </div>
              <div>
                <span className="path-label">{tx("Свободное время на учёбу")}</span>
                <div className="path-choice" role="group" aria-label={tx("Свободные минуты")}>
                  {FREE.map((m) => <button key={m} aria-pressed={free === m} onClick={() => setFree(m)}>{tx("{0} мин", {"0": m})}</button>)}
                </div>
              </div>
              <div className="path-row">
                <button className="path-btn" disabled={busy} onClick={async () => { if (await act("checkin", { energy, minutes: free })) setEditCheckIn(false); }}>{tx("Собрать план на сегодня")}</button>
                {editCheckIn && <button className="path-btn ghost" onClick={() => setEditCheckIn(false)}>{tx("Отмена")}</button>}
              </div>
            </section>
          ) : (
            <section className="path-card path-stack" aria-label={tx("План на сегодня")}>
              <div className="path-row">
                <h2 className="path-grow">{tx("План на сегодня")}</h2>
                <span className="path-muted">{tx("{0} из {1} мин", {"0": planMinutes, "1": view.checkIn.minutes})}</span>
                <button className="path-link" onClick={() => setEditCheckIn(true)}>{tx("Изменить")}</button>
              </div>
              {(view.plan ?? []).length === 0 && <p className="path-muted">{view.recommendations.length ? tx("В свободные минуты сегодня ничего не помещается — попробуй выбрать больше времени.") : tx("Сейчас всё освоено. Загляни, когда подойдёт повторение.")}</p>}
              {(view.plan ?? []).map((p) => (
                <div key={p.unitId} className="path-plan-item">
                  <div className="path-row">
                    <b className="path-grow" data-no-i18n>{p.title}</b>
                    {p.review && <span className="path-chip warn">{tx("повторение")}</span>}
                    <span className="path-chip">{tx("{0} мин", {"0": p.review ? Math.min(p.minutes, 3) : p.minutes})}</span>
                  </div>
                  <p className="path-reason">{p.reason.text}</p>
                  {open === p.unitId && (
                    <div className="path-factors" aria-label={tx("Из чего сложился выбор")}>
                      {Object.entries(p.contributions).map(([f, v]) => (
                        <div key={f}><span>{FACTOR[f]}</span><div className="path-bar"><span style={{ width: `${Math.round((v / 0.35) * 100)}%` }} /></div><span className="path-muted">{v.toFixed(2)}</span></div>
                      ))}
                      <span className="path-muted">{tx("Приоритет: {0}", {"0": p.priority.toFixed(2)})}</span>
                    </div>
                  )}
                  <div className="path-row">
                    <Link className="path-btn small" href={`/learn/g/${goalId}/u/${p.unitId}`}>{tx("Начать")}</Link>
                    <button className="path-btn ghost small" disabled={busy} onClick={() => void act("postpone", { unitId: p.unitId }, tx("Отложено на сегодня — приоритет снижен до завтра"))}>{tx("Отложить")}</button>
                    <button className="path-link" aria-expanded={open === p.unitId} onClick={() => setOpen(open === p.unitId ? null : p.unitId)}>{tx("Почему?")}</button>
                  </div>
                </div>
              ))}
            </section>
          )}
          {view.recommendations.length > 0 && (
            <section className="path-card path-stack">
              <h2>{tx("Дальше по траектории")}</h2>
              {view.recommendations.filter((r) => !(view.plan ?? []).some((p) => p.unitId === r.unitId)).slice(0, 4).map((r) => (
                <Link key={r.unitId} href={`/learn/g/${goalId}/u/${r.unitId}`} className="path-row" style={{ padding: "6px 0" }}>
                  <span className="path-grow"><b data-no-i18n>{r.title}</b><span className="path-reason" style={{ display: "block" }}>{r.reason.text}</span></span>
                  <YgIcon name="chevron" />
                </Link>
              ))}
              {view.recommendations.every((r) => (view.plan ?? []).some((p) => p.unitId === r.unitId)) && <p className="path-muted">{tx("Всё доступное уже в плане.")}</p>}
            </section>
          )}
        </div>
      )}

      {tab === "map" && (
        <section className="path-card" aria-label={tx("Карта навыков")}>
          <p className="path-muted" style={{ marginBottom: 6 }}>{tx("Навыки открываются, когда освоены их предпосылки (освоение ≥ 85 % и хотя бы 3 ответа).")}</p>
          {view.skills.map((s) => {
            const pre = s.prerequisites.map((id) => view.skills.find((x) => x.id === id)?.name).filter(Boolean);
            const locked = s.prerequisites.some((id) => !view.skills.find((x) => x.id === id)?.mastered);
            return (
              <div key={s.id} className={`path-skill path-depth-${Math.min(3, depth[s.id] ?? 0)}`}>
                <div>
                  <b data-no-i18n>{s.name}</b>
                  <p className="path-muted" data-no-i18n>{s.description}</p>
                  {pre.length > 0 && <p className="path-muted"><span>{tx("После: ")}</span><span data-no-i18n>{pre.join(", ")}</span></p>}
                </div>
                <div className="path-row" style={{ justifyContent: "flex-end" }}>
                  <span className={`path-chip ${s.mastered ? "good" : s.reviewDue ? "warn" : locked ? "" : "info"}`}>{s.mastered ? (s.reviewDue ? tx("повторить") : tx("освоен")) : locked ? tx("закрыт") : s.answers ? percent(s.mastery) : tx("открыт")}</span>
                  {s.unitId && !locked && <Link className="path-link" href={`/learn/g/${goalId}/u/${s.unitId}`}>{tx("Юнит")}</Link>}
                </div>
                <div className={`path-bar ${s.mastered ? "good" : ""}`}><span style={{ width: percent(s.mastery ?? 0) }} /></div>
              </div>
            );
          })}
        </section>
      )}

      {tab === "mastery" && (
        <section className="path-card path-stack" aria-label={tx("Отчёт об освоении")}>
          <div className="path-row">
            <h2 className="path-grow">{tx("Освоение по навыкам")}</h2>
            <span className="path-chip good">{tx("Освоено: {0} из {1}", {"0": mastered, "1": view.skills.length})}</span>
          </div>
          <p className="path-muted">{tx("Освоение — предсказанный шанс решить типичный вопрос навыка. Сначала — самые слабые места.")}</p>
          {report.map((s) => (
            <div key={s.id}>
              <div className="path-row">
                <span className="path-grow" data-no-i18n>{s.name}</span>
                <span className="path-muted">{s.answers ? tx("{0} · ответов: {1}", {"0": percent(s.mastery), "1": s.answers}) : tx("ещё не проверялся")}</span>
                {!s.mastered && s.unitId && <Link className="path-link" href={`/learn/g/${goalId}/u/${s.unitId}`}>{tx("Подтянуть")}</Link>}
              </div>
              <div className={`path-bar ${s.mastered ? "good" : (s.mastery ?? 0) < 0.3 && s.answers ? "warn" : ""}`} style={{ marginTop: 6 }}><span style={{ width: percent(s.mastery ?? 0) }} /></div>
            </div>
          ))}
        </section>
      )}

      {tab === "circle" && (
        <div className="path-stack">
          <section className="path-card path-stack" aria-label={tx("Челлендж недели")}>
            <h2>{tx("Совместный челлендж недели")}</h2>
            <p className="path-muted">{tx("Считаем юниты всего круга вместе — без личного рейтинга.")}</p>
            <div className="path-row"><span className="path-grow">{tx("{0} из {1} юнитов", {"0": view.circle.weekly.done, "1": view.circle.weekly.target})}</span>{view.circle.weekly.done >= view.circle.weekly.target && <span className="path-chip good">{tx("Цель недели взята!")}</span>}</div>
            <div className="path-bar good"><span style={{ width: `${Math.min(100, Math.round((view.circle.weekly.done / Math.max(1, view.circle.weekly.target)) * 100))}%` }} /></div>
            {view.role === "owner" && (
              <form className="path-row" onSubmit={(e) => { e.preventDefault(); const n = Number(new FormData(e.currentTarget).get("target")); void act("settings", { weeklyTarget: n }, tx("Цель недели обновлена")); }}>
                <label className="path-muted">{tx("Цель недели (0 — по 3 юнита на участника)")}<input name="target" type="number" min={0} max={500} defaultValue={view.circle.weeklyTarget} className="path-field" style={{ width: 120 }} /></label>
                <button className="path-btn ghost small" disabled={busy}>{tx("Сохранить")}</button>
              </form>
            )}
          </section>

          <section className="path-card path-stack" aria-label={tx("Участники")}>
            <h2>{tx("Участники")}</h2>
            <div className="path-members">
              {view.circle.members.map((m) => (
                <div key={m.userId} className="path-member">
                  <img src={m.avatar} alt="" />
                  <span><b data-no-i18n>{m.name}</b>{m.role === "owner" && <span className="path-muted">{tx(" · владелец")}</span>}<span className="path-muted" style={{ display: "block" }}>{tx("юнитов: {0}", {"0": m.unitsDone})}</span></span>
                  {view.role === "owner" && !m.me && <button className="path-link" disabled={busy} onClick={() => window.confirm(tx("Убрать участника из цели?")) && void act("removeMember", { userId: m.userId })}>{tx("Убрать")}</button>}
                </div>
              ))}
            </div>
            {view.role === "owner" && inviteUrl && (
              <div className="path-stack">
                <span className="path-label">{tx("Ссылка-приглашение")}</span>
                <div className="path-row">
                  <input className="path-field path-grow" style={{ marginTop: 0 }} readOnly value={inviteUrl} aria-label={tx("Ссылка-приглашение")} onFocus={(e) => e.currentTarget.select()} />
                  <button className="path-btn ghost small" onClick={() => void navigator.clipboard?.writeText(inviteUrl).then(() => setNotice(tx("Ссылка скопирована")))}>{tx("Копировать")}</button>
                  <button className="path-btn ghost small" disabled={busy} onClick={() => void act("rotateInvite", {}, tx("Старая ссылка больше не работает"))}>{tx("Сменить ссылку")}</button>
                </div>
              </div>
            )}
            {view.role === "owner" && <button className="path-btn ghost" disabled={busy} onClick={() => void act("share", { kind: "goal" }, tx("Цель опубликована в ленте сообщества"))}>{tx("Позвать в ленте сообщества")}</button>}
          </section>

          <section className="path-card" aria-label={tx("Лента круга")}>
            <h2 style={{ marginBottom: 6 }}>{tx("Лента круга")}</h2>
            {view.events.length === 0 && <p className="path-muted">{tx("Пока тихо.")}</p>}
            {view.events.map((e) => (
              <div key={e.id} className="path-event">
                <img src={e.avatar} alt="" />
                <div className="path-grow">
                  <b data-no-i18n>{e.name}</b> · <span>{eventText(e.kind, e.title)}</span>
                  {e.score !== null && <span className="path-muted">{` · ${percent(e.score)}`}</span>}
                  <span className="path-muted" style={{ display: "block" }}>{new Date(e.createdAt).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                {e.mine && e.score !== null && !e.shared && <button className="path-link" disabled={busy} onClick={() => void act("shareEvent", { eventId: e.id }, tx("Теперь результат видят участники круга"))}>{tx("Показать кругу")}</button>}
              </div>
            ))}
          </section>

          {view.role === "owner" && view.reports.length > 0 && (
            <section className="path-card path-stack" aria-label={tx("Жалобы")}>
              <h2>{tx("Жалобы на сгенерированное")}</h2>
              {view.reports.map((r) => (
                <div key={r.id} className="path-plan-item">
                  <span className="path-chip warn">{r.target === "question" ? tx("вопрос") : r.target === "unit" ? tx("юнит") : tx("видео")}</span>
                  <p data-no-i18n>{r.reason}</p>
                  <p className="path-muted" data-no-i18n>{JSON.stringify(r.snapshot).slice(0, 220)}</p>
                  <div className="path-row">
                    <button className="path-btn small" disabled={busy} onClick={() => void act("resolveReport", { reportId: r.id, decision: "reject" }, r.target === "unit" ? tx("Юнит будет написан заново при следующем открытии") : tx("Убрано"))}>{tx("Убрать")}</button>
                    <button className="path-btn ghost small" disabled={busy} onClick={() => void act("resolveReport", { reportId: r.id, decision: "keep" }, tx("Оставлено"))}>{tx("Оставить")}</button>
                  </div>
                </div>
              ))}
            </section>
          )}

          <section className="path-card path-stack" aria-label={tx("Настройки")}>
            <h2>{tx("Мои настройки")}</h2>
            <form className="path-row" onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); void act("settings", { minutes: Number(f.get("minutes")), deadline: String(f.get("deadline") ?? "") }, tx("Сохранено")); }}>
              <label className="path-muted">{tx("Минут в день")}<select name="minutes" className="path-field" defaultValue={view.minutes}>{[5, 10, 15, 20, 30, 45, 60].map((m) => <option key={m} value={m}>{m}</option>)}</select></label>
              <label className="path-muted">{tx("Экзамен или дедлайн")}<input name="deadline" type="date" className="path-field" defaultValue={view.deadline} /></label>
              <button className="path-btn ghost small" disabled={busy}>{tx("Сохранить")}</button>
            </form>
            {view.role === "owner" ? (
              <button className="path-btn danger" disabled={busy} onClick={async () => { if (window.confirm(tx("Удалить цель для всех участников? Это нельзя отменить.")) && (await act("delete"))) router.push("/learn"); }}>{tx("Удалить цель")}</button>
            ) : (
              <button className="path-btn danger" disabled={busy} onClick={async () => { if (window.confirm(tx("Выйти из цели? Вернуться можно по приглашению — освоение сохранится.")) && (await act("leave"))) router.push("/learn"); }}>{tx("Выйти из цели")}</button>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
