/** Keep history controls on secondary app screens, away from landing/auth and main tabs. */
export function showHistoryNavigation(pathname: string): boolean {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/learn") return false;
  return ["/events", "/learn", "/calendar", "/chat", "/settings", "/shop", "/challenge30", "/stories", "/manage", "/personalization"].some(root => path === root || path.startsWith(`${root}/`));
}

/** Existing app swipes remain available even where the button strip is hidden. */
export function allowHistoryGestures(pathname: string): boolean {
  return showHistoryNavigation(pathname) || ["/app", "/today", "/learn", "/community", "/progress", "/account"].includes(pathname);
}
