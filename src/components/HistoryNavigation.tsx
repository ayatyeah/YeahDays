"use client";

import { useEffect, useRef, useState } from "react";

const KEY = "__ygHistory";
type Entry = { trail: string; index: number };

/** Track this tab's same-origin history, preserving Next's router state. */
export default function HistoryNavigation() {
  const [available, setAvailable] = useState({ back: false, forward: false });
  const navigate = useRef<(direction: -1 | 1) => void>(() => {});
  useEffect(() => {
    const history = window.history;
    const push = history.pushState;
    const replace = history.replaceState;
    let current: Entry = history.state?.[KEY] ?? { trail: crypto.randomUUID(), index: 0 };
    const storageKey = () => `yg-history:${current.trail}`;
    let maximum = current.index;
    try { maximum = Math.max(current.index, Number(sessionStorage.getItem(storageKey())) || 0); } catch {}
    let disposed = false;
    const publish = () => {
      const next = { back: current.index > 0, forward: current.index < maximum };
      // Next writes history in an insertion effect; update React after that commit.
      queueMicrotask(() => { if (!disposed) setAvailable(next); });
      try { sessionStorage.setItem(storageKey(), String(maximum)); } catch {}
    };
    replace.call(history, { ...history.state, [KEY]: current }, "");
    function pushState(data: unknown, unused: string, url?: string | URL | null) {
      const next = { ...current, index: current.index + 1 };
      push.call(history, { ...(data as object), [KEY]: next }, unused, url);
      current = next;
      maximum = current.index;
      publish();
    }
    function replaceState(data: unknown, unused: string, url?: string | URL | null) {
      // A router may replace the traversed entry before our popstate callback.
      // Read the browser's destination marker rather than stamping the entry we left.
      const destination = history.state?.[KEY] as Entry | undefined;
      if (destination?.trail === current.trail) current = destination;
      replace.call(history, { ...(data as object), [KEY]: current }, unused, url);
    }
    const pop = (event: PopStateEvent) => {
      const entry = event.state?.[KEY] as Entry | undefined;
      if (entry?.trail === current.trail) current = entry;
      else {
        current = entry ?? { trail: crypto.randomUUID(), index: 0 };
        maximum = current.index;
        try { maximum = Math.max(maximum, Number(sessionStorage.getItem(storageKey())) || 0); } catch {}
        replace.call(history, { ...history.state, [KEY]: current }, "");
      }
      publish();
    };
    history.pushState = pushState;
    history.replaceState = replaceState;
    window.addEventListener("popstate", pop, true);
    publish();
    let navigating = false;
    let timer: ReturnType<typeof setTimeout>;
    navigate.current = direction => {
      if (navigating || (direction < 0 ? current.index <= 0 : current.index >= maximum)) return;
      navigating = true;
      history.go(direction);
      timer = setTimeout(() => { navigating = false; }, 400);
    };
    let drag: { x: number; y: number } | null = null;
    const excluded = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return true;
      if (document.body.dataset.modalOpen === "1" || document.querySelector('dialog[open], [aria-modal="true"]')) return true;
      if (target.closest('input, textarea, select, button, a, [contenteditable="true"], [data-no-swipe], [role="slider"], canvas, video')) return true;
      for (let el: Element | null = target; el && el !== document.body; el = el.parentElement) {
        if (el.scrollWidth > el.clientWidth + 2 && /auto|scroll/.test(getComputedStyle(el).overflowX)) return true;
      }
      return false;
    };
    const start = (e: TouchEvent) => {
      drag = null;
      if (e.touches.length !== 1 || excluded(e.target)) return;
      const t = e.touches[0];
      // Leave browser edge gestures and pinch zoom to the browser.
      if (t.clientX < 24 || t.clientX > innerWidth - 24) return;
      drag = { x: t.clientX, y: t.clientY };
    };
    const move = (e: TouchEvent) => {
      if (!drag) return;
      if (e.touches.length !== 1) { drag = null; return; }
      const dx = e.touches[0].clientX - drag.x;
      const dy = e.touches[0].clientY - drag.y;
      if (Math.abs(dy) > 16 && Math.abs(dx) < Math.abs(dy) * 2.2) { drag = null; return; }
      if (Math.abs(dx) > 24 && Math.abs(dx) > Math.abs(dy) * 2.2 && e.cancelable) e.preventDefault();
    };
    const end = (e: TouchEvent) => {
      const from = drag;
      drag = null;
      if (!from || !e.changedTouches[0] || window.getSelection()?.toString()) return;
      const dx = e.changedTouches[0].clientX - from.x;
      const dy = e.changedTouches[0].clientY - from.y;
      if (Math.abs(dx) >= 80 && Math.abs(dx) > Math.abs(dy) * 2.2) navigate.current(dx < 0 ? -1 : 1);
    };
    const cancel = () => { drag = null; };
    document.addEventListener("touchstart", start, { passive: true });
    document.addEventListener("touchmove", move, { passive: false });
    document.addEventListener("touchend", end);
    document.addEventListener("touchcancel", cancel);
    return () => {
      disposed = true;
      if (history.pushState === pushState) history.pushState = push;
      if (history.replaceState === replaceState) history.replaceState = replace;
      window.removeEventListener("popstate", pop, true);
      document.removeEventListener("touchstart", start);
      document.removeEventListener("touchmove", move);
      document.removeEventListener("touchend", end);
      document.removeEventListener("touchcancel", cancel);
      clearTimeout(timer);
    };
  }, []);
  return <nav aria-label="История страниц" data-no-i18n data-no-swipe className="yg-history-nav">
    <button type="button" aria-label="Назад" disabled={!available.back} onClick={() => navigate.current(-1)} title="Назад · свайп влево">← <span>Назад</span></button>
    <button type="button" aria-label="Вперёд" disabled={!available.forward} onClick={() => navigate.current(1)} title="Вперёд · свайп вправо"><span>Вперёд</span> →</button>
  </nav>;
}
