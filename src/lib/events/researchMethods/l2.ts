import { part, qx, tfx, type Lecture } from "../types";

/**
 * Лекция 2 RMT (неделя 2): «Research detective» — от утверждения к
 * доказательствам, пробелу и исследовательскому вопросу. Источник — слайды
 * «YOUR CASE IS OPEN», практическое задание 2 (Developing a Research
 * Question) и реальный Practice Quiz 3 (кейс SafeDrive): постановка
 * проблемы из трёх частей, RQ с группой/фактором/результатом, пробел без
 * «no research exists», «will definitely» как необоснованное утверждение.
 */

const p1 = part(
  "rm-l2-p1",
  { en: "From claim to problem statement", ru: "От утверждения к постановке проблемы" },
  {
    en: `## Where this lecture sits
Week 1 went from a broad **area** to a focused **topic** and a **problem**. Week 2 has two jobs: **prove** with academic literature that the problem deserves research attention, and turn it into a **research question** (RQ).
= Problem → Evidence → Gap → Research question
The detective session has six steps: **keywords → find papers → screen fast → compare → detect the gap → refine the question**.
> You already THINK you found a problem. Now PROVE IT.
## Case #001: a claim is not research
"Kazakh-language LLMs are bad." Is this enough to open a research paper? **No.** It is an opinion until it is supported by measurable, documented evidence from prior scholarly work.
| | Claim only | Research-based statement |
|---|---|---|
| Example | "Kazakh LLMs have many problems." | "Previous studies report limitations in factual accuracy for low-resource language LLMs, including Kazakh-language tasks." |
| Source | "I think so." | cited academic literature with a DOI |
| In a paper? | no: not verifiable, not reproducible, not scholarly | yes: any reader can check the cited studies |
= CLAIM + ACADEMIC EVIDENCE = RESEARCH ARGUMENT
> Your first job is NOT to prove you are right. It is to discover what previous research actually says — even if it surprises you.
## Five sentence types the quiz mixes up
The quiz case is **SafeDrive**: a phone app that detects drowsiness in long-haul truck drivers through the camera and sounds an alert. A planned six-week study recruits 60 drivers: one group uses SafeDrive, the other a standard paper fatigue checklist.
| Type | Its job | SafeDrive example |
|---|---|---|
| Unsupported claim | states a result as fact, with no evidence | "The app will definitely reduce accidents." |
| Research problem | what is happening, what is not yet known, why it matters | "Alert apps are proposed for long-haul drivers, but evidence for this group is limited and mixed." |
| Research question | what the study will answer with data | "Do SafeDrive users report lower fatigue than checklist users after six weeks?" |
| Hypothesis | a testable prediction that the data could reject | "SafeDrive users will score lower on a validated fatigue scale than checklist users." |
| Aim / objective | what the study intends to do | "To compare fatigue levels of SafeDrive and checklist users over six weeks." |
Why "The app will definitely reduce accidents" is **an unsupported claim — not a problem and not a hypothesis**:
- it announces the **answer before any data exist**;
- "**definitely**" leaves no room to be wrong, so no result could falsify it;
- it names no comparison group and no measured outcome;
- it says nothing about what is unknown, so it is not a problem either.
> Exam trap: "a testable, falsifiable hypothesis" is the tempting wrong option. A hypothesis is a cautious prediction framed so that the data **could prove it wrong**; a statement of certainty is the opposite.
## Development output vs research output
Building the app is **development**; research produces **knowledge**. The SafeDrive prototype with its detection feature is a development output. Comparing alert rates between the groups, analysing self-reported fatigue or reviewing earlier studies are research outputs. "We want to build a chatbot" is therefore a project task, not a research problem.
## The three-part problem statement
@diagram rm2-problem-statement
- **1. Current situation** — what is happening and who is affected. Neutral facts, no promises.
- **2. Literature-supported limitation** — what previous research has not settled, **with citations**: evidence is limited, mixed, or comes from another population or context.
- **3. Need for this study** — "therefore": what this study will investigate, tied to that limitation.
= [Situation] X is increasingly used by Y. [Limitation] However, previous studies (Author, Year) focus on Z / report mixed results. [Need] Therefore, this study investigates ... among ...
The practical task asks the same thing as four questions: **What is happening? What is not sufficiently known or solved? Who or what is affected? Why is it worth investigating?**
Example from the practical task: "AI coding assistants are increasingly used by Software Engineering students. These tools can generate code quickly, but students may rely on generated solutions without fully understanding them. It is therefore important to investigate whether the use of AI coding assistants affects students' programming performance and code understanding." In a real paper the middle sentence needs a citation.
## Weak problem statements
| Weak statement | What is wrong |
|---|---|
| "AI is very important nowadays." | a vague situation only: no limitation, no need |
| "There is no research on this topic." | an absolute claim nobody can verify; the limitation must come from the reviewed studies |
| "Our app will solve driver fatigue." | an unsupported claim about results |
| "We want to build a chatbot for students." | a development task: nothing unknown is named |
| "Kazakh LLMs are bad, I think." | an opinion with no source |
> Mnemonic **S-L-N**: Situation → Limitation (cited) → Need. If the middle sentence has no source, the statement fails.
?? Is "The app will definitely reduce accidents" a hypothesis?
?= No. It states the result as certain before any data, names no comparison or measured outcome and cannot be proven wrong, so it is an unsupported claim. A hypothesis would be: "SafeDrive users will score lower on a validated fatigue scale than checklist users after six weeks."
?? Which part of the three-part problem statement must rest on the literature?
?= The second one, the limitation: it shows that the need for the study comes from what previous research has not settled, not from opinion.`,
    ru: `## Место этой лекции
На неделе 1 путь шёл от широкой **области (area)** к сфокусированной **теме (topic)** и **проблеме (problem)**. У недели 2 две задачи: **доказать** с помощью научной литературы, что проблема заслуживает исследования, и превратить её в **исследовательский вопрос (research question, RQ)**.
= Problem → Evidence → Gap → Research question
В «детективном» занятии шесть шагов: **ключевые слова → найти статьи → быстро отсеять → сравнить → найти пробел → уточнить вопрос**.
> Вы уже ДУМАЕТЕ, что нашли проблему. Теперь это нужно ДОКАЗАТЬ.
## Дело №001: утверждение — ещё не исследование
«Kazakh-language LLMs are bad» («казахоязычные LLM плохие»). Хватит ли этого, чтобы начать научную статью? **Нет.** Это мнение, пока его не подкрепляют измеримые, задокументированные данные из прежних научных работ.
| | Только утверждение (claim) | Утверждение на основе исследований |
|---|---|---|
| Пример | «У казахских LLM много проблем». | «Предыдущие исследования сообщают об ограничениях фактической точности LLM для малоресурсных языков, включая задачи на казахском». |
| Источник | «Я так думаю». | цитируемая научная литература с DOI |
| Годится для статьи? | нет: не проверить, не воспроизвести, не научно | да: любой читатель может проверить цитируемые работы |
= CLAIM + ACADEMIC EVIDENCE = RESEARCH ARGUMENT
> Первая задача — НЕ доказать свою правоту, а выяснить, что на самом деле говорят прежние исследования, даже если это удивит.
## Пять типов фраз, которые путают на квизе
Кейс квиза — **SafeDrive**: приложение, которое через камеру телефона замечает признаки сонливости у водителей-дальнобойщиков (long-haul truck drivers) и подаёт сигнал. Планируется шестинедельное исследование на 60 водителях: одна группа пользуется SafeDrive, другая — стандартным бумажным чек-листом усталости.
| Тип | Его задача | Пример из SafeDrive |
|---|---|---|
| Необоснованное утверждение (unsupported claim) | выдаёт результат за факт без доказательств | «The app will definitely reduce accidents». |
| Исследовательская проблема (research problem) | что происходит, что пока неизвестно, почему это важно | «Приложения-сигнализаторы предлагают дальнобойщикам, но данных именно по этой группе мало, и они противоречивы». |
| Исследовательский вопрос (research question) | на что исследование ответит данными | «Сообщают ли пользователи SafeDrive о меньшей усталости, чем пользователи чек-листа, через шесть недель?» |
| Гипотеза (hypothesis) | проверяемое предсказание, которое данные могут опровергнуть | «У пользователей SafeDrive балл по валидированной шкале усталости будет ниже, чем у пользователей чек-листа». |
| Цель / задача (aim / objective) | что исследование собирается сделать | «Сравнить уровень усталости пользователей SafeDrive и чек-листа за шесть недель». |
Почему «The app will definitely reduce accidents» — это **необоснованное утверждение, а не проблема и не гипотеза**:
- фраза объявляет **ответ до появления каких-либо данных**;
- «**definitely**» (точно) не оставляет места для ошибки, значит, никакой результат не может её опровергнуть;
- в ней нет ни группы сравнения, ни измеряемого результата;
- она ничего не говорит о том, что неизвестно, поэтому и проблемой не является.
> Ловушка экзамена: соблазнительный неверный вариант — «a testable, falsifiable hypothesis». Гипотеза — осторожное предсказание, сформулированное так, чтобы данные **могли её опровергнуть**; заявление об уверенности — полная противоположность.
## Результат разработки и результат исследования
Создание приложения — это **разработка (development)**; исследование даёт **знание**. Прототип SafeDrive с функцией распознавания — результат разработки (development output). Сравнение частоты сигналов между группами, анализ самооценки усталости или обзор прежних работ — результаты исследования (research outputs). Поэтому «мы хотим сделать чат-бота» — задача проекта, а не исследовательская проблема.
## Постановка проблемы из трёх частей
@diagram rm2-problem-statement
- **1. Текущая ситуация (current situation)** — что происходит и кого это касается. Нейтральные факты, без обещаний.
- **2. Ограничение, подтверждённое литературой (literature-supported limitation)** — что прежние исследования не выяснили, **со ссылками**: данных мало, они противоречивы или получены на другой группе или в другом контексте.
- **3. Потребность в этом исследовании (need for this study)** — «поэтому»: что именно изучит это исследование, в связке с этим ограничением.
= [Situation] X is increasingly used by Y. [Limitation] However, previous studies (Author, Year) focus on Z / report mixed results. [Need] Therefore, this study investigates ... among ...
Практическое задание спрашивает то же самое четырьмя вопросами: **Что происходит? Что недостаточно известно или не решено? Кого или что это затрагивает? Почему это стоит исследовать?**
Пример из практического задания: «AI coding assistants are increasingly used by Software Engineering students. These tools can generate code quickly, but students may rely on generated solutions without fully understanding them. It is therefore important to investigate whether the use of AI coding assistants affects students' programming performance and code understanding.» В настоящей статье среднему предложению нужна ссылка.
## Слабые постановки проблемы
| Слабая формулировка | Что не так |
|---|---|
| «AI is very important nowadays». | только расплывчатая ситуация: нет ни ограничения, ни потребности |
| «There is no research on this topic». | абсолютное утверждение, которое никто не может проверить; ограничение должно следовать из рассмотренных работ |
| «Our app will solve driver fatigue». | необоснованное утверждение о результатах |
| «We want to build a chatbot for students». | задача разработки: ничего неизвестного не названо |
| «Kazakh LLMs are bad, I think». | мнение без источника |
> Мнемоника **S-L-N**: Situation → Limitation (со ссылкой) → Need. Если у среднего предложения нет источника, постановка не засчитывается.
?? Является ли «The app will definitely reduce accidents» гипотезой?
?= Нет. Фраза объявляет результат несомненным ещё до данных, не называет ни сравнения, ни измеряемого результата и не может оказаться неверной — это необоснованное утверждение. Гипотеза звучала бы так: «SafeDrive users will score lower on a validated fatigue scale than checklist users after six weeks».
?? Какая часть постановки проблемы из трёх частей должна опираться на литературу?
?= Вторая — ограничение: она показывает, что потребность в исследовании вытекает из того, что прежние работы не выяснили, а не из мнения.`,
  },
  [
    qx("A student starts a paper with “Kazakh-language LLMs are bad.” Why is this not acceptable as it stands?", "It is an opinion until documented evidence supports it", [
      ["It should be phrased as a research question instead of a statement", "Rephrasing it as a question adds no evidence; it would still be an unsupported opinion.", "Если переделать фразу в вопрос, доказательств не прибавится — это останется мнением без опоры."],
      ["It is too narrow a topic for a whole research paper", "Narrowness is not the issue — a focused topic is desirable. The problem is that nothing backs the statement.", "Дело не в узости — сфокусированная тема как раз нужна. Проблема в том, что утверждение ничем не подкреплено."],
      ["It concerns a language with too few speakers to study", "Any language can be studied; the number of speakers does not make a statement unscholarly.", "Изучать можно любой язык; число носителей не делает утверждение ненаучным."],
    ], "Case #001: the verdict is NO. The sentence is an opinion until it is supported by measurable, documented evidence from prior scholarly work.", "Дело №001: вердикт — НЕТ. Это мнение, пока его не подкрепляют измеримые, задокументированные данные из прежних научных работ."),
    qx("Which sentence could go into a research paper as it stands?", "“Previous studies report lower LLM accuracy in low-resource languages [1–3].”", [
      ["“Kazakh LLMs obviously have many serious problems, as every user already knows.”", "“Obviously” and “every user knows” replace evidence with common opinion; there is no source to check.", "«Очевидно» и «все знают» подменяют доказательства общим мнением; проверить нечего."],
      ["“I think LLMs are inaccurate in Kazakh because my own answers were wrong.”", "Personal experience is an anecdote, not documented, reproducible evidence.", "Личный опыт — это частный случай, а не задокументированные воспроизводимые данные."],
      ["“Our team strongly believes LLMs will never be reliable for Kazakh tasks.”", "A belief about the future is a claim; a research paper needs findings from cited studies.", "Убеждение о будущем — это утверждение; статье нужны результаты цитируемых работ."],
    ], "A research-based statement reports what previous studies found and points to the sources, so any reader can verify it: claim + academic evidence.", "Утверждение на основе исследований сообщает, что нашли прежние работы, и указывает источники — любой читатель может их проверить: утверждение + научные доказательства."),
    qx("Complete the lecture formula: CLAIM + ______ = RESEARCH ARGUMENT.", "Academic evidence", [
      ["Strong personal conviction", "Conviction does not make a claim verifiable; the formula needs documented findings.", "Убеждённость не делает утверждение проверяемым; формуле нужны задокументированные результаты."],
      ["A clear research question", "The question comes later in the chain; it does not support the claim.", "Вопрос появляется позже в цепочке; он не подкрепляет утверждение."],
      ["Precise technical vocabulary", "Academic-sounding words do not add evidence.", "Наукообразные слова не добавляют доказательств."],
    ], "CLAIM + ACADEMIC EVIDENCE = RESEARCH ARGUMENT. Evidence from cited, peer-reviewed studies is what turns an opinion into an argument.", "CLAIM + ACADEMIC EVIDENCE = RESEARCH ARGUMENT. Мнение превращается в аргумент благодаря данным из цитируемых рецензируемых работ."),
    qx("The SafeDrive team writes: “The app will definitely reduce accidents.” This statement is an example of…", "An unsupported claim, not a problem", [
      ["A testable, falsifiable hypothesis", "A hypothesis is a prediction the data could reject; “definitely” declares the result certain before any data exist.", "Гипотеза — предсказание, которое данные могут опровергнуть; «definitely» объявляет результат несомненным ещё до появления данных."],
      ["A well-formed research problem", "A problem says what is happening and what is not yet known; this sentence only promises an outcome.", "Проблема говорит, что происходит и что пока неизвестно; эта фраза лишь обещает результат."],
      ["A clearly stated research objective", "An objective states what the study will do (e.g. compare fatigue levels), not what the result will be.", "Цель говорит, что исследование сделает (например, сравнит усталость), а не каким будет результат."],
    ], "It asserts a result as certain, before any data, with no comparison group or measured outcome. That is an unsupported claim — the quiz answer is “an unsupported claim, not a problem”.", "Фраза утверждает результат как несомненный — без данных, без группы сравнения и без измеряемого показателя. Это необоснованное утверждение; на квизе верный ответ — «an unsupported claim, not a problem»."),
    qx("Which rewrite turns “The app will definitely reduce accidents” into a testable hypothesis?", "SafeDrive users will score lower on a fatigue scale than checklist users after six weeks", [
      ["Truck drivers will definitely have fewer accidents once SafeDrive is installed on their phones", "Still a certainty (“definitely”) and still accidents, which a small six-week study cannot measure reliably.", "Всё та же уверенность («definitely») и всё те же аварии, которые малое шестинедельное исследование надёжно не измерит."],
      ["Does technology such as SafeDrive improve road safety for drivers?", "This is a broad question, not a prediction, and it has no measurable outcome.", "Это широкий вопрос, а не предсказание, и измеримого результата в нём нет."],
      ["SafeDrive is the best drowsiness-detection app available to truck drivers today", "“The best” is a value judgement; no single study result could confirm or reject it.", "«Лучшее» — оценочное суждение; ни один результат исследования не может его подтвердить или опровергнуть."],
    ], "A hypothesis names the groups, a measurable outcome and a direction, and the data could prove it wrong: SafeDrive vs checklist, fatigue-scale score, six weeks.", "Гипотеза называет группы, измеримый показатель и направление эффекта, и данные могут её опровергнуть: SafeDrive против чек-листа, балл по шкале усталости, шесть недель."),
    qx("What makes a statement a hypothesis rather than a claim?", "It is a prediction that the data could prove wrong", [
      ["It is stated with full confidence by an expert", "Confidence is what makes a claim; a hypothesis is open to being rejected.", "Уверенность — признак утверждения; гипотеза допускает, что её отвергнут."],
      ["It describes a result the team has already observed", "An observed result is a finding; a hypothesis is stated before the data are collected.", "Наблюдённый результат — это вывод (finding); гипотезу формулируют до сбора данных."],
      ["It contains the words “will” and “definitely”", "“Definitely” signals certainty — the opposite of a testable prediction.", "«Definitely» говорит об уверенности — противоположности проверяемого предсказания."],
    ], "A hypothesis is a testable, falsifiable prediction: it is framed so that the collected data can support it or reject it.", "Гипотеза — проверяемое, опровержимое (falsifiable) предсказание: она сформулирована так, чтобы собранные данные могли её поддержать или отвергнуть."),
    qx("Which sentence is a research problem, not a claim, a question or an aim?", "Alert apps are proposed for truck drivers, but evidence for this group is limited", [
      ["To compare the fatigue levels of SafeDrive users and paper-checklist users over six weeks", "“To compare…” states what the study will do — that is an aim.", "«To compare…» говорит, что исследование сделает, — это цель."],
      ["Do SafeDrive users report lower fatigue than checklist users after six weeks?", "It asks what the data will answer — a research question.", "Это вопрос, на который ответят данные, — исследовательский вопрос."],
      ["SafeDrive will clearly be the most effective way to keep truck drivers awake", "A promised result without evidence — an unsupported claim.", "Обещанный результат без доказательств — необоснованное утверждение."],
    ], "A problem describes the situation and what is not yet known: apps are being proposed (situation), but evidence for this group is limited (limitation).", "Проблема описывает ситуацию и то, что пока неизвестно: приложения предлагают (ситуация), но данных по этой группе мало (ограничение)."),
    qx("In the SafeDrive case, which item is a development output rather than a research output?", "The SafeDrive prototype with its detection feature", [
      ["Comparing alert rates between the SafeDrive and control groups", "Comparing groups produces knowledge about the app's effect — a research output.", "Сравнение групп даёт знание об эффекте приложения — результат исследования."],
      ["The analysis of drivers' self-reported fatigue levels", "Analysing collected data to answer a question is research.", "Анализ собранных данных ради ответа на вопрос — это исследование."],
      ["A systematic review of fifteen driver-monitoring studies", "A review synthesises existing evidence — a research output.", "Обзор обобщает существующие данные — это результат исследования."],
    ], "Building the app is development: the prototype is a product. Research outputs are knowledge — comparisons, analyses and reviews.", "Создание приложения — разработка: прототип — это продукт. Результаты исследования — это знание: сравнения, анализ, обзоры."),
    qx("Which order gives the three-part problem statement asked for in the quiz?", "Current situation → literature-supported limitation → need for this study", [
      ["Research question → hypothesis → expected results that the study will deliver", "These are later elements; a problem statement must not promise results.", "Это более поздние элементы; постановка проблемы не должна обещать результаты."],
      ["Personal motivation → description of the app → expected benefits for users", "Motivation and app benefits make a product pitch, not a research problem.", "Мотивация и польза приложения — это реклама продукта, а не исследовательская проблема."],
      ["Need for this study → current situation → personal opinion of the team", "The need comes last, as the conclusion drawn from the limitation, and opinion has no place here.", "Потребность идёт последней, как вывод из ограничения, а мнению здесь не место."],
    ], "Situation (what is happening) → limitation supported by literature (what research has not settled) → need (therefore this study). Mnemonic S-L-N.", "Ситуация (что происходит) → ограничение, подтверждённое литературой (что не выяснено) → потребность (поэтому это исследование). Мнемоника S-L-N."),
    qx("In the three-part problem statement, which part is specifically required to be supported by the literature?", "The limitation: what previous research has not yet settled", [
      ["The need for this study, since it states the contribution", "The need follows from the limitation; the literature support sits in the limitation.", "Потребность вытекает из ограничения; опора на литературу — именно в ограничении."],
      ["The current situation, because limitations need no sources", "Limitations need sources most of all; otherwise they are opinions.", "Ограничениям источники нужны прежде всего, иначе это мнения."],
      ["None of them — a problem statement expresses the author's view", "A problem statement is not a personal view; its limitation must be cited.", "Постановка проблемы — не личное мнение; ограничение должно быть со ссылками."],
    ], "The quiz wording is “a literature-supported limitation”: what previous studies have not settled, shown with citations.", "На квизе это «a literature-supported limitation»: что прежние работы не выяснили, со ссылками на них."),
    qx("“AI coding assistants are widely used by SE students. Therefore, this study investigates their effect on code understanding.” What is missing?", "A literature-supported limitation between the two sentences", [
      ["A description of the current situation of AI assistant use", "The first sentence already describes the situation.", "Первое предложение уже описывает ситуацию."],
      ["A final sentence stating the need for carrying out this study", "The “Therefore…” sentence is the need for this study.", "Предложение с «Therefore…» и есть потребность в исследовании."],
      ["A list of the specific tools that students used", "Naming tools is detail; it is not one of the three required parts.", "Перечень инструментов — деталь, а не одна из трёх обязательных частей."],
    ], "The statement jumps from situation to need. The middle move — what previous research has not settled, with a citation — is missing, so the need is not justified.", "Постановка перескакивает от ситуации к потребности. Нет середины — что прежние работы не выяснили, со ссылкой, — поэтому потребность не обоснована."),
    qx("A problem statement says: “There is no research at all on fatigue apps for drivers.” What is its main weakness?", "It is an absolute claim that no review can verify", [
      ["It is too specific about the population studied", "Being specific is good; the issue is the unverifiable “no research at all”.", "Конкретность — это хорошо; проблема в непроверяемом «no research at all»."],
      ["It cites too many earlier studies on the topic", "It cites nothing — that is part of the problem.", "Она ничего не цитирует — в этом и часть проблемы."],
      ["It describes the current situation too precisely", "It does not describe the situation at all; it makes a sweeping claim.", "Ситуацию она вообще не описывает — только делает огульное утверждение."],
    ], "Nobody can read everything, so “no research exists” cannot be checked and is almost never true. Write what the reviewed studies show: “few studies focus on…”.", "Прочитать всё невозможно, поэтому «исследований нет» проверить нельзя, и это почти никогда не правда. Нужно писать, что показывают рассмотренные работы: «few studies focus on…»."),
    qx("The practical task lists questions a problem statement should answer. Which question does NOT belong to that list?", "What app will the team build?", [
      ["What is happening?", "This is the first question: the current situation.", "Это первый вопрос: текущая ситуация."],
      ["What is not sufficiently known or solved?", "This is the core of the problem — the limitation.", "Это ядро проблемы — ограничение."],
      ["Why is the problem worth investigating?", "This justifies the need for the study.", "Это обосновывает потребность в исследовании."],
    ], "The four questions are: what is happening, what is not sufficiently known or solved, who or what is affected, and why it is worth investigating. Building an app is a development task, not part of a research problem.", "Четыре вопроса: что происходит, что недостаточно известно или не решено, кого или что это затрагивает и почему это стоит исследовать. Создание приложения — задача разработки, а не часть исследовательской проблемы."),
    qx("“We want to build a chatbot that answers students' timetable questions.” Why is this not a research problem?", "It names a development task, not something unknown", [
      ["It names a specific population, which a problem should never do", "Problems often name who is affected; that is not the issue.", "Проблема часто называет, кого она касается; дело не в этом."],
      ["Chatbots cannot be studied with scientific methods", "Chatbots can be studied — for example their accuracy or user satisfaction.", "Чат-ботов вполне можно изучать — например, их точность или удовлетворённость пользователей."],
      ["It is too short to count as a problem statement", "Length is not the criterion; a short statement can still describe a gap.", "Длина — не критерий; и короткая формулировка может описывать пробел."],
    ], "A research problem states what is not yet known and why it matters. “Build a chatbot” is a project task; the research would be, for example, whether the chatbot answers accurately.", "Исследовательская проблема говорит, что пока неизвестно и почему это важно. «Сделать чат-бота» — задача проекта; исследованием было бы, например, насколько точно бот отвечает."),
    qx("Which sentence works as the “need for this study” part of the SafeDrive problem statement?", "Therefore, this study compares SafeDrive with a paper checklist for long-haul drivers", [
      ["Phone-based drowsiness-alert apps such as SafeDrive are being proposed for long-haul truck drivers", "This describes the current situation — the first part.", "Это текущая ситуация — первая часть."],
      ["Few studies focus specifically on long-haul truck drivers (Study D)", "This is the literature-supported limitation — the second part.", "Это ограничение, подтверждённое литературой, — вторая часть."],
      ["SafeDrive will definitely save many lives on our country's roads", "A promised outcome — an unsupported claim, not a part of the problem.", "Обещанный результат — необоснованное утверждение, а не часть проблемы."],
    ], "The need starts with “therefore” and says what this study will investigate, linked to the limitation.", "Потребность начинается с «therefore» и говорит, что изучит это исследование, в связке с ограничением."),
    qx("Week 1 built Area → Topic → Problem. What does Week 2 add?", "Literature evidence, a gap and a refined research question", [
      ["A complete methodology section with data-collection instruments", "Methodology comes later in the course (Week 5 onwards).", "Методология будет позже в курсе (с недели 5)."],
      ["Final results that confirm the original Week 1 problem", "No data are collected yet, and the aim is to test the problem, not confirm it.", "Данные ещё не собраны, а цель — проверить проблему, а не подтвердить её."],
      ["A longer list of interesting areas to choose from", "Areas were chosen in Week 1; Week 2 narrows down, it does not widen.", "Области выбраны на неделе 1; неделя 2 сужает, а не расширяет."],
    ], "Week 2: prove the problem with academic literature (evidence), find what remains unknown (gap) and refine the research question. Logbook: evidence, evidence matrix, research gap, refined question.", "Неделя 2: доказать проблему научной литературой, найти, что остаётся неизвестным (пробел), и уточнить исследовательский вопрос. В Logbook: доказательства, матрица, пробел, уточнённый вопрос."),
    qx("What is your first job when you start reading the literature on your problem?", "Find out what previous research actually says", [
      ["Collect only the sources that prove you are right", "That is cherry-picking; the lecture says your first job is NOT to prove you are right.", "Это выборочный отбор (cherry-picking); лекция прямо говорит: первая задача — НЕ доказать свою правоту."],
      ["Choose the research method you want to use", "The method is chosen later, from the question — not before reading.", "Метод выбирают позже, исходя из вопроса, а не до чтения."],
      ["Draft the conclusion section of your paper", "Conclusions come after data; at this stage you are discovering evidence.", "Выводы пишут после данных; сейчас идёт поиск доказательств."],
    ], "“Your first job is NOT to prove you are right. Your first job is to discover what previous research actually says — even if it surprises you.”", "«Первая задача — НЕ доказать свою правоту, а выяснить, что на самом деле говорят прежние исследования, даже если это удивит»."),
    tfx("A problem statement should promise the results that the study will deliver.", false,
      "A problem statement gives the situation, a cited limitation and the need. Promising results is an unsupported claim — no data exist yet.",
      "Постановка проблемы — это ситуация, ограничение со ссылками и потребность. Обещать результаты — значит делать необоснованное утверждение: данных ещё нет.",
      "“True” would accept sentences like “the app will definitely reduce accidents”, which the quiz marks as an unsupported claim.",
      "Ответ «верно» принял бы фразы вроде «the app will definitely reduce accidents», а квиз считает их необоснованными утверждениями."),
    tfx("“Previous studies report X” with a cited DOI is a research-based statement, while “I think X” is only a claim.", true,
      "The difference is verifiable academic evidence: a cited source that any reader can check.",
      "Разница — в проверяемых научных доказательствах: цитируемом источнике, который может проверить любой читатель.",
      "“False” would treat an opinion with no source as equal to a cited finding.",
      "Ответ «неверно» приравнял бы мнение без источника к результату со ссылкой."),
    qx("“AI is very important nowadays and everyone uses it.” Which parts of the three-part problem statement does this contain?", "Only a vague situation — no limitation and no need", [
      ["All three parts, written in a very short form", "There is no limitation from the literature and no “therefore” — only a general remark.", "Нет ни ограничения из литературы, ни «therefore» — только общее замечание."],
      ["A limitation and a need, but no current situation", "It is the other way round: only a vague situation is present.", "Наоборот: есть только расплывчатая ситуация."],
      ["A cited limitation, because the fact is well known", "“Well known” is not a citation; nothing here is supported by literature.", "«Общеизвестно» — не ссылка; ничего здесь не подкреплено литературой."],
    ], "It only states a general situation, and vaguely. There is no literature-supported limitation and no need for a specific study.", "Здесь только общая и расплывчатая ситуация. Нет ни ограничения, подтверждённого литературой, ни потребности в конкретном исследовании."),
  ],
);

const p2 = part(
  "rm-l2-p2",
  { en: "Finding evidence: keywords, Boolean search, screening", ru: "Поиск доказательств: ключевые слова, булев поиск, отсев" },
  {
    en: `## Challenge 1: turn the problem into keywords
Do not paste the whole problem sentence into Google Scholar: almost no paper uses exactly your wording, and different authors name the same idea differently. Break the problem into **3 core concepts** and give each **at least 2 synonyms**.
Problem: "LLMs may provide inaccurate answers to Kazakh-language questions."
| Concept | Synonyms and alternatives |
|---|---|
| Large language models | LLM · multilingual LLM · generative AI model |
| Kazakh language | Kazakh NLP · low-resource language · Central Asian language |
| Accuracy | factual accuracy · hallucination · factuality · reliability |
## Boolean operators
| Operator | What it does | Effect | Example |
|---|---|---|---|
| " " | exact phrase | narrows | "large language model" |
| AND | both concepts required | narrows | LLM AND hallucination |
| OR | either alternative is enough | broadens | LLM OR "large language model" |
| ( ) | groups the synonyms of one concept | keeps the logic clear | (LLM OR "large language model") |
Rule: **OR inside the brackets** (synonyms of one concept), **AND between the brackets** (different concepts).
= ("large language model" OR LLM) AND ("Kazakh language" OR "Kazakh NLP") AND (hallucination OR "factual accuracy")
## A balanced search string (quiz item)
The quiz asks for "one balanced search string using quotation marks, parentheses, AND, and OR". Balanced means: every bracket that opens also closes; each concept has its own bracket; synonyms are joined with OR, concepts with AND; multi-word terms are in quotation marks. It is neither so narrow that it finds nothing nor so broad that it finds everything.
= ("truck driver" OR "long-haul driver") AND (drowsiness OR fatigue) AND ("alert app" OR "driver monitoring")
Typical errors:
- **AND between synonyms**: LLM AND "large language model" demands both forms and loses papers that use only one.
- **OR between concepts**: LLM OR Kazakh returns every LLM paper plus every Kazakh paper.
- **No quotation marks**: large language model may match the three words scattered anywhere in the text.
- **No brackets**: in "truck driver" OR "long-haul driver" AND fatigue the database has to guess which operator comes first.
> Exam trap: one more AND term makes the result list **smaller**; one more OR synonym makes it **larger**.
## Where researchers search
| Database | Best for |
|---|---|
| Google Scholar | free and broad; the best starting point; citations and PDFs |
| Scopus, Web of Science | premium indexed databases with high-quality filtering; access through the library |
| IEEE Xplore, ACM Digital Library | essential for CS and Software Engineering: conference and journal papers |
| ScienceDirect, SpringerLink | interdisciplinary work: HCI, education, applied CS |
> Google ≠ Google Scholar. Regular Google is fine for general information; only academic databases surface peer-reviewed scholarly evidence.
## Live mission: find 5 relevant papers
For each candidate record **Title · Year · Authors · Venue (journal or conference) · DOI or link**.
**Golden rule:** do not choose a paper only because its title sounds interesting — check what it actually studies.
## Don't read everything: screen first
You found 30 papers. You do not read all 30: each step is cheaper than the next, and only papers that pass go on.
@diagram rm2-screening-funnel
- **1. Title** — is the topic related to my problem at all?
- **2. Abstract** — what did they study, how, and what did they find?
- **3. Keywords** — do they match my conceptual space?
- **4. Conclusion** — what is the take-away, and are gaps mentioned?
- **5. Full read** — only if steps 1–4 confirm relevance.
= SEARCH WIDE. SCREEN FAST. READ RELEVANT WORK DEEPLY.
## The 60-second paper test
Abstract: "This study evaluates the factual accuracy of three multilingual large language models on a 500-item question-answering benchmark across five domains. Performance degrades significantly in low-resource languages, with accuracy 18–34% lower than English baselines. Training data imbalance is suggested as the primary factor."
| Question | Answer from the abstract |
|---|---|
| What did they study? | factual accuracy of multilingual LLMs on a QA benchmark |
| Who / what? | 3 multilingual LLMs · 500 questions · 5 domains |
| How? | benchmark evaluation, low-resource vs English performance |
| What did they find? | accuracy 18–34% lower in low-resource languages |
| Relevant to me? | highly, if my problem is about Kazakh LLM accuracy |
## Five questions for every paper
What problem did they study? What research question did they ask? How did they investigate it? What did they find? **What is still missing?** The last one — limitations, open questions, future work — is where research gaps begin. If you cannot answer all five, you have only *looked at* the paper, not read it.
## AI tools and academic integrity
| AI can help you | AI cannot replace |
|---|---|
| generate initial keyword ideas | peer-reviewed academic evidence |
| suggest synonyms for Boolean queries | real authors, papers, DOIs or findings |
| explain difficult terminology | verified research gaps |
| organise and format notes | legitimate citations |
A literature folder of AI-suggested records, some **with no DOI and never opened**, creates the risk of **citing fabricated, unverified sources**. Open each paper, confirm that it exists, and check that it says what you cite it for. Inventing authors, papers, DOIs, findings or gaps is an academic integrity violation, with or without AI.
?? The query LLM AND Kazakh AND hallucination returns three results. What is the first fix?
?= Broaden every concept with OR synonyms inside brackets: (LLM OR "large language model") AND (Kazakh OR "low-resource language") AND (hallucination OR "factual accuracy"). Dropping a whole concept comes later, because it changes the problem.
?? At which screening step do you first learn how a study was done and what it found?
?= Step 2, the abstract: it says what was studied, how, and what was found.`,
    ru: `## Задание 1: превратить проблему в ключевые слова
Не стоит вставлять в Google Scholar всё предложение с проблемой: почти ни одна статья не использует именно вашу формулировку, а разные авторы называют одну идею по-разному. Проблему разбивают на **3 ключевых понятия (core concepts)** и к каждому подбирают **минимум 2 синонима**.
Проблема: «LLMs may provide inaccurate answers to Kazakh-language questions» (LLM могут давать неточные ответы на вопросы на казахском).
| Понятие | Синонимы и варианты |
|---|---|
| Большие языковые модели | LLM · multilingual LLM · generative AI model |
| Казахский язык | Kazakh NLP · low-resource language · Central Asian language |
| Точность | factual accuracy · hallucination · factuality · reliability |
## Булевы операторы (Boolean operators)
| Оператор | Что делает | Эффект | Пример |
|---|---|---|---|
| " " | точная фраза | сужает | "large language model" |
| AND | нужны оба понятия | сужает | LLM AND hallucination |
| OR | достаточно любого варианта | расширяет | LLM OR "large language model" |
| ( ) | группирует синонимы одного понятия | сохраняет ясную логику | (LLM OR "large language model") |
Правило: **OR — внутри скобок** (синонимы одного понятия), **AND — между скобками** (разные понятия).
= ("large language model" OR LLM) AND ("Kazakh language" OR "Kazakh NLP") AND (hallucination OR "factual accuracy")
## Сбалансированная поисковая строка (задание квиза)
Квиз просит «one balanced search string using quotation marks, parentheses, AND, and OR». Сбалансированная — значит: каждая открытая скобка закрыта; у каждого понятия своя скобка; синонимы соединены OR, понятия — AND; фразы из нескольких слов взяты в кавычки. Строка не настолько узкая, чтобы ничего не найти, и не настолько широкая, чтобы найти всё подряд.
= ("truck driver" OR "long-haul driver") AND (drowsiness OR fatigue) AND ("alert app" OR "driver monitoring")
Типичные ошибки:
- **AND между синонимами**: LLM AND "large language model" требует обе формы и теряет статьи, где есть только одна.
- **OR между понятиями**: LLM OR Kazakh выдаёт все статьи про LLM плюс все статьи про казахский.
- **Нет кавычек**: large language model может найти эти три слова, разбросанные по тексту.
- **Нет скобок**: в "truck driver" OR "long-haul driver" AND fatigue базе приходится угадывать, какой оператор выполнять первым.
> Ловушка экзамена: ещё один термин через AND делает список результатов **меньше**; ещё один синоним через OR — **больше**.
## Где ищут исследователи
| База | Для чего лучше всего |
|---|---|
| Google Scholar | бесплатная и широкая; лучшая точка старта; цитирования и PDF |
| Scopus, Web of Science | платные индексируемые базы с качественной фильтрацией; доступ через библиотеку |
| IEEE Xplore, ACM Digital Library | обязательны для CS и Software Engineering: статьи конференций и журналов |
| ScienceDirect, SpringerLink | междисциплинарные работы: HCI, образование, прикладная CS |
> Google ≠ Google Scholar. Обычный Google годится для общей информации; рецензируемые научные работы (peer-reviewed) выдают только академические базы.
## Задание: найти 5 релевантных статей
Для каждой статьи-кандидата записать **название · год · авторов · издание (журнал или конференцию) · DOI или ссылку**.
**Золотое правило:** не выбирать статью только потому, что название звучит интересно, — проверить, что именно в ней изучают.
## Не читать всё подряд: сначала отсев
Нашлось 30 статей. Все 30 не читают: каждый шаг дешевле следующего, и дальше проходят только подходящие статьи.
@diagram rm2-screening-funnel
- **1. Название (title)** — относится ли тема к моей проблеме вообще?
- **2. Аннотация (abstract)** — что изучали, как и что нашли?
- **3. Ключевые слова (keywords)** — совпадают ли с моими понятиями?
- **4. Заключение (conclusion)** — какой главный вывод и упомянуты ли пробелы?
- **5. Полное чтение (full read)** — только если шаги 1–4 подтвердили релевантность.
= SEARCH WIDE. SCREEN FAST. READ RELEVANT WORK DEEPLY.
## Тест статьи за 60 секунд
Аннотация: «This study evaluates the factual accuracy of three multilingual large language models on a 500-item question-answering benchmark across five domains. Performance degrades significantly in low-resource languages, with accuracy 18–34% lower than English baselines. Training data imbalance is suggested as the primary factor.»
| Вопрос | Ответ по аннотации |
|---|---|
| Что изучали? | фактическую точность мультиязычных LLM на наборе вопросов (benchmark) |
| Кого / что? | 3 мультиязычные LLM · 500 вопросов · 5 областей |
| Как? | оценка на бенчмарке: малоресурсные языки против английского |
| Что нашли? | точность на 18–34% ниже в малоресурсных языках |
| Важно ли для меня? | очень, если проблема — точность LLM на казахском |
## Пять вопросов к каждой статье
Какую проблему изучали? Какой исследовательский вопрос задали? Как исследовали? Что нашли? **Чего всё ещё не хватает?** Последний вопрос — ограничения, открытые вопросы, future work — место, где начинаются исследовательские пробелы. Если на все пять ответить не получается, статью только *посмотрели*, а не прочитали.
## ИИ-инструменты и академическая честность
| ИИ может помочь | ИИ не заменит |
|---|---|
| придумать первые ключевые слова | рецензируемые научные доказательства |
| подсказать синонимы для булевых запросов | реальных авторов, статьи, DOI и результаты |
| объяснить сложные термины | проверенные исследовательские пробелы |
| упорядочить и оформить заметки | корректные ссылки |
Папка с литературой из записей, которые подсказал ИИ, причём часть **без DOI и ни разу не открыта**, создаёт риск **сослаться на выдуманные, непроверенные источники**. Каждую статью нужно открыть, убедиться, что она существует и что в ней написано именно то, ради чего её цитируют. Выдумывать авторов, статьи, DOI, результаты или пробелы — нарушение академической честности, с ИИ или без.
?? Запрос LLM AND Kazakh AND hallucination даёт три результата. Что исправить в первую очередь?
?= Расширить каждое понятие синонимами через OR в скобках: (LLM OR "large language model") AND (Kazakh OR "low-resource language") AND (hallucination OR "factual accuracy"). Убирать целое понятие — следующий шаг, потому что это меняет саму проблему.
?? На каком шаге отсева впервые становится известно, как проводили исследование и что нашли?
?= На шаге 2, по аннотации: в ней сказано, что изучали, как и что нашли.`,
  },
  [
    qx("Why should you not paste your whole problem sentence into Google Scholar?", "Papers rarely use your exact wording, so relevant ones are missed", [
      ["Google Scholar rejects any query that is longer than about five words", "There is no such limit; long sentences simply match poorly.", "Такого ограничения нет; длинные предложения просто плохо совпадают."],
      ["Long queries always return far too many irrelevant papers", "A full sentence usually returns too FEW good matches, not too many.", "Целое предложение обычно находит СЛИШКОМ МАЛО подходящих статей, а не слишком много."],
      ["Sentences reveal your research idea to other researchers", "Searches are not published; the issue is matching, not secrecy.", "Запросы не публикуются; дело в совпадении слов, а не в секретности."],
    ], "Different authors describe the same idea with different words. Break the problem into concepts and synonyms instead of searching for your own sentence.", "Разные авторы описывают одну идею разными словами. Проблему разбивают на понятия и синонимы, а не ищут собственное предложение."),
    qx("Challenge 1 asks you to turn your Week 1 problem into keywords. What exactly does it require?", "3 core concepts, each with at least 2 synonyms", [
      ["1 main concept with as many synonyms as possible", "One concept cannot describe a problem; the task asks for three.", "Одно понятие не описывает проблему; в задании их три."],
      ["5 concepts, each written as one exact phrase", "The task is three concepts with synonyms, not exact phrases only.", "Задание — три понятия с синонимами, а не только точные фразы."],
      ["The full problem sentence plus its translation", "Whole sentences are exactly what the challenge tells you not to use.", "Целые предложения — именно то, от чего задание предостерегает."],
    ], "Break the problem into 3 core concepts and generate at least 2 synonym alternatives for each — e.g. LLM / Kazakh language / accuracy.", "Разбить проблему на 3 ключевых понятия и к каждому подобрать минимум 2 синонима — например, LLM / казахский язык / точность."),
    qx("You add “AND Kazakh” to the query LLM AND hallucination. What happens to the result list?", "It gets smaller, because one more concept is required", [
      ["It gets larger, because Kazakh papers are added", "That is what OR would do; AND adds a requirement.", "Так работает OR; AND добавляет требование."],
      ["It stays the same, because Boolean terms are ignored", "Academic databases do apply AND; the results change.", "Академические базы учитывают AND; результаты меняются."],
      ["It doubles, because each term is searched separately", "AND does not run separate searches; it requires all terms in one paper.", "AND не запускает отдельные поиски; он требует все термины в одной статье."],
    ], "AND narrows: every result must contain all the joined concepts, so each extra AND term removes papers.", "AND сужает: каждый результат обязан содержать все соединённые понятия, поэтому каждый новый термин через AND отсекает статьи."),
    qx("What does OR do when it joins two terms, as in LLM OR “large language model”?", "Accepts papers with either term, so results grow", [
      ["Requires both terms in every paper, so results shrink", "That describes AND.", "Это описание AND."],
      ["Searches for both words as one exact phrase", "Exact phrases are made with quotation marks.", "Точную фразу задают кавычками."],
      ["Removes papers that contain the second term", "Excluding terms is not what OR does; OR adds alternatives.", "Исключение терминов — не работа OR; OR добавляет альтернативы."],
    ], "OR broadens: either synonym is acceptable, so it joins alternative names of the same concept.", "OR расширяет: подходит любой из синонимов, поэтому им соединяют разные названия одного понятия."),
    qx("What do quotation marks do in the query “large language model”?", "Find the words together, as one exact phrase", [
      ["Exclude the phrase from all of the results", "Quotation marks include an exact phrase; they do not exclude it.", "Кавычки ищут точную фразу, а не исключают её."],
      ["Search for the phrase only in paper titles", "Quotation marks do not limit the search to titles.", "Кавычки не ограничивают поиск названиями."],
      ["Add every synonym of the words automatically", "Synonyms are added by you, with OR.", "Синонимы добавляют вручную, через OR."],
    ], "Phrase search forces the database to find that exact phrase — the words together and in this order — instead of the words scattered anywhere.", "Поиск по фразе заставляет базу искать именно эту фразу — слова вместе и в этом порядке, — а не разбросанные по тексту слова."),
    qx("What is the job of the parentheses in (LLM OR “large language model”) AND hallucination?", "They group synonyms so OR is applied before AND", [
      ["They mark optional words the database may skip", "Brackets do not make words optional; they set the logic.", "Скобки не делают слова необязательными; они задают логику."],
      ["They tell the database to search only abstracts", "Brackets do not restrict the field that is searched.", "Скобки не ограничивают область поиска."],
      ["They turn the bracketed words into an exact phrase", "Exact phrases are made with quotation marks.", "Точную фразу задают кавычками."],
    ], "Brackets keep the synonyms of one concept together: (A OR B) AND C means “A or B, and also C”. Without them the database may combine the operators differently.", "Скобки держат синонимы одного понятия вместе: (A OR B) AND C значит «A или B, и при этом C». Без скобок база может сочетать операторы иначе."),
    qx("Which is a balanced search string for the SafeDrive literature?", '("truck driver" OR "long-haul driver") AND (drowsiness OR fatigue) AND ("alert app" OR "driver monitoring")', [
      ['"truck driver" AND "long-haul driver" AND drowsiness AND fatigue AND "alert app" AND "driver monitoring"', "Synonyms are joined with AND, so every paper would need all six terms — far too narrow.", "Синонимы соединены AND, и каждой статье понадобились бы все шесть терминов — слишком узко."],
      ['("truck driver" OR drowsiness OR "alert app") AND ("long-haul driver" OR fatigue OR "driver monitoring")', "The brackets mix different concepts; each bracket should hold the synonyms of ONE concept.", "В скобках смешаны разные понятия; в каждой скобке должны быть синонимы ОДНОГО понятия."],
      ['(truck driver OR long-haul driver AND (drowsiness OR fatigue) AND alert app OR driver monitoring', "The first bracket never closes and the multi-word terms have no quotation marks.", "Первая скобка не закрыта, а фразы из нескольких слов не взяты в кавычки."],
    ], "Each concept (driver group, drowsiness, alert technology) has its own bracket with OR synonyms; the brackets are joined with AND; phrases are quoted and every bracket closes.", "У каждого понятия (группа водителей, сонливость, технология сигналов) своя скобка с синонимами через OR; скобки соединены AND; фразы в кавычках, все скобки закрыты."),
    qx("A student searches LLM AND “large language model” AND Kazakh. What is the error?", "Synonyms are joined with AND, so papers using one form are lost", [
      ["The phrase in quotation marks should be written without the quotation marks", "The quotation marks are correct; the problem is AND between synonyms.", "Кавычки здесь верны; ошибка — AND между синонимами."],
      ["Kazakh should be joined with OR to keep the query focused", "OR with a different concept would broaden the search, not focus it.", "OR с другим понятием расширил бы поиск, а не сфокусировал его."],
      ["Boolean operators must be written in lower case to work", "Capital AND / OR is the usual convention; case is not the problem in this query.", "AND / OR принято писать заглавными; ошибка этого запроса не в регистре."],
    ], "LLM and “large language model” are two names of one concept. Join them with OR inside brackets: (LLM OR “large language model”) AND Kazakh.", "LLM и «large language model» — два названия одного понятия. Их соединяют OR в скобках: (LLM OR “large language model”) AND Kazakh."),
    qx("Your query LLM AND Kazakh AND hallucination returns only three papers. What is the best first fix?", "Add OR synonyms in brackets to each concept", [
      ["Delete the Kazakh concept from the query", "That changes the problem itself; broaden each concept first.", "Это меняет саму проблему; сначала стоит расширить каждое понятие."],
      ["Put the whole query inside one pair of quotation marks", "That would demand the exact sentence and find even fewer papers.", "Это потребовало бы точную фразу и нашло бы ещё меньше статей."],
      ["Join another concept to the query with AND", "Another AND term narrows the results further.", "Ещё один термин через AND сужает поиск ещё сильнее."],
    ], "Too few results means the query is too narrow. Widen each concept with synonyms: (LLM OR “large language model”) AND (Kazakh OR “low-resource language”) AND (hallucination OR “factual accuracy”).", "Слишком мало результатов — запрос слишком узкий. Каждое понятие расширяют синонимами: (LLM OR “large language model”) AND (Kazakh OR “low-resource language”) AND (hallucination OR “factual accuracy”)."),
    qx("The query LLM OR hallucination returns two million results. What is the best fix?", "Join the two different concepts with AND, not OR", [
      ["Add more synonyms to the query with OR", "More OR terms make the list even larger.", "Больше терминов через OR — ещё больше результатов."],
      ["Remove the quotation marks from every term", "There are no quotation marks here, and removing them would only broaden the search.", "Кавычек здесь нет, а их удаление только расширило бы поиск."],
      ["Switch the search from Google Scholar to regular Google Search", "Regular Google gives general web results, not fewer peer-reviewed papers.", "Обычный Google выдаёт общие веб-результаты, а не меньше научных статей."],
    ], "LLM and hallucination are different concepts. OR returns every paper on either one; AND keeps only papers about both.", "LLM и hallucination — разные понятия. OR выдаёт все статьи про любое из них; AND оставляет только статьи про оба."),
    qx("Which databases does the lecture call essential for Computer Science and Software Engineering topics?", "IEEE Xplore and the ACM Digital Library", [
      ["ScienceDirect and SpringerLink", "They are strong for interdisciplinary work (HCI, education, applied CS).", "Они сильны в междисциплинарных работах (HCI, образование, прикладная CS)."],
      ["Scopus and Web of Science, via the library", "These are premium general indexed databases, not CS-specific ones.", "Это платные общие индексируемые базы, не специализированные на CS."],
      ["Regular Google and Wikipedia articles", "Neither surfaces peer-reviewed evidence.", "Ни один из них не выдаёт рецензируемые научные работы."],
    ], "IEEE Xplore and ACM DL hold the main CS and SE conference and journal papers.", "IEEE Xplore и ACM DL содержат основные статьи конференций и журналов по CS и SE."),
    tfx("Regular Google and Google Scholar are interchangeable for finding peer-reviewed evidence.", false,
      "Google ≠ Google Scholar: regular Google is for general information; only academic databases surface peer-reviewed scholarly evidence.",
      "Google ≠ Google Scholar: обычный Google — для общей информации; рецензируемые научные работы выдают только академические базы.",
      "“True” ignores the slide's rule: blogs and news from regular Google are not scholarly evidence.",
      "Ответ «верно» игнорирует правило слайда: блоги и новости из обычного Google — не научные доказательства."),
    qx("During the live mission, what must you record for every candidate paper?", "Title, year, authors, venue, and DOI or link", [
      ["Title and the downloaded PDF file only", "Without authors, year, venue and DOI the source cannot be cited or traced.", "Без авторов, года, издания и DOI источник нельзя ни процитировать, ни найти."],
      ["The abstract, copied word for word into the logbook", "A copied abstract is not the record asked for, and it is not your own words.", "Копия аннотации — не та запись, которую просят, и не ваши слова."],
      ["Page count, number of figures and tables", "These say nothing about relevance or how to cite the paper.", "Это ничего не говорит о релевантности или о том, как сослаться на статью."],
    ], "Title · Year · Authors · Venue (journal or conference) · DOI or link — enough to verify and cite the paper later.", "Название · год · авторы · издание (журнал или конференция) · DOI или ссылка — этого хватит, чтобы потом проверить и процитировать статью."),
    qx("A paper titled “AI and the Future of Language” looks perfect for your Kazakh LLM accuracy problem. What does the golden rule say?", "Check what it actually studies before adding it", [
      ["Add it at once, since the title matches well", "A matching title is exactly the trap the golden rule warns about.", "Подходящее название — та самая ловушка, о которой предупреждает золотое правило."],
      ["Add it only if it was published this year", "Recency is not the rule; relevance of the content is.", "Правило не о свежести, а о релевантности содержания."],
      ["Skip it, because general titles are never useful", "A general title can hide a relevant study; you check instead of assuming.", "За общим названием может скрываться нужное исследование; его проверяют, а не отбрасывают наугад."],
    ], "Golden rule: do NOT choose a paper only because its title sounds interesting. Check the abstract to see what it actually studies.", "Золотое правило: НЕ выбирать статью только потому, что название звучит интересно. Проверить по аннотации, что в ней на самом деле изучают."),
    qx("What is the order of the 5-step screening protocol?", "Title → abstract → keywords → conclusion → full read", [
      ["Abstract → title → conclusion → keywords → full read", "The title is the quickest check and comes first; the abstract follows it.", "Название — самая быстрая проверка и идёт первым; аннотация — после него."],
      ["Full read → conclusion → abstract → keywords → title", "A full read is the most expensive step and comes last, only after screening.", "Полное чтение — самый дорогой шаг и идёт последним, только после отсева."],
      ["Title → introduction → method → results → references", "These are sections of a full read, not a screening sequence.", "Это разделы полного чтения, а не последовательность отсева."],
    ], "From the cheapest check to the most expensive: title, abstract, keywords, conclusion, and a full read only if steps 1–4 confirm relevance.", "От самой дешёвой проверки к самой дорогой: название, аннотация, ключевые слова, заключение и полное чтение — только если шаги 1–4 подтвердили релевантность."),
    qx("You found 30 papers. According to the screening protocol, when should a paper be read in full?", "Only after the first four steps confirm its relevance", [
      ["Always, for all 30, before deciding which ones are relevant", "Reading all 30 in full is exactly what screening avoids.", "Читать все 30 целиком — именно то, от чего избавляет отсев."],
      ["Only when it is shorter than ten pages", "Length is not a relevance criterion.", "Длина — не критерий релевантности."],
      ["Only when it is the most cited paper on the whole topic", "Citation count is not part of the protocol; relevance to your problem is.", "Число цитирований не входит в протокол; важна релевантность вашей проблеме."],
    ], "Search wide, screen fast, read relevant work deeply: a full read is step 5, after title, abstract, keywords and conclusion have confirmed relevance.", "Искать широко, отсеивать быстро, релевантное читать глубоко: полное чтение — шаг 5, после того как название, аннотация, ключевые слова и заключение подтвердили релевантность."),
    qx("Abstract: “…evaluates the factual accuracy of three multilingual LLMs on a 500-item benchmark… accuracy drops 18–34% in low-resource languages compared with English.” In the 60-second test, what answers “HOW?”", "Benchmark evaluation comparing low-resource and English results", [
      ["Accuracy drops by 18–34% for low-resource languages compared with English", "That answers “What did they find?”.", "Это ответ на «Что нашли?»."],
      ["Three multilingual LLMs, 500 items and five domains", "That answers “Who / what?” — the objects and data.", "Это ответ на «Кого / что?» — объекты и данные."],
      ["Factual accuracy of multilingual LLMs on a QA task", "That answers “What did they study?”.", "Это ответ на «Что изучали?»."],
    ], "“How” is the method: a benchmark evaluation that compares performance in low-resource languages with English.", "«Как» — это метод: оценка на бенчмарке, которая сравнивает результаты на малоресурсных языках с английским."),
    qx("Which of the five questions for every paper is where research gaps usually start to appear?", "What is still missing?", [
      ["What problem did they study?", "This gives the context and motivation, not what is left open.", "Это контекст и мотивация, а не то, что осталось открытым."],
      ["How did they investigate it?", "This is the method; a gap appears in what the method could not cover.", "Это метод; пробел виден в том, чего метод не охватил."],
      ["What did they find?", "Findings are what is known; gaps are what is not.", "Результаты — это известное; пробелы — неизвестное."],
    ], "“What is still missing?” — limitations, unanswered questions and future work — is where research gaps begin to appear.", "«Чего всё ещё не хватает?» — ограничения, неотвеченные вопросы, future work — здесь начинают проступать пробелы."),
    qx("The literature folder contains records suggested by a generative AI tool, some with no DOI and never opened. What risk does this create?", "The risk of citing fabricated, unverified sources", [
      ["No real risk at all, as long as the topics look relevant", "A relevant-looking topic says nothing about whether the paper exists.", "Подходящая тема ничего не говорит о том, существует ли статья."],
      ["The articles may turn out to be too recent", "Recency is not the risk; existence and accuracy are.", "Риск не в свежести, а в существовании и точности."],
      ["DOIs are unnecessary, so nothing is lost", "DOIs help verify that a paper exists; their absence is a warning sign.", "DOI помогает проверить, что статья существует; его отсутствие — тревожный знак."],
    ], "AI tools can invent authors, titles and DOIs. Records that nobody opened may be fabricated or may not say what you cite them for — an academic integrity risk.", "ИИ-инструменты могут выдумывать авторов, названия и DOI. Записи, которые никто не открывал, могут оказаться выдуманными или говорить не то, ради чего их цитируют, — это риск для академической честности."),
    qx("Which use of AI is acceptable in the Week 2 research workflow?", "Suggesting synonyms for your Boolean query", [
      ["Supplying citations that you have not opened", "Unopened citations may be fabricated; AI cannot replace real sources.", "Неоткрытые ссылки могут оказаться выдуманными; ИИ не заменяет настоящие источники."],
      ["Confirming that your research gap is real", "A gap must be verified against literature you have read.", "Пробел проверяют по прочитанной литературе."],
      ["Summarising papers so you need not read them", "Every claimed gap must rest on literature you actually read, not on AI summaries.", "Каждый заявленный пробел должен опираться на действительно прочитанную литературу, а не на пересказы ИИ."],
    ], "AI can help with keyword ideas, synonyms, terminology and organising notes. It cannot replace peer-reviewed evidence, real papers and DOIs, verified gaps or legitimate citations.", "ИИ помогает с идеями ключевых слов, синонимами, терминами и организацией заметок. Он не заменяет рецензируемые доказательства, реальные статьи и DOI, проверенные пробелы и корректные ссылки."),
  ],
);

const p3 = part(
  "rm-l2-p3",
  { en: "Connecting evidence and detecting the gap", ru: "Связать доказательства и найти пробел" },
  {
    en: `## The evidence matrix
Stop collecting papers in a list: put them in a comparison table, one row per paper.
| Paper | Problem / purpose | Method | Data / participants | Main finding | Limitation | What is missing? |
|---|---|---|---|---|---|---|
| Smith et al. (2023) | multilingual LLM factual QA accuracy | benchmark evaluation | 3 LLMs · 500 QA items · 5 domains | accuracy drops 18–34% for low-resource languages | no Kazakh-specific tasks | Kazakh factual QA evaluation |
- Write every cell **in your own words**; do not copy the abstract.
- A cell you cannot fill is a signal to re-read the paper.
- Gaps start in the **Limitation** and **What is missing?** columns. The matrix later becomes the base of your literature review.
## Don't collect papers — connect them
| Summary trap | Pattern approach |
|---|---|
| "Paper 1 says X. Paper 2 says Y. Paper 3 says Z." | "Papers 1–3 converge on X in English contexts; Paper 4 challenges this in multilingual settings." |
| a list of summaries: no analysis, no gap | agreements, contradictions and what nobody studied |
= Pattern → Contradiction → Gap → Your question
Ask of any set of papers: what do they **agree** on, where do they **disagree**, what have **none** of them studied? Clues: the same finding everywhere, conflicting results, one dataset reused, a missing population or language, outdated data, small samples, only one method.
## The quiz evidence table (SafeDrive)
| Study | Design and sample | Main finding | Limitation |
|---|---|---|---|
| A | randomised; 150 taxi drivers aged 35–55; 8 weeks | alerts reduced self-reported near-misses; accident-rate difference small, not significant | near-misses self-reported; age group differs from long-haul drivers |
| B | observational; 900 users of a commercial alert app | frequent responders had fewer logged fatigue events | drivers chose how often to respond; baseline sleep not controlled |
| C | qualitative interviews; 18 long-haul drivers | audio alerts valued at night; constant video felt intrusive, some covered the camera | small qualitative sample; no effect estimate |
| D | systematic review of 15 driver-monitoring studies | mixed results; inconsistent "fatigue event" definitions, different outcomes, short follow-up | few studies on long-haul truck drivers; attrition common |
The quiz asks for an analytical paragraph "organised by findings, methods, or limitations — not as four separate mini-summaries". Build each sentence around a **theme** and cite several studies in it:
- Findings: "Alerts were linked to fewer near-misses or fatigue events in A and B, but the review (D) found mixed results."
- Methods: "Only A was randomised; B was observational and C relied on 18 interviews, so causal evidence is thin."
- Limitations: "Outcomes were often self-reported (A) or uncontrolled (B), and few studies covered long-haul drivers (D)."
> Exam trap: "Study A found… Study B found… Study C found…" is the summary trap and loses the synthesis marks.
## What a research gap is
**Research gap** = something important that previous research has not adequately **answered, tested, explained, compared or studied in your specific context**. It must **emerge from examining previous research** — not from a failed search, not from opinion.
| Gap type | Signal | Example |
|---|---|---|
| Context | studied in other countries or languages | LLMs evaluated in English; limited evidence for Kazakh |
| Population | a group is missing | professional developers studied, undergraduates not; taxi drivers, not truck drivers |
| Method | studied in only one way | mostly surveys, little experimental evaluation |
| Contradiction | studies disagree | Study A reports improvement, Study B none |
| Evaluation / data | narrow datasets, tasks or metrics | a 50-item test set; inconsistent "fatigue event" definitions |
Gap or not? "I searched Google and found nothing" → **not enough evidence** (a search failure). "I personally think ChatGPT is inaccurate" → **not a gap** (opinion). "Several studies evaluate multilingual LLMs, but none of the reviewed studies evaluate Kazakh factual QA" → **possible gap**. "Two relevant studies report conflicting results" → **possible contradiction gap**.
## Never write "no research exists"
It is almost never true and nobody can verify it. Say what **your review** shows:
| Avoid | Write instead |
|---|---|
| "No research exists on this topic." | "None of the reviewed studies examined…" |
| "There are not many studies about Kazakh LLMs." | "Existing studies evaluate X; however, evidence regarding Z remains limited." |
= We know: studies show X. However: most focus on Y / results disagree. We still do not know: whether Z holds in context C. Therefore: this study investigates Z.
Signal words — **however, but, limited, few studies, remains unclear, future work** — are **clues, not proof**. Look for them in **Discussion, Limitations, Conclusion and Future Work**, and record the idea with its citation: copying the sentence as your own writing is plagiarism. Before taking an author's future work as your gap, check that it **has not been done since**, that it **fits your project**, and that you **can realistically investigate it**.
## Model answer: a gap that follows from the evidence
"Study A found that alerts reduced self-reported near-misses, but only among taxi drivers aged 35–55, and the review (D) notes that few studies focus on long-haul truck drivers and that fatigue outcomes are defined inconsistently. Evidence for long-haul truck drivers, measured with a validated fatigue scale, therefore remains limited. A six-week comparison of SafeDrive and a paper checklist among 60 long-haul drivers could address this population and measurement gap."
?? Why is "I couldn't find anything on Google in five minutes" not a research gap?
?= It shows a failed search, not an examination of the literature. A gap must come from what the reviewed studies did and did not cover.
?? Study A reports that a tool improves performance; Study B finds no improvement. Which gap type is this?
?= A contradiction gap: the evidence is inconsistent and needs investigation.`,
    ru: `## Матрица доказательств (evidence matrix)
Статьи не копят списком, а сводят в сравнительную таблицу, по строке на статью.
| Статья | Проблема / цель | Метод | Данные / участники | Главный результат | Ограничение | Чего не хватает? |
|---|---|---|---|---|---|---|
| Smith et al. (2023) | точность мультиязычных LLM в фактических вопросах | оценка на бенчмарке | 3 LLM · 500 вопросов · 5 областей | точность падает на 18–34% для малоресурсных языков | нет задач на казахском | оценка фактических вопросов на казахском |
- Каждую ячейку заполняют **своими словами**; аннотацию не копируют.
- Ячейка, которую не получается заполнить, — сигнал перечитать статью.
- Пробелы начинаются в колонках **«Ограничение»** и **«Чего не хватает?»**. Позже матрица станет основой обзора литературы.
## Не копить статьи, а связывать
| Ловушка пересказа (summary trap) | Подход через закономерности (pattern approach) |
|---|---|
| «Статья 1 говорит X. Статья 2 говорит Y. Статья 3 говорит Z». | «Статьи 1–3 сходятся на X для английского; статья 4 оспаривает это в мультиязычной среде». |
| список пересказов: ни анализа, ни пробела | согласия, противоречия и то, чего никто не изучал |
= Pattern → Contradiction → Gap → Your question
К любому набору статей три вопроса: в чём они **согласны**, где **расходятся**, чего **ни одна** не изучала? Подсказки: везде один и тот же вывод, противоречивые результаты, один и тот же датасет, пропущенная группа людей или язык, устаревшие данные, малые выборки, только один метод.
## Таблица доказательств из квиза (SafeDrive)
| Исследование | Дизайн и выборка | Главный результат | Ограничение |
|---|---|---|---|
| A | рандомизированное; 150 таксистов 35–55 лет; 8 недель | сигналы снизили число опасных ситуаций (near-misses) по самоотчётам; разница в аварийности мала и незначима | near-misses — самоотчёт; возраст отличается от дальнобойщиков |
| B | наблюдательное; 900 пользователей коммерческого приложения | у часто реагирующих на сигналы меньше зафиксированных эпизодов усталости | водители сами решали, как часто реагировать; исходный сон не контролировался |
| C | качественные интервью; 18 дальнобойщиков | ночью ценят звуковые сигналы; постоянное видео воспринимают как вторжение, некоторые закрывали камеру | маленькая качественная выборка; эффект не оценён количественно |
| D | систематический обзор 15 исследований мониторинга водителей | результаты смешанные; разные определения «fatigue event», разные показатели, короткое наблюдение | мало работ именно о дальнобойщиках; участники часто выбывали |
Квиз просит аналитический абзац, «organised by findings, methods, or limitations — not as four separate mini-summaries». Каждое предложение строится вокруг **темы** и ссылается сразу на несколько исследований:
- Результаты: «Alerts were linked to fewer near-misses or fatigue events in A and B, but the review (D) found mixed results.»
- Методы: «Only A was randomised; B was observational and C relied on 18 interviews, so causal evidence is thin.»
- Ограничения: «Outcomes were often self-reported (A) or uncontrolled (B), and few studies covered long-haul drivers (D).»
> Ловушка экзамена: «Study A found… Study B found… Study C found…» — это ловушка пересказа, баллы за синтез теряются.
## Что такое исследовательский пробел
**Исследовательский пробел (research gap)** — нечто важное, что прежние исследования недостаточно **ответили, проверили, объяснили, сравнили или изучили в вашем конкретном контексте**. Он должен **вытекать из анализа прежних работ** — не из неудачного поиска и не из мнения.
| Тип пробела | Признак | Пример |
|---|---|---|
| Контекстный (context) | изучено в других странах или языках | LLM оценивали на английском; по казахскому данных мало |
| По группе (population) | не хватает группы людей | изучали профессиональных разработчиков, а не студентов; таксистов, а не дальнобойщиков |
| Методический (method) | изучали только одним способом | в основном опросы, экспериментов мало |
| Противоречие (contradiction) | исследования расходятся | исследование A сообщает об улучшении, B — нет |
| Оценочный / по данным (evaluation / data) | узкие датасеты, задачи или метрики | тест из 50 пунктов; разные определения «fatigue event» |
Пробел или нет? «Поиск в Google ничего не дал» → **недостаточно доказательств** (неудачный поиск). «Лично мне кажется, что ChatGPT неточен» → **не пробел** (мнение). «Несколько работ оценивают мультиязычные LLM, но ни одна из рассмотренных не оценивает фактические вопросы на казахском» → **возможный пробел**. «Два релевантных исследования дают противоречивые результаты» → **возможный пробел-противоречие**.
## Никогда не писать «исследований нет»
Это почти никогда не правда, и проверить это никто не может. Писать нужно то, что показал **ваш обзор**:
| Не писать | Писать вместо этого |
|---|---|
| «No research exists on this topic». | «None of the reviewed studies examined…» |
| «There are not many studies about Kazakh LLMs». | «Existing studies evaluate X; however, evidence regarding Z remains limited». |
= We know: studies show X. However: most focus on Y / results disagree. We still do not know: whether Z holds in context C. Therefore: this study investigates Z.
Слова-сигналы — **however, but, limited, few studies, remains unclear, future work** — это **подсказки, а не доказательство**. Их ищут в разделах **Discussion, Limitations, Conclusion и Future Work** и записывают идею со ссылкой: скопировать предложение как свой текст — плагиат. Прежде чем брать чужое future work как свой пробел, стоит проверить: **не сделано ли это с тех пор**, **подходит ли к вашему проекту** и **реально ли это исследовать**.
## Образцовый ответ: пробел, который следует из доказательств
«Study A found that alerts reduced self-reported near-misses, but only among taxi drivers aged 35–55, and the review (D) notes that few studies focus on long-haul truck drivers and that fatigue outcomes are defined inconsistently. Evidence for long-haul truck drivers, measured with a validated fatigue scale, therefore remains limited. A six-week comparison of SafeDrive and a paper checklist among 60 long-haul drivers could address this population and measurement gap.»
?? Почему «за пять минут в Google ничего не нашлось» — не исследовательский пробел?
?= Это неудачный поиск, а не анализ литературы. Пробел должен следовать из того, что рассмотренные исследования охватили и чего не охватили.
?? Исследование A сообщает, что инструмент улучшает результаты, исследование B улучшения не находит. Какой это тип пробела?
?= Пробел-противоречие (contradiction gap): данные противоречивы, и это нужно исследовать.`,
  },
  [
    qx("Which set of columns makes up the evidence matrix from the lecture?", "Paper, purpose, method, data, finding, limitation, what is missing", [
      ["Paper, journal, impact factor, citation count, year, country, page count", "These describe where a paper sits, not what it studied or left open.", "Это описывает, где статья опубликована, а не что в ней изучено и что осталось открытым."],
      ["Author, university, funding, co-authors, email, website, awards", "Biographical data do not help compare studies.", "Биографические данные не помогают сравнивать исследования."],
      ["Title, abstract, figures, tables, appendices, references, notes", "These are parts of a paper, not analysis columns.", "Это части статьи, а не колонки для анализа."],
    ], "Seven columns: Paper · Problem / Purpose · Method · Data / Participants · Main Finding · Limitation · What Is Missing?", "Семь колонок: статья · проблема / цель · метод · данные / участники · главный результат · ограничение · чего не хватает?"),
    qx("In which columns of the evidence matrix do research gaps begin to show?", "Limitation and What is missing?", [
      ["Method and Data / participants", "These describe how the study was done; gaps show in what it did not do.", "Это описание того, как сделано исследование; пробелы видны в том, чего оно не сделало."],
      ["Main finding and Problem / purpose", "These describe what was done and found, not what is left open.", "Это то, что сделано и найдено, а не то, что осталось открытым."],
      ["Paper and the year of publication", "Bibliographic details do not reveal gaps.", "Библиографические данные пробелов не показывают."],
    ], "The Limitation and What-is-missing columns record what each study did NOT do — the raw material of a gap.", "Колонки «ограничение» и «чего не хватает» фиксируют, чего исследование НЕ сделало, — это сырьё для пробела."),
    qx("How should the cells of the evidence matrix be filled in?", "In your own words, after reading each paper closely", [
      ["By pasting each paper's abstract into the cells", "Copied abstracts show no understanding and are not your writing.", "Скопированные аннотации не показывают понимания и не являются вашим текстом."],
      ["By asking an AI tool to fill them from the titles", "AI cannot replace reading; it may invent findings.", "ИИ не заменяет чтения и может выдумать результаты."],
      ["With guesses, to be checked at the end of the course", "A cell you cannot fill means: re-read the paper now.", "Ячейка, которую не получается заполнить, значит: перечитать статью сейчас."],
    ], "Describe each study in your own words — do not copy the abstract. If you cannot fill a field, re-read the paper more carefully.", "Каждое исследование описывают своими словами — аннотацию не копируют. Если поле не заполняется, статью перечитывают внимательнее."),
    qx("“Paper 1 says X. Paper 2 says Y. Paper 3 says Z.” What is wrong with this literature work?", "It lists summaries instead of comparing the papers", [
      ["It cites too few papers to be a proper review", "The number is not the issue; even 20 papers listed this way would still be a list.", "Дело не в количестве: и 20 статей, перечисленных так, останутся списком."],
      ["It should present the papers in order of their publication date", "Ordering by date is still listing; the comparison is missing.", "Сортировка по дате — всё равно список; сравнения нет."],
      ["It is too analytical for an undergraduate review", "It is the opposite — there is no analysis at all.", "Наоборот — анализа здесь нет вообще."],
    ], "This is the summary trap: no agreements, contradictions or gaps are shown. A researcher compares — what do the papers agree on, where do they disagree, what has none of them studied?", "Это ловушка пересказа: не видно ни согласий, ни противоречий, ни пробелов. Исследователь сравнивает: в чём статьи согласны, где расходятся, чего не изучала ни одна?"),
    qx("Which sentence is synthesis rather than summary of the SafeDrive studies?", "Only Study A was randomised; B was observational and C qualitative, so causal evidence is thin", [
      ["Study A was a randomised study of 150 taxi drivers aged 35 to 55 over eight weeks", "It summarises one study and compares nothing.", "Это пересказ одного исследования без сравнения."],
      ["Study B observed 900 users of a commercial drowsiness-alert app and their fatigue events", "Again a single-study summary.", "Снова пересказ одного исследования."],
      ["Study D reviewed fifteen digital driver-monitoring studies and found that the results were mixed", "One study's result, not a theme across studies.", "Результат одного исследования, а не тема, общая для нескольких."],
    ], "Synthesis is organised by a theme (here: methods) and connects several studies in one statement. Single-study sentences are mini-summaries.", "Синтез строится вокруг темы (здесь — методов) и связывает несколько исследований в одном утверждении. Предложения об одном исследовании — мини-пересказы."),
    qx("In the SafeDrive evidence table, which study provides qualitative rather than quantitative data?", "Study C — interviews with 18 long-haul truck drivers", [
      ["Study A — a randomised study of 150 taxi drivers", "It counts near-misses and accidents — numbers, so quantitative data.", "Он считает опасные ситуации и аварии — это числа, то есть количественные данные."],
      ["Study B — an observational study of 900 app users", "Logged fatigue events and response frequencies are counts — quantitative.", "Зарегистрированные эпизоды усталости и частота реакций — количественные данные."],
      ["Study D — a systematic review of 15 monitoring studies", "It compares results and outcome measures across studies; it does not collect interview data.", "Он сравнивает результаты и показатели разных работ, а не собирает интервью."],
    ], "Interviews produce words, experiences and opinions (drivers found constant video intrusive) — qualitative data. Study C itself notes that it does not estimate the effect quantitatively.", "Интервью дают слова, опыт и мнения (постоянное видео водители воспринимают как вторжение) — это качественные данные. Само исследование C отмечает, что не оценивает эффект количественно."),
    qx("Which chain describes how comparing papers leads to your research question?", "Pattern → Contradiction → Gap → Your question", [
      ["Your question → Gap → Pattern → Contradiction", "The question comes last — it follows from the gap, not the other way round.", "Вопрос идёт последним — он следует из пробела, а не наоборот."],
      ["Gap → Your question → Pattern → Contradiction", "Patterns and contradictions are noticed first; they reveal the gap.", "Сначала замечают закономерности и противоречия — они и показывают пробел."],
      ["Contradiction → Your question → Gap → Pattern", "The question cannot come before the gap it is meant to address.", "Вопрос не может появиться раньше пробела, на который он отвечает."],
    ], "Pattern → Contradiction → Gap → Your question: compare the papers, notice agreement and disagreement, find what is missing, then ask about it.", "Закономерность → противоречие → пробел → ваш вопрос: сравнить статьи, заметить согласия и расхождения, найти недостающее и спросить о нём."),
    qx("Which statement best defines a research gap?", "What previous studies have not adequately answered in your context", [
      ["A topic that nobody anywhere in the world has ever studied or written about", "Almost every topic has some research; a gap is narrower and context-specific.", "Почти по любой теме что-то есть; пробел уже и привязан к контексту."],
      ["Any topic the researcher personally finds interesting", "Interest is not evidence; a gap must emerge from the literature.", "Интерес — не доказательство; пробел должен вытекать из литературы."],
      ["A paper you could not find in a five-minute search", "A failed search is not a gap.", "Неудачный поиск — не пробел."],
    ], "A research gap is something important that previous research has not adequately answered, tested, explained, compared or studied in your specific context.", "Исследовательский пробел — нечто важное, что прежние работы недостаточно ответили, проверили, объяснили, сравнили или изучили в вашем конкретном контексте."),
    qx("“I searched Google and didn't find anything about this topic.” How is this classified in the gap game?", "Not enough evidence — a search failure, not a gap", [
      ["A possible context gap, since the topic is missing", "Nothing was examined, so no context gap can be shown.", "Ничего не проанализировано, поэтому контекстный пробел не показан."],
      ["A strong gap, because the search came back empty", "An empty result may just mean poor keywords or the wrong database.", "Пустой результат может означать лишь плохие ключевые слова или не ту базу."],
      ["A contradiction gap, since sources seem to disagree", "No sources were found, so nothing can disagree.", "Источники не найдены, значит, и расходиться нечему."],
    ], "Verdict: NOT ENOUGH EVIDENCE. A gap must emerge from examining previous research, not from a failed search on regular Google.", "Вердикт: НЕДОСТАТОЧНО ДОКАЗАТЕЛЬСТВ. Пробел должен вытекать из анализа прежних работ, а не из неудачного поиска в обычном Google."),
    qx("“Two relevant studies report conflicting results on whether AI coding assistants improve novice programming performance.” What is this?", "A possible contradiction gap in the evidence", [
      ["Not a gap, because the two studies simply disagree", "Disagreement is exactly what makes it a legitimate gap signal.", "Расхождение — именно то, что делает это законным сигналом пробела."],
      ["A population gap among novice programmers", "Novices were studied; the issue is the inconsistent results.", "Новичков изучали; дело в противоречивых результатах."],
      ["A method gap, since only surveys were used", "Nothing says only surveys were used; the signal is conflicting findings.", "Нигде не сказано, что использовались только опросы; сигнал — противоречивые результаты."],
    ], "Inconsistent evidence across studies is a legitimate gap signal: a possible contradiction gap that needs investigation.", "Противоречивые данные разных исследований — законный сигнал: возможный пробел-противоречие, который нужно исследовать."),
    qx("Study A tested drowsiness alerts with taxi drivers aged 35–55; the SafeDrive study targets long-haul truck drivers. Which gap type does this point to?", "Population gap", [
      ["Contradiction gap", "Nothing here conflicts; the issue is who was studied.", "Здесь ничего не противоречит друг другу; вопрос в том, кого изучали."],
      ["Method gap", "Study A was randomised — a strong method; the mismatch is in the group.", "Исследование A рандомизированное — сильный метод; несовпадение в группе."],
      ["Evaluation / data gap", "The measures are not the point here; the drivers studied are a different group.", "Дело не в показателях: изучали другую группу водителей."],
    ], "The evidence comes from a different group (taxi drivers of a certain age), so the target population — long-haul truck drivers — is missing.", "Данные получены на другой группе (таксисты определённого возраста), а целевой группы — дальнобойщиков — нет."),
    qx("Most studies on a tool used surveys, and experimental evaluation is limited. Which gap type is this?", "Method gap: it was studied in only one way", [
      ["Population gap: a group of people is missing", "No group is said to be missing; the issue is how the topic was studied.", "Не сказано, что не хватает группы; вопрос в том, как изучали тему."],
      ["Context gap: a country or language is missing", "No country or language is mentioned; the method is the issue.", "Страна или язык не упоминаются; дело в методе."],
      ["Contradiction gap: the results disagree", "Nothing says the results conflict.", "Нигде не сказано, что результаты противоречат друг другу."],
    ], "A method gap asks how the topic has NOT been studied: mostly surveys, limited experimental evaluation.", "Методический пробел — о том, КАК тему ещё не изучали: в основном опросы, экспериментов мало."),
    qx("Study D found inconsistent definitions of a “fatigue event”, different outcome measures and short follow-up. Which gap type do these point to most directly?", "Evaluation / data gap: limited, inconsistent measures", [
      ["Population gap: the wrong group of drivers was studied", "Population is a separate remark in Study D; these points are about measurement.", "Группа — отдельное замечание в исследовании D; эти пункты — об измерении."],
      ["Context gap: the studies come from other countries", "No countries are mentioned; the issue is how outcomes were measured.", "Страны не упоминаются; дело в том, как измеряли результаты."],
      ["Method gap: every study used the same interview design", "The review does not say that; it criticises definitions and outcome measures.", "Обзор этого не утверждает; он критикует определения и показатели."],
    ], "Inconsistent definitions, different outcomes and short follow-up are limitations of datasets, tasks and metrics — an evaluation / data gap.", "Разные определения, разные показатели и короткое наблюдение — ограничения данных, задач и метрик, то есть оценочный пробел (evaluation / data gap)."),
    qx("LLMs are well evaluated in English, but evidence for Kazakh is limited. Which gap type is this?", "Context gap", [
      ["Method gap", "The method is not criticised; the language context is missing.", "Метод не критикуется; не хватает языкового контекста."],
      ["Population gap", "The difference is a language, which the lecture classes as context.", "Разница в языке, а лекция относит это к контексту."],
      ["Contradiction gap", "No studies disagree; one context simply lacks evidence.", "Исследования не противоречат друг другу; просто по одному контексту мало данных."],
    ], "Context gap: studied in other countries or languages but not in your specific context — the lecture's own example is English vs Kazakh.", "Контекстный пробел: изучено в других странах или языках, но не в вашем контексте; пример самой лекции — английский против казахского."),
    qx("Which gap statement would earn the mark in the SafeDrive quiz?", "Study A used taxi drivers and D notes few long-haul studies, so evidence for this group is limited", [
      ["No research exists on drowsiness-alert apps for long-haul truck drivers, so this study is entirely new", "“No research exists” is what the quiz forbids — it is unverifiable and contradicted by Studies A–D.", "«No research exists» квиз прямо запрещает: это непроверяемо и опровергается исследованиями A–D."],
      ["I could not find any study on SafeDrive in five minutes, which proves there is a clear gap", "A failed search is not a gap.", "Неудачный поиск — не пробел."],
      ["Drowsiness apps are important, and our team believes SafeDrive will work better than others", "Opinion and a prediction, not a gap derived from evidence.", "Мнение и прогноз, а не пробел, выведенный из доказательств."],
    ], "A genuine gap points to specific studies and says what they leave limited — here the population (taxi drivers vs long-haul truck drivers) — without claiming that no research exists.", "Настоящий пробел опирается на конкретные исследования и говорит, что в них ограничено, — здесь группа (таксисты, а не дальнобойщики), — не утверждая, что исследований нет."),
    qx("How should “There are not many studies about Kazakh LLMs” be improved?", "State what existing studies cover, then what remains limited", [
      ["Add “in my opinion” so that the claim is honest", "Labelling it as opinion does not make it a literature-based gap.", "Пометка «по моему мнению» не делает это пробелом из литературы."],
      ["Replace it with the stronger “No research exists on Kazakh LLMs at all”", "That is even stronger and still unverifiable.", "Это ещё категоричнее и по-прежнему непроверяемо."],
      ["Add a statistic produced by an AI chatbot", "Unverified AI numbers may be fabricated — an integrity violation.", "Непроверенные цифры от ИИ могут быть выдуманы — это нарушение честности."],
    ], "The bad version is vague and unsupported. Better: “Existing studies have evaluated X. However, most focus on Y. Evidence regarding Z remains limited.”", "Плохой вариант расплывчат и ничем не подкреплён. Лучше: «Existing studies have evaluated X. However, most focus on Y. Evidence regarding Z remains limited»."),
    qx("What is the order of the gap formula?", "We know… → However… → We still do not know… → Therefore, this study…", [
      ["Therefore, this study… → We know… → However… → We still do not know…", "“Therefore” is the conclusion; it cannot open the argument.", "«Therefore» — вывод; аргумент с него не начинается."],
      ["However… → Therefore, this study… → We know… → We still do not know…", "The limitation needs the established knowledge before it.", "Ограничению нужно сначала установленное знание."],
      ["We still do not know… → We know… → Therefore, this study… → However…", "The unknown is defined against what is known, so the known comes first.", "Неизвестное определяют относительно известного, поэтому известное идёт первым."],
    ], "Literature (we know) → limitation (however) → gap (we still do not know) → your study (therefore).", "Литература (мы знаем) → ограничение (однако) → пробел (мы всё ещё не знаем) → ваше исследование (поэтому)."),
    tfx("Words like “however”, “limited” and “remains unclear” in a paper prove that a research gap exists.", false,
      "They are clues, not proof: verify them against your full literature review before claiming a gap.",
      "Это подсказки, а не доказательство: их проверяют всем обзором литературы, прежде чем заявлять пробел.",
      "“True” would let one sentence in one paper stand in for a review of the literature.",
      "Ответ «верно» позволил бы одному предложению из одной статьи заменить обзор литературы."),
    qx("A 2021 paper lists your idea under “Future work”. What must you check before claiming it as your gap?", "Whether it was done since, fits your project and is doable", [
      ["Whether the authors give written permission to use the idea", "Permission is not the issue; you cite the idea and verify it.", "Дело не в разрешении: идею цитируют и проверяют."],
      ["Nothing — an author's future work is automatically a valid gap", "The slide says the opposite: future work ≠ your gap — yet.", "Слайд говорит обратное: future work ≠ ваш пробел — пока."],
      ["Whether the sentence can be copied into your introduction", "Copying it as your own writing is plagiarism.", "Скопировать это как свой текст — плагиат."],
    ], "Three checks: has it already been done (search for later papers)? is it relevant to your project? can you realistically investigate it with your time, data and resources?", "Три проверки: не сделано ли это уже (поиск более поздних статей)? относится ли к вашему проекту? реально ли это исследовать при ваших времени, данных и ресурсах?"),
    qx("In which sections of a paper are authors most likely to signal what remains unresolved?", "Discussion, Limitations, Conclusion and Future Work", [
      ["Title, keywords, author list and the institutional affiliations", "These identify the paper; they rarely discuss what is unresolved.", "Это реквизиты статьи; о нерешённом там почти не пишут."],
      ["Acknowledgements and funding statement", "They thank people and funders, not discuss open questions.", "Там благодарят людей и спонсоров, а не обсуждают открытые вопросы."],
      ["Reference list and the appendices", "These list sources and extra material, not open questions.", "Там список источников и дополнительные материалы, а не открытые вопросы."],
    ], "Authors interpret results in the Discussion, admit constraints in Limitations, sum up in the Conclusion and suggest next steps in Future Work.", "Авторы толкуют результаты в Discussion, признают ограничения в Limitations, подводят итог в Conclusion и предлагают следующие шаги в Future Work."),
  ],
);

const p4 = part(
  "rm-l2-p4",
  { en: "From gap to a research question", ru: "От пробела к исследовательскому вопросу" },
  {
    en: `## Topic or research question?
A **topic** names an area: "Software quality", "Cybersecurity in mobile applications". A **research question** asks something that collected data can answer: "How does the use of AI coding assistants affect programming task completion time among university students?" Narrow the topic in several steps first:
= Artificial Intelligence → AI in Software Engineering → AI coding assistants → AI coding assistants used by university students → Effect of AI coding assistants on programming performance
## Problem → gap → RQ → aim → objectives
| Step | Kazakh LLM example | SafeDrive example |
|---|---|---|
| Problem | LLMs may give inaccurate Kazakh answers | alert apps are proposed for long-haul drivers |
| Evidence | studies evaluate multilingual LLM performance | Studies A–D: mixed results, mostly other groups |
| Gap | limited evaluation of Kazakh factual QA | little evidence for long-haul drivers with a validated fatigue measure |
| Research question | How accurately do selected multilingual LLMs answer Kazakh factual questions? | Do long-haul drivers using SafeDrive have lower fatigue-scale scores than checklist users after six weeks? |
| Aim — one sentence: what the study intends to achieve | to evaluate the factual accuracy of selected LLMs in Kazakh | to evaluate whether SafeDrive lowers fatigue compared with a paper checklist |
| Objectives — concrete steps with action verbs | build a Kazakh question set; score each model's answers; compare the models | measure fatigue at baseline and week 6; compare the groups; summarise alert logs |
Every link must connect: the RQ follows from the gap, the aim restates what the RQ will answer, and each objective is a step towards that answer.
> The literature should change your question. If it is identical to your Week 1 version, you have probably not engaged deeply enough with the literature. O'Leary: **Idea → Reading → Question → More reading → Refined question.**
## Anatomy of a strong RQ
@diagram rm2-rq-anatomy
| Element | Asks | SafeDrive example |
|---|---|---|
| Population / object | who or what is studied? | long-haul truck drivers |
| Factor / comparison | what is investigated or compared? | SafeDrive vs a standard paper checklist |
| Outcome | what is measured or examined? | score on a validated fatigue scale |
| Context / time | where, under what conditions? | six weeks of normal work |
= Among [population], does [factor], compared with [comparison], change [measurable outcome] in [context / time]?
The practical task labels the same parts Population / Object, Factor / Variable, Outcome and Context. The pattern mirrors **PICO** from evidence-based research: Population, Intervention, Comparison, Outcome.
## Five criteria for every RQ
| Criterion | Test | Fails when… |
|---|---|---|
| Clear | do two readers understand it the same way? | vague words: "good", "better", "improve", "technology" |
| Focused | one question with a bounded scope? | it covers a whole field or bundles several questions |
| Researchable | can evidence be collected to answer it? | it is a value judgement or asks for a definition |
| Feasible | can you get the data with your time, access and tools? | it needs private data, huge compute or years of follow-up |
| Connected | does it follow from the problem and the gap? | it ignores the limitation you found |
## Weak → strong
| Weak RQ | What is wrong | Stronger RQ |
|---|---|---|
| "Does technology improve road safety?" | too broad: no population, no specific factor, no measurable outcome | "Among long-haul truck drivers, does SafeDrive, compared with a paper checklist, lower validated fatigue-scale scores over six weeks?" |
| "What is Artificial Intelligence?" | answered by a definition, no data needed | "How does AI-assistant use affect task completion time among second-year SE students?" |
| "Is Rust better than Java?" | "better" is undefined | "How do Rust and Java microservices compare in latency at 100,000 requests/sec?" |
| "Why is ChatGPT so inaccurate?" | assumes its own answer | "How often do selected LLMs give factually incorrect answers to Kazakh questions?" |
> Exam trap: "Does technology improve road safety?" fails because it is **too broad, with no measurable outcome** — not because it is "too narrow" or "fails to mention AI".
## Feasible = an outcome your data can measure
Accidents are rare. A six-week study of 60 drivers will hardly see enough of them to compare groups — even Study A (150 drivers, 8 weeks) found only a small, non-significant difference in accident rate. The SafeDrive RQ should use an outcome the planned data record: the **validated fatigue-scale score**, self-reported fatigue or logged alerts. Feasibility also means **data access** (are you allowed to get it?), **infrastructure** (devices, compute, tools) and **time** (collection, analysis and writing within the trimester).
In a comparative RQ the **independent variable** is what differs between groups (SafeDrive vs checklist) and the **dependent variable** is what is measured (fatigue score). An exploratory question names **concepts** instead: "How do long-haul drivers experience in-cab camera monitoring?" — privacy, trust, acceptance.
## The evidence chain and the exit check
= My claim → Academic sources → Evidence → Pattern across studies → Limitation / unknown → Research gap → Research question
An argument is only as strong as its weakest link. In peer review the partner may ask only one thing: **"What is your evidence?"** Before leaving the session, everyone must be able to say:
= My problem is… Evidence from previous research shows… However… The possible gap is… Therefore, my research question is…
The Week 2 deliverable, the **Research Evidence Sheet**, holds all of this: the problem, keywords, query and databases, at least 5 papers in an evidence matrix, a preliminary gap and the refined RQ with full references.
?? Rewrite "Does technology improve road safety?" for the SafeDrive study.
?= "Among long-haul truck drivers, does using SafeDrive for six weeks, compared with a standard paper fatigue checklist, lead to lower scores on a validated fatigue scale?" Population, factor and comparison, measurable outcome and time are all named.
?? How does a research aim differ from the research question?
?= The RQ asks what the data will answer; the aim states in one sentence what the study intends to achieve ("To evaluate whether…"). Objectives then break the aim into concrete steps.`,
    ru: `## Тема или исследовательский вопрос?
**Тема (topic)** называет область: «Software quality», «Cybersecurity in mobile applications». **Исследовательский вопрос** спрашивает то, на что могут ответить собранные данные: «How does the use of AI coding assistants affect programming task completion time among university students?» Сначала тему сужают в несколько шагов:
= Artificial Intelligence → AI in Software Engineering → AI coding assistants → AI coding assistants used by university students → Effect of AI coding assistants on programming performance
## Проблема → пробел → RQ → цель → задачи
| Шаг | Пример про казахские LLM | Пример SafeDrive |
|---|---|---|
| Проблема | LLM могут давать неточные ответы на казахском | приложения-сигнализаторы предлагают дальнобойщикам |
| Доказательства | работы оценивают мультиязычные LLM | исследования A–D: смешанные результаты, в основном другие группы |
| Пробел | фактические вопросы на казахском оценены мало | мало данных о дальнобойщиках с валидированной мерой усталости |
| Исследовательский вопрос | How accurately do selected multilingual LLMs answer Kazakh factual questions? | Do long-haul drivers using SafeDrive have lower fatigue-scale scores than checklist users after six weeks? |
| Цель (aim) — одно предложение: чего исследование хочет достичь | оценить фактическую точность выбранных LLM на казахском | оценить, снижает ли SafeDrive усталость по сравнению с бумажным чек-листом |
| Задачи (objectives) — конкретные шаги с глаголами действия | составить набор вопросов на казахском; оценить ответы каждой модели; сравнить модели | измерить усталость в начале и на 6-й неделе; сравнить группы; обобщить журналы сигналов |
Каждое звено должно быть связано: RQ следует из пробела, цель повторяет, на что ответит RQ, а каждая задача — шаг к этому ответу.
> Литература должна менять вопрос. Если он совпадает с версией недели 1, скорее всего, погружение в литературу было недостаточно глубоким. О'Лири (O'Leary): **идея → чтение → вопрос → ещё чтение → уточнённый вопрос.**
## Анатомия сильного RQ
@diagram rm2-rq-anatomy
| Элемент | Вопрос | Пример SafeDrive |
|---|---|---|
| Группа / объект (population / object) | кого или что изучают? | дальнобойщики (long-haul truck drivers) |
| Фактор / сравнение (factor / comparison) | что исследуют или сравнивают? | SafeDrive против стандартного бумажного чек-листа |
| Результат (outcome) | что измеряют или изучают? | балл по валидированной шкале усталости |
| Контекст / срок (context / time) | где, в каких условиях? | шесть недель обычной работы |
= Among [population], does [factor], compared with [comparison], change [measurable outcome] in [context / time]?
В практическом задании те же части называются Population / Object, Factor / Variable, Outcome и Context. Схема повторяет **PICO** из доказательных исследований: Population, Intervention, Comparison, Outcome.
## Пять критериев для любого RQ
| Критерий | Проверка | Не проходит, когда… |
|---|---|---|
| Ясный (clear) | двое читателей поймут его одинаково? | размытые слова: «good», «better», «improve», «technology» |
| Сфокусированный (focused) | один вопрос с ограниченными рамками? | охватывает целую область или объединяет несколько вопросов |
| Исследуемый (researchable) | можно ли собрать доказательства для ответа? | это оценочное суждение или вопрос об определении |
| Выполнимый (feasible) | можно ли получить данные при имеющихся времени, доступе и инструментах? | нужны закрытые данные, огромные вычисления или годы наблюдения |
| Связанный (connected) | следует ли он из проблемы и пробела? | игнорирует найденное ограничение |
## Слабый → сильный
| Слабый RQ | Что не так | Более сильный RQ |
|---|---|---|
| «Does technology improve road safety?» | слишком широкий: нет группы, конкретного фактора и измеримого результата | «Among long-haul truck drivers, does SafeDrive, compared with a paper checklist, lower validated fatigue-scale scores over six weeks?» |
| «What is Artificial Intelligence?» | отвечается определением, данные не нужны | «How does AI-assistant use affect task completion time among second-year SE students?» |
| «Is Rust better than Java?» | «better» не определено | «How do Rust and Java microservices compare in latency at 100,000 requests/sec?» |
| «Why is ChatGPT so inaccurate?» | заранее предполагает ответ | «How often do selected LLMs give factually incorrect answers to Kazakh questions?» |
> Ловушка экзамена: «Does technology improve road safety?» плох тем, что он **слишком широкий и без измеримого результата**, а не тем, что он «слишком узкий» или «не упоминает ИИ».
## Выполнимость = результат, который данные могут измерить
Аварии случаются редко. Шестинедельное исследование на 60 водителях вряд ли увидит их столько, чтобы сравнить группы, — даже в исследовании A (150 водителей, 8 недель) разница в аварийности была малой и незначимой. Поэтому RQ для SafeDrive должен опираться на то, что фиксируют запланированные данные: **балл по валидированной шкале усталости**, самооценку усталости или журнал сигналов. Выполнимость — это ещё и **доступ к данным** (разрешено ли их получить?), **инфраструктура** (устройства, вычисления, инструменты) и **время** (сбор, анализ и написание в пределах триместра).
В сравнительном RQ **независимая переменная (independent variable)** — то, чем различаются группы (SafeDrive или чек-лист), а **зависимая (dependent variable)** — то, что измеряют (балл усталости). Поисковый (exploratory) вопрос вместо этого называет **понятия**: «How do long-haul drivers experience in-cab camera monitoring?» — приватность, доверие, принятие.
## Цепочка доказательств и финальная проверка
= My claim → Academic sources → Evidence → Pattern across studies → Limitation / unknown → Research gap → Research question
Аргумент не сильнее своего самого слабого звена. На взаимной проверке партнёр может спросить только одно: **«What is your evidence?»** Перед уходом с занятия нужно уметь сказать:
= My problem is… Evidence from previous research shows… However… The possible gap is… Therefore, my research question is…
Результат недели 2, **Research Evidence Sheet**, собирает всё это: проблему, ключевые слова, запрос и базы, не меньше 5 статей в матрице доказательств, предварительный пробел и уточнённый RQ с полными ссылками.
?? Переписать «Does technology improve road safety?» для исследования SafeDrive.
?= «Among long-haul truck drivers, does using SafeDrive for six weeks, compared with a standard paper fatigue checklist, lead to lower scores on a validated fatigue scale?» Названы группа, фактор и сравнение, измеримый результат и срок.
?? Чем цель исследования (aim) отличается от исследовательского вопроса?
?= RQ спрашивает, на что ответят данные; цель одним предложением говорит, чего исследование хочет достичь («To evaluate whether…»). Задачи (objectives) затем раскладывают цель на конкретные шаги.`,
  },
  [
    qx("Which of these is a research question rather than a broad topic?", "How does AI assistant use affect task completion time among SE students?", [
      ["Artificial Intelligence and its role in modern Software Engineering practice", "A broad area — nothing is asked and nothing can be measured.", "Широкая область — ничего не спрашивается и ничего не измеряется."],
      ["Cybersecurity of mobile banking applications in Kazakhstan", "Narrower, but still a topic: it names an area without a question.", "Уже, но всё ещё тема: область названа, вопроса нет."],
      ["Software quality and automated testing tools in agile teams", "A topic phrase with no factor–outcome question to answer.", "Название темы без вопроса о факторе и результате."],
    ], "A research question asks something data can answer: population (SE students), factor (AI assistant use), outcome (task completion time).", "Исследовательский вопрос спрашивает то, на что ответят данные: группа (студенты SE), фактор (использование ИИ-ассистента), результат (время выполнения задания)."),
    qx("The team asks: “Does technology improve road safety?” What is wrong with this question?", "It is too broad, with no measurable outcome", [
      ["It is too narrow and specific", "It is the opposite: “technology” and “road safety” cover almost everything.", "Наоборот: «technology» и «road safety» охватывают почти всё."],
      ["It fails to mention artificial intelligence", "Naming AI would not fix it; the population, comparison and outcome are still missing.", "Упоминание ИИ ничего не исправит: группы, сравнения и результата всё равно нет."],
      ["It has no connection to the topic", "It is connected to the topic — just far too general to answer.", "Связь с темой есть — вопрос просто слишком общий, чтобы на него ответить."],
    ], "No population, no specific factor or comparison and no measurable outcome: no single study could answer it.", "Нет ни группы, ни конкретного фактора или сравнения, ни измеримого результата: ни одно исследование на это не ответит."),
    qx("Which research question names a population, a factor or comparison, and an outcome?", "Do long-haul drivers using SafeDrive have lower fatigue scores than checklist users?", [
      ["Does SafeDrive work well for drivers who often feel tired at night on the road?", "“Work well” is not a measurable outcome, and there is no comparison.", "«Work well» — не измеримый результат, и сравнения нет."],
      ["How can technology such as smartphone apps make the roads in our country safer for everyone?", "No specific population, factor or measurable outcome.", "Нет конкретной группы, фактора и измеримого результата."],
      ["What is driver drowsiness, and why is it such a dangerous problem for long-haul truck drivers?", "Definitional and rhetorical: no data are needed to answer it.", "Вопрос об определении и риторический: данные для ответа не нужны."],
    ], "Population: long-haul drivers. Factor and comparison: SafeDrive vs checklist. Outcome: fatigue scores.", "Группа: дальнобойщики. Фактор и сравнение: SafeDrive против чек-листа. Результат: балл усталости."),
    qx("RQ: “How does the use of AI coding assistants affect programming task completion time among Software Engineering students?” What is the outcome?", "Programming task completion time", [
      ["Software Engineering students", "That is the population.", "Это группа (population)."],
      ["The use of AI coding assistants by students", "That is the factor being investigated.", "Это исследуемый фактор."],
      ["University programming courses", "That would be the context.", "Это контекст."],
    ], "The outcome is what is measured: programming task completion time. The practical task's own breakdown: population — SE students, factor — AI assistant use, outcome — completion time, context — university tasks.", "Результат — то, что измеряют: время выполнения задания. Разбор из практического задания: группа — студенты SE, фактор — использование ИИ-ассистентов, результат — время, контекст — университетские задания."),
    qx("Which elements are missing from the RQ “How does SafeDrive affect long-haul truck drivers?”", "A comparison group and a measurable outcome", [
      ["The population and the factor being studied", "Both are present: long-haul truck drivers and SafeDrive.", "Оба есть: дальнобойщики и SafeDrive."],
      ["A hypothesis and a list of expected results", "An RQ needs neither; expected results would be a claim.", "RQ не нужно ни то ни другое; ожидаемые результаты были бы утверждением."],
      ["The name of the app and the type of driver", "Both are already named.", "Оба уже названы."],
    ], "“Affect” in what way, compared with what? Add the comparison (paper checklist) and the outcome (validated fatigue-scale score).", "«Affect» — как именно и по сравнению с чем? Нужно добавить сравнение (бумажный чек-лист) и результат (балл по валидированной шкале усталости)."),
    qx("Why is “What is Artificial Intelligence?” rejected in the practical task?", "It can be answered with a definition, without research", [
      ["It is far too specific and narrow for a third-year research project", "It is not specific at all; the problem is that no data are needed.", "Он совсем не конкретный; проблема в том, что данные не нужны."],
      ["It mentions a technology instead of a population", "Mentioning a technology is fine; the question simply needs no data.", "Упоминать технологию можно; просто этот вопрос не требует данных."],
      ["It should start with “Why” instead of “What”", "The question word is not the issue.", "Дело не в вопросительном слове."],
    ], "The practical task warns: do not use questions that can be answered only with a definition. A research question needs evidence to answer.", "Практическое задание предупреждает: не использовать вопросы, на которые отвечают одним определением. Исследовательскому вопросу для ответа нужны данные."),
    qx("What is the main test of whether a research question is researchable?", "Can evidence be collected to answer the question?", [
      ["Is the topic currently popular among researchers?", "Popularity does not make a question answerable.", "Популярность не делает вопрос отвечаемым."],
      ["Does it use advanced technical terminology?", "Jargon does not make a question answerable.", "Сложные термины не делают вопрос отвечаемым."],
      ["Does the researcher already know the answer?", "If the answer is known in advance, there is nothing to research.", "Если ответ известен заранее, исследовать нечего."],
    ], "Researchable means the question can be answered with collected data, not with opinion or a definition.", "«Исследуемый» значит, что ответ можно получить из собранных данных, а не из мнения или определения."),
    qx("Why is “Is Rust better than Java?” not researchable as written?", "“Better” is undefined, so no evidence can settle it", [
      ["Rust and Java cannot be compared with each other", "They can be compared — on defined measures such as latency or memory.", "Сравнить их можно — по заданным показателям вроде задержки или памяти."],
      ["It is too narrow for a research project", "It is too vague, not too narrow.", "Он слишком расплывчатый, а не слишком узкий."],
      ["It does not mention a specific database, framework or cloud platform", "Adding a framework would not define “better”.", "Добавление фреймворка не определит, что значит «better»."],
    ], "Name a measurable outcome and conditions: “How do Rust and Java microservices compare in latency at 100,000 requests/sec?”", "Нужно назвать измеримый результат и условия: «How do Rust and Java microservices compare in latency at 100,000 requests/sec?»"),
    qx("The SafeDrive study runs six weeks with 60 drivers. Why is “accidents” a poor outcome for its research question?", "Accidents are too rare to compare groups in such a small study", [
      ["Accidents have nothing to do with driver drowsiness, according to the case", "The case does not say that; the problem is measurability, not relevance.", "Кейс этого не утверждает; проблема в измеримости, а не в связи с темой."],
      ["Accident data can only be collected by the police", "The real issue is that too few accidents occur in six weeks to compare.", "Настоящая проблема — за шесть недель аварий слишком мало для сравнения."],
      ["Accidents are qualitative data, not quantitative", "Accident counts are quantitative; they are simply too rare here.", "Число аварий — количественные данные; их просто слишком мало."],
    ], "Even Study A (150 drivers, 8 weeks) found only a small, non-significant difference in accident rate. Use an outcome the planned data record: the validated fatigue-scale score.", "Даже исследование A (150 водителей, 8 недель) нашло лишь малую незначимую разницу в аварийности. Нужен результат, который фиксируют запланированные данные: балл по валидированной шкале усталости."),
    qx("What does a feasibility check mainly ask about a research question?", "Whether the needed data can realistically be obtained", [
      ["Whether many papers on the topic already exist", "A crowded topic may still be feasible; the check is about your data and resources.", "Даже по изученной теме исследование может быть выполнимым; проверка — о ваших данных и ресурсах."],
      ["Whether the topic is popular among the other students in the course", "Popularity is irrelevant to feasibility.", "Популярность не имеет отношения к выполнимости."],
      ["Whether the results are likely to look positive", "Expecting positive results is bias, not feasibility.", "Ожидание «хороших» результатов — предвзятость, а не выполнимость."],
    ], "Feasible means you can actually get the data — with access rights, infrastructure (devices, compute) and time within the trimester.", "Выполнимо — значит, данные действительно можно получить: есть право доступа, инфраструктура (устройства, вычисления) и время в пределах триместра."),
    tfx("A strong research question should follow logically from the identified problem and gap.", true,
      "Connected is one of the criteria: problem → evidence → gap → research question must form one chain.",
      "Связанность — один из критериев: проблема → доказательства → пробел → исследовательский вопрос образуют одну цепочку.",
      "“False” would allow a question that ignores the limitation the literature revealed.",
      "Ответ «неверно» допустил бы вопрос, который игнорирует ограничение, найденное в литературе."),
    qx("After reading five papers, your research question is word-for-word the same as in Week 1. What does the lecture conclude?", "You probably have not engaged deeply enough with the literature", [
      ["Your Week 1 question was already perfect, so it needs no change at all", "The lecture says the literature should change your question.", "Лекция говорит, что литература должна менять вопрос."],
      ["The literature is irrelevant to your research problem", "If it were, you would need new papers — not an unchanged question.", "Если бы так было, нужны были бы новые статьи, а не прежний вопрос."],
      ["You should stop reading and start collecting data", "Research is iterative: Idea → Reading → Question → More reading.", "Исследование итеративно: идея → чтение → вопрос → ещё чтение."],
    ], "“The literature should change your question. If your research question is identical to Week 1, you have probably not engaged deeply enough.”", "«Литература должна менять вопрос. Если RQ такой же, как на неделе 1, погружение, вероятно, было недостаточно глубоким»."),
    qx("Which sequence is O'Leary's cycle for developing a research question?", "Idea → Reading → Question → More reading → Refined question", [
      ["Question → Data collection → Reading → Idea → Final question", "Data collection does not come before the question is refined by reading.", "Сбор данных не идёт раньше, чем вопрос уточнён чтением."],
      ["Idea → Question → Results → Reading → Publication", "Results cannot come before the reading that shapes the question.", "Результаты не могут появиться раньше чтения, которое формирует вопрос."],
      ["Reading → Idea → Results → Question → Conclusion", "The question must exist before any results.", "Вопрос должен появиться раньше любых результатов."],
    ], "Research questions evolve through reading: Idea → Reading → Question → More reading → Refined question.", "Вопрос развивается через чтение: идея → чтение → вопрос → ещё чтение → уточнённый вопрос."),
    qx("The gap is “limited evaluation of Kazakh factual question answering”. Which research question follows from it?", "How accurately do selected multilingual LLMs answer Kazakh factual questions?", [
      ["How do large language models work, and why are they useful for society?", "Explanatory and general; it ignores the gap about Kazakh factual QA.", "Общий объяснительный вопрос; он игнорирует пробел о фактических вопросах на казахском."],
      ["Will large language models definitely become the best tool for Kazakh speakers?", "A prediction stated with certainty and no measurable outcome — closer to a claim.", "Уверенный прогноз без измеримого результата — это ближе к утверждению."],
      ["How well do LLMs translate English news articles into Spanish and French?", "A different task and different languages; it does not address the gap.", "Другая задача и другие языки; пробел не затронут."],
    ], "The RQ targets exactly what the gap says is missing: accuracy (outcome) of selected LLMs (object) on Kazakh factual questions (context).", "RQ нацелен ровно на то, чего, по пробелу, не хватает: точность (результат) выбранных LLM (объект) на фактических вопросах на казахском (контекст)."),
    qx("What is wrong with the research question “Why is ChatGPT so inaccurate in Kazakh?”", "It assumes its own answer before any data exist", [
      ["It names one specific model instead of covering all existing LLMs", "Naming specific models is fine and makes the question feasible.", "Называть конкретные модели можно — это делает вопрос выполнимым."],
      ["It is too narrow to be a research question", "Narrowness is not the problem; the built-in assumption is.", "Проблема не в узости, а во встроенном предположении."],
      ["It should be written in Kazakh, not English", "The language of the question is irrelevant.", "Язык самого вопроса значения не имеет."],
    ], "“Why is it so inaccurate?” presumes inaccuracy is already proven. Ask first how accurate it is: “How often do selected LLMs give factually incorrect answers to Kazakh questions?”", "«Почему так неточен?» исходит из того, что неточность уже доказана. Сначала спрашивают, насколько он точен: «How often do selected LLMs give factually incorrect answers to Kazakh questions?»"),
    qx("In “Do SafeDrive users have lower fatigue-scale scores than paper-checklist users after six weeks?”, what is the independent variable?", "Which tool the driver uses: SafeDrive or the checklist", [
      ["The fatigue-scale score that each driver gets at the end of six weeks", "That is what is measured — the dependent variable.", "Это то, что измеряют, — зависимая переменная."],
      ["The six-week length of the study period", "That is the time frame, kept the same for both groups.", "Это срок, одинаковый для обеих групп."],
      ["The number of drivers recruited for the study", "That is the sample size, not a variable being compared.", "Это размер выборки, а не сравниваемая переменная."],
    ], "The independent variable is what differs between the groups (the tool); the dependent variable is what is measured (the fatigue score).", "Независимая переменная — то, чем различаются группы (инструмент); зависимая — то, что измеряют (балл усталости)."),
    qx("A team asks: “How do long-haul drivers experience in-cab camera monitoring?” What should they identify instead of independent and dependent variables?", "The main concepts, such as privacy and trust", [
      ["A control group and a treatment group", "This exploratory question compares no groups.", "Этот поисковый вопрос не сравнивает группы."],
      ["A statistical significance test to run", "Significance tests belong to quantitative comparisons.", "Тесты значимости нужны для количественных сравнений."],
      ["A required sample size of at least 1,000 truck drivers", "Exploratory interviews do not need a large statistical sample.", "Поисковым интервью не нужна большая статистическая выборка."],
    ], "Exploratory, qualitative questions study experiences and meanings, so they name the main concepts or phenomena — here privacy, trust, acceptance.", "Поисковые качественные вопросы изучают опыт и смыслы, поэтому называют основные понятия или явления — здесь приватность, доверие, принятие."),
    qx("In the 60-second peer review, what is the only question Student B may ask?", "What is your evidence?", [
      ["Why this topic?", "The slide says explicitly: not “I think your topic is interesting”.", "Слайд прямо говорит: не «мне кажется, тема интересная»."],
      ["Which method will you use?", "The method is not the focus of this exercise; evidence is.", "Метод — не фокус этого упражнения; фокус — доказательства."],
      ["Is your topic interesting?", "Interest is not evidence; the partner must force the presenter to cite papers.", "Интерес — не доказательство; партнёр должен заставить докладчика назвать статьи."],
    ], "“What is your evidence?” forces the presenter to cite actual papers for each link of the chain.", "«What is your evidence?» заставляет докладчика назвать реальные статьи для каждого звена цепочки."),
    qx("Which sentence is a research aim, not a research question, for the SafeDrive study?", "To evaluate whether SafeDrive lowers fatigue in long-haul drivers compared with a paper checklist", [
      ["Does SafeDrive lower the fatigue-scale scores of long-haul drivers compared with a paper checklist?", "This asks — it is the research question; an aim states what the study intends to achieve.", "Это вопрос — исследовательский вопрос; цель говорит, чего исследование хочет достичь."],
      ["SafeDrive will definitely lower fatigue and prevent accidents among all long-haul truck drivers", "A promise of results — an unsupported claim.", "Обещание результатов — необоснованное утверждение."],
      ["Recruit 60 drivers, give 30 the app and 30 the checklist, and collect scores", "This is a procedure step, not the one-sentence aim.", "Это шаг процедуры, а не цель в одном предложении."],
    ], "An aim is one clear sentence about what the study intends to achieve, usually starting “To evaluate / To compare / To examine…”.", "Цель — одно ясное предложение о том, чего исследование хочет достичь; обычно начинается с «To evaluate / To compare / To examine…»."),
    qx("RQ: “Do long-haul drivers using SafeDrive have lower fatigue-scale scores than checklist users after six weeks?” Which objective is aligned with it?", "Compare fatigue-scale scores of the two groups after six weeks", [
      ["Design a new logo and a friendlier user interface for the SafeDrive app", "A development task; it does not help answer the RQ.", "Задача разработки; ответить на RQ она не помогает."],
      ["Measure the national accident rate for all truck drivers", "Neither the RQ's outcome nor its population, and not feasible.", "Ни результат, ни группа этого RQ, и к тому же невыполнимо."],
      ["Interview drivers about their favourite music while driving", "Unrelated to the factor or the outcome of the RQ.", "Не связано ни с фактором, ни с результатом RQ."],
    ], "An objective is a concrete step towards answering the RQ: same population, same comparison, same outcome.", "Задача — конкретный шаг к ответу на RQ: та же группа, то же сравнение, тот же результат."),
  ],
);

export const lecture2: Lecture = {
  id: "rm-l2",
  title: {
    en: "Lecture 2 — Research detective: from problem to evidence to gap; developing research questions",
    ru: "Лекция 2 — Детектив исследования: от проблемы к доказательствам и пробелу; исследовательский вопрос",
  },
  parts: [p1, p2, p3, p4],
};
