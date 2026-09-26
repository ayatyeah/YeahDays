/** Never echo provider-supplied error text or tokens into the page. */
export function oauthErrorMessage(error: string | null): string | null {
  if (!error) return null;
  if (error === "OAuthAccountNotLinked") return "Эта учётная запись не привязана к текущему профилю. Войди привычным способом и подключи Microsoft или Google в настройках профиля.";
  if (error === "AccessDenied") return "Вход не разрешён. Для Microsoft используй учётную запись AITU. Если нужен доступ администратора, обратись в IT университета.";
  if (error === "Configuration") return "Вход временно недоступен: требуется настройка на сервере.";
  return "Не удалось завершить вход. Попробуй ещё раз или используй другой способ входа.";
}
