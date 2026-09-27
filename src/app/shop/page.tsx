"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { SKINS } from "@/lib/learning";
import { useLearningStore } from "@/store/useLearningStore";
import { useLearningActions } from "@/components/useLearningActions";
export default function SkinShopPage() {
  const { owner, busy, error, action } = useLearningActions();
  const data = useLearningStore(s => s.owner === owner ? s.data : null);
  const loadError = useLearningStore(s => s.error);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  useEffect(() => { setPreview(null); setMessage(""); }, [owner]);
  const selected = SKINS.find(s => s.id === (preview ?? data?.equipped)) ?? SKINS[0];
  async function buy(id: string) { const result = await action({ action: "buy", skinId: id }); if (result) setMessage("Скин куплен. Теперь его можно надеть."); }
  async function equip(id: string) { const result = await action({ action: "equip", skinId: id }); if (result) { setPreview(null); setMessage("Скин надет — персонаж обновлён в профиле и прогрессе."); } }
  return <div className="mx-auto w-full max-w-5xl space-y-5 pb-6">
    <header className="flex flex-wrap items-center justify-between gap-3"><div><Link href="/account" className="text-sm underline">← Профиль</Link><h1 className="ios-title mt-2">Магазин скинов</h1></div><div className="rounded-2xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 font-semibold">◈ {data?.coins ?? "…"} монет</div></header>
    <p className="text-sm text-[var(--color-muted)]">Зарабатывай монеты за учебные квесты. Скины меняют внешний вид, а знания остаются с тобой.</p>
    <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
      <section className="surface rounded-3xl border border-[var(--color-border)] p-5 text-center lg:sticky lg:top-6 lg:self-start" style={{ backgroundImage: `radial-gradient(ellipse at 50% 35%, ${selected.color}22, transparent 70%)` }}>
        <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">{preview ? "Примерочная" : "Твой образ"}</p>
        <img src={selected.image} alt={`Примерка: ${selected.name}`} className="mx-auto mt-3 h-72 w-full object-contain" />
        <h2 className="mt-3 text-xl font-bold">{selected.name}</h2><p className="mt-1 text-sm text-[var(--color-muted)]">{selected.description}</p>
        <Link href="/learn" className="mt-5 block rounded-xl bg-[var(--color-fg)] px-4 py-3 text-sm font-semibold text-[var(--color-bg)]">Заработать монеты →</Link>
      </section>
      <div className="grid grid-cols-2 gap-3">{SKINS.map(skin => {
        const owned = data?.owned.includes(skin.id); const equipped = data?.equipped === skin.id;
        return <article key={skin.id} className="surface flex min-w-0 flex-col rounded-3xl border border-[var(--color-border)] p-3 sm:p-4">
          <button aria-label={`Примерить ${skin.name}`} onClick={() => setPreview(skin.id)} className="rounded-2xl" style={{ background: `radial-gradient(ellipse, ${skin.color}22, transparent 75%)` }}><img src={skin.image} alt={skin.name} className="h-44 w-full object-contain sm:h-52" /></button>
          <h2 className="mt-3 font-semibold">{skin.name}</h2><p className="mt-1 flex-1 text-xs text-[var(--color-muted)]">{skin.description}</p>
          <p className="my-3 text-sm font-semibold">{equipped ? "✓ Надет" : owned ? "В коллекции" : `◈ ${skin.price} монет`}</p>
          {owned ? <Button size="sm" disabled={busy || equipped} onClick={() => void equip(skin.id)}>{equipped ? "Выбран" : "Надеть"}</Button> : <Button size="sm" disabled={busy || !data || data.coins < skin.price} onClick={() => void buy(skin.id)}>Купить</Button>}
          {data && !owned && data.coins < skin.price && <p className="mt-2 text-xs text-[var(--color-muted)]">Ещё {skin.price - data.coins} монет</p>}
        </article>;
      })}</div>
    </div>
    {loadError && <div role="alert" className="surface rounded-2xl p-4">{loadError}{owner && <Button className="mt-3" onClick={() => void useLearningStore.getState().load(owner)}>Повторить</Button>}</div>}
    {error && <p role="alert" className="text-sm text-[var(--color-strength)]">{error}</p>}
    {message && <p role="status" className="surface rounded-2xl p-4 text-sm">{message}</p>}
  </div>;
}
