import type { Metadata } from "next";
import AppShell from "@/components/AppShell";

/**
 * План на сегодня — точка входа в оболочку приложения.
 *
 * Маршрут остаётся ради deep-link (уведомления, ярлыки манифеста, обычная
 * ссылка), но внутри приложения переключение сюда идёт без навигации:
 * это раздел одной оболочки, а не отдельная страница.
 */
export const metadata: Metadata = {
  title: "План на сегодня — YeahGrind",
};

export default function Page() {
  return <AppShell initialTab="today" />;
}
