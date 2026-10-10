import Link from "next/link";

export default function AppBrand() {
  return (
    <Link href="/today" className="mono-brand" aria-label="YeahGrind — Сегодня">
      {/* Existing transparent brand mark; CSS supplies the monochrome tint. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-white.webp" width={36} height={28} alt="" />
      <span>YeahGrind</span>
    </Link>
  );
}
