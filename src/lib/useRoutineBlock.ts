"use client";

import { useEffect, useState } from "react";
import { currentRoutineBlock, type RoutineBlock } from "./routine";

/**
 * Текущий блок маршрута, который сам обновляется при смене часа.
 *
 * Границы блоков — почасовые (08–12, 13–17…), а не по слотам, поэтому
 * useTimeSlot тут не подходит: он меняется только на границах утро/день/вечер.
 * Проверяем раз в минуту и при возврате на вкладку; состояние трогаем, только
 * когда блок реально стал другим, — иначе лишние перерисовки колоды.
 */
export function useRoutineBlock(): RoutineBlock | null {
  const [block, setBlock] = useState<RoutineBlock | null>(() =>
    currentRoutineBlock(),
  );

  useEffect(() => {
    const tick = () => {
      const next = currentRoutineBlock();
      setBlock((prev) => (prev?.id === next?.id ? prev : next));
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

  return block;
}
