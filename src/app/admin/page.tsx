import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/owner";
import OwnerConsole from "@/components/OwnerConsole";
import { adminCredentialsAreDefault } from "@/lib/adminSession";

/**
 * Владельческая консоль сайта: список пользователей + смена паролей,
 * заявки «забыли пароль». Раньше на этом адресе жила личная страница
 * управления (категории/свои действия/дни/челленджи) — она переехала на
 * /manage и доступна всем как раньше; /admin теперь закрыт для всех,
 * кроме владельца (см. requireOwner).
 *
 * Попасть сюда можно двумя способами: войти владельческим аккаунтом
 * (OWNER_EMAIL) или открыть /admin/login и ввести логин с паролем из
 * переменных ADMIN_USER / ADMIN_PASSWORD.
 *
 * Проверка — серверная (redirect до рендера), а не клиентская: реальная
 * граница безопасности всё равно на каждом /api/owner/* роуте (никогда не
 * доверяем только тому, что страница не отрендерилась), но так чужой
 * аккаунт даже не увидит мелькание разметки консоли.
 */
export default async function AdminPage() {
  // Владельческий аккаунт ИЛИ вход логином и паролем (/admin/login).
  if (!(await requireAdmin())) redirect("/admin/login");
  return <OwnerConsole showCredentialsWarning={adminCredentialsAreDefault()} />;
}
