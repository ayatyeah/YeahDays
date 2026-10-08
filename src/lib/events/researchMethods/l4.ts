import { part, qx, tfx, type Lecture } from "../types";

/**
 * Лекция 4 RMT: обзор литературы и план исследования. Упор на то, что
 * проверяет реальный квиз (кейс SafeDrive): сбалансированная поисковая
 * строка, аналитический абзац-синтез по Studies A–D и какие типы
 * исследований дают качественные и количественные данные.
 */
export const lecture4: Lecture = {
  id: "rm-l4",
  title: { en: "Lecture 4 — Literature review and designing a research plan", ru: "Лекция 4 — Обзор литературы и план исследования" },
  parts: [
    part(
      "rm-l4-p1",
      { en: "Why review the literature: sources and kinds of evidence", ru: "Зачем нужен обзор литературы: источники и виды доказательств" },
      {
        en: `## Literature before the lab
"I have a great research idea — can I start my experiment immediately?" **Not yet.** First find out what is already known: **the literature comes before the lab.**
Hypothetical story: a student spends **3 months, 500 hours** and a lot of GPU time on an experiment — and then finds a paper published two years earlier with almost the same experiment, methods, data and conclusions. What went wrong? The existing literature was never checked.
> The Week 4 question: you already have a research question (RQ) — how do you know someone has not already answered it?
## What a literature review is — and is not
A **literature review** is an **analysis and synthesis of existing research**. It is **not** a list of papers, **not** a summary of papers one by one and **not** a bibliography. It examines:
- what is known and **how it was studied** (methods, data, participants);
- **what was found**;
- where studies **agree or disagree**;
- what **limitations** exist;
- what **remains unknown**.
| It is NOT | It IS |
|---|---|
| a list of papers or a bibliography | an analysis of what the papers show together |
| "Paper A says X. Paper B says Y." | "A and B agree on X; C differs, possibly because…" |
| background reading to fill pages | the argument for why your study is needed |
## Six reasons it matters
- **Understand** what is already known.
- **Avoid unnecessary duplication** — the 3-months story.
- **Identify existing methods, datasets, benchmarks and metrics** to reuse or compare against.
- **Discover contradictions and limitations** in prior work.
- **Justify** your own research.
- **Identify a possible research gap.**
## The funnel from question to gap
My RQ → What is already known? → How was it studied? → What was found? → Where do studies agree? → Where do they disagree? → What are the limitations? → What is still unknown? → **Research gap**.
Every step is a question you must be able to answer about the literature **before** you can claim a gap.
## Information vs evidence
Ask not only "what does it say?" but **"where does the claim come from?"** Trace every important claim to its **original scholarly source**.
| Group | Examples | Role in academic work |
|---|---|---|
| Informal | blog, Wikipedia, YouTube, ChatGPT summary | orientation only; not evidence |
| Educational | textbook, technical documentation | definitions, background, how a tool works |
| Scholarly | research article, conference paper, systematic review | evidence for academic claims |
## Primary vs secondary sources
- **Primary source** — original research: the authors **conducted and reported the study themselves**, e.g. they ran an experiment and published the results. Closest to the evidence.
- **Secondary source** — **analyses, reviews or synthesises** primary research: review articles, **systematic reviews**, textbook chapters, summaries. Good for orientation; for important claims **check the originals**.
> Exam trap: a systematic review in a peer-reviewed journal is scholarly **and** secondary. "Peer-reviewed" is about quality control; "primary" is about who did the study.
## Source detective
| Source | Verdict |
|---|---|
| Blog: "LLMs are 95% accurate", no citation, no method | not usable: the claim cannot be traced |
| Peer-reviewed paper with documented method, dataset and reproducible results | the best evidence (primary) |
| Wikipedia paragraph | orientation; follow its references to the original |
| Systematic review in a peer-reviewed journal | strong (secondary); check the key originals |
| AI-generated summary with no citation | not verifiable; never cite it as evidence |
## Which study gives which data
Evidence summaries in a case (like Study A–D in the SafeDrive quiz) describe different **study types**. Know what data each one produces:
| Study type | What the researchers do | Data | What it can show |
|---|---|---|---|
| Interview study | talk to people, record and code their answers | **qualitative** — words, themes, experiences | **why** and **how** people think and act |
| Randomised controlled trial (RCT) | randomly assign people to an intervention or a control group, then measure an outcome | **quantitative** — rates, times, scores | whether X **causes** a change in Y |
| Observational study | measure groups that already exist, without assigning anything | **quantitative** — counts, rates | an **association**; other differences between the groups (confounders) may explain it |
| Systematic review | search, screen and combine earlier studies by an explicit protocol | **secondary**; usually pooled numbers | the overall pattern across many studies |
- **Qualitative data** — text and meaning: interview transcripts, focus groups, open-ended answers.
- **Quantitative data** — numbers you count or measure: accident rates, reaction times, accuracy.
> Exam trap: in an evidence summary, "observational study" means the researchers did not assign the groups (e.g. they compared trucks with and without a system). It counts things, so its data are **quantitative**. Of the four classic study types, only the **interview** study gives qualitative data.
?? Which study type tells you why drivers switch off a fatigue alarm, and what data does it give?
?= An interview study: qualitative data (drivers' reasons and experiences). An RCT or an observational study would only count how often something happens.
?? Why is a systematic review a secondary source even though it is peer-reviewed?
?= Its authors did not run the studies; they searched, screened and combined primary studies done by others.`,
        ru: `## Литература раньше лаборатории
«У меня отличная идея — можно сразу начинать эксперимент?» **Пока нет.** Сначала нужно выяснить, что уже известно: **литература идёт раньше лаборатории (the literature comes before the lab).**
Гипотетическая история: студент тратит **3 месяца, 500 часов** и много GPU-времени на эксперимент — а потом находит статью двухлетней давности почти с тем же экспериментом, методами, данными и выводами. Что пошло не так? Существующую литературу так и не проверили.
> Вопрос 4-й недели: исследовательский вопрос (research question, RQ) уже есть — а откуда известно, что на него ещё никто не ответил?
## Что такое обзор литературы — и чем он не является
**Обзор литературы (literature review)** — это **анализ и синтез существующих исследований**. Это **не** список статей, **не** пересказ статей по очереди и **не** библиография. Он показывает:
- что известно и **как это изучали** (методы, данные, участники);
- **что обнаружили**;
- где работы **согласны и где расходятся**;
- какие есть **ограничения (limitations)**;
- что **остаётся неизвестным**.
| Это НЕ | Это |
|---|---|
| список статей или библиография | анализ того, что статьи показывают вместе |
| «Статья A говорит X. Статья B говорит Y.» | «A и B согласны насчёт X; C расходится, возможно, потому что…» |
| фоновое чтение ради объёма | аргумент, зачем нужно ваше исследование |
## Шесть причин, зачем он нужен
- **Понять**, что уже известно.
- **Избежать ненужного дублирования** — история про 3 месяца.
- **Найти существующие методы, датасеты, бенчмарки и метрики**, чтобы использовать их или сравниться с ними.
- **Обнаружить противоречия и ограничения** прежних работ.
- **Обосновать** собственное исследование.
- **Найти возможный исследовательский пробел (research gap).**
## Воронка от вопроса к пробелу
Мой RQ → Что уже известно? → Как это изучали? → Что обнаружили? → Где работы согласны? → Где расходятся? → Какие ограничения? → Что ещё неизвестно? → **Исследовательский пробел**.
Каждый шаг — вопрос о литературе, на который нужно уметь ответить **до того**, как заявлять пробел.
## Информация и доказательства
Спрашивать стоит не только «что там сказано?», но и **«откуда взялось это утверждение?»**. Каждое важное утверждение прослеживают до **исходного научного источника**.
| Группа | Примеры | Роль в научной работе |
|---|---|---|
| Неформальные (informal) | блог, Википедия, YouTube, пересказ от ChatGPT | только для ориентации; не доказательство |
| Учебные (educational) | учебник, техническая документация | определения, фон, как работает инструмент |
| Научные (scholarly) | научная статья, доклад конференции, систематический обзор | доказательства для научных утверждений |
## Первичные и вторичные источники
- **Первичный источник (primary source)** — оригинальное исследование: авторы **сами провели и описали работу**, например поставили эксперимент и опубликовали результаты. Ближе всего к доказательствам.
- **Вторичный источник (secondary source)** — **анализирует, обозревает или обобщает** первичные исследования: обзорные статьи, **систематические обзоры (systematic reviews)**, главы учебников, пересказы. Хорош для ориентации; важные утверждения **проверяют по оригиналам**.
> Ловушка экзамена: систематический обзор в рецензируемом журнале — научный **и** вторичный. «Рецензируемый (peer-reviewed)» — про контроль качества; «первичный» — про то, кто проводил исследование.
## Детектив источников
| Источник | Вердикт |
|---|---|
| Блог: «LLM точны на 95%», без ссылки и метода | не годится: утверждение нельзя проследить |
| Рецензируемая статья с описанным методом, датасетом и воспроизводимыми результатами | лучшее доказательство (первичный) |
| Абзац из Википедии | для ориентации; идти по её ссылкам к оригиналу |
| Систематический обзор в рецензируемом журнале | сильный (вторичный); ключевые оригиналы проверить |
| Пересказ от ИИ без ссылок | не проверить; не цитировать как доказательство |
## Какое исследование даёт какие данные
Краткие описания исследований в кейсе (как Study A–D в квизе SafeDrive) относятся к разным **типам исследований**. Нужно знать, какие данные даёт каждый:
| Тип исследования | Что делают исследователи | Данные | Что может показать |
|---|---|---|---|
| Интервью (interview study) | беседуют с людьми, записывают и кодируют ответы | **качественные (qualitative)** — слова, темы, опыт | **почему** и **как** люди думают и действуют |
| Рандомизированное контролируемое испытание (RCT) | случайно распределяют людей в группу вмешательства или контрольную, затем измеряют результат | **количественные (quantitative)** — доли, время, баллы | **вызывает** ли X изменение Y |
| Наблюдательное исследование (observational study) | измеряют уже существующие группы, ничего не назначая | **количественные** — счёт, доли | **связь (association)**; её могут объяснять другие различия между группами (конфаундеры) |
| Систематический обзор (systematic review) | ищут, отбирают и объединяют прежние исследования по явному протоколу | **вторичные**; обычно сведённые числа | общую картину по многим исследованиям |
- **Качественные данные** — текст и смысл: расшифровки интервью, фокус-группы, открытые ответы.
- **Количественные данные** — то, что считают или измеряют: частота аварий, время реакции, точность.
> Ловушка экзамена: в описании исследования «observational study» значит, что группы не назначали (например, сравнили грузовики с системой и без неё). Там считают события, поэтому данные **количественные**. Из четырёх классических типов качественные данные даёт только **интервью**.
?? Какой тип исследования покажет, почему водители выключают сигнал усталости, и какие данные он даёт?
?= Интервью: качественные данные (причины и опыт водителей). RCT или наблюдательное исследование лишь посчитали бы, как часто это происходит.
?? Почему систематический обзор — вторичный источник, хотя он рецензируемый?
?= Его авторы не проводили исследования сами: они нашли, отобрали и объединили первичные работы других.`,
      },
      [
        qx("A student has a promising research idea and wants to start the experiment tomorrow. What should come first?", "Checking what the existing literature already knows", [
          ["Buying all the GPU time that the experiment will need", "Resources come later: first make sure the question has not already been answered.", "Ресурсы — потом: сначала нужно убедиться, что на вопрос ещё не ответили."],
          ["Collecting as much raw data as possible right away", "Collecting data without knowing prior work risks repeating a study that already exists.", "Сбор данных без знания прежних работ рискует повторить уже существующее исследование."],
          ["Writing the conclusion to fix the expected result", "Fixing the result in advance is bias, not planning.", "Заранее зафиксированный результат — предвзятость, а не планирование."],
        ], "The literature comes before the lab: first find out what is already known, then plan the study.", "Литература идёт раньше лаборатории: сначала выясняют, что уже известно, потом планируют исследование."),
        qx("After 3 months and 500 GPU hours, a team finds a two-year-old paper with almost the same experiment and conclusions. Which benefit of a literature review did they miss?", "Avoiding unnecessary duplication of existing work", [
          ["Choosing the correct citation style for the final report", "Citation style is formatting; it would not have saved three months of work.", "Стиль цитирования — это оформление; он не сэкономил бы три месяца работы."],
          ["Making the final report longer and more detailed", "Length is not a purpose of a literature review.", "Объём — не цель обзора литературы."],
          ["Proving the hypothesis before running the study", "A review cannot prove a hypothesis; it shows what is known and what is not.", "Обзор не доказывает гипотезу; он показывает, что известно, а что нет."],
        ], "Knowing the literature reveals an existing study before you repeat it — one of the six reasons for a review.", "Знание литературы показывает уже существующее исследование до того, как его повторят, — одна из шести причин для обзора."),
        qx("Which description fits a literature review?", "An analysis and synthesis of what existing studies show", [
          ["A bibliography of every paper found on the topic", "A bibliography only lists sources; it does not analyse them.", "Библиография лишь перечисляет источники и не анализирует их."],
          ["A summary of each relevant paper, written one after another", "Summarising papers one by one is the classic mistake — reporting, not reviewing.", "Пересказ статей по очереди — классическая ошибка: отчёт, а не обзор."],
          ["A list of the most cited papers in the field", "Citation counts do not show what is known, contradicted or missing.", "Число цитирований не показывает, что известно, что спорно и чего не хватает."],
        ], "A review examines what is known, how it was studied, where studies agree or disagree, their limitations and what remains unknown.", "Обзор показывает, что известно, как это изучали, где работы согласны и где расходятся, их ограничения и что остаётся неизвестным."),
        qx("Which of these is one of the six reasons for doing a literature review?", "Identifying methods, datasets, benchmarks and metrics", [
          ["Showing that nobody in the world has ever studied your topic", "A gap almost never means 'never studied'; the review finds what is known and what is still missing.", "Пробел почти никогда не значит «никто не изучал»; обзор находит, что известно и чего ещё не хватает."],
          ["Making the paper sound more academic to reviewers", "Sounding academic is not a purpose; the review must inform and justify the study.", "Звучать «научно» — не цель; обзор должен информировать и обосновывать исследование."],
          ["Collecting quotes to fill the introduction", "Quotes without analysis are padding, not a review.", "Цитаты без анализа — это наполнитель, а не обзор."],
        ], "The six reasons: understand what is known, avoid duplication, find existing methods/datasets/benchmarks/metrics, discover contradictions and limitations, justify your research, identify a possible gap.", "Шесть причин: понять, что известно; избежать дублирования; найти методы, датасеты, бенчмарки и метрики; обнаружить противоречия и ограничения; обосновать исследование; найти возможный пробел."),
        qx("In the funnel from research question to research gap, what must you establish right before 'What is still unknown?'", "What the limitations of prior studies are", [
          ["How the earliest study collected its data", "That is an earlier step ('How was it studied?'); limitations come right before the unknown.", "Это более ранний шаг («Как это изучали?»); ограничения идут прямо перед неизвестным."],
          ["Which journal published the most studies", "Publication venue is not a step of the funnel.", "Где опубликованы работы — не шаг воронки."],
          ["What result your own study is likely to get", "Your own results come after the plan, not inside the literature funnel.", "Собственные результаты появляются после плана, а не внутри воронки литературы."],
        ], "Known → how studied → found → agree → disagree → limitations → still unknown → gap.", "Известно → как изучали → что нашли → где согласны → где расходятся → ограничения → что неизвестно → пробел."),
        qx("Which source is the safest basis for an academic claim about LLM accuracy?", "A peer-reviewed paper with documented method and data", [
          ["A blog post stating 95% accuracy with no citation", "No citation and no method: the claim cannot be traced or verified.", "Нет ссылки и нет метода: утверждение нельзя проследить и проверить."],
          ["An AI-generated summary of several papers on the topic", "An AI summary without citations is not verifiable and may even invent findings.", "Пересказ от ИИ без ссылок нельзя проверить, и он может даже выдумать результаты."],
          ["A YouTube lecture by a well-known AI engineer", "Popularity is not evidence; trace the claim to the original scholarly source.", "Популярность — не доказательство; утверждение прослеживают до научного первоисточника."],
        ], "A documented, reproducible, peer-reviewed study is traceable evidence — the best basis for a claim.", "Описанное, воспроизводимое, рецензируемое исследование — прослеживаемое доказательство, лучшая опора для утверждения."),
        qx("A Wikipedia paragraph states a key fact you want to use. What is the correct move?", "Follow its references to the original scholarly source", [
          ["Cite Wikipedia, since it is edited by many people", "Community editing does not make it evidence; it may be outdated or unsourced.", "Редактирование сообществом не делает её доказательством; она может быть устаревшей или без источников."],
          ["Ignore the fact entirely, since Wikipedia is always wrong", "Wikipedia is fine for orientation — just not as the evidence you cite.", "Википедия годится для ориентации — просто её не цитируют как доказательство."],
          ["Rephrase it so that no citation is needed", "Rephrasing a claim without its source is still using unverified information.", "Пересказ утверждения без источника — всё равно использование непроверенной информации."],
        ], "Use Wikipedia for orientation, then trace the claim to the scholarly source and cite that.", "Википедия — для ориентации; затем утверждение прослеживают до научного источника и цитируют его."),
        qx("What makes a source primary?", "Its authors conducted and reported the study themselves", [
          ["It was published in a peer-reviewed journal", "Peer review is quality control; a peer-reviewed review article is still secondary.", "Рецензирование — контроль качества; рецензируемая обзорная статья всё равно вторична."],
          ["It appears as the very first result in Google Scholar search", "Search ranking says nothing about whether the work is original research.", "Место в выдаче ничего не говорит о том, оригинальное ли это исследование."],
          ["It summarises all of the important studies on a topic", "Summarising other studies is exactly what a secondary source does.", "Обобщать чужие исследования — это как раз работа вторичного источника."],
        ], "A primary source is original research reported by the people who did it — the closest you get to the evidence.", "Первичный источник — оригинальное исследование, описанное теми, кто его провёл; ближе к доказательствам не подойти."),
        tfx("A systematic review published in a peer-reviewed journal is a primary source.", false,
          "It is secondary: it searches, screens and synthesises primary studies done by others. It is scholarly and peer-reviewed, but not primary.",
          "Он вторичный: он ищет, отбирает и обобщает первичные работы других. Он научный и рецензируемый, но не первичный.",
          "'True' confuses quality with origin: peer review does not turn a synthesis into original research.",
          "Ответ «верно» путает качество с происхождением: рецензирование не превращает обобщение в оригинальное исследование."),
        qx("Why should important claims from a review article be checked against the original studies?", "A summary may distort the original evidence", [
          ["Review articles are never peer-reviewed", "Many review articles are peer-reviewed; the issue is their distance from the evidence.", "Многие обзорные статьи рецензируются; дело в их удалённости от доказательств."],
          ["Original studies are always newer than reviews", "Reviews usually come after the studies they cover, not before.", "Обзоры обычно выходят после исследований, которые охватывают, а не до."],
          ["Citing reviews is banned in academic writing", "Reviews can be cited and are good for orientation; key claims are traced to the originals.", "Обзоры можно цитировать, они полезны для ориентации; ключевые утверждения прослеживают до оригиналов."],
        ], "Secondary sources simplify and select; for important claims, check what the primary study actually reported.", "Вторичные источники упрощают и отбирают; для важных утверждений проверяют, что на самом деле сообщило первичное исследование."),
        qx("In a case, Study C interviewed 18 truck drivers about fatigue alerts. What kind of data does it give?", "Qualitative data: drivers' experiences and reasons", [
          ["Quantitative data: accident rates per thousand kilometres", "Interviews record words and reasons, not measured rates.", "Интервью фиксируют слова и причины, а не измеренные частоты."],
          ["Causal evidence that alerts reduce accidents", "Showing cause needs a controlled comparison such as an RCT, not interviews.", "Чтобы показать причину, нужно контролируемое сравнение, например RCT, а не интервью."],
          ["Secondary data pooled from earlier studies", "That describes a systematic review; interviews collect new primary data.", "Это описание систематического обзора; интервью собирают новые первичные данные."],
        ], "Interviews produce words, themes and experiences — qualitative data that explain why and how.", "Интервью дают слова, темы и опыт — качественные данные, объясняющие «почему» и «как»."),
        qx("Which study type is designed to show that an intervention causes a change in an outcome?", "A randomised controlled trial", [
          ["An observational cohort study", "It can show an association, but the groups were not randomised, so other differences may explain the result.", "Оно может показать связь, но группы не рандомизированы, и результат могут объяснять другие различия."],
          ["A semi-structured interview study", "Interviews explain experiences and reasons; they do not measure causal effects.", "Интервью объясняют опыт и причины, но не измеряют причинный эффект."],
          ["A narrative literature review", "A review summarises existing studies; it does not run a new controlled comparison.", "Обзор обобщает существующие работы и не проводит нового контролируемого сравнения."],
        ], "Random assignment makes the groups comparable, so a difference in the outcome can be attributed to the intervention.", "Случайное распределение делает группы сравнимыми, поэтому разницу в результате можно приписать вмешательству."),
        qx("Study B compared accident records of 2,000 trucks with and without a fatigue system that fleets chose to install. What is its main weakness?", "Fleets that installed it may differ in other ways", [
          ["It gives qualitative data that cannot be counted", "Accident records are numbers — this is quantitative data.", "Записи об авариях — это числа, то есть количественные данные."],
          ["A sample of 2,000 trucks is too small to analyse", "2,000 trucks is a large sample; size is not the main problem here.", "2 000 грузовиков — большая выборка; размер здесь не главная проблема."],
          ["It only reviews studies done by other researchers", "It collected its own records; reviewing others' studies is what a systematic review does.", "Оно собрало собственные записи; обзор чужих работ — это систематический обзор."],
        ], "Without randomisation, safer fleets may be the ones that installed the system (a confounder), so the study shows association, not cause.", "Без рандомизации систему могли ставить как раз более аккуратные автопарки (конфаундер), поэтому исследование показывает связь, а не причину."),
        qx("Which pair is correctly matched?", "Interview study — qualitative; RCT — quantitative", [
          ["Interview study — quantitative; RCT — qualitative", "Reversed: interviews give words and themes; an RCT measures outcomes in numbers.", "Наоборот: интервью дают слова и темы, RCT измеряет результат в числах."],
          ["Observational study — qualitative; RCT — qualitative", "In an evidence summary both measure outcomes numerically.", "В описании доказательств оба измеряют результат в числах."],
          ["Systematic review — primary; interview study — secondary", "Reversed: the review is secondary; the interview study collects primary data.", "Наоборот: обзор вторичный, а интервью собирают первичные данные."],
        ], "Interviews → qualitative; RCT and observational studies → quantitative; a systematic review → secondary synthesis.", "Интервью → качественные; RCT и наблюдательные → количественные; систематический обзор → вторичное обобщение."),
        qx("A systematic review combines the results of 25 earlier studies. How should it be classified?", "Secondary research that synthesises primary studies", [
          ["Primary research, because it reports new numbers", "Pooled numbers still come from others' studies; the review collected no new data.", "Сведённые числа всё равно взяты из чужих работ; обзор не собирал новых данных."],
          ["Qualitative research, because it reads many texts", "Reading papers is not interviewing people; a review of trials usually pools quantitative results.", "Читать статьи — не то же, что интервьюировать людей; обзор испытаний обычно сводит количественные результаты."],
          ["An informal source, because it only reuses others' work", "It is scholarly and peer-reviewed; reusing studies systematically is its method, not a weakness.", "Он научный и рецензируемый; систематическое использование чужих работ — его метод, а не слабость."],
        ], "A systematic review searches, screens and combines primary studies by an explicit protocol — secondary, but strong evidence.", "Систематический обзор ищет, отбирает и объединяет первичные работы по явному протоколу — вторичный, но сильный источник."),
        qx("Which piece of evidence is quantitative?", "Drivers' reaction times measured in a simulator", [
          ["Drivers' explanations of why they ignore alarms", "Explanations are words and reasons — qualitative data.", "Объяснения — это слова и причины, качественные данные."],
          ["Themes coded from a focus group with fleet managers", "Coded themes from a focus group are qualitative.", "Темы, выделенные из фокус-группы, — качественные данные."],
          ["Open-ended comments written in a feedback form", "Free-text comments are qualitative until someone counts them.", "Свободные комментарии — качественные данные, пока их никто не посчитал."],
        ], "Reaction times are measured numbers, so they are quantitative.", "Время реакции — измеренные числа, значит, это количественные данные."),
        qx("A researcher wants to understand why drivers switch off fatigue alerts. Which study type fits best?", "Interviews with drivers who use the alerts", [
          ["A randomised trial with alerts on and off", "An RCT measures whether alerts change outcomes, not the reasons behind drivers' behaviour.", "RCT измеряет, меняют ли сигналы результат, но не причины поведения водителей."],
          ["A count of accidents in national statistics", "Accident counts show how often, not why.", "Подсчёт аварий показывает «как часто», а не «почему»."],
          ["A meta-analysis of simulator accuracy studies", "It summarises detection accuracy, not drivers' reasons.", "Он обобщает точность обнаружения, а не причины водителей."],
        ], "'Why' questions about experience need qualitative data, and interviews provide it.", "Вопросы «почему» об опыте требуют качественных данных, а их дают интервью."),
        qx("Which statement about information versus evidence matches the lecture?", "The key question is where a claim originally comes from", [
          ["Any source is fine if it sounds confident and precise", "Confidence is not traceability; a precise-sounding number can be invented.", "Уверенный тон — не прослеживаемость; точное на вид число может быть выдумано."],
          ["Educational sources outrank research articles as evidence", "Textbooks and documentation are good for background; research articles are the evidence base.", "Учебники и документация хороши для фона; доказательная база — научные статьи."],
          ["A claim repeated on many websites becomes evidence", "Repetition is not traceability; many sites may copy one unsourced claim.", "Повторение — не прослеживаемость; многие сайты могут копировать одно утверждение без источника."],
        ], "Not all sources are equal: ask where the claim comes from and trace it to the original scholarly source.", "Источники не равны: спрашивают, откуда утверждение, и прослеживают его до научного первоисточника."),
        tfx("In a typical evidence summary, an observational study that counts accidents produces qualitative data.", false,
          "Counting accidents gives numbers, so it is quantitative. 'Observational' means the researchers did not assign the groups, not that the data are words.",
          "Подсчёт аварий даёт числа, значит, это количественные данные. «Наблюдательное» значит, что группы не назначали, а не что данные — слова.",
          "'True' confuses an observational study with qualitative observation (field notes); here the label is about design, and the data are counts.",
          "Ответ «верно» путает наблюдательное исследование с качественным наблюдением (полевыми заметками); здесь название — про дизайн, а данные — подсчёты."),
        qx("A student cites a textbook chapter for the definition of a hallucination in LLMs. How does the lecture classify this source?", "Educational and secondary — fine for background", [
          ["Scholarly and primary — the strongest evidence", "A textbook explains others' research; it is not original research.", "Учебник объясняет чужие исследования; это не оригинальное исследование."],
          ["Informal — never allowed in academic writing", "Textbooks are educational sources, acceptable for definitions and background.", "Учебники — учебные источники, они допустимы для определений и фона."],
          ["Primary, because it was written by a university professor", "Who wrote it does not make it primary; conducting the study does.", "Первичным источник делает не статус автора, а то, что автор сам провёл исследование."],
        ], "Textbooks are educational, secondary sources: good for definitions; key research claims are traced to original studies.", "Учебники — учебные вторичные источники: хороши для определений; ключевые научные утверждения прослеживают до оригинальных работ."),
      ],
    ),
    part(
      "rm-l4-p2",
      { en: "Search strings, screening and strategic reading", ru: "Поисковые строки, отсев и стратегическое чтение" },
      {
        en: `## Where to search
No single database covers everything — choose by field and access.
| Database | Strength |
|---|---|
| Google Scholar | broad, free, cross-disciplinary; a good starting point |
| Scopus | large citation database with strong metrics |
| Web of Science | high-quality journal indexing |
| IEEE Xplore | engineering and computer science |
| ACM Digital Library | computing and software research |
| SpringerLink / ScienceDirect | broad scientific publishing |
Regular Google is not Google Scholar: peer-reviewed research is found in academic databases.
## Do not paste your research question
Too specific: "How do large language models make mistakes when answering Kazakh programming questions for university students?" No paper uses exactly that phrasing, so the search returns very few results or none.
Break the RQ into **3–4 concepts**, give each concept **2–4 alternative terms**, then combine them:
= Concepts → Synonyms → Keywords → Search query
| Concept | Alternative terms |
|---|---|
| Large language models | LLM, "large language model", "generative AI", "foundation model" |
| Kazakh | Kazakh, "Kazakh language", "low-resource language" |
| Errors | "factual error", hallucination, factuality, accuracy |
## The four tools of a search string
| Tool | Job | Effect |
|---|---|---|
| AND | joins **different concepts**: every result must contain both | **narrows** |
| OR | joins **alternative terms for one concept**: any one is enough | **broadens** |
| " " | keeps a multi-word term together as an **exact phrase** | the words are not matched separately |
| ( ) | **groups** the OR-alternatives of one concept into a block | the database reads the logic as intended |
Most databases also support **truncation** with an asterisk: one word stem finds every ending.
= accident* → accident, accidents, accidental
## The balanced template
One block in brackets **per concept**, **OR inside** each block, **AND between** blocks, every multi-word phrase **in quotes**:
= (term1 OR "term 2") AND (term3 OR "term 4") AND (term5 OR "term 6")
@diagram rm4-search-blocks
The lecture example:
= ("large language model" OR LLM) AND (Kazakh OR "low-resource language") AND (hallucination OR factuality OR accuracy)
SafeDrive-style case — drowsiness alerts for long-haul truck drivers:
= ("drowsiness detection" OR "fatigue detection") AND ("truck drivers" OR "long-haul drivers") AND (accident* OR "near-miss")
Read it aloud: a paper must mention **drowsiness or fatigue detection**, AND **truck or long-haul drivers**, AND **accidents or near-misses**.
## Typical mistakes
| Mistake | Example | Why it fails |
|---|---|---|
| Only AND | drowsiness AND fatigue AND truck AND drivers AND accidents | all synonyms must appear together: far too narrow |
| Only OR | drowsiness OR fatigue OR truck OR accidents | any one word is enough: a flood of off-topic papers |
| Bracket not closed | ("drowsiness detection" OR "fatigue detection" AND ... | the grouping is ambiguous: an error or a misread query |
| Phrase without quotes | drowsiness detection OR fatigue detection | the words are matched separately, not as phrases |
| Concepts mixed in one block | ("truck drivers" OR "near-miss") | one block must hold one idea, not two |
| Whole question pasted | "How can accidents caused by tired drivers be prevented?" | no paper uses that sentence |
> Exam checklist for "write one balanced search string": 2–4 concept blocks · OR inside each block · AND between blocks · quotes around every multi-word phrase · every bracket closed · truncation is a bonus.
## Tuning the balance
- **Too many results** (thousands, off-topic): add a concept block with AND, use exact phrases, filter by years or document type.
- **Too few results**: add synonyms with OR, use truncation, drop the narrowest block.
- Write **at least two queries** and compare what each returns.
## From 2,438 results to the relevant few
A large result set is not success — it is the **start of filtering**. A paper that contains your keyword is **not automatically relevant**.
= 2,438 results → titles → abstracts → keywords → relevance to RQ → method and context → full text
**The 60-second paper test** — title → abstract → research aim → method → findings → **YES**: keep and read more, **NO**: move on. It is a **screening tool, not a replacement for careful reading.**
## Strategic reading order
Do not read a paper like a novel, from page 1 to page 20:
= Title & abstract → Conclusion → Method → Results → Full text (if relevant)
?? Write a balanced search string for: "Do AI coding assistants affect how novice programmers learn?"
?= ("AI coding assistant" OR "GitHub Copilot" OR ChatGPT) AND (novice OR "introductory programming") AND (learning OR performance) — one block per concept, OR inside, AND between, phrases in quotes.
?? A query returns only 7 papers. Name two fixes.
?= Add synonyms with OR inside the blocks and use truncation (driver*), or remove the narrowest concept block.`,
        ru: `## Где искать
Ни одна база не покрывает всё — выбирают по области и доступу.
| База | Сильная сторона |
|---|---|
| Google Scholar | широкая, бесплатная, междисциплинарная; хорошая точка старта |
| Scopus | большая база цитирований с сильными метриками |
| Web of Science | индексация журналов высокого качества |
| IEEE Xplore | инженерия и computer science |
| ACM Digital Library | вычисления и исследования ПО |
| SpringerLink / ScienceDirect | широкий круг научных изданий |
Обычный Google — не Google Scholar: рецензируемые исследования ищут в академических базах.
## Не вставлять исследовательский вопрос целиком
Слишком конкретно: «How do large language models make mistakes when answering Kazakh programming questions for university students?» Ни одна статья не сформулирована именно так, поэтому поиск даёт очень мало результатов или ноль.
RQ разбивают на **3–4 понятия (concepts)**, к каждому подбирают **2–4 альтернативных термина**, затем соединяют:
= Concepts → Synonyms → Keywords → Search query
| Понятие | Альтернативные термины |
|---|---|
| Большие языковые модели | LLM, "large language model", "generative AI", "foundation model" |
| Казахский | Kazakh, "Kazakh language", "low-resource language" |
| Ошибки | "factual error", hallucination, factuality, accuracy |
## Четыре инструмента поисковой строки
| Инструмент | Задача | Эффект |
|---|---|---|
| AND | соединяет **разные понятия**: в каждом результате должны быть оба | **сужает** |
| OR | соединяет **альтернативные термины одного понятия**: достаточно любого | **расширяет** |
| " " | держит многословный термин вместе как **точную фразу** | слова не ищутся по отдельности |
| ( ) | **группирует** OR-альтернативы одного понятия в блок | база читает логику так, как задумано |
Большинство баз поддерживают и **усечение (truncation)** звёздочкой: одна основа слова находит все окончания.
= accident* → accident, accidents, accidental
## Сбалансированный шаблон
Один блок в скобках **на каждое понятие**, **OR внутри** блока, **AND между** блоками, каждая многословная фраза **в кавычках**:
= (term1 OR "term 2") AND (term3 OR "term 4") AND (term5 OR "term 6")
@diagram rm4-search-blocks
Пример из лекции:
= ("large language model" OR LLM) AND (Kazakh OR "low-resource language") AND (hallucination OR factuality OR accuracy)
Кейс в духе SafeDrive — сигналы сонливости для водителей-дальнобойщиков:
= ("drowsiness detection" OR "fatigue detection") AND ("truck drivers" OR "long-haul drivers") AND (accident* OR "near-miss")
Читается так: в статье должно быть **обнаружение сонливости или усталости**, И **водители грузовиков или дальнобойщики**, И **аварии или опасные ситуации (near-miss)**.
## Типичные ошибки
| Ошибка | Пример | Почему не работает |
|---|---|---|
| Только AND | drowsiness AND fatigue AND truck AND drivers AND accidents | все синонимы обязаны стоять вместе: слишком узко |
| Только OR | drowsiness OR fatigue OR truck OR accidents | хватает любого слова: поток статей не по теме |
| Скобка не закрыта | ("drowsiness detection" OR "fatigue detection" AND ... | группировка неоднозначна: ошибка или неверное прочтение |
| Фраза без кавычек | drowsiness detection OR fatigue detection | слова ищутся по отдельности, а не как фразы |
| Понятия смешаны в одном блоке | ("truck drivers" OR "near-miss") | в блоке должна быть одна идея, а не две |
| Вставлен весь вопрос | "How can accidents caused by tired drivers be prevented?" | такого предложения нет ни в одной статье |
> Чек-лист экзамена для «write one balanced search string»: 2–4 блока-понятия · OR внутри блока · AND между блоками · кавычки вокруг каждой многословной фразы · все скобки закрыты · усечение — плюс.
## Настройка баланса
- **Слишком много результатов** (тысячи, не по теме): добавить блок-понятие через AND, взять точные фразы, отфильтровать по годам или типу публикации.
- **Слишком мало результатов**: добавить синонимы через OR, применить усечение, убрать самый узкий блок.
- Стоит написать **минимум два запроса** и сравнить, что даёт каждый.
## От 2 438 результатов к нескольким нужным
Большая выдача — не успех, а **начало отсева**. Статья с вашим ключевым словом **не обязательно релевантна**.
= 2,438 results → titles → abstracts → keywords → relevance to RQ → method and context → full text
**Тест статьи за 60 секунд (60-second paper test)** — название → аннотация → цель исследования → метод → результаты → **ДА**: оставить и читать дальше, **НЕТ**: идти дальше. Это **инструмент отсева, а не замена внимательному чтению.**
## Порядок стратегического чтения
Статью не читают как роман, с 1-й по 20-ю страницу:
= Title & abstract → Conclusion → Method → Results → Full text (if relevant)
?? Составьте сбалансированную поисковую строку для вопроса «Влияют ли ИИ-ассистенты для кода на то, как учатся начинающие программисты?»
?= ("AI coding assistant" OR "GitHub Copilot" OR ChatGPT) AND (novice OR "introductory programming") AND (learning OR performance) — блок на понятие, OR внутри, AND между, фразы в кавычках.
?? Запрос дал всего 7 статей. Назовите два способа это исправить.
?= Добавить синонимы через OR внутри блоков и применить усечение (driver*) или убрать самый узкий блок-понятие.`,
      },
      [
        qx("Which search string is balanced and correctly written?", '("drowsiness detection" OR "fatigue detection") AND ("truck drivers" OR "long-haul drivers")', [
          ['("drowsiness detection" AND "fatigue detection") OR ("truck drivers" AND "long-haul drivers")', "The operators are swapped: synonyms are joined with AND and concepts with OR, so it is too narrow inside and too broad between.", "Операторы перепутаны: синонимы соединены через AND, а понятия — через OR; внутри слишком узко, между — слишком широко."],
          ['("drowsiness detection" OR "fatigue detection" AND ("truck drivers" OR "long-haul drivers")', "The first bracket is never closed, so the grouping is ambiguous.", "Первая скобка не закрыта, поэтому группировка неоднозначна."],
          ['(drowsiness detection OR fatigue detection) AND (truck drivers OR long-haul drivers)', "No quotation marks: each phrase is split into separate words.", "Нет кавычек: каждая фраза распадается на отдельные слова."],
        ], "Synonyms of one concept with OR inside brackets, concepts joined with AND, multi-word phrases in quotes, every bracket closed.", "Синонимы одного понятия — через OR в скобках, понятия — через AND, многословные фразы — в кавычках, все скобки закрыты."),
        qx("In a search string, what is the job of AND?", "It joins different concepts, so results narrow", [
          ["It joins synonyms of one concept, so results grow", "That is OR; AND requires every term, so it narrows.", "Это OR; AND требует каждого термина, поэтому сужает."],
          ["It marks an exact multi-word phrase to match", "Exact phrases are made with quotation marks.", "Точные фразы задают кавычками."],
          ["It excludes papers containing the next term", "Excluding is done with NOT, which the template does not need.", "Исключение делают через NOT, а шаблону он не нужен."],
        ], "AND connects different concepts: every result must contain a term from each block, so the set gets smaller.", "AND соединяет разные понятия: в каждом результате должен быть термин из каждого блока, поэтому выдача уменьшается."),
        qx('Why are "truck drivers" and "long-haul drivers" joined with OR?', "They name the same concept, and either one is enough", [
          ["Both phrases must appear together in every single result", "That would be AND — and it would wrongly demand both synonyms at once.", "Это был бы AND — и он ошибочно требовал бы оба синонима сразу."],
          ["OR tells the database to rank them by date", "OR has nothing to do with ranking; it widens the set of matching papers.", "OR не связан с сортировкой; он расширяет набор подходящих статей."],
          ["OR is required before every quoted phrase", "Quotes and OR are independent; OR is used for alternatives.", "Кавычки и OR не связаны; OR нужен для альтернатив."],
        ], "Different papers use different words for the same population; OR catches all of them.", "Разные статьи называют одну и ту же группу по-разному; OR ловит все варианты."),
        qx("How should the 60-second paper test be used?", "To decide whether a paper deserves a careful read", [
          ["As a full replacement for reading the paper", "It is a screening tool, not a replacement for careful reading.", "Это инструмент отсева, а не замена внимательному чтению."],
          ["To check the citation count and the journal impact factor", "The test looks at title, abstract, aim, method and findings — not metrics.", "Тест смотрит на название, аннотацию, цель, метод и результаты, а не на метрики."],
          ["To summarise the paper in your literature review", "The test only decides keep or move on; it does not write the review.", "Тест лишь решает «оставить или дальше»; обзор он не пишет."],
        ], "Title → abstract → aim → method → findings: YES keep and read more, NO move on.", "Название → аннотация → цель → метод → результаты: ДА — оставить и читать дальше, НЕТ — идти дальше."),
        qx('What is the purpose of the parentheses in (accident* OR "near-miss")?', "To group the synonyms of one concept into one block", [
          ["To make every term in the bracket optional for the search", "Grouping does not make terms optional: at least one term of the block must still match.", "Группировка не делает термины необязательными: хотя бы один термин блока должен совпасть."],
          ["To limit the search to the titles of papers only", "Field restriction is a database filter, not brackets.", "Ограничение по полям — это фильтр базы, а не скобки."],
          ["To mark the terms as a single exact phrase", "Exact phrases are made with quotation marks, not brackets.", "Точные фразы задают кавычками, а не скобками."],
        ], "Brackets keep the OR-alternatives of one concept together, so AND is applied to the whole block.", "Скобки держат OR-альтернативы одного понятия вместе, и AND применяется ко всему блоку."),
        qx("What does the asterisk in accident* do in most databases?", "Finds every word that starts with accident", [
          ["Marks accident as the main keyword", "There is no importance marker; the asterisk is truncation.", "Отметки важности нет; звёздочка — это усечение."],
          ["Excludes every paper that contains the word accident", "Exclusion is NOT; the asterisk widens the search.", "Исключение — это NOT; звёздочка расширяет поиск."],
          ["Matches only the exact word accident", "The opposite: it also matches accidents and accidental.", "Наоборот: она находит и accidents, и accidental."],
        ], "Truncation: one stem finds accident, accidents, accidental — useful inside an OR block.", "Усечение: одна основа находит accident, accidents, accidental — удобно внутри OR-блока."),
        qx("A student writes: drowsiness AND fatigue AND truck AND drivers AND accidents. What is the main problem?", "Synonyms joined by AND make it far too narrow", [
          ["It uses too many OR operators, so it is too broad", "There is no OR at all — the string has the opposite problem.", "OR там нет вообще — у строки обратная проблема."],
          ["It needs quotes around every single word", "Quotes are for multi-word phrases; the main problem is AND between synonyms.", "Кавычки нужны для многословных фраз; главная проблема — AND между синонимами."],
          ["Brackets are missing, so the database rejects it", "A pure AND chain is valid syntax; the problem is the logic, not the syntax.", "Цепочка из одних AND синтаксически допустима; проблема в логике, а не в синтаксисе."],
        ], "A paper must now contain drowsiness AND fatigue AND every other word — synonyms belong together in an OR block.", "Теперь статья обязана содержать и drowsiness, и fatigue, и все остальные слова — синонимы должны стоять вместе в OR-блоке."),
        qx("A student writes: drowsiness OR fatigue OR truck OR drivers OR accidents. What will happen?", "Any one word is enough: huge, off-topic results", [
          ["Only papers mentioning all five words are returned", "That would be AND; with OR any one word is enough.", "Так работал бы AND; с OR хватает любого одного слова."],
          ["The database returns zero results", "OR broadens — the risk is far too many results, not zero.", "OR расширяет — риск в слишком большом числе результатов, а не в нуле."],
          ["Only papers about truck drivers are returned", "Nothing forces the truck-driver concept; 'fatigue' alone qualifies a paper.", "Ничто не требует понятия «водители грузовиков»; одного слова fatigue хватает."],
        ], "With only OR, a paper on muscle fatigue or truck design matches too — the concepts are no longer required together.", "При одних OR подходит и статья об усталости мышц или о конструкции грузовиков — понятия больше не обязаны встречаться вместе."),
        qx('What is wrong with: ("drowsiness detection" OR "fatigue detection" AND ("truck drivers" OR "long-haul drivers")', "The first bracket is opened but never closed", [
          ["Phrases should not be put in quotation marks", "Quotes around multi-word phrases are correct here.", "Кавычки вокруг многословных фраз здесь правильные."],
          ["OR cannot be used inside parentheses", "OR inside parentheses is exactly how synonym blocks are built.", "OR внутри скобок — как раз так строят блоки синонимов."],
          ["AND cannot connect two bracketed groups", "AND between blocks is the correct structure.", "AND между блоками — правильная структура."],
        ], "Without the closing bracket the database cannot tell where the first block ends; close it before AND.", "Без закрывающей скобки база не понимает, где кончается первый блок; её ставят перед AND."),
        qx("What happens if multi-word terms are typed without quotes: drowsiness detection OR fatigue detection?", "The words are matched separately, not as phrases", [
          ["The database automatically adds the quotes for you", "Do not rely on that: many databases do not, and the exam expects explicit quotes.", "На это нельзя полагаться: многие базы так не делают, а экзамен ждёт явных кавычек."],
          ["Only papers with both phrases in the title appear", "Nothing restricts the search to titles, and OR does not require both.", "Ничто не ограничивает поиск названиями, а OR не требует обеих фраз."],
          ["The query fails with a syntax error", "It runs — that is the danger: it silently gives different, broader results.", "Запрос выполнится — в этом и опасность: он тихо даст другие, более широкие результаты."],
        ], "Without quotes, 'detection' can appear anywhere and the OR binds single words, not the two phrases.", "Без кавычек detection может стоять где угодно, а OR связывает отдельные слова, а не две фразы."),
        qx("Which pair of terms should NOT share one OR block?", '"truck drivers" and "near-miss"', [
          ['"truck drivers" and "long-haul drivers"', "These are alternatives for the same concept (the population) — a correct OR pair.", "Это альтернативы одного понятия (кто изучается) — правильная пара для OR."],
          ['"drowsiness detection" and "fatigue detection"', "Both name the technology concept — a correct OR pair.", "Оба называют понятие «технология» — правильная пара для OR."],
          ['accident* and "near-miss"', "Both name the outcome concept — a correct OR pair.", "Оба называют понятие «исход» — правильная пара для OR."],
        ], "A population and an outcome are different concepts: they belong in separate blocks joined with AND.", "Группа людей и исход — разные понятия: им место в разных блоках, соединённых через AND."),
        qx("A search returns 9,000 results, mostly off-topic. Which change helps most?", "Add another concept block joined with AND", [
          ["Add more synonyms with OR inside every concept block", "OR broadens — the results would grow further.", "OR расширяет — результатов станет ещё больше."],
          ["Remove the quotation marks from phrases", "Without quotes words match separately — even more results.", "Без кавычек слова ищутся по отдельности — результатов ещё больше."],
          ["Replace AND between blocks with OR", "That would merge all blocks into one huge OR search.", "Так все блоки слились бы в один огромный OR-поиск."],
        ], "Each extra AND block adds a required concept, which narrows the set to papers that really match the RQ.", "Каждый новый AND-блок добавляет обязательное понятие и сужает выдачу до статей, действительно подходящих к RQ."),
        qx("A search returns only 6 papers. What is a sensible first fix?", "Add synonyms with OR and use truncation", [
          ["Add a fourth concept block with AND", "AND narrows further — even fewer results.", "AND сужает ещё сильнее — результатов станет меньше."],
          ["Put the whole research question in quotes", "A full sentence in quotes matches almost nothing.", "Целое предложение в кавычках почти ни с чем не совпадёт."],
          ["Restrict the search to the last 12 months", "A date filter removes papers; it does not add any.", "Фильтр по датам убирает статьи, а не добавляет."],
        ], "More alternatives inside the blocks (and word stems with an asterisk) widen the search without losing the concepts.", "Больше альтернатив внутри блоков (и основы слов со звёздочкой) расширяют поиск, не теряя понятий."),
        qx("Why does pasting the whole research question into the search bar usually fail?", "Almost no paper uses that exact phrasing", [
          ["Databases accept one word per search", "They accept long queries; the problem is the over-specific phrasing.", "Базы принимают длинные запросы; проблема в слишком конкретной формулировке."],
          ["Questions are blocked by academic databases", "Nothing is blocked; the phrasing just matches almost nothing.", "Ничего не блокируется; формулировка просто почти ни с чем не совпадает."],
          ["It always returns millions of irrelevant hits", "The typical result is too FEW hits, not too many.", "Типичный итог — слишком МАЛО результатов, а не слишком много."],
        ], "Break the RQ into concepts, find synonyms, then build the query.", "RQ разбивают на понятия, подбирают синонимы и только потом строят запрос."),
        qx("In which order is a search query built?", "Concepts → synonyms → keywords → query", [
          ["Query → keywords → synonyms → concepts", "Reversed: the query is the last step, not the first.", "Наоборот: запрос — последний шаг, а не первый."],
          ["Keywords → query → concepts → synonyms", "Concepts must come first; otherwise there is nothing to find synonyms for.", "Понятия идут первыми, иначе не к чему подбирать синонимы."],
          ["Synonyms → concepts → query → keywords", "Synonyms are found for concepts, so concepts come before synonyms.", "Синонимы подбирают к понятиям, поэтому понятия идут раньше."],
        ], "Name the concepts of the RQ, list alternative terms, choose keywords, then combine them with operators.", "Называют понятия RQ, перечисляют альтернативные термины, выбирают ключевые слова и соединяют их операторами."),
        qx("A software engineering student needs conference papers on code review tools. Which databases fit best?", "IEEE Xplore and the ACM Digital Library", [
          ["Wikipedia and YouTube lecture series", "These are informal sources, not academic databases.", "Это неформальные источники, а не академические базы."],
          ["Web of Science alone, as it covers everything", "No single database covers everything.", "Ни одна база не покрывает всё."],
          ["Regular Google, since it indexes all papers", "Google is not Google Scholar; it does not surface peer-reviewed research systematically.", "Google — не Google Scholar; он не находит рецензируемые исследования систематически."],
        ], "IEEE Xplore and ACM DL focus on computing and software research, including conference papers.", "IEEE Xplore и ACM DL специализируются на computing и ПО, включая доклады конференций."),
        qx("A query returns 2,438 papers. What does the lecture say this means?", "It is the beginning of a filtering process", [
          ["The literature search is complete", "A large result set is not success; the papers still have to be screened.", "Большая выдача — не успех; статьи ещё предстоит отсеять."],
          ["The query is too narrow and needs OR", "2,438 is a lot — too narrow is not the issue.", "2 438 — это много; слишком узко — не та проблема."],
          ["Every one of the papers must now be read in full", "Nobody reads 2,438 papers; screen titles and abstracts first.", "2 438 статей никто не читает; сначала отсеивают по названиям и аннотациям."],
        ], "A keyword match is not relevance: titles, abstracts and methods are screened before any full read.", "Совпадение по ключевому слову — не релевантность: до полного чтения отсеивают по названиям, аннотациям и методам."),
        qx("What is the correct order of the paper filter after the keyword search?", "Titles → abstracts → relevance to RQ → method → full text", [
          ["Full text → method → relevance to RQ → abstracts → titles", "Reversed: the most expensive step, the full text, comes last.", "Наоборот: самый дорогой шаг — полный текст — идёт последним."],
          ["Abstracts → full text → titles → method → relevance to RQ", "Reading full texts before checking titles wastes hours.", "Читать полные тексты до проверки названий — потеря часов."],
          ["Method → titles → full text → abstracts → relevance to RQ", "Method checks come after the cheap title and abstract screens.", "Метод проверяют после быстрого отсева по названиям и аннотациям."],
        ], "Each stage is more expensive, so it is applied to fewer papers: titles first, full text last.", "Каждая стадия дороже предыдущей, поэтому применяется к меньшему числу статей: сначала названия, в конце полный текст."),
        qx("In the strategic reading order, what comes right after the title and abstract?", "The conclusion section", [
          ["The method section", "The method comes third, after the conclusion.", "Метод идёт третьим, после заключения."],
          ["The full reference list", "References are not part of the strategic order at all.", "Список литературы вообще не входит в стратегический порядок."],
          ["The related-work section", "Related work is not an early step in the strategic order.", "Обзор смежных работ — не ранний шаг стратегического порядка."],
        ], "Title and abstract → conclusion → method → results → full text if relevant.", "Название и аннотация → заключение → метод → результаты → полный текст, если релевантно."),
        tfx("Adding one more concept block with AND usually increases the number of results.", false,
          "AND requires every block to match, so each new AND block narrows the result set.",
          "AND требует совпадения каждого блока, поэтому каждый новый AND-блок сужает выдачу.",
          "'True' confuses AND with OR: only more OR-alternatives widen a search.",
          "Ответ «верно» путает AND и OR: расширяют поиск только новые OR-альтернативы."),
      ],
    ),
    part(
      "rm-l4-p3",
      { en: "Synthesis, the evidence matrix and the research gap", ru: "Синтез, матрица доказательств и исследовательский пробел" },
      {
        en: `## The biggest literature review mistake
"Smith (2021) found that… Lee (2022) found that… Kim (2023) found that… Ali (2023) found that…" — papers reported one after another. This is **reporting, not reviewing**. A real review needs **comparison · connection · critique · synthesis**.
| Summary — not enough | Synthesis — what is needed |
|---|---|
| organised by paper: A says X, B says Y, C says Z | organised by theme: a finding, a method issue, a limitation |
| each paper is an isolated unit | "A and B agree that…"; "C reports a different result, possibly because…" |
| differences are listed, not explained | "A and C used different datasets, which may explain…" |
| no pattern, no gap | "All three share this limitation… None of them evaluated…" → possible gap |
> Make the papers talk to each other: one paragraph = one idea, with several studies cited inside it.
## Evidence matrix and mini literature map
Before writing, put the studies into one table (the Week 4 activity: review 2–3 related studies and build a **mini literature map**). Same columns for every paper:
| Paper | Method and data | Main finding | Limitation | What is missing |
|---|---|---|---|---|
| Smith et al. (2023), hypothetical | benchmark: 3 LLMs, 500 QA items, 5 domains | accuracy drops 18–34% in low-resource languages | no Kazakh tasks | Kazakh factual QA |
@diagram rm4-synthesis
Reading **across a row** gives a summary of one paper; reading **down a column** gives a theme for a synthesis paragraph. A **literature map** shows the same as a picture: your RQ in the centre, studies clustered by theme, lines for agreement or contradiction, and an empty area that marks the gap.
## Exam task: one analytical paragraph about Studies A–D
Practice case in the SafeDrive style (hypothetical data). RQ: do in-cab drowsiness alerts reduce accidents among long-haul truck drivers?
| Study | Type | Finding | Limitation |
|---|---|---|---|
| A | RCT, 120 drivers, 3 months | about 30% fewer near-misses with alerts | one company, short follow-up |
| B | observational, 2,000 trucks, 2 years | fewer accidents in trucks with alerts | fleets chose to install: no randomisation |
| C | interviews, 18 drivers | false alarms; some drivers switch alerts off | small sample, self-reported |
| D | systematic review, 25 studies | detection works well in simulators | few real-road trials; mostly cars |
**Weak — four mini-summaries:**
"Study A was an RCT and found that alerts reduced near-misses. Study B looked at 2,000 trucks and found fewer accidents. Study C interviewed 18 drivers who complained about false alarms. Study D reviewed 25 studies and found that detection works in simulators."
Why it loses marks: one sentence per study, ordered A–B–C–D, nothing compared, no difference explained, no gap.
**Strong — organised by findings, then methods and limitations:**
"Evidence on in-cab drowsiness alerts is promising but not yet conclusive. The two quantitative field studies point the same way: an RCT (Study A) reported about 30% fewer near-misses, and a larger observational study (Study B) found fewer accidents in equipped trucks, although B cannot rule out that safer fleets were the ones that installed the system. The systematic review (Study D) supports detection accuracy, but most of its evidence comes from simulators and cars rather than trucks on real roads. The interview study (Study C) suggests why real-world effects may be smaller: drivers report false alarms and sometimes switch the alerts off. Across all four studies, long-term real-road evidence for long-haul trucks remains limited."
How it is built:
- a **topic sentence** with the overall pattern;
- studies **grouped**: "A and B point the same way", "unlike A, B…";
- differences **explained by method** — RCT vs observational vs review vs interviews;
- a **shared limitation** and what is **still unknown** at the end;
- linking words: similarly, in contrast, whereas, however, together, across the studies, none of them.
> Exam trap: "Study A… Study B… Study C… Study D…" in four sentences gets low marks even if every fact is right — the marks are for comparing.
## Contradictions and limitations are clues
Study A: "Method X improves accuracy." Study B: "No improvement." Who is wrong? **Maybe neither.** Check: a different dataset or domain? model? language or metric? sample size or setup? An unexplained contradiction can itself be a gap.
| Limitation in a paper | Question it opens |
|---|---|
| Only English was evaluated | what about other languages? |
| Only one model was tested | how do results compare across models? |
| The evaluation set was small | would results hold at scale? |
## What a research gap is
Not "nobody has ever studied this" — that is almost never true. A gap is specific and **justified by the literature**:
- **Limited evidence** — very few studies, or only under narrow conditions.
- **Contradictory results** — studies disagree and the reason is unexplained.
- **Understudied context** — studied in one context (English) but not another (Kazakh).
- **Outdated evidence** — the studies are old and may not reflect current tools.
Not a gap: "I searched Google for five minutes and found nothing" (a search failure) or "I think ChatGPT is inaccurate" (an opinion). An author's "future work" is a clue too — check that nobody has done it since.
## The gap formula
= We know… → However… → We still do not know… → Therefore, this study will…
Bad: "There are not many studies about Kazakh LLMs." — vague, no evidence, fits almost any topic, does not say what is missing.
Better: "Existing studies have evaluated LLM factual QA in English and Russian. However, Kazakh has been studied mainly for translation. It remains unclear how accurately LLMs answer factual questions in Kazakh. This study will evaluate selected LLMs on Kazakh factual questions."
?? Using the table above, write one sentence with the shared limitation of Studies A–D.
?= Across all four studies, long-term real-road evidence for long-haul trucks is limited: A is short, B is not randomised, C is small and self-reported, D relies on simulators and cars.
?? A draft reads "Paper 1 says X. Paper 2 says Y." What is the first change?
?= Organise by theme instead of by paper: open each paragraph with a pattern (a shared finding, method or limitation) and cite several studies inside it.`,
        ru: `## Главная ошибка обзора литературы
«Smith (2021) found that… Lee (2022) found that… Kim (2023) found that… Ali (2023) found that…» — статьи пересказаны одна за другой. Это **отчёт, а не обзор (reporting, not reviewing)**. Настоящему обзору нужны **сравнение · связь · критика · синтез (comparison · connection · critique · synthesis)**.
| Пересказ (summary) — мало | Синтез (synthesis) — то, что нужно |
|---|---|
| по статьям: A говорит X, B говорит Y, C говорит Z | по темам: результат, вопрос метода, ограничение |
| каждая статья — отдельный остров | «A и B сходятся в том, что…»; «C даёт другой результат, возможно, потому что…» |
| различия перечислены, но не объяснены | «A и C использовали разные датасеты, что может объяснять…» |
| ни закономерности, ни пробела | «У всех трёх одно ограничение… Ни одна не оценивала…» → возможный пробел |
> Заставьте статьи разговаривать друг с другом: один абзац = одна мысль, и внутри него ссылки на несколько исследований.
## Матрица доказательств и мини-карта литературы
Перед письмом исследования сводят в одну таблицу (задание 4-й недели: разобрать 2–3 близких исследования и построить **мини-карту литературы (mini literature map)**). Столбцы одинаковые для всех статей:
| Статья | Метод и данные | Главный результат | Ограничение | Чего не хватает |
|---|---|---|---|---|
| Smith et al. (2023), гипотетическая | бенчмарк: 3 LLM, 500 вопросов, 5 областей | точность падает на 18–34% на малоресурсных языках | нет заданий на казахском | фактические вопросы на казахском |
@diagram rm4-synthesis
Чтение **по строке** даёт пересказ одной статьи; чтение **по столбцу** — тему для абзаца-синтеза. **Карта литературы (literature map)** показывает то же картинкой: RQ в центре, исследования сгруппированы по темам, линии — согласие или противоречие, а пустое место отмечает пробел.
## Задание экзамена: один аналитический абзац про Studies A–D
Тренировочный кейс в духе SafeDrive (данные гипотетические). RQ: снижают ли сигналы сонливости в кабине число аварий у водителей-дальнобойщиков?
| Исследование | Тип | Результат | Ограничение |
|---|---|---|---|
| A | RCT, 120 водителей, 3 месяца | примерно на 30% меньше опасных ситуаций (near-miss) с сигналами | одна компания, короткий срок |
| B | наблюдательное, 2 000 грузовиков, 2 года | меньше аварий в грузовиках с сигналами | автопарки сами решали ставить систему: без рандомизации |
| C | интервью, 18 водителей | ложные срабатывания; часть водителей выключает сигналы | маленькая выборка, ответы со слов участников |
| D | систематический обзор, 25 исследований | обнаружение хорошо работает в симуляторах | мало испытаний на реальных дорогах; в основном легковые авто |
**Слабо — четыре мини-пересказа:**
"Study A was an RCT and found that alerts reduced near-misses. Study B looked at 2,000 trucks and found fewer accidents. Study C interviewed 18 drivers who complained about false alarms. Study D reviewed 25 studies and found that detection works in simulators."
Почему теряются баллы: по предложению на исследование, порядок A–B–C–D, ничего не сравнено, различия не объяснены, пробела нет.
**Сильно — по результатам, затем по методам и ограничениям:**
"Evidence on in-cab drowsiness alerts is promising but not yet conclusive. The two quantitative field studies point the same way: an RCT (Study A) reported about 30% fewer near-misses, and a larger observational study (Study B) found fewer accidents in equipped trucks, although B cannot rule out that safer fleets were the ones that installed the system. The systematic review (Study D) supports detection accuracy, but most of its evidence comes from simulators and cars rather than trucks on real roads. The interview study (Study C) suggests why real-world effects may be smaller: drivers report false alarms and sometimes switch the alerts off. Across all four studies, long-term real-road evidence for long-haul trucks remains limited."
Как он устроен:
- **вводное предложение (topic sentence)** с общей картиной;
- исследования **сгруппированы**: «A and B point the same way», «unlike A, B…»;
- различия **объяснены методом** — RCT, наблюдательное, обзор, интервью;
- в конце — **общее ограничение** и то, что **всё ещё неизвестно**;
- связки: similarly, in contrast, whereas, however, together, across the studies, none of them.
> Ловушка экзамена: «Study A… Study B… Study C… Study D…» в четырёх предложениях получает мало баллов, даже если все факты верны, — баллы дают за сравнение.
## Противоречия и ограничения — это подсказки
Study A: «Метод X повышает точность». Study B: «Улучшения нет». Кто неправ? **Возможно, никто.** Проверить: другой датасет или область? модель? язык или метрика? размер выборки или постановка? Необъяснённое противоречие само может быть пробелом.
| Ограничение в статье | Какой вопрос открывает |
|---|---|
| Оценивался только английский | а другие языки? |
| Тестировалась одна модель | как выглядят результаты на других моделях? |
| Оценочный набор был маленьким | сохранятся ли результаты в масштабе? |
## Что такое исследовательский пробел
Не «никто никогда этого не изучал» — так почти не бывает. Пробел конкретен и **обоснован литературой**:
- **Мало доказательств (limited evidence)** — очень мало работ или только в узких условиях.
- **Противоречивые результаты (contradictory results)** — работы расходятся, и причина не объяснена.
- **Малоизученный контекст (understudied context)** — изучено в одном контексте (английский), но не в другом (казахский).
- **Устаревшие данные (outdated evidence)** — работы старые и могут не отражать нынешние инструменты.
Не пробел: «пять минут поиска в Google ничего не дали» (сбой поиска) или «мне кажется, ChatGPT неточен» (мнение). Раздел автора «future work» — тоже подсказка: стоит проверить, не сделал ли это уже кто-то.
## Формула пробела
= We know… → However… → We still do not know… → Therefore, this study will…
Плохо: "There are not many studies about Kazakh LLMs." — расплывчато, без доказательств, подходит почти к любой теме, не говорит, чего именно не хватает.
Лучше: "Existing studies have evaluated LLM factual QA in English and Russian. However, Kazakh has been studied mainly for translation. It remains unclear how accurately LLMs answer factual questions in Kazakh. This study will evaluate selected LLMs on Kazakh factual questions."
?? По таблице выше сформулируйте одним предложением общее ограничение Studies A–D.
?= Во всех четырёх мало долгосрочных данных с реальных дорог именно для дальнобойщиков: A — короткое, B — без рандомизации, C — маленькое и со слов участников, D — в основном симуляторы и легковые авто.
?? Черновик звучит как «Paper 1 says X. Paper 2 says Y.» Что поменять первым делом?
?= Строить текст по темам, а не по статьям: начинать абзац с закономерности (общий результат, метод или ограничение) и ссылаться внутри на несколько работ.`,
      },
      [
        qx("Which sentence is synthesis rather than summary?", "A and B both report fewer incidents, but only A randomised drivers.", [
          ["Study A was a randomised controlled trial with 120 long-haul truck drivers.", "It describes one study on its own — that is summary.", "Описано одно исследование само по себе — это пересказ."],
          ["Study B found fewer accidents in trucks with the alert system.", "One study, one finding, no connection — summary.", "Одно исследование, один результат, никакой связи — пересказ."],
          ["Study C interviewed eighteen drivers about the fatigue alarms.", "Again one study in isolation; nothing is compared.", "Снова одно исследование в отрыве; ничего не сравнивается."],
        ], "Synthesis connects studies: it states where they agree and explains a difference by method.", "Синтез связывает исследования: говорит, где они сходятся, и объясняет различие методом."),
        qx("An exam asks for one analytical paragraph comparing Studies A–D. Which structure earns the marks?", "Grouped by theme, with several studies cited per point", [
          ["One sentence per study, in the order A, B, C, D", "That is four mini-summaries — exactly what the task forbids.", "Это четыре мини-пересказа — ровно то, что задание запрещает."],
          ["Four short paragraphs, one paragraph for each of the studies", "Still organised by study, and the task asks for one comparative paragraph.", "Всё равно по исследованиям, а задание просит один сравнительный абзац."],
          ["A table copied from the case, with a sentence below", "A table is not a paragraph, and copying is not analysis.", "Таблица — не абзац, а копирование — не анализ."],
        ], "Organise by findings, methods or limitations: each point compares several studies and explains differences.", "Строить по результатам, методам или ограничениям: каждая мысль сравнивает несколько исследований и объясняет различия."),
        qx("What is wrong with: 'Study A found X. Study B found Y. Study C found Z. Study D found W.'?", "It reports studies one by one without comparing them", [
          ["It cites too many studies for one paragraph", "Four studies are fine; the problem is the lack of connection.", "Четыре исследования — нормально; проблема в отсутствии связи."],
          ["It should use author names instead of letters", "Labels do not matter; structure does.", "Обозначения не важны; важна структура."],
          ["It includes limitations, which should be left out of a review", "It mentions no limitations at all — and limitations are welcome in a synthesis.", "Ограничений там нет вовсе — а в синтезе они как раз нужны."],
        ], "This is reporting, not reviewing: no agreement, contradiction, explanation or gap is shown.", "Это отчёт, а не обзор: не показаны ни согласие, ни противоречие, ни объяснение, ни пробел."),
        qx("Which sentence opening signals synthesis?", "Unlike Study A, Study B found…", [
          ["Next, Study B states that…", "'Next' only moves to the following study; nothing is compared.", "«Далее» лишь переходит к следующему исследованию; ничего не сравнивается."],
          ["Another paper, Study B, reported that…", "It introduces one more paper instead of relating it to the others.", "Оно просто вводит ещё одну статью, не связывая её с другими."],
          ["Study B is a 2022 paper which found…", "Describing the paper's year and finding is still a summary.", "Год и результат статьи — это всё ещё пересказ."],
        ], "Comparative connectors (unlike, whereas, similarly, in contrast) make studies talk to each other.", "Сравнительные связки (unlike, whereas, similarly, in contrast) заставляют исследования разговаривать друг с другом."),
        qx("Study A (an RCT) found a clear benefit; Study B (observational) found a smaller one. How should a good paragraph treat this?", "Explain how the two designs may cause the difference", [
          ["Ignore Study B because RCTs are always right", "Discarding evidence is not synthesis; differences need explaining.", "Отбросить доказательство — не синтез; различия нужно объяснять."],
          ["Report both numbers and let the reader decide", "That is still summary — the paragraph must interpret the difference.", "Это всё ещё пересказ — абзац должен истолковать различие."],
          ["Average the two effects into one single overall number", "Averaging different designs hides why they differ.", "Усреднение разных дизайнов скрывает, почему они расходятся."],
        ], "Differences in design, sample or setting often explain different results — saying so is the analytical step.", "Различия дизайна, выборки или условий часто объясняют разные результаты — сказать об этом и есть аналитический шаг."),
        qx("In the SafeDrive-style table, which study explains WHY real-world effects may be smaller?", "Study C, the interviews about false alarms", [
          ["Study A, the randomised trial with 120 drivers", "A measures an effect; it does not explore drivers' reasons.", "A измеряет эффект, но не исследует причины водителей."],
          ["Study B, the observational fleet comparison", "B counts accidents; it shows association, not reasons.", "B считает аварии; оно показывает связь, а не причины."],
          ["Study D, the review of simulator studies", "D summarises detection accuracy, mostly in simulators.", "D обобщает точность обнаружения, в основном в симуляторах."],
        ], "Qualitative interview data explain mechanisms: false alarms lead drivers to switch alerts off.", "Качественные данные интервью объясняют механизм: из-за ложных срабатываний водители выключают сигналы."),
        qx("Which shared limitation could close a synthesis paragraph about Studies A–D?", "Real-road, long-term evidence for trucks is limited", [
          ["All four studies used exactly the same sample size", "They did not: 120 drivers, 2,000 trucks, 18 drivers, 25 studies.", "Нет: 120 водителей, 2 000 грузовиков, 18 водителей, 25 исследований."],
          ["None of the studies measured anything numerically", "A, B and D report numbers.", "A, B и D сообщают числа."],
          ["Every study was carried out only in a driving simulator", "Only D's evidence is mostly from simulators; A and B used real fleets.", "Только у D доказательства в основном из симуляторов; A и B работали с реальными автопарками."],
        ], "A is short, B is not randomised, C is small, D is simulator-based — together they leave long-term truck evidence thin.", "A — короткое, B — без рандомизации, C — маленькое, D — на симуляторах: вместе они оставляют мало долгосрочных данных по грузовикам."),
        qx("What is an evidence matrix?", "A table comparing papers across the same columns", [
          ["A list of all the references sorted in alphabetical order", "That is a reference list, not an analysis tool.", "Это список литературы, а не инструмент анализа."],
          ["A chart of how often each paper is cited", "Citation counts are not what the matrix records.", "Матрица не фиксирует число цитирований."],
          ["A short summary written for each paper", "Separate summaries are exactly what the matrix replaces.", "Отдельные пересказы — как раз то, что матрица заменяет."],
        ], "Same columns (method, data, finding, limitation, what is missing) for every paper reveal patterns and gaps.", "Одинаковые столбцы (метод, данные, результат, ограничение, чего не хватает) для каждой статьи показывают закономерности и пробелы."),
        qx("Reading DOWN one column of an evidence matrix, such as 'Limitation', helps you to…", "Write one theme paragraph across several studies", [
          ["Summarise one paper in full detail from start to end", "One paper in full is a row, not a column.", "Одна статья целиком — это строка, а не столбец."],
          ["Check that the reference list follows APA format", "The matrix is about content, not citation formatting.", "Матрица — про содержание, а не про оформление ссылок."],
          ["Count how many papers each author wrote", "Author productivity is not part of the matrix.", "Продуктивность авторов в матрицу не входит."],
        ], "A column collects one aspect for all studies — exactly the material for a synthesis paragraph.", "Столбец собирает один аспект по всем исследованиям — ровно материал для абзаца-синтеза."),
        qx("Study A says Method X improves accuracy; Study B says it does not. What is the best first reaction?", "Compare their datasets, models, metrics and samples", [
          ["Decide that Study B is wrong and drop it", "Maybe neither is wrong; the context may differ.", "Возможно, неправ никто; может отличаться контекст."],
          ["Cite only the study that best supports your own hypothesis", "Cherry-picking hides the contradiction instead of explaining it.", "Выборочное цитирование скрывает противоречие, а не объясняет его."],
          ["Conclude that Method X has no effect at all", "One null result does not cancel another positive one without analysis.", "Один нулевой результат не отменяет положительный без анализа."],
        ], "Contradictions are valuable: differences in dataset, model, language, metric or setup may explain them — or reveal a gap.", "Противоречия ценны: их могут объяснять различия датасета, модели, языка, метрики или постановки — или они укажут на пробел."),
        qx("The Week 4 task asks for a mini literature map. What does it show?", "Studies grouped by theme, with links and the gap", [
          ["Where each paper's authors work in the world", "A literature map is about ideas, not geography.", "Карта литературы — про идеи, а не про географию."],
          ["The full reference list formatted in the required citation style", "That is a bibliography, not a map of relationships.", "Это библиография, а не карта связей."],
          ["A timeline of when each database was created", "Database history has nothing to do with your RQ.", "История баз данных не имеет отношения к вашему RQ."],
        ], "RQ in the centre, studies clustered by theme, lines for agreement or contradiction, an empty area for the gap.", "RQ в центре, исследования сгруппированы по темам, линии — согласие или противоречие, пустое место — пробел."),
        qx("Which statement is a research gap justified by the literature?", "Reviewed studies cover cars; evidence for trucks remains limited.", [
          ["I searched Google for five minutes and found nothing on this topic.", "That is a search failure, not a gap.", "Это сбой поиска, а не пробел."],
          ["I personally think fatigue alarms are annoying for most drivers.", "A personal opinion is not grounded in the literature.", "Личное мнение не опирается на литературу."],
          ["There are not many studies about driver fatigue systems in general.", "Too vague: no evidence, and it does not say what exactly is missing.", "Слишком расплывчато: нет доказательств, и не сказано, чего именно не хватает."],
        ], "A gap must come from what reviewed studies did and did not do — here, a context they did not cover.", "Пробел вытекает из того, что рассмотренные работы сделали и чего не сделали, — здесь это контекст, который они не охватили."),
        qx("Studies disagree, and nobody has explained why. Which type of gap is this?", "Contradictory results — studies disagree", [
          ["Outdated evidence — studies are too old", "Age of the studies is not the issue here; their disagreement is.", "Дело не в возрасте работ, а в их расхождении."],
          ["Understudied context — only other settings", "Context gaps are about a setting not yet studied, not disagreement.", "Пробел контекста — про неизученную среду, а не про расхождение."],
          ["Limited evidence — very few studies exist", "There are studies; they just conflict.", "Исследования есть; они просто противоречат друг другу."],
        ], "Unexplained disagreement between studies is the 'contradictory results' form of a gap.", "Необъяснённое расхождение между работами — это форма пробела «противоречивые результаты»."),
        qx("LLM factual QA has been studied in English but not in Kazakh. Which gap type is this?", "Understudied context", [
          ["Contradictory results", "Nothing here says the studies disagree.", "Здесь ничего не говорит о том, что работы расходятся."],
          ["Outdated evidence", "The issue is the language, not the age of the studies.", "Проблема в языке, а не в возрасте работ."],
          ["Limited evidence", "The question itself is well studied — only not in this context.", "Сам вопрос хорошо изучен — только не в этом контексте."],
        ], "Studied in one context (English) but not in another (Kazakh) is an understudied context.", "Изучено в одном контексте (английский), но не в другом (казахский) — это малоизученный контекст."),
        qx("What is the correct order of the gap formula?", "We know → However → We still do not know → Therefore", [
          ["However → We know → Therefore → We still do not know", "The formula starts from established knowledge, not from 'however'.", "Формула начинается с установленного знания, а не с «однако»."],
          ["We still do not know → We know → However → Therefore", "The unknown comes after the known and the 'however'.", "Неизвестное идёт после известного и «однако»."],
          ["We know → Therefore → However → We still do not know", "'Therefore, this study will…' is the conclusion, so it comes last.", "«Therefore, this study will…» — вывод, он идёт последним."],
        ], "Known → limitation or disagreement → what is still unknown → what this study will do.", "Известное → ограничение или расхождение → что ещё неизвестно → что сделает это исследование."),
        qx("Why is 'There are not many studies about Kazakh LLMs' a weak gap statement?", "It is vague, unsupported and fits almost any topic", [
          ["It is far too long and detailed for a research proposal", "It is one short sentence; the problem is content, not length.", "Это одно короткое предложение; проблема в содержании, а не в длине."],
          ["It names a specific language, which reviewers dislike", "Naming a context is good; the statement just lacks evidence.", "Назвать контекст — хорошо; утверждению просто не хватает доказательств."],
          ["It is written in the first person", "There is no 'I' in it; the problem is that nothing supports it.", "В нём нет «я»; проблема в том, что его ничто не подтверждает."],
        ], "A better gap says what studies did, what they focused on, what remains unclear — backed by real papers.", "Хороший пробел говорит, что сделали работы, на чём сосредоточились и что неясно, — с опорой на реальные статьи."),
        qx("A paper's 'Future work' says: 'Other languages should be tested.' What must you do before claiming this as your gap?", "Check newer papers in case it has been done since", [
          ["Nothing — the author's suggestion proves the gap", "Future work is a clue, not proof; someone may have done it already.", "Future work — подсказка, а не доказательство; это уже могли сделать."],
          ["Copy the sentence into your proposal as your own", "Copying without citation is plagiarism.", "Копирование без ссылки — плагиат."],
          ["Email the author to ask for permission to study it", "No permission is needed; verification is.", "Разрешение не нужно; нужна проверка."],
        ], "Verify: has it been done since, is it relevant to your project, and can you realistically investigate it?", "Проверить: не сделано ли это позже, относится ли к проекту и реально ли это исследовать."),
        tfx("A good synthesis paragraph may mention a study's limitation as part of the argument.", true,
          "Limitations are clues: a shared limitation often leads straight to the gap at the end of the paragraph.",
          "Ограничения — подсказки: общее ограничение часто прямо ведёт к пробелу в конце абзаца.",
          "'False' treats limitations as weaknesses to hide; the lecture calls them clues, not dead ends.",
          "Ответ «неверно» считает ограничения слабостью, которую надо прятать; лекция называет их подсказками, а не тупиками."),
        tfx("A research gap means that nobody in the world has ever studied the topic.", false,
          "A gap is specific: limited evidence, contradictory results, an understudied context or outdated evidence — justified by the literature.",
          "Пробел конкретен: мало доказательств, противоречивые результаты, малоизученный контекст или устаревшие данные — и он обоснован литературой.",
          "'True' sets an impossible bar: almost every topic has been studied somewhere.",
          "Ответ «верно» ставит недостижимую планку: почти любую тему где-то уже изучали."),
        qx("Which closing sentence best ends a synthesis paragraph about Studies A–D?", "Together, they leave long-term effects on truck drivers unclear.", [
          ["In conclusion, Study D was a systematic review of 25 studies.", "It restates one study instead of drawing the pattern.", "Оно повторяет одно исследование вместо общей картины."],
          ["Overall, all four of these studies are very interesting and useful for us.", "Empty praise: no pattern, no limitation, no gap.", "Пустая похвала: ни закономерности, ни ограничения, ни пробела."],
          ["Finally, Study C interviewed 18 drivers about the alarms.", "Another mini-summary at the end.", "Ещё один мини-пересказ в конце."],
        ], "A strong ending states what all the studies together leave unknown — the bridge to the gap.", "Сильная концовка говорит, что все исследования вместе оставляют неизвестным, — мост к пробелу."),
      ],
    ),
    part(
      "rm-l4-p4",
      { en: "From gap to a one-page research plan", ru: "От пробела к плану исследования на одну страницу" },
      {
        en: `## Now we can plan
The literature review was not background reading — it showed **why** your study may be needed.
= Literature → Synthesis → Evidence → Research gap → Research question
## What a research plan is
A **logical plan for turning a research question into evidence**. In Week 4 it is **preliminary** — the full methodology comes from Week 5. It answers five questions:
- What **evidence** do I need to answer my RQ?
- **Where** can I get that evidence or data?
- **How** could I collect or generate it?
- How could I **analyse** it?
- Can I actually do it — is it **feasible**?
## Methods are not a shopping list
Bad: "For my research I will use: survey, interview, experiment, machine learning, ChatGPT." — no link to the RQ; it is a list of things the student knows how to do.
> A method is selected because it helps answer the research question — not because it sounds impressive or was learned in another course.
## Research question → evidence
| Research question | Possible evidence | Data |
|---|---|---|
| What types of errors occur in Kazakh LLM responses? | LLM responses collected systematically + manual error annotation and classification | categories, then counts |
| Why do students stop using an educational app? | user interviews + app usage logs showing drop-off points | qualitative + quantitative |
| Does Tool X reduce debugging time? | task completion time in an experiment with and without Tool X | quantitative |
Rule of thumb: **why / how / what is it like** → interviews (qualitative); **does X change Y / by how much** → experiment or measurement (quantitative); **how often / is X related to Y** → existing data, logs or a survey.
## The one-page research plan (course template)
Ten sections on **one A4 page** (references excluded). Concise — not an essay.
| # | Section | What to write |
|---|---|---|
| 1 | Research topic | the specific topic of the study |
| 2 | Research problem | 2–3 sentences: what problem exists, what is not sufficiently known, why it is worth investigating |
| 3 | Research aim | one clear sentence: what the study intends to achieve |
| 4 | Research question(s) | one main RQ (+ one supporting if needed), answerable through research |
| 5 | Evidence needed | be specific: survey responses, software metrics, test results, interview data, system logs, measurements |
| 6 | Participants / data source | who or what provides the data; approximate sample or dataset size |
| 7 | Data collection method | survey, experiment, interview, observation, existing dataset, repository analysis |
| 8 | Research procedure | 3–5 logical steps from data collection to results |
| 9 | Expected analysis | descriptive statistics, group comparison, correlation, thematic analysis, model evaluation |
| 10 | Feasibility and limitation | one realistic limitation + why the study can still be completed |
Mini example (SafeDrive style): **RQ** — do in-cab drowsiness alerts reduce near-miss events among long-haul drivers over 8 weeks? **Evidence** — near-miss counts from telematics. **Data source** — about 40 drivers of one partner company. **Method** — compare 4 weeks without alerts with 4 weeks with alerts. **Analysis** — mean near-misses per 1,000 km, before vs after. **Limitation** — one company, so results may not generalise; the data are already logged, so the study fits the course timeline.
## Reality check: is it feasible?
Six checks: **time · data access · computing · skills · ethics · scope.** Green — feasible, proceed. Yellow — needs changes, adjust the scope. Red — not feasible yet, redesign.
The GPU story: "I will train a new 70B-parameter LLM from scratch" — a personal laptop, 12 weeks, no GPU cluster, no training dataset, no compute budget. A legitimate research **area**, but **not a feasible plan**.
> Adjust the scope — not the ambition.
## The alignment check
@diagram rm4-alignment
= Problem → Aim → Research question → Evidence → Method → Analysis
At every link ask: **does this step follow from the previous one?** A NO marks exactly where to revise.
Broken link: RQ "Why do drivers switch off fatigue alerts?" + method "count accidents in fleet records". The question asks **why**, the method measures **how many**. Fix: interviews with drivers.
- The instructor's oral check: why this question? why these data? why this method? how will the evidence answer the RQ?
- Final check: the data can realistically be obtained; the method can actually answer the RQ; literature claims are cited; **no invented sources, data, results or references.**
## Exit ticket
Can you name: your RQ · 3–5 keywords · what the literature already says · one contradiction or limitation · your possible gap · the evidence you need · an honest answer on feasibility?
> Don't just find papers — find the story the papers are telling.
?? Plan: RQ "Does Tool X reduce debugging time?", method "interviews with 10 developers". What is wrong?
?= Misalignment: the RQ asks for a measured effect (quantitative), but interviews give opinions. Measure task completion time with and without Tool X.
?? Name the six feasibility checks.
?= Time, data access, computing, skills, ethics, scope.`,
        ru: `## Теперь можно планировать
Обзор литературы был не фоновым чтением — он показал, **зачем** может быть нужно ваше исследование.
= Literature → Synthesis → Evidence → Research gap → Research question
## Что такое план исследования
**План исследования (research plan)** — логический план того, как превратить исследовательский вопрос в доказательства. На 4-й неделе он **предварительный** — полная методология начинается с 5-й недели. Он отвечает на пять вопросов:
- Какие **доказательства** нужны, чтобы ответить на RQ?
- **Где** взять эти доказательства или данные?
- **Как** их можно собрать или получить?
- Как их **анализировать**?
- Получится ли это на деле — **выполнимо ли (feasible)**?
## Методы — не список покупок
Плохо: «For my research I will use: survey, interview, experiment, machine learning, ChatGPT.» — никакой связи с RQ; это перечень того, что студент умеет делать.
> Метод выбирают потому, что он помогает ответить на исследовательский вопрос, — а не потому, что звучит солидно или изучался на другом курсе.
## Исследовательский вопрос → доказательства
| Исследовательский вопрос | Возможные доказательства | Данные |
|---|---|---|
| Какие типы ошибок бывают в ответах LLM на казахском? | систематически собранные ответы LLM + ручная разметка и классификация ошибок | категории, затем подсчёт |
| Почему студенты перестают пользоваться учебным приложением? | интервью с пользователями + логи использования, где видно, на каком шаге уходят | качественные + количественные |
| Сокращает ли Tool X время отладки? | время выполнения задачи в эксперименте с Tool X и без него | количественные |
Правило: **почему / как / каково это** → интервью (качественные данные); **меняет ли X величину Y / насколько** → эксперимент или измерение (количественные); **как часто / связан ли X с Y** → готовые данные, логи или опрос.
## План исследования на одну страницу (шаблон курса)
Десять разделов на **одной странице A4** (без списка литературы). Кратко — не эссе.
| # | Раздел | Что писать |
|---|---|---|
| 1 | Research topic — тема | конкретная тема исследования |
| 2 | Research problem — проблема | 2–3 предложения: какая проблема есть, что недостаточно известно, почему это стоит изучать |
| 3 | Research aim — цель | одно ясное предложение: чего исследование должно достичь |
| 4 | Research question(s) — вопрос(ы) | один главный RQ (+ один вспомогательный при необходимости), на который можно ответить исследованием |
| 5 | Evidence needed — нужные доказательства | конкретно: ответы опроса, метрики ПО, результаты тестов, данные интервью, системные логи, измерения |
| 6 | Participants / data source — участники / источник данных | кто или что даёт данные; примерный размер выборки или датасета |
| 7 | Data collection method — метод сбора данных | опрос, эксперимент, интервью, наблюдение, готовый датасет, анализ репозиториев |
| 8 | Research procedure — процедура | 3–5 логичных шагов от сбора данных до результатов |
| 9 | Expected analysis — ожидаемый анализ | описательная статистика, сравнение групп, корреляция, тематический анализ, оценка модели |
| 10 | Feasibility and limitation — выполнимость и ограничение | одно реальное ограничение + почему исследование всё равно можно завершить |
Мини-пример (в духе SafeDrive): **RQ** — снижают ли сигналы сонливости в кабине число опасных ситуаций (near-miss) у дальнобойщиков за 8 недель? **Доказательства** — число near-miss по данным телематики. **Источник данных** — около 40 водителей одной компании-партнёра. **Метод** — сравнить 4 недели без сигналов и 4 недели с сигналами. **Анализ** — среднее число near-miss на 1 000 км до и после. **Ограничение** — одна компания, поэтому результаты могут не обобщаться; зато данные уже записываются, и исследование укладывается в сроки курса.
## Проверка реальностью: выполнимо ли?
Шесть проверок: **время · доступ к данным · вычисления · навыки · этика · объём (scope).** Зелёный — выполнимо, можно начинать. Жёлтый — нужны изменения, сузить объём. Красный — пока невыполнимо, перепроектировать.
История про GPU: «Обучу новую LLM на 70 млрд параметров с нуля» — личный ноутбук, 12 недель, нет GPU-кластера, нет обучающего датасета, нет вычислительного бюджета. Законная исследовательская **область**, но **невыполнимый план**.
> Сужать объём, а не амбиции (adjust the scope — not the ambition).
## Проверка согласованности
@diagram rm4-alignment
= Problem → Aim → Research question → Evidence → Method → Analysis
На каждой связи спрашивают: **следует ли этот шаг из предыдущего?** Ответ «нет» показывает, где именно нужно исправлять.
Разрыв: RQ «Почему водители выключают сигналы усталости?» + метод «посчитать аварии по записям автопарка». Вопрос — **почему**, а метод измеряет **сколько**. Исправление: интервью с водителями.
- Устная проверка преподавателя: почему этот вопрос? почему эти данные? почему этот метод? как доказательства ответят на RQ?
- Финальная проверка: данные реально получить; метод действительно отвечает на RQ; утверждения из литературы со ссылками; **никаких выдуманных источников, данных, результатов и ссылок.**
## Exit ticket
Получится ли назвать: свой RQ · 3–5 ключевых слов · что уже говорит литература · одно противоречие или ограничение · возможный пробел · нужные доказательства · честный ответ о выполнимости?
> Искать не просто статьи — искать историю, которую они рассказывают.
?? План: RQ «Сокращает ли Tool X время отладки?», метод — «интервью с 10 разработчиками». Что не так?
?= Рассогласование: RQ спрашивает об измеряемом эффекте (количественные данные), а интервью дают мнения. Нужно измерить время выполнения задач с Tool X и без него.
?? Назовите шесть проверок выполнимости.
?= Время, доступ к данным, вычисления, навыки, этика, объём (scope).`,
      },
      [
        qx("What is a research plan at the Week 4 stage?", "A preliminary logical plan for turning an RQ into evidence", [
          ["A complete methodology chapter with every statistical test", "The full methodology comes later, from Week 5.", "Полная методология будет позже, с 5-й недели."],
          ["A list of the methods the student already knows", "That is the 'shopping list' mistake.", "Это ошибка «списка покупок»."],
          ["A timetable of lectures and assignment deadlines", "A course schedule is not a research plan.", "Расписание курса — не план исследования."],
        ], "It asks: what evidence, where from, how to collect, how to analyse, is it feasible.", "Он спрашивает: какие доказательства, откуда, как собрать, как анализировать, выполнимо ли."),
        qx("'For my research I will use: survey, interview, experiment, machine learning, ChatGPT.' What is wrong?", "The methods are not linked to the research question", [
          ["It lists far too few methods for a strong, convincing study", "More methods would not help; the issue is that none is tied to the RQ.", "Больше методов не помогло бы; проблема в том, что ни один не связан с RQ."],
          ["ChatGPT may never be used in research", "AI tools can help with keywords and notes if used honestly; that is not the issue.", "ИИ-инструменты могут помогать с ключевыми словами и заметками при честном использовании; дело не в этом."],
          ["Surveys and interviews cannot be combined", "Mixed methods are legitimate when the RQ justifies them.", "Смешанные методы допустимы, если их оправдывает RQ."],
        ], "A method is chosen because it helps answer the RQ, not because it sounds impressive.", "Метод выбирают, потому что он помогает ответить на RQ, а не потому, что звучит солидно."),
        qx("RQ: 'Does Tool X reduce debugging time?' Which evidence fits?", "Task times measured with and without Tool X", [
          ["Interviews about how developers feel about Tool X", "Feelings do not measure time; the RQ asks for a measured effect.", "Ощущения не измеряют время; RQ спрашивает об измеряемом эффекте."],
          ["A survey asking which IDE developers prefer", "IDE preference does not answer a question about debugging time.", "Предпочтения IDE не отвечают на вопрос о времени отладки."],
          ["A literature list of debugging tools", "A list of tools produces no evidence about Tool X's effect.", "Список инструментов не даёт доказательств об эффекте Tool X."],
        ], "An experimental comparison of task completion time directly answers 'does it reduce time'.", "Экспериментальное сравнение времени выполнения задач прямо отвечает на «сокращает ли время»."),
        qx("RQ: 'Why do students stop using an educational app?' Which evidence did the lecture suggest?", "User interviews plus usage logs showing drop-off points", [
          ["A controlled lab experiment measuring students' typing speed", "Typing speed is unrelated to why students leave the app.", "Скорость печати не связана с тем, почему студенты уходят из приложения."],
          ["App store download counts for the last year", "Downloads show how many start, not why they stop.", "Загрузки показывают, сколько начали, а не почему бросили."],
          ["A benchmark of the app's server response time", "Server speed is one possible cause, but it does not cover students' reasons.", "Скорость сервера — лишь одна возможная причина, она не раскрывает причин студентов."],
        ], "Interviews explain why (qualitative); logs show where they drop off (quantitative).", "Интервью объясняют «почему» (качественные данные); логи показывают, где уходят (количественные)."),
        qx("RQ: 'What types of errors occur in Kazakh LLM responses?' Which evidence fits?", "Collected responses with manual error annotation", [
          ["A survey on how much students like using the LLM in class", "Liking the model says nothing about error types.", "Симпатия к модели ничего не говорит о типах ошибок."],
          ["Server logs showing response latency", "Latency is speed, not error type.", "Задержка — это скорость, а не тип ошибки."],
          ["An RCT comparing two keyboard layouts", "Keyboard layouts are unrelated to LLM errors.", "Раскладки клавиатуры не связаны с ошибками LLM."],
        ], "Systematically collected responses, annotated and classified by hand, show which errors occur.", "Систематически собранные ответы, размеченные и классифицированные вручную, показывают, какие ошибки бывают."),
        qx("Which section of the one-page plan must be ONE clear sentence?", "Research aim — what the study intends to achieve", [
          ["Research problem — what is not sufficiently known", "The problem takes 2–3 sentences.", "Проблеме отводят 2–3 предложения."],
          ["Research procedure — how the study runs step by step", "The procedure is 3–5 logical steps.", "Процедура — это 3–5 логичных шагов."],
          ["Data source — who or what provides the data", "This section names participants or datasets with a size; no one-sentence rule.", "Здесь называют участников или датасеты с размером; правила «одно предложение» нет."],
        ], "The template asks for one clear sentence stating what the study intends to achieve.", "Шаблон требует одно ясное предложение о том, чего исследование должно достичь."),
        qx("How long should the research problem section be in the course template?", "2–3 sentences on what is unknown and why it matters", [
          ["One word naming the general research area", "One word cannot explain the problem, the unknown and its importance.", "Одно слово не объяснит проблему, неизвестное и его важность."],
          ["A full page that reviews all of the related studies in detail", "The whole plan must fit one page; the problem is 2–3 sentences.", "Весь план должен уместиться на одной странице; проблема — 2–3 предложения."],
          ["3–5 numbered steps from data to results", "That is the research procedure section.", "Это раздел «процедура исследования»."],
        ], "What problem exists, what is not sufficiently known, why it is worth investigating — in 2–3 sentences.", "Какая проблема есть, что недостаточно известно, почему стоит изучать — в 2–3 предложениях."),
        qx("In the 'Participants / data source' section, what should be given where possible?", "An approximate sample or dataset size", [
          ["The participants' full names and phone numbers", "Personal data never belong in a plan — an ethics problem.", "Персональным данным не место в плане — это этическая проблема."],
          ["The final results expected from the data", "Results are not known yet; this section names who or what gives data.", "Результаты ещё неизвестны; раздел называет, кто или что даёт данные."],
          ["A list of every database searched", "Searched databases belong to the literature search, not the data source.", "Базы поиска относятся к поиску литературы, а не к источнику данных."],
        ], "Identify who or what provides the data and give an approximate size, e.g. 40 drivers or 500 QA items.", "Указать, кто или что даёт данные, и примерный размер, например 40 водителей или 500 вопросов."),
        qx("Which item is an 'Expected analysis' entry rather than a data collection method?", "Thematic analysis of interview transcripts", [
          ["Semi-structured interviews with 12 users", "Interviews are a way to collect data.", "Интервью — способ собрать данные."],
          ["An online survey sent to two hundred students", "A survey is a data collection method.", "Опрос — метод сбора данных."],
          ["Mining commits from public repositories", "Repository analysis collects data; the analysis comes after.", "Анализ репозиториев собирает данные; анализ идёт потом."],
        ], "Analysis is what you do with the collected data: descriptive statistics, comparison, correlation, thematic analysis, model evaluation.", "Анализ — то, что делают с собранными данными: описательная статистика, сравнение, корреляция, тематический анализ, оценка модели."),
        qx("Which statement about the 'Feasibility and limitation' section is correct?", "One real limitation, plus why the study still works", [
          ["Claim the study has no limitations at all", "Every study has limitations; hiding them weakens the plan.", "У любого исследования есть ограничения; их сокрытие ослабляет план."],
          ["List every possible risk that the project might ever face", "The template asks for one realistic limitation, not a risk register.", "Шаблон просит одно реальное ограничение, а не реестр рисков."],
          ["Describe how the results will change the world", "Impact claims are not feasibility.", "Заявления о влиянии — это не выполнимость."],
        ], "Name one realistic limitation and explain why the study can still be completed with the time, data and resources available.", "Назвать одно реальное ограничение и объяснить, почему исследование всё равно можно завершить с имеющимися временем, данными и ресурсами."),
        qx("What is the length limit of the course research plan?", "One A4 page, not counting references", [
          ["Two pages, including the references", "The limit is one page, and references are excluded.", "Лимит — одна страница, и список литературы не считается."],
          ["Five pages, with a full literature review", "It must be concise — one page, not an essay.", "План должен быть кратким — одна страница, а не эссе."],
          ["No limit, as long as it is detailed", "There is a strict one-page limit.", "Есть жёсткий лимит в одну страницу."],
        ], "ONE A4 page, excluding the reference list — write concisely.", "ОДНА страница A4 без списка литературы — писать кратко."),
        qx("A student plans to train a new 70B-parameter LLM from scratch on a laptop in 12 weeks. What is the verdict?", "A legitimate area, but the plan is not feasible", [
          ["A bad question, because LLM training is not research", "LLM training is a legitimate research area.", "Обучение LLM — законная исследовательская область."],
          ["A feasible plan if the student works every weekend", "Effort cannot replace a GPU cluster, data and a compute budget.", "Усердие не заменит GPU-кластер, данные и вычислительный бюджет."],
          ["A good plan: ambition matters most", "Ambition without resources does not produce results.", "Амбиции без ресурсов не дают результатов."],
        ], "Good question area, infeasible plan: no GPU cluster, no dataset, no budget. Adjust the scope, not the ambition.", "Хорошая область, невыполнимый план: нет GPU-кластера, датасета и бюджета. Сужать объём, а не амбиции."),
        qx("Which response to an infeasible plan follows the lecture's advice?", "Keep the ambition but narrow the scope", [
          ["Drop the research area altogether", "The area can stay; the scope must shrink.", "Область можно оставить; сужать нужно объём."],
          ["Keep the plan and ask for a deadline extension", "More time does not fix missing data or compute.", "Больше времени не решит нехватку данных или вычислений."],
          ["Replace real data with invented results", "Inventing data or results is research misconduct.", "Выдумывать данные или результаты — нарушение научной этики."],
        ], "'Adjust the scope — not the ambition': e.g. fine-tune or evaluate an existing model instead of training one from scratch.", "«Сужать объём, а не амбиции»: например, дообучить или оценить готовую модель вместо обучения с нуля."),
        qx("Which set lists the six feasibility checks?", "Time, data access, computing, skills, ethics, scope", [
          ["Title, abstract, method, results, discussion, references", "Those are parts of a paper.", "Это части научной статьи."],
          ["Budget, marketing, team, design, branding, launch", "Those are business-project concerns, not the lecture's checklist.", "Это заботы бизнес-проекта, а не чек-лист лекции."],
          ["Concepts, synonyms, keywords, query, filter, read", "Those are search steps.", "Это шаги поиска."],
        ], "Time · data access · computing · skills · ethics · scope, each rated green, yellow or red.", "Время · доступ к данным · вычисления · навыки · этика · объём, каждое — зелёный, жёлтый или красный."),
        qx("A feasibility check comes out YELLOW. What does that mean?", "The plan needs changes, such as a smaller scope", [
          ["The plan is feasible and can start right away", "That is green.", "Это зелёный."],
          ["The plan must be completely redesigned", "That is red: not feasible yet.", "Это красный: пока невыполнимо."],
          ["The plan is on hold until the ethics committee replies", "Yellow is about adjusting scope, not waiting for approval.", "Жёлтый — про корректировку объёма, а не про ожидание одобрения."],
        ], "Green — proceed; yellow — needs changes, adjust scope; red — not feasible yet, redesign.", "Зелёный — начинать; жёлтый — нужны изменения, сузить объём; красный — пока невыполнимо, перепроектировать."),
        qx("Plan: RQ 'Why do drivers switch off fatigue alerts?'; method 'count accidents in fleet records'. Where is the break?", "Between the question and the method", [
          ["Between the problem and the aim", "Problem and aim can both be about alerts; the break is later.", "Проблема и цель обе могут быть про сигналы; разрыв дальше."],
          ["Between the analysis and the results", "The chain already broke earlier, at the method.", "Цепочка порвалась раньше — на методе."],
          ["Nowhere — counting accidents answers why", "Counts show how many, not why drivers act as they do.", "Подсчёт показывает «сколько», а не почему водители так поступают."],
        ], "A 'why' question needs qualitative evidence such as interviews; accident counts cannot answer it.", "Вопрос «почему» требует качественных доказательств, например интервью; подсчёт аварий на него не отвечает."),
        qx("Which chain does the course's final check require every plan to follow?", "Problem → Aim → RQ → Evidence → Method → Analysis", [
          ["Method → RQ → Problem → Aim → Evidence → Analysis", "Starting from the method is the shopping-list mistake.", "Начинать с метода — ошибка «списка покупок»."],
          ["Aim → Analysis → Method → Problem → RQ → Evidence", "Analysis cannot come before the evidence and the method.", "Анализ не может идти раньше доказательств и метода."],
          ["Evidence → Problem → Analysis → RQ → Aim → Method", "Evidence is chosen to answer the RQ, so it comes after it.", "Доказательства выбирают под RQ, поэтому они идут после него."],
        ], "Each element follows from the previous one; a break anywhere means the design must be revised there.", "Каждый элемент следует из предыдущего; разрыв в любом месте — сигнал исправить план именно там."),
        tfx("In the research plan, a claim based on the literature may be stated without a citation if it is widely known.", false,
          "The final check says claims based on literature are cited; do not invent sources, data, results or references.",
          "Финальная проверка требует ссылок для утверждений из литературы; нельзя выдумывать источники, данные, результаты и ссылки.",
          "'True' would let unsupported claims into the plan, and the oral check may ask for the evidence.",
          "Ответ «верно» пропустил бы в план неподкреплённые утверждения, а на устной проверке могут спросить о доказательствах."),
        qx("During the oral check the instructor asks 'Why this method?' Which answer is strongest?", "It produces exactly the evidence my RQ needs", [
          ["It is the method I know best from other courses", "Familiarity is not a reason; fit to the RQ is.", "Привычность — не причина; причина — соответствие RQ."],
          ["It sounds impressive to the examiners", "Sounding impressive is exactly what the lecture warns against.", "Звучать солидно — именно то, от чего предостерегает лекция."],
          ["Most students in my group chose it", "Popularity says nothing about fit to your question.", "Популярность ничего не говорит о соответствии вопросу."],
        ], "A method is justified by the evidence it produces for the specific RQ.", "Метод оправдывают тем, какие доказательства он даёт для конкретного RQ."),
        qx("Which RQ–method pair is aligned?", "'How often do bugs reopen?' — analysis of issue-tracker logs", [
          ["'Why do developers distrust AI tools?' — a CPU speed benchmark", "A 'why' question needs interviews, not hardware benchmarks.", "Вопросу «почему» нужны интервью, а не бенчмарки железа."],
          ["'Does Tool X speed up tests?' — interviews about feelings", "A speed question needs measured times, not opinions.", "Вопросу о скорости нужно измеренное время, а не мнения."],
          ["'How do novices feel about pair work?' — code size metrics", "Feelings need qualitative data, not lines-of-code counts.", "Для ощущений нужны качественные данные, а не число строк кода."],
        ], "'How often' is a frequency question, and existing issue-tracker data measure exactly that.", "«Как часто» — вопрос о частоте, и готовые данные трекера задач измеряют именно её."),
      ],
    ),
  ],
};
