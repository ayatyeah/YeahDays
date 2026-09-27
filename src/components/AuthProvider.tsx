"use client";

import { SessionProvider } from "next-auth/react";
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
  return (
    <SessionProvider>
      <AccountSync />
      <LearningSync />
      <StateSync />
      <StreakGuard />
      <EventFlusher />
      {children}
    </SessionProvider>
  );
}
