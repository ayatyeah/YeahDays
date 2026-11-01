"use client";
import { useCopy } from "@/i18n/useCopy";

import { useState } from "react";
import Image from "next/image";
import CompanionAssistant from "@/components/companion/CompanionAssistant";
import { YgIcon } from "@/components/yg-icons";
import { useCompanionStore } from "@/store/useCompanionStore";
export default function DaySupport() {
  const tx = useCopy();
  const [mode, setMode] = useState<"menu" | "focus" | null>(null);
  const started = useCompanionStore((s) => s.started);
  return (
    <div className="mono-day-support">
      <button className="mono-focus-strip" onClick={() => setMode("focus")}>
        <YgIcon name="clock" />
        <span>
          <b>{tx("Время для фокуса")}</b>
          <small>
            {started ? tx("Вернуться к таймеру") : tx("25 минут для одного дела")}
          </small>
        </span>
        <span className="mono-play" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M8 5v14l11-7Z" fill="currentColor" />
          </svg>
        </span>
      </button>
      <button
        className="mono-helper-row"
        onClick={() => setMode("menu")}
        aria-label={tx("Открыть помощника")}
      >
        <Image
          src="/companion/portrait.webp"
          unoptimized
          width={38}
          height={38}
          alt=""
        />
        <span>
          <b>{tx("Разобрать день?")}</b>
          <small>{tx("Помогу выбрать следующий шаг")}</small>
        </span>
        <YgIcon name="chevron" />
      </button>
      <CompanionAssistant
        open={mode !== null}
        initialMode={mode ?? "menu"}
        onClose={() => setMode(null)}
      />
    </div>
  );
}
