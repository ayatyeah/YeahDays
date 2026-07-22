import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

/**
 * Auth.js (v5). Провайдер — Google; хранилище — тот же Postgres через
 * Prisma-адаптер. Сессии — JWT (без обращения к БД на каждый запрос).
 * trustHost обязателен вне Vercel (у нас Railway).
 *
 * AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET — из env.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [Google],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
