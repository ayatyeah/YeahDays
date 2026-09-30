"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { useUserStore } from "@/store/useUserStore";

import { YgIcon, type YgIconName } from "@/components/yg-icons";

const GUIDE: { label: string; icon: YgIconName; text: string }[] = [
  { label: "Сегодня", icon: "sun", text: "Пары и дедлайны на день. Здесь же — календарь и ИИ-помощник." },
  { label: "Учёба", icon: "book", text: "Выбери предмет и разбирай темы через объяснения и практику." },
  { label: "Сообщество", icon: "chat", text: "Пригласи друзей, собери команду и учитесь в общих комнатах фокуса." },
  { label: "Прогресс", icon: "chart", text: "Следи за своим уровнем, серией и выполненными целями." },
  { label: "Профиль", icon: "person", text: "Настрой аккаунт, персонажа, подключения и приватность." },
];

/**
 * Разовый гайд «как это устроено» — показываем сразу после онбординга, тем,
 * кто ещё не видел разделы приложения. Визуальный язык взят из WhatsNew.tsx
 * (та же шторка снизу), но это отдельный, более простой показ: не список
 * фич, а карта самих пяти разделов.
 *
 * Существующим аккаунтам с реальным прогрессом флаг seenGuide бэкфилится
 * в true при миграции/гидратации (см. useUserStore.ts) — их этим не грузим.
 *
 * Построен на общей шторке (ui/Modal), а не на собственном drag="y". Свой
 * вариант на iPhone был тупиком для нового пользователя: библиотека
 * анимации ставит на перетаскиваемый лист touch-action: pan-x, и iOS
 * запрещает вертикальную прокрутку списка внутри. Кнопка «Понятно» при
 * этом стояла за нижним краем экрана — ни увидеть, ни докрутить. Общая
 * шторка решает направление жеста сама (вниз в верхней точке — закрыть,
 * иначе — прокрутка), а кнопка теперь прилипает к низу листа.
 */
export default function AppGuide() {
  const onboarded = useUserStore((s) => s.onboarded);
  const seenGuide = useUserStore((s) => s.seenGuide);
  const completeGuide = useUserStore((s) => s.completeGuide);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!onboarded || seenGuide) return;
    const t = setTimeout(() => setOpen(true), 600);
    return () => clearTimeout(t);
  }, [onboarded, seenGuide]);

  // закрытие любым способом — свайп, фон, кнопка — считается просмотром
  const close = () => {
    completeGuide();
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={close}>
      <div role="dialog" aria-label="Как это устроено">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
          Коротко
        </p>
        <h2 className="mt-1.5 text-[28px] font-bold leading-tight">Как это устроено</h2>

        <ul className="mt-5 flex flex-col gap-3">
          {GUIDE.map((item) => (
            <li key={item.label} className="surface flex gap-3.5 rounded-2xl p-3.5">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface-2)]"
                aria-hidden
              >
                <YgIcon name={item.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[16px] font-semibold">{item.label}</p>
                <p className="mt-1 text-[15px] leading-snug text-[var(--color-fg-dim)]">
                  {item.text}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* Прилипает к низу видимой части листа: видна сразу, без
            прокрутки, на любом экране. bottom-0 отсчитывается от края
            области прокрутки за вычетом её нижнего отступа — отрицательное
            значение утапливало кнопку за край. -mx/px возвращают фон под
            кнопкой на всю ширину, чтобы проезжающий под ней список не
            просвечивал. */}
        <div className="sticky bottom-0 -mx-5 mt-4 bg-[var(--color-surface)] px-5 pb-3 pt-3">
          <button
            type="button"
            onClick={close}
            className="press h-12 w-full rounded-2xl bg-[var(--color-fg)] text-[16px] font-bold text-[var(--color-bg)]"
          >
            Понятно
          </button>
        </div>
      </div>
    </Modal>
  );
}
