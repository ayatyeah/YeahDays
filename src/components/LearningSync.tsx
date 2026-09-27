"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useLearningStore } from "@/store/useLearningStore";
export default function LearningSync() {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "loading") return;
    const owner = session?.user?.id;
    useLearningStore.getState().reset(owner ?? null);
    if (!owner) return;
    const load = () => { if (document.visibilityState === "visible") void useLearningStore.getState().load(owner); };
    load(); window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, [session?.user?.id, status]);
  return null;
}
