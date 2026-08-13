import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

/**
 * Auth.js (v5). Два способа входа — Google и логин/пароль; хранилище —
 * тот же Postgres через Prisma-адаптер. Сессии — JWT (без обращения к БД
 * на каждый запрос — важно и для Credentials: PrismaAdapter сам по себе
 * не хранит сессии для credentials-провайдеров, только JWT-стратегия
 * работает с обоими провайдерами одинаково).
 * trustHost обязателен вне Vercel (у нас Railway).
 *
 * AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET — из env.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  pages: { signIn: "/login" },
  providers: [
    Google({
      // Без этого Google-вход с email, уже зарегистрированным по паролю,
      // падает с OAuthAccountNotLinked вместо входа в тот же аккаунт — а
      // именно так люди и будут привязывать Google из профиля. Цена —
      // если кто-то заранее зарегистрировал чужой email своим паролем,
      // сработает автослияние; при отсутствии подтверждения email на
      // регистрации это осознанный риск (см. src/app/api/auth/register).
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        identifier: { label: "Email или логин" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials) {
        const identifier = String(credentials?.identifier ?? "").trim();
        const password = String(credentials?.password ?? "");
        if (!identifier || !password) return null;

        const user = await prisma.user.findFirst({
          where: { OR: [{ email: identifier }, { username: identifier }] },
        });
        if (!user?.passwordHash) return null; // google-only аккаунт — пароля нет вовсе

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
  ],
  callbacks: {
    /**
     * Google — только вход/привязка к УЖЕ существующему аккаунту, не
     * самостоятельная регистрация: обязательные поля (логин, пароль, год
     * рождения) собираются только через /register. Без этой проверки
     * PrismaAdapter создал бы новую строку User прямо здесь при первом
     * же "Войти через Google" от кого угодно, в обход формы.
     */
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const email = profile?.email;
        if (!email) return false;
        const existing = await prisma.user.findUnique({
          where: { email },
          select: { id: true },
        });
        if (!existing) return "/login?googleFirst=1";
      }
      return true;
    },
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
