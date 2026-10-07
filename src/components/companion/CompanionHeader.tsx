"use client";
import { useState } from "react";
import Image from "next/image";
import { useUserStore } from "@/store/useUserStore";
import { currentSlot, type EnergyLevel } from "@/lib/domain";
import { useNavStore } from "@/store/useNavStore";
import CompanionAssistant from "./CompanionAssistant";
export default function CompanionHeader() {
  const [open, setOpen] = useState(false);
  const slot = currentSlot();
  const energy = useUserStore((s) => s.energyProfile[slot]);
  const setEnergy = useUserStore((s) => s.setSlotEnergy);
  const go = useNavStore((s) => s.go);
  const minutes = energy === "low" ? 5 : energy === "high" ? 30 : 20;
  return (
    <div className="companion-header">
      <header className="companion-brand">
        <b>
          YeahGrind
          <span />
        </b>
        <p>
          Маленькие шаги.
          <br />
          Больше ты.
        </p>
      </header>
      <button
        className="companion-welcome"
        onClick={() => setOpen(true)}
        aria-label="Открыть помощника"
      >
        <Image
          src="/companion/portrait.webp"
          width={220}
          height={240}
          alt=""
          priority
        />
        <span>
          <b>Начни всего с</b>
          <strong>{minutes} минут</strong>
          <small>Хорошее время, чтобы стать чуть ближе к своим целям.</small>
          <em>Ты можешь!</em>
        </span>
      </button>
      <div className="companion-energy-label">
        <b>Как твоя энергия?</b>
        <button onClick={() => go("home")}>Подобрать задачи</button>
      </div>
      <div className="companion-energy">
        {(
          [
            ["low", "Спокойно"],
            ["medium", "Нормально"],
            ["high", "Много сил"],
          ] as [EnergyLevel, string][]
        ).map(([value, label]) => (
          <button
            key={value}
            aria-pressed={energy === value}
            onClick={() => setEnergy(slot, value)}
          >
            {label}
          </button>
        ))}
        <button onClick={() => setOpen(true)} aria-label="Помощь с планом дня">
          Помоги мне
        </button>
      </div>
      <CompanionAssistant open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
