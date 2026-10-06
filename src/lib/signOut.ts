import { signOut as nextAuthSignOut } from "next-auth/react";

/**
 * Выход из аккаунта.
 *
 * Сначала просим service worker забыть копии разделов: он отдаёт их из кэша
 * без сервера (см. INSTANT в sw.js), и следующий запуск на этом устройстве
 * мелькнул бы приложением прошлого человека, пока SessionGuard не увёл бы
 * на вход. controller, а не ready: без воркера (dev, первый заход) ready
 * не разрешается никогда, и выход бы завис.
 */
export function signOut(options?: Parameters<typeof nextAuthSignOut>[0]) {
  try {
    navigator.serviceWorker?.controller?.postMessage({ type: "FORGET_SHELL" });
  } catch {}
  return nextAuthSignOut(options);
}
