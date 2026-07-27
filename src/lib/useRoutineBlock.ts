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
 */
export function useRoutineNow(): RoutineNow {
  const [now, setNow] = useState<RoutineNow>(() => routineNow());

  useEffect(() => {
    const tick = () => {
      const next = routineNow();
      setNow((prev) =>
        prev.work?.id === next.work?.id &&
        prev.anchor?.id === next.anchor?.id &&
        prev.next?.id === next.next?.id
          ? prev
          : next,
      );
    };
    tick();
    const id = setInterval(tick, 60_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return now;
}
