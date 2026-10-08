import type { Term, Text } from "../types";

const t = (term: string, en: string, ru: string): Term => ({ term, def: { en, ru } });

/** Глоссарий курса (лекции 1–5 и формат квиза-кейса) — он же колода карточек «термин → определение». */
export const glossary: Term[] = [
  // Лекция 1: что такое исследование
  t("Research", "A systematic, creative and critical process for finding verifiable answers, solving real problems and building credible, reproducible knowledge.", "Систематический, творческий и критический процесс поиска проверяемых ответов, решения реальных задач и создания достоверного, воспроизводимого знания."),
  t("Critical skepticism", "Not trusting data, benchmarks or claims blindly: checking the method, the conditions and the sample size first.", "Не доверять данным, бенчмаркам и утверждениям вслепую: сначала проверять метод, условия и размер выборки."),
  t("Methodological rigour", "Documenting every step of data collection and analysis so that others can reproduce the result.", "Документирование каждого шага сбора и анализа данных так, чтобы другие могли воспроизвести результат."),
  t("Narrowing a topic", "Turning a broad area into a bounded problem that names what is compared, what is measured and under which conditions.", "Превращение широкой области в ограниченную задачу, где названо, что сравнивают, что измеряют и при каких условиях."),
  t("Feasibility matrix", "Three hard filters for a topic: data accessibility, infrastructure requirements and time constraints.", "Три жёстких фильтра для темы: доступ к данным, требования к инфраструктуре и ограничения по времени."),
  t("Source credibility tiers", "Tier 1 — peer-reviewed journals and conferences; Tier 2 — official whitepapers and documentation; Tier 3 — blogs, videos, tweets (avoid in a review).", "Уровень 1 — рецензируемые журналы и конференции; уровень 2 — официальные whitepaper и документация; уровень 3 — блоги, видео, твиты (в обзоре избегать)."),
  t("Peer-reviewed", "Evaluated by independent experts before publication; the highest credibility tier.", "Оценено независимыми экспертами до публикации; высший уровень достоверности."),
  t("Extraction table", "A table that records each paper's reference, problem, method and data, results, limitations and relevance or gap.", "Таблица, где для каждой статьи записаны ссылка, проблема, метод и данные, результаты, ограничения и связь с пробелом."),
  // Лекция 2: проблема, поиск, пробел, вопрос
  t("Research-based statement", "A claim supported by cited academic evidence, as opposed to an opinion such as 'Kazakh LLMs are bad'.", "Утверждение, подкреплённое цитируемыми академическими доказательствами, в отличие от мнения вроде «казахские LLM плохие»."),
  t("Research problem", "The specific issue that needs investigation: what is happening, what is not known, who is affected and why it matters.", "Конкретная проблема, которую нужно исследовать: что происходит, что неизвестно, кого это касается и почему это важно."),
  t("Problem statement", "Three parts: the current situation, a limitation supported by the literature, and the need for specific evidence.", "Три части: текущая ситуация, ограничение с опорой на литературу и потребность в конкретных доказательствах."),
  t("Development output", "A built artefact that works — an app, prototype, model or dashboard; judged by testing against requirements.", "Созданный работающий артефакт — приложение, прототип, модель или дашборд; оценивается тестированием по требованиям."),
  t("Research output", "New, evidence-based knowledge that answers the research question — findings presented in a report or paper.", "Новое знание, основанное на доказательствах и отвечающее на исследовательский вопрос, — результаты в отчёте или статье."),
  t("Concepts and synonyms", "The core ideas of a problem, each with alternative terms — the building blocks of a search query.", "Ключевые идеи проблемы, у каждой — альтернативные термины; из них строится поисковый запрос."),
  t("Boolean AND", "Joins different concepts: every result must contain both, so the search narrows.", "Соединяет разные понятия: каждый результат должен содержать оба, поэтому поиск сужается."),
  t("Boolean OR", "Joins synonyms of one concept: any of them may match, so the search broadens.", "Соединяет синонимы одного понятия: подходит любой, поэтому поиск расширяется."),
  t("Phrase search (\" \")", "Quotation marks make the database find that exact multi-word phrase.", "Кавычки заставляют базу искать именно эту многословную фразу."),
  t("Balanced search string", "Two or three concept groups in brackets, synonyms joined by OR, groups joined by AND, phrases in quotation marks — neither one word nor the whole RQ.", "Две-три группы понятий в скобках, синонимы через OR, группы через AND, фразы в кавычках — не одно слово и не весь RQ."),
  t("Screening protocol", "Title → abstract → keywords → conclusion → full reading only if relevant: search wide, screen fast, read deeply.", "Название → аннотация → ключевые слова → вывод → полное чтение, только если релевантно: искать широко, отсеивать быстро, читать глубоко."),
  t("Evidence matrix", "A comparison table of papers: problem, method, data, main finding, limitation and what is missing.", "Таблица сравнения статей: проблема, метод, данные, главный результат, ограничение и чего не хватает."),
  t("Synthesis", "Making sources talk to each other — agreements, contradictions, shared limitations and what none of them studied — instead of summarising them one by one.", "Сведение источников в диалог — согласия, противоречия, общие ограничения и то, чего не изучил никто, — вместо пересказа по одному."),
  t("Research gap", "Something important that previous research has not adequately answered, tested or studied in a specific context, justified by the literature.", "Нечто важное, на что прежние исследования не ответили, не проверили или не изучили в конкретном контексте, обоснованное литературой."),
  t("Population / context gap", "A question studied in one group or setting (e.g. taxi drivers, English) but not in the one that matters (long-haul drivers, Kazakh).", "Вопрос изучен в одной группе или среде (например, таксисты, английский), но не в нужной (дальнобойщики, казахский)."),
  t("Method gap", "A topic studied mostly one way (e.g. surveys) with little evidence from other designs such as experiments.", "Тема изучена в основном одним способом (например, опросами), а доказательств от других дизайнов, например экспериментов, мало."),
  t("Contradiction gap", "Studies report conflicting results and the reasons for the disagreement have not been explained.", "Исследования дают противоречивые результаты, и причины расхождения не объяснены."),
  t("Evaluation / data gap", "Existing studies use limited datasets, inconsistent definitions or measures, or short follow-up, so the evidence cannot be generalised.", "Работы используют ограниченные данные, несогласованные определения или меры, короткое наблюдение, поэтому доказательства нельзя обобщить."),
  t("Gap signal words", "'However', 'limited', 'few studies', 'remains unclear', 'future work' — clues that need verification, not proof of a gap.", "«However», «limited», «few studies», «remains unclear», «future work» — подсказки, которые нужно проверить, а не доказательство пробела."),
  t("Future work", "Authors' suggestions for next studies; before claiming one as your gap, check that it was not done since, fits your problem and is feasible.", "Предложения авторов о следующих исследованиях; прежде чем считать это своим пробелом, проверить, что это не сделано позже, относится к проблеме и выполнимо."),
  t("Research question (RQ)", "One precise question that guides the study: clear, focused, researchable, feasible and connected to the problem; it names population, factor or comparison, and outcome.", "Один точный вопрос, ведущий исследование: ясный, сфокусированный, исследуемый, выполнимый и связанный с проблемой; называет популяцию, фактор или сравнение и исход."),
  t("Researchable", "Evidence can be collected to answer the question; a question answered by a definition ('What is AI?') is not researchable.", "Для ответа можно собрать доказательства; вопрос, на который отвечает определение («What is AI?»), не исследуемый."),
  t("Feasible", "The study can realistically be done: the data can be obtained and the time, computing, skills, ethics and scope fit.", "Исследование реально выполнить: данные можно получить, а время, вычисления, навыки, этика и объём укладываются в рамки."),
  t("Research aim", "One sentence stating what the study intends to achieve; it follows from the gap and leads to the RQ.", "Одно предложение о том, чего исследование хочет достичь; следует из пробела и ведёт к RQ."),
  // Лекция 3: этика, проверка источников, Mendeley
  t("Research integrity", "Two responsibilities: credible knowledge (accurate data, transparent methods, verifiable sources) and protection of people.", "Две обязанности: достоверное знание (точные данные, прозрачные методы, проверяемые источники) и защита людей."),
  t("Fabrication", "Inventing data, participants, results or references that never existed.", "Выдумывание данных, участников, результатов или ссылок, которых не было."),
  t("Falsification", "Changing, selecting or hiding data or procedures so that findings are misrepresented, including misleading omission.", "Изменение, отбор или сокрытие данных и процедур, искажающее результаты, в том числе умолчание, вводящее в заблуждение."),
  t("Plagiarism", "Using another person's words, ideas or data without attribution; paraphrasing still needs a citation.", "Использование чужих слов, идей или данных без указания автора; парафраз тоже требует ссылки."),
  t("Questionable research practices", "Practices below obvious fraud that still mislead: cherry-picking, hidden limits, duplication, gift authorship.", "Практики ниже явного мошенничества, которые всё же вводят в заблуждение: выборочная отчётность, скрытые ограничения, дублирование, подарочное авторство."),
  t("Cherry-picking", "Reporting only the metric, run or subgroup that supports the claim.", "Сообщать только ту метрику, прогон или подгруппу, которые подтверждают утверждение."),
  t("Disclosure test", "Would a reasonable reader decide differently if this were disclosed? If yes, it must be disclosed.", "Решил бы разумный читатель иначе, если бы это раскрыли? Если да — это нужно раскрыть."),
  t("Patchwriting", "Swapping a few words while keeping the source's structure — a learning stage, not acceptable final prose.", "Замена нескольких слов с сохранением структуры источника — этап обучения, но не допустимый итоговый текст."),
  t("Paraphrase", "A source's idea rebuilt in your own words and structure, with a citation.", "Идея источника, пересобранная своими словами и своей структурой, со ссылкой."),
  t("Reflexivity", "Making your own expectations, biases and decisions visible instead of pretending to be neutral.", "Делать видимыми собственные ожидания, предубеждения и решения, а не изображать нейтральность."),
  t("Informed consent", "An ongoing process: participants understand, choose freely, can withdraw and can ask; it must match what really happens to the data.", "Продолжающийся процесс: участники понимают, выбирают свободно, могут выйти и задать вопросы; согласие должно соответствовать тому, что реально происходит с данными."),
  t("Confidentiality", "The research team knows who the participants are but controls access and disclosure.", "Команда знает, кто участники, но контролирует доступ и раскрытие."),
  t("Anonymity", "A response cannot reasonably be linked to a person, or identifiers are irreversibly removed.", "Ответ нельзя разумным способом связать с человеком, или идентификаторы удалены необратимо."),
  t("Pseudonymisation", "Replacing names with codes while a separate key still links them — it gives confidentiality, not anonymity.", "Замена имён кодами при сохранении отдельного ключа — даёт конфиденциальность, а не анонимность."),
  t("Data lifecycle", "Collect only what is needed → store securely → named access → justified retention → delete or share, with a record.", "Собрать только нужное → безопасно хранить → поимённый доступ → обоснованный срок хранения → удалить или передать, с записью."),
  t("Data minimisation", "Collecting only the data the research question needs; continuous video to measure a fatigue score breaks it.", "Сбор только тех данных, которые нужны вопросу; непрерывное видео ради балла усталости нарушает этот принцип."),
  t("Safeguard", "A concrete action that reduces a specific risk, e.g. video off by default with no frames stored — not a wish such as 'be careful'.", "Конкретное действие, снижающее определённый риск, например видео выключено по умолчанию и кадры не хранятся, — а не пожелание «быть аккуратными»."),
  t("Evidence record", "The document that proves a safeguard was applied: signed consent forms, an approval letter, an access list, a deletion log.", "Документ, доказывающий, что мера применена: подписанные формы согласия, письмо об одобрении, список доступа, журнал удаления."),
  t("Ethics card", "Data · People · Risk · Safeguard · Evidence — one line each, so that every risk has an action and a record.", "Data · People · Risk · Safeguard · Evidence — по строке на каждое, чтобы у каждого риска были действие и запись."),
  t("Ethics approval", "Review by the ethics committee before data collection with people; a change after approval needs an amendment first.", "Рассмотрение этическим комитетом до сбора данных с участием людей; изменение после одобрения требует поправки заранее."),
  t("Verification ladder", "Read → match the publisher record → resolve the DOI or Crossref entry → check corrections and retractions → open and check that it supports the claim.", "Прочитать → сверить с записью издателя → проверить DOI или Crossref → проверить исправления и отзывы → открыть и убедиться, что источник подтверждает утверждение."),
  t("DOI", "Digital Object Identifier — a persistent identifier that supports traceability; it says nothing about quality, and a missing DOI is not a missing source.", "Digital Object Identifier — постоянный идентификатор для прослеживаемости; о качестве ничего не говорит, а отсутствие DOI не означает отсутствия источника."),
  t("Crossref", "A DOI metadata registry (search.crossref.org) used to check a work by title, author or DOI.", "Реестр метаданных DOI (search.crossref.org), где работу проверяют по названию, автору или DOI."),
  t("Retraction", "Withdrawal of a published paper because of serious error or misconduct; a retracted paper is not cited as evidence.", "Отзыв опубликованной статьи из-за серьёзной ошибки или нарушения; отозванную статью не цитируют как доказательство."),
  t("Predatory journal", "A venue that charges authors but skips genuine peer review; a DOI or an impressive name does not guarantee quality.", "Издание, которое берёт плату с авторов, но не проводит настоящего рецензирования; DOI или громкое название не гарантируют качества."),
  t("AI verification contract", "No source until opened, no claim without evidence, no secret data in unapproved tools, no hidden AI role.", "Ни одного источника без открытия, ни одного утверждения без доказательств, никаких закрытых данных в неодобренных инструментах, никакой скрытой роли ИИ."),
  t("Mendeley", "A reference manager: import → verify metadata → organise → annotate → cite in Word; it does not verify sources for you.", "Менеджер ссылок: импорт → проверка метаданных → организация → аннотации → цитирование в Word; источники он за вас не проверяет."),
  t("Gift authorship", "Listing someone as an author without a real contribution; it misrepresents responsibility for the work.", "Включение в авторы без реального вклада; искажает ответственность за работу."),
  // Лекция 4: обзор литературы и план
  t("Literature review", "An analysis and synthesis of existing research — what is known, how it was studied, where studies agree or disagree and what remains unknown; not a list or a summary.", "Анализ и синтез существующих исследований — что известно, как изучали, где работы согласны или спорят и что остаётся неизвестным; не список и не пересказ."),
  t("Primary source", "Original research reported by the people who conducted it.", "Оригинальное исследование, описанное теми, кто его провёл."),
  t("Secondary source", "A work that reviews, analyses or summarises primary research — a review article or a textbook chapter.", "Работа, которая обозревает, анализирует или обобщает первичные исследования, — обзорная статья или глава учебника."),
  t("Systematic review", "A secondary source that searches and appraises studies on one question by an explicit, repeatable procedure.", "Вторичный источник, который ищет и оценивает исследования по одному вопросу по явной, повторяемой процедуре."),
  t("Research plan", "A logical plan for turning an RQ into evidence: evidence needed, data source, collection method, procedure, analysis, feasibility.", "Логичный план превращения RQ в доказательства: нужные доказательства, источник данных, способ сбора, процедура, анализ, выполнимость."),
  t("Alignment", "Every element connects to the previous one: problem → RQ → literature → gap → aim → evidence → method → data → answer.", "Каждый элемент связан с предыдущим: проблема → RQ → литература → пробел → цель → доказательства → метод → данные → ответ."),
  // Лекция 5: методология
  t("Methodology", "The overall logic that justifies how knowledge will be produced and why certain methods fit the RQ.", "Общая логика, обосновывающая, как будет получено знание и почему определённые методы подходят к RQ."),
  t("Method", "A concrete technique for collecting or analysing evidence — a survey, interview, experiment or benchmark.", "Конкретный приём сбора или анализа доказательств — опрос, интервью, эксперимент или бенчмарк."),
  t("Quantitative research", "Works with numbers: measurement, comparison and statistics; answers how much, how often, is there a difference or relationship.", "Работает с числами: измерение, сравнение и статистика; отвечает на вопросы «сколько», «как часто», «есть ли разница или связь»."),
  t("Qualitative research", "Works with words and meanings: experiences, contexts and themes; answers how and why people experience something.", "Работает со словами и смыслами: опыт, контекст и темы; отвечает, как и почему люди что-то переживают."),
  t("Mixed methods", "Collecting and analysing both quantitative and qualitative data in one study and integrating them to answer the RQ.", "Сбор и анализ и количественных, и качественных данных в одном исследовании с их интеграцией для ответа на RQ."),
  t("Operationalisation", "Turning an abstract concept into a measurable indicator: 'performance' → task completion time in minutes.", "Превращение абстрактного понятия в измеримый показатель: «performance» → время выполнения задачи в минутах."),
  t("Independent variable", "The factor the researcher changes, manipulates or groups by — e.g. app vs paper checklist.", "Фактор, который исследователь меняет или по которому делит группы, — например, приложение или бумажный чек-лист."),
  t("Dependent variable", "The outcome that is measured — e.g. the score on a validated fatigue scale.", "Измеряемый исход — например, балл по валидированной шкале усталости."),
  t("Confounder", "A third factor linked to both the factor and the outcome that can create a false association, such as baseline sleep.", "Третий фактор, связанный и с фактором, и с исходом, который может создать ложную связь, например исходный сон."),
  t("Correlation vs causation", "An association between two variables does not show that one causes the other; causal claims need an appropriate design.", "Связь двух переменных не показывает, что одна вызывает другую; причинные выводы требуют подходящего дизайна."),
  t("Hypothesis", "A testable expectation about a difference or relationship, stated before the data; exploratory studies may not need one.", "Проверяемое ожидание о разнице или связи, сформулированное до данных; поисковым исследованиям она может быть не нужна."),
  t("Randomised design", "Participants are assigned to conditions by chance, which balances other factors and supports causal claims best.", "Участников распределяют по условиям случайно; это уравновешивает прочие факторы и лучше всего поддерживает причинные выводы."),
  t("Observational design", "Variables are measured as they occur, without assigning conditions; it shows associations, not causes.", "Переменные измеряют так, как они есть, без назначения условий; показывает связи, а не причины."),
  t("Deductive reasoning", "From theory to hypothesis to data that confirm or challenge it; often associated with quantitative research.", "От теории к гипотезе и к данным, которые её подтверждают или опровергают; чаще связано с количественными исследованиями."),
  t("Inductive reasoning", "From data to patterns, categories and a possible explanation; often associated with qualitative research.", "От данных к закономерностям, категориям и возможному объяснению; чаще связано с качественными исследованиями."),
  t("Thematic analysis", "Reading qualitative data repeatedly, coding it and grouping codes into themes that emerge from the data.", "Многократное чтение качественных данных, кодирование и объединение кодов в темы, возникающие из данных."),
  t("Think-aloud", "An observation method in which participants say their reasoning aloud while doing a task.", "Метод наблюдения, при котором участники вслух проговаривают свои рассуждения во время задачи."),
  t("Credibility strategies", "How qualitative rigour is shown: member checking, thick description and an audit trail of analytical decisions.", "Как показывают строгость качественного исследования: проверка участниками, плотное описание и аудиторский след аналитических решений."),
  t("Sampling frame", "The actual list a sample is drawn from, e.g. a register of licensed truck drivers.", "Реальный список, из которого берут выборку, например реестр водителей с лицензией."),
  t("Random assignment", "Deciding by chance who gets which condition; it is not random sampling, which decides who enters the study.", "Случайное решение, кто получает какое условие; это не случайная выборка, которая решает, кто попадает в исследование."),
  t("Purposive sampling", "Choosing information-rich participants on purpose, often until saturation, when new interviews add no new themes.", "Намеренный выбор участников, богатых информацией, часто до насыщения — пока новые интервью не перестают давать новые темы."),
  // Формат квиза-кейса
  t("Evidence table", "The case's list of Studies A–D with design, sample, finding and limitation — the only literature allowed in the answers.", "Список Study A–D в кейсе с дизайном, выборкой, результатом и ограничением — единственная литература, допустимая в ответах."),
  t("Unsupported claim", "A statement presented as fact without evidence, e.g. 'The app will definitely reduce accidents'.", "Утверждение, поданное как факт без доказательств, например «The app will definitely reduce accidents»."),
  t("Self-reported data", "Data that participants report about themselves; numbers stay quantitative, but recall and social desirability lower reliability.", "Данные, которые участники сообщают о себе; числа остаются количественными, но память и желание выглядеть лучше снижают надёжность."),
  t("Validated scale", "A questionnaire scale tested for reliability and validity, so the same outcome is measured the same way in every group.", "Шкала-опросник, проверенная на надёжность и валидность, чтобы один и тот же исход измерялся одинаково во всех группах."),
  t("Self-selection", "Participants choose their own exposure (e.g. how often to respond to alerts), so groups may differ in ways that explain the result.", "Участники сами выбирают воздействие (например, как часто реагировать на сигналы), поэтому группы могут различаться так, что это объясняет результат."),
  t("Attrition", "Participants dropping out during a study; if it is high or uneven between groups, results can be biased.", "Выбывание участников во время исследования; если оно велико или неравномерно между группами, результаты искажаются."),
];

/** Шпаргалка на одну страницу — то, что стоит перечитать за пять минут до квиза. */
export const cheatSheet: Text = {
  en: `## The quiz: 10 points, only the case
- Part A: 6 × 0.5 — the issue in a course term + evidence from the case, one or two sentences.
- Part B: B1 0.5 · B2 1 · B3 1 · B4 0.5 · B5 1.5 · B6 1.5 · B7 1. Time ≈ 4 minutes per point in a 40-minute quiz.
- Use only the case and Studies A–D, cite them by letter, hedge: may, suggests, remains unclear.
## Key definitions
- **Development output** — a built artefact (app, prototype). **Research output** — evidence-based knowledge that answers the RQ. Data are neither.
- **Unsupported claim** — a result stated without evidence ("will definitely reduce accidents").
- **Research gap** — something important still unknown in a specific context, justified by the literature; never "no research exists".
- **FFP** — fabrication (inventing), falsification (distorting), plagiarism (taking). Unopened AI references risk fabrication.
- **Confidentiality** (the team knows identities, controls access) ≠ **anonymity** (no reasonable link to a person).
- **DOI** — an identifier, not a quality badge; a missing DOI is not a missing source.
## Templates
= Problem: Current situation: … Limitation: However, Study X found … Need: Therefore, evidence is needed on whether …
= RQ: Among [population], does [factor], compared with [comparison], change [measurable outcome] over [time]?
= Search: ("term A" OR synonym) AND ("term B" OR synonym) AND ("term C" OR synonym)
= Synthesis: Findings: A and B both … yet D … Methods: only A … whereas B … Limitations: A and D … Overall: … remains unclear.
= Gap: We know … However … It remains unclear whether … The proposed study could address this by …
= Ethics: Risk (whose data, what harm) → Safeguard (an action) → Record (consent forms, approval letter, access list, deletion log)
## Quantitative vs qualitative
- **Quantitative:** numbers, measurement, comparison, statistics; how much, how often, is there a difference; often deductive.
- **Qualitative:** words and meanings, experience, themes; how and why; often inductive; small purposive samples.
- Self-reported numbers are still quantitative. Randomised supports cause; observational shows association only.
- The method follows the RQ: question → evidence → data → method.
## Quiz checklist
- A: six answers, each with a term and a reason from the case.
- B1: the app is the development output; findings are the research output.
- B2: three labelled parts and at least one study letter.
- B3: one question with population, comparison and a measurable outcome the case collects.
- B4: quotation marks, brackets, AND between concepts, OR between synonyms, every bracket closed.
- B5: two different risks, each with a safeguard and a record.
- B6: by findings, methods, limitations — not four summaries.
- B7: "remains unclear" plus why the study fits; never "no research exists".
- One thread: the outcome in the RQ is the outcome in the need, the synthesis and the gap.`,
  ru: `## Квиз: 10 баллов, только кейс
- Часть A: 6 × 0.5 — проблема термином курса + довод из кейса, одно-два предложения.
- Часть B: B1 0.5 · B2 1 · B3 1 · B4 0.5 · B5 1.5 · B6 1.5 · B7 1. Время ≈ 4 минуты на балл при квизе в 40 минут.
- Только кейс и Study A–D, ссылки по буквам, осторожные формулировки: may, suggests, remains unclear.
## Ключевые определения
- **Development output** — созданный артефакт (приложение, прототип). **Research output** — знание на доказательствах, отвечающее на RQ. Данные — ни то ни другое.
- **Unsupported claim** — результат, заявленный без доказательств («will definitely reduce accidents»).
- **Research gap** — нечто важное, ещё неизвестное в конкретном контексте и обоснованное литературой; никогда не «исследований нет».
- **FFP** — fabrication (выдумывание), falsification (искажение), plagiarism (присвоение). Неоткрытые ссылки от ИИ — риск фабрикации.
- **Confidentiality** (команда знает личности, контролирует доступ) ≠ **anonymity** (связать ответ с человеком нельзя).
- **DOI** — идентификатор, а не знак качества; нет DOI — ещё не значит, что нет источника.
## Шаблоны
= Problem: Current situation: … Limitation: However, Study X found … Need: Therefore, evidence is needed on whether …
= RQ: Among [population], does [factor], compared with [comparison], change [measurable outcome] over [time]?
= Search: ("term A" OR synonym) AND ("term B" OR synonym) AND ("term C" OR synonym)
= Synthesis: Findings: A and B both … yet D … Methods: only A … whereas B … Limitations: A and D … Overall: … remains unclear.
= Gap: We know … However … It remains unclear whether … The proposed study could address this by …
= Ethics: Risk (whose data, what harm) → Safeguard (an action) → Record (consent forms, approval letter, access list, deletion log)
## Количественное и качественное
- **Количественное:** числа, измерение, сравнение, статистика; сколько, как часто, есть ли разница; чаще дедуктивное.
- **Качественное:** слова и смыслы, опыт, темы; как и почему; чаще индуктивное; небольшие целевые выборки.
- Числа из самоотчёта остаются количественными. Рандомизация поддерживает причинность; наблюдение показывает только связь.
- Метод следует за RQ: вопрос → доказательства → данные → метод.
## Чек-лист на квиз
- A: шесть ответов, в каждом — термин и довод из кейса.
- B1: приложение — development output; результаты — research output.
- B2: три подписанные части и хотя бы одна буква исследования.
- B3: один вопрос с популяцией, сравнением и измеримым исходом, который кейс собирает.
- B4: кавычки, скобки, AND между понятиями, OR между синонимами, все скобки закрыты.
- B5: два разных риска, у каждого — мера защиты и запись.
- B6: по findings, methods, limitations — не четыре пересказа.
- B7: «remains unclear» и почему исследование подходит; никогда «no research exists».
- Одна нить: исход в RQ — тот же, что в потребности, синтезе и пробеле.`,
};
