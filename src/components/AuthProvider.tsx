'use client';
import { SessionProvider } from 'next-auth/react';
// The main study app owns its server state. Legacy sync/analytics must not
// collect events or mutate old user plans in the background.
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
