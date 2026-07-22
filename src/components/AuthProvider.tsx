"use client";

import { SessionProvider } from "next-auth/react";
import AccountSync from "./AccountSync";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AccountSync />
      {children}
    </SessionProvider>
  );
}
