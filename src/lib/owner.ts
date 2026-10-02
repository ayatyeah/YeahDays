import { auth } from "@/auth";

/**
 * Единственный владелец сайта — определяется по email из переменной
 * окружения, а не флагом в БД: аккаунт один, лишняя миграция под роль не
 * нужна. Тот же email работает независимо от того, как вошли — паролем
 * или через привязанный Google (оба ведут в одну строку User).
 */
function normalize(email: string) {
  return email.trim().toLowerCase();
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

/**
 * Пускать ли в консоль. На этой ветке вход один — владельческий аккаунт;
 * функция нужна, чтобы роуты /api/owner/* были одинаковыми здесь и в
 * основной ветке, где у консоли есть ещё и вход по паролю.
 */
export async function requireAdmin(): Promise<boolean> {
  return !!(await requireOwner());
}
