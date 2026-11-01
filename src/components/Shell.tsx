"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { isRmtPath, isVersionPicker } from "@/lib/appMode";
import LanguageSwitcher from "@/i18n/LanguageSwitcher";
import "./app-experience.css";
import "./companion/companion.css";
import "./mono/mono.css";
import "./dayflow/dayflow.css";
import "./capsule-nav.css";
import "./dayflow/polish.css";
const AppChrome = dynamic(() => import("./AppChrome"));
const PUBLIC = new Set(["/", "/ordinary", "/terms", "/privacy", "/login", "/login/lms", "/register", "/forgot-password", "/oauth/authorize"]);
const AUTH = new Set(["/login", "/login/lms", "/register", "/forgot-password"]);
export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const plain = PUBLIC.has(path) || path.startsWith("/invite/") || path === "/admin" || path.startsWith("/admin/") || path === "/team" || path.startsWith("/team/") || isRmtPath(path) || isVersionPicker(path);
  if (plain) return <div className="min-h-dvh">{AUTH.has(path) && <LanguageSwitcher className="fixed right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-50 bg-[var(--color-bg)]" />}{children}</div>;
  return <AppChrome>{children}</AppChrome>;
}
