"use client";

import { useSession } from "next-auth/react";
import { useLearningStore } from "@/store/useLearningStore";
import { SKINS } from "@/lib/learning";
import { characterStageForLevel, skinImageForStage } from "@/lib/characterSkins";
import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { STAT_HEX, dominantStat, type AvatarStats } from "@/lib/statVisuals";

/**
 * 2D-персонаж. Раньше здесь был 3D на three.js — он и был главной
 * причиной лагов на телефоне (WebGL-контекст на каждом экране, скиннинг
 * в кадре). Теперь это лёгкая картинка с CSS-анимацией: три стадии тела
 * по уровню, мягкое «дыхание» и подскок при выполнении — ноль WebGL,
 * ноль дорогих blur-фильтров.
 */

interface Props {
  stats: AvatarStats;
  level: number;
  className?: string;
  /** триггер празднования: меняем число — персонаж подпрыгивает */
  celebrate?: number;
  /** без idle-анимации (для мелких/статичных мест) */
  still?: boolean;
  // приняты для совместимости со старым 3D-API, не используются
  scale?: number;
  interactive?: boolean;
}

export default function AvatarLazy({
  stats,
  level,
  className,
  celebrate = 0,
  still = false,
}: Props) {
  const { data: session } = useSession();
  const skinId = useLearningStore(s => s.owner === session?.user?.id ? s.data?.equipped : undefined);
  const skin = SKINS.find(s => s.id === skinId && s.id !== "default");
  const stage = characterStageForLevel(level);
  const hex = useMemo(() => STAT_HEX[dominantStat(stats)], [stats]);
  const power = Math.min(1, Math.max(0, (level - 1) / 40));

  const controls = useAnimationControls();
  // 0, чтобы празднование сработало и на маунте (оверлей уровня даёт celebrate=1)
  const lastCel = useRef(0);
  useEffect(() => {
    if (celebrate !== lastCel.current) {
      lastCel.current = celebrate;
      if (celebrate > 0) {
        controls.start({
          y: [0, -26, 0],
          scale: [1, 1.09, 1],
          transition: { duration: 0.85, ease: "easeOut" },
        });
      }
    }
  }, [celebrate, controls]);

  return (
    <div className={className} style={{ position: "relative", overflow: "hidden" }}>
      {/* мягкое свечение под цвет стата — статичное, без filter/анимации */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(46% 42% at 50% 40%, ${hex}${power > 0.5 ? "33" : "22"} 0%, transparent 70%)`,
        }}
      />

      {/* тень-подставка */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          bottom: "6%",
          width: "46%",
          height: "5%",
          transform: "translateX(-50%)",
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(0,0,0,0.55), transparent)",
        }}
      />

      {/* подскок (празднование) */}
      <motion.div
        animate={controls}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: "7%",
          transformOrigin: "bottom center",
        }}
      >
        {/* дыхание/парение — только transform (GPU), дёшево */}
        <motion.img
          src={skinImageForStage(skinId, stage)}
          alt={skin ? `Персонаж: ${skin.name}` : "Персонаж"}
          draggable={false}
          animate={still ? undefined : { y: [0, -5, 0] }}
          transition={
            still
              ? undefined
              : { duration: 4.2, repeat: Infinity, ease: "easeInOut" }
          }
          style={{
            height: "94%",
            width: "auto",
            objectFit: "contain",
            userSelect: "none",
          }}
        />
      </motion.div>
    </div>
  );
}
