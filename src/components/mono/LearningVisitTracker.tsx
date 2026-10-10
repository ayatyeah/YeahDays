"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { learningVisitKey } from "@/lib/learningEvents";
export default function LearningVisitTracker() {
  const pathname = usePathname();
  const { data } = useSession();
  const owner = data?.user?.id;
  useEffect(() => {
    const id = /^\/events\/([^/]+)$/.exec(pathname)?.[1];
    if (!owner || !id) return;
    try {
      const key = learningVisitKey(owner);
      const visits = JSON.parse(localStorage.getItem(key) ?? "{}");
      localStorage.setItem(
        key,
        JSON.stringify({ ...visits, [id]: Date.now() }),
      );
    } catch {
      /* readiness remains the fallback if storage is unavailable */
    }
  }, [pathname, owner]);
  return null;
}
