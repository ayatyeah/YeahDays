"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { isRmtPath, isVersionPicker } from "@/lib/appMode";
import "./app-experience.css";
import "./companion/companion.css";
import "./mono/mono.css";
import "./dayflow/dayflow.css";
import "./capsule-nav.css";
import "./dayflow/polish.css";
const AppChrome = dynamic(() => import("./final/FinalChrome"));
const PUBLIC = new Set(["/", "/ordinary", "/terms", "/privacy", "/privacy/legacy", "/terms/legacy", "/login", "/login/lms", "/register", "/forgot-password", "/oauth/authorize"]);
export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const plain = PUBLIC.has(path) || path.startsWith("/invite/") || path === "/admin" || path.startsWith("/admin/") || path === "/team" || path.startsWith("/team/") || isRmtPath(path) || isVersionPicker(path);
  if (plain) return <div className="min-h-dvh">{children}</div>;
  return <AppChrome>{children}</AppChrome>;
}
