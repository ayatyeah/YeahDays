"use client";
import { useEffect, useState } from "react";
import NotesToolbar from "./NotesToolbar";
import NetworksExpress from "./NetworksExpress";
import EventNotes from "@/components/EventNotes";
import { fullRu as notesRu, fullEn as notesEn } from "@/lib/events/computerNetworksEndterm/full-notes";
import Button from "@/components/ui/Button";
import bank from "@/lib/events/computerNetworksEndterm/bank.json";
import { isCorrect, newAttempt, openQuestions, parseAttempt, scoreAttempt, type Attempt } from "@/lib/events/computerNetworksEndterm/practice";

const root = "/events/computer-networks-endterm";
const panel = "space-y-3 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6";
const input = "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3";
export default function NetworksEndterm({ userId, onExit }: { userId: string; onExit: () => void }) {
  const [notesLang, setNotesLang] = useState<"ru" | "en">("en");
  const notes = notesLang === "ru" ? notesRu : notesEn;
  const [tab, setTab] = useState("materials");
  const [reviewModule, setReviewModule] = useState<number | null>(null);
  useEffect(() => {
    if (tab === "notes" && reviewModule !== null) document.getElementById(`cn-notes-module-${reviewModule}`)?.scrollIntoView({ block: "start" });
  }, [tab, reviewModule]);
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState(0);
  const [core, setCore] = useState(false);
  const [page, setPage] = useState(0);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [ready, setReady] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [now, setNow] = useState(0);
  const key = `yg:cn-endterm:v1:${userId}`;
  useEffect(() => {
    try { setAttempt(parseAttempt(localStorage.getItem(key))); } catch { setSaveError(true); }
    setNow(Date.now()); setReady(true);
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [key]);
  function save(next: Attempt) {
    setAttempt(next);
    try { localStorage.setItem(key,JSON.stringify(next)); setSaveError(false); } catch { setSaveError(true); }
  }
  const ended = !!attempt && (attempt.finished || now >= attempt.deadline);
  function update(next: Attempt) { if (!attempt || attempt.finished || Date.now() >= attempt.deadline) return; save(next); }
  const filtered = bank.filter(q => (!topic || q.topic === topic) && (!core || q.core) && `${q.id} ${q.prompt} ${q.options.join(" ")} ${q.explanation}`.toLowerCase().includes(search.toLowerCase()));
  const pages = Math.max(1, Math.ceil(filtered.length / 20));
  const seconds = attempt ? Math.max(0,Math.ceil((attempt.deadline-now)/1000)) : 2700;
  return <div className="space-y-5" data-no-i18n data-testid="cn-endterm">
    <Button data-reading-chrome variant="ghost" onClick={onExit}>← Back to the course</Button>
    <h1 data-reading-chrome className="text-2xl font-bold">Computer Networks · Study notebook</h1>
    <nav data-reading-chrome aria-label="Study sections" className="flex flex-wrap gap-2">
      {[["express","Quick review"],["materials","Materials"],["notes","Notes"],["bank","Question bank"],["sample","Exam sample"],["exam","Practice exam"]].map(([id,label]) => <Button key={id} variant={tab === id ? "primary" : "ghost"} aria-pressed={tab === id} onClick={() => setTab(id)}>{label}</Button>)}
    </nav>
    {tab === "express" && <NetworksExpress userId={userId} onExam={() => setTab("exam")} onReview={m => {setReviewModule(m);setTab("notes");}} />}
    {tab === "materials" && <>
      <section className={panel}><h2 className="text-xl font-bold">Lectures 5–10 · original slides</h2><p>Find topic notes and quizzes in the course route. Open the original slides here to explore their diagrams.</p>
        <div className="grid gap-3 sm:grid-cols-2">{["IP, ARP/ND, Router configuration","IPv4, Subnetting, VLSM","IPv6 and ICMP","Transport layer: TCP/UDP","Application layer","Network security"].map((title,i) => <a key={title} className="rounded-xl border border-[var(--color-border)] p-3 underline" href={`${root}/lecture-${i+5}.pdf`} target="_blank" rel="noreferrer">Lecture {i+5} · {title} ↗</a>)}</div>
      </section>
      <section className={panel}><h2 className="text-xl font-bold">Written exam format</h2><p>45 minutes · 30 questions · 100 points.</p><ul className="list-disc space-y-2 pl-5"><li>20 single-answer questions × 3 points.</li><li>5 questions with two or three answers × 4 points.</li><li>5 written answers × 4 points.</li></ul><p>Priorities: transport layer, application layer and Cisco IOS. Then review addressing, IP/ARP/ICMP and security.</p><a className="underline" href={`${root}/exam-info.txt`} target="_blank" rel="noreferrer">Instructor announcement and group schedule ↗</a></section>
      <section className={panel}><h2 className="text-xl font-bold">Keep a copy</h2>{[["notes-ru.md","Full notes · Russian"],["notes-en.md","Full notes · English"],["express-prep.md","Quick review and self-check"],["audit-report.md","Topic audit and question caveats"],["core-250.md","250 questions from modules 8–16"],["question-bank.md","558 cards with answers and explanations"]].map(([file,label]) => <a className="block py-2 underline" key={file} href={`${root}/${file}`} download>{label} ↓</a>)}<p className="text-sm text-[var(--color-muted)]">Sources: supplied lectures, announcement, sample exam and the NetAcad topic analysis saved on 7 November 2026. This collection covers available materials; it is not Cisco’s full private bank and does not predict the exam.</p></section>
    </>}
    {tab === "notes" && <section className={panel}><h2 className="text-xl font-bold">Your network notebook · Modules 8–16</h2><p>Keep the essentials close: rules, worked calculations, reference tables and commands. Open a module below to start reading.</p><NotesToolbar lang={notesLang} onLang={setNotesLang} />{Object.entries(notes).map(([module,text]) => <details id={`cn-notes-module-${module}`} key={module} open={reviewModule === Number(module) || undefined} className="g-notebook-chapter"><summary className="cursor-pointer py-3 font-bold">Module {module} · {text.split("\n")[0].replace(/^## \d+\. /, "")}</summary><EventNotes text={text} lang={notesLang} translation={notesLang === "en" ? notesRu[module as keyof typeof notesRu] : undefined} /></details>)}</section>}
    {tab === "sample" && <section className={panel}><h2 className="text-xl font-bold">Three questions from the sample</h2><a className="underline" href={`${root}/sample.pdf`} target="_blank" rel="noreferrer">Open the original PDF ↗</a>
      {[
        ["How many bits must be borrowed from the host portion of an address to accommodate a router with five connected networks?", "A. two · B. three · C. four · D. five", "B. three: 2² = 4 is insufficient; 2³ = 8 is sufficient."],
        ["What three blocks of addresses are defined by RFC 1918 for private network use? (Choose three.)", "A. 10.0.0.0/8 · B. 172.16.0.0/12 · C. 192.168.0.0/16 · D. 100.64.0.0/14 · E. 169.254.0.0/16 · F. 239.0.0.0/8", "A, B, C. These are the three private address ranges defined in RFC 1918."],
        [openQuestions[0].prompt, "Written question", openQuestions[0].answer],
      ].map(([q,options,answer],i) => <article className="space-y-3 border-t border-[var(--color-border)] pt-4" key={q}><h3 className="font-bold" data-selection-question lang="en">{i+1}. {q}</h3><p>{options}</p><details><summary className="cursor-pointer py-2">Answer and explanation</summary><p>{answer}</p></details></article>)}
    </section>}
    {tab === "bank" && <>
      <section className={panel}><h2 className="text-xl font-bold">Explore the question bank · 558 cards</h2><p className="text-sm">250 cards come directly from modules 8–16. Others cover the same topics in different sections and mixed tests. Diagram, matching and qualified questions are available for reading, but excluded from automatic practice.</p>
        <label className="block">Search<input className={input} value={search} onChange={e => {setSearch(e.target.value);setPage(0);}} placeholder="TCP, subnet, SSH, E200…" /></label>
        <label className="block">Module<select className={input} value={topic} onChange={e => {setTopic(Number(e.target.value));setPage(0);}}><option value={0}>All modules</option>{[8,9,10,11,12,13,14,15,16].map(m => <option key={m} value={m}>Module {m}</option>)}</select></label>
        <label className="flex min-h-11 items-center gap-2"><input type="checkbox" checked={core} onChange={e => {setCore(e.target.checked);setPage(0);}} />Только 250 questions from modules 8–16</label><p role="status">Found: {filtered.length} · page {page+1} / {pages}</p>
      </section>
      {filtered.slice(page*20,page*20+20).map(q => <article key={q.id} className={panel}><p className="text-xs text-[var(--color-muted)]">{q.id} · Module {q.topic} · {q.source}</p><h3 data-selection-question lang="en" className="font-bold">{q.prompt}</h3><ol data-selection-question lang="en" className="list-decimal space-y-2 pl-6">{q.options.map((o,i) => <li key={i}>{o}</li>)}</ol>{q.caution && <p className="rounded-xl bg-amber-500/10 p-3 text-sm">{q.caution}{/exhibit|diagram|refer to|packet tracer/i.test(q.prompt) ? " · Independent verification requires the original diagram or Packet Tracer file." : ""}</p>}<details><summary className="cursor-pointer py-2 font-semibold">Reveal the answer</summary><p className="mt-3 font-medium">{q.answerText}</p><p className="mt-3 whitespace-pre-line">{q.explanationEn || q.explanation}</p>{q.explanationEn && <details className="mt-3"><summary className="cursor-pointer py-2">Russian explanation</summary><p className="whitespace-pre-line" lang="ru">{q.explanation}</p></details>}</details></article>)}
      {!filtered.length && <p>No matching cards. Try another search or filter.</p>}
      <div className="flex gap-3"><Button disabled={page===0} onClick={() => setPage(page-1)}>Previous</Button><Button disabled={page+1>=pages} onClick={() => setPage(page+1)}>Next</Button></div>
    </>}
    {tab === "exam" && <>
      <section className={panel}><h2 className="text-xl font-bold">Practice exam · 45 minutes</h2><p>A random set of 20 single-answer, 5 multiple-answer and 5 written questions. Answers appear after you finish.</p><p className="text-sm">Automatic scoring covers 80 points and requires an exact set for multiple answers. The real exam allows partial credit, but its formula is unspecified. Check your written answers against the examples yourself (up to 20 points); they are not scored automatically.</p><p className="text-sm text-[var(--color-muted)]">Your attempt is saved in this browser for your account. The timer continues if you close the page. This practice does not change your main course progress.</p>
        {!ready ? <p role="status">Loading your attempt…</p> : !attempt || ended ? <Button onClick={() => {const a=newAttempt();setNow(Date.now());save(a);}}>Start a new attempt</Button> : <p>Your attempt is in progress. Continue below.</p>}
      </section>
      {saveError && <p role="alert">Your attempt could not be saved. Keep this page open until you finish.</p>}
      {attempt && <>
        <section className={`${panel} sticky top-16 z-10`}><p className="font-bold">{ended ? `Automatic score: ${scoreAttempt(attempt)} / 80` : `Time left ${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,"0")}`}</p>{ended ? <p>Check written answers against the examples below. This is a practice result, not an exam grade.</p> : <Button onClick={() => save({...attempt,finished:true})}>Finish and review</Button>}</section>
        {attempt.ids.map((id,index) => { const q=bank.find(q=>q.id===id)!; const selected=attempt.answers[id] ?? []; return <article className={panel} key={id}><p className="text-sm">{index+1} / 30 · {index<20 ? "One answer · 3 points" : `Choose ${q.correct.length} answers · 4 points`}</p><h3 className="font-bold" data-selection-question lang="en">{q.prompt}</h3>{q.options.map((o,i) => <label data-selection-question lang="en" className="flex min-h-11 items-start gap-3 rounded-xl border border-[var(--color-border)] p-3" key={i}><input className="mt-1" type={index<20 ? "radio" : "checkbox"} name={id} checked={selected.includes(i)} disabled={ended} onChange={() => update({...attempt, answers:{...attempt.answers,[id]:index<20 ? [i] : selected.includes(i) ? selected.filter(v=>v!==i) : [...selected,i]}})} /><span data-selection-question lang="en">{o}</span></label>)}{ended && <div className="space-y-2 border-t border-[var(--color-border)] pt-3"><p className="font-bold">{isCorrect(q,selected) ? "Correct" : "Incorrect or unanswered"}</p><p>{q.answerText}</p><p className="whitespace-pre-line">{q.explanationEn || q.explanation}</p>{q.explanationEn && <details><summary className="cursor-pointer py-2">Russian explanation</summary><p className="whitespace-pre-line" lang="ru">{q.explanation}</p></details>}</div>}</article>;})}
        {attempt.openIds.map((id,index) => {const q=openQuestions.find(q=>q.id===id)!;return <article className={panel} key={id}><h3 className="font-bold" data-selection-question lang="en">{index+26}. {q.prompt}</h3><label className="block">Your answer · 4 points<textarea rows={5} className={`${input} mt-2`} disabled={ended} value={attempt.written[id] ?? ""} onChange={e=>update({...attempt,written:{...attempt.written,[id]:e.target.value}})} /></label>{ended && <p><b>Example answer: </b>{q.answer}</p>}</article>;})}
      </>}
    </>}
  </div>;
}
