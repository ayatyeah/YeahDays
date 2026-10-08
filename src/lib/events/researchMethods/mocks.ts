import type { ExamTask, MockExam } from "../types";

/**
 * Пробные варианты квиза по Research Methods and Tools — «Practice Quiz 3
 * (Review of Lectures 1–4)», 10 баллов, ~40 минут:
 * Part A — 6 тестовых подпунктов по 0.5 (кейс и evidence table в context),
 * Part B — 7 открытых подпунктов на 7 баллов по тому же кейсу.
 * rmv1 — настоящий квиз преподавателя (SafeDrive), формулировки Part A как в
 * оригинале; критерии и эталоны наши. rmv2–rmv8 — новые кейсы того же устройства.
 */

/** Тестовый подпункт части A: 0.5 балла, четыре варианта, проверяется на устройстве. */
function mc(id: string, label: string, prompt: string, options: string[], correct: number, en: string, ru: string): ExamTask {
  return { id, label, points: 0.5, prompt, rubric: [], options, correct, answer: { en, ru } };
}

/** Открытый подпункт части B: проверяет ИИ по критериям и эталону. */
function open(id: string, label: string, points: number, prompt: string, rubric: string[], en: string, ru: string): ExamTask {
  return { id, label, points, prompt, rubric, answer: { en, ru } };
}

const PART_A = "Part A — Multiple choice";
const PART_B = "Part B — Short answers";
const MINUTES = 40;
const REAL = { en: "Real practice quiz from the instructor", ru: "Настоящий пробный квиз преподавателя" };
const NEW = { en: "New — in the format of the real quiz", ru: "Новый — в формате настоящего квиза" };

const title = (name: string, ru: string) => ({
  en: `Practice Quiz 3 — ${name} Case (Review of Lectures 1–4)`,
  ru: `Пробный квиз 3 — кейс ${name}: ${ru} (повторение лекций 1–4)`,
});

/** Условие части A: инструкция, кейс и таблица доказательств Study A–D. */
const caseContext = (story: string, rows: string[]) =>
  [
    "> Use only the case and the evidence table. No outside knowledge is expected.",
    "## Case",
    story,
    "## Evidence table",
    "| Evidence | Design and sample | Main finding | Limitation |",
    "|---|---|---|---|",
    ...rows,
  ].join("\n");

const partBContext = (name: string) => `Use the ${name} case and the evidence table from Part A.`;

/** Формулировки части B — одинаковые во всех вариантах, как в настоящем квизе. */
const B = {
  b1: (n: string) => `Identify one **development output** and one **research output** of the ${n} project.`,
  b2: (n: string) =>
    `Write a three-part problem statement for the ${n} study: (1) the current situation, (2) a limitation supported by the evidence table, and (3) the need for this study.`,
  b3: (n: string) =>
    `Write one clear, focused, researchable and feasible research question for the ${n} study. It must include the population, the factor or comparison, and the outcome.`,
  b4: (n: string) => `Write one balanced search string for the ${n} study using quotation marks, parentheses, AND and OR.`,
  b5: (n: string) =>
    `Identify two ethical or data-protection risks in the ${n} study. For each risk, propose one specific safeguard and state the evidence or record that would show the safeguard was applied.`,
  b6: () =>
    `Write a short analytical paragraph comparing all four evidence summaries (Study A to Study D). Organise it by findings, methods or limitations — not as four separate mini-summaries.`,
  b7: (n: string) =>
    `Identify one genuine research gap that follows from the evidence, and explain why the proposed ${n} study could address it. Do not claim that "no research exists".`,
};

/** Общие строки критериев поисковой строки (b4) — синтаксис проверяется одинаково везде. */
const SEARCH_SYNTAX =
  "0.25 pts — correct syntax: multi-word phrases in quotation marks, balanced parentheses, OR only inside a group and AND only between groups. A pasted sentence or research question, a string with only AND or only OR, or a single concept earns 0 for this line.";

/** Общая строка критериев синтеза (b6): сравнение по темам, а не по статьям. */
const SYNTHESIS_THEMES =
  "0.5 pts — compares across studies by theme (findings, methods or limitations): sentences link at least two studies ('A and B both…, but…') and all four studies are used. A study-by-study list ('Study A found… Study B found…') earns 0 for this line.";

// ─────────────────────────────────────────────────────────────────────────────
// rmv1 — SafeDrive (настоящий квиз)
// ─────────────────────────────────────────────────────────────────────────────

const v1: MockExam = {
  id: "rmv1",
  title: title("SafeDrive", "приложение от сонливости для дальнобойщиков"),
  minutes: MINUTES,
  total: 10,
  source: REAL,
  questions: [
    {
      id: "rmv1-a",
      title: PART_A,
      points: 3,
      context: caseContext(
        `A university clinic is considering **SafeDrive**, a mobile app for long-haul truck drivers. SafeDrive uses the phone camera to detect drowsiness and plays an audio alert. It logs how many times the alert was triggered and the driver's location. Drivers also self-report their sleep hours and fatigue level.
The team plans a six-week study with 60 long-haul truck drivers: one group receives SafeDrive, the other uses a standard paper fatigue checklist. Planned data: alert logs, self-reported sleep hours, a validated fatigue scale, driving experience, and a smartphone-comfort score.
The team calls the project "AI for Road Safety" and asks: "Does technology improve road safety?" They write: "The app will definitely reduce accidents."
The literature folder contains records suggested by a generative AI tool; some have no DOI and have never been opened. The app continuously records camera video and location unless the driver changes the default setting.`,
        [
          `| Study A | Randomised study; 150 taxi drivers aged 35 to 55; 8 weeks | Drowsiness alerts reduced self-reported near-miss events. The difference in the actual accident rate was small and not statistically significant | Near-miss events were self-reported. The age group differs from long-haul truck drivers |`,
          `| Study B | Observational study; 900 users of a commercial drowsiness-alert app | Drivers who responded to alerts frequently had fewer logged fatigue events than infrequent responders | Drivers chose how often to respond to alerts. Baseline sleep habits were not controlled |`,
          `| Study C | Qualitative interviews with 18 long-haul truck drivers | Drivers valued audio alerts during night shifts, but found constant video monitoring intrusive; some covered the camera | Small qualitative sample. Does not estimate the intervention effect quantitatively |`,
          `| Study D | Systematic review of 15 digital driver-monitoring studies | Results were mixed. Studies used inconsistent definitions of a "fatigue event", different outcome measures, and short follow-up periods | Few studies focused specifically on long-haul truck drivers. Attrition was common |`,
        ],
      ),
      tasks: [
        mc("rmv1-a1", "1",
          `What is the main problem with the team's research question "Does technology improve road safety?"`,
          [
            "It is too narrow and specific",
            "It is too broad, with no measurable outcome",
            "It fails to mention artificial intelligence",
            "It has no connection to the topic",
          ], 1,
          `**Correct: "too broad, with no measurable outcome".** "Technology" could mean any device or system, "road safety" is neither defined nor measured, and no population or comparison is named — no single study could collect evidence to answer it. A researchable version names the population (long-haul truck drivers), the comparison (SafeDrive vs the paper checklist) and an outcome the team actually measures (validated fatigue-scale scores over six weeks).
- "Too narrow and specific" — the opposite: the question covers every technology and every road user.
- "Fails to mention artificial intelligence" — adding a buzzword would not make it researchable; the problem is scope and measurement, not the label.
- "No connection to the topic" — it is connected to road safety; it is simply not focused.`,
          `**Верно: «too broad, with no measurable outcome».** «Технология» может означать любое устройство или систему, «безопасность на дорогах» не определена и не измеряется, не названы ни популяция, ни сравнение — собрать доказательства для ответа невозможно. Исследуемая версия называет популяцию (дальнобойщики), сравнение (SafeDrive против бумажного чек-листа) и результат, который команда реально измеряет (баллы по валидированной шкале усталости за шесть недель).
- «Too narrow and specific» — наоборот: вопрос охватывает любую технологию и всех участников движения.
- «Fails to mention artificial intelligence» — модное слово не делает вопрос исследуемым; проблема в охвате и измеримости, а не в названии.
- «No connection to the topic» — связь с темой есть, просто вопрос не сфокусирован.`),
        mc("rmv1-a2", "2",
          `The team writes: "The app will definitely reduce accidents." How is this statement best described?`,
          [
            "A testable, falsifiable hypothesis",
            "A well-formed research problem",
            "An unsupported claim, not a problem",
            "A clearly stated research objective",
          ], 2,
          `**Correct: "an unsupported claim, not a problem".** It announces a result before any data exist, and "definitely" leaves no room for evidence. The table even points the other way: in Study A the accident difference was small and not significant, and Study D found mixed results. Accidents are not in the planned data at all.
- "A testable, falsifiable hypothesis" — a hypothesis is a testable prediction with a comparison and a measure, e.g. "Drivers using SafeDrive will have lower fatigue-scale scores after six weeks than drivers using the paper checklist."
- "A well-formed research problem" — a problem describes a situation and what is not yet known, not a promised result.
- "A clearly stated research objective" — an objective says what the study will do ("to compare…"), not what the app will achieve.`,
          `**Верно: «an unsupported claim, not a problem».** Результат объявлен до появления данных, а «definitely» вообще не оставляет места доказательствам. Таблица говорит скорее обратное: в Study A разница по авариям мала и незначима, в Study D результаты смешанные. Аварии к тому же не входят в планируемые данные.
- «A testable, falsifiable hypothesis» — гипотеза — это проверяемое предсказание со сравнением и измерением, например: через шесть недель баллы усталости у водителей с SafeDrive ниже, чем у водителей с бумажным чек-листом.
- «A well-formed research problem» — проблема описывает ситуацию и то, что пока неизвестно, а не обещанный результат.
- «A clearly stated research objective» — цель говорит, что исследование сделает («сравнить…»), а не чего добьётся приложение.`),
        mc("rmv1-a3", "3",
          `Which of the following is a development output rather than a research output?`,
          [
            "Comparing alert rates between the SafeDrive and control groups",
            "The SafeDrive prototype itself, with its detection feature",
            "The analysis of drivers' self-reported fatigue levels",
            "A systematic review of fifteen driver-monitoring studies",
          ], 1,
          `**Correct: "the SafeDrive prototype itself".** A development output is something the team builds — an app, a feature, code. A research output is new knowledge produced from evidence: a comparison, an analysis, a synthesis.
- "Comparing alert rates between the groups" — an analysis of data, so a research output.
- "The analysis of self-reported fatigue levels" — produces findings, so a research output.
- "A systematic review of fifteen studies" — a synthesis of existing evidence, also a research output.`,
          `**Верно: «the SafeDrive prototype itself».** Результат разработки (development output) — то, что команда строит: приложение, функция, код. Исследовательский результат (research output) — новое знание из доказательств: сравнение, анализ, синтез.
- «Comparing alert rates between the groups» — анализ данных, то есть исследовательский результат.
- «The analysis of self-reported fatigue levels» — даёт выводы, значит, это исследование.
- «A systematic review of fifteen studies» — синтез существующих данных, тоже исследовательский результат.`),
        mc("rmv1-a4", "4",
          `Which study provides qualitative data?`,
          ["Study A", "Study B", "Study C", "Study D"], 2,
          `**Correct: Study C.** Interviews with 18 drivers produce words, experiences and opinions (audio alerts valued, video intrusive) — qualitative data. Its limitation confirms it: it does not estimate the effect quantitatively.
- Study A — a randomised study counting near-misses and accidents: quantitative.
- Study B — an observational study of logged fatigue events in 900 users: quantitative.
- Study D — a systematic review: a secondary synthesis of 15 studies with measured outcomes, not new interview data.`,
          `**Верно: Study C.** Интервью с 18 водителями дают слова, опыт и мнения (звуковой сигнал ценят, видео раздражает) — это качественные (qualitative) данные. Это подтверждает и ограничение: эффект количественно не оценивается.
- Study A — рандомизированное исследование, считает near-miss и аварии: количественные данные.
- Study B — наблюдательное исследование по журналам 900 пользователей: количественные данные.
- Study D — систематический обзор: вторичный синтез 15 исследований с измеренными результатами, а не новые интервью.`),
        mc("rmv1-a5", "5",
          `The literature folder contains AI-suggested records; some have no DOI and have never been opened. What is the main risk?`,
          [
            "No risk, as long as the topics look relevant",
            "Risk of citing fabricated, unverified sources",
            "Risk that the articles are too recent to use",
            "Risk that DOIs are unnecessary for citation",
          ], 1,
          `**Correct: "risk of citing fabricated, unverified sources".** Generative AI can invent plausible references — real-looking authors, titles and DOIs. A record that has never been opened has not passed verification (read → match the publisher record → resolve the DOI in Crossref → check for retractions → open the method and result), so citing it may mean citing something that does not exist or does not support the claim.
- "No risk if the topics look relevant" — a relevant-looking title proves neither that the work exists nor that it fits the claim.
- "Too recent" — the date is not the issue; recent work is often the most useful.
- "DOIs are unnecessary" — some legitimate works lack a DOI, but a DOI supports traceability; the risk is the missing check, not the missing DOI.`,
          `**Верно: «risk of citing fabricated, unverified sources».** Генеративный ИИ умеет выдумывать правдоподобные ссылки — с похожими на настоящие авторами, названиями и DOI. Запись, которую ни разу не открывали, не прошла проверку (прочитать → сверить со страницей издателя → найти DOI в Crossref → проверить отзыв статьи → открыть метод и результат), поэтому можно сослаться на то, чего нет или что не подтверждает утверждение.
- «No risk if the topics look relevant» — подходящее название не доказывает ни существования работы, ни того, что она подтверждает мысль.
- «Too recent» — дело не в дате; свежие работы часто самые полезные.
- «DOIs are unnecessary» — у части настоящих работ DOI нет, но DOI помогает отследить источник; риск в отсутствии проверки, а не в отсутствии DOI.`),
        mc("rmv1-a6", "6",
          `SafeDrive continuously records camera video and location unless the driver changes the default setting. Which type of risk is this?`,
          [
            "Feasibility and resource risk",
            "Ethical and data-protection risk",
            "Topic-framing and scope risk",
            "Grammar and style risk",
          ], 1,
          `**Correct: "ethical and data-protection risk".** Continuous face video and precise location are identifiable personal data — far more than the research question needs — and "on by default" means drivers have not actively chosen it. Study C shows drivers find constant video intrusive. Safeguards: off by default (opt-in), on-device processing, storing only alert counts and times.
- "Feasibility and resource risk" — concerns time, data access and infrastructure; storage may cost more, but the core problem is possible harm to people.
- "Topic-framing and scope risk" — concerns the breadth of the question, not how data are collected.
- "Grammar and style risk" — nothing in the default setting is a writing issue.`,
          `**Верно: «ethical and data-protection risk».** Непрерывное видео лица и точная геолокация — идентифицирующие персональные данные, их намного больше, чем нужно вопросу, а «включено по умолчанию» значит, что водители этого не выбирали. По Study C постоянное видео водителей раздражает. Меры: по умолчанию выключено (opt-in), обработка на телефоне, хранить только число и время сигналов.
- «Feasibility and resource risk» — это время, доступ к данным и инфраструктура; хранение может стоить дороже, но суть в возможном вреде людям.
- «Topic-framing and scope risk» — это ширина вопроса, а не способ сбора данных.
- «Grammar and style risk» — настройка по умолчанию никак не связана с текстом.`),
      ],
    },
    {
      id: "rmv1-b",
      title: PART_B,
      kind: "question",
      points: 7,
      context: partBContext("SafeDrive"),
      tasks: [
        open("rmv1-b1", "1", 0.5, B.b1("SafeDrive"),
          [
            "0.25 pts — a development output: something built — the SafeDrive app or prototype, its camera-based drowsiness detection, the audio alert or the alert-logging feature. A finding or an analysis given here earns 0.",
            "0.25 pts — a research output: new knowledge from the study — e.g. the comparison of validated fatigue-scale scores (or self-reported sleep hours) between the SafeDrive and paper-checklist groups after six weeks. Naming the app, a feature, the raw alert logs or 'collecting data' earns 0.",
          ],
          `- **Development output:** the SafeDrive prototype — the app with camera-based drowsiness detection, the audio alert and the alert log.
- **Research output:** the comparison of validated fatigue-scale scores after six weeks between drivers who used SafeDrive and drivers who used the paper checklist, reported with its limitations.`,
          `Результат разработки (development output) — то, что команда **строит**: приложение SafeDrive с распознаванием сонливости по камере, звуковым сигналом и журналом срабатываний. Исследовательский результат (research output) — **новое знание** из данных: например, сравнение баллов по валидированной шкале усталости через шесть недель в группе SafeDrive и в группе с бумажным чек-листом.
Где теряют баллы: журнал срабатываний или «сбор данных» назван исследовательским результатом — это функция и сырые данные, а не вывод; «приложение снизит аварии» — утверждение, а не результат; систематический обзор (Study D) — чужая работа, а не результат этого проекта.`),
        open("rmv1-b2", "2", 1, B.b2("SafeDrive"),
          [
            "0.25 pts — current situation: drowsiness is a safety concern for long-haul truck drivers, and the clinic is considering a phone-based alert app (SafeDrive). Stated neutrally — no 'definitely', no invented accident statistics.",
            "0.5 pts — a limitation supported by the evidence table and attributed to a study: e.g. Study A — fewer near-misses only by self-report, no significant accident difference, taxi drivers aged 35–55; Study D — mixed results, inconsistent definitions of a 'fatigue event', few long-haul studies; Study B — observational, responders self-selected. 0.25 if the limitation is plausible but not tied to any study; 0 for an opinion or a claim that the app works.",
            "0.25 pts — the need for this study, following from that limitation: a controlled comparison of SafeDrive vs the paper checklist among long-haul truck drivers with a validated fatigue measure. A need unrelated to the stated limitation ('we need a better app') earns 0.",
          ],
          `Drowsiness is a recognised safety risk for long-haul truck drivers, and a university clinic is considering a phone-based drowsiness-alert app, SafeDrive, to support them. However, the evidence is limited: the only randomised study (Study A) involved taxi drivers aged 35–55 and found fewer self-reported near-misses but no significant difference in accidents, while a systematic review (Study D) reports mixed results, inconsistent definitions of a "fatigue event" and few studies of long-haul drivers. A controlled study is therefore needed to compare SafeDrive with the standard paper fatigue checklist among long-haul truck drivers, using a validated fatigue scale rather than self-reported events.`,
          `Три части: (1) **текущая ситуация** — нейтрально, без «definitely»: клиника рассматривает SafeDrive для дальнобойщиков, сонливость за рулём — риск; (2) **ограничение из таблицы со ссылкой на исследование** — Study A: меньше near-miss только по самоотчёту, по авариям разница незначима, и это таксисты 35–55 лет; Study D: результаты смешанные, «fatigue event» определяют по-разному, дальнобойщиков мало; (3) **потребность** — ровно то, что закрывает это ограничение: контролируемое сравнение SafeDrive и бумажного чек-листа у дальнобойщиков по валидированной шкале.
Где теряют баллы: ограничение без ссылки на Study A–D (0.25 вместо 0.5); «приложения точно снижают аварии» — утверждение, а не ограничение; потребность не вытекает из ограничения («нужно удобное приложение»); выдуманная статистика аварий — в кейсе её нет.`),
        open("rmv1-b3", "3", 1, B.b3("SafeDrive"),
          [
            "0.25 pts — one clear, focused, neutral question: not 'Does technology improve road safety?' and not a question that assumes the result ('How much will SafeDrive reduce accidents?'); not two or three questions in one.",
            "0.25 pts — names the population: long-haul truck drivers (not 'drivers' or 'people' in general).",
            "0.25 pts — names the factor or comparison: SafeDrive vs the standard paper fatigue checklist.",
            "0.25 pts — names a measurable outcome that the planned data capture within six weeks: validated fatigue-scale scores (or self-reported sleep hours). 'Accidents' or 'road safety' earns 0 for this line: they are not in the planned data and are too rare to compare in six weeks with 60 drivers.",
          ],
          `Among long-haul truck drivers, how do fatigue levels measured with a validated fatigue scale differ after six weeks between drivers who use the SafeDrive drowsiness-alert app and drivers who use the standard paper fatigue checklist?
Population — long-haul truck drivers; comparison — SafeDrive vs the paper checklist; outcome — the validated fatigue-scale score. It is feasible because the 60 drivers, both conditions and the scale are already in the plan.`,
          `Вопрос один и нейтральный, в нём три элемента: **популяция** — дальнобойщики (не «водители» вообще); **фактор/сравнение** — SafeDrive против стандартного бумажного чек-листа; **результат** — балл по валидированной шкале усталости через шесть недель. Он выполним: все нужные данные уже есть в плане.
Где теряют баллы: результат «аварии» или «безопасность на дорогах» — их нет в плане, а за шесть недель у 60 водителей аварий слишком мало для сравнения; формулировка «How much will SafeDrive reduce accidents?» заранее предполагает ответ; нет группы сравнения; несколько вопросов вместо одного.`),
        open("rmv1-b4", "4", 0.5, B.b4("SafeDrive"),
          [
            "0.25 pts — three or four concept groups joined with AND that match the study — the population (truck / long-haul drivers), the problem (drowsiness / fatigue) and the intervention (detection or alert system, app) — each group with at least two synonyms joined with OR inside parentheses.",
            SEARCH_SYNTAX,
          ],
          `= ("truck driver" OR "long-haul driver" OR "commercial driver") AND (drowsiness OR fatigue OR sleepiness) AND ("drowsiness detection" OR "alert system" OR "driver monitoring")
AND links the three concepts (who, problem, intervention) and narrows the search; OR inside each pair of brackets adds synonyms and broadens it; quotation marks keep multi-word phrases together.`,
          `= ("truck driver" OR "long-haul driver" OR "commercial driver") AND (drowsiness OR fatigue OR sleepiness) AND ("drowsiness detection" OR "alert system" OR "driver monitoring")
Сбалансированная строка: каждое понятие (кто, проблема, вмешательство) — отдельная группа в скобках с синонимами через OR (расширяет), группы соединены AND (сужает), фразы из нескольких слов — в кавычках.
Где теряют баллы: вставлен весь исследовательский вопрос; только AND (слишком узко) или только OR (тысячи лишних результатов); нет скобок, и AND/OR смешаны; незакрытые кавычки; одно понятие («driver fatigue»).`),
        open("rmv1-b5", "5", 1.5, B.b5("SafeDrive"),
          [
            "0.25 pts — risk 1 named from the case: continuous camera video and location recorded by default — identifiable data beyond what the question needs, and drivers have not actively chosen it (Study C: drivers found constant video intrusive).",
            "0.25 pts — a specific safeguard for risk 1: recording off by default (opt-in); the camera image processed on the phone with only alert times and counts stored; no raw video uploaded; no exact location kept. 'Be careful with data' or 'follow the law' earns 0.",
            "0.25 pts — evidence for risk 1: e.g. a screenshot of the default settings, the data-management plan listing the only fields stored, or a storage check showing no video files on the server.",
            "0.25 pts — risk 2, different from risk 1: e.g. voluntariness and informed consent (drivers may feel pressure if employers are involved; consent must explain alerts, logs and location), or confidentiality of sleep and fatigue data that could harm drivers if employers saw it, or insecure storage.",
            "0.25 pts — a specific safeguard for risk 2: voluntary participation with a clear way to withdraw and no employer access to individual results; pseudonymous participant codes with the name–code key kept separately in encrypted, institution-approved storage with named access.",
            "0.25 pts — evidence for risk 2: signed and dated consent forms (with the form version), the ethics-committee approval reference, or an access list / access log for the dataset. A safeguard without any record earns 0 for this line.",
          ],
          `- **Risk 1 — continuous video and location by default.** The app collects identifiable face video and precise location that the research question does not need, and drivers have not actively agreed to it. **Safeguard:** recording off by default; the camera image is processed on the phone and only alert times and counts are stored — no raw video, no exact location. **Evidence:** a screenshot of the default settings and the data-management plan listing the stored fields.
- **Risk 2 — consent and confidentiality of fatigue data.** Drivers may feel pressure to take part if their employer is involved, and sleep or fatigue scores could harm them if employers saw them. **Safeguard:** voluntary participation with a clear way to withdraw, pseudonymous codes, the name–code key kept separately in encrypted university storage, and no individual data shared with employers. **Evidence:** signed and dated consent forms, the ethics-approval number and the dataset's access log.`,
          `Каждый риск — три элемента: **риск из кейса**, **конкретная мера** и **запись, доказывающая, что мера применена** (строка EVIDENCE этической карточки).
- Риск 1: непрерывная запись видео лица и геолокации по умолчанию — собирается больше, чем нужно вопросу, данные идентифицируют человека, а «включено по умолчанию» — не осознанный выбор (в Study C водители заклеивали камеру). Мера: по умолчанию выключено (opt-in), кадры обрабатываются на телефоне, хранятся только время и число сигналов. Доказательство: скриншот настроек по умолчанию, план управления данными со списком хранимых полей.
- Риск 2: добровольность и конфиденциальность — если участвует работодатель, водители могут чувствовать давление, а данные о сне и усталости могут им навредить. Мера: добровольное участие с понятным выходом, коды вместо имён, ключ «имя—код» отдельно в зашифрованном хранилище университета, работодатель не видит индивидуальных данных. Доказательство: подписанные формы согласия, номер одобрения этического комитета, журнал доступа.
Где теряют баллы: «будем осторожны», «соблюдаем закон» — не конкретная мера; мера без записи-доказательства; один и тот же риск дважды; обещание «анонимности» при наличии ключа «имя—код» — это конфиденциальность, а не анонимность.`),
        open("rmv1-b6", "6", 1.5, B.b6(),
          [
            SYNTHESIS_THEMES,
            "0.5 pts — notes the methodological contrast and what it means: only A is randomised (but taxi drivers and self-reported near-misses); B is observational — responders self-selected and baseline sleep was not controlled, so no causal claim; C is qualitative — explains acceptance (audio valued, video intrusive) but gives no effect size; D is a secondary review showing inconsistent definitions, different outcomes and short follow-up.",
            "0.5 pts — draws an overall conclusion with limitations: the evidence that alerts reduce fatigue-related events is promising but weak or indirect — no significant accident effect, self-reported or self-selected outcomes, few long-haul truck drivers — and acceptance depends on privacy (video).",
          ],
          `Across the evidence, drowsiness alerts are associated with fewer fatigue-related events, but the strength of that evidence is limited. Study A, the only randomised study, and Study B both report positive effects, yet A's benefit appears only in self-reported near-misses (the accident difference was not significant), and B's comparison of frequent and infrequent responders is observational, so drivers who respond often may simply sleep better. Study D confirms this mixed picture across 15 studies and partly explains it: definitions of a "fatigue event" and outcome measures differ, and follow-up is short. Study C adds what the numbers cannot show: long-haul drivers value audio alerts but find constant video intrusive, and some covered the camera, which may limit real use. Overall, the evidence is promising but indirect for long-haul truck drivers, who are under-represented in A, B and D.`,
          `Нужен синтез, а не пересказ: каждое предложение связывает минимум два исследования. Схема образца: (1) что совпадает — A и B говорят о меньшем числе событий усталости; (2) почему доверие ограничено — в A эффект только по самоотчёту, по авариям незначим; B наблюдательное, водители сами выбирали, как реагировать (самоотбор), сон не контролировался; (3) что объясняет разброс — D: разные определения «fatigue event», разные показатели, короткое наблюдение; (4) что добавляет качественное C — звуковой сигнал ценят, видео раздражает, камеру заклеивают; (5) общий вывод с ограничениями.
Где теряют баллы: «Study A found… Study B found…» по очереди (0 за первую строку критериев); не сказано, что B не доказывает причинность; C используется как доказательство эффекта (эффект оно не измеряет); нет итогового вывода или вывод «приложения точно работают».`),
        open("rmv1-b7", "7", 1, B.b7("SafeDrive"),
          [
            "0.5 pts — a gap that follows from the table and is tied to studies: e.g. limited controlled evidence for long-haul truck drivers (A used taxi drivers aged 35–55; D found few long-haul studies), or inconsistent and self-reported fatigue outcomes (A self-reported near-misses; D inconsistent definitions). Phrased as limited evidence; 'no research exists' or a gap not linked to the table earns 0 for this line.",
            "0.5 pts — explains how this study addresses it: a controlled comparison of SafeDrive vs the paper checklist in 60 long-haul truck drivers, with the same validated fatigue scale in both groups instead of self-reported events. Only 'the study will fill the gap', or promising to measure accidents or long-term effects in six weeks, earns 0.",
          ],
          `Existing evidence on drowsiness alerts comes mainly from other driver groups and uses inconsistent outcomes: the only randomised study (A) involved taxi drivers aged 35–55 and relied on self-reported near-misses, and the review (D) found few studies of long-haul truck drivers and inconsistent definitions of a "fatigue event". There is therefore limited controlled evidence on whether a phone-based alert reduces fatigue among long-haul truck drivers when fatigue is measured consistently. The proposed study addresses this by comparing two groups of long-haul truck drivers (ideally assigned at random) — SafeDrive vs the paper checklist — with the same validated fatigue scale in both groups over six weeks.`,
          `Пробел должен следовать из таблицы: единственное рандомизированное исследование (A) — на таксистах 35–55 лет и с самоотчётом, в обзоре (D) мало работ о дальнобойщиках, а «fatigue event» определяют по-разному. Значит, контролируемых данных **именно о дальнобойщиках** с единым измерением усталости **мало** — это пробел популяции и измерения. Исследование закрывает его: две группы дальнобойщиков (лучше со случайным распределением), SafeDrive против чек-листа, одна валидированная шкала в обеих группах.
Где теряют баллы: «исследований по этой теме нет» — неверно, в таблице их четыре; пробел не опирается на конкретные исследования; «исследование заполнит пробел» без объяснения, как; обещание измерить аварии или долгосрочный эффект — шести недель для этого мало.`),
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// rmv2 — MedTime: напоминания о лекарствах для пожилых
// ─────────────────────────────────────────────────────────────────────────────

const v2: MockExam = {
  id: "rmv2",
  title: title("MedTime", "напоминания о лекарствах для пожилых"),
  minutes: MINUTES,
  total: 10,
  source: NEW,
  questions: [
    {
      id: "rmv2-a",
      title: PART_A,
      points: 3,
      context: caseContext(
        `A city polyclinic in Astana is considering **MedTime**, a mobile app that reminds older patients with high blood pressure (hypertension) to take their tablets. MedTime plays a voice reminder in Kazakh or Russian and asks the patient to tap "Taken". It logs every reminder, whether "Taken" was tapped, and when. Relatives can follow the patient's doses on a family dashboard.
The team plans an eight-week study with 80 patients aged 65 and over with hypertension: one group uses MedTime, the other receives the polyclinic's standard printed medication schedule. Planned data: app reminder logs, pharmacy refill records, home blood-pressure readings, a validated medication-adherence questionnaire, and a digital-literacy score.
The team calls the project "Smart Health for Seniors" and asks: "Can mobile apps solve healthcare problems for old people?" They write: "With MedTime, seniors will never forget their pills again."
Several references were copied from the reference list of a Wikipedia article on mobile health, and the paper the team cites most often was retracted in 2021 — nobody checked the publisher page. By default, MedTime shares every patient's doses and blood-pressure readings with relatives, and the consent form is signed by a relative instead of the patient. Some patients have mild memory problems.`,
        [
          `| Study A | Randomised controlled trial; 200 adults aged 50 to 64 with type 2 diabetes; 12 weeks | SMS reminders improved self-reported adherence. The difference in blood-sugar control was small and not statistically significant | Adherence was self-reported. Younger patients with a different disease; SMS, not an app |`,
          `| Study B | Log analysis of 5,000 users of a commercial pill-reminder app | Users who opened the app daily confirmed more doses than occasional users | Users chose how often to open the app. A tap on "Taken" does not prove the tablet was taken |`,
          `| Study C | Focus groups with 24 patients aged 70 and over at one district clinic | Participants valued voice reminders in their own language but found small buttons and frequent notifications stressful; several relied on a grandchild to use the phone | Small sample from one clinic. Adherence was not measured |`,
          `| Study D | Systematic review of 22 medication-reminder studies | Results were mixed. Adherence was measured in different ways (self-report, pill counts, app taps), and most follow-up periods were three months or shorter | Few studies included adults over 75 or people with memory problems. Dropout was common |`,
        ],
      ),
      tasks: [
        mc("rmv2-a1", "1",
          `Which revision of "Can mobile apps solve healthcare problems for old people?" is the most focused and researchable?`,
          [
            "Can mobile health apps solve the main healthcare problems of older patients living in Kazakhstan?",
            "Why do older people around the world find modern health technology so difficult to use every day?",
            "How can the team prove that MedTime is the best medication-reminder app for older patients today?",
            "Does MedTime, versus a printed schedule, raise refill-based adherence in hypertensive patients aged 65+?",
          ], 3,
          `**Correct: the MedTime vs printed-schedule question.** It names the population (hypertensive patients aged 65+), the comparison (MedTime vs the printed schedule) and a measurable outcome the plan already collects (adherence from pharmacy refill records).
- "Solve the main healthcare problems…" — still broad: no specific problem, comparison or measure; only "Kazakhstan" was added.
- "Why do older people around the world…" — a different, global question that one polyclinic cannot answer, and it does not test MedTime at all.
- "How can the team prove that MedTime is the best…" — sets out to prove a conclusion (biased); "the best" cannot be measured, and no other apps are compared.`,
          `**Верно: вопрос «MedTime против печатного графика».** В нём есть популяция (пациенты 65+ с гипертонией), сравнение (MedTime против печатного графика) и измеримый результат, который план уже собирает (приверженность по данным аптеки о повторном получении лекарств).
- «Solve the main healthcare problems…» — всё ещё слишком широко: нет конкретной проблемы, сравнения и измерения, добавлено только «в Казахстане».
- «Why do older people around the world…» — другой, глобальный вопрос, на который одна поликлиника не ответит, и MedTime он вообще не проверяет.
- «How can the team prove that MedTime is the best…» — цель «доказать» заранее заданный вывод (предвзятость); «лучшее» не измерить, а с другими приложениями никто не сравнивает.`),
        mc("rmv2-a2", "2",
          `Which rewrite turns "With MedTime, seniors will never forget their pills again" into a testable hypothesis?`,
          [
            "MedTime will completely solve the problem of forgotten medication for all older patients in Astana.",
            "MedTime users will show higher refill-based adherence at eight weeks than the printed-schedule group.",
            "MedTime is an innovative digital solution that older patients and their families will truly appreciate.",
            "The study aims to show that MedTime prevents every missed dose among older patients with hypertension.",
          ], 1,
          `**Correct: "MedTime users will show higher refill-based adherence at eight weeks…".** A hypothesis is a testable prediction: it names a comparison (MedTime vs printed schedule), a measurable outcome from the planned data (refill records) and a time point, and the data could prove it wrong.
- "Will completely solve… for all older patients in Astana" — still an absolute promise, far beyond what 80 patients can show.
- "An innovative solution that… families will appreciate" — promotional wording with no measurable outcome or comparison.
- "The study aims to show that MedTime prevents every missed dose" — an aim that presupposes the result; research tests a prediction instead of setting out to confirm it.`,
          `**Верно: «MedTime users will show higher refill-based adherence at eight weeks…».** Гипотеза — проверяемое предсказание: есть сравнение (MedTime против печатного графика), измеримый результат из планируемых данных (данные аптеки) и срок, и данные могут её опровергнуть.
- «Will completely solve… for all older patients in Astana» — то же абсолютное обещание, далеко за пределами того, что покажут 80 пациентов.
- «An innovative solution that… families will appreciate» — рекламная формулировка без измеримого результата и сравнения.
- «The study aims to show that MedTime prevents every missed dose» — цель, которая заранее предполагает результат; исследование проверяет предсказание, а не задаётся целью его подтвердить.`),
        mc("rmv2-a3", "3",
          `Which of the following is a research output of the MedTime project?`,
          [
            "The voice-reminder module recorded in Kazakh and Russian",
            "The family dashboard that displays each confirmed dose",
            "The database that stores reminder times and tap events",
            "The comparison of refill-based adherence between groups",
          ], 3,
          `**Correct: "the comparison of refill-based adherence between groups".** A research output is knowledge obtained by analysing evidence — here, whether adherence differs between MedTime and the printed schedule.
- "The voice-reminder module" — a feature the team builds: development output.
- "The family dashboard" — another built feature: development output.
- "The database that stores reminder times" — infrastructure that holds raw data; data become a research output only once they are analysed.`,
          `**Верно: «the comparison of refill-based adherence between groups».** Исследовательский результат — знание, полученное анализом доказательств: отличается ли приверженность при MedTime и при печатном графике.
- «The voice-reminder module» — функция, которую строит команда: результат разработки.
- «The family dashboard» — тоже построенная функция: результат разработки.
- «The database that stores reminder times» — инфраструктура с сырыми данными; исследовательским результатом данные становятся только после анализа.`),
        mc("rmv2-a4", "4",
          `Study B found that users who opened the app daily confirmed more doses. Why can this finding not show that opening the app causes better adherence?`,
          [
            "Users chose how often to open the app, so daily users may differ in motivation",
            "A sample of 5,000 users is too small for any statistical comparison to be made",
            "Log data are qualitative, so the number of confirmed doses cannot be counted",
            "It was a randomised trial, and randomised trials cannot show cause and effect",
          ], 0,
          `**Correct: users chose how often to open the app.** Study B is an observational log analysis: daily users selected themselves, so they may be more motivated or healthier anyway (self-selection, confounding). Also, a tap on "Taken" is not proof that the tablet was taken.
- "5,000 users is too small" — 5,000 is a large sample; size does not fix self-selection.
- "Log data are qualitative" — logs are counts and times, i.e. quantitative data.
- "It was a randomised trial" — it was not; random assignment (as in Study A) is exactly what supports causal claims.`,
          `**Верно: пользователи сами решали, как часто открывать приложение.** Study B — наблюдательный анализ журналов: ежедневные пользователи «отобрали себя сами» и, возможно, и без того более мотивированы (самоотбор, вмешивающиеся факторы). К тому же нажатие «Taken» не доказывает, что таблетка выпита.
- «5,000 users is too small» — 5 000 — большая выборка; размер не устраняет самоотбор.
- «Log data are qualitative» — журналы — это числа и время, то есть количественные данные.
- «It was a randomised trial» — нет; именно случайное распределение (как в Study A) позволяет говорить о причине и следствии.`),
        mc("rmv2-a5", "5",
          `The paper the team cites most often was retracted in 2021, and nobody checked the publisher page. What should the team do?`,
          [
            "Keep citing it, because it was peer-reviewed before it was retracted",
            "Keep citing it, because it has a DOI and has been cited many times",
            "Stop using it as evidence, and mention the retraction if it is discussed",
            "Replace it with the Wikipedia article that summarises the same results",
          ], 2,
          `**Correct: stop using it as evidence.** Checking for corrections and retractions is a step of the verification ladder; a retracted paper's findings are withdrawn from the scientific record and cannot support a claim. If it is mentioned at all, the retraction must be stated.
- "Peer-reviewed before it was retracted" — the retraction overrides the earlier review.
- "It has a DOI and many citations" — a DOI is an identifier, not a quality badge, and citations may predate the retraction.
- "Replace it with Wikipedia" — Wikipedia is informal, for orientation only; claims must be traced to the original scholarly sources.`,
          `**Верно: перестать использовать её как доказательство.** Проверка исправлений и отзывов (retraction) — ступень лестницы проверки; результаты отозванной статьи изъяты из научного оборота и ничего не подтверждают. Если о ней всё же упоминают, нужно прямо указать, что она отозвана.
- «Peer-reviewed before it was retracted» — отзыв отменяет прежнее рецензирование.
- «It has a DOI and many citations» — DOI — идентификатор, а не знак качества, а цитирования могли появиться до отзыва.
- «Replace it with Wikipedia» — Википедия — неформальный источник, только для ориентира; утверждения нужно прослеживать до оригинальных научных работ.`),
        mc("rmv2-a6", "6",
          `MedTime shares each patient's doses and blood-pressure readings with relatives by default, and relatives sign the consent form. Which safeguard addresses this most directly?`,
          [
            "Ask each patient for their own consent and make sharing opt-in",
            "Ask relatives to sign a longer and more detailed consent form",
            "Encrypt the family dashboard but keep sharing on by default",
            "Recruit only patients whose relatives already use smartphones",
          ], 0,
          `**Correct: each patient's own consent, with sharing as opt-in.** The participants are the patients: they must understand, choose, be able to withdraw and ask questions, and health data should go to relatives only if the patient decides so. For patients with mild memory problems, plain language and a capacity check are needed; a relative may help but not decide.
- "A longer form for relatives" — still not the patient's consent.
- "Encrypt the dashboard, sharing on by default" — encryption protects transfer, but relatives still see the data without the patient's choice.
- "Recruit only patients whose relatives use smartphones" — a sampling choice that biases the sample and does nothing for consent.`,
          `**Верно: собственное согласие каждого пациента и передача данных только по его выбору (opt-in).** Участники — пациенты: они должны понимать, выбирать, иметь возможность выйти и задать вопросы, а медицинские данные уходят родственникам, только если пациент так решил. Для пациентов с лёгкими проблемами памяти — простой язык и проверка способности дать согласие; родственник может помочь, но не решать за пациента.
- «A longer form for relatives» — это всё равно не согласие пациента.
- «Encrypt the dashboard, sharing on by default» — шифрование защищает передачу, но родственники по-прежнему видят данные без выбора пациента.
- «Recruit only patients whose relatives use smartphones» — решение о выборке, которое искажает её и никак не решает вопрос согласия.`),
      ],
    },
    {
      id: "rmv2-b",
      title: PART_B,
      kind: "question",
      points: 7,
      context: partBContext("MedTime"),
      tasks: [
        open("rmv2-b1", "1", 0.5, B.b1("MedTime"),
          [
            "0.25 pts — a development output: something built — the MedTime app, its voice reminders in Kazakh/Russian, the 'Taken' button, the reminder log or the family dashboard. A finding given here earns 0.",
            "0.25 pts — a research output: knowledge from the study — e.g. the comparison of refill-based adherence (or adherence-questionnaire scores, or home blood pressure) between the MedTime and printed-schedule groups after eight weeks. The app, a feature or the raw logs earn 0.",
          ],
          `- **Development output:** the MedTime app — voice reminders in Kazakh and Russian, the "Taken" button and the family dashboard.
- **Research output:** the eight-week comparison of medication adherence, measured by pharmacy refill records, between patients using MedTime and patients using the printed schedule.`,
          `Результат разработки — то, что **построено**: приложение MedTime с голосовыми напоминаниями на казахском и русском, кнопкой «Taken» и семейной панелью. Исследовательский результат — **знание**: сравнение приверженности лечению по данным аптеки за восемь недель между группой MedTime и группой с печатным графиком.
Где теряют баллы: «журнал напоминаний» назван исследовательским результатом — это сырые данные; «пациенты перестанут забывать таблетки» — обещание, а не результат; в обеих позициях названы функции приложения.`),
        open("rmv2-b2", "2", 1, B.b2("MedTime"),
          [
            "0.25 pts — current situation: older patients with hypertension need to take tablets regularly, and the polyclinic is considering a reminder app (MedTime). Neutral — no 'never forget', no invented figures.",
            "0.5 pts — a limitation supported by the table and attributed: e.g. Study A — adherence improved only by self-report, no significant clinical effect, younger diabetic patients and SMS; Study D — mixed results, adherence measured in different ways, few adults over 75 or with memory problems; Study B — taps do not prove intake and users self-selected. 0.25 if plausible but not tied to a study; 0 for an opinion or a claim that apps work.",
            "0.25 pts — the need that follows from it: a controlled comparison of MedTime vs the printed schedule in hypertensive patients aged 65+, with an objective adherence measure (refill records) rather than taps or self-report alone.",
          ],
          `Older patients with hypertension need to take their tablets regularly, and an Astana polyclinic is considering MedTime, a voice-reminder app, to support them. However, the evidence for reminders is limited: the randomised Study A found only self-reported improvements in younger diabetic patients using SMS, and the review in Study D reports mixed results, inconsistent adherence measures and few participants over 75 or with memory problems. A controlled study is therefore needed that compares MedTime with the standard printed schedule in patients aged 65 and over, using an objective measure such as pharmacy refill records.`,
          `(1) **Ситуация** — нейтрально: пожилым пациентам с гипертонией нужно регулярно принимать таблетки, поликлиника рассматривает MedTime. (2) **Ограничение со ссылкой на таблицу**: в Study A улучшение только по самоотчёту, у более молодых пациентов с диабетом и через SMS; в Study D результаты смешанные, приверженность измеряли по-разному, людей старше 75 и с проблемами памяти почти нет; в Study B нажатие не доказывает приём таблетки. (3) **Потребность**, вытекающая из ограничения: сравнить MedTime с печатным графиком у пациентов 65+ по объективному показателю (данные аптеки).
Где теряют баллы: «пожилые постоянно забывают таблетки» без опоры на кейс; ограничение без указания исследования (0.25 вместо 0.5); потребность «сделать удобное приложение» не связана с ограничением; «seniors will never forget» — утверждение, а не проблема.`),
        open("rmv2-b3", "3", 1, B.b3("MedTime"),
          [
            "0.25 pts — one clear, focused, neutral question (not 'Can apps solve healthcare problems…', not a question that assumes MedTime works, not two questions in one).",
            "0.25 pts — the population: patients aged 65 and over with hypertension (at the polyclinic).",
            "0.25 pts — the comparison: MedTime vs the standard printed medication schedule.",
            "0.25 pts — a measurable outcome available for both groups within eight weeks: refill-based adherence, the validated adherence-questionnaire score, or home blood pressure. App taps earn 0 for this line: only the MedTime group produces them, so they cannot compare the groups (and Study B shows a tap is not a dose).",
          ],
          `Among patients aged 65 and over with hypertension at the polyclinic, does medication adherence measured by pharmacy refill records over eight weeks differ between patients who use MedTime and patients who receive the standard printed medication schedule?
It is feasible: the 80 patients, both conditions and the refill records are already in the plan.`,
          `Популяция — пациенты 65+ с гипертонией; сравнение — MedTime против печатного графика; результат — приверженность по данным аптеки за восемь недель (подходят также балл валидированного опросника или домашнее давление). Вопрос нейтральный: «отличается ли», а не «насколько MedTime лучше».
Где теряют баллы: результат «нажатия Taken» — они есть только у группы MedTime, сравнить группы по ним нельзя, а Study B показывает, что нажатие — не приём таблетки; «здоровье пожилых» вместо измеримого показателя; нет группы сравнения; вопрос о «пожилых вообще».`),
        open("rmv2-b4", "4", 0.5, B.b4("MedTime"),
          [
            "0.25 pts — three or four concept groups joined with AND that match the study — the population (older adults), the intervention (reminder app) and the outcome (medication adherence), optionally the condition (hypertension) — each with at least two synonyms joined with OR inside parentheses.",
            SEARCH_SYNTAX,
          ],
          `= ("older adult" OR elderly OR "older people") AND ("medication reminder" OR "reminder app" OR mHealth) AND ("medication adherence" OR "medication compliance") AND (hypertension OR "high blood pressure")
Each concept is a bracketed group of synonyms joined with OR; AND requires all four concepts; quotation marks keep phrases together. If too few results appear, the hypertension group can be dropped to broaden the search.`,
          `= ("older adult" OR elderly OR "older people") AND ("medication reminder" OR "reminder app" OR mHealth) AND ("medication adherence" OR "medication compliance") AND (hypertension OR "high blood pressure")
Понятия — кто, вмешательство, результат, заболевание; внутри скобок синонимы через OR, между группами AND, фразы в кавычках. Если результатов мало, группу про гипертонию можно убрать — строка станет шире.
Где теряют баллы: вставлен вопрос целиком; «MedTime» в строке поиска (о конкретном приложении статей нет); только AND или только OR; нет кавычек у фраз из нескольких слов.`),
        open("rmv2-b5", "5", 1.5, B.b5("MedTime"),
          [
            "0.25 pts — risk 1 from the case: sensitive health data (doses, blood pressure) shared with relatives by default — patients have not chosen who sees their data (confidentiality).",
            "0.25 pts — a specific safeguard for risk 1: sharing off by default; the patient decides whether and with whom to share. 'Protect the data' earns 0.",
            "0.25 pts — evidence for risk 1: a screenshot of the default sharing setting, the data-management plan, or the consent-form item where the patient chose to share or not.",
            "0.25 pts — risk 2, different from risk 1: consent signed by a relative instead of the patient while some patients have mild memory problems (capacity, voluntariness); or insecure storage of identifiable health data.",
            "0.25 pts — a specific safeguard for risk 2: each patient gives their own informed consent in plain Kazakh or Russian, read aloud if needed, with a capacity check and a clear way to withdraw — a relative may help but not decide; or encrypted storage with pseudonymous codes and named access.",
            "0.25 pts — evidence for risk 2: consent forms signed by the patients themselves (dated, with the form version), a consent-process log, the ethics-committee approval reference, or an access log. A safeguard without a record earns 0 for this line.",
          ],
          `- **Risk 1 — health data shared by default.** Doses and blood-pressure readings go to relatives without the patient choosing it. **Safeguard:** sharing is off by default; each patient decides whether to share and with whom. **Evidence:** a screenshot of the default setting and the consent-form item where the patient made the choice.
- **Risk 2 — consent given by relatives for patients with memory problems.** The participant is the patient, so the patient must understand and agree. **Safeguard:** each patient gives their own consent in plain Kazakh or Russian, read aloud if needed, with a short capacity check and a clear way to withdraw; a relative can support but not decide. **Evidence:** consent forms signed by the patients, a consent-process log and the ethics-approval reference.`,
          `- Риск 1: медицинские данные (дозы, давление) по умолчанию уходят родственникам — пациент не выбирал, кто их видит (конфиденциальность). Мера: передача выключена по умолчанию, пациент сам решает, делиться ли и с кем. Доказательство: скриншот настройки по умолчанию, пункт формы согласия с выбором пациента.
- Риск 2: согласие подписывает родственник, а у части пациентов лёгкие проблемы памяти — нарушены «понять» и «выбрать». Мера: собственное согласие пациента простым языком на казахском или русском, при необходимости вслух, короткая проверка понимания, понятный способ выйти; родственник помогает, но не решает. Доказательство: формы, подписанные самими пациентами, журнал процедуры согласия, номер одобрения этического комитета.
Где теряют баллы: «зашифруем данные» как ответ на передачу родственникам (шифрование не даёт выбора); «родственник подпишет подробнее»; мера без записи-доказательства; оба пункта про один и тот же риск.`),
        open("rmv2-b6", "6", 1.5, B.b6(),
          [
            SYNTHESIS_THEMES,
            "0.5 pts — the methodological contrast and what it means: A is randomised but uses self-reported adherence in younger diabetic patients with SMS; B is a log analysis with self-selection and taps that do not prove intake; C is qualitative — explains usability (voice valued, small buttons and notifications stressful, help from grandchildren) but measures no adherence; D is a secondary review showing inconsistent adherence measures and short follow-up.",
            "0.5 pts — an overall conclusion with limitations: reminders may improve adherence, but the evidence is mostly self-reported or self-selected, the clinical effect is unclear (A), and patients over 75 or with memory problems are under-represented (D).",
          ],
          `Reminder tools appear to increase adherence, but mostly on weak measures. Study A (randomised) and Study B (log analysis) both report more adherent behaviour, yet A relies on self-report and found no significant change in blood-sugar control, while B's daily users chose their own level of use, and a tap on "Taken" is not proof of intake. Study D explains why the overall picture is mixed: adherence was measured in different ways and follow-up was short. Study C suggests why taps may mislead with older users: patients liked voice reminders in their own language, but small buttons were stressful and some relied on grandchildren to use the phone. Overall, the evidence is promising but indirect for patients aged 65+ with hypertension, especially those over 75 or with memory problems, who are rarely included.`,
          `Синтез по темам: (1) **что сходится** — A и B показывают больше «приверженного» поведения; (2) **почему этому мало доверия** — в A самоотчёт и незначимый клинический эффект, в B самоотбор и нажатие вместо приёма таблетки; (3) **что объясняет разброс** — D: приверженность измеряли по-разному, наблюдение короткое; (4) **что добавляет качественное C** — голос на родном языке ценят, мелкие кнопки и частые уведомления пугают, за телефон берутся внуки, то есть нажатие может делать не пациент; (5) **вывод с ограничениями** — данные обнадёживают, но косвенны для 65+ с гипертонией, особенно старше 75.
Где теряют баллы: пересказ по очереди «Study A… Study B…»; вывод «напоминания доказанно работают»; нет слова о самоотборе в B; C используется как доказательство эффекта.`),
        open("rmv2-b7", "7", 1, B.b7("MedTime"),
          [
            "0.5 pts — a gap that follows from the table and cites it: e.g. limited controlled evidence on app-based voice reminders for patients aged 65+ with hypertension (A: younger diabetic patients, SMS; D: few over 75 or with memory problems), or limited use of objective adherence measures (A self-report; B taps; D inconsistent measures). Stated as limited evidence; 'no research exists' or a gap not linked to the table earns 0 for this line.",
            "0.5 pts — how this study addresses it: compares MedTime with the printed schedule in 80 patients aged 65+ with hypertension, using pharmacy refill records and a validated questionnaire (and home blood pressure) in both groups, with voice reminders in Kazakh/Russian as valued in Study C. A bare 'the study will fill the gap' earns 0.",
          ],
          `Most evidence on reminders comes from younger or different patient groups and from weak adherence measures: Study A studied adults aged 50–64 with diabetes using SMS and self-report, and Study D found few studies of adults over 75 and inconsistent ways of measuring adherence. There is therefore limited controlled evidence on whether an app with voice reminders improves objectively measured adherence in older patients with hypertension. The proposed study addresses this by comparing MedTime with the printed schedule in 80 patients aged 65 and over, using pharmacy refill records and a validated questionnaire in both groups.`,
          `Пробел популяции и измерения: в A — пациенты 50–64 лет с диабетом, SMS и самоотчёт; в D мало людей старше 75 и разные способы измерения приверженности. Значит, контролируемых данных о голосовых напоминаниях в приложении у пожилых с гипертонией и с объективным измерением **мало**. Исследование отвечает на это: 80 пациентов 65+, MedTime против печатного графика, данные аптеки и валидированный опросник в обеих группах.
Где теряют баллы: «исследований о пожилых нет» — в таблице они есть; пробел, не связанный с таблицей («приложений на казахском мало»); не сказано, как именно дизайн исследования закрывает пробел; обещание долгосрочного эффекта при восьми неделях наблюдения.`),
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// rmv3 — CodeMate: ИИ-тьютор для первокурсников
// ─────────────────────────────────────────────────────────────────────────────

const v3: MockExam = {
  id: "rmv3",
  title: title("CodeMate", "чат-бот-тьютор для первокурсников"),
  minutes: MINUTES,
  total: 10,
  source: NEW,
  questions: [
    {
      id: "rmv3-a",
      title: PART_A,
      points: 3,
      context: caseContext(
        `The software engineering department of a university in Almaty is considering **CodeMate**, an AI chatbot tutor for the introductory Python course, which is taught in Kazakh and Russian. First-year students paste their code and questions, and CodeMate replies with hints instead of full solutions. The chatbot logs every conversation together with the student's university ID and the time spent on each task.
The team plans a ten-week study with 120 first-year students in four lab groups: two groups get CodeMate, the other two use the usual teaching-assistant office hours. Planned data: chat logs, weekly lab scores, midterm exam scores, a validated programming self-efficacy questionnaire, and prior programming experience.
The team calls the project "AI in Education" and asks: "Is artificial intelligence good for learning?" They write: "CodeMate will make every student pass the course."
Most of the team's references come from one online journal that promises peer review and publication within 72 hours for a fee, and the team has read only the abstracts. The researchers are teaching assistants who also grade these students, and the chat logs, with student IDs, are sent to the server of an external AI company.`,
        [
          `| Study A | Systematic review of 31 studies of AI tutors and chatbots in programming courses | Most studies reported higher student satisfaction; effects on exam scores were mixed | Most studies lasted under six weeks and many relied on self-reported learning. Few were conducted outside English-language courses |`,
          `| Study B | Quasi-experiment; 2 course sections, 140 students, one semester | The chatbot section had higher lab-assignment scores; exam scores did not differ significantly | Sections were not randomly assigned and had different instructors |`,
          `| Study C | Semi-structured interviews with 20 first-year students | Students valued instant hints late at night but worried about relying on them; some copied hints without understanding them | Volunteers from one university. No performance data |`,
          `| Study D | Log analysis of 2,300 students in an online programming course with a chatbot | Students who asked the chatbot more questions had higher final grades | Students chose how often to use the chatbot. Prior programming experience was not controlled |`,
        ],
      ),
      tasks: [
        mc("rmv3-a1", "1",
          `Which criterion does the question "Is artificial intelligence good for learning?" fail most clearly?`,
          [
            "It is not focused: no population, tool or measurable learning outcome is named",
            "It is not original: AI in education has already been studied by many researchers",
            "It is not ethical: questions about AI cannot be asked without committee approval",
            "It is too technical: research questions should avoid the term 'artificial intelligence'",
          ], 0,
          `**Correct: it is not focused.** "Artificial intelligence" covers thousands of tools, "good" is a judgement rather than a measure, and "learning" is not defined — no population, comparison or outcome is named, so no evidence could settle the question. A focused version: first-year students in the Python course, CodeMate vs office hours, midterm scores.
- "Not original" — originality is not one of the criteria (clear, focused, researchable, feasible, connected); existing studies are where a gap is found, not a reason to reject a question.
- "Not ethical" — ethics review concerns how data are collected from people, not whether a question may be asked.
- "Too technical" — the problem is vagueness, not terminology; the term is fine once the specific tool is named.`,
          `**Верно: вопрос не сфокусирован.** «Искусственный интеллект» — это тысячи инструментов, «хорош» — оценка, а не измерение, «обучение» не определено; нет ни популяции, ни сравнения, ни результата, поэтому никакие данные не дадут ответа. Сфокусированная версия: первокурсники курса Python, CodeMate против консультаций ассистентов, баллы мидтерма.
- «Not original» — оригинальность не входит в критерии (clear, focused, researchable, feasible, connected); прежние исследования — это место, где ищут пробел, а не причина отбросить вопрос.
- «Not ethical» — этическая экспертиза касается того, как собирают данные от людей, а не того, можно ли задать вопрос.
- «Too technical» — беда в расплывчатости, а не в терминах; слово уместно, когда назван конкретный инструмент.`),
        mc("rmv3-a2", "2",
          `The team writes: "CodeMate will make every student pass the course." What is the best response from a research perspective?`,
          [
            "Accept it as the research aim, because it states what the study will do",
            "Move it to the research gap section, since nobody has proved it so far",
            "Keep it in the abstract to motivate readers to read the whole paper",
            "Treat it as an unsupported claim and test a measurable prediction instead",
          ], 3,
          `**Correct: treat it as an unsupported claim.** "Every student will pass" is an absolute promise with no comparison and no evidence — and the table points the other way: in Study B exam scores did not differ, and Study A found mixed exam effects. Passing the course is not even measured in the ten-week plan. A testable prediction would be: "Lab groups using CodeMate will have higher midterm scores than lab groups using office hours."
- "Accept it as the research aim" — an aim says what the study will do ("to compare…"), not which result it promises.
- "Move it to the research gap" — a gap is something not yet known and justified by the literature, not an unproven promise.
- "Keep it in the abstract" — an abstract reports what was done and found; an unsupported claim there is hype, not science.`,
          `**Верно: считать это неподкреплённым утверждением.** «Сдадут все» — абсолютное обещание без сравнения и без доказательств, а таблица говорит об обратном: в Study B баллы экзамена не различались, в Study A эффекты на экзамен смешанные. Сдачу курса десятинедельный план даже не измеряет. Проверяемое предсказание: «Лабораторные группы с CodeMate получат на мидтерме больше баллов, чем группы с консультациями».
- «Accept it as the research aim» — цель говорит, что исследование сделает («сравнить…»), а не какой результат обещает.
- «Move it to the research gap» — пробел — то, что ещё неизвестно и обосновано литературой, а не недоказанное обещание.
- «Keep it in the abstract» — аннотация сообщает, что сделано и найдено; неподкреплённое утверждение там — хайп, а не наука.`),
        mc("rmv3-a3", "3",
          `Which item is a development output of the CodeMate project, not a research output?`,
          [
            "The comparison of lab scores between CodeMate and office-hours groups",
            "The analysis of self-efficacy change in both kinds of lab groups",
            "The hint-only prompt design that stops CodeMate giving full solutions",
            "The relationship between chat frequency and midterm exam scores",
          ], 2,
          `**Correct: the hint-only prompt design.** It is part of the product the team builds — a design decision implemented in the chatbot. The other three produce knowledge from data, so they are research outputs.
- "The comparison of lab scores between groups" — a group comparison: research output.
- "The analysis of self-efficacy change" — an analysis of questionnaire data: research output.
- "The relationship between chat frequency and midterm scores" — a correlational finding: research output (and, like Study D, it would not prove cause).`,
          `**Верно: дизайн промпта «только подсказки».** Это часть продукта, который строит команда, — решение, реализованное в чат-боте. Остальные три варианта дают знание из данных, то есть это исследовательские результаты.
- «The comparison of lab scores between groups» — сравнение групп: исследование.
- «The analysis of self-efficacy change» — анализ данных опросника: исследование.
- «The relationship between chat frequency and midterm scores» — корреляционный вывод: исследование (и, как в Study D, причину он не доказывает).`),
        mc("rmv3-a4", "4",
          `Which study gives the most direct comparison of a chatbot condition with a non-chatbot condition, and what is its main weakness?`,
          [
            "Study D: it has the largest sample, so self-selection does not matter",
            "Study B: it compares two sections, but they were not randomly assigned",
            "Study C: its interviews measure the size of the effect most precisely",
            "Study A: a review proves causation because it combines 31 studies",
          ], 1,
          `**Correct: Study B.** It is a quasi-experiment: a chatbot section is compared with a section without one. But the sections were not randomly assigned and had different instructors, so the higher lab scores could come from the instructor or the students, not the chatbot.
- Study D — a large sample does not remove self-selection: students chose how often to use the chatbot, and there is no non-chatbot group.
- Study C — interviews are qualitative: they explain experiences, they do not measure effect size.
- Study A — a review synthesises other studies; it cannot prove causation, and here its exam effects were mixed.`,
          `**Верно: Study B.** Это квазиэксперимент: секция с чат-ботом сравнивается с секцией без него. Но секции распределены не случайно и вели их разные преподаватели, поэтому более высокие баллы за лабораторные могут объясняться преподавателем или студентами, а не чат-ботом.
- Study D — большая выборка не устраняет самоотбор: студенты сами выбирали, как часто пользоваться ботом, и группы без бота нет.
- Study C — интервью дают качественные данные: они объясняют опыт, но не измеряют величину эффекта.
- Study A — обзор обобщает чужие исследования; доказать причинность он не может, а эффекты на экзамен в нём смешанные.`),
        mc("rmv3-a5", "5",
          `Most references come from one online journal that promises peer review and publication within 72 hours for a fee, and the team has read only the abstracts. What is the main problem?`,
          [
            "Abstracts are always enough, so only the journal's fee is a concern",
            "Online journals can never be cited in an academic research paper",
            "The papers are too new; only sources over ten years old are reliable",
            "Peer review is doubtful, and no claim was checked in the full text",
          ], 3,
          `**Correct: doubtful peer review and no full-text check.** Paid "peer review" within 72 hours is a warning sign of a low-quality or predatory outlet, so Tier-1 credibility cannot be assumed. Reading only abstracts skips the fitness check — the method and results must support the claim; the 60-second abstract test is for screening, not for evidence. The team should search Scopus, IEEE Xplore or the ACM Digital Library and open the full texts.
- "Abstracts are always enough" — an abstract is a screening tool, not a replacement for reading the method and results.
- "Online journals can never be cited" — most reputable journals are online; the issue is the quality of review.
- "Too new" — age is not a quality criterion; outdated evidence can itself be a gap.`,
          `**Верно: рецензирование сомнительно, и ни одно утверждение не проверено по полному тексту.** Платное «рецензирование» за 72 часа — тревожный признак некачественного (хищнического) журнала, поэтому надёжность уровня 1 предполагать нельзя. Чтение одних аннотаций пропускает проверку пригодности: подтверждать утверждение должны метод и результаты, а тест аннотации за 60 секунд нужен для отсева, а не как доказательство. Нужно искать в Scopus, IEEE Xplore или ACM Digital Library и открывать полные тексты.
- «Abstracts are always enough» — аннотация — инструмент отсева, она не заменяет чтение метода и результатов.
- «Online journals can never be cited» — большинство авторитетных журналов выходят онлайн; дело в качестве рецензирования.
- «Too new» — возраст не критерий качества; устаревшие данные сами по себе могут быть пробелом.`),
        mc("rmv3-a6", "6",
          `The researchers are teaching assistants who grade the same students, and chat logs with student IDs are sent to an external AI company. Which pair of risks does this create?`,
          [
            "Pressure to take part, and exposure of identifiable student data",
            "A too-broad research question, and a weak Boolean search string",
            "Too few participants, and too little time to finish the analysis",
            "Plagiarism of the chatbot's code, and gift authorship in the team",
          ], 0,
          `**Correct: pressure to take part and exposure of identifiable data.** When the researchers grade the participants, students may feel they cannot refuse or criticise — participation is no longer freely chosen. Sending logs with student IDs to an external company breaks confidentiality and the "no secret data" rule: participant data must not go into an unapproved tool.
- "Too-broad question and weak search string" — framing problems, not risks to people.
- "Too few participants and too little time" — feasibility issues that these facts do not cause.
- "Plagiarism and gift authorship" — integrity issues of a different kind; nothing in the case suggests them.`,
          `**Верно: давление при участии и раскрытие идентифицирующих данных.** Когда исследователи сами ставят участникам оценки, студенты могут чувствовать, что отказаться или критиковать нельзя, — участие перестаёт быть добровольным. Отправка журналов с ID студентов внешней компании нарушает конфиденциальность и правило «no secret data»: данные участников нельзя загружать в неодобренный инструмент.
- «Too-broad question and weak search string» — проблемы формулировки, а не риски для людей.
- «Too few participants and too little time» — вопросы выполнимости, которые эти факты не создают.
- «Plagiarism and gift authorship» — нарушения другого рода; в кейсе на них ничто не указывает.`),
      ],
    },
    {
      id: "rmv3-b",
      title: PART_B,
      kind: "question",
      points: 7,
      context: partBContext("CodeMate"),
      tasks: [
        open("rmv3-b1", "1", 0.5, B.b1("CodeMate"),
          [
            "0.25 pts — a development output: something built — the CodeMate chatbot, its hint-only prompt design, the chat interface or the conversation logging. A finding given here earns 0.",
            "0.25 pts — a research output: knowledge from the study — e.g. the comparison of midterm or weekly lab scores (or self-efficacy change) between CodeMate and office-hours groups over ten weeks. The chatbot, a feature or the raw chat logs earn 0.",
          ],
          `- **Development output:** the CodeMate chatbot with its hint-only design (it gives hints, not full solutions) and its conversation logging.
- **Research output:** the ten-week comparison of midterm exam scores between the lab groups using CodeMate and the lab groups using teaching-assistant office hours.`,
          `Результат разработки — **построенное**: чат-бот CodeMate с режимом «только подсказки» и журналом диалогов. Исследовательский результат — **знание**: сравнение баллов мидтерма за десять недель между группами с CodeMate и группами с консультациями ассистентов.
Где теряют баллы: «журналы чата» названы исследовательским результатом — это сырые данные; «все студенты сдадут» — обещание, а не результат; чужой обзор (Study A) выдан за результат проекта.`),
        open("rmv3-b2", "2", 1, B.b2("CodeMate"),
          [
            "0.25 pts — current situation: first-year students in the introductory Python course need help with programming tasks, and the department is considering an AI hint chatbot (CodeMate) next to or instead of office hours. Neutral — no 'every student will pass'.",
            "0.5 pts — a limitation from the table, attributed: e.g. Study B — higher lab scores but no significant exam difference, non-random sections with different instructors; Study A — mostly under six weeks, self-reported learning, few non-English courses; Study D — self-selected use, prior experience not controlled; Study C — some students copied hints without understanding. 0.25 if plausible but not tied to a study; 0 for an opinion.",
            "0.25 pts — the need: a controlled ten-week comparison of CodeMate vs office hours for first-year students in a Kazakh/Russian-language course, measuring exam-level learning (midterm) and taking prior experience into account.",
          ],
          `First-year students in the university's introductory Python course, taught in Kazakh and Russian, need help with programming tasks, and the department is considering CodeMate, an AI chatbot that gives hints instead of solutions. However, the evidence on learning is limited: in Study B the chatbot section had higher lab scores but no significant exam difference, and its sections were not randomly assigned, while the review in Study A found mostly short studies with self-reported learning and few outside English-language courses. A ten-week comparison of CodeMate with office hours is therefore needed, measuring midterm results and taking students' prior programming experience into account.`,
          `(1) **Ситуация**: первокурсникам на курсе Python (на казахском и русском) нужна помощь с заданиями, кафедра рассматривает CodeMate. (2) **Ограничение со ссылкой**: Study B — лабораторные выше, но экзамен без значимой разницы, секции не случайные и с разными преподавателями; Study A — в основном короткие исследования с самооценкой обучения и почти без неанглоязычных курсов. (3) **Потребность**: сравнение CodeMate и консультаций за десять недель по мидтерму с учётом прежнего опыта.
Где теряют баллы: «ИИ — будущее образования» вместо ситуации; ограничение без ссылки на исследование (0.25); потребность не вытекает из ограничения; опора на аннотации из сомнительного журнала вместо таблицы.`),
        open("rmv3-b3", "3", 1, B.b3("CodeMate"),
          [
            "0.25 pts — one clear, focused, neutral question (not 'Is AI good for learning?', not 'How much will CodeMate raise grades?').",
            "0.25 pts — the population: first-year students in the introductory Python course (at this university).",
            "0.25 pts — the comparison: lab groups using CodeMate vs lab groups using teaching-assistant office hours.",
            "0.25 pts — a measurable outcome in the planned data: midterm exam scores, weekly lab scores or the validated self-efficacy score, over ten weeks. 'Learning', 'passing the course' (not measured within ten weeks) or chat counts (only CodeMate groups have them) earn 0 for this line.",
          ],
          `Among first-year students in the introductory Python course, how do midterm exam scores differ between lab groups that use the CodeMate hint chatbot and lab groups that use teaching-assistant office hours over ten weeks?
Population — first-year Python students; comparison — CodeMate vs office hours; outcome — the midterm score. Prior experience is recorded, so it can be taken into account.`,
          `Популяция — первокурсники курса Python; сравнение — группы с CodeMate против групп с консультациями ассистентов; результат — баллы мидтерма (подходят также баллы лабораторных или валидированная шкала самоэффективности) за десять недель.
Где теряют баллы: «сдача курса» — её нет в десятинедельном плане; «число сообщений в чате» — есть только у групп с ботом; «обучение» без измерения; вопрос, заранее предполагающий, что CodeMate лучше.`),
        open("rmv3-b4", "4", 0.5, B.b4("CodeMate"),
          [
            "0.25 pts — three concept groups joined with AND that match the study — the population (novice / first-year / introductory programming), the intervention (chatbot / AI tutor) and the outcome (performance, learning, self-efficacy) — each with at least two synonyms joined with OR inside parentheses.",
            SEARCH_SYNTAX,
          ],
          `= ("introductory programming" OR "novice programmer" OR "first-year student") AND (chatbot OR "AI tutor" OR "conversational agent") AND ("academic performance" OR "learning outcome" OR "self-efficacy")
AND joins the three concepts (who, intervention, outcome); OR inside the brackets adds synonyms; quotation marks keep phrases such as "AI tutor" together.`,
          `= ("introductory programming" OR "novice programmer" OR "first-year student") AND (chatbot OR "AI tutor" OR "conversational agent") AND ("academic performance" OR "learning outcome" OR "self-efficacy")
Три понятия — кто, вмешательство, результат; синонимы в скобках через OR, группы через AND, фразы в кавычках.
Где теряют баллы: «CodeMate» в строке (о конкретном боте статей нет); вопрос целиком; одно понятие («AI education»); незакрытые скобки.`),
        open("rmv3-b5", "5", 1.5, B.b5("CodeMate"),
          [
            "0.25 pts — risk 1: the researchers are teaching assistants who grade the participants — a power relationship that threatens voluntary participation (students may fear lower grades if they refuse or criticise).",
            "0.25 pts — a specific safeguard for risk 1: recruitment and consent handled by someone who does not grade these students; participation has no effect on grades; the teaching assistants see only coded data until grades are final.",
            "0.25 pts — evidence for risk 1: the information sheet stating that participation does not affect grades, consent forms held by the independent person, the ethics-approval reference.",
            "0.25 pts — risk 2: identifiable chat logs with student IDs sent to an external AI company — confidentiality and data protection (participant data in an unapproved tool, unknown storage and reuse).",
            "0.25 pts — a specific safeguard for risk 2: student IDs replaced with codes before anything leaves the university; only an approved provider with an agreement that excludes storage and training on the data; logs kept on university storage with named access.",
            "0.25 pts — evidence for risk 2: the data-processing agreement with the provider, the pseudonymisation step recorded in the data-management plan, or the access log. A safeguard without a record earns 0 for this line.",
          ],
          `- **Risk 1 — pressure to participate.** The researchers grade the same students, so students may feel they cannot refuse or speak honestly. **Safeguard:** a researcher who does not grade them recruits and collects consent; participation has no effect on grades, and the teaching assistants see only coded data until grades are final. **Evidence:** the information sheet stating this, consent forms held by the independent researcher and the ethics-approval reference.
- **Risk 2 — identifiable chat logs sent to an external company.** Student IDs and questions leave the university for an unapproved server. **Safeguard:** IDs are replaced with codes before sending, and only an approved provider with a no-storage, no-training agreement is used. **Evidence:** the signed data-processing agreement and the pseudonymisation step recorded in the data-management plan.`,
          `- Риск 1: зависимость — исследователи сами оценивают участников, отказ может казаться опасным. Мера: набор и согласие проводит человек, не ставящий им оценки; участие не влияет на оценки; ассистенты видят только закодированные данные до выставления оценок. Доказательство: информационный лист с этим условием, формы согласия у независимого исследователя, номер одобрения этического комитета.
- Риск 2: журналы с ID студентов уходят внешней ИИ-компании. Мера: ID заменяются кодами до отправки, используется одобренный провайдер с договором «не хранить и не обучаться». Доказательство: договор об обработке данных, шаг псевдонимизации в плане управления данными.
Где теряют баллы: «студенты дадут согласие» без учёта зависимости от оценок; «зашифруем» вместо удаления ID; мера без записи-доказательства; ответ про качество подсказок вместо этики.`),
        open("rmv3-b6", "6", 1.5, B.b6(),
          [
            SYNTHESIS_THEMES,
            "0.5 pts — the methodological contrast: B is a quasi-experiment without random assignment and with different instructors; D is an observational log analysis with self-selected use and no control for prior experience; C is qualitative — explains how hints are used (valued at night, copied without understanding) but has no performance data; A is a secondary review of mostly short, self-reported studies.",
            "0.5 pts — an overall conclusion with limitations: chatbots seem to raise satisfaction and task-level scores, but evidence of exam-level learning is weak or mixed (A, B), possibly because hints are copied (C); longer, controlled studies in non-English courses are lacking.",
          ],
          `The evidence suggests that AI tutors help students complete tasks more than they help them learn. Satisfaction and task-level performance improve across the studies — higher lab scores in Study B and higher grades among frequent users in Study D — but exam effects are mixed in the review (Study A) and not significant in B. The designs explain part of this: B compares sections that were not randomly assigned and had different instructors, and D's frequent users chose to engage and may simply be more experienced. Study C offers a mechanism that the quantitative studies cannot: some students copy hints without understanding them, which would raise lab scores but not exam scores. Overall, the benefit for learning is uncertain, and longer controlled studies in non-English courses are rare.`,
          `Синтез по темам: (1) **задания против обучения** — B и D показывают рост на уровне заданий, а на экзамене эффект смешанный (A) или незначимый (B); (2) **почему так** — дизайн: в B секции не случайные и разные преподаватели, в D самоотбор и не учтён опыт; (3) **механизм из C** — подсказки иногда копируют без понимания, что поднимает лабораторные, но не экзамен; (4) **вывод с ограничениями** — польза для обучения не доказана, длительных контролируемых исследований в неанглоязычных курсах мало.
Где теряют баллы: пересказ по очереди; вывод «чат-боты повышают оценки» без оговорок; D подан как доказательство причины; C не связано с остальными.`),
        open("rmv3-b7", "7", 1, B.b7("CodeMate"),
          [
            "0.5 pts — a gap from the table, cited: e.g. limited controlled evidence that chatbot tutors improve exam-level learning, not just lab scores or satisfaction (A: mixed exam effects; B: no significant exam difference, non-random), or few studies longer than six weeks and outside English-language courses (A). Stated as limited evidence; 'no research exists' or a gap not linked to the table earns 0 for this line.",
            "0.5 pts — how this study addresses it: ten weeks, first-year students in a Kazakh/Russian-language Python course, CodeMate vs office hours with midterm scores (exam level) and self-efficacy, prior experience recorded. A bare 'the study will fill the gap' earns 0.",
          ],
          `The evidence shows effects on satisfaction and assignment scores but limited evidence on exam-level learning: Study B found no significant exam difference, and the review (Study A) reports mixed exam effects from mostly short studies, few of them outside English-language courses. It therefore remains unclear whether a hint-only chatbot improves exam performance for first-year students in a Kazakh- and Russian-language course over a longer period. The proposed study addresses this by comparing CodeMate and office-hours lab groups over ten weeks on midterm scores, while recording prior programming experience.`,
          `Пробел: данных о влиянии на **экзамен**, а не только на задания и удовлетворённость, **мало** (A — смешанные, B — незначимые), а исследования короткие и почти все в англоязычных курсах (A). Исследование закрывает это: десять недель, курс на казахском и русском, CodeMate против консультаций, баллы мидтерма и учёт прежнего опыта.
Где теряют баллы: «про ИИ-тьюторов никто не писал» — в таблице четыре исследования; пробел без ссылки на A–D; нет объяснения, как дизайн отвечает на пробел; обещание проверить «сдачу курса», которой нет в данных.`),
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// rmv4 — ParkSense: умная парковка кампуса
// ─────────────────────────────────────────────────────────────────────────────

const v4: MockExam = {
  id: "rmv4",
  title: title("ParkSense", "умная парковка кампуса"),
  minutes: MINUTES,
  total: 10,
  source: NEW,
  questions: [
    {
      id: "rmv4-a",
      title: PART_A,
      points: 3,
      context: caseContext(
        `The facilities office of a university in Astana is considering **ParkSense**, a smart-parking system for the campus. Ground sensors detect free spaces, a mobile app shows drivers where they are, and cameras at the entrances read number plates. The system stores every plate number with entry and exit times and links it to the owner's student or staff ID.
The team plans a four-week study in two campus car parks of similar size: car park 1 uses ParkSense, car park 2 keeps the usual signs. Planned data: sensor occupancy records, the time from entering the car park to parking (searching time) measured by observers in both car parks, the app's own timer, a driver satisfaction questionnaire (about 300 drivers), and daily weather records.
The team calls the project "Smart City Solutions" and asks: "How can IoT fix traffic in cities?" They write: "ParkSense will eliminate parking problems on campus."
Most of the team's evidence is the vendor's white paper reporting "70% less searching time", a tech-blog post and two YouTube reviews. The plate records linked to IDs are kept with no deletion date, and the campus security office has asked for full access "for safety".`,
        [
          `| Study A | Meta-analysis of 12 smart-parking field studies | Parking guidance reduced average searching time, but the size of the effect varied widely between sites | Most studies were in city centres, not campuses. Searching time was measured differently (app timers, GPS traces, surveys) |`,
          `| Study B | Field experiment; 2 shopping-mall car parks, 6 weeks (guidance in one, signs in the other) | Average searching time fell by about 2 minutes in the guided car park, mostly at peak hours | Only two sites, not randomly chosen; the car parks differed in layout |`,
          `| Study C | Analysis of 18 months of sensor data from one university car park | Occupancy peaked between 9:00 and 11:00; about 8% of sensor readings were wrong in snow and heavy rain | No comparison with a car park without sensors. No data on drivers' behaviour |`,
          `| Study D | Focus groups with 30 students and staff at two universities | Drivers liked seeing free spaces before arriving but stopped trusting the app after wrong readings; several objected to plate cameras | Volunteers only. Views were not linked to measured searching time |`,
        ],
      ),
      tasks: [
        mc("rmv4-a1", "1",
          `The team asks: "How can IoT fix traffic in cities?" What is most clearly missing for a researchable question?`,
          [
            "A longer list of technologies, such as 5G, edge computing and blockchain",
            "A statement that the answer will be positive for the university campus",
            "A specific population and setting, a comparison and a measurable outcome",
            "A reference to a famous smart city so that readers see why it matters",
          ], 2,
          `**Correct: a population and setting, a comparison and a measurable outcome.** The question jumps from a campus car park to "traffic in cities", "fix" cannot be measured, and "How can…" invites a list of ideas rather than evidence. A researchable version: campus drivers, ParkSense vs signs, searching time measured by observers.
- "A longer list of technologies" — makes the question even broader.
- "A statement that the answer will be positive" — presupposes the result; that is bias, not focus.
- "A reference to a famous smart city" — may show importance, but importance does not make a question answerable.`,
          `**Верно: популяция и место, сравнение и измеримый результат.** Вопрос перескакивает с парковки кампуса на «трафик в городах», «исправить» нельзя измерить, а «How can…» зовёт к списку идей, а не к доказательствам. Исследуемая версия: водители кампуса, ParkSense против обычных указателей, время поиска места по наблюдателям.
- «A longer list of technologies» — делает вопрос ещё шире.
- «A statement that the answer will be positive» — заранее задаёт ответ; это предвзятость, а не фокус.
- «A reference to a famous smart city» — показывает важность, но важность не делает вопрос исследуемым.`),
        mc("rmv4-a2", "2",
          `The team writes: "ParkSense will eliminate parking problems on campus." Why is this not yet a research problem?`,
          [
            "It promises a result without evidence instead of stating what is unknown",
            "It lacks a citation of the vendor's figure of 70% less searching time",
            "It is too specific, because it names only one system and one campus",
            "It is phrased as a statement; as a question it would be a valid problem",
          ], 0,
          `**Correct: it promises a result instead of stating what is unknown.** A research problem describes the current situation and what is not yet known — e.g. whether guidance reduces searching time on a campus where sensors fail in snow. "Eliminate" is absolute, and the table shows modest, varying effects (A; about two minutes at peak hours in B).
- "Lacks the vendor's 70% figure" — adding a marketing number from an interested party does not turn a promise into evidence.
- "Too specific" — one system on one campus is a well-bounded setting; focus is a strength.
- "As a question it would be valid" — "Will ParkSense eliminate parking problems?" is still loaded and unmeasurable.`,
          `**Верно: обещан результат вместо того, чтобы сказать, что неизвестно.** Исследовательская проблема описывает ситуацию и то, чего пока не знают, — например, сокращает ли навигация время поиска места на кампусе, где датчики ошибаются в снег. «Eliminate» — абсолютное слово, а таблица показывает скромные и разные эффекты (A; около двух минут в часы пик в B).
- «Lacks the vendor's 70% figure» — рекламная цифра заинтересованной стороны не превращает обещание в доказательство.
- «Too specific» — одна система на одном кампусе — хорошо очерченные рамки; фокус — это достоинство.
- «As a question it would be valid» — «Will ParkSense eliminate parking problems?» всё равно наводящий и неизмеримый вопрос.`),
        mc("rmv4-a3", "3",
          `Which of the following is a development output of the ParkSense project?`,
          [
            "Evidence on whether searching time differs between the two car parks",
            "The mobile app map that shows free spaces using the ground sensors",
            "The analysis of satisfaction scores in the two car parks",
            "An estimate of how often the sensors give wrong readings in snow",
          ], 1,
          `**Correct: the app map that shows free spaces.** It is a feature the team builds and deploys. The other three are knowledge obtained from data — research outputs.
- "Evidence on searching time" — a comparison of measured outcomes: research output.
- "The analysis of satisfaction scores" — an analysis of questionnaire data: research output.
- "An estimate of sensor errors in snow" — a measured finding about the system's reliability: research output, even though it is about the technology.`,
          `**Верно: карта свободных мест в приложении.** Это функция, которую команда строит и запускает. Остальные три — знание из данных, то есть исследовательские результаты.
- «Evidence on searching time» — сравнение измеренных показателей: исследование.
- «The analysis of satisfaction scores» — анализ данных опроса: исследование.
- «An estimate of sensor errors in snow» — измеренный вывод о надёжности системы: исследование, хотя речь и о технике.`),
        mc("rmv4-a4", "4",
          `Study C analysed 18 months of sensor data from one university car park. What can it NOT tell the team?`,
          [
            "At what time of day the car park is usually busiest",
            "How often the sensors give wrong readings in bad weather",
            "How occupancy changes over the weeks of a semester",
            "Whether guidance reduces searching time compared with signs",
          ], 3,
          `**Correct: whether guidance reduces searching time.** Study C is observational sensor data from one car park with no comparison car park and no data on drivers' behaviour. It can describe occupancy patterns and sensor errors, but an effect of guidance needs a comparison — as in Study B or the team's planned two-car-park design.
- "Time of day when it is busiest" — exactly what occupancy logs show (peak 9:00–11:00).
- "Wrong readings in bad weather" — reported directly (about 8% in snow and heavy rain).
- "Occupancy over a semester" — 18 months of logs describe this well.`,
          `**Верно: сокращает ли навигация время поиска по сравнению с указателями.** Study C — наблюдательные данные датчиков одной парковки, без парковки для сравнения и без данных о поведении водителей. Они описывают загрузку и ошибки датчиков, но эффект навигации требует сравнения — как в Study B или в планируемом дизайне с двумя парковками.
- «Time of day when it is busiest» — как раз то, что показывают журналы загрузки (пик 9:00–11:00).
- «Wrong readings in bad weather» — сказано прямо (около 8% в снег и сильный дождь).
- «Occupancy over a semester» — 18 месяцев журналов хорошо это описывают.`),
        mc("rmv4-a5", "5",
          `Most of the team's evidence is the vendor's white paper ("70% less searching time"), a tech-blog post and two YouTube reviews. What is the best next step?`,
          [
            "Cite the white paper as the main source, since the vendor knows the product best",
            "Average the 70% figure with the blog's numbers to get a more balanced estimate",
            "Keep the YouTube reviews, because real drivers appear in them on camera",
            "Search scholarly databases and treat the vendor's figure as a claim to check",
          ], 3,
          `**Correct: search scholarly databases and treat the 70% as a claim.** Blogs and YouTube are Tier 3 sources to avoid in a literature review, and a vendor's white paper comes from an interested party without a transparent method. Ask where the claim comes from, then search Scopus, IEEE Xplore or Google Scholar; the table already suggests smaller, varying effects (A; about two minutes in B).
- "Cite the white paper as the main source" — the vendor sells the product: a conflict of interest, not peer-reviewed evidence.
- "Average the 70% with the blog" — combining unverified numbers does not create evidence.
- "Keep the YouTube reviews" — anecdotes from a few drivers are not systematic evidence.`,
          `**Верно: искать в научных базах, а 70% считать утверждением для проверки.** Блоги и YouTube — источники уровня 3, в обзоре литературы их избегают, а white paper поставщика написан заинтересованной стороной без прозрачного метода. Сначала спросить, откуда цифра, затем искать в Scopus, IEEE Xplore или Google Scholar; таблица уже указывает на меньшие и разные эффекты (A; около двух минут в B).
- «Cite the white paper as the main source» — поставщик продаёт продукт: это конфликт интересов, а не рецензированное доказательство.
- «Average the 70% with the blog» — усреднение непроверенных чисел не создаёт доказательства.
- «Keep the YouTube reviews» — впечатления нескольких водителей — не систематические данные.`),
        mc("rmv4-a6", "6",
          `ParkSense keeps plate numbers linked to student and staff IDs with no deletion date, and the security office wants full access. Which principle is most directly at stake?`,
          [
            "Data minimisation, with limited retention and access to personal data",
            "Reflexivity: the team must state its own preference for smart systems",
            "Authorship: the security office should be listed as a co-author",
            "Feasibility: storing the records for years needs extra cloud credits",
          ], 0,
          `**Correct: data minimisation, limited retention and access.** The data lifecycle says: collect only what the question needs (searching time does not need identities), store securely, give access to named roles, keep data for a justified period, then delete. Full access for security means using the data for a purpose drivers were never told about.
- "Reflexivity" — concerns the researchers' own bias, not the handling of personal data.
- "Authorship" — asking for data is not a contribution to the research.
- "Feasibility" — storage cost is secondary; the risk is to people's privacy.`,
          `**Верно: минимизация данных, ограниченные срок хранения и доступ.** Жизненный цикл данных: собирать только нужное вопросу (времени поиска не нужны личности), хранить защищённо, давать доступ названным ролям, хранить обоснованный срок и удалять. Полный доступ для службы безопасности — использование данных в цели, о которой водителям не сообщали.
- «Reflexivity» — это предвзятость самих исследователей, а не обращение с персональными данными.
- «Authorship» — запрос данных не вклад в исследование.
- «Feasibility» — стоимость хранения вторична; риск — для приватности людей.`),
      ],
    },
    {
      id: "rmv4-b",
      title: PART_B,
      kind: "question",
      points: 7,
      context: partBContext("ParkSense"),
      tasks: [
        open("rmv4-b1", "1", 0.5, B.b1("ParkSense"),
          [
            "0.25 pts — a development output: something built — the ParkSense system, its ground sensors, the free-space map in the app or the plate-reading cameras. A finding given here earns 0.",
            "0.25 pts — a research output: knowledge from the study — e.g. the comparison of observer-measured searching time (or satisfaction scores) between the ParkSense car park and the sign-only car park over four weeks. The system, a feature or raw sensor records earn 0.",
          ],
          `- **Development output:** the ParkSense system — ground sensors, the free-space map in the app and the plate cameras at the entrances.
- **Research output:** the four-week comparison of observer-measured searching time between the ParkSense car park and the car park with the usual signs.`,
          `Результат разработки — **построенное**: система ParkSense с датчиками, картой свободных мест в приложении и камерами номеров. Исследовательский результат — **знание**: сравнение времени поиска места (по наблюдателям) за четыре недели между парковкой с ParkSense и парковкой с обычными указателями.
Где теряют баллы: «журналы загрузки датчиков» названы исследовательским результатом — это сырые данные; «70% меньше времени» — чужая рекламная цифра, а не результат проекта.`),
        open("rmv4-b2", "2", 1, B.b2("ParkSense"),
          [
            "0.25 pts — current situation: drivers on campus spend time searching for spaces, especially at peak hours (Study C: occupancy peaks 9:00–11:00), and the university is considering ParkSense. Neutral — no 'eliminate', no vendor 70% presented as fact.",
            "0.5 pts — a limitation from the table, attributed: e.g. Study A — effects vary widely, mostly city centres, searching time measured differently; Study B — only two mall car parks, not randomly chosen, different layouts; Study C — about 8% of readings wrong in snow and heavy rain, no comparison; Study D — trust lost after wrong readings. 0.25 if plausible but not tied to a study; 0 for an opinion or the vendor's claim.",
            "0.25 pts — the need: a campus comparison of ParkSense vs signs with the same searching-time measure in both car parks, taking the weather into account.",
          ],
          `Drivers on the university campus lose time looking for free spaces, especially at morning peak hours, and the facilities office is considering ParkSense, a sensor-based guidance system. However, the evidence comes mainly from other settings: the meta-analysis in Study A shows that the effect of guidance varies widely and was measured differently across mostly city-centre sites, and Study C found that about 8% of sensor readings were wrong in snow and heavy rain. A campus study is therefore needed that compares ParkSense with ordinary signs using the same observer-measured searching time in both car parks and records the weather.`,
          `(1) **Ситуация**: на кампусе водители тратят время на поиск места, особенно утром (пик 9:00–11:00 в Study C), университет рассматривает ParkSense. (2) **Ограничение со ссылкой**: Study A — эффект сильно различается, исследования в основном в центрах городов, время поиска измеряли по-разному; Study C — около 8% ошибок датчиков в снег и дождь. (3) **Потребность**: сравнение на кампусе с одинаковым измерением времени в обеих парковках и учётом погоды.
Где теряют баллы: «70% меньше времени» как факт; ограничение без ссылки (0.25); «парковка — проблема всех городов» вместо ситуации кампуса; потребность, не связанная с ограничением.`),
        open("rmv4-b3", "3", 1, B.b3("ParkSense"),
          [
            "0.25 pts — one clear, focused, neutral question (not 'How can IoT fix traffic in cities?', not 'How much will ParkSense reduce parking problems?').",
            "0.25 pts — the population and setting: students and staff driving to the campus car parks.",
            "0.25 pts — the comparison: the car park with ParkSense guidance vs the car park with the usual signs.",
            "0.25 pts — a measurable outcome measured the same way in both car parks within four weeks: observer-measured searching time (or the satisfaction score). The app timer earns 0 as the outcome: it exists only in the ParkSense car park, so it cannot compare the two (Study A: inconsistent measures).",
          ],
          `Among students and staff driving to campus, how does the average searching time measured by observers differ between the car park with ParkSense guidance and the car park with the usual signs over four weeks?
The same observer measure is used in both car parks, so the comparison is fair; the weather records allow snowy days to be checked separately.`,
          `Популяция и место — студенты и сотрудники, паркующиеся на кампусе; сравнение — парковка с ParkSense против парковки с указателями; результат — время поиска места, измеренное наблюдателями одинаково на обеих парковках, за четыре недели.
Где теряют баллы: таймер приложения как результат — он есть только на парковке с ParkSense, сравнить по нему нельзя (Study A как раз критикует разные способы измерения); «пробки в городе»; «проблемы с парковкой» без измерения; вопрос, заранее обещающий результат.`),
        open("rmv4-b4", "4", 0.5, B.b4("ParkSense"),
          [
            "0.25 pts — three concept groups joined with AND that match the study — the intervention (smart parking / parking guidance / sensors), the outcome (searching or cruising time) and the setting (campus / university) — each with at least two synonyms joined with OR inside parentheses.",
            SEARCH_SYNTAX,
          ],
          `= ("smart parking" OR "parking guidance" OR "parking sensor") AND ("searching time" OR "cruising for parking" OR "time to park") AND (campus OR university)
AND joins the intervention, the outcome and the setting; OR inside each group adds synonyms. If the campus group returns too few papers, it can be removed to broaden the search.`,
          `= ("smart parking" OR "parking guidance" OR "parking sensor") AND ("searching time" OR "cruising for parking" OR "time to park") AND (campus OR university)
Вмешательство, результат и место — три группы через AND, синонимы внутри через OR. Если по кампусам мало статей, третью группу можно убрать.
Где теряют баллы: «IoT traffic» одной фразой; «ParkSense» в строке; только OR; фразы без кавычек.`),
        open("rmv4-b5", "5", 1.5, B.b5("ParkSense"),
          [
            "0.25 pts — risk 1: plate numbers linked to student/staff IDs with entry and exit times — identifiable records of people's movements, kept with no deletion date, far more than the question needs.",
            "0.25 pts — a specific safeguard for risk 1: the research dataset holds no plates or IDs (searching time and occupancy do not need identities) or replaces them with one-way codes; raw plate records are deleted after a fixed short period.",
            "0.25 pts — evidence for risk 1: the data-management plan with the stored fields and the retention period, and a deletion log.",
            "0.25 pts — risk 2: the security office's request for full access — use of the data beyond the research purpose drivers were told about, and surveillance of individuals.",
            "0.25 pts — a specific safeguard for risk 2: access limited to named researchers; the security office receives only aggregated occupancy or nothing; drivers are informed by signs and in the questionnaire information sheet, and the questionnaire is voluntary.",
            "0.25 pts — evidence for risk 2: the access-control list or access log, a written agreement with the security office on what it may receive, photos of the information signs or the information sheet. A safeguard without a record earns 0 for this line.",
          ],
          `- **Risk 1 — identifiable movement records kept forever.** Plate numbers linked to student and staff IDs show when each person arrives and leaves, and nothing is ever deleted; the research question does not need identities at all. **Safeguard:** the research dataset holds no plates or IDs, only times and occupancy; raw plate records are deleted after a short fixed period. **Evidence:** the data-management plan listing the fields and the retention period, and the deletion log.
- **Risk 2 — full access for the security office.** The data would be used for a purpose drivers were never told about. **Safeguard:** access only for named researchers; the security office gets aggregated occupancy at most; drivers are informed by signs at the entrances. **Evidence:** the access-control list, a written agreement with the security office and photos of the signs.`,
          `- Риск 1: номера машин, привязанные к ID, со временем въезда и выезда — по ним видно, кто когда приходит и уходит, и ничего не удаляется; вопросу личности вообще не нужны. Мера: в исследовательских данных нет номеров и ID, только время и загрузка; сырые записи удаляются через короткий фиксированный срок. Доказательство: план управления данными со списком полей и сроком хранения, журнал удаления.
- Риск 2: полный доступ службы безопасности — использование данных в цели, о которой водителям не сообщали. Мера: доступ только у названных исследователей, служба безопасности получает в лучшем случае обобщённую загрузку, водителей информируют табличками. Доказательство: список доступа, письменное соглашение со службой безопасности, фото табличек.
Где теряют баллы: «данные публичные, номер видит каждый» — запись и связка с ID меняют дело; «зашифруем» без сокращения сбора; мера без записи.`),
        open("rmv4-b6", "6", 1.5, B.b6(),
          [
            SYNTHESIS_THEMES,
            "0.5 pts — the methodological contrast: A is a secondary meta-analysis with inconsistent measures across mostly city sites; B is a field experiment with only two non-random mall sites; C is an observational sensor-log analysis with no comparison (describes occupancy and errors only); D is qualitative — explains trust and privacy concerns but is not linked to measured time.",
            "0.5 pts — an overall conclusion with limitations: guidance can reduce searching time, mainly at peak hours, but the size of the effect is uncertain and site-dependent; sensor errors in bad weather may reduce trust and benefit; campus evidence with consistent measures is limited.",
          ],
          `The studies agree that parking guidance can shorten searching time, but not on how much. The meta-analysis (Study A) found effects that varied widely between sites, and the only direct comparison (Study B) found a modest gain of about two minutes, mostly at peak hours, in two mall car parks that were not randomly chosen. Studies C and D together suggest why benefits may shrink in practice: sensors gave wrong readings about 8% of the time in snow and heavy rain, and drivers stopped trusting the app after such errors. Because A mixes different measures of searching time, C has no comparison and D is not linked to measured time, the evidence for a campus in a snowy city remains indirect, and privacy concerns about plate cameras (D) add a further condition for acceptance.`,
          `Синтез по темам: (1) **эффект есть, но размер неясен** — A: сильно различается по местам, B: около двух минут и в основном в часы пик; (2) **почему** — дизайн: A смешивает разные способы измерения, B — две непохожие парковки торговых центров, выбранные не случайно; (3) **связь C и D** — ошибки датчиков в снег (C) подрывают доверие водителей (D), а значит, и пользу; (4) **вывод с ограничениями** — для кампуса в снежном городе данные косвенные, а камеры номеров вызывают возражения.
Где теряют баллы: пересказ по очереди; C подано как доказательство эффекта (сравнения в нём нет); вывод «умная парковка точно экономит 70%».`),
        open("rmv4-b7", "7", 1, B.b7("ParkSense"),
          [
            "0.5 pts — a gap from the table, cited: e.g. limited evidence from university campuses (A: mostly city centres; B: shopping malls), from snowy or rainy conditions where sensor errors occur (C), or with consistent searching-time measures (A). Stated as limited evidence; 'no research exists' or a gap not linked to the table earns 0 for this line.",
            "0.5 pts — how this study addresses it: compares two similar campus car parks — ParkSense vs signs — with the same observer-measured searching time and daily weather records over four weeks. A bare 'the study will fill the gap' earns 0.",
          ],
          `Evidence on parking guidance comes mostly from city centres and shopping malls (Studies A and B), uses inconsistent measures of searching time (A), and shows that sensors make more errors in snow and heavy rain (C). It is therefore unclear how much guidance reduces searching time on a university campus in a city with snowy winters. The proposed study can address this by comparing a ParkSense car park with a similar sign-only car park on campus, measuring searching time the same way in both and recording the weather each day, so that snowy days can be analysed separately.`,
          `Пробел контекста и измерения: данные о навигации — из центров городов и торговых центров (A, B), время поиска измеряли по-разному (A), а в снег датчики ошибаются чаще (C). Неясно, насколько навигация помогает на кампусе в городе со снежной зимой. Исследование отвечает на это: две похожие парковки кампуса, одинаковое измерение наблюдателями и ежедневная погода.
Где теряют баллы: «про умные парковки на кампусах никто не писал» — Study C и D как раз из университетов; пробел без ссылки на таблицу; не сказано, как дизайн закрывает пробел.`),
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// rmv5 — MindCheck: приложение для ментального здоровья студентов
// ─────────────────────────────────────────────────────────────────────────────

const v5: MockExam = {
  id: "rmv5",
  title: title("MindCheck", "приложение для ментального здоровья студентов"),
  minutes: MINUTES,
  total: 10,
  source: NEW,
  questions: [
    {
      id: "rmv5-a",
      title: PART_A,
      points: 3,
      context: caseContext(
        `The student support centre of a university in Astana is considering **MindCheck**, a well-being app for students. Every evening it asks students to rate their mood and stress, offers short breathing exercises, and has a chatbot that replies to messages. The app stores mood ratings, chatbot messages and the phone's location "to detect patterns".
The team plans an eight-week study with 100 volunteer students: one group uses MindCheck, the other receives the centre's usual weekly e-mail with well-being tips and counselling contacts. Planned data: daily mood ratings in the app, a validated stress scale completed by both groups at the start and at week 8, counselling-service visits, exercise-completion logs, and year of study.
The team calls the project "Digital Happiness" and asks: "Do apps make students happier?" They write: "MindCheck will cure student anxiety."
The literature section is based on an AI chatbot summary that gives figures such as "apps reduce anxiety by 60%" without any citations. The team promises participants "complete anonymity", but every record is stored under the student's e-mail address. Some chatbot messages may mention self-harm, and there is no plan for who reads them or how to respond.`,
        [
          `| Study A | Randomised controlled trial; 400 university students; 6 weeks | Stress scores fell more in the app group than in a waiting-list group, but the difference disappeared at a 3-month follow-up | 45% of the app group dropped out; most remaining users were highly motivated |`,
          `| Study B | Analysis of usage data from 12,000 users of a commercial mood-tracking app | Users who completed more exercises reported better mood over time | Users chose how much to use the app. No comparison group; mood was self-rated in the app |`,
          `| Study C | Interviews with 16 students who stopped using a well-being app | Students found daily mood questions repetitive and worried about who could read their messages; some felt worse after seeing a run of low-mood days | Small sample; only students who stopped using the app |`,
          `| Study D | Meta-analysis of 18 trials of mental-health apps for students | Small average reduction in stress and anxiety; effects were larger against waiting-list controls than against active controls | Most trials were from Western Europe, North America and Australia. Follow-up rarely exceeded 3 months |`,
        ],
      ),
      tasks: [
        mc("rmv5-a1", "1",
          `Which question would be the most appropriate replacement for "Do apps make students happier?"`,
          [
            "How do university students in Kazakhstan feel about digital technology in their everyday lives?",
            "Does MindCheck, versus well-being e-mails, lower stress-scale scores among students over eight weeks?",
            "Can mental-health apps fully replace university counsellors for students within the next five years?",
            "Why are digital well-being tools so successful at improving the happiness of university students?",
          ], 1,
          `**Correct: the MindCheck vs e-mails question.** It names the population (the university's students), the comparison (MindCheck vs the usual well-being e-mails — an active control), an outcome measured in both groups (the validated stress scale) and the time frame (eight weeks).
- "How do students feel about digital technology" — vague, with no comparison and nothing about MindCheck.
- "Can apps fully replace counsellors within five years" — a forecast that an eight-week study cannot answer: neither researchable nor feasible.
- "Why are digital tools so successful" — a loaded question that assumes success, while Study D found only small average effects.`,
          `**Верно: вопрос «MindCheck против писем».** В нём есть популяция (студенты университета), сравнение (MindCheck против обычных писем о благополучии — активный контроль), результат, измеряемый в обеих группах (валидированная шкала стресса), и срок (восемь недель).
- «How do students feel about digital technology» — расплывчато, без сравнения и вообще не о MindCheck.
- «Can apps fully replace counsellors within five years» — прогноз, на который восьминедельное исследование не ответит: вопрос не исследуемый и не выполнимый.
- «Why are digital tools so successful» — наводящий вопрос, заранее предполагающий успех, хотя Study D нашло лишь небольшой средний эффект.`),
        mc("rmv5-a2", "2",
          `The team writes: "MindCheck will cure student anxiety." Which problem with this statement is the most serious?`,
          [
            "It uses the everyday word 'cure' instead of the technical word 'treat'",
            "It should cite the 60% figure from the AI summary to sound convincing",
            "It is a hypothesis, so it belongs in the methodology section instead",
            "It claims a result no data support, and anxiety is not even measured",
          ], 3,
          `**Correct: it claims an unsupported result, and anxiety is not measured.** "Cure" is a strong clinical claim, while Study D found only small average reductions. The plan measures stress (a validated stress scale) and mood, not anxiety, so the study could not test the claim even in principle.
- "'Cure' instead of 'treat'" — changing the word does not add evidence.
- "Cite the 60% figure" — an uncited AI figure is unverifiable, and it contradicts the small effects in Study D.
- "It is a hypothesis" — as written it is not a testable prediction (no comparison, no measure); and hypotheses go with the research question, not hidden in the methods.`,
          `**Верно: заявлен результат без данных, а тревожность даже не измеряется.** «Вылечит» — сильное клиническое утверждение, а Study D нашло лишь небольшое среднее снижение. План измеряет стресс (валидированная шкала) и настроение, а не тревожность, так что проверить утверждение исследование не может даже в принципе.
- «'Cure' instead of 'treat'» — замена слова не добавляет доказательств.
- «Cite the 60% figure» — цифра ИИ без источника непроверяема и противоречит небольшим эффектам в Study D.
- «It is a hypothesis» — в таком виде это не проверяемое предсказание (нет сравнения и измерения); к тому же гипотеза идёт рядом с исследовательским вопросом, а не прячется в методах.`),
        mc("rmv5-a3", "3",
          `A teammate lists the project's outputs. Which one is a research output?`,
          [
            "The breathing-exercise module with its animated guide",
            "The chatbot that replies to students' evening messages",
            "The evidence on stress-scale change in the two groups",
            "The nightly notification that asks students to rate mood",
          ], 2,
          `**Correct: the evidence on stress-scale change in the two groups.** It is knowledge obtained by comparing measured outcomes. The other three are parts of the app the team builds — development outputs.
- "The breathing-exercise module" — a built feature.
- "The chatbot" — a built feature.
- "The nightly notification" — a built feature; the mood ratings it collects are raw data until they are analysed.`,
          `**Верно: данные об изменении стресса в двух группах.** Это знание, полученное сравнением измеренных показателей. Остальные три — части приложения, которое строит команда, то есть результаты разработки.
- «The breathing-exercise module» — построенная функция.
- «The chatbot» — построенная функция.
- «The nightly notification» — построенная функция; собранные ею оценки настроения — сырые данные, пока их не проанализировали.`),
        mc("rmv5-a4", "4",
          `In Study A, 45% of the app group dropped out and the effect disappeared at follow-up. Why does the dropout matter when interpreting the result?`,
          [
            "Those who stayed were more motivated, so the effect may be overestimated",
            "Dropout turns a randomised trial into a qualitative study with no numbers",
            "Dropout only matters in surveys, never in randomised controlled trials",
            "A 45% dropout rate proves that the app made the students feel worse",
          ], 0,
          `**Correct: those who stayed were more motivated.** Randomisation makes the groups comparable at the start, but heavy dropout breaks that: the remaining app users were mostly highly motivated, so their improvement may overstate what the app does for a typical student (attrition bias). Study C hints at why people leave.
- "Turns it into a qualitative study" — the data are still numbers; the design does not change type.
- "Only matters in surveys" — attrition is a well-known threat in trials too (Study D also lists follow-up problems).
- "Proves the app made students feel worse" — dropout has many reasons (C: repetitive questions, privacy worries); it does not prove harm.`,
          `**Верно: оставшиеся были более мотивированы.** Рандомизация делает группы сравнимыми в начале, но массовый отсев это разрушает: в группе приложения остались в основном очень мотивированные, и их улучшение может преувеличивать пользу для обычного студента (смещение из-за выбывания, attrition). Study C подсказывает, почему люди уходят.
- «Turns it into a qualitative study» — данные остаются числами; тип дизайна не меняется.
- «Only matters in surveys» — выбывание — известная угроза и в испытаниях (Study D тоже говорит о проблемах с наблюдением).
- «Proves the app made students feel worse» — у выбывания много причин (C: однообразные вопросы, тревога о приватности); вреда оно не доказывает.`),
        mc("rmv5-a5", "5",
          `The literature section is based on an AI chatbot summary reporting "apps reduce anxiety by 60%" with no citations. What should the team do?`,
          [
            "Cite the chatbot summary as a secondary source, like a systematic review",
            "Use the 60% figure but add the note 'according to AI' after the number",
            "Trace each claim to an opened, verified scholarly source, or drop it",
            "Ask the chatbot again and keep the figure if both answers are the same",
          ], 2,
          `**Correct: trace each claim to a verified source or drop it.** The AI verification contract: no generated reference enters the paper until it has been opened, and no generated factual claim stays without evidence. An uncited figure cannot be traced, and Study D — a real meta-analysis — reports only a small average reduction.
- "Cite it as a secondary source" — a systematic review has a documented method and cites its primary studies; an AI summary has neither.
- "Add 'according to AI'" — disclosure does not turn an unverified number into evidence.
- "Ask the chatbot again" — a model repeating itself is not verification; it can repeat the same invented figure.`,
          `**Верно: проследить каждое утверждение до проверенного источника или убрать его.** Контракт проверки ИИ: ни одна сгенерированная ссылка не попадает в работу, пока её не открыли, и ни одно сгенерированное утверждение не остаётся без доказательства. Цифру без источника нельзя проследить, а Study D — настоящий мета-анализ — показывает лишь небольшое среднее снижение.
- «Cite it as a secondary source» — у систематического обзора есть описанный метод и ссылки на первичные исследования; у сводки ИИ нет ни того, ни другого.
- «Add 'according to AI'» — пометка не превращает непроверенную цифру в доказательство.
- «Ask the chatbot again» — повтор модели — не проверка; она может повторить ту же выдуманную цифру.`),
        mc("rmv5-a6", "6",
          `The team promises "complete anonymity", but every record is stored under the student's e-mail address. What is the accurate description?`,
          [
            "The data are anonymous, because only the team can see the e-mail list",
            "The data become anonymous once the files are protected by a password",
            "The data are public, because e-mail addresses are known to the university",
            "The data are at best confidential, so the promise of anonymity is false",
          ], 3,
          `**Correct: at best confidential — the promise is false.** Anonymity means the researcher cannot reasonably link a response to a person; an e-mail address links it directly. If the team knows identities but controls access, that is confidentiality. Never promise a protection the workflow cannot deliver: store codes, keep the key separately, and describe the data as confidential.
- "Only the team can see the e-mails" — that is the definition of confidentiality, not anonymity.
- "Protected by a password" — controls access, but the link to the person remains.
- "The data are public" — being identifiable to the team does not make data public; access control still applies.`,
          `**Верно: в лучшем случае конфиденциально — обещание ложное.** Анонимность — когда исследователь не может разумным способом связать ответ с человеком; адрес почты связывает напрямую. Если команда знает личности, но контролирует доступ, — это конфиденциальность. Нельзя обещать защиту, которую процесс не обеспечивает: хранить коды, ключ держать отдельно, а данные называть конфиденциальными.
- «Only the team can see the e-mails» — это как раз определение конфиденциальности, а не анонимности.
- «Protected by a password» — ограничивает доступ, но связь с человеком остаётся.
- «The data are public» — то, что команда может опознать человека, не делает данные публичными; доступ по-прежнему ограничен.`),
      ],
    },
    {
      id: "rmv5-b",
      title: PART_B,
      kind: "question",
      points: 7,
      context: partBContext("MindCheck"),
      tasks: [
        open("rmv5-b1", "1", 0.5, B.b1("MindCheck"),
          [
            "0.25 pts — a development output: something built — the MindCheck app, its evening mood check-in, the breathing exercises or the chatbot. A finding given here earns 0.",
            "0.25 pts — a research output: knowledge from the study — e.g. the comparison of change in validated stress-scale scores (or counselling visits) between MindCheck and e-mail groups over eight weeks. The app, a feature or the raw mood ratings earn 0.",
          ],
          `- **Development output:** the MindCheck app — the evening mood check-in, the breathing exercises and the chatbot.
- **Research output:** the comparison of change in validated stress-scale scores over eight weeks between students using MindCheck and students receiving the weekly e-mails.`,
          `Результат разработки — **построенное**: приложение MindCheck с вечерней оценкой настроения, дыхательными упражнениями и чат-ботом. Исследовательский результат — **знание**: сравнение изменения баллов по валидированной шкале стресса за восемь недель между группой MindCheck и группой с еженедельными письмами.
Где теряют баллы: «оценки настроения» названы результатом исследования — это сырые данные одной группы; «студенты станут счастливее» — обещание; «60% меньше тревоги» — цифра ИИ, а не результат проекта.`),
        open("rmv5-b2", "2", 1, B.b2("MindCheck"),
          [
            "0.25 pts — current situation: student stress is a concern for the support centre, which is considering a well-being app (MindCheck) alongside its usual e-mails. Neutral — no 'cure', no uncited 60%.",
            "0.5 pts — a limitation from the table, attributed: e.g. Study D — small average effects, smaller against active controls, mostly Western trials, short follow-up; Study A — effect gone at three months, 45% dropout; Study B — self-selected use, no comparison, self-rated mood; Study C — repetitive questions and privacy worries make students stop. 0.25 if plausible but not tied to a study; 0 for an opinion or the AI figure.",
            "0.25 pts — the need: a comparison of MindCheck with the usual weekly e-mails (an active control) among students in Kazakhstan, using a validated stress scale in both groups and tracking dropout.",
          ],
          `Stress among students is a concern for the university's support centre, which is considering MindCheck, a well-being app with mood check-ins, breathing exercises and a chatbot. However, the evidence for such apps is limited: the meta-analysis in Study D found only small average effects, which were smaller against active controls than against waiting lists and came mostly from Western countries, and in Study A the effect disappeared at three months while 45% of the app group dropped out. A study is therefore needed that compares MindCheck with the centre's usual weekly e-mails among students in Kazakhstan, using a validated stress scale in both groups and recording who drops out.`,
          `(1) **Ситуация**: стресс студентов беспокоит центр поддержки, он рассматривает MindCheck. (2) **Ограничение со ссылкой**: Study D — эффект небольшой и меньше при активном контроле, исследования в основном западные; Study A — эффект пропал через три месяца, 45% выбыли. (3) **Потребность**: сравнить MindCheck с обычными письмами центра (активный контроль) у студентов в Казахстане по валидированной шкале и учитывать выбывание.
Где теряют баллы: «приложения снижают тревогу на 60%» — непроверенная цифра ИИ (0 за ограничение); «студенты несчастны» без опоры на кейс; потребность не связана с ограничением.`),
        open("rmv5-b3", "3", 1, B.b3("MindCheck"),
          [
            "0.25 pts — one clear, focused, neutral question (not 'Do apps make students happier?', not 'How well will MindCheck cure anxiety?').",
            "0.25 pts — the population: volunteer students at the university (in Astana).",
            "0.25 pts — the comparison: MindCheck vs the usual weekly well-being e-mails.",
            "0.25 pts — a measurable outcome collected in both groups: change in the validated stress-scale score from the start to week 8 (or counselling visits). Daily in-app mood ratings earn 0 for this line (only the MindCheck group has them); 'happiness' or 'anxiety' earn 0.",
          ],
          `Among volunteer students at the university, how does the change in validated stress-scale scores from the start to week 8 differ between students who use MindCheck and students who receive the usual weekly well-being e-mails?
The stress scale is completed by both groups, so the comparison is fair, and the weekly e-mails are an active control — the stricter test according to Study D.`,
          `Популяция — студенты-добровольцы университета; сравнение — MindCheck против обычных писем; результат — изменение балла валидированной шкалы стресса от начала до 8-й недели, его заполняют обе группы.
Где теряют баллы: ежедневные оценки настроения как результат — они есть только у группы с приложением; «счастье» или «тревожность» — не измеряются в плане; «насколько MindCheck вылечит…» — вопрос с готовым ответом; нет группы сравнения.`),
        open("rmv5-b4", "4", 0.5, B.b4("MindCheck"),
          [
            "0.25 pts — three concept groups joined with AND that match the study — the population (students), the intervention (mental-health / well-being app) and the outcome (stress, anxiety, well-being) — each with at least two synonyms joined with OR inside parentheses.",
            SEARCH_SYNTAX,
          ],
          `= ("university student" OR undergraduate OR "college student") AND ("mental health app" OR "well-being app" OR "mobile intervention") AND (stress OR anxiety OR "psychological distress")
Three concepts — who, intervention, outcome — joined with AND, synonyms inside each group with OR, phrases in quotation marks.`,
          `= ("university student" OR undergraduate OR "college student") AND ("mental health app" OR "well-being app" OR "mobile intervention") AND (stress OR anxiety OR "psychological distress")
Кто, вмешательство, результат — три группы через AND, синонимы внутри через OR, фразы в кавычках.
Где теряют баллы: «happiness apps» одной фразой; только AND между отдельными словами; нет скобок; строка из вопроса целиком.`),
        open("rmv5-b5", "5", 1.5, B.b5("MindCheck"),
          [
            "0.25 pts — risk 1: highly sensitive mental-health data (mood, messages, location) stored under e-mail addresses while 'complete anonymity' is promised — identifiable data and a false promise.",
            "0.25 pts — a specific safeguard for risk 1: e-mails replaced with codes and the code key kept separately in encrypted university storage with named access; the protection described honestly as confidentiality; location no longer collected, since the question does not need it.",
            "0.25 pts — evidence for risk 1: the revised information sheet ('confidential', not 'anonymous'), the data-management plan listing the stored fields without location, the access list.",
            "0.25 pts — risk 2: messages mentioning self-harm with no plan — risk of serious harm to participants and no one responsible for responding.",
            "0.25 pts — a specific safeguard for risk 2: a written distress protocol — the app shows crisis and counselling contacts; messages with risk words are flagged to a named counsellor who responds within a set time; participants are told about this limit of confidentiality before consenting.",
            "0.25 pts — evidence for risk 2: the distress protocol approved by the ethics committee, the counsellor's written agreement, the consent text describing the limit, or a log of flagged messages and responses. A safeguard without a record earns 0 for this line.",
          ],
          `- **Risk 1 — sensitive data that are not anonymous.** Mood ratings and messages are stored under e-mail addresses, so the promise of anonymity is false, and location is collected without need. **Safeguard:** replace e-mails with codes, keep the key separately in encrypted university storage, describe the data as confidential, and stop collecting location. **Evidence:** the corrected information sheet and the data-management plan listing the stored fields.
- **Risk 2 — no response to self-harm messages.** A student at risk could write to the chatbot and nobody would react. **Safeguard:** a distress protocol — crisis contacts in the app, risk messages flagged to a named counsellor within 24 hours, and students told about this before consenting. **Evidence:** the protocol approved by the ethics committee and a log of flagged messages and responses.`,
          `- Риск 1: чувствительные данные о психическом состоянии хранятся под адресом почты, а обещана «полная анонимность»; геолокация собирается без нужды. Мера: коды вместо почты, ключ отдельно в зашифрованном хранилище университета, честная формулировка «конфиденциально», отказ от сбора геолокации. Доказательство: исправленный информационный лист, план управления данными со списком полей.
- Риск 2: сообщения о самоповреждении никто не читает — риск серьёзного вреда. Мера: протокол на случай кризиса — контакты помощи в приложении, сообщения с тревожными словами передаются названному психологу в течение 24 часов, участники заранее знают об этом пределе конфиденциальности. Доказательство: протокол, одобренный этическим комитетом, журнал отмеченных сообщений и реакций.
Где теряют баллы: «данные анонимны, раз мы их не публикуем»; «добавим кнопку помощи» без ответственного и срока реакции; мера без записи-доказательства.`),
        open("rmv5-b6", "6", 1.5, B.b6(),
          [
            SYNTHESIS_THEMES,
            "0.5 pts — the methodological contrast: A is randomised but with heavy dropout and a waiting-list control; B is an observational usage analysis with self-selection, no comparison and self-rated mood; C is qualitative and covers only students who stopped — explains dropout but measures no effect; D is a secondary meta-analysis showing that the effect depends on the type of control.",
            "0.5 pts — an overall conclusion with limitations: apps may bring small, short-term stress reductions, but durability (A), engagement (A, C) and the advantage over active support (D) are uncertain, and evidence from Kazakhstan or Central Asia is lacking.",
          ],
          `The evidence points to small, short-lived benefits that depend heavily on who keeps using the app. Studies A and D both found reductions in stress, but A's effect disappeared at three months and D's average effect was small and shrank when apps were compared with an active control instead of a waiting list. Study B's link between exercise use and better mood is weaker still, because users chose how much to engage and rated their own mood. Engagement is the common problem: 45% dropped out in A, and the interviews in Study C explain why — repetitive questions, worries about who reads the messages and discouraging low-mood streaks. Overall, a lasting benefit over ordinary support is not established, and almost all trials come from Western countries.`,
          `Синтез по темам: (1) **эффект небольшой и недолгий** — A и D видят снижение стресса, но в A оно пропадает через три месяца, а в D уменьшается при активном контроле; (2) **слабость B** — самоотбор и самооценка настроения, без группы сравнения; (3) **вовлечённость как общая проблема** — 45% выбыли в A, а C объясняет почему: однообразные вопросы, тревога о том, кто читает сообщения, удручающие серии плохих дней; (4) **вывод с ограничениями** — устойчивой пользы по сравнению с обычной поддержкой не показано, почти все данные западные.
Где теряют баллы: пересказ по очереди; B подано как доказательство эффекта; не замечено, что тип контроля в D меняет величину эффекта.`),
        open("rmv5-b7", "7", 1, B.b7("MindCheck"),
          [
            "0.5 pts — a gap from the table, cited: e.g. limited evidence against an active control rather than a waiting list (D), limited evidence from Kazakhstan or Central Asia (D: mostly Western trials), or limited understanding of engagement and dropout (A: 45% dropout; C). Stated as limited evidence; 'no research exists' or a gap not linked to the table earns 0 for this line.",
            "0.5 pts — how this study addresses it: MindCheck vs the centre's usual weekly e-mails (an active control) among students in Astana, validated stress scale in both groups, dropout recorded (ideally with a later follow-up). A bare 'the study will fill the gap' earns 0.",
          ],
          `Most trials of student mental-health apps come from Western Europe, North America and Australia, and their effects are smaller when the app is compared with an active control rather than a waiting list (Study D); dropout is also high (Study A). There is therefore limited evidence on whether a well-being app helps students in Kazakhstan more than the support they already receive. The proposed study addresses this by comparing MindCheck with the centre's usual weekly e-mails — an active control — using the same validated stress scale in both groups and recording dropout; a follow-up after three months would strengthen it further.`,
          `Пробел контекста и сравнения: исследования в основном западные, а при активном контроле эффект меньше (D); выбывание высокое (A). Данных о том, помогает ли приложение студентам в Казахстане **больше, чем обычная поддержка**, мало. Исследование закрывает это: MindCheck против обычных писем центра (активный контроль), одна шкала стресса в обеих группах, учёт выбывания; повторный замер через три месяца усилил бы его.
Где теряют баллы: «про приложения для студентов исследований нет» — в D их 18; пробел «приложений на казахском нет» без опоры на таблицу; обещание долгосрочного эффекта при восьми неделях.`),
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// rmv6 — QuestLMS: геймификация школьной LMS (участники — дети)
// ─────────────────────────────────────────────────────────────────────────────

const v6: MockExam = {
  id: "rmv6",
  title: title("QuestLMS", "геймификация школьной LMS"),
  minutes: MINUTES,
  total: 10,
  source: NEW,
  questions: [
    {
      id: "rmv6-a",
      title: PART_A,
      points: 3,
      context: caseContext(
        `Software engineering students have added game elements to the learning platform of a partner school in Shymkent. In **QuestLMS**, grade-8 pupils (aged 13–14) earn points and badges for submitted homework, and a leaderboard on the class page shows every pupil's full name, points and current maths grade.
The team plans a one-term study (ten weeks) in four grade-8 classes: two classes use QuestLMS, two use the usual platform without game elements. Planned data: homework submission rates from the platform, on-time submissions, maths test scores, a validated motivation questionnaire for adolescents, and log-in counts.
The team calls the project "Gamification Revolution" and asks: "Does gamification work?" They write: "Badges and leaderboards motivate every pupil."
The team's Mendeley library was filled with the Web Importer and nobody has checked the records: several have wrong years or missing authors, and some point to a conference poster instead of the full paper. The school director agreed to the study, but parents and pupils were not asked.`,
        [
          `| Study A | Cluster-randomised trial; 24 secondary-school classes (about 600 pupils); one term | Gamified classes submitted more homework, but maths test scores did not differ significantly | Teachers knew which classes were gamified. Effects were measured for one term only |`,
          `| Study B | Analysis of platform logs from 9,000 university students | Students who checked the leaderboard often had higher course grades | Students chose whether to check the leaderboard. Prior grades were not controlled |`,
          `| Study C | Focus groups with 32 pupils aged 12 to 15 at two schools | High-ranking pupils enjoyed the leaderboard; low-ranking pupils felt embarrassed, and some stopped logging in | Two schools only. No performance data |`,
          `| Study D | Systematic review of 40 gamification studies in education | Mostly positive short-term effects on engagement; effects on achievement were mixed, and leaderboards had the most mixed results | Most studies involved university students and lasted less than eight weeks |`,
        ],
      ),
      tasks: [
        mc("rmv6-a1", "1",
          `Which question best narrows "Does gamification work?" for this project?`,
          [
            "Does QuestLMS raise grade-8 homework submission rates compared with the usual platform?",
            "Does gamification work better in schools in Shymkent than in other cities of Kazakhstan?",
            "Do school pupils like badges and leaderboards more than any other kind of online reward?",
            "How has gamification changed school education around the world over the last decade?",
          ], 0,
          `**Correct: the QuestLMS submission-rate question.** It names the population (grade-8 pupils), the comparison (QuestLMS vs the usual platform) and an outcome the platform already records for every class (homework submission rate).
- "Shymkent vs other cities" — not the study's comparison; the data come from one school only.
- "Like badges more than any other reward" — a preference question unrelated to the planned comparison; "any other reward" cannot be measured.
- "Around the world over the last decade" — a global, historical question that needs a review, not a ten-week study.`,
          `**Верно: вопрос о доле сданных домашних заданий с QuestLMS.** В нём есть популяция (ученики 8-го класса), сравнение (QuestLMS против обычной платформы) и результат, который платформа уже записывает по всем классам (доля сданных домашних заданий).
- «Shymkent vs other cities» — это не сравнение исследования; данные только из одной школы.
- «Like badges more than any other reward» — вопрос о предпочтениях, не связанный с планируемым сравнением; «любую другую награду» не измерить.
- «Around the world over the last decade» — глобальный исторический вопрос для обзора, а не для десятинедельного исследования.`),
        mc("rmv6-a2", "2",
          `The team writes: "Badges and leaderboards motivate every pupil." Which evidence in the table most directly contradicts this?`,
          [
            "Study A: gamified classes submitted more homework than the other classes",
            "Study B: students who checked the leaderboard often had higher grades",
            "Study C: low-ranking pupils felt embarrassed and some stopped logging in",
            "Study D: it reviewed forty studies, so it must support the statement",
          ], 2,
          `**Correct: Study C.** The word "every" is refuted by a single group for whom the leaderboard backfired: low-ranking pupils felt embarrassed and some stopped logging in. That is exactly the leaderboard the team built, shown to pupils of the same age.
- Study A — supports more homework on average; an average gain does not show that every pupil is motivated.
- Study B — a correlation in university students that is consistent with the claim, not against it.
- Study D — the size of a review says nothing about the direction of its findings; in fact D reports that leaderboards had the most mixed results.`,
          `**Верно: Study C.** Слово «каждого» опровергает одна группа, для которой рейтинг сработал против: ученики внизу таблицы смущались, а некоторые перестали заходить. Это ровно такой рейтинг, как у команды, и школьники того же возраста.
- Study A — в среднем больше домашних заданий; средний прирост не доказывает, что мотивирован каждый.
- Study B — корреляция у студентов вуза, она согласуется с утверждением, а не опровергает его.
- Study D — размер обзора ничего не говорит о направлении выводов; к тому же D сообщает, что именно у рейтингов самые смешанные результаты.`),
        mc("rmv6-a3", "3",
          `Which item is a development output rather than a research output?`,
          [
            "The comparison of on-time submissions between the classes",
            "The analysis of motivation-questionnaire scores by class",
            "The finding on log-in counts in gamified and usual classes",
            "The badge-and-points engine added to the school platform",
          ], 3,
          `**Correct: the badge-and-points engine.** It is a component the team builds into the platform. The other three are knowledge obtained by analysing data — research outputs.
- "The comparison of on-time submissions" — a group comparison: research output.
- "The analysis of motivation scores" — an analysis of questionnaire data: research output.
- "The finding on log-in counts" — a measured finding: research output (log-ins are raw data; the finding comes from comparing them).`,
          `**Верно: движок баллов и бейджей.** Это компонент, который команда встраивает в платформу. Остальные три — знание из анализа данных, то есть исследовательские результаты.
- «The comparison of on-time submissions» — сравнение групп: исследование.
- «The analysis of motivation scores» — анализ данных опросника: исследование.
- «The finding on log-in counts» — измеренный вывод: исследование (входы — сырые данные, вывод появляется при их сравнении).`),
        mc("rmv6-a4", "4",
          `Study A found more homework but no difference in test scores, while Study B links leaderboard checking to higher grades. What best explains this apparent contradiction?`,
          [
            "Study A must be wrong, because it had fewer people than the 9,000 in Study B",
            "Study B is observational: keen students may both check ranks and score higher",
            "Study B is a randomised trial, so its results always outweigh those of Study A",
            "The two studies agree, because more homework always means higher test scores",
          ], 1,
          `**Correct: Study B is observational.** Students chose whether to check the leaderboard and prior grades were not controlled, so strong, motivated students may both check the ranking and get higher grades — the leaderboard need not cause anything. B also studies university students and course grades, while A studies school pupils and test scores. When studies disagree, check design, population and measure before deciding who is "wrong".
- "Study A must be wrong because it is smaller" — sample size does not override design; A is randomised.
- "Study B is a randomised trial" — it is not; it is a log analysis.
- "More homework always means higher scores" — Study A shows exactly the opposite.`,
          `**Верно: Study B наблюдательное.** Студенты сами решали, смотреть ли рейтинг, и прежние оценки не учитывались, поэтому сильные и мотивированные могут и чаще смотреть рейтинг, и лучше учиться — рейтинг ничего не обязан вызывать. К тому же в B студенты вуза и оценки за курс, а в A школьники и контрольные. Когда исследования расходятся, сначала сверяют дизайн, популяцию и показатель, а уже потом решают, кто «неправ».
- «Study A must be wrong because it is smaller» — размер выборки не перевешивает дизайн; A рандомизировано.
- «Study B is a randomised trial» — нет, это анализ журналов.
- «More homework always means higher scores» — Study A показывает как раз обратное.`),
        mc("rmv6-a5", "5",
          `The Mendeley library was filled with the Web Importer and never checked: some records have wrong years or missing authors, or point to a poster instead of the full paper. What is the right conclusion?`,
          [
            "Each record must be checked against the paper and the publisher page",
            "Mendeley records are verified by the publisher, so they can be trusted",
            "Wrong years do not matter, as long as each record's title is correct",
            "Posters are better than full papers, as they summarise the main results",
          ], 0,
          `**Correct: check each record against the paper and the publisher page.** A reference manager is not a source verifier: import, then repair — compare title, authors, year, venue and DOI with the first page and the publisher record. A poster is not the same work as the full paper (identity), and it lacks the full method needed to support a claim.
- "Verified by the publisher" — imported metadata often contain errors; nobody has checked them.
- "Wrong years do not matter" — they break citations and can confuse versions of a work.
- "Posters are better" — posters are preliminary and short; cite the full peer-reviewed paper.`,
          `**Верно: сверить каждую запись со статьёй и страницей издателя.** Менеджер ссылок не проверяет источники: сначала импорт, затем исправление — сверить название, авторов, год, издание и DOI с первой страницей и записью издателя. Постер — не та же работа, что полная статья (identity), и в нём нет полного метода, чтобы подтвердить утверждение.
- «Verified by the publisher» — импортированные метаданные часто с ошибками, их никто не проверял.
- «Wrong years do not matter» — неверный год ломает ссылки и путает версии работы.
- «Posters are better» — постеры предварительные и краткие; ссылаться нужно на полную рецензированную статью.`),
        mc("rmv6-a6", "6",
          `The pupils are 13–14 years old; the director agreed, but parents and pupils were not asked, and the leaderboard shows full names and maths grades. What is required before data collection?`,
          [
            "A signed letter from the director confirming the school owns all the data",
            "A larger number of classes, so that individual pupils are hard to notice",
            "A switch to university students, whose grades are less private than pupils'",
            "Ethics review, parental consent, pupils' assent, and no grades on display",
          ], 3,
          `**Correct: ethics review, parental consent, pupils' assent and no grades on display.** Children are a vulnerable group, so stronger review is needed; the director's permission is institutional access, not the informed consent of participants. Parents consent and pupils give their own assent, and a public leaderboard with names and grades breaches confidentiality and can harm low-ranking pupils (Study C).
- "A letter from the director" — permission to enter the school is not consent from the people studied.
- "More classes" — names and grades would still be on every class page.
- "Switch to university students" — changes the study instead of protecting its participants, and university grades are personal data too.`,
          `**Верно: этическая экспертиза, согласие родителей, согласие самих учеников и никаких оценок в рейтинге.** Дети — уязвимая группа, поэтому нужна более строгая проверка; разрешение директора — это доступ к школе, а не информированное согласие участников. Родители дают согласие, ученики — своё согласие (assent), а публичный рейтинг с именами и оценками нарушает конфиденциальность и может навредить отстающим (Study C).
- «A letter from the director» — разрешение войти в школу не равно согласию тех, кого изучают.
- «More classes» — имена и оценки всё равно останутся на странице каждого класса.
- «Switch to university students» — меняет исследование вместо защиты участников, а оценки студентов тоже персональные данные.`),
      ],
    },
    {
      id: "rmv6-b",
      title: PART_B,
      kind: "question",
      points: 7,
      context: partBContext("QuestLMS"),
      tasks: [
        open("rmv6-b1", "1", 0.5, B.b1("QuestLMS"),
          [
            "0.25 pts — a development output: something built — the QuestLMS game layer, the points and badges engine or the class leaderboard. A finding given here earns 0.",
            "0.25 pts — a research output: knowledge from the study — e.g. the one-term comparison of homework submission rates (or test scores, or motivation scores) between QuestLMS classes and usual-platform classes. The game layer, a feature or raw log-ins earn 0.",
          ],
          `- **Development output:** QuestLMS's game layer — points and badges for submitted homework and the class leaderboard.
- **Research output:** the one-term comparison of homework submission rates between the two QuestLMS classes and the two classes using the usual platform.`,
          `Результат разработки — **построенное**: игровой слой QuestLMS — баллы и бейджи за сданные задания и рейтинг класса. Исследовательский результат — **знание**: сравнение доли сданных домашних заданий за четверть между классами с QuestLMS и классами с обычной платформой.
Где теряют баллы: «журнал входов» назван исследовательским результатом — это сырые данные; «бейджи мотивируют всех» — утверждение, а не результат.`),
        open("rmv6-b2", "2", 1, B.b2("QuestLMS"),
          [
            "0.25 pts — current situation: the partner school wants more homework submitted, and game elements (QuestLMS) are being added to its platform for grade-8 pupils. Neutral — no 'every pupil', no 'revolution'.",
            "0.5 pts — a limitation from the table, attributed: e.g. Study A — more homework but no significant test-score difference, teachers knew the condition, one term; Study D — mostly university students, under eight weeks, leaderboards most mixed; Study B — self-selected, university students; Study C — low-ranking pupils embarrassed and stopped logging in. 0.25 if plausible but not tied to a study; 0 for an opinion.",
            "0.25 pts — the need: a study in grade-8 classes comparing QuestLMS with the usual platform on engagement (submission) and achievement (test scores) and motivation, with attention to low-ranking pupils.",
          ],
          `A partner school in Shymkent wants grade-8 pupils to submit more homework, and the team has added points, badges and a leaderboard to the school's platform (QuestLMS). However, the evidence is limited: the review in Study D covers mostly university students over less than eight weeks and finds achievement effects mixed — leaderboards most of all — and in Study A gamified classes submitted more homework without scoring better on tests. A one-term study is therefore needed in grade-8 classes that compares QuestLMS with the usual platform on homework submission, test scores and motivation, including pupils at the bottom of the ranking.`,
          `(1) **Ситуация**: школа хочет, чтобы восьмиклассники сдавали больше домашних заданий, на платформу добавлены игровые элементы. (2) **Ограничение со ссылкой**: Study D — в основном студенты вузов и меньше восьми недель, эффекты на успеваемость смешанные, у рейтингов особенно; Study A — заданий больше, а контрольные не лучше. (3) **Потребность**: четверть в 8-х классах, сравнение по сдаче заданий, контрольным и мотивации, с вниманием к ученикам внизу рейтинга.
Где теряют баллы: «геймификация — революция» вместо ситуации; ограничение без ссылки (0.25); потребность «сделать игру интереснее» не следует из ограничения.`),
        open("rmv6-b3", "3", 1, B.b3("QuestLMS"),
          [
            "0.25 pts — one clear, focused, neutral question (not 'Does gamification work?', not one that assumes every pupil is motivated).",
            "0.25 pts — the population: grade-8 pupils (aged 13–14) at the partner school.",
            "0.25 pts — the comparison: classes using QuestLMS vs classes using the usual platform.",
            "0.25 pts — a measurable outcome from the planned data, available in both conditions over one term: homework submission rate (or on-time submission, maths test scores, or the validated motivation score). Points or badges earned earn 0 for this line (only QuestLMS classes have them).",
          ],
          `Among grade-8 pupils at the partner school, how do homework submission rates over one term differ between classes using QuestLMS and classes using the usual platform without game elements?
Population — grade-8 pupils; comparison — QuestLMS vs the usual platform; outcome — the submission rate from platform records, available for all four classes.`,
          `Популяция — восьмиклассники школы-партнёра; сравнение — классы с QuestLMS против классов с обычной платформой; результат — доля сданных домашних заданий за четверть по данным платформы (подходят также контрольные или валидированный опросник мотивации).
Где теряют баллы: «набранные баллы и бейджи» как результат — их нет у обычных классов; «работает ли геймификация» без измерения; вопрос, заранее утверждающий, что мотивированы все.`),
        open("rmv6-b4", "4", 0.5, B.b4("QuestLMS"),
          [
            "0.25 pts — three concept groups joined with AND that match the study — the intervention (gamification, badges, leaderboards), the population (secondary / middle-school pupils, adolescents) and the outcome (homework completion, engagement, motivation, achievement) — each with at least two synonyms joined with OR inside parentheses.",
            SEARCH_SYNTAX,
          ],
          `= (gamification OR leaderboard OR "game elements") AND ("secondary school" OR "middle school" OR adolescent) AND ("homework completion" OR engagement OR motivation)
The school-age group is what keeps the results from being dominated by university studies (the limitation of Study D).`,
          `= (gamification OR leaderboard OR "game elements") AND ("secondary school" OR "middle school" OR adolescent) AND ("homework completion" OR engagement OR motivation)
Группа про школьников не даёт выдаче утонуть в исследованиях студентов вузов (ограничение Study D).
Где теряют баллы: «gamification works» как фраза; только AND между одиночными словами; без скобок; одно понятие.`),
        open("rmv6-b5", "5", 1.5, B.b5("QuestLMS"),
          [
            "0.25 pts — risk 1: the participants are minors (13–14) and only the director agreed — no parental consent, no pupils' own assent, and no ethics review for a vulnerable group.",
            "0.25 pts — a specific safeguard for risk 1: ethics review before data collection; informed consent from parents and age-appropriate assent from pupils in Kazakh or Russian; a pupil can decline or withdraw without any effect on grades.",
            "0.25 pts — evidence for risk 1: the ethics-approval reference, signed and dated parental consent and pupil assent forms, and the information letter sent to parents.",
            "0.25 pts — risk 2: the leaderboard shows full names and maths grades to the whole class — disclosure of personal data and possible embarrassment or harm (Study C: low-ranking pupils felt embarrassed and stopped logging in).",
            "0.25 pts — a specific safeguard for risk 2: no grades on the leaderboard; pupils appear under self-chosen nicknames, or only their own progress is shown; research exports use codes instead of names.",
            "0.25 pts — evidence for risk 2: screenshots of the revised leaderboard settings, the data-management plan with coded exports and access limited to named researchers. A safeguard without a record earns 0 for this line.",
          ],
          `- **Risk 1 — children without consent.** The pupils are 13–14, and only the director agreed; parents and pupils were never asked. **Safeguard:** ethics review first, then parental consent and pupils' own assent in Kazakh or Russian, with the right to decline without any effect on grades. **Evidence:** the ethics-approval reference and the signed consent and assent forms.
- **Risk 2 — public names and grades.** The leaderboard shows every pupil's name and maths grade to the class, which can embarrass low-ranking pupils (as in Study C). **Safeguard:** grades removed from the leaderboard and pupils shown under self-chosen nicknames; research data exported under codes. **Evidence:** screenshots of the revised leaderboard settings and the data-management plan.`,
          `- Риск 1: участники — дети 13–14 лет, согласился только директор, родителей и учеников не спрашивали. Мера: сначала этическая экспертиза, затем согласие родителей и согласие самих учеников на казахском или русском, отказ без последствий для оценок. Доказательство: номер одобрения, подписанные формы согласия родителей и учеников.
- Риск 2: рейтинг показывает всему классу имена и оценки по математике — раскрытие персональных данных и вред для отстающих (Study C). Мера: без оценок, под выбранными учениками никами или только личный прогресс; в исследовательских данных коды. Доказательство: скриншоты новых настроек рейтинга, план управления данными.
Где теряют баллы: «директор разрешил — значит, согласие есть»; «рейтинг мотивирует, поэтому риска нет»; мера без записи-доказательства.`),
        open("rmv6-b6", "6", 1.5, B.b6(),
          [
            SYNTHESIS_THEMES,
            "0.5 pts — the methodological contrast: A is a cluster-randomised trial but teachers knew the condition; B is observational (self-selection, prior grades not controlled) and with university students; C is qualitative — explains how rankings feel to low and high rankers but has no performance data; D is a secondary review dominated by short university studies.",
            "0.5 pts — an overall conclusion with limitations: gamification seems to increase activity (submission, engagement) more reliably than achievement; leaderboards may help some pupils and harm others; longer, school-age evidence is limited.",
          ],
          `Across the studies, gamification raises activity more reliably than achievement. Study A and the review in Study D both show more homework or engagement, but A found no significant difference in test scores and D reports mixed achievement effects. Study B seems to contradict this by linking leaderboard checking to higher grades, but its design explains the difference: students chose whether to check the leaderboard and prior grades were not controlled, so stronger students may simply check it more. Study C shows why leaderboards give the most mixed results: high-ranking pupils enjoyed them, while low-ranking pupils felt embarrassed and some stopped logging in. Overall, game elements may increase submission, but their effect on learning is unproven, and most evidence comes from short studies with university students.`,
          `Синтез по темам: (1) **активность против успеваемости** — A и D показывают рост сдачи и вовлечённости, но контрольные не лучше (A), эффект на успеваемость смешанный (D); (2) **кажущееся противоречие B** объясняется дизайном — самоотбор, не учтены прежние оценки, студенты вуза; (3) **почему рейтинги спорны** — C: лидерам нравится, отстающим стыдно, часть перестаёт заходить; (4) **вывод с ограничениями** — геймификация поднимает сдачу, но влияние на обучение не доказано, а данных о школьниках и длительных исследований мало.
Где теряют баллы: пересказ по очереди; B как доказательство причины; вывод «геймификация работает» без оговорок.`),
        open("rmv6-b7", "7", 1, B.b7("QuestLMS"),
          [
            "0.5 pts — a gap from the table, cited: e.g. limited evidence for school pupils (D: mostly university students; B: university), limited evidence on achievement beyond engagement (A: no test difference; D: mixed), or on how leaderboards affect low-ranking pupils (C, D). Stated as limited evidence; 'no research exists' or a gap not linked to the table earns 0 for this line.",
            "0.5 pts — how this study addresses it: grade-8 classes, QuestLMS vs the usual platform over one term, measuring submission, maths test scores and validated motivation (possibly comparing low- and high-ranking pupils). A bare 'the study will fill the gap' earns 0.",
          ],
          `Most gamification studies involve university students over less than eight weeks, and their effects on achievement are mixed, with leaderboards the most uncertain element (Study D); Study C suggests leaderboards may discourage low-ranking pupils. There is therefore limited evidence on how gamification affects both homework submission and achievement among younger school pupils over a full term. The proposed study addresses this by comparing QuestLMS and usual-platform classes of grade-8 pupils over ten weeks on submission rates, maths test scores and a validated motivation questionnaire, which also allows the motivation of lower-ranking pupils to be examined.`,
          `Пробел популяции и результата: исследования в основном про студентов вузов и короче восьми недель, эффект на успеваемость смешанный, рейтинги — самый спорный элемент (D), а отстающих они могут демотивировать (C). Данных о школьниках за полную четверть и сразу по сдаче и по успеваемости **мало**. Исследование закрывает это: восьмиклассники, QuestLMS против обычной платформы, сдача, контрольные и мотивация, с возможностью отдельно посмотреть на учеников внизу рейтинга.
Где теряют баллы: «про геймификацию в школах ничего нет» — в A школьники; пробел без ссылки на таблицу; нет объяснения, как дизайн закрывает пробел.`),
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// rmv7 — FaceCheck: посещаемость по распознаванию лиц (биометрия)
// ─────────────────────────────────────────────────────────────────────────────

const v7: MockExam = {
  id: "rmv7",
  title: title("FaceCheck", "посещаемость по распознаванию лиц"),
  minutes: MINUTES,
  total: 10,
  source: NEW,
  questions: [
    {
      id: "rmv7-a",
      title: PART_A,
      points: 3,
      context: caseContext(
        `The IT department of a university in Astana is considering **FaceCheck**, a face-recognition system for attendance. A camera at the classroom door photographs each student, matches the face with the student-card photo in the university database, and marks the student present. Face templates and all photos are stored on the cloud server of the system's foreign vendor, and no deletion period is stated.
The team plans a six-week pilot in eight lecture groups (about 240 students): four groups use FaceCheck, four keep paper sign-in sheets. Planned data: attendance records from both methods, the minutes spent on attendance in each lecture (measured by observers), attendance errors checked against a manual roll call, and a student acceptance questionnaire.
The team calls the project "AI-Powered Smart Campus" and asks: "Is face recognition the future of universities?" They write: "FaceCheck is 100% accurate and stops all cheating."
For the literature section, one team member copied a paragraph from a review paper, changing only a few words, and cited the original studies that the review mentions without opening them. In the pilot groups, lecturers tell students that anyone who refuses to be photographed will be marked absent.`,
        [
          `| Study A | Quasi-experiment; 6 university classes, one semester (3 with face recognition, 3 with roll call) | Face recognition saved about 5 minutes per lecture; recorded attendance was similar in both conditions | Classes were not randomly assigned. Recognition errors were not reported |`,
          `| Study B | Technical evaluation of 3 commercial systems on 10,000 campus photos | Overall accuracy was 97–99%, but error rates were up to four times higher in low light and for students wearing glasses or face coverings | Photos from one country; tested on a dataset, not in real classrooms |`,
          `| Study C | Interviews with 25 students and 10 lecturers | Lecturers valued the time saved; many students felt watched, did not know where their photos were stored, and said they could not refuse | One university. Participants volunteered |`,
          `| Study D | Systematic review of 19 studies of automated attendance systems | Most studies reported time savings; few measured recognition errors in real classrooms or students' acceptance | Most studies were pilots shorter than one month, and many were written by the system's developers |`,
        ],
      ),
      tasks: [
        mc("rmv7-a1", "1",
          `Why is "Is face recognition the future of universities?" not a researchable question?`,
          [
            "It is too narrow, because it covers only face recognition at universities",
            "It is a yes/no question, and research questions must always start with 'How'",
            "It names a technology, and research questions must not name technologies",
            "It speculates about the future, with no outcome that data could measure now",
          ], 3,
          `**Correct: it speculates about the future with no measurable outcome.** The researchability test asks whether evidence can be collected to answer the question. "The future of universities" is a forecast: no population, comparison or outcome is defined, so no pilot could answer it. A researchable version: in eight lecture groups, attendance errors against a roll call, FaceCheck vs paper sheets.
- "Too narrow" — the opposite: "the future of universities" is extremely broad.
- "Yes/no questions must start with 'How'" — "Does Tool X reduce debugging time?" is a valid research question; what matters is measurability, not the first word.
- "Must not name technologies" — naming the tool is often necessary: it is the factor being compared.`,
          `**Верно: это гадание о будущем без измеримого результата.** Тест исследуемости: можно ли собрать доказательства для ответа? «Будущее университетов» — прогноз: не определены ни популяция, ни сравнение, ни результат, и никакой пилот на это не ответит. Исследуемая версия: в восьми группах — ошибки посещаемости по сравнению с перекличкой, FaceCheck против бумажных листов.
- «Too narrow» — наоборот: «будущее университетов» — очень широко.
- «Yes/no questions must start with 'How'» — «Does Tool X reduce debugging time?» — нормальный исследовательский вопрос; важна измеримость, а не первое слово.
- «Must not name technologies» — назвать инструмент часто необходимо: это и есть сравниваемый фактор.`),
        mc("rmv7-a2", "2",
          `The team writes: "FaceCheck is 100% accurate and stops all cheating." Which evidence in the table most directly contradicts the first part of this claim?`,
          [
            "Study B: much higher error rates in low light and with glasses",
            "Study A: about five minutes of lecture time saved per session",
            "Study C: lecturers valued the lecture time the system saved",
            "Study D: most of the reviewed studies reported time savings",
          ], 0,
          `**Correct: Study B.** It is the only study that measured accuracy: 97–99% overall, with error rates up to four times higher in low light and with glasses or face coverings — so 100% is contradicted even on a dataset, before real classroom conditions. Note that Study A simply did not report errors: absence of evidence is not proof of perfection.
- Study A — about time saved, not accuracy.
- Study C — lecturers' views on time, not accuracy.
- Study D — time savings again; it even notes that few studies measured recognition errors in classrooms.`,
          `**Верно: Study B.** Только оно измеряло точность: 97–99% в целом, а при слабом свете, в очках или с закрытым лицом ошибок до четырёх раз больше — значит, 100% опровергнуты уже на наборе фото, ещё до реальной аудитории. Заметим: Study A просто не сообщает об ошибках, а отсутствие данных — не доказательство безошибочности.
- Study A — об экономии времени, а не о точности.
- Study C — мнение преподавателей о времени, а не о точности.
- Study D — снова экономия времени; там даже отмечено, что ошибки в аудиториях почти не измеряли.`),
        mc("rmv7-a3", "3",
          `Which of the following is a research output of the FaceCheck pilot?`,
          [
            "The camera mount and recognition unit installed at the door",
            "The error rate measured against a manual roll call per group",
            "The matching service that links faces to student-card photos",
            "The dashboard that shows lecturers which students are present",
          ], 1,
          `**Correct: the error rate measured against a manual roll call.** It is new knowledge obtained by comparing the system's records with a reference measure. The other three are parts of the system that is built and installed — development outputs.
- "The camera mount and recognition unit" — hardware: development output.
- "The matching service" — software: development output.
- "The dashboard for lecturers" — a built interface: development output.`,
          `**Верно: доля ошибок по сравнению с ручной перекличкой.** Это новое знание, полученное сравнением записей системы с эталонным измерением. Остальные три — части системы, которую строят и устанавливают, то есть результаты разработки.
- «The camera mount and recognition unit» — оборудование: разработка.
- «The matching service» — программный компонент: разработка.
- «The dashboard for lecturers» — построенный интерфейс: разработка.`),
        mc("rmv7-a4", "4",
          `Study B reports 97–99% accuracy on 10,000 campus photos. Why can't the team assume FaceCheck will be this accurate in its classrooms?`,
          [
            "Accuracy above 95% is always a sign of fabricated or falsified results",
            "A technical evaluation is qualitative, so its percentages are not reliable",
            "It was tested on a photo dataset, not in real classrooms with real lighting",
            "A sample of 10,000 photos is too small for testing a commercial system",
          ], 2,
          `**Correct: it was tested on a dataset, not in real classrooms.** A doorway brings different light, angles, movement, glasses and face coverings — exactly the conditions under which B found errors up to four times higher. The photos also came from one country, and FaceCheck is not necessarily one of the three systems tested.
- "Above 95% means fabrication" — high accuracy is plausible; fabrication means inventing data, not getting good results.
- "A technical evaluation is qualitative" — accuracy percentages are quantitative data.
- "10,000 photos is too small" — it is a large set; the problem is the conditions, not the size.`,
          `**Верно: проверяли на наборе фотографий, а не в настоящих аудиториях.** У двери другой свет, ракурсы, движение, очки и закрытые лица — ровно те условия, при которых в B ошибок было до четырёх раз больше. К тому же фото из одной страны, и FaceCheck не обязательно входит в три проверенные системы.
- «Above 95% means fabrication» — высокая точность правдоподобна; фабрикация — это выдумывание данных, а не хороший результат.
- «A technical evaluation is qualitative» — проценты точности — количественные данные.
- «10,000 photos is too small» — набор большой; дело в условиях, а не в размере.`),
        mc("rmv7-a5", "5",
          `A team member copied a paragraph from a review paper, changed a few words, and cited the original studies the review mentions without opening them. What is wrong?`,
          [
            "Nothing: changing some words makes it a paraphrase, and sources are cited",
            "It is patchwriting, and the originals are cited without being verified",
            "It is synthesis, because the paragraph brings several studies together",
            "It is fabrication, because the review paper itself does not really exist",
          ], 1,
          `**Correct: patchwriting plus unverified citations.** Swapping a few words while keeping the source's structure is patchwriting — not acceptable final prose — and the synthesis belongs to the review's authors, so the review must be cited. Citing the originals without opening them presents claims the team never checked. Fix: paraphrase in your own structure, cite the review for its synthesis, and open each original before citing it.
- "It is a paraphrase" — a paraphrase needs new wording and new structure, with a citation.
- "It is synthesis" — the synthesis was done by the review's authors; copying it is not the team's own synthesis.
- "It is fabrication" — the review exists and nothing was invented; the problem is attribution and verification.`,
          `**Верно: patchwriting и непроверенные ссылки.** Замена нескольких слов при сохранении структуры источника — patchwriting, недопустимый итоговый текст; к тому же синтез принадлежит авторам обзора, и ссылаться нужно на обзор. Ссылки на оригиналы, которые никто не открывал, выдают непроверенные утверждения за проверенные. Исправление: пересказать своими словами и в своей структуре, сослаться на обзор за его синтез и открыть каждый оригинал перед цитированием.
- «It is a paraphrase» — парафраз требует новых слов и новой структуры, со ссылкой.
- «It is synthesis» — синтез сделали авторы обзора; его копия — не синтез команды.
- «It is fabrication» — обзор существует, ничего не выдумано; проблема в атрибуции и проверке.`),
        mc("rmv7-a6", "6",
          `In the pilot groups, lecturers tell students that anyone who refuses to be photographed will be marked absent. Which part of informed consent does this violate most directly?`,
          [
            "Choose: taking part must be voluntary, without pressure or penalty",
            "Ask: there must be a contact for questions and for any complaints",
            "Understand: students must be able to explain how matching works",
            "Withdraw: the data must be deleted as soon as the pilot is over",
          ], 0,
          `**Correct: "Choose" — participation must be voluntary.** A penalty for refusing (being marked absent), announced by the people who control attendance, is coercion. A fair pilot offers an alternative — e.g. the paper sheet — with no consequences.
- "Ask" — a contact is required too, but the threat is about pressure, not about missing contact details.
- "Understand" — students must understand the purpose, risks and data use (Study C: many did not know where photos were stored), not explain the matching algorithm.
- "Withdraw" — means a clear route to leave at any time; deleting data after the pilot is a retention decision.`,
          `**Верно: «Choose» — участие должно быть добровольным.** Наказание за отказ (пропуск занятия), объявленное теми, кто отмечает посещаемость, — это принуждение. Честный пилот предлагает альтернативу — например, бумажный лист — без последствий.
- «Ask» — контакт тоже нужен, но угроза касается давления, а не отсутствия контактов.
- «Understand» — студенты должны понимать цель, риски и использование данных (по Study C многие не знали, где хранятся фото), а не объяснять алгоритм сопоставления.
- «Withdraw» — это понятный способ выйти в любой момент; удаление данных после пилота — вопрос срока хранения.`),
      ],
    },
    {
      id: "rmv7-b",
      title: PART_B,
      kind: "question",
      points: 7,
      context: partBContext("FaceCheck"),
      tasks: [
        open("rmv7-b1", "1", 0.5, B.b1("FaceCheck"),
          [
            "0.25 pts — a development output: something built — the FaceCheck system, the door camera, the face-matching service or the attendance dashboard. A finding given here earns 0.",
            "0.25 pts — a research output: knowledge from the pilot — e.g. the comparison of attendance-record accuracy against a manual roll call (or minutes spent on attendance, or acceptance scores) between FaceCheck and paper-sheet groups over six weeks. The system, a feature or raw photos earn 0.",
          ],
          `- **Development output:** the FaceCheck system — the door camera, the face-matching service linked to student-card photos and the attendance dashboard.
- **Research output:** the six-week comparison of attendance-record accuracy, checked against a manual roll call, between the FaceCheck groups and the paper-sheet groups.`,
          `Результат разработки — **построенное**: система FaceCheck — камера у двери, сервис сопоставления лиц с фото студенческих и панель посещаемости. Исследовательский результат — **знание**: сравнение точности записей посещаемости (по ручной перекличке) за шесть недель между группами с FaceCheck и группами с бумажными листами.
Где теряют баллы: «база фотографий» названа результатом исследования — это сырые данные; «100% точность» — обещание, а не результат.`),
        open("rmv7-b2", "2", 1, B.b2("FaceCheck"),
          [
            "0.25 pts — current situation: taking attendance uses lecture time (Study A: about five minutes per lecture), and the university is considering automating it with FaceCheck. Neutral — no '100% accurate', no 'stops all cheating'.",
            "0.5 pts — a limitation from the table, attributed: e.g. Study B — accuracy tested on a photo dataset, errors up to four times higher in low light and with glasses; Study A — recognition errors not reported, non-random classes; Study D — few real-classroom error or acceptance measurements, short pilots often by developers; Study C — students felt watched and unable to refuse. 0.25 if plausible but not tied to a study; 0 for an opinion.",
            "0.25 pts — the need: an independent classroom pilot comparing FaceCheck with paper sheets that measures real attendance errors against a roll call, time spent and student acceptance.",
          ],
          `Taking attendance costs lecture time, and the university's IT department is considering FaceCheck, a face-recognition system, to automate it. However, the evidence on how well such systems work in real classrooms is limited: Study B measured accuracy only on a photo dataset and found errors up to four times higher in low light and with glasses, Study A did not report recognition errors at all, and the review in Study D found few real-classroom error or acceptance measurements, mostly in short pilots written by the developers. An independent classroom pilot is therefore needed that compares FaceCheck with paper sheets on attendance errors checked against a manual roll call, time spent and student acceptance.`,
          `(1) **Ситуация**: отметка посещаемости отнимает время лекции (около пяти минут в Study A), университет рассматривает FaceCheck. (2) **Ограничение со ссылкой**: Study B — точность только на наборе фото, при слабом свете и в очках ошибок до четырёх раз больше; Study A — ошибки распознавания не сообщались; Study D — в аудиториях ошибки и принятие почти не измеряли, пилоты короткие и часто от разработчиков. (3) **Потребность**: независимый пилот в аудиториях — ошибки по перекличке, время и принятие студентами.
Где теряют баллы: «студенты постоянно списывают / прогуливают» без опоры на кейс; «точность 99%» как факт для реальных аудиторий; ограничение без ссылки (0.25).`),
        open("rmv7-b3", "3", 1, B.b3("FaceCheck"),
          [
            "0.25 pts — one clear, focused, neutral question (not 'Is face recognition the future of universities?', not one that assumes 100% accuracy; one main outcome, not a list).",
            "0.25 pts — the population: students in the university's lecture groups (the eight pilot groups).",
            "0.25 pts — the comparison: FaceCheck vs paper sign-in sheets.",
            "0.25 pts — a measurable outcome from the planned data, measured for both methods over six weeks: attendance errors checked against the manual roll call, minutes spent on attendance, or the acceptance score. 'Cheating' or 'the future' earn 0 for this line.",
          ],
          `In eight university lecture groups, how does the rate of attendance-recording errors, checked against a manual roll call, differ between FaceCheck and paper sign-in sheets over six weeks?
Population — students in the pilot lecture groups; comparison — FaceCheck vs paper sheets; outcome — the error rate against a roll call, measured the same way for both methods.`,
          `Популяция — студенты восьми групп пилота; сравнение — FaceCheck против бумажных листов; результат — доля ошибок записи посещаемости по сравнению с ручной перекличкой, одинаково для обоих способов, за шесть недель.
Где теряют баллы: «списывание» или «будущее» как результат — их нет в плане; три результата в одном вопросе без главного; «точность FaceCheck» без сравнения с бумажными листами.`),
        open("rmv7-b4", "4", 0.5, B.b4("FaceCheck"),
          [
            "0.25 pts — three concept groups joined with AND that match the study — the technology (face / facial recognition, biometric), the purpose (attendance, roll call) and the setting (university, classroom, higher education) — each with at least two synonyms joined with OR inside parentheses.",
            SEARCH_SYNTAX,
          ],
          `= ("face recognition" OR "facial recognition" OR biometric) AND (attendance OR "attendance tracking" OR "roll call") AND (university OR classroom OR "higher education")
Technology, purpose and setting are joined with AND; synonyms such as "face" and "facial" recognition are joined with OR so that papers using either term are found.`,
          `= ("face recognition" OR "facial recognition" OR biometric) AND (attendance OR "attendance tracking" OR "roll call") AND (university OR classroom OR "higher education")
Технология, цель и место через AND; варианты «face» и «facial» recognition через OR, чтобы найти статьи с любым из терминов.
Где теряют баллы: «AI smart campus» одной фразой; «FaceCheck» в строке; без кавычек у «face recognition»; только OR.`),
        open("rmv7-b5", "5", 1.5, B.b5("FaceCheck"),
          [
            "0.25 pts — risk 1: biometric data (face templates and photos) stored on a foreign vendor's cloud with no deletion period — highly sensitive data, transferred outside the university, with unclear retention and reuse.",
            "0.25 pts — a specific safeguard for risk 1: templates kept on university-controlled storage (or under a contract fixing location, retention and no reuse); photos deleted immediately after matching, templates at the end of the pilot.",
            "0.25 pts — evidence for risk 1: the data-processing agreement with the vendor, the data-management plan with the retention period, a deletion record at the end of the pilot.",
            "0.25 pts — risk 2: coerced participation — students told that refusal means being marked absent; voluntariness is violated, and Study C shows students felt they could not refuse.",
            "0.25 pts — a specific safeguard for risk 2: a paper sign-in alternative for anyone who declines, with no effect on attendance or grades; consent collected by the research team, not by lecturers; a clear explanation of where photos are stored.",
            "0.25 pts — evidence for risk 2: the information sheet and consent form with an opt-out option, attendance records showing the alternative method used without penalty, or the ethics-approval reference. A safeguard without a record earns 0 for this line.",
          ],
          `- **Risk 1 — biometric data on a foreign vendor's cloud.** Face templates and photos are highly sensitive, leave the university and have no deletion date. **Safeguard:** keep templates on university-controlled storage (or under a contract fixing location and no reuse), delete photos right after matching and templates at the end of the pilot. **Evidence:** the signed data-processing agreement and a deletion record at the end of the pilot.
- **Risk 2 — no real choice.** Students who refuse are marked absent, so participation is not voluntary. **Safeguard:** a paper sign-in alternative without any penalty, and consent collected by the research team rather than lecturers. **Evidence:** the consent form with an opt-out box and attendance records showing that opt-out students were marked present by the alternative method.`,
          `- Риск 1: биометрия (шаблоны лиц и фото) хранится в облаке иностранного поставщика без срока удаления — очень чувствительные данные уходят за пределы университета. Мера: шаблоны в хранилище под контролем университета (или договор о месте хранения и запрете повторного использования), фото удаляются сразу после сопоставления, шаблоны — в конце пилота. Доказательство: договор об обработке данных, запись об удалении.
- Риск 2: принуждение — отказ равен пропуску, добровольности нет (по Study C студенты считали, что отказаться нельзя). Мера: бумажный лист как альтернатива без наказания, согласие собирает команда, а не преподаватель. Доказательство: форма согласия с пунктом отказа, записи посещаемости, где отказавшиеся отмечены альтернативным способом.
Где теряют баллы: «фото и так есть на студенческом» — сбор шаблонов и хранение у поставщика меняют дело; «предупредим студентов» без права отказаться; мера без записи.`),
        open("rmv7-b6", "6", 1.5, B.b6(),
          [
            SYNTHESIS_THEMES,
            "0.5 pts — the methodological contrast: A is a quasi-experiment without random assignment and without error data; B is a technical evaluation on a photo dataset, not in classrooms; C is qualitative with volunteers — explains acceptance and consent problems; D is a secondary review of short pilots, many by the developers (possible conflict of interest).",
            "0.5 pts — an overall conclusion with limitations: time savings are fairly consistent, but real-classroom accuracy and student acceptance are poorly evidenced, and consent concerns are serious.",
          ],
          `The evidence agrees on time savings but says little about accuracy and acceptance in real classrooms. Study A, the review in Study D and the lecturers interviewed in Study C all point to saved lecture time, yet A did not report recognition errors, and D found that few studies measured errors in real classrooms. The only accuracy data come from Study B, a dataset test, which shows that errors rise sharply in low light and with glasses — conditions common at a classroom door. Acceptance is the second weak point: D found it rarely measured, while C's interviews show students felt watched, did not know where their photos were stored and felt unable to refuse. Since many studies in D were short pilots written by the developers themselves, the evidence for accurate and acceptable classroom use remains limited.`,
          `Синтез по темам: (1) **время** — A, D и преподаватели в C согласны: экономия есть; (2) **точность** — в A ошибки не сообщались, в D их в аудиториях почти не измеряли, а единственные данные — B на наборе фото, где при слабом свете и в очках ошибок больше; (3) **принятие** — D его почти не измеряло, а C показывает, что студенты чувствуют слежку и не могут отказаться; (4) **качество доказательств** — короткие пилоты от самих разработчиков (конфликт интересов); вывод: точность и приемлемость в реальных аудиториях не доказаны.
Где теряют баллы: пересказ по очереди; B как доказательство точности в аудиториях; нет вывода с ограничениями.`),
        open("rmv7-b7", "7", 1, B.b7("FaceCheck"),
          [
            "0.5 pts — a gap from the table, cited: e.g. limited independent evidence on recognition errors in real classrooms (A: errors not reported; B: dataset only; D: few real-classroom error measurements, many by developers), or on student acceptance (D, C). Stated as limited evidence; 'no research exists' or a gap not linked to the table earns 0 for this line.",
            "0.5 pts — how this study addresses it: a six-week pilot in real lecture groups with errors checked against a manual roll call, a comparison with paper sheets, and an acceptance questionnaire, run by a team that is not the vendor. A bare 'the study will fill the gap' earns 0.",
          ],
          `Evidence on attendance systems mostly reports time savings: recognition errors were not reported in Study A, were measured only on a photo dataset in Study B, and were rarely measured in real classrooms according to the review in Study D, where many studies were written by the developers. There is therefore limited independent evidence on how accurate face-recognition attendance is in real lectures and how students accept it. The proposed pilot addresses this by checking FaceCheck's records against a manual roll call in real lecture groups, comparing them with paper sheets, and measuring acceptance with a questionnaire — conducted by a team that does not sell the system.`,
          `Пробел метода и независимости: ошибки распознавания в A не сообщались, в B измерены только на наборе фото, в D в аудиториях почти не измерялись, а многие работы написаны разработчиками. Независимых данных о точности в реальных лекциях и о принятии студентами **мало**. Пилот закрывает это: сверка с ручной перекличкой в реальных группах, сравнение с бумажными листами и опрос о принятии — силами команды, которая систему не продаёт.
Где теряют баллы: «о распознавании лиц в вузах никто не писал» — в таблице четыре работы; пробел про «точность алгоритмов вообще» без связи с аудиториями; нет объяснения, как пилот отвечает на пробел.`),
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// rmv8 — DormEats: доставка еды по кампусу с трекингом курьеров
// ─────────────────────────────────────────────────────────────────────────────

const v8: MockExam = {
  id: "rmv8",
  title: title("DormEats", "доставка еды по кампусу с трекингом курьеров"),
  minutes: MINUTES,
  total: 10,
  source: NEW,
  questions: [
    {
      id: "rmv8-a",
      title: PART_A,
      points: 3,
      context: caseContext(
        `A student start-up at a university in Almaty runs **DormEats**, a food-delivery app for the campus. Student couriers bring orders from campus cafés to the dormitories. The app tracks every courier's GPS location continuously — also when the courier is off shift — and shows customers the courier's live position, full name and photo. Customers enter their dormitory block and room number.
The team plans a four-week study: in two of the four dormitory blocks, customers see the courier's live position on a map; in the other two, customers see only an estimated delivery time. Planned data: delivery times from order to hand-over, order logs, the number of "Where is my order?" messages to support, a customer satisfaction questionnaire, and courier working hours.
The team calls the project "Delivery of the Future" and asks: "Does tracking improve delivery?" They write: "Live tracking makes every customer satisfied."
The team searched only Google, typing one long sentence about campus food delivery, found nothing relevant, and wrote in its draft: "No research on delivery tracking exists."`,
        [
          `| Study A | Randomised field experiment; 3,000 customers of a city delivery platform; 4 weeks | Customers shown a live courier map sent fewer "Where is my order?" messages; satisfaction rose slightly; delivery times did not change | One city platform with professional couriers. Satisfaction was measured with a single question |`,
          `| Study B | Analysis of 50,000 orders from a food-delivery app | Orders with live tracking received higher ratings than orders without it | Tracking was available only in some districts and at some times. Restaurant quality was not controlled |`,
          `| Study C | Interviews with 22 delivery couriers working for platforms | Couriers accepted tracking during shifts but felt controlled when tracked off shift; some had been contacted by customers after a delivery | Couriers from one company. No customer data |`,
          `| Study D | Systematic review of 27 studies of delivery-tracking features | Tracking generally reduced customers' uncertainty; effects on satisfaction were small and inconsistent | Most studies used single-item satisfaction measures. Few were set in closed communities such as campuses, and couriers' views were rarely included |`,
        ],
      ),
      tasks: [
        mc("rmv8-a1", "1",
          `The team asks: "Does tracking improve delivery?" Which version is the most feasible within four weeks and the planned data?`,
          [
            "Does live courier tracking improve food delivery across Kazakhstan's largest cities?",
            "Will GPS tracking make DormEats the leading delivery app among all students in Almaty?",
            "Do dorm customers who see a live courier map send fewer 'Where is my order?' messages?",
            "How has delivery tracking changed the food industry since smartphones first appeared?",
          ], 2,
          `**Correct: the "Where is my order?" messages question.** It uses the planned design (live-map blocks vs estimated-time blocks), a population the team can reach (dormitory customers) and an outcome already in the data (support messages) — answerable in four weeks.
- "Across Kazakhstan's largest cities" — no data outside the campus; not feasible for this team.
- "Make DormEats the leading app" — a market prediction with no measure, and it presupposes a positive answer.
- "Since smartphones first appeared" — a historical, industry-wide question that needs a different study entirely.`,
          `**Верно: вопрос о сообщениях «Where is my order?».** Он опирается на планируемый дизайн (корпуса с картой против корпусов только со временем доставки), на доступную популяцию (жильцы общежитий) и на результат, который уже есть в данных (обращения в поддержку), — ответ можно получить за четыре недели.
- «Across Kazakhstan's largest cities» — данных за пределами кампуса нет; для команды невыполнимо.
- «Make DormEats the leading app» — прогноз рынка без измерения, к тому же заранее предполагает успех.
- «Since smartphones first appeared» — исторический вопрос обо всей отрасли, для него нужно совсем другое исследование.`),
        mc("rmv8-a2", "2",
          `Study A found that satisfaction rose only slightly and delivery times did not change. What does this mean for the team's claim "Live tracking makes every customer satisfied"?`,
          [
            "The claim is confirmed, because satisfaction rose in the tracking group",
            "The claim is disproved, so tracking has no effect on customers at all",
            "The claim cannot be judged, because Study A used a randomised design",
            "The claim overstates the evidence: the effect on satisfaction was small",
          ], 3,
          `**Correct: the claim overstates the evidence.** A slight average rise, measured with a single question, is far from "every customer satisfied", and Study D also reports small, inconsistent satisfaction effects. But do not over-correct: tracking did reduce "Where is my order?" messages, so it has an effect — on uncertainty rather than satisfaction.
- "Confirmed" — a slight average rise does not mean every customer is satisfied.
- "Disproved, no effect at all" — A found fewer support messages; "small" is not "none".
- "Cannot be judged because it was randomised" — random assignment is the strongest basis for judging an effect, not a reason to ignore it.`,
          `**Верно: утверждение преувеличивает данные.** Небольшой средний рост, измеренный одним вопросом, далёк от «доволен каждый», и Study D тоже говорит о небольших и непостоянных эффектах на удовлетворённость. Но не стоит впадать в другую крайность: трекинг сократил число вопросов «Where is my order?», то есть эффект есть — на неуверенность, а не на удовлетворённость.
- «Confirmed» — небольшой средний рост не значит, что доволен каждый.
- «Disproved, no effect at all» — в A меньше обращений в поддержку; «небольшой» не равно «никакого».
- «Cannot be judged because it was randomised» — случайное распределение — самая надёжная основа для суждения об эффекте, а не повод его игнорировать.`),
        mc("rmv8-a3", "3",
          `Which item is a development output of DormEats rather than a research output?`,
          [
            "The live courier map and delivery-time estimate in the app",
            "The comparison of support messages between dorm blocks",
            "The finding on delivery times under the two conditions",
            "The analysis of satisfaction scores in the two kinds of block",
          ], 0,
          `**Correct: the live courier map and the delivery-time estimate.** They are features the start-up builds. The other three compare measured outcomes between conditions — knowledge, i.e. research outputs.
- "The comparison of support messages" — research output.
- "The finding on delivery times" — research output.
- "The analysis of satisfaction scores" — research output.`,
          `**Верно: карта с курьером и оценка времени доставки.** Это функции, которые строит стартап. Остальные три сравнивают измеренные показатели между условиями — это знание, то есть исследовательские результаты.
- «The comparison of support messages» — исследование.
- «The finding on delivery times» — исследование.
- «The analysis of satisfaction scores» — исследование.`),
        mc("rmv8-a4", "4",
          `Which study best explains why couriers might object to how DormEats tracks them?`,
          [
            "Study B, because it analysed 50,000 orders, the largest sample in the table",
            "Study C, because couriers described feeling controlled when tracked off shift",
            "Study A, because random assignment reveals how couriers feel about tracking",
            "Study D, because the review included couriers' views in nearly every study",
          ], 1,
          `**Correct: Study C.** Qualitative interviews explain experiences and reasons, and these couriers describe exactly DormEats' practice: tracking off shift felt controlling, and some were contacted by customers after a delivery.
- Study B — orders and customer ratings; it says nothing about couriers, however large the sample.
- Study A — randomised customers and customer outcomes; random assignment does not capture couriers' feelings.
- Study D — its limitation says couriers' views were rarely included.`,
          `**Верно: Study C.** Качественные интервью объясняют опыт и причины, и эти курьеры описывают ровно практику DormEats: слежка вне смены воспринимается как контроль, а некоторым клиенты писали после доставки.
- Study B — заказы и оценки клиентов; о курьерах там ничего нет, какой бы большой ни была выборка.
- Study A — случайно распределённые клиенты и их показатели; рандомизация не показывает чувства курьеров.
- Study D — в ограничениях сказано, что мнения курьеров почти не учитывались.`),
        mc("rmv8-a5", "5",
          `The team searched only Google with one long sentence, found nothing relevant, and wrote: "No research on delivery tracking exists." What is the best assessment?`,
          [
            "Correct: if Google shows nothing, the topic is a genuine research gap",
            "Correct: Google indexes every scholarly paper, so nothing was missed",
            "Incorrect: they should cite the Wikipedia page on delivery apps instead",
            "Incorrect: a failed search is not a gap; use databases and synonyms",
          ], 3,
          `**Correct: a failed search is not a gap.** Pasting a whole sentence matches almost nothing, because no paper uses exactly that wording. Break the problem into concepts and synonyms, combine them with AND / OR, and search Google Scholar, Scopus, IEEE Xplore or ACM. The evidence table itself refutes the claim: Studies A–D exist, including a review of 27 studies. A real gap must be justified by the literature, e.g. "few studies in campus settings".
- "Google shows nothing, so it is a gap" — this confuses a search failure with a gap.
- "Google indexes every paper" — no single search engine or database covers everything, and the search method was the problem.
- "Cite Wikipedia instead" — Wikipedia is for orientation only and does not fix the search.`,
          `**Верно: неудачный поиск — не пробел.** Вставленное целиком предложение почти ничего не находит: ни одна статья не использует именно такую формулировку. Нужно разбить проблему на понятия и синонимы, соединить их AND / OR и искать в Google Scholar, Scopus, IEEE Xplore или ACM. Сама таблица опровергает утверждение: есть Study A–D, включая обзор 27 исследований. Настоящий пробел обосновывают литературой, например: «на кампусах исследований мало».
- «Google shows nothing, so it is a gap» — путает неудачный поиск с пробелом.
- «Google indexes every paper» — ни один поисковик и ни одна база не охватывают всё, а проблема была в способе поиска.
- «Cite Wikipedia instead» — Википедия только для ориентира и поиск не исправляет.`),
        mc("rmv8-a6", "6",
          `DormEats tracks couriers' GPS continuously, also off shift, and shows customers each courier's full name, photo and live position. Which safeguard addresses this most directly?`,
          [
            "Ask couriers to sign a form accepting tracking at all times of the day",
            "Move the GPS data to a faster server so the live map updates instantly",
            "Track only during active deliveries, and show customers no full names",
            "Show the live position only to customers who give couriers five stars",
          ], 2,
          `**Correct: track only during active deliveries and hide full names.** Data minimisation: neither the service nor the study needs couriers' location off shift, and full name plus photo plus live position lets customers find couriers later (Study C).
- "A form accepting tracking at all times" — couriers depend on the job, so such consent is under pressure, and it does not reduce what is collected.
- "A faster server" — improves performance, not protection.
- "Only for five-star customers" — an arbitrary rule that still exposes couriers' identity and location.`,
          `**Верно: отслеживать только во время доставки и не показывать полные имена.** Минимизация данных: ни сервису, ни исследованию не нужно местоположение курьера вне смены, а полное имя, фото и живая позиция позволяют клиентам найти курьера потом (Study C).
- «A form accepting tracking at all times» — курьеры зависят от работы, такое согласие даётся под давлением, и собираемых данных меньше не становится.
- «A faster server» — улучшает скорость, а не защиту.
- «Only for five-star customers» — произвольное правило, личность и местоположение курьера всё равно раскрыты.`),
      ],
    },
    {
      id: "rmv8-b",
      title: PART_B,
      kind: "question",
      points: 7,
      context: partBContext("DormEats"),
      tasks: [
        open("rmv8-b1", "1", 0.5, B.b1("DormEats"),
          [
            "0.25 pts — a development output: something built — the DormEats app, the live courier map, the delivery-time estimate or the courier GPS tracking. A finding given here earns 0.",
            "0.25 pts — a research output: knowledge from the study — e.g. the four-week comparison of 'Where is my order?' messages per order (or satisfaction scores, or delivery times) between live-map blocks and estimated-time blocks. The app, a feature or raw order logs earn 0.",
          ],
          `- **Development output:** the live courier map (and the delivery-time estimate) in the DormEats customer app.
- **Research output:** the four-week comparison of "Where is my order?" messages per order between dormitory blocks with the live map and blocks with only the estimated delivery time.`,
          `Результат разработки — **построенное**: карта с живой позицией курьера и оценка времени доставки в приложении DormEats. Исследовательский результат — **знание**: сравнение числа вопросов «Where is my order?» на заказ за четыре недели между корпусами с картой и корпусами только со временем доставки.
Где теряют баллы: «журнал заказов» назван результатом исследования — это сырые данные; «все клиенты довольны» — утверждение, а не результат.`),
        open("rmv8-b2", "2", 1, B.b2("DormEats"),
          [
            "0.25 pts — current situation: student couriers deliver food from campus cafés to dormitories, and DormEats must decide whether to show customers a live courier map. Neutral — no 'every customer satisfied'.",
            "0.5 pts — a limitation from the table, attributed: e.g. Study A — fewer support messages but only a slight satisfaction rise, one city platform with professional couriers, single-question satisfaction; Study D — small, inconsistent satisfaction effects, single-item measures, few closed communities like campuses, couriers' views rarely included; Study B — tracking confounded with district, time and restaurant quality; Study C — off-shift tracking felt controlling. 0.25 if plausible but not tied to a study; 0 for an opinion or 'no research exists'.",
            "0.25 pts — the need: a campus study comparing the live map with an estimated time only, using support messages and a multi-question satisfaction questionnaire, and considering couriers' privacy.",
          ],
          `DormEats delivers food from campus cafés to dormitories with student couriers and is deciding whether customers should see a live courier map. However, the evidence comes from other settings: Study A tested a city platform with professional couriers and found fewer support messages but only a slight rise in satisfaction measured with one question, and the review in Study D reports small, inconsistent satisfaction effects, few studies in closed communities such as campuses and little attention to couriers. A campus study is therefore needed that compares a live map with an estimated delivery time on support messages and a full satisfaction questionnaire, while considering couriers' privacy.`,
          `(1) **Ситуация**: студенты-курьеры возят еду из кафе кампуса в общежития, стартап решает, показывать ли клиентам карту с курьером. (2) **Ограничение со ссылкой**: Study A — городская платформа с профессиональными курьерами, обращений меньше, а удовлетворённость выросла слегка и измерялась одним вопросом; Study D — эффекты на удовлетворённость небольшие и непостоянные, на кампусах исследований мало, курьеров почти не спрашивали. (3) **Потребность**: сравнение на кампусе — карта против времени доставки, обращения и полноценный опросник, с учётом приватности курьеров.
Где теряют баллы: «исследований нет» как ограничение (0) — таблица это опровергает; «трекинг — будущее доставки» вместо ситуации; ограничение без ссылки (0.25).`),
        open("rmv8-b3", "3", 1, B.b3("DormEats"),
          [
            "0.25 pts — one clear, focused, neutral question (not 'Does tracking improve delivery?', not one that assumes every customer is satisfied).",
            "0.25 pts — the population: DormEats customers living in the campus dormitories.",
            "0.25 pts — the comparison: blocks where customers see the courier's live map vs blocks with only an estimated delivery time.",
            "0.25 pts — a measurable outcome from the planned data, collected in both conditions within four weeks: 'Where is my order?' messages per order, the satisfaction questionnaire score, or delivery time. 'Better delivery' or 'the future of delivery' earn 0 for this line.",
          ],
          `Among DormEats customers living in campus dormitories, how does the number of "Where is my order?" messages per order differ between blocks where customers see the courier's live map and blocks where they see only an estimated delivery time over four weeks?
Population — dormitory customers; comparison — live map vs estimated time only; outcome — support messages per order, recorded the same way in all four blocks.`,
          `Популяция — клиенты DormEats, живущие в общежитиях; сравнение — корпуса с живой картой против корпусов только со временем доставки; результат — число вопросов «Where is my order?» на заказ (подходят также балл опросника или время доставки) за четыре недели.
Где теряют баллы: «улучшает ли доставку» без измерения; «все довольны» — вопрос с готовым ответом; результат, который есть только в одном условии; вопрос о городах, а не о кампусе.`),
        open("rmv8-b4", "4", 0.5, B.b4("DormEats"),
          [
            "0.25 pts — three concept groups joined with AND that match the study — the service (food delivery, last-mile delivery), the feature (order / real-time / GPS tracking) and the outcome (customer satisfaction, uncertainty, experience) — each with at least two synonyms joined with OR inside parentheses.",
            SEARCH_SYNTAX,
          ],
          `= ("food delivery" OR "delivery app" OR "last-mile delivery") AND ("order tracking" OR "real-time tracking" OR "GPS tracking") AND ("customer satisfaction" OR uncertainty OR "customer experience")
Unlike the long sentence typed into Google, this string splits the problem into three concepts with synonyms, so studies such as A, B and D can be found.`,
          `= ("food delivery" OR "delivery app" OR "last-mile delivery") AND ("order tracking" OR "real-time tracking" OR "GPS tracking") AND ("customer satisfaction" OR uncertainty OR "customer experience")
В отличие от длинного предложения в Google, строка разбивает проблему на три понятия с синонимами — так находятся работы вроде A, B и D.
Где теряют баллы: снова длинное предложение; «DormEats» в строке; только AND между одиночными словами; без кавычек у фраз.`),
        open("rmv8-b5", "5", 1.5, B.b5("DormEats"),
          [
            "0.25 pts — risk 1: couriers' GPS tracked continuously, also off shift — location data far beyond what the study and the service need; surveillance of students' private movements (Study C: couriers felt controlled).",
            "0.25 pts — a specific safeguard for risk 1: tracking switches on only during an active delivery and off at hand-over; research data keep delivery times, not location traces; location data deleted after a short fixed period.",
            "0.25 pts — evidence for risk 1: the app's tracking configuration (screenshot or setting), the data-management plan with the retention period, a deletion log.",
            "0.25 pts — risk 2, different from risk 1: customers see couriers' full names, photos and live position — couriers can be identified and contacted after delivery (Study C); or customers' room numbers stored and visible beyond need; or couriers, as student workers, may feel pressure to take part.",
            "0.25 pts — a specific safeguard for risk 2: customers see only a first name or courier number and an approximate position; contact goes through the app; room numbers visible only to the assigned courier and deleted after delivery; couriers' participation voluntary and unrelated to shifts or pay.",
            "0.25 pts — evidence for risk 2: a screenshot of the customer view, the access-control list, signed courier consent forms or the ethics-approval reference. A safeguard without a record earns 0 for this line.",
          ],
          `- **Risk 1 — continuous off-shift tracking of couriers.** The app follows students' private movements, which neither the study nor the deliveries need. **Safeguard:** GPS switches on only during an active delivery and off at hand-over; location traces are deleted after 30 days and not used in the research data. **Evidence:** a screenshot of the tracking setting and the retention rule in the data-management plan, with a deletion log.
- **Risk 2 — couriers' identity exposed to customers.** Full names, photos and live position let customers find couriers later, as happened in Study C. **Safeguard:** customers see only a first name and the courier's position near their own block, and all contact goes through the app. **Evidence:** a screenshot of the revised customer view and the access-control list for courier profiles.`,
          `- Риск 1: геолокация курьеров пишется постоянно, в том числе вне смены, — это слежка за личными перемещениями студентов, не нужная ни сервису, ни исследованию. Мера: GPS включается только на время доставки и выключается при передаче заказа; треки удаляются через 30 дней и не входят в исследовательские данные. Доказательство: скриншот настройки трекинга, правило хранения в плане управления данными, журнал удаления.
- Риск 2: клиенты видят полное имя, фото и живую позицию курьера — его можно найти после доставки (как в Study C). Мера: клиент видит только имя и примерное положение курьера у своего корпуса, связь — только через приложение. Доказательство: скриншот нового экрана клиента, список доступа к профилям курьеров.
Где теряют баллы: «курьеры подписали договор — значит, можно следить всегда»; «данные хранятся на защищённом сервере» без сокращения сбора; мера без записи.`),
        open("rmv8-b6", "6", 1.5, B.b6(),
          [
            SYNTHESIS_THEMES,
            "0.5 pts — the methodological contrast: A is randomised but on one city platform with a single satisfaction question; B is an observational order analysis confounded by district, time and restaurant quality; C is qualitative and shows the couriers' side; D is a secondary review limited by single-item measures and few campus settings.",
            "0.5 pts — an overall conclusion with limitations: tracking mainly reduces customers' uncertainty, not delivery time; satisfaction gains are small or uncertain; the cost to couriers' privacy is under-studied, especially on campuses.",
          ],
          `The studies agree that live tracking mainly changes how certain customers feel, not how fast food arrives. Study A and the review in Study D both found less uncertainty — fewer "Where is my order?" messages in A — while delivery times did not change and satisfaction rose only slightly or inconsistently. Study B's higher ratings for tracked orders look stronger, but tracking there depended on district and time and restaurant quality was not controlled, so the ratings may reflect other differences. Measurement is a shared weakness: A and most studies in D used a single satisfaction question. Study C adds the side the customer studies leave out: couriers accept tracking during shifts but feel controlled off shift and have been contacted after deliveries. Overall, tracking appears to reduce uncertainty at a privacy cost to couriers that is rarely studied, and campus settings are almost absent.`,
          `Синтез по темам: (1) **неуверенность, а не скорость** — A и D показывают меньше неуверенности, время доставки не меняется, удовлетворённость растёт слабо или непостоянно; (2) **слабость B** — трекинг зависел от района и времени, качество ресторанов не учтено (вмешивающиеся факторы); (3) **общая проблема измерения** — один вопрос об удовлетворённости в A и большинстве работ D; (4) **сторона курьеров из C** — слежка вне смены и контакты клиентов после доставки; (5) **вывод с ограничениями** — трекинг снижает неуверенность ценой приватности курьеров, а кампусов в исследованиях почти нет.
Где теряют баллы: пересказ по очереди; B как доказательство причины; не замечено, что время доставки не меняется.`),
        open("rmv8-b7", "7", 1, B.b7("DormEats"),
          [
            "0.5 pts — a gap from the table, cited: e.g. few studies in closed communities such as campuses (D; A used a city platform), single-item satisfaction measures (A, D), or couriers' perspectives rarely included (D, C). Stated as limited evidence — 'no research exists', the team's own draft claim, earns 0 — and a gap not linked to the table earns 0 for this line.",
            "0.5 pts — how this study addresses it: a four-week comparison in campus dormitory blocks (live map vs estimated time only) with support messages and a full satisfaction questionnaire, plus attention to student couriers (e.g. their working hours or views). A bare 'the study will fill the gap' earns 0.",
          ],
          `Research on delivery tracking exists — the review in Study D covers 27 studies — but few of them are set in closed communities such as campuses, most measure satisfaction with a single question, and couriers' views are rarely included. It therefore remains unclear whether a live courier map reduces uncertainty and improves satisfaction in a campus service where customers, couriers and cafés are close together. The proposed study addresses this by comparing dormitory blocks with and without the live map over four weeks, using support messages and a full satisfaction questionnaire, and by collecting couriers' working hours (and ideally their views) alongside the customer data.`,
          `Исследования о трекинге есть — обзор D охватывает 27 работ, — но на кампусах их **мало**, удовлетворённость обычно меряют одним вопросом, а курьеров почти не спрашивают. Это и есть пробел контекста и измерения. Исследование закрывает его: корпуса общежитий с картой и без неё, обращения в поддержку и полноценный опросник, плюс данные о часах работы курьеров (а лучше и их мнения).
Где теряют баллы: повторить фразу из черновика «исследований нет» (0); пробел без ссылки на таблицу; не объяснено, как дизайн закрывает пробел.`),
      ],
    },
  ],
};

export const rmMocks: MockExam[] = [v1, v2, v3, v4, v5, v6, v7, v8];
