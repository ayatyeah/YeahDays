import { auth } from "@/auth";

/**
 * Единственный владелец сайта — определяется по email из переменной
 * окружения, а не флагом в БД: аккаунт один, лишняя миграция под роль не
 * нужна. Тот же email работает независимо от того, как вошли — паролем
 * или через привязанный Google (оба ведут в одну строку User).
 */
export async function requireOwner() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || !process.env.OWNER_EMAIL || email !== process.env.OWNER_EMAIL) {
    return null;
  }
  return session;
}
