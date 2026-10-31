"use client";
import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { POLICY_VERSION } from "@/lib/personalization";
import { usePersonalizationStore } from "@/store/usePersonalizationStore";
import { useHydrated, useUserStore } from "@/store/useUserStore";

export default function PersonalizationSync() {
  const { data: session, status } = useSession();
  const owner = session?.user?.id;
  const path = usePathname();
  const state = usePersonalizationStore();
  const data = state.owner === owner ? state.data : null;
  const bannerRef = useRef<HTMLElement>(null);
  const hydrated = useHydrated();
  const onboarded = useUserStore((s) => s.onboarded);
  /*
   * Баннер — только когда ответ сервера уже пришёл и в нём нет согласия.
   * Раньше он рисовался и пока данных ещё нет (null !== версия): при каждой
   * загрузке у всех, кто давно всё принял, на полсекунды вылезала плашка и
   * сдвигала экран. Во время онбординга его тоже нет — согласие спрашивает
   * последний шаг онбординга, а новичок не должен читать «Обновлена политика»
   * на первом же экране.
   */
  const showBanner = Boolean(
    owner &&
      data &&
      data.version !== POLICY_VERSION &&
      hydrated &&
      onboarded &&
      !["/privacy", "/terms", "/personalization"].includes(path) &&
      !path.startsWith("/admin"),
  );
  useEffect(() => {
    const element = bannerRef.current;
    const update = () => document.documentElement.style.setProperty("--policy-banner-height", `${element?.getBoundingClientRect().height ?? 0}px`);
    update();
    const observer = new ResizeObserver(update);
    if (element) observer.observe(element);
    return () => { observer.disconnect(); document.documentElement.style.removeProperty("--policy-banner-height"); };
  }, [showBanner]);
  useEffect(() => {
    if (status === "loading") return;
    const store = usePersonalizationStore.getState(); store.reset(owner ?? null);
    if (!owner) return;
    const load = () => { if (document.visibilityState === "visible") void store.request(owner); };
    load(); window.addEventListener("focus", load);
    return () => { window.removeEventListener("focus", load); store.reset(null); };
  }, [owner, status]);
  useEffect(() => {
    if (!owner || !data?.enabled || data.version !== POLICY_VERSION) return;
    let lastInput = Date.now(); let eligibleSince = Date.now(); let pending = false;
    const input = () => { lastInput = Date.now(); };
    const visibility = () => { eligibleSince = Date.now(); };
    const events = ["pointerdown", "keydown", "scroll", "touchstart"];
    events.forEach(event => window.addEventListener(event, input, { passive: true, capture: true }));
    window.addEventListener("focus", visibility); window.addEventListener("blur", visibility); document.addEventListener("visibilitychange", visibility);
    const timer = setInterval(() => {
      const now = Date.now();
      if (document.visibilityState !== "visible" || !document.hasFocus() || now - lastInput > 60_000) { eligibleSince = now; return; }
      if (now - eligibleSince < 15000 || pending) return;
      pending = true;
      void usePersonalizationStore.getState().request(owner, { action: "heartbeat", section: window.location.pathname.split("/")[1] || "other" }).finally(() => { pending = false; });
    }, 15000);
    return () => { clearInterval(timer); events.forEach(event => window.removeEventListener(event, input, true)); window.removeEventListener("focus", visibility); window.removeEventListener("blur", visibility); document.removeEventListener("visibilitychange", visibility); };
  }, [owner, data?.enabled, data?.version]);
  if (!showBanner || !data) return null;
  // Кто ни разу ничего не принимал (вошёл через Google и пропустил шаг
  // онбординга), «обновлена» не говорим — для него политика не менялась.
  const updated = Boolean(data.version);
  return <aside ref={bannerRef} role="status" className="relative z-40 border-b border-violet-400/40 bg-[var(--color-surface)] px-4 py-3 text-sm">
    <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2">{updated
      ? <p><strong>Обновлена политика конфиденциальности.</strong> Теперь одно согласие вместо нескольких — прими один раз.</p>
      : <p><strong>Остался один шаг.</strong> Прими политику конфиденциальности — откроются сообщество и ИИ-помощник.</p>}<Link className="rounded-xl bg-[var(--color-fg)] px-3 py-2 font-semibold text-[var(--color-bg)]" href="/personalization">{updated ? "Прочитать и принять" : "Открыть"}</Link></div>
  </aside>;
}
