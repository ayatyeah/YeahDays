"use client";
import { useState } from "react";
import Link from "next/link";
import { cases, figures, groups, modes, scenario, workedAnswers, type CaseId, type Mode } from "@/lib/events/researchMethodsEndterm/content";
import styles from "./rmt-endterm.module.css";

export default function RmtEndterm() {
  const [caseId, setCaseId] = useState<CaseId>("A");
  const [mode, setMode] = useState<Mode>("mixed");
  const [language, setLanguage] = useState<"both" | "en" | "ru">("both");
  const c = cases[caseId], f = figures(caseId), answers = workedAnswers(caseId, mode);
  return <main className={styles.page} data-no-i18n>
    <Link href="/events/courses/research-methods" className={styles.back}>← Ивенты Research Methods and Tools</Link>
    <header className={styles.header}><p className={styles.eyebrow}>RMT / Endterm / Полный разбор</p><h1>Понять весь вариант.<br />Даже если изменят условия.</h1><p>Два исходных варианта по фотографиям. Для каждого — решение оригинала и две полные учебные альтернативы с другим дизайном исследования.</p><div className={styles.badges}><span>6 полных разборов</span><span>90 подпунктов</span><span>EN ответы + RU объяснения</span></div></header>
    <section className={styles.controls} aria-label="Выбор варианта">
      <div className={styles.caseButtons}>{(["A", "B"] as const).map(id => <button key={id} aria-pressed={caseId === id} onClick={() => setCaseId(id)}>Вариант {id}<small>{cases[id].title}</small></button>)}</div>
      <div className={styles.modeButtons}>{modes.map(m => <button key={m.id} aria-pressed={mode === m.id} onClick={() => setMode(m.id)}>{m.title}<small>{m.subtitle}</small></button>)}</div>
    </section>
    <div className={styles.sticky}><nav aria-label="Задания">{groups.map((_, i) => <a key={i} href={`#rmt-task-${i+1}`}>Task {i+1}</a>)}</nav><label>Текст <select value={language} onChange={e => setLanguage(e.target.value as typeof language)}><option value="both">EN + RU</option><option value="en">English answers</option><option value="ru">Русский разбор</option></select></label></div>
    <section className={styles.case} aria-label="Условие выбранного сценария">
      <p className={styles.eyebrow}>{mode === "mixed" ? "Условие по фотографиям · 30 баллов" : "Авторский учебный сценарий · не оригинал экзамена"}</p>
      <h2>Вариант {caseId} · {c.title}</h2>
      {mode !== "mixed" && <p className={styles.notice}>{mode === "qualitative" ? "Изменены цель, отбор и источники: только интервью, без числовой оценки эффективности. Задания переписаны под этот дизайн; цитаты сохранены для сравнения." : "Изменены набор и дизайн: 16 участников, случайное распределение, контроль и исследовательский сбор данных. Контрольные числа придуманы; исходные числа повторно использованы только для учебного сравнения."}</p>}
      <p lang="en">{scenario(caseId, mode)}</p>
      {mode !== "qualitative" && <div className={styles.tableWrap}><table><caption>{mode === "mixed" ? "Число успешных задач — исходные данные с фото" : "Число успешных задач — синтетический RCT; контроль выдуман"}</caption><thead><tr><th>Student</th><th>{mode === "mixed" ? "Before pilot" : "Baseline, each group"}</th><th>{mode === "mixed" ? "During pilot" : "Intervention follow-up"}</th>{mode === "quantitative" && <th>Control follow-up*</th>}</tr></thead><tbody>{c.before.map((v,i) => <tr key={i}><th>{String.fromCharCode(65+i)}{mode === "quantitative" ? "*" : ""}</th><td>{v} / {c.items}</td><td>{c.after[i]} / {c.items}</td>{mode === "quantitative" && <td>{c.control[i]} / {c.items}</td>}</tr>)}<tr><th>Total</th><td>{f.before} / {f.n}</td><td>{f.after} / {f.n}</td>{mode === "quantitative" && <td>{f.control} / {f.n}</td>}</tr></tbody></table>{mode === "quantitative" && <p className={styles.note}>* Строка A сопоставляет разных участников A-intervention и A-control, а не одного человека в двух группах. По 8 человек в каждой группе; совпадение исходных значений задано для упражнения.</p>}</div>}
      {mode !== "quantitative" && <div className={styles.quotes}><h3>Interview excerpts · four different participants</h3>{c.quotes.map((quote,i) => <blockquote key={quote} lang="en"><strong>I{i+1}</strong> “{quote}”</blockquote>)}</div>}
      <p className={styles.note}>{mode === "mixed" ? "Исходный экзамен прямо указывает: все данные кейса вымышлены. Ниже — учебное решение, а не официальный ключ преподавателя." : "Альтернативы созданы для тренировки переноса знаний. Они не являются фотографиями другого реального экзамена или результатами проведённого исследования."}</p>
    </section>
    <details className={styles.comparison}><summary>Что меняется между тремя дизайнами?</summary><div className={styles.tableWrap}><table><thead><tr><th>Критерий</th><th>Mixed · оригинал</th><th>Qualitative</th><th>Quantitative · RCT</th></tr></thead><tbody>
      <tr><th>Цель</th><td>Оценить изменение и понять опыт</td><td>Понять опыт и контекст</td><td>Оценить сравнительный эффект</td></tr>
      <tr><th>Данные</th><td>Обычные логи + новые интервью</td><td>Новые интервью</td><td>Новые измерения в двух группах</td></tr>
      <tr><th>Отбор</th><td>8 добровольцев</td><td>8 целенаправленно выбранных участников</td><td>16 добровольцев → случайно 8 + 8</td></tr>
      <tr><th>Анализ</th><td>Доли + коды + интеграция</td><td>Коды → темы → интерпретация</td><td>Сравнение групп и изменений</td></tr>
      <tr><th>Вывод</th><td>Наблюдаемое изменение, не доказанная причина</td><td>Контекстное понимание, не процент эффекта</td><td>Более сильный причинный аргумент с ограничениями</td></tr>
    </tbody></table></div></details>
    <div key={`${caseId}-${mode}`}>
      {groups.map((group,i) => <section key={group} id={`rmt-task-${i+1}`} className={styles.task}>
        <header className={styles.taskHeader}><p className={styles.eyebrow}>Task {i+1} · 6 points</p><h2>{group}</h2></header>
        {answers.filter(q => q.id.startsWith(String(i+1))).map(q => <article key={q.id} className={styles.answer}>
          <div className={styles.questionTitle}><span>{q.id}</span><h3 lang="en">{q.prompt}</h3><small>{q.points} {q.points === 1 ? "point" : "points"}</small></div>
          {language !== "ru" && <div className={styles.model}><h4>Что написать на экзамене · English model answer</h4><p lang="en">{q.answer}</p></div>}
          {language !== "en" && <><div className={styles.explanation}><h4>Почему именно так</h4><p>{q.why}</p></div><div className={styles.trap}><h4>Где легко ошибиться</h4><p>{q.trap}</p></div></>}
        </article>)}
      </section>)}
    </div>
    <footer className={styles.footer}><h2>Как повторять</h2><p>Сначала реши оригинал. Затем переключи дизайн и для каждого подпункта назови, какой факт в условии заставил изменить ответ. Проверь четыре вещи: цель, отбор, источник данных и предел вывода.</p><p>Условия и исходные данные A/B — шесть предоставленных фотографий. Ответы и альтернативы — учебный разбор, не официальный marking scheme. Общие ориентиры по методам: <a href="https://obssr.od.nih.gov/research-resources/mixed-methods-research" target="_blank" rel="noreferrer">NIH · Mixed Methods</a> и <a href="https://www.thematicanalysis.net/doing-reflexive-ta/" target="_blank" rel="noreferrer">Braun & Clarke · Thematic Analysis</a>.</p><Link href="/events/courses/research-methods">← Вернуться к ивентам RMT</Link></footer>
  </main>;
}
