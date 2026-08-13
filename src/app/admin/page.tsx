import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/owner";
import OwnerConsole from "@/components/OwnerConsole";

/**
 * Владельческая консоль сайта: список пользователей + смена паролей,
 * заявки «забыли пароль». Раньше на этом адресе жила личная страница
 * управления (категории/свои действия/дни/челленджи) — она переехала на
 * /manage и доступна всем как раньше; /admin теперь закрыт для всех,
 * кроме владельца (см. requireOwner).
 *
 * Проверка — серверная (redirect до рендера), а не клиентская: реальная
 * граница безопасности всё равно на каждом /api/owner/* роуте (никогда не
 * доверяем только тому, что страница не отрендерилась), но так чужой
 * аккаунт даже не увидит мелькание разметки консоли.
 */
export default async function AdminPage() {
  const session = await requireOwner();
  if (!session) redirect("/today");
  return <OwnerConsole />;
}
