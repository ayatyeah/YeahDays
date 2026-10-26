import { part, qx, tfx, type Lecture } from "../types";

/*
 * Лекция 4 Project Management (UPr 2301): «Cost Control and Group Behavior», 33 слайда.
 * Источник — «PM TEST 8 WEEK EVENT/Lecture 4 Cost Control and Group Behavior.pdf»
 * (контроль затрат и освоенный объём — по Kerzner, 12th ed.; группы, команды и роли —
 * по Gibson «Organizations», 14th ed.).
 * Только картинками на слайдах (в извлечённом тексте их нет), перенесены таблицами:
 * Fig. 1 «Cost reduction analysis» (с. 5), Fig. 2 «People with the ability to influence
 * cost» (с. 6), Table 1 «The Parameters For Variance Analysis» (с. 21). Страницы 10 и 23 пустые.
 * Неточности слайдов, отмеченные в конспекте строками «Exam trap»: EAC назван
 * «estimated cost-to-complete», CPI/SPI — «as a percentage of EV» (это отношения),
 * фраза о последствиях ролевого конфликта на последнем слайде оборвана.
 */

const p1 = part(
  "pm-l4-p1",
  { en: "Cost control and the MCCS", ru: "Контроль затрат и система MCCS" },
  {
    en: `## Why cost control matters to every company
> Cost control is **equally important to all companies, regardless of size**. What differs is *how* small and large companies control cost.
| | Small company | Large company |
|---|---|---|
| Monetary controls | **tighter** — the failure of even one project can put the company at risk | can afford to be less tight on any single project |
| Control techniques | **less sophisticated** | more sophisticated (formal systems, earned value) |
| Losses | few projects, so a loss cannot be absorbed elsewhere | may have the **luxury to spread project losses over several projects** |
- **Small IT example:** a 12-person studio runs three fixed-price projects. If the e-commerce app overruns by 40%, there is no other project to cover the loss, and salaries are at risk. So the owner checks every invoice and timesheet — tight control, but done in a spreadsheet.
- **Large IT example:** a bank's IT department runs 60 projects. One failed chatbot pilot hurts, but the loss is spread over the portfolio. The bank uses formal tools — budgets per work package, monthly variance reports, earned value.
> Exam trap: the slide does **not** say that small companies care less about cost or have weaker controls. Small companies have **tighter** monetary controls but **less sophisticated** techniques; large companies have the **luxury** of spreading losses.
## Good cost management: seven elements
Cost control implies **good cost management**, which must include:
| # | Element (slide wording) | What it means | IT project example |
|---|---|---|---|
| 1 | Cost estimating | forecasting what the work will cost before it is done | 1,200 developer hours × rate + cloud hosting for a year |
| 2 | Cost accounting | recording and classifying the costs actually incurred | timesheets charged to the "Payments API" work package |
| 3 | Project cash flow | when money comes into and goes out of this project | the client pays per milestone, salaries go out every month |
| 4 | Company cash flow | the cash position of the whole company across all projects | can the company pay everyone in March if two clients pay late? |
| 5 | Direct labor costing | the cost of people's working hours charged directly to the project | 3 developers × 160 h × 15 USD/h |
| 6 | Overhead rate costing | indirect costs (office, HR, licences, management) spread over projects through an overhead rate | each project hour carries +30% for rent and admin |
| 7 | Other tactics, such as incentives, penalties, and profit-sharing | contract and team mechanisms that steer cost behaviour | a bonus for delivery before Black Friday, a penalty per day of delay |
> Memory hook: **E-A-CC-CC-T** — Estimating, Accounting, two Cash flows (project, company), two Costings (direct labor, overhead rate), and Tactics (incentives, penalties, profit-sharing).
> Cost control is actually a **subsystem of the management cost and control system (MCCS)** rather than a complete system per se.
Why a subsystem: comparing money spent with money planned means nothing without a plan to compare against, an authorization of who may spend, progress data and reporting. The MCCS joins all of these; cost control is one piece inside it.
## Requirements for an effective control system
The requirements for an effective control system (**for both cost and schedule/performance**) should include seven points:
| # | Requirement (slide wording) | What goes wrong in an IT project without it |
|---|---|---|
| 1 | Thorough planning of the work to be performed to complete the project | nobody listed the data-migration work, so it appears as a surprise in month 5 |
| 2 | Good estimating of time, labor, and costs | "two weeks" for an integration that really takes two months |
| 3 | Clear communication of the scope of required tasks | the team builds an admin panel nobody asked for |
| 4 | A disciplined budget and authorization of expenditures | a developer buys a paid API plan without approval |
| 5 | Timely accounting of physical progress and cost expenditures | hours are logged a month late, so problems are seen a month late |
| 6 | Periodic reestimation of time and cost to complete remaining work | the original estimate is never revisited, though half of it was wrong |
| 7 | Frequent, periodic comparison of actual progress and expenditures to schedules and budgets, both at the time of comparison and at project completion | the overrun is discovered only at the final invoice |
- Requirements 1–2 are about the **plan**, 3–4 about **releasing the work and the money**, 5–7 about **measuring and comparing** — the same logic as the operating cycle below.
- Note the double horizon in point 7: compare **now** (at the time of comparison) and **at completion** (where will we end up?). That is exactly what earned value does in Part 2: CV/SV look at now, EAC/VAC look at completion.
## Fig. 1 — Cost reduction analysis
The slide is a picture: a graph with **project life-cycle phases** on the horizontal axis and **project costs** on the vertical axis. Two curves:
| Curve | Shape | Meaning |
|---|---|---|
| **Possible cost reductions** (dashed) | starts high in the early phases and falls steeply | early decisions can still save a lot of money; late in the project there is little left to save |
| **Cost of change** (solid) | starts low and rises steadily through the life cycle | a change is cheap at the start and expensive at the end |
- The curves cross fairly early in the life cycle: after that point, a change costs more than the savings it can still bring.
- **IT example:** switching from MongoDB to PostgreSQL during requirements means editing a document. Doing it after launch means a data migration, downtime, rewritten queries and retesting.
> Lesson of Fig. 1: cost control pays off most **early** — thorough planning and estimating are the strongest cost-control tools.
## Fig. 2 — People with the ability to influence cost
Also a picture. Horizontal axis: **project life-cycle phases**; vertical axis: **impact on cost** (arrow up). A dashed line falls from the top-left corner to almost zero at the bottom-right. Above each phase the slide names who has the influence:
| Life-cycle phase | People with the ability to influence cost | Impact on cost |
|---|---|---|
| Initiation | Customer, owner | highest |
| Planning | Project manager | high, falling |
| Execution | Project team, contractors | lower |
| Closure | Users | lowest, close to zero |
- Fig. 2 tells the same story as Fig. 1 from the people side: whoever decides early (the customer choosing the scope, the PM building the plan) shapes most of the cost; by the time users get the system, the money is already spent.
> Exam trap: the greatest ability to influence cost belongs to the **customer/owner** in **initiation**, not to the project manager (planning) and not to the team (execution). **Users** in **closure** have the least.
## The operating cycle
The **management cost and control system (MCCS)** takes on paramount importance during the **operating cycle** of the project. The operating cycle is composed of **four phases**:
- Work authorization and release (**phase II**)
- Cost data collection and reporting (**phase III**)
- Cost analysis (**phase IV**)
- Reporting: customer and management (**phase V**)
These four phases, when combined with the **planning cycle (phase I)**, constitute a **closed system network** that forms the basis for the management cost and control system.
@diagram pm4-operating-cycle
| Phase | Name | What happens in an IT project |
|---|---|---|
| I | Planning cycle | WBS, estimates, budget per work package, schedule baseline |
| II | Work authorization and release | a work package or sprint is formally opened with a budget and a charge code; no one spends before this |
| III | Cost data collection and reporting | timesheets, contractor invoices and cloud bills are collected against each work package |
| IV | Cost analysis | actual cost and progress are compared with the plan: variances and indices (Part 2) |
| V | Reporting: customer and management | status reports go to the client and to management; their decisions feed back into planning |
- "Closed" means the loop returns to its start: reporting (V) leads to re-planning (I), and the new plan is authorized again (II).
> Exam trap: the **operating cycle** has **four** phases (II–V). **Planning** is phase I and is called the **planning cycle**; only together do they form the five-phase closed system.
## Budgets: the budget log
All budgets must be **traceable through the budget "log,"** which includes:
- **Distributed budget** — the budget already handed out to specific work packages and cost accounts (the "normal" performance budget).
- **Management reserve** — budget held back by management for unforeseen work and not given to any work package.
- **Undistributed budget** — see below.
- **Contract changes** — budget added or removed by approved changes to the contract.
In addition to the "normal" performance budget and the management reserve budget, there are **two other budgets**:
- **Undistributed budget** — budget associated with **contract changes** where **time constraints prevent the necessary planning** to incorporate the change into the performance budget. (This effort may be time-constrained.)
- **Unallocated budget** — represents a **logical grouping of contract tasks that have not yet been identified and/or authorized**.
| | Undistributed budget | Unallocated budget |
|---|---|---|
| Comes from | an approved contract change | contract tasks grouped together in advance |
| Why it is not yet in work packages | there was no time to plan the change in | the tasks have not yet been identified and/or authorized |
| Named in the four-item budget log? | yes | no |
| IT example | two weeks before release the client approves adding Apple Pay; the money is approved, but nobody has had time to split it into tasks | the contract mentions "post-launch integrations" with a budget, but which integrations is not yet decided or authorized |
> Memory hook: **undistributed** = "change approved, no time to plan it"; **unallocated** = "tasks not yet identified or authorized".
- Why the log matters: if a budget line cannot be traced (where did these 30,000 come from? which change?), cost control loses its baseline, and every variance in Part 2 becomes meaningless.
?? A 10-person startup checks every expense weekly in a spreadsheet; a large telecom runs an earned value system across 80 projects. Which statement from the slides explains the difference?
?= Small companies have tighter monetary controls because one failed project can put the company at risk, but less sophisticated control techniques; large companies can spread losses over several projects.
?? The client signs a change request on Friday; the release is on Monday, so the new money is recorded but not yet planned into work packages. Which budget is this?
?= Undistributed budget: budget associated with contract changes where time constraints prevent the planning needed to incorporate the change into the performance budget.
?? According to Fig. 2, who has the greatest ability to influence cost, and in which phase?
?= The customer/owner, in the initiation phase. The impact on cost then falls through planning (project manager) and execution (project team, contractors) to closure (users).
## Exam focus
- The **7 elements** of good cost management, and the phrase "cost control is a **subsystem of the MCCS** rather than a complete system per se".
- The **7 requirements** of an effective control system (for both cost and schedule/performance) — expect "Which is NOT a requirement…".
- Small vs large companies: tighter controls but less sophisticated techniques vs the luxury of spreading losses over several projects.
- Fig. 1: possible cost reductions **fall**, the cost of change **rises** over the life cycle. Fig. 2: customer/owner → PM → team/contractors → users, impact on cost falling.
- Operating cycle: phases **II–V**; with the planning cycle (phase I) they form a **closed system network**. Know the phase numbers.
- Budget log: **distributed budget, management reserve, undistributed budget, contract changes**; the definitions of undistributed vs unallocated budget.`,
    ru: `## Почему контроль затрат важен любой компании
> Контроль затрат (cost control) **одинаково важен для всех компаний, независимо от размера**. Различается лишь то, *как* его ведут малые и крупные компании.
| | Малая компания | Крупная компания |
|---|---|---|
| Денежный контроль (monetary controls) | **жёстче** — провал даже одного проекта может поставить компанию под угрозу | может позволить себе меньшую жёсткость по отдельному проекту |
| Методы контроля (control techniques) | **менее сложные (less sophisticated)** | более развитые (формальные системы, освоенный объём) |
| Убытки | проектов мало, убыток нечем перекрыть | может позволить себе **роскошь распределить убытки по нескольким проектам (spread project losses over several projects)** |
- **Пример малой IT-компании:** студия из 12 человек ведёт три проекта с фиксированной ценой. Если e-commerce-приложение выйдет за бюджет на 40%, перекрыть убыток другим проектом нельзя, и под угрозой зарплаты. Поэтому владелец проверяет каждый счёт и каждый табель — контроль жёсткий, но ведётся в таблице.
- **Пример крупной компании:** IT-департамент банка ведёт 60 проектов. Провальный пилот чат-бота неприятен, но убыток распределяется по портфелю. Банк пользуется формальными инструментами — бюджетами по пакетам работ, ежемесячными отчётами об отклонениях, освоенным объёмом.
> Ловушка экзамена (exam trap): на слайде **не** сказано, что малые компании меньше думают о затратах или контролируют их слабее. У малых — **более жёсткий** денежный контроль, но **менее сложные** методы; у крупных — **роскошь** распределять убытки.
## Хорошее управление затратами: семь составляющих
Контроль затрат подразумевает **хорошее управление затратами (good cost management)**, которое должно включать:
| # | Составляющая (как на слайде) | Что это значит | Пример в IT-проекте |
|---|---|---|---|
| 1 | Cost estimating — оценка затрат | прогноз, сколько будет стоить работа, ещё до её выполнения | 1 200 часов разработчиков × ставка + облачный хостинг на год |
| 2 | Cost accounting — учёт затрат | запись и классификация фактически понесённых затрат | табели, списанные на пакет работ «Payments API» |
| 3 | Project cash flow — денежный поток проекта | когда деньги приходят в проект и уходят из него | клиент платит за вехи, зарплаты уходят каждый месяц |
| 4 | Company cash flow — денежный поток компании | денежное положение всей компании по всем проектам | сможет ли компания заплатить всем в марте, если два клиента задержат оплату? |
| 5 | Direct labor costing — расчёт прямых затрат труда | стоимость рабочих часов людей, прямо списываемых на проект | 3 разработчика × 160 ч × 15 USD/ч |
| 6 | Overhead rate costing — расчёт накладных по ставке | косвенные затраты (офис, HR, лицензии, управление), распределяемые по проектам через ставку накладных расходов | каждый час проекта несёт +30% на аренду и администрацию |
| 7 | Other tactics, such as incentives, penalties, and profit-sharing — прочие приёмы: поощрения, штрафы, участие в прибыли | договорные и командные механизмы, которые направляют поведение в отношении затрат | бонус за сдачу до «чёрной пятницы», штраф за каждый день задержки |
> Как запомнить: **E-A-CC-CC-T** — Estimating (оценка), Accounting (учёт), два Cash flow (проекта и компании), два Costing (прямой труд и накладные) и Tactics (поощрения, штрафы, участие в прибыли).
> Контроль затрат — на самом деле **подсистема системы управления затратами и контроля (management cost and control system, MCCS)**, а не законченная система сама по себе (per se).
Почему подсистема: сравнивать потраченное с запланированным бессмысленно без плана, с которым сравнивать, без разрешения на расходы, без данных о ходе работ и без отчётности. MCCS объединяет всё это; контроль затрат — одна из её частей.
## Требования к эффективной системе контроля
Требования к эффективной системе контроля (**и для затрат, и для сроков/выполнения — for both cost and schedule/performance**) должны включать семь пунктов:
| # | Требование (как на слайде) | Что ломается в IT-проекте без него |
|---|---|---|
| 1 | Thorough planning of the work to be performed to complete the project — тщательное планирование работ, нужных для завершения проекта | никто не внёс в план миграцию данных, и она всплывает сюрпризом на пятом месяце |
| 2 | Good estimating of time, labor, and costs — хорошая оценка времени, трудозатрат и стоимости | «две недели» на интеграцию, которая на деле занимает два месяца |
| 3 | Clear communication of the scope of required tasks — ясное доведение содержания нужных задач | команда делает админ-панель, которую никто не просил |
| 4 | A disciplined budget and authorization of expenditures — дисциплинированный бюджет и разрешение расходов | разработчик покупает платный тариф API без согласования |
| 5 | Timely accounting of physical progress and cost expenditures — своевременный учёт фактического прогресса и расходов | часы вносят с опозданием на месяц, и проблемы видны с опозданием на месяц |
| 6 | Periodic reestimation of time and cost to complete remaining work — периодическая переоценка времени и стоимости оставшихся работ | исходную оценку никто не пересматривает, хотя половина её оказалась неверной |
| 7 | Frequent, periodic comparison of actual progress and expenditures to schedules and budgets, both at the time of comparison and at project completion — частое регулярное сравнение факта с графиком и бюджетом, и на момент сравнения, и на завершение проекта | перерасход обнаруживают только по итоговому счёту |
- Пункты 1–2 — про **план**, 3–4 — про **запуск работ и денег**, 5–7 — про **измерение и сравнение**; та же логика, что у операционного цикла ниже.
- Обратите внимание на два горизонта в пункте 7: сравнивать **сейчас** (на момент сравнения) и **на завершение** (чем закончим?). Именно это делает освоенный объём в части 2: CV/SV смотрят на «сейчас», EAC/VAC — на завершение.
## Рис. 1 — Анализ снижения затрат (Fig. 1. Cost reduction analysis)
Слайд — картинка: график, по горизонтали **фазы жизненного цикла проекта (project life-cycle phases)**, по вертикали **затраты проекта (project costs)**. Две кривые:
| Кривая | Форма | Смысл |
|---|---|---|
| **Возможное снижение затрат (possible cost reductions)**, пунктир | начинается высоко в ранних фазах и круто падает | ранние решения ещё могут сэкономить много денег; в конце проекта экономить почти нечего |
| **Стоимость изменения (cost of change)**, сплошная | начинается низко и равномерно растёт по жизненному циклу | изменение дёшево в начале и дорого в конце |
- Кривые пересекаются довольно рано: после этой точки изменение стоит дороже, чем экономия, которую оно ещё может дать.
- **Пример из IT:** перейти с MongoDB на PostgreSQL на этапе требований — значит поправить документ. Сделать это после запуска — миграция данных, простой, переписанные запросы и повторное тестирование.
> Урок рис. 1: контроль затрат окупается сильнее всего **в начале** — тщательное планирование и оценка оказываются самыми сильными инструментами контроля затрат.
## Рис. 2 — Люди, способные влиять на затраты (Fig. 2. People with the ability to influence cost)
Тоже картинка. По горизонтали — **фазы жизненного цикла проекта**, по вертикали — **влияние на затраты (impact on cost)**, стрелка вверх. Пунктирная линия падает из левого верхнего угла почти до нуля в правом нижнем. Над каждой фазой слайд называет, у кого влияние:
| Фаза жизненного цикла | Кто способен влиять на затраты | Влияние на затраты |
|---|---|---|
| Initiation (инициация) | Customer, owner (заказчик, владелец) | наибольшее |
| Planning (планирование) | Project manager (менеджер проекта) | высокое, снижается |
| Execution (исполнение) | Project team, contractors (команда проекта, подрядчики) | ниже |
| Closure (закрытие) | Users (пользователи) | наименьшее, почти ноль |
- Рис. 2 рассказывает то же, что рис. 1, но со стороны людей: кто решает рано (заказчик, выбирающий содержание, менеджер, строящий план), тот и определяет большую часть затрат; когда система доходит до пользователей, деньги уже потрачены.
> Ловушка экзамена: наибольшая способность влиять на затраты — у **заказчика/владельца** на **инициации**, а не у менеджера проекта (планирование) и не у команды (исполнение). Меньше всех — у **пользователей** на **закрытии**.
## Операционный цикл (operating cycle)
**Система управления затратами и контроля (MCCS)** приобретает первостепенное значение в **операционном цикле** проекта. Операционный цикл состоит из **четырёх фаз**:
- Разрешение на работы и их запуск — Work authorization and release (**phase II**)
- Сбор данных о затратах и отчётность — Cost data collection and reporting (**phase III**)
- Анализ затрат — Cost analysis (**phase IV**)
- Отчётность для заказчика и руководства — Reporting: customer and management (**phase V**)
Эти четыре фазы вместе с **циклом планирования (planning cycle, phase I)** образуют **замкнутую систему (closed system network)**, на которой строится система управления затратами и контроля.
@diagram pm4-operating-cycle
| Фаза | Название | Что происходит в IT-проекте |
|---|---|---|
| I | Planning cycle — цикл планирования | WBS, оценки, бюджет по пакетам работ, базовый график |
| II | Work authorization and release — разрешение и запуск работ | пакет работ или спринт официально открывают с бюджетом и кодом списания; до этого никто не тратит |
| III | Cost data collection and reporting — сбор данных о затратах и отчётность | табели, счета подрядчиков и облачные счета собирают по каждому пакету работ |
| IV | Cost analysis — анализ затрат | фактические затраты и прогресс сравнивают с планом: отклонения и индексы (часть 2) |
| V | Reporting: customer and management — отчётность для заказчика и руководства | отчёты о статусе уходят клиенту и руководству; их решения возвращаются в планирование |
- «Замкнутая» значит, что цикл возвращается к началу: отчётность (V) ведёт к перепланированию (I), а новый план снова проходит разрешение (II).
> Ловушка экзамена: в **операционном цикле** **четыре** фазы (II–V). **Планирование** — фаза I, и называется оно **циклом планирования**; только вместе они дают замкнутую систему из пяти фаз.
## Бюджеты: журнал бюджета (budget log)
Все бюджеты должны **прослеживаться через журнал бюджета («log»)**, который включает:
- **Распределённый бюджет (distributed budget)** — бюджет, уже выданный конкретным пакетам работ и счетам затрат («обычный» бюджет выполнения).
- **Управленческий резерв (management reserve)** — бюджет, который руководство держит на непредвиденные работы и не отдаёт ни одному пакету.
- **Нераспределённый бюджет (undistributed budget)** — см. ниже.
- **Изменения контракта (contract changes)** — бюджет, добавленный или снятый утверждёнными изменениями контракта.
Помимо «обычного» бюджета выполнения (performance budget) и управленческого резерва, есть **ещё два бюджета**:
- **Нераспределённый бюджет (undistributed budget)** — бюджет, связанный с **изменениями контракта**, когда **нехватка времени не даёт выполнить нужное планирование**, чтобы включить изменение в бюджет выполнения. (Эта работа может быть ограничена по времени — time-constrained.)
- **Невыделенный бюджет (unallocated budget)** — **логическая группа задач контракта, которые ещё не определены и/или не разрешены (not yet identified and/or authorized)**.
| | Undistributed budget (нераспределённый) | Unallocated budget (невыделенный) |
|---|---|---|
| Откуда берётся | из утверждённого изменения контракта | из задач контракта, заранее сгруппированных вместе |
| Почему ещё не в пакетах работ | не было времени спланировать изменение | задачи ещё не определены и/или не разрешены |
| Есть в журнале бюджета из четырёх пунктов? | да | нет |
| Пример из IT | за две недели до релиза клиент утверждает добавление Apple Pay; деньги одобрены, но разбить их на задачи никто не успел | в контракте есть бюджет на «интеграции после запуска», но какие именно — ещё не решено и не разрешено |
> Как запомнить: **undistributed** — «изменение утверждено, спланировать не успели»; **unallocated** — «задачи ещё не определены или не разрешены».
- Зачем нужен журнал: если строку бюджета нельзя проследить (откуда эти 30 000? по какому изменению?), контроль затрат теряет базовую линию, и любые отклонения из части 2 теряют смысл.
?? Стартап из 10 человек каждую неделю сверяет все расходы в таблице, а крупный телеком ведёт систему освоенного объёма по 80 проектам. Какое утверждение со слайдов объясняет разницу?
?= У малых компаний денежный контроль жёстче, потому что провал одного проекта может поставить компанию под угрозу, но методы контроля менее сложные; крупные могут распределять убытки по нескольким проектам.
?? Клиент подписал запрос на изменение в пятницу, релиз в понедельник, поэтому новые деньги учтены, но ещё не распланированы по пакетам работ. Что это за бюджет?
?= Нераспределённый бюджет (undistributed budget): бюджет, связанный с изменениями контракта, когда нехватка времени не даёт выполнить планирование, нужное для включения изменения в бюджет выполнения.
?? Кто, по рис. 2, сильнее всех способен влиять на затраты и в какой фазе?
?= Заказчик/владелец (customer, owner) на фазе инициации. Затем влияние падает: планирование (менеджер проекта), исполнение (команда, подрядчики), закрытие (пользователи).
## Что спросят на экзамене (Exam focus)
- **7 составляющих** хорошего управления затратами и фраза «контроль затрат — **подсистема MCCS**, а не законченная система сама по себе (rather than a complete system per se)».
- **7 требований** к эффективной системе контроля (и для затрат, и для сроков/выполнения) — ждите «Which is NOT a requirement…».
- Малые и крупные компании: контроль жёстче, но методы проще — против роскоши распределять убытки по нескольким проектам.
- Рис. 1: возможное снижение затрат по жизненному циклу **падает**, стоимость изменения **растёт**. Рис. 2: заказчик/владелец → менеджер → команда/подрядчики → пользователи, влияние на затраты падает.
- Операционный цикл: фазы **II–V**; вместе с циклом планирования (фаза I) они образуют **замкнутую систему (closed system network)**. Знайте номера фаз.
- Журнал бюджета: **distributed budget, management reserve, undistributed budget, contract changes**; определения undistributed и unallocated budget.`,
  },
  [
    qx("According to the lecture, how do small companies typically differ from large companies in cost control?", "Tighter monetary controls, but less sophisticated techniques", [
      ["Looser monetary controls, but far more sophisticated techniques", "This reverses both halves of the slide: small companies control money more tightly, but their techniques are simpler.", "Это переворачивает обе половины слайда: малые компании контролируют деньги жёстче, но методы у них проще."],
      ["Equally tight controls and equally sophisticated techniques", "The slide says cost control is equally important, not that controls and techniques are the same: small firms are tighter but less sophisticated.", "Слайд говорит, что контроль одинаково важен, а не что контроль и методы одинаковы: у малых он жёстче, но методы проще."],
      ["Less need for cost control, since they run fewer projects", "Cost control is equally important to all companies regardless of size; fewer projects make one failure more dangerous, not less.", "Контроль затрат одинаково важен всем компаниям; меньше проектов — значит провал одного опаснее, а не наоборот."],
    ], "Slide: small companies generally have tighter monetary controls because the failure of even one project can put the company at risk, but they have less sophisticated control techniques.", "Слайд: у малых компаний обычно более жёсткий денежный контроль, потому что провал даже одного проекта может поставить компанию под угрозу, но методы контроля у них менее сложные."),
    qx("Why may a large company tolerate a loss on one project better than a small company?", "It can spread project losses over several projects", [
      ["It applies tighter monetary controls to every project", "Tighter monetary controls are what the slide attributes to small companies, not large ones.", "Более жёсткий денежный контроль слайд приписывает малым компаниям, а не крупным."],
      ["It uses less sophisticated control techniques overall", "Less sophisticated techniques are a feature of small companies, and they would not help absorb a loss anyway.", "Менее сложные методы — черта малых компаний, и убыток они поглотить никак не помогают."],
      ["Its cost control is a complete system per se", "The slide says the opposite: cost control is a subsystem of the MCCS rather than a complete system per se.", "Слайд говорит обратное: контроль затрат — подсистема MCCS, а не законченная система сама по себе."],
    ], "Slide: large companies may have the luxury to spread project losses over several projects, whereas the small company may have few projects.", "Слайд: крупные компании могут позволить себе роскошь распределить убытки по нескольким проектам, а у малой компании проектов может быть мало."),
    qx("Which of the following is NOT one of the elements of good cost management listed in the lecture?", "Resource leveling", [
      ["Overhead rate costing", "Overhead rate costing is element 6 of the list — spreading indirect costs over projects through an overhead rate.", "Overhead rate costing — шестой пункт списка: распределение косвенных затрат по проектам через ставку накладных."],
      ["Company cash flow", "Company cash flow is element 4, next to project cash flow.", "Company cash flow — четвёртый пункт, рядом с project cash flow."],
      ["Direct labor costing", "Direct labor costing is element 5 — the cost of hours charged directly to the project.", "Direct labor costing — пятый пункт: стоимость часов, прямо списываемых на проект."],
    ], "The seven elements: cost estimating, cost accounting, project cash flow, company cash flow, direct labor costing, overhead rate costing, and other tactics (incentives, penalties, profit-sharing). Resource leveling is a scheduling technique, not on the list.", "Семь составляющих: cost estimating, cost accounting, project cash flow, company cash flow, direct labor costing, overhead rate costing и other tactics (поощрения, штрафы, участие в прибыли). Resource leveling — приём планирования графика, в списке его нет."),
    qx("Which statement about cost control matches the lecture?", "It is a subsystem of the MCCS, not a complete system per se", [
      ["It is a complete system that replaces the MCCS in small firms", "The slide calls cost control a subsystem of the MCCS; nothing says it replaces the MCCS anywhere.", "Слайд называет контроль затрат подсистемой MCCS; нигде не сказано, что он заменяет MCCS."],
      ["It is the planning cycle, phase I of the closed system", "Phase I is the planning cycle of the MCCS; cost control is not a phase but a subsystem of the whole MCCS.", "Фаза I — цикл планирования MCCS; контроль затрат — не фаза, а подсистема всей MCCS."],
      ["It is a separate system that starts only after closure", "Cost control runs through the whole operating cycle; after closure there is nothing left to control.", "Контроль затрат идёт через весь операционный цикл; после закрытия контролировать уже нечего."],
    ], "Slide: cost control is actually a subsystem of the management cost and control system (MCCS) rather than a complete system per se.", "Слайд: контроль затрат — на самом деле подсистема системы управления затратами и контроля (MCCS), а не законченная система сама по себе."),
    qx("Which of the following is one of the requirements for an effective control system?", "Periodic reestimation of time and cost to complete remaining work", [
      ["A single comparison of actual costs to budget at project completion", "The slide requires frequent, periodic comparison — both at the time of comparison and at completion — not a single one at the end.", "Слайд требует частого регулярного сравнения — и на момент сравнения, и на завершение, — а не одного в конце."],
      ["Fixing the original estimate so that it is never revised later", "This contradicts the requirement of periodic reestimation of the remaining work.", "Это противоречит требованию периодически переоценивать оставшиеся работы."],
      ["Authorization of expenditures only after the money has been spent", "The requirement is a disciplined budget and authorization of expenditures — authorization comes before spending.", "Требование — дисциплинированный бюджет и разрешение расходов: разрешение даётся до трат, а не после."],
    ], "The seven requirements include periodic reestimation of time and cost to complete remaining work, alongside thorough planning, good estimating, clear scope communication, a disciplined budget, timely accounting and frequent comparison.", "Среди семи требований — периодическая переоценка времени и стоимости оставшихся работ, наряду с тщательным планированием, хорошей оценкой, ясным доведением содержания, дисциплинированным бюджетом, своевременным учётом и частым сравнением."),
    qx("A team logs its working hours only at the end of each quarter, so overruns are noticed months late. Which control requirement is violated most directly?", "Timely accounting of physical progress and cost expenditures", [
      ["Clear communication of the scope of required tasks", "Scope communication is about what to build; the problem here is late recording of hours and progress.", "Доведение содержания — о том, что строить; проблема здесь — запоздалый учёт часов и прогресса."],
      ["Thorough planning of the work to be performed to complete the project", "The plan may be fine; what fails is recording actual progress and cost on time.", "План может быть в порядке; не работает своевременная запись фактического прогресса и затрат."],
      ["A disciplined budget and authorization of expenditures", "Authorization controls who may spend; the case is about recording what was spent too late.", "Разрешение расходов определяет, кто может тратить; кейс — о слишком позднем учёте потраченного."],
    ], "Quarterly timesheets break the requirement of timely accounting of physical progress and cost expenditures: problems become visible only months later, when they are large.", "Табели раз в квартал нарушают требование своевременного учёта прогресса и расходов: проблемы видны только через месяцы, когда они уже большие."),
    qx("In Fig. 1 \"Cost reduction analysis\", what happens to the two curves as the project moves through its life-cycle phases?", "Possible cost reductions fall while the cost of change rises", [
      ["Possible cost reductions rise while the cost of change falls", "This reverses the figure: the savings curve falls and the cost-of-change curve rises.", "Это переворачивает рисунок: кривая экономии падает, а кривая стоимости изменения растёт."],
      ["Both curves rise steadily until the closure phase is reached", "Only the cost of change rises; possible cost reductions fall steeply from the early phases.", "Растёт только стоимость изменения; возможное снижение затрат круто падает с ранних фаз."],
      ["Both curves stay flat until execution, then drop sharply", "Neither curve is flat: savings drop from the very start and the cost of change climbs all the way.", "Ни одна кривая не плоская: экономия падает с самого начала, а стоимость изменения растёт всё время."],
    ], "Fig. 1 (picture only): the dashed \"possible cost reductions\" curve falls over the life-cycle phases, while the solid \"cost of change\" curve rises — so control effort pays off most early.", "Рис. 1 (только картинка): пунктирная кривая «possible cost reductions» падает по фазам жизненного цикла, а сплошная «cost of change» растёт — поэтому контроль окупается сильнее всего в начале."),
    qx("According to Fig. 2 \"People with the ability to influence cost\", who has the greatest impact on cost?", "The customer/owner during initiation", [
      ["The project manager during planning", "The PM sits above the planning phase, where the impact on cost is already falling.", "Менеджер проекта стоит над фазой планирования, где влияние на затраты уже снижается."],
      ["The team and contractors during execution", "Project team and contractors are shown in execution, where the impact on cost is lower still.", "Команда и подрядчики показаны в исполнении, где влияние на затраты ещё ниже."],
      ["The users during closure", "Users at closure are at the bottom of the curve — the least ability to influence cost.", "Пользователи на закрытии — в самом низу кривой, у них наименьшая способность влиять на затраты."],
    ], "Fig. 2: the impact-on-cost line starts highest over initiation (customer, owner) and falls through planning (project manager), execution (project team, contractors) to closure (users).", "Рис. 2: линия влияния на затраты выше всего над инициацией (заказчик, владелец) и падает через планирование (менеджер), исполнение (команда, подрядчики) к закрытию (пользователи)."),
    qx("Based on Figs. 1 and 2, why should cost-control effort be concentrated early in a project?", "Early decisions shape most of the cost, and changes are cheap", [
      ["Users at closure have the greatest ability to influence cost", "Fig. 2 shows the opposite: users at closure have the least influence on cost.", "Рис. 2 показывает обратное: у пользователей на закрытии влияние на затраты наименьшее."],
      ["The cost of change is highest during the initiation phase", "Fig. 1 shows the cost of change is lowest at the start and rises later.", "Рис. 1 показывает, что стоимость изменения в начале наименьшая и растёт потом."],
      ["Possible cost reductions keep growing as the project nears closure", "Possible cost reductions shrink over the life cycle; little is left to save near closure.", "Возможное снижение затрат по жизненному циклу уменьшается; к закрытию экономить почти нечего."],
    ], "Both figures point the same way: early on, possible savings are largest, changes cost little, and the customer and PM can still shape the cost.", "Оба рисунка говорят одно: в начале возможная экономия наибольшая, изменения дешёвые, а заказчик и менеджер ещё могут определить затраты."),
    qx("The operating cycle of the MCCS is composed of which phases?", "Work authorization, cost data collection, cost analysis, reporting", [
      ["Planning, work authorization, cost data collection, cost analysis", "Planning is phase I, the planning cycle — not part of the four-phase operating cycle; and reporting (phase V) is missing.", "Планирование — фаза I, цикл планирования, а не часть операционного цикла; к тому же пропущена отчётность (фаза V)."],
      ["Cost estimating, cost accounting, project and company cash flow", "These are elements of good cost management, not phases of the operating cycle.", "Это составляющие хорошего управления затратами, а не фазы операционного цикла."],
      ["Distributed budget, management reserve, undistributed budget", "These are entries of the budget log, not phases of the operating cycle.", "Это строки журнала бюджета, а не фазы операционного цикла."],
    ], "Operating cycle: work authorization and release (II), cost data collection and reporting (III), cost analysis (IV), reporting: customer and management (V).", "Операционный цикл: work authorization and release (II), cost data collection and reporting (III), cost analysis (IV), reporting: customer and management (V)."),
    qx("In the operating cycle, \"cost analysis\" is which phase?", "Phase IV", [
      ["Phase II", "Phase II is work authorization and release.", "Фаза II — разрешение и запуск работ (work authorization and release)."],
      ["Phase III", "Phase III is cost data collection and reporting — the data is gathered before it is analysed.", "Фаза III — сбор данных о затратах и отчётность: данные сначала собирают, потом анализируют."],
      ["Phase V", "Phase V is reporting: customer and management, which follows the analysis.", "Фаза V — отчётность для заказчика и руководства, она идёт после анализа."],
    ], "Phases: I planning cycle, II work authorization and release, III cost data collection and reporting, IV cost analysis, V reporting: customer and management.", "Фазы: I — цикл планирования, II — разрешение и запуск работ, III — сбор данных о затратах и отчётность, IV — анализ затрат, V — отчётность для заказчика и руководства."),
    qx("What do the four phases of the operating cycle constitute when combined with the planning cycle (phase I)?", "A closed system network that is the basis for the MCCS", [
      ["An open system that ends with reporting to the customer", "The slide says closed: reporting feeds back into planning, so the loop does not simply end.", "Слайд говорит «замкнутая»: отчётность возвращается в планирование, цикл не просто заканчивается."],
      ["The budget log through which all budgets must be traced", "The budget log is a list of budgets (distributed, reserve, undistributed, contract changes), not a set of phases.", "Журнал бюджета — список бюджетов (distributed, reserve, undistributed, contract changes), а не набор фаз."],
      ["The five-stage model of the project's development cycle", "The five-stage model (forming … adjourning) describes group development, not cost control.", "Пятиэтапная модель (forming … adjourning) описывает развитие группы, а не контроль затрат."],
    ], "Slide: these four phases, when combined with the planning cycle (phase I), constitute a closed system network that forms the basis for the management cost and control system.", "Слайд: эти четыре фазы вместе с циклом планирования (фаза I) образуют замкнутую систему, на которой строится система управления затратами и контроля."),
    qx("A PM collects timesheets, contractor invoices and cloud bills against each work package. Which phase of the operating cycle is this?", "Cost data collection and reporting (phase III)", [
      ["Work authorization and release (phase II)", "Phase II opens the work and releases the budget; here the work is already running and costs are being gathered.", "Фаза II открывает работы и выдаёт бюджет; здесь работы уже идут и затраты собираются."],
      ["Cost analysis (phase IV)", "Analysis compares the collected data with the plan; collecting the data comes first.", "Анализ сравнивает собранные данные с планом; сначала данные нужно собрать."],
      ["Reporting: customer and management (phase V)", "Phase V reports results to the customer and management; collecting raw cost data is phase III.", "Фаза V — отчёт заказчику и руководству; сбор исходных данных о затратах — фаза III."],
    ], "Gathering actual costs (hours, invoices, bills) per work package is phase III, cost data collection and reporting.", "Сбор фактических затрат (часов, счетов) по пакетам работ — фаза III, cost data collection and reporting."),
    qx("Which of the following is NOT listed as part of the budget log?", "Project cash flow", [
      ["Distributed budget", "Distributed budget is the first item of the budget log.", "Distributed budget — первый пункт журнала бюджета."],
      ["Management reserve", "Management reserve is the second item of the budget log.", "Management reserve — второй пункт журнала бюджета."],
      ["Contract changes", "Contract changes are the fourth item of the budget log.", "Contract changes — четвёртый пункт журнала бюджета."],
    ], "Budget log: distributed budget, management reserve, undistributed budget, contract changes. Project cash flow is an element of good cost management, not a budget log entry.", "Журнал бюджета: distributed budget, management reserve, undistributed budget, contract changes. Project cash flow — составляющая хорошего управления затратами, а не строка журнала."),
    qx("What is undistributed budget?", "Contract-change budget not yet planned in, owing to time constraints", [
      ["Contract tasks that have not yet been identified and/or authorized", "That is the unallocated budget — a logical grouping of tasks not yet identified or authorized.", "Это невыделенный бюджет (unallocated) — логическая группа задач, ещё не определённых или не разрешённых."],
      ["Budget held back by management for unforeseen work within the project", "That describes the management reserve, not undistributed budget.", "Это описание управленческого резерва (management reserve), а не нераспределённого бюджета."],
      ["Budget already assigned to specific work packages and cost accounts", "That is the distributed (normal performance) budget.", "Это распределённый («обычный» бюджет выполнения) бюджет — distributed budget."],
    ], "Slide: undistributed budget is budget associated with contract changes where time constraints prevent the necessary planning to incorporate the change into the performance budget.", "Слайд: undistributed budget — бюджет, связанный с изменениями контракта, когда нехватка времени не даёт выполнить планирование, нужное для включения изменения в бюджет выполнения."),
    qx("What does unallocated budget represent?", "A logical grouping of contract tasks not yet identified and/or authorized", [
      ["Budget for contract changes that there was no time to plan into work packages", "That is undistributed budget: an approved change that time constraints kept from being planned.", "Это нераспределённый бюджет (undistributed): утверждённое изменение, которое не успели спланировать."],
      ["The normal performance budget assigned to specific work packages and accounts", "That is the distributed budget.", "Это распределённый бюджет (distributed budget)."],
      ["Money held back by management for unforeseen work that falls within scope", "That is the management reserve.", "Это управленческий резерв (management reserve)."],
    ], "Slide: unallocated budget represents a logical grouping of contract tasks that have not yet been identified and/or authorized.", "Слайд: unallocated budget — логическая группа задач контракта, которые ещё не определены и/или не разрешены."),
    qx("Two weeks before a release, the client approves adding Apple Pay. The money is added to the contract, but there is no time yet to break it into work packages. Where is this budget held?", "Undistributed budget", [
      ["Unallocated budget", "Unallocated budget covers tasks not yet identified or authorized; here the change is approved and known, only unplanned.", "Невыделенный бюджет — для задач, ещё не определённых или не разрешённых; здесь изменение утверждено и известно, его лишь не спланировали."],
      ["Management reserve budget", "The management reserve is held back for unforeseen work; this money comes from an approved contract change.", "Управленческий резерв держат на непредвиденное; эти деньги пришли из утверждённого изменения контракта."],
      ["Distributed performance budget", "Distributed budget is already planned into work packages — exactly what has not happened yet.", "Распределённый бюджет уже разложен по пакетам работ — а именно этого ещё не сделали."],
    ], "An approved contract change that time constraints keep out of the performance budget is, by the slide's definition, undistributed budget.", "Утверждённое изменение контракта, которое из-за нехватки времени не попало в бюджет выполнения, по определению слайда — нераспределённый бюджет (undistributed budget)."),
    tfx("The operating cycle of a project consists of five phases, starting with the planning cycle.", false,
      "The slide: the operating cycle is composed of four phases (II–V). Only when combined with the planning cycle (phase I) do they form the closed system network.",
      "Слайд: операционный цикл состоит из четырёх фаз (II–V). Только вместе с циклом планирования (фаза I) они образуют замкнутую систему.",
      "\"True\" merges the planning cycle into the operating cycle; the slide keeps them apart — phase I plus the four operating phases.",
      "«Верно» сливает цикл планирования с операционным; слайд их разделяет — фаза I плюс четыре операционные фазы."),
    tfx("Cost control is equally important to all companies, regardless of size.", true,
      "This is the opening sentence of the lecture; size changes how cost is controlled, not how much it matters.",
      "Это первая фраза лекции; от размера зависит, как контролируют затраты, а не насколько это важно.",
      "\"False\" would mean size changes the importance of cost control; the slide says only the controls and techniques differ.",
      "«Неверно» означало бы, что от размера зависит важность контроля; слайд говорит, что различаются только жёсткость и методы."),
    qx("A contract pays the vendor a bonus for each week of early delivery and deducts money for each week of delay. Which element of good cost management is this?", "Other tactics: incentives and penalties", [
      ["Project cash flow: money in and out", "Cash flow is about the timing of payments; bonuses and penalties are tactics that steer behaviour.", "Денежный поток — о сроках платежей; бонусы и штрафы — приёмы, которые направляют поведение."],
      ["Overhead rate costing: spreading indirect costs", "Overhead costing allocates indirect costs such as rent; it does not reward or punish delivery dates.", "Накладные распределяют косвенные затраты вроде аренды; они не поощряют и не наказывают за сроки."],
      ["Cost accounting of the work done", "Cost accounting records costs incurred; it does not create incentives.", "Учёт затрат записывает понесённые затраты; стимулов он не создаёт."],
    ], "Element 7 of good cost management: other tactics, such as incentives, penalties, and profit-sharing.", "Седьмая составляющая хорошего управления затратами: other tactics — поощрения, штрафы и участие в прибыли (incentives, penalties, and profit-sharing)."),
  ],
);

const p2 = part(
  "pm-l4-p2",
  { en: "Earned value: variances, indices and forecasts", ru: "Освоенный объём: отклонения, индексы и прогноз" },
  {
    en: `## Earned value management: what and why
> **Earned value management (EVM)** is a systematic process that uses **earned value** as the primary tool for **integrating cost, schedule, technical performance management, and risk management**.
- The **EVMS** (Earned Value Measurement System) emphasizes **prevention over cures** by identifying and resolving problems early.
- The EVMS is an **early warning system**, allowing for early identification of **trends and variances from the plan**.
- It gives the project manager **sufficient time to make course corrections in small increments**. It is usually **easier to correct small variances** as opposed to large variances.
- Therefore the EVMS should be used **continuously throughout the project**, to detect variances while they are small and possibly easy to correct.
- **Large variances** are more difficult to correct and run the risk that the cost to correct them may **displease management to the point where the project may be canceled**.
- **IT example:** after sprint 2 a team is 3% over budget — dropping one paid tool or trimming a little scope fixes it. If nobody looks until month 6, the gap is 35%, and the sponsor may simply cancel the project.
## The three basic quantities
| Acronym | Full name (slide) | Slide definition | Modern PMI name |
|---|---|---|---|
| BCWS | Budgeted cost for work scheduled | the budgeted amount of cost for work **scheduled** to be accomplished plus the amount or level of effort or apportioned effort scheduled to be accomplished in a given time period | PV, planned value |
| BCWP | Budget(ed) cost for work performed | the budgeted amount of cost for **completed** work, plus budgeted for level of effort or apportioned effort activity completed within a given time period; sometimes referred to as **"earned value"** | EV, earned value |
| ACWP | Actual cost for work performed | the amount reported as **actually expended** in completing the work accomplished within a given time period | AC, actual cost |
- **Level of effort** is support work measured by the passage of time (project management, DevOps on-call); **apportioned effort** is tied in proportion to another task (code review ≈ 15% of development). Both are counted in BCWS and BCWP. (Explanation beyond the slides.)
- The key idea: BCWP measures completed work **at its budgeted price**, not at what it actually cost. That is why it can be compared both with the plan (BCWS) and with the actual spend (ACWP).
> Memory hook: **S** = Scheduled (what *should* be done), **P** = Performed (what *is* done), **A** = Actual (what it *did* cost).
## Table 1 — The parameters for variance analysis
This slide is a picture (titled "Understanding Control"). Its content:
| Question | Answer | Acronym |
|---|---|---|
| How much work *should* be done? | Budgeted cost of work scheduled | BCWS |
| How much work *is* done? | Budgeted cost of work performed | BCWP |
| How much *did* the "is done" work cost? | Actual cost of work performed (actuals) | ACWP |
| What was the total job *supposed* to cost? | Budget at completion (total budget) | BAC |
| What do we *now* expect the total job to cost? | Estimate at completion or latest revised estimate | EAC, LRE |
@diagram pm4-evm-curves
## Variances: CV and SV
= CV = BCWP - ACWP
- A **negative** cost variance indicates a **cost-overrun condition**.
= SV = BCWP - BCWS
- A **negative** schedule variance indicates a **behind-schedule condition**.
> Memory hook: both variances **start with BCWP** (earned value). Cost → subtract the Actual; Schedule → subtract the Scheduled. Positive = good, negative = bad.
In the analysis of both cost and schedule, **costs are used as the lowest common denominator**: the schedule variance is given as a **function of cost** (dollars or hours, not days). To alleviate this problem, the variances are usually converted to **percentages**:
= CVP = CV / BCWP
= SVP = SV / BCWS
> Exam trap: CVP divides by **BCWP**, SVP divides by **BCWS** — not by ACWP and not by BAC. And SV = -$200 does not mean "200 days late": it is the value of the work that is behind.
## Performance indices: CPI and SPI
The slide calls these the formulas for "performance efficiency":
= CPI = BCWP / ACWP
= SPI = BCWP / BCWS
| Value | CPI (cost) | SPI (schedule) |
|---|---|---|
| = 1.0 | perfect cost performance | perfect schedule performance |
| < 1.0 | physical progress is accomplished at a **greater cost** than forecasted — **unfavorable** | physical progress at a **slower rate** than planned — **unfavorable** |
| > 1.0 | physical progress at **less than the forecasted cost** — **favorable** | physical progress at a **faster rate** than planned — **favorable** |
| If unfavorable, emphasis on | improving the **productivity** with which work is performed (burn rate) | improving the **timeliness** of the physical progress |
- **SPI and CPI** are expressed as **ratios compared to the performance factor of 1.0**, whereas **CV and SV** are expressed in **hours or dollars**.
- Like CV, CPI measures the **efficiency** with which physical progress was accomplished compared with the plan or baseline.
- Variances and indices always agree in direction: CV > 0 exactly when CPI > 1; SV < 0 exactly when SPI < 1.
> Exam trap: the slide says the indices measure efficiency "as a percentage of EV", but the formulas give **ratios** (0.8, 1.14). If an option says "CPI = 80%", read it as CPI = 0.80. CPI and SPI are never in dollars.
| CV / CPI | SV / SPI | Status |
|---|---|---|
| CV > 0, CPI > 1 | SV > 0, SPI > 1 | under budget, ahead of schedule |
| CV > 0, CPI > 1 | SV < 0, SPI < 1 | under budget, behind schedule (the slide example) |
| CV < 0, CPI < 1 | SV > 0, SPI > 1 | over budget, ahead of schedule |
| CV < 0, CPI < 1 | SV < 0, SPI < 1 | over budget and behind schedule |
## The slide example: BCWS = $1000, BCWP = $800, ACWP = $700
The units here are dollars; they could just as easily have been **hours, days, or weeks**.
= CV = 800 - 700 = +100
= SV = 800 - 1000 = -200
= CVP = 100 / 800 = +12.5%
= SVP = -200 / 1000 = -20%
= CPI = 800 / 700 = 1.14
= SPI = 800 / 1000 = 0.80
- **CV = +$100:** physical progress was accomplished at a **lower cost than forecasted** — favorable. Had CV been negative, progress would have cost more than forecasted; if CV = 0, the physical accomplishment was as budgeted.
- Although CV is measured in hours or dollars, it is actually a **measurement of efficiency**. To correct a negative CV, emphasis should be placed on the **productivity rate (i.e., burn rate)**.
- **SV = -$200:** physical progress is accomplished at a **slower rate than planned** — unfavorable. Positive SV = faster than planned; SV = 0 = as planned.
> Verdict: the slide example is **under budget but behind schedule**.
## Forecasting: BAC, EAC, VAC and the new length
The difficulty in performing variance analysis is the calculation of **BCWP**, because one must predict the **percent complete**. The simplest formula:
= BCWP = (% complete) x BAC
To complete the status analysis we need the **budget at completion (BAC)** — the total budget — and the **estimate at completion (EAC)** — what we now expect the total job to cost.
= EAC = (ACWP / BCWP) x BAC = BAC / CPI
= VAC = BAC - EAC
= New project length = original project length / SPI
- **VAC < 0:** the project is expected to finish **over budget**; VAC > 0: under budget.
- EAC assumes the current cost efficiency (CPI) continues to the end; the new length assumes the current schedule efficiency (SPI) continues.
> Exam trap: the slide labels EAC "the estimated cost-to-complete (EAC) ratio". EAC is the estimate **at** completion — the **total** expected cost. The money still needed to finish (estimate to complete, ETC) would be EAC - ACWP; ETC is not on the slides.
## Worked example 2: mobile banking app (over budget, behind schedule)
BAC = 200,000 USD, planned length 10 months. By the end of month 4 the plan said 40% done; the team has actually finished 30%, and 75,000 USD has been spent.
= BCWS = 0.40 x 200,000 = 80,000
= BCWP = 0.30 x 200,000 = 60,000
= ACWP = 75,000
= CV = 60,000 - 75,000 = -15,000
= SV = 60,000 - 80,000 = -20,000
= CPI = 60,000 / 75,000 = 0.80
= SPI = 60,000 / 80,000 = 0.75
= EAC = 200,000 / 0.80 = 250,000
= VAC = 200,000 - 250,000 = -50,000
= New length = 10 / 0.75 = 13.3 months
- **Status:** over budget **and** behind schedule. Each dollar of budget buys only 80 cents of work, and work is progressing at 75% of the planned rate.
- **Actions:** for CPI, raise productivity (fix the flaky CI pipeline, stop context switching); for SPI, improve timeliness (unblock the API dependency, add a tester on the critical path).
## Worked example 3: CRM migration in hours (under budget, ahead of schedule)
BAC = 1,000 hours, original length 20 weeks. At the status date: BCWS = 500 h, BCWP = 550 h, ACWP = 500 h.
= CV = 550 - 500 = +50 h
= SV = 550 - 500 = +50 h
= CPI = 550 / 500 = 1.10
= SPI = 550 / 500 = 1.10
= EAC = 1,000 / 1.10 = 909 h
= VAC = 1,000 - 909 = +91 h
= New length = 20 / 1.10 = 18.2 weeks
- **Status:** favorable on both. CV and SV are both +50 here only by coincidence (BCWS = ACWP); they answer different questions.
## Worked example 4: overtime sprint (over budget, ahead of schedule)
BAC = 120,000 USD, length 12 months. BCWS = 40,000; BCWP = 50,000; ACWP = 62,500 — the team paid for overtime and extra contractors.
= CV = 50,000 - 62,500 = -12,500
= SV = 50,000 - 40,000 = +10,000
= CPI = 50,000 / 62,500 = 0.80
= SPI = 50,000 / 40,000 = 1.25
= EAC = 120,000 / 0.80 = 150,000
= VAC = 120,000 - 150,000 = -30,000
= New length = 12 / 1.25 = 9.6 months
- **Status:** ahead of schedule but over budget — speed was bought with money. A typical exam question gives exactly such mixed signs.
?? CV = -$3,000 and SPI = 1.05. Is the project over budget? Behind schedule?
?= Over budget (negative CV, a cost-overrun condition) but slightly ahead of schedule (SPI above 1.0, faster than planned).
?? BAC = $80,000 and CPI = 0.8. What are EAC and VAC?
?= EAC = 80,000 / 0.8 = $100,000; VAC = 80,000 - 100,000 = -$20,000, so the project is expected to finish $20,000 over budget.
?? Why does the lecture recommend using the EVMS continuously rather than only at milestones?
?= It is an early warning system: small variances are caught early, when they are easier to correct; large variances are hard to fix and may lead management to cancel the project.
## Exam focus
- Definitions of **BCWS, BCWP (earned value), ACWP** and the five rows of **Table 1** (BCWS, BCWP, ACWP, BAC, EAC/LRE).
- Formulas: **CV = BCWP - ACWP, SV = BCWP - BCWS, CVP = CV/BCWP, SVP = SV/BCWS, CPI = BCWP/ACWP, SPI = BCWP/BCWS, BCWP = % complete x BAC, EAC = BAC/CPI, VAC = BAC - EAC, new length = original/SPI**.
- Signs: negative CV = cost overrun, negative SV = behind schedule; CPI/SPI < 1 unfavorable, = 1 perfect, > 1 favorable.
- Units: CV and SV in hours or dollars; CPI and SPI are ratios against 1.0.
- Corrective focus: CV/CPI → productivity (burn rate); SV/SPI → timeliness of physical progress.
- The slide example 1000/800/700: CV = +100, SV = -200 → under budget, behind schedule.
- EVMS: prevention over cures, an early warning system, small variances are easier to correct, large ones risk cancellation.`,
    ru: `## Управление освоенным объёмом: что это и зачем
> **Управление освоенным объёмом (earned value management, EVM)** — систематический процесс, который использует **освоенный объём (earned value)** как главный инструмент **интеграции управления затратами, сроками, техническим выполнением и рисками (cost, schedule, technical performance management, and risk management)**.
- **EVMS** (Earned Value Measurement System — система измерения освоенного объёма) ставит **профилактику выше лечения (prevention over cures)**: проблемы выявляют и решают рано.
- EVMS — **система раннего предупреждения (early warning system)**: она позволяет рано заметить **тренды и отклонения от плана (trends and variances from the plan)**.
- Она даёт менеджеру проекта **достаточно времени, чтобы корректировать курс небольшими шагами (course corrections in small increments)**. Обычно **малые отклонения исправить легче**, чем большие.
- Поэтому EVMS нужно применять **непрерывно на протяжении всего проекта**, чтобы ловить отклонения, пока они малы и, возможно, легко исправимы.
- **Большие отклонения** исправить труднее, и есть риск, что стоимость их исправления **настолько не понравится руководству, что проект могут закрыть (canceled)**.
- **Пример из IT:** после второго спринта команда на 3% выше бюджета — достаточно отказаться от одного платного инструмента или чуть урезать объём. Если до шестого месяца никто не смотрит, разрыв уже 35%, и спонсор может просто закрыть проект.
## Три базовые величины
| Аббревиатура | Полное название (слайд) | Определение со слайда | Современное название PMI |
|---|---|---|---|
| BCWS | Budgeted cost for work scheduled — плановая стоимость запланированных работ | бюджетная стоимость работ, **запланированных** к выполнению, плюс объём работ типа level of effort или apportioned effort, запланированных к выполнению за данный период | PV, planned value (плановый объём) |
| BCWP | Budget(ed) cost for work performed — плановая стоимость выполненных работ | бюджетная стоимость **завершённых** работ плюс бюджет на работы типа level of effort или apportioned effort, завершённые за данный период; иногда её называют **«освоенным объёмом» (earned value)** | EV, earned value (освоенный объём) |
| ACWP | Actual cost for work performed — фактическая стоимость выполненных работ | сумма, отражённая как **фактически потраченная** на выполнение сделанной за данный период работы | AC, actual cost (фактическая стоимость) |
- **Level of effort** — вспомогательная работа, которая измеряется течением времени (управление проектом, дежурства DevOps); **apportioned effort** — работа, пропорционально привязанная к другой задаче (код-ревью ≈ 15% от разработки). Обе учитываются в BCWS и BCWP. (Пояснение сверх слайдов.)
- Главная идея: BCWP оценивает выполненную работу **по её плановой цене**, а не по тому, сколько она стоила на деле. Поэтому её можно сравнивать и с планом (BCWS), и с фактическими тратами (ACWP).
> Как запомнить: **S** = Scheduled (что *должно* быть сделано), **P** = Performed (что *сделано*), **A** = Actual (сколько это *стоило* на деле).
## Таблица 1 — Параметры анализа отклонений (Table 1. The Parameters For Variance Analysis)
Этот слайд — картинка (с заголовком «Understanding Control»). Его содержание:
| Вопрос | Ответ | Аббревиатура |
|---|---|---|
| How much work *should* be done? — сколько работы *должно* быть сделано? | Budgeted cost of work scheduled | BCWS |
| How much work *is* done? — сколько работы *сделано*? | Budgeted cost of work performed | BCWP |
| How much *did* the "is done" work cost? — сколько *стоила* сделанная работа? | Actual cost of work performed (actuals) | ACWP |
| What was the total job *supposed* to cost? — сколько *должна была* стоить вся работа? | Budget at completion (total budget) — бюджет по завершении | BAC |
| What do we *now* expect the total job to cost? — сколько, по *нынешним* ожиданиям, будет стоить вся работа? | Estimate at completion or latest revised estimate — оценка по завершении, или последняя пересмотренная оценка | EAC, LRE |
@diagram pm4-evm-curves
## Отклонения: CV и SV
= CV = BCWP - ACWP
- **Отрицательное** отклонение по стоимости (cost variance) означает **перерасход (cost-overrun condition)**.
= SV = BCWP - BCWS
- **Отрицательное** отклонение по срокам (schedule variance) означает **отставание от графика (behind-schedule condition)**.
> Как запомнить: оба отклонения **начинаются с BCWP** (освоенный объём). Cost — вычитаем Actual; Schedule — вычитаем Scheduled. Плюс — хорошо, минус — плохо.
При анализе и затрат, и сроков **затраты служат наименьшим общим знаменателем (lowest common denominator)**: отклонение по срокам выражено **через стоимость** (в долларах или часах, а не в днях). Чтобы смягчить эту проблему, отклонения обычно переводят в **проценты**:
= CVP = CV / BCWP
= SVP = SV / BCWS
> Ловушка экзамена: CVP делят на **BCWP**, SVP — на **BCWS**, а не на ACWP и не на BAC. И SV = -$200 не значит «опоздали на 200 дней»: это стоимость работы, которая отстаёт.
## Индексы выполнения: CPI и SPI
Слайд называет их формулами «эффективности выполнения (performance efficiency)»:
= CPI = BCWP / ACWP
= SPI = BCWP / BCWS
| Значение | CPI — индекс выполнения стоимости (cost performance index) | SPI — индекс выполнения сроков (schedule performance index) |
|---|---|---|
| = 1.0 | идеальное выполнение по стоимости (perfect cost performance) | идеальное выполнение по срокам (perfect schedule performance) |
| < 1.0 | физический прогресс достигается **дороже**, чем прогнозировалось, — **неблагоприятно (unfavorable)** | физический прогресс идёт **медленнее**, чем планировалось, — **неблагоприятно** |
| > 1.0 | физический прогресс достигается **дешевле прогноза** — **благоприятно (favorable)** | физический прогресс идёт **быстрее** плана — **благоприятно** |
| Если неблагоприятно, упор на | повышение **производительности (productivity)**, с которой выполняется работа (burn rate) | повышение **своевременности (timeliness)** физического прогресса |
- **SPI и CPI** выражаются как **отношения, сравниваемые с коэффициентом 1.0 (performance factor of 1.0)**, а **CV и SV** — в **часах или долларах**.
- Как и CV, CPI измеряет **эффективность**, с которой достигнут физический прогресс, по сравнению с планом или базовой линией (baseline).
- Отклонения и индексы всегда согласованы по направлению: CV > 0 ровно тогда, когда CPI > 1; SV < 0 ровно тогда, когда SPI < 1.
> Ловушка экзамена: слайд говорит, что индексы измеряют эффективность «as a percentage of EV», но формулы дают **отношения** (0.8, 1.14). Если в варианте написано «CPI = 80%», читайте это как CPI = 0.80. В долларах CPI и SPI не бывают никогда.
| CV / CPI | SV / SPI | Состояние |
|---|---|---|
| CV > 0, CPI > 1 | SV > 0, SPI > 1 | ниже бюджета, с опережением графика |
| CV > 0, CPI > 1 | SV < 0, SPI < 1 | ниже бюджета, с отставанием от графика (пример со слайда) |
| CV < 0, CPI < 1 | SV > 0, SPI > 1 | перерасход, но опережение графика |
| CV < 0, CPI < 1 | SV < 0, SPI < 1 | перерасход и отставание (over budget and behind schedule) |
## Пример со слайда: BCWS = $1000, BCWP = $800, ACWP = $700
Единицы здесь — доллары; с тем же успехом это могли быть **часы, дни или недели**.
= CV = 800 - 700 = +100
= SV = 800 - 1000 = -200
= CVP = 100 / 800 = +12.5%
= SVP = -200 / 1000 = -20%
= CPI = 800 / 700 = 1.14
= SPI = 800 / 1000 = 0.80
- **CV = +$100:** физический прогресс достигнут **дешевле прогноза** — благоприятно. Будь CV отрицательным, прогресс обошёлся бы дороже прогноза; при CV = 0 выполнение точно по бюджету.
- Хотя CV измеряется в часах или долларах, на деле это **мера эффективности**. Чтобы исправить отрицательный CV, упор делают на **темп производительности (productivity rate, т. е. burn rate)**.
- **SV = -$200:** физический прогресс идёт **медленнее плана** — неблагоприятно. Положительный SV — быстрее плана; SV = 0 — по плану.
> Вывод: в примере со слайда проект **ниже бюджета, но отстаёт от графика**.
## Прогноз: BAC, EAC, VAC и новый срок
Трудность анализа отклонений — расчёт **BCWP**, потому что нужно оценить **процент выполнения (percent complete)**. Простейшая формула:
= BCWP = (% complete) x BAC
Чтобы завершить анализ состояния, нужны **бюджет по завершении (budget at completion, BAC)** — весь бюджет — и **оценка по завершении (estimate at completion, EAC)** — сколько, по нынешним ожиданиям, будет стоить вся работа.
= EAC = (ACWP / BCWP) x BAC = BAC / CPI
= VAC = BAC - EAC
= New project length = original project length / SPI
- **VAC < 0 (отклонение по завершении, variance at completion):** проект, по прогнозу, закончится **с перерасходом**; VAC > 0 — с экономией.
- EAC предполагает, что нынешняя эффективность по стоимости (CPI) сохранится до конца; новый срок — что сохранится нынешняя эффективность по срокам (SPI).
> Ловушка экзамена: на слайде EAC подписан как «the estimated cost-to-complete (EAC) ratio». EAC — оценка **по** завершении, то есть **вся** ожидаемая стоимость. Деньги, которые ещё нужны до конца (estimate to complete, ETC), — это EAC - ACWP; ETC на слайдах нет.
## Пример 2: мобильный банк (перерасход и отставание)
BAC = 200 000 USD, плановая длительность 10 месяцев. К концу 4-го месяца по плану должно быть готово 40%, на деле готово 30%, потрачено 75 000 USD.
= BCWS = 0.40 x 200,000 = 80,000
= BCWP = 0.30 x 200,000 = 60,000
= ACWP = 75,000
= CV = 60,000 - 75,000 = -15,000
= SV = 60,000 - 80,000 = -20,000
= CPI = 60,000 / 75,000 = 0.80
= SPI = 60,000 / 80,000 = 0.75
= EAC = 200,000 / 0.80 = 250,000
= VAC = 200,000 - 250,000 = -50,000
= New length = 10 / 0.75 = 13.3 months
- **Состояние:** перерасход **и** отставание. Каждый доллар бюджета покупает лишь 80 центов работы, а работа идёт со скоростью 75% от плановой.
- **Что делать:** для CPI — поднять производительность (починить нестабильный CI-пайплайн, перестать дёргать людей между задачами); для SPI — улучшить своевременность (снять блокировку по API, добавить тестировщика на критический путь).
## Пример 3: миграция CRM в часах (экономия и опережение)
BAC = 1 000 часов, исходная длительность 20 недель. На дату статуса: BCWS = 500 ч, BCWP = 550 ч, ACWP = 500 ч.
= CV = 550 - 500 = +50 h
= SV = 550 - 500 = +50 h
= CPI = 550 / 500 = 1.10
= SPI = 550 / 500 = 1.10
= EAC = 1,000 / 1.10 = 909 h
= VAC = 1,000 - 909 = +91 h
= New length = 20 / 1.10 = 18.2 weeks
- **Состояние:** благоприятно по обоим показателям. CV и SV здесь оба +50 лишь по совпадению (BCWS = ACWP); отвечают они на разные вопросы.
## Пример 4: спринт со сверхурочными (перерасход, но опережение)
BAC = 120 000 USD, длительность 12 месяцев. BCWS = 40 000; BCWP = 50 000; ACWP = 62 500 — команда платила за сверхурочные и дополнительных подрядчиков.
= CV = 50,000 - 62,500 = -12,500
= SV = 50,000 - 40,000 = +10,000
= CPI = 50,000 / 62,500 = 0.80
= SPI = 50,000 / 40,000 = 1.25
= EAC = 120,000 / 0.80 = 150,000
= VAC = 120,000 - 150,000 = -30,000
= New length = 12 / 1.25 = 9.6 months
- **Состояние:** опережение графика, но перерасход — скорость купили деньгами. Типичный экзаменационный вопрос даёт именно такие разные знаки.
?? CV = -$3 000, SPI = 1.05. Проект выше бюджета? Отстаёт от графика?
?= Выше бюджета (CV отрицательный — перерасход), но немного опережает график (SPI больше 1.0 — быстрее плана).
?? BAC = $80 000, CPI = 0.8. Чему равны EAC и VAC?
?= EAC = 80 000 / 0.8 = $100 000; VAC = 80 000 - 100 000 = -$20 000: проект, по прогнозу, закончится с перерасходом $20 000.
?? Почему лекция советует применять EVMS непрерывно, а не только на вехах?
?= Это система раннего предупреждения: малые отклонения ловятся рано, когда их легче исправить; большие исправить трудно, и руководство может закрыть проект.
## Что спросят на экзамене (Exam focus)
- Определения **BCWS, BCWP (освоенный объём, earned value), ACWP** и пять строк **таблицы 1** (BCWS, BCWP, ACWP, BAC, EAC/LRE).
- Формулы: **CV = BCWP - ACWP, SV = BCWP - BCWS, CVP = CV/BCWP, SVP = SV/BCWS, CPI = BCWP/ACWP, SPI = BCWP/BCWS, BCWP = % complete x BAC, EAC = BAC/CPI, VAC = BAC - EAC, new length = original/SPI**.
- Знаки: отрицательный CV — перерасход, отрицательный SV — отставание; CPI/SPI < 1 — неблагоприятно, = 1 — идеально, > 1 — благоприятно.
- Единицы: CV и SV — в часах или долларах; CPI и SPI — отношения относительно 1.0.
- На что делать упор: CV/CPI → производительность (burn rate); SV/SPI → своевременность физического прогресса.
- Пример со слайда 1000/800/700: CV = +100, SV = -200 → ниже бюджета, но с отставанием.
- EVMS: профилактика выше лечения, система раннего предупреждения, малые отклонения исправить легче, большие грозят закрытием проекта.`,
  },
  [
    qx("According to the lecture, earned value management (EVM) uses earned value as the primary tool for integrating which areas?", "Cost, schedule, technical performance and risk management", [
      ["Scope, quality, procurement and stakeholder engagement plans", "These are other management areas; the slide names cost, schedule, technical performance management and risk management.", "Это другие области управления; слайд называет затраты, сроки, техническое выполнение и риски."],
      ["Cost estimating, cost accounting and the company's cash flow", "These are elements of good cost management from the first part of the lecture, not what EVM integrates.", "Это составляющие хорошего управления затратами из первой части лекции, а не то, что интегрирует EVM."],
      ["Group norms, roles, cohesiveness and team leadership", "These are group characteristics from the second half of the lecture, unrelated to EVM.", "Это характеристики групп из второй половины лекции, к EVM они не относятся."],
    ], "Slide: EVM is a systematic process that uses earned value as the primary tool for integrating cost, schedule, technical performance management, and risk management.", "Слайд: EVM — систематический процесс, использующий освоенный объём как главный инструмент интеграции управления затратами, сроками, техническим выполнением и рисками."),
    qx("The EVMS is said to emphasize which principle?", "Prevention over cures, by resolving problems early", [
      ["Cures over prevention, by fixing problems at closure", "This reverses the slide: the EVMS identifies and resolves problems early, before they need a cure.", "Это переворачивает слайд: EVMS выявляет и решает проблемы рано, до того как понадобится «лечение»."],
      ["Large corrections made once, at the end of each phase", "The slide favours course corrections in small increments, because small variances are easier to correct.", "Слайд за корректировки небольшими шагами, потому что малые отклонения исправить легче."],
      ["Cost over schedule, since cost is the common denominator", "Cost is the lowest common denominator for expressing variances, but the EVMS integrates cost and schedule; its principle is prevention over cures.", "Затраты — общий знаменатель для выражения отклонений, но EVMS объединяет затраты и сроки; её принцип — профилактика выше лечения."],
    ], "Slide: the EVMS emphasizes prevention over cures by identifying and resolving problems early; it is an early warning system.", "Слайд: EVMS ставит профилактику выше лечения, выявляя и решая проблемы рано; это система раннего предупреждения."),
    qx("Why should the EVMS be used continuously throughout the project?", "To detect variances while they are small and easier to correct", [
      ["Because large variances are easier to correct than small ones", "The opposite: small variances are easier to correct, large ones are harder and may get the project canceled.", "Наоборот: малые отклонения исправить легче, большие — труднее, и проект могут закрыть."],
      ["To replace periodic reestimation of the remaining work", "Reestimation is a separate requirement of an effective control system; the EVMS does not replace it.", "Переоценка — отдельное требование к эффективной системе контроля; EVMS её не заменяет."],
      ["Because management needs a report only at project completion", "If reporting happened only at completion, nothing could be corrected; the point of the EVMS is early warning.", "Если отчитываться только в конце, исправить уже ничего нельзя; смысл EVMS — раннее предупреждение."],
    ], "Slide: the EVMS should be used continuously to detect variances while they are small and possibly easy to correct; large variances may displease management to the point of cancellation.", "Слайд: EVMS применяют непрерывно, чтобы ловить отклонения, пока они малы и, возможно, легко исправимы; большие отклонения могут так не понравиться руководству, что проект закроют."),
    qx("Which quantity does the lecture say is sometimes referred to as \"earned value\"?", "BCWP", [
      ["BCWS", "BCWS is the budgeted cost for work scheduled — the plan (planned value), not what has been earned.", "BCWS — плановая стоимость запланированных работ, то есть план (planned value), а не освоенное."],
      ["ACWP", "ACWP is the actual cost — what was really spent, not the value earned.", "ACWP — фактическая стоимость, то есть реально потраченное, а не освоенный объём."],
      ["BAC", "BAC is the budget at completion — the total budget for the whole job.", "BAC — бюджет по завершении, весь бюджет на всю работу."],
    ], "Slide: BCWP, the budgeted cost for work performed, is sometimes referred to as \"earned value\" (EV in modern terms).", "Слайд: BCWP — плановая стоимость выполненных работ — иногда называют «освоенным объёмом» (earned value, в современной терминологии EV)."),
    qx("Which definition matches BCWS?", "Budgeted cost of the work scheduled to be accomplished in a period", [
      ["Budgeted cost of the work actually completed within a given period", "That is BCWP (earned value): the budget of the work completed, not scheduled.", "Это BCWP (освоенный объём): бюджет выполненной работы, а не запланированной."],
      ["Amount reported as actually expended on the work accomplished", "That is ACWP, the actual cost.", "Это ACWP — фактическая стоимость."],
      ["Total budget for the whole job, also called the budget at completion", "That is BAC, the budget at completion.", "Это BAC — бюджет по завершении."],
    ], "Slide: BCWS is the budgeted amount of cost for work scheduled to be accomplished (plus level of effort or apportioned effort) in a given time period.", "Слайд: BCWS — бюджетная стоимость работ, запланированных к выполнению (плюс level of effort или apportioned effort) за данный период."),
    qx("In Table 1 \"Parameters for variance analysis\", which parameter answers \"What do we now expect the total job to cost?\"", "EAC, the estimate at completion", [
      ["BAC, the budget at completion", "BAC answers \"What was the total job supposed to cost?\" — the original total budget.", "BAC отвечает на вопрос «сколько должна была стоить вся работа?» — это исходный общий бюджет."],
      ["BCWS, the budgeted cost of work scheduled", "BCWS answers \"How much work should be done?\"", "BCWS отвечает на вопрос «сколько работы должно быть сделано?»."],
      ["VAC, the variance at completion", "VAC = BAC - EAC is computed from EAC; it is not a row of Table 1.", "VAC = BAC - EAC вычисляют из EAC; строкой таблицы 1 он не является."],
    ], "Table 1 (picture only): \"What do we now expect the total job to cost?\" — Estimate at completion or latest revised estimate (EAC, LRE).", "Таблица 1 (только картинка): «What do we now expect the total job to cost?» — оценка по завершении, или последняя пересмотренная оценка (EAC, LRE)."),
    qx("A web project reports BCWS = $60,000, BCWP = $45,000 and ACWP = $50,000. What is the cost variance (CV)?", "-$5,000", [
      ["+$5,000", "This is ACWP - BCWP — the subtraction is reversed. CV = BCWP - ACWP = 45,000 - 50,000.", "Это ACWP - BCWP — вычитание перевёрнуто. CV = BCWP - ACWP = 45 000 - 50 000."],
      ["-$15,000", "-15,000 is the schedule variance: BCWP - BCWS = 45,000 - 60,000.", "-15 000 — это отклонение по срокам: BCWP - BCWS = 45 000 - 60 000."],
      ["+$10,000", "This is BCWS - ACWP, which mixes the plan with actual cost; CV always starts from BCWP.", "Это BCWS - ACWP — смесь плана и факта; CV всегда начинается с BCWP."],
    ], "CV = BCWP - ACWP = 45,000 - 50,000 = -5,000. A negative CV indicates a cost-overrun condition.", "CV = BCWP - ACWP = 45 000 - 50 000 = -5 000. Отрицательный CV означает перерасход."),
    qx("At the status date, BCWS = 120 hours, BCWP = 100 hours and ACWP = 90 hours. What is the schedule variance (SV)?", "-20 hours", [
      ["+10 hours", "+10 is the cost variance: BCWP - ACWP = 100 - 90.", "+10 — это отклонение по стоимости: BCWP - ACWP = 100 - 90."],
      ["+20 hours", "This is BCWS - BCWP — the subtraction is reversed.", "Это BCWS - BCWP — вычитание перевёрнуто."],
      ["-30 hours", "This is ACWP - BCWS, which does not involve earned value at all.", "Это ACWP - BCWS — здесь освоенный объём вообще не участвует."],
    ], "SV = BCWP - BCWS = 100 - 120 = -20 hours: a behind-schedule condition. Variances can be in hours just as well as in dollars.", "SV = BCWP - BCWS = 100 - 120 = -20 часов: отставание от графика. Отклонения могут быть в часах так же, как в долларах."),
    qx("A project has BCWS = $90,000, BCWP = $80,000 and ACWP = $100,000. What is its CPI, and what does it mean?", "0.80: progress is costing more than forecasted", [
      ["1.25: progress is costing less than forecasted", "1.25 = ACWP / BCWP — the ratio is inverted. CPI = BCWP / ACWP.", "1.25 = ACWP / BCWP — отношение перевёрнуто. CPI = BCWP / ACWP."],
      ["0.89: physical progress is slower than planned", "0.89 = BCWP / BCWS — that is the SPI, which measures schedule, not cost.", "0.89 = BCWP / BCWS — это SPI, он измеряет сроки, а не стоимость."],
      ["0.90: progress is costing more than forecasted", "0.90 = BCWS / ACWP, which mixes the plan with the actuals; CPI uses BCWP.", "0.90 = BCWS / ACWP — смесь плана и факта; в CPI участвует BCWP."],
    ], "CPI = BCWP / ACWP = 80,000 / 100,000 = 0.80. CPI < 1.0: physical progress is accomplished at a greater cost than forecasted — unfavorable.", "CPI = BCWP / ACWP = 80 000 / 100 000 = 0.80. CPI < 1.0: физический прогресс достигается дороже прогноза — неблагоприятно."),
    qx("BCWS = $50,000, BCWP = $45,000 and ACWP = $36,000. Which pair of indices is correct?", "CPI = 1.25, SPI = 0.90", [
      ["CPI = 0.80, SPI = 1.11", "Both ratios are inverted (ACWP/BCWP and BCWS/BCWP).", "Оба отношения перевёрнуты (ACWP/BCWP и BCWS/BCWP)."],
      ["CPI = 0.90, SPI = 1.25", "The two indices are swapped: 0.90 is the SPI and 1.25 is the CPI.", "Индексы перепутаны местами: 0.90 — это SPI, а 1.25 — CPI."],
      ["CPI = 1.25, SPI = 1.11", "The CPI is right, but the SPI is inverted (BCWS/BCWP).", "CPI верный, но SPI перевёрнут (BCWS/BCWP)."],
    ], "CPI = 45,000 / 36,000 = 1.25 (under the forecasted cost); SPI = 45,000 / 50,000 = 0.90 (slower than planned).", "CPI = 45 000 / 36 000 = 1.25 (дешевле прогноза); SPI = 45 000 / 50 000 = 0.90 (медленнее плана)."),
    qx("BAC = $240,000, BCWP = $60,000 and ACWP = $80,000. Using EAC = (ACWP / BCWP) × BAC, what is the EAC?", "$320,000", [
      ["$180,000", "This is (BCWP / ACWP) × BAC = BAC × CPI — the ratio is inverted.", "Это (BCWP / ACWP) × BAC = BAC × CPI — отношение перевёрнуто."],
      ["$260,000", "This adds only the overrun so far (BAC + 20,000) and assumes the rest goes to plan — not the slide's formula.", "Здесь к BAC прибавлен лишь уже случившийся перерасход (+20 000), а остальное считается по плану — это не формула слайда."],
      ["$160,000", "This is BAC - ACWP, the budget left unspent, not the estimate at completion.", "Это BAC - ACWP — неизрасходованный остаток бюджета, а не оценка по завершении."],
    ], "EAC = (80,000 / 60,000) × 240,000 = 320,000; equivalently CPI = 0.75 and EAC = BAC / CPI = 240,000 / 0.75.", "EAC = (80 000 / 60 000) × 240 000 = 320 000; то же самое: CPI = 0.75 и EAC = BAC / CPI = 240 000 / 0.75."),
    qx("A project has BAC = $500,000 and EAC = $560,000. What is the VAC, and what does it indicate?", "-$60,000: expected to finish over budget", [
      ["+$60,000: expected to finish under budget", "This is EAC - BAC — the subtraction is reversed. VAC = BAC - EAC.", "Это EAC - BAC — вычитание перевёрнуто. VAC = BAC - EAC."],
      ["-$60,000: expected to finish behind schedule", "VAC compares budgets in money; it says nothing about the schedule.", "VAC сравнивает бюджеты в деньгах; о сроках он ничего не говорит."],
      ["+$60,000: expected to finish ahead of schedule", "Both the sign and the meaning are wrong: VAC is negative here, and it is about cost.", "Неверны и знак, и смысл: VAC здесь отрицательный и говорит о стоимости."],
    ], "VAC = BAC - EAC = 500,000 - 560,000 = -60,000: the job is now expected to cost $60,000 more than budgeted.", "VAC = BAC - EAC = 500 000 - 560 000 = -60 000: работа, по нынешней оценке, обойдётся на $60 000 дороже бюджета."),
    qx("A project was planned to last 12 months, and its SPI is 0.80. Using the lecture's formula, what is the new project length?", "15 months", [
      ["9.6 months", "12 × 0.80 — multiplied instead of divided; SPI < 1 must make the project longer, not shorter.", "12 × 0.80 — умножили вместо деления; при SPI < 1 проект должен удлиниться, а не сократиться."],
      ["14.4 months", "12 × 1.2 adds 20% instead of dividing by the SPI; 12 / 0.8 is 15.", "12 × 1.2 добавляет 20% вместо деления на SPI; 12 / 0.8 = 15."],
      ["12 months", "Unchanged length ignores the SPI; SPI < 1 means progress is slower than planned.", "Неизменный срок игнорирует SPI; SPI < 1 значит, что работа идёт медленнее плана."],
    ], "New project length = original project length / SPI = 12 / 0.80 = 15 months.", "New project length = original project length / SPI = 12 / 0.80 = 15 месяцев."),
    qx("A data-platform project has BAC = $400,000. It is 35% complete, and $160,000 has been spent. What is BCWP?", "$140,000", [
      ["$160,000", "$160,000 is the ACWP — what was spent, not what was earned.", "$160 000 — это ACWP, то есть потраченное, а не освоенное."],
      ["$260,000", "$260,000 is 65% of BAC — the budgeted value of the work still remaining.", "$260 000 — 65% от BAC, плановая стоимость ещё не выполненной работы."],
      ["-$20,000", "-$20,000 is the CV (140,000 - 160,000), not the BCWP.", "-$20 000 — это CV (140 000 - 160 000), а не BCWP."],
    ], "BCWP = (% complete) × BAC = 0.35 × 400,000 = 140,000. The slide notes that predicting percent complete is the difficult part.", "BCWP = (% complete) × BAC = 0.35 × 400 000 = 140 000. Слайд отмечает, что трудность — оценить процент выполнения."),
    qx("A project reports CPI = 1.20 and SPI = 0.85. What is its status?", "Under budget and behind schedule", [
      ["Over budget and behind schedule", "CPI above 1.0 is favorable: work costs less than forecasted, so the project is not over budget.", "CPI больше 1.0 — благоприятно: работа дешевле прогноза, перерасхода нет."],
      ["Under budget and ahead of schedule", "SPI below 1.0 means physical progress is slower than planned.", "SPI меньше 1.0 значит, что физический прогресс медленнее плана."],
      ["Over budget and ahead of schedule", "Both are reversed: CPI > 1 means under budget, SPI < 1 means behind schedule.", "Перевёрнуто и то и другое: CPI > 1 — ниже бюджета, SPI < 1 — отставание."],
    ], "CPI = 1.20 > 1.0 → under the forecasted cost (favorable); SPI = 0.85 < 1.0 → slower than planned (unfavorable).", "CPI = 1.20 > 1.0 → дешевле прогноза (благоприятно); SPI = 0.85 < 1.0 → медленнее плана (неблагоприятно)."),
    qx("A status report shows CV = -$8,000 and SV = -$12,000. Which description is correct?", "A cost-overrun condition and a behind-schedule condition", [
      ["Favorable cost performance, but a behind-schedule condition", "A negative CV is unfavorable — a cost-overrun condition.", "Отрицательный CV неблагоприятен — это перерасход."],
      ["A cost-overrun condition, but faster progress than planned", "A negative SV means slower progress than planned, not faster.", "Отрицательный SV значит прогресс медленнее плана, а не быстрее."],
      ["Favorable on both, since negative variances mean savings", "Negative variances are unfavorable for both cost and schedule.", "Отрицательные отклонения неблагоприятны и по стоимости, и по срокам."],
    ], "Slide: a negative CV indicates a cost-overrun condition; a negative SV indicates a behind-schedule condition — over budget and behind schedule.", "Слайд: отрицательный CV означает перерасход, отрицательный SV — отставание от графика; проект выше бюджета и отстаёт."),
    qx("CV = -$4,000, BCWP = $40,000 and BCWS = $50,000. What is the cost variance percentage (CVP)?", "-10%", [
      ["-8%", "This divides CV by BCWS; CVP divides by BCWP.", "Здесь CV поделили на BCWS; CVP делят на BCWP."],
      ["+10%", "The sign is lost: CV is negative, so CVP is negative too.", "Потерян знак: CV отрицательный, значит и CVP отрицательный."],
      ["-20%", "-20% is the SVP: SV = 40,000 - 50,000 = -10,000, divided by BCWS = 50,000.", "-20% — это SVP: SV = 40 000 - 50 000 = -10 000, делённое на BCWS = 50 000."],
    ], "CVP = CV / BCWP = -4,000 / 40,000 = -10%.", "CVP = CV / BCWP = -4 000 / 40 000 = -10%."),
    qx("According to the lecture, where should emphasis be placed to correct an unfavorable SPI?", "Improving the timeliness of the physical progress", [
      ["Improving the productivity rate, i.e. the burn rate", "Productivity (burn rate) is the slide's remedy for a negative CV or an unfavorable CPI.", "Производительность (burn rate) — рецепт слайда для отрицательного CV или неблагоприятного CPI."],
      ["Increasing the management reserve of the project", "The management reserve is a budget item; it does not make progress more timely.", "Управленческий резерв — статья бюджета; своевременности прогресса он не добавляет."],
      ["Reducing the project's budget at completion", "Cutting BAC changes the baseline and fixes nothing in the schedule.", "Урезание BAC меняет базовую линию и ничего не исправляет в графике."],
    ], "Slide: for an unfavorable value of SPI, emphasis should be placed upon improving the timeliness of the physical progress.", "Слайд: при неблагоприятном SPI упор делают на повышение своевременности физического прогресса."),
    tfx("CV and SV are ratios compared with a performance factor of 1.0, while CPI and SPI are expressed in hours or dollars.", false,
      "It is the other way round: SPI and CPI are ratios compared to the performance factor of 1.0, whereas CV and SV are expressed in hours or dollars.",
      "Всё наоборот: SPI и CPI — отношения относительно коэффициента 1.0, а CV и SV выражаются в часах или долларах.",
      "\"True\" swaps the units: a variance is a difference (BCWP minus something), so it keeps the units of money or hours; an index is a quotient.",
      "«Верно» путает единицы: отклонение — разность (BCWP минус что-то), поэтому оно в деньгах или часах; индекс — частное."),
    tfx("In the slide example (BCWS = $1000, BCWP = $800, ACWP = $700), the project is under budget but behind schedule.", true,
      "CV = 800 - 700 = +$100 (lower cost than forecasted, favorable); SV = 800 - 1000 = -$200 (slower than planned, unfavorable).",
      "CV = 800 - 700 = +$100 (дешевле прогноза, благоприятно); SV = 800 - 1000 = -$200 (медленнее плана, неблагоприятно).",
      "\"False\" would need a negative CV or a positive SV; the slide computes CV = +$100 and SV = -$200.",
      "«Неверно» требовало бы отрицательного CV или положительного SV; слайд считает CV = +$100 и SV = -$200."),
  ],
);

const p3 = part(
  "pm-l4-p3",
  { en: "Groups: types, reasons and stages of development", ru: "Группы: виды, причины и стадии развития" },
  {
    en: `## What is a group?
> **Group** is defined as **two or more employees who interact with each other** in such a manner that the **behavior and/or performance of a member is influenced by the behavior and/or performance of other members**.
Three tests hide in this definition:
| Test | Question | Not a group if… |
|---|---|---|
| Size | at least two employees? | one freelancer working alone |
| Interaction | do they actually interact? | 300 people subscribed to the same company newsletter |
| Mutual influence | does one member's behavior or performance affect the others? | people who happen to share a lift every morning |
- **IT example:** five developers in one Scrum team are a group: if the backend developer is late with the API, the frontend developer's performance drops too. Fifty employees who share an office kitchen are not — until they start interacting in a way that influences each other.
- By being aware of group characteristics and behaviors, **managers can be prepared for the potential positive and negative results** of group activities. A manager can **proactively intervene to modify the perceptions, attitudes, and motivations** that influence the results.
## Formal and informal groups
**Formal groups** are groups **created by managerial decision** to accomplish **stated goals of the organization**. The demands and processes of the organization lead to the formation of **two types of formal groups: command and task**.
**Informal groups** are groups that **arise from individual efforts** and develop around **common interests and friendships** rather than deliberate design. **Two specific informal groups** exist: **interest and friendship**.
| Group | Formal or informal | What it is (Gibson) | IT example |
|---|---|---|---|
| **Command group** | formal | specified by the organization chart: a manager and the subordinates who report directly to that manager | the Head of QA and the six testers who report to her |
| **Task group** | formal | employees working together to complete a particular job or project; members may come from different units | a backend developer, a DBA and a security engineer assigned to migrate payments by June |
| **Interest group** | informal | employees who come together to achieve a specific objective of common concern; it usually disbands once the objective is reached | developers from several teams who lobby management for a four-day week |
| **Friendship group** | informal | people who share some characteristic (age, background, hobbies) and enjoy being together, often outside work too | colleagues who play football together every Saturday |
> Memory hook: formal = **C**ommand + **T**ask (made by the **chart** and the **task**); informal = **I**nterest + **F**riendship (made by the **people** themselves).
> Exam trap: an interest group has a goal, but it is still **informal** — nobody in management designed it. A task group can cross departments, but it is still **formal** — management created it. Teams (Part 4) are a special type of **task** group.
## Why people form groups
Formal and informal groups form for various reasons. Some reasons involve **needs, proximity, attractions, goals, and economics**.
**The satisfaction of needs.** The desire for need satisfaction can be a strong motivating force leading to group formation. Specifically, some employees' **security, social, esteem, and self-actualization needs** can be satisfied to a degree by their affiliation with groups.
| Need (slide) | How a group satisfies it | IT example |
|---|---|---|
| Security | protection and support; a member feels less alone facing pressure | a junior developer faces a tough architecture review with the team backing her |
| Social | belonging, friendship, contact with others | a remote engineer joins the team's evening game channel |
| Esteem | status, respect and recognition from being a member | being invited into the core platform group |
| Self-actualization | growth and use of one's full potential through challenging group work | joining the ML guild to work on hard research problems |
> Exam trap: the slide lists **four** needs — security, social, esteem, self-actualization. **Physiological** needs (the base of Maslow's pyramid) are **not** on the list.
| Other reason | Meaning (Gibson) | IT example |
|---|---|---|
| Proximity and attraction | people who work close together interact more and are attracted to each other (similar attitudes, interests) | developers who sit together or share a time zone form a group naturally |
| Group goals | the goals of a group can attract people who share them | engineers join an open-source accessibility initiative because they believe in it |
| Economics | people believe they can get greater economic benefits in a group | a team-wide bonus for hitting the release date pulls people together |
The summary slide puts it this way: people are attracted to groups because of their potential for **satisfying needs**, their **physical proximity and attraction**, and the **appeal of group goals and activities**. In essence, people are attracted to one another; that is a **natural process**.
## How groups develop
Groups develop **at different rates and with unique patterns** that depend on **the task, the setting, the members' individual characteristics and behavior patterns, and the manager's style of managing**. The lecture gives two models.
## The five-stage model
This model explains the group development process in terms of a **maturity cycle**. (The model is usually credited to Bruce Tuckman; the name is not on the slides.)
@diagram pm4-five-stages
| # | Stage | Signs from the slide | IT team example |
|---|---|---|---|
| 1 | **Forming** | the **breaking the ice, getting acquainted** stage; members are **trying out behaviors, testing their position, and asking questions** of other members; the group is establishing **loose, but specific, ground rules** | first week of a new team: intro call, "who owns the backend?", agreeing on a 10:00 stand-up |
| 2 | **Storming** | characterized by **conflict**: members are **arguing, debating, and experimenting with roles**, advice offered by other members, and **attempts to move into leadership roles**; the group's **hierarchy starts to take shape** | two seniors argue about React vs Vue and about who is the real tech lead |
| 3 | **Norming** | the group starts to **work more effectively together**; a **sense of togetherness** or attraction to being part of the group; **the beginning of cohesiveness**; a set of **group-driven expectations is communicated** within the group | the team agrees on a Definition of Done and code-review rules and starts saying "we" |
| 4 | **Performing** | a group **structure, hierarchy, and norms are in place**; the group is **focused on accomplishing goals and being an efficient unit**; important because **the group is mature** | stable velocity, problems are solved without the manager |
| 5 | **Adjourning** | the group **prepares to disband**; the goals have been accomplished and tasks finished; some members will be **saddened over the loss of member contact and cohesiveness** | after the release the project team is dissolved; a farewell retro and some sadness |
> Memory hook: **Form → Storm → Norm → Perform → Adjourn** = "hello → fight → agree → deliver → goodbye".
> Exam trap: watch the exact verbs. Ground rules are set (loosely) in **forming**; the hierarchy **starts to take shape** in **storming**; cohesiveness **begins** in **norming**; the group is **mature** in **performing**; sadness belongs to **adjourning**.
## The punctuated equilibrium model (PEM)
Some believe that the five-stage model is **too static and unrealistic**. The **punctuated equilibrium model (PEM)** presents group development as a **three-phase concept**:
| Phase | What happens (slide) |
|---|---|
| 1 | groups **define tasks, establish goals**, and consider various ways to execute the steps of the plan or project |
| 2 | somewhere along a time continuum the group decides to **change its perspectives and take action**; it reaches its own **point of inertia or equilibrium** — when it **realizes that time is running out** (the realization phase) |
| 3 | a **final phase to accomplish tasks** |
- **IT example:** a student team has 8 weeks to build a diploma prototype. Weeks 1–3: discussions, a few experiments, little code. In week 4 someone says "we have only a month left!" — the team re-plans, cuts features and starts building fast; the last weeks are pure execution.
> Exam trap: the slide's wording is "point of **inertia or equilibrium**", reached when the group **realizes that time is running out**. In the original research (Gersick, not on the slides) this transition typically happens around the **midpoint** of the allotted time. Answer with the slide's phrase.
## Comparing the two models
| | Five-stage model | Punctuated equilibrium model |
|---|---|---|
| Structure | five sequential stages | three phases |
| Logic | a **maturity cycle** — the group matures step by step | long inertia, then a sharp turn when time is running out |
| What triggers change | relationships developing between members | the realization that time is running out |
| Criticism / strength | seen by some as **too static and unrealistic** | explains last-minute bursts of work in deadline-driven groups |
| Best fits | a long-lived team that grows together | a temporary group with a fixed deadline |
?? Five testers report to the same QA lead according to the org chart. Three of them also meet after work to play board games. Name both groups.
?= The five testers with their lead form a formal command group; the three board-game players form an informal friendship group.
?? In which stage of the five-stage model does the group's hierarchy start to take shape, and in which does cohesiveness begin?
?= The hierarchy starts to take shape in storming; cohesiveness begins in norming.
?? What turns a group from phase 1 to action in the punctuated equilibrium model?
?= Reaching its point of inertia or equilibrium — the moment the group realizes that time is running out; after that comes the final phase to accomplish tasks.
## Exam focus
- The **definition** of a group: two or more employees, interaction, mutual influence on behavior and/or performance.
- **Formal** (created by managerial decision; **command, task**) vs **informal** (arise from individual efforts; **interest, friendship**).
- Reasons groups form: **needs, proximity, attractions, goals, economics**; the needs are **security, social, esteem, self-actualization**.
- The five stages in order with their key phrases: forming (ice-breaking, ground rules), storming (conflict, hierarchy takes shape), norming (cohesiveness begins), performing (mature), adjourning (disband, sadness).
- PEM: **three phases**; the equilibrium point = realizing that **time is running out**; the five-stage model is criticised as **too static and unrealistic**.
- Groups develop at **different rates** depending on the task, the setting, the members' characteristics and the manager's style.`,
    ru: `## Что такое группа
> **Группа (group)** — это **двое или более сотрудников, которые взаимодействуют друг с другом** так, что **поведение и/или результаты одного участника зависят от поведения и/или результатов других**.
В этом определении спрятаны три проверки:
| Проверка | Вопрос | Не группа, если… |
|---|---|---|
| Размер | хотя бы двое сотрудников? | один фрилансер, работающий в одиночку |
| Взаимодействие (interaction) | они действительно взаимодействуют? | 300 человек, подписанных на одну корпоративную рассылку |
| Взаимное влияние | поведение или результаты одного влияют на других? | люди, которые каждое утро случайно едут в одном лифте |
- **Пример из IT:** пять разработчиков одной Scrum-команды — группа: если бэкендер опаздывает с API, падает и результат фронтендера. Пятьдесят сотрудников с общей офисной кухней — не группа, пока не начнут взаимодействовать так, чтобы влиять друг на друга.
- Зная характеристики и поведение групп, **менеджеры могут подготовиться к возможным положительным и отрицательным результатам** групповой деятельности. Менеджер может **проактивно вмешаться (proactively intervene), чтобы изменить восприятие, установки и мотивацию**, которые влияют на результат.
## Формальные и неформальные группы
**Формальные группы (formal groups)** — группы, **созданные решением руководства (managerial decision)** для достижения **заявленных целей организации**. Требования и процессы организации приводят к созданию **двух типов формальных групп: группы подчинения (command) и целевой группы (task)**.
**Неформальные группы (informal groups)** — группы, которые **возникают из усилий самих людей** и складываются вокруг **общих интересов и дружбы**, а не по замыслу. Есть **два вида неформальных групп**: **по интересам (interest) и дружеские (friendship)**.
| Группа | Формальная или неформальная | Что это (Gibson) | Пример из IT |
|---|---|---|---|
| **Command group** (группа подчинения) | формальная | задана оргструктурой: руководитель и подчинённые, которые отчитываются прямо ему | руководитель QA и шесть тестировщиков, подчинённых ей |
| **Task group** (целевая группа) | формальная | сотрудники, вместе выполняющие определённую работу или проект; могут быть из разных подразделений | бэкендер, администратор БД и инженер по безопасности, назначенные перевести платежи к июню |
| **Interest group** (группа по интересам) | неформальная | сотрудники, объединившиеся ради конкретной общей цели; обычно распадается, когда цель достигнута | разработчики из нескольких команд, добивающиеся от руководства четырёхдневки |
| **Friendship group** (дружеская группа) | неформальная | люди с общими чертами (возраст, происхождение, хобби), которым приятно быть вместе, часто и вне работы | коллеги, которые каждую субботу играют в футбол |
> Как запомнить: формальные — **C**ommand + **T**ask (их создают **оргструктура** и **задача**); неформальные — **I**nterest + **F**riendship (их создают сами **люди**).
> Ловушка экзамена: у группы по интересам есть цель, но она всё равно **неформальная** — её не создавало руководство. Целевая группа может объединять разные отделы, но она всё равно **формальная** — её создало руководство. Команды (часть 4) — особый вид **целевой (task)** группы.
## Почему люди объединяются в группы
Формальные и неформальные группы возникают по разным причинам. Среди них — **потребности, близость, привлекательность, цели и экономика (needs, proximity, attractions, goals, and economics)**.
**Удовлетворение потребностей (the satisfaction of needs).** Желание удовлетворить потребности может быть сильным мотивом к созданию группы. В частности, потребности сотрудников в **безопасности, общении, уважении и самореализации (security, social, esteem, and self-actualization)** могут до некоторой степени удовлетворяться членством в группах.
| Потребность (слайд) | Как группа её удовлетворяет | Пример из IT |
|---|---|---|
| Security — безопасность | защита и поддержка; участник не один перед давлением | джун проходит жёсткое архитектурное ревью при поддержке команды |
| Social — общение | принадлежность, дружба, контакт с другими | удалённый инженер присоединяется к вечернему игровому каналу команды |
| Esteem — уважение | статус, уважение и признание за членство | приглашение в ключевую платформенную группу |
| Self-actualization — самореализация | рост и раскрытие потенциала через сложную групповую работу | вступление в ML-гильдию, чтобы решать трудные исследовательские задачи |
> Ловушка экзамена: на слайде **четыре** потребности — security, social, esteem, self-actualization. **Физиологических (physiological)** потребностей (основание пирамиды Маслоу) в списке **нет**.
| Другая причина | Смысл (Gibson) | Пример из IT |
|---|---|---|
| Proximity and attraction — близость и притяжение | кто работает рядом, больше взаимодействует и сближается (схожие взгляды, интересы) | разработчики, сидящие рядом или в одном часовом поясе, естественно образуют группу |
| Group goals — цели группы | цели группы привлекают тех, кто их разделяет | инженеры вступают в open-source-инициативу по доступности, потому что верят в неё |
| Economics — экономика | люди считают, что в группе получат больше экономической выгоды | общий командный бонус за релиз в срок сплачивает людей |
Итоговый слайд говорит так: людей тянет в группы, потому что там можно **удовлетворить потребности**, из-за **физической близости и притяжения** и из-за **привлекательности целей и занятий группы**. По сути, людей тянет друг к другу; это **естественный процесс**.
## Как развиваются группы
Группы развиваются **с разной скоростью и по своим уникальным схемам**, которые зависят от **задачи, обстановки, индивидуальных черт и поведения участников и стиля управления менеджера**. Лекция даёт две модели.
## Пятиэтапная модель (the five-stage model)
Эта модель объясняет развитие группы как **цикл созревания (maturity cycle)**. (Обычно модель связывают с Брюсом Такманом; на слайдах имени нет.)
@diagram pm4-five-stages
| # | Стадия | Признаки со слайда | Пример IT-команды |
|---|---|---|---|
| 1 | **Forming** — формирование | стадия **«растопить лёд, познакомиться» (breaking the ice, getting acquainted)**; участники **пробуют модели поведения, проверяют своё положение и задают вопросы** другим; группа устанавливает **нестрогие, но конкретные основные правила (loose, but specific, ground rules)** | первая неделя новой команды: знакомство, «кто отвечает за бэкенд?», договорились о стендапе в 10:00 |
| 2 | **Storming** — бурление | отличается **конфликтом**: участники **спорят, дискутируют и экспериментируют с ролями**, с советами других и **пытаются занять лидерские роли**; **иерархия группы начинает складываться** | два сеньора спорят о React или Vue и о том, кто настоящий техлид |
| 3 | **Norming** — нормирование | группа начинает **работать эффективнее вместе**; появляется **чувство общности** или тяга быть частью группы; **начало сплочённости (cohesiveness)**; внутри группы **доводится набор ожиданий, выработанных самой группой** | команда договаривается о Definition of Done и правилах код-ревью и начинает говорить «мы» |
| 4 | **Performing** — работа | **структура, иерархия и нормы группы на месте**; группа **сосредоточена на целях и на том, чтобы быть эффективной единицей**; стадия важна тем, что **группа зрелая** | стабильная скорость команды, проблемы решаются без менеджера |
| 5 | **Adjourning** — завершение | группа **готовится к роспуску**; цели достигнуты, задачи выполнены; некоторым участникам **грустно терять контакт с коллегами и сплочённость** | после релиза проектную команду распускают; прощальная ретроспектива и немного грусти |
> Как запомнить: **Form → Storm → Norm → Perform → Adjourn** = «привет → ссора → договорились → делаем → пока».
> Ловушка экзамена: следите за точными глаголами. Основные правила устанавливают (нестрого) на **forming**; иерархия **начинает складываться** на **storming**; сплочённость **начинается** на **norming**; группа **зрелая** на **performing**; грусть — это **adjourning**.
## Модель прерывистого равновесия (punctuated equilibrium model, PEM)
Некоторые считают пятиэтапную модель **слишком статичной и нереалистичной (too static and unrealistic)**. **Модель прерывистого равновесия (PEM)** описывает развитие группы как **трёхфазную концепцию**:
| Фаза | Что происходит (слайд) |
|---|---|
| 1 | группа **определяет задачи, ставит цели** и рассматривает разные способы выполнить шаги плана или проекта |
| 2 | где-то на шкале времени группа решает **сменить взгляд и перейти к действию**; она достигает своей **точки инерции или равновесия (point of inertia or equilibrium)** — когда **понимает, что время уходит (time is running out)** (фаза осознания) |
| 3 | **финальная фаза — выполнить задачи** |
- **Пример из IT:** у студенческой команды 8 недель на прототип для диплома. Недели 1–3: обсуждения, пара экспериментов, мало кода. На 4-й неделе кто-то говорит: «остался всего месяц!» — команда перепланирует, режет функции и начинает быстро строить; последние недели — чистое исполнение.
> Ловушка экзамена: слайд говорит «point of **inertia or equilibrium**», которой группа достигает, когда **понимает, что время уходит**. В исходном исследовании (Gersick, на слайдах нет) этот переход обычно случается около **середины** отведённого срока. Отвечайте формулировкой слайда.
## Сравнение двух моделей
| | Пятиэтапная модель | Модель прерывистого равновесия |
|---|---|---|
| Строение | пять последовательных стадий | три фазы |
| Логика | **цикл созревания** — группа взрослеет шаг за шагом | долгая инерция, затем резкий поворот, когда время уходит |
| Что запускает перемены | развитие отношений между участниками | осознание, что время уходит |
| Критика / сила | некоторые считают её **слишком статичной и нереалистичной** | объясняет рывки в последний момент у групп с дедлайном |
| Лучше подходит | долгоживущей команде, которая растёт вместе | временной группе с жёстким сроком |
?? Пять тестировщиков по оргструктуре подчиняются одному QA-лиду. Трое из них ещё и собираются после работы поиграть в настолки. Назовите обе группы.
?= Пятеро тестировщиков со своим лидом — формальная группа подчинения (command group); трое любителей настолок — неформальная дружеская группа (friendship group).
?? На какой стадии пятиэтапной модели начинает складываться иерархия группы и на какой начинается сплочённость?
?= Иерархия начинает складываться на storming; сплочённость начинается на norming.
?? Что переводит группу от первой фазы к действию в модели прерывистого равновесия?
?= Достижение точки инерции или равновесия — момента, когда группа понимает, что время уходит; после этого наступает финальная фаза выполнения задач.
## Что спросят на экзамене (Exam focus)
- **Определение** группы: двое или более сотрудников, взаимодействие, взаимное влияние на поведение и/или результаты.
- **Формальные** (созданы решением руководства; **command, task**) и **неформальные** (возникают из усилий самих людей; **interest, friendship**).
- Причины создания групп: **needs, proximity, attractions, goals, economics**; потребности — **security, social, esteem, self-actualization**.
- Пять стадий по порядку с ключевыми фразами: forming (растопить лёд, основные правила), storming (конфликт, иерархия складывается), norming (начало сплочённости), performing (зрелость), adjourning (роспуск, грусть).
- PEM: **три фазы**; точка равновесия — понимание, что **время уходит**; пятиэтапную модель критикуют как **слишком статичную и нереалистичную**.
- Группы развиваются **с разной скоростью** в зависимости от задачи, обстановки, черт участников и стиля менеджера.`,
  },
  [
    qx("How does the lecture define a group?", "Two or more employees whose interaction shapes each other's behavior", [
      ["Any set of employees who appear together on one organizational chart", "Appearing on a chart is not enough; the definition requires interaction and mutual influence on behavior or performance.", "Попасть в одну оргструктуру недостаточно: определение требует взаимодействия и взаимного влияния на поведение или результаты."],
      ["Three or more people who share one common goal and one manager", "The slide says two or more employees, and it defines a group by interaction and influence, not by a shared manager.", "Слайд говорит «двое или более сотрудников» и определяет группу через взаимодействие и влияние, а не через общего руководителя."],
      ["Employees who work in the same physical location at the same time", "Proximity is a reason why groups form, not the definition of a group.", "Близость — причина возникновения групп, а не определение группы."],
    ], "Slide: a group is two or more employees who interact with each other in such a manner that the behavior and/or performance of a member is influenced by the behavior and/or performance of other members.", "Слайд: группа — двое или более сотрудников, которые взаимодействуют так, что поведение и/или результаты одного участника зависят от поведения и/или результатов других."),
    qx("According to the lecture, formal groups are created by:", "Managerial decision, to accomplish stated organizational goals", [
      ["Individual efforts around common interests and friendships", "This is how informal groups arise — from individual efforts rather than deliberate design.", "Так возникают неформальные группы — из усилий самих людей, а не по замыслу."],
      ["Employees themselves, to satisfy their security and social needs", "Need satisfaction is a reason people join groups, but formal groups are created by management.", "Удовлетворение потребностей — причина вступать в группы, но формальные группы создаёт руководство."],
      ["The members' own vote once the storming stage is complete", "Storming is a stage of group development; it does not create formal groups.", "Storming — стадия развития группы; формальные группы она не создаёт."],
    ], "Slide: formal groups are groups created by managerial decision to accomplish stated goals of the organization.", "Слайд: формальные группы создаются решением руководства для достижения заявленных целей организации."),
    qx("Which two types of formal groups does the lecture name?", "Command and task groups", [
      ["Interest and friendship groups", "Interest and friendship are the two informal groups.", "Interest и friendship — это два вида неформальных групп."],
      ["Line and staff groups", "Line and staff describe positions in an organizational structure, not the lecture's group types.", "Line и staff описывают должности в оргструктуре, а не виды групп из лекции."],
      ["Task and interest groups", "Task is formal, but interest is informal — the pair mixes the two categories.", "Task — формальная, а interest — неформальная: пара смешивает две категории."],
    ], "Slide: the demands and processes of the organization lead to the formation of two types of formal groups: command and task.", "Слайд: требования и процессы организации приводят к созданию двух типов формальных групп: command и task."),
    qx("Which two specific informal groups exist, according to the lecture?", "Interest and friendship groups", [
      ["Command and task groups", "Command and task groups are the two formal groups, created by management.", "Command и task — два вида формальных групп, их создаёт руководство."],
      ["Friendship and command groups", "Friendship is informal, but command is formal — the pair mixes the two categories.", "Friendship — неформальная, а command — формальная: пара смешивает две категории."],
      ["Self-directed and cross-functional teams", "These are categories of teams, which are a special type of formal task group.", "Это категории команд, а команды — особый вид формальной целевой группы."],
    ], "Slide: informal groups arise from individual efforts around common interests and friendships; two specific informal groups exist: interest and friendship.", "Слайд: неформальные группы возникают из усилий самих людей вокруг общих интересов и дружбы; есть два вида — interest и friendship."),
    qx("Developers from several teams start meeting to push management for a four-day work week. Nobody assigned them, and they plan to stop once the policy is decided. What kind of group is this?", "An informal interest group", [
      ["A formal task group", "A task group is created by management for a job or project; nobody assigned this one.", "Целевую группу создаёт руководство под работу или проект; эту группу никто не назначал."],
      ["An informal friendship group", "Friendship groups form around shared characteristics and enjoyment; this group pursues one specific objective.", "Дружеские группы складываются вокруг общих черт и удовольствия от общения; эта группа добивается одной конкретной цели."],
      ["A formal command group", "A command group is a manager and direct subordinates on the org chart.", "Группа подчинения — руководитель и прямые подчинённые по оргструктуре."],
    ], "Employees who come together on their own for a specific objective of common concern form an informal interest group; it usually disbands when the objective is reached.", "Сотрудники, сами объединившиеся ради конкретной общей цели, образуют неформальную группу по интересам; обычно она распадается, когда цель достигнута."),
    qx("A Head of QA and the six testers who report directly to her, as shown on the organizational chart, form which type of group?", "A formal command group", [
      ["A formal task group", "A task group is assembled around a particular job or project, often across units; this one is defined by the reporting line.", "Целевую группу собирают под конкретную работу или проект, часто из разных подразделений; эта задана линией подчинения."],
      ["An informal interest group", "Nothing here arises from individual efforts; the group is set by the org chart.", "Здесь ничего не возникло из усилий самих людей: группа задана оргструктурой."],
      ["A self-directed work team", "Self-directed teams take over their former supervisor's duties; here the supervisor is in charge.", "Самоуправляемые команды берут на себя обязанности бывшего руководителя; здесь руководитель на месте."],
    ], "A command group is a formal group specified by the organization chart: a manager and the subordinates who report directly to that manager.", "Группа подчинения (command group) — формальная группа, заданная оргструктурой: руководитель и подчинённые, которые отчитываются прямо ему."),
    qx("Management assembles a backend developer, a DBA and a security engineer from three departments to migrate the payment system by June. Which group type is this?", "A formal task group", [
      ["A formal command group", "The three do not report to one manager on the chart; they were brought together for one job.", "Эти трое не подчиняются по оргструктуре одному руководителю; их собрали под одну работу."],
      ["An informal interest group", "The group was created by management, so it is formal, not informal.", "Группу создало руководство, значит, она формальная, а не неформальная."],
      ["A friendship group", "Friendship groups arise from shared characteristics, not from a management assignment.", "Дружеские группы возникают из общих черт, а не из назначения руководства."],
    ], "Created by managerial decision to complete a particular task, possibly across departments — a formal task group.", "Создана решением руководства для выполнения конкретной задачи, возможно из разных отделов, — формальная целевая группа (task group)."),
    qx("Which of the following is NOT named on the slides as a reason why people form groups?", "Status hierarchy", [
      ["Satisfaction of needs", "The satisfaction of needs is the first reason the slides discuss.", "Удовлетворение потребностей — первая причина, которую разбирают слайды."],
      ["Physical proximity", "Proximity is listed among the reasons (needs, proximity, attractions, goals, economics).", "Близость входит в список причин (needs, proximity, attractions, goals, economics)."],
      ["Economics", "Economics is the last item of the list of reasons.", "Economics — последний пункт списка причин."],
    ], "Reasons: needs, proximity, attractions, goals, and economics. Status hierarchy is a group characteristic, not a reason for forming groups.", "Причины: needs, proximity, attractions, goals, economics. Status hierarchy — характеристика группы, а не причина её создания."),
    qx("Which set of needs does the lecture say can be satisfied to a degree by affiliation with groups?", "Security, social, esteem and self-actualization", [
      ["Physiological, security, social and esteem needs", "Physiological needs are not on the slide's list, and self-actualization is missing here.", "Физиологических потребностей в списке слайда нет, а самореализации здесь не хватает."],
      ["Achievement, affiliation, power and autonomy needs", "This mixes McClelland-style needs; the slide names security, social, esteem and self-actualization.", "Это смесь потребностей в духе Макклелланда; слайд называет security, social, esteem и self-actualization."],
      ["Existence, relatedness and growth (ERG) needs", "ERG is a different needs model; it is not what the slide lists.", "ERG — другая модель потребностей; на слайде перечислено не это."],
    ], "Slide: some employees' security, social, esteem, and self-actualization needs can be satisfied to a degree by their affiliation with groups.", "Слайд: потребности сотрудников в безопасности, общении, уважении и самореализации могут до некоторой степени удовлетворяться членством в группах."),
    qx("Members of a new team are breaking the ice, testing their positions, asking each other questions and setting loose but specific ground rules. Which stage is this?", "Forming", [
      ["Storming", "Storming is marked by conflict, arguing and attempts to move into leadership roles.", "Storming отличается конфликтами, спорами и попытками занять лидерские роли."],
      ["Norming", "Norming brings togetherness and the beginning of cohesiveness, after the conflicts.", "Norming приносит чувство общности и начало сплочённости — уже после конфликтов."],
      ["Performing", "Performing needs structure, hierarchy and norms already in place.", "Для performing структура, иерархия и нормы уже должны быть на месте."],
    ], "Slide: forming is the breaking the ice, getting acquainted stage; members try out behaviors, test their position, ask questions, and the group establishes loose, but specific, ground rules.", "Слайд: forming — стадия «растопить лёд, познакомиться»; участники пробуют поведение, проверяют положение, задают вопросы, а группа устанавливает нестрогие, но конкретные основные правила."),
    qx("In which stage of the five-stage model does the group's hierarchy start to take shape?", "Storming", [
      ["Forming", "Forming sets loose ground rules; members are still testing their positions.", "На forming устанавливают нестрогие правила; участники ещё только проверяют своё положение."],
      ["Norming", "Norming is where cohesiveness begins; the hierarchy has already started to form.", "На norming начинается сплочённость; иерархия к этому времени уже начала складываться."],
      ["Performing", "In performing the hierarchy is already in place, not just starting.", "На performing иерархия уже на месте, а не только начинает складываться."],
    ], "Slide: storming is characterized by conflict and attempts to move into leadership roles; the group's hierarchy starts to take shape.", "Слайд: storming отличается конфликтами и попытками занять лидерские роли; иерархия группы начинает складываться."),
    qx("A mobile team agrees on a Definition of Done and code-review rules, and members start to feel like \"we\". The slides call this the beginning of what, and in which stage?", "Cohesiveness, in the norming stage", [
      ["Hierarchy, in the storming stage", "In storming only the hierarchy takes shape, amid conflict; togetherness comes later.", "На storming среди конфликтов лишь складывается иерархия; чувство общности приходит позже."],
      ["Maturity, in the performing stage", "Performing is when the group is already mature and focused on goals.", "Performing — когда группа уже зрелая и сосредоточена на целях."],
      ["Ground rules, in the forming stage", "Forming sets loose ground rules, not group-driven expectations and togetherness.", "Forming задаёт нестрогие правила, а не выработанные группой ожидания и чувство общности."],
    ], "Slide: in norming the group works more effectively together, feels a sense of togetherness, communicates group-driven expectations — this is the beginning of cohesiveness.", "Слайд: на norming группа работает эффективнее, появляется чувство общности, доводятся выработанные группой ожидания — это начало сплочённости."),
    qx("Which statement describes the performing stage?", "Structure and norms are in place; the group is mature", [
      ["Members argue and attempt to move into leadership roles", "Arguing and grabbing leadership roles describe storming.", "Споры и борьба за лидерские роли описывают storming."],
      ["A set of group-driven expectations is first communicated", "Communicating group-driven expectations is part of norming.", "Доведение выработанных группой ожиданий — часть norming."],
      ["Goals are accomplished and members prepare to disband", "Preparing to disband after accomplishing goals is adjourning.", "Подготовка к роспуску после достижения целей — это adjourning."],
    ], "Slide: in performing, a group structure, hierarchy and norms are in place; the group focuses on goals and on being an efficient unit — it is mature.", "Слайд: на performing структура, иерархия и нормы на месте; группа сосредоточена на целях и эффективности — она зрелая."),
    qx("After the release, the project team is about to be dissolved, and some members feel sad about losing contact with each other. Which stage is this?", "Adjourning", [
      ["Performing", "Performing is the mature, goal-focused stage; the group is not yet preparing to disband.", "Performing — зрелая стадия работы на цель; группа ещё не готовится к роспуску."],
      ["Norming", "Norming is where cohesiveness begins, not where it is lost.", "На norming сплочённость начинается, а не теряется."],
      ["Storming", "Storming is about conflict over roles, not about the end of the group.", "Storming — о конфликтах за роли, а не о конце группы."],
    ], "Slide: in adjourning the group prepares to disband; goals are accomplished, and some members are saddened over the loss of member contact and cohesiveness.", "Слайд: на adjourning группа готовится к роспуску; цели достигнуты, и некоторым грустно терять контакт и сплочённость."),
    tfx("The five-stage model explains group development in terms of a maturity cycle.", true,
      "The slide: this model explains the group development process in terms of a maturity cycle (forming, storming, norming, performing, adjourning).",
      "Слайд: эта модель объясняет развитие группы как цикл созревания (forming, storming, norming, performing, adjourning).",
      "\"False\" would deny the slide's own wording; the maturity cycle is exactly how the five-stage model is introduced.",
      "«Неверно» отрицает формулировку самого слайда: пятиэтапную модель вводят именно как цикл созревания."),
    qx("In the punctuated equilibrium model, when does a group reach its point of equilibrium?", "When the group realizes that time is running out", [
      ["When structure, hierarchy and norms are in place", "That describes the performing stage of the five-stage model.", "Это описание стадии performing пятиэтапной модели."],
      ["When members first break the ice and get acquainted", "That is forming in the five-stage model, the very start of group life.", "Это forming пятиэтапной модели — самое начало жизни группы."],
      ["When its goals are accomplished and it disbands", "That is adjourning in the five-stage model.", "Это adjourning пятиэтапной модели."],
    ], "Slide: the group reaches its own point of inertia or equilibrium when it realizes that time is running out; then comes the final phase to accomplish tasks.", "Слайд: группа достигает своей точки инерции или равновесия, когда понимает, что время уходит; затем идёт финальная фаза выполнения задач."),
    qx("How does the punctuated equilibrium model (PEM) present group development?", "As a three-phase concept with a turning point", [
      ["As a five-stage maturity cycle from forming on", "That is the five-stage model, which the PEM was proposed to replace.", "Это пятиэтапная модель, на смену которой и предложена PEM."],
      ["As a closed loop of planning and reporting", "A closed loop of planning and reporting is the MCCS operating cycle, not group development.", "Замкнутый цикл планирования и отчётности — это операционный цикл MCCS, а не развитие группы."],
      ["As a steady, gradual climb with no turning point", "The PEM's point is the opposite: inertia, then a sharp change when time is running out.", "Суть PEM обратная: инерция, а затем резкая перемена, когда время уходит."],
    ], "Slide: the PEM presents group development as a three-phase concept — define tasks and goals, reach the point of equilibrium (time is running out), then accomplish tasks.", "Слайд: PEM описывает развитие группы как трёхфазную концепцию: определить задачи и цели, достичь точки равновесия (время уходит), затем выполнить задачи."),
    qx("Why do some critics prefer the punctuated equilibrium model to the five-stage model?", "They see the five-stage model as too static and unrealistic", [
      ["The five-stage model ignores conflict between the group's members", "It does not: storming is a whole stage of conflict.", "Это не так: storming — целая стадия конфликта."],
      ["The five-stage model has no stage for disbanding", "It has one — adjourning, when the group prepares to disband.", "Такая стадия есть — adjourning, когда группа готовится к роспуску."],
      ["The five-stage model applies only to informal groups", "The slides do not limit it to informal groups; the criticism is about it being static.", "Слайды не ограничивают её неформальными группами; критика — в том, что она статична."],
    ], "Slide: some believe that the five-stage model is too static and unrealistic; the PEM presents development as three phases instead.", "Слайд: некоторые считают пятиэтапную модель слишком статичной и нереалистичной; PEM вместо этого описывает развитие тремя фазами."),
    qx("A student team has 8 weeks for a diploma prototype. For three weeks they only discuss options; in week 4 someone says \"we have only a month left!\", and the team re-plans and starts building fast. Which model describes this best?", "The punctuated equilibrium model", [
      ["The five-stage model (storming)", "Storming is conflict over roles and leadership; the case is about a sudden shift when time runs short.", "Storming — конфликт за роли и лидерство; кейс — о резком переломе, когда времени мало."],
      ["The operating cycle of the MCCS", "The operating cycle is about cost control phases, not about group behavior.", "Операционный цикл — о фазах контроля затрат, а не о поведении группы."],
      ["The five-stage model (adjourning)", "Adjourning is disbanding after the goals are met; here the work is only speeding up.", "Adjourning — роспуск после достижения целей; здесь работа только ускоряется."],
    ], "Long inertia, then a change of perspective when the group realizes that time is running out, then a final phase of accomplishing tasks — the PEM.", "Долгая инерция, затем смена взгляда, когда группа понимает, что время уходит, затем финальная фаза выполнения задач — это PEM."),
    tfx("Groups develop at the same rate and in the same pattern, regardless of the task and the manager's style.", false,
      "The summary slide: groups develop at different rates and with unique patterns that depend on the task, the setting, the members' individual characteristics and behavior patterns, and the manager's style of managing.",
      "Итоговый слайд: группы развиваются с разной скоростью и по уникальным схемам, которые зависят от задачи, обстановки, черт и поведения участников и стиля управления менеджера.",
      "\"True\" would make the task and the manager irrelevant; the slide names them as factors that change the pace and the pattern.",
      "«Верно» сделало бы задачу и менеджера неважными; слайд прямо называет их факторами, меняющими скорость и схему развития."),
  ],
);

const p4 = part(
  "pm-l4-p4",
  { en: "Group characteristics, teams and roles", ru: "Характеристики групп, команды и роли" },
  {
    en: `## Seven characteristics of groups
**Characteristics of groups** include **structure, status hierarchy, roles, norms, leadership, cohesiveness, and intergroup conflict**. These characteristics **pervade all groups**. In an **informal** group, they **emerge from within the unit**; in a **formal** group, they are **established by the managerial process**.
| Characteristic | Meaning (Gibson) | IT team example |
|---|---|---|
| Structure | the pattern of relationships among the positions in a group | who reviews whose code, who talks to the client |
| Status hierarchy | the ranking of positions by prestige (seniority, skill, title) | the senior architect's opinion outweighs a junior's |
| Roles | the expected behavior patterns attributed to a particular position | the QA engineer is expected to block a release with critical bugs |
| Norms | standards of behavior shared by the group members | "no push to main without review", "cameras on at stand-up" |
| Leadership | influence over the group — formal or emergent | the tech lead, or the developer everyone actually listens to |
| Cohesiveness | the attractiveness of the group; how strongly members want to stay in it | people turn down offers elsewhere to stay with the team |
| Intergroup conflict | conflict between groups, which often makes each group more cohesive inside | developers vs operations over who caused the outage |
> Memory hook: **S-S-R-N-L-C-I** — "**S**mall **S**tartups **R**arely **N**eed **L**arge **C**orporate **I**nfrastructure": Structure, Status hierarchy, Roles, Norms, Leadership, Cohesiveness, Intergroup conflict.
- Group characteristics provide a **degree of predictability** for the members that is important to the group and to the outside (e.g., **management, other groups**). An **unstable or unpredictable group is a problem** for its members and for others who interact with it.
- **IT example:** a platform team with clear norms and roles can be trusted with a deadline; a team that reshuffles its tech lead every month and has no shared rules leaves the product owner unable to plan.
## Cohesiveness
- **Each group possesses some degree of cohesiveness.** This **attractiveness of the group** can be a **powerful force in influencing individual behavior and performance**.
- Research studies indicate that **cohesive groups can formulate goals and norms that may not agree with those of management**.
- When a group's goals and norms are **incongruent** with the organization's, **some form of managerial intervention is necessary**.
Gibson's textbook adds what happens when cohesiveness meets agreement or disagreement with organizational goals (beyond the slides):
| | Agreement with organizational goals | Disagreement with organizational goals |
|---|---|---|
| **High cohesiveness** | performance likely to rise strongly | performance likely to fall — the group pulls together against the goals |
| **Low cohesiveness** | performance may rise moderately | little effect on performance |
- **IT example:** a tight backend team adopts the norm "tests slow us down — skip them". The team is loyal and fast at shipping features, but the norm contradicts management's quality goal. Cohesiveness makes the bad norm stronger, so the manager must step in: explain the goal, change the incentives, bring in a QA champion.
> Exam trap: cohesiveness is **not automatically good**. A highly cohesive group whose goals disagree with management's is exactly the case where the slide says **managerial intervention is necessary**.
## Groupthink
> **Groupthink** is the desire among **cohesive** group members to **be in agreement**, which **supersedes considering solutions** to problems or situations that are **controversial** or in which **unanimous agreement is not possible**.
- Key words: **cohesive** members, the desire for **agreement**, which **supersedes** (overrides) real consideration of controversial options.
- Typical symptoms (Janis, beyond the slides): an illusion of invulnerability, collective rationalization, pressure on dissenters, self-censorship, an illusion of unanimity, "mindguards" who shield the group from bad news.
- **IT example:** a close-knit team ships on Friday although the load tests failed; nobody objects, because "we always agree" and nobody wants to be the one who spoils the release.
- Remedies (beyond the slides): appoint a devil's advocate, let the leader speak last, invite an outside reviewer, vote anonymously, run a pre-mortem.
> Exam trap: groupthink is a risk of **high** cohesiveness, not low. It is also not storming (open conflict): groupthink is the *absence* of disagreement.
## Teams
**Teams are a special type of task group.** Three common categories of teams exist in organizations:
| # | Team type | What it is (Gibson) | IT example |
|---|---|---|---|
| 1 | **Problem-solving teams** | a handful of employees, usually from the same department, who meet a few hours a week to discuss how to improve quality, efficiency or the work environment; they mostly recommend rather than implement | a weekly incident-review group in the support department proposing fixes |
| 2 | **Cross-functional teams** | employees from about the same hierarchical level but **different work areas** who come together to accomplish a task | a backend developer, a designer, a QA engineer and a marketer launching a new checkout |
| 3 | **Self-directed work teams** | employees who perform highly related jobs and **take over many responsibilities of their former supervisors** — planning, scheduling, assigning work | a squad that plans its own sprints, assigns tasks and schedules releases |
**Why managers form teams.** Managers form teams **predominantly to enhance productivity**. Teams also form due to:
- **flattening organizations**;
- the **need for flexibility and quick decisions**;
- **workforce diversity**;
- **improved quality**;
- **increased customer satisfaction**.
**Requirements for effective teams:**
- **top-level commitment** and provision of **clear goals**;
- **management–employee trust**;
- **willingness to take risks and share information**;
- **time, resources, and a commitment to training**.
> Exam trap: the **predominant** reason is **productivity**; the others (flattening, flexibility, diversity, quality, customer satisfaction) are additional. Close supervision of every member is **not** among the requirements — trust is.
## Roles and the role set
> The concept of **role** is vital to an understanding of group behavior. A **role** consists of the **expected behavior patterns attributed to a particular position**.
- Most individuals **perform multiple roles**, each with its own **role set** — **others' expectations for the role**.
- An individual involved in many different roles, each having a complex role set, faces **the ultimate in complexity of individual behavior**.
- In organizations there may be as many as **three perceptions of the same role**: **the organization's, the group's, and the individual's**.
| Perception | The role of a tech lead, as seen by… |
|---|---|
| The organization's | the company: deliver on time, report status to the PM, keep the architecture consistent |
| The group's | the team: protect us from pressure, unblock us, review code fast |
| The individual's | the tech lead herself: "I am the architect — I should write the hardest code" |
- **Role set example:** a QA engineer's role set includes developers (expect quick checks), the PM (expects a clear release verdict) and the customer (expects zero critical bugs).
## Role conflict
> When an individual faces **two or more simultaneous role requirements** for which **the performance of one precludes performance of the other(s)**, she experiences **role conflict**.
Three different types of role conflict can occur in organizational settings:
| Type | Where the clash is | IT example |
|---|---|---|
| **Person–role conflict** | between the **role's requirements** and the **person's own values, attitudes or needs** | a QA engineer is told to label known critical bugs as "minor" so the release passes; it violates her professional ethics |
| **Intrarole conflict** | **inside one role**: different people in the role set expect contradictory things from the same role | a team lead's manager wants her to push the team into overtime, while the team expects her to protect them from it |
| **Interrole conflict** | **between two or more roles** that the same person holds | a developer is on call this week and is also a master's student with an exam the same night |
> Memory hook: **person–role** = "me vs my role"; **intra**role = "inside one role" (intra = within); **inter**role = "between my roles" (inter = between).
- **Consequences:** management can **minimize certain types of role conflict** and should be **continually aware** that the consequences of conflict to the organization can include **ineffective performance by individuals and groups**. (Gibson adds that for the individual, role conflict brings anxiety, frustration and lower job satisfaction.)
> Exam trap: the last slide's sentence is garbled ("Research has shown that consequences of role conflict to Management can minimize…"). The textbook meaning: research shows the consequences of role conflict for the individual; management can minimize certain types of role conflict and should remember that the consequences to the organization include ineffective performance by individuals and groups.
?? A highly cohesive team has adopted the norm "never estimate honestly — always pad by 100%". What does the lecture say should happen?
?= Cohesive groups can formulate norms that do not agree with management's; when a group's goals and norms are incongruent with the organization's, some form of managerial intervention is necessary.
?? A developer is told by his manager to ship code he believes is insecure, and he refuses on principle. Which type of role conflict is this, and how would intrarole conflict differ?
?= Person–role conflict: the role's requirement clashes with his own values. Intrarole conflict would be different people in his role set (say, the manager and the team) expecting opposite things from the same role.
?? Name the three categories of teams and the predominant reason managers form teams.
?= Problem-solving teams, cross-functional teams and self-directed work teams; managers form teams predominantly to enhance productivity.
## Exam focus
- The **seven characteristics**: structure, status hierarchy, roles, norms, leadership, cohesiveness, intergroup conflict; informal → emerge from within the unit, formal → established by the managerial process; they give **predictability**.
- Cohesive groups may set goals and norms that **disagree with management's** → **managerial intervention** is necessary.
- **Groupthink**: cohesive members' desire for agreement supersedes considering controversial solutions.
- Teams = a special type of **task group**; three categories: **problem-solving, cross-functional, self-directed work teams**; formed **predominantly to enhance productivity** (plus flattening, flexibility and quick decisions, diversity, quality, customer satisfaction).
- Requirements for effective teams: top-level commitment and clear goals; management–employee trust; willingness to take risks and share information; time, resources and training.
- **Role** = the expected behavior patterns of a position; **role set** = others' expectations for the role; **three perceptions**: the organization's, the group's, the individual's.
- **Role conflict** types: **person–role, intrarole, interrole** — be ready to classify a short case.`,
    ru: `## Семь характеристик групп
**Характеристики групп (characteristics of groups)** — это **структура, статусная иерархия, роли, нормы, лидерство, сплочённость и межгрупповой конфликт (structure, status hierarchy, roles, norms, leadership, cohesiveness, and intergroup conflict)**. Они **есть во всех группах (pervade all groups)**. В **неформальной** группе они **возникают изнутри самой группы**; в **формальной** — **устанавливаются управленческим процессом (managerial process)**.
| Характеристика | Смысл (Gibson) | Пример IT-команды |
|---|---|---|
| Structure — структура | рисунок связей между позициями в группе | кто чей код ревьюит, кто общается с клиентом |
| Status hierarchy — статусная иерархия | ранжирование позиций по престижу (стаж, навыки, должность) | мнение старшего архитектора весит больше мнения джуна |
| Roles — роли | ожидаемые модели поведения, приписываемые определённой позиции | от QA-инженера ждут, что он остановит релиз с критическими багами |
| Norms — нормы | разделяемые участниками стандарты поведения | «в main без ревью не пушим», «на стендапе камеры включены» |
| Leadership — лидерство | влияние на группу — формальное или стихийно возникшее | техлид или разработчик, которого на деле слушают все |
| Cohesiveness — сплочённость | привлекательность группы; насколько сильно участники хотят в ней остаться | люди отказываются от предложений в других местах, чтобы остаться в команде |
| Intergroup conflict — межгрупповой конфликт | конфликт между группами, который часто сплачивает каждую группу изнутри | разработчики против эксплуатации: кто виноват в падении сервиса |
> Как запомнить: **S-S-R-N-L-C-I** — «**S**mall **S**tartups **R**arely **N**eed **L**arge **C**orporate **I**nfrastructure»: Structure, Status hierarchy, Roles, Norms, Leadership, Cohesiveness, Intergroup conflict.
- Характеристики группы дают **определённую предсказуемость (predictability)** — это важно и для самой группы, и для внешних сторон (например, **руководства, других групп**). **Нестабильная или непредсказуемая группа — проблема** и для её участников, и для всех, кто с ней взаимодействует.
- **Пример из IT:** платформенной команде с ясными нормами и ролями можно доверить дедлайн; команда, которая каждый месяц меняет техлида и не имеет общих правил, лишает владельца продукта возможности планировать.
## Сплочённость (cohesiveness)
- **У каждой группы есть какая-то степень сплочённости.** Эта **привлекательность группы** может быть **мощной силой, влияющей на поведение и результаты отдельного человека**.
- Исследования показывают, что **сплочённые группы могут вырабатывать цели и нормы, не совпадающие с целями и нормами руководства**.
- Когда цели и нормы группы **не согласуются (incongruent)** с целями организации, **необходимо то или иное вмешательство руководства (managerial intervention)**.
Учебник Gibson добавляет, что бывает, когда сплочённость сочетается с согласием или несогласием с целями организации (сверх слайдов):
| | Согласие с целями организации | Несогласие с целями организации |
|---|---|---|
| **Высокая сплочённость** | результативность, скорее всего, сильно растёт | результативность, скорее всего, падает — группа сплочённо идёт против целей |
| **Низкая сплочённость** | результативность может умеренно вырасти | на результативность почти не влияет |
- **Пример из IT:** сплочённая бэкенд-команда принимает норму «тесты нас тормозят — пропускаем». Команда лояльна и быстро выпускает функции, но норма противоречит цели руководства по качеству. Сплочённость лишь усиливает плохую норму, поэтому менеджер должен вмешаться: объяснить цель, изменить стимулы, привести сторонника качества.
> Ловушка экзамена: сплочённость **не всегда хороша**. Сильно сплочённая группа, чьи цели расходятся с целями руководства, — именно тот случай, когда, по слайду, **вмешательство руководства необходимо**.
## Групповое мышление (groupthink)
> **Групповое мышление (groupthink)** — стремление участников **сплочённой** группы **быть в согласии**, которое **берёт верх над рассмотрением решений** проблем или ситуаций, **спорных** или таких, где **единогласие невозможно**.
- Ключевые слова: **сплочённые** участники, стремление к **согласию**, которое **берёт верх (supersedes)** над настоящим обсуждением спорных вариантов.
- Типичные симптомы (Janis, сверх слайдов): иллюзия неуязвимости, коллективная рационализация, давление на несогласных, самоцензура, иллюзия единодушия, «стражи мышления» (mindguards), ограждающие группу от плохих новостей.
- **Пример из IT:** дружная команда выкатывает релиз в пятницу, хотя нагрузочные тесты провалены; никто не возражает, потому что «мы всегда согласны» и никто не хочет быть тем, кто испортит релиз.
- Как лечить (сверх слайдов): назначить «адвоката дьявола», дать лидеру говорить последним, позвать внешнего ревьюера, голосовать анонимно, провести pre-mortem.
> Ловушка экзамена: групповое мышление — риск **высокой** сплочённости, а не низкой. И это не storming (открытый конфликт): групповое мышление — это *отсутствие* несогласия.
## Команды (teams)
**Команды — особый вид целевой группы (special type of task group).** В организациях есть три распространённые категории команд:
| # | Тип команды | Что это (Gibson) | Пример из IT |
|---|---|---|---|
| 1 | **Problem-solving teams** — команды по решению проблем | несколько сотрудников, обычно из одного отдела, которые по несколько часов в неделю обсуждают, как улучшить качество, эффективность или условия работы; в основном рекомендуют, а не внедряют | еженедельная группа разбора инцидентов в отделе поддержки, предлагающая исправления |
| 2 | **Cross-functional teams** — кросс-функциональные команды | сотрудники примерно одного уровня иерархии, но **из разных областей работы**, объединённые для выполнения задачи | бэкендер, дизайнер, QA-инженер и маркетолог запускают новую оплату |
| 3 | **Self-directed work teams** — самоуправляемые рабочие команды | сотрудники с тесно связанной работой, которые **берут на себя многие обязанности бывших руководителей** — планирование, график, распределение работы | сквад, который сам планирует спринты, распределяет задачи и назначает релизы |
**Зачем менеджеры создают команды.** Менеджеры создают команды **прежде всего, чтобы повысить производительность (predominantly to enhance productivity)**. Команды возникают также из-за:
- **уплощения организаций (flattening organizations)**;
- **потребности в гибкости и быстрых решениях (need for flexibility and quick decisions)**;
- **разнообразия персонала (workforce diversity)**;
- **повышения качества (improved quality)**;
- **роста удовлетворённости клиентов (increased customer satisfaction)**.
**Требования к эффективным командам (requirements for effective teams):**
- **приверженность высшего руководства (top-level commitment)** и **ясные цели (clear goals)**;
- **доверие между руководством и сотрудниками (management–employee trust)**;
- **готовность рисковать и делиться информацией (willingness to take risks and share information)**;
- **время, ресурсы и приверженность обучению (time, resources, and a commitment to training)**.
> Ловушка экзамена: **главная** причина — **производительность**; остальные (уплощение, гибкость, разнообразие, качество, удовлетворённость клиентов) — дополнительные. Плотного надзора за каждым участником **нет** среди требований — там доверие.
## Роли и ролевой набор (role set)
> Понятие **роли (role)** необходимо для понимания поведения групп. **Роль** — это **ожидаемые модели поведения, приписываемые определённой позиции (expected behavior patterns attributed to a particular position)**.
- Большинство людей **исполняют несколько ролей**, и у каждой свой **ролевой набор (role set)** — **ожидания других людей от этой роли (others' expectations for the role)**.
- Человек, у которого много разных ролей, и у каждой сложный ролевой набор, сталкивается с **предельной сложностью индивидуального поведения (the ultimate in complexity of individual behavior)**.
- В организациях может быть до **трёх восприятий одной и той же роли**: **организации, группы и самого человека (the organization's, the group's, and the individual's)**.
| Восприятие | Роль техлида глазами… |
|---|---|
| Организации (the organization's) | компании: сдавать в срок, докладывать статус PM, держать архитектуру целостной |
| Группы (the group's) | команды: защищать нас от давления, снимать блокировки, быстро ревьюить код |
| Самого человека (the individual's) | самой техлида: «я архитектор — самый сложный код должна писать я» |
- **Пример ролевого набора:** в ролевой набор QA-инженера входят разработчики (ждут быстрых проверок), PM (ждёт ясного вердикта о релизе) и заказчик (ждёт ноль критических багов).
## Ролевой конфликт (role conflict)
> Когда человек сталкивается с **двумя или более одновременными ролевыми требованиями**, при которых **выполнение одного исключает выполнение другого (других)**, он переживает **ролевой конфликт**.
В организациях бывают три разных типа ролевого конфликта:
| Тип | Где столкновение | Пример из IT |
|---|---|---|
| **Person–role conflict** — конфликт «личность — роль» | между **требованиями роли** и **собственными ценностями, установками или потребностями человека** | QA-инженеру велят пометить известные критические баги как «minor», чтобы релиз прошёл; это нарушает её профессиональную этику |
| **Intrarole conflict** — внутриролевой конфликт | **внутри одной роли**: разные люди из ролевого набора ждут от одной роли противоположного | руководитель хочет, чтобы тимлид загнала команду в сверхурочные, а команда ждёт, что она их от этого защитит |
| **Interrole conflict** — межролевой конфликт | **между двумя или более ролями** одного и того же человека | разработчик на этой неделе дежурит и вдобавок магистрант, у которого экзамен в ту же ночь |
> Как запомнить: **person–role** — «я против своей роли»; **intra**role — «внутри одной роли» (intra = внутри); **inter**role — «между моими ролями» (inter = между).
- **Последствия:** руководство может **сократить некоторые типы ролевых конфликтов** и должно **постоянно помнить**, что последствия конфликта для организации могут включать **неэффективную работу отдельных людей и групп**. (Gibson добавляет, что для самого человека ролевой конфликт оборачивается тревогой, фрустрацией и меньшей удовлетворённостью работой.)
> Ловушка экзамена: фраза на последнем слайде искажена («Research has shown that consequences of role conflict to Management can minimize…»). Смысл по учебнику: исследования показывают последствия ролевого конфликта для человека; руководство может сокращать некоторые типы ролевых конфликтов и должно помнить, что последствия для организации включают неэффективную работу людей и групп.
?? Сильно сплочённая команда приняла норму «никогда не оценивать честно — всегда закладывать +100%». Что, по лекции, должно произойти?
?= Сплочённые группы могут вырабатывать нормы, не совпадающие с нормами руководства; когда цели и нормы группы не согласуются с целями организации, необходимо то или иное вмешательство руководства.
?? Руководитель велит разработчику выкатить код, который тот считает небезопасным, и разработчик из принципа отказывается. Какой это тип ролевого конфликта и чем от него отличался бы внутриролевой?
?= Конфликт «личность — роль» (person–role): требование роли сталкивается с его собственными ценностями. Внутриролевой (intrarole) — это когда разные люди из его ролевого набора (скажем, руководитель и команда) ждут от одной роли противоположного.
?? Назовите три категории команд и главную причину, по которой менеджеры создают команды.
?= Problem-solving teams, cross-functional teams и self-directed work teams; менеджеры создают команды прежде всего для повышения производительности.
## Что спросят на экзамене (Exam focus)
- **Семь характеристик**: structure, status hierarchy, roles, norms, leadership, cohesiveness, intergroup conflict; в неформальной группе — возникают изнутри, в формальной — устанавливаются управленческим процессом; они дают **предсказуемость**.
- Сплочённые группы могут вырабатывать цели и нормы, **расходящиеся с целями руководства**, → нужно **вмешательство руководства**.
- **Групповое мышление (groupthink)**: стремление сплочённых участников к согласию берёт верх над рассмотрением спорных решений.
- Команды — особый вид **целевой группы (task group)**; три категории: **problem-solving, cross-functional, self-directed work teams**; создаются **прежде всего ради производительности** (а также уплощение, гибкость и быстрые решения, разнообразие, качество, удовлетворённость клиентов).
- Требования к эффективным командам: приверженность высшего руководства и ясные цели; доверие между руководством и сотрудниками; готовность рисковать и делиться информацией; время, ресурсы и обучение.
- **Роль** — ожидаемые модели поведения позиции; **ролевой набор** — ожидания других от роли; **три восприятия**: организации, группы, самого человека.
- Типы **ролевого конфликта**: **person–role, intrarole, interrole** — умейте классифицировать короткий кейс.`,
  },
  [
    qx("Which of the following is NOT one of the group characteristics listed in the lecture?", "Physical proximity", [
      ["Status hierarchy", "Status hierarchy is the second characteristic in the list.", "Status hierarchy — вторая характеристика в списке."],
      ["Cohesiveness", "Cohesiveness is listed, and the lecture discusses it at length.", "Cohesiveness в списке есть, и лекция подробно её разбирает."],
      ["Intergroup conflict", "Intergroup conflict is the last item of the seven characteristics.", "Intergroup conflict — последняя из семи характеристик."],
    ], "Characteristics: structure, status hierarchy, roles, norms, leadership, cohesiveness, intergroup conflict. Physical proximity is a reason why groups form, not a characteristic.", "Характеристики: structure, status hierarchy, roles, norms, leadership, cohesiveness, intergroup conflict. Physical proximity — причина возникновения групп, а не характеристика."),
    qx("According to the lecture, where do group characteristics come from in informal and formal groups?", "Informal: from within the unit; formal: by the managerial process", [
      ["Informal: set by managers; formal: emerge from within the unit", "This reverses the slide: managers establish characteristics in formal groups, not informal ones.", "Это переворачивает слайд: руководство задаёт характеристики формальных групп, а не неформальных."],
      ["Both: set only by the group's elected or emergent leader", "The slide does not attribute them to a leader; it contrasts emergence from within with the managerial process.", "Слайд не приписывает их лидеру; он противопоставляет возникновение изнутри и управленческий процесс."],
      ["Both: copied directly from the organization's written policy manual", "Informal groups do not take their characteristics from any policy; they emerge from within the unit.", "Неформальные группы не берут характеристики из регламентов; они возникают изнутри группы."],
    ], "Slide: these characteristics pervade all groups. In an informal group, they emerge from within the unit; in a formal group, they are established by the managerial process.", "Слайд: эти характеристики есть во всех группах. В неформальной группе они возникают изнутри, в формальной — устанавливаются управленческим процессом."),
    qx("Why are group characteristics important, according to the lecture?", "They provide a degree of predictability to members and outsiders", [
      ["They guarantee that the group's goals always match management's goals", "The lecture warns that cohesive groups may set goals that do not agree with management's.", "Лекция предупреждает, что сплочённые группы могут ставить цели, не совпадающие с целями руководства."],
      ["They prevent role conflict among members of formal groups", "Role conflict can still occur in any group; characteristics do not prevent it.", "Ролевой конфликт возможен в любой группе; характеристики его не предотвращают."],
      ["They make managerial intervention in the group unnecessary", "The lecture says intervention is necessary when group goals and norms are incongruent with the organization's.", "Лекция говорит, что вмешательство необходимо, когда цели и нормы группы не согласуются с целями организации."],
    ], "Slide: group characteristics provide a degree of predictability for the members that is important to the group and to the outside (management, other groups); an unpredictable group is a problem.", "Слайд: характеристики дают предсказуемость, важную для самой группы и для внешних сторон (руководства, других групп); непредсказуемая группа — проблема."),
    qx("Research cited in the lecture says cohesive groups can formulate goals and norms that differ from management's. What follows when they are incongruent?", "Some form of managerial intervention is necessary", [
      ["The group should be disbanded and re-formed at once", "The slide calls for intervention, not for disbanding the group.", "Слайд требует вмешательства, а не роспуска группы."],
      ["Cohesiveness alone guarantees high performance anyway", "High cohesiveness with disagreeing goals is exactly the risky case; it does not guarantee performance.", "Высокая сплочённость при несовпадающих целях — как раз опасный случай; результата она не гарантирует."],
      ["Management should adopt the group's norms as its own", "Adopting the group's conflicting norms would abandon the organization's goals.", "Принять конфликтующие нормы группы — значит отказаться от целей организации."],
    ], "Slide: when a group's goals and norms are incongruent with the organization's, some form of managerial intervention is necessary.", "Слайд: когда цели и нормы группы не согласуются с целями организации, необходимо то или иное вмешательство руководства."),
    qx("Groupthink is best defined as:", "A desire for agreement that supersedes weighing controversial options", [
      ["Open conflict over roles and leadership positions in a newly formed group", "Open conflict over roles is the storming stage — the opposite of groupthink's false harmony.", "Открытый конфликт за роли — это стадия storming, противоположность ложной гармонии группового мышления."],
      ["A conflict between two or more roles that one person holds at once", "That is interrole conflict, an individual's problem, not a group's thinking pattern.", "Это межролевой конфликт — проблема человека, а не способ мышления группы."],
      ["Conflict between two groups competing for the same resources", "That is intergroup conflict, one of the seven group characteristics.", "Это межгрупповой конфликт — одна из семи характеристик групп."],
    ], "Slide: groupthink is the desire among cohesive group members to be in agreement, which supersedes considering solutions to problems that are controversial or in which unanimous agreement is not possible.", "Слайд: групповое мышление — стремление сплочённых участников к согласию, которое берёт верх над рассмотрением спорных решений или таких, где единогласие невозможно."),
    qx("According to the lecture, when does an individual experience role conflict?", "When meeting one simultaneous role requirement precludes the others", [
      ["When the group's norms are incongruent with the organization's goals", "That is the cohesiveness problem that calls for managerial intervention, not role conflict.", "Это проблема сплочённости, требующая вмешательства руководства, а не ролевой конфликт."],
      ["When cohesive members value agreement above critical discussion", "That describes groupthink.", "Это описание группового мышления (groupthink)."],
      ["When two groups compete for the same people and resources", "That is intergroup conflict, between groups rather than within one person's roles.", "Это межгрупповой конфликт — между группами, а не внутри ролей одного человека."],
    ], "Slide: when an individual faces two or more simultaneous role requirements for which the performance of one precludes performance of the other(s), she experiences role conflict.", "Слайд: когда человек сталкивается с двумя или более одновременными ролевыми требованиями и выполнение одного исключает выполнение других, он переживает ролевой конфликт."),
    tfx("Groupthink is mainly a risk in groups with low cohesiveness.", false,
      "The slide defines groupthink as the desire among cohesive group members to be in agreement — it is a risk of high cohesiveness.",
      "Слайд определяет групповое мышление как стремление сплочённых участников к согласию — это риск высокой сплочённости.",
      "\"True\" reverses the link: weakly cohesive groups have little pressure to agree, so they rarely suppress controversial options.",
      "«Верно» переворачивает связь: в слабо сплочённых группах мало давления к согласию, поэтому спорные варианты там редко подавляют."),
    tfx("Teams are a special type of task group.", true,
      "The summary slide says exactly this: teams are a special type of task group, with three common categories.",
      "Итоговый слайд говорит именно это: команды — особый вид целевой группы, с тремя распространёнными категориями.",
      "\"False\" would place teams elsewhere (e.g. among informal or command groups); the slide ties them to task groups.",
      "«Неверно» отнесло бы команды куда-то ещё (например, к неформальным группам или группам подчинения); слайд связывает их с целевыми группами."),
    qx("Which of the following is NOT one of the three common categories of teams named in the lecture?", "Virtual project teams", [
      ["Problem-solving teams", "Problem-solving teams are category 1 on the slide.", "Problem-solving teams — первая категория на слайде."],
      ["Cross-functional teams", "Cross-functional teams are category 2 on the slide.", "Cross-functional teams — вторая категория на слайде."],
      ["Self-directed work teams", "Self-directed work teams are category 3 on the slide.", "Self-directed work teams — третья категория на слайде."],
    ], "Slide: three common categories — (1) problem-solving teams, (2) cross-functional teams, (3) self-directed work teams. Virtual teams exist in practice but are not one of the three on the slide.", "Слайд: три категории — (1) problem-solving, (2) cross-functional, (3) self-directed work teams. Виртуальные команды на практике бывают, но в эту тройку на слайде не входят."),
    qx("For a new checkout feature, management brings together a backend developer, a designer, a QA engineer and a marketer — all at about the same level, from different departments. What type of team is this?", "A cross-functional team", [
      ["A problem-solving team", "Problem-solving teams usually come from one department and mainly discuss improvements; this team delivers a task across areas.", "Команды по решению проблем обычно из одного отдела и в основном обсуждают улучшения; эта команда выполняет задачу на стыке областей."],
      ["A self-directed work team", "Nothing says they took over their supervisors' duties; the defining feature here is different work areas.", "Ничего не говорит о том, что они взяли на себя обязанности руководителей; определяющая черта здесь — разные области работы."],
      ["A command group", "A command group is a manager with direct subordinates; these people come from different departments.", "Группа подчинения — руководитель с прямыми подчинёнными; эти люди из разных отделов."],
    ], "Employees from about the same hierarchical level but different work areas, brought together to accomplish a task, form a cross-functional team.", "Сотрудники примерно одного уровня, но из разных областей, собранные для выполнения задачи, — кросс-функциональная команда."),
    qx("A squad of nine engineers plans its own work, assigns tasks and schedules releases, taking over duties their former supervisor used to have. Which team type is this?", "A self-directed work team", [
      ["A cross-functional team", "Cross-functional describes members from different work areas; the key point here is taking over supervisory duties.", "Cross-functional — про участников из разных областей; главное здесь — перенятые обязанности руководителя."],
      ["A problem-solving team", "Problem-solving teams meet a few hours a week to recommend improvements; they do not run their own work.", "Команды по решению проблем собираются на несколько часов в неделю, чтобы рекомендовать улучшения; своей работой они не управляют."],
      ["An informal interest group", "The squad does its regular job inside the organization's structure; it is not an informal group.", "Сквад выполняет обычную работу в структуре организации; это не неформальная группа."],
    ], "Self-directed work teams take on many responsibilities of their former supervisors: planning, scheduling and assigning work.", "Самоуправляемые рабочие команды берут на себя многие обязанности бывших руководителей: планирование, график, распределение работы."),
    qx("According to the lecture, managers form teams predominantly to:", "Enhance productivity", [
      ["Reduce workforce diversity", "Workforce diversity is a reason teams form, not something teams are meant to reduce.", "Разнообразие персонала — причина появления команд, а не то, что команды должны сокращать."],
      ["Add hierarchical levels", "Teams are linked to flattening organizations, not to adding levels.", "Команды связаны с уплощением организаций, а не с добавлением уровней."],
      ["Avoid training costs", "Effective teams require a commitment to training, so avoiding it is the opposite.", "Эффективным командам нужна приверженность обучению, так что экономия на нём — обратное."],
    ], "Slide: managers form teams predominantly to enhance productivity.", "Слайд: менеджеры создают команды прежде всего для повышения производительности."),
    qx("Besides enhancing productivity, teams form for several other reasons. Which is NOT one of them?", "A need for more levels of hierarchy", [
      ["Flattening organizations", "Flattening organizations is one of the listed reasons.", "Уплощение организаций — одна из перечисленных причин."],
      ["Need for flexibility and quick decisions", "This is listed on the slide.", "Это есть в списке на слайде."],
      ["Increased customer satisfaction", "This is the last reason on the slide's list.", "Это последняя причина в списке слайда."],
    ], "Teams also form due to flattening organizations, need for flexibility and quick decisions, workforce diversity, improved quality, and increased customer satisfaction — fewer levels, not more.", "Команды возникают также из-за уплощения организаций, потребности в гибкости и быстрых решениях, разнообразия персонала, повышения качества и удовлетворённости клиентов — уровней меньше, а не больше."),
    qx("Which of the following is NOT one of the requirements for effective teams listed in the lecture?", "Close supervision of each member's daily tasks", [
      ["Top-level commitment and provision of clear goals", "This is the first requirement on the slide.", "Это первое требование на слайде."],
      ["Management–employee trust", "Trust between management and employees is a listed requirement.", "Доверие между руководством и сотрудниками — одно из требований."],
      ["Time, resources, and a commitment to training", "This is the last requirement on the slide.", "Это последнее требование на слайде."],
    ], "Requirements: top-level commitment and clear goals; management–employee trust; willingness to take risks and share information; time, resources and a commitment to training. Close supervision contradicts trust.", "Требования: приверженность высшего руководства и ясные цели; доверие между руководством и сотрудниками; готовность рисковать и делиться информацией; время, ресурсы и обучение. Плотный надзор противоречит доверию."),
    qx("In the lecture, a role is defined as:", "The expected behavior patterns attributed to a particular position", [
      ["The standards of behavior that are shared by all members of a group", "Shared standards of behavior are norms, a different group characteristic.", "Разделяемые стандарты поведения — это нормы, другая характеристика группы."],
      ["The ranking of the group's positions according to prestige and status", "Ranking by prestige is the status hierarchy.", "Ранжирование по престижу — это статусная иерархия."],
      ["Others' expectations for a role held by one particular person", "Others' expectations for the role form the role set, not the role itself.", "Ожидания других от роли — это ролевой набор, а не сама роль."],
    ], "Slide: a role consists of the expected behavior patterns attributed to a particular position.", "Слайд: роль — это ожидаемые модели поведения, приписываемые определённой позиции."),
    qx("What is a role set, according to the lecture?", "Others' expectations for the role", [
      ["All the roles one person performs", "Performing many roles is \"multiple roles\"; each of them has its own role set.", "Исполнение многих ролей — это «multiple roles»; у каждой из них свой ролевой набор."],
      ["The formal job description of a role", "A job description is the organization's document, not the expectations of the people around the role.", "Должностная инструкция — документ организации, а не ожидания людей вокруг роли."],
      ["The group's shared standards", "Shared standards are group norms.", "Разделяемые стандарты — это нормы группы."],
    ], "Slide: most individuals perform multiple roles, each with its own role set (others' expectations for the role).", "Слайд: большинство людей исполняют несколько ролей, у каждой свой ролевой набор (ожидания других людей от этой роли)."),
    qx("How many perceptions of the same role may exist in organizations, and whose are they?", "Three: the organization's, the group's and the individual's", [
      ["Two: the manager's view and the subordinate's own view of it", "The slide names three perceptions, and the group's view is one of them.", "Слайд называет три восприятия, и восприятие группы — одно из них."],
      ["Three: the customer's, the project manager's and the user's", "These are cost influencers from Fig. 2, not perceptions of a role.", "Это люди, влияющие на затраты, с рис. 2, а не восприятия роли."],
      ["Four: the expected, perceived, enacted and ideal roles", "The slide says as many as three, and names them by owner: organization, group, individual.", "Слайд говорит «до трёх» и называет их по владельцу: организация, группа, человек."],
    ], "Slide: in organizations, there may be as many as three perceptions of the same role: the organization's, the group's, and the individual's.", "Слайд: в организациях может быть до трёх восприятий одной роли: организации, группы и самого человека."),
    qx("A QA engineer is told by her manager to label known critical bugs as \"minor\" so the release can pass. This violates her professional values. Which type of role conflict is this?", "Person–role conflict", [
      ["Intrarole conflict", "Intrarole conflict needs different people expecting contradictory things from one role; here the clash is with her own values.", "Для внутриролевого конфликта нужны разные люди с противоположными ожиданиями от одной роли; здесь столкновение с её собственными ценностями."],
      ["Interrole conflict", "Interrole conflict is between two roles she holds; only one role is involved here.", "Межролевой конфликт — между двумя её ролями; здесь задействована одна роль."],
      ["Intergroup conflict", "Intergroup conflict is between groups, not between a person and her role.", "Межгрупповой конфликт — между группами, а не между человеком и его ролью."],
    ], "When a role's requirements violate the person's own values, attitudes or needs, the result is person–role conflict.", "Когда требования роли нарушают собственные ценности, установки или потребности человека, возникает конфликт «личность — роль» (person–role)."),
    qx("A team lead's manager expects her to push the team into overtime, while the team expects her to protect them from overtime. Which type of role conflict is this?", "Intrarole conflict", [
      ["Interrole conflict", "Only one role is involved — team lead; interrole conflict needs two different roles.", "Задействована одна роль — тимлид; для межролевого конфликта нужны две разные роли."],
      ["Person–role conflict", "The clash is between two sets of expectations from others, not with her own values.", "Столкновение — между двумя наборами чужих ожиданий, а не с её собственными ценностями."],
      ["Groupthink", "Groupthink is a group's drive for agreement, not one person's conflicting expectations.", "Групповое мышление — стремление группы к согласию, а не противоречивые ожидания к одному человеку."],
    ], "Different members of her role set (manager vs team) hold contradictory expectations of the same role — intrarole conflict.", "Разные люди из её ролевого набора (руководитель и команда) ждут от одной роли противоположного — это внутриролевой конфликт (intrarole)."),
    qx("A developer is the on-call engineer this week and also a master's student with an exam the same night; he cannot do both. Which type of role conflict is this?", "Interrole conflict", [
      ["Intrarole conflict", "Intrarole conflict is inside one role; here two different roles (engineer and student) collide.", "Внутриролевой конфликт — внутри одной роли; здесь сталкиваются две разные роли (инженер и студент)."],
      ["Person–role conflict", "Nothing here violates his values; two role requirements simply cannot both be met.", "Здесь ничто не нарушает его ценностей; просто два ролевых требования нельзя выполнить одновременно."],
      ["Intergroup conflict", "Intergroup conflict is between groups, not between one person's roles.", "Межгрупповой конфликт — между группами, а не между ролями одного человека."],
    ], "Two roles held by the same person make simultaneous demands, and performing one precludes the other — interrole conflict.", "Две роли одного человека предъявляют одновременные требования, и выполнение одного исключает другое — межролевой конфликт (interrole)."),
  ],
);

export const lecture4: Lecture = {
  id: "pm-l4",
  title: { en: "Lecture 4 — Cost Control and Group Behavior", ru: "Лекция 4 — Контроль затрат и поведение групп" },
  parts: [p1, p2, p3, p4],
};
