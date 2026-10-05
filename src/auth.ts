import NextAuth, { CredentialsSignin } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { failureLimit, clientIp, rateLimit } from "@/lib/rateLimit";
import { loginToLms, LmsError } from "@/lib/lmsClient";
import { saveLmsAccount, LmsAccountConflict } from "@/lib/lmsAccount";
import { microsoftProvider, MICROSOFT_PROVIDER, AITU_ENTRA_TENANT_ID } from "@/lib/microsoftAuth";

const microsoft = microsoftProvider();

class LmsSignInError extends CredentialsSignin {
  constructor(code: string) { super(); this.code = code; }
}

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
 * Auth.js (v5). Вход через LMS AITU, Google и логин/пароль; хранилище —
 * тот же Postgres через Prisma-адаптер. Сессии — JWT (без обращения к БД
 * на каждый запрос — важно и для Credentials: PrismaAdapter сам по себе
 * не хранит сессии для credentials-провайдеров, только JWT-стратегия
 * работает с обоими провайдерами одинаково).
 * trustHost обязателен вне Vercel (у нас Railway).
 *
 * AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET — из env.
 */
/** Сколько держим «не забанен» в памяти, прежде чем снова спросить базу. */
const BAN_CHECK_MS = 5 * 60 * 1000;
const banCheckedAt = new Map<string, number>();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  pages: { signIn: "/login" },
  providers: [
    ...(microsoft ? [microsoft] : []),
    // Ordinary Moodle credentials do not authenticate AITU Microsoft/OpenID users.
    ...(process.env.LMS_PASSWORD_LOGIN_ENABLED === "true" ? [Credentials({
      id: "lms-aitu",
      name: "LMS AITU",
      credentials: { username: {}, password: { type: "password" }, link: {} },
      async authorize(credentials, request) {
        const username = String(credentials?.username ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!username || username.length > 200 || !password || password.length > 1024) return null;
        const byLogin = failureLimit(`lms:id:${username}`, 6, 15 * 60_000);
        const ip = clientIp(request);
        if (!byLogin.allowed || !rateLimit(`lms:ip:${ip}`, 40, 15 * 60_000)) throw new LmsSignInError("lms_rate_limit");
        try {
          // Linking is explicit and always uses the current session, never a client userId.
          const session = credentials?.link === "1" ? await auth() : null;
          if (credentials?.link === "1" && !session?.user?.id) throw new LmsSignInError("lms_session");
          const identity = await loginToLms(username, password);
          const user = await saveLmsAccount(identity, username, session?.user?.id);
          return { id: user.id, name: user.name, email: user.email, image: user.image };
        } catch (e) {
          if (e instanceof LmsSignInError) throw e;
          if (e instanceof LmsAccountConflict) throw new LmsSignInError("lms_linked");
          if (e instanceof LmsError && e.code === "credentials") {
            byLogin.fail();
            throw new LmsSignInError("lms_credentials");
          }
          throw new LmsSignInError("lms_unavailable");
        }
      },
    })] : []),
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
     * Google — и вход, и регистрация: человек без аккаунта нажимает одну
     * кнопку, и PrismaAdapter создаёт ему пользователя с именем и почтой
     * из Google. Раньше регистрация шла только через форму (логин, пароль,
     * год рождения), а Google без аккаунта отправлял «сначала
     * зарегистрируйся» — лишний шаг, на котором люди уходили. Логин и год
     * рождения у такого аккаунта пустые, как и у вошедших через Microsoft;
     * пароль можно задать позже в профиле.
     *
     * Почта должна быть подтверждена самим Google. По ней же Google-вход
     * попадает в уже существующий аккаунт (allowDangerousEmailAccountLinking
     * выше), и неподтверждённый адрес позволил бы войти в чужой.
     *
     * Если человек уже вошёл (жмёт «Привязать Google» из профиля) — это
     * привязка к ТЕКУЩЕЙ сессии: Auth.js линкует identity к session.user.id
     * независимо от почты, и проверять её здесь нельзя — привязка Google с
     * ДРУГИМ адресом ошибочно отклонялась бы.
     */
    async signIn({ account, profile }) {
      if (account?.provider === MICROSOFT_PROVIDER) {
        if (profile?.tid !== AITU_ENTRA_TENANT_ID || !account.providerAccountId) return false;
        const linked = await prisma.account.findUnique({
          where: { provider_providerAccountId: {
            provider: MICROSOFT_PROVIDER, providerAccountId: account.providerAccountId,
          } },
          select: { user: { select: { banned: true } } },
        });
        // Auth.js creates new accounts or links to the current authenticated session.
        // Unlike Google, Microsoft is an explicit registration method for AITU students.
        return !linked?.user.banned;
      }
      if (account?.provider === "google") {
        const session = await auth();
        if (session?.user?.id) return true; // привязка к уже вошедшему — всегда можно

        /*
         * Уже привязанный Google — это вход, а не регистрация.
         *
         * Проверка ниже ищет пользователя по email из Google-профиля, и для
         * первого входа этого достаточно. Но после привязки из профиля
         * (ветка выше) email у Google может быть СВОЙ, отличный от email
         * аккаунта: у yeahayat в базе ayatbalmagambet@gmail.com, а привязан
         * Google с ayatbalmagambet.ab@gmail.com. При следующем входе таким
         * Google поиск по email ничего не находил, и человека отправляло
         * регистрироваться — при том, что связь давно существует.
         * Поэтому сначала спрашиваем саму связь.
         */
        if (account.providerAccountId) {
          const linked = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: "google",
                providerAccountId: account.providerAccountId,
              },
            },
            select: { user: { select: { banned: true } } },
          });
          if (linked) return !linked.user.banned;
        }

        const email = profile?.email;
        if (!email || profile?.email_verified !== true) return false;
        const existing = await prisma.user.findUnique({
          where: { email },
          select: { banned: true },
        });
        // Аккаунта нет — Auth.js создаст его; есть — войдёт в него, если он не заблокирован.
        if (existing?.banned) return false;
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
        const id = token.id as string;
        // Проверка бана — поход в базу на КАЖДЫЙ запрос к API (см. выше).
        // Держим результат в памяти процесса на BAN_CHECK_MS: бан начнёт
        // действовать с задержкой до пяти минут, зато сессия и /api/state
        // перестают платить за лишний запрос. В токен отметку класть
        // бесполезно: Auth.js переписывает куку раз в сутки (updateAge).
        // При входе (user есть) проверяем всегда.
        const checkedAt = user ? 0 : (banCheckedAt.get(id) ?? 0);
        if (Date.now() - checkedAt > BAN_CHECK_MS) {
          const dbUser = await prisma.user.findUnique({
            where: { id },
            select: { banned: true },
          });
          if (!dbUser || dbUser.banned) {
            banCheckedAt.delete(id);
            return null;
          }
          banCheckedAt.set(id, Date.now());
        }
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
