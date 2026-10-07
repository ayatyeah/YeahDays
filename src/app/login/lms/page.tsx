"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import MicrosoftSignIn from "@/components/MicrosoftSignIn";

export default function Page() {
  return <Suspense fallback={null}><MicrosoftPage /></Suspense>;
}
function MicrosoftPage() {
  const params = useSearchParams();
  const requested = params.get("callbackUrl") || "/settings";
  const callbackUrl = requested.startsWith("/") && !requested.startsWith("//") && !requested.includes("\\") ? requested : "/settings";
  return (
    <AuthShell mode="neutral" title="Вход через Microsoft AITU" subtitle="Продолжи с университетской учётной записью на странице Microsoft. При первом входе создадим личный профиль YeahGrind." tabs={false}>
      <MicrosoftSignIn callbackUrl={callbackUrl} />
      <p className="mt-4 text-sm leading-relaxed text-[#a0a39c]">Для дедлайнов после входа открой Настройки → Интеграции → LMS AITU и подключи личную ссылку календаря. Вход Microsoft не подключает календарь автоматически.</p>
      <Link href="/login?callbackUrl=%2Fsettings" className="mt-6 block text-center text-[15px] text-[#d3f693] underline-offset-2 hover:underline">Уже есть профиль? Войди привычным способом и привяжи Microsoft в настройках</Link>
      <Link href="/login" className="mt-3 block text-center text-[14px] text-[#a0a39c] hover:text-[#f2f3ed]">← Другие способы входа</Link>
    </AuthShell>
  );
}
