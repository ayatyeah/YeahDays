"use client";

import { useState } from "react";

/**
 * Иллюстрация в конспекте. Файлы лежат в public/events/<ивент>/ и
 * добавляются отдельно от текста (см. docs/events/*-images.md). Пока
 * файла нет, блок не показывается вовсе: сломанная картинка в учебном
 * тексте хуже её отсутствия.
 */
export default function NotesImage({ src, alt }: { src: string; alt: string }) {
  const [missing, setMissing] = useState(false);
  if (missing) return null;
  return (
    <figure className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)]">
      <img src={src} alt={alt} loading="lazy" className="w-full" onError={() => setMissing(true)} />
      <figcaption className="px-4 py-2 text-xs text-[var(--color-muted)]">{alt}</figcaption>
    </figure>
  );
}
