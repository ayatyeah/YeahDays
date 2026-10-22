"use client";

import { usePathname } from "next/navigation";
import { useOrdinaryVersion } from "./AppModeProvider";
import { PUBLIC_PATHS } from "@/lib/publicPaths";
import { SessionProvider } from "next-auth/react";
import PersonalizationSync from "./PersonalizationSync";
import LearningSync from "./LearningSync";
import AccountSync from "./AccountSync";
import StateSync from "./StateSync";
import StreakGuard from "./StreakGuard";
import EventFlusher from "./EventFlusher";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const ordinary = useOrdinaryVersion();
  // Public pages (landing, login, legal) have nothing to sync: an anonymous
  // visitor would only push a device id that has no User row.
  const publicPage = PUBLIC_PATHS.has(usePathname());
  return (
    <SessionProvider>
      {ordinary && !publicPage && <>
      <AccountSync />
      <LearningSync />
      <StateSync />
      <StreakGuard />
      <EventFlusher />
      <PersonalizationSync />
      </>}
      {children}
    </SessionProvider>
  );
}
