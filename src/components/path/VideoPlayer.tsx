"use client";
/**
 * Плеер короткого видео: вертикальный кадр 9:16 рисуется на canvas по
 * сценарию и времени озвучки. Та же функция кадра пишет ролик в файл
 * (MediaRecorder: MP4, где браузер умеет, иначе WebM) — скачанное видео
 * выглядит так же, как на сайте. Субтитры включены по умолчанию, есть
 * расшифровка с поиском, источники и управление с клавиатуры (FR-24).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { VideoView } from "./client";

type Scene = NonNullable<VideoView["script"]>["scenes"][number];
const SPEEDS = [0.75, 1, 1.25, 1.5];
const KIND_LABEL: Record<string, string> = { title: "", points: "", term: "Термин", example: "Пример", recap: "Итог" };
const PALETTE: Record<string, [string, string, string]> = {
  title: ["#1e1b4b", "#4c1d95", "#c4b5fd"],
  points: ["#0f172a", "#1e3a5f", "#93c5fd"],
  term: ["#042f2e", "#115e59", "#5eead4"],
  example: ["#2a1606", "#7c2d12", "#fdba74"],
  recap: ["#052e16", "#14532d", "#86efac"],
};
const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", sans-serif';

function wrap(ctx: CanvasRenderingContext2D, text: string, width: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > width && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/** Один кадр в момент t (секунды) на холсте w×h. */
function drawFrame(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, view: VideoView, title: string, captions: boolean) {
  const scenes = view.script?.scenes ?? [];
  const starts = view.sceneStarts;
  let i = 0;
  while (i + 1 < starts.length && t >= starts[i + 1]) i++;
  const scene: Scene | undefined = scenes[i];
  const [from, to, accent] = PALETTE[scene?.kind ?? "points"] ?? PALETTE.points;
  const u = w / 720;
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, from);
  g.addColorStop(1, to);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Сегменты прогресса по сценам сверху.
  const total = view.seconds || 1;
  const gap = 8 * u;
  const segW = (w - 64 * u - gap * (scenes.length - 1)) / Math.max(1, scenes.length);
  scenes.forEach((_, j) => {
    const s0 = starts[j] ?? 0;
    const s1 = starts[j + 1] ?? total;
    const fill = Math.max(0, Math.min(1, (t - s0) / Math.max(0.01, s1 - s0)));
    const x = 32 * u + j * (segW + gap);
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillRect(x, 40 * u, segW, 6 * u);
    ctx.fillStyle = "#fff";
    ctx.fillRect(x, 40 * u, segW * fill, 6 * u);
  });
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = `600 ${24 * u}px ${FONT}`;
  ctx.textBaseline = "top";
  ctx.fillText(`YeahGrind · ${title}`.slice(0, 48), 32 * u, 70 * u);

  if (scene) {
    // Первая сцена видна сразу (это и обложка на паузе), следующие плавно проявляются.
    const since = i === 0 ? 10 : t - (starts[i] ?? 0);
    ctx.globalAlpha = Math.max(0, Math.min(1, since / 0.45));
    let y = h * 0.24;
    const label = KIND_LABEL[scene.kind];
    if (label) {
      ctx.font = `700 ${26 * u}px ${FONT}`;
      const lw = ctx.measureText(label).width + 32 * u;
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.roundRect(48 * u, y, lw, 46 * u, 23 * u);
      ctx.fill();
      ctx.fillStyle = from;
      ctx.fillText(label, 64 * u, y + 8 * u);
      y += 76 * u;
    }
    ctx.fillStyle = "#fff";
    ctx.font = `800 ${(scene.kind === "title" ? 68 : 58) * u}px ${FONT}`;
    for (const line of wrap(ctx, scene.heading, w - 96 * u).slice(0, 4)) {
      ctx.fillText(line, 48 * u, y);
      y += (scene.kind === "title" ? 80 : 68) * u;
    }
    y += 24 * u;
    ctx.font = `500 ${34 * u}px ${FONT}`;
    scene.bullets.forEach((b, j) => {
      ctx.globalAlpha = Math.max(0, Math.min(1, (since - 0.35 - j * 0.5) / 0.45));
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(60 * u, y + 20 * u, 7 * u, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      for (const line of wrap(ctx, b, w - 140 * u).slice(0, 3)) {
        ctx.fillText(line, 84 * u, y);
        y += 46 * u;
      }
      y += 18 * u;
    });
    ctx.globalAlpha = 1;
  }

  const cue = view.cues.find((c) => t >= c.start && t < c.end);
  if (captions && cue) {
    ctx.font = `600 ${30 * u}px ${FONT}`;
    const lines = wrap(ctx, cue.text, w - 120 * u).slice(0, 3);
    const boxH = lines.length * 42 * u + 28 * u;
    const top = h - 150 * u - boxH;
    ctx.fillStyle = "rgba(0,0,0,0.62)";
    ctx.beginPath();
    ctx.roundRect(40 * u, top, w - 80 * u, boxH, 18 * u);
    ctx.fill();
    ctx.fillStyle = "#fff";
    lines.forEach((line, j) => {
      const lw = ctx.measureText(line).width;
      ctx.fillText(line, (w - lw) / 2, top + 14 * u + j * 42 * u);
    });
  }
  ctx.font = `600 ${20 * u}px ${FONT}`;
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fillText("ИИ-голос · Gemini", 32 * u, h - 60 * u);
}

const pickMime = () =>
  ["video/mp4;codecs=avc1,mp4a.40.2", "video/mp4", "video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"].find((m) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m));

export default function VideoPlayer({ view, title }: { view: VideoView; title: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [captions, setCaptions] = useState(true);
  const [panel, setPanel] = useState<"transcript" | "sources">("transcript");
  const [query, setQuery] = useState("");
  const [recording, setRecording] = useState<number | null>(null);
  const [exportError, setExportError] = useState("");
  const cancel = useRef(false);
  const src = view.clips[0]?.src ?? "";

  const render = useCallback(() => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    drawFrame(ctx, c.width, c.height, audio.current?.currentTime ?? 0, view, title, captions);
  }, [view, title, captions]);

  useEffect(() => {
    render();
    if (!playing) return;
    let raf = 0;
    const tick = () => {
      render();
      setTime(audio.current?.currentTime ?? 0);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, render]);

  useEffect(() => {
    if (audio.current) audio.current.playbackRate = speed;
  }, [speed]);

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) void a.play().catch(() => {});
    else a.pause();
  };
  const seek = (t: number) => {
    const a = audio.current;
    if (!a) return;
    a.currentTime = Math.max(0, Math.min(view.seconds, t));
    setTime(a.currentTime);
    render();
  };
  const onKey = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).tagName === "INPUT") return;
    if (e.key === " " || e.key === "k") (e.preventDefault(), toggle());
    else if (e.key === "ArrowRight") (e.preventDefault(), seek(time + 5));
    else if (e.key === "ArrowLeft") (e.preventDefault(), seek(time - 5));
    else if (e.key === "c" || e.key === "с") setCaptions((v) => !v);
  };

  const current = view.cues.findIndex((c) => time >= c.start && time < c.end);
  const shown = useMemo(() => view.cues.map((c, i) => ({ ...c, i })).filter((c) => !query.trim() || c.text.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())), [view.cues, query]);

  async function exportVideo() {
    setExportError("");
    const mime = pickMime();
    if (!mime || !src) return setExportError("Этот браузер не умеет записывать видео. Попробуй Chrome или Safari.");
    const out = document.createElement("canvas");
    out.width = 720;
    out.height = 1280;
    const ctx = out.getContext("2d")!;
    const ac = new AudioContext();
    try {
      const data = await (await fetch(src)).arrayBuffer();
      const buffer = await ac.decodeAudioData(data);
      const dest = ac.createMediaStreamDestination();
      const node = ac.createBufferSource();
      node.buffer = buffer;
      node.connect(dest);
      const stream = new MediaStream([...out.captureStream(30).getVideoTracks(), ...dest.stream.getAudioTracks()]);
      const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 2_500_000 });
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      const done = new Promise<void>((resolve) => (recorder.onstop = () => resolve()));
      cancel.current = false;
      recorder.start(1000);
      const startAt = ac.currentTime + 0.15;
      node.start(startAt);
      setRecording(0);
      await new Promise<void>((resolve) => {
        const step = () => {
          const t = ac.currentTime - startAt;
          drawFrame(ctx, out.width, out.height, Math.max(0, t), view, title, captions);
          setRecording(Math.min(99, Math.round((Math.max(0, t) / buffer.duration) * 100)));
          if (cancel.current || t >= buffer.duration + 0.2) return resolve();
          requestAnimationFrame(step);
        };
        step();
      });
      recorder.stop();
      node.stop();
      await done;
      if (!cancel.current) {
        const blob = new Blob(chunks, { type: mime.split(";")[0] });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${title.replace(/[^\p{L}\p{N}]+/gu, "-").slice(0, 60) || "video"}.${mime.includes("mp4") ? "mp4" : "webm"}`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 30_000);
      }
    } catch {
      setExportError("Не удалось записать видео. Попробуй ещё раз или скачай субтитры отдельно.");
    } finally {
      setRecording(null);
      void ac.close();
    }
  }

  return (
    <div className="path-video" onKeyDown={onKey}>
      <div className="path-stack">
        <canvas ref={canvas} width={720} height={1280} tabIndex={0} role="img" aria-label={`Видео: ${title}. Пробел — пауза, стрелки — перемотка, C — субтитры`} onClick={toggle} />
        <audio ref={audio} src={src} preload="auto" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onSeeked={render} onLoadedData={render} />
        <input type="range" min={0} max={view.seconds} step={0.1} value={time} onChange={(e) => seek(Number(e.target.value))} aria-label="Перемотка" />
        <div className="path-video-controls">
          <button className="path-btn small" onClick={toggle}>{playing ? "Пауза" : "Смотреть"}</button>
          <button className="path-btn ghost small" onClick={() => seek(time - 5)} aria-label="Назад на 5 секунд">−5 с</button>
          <button className="path-btn ghost small" onClick={() => seek(time + 5)} aria-label="Вперёд на 5 секунд">+5 с</button>
          <select className="path-btn ghost small" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} aria-label="Скорость">
            {SPEEDS.map((s) => <option key={s} value={s}>{s}×</option>)}
          </select>
          <button className="path-btn ghost small" aria-pressed={captions} onClick={() => setCaptions((v) => !v)}>{captions ? "Субтитры: вкл" : "Субтитры: выкл"}</button>
        </div>
        <span className="path-muted">{Math.floor(time)} / {Math.round(view.seconds)} с · голос сгенерирован ИИ</span>
      </div>
      <div className="path-stack">
        <div className="path-tabs" role="tablist">
          <button role="tab" aria-selected={panel === "transcript"} onClick={() => setPanel("transcript")}>Расшифровка</button>
          <button role="tab" aria-selected={panel === "sources"} onClick={() => setPanel("sources")}>Источники</button>
        </div>
        {panel === "transcript" ? (
          <>
            <input className="path-field" style={{ marginTop: 0 }} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск по расшифровке" aria-label="Поиск по расшифровке" />
            <div className="path-transcript" data-no-i18n>
              {shown.map((c) => (
                <button key={c.i} aria-current={c.i === current} onClick={() => seek(c.start + 0.01)}>
                  <span className="path-muted">{Math.floor(c.start / 60)}:{String(Math.floor(c.start % 60)).padStart(2, "0")} </span>{c.text}
                </button>
              ))}
              {!shown.length && <p className="path-muted">Ничего не нашлось</p>}
            </div>
          </>
        ) : (
          <div className="path-transcript">
            <p className="path-muted">Каждое предложение видео опирается на абзац юнита. Сценарий сверен с ними до озвучки.</p>
            {view.sources.map((p, i) => (
              <p key={i} data-no-i18n style={{ padding: 6, borderRadius: 10, background: view.cues[current]?.ref === i ? "var(--companion-blue)" : undefined }}>
                <b>¶{i + 1}</b> {p.replace(/\*\*/g, "")}
              </p>
            ))}
          </div>
        )}
        <div className="path-row">
          <a className="path-btn ghost small" href={`/api/path/videos/${view.id}/captions`} download={`${title.slice(0, 40)}.vtt`}>Субтитры .vtt</a>
          {recording === null ? (
            <button className="path-btn ghost small" onClick={exportVideo}>Скачать видео</button>
          ) : (
            <>
              <span className="path-muted" role="status">Записываем видео… {recording}%</span>
              <button className="path-btn ghost small" onClick={() => (cancel.current = true)}>Отмена</button>
            </>
          )}
        </div>
        {exportError && <p className="path-error" role="alert">{exportError}</p>}
        {recording !== null && <p className="path-muted">Запись идёт в реальном времени — не закрывай вкладку.</p>}
      </div>
    </div>
  );
}
