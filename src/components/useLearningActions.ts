"use client";
import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useLearningStore } from "@/store/useLearningStore";
export function useLearningActions() {
  const { data: session } = useSession();
  const owner = session?.user?.id;
  const current = useRef(owner); current.current = owner;
  const lock = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function action(body: object) {
    if (!owner || lock.current) return null;
    lock.current = true; setBusy(true); setError("");
    try {
      const response = await fetch("/api/learning", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const result = await response.json();
      if (current.current !== owner) return null;
      if (!response.ok) throw new Error(result.error || "Не удалось выполнить действие");
      useLearningStore.getState().receive(owner, result.state);
      return result;
    } catch (e) { if (current.current === owner) setError(e instanceof Error ? e.message : "Нет связи с сервером"); return null; }
    finally { lock.current = false; setBusy(false); }
  }
  return { owner, busy, error, action };
}
