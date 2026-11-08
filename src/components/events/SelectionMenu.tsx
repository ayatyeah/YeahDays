"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { openTutorDraft } from "@/lib/tutorFocus";
import { TutorText } from "./Tutor";
import styles from "./selection-menu.module.css";

type SelectionInfo = { text: string; translation: string; lang: string; left: number; top: number };
export default function SelectionMenu() {
  const [selection, setSelection] = useState<SelectionInfo | null>(null);
  const [result, setResult] = useState("");
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
  function askTutor() {
    if (!selection) return;
    const question = `Объясни простыми словами этот фрагмент:\n\n${selection.text.slice(0, 1500)}`;
    close();
    window.getSelection()?.removeAllRanges();
    openTutorDraft(question);
  }

  if (!selection) return null;
  return createPortal(
    <div ref={panel} className={styles.panel} role="dialog" aria-label="Действия с выделенным текстом" style={{ left: selection.left, top: selection.top, "--selection-top": `${selection.top}px` } as CSSProperties} onMouseDown={(event) => { if ((event.target as Element).closest("button")) event.preventDefault(); }}>
      <div className={styles.heading}><span>✦ Выделенный текст</span><button type="button" aria-label="Закрыть меню выделения" onClick={close}>×</button></div>
      <div className={styles.actions}>
        <button type="button" disabled={!selection.translation} title={!selection.translation ? "Для этого фрагмента нет готового русского абзаца" : undefined} onClick={() => { setResult(selection.translation); setNotice(""); }}>На русском · без ИИ</button>
        <button type="button" onClick={() => void copy(selection.text)}>Копировать</button>
        <button type="button" aria-pressed={speaking} onClick={speak}>{speaking ? "Остановить" : "Озвучить"}</button>
        <button type="button" onClick={askTutor}>Спросить ИИ…</button>
      </div>
      {!selection.translation && <p className={styles.notice}>Готового перевода этого фрагмента нет.</p>}
      {result && <div className={styles.response}>
        <strong>Русская версия выделенных абзацев</strong>
        <div className={styles.result}><TutorText text={result} /></div>
        <button type="button" onClick={() => void copy(result)}>Скопировать ответ</button>
        <small>Из русской версии конспекта · показаны абзацы целиком</small>
      </div>}
      {error && <p role="alert" className={styles.error}>{error}</p>}
      {notice && <p role="status" className={styles.notice}>{notice}</p>}
    </div>, document.body,
  );
}
