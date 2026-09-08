"use client";

import { useEffect, useState } from "react";

/**
 * Сколько снизу занимает экранная клавиатура, в пикселях.
 *
 * На iOS клавиатура не трогает раскладку: layout viewport остаётся прежним,
 * а сжимается только visual viewport. Поэтому всё, что закреплено снизу
 * (лист модалки, кнопки под полем), спокойно уезжает под клавиатуру —
 * пользователь печатает вслепую и не видит кнопку «Сохранить».
 *
 * Единственный честный источник — window.visualViewport: разница между
 * высотой окна и видимой частью и есть клавиатура. Android с
 * interactiveWidget: "resizes-content" ужимает layout сам, там разница
 * останется нулевой, и поправка просто не понадобится.
 */
export function useKeyboardInset(active = true): number {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    if (!active) {
      setInset(0);
      return;
    }
    const vv = window.visualViewport;
    if (!vv) return;

    const read = () => {
      // offsetTop учитывает случай, когда страница «поднята» самим Safari
      const hidden = window.innerHeight - vv.height - vv.offsetTop;
      // мелкие расхождения бывают и без клавиатуры (панели браузера) —
      // ниже 80px считаем, что клавиатуры нет
      setInset(hidden > 80 ? Math.round(hidden) : 0);
    };

    read();
    vv.addEventListener("resize", read);
    vv.addEventListener("scroll", read);
    return () => {
      vv.removeEventListener("resize", read);
      vv.removeEventListener("scroll", read);
    };
  }, [active]);

  return inset;
}
