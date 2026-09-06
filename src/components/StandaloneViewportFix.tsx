"use client";

import { useEffect } from "react";

/**
 * Лечит известную ошибку WebKit в установленном PWA (display: standalone).
 *
 * При запуске с домашнего экрана iOS считает вьюпорт по высоте окна Safari
 * — с несуществующей нижней панелью — и не пересчитывает его до первого
 * скролла. В итоге нижняя навигация (position: fixed; bottom: 0) висит на
 * ~80pt выше края экрана, пока пользователь не свайпнет.
 *
 * Уговаривать WebKit пересчитать вьюпорт (менять высоту корня) не помогло.
 * Поэтому меряем сами: в standalone на iPhone настоящая высота — это
 * screen.height (статус-бар прозрачный, приложение занимает экран целиком).
 * Если innerHeight меньше на высоту панели Safari, выставляем рамке
 * приложения высоту экрана в пикселях (--app-h) и сдвигаем таб-бар вниз на
 * разницу (--nav-offset, отрицательный bottom). Как только WebKit сам
 * пересчитает вьюпорт, разница станет нулём и переменные снимутся.
 *
 * Дополнительно повторяем то, что помогает руками: крошечный скролл
 * активного раздела — часто именно он и заставляет WebKit проснуться.
 *
 * Только iOS (у Safari есть navigator.standalone) и только standalone:
 * на Android innerHeight законно меньше экрана из-за системной панели.
 */
export default function StandaloneViewportFix() {
  useEffect(() => {
    const nav = window.navigator as Navigator & { standalone?: boolean };
    const isIos = "standalone" in nav;
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches || nav.standalone === true;
    if (!isIos || !standalone) return;

    const root = document.documentElement.style;

    const apply = () => {
      const portrait = window.matchMedia("(orientation: portrait)").matches;
      const full = portrait ? window.screen.height : window.screen.width;
      const diff = full - window.innerHeight;
      // 40–200: высота панели Safari (~80pt), а не клавиатура и не ошибка замера
      if (diff > 40 && diff < 200) {
        root.setProperty("--app-h", `${full}px`);
        root.setProperty("--nav-offset", `${-diff}px`);
      } else {
        root.removeProperty("--app-h");
        root.removeProperty("--nav-offset");
      }
    };

    const nudge = () => {
      const pane = document.querySelector<HTMLElement>("[data-section-active]");
      if (!pane) return;
      const top = pane.scrollTop;
      pane.scrollTop = top + 1;
      pane.scrollTop = top;
    };

    const tick = () => {
      apply();
      nudge();
    };

    tick();
    const t1 = window.setTimeout(tick, 250);
    const t2 = window.setTimeout(tick, 900);

    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    window.addEventListener("resize", apply);
    window.visualViewport?.addEventListener("resize", apply);
    window.addEventListener("orientationchange", tick);
    window.addEventListener("pageshow", tick);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", apply);
      window.visualViewport?.removeEventListener("resize", apply);
      window.removeEventListener("orientationchange", tick);
      window.removeEventListener("pageshow", tick);
      document.removeEventListener("visibilitychange", onVisible);
      root.removeProperty("--app-h");
      root.removeProperty("--nav-offset");
    };
  }, []);

  return null;
}
