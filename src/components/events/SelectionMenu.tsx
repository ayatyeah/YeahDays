"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { translateSelection } from "@/lib/selectionTranslation";
import { openTutorDraft } from "@/lib/tutorFocus";
import { TutorText } from "./Tutor";
import styles from "./selection-menu.module.css";

type SelectionInfo = { text: string; translation: string; lang: string; left: number; top: number };
export default function SelectionMenu() {
  const [selection, setSelection] = useState<SelectionInfo | null>(null);
  const [result, setResult] = useState("");
  const [resultType, setResultType] = useState<"translation" | "source">("translation");
  const [busy, setBusy] = useState(false);
  const request = useRef<AbortController | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const selectedText = useRef("");
  const ownSpeech = useRef(false);

  const stopSpeech = useCallback(() => {
    if (ownSpeech.current && "speechSynthesis" in window) window.speechSynthesis.cancel();
    ownSpeech.current = false;
    setSpeaking(false);
  }, []);
  const close = useCallback(() => {
    request.current?.abort(); request.current = null; setBusy(false);
    selectedText.current = "";
    setSelection(null);
    stopSpeech();
  }, [stopSpeech]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function update() {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;
      const range = sel.getRangeAt(0);
      if (panel.current?.contains(range.startContainer)) return;
      const element = range.startContainer.nodeType === Node.ELEMENT_NODE ? range.startContainer as Element : range.startContainer.parentElement;
      const root = element?.closest("[data-selection-notes]");
      const text = sel.toString().trim();
      if (!text || !root || !root.contains(range.endContainer) || element?.closest("button, input, textarea, [contenteditable=true]")) {
        if (!panel.current?.contains(document.activeElement)) close();
        return;
      }
      const rect = range.getBoundingClientRect();
      if (!rect.width && !rect.height) return;
      if (text === selectedText.current) return;
      stopSpeech();
      request.current?.abort(); request.current = null; setBusy(false);
      selectedText.current = text;
      const translated = Array.from(root.querySelectorAll("[data-selection-translation]")).filter((node) => range.intersectsNode(node)).map((node) => node.getAttribute("data-selection-translation")).filter(Boolean).join("\n\n");
      setSelection({ text, translation: translated, lang: root.getAttribute("lang") || "en", left: Math.max(12, Math.min(rect.left, window.innerWidth - 372)), top: Math.max(12, Math.min(rect.bottom + 12, window.innerHeight - 360)) });
      setResult(""); setError(""); setNotice("");
    }
    function schedule() { clearTimeout(timer); timer = setTimeout(update, 180); }
    function key(event: KeyboardEvent) { if (event.key === "Escape") { clearTimeout(timer); close(); } }
    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !panel.current?.contains(event.target)) close();
    }
    document.addEventListener("selectionchange", schedule);
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", close);
    // Scrolling dismisses the bubble so it cannot drift away from its quote.
    function scroll(event: Event) { if (!(event.target instanceof Node) || !panel.current?.contains(event.target)) close(); }
    document.addEventListener("scroll", scroll, true);
    return () => {
      clearTimeout(timer);
      request.current?.abort();
      document.removeEventListener("selectionchange", schedule);
      document.removeEventListener("keydown", key);
      document.removeEventListener("pointerdown", outside);
      window.removeEventListener("resize", close);
      document.removeEventListener("scroll", scroll, true);
      if (ownSpeech.current && "speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, [close, stopSpeech]);

  async function copy(text: string) {
    try { await navigator.clipboard.writeText(text); setNotice("Скопировано"); setError(""); }
    catch { setError("Не удалось скопировать. Используй Ctrl+C или системное меню выделения."); }
  }
  function speak() {
    if (!selection) return;
    if (speaking) { stopSpeech(); return; }
    if (!("speechSynthesis" in window)) { setError("Озвучивание недоступно в этом браузере."); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(selection.text);
    utterance.lang = selection.lang === "ru" ? "ru-RU" : "en-US";
    utterance.onend = () => { ownSpeech.current = false; setSpeaking(false); };
    utterance.onerror = () => { ownSpeech.current = false; setSpeaking(false); };
    ownSpeech.current = true;
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }
  async function translate() {
    if (!selection) return;
    request.current?.abort();
    const controller = new AbortController(); request.current = controller;
    setBusy(true); setError(""); setNotice(""); setResult(""); setResultType("translation");
    try {
      const text = await translateSelection(selection.text, selection.lang, controller.signal);
      if (request.current === controller) setResult(text);
    } catch (error) {
      if (request.current === controller && !controller.signal.aborted) setError(error instanceof Error && error.name !== "TypeError" && error.name !== "TimeoutError" ? error.message : "Переводчик не ответил. Проверь интернет и попробуй ещё раз.");
    } finally {
      if (request.current === controller) { request.current = null; setBusy(false); }
    }
  }
  function askTutor() {
    if (!selection) return;
    const question = `Объясни простыми словами этот фрагмент:\n\n${selection.text.slice(0, 1500)}`;
    close();
    window.getSelection()?.removeAllRanges();
    openTutorDraft(question);
  }

  if (!selection) return null;
  return createPortal(
    <div ref={panel} className={styles.panel} role="dialog" aria-label="Действия с выделенным текстом" style={{ left: selection.left, top: selection.top, "--selection-top": `${selection.top}px` } as CSSProperties} onMouseDown={(event) => { if ((event.target as Element).closest("button, a")) event.preventDefault(); }}>
      <div className={styles.heading}><span>✦ Выделенный текст</span><button type="button" aria-label="Закрыть меню выделения" onClick={close}>×</button></div>
      <div className={styles.actions}>
        <button type="button" disabled={busy} onClick={() => void translate()}>{busy ? "Перевожу…" : "Перевести выделенное"}</button>
        <button type="button" onClick={() => void copy(selection.text)}>Копировать</button>
        <button type="button" aria-pressed={speaking} onClick={speak}>{speaking ? "Остановить" : "Озвучить"}</button>
        <button type="button" onClick={askTutor}>Спросить ИИ…</button>
        {selection.translation && <button type="button" onClick={() => { request.current?.abort(); request.current = null; setBusy(false); setResultType("source"); setError(""); setResult(selection.translation); setNotice(""); }}>Русский абзац · без ИИ</button>}
      </div>
      {busy && <p role="status" className={styles.notice}>Перевожу выделенный фрагмент…</p>}
      {result && <div className={styles.response}>
        <strong>{resultType === "source" ? "Русская версия выделенных абзацев" : "Перевод выделенного фрагмента"}</strong>
        <div className={styles.result}>{resultType === "source" ? <TutorText text={result} /> : <p className="whitespace-pre-wrap">{result}</p>}</div>
        <button type="button" onClick={() => void copy(result)}>Скопировать ответ</button>
        <small>{resultType === "source" ? "Из русской версии конспекта · показаны абзацы целиком" : "Перевод: MyMemory · без Gemini"}</small>
      </div>}
      {error && <p role="alert" className={styles.error}>{error}</p>}
      {notice && <p role="status" className={styles.notice}>{notice}</p>}
    </div>, document.body,
  );
}
