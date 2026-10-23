"use client";
/**
 * Адаптивная проверка: стартовый тест, проверка юнита или повторение.
 * Вопрос приходит без ответа; после ответа — разбор и обновлённое освоение.
 * Следующий вопрос сервер подбирает сам (P ≈ 0.7) и сам решает, когда хватит.
 */
import { useEffect, useRef, useState } from "react";
import { answerKey, ApiError, call, percent, type AnswerResult, type QuizItem, type QuizStart } from "./client";

type Kind = "placement" | "unit" | "review";
const TITLE: Record<Kind, string> = { placement: "Стартовый тест", unit: "Проверка юнита", review: "Повторение" };

export default function Quiz({ goalId, kind, unitId, onDone, onClose }: { goalId: string; kind: Kind; unitId?: string; onDone?: () => void; onClose?: () => void }) {
  const [quizId, setQuizId] = useState("");
  const [item, setItem] = useState<QuizItem | null>(null);
  const [choice, setChoice] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [hints, setHints] = useState<string[]>([]);
  const [hintsLeft, setHintsLeft] = useState(0);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [reportText, setReportText] = useState("");
  const [reported, setReported] = useState(false);
  const key = useRef("");
  const shownAt = useRef(0);

  function show(next: QuizItem) {
    setItem(next);
    setChoice(null);
    setText("");
    setHints(next.hints);
    setHintsLeft(next.hintsLeft);
    setResult(null);
    setReporting(false);
    setReported(false);
    key.current = answerKey();
    shownAt.current = Date.now();
  }

  useEffect(() => {
    let alive = true;
    call<QuizStart>("/api/path/quiz", { goalId, kind, unitId }).then(
      (s) => {
        if (!alive) return;
        setQuizId(s.quizId);
        show(s.item);
      },
      (e) => alive && setError(e.message),
    );
    return () => {
      alive = false;
    };
  }, [goalId, kind, unitId]);

  async function submit() {
    if (!item || busy) return;
    setBusy(true);
    setError("");
    try {
      const body = item.kind === "mcq" ? { choice } : { text };
      const res = await call<AnswerResult>(`/api/path/quiz/${quizId}`, { action: "answer", questionId: item.id, key: key.current, ms: Date.now() - shownAt.current, ...body });
      setResult(res);
      if (res.done) onDone?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не получилось");
      // Сеть оборвалась — ключ остаётся прежним: повтор не засчитает ответ дважды.
      if (!(e instanceof ApiError) || e.status !== 0) key.current = answerKey();
      // Вопрос уже закрыт (ответ принят с другой вкладки или раньше) — подтягиваем, где проверка сейчас.
      if (e instanceof ApiError && e.status === 409) {
        try {
          const s = await call<QuizStart>("/api/path/quiz", { goalId, kind, unitId });
          setQuizId(s.quizId);
          show(s.item);
          setError("Этот ответ уже засчитан — продолжаем с текущего вопроса");
        } catch {
          /* проверка закончилась — кнопка «Готово» ниже вернёт к юниту */
        }
      }
    } finally {
      setBusy(false);
    }
  }

  async function takeHint() {
    if (!item) return;
    try {
      const res = await call<{ hints: string[]; hintsLeft: number }>(`/api/path/quiz/${quizId}`, { action: "hint", questionId: item.id });
      setHints(res.hints);
      setHintsLeft(res.hintsLeft);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не получилось");
    }
  }

  async function report() {
    if (!item || reportText.trim().length < 3) return;
    try {
      await call(`/api/path/goals/${goalId}`, { action: "report", target: "question", targetId: item.id, reason: reportText });
      setReported(true);
      setReporting(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не получилось");
    }
  }

  if (error && !item) return <div className="path-card" role="alert"><p className="path-error">{error}</p>{onClose && <button className="path-btn ghost small" style={{ marginTop: 10 }} onClick={onClose}>Закрыть</button>}</div>;
  if (!item) return <div className="path-card" role="status"><p className="path-muted">Подбираем первый вопрос…</p></div>;

  const outcome = result?.outcome;
  const answered = !!result;
  return (
    <section className="path-card path-stack" aria-label={TITLE[kind]}>
      <div className="path-row">
        <span className="path-eyebrow">{TITLE[kind]}</span>
        <span className="path-grow" />
        <span className="path-muted">Вопрос {item.number}{kind === "placement" ? ` из ${item.max}` : ` · максимум ${item.max}`}</span>
      </div>
      <p className="path-muted" data-no-i18n>{item.skill}</p>
      <h2 style={{ fontSize: 18, lineHeight: 1.4 }} data-no-i18n>{item.stem}</h2>

      {item.kind === "mcq" ? (
        <div className="path-stack" role="group" aria-label="Варианты ответа">
          {item.options.map((o, i) => {
            const state = !answered ? "" : i === outcome?.correctIndex ? "right" : i === choice ? "wrong" : "";
            return (
              <button key={i} className={`path-option ${state}`} aria-pressed={choice === i} disabled={answered || busy} onClick={() => setChoice(i)} data-no-i18n>
                {o}
              </button>
            );
          })}
        </div>
      ) : (
        <label className="path-label">
          Твой ответ
          <textarea className="path-field" value={text} onChange={(e) => setText(e.target.value)} maxLength={4000} disabled={answered || busy} placeholder="Объясни своими словами" />
        </label>
      )}

      {hints.length > 0 && (
        <div className="path-notice" aria-live="polite">
          {hints.map((h, i) => <p key={i} data-no-i18n><b>Подсказка {i + 1}:</b> {h}</p>)}
        </div>
      )}

      {!answered && (
        <div className="path-row">
          <button className="path-btn" onClick={submit} disabled={busy || (item.kind === "mcq" ? choice === null : text.trim().length < 2)}>{busy ? (item.kind === "open" ? "Проверяем…" : "Отправляем…") : "Ответить"}</button>
          {hintsLeft > 0 && <button className="path-btn ghost" onClick={takeHint} disabled={busy}>Подсказка ({hintsLeft})</button>}
        </div>
      )}
      {error && <p className="path-error" role="alert">{error}</p>}

      {outcome && (
        <div className={`path-feedback ${outcome.correct ? "right" : "wrong"}`} role="status">
          <b>{outcome.correct ? "Верно!" : item.kind === "open" ? `Пока не засчитано · ${Math.round(outcome.score * 100)} из 100` : "Не совсем"}</b>
          {item.kind === "open" && outcome.correct && <span className="path-muted"> · {Math.round(outcome.score * 100)} из 100</span>}
          {outcome.chosenWhy && <p data-no-i18n style={{ marginTop: 6 }}>{outcome.chosenWhy}</p>}
          {outcome.explanation && <p data-no-i18n style={{ marginTop: 6 }}>{outcome.explanation}</p>}
          {outcome.feedback && (
            <>
              <p style={{ marginTop: 6 }}><b>Получилось:</b> <span data-no-i18n>{outcome.feedback.strength}</span></p>
              <p style={{ marginTop: 4 }}><b>Улучшить:</b> <span data-no-i18n>{outcome.feedback.improvement}</span></p>
            </>
          )}
        </div>
      )}

      {result && (
        <div className="path-stack" aria-label="Освоение навыков">
          {result.mastery.map((m) => (
            <div key={m.skillId}>
              <div className="path-row"><span className="path-grow" data-no-i18n>{m.name}</span><span className={`path-chip ${m.mastered ? "good" : ""}`}>{m.mastered ? "Освоен" : percent(m.mastery)}</span></div>
              <div className={`path-bar ${m.mastered ? "good" : ""}`} style={{ marginTop: 6 }}><span style={{ width: percent(m.mastery) }} /></div>
            </div>
          ))}
        </div>
      )}

      {result?.done && result.summary && (
        <div className="path-notice" role="status">
          <b>Проверка завершена.</b> Верных ответов: {result.summary.correct} из {result.summary.asked}. Траектория уже пересчитана под новые результаты.
        </div>
      )}

      <div className="path-row">
        {result && !result.done && result.next && <button className="path-btn" onClick={() => show(result.next!)}>Дальше</button>}
        {result?.done && onClose && <button className="path-btn" onClick={onClose}>Готово</button>}
        <span className="path-grow" />
        {!reported && !reporting && <button className="path-link" onClick={() => setReporting(true)}>Ошибка в вопросе?</button>}
        {reported && <span className="path-muted">Спасибо, жалоба отправлена владельцу цели</span>}
      </div>
      {reporting && (
        <div className="path-stack">
          <label className="path-label">Что не так с вопросом?<textarea className="path-field" style={{ minHeight: 70 }} value={reportText} onChange={(e) => setReportText(e.target.value)} maxLength={500} /></label>
          <div className="path-row"><button className="path-btn small" onClick={report} disabled={reportText.trim().length < 3}>Отправить</button><button className="path-btn ghost small" onClick={() => setReporting(false)}>Отмена</button></div>
        </div>
      )}
    </section>
  );
}
