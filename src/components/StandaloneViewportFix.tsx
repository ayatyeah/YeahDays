"use client";

import { useEffect } from "react";

/**
 * Лечит известную ошибку WebKit в установленном PWA (display: standalone).
 *
 * При запуске с домашнего экрана iOS иногда считает вьюпорт по высоте
 * окна Safari — с несуществующей нижней панелью — и не пересчитывает
 * position: fixed до первого скролла или resize. В итоге нижняя навигация
 * висит на ~80pt выше края экрана, пока пользователь не свайпнет.
 *
 * Принудительный пересчёт: на кадр меняем высоту корня и возвращаем
 * обратно — WebKit заново снимает размеры вьюпорта и прикладывает
 * fixed-элементы к настоящему низу. Делаем это после первой отрисовки,
 * при возврате из фона (pageshow / visibilitychange) и при смене размера
 * visualViewport. Вне standalone-режима компонент ничего не делает.
 */
export default function StandaloneViewportFix() {
  useEffect(() => {
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      (window.navigator as { standalone?: boolean }).standalone === true;
    if (!standalone) return;

    let raf = 0;
    const reflow = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const root = document.documentElement;
        root.style.height = "100.001%";
        // дочитать высоту — иначе браузер объединит два присваивания в одно
        void root.offsetHeight;
        raf = requestAnimationFrame(() => {
          root.style.height = "";
        });
      });
    };

    // после первой отрисовки и ещё раз чуть позже — вьюпорт при запуске
    // может «доехать» не сразу
    reflow();
    const late = window.setTimeout(reflow, 350);

    const onShow = () => reflow();
    const onVisible = () => {
      if (document.visibilityState === "visible") reflow();
    };
    window.addEventListener("pageshow", onShow);
    document.addEventListener("visibilitychange", onVisible);
    window.visualViewport?.addEventListener("resize", reflow);
    window.addEventListener("orientationchange", reflow);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(late);
      window.removeEventListener("pageshow", onShow);
      document.removeEventListener("visibilitychange", onVisible);
      window.visualViewport?.removeEventListener("resize", reflow);
      window.removeEventListener("orientationchange", reflow);
    };
  }, []);

  return null;
}
