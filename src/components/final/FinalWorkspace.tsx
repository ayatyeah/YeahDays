'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { PHASES, type FinalStudy, type FinalTask, type StudyProfile } from '@/lib/finalStudy';
import { Icon } from './Brand';
import { EVENT_COURSES } from '@/lib/events/courses';

const errors: Record<string, string> = {
  ai_unavailable: 'AI could not create your plan right now. Retry, or choose Standard plan to continue with shared exercises. Your goal is still here.',
  rate_limit: 'Please wait before trying again. AI plan requests also have a daily limit.',
  unavailable: 'Your workspace could not be saved or loaded. Check your connection and try again.',
  consent_required: 'Please allow your learning context to be sent to Google Gemini before creating an AI plan.',
  invalid_profile: 'Complete your goal, topic and difficulty, then select a session length.',
  previous_task: 'Complete the previous step before starting this one.',
  start_first: 'Start this task before marking it complete.',
  unauthorized: 'Your session has ended. Sign in again to continue.',
};
export type FinalView = 'dashboard' | 'plan' | 'progress';
export default function FinalWorkspace({ view = 'dashboard' }: { view?: FinalView }) {
  const { data: session } = useSession();
  return <Workspace key={session?.user?.id ?? 'loading'} view={view}/>;
}
function Workspace({ view }: { view: FinalView }) {
  const { data: session, status } = useSession();
  const [study, setStudy] = useState<FinalStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [reload, setReload] = useState(0);
  const [notice, setNotice] = useState('');
  const [selected, setSelected] = useState('');
  useEffect(() => {
    if (status !== 'authenticated') return;
    const controller = new AbortController();
    setLoading(true); setError('');
    fetch('/api/final-study', { cache: 'no-store', signal: controller.signal }).then(async r => { if (!r.ok) throw Error('unavailable'); return r.json(); }).then(data => setStudy(data.study)).catch(e => { if (e.name !== 'AbortError') setError('unavailable'); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [status, reload]);
  async function act(action: string, extra: Record<string, unknown> = {}) {
    if (busy) return false;
    setBusy(true); setError(''); setNotice('');
    try {
      const response = await fetch('/api/final-study', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, ...extra }) });
      const data = await response.json();
      if (!response.ok) throw Error(data.error || 'unavailable');
      setStudy(data.study);
      if (action === 'complete') { setSelected(''); setNotice('Task completed. 10 XP added to your progress.'); }
      if (action === 'reflection') setNotice('Reflection saved.');
      if (action === 'survey') setNotice('Your feedback has been saved.');
      if (action === 'create') setNotice('Your study plan is ready. Let’s take the first step.');
      return true;
    } catch (e) { setError(e instanceof Error ? e.message : 'unavailable'); return false; }
    finally { setBusy(false); }
  }
  const next = study?.tasks.find(t => !t.completedAt);
  const completed = study?.tasks.filter(t => t.completedAt).length ?? 0;
  const task = study?.tasks.find(t => t.id === selected) ?? next ?? study?.tasks[8];
  const course = EVENT_COURSES.find(c => c.title === study?.profile.topic);
  if (status === 'unauthenticated') return <div className="f-empty"><h1>Your study space</h1><p>Sign in to save your plan.</p><Link className="f-button" href="/login">Sign in</Link></div>;
  return <div className="f-workspace f-simple-workspace" lang="en" data-no-i18n>
    <div className="f-page-heading"><div><span className="f-section-kicker">{view === 'progress' ? 'Every step counts' : 'One thing at a time'}</span><h1>{view === 'progress' ? 'Your progress.' : study ? 'Let’s take the next step.' : 'What are we learning?'}</h1></div>{study && <Link href="/progress" className="f-study-counter"><Icon name="spark" size={18}/><strong>{completed * 10} XP</strong><span>{completed}/9 tasks</span></Link>}</div>
    {error && <div className="f-alert" role="alert"><p>{errors[error] ?? 'This change could not be saved. Please try again.'}</p>{error === 'unavailable' && <button disabled={busy} onClick={() => setReload(n => n + 1)}>Try again</button>}{error === 'unauthorized' && <Link href="/login">Sign in</Link>}</div>}
    {notice && <p className="f-success" role="status"><Icon name="check" size={18}/>{notice}</p>}
    {loading || status === 'loading' ? <div className="f-loading" role="status"><span/>Opening your study space…</div> : !study ? (!error || error !== 'unavailable') && <Setup busy={busy} act={act}/> : view === 'progress' ? <Progress study={study} busy={busy} act={act}/> : <>
      <section className="f-current-goal"><div><span>{study.profile.topic}</span><h2>{study.profile.goal}</h2></div><span className="f-pill"><Icon name={study.source === 'ai' ? 'spark' : 'plan'} size={15}/>{study.source === 'ai' ? 'Personalized' : 'Standard'}</span></section>
      <div className="f-simple-study-grid"><div>
        {!next && <p className="f-success"><Icon name="check" size={18}/>All nine tasks complete. You can revisit your work below.</p>}
        {task && <Task key={task.id} task={task} available={next?.id === task.id} minutes={study.profile.minutes} busy={busy} act={act}/>}
        <details className="f-all-tasks" open={view === 'plan'}><summary><Icon name="plan" size={19}/><span>View your full plan</span><span>{completed}/9</span></summary><div className="f-route-list">{PHASES.map((title, i) => <section key={title}><div className="f-phase-title"><span className={study.tasks.filter(t => t.phase === i + 1 && t.completedAt).length === 3 ? 'done' : ''}>{i + 1}</span><h3>{title}</h3></div><div className="f-route-tasks">{study.tasks.filter(t => t.phase === i + 1).map(t => <button className={task?.id === t.id ? 'selected' : ''} aria-pressed={task?.id === t.id} key={t.id} onClick={() => setSelected(t.id)}><Icon name={t.completedAt ? 'check' : t.id === next?.id ? 'arrow' : 'lock'} size={18}/><span>{t.title}</span><strong>{t.completedAt ? '+10' : '10'} XP</strong></button>)}</div></section>)}</div></details>
      </div><aside className="f-simple-aside"><section className="f-next-guide"><span className="f-small-spark"><Icon name="clock"/></span><h2>A little focus<br/>goes a long way.</h2><p>One task. About {study.profile.minutes} minutes. Start when you’re ready.</p><div className="f-mini-progress"><progress value={completed} max={9} aria-label="Study plan completion"/><span>{completed} of 9 tasks complete</span></div></section><Link href={course ? `/events/courses/${course.id}` : '/events'} className="f-course-shortcut"><Icon name="book" size={23}/><div><strong>{course?.title || 'Course materials'}</strong><span>Notes & practice</span></div><Icon name="arrow" size={18}/></Link></aside></div>
    </>}
  </div>;
}
function Setup({ busy, act }: { busy: boolean; act: (action: string, extra?: Record<string, unknown>) => Promise<boolean> }) {
  const [profile, setProfile] = useState<StudyProfile>({ goal: '', topic: '', difficulty: '', minutes: 15, mode: 'ai' });
  const [consent, setConsent] = useState(false);
  return <form className="f-panel f-setup f-simple-setup" onSubmit={e => { e.preventDefault(); void act('create', { profile: { ...profile, difficulty: profile.difficulty.trim() || 'Getting started with this goal' }, consent }); }}>
    <label>Your course<select required value={profile.topic} onChange={e => setProfile({ ...profile, topic: e.target.value })}><option value="" disabled>Choose a course</option>{EVENT_COURSES.map(c => <option value={c.title} key={c.id}>{c.title}</option>)}</select></label>
    <label>What would you like to understand?<input required minLength={3} maxLength={240} value={profile.goal} onChange={e => setProfile({ ...profile, goal: e.target.value })} placeholder="e.g. How to choose a research method"/></label>
    <label>Anything you find difficult? <span className="f-optional">Optional</span><textarea minLength={3} maxLength={400} rows={2} value={profile.difficulty} onChange={e => setProfile({ ...profile, difficulty: e.target.value })} placeholder="e.g. Telling qualitative and quantitative methods apart"/></label>
    <div className="f-form-row"><label>Session length<select value={profile.minutes} onChange={e => setProfile({ ...profile, minutes: Number(e.target.value) })}><option value={5}>5 minutes</option><option value={15}>15 minutes</option><option value={25}>25 minutes</option></select></label><label>Plan style<select value={profile.mode} onChange={e => setProfile({ ...profile, mode: e.target.value as StudyProfile['mode'] })}><option value="ai">Personalized with Gemini</option><option value="standard">Standard study plan</option></select></label></div>
    {profile.mode === 'ai' && <label className="f-consent"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} required/><span>Send my learning goal and study preferences to Google Gemini to create my tasks. Keep personal details out of these fields.</span></label>}
    <button className="f-button" disabled={busy || (profile.mode === 'ai' && !consent)} type="submit">{busy ? 'Creating your plan…' : 'Create my plan'}<Icon name="arrow" size={18}/></button>
    <Link href="/events" className="f-setup-browse">Just looking for course materials? <span>Browse courses →</span></Link>
  </form>;
}
function Task({ task, available, minutes, busy, act }: { task: FinalTask; available: boolean; minutes: number; busy: boolean; act: (action: string, extra?: Record<string, unknown>) => Promise<boolean> }) {
  const [note, setNote] = useState(task.reflection);
  const [now, setNow] = useState(0);
  useEffect(() => { setNow(Date.now()); if (!task.startedAt || task.completedAt) return; const interval = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(interval); }, [task.startedAt, task.completedAt]);
  const seconds = now && task.startedAt ? Math.max(0, Math.floor(((task.completedAt ? Date.parse(task.completedAt) : now) - Date.parse(task.startedAt)) / 1000)) : 0;
  return <article className={`f-task-detail ${task.completedAt ? 'is-complete' : ''}`}><div className="f-task-detail-top"><span className="f-task-category"><Icon name={task.kind === 'focus' ? 'clock' : task.kind === 'review' ? 'book' : 'plan'} size={18}/>{task.kind === 'review' ? 'Reflect' : task.kind === 'focus' ? 'Focus' : 'Plan'}</span><span className="f-xp">{task.completedAt ? 'Earned ' : '+'}10 XP</span></div><h2>{task.title}</h2><p className="f-task-instruction">{task.instruction}</p><details className="f-task-rationale"><summary>Why this step?</summary><p>{task.rationale}</p></details>{task.startedAt && <><div className="f-timer"><Icon name="clock" size={20}/><strong>{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</strong><span>elapsed, including breaks{task.kind === 'focus' ? ` · aim for ${minutes} min` : ''}</span></div><details className="f-reflection-editor" open={task.kind === 'review'}><summary>Add a reflection <span>Optional</span></summary><label className="f-note-label">Your reflection <span>(optional, private)</span><textarea rows={3} maxLength={2000} value={note} onChange={e => setNote(e.target.value)} placeholder="What did you try? What became clearer? What is your next step?"/></label><button className="f-text-link" disabled={busy || note === task.reflection} onClick={() => act('reflection', { taskId: task.id, reflection: note })}>Save reflection</button></details></>}<div className="f-task-actions">{task.completedAt ? <span className="f-completed-label"><Icon name="check"/>Completed</span> : available ? <button className="f-button" disabled={busy} onClick={async () => { if (task.startedAt && note !== task.reflection && !await act('reflection', { taskId: task.id, reflection: note })) return; await act(task.startedAt ? 'complete' : 'start', { taskId: task.id }); }}>{busy ? 'Saving…' : task.startedAt ? 'Mark complete' : 'Start this task'}<Icon name={task.startedAt ? 'check' : 'arrow'} size={18}/></button> : <span className="f-muted"><Icon name="lock" size={17}/> Complete the previous steps to unlock this task.</span>}</div></article>;
}
function Progress({ study, busy, act }: { study: FinalStudy; busy: boolean; act: (action: string, extra?: Record<string, unknown>) => Promise<boolean> }) {
  const done = study.tasks.filter(t => t.completedAt).length;
  const [ratings, setRatings] = useState({ interest: study.survey?.interest ?? 0, motivation: study.survey?.motivation ?? 0, usefulness: study.survey?.usefulness ?? 0, comment: study.survey?.comment ?? '' });
  function download() { const url = URL.createObjectURL(new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), study }, null, 2)], { type: 'application/json' })); const a = document.createElement('a'); a.href = url; a.download = 'yeahgrind-my-study-plan.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
  return <><section className="f-stat-row"><div><span>Study points</span><strong>{done * 10}<small> XP</small></strong><p>10 for each completed task</p></div><div><span>Steps completed</span><strong>{done}<small> / 9</small></strong><p>{Math.round(done / 9 * 100)}% of your plan</p></div><div><span>Milestones reached</span><strong>{[1, 3, 6, 9].filter(n => done >= n).length}<small> / 4</small></strong><p>Small moments worth keeping</p></div></section><div className="f-work-grid"><div><section className="f-panel"><div className="f-block-heading"><h2>Your plan</h2><button className="f-text-link" disabled={busy} onClick={download}><Icon name="download" size={17}/>Export my plan</button></div><div className="f-phase-progress">{PHASES.map((phase, i) => { const count = study.tasks.filter(t => t.phase === i + 1 && t.completedAt).length; return <div key={phase}><div><span>{phase}</span><strong>{count}/3</strong></div><progress value={count} max={3} aria-label={phase}/></div>; })}</div></section><section className="f-panel f-reflections"><h2>Your reflections</h2>{study.tasks.some(t => t.reflection) ? study.tasks.filter(t => t.reflection).map(t => <article key={t.id}><span>Stage {t.phase} · {t.kind}</span><h3>{t.title}</h3><p>{t.reflection}</p></article>) : <div className="f-reflection-empty"><Icon name="book" size={35}/><h3>A place for what you learn.</h3><p>Save a reflection inside a task. Your notes will appear here, ready to revisit.</p><Link href="/learn" className="f-text-link">Open my study plan <Icon name="arrow" size={16}/></Link></div>}</section></div><aside><section className="f-panel"><h2>Your milestones</h2><div className="f-milestones">{[[1, 'First step'], [3, 'A little momentum'], [6, 'Finding your rhythm'], [9, 'Full circle']].map(([n, title]) => <div className={done >= Number(n) ? 'earned' : ''} key={n}><span><Icon name={done >= Number(n) ? 'check' : 'spark'} size={22}/></span><div><strong>{title}</strong><small>{done >= Number(n) ? 'Unlocked' : `${n} completed tasks`}</small></div></div>)}</div><p className="f-fine">Milestones recognise participation. They do not certify subject mastery.</p></section><details className="f-feedback-drawer"><summary>Share feedback <span>Optional</span></summary><form className="f-panel f-feedback" onSubmit={e => { e.preventDefault(); void act('survey', ratings); }}><h2>How is it going?</h2><p>Your optional feedback helps describe your experience with this plan.</p>{(['interest', 'motivation', 'usefulness'] as const).map(key => <label key={key}>{key === 'interest' ? 'The tasks keep my interest' : key === 'motivation' ? 'I feel motivated to continue' : 'The tasks are useful for my goal'}<select value={ratings[key]} onChange={e => setRatings({ ...ratings, [key]: Number(e.target.value) })}><option value={0} disabled>Choose a response</option>{[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} — {['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'][n - 1]}</option>)}</select></label>)}<label>Anything you would change?<textarea rows={3} maxLength={2000} value={ratings.comment} onChange={e => setRatings({ ...ratings, comment: e.target.value })}/></label><button className="f-button f-button-outline" disabled={busy || !ratings.interest || !ratings.motivation || !ratings.usefulness}>{busy ? 'Saving…' : study.survey ? 'Update feedback' : 'Save feedback'}</button>{study.survey && <p className="f-fine">Your feedback is saved with your plan.</p>}</form></details></aside></div></>;
}
