"use client";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import cardsEn from "@/lib/events/computerNetworksEndterm/express.en.json";
import cardsRu from "@/lib/events/computerNetworksEndterm/express.json";
import NotesToolbar from "./NotesToolbar";

export default function NetworksExpress({ userId, onReview, onExam }: { userId: string; onReview: (module: number) => void; onExam: () => void }) {
  const [lang, setLang] = useState<"en" | "ru">("en");
  const cards = lang === "en" ? cardsEn : cardsRu;
  const key = `yg:cn-express:v1:${userId}`;
  const [known, setKnown] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [weakOnly, setWeakOnly] = useState(false);
  const [minutes, setMinutes] = useState(180);
  useEffect(() => {
    try { const value: unknown = JSON.parse(localStorage.getItem(key) ?? "[]"); setKnown(Array.isArray(value) ? value.filter((id): id is string => typeof id === "string" && cardsRu.some(c => c.id === id)) : []); } catch { setKnown([]); }
    setReady(true);
  }, [key]);
  function toggle(id: string) {
    const next = known.includes(id) ? known.filter(v => v !== id) : [...known, id];
    setKnown(next);
    try { localStorage.setItem(key, JSON.stringify(next)); setSaveError(false); } catch { setSaveError(true); }
  }
  return <section className="space-y-5" data-testid="cn-express">
    <div className="space-y-3 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <h2 className="text-2xl font-bold">A focused review session.</h2>
      <p>Answer aloud before opening your notes. Then reveal the explanation and describe it in your own words. Revisit the module if you guessed or mixed up the concepts.</p>
      <div className="flex gap-2" role="group" aria-label="Review time">{[60,180].map(n => <Button key={n} variant={minutes === n ? "primary" : "ghost"} aria-pressed={minutes === n} onClick={() => setMinutes(n)}>{n === 60 ? "One hour" : "Three hours"}</Button>)}</div>
      {minutes === 60 ? <ol className="list-decimal space-y-2 pl-5"><li>15 minutes: TCP/UDP and applications · modules 14–15.</li><li>15 minutes: IOS, SSH and C/L/remote routes · modules 10, 16 and 8.</li><li>15 minutes: calculate an IPv4 subnet; review IPv6, ARP and ICMP · modules 11–13 and 9.</li><li>15 minutes: use the cards below and revisit mistakes. A full practice exam needs another 45 minutes.</li></ol> : <ol className="list-decimal space-y-2 pl-5"><li>35 minutes: TCP/UDP, ports, DNS/DHCP/HTTP/email · modules 14–15.</li><li>25 minutes: IOS and SSH · modules 10 and 16.</li><li>30 minutes: IPv4/VLSM and IPv6 · modules 11–12. Work on paper.</li><li>20 minutes: IP, routes, ARP/ND, ICMP · modules 8–9 and 13.</li><li>10 minutes: attack types and AAA · module 16.</li><li>45 minutes: take a practice exam without hints.</li><li>15 minutes: review mistakes and explain the reasoning again.</li></ol>}
      <p className="text-sm text-[var(--color-muted)]">This review plan follows the instructor’s announced priorities; it does not predict the next quiz. Check your own schedule for its date and format.</p>
      <div className="flex flex-wrap gap-2"><Button onClick={onExam}>Open the practice exam</Button><a className="rounded-xl border border-[var(--color-border)] px-4 py-3 underline" href="/events/computer-networks-endterm/express-prep.md" download>Download review notes · Russian</a></div>
    </div>
    <NotesToolbar lang={lang} onLang={setLang} />
    <div className="flex flex-wrap items-center justify-between gap-3"><p role="status">{ready ? `I can explain: ${known.length} of ${cards.length}` : "Loading your progress…"}</p><label className="flex min-h-11 items-center gap-2"><input type="checkbox" checked={weakOnly} onChange={e => setWeakOnly(e.target.checked)} />Show topics to revisit</label></div>
    <p className="text-sm text-[var(--color-muted)]">These self-checks are saved in this browser. They do not change your quiz results.</p>
    {saveError && <p role="alert">Your progress could not be saved. Keep the page open to retain this list.</p>}
    {cards.filter(c => !weakOnly || !known.includes(c.id)).map(c => <article key={c.id} className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <p className="text-xs text-[var(--color-muted)]">Module {c.module}</p><h3 className="font-bold" data-selection-notes lang={lang}>{c.question}</h3>
      <details><summary className="cursor-pointer py-2 font-semibold">Reveal the explanation</summary><p className="mt-2 leading-relaxed" data-selection-notes lang={lang}>{c.answer}</p><p className="mt-3 text-sm" lang="en">{c.english}</p><Button className="mt-3" variant="ghost" onClick={() => onReview(c.module)}>Review module {c.module}</Button></details>
      <label className="flex min-h-11 items-center gap-2"><input type="checkbox" disabled={!ready} checked={known.includes(c.id)} onChange={() => toggle(c.id)} />I can explain this without hints</label>
    </article>)}
    {weakOnly && known.length === cards.length && <p>Every card is checked. Try the practice exam next: recognizing an answer is different from recalling it independently.</p>}
  </section>;
}
