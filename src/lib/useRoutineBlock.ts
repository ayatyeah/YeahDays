"use client";

import { useEffect, useMemo, useState } from "react";
import type { RoutineNow } from "./routine";
import { planNow } from "./planNow";
import type { Todo } from "@/store/useUserStore";

/**
 * Контекст «что по плану сейчас», который сам обновляется со временем.
 *
 * Источник — задачи с часом (planNow), а не встроенный маршрут: он пуст.
 * Границы задач — поминутные (06:30, 11:00…), поэтому useTimeSlot не
 * подходит: он меняется только на границах утро/день/вечер.
 *
 * Пока вкладка ВИДНА, таймер молчит: смена текущей задачи переставляет
 * карточки в колоде (HomeSection::fullDeck ставит «по плану» первой) — на
 * границе часа это выглядело как «карточки сами по себе скачут» прямо посреди
 * просмотра. Пересчитываем в фоне и в момент возврата на вкладку — там смена
 * контента ожидаема, как у любого приложения. Изменение самих задач
 * (поставил галочку, добавил) пересчитывает сразу — это действие человека.
 */
export function useRoutineNow(todos: Todo[]): RoutineNow {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const bump = () => setTick((n) => n + 1);
    const id = setInterval(() => {
      if (document.visibilityState !== "visible") bump();
    }, 60_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") bump();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  // tick в зависимостях намеренно: он и есть сигнал «время прошло».
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => planNow(todos), [todos, tick]);
}
