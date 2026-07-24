/**
 * Разделы правовых страниц.
 *
 * Вынесены из terms/page.tsx: пока они жили рядом со страницей, любая
 * правка её разметки грозила задеть экспортируемые хелперы, которыми
 * пользуется и privacy.
 */

export function Section({
  title,
  children,
  accent,
}: {
  title: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <section className={accent ? "marble mt-6 rounded-3xl p-5" : "mt-7"}>
      <h2 className="text-[16px] font-bold">{title}</h2>
      <p className="mt-2.5 text-[14px] leading-relaxed text-[var(--color-fg-dim)]">
        {children}
      </p>
    </section>
  );
}

export function Mail() {
  return (
    <a
      href="mailto:balmagambet.ayat@gmail.com"
      className="underline underline-offset-4"
    >
      balmagambet.ayat@gmail.com
    </a>
  );
}
