"use client";

import Image from "next/image";
import CompanionAssistant from "./companion/CompanionAssistant";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useHydrated, useUserStore } from "@/store/useUserStore";

const GUIDES: Record<
  string,
  {
    title: string;
    text: string;
    tip: string;
    pose: string;
    href: string;
    action: string;
  }
> = {
  today: {
    title: "Хороший день начинается с малого",
    text: "Выбери одно посильное дело. Остальное — шаг за шагом.",
    tip: "Добавь задачу ниже и назначь удобное время. Не забивай весь день: оставь место для отдыха.",
    pose: "guide",
    href: "/calendar",
    action: "Открыть календарь",
  },
  home: {
    title: "Найдём действие под твой ритм?",
    text: "Пять минут тоже считаются. Начни с того, на что есть силы.",
    tip: "Выбери энергию и время, затем возьми карточку из колоды. Выполни действие, прежде чем брать следующее.",
    pose: "guide",
    href: "/today",
    action: "Мой день",
  },
  calendar: {
    title: "Оставь в планах место для себя",
    text: "Дела, отдых и маленькие победы — в одном ритме.",
    tip: "Выбери день, чтобы посмотреть задачи. Распределяй нагрузку так, чтобы план оставался выполнимым.",
    pose: "guide",
    href: "/today",
    action: "К задачам",
  },
  progress: {
    title: "Посмотри, сколько уже позади",
    text: "Каждый выполненный шаг — вклад в твой рост.",
    tip: "Опыт и характеристики растут от завершённых действий. Сравнивай себя с собой, а не с чужим темпом.",
    pose: "win",
    href: "/app",
    action: "К персонажу",
  },
  learn: {
    title: "Разберёмся вместе",
    text: "Одна тема за раз. Понимание важнее спешки.",
    tip: "Начни с предмета, выбери тему и проверь себя на практике. К сложным вопросам можно вернуться позже.",
    pose: "read",
    href: "/events",
    action: "Учебные ивенты",
  },
  account: {
    title: "Твоё пространство. Твои правила",
    text: "Настрой YeahGrind так, чтобы тебе было удобно.",
    tip: "Здесь собраны настройки аккаунта и подключений. В персонализации можно изменить внешний вид приложения.",
    pose: "guide",
    href: "/personalization",
    action: "Персонализация",
  },
  community: {
    title: "Вместе немного легче",
    text: "Поддерживайте друг друга и отмечайте маленькие победы.",
    tip: "Пригласи друзей и попробуйте общий челлендж. Поддержка помогает вернуться к делу даже после сложного дня.",
    pose: "win",
    href: "/challenge30",
    action: "Челлендж на 30 дней",
  },
};

export default function MascotGuide({ section }: { section?: string }) {
  const path = usePathname();
  const hydrated = useHydrated();
  const onboarded = useUserStore((s) => s.onboarded);
  const [expanded, setExpanded] = useState(false);
  const key = section ?? path.split("/")[1];
  const guide = GUIDES[key] ?? {
    title: "Давай сделаем следующий шаг",
    text: "Я рядом, чтобы помочь освоиться в YeahGrind.",
    tip: "Вернись к плану дня, чтобы выбрать задачу, или открой учебный раздел для работы с темами.",
    pose: "guide",
    href: "/today",
    action: "К плану дня",
  };
  // Contextual help belongs on Today; standalone courses have their own tutor.
  if (!hydrated || !onboarded || key !== "home") return null;
  return (
    <>
      <button
        className="companion-mini-guide"
        onClick={() => setExpanded(true)}
      >
        <Image
          src="/companion/portrait.webp"
          unoptimized
          width={70}
          height={80}
          alt=""
        />
        <span>
          <b>{guide.title}</b>
          <small>Помочь с маленьким шагом?</small>
        </span>
        <span aria-hidden="true">+</span>
      </button>
      <CompanionAssistant open={expanded} onClose={() => setExpanded(false)} />
    </>
  );
}
