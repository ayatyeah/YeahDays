/**
 * Анонимный идентификатор устройства. Пока нет аутентификации — этим
 * ключом события и история привязываются к пользователю на сервере.
 * Когда добавим аккаунты, этот id можно будет слинковать с настоящим.
 */
const KEY = "yd-uid";

export function getUserId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}
