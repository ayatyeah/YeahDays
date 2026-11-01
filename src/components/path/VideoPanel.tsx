"use client";
import { useCopy } from "@/i18n/useCopy";

/** Видео юнита: заказать, следить за задачей (очередь → сборка → готово), смотреть, делиться. */
import { useCallback, useEffect, useState } from "react";
import { call, type VideoView } from "./client";
import VideoPlayer from "./VideoPlayer";

const STATUS: Record<string, string> = {
  queued: "В очереди — начнём через пару секунд…",
  running: "Пишем сценарий, сверяем его с юнитом и озвучиваем. Обычно до минуты.",
  failed: "Не получилось собрать видео.",
  needs_review: "Сверка нашла в сценарии сомнительные места — видео ждёт проверки владельцем цели.",
};

export default function VideoPanel({ goalId, unitId, title, initial }: { goalId: string; unitId: string; title: string; initial: { id: string; status: string } | null }) {
  const tx = useCopy();
  const [videoId, setVideoId] = useState(initial?.id ?? "");
  const [view, setView] = useState<VideoView | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [shared, setShared] = useState(false);

  const load = useCallback(async () => {
    if (!videoId) return;
    try {
      setView(await call<VideoView>(`/api/path/videos/${videoId}`));
    } catch (e) {
      setError(e instanceof Error ? e.message : tx("Не получилось"));
    }
  }, [videoId, tx]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!view || (view.status !== "queued" && view.status !== "running")) return;
    const timer = setTimeout(load, 3000);
    return () => clearTimeout(timer);
  }, [view, load]);

  async function request(rewrite = false) {
    setBusy(true);
    setError("");
    try {
      const res = await call<{ videoId: string; status: string }>(`/api/path/units/${unitId}`, { action: "video", rewrite });
      setVideoId(res.videoId);
      setView(null);
      if (res.videoId === videoId) void load();
    } catch (e) {
      setError(e instanceof Error ? e.message : tx("Не получилось"));
    } finally {
      setBusy(false);
    }
  }

  async function approve() {
    setBusy(true);
    try {
      await call(`/api/path/videos/${videoId}`, { action: "approve" });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : tx("Не получилось"));
    } finally {
      setBusy(false);
    }
  }

  async function share() {
    try {
      await call(`/api/path/goals/${goalId}`, { action: "share", kind: "video", unitId });
      setShared(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : tx("Не получилось"));
    }
  }

  async function report() {
    const reason = window.prompt(tx("Что не так в видео?"));
    if (!reason || reason.trim().length < 3) return;
    try {
      await call(`/api/path/goals/${goalId}`, { action: "report", target: "video", targetId: videoId, reason });
      setError(tx("Спасибо, жалоба отправлена владельцу цели"));
    } catch (e) {
      setError(e instanceof Error ? e.message : tx("Не получилось"));
    }
  }

  return (
    <section className="path-card path-stack" id="video" aria-label={tx("Короткое видео")}>
      <div className="path-row">
        <h2 className="path-grow">{tx("Короткое видео")}</h2>
        {view?.status === "succeeded" && <span className="path-chip">{Math.round(view.seconds)}{tx(" с")}</span>}
      </div>
      {!videoId && (
        <>
          <p className="path-muted">{tx("ИИ напишет сценарий по тексту юнита, сверит каждое предложение с источником и озвучит. Готовое видео увидят все участники цели.")}</p>
          <button className="path-btn" onClick={() => request()} disabled={busy}>{busy ? tx("Ставим в очередь…") : tx("Сделать видео (~1 мин)")}</button>
        </>
      )}
      {videoId && !view && !error && <p className="path-muted" role="status">{tx("Загружаем видео…")}</p>}
      {view && view.status !== "succeeded" && (
        <div className="path-notice" role="status" aria-live="polite">
          <p>{STATUS[view.status] ?? view.status}</p>
          {view.status === "failed" && view.error && <p className="path-muted" style={{ marginTop: 4 }}>{view.error}</p>}
          {view.status === "running" && view.attempts > 1 && <p className="path-muted" style={{ marginTop: 4 }}>{tx("Попытка ")}{view.attempts}{tx(" из 3")}</p>}
        </div>
      )}
      {view?.status === "failed" && <button className="path-btn ghost" onClick={() => request()} disabled={busy}>{tx("Повторить")}</button>}
      {view?.status === "needs_review" && view.canApprove && (
        <div className="path-stack">
          <h3>{tx("Замечания сверки")}</h3>
          <ul className="path-muted" style={{ listStyle: "disc", paddingLeft: 18 }} data-no-i18n>{view.issues.map((x) => <li key={x}>{x}</li>)}</ul>
          <details>
            <summary className="path-link">{tx("Сценарий целиком")}</summary>
            <div className="path-stack" style={{ marginTop: 8 }} data-no-i18n>
              {view.script?.scenes.map((s, i) => <p key={i}><b>{s.heading}.</b> {s.sentences.map((x) => x.text).join(" ")}</p>)}
            </div>
          </details>
          <div className="path-row">
            <button className="path-btn" onClick={approve} disabled={busy}>{tx("Всё верно — озвучить")}</button>
            <button className="path-btn ghost" onClick={() => request(true)} disabled={busy}>{tx("Написать заново")}</button>
          </div>
        </div>
      )}
      {view?.status === "succeeded" && view.script && (
        <>
          <VideoPlayer view={view} title={title} />
          <div className="path-row">
            <button className="path-btn ghost small" onClick={share} disabled={shared}>{shared ? tx("Опубликовано в ленте") : tx("Поделиться в ленте")}</button>
            <span className="path-grow" />
            <button className="path-link" onClick={report}>{tx("Ошибка в видео?")}</button>
          </div>
        </>
      )}
      {error && <p className={error.startsWith(tx("Спасибо")) ? "path-muted" : "path-error"} role="alert">{tx(error)}</p>}
    </section>
  );
}
