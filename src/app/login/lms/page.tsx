"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";
import MicrosoftSignIn from "@/components/MicrosoftSignIn";

export default function Page() {
  return <Suspense fallback={null}><MicrosoftPage /></Suspense>;
}
function MicrosoftPage() {
  const params = useSearchParams();
  const requested = params.get("callbackUrl") || "/settings";
  const callbackUrl = requested.startsWith("/") && !requested.startsWith("//") && !requested.includes("\\") ? requested : "/settings";
  return <main className="flex min-h-dvh items-center justify-center px-5 py-10">
    <div className="w-full max-w-[400px]">
      <Logo className="mx-auto mb-6 h-10 w-auto" />
      <h1 className="text-center text-[22px] font-bold">Вход через Microsoft AITU</h1>
      <p className="mt-4 text-[15px] leading-relaxed">Продолжи с университетской учётной записью на странице Microsoft. При первом входе создадим личный профиль YeahGrind.</p>
      <div className="mt-5"><MicrosoftSignIn callbackUrl={callbackUrl} /></div>
      <p className="mt-4 text-sm text-[var(--color-muted)]">Для дедлайнов после входа открой Настройки → Интеграции → LMS AITU и подключи личную ссылку календаря. Вход Microsoft не подключает календарь автоматически.</p>
      <Link href="/login?callbackUrl=%2Fsettings" className="mt-6 block text-center underline">Уже есть профиль? Войди привычным способом и привяжи Microsoft в настройках</Link>
    </div>
  </main>;
}
