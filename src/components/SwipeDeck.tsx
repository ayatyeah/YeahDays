"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import ActionCard, { type SwipeDir } from "./ActionCard";
import { haptic } from "@/lib/motion";
import type { ScoredAction } from "@/lib/recommendation";
import type { Action } from "@/lib/domain";

interface SwipeDeckProps {
  deck: ScoredAction[];
  onAccept: (a: Action) => void;
  onReject: (a: Action) => void;
  /**
   * Меняется только при РЕАЛЬНОЙ новой подборке. Именно по нему сбрасываем
   * свайпнутое — а не по ссылке deck: та меняется ещё и на тике часа маршрута,
   * из-за чего курсор обнулялся и отклонённые карточки воскресали.
   */
  resetKey?: unknown;
  /** колода закончилась */
  emptyState?: React.ReactNode;
}

const VISIBLE = 3;

export default function SwipeDeck({
  deck,
  onAccept,
  onReject,
  resetKey,
  emptyState,
}: SwipeDeckProps) {
  // Свайпнутые id, а не позиционный курсор: устойчиво к пересборке колоды
  // (смена маршрутного блока меняет ссылку, но не должна воскрешать карточки).
  const [swiped, setSwiped] = useState<Set<string>>(() => new Set());
  const [forced, setForced] = useState<SwipeDir | null>(null);

  // новая подборка — забываем свайпы
  useEffect(() => {
    setSwiped(new Set());
    setForced(null);
  }, [resetKey]);

  const visible = deck
    .filter((s) => !swiped.has(s.action.id))
    .slice(0, VISIBLE);

  const handleSwipe = useCallback(
    (dir: SwipeDir, action: Action) => {
      setForced(null);
      if (dir === "right") onAccept(action);
      else onReject(action);
      setSwiped((prev) => {
        const next = new Set(prev);
        next.add(action.id);
        return next;
      });
      // «беру» ощущается весомее, чем «мимо» — разные паттерны отдачи
      haptic(dir === "right" ? "medium" : "select");
    },
    [onAccept, onReject],
  );

  const exhausted = visible.length === 0;

  return (
    // data-no-swipe: колода забирает горизонтальный жест себе. Без этого
    // «беру / не беру» одновременно листало бы разделы приложения.
    <div className="flex flex-1 flex-col" data-no-swipe>
      {/* Колода */}
      <div className="relative flex-1" style={{ minHeight: 380 }}>
        <AnimatePresence mode="popLayout">
          {exhausted ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {emptyState}
            </motion.div>
          ) : (
            visible
              .map((s, i) => (
                <ActionCard
                  key={s.action.id}
                  scored={s}
                  index={i}
                  onSwipe={handleSwipe}
                  forced={i === 0 ? forced : null}
                />
              ))
              .reverse()
          )}
        </AnimatePresence>
      </div>

      {/* Кнопки-дублёры свайпа (доступность + desktop) */}
      {!exhausted && (
        <div className="mt-5 flex items-center justify-center gap-5">
          <DeckButton
            label="Не сейчас"
            color="#cf8578"
            onClick={() => setForced("left")}
          >
            <path
              d="M7 7l10 10M17 7L7 17"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </DeckButton>

          <div className="text-center">
            <p className="text-[12px] font-medium text-[var(--color-muted)]">
              Свайпни карточку
            </p>
            <p className="mt-0.5 text-[11.5px] text-[var(--color-muted)]/60">
              ← мимо · беру →
            </p>
          </div>

          <DeckButton
            label="Беру"
            color="#6fb39c"
            onClick={() => setForced("right")}
          >
            <path
              d="M5 13l4.5 4.5L19 7"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </DeckButton>
        </div>
      )}
    </div>
  );
}

function DeckButton({
  children,
  color,
  label,
  onClick,
}: {
  children: React.ReactNode;
  color: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={label}
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.06 }}
      className="flex h-16 w-16 items-center justify-center rounded-full border-2 bg-[var(--color-surface)] transition"
      style={{ borderColor: `${color}55`, color }}
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
        {children}
      </svg>
    </motion.button>
  );
}
