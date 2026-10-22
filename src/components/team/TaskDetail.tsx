"use client";

/** Карточка задачи трекера: поля, комментарии и журнал изменений. */
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PRIORITIES, STATES, TYPES, taskKey } from "@/lib/tracker";
import { button, field, primary, type Task } from "./TeamTracker";

type Comment = { id: string; author: string; text: string; createdAt: string };
type Activity = { id: string; actor: string; field: string; fromValue: string; toValue: string; at: string };
type Full = Task & { comments: Comment[]; activity: Activity[]; createdAt: string };

const SHORT = ["epic", "assignee", "reviewer", "estimate", "sprint", "requirements", "dependsOn"] as const;
const LABEL: Record<string, string> = { summary: "Summary", state: "State", priority: "Priority", type: "Type", epic: "Epic", assignee: "Assignee", reviewer: "Reviewer", estimate: "Estimate", sprint: "Sprint", requirements: "Requirements", dependsOn: "Depends on", dueDate: "Due date", description: "Description", acceptance: "Acceptance criteria", links: "Links (PR, commit, document — one per line)" };

const when = (iso: string) => new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

export default function TaskDetail({ taskKey: key }: { taskKey: string }) {
  const [task, setTask] = useState<Full | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/team/tasks/${encodeURIComponent(key)}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { setError(data.error || "Could not load the task"); return; }
    setTask(data.task);
    setDraft(Object.fromEntries(Object.entries(data.task).filter(([, v]) => typeof v === "string")) as Record<string, string>);
  }, [key]);
  useEffect(() => { void load(); }, [load]);

  if (!task) return <main className="p-6 text-sm text-[var(--color-fg-dim)]" role={error ? "alert" : undefined}>{error || "Loading…"} <Link className="underline" href="/team">Back to tracker</Link></main>;

  const changed = Object.fromEntries(Object.entries(draft).filter(([k, v]) => k in task && (task as unknown as Record<string, unknown>)[k] !== v && k !== "createdBy" && k !== "updatedAt" && k !== "createdAt"));
  const set = (k: string) => (e: { target: { value: string } }) => setDraft({ ...draft, [k]: e.target.value });

  async function save(fields = changed) {
    if (!Object.keys(fields).length) return;
    setBusy(true); setError(""); setSaved("");
    const res = await fetch(`/api/team/tasks/${taskKey(task!.number)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fields) });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setError(data.error || "Could not save"); return; }
    setSaved("Saved"); void load();
  }

  async function addComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;
    const res = await fetch(`/api/team/tasks/${taskKey(task!.number)}/comments`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: comment }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { setError(data.error || "Could not add the comment"); return; }
    setComment(""); void load();
  }

  return (
    <main data-no-i18n className="mx-auto min-h-dvh max-w-5xl bg-[var(--color-bg)] px-4 pb-16 pt-5 text-[var(--color-fg)] sm:px-6">
      <Link href="/team" className="text-sm text-[var(--color-fg-dim)] hover:underline">← Team tracker</Link>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="text-sm font-bold text-[var(--color-muted)]">{taskKey(task.number)}</span>
        <input className={`${field} flex-1 text-lg font-bold`} value={draft.summary ?? ""} onChange={set("summary")} aria-label="Summary" />
      </div>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="grid gap-4">
          {(["description", "acceptance", "links"] as const).map((k) => (
            <label key={k} className="block text-xs font-semibold">{LABEL[k]}<textarea className={`${field} mt-1 ${k === "links" ? "h-20" : "h-32"} font-normal`} value={draft[k] ?? ""} onChange={set(k)} /></label>
          ))}
          {!!task.links && <ul className="-mt-2 grid gap-1 text-sm">{task.links.split("\n").filter(Boolean).map((l) => <li key={l}>{/^https?:\/\//.test(l.trim()) ? <a className="break-all underline" href={l.trim()} target="_blank" rel="noreferrer">{l.trim()}</a> : l}</li>)}</ul>}
          <div className="flex items-center gap-3">
            <button className={primary} disabled={busy || !Object.keys(changed).length} onClick={() => void save()}>{busy ? "Saving…" : "Save changes"}</button>
            {saved && <span className="text-sm text-[var(--color-fg-dim)]">{saved}</span>}
            {error && <span role="alert" className="text-sm text-[#c53030]">{error}</span>}
          </div>

          <section aria-label="Comments" className="mt-2">
            <h2 className="text-sm font-semibold">Comments · {task.comments.length}</h2>
            <ul className="mt-2 grid gap-2">
              {task.comments.map((c) => <li key={c.id} className="rounded-lg bg-[var(--color-surface-2)] p-3 text-sm"><div className="text-xs text-[var(--color-muted)]"><b className="text-[var(--color-fg)]">{c.author}</b> · {when(c.createdAt)}</div><p className="mt-1 whitespace-pre-wrap">{c.text}</p></li>)}
            </ul>
            <form onSubmit={addComment} className="mt-2 grid gap-2">
              <textarea className={`${field} h-20`} placeholder="Write a comment — review notes, decisions, links" value={comment} onChange={(e) => setComment(e.target.value)} aria-label="New comment" />
              <div><button className={button} disabled={!comment.trim()}>Comment</button></div>
            </form>
          </section>
        </div>

        <aside className="grid content-start gap-3 rounded-xl border border-[var(--color-border)] p-4">
          <label className="text-xs font-semibold">State
            <select className={field} value={draft.state} onChange={(e) => { setDraft({ ...draft, state: e.target.value }); void save({ state: e.target.value }); }}>{STATES.map((s) => <option key={s}>{s}</option>)}</select>
          </label>
          <label className="text-xs font-semibold">Priority<select className={field} value={draft.priority} onChange={set("priority")}>{PRIORITIES.map((p) => <option key={p}>{p}</option>)}</select></label>
          <label className="text-xs font-semibold">Type<select className={field} value={draft.type} onChange={set("type")}>{[...new Set([...TYPES, draft.type])].map((t) => <option key={t}>{t}</option>)}</select></label>
          {SHORT.map((k) => <label key={k} className="text-xs font-semibold">{LABEL[k]}<input className={field} value={draft[k] ?? ""} onChange={set(k)} /></label>)}
          <label className="text-xs font-semibold">{LABEL.dueDate}<input className={field} type="date" value={draft.dueDate ?? ""} onChange={set("dueDate")} /></label>
          <p className="text-xs text-[var(--color-muted)]">Created by {task.createdBy || "—"} · updated {when(task.updatedAt)}</p>
        </aside>
      </div>

      <section aria-label="Activity" className="mt-8">
        <h2 className="text-sm font-semibold">Activity</h2>
        <ul className="mt-2 grid gap-1 text-xs text-[var(--color-fg-dim)]">
          {task.activity.map((a) => (
            <li key={a.id}><b className="text-[var(--color-fg)]">{a.actor}</b> {a.field === "created" || a.field === "imported" ? `${a.field} the task` : <>changed <b>{LABEL[a.field] ?? a.field}</b>{a.fromValue && <> from “{a.fromValue.slice(0, 80)}”</>} to “{a.toValue.slice(0, 80)}”</>} · {when(a.at)}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
