"use client";

import { useEffect, useState } from "react";
import { currentSlot, type TimePreference } from "./domain";

/**
 * Текущее время суток, которое обновляется само.
 *
 * Проблема, которую это чинит: приложение часто висит открытым весь день.
 * Человек открыл его утром, вернулся вечером — а колода всё ещё утренняя,
 * потому что слот вычислился один раз при монтировании и больше не
 * пересчитывался. Движок умеет учитывать время суток, но ему никто не
 * сообщал, что оно сменилось.
 *
 * Проверяем раз в минуту, а не ставим таймер до следующего слота: дешевле,
 * переживает засыпание вкладки и перевод часов. Состояние меняется только
 * когда слот реально стал другим, поэтому лишних перерисовок нет.
 */
export function useTimeSlot(): Exclude<TimePreference, "any"> {
  const [slot, setSlot] = useState<Exclude<TimePreference, "any">>(() =>
    currentSlot(),
  );

  useEffect(() => {
    const tick = () => {
      const now = currentSlot();
      setSlot((prev) => (prev === now ? prev : now));
    };

    tick(); // вкладка могла проспать смену слота
    const id = setInterval(tick, 60_000);

    // возврат на вкладку — самый частый момент, когда время «прыгнуло»
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return slot;
}

export const SLOT_LABEL: Record<Exclude<TimePreference, "any">, string> = {
  morning: "утро",
  afternoon: "день",
  evening: "вечер",
};
