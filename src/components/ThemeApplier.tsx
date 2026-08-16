"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";

/**
 * Синхронизирует data-theme на <html> с стором при каждом переключении.
 * Первую отрисовку (до гидрации) берёт на себя инлайн-скрипт в layout.tsx —
 * иначе был бы виден кадр тёмной темы, пока зустанд не восстановит light
 * из localStorage.
 */
export default function ThemeApplier() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    // Цвет статус-бара PWA — иначе на светлой теме сверху останется
    // тёмная полоса, зашитая в metadata.viewport (статична на сервере).
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#f6f5fa" : "#08080b");
  }, [theme]);

  return null;
}
