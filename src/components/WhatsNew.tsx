"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import { unseenFeatures, type Feature } from "@/lib/features";
import { useUserStore } from "@/store/useUserStore";
import { YgIcon } from "@/components/yg-icons";

/**
 * «Что нового» для тех, кто завёл аккаунт раньше.
 *
 * Показываем один раз и только человеку, который уже прошёл онбординг:
 * новичок эти разделы видел минуту назад, ему это шум.
 *
 * Шторка снизу, а не модалка по центру: до низа экрана дотягивается
 * большой палец, и жест закрытия совпадает с системным.
 *
 * Отмечаем показанным при закрытии, а не при открытии — если человек
 * закроет приложение на середине списка, в следующий раз он увидит
 * его снова, а не потеряет насовсем.
 *
 * На общей шторке (ui/Modal) по той же причине, что и AppGuide: свой
 * drag="y" ставил на лист touch-action: pan-x, и на iPhone длинный список
 * не прокручивался, а кнопка «Понятно» оставалась за краем экрана.
 */
export default function WhatsNew() {
  const onboarded = useUserStore((s) => s.onboarded);
  const seenGuide = useUserStore((s) => s.seenGuide);
  const seen = useUserStore((s) => s.seenFeatures);
  const markSeen = useUserStore((s) => s.markFeaturesSeen);

  const [items, setItems] = useState<Feature[] | null>(null);

  useEffect(() => {
    // ждём гидратации persist: на первом рендере seen ещё пустой,
    // и без задержки шторка мигнула бы даже новичку
    // seenGuide тоже ждём — AppGuide.tsx показывается первым, две шторки
    // снизу разом выглядели бы сломанно
    if (!onboarded || !seenGuide) return;
    const unseen = unseenFeatures(seen);
    if (unseen.length === 0) return;
    const t = setTimeout(() => setItems(unseen), 600);
    return () => clearTimeout(t);
  }, [onboarded, seen]);

  const close = () => {
    if (items) markSeen(items.map((f) => f.id));
    setItems(null);
  };

  return (
    <Modal open={!!items && items.length > 0} onClose={close}>
      <div role="dialog" aria-label="Что нового">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
          Пока тебя не было
        </p>
        <h2 className="mt-1.5 text-[28px] font-bold leading-tight">
          В приложении появилось новое
        </h2>

        <ul className="mt-5 flex flex-col gap-3">
          {(items ?? []).map((f) => (
            <li key={f.id} className="surface flex gap-3.5 rounded-2xl p-3.5">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface-2)]"
                aria-hidden
              >
                <YgIcon name={f.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[16px] font-semibold">{f.title}</p>
                <p className="mt-1 text-[15px] leading-snug text-[var(--color-fg-dim)]">{f.text}</p>
                {f.href && (
                  <Link
                    href={f.href}
                    onClick={close}
                    className="mt-2 inline-block text-[13px] font-semibold text-[var(--color-stability)] underline underline-offset-4"
                  >
                    Открыть
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* прилипает к низу видимой части листа — видна без прокрутки */}
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
