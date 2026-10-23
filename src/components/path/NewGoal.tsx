"use client";
/** Новая цель: что изучаем, уровень, язык, время в день, дедлайн и свой материал. */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { YgIcon } from "@/components/yg-icons";
import { call } from "./client";
import "./path.css";

const LEVELS = [
  ["beginner", "С нуля"],
  ["intermediate", "Есть база"],
  ["advanced", "Углубляюсь"],
] as const;
const LANGUAGES = [
  ["ru", "Русский"],
  ["en", "English"],
  ["kk", "Қазақша"],
] as const;
const MINUTES = [10, 15, 20, 30, 45, 60];
const STAGES = ["Читаем цель и материал…", "Строим карту навыков…", "Делим на микро-юниты по 2–5 минут…", "Готовим стартовый тест…", "Почти готово…"];
const MAX = 20_000;

export default function NewGoal() {
  const router = useRouter();
  const [goal, setGoal] = useState("");
  const [subject, setSubject] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [level, setLevel] = useState<string>("beginner");
  const [language, setLanguage] = useState<string>("ru");
  const [minutes, setMinutes] = useState(20);
  const [deadline, setDeadline] = useState("");
  const [material, setMaterial] = useState("");
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState(0);
  const [error, setError] = useState("");
  const requestId = useRef<string>("");

  useEffect(() => {
    // Курсы из подключённого календаря LMS — подсказки к полю «Предмет».
    fetch("/api/learning/subjects", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { subjects: [] }))
      .then((b) => setSubjects(Array.isArray(b.subjects) ? b.subjects.slice(0, 30) : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!busy) return;
    setStage(0);
    const timer = setInterval(() => setStage((s) => Math.min(STAGES.length - 1, s + 1)), 7000);
    return () => clearInterval(timer);
  }, [busy]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError("");
    if (goal.trim().length < 5) return setError("Опиши цель хотя бы парой слов");
    if (material.length > MAX) return setError("Материал — до 20 000 символов");
    requestId.current ||= crypto.randomUUID();
    setBusy(true);
    try {
      const { id } = await call<{ id: string }>("/api/path/goals", { goal, subject, level, language, minutes, deadline, material, requestId: requestId.current });
      router.push(`/learn/g/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не получилось");
      setBusy(false);
    }
  }

  return (
    <div className="path-page">
      <Link href="/learn" className="path-back"><YgIcon name="chevron" /> Учёба</Link>
      <header className="path-title">
        <span className="path-eyebrow">Новая цель</span>
        <h1>Чему научимся?</h1>
        <p>ИИ построит карту навыков и разобьёт её на микро-юниты по 2–5 минут. Траектория будет подстраиваться под твои ответы.</p>
      </header>
      <form className="path-card path-stack" onSubmit={submit} aria-busy={busy}>
        <label className="path-label">
          Цель
          <textarea className="path-field" value={goal} onChange={(e) => setGoal(e.target.value)} maxLength={600} placeholder="Например: сдать мидтерм по базам данных — JOIN и GROUP BY" required />
        </label>
        <label className="path-label">
          Предмет <span className="path-muted">(необязательно)</span>
          <input className="path-field" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={180} list="path-subjects" placeholder="Databases" />
          <datalist id="path-subjects">{subjects.map((s) => <option key={s} value={s} />)}</datalist>
        </label>
        <div>
          <span className="path-label">Уровень</span>
          <div className="path-choice" role="group" aria-label="Уровень">
            {LEVELS.map(([id, label]) => <button type="button" key={id} aria-pressed={level === id} onClick={() => setLevel(id)}>{label}</button>)}
          </div>
        </div>
        <div>
          <span className="path-label">Язык юнитов и видео</span>
          <div className="path-choice" role="group" aria-label="Язык">
            {LANGUAGES.map(([id, label]) => <button type="button" key={id} aria-pressed={language === id} onClick={() => setLanguage(id)} data-no-i18n>{label}</button>)}
          </div>
          {language === "kk" && <p className="path-muted" style={{ marginTop: 6 }}>Юниты будут на казахском. Озвучка видео на казахском включится после проверки носителем языка.</p>}
        </div>
        <div>
          <span className="path-label">Сколько минут в день</span>
          <div className="path-choice" role="group" aria-label="Минут в день">
            {MINUTES.map((m) => <button type="button" key={m} aria-pressed={minutes === m} onClick={() => setMinutes(m)}>{m} мин</button>)}
          </div>
        </div>
        <label className="path-label">
          Экзамен или дедлайн <span className="path-muted">(необязательно — траектория будет ускоряться ближе к дате)</span>
          <input className="path-field" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </label>
        <label className="path-label">
          Свой материал <span className="path-muted">(конспект, силлабус, текст лекции — юниты будут опираться на него)</span>
          <textarea className="path-field" style={{ minHeight: 150 }} value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Вставь текст. Он используется только для твоей цели и как данные, а не как инструкции для ИИ." />
          <span className={`path-muted ${material.length > MAX ? "path-error" : ""}`}>{material.length.toLocaleString("ru-RU")} / 20 000</span>
        </label>
        {error && <p className="path-error" role="alert">{error}</p>}
        <button className="path-btn" disabled={busy}>{busy ? "Строим траекторию…" : "Построить траекторию"}</button>
        {busy && <p className="path-muted" role="status">{STAGES[stage]} Обычно это занимает до минуты.</p>}
      </form>
    </div>
  );
}
