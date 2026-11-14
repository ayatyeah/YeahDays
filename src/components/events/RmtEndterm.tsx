"use client";
import { useState } from "react";
import Link from "next/link";
import { cases, figures, groups, modes, scenario, workedAnswers, type CaseId, type Mode } from "@/lib/events/researchMethodsEndterm/content";
import NotesToolbar from "./NotesToolbar";
import SelectionMenu from "./SelectionMenu";
import styles from "./rmt-endterm.module.css";

export default function RmtEndterm() {
  const [caseId, setCaseId] = useState<CaseId>("A");
  const [mode, setMode] = useState<Mode>("mixed");
  const [language, setLanguage] = useState<"both" | "en" | "ru">("en");
  const c = cases[caseId], f = figures(caseId), answers = workedAnswers(caseId, mode);
  return <div className={styles.page} data-no-i18n>
    <Link href="/events/courses/research-methods" className={styles.back}>← Research Methods & Tools</Link>
    <header className={styles.header}><p className={styles.eyebrow}>RMT / Study notebook</p><h1>See the method.<br />Understand the research.</h1><p>Two source cases, worked through step by step. Explore the original mixed methods design, then see what changes in qualitative and quantitative alternatives.</p><div className={styles.badges}><span>6 worked scenarios</span><span>90 answer sections</span><span>English answers · Russian explanations</span></div></header>
    <section className={styles.controls} aria-label="Choose your scenario">
      <div className={styles.caseButtons}>{(["A", "B"] as const).map(id => <button key={id} aria-pressed={caseId === id} onClick={() => setCaseId(id)}>Case {id}<small>{cases[id].title}</small></button>)}</div>
      <div className={styles.modeButtons}>{modes.map(m => <button key={m.id} aria-pressed={mode === m.id} onClick={() => setMode(m.id)}>{m.id === "mixed" ? "Mixed methods" : m.id === "qualitative" ? "Qualitative" : "Quantitative · RCT"}<small>{m.id === "mixed" ? "Work through the source case" : m.id === "qualitative" ? "Explore experience and context" : "Compare intervention and control"}</small></button>)}</div>
    </section>
    <div className={styles.sticky}><nav aria-label="Tasks">{groups.map((_, i) => <a key={i} href={`#rmt-task-${i+1}`}>Task {i+1}</a>)}</nav><label>Reading language <select value={language} onChange={e => setLanguage(e.target.value as typeof language)}><option value="both">EN + RU</option><option value="en">English answers</option><option value="ru">Русский разбор</option></select></label></div>
    <NotesToolbar lang={language === "ru" ? "ru" : "en"} onLang={setLanguage} showLanguage={false} />
    <SelectionMenu allowTutor={false} />
    <section className={styles.case} aria-label="Selected research scenario">
      <p className={styles.eyebrow}>{mode === "mixed" ? "Source scenario · 30 points" : "Practice scenario · adapted from the source"}</p>
      <h2>Case {caseId} · {c.title}</h2>
      {mode !== "mixed" && <p className={styles.notice}>{mode === "qualitative" ? "The aim, sampling and sources have been adapted: interviews only, without a numerical effectiveness estimate. Tasks follow this design; quotations are retained for comparison." : "Adapted design: 16 participants, random allocation, a control group and research-specific measurements. Control values are invented; source values are reused only for practice."}</p>}
      <p lang="en">{scenario(caseId, mode)}</p>
      {mode !== "qualitative" && <div className={styles.tableWrap}><table><caption>{mode === "mixed" ? "Successful tasks · values from the source photos" : "Successful tasks · synthetic RCT with invented control values"}</caption><thead><tr><th>Student</th><th>{mode === "mixed" ? "Before pilot" : "Baseline, each group"}</th><th>{mode === "mixed" ? "During pilot" : "Intervention follow-up"}</th>{mode === "quantitative" && <th>Control follow-up*</th>}</tr></thead><tbody>{c.before.map((v,i) => <tr key={i}><th>{String.fromCharCode(65+i)}{mode === "quantitative" ? "*" : ""}</th><td>{v} / {c.items}</td><td>{c.after[i]} / {c.items}</td>{mode === "quantitative" && <td>{c.control[i]} / {c.items}</td>}</tr>)}<tr><th>Total</th><td>{f.before} / {f.n}</td><td>{f.after} / {f.n}</td>{mode === "quantitative" && <td>{f.control} / {f.n}</td>}</tr></tbody></table>{mode === "quantitative" && <p className={styles.note}>* Each row pairs two different participants, such as A-intervention and A-control. Each group has eight participants. Matching baseline values are an assumption of this exercise.</p>}</div>}
      {mode !== "quantitative" && <div className={styles.quotes}><h3>Interview excerpts · four different participants</h3>{c.quotes.map((quote,i) => <blockquote key={quote} lang="en"><strong>I{i+1}</strong> “{quote}”</blockquote>)}</div>}
      <p className={styles.note}>{mode === "mixed" ? "The source exam states that all case data are fictional. These worked answers are study material, not the instructor’s official marking scheme." : "The alternatives help you apply the same concepts to a new design. They are not records of another exam or results of a conducted study."}</p>
    </section>
    <details className={styles.comparison}><summary>What changes across the three research designs?</summary><div className={styles.tableWrap}><table><thead><tr><th>Dimension</th><th>Mixed · source</th><th>Qualitative</th><th>Quantitative · RCT</th></tr></thead><tbody>
      <tr><th>Aim</th><td>Describe change and understand experience</td><td>Understand experience and context</td><td>Estimate a comparative effect</td></tr>
      <tr><th>Data</th><td>Routine logs + new interviews</td><td>New interviews</td><td>New measurements in two groups</td></tr>
      <tr><th>Sampling</th><td>8 volunteers</td><td>8 purposively selected participants</td><td>16 volunteers → randomly allocated 8 + 8</td></tr>
      <tr><th>Analysis</th><td>Proportions + coding + integration</td><td>Codes → themes → interpretation</td><td>Compare groups and changes</td></tr>
      <tr><th>Conclusion</th><td>Observed change; causation is not established</td><td>Contextual understanding, without a numerical effect estimate</td><td>Stronger causal evidence, with limitations</td></tr>
    </tbody></table></div></details>
    <div key={`${caseId}-${mode}`}>
      {groups.map((group,i) => <section key={group} id={`rmt-task-${i+1}`} className={styles.task}>
        <header className={styles.taskHeader}><p className={styles.eyebrow}>Task {i+1} · 6 points</p><h2>{group}</h2></header>
        {answers.filter(q => q.id.startsWith(String(i+1))).map(q => <article key={q.id} className={styles.answer}>
          <div className={styles.questionTitle}><span>{q.id}</span><h3 lang="en">{q.prompt}</h3><small>{q.points} {q.points === 1 ? "point" : "points"}</small></div>
          {language !== "ru" && <div className={styles.model}><h4>A model answer</h4><p data-selection-notes lang="en">{q.answer}</p></div>}
          {language !== "en" && <><div className={styles.explanation}><h4>Why this answer · Русский</h4><p>{q.why}</p></div><div className={styles.trap}><h4>Common pitfall · Русский</h4><p>{q.trap}</p></div></>}
        </article>)}
      </section>)}
    </div>
    <footer className={styles.footer}><h2>Make it stick.</h2><p>Start with the source case. Then change the research design and identify which fact changes each answer. Check four things: the aim, sampling, data sources and what the evidence can support.</p><p>Cases A and B come from six supplied exam photos. Worked answers and alternatives are study guidance, not the official marking scheme. Method references: <a href="https://obssr.od.nih.gov/research-resources/mixed-methods-research" target="_blank" rel="noreferrer">NIH · Mixed Methods</a> and <a href="https://www.thematicanalysis.net/doing-reflexive-ta/" target="_blank" rel="noreferrer">Braun & Clarke · Thematic Analysis</a>.</p><Link href="/events/courses/research-methods">← Back to RMT materials</Link></footer>
  </div>;
}
