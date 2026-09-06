import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import Logo from "@/components/Logo";
import Button from "@/components/ui/Button";

/**
 * Экран согласия «Войти через YeahGrind» — то, куда сторонний сервис
 * (StudyLoop) присылает браузер пользователя вместо того, чтобы просить
 * вручную скопировать код из профиля (см. PairingCodeCard — этот путь
 * остаётся рабочим отдельно, для сервисов без браузерного редиректа).
 *
 * ?client_id=<ApiKey.id>&redirect_uri=<зарегистрированный>&state=<опаque>
 *
 * Неавторизованного пользователя сюда не пускает src/proxy.ts (страница не
 * в PUBLIC_PATHS) — редиректит на /login?callbackUrl=... и возвращает назад
 * с сохранённым query (см. фикс в proxy.ts). Сессию всё равно проверяем и
 * здесь — тот же приём, что у /admin (requireOwner): реальная граница не
 * должна держаться на одном месте.
 *
 * redirect_uri сверяется с ApiKey.redirectUris ДО показа чего-либо — если
 * не совпал, дальше НИКУДА не редиректим (иначе это открытый редирект,
 * классическая дыра OAuth-провайдеров). Согласие/отказ обрабатывает
 * POST /api/oauth/approve — та же самая проверка client_id/redirect_uri
 * там ПОВТОРЯЕТСЯ, потому что форма ниже — не то место, которому можно
 * доверять как границе безопасности.
 */
export default async function OAuthAuthorizePage({
  searchParams,
}: {
  searchParams: Promise<{ client_id?: string; redirect_uri?: string; state?: string }>;
}) {
  const { client_id: clientId, redirect_uri: redirectUri, state } = await searchParams;

  const session = await auth();
  if (!session?.user?.id) {
    const qs = new URLSearchParams({
      client_id: clientId ?? "",
      redirect_uri: redirectUri ?? "",
      state: state ?? "",
    });
    redirect(`/login?callbackUrl=${encodeURIComponent(`/oauth/authorize?${qs}`)}`);
  }

  const key =
    clientId && redirectUri
      ? await prisma.apiKey.findUnique({ where: { id: clientId } })
      : null;
  const valid = !!key && !key.revokedAt && key.redirectUris.includes(redirectUri!);

  if (!valid) {
    return (
      <Card>
        <h1 className="text-[22px] font-bold tracking-tight">Ссылка недействительна</h1>
        <p className="mt-2 text-[15px] leading-snug text-[var(--color-fg-dim)]">
          Сервис прислал неверный или устаревший запрос на подключение.
          Попробуй начать привязку заново со стороны сервиса.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <h1 className="text-[22px] font-bold tracking-tight">
        Подключить «{key.service}»?
      </h1>
      <p className="mt-2 text-[15px] leading-snug text-[var(--color-fg-dim)]">
        Сервис сможет добавлять задачи в твой план и засчитывать выполненные
        активности так же, как в самом YeahGrind — на аккаунт{" "}
        <strong>{session.user.email ?? session.user.name}</strong>.
      </p>

      <form method="POST" action="/api/oauth/approve" className="mt-6 flex flex-col gap-2.5">
        <input type="hidden" name="client_id" value={clientId} />
        <input type="hidden" name="redirect_uri" value={redirectUri} />
        <input type="hidden" name="state" value={state ?? ""} />
        <Button type="submit" name="decision" value="approve" variant="primary" size="lg" className="w-full">
          Разрешить
        </Button>
        <Button type="submit" name="decision" value="deny" variant="surface" size="lg" className="w-full">
          Отмена
        </Button>
      </form>
    </Card>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-[380px]">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Logo glow className="h-10 w-auto" />
        </div>
        <div className="rounded-3xl surface p-5">{children}</div>
      </div>
    </div>
  );
}
