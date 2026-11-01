"use client";
import { useEffect } from "react";
/** Hide floating UI while typing. Keep it hidden through the entire tap on a
 * form button: focusout happens before click, and restoring a banner there
 * can cover the button before the pointer is released. */
export default function InputFocusGuard() {
  useEffect(() => {
    let pointerDown = false;
    let timer: ReturnType<typeof setTimeout>;
    const update = () => {
      const el = document.activeElement;
      const editing = el instanceof HTMLElement && (el.matches('textarea, input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="button"]):not([type="submit"])') || el.isContentEditable);
      if (editing) document.documentElement.setAttribute("data-editing", "");
      else if (!pointerDown) document.documentElement.removeAttribute("data-editing");
    };
    const schedule = () => {
      clearTimeout(timer);
      // A macrotask runs after the pointerup/click sequence, unlike a microtask.
      timer = setTimeout(update, 0);
    };
    const down = () => { pointerDown = true; };
    const up = () => { pointerDown = false; schedule(); };
    document.addEventListener("focusin", update);
    document.addEventListener("focusout", schedule);
    document.addEventListener("pointerdown", down, true);
    window.addEventListener("pointerup", up, true);
    window.addEventListener("pointercancel", up, true);
    window.addEventListener("blur", up);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("focusin", update);
      document.removeEventListener("focusout", schedule);
      document.removeEventListener("pointerdown", down, true);
      window.removeEventListener("pointerup", up, true);
      window.removeEventListener("pointercancel", up, true);
      window.removeEventListener("blur", up);
      document.documentElement.removeAttribute("data-editing");
    };
  }, []);
  return null;
}
