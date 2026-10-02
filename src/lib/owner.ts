import { auth } from "@/auth";
import { hasAdminSession } from "@/lib/adminSession";

/**
 * Единственный владелец сайта — определяется по email из переменной
 * окружения, а не флагом в БД: аккаунт один, лишняя миграция под роль не
 * нужна. Тот же email работает независимо от того, как вошли — паролем
 * или через привязанный Google (оба ведут в одну строку User).
 */
function normalize(email: string) {
  return email.trim().toLowerCase();
}

/**
 * Пускать ли в консоль: либо вошли владельческим аккаунтом, либо открыли
 * вторую дверь — логином и паролем админки (см. lib/adminSession.ts).
 * Роуты /api/owner/* используют результат как «да/нет», поэтому здесь
 * булево, а не сессия.
 */
export async function requireAdmin(): Promise<boolean> {
  if (await requireOwner()) return true;
  return hasAdminSession();
}

/**
 * Чей это вход, если вошли владельческим аккаунтом. Нужен там, где
 * консоль защищает владельца от самого себя («нельзя удалить себя»). При
 * входе логином и паролем своего пользователя нет — тогда null, и такой
 * проверке просто нечего сравнивать.
 */
export async function adminSelfId(): Promise<string | null> {
  const session = await requireOwner();
  return session?.user?.id ?? null;
}

export async function requireOwner() {
  const session = await auth();
  const email = session?.user?.email;
  const owner = process.env.OWNER_EMAIL;
  if (!email || !owner || normalize(email) !== normalize(owner)) {
    return null;
  }
  return session;
}
