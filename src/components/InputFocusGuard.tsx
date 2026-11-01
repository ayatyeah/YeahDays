"use client";
import { useEffect } from "react";
/** Hide optional floating UI while a person is entering text, including Android
 * keyboards that resize the layout viewport and report zero keyboard inset. */
export default function InputFocusGuard() {
  useEffect(() => {
    const update = () => {
      const el = document.activeElement;
      const editing = el instanceof HTMLElement && (el.matches('textarea, input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="button"]):not([type="submit"])') || el.isContentEditable);
      document.documentElement.toggleAttribute("data-editing", editing);
    };
    const out = () => queueMicrotask(update);
    document.addEventListener("focusin", update); document.addEventListener("focusout", out);
    return () => { document.removeEventListener("focusin", update); document.removeEventListener("focusout", out); document.documentElement.removeAttribute("data-editing"); };
  }, []);
  return null;
}
