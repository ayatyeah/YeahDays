import { part, qx, tfx, type Lecture } from "../types";

/*
 * Лекция 6 PM — «Agile Principles and Mindset» (50 слайдов). Источник слайдов —
 * Griffiths, «PMI-ACP Exam Prep» (2nd ed., 2018), главы 1–2.
 * Только картинками на слайдах (в тексте PDF их нет) и перенесено в конспект:
 * таблица «Industrial vs Knowledge Work» (7 строк); рисунок Sidky «Being Agile
 * Versus Doing Agile»; «Inverted Triangle Model» (традиционный и agile треугольник);
 * картинка Agile Manifesto (на ней «Working Product» вместо «Working software»);
 * «Scrum Process» (Sprint 2–4 weeks, вопросы daily scrum, содержание planning/review/
 * retro); «XP Life Cycle»; таблица «7 Wastes of Lean» (на слайде только 6 строк —
 * седьмая, Waiting, взята из Griffiths и помечена); «Kanban/task board»;
 * «Feature-driven development process»; «DSDM method»; «Crystal family of methods»
 * (Clear 1–6 … Magenta 101–200, критичность Comfort/Discretionary/Essential/Life);
 * «Agile Process Overview» (Sidky: Feasibility → Initiation → Release Planning →
 * Iterations → Pre-Release → Close Out).
 * Неоднозначности слайдов отмечены в конспекте строками «Exam trap»: «One month of
 * lesson» (опечатка, «one month or less»), «one or two-week» против «2–4 weeks» на
 * рисунке, 6 строк в таблице «7 wastes», четыре обязанности servant leader на слайде
 * с заголовком «Management Versus Leadership».
 */

const p1 = part(
  "pm-l6-p1",
  { en: "Why agile? Knowledge work and the agile mindset", ru: "Зачем agile? Интеллектуальный труд и agile-мышление" },
  {
    en: `## Why use agile?
**Different types of projects require different methods.** There is no single "best" life cycle: a method fits some projects and not others.
Agile is **ideal for knowledge worker projects that occur in a fast-moving, complex environment** — where requirements change, technology is new and the right solution is discovered along the way.
| Project | Environment | Better fit |
|---|---|---|
| Building a bridge or a warehouse | stable requirements, proven engineering, changes are very expensive once construction starts | plan-driven (predictive) approach |
| A new mobile banking app | user needs are unclear, competitors release every week, technology changes | agile |
| Moving 200 servers to a new data center by a ready checklist | known steps, repeatable work | mostly plan-driven, agile elements possible |
| An ML recommendation feature nobody in the company has built before | high uncertainty, experiments are needed | agile |
> Key idea: agile is a choice for a certain kind of project — knowledge work under uncertainty — not a universal replacement for every other method.
## Knowledge workers
> **Knowledge worker:** person with subject matter expertise who communicates their knowledge and takes part in analysis and/or development efforts. Examples: engineers, teachers, scientists, doctors, etc.
Software developers, testers, business analysts, UX designers and data scientists are all knowledge workers: their main "raw material" is information and their main tool is their head.
**Knowledge worker projects are different.** The slide contrasts industrial work (the factory model on which classic management was built) with knowledge work:
| Characteristics of industrial work | Characteristics of knowledge work | What it means for a software team |
|---|---|---|
| Work is visible | Work is invisible | you cannot "see" 60% of a feature, so agile teams make work visible with task boards and burn charts |
| Work is stable | Work is changing | requirements and technology shift during the project |
| More structure with fewer decisions | Less structure with more decisions | developers make dozens of design decisions every day |
| Define the task | Understand the task | the team must first understand the user's problem, not just receive a task description |
| Strict standards | Continuous innovation | every feature is new; repeating yesterday's work is rare |
| Focus on quantity | Focus on quality | 1,000 lines of code are not better than 100 good ones |
| Focus on the right answers | Focus on the right questions | asking "what problem are we solving?" matters more than a quick answer |
> Exam trap: every item in the left column is **industrial** work. A distractor such as "Work is visible" or "Focus on quantity" offered as a feature of knowledge work is wrong.
## Defined versus empirical processes
> **Defined process:** defines the constituent steps in advance, as construction projects.
> **Empirical process:** iterative and incremental, as with new or uncertain projects.
| | Defined process | Empirical process |
|---|---|---|
| Steps | known and fixed in advance | discovered as the work goes on |
| How it is controlled | follow the plan and compare against it | short cycles: try, inspect the result, adapt |
| Same inputs give | the same outputs (repeatable) | different outputs; the outcome is uncertain |
| Typical example | construction project, assembly line | new software product, research, new technology |
| Fits | industrial work | knowledge work |
- **Iterative** means the team repeats a cycle (plan → build → review) and refines the product each time. **Incremental** means the product is delivered in usable pieces that add up over time. Agile is both.
- Empirical control is exactly what Scrum's three pillars describe (transparency, inspection, adaptation — Part 3).
- IT example: a team builds a chatbot on top of an LLM. Nobody knows in advance which prompt design will work, so they release a small version to 50 users, measure the answers, adjust and repeat — an empirical process. Setting up the same office network in the tenth branch by a checklist is a defined process.
## The agile mindset — Declaration of Interdependence
General characteristics of the agile mindset as written in the **Declaration of Interdependence** (2005, written by a group of agile project leaders as a companion to the Manifesto, aimed at managing projects):
| # | Characteristic (slide) | How — in the words of the Declaration | IT example |
|---|---|---|---|
| 1 | Increase return on investment | by making continuous flow of value our focus | release the most valuable features first so they start earning early |
| 2 | Deliver reliable results | by engaging customers in frequent interactions and shared ownership | the client sees a demo every two weeks and co-decides priorities |
| 3 | Expect uncertainty | and manage for it through iterations, anticipation and adaptation | plan in short iterations because requirements will move anyway |
| 4 | Unleash creativity and innovation | by recognizing that individuals are the ultimate source of value | developers decide how to implement a story |
| 5 | Boost performance | through group accountability for results and shared responsibility for team effectiveness | the sprint result belongs to the team, not to one hero |
| 6 | Improve effectiveness and reliability | through situationally specific strategies, processes and practices | a 3-person startup and a bank do not run identical processes |
> Memory hook: **"ROI, Results, Uncertainty, Creativity, Performance, Effectiveness"** — money, delivery, risk, people, team, fit.
> Exam trap: these six come from the **Declaration of Interdependence**, not from the Agile Manifesto (which has 4 values and 12 principles) and not from the Scrum Guide.
## Being agile versus doing agile
The figure (Ahmed Sidky) states: **agile is a mindset, defined by values, guided by principles, and manifested through many different practices.** It is drawn as circles: the mindset (a star) in the centre, then values (diamonds), then principles (triangles), and many practices (dots) on the outside.
| | "Being" agile | "Doing" agile |
|---|---|---|
| Verdict on the slide | the correct way to implement agile | an ineffective way to implement agile |
| Where it starts | internalizing the agile mindset | adopting agile practices |
| How practices are chosen | that understanding is used to select and implement the correct practices, tailoring them to different situations as needed | practices are used without embracing the mindset that lets us understand how to select the right balance of practices and tailor them appropriately |
| Direction in the figure | from the centre outward (mindset → practices) | from the outside inward (practices only) |
- **Doing agile, IT example:** a company renames status meetings "daily stand-ups", buys Jira and calls two-week deadlines "sprints", but the manager still assigns every task and punishes bad news. The practices are there; the mindset is not.
- **Being agile, IT example:** a team understands *why* short feedback loops matter, so when it sees that a two-week sprint is too long for an urgent support stream, it moves that stream to a Kanban board — it tailors the practice to the situation.
## Personal, team and organizational agility
- **The more people embrace and act upon agile principles, the more effective they will be.**
- **Organizations change through influence exerted by individuals.** Agility spreads from a person to a team and from teams to the organization.
| Step | Slide wording | Example |
|---|---|---|
| Think | individually learning and internalizing agile principles | a developer reads the Manifesto and understands why working software is the measure of progress |
| Do | doing the practice of agile | she starts showing working features to the product owner every week |
| Encourage others | encourage others to become agile | she helps a neighbouring team run its first retrospective |
> Memory hook: **Think → Do → Encourage others** — learn it, live it, spread it. The order starts with the individual mind, which is the same message as "being agile".
## The agile triangle (inverted triangle model)
- **Agile teams allow scope to vary within the fixed parameters of cost and time.**
- **Knowledge worker projects are characterized by experimentation and uncertainty**, so fixing the full scope up front is unrealistic.
@diagram pm6-inverted-triangle
| | Traditional triangle of constraints | Agile triangle of constraints (inverted) |
|---|---|---|
| Fixed | scope (top of the triangle) | cost and time (top of the inverted triangle) |
| Variable | time and cost | scope |
| Planning question | "how long and how much will it take to build all of this scope?" | "what is the most valuable scope we can deliver with this team, budget and date?" |
| When reality changes | change requests, re-planning, a new budget or deadline | re-prioritize the backlog; lower-priority features move out |
| Risk for the customer | late or over-budget delivery | some low-priority features are not delivered |
- **Worked example:** a team of 5 developers, a budget for 12 weeks and a fixed launch date for a food-delivery app. The backlog has 40 features. The team builds them in priority order (ordering and payment first, loyalty badges last). If after 12 weeks 31 features are done, the app launches on time and on budget with the 31 most valuable features; the other 9 are dropped or moved to a later release.
= traditional: scope fixed -> time & cost vary | agile: cost & time fixed -> scope varies
> Exam trap: in the inverted model scope is not "uncontrolled". It varies **by priority**, so the most valuable work is always done first. And it is **cost and time** that are fixed — not "cost and scope" and not "time and scope".
?? A client says: "I need exactly these 60 features, but I'm not sure about the deadline or the budget." Which triangle is the client describing?
?= The traditional triangle: scope is fixed, time and cost are variable. An agile team would rather fix the team (cost) and the release date (time) and let scope vary by priority.
?? A company introduces stand-ups, sprints and Jira, but managers still assign every task and nobody may change the process. Is this being or doing agile?
?= Doing agile: practices are used without the mindset, so the team cannot select and tailor practices. Being agile starts by internalizing the mindset.
?? Which process — defined or empirical — fits setting up the tenth identical branch network by a checklist, and which fits an LLM-based chatbot?
?= The branch network is a defined process (steps known in advance); the chatbot is an empirical process (iterative and incremental, because the outcome is uncertain).
## Exam focus
- Agile is **ideal for knowledge worker projects in a fast-moving, complex environment**; different types of projects require different methods.
- Knowledge worker = **subject matter expertise + communicates knowledge + analysis and/or development**; examples: engineers, teachers, scientists, doctors.
- Industrial vs knowledge work: visible/invisible, stable/changing, more structure–fewer decisions / less structure–more decisions, define/understand the task, strict standards/continuous innovation, quantity/quality, right answers/right questions.
- **Defined** = steps defined in advance (construction); **empirical** = iterative and incremental (new or uncertain projects).
- Six mindset characteristics (Declaration of Interdependence): ROI, reliable results, expect uncertainty, creativity and innovation, boost performance, effectiveness and reliability.
- Mindset → values → principles → practices; **being** agile = correct (mindset first), **doing** agile = ineffective (practices without the mindset).
- Organizational change: **Think → Do → Encourage others**; organizations change through influence exerted by individuals.
- Inverted triangle: the **traditional triangle fixes scope**; the **agile triangle fixes cost and time and lets scope vary**.`,
    ru: `## Зачем использовать agile?
**Разным типам проектов нужны разные методы (Different types of projects require different methods).** Единого «лучшего» жизненного цикла нет: метод подходит одним проектам и не подходит другим.
Agile **идеален для проектов интеллектуального труда (knowledge worker projects), которые идут в быстро меняющейся, сложной среде (fast-moving, complex environment)** — там, где требования меняются, технология новая, а правильное решение находят по ходу работы.
| Проект | Среда | Что подходит лучше |
|---|---|---|
| Строительство моста или склада | требования стабильны, инженерия проверена, изменения после начала стройки очень дороги | плановый (предиктивный) подход |
| Новое мобильное банковское приложение | потребности пользователей неясны, конкуренты выпускают обновления каждую неделю, технологии меняются | agile |
| Перенос 200 серверов в новый дата-центр по готовому чек-листу | шаги известны, работа повторяемая | в основном плановый подход, возможны элементы agile |
| Рекомендательная ML-функция, которую в компании ещё никто не делал | высокая неопределённость, нужны эксперименты | agile |
> Главная мысль: agile — это выбор для определённого типа проектов (интеллектуальный труд в условиях неопределённости), а не универсальная замена всем остальным методам.
## Работники интеллектуального труда (knowledge workers)
> **Работник интеллектуального труда (knowledge worker):** человек с предметной экспертизой (subject matter expertise), который передаёт свои знания другим и участвует в анализе и/или разработке. Примеры: инженеры, преподаватели, учёные, врачи и т. д.
Разработчики, тестировщики, бизнес-аналитики, UX-дизайнеры и дата-сайентисты — всё это работники интеллектуального труда: их главное «сырьё» — информация, а главный инструмент — голова.
**Проекты интеллектуального труда отличаются (Knowledge Worker Projects Are Different).** Слайд сравнивает промышленный труд (заводскую модель, на которой вырос классический менеджмент) с интеллектуальным:
| Промышленный труд (industrial work) | Интеллектуальный труд (knowledge work) | Что это значит для команды разработки |
|---|---|---|
| Work is visible — работа видна | Work is invisible — работа не видна | 60% готовой функции нельзя «увидеть», поэтому agile-команды делают работу видимой: доски задач, графики сгорания |
| Work is stable — работа стабильна | Work is changing — работа меняется | требования и технологии сдвигаются по ходу проекта |
| More structure with fewer decisions — больше структуры, меньше решений | Less structure with more decisions — меньше структуры, больше решений | разработчики принимают десятки проектных решений каждый день |
| Define the task — задачу определяют | Understand the task — задачу понимают | команда сначала должна понять проблему пользователя, а не просто получить описание задачи |
| Strict standards — строгие стандарты | Continuous innovation — постоянные инновации | каждая функция новая; повторить вчерашнюю работу удаётся редко |
| Focus on quantity — фокус на количестве | Focus on quality — фокус на качестве | 1000 строк кода не лучше 100 хороших |
| Focus on the right answers — фокус на правильных ответах | Focus on the right questions — фокус на правильных вопросах | спросить «какую проблему мы решаем?» важнее, чем быстро ответить |
> Ловушка экзамена (Exam trap): всё в левой колонке — **промышленный** труд. Если «Work is visible» или «Focus on quantity» предлагают как черту интеллектуального труда — это неверно.
## Определённые и эмпирические процессы (defined vs empirical processes)
> **Определённый процесс (defined process):** заранее определяет все составляющие шаги, как в строительных проектах.
> **Эмпирический процесс (empirical process):** итеративный и инкрементный (iterative and incremental), как в новых или неопределённых проектах.
| | Определённый процесс | Эмпирический процесс |
|---|---|---|
| Шаги | известны и зафиксированы заранее | выясняются по ходу работы |
| Как управляют | следуют плану и сверяются с ним | короткие циклы: попробовать, проверить результат, адаптироваться |
| Одинаковые входы дают | одинаковый результат (повторяемо) | разный результат; исход неопределён |
| Типичный пример | строительный проект, сборочная линия | новый программный продукт, исследование, новая технология |
| Подходит для | промышленного труда | интеллектуального труда |
- **Итеративный (iterative)** — команда повторяет цикл (спланировать → сделать → оценить) и каждый раз улучшает продукт. **Инкрементный (incremental)** — продукт поставляется частями, которыми уже можно пользоваться и которые со временем складываются в целое. Agile — и то и другое.
- Эмпирическое управление — ровно то, что описывают три столпа Scrum (прозрачность, инспекция, адаптация — часть 3).
- Пример из IT: команда делает чат-бота на LLM. Никто заранее не знает, какой промпт сработает, поэтому выпускают маленькую версию для 50 пользователей, измеряют ответы, правят и повторяют — эмпирический процесс. Развернуть ту же офисную сеть в десятом филиале по чек-листу — определённый процесс.
## Agile-мышление (agile mindset) — Декларация взаимозависимости
Общие черты agile-мышления так, как они записаны в **Декларации взаимозависимости (Declaration of Interdependence)** (2005 год; её написала группа руководителей agile-проектов как дополнение к Манифесту — для управления проектами):
| # | Черта (слайд) | Как — словами Декларации | Пример из IT |
|---|---|---|---|
| 1 | Increase return on investment — повышать отдачу от инвестиций (ROI) | делая главным фокусом непрерывный поток ценности | сначала выпускать самые ценные функции, чтобы они раньше начали приносить деньги |
| 2 | Deliver reliable results — давать надёжные результаты | вовлекая заказчиков в частое взаимодействие и совместную ответственность | клиент видит демо каждые две недели и вместе с командой решает приоритеты |
| 3 | Expect uncertainty — ожидать неопределённости | и управлять ею через итерации, предвидение и адаптацию | планировать короткими итерациями, потому что требования всё равно сдвинутся |
| 4 | Unleash creativity and innovation — раскрывать творчество и инновации | признавая, что люди — главный источник ценности | разработчики сами решают, как реализовать историю |
| 5 | Boost performance — повышать производительность | через групповую ответственность за результат и общую ответственность за эффективность команды | результат спринта принадлежит команде, а не одному герою |
| 6 | Improve effectiveness and reliability — повышать эффективность и надёжность | через стратегии, процессы и практики, подобранные под ситуацию | стартап из трёх человек и банк не работают по одинаковому процессу |
> Зацепка (Memory hook): **«ROI, результаты, неопределённость, творчество, производительность, эффективность»** — деньги, поставка, риск, люди, команда, соответствие ситуации.
> Ловушка экзамена: эти шесть черт — из **Декларации взаимозависимости**, а не из Agile Manifesto (там 4 ценности и 12 принципов) и не из Scrum Guide.
## Быть agile или делать agile (being agile vs doing agile)
Рисунок (Ахмед Сидки, Ahmed Sidky) говорит: **agile — это мышление (mindset), определяемое ценностями (values), направляемое принципами (principles) и проявляющееся во множестве разных практик (practices).** Нарисовано кругами: в центре мышление (звезда), дальше ценности (ромбы), потом принципы (треугольники), а снаружи — множество практик (точки).
| | «Быть» agile (being) | «Делать» agile (doing) |
|---|---|---|
| Оценка на слайде | правильный способ внедрять agile | неэффективный способ внедрять agile |
| С чего начинается | с усвоения agile-мышления | с внедрения agile-практик |
| Как выбирают практики | это понимание используют, чтобы выбрать и внедрить правильные практики, подстраивая их под разные ситуации | практики применяют, не приняв мышления, которое позволяет понять, как выбрать правильный баланс практик и подстроить их |
| Направление на рисунке | из центра наружу (мышление → практики) | снаружи внутрь (только практики) |
- **«Делать» agile, пример из IT:** компания переименовала совещания-отчёты в «дейли», купила Jira и называет двухнедельные дедлайны «спринтами», но менеджер по-прежнему раздаёт каждую задачу и наказывает за плохие новости. Практики есть, мышления нет.
- **«Быть» agile, пример из IT:** команда понимает, *зачем* нужны короткие циклы обратной связи, и когда видит, что двухнедельный спринт слишком длинный для потока срочной поддержки, переводит этот поток на Kanban-доску — подстраивает практику под ситуацию.
## Личная, командная и организационная гибкость (personal, team and organizational agility)
- **Чем больше людей принимают agile-принципы и действуют по ним, тем эффективнее они будут.**
- **Организации меняются через влияние, которое оказывают отдельные люди (influence exerted by individuals).** Гибкость распространяется от человека к команде и от команд — на организацию.
| Шаг | Формулировка слайда | Пример |
|---|---|---|
| Think — думать | самому изучить и усвоить agile-принципы | разработчица читает Манифест и понимает, почему мерило прогресса — работающий софт |
| Do — делать | применять agile на практике | она начинает каждую неделю показывать product owner работающие функции |
| Encourage others — вдохновлять других | побуждать других становиться agile | она помогает соседней команде провести первую ретроспективу |
> Зацепка: **Think → Do → Encourage others** — понять, жить этим, распространить. Порядок начинается с мышления отдельного человека — та же мысль, что и в «быть agile».
## Agile-треугольник (модель перевёрнутого треугольника, inverted triangle model)
- **Agile-команды позволяют объёму (scope) меняться в рамках фиксированных стоимости (cost) и сроков (time).**
- **Проекты интеллектуального труда характеризуются экспериментами и неопределённостью**, поэтому зафиксировать весь объём заранее нереалистично.
@diagram pm6-inverted-triangle
| | Традиционный треугольник ограничений (traditional triangle of constraints) | Agile-треугольник ограничений (перевёрнутый) |
|---|---|---|
| Зафиксировано | объём (вершина треугольника) | стоимость и сроки (верх перевёрнутого треугольника) |
| Меняется | сроки и стоимость | объём |
| Вопрос планирования | «сколько времени и денег нужно, чтобы сделать весь этот объём?» | «какой самый ценный объём мы успеем сделать этой командой, за этот бюджет и к этой дате?» |
| Когда реальность меняется | запросы на изменение, перепланирование, новый бюджет или срок | перерасставить приоритеты бэклога; менее важные функции выпадают |
| Риск для заказчика | поставка с опозданием или сверх бюджета | часть низкоприоритетных функций не будет поставлена |
- **Разбор примера:** команда из 5 разработчиков, бюджет на 12 недель и жёсткая дата запуска приложения доставки еды. В бэклоге 40 функций. Команда делает их по приоритету (сначала заказ и оплата, в конце — значки лояльности). Если через 12 недель готова 31 функция, приложение выходит в срок и в бюджете с 31 самой ценной функцией; остальные 9 убирают или переносят в следующий релиз.
= traditional: scope fixed -> time & cost vary | agile: cost & time fixed -> scope varies
> Ловушка экзамена: в перевёрнутой модели объём не «бесконтрольный». Он меняется **по приоритету**, так что самая ценная работа всегда делается первой. И фиксированы именно **стоимость и сроки** — не «стоимость и объём» и не «сроки и объём».
?? Клиент говорит: «Мне нужны ровно эти 60 функций, а по срокам и бюджету я не уверен». Какой треугольник он описывает?
?= Традиционный: объём зафиксирован, сроки и стоимость меняются. Agile-команда предпочла бы зафиксировать команду (стоимость) и дату релиза (сроки), а объёму дать меняться по приоритету.
?? Компания ввела стендапы, спринты и Jira, но менеджеры по-прежнему раздают каждую задачу, а менять процесс никому нельзя. Это «быть» или «делать» agile?
?= «Делать» agile: практики применяют без мышления, поэтому команда не может выбирать и подстраивать практики. «Быть» agile начинается с усвоения мышления.
?? Какой процесс — определённый или эмпирический — подходит для десятой одинаковой сети филиала по чек-листу, а какой — для чат-бота на LLM?
?= Сеть филиала — определённый процесс (шаги известны заранее); чат-бот — эмпирический (итеративный и инкрементный, потому что результат неопределён).
## На что обратить внимание на экзамене (Exam focus)
- Agile **идеален для проектов интеллектуального труда в быстро меняющейся, сложной среде**; разным типам проектов нужны разные методы.
- Knowledge worker = **предметная экспертиза + передаёт знания + анализ и/или разработка**; примеры: инженеры, преподаватели, учёные, врачи.
- Промышленный vs интеллектуальный труд: visible/invisible, stable/changing, больше структуры–меньше решений / меньше структуры–больше решений, define/understand the task, strict standards/continuous innovation, quantity/quality, right answers/right questions.
- **Defined** — шаги определены заранее (строительство); **empirical** — итеративно и инкрементно (новые или неопределённые проекты).
- Шесть черт мышления (Declaration of Interdependence): ROI, надёжные результаты, ожидать неопределённости, творчество и инновации, производительность, эффективность и надёжность.
- Мышление → ценности → принципы → практики; **being** agile — правильно (сначала мышление), **doing** agile — неэффективно (практики без мышления).
- Организационные изменения: **Think → Do → Encourage others**; организации меняются через влияние отдельных людей.
- Перевёрнутый треугольник: **традиционный фиксирует объём**; **agile фиксирует стоимость и сроки, а объём меняется**.`,
  },
  [
    qx("According to the lecture, which description defines a knowledge worker?", "An expert who communicates knowledge and joins analysis or development", [
      ["A worker who follows predefined steps under strict quality standards", "Predefined steps and strict standards describe industrial work and a defined process, not the knowledge worker.", "Заранее заданные шаги и строгие стандарты описывают промышленный труд и определённый процесс, а не работника интеллектуального труда."],
      ["A manager who plans, assigns and controls the daily work of other staff", "That is a description of command-and-control management; a knowledge worker is defined by expertise, not by controlling others.", "Это описание командно-контрольного менеджмента; работника интеллектуального труда определяет экспертиза, а не контроль над другими."],
      ["An employee whose output is visible, stable and measured mainly by quantity", "Visible, stable work focused on quantity is exactly the industrial column of the slide's table.", "Видимая, стабильная работа с фокусом на количестве — это как раз колонка промышленного труда в таблице слайда."],
    ], "Slide definition: a knowledge worker is a person with subject matter expertise who communicates their knowledge and takes part in analysis and/or development efforts (engineers, teachers, scientists, doctors).", "Определение со слайда: knowledge worker — человек с предметной экспертизой, который передаёт свои знания и участвует в анализе и/или разработке (инженеры, преподаватели, учёные, врачи)."),
    qx("Which characteristic belongs to knowledge work rather than to industrial work?", "Work is invisible", [
      ["Work is stable", "Stable work is industrial; knowledge work is changing.", "Стабильная работа — промышленная; интеллектуальная работа меняется."],
      ["Strict standards", "Strict standards are industrial; knowledge work relies on continuous innovation.", "Строгие стандарты — черта промышленного труда; интеллектуальный держится на постоянных инновациях."],
      ["Focus on quantity", "Quantity is the industrial focus; knowledge work focuses on quality.", "Количество — фокус промышленного труда; интеллектуальный сосредоточен на качестве."],
    ], "In the slide's table, industrial work is visible and knowledge work is invisible — which is why agile teams make work visible with boards and charts.", "В таблице слайда промышленная работа видна, а интеллектуальная — нет; поэтому agile-команды делают работу видимой досками и графиками."),
    qx("In the industrial vs knowledge work table, knowledge work focuses on…", "The right questions and on quality", [
      ["The right answers and on quantity", "Both halves are from the industrial column.", "Обе половины — из колонки промышленного труда."],
      ["The right answers and on quality", "Quality is correct, but \"the right answers\" is the industrial focus.", "Качество — верно, но «правильные ответы» — фокус промышленного труда."],
      ["The right questions and on quantity", "\"The right questions\" is correct, but quantity is the industrial focus.", "«Правильные вопросы» — верно, но количество — фокус промышленного труда."],
    ], "Knowledge work: focus on quality and focus on the right questions. Industrial work: focus on quantity and focus on the right answers.", "Интеллектуальный труд: фокус на качестве и на правильных вопросах. Промышленный: фокус на количестве и на правильных ответах."),
    qx("Which statement correctly describes a defined process?", "It defines the constituent steps in advance, as in construction", [
      ["It is iterative and incremental, as in new or uncertain projects", "This is the slide's definition of an empirical process.", "Это определение эмпирического процесса со слайда."],
      ["It sets only the goal and lets the steps emerge from feedback", "Letting steps emerge from feedback is empirical control, the opposite of a defined process.", "Шаги, которые рождаются из обратной связи, — это эмпирическое управление, противоположность определённого процесса."],
      ["It repeats short cycles of inspection and adaptation until done", "Inspection and adaptation in short cycles describe an empirical process (and Scrum's pillars).", "Инспекция и адаптация короткими циклами описывают эмпирический процесс (и столпы Scrum)."],
    ], "Slide: a defined process defines the constituent steps in advance, as construction projects do; it fits stable, repeatable work.", "Слайд: определённый процесс заранее определяет все составляющие шаги, как в строительных проектах; подходит для стабильной повторяемой работы."),
    qx("A team is building an AI feature that nobody in the company has built before, and requirements are expected to shift. Which process type fits best?", "An empirical process: iterative and incremental", [
      ["A defined process: all steps fixed in advance", "Steps cannot be fixed in advance when the outcome is uncertain; defined processes suit construction-like work.", "Шаги нельзя зафиксировать заранее, когда результат неопределён; определённые процессы подходят для работы вроде строительства."],
      ["A defined process with stricter change control", "Stricter change control fights the uncertainty instead of working with it; the slide pairs new or uncertain projects with empirical processes.", "Жёсткий контроль изменений борется с неопределённостью вместо того, чтобы работать с ней; слайд связывает новые или неопределённые проекты с эмпирическими процессами."],
      ["An empirical process with all scope frozen early", "Freezing all scope up front contradicts the empirical idea of learning and adapting as you go.", "Заморозить весь объём заранее — противоречит эмпирической идее учиться и адаптироваться по ходу."],
    ], "New or uncertain projects call for an empirical process — iterative and incremental, controlled by inspecting results and adapting.", "Новым или неопределённым проектам нужен эмпирический процесс — итеративный и инкрементный, с управлением через проверку результатов и адаптацию."),
    qx("According to the lecture, the six general characteristics of the agile mindset are written in…", "The Declaration of Interdependence", [
      ["The Agile Manifesto's twelve principles", "The Manifesto has 4 values and 12 principles; the six mindset characteristics are a different document.", "В Манифесте 4 ценности и 12 принципов; шесть черт мышления — из другого документа."],
      ["The Scrum Guide's five Scrum values", "Scrum values (commitment, focus, openness, respect, courage) are not the six mindset characteristics.", "Ценности Scrum (commitment, focus, openness, respect, courage) — не шесть черт agile-мышления."],
      ["The PMI Code of Ethics", "The Code of Ethics covers responsibility, respect, fairness and honesty — not the agile mindset list.", "Кодекс этики PMI — про ответственность, уважение, справедливость и честность, а не про список черт agile-мышления."],
    ], "The slide: general characteristics of the agile mindset \"as written in the Declaration of Interdependence\" (2005, aimed at agile project leaders).", "Слайд: общие черты agile-мышления «как они записаны в Декларации взаимозависимости» (2005, для руководителей agile-проектов)."),
    qx("Which of the following is NOT one of the six characteristics of the agile mindset listed in the lecture?", "Follow the plan to reduce uncertainty", [
      ["Expect uncertainty", "This is characteristic 3 on the slide.", "Это черта 3 на слайде."],
      ["Unleash creativity and innovation", "This is characteristic 4 on the slide.", "Это черта 4 на слайде."],
      ["Improve effectiveness and reliability", "This is characteristic 6 on the slide.", "Это черта 6 на слайде."],
    ], "The six: increase ROI, deliver reliable results, expect uncertainty, unleash creativity and innovation, boost performance, improve effectiveness and reliability. Agile expects uncertainty — it does not try to plan it away.", "Шесть черт: повышать ROI, давать надёжные результаты, ожидать неопределённости, раскрывать творчество и инновации, повышать производительность, повышать эффективность и надёжность. Agile ожидает неопределённость, а не пытается «спланировать» её прочь."),
    qx("Sidky's figure says agile is a mindset defined by ___, guided by ___ and manifested through ___.", "Values; principles; many practices", [
      ["Principles; values; one fixed framework", "Values and principles are swapped, and agile is manifested through many practices, not one framework.", "Ценности и принципы перепутаны местами, а agile проявляется во многих практиках, а не в одном фреймворке."],
      ["Practices; values; a set of principles", "This reverses the figure: practices are the outer layer, not the definition of the mindset.", "Это переворачивает рисунок: практики — внешний слой, а не то, что определяет мышление."],
      ["Roles; events; artifacts and rules", "Roles, events and artifacts describe Scrum's structure, not the mindset figure.", "Роли, события и артефакты описывают устройство Scrum, а не рисунок про мышление."],
    ], "Figure: \"Agile is a mindset defined by values, guided by principles and manifested through many different practices.\" Centre to edge: mindset → values → principles → practices.", "Рисунок: «Agile — это мышление, определяемое ценностями, направляемое принципами и проявляющееся во множестве разных практик». От центра к краю: мышление → ценности → принципы → практики."),
    qx("According to the lecture, how does \"being agile\" begin?", "By internalizing the agile mindset before choosing practices", [
      ["By adopting Scrum events and tools across the whole company", "Starting from practices and tools is \"doing agile\", which the slide calls ineffective.", "Начать с практик и инструментов — это «делать agile», который слайд называет неэффективным."],
      ["By hiring a certified ScrumMaster to run all of the team's meetings", "A role or a certificate does not create the mindset; being agile starts inside each person.", "Роль или сертификат не создают мышления; «быть agile» начинается внутри каждого человека."],
      ["By copying the practices of the most successful agile team", "Copying practices without understanding is exactly doing agile; being agile tailors practices to the situation.", "Копировать практики без понимания — это и есть «делать agile»; «быть agile» — подстраивать практики под ситуацию."],
    ], "Being agile starts with internalizing the agile mindset, then using that understanding to select and implement the correct practices, tailoring them to different situations.", "«Быть agile» начинается с усвоения agile-мышления; затем это понимание используют, чтобы выбрать и внедрить правильные практики и подстроить их под ситуацию."),
    qx("A company runs daily stand-ups and two-week sprints, but nobody understands why, and the practices are never adjusted. What does the lecture call this?", "Doing agile — an ineffective way to implement agile", [
      ["Being agile — the correct way to implement agile", "Being agile requires the mindset first; here the practices exist without it.", "«Быть agile» требует сначала мышления; здесь практики есть, а мышления нет."],
      ["Personal agility — the Think step of organizational change", "The Think step is learning and internalizing principles — the very thing missing here.", "Шаг Think — изучение и усвоение принципов, то есть как раз то, чего здесь не хватает."],
      ["Empirical control — inspection and adaptation", "Empirical control would adjust the practices after inspection; this team never adapts.", "Эмпирическое управление меняло бы практики после проверки; эта команда никогда не адаптируется."],
    ], "Doing agile = using agile practices without embracing the mindset that lets you choose the right balance of practices and tailor them. The slide calls it ineffective.", "«Делать agile» — применять agile-практики, не приняв мышления, которое позволяет выбрать баланс практик и подстроить их. Слайд называет это неэффективным."),
    qx("What is the correct order of the process of creating organizational change?", "Think → Do → Encourage others", [
      ["Do → Think → Encourage others", "The slide starts with individually learning principles (Think); practice comes second.", "Слайд начинается с личного изучения принципов (Think); практика идёт второй."],
      ["Encourage others → Think → Do", "You cannot credibly encourage others before you have learned and practised agile yourself.", "Нельзя убедительно вдохновлять других, пока сам не изучил и не попробовал agile."],
      ["Think → Encourage others → Do", "Encouraging others is the last step, after you are doing the practice yourself.", "Вдохновлять других — последний шаг, после того как сам начал практиковать."],
    ], "Slide: Think (individually learning and internalizing agile principles) → Do (doing the practice of agile) → Encourage others (to become agile).", "Слайд: Think (лично изучить и усвоить agile-принципы) → Do (применять agile на практике) → Encourage others (побуждать других становиться agile)."),
    qx("In the Think → Do → Encourage others process, what does \"Think\" mean?", "Individually learning and internalizing agile principles", [
      ["Planning the whole project in detail before the work starts", "Detailed upfront planning belongs to a defined process; Think is about learning principles.", "Детальное планирование заранее — черта определённого процесса; Think — про изучение принципов."],
      ["Brainstorming product features together with the customer", "That is requirements work with the customer, not the personal step of internalizing principles.", "Это работа над требованиями с заказчиком, а не личный шаг усвоения принципов."],
      ["Persuading managers to approve an agile transformation", "Influencing others is the third step, Encourage others.", "Влиять на других — третий шаг, Encourage others."],
    ], "Think = individually learning and internalizing agile principles; it is the personal starting point of organizational change.", "Think — лично изучить и усвоить agile-принципы; это личная отправная точка организационных изменений."),
    qx("According to the lecture, how do organizations change toward agility?", "Through influence exerted by individuals", [
      ["Through a mandate issued by top management", "The slide does not say change is decreed; it says change spreads through individuals' influence.", "Слайд не говорит, что изменения спускают приказом; он говорит, что они распространяются через влияние отдельных людей."],
      ["Through buying and installing agile tools", "Tools without the mindset lead to doing agile, not to organizational agility.", "Инструменты без мышления ведут к «делать agile», а не к гибкости организации."],
      ["Through certifying every employee in Scrum", "Certificates are not mentioned; people must embrace and act upon the principles.", "О сертификатах речи нет; люди должны принять принципы и действовать по ним."],
    ], "Slide: \"Organizations change through influence exerted by individuals\" — and the more people embrace and act upon agile principles, the more effective they will be.", "Слайд: «Организации меняются через влияние, которое оказывают отдельные люди», и чем больше людей принимают agile-принципы и действуют по ним, тем эффективнее они будут."),
    qx("In the agile triangle (inverted triangle model), which constraint is allowed to vary?", "Scope", [
      ["Cost", "In the agile triangle cost is fixed (top of the inverted triangle).", "В agile-треугольнике стоимость фиксирована (верх перевёрнутого треугольника)."],
      ["Time", "In the agile triangle time is fixed together with cost.", "В agile-треугольнике сроки фиксированы вместе со стоимостью."],
      ["Quality", "Quality is not a corner of the slide's triangle, and agile does not trade quality away.", "Качество — не угол треугольника на слайде, и agile не жертвует качеством."],
    ], "Slide: agile teams allow scope to vary within the fixed parameters of cost and time.", "Слайд: agile-команды позволяют объёму меняться в рамках фиксированных стоимости и сроков."),
    qx("In the traditional triangle of constraints shown on the slide, which element is fixed?", "Scope, while time and cost vary", [
      ["Time, while scope and cost vary", "Time is a variable corner in the traditional triangle.", "В традиционном треугольнике сроки — меняющийся угол."],
      ["Cost and time, while scope varies", "This describes the agile (inverted) triangle, not the traditional one.", "Это описание agile (перевёрнутого) треугольника, а не традиционного."],
      ["Cost, while scope and time vary", "Cost is a variable corner in the traditional triangle.", "В традиционном треугольнике стоимость — меняющийся угол."],
    ], "Traditional triangle: scope is fixed at the top; time and cost at the base are variable. The agile triangle inverts this: cost and time fixed, scope variable.", "Традиционный треугольник: объём зафиксирован наверху, сроки и стоимость внизу меняются. Agile-треугольник переворачивает это: стоимость и сроки фиксированы, объём меняется."),
    qx("A startup has a fixed budget for 5 developers and a fixed launch date, but 40 features in the backlog. How would an agile team apply the inverted triangle?", "Build features in priority order and let low-priority scope drop", [
      ["Add developers in the middle of the project so all 40 features fit", "Adding people changes cost, which the inverted triangle keeps fixed.", "Добавить людей — значит изменить стоимость, а перевёрнутый треугольник её фиксирует."],
      ["Move the launch date until all 40 features are complete", "Moving the date makes time variable and scope fixed — the traditional triangle.", "Сдвиг даты делает сроки переменными, а объём фиксированным — это традиционный треугольник."],
      ["Cut testing time so every feature still fits into the date", "Sacrificing quality is not the variable; scope is.", "Жертвовать качеством — не то, что меняют; меняют объём."],
    ], "With cost and time fixed, scope varies by priority: the most valuable features are built first, and whatever does not fit is dropped or moved to a later release.", "Когда стоимость и сроки фиксированы, объём меняется по приоритету: самые ценные функции делают первыми, а то, что не помещается, убирают или переносят в следующий релиз."),
    qx("Why does the lecture say agile suits knowledge worker projects?", "They are characterized by experimentation and uncertainty", [
      ["They are characterized by stable, visible and repeatable work", "Stable, visible work is industrial — the opposite of knowledge work.", "Стабильная видимая работа — промышленная, противоположность интеллектуальной."],
      ["They need more structure with fewer decisions", "More structure with fewer decisions is the industrial column; knowledge work has less structure and more decisions.", "Больше структуры и меньше решений — колонка промышленного труда; в интеллектуальном меньше структуры и больше решений."],
      ["They are best managed through strict standards", "Strict standards are industrial; knowledge work depends on continuous innovation.", "Строгие стандарты — черта промышленного труда; интеллектуальный зависит от постоянных инноваций."],
    ], "The agile triangle slide: knowledge worker projects are characterized by experimentation and uncertainty — so scope is allowed to vary within fixed cost and time.", "Слайд про agile-треугольник: проекты интеллектуального труда характеризуются экспериментами и неопределённостью — поэтому объёму позволяют меняться при фиксированных стоимости и сроках."),
    tfx("According to the lecture, different types of projects require different methods, and agile is ideal for knowledge worker projects in fast-moving, complex environments.", true,
      "This is the \"Why use agile?\" slide word for word: agile is not the answer to every project, but it fits knowledge work in fast-moving, complex environments.",
      "Это слайд «Why use agile?» почти дословно: agile — не ответ для любого проекта, но он подходит интеллектуальному труду в быстро меняющейся сложной среде.",
      "\"False\" would mean either that one method fits all projects or that agile is meant for stable, simple work — the slide says neither.",
      "«Неверно» означало бы, что один метод подходит всем проектам или что agile нужен для стабильной простой работы, — слайд не говорит ни того, ни другого."),
    tfx("In the inverted triangle model, scope is fixed while cost and time are allowed to vary.", false,
      "It is the other way round: the agile (inverted) triangle fixes cost and time and lets scope vary. Fixed scope with variable cost and time is the traditional triangle.",
      "Наоборот: agile (перевёрнутый) треугольник фиксирует стоимость и сроки, а объёму позволяет меняться. Фиксированный объём при меняющихся стоимости и сроках — традиционный треугольник.",
      "\"True\" mixes up the two triangles on the slide: it describes the traditional triangle of constraints.",
      "«Верно» путает два треугольника на слайде: это описание традиционного треугольника ограничений."),
    qx("Which pair of industrial vs knowledge work characteristics is matched correctly?", "Define the task (industrial); understand the task (knowledge)", [
      ["Continuous innovation (industrial); strict standards (knowledge)", "Reversed: strict standards are industrial, continuous innovation is knowledge work.", "Наоборот: строгие стандарты — промышленный труд, постоянные инновации — интеллектуальный."],
      ["Work is changing (industrial); work is stable (knowledge)", "Reversed: industrial work is stable, knowledge work is changing.", "Наоборот: промышленная работа стабильна, интеллектуальная меняется."],
      ["Fewer decisions (knowledge); more decisions (industrial)", "Reversed: knowledge work has less structure and more decisions.", "Наоборот: в интеллектуальном труде меньше структуры и больше решений."],
    ], "In industrial work the task is defined for the worker; in knowledge work the worker must first understand the task.", "В промышленном труде задачу работнику определяют; в интеллектуальном работник сначала должен сам понять задачу."),
  ],
);

const p2 = part(
  "pm-l6-p2",
  { en: "The Agile Manifesto: 4 values and 12 principles", ru: "Agile Manifesto: 4 ценности и 12 принципов" },
  {
    en: `## What the Agile Manifesto is
> **Agile Manifesto:** created by software and methodology experts at the forefront of emerging agile methods to highlight the agile mindset and the values and principles it is based on.
- Background (beyond the slide): written in February 2001 at Snowbird, Utah, by 17 practitioners — creators and representatives of Scrum, XP, Crystal, DSDM, FDD and other "lightweight" methods. The word "agile" as a common name for these methods comes from this meeting.
- Structure: a short preamble, **4 values** and **12 principles**. Values say *what* we prefer; principles say *how* this preference turns into everyday work.
- Remember the layers from Part 1: mindset → **values** → **principles** → practices. The Manifesto supplies the second and third layers; it names no specific practices (no sprints, no stand-ups).
## The four values — word for word
The preamble: "We are uncovering better ways of developing software by doing it and helping others do it. Through this work we have come to value:"
| # | Valued more (left) | | Still valued (right) |
|---|---|---|---|
| 1 | Individuals and interactions | over | processes and tools |
| 2 | Working software | over | comprehensive documentation |
| 3 | Customer collaboration | over | contract negotiation |
| 4 | Responding to change | over | following a plan |
> "While there is value in the items on the right, we value the items on the left more."
@diagram pm6-manifesto-values
> Exam trap: the Manifesto does **not** say that processes, tools, documentation, contracts or plans are bad or unnecessary. Agile teams still have a process, write the documentation that is needed, sign contracts and plan. The word is **over**, not **instead of**. An option such as "agile projects do not need documentation" is wrong.
> Exam trap: the picture of the Manifesto on the slide says "Working **Product**" instead of "Working **software**". It is the same value; the official text says "Working software" — choose that wording if both appear.
## What each value means (slide explanations)
| Value | Slide explanation | IT example |
|---|---|---|
| Individuals and interactions over processes and tools | projects are undertaken by people, not tools; problems get solved by people, not processes | a blocking bug is solved in a 5-minute call between the tester and the developer instead of ten rounds of comments in a ticket |
| Working software over comprehensive documentation | emphasizes the need to deliver; focuses on the business value, rather than paperwork | after two weeks the client can click through a working sign-up flow instead of approving an 80-page specification |
| Customer collaboration over contract negotiation | be flexible and accommodating; work with the customer toward a shared definition of "done" | the product owner and the client agree together what "done" means for the payment feature, instead of arguing over contract clauses |
| Responding to change over following a plan | acknowledge that initial plans were made when the least was known about the project; effort should be spent responding to inevitable changes | a competitor launches Apple Pay support; the team re-prioritizes the backlog instead of defending the original plan |
> Memory hook: **People, Product, Partnership, Pivot** — individuals, working software, customer collaboration, responding to change.
## The 12 principles — word for word
"We follow these principles:"
| # | Principle (verbatim) | Key word |
|---|---|---|
| 1 | Our highest priority is to satisfy the customer through early and continuous delivery of valuable software. | satisfy the customer — early and continuous delivery |
| 2 | Welcome changing requirements, even late in development. Agile processes harness change for the customer's competitive advantage. | welcome change |
| 3 | Deliver working software frequently, from a couple of weeks to a couple of months, with a preference to the shorter timescale. | frequent delivery (weeks rather than months) |
| 4 | Business people and developers must work together daily throughout the project. | daily business–developer collaboration |
| 5 | Build projects around motivated individuals. Give them the environment and support they need, and trust them to get the job done. | motivated, trusted individuals |
| 6 | The most efficient and effective method of conveying information to and within a development team is face-to-face conversation. | face-to-face conversation |
| 7 | Working software is the primary measure of progress. | progress = working software |
| 8 | Agile processes promote sustainable development. The sponsors, developers, and users should be able to maintain a constant pace indefinitely. | sustainable, constant pace |
| 9 | Continuous attention to technical excellence and good design enhances agility. | technical excellence and good design |
| 10 | Simplicity—the art of maximizing the amount of work not done—is essential. | simplicity |
| 11 | The best architectures, requirements, and designs emerge from self-organizing teams. | self-organizing teams |
| 12 | At regular intervals, the team reflects on how to become more effective, then tunes and adjusts its behavior accordingly. | reflect and adjust |
## Each principle with an example and its violation
- **1 — Satisfy the customer early and continuously.** Example: an online store team releases basic search in month 1 and improves it every two weeks. *Violated when* the customer sees nothing until a "big bang" release after a year.
- **2 — Welcome changing requirements.** Example: two weeks before launch the client asks for login via Google; the team adds it to the backlog and the product owner ranks it. *Violated when* the manager answers by default: "requirements are frozen, raise a change request for phase 2".
- **3 — Deliver frequently, prefer the shorter timescale.** Example: a release every 2 weeks rather than every 2 months. *Violated when* working software reaches users once a year.
- **4 — Business people and developers work together daily.** Example: the product owner sits with the team and answers questions the same day. *Violated when* business stakeholders meet developers only at kick-off and at acceptance.
- **5 — Motivated individuals, environment, support, trust.** Example: the team gets good laptops, a quiet room and freedom to choose how to implement a story. *Violated when* every technical decision needs a manager's signature.
- **6 — Face-to-face conversation.** Example: a 10-minute talk at the whiteboard (or a video call for a remote team) instead of a long e-mail thread. *Violated when* developers sitting in the same room communicate only through tickets.
- **7 — Working software is the primary measure of progress.** Example: progress is reported as "8 of 20 stories are done and demoed". *Violated when* progress is "90% done" because 90% of the hours are spent, but nothing runs.
- **8 — Sustainable development, a constant pace indefinitely.** Example: the team plans to its real capacity of about 40 hours a week. *Violated when* the team works 70-hour weeks for months to hit a date and then burns out.
- **9 — Technical excellence and good design enhance agility.** Example: automated tests and regular refactoring keep the code easy to change. *Violated when* "we'll fix the code later" turns into technical debt that slows down every new feature.
- **10 — Simplicity: maximize the work not done.** Example: the team ships a simple CSV export instead of a full report designer nobody asked for. *Violated when* developers gold-plate features "just in case".
- **11 — Self-organizing teams.** Example: the team itself decides the architecture of a new service and who takes which task. *Violated when* an architect designs everything alone and hands down instructions.
- **12 — Reflect regularly, then tune and adjust.** Example: every two weeks a retrospective produces one or two concrete improvements. *Violated when* the team repeats the same problems sprint after sprint and never stops to discuss them.
## Grouping the principles to remember them
| Theme | Principles | What they share |
|---|---|---|
| Customer and value | 1, 2, 3, 7 | deliver valuable working software early and often, and adapt to change |
| People and communication | 4, 5, 6, 11 | daily collaboration, trust, face-to-face talk, self-organization |
| Pace and quality | 8, 9, 10 | sustainable pace, technical excellence, simplicity |
| Improvement | 12 | regular reflection and adjustment |
> Memory hook for the numbers: **3** — "a couple of weeks to a couple of months, prefer the shorter"; **6** — face-to-face; **7** — working software = progress; **8** — constant pace "indefinitely"; **10** — simplicity, "the art of maximizing the amount of work not done"; **12** — reflect and adjust (later: the retrospective).
> Exam trap: principle 7 makes **working software** the primary measure of progress — not hours spent, not the percentage of tasks complete, not signed documents, not velocity.
> Exam trap: principle 10 maximizes the work **not done**. It is not "do as much work as possible"; it is "do not build what is not needed".
> Exam trap: principle 6 calls face-to-face conversation the **most efficient and effective** method — e-mail, documents and ticket comments are allowed, but they are not the best channel.
?? A team reports "we are 80% done" because 80% of the budget is spent, but nothing can be demonstrated. Which principle does this contradict?
?= Principle 7: working software is the primary measure of progress. Spent budget or hours show effort, not progress.
?? Developers in the same office send each other long e-mails about a design question that a quick talk would settle. Which principle and which value are relevant?
?= Principle 6 (face-to-face conversation is the most efficient and effective method of conveying information) and the value individuals and interactions over processes and tools.
?? What does "simplicity" mean in principle 10, and which lean waste is its opposite?
?= Simplicity is the art of maximizing the amount of work not done — build only what is needed. Its opposite is gold-plating, which lean calls the waste of extra features (Part 4).
## Exam focus
- The four values **word for word**, in order: individuals and interactions / working software / customer collaboration / responding to change — **over** processes and tools / comprehensive documentation / contract negotiation / following a plan.
- "While there is value in the items on the right, we value the items on the left more" — the right side still has value.
- Value explanations: people, not tools or processes; the need to deliver, business value rather than paperwork; flexible, shared definition of "done"; plans made when the least was known, respond to inevitable change.
- Principles by number: 1 customer satisfaction through early and continuous delivery; 2 welcome change even late; 3 weeks to months, prefer shorter; 4 business and developers daily; 5 motivated individuals and trust; 6 face-to-face; 7 working software = primary measure of progress; 8 sustainable constant pace; 9 technical excellence and good design; 10 simplicity; 11 self-organizing teams; 12 reflect and adjust.
- Typical scenario questions, "which principle is violated when…": overtime (8), frozen requirements (2), progress in hours (7), architect designs alone (11), no retrospectives (12), business absent (4), gold-plating (10).`,
    ru: `## Что такое Agile Manifesto
> **Agile Manifesto (Манифест гибкой разработки):** создан экспертами по разработке ПО и методологиям, стоявшими у истоков новых agile-методов, чтобы показать agile-мышление и ценности и принципы, на которых оно основано.
- Контекст (сверх слайда): написан в феврале 2001 года в Сноуберде (штат Юта, США) 17 практиками — создателями и представителями Scrum, XP, Crystal, DSDM, FDD и других «облегчённых» методов. Само слово «agile» как общее название этих методов появилось на этой встрече.
- Структура: короткая преамбула, **4 ценности (values)** и **12 принципов (principles)**. Ценности говорят, *что* мы предпочитаем; принципы — *как* это предпочтение превращается в повседневную работу.
- Вспомните слои из части 1: мышление → **ценности** → **принципы** → практики. Манифест даёт второй и третий слой; конкретных практик (спринтов, стендапов) в нём нет.
## Четыре ценности — дословно
Преамбула: «We are uncovering better ways of developing software by doing it and helping others do it. Through this work we have come to value:» — «Мы открываем лучшие способы разработки ПО, занимаясь ею сами и помогая в этом другим. Благодаря этой работе мы стали ценить:»
| # | Ценим больше (слева) | | Тоже ценим (справа) |
|---|---|---|---|
| 1 | Individuals and interactions — люди и взаимодействие | over — важнее, чем | processes and tools — процессы и инструменты |
| 2 | Working software — работающий софт | over | comprehensive documentation — исчерпывающая документация |
| 3 | Customer collaboration — сотрудничество с заказчиком | over | contract negotiation — согласование условий контракта |
| 4 | Responding to change — реагирование на изменения | over | following a plan — следование плану |
> «While there is value in the items on the right, we value the items on the left more» — «То, что справа, тоже ценно, но то, что слева, мы ценим больше».
@diagram pm6-manifesto-values
> Ловушка экзамена: Манифест **не** говорит, что процессы, инструменты, документация, контракты или планы плохи или не нужны. У agile-команд есть процесс, они пишут нужную документацию, подписывают контракты и планируют. Ключевое слово — **over** («важнее, чем»), а не «вместо». Вариант «agile-проектам не нужна документация» — неверный.
> Ловушка экзамена: на картинке Манифеста на слайде написано «Working **Product**» вместо «Working **software**». Это та же ценность; в официальном тексте — «Working software», выбирайте эту формулировку, если встретятся обе.
## Что значит каждая ценность (пояснения со слайдов)
| Ценность | Пояснение слайда | Пример из IT |
|---|---|---|
| Люди и взаимодействие важнее процессов и инструментов | проекты делают люди, а не инструменты; проблемы решают люди, а не процессы | блокирующий баг решают за 5-минутный созвон тестировщика с разработчиком, а не за десять кругов комментариев в тикете |
| Работающий софт важнее исчерпывающей документации | подчёркивает необходимость поставлять результат; фокус на бизнес-ценности, а не на бумагах | через две недели клиент может прокликать работающую регистрацию, а не утверждать 80-страничную спецификацию |
| Сотрудничество с заказчиком важнее согласования контракта | быть гибкими и идти навстречу; работать с заказчиком над общим определением «готово» (definition of "done") | product owner и клиент вместе договариваются, что значит «готово» для функции оплаты, а не спорят о пунктах договора |
| Реагирование на изменения важнее следования плану | признать, что первоначальные планы составлены, когда о проекте знали меньше всего; усилия стоит тратить на реакцию на неизбежные изменения | конкурент запустил поддержку Apple Pay; команда перестраивает приоритеты бэклога, а не защищает исходный план |
> Зацепка: **People, Product, Partnership, Pivot** — люди, работающий продукт, партнёрство с заказчиком, разворот при изменениях.
## 12 принципов — дословно
«We follow these principles:» — «Мы следуем таким принципам:»
| # | Принцип (дословно) | Ключевое слово |
|---|---|---|
| 1 | Our highest priority is to satisfy the customer through early and continuous delivery of valuable software. — Наивысший приоритет — удовлетворить заказчика ранней и непрерывной поставкой ценного софта. | удовлетворить заказчика — ранняя и непрерывная поставка |
| 2 | Welcome changing requirements, even late in development. Agile processes harness change for the customer's competitive advantage. — Изменения требований приветствуются даже на поздних стадиях; agile-процессы обращают изменения в конкурентное преимущество заказчика. | приветствовать изменения |
| 3 | Deliver working software frequently, from a couple of weeks to a couple of months, with a preference to the shorter timescale. — Поставлять работающий софт часто — раз в пару недель или пару месяцев, предпочитая более короткий срок. | частая поставка (недели, а не месяцы) |
| 4 | Business people and developers must work together daily throughout the project. — Представители бизнеса и разработчики должны работать вместе ежедневно на протяжении всего проекта. | ежедневная совместная работа бизнеса и разработчиков |
| 5 | Build projects around motivated individuals. Give them the environment and support they need, and trust them to get the job done. — Стройте проекты вокруг мотивированных людей; дайте им нужные условия и поддержку и доверьте им сделать работу. | мотивированные люди и доверие |
| 6 | The most efficient and effective method of conveying information to and within a development team is face-to-face conversation. — Самый эффективный и действенный способ передать информацию команде и внутри неё — разговор лицом к лицу. | разговор лицом к лицу |
| 7 | Working software is the primary measure of progress. — Работающий софт — главное мерило прогресса. | прогресс = работающий софт |
| 8 | Agile processes promote sustainable development. The sponsors, developers, and users should be able to maintain a constant pace indefinitely. — Agile-процессы поддерживают устойчивую разработку; спонсоры, разработчики и пользователи должны быть способны держать постоянный темп бесконечно долго. | устойчивый постоянный темп |
| 9 | Continuous attention to technical excellence and good design enhances agility. — Постоянное внимание к техническому совершенству и хорошему дизайну повышает гибкость. | техническое совершенство и хороший дизайн |
| 10 | Simplicity—the art of maximizing the amount of work not done—is essential. — Простота — искусство максимизировать объём несделанной работы — крайне важна. | простота |
| 11 | The best architectures, requirements, and designs emerge from self-organizing teams. — Лучшие архитектуры, требования и решения рождаются в самоорганизующихся командах. | самоорганизующиеся команды |
| 12 | At regular intervals, the team reflects on how to become more effective, then tunes and adjusts its behavior accordingly. — Команда регулярно размышляет, как стать эффективнее, и затем настраивает и корректирует свою работу. | рефлексия и корректировка |
## Каждый принцип — пример и нарушение
- **1 — Удовлетворять заказчика рано и непрерывно.** Пример: команда интернет-магазина выпускает простой поиск в первый месяц и улучшает его каждые две недели. *Нарушение:* заказчик ничего не видит до релиза-«большого взрыва» через год.
- **2 — Приветствовать изменения требований.** Пример: за две недели до запуска клиент просит вход через Google; команда добавляет это в бэклог, а product owner расставляет приоритет. *Нарушение:* менеджер по умолчанию отвечает: «требования заморожены, оформляйте запрос на изменение во вторую фазу».
- **3 — Поставлять часто, предпочитая короткий срок.** Пример: релиз каждые 2 недели, а не каждые 2 месяца. *Нарушение:* работающий софт доходит до пользователей раз в год.
- **4 — Бизнес и разработчики работают вместе ежедневно.** Пример: product owner сидит с командой и отвечает на вопросы в тот же день. *Нарушение:* представители бизнеса встречаются с разработчиками только на старте и на приёмке.
- **5 — Мотивированные люди, условия, поддержка, доверие.** Пример: у команды хорошие ноутбуки, тихая комната и свобода выбирать, как реализовать историю. *Нарушение:* каждое техническое решение требует подписи менеджера.
- **6 — Разговор лицом к лицу.** Пример: 10 минут у доски (или видеозвонок для удалённой команды) вместо длинной переписки. *Нарушение:* разработчики, сидящие в одной комнате, общаются только через тикеты.
- **7 — Работающий софт — главное мерило прогресса.** Пример: прогресс звучит как «8 из 20 историй готовы и показаны». *Нарушение:* «готово на 90%», потому что потрачено 90% часов, но ничего не работает.
- **8 — Устойчивая разработка, постоянный темп бесконечно долго.** Пример: команда планирует по реальной ёмкости — около 40 часов в неделю. *Нарушение:* команда месяцами работает по 70 часов в неделю ради даты, а потом выгорает.
- **9 — Техническое совершенство и хороший дизайн повышают гибкость.** Пример: автотесты и регулярный рефакторинг сохраняют код лёгким для изменений. *Нарушение:* «потом поправим код» превращается в технический долг, который тормозит каждую новую функцию.
- **10 — Простота: максимум несделанной работы.** Пример: команда делает простой экспорт в CSV вместо полноценного конструктора отчётов, о котором никто не просил. *Нарушение:* разработчики «золотят» функции (gold-plating) «на всякий случай».
- **11 — Самоорганизующиеся команды.** Пример: команда сама решает архитектуру нового сервиса и кто какую задачу берёт. *Нарушение:* архитектор в одиночку проектирует всё и спускает указания.
- **12 — Регулярно размышлять, затем настраивать и корректировать.** Пример: каждые две недели ретроспектива даёт одно-два конкретных улучшения. *Нарушение:* команда из спринта в спринт повторяет одни и те же проблемы и ни разу не останавливается их обсудить.
## Как сгруппировать принципы, чтобы запомнить
| Тема | Принципы | Что их объединяет |
|---|---|---|
| Заказчик и ценность | 1, 2, 3, 7 | поставлять ценный работающий софт рано и часто и подстраиваться под изменения |
| Люди и общение | 4, 5, 6, 11 | ежедневная совместная работа, доверие, разговор лицом к лицу, самоорганизация |
| Темп и качество | 8, 9, 10 | устойчивый темп, техническое совершенство, простота |
| Улучшение | 12 | регулярная рефлексия и корректировка |
> Зацепка для номеров: **3** — «от пары недель до пары месяцев, лучше короче»; **6** — лицом к лицу; **7** — работающий софт = прогресс; **8** — постоянный темп «бесконечно долго»; **10** — простота, «искусство максимизировать объём несделанной работы»; **12** — рефлексия и корректировка (позже — ретроспектива).
> Ловушка экзамена: принцип 7 делает главным мерилом прогресса **работающий софт** — не потраченные часы, не процент закрытых задач, не подписанные документы и не velocity.
> Ловушка экзамена: принцип 10 максимизирует **несделанную** работу. Это не «делать как можно больше», а «не делать того, что не нужно».
> Ловушка экзамена: принцип 6 называет разговор лицом к лицу **самым эффективным и действенным** способом — e-mail, документы и комментарии в тикетах допустимы, но это не лучший канал.
?? Команда отчитывается «готово на 80%», потому что потрачено 80% бюджета, но показать нечего. Какому принципу это противоречит?
?= Принципу 7: работающий софт — главное мерило прогресса. Потраченный бюджет или часы показывают усилия, а не прогресс.
?? Разработчики в одном офисе пишут друг другу длинные письма по вопросу дизайна, который решился бы коротким разговором. Какой принцип и какая ценность здесь при чём?
?= Принцип 6 (разговор лицом к лицу — самый эффективный и действенный способ передать информацию) и ценность «люди и взаимодействие важнее процессов и инструментов».
?? Что значит «простота» в принципе 10 и какая потеря lean ей противоположна?
?= Простота — искусство максимизировать объём несделанной работы: делать только то, что нужно. Её противоположность — «золочение» (gold-plating), которое lean называет потерей «лишние функции» (extra features, часть 4).
## На что обратить внимание на экзамене (Exam focus)
- Четыре ценности **дословно** и по порядку: individuals and interactions / working software / customer collaboration / responding to change — **over** processes and tools / comprehensive documentation / contract negotiation / following a plan.
- «While there is value in the items on the right, we value the items on the left more» — правая сторона тоже ценна.
- Пояснения ценностей: люди, а не инструменты и процессы; нужно поставлять, бизнес-ценность, а не бумаги; гибкость, общее определение «готово»; планы составлены, когда знали меньше всего, — реагировать на неизбежные изменения.
- Принципы по номерам: 1 удовлетворение заказчика ранней и непрерывной поставкой; 2 приветствовать изменения даже поздно; 3 недели–месяцы, лучше короче; 4 бизнес и разработчики ежедневно; 5 мотивированные люди и доверие; 6 лицом к лицу; 7 работающий софт = главное мерило прогресса; 8 устойчивый постоянный темп; 9 техническое совершенство и хороший дизайн; 10 простота; 11 самоорганизующиеся команды; 12 рефлексия и корректировка.
- Типичные вопросы-ситуации «какой принцип нарушен, когда…»: переработки (8), замороженные требования (2), прогресс в часах (7), архитектор проектирует один (11), нет ретроспектив (12), бизнеса нет рядом (4), «золочение» (10).`,
  },
  [
    qx("Which of the following is one of the four values of the Agile Manifesto, worded correctly?", "Customer collaboration over contract negotiation", [
      ["Customer satisfaction over contract compliance", "It sounds agile, but the value contrasts collaboration with negotiation; \"satisfaction\" and \"compliance\" are not the Manifesto's words.", "Звучит по-agile, но ценность противопоставляет сотрудничество переговорам; слов «satisfaction» и «compliance» в Манифесте нет."],
      ["Working software over comprehensive testing", "The right-hand item is comprehensive documentation; testing is never devalued — principle 9 asks for technical excellence.", "Справа стоит исчерпывающая документация; тестирование никогда не принижается — принцип 9 требует технического совершенства."],
      ["Individuals and interactions over teams and tools", "The right-hand item is processes and tools; teams are a left-hand (people) idea, not something valued less.", "Справа стоят процессы и инструменты; команды — идея левой стороны (люди), а не то, что ценят меньше."],
    ], "The four values: individuals and interactions over processes and tools; working software over comprehensive documentation; customer collaboration over contract negotiation; responding to change over following a plan.", "Четыре ценности: люди и взаимодействие важнее процессов и инструментов; работающий софт важнее исчерпывающей документации; сотрудничество с заказчиком важнее согласования контракта; реагирование на изменения важнее следования плану."),
    qx("What does the Manifesto's sentence \"While there is value in the items on the right…\" mean?", "The right-hand items still matter, but the left ones matter more", [
      ["The right-hand items should be dropped completely from agile projects", "The sentence explicitly says there is value on the right; agile teams still plan, document and contract.", "Фраза прямо говорит, что справа тоже есть ценность; agile-команды по-прежнему планируют, документируют и заключают контракты."],
      ["Both sides are equally important and should be balanced 50/50", "Not equal: \"we value the items on the left more\".", "Не поровну: «то, что слева, мы ценим больше»."],
      ["The right-hand items apply only to large and regulated projects", "The Manifesto makes no exception for project size; it states a general preference.", "Манифест не делает исключений по размеру проекта; это общее предпочтение."],
    ], "\"While there is value in the items on the right, we value the items on the left more\" — over means \"more than\", not \"instead of\".", "«Хотя то, что справа, тоже ценно, то, что слева, мы ценим больше» — over значит «больше, чем», а не «вместо»."),
    qx("Before writing any code, a team spends six weeks producing a 120-page specification; nothing working is shown until it is complete. Which value does this neglect most directly?", "Working software over comprehensive documentation", [
      ["Individuals and interactions over processes and tools", "No process or tool is being over-used here; the problem is paperwork instead of delivered software.", "Здесь не злоупотребляют процессом или инструментом; проблема — бумаги вместо поставленного софта."],
      ["Customer collaboration over contract negotiation", "No contract terms are being negotiated here; the issue is six weeks of documents and nothing working to show.", "Здесь не торгуются об условиях контракта; суть — шесть недель документов и ничего работающего для показа."],
      ["Responding to change over following a plan", "Nothing has changed yet; the issue is what the team produces first.", "Пока ничего не изменилось; вопрос в том, что команда производит первым."],
    ], "Working software over comprehensive documentation \"emphasizes the need to deliver\" and \"focuses on the business value, rather than paperwork\".", "«Работающий софт важнее исчерпывающей документации» подчёркивает необходимость поставлять и фокус на бизнес-ценности, а не на бумагах."),
    qx("Which slide explanation belongs to the value \"Responding to change over following a plan\"?", "Initial plans were made when the least was known about the project", [
      ["Projects are undertaken by people, not tools", "This explains individuals and interactions over processes and tools.", "Это пояснение к ценности «люди и взаимодействие важнее процессов и инструментов»."],
      ["Be flexible and accommodating; work toward a shared definition of “done”", "This explains customer collaboration over contract negotiation.", "Это пояснение к ценности «сотрудничество с заказчиком важнее согласования контракта»."],
      ["Focus on the business value, rather than paperwork", "This explains working software over comprehensive documentation.", "Это пояснение к ценности «работающий софт важнее исчерпывающей документации»."],
    ], "Responding to change: acknowledge that initial plans were made when the least was known about the project; effort should be spent responding to inevitable changes.", "Реагирование на изменения: признать, что первоначальные планы составлены, когда о проекте знали меньше всего; усилия нужно тратить на реакцию на неизбежные изменения."),
    qx("\"Problems get solved by people, not processes.\" Which value does the lecture explain with this sentence?", "Individuals and interactions over processes and tools", [
      ["Working software over comprehensive documentation", "That value is explained by \"the need to deliver\" and \"business value rather than paperwork\".", "Эту ценность поясняют «необходимость поставлять» и «бизнес-ценность, а не бумаги»."],
      ["Customer collaboration over contract negotiation", "That value is explained by flexibility and a shared definition of \"done\".", "Эту ценность поясняют гибкость и общее определение «готово»."],
      ["Responding to change over following a plan", "That value is explained by plans made when the least was known.", "Эту ценность поясняет то, что планы составлены, когда знали меньше всего."],
    ], "Individuals and interactions over processes and tools: projects are undertaken by people, not tools; problems get solved by people, not processes.", "Люди и взаимодействие важнее процессов и инструментов: проекты делают люди, а не инструменты; проблемы решают люди, а не процессы."),
    qx("Which behaviour best reflects the value \"Customer collaboration over contract negotiation\"?", "Agreeing a shared definition of “done” with the customer", [
      ["Insisting on the signed scope whenever the customer asks for change", "Defending the contract against the customer is exactly contract negotiation winning over collaboration.", "Защищать контракт от заказчика — это как раз когда переговоры о контракте побеждают сотрудничество."],
      ["Writing every requirement into the contract before work starts", "This puts the contract first; the value asks the team to be flexible and accommodating.", "Это ставит контракт на первое место; ценность же просит быть гибкими и идти навстречу."],
      ["Letting the team decide alone what the customer really needs", "Deciding without the customer is the absence of collaboration, not an example of it.", "Решать без заказчика — это отсутствие сотрудничества, а не его пример."],
    ], "Slide: be flexible and accommodating; work with the customer toward a shared definition of \"done\".", "Слайд: быть гибкими и идти навстречу; работать с заказчиком над общим определением «готово»."),
    qx("According to principle 7, what is the primary measure of progress?", "Working software", [
      ["Tasks completed", "Closed tasks can hide work that does not run; the principle names working software.", "Закрытые задачи могут скрывать то, что не работает; принцип называет работающий софт."],
      ["Hours spent", "Hours show effort and cost, not progress.", "Часы показывают усилия и затраты, а не прогресс."],
      ["Approved documents", "Documents are on the right side of value 2; they do not measure progress.", "Документы — правая сторона второй ценности; они не мерило прогресса."],
    ], "Principle 7: \"Working software is the primary measure of progress.\"", "Принцип 7: «Работающий софт — главное мерило прогресса»."),
    qx("How does principle 10 define simplicity?", "The art of maximizing the amount of work not done", [
      ["The art of minimizing the number of tools and processes", "Fewer tools may be simpler, but the definition is about work not done.", "Меньше инструментов может быть проще, но определение говорит о несделанной работе."],
      ["The practice of writing the shortest possible code", "Short code is not the point; not building unneeded things is.", "Дело не в коротком коде, а в том, чтобы не делать ненужного."],
      ["The skill of doing as much work as possible quickly", "This is the opposite: simplicity maximizes the work not done.", "Это противоположность: простота максимизирует несделанную работу."],
    ], "Principle 10: \"Simplicity—the art of maximizing the amount of work not done—is essential.\"", "Принцип 10: «Простота — искусство максимизировать объём несделанной работы — крайне важна»."),
    qx("According to principle 3, how often should working software be delivered?", "Every couple of weeks to couple of months, preferring shorter", [
      ["Every couple of months to a year, preferring the longer", "The range is weeks to months, and the preference is for the shorter timescale.", "Диапазон — от недель до месяцев, и предпочтение отдаётся более короткому сроку."],
      ["Every day, because only continuous deployment counts", "Daily deployment is allowed but not required; the principle gives weeks to months.", "Ежедневный деплой допустим, но не обязателен; принцип называет недели–месяцы."],
      ["Once, at the very end, when the full scope is complete and tested", "A single final delivery contradicts \"frequently\" and principle 1's continuous delivery.", "Одна поставка в конце противоречит «часто» и непрерывной поставке из принципа 1."],
    ], "Principle 3: deliver working software frequently, from a couple of weeks to a couple of months, with a preference to the shorter timescale.", "Принцип 3: поставлять работающий софт часто — от пары недель до пары месяцев, предпочитая более короткий срок."),
    qx("According to principle 6, what is the most efficient and effective method of conveying information to and within a development team?", "Face-to-face conversation", [
      ["Detailed written specifications", "Documents are useful but slower and easier to misread; the principle names conversation.", "Документы полезны, но медленнее и их легче понять неверно; принцип называет разговор."],
      ["Comments in the issue tracker", "Ticket comments are a tool; the principle prefers people talking directly.", "Комментарии в тикетах — инструмент; принцип предпочитает прямой разговор людей."],
      ["Regular status e-mails", "E-mail is asynchronous and loses tone and quick clarification.", "E-mail асинхронен: теряются интонация и быстрые уточнения."],
    ], "Principle 6: the most efficient and effective method of conveying information to and within a development team is face-to-face conversation.", "Принцип 6: самый эффективный и действенный способ передать информацию команде и внутри неё — разговор лицом к лицу."),
    qx("To hit a launch date, a team has worked 70-hour weeks for three months, and two developers have quit. Which principle has been violated?", "Principle 8 — sustainable development at a constant pace", [
      ["Principle 2 — welcome changing requirements, even late in development", "Nothing in the case is about refusing changes.", "В кейсе нет ничего про отказ от изменений."],
      ["Principle 9 — technical excellence and good design", "Quality may suffer later, but the direct violation is the unsustainable pace.", "Качество позже может пострадать, но прямое нарушение — неустойчивый темп."],
      ["Principle 12 — reflect at regular intervals and adjust", "Reflection might reveal the problem, but the violated rule is the constant pace.", "Рефлексия могла бы выявить проблему, но нарушено именно правило постоянного темпа."],
    ], "Principle 8: agile processes promote sustainable development; sponsors, developers and users should be able to maintain a constant pace indefinitely.", "Принцип 8: agile-процессы поддерживают устойчивую разработку; спонсоры, разработчики и пользователи должны держать постоянный темп бесконечно долго."),
    qx("In month 5 of a 6-month project the customer asks for a change that would give them an edge over a competitor. The manager replies: \"Requirements are frozen.\" Which principle does this contradict?", "Welcome changing requirements, even late in development", [
      ["Deliver working software frequently, preferring shorter cycles", "Delivery frequency is not the issue; refusing a late change is.", "Частота поставки здесь ни при чём; проблема — отказ от поздних изменений."],
      ["Working software is the primary measure of progress", "Progress measurement is not discussed in the case.", "Измерение прогресса в кейсе не обсуждается."],
      ["Simplicity — maximize the amount of work not done", "Simplicity does not justify refusing valuable changes; it avoids unneeded work.", "Простота не оправдывает отказ от ценных изменений; она про отказ от ненужной работы."],
    ], "Principle 2: welcome changing requirements, even late in development; agile processes harness change for the customer's competitive advantage.", "Принцип 2: приветствовать изменения требований даже на поздних стадиях; agile-процессы обращают изменения в конкурентное преимущество заказчика."),
    qx("Business stakeholders meet the developers only at project kick-off and at final acceptance. Which principle is violated?", "Business people and developers must work together daily", [
      ["Build projects around motivated individuals and trust them", "Trust and motivation are not what is missing here; daily contact with the business is.", "Здесь не хватает не доверия и мотивации, а ежедневного контакта с бизнесом."],
      ["The best designs emerge from self-organizing teams", "Self-organization concerns how the team works, not business availability.", "Самоорганизация — о том, как работает команда, а не о доступности бизнеса."],
      ["Agile processes promote sustainable development", "Sustainable pace is unrelated to how often the business is involved.", "Устойчивый темп не связан с тем, как часто участвует бизнес."],
    ], "Principle 4: business people and developers must work together daily throughout the project — not only at the start and the end.", "Принцип 4: бизнес и разработчики должны работать вместе ежедневно на протяжении всего проекта — а не только в начале и в конце."),
    qx("A senior architect designs the whole system alone and hands detailed instructions to the developers. Which principle does this go against most directly?", "The best architectures emerge from self-organizing teams", [
      ["Continuous attention to technical excellence enhances agility", "The architect may be technically excellent; the problem is who makes the design.", "Архитектор может быть технически блестящим; проблема в том, кто принимает решения по дизайну."],
      ["Satisfy the customer through early and continuous delivery", "Delivery to the customer is not what the case describes.", "Кейс не про поставку заказчику."],
      ["Business people and developers must work together daily", "The architect is not a business person; the case is about design authority inside the team.", "Архитектор — не представитель бизнеса; кейс про полномочия по дизайну внутри команды."],
    ], "Principle 11: the best architectures, requirements and designs emerge from self-organizing teams — not from one person handing down instructions.", "Принцип 11: лучшие архитектуры, требования и решения рождаются в самоорганизующихся командах, а не у одного человека, который спускает указания."),
    qx("Which principle is put into practice by a sprint retrospective?", "At regular intervals the team reflects on how to be more effective", [
      ["Business people and developers must work together daily", "Daily business involvement is about the product owner's availability, not reflection.", "Ежедневное участие бизнеса — о доступности product owner, а не о рефлексии."],
      ["Working software is the primary measure of progress", "That is reflected in the sprint review and the demo of the increment.", "Это отражается в обзоре спринта (sprint review) и демонстрации инкремента."],
      ["Deliver working software frequently, preferring shorter timescales", "That is the sprint cadence itself, not the retrospective.", "Это сам ритм спринтов, а не ретроспектива."],
    ], "Principle 12: at regular intervals the team reflects on how to become more effective, then tunes and adjusts its behavior — exactly what a retrospective does.", "Принцип 12: команда регулярно размышляет, как стать эффективнее, и корректирует работу — ровно то, что делает ретроспектива."),
    qx("According to principle 1, what is the highest priority?", "Satisfying the customer through early, continuous delivery", [
      ["Following the agreed plan and avoiding any costly deviations from it", "Following a plan is the right-hand side of value 4, not the highest priority.", "Следование плану — правая сторона четвёртой ценности, а не наивысший приоритет."],
      ["Producing complete documentation before development", "Documentation first contradicts working software over comprehensive documentation.", "Документация в первую очередь противоречит ценности «работающий софт важнее документации»."],
      ["Keeping every team member fully utilized at all times", "Utilization is not mentioned; value delivered to the customer is.", "О загрузке людей речи нет; речь о ценности, поставленной заказчику."],
    ], "Principle 1: our highest priority is to satisfy the customer through early and continuous delivery of valuable software.", "Принцип 1: наш наивысший приоритет — удовлетворить заказчика ранней и непрерывной поставкой ценного софта."),
    qx("Principle 5 says to build projects around motivated individuals. What else does it say?", "Give them the environment and support they need, and trust them", [
      ["Monitor their daily output closely to keep motivation high", "Close monitoring signals distrust; the principle says to trust them to get the job done.", "Пристальный контроль — знак недоверия; принцип говорит доверить им работу."],
      ["Reward the top performer of each iteration with a bonus", "Individual competition is not in the principle and can hurt team collaboration.", "Индивидуального соревнования в принципе нет, и оно может вредить командной работе."],
      ["Give each of them a fixed role with a detailed written job description", "Rigid roles are not mentioned; environment, support and trust are.", "Жёсткие роли не упоминаются; упоминаются условия, поддержка и доверие."],
    ], "Principle 5: build projects around motivated individuals. Give them the environment and support they need, and trust them to get the job done.", "Принцип 5: стройте проекты вокруг мотивированных людей; дайте им нужные условия и поддержку и доверьте им сделать работу."),
    qx("A team keeps postponing refactoring and test automation, and each new feature now takes twice as long. Which principle are they neglecting?", "Continuous attention to technical excellence and good design", [
      ["Simplicity — the art of maximizing the work not done", "Simplicity is about not building unneeded features; here the issue is code quality.", "Простота — о том, чтобы не делать ненужных функций; здесь проблема в качестве кода."],
      ["Welcome changing requirements, even late in development", "Nobody is refusing changes; the code has simply become hard to change.", "Никто не отказывается от изменений; просто код стало трудно менять."],
      ["Face-to-face conversation is the best way to share information", "Communication is not the problem described.", "Проблема в кейсе — не общение."],
    ], "Principle 9: continuous attention to technical excellence and good design enhances agility. Skipping it creates technical debt that slows every change.", "Принцип 9: постоянное внимание к техническому совершенству и хорошему дизайну повышает гибкость. Без него копится технический долг, тормозящий каждое изменение."),
    tfx("The Agile Manifesto states that comprehensive documentation, contracts and plans have no value in agile projects.", false,
      "The Manifesto says the opposite: \"While there is value in the items on the right, we value the items on the left more.\" Documentation, contracts and plans still have value.",
      "Манифест говорит обратное: «Хотя то, что справа, тоже ценно, то, что слева, мы ценим больше». Документация, контракты и планы по-прежнему ценны.",
      "\"True\" reads \"over\" as \"instead of\" — the classic misreading of the Manifesto.",
      "«Верно» читает over как «вместо» — классическое неверное прочтение Манифеста."),
    qx("Which of the following is NOT one of the twelve principles of the Agile Manifesto?", "Fix the full scope early so that the estimates stay accurate", [
      ["Welcome changing requirements, even late in development", "This is principle 2.", "Это принцип 2."],
      ["Simplicity—the art of maximizing the amount of work not done—is essential", "This is principle 10.", "Это принцип 10."],
      ["Business people and developers must work together daily", "This is principle 4.", "Это принцип 4."],
    ], "Fixing all scope early contradicts principle 2 (welcome change) and the inverted triangle, where scope is the variable.", "Фиксировать весь объём заранее противоречит принципу 2 (приветствовать изменения) и перевёрнутому треугольнику, где меняется как раз объём."),
  ],
);

const p3 = part(
  "pm-l6-p3",
  { en: "Agile methods overview: Scrum and XP", ru: "Обзор agile-методов: Scrum и XP" },
  {
    en: `## Agile methodologies — the family
- There are **over 12 actively used agile methodologies**.
- Common approaches include: **Scrum; Extreme Programming (XP); Lean product development; Kanban; Feature-Driven Development (FDD); Dynamic Systems Development Method (DSDM); Crystal family of methods.**
- **The most widely used are Scrum and XP.** Many teams combine them: Scrum to manage the work, XP for engineering practices.
| Method | Core idea in one line | Remember it by |
|---|---|---|
| Scrum | a lightweight framework of roles, events, artifacts and rules built on transparency, inspection and adaptation | sprints, product owner, ScrumMaster |
| XP | software development best practices pushed to the "extreme" | pair programming, TDD, continuous integration |
| Lean product development | maximize value by eliminating waste (from lean manufacturing) | 7 wastes, 7 core concepts |
| Kanban | visualize the workflow and limit work in progress | the board, WIP limits |
| FDD | plan, design and build by feature around a domain model | feature list, class ownership |
| DSDM | 8 principles around the business need and on-time delivery | "never compromise quality", timeboxes |
| Crystal | a family of methods chosen by criticality and team size | Clear, Yellow, Orange, Red, Magenta |
> Exam trap: lean appears in the list of common approaches, but the lean slide says it is "closely aligned with agile, but **not an agile methodology**" (Part 4). If a question asks which one is *not* an agile methodology in the strict sense, the answer is lean.
## Scrum — definition and three pillars
- Scrum is a **lightweight, easy to understand model**.
- It is a **set of practices, roles, events, artifacts, and rules designed to guide the team in executing the project**.
- It is **based on three pillars** — the pillars of empirical process control from Part 1:
| Pillar | Slide definition | IT example |
|---|---|---|
| Transparency | give visibility to those responsible for the outcome of the project | the sprint board and the burndown chart are visible to the team, the product owner and stakeholders |
| Inspection | conduct timely checks on how well a project is progressing toward goals | at the daily scrum the team checks progress toward the sprint goal |
| Adaptation | adjust a process to minimize further issues if inspection shows a problem | the retrospective shows that code reviews wait 3 days, so the team agrees a "review within 24 hours" rule |
> Memory hook: **T-I-A — "see it, check it, fix it."** Inspection without transparency checks the wrong picture; inspection without adaptation changes nothing.
## The Scrum process (figure)
The figure on the slide shows one **Sprint (2–4 weeks)** as a loop:
| Step | What happens (from the figure) |
|---|---|
| Project vision → product backlog | the vision is turned into an ordered list of work |
| Sprint planning meeting | backlog review; team discussions and estimates; definition of the sprint goal; definition of "done"; plan to deliver the sprint goal |
| Sprint backlog and plan | the output of sprint planning |
| Daily scrum (every day) | What has been done? What will be done? What obstacles are in the way? |
| Build the features and execute the plan | the development work of the sprint, resulting in the product (increment) |
| Sprint review | inspect the product; adjust the backlog; demonstrate that work is "done" |
| Sprint retrospective | reflect on the process; identify potential improvement; focus on people, relationships, processes, tools |
| Loop or finish | the next sprint starts from the updated product backlog — or the final product is accepted and the project is complete |
## Sprints
- A sprint is a **timeboxed (time-limited) iteration** of **one month or less**, in which the **team builds a potentially releasable product**.
- It is a **one or two-week long mini-project**; **no changes are made that would affect the sprint goal**.
- **Scrum "sprint" = generic agile "iteration".**
> Exam trap: the slides give three different numbers. The bullet reads "One month of lesson" — a typo for "one month **or less**" (the Scrum Guide's rule); the next bullet says "one or two-week long"; the figure says "2–4 weeks". Safe answer: a sprint is a timebox of **one month or less**; two weeks is the most common length; the length stays the same from sprint to sprint.
> Exam trap: "no changes that would affect the sprint goal" does not freeze every detail of the sprint backlog — the team may refine *how* it reaches the goal, but the goal itself is protected. A new urgent request normally goes to the product backlog for a later sprint.
## Scrum team roles
| Role | Slide definition | Owns | IT example |
|---|---|---|---|
| Development team | self-organizing group of people who build the product increments | how the work is done; the increment | 5 developers and a tester decide among themselves who takes which story |
| Product owner | manages the product backlog (list of work to be done) with the goal of maximizing the product value | the product backlog and its order | the PO moves "Apple Pay" above "dark mode" because it brings more revenue |
| ScrumMaster | servant leader who ensures that the Scrum methodology is understood and used effectively | the process; removing impediments | the ScrumMaster coaches a new team on a 15-minute daily scrum and removes a blocker with the IT department |
> Exam trap: the **product owner** maximizes product value and orders the backlog; the **ScrumMaster** is a servant leader for the process — not the team's boss and not the person who assigns tasks. The 2020 Scrum Guide says "Developers" and "Scrum Master"; the slide's older names mean the same (details in Lecture 7).
## Scrum activities (events, ceremonies)
| Activity | Slide definition | When | Who |
|---|---|---|---|
| Backlog refinement | meeting to discuss and update the backlog items | during the sprint, as needed | product owner and team |
| Sprint planning meeting | used to determine what will be delivered in the sprint and how the work will be achieved | start of the sprint | whole Scrum team |
| Daily scrum | daily 15-minute timeboxed meeting of the development team; assess progress toward the sprint goal | every day | development team |
| Sprint review | meeting at the end of the sprint; inspect the increment or product and update the backlog | end of the sprint | Scrum team and stakeholders |
| Sprint retrospective | meeting at the end of the sprint; team reflects on their processes and looks for improvements | end of the sprint, after the review | Scrum team |
> Exam trap: **sprint review = the product** (inspect the increment, update the backlog, stakeholders present). **Sprint retrospective = the process** (how we work, improvements). Both happen at the end of the sprint; the review comes first.
## Scrum artifacts
| Artifact | Slide definition |
|---|---|
| Product increment | development team members build an increment of the solution, demo the increment, and get feedback |
| Product backlog | dynamic and evolving prioritized list of all the work to be done that serves as the **single source of requirements** |
| Sprint backlog | subset of items from the product backlog that have been selected as the goal of a sprint |
= Scrum (lecture 6): 3 pillars + 3 roles + 5 activities + 3 artifacts
## Extreme Programming (XP)
- XP is an **approach focused on software development best practices**.
- It **embraces five core values**:
| Value | Slide definition | IT example |
|---|---|---|
| Simplicity | reduce complexity, extra features, and waste | build the simplest login that passes the tests; no "maybe later" options |
| Communication | make sure all team members know what is expected of them and what others are working on | the whole team sits together; the board shows who works on what |
| Feedback | get impressions of suitability early | show the customer a working screen after two days, not after two months |
| Courage | have courage to allow work to be entirely visible | the team shows unfinished, buggy code at the review instead of hiding it |
| Respect | have respect for others when working as a team; everyone is accountable for the success or failure of the project | nobody blames a single developer for a failed release |
> Memory hook: **"Simple Code Feels Courageous and Respectful"** — Simplicity, Communication, Feedback, Courage, Respect.
## XP life cycle (figure)
- A **project with one or more releases** starts from **user stories** (requirements and test scenarios).
- **Release planning:** define tasks and high-level estimates; system metaphor; simple design. It is supported by an **architectural spike** (prove the approach; simple design) and **spikes** (reduce risks). The result is a **release plan**.
- **Iteration (2 weeks):** **iteration planning** — the customer explains functionality; tasks and estimates are defined; metaphor; simple design. The result is an **iteration plan**.
- The work is done by **pair programming**, producing a **product increment** that is checked by **acceptance tests**.
- After **customer approval**, a **small release** goes out. A **release** contains multiple iterations; at the end the **final product is delivered and the project is complete**.
> A **spike** is a short, time-boxed experiment to learn something or reduce a risk (for example, a two-day test of whether a payment API can handle the load) — its output is knowledge, not a feature.
## XP team roles
| Role | Slide definition | Close Scrum analogue |
|---|---|---|
| Coach | mentor and facilitator who helps the team stay effective and on track by reinforcing communication with and across teams | ScrumMaster |
| Customer | business representative who provides project requirements and priorities, and confirms the final product works as intended | product owner |
| Programmers | developers who build the product by writing and implementing code for requested user stories | development team |
| Testers | provide quality assurance and help the customer define and write acceptance tests | part of the development team |
> Exam trap: in XP the **testers help the customer** define and write acceptance tests; the **customer** owns requirements and priorities and confirms that the product works.
## XP core practices
| Practice | Slide definition |
|---|---|
| Whole team | contributors sit together in the same location, as members of the same team |
| Planning games: release planning | a release is a push of new functionality to the production user; a project typically has one or more releases |
| Planning games: iteration planning | an iteration is a short development cycle within a release; in Scrum these are called "sprints" |
| Small releases | used to demonstrate progress, increase visibility, and rapidly deploy working software to the end user |
| Customer tests | the customer describes one or more tests that will show that the software is working as intended |
| Collective code ownership | any pair of developers can improve or amend any code |
| Code standards | teams follow a consistent coding standard |
| Sustainable pace | the highest level of productivity is achieved by a team operating at a sustainable pace |
| Metaphor | use metaphors and similes to explain designs and create a shared vision that all stakeholders can understand |
| Continuous integration | make sure code compiles and works together |
| Test-driven development | the team writes the tests before developing the code |
| Refactoring | improve the design of existing code without altering external behavior or adding new functionality |
| Simple design | simple, but adequate design allows teams to develop code quickly and adapt as necessary |
| Pair programming | production code is written by two developers working as a pair |
- **Metaphor, IT example:** "our message queue is a post office: producers drop letters into mailboxes, the broker sorts them, consumers pick them up" — the business and the developers now share one picture.
- **TDD, IT example:** before writing the discount function, the developer writes a test "10% off for orders above 50,000 tenge", watches it fail, then writes just enough code to make it pass.
- **Continuous integration, IT example:** every push to the main branch triggers a build and the test suite, so broken code is found within minutes.
> Exam trap: **collective code ownership** (XP — any pair can change any code) is the opposite of **individual class (code) ownership** (FDD, Part 4).
> Exam trap: **refactoring** changes the internal design only — no new functionality and no change in external behavior. Adding a feature while "cleaning up" is not refactoring.
?? Which Scrum event inspects the increment and updates the backlog, and which one improves the way the team works?
?= The sprint review inspects the increment or product and updates the backlog; the sprint retrospective is where the team reflects on its processes and looks for improvements.
?? A developer fixes a bug in a module written by another pair without asking permission. Which XP practice allows this?
?= Collective code ownership: any pair of developers can improve or amend any code.
?? Who in XP provides requirements and priorities, and who helps to write acceptance tests?
?= The customer provides requirements and priorities and confirms the product works; the testers provide quality assurance and help the customer define and write acceptance tests.
## Exam focus
- Over 12 agile methodologies; common: Scrum, XP, Lean, Kanban, FDD, DSDM, Crystal; **most widely used: Scrum and XP**.
- Scrum: lightweight, easy to understand; practices, roles, events, artifacts and rules; pillars **transparency, inspection, adaptation** with their definitions.
- Sprint: timeboxed iteration, one month or less, potentially releasable product, no changes that affect the sprint goal; sprint = iteration.
- Roles: development team (self-organizing, builds increments), product owner (backlog, maximizes value), ScrumMaster (servant leader, Scrum understood and used effectively).
- Activities: backlog refinement, sprint planning (what and how), daily scrum (15 minutes, development team, sprint goal), sprint review (increment, backlog), sprint retrospective (process, improvements).
- Artifacts: product increment, product backlog (single source of requirements), sprint backlog (subset selected as the sprint goal).
- XP values: simplicity, communication, feedback, courage, respect. XP roles: coach, customer, programmers, testers.
- XP practices: whole team, planning games (release and iteration planning), small releases, customer tests, collective code ownership, code standards, sustainable pace, metaphor, continuous integration, TDD, refactoring, simple design, pair programming.`,
    ru: `## Agile-методологии — семейство
- Существует **больше 12 активно используемых agile-методологий (over 12 actively used agile methodologies)**.
- Распространённые подходы: **Scrum; экстремальное программирование (Extreme Programming, XP); бережливая разработка продукта (Lean product development); Kanban; разработка, управляемая функциями (Feature-Driven Development, FDD); метод разработки динамических систем (Dynamic Systems Development Method, DSDM); семейство методов Crystal (Crystal family of methods).**
- **Самые распространённые — Scrum и XP.** Многие команды их совмещают: Scrum — чтобы управлять работой, XP — ради инженерных практик.
| Метод | Суть в одной строке | Запомнить по |
|---|---|---|
| Scrum | облегчённый фреймворк из ролей, событий, артефактов и правил на основе прозрачности, инспекции и адаптации | спринты, product owner, ScrumMaster |
| XP | лучшие практики разработки ПО, доведённые до «экстрима» | парное программирование, TDD, непрерывная интеграция |
| Lean product development | максимизировать ценность, устраняя потери (из бережливого производства) | 7 видов потерь, 7 ключевых идей |
| Kanban | визуализировать поток работы и ограничивать незавершённую работу | доска, WIP-лимиты |
| FDD | планировать, проектировать и строить по функциям вокруг модели предметной области | список функций, владение классами |
| DSDM | 8 принципов вокруг бизнес-потребности и поставки в срок | «никогда не жертвовать качеством», таймбоксы |
| Crystal | семейство методов, выбираемых по критичности и размеру команды | Clear, Yellow, Orange, Red, Magenta |
> Ловушка экзамена: lean стоит в списке распространённых подходов, но слайд про lean говорит, что он «тесно связан с agile, но **не является agile-методологией**» (часть 4). Если спрашивают, что *не* является agile-методологией в строгом смысле, — ответ lean.
## Scrum — определение и три столпа
- Scrum — **облегчённая, лёгкая для понимания модель (lightweight, easy to understand model)**.
- Это **набор практик, ролей, событий, артефактов и правил, который направляет команду при выполнении проекта**.
- Он **основан на трёх столпах (three pillars)** — столпах эмпирического управления процессом из части 1:
| Столп | Определение слайда | Пример из IT |
|---|---|---|
| Transparency — прозрачность | дать видимость тем, кто отвечает за результат проекта | доска спринта и график сгорания видны команде, product owner и стейкхолдерам |
| Inspection — инспекция | своевременно проверять, насколько проект продвигается к целям | на daily scrum команда проверяет продвижение к цели спринта |
| Adaptation — адаптация | скорректировать процесс, чтобы свести к минимуму дальнейшие проблемы, если инспекция выявила проблему | ретроспектива показала, что код-ревью ждут по 3 дня, и команда вводит правило «ревью за 24 часа» |
> Зацепка: **T-I-A — «увидеть, проверить, исправить».** Инспекция без прозрачности проверяет не ту картину; инспекция без адаптации ничего не меняет.
## Процесс Scrum (рисунок)
Рисунок на слайде показывает один **спринт (Sprint, 2–4 недели)** как цикл:
| Шаг | Что происходит (по рисунку) |
|---|---|
| Видение проекта → бэклог продукта (product backlog) | видение превращают в упорядоченный список работы |
| Планирование спринта (sprint planning meeting) | обзор бэклога; обсуждение и оценки командой; определение цели спринта (sprint goal); определение «готово» (definition of "done"); план достижения цели спринта |
| Бэклог спринта и план (sprint backlog and plan) | результат планирования спринта |
| Daily scrum (каждый день) | Что сделано? Что будет сделано? Какие препятствия мешают? |
| Делать функции и выполнять план | работа разработки в спринте, результат — продукт (инкремент) |
| Обзор спринта (sprint review) | проверить продукт; скорректировать бэклог; показать, что работа «готова» |
| Ретроспектива спринта (sprint retrospective) | осмыслить процесс; найти возможные улучшения; фокус на людях, отношениях, процессах, инструментах |
| Цикл или финиш | следующий спринт начинается с обновлённого бэклога — или финальный продукт принят и проект завершён |
## Спринты
- Спринт — **итерация с таймбоксом (timeboxed, ограниченная по времени)** длиной **один месяц или меньше**, за которую **команда создаёт потенциально готовый к выпуску продукт (potentially releasable product)**.
- Это **мини-проект длиной одна-две недели**; **не вносят изменений, которые повлияли бы на цель спринта**.
- **Scrum-«спринт» = общий agile-термин «итерация» (iteration).**
> Ловушка экзамена: на слайдах три разных числа. В пункте написано «One month of lesson» — опечатка вместо «one month **or less**» («месяц или меньше», правило Scrum Guide); следующий пункт говорит «одна-две недели»; рисунок — «2–4 недели». Безопасный ответ: спринт — таймбокс **не длиннее месяца**; чаще всего две недели; длина не меняется от спринта к спринту.
> Ловушка экзамена: «никаких изменений, влияющих на цель спринта» не замораживает каждую деталь бэклога спринта — команда может уточнять, *как* она достигнет цели, но сама цель защищена. Новый срочный запрос обычно идёт в бэклог продукта, на один из следующих спринтов.
## Роли команды Scrum
| Роль | Определение слайда | Отвечает за | Пример из IT |
|---|---|---|---|
| Development team — команда разработки | самоорганизующаяся группа людей, которая создаёт инкременты продукта | как делается работа; инкремент | 5 разработчиков и тестировщик сами решают, кто какую историю берёт |
| Product owner — владелец продукта | управляет бэклогом продукта (списком работы) с целью максимизировать ценность продукта | бэклог продукта и его порядок | PO ставит «Apple Pay» выше «тёмной темы», потому что это приносит больше выручки |
| ScrumMaster — скрам-мастер | лидер-слуга (servant leader), который следит, чтобы Scrum понимали и применяли эффективно | процесс; устранение препятствий | скрам-мастер учит новую команду проводить 15-минутный daily scrum и снимает блокер с отделом IT |
> Ловушка экзамена: **product owner** максимизирует ценность продукта и упорядочивает бэклог; **ScrumMaster** — лидер-слуга для процесса, а не начальник команды и не тот, кто раздаёт задачи. В Scrum Guide 2020 — «Developers» и «Scrum Master»; старые названия со слайда означают то же самое (подробно — в лекции 7).
## Активности Scrum (события, церемонии — events, ceremonies)
| Активность | Определение слайда | Когда | Кто |
|---|---|---|---|
| Backlog refinement — уточнение бэклога | встреча, чтобы обсудить и обновить элементы бэклога | во время спринта, по необходимости | product owner и команда |
| Sprint planning meeting — планирование спринта | определить, что будет поставлено в спринте и как будет сделана работа | начало спринта | вся Scrum-команда |
| Daily scrum — ежедневный скрам | ежедневная 15-минутная встреча команды разработки с таймбоксом; оценить продвижение к цели спринта | каждый день | команда разработки |
| Sprint review — обзор спринта | встреча в конце спринта; проверить инкремент или продукт и обновить бэклог | конец спринта | Scrum-команда и стейкхолдеры |
| Sprint retrospective — ретроспектива спринта | встреча в конце спринта; команда осмысляет свои процессы и ищет улучшения | конец спринта, после обзора | Scrum-команда |
> Ловушка экзамена: **sprint review — о продукте** (проверить инкремент, обновить бэклог, стейкхолдеры присутствуют). **Sprint retrospective — о процессе** (как мы работаем, улучшения). Обе встречи в конце спринта; обзор идёт первым.
## Артефакты Scrum
| Артефакт | Определение слайда |
|---|---|
| Product increment — инкремент продукта | члены команды разработки создают инкремент решения, показывают его и получают обратную связь |
| Product backlog — бэклог продукта | динамичный, развивающийся приоритизированный список всей работы, который служит **единственным источником требований (single source of requirements)** |
| Sprint backlog — бэклог спринта | подмножество элементов бэклога продукта, выбранных как цель спринта |
= Scrum (lecture 6): 3 pillars + 3 roles + 5 activities + 3 artifacts
## Экстремальное программирование (XP)
- XP — **подход, сосредоточенный на лучших практиках разработки ПО**.
- Он **опирается на пять ключевых ценностей (core values)**:
| Ценность | Определение слайда | Пример из IT |
|---|---|---|
| Simplicity — простота | уменьшать сложность, лишние функции и потери | сделать самый простой вход, который проходит тесты; никаких опций «вдруг пригодится» |
| Communication — общение | все члены команды знают, чего от них ждут и над чем работают другие | вся команда сидит вместе; доска показывает, кто над чем работает |
| Feedback — обратная связь | рано получать впечатления о пригодности | показать заказчику рабочий экран через два дня, а не через два месяца |
| Courage — смелость | иметь смелость сделать работу полностью видимой | команда показывает на обзоре незаконченный код с багами, а не прячет его |
| Respect — уважение | уважать других при работе в команде; каждый отвечает за успех или провал проекта | никто не винит одного разработчика в неудачном релизе |
> Зацепка: **«Simple Code Feels Courageous and Respectful»** — Simplicity, Communication, Feedback, Courage, Respect.
## Жизненный цикл XP (рисунок)
- **Проект с одним или несколькими релизами** начинается с **пользовательских историй (user stories)** — требований и тестовых сценариев.
- **Планирование релиза (release planning):** определить задачи и высокоуровневые оценки; системная метафора; простой дизайн. Его поддерживают **архитектурный спайк (architectural spike)** — доказать подход, простой дизайн — и **спайки (spikes)** — снизить риски. Результат — **план релиза (release plan)**.
- **Итерация (2 недели):** **планирование итерации (iteration planning)** — заказчик объясняет функциональность; задачи и оценки определены; метафора; простой дизайн. Результат — **план итерации (iteration plan)**.
- Работу делают **парным программированием (pair programming)**; получается **инкремент продукта**, который проверяют **приёмочные тесты (acceptance tests)**.
- После **одобрения заказчиком (customer approval)** выходит **малый релиз (small release)**. **Релиз** состоит из нескольких итераций; в конце **финальный продукт поставлен, проект завершён**.
> **Спайк (spike)** — короткий эксперимент с таймбоксом, чтобы что-то узнать или снизить риск (например, двухдневная проверка, выдержит ли платёжный API нагрузку); его результат — знание, а не функция.
## Роли в команде XP
| Роль | Определение слайда | Близкий аналог в Scrum |
|---|---|---|
| Coach — коуч | наставник и фасилитатор, который помогает команде оставаться эффективной и на верном пути, укрепляя общение внутри команд и между ними | ScrumMaster |
| Customer — заказчик | представитель бизнеса, который даёт требования и приоритеты проекта и подтверждает, что итоговый продукт работает как задумано | product owner |
| Programmers — программисты | разработчики, которые создают продукт, пишут и внедряют код для запрошенных пользовательских историй | команда разработки |
| Testers — тестировщики | обеспечивают контроль качества и помогают заказчику определить и написать приёмочные тесты | часть команды разработки |
> Ловушка экзамена: в XP **тестировщики помогают заказчику** определить и написать приёмочные тесты; **заказчик** отвечает за требования и приоритеты и подтверждает, что продукт работает.
## Ключевые практики XP (core practices)
| Практика | Определение слайда |
|---|---|
| Whole team — вся команда | участники сидят вместе в одном месте как члены одной команды |
| Planning games: release planning — планирование релиза | релиз — выкатка новой функциональности рабочему пользователю; в проекте обычно один или несколько релизов |
| Planning games: iteration planning — планирование итерации | итерация — короткий цикл разработки внутри релиза; в Scrum их называют «спринтами» |
| Small releases — малые релизы | нужны, чтобы показывать прогресс, повышать видимость и быстро доставлять работающий софт конечному пользователю |
| Customer tests — тесты заказчика | заказчик описывает один или несколько тестов, которые покажут, что софт работает как задумано |
| Collective code ownership — коллективное владение кодом | любая пара разработчиков может улучшить или изменить любой код |
| Code standards — стандарты кода | команды следуют единому стандарту кодирования |
| Sustainable pace — устойчивый темп | наивысшая производительность достигается, когда команда работает в устойчивом темпе |
| Metaphor — метафора | использовать метафоры и сравнения, чтобы объяснять дизайн и создавать общее видение, понятное всем стейкхолдерам |
| Continuous integration — непрерывная интеграция | следить, чтобы код компилировался и работал вместе |
| Test-driven development — разработка через тестирование (TDD) | команда пишет тесты до разработки кода |
| Refactoring — рефакторинг | улучшать дизайн существующего кода, не меняя внешнего поведения и не добавляя новой функциональности |
| Simple design — простой дизайн | простой, но достаточный дизайн позволяет быстро писать код и адаптироваться по необходимости |
| Pair programming — парное программирование | рабочий код пишут два разработчика в паре |
- **Метафора, пример из IT:** «наша очередь сообщений — это почта: отправители бросают письма в ящики, брокер их сортирует, получатели забирают» — у бизнеса и разработчиков теперь одна картинка.
- **TDD, пример из IT:** перед тем как писать функцию скидки, разработчик пишет тест «10% скидки для заказов дороже 50 000 тенге», видит, что он падает, и пишет ровно столько кода, чтобы тест прошёл.
- **Непрерывная интеграция, пример из IT:** каждый пуш в основную ветку запускает сборку и тесты, так что сломанный код находится за минуты.
> Ловушка экзамена: **коллективное владение кодом (collective code ownership)** (XP — любая пара может менять любой код) — противоположность **индивидуального владения классами (individual class (code) ownership)** (FDD, часть 4).
> Ловушка экзамена: **рефакторинг** меняет только внутренний дизайн — без новой функциональности и без изменения внешнего поведения. Добавить функцию во время «уборки» — это не рефакторинг.
?? Какое событие Scrum проверяет инкремент и обновляет бэклог, а какое улучшает то, как работает команда?
?= Sprint review проверяет инкремент или продукт и обновляет бэклог; на sprint retrospective команда осмысляет свои процессы и ищет улучшения.
?? Разработчик исправляет баг в модуле, который написала другая пара, не спрашивая разрешения. Какая практика XP это позволяет?
?= Коллективное владение кодом (collective code ownership): любая пара разработчиков может улучшить или изменить любой код.
?? Кто в XP даёт требования и приоритеты, а кто помогает писать приёмочные тесты?
?= Заказчик (customer) даёт требования и приоритеты и подтверждает, что продукт работает; тестировщики (testers) обеспечивают контроль качества и помогают заказчику определить и написать приёмочные тесты.
## На что обратить внимание на экзамене (Exam focus)
- Больше 12 agile-методологий; распространённые: Scrum, XP, Lean, Kanban, FDD, DSDM, Crystal; **самые распространённые — Scrum и XP**.
- Scrum: облегчённый, лёгкий для понимания; практики, роли, события, артефакты и правила; столпы **transparency, inspection, adaptation** с определениями.
- Спринт: итерация с таймбоксом, не длиннее месяца, потенциально готовый к выпуску продукт, никаких изменений, влияющих на цель спринта; спринт = итерация.
- Роли: команда разработки (самоорганизуется, создаёт инкременты), product owner (бэклог, максимизирует ценность), ScrumMaster (лидер-слуга, Scrum понимают и применяют эффективно).
- Активности: backlog refinement, sprint planning (что и как), daily scrum (15 минут, команда разработки, цель спринта), sprint review (инкремент, бэклог), sprint retrospective (процесс, улучшения).
- Артефакты: инкремент продукта, бэклог продукта (единственный источник требований), бэклог спринта (подмножество, выбранное как цель спринта).
- Ценности XP: simplicity, communication, feedback, courage, respect. Роли XP: coach, customer, programmers, testers.
- Практики XP: whole team, planning games (release и iteration planning), small releases, customer tests, collective code ownership, code standards, sustainable pace, metaphor, continuous integration, TDD, refactoring, simple design, pair programming.`,
  },
  [
    qx("According to the lecture, which two agile methodologies are the most widely used?", "Scrum and XP", [
      ["Kanban and Lean", "Both are on the list of common approaches, but the slide names Scrum and XP as the most widely used; lean is not even an agile methodology in the strict sense.", "Оба есть в списке распространённых подходов, но слайд называет самыми распространёнными Scrum и XP; lean в строгом смысле даже не agile-методология."],
      ["DSDM and FDD", "These are on the list of common approaches, not the most widely used ones.", "Они есть в списке распространённых подходов, но не самые распространённые."],
      ["Crystal and Scrum", "Scrum is right, but Crystal is a family of methods chosen by criticality and team size, not one of the two most used.", "Scrum — верно, но Crystal — семейство методов по критичности и размеру команды, а не один из двух самых распространённых."],
    ], "Slide: over 12 actively used agile methodologies; the most widely used are Scrum and XP.", "Слайд: больше 12 активно используемых agile-методологий; самые распространённые — Scrum и XP."),
    qx("Which of the following is NOT one of the three pillars of Scrum?", "Commitment", [
      ["Transparency", "Transparency is pillar 1: give visibility to those responsible for the outcome.", "Прозрачность — первый столп: дать видимость тем, кто отвечает за результат."],
      ["Inspection", "Inspection is pillar 2: timely checks on progress toward goals.", "Инспекция — второй столп: своевременные проверки продвижения к целям."],
      ["Adaptation", "Adaptation is pillar 3: adjust the process if inspection shows a problem.", "Адаптация — третий столп: скорректировать процесс, если инспекция выявила проблему."],
    ], "The pillars are transparency, inspection and adaptation. Commitment is one of the Scrum values in the Scrum Guide, not a pillar.", "Столпы — прозрачность, инспекция и адаптация. Commitment (приверженность) — одна из ценностей Scrum в Scrum Guide, а не столп."),
    qx("\"Give visibility to those responsible for the outcome of the project.\" Which Scrum pillar is this?", "Transparency", [
      ["Inspection", "Inspection is conducting timely checks on progress toward goals.", "Инспекция — своевременно проверять продвижение к целям."],
      ["Adaptation", "Adaptation is adjusting the process when inspection shows a problem.", "Адаптация — корректировать процесс, когда инспекция выявила проблему."],
      ["Communication", "Communication is an XP core value, not a Scrum pillar.", "Communication — ключевая ценность XP, а не столп Scrum."],
    ], "Transparency: give visibility to those responsible for the outcome of the project — boards, burndown charts, an open backlog.", "Прозрачность: дать видимость тем, кто отвечает за результат проекта, — доски, графики сгорания, открытый бэклог."),
    qx("A retrospective shows that code reviews wait three days, so the team introduces a rule to review within 24 hours. Introducing the new rule is an example of which pillar?", "Adaptation", [
      ["Transparency", "Transparency made the delay visible, but changing the rule is a different step.", "Прозрачность сделала задержку видимой, но изменить правило — другой шаг."],
      ["Inspection", "The retrospective itself is the inspection; the new rule that follows is adaptation.", "Сама ретроспектива — это инспекция; новое правило после неё — адаптация."],
      ["Courage", "Courage is an XP value, not one of Scrum's three pillars.", "Courage — ценность XP, а не один из трёх столпов Scrum."],
    ], "Adaptation: adjust a process to minimize further issues if inspection shows a problem.", "Адаптация: скорректировать процесс, чтобы свести к минимуму дальнейшие проблемы, если инспекция выявила проблему."),
    qx("Midway through a sprint, a sales director asks the team to drop the sprint goal and build a demo for a new client. According to the lecture's sprint rules, what should happen?", "The goal is protected; the request goes to the product backlog", [
      ["The team switches at once, because the director outranks it", "Rank does not override the sprint rule: no changes are made that would affect the sprint goal.", "Должность не отменяет правила спринта: никаких изменений, которые повлияли бы на цель спринта."],
      ["The ScrumMaster extends the sprint so both pieces of work fit", "Sprints are timeboxed; stretching the box to fit more work breaks the timebox.", "У спринта есть таймбокс; растягивать его ради лишней работы — нарушать таймбокс."],
      ["The developers split up and do both pieces of work in parallel", "Splitting the team still endangers the sprint goal and adds task switching.", "Разделение команды всё равно ставит под угрозу цель спринта и добавляет переключение между задачами."],
    ], "Slide: during the sprint, no changes are made that would affect the sprint goal. New work is ordered in the product backlog by the product owner for a later sprint.", "Слайд: во время спринта не вносят изменений, которые повлияли бы на цель спринта. Новую работу product owner ставит в бэклог продукта на следующий спринт."),
    qx("Which Scrum role manages the product backlog with the goal of maximizing the product value?", "Product owner", [
      ["ScrumMaster", "The ScrumMaster is a servant leader for the process, not the owner of the backlog.", "ScrumMaster — лидер-слуга для процесса, а не владелец бэклога."],
      ["Development team", "The development team builds the increments; it does not own the product backlog.", "Команда разработки создаёт инкременты; бэклог продукта ей не принадлежит."],
      ["Project sponsor", "A sponsor funds the project but is not a Scrum role.", "Спонсор финансирует проект, но это не роль Scrum."],
    ], "Product owner: manages the product backlog (list of work to be done) with the goal of maximizing the product value.", "Product owner: управляет бэклогом продукта (списком работы) с целью максимизировать ценность продукта."),
    qx("How does the lecture describe the ScrumMaster?", "A servant leader ensuring Scrum is understood and used well", [
      ["A manager who assigns tasks and tracks each developer's output", "Assigning tasks contradicts the self-organizing development team; the ScrumMaster serves, not directs.", "Раздавать задачи — противоречит самоорганизации команды; ScrumMaster служит, а не командует."],
      ["A business representative who orders the product backlog", "That is the product owner.", "Это product owner."],
      ["A senior developer who designs the architecture for the team", "Architecture emerges from the self-organizing team; it is not the ScrumMaster's job.", "Архитектура рождается в самоорганизующейся команде; это не работа ScrumMaster."],
    ], "ScrumMaster: servant leader who ensures that the Scrum methodology is understood and used effectively.", "ScrumMaster: лидер-слуга, который следит, чтобы методологию Scrum понимали и применяли эффективно."),
    qx("Which statement about the daily scrum matches the lecture?", "A 15-minute timeboxed meeting of the development team", [
      ["A 30-minute status report given to the product owner", "Wrong length and wrong purpose: it is 15 minutes and assesses progress toward the sprint goal.", "Не та длина и не та цель: 15 минут, оценка продвижения к цели спринта."],
      ["A 15-minute meeting where the ScrumMaster assigns tasks", "The length is right, but the ScrumMaster does not assign tasks; it is the development team's meeting.", "Длина верна, но ScrumMaster не раздаёт задачи; это встреча команды разработки."],
      ["A weekly one-hour meeting to inspect the product increment", "Inspecting the increment is the sprint review at the end of the sprint.", "Проверка инкремента — это sprint review в конце спринта."],
    ], "Daily scrum: daily 15-minute timeboxed meeting of the development team; assess progress toward the sprint goal.", "Daily scrum: ежедневная 15-минутная встреча команды разработки с таймбоксом; оценить продвижение к цели спринта."),
    qx("At the end of the sprint, the team and stakeholders inspect the increment and update the backlog. Which event is this?", "Sprint review", [
      ["Sprint retrospective", "The retrospective is about the team's processes and improvements, not the increment.", "Ретроспектива — о процессах команды и улучшениях, а не об инкременте."],
      ["Sprint planning meeting", "Planning happens at the start: what will be delivered and how.", "Планирование — в начале: что будет поставлено и как."],
      ["Backlog refinement", "Refinement discusses and updates backlog items during the sprint, without inspecting the finished increment.", "Уточнение обсуждает и обновляет элементы бэклога во время спринта, не проверяя готовый инкремент."],
    ], "Sprint review: meeting at the end of the sprint; inspect the increment or product and update the backlog.", "Sprint review: встреча в конце спринта; проверить инкремент или продукт и обновить бэклог."),
    qx("Which Scrum artifact serves as the single source of requirements?", "Product backlog", [
      ["Sprint backlog", "The sprint backlog is only the subset selected for one sprint.", "Бэклог спринта — лишь подмножество, выбранное на один спринт."],
      ["Product increment", "The increment is the built solution, not the list of requirements.", "Инкремент — созданное решение, а не список требований."],
      ["Release plan", "A release plan is an XP planning output, not a Scrum artifact.", "План релиза — результат планирования в XP, а не артефакт Scrum."],
    ], "Product backlog: dynamic and evolving prioritized list of all the work to be done that serves as the single source of requirements.", "Бэклог продукта: динамичный, развивающийся приоритизированный список всей работы — единственный источник требований."),
    qx("What is the sprint backlog, according to the lecture?", "A subset of product backlog items selected as a sprint's goal", [
      ["The complete prioritized list of all the work in the project", "That is the product backlog.", "Это бэклог продукта."],
      ["The increment of the solution demonstrated at the sprint review", "That is the product increment.", "Это инкремент продукта."],
      ["A list of improvements agreed at the sprint retrospective", "Retrospective improvements are not the slide's definition of the sprint backlog.", "Улучшения с ретроспективы — не определение бэклога спринта со слайда."],
    ], "Sprint backlog: subset of items from the product backlog that have been selected as the goal of a sprint.", "Бэклог спринта: подмножество элементов бэклога продукта, выбранных как цель спринта."),
    qx("Which of the following is NOT one of XP's five core values?", "Transparency", [
      ["Courage", "Courage is an XP value: allow work to be entirely visible.", "Смелость — ценность XP: сделать работу полностью видимой."],
      ["Feedback", "Feedback is an XP value: get impressions of suitability early.", "Обратная связь — ценность XP: рано узнавать о пригодности."],
      ["Respect", "Respect is an XP value: everyone is accountable for success or failure.", "Уважение — ценность XP: каждый отвечает за успех или провал."],
    ], "XP values: simplicity, communication, feedback, courage, respect. Transparency is a Scrum pillar.", "Ценности XP: simplicity, communication, feedback, courage, respect. Transparency — столп Scrum."),
    qx("In XP, the core value of courage means…", "Having the courage to allow work to be entirely visible", [
      ["Taking on the riskiest features first to impress the customer", "Not on the slide; XP courage is about visibility of work, not risky heroics.", "На слайде этого нет; смелость в XP — о видимости работы, а не о рискованном геройстве."],
      ["Overriding the customer's priorities when the team knows better", "In XP the customer provides requirements and priorities; overriding them is not courage.", "В XP требования и приоритеты даёт заказчик; отменять их — не смелость."],
      ["Working overtime whenever the release date is in danger", "Overtime contradicts XP's sustainable pace practice.", "Переработки противоречат практике устойчивого темпа XP."],
    ], "XP courage: have courage to allow work to be entirely visible — including unfinished work and problems.", "Смелость в XP: иметь смелость сделать работу полностью видимой — включая незаконченное и проблемы."),
    qx("Which XP role provides quality assurance and helps the customer define and write acceptance tests?", "Testers", [
      ["Coach", "The coach is a mentor and facilitator who reinforces communication.", "Коуч — наставник и фасилитатор, укрепляющий общение."],
      ["Programmers", "Programmers write code for the requested user stories.", "Программисты пишут код для запрошенных пользовательских историй."],
      ["Customer", "The customer defines the tests with the testers' help; the testers provide QA.", "Заказчик определяет тесты с помощью тестировщиков; контроль качества обеспечивают тестировщики."],
    ], "XP testers: provide quality assurance and help the customer define and write acceptance tests.", "Тестировщики в XP: обеспечивают контроль качества и помогают заказчику определить и написать приёмочные тесты."),
    qx("In XP, who is the mentor and facilitator who keeps the team effective by reinforcing communication with and across teams?", "Coach", [
      ["Customer", "The customer is the business representative who provides requirements and priorities.", "Заказчик — представитель бизнеса, который даёт требования и приоритеты."],
      ["Tester", "Testers provide quality assurance and help write acceptance tests.", "Тестировщики обеспечивают контроль качества и помогают писать приёмочные тесты."],
      ["Project manager", "XP's four roles are coach, customer, programmers and testers; there is no project manager role.", "Четыре роли XP — коуч, заказчик, программисты и тестировщики; роли руководителя проекта нет."],
    ], "XP coach: mentor and facilitator who helps the team stay effective and on track by reinforcing communication with and across teams (close to a ScrumMaster).", "Коуч в XP: наставник и фасилитатор, который помогает команде оставаться эффективной и на верном пути, укрепляя общение (близок к ScrumMaster)."),
    qx("A developer pair improves a module written by another pair without asking for permission. Which XP practice makes this normal?", "Collective code ownership", [
      ["Individual class ownership", "Individual class (code) ownership is an FDD practice — the opposite idea.", "Индивидуальное владение классами — практика FDD, противоположная идея."],
      ["Pair programming", "They do work in a pair, but pairing does not grant the right to change any code.", "Они работают в паре, но парность не даёт права менять любой код."],
      ["Code standards", "Standards make shared code readable, but the right to change any code is collective ownership.", "Стандарты делают общий код читаемым, но право менять любой код — это коллективное владение."],
    ], "Collective code ownership: any pair of developers can improve or amend any code.", "Коллективное владение кодом: любая пара разработчиков может улучшить или изменить любой код."),
    qx("Which XP practice is described as \"improve design of existing code without altering external behavior or adding new functionality\"?", "Refactoring", [
      ["Simple design", "Simple design is a simple but adequate design that lets the team develop quickly.", "Простой дизайн — простой, но достаточный дизайн, позволяющий быстро разрабатывать."],
      ["Continuous integration", "Continuous integration makes sure code compiles and works together.", "Непрерывная интеграция следит, чтобы код компилировался и работал вместе."],
      ["Test-driven development", "TDD means writing the tests before developing the code.", "TDD — писать тесты до кода."],
    ], "Refactoring improves the internal design of existing code without altering its external behavior or adding new functionality.", "Рефакторинг улучшает внутренний дизайн существующего кода, не меняя внешнего поведения и не добавляя функциональности."),
    qx("A team explains its message-queue design to the business as \"a post office that sorts letters\". Which XP practice is this?", "Metaphor", [
      ["Simple design", "Simple design is about keeping the design adequate and minimal, not about explaining it.", "Простой дизайн — о том, чтобы дизайн был достаточным и минимальным, а не о его объяснении."],
      ["Customer tests", "Customer tests are tests the customer describes to show the software works.", "Тесты заказчика — тесты, которые описывает заказчик, чтобы показать, что софт работает."],
      ["Whole team", "Whole team means sitting together as one team, not using comparisons.", "Whole team — сидеть вместе одной командой, а не пользоваться сравнениями."],
    ], "Metaphor: use metaphors and similes to explain designs and create a shared vision that all stakeholders can understand.", "Метафора: использовать метафоры и сравнения, чтобы объяснять дизайн и создавать общее видение, понятное всем стейкхолдерам."),
    tfx("In XP, an iteration is a short development cycle within a release, and in Scrum these iterations are called sprints.", true,
      "This is the slide's definition of iteration planning, and it matches the sprint slide: Scrum \"sprint\" = generic agile \"iteration\".",
      "Это определение iteration planning со слайда, и оно совпадает со слайдом про спринты: Scrum-«спринт» = общий agile-термин «итерация».",
      "\"False\" would separate two names for the same thing; a release contains several iterations (sprints), not the other way round.",
      "«Неверно» разделило бы два названия одного и того же; релиз состоит из нескольких итераций (спринтов), а не наоборот."),
    tfx("In test-driven development, the team writes the code first and then adds tests to confirm that it works.", false,
      "TDD reverses this order: the team writes the tests before developing the code, then writes just enough code to pass them.",
      "TDD переворачивает порядок: команда пишет тесты до кода, а потом ровно столько кода, чтобы они прошли.",
      "\"True\" describes ordinary test-after development, not TDD.",
      "«Верно» описывает обычное тестирование после разработки, а не TDD."),
  ],
);

const p4 = part(
  "pm-l6-p4",
  { en: "Lean, Kanban, FDD, DSDM and Crystal", ru: "Lean, Kanban, FDD, DSDM и Crystal" },
  {
    en: `## Lean software development
- **Derived from lean manufacturing approaches** (the Toyota Production System).
- **Closely aligned with agile, but not an agile methodology.** Lean is a broader way of thinking about value and waste; agile methods share many of its ideas.
- **Core concepts include:** using visual management tools; identifying customer-defined value; building in learning and continuous improvement.
> Exam trap: "lean is an agile methodology" is false according to the slide — it is *closely aligned with* agile. Kanban, on the other hand, is derived from lean and is listed as an agile approach.
## The seven lean core concepts
| Concept | Slide definition | IT example |
|---|---|---|
| Eliminate waste | in order to maximize value, remove delays, unnecessary features, partially done work, etc. | delete the half-finished "reports v2" branch nobody works on; stop the weekly status report nobody reads |
| Empower the team | respect team members' knowledge of the technical steps required and let them make decisions | developers choose the database for a new service instead of waiting for a manager's approval |
| Deliver fast | maximize the project ROI by quickly producing valuable deliverables | release the payment feature now instead of bundling it with five other features next quarter |
| Optimize the whole | see the system as more than the sum of its parts and how it aligns with the organization | making developers faster is useless if releases then wait two weeks for the operations team — fix the whole flow |
| Build quality in | continually assure quality throughout the development process | automated tests and code review on every commit, not one big test phase at the end |
| Defer decisions | balance early planning with making decisions and commitments as late as possible | do not choose a cloud provider in week 1 if the load profile will be known in week 6 |
| Amplify learning | facilitate communications early and often, getting frequent feedback | short iterations, demos and user tests every two weeks |
> Memory hook: **Eliminate, Empower, Deliver, Optimize, Build, Defer, Amplify** — "**E**very **E**ngineer **D**elivers **O**nly **B**etter **D**esigns **A**lways".
> Exam trap: **defer decisions** does not mean "never plan" or "avoid decisions". It means balancing early planning with committing **as late as possible** — at the last responsible moment, when more is known.
## The 7 wastes of lean
The slide's table (waste — description — example):
| Waste | Description | Example |
|---|---|---|
| Partially done work | work started, but not complete; partially done work can entropy | code waiting for testing; specs waiting for development |
| Extra processes | extra work that does not add value | unused documentation; unnecessary approvals |
| Extra features | features that are not required, or are thought of as "nice-to-haves" | gold-plating; technology features |
| Task switching | multitasking between several different projects when there are context-switching penalties | people assigned to multiple projects |
| Waiting (from Griffiths; missing on the slide) | delays while waiting for decisions, reviews, approvals or other people | waiting for a test environment; waiting for a sign-off |
| Motion | effort required to communicate or move information or deliverables from one group to another; if teams are not co-located, effort may be greater | distributed teams; handoffs |
| Defects | defective documents or software that needs correction | requirements defects; software bugs |
> Exam trap: the slide is titled "The 7 Wastes of Lean", but its table shows only **six** rows. The seventh waste in Griffiths (and in Poppendieck's lean software development) is **waiting** — delays. If a question lists "waiting" as a waste, it is correct.
- **"Partially done work can entropy"** means unfinished work decays: the code branch drifts away from main, the spec gets outdated, people forget the details. That is why lean and Kanban push to *finish* work before starting new work.
- **Gold-plating** = adding extras the customer did not ask for "to make it nicer". It is the waste of extra features and the opposite of the Manifesto's simplicity principle.
**Sorting IT situations into wastes:**
- A pull request has waited 5 days for QA → **partially done work** (and waiting).
- Every deployment needs three signatures from managers who never read the change → **extra processes**.
- A developer adds animated 3D charts that nobody requested → **extra features** (gold-plating).
- An analyst works on four projects and spends the first hour after each switch "getting back into it" → **task switching**.
- The design is handed from the Almaty team to the Astana team to offshore testers → **motion** (handoffs, distributed teams).
- A misunderstood requirement means the export must be rebuilt → **defects** (a requirements defect).
## Kanban
- **Derived from Toyota's lean production system.**
- **"Kanban" is a Japanese word meaning "signboard".**
- **Focuses on limiting work in progress (WIP)** **to identify issues and minimize waste.**
- **Kanban/task board** (figure): three columns — **To Do** (Amend order, Item details, Archive order, Order refund), **In Progress** (Create order, Stock search, Stock update, Process order), **Done** (DB schema, Login). Each card is a piece of work that moves from left to right.
- **Pull, not push:** a person takes (pulls) a new card only when there is free capacity under the WIP limit. The slide's board shows no limit, but if the team set an "In Progress" limit of 3, its 4 cards in that column would already be over it — the team would have to finish something before starting anything new.
= WIP limit "In Progress" = 3 -> cards in column = 4 -> over limit: finish before starting new work
## 5 principles of Kanban
| # | Principle | Slide definition |
|---|---|---|
| 1 | Visualize the workflow | visualize the workflow to help organize, optimize, and track it |
| 2 | Limit WIP | restrict the amount of work in progress to improve productivity and increase visibility of bottlenecks |
| 3 | Manage flow | track the flow of work through a system to identify issues and measure effectiveness of changes |
| 4 | Make process policies explicit | clearly explain how things work so the team can have open discussions |
| 5 | Improve collaboratively | collectively own and improve processes through scientific measurement and experimentation |
> Memory hook: **"See it, limit it, flow it, write it, improve it."**
> Exam trap: Kanban does **not** require sprints or fixed roles; work flows continuously. Its signature mechanism is the **WIP limit**, and a column that collects too many cards points to a **bottleneck**.
## Feature-Driven Development (FDD)
FDD **recommends a set of good practices**, including:
| Practice | What it means |
|---|---|
| Domain object modeling | build a model of the business domain (customers, orders, products and their relations) before the features |
| Developing by feature | work is planned and tracked in small, client-valued features ("calculate the total of an order") |
| Individual class (code) ownership | each class has one owner who is responsible for it |
| Feature teams | small temporary teams form around a feature, gathering the owners of the classes it touches |
| Inspections | design and code inspections (reviews) catch defects early |
| Configuration management | track versions of code and documents |
| Regular builds | integrate and build the system regularly |
| Visibility of progress and results | progress per feature is reported openly |
**FDD process (figure):** Develop an overall model → Build a feature list → Plan by feature → Design by feature → Build by feature. The last two steps repeat for every feature (the stacked boxes on the slide).
= FDD: overall model -> feature list -> plan by feature -> (design by feature -> build by feature) x N
> Exam trap: **individual class (code) ownership** is FDD; **collective code ownership** is XP. They are opposite answers to the question "who may change this code?".
## Dynamic Systems Development Method (DSDM)
DSDM is **centered on 8 principles**:
| # | Principle | Meaning in practice |
|---|---|---|
| 1 | Focus on the business need | every decision is judged by the business goal of the project |
| 2 | Deliver on time | the deadline is fixed (timeboxes); scope is prioritized to fit it |
| 3 | Collaborate | business and developers work together as one team |
| 4 | Never compromise quality | the quality level is agreed at the start and is not traded away |
| 5 | Build incrementally from firm foundations | understand the basics first, then deliver in increments |
| 6 | Develop iteratively | use iterations and feedback to converge on the right solution |
| 7 | Communicate continuously and clearly | stand-ups, workshops, models and prototypes |
| 8 | Demonstrate control | make plans and progress visible; manage proactively |
**DSDM method (figure):** Pre-project → Feasibility and Business study → Functional model iteration → Design & build iteration → Implementation → Post-project, with arrows looping back between the iterations.
- Beyond the slide: the **MoSCoW** prioritization technique (Must have, Should have, Could have, Won't have this time) is closely associated with DSDM — it is how DSDM keeps "deliver on time" while scope flexes.
> Exam trap: DSDM keeps time and quality fixed and lets scope vary — the same idea as the agile triangle. "Never compromise quality" and "deliver on time" are both DSDM principles.
## Crystal
- Crystal is a **family of situationally specific, customized methodologies designed for different types of projects**.
- It **uses factors of criticality and team size to classify projects**.
| Criticality (loss a defect can cause) | Crystal Clear 1–6 | Crystal Yellow 7–20 | Crystal Orange 21–40 | Crystal Red 41–100 | Crystal Magenta 101–200 |
|---|---|---|---|---|---|
| Life (L) | — | — | — | — | L200 |
| Essential money (E) | — | E20 | E40 | E100 | E200 |
| Discretionary money (D) | D6 | D20 | D40 | D100 | D200 |
| Comfort (C) | C6 | C20 | C40 | C100 | C200 |
- **How to read a code:** the letter is the criticality, the number is the maximum team size. **D40** = a defect may cost discretionary money, up to 40 people → **Crystal Orange**. (The slide labels the rows simply Life, Essential, Discretionary, Comfort.)
- The darker the colour, the bigger the team and the more coordination and ceremony the method needs. Crystal Clear (up to 6 people) is the lightest.
- IT examples: a 5-person team building an internal hobby-club app → C6 (Crystal Clear); a 15-person team building an e-commerce checkout where bugs lose sales → E20 (Crystal Yellow); medical device software where a defect can endanger life → L-level criticality, which on the slide's chart appears only for Crystal Magenta (L200).
> Exam trap: Crystal is chosen by **two** factors — **criticality and team size** — not by budget or duration. The colours go Clear → Yellow → Orange → Red → Magenta as the team grows.
?? A team keeps 9 cards "In Progress" while its WIP limit is 4. Which Kanban principle is broken, and what is the likely effect?
?= Limit WIP. Too much work in progress lowers productivity and hides bottlenecks; the team should finish cards before pulling new ones.
?? A 30-person team builds billing software where defects cost the company real money. Which Crystal method fits?
?= Crystal Orange (21–40 people), essential-money criticality — cell E40.
?? Which method recommends individual class ownership, and which recommends collective code ownership?
?= FDD recommends individual class (code) ownership; XP recommends collective code ownership.
## Exam focus
- Lean: derived from lean manufacturing; **closely aligned with agile, but not an agile methodology**; core concepts: visual management tools, customer-defined value, learning and continuous improvement.
- Seven lean concepts: eliminate waste, empower the team, deliver fast, optimize the whole, build quality in, defer decisions, amplify learning.
- Wastes with the slide's examples: partially done work (code waiting for testing), extra processes (unused documentation, unnecessary approvals), extra features (gold-plating), task switching (people on multiple projects), waiting, motion (distributed teams, handoffs), defects (requirements defects, bugs).
- Kanban: Toyota; "signboard"; limiting WIP; five principles — visualize the workflow, limit WIP, manage flow, make process policies explicit, improve collaboratively.
- FDD: domain object modeling, developing by feature, individual class ownership, feature teams, inspections, configuration management, regular builds, visibility; process: overall model → feature list → plan → design → build by feature.
- DSDM: eight principles — business need, on time, collaborate, never compromise quality, incrementally from firm foundations, iteratively, communicate continuously and clearly, demonstrate control.
- Crystal: a family chosen by **criticality and team size**; Clear 1–6, Yellow 7–20, Orange 21–40, Red 41–100, Magenta 101–200.`,
    ru: `## Бережливая разработка ПО (lean software development)
- **Выросла из подходов бережливого производства (lean manufacturing)** — производственной системы Toyota.
- **Тесно связана с agile, но не является agile-методологией (closely aligned with agile, but not an agile methodology).** Lean — более широкий взгляд на ценность и потери; agile-методы разделяют многие его идеи.
- **Ключевые идеи (core concepts):** инструменты визуального управления (visual management tools); ценность, определяемая заказчиком (customer-defined value); встроенное обучение и непрерывное улучшение (learning and continuous improvement).
> Ловушка экзамена: «lean — agile-методология» по слайду неверно — он *тесно связан* с agile. А вот Kanban вырос из lean и стоит в списке agile-подходов.
## Семь ключевых идей lean (lean core concepts)
| Идея | Определение слайда | Пример из IT |
|---|---|---|
| Eliminate waste — устранять потери | чтобы максимизировать ценность, убирать задержки, ненужные функции, частично сделанную работу и т. п. | удалить заброшенную ветку «отчёты v2», над которой никто не работает; отменить еженедельный отчёт, который никто не читает |
| Empower the team — наделять команду полномочиями | уважать знание членами команды нужных технических шагов и позволять им принимать решения | разработчики сами выбирают базу данных для нового сервиса, а не ждут одобрения менеджера |
| Deliver fast — поставлять быстро | максимизировать ROI проекта, быстро выпуская ценные результаты | выпустить функцию оплаты сейчас, а не в пакете с пятью другими функциями в следующем квартале |
| Optimize the whole — оптимизировать целое | видеть систему как нечто большее, чем сумма её частей, и то, как она согласуется с организацией | ускорять разработчиков бессмысленно, если потом релизы две недели ждут команду эксплуатации, — чинить весь поток |
| Build quality in — встраивать качество | непрерывно обеспечивать качество на протяжении всего процесса разработки | автотесты и код-ревью на каждый коммит, а не одна большая фаза тестирования в конце |
| Defer decisions — откладывать решения | балансировать раннее планирование с принятием решений и обязательств как можно позже | не выбирать облачного провайдера на 1-й неделе, если профиль нагрузки станет известен на 6-й |
| Amplify learning — усиливать обучение | общаться рано и часто, получая частую обратную связь | короткие итерации, демо и пользовательские тесты каждые две недели |
> Зацепка: **Eliminate, Empower, Deliver, Optimize, Build, Defer, Amplify** — «**E**very **E**ngineer **D**elivers **O**nly **B**etter **D**esigns **A**lways».
> Ловушка экзамена: **defer decisions** не значит «никогда не планировать» или «избегать решений». Это баланс раннего планирования с обязательствами **как можно позже** — в последний ответственный момент, когда известно больше.
## 7 видов потерь lean (the 7 wastes of lean)
Таблица слайда (потеря — описание — пример):
| Потеря | Описание | Пример |
|---|---|---|
| Partially done work — частично сделанная работа | работа начата, но не закончена; частично сделанная работа «энтропирует» (разрушается) | код ждёт тестирования; спецификации ждут разработки |
| Extra processes — лишние процессы | дополнительная работа, не добавляющая ценности | неиспользуемая документация; ненужные согласования |
| Extra features — лишние функции | функции, которые не требуются или считаются «приятным дополнением» (nice-to-haves) | «золочение» (gold-plating); технологические «фишки» |
| Task switching — переключение задач | многозадачность между несколькими проектами, когда за переключение контекста приходится платить | люди назначены на несколько проектов |
| Waiting — ожидание (из Griffiths; на слайде нет) | задержки в ожидании решений, ревью, согласований или других людей | ждать тестовое окружение; ждать подписи |
| Motion — перемещение | усилия на то, чтобы передать информацию или результаты от одной группы другой; если команды не сидят вместе, усилия больше | распределённые команды; передачи работы (handoffs) |
| Defects — дефекты | дефектные документы или софт, которые нужно исправлять | дефекты требований; баги в софте |
> Ловушка экзамена: слайд называется «The 7 Wastes of Lean», но в таблице только **шесть** строк. Седьмая потеря у Griffiths (и у Поппендиков в lean software development) — **ожидание (waiting)**, задержки. Если в вопросе «waiting» названо потерей — это верно.
- **«Partially done work can entropy»** — незаконченная работа портится: ветка кода уходит от основной, спецификация устаревает, люди забывают детали. Поэтому lean и Kanban требуют *доделывать* работу, прежде чем начинать новую.
- **«Золочение» (gold-plating)** — добавлять то, о чём заказчик не просил, «чтобы было красивее». Это потеря «лишние функции» и противоположность принципу простоты из Манифеста.
**Раскладываем ситуации из IT по видам потерь:**
- Pull request 5 дней ждёт QA → **частично сделанная работа** (и ожидание).
- Каждый деплой требует трёх подписей менеджеров, которые не читают изменения → **лишние процессы**.
- Разработчик добавляет анимированные 3D-графики, которые никто не просил → **лишние функции** (gold-plating).
- Аналитик работает на четырёх проектах и после каждого переключения первый час «входит в контекст» → **переключение задач**.
- Дизайн передают из алматинской команды в астанинскую, а оттуда — тестировщикам за рубежом → **перемещение** (передачи работы, распределённые команды).
- Неверно понятое требование — и экспорт приходится переделывать → **дефекты** (дефект требований).
## Kanban
- **Вырос из бережливой производственной системы Toyota (Toyota's lean production system).**
- **«Kanban» — японское слово, означающее «вывеска» (signboard).**
- **Сосредоточен на ограничении незавершённой работы (limiting work in progress, WIP)**, **чтобы выявлять проблемы и сокращать потери.**
- **Kanban-доска / доска задач (Kanban/task board)** (рисунок): три колонки — **To Do** (Amend order, Item details, Archive order, Order refund), **In Progress** (Create order, Stock search, Stock update, Process order), **Done** (DB schema, Login). Каждая карточка — кусок работы, который движется слева направо.
- **Вытягивание, а не выталкивание (pull, not push):** человек берёт (вытягивает) новую карточку, только когда есть свободная ёмкость в пределах WIP-лимита. На доске слайда лимит не указан, но если команда задала лимит 3 для «In Progress», её 4 карточки в этой колонке уже превышали бы его — пришлось бы что-то доделать, прежде чем начинать новое.
= WIP limit "In Progress" = 3 -> cards in column = 4 -> over limit: finish before starting new work
## 5 принципов Kanban
| # | Принцип | Определение слайда |
|---|---|---|
| 1 | Visualize the workflow — визуализировать поток работы | визуализировать поток работы, чтобы организовать, оптимизировать и отслеживать его |
| 2 | Limit WIP — ограничивать незавершённую работу | ограничивать объём незавершённой работы, чтобы повысить производительность и сделать узкие места (bottlenecks) заметнее |
| 3 | Manage flow — управлять потоком | отслеживать движение работы через систему, чтобы находить проблемы и измерять эффект изменений |
| 4 | Make process policies explicit — сделать правила процесса явными | ясно объяснить, как всё устроено, чтобы команда могла открыто обсуждать |
| 5 | Improve collaboratively — улучшать сообща | коллективно владеть процессами и улучшать их через научное измерение и эксперименты |
> Зацепка: **«увидеть, ограничить, пустить потоком, записать, улучшить»**.
> Ловушка экзамена: Kanban **не** требует спринтов или фиксированных ролей; работа идёт непрерывным потоком. Его фирменный механизм — **WIP-лимит**, а колонка, где копится слишком много карточек, указывает на **узкое место**.
## Разработка, управляемая функциями (Feature-Driven Development, FDD)
FDD **рекомендует набор хороших практик**, среди них:
| Практика | Что значит |
|---|---|
| Domain object modeling — моделирование объектов предметной области | построить модель бизнес-области (клиенты, заказы, товары и их связи) до функций |
| Developing by feature — разработка по функциям | работу планируют и отслеживают мелкими функциями, ценными для клиента («посчитать сумму заказа») |
| Individual class (code) ownership — индивидуальное владение классами (кодом) | у каждого класса есть один владелец, который за него отвечает |
| Feature teams — команды функций | вокруг функции собирается небольшая временная команда из владельцев затрагиваемых классов |
| Inspections — инспекции | инспекции (ревью) дизайна и кода рано находят дефекты |
| Configuration management — управление конфигурацией | отслеживать версии кода и документов |
| Regular builds — регулярные сборки | регулярно интегрировать и собирать систему |
| Visibility of progress and results — видимость прогресса и результатов | прогресс по каждой функции открыто показывают |
**Процесс FDD (рисунок):** разработать общую модель (Develop an overall model) → составить список функций (Build a feature list) → планировать по функциям (Plan by feature) → проектировать по функциям (Design by feature) → строить по функциям (Build by feature). Два последних шага повторяются для каждой функции (стопка прямоугольников на слайде).
= FDD: overall model -> feature list -> plan by feature -> (design by feature -> build by feature) x N
> Ловушка экзамена: **индивидуальное владение классами (кодом)** — это FDD; **коллективное владение кодом** — XP. Это противоположные ответы на вопрос «кто может менять этот код?».
## Метод разработки динамических систем (Dynamic Systems Development Method, DSDM)
DSDM **строится вокруг 8 принципов**:
| # | Принцип | Что значит на практике |
|---|---|---|
| 1 | Focus on the business need — фокус на бизнес-потребности | каждое решение оценивают по бизнес-цели проекта |
| 2 | Deliver on time — поставлять в срок | срок фиксирован (таймбоксы); объём приоритизируют, чтобы уложиться |
| 3 | Collaborate — сотрудничать | бизнес и разработчики работают вместе как одна команда |
| 4 | Never compromise quality — никогда не жертвовать качеством | уровень качества согласуют в начале и не размениваются им |
| 5 | Build incrementally from firm foundations — строить инкрементно на прочном фундаменте | сначала разобраться в основах, потом поставлять инкрементами |
| 6 | Develop iteratively — разрабатывать итеративно | итерации и обратная связь приводят к правильному решению |
| 7 | Communicate continuously and clearly — общаться постоянно и ясно | стендапы, воркшопы, модели и прототипы |
| 8 | Demonstrate control — демонстрировать контроль | делать планы и прогресс видимыми; управлять проактивно |
**Метод DSDM (рисунок):** до проекта (Pre-project) → технико-экономическое и бизнес-обоснование (Feasibility, Business) → итерация функциональной модели (Functional model iteration) → итерация проектирования и разработки (Design & build iteration) → внедрение (Implementation) → после проекта (Post-project); стрелки возвращают назад между итерациями.
- Сверх слайда: приоритизация **MoSCoW** (Must have, Should have, Could have, Won't have this time) тесно связана с DSDM — так DSDM сохраняет «поставку в срок», позволяя объёму меняться.
> Ловушка экзамена: DSDM фиксирует сроки и качество и позволяет меняться объёму — та же идея, что в agile-треугольнике. «Never compromise quality» и «deliver on time» — оба принципы DSDM.
## Crystal
- Crystal — **семейство методологий, подобранных под ситуацию и настроенных для разных типов проектов (family of situationally specific, customized methodologies)**.
- Оно **классифицирует проекты по двум факторам: критичность (criticality) и размер команды (team size)**.
| Критичность (какой ущерб может нанести дефект) | Crystal Clear 1–6 | Crystal Yellow 7–20 | Crystal Orange 21–40 | Crystal Red 41–100 | Crystal Magenta 101–200 |
|---|---|---|---|---|---|
| Life (L) — жизнь | — | — | — | — | L200 |
| Essential money (E) — существенные деньги | — | E20 | E40 | E100 | E200 |
| Discretionary money (D) — необязательные деньги | D6 | D20 | D40 | D100 | D200 |
| Comfort (C) — комфорт | C6 | C20 | C40 | C100 | C200 |
- **Как читать код:** буква — критичность, число — максимальный размер команды. **D40** — дефект может стоить «необязательных» денег, до 40 человек → **Crystal Orange**. (На слайде строки подписаны просто Life, Essential, Discretionary, Comfort.)
- Чем темнее цвет, тем больше команда и тем больше координации и формальностей нужно методу. Crystal Clear (до 6 человек) — самый лёгкий.
- Примеры из IT: команда из 5 человек делает внутреннее приложение для клуба по интересам → C6 (Crystal Clear); команда из 15 человек делает оформление заказа в интернет-магазине, где баги теряют продажи → E20 (Crystal Yellow); софт для медицинского прибора, где дефект угрожает жизни → критичность уровня L, которая на схеме слайда есть только у Crystal Magenta (L200).
> Ловушка экзамена: Crystal выбирают по **двум** факторам — **критичность и размер команды**, а не по бюджету или длительности. Цвета идут Clear → Yellow → Orange → Red → Magenta по мере роста команды.
?? У команды 9 карточек в «In Progress» при WIP-лимите 4. Какой принцип Kanban нарушен и к чему это ведёт?
?= Limit WIP. Слишком много незавершённой работы снижает производительность и прячет узкие места; команде нужно доделывать карточки, прежде чем брать новые.
?? Команда из 30 человек делает биллинговую систему, где дефекты стоят компании реальных денег. Какой метод Crystal подходит?
?= Crystal Orange (21–40 человек), критичность «существенные деньги» — клетка E40.
?? Какой метод рекомендует индивидуальное владение классами, а какой — коллективное владение кодом?
?= FDD рекомендует индивидуальное владение классами (кодом); XP — коллективное владение кодом.
## На что обратить внимание на экзамене (Exam focus)
- Lean: из бережливого производства; **тесно связан с agile, но не agile-методология**; ключевые идеи: визуальное управление, ценность глазами заказчика, обучение и непрерывное улучшение.
- Семь идей lean: eliminate waste, empower the team, deliver fast, optimize the whole, build quality in, defer decisions, amplify learning.
- Потери с примерами слайда: частично сделанная работа (код ждёт тестирования), лишние процессы (неиспользуемая документация, ненужные согласования), лишние функции (gold-plating), переключение задач (люди на нескольких проектах), ожидание, перемещение (распределённые команды, передачи работы), дефекты (дефекты требований, баги).
- Kanban: Toyota; «вывеска» (signboard); ограничение WIP; пять принципов — visualize the workflow, limit WIP, manage flow, make process policies explicit, improve collaboratively.
- FDD: domain object modeling, developing by feature, individual class ownership, feature teams, inspections, configuration management, regular builds, visibility; процесс: общая модель → список функций → план → дизайн → разработка по функциям.
- DSDM: восемь принципов — бизнес-потребность, в срок, сотрудничать, никогда не жертвовать качеством, инкрементно на прочном фундаменте, итеративно, общаться постоянно и ясно, демонстрировать контроль.
- Crystal: семейство по **критичности и размеру команды**; Clear 1–6, Yellow 7–20, Orange 21–40, Red 41–100, Magenta 101–200.`,
  },
  [
    qx("How does the lecture classify lean software development?", "Closely aligned with agile, but not an agile methodology", [
      ["The original agile methodology from which Scrum was derived", "Lean comes from lean manufacturing (Toyota), not from Scrum's history, and the slide says it is not an agile methodology.", "Lean вырос из бережливого производства (Toyota), а не из истории Scrum, и слайд говорит, что это не agile-методология."],
      ["A Scrum extension for teams of more than 100 people", "Scaling frameworks exist, but lean is not one of them; it is a way of thinking about value and waste.", "Фреймворки масштабирования существуют, но lean не из их числа; это взгляд на ценность и потери."],
      ["A traditional, plan-driven method that conflicts with agile", "The slide says lean is closely aligned with agile, not in conflict with it.", "Слайд говорит, что lean тесно связан с agile, а не противоречит ему."],
    ], "Slide: lean software development is derived from lean manufacturing approaches and is closely aligned with agile, but not an agile methodology.", "Слайд: lean software development вырос из подходов бережливого производства и тесно связан с agile, но не является agile-методологией."),
    qx("Which of the following is NOT one of the seven lean core concepts in the lecture?", "Freeze scope early", [
      ["Defer decisions", "Defer decisions is a lean concept: commit as late as possible.", "Defer decisions — идея lean: брать обязательства как можно позже."],
      ["Amplify learning", "Amplify learning is a lean concept: communicate early and often, get frequent feedback.", "Amplify learning — идея lean: общаться рано и часто, получать частую обратную связь."],
      ["Optimize the whole", "Optimize the whole is a lean concept: see the system as more than the sum of its parts.", "Optimize the whole — идея lean: видеть систему как нечто большее, чем сумма частей."],
    ], "The seven concepts: eliminate waste, empower the team, deliver fast, optimize the whole, build quality in, defer decisions, amplify learning. Freezing scope early contradicts defer decisions.", "Семь идей: eliminate waste, empower the team, deliver fast, optimize the whole, build quality in, defer decisions, amplify learning. Заморозить объём заранее — противоречит defer decisions."),
    qx("What does the lean concept \"defer decisions\" mean?", "Balance early planning with committing as late as possible", [
      ["Avoid making decisions so that the team can stay flexible", "Lean does not avoid decisions; it times them for when more is known.", "Lean не избегает решений; он выбирает для них момент, когда известно больше."],
      ["Let the customer make all of the project's technical decisions", "Technical decisions belong to the empowered team, not to the customer.", "Технические решения принадлежат команде с полномочиями, а не заказчику."],
      ["Postpone all planning until development is almost finished", "The slide says balance early planning with late commitment, not skip planning.", "Слайд говорит о балансе раннего планирования и поздних обязательств, а не об отказе от планирования."],
    ], "Defer decisions: balance early planning with making decisions and commitments as late as possible (the last responsible moment).", "Defer decisions: балансировать раннее планирование с принятием решений и обязательств как можно позже (в последний ответственный момент)."),
    qx("\"See the system as more than the sum of its parts and how it aligns with the organization.\" Which lean concept is this?", "Optimize the whole", [
      ["Amplify learning", "Amplify learning is about communicating early and often and getting frequent feedback.", "Amplify learning — общаться рано и часто и получать частую обратную связь."],
      ["Empower the team", "Empower the team is about respecting the team's technical knowledge and letting it decide.", "Empower the team — уважать технические знания команды и давать ей решать."],
      ["Build quality in", "Build quality in is about assuring quality throughout development.", "Build quality in — обеспечивать качество на протяжении всей разработки."],
    ], "Optimize the whole: see the system as more than the sum of its parts and how it aligns with the organization — improve the whole flow, not one local step.", "Optimize the whole: видеть систему как нечто большее, чем сумма частей, и её связь с организацией — улучшать весь поток, а не один участок."),
    qx("A developer adds animated 3D charts that the customer never asked for, \"to make it look better\". Which lean waste is this?", "Extra features", [
      ["Extra processes", "Extra processes are unnecessary work steps such as approvals or unused documents, not product features.", "Лишние процессы — ненужные шаги работы вроде согласований или неиспользуемых документов, а не функции продукта."],
      ["Motion", "Motion is the effort of moving information between groups.", "Перемещение — усилия на передачу информации между группами."],
      ["Defects", "The charts may work perfectly; the waste is that nobody needs them.", "Графики могут работать идеально; потеря в том, что они никому не нужны."],
    ], "Extra features: features that are not required or are \"nice-to-haves\" — the slide's example is gold-plating.", "Лишние функции: функции, которые не требуются или считаются «приятным дополнением», — пример слайда: gold-plating."),
    qx("A finished feature has been sitting in a branch, waiting for testing, for two weeks. Which lean waste does the slide illustrate with this example?", "Partially done work", [
      ["Task switching", "Task switching is multitasking across projects with context-switching penalties.", "Переключение задач — многозадачность между проектами со штрафом за переключение контекста."],
      ["Extra processes", "Extra processes are steps that add no value, like unnecessary approvals.", "Лишние процессы — шаги без ценности, например ненужные согласования."],
      ["Defects", "Nothing is known to be broken yet; the work is simply unfinished.", "Пока ничего не известно о поломках; работа просто не закончена."],
    ], "Partially done work: work started but not complete; the slide's examples are code waiting for testing and specs waiting for development.", "Частично сделанная работа: начата, но не закончена; примеры слайда — код ждёт тестирования, спецификации ждут разработки."),
    qx("An analyst is assigned to four projects at once and loses time every time she switches between them. Which waste is this?", "Task switching", [
      ["Motion", "Motion is moving information or deliverables between groups, not one person switching projects.", "Перемещение — передача информации или результатов между группами, а не переключение одного человека между проектами."],
      ["Partially done work", "Unfinished work may pile up as a result, but the waste described is the switching itself.", "Незаконченная работа может накопиться как следствие, но описанная потеря — само переключение."],
      ["Extra processes", "No unnecessary process step is described.", "Ненужный шаг процесса здесь не описан."],
    ], "Task switching: multitasking between several projects when there are context-switching penalties; the slide's example is people assigned to multiple projects.", "Переключение задач: многозадачность между несколькими проектами со штрафом за переключение контекста; пример слайда — люди назначены на несколько проектов."),
    qx("Design documents are handed from a team in Almaty to a team in Astana and then to offshore testers. Which waste grows, according to the slide, when teams are not co-located?", "Motion", [
      ["Task switching", "Task switching is about one person juggling several projects.", "Переключение задач — когда один человек жонглирует несколькими проектами."],
      ["Extra features", "No unrequested feature is being built.", "Ненужную функцию здесь никто не делает."],
      ["Partially done work", "The work is moving between groups, which is motion; handoffs are its slide example.", "Работа перемещается между группами — это перемещение; передачи работы — пример слайда."],
    ], "Motion: effort to communicate or move information or deliverables from one group to another; if teams are not co-located, effort may be greater (distributed teams, handoffs).", "Перемещение: усилия на передачу информации или результатов от группы к группе; если команды не сидят вместе, усилий больше (распределённые команды, передачи работы)."),
    qx("Which pair correctly matches a lean waste with an example from the slide?", "Extra processes — unnecessary approvals", [
      ["Extra features — code waiting for testing", "Code waiting for testing is the example of partially done work.", "Код, ждущий тестирования, — пример частично сделанной работы."],
      ["Defects — people assigned to multiple projects", "People on multiple projects is the example of task switching.", "Люди на нескольких проектах — пример переключения задач."],
      ["Motion — gold-plating", "Gold-plating is the example of extra features.", "Gold-plating — пример лишних функций."],
    ], "Extra processes: extra work that does not add value — unused documentation and unnecessary approvals.", "Лишние процессы: дополнительная работа без ценности — неиспользуемая документация и ненужные согласования."),
    qx("What does the Japanese word \"kanban\" mean, according to the lecture?", "Signboard", [
      ["Continuous flow", "Flow is managed in Kanban, but it is not what the word means.", "Потоком в Kanban управляют, но слово означает не это."],
      ["Waste removal", "Waste removal is a lean goal, not the meaning of the word.", "Устранение потерь — цель lean, а не значение слова."],
      ["Pull system", "Kanban is a pull system, but the word itself means signboard.", "Kanban — система вытягивания, но само слово значит «вывеска»."],
    ], "Slide: \"Kanban\" is a Japanese word meaning \"signboard\"; the method is derived from Toyota's lean production system.", "Слайд: «Kanban» — японское слово, означающее «вывеска» (signboard); метод вырос из бережливой системы Toyota."),
    qx("What does Kanban primarily focus on, according to the lecture?", "Limiting work in progress to identify issues and minimize waste", [
      ["Timeboxed sprints that produce a potentially releasable product", "Timeboxed sprints are Scrum; Kanban works as a continuous flow.", "Спринты с таймбоксом — это Scrum; Kanban работает непрерывным потоком."],
      ["Pair programming and test-driven development on every story", "These are XP practices.", "Это практики XP."],
      ["Classifying projects by their criticality and the team size", "That is how Crystal chooses a method.", "Так выбирают метод в Crystal."],
    ], "Kanban focuses on limiting work in progress (WIP) to identify issues and minimize waste.", "Kanban сосредоточен на ограничении незавершённой работы (WIP), чтобы выявлять проблемы и сокращать потери."),
    qx("Why does Kanban limit WIP, according to the principle \"Limit WIP\"?", "To raise productivity and make bottlenecks more visible", [
      ["To keep every single team member fully busy at all times", "WIP limits deliberately accept some idle capacity to keep work flowing; utilization is not the goal.", "WIP-лимиты сознательно допускают свободную ёмкость, чтобы работа текла; загрузка людей — не цель."],
      ["To keep the sprint backlog fixed for the whole sprint", "Kanban has no sprints; protecting a sprint goal is a Scrum rule.", "В Kanban нет спринтов; защита цели спринта — правило Scrum."],
      ["To reduce the number of columns on the task board", "WIP limits restrict cards in progress, not the number of columns.", "WIP-лимиты ограничивают карточки в работе, а не число колонок."],
    ], "Limit WIP: restrict the amount of work in progress to improve productivity and increase visibility of bottlenecks.", "Limit WIP: ограничивать объём незавершённой работы, чтобы повысить производительность и сделать узкие места заметнее."),
    qx("A team writes on its board: \"A card moves to Testing only after code review is done.\" Which Kanban principle is this?", "Make process policies explicit", [
      ["Visualize the workflow", "The columns visualize the workflow; writing down the rule for moving cards is a policy.", "Колонки визуализируют поток; записанное правило перемещения карточек — это политика."],
      ["Manage flow", "Managing flow means tracking work through the system and measuring changes.", "Управлять потоком — отслеживать работу в системе и измерять эффект изменений."],
      ["Improve collaboratively", "Improving collaboratively uses measurement and experiments to change the process.", "Улучшать сообща — менять процесс с помощью измерений и экспериментов."],
    ], "Make process policies explicit: clearly explain how things work so the team can have open discussions.", "Make process policies explicit: ясно объяснить, как всё устроено, чтобы команда могла открыто обсуждать."),
    qx("Which Kanban principle is defined as \"collectively own and improve processes through scientific measurement and experimentation\"?", "Improve collaboratively", [
      ["Manage flow", "Manage flow tracks work through the system to identify issues and measure changes.", "Manage flow отслеживает работу в системе, чтобы находить проблемы и измерять изменения."],
      ["Limit WIP", "Limit WIP restricts work in progress to raise productivity and reveal bottlenecks.", "Limit WIP ограничивает незавершённую работу, чтобы повысить производительность и показать узкие места."],
      ["Make process policies explicit", "That principle is about explaining how things work for open discussion.", "Этот принцип — о том, чтобы объяснить, как всё устроено, для открытого обсуждения."],
    ], "Improve collaboratively: collectively own and improve processes through scientific measurement and experimentation.", "Improve collaboratively: коллективно владеть процессами и улучшать их через научное измерение и эксперименты."),
    qx("Individual class (code) ownership and feature teams are practices of which method?", "Feature-Driven Development (FDD)", [
      ["Extreme Programming (XP)", "XP uses the opposite idea: collective code ownership.", "XP использует противоположную идею — коллективное владение кодом."],
      ["Dynamic Systems Development Method (DSDM)", "DSDM is described through its eight principles, not class ownership.", "DSDM описывается восемью принципами, а не владением классами."],
      ["Crystal Clear", "Crystal is a family chosen by criticality and team size.", "Crystal — семейство методов по критичности и размеру команды."],
    ], "FDD practices: domain object modeling, developing by feature, individual class (code) ownership, feature teams, inspections, configuration management, regular builds, visibility of progress and results.", "Практики FDD: моделирование предметной области, разработка по функциям, индивидуальное владение классами, команды функций, инспекции, управление конфигурацией, регулярные сборки, видимость прогресса и результатов."),
    qx("What is the correct order of the FDD process?", "Overall model → feature list → plan → design → build by feature", [
      ["Feature list → overall model → design → plan → build by feature", "The overall model comes first, and planning comes before design.", "Общая модель идёт первой, а планирование — до проектирования."],
      ["Plan by feature → overall model → feature list → build → design", "Planning needs the feature list first, and design precedes build.", "Для планирования сначала нужен список функций, а проектирование идёт до разработки."],
      ["Overall model → plan → feature list → build → design by feature", "The feature list must exist before planning by feature, and design comes before build.", "Список функций должен быть до планирования по функциям, а дизайн — до разработки."],
    ], "FDD: develop an overall model → build a feature list → plan by feature → design by feature → build by feature (the last two repeat for each feature).", "FDD: общая модель → список функций → планирование по функциям → проектирование по функциям → разработка по функциям (два последних шага повторяются для каждой функции)."),
    qx("Which of the following is NOT one of the eight DSDM principles?", "Fix scope before time", [
      ["Never compromise quality", "This is DSDM principle 4.", "Это принцип DSDM 4."],
      ["Deliver on time", "This is DSDM principle 2.", "Это принцип DSDM 2."],
      ["Demonstrate control", "This is DSDM principle 8.", "Это принцип DSDM 8."],
    ], "DSDM principles: focus on the business need, deliver on time, collaborate, never compromise quality, build incrementally from firm foundations, develop iteratively, communicate continuously and clearly, demonstrate control. DSDM fixes time and lets scope flex.", "Принципы DSDM: бизнес-потребность, в срок, сотрудничать, не жертвовать качеством, инкрементно на прочном фундаменте, итеративно, общаться постоянно и ясно, демонстрировать контроль. DSDM фиксирует сроки, а объём гибкий."),
    qx("Which two factors does Crystal use to classify projects?", "Criticality and team size", [
      ["Project budget and duration", "Neither is a Crystal factor; the chart's axes are criticality and team size.", "Ни то ни другое не фактор Crystal; оси схемы — критичность и размер команды."],
      ["Risk and technology", "Risk is close to criticality, but technology is not a factor.", "Риск близок к критичности, но технология — не фактор."],
      ["Scope and complexity", "Scope and complexity are not the axes of the Crystal chart.", "Объём и сложность — не оси схемы Crystal."],
    ], "Crystal: a family of situationally specific, customized methodologies that uses criticality and team size to classify projects.", "Crystal: семейство методологий под ситуацию, которое классифицирует проекты по критичности и размеру команды."),
    qx("A 15-person team builds an online checkout where defects lose the company essential money. Which Crystal method fits, according to the chart?", "Crystal Yellow (E20)", [
      ["Crystal Clear (E6)", "Clear covers only 1–6 people, and the chart has no E6 cell.", "Clear — только 1–6 человек, и клетки E6 на схеме нет."],
      ["Crystal Orange (E40)", "Orange is for 21–40 people; 15 is within Yellow's 7–20.", "Orange — для 21–40 человек; 15 входит в диапазон Yellow 7–20."],
      ["Crystal Red (E100)", "Red is for 41–100 people.", "Red — для 41–100 человек."],
    ], "Team of 15 → Yellow (7–20); essential money → E. The cell is E20, Crystal Yellow.", "Команда 15 человек → Yellow (7–20); существенные деньги → E. Клетка — E20, Crystal Yellow."),
    tfx("Crystal Clear is designed for the largest and most life-critical projects.", false,
      "Crystal Clear is the lightest method, for teams of 1–6 people, with comfort or discretionary-money criticality (C6, D6). Life criticality appears only in Crystal Magenta (L200) on the slide's chart.",
      "Crystal Clear — самый лёгкий метод, для команд из 1–6 человек, с критичностью «комфорт» или «необязательные деньги» (C6, D6). Критичность «жизнь» на схеме слайда есть только у Crystal Magenta (L200).",
      "\"True\" reverses the scale: the colours darken (Clear → Magenta) as team size grows.",
      "«Верно» переворачивает шкалу: цвета темнеют (Clear → Magenta) с ростом команды."),
  ],
);

const p5 = part(
  "pm-l6-p5",
  { en: "Agile process overview and agile leadership", ru: "Общая схема agile-процесса и agile-лидерство" },
  {
    en: `## Agile process overview (figure)
The slide "Agile Process Overview" (image credit: Ahmed Sidky) puts everything together into one flow from an idea to project close-out:
| Stage | Activities shown in the figure |
|---|---|
| Feasibility | project visioning; establish the business case with high-level estimates (NPV, IRR, ROI) |
| Initiation | project chartering; identify personas and contact; create the backlog; high-level estimates using affinity estimation; create a roadmap using story maps |
| Release planning | slicing stories; story estimation using planning poker; build a release plan |
| Iteration 0 and spikes | technical set-up and spikes to reduce risk; gather the next iteration's story details |
| Inside each iteration (1, 2, 3…) | iteration planning; coding with technical excellence; prepare test cases; run acceptance tests; run/automate exploratory tests; be available for questions and story sign-off; prepare stories for the next iteration; daily stand-up meeting and updating burnups; iteration review and retrospective (feedback) |
| Pre-release iteration | the last iteration before the release goes out (finishing and stabilizing) |
| Close out | project close-out activities |
- "**After a release, we go to release planning for another release or, if it is the final release, we close out the project.**"
- **Preparing stories for the next iteration** (a box on the figure): re-prioritizing the backlog; selecting stories for the next iteration; preparing screen designs and wireframes; slicing stories; identifying all acceptance tests for stories; gathering all details for stories. The pyramid next to it shows that items for the coming iteration are detailed, while items for the release and future releases stay coarse — priority runs from top to bottom.
- **Key (who does what):** whole team or available team members; value management (product owner) team; technical development team; testers.
> Exam trap: in the figure, **high-level estimates using affinity estimation** belong to *initiation*, while **story estimation using planning poker** belongs to *release planning*. **NPV, IRR and ROI** appear at *feasibility*, in the business case.
## Agile leadership — people over processes
- **The concept of valuing people over processes impacts how leaders organize and motivate team members.**
- **An effective leader will discover why team members want to do things, what motivates them, and align project tasks and goals accordingly.**
- **Aligning project and personal objectives makes a more productive team.**
- IT example: a developer wants to grow in DevOps; the leader gives her the story "set up the CI pipeline". The project gets its pipeline, she gets the experience she wants — both objectives move together.
## Management versus leadership
| | Management | Leadership |
|---|---|---|
| Focus | mechanical | humanistic |
| Concerned with | tasks, control, and speed | people and purpose; empowerment and effectiveness |
| Typical question | "Is everyone busy, and are we on schedule?" | "Do people know why this matters, and what is blocking them?" |
| IT example | tracking each developer's hours in a timesheet | explaining the goal of the release and letting the team choose how to reach it |
> Memory hook: management = **things** (tasks, control, speed); leadership = **people** (purpose, empowerment, effectiveness). A well-known phrase (Warren Bennis): managers do things right, leaders do the right thing.
> Exam trap: agile does not abolish management; it shifts the emphasis toward leadership. In a "management vs leadership" question, **empowerment and effectiveness** are leadership words; **control and speed** are management words.
## Servant leadership: the 4 primary duties
The slide (titled "Management Versus Leadership") lists **4 primary duties** — in Griffiths these are the duties of the **servant leader**, the leadership style expected from agile leaders and ScrumMasters:
| # | Duty | Slide definition | IT example |
|---|---|---|---|
| 1 | Shield the team from interruptions | protect the team from unnecessary diversions | the ScrumMaster routes the sales director's ad-hoc requests to the product owner instead of letting them pull developers off the sprint |
| 2 | Remove impediments to progress | clear obstacles from the team's path that cause delay and waste | the team has waited two weeks for access to a test server; the leader escalates and gets access the same day |
| 3 | Communicate (and re-communicate) the project vision | make project goals clear so the team can align decisions with, and work toward, the common objective | at every sprint planning the leader repeats why the app exists: "students must book a room in under 30 seconds" |
| 4 | Carry food and water | provide the essential resources a team needs to keep them nourished and productive | licences, fast laptops, training, a quiet room — and sometimes literally pizza before a release night |
@diagram pm6-servant-leader
> Memory hook: a **bodyguard** (shield), a **snow plough** (remove impediments), a **lighthouse** (vision) and a **supply truck** (food and water).
> Exam trap: "carry food and water" is a **metaphor** for providing essential resources (tools, training, environment, recognition), not only literal food. And a servant leader does **not** assign tasks or command the team — he serves a self-organizing team.
- **Which duty first?** In a scenario question, name the problem type: interruptions from outside → shield the team; a blocker that delays work → remove impediments; decisions that do not fit the goal → communicate the vision; missing tools or skills → carry food and water.
## 12 principles for leading agile projects
| # | Principle | What it means in practice |
|---|---|---|
| 1 | Learn the team members' needs. | find out what each person needs to do good work |
| 2 | Learn the project's requirements. | understand what the project must deliver |
| 3 | Act for the simultaneous welfare of the team and the project. | do not sacrifice people for the deadline, nor the project for comfort |
| 4 | Create an environment of functional accountability. | people know what they own and take responsibility for results |
| 5 | Have a vision of the completed project. | picture the end result clearly |
| 6 | Use the project vision to drive your own behavior. | your own decisions follow the vision, not your convenience |
| 7 | Serve as the central figure in successful project team development. | grow the team: skills, trust, collaboration |
| 8 | Recognize team conflict as a positive step. | healthy conflict over ideas leads to better solutions |
| 9 | Manage with an eye toward ethics. | consider what is right, not only what is fast |
| 10 | Remember that ethics is not an afterthought, but an integral part of our thinking. | ethics is part of every decision from the start |
| 11 | Take time to reflect on the project. | step back regularly and learn |
| 12 | Develop the trick of thinking backwards. | start from the desired end state and work back to what must happen first |
> Memory hook: the twelve come in **six pairs** — **learn** (1 team, 2 requirements), **act** (3 welfare, 4 accountability), **vision** (5 have it, 6 live it), **team** (7 develop it, 8 welcome conflict), **ethics** (9 manage with it, 10 never an afterthought), **reflect** (11 reflect, 12 think backwards).
> Exam trap: principle 8 calls conflict a **positive step** — an agile leader does not suppress or avoid it. And do not confuse these **12 leadership principles** with the **12 principles of the Agile Manifesto** (Part 2).
## Agile leadership practices
| Practice | Slide definition | IT example |
|---|---|---|
| Model desired behavior | the highest-ranked values desired in leaders are honesty, forward-looking, competent, and inspiring | the lead admits her own estimation mistake at the retrospective — showing the honesty she expects from others |
| Communicate the project vision | frequently communicate project goals and objectives to ensure all stakeholders are aligned with the vision | the vision and the release goal hang on the team board and open every review |
| Enable others to act | enable team members to feel confident in making decisions by fostering a collaborative environment | developers may merge after peer review without waiting for the lead's approval |
| Be willing to challenge the status quo | search for ways to change, grow, and improve | "we've always deployed manually" — the leader proposes trying CI/CD |
> Memory hook: the four leader values — **H-F-C-I: Honest, Forward-looking, Competent, Inspiring** (from Kouzes and Posner's research on the qualities people most admire in leaders).
## Leadership tasks
| Task | Slide definition | IT example |
|---|---|---|
| Practice transparency through visualization | be open and honest about progress, achievements, issues, and setbacks | the burnup chart shows the slip honestly; the leader does not hide it from the sponsor |
| Create a safe environment for experimentation | team members are more likely to try new things if they know they won't be criticized | a failed experiment with a new library is discussed as learning, not blamed |
| Experiment with new techniques and processes | the only way to find out if a new process works is to try it | try mob programming for one sprint and measure the result |
| Share knowledge through collaboration | work with people to learn what they do and how they solve problems | the leader pairs with the support engineer for a day |
| Encourage emergent leadership via a safe environment | take initiative and try a new approach after gaining team approval | a junior tester proposes contract tests, gets the team's agreement and leads the change |
> Exam trap: transparency here covers **issues and setbacks too**, not only good news. And emergent leadership happens **after gaining team approval** — it is initiative inside the team, not acting alone.
?? A sales director keeps pulling developers into urgent customer calls in the middle of the sprint. Which servant-leader duty should the ScrumMaster apply first?
?= Shield the team from interruptions — protect the team from unnecessary diversions, for example by routing the requests through the product owner.
?? Two senior developers argue openly about which framework to use. What does the list of 12 leadership principles say about this?
?= Principle 8: recognize team conflict as a positive step. The leader keeps the conflict about ideas and helps the team use it to reach a better decision.
?? Which four values are ranked highest in leaders, according to the practice "model desired behavior"?
?= Honesty, forward-looking, competent and inspiring.
## Exam focus
- Agile process overview: feasibility (visioning, business case: NPV, IRR, ROI) → initiation (charter, personas, backlog, affinity estimation, story maps) → release planning (slicing stories, planning poker, release plan) → iteration 0 and spikes → iterations → pre-release iteration → close out; after a release, back to release planning or close out.
- Agile leadership: valuing people over processes; discover what motivates team members; align project and personal objectives.
- Management = mechanical; tasks, control, speed. Leadership = humanistic; people and purpose, empowerment and effectiveness.
- Four primary duties: shield from interruptions, remove impediments, communicate (and re-communicate) the vision, carry food and water.
- 12 principles for leading agile projects — especially conflict as a positive step, ethics not an afterthought, thinking backwards, functional accountability, simultaneous welfare of team and project.
- Four leadership practices: model desired behavior (honesty, forward-looking, competent, inspiring), communicate the vision, enable others to act, challenge the status quo.
- Five leadership tasks: transparency through visualization, safe environment for experimentation, experiment with new techniques, share knowledge through collaboration, encourage emergent leadership.`,
    ru: `## Общая схема agile-процесса (рисунок)
Слайд «Agile Process Overview» (рисунок Ахмеда Сидки) собирает всё в один поток — от идеи до закрытия проекта:
| Этап | Действия на рисунке |
|---|---|
| Feasibility — обоснование | формирование видения проекта (project visioning); бизнес-обоснование (business case) с высокоуровневыми оценками (NPV, IRR, ROI) |
| Initiation — инициация | устав проекта (project chartering); определить персоны (personas) и контакты; создать бэклог; высокоуровневые оценки методом аффинной оценки (affinity estimation); дорожная карта через карты историй (story maps) |
| Release planning — планирование релиза | нарезка историй (slicing stories); оценка историй через planning poker; план релиза |
| Iteration 0 и спайки | техническая подготовка и спайки для снижения рисков; собрать детали историй следующей итерации |
| Внутри каждой итерации (1, 2, 3…) | планирование итерации; код с техническим совершенством (coding with technical excellence); подготовить тест-кейсы; прогнать приёмочные тесты; прогнать/автоматизировать исследовательские тесты; быть доступным для вопросов и подписания историй; готовить истории к следующей итерации; ежедневный стендап и обновление burnup-графиков; обзор итерации и ретроспектива (обратная связь) |
| Pre-release iteration — предрелизная итерация | последняя итерация перед выходом релиза (доводка и стабилизация) |
| Close out — закрытие | действия по закрытию проекта (project close-out activities) |
- «**После релиза мы возвращаемся к планированию следующего релиза или, если это последний релиз, закрываем проект.**»
- **Подготовка историй к следующей итерации** (блок на рисунке): перерасставить приоритеты бэклога; выбрать истории на следующую итерацию; подготовить дизайн экранов и вайрфреймы; нарезать истории; определить все приёмочные тесты для историй; собрать все детали историй. Пирамида рядом показывает: элементы ближайшей итерации детализированы, а элементы релиза и будущих релизов остаются крупными — приоритет идёт сверху вниз.
- **Легенда (кто что делает):** вся команда или свободные члены команды; команда управления ценностью (product owner); техническая команда разработки; тестировщики.
> Ловушка экзамена: на рисунке **высокоуровневые оценки методом affinity estimation** относятся к *инициации*, а **оценка историй через planning poker** — к *планированию релиза*. **NPV, IRR и ROI** стоят на этапе *обоснования*, в бизнес-обосновании.
## Agile-лидерство — люди важнее процессов
- **Идея ценить людей больше процессов (valuing people over processes) влияет на то, как лидеры организуют и мотивируют членов команды.**
- **Эффективный лидер выясняет, почему люди хотят что-то делать, что их мотивирует, и соответственно выстраивает задачи и цели проекта.**
- **Согласование целей проекта и личных целей делает команду продуктивнее.**
- Пример из IT: разработчица хочет расти в DevOps; лидер даёт ей историю «настроить CI-пайплайн». Проект получает пайплайн, она — нужный опыт: обе цели движутся вместе.
## Менеджмент и лидерство (management vs leadership)
| | Менеджмент (management) | Лидерство (leadership) |
|---|---|---|
| Фокус | механистический (mechanical) | гуманистический (humanistic) |
| Чем озабочен | задачи, контроль и скорость (tasks, control, speed) | люди и цель; наделение полномочиями и результативность (empowerment and effectiveness) |
| Типичный вопрос | «Все ли заняты и укладываемся ли мы в график?» | «Понимают ли люди, зачем это нужно, и что им мешает?» |
| Пример из IT | учитывать часы каждого разработчика в табеле | объяснить цель релиза и дать команде выбрать, как её достичь |
> Зацепка: менеджмент — про **вещи** (задачи, контроль, скорость); лидерство — про **людей** (цель, полномочия, результативность). Известная фраза Уоррена Бенниса: менеджеры делают дела правильно, лидеры делают правильные дела.
> Ловушка экзамена: agile не отменяет менеджмент, а смещает акцент к лидерству. В вопросе «management vs leadership» **empowerment и effectiveness** — слова лидерства; **control и speed** — слова менеджмента.
## Лидерство-служение (servant leadership): 4 главные обязанности
Слайд (с заголовком «Management Versus Leadership») перечисляет **4 главные обязанности (4 primary duties)** — у Griffiths это обязанности **лидера-слуги (servant leader)**, того стиля лидерства, которого ждут от agile-лидеров и скрам-мастеров:
| # | Обязанность | Определение слайда | Пример из IT |
|---|---|---|---|
| 1 | Shield the team from interruptions — ограждать команду от отвлечений | защищать команду от ненужных отвлечений | скрам-мастер направляет внезапные просьбы директора по продажам к product owner, а не даёт снимать разработчиков со спринта |
| 2 | Remove impediments to progress — устранять препятствия | убирать с пути команды препятствия, которые вызывают задержки и потери | команда две недели ждёт доступа к тестовому серверу; лидер эскалирует и получает доступ в тот же день |
| 3 | Communicate (and re-communicate) the project vision — доносить (снова и снова) видение проекта | делать цели проекта ясными, чтобы команда согласовывала с ними решения и работала на общую цель | на каждом планировании спринта лидер повторяет, зачем существует приложение: «студент должен забронировать аудиторию меньше чем за 30 секунд» |
| 4 | Carry food and water — обеспечивать «едой и водой» | давать команде необходимые ресурсы, чтобы она была «сыта» и продуктивна | лицензии, быстрые ноутбуки, обучение, тихая комната — а иногда и правда пицца перед ночью релиза |
@diagram pm6-servant-leader
> Зацепка: **телохранитель** (оградить), **снегоочиститель** (убрать препятствия), **маяк** (видение) и **грузовик снабжения** (еда и вода).
> Ловушка экзамена: «carry food and water» — **метафора** обеспечения необходимыми ресурсами (инструменты, обучение, условия, признание), а не только буквально еда. И лидер-слуга **не** раздаёт задачи и не командует — он служит самоорганизующейся команде.
- **Какая обязанность первая?** В вопросе-ситуации назовите тип проблемы: отвлечения извне → оградить команду; блокер, который задерживает работу → убрать препятствие; решения не согласуются с целью → донести видение; не хватает инструментов или навыков → «еда и вода».
## 12 принципов руководства agile-проектами (12 principles for leading agile projects)
| # | Принцип | Что значит на практике |
|---|---|---|
| 1 | Learn the team members' needs — узнать потребности членов команды. | выяснить, что нужно каждому, чтобы хорошо работать |
| 2 | Learn the project's requirements — узнать требования проекта. | понять, что проект должен поставить |
| 3 | Act for the simultaneous welfare of the team and the project — действовать одновременно во благо команды и проекта. | не жертвовать людьми ради срока и проектом ради комфорта |
| 4 | Create an environment of functional accountability — создать среду функциональной подотчётности. | люди знают, за что отвечают, и берут ответственность за результат |
| 5 | Have a vision of the completed project — иметь видение завершённого проекта. | ясно представлять конечный результат |
| 6 | Use the project vision to drive your own behavior — пусть видение проекта направляет ваше собственное поведение. | ваши решения следуют видению, а не вашему удобству |
| 7 | Serve as the central figure in successful project team development — быть центральной фигурой в успешном развитии команды. | растить команду: навыки, доверие, сотрудничество |
| 8 | Recognize team conflict as a positive step — признавать конфликт в команде положительным шагом. | здоровый конфликт идей ведёт к лучшим решениям |
| 9 | Manage with an eye toward ethics — управлять с оглядкой на этику. | думать о том, что правильно, а не только о том, что быстро |
| 10 | Remember that ethics is not an afterthought, but an integral part of our thinking — помнить, что этика не запоздалая мысль, а неотъемлемая часть мышления. | этика — часть каждого решения с самого начала |
| 11 | Take time to reflect on the project — находить время размышлять о проекте. | регулярно отходить на шаг назад и учиться |
| 12 | Develop the trick of thinking backwards — развивать приём «мышления от конца». | начинать с желаемого конечного состояния и идти назад к тому, что должно произойти первым |
> Зацепка: двенадцать принципов идут **шестью парами** — **узнать** (1 команду, 2 требования), **действовать** (3 благо, 4 подотчётность), **видение** (5 иметь, 6 жить им), **команда** (7 развивать, 8 принимать конфликт), **этика** (9 управлять с ней, 10 не запоздалая мысль), **рефлексия** (11 размышлять, 12 думать от конца).
> Ловушка экзамена: принцип 8 называет конфликт **положительным шагом** — agile-лидер его не подавляет и не избегает. И не путайте эти **12 принципов лидерства** с **12 принципами Agile Manifesto** (часть 2).
## Практики agile-лидерства (agile leadership practices)
| Практика | Определение слайда | Пример из IT |
|---|---|---|
| Model desired behavior — показывать желаемое поведение на своём примере | самые высоко ценимые в лидерах качества — честность, устремлённость в будущее, компетентность и способность вдохновлять (honesty, forward-looking, competent, inspiring) | тимлид на ретроспективе признаёт свою ошибку в оценке — показывает ту честность, которой ждёт от других |
| Communicate the project vision — доносить видение проекта | часто сообщать цели и задачи проекта, чтобы все стейкхолдеры были согласованы с видением | видение и цель релиза висят на доске команды и открывают каждый обзор |
| Enable others to act — давать другим возможность действовать | помогать членам команды уверенно принимать решения, развивая атмосферу сотрудничества | разработчики могут мёржить после ревью коллеги, не дожидаясь одобрения лида |
| Be willing to challenge the status quo — быть готовым бросать вызов статус-кво | искать способы меняться, расти и улучшаться | «мы всегда деплоили вручную» — лидер предлагает попробовать CI/CD |
> Зацепка: четыре качества лидера — **H-F-C-I: Honest, Forward-looking, Competent, Inspiring** (из исследований Кузеса и Познера о качествах, которые люди больше всего ценят в лидерах).
## Задачи лидера (leadership tasks)
| Задача | Определение слайда | Пример из IT |
|---|---|---|
| Practice transparency through visualization — прозрачность через визуализацию | открыто и честно говорить о прогрессе, достижениях, проблемах и неудачах | burnup-график честно показывает отставание; лидер не скрывает его от спонсора |
| Create a safe environment for experimentation — безопасная среда для экспериментов | люди охотнее пробуют новое, если знают, что их не будут критиковать | неудачный эксперимент с новой библиотекой обсуждают как опыт, а не ищут виноватых |
| Experiment with new techniques and processes — экспериментировать с новыми техниками и процессами | единственный способ узнать, работает ли новый процесс, — попробовать его | попробовать моб-программирование на один спринт и измерить результат |
| Share knowledge through collaboration — делиться знаниями через сотрудничество | работать с людьми, чтобы узнать, что они делают и как решают проблемы | лидер день работает в паре с инженером поддержки |
| Encourage emergent leadership via a safe environment — поощрять лидерство снизу через безопасную среду | проявить инициативу и попробовать новый подход после одобрения команды | младший тестировщик предлагает контрактные тесты, получает согласие команды и ведёт изменение |
> Ловушка экзамена: прозрачность здесь — это **и проблемы с неудачами**, а не только хорошие новости. А лидерство снизу (emergent leadership) появляется **после одобрения команды** — это инициатива внутри команды, а не действие в одиночку.
?? Директор по продажам посреди спринта постоянно забирает разработчиков на срочные звонки с клиентами. Какую обязанность лидера-слуги скрам-мастер должен применить первой?
?= Оградить команду от отвлечений (shield the team from interruptions) — защитить от ненужных отвлечений, например направлять такие просьбы через product owner.
?? Два старших разработчика открыто спорят, какой фреймворк выбрать. Что об этом говорит список 12 принципов лидерства?
?= Принцип 8: признавать конфликт в команде положительным шагом. Лидер следит, чтобы спор оставался о идеях, и помогает команде прийти через него к лучшему решению.
?? Какие четыре качества ценятся в лидерах выше всего, согласно практике «model desired behavior»?
?= Честность, устремлённость в будущее, компетентность и способность вдохновлять (honesty, forward-looking, competent, inspiring).
## На что обратить внимание на экзамене (Exam focus)
- Общая схема agile-процесса: обоснование (видение, бизнес-обоснование: NPV, IRR, ROI) → инициация (устав, персоны, бэклог, affinity estimation, story maps) → планирование релиза (нарезка историй, planning poker, план релиза) → итерация 0 и спайки → итерации → предрелизная итерация → закрытие; после релиза — снова планирование релиза или закрытие.
- Agile-лидерство: ценить людей больше процессов; выяснять, что мотивирует людей; согласовывать цели проекта и личные цели.
- Менеджмент — механистический; задачи, контроль, скорость. Лидерство — гуманистическое; люди и цель, полномочия и результативность.
- Четыре главные обязанности: оградить от отвлечений, убирать препятствия, доносить (снова и снова) видение, «еда и вода».
- 12 принципов руководства agile-проектами — особенно конфликт как положительный шаг, этика не запоздалая мысль, мышление от конца, функциональная подотчётность, одновременное благо команды и проекта.
- Четыре практики лидерства: model desired behavior (honesty, forward-looking, competent, inspiring), communicate the vision, enable others to act, challenge the status quo.
- Пять задач лидера: прозрачность через визуализацию, безопасная среда для экспериментов, эксперименты с новыми техниками, обмен знаниями через сотрудничество, поощрение лидерства снизу.`,
  },
  [
    qx("In the Agile Process Overview figure, what happens in the Feasibility stage?", "Project visioning and a business case with high-level estimates", [
      ["Story estimation using planning poker and building a release plan", "These activities belong to release planning.", "Это действия этапа планирования релиза."],
      ["Project chartering, personas and a roadmap built from story maps", "These activities belong to initiation.", "Это действия этапа инициации."],
      ["Iteration planning and coding with technical excellence", "These happen inside each iteration.", "Это происходит внутри каждой итерации."],
    ], "Feasibility: project visioning and establishing the business case with high-level estimates (NPV, IRR, ROI).", "Feasibility: формирование видения и бизнес-обоснование с высокоуровневыми оценками (NPV, IRR, ROI)."),
    qx("According to the Agile Process Overview figure, in which stage are stories estimated using planning poker?", "Release planning", [
      ["Initiation", "Initiation uses high-level estimates with affinity estimation, not planning poker.", "В инициации делают высокоуровневые оценки методом affinity estimation, а не planning poker."],
      ["Feasibility", "Feasibility builds the business case (NPV, IRR, ROI), not story estimates.", "На этапе обоснования строят бизнес-обоснование (NPV, IRR, ROI), а не оценки историй."],
      ["Iteration planning", "Iteration planning breaks the chosen stories into tasks for the coming iteration; story estimation with planning poker is shown in release planning.", "Планирование итерации разбивает выбранные истории на задачи ближайшей итерации; оценка историй через planning poker показана в планировании релиза."],
    ], "Release planning: slicing stories, story estimation using planning poker, and building a release plan.", "Планирование релиза: нарезка историй, оценка историй через planning poker и построение плана релиза."),
    qx("According to the figure, what happens after a release?", "Release planning again, or close-out if it was the final release", [
      ["The team disbands, and a brand-new team plans the next release", "Agile keeps stable teams; the figure loops back to release planning with the same flow.", "Agile сохраняет устойчивые команды; рисунок возвращает к планированию релиза в том же потоке."],
      ["The project goes back to Feasibility to be approved once again", "The loop goes back to release planning, not to feasibility.", "Цикл возвращается к планированию релиза, а не к обоснованию."],
      ["Iteration 0 is repeated to rebuild the whole technical environment", "Iteration 0 is not the return point named on the figure.", "Итерация 0 — не та точка возврата, которую называет рисунок."],
    ], "Figure: \"After a release, we go to release planning for another release or, if it is the final release, we close out the project.\"", "Рисунок: «После релиза мы возвращаемся к планированию следующего релиза или, если это последний релиз, закрываем проект»."),
    qx("According to the lecture, what will an effective agile leader do?", "Find out what motivates people and align tasks and goals with it", [
      ["Set personal targets for each member and check them every week", "Target-setting and checking is a control approach, not discovering motivation.", "Ставить и проверять цели — подход контроля, а не выяснение мотивации."],
      ["Keep project goals strictly separate from people's personal goals", "The slide says the opposite: aligning project and personal objectives makes a more productive team.", "Слайд говорит обратное: согласование целей проекта и личных целей делает команду продуктивнее."],
      ["Motivate the team mainly through deadlines and close control", "Deadlines and control are the management focus, not agile leadership.", "Сроки и контроль — фокус менеджмента, а не agile-лидерства."],
    ], "An effective leader will discover why team members want to do things, what motivates them, and align project tasks and goals accordingly.", "Эффективный лидер выясняет, почему люди хотят что-то делать, что их мотивирует, и выстраивает задачи и цели проекта соответственно."),
    qx("Which description matches management, as opposed to leadership, in the lecture?", "Mechanical focus on tasks, control, and speed", [
      ["Humanistic focus on people and on their purpose", "This is the slide's description of leadership.", "Это описание лидерства со слайда."],
      ["Concern with empowerment and effectiveness", "Empowerment and effectiveness are leadership concerns.", "Полномочия и результативность — забота лидерства."],
      ["Focus on removing impediments for the team", "Removing impediments is a servant-leader duty.", "Устранение препятствий — обязанность лидера-слуги."],
    ], "Management: mechanical focus concerned with tasks, control, and speed. Leadership: humanistic focus on people and purpose, concerned with empowerment and effectiveness.", "Менеджмент: механистический фокус на задачах, контроле и скорости. Лидерство: гуманистический фокус на людях и цели, забота о полномочиях и результативности."),
    qx("Which pair of words does the lecture associate with leadership rather than management?", "Empowerment and effectiveness", [
      ["Control, speed and task completion", "Control, speed and tasks are the management side of the slide.", "Контроль и скорость — заботы менеджмента."],
      ["Task lists and delivery schedules", "Tasks and schedules are management concerns, not the leadership words.", "Задачи относятся к стороне менеджмента на слайде."],
      ["Utilization and efficiency", "These are classic management metrics, not the slide's leadership words.", "Это классические метрики менеджмента, а не слова лидерства со слайда."],
    ], "Leadership is concerned with empowerment and effectiveness (and focuses on people and purpose).", "Лидерство озабочено полномочиями и результативностью (и сосредоточено на людях и цели)."),
    qx("A sales director keeps pulling developers into urgent customer calls in the middle of the sprint. Which servant-leader duty applies first?", "Shield the team from interruptions", [
      ["Remove impediments to progress", "An impediment is an obstacle in the team's path; here the problem is outside diversions.", "Препятствие — помеха на пути команды; здесь проблема во внешних отвлечениях."],
      ["Carry food and water", "Nothing is missing in resources; the team is being distracted.", "С ресурсами всё в порядке; команду отвлекают."],
      ["Communicate (and re-communicate) the project vision", "The team knows the goal; it simply cannot work on it undisturbed.", "Команда знает цель; ей просто не дают спокойно работать."],
    ], "Shield the team from interruptions: protect the team from unnecessary diversions.", "Shield the team from interruptions: защищать команду от ненужных отвлечений."),
    qx("The team has waited two weeks for access to a test server, and finished stories are piling up. Which duty should the servant leader perform?", "Remove impediments to progress", [
      ["Shield the team from interruptions", "No one is interrupting the team; an obstacle is blocking it.", "Команду никто не отвлекает; её блокирует препятствие."],
      ["Communicate the project vision", "The vision is not the problem; the blocked access is.", "Проблема не в видении, а в заблокированном доступе."],
      ["Model desired behavior", "Modeling behavior is a leadership practice, not the duty that clears blockers.", "Пример поведения — практика лидерства, а не обязанность снимать блокеры."],
    ], "Remove impediments to progress: clear obstacles from the team's path that cause delay and waste.", "Remove impediments to progress: убирать с пути команды препятствия, вызывающие задержки и потери."),
    qx("What does the servant-leader duty \"carry food and water\" mean?", "Provide the essential resources a team needs to stay productive", [
      ["Organize team lunches to keep up morale during long crunch periods", "It is a metaphor; taking it literally misses tools, training and environment.", "Это метафора; буквальное прочтение упускает инструменты, обучение и условия."],
      ["Personally take over tasks whenever developers fall behind", "Doing the team's work is not a servant-leader duty; enabling it is.", "Делать работу за команду — не обязанность лидера-слуги; его дело — дать ей возможность работать."],
      ["Approve the budget for overtime pay during release weeks", "Paying for overtime supports an unsustainable pace, not nourishment.", "Оплата переработок поддерживает неустойчивый темп, а не «питание» команды."],
    ], "Carry food and water: provide the essential resources a team needs to keep them nourished and productive.", "Carry food and water: давать команде необходимые ресурсы, чтобы она была «сыта» и продуктивна."),
    qx("Developers keep making design decisions that do not fit the product's goals. Which duty addresses this most directly?", "Communicate the project vision", [
      ["Shield the team from interruptions", "The issue is not distraction but decisions that drift from the goal.", "Проблема не в отвлечениях, а в решениях, которые уходят от цели."],
      ["Carry food and water", "Resources are not what is missing; a shared understanding of the goal is.", "Не хватает не ресурсов, а общего понимания цели."],
      ["Remove impediments to progress", "Nothing blocks the work; it simply goes in the wrong direction.", "Работу ничто не блокирует; она просто идёт не туда."],
    ], "Communicate (and re-communicate) the project vision: make project goals clear so the team can align decisions with, and work toward, the common objective.", "Доносить (снова и снова) видение: делать цели проекта ясными, чтобы команда согласовывала с ними решения и работала на общую цель."),
    qx("Which of the following is NOT one of the four primary duties listed in the lecture?", "Assign daily tasks to each team member", [
      ["Shield the team from interruptions", "This is duty 1.", "Это обязанность 1."],
      ["Remove impediments to progress", "This is duty 2.", "Это обязанность 2."],
      ["Communicate (and re-communicate) the project vision", "This is duty 3.", "Это обязанность 3."],
    ], "The four duties: shield the team, remove impediments, communicate (and re-communicate) the vision, carry food and water. Assigning tasks contradicts self-organization.", "Четыре обязанности: оградить команду, убирать препятствия, доносить (снова и снова) видение, «еда и вода». Раздача задач противоречит самоорганизации."),
    qx("Two senior developers argue openly about which framework to use. According to the 12 principles for leading agile projects, how should the leader view this?", "As a positive step that can lead to a better solution", [
      ["As a threat to stop at once by making the decision alone", "Suppressing conflict by decree goes against principle 8.", "Подавить конфликт распоряжением — против принципа 8."],
      ["As a sign that one of the two should leave the team", "Disagreement about ideas is healthy, not a reason to remove people.", "Спор об идеях — это здоровое явление, а не повод убирать людей."],
      ["As an ethics issue to escalate to the sponsor", "A technical disagreement is not an ethics issue.", "Технический спор — не вопрос этики."],
    ], "Principle 8: recognize team conflict as a positive step.", "Принцип 8: признавать конфликт в команде положительным шагом."),
    qx("What does the leadership principle \"develop the trick of thinking backwards\" suggest?", "Start from the end state and work back to the first steps", [
      ["Review past projects before starting any new planning", "Looking at past projects is reflection (principle 11), not thinking backwards from the goal.", "Взгляд на прошлые проекты — рефлексия (принцип 11), а не мышление от цели назад."],
      ["Plan the work in reverse order of its priority", "Reversing priorities would deliver the least valuable work first.", "Обратный порядок приоритетов дал бы сначала наименее ценную работу."],
      ["Question every single decision made earlier in the project", "That is closer to challenging the status quo.", "Это ближе к «бросать вызов статус-кво»."],
    ], "Thinking backwards: picture the completed project and work back to what must happen first — it connects to having a vision of the completed project (principle 5).", "Мышление от конца: представить завершённый проект и идти назад к тому, что должно произойти первым; это связано с видением завершённого проекта (принцип 5)."),
    qx("Which of the following is NOT one of the 12 principles for leading agile projects?", "Track individual utilization to keep control", [
      ["Create an environment of functional accountability", "This is principle 4.", "Это принцип 4."],
      ["Act for the welfare of the team and the project", "This is principle 3 (the simultaneous welfare of both).", "Это принцип 3 (одновременное благо обоих)."],
      ["Use the project vision to drive your own behavior", "This is principle 6.", "Это принцип 6."],
    ], "Tracking utilization for control is a management (control) approach; none of the 12 leadership principles is about control.", "Отслеживать загрузку ради контроля — подход менеджмента; ни один из 12 принципов лидерства не про контроль."),
    qx("According to the practice \"model desired behavior\", which values are ranked highest in leaders?", "Honest, forward-looking, competent, inspiring", [
      ["Honest, decisive, experienced, strict", "Honest is right, but decisive, experienced and strict are not on the slide.", "Честность — верно, но решительности, опыта и строгости на слайде нет."],
      ["Competent, loyal, ambitious, inspiring", "Loyal and ambitious replace honest and forward-looking.", "Лояльность и амбициозность подменяют честность и устремлённость в будущее."],
      ["Forward-looking, technically skilled, patient, fair", "Only forward-looking is on the slide's list.", "Из списка слайда здесь только forward-looking."],
    ], "Model desired behavior: the highest-ranked values desired in leaders are honesty, forward-looking, competent, and inspiring.", "Model desired behavior: самые высоко ценимые качества лидера — честность, устремлённость в будущее, компетентность и способность вдохновлять."),
    qx("Which leadership practice is defined as \"enable team members to feel confident in making decisions by fostering a collaborative environment\"?", "Enable others to act", [
      ["Model desired behavior", "Modeling is about the leader showing honesty, competence and the like.", "Пример поведения — о том, что лидер сам проявляет честность, компетентность и т. п."],
      ["Challenge the status quo", "Challenging the status quo is searching for ways to change, grow and improve.", "Вызов статус-кво — поиск способов меняться, расти и улучшаться."],
      ["Communicate the vision", "Communicating the vision aligns stakeholders with goals; it does not build decision confidence.", "Донесение видения согласует стейкхолдеров с целями, но не даёт уверенности в решениях."],
    ], "Enable others to act: enable team members to feel confident in making decisions by fostering a collaborative environment.", "Enable others to act: помогать членам команды уверенно принимать решения, развивая атмосферу сотрудничества."),
    qx("A team lead says: \"We've always deployed manually, but let's try CI/CD.\" Which leadership practice is this?", "Be willing to challenge the status quo", [
      ["Practice transparency through visualization", "Transparency means being open about progress and setbacks; questioning the old way of working is challenging the status quo.", "Прозрачность — открыто говорить о прогрессе и неудачах; поставить под сомнение старый способ работы — это вызов статус-кво."],
      ["Enable others to act", "Enabling others is about the team's confidence in making decisions.", "Enable others to act — об уверенности команды в собственных решениях."],
      ["Model desired behavior", "No particular personal value is being demonstrated; the old way is being questioned.", "Здесь не демонстрируют личное качество, а ставят под сомнение старый способ."],
    ], "Be willing to challenge the status quo: search for ways to change, grow, and improve.", "Be willing to challenge the status quo: искать способы меняться, расти и улучшаться."),
    qx("A failed experiment with a new library is discussed at the retrospective as learning, and nobody is blamed. Which leadership task does this support?", "Create a safe environment for experimentation", [
      ["Practice transparency through visualization", "Transparency is about openly showing progress and setbacks, not about safety to fail.", "Прозрачность — открыто показывать прогресс и неудачи, а не безопасность ошибаться."],
      ["Share knowledge through collaboration", "Sharing knowledge means working with people to learn how they solve problems.", "Обмен знаниями — работать с людьми, чтобы узнать, как они решают проблемы."],
      ["Encourage emergent leadership via a safe environment", "Emergent leadership is about a team member taking initiative after gaining team approval; the case is about not criticizing a failed experiment.", "Лидерство снизу — когда член команды проявляет инициативу после одобрения команды; кейс же о том, чтобы не критиковать неудачный эксперимент."],
    ], "Create a safe environment for experimentation: team members are more likely to try new things if they know they won't be criticized.", "Create a safe environment for experimentation: люди охотнее пробуют новое, если знают, что их не будут критиковать."),
    tfx("Practicing transparency through visualization means showing progress and achievements, while issues and setbacks are best kept from stakeholders.", false,
      "The slide says: be open and honest about progress, achievements, issues, and setbacks — bad news is included.",
      "Слайд говорит: открыто и честно говорить о прогрессе, достижениях, проблемах и неудачах — плохие новости тоже.",
      "\"True\" would turn transparency into selective reporting, which hides problems until they are too late to fix.",
      "«Верно» превратило бы прозрачность в выборочную отчётность, которая прячет проблемы, пока их не станет поздно исправлять."),
    tfx("According to the lecture, emergent leadership means a team member takes initiative and tries a new approach after gaining team approval.", true,
      "Leadership task: encourage emergent leadership via a safe environment — take initiative and try a new approach after gaining team approval.",
      "Задача лидера: поощрять лидерство снизу через безопасную среду — проявить инициативу и попробовать новый подход после одобрения команды.",
      "\"False\" would mean that only the appointed leader may lead, or that initiative needs no team agreement — the slide says neither.",
      "«Неверно» означало бы, что вести может только назначенный лидер или что инициативе не нужно согласие команды, — слайд не говорит ни того, ни другого."),
  ],
);

export const lecture6: Lecture = {
  id: "pm-l6",
  title: { en: "Lecture 6 — Agile Principles and Mindset", ru: "Лекция 6 — Принципы и мышление Agile" },
  parts: [p1, p2, p3, p4, p5],
};
