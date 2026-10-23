"use client";
/** Микро-юнит: текст (пишется при первом открытии), короткое видео и адаптивная проверка. */
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { YgIcon } from "@/components/yg-icons";
import { boldParts, call, percent, type UnitView } from "./client";
import Quiz from "./Quiz";
import VideoPanel from "./VideoPanel";
import "./path.css";

export default function UnitPage({ goalId, unitId }: { goalId: string; unitId: string }) {
  const [unit, setUnit] = useState<UnitView | null>(null);
  const [error, setError] = useState("");
  const [preparing, setPreparing] = useState(false);
  const [quiz, setQuiz] = useState<"unit" | "review" | null>(null);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    try {
      const view = await call<UnitView>(`/api/path/units/${unitId}`);
      setUnit(view);
      return view;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не получилось");
      return null;
    }
  }, [unitId]);

  const prepare = useCallback(async () => {
    setPreparing(true);
    setError("");
    try {
      // Первый, кто открыл юнит, ждёт, пока ИИ напишет текст и вопросы; остальные опрашивают статус.
      for (let i = 0; i < 60; i++) {
        const res = await call<{ status: string; unit: UnitView | null }>(`/api/path/units/${unitId}`, { action: "prepare" });
        if (res.unit) return setUnit(res.unit);
        await new Promise((r) => setTimeout(r, 3000));
      }
      setError("Юнит готовится слишком долго. Обнови страницу чуть позже.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не получилось");
    } finally {
      setPreparing(false);
    }
  }, [unitId]);

  useEffect(() => {
    setUnit(null);
    setQuiz(null);
    void load().then((view) => {
      if (view && view.status !== "ready") void prepare();
    });
  }, [load, prepare]);

  async function report() {
    const reason = window.prompt("Что не так в тексте юнита?");
    if (!reason || reason.trim().length < 3) return;
    try {
      await call(`/api/path/goals/${goalId}`, { action: "report", target: "unit", targetId: unitId, reason });
      setNotice("Спасибо, жалоба отправлена владельцу цели");
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Не получилось");
    }
  }

  async function share() {
    try {
      await call(`/api/path/goals/${goalId}`, { action: "share", kind: "unit", unitId });
      setNotice("Опубликовано в ленте сообщества");
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Не получилось");
    }
  }

  const review = unit?.skills.some((s) => s.reviewDue);
  return (
    <div className="path-page">
      <Link href={`/learn/g/${goalId}`} className="path-back"><YgIcon name="chevron" /> <span data-no-i18n>{unit?.goalTitle ?? "К траектории"}</span></Link>
      {error && !unit && <p className="path-error" role="alert">{error}</p>}
      {!unit && !error && <p className="path-muted" role="status">Загружаем юнит…</p>}
      {unit && (
        <>
          <header className="path-title">
            <span className="path-eyebrow">Микро-юнит · {unit.minutes} мин</span>
            <h1 data-no-i18n>{unit.title}</h1>
            <p data-no-i18n>{unit.objective}</p>
            <div className="path-row" style={{ marginTop: 10 }}>
              {unit.skills.map((s) => (
                <span key={s.id} className={`path-chip ${s.mastered ? "good" : s.reviewDue ? "warn" : ""}`}>
                  <span data-no-i18n>{s.name}</span> · {s.mastered ? "освоен" : s.reviewDue ? "пора повторить" : percent(s.mastery)}
                </span>
              ))}
              {unit.completed && <span className="path-chip good">Пройден</span>}
            </div>
          </header>

          {unit.status !== "ready" ? (
            <section className="path-card" role="status">
              <p>{preparing ? "ИИ пишет юнит и вопросы к нему. Это занимает 10–30 секунд — один раз для всех участников." : "Юнит ещё не готов."}</p>
              {error && <p className="path-error" role="alert" style={{ marginTop: 8 }}>{error}</p>}
              {!preparing && <button className="path-btn" style={{ marginTop: 10 }} onClick={prepare}>Подготовить юнит</button>}
            </section>
          ) : (
            <div className="path-stack">
              <article className="path-card path-reading">
                {unit.paragraphs.map((p, i) => (
                  <p key={i} data-no-i18n>{boldParts(p).map((part, j) => (part.bold ? <strong key={j}>{part.text}</strong> : <span key={j}>{part.text}</span>))}</p>
                ))}
                {unit.sourceSpan && <p className="path-quote">Из твоего материала: <span data-no-i18n>«{unit.sourceSpan}»</span></p>}
              </article>

              <VideoPanel goalId={goalId} unitId={unitId} title={unit.title} initial={unit.video} />

              {quiz ? (
                <Quiz goalId={goalId} kind={quiz} unitId={unitId} onDone={() => void load()} onClose={() => setQuiz(null)} />
              ) : (
                <section className="path-card path-stack">
                  <h2>{review ? "Пора повторить" : unit.completed ? "Проверить ещё раз" : "Проверь себя"}</h2>
                  <p className="path-muted">Вопросы подбираются под тебя: каждый следующий — такой, чтобы шанс ответить был около 70 %. Проверка закончится, когда станет ясно, освоен навык или нет (не больше 10 вопросов).</p>
                  <div className="path-row">
                    <button className="path-btn" onClick={() => setQuiz(review ? "review" : "unit")} disabled={unit.bank < 1}>{review ? "Начать повторение" : "Начать проверку"}</button>
                    {unit.bank < 1 && <span className="path-muted">Вопросов пока нет</span>}
                  </div>
                </section>
              )}

              <div className="path-row">
                {unit.prev && <Link className="path-btn ghost small" href={`/learn/g/${goalId}/u/${unit.prev}`}>← Предыдущий</Link>}
                {unit.next && <Link className="path-btn ghost small" href={`/learn/g/${goalId}/u/${unit.next}`}>Следующий →</Link>}
                <span className="path-grow" />
                <button className="path-link" onClick={share}>Поделиться</button>
                <button className="path-link" onClick={report}>Ошибка в тексте?</button>
              </div>
              {notice && <p className="path-muted" role="status">{notice}</p>}
            </div>
          )}
        </>
      )}
    </div>
  );
}
