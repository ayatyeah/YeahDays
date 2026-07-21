"use client";

import dynamic from "next/dynamic";
import { STAT_HEX, dominantStat, type AvatarStats } from "@/lib/statVisuals";

/**
 * Ленивая обёртка над 3D-аватаром.
 *
 * three.js — самая тяжёлая зависимость проекта. Без этого разделения
 * она попадала в бандл страницы и блокировала первую отрисовку:
 * экран стоял пустым, пока грузился рендерер. Теперь страница
 * появляется сразу, а персонаж догружается следом.
 *
 * ssr:false обязателен — WebGL на сервере нет.
 */
const Avatar3D = dynamic(() => import("./Avatar3D"), {
  ssr: false,
  loading: () => null,
});

interface Props {
  stats: AvatarStats;
  level: number;
  className?: string;
  scale?: number;
  interactive?: boolean;
  celebrate?: number;
  still?: boolean;
}

export default function AvatarLazy(props: Props) {
  return (
    <div className={props.className} style={{ position: "relative" }}>
      {/* Плейсхолдер под размер канваса, чтобы лэйаут не прыгал */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 999,
            background: `${STAT_HEX[dominantStat(props.stats)]}14`,
          }}
        />
      </div>
      <Avatar3D {...props} className="relative h-full w-full" />
    </div>
  );
}
