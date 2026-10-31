import type { FastTrack } from "../types";

/*
 * Фаст-мод PM: подготовка к MCQ Test 2 (50 вопросов, 18 баллов, лекции 4–8)
 * за 2,5 часа. Блоки идут от самых предсказуемых баллов (таймбоксы Scrum,
 * формулы EVM) к остальному; последний — чек-лист на 15 минут до теста.
 * Формулировки и числа — как в l4–l8.ts; Scrum — по Scrum Guide 2020
 * (лекция 7), EAC = BAC / CPI, INVEST — «Sized Appropriately».
 *
 * Лекции 9–10 в тест не входят (описание теста: «materials of lectures
 * 4-8»): их блоки, MoSCoW со слайда 9, уровни конфликта, слушание и
 * принципы вовлечения стейкхолдеров отсюда убраны. MoSCoW в лекции 6 —
 * только «сверх слайда», при DSDM.
 */

type Section = FastTrack["sections"][number];

const s1: Section = {
  id: "pm-fast-1",
  title: { en: "The test format and MCQ tactics", ru: "Формат теста и тактика MCQ" },
  minutes: 10,
  notes: {
    en: `## What MCQ Test 2 is
- **50 multiple-choice questions, 18 points**, written at the practice session, in English. It covers **Lectures 4–8**: about **10 questions per lecture**, so no lecture can be skipped.
- One question is worth about **0.36 points**: three careless mistakes cost more than a whole point.
- Questions come from the slides: definitions, lists ("Which is NOT…"), formulas, timeboxes, "who is accountable for what", and short cases about IT teams.
## How to spend the time
| Pass | What to do | Share of time |
|---|---|---|
| 1 | answer every question you are sure of; mark the doubtful ones | about 60% |
| 2 | return to the marked ones and eliminate options | about 30% |
| 3 | re-check calculations and "NOT" questions; no blanks | the last 10% |
- Do not leave blanks unless the teacher announces a penalty for wrong answers: a guess between two remaining options is a 50% chance.
## MCQ techniques
- **Eliminate first.** Cross out options that belong to another lecture or another list: an XP value in a Scrum values question, a Kanban principle in a lean question, a Lecture 6 term in a Scrum Guide question.
- **Trap words.** "Always", "never", "only", "must", "all" usually make an agile option false. Real absolutes from the slides: **only the Product Owner** cancels a Sprint; the Daily Scrum is **15 minutes**; the Product Owner is **one person, not a committee**.
- **"Which is NOT…"** — circle the NOT, then mark every option true or false against the list; the single false one is the answer.
- **Neighbour swaps.** Wrong options are usually neighbouring concepts: CV vs SV, task force vs liaison department, Sprint Review vs Retrospective, MoSCoW vs Kano, responsibility vs accountability, intrarole vs interrole.
- **Slide wording beats general knowledge**: S in INVEST = Sized Appropriately; EAC = BAC / CPI; Scrum by the 2020 Guide (Developers, accountabilities, self-managing).
- **Calculations**: write the formula first, then the numbers; check the sign (negative CV = over budget) and that CPI and SPI are ratios, not dollars.
## How this fast mode is built
- Blocks 2–8 go from the most predictable points (Scrum timeboxes, EVM formulas) to the rest. Each ends with self-check questions: answer aloud before opening the answer.
- Block 9 is the checklist for the last 15 minutes before the test.
?? An option says "Agile teams never write documentation". What is suspicious, and is it true?
?= The absolute "never". It is false: the Manifesto values working software over comprehensive documentation — the items on the right still have value.
?? "Which is NOT a Scrum event?" Options: Sprint Planning, Backlog Refinement, Daily Scrum, Sprint Review.
?= Backlog Refinement — in the 2020 Guide refinement is an ongoing activity, not an event.`,
    ru: `## Что такое MCQ Test 2
- **50 вопросов с выбором ответа, 18 баллов**, пишется на практике, на английском. Охватывает **лекции 4–8**: примерно **по 10 вопросов на лекцию**, так что пропустить нельзя ни одну.
- Один вопрос стоит около **0.36 балла**: три ошибки по невнимательности — это больше целого балла.
- Вопросы берутся со слайдов: определения, списки («Which is NOT…»), формулы, таймбоксы, «кто за что отвечает» и короткие кейсы про IT-команды.
## Как распределить время
| Проход | Что делать | Доля времени |
|---|---|---|
| 1 | ответить на всё, в чём уверен; сомнительное пометить | около 60% |
| 2 | вернуться к помеченным и исключать варианты | около 30% |
| 3 | перепроверить расчёты и вопросы с «NOT»; пустых не оставлять | последние 10% |
- Не оставляй пустых, если преподаватель не объявил штраф за неверные ответы: угадать из двух оставшихся — шанс 50%.
## Приёмы MCQ
- **Сначала исключай.** Вычёркивай варианты из другой лекции или другого списка: ценность XP в вопросе о ценностях Scrum, принцип канбана в вопросе о lean, термин лекции 6 в вопросе по Scrum Guide.
- **Слова-ловушки.** «Always», «never», «only», «must», «all» обычно делают agile-вариант неверным. Настоящие абсолюты слайдов: **только Product Owner** отменяет спринт; Daily Scrum — **15 минут**; Product Owner — **один человек, а не комитет**.
- **«Which is NOT…»** — обведи NOT, затем отметь каждый вариант «верно/неверно» по списку; единственный неверный — ответ.
- **Подмены соседями.** Неверные варианты — обычно соседние понятия: CV и SV, task force и liaison department, Sprint Review и Retrospective, MoSCoW и Kano, responsibility и accountability, intrarole и interrole.
- **Формулировка слайда важнее общих знаний**: S в INVEST — Sized Appropriately; EAC = BAC / CPI; Scrum — по Guide 2020 (Developers, accountabilities, self-managing).
- **Расчёты**: сначала формула, потом числа; проверь знак (отрицательное CV — перерасход) и что CPI и SPI — отношения, а не доллары.
## Как устроен фаст-мод
- Блоки 2–8 идут от самых предсказуемых баллов (таймбоксы Scrum, формулы EVM) к остальному. В конце каждого — вопросы самопроверки: отвечай вслух, прежде чем открыть ответ.
- Блок 9 — чек-лист на последние 15 минут перед тестом.
?? Вариант гласит: «Agile teams never write documentation». Что подозрительно и верно ли это?
?= Абсолют «never». Утверждение неверно: манифест ценит работающий софт выше исчерпывающей документации — правая часть тоже ценна.
?? «Which is NOT a Scrum event?» Варианты: Sprint Planning, Backlog Refinement, Daily Scrum, Sprint Review.
?= Backlog Refinement — в Guide 2020 уточнение бэклога — постоянная деятельность, а не событие.`,
  },
};

const s2: Section = {
  id: "pm-fast-2",
  title: { en: "Lecture 7 — Scrum by the 2020 Guide", ru: "Лекция 7 — Scrum по Guide 2020" },
  minutes: 22,
  notes: {
    en: `## Why Scrum comes first
- Scrum is taught twice: Lecture 6 (overview by Griffiths) and Lecture 7 (Scrum Guide 2020). Where the two disagree, **answer by Lecture 7**.
- Timeboxes, "who is accountable" and the artifact–commitment pairs are the most predictable points of the whole test.
@diagram pm7-scrum-flow
## Lecture 6 word → Lecture 7 word
| Lecture 6 (older) | Lecture 7 (2020 Guide) — choose this |
|---|---|
| Development Team | Developers |
| roles | accountabilities |
| self-organizing | self-managing |
| ScrumMaster, servant leader | Scrum Master, true leaders who serve |
| sprint "one or two weeks" / "2–4 weeks" | fixed length, one month or less |
| backlog refinement meeting | refinement is an ongoing activity, not an event |
| three questions at the daily scrum | any structure the Developers choose |
| prioritized list, single source of requirements | emergent, ordered, single source of work |
## Definition, theory, values
- Scrum is a **lightweight framework** that helps people, teams and organizations **generate value through adaptive solutions for complex problems**.
- Theory: **empiricism** (knowledge comes from experience, decisions are based on what is observed) + **lean thinking** (reduces waste, focuses on the essentials).
- Pillars: **transparency** enables **inspection**, inspection enables **adaptation**. Values: **Commitment, Focus, Openness, Respect, Courage**. Openness is a value, transparency is a pillar.
## The Scrum Team
- **One Scrum Master, one Product Owner, Developers**; no sub-teams or hierarchies; **typically 10 or fewer**; cross-functional and **self-managing** (who does what, when, and how).
| Accountability | Accountable for |
|---|---|
| Developers | the Sprint Backlog; quality by adhering to the Definition of Done; adapting the plan each day toward the Sprint Goal; holding each other accountable |
| Product Owner | maximizing the value of the product; the Product Goal; creating, ordering and communicating backlog items; one person, not a committee |
| Scrum Master | establishing Scrum; the Scrum Team's effectiveness; causing the removal of impediments |
## Events and timeboxes (one-month Sprint)
| Event | Max | Key fact |
|---|---|---|
| Sprint | one month or less | the container; the next starts immediately; only the PO cancels, if the Sprint Goal becomes obsolete |
| Sprint Planning | 8 hours | why (Sprint Goal), what (Developers select with the PO), how (Developers only) |
| Daily Scrum | 15 minutes | for the Developers; every working day; same time and place |
| Sprint Review | 4 hours | inspect the outcome, adapt the Product Backlog; second to last; a working session |
| Sprint Retrospective | 3 hours | quality and effectiveness; concludes the Sprint |
- Five events = four formal events inside the Sprint + the Sprint itself. For shorter Sprints the events are usually shorter; the Daily Scrum stays 15 minutes.
## Artifacts and commitments
@diagram pm7-artifact-commitments
- Product Backlog → **Product Goal**; Sprint Backlog → **Sprint Goal**; Increment → **Definition of Done**.
- Not Done → not released, not presented, **back to the Product Backlog**. Several Increments per Sprint are possible; the Review is never a gate.
?? The CEO wants a feature moved to the top of the Product Backlog. What should he do?
?= Convince the Product Owner — only the PO orders the Product Backlog.
?? For a one-month Sprint: Sprint Planning at most …, Sprint Retrospective at most …?
?= 8 hours and 3 hours (the Review is 4 hours, the Daily Scrum 15 minutes).
?? Who may cancel a Sprint, and when?
?= Only the Product Owner, when the Sprint Goal becomes obsolete.`,
    ru: `## Почему Scrum первым
- Scrum проходят дважды: лекция 6 (обзор по Griffiths) и лекция 7 (Scrum Guide 2020). Где они расходятся, **отвечай по лекции 7**.
- Таймбоксы, «кто отвечает» и пары «артефакт — обязательство» — самые предсказуемые баллы всего теста.
@diagram pm7-scrum-flow
## Слово лекции 6 → слово лекции 7
| Лекция 6 (старое) | Лекция 7 (Guide 2020) — выбирай это |
|---|---|
| Development Team | Developers |
| roles (роли) | accountabilities (зоны ответственности) |
| self-organizing | self-managing |
| ScrumMaster, servant leader | Scrum Master, true leaders who serve |
| спринт «одна-две недели» / «2–4 недели» | фиксированная длина, месяц или меньше |
| встреча по уточнению бэклога | refinement — постоянная деятельность, а не событие |
| три вопроса на daily scrum | любая структура на выбор разработчиков |
| приоритизированный список, единственный источник требований | emergent, ordered, единственный источник работы (single source of work) |
## Определение, теория, ценности
- Scrum — **легковесный фреймворк (lightweight framework)**, который помогает людям, командам и организациям **создавать ценность через адаптивные решения сложных проблем**.
- Теория: **эмпиризм** (знание из опыта, решения по наблюдаемому) + **бережливое мышление (lean thinking)** (меньше потерь, фокус на главном).
- Столпы: **прозрачность (transparency)** делает возможной **инспекцию (inspection)**, инспекция — **адаптацию (adaptation)**. Ценности: **Commitment, Focus, Openness, Respect, Courage**. Openness — ценность, transparency — столп.
## Scrum-команда
- **Один Scrum Master, один Product Owner, разработчики (Developers)**; без подкоманд и иерархий; **обычно 10 или меньше**; кросс-функциональная и **самоуправляемая (self-managing)** — кто, что, когда и как.
| Зона ответственности | Отвечает за |
|---|---|
| Developers | Sprint Backlog; качество через соблюдение Definition of Done; ежедневную адаптацию плана к цели спринта; взаимную профессиональную ответственность |
| Product Owner | максимизацию ценности продукта; цель продукта; создание, упорядочивание и объяснение элементов бэклога; один человек, а не комитет |
| Scrum Master | внедрение Scrum; эффективность Scrum-команды; устранение препятствий (добивается, чтобы их убрали) |
## События и таймбоксы (месячный спринт)
| Событие | Максимум | Главное |
|---|---|---|
| Sprint | месяц или меньше | контейнер; следующий начинается сразу; отменяет только PO, если цель спринта устарела |
| Sprint Planning | 8 часов | зачем (цель спринта), что (разработчики выбирают вместе с PO), как (только разработчики) |
| Daily Scrum | 15 минут | для разработчиков; каждый рабочий день; то же время и место |
| Sprint Review | 4 часа | проверить результат, скорректировать Product Backlog; предпоследнее; рабочая сессия |
| Sprint Retrospective | 3 часа | качество и эффективность; завершает спринт |
- Пять событий = четыре формальных события внутри спринта + сам спринт. В коротких спринтах события обычно короче; Daily Scrum остаётся 15 минут.
## Артефакты и обязательства
@diagram pm7-artifact-commitments
- Product Backlog → **Product Goal**; Sprint Backlog → **Sprint Goal**; Increment → **Definition of Done**.
- Не Done → не выпускается, не показывается, **возвращается в Product Backlog**. За спринт возможно несколько инкрементов; Review — никогда не «шлагбаум» для релиза.
?? Генеральный директор хочет поднять функцию на верх Product Backlog. Что ему делать?
?= Убедить Product Owner — только PO упорядочивает Product Backlog.
?? Для месячного спринта: Sprint Planning не более …, Sprint Retrospective не более …?
?= 8 часов и 3 часа (Review — 4 часа, Daily Scrum — 15 минут).
?? Кто может отменить спринт и когда?
?= Только Product Owner, когда цель спринта устарела.`,
  },
};

const s3: Section = {
  id: "pm-fast-3",
  title: { en: "Lecture 4 — Earned value formulas", ru: "Лекция 4 — формулы освоенного объёма" },
  minutes: 20,
  notes: {
    en: `## The five quantities (Table 1)
| Symbol | Name | Question |
|---|---|---|
| BCWS (PV) | budgeted cost for work scheduled | How much work should be done? |
| BCWP (EV) | budgeted cost for work performed — earned value | How much work is done? |
| ACWP (AC) | actual cost for work performed | How much did the "is done" work cost? |
| BAC | budget at completion | What was the total job supposed to cost? |
| EAC (LRE) | estimate at completion, latest revised estimate | What do we now expect the total job to cost? |
@diagram pm4-evm-curves
## The formulas — by heart
= CV = BCWP - ACWP
= SV = BCWP - BCWS
= CVP = CV / BCWP
= SVP = SV / BCWS
= CPI = BCWP / ACWP
= SPI = BCWP / BCWS
= BCWP = (% complete) x BAC
= EAC = (ACWP / BCWP) x BAC = BAC / CPI
= VAC = BAC - EAC
= New project length = original length / SPI
- Both variances **start with BCWP**. Negative CV = **cost overrun**; negative SV = **behind schedule**; negative VAC = expected to finish over budget.
- CV and SV are in **dollars or hours** (SV is not in days); CPI and SPI are **ratios** against 1.0: < 1 unfavorable, = 1 perfect, > 1 favorable.
- Unfavorable CV / CPI → improve **productivity (burn rate)**; unfavorable SV / SPI → improve the **timeliness** of physical progress.
> Exam trap: the slide calls EAC "the estimated cost-to-complete ratio", but EAC is the estimate **at** completion — the total expected cost, BAC / CPI.
## One worked example
BAC = 200,000 USD, planned length 10 months. By now 40% should be done, 30% is done, and 75,000 USD has been spent.
= BCWS = 0.40 x 200,000 = 80,000
= BCWP = 0.30 x 200,000 = 60,000
= CV = 60,000 - 75,000 = -15,000
= SV = 60,000 - 80,000 = -20,000
= CPI = 60,000 / 75,000 = 0.80
= SPI = 60,000 / 80,000 = 0.75
= EAC = 200,000 / 0.80 = 250,000
= VAC = 200,000 - 250,000 = -50,000
= New length = 10 / 0.75 = 13.3 months
- Verdict: **over budget and behind schedule** — each dollar buys 80 cents of work, at 75% of the planned speed.
## The rest of the cost part
- Cost control is a **subsystem of the MCCS**. The operating cycle = phases **II–V** (work authorization and release, cost data collection and reporting, cost analysis, reporting); with the planning cycle (phase I) it forms a closed system network.
@diagram pm4-operating-cycle
- 7 elements of good cost management: cost estimating, cost accounting, project cash flow, company cash flow, direct labor costing, overhead rate costing, other tactics (incentives, penalties, profit-sharing).
- Budget log: distributed budget, management reserve, undistributed budget, contract changes. The ability to influence cost is highest for the customer/owner at initiation and lowest for users at closure.
- EVMS: prevention over cures, an early warning system; small variances are easier to correct, large ones may get the project cancelled.
?? BCWS = 1000, BCWP = 800, ACWP = 700. What is the status?
?= CV = +100 (under budget), SV = -200 (behind schedule); CPI = 1.14, SPI = 0.80.
?? BAC = 80,000 and CPI = 0.8. What are EAC and VAC?
?= EAC = 80,000 / 0.8 = 100,000; VAC = 80,000 - 100,000 = -20,000 — expected to finish 20,000 over budget.`,
    ru: `## Пять величин (таблица 1)
| Обозначение | Название | Вопрос |
|---|---|---|
| BCWS (PV) | плановая стоимость запланированных работ | сколько работы должно быть сделано? |
| BCWP (EV) | плановая стоимость выполненных работ — освоенный объём (earned value) | сколько работы сделано? |
| ACWP (AC) | фактическая стоимость выполненных работ | сколько стоила сделанная работа? |
| BAC | бюджет по завершении (budget at completion) | сколько должна была стоить вся работа? |
| EAC (LRE) | оценка по завершении, последняя пересмотренная оценка | сколько, по нынешним ожиданиям, будет стоить вся работа? |
@diagram pm4-evm-curves
## Формулы — наизусть
= CV = BCWP - ACWP
= SV = BCWP - BCWS
= CVP = CV / BCWP
= SVP = SV / BCWS
= CPI = BCWP / ACWP
= SPI = BCWP / BCWS
= BCWP = (% complete) x BAC
= EAC = (ACWP / BCWP) x BAC = BAC / CPI
= VAC = BAC - EAC
= New project length = original length / SPI
- Оба отклонения **начинаются с BCWP**. Отрицательное CV — **перерасход (cost overrun)**; отрицательное SV — **отставание (behind schedule)**; отрицательное VAC — проект закончится с перерасходом.
- CV и SV — в **долларах или часах** (SV не в днях); CPI и SPI — **отношения** к 1.0: < 1 неблагоприятно, = 1 идеально, > 1 благоприятно.
- Плохие CV / CPI → повышать **производительность (burn rate)**; плохие SV / SPI → повышать **своевременность** физического прогресса.
> Ловушка экзамена: на слайде EAC названа «the estimated cost-to-complete ratio», но EAC — оценка **по** завершении, полная ожидаемая стоимость, BAC / CPI.
## Один разобранный пример
BAC = 200 000 USD, плановая длительность 10 месяцев. К этому моменту должно быть сделано 40%, сделано 30%, потрачено 75 000 USD.
= BCWS = 0.40 x 200,000 = 80,000
= BCWP = 0.30 x 200,000 = 60,000
= CV = 60,000 - 75,000 = -15,000
= SV = 60,000 - 80,000 = -20,000
= CPI = 60,000 / 75,000 = 0.80
= SPI = 60,000 / 80,000 = 0.75
= EAC = 200,000 / 0.80 = 250,000
= VAC = 200,000 - 250,000 = -50,000
= New length = 10 / 0.75 = 13.3 months
- Вывод: **перерасход и отставание** — каждый доллар покупает 80 центов работы, а скорость — 75% от плановой.
## Остальное из части о затратах
- Контроль затрат — **подсистема MCCS**. Операционный цикл — фазы **II–V** (разрешение и запуск работ, сбор данных о затратах и отчётность, анализ затрат, отчётность); вместе с циклом планирования (фаза I) — замкнутая сеть (closed system network).
@diagram pm4-operating-cycle
- 7 элементов хорошего управления затратами: оценка затрат, учёт затрат, денежный поток проекта, денежный поток компании, учёт прямого труда, учёт накладных расходов, другие приёмы (поощрения, штрафы, разделение прибыли).
- Журнал бюджета (budget log): distributed budget, management reserve, undistributed budget, contract changes. Больше всего влиять на стоимость может заказчик/владелец на инициации, меньше всего — пользователи на закрытии.
- EVMS: профилактика лучше лечения, система раннего предупреждения; малые отклонения исправить проще, большие могут привести к закрытию проекта.
?? BCWS = 1000, BCWP = 800, ACWP = 700. Каков статус?
?= CV = +100 (в рамках бюджета), SV = -200 (отставание); CPI = 1.14, SPI = 0.80.
?? BAC = 80 000 и CPI = 0.8. Чему равны EAC и VAC?
?= EAC = 80 000 / 0.8 = 100 000; VAC = 80 000 - 100 000 = -20 000 — ожидается перерасход 20 000.`,
  },
};

const s4: Section = {
  id: "pm-fast-4",
  title: { en: "Lecture 6 — The Manifesto and the agile mindset", ru: "Лекция 6 — манифест и agile-мышление" },
  minutes: 15,
  notes: {
    en: `## The 4 values word for word
@diagram pm6-manifesto-values
- **Individuals and interactions** over processes and tools
- **Working software** over comprehensive documentation
- **Customer collaboration** over contract negotiation
- **Responding to change** over following a plan
- "While there is value in the items on the right, we value the items on the left more." The word is **over**, not **instead of**.
> Exam trap: the slide picture says "Working Product"; the official text says "Working software". It is the same value — choose "software" if both appear.
## The 12 principles by number
| # | Keywords | Violated when… |
|---|---|---|
| 1 | satisfy the customer through early and continuous delivery of valuable software | nothing is shown to the customer for months |
| 2 | welcome changing requirements, even late in development | requirements are frozen after sign-off |
| 3 | deliver working software frequently, weeks to months, preference to the shorter | one big release at the end |
| 4 | business people and developers work together daily | the business is absent until acceptance |
| 5 | build projects around motivated individuals; environment, support, trust | micromanagement |
| 6 | face-to-face conversation — the most efficient and effective method | every question goes through tickets |
| 7 | working software is the primary measure of progress | progress is reported in hours spent |
| 8 | sustainable development; a constant pace indefinitely | overtime every sprint |
| 9 | continuous attention to technical excellence and good design | "we will clean up the code later" |
| 10 | simplicity — the art of maximizing the amount of work not done | gold-plating |
| 11 | the best architectures, requirements and designs emerge from self-organizing teams | an architect designs alone |
| 12 | at regular intervals the team reflects and adjusts | no retrospectives |
## Mindset (Part 1 of Lecture 6)
- Agile is ideal for **knowledge worker projects** in a fast-moving, complex environment. Knowledge worker = subject matter expertise + communicates knowledge + analysis and/or development.
- **Defined** process: the steps are known in advance (construction). **Empirical** process: iterative and incremental, for new or uncertain work.
- Mindset → values → principles → practices. **Being agile** (mindset first) is correct; **doing agile** (practices without the mindset) is ineffective. Organizational change: Think → Do → Encourage others.
- Declaration of Interdependence — six characteristics: ROI, reliable results, expect uncertainty, creativity and innovation, boost performance, effectiveness and reliability.
@diagram pm6-inverted-triangle
- The traditional triangle fixes **scope**; the agile (inverted) triangle fixes **cost and time** and lets **scope vary** by priority.
?? A team works every weekend to hit the release date. Which principle is violated?
?= Principle 8 — sustainable development, a constant pace indefinitely.
?? What is the primary measure of progress?
?= Working software (principle 7) — not hours spent, tasks complete or velocity.`,
    ru: `## Четыре ценности дословно
@diagram pm6-manifesto-values
- **Люди и взаимодействие (individuals and interactions)** важнее процессов и инструментов
- **Работающий софт (working software)** важнее исчерпывающей документации
- **Сотрудничество с заказчиком (customer collaboration)** важнее согласования контракта
- **Реагирование на изменения (responding to change)** важнее следования плану
- «While there is value in the items on the right, we value the items on the left more.» Ключевое слово — **over** («важнее»), а не **instead of** («вместо»).
> Ловушка экзамена: на картинке слайда — «Working Product», в официальном тексте — «Working software». Ценность та же; если есть оба варианта, выбирай «software».
## 12 принципов по номерам
| # | Ключевые слова | Нарушен, когда… |
|---|---|---|
| 1 | удовлетворять заказчика ранней и непрерывной поставкой ценного софта | заказчику месяцами ничего не показывают |
| 2 | приветствовать изменения требований, даже на поздних стадиях | требования заморожены после подписания |
| 3 | поставлять работающий софт часто, от недель до месяцев, чем короче, тем лучше | один большой релиз в конце |
| 4 | бизнес и разработчики работают вместе ежедневно | бизнес не появляется до приёмки |
| 5 | строить проекты вокруг мотивированных людей; среда, поддержка, доверие | микроменеджмент |
| 6 | разговор лицом к лицу — самый эффективный способ | все вопросы — через тикеты |
| 7 | работающий софт — главная мера прогресса | прогресс измеряют потраченными часами |
| 8 | устойчивая разработка; постоянный темп бесконечно долго | переработки каждый спринт |
| 9 | постоянное внимание к техническому совершенству и хорошему дизайну | «код почистим потом» |
| 10 | простота — искусство максимизировать объём несделанной работы | gold-plating |
| 11 | лучшие архитектуры, требования и дизайн рождаются в самоорганизующихся командах | архитектор проектирует в одиночку |
| 12 | команда регулярно анализирует свою работу и корректирует её | нет ретроспектив |
## Мышление (часть 1 лекции 6)
- Agile идеален для **проектов работников знаний (knowledge worker projects)** в быстро меняющейся сложной среде. Работник знаний = экспертиза в предметной области + передаёт знания + анализ и/или разработка.
- **Определённый (defined)** процесс: шаги известны заранее (строительство). **Эмпирический (empirical)**: итеративный и инкрементный, для новой или неопределённой работы.
- Мышление → ценности → принципы → практики. **Быть agile (being agile)** — сначала мышление — правильно; **делать agile (doing agile)** — практики без мышления — неэффективно. Изменение организации: Think → Do → Encourage others.
- Декларация взаимозависимости (Declaration of Interdependence) — шесть черт: ROI, надёжные результаты, ожидание неопределённости, творчество и инновации, рост производительности, эффективность и надёжность.
@diagram pm6-inverted-triangle
- Традиционный треугольник фиксирует **объём (scope)**; agile (перевёрнутый) фиксирует **стоимость и сроки**, а **объём меняется** по приоритету.
?? Команда каждые выходные работает, чтобы успеть к релизу. Какой принцип нарушен?
?= Принцип 8 — устойчивая разработка, постоянный темп бесконечно долго.
?? Что является главной мерой прогресса?
?= Работающий софт (принцип 7) — не потраченные часы, не процент задач и не velocity.`,
  },
};

const s5: Section = {
  id: "pm-fast-5",
  title: { en: "Lecture 6 — XP, lean, Kanban, FDD, DSDM, Crystal and leadership", ru: "Лекция 6 — XP, lean, канбан, FDD, DSDM, Crystal и лидерство" },
  minutes: 18,
  notes: {
    en: `## The family
- Over 12 agile methodologies; common ones: Scrum, XP, Lean, Kanban, FDD, DSDM, Crystal. **Most widely used: Scrum and XP.**
- Lean is **closely aligned with agile, but not an agile methodology**; Kanban is derived from lean.
## XP
- Values: **simplicity, communication, feedback, courage, respect** (only courage and respect are also Scrum values).
- Roles: **coach, customer, programmers, testers**. Testers help the customer define and write acceptance tests.
- Practices: whole team, planning games (release and iteration planning), small releases, customer tests, collective code ownership, code standards, sustainable pace, metaphor, continuous integration, test-driven development, refactoring, simple design, pair programming.
- **Collective code ownership** (XP: any pair can change any code) is the opposite of **individual class ownership** (FDD).
- **Refactoring** improves the internal design only — no new functionality, no change in external behavior.
## Lean and Kanban
| Lean concepts (7) | Wastes of lean (7) |
|---|---|
| eliminate waste | partially done work |
| empower the team | extra processes |
| deliver fast | extra features (gold-plating) |
| optimize the whole | task switching |
| build quality in | waiting |
| defer decisions | motion (handoffs, distributed teams) |
| amplify learning | defects |
> Exam trap: the slide table "The 7 Wastes of Lean" shows only six rows — **waiting** is missing, but it is the seventh waste in Griffiths.
- Kanban (Toyota, "signboard") — 5 principles: **visualize the workflow, limit WIP, manage flow, make process policies explicit, improve collaboratively**. No sprints and no fixed roles; a column full of cards signals a bottleneck.
## FDD, DSDM, Crystal
- **FDD**: develop an overall model → build a feature list → plan by feature → design by feature → build by feature. Practices: domain object modeling, developing by feature, individual class ownership, feature teams, inspections, configuration management, regular builds, visibility.
- **DSDM** — 8 principles: focus on the business need, deliver on time, collaborate, never compromise quality, build incrementally from firm foundations, develop iteratively, communicate continuously and clearly, demonstrate control.
- **Crystal** — chosen by **criticality and team size**: Clear 1–6, Yellow 7–20, Orange 21–40, Red 41–100, Magenta 101–200.
## Agile leadership
@diagram pm6-servant-leader
- Servant leader — 4 duties: **shield the team from interruptions, remove impediments, communicate (and re-communicate) the vision, carry food and water**.
- Management = tasks, control, speed; leadership = people and purpose, empowerment and effectiveness.
- Leadership practices: model desired behavior, communicate the vision, enable others to act, challenge the status quo.
?? Which method gives each class to one developer, and which lets any pair change any code?
?= FDD — individual class ownership; XP — collective code ownership.
?? Crystal is selected by which two factors?
?= Criticality and team size.
?? Which is NOT an agile methodology according to the slides: Kanban, Lean, DSDM or Crystal?
?= Lean — closely aligned with agile, but not an agile methodology.`,
    ru: `## Семейство
- Больше 12 agile-методологий; распространённые: Scrum, XP, Lean, Kanban, FDD, DSDM, Crystal. **Самые используемые — Scrum и XP.**
- Lean **близок к agile, но не agile-методология**; канбан вырос из lean.
## XP
- Ценности: **простота, общение, обратная связь, смелость, уважение** (simplicity, communication, feedback, courage, respect; только courage и respect есть и в Scrum).
- Роли: **coach, customer, programmers, testers**. Тестировщики помогают заказчику сформулировать и написать приёмочные тесты.
- Практики: whole team, planning games (планирование релиза и итерации), small releases, customer tests, collective code ownership, code standards, sustainable pace, metaphor, continuous integration, test-driven development, refactoring, simple design, pair programming.
- **Коллективное владение кодом (collective code ownership)** (XP: любая пара меняет любой код) — противоположность **индивидуальному владению классами (individual class ownership)** (FDD).
- **Рефакторинг (refactoring)** улучшает только внутренний дизайн — без новой функциональности и без изменения внешнего поведения.
## Lean и канбан
| Концепции lean (7) | Потери lean (7) |
|---|---|
| устранять потери | незавершённая работа (partially done work) |
| наделять команду полномочиями | лишние процессы (extra processes) |
| поставлять быстро | лишние функции (extra features, gold-plating) |
| оптимизировать целое | переключение задач (task switching) |
| встраивать качество | ожидание (waiting) |
| откладывать решения | перемещения (motion: передачи, распределённые команды) |
| усиливать обучение | дефекты (defects) |
> Ловушка экзамена: в таблице слайда «The 7 Wastes of Lean» только шесть строк — нет **ожидания (waiting)**, но у Griffiths это седьмая потеря.
- Канбан (Toyota, «вывеска», signboard) — 5 принципов: **визуализировать поток, ограничивать WIP, управлять потоком, делать правила процесса явными, улучшать совместно**. Без спринтов и фиксированных ролей; колонка, забитая карточками, — признак узкого места.
## FDD, DSDM, Crystal
- **FDD**: общая модель → список функций → план по функциям → проектирование по функциям → разработка по функциям. Практики: моделирование объектов предметной области, разработка по функциям, индивидуальное владение классами, команды функций, инспекции, управление конфигурацией, регулярные сборки, прозрачность.
- **DSDM** — 8 принципов: фокус на потребности бизнеса, поставка вовремя, сотрудничество, никаких компромиссов по качеству, инкрементная разработка на прочном фундаменте, итеративность, постоянное и ясное общение, демонстрация контроля.
- **Crystal** — выбирают по **критичности и размеру команды**: Clear 1–6, Yellow 7–20, Orange 21–40, Red 41–100, Magenta 101–200.
## Agile-лидерство
@diagram pm6-servant-leader
- Servant leader — 4 обязанности: **защищать команду от помех, устранять препятствия, доносить (и повторять) видение, «носить еду и воду»** (обеспечивать ресурсами).
- Менеджмент — задачи, контроль, скорость; лидерство — люди и цель, наделение полномочиями и результативность.
- Практики лидерства: показывать желаемое поведение, доносить видение, давать другим действовать, бросать вызов статус-кво.
?? Какой метод закрепляет каждый класс за одним разработчиком, а какой позволяет любой паре менять любой код?
?= FDD — индивидуальное владение классами; XP — коллективное владение кодом.
?? По каким двум факторам выбирают вариант Crystal?
?= По критичности и размеру команды.
?? Что по слайдам НЕ является agile-методологией: Kanban, Lean, DSDM или Crystal?
?= Lean — близок к agile, но не agile-методология.`,
  },
};

const s6: Section = {
  id: "pm-fast-6",
  title: { en: "Lecture 5 — Organizational structures", ru: "Лекция 5 — организационные структуры" },
  minutes: 18,
  notes: {
    en: `## Vocabulary, word for word
- **Authority** — the power granted to individuals (possibly by their position) so that they can make **final decisions**.
- **Responsibility** — the **obligation** incurred by individuals in their roles in the formal organization to effectively perform assignments.
- **Accountability** — being **answerable** for the satisfactory completion of a specific assignment.
= Accountability = authority + responsibility
- Trust between project and functional managers grows in 5 steps: deny → blame → admit responsibility → meet face-to-face → anticipate problems.
## Why the classical structure fails projects
- Wallace — 4 factors of the organizational revolution: the technology revolution; competition and the profit squeeze; the high cost of marketing; the unpredictability of consumer demands.
- Grinnell and Apple — 5 signs the traditional structure is not adequate; the surprising one: projects **on time and to specifications**, but people are not satisfied.
- Sadler: there is **no ideal structure**. The critical point of any program is **the interface between functional units**.
## Evolution of work integration
@diagram pm5-integration-evolution
| Step | Key fact |
|---|---|
| Integrating mechanisms (Galbraith) | rules and procedures, planning processes, hierarchical referral, direct contact; the structure is unchanged |
| Departmental project leader | temporary; "leader", not "manager", because "manager" implies a permanent relationship |
| Task force | a representative from each unit; it worked, but without formal authority members stayed loyal to their functions — the project always suffered |
| Liaison department (the expeditor) | authority through the division head, only up to the division boundary |
| Line/staff (project coordinator) | the PM is not controlled by functional managers but still has no line authority |
## The three structures
@diagram pm5-structures
| | Classical (functional) | Projectized (pure product) | Matrix |
|---|---|---|---|
| PM authority | none — no one is responsible for the total project | complete line authority | directly from the general manager |
| Best at | one boss, cost control, technical control, career continuity | customer focal point, very rapid reaction | technical excellence within time and cost |
| Main weakness | no customer focal point, slow response | cost; no perpetuation of technology; no career continuity | the most complex form |
- Lists to know: classical — 11 advantages and 9 disadvantages; projectized — 10 advantages (Table 1) and 6 disadvantages (Table 2).
- Matrix: ideal for project-driven companies such as construction; needs training, compatible reward systems and role definitions.
## Strong, weak, balanced
@diagram pm5-matrix-strength
- Decided by **who has more influence over the daily performance of the workers**, as seen through the eyes of the PM: PM → **strong**; line manager → **weak**; roughly equal → **balanced**. Not by the budget, the number of projects or a project office.
?? Why did the task force fail?
?= Without formal project authority, members stayed loyal to their functional organizations, so the project always suffered.
?? Department heads decide what developers do each day; the PM can only ask. Which matrix is it?
?= A weak matrix.
?? "The obligation to perform assignments" defines…?
?= Responsibility (authority = final decisions; accountability = answerable for completion).`,
    ru: `## Термины дословно
- **Полномочия (authority)** — власть, данная человеку (возможно, его должностью), чтобы он мог принимать **окончательные решения (final decisions)**.
- **Ответственность (responsibility)** — **обязанность (obligation)**, которую человек несёт в своей роли в формальной организации, — эффективно выполнять поручения.
- **Подотчётность (accountability)** — обязанность **отвечать (answerable)** за удовлетворительное выполнение конкретного поручения.
= Accountability = authority + responsibility
- Доверие между проектными и функциональными менеджерами растёт в 5 шагов: отрицание → обвинение → признание ответственности → встреча лицом к лицу → предвидение проблем.
## Почему классическая структура подводит проекты
- Wallace — 4 фактора организационной революции: технологическая революция; конкуренция и сжатие прибыли; высокая стоимость маркетинга; непредсказуемость спроса.
- Grinnell и Apple — 5 признаков, что традиционная структура не справляется; неожиданный: проекты **в срок и по спецификации**, но люди недовольны.
- Sadler: **идеальной структуры нет**. Критическая точка любой программы — **стык между функциональными подразделениями (the interface between functional units)**.
## Эволюция интеграции работ
@diagram pm5-integration-evolution
| Шаг | Главное |
|---|---|
| Интегрирующие механизмы (Galbraith) | правила и процедуры, процессы планирования, передача по иерархии, прямой контакт; структура не меняется |
| Project leader в отделе | временно; «leader», а не «manager», потому что «manager» подразумевает постоянство |
| Task force | по представителю от каждого подразделения; работало, но без формальных полномочий люди оставались верны своим отделам — страдал всегда проект |
| Liaison department (the expeditor) | полномочия через руководителя дивизиона, только до его границы |
| Line/staff (project coordinator) | PM не подчинён функциональным менеджерам, но линейных полномочий у него всё ещё нет |
## Три структуры
@diagram pm5-structures
| | Классическая (функциональная) | Проектная (pure product) | Матричная |
|---|---|---|---|
| Полномочия PM | нет — за проект целиком не отвечает никто | полная линейная власть (complete line authority) | напрямую от генерального директора |
| Сильна в | один начальник, контроль затрат, технический контроль, карьерная преемственность | точка контакта с заказчиком, очень быстрая реакция | технический уровень в рамках сроков и бюджета |
| Главная слабость | нет точки контакта с заказчиком, медленная реакция | стоимость; технологии не развиваются; нет карьерной преемственности | самая сложная форма |
- Списки, которые надо знать: классическая — 11 преимуществ и 9 недостатков; проектная — 10 преимуществ (таблица 1) и 6 недостатков (таблица 2).
- Матрица: идеальна для проектно-ориентированных компаний, например строительных; нужны обучение, согласованные системы вознаграждения и описания ролей.
## Сильная, слабая, сбалансированная
@diagram pm5-matrix-strength
- Решает то, **у кого больше влияния на ежедневную работу людей**, глазами PM: у PM → **сильная (strong)**; у линейного руководителя → **слабая (weak)**; примерно поровну → **сбалансированная (balanced)**. Не бюджет, не число проектов и не проектный офис.
?? Почему task force не сработала?
?= Без формальных полномочий члены оставались верны своим функциональным подразделениям, поэтому страдал всегда проект.
?? Руководители отделов решают, чем разработчики заняты каждый день; PM может только просить. Какая это матрица?
?= Слабая матрица.
?? «The obligation to perform assignments» — это определение…?
?= Responsibility (authority — окончательные решения; accountability — отвечать за выполнение).`,
  },
};

const s7: Section = {
  id: "pm-fast-7",
  title: { en: "Lecture 4 — Groups, teams and roles", ru: "Лекция 4 — группы, команды и роли" },
  minutes: 14,
  notes: {
    en: `## Groups
- A group = two or more employees who interact with each other so that the behavior and/or performance of a member is influenced by the others.
| Formal (created by managerial decision) | Informal (arise from individual efforts) |
|---|---|
| command group | interest group |
| task group | friendship group |
- Why groups form: needs (security, social, esteem, self-actualization — physiological needs are not on the list), proximity, attractions, goals, economics.
## Development
@diagram pm4-five-stages
| Stage | Exact key phrase |
|---|---|
| Forming | breaking the ice; loose, but specific, ground rules |
| Storming | conflict; the hierarchy starts to take shape |
| Norming | the beginning of cohesiveness; group-driven expectations |
| Performing | structure, hierarchy and norms in place; the group is mature |
| Adjourning | prepares to disband; sadness over the loss of contact |
- **PEM**: three phases — define tasks and goals → a point of **inertia or equilibrium**, when the group realizes **time is running out** → a final phase to accomplish tasks. Critics call the five-stage model **too static and unrealistic**.
- Groups develop at **different rates**, depending on the task, the setting, the members and the manager's style.
## Characteristics and groupthink
- Seven characteristics: structure, status hierarchy, roles, norms, leadership, cohesiveness, intergroup conflict.
- A cohesive group whose goals disagree with management's → **managerial intervention** is necessary.
- **Groupthink**: cohesive members' desire for agreement supersedes considering controversial solutions — a risk of **high** cohesiveness.
## Teams
- Teams are a special type of **task group**: problem-solving, cross-functional and self-directed work teams.
- Formed **predominantly to enhance productivity**; also because of flattening, the need for flexibility and quick decisions, diversity, quality, customer satisfaction.
- Requirements: top-level commitment and clear goals; management–employee trust; willingness to take risks and share information; time, resources and training.
## Roles
- **Role** = the expected behavior patterns of a position; **role set** = others' expectations for the role; three perceptions: the organization's, the group's, the individual's.
| Conflict | Case |
|---|---|
| Person–role | a QA engineer is told to label critical bugs "minor" — against her ethics |
| Intrarole | the manager wants the team lead to push overtime; the team wants her to protect them |
| Interrole | on-call duty and a master's exam on the same night — two roles of one person |
?? A developer is also a student; the release night clashes with his exam. Which conflict is it?
?= Interrole conflict.
?? In which stage does "the hierarchy start to take shape"?
?= Storming.`,
    ru: `## Группы
- Группа (group) — двое или больше работников, которые взаимодействуют так, что поведение и/или результаты каждого зависят от других.
| Формальные (созданы решением руководства) | Неформальные (возникают по инициативе людей) |
|---|---|
| command group (командная) | interest group (по интересам) |
| task group (целевая) | friendship group (дружеская) |
- Почему возникают группы: потребности (security, social, esteem, self-actualization — физиологических в списке нет), близость (proximity), симпатии (attractions), цели (goals), экономика (economics).
## Развитие
@diagram pm4-five-stages
| Стадия | Точная ключевая фраза |
|---|---|
| Forming | знакомство («breaking the ice»); нестрогие, но конкретные правила |
| Storming | конфликт; начинает складываться иерархия |
| Norming | начало сплочённости; ожидания, заданные группой |
| Performing | структура, иерархия и нормы на месте; группа зрелая |
| Adjourning | подготовка к роспуску; грусть из-за потери контакта |
- **PEM**: три фазы — задачи и цели → точка **инерции или равновесия (inertia or equilibrium)**, когда группа понимает, что **время уходит** → финальная фаза выполнения задач. Пятиэтапную модель критикуют как **слишком статичную и нереалистичную**.
- Группы развиваются с **разной скоростью** — в зависимости от задачи, обстановки, участников и стиля руководителя.
## Характеристики и групповое мышление
- Семь характеристик: структура, статусная иерархия, роли, нормы, лидерство, сплочённость (cohesiveness), межгрупповой конфликт.
- Сплочённая группа, чьи цели расходятся с целями руководства → необходимо **вмешательство руководства (managerial intervention)**.
- **Групповое мышление (groupthink)**: стремление сплочённой группы к согласию вытесняет рассмотрение спорных решений — риск **высокой** сплочённости.
## Команды
- Команды — особый вид **целевой группы (task group)**: problem-solving, cross-functional и self-directed work teams.
- Создаются **прежде всего ради производительности**; ещё из-за уплощения организаций, нужды в гибкости и быстрых решениях, разнообразия кадров, качества, удовлетворённости клиентов.
- Условия: поддержка высшего руководства и ясные цели; доверие между руководством и работниками; готовность рисковать и делиться информацией; время, ресурсы и обучение.
## Роли
- **Роль (role)** — ожидаемые модели поведения на должности; **ролевой набор (role set)** — ожидания других от роли; три восприятия: организации, группы, самого человека.
| Конфликт | Случай |
|---|---|
| Person–role | QA-инженеру велят пометить критические баги как «minor» — против её этики |
| Intrarole | руководитель хочет, чтобы тимлид выжимала переработки; команда — чтобы защищала |
| Interrole | дежурство и экзамен в магистратуре в одну ночь — две роли одного человека |
?? Разработчик ещё и студент; ночь релиза совпала с его экзаменом. Какой это конфликт?
?= Interrole conflict (межролевой).
?? На какой стадии «начинает складываться иерархия»?
?= Storming.`,
  },
};

const s8: Section = {
  id: "pm-fast-8",
  title: { en: "Lecture 8 — Personas and user stories", ru: "Лекция 8 — персоны и пользовательские истории" },
  minutes: 14,
  notes: {
    en: `## Table 1 — selecting the technique
- Table 1 is **a starting point**, not a rule; the choice relies on domain knowledge, experience, individual competencies and creativity.
- Personas and User Stories are listed only for **internal teams**. Visioning and MVP appear in both columns; Reviews, Impact Mapping and Kano Analysis are external only.
## Personas
- Purpose: **understand and empathize with an intended stakeholder** in order to **align the solution with the stakeholder need**.
- Description: **fictional characters or archetypes** that exemplify the way typical users interact with a solution; useful when the team has no direct access to a customer representative.
- Six elements: long and short template; persona name and image; traits and characteristics; motivations; needs; differentiators.
@diagram pm8-persona-templates
- Short template = a one-page quick view (name, details or context, traits, goals); long = more in-depth details (demographics, buying motive, traits, needs, motivation, differentiators). Needs are finite, wants are infinite.
- Limitations: a generic user (everything to everyone); not a good substitute for a real user; must be regularly reviewed and updated.
## User stories
- Purpose: **convey a customer requirement for the delivery team**. Description: **a small, concise statement of a feature needed to deliver value**.
- Written by customers, product owners or business analysis practitioners; captured on the backlog. Not all backlog items are written as user stories.
= As a <role>, I need to <feature> so that <goal or value>.
= In order to <business value>, as a <role>, I need to <behavior>.
@diagram pm8-invest
| Letter | Slide meaning | Broken by wording like… |
|---|---|---|
| I — Independent | can be delivered independent of other features | "only after story X" |
| N — Negotiable | the team can negotiate how to deliver | "using technology X" |
| V — Valuable | expresses the value to the customer | no "so that" |
| E — Estimable | effort can be estimated from past experience | "never done before" |
| S — Sized Appropriately | can be completed in one iteration | "the whole system" |
| T — Testable | can be validated objectively by a stakeholder | "fast, nice, convenient" |
- 3Cs: **Card** (an optional title — an active-verb goal phrase; WHO / WHAT / WHY format, no mandatory structure), **Conversation**, **Confirmation** (acceptance criteria).
- Acceptance criteria define the **boundaries**, identify the **minimum amount of function**, are used primarily by the product owner and stakeholders and are a basis for acceptance, regression and exploratory tests.
- The most quoted limitation of user stories: a focus on **WHAT** that overlooks **WHY**.
?? On the slides, S in INVEST stands for…?
?= Sized Appropriately — not "Small".
?? "As a nurse, I need to see the shift schedule." What is missing?
?= The WHY: "so that <goal or value>" — the value (V) is not shown.
?? Which persona element says what sets this persona apart from another persona?
?= Differentiators.`,
    ru: `## Таблица 1 — выбор техники
- Таблица 1 — **отправная точка (a starting point)**, а не правило; выбор опирается на знание предметной области, опыт, личные компетенции и творческий подход.
- Personas и User Stories стоят только в столбце **внутренних команд (internal teams)**. Visioning и MVP — в обоих столбцах; Reviews, Impact Mapping и Kano Analysis — только для внешних.
## Персоны
- Назначение: **понять предполагаемого стейкхолдера и сопереживать ему**, чтобы **привести решение в соответствие с его потребностью**.
- Описание: **вымышленные персонажи или архетипы (fictional characters or archetypes)**, на примере которых видно, как типичные пользователи взаимодействуют с решением; полезны, когда у команды нет прямого доступа к представителю заказчика.
- Шесть элементов: длинный и короткий шаблон; имя и изображение персоны; черты и характеристики; мотивация; потребности; отличия (differentiators).
@diagram pm8-persona-templates
- Короткий шаблон — обзор на одной странице (имя, детали или контекст, черты, цели); длинный — подробности (демография, мотив покупки, черты, потребности, мотивация, отличия). Потребности конечны, желания бесконечны.
- Ограничения: обобщённый пользователь («всё для всех»); не замена реальному пользователю; нужно регулярно пересматривать и обновлять.
## Пользовательские истории
- Назначение: **передать команде требование заказчика**. Описание: **короткое, сжатое описание функции, нужной для поставки ценности**.
- Пишут заказчики, владельцы продукта или бизнес-аналитики; хранятся в бэклоге. Не все элементы бэклога записываются как истории.
= As a <role>, I need to <feature> so that <goal or value>.
= In order to <business value>, as a <role>, I need to <behavior>.
@diagram pm8-invest
| Буква | Смысл по слайду | Нарушают формулировки вроде… |
|---|---|---|
| I — Independent | можно поставить независимо от других функций | «только после истории X» |
| N — Negotiable | команда может договориться, как поставить | «на технологии X» |
| V — Valuable | выражает ценность для заказчика | нет «so that» |
| E — Estimable | трудоёмкость можно оценить по прошлому опыту | «никогда раньше не делали» |
| S — Sized Appropriately | можно закончить за одну итерацию | «вся система целиком» |
| T — Testable | стейкхолдер может проверить объективно | «быстро, красиво, удобно» |
- 3C: **Card** (необязательный заголовок — фраза-цель с глаголом действия; формат WHO / WHAT / WHY, обязательной структуры нет), **Conversation**, **Confirmation** (критерии приёмки).
- Критерии приёмки задают **границы** истории, определяют **минимально нужную функциональность**, используются в первую очередь владельцем продукта и стейкхолдерами и служат основой для приёмочных, регрессионных и исследовательских тестов.
- Самое цитируемое ограничение историй: фокус на **WHAT** при упущенном **WHY**.
?? Что на слайдах означает S в INVEST?
?= Sized Appropriately — а не «Small».
?? «As a nurse, I need to see the shift schedule.» Чего не хватает?
?= WHY: «so that <goal or value>» — ценность (V) не показана.
?? Какой элемент персоны говорит, чем она отличается от другой персоны?
?= Differentiators (отличия).`,
  },
};

const s11: Section = {
  id: "pm-fast-11",
  title: { en: "Final checklist: the last 15 minutes", ru: "Финальный чек-лист: последние 15 минут" },
  minutes: 10,
  notes: {
    en: `## Numbers to write down first
| Number | Meaning |
|---|---|
| 8 h / 4 h / 3 h / 15 min | Sprint Planning / Review / Retrospective (one-month Sprint) / Daily Scrum |
| one month or less | Sprint length |
| 10 or fewer | Scrum Team size (typically) |
| 4 and 12 | Manifesto values and principles |
| 5 | Scrum values; Kanban principles; group stages |
| 3 | Scrum pillars, artifacts, commitments, accountabilities; PEM phases |
| 7 | lean concepts and wastes; group characteristics; cost-management elements |
| 6 | INVEST letters; persona elements |
## Formulas
= CV = BCWP - ACWP
= SV = BCWP - BCWS
= CPI = BCWP / ACWP
= SPI = BCWP / BCWS
= EAC = BAC / CPI
= VAC = BAC - EAC
## Swaps that cost points
| Pair | The difference |
|---|---|
| Sprint Review vs Retrospective | the outcome and the backlog vs quality and effectiveness of the work |
| CV vs SV | BCWP minus ACWP (cost) vs BCWP minus BCWS (schedule) |
| Responsibility vs accountability | obligation to perform vs answerable for completion (= authority + responsibility) |
| Task force vs liaison department | unit representatives without formal authority vs a department inside one division |
| Weak vs strong matrix | the line manager vs the PM has more influence over daily work |
| Intrarole vs interrole | contradictions inside one role vs two roles of one person |
| Collective vs individual code ownership | XP vs FDD |
| Product Goal vs Sprint Goal | the long-term objective in the Product Backlog vs the single objective of one Sprint |
## Slide wording to trust
- INVEST S = **Sized Appropriately**; a user story is "As a <role>, I need to <feature> so that <goal or value>".
- Scrum: **Developers**, **accountabilities**, **self-managing**; refinement is not an event; the Daily Scrum may have any structure.
- Lean is closely aligned with agile, not an agile methodology; the slide's wastes table has six rows (waiting is the seventh).
- The operating cycle has four phases (II–V); the slide's EAC "ratio" is BAC / CPI.
## In the room
- Read the whole stem, circle NOT, eliminate, then choose. Write the formula before the numbers.
- Five minutes before the end: no blank answers, NOT questions re-read.
?? For a one-month Sprint, what are the maximums for Planning, Review, Retrospective and the Daily Scrum?
?= 8 hours, 4 hours, 3 hours and 15 minutes.
?? Which values are shared by Scrum and XP?
?= Respect and courage.`,
    ru: `## Числа, которые записать первыми
| Число | Значение |
|---|---|
| 8 ч / 4 ч / 3 ч / 15 мин | Sprint Planning / Review / Retrospective (месячный спринт) / Daily Scrum |
| месяц или меньше | длина спринта |
| 10 или меньше | размер Scrum-команды (обычно) |
| 4 и 12 | ценности и принципы манифеста |
| 5 | ценности Scrum; принципы канбана; стадии группы |
| 3 | столпы, артефакты, обязательства, зоны ответственности Scrum; фазы PEM |
| 7 | концепции и потери lean; характеристики групп; элементы управления затратами |
| 6 | буквы INVEST; элементы персоны |
## Формулы
= CV = BCWP - ACWP
= SV = BCWP - BCWS
= CPI = BCWP / ACWP
= SPI = BCWP / BCWS
= EAC = BAC / CPI
= VAC = BAC - EAC
## Подмены, которые стоят баллов
| Пара | Разница |
|---|---|
| Sprint Review и Retrospective | результат и бэклог против качества и эффективности работы |
| CV и SV | BCWP минус ACWP (стоимость) против BCWP минус BCWS (сроки) |
| Responsibility и accountability | обязанность выполнять против обязанности отвечать за результат (= authority + responsibility) |
| Task force и liaison department | представители подразделений без формальных полномочий против отдела внутри одного дивизиона |
| Слабая и сильная матрица | больше влияния на ежедневную работу у линейного руководителя против у PM |
| Intrarole и interrole | противоречия внутри одной роли против двух ролей одного человека |
| Коллективное и индивидуальное владение кодом | XP против FDD |
| Product Goal и Sprint Goal | долгосрочная цель в Product Backlog против единственной цели одного спринта |
## Формулировки слайдов, которым верить
- S в INVEST — **Sized Appropriately**; история — «As a <role>, I need to <feature> so that <goal or value>».
- Scrum: **Developers**, **accountabilities**, **self-managing**; refinement — не событие; у Daily Scrum любая структура.
- Lean близок к agile, но не agile-методология; в таблице потерь на слайде шесть строк (ожидание — седьмая).
- В операционном цикле четыре фазы (II–V); «ratio» EAC со слайда — это BAC / CPI.
## В аудитории
- Читай вопрос целиком, обведи NOT, исключай, потом выбирай. Пиши формулу до чисел.
- За пять минут до конца: пустых ответов нет, вопросы с NOT перечитаны.
?? Каковы максимумы Planning, Review, Retrospective и Daily Scrum для месячного спринта?
?= 8 часов, 4 часа, 3 часа и 15 минут.
?? Какие ценности общие для Scrum и XP?
?= Respect и courage (уважение и смелость).`,
  },
};

export const pmFast: FastTrack = {
  hours: 2.5,
  intro: {
    en: "The last two and a half hours before MCQ Test 2: only what the questions check, from the most predictable points to the rest. Read the blocks in order and answer each self-check question aloud before opening the answer; then take the event's 50-question final quiz against the clock and reread the blocks where you lost points.",
    ru: "Последние два с половиной часа перед MCQ Test 2: только то, что проверяют вопросы, от самых предсказуемых баллов к остальному. Читай блоки по порядку и на каждый вопрос самопроверки отвечай вслух, прежде чем открыть ответ; потом пройди итоговый квиз ивента на 50 вопросов на время и перечитай блоки, где потерял баллы.",
  },
  sections: [s1, s2, s3, s4, s5, s6, s7, s8, s11],
};
