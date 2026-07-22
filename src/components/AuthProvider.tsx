"use client";

import { SessionProvider } from "next-auth/react";
import AccountSync from "./AccountSync";
import StateSync from "./StateSync";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AccountSync />
      <StateSync />
      {children}
    </SessionProvider>
  );
}
