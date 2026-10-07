"use client";

import { useEffect } from "react";
import { create } from "zustand";
import type { TutorFocus } from "@/lib/tutor";

/**
 * Что сейчас на экране ивента — для ИИ-помощника. Страница ивента пишет
 * общий слой (какой экран, какая часть), а экраны внутри — подробности:
 * вопрос квиза, подпункт варианта, задачу тренажёра. Помощник склеивает оба.
 */

type Detail = Omit<TutorFocus, "view" | "partId" | "step" | "progress" | "selection">;

interface FocusState {
  base: Pick<TutorFocus, "view" | "partId" | "step" | "progress">;
  detail: Detail;
  /** Человекочитаемая подпись подробностей: «вопрос 3 из 10», «подпункт 2b». */
  label: string;
  /** Панель помощника открыта; ask — вопрос, который надо сразу задать. */
  open: boolean;
  ask: { text: string; at: number } | null;
  setBase: (base: FocusState["base"]) => void;
  setDetail: (detail: Detail, label?: string) => void;
  setOpen: (open: boolean, ask?: string) => void;
}

export const useTutorFocus = create<FocusState>((set) => ({
  base: {},
  detail: {},
  label: "",
  open: false,
  ask: null,
  setBase: (base) => set({ base }),
  setDetail: (detail, label = "") => set({ detail, label }),
  setOpen: (open, ask) => set({ open, ask: ask ? { text: ask, at: Date.now() } : null }),
}));

/** Открыть помощника; с текстом — сразу задать этот вопрос. */
export const openTutor = (ask?: string) => useTutorFocus.getState().setOpen(true, ask);

/**
 * Опубликовать подробности текущего экрана. key — сериализуемый отпечаток:
 * пока он не меняется, стор не трогаем. При уходе с экрана — очищаем.
 */
export function useTutorDetail(detail: Detail | null, label = "") {
  const key = detail ? JSON.stringify(detail) + label : "";
  useEffect(() => {
    useTutorFocus.getState().setDetail(detail ?? {}, detail ? label : "");
    // detail и label целиком описываются ключом
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => () => useTutorFocus.getState().setDetail({}), []);
}
