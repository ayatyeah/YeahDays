"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useThemeStore } from "@/store/useThemeStore";

/**
 * Синхронизирует data-theme на <html> с стором при каждом переключении.
 * Первую отрисовку (до гидрации) берёт на себя инлайн-скрипт в layout.tsx —
 * иначе был бы виден кадр тёмной темы, пока зустанд не восстановит light
 * из localStorage.
 */
export default function ThemeApplier() {
  const pathname = usePathname();
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    // Цвет статус-бара PWA — иначе на светлой теме сверху останется
    // тёмная полоса, зашитая в metadata.viewport (статична на сервере).
    const meta = document.querySelector('meta[name="theme-color"]');
    const inApp = !!document.querySelector(".yg-app");
    if (meta)
      meta.setAttribute(
        "content",
        inApp
          ? theme === "light"
            ? "#ffffff"
            : "#121213"
          : theme === "light"
            ? "#fcf9f3"
            : "#08080b",
      );
  }, [theme, pathname]);

  return null;
}
