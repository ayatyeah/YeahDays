"use client";

import { useOrdinaryVersion } from "./AppModeProvider";
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
  return (
    <SessionProvider>
      {ordinary && <>
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
