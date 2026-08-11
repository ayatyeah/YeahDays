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
 *
 * Но пока вкладка ВИДНА, тикающий интервал молчит: смена слота дёргает
 * колоду (см. HomeSection — slot в зависимостях фетча рекомендаций) и
 * человек видел, как карточки "сами по себе" прыгают посреди чтения —
 * граница часа ничего не спрашивает. Обновляем только пока вкладка в
 * фоне (никто не смотрит) или в момент возврата на неё — это уже
 * ожидаемый момент «может, что-то обновилось», как у любого приложения.
 */
export function useTimeSlot(): Exclude<TimePreference, "any"> {
  const [slot, setSlot] = useState<Exclude<TimePreference, "any">>(() =>
    currentSlot(),
  );

  useEffect(() => {
    const sync = () => {
      const now = currentSlot();
      setSlot((prev) => (prev === now ? prev : now));
    };
    // интервал молчит, пока видно — обновляет только пока в фоне
    const tick = () => {
      if (document.visibilityState !== "visible") sync();
    };

    const id = setInterval(tick, 60_000);

    // возврат на вкладку — единственный момент, когда обновляем ВИДИМЫЙ экран
    const onVisible = () => {
      if (document.visibilityState === "visible") sync();
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
