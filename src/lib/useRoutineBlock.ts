"use client";

import { useEffect, useState } from "react";
import { routineNow, type RoutineNow } from "./routine";

/**
 * Контекст маршрута «сейчас», который сам обновляется при смене часа.
 *
 * Границы блоков — почасовые (08–12, 13–17…), а не по слотам, поэтому
 * useTimeSlot тут не подходит: он меняется только на границах утро/день/вечер.
 * Проверяем раз в минуту и при возврате на вкладку; состояние трогаем, только
 * когда контекст реально стал другим, — иначе лишние перерисовки колоды.
 *
 * Пока вкладка ВИДНА, интервал молчит: смена маршрутного блока переставляет
 * карточки в колоде местами (HomeSection::fullDeck ставит "по плану" первыми)
 * — на границе часа это выглядело как "карточки сами по себе скачут" прямо
 * посреди просмотра. Обновляем только в фоне или в момент возврата на
 * вкладку — там смена контента уже ожидаема, как у любого приложения.
 */
export function useRoutineNow(): RoutineNow {
  const [now, setNow] = useState<RoutineNow>(() => routineNow());

  useEffect(() => {
    const sync = () => {
      const next = routineNow();
      setNow((prev) =>
        prev.work?.id === next.work?.id &&
        prev.anchor?.id === next.anchor?.id &&
        prev.next?.id === next.next?.id
          ? prev
          : next,
      );
    };
    const tick = () => {
      if (document.visibilityState !== "visible") sync();
    };
    const id = setInterval(tick, 60_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") sync();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return now;
}
