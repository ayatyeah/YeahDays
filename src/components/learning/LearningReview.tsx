"use client";
import { useState } from "react";
import { useT } from "@/i18n/useT";
import { dateKey } from "@/lib/domain";
import { useUserStore, isTodoDone } from "@/store/useUserStore";
import { useSyncStatus } from "@/store/useSyncStatus";
import type { PublicLearningState, PublicQuest } from "@/lib/learning";
export function LearningSteps({ completed, practice, feedback }: { completed: boolean; practice: boolean; feedback: boolean }) {
 const t = useT();
 const active = completed ? 3 : feedback ? 2 : practice ? 1 : 0;
 const labels = ["lesson.read", "lesson.practice", "review.errors", "review.repeat"] as const;
 return <ol className="learning-stages" aria-label={t("review.path")}>
   {labels.map((key, i) => <li key={key} aria-current={i === active ? "step" : undefined}>{i + 1}. {t(key)}</li>)}
 </ol>;
}
export function LearningReview({ skill, quest }: { skill: PublicLearningState["skills"][number]; quest: PublicQuest }) {
 const t = useT(); const [scheduled, setScheduled] = useState(false);
 const [answer, setAnswer] = useState(""); const [revealed, setRevealed] = useState(false);
 const [finished, setFinished] = useState(false);
 function finish() {
   const store = useUserStore.getState(); const today = dateKey();
   const note = `/learn?view=lesson&skill=${encodeURIComponent(skill.id)}&quest=${encodeURIComponent(quest.id)}`;
   for (const task of store.todos) if (task.note === note && task.date === today && !isTodoDone(task, today)) store.toggleTodo(task.id, today);
   setFinished(true); void useSyncStatus.getState().syncNow?.();
 }
 function plan() {
   const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
   const date = dateKey(tomorrow);
   const note = `/learn?view=lesson&skill=${encodeURIComponent(skill.id)}&quest=${encodeURIComponent(quest.id)}`;
   const store = useUserStore.getState();
   if (!store.todos.some(task => task.date === date && task.note === note))
     store.addTodo({ title: t("review.task", { title: quest.title }), date, duration: Math.min(skill.minutes, 10), note });
   setScheduled(true); void useSyncStatus.getState().syncNow?.();
 }
 return <section aria-label={t("review.title")} className="learning-review">
   <h3>{t("review.title")}</h3><p>{t("review.prompt")}</p>
   <label className="block mt-3" htmlFor="review-recall">{t("review.recall")}</label>
   <textarea id="review-recall" rows={3} maxLength={6000} className="w-full rounded-xl border p-3 mt-2" value={answer} onChange={e => setAnswer(e.target.value)} />
   <button type="button" disabled={!answer.trim()} onClick={() => setRevealed(true)}>{t("review.compare")}</button>
   {revealed && <div><p>{quest.feedback || quest.lesson}</p><button type="button" disabled={finished} onClick={finish}>{t("review.finish")}</button></div>}
   {finished && <p role="status">{t("review.finished")}</p>}
   <button type="button" onClick={plan} disabled={scheduled}>{t("review.plan")}</button>
   {scheduled && <p role="status">{t("review.saved")}</p>}
 </section>;
}
