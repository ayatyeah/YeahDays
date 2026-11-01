"use client";
import { useCopy } from "@/i18n/useCopy";


import { useEffect, useState } from "react";
import { getProviders, signIn, useSession } from "next-auth/react";
import Button from "@/components/ui/Button";

export default function MicrosoftSignIn({ callbackUrl = "/settings" }: { callbackUrl?: string }) {
  const tx = useCopy();
  const { status } = useSession();
  const [available, setAvailable] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setError(""); setAvailable(null);
    getProviders().then((providers) => {
      if (!active) return;
      if (!providers) { setError(tx("Не удалось проверить доступность Microsoft-входа")); return; }
      setAvailable(!!providers["microsoft-entra-id"]);
    }).catch(() => { if (active) setError(tx("Нет связи с сервером")); });
    return () => { active = false; };
  }, [retry]);

  async function begin() {
    setBusy(true); setError("");
    try {
      // Protect users still controlled by an older worker that ignores API preloads.
      // Do this before leaving for Microsoft; the callback code is single-use.
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        await registration?.navigationPreload?.disable();
      }
      const result = await signIn("microsoft-entra-id", { redirect: false, callbackUrl });
      if (!result?.url || result.error) throw new Error();
      // This is the authorization URL returned by Auth.js, with its state/PKCE cookies.
      window.location.assign(result.url);
    } catch { setError(tx("Не удалось открыть Microsoft. Попробуй ещё раз.")); setBusy(false); }
  }

  return <div>
    {available === false ? <p className="text-sm text-[var(--color-muted)]">{tx("Вход Microsoft ещё настраивается. Пока используй обычный вход в YeahGrind.")}</p> : <Button
      variant="primary" disabled={!available || busy || status === "loading"} onClick={() => void begin()} className="w-full"
    >{busy ? tx("Открываем Microsoft…") : available === null ? tx("Проверяем Microsoft-вход…") : status === "authenticated" ? tx("Привязать Microsoft AITU") : tx("Продолжить с Microsoft AITU")}</Button>}
    {status === "authenticated" && available && <p className="mt-2 text-xs text-[var(--color-muted)]">{tx("Microsoft будет привязан к текущему профилю YeahGrind.")}</p>}
    {error && <div className="mt-2"><p role="alert" className="text-sm text-[var(--color-strength)]">{error}</p><button type="button" className="mt-2 text-sm underline" onClick={() => setRetry((v) => v + 1)}>{tx("Повторить проверку")}</button></div>}
  </div>;
}
