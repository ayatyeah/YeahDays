"use client";

import { SessionProvider } from "next-auth/react";
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
      <StateSync />
      <StreakGuard />
      <EventFlusher />
      {children}
    </SessionProvider>
  );
}
