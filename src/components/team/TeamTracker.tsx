"use client";

/**
 * Командный трекер задач диплома — доска по статусам и список с фильтрами,
 * как в YouTrack. Данные — /api/team/*; доступ проверяет сервер.
 */
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PRIORITIES, STATES, TYPES, taskKey } from "@/lib/tracker";

export type Task = {
  number: number; summary: string; description: string; epic: string; type: string; priority: string; state: string;
  assignee: string; reviewer: string; estimate: string; sprint: string; dueDate: string; requirements: string;
  acceptance: string; dependsOn: string; links: string; createdBy: string; updatedAt: string; comments?: number;
};
type Member = { email: string; name: string };
type Me = { email: string; name: string; isOwner: boolean };

const PRIORITY_TONE: Record<string, string> = {
  Critical: "bg-[#9b2c2c] text-white", High: "bg-[#c05621] text-white", Medium: "bg-[#b7791f] text-white",
  Normal: "bg-[var(--color-surface-2)] text-[var(--color-fg)]", Low: "bg-[var(--color-surface-2)] text-[var(--color-muted)]",
};
const STATE_TONE: Record<string, string> = {
  Open: "border-[var(--color-border-strong,#d3d5d8)]", "In Progress": "border-[#3182ce]", "In Review": "border-[#805ad5]",
  Blocked: "border-[#e53e3e]", Done: "border-[#38a169]",
};

export function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase() || "—";
}

async function api(path: string, init?: RequestInit) {
  const res = await fetch(path, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const field = "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-1.5 text-sm text-[var(--color-fg)]";
export const button = "rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--color-surface-2)] disabled:opacity-50";
export const primary = "rounded-lg bg-[var(--color-fg)] px-3 py-1.5 text-sm font-semibold text-[var(--color-bg)] disabled:opacity-50";

export default function TeamTracker() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"board" | "list">("board");
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState({ epic: "", assignee: "", sprint: "", priority: "" });
  const [creating, setCreating] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [notice, setNotice] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const data = await api("/api/team/tasks");
      setTasks(data.tasks); setMembers(data.members); setMe(data.me); setError("");
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const options = useMemo(() => {
    const uniq = (f: keyof Task) => [...new Set(tasks.map((t) => String(t[f])).filter(Boolean))].sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
    return { epic: uniq("epic"), assignee: [...new Set([...uniq("assignee"), ...members.map((m) => m.name)])], sprint: uniq("sprint") };
  }, [tasks, members]);

  const visible = tasks.filter((t) => {
    const text = `${taskKey(t.number)} ${t.summary} ${t.requirements}`.toLowerCase();
    return (!q || text.includes(q.toLowerCase()))
      && (!filters.epic || t.epic === filters.epic)
      && (!filters.assignee || t.assignee === filters.assignee)
      && (!filters.sprint || t.sprint === filters.sprint)
      && (!filters.priority || t.priority === filters.priority);
  });

  async function move(task: Task, state: string) {
    setTasks((all) => all.map((t) => (t.number === task.number ? { ...t, state } : t)));
    try { await api(`/api/team/tasks/${taskKey(task.number)}`, { method: "PATCH", body: JSON.stringify({ state }) }); }
    catch (e) { setError((e as Error).message); void load(); }
  }

  async function importCsv(file: File) {
    setNotice("Importing…");
    try {
      const res = await fetch("/api/team/import", { method: "POST", headers: { "Content-Type": "text/csv" }, body: await file.text() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setNotice(`Imported: ${data.created} new, ${data.updated} updated${data.skipped.length ? `, ${data.skipped.length} skipped (${data.skipped.slice(0, 3).join("; ")})` : ""}.`);
      void load();
    } catch (e) { setNotice(""); setError((e as Error).message); }
  }

  const counts = Object.fromEntries(STATES.map((s) => [s, tasks.filter((t) => t.state === s).length]));

  if (loading) return <main className="p-6 text-sm text-[var(--color-muted)]">Loading tasks…</main>;
  if (!me) return <main className="mx-auto max-w-lg p-6"><h1 className="text-xl font-bold">Team tracker</h1><p className="mt-2 text-sm text-[var(--color-fg-dim)]" role="alert">{error || "Team members only."}</p></main>;

  return (
    <main data-no-i18n className="min-h-dvh bg-[var(--color-bg)] px-4 pb-16 pt-5 text-[var(--color-fg)] sm:px-6">
      <header className="flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <h1 className="text-xl font-bold tracking-tight">YeahGrind · Team tracker</h1>
          <p className="text-xs text-[var(--color-muted)]">Project YG · {tasks.length} tasks · {STATES.map((s) => `${s} ${counts[s]}`).join(" · ")}</p>
        </div>
        <div className="flex rounded-lg border border-[var(--color-border)] p-0.5 text-sm" role="tablist" aria-label="View">
          {(["board", "list"] as const).map((v) => (
            <button key={v} role="tab" aria-selected={view === v} onClick={() => setView(v)} className={`rounded-md px-3 py-1 ${view === v ? "bg-[var(--color-fg)] text-[var(--color-bg)]" : ""}`}>{v === "board" ? "Board" : "List"}</button>
          ))}
        </div>
        <button className={primary} onClick={() => setCreating(true)}>New task</button>
        <a className={button} href="/api/team/export">Export CSV</a>
        {me.isOwner && <>
          <button className={button} onClick={() => fileRef.current?.click()}>Import CSV</button>
          <input ref={fileRef} type="file" accept=".csv,text/csv" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) void importCsv(f); e.target.value = ""; }} />
          <button className={button} onClick={() => setShowMembers((v) => !v)}>Members</button>
        </>}
      </header>

      {error && <p role="alert" className="mt-3 rounded-lg border border-[#e53e3e] px-3 py-2 text-sm">{error} <button className="underline" onClick={() => setError("")}>dismiss</button></p>}
      {notice && <p className="mt-3 rounded-lg bg-[var(--color-surface-2)] px-3 py-2 text-sm">{notice}</p>}
      {showMembers && me.isOwner && <Members members={members} onChange={load} />}

      <div className="mt-4 flex flex-wrap gap-2">
        <input className={`${field} max-w-xs`} placeholder="Search YG-29, summary, FR-…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
        {(["epic", "assignee", "sprint"] as const).map((f) => (
          <select key={f} className={`${field} w-auto`} value={filters[f]} onChange={(e) => setFilters({ ...filters, [f]: e.target.value })} aria-label={f}>
            <option value="">{f[0].toUpperCase() + f.slice(1)}: all</option>
            {options[f].map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
        <select className={`${field} w-auto`} value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })} aria-label="priority">
          <option value="">Priority: all</option>
          {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
        </select>
      </div>

      {tasks.length === 0 && <p className="mt-6 text-sm text-[var(--color-fg-dim)]">No tasks yet. {me.isOwner ? "Import project-management/youtrack-backlog.csv or create the first task." : "Ask the owner to import the backlog."}</p>}

      {view === "board" ? (
        <div className="mt-4 grid gap-3 overflow-x-auto pb-2 md:grid-cols-5">
          {STATES.map((state) => (
            <section key={state} className="min-w-[220px] rounded-xl bg-[var(--color-surface-2)] p-2" aria-label={state}>
              <h2 className="px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-fg-dim)]">{state} · {visible.filter((t) => t.state === state).length}</h2>
              <div className="grid gap-2">
                {visible.filter((t) => t.state === state).map((t) => (
                  <article key={t.number} className={`rounded-lg border-l-4 bg-[var(--color-bg)] p-2.5 text-sm shadow-sm ${STATE_TONE[t.state] ?? ""}`}>
                    <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                      <Link href={`/team/${taskKey(t.number)}`} className="font-semibold text-[var(--color-fg)] hover:underline">{taskKey(t.number)}</Link>
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${PRIORITY_TONE[t.priority] ?? ""}`}>{t.priority}</span>
                      {t.sprint && <span>{t.sprint}</span>}
                      <span className="ml-auto grid h-6 w-6 place-items-center rounded-full bg-[var(--color-surface-2)] text-[10px] font-bold" title={t.assignee || "Unassigned"}>{initials(t.assignee)}</span>
                    </div>
                    <Link href={`/team/${taskKey(t.number)}`} className="mt-1 block leading-snug hover:underline">{t.summary}</Link>
                    <div className="mt-2 flex items-center gap-2 text-xs text-[var(--color-muted)]">
                      {t.dueDate && <span>Due {t.dueDate}</span>}
                      {!!t.comments && <span>💬 {t.comments}</span>}
                      <select className="ml-auto rounded border border-[var(--color-border)] bg-transparent px-1 py-0.5 text-xs" value={t.state} onChange={(e) => void move(t, e.target.value)} aria-label={`State of ${taskKey(t.number)}`}>
                        {STATES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--color-border)]">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[var(--color-surface-2)] text-xs uppercase tracking-wide text-[var(--color-fg-dim)]">
              <tr>{["Key", "Summary", "State", "Priority", "Assignee", "Sprint", "Due", "Epic"].map((h) => <th key={h} className="px-3 py-2 font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody>
              {visible.map((t) => (
                <tr key={t.number} className="border-t border-[var(--color-border)]">
                  <td className="whitespace-nowrap px-3 py-2 font-semibold"><Link href={`/team/${taskKey(t.number)}`} className="hover:underline">{taskKey(t.number)}</Link></td>
                  <td className="px-3 py-2"><Link href={`/team/${taskKey(t.number)}`} className="hover:underline">{t.summary}</Link></td>
                  <td className="px-3 py-2">
                    <select className="rounded border border-[var(--color-border)] bg-transparent px-1 py-0.5 text-xs" value={t.state} onChange={(e) => void move(t, e.target.value)} aria-label={`State of ${taskKey(t.number)}`}>
                      {STATES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2"><span className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${PRIORITY_TONE[t.priority] ?? ""}`}>{t.priority}</span></td>
                  <td className="whitespace-nowrap px-3 py-2">{t.assignee || "—"}</td>
                  <td className="px-3 py-2">{t.sprint}</td>
                  <td className="whitespace-nowrap px-3 py-2">{t.dueDate}</td>
                  <td className="px-3 py-2">{t.epic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {creating && <NewTask assignees={options.assignee} onClose={() => setCreating(false)} onCreated={() => { setCreating(false); void load(); }} />}
    </main>
  );
}

function NewTask({ assignees, onClose, onCreated }: { assignees: string[]; onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ summary: "", type: "Task", priority: "Normal", assignee: "", reviewer: "", sprint: "", dueDate: "", epic: "", requirements: "", description: "", acceptance: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    try { await api("/api/team/tasks", { method: "POST", body: JSON.stringify(form) }); onCreated(); }
    catch (err) { setError((err as Error).message); setBusy(false); }
  }
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label="New task" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-2xl bg-[var(--color-bg)] p-5 shadow-xl">
        <h2 className="text-lg font-bold">New task</h2>
        <label className="mt-3 block text-xs font-semibold">Summary<input required autoFocus className={field} value={form.summary} onChange={set("summary")} maxLength={200} /></label>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <label className="text-xs font-semibold">Type<select className={field} value={form.type} onChange={set("type")}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></label>
          <label className="text-xs font-semibold">Priority<select className={field} value={form.priority} onChange={set("priority")}>{PRIORITIES.map((p) => <option key={p}>{p}</option>)}</select></label>
          <label className="text-xs font-semibold">Assignee<input className={field} list="team-assignees" value={form.assignee} onChange={set("assignee")} /></label>
          <label className="text-xs font-semibold">Reviewer<input className={field} list="team-assignees" value={form.reviewer} onChange={set("reviewer")} /></label>
          <label className="text-xs font-semibold">Sprint<input className={field} placeholder="S1" value={form.sprint} onChange={set("sprint")} /></label>
          <label className="text-xs font-semibold">Due date<input className={field} type="date" value={form.dueDate} onChange={set("dueDate")} /></label>
          <label className="text-xs font-semibold">Epic<input className={field} placeholder="E2" value={form.epic} onChange={set("epic")} /></label>
          <label className="col-span-2 text-xs font-semibold">Requirements<input className={field} placeholder="FR-25, NFR-02" value={form.requirements} onChange={set("requirements")} /></label>
        </div>
        <datalist id="team-assignees">{assignees.map((a) => <option key={a} value={a} />)}</datalist>
        <label className="mt-3 block text-xs font-semibold">Description<textarea className={`${field} h-20`} value={form.description} onChange={set("description")} /></label>
        <label className="mt-3 block text-xs font-semibold">Acceptance criteria<textarea className={`${field} h-20`} value={form.acceptance} onChange={set("acceptance")} /></label>
        {error && <p role="alert" className="mt-2 text-sm text-[#c53030]">{error}</p>}
        <div className="mt-4 flex justify-end gap-2"><button type="button" className={button} onClick={onClose}>Cancel</button><button className={primary} disabled={busy}>{busy ? "Creating…" : "Create"}</button></div>
      </form>
    </div>
  );
}

function Members({ members, onChange }: { members: Member[]; onChange: () => void }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  async function add(e: React.FormEvent) {
    e.preventDefault(); setError("");
    try { await api("/api/team/members", { method: "POST", body: JSON.stringify({ email, name }) }); setEmail(""); setName(""); onChange(); }
    catch (err) { setError((err as Error).message); }
  }
  async function remove(member: Member) {
    if (!confirm(`Remove ${member.name} from the tracker?`)) return;
    try { await api("/api/team/members", { method: "DELETE", body: JSON.stringify({ email: member.email }) }); onChange(); }
    catch (err) { setError((err as Error).message); }
  }
  return (
    <section className="mt-4 rounded-xl border border-[var(--color-border)] p-4" aria-label="Members">
      <h2 className="text-sm font-semibold">Members</h2>
      <p className="mt-1 text-xs text-[var(--color-muted)]">The owner account always has access. Members sign in with their own YeahGrind account using this e-mail; their changes are logged under their name.</p>
      <ul className="mt-2 grid gap-1 text-sm">
        {members.map((m) => <li key={m.email} className="flex items-center gap-2"><span className="font-medium">{m.name}</span><span className="text-[var(--color-muted)]">{m.email}</span><button className="ml-auto text-xs underline" onClick={() => void remove(m)}>remove</button></li>)}
        {!members.length && <li className="text-[var(--color-muted)]">No members yet.</li>}
      </ul>
      <form onSubmit={add} className="mt-3 flex flex-wrap gap-2">
        <input className={`${field} max-w-[220px]`} type="email" required placeholder="e-mail" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Member e-mail" />
        <input className={`${field} max-w-[200px]`} required placeholder="Display name" value={name} onChange={(e) => setName(e.target.value)} aria-label="Member name" />
        <button className={primary}>Add member</button>
      </form>
      {error && <p role="alert" className="mt-2 text-sm text-[#c53030]">{error}</p>}
    </section>
  );
}
