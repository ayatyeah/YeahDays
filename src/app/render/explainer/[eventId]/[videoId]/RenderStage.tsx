"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ExplainerPlayer from "@/components/events/ExplainerPlayer";
import { CAST_POSES, type ExplainerVideo } from "@/lib/events/types";

/**
 * Ролик во весь экран поверх приложения. Рендер ждёт window.__explainerReady
 * (картинки персонажей загружены), потом двигает часы страницы по кадру.
 */
export default function RenderStage({ video, backdrop, course }: { video: ExplainerVideo; backdrop: number; course: string }) {
  const [ready, setReady] = useState(false);
  // ?zoom=3 — окно рендера 1080×1920, а сцена свёрстана под 360×640: увеличиваем
  // её целиком, и браузер рисует кадр сразу в полном размере (снимок без масштабирования).
  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    setZoom(Math.min(4, Math.max(1, Number(new URLSearchParams(window.location.search).get("zoom")) || 1)));
  }, []);
  useEffect(() => {
    const urls = (["A", "B"] as const).flatMap((who) => CAST_POSES[video.cast[who]].map((pose) => `/cast/${video.cast[who]}-${pose}.webp`));
    void Promise.all(
      urls.map((src) => new Promise<void>((done) => {
        const img = new Image();
        img.onload = img.onerror = () => done();
        img.src = src;
      })),
    ).then(() => document.fonts.ready).then(() => {
      setReady(true);
      (window as unknown as { __explainerReady?: boolean }).__explainerReady = true;
    });
  }, [video]);
  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black">
      {/* Рендер иногда снимают с dev-сервера: его значок и всплывашки в кадр попасть не должны. */}
      <style>{"nextjs-portal{display:none!important}"}</style>
      <div className="relative overflow-hidden" style={zoom > 1 ? { width: 360, height: 640, zoom } : { width: "100%", height: "100%" }}>
        {ready && <ExplainerPlayer video={video} active render backdrop={backdrop} />}
        <p className="pointer-events-none absolute left-0 right-0 top-[1.55rem] z-[60] text-center text-[10px] font-semibold tracking-wider text-white/60">{`yeahgrind.site · ${course}`}</p>
      </div>
    </div>,
    document.body,
  );
}
