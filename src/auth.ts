import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { rateLimit, clientIp } from "@/lib/rateLimit";

/**
 * Валидный bcrypt-хэш несуществующего пароля — сравниваем с ним, когда
 * юзера нет или у него google-only аккаунт (passwordHash: null), чтобы
 * bcrypt.compare() выполнялся ВСЕГДА одинаковое время. Без этого время
 * ответа выдаёт, существует ли email/логин: "юзера нет" отвечает мгновенно,
 * а "неверный пароль" — с задержкой bcrypt (~100мс) — оракул для перебора
 * зарегистрированных аккаунтов.
 */
const DUMMY_HASH = "$2b$12$JW9b/fVt38j4JgP3ZnU0eeDaYTXRInFqz7peFp62M49J2i7TCOD0O";

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
      async authorize(credentials, request) {
        const identifier = String(credentials?.identifier ?? "").trim();
        const password = String(credentials?.password ?? "");
        if (!identifier || !password) return null;

        // По IP (любой аккаунт с одного адреса) и по identifier (один
        // аккаунт с разных адресов) отдельно — иначе распределённый перебор
        // одного логина с ботнета обходит IP-лимит.
        const ip = clientIp(request);
        const okByIp = rateLimit(`login:ip:${ip}`, 20, 15 * 60 * 1000);
        const okByIdentifier = rateLimit(`login:id:${identifier.toLowerCase()}`, 8, 15 * 60 * 1000);
        if (!okByIp || !okByIdentifier) return null;

        const user = await prisma.user.findFirst({
          where: { OR: [{ email: identifier }, { username: identifier }] },
        });
        const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
        if (!valid || !user?.passwordHash || user.banned) return null;

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
     *
     * Но если человек уже вошёл (жмёт "Привязать Google" из профиля) —
     * это привязка к ТЕКУЩЕЙ сессии, и Auth.js сам линкует новую identity
     * к session.user.id независимо от того, совпадает ли email Google с
     * чем-то в базе (см. handleLoginOrRegister — ветка "if (user)" не
     * трогает email вообще). Блокировать по email в этом случае нельзя:
     * тогда привязка Google с ДРУГИМ email (не как у пароля) ошибочно
     * принималась бы за попытку регистрации и отклонялась.
     */
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const session = await auth();
        if (session?.user?.id) return true; // привязка к уже вошедшему — всегда можно

        const email = profile?.email;
        if (!email) return false;
        const existing = await prisma.user.findUnique({
          where: { email },
          select: { id: true, banned: true },
        });
        if (!existing) return "/login?googleFirst=1";
        if (existing.banned) return false;
      }
      return true;
    },
    /**
     * jwt() выполняется на КАЖДЫЙ auth()/useSession(), не только при входе
     * (см. официальную документацию Auth.js) — этим и пользуемся: если
     * владелец забанил аккаунт или удалил его из /admin уже после того,
     * как у человека есть валидный JWT, следующая же проверка это увидит
     * и обнулит сессию (return null здесь = auth() отдаёт "не вошёл").
     * Обычный "без обращения к БД на каждый запрос" довод для credentials
     * тут осознанно нарушен — без этого бан не мешал бы уже открытой сессии
     * до истечения токена (JWT нельзя отозвать раньше срока иначе).
     */
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { banned: true },
        });
        if (!dbUser || dbUser.banned) return null;
      }
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
