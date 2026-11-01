"use client";
import { useT } from "@/i18n/useT";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { YgIcon } from "@/components/yg-icons";
import { rewardFor, type PublicLearningState, type PublicQuest } from "@/lib/learning";
import { LearningReview, LearningSteps } from "./LearningReview";
const field = "mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 text-[16px]";
type Props = {
 skill: PublicLearningState["skills"][number]; quest: PublicQuest; nextQuest: PublicQuest | undefined;
 total: number; draftStatus: string; locked: boolean; lessonTab: "lesson" | "practice";
 busy: boolean; available: boolean; answer: string; help: boolean;
 tomorrow: () => Promise<void>; navigate: (view: string, skill?: string) => void;
 changeTab: (tab: "lesson" | "practice") => void; submit: (event: React.FormEvent) => void;
 setAnswer: (answer: string) => void; saveDraft: (answer: string, tab: "lesson" | "practice") => void;
 schedule: () => Promise<void>; openLesson: (id: string) => void;
 setHelp: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function LearningLesson({ skill, quest, nextQuest, total, draftStatus, locked, lessonTab, busy, available, answer, help, tomorrow, navigate, changeTab, submit, setAnswer, saveDraft, schedule, openLesson, setHelp }: Props) {
 const t = useT();
 return (
        <section data-no-i18n className="learning-lesson" aria-label={t("lesson.materials")}>
          <div className="learning-lesson-meta">
            <span>
              {t("lesson.quest", { current: skill.quests.findIndex((q) => q.id === quest.id) + 1, total })} · {t("flow.minutes", { count: skill.minutes })}
            </span>
            <span>+{rewardFor(quest.boss).xp} XP</span>
          </div>
          <p className="learning-subject">{t("lesson.subject")}: {skill.subject?.name ?? skill.title}</p>
          <h2>{quest.title}</h2>
          <Link href="/today" className="flow-return">
            {t("lesson.return")}
          </Link>
          {draftStatus && !quest.completed && (
            <p className="flow-draft" role="status">
              {draftStatus}
            </p>
          )}
          {quest.completed && (
            <section className="flow-result" aria-label={t("lesson.result")} >
              <h2>{t("lesson.complete")}</h2>
              <p>{t("lesson.covered", { title: quest.title })}</p>
              <p>{t("lesson.saved")}</p>
              <LearningReview key={quest.id} skill={skill} quest={quest} />
              <div className="flow-actions">
                <Link href="/today">{t("flow.done")}</Link>
                {skill.quests.some((q) => !q.completed) && (
                  <button onClick={() => void tomorrow()}>
                    {t("lesson.tomorrow")}
                  </button>
                )}
              </div>
            </section>
          )}
          {locked ? (
            <div className="learning-notice">
              {t("lesson.locked")}
              <button
                className="learning-primary"
                onClick={() => navigate("route", skill.id)}
              >
                {t("lesson.route")}
              </button>
            </div>
          ) : (
            <>
              <LearningSteps completed={quest.completed} practice={lessonTab === "practice"} feedback={!!quest.feedback} />
              <div
                className="learning-tabs"
                role="tablist"
                aria-label={t("lesson.materials")}
              >
                <button
                  role="tab"
                  id="lesson-tab"
                  aria-controls="lesson-panel"
                  aria-selected={lessonTab === "lesson"}
                  onClick={() => changeTab("lesson")}
                >
                  {t("lesson.read")}
                </button>
                <button
                  role="tab"
                  id="practice-tab"
                  aria-controls="practice-panel"
                  aria-selected={lessonTab === "practice"}
                  onClick={() => changeTab("practice")}
                >
                  {t("lesson.practice")}
                </button>
              </div>
              <div
                id={lessonTab === "lesson" ? "lesson-panel" : "practice-panel"}
                role="tabpanel"
                aria-labelledby={
                  lessonTab === "lesson" ? "lesson-tab" : "practice-tab"
                }
                className="learning-reading"
              >
                {lessonTab === "lesson" ? quest.lesson : quest.exercise}
              </div>
              {lessonTab === "lesson" && (
                <button
                  className="learning-secondary"
                  onClick={() => changeTab("practice")}
                >
                  {t("lesson.try")} <YgIcon name="chevron" />
                </button>
              )}
              {quest.feedback && (
                <div role="status" className="learning-feedback">
                  <b>{quest.completed ? t("lesson.passed") : t("lesson.feedback")}</b>
                  <p>{quest.feedback}</p>
                </div>
              )}
              {lessonTab === "practice" && !quest.completed && (
                <form onSubmit={submit} className="learning-answer">
                  <label htmlFor="learning-answer">{t("lesson.answer")}</label>
                  <textarea
                    id="learning-answer"
                    className={field}
                    rows={5}
                    required
                    maxLength={6000}
                    value={answer}
                    disabled={busy}
                    onChange={(e) => {
                      setAnswer(e.target.value);
                      saveDraft(e.target.value, lessonTab);
                    }}
                    placeholder={t("lesson.placeholder")}
                  />
                  <div className="learning-answer-actions">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={busy || !available}
                    >
                      {busy ? t("lesson.checking") : t("lesson.check")}
                    </Button>
                    <button
                      type="button"
                      className="learning-secondary"
                      disabled={busy}
                      onClick={() => void schedule()}
                    >
                      {t("lesson.today")}
                    </button>
                  </div>
                  <small>
                    {t("lesson.reward")}
                  </small>
                </form>
              )}
              {quest.completed && (
                <button
                  className="learning-primary"
                  onClick={() =>
                    nextQuest && !nextQuest.completed
                      ? openLesson(nextQuest.id)
                      : navigate("route", skill.id)
                  }
                >
                  {nextQuest && !nextQuest.completed
                    ? t("lesson.next")
                    : t("lesson.route")}
                  <YgIcon name="chevron" />
                </button>
              )}
              <button
                className="learning-help-toggle"
                aria-expanded={help}
                onClick={() => setHelp((v) => !v)}
              >
                <YgIcon name="bulb" /> {t("lesson.help")}{" "}
                <YgIcon name="chevron" />
              </button>
              {help && (
                <div className="learning-help-expanded">
                  <div>
                    <p>
                      {t("lesson.helpHint", { title: quest.title })}
                    </p>
                    <Link href="/chat">{t("lesson.ask")}</Link>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
 );
}
