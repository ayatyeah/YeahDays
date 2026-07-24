"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Установленное приложение не должно упираться в витрину.
 *
 * У тех, кто добавил YeahDays на домашний экран до появления лендинга,
 * в манифесте закэширован start_url «/». Чтобы они не открывали каждый
 * раз рекламную страницу, из standalone-режима сразу уводим в «/app».
 *
 * Проверяем именно режим отображения, а не user-agent: display-mode
 * говорит «запущено как приложение», и это единственный честный признак.
 */
export default function StandaloneRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // iOS Safari до сих пор использует своё нестандартное свойство
      (window.navigator as { standalone?: boolean }).standalone === true;

    if (standalone) router.replace("/app");
  }, [router]);

  return null;
}
