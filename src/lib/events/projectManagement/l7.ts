import { part, qx, tfx, type Lecture } from "../types";

/*
 * Лекция 7 PM — «Scrum framework» (45 слайдов). Источник слайдов — Scrum Guide 2020
 * (Schwaber & Sutherland, «The Definitive Guide to Scrum: The Rules of the Game»);
 * формулировки на слайдах почти дословные — в конспекте они сохранены.
 * Только картинками на слайдах (в тексте PDF их нет) и перенесено в конспект:
 * Figure 1 «Agile frameworks and practices» (Agile Development — «a general term defined
 * by values and principles»; Agile Frameworks: SAFe, Scrum, Crystal, Kanban, eXtreme
 * Programming (XP), Feature-Driven Development; Practices: Timeboxing, Stories, Daily
 * Stand-Ups, Frequent demos, Test-Driven Development, Information radiators, Retrospectives,
 * Continuous Integration); Figure 2 «Scrum framework – Five values and Three pillars»
 * (храм: крыша «The pillars of scrum», колонны Transparency / Inspection / Adaptation,
 * основание «Supported by the values: Commitment, Courage, Focus, Openness, Respect»).
 * Слайды 12, 19 и 32 пустые (видимо, картинки не сохранились); последний — ссылки.
 * Расхождения с лекцией 6 (Griffiths: ScrumMaster, development team, roles, «one or
 * two-week» спринт, refinement как встреча, «prioritized … single source of requirements»)
 * отмечены в конспекте строками «Exam trap»: на тесте по формулировкам Scrum Guide
 * верна лекция 7.
 */

const p1 = part(
  "pm-l7-p1",
  { en: "What Scrum is: definition, theory, pillars and values", ru: "Что такое Scrum: определение, теория, столпы и ценности" },
  {
    en: `## Where Scrum fits: agile frameworks and practices (Figure 1)
The lecture opens with **Figure 1 "Agile frameworks and practices"** (an image on the slide). It shows three levels:
| Level | What the figure says | Items on the figure |
|---|---|---|
| Agile Development | "a general term defined by **values and principles**" | the Agile Manifesto: 4 values, 12 principles (Lecture 6) |
| Agile Frameworks | complete ways of organizing the work | SAFe, Scrum, Crystal, Kanban, eXtreme Programming (XP), Feature-Driven Development |
| Practices | individual techniques a team can use inside a framework | Timeboxing, Stories, Daily Stand-Ups, Frequent demos, Test-Driven Development, Information radiators, Retrospectives, Continuous Integration |
- **Agile** itself is not a framework and not a method — it is an umbrella term defined by values and principles.
- **Scrum** is one of the agile frameworks. This lecture follows the **Scrum Guide 2020** by Ken Schwaber and Jeff Sutherland ("The Definitive Guide to Scrum: The Rules of the Game").
- **Practices** are smaller building blocks. Scrum itself uses some of them (timeboxing, retrospectives); a team may add others (stories, TDD, continuous integration).
> Exam trap: on Figure 1, **Kanban** and **SAFe** are frameworks, while **Timeboxing, Stories, Daily Stand-Ups, Frequent demos, TDD, Information radiators, Retrospectives and Continuous Integration** are practices. "Agile" is a general term, not a framework.
## Scrum definition
> **Scrum is a lightweight framework that helps people, teams and organizations generate value through adaptive solutions for complex problems.**
| Key word | What it means |
|---|---|
| lightweight | a minimum of rules: 3 accountabilities, 5 events, 3 artifacts — no thick process manual |
| framework | a frame to be filled with your own practices, not a step-by-step methodology |
| people, teams and organizations | Scrum works at all three levels, not only inside one team |
| generate value | the aim is value for users and the business, not output or hours worked |
| adaptive solutions | the solution changes as the team learns, instead of being fixed upfront |
| complex problems | more is unknown than known: a new product, new technology, a changing market |
**In a nutshell**, Scrum requires a **Scrum Master to foster an environment** where:
| Step | Slide wording | Who |
|---|---|---|
| 1 | A Product Owner orders the work for a complex problem into a Product Backlog. | Product Owner |
| 2 | The Scrum Team turns a selection of the work into an Increment of value during a Sprint. | Scrum Team |
| 3 | The Scrum Team and its stakeholders inspect the results and adjust for the next Sprint. | Scrum Team and stakeholders |
| 4 | Repeat | everyone, Sprint after Sprint |
- IT example: a team builds a food-delivery app. The Product Owner orders the work (card payment, order tracking, promo codes…) in the Product Backlog; in a two-week Sprint the team turns "card payment" into a working, tested Increment; at the end they show it to restaurant partners and adjust the plan for the next Sprint; then they repeat.
> Exam trap: in the nutshell the Scrum Master **fosters an environment**. The Scrum Master does not order the work (that is the Product Owner) and does not build the Increment alone (that is the Scrum Team). Step 3 includes the **stakeholders**, not only the team.
## Scrum is simple — and purposefully incomplete
- **Scrum is simple.** Try it **as is** and determine if its philosophy, theory, and structure help to achieve goals and create value.
- The Scrum framework is **purposefully incomplete**, only defining the parts required to implement Scrum theory.
- Scrum is **built upon by the collective intelligence** of the people using it.
- Rather than provide people with detailed instructions, **the rules of Scrum guide their relationships and interactions**.
- **Various processes, techniques and methods** can be employed within the framework.
- Scrum **wraps around existing practices or renders them unnecessary**.
- Scrum **makes visible the relative efficacy** of current management, environment, and work techniques, so that improvements can be made.
> Exam trap: because Scrum is purposefully incomplete, it does **not** prescribe user stories, story points, burn-down charts, task boards or TDD. These are complementary practices a team may add. An option such as "Scrum requires user stories and story points" is wrong.
## Scrum theory: empiricism and lean thinking
| Foundation | Slide definition | In practice |
|---|---|---|
| Empiricism | knowledge comes from experience and making decisions based on what is observed | decide from real data: what was actually Done, what users actually did |
| Lean thinking | reduces waste and focuses on the essentials | do not build features nobody needs; cut waiting and handoffs |
- Scrum employs an **iterative, incremental approach** to **optimize predictability and to control risk**.
- *Iterative* — the work is repeated in cycles (Sprints), each one learning from the last; *incremental* — each cycle adds a usable piece (an Increment) to what already exists.
- Scrum engages groups of people who **collectively have all the skills and expertise** to do the work and **share or acquire such skills as needed**.
- Scrum combines **four formal events** for inspection and adaptation **within a containing event, the Sprint**.
- These events work because they implement the **empirical Scrum pillars of transparency, inspection, and adaptation**.
= Sprint (containing event) + Sprint Planning + Daily Scrum + Sprint Review + Sprint Retrospective = 5 events
> Exam trap: "four formal events within a containing event" gives **five events** in total (the Inspection slide says "its five events"). An option that says "Scrum has four events" or lists "Backlog Refinement" as an event does not match the 2020 Guide.
> Exam trap: the iterative, incremental approach is used to **optimize predictability and control risk** — not "to eliminate all risk" and not "to guarantee a fixed scope".
## The three pillars of empiricism
| Pillar | What the slide says | It enables | Key phrase |
|---|---|---|---|
| Transparency | the emergent process and work must be visible to those performing the work as well as those receiving the work; important decisions are based on the perceived state of the three formal artifacts | inspection | low transparency → decisions that diminish value and increase risk; inspection without transparency is **misleading and wasteful** |
| Inspection | the Scrum artifacts and the progress toward agreed goals must be inspected frequently and diligently to detect potentially undesirable variances or problems; Scrum provides cadence in the form of its five events | adaptation | inspection without adaptation is considered **pointless**; Scrum events are designed to **provoke change** |
| Adaptation | if any aspects of a process deviate outside acceptable limits or if the resulting product is unacceptable, the process being applied or the materials being produced must be adjusted | improvement | the adjustment must be made **as soon as possible** to minimize further deviation |
= Transparency --enables--> Inspection --enables--> Adaptation
- Adaptation **becomes more difficult when the people involved are not empowered or self-managing**.
- A Scrum Team is expected to **adapt the moment it learns anything new** through inspection — not at the end of the project and not only at the Retrospective.
- IT example of all three: the Sprint Backlog shows that "integration with the bank API" has been blocked for three days (**transparency**); at the Daily Scrum the Developers see that the Sprint Goal is at risk (**inspection**); the same day they re-plan, pair up on the API and ask the Product Owner to drop a minor item (**adaptation**).
> Memory hook: **"see it → check it → fix it"**. Inspection without transparency = **misleading and wasteful**; inspection without adaptation = **pointless**.
@diagram pm7-pillars-values
## Figure 2: five values under three pillars
**Figure 2 "Scrum framework – Five values and Three pillars"** (an image) draws a temple: the roof says "The pillars of scrum", the three columns are **Transparency, Inspection, Adaptation**, and the base says "**Supported by the values:** Commitment, Courage, Focus, Openness, Respect". The message: the pillars stand on the values.
Successful use of Scrum depends on people **becoming more proficient in living five values**: **Commitment, Focus, Openness, Respect, and Courage**.
| Value | Slide wording | In an IT team |
|---|---|---|
| Commitment | the Scrum Team **commits to achieving its goals and to supporting each other** | a developer who finished early helps a colleague with tests so the Sprint Goal is met |
| Focus | their primary focus is **on the work of the Sprint** to make the best possible progress toward these goals | the team does not start side projects in the middle of the Sprint |
| Openness | the Scrum Team and its stakeholders are **open about the work and the challenges** | at the Review the team says that performance is still below target instead of hiding it |
| Respect | Scrum Team members **respect each other to be capable, independent people**, and are respected as such by the people with whom they work | a manager does not micromanage how the Developers write code |
| Courage | members have the courage **to do the right thing, to work on tough problems** | a tester refuses to call an item done while security tests fail, even under deadline pressure |
- These values **give direction** to the Scrum Team with regard to their **work, actions, and behavior**.
- The decisions that are made, the steps taken, and the way Scrum is used should **reinforce these values, not diminish or undermine them**.
- The Scrum Team members **learn and explore the values as they work with the Scrum events and artifacts**.
- When these values are embodied by the Scrum Team and the people they work with, the empirical Scrum pillars of transparency, inspection, and adaptation **come to life building trust**.
> Memory hook: **C-F-O-R-C** — Commitment, Focus, Openness, Respect, Courage (the slide's order). Values build trust; trust makes the pillars work.
> Exam trap: **transparency** is a pillar, **openness** is a value — do not mix them. **Simplicity, communication and feedback** are XP values (Lecture 6), not Scrum values; only **courage** and **respect** appear in both lists.
?? A team hides from stakeholders that a feature is late and keeps saying "we are on track". Which pillar and which value are broken?
?= Transparency (the pillar: the real state of the work is not visible to those receiving it) and Openness (the value: being open about the work and the challenges). Any inspection based on that false picture is misleading and wasteful.
?? At every Retrospective the team finds the same problem with slow code reviews but never changes anything. What does the Scrum Guide call this?
?= Inspection without adaptation, which is "considered pointless". Adaptation should happen as soon as possible; the most impactful improvements can even be added to the next Sprint Backlog.
?? Why can't a team prove "we do Scrum" by showing that it uses user stories and story points?
?= Because Scrum is purposefully incomplete: stories and points are optional practices, not part of the framework. Scrum is the accountabilities, events, artifacts and commitments, held together by the pillars and the values.
## Lecture 6 vs Lecture 7: the same Scrum, newer words
Lecture 6 (Griffiths, PMI-ACP) and Lecture 7 (Scrum Guide 2020) describe the same framework, but some words differ — and MCQ distractors are built from exactly these differences.
| Topic | Lecture 6 (older wording) | Lecture 7 (Scrum Guide 2020) |
|---|---|---|
| What Scrum is | "a lightweight, easy to understand model"; "a set of practices, roles, events, artifacts, and rules" | "a lightweight framework that helps people, teams and organizations generate value through adaptive solutions for complex problems" |
| Theory | three pillars of empirical process control | founded on **empiricism and lean thinking**; three pillars plus five values |
| People | roles: ScrumMaster, product owner, development team | three **accountabilities**: Scrum Master, Product Owner, **Developers** |
| Sprint length | "one or two-week"; the figure says "2–4 weeks" | fixed length, **one month or less** |
| Events | five activities, with backlog refinement as a meeting | five events: the **Sprint** (container) + 4 formal events; refinement is an **ongoing activity** |
> Exam trap: if a question uses Scrum Guide words ("accountable", "Developers", "timeboxed to a maximum of"), answer by Lecture 7. Each difference is explained again in Parts 2–4.
## Exam focus
- Definition word for word: **lightweight framework … people, teams and organizations … generate value … adaptive solutions for complex problems**.
- Nutshell: the **Scrum Master fosters an environment**; the Product Owner orders work into the Product Backlog; the Scrum Team turns a selection into an Increment during a Sprint; the team **and its stakeholders** inspect and adjust; repeat.
- Theory: **empiricism** (knowledge comes from experience; decisions based on what is observed) + **lean thinking** (reduces waste, focuses on the essentials).
- Iterative, incremental approach → **optimize predictability and control risk**.
- **Four formal events within a containing event, the Sprint** → five events; cadence for inspection = the five events.
- Pillars: transparency **enables** inspection; inspection **enables** adaptation; without transparency → misleading and wasteful; without adaptation → pointless; adjust **as soon as possible**; harder when people are **not empowered or self-managing**.
- Five values: **Commitment, Focus, Openness, Respect, Courage** → the pillars come to life → **trust**.
- Figure 1: frameworks (SAFe, Scrum, Crystal, Kanban, XP, FDD) vs practices (timeboxing, stories, daily stand-ups, frequent demos, TDD, information radiators, retrospectives, CI).`,
    ru: `## Где место Scrum: agile-фреймворки и практики (Figure 1)
Лекция открывается **рисунком 1 «Agile frameworks and practices»** (на слайде — картинка). На нём три уровня:
| Уровень | Что сказано на рисунке | Что перечислено |
|---|---|---|
| Agile Development (agile-разработка) | «общий термин, определяемый **ценностями и принципами** (values and principles)» | Agile Manifesto: 4 ценности и 12 принципов (лекция 6) |
| Agile Frameworks (agile-фреймворки) | целостные способы организовать работу | SAFe, Scrum, Crystal, Kanban, eXtreme Programming (XP), Feature-Driven Development |
| Practices (практики) | отдельные приёмы, которые команда может применять внутри фреймворка | Timeboxing, Stories, Daily Stand-Ups, Frequent demos, Test-Driven Development, Information radiators, Retrospectives, Continuous Integration |
- **Agile** сам по себе — не фреймворк и не метод, а зонтичный термин, определяемый ценностями и принципами.
- **Scrum** — один из agile-фреймворков. Лекция идёт по **Scrum Guide 2020** Кена Швабера и Джеффа Сазерленда («The Definitive Guide to Scrum: The Rules of the Game»).
- **Практики** — более мелкие кирпичики. Часть из них Scrum использует сам (таймбоксы, ретроспективы); другие команда может добавить (stories, TDD, непрерывная интеграция).
> Ловушка экзамена (Exam trap): на рисунке 1 **Kanban** и **SAFe** — фреймворки, а **Timeboxing, Stories, Daily Stand-Ups, Frequent demos, TDD, Information radiators, Retrospectives и Continuous Integration** — практики. «Agile» — общий термин, а не фреймворк.
## Определение Scrum
> **Scrum is a lightweight framework that helps people, teams and organizations generate value through adaptive solutions for complex problems.** — Scrum — это лёгкий фреймворк, который помогает людям, командам и организациям создавать ценность через адаптивные решения сложных задач.
| Ключевое слово | Что оно значит |
|---|---|
| lightweight (лёгкий) | минимум правил: 3 зоны ответственности, 5 событий, 3 артефакта — никакого толстого регламента |
| framework (фреймворк, каркас) | рамка, которую заполняют своими практиками, а не пошаговая методология |
| people, teams and organizations (люди, команды и организации) | Scrum работает на всех трёх уровнях, а не только внутри одной команды |
| generate value (создавать ценность) | цель — ценность для пользователей и бизнеса, а не объём работы или отработанные часы |
| adaptive solutions (адаптивные решения) | решение меняется по мере того, как команда узнаёт новое, а не фиксируется заранее |
| complex problems (сложные задачи) | неизвестного больше, чем известного: новый продукт, новая технология, меняющийся рынок |
**Если коротко (in a nutshell)**, Scrum требует, чтобы **Scrum Master создавал среду (foster an environment)**, в которой:
| Шаг | Формулировка слайда | Кто |
|---|---|---|
| 1 | Владелец продукта (Product Owner) упорядочивает работу над сложной задачей в бэклог продукта (Product Backlog). | Product Owner |
| 2 | Scrum-команда (Scrum Team) превращает выбранную часть работы в инкремент ценности (Increment) за время спринта (Sprint). | Scrum Team |
| 3 | Scrum-команда и её стейкхолдеры (stakeholders) проверяют результаты и корректируют курс на следующий спринт. | Scrum Team и стейкхолдеры |
| 4 | Повторить (Repeat) | все, спринт за спринтом |
- Пример из IT: команда делает приложение доставки еды. Product Owner упорядочивает работу (оплата картой, отслеживание заказа, промокоды…) в Product Backlog; за двухнедельный спринт команда превращает «оплату картой» в работающий проверенный инкремент; в конце показывает его ресторанам-партнёрам и корректирует план на следующий спринт; и так снова и снова.
> Ловушка экзамена: в «nutshell» Scrum Master **создаёт среду (fosters an environment)**. Он не упорядочивает работу (это Product Owner) и не строит инкремент в одиночку (это Scrum Team). В шаге 3 участвуют **стейкхолдеры**, а не только команда.
## Scrum прост — и намеренно неполон
- **Scrum прост (Scrum is simple).** Попробуйте его **как есть (as is)** и определите, помогают ли его философия, теория и структура достигать целей и создавать ценность.
- Фреймворк Scrum **намеренно неполон (purposefully incomplete)**: он определяет только те части, которые нужны для реализации теории Scrum.
- Scrum **достраивается коллективным интеллектом (collective intelligence)** людей, которые его используют.
- Вместо подробных инструкций **правила Scrum направляют отношения и взаимодействие людей (relationships and interactions)**.
- Внутри фреймворка можно применять **разные процессы, техники и методы**.
- Scrum **обёртывает существующие практики или делает их ненужными (wraps around existing practices or renders them unnecessary)**.
- Scrum **делает видимой сравнительную эффективность (relative efficacy)** текущего управления, среды и рабочих техник, чтобы их можно было улучшать.
> Ловушка экзамена: раз Scrum намеренно неполон, он **не** предписывает user stories, story points, диаграммы сгорания (burn-down), доски задач и TDD. Это дополнительные практики, которые команда может добавить. Вариант «Scrum требует user stories и story points» — неверный.
## Теория Scrum: эмпиризм и бережливое мышление
| Основа | Определение со слайда | На практике |
|---|---|---|
| Эмпиризм (Empiricism) | знание приходит из опыта, а решения принимаются на основе наблюдаемого (knowledge comes from experience and making decisions based on what is observed) | решать по реальным данным: что действительно готово (Done), что пользователи действительно сделали |
| Бережливое мышление (Lean thinking) | сокращает потери и фокусируется на главном (reduces waste and focuses on the essentials) | не делать функций, которые никому не нужны; убирать ожидания и передачи работы |
- Scrum использует **итеративный, инкрементный подход (iterative, incremental approach)**, чтобы **оптимизировать предсказуемость и контролировать риск (optimize predictability and control risk)**.
- *Итеративный* — работа повторяется циклами (спринтами), и каждый цикл учится на предыдущем; *инкрементный* — каждый цикл добавляет к уже существующему пригодный к использованию кусок (инкремент).
- Scrum объединяет людей, которые **вместе обладают всеми навыками и экспертизой** для работы и **делятся навыками или осваивают их по мере необходимости**.
- Scrum объединяет **четыре формальных события (four formal events)** для проверки и адаптации **внутри события-контейнера — спринта (a containing event, the Sprint)**.
- Эти события работают, потому что реализуют **эмпирические столпы Scrum: прозрачность, проверку и адаптацию (transparency, inspection, adaptation)**.
= Sprint (containing event) + Sprint Planning + Daily Scrum + Sprint Review + Sprint Retrospective = 5 events
> Ловушка экзамена: «четыре формальных события внутри события-контейнера» — это **пять событий** всего (на слайде Inspection сказано «its five events»). Вариант «в Scrum четыре события» или список с «Backlog Refinement» как событием не соответствует Guide 2020.
> Ловушка экзамена: итеративный инкрементный подход нужен, чтобы **оптимизировать предсказуемость и контролировать риск**, — не «чтобы устранить весь риск» и не «чтобы гарантировать фиксированный объём».
## Три столпа эмпиризма (three pillars)
| Столп | Что сказано на слайде | Что он делает возможным | Ключевая фраза |
|---|---|---|---|
| Прозрачность (Transparency) | возникающий процесс и работа должны быть видны и тем, кто работу выполняет, и тем, кто её получает; важные решения принимаются по воспринимаемому состоянию трёх формальных артефактов | проверку | низкая прозрачность → решения, которые снижают ценность и повышают риск; проверка без прозрачности **вводит в заблуждение и расточительна (misleading and wasteful)** |
| Проверка (Inspection) | артефакты Scrum и продвижение к согласованным целям нужно проверять часто и тщательно (frequently and diligently), чтобы выявлять потенциально нежелательные отклонения или проблемы; ритм (cadence) для проверки задают пять событий Scrum | адаптацию | проверка без адаптации считается **бессмысленной (pointless)**; события Scrum задуманы так, чтобы **провоцировать изменения (provoke change)** |
| Адаптация (Adaptation) | если какие-то аспекты процесса выходят за допустимые пределы или получившийся продукт неприемлем, применяемый процесс или создаваемые материалы нужно скорректировать | улучшение | корректировать нужно **как можно скорее (as soon as possible)**, чтобы свести к минимуму дальнейшее отклонение |
= Transparency --enables--> Inspection --enables--> Adaptation
- Адаптация **затрудняется, когда вовлечённые люди не наделены полномочиями или не самоуправляемы (not empowered or self-managing)**.
- От Scrum-команды ожидают, что она **адаптируется в тот момент, когда узнаёт что-то новое** через проверку, — а не в конце проекта и не только на ретроспективе.
- Пример всех трёх из IT: бэклог спринта показывает, что «интеграция с API банка» заблокирована уже три дня (**прозрачность**); на Daily Scrum разработчики видят, что цель спринта под угрозой (**проверка**); в тот же день они перепланируют, садятся в пару над API и просят Product Owner убрать мелкий элемент (**адаптация**).
> Зацепка (Memory hook): **«увидел → проверил → исправил»**. Проверка без прозрачности = **misleading and wasteful**; проверка без адаптации = **pointless**.
@diagram pm7-pillars-values
## Рисунок 2: пять ценностей под тремя столпами
**Рисунок 2 «Scrum framework – Five values and Three pillars»** (картинка) изображает храм: на крыше — «The pillars of scrum», три колонны — **Transparency, Inspection, Adaptation**, а на основании — «**Supported by the values:** Commitment, Courage, Focus, Openness, Respect». Смысл: столпы стоят на ценностях.
Успех Scrum зависит от того, насколько люди **научатся жить пятью ценностями (living five values)**: **приверженность (Commitment), фокус (Focus), открытость (Openness), уважение (Respect) и смелость (Courage)**.
| Ценность | Формулировка слайда | В IT-команде |
|---|---|---|
| Commitment (приверженность) | Scrum-команда **обязуется достигать своих целей и поддерживать друг друга** | разработчик, закончивший раньше, помогает коллеге с тестами, чтобы цель спринта была достигнута |
| Focus (фокус) | главный фокус — **на работе спринта**, чтобы как можно лучше продвинуться к этим целям | команда не начинает побочные проекты посреди спринта |
| Openness (открытость) | Scrum-команда и её стейкхолдеры **открыто говорят о работе и трудностях** | на Review команда говорит, что производительность ещё ниже цели, а не скрывает это |
| Respect (уважение) | члены команды **уважают друг друга как способных, самостоятельных людей (capable, independent people)**, и так же их уважают те, с кем они работают | менеджер не контролирует мелочно, как разработчики пишут код |
| Courage (смелость) | у членов команды хватает смелости **поступать правильно и браться за трудные задачи** | тестировщик отказывается считать элемент готовым, пока падают тесты безопасности, даже под давлением сроков |
- Эти ценности **задают направление** Scrum-команде в её **работе, действиях и поведении**.
- Принимаемые решения, предпринимаемые шаги и то, как используется Scrum, должны **укреплять эти ценности, а не ослаблять или подрывать их**.
- Члены Scrum-команды **изучают и осваивают ценности в работе с событиями и артефактами Scrum**.
- Когда эти ценности воплощены в Scrum-команде и в людях, с которыми она работает, эмпирические столпы — прозрачность, проверка и адаптация — **оживают и создают доверие (come to life building trust)**.
> Зацепка: **C-F-O-R-C** — Commitment, Focus, Openness, Respect, Courage (порядок слайда). Ценности создают доверие; доверие заставляет столпы работать.
> Ловушка экзамена: **прозрачность (transparency)** — столп, **открытость (openness)** — ценность, не путайте. **Simplicity, communication и feedback** — ценности XP (лекция 6), а не Scrum; в обоих списках есть только **courage** и **respect**.
?? Команда скрывает от стейкхолдеров, что функция опаздывает, и твердит «всё идёт по плану». Какой столп и какая ценность нарушены?
?= Прозрачность (столп: реальное состояние работы не видно тем, кто её получает) и открытость (ценность: открыто говорить о работе и трудностях). Любая проверка по такой ложной картине вводит в заблуждение и расточительна.
?? На каждой ретроспективе команда находит одну и ту же проблему с медленным код-ревью, но ничего не меняет. Как это называет Scrum Guide?
?= Проверка без адаптации, которая «считается бессмысленной (pointless)». Адаптировать нужно как можно скорее; самые важные улучшения можно даже добавить в бэклог следующего спринта.
?? Почему команда не может доказать «у нас Scrum», показав, что пользуется user stories и story points?
?= Потому что Scrum намеренно неполон: stories и points — необязательные практики, а не часть фреймворка. Scrum — это зоны ответственности, события, артефакты и обязательства, которые держатся на столпах и ценностях.
## Лекция 6 и лекция 7: тот же Scrum, новые слова
Лекция 6 (Griffiths, PMI-ACP) и лекция 7 (Scrum Guide 2020) описывают один и тот же фреймворк, но некоторые слова различаются — и неверные варианты в тестах строят именно из этих различий.
| Тема | Лекция 6 (старые формулировки) | Лекция 7 (Scrum Guide 2020) |
|---|---|---|
| Что такое Scrum | «a lightweight, easy to understand model»; «a set of practices, roles, events, artifacts, and rules» | «a lightweight framework that helps people, teams and organizations generate value through adaptive solutions for complex problems» |
| Теория | три столпа эмпирического управления процессом (empirical process control) | основан на **эмпиризме и бережливом мышлении**; три столпа и пять ценностей |
| Люди | роли (roles): ScrumMaster, product owner, development team | три **зоны ответственности (accountabilities)**: Scrum Master, Product Owner, **Developers** |
| Длина спринта | «one or two-week»; на рисунке «2–4 weeks» | фиксированная длина, **один месяц или меньше** |
| События | пять активностей, среди них уточнение бэклога как встреча | пять событий: **спринт** (контейнер) + 4 формальных; уточнение (refinement) — **непрерывная деятельность (ongoing activity)** |
> Ловушка экзамена: если в вопросе слова из Scrum Guide («accountable», «Developers», «timeboxed to a maximum of»), отвечайте по лекции 7. Каждое различие ещё раз разобрано в частях 2–4.
## Что спросят на экзамене (Exam focus)
- Определение дословно: **lightweight framework … people, teams and organizations … generate value … adaptive solutions for complex problems**.
- Nutshell: **Scrum Master создаёт среду**; Product Owner упорядочивает работу в Product Backlog; Scrum Team превращает выбранное в инкремент за спринт; команда **и её стейкхолдеры** проверяют и корректируют; повторить.
- Теория: **эмпиризм** (знание из опыта; решения по наблюдаемому) + **бережливое мышление** (сокращает потери, фокус на главном).
- Итеративный инкрементный подход → **оптимизировать предсказуемость и контролировать риск**.
- **Четыре формальных события внутри события-контейнера — спринта** → пять событий; ритм для проверки = пять событий.
- Столпы: прозрачность **делает возможной** проверку; проверка **делает возможной** адаптацию; без прозрачности → misleading and wasteful; без адаптации → pointless; корректировать **как можно скорее**; труднее, когда люди **не наделены полномочиями или не самоуправляемы**.
- Пять ценностей: **Commitment, Focus, Openness, Respect, Courage** → столпы оживают → **доверие (trust)**.
- Рисунок 1: фреймворки (SAFe, Scrum, Crystal, Kanban, XP, FDD) и практики (timeboxing, stories, daily stand-ups, frequent demos, TDD, information radiators, retrospectives, CI).`,
  },
  [
    qx("According to the Scrum Guide 2020, Scrum is a lightweight framework that helps people, teams and organizations generate value through what?", "Adaptive solutions for complex problems", [
      ["Detailed plans for predictable problems", "Detailed upfront plans fit predictable work; Scrum is meant for complex problems where the solution has to adapt as the team learns.", "Подробные планы заранее подходят для предсказуемой работы; Scrum рассчитан на сложные задачи, где решение должно меняться по мере того, как команда узнаёт новое."],
      ["Standard processes for repeatable work", "Repeatable work with known steps is the territory of defined, prescriptive processes; Scrum is deliberately lightweight and purposefully incomplete.", "Повторяемая работа с известными шагами — территория определённых, предписывающих процессов; Scrum намеренно лёгкий и намеренно неполный."],
      ["Fixed-scope releases for simple products", "Scrum does not fix the scope upfront, and the definition speaks of complex, not simple, problems.", "Scrum не фиксирует объём заранее, а в определении речь идёт о сложных, а не простых задачах."],
    ], "Word for word: \"Scrum is a lightweight framework that helps people, teams and organizations generate value through adaptive solutions for complex problems.\"", "Дословно: «Scrum is a lightweight framework that helps people, teams and organizations generate value through adaptive solutions for complex problems» — ценность создаётся через адаптивные решения сложных задач."),
    qx("In the \"Scrum in a nutshell\" description, what is the Scrum Master required to do?", "Foster an environment where the steps can happen", [
      ["Order the work for a complex problem into a backlog", "Ordering the work into the Product Backlog is step 1 and belongs to the Product Owner.", "Упорядочивать работу в Product Backlog — шаг 1, и это дело Product Owner."],
      ["Turn a selection of the work into an Increment", "Turning the selected work into an Increment of value is step 2 — the Scrum Team does it during a Sprint.", "Превращать выбранную работу в инкремент — шаг 2, его выполняет Scrum Team за спринт."],
      ["Inspect the results and adjust for the next Sprint", "Inspecting results and adjusting is step 3, done by the Scrum Team and its stakeholders, not by the Scrum Master alone.", "Проверять результаты и корректировать курс — шаг 3, его выполняют Scrum Team и стейкхолдеры, а не Scrum Master в одиночку."],
    ], "\"In a nutshell, Scrum requires a Scrum Master to foster an environment where\" the PO orders the work, the team builds an Increment, the team and stakeholders inspect and adjust, and the cycle repeats.", "«In a nutshell, Scrum requires a Scrum Master to foster an environment where…» — Scrum Master создаёт среду, в которой PO упорядочивает работу, команда делает инкремент, команда со стейкхолдерами проверяет и корректирует, и цикл повторяется."),
    qx("Empiricism, one of the foundations of Scrum, asserts that knowledge comes from:", "experience and making decisions based on what is observed", [
      ["detailed analysis and planning completed before any work starts", "Upfront analysis is the predictive approach that empiricism opposes: in complex work, only what has already happened can guide decisions.", "Анализ заранее — это предиктивный подход, которому эмпиризм противостоит: в сложной работе решения может направлять только то, что уже произошло."],
      ["expert judgment and proven industry best practices", "Expert opinion is not observation of your own work; Scrum says knowledge comes from experience.", "Мнение экспертов — не наблюдение за собственной работой; Scrum говорит, что знание приходит из опыта."],
      ["reducing waste and focusing only on the essentials", "This is lean thinking — the second foundation of Scrum, not the definition of empiricism.", "Это бережливое мышление (lean thinking) — вторая основа Scrum, а не определение эмпиризма."],
    ], "\"Empiricism asserts that knowledge comes from experience and making decisions based on what is observed.\"", "«Empiricism asserts that knowledge comes from experience and making decisions based on what is observed» — знание из опыта, решения по наблюдаемому."),
    qx("In Scrum theory, what does lean thinking do?", "Reduces waste and focuses on the essentials", [
      ["Bases decisions on experience and observation", "That is empiricism, the other foundation of Scrum.", "Это эмпиризм — другая основа Scrum."],
      ["Optimizes predictability and controls risk", "That is the purpose of Scrum's iterative, incremental approach, not of lean thinking.", "Это цель итеративного инкрементного подхода Scrum, а не бережливого мышления."],
      ["Makes the work visible to those receiving it", "Visibility of the process and the work is the pillar of transparency.", "Видимость процесса и работы — это столп прозрачности (transparency)."],
    ], "\"Scrum is founded on empiricism and lean thinking… Lean thinking reduces waste and focuses on the essentials.\"", "«Scrum is founded on empiricism and lean thinking… Lean thinking reduces waste and focuses on the essentials» — сокращает потери и фокусируется на главном."),
    qx("Scrum employs an iterative, incremental approach for which purpose?", "To optimize predictability and to control risk", [
      ["To eliminate risk by fixing the scope early", "Scrum never claims to eliminate risk, and it does not fix the scope upfront — it controls risk by inspecting often.", "Scrum не обещает устранить риск и не фиксирует объём заранее — он контролирует риск частой проверкой."],
      ["To maximize the utilization of every developer", "Resource utilization is not the goal; the slide names predictability and risk control.", "Загрузка ресурсов — не цель; на слайде названы предсказуемость и контроль риска."],
      ["To reduce documentation and the number of meetings", "Events do minimize other meetings, but that is not why the approach is iterative and incremental.", "События действительно сокращают прочие встречи, но итеративный инкрементный подход нужен не для этого."],
    ], "\"Scrum employs an iterative, incremental approach to optimize predictability and to control risk.\"", "«Scrum employs an iterative, incremental approach to optimize predictability and to control risk» — оптимизировать предсказуемость и контролировать риск."),
    qx("How does the Scrum Guide describe the structure of the Scrum events?", "Four formal events within a containing event, the Sprint", [
      ["Five formal events, one of which is the Backlog Refinement meeting", "Refinement is an ongoing activity in the 2020 Guide, not an event; the fifth event is the Sprint itself.", "В Guide 2020 уточнение бэклога — непрерывная деятельность, а не событие; пятое событие — сам спринт."],
      ["Four independent meetings held in any order", "They are not independent: they happen inside the Sprint, Planning starts it, the Review is second to last and the Retrospective concludes it.", "Они не независимы: всё происходит внутри спринта, Planning его начинает, Review — предпоследнее событие, Retrospective — завершает."],
      ["Three formal events plus two optional workshops", "Scrum has no optional workshops; failure to hold any event as prescribed loses an opportunity to inspect and adapt.", "Необязательных воркшопов в Scrum нет; пропуск любого события лишает возможности проверки и адаптации."],
    ], "\"Scrum combines four formal events for inspection and adaptation within a containing event, the Sprint\" — five events in total.", "«Scrum combines four formal events for inspection and adaptation within a containing event, the Sprint» — всего пять событий."),
    qx("Complete the Scrum Guide statements: \"Inspection without transparency is ___; inspection without adaptation is ___.\"", "misleading and wasteful; pointless", [
      ["pointless; misleading and wasteful", "The two phrases are swapped: \"pointless\" describes inspection that changes nothing (no adaptation).", "Фразы переставлены: «pointless» — это проверка, после которой ничего не меняется (нет адаптации)."],
      ["acceptable; misleading and wasteful", "Inspection without transparency is never acceptable — you would be checking a false picture.", "Проверка без прозрачности никогда не допустима — вы проверяете ложную картину."],
      ["misleading and wasteful; acceptable", "Inspection without adaptation is not acceptable: the Guide calls it pointless, since events are designed to provoke change.", "Проверка без адаптации недопустима: Guide называет её бессмысленной, ведь события задуманы, чтобы провоцировать изменения."],
    ], "Transparency slide: \"Inspection without transparency is misleading and wasteful.\" Inspection slide: \"Inspection without adaptation is considered pointless.\"", "Слайд Transparency: «Inspection without transparency is misleading and wasteful». Слайд Inspection: «Inspection without adaptation is considered pointless»."),
    qx("Inspection shows that a process has deviated outside acceptable limits. According to the Scrum Guide, when must the adjustment be made?", "As soon as possible, to minimize further deviation", [
      ["Only at the next Sprint Retrospective, not before", "The team is expected to adapt the moment it learns anything new, not wait for a particular event.", "От команды ждут адаптации в тот момент, когда она узнала новое, а не ожидания определённого события."],
      ["At the end of the release, after all testing is done", "Waiting until the release lets the deviation grow — the opposite of the slide's rule.", "Ожидание до релиза даёт отклонению расти — прямо противоположно правилу слайда."],
      ["After a formal change request has been approved", "Change control boards belong to predictive projects; Scrum relies on empowered, self-managing people adjusting quickly.", "Советы по изменениям — из предиктивных проектов; Scrum опирается на самоуправляемых людей с полномочиями, которые корректируют быстро."],
    ], "Adaptation slide: \"The adjustment must be made as soon as possible to minimize further deviation.\"", "Слайд Adaptation: «The adjustment must be made as soon as possible to minimize further deviation» — как можно скорее."),
    qx("According to the Scrum Guide, adaptation becomes more difficult when:", "the people involved are not empowered or self-managing", [
      ["the Sprints are shorter than one full calendar month", "Shorter Sprints give more learning cycles and make adaptation easier, not harder.", "Короткие спринты дают больше циклов обучения и облегчают адаптацию, а не затрудняют."],
      ["the team adds practices taken from other agile frameworks", "Scrum explicitly allows various processes, techniques and methods within the framework.", "Scrum прямо допускает разные процессы, техники и методы внутри фреймворка."],
      ["the stakeholders are invited to attend the Sprint Review", "Stakeholders are supposed to attend the Review; their feedback feeds adaptation.", "Стейкхолдеры как раз должны быть на Review; их отзывы питают адаптацию."],
    ], "\"Adaptation becomes more difficult when the people involved are not empowered or self-managing.\"", "«Adaptation becomes more difficult when the people involved are not empowered or self-managing» — когда у людей нет полномочий или они не самоуправляемы."),
    qx("To help with inspection, Scrum provides cadence in the form of:", "its five events", [
      ["its three artifacts", "Artifacts are what gets inspected; the cadence (rhythm) of inspection comes from the events.", "Артефакты — это то, что проверяют; ритм проверки задают события."],
      ["its five values", "The values give direction to behaviour; they do not set a rhythm of inspection.", "Ценности направляют поведение; ритм проверки они не задают."],
      ["its three pillars", "Inspection is itself one of the three pillars; the cadence for it is provided by the events.", "Проверка сама является одним из трёх столпов; ритм для неё дают события."],
    ], "Inspection slide: \"To help with inspection, Scrum provides cadence in the form of its five events.\"", "Слайд Inspection: «To help with inspection, Scrum provides cadence in the form of its five events» — ритм дают пять событий."),
    qx("Which of the following is NOT one of the five Scrum values?", "Simplicity", [
      ["Commitment", "Commitment is a Scrum value: the team commits to achieving its goals and to supporting each other.", "Приверженность — ценность Scrum: команда обязуется достигать целей и поддерживать друг друга."],
      ["Openness", "Openness is a Scrum value: the team and its stakeholders are open about the work and the challenges.", "Открытость — ценность Scrum: команда и стейкхолдеры открыто говорят о работе и трудностях."],
      ["Respect", "Respect is a Scrum value: members respect each other as capable, independent people.", "Уважение — ценность Scrum: члены команды уважают друг друга как способных, самостоятельных людей."],
    ], "The five Scrum values are Commitment, Focus, Openness, Respect and Courage. Simplicity is an XP value (and an agile principle), not a Scrum value.", "Пять ценностей Scrum: Commitment, Focus, Openness, Respect, Courage. Simplicity — ценность XP (и принцип agile), но не Scrum."),
    qx("According to the Scrum Guide, Scrum Team members respect each other to be:", "capable, independent people", [
      ["experts in one specialty", "Scrum Teams are cross-functional; respect is about capability and independence, not narrow specialization.", "Scrum-команды кросс-функциональны; уважение — о способности и самостоятельности, а не об узкой специализации."],
      ["equal in rank, role and salary", "The value says nothing about rank or pay; it is about seeing each other as capable and independent.", "Ценность ничего не говорит о должностях и зарплатах; речь о том, чтобы видеть друг в друге способных и самостоятельных людей."],
      ["loyal to the Product Owner", "Loyalty to one person is not a Scrum value; the PO's decisions are respected, but that is a different statement.", "Лояльность одному человеку — не ценность Scrum; решения PO уважают, но это другое утверждение."],
    ], "\"Scrum Team members respect each other to be capable, independent people, and are respected as such by the people with whom they work.\"", "«Scrum Team members respect each other to be capable, independent people, and are respected as such by the people with whom they work» — способные, самостоятельные люди."),
    qx("Under deadline pressure, a tester refuses to mark a story as done because the security tests still fail. Which Scrum value does this show most directly?", "Courage", [
      ["Focus", "Focus means concentrating on the work of the Sprint; the key point here is doing the right thing under pressure.", "Фокус — это сосредоточенность на работе спринта; здесь же главное — поступить правильно под давлением."],
      ["Openness", "Openness is about being open regarding the work and the challenges; the act here is standing firm on quality.", "Открытость — открыто говорить о работе и трудностях; здесь же поступок — твёрдо стоять на качестве."],
      ["Commitment", "Commitment is about achieving goals and supporting each other; refusing to cut corners is the courage to do the right thing.", "Приверженность — достигать целей и поддерживать друг друга; отказ срезать углы — это смелость поступить правильно."],
    ], "\"The Scrum Team members have the courage to do the right thing, to work on tough problems.\" Refusing to call failing work done is exactly that.", "«The Scrum Team members have the courage to do the right thing, to work on tough problems» — отказаться назвать незавершённую работу готовой — это именно смелость."),
    qx("According to the Scrum Guide, what happens when the Scrum values are embodied by the Scrum Team and the people they work with?", "The pillars come to life, building trust", [
      ["The Scrum Master role is no longer needed", "Living the values does not remove any accountability; the Scrum Master remains accountable for the team's effectiveness.", "Жизнь по ценностям не отменяет ни одной зоны ответственности; Scrum Master по-прежнему отвечает за эффективность команды."],
      ["The events can be shortened or skipped", "Skipping events loses opportunities to inspect and adapt, whatever the values.", "Пропуск событий лишает возможностей проверки и адаптации, какими бы ни были ценности."],
      ["The Definition of Done becomes optional", "The Definition of Done is the commitment of the Increment and is always required.", "Definition of Done — обязательство инкремента, и оно обязательно всегда."],
    ], "\"When these values are embodied by the Scrum Team and the people they work with, the empirical Scrum pillars of transparency, inspection, and adaptation come to life building trust.\"", "«When these values are embodied… the empirical Scrum pillars of transparency, inspection, and adaptation come to life building trust» — столпы оживают и создают доверие."),
    qx("Why does the Scrum Guide call the Scrum framework \"purposefully incomplete\"?", "It defines only the parts required to implement Scrum theory", [
      ["It is an early draft that each new version of the Guide completes", "\"Purposefully\" means by design, not unfinished; the gaps are left for the team's own practices.", "«Purposefully» — значит намеренно, а не «недописан»; пробелы оставлены для собственных практик команды."],
      ["It lets each team decide which accountabilities to keep", "The accountabilities, events and artifacts are the required parts; what is left open is the practices around them.", "Зоны ответственности, события и артефакты — как раз обязательные части; открытыми оставлены практики вокруг них."],
      ["It applies only to software, not to other domains", "The Guide speaks of complex problems in general; incompleteness is about rules, not domains.", "Guide говорит о сложных задачах вообще; неполнота касается правил, а не областей применения."],
    ], "\"The Scrum framework is purposefully incomplete, only defining the parts required to implement Scrum theory. Scrum is built upon by the collective intelligence of the people using it.\"", "«The Scrum framework is purposefully incomplete, only defining the parts required to implement Scrum theory» — определены только части, нужные для теории; остальное достраивает коллективный интеллект."),
    qx("In Figure 1 \"Agile frameworks and practices\", which item is shown as a practice rather than a framework?", "Test-Driven Development", [
      ["Feature-Driven Development", "FDD is listed in the Agile Frameworks band, next to XP.", "FDD стоит в полосе Agile Frameworks рядом с XP."],
      ["Kanban", "Kanban is listed among the Agile Frameworks, next to Crystal.", "Kanban указан среди Agile Frameworks рядом с Crystal."],
      ["Crystal", "Crystal is listed among the Agile Frameworks (a family of methods, Lecture 6).", "Crystal указан среди Agile Frameworks (семейство методов, лекция 6)."],
    ], "Figure 1 practices: Timeboxing, Stories, Daily Stand-Ups, Frequent demos, Test-Driven Development, Information radiators, Retrospectives, Continuous Integration.", "Практики на рисунке 1: Timeboxing, Stories, Daily Stand-Ups, Frequent demos, Test-Driven Development, Information radiators, Retrospectives, Continuous Integration."),
    qx("In Figure 1, how is \"Agile Development\" described?", "A general term defined by values and principles", [
      ["A framework with fixed roles, events and artifacts", "That describes a framework such as Scrum, which sits one level below agile in the figure.", "Это описание фреймворка вроде Scrum, который на рисунке стоит на уровень ниже agile."],
      ["A set of practices such as TDD and daily stand-ups", "Practices are the bottom band of the figure; agile is the umbrella above them.", "Практики — нижняя полоса рисунка; agile — зонтик над ними."],
      ["A method for scaling Scrum to many teams", "Scaling is what SAFe does; SAFe is listed as one of the frameworks.", "Масштабированием занимается SAFe; он указан как один из фреймворков."],
    ], "The figure: \"Agile Development — a general term defined by values and principles\", with frameworks and practices below it.", "На рисунке: «Agile Development — a general term defined by values and principles», а под ним фреймворки и практики."),
    qx("A manager promises customers a release date using a Sprint Backlog that the Developers stopped updating a week ago. What risk does the Scrum Guide point out?", "Decisions that diminish value and increase risk", [
      ["Inspection that is pointless but otherwise harmless", "\"Pointless\" describes inspection without adaptation; inspection of stale data is misleading and harmful.", "«Pointless» — про проверку без адаптации; проверка устаревших данных вводит в заблуждение и вредна."],
      ["A Sprint that the Scrum Master must cancel at once", "Only the Product Owner can cancel a Sprint, and only when the Sprint Goal becomes obsolete.", "Отменить спринт может только Product Owner и только если цель спринта устарела."],
      ["Lower team velocity in the following Sprints", "Velocity is not mentioned; the issue is low transparency behind a business decision.", "О скорости команды речь не идёт; проблема — низкая прозрачность за бизнес-решением."],
    ], "Transparency slide: \"Artifacts that have low transparency can lead to decisions that diminish value and increase risk.\"", "Слайд Transparency: «Artifacts that have low transparency can lead to decisions that diminish value and increase risk» — решения, снижающие ценность и повышающие риск."),
    tfx("According to the Scrum Guide, Scrum wraps around existing practices or renders them unnecessary.", true,
      "Word for word from the slide: \"Various processes, techniques and methods can be employed within the framework. Scrum wraps around existing practices or renders them unnecessary.\"",
      "Дословно со слайда: «Various processes, techniques and methods can be employed within the framework. Scrum wraps around existing practices or renders them unnecessary».",
      "\"False\" would mean Scrum demands replacing every existing practice; in fact it lets them run inside the framework and makes their efficacy visible.",
      "«Неверно» означало бы, что Scrum требует заменить все существующие практики; на деле он даёт им работать внутри фреймворка и делает видимой их эффективность."),
    tfx("A Scrum Team is expected to adapt only at the Sprint Retrospective, once the Sprint is over.", false,
      "\"A Scrum Team is expected to adapt the moment it learns anything new through inspection\", and the adjustment must be made as soon as possible.",
      "«A Scrum Team is expected to adapt the moment it learns anything new through inspection», и корректировать нужно как можно скорее.",
      "\"True\" confuses one event for adaptation with the only moment for it; every event, including the Daily Scrum, is an opportunity to adapt.",
      "«Верно» путает одно из событий адаптации с единственным моментом для неё; любое событие, включая Daily Scrum, — возможность адаптироваться."),
  ],
);

const p2 = part(
  "pm-l7-p2",
  { en: "The Scrum Team: Developers, Product Owner, Scrum Master", ru: "Scrum-команда: Developers, Product Owner, Scrum Master" },
  {
    en: `## The Scrum Team: one unit, no hierarchy
> The fundamental unit of Scrum is a small team of people, a **Scrum Team**. The Scrum Team consists of **one Scrum Master, one Product Owner, and Developers**.
- Within a Scrum Team, there are **no sub-teams or hierarchies**.
- It is a **cohesive unit of professionals focused on one objective at a time, the Product Goal**.
| Term | Slide definition | What it rules out |
|---|---|---|
| Cross-functional | the members have all the skills necessary to create value each Sprint | waiting for a separate QA department or DBA team to finish the work |
| Self-managing | they internally decide who does what, when, and how | a manager outside the team assigning tasks to each person |
> Exam trap: the 2020 Guide says **self-managing** ("who does what, when, and how"). Lecture 6 and older Guides say **self-organizing** development team. If the options quote the slide definition, choose self-managing. And there is **no "lead developer" or "testing sub-team"** inside a Scrum Team.
## Size of the Scrum Team
- The Scrum Team is small enough to remain **nimble** and large enough to complete **significant work within a Sprint**, typically **10 or fewer people**.
- In general, **smaller teams communicate better and are more productive**.
- If Scrum Teams become too large, they should consider **reorganizing into multiple cohesive Scrum Teams, each focused on the same product**.
- Therefore, they should **share the same Product Goal, Product Backlog, and Product Owner**.
| Several Scrum Teams on one product | Shared or separate? |
|---|---|
| Product Goal | shared — one goal |
| Product Backlog | shared — one backlog |
| Product Owner | shared — one person |
| Definition of Done | shared — they must mutually define and comply with the same DoD (Part 4) |
| Developers and Sprint Backlog | each team has its own |
- IT example: a fintech startup grows to 16 people on one mobile banking app. Instead of one 16-person team with a "frontend sub-team" and a "backend sub-team", it forms two cross-functional Scrum Teams of 8. Both work from the same Product Backlog, toward the same Product Goal, with the same Product Owner.
= 16 people > 10 → 2 Scrum Teams × 8 people; shared: 1 Product Goal, 1 Product Backlog, 1 Product Owner
> Exam trap: "10 or fewer" counts the **whole Scrum Team** (Scrum Master and Product Owner included), and it says "typically" — it is guidance, not a hard limit. Older sources give "3 to 9 developers"; the 2020 slide says 10 or fewer people. Splitting one product into teams with **separate** Product Owners or backlogs is wrong.
## What the Scrum Team does
- The Scrum Team is **responsible for all product-related activities**: stakeholder collaboration, verification, maintenance, operation, experimentation, research and development, and anything else that might be required.
- They are **structured and empowered by the organization to manage their own work**.
- Working in Sprints **at a sustainable pace** improves the Scrum Team's **focus and consistency**.
- **The entire Scrum Team is accountable for creating a valuable, useful Increment every Sprint.**
- Scrum defines **three specific accountabilities** within the Scrum Team: **the Developers, the Product Owner, and the Scrum Master**.
> Exam trap: the 2020 Guide speaks of **accountabilities**, not "roles" (Lecture 6 says roles). It is **Developers**, not "Development Team", and **Scrum Master** in two words, not "ScrumMaster". The valuable, useful Increment is the accountability of the **entire Scrum Team**, not of the Developers alone.
## Accountable vs responsible
These two words sit behind many MCQ questions on this lecture.
| | Accountable | Responsible |
|---|---|---|
| Meaning | answers for the outcome — "the buck stops here" | does the work |
| Can it be delegated? | no — the accountability stays | yes — the work can be handed to others |
| Slide example | "the Product Owner remains accountable" | "may delegate the responsibility to others" |
- So a Product Owner may let a business analyst write Product Backlog items, but if the backlog is unclear, the Product Owner answers for it.
- The slides also use "responsible" for the Scrum Team ("responsible for all product-related activities") and, in Part 4, for the Developers ("responsible for the sizing").
## Developers
> **Developers** are the people in the Scrum Team that are **committed to creating any aspect of a usable Increment each Sprint**.
- The specific skills needed by the Developers are **often broad and will vary with the domain of work**: programmers, testers, designers, analysts and DevOps engineers are all Developers if they create part of the Increment.
- However, the Developers are **always accountable for**:
| # | Developers are accountable for | IT example |
|---|---|---|
| 1 | Creating a plan for the Sprint, the Sprint Backlog | at Sprint Planning they split "card payment" into tasks of a day or less |
| 2 | Instilling quality by adhering to a Definition of Done | no story is done without code review, tests and deployment to staging |
| 3 | Adapting their plan each day toward the Sprint Goal | after the Daily Scrum two developers switch to the blocked API task |
| 4 | Holding each other accountable as professionals | a developer reminds a teammate that untested code does not meet the DoD |
> Memory hook: **Plan – Quality – Adapt – Hold** (the Sprint Backlog, the DoD, daily adaptation, each other).
## Product Owner
> The Product Owner is **accountable for maximizing the value of the product resulting from the work of the Scrum Team**. How this is done may vary widely across organizations, Scrum Teams, and individuals.
The Product Owner is also accountable for **effective Product Backlog management**, which includes:
| # | Product Backlog management | IT example |
|---|---|---|
| 1 | Developing and explicitly communicating the Product Goal | "By June, 30% of orders are paid inside the app" |
| 2 | Creating and clearly communicating Product Backlog items | writing a clear item for "refund to card" with examples |
| 3 | Ordering Product Backlog items | moving "Apple Pay" above "dark mode" because it brings more revenue |
| 4 | Ensuring that the Product Backlog is transparent, visible and understood | the backlog is open to the whole team and to stakeholders |
- The Product Owner **may do the above work or may delegate the responsibility to others. Regardless, the Product Owner remains accountable.**
- For Product Owners to succeed, **the entire organization must respect their decisions**. These decisions are visible **in the content and ordering of the Product Backlog**, and **through the inspectable Increment at the Sprint Review**.
- **The Product Owner is one person, not a committee.** The Product Owner may **represent the needs of many stakeholders** in the Product Backlog.
- **Those wanting to change the Product Backlog can do so by trying to convince the Product Owner.**
> Exam trap: the slide says **"ordering"**, not "prioritizing" — the backlog is ordered. A CEO, a sales director or the Developers do **not** reorder the backlog themselves: they try to **convince the Product Owner**. A "steering committee acting as Product Owner" breaks the rule "one person, not a committee".
## Scrum Master
> The Scrum Master is **accountable for establishing Scrum as defined in the Scrum Guide**. They do this by helping everyone understand Scrum theory and practice, both within the Scrum Team and the organization.
> The Scrum Master is **accountable for the Scrum Team's effectiveness**. They do this by enabling the Scrum Team to improve its practices, within the Scrum framework.
- Scrum Masters are **true leaders who serve the Scrum Team and the larger organization**.
| Serves | How (four ways each, from the slides) |
|---|---|
| the Scrum Team | coaching the team members in self-management and cross-functionality; helping the Scrum Team focus on creating high-value Increments that meet the Definition of Done; causing the removal of impediments to the Scrum Team's progress; ensuring that all Scrum events take place and are positive, productive, and kept within the timebox |
| the Product Owner | helping find techniques for effective Product Goal definition and Product Backlog management; helping the Scrum Team understand the need for clear and concise Product Backlog items; helping establish empirical product planning for a complex environment; facilitating stakeholder collaboration as requested or needed |
| the organization | leading, training, and coaching the organization in its Scrum adoption; planning and advising Scrum implementations within the organization; helping employees and stakeholders understand and enact an empirical approach for complex work; removing barriers between stakeholders and Scrum Teams |
> Exam trap: the Scrum Master **causes the removal** of impediments (not necessarily removing each one personally) and **ensures that events take place** within the timebox — that does not mean running the Daily Scrum, which is for the Developers. The Scrum Master does not assign tasks, does not order the backlog and is not the team's manager. Lecture 6 says "servant leader"; the 2020 Guide says "true leaders who serve".
> Exam trap: check whom each service is for. "Facilitating stakeholder collaboration" → the **Product Owner**; "removing barriers between stakeholders and Scrum Teams" → the **organization**; "causing the removal of impediments" → the **Scrum Team**.
## Who is accountable for what — summary
| Question | Answer by the Scrum Guide 2020 |
|---|---|
| Creating a valuable, useful Increment every Sprint | the entire Scrum Team |
| Maximizing the value of the product | Product Owner |
| The Product Goal and the ordering of the Product Backlog | Product Owner |
| Creating the plan for the Sprint (Sprint Backlog) | Developers |
| Instilling quality by adhering to the Definition of Done | Developers |
| Deciding how to turn Product Backlog items into an Increment | Developers only |
| Establishing Scrum as defined in the Scrum Guide | Scrum Master |
| The Scrum Team's effectiveness | Scrum Master |
| Cancelling a Sprint | only the Product Owner |
| Defining the Sprint Goal | the whole Scrum Team (the Product Owner proposes the value) |
| Sizing Product Backlog items | the Developers who will do the work |
## Cases: who should act?
- **The sales director wants a feature moved to the top of the backlog.** → She must convince the **Product Owner**; neither she nor the Developers reorder it directly.
- **The PO is overloaded and asks a business analyst to write the detailed items.** → Allowed: the responsibility is delegated, but the **Product Owner remains accountable**.
- **Management proposes a "product board" of three directors as the Product Owner.** → Not Scrum: the Product Owner is **one person, not a committee**; the directors can be stakeholders whose needs the PO represents.
- **A senior developer starts assigning tasks to the others.** → It conflicts with self-management (the team internally decides who does what) and with "no sub-teams or hierarchies".
- **Every Sprint the team waits two weeks for a separate DBA department.** → The team is not cross-functional. The Scrum Master coaches cross-functionality, causes the removal of the impediment and, serving the organization, removes barriers between stakeholders and Scrum Teams.
- **A Developer keeps skipping tests to look fast.** → The Developers hold each other accountable as professionals; quality is instilled by adhering to the Definition of Done.
?? Three Scrum Teams build one e-commerce platform. Which three things does the Scrum Team slide say they should share?
?= The same Product Goal, the same Product Backlog and the same Product Owner (and, from the Definition of Done slide, the same DoD).
?? May the Product Owner delegate the writing of Product Backlog items? What does not change?
?= Yes: the PO "may do the above work or may delegate the responsibility to others". What does not change is accountability — the Product Owner remains accountable.
?? Name the two things the Scrum Master is accountable for.
?= Establishing Scrum as defined in the Scrum Guide (helping everyone understand Scrum theory and practice) and the Scrum Team's effectiveness (enabling the team to improve its practices within the Scrum framework).
## Exam focus
- Scrum Team = **one Scrum Master, one Product Owner, and Developers**; **no sub-teams or hierarchies**; focused on **one objective at a time, the Product Goal**.
- **Cross-functional** = all the skills necessary to create value each Sprint; **self-managing** = internally decide **who does what, when, and how**.
- **Typically 10 or fewer people**; too large → several cohesive teams sharing **the Product Goal, Product Backlog and Product Owner**.
- The **entire Scrum Team** is accountable for a **valuable, useful Increment every Sprint**; three **accountabilities**: Developers, Product Owner, Scrum Master.
- Developers — four: **the Sprint Backlog; quality by adhering to the DoD; adapting the plan each day toward the Sprint Goal; holding each other accountable as professionals**.
- Product Owner — **maximizing the value of the product**; backlog management — four: **develop and communicate the Product Goal; create and communicate PBIs; order PBIs; keep the backlog transparent, visible and understood**; may delegate but **remains accountable**; **one person, not a committee**; to change the backlog — **convince the PO**.
- Scrum Master — accountable for **establishing Scrum** and for **the Scrum Team's effectiveness**; **true leaders who serve**; four services each to the team, the Product Owner and the organization.`,
    ru: `## Scrum-команда: единое целое без иерархии
> Базовая единица Scrum — небольшая команда людей, **Scrum-команда (Scrum Team)**. Она состоит из **одного Scrum Master, одного Product Owner и разработчиков (Developers)**.
- Внутри Scrum-команды **нет подкоманд и иерархий (no sub-teams or hierarchies)**.
- Это **сплочённая группа профессионалов, сфокусированная на одной цели в каждый момент времени — цели продукта (Product Goal)**.
| Термин | Определение со слайда | Что он исключает |
|---|---|---|
| Кросс-функциональная (cross-functional) | у членов команды есть все навыки, необходимые, чтобы создавать ценность в каждом спринте | ожидание отдельного отдела тестирования или команды администраторов БД, чтобы доделать работу |
| Самоуправляемая (self-managing) | они сами внутри команды решают, кто что делает, когда и как (who does what, when, and how) | менеджер вне команды раздаёт задачи каждому |
> Ловушка экзамена (Exam trap): в Guide 2020 сказано **self-managing** («who does what, when, and how»). В лекции 6 и старых версиях Guide — **self-organizing** development team. Если в вариантах цитата определения со слайда, выбирайте self-managing. И внутри Scrum-команды **нет «ведущего разработчика» или «подкоманды тестирования»**.
## Размер Scrum-команды
- Scrum-команда достаточно мала, чтобы оставаться **гибкой (nimble)**, и достаточно велика, чтобы сделать **значимую работу за спринт**, — обычно **10 человек или меньше (typically 10 or fewer people)**.
- В целом **небольшие команды лучше общаются и продуктивнее**.
- Если Scrum-команды становятся слишком большими, им стоит **реорганизоваться в несколько сплочённых Scrum-команд, каждая из которых работает над тем же продуктом**.
- Следовательно, у них должны быть **общие Product Goal, Product Backlog и Product Owner**.
| Несколько Scrum-команд на одном продукте | Общее или своё? |
|---|---|
| Product Goal (цель продукта) | общая — одна цель |
| Product Backlog (бэклог продукта) | общий — один бэклог |
| Product Owner | общий — один человек |
| Definition of Done (критерии готовности) | общие — они должны вместе определить и соблюдать одни и те же DoD (часть 4) |
| Developers и Sprint Backlog | у каждой команды свои |
- Пример из IT: финтех-стартап вырос до 16 человек на одном мобильном банке. Вместо одной команды из 16 человек с «подкомандой фронтенда» и «подкомандой бэкенда» он создаёт две кросс-функциональные Scrum-команды по 8 человек. Обе работают из одного Product Backlog, к одной Product Goal, с одним Product Owner.
= 16 people > 10 → 2 Scrum Teams × 8 people; shared: 1 Product Goal, 1 Product Backlog, 1 Product Owner
> Ловушка экзамена: «10 or fewer» считает **всю Scrum-команду** (вместе со Scrum Master и Product Owner), и там сказано «typically» — это ориентир, а не жёсткий предел. В старых источниках — «3–9 разработчиков»; на слайде 2020 — 10 человек или меньше. Делить один продукт между командами с **разными** Product Owner или бэклогами — неверно.
## Чем занимается Scrum-команда
- Scrum-команда **отвечает за всю деятельность, связанную с продуктом (responsible for all product-related activities)**: взаимодействие со стейкхолдерами, верификацию, сопровождение, эксплуатацию, эксперименты, исследования и разработку и всё остальное, что может понадобиться.
- Организация **выстраивает команду и наделяет её полномочиями самой управлять своей работой (structured and empowered … to manage their own work)**.
- Работа спринтами **в устойчивом темпе (sustainable pace)** улучшает **фокус и стабильность** команды.
- **Вся Scrum-команда подотчётна за создание ценного, полезного инкремента в каждом спринте (accountable for creating a valuable, useful Increment every Sprint).**
- Scrum определяет **три конкретные зоны ответственности (accountabilities)** внутри Scrum-команды: **Developers, Product Owner и Scrum Master**.
> Ловушка экзамена: Guide 2020 говорит об **accountabilities**, а не о «ролях» (roles, как в лекции 6). Правильно **Developers**, а не «Development Team», и **Scrum Master** в два слова, а не «ScrumMaster». За ценный, полезный инкремент подотчётна **вся Scrum-команда**, а не одни разработчики.
## Accountable и responsible
На этих двух словах построено много тестовых вопросов по лекции.
| | Accountable (подотчётен) | Responsible (ответственен за выполнение) |
|---|---|---|
| Смысл | отвечает за результат — «спрос с него» | выполняет работу |
| Можно ли делегировать? | нет — подотчётность остаётся | да — работу можно передать другим |
| Пример со слайда | «the Product Owner remains accountable» | «may delegate the responsibility to others» |
- Поэтому Product Owner может поручить бизнес-аналитику писать элементы бэклога, но если бэклог непонятен, отвечает за это Product Owner.
- На слайдах «responsible» сказано и о Scrum-команде («responsible for all product-related activities»), и, в части 4, о разработчиках («responsible for the sizing»).
## Разработчики (Developers)
> **Developers** — это люди в Scrum-команде, которые **обязались создавать любую часть пригодного к использованию инкремента в каждом спринте (committed to creating any aspect of a usable Increment each Sprint)**.
- Конкретные навыки разработчиков **часто широки и зависят от области работы**: программисты, тестировщики, дизайнеры, аналитики и DevOps-инженеры — все Developers, если создают часть инкремента.
- Однако разработчики **всегда подотчётны за (always accountable for)**:
| # | Developers подотчётны за | Пример из IT |
|---|---|---|
| 1 | Создание плана на спринт — Sprint Backlog | на Sprint Planning они делят «оплату картой» на задачи по дню или меньше |
| 2 | Встраивание качества через соблюдение Definition of Done (Instilling quality by adhering to a Definition of Done) | ни одна история не готова без код-ревью, тестов и выкладки на staging |
| 3 | Ежедневную адаптацию плана к цели спринта (Adapting their plan each day toward the Sprint Goal) | после Daily Scrum два разработчика переключаются на заблокированную задачу с API |
| 4 | Взаимную требовательность как профессионалов (Holding each other accountable as professionals) | разработчик напоминает коллеге, что непротестированный код не отвечает DoD |
> Зацепка (Memory hook): **План – Качество – Адаптация – Взаимная требовательность** (Sprint Backlog, DoD, ежедневная адаптация, друг друга).
## Владелец продукта (Product Owner)
> Product Owner **подотчётен за максимизацию ценности продукта, получаемого в результате работы Scrum-команды (maximizing the value of the product)**. Как это делается, может сильно различаться в разных организациях, командах и у разных людей.
Product Owner также подотчётен за **эффективное управление бэклогом продукта (effective Product Backlog management)**, которое включает:
| # | Управление Product Backlog | Пример из IT |
|---|---|---|
| 1 | Разработка и явное донесение цели продукта (Developing and explicitly communicating the Product Goal) | «К июню 30% заказов оплачиваются внутри приложения» |
| 2 | Создание и понятное донесение элементов бэклога (Creating and clearly communicating Product Backlog items) | понятный элемент «возврат на карту» с примерами |
| 3 | Упорядочивание элементов бэклога (Ordering Product Backlog items) | поднять «Apple Pay» выше «тёмной темы», потому что он приносит больше выручки |
| 4 | Обеспечение того, чтобы бэклог был прозрачен, виден и понятен (transparent, visible and understood) | бэклог открыт всей команде и стейкхолдерам |
- Product Owner **может делать эту работу сам или делегировать ответственность другим. В любом случае Product Owner остаётся подотчётным (remains accountable).**
- Чтобы Product Owner преуспел, **вся организация должна уважать его решения**. Эти решения видны **в содержании и порядке Product Backlog** и **в инкременте, который можно проверить на Sprint Review**.
- **Product Owner — один человек, а не комитет (one person, not a committee).** Он может **представлять в бэклоге потребности многих стейкхолдеров**.
- **Кто хочет изменить Product Backlog, может сделать это, только убедив Product Owner (by trying to convince the Product Owner).**
> Ловушка экзамена: на слайде **«ordering» (упорядочивание)**, а не «prioritizing» — бэклог упорядочен. CEO, директор по продажам или разработчики **не** переставляют бэклог сами: они пытаются **убедить Product Owner**. «Управляющий комитет в роли Product Owner» нарушает правило «один человек, а не комитет».
## Scrum Master
> Scrum Master **подотчётен за внедрение Scrum так, как он описан в Scrum Guide (establishing Scrum as defined in the Scrum Guide)**. Он делает это, помогая всем понять теорию и практику Scrum — и в Scrum-команде, и в организации.
> Scrum Master **подотчётен за эффективность Scrum-команды (the Scrum Team's effectiveness)**. Он делает это, давая команде возможность улучшать свои практики в рамках фреймворка Scrum.
- Scrum Masters — **настоящие лидеры, которые служат Scrum-команде и организации в целом (true leaders who serve)**.
| Кому служит | Как (по четыре способа, со слайдов) |
|---|---|
| Scrum-команде | коучит членов команды в самоуправлении и кросс-функциональности; помогает команде сосредоточиться на создании ценных инкрементов, отвечающих Definition of Done; добивается устранения препятствий (causing the removal of impediments) для продвижения команды; следит, чтобы все события Scrum проходили, были позитивными, продуктивными и укладывались в таймбокс (timebox) |
| Product Owner | помогает найти техники для эффективного определения Product Goal и управления Product Backlog; помогает Scrum-команде понять необходимость ясных и кратких элементов бэклога; помогает выстроить эмпирическое планирование продукта для сложной среды; содействует сотрудничеству со стейкхолдерами по запросу или по необходимости (facilitating stakeholder collaboration) |
| организации | ведёт, обучает и коучит организацию во внедрении Scrum; планирует внедрения Scrum в организации и консультирует по ним; помогает сотрудникам и стейкхолдерам понять и применять эмпирический подход к сложной работе; устраняет барьеры между стейкхолдерами и Scrum-командами (removing barriers) |
> Ловушка экзамена: Scrum Master **добивается устранения** препятствий (не обязательно устраняет каждое сам) и **следит, чтобы события проходили** и укладывались в таймбокс, — это не значит, что он ведёт Daily Scrum: это событие для разработчиков. Scrum Master не раздаёт задачи, не упорядочивает бэклог и не является начальником команды. В лекции 6 — «servant leader»; в Guide 2020 — «true leaders who serve».
> Ловушка экзамена: смотрите, кому адресована услуга. «Facilitating stakeholder collaboration» → **Product Owner**; «removing barriers between stakeholders and Scrum Teams» → **организация**; «causing the removal of impediments» → **Scrum-команда**.
## Кто за что подотчётен — сводка
| Вопрос | Ответ по Scrum Guide 2020 |
|---|---|
| Создание ценного, полезного инкремента в каждом спринте | вся Scrum-команда |
| Максимизация ценности продукта | Product Owner |
| Product Goal и порядок Product Backlog | Product Owner |
| Создание плана на спринт (Sprint Backlog) | Developers |
| Встраивание качества через соблюдение Definition of Done | Developers |
| Решение, как превратить элементы бэклога в инкремент | только Developers |
| Внедрение Scrum так, как он описан в Scrum Guide | Scrum Master |
| Эффективность Scrum-команды | Scrum Master |
| Отмена спринта | только Product Owner |
| Определение цели спринта (Sprint Goal) | вся Scrum-команда (Product Owner предлагает, в чём ценность) |
| Оценка размера элементов бэклога (sizing) | разработчики, которые будут делать работу |
## Кейсы: кто должен действовать?
- **Директор по продажам хочет поднять функцию на верх бэклога.** → Она должна убедить **Product Owner**; ни она, ни разработчики не переставляют элементы напрямую.
- **PO перегружен и просит бизнес-аналитика расписать детальные элементы.** → Можно: ответственность делегирована, но **Product Owner остаётся подотчётным**.
- **Руководство предлагает «продуктовый совет» из трёх директоров в роли Product Owner.** → Это не Scrum: Product Owner — **один человек, а не комитет**; директора могут быть стейкхолдерами, чьи потребности представляет PO.
- **Старший разработчик начинает раздавать задачи остальным.** → Это противоречит самоуправлению (команда сама решает, кто что делает) и правилу «нет подкоманд и иерархий».
- **Каждый спринт команда две недели ждёт отдельный отдел администраторов БД.** → Команда не кросс-функциональна. Scrum Master коучит кросс-функциональность, добивается устранения препятствия и, служа организации, устраняет барьеры между стейкхолдерами и Scrum-командами.
- **Разработчик постоянно пропускает тесты, чтобы выглядеть быстрым.** → Разработчики требуют друг с друга как профессионалы; качество встраивается через соблюдение Definition of Done.
?? Три Scrum-команды делают одну e-commerce платформу. Какие три вещи, по слайду о Scrum Team, у них должны быть общими?
?= Одна Product Goal, один Product Backlog и один Product Owner (а по слайду о Definition of Done — ещё и одни DoD).
?? Может ли Product Owner делегировать написание элементов бэклога? Что при этом не меняется?
?= Да: PO «may do the above work or may delegate the responsibility to others». Не меняется подотчётность — Product Owner остаётся подотчётным.
?? Назовите две вещи, за которые подотчётен Scrum Master.
?= Внедрение Scrum так, как он описан в Scrum Guide (помогать всем понять теорию и практику Scrum), и эффективность Scrum-команды (давать команде улучшать свои практики в рамках фреймворка Scrum).
## Что спросят на экзамене (Exam focus)
- Scrum Team = **один Scrum Master, один Product Owner и Developers**; **нет подкоманд и иерархий**; фокус на **одной цели за раз — Product Goal**.
- **Cross-functional** = все навыки, чтобы создавать ценность каждый спринт; **self-managing** = сами решают, **кто что делает, когда и как**.
- **Обычно 10 человек или меньше**; слишком большая → несколько сплочённых команд с общими **Product Goal, Product Backlog и Product Owner**.
- **Вся Scrum-команда** подотчётна за **ценный, полезный инкремент каждый спринт**; три **accountabilities**: Developers, Product Owner, Scrum Master.
- Developers — четыре: **Sprint Backlog; качество через соблюдение DoD; ежедневная адаптация плана к Sprint Goal; взаимная требовательность профессионалов**.
- Product Owner — **максимизация ценности продукта**; управление бэклогом — четыре: **разработать и донести Product Goal; создавать и доносить элементы; упорядочивать элементы; держать бэклог прозрачным, видимым и понятным**; может делегировать, но **остаётся подотчётным**; **один человек, а не комитет**; чтобы изменить бэклог — **убедить PO**.
- Scrum Master — подотчётен за **внедрение Scrum** и **эффективность Scrum-команды**; **настоящие лидеры, которые служат**; по четыре услуги команде, Product Owner и организации.`,
  },
  [
    qx("According to the Scrum Guide 2020, a Scrum Team consists of:", "One Scrum Master, one Product Owner, and Developers", [
      ["One Scrum Master, two Product Owners, and Developers", "The Product Owner is one person, not a committee — a team never has two Product Owners.", "Product Owner — один человек, а не комитет: двух Product Owner в команде не бывает."],
      ["One project manager, one Product Owner, and Developers", "There is no project manager accountability in Scrum; management of the work is shared by the self-managing team.", "Зоны ответственности «руководитель проекта» в Scrum нет; управлением работой занимается сама самоуправляемая команда."],
      ["One Product Owner, two Scrum Masters, and the testers", "The team has exactly one Scrum Master, and testers are simply Developers, not a separate group.", "В команде ровно один Scrum Master, а тестировщики — просто Developers, а не отдельная группа."],
    ], "\"The Scrum Team consists of one Scrum Master, one Product Owner, and Developers. Within a Scrum Team, there are no sub-teams or hierarchies.\"", "«The Scrum Team consists of one Scrum Master, one Product Owner, and Developers» — один Scrum Master, один Product Owner и разработчики; подкоманд и иерархий нет."),
    qx("In the Scrum Guide, \"self-managing\" means that the Scrum Team members:", "internally decide who does what, when, and how", [
      ["have all the skills needed to create value each Sprint", "That is the definition of cross-functional, the other team property on the same slide.", "Это определение кросс-функциональности — второго свойства команды на том же слайде."],
      ["work without a Product Owner or a Scrum Master", "Self-managing teams still have one Product Owner and one Scrum Master; the term is about who decides the work inside the team.", "У самоуправляемой команды всё равно есть один Product Owner и один Scrum Master; термин о том, кто решает работу внутри команды."],
      ["report their progress to a line manager each week", "Reporting to an outside manager is the opposite of deciding internally; progress is inspected in the Scrum events.", "Отчёт внешнему руководителю — противоположность решениям внутри команды; прогресс проверяется на событиях Scrum."],
    ], "\"They are also self-managing, meaning they internally decide who does what, when, and how.\"", "«They are also self-managing, meaning they internally decide who does what, when, and how» — сами решают, кто что делает, когда и как."),
    qx("A Scrum Team whose members have all the skills necessary to create value each Sprint is described by the Scrum Guide as:", "cross-functional", [
      ["self-managing", "Self-managing is about deciding who does what, when and how — not about having the skills.", "Self-managing — о том, кто решает, кто что делает, когда и как, а не о наличии навыков."],
      ["self-organizing", "Self-organizing is the older word used in Lecture 6 for the development team; it is not the definition on this slide.", "Self-organizing — старое слово из лекции 6 о development team; это не определение со слайда."],
      ["co-located", "Co-location means sitting in one place; the Scrum Guide does not define the team by location.", "Co-located — значит сидеть в одном месте; Scrum Guide не определяет команду по местоположению."],
    ], "\"Scrum Teams are cross-functional, meaning the members have all the skills necessary to create value each Sprint.\"", "«Scrum Teams are cross-functional, meaning the members have all the skills necessary to create value each Sprint» — у команды есть все навыки для ценности каждый спринт."),
    qx("What size does the Scrum Guide 2020 give for a Scrum Team?", "Typically 10 or fewer people", [
      ["Exactly 7 people, plus or minus 2", "\"7 ± 2\" is a popular rule of thumb, not the Scrum Guide 2020 wording.", "«7 ± 2» — популярное эмпирическое правило, а не формулировка Scrum Guide 2020."],
      ["3 to 9 Developers, not counting the PO and SM", "This is the older Guide's rule for the Development Team; the 2020 slide counts the whole Scrum Team: typically 10 or fewer.", "Это правило прежних версий Guide для Development Team; слайд 2020 считает всю Scrum-команду: обычно 10 или меньше."],
      ["Up to 15 people if they share one product", "Teams that grow too large should split into several teams on the same product, not grow to 15.", "Слишком выросшие команды должны разделиться на несколько команд на одном продукте, а не расти до 15."],
    ], "\"The Scrum Team is small enough to remain nimble and large enough to complete significant work within a Sprint, typically 10 or fewer people.\"", "«…small enough to remain nimble and large enough to complete significant work within a Sprint, typically 10 or fewer people» — обычно 10 человек или меньше."),
    qx("A Scrum Team has grown to 18 people working on one product. What does the Scrum Guide recommend?", "Split into several teams that share one Product Goal, backlog and PO", [
      ["Split into several teams, each with its own Product Owner and backlog", "Teams on the same product must share the same Product Owner and Product Backlog, otherwise one product gets competing orders of work.", "Команды на одном продукте должны иметь общих Product Owner и Product Backlog, иначе у одного продукта появятся конкурирующие порядки работы."],
      ["Keep one team, divided into frontend and backend sub-teams", "Within a Scrum Team there are no sub-teams or hierarchies.", "Внутри Scrum-команды нет подкоманд и иерархий."],
      ["Keep one team, with a lead developer who manages the others", "A lead managing others creates a hierarchy and breaks self-management; it also does not fix the size problem.", "Ведущий, управляющий остальными, создаёт иерархию и нарушает самоуправление; к тому же проблему размера это не решает."],
    ], "\"If Scrum Teams become too large, they should consider reorganizing into multiple cohesive Scrum Teams, each focused on the same product. Therefore, they should share the same Product Goal, Product Backlog, and Product Owner.\"", "«…reorganizing into multiple cohesive Scrum Teams, each focused on the same product… share the same Product Goal, Product Backlog, and Product Owner» — несколько команд с общими целью, бэклогом и PO."),
    qx("According to the Scrum Guide, who is accountable for creating a valuable, useful Increment every Sprint?", "The entire Scrum Team", [
      ["The Developers alone", "Developers create the Increment's parts and adhere to the DoD, but the slide makes the entire Scrum Team accountable.", "Разработчики создают части инкремента и соблюдают DoD, но слайд делает подотчётной всю Scrum-команду."],
      ["The Product Owner alone", "The PO is accountable for maximizing value, but the valuable, useful Increment is the whole team's accountability.", "PO подотчётен за максимизацию ценности, но ценный, полезный инкремент — подотчётность всей команды."],
      ["The Scrum Master", "The Scrum Master is accountable for establishing Scrum and for the team's effectiveness, not for the Increment itself.", "Scrum Master подотчётен за внедрение Scrum и эффективность команды, а не за сам инкремент."],
    ], "\"The entire Scrum Team is accountable for creating a valuable, useful Increment every Sprint.\"", "«The entire Scrum Team is accountable for creating a valuable, useful Increment every Sprint» — вся Scrum-команда."),
    qx("According to the Scrum Guide, Developers are the people in the Scrum Team who are committed to:", "creating any aspect of a usable Increment each Sprint", [
      ["writing and testing code according to the architect's design", "Developers are not limited to code, and there is no outside architect deciding for them — they decide how to build the Increment.", "Разработчики не ограничены кодом, и никакой внешний архитектор за них не решает — как строить инкремент, решают они."],
      ["ordering the work in the Product Backlog by value", "Ordering Product Backlog items is part of the Product Owner's backlog management.", "Упорядочивание элементов бэклога — часть управления бэклогом у Product Owner."],
      ["causing the removal of impediments to progress", "Causing the removal of impediments is how the Scrum Master serves the Scrum Team.", "Добиваться устранения препятствий — способ, которым Scrum Master служит команде."],
    ], "\"Developers are the people in the Scrum Team that are committed to creating any aspect of a usable Increment each Sprint.\"", "«Developers are the people in the Scrum Team that are committed to creating any aspect of a usable Increment each Sprint» — любая часть пригодного инкремента."),
    qx("Which of the following is NOT one of the four things the Developers are always accountable for?", "Ordering Product Backlog items for the next Sprint", [
      ["Creating a plan for the Sprint, the Sprint Backlog", "This is the first Developer accountability: the Sprint Backlog is a plan by and for the Developers.", "Это первая подотчётность разработчиков: Sprint Backlog — план разработчиков и для разработчиков."],
      ["Instilling quality by adhering to a Definition of Done", "This is the second Developer accountability, word for word.", "Это вторая подотчётность разработчиков, дословно."],
      ["Holding each other accountable as professionals", "This is the fourth Developer accountability, word for word.", "Это четвёртая подотчётность разработчиков, дословно."],
    ], "Developers: Sprint Backlog plan; quality via the DoD; adapting the plan each day toward the Sprint Goal; holding each other accountable. Ordering the Product Backlog is the Product Owner's.", "Developers: план (Sprint Backlog); качество через DoD; ежедневная адаптация плана к Sprint Goal; взаимная требовательность. Упорядочивание бэклога — у Product Owner."),
    qx("Which accountability does the Scrum Guide give to the Product Owner?", "Maximizing the value of the product", [
      ["Maximizing the productivity of the Developers", "Productivity of individuals is not the target; the PO maximizes the value of the product resulting from the team's work.", "Цель — не производительность отдельных людей; PO максимизирует ценность продукта, получаемого из работы команды."],
      ["The Scrum Team's effectiveness", "Team effectiveness is one of the Scrum Master's two accountabilities.", "Эффективность команды — одна из двух подотчётностей Scrum Master."],
      ["Establishing Scrum as defined in the Guide", "Establishing Scrum is the Scrum Master's accountability.", "Внедрение Scrum — подотчётность Scrum Master."],
    ], "\"The Product Owner is accountable for maximizing the value of the product resulting from the work of the Scrum Team.\"", "«The Product Owner is accountable for maximizing the value of the product resulting from the work of the Scrum Team» — максимизация ценности продукта."),
    qx("Which of the following is NOT part of effective Product Backlog management by the Product Owner?", "Sizing Product Backlog items for the Developers", [
      ["Developing and explicitly communicating the Product Goal", "This is the first item of Product Backlog management on the slide.", "Это первый пункт управления бэклогом на слайде."],
      ["Ordering Product Backlog items", "Ordering is the third item of Product Backlog management.", "Упорядочивание — третий пункт управления бэклогом."],
      ["Ensuring the backlog is transparent, visible and understood", "This is the fourth item of Product Backlog management.", "Это четвёртый пункт управления бэклогом."],
    ], "Sizing is done by \"the Developers who will be doing the work\"; the PO may only influence it by helping them understand and select trade-offs.", "Размер оценивают «the Developers who will be doing the work»; PO может лишь влиять, помогая им понять и выбрать компромиссы."),
    qx("A Product Owner delegates the writing of Product Backlog items to a business analyst. According to the Scrum Guide:", "This is allowed; the Product Owner remains accountable", [
      ["This is not allowed; only the PO may write items", "The slide explicitly allows delegation: the PO \"may delegate the responsibility to others\".", "Слайд прямо разрешает делегировать: PO «may delegate the responsibility to others»."],
      ["This is allowed; the analyst becomes accountable", "Responsibility moves, accountability does not: \"Regardless, the Product Owner remains accountable.\"", "Передаётся ответственность за выполнение, но не подотчётность: «Regardless, the Product Owner remains accountable»."],
      ["This is allowed only if the Scrum Master approves it first", "No approval by the Scrum Master is required; the Scrum Master serves the PO, not controls them.", "Одобрение Scrum Master не требуется; Scrum Master служит PO, а не контролирует его."],
    ], "\"The Product Owner may do the above work or may delegate the responsibility to others. Regardless, the Product Owner remains accountable.\"", "«The Product Owner may do the above work or may delegate the responsibility to others. Regardless, the Product Owner remains accountable» — делегировать можно, подотчётность остаётся."),
    qx("A company wants a steering committee of three directors to act as the Product Owner. What does the Scrum Guide say?", "The Product Owner is one person, not a committee", [
      ["A committee is fine if it votes on the backlog order", "Voting does not fix it: the Guide requires one person, who may represent the needs of many stakeholders.", "Голосование не спасает: Guide требует одного человека, который может представлять потребности многих стейкхолдеров."],
      ["A committee is fine if the Scrum Master chairs it", "The Scrum Master does not chair product decisions; the PO is one person.", "Scrum Master не председательствует в решениях о продукте; PO — один человек."],
      ["Each director should own one part of the backlog", "Splitting ownership creates several POs for one product; one product has one Product Owner.", "Разделение владения создаёт нескольких PO на один продукт; у одного продукта один Product Owner."],
    ], "\"The Product Owner is one person, not a committee. The Product Owner may represent the needs of many stakeholders in the Product Backlog.\"", "«The Product Owner is one person, not a committee» — один человек, который может представлять потребности многих стейкхолдеров."),
    qx("A sales director wants a new feature at the top of the Product Backlog. How can she achieve this, according to the Scrum Guide?", "By trying to convince the Product Owner to change it", [
      ["By asking the Developers to add it during the Sprint", "Developers do not order the Product Backlog, and work must not endanger the Sprint Goal.", "Разработчики не упорядочивают Product Backlog, а работа не должна ставить под угрозу Sprint Goal."],
      ["By escalating to the Scrum Master, who reorders it", "The Scrum Master never orders the backlog; that is the Product Owner's accountability.", "Scrum Master никогда не упорядочивает бэклог; это подотчётность Product Owner."],
      ["By adding it herself, since she is a stakeholder", "Stakeholders influence the backlog through the PO, who represents their needs; they do not edit its order themselves.", "Стейкхолдеры влияют на бэклог через PO, который представляет их потребности; сами порядок они не меняют."],
    ], "\"Those wanting to change the Product Backlog can do so by trying to convince the Product Owner.\"", "«Those wanting to change the Product Backlog can do so by trying to convince the Product Owner» — только убедив PO."),
    qx("According to the Scrum Guide, where are the Product Owner's decisions visible?", "In the backlog's content and ordering, and the Increment at Review", [
      ["In the Sprint Backlog plan and the tasks updated at each Daily Scrum", "The Sprint Backlog is a plan by and for the Developers; it reflects their decisions, not the PO's.", "Sprint Backlog — план разработчиков и для разработчиков; в нём их решения, а не решения PO."],
      ["In the Definition of Done and the Retrospective notes", "The DoD and Retrospective outcomes reflect quality and process decisions of the whole team, not the PO's product decisions.", "DoD и итоги ретроспективы отражают решения всей команды о качестве и процессе, а не продуктовые решения PO."],
      ["In the project charter and the signed change requests", "Charters and change requests belong to predictive project management, not to the Scrum Guide.", "Устав проекта и запросы на изменения — из предиктивного управления проектами, а не из Scrum Guide."],
    ], "\"These decisions are visible in the content and ordering of the Product Backlog, and through the inspectable Increment at the Sprint Review.\"", "«These decisions are visible in the content and ordering of the Product Backlog, and through the inspectable Increment at the Sprint Review» — в содержании и порядке бэклога и в инкременте на Review."),
    qx("The Scrum Master is accountable for which two things?", "Establishing Scrum and the Scrum Team's effectiveness", [
      ["Maximizing product value and ordering the backlog", "Both belong to the Product Owner.", "Обе вещи — у Product Owner."],
      ["Creating the Sprint Backlog and meeting the DoD", "Both are Developer accountabilities.", "Обе — подотчётности разработчиков."],
      ["Assigning tasks to developers and tracking each one's output", "That is a traditional manager's job; the team is self-managing and decides who does what.", "Это работа традиционного менеджера; команда самоуправляема и сама решает, кто что делает."],
    ], "\"The Scrum Master is accountable for establishing Scrum as defined in the Scrum Guide… The Scrum Master is accountable for the Scrum Team's effectiveness.\"", "«The Scrum Master is accountable for establishing Scrum as defined in the Scrum Guide… accountable for the Scrum Team's effectiveness» — внедрение Scrum и эффективность команды."),
    qx("Which of the following is a way the Scrum Master serves the Product Owner?", "Facilitating stakeholder collaboration as requested or needed", [
      ["Coaching the team members in self-management and cross-functionality", "This is a service to the Scrum Team, not to the Product Owner.", "Это услуга Scrum-команде, а не Product Owner."],
      ["Removing barriers between stakeholders and Scrum Teams", "This is a service to the organization (last item of that list).", "Это услуга организации (последний пункт того списка)."],
      ["Planning and advising Scrum implementations within the organization", "This is a service to the organization.", "Это услуга организации."],
    ], "The Scrum Master serves the PO by: techniques for Product Goal definition and backlog management; helping the team understand clear, concise PBIs; empirical product planning; facilitating stakeholder collaboration.", "Scrum Master служит PO: техники определения Product Goal и управления бэклогом; помощь команде понять ясные краткие элементы; эмпирическое планирование продукта; содействие сотрудничеству со стейкхолдерами."),
    qx("The Developers keep waiting days for another department's sign-off, and the Scrum Master works with management until the bottleneck is removed. Which service to the Scrum Team is this?", "Causing the removal of impediments to the team's progress", [
      ["Coaching the team members in self-management", "Coaching changes how the team manages itself; here an outside blocker is removed.", "Коучинг меняет то, как команда управляет собой; здесь же убирается внешний блокер."],
      ["Ensuring that all Scrum events take place and are kept within the timebox", "This is about events and timeboxes, not about a blocker outside the team.", "Это о событиях и таймбоксах, а не о блокере вне команды."],
      ["Helping establish empirical product planning", "Empirical product planning is a service to the Product Owner.", "Эмпирическое планирование продукта — услуга Product Owner."],
    ], "One of the four services to the Scrum Team: \"Causing the removal of impediments to the Scrum Team's progress.\"", "Одна из четырёх услуг Scrum-команде: «Causing the removal of impediments to the Scrum Team's progress» — добиваться устранения препятствий."),
    qx("Which statement correctly uses \"accountable\" and \"responsible\" as in the Product Owner slide?", "The work can be delegated; the accountability stays with the PO", [
      ["The accountability can be delegated; the work stays with the PO", "This reverses the slide: the PO may delegate the responsibility (the work), but remains accountable.", "Это переворачивает слайд: PO может делегировать ответственность (работу), но остаётся подотчётным."],
      ["Both words mean the same in the Scrum Guide", "The slide deliberately contrasts them: delegate the responsibility, remain accountable.", "Слайд намеренно их противопоставляет: делегировать ответственность, оставаться подотчётным."],
      ["Accountability always belongs to the whole team", "The entire team is accountable for the Increment, but the PO, the SM and the Developers each have their own accountabilities.", "Вся команда подотчётна за инкремент, но у PO, SM и Developers есть и свои подотчётности."],
    ], "\"The Product Owner may do the above work or may delegate the responsibility to others. Regardless, the Product Owner remains accountable.\" Accountability is not delegated.", "«…may delegate the responsibility to others. Regardless, the Product Owner remains accountable» — подотчётность не делегируется."),
    tfx("In the Scrum Guide 2020, Scrum Masters are described as true leaders who serve the Scrum Team and the larger organization.", true,
      "Word for word from the Scrum Master slide: \"Scrum Masters are true leaders who serve the Scrum Team and the larger organization.\"",
      "Дословно со слайда о Scrum Master: «Scrum Masters are true leaders who serve the Scrum Team and the larger organization».",
      "\"False\" would make the Scrum Master either a manager or a mere facilitator; the Guide calls them true leaders who serve.",
      "«Неверно» сделало бы Scrum Master либо начальником, либо просто ведущим встреч; Guide называет их настоящими лидерами, которые служат."),
    tfx("A Scrum Team of nine may form a testing sub-team led by a QA lead, as long as the sub-team reports to the Scrum Master.", false,
      "\"Within a Scrum Team, there are no sub-teams or hierarchies.\" Testers are Developers like everyone else, and the team self-manages.",
      "«Within a Scrum Team, there are no sub-teams or hierarchies». Тестировщики — такие же Developers, а команда управляет собой сама.",
      "\"True\" would add both a sub-team and a hierarchy, and turn the Scrum Master into a line manager.",
      "«Верно» добавило бы и подкоманду, и иерархию, а Scrum Master превратило бы в линейного руководителя."),
  ],
);

const p3 = part(
  "pm-l7-p3",
  { en: "Scrum events: the Sprint, Planning, Daily Scrum, Review, Retrospective", ru: "События Scrum: спринт, планирование, Daily Scrum, обзор, ретроспектива" },
  {
    en: `## Why Scrum has events
- **The Sprint is a container for all other events.**
- Each event in Scrum is a **formal opportunity to inspect and adapt Scrum artifacts**. These events are specifically designed to **enable the transparency required**.
- **Failure to operate any events as prescribed results in lost opportunities to inspect and adapt.**
- Events are used in Scrum to **create regularity** and to **minimize the need for meetings not defined in Scrum**.
- Optimally, all events are held **at the same time and place to reduce complexity**.
= 5 events = Sprint (container) + Sprint Planning + Daily Scrum + Sprint Review + Sprint Retrospective
> Exam trap: **backlog refinement is not an event** in the 2020 Guide — it is an ongoing activity (Part 4). Lecture 6 lists "backlog refinement — meeting to discuss and update the backlog items" among Scrum activities; in a question about Scrum Guide events, do not count it. "Release planning", "Sprint demo" and "Scrum of Scrums" are not Scrum events either.
## The Sprint
> **Sprints are the heartbeat of Scrum, where ideas are turned into value.**
- They are **fixed length events of one month or less** to create **consistency**.
- **A new Sprint starts immediately after the conclusion of the previous Sprint** — there is no gap between Sprints.
- **All the work necessary to achieve the Product Goal**, including Sprint Planning, Daily Scrums, Sprint Review, and Sprint Retrospective, **happen within Sprints**.
**During the Sprint:**
| Rule from the slide | What it means in practice |
|---|---|
| No changes are made that would endanger the Sprint Goal | a new "urgent" feature that would derail the goal waits in the Product Backlog |
| Quality does not decrease | the team does not skip tests to "make it in time" |
| The Product Backlog is refined as needed | the team keeps preparing future items during the Sprint |
| Scope may be clarified and renegotiated with the Product Owner as more is learned | an item that turned out too big is cut down with the PO, while the Sprint Goal stays |
> Exam trap: "no changes that would endanger the Sprint Goal" does **not** freeze the Sprint. Scope may be clarified and renegotiated with the Product Owner; only the **goal** is protected.
## Why one month or less
- Sprints **enable predictability** by ensuring inspection and adaptation of progress toward a Product Goal **at least every calendar month**.
- When a Sprint's horizon is **too long**, the Sprint Goal may become **invalid**, **complexity** may rise, and **risk** may increase.
- **Shorter Sprints** can be employed to generate **more learning cycles** and **limit risk of cost and effort to a smaller time frame**.
- **Each Sprint may be considered a short project.**
- Various practices exist to **forecast progress**, like **burn-downs, burn-ups, or cumulative flows**. While proven useful, these **do not replace the importance of empiricism**. In complex environments, what will happen is unknown. **Only what has already happened may be used for forward-looking decision making.**
> Exam trap: Lecture 6 says a sprint is "one or two-week long" and its figure says "2–4 weeks". The Scrum Guide rule is **fixed length, one month or less**; two weeks is a common choice, not a rule. Burn-down charts are **useful practices**, not a mandatory part of Scrum.
## Cancelling a Sprint
- A Sprint **could be cancelled if the Sprint Goal becomes obsolete**.
- **Only the Product Owner has the authority to cancel the Sprint.**
- IT example: in the middle of a Sprint whose goal is "launch loyalty points for partner cafés", the company ends the partnership. The Sprint Goal is obsolete, so the Product Owner may cancel the Sprint, and the team plans a new one.
> Exam trap: not the Scrum Master, not the Developers, not the stakeholders or the CEO — **only the Product Owner** may cancel, and the reason is an **obsolete Sprint Goal**, not "the team is behind schedule".
## Sprint Planning
- Sprint Planning **initiates the Sprint** by laying out the work to be performed for the Sprint.
- The resulting plan is **created by the collaborative work of the entire Scrum Team**.
- **The Product Owner ensures that attendees are prepared** to discuss the most important Product Backlog items and how they map to the Product Goal.
- The Scrum Team **may also invite other people** to attend Sprint Planning **to provide advice**.
| Topic | Question | Who and how | Result |
|---|---|---|---|
| One | Why is this Sprint valuable? | the Product Owner proposes how the product could increase its value and utility in the current Sprint; the whole Scrum Team collaborates to define a Sprint Goal that communicates why the Sprint is valuable to stakeholders | the **Sprint Goal**, finalized **prior to the end of Sprint Planning** |
| Two | What can be Done this Sprint? | through discussion with the Product Owner, **the Developers select items** from the Product Backlog; the Scrum Team may refine these items, which increases understanding and confidence | the selected **Product Backlog items** |
| Three | How will the chosen work get done? | for each selected item the Developers plan the work necessary to create an Increment that meets the Definition of Done, often by decomposing items into **smaller work items of one day or less**; this is **at the sole discretion of the Developers** | the **plan** for delivering them |
- Selecting how much can be completed within a Sprint may be challenging. However, the more the Developers know about their **past performance, their upcoming capacity, and their Definition of Done**, the more confident they will be in their **Sprint forecasts**.
- **No one else tells the Developers how to turn Product Backlog items into Increments of value.**
= Sprint Backlog = Sprint Goal (why) + selected Product Backlog items (what) + plan for delivering them (how)
- Sprint Planning is **timeboxed to a maximum of eight hours for a one-month Sprint**. For shorter Sprints, the event is usually shorter.
> Exam trap: the **Developers** select the items "through discussion with the Product Owner" — the PO does not assign the work and the Scrum Master does not choose it. The Sprint Goal is defined by the **whole Scrum Team**; the PO only **proposes** how the product could increase its value. Topic three (how) belongs to the **Developers only**.
> Exam trap: the selection is a **forecast** based on past performance, upcoming capacity and the Definition of Done — not a guarantee of every item.
## Daily Scrum
> The purpose of the Daily Scrum is to **inspect progress toward the Sprint Goal and adapt the Sprint Backlog as necessary, adjusting the upcoming planned work**.
- It is a **15-minute event for the Developers** of the Scrum Team.
- To reduce complexity, it is held **at the same time and place every working day of the Sprint**.
- If the Product Owner or Scrum Master are **actively working on items in the Sprint Backlog, they participate as Developers**.
- The Developers can select **whatever structure and techniques they want**, as long as their Daily Scrum **focuses on progress toward the Sprint Goal** and **produces an actionable plan for the next day of work**. This creates **focus** and improves **self-management**.
- Daily Scrums **improve communications, identify impediments, promote quick decision-making, and consequently eliminate the need for other meetings**.
- The Daily Scrum is **not the only time Developers are allowed to adjust their plan**. They often meet throughout the day for more detailed discussions about adapting or re-planning the rest of the Sprint's work.
> Exam trap: the "three questions" (What did I do yesterday? What will I do today? Any impediments?) appear in Lecture 6's figure, but the 2020 Guide does **not** require them — any structure is fine. The Daily Scrum is **for the Developers**: it is not a status report to the Scrum Master or the PO, and the Scrum Master does not have to run it.
> Exam trap: the Daily Scrum is **15 minutes** whatever the Sprint length — unlike Planning, Review and Retrospective, whose maximums are given for a one-month Sprint.
## Sprint Review
> The purpose of the Sprint Review is to **inspect the outcome of the Sprint and determine future adaptations**.
- The Scrum Team **presents the results of their work to key stakeholders** and **progress toward the Product Goal is discussed**.
- The Scrum Team and stakeholders review **what was accomplished in the Sprint and what has changed in their environment**. Based on this information, attendees **collaborate on what to do next**.
- **The Product Backlog may also be adjusted** to meet new opportunities.
- The Sprint Review is a **working session**, and the Scrum Team should **avoid limiting it to a presentation**.
- It is the **second to last event of the Sprint** and is **timeboxed to a maximum of four hours for a one-month Sprint**. For shorter Sprints, the event is usually shorter.
## Sprint Retrospective
> The purpose of the Sprint Retrospective is to **plan ways to increase quality and effectiveness**.
- The Scrum Team inspects how the last Sprint went with regards to **individuals, interactions, processes, tools, and their Definition of Done**. Inspected elements often vary with the domain of work.
- **Assumptions that led them astray are identified and their origins explored.**
- The team discusses **what went well** during the Sprint, **what problems it encountered**, and **how those problems were (or were not) solved**.
- The Scrum Team identifies the **most helpful changes to improve its effectiveness**. The most impactful improvements are **addressed as soon as possible**. They **may even be added to the Sprint Backlog for the next Sprint**.
- The Sprint Retrospective **concludes the Sprint**. It is **timeboxed to a maximum of three hours for a one-month Sprint**. For shorter Sprints, the event is usually shorter.
| | Sprint Review | Sprint Retrospective |
|---|---|---|
| Inspects | the **product**: the outcome of the Sprint, progress toward the Product Goal, changes in the environment | the **way of working**: individuals, interactions, processes, tools, Definition of Done |
| Who | the Scrum Team **and key stakeholders** | the Scrum Team |
| Output | an adjusted Product Backlog, agreement on what to do next | improvements, possibly added to the next Sprint Backlog |
| Place and timebox | second to last; max 4 hours | last, concludes the Sprint; max 3 hours |
> Memory hook: **Review = product, Retrospective = process.** Review looks outward with stakeholders; Retrospective looks inward at the team.
## All five events at a glance
| Event | Purpose | Who | Timebox (one-month Sprint) |
|---|---|---|---|
| Sprint | container; turn ideas into value | the whole Scrum Team | fixed length, one month or less |
| Sprint Planning | initiate the Sprint: why, what, how → Sprint Backlog | the entire Scrum Team (+ invited advisers) | max 8 hours |
| Daily Scrum | inspect progress toward the Sprint Goal, adapt the Sprint Backlog | the Developers | 15 minutes, every working day |
| Sprint Review | inspect the outcome, determine future adaptations | Scrum Team + key stakeholders | max 4 hours |
| Sprint Retrospective | plan ways to increase quality and effectiveness | the Scrum Team | max 3 hours |
@diagram pm7-scrum-flow
= One-month Sprint: Planning ≤ 8 h | Daily Scrum 15 min | Review ≤ 4 h | Retrospective ≤ 3 h
## Worked example: timeboxes for a two-week Sprint
The slides give maximums only for a **one-month Sprint** and say "for shorter Sprints, the event is usually shorter". A common rule of thumb (not on the slides) is to scale them in proportion to the Sprint length:
= 2-week Sprint ≈ 1/2 month → Planning 8 h × 1/2 = 4 h; Review 4 h × 1/2 = 2 h; Retro 3 h × 1/2 = 1.5 h; Daily Scrum = 15 min
- With 10 working days there are about 10 Daily Scrums. The whole set of events then takes roughly one eighth of the team's time — and, as the slide says, it replaces most other meetings:
= 4 h + 2 h + 1.5 h + 10 × 0.25 h = 10 h of events per 80 working hours = 12.5%
> Exam trap: if a question gives "a one-month Sprint", answer 8 / 4 / 3 hours and 15 minutes. For a shorter Sprint the slide answer is only "usually shorter"; the proportional numbers are a rule of thumb.
## Order inside a Sprint
- Sprint Planning (**initiates** the Sprint) → Daily Scrums (every working day) → Sprint Review (**second to last**) → Sprint Retrospective (**concludes** the Sprint) → the next Sprint **starts immediately**.
?? The CEO asks the Scrum Master to cancel the current Sprint because a competitor released a similar feature. What should happen?
?= Only the Product Owner has the authority to cancel a Sprint, and only if the Sprint Goal becomes obsolete. The Scrum Master cannot cancel it; the CEO should bring the news to the Product Owner, who decides whether the goal is obsolete.
?? During the Sprint a Developer finds that one selected item is twice as big as expected. Does this violate "no changes that would endanger the Sprint Goal"?
?= No. Scope may be clarified and renegotiated with the Product Owner as more is learned. The Developers and the PO negotiate the scope of the Sprint Backlog without affecting the Sprint Goal.
?? Which event inspects the Definition of Done itself, and which one inspects the outcome of the Sprint with stakeholders?
?= The Sprint Retrospective inspects individuals, interactions, processes, tools and the Definition of Done; the Sprint Review inspects the outcome of the Sprint with key stakeholders.
## Exam focus
- The Sprint is a **container**; events create **regularity** and **minimize meetings not defined in Scrum**; ideally the **same time and place**.
- Sprint: the **heartbeat**, **fixed length, one month or less**, the next starts **immediately**; four "During the Sprint" rules.
- Too long → Sprint Goal invalid, complexity up, risk up; shorter → **more learning cycles**, risk of cost and effort limited; each Sprint = **a short project**.
- **Burn-downs, burn-ups, cumulative flows** do not replace **empiricism**; only what has already happened guides decisions.
- **Only the Product Owner** cancels, if the **Sprint Goal becomes obsolete**.
- Planning: **why / what / how**; Sprint Goal finalized **before the end of Planning**; Developers select items **through discussion with the PO**; how — **sole discretion of the Developers**; work items of **one day or less**; **8 hours max**.
- Daily Scrum: **15 minutes, for the Developers**, same time and place, **every working day**; PO and SM only **as Developers**; any structure; **not the only time** to adjust the plan.
- Review: inspect the **outcome**, a **working session** not a presentation, **second to last**, **4 hours max**.
- Retrospective: **quality and effectiveness**; individuals, interactions, processes, tools, **Definition of Done**; improvements may go into the **next Sprint Backlog**; **concludes** the Sprint, **3 hours max**.`,
    ru: `## Зачем в Scrum события
- **Спринт — контейнер для всех остальных событий (The Sprint is a container for all other events).**
- Каждое событие Scrum — **формальная возможность проверить и адаптировать артефакты Scrum**. События специально задуманы, чтобы **обеспечить нужную прозрачность**.
- **Если какое-то событие не проводится так, как предписано, теряется возможность проверки и адаптации.**
- События нужны, чтобы **создать регулярность (regularity)** и **свести к минимуму встречи, не определённые в Scrum**.
- В идеале все события проводятся **в одно и то же время и в одном месте, чтобы уменьшить сложность**.
= 5 events = Sprint (container) + Sprint Planning + Daily Scrum + Sprint Review + Sprint Retrospective
> Ловушка экзамена (Exam trap): **уточнение бэклога (backlog refinement) — не событие** в Guide 2020, а непрерывная деятельность (часть 4). В лекции 6 «backlog refinement — meeting to discuss and update the backlog items» стоит среди активностей Scrum; в вопросе о событиях по Scrum Guide его не считайте. «Release planning», «Sprint demo» и «Scrum of Scrums» — тоже не события Scrum.
## Спринт (The Sprint)
> **Спринты — сердцебиение Scrum (heartbeat of Scrum), где идеи превращаются в ценность.**
- Это **события фиксированной длины — один месяц или меньше (fixed length events of one month or less)**, чтобы создать **постоянство (consistency)**.
- **Новый спринт начинается сразу после окончания предыдущего** — промежутков между спринтами нет.
- **Вся работа, нужная для достижения Product Goal**, включая Sprint Planning, Daily Scrum, Sprint Review и Sprint Retrospective, **происходит внутри спринтов**.
**Во время спринта (During the Sprint):**
| Правило со слайда | Что это значит на практике |
|---|---|
| Не вносятся изменения, которые поставили бы под угрозу цель спринта (endanger the Sprint Goal) | новая «срочная» функция, которая сорвала бы цель, ждёт в Product Backlog |
| Качество не снижается (Quality does not decrease) | команда не пропускает тесты, чтобы «успеть» |
| Product Backlog уточняется по мере необходимости (refined as needed) | команда продолжает готовить будущие элементы во время спринта |
| Объём работ (scope) можно уточнять и пересогласовывать с Product Owner по мере того, как узнаётся новое | слишком большой элемент урезают вместе с PO, а цель спринта остаётся |
> Ловушка экзамена: «никаких изменений, угрожающих цели спринта» **не** замораживает спринт. Объём можно уточнять и пересогласовывать с Product Owner; защищена только **цель**.
## Почему месяц или меньше
- Спринты **дают предсказуемость (predictability)**, обеспечивая проверку и адаптацию продвижения к Product Goal **не реже раза в календарный месяц**.
- Если горизонт спринта **слишком длинный**, цель спринта может **устареть (invalid)**, **сложность** может вырасти, а **риск** — увеличиться.
- **Короткие спринты** позволяют получить **больше циклов обучения (learning cycles)** и **ограничить риск затрат и усилий меньшим отрезком времени**.
- **Каждый спринт можно считать коротким проектом (a short project).**
- Есть разные практики **прогноза прогресса**: **burn-down, burn-up или cumulative flow**. Они доказали свою полезность, но **не заменяют важности эмпиризма**. В сложной среде будущее неизвестно. **Для решений на будущее можно опираться только на то, что уже произошло.**
> Ловушка экзамена: в лекции 6 спринт «one or two-week long», а на рисунке — «2–4 weeks». Правило Scrum Guide — **фиксированная длина, один месяц или меньше**; две недели — частый выбор, а не правило. Диаграммы сгорания — **полезные практики**, а не обязательная часть Scrum.
## Отмена спринта
- Спринт **может быть отменён, если цель спринта устарела (becomes obsolete)**.
- **Только Product Owner имеет право (authority) отменить спринт.**
- Пример из IT: посреди спринта с целью «запустить баллы лояльности для кафе-партнёров» компания разрывает партнёрство. Цель спринта устарела, поэтому Product Owner может отменить спринт, и команда планирует новый.
> Ловушка экзамена: ни Scrum Master, ни разработчики, ни стейкхолдеры или CEO — **только Product Owner** может отменить спринт, и причина — **устаревшая цель спринта**, а не «команда отстаёт от графика».
## Планирование спринта (Sprint Planning)
- Sprint Planning **запускает спринт (initiates the Sprint)**, раскладывая работу, которую предстоит выполнить.
- Получившийся план **создаётся совместной работой всей Scrum-команды**.
- **Product Owner следит, чтобы участники были готовы** обсуждать самые важные элементы бэклога и то, как они связаны с Product Goal.
- Scrum-команда **может пригласить и других людей**, чтобы они **дали совет**.
| Тема | Вопрос | Кто и как | Результат |
|---|---|---|---|
| Первая | Почему этот спринт ценен? (Why is this Sprint valuable?) | Product Owner предлагает, как продукт мог бы повысить ценность и полезность в текущем спринте; вся Scrum-команда вместе формулирует цель спринта, которая объясняет стейкхолдерам, чем спринт ценен | **цель спринта (Sprint Goal)**, окончательно согласованная **до конца Sprint Planning** |
| Вторая | Что можно сделать (Done) в этом спринте? (What can be Done this Sprint?) | в обсуждении с Product Owner **разработчики выбирают элементы** из Product Backlog; команда может их уточнить, что повышает понимание и уверенность | выбранные **элементы бэклога** |
| Третья | Как будет сделана выбранная работа? (How will the chosen work get done?) | для каждого выбранного элемента разработчики планируют работу, нужную для инкремента, отвечающего Definition of Done, часто разбивая элементы на **рабочие единицы по одному дню или меньше**; это **исключительно на усмотрение разработчиков (sole discretion of the Developers)** | **план** их выполнения |
- Выбрать, сколько можно завершить за спринт, бывает непросто. Но чем больше разработчики знают о своей **прошлой производительности, предстоящей загрузке (capacity) и своём Definition of Done**, тем увереннее их **прогнозы на спринт (Sprint forecasts)**.
- **Никто другой не говорит разработчикам, как превращать элементы бэклога в инкременты ценности.**
= Sprint Backlog = Sprint Goal (why) + selected Product Backlog items (what) + plan for delivering them (how)
- Sprint Planning **ограничено таймбоксом максимум восемь часов для месячного спринта (timeboxed to a maximum of eight hours)**. Для коротких спринтов событие обычно короче.
> Ловушка экзамена: элементы выбирают **разработчики** «в обсуждении с Product Owner» — PO не назначает работу, и Scrum Master её не выбирает. Цель спринта формулирует **вся Scrum-команда**; PO лишь **предлагает**, как продукт мог бы повысить ценность. Третья тема (как) — **только разработчики**.
> Ловушка экзамена: выбор — это **прогноз (forecast)** на основе прошлой производительности, предстоящей загрузки и Definition of Done, а не гарантия выполнения каждого элемента.
## Ежедневный Scrum (Daily Scrum)
> Цель Daily Scrum — **проверить продвижение к цели спринта и при необходимости адаптировать Sprint Backlog, скорректировав ближайшую запланированную работу**.
- Это **15-минутное событие для разработчиков (Developers)** Scrum-команды.
- Чтобы уменьшить сложность, оно проводится **в одно и то же время и в одном месте каждый рабочий день спринта**.
- Если Product Owner или Scrum Master **активно работают над элементами Sprint Backlog, они участвуют как разработчики**.
- Разработчики могут выбрать **любую структуру и техники**, лишь бы Daily Scrum **был сфокусирован на продвижении к цели спринта** и **давал конкретный план на следующий рабочий день (actionable plan)**. Это создаёт **фокус** и улучшает **самоуправление**.
- Daily Scrum **улучшает коммуникацию, выявляет препятствия, ускоряет принятие решений и тем самым избавляет от других встреч**.
- Daily Scrum — **не единственное время, когда разработчикам можно менять план**. Они часто встречаются в течение дня, чтобы подробнее обсудить адаптацию или перепланирование оставшейся работы спринта.
> Ловушка экзамена: «три вопроса» (Что я сделал вчера? Что сделаю сегодня? Есть ли препятствия?) есть на рисунке в лекции 6, но Guide 2020 их **не** требует — подойдёт любая структура. Daily Scrum — **для разработчиков**: это не отчёт о статусе для Scrum Master или PO, и Scrum Master не обязан его вести.
> Ловушка экзамена: Daily Scrum длится **15 минут** при любой длине спринта — в отличие от Planning, Review и Retrospective, максимумы которых даны для месячного спринта.
## Обзор спринта (Sprint Review)
> Цель Sprint Review — **проверить результат спринта (inspect the outcome) и определить будущие адаптации**.
- Scrum-команда **представляет результаты работы ключевым стейкхолдерам**, и **обсуждается продвижение к Product Goal**.
- Команда и стейкхолдеры смотрят, **что сделано за спринт и что изменилось в их окружении**. На основе этого участники **вместе решают, что делать дальше**.
- **Product Backlog может быть скорректирован** под новые возможности.
- Sprint Review — **рабочая сессия (working session)**, и команде следует **не сводить её к презентации**.
- Это **предпоследнее событие спринта (second to last event)**, его таймбокс — **максимум четыре часа для месячного спринта**. Для коротких спринтов событие обычно короче.
## Ретроспектива спринта (Sprint Retrospective)
> Цель Sprint Retrospective — **спланировать способы повысить качество и эффективность (quality and effectiveness)**.
- Scrum-команда проверяет, как прошёл последний спринт с точки зрения **людей, взаимодействий, процессов, инструментов и своего Definition of Done (individuals, interactions, processes, tools, and their Definition of Done)**. Проверяемые элементы часто зависят от области работы.
- **Выявляются допущения, которые сбили команду с пути, и исследуется их происхождение.**
- Команда обсуждает, **что прошло хорошо**, **с какими проблемами столкнулась** и **как эти проблемы были (или не были) решены**.
- Команда определяет **самые полезные изменения для повышения своей эффективности**. Самые значимые улучшения **реализуются как можно скорее**. Их **можно даже добавить в Sprint Backlog следующего спринта**.
- Sprint Retrospective **завершает спринт (concludes the Sprint)**. Её таймбокс — **максимум три часа для месячного спринта**. Для коротких спринтов событие обычно короче.
| | Sprint Review | Sprint Retrospective |
|---|---|---|
| Что проверяет | **продукт**: результат спринта, продвижение к Product Goal, изменения в окружении | **способ работы**: люди, взаимодействия, процессы, инструменты, Definition of Done |
| Кто | Scrum-команда **и ключевые стейкхолдеры** | Scrum-команда |
| Результат | скорректированный Product Backlog, договорённость, что делать дальше | улучшения, возможно добавленные в следующий Sprint Backlog |
| Место и таймбокс | предпоследнее; максимум 4 часа | последнее, завершает спринт; максимум 3 часа |
> Зацепка (Memory hook): **Review = продукт, Retrospective = процесс.** Review смотрит наружу вместе со стейкхолдерами; Retrospective — внутрь команды.
## Все пять событий в одной таблице
| Событие | Цель | Кто | Таймбокс (месячный спринт) |
|---|---|---|---|
| Sprint | контейнер; превращать идеи в ценность | вся Scrum-команда | фиксированная длина, месяц или меньше |
| Sprint Planning | запустить спринт: почему, что, как → Sprint Backlog | вся Scrum-команда (+ приглашённые советники) | максимум 8 часов |
| Daily Scrum | проверить продвижение к цели спринта, адаптировать Sprint Backlog | разработчики | 15 минут, каждый рабочий день |
| Sprint Review | проверить результат, определить будущие адаптации | Scrum-команда + ключевые стейкхолдеры | максимум 4 часа |
| Sprint Retrospective | спланировать, как повысить качество и эффективность | Scrum-команда | максимум 3 часа |
@diagram pm7-scrum-flow
= One-month Sprint: Planning ≤ 8 h | Daily Scrum 15 min | Review ≤ 4 h | Retrospective ≤ 3 h
## Пример расчёта: таймбоксы для двухнедельного спринта
Слайды дают максимумы только для **месячного спринта** и говорят: «для коротких спринтов событие обычно короче». Распространённое эмпирическое правило (его нет на слайдах) — уменьшать их пропорционально длине спринта:
= 2-week Sprint ≈ 1/2 month → Planning 8 h × 1/2 = 4 h; Review 4 h × 1/2 = 2 h; Retro 3 h × 1/2 = 1.5 h; Daily Scrum = 15 min
- За 10 рабочих дней проходит около 10 Daily Scrum. Тогда все события вместе занимают примерно восьмую часть времени команды — и, как сказано на слайде, заменяют большинство других встреч:
= 4 h + 2 h + 1.5 h + 10 × 0.25 h = 10 h of events per 80 working hours = 12.5%
> Ловушка экзамена: если в вопросе «a one-month Sprint», отвечайте 8 / 4 / 3 часа и 15 минут. Для более короткого спринта ответ по слайду — только «usually shorter»; пропорциональные цифры — эмпирическое правило.
## Порядок внутри спринта
- Sprint Planning (**запускает** спринт) → Daily Scrum (каждый рабочий день) → Sprint Review (**предпоследнее**) → Sprint Retrospective (**завершает** спринт) → следующий спринт **начинается сразу**.
?? CEO просит Scrum Master отменить текущий спринт, потому что конкурент выпустил похожую функцию. Что должно произойти?
?= Право отменить спринт есть только у Product Owner и только если цель спринта устарела. Scrum Master отменить его не может; CEO стоит принести новость Product Owner, который решит, устарела ли цель.
?? Во время спринта разработчик выясняет, что выбранный элемент вдвое больше, чем ожидалось. Нарушает ли это правило «никаких изменений, угрожающих цели спринта»?
?= Нет. Объём можно уточнять и пересогласовывать с Product Owner по мере того, как узнаётся новое. Разработчики и PO договариваются об объёме Sprint Backlog, не затрагивая цель спринта.
?? Какое событие проверяет сам Definition of Done, а какое — результат спринта вместе со стейкхолдерами?
?= Sprint Retrospective проверяет людей, взаимодействия, процессы, инструменты и Definition of Done; Sprint Review проверяет результат спринта вместе с ключевыми стейкхолдерами.
## Что спросят на экзамене (Exam focus)
- Спринт — **контейнер**; события создают **регулярность** и **сокращают встречи, не определённые в Scrum**; в идеале — **то же время и место**.
- Спринт: **сердцебиение**, **фиксированная длина, месяц или меньше**, следующий начинается **сразу**; четыре правила «During the Sprint».
- Слишком длинный → цель устаревает, сложность и риск растут; короче → **больше циклов обучения**, риск затрат и усилий ограничен; каждый спринт = **короткий проект**.
- **Burn-down, burn-up, cumulative flow** не заменяют **эмпиризм**; решения — только по тому, что уже произошло.
- Отменяет **только Product Owner**, если **цель спринта устарела**.
- Planning: **почему / что / как**; цель спринта утверждается **до конца Planning**; разработчики выбирают элементы **в обсуждении с PO**; как — **исключительно на усмотрение разработчиков**; рабочие единицы **по дню или меньше**; **максимум 8 часов**.
- Daily Scrum: **15 минут, для разработчиков**, то же время и место, **каждый рабочий день**; PO и SM — только **как разработчики**; любая структура; **не единственный момент** для изменения плана.
- Review: проверка **результата**, **рабочая сессия**, а не презентация, **предпоследнее**, **максимум 4 часа**.
- Retrospective: **качество и эффективность**; люди, взаимодействия, процессы, инструменты, **Definition of Done**; улучшения можно внести в **следующий Sprint Backlog**; **завершает** спринт, **максимум 3 часа**.`,
  },
  [
    qx("According to the Scrum Guide, why does Scrum use events?", "To create regularity and minimize meetings not defined in Scrum", [
      ["To report the team's status to management at fixed, regular intervals", "Events are opportunities for the team to inspect and adapt, not status reports to managers.", "События — возможность для команды проверить и адаптировать работу, а не отчёты о статусе для руководства."],
      ["To give the Scrum Master control over the team's work", "The team is self-managing; the Scrum Master ensures events happen, but does not control the work through them.", "Команда самоуправляема; Scrum Master следит, чтобы события проходили, но не управляет через них работой."],
      ["To replace the need for any artifacts or documentation", "Events exist to inspect and adapt the artifacts — they do not replace them.", "События нужны, чтобы проверять и адаптировать артефакты, — они их не заменяют."],
    ], "\"Events are used in Scrum to create regularity and to minimize the need for meetings not defined in Scrum.\"", "«Events are used in Scrum to create regularity and to minimize the need for meetings not defined in Scrum» — регулярность и меньше лишних встреч."),
    qx("What does the Scrum Guide 2020 say about the length of a Sprint?", "Fixed length events of one month or less", [
      ["One or two weeks, chosen anew for each Sprint", "\"One or two-week\" is Lecture 6's wording; the Guide sets a fixed length (the same each Sprint) of one month or less.", "«One or two-week» — формулировка лекции 6; Guide задаёт фиксированную длину (одинаковую каждый спринт) — месяц или меньше."],
      ["Two to four weeks, depending on the scope", "\"2–4 weeks\" is from Lecture 6's figure, and the length does not depend on scope — it is fixed.", "«2–4 weeks» — с рисунка лекции 6, и длина не зависит от объёма — она фиксирована."],
      ["Exactly two weeks for every team", "Two weeks is a common choice, not a rule; the limit is one month or less.", "Две недели — частый выбор, а не правило; предел — месяц или меньше."],
    ], "\"They are fixed length events of one month or less to create consistency.\"", "«They are fixed length events of one month or less to create consistency» — фиксированная длина, месяц или меньше."),
    qx("When does a new Sprint start, according to the Scrum Guide?", "Immediately after the conclusion of the previous Sprint", [
      ["After a short break used for refinement and release preparation", "There is no gap between Sprints; refinement happens during the Sprint as needed.", "Промежутков между спринтами нет; уточнение бэклога идёт внутри спринта по мере необходимости."],
      ["When the Product Owner approves the next release", "Releases are not tied to Sprint boundaries, and no approval is needed to start the next Sprint.", "Релизы не привязаны к границам спринта, и для начала следующего спринта одобрение не нужно."],
      ["After the Increment has been released to customers", "An Increment may be released before the end of the Sprint; the next Sprint does not wait for a release.", "Инкремент можно выпустить до конца спринта; следующий спринт не ждёт релиза."],
    ], "\"A new Sprint starts immediately after the conclusion of the previous Sprint.\"", "«A new Sprint starts immediately after the conclusion of the previous Sprint» — сразу после окончания предыдущего."),
    qx("Which of the following is NOT one of the Scrum Guide's rules for what happens during the Sprint?", "The Sprint Backlog cannot change after Sprint Planning", [
      ["No changes are made that would endanger the Sprint Goal", "This is the first \"During the Sprint\" rule, word for word.", "Это первое правило «During the Sprint», дословно."],
      ["Quality does not decrease", "This is the second \"During the Sprint\" rule.", "Это второе правило «During the Sprint»."],
      ["Scope may be clarified and renegotiated with the PO", "This is the fourth rule: scope may be clarified and renegotiated with the Product Owner as more is learned.", "Это четвёртое правило: объём можно уточнять и пересогласовывать с Product Owner по мере того, как узнаётся новое."],
    ], "The Sprint Backlog is updated throughout the Sprint as more is learned; only the Sprint Goal is protected. The four rules: no changes endangering the Sprint Goal; quality does not decrease; the Product Backlog is refined as needed; scope may be clarified and renegotiated.", "Sprint Backlog обновляется на протяжении спринта; защищена только цель. Четыре правила: никаких изменений, угрожающих цели; качество не снижается; Product Backlog уточняется по мере необходимости; объём можно уточнять и пересогласовывать."),
    qx("According to the Scrum Guide, what can happen when a Sprint's horizon is too long?", "The Sprint Goal may become invalid and risk may increase", [
      ["The Daily Scrum timebox must be extended beyond 15 minutes", "The Daily Scrum is a 15-minute event regardless of Sprint length.", "Daily Scrum длится 15 минут при любой длине спринта."],
      ["The Developers lose their accountability for quality", "Accountabilities do not depend on Sprint length; Developers always instil quality by adhering to the DoD.", "Подотчётности не зависят от длины спринта; разработчики всегда встраивают качество через DoD."],
      ["The Product Goal is automatically fulfilled sooner", "Longer Sprints do not speed up the Product Goal; they delay inspection and adaptation.", "Длинные спринты не ускоряют достижение Product Goal; они откладывают проверку и адаптацию."],
    ], "\"When a Sprint's horizon is too long the Sprint Goal may become invalid, complexity may rise, and risk may increase.\"", "«When a Sprint's horizon is too long the Sprint Goal may become invalid, complexity may rise, and risk may increase» — цель устаревает, сложность и риск растут."),
    qx("Why might a team choose shorter Sprints, according to the Scrum Guide?", "To generate more learning cycles and limit risk", [
      ["To fit more Product Backlog items into each Sprint", "A shorter Sprint holds less work, not more; the benefit is faster feedback.", "В короткий спринт входит меньше работы, а не больше; выигрыш — более быстрая обратная связь."],
      ["To reduce the number of Scrum events per month", "Shorter Sprints mean more Sprints, so events happen more often, not less.", "Короче спринты — значит больше спринтов, поэтому события проходят чаще, а не реже."],
      ["To avoid holding a Sprint Retrospective every time", "Every Sprint ends with a Retrospective; skipping events loses opportunities to inspect and adapt.", "Каждый спринт заканчивается ретроспективой; пропуск событий лишает возможностей проверки и адаптации."],
    ], "\"Shorter Sprints can be employed to generate more learning cycles and limit risk of cost and effort to a smaller time frame.\"", "«Shorter Sprints can be employed to generate more learning cycles and limit risk of cost and effort to a smaller time frame» — больше циклов обучения, меньше риск."),
    qx("What does the Scrum Guide say about burn-downs, burn-ups and cumulative flows?", "Useful for forecasting, but they do not replace empiricism", [
      ["Mandatory artifacts that every Scrum Team must keep", "Scrum has three artifacts (Product Backlog, Sprint Backlog, Increment); charts are optional practices.", "В Scrum три артефакта (Product Backlog, Sprint Backlog, Increment); диаграммы — необязательные практики."],
      ["Inaccurate tools that should be avoided in Scrum", "The slide calls them \"proven useful\"; the warning is only that they cannot replace empiricism.", "Слайд называет их «proven useful»; предупреждение лишь в том, что они не заменяют эмпиризм."],
      ["The most reliable way to predict what will happen in complex work", "In complex environments what will happen is unknown; only what has already happened can guide decisions.", "В сложной среде будущее неизвестно; решения может направлять только то, что уже произошло."],
    ], "\"Various practices exist to forecast progress, like burn-downs, burn-ups, or cumulative flows. While proven useful, these do not replace the importance of empiricism.\"", "«Various practices exist to forecast progress, like burn-downs, burn-ups, or cumulative flows. While proven useful, these do not replace the importance of empiricism»."),
    qx("Who can cancel a Sprint, and when?", "Only the PO, if the Sprint Goal becomes obsolete", [
      ["Only the Scrum Master, if the team falls behind", "The Scrum Master has no authority to cancel, and falling behind is not a reason — scope is renegotiated instead.", "У Scrum Master нет права отмены, а отставание — не причина: вместо этого пересогласуют объём."],
      ["The Developers, if they cannot finish all items", "Developers renegotiate scope with the PO; they cannot cancel the Sprint.", "Разработчики пересогласовывают объём с PO; отменить спринт они не могут."],
      ["Any stakeholder, if market priorities change", "Stakeholders can bring news to the PO, but only the Product Owner has the authority to cancel.", "Стейкхолдеры могут сообщить новости PO, но право отмены есть только у Product Owner."],
    ], "\"A Sprint could be cancelled if the Sprint Goal becomes obsolete. Only the Product Owner has the authority to cancel the Sprint.\"", "«A Sprint could be cancelled if the Sprint Goal becomes obsolete. Only the Product Owner has the authority to cancel the Sprint»."),
    qx("In Sprint Planning, who defines the Sprint Goal?", "The whole Scrum Team, after the PO proposes the value", [
      ["The Product Owner alone, before Sprint Planning starts", "The PO proposes how the product could increase its value, but the Sprint Goal is defined together during Planning.", "PO предлагает, как продукт мог бы повысить ценность, но цель спринта формулируют вместе во время Planning."],
      ["The Developers alone, during topic three", "Topic three is about how; the Sprint Goal is topic one, defined by the whole team.", "Третья тема — о том, как; цель спринта — первая тема, её формулирует вся команда."],
      ["The Scrum Master, based on the team's velocity", "The Scrum Master does not set goals; velocity is not part of the Scrum Guide.", "Scrum Master не ставит цели; velocity в Scrum Guide нет."],
    ], "Topic One: \"The Product Owner proposes how the product could increase its value and utility in the current Sprint. The whole Scrum Team then collaborates to define a Sprint Goal… The Sprint Goal must be finalized prior to the end of Sprint Planning.\"", "Тема первая: PO предлагает, как повысить ценность и полезность продукта; затем вся Scrum-команда вместе формулирует цель спринта, и её надо окончательно согласовать до конца Sprint Planning."),
    qx("In topic two of Sprint Planning (\"What can be Done this Sprint?\"), who selects the Product Backlog items?", "The Developers, through discussion with the PO", [
      ["The Product Owner, who assigns them to the team", "The PO orders the backlog and discusses it, but does not assign work; the Developers select.", "PO упорядочивает бэклог и обсуждает его, но не назначает работу; выбирают разработчики."],
      ["The Scrum Master, based on the team's capacity", "Capacity informs the Developers' forecast; the Scrum Master does not select items.", "Загрузка помогает прогнозу разработчиков; Scrum Master элементы не выбирает."],
      ["The stakeholders, by voting on the top items", "Stakeholders influence the backlog through the PO; they do not select Sprint work.", "Стейкхолдеры влияют на бэклог через PO; работу на спринт они не выбирают."],
    ], "\"Through discussion with the Product Owner, the Developers select items from the Product Backlog to include in the current Sprint.\"", "«Through discussion with the Product Owner, the Developers select items from the Product Backlog to include in the current Sprint» — выбирают разработчики, обсуждая с PO."),
    qx("According to the Scrum Guide, how the selected items are turned into an Increment is decided by:", "the Developers, at their sole discretion", [
      ["the Product Owner, who knows the value", "The PO decides what is most valuable, not how it is built.", "PO решает, что ценнее, но не то, как это строить."],
      ["the Scrum Master, who knows Scrum best", "The Scrum Master coaches, but \"no one else tells them how\".", "Scrum Master коучит, но «no one else tells them how»."],
      ["the architect or tech lead outside the team", "Nobody outside the Developers decides the how; there are no hierarchies above them in Scrum.", "Никто вне разработчиков не решает, как делать; иерархий над ними в Scrum нет."],
    ], "\"How this is done is at the sole discretion of the Developers. No one else tells them how to turn Product Backlog items into Increments of value.\"", "«How this is done is at the sole discretion of the Developers. No one else tells them how…» — исключительно на усмотрение разработчиков."),
    qx("During Sprint Planning, the Developers often decompose Product Backlog items into smaller work items of what size?", "One day or less", [
      ["Half a Sprint or less", "Half a Sprint is far too large to inspect daily; the slide says one day or less.", "Полспринта — слишком много для ежедневной проверки; на слайде — день или меньше."],
      ["Two hours", "There is no fixed two-hour rule; the slide gives one day or less.", "Правила «два часа» нет; на слайде — день или меньше."],
      ["One week or less", "A week-long task is too big to show progress at a Daily Scrum; the slide says one day or less.", "Задача на неделю слишком велика, чтобы показывать прогресс на Daily Scrum; на слайде — день или меньше."],
    ], "\"This is often done by decomposing Product Backlog items into smaller work items of one day or less.\"", "«…decomposing Product Backlog items into smaller work items of one day or less» — рабочие единицы по дню или меньше."),
    qx("A team runs one-month Sprints. Which set of maximum timeboxes matches the Scrum Guide?", "Planning 8 h, Review 4 h, Retrospective 3 h", [
      ["Planning 4 h, Review 2 h, Retrospective 1.5 h", "These are the proportional numbers for a two-week Sprint (a rule of thumb), not the one-month maximums.", "Это пропорциональные цифры для двухнедельного спринта (эмпирическое правило), а не максимумы для месячного."],
      ["Planning 8 h, Review 3 h, Retrospective 4 h", "Review and Retrospective are swapped: the Review is up to 4 hours, the Retrospective up to 3.", "Review и Retrospective переставлены: Review до 4 часов, Retrospective до 3."],
      ["Planning 8 h, Review 4 h, Retrospective 4 h", "The Retrospective is timeboxed to a maximum of three hours, not four.", "Таймбокс ретроспективы — максимум три часа, а не четыре."],
    ], "For a one-month Sprint: Sprint Planning max eight hours, Sprint Review max four hours, Sprint Retrospective max three hours (Daily Scrum 15 minutes).", "Для месячного спринта: Sprint Planning — максимум 8 часов, Sprint Review — максимум 4, Sprint Retrospective — максимум 3 (Daily Scrum — 15 минут)."),
    qx("The Product Owner wants to attend the Daily Scrum. According to the Scrum Guide, the PO participates:", "Only as a Developer, if actively working on Sprint Backlog items", [
      ["Every day, to approve the Developers' plan for the next day of work", "The plan for the next day belongs to the Developers; nobody approves it.", "План на следующий день принадлежит разработчикам; никто его не утверждает."],
      ["As the facilitator, since the PO owns the backlog", "The Daily Scrum is the Developers' event; owning the Product Backlog gives no role in running it.", "Daily Scrum — событие разработчиков; владение Product Backlog не даёт роли в его проведении."],
      ["Never — the PO is not allowed to be present at all", "The Guide does not forbid it: if the PO actively works on Sprint Backlog items, they participate as a Developer.", "Guide этого не запрещает: если PO активно работает над элементами Sprint Backlog, он участвует как разработчик."],
    ], "\"If the Product Owner or Scrum Master are actively working on items in the Sprint Backlog, they participate as Developers.\"", "«If the Product Owner or Scrum Master are actively working on items in the Sprint Backlog, they participate as Developers» — только как разработчики."),
    qx("Which statement about the structure of the Daily Scrum is correct under the Scrum Guide 2020?", "Any structure, if it focuses on the Sprint Goal and yields a plan", [
      ["Each Developer must answer the three standard questions", "The three questions come from older descriptions (Lecture 6's figure); the 2020 Guide lets Developers choose any structure.", "Три вопроса — из старых описаний (рисунок лекции 6); Guide 2020 разрешает разработчикам любую структуру."],
      ["The Scrum Master runs it and collects status updates", "It is the Developers' event, not a status report to the Scrum Master.", "Это событие разработчиков, а не отчёт о статусе для Scrum Master."],
      ["It must be held standing at the task board, with every Developer present", "Standing and boards are optional techniques; the Guide only requires focus on the Sprint Goal and an actionable plan.", "Стоя и у доски — необязательные приёмы; Guide требует только фокуса на цели спринта и конкретного плана."],
    ], "\"The Developers can select whatever structure and techniques they want, as long as their Daily Scrum focuses on progress toward the Sprint Goal and produces an actionable plan for the next day of work.\"", "«The Developers can select whatever structure and techniques they want, as long as their Daily Scrum focuses on progress toward the Sprint Goal and produces an actionable plan for the next day of work»."),
    qx("Which statement best describes the Sprint Review?", "A working session to inspect the outcome and decide next steps", [
      ["A formal demo at which stakeholders approve the Increment for release", "The Guide warns against limiting it to a presentation, and the Review is never a gate to releasing value.", "Guide предостерегает от сведения обзора к презентации, и Review никогда не является «воротами» к релизу."],
      ["A team-only meeting on processes, tools and interactions", "That is the Sprint Retrospective; the Review involves key stakeholders and inspects the outcome.", "Это Sprint Retrospective; на Review присутствуют ключевые стейкхолдеры и проверяется результат."],
      ["The last event of the Sprint, timeboxed to three hours", "The last event is the Retrospective (3 hours); the Review is second to last, up to 4 hours.", "Последнее событие — Retrospective (3 часа); Review — предпоследнее, до 4 часов."],
    ], "\"The purpose of the Sprint Review is to inspect the outcome of the Sprint and determine future adaptations… The Sprint Review is a working session and the Scrum Team should avoid limiting it to a presentation.\"", "«…inspect the outcome of the Sprint and determine future adaptations… The Sprint Review is a working session…» — рабочая сессия, а не презентация."),
    qx("Which event does the Scrum Guide call \"the second to last event of the Sprint\"?", "Sprint Review", [
      ["Sprint Retrospective", "The Retrospective concludes the Sprint — it is the last event.", "Ретроспектива завершает спринт — это последнее событие."],
      ["Daily Scrum", "The Daily Scrum happens every working day, not at a fixed place near the end.", "Daily Scrum проходит каждый рабочий день, а не в определённый момент в конце."],
      ["Sprint Planning", "Sprint Planning initiates the Sprint — it is the first event.", "Sprint Planning запускает спринт — это первое событие."],
    ], "\"The Sprint Review is the second to last event of the Sprint and is timeboxed to a maximum of four hours for a one-month Sprint.\"", "«The Sprint Review is the second to last event of the Sprint…» — предпоследнее событие, до 4 часов."),
    qx("In the Sprint Retrospective, the Scrum Team inspects how the last Sprint went with regard to:", "individuals, interactions, processes, tools and the DoD", [
      ["the Increment, progress toward the Product Goal and market changes", "These are inspected at the Sprint Review with stakeholders.", "Это проверяется на Sprint Review вместе со стейкхолдерами."],
      ["velocity, burn-down and each person's output", "The Guide does not list metrics or individual output; it lists individuals, interactions, processes, tools and the DoD.", "Guide не перечисляет метрики и выработку каждого; он называет людей, взаимодействия, процессы, инструменты и DoD."],
      ["the Product Backlog order and the release plan", "Backlog order is the PO's accountability and is adjusted at the Review, not the Retrospective's focus.", "Порядок бэклога — подотчётность PO и корректируется на Review; это не предмет ретроспективы."],
    ], "\"The Scrum Team inspects how the last Sprint went with regards to individuals, interactions, processes, tools, and their Definition of Done.\"", "«The Scrum Team inspects how the last Sprint went with regards to individuals, interactions, processes, tools, and their Definition of Done»."),
    tfx("The most impactful improvements identified at the Sprint Retrospective may even be added to the Sprint Backlog for the next Sprint.", true,
      "Word for word: \"The most impactful improvements are addressed as soon as possible. They may even be added to the Sprint Backlog for the next Sprint.\"",
      "Дословно: «The most impactful improvements are addressed as soon as possible. They may even be added to the Sprint Backlog for the next Sprint».",
      "\"False\" would leave improvements as notes that nobody plans; the Guide puts them into the next Sprint's plan so that inspection leads to adaptation.",
      "«Неверно» оставило бы улучшения заметками, которые никто не планирует; Guide вносит их в план следующего спринта, чтобы проверка вела к адаптации."),
    tfx("Developers may adjust their Sprint plan only during the Daily Scrum.", false,
      "\"The Daily Scrum is not the only time Developers are allowed to adjust their plan. They often meet throughout the day for more detailed discussions about adapting or re-planning the rest of the Sprint's work.\"",
      "«The Daily Scrum is not the only time Developers are allowed to adjust their plan» — они часто встречаются в течение дня, чтобы адаптировать или перепланировать работу.",
      "\"True\" would delay adaptation by up to a day, against the rule to adapt the moment something new is learned.",
      "«Верно» задерживало бы адаптацию до суток — вопреки правилу адаптироваться в тот момент, когда узнали новое."),
  ],
);

const p4 = part(
  "pm-l7-p4",
  { en: "Scrum artifacts and their commitments", ru: "Артефакты Scrum и их обязательства" },
  {
    en: `## Scrum artifacts
- Scrum's artifacts **represent work or value**. They are designed to **maximize transparency of key information**. Thus, everyone inspecting them has **the same basis for adaptation**.
- Each artifact **contains a commitment** to ensure it provides information that **enhances transparency and focus against which progress can be measured**:
| Artifact | Commitment | What the commitment gives |
|---|---|---|
| Product Backlog | Product Goal | the long-term target the whole backlog serves |
| Sprint Backlog | Sprint Goal | the single objective that keeps the Sprint focused |
| Increment | Definition of Done | the quality bar that says when work counts as part of the Increment |
- These commitments exist to **reinforce empiricism and the Scrum values** for the Scrum Team and their stakeholders.
@diagram pm7-artifact-commitments
= 3 artifacts ↔ 3 commitments: Product Backlog ↔ Product Goal | Sprint Backlog ↔ Sprint Goal | Increment ↔ Definition of Done
> Exam trap: the commitments are **not extra artifacts**. Scrum has **three artifacts** (Product Backlog, Sprint Backlog, Increment) and **three commitments** (Product Goal, Sprint Goal, Definition of Done), and the pairs are fixed: "Sprint Backlog ↔ Definition of Done" or "Increment ↔ Sprint Goal" is wrong. Lecture 6 lists the artifacts without commitments.
## Product Backlog
> The Product Backlog is **an emergent, ordered list of what is needed to improve the product**. It is **the single source of work undertaken by the Scrum Team**.
| Word | Meaning |
|---|---|
| emergent | it grows and changes as the team and stakeholders learn; it is never "complete" |
| ordered | items stand in one sequence chosen by the Product Owner — not just "high / medium / low" |
| what is needed to improve the product | features, fixes, technical work, experiments — anything that improves the product |
| single source of work | the team does not take work from side channels such as e-mails or personal requests |
- Product Backlog items that **can be Done by the Scrum Team within one Sprint** are deemed **ready for selection** in a Sprint Planning event. They usually acquire this degree of transparency **after refining activities**.
- **Product Backlog refinement** is the act of **breaking down and further defining Product Backlog items into smaller more precise items**. This is an **ongoing activity** to add details, such as a **description, order, and size**. Attributes often vary with the domain of work.
- **The Developers who will be doing the work are responsible for the sizing.** The Product Owner **may influence the Developers by helping them understand and select trade-offs**.
- IT example: the item "Users can pay for orders" is too big for one Sprint. During refinement it is split into "pay by card", "pay by Apple Pay", "save the card for next time" and "refund to card"; each gets a description, a place in the order and a size from the Developers. "Pay by card" can now be Done within one Sprint, so it is ready for selection.
> Exam trap: the 2020 wording is **"emergent, ordered"** and **"single source of work"**; Lecture 6 says "prioritized list … single source of **requirements**". On a Scrum Guide question choose the 2020 words.
> Exam trap: refinement is an **ongoing activity**, not an event and not a timeboxed meeting (Lecture 6 calls it a meeting). **Sizing is done by the Developers** who will do the work — not by the Product Owner, the Scrum Master or a manager. "Definition of Ready" is not a Scrum Guide term; the slide says "ready for selection".
## Commitment: Product Goal
> The Product Goal describes **a future state of the product which can serve as a target for the Scrum Team to plan against**.
- The Product Goal **is in the Product Backlog**. The rest of the Product Backlog **emerges to define "what" will fulfill the Product Goal**.
- The Product Goal is **the long-term objective for the Scrum Team**. They must **fulfill (or abandon) one objective before taking on the next**.
- **A product is a vehicle to deliver value.** It has a **clear boundary, known stakeholders, well-defined users or customers**. A product could be **a service, a physical product, or something more abstract**.
| Product example | Boundary | Stakeholders and users |
|---|---|---|
| a university mobile app | schedule, grades and news for students | students, teachers, the IT department |
| an internal payroll service | payroll calculation and payslips | the HR and accounting departments |
| a public API for partners | the endpoints partners can call | partner developers, the sales team |
- Product Goal example: "By the end of the year, students can do everything they now do on the web portal — schedule, grades, retakes — from the mobile app."
> Exam trap: **one Product Goal at a time** — the team fulfills or abandons it before the next one. The Product Goal is long-term; the **Sprint Goal** is the objective of a single Sprint.
## Sprint Backlog
> The Sprint Backlog is composed of **the Sprint Goal (why)**, **the set of Product Backlog items selected for the Sprint (what)**, as well as **an actionable plan for delivering the Increment (how)**.
- The Sprint Backlog is **a plan by and for the Developers**.
- It is **a highly visible, real-time picture of the work** that the Developers plan to accomplish during the Sprint in order to achieve the Sprint Goal.
- Consequently, the Sprint Backlog is **updated throughout the Sprint as more is learned**.
- It should have **enough detail that they can inspect their progress in the Daily Scrum**.
> Exam trap: Lecture 6 defines the sprint backlog as a "subset of items from the product backlog"; the 2020 Guide adds the **Sprint Goal** and the **plan** — why + what + how. The Sprint Backlog belongs to the **Developers**: the PO and managers do not push tasks into it.
## Commitment: Sprint Goal
> The Sprint Goal is **the single objective for the Sprint**.
- Although the Sprint Goal is **a commitment by the Developers**, it provides **flexibility in terms of the exact work needed to achieve it**.
- The Sprint Goal also creates **coherence and focus**, encouraging the Scrum Team to **work together rather than on separate initiatives**.
- It is **created during the Sprint Planning event and then added to the Sprint Backlog**.
- As the Developers work during the Sprint, they **keep the Sprint Goal in mind**.
- If the work turns out to be different than they expected, they **collaborate with the Product Owner to negotiate the scope of the Sprint Backlog within the Sprint without affecting the Sprint Goal**.
- IT example: Sprint Goal "A customer can pay for an order by card". Midway, the Developers find that saving cards needs extra security work. Together with the PO they drop "save the card" from this Sprint; the goal — paying by card — stays.
> Exam trap: **flexible scope, fixed goal**. The exact items may change through negotiation with the PO, the goal may not. The Sprint Goal is a commitment **by the Developers**, while defining it at Planning is a collaboration of the **whole Scrum Team**.
## Increment
> An Increment is **a concrete stepping stone toward the Product Goal**.
- Each Increment is **additive to all prior Increments** and **thoroughly verified**, ensuring that **all Increments work together**.
- In order to provide value, **the Increment must be usable**.
- **Multiple Increments may be created within a Sprint.** The sum of the Increments is **presented at the Sprint Review**, thus supporting empiricism.
- However, **an Increment may be delivered to stakeholders prior to the end of the Sprint**. **The Sprint Review should never be considered a gate to releasing value.**
- **Work cannot be considered part of an Increment unless it meets the Definition of Done.**
> Exam trap: the Increment is **not** "one per Sprint, released only after the Review". A team practising continuous delivery may release several Increments during a Sprint; the Review inspects their sum. Lecture 6 calls it the "product increment".
## Commitment: Definition of Done
> The Definition of Done is **a formal description of the state of the Increment when it meets the quality measures required for the product**.
- **The moment a Product Backlog item meets the Definition of Done, an Increment is born.**
- The Definition of Done **creates transparency** by providing everyone **a shared understanding of what work was completed** as part of the Increment.
- If a Product Backlog item does not meet the Definition of Done, it **cannot be released or even presented at the Sprint Review**. Instead, it **returns to the Product Backlog for future consideration**.
- If the Definition of Done for an increment is **part of the standards of the organization**, **all Scrum Teams must follow it as a minimum**.
- If it is **not an organizational standard**, **the Scrum Team must create a Definition of Done appropriate for the product**.
- **The Developers are required to conform to the Definition of Done.**
- If there are **multiple Scrum Teams working together on a product**, they must **mutually define and comply with the same Definition of Done**.
| Example DoD for a web app (an illustration, not from the slides) |
|---|
| code reviewed by another Developer |
| unit and integration tests written and passing |
| no critical warnings from the security scanner |
| deployed to the staging environment |
| user-facing text available in all supported languages |
> Exam trap: an unfinished item is **not** shown at the Review "as 90% done" and is **not** automatically carried into the next Sprint — it **returns to the Product Backlog**. The organization's DoD is a **minimum**: a team may make it stricter, never weaker. Acceptance criteria of one item (a term not on the slides) are not the DoD, which applies to every item.
## Putting it together: one item's journey
| Step | Artifact / commitment | Who |
|---|---|---|
| "Pay by card" is written and ordered toward the Product Goal | Product Backlog / Product Goal | Product Owner (may delegate the writing) |
| refined: split, described, sized | Product Backlog | Developers size; the PO explains trade-offs |
| selected at Sprint Planning, plan made | Sprint Backlog / Sprint Goal | Developers, through discussion with the PO |
| built, tested, meets the DoD → an Increment is born | Increment / Definition of Done | Developers |
| shown at the Sprint Review (or released earlier) | Increment | Scrum Team and key stakeholders |
?? A story is coded but its integration tests fail on the last day of the Sprint. Can the team show it at the Sprint Review as "almost done"?
?= No. If a Product Backlog item does not meet the Definition of Done, it cannot be released or even presented at the Sprint Review; it returns to the Product Backlog for future consideration.
?? The company has an organization-wide Definition of Done. A team wants to add "performance test passed". Is that allowed?
?= Yes. The organizational DoD must be followed as a minimum, so a team may add stricter criteria. If several teams work on one product, they must mutually define and comply with the same DoD.
?? Who sizes Product Backlog items, and how can the Product Owner influence the sizes?
?= The Developers who will be doing the work are responsible for the sizing; the Product Owner may influence them by helping them understand and select trade-offs.
## Lecture 6 vs Lecture 7 — artifacts
| Topic | Lecture 6 (Griffiths) | Lecture 7 (Scrum Guide 2020) |
|---|---|---|
| Product Backlog | dynamic and evolving **prioritized** list, single source of **requirements** | **emergent, ordered** list, single source of **work**; commitment: **Product Goal** |
| Sprint Backlog | subset of items selected as the goal of a sprint | Sprint Goal (why) + selected items (what) + plan (how); commitment: **Sprint Goal** |
| Increment | product increment, demonstrated for feedback | stepping stone: additive, verified, usable; commitment: **Definition of Done** |
| Refinement | a meeting | an **ongoing activity** |
## Exam focus
- Artifacts **represent work or value** and **maximize transparency**; each has a **commitment**: Product Backlog → **Product Goal**, Sprint Backlog → **Sprint Goal**, Increment → **Definition of Done**; the commitments **reinforce empiricism and the Scrum values**.
- Product Backlog: **emergent, ordered**, **single source of work**; **ready for selection** = can be Done within one Sprint; refinement is **ongoing**: breaking down and defining items (**description, order, size**); **Developers size**, the PO influences through **trade-offs**.
- Product Goal: a **future state** of the product, the **long-term objective**, lives **in the Product Backlog**; fulfill **or abandon** one before the next; a product = **a vehicle to deliver value** with a clear boundary, known stakeholders, well-defined users.
- Sprint Backlog: **why + what + how**; **by and for the Developers**; real-time, **updated throughout the Sprint**; enough detail for the Daily Scrum.
- Sprint Goal: the **single objective**; a commitment **by the Developers**; flexible on the exact work; scope negotiated **with the PO without affecting the goal**.
- Increment: a **stepping stone**, **additive**, **thoroughly verified**, **usable**; **several per Sprint** are possible; may be **delivered before the end** of the Sprint; the Review is **never a gate**.
- Definition of Done: a **formal description** of the Increment meeting the **quality measures**; meeting it = **an Increment is born**; not Done → **not released, not presented, back to the Product Backlog**; the organizational DoD is a **minimum**; several teams → **the same DoD**.`,
    ru: `## Артефакты Scrum
- Артефакты Scrum **представляют работу или ценность (represent work or value)**. Они задуманы, чтобы **максимизировать прозрачность ключевой информации**. Поэтому у всех, кто их проверяет, **одна и та же основа для адаптации**.
- Каждый артефакт **содержит обязательство (commitment)**, которое гарантирует, что он даёт информацию, **повышающую прозрачность и фокус и позволяющую измерять прогресс**:
| Артефакт | Обязательство | Что даёт обязательство |
|---|---|---|
| Product Backlog (бэклог продукта) | Product Goal (цель продукта) | долгосрочную цель, которой служит весь бэклог |
| Sprint Backlog (бэклог спринта) | Sprint Goal (цель спринта) | единственную цель, которая держит спринт в фокусе |
| Increment (инкремент) | Definition of Done (критерии готовности) | планку качества: когда работа считается частью инкремента |
- Эти обязательства существуют, чтобы **укреплять эмпиризм и ценности Scrum** для Scrum-команды и её стейкхолдеров.
@diagram pm7-artifact-commitments
= 3 artifacts ↔ 3 commitments: Product Backlog ↔ Product Goal | Sprint Backlog ↔ Sprint Goal | Increment ↔ Definition of Done
> Ловушка экзамена (Exam trap): обязательства — **не дополнительные артефакты**. В Scrum **три артефакта** (Product Backlog, Sprint Backlog, Increment) и **три обязательства** (Product Goal, Sprint Goal, Definition of Done), и пары фиксированы: «Sprint Backlog ↔ Definition of Done» или «Increment ↔ Sprint Goal» — неверно. В лекции 6 артефакты перечислены без обязательств.
## Бэклог продукта (Product Backlog)
> Product Backlog — **возникающий, упорядоченный список того, что нужно для улучшения продукта (an emergent, ordered list)**. Это **единственный источник работы, которую берёт на себя Scrum-команда (single source of work)**.
| Слово | Смысл |
|---|---|
| emergent (возникающий) | растёт и меняется по мере того, как команда и стейкхолдеры узнают новое; никогда не бывает «полным» |
| ordered (упорядоченный) | элементы стоят в одной последовательности, выбранной Product Owner, — а не просто «высокий / средний / низкий» |
| what is needed to improve the product (что нужно для улучшения продукта) | функции, исправления, техническая работа, эксперименты — всё, что улучшает продукт |
| single source of work (единственный источник работы) | команда не берёт работу по боковым каналам вроде писем или личных просьб |
- Элементы бэклога, которые **Scrum-команда может довести до Done за один спринт**, считаются **готовыми к выбору (ready for selection)** на Sprint Planning. Такую прозрачность они обычно получают **после уточнения**.
- **Уточнение бэклога (Product Backlog refinement)** — это **разбиение элементов бэклога на более мелкие и точные и их дальнейшая проработка**. Это **непрерывная деятельность (ongoing activity)**, в ходе которой добавляются детали — **описание, порядок и размер (description, order, and size)**. Атрибуты часто зависят от области работы.
- **За оценку размера (sizing) отвечают разработчики, которые будут делать работу.** Product Owner **может влиять на них, помогая понять и выбрать компромиссы (trade-offs)**.
- Пример из IT: элемент «Пользователи могут оплачивать заказы» слишком велик для одного спринта. При уточнении его делят на «оплата картой», «оплата через Apple Pay», «сохранить карту на будущее» и «возврат на карту»; каждый получает описание, место в порядке и размер от разработчиков. «Оплату картой» теперь можно сделать за один спринт — она готова к выбору.
> Ловушка экзамена: в формулировке 2020 — **«emergent, ordered»** и **«single source of work»**; в лекции 6 — «prioritized list … single source of **requirements**». В вопросе по Scrum Guide выбирайте слова 2020 года.
> Ловушка экзамена: уточнение — **непрерывная деятельность**, а не событие и не встреча с таймбоксом (в лекции 6 это встреча). **Размер оценивают разработчики**, которые будут делать работу, — не Product Owner, не Scrum Master и не менеджер. «Definition of Ready» — не термин Scrum Guide; на слайде — «ready for selection».
## Обязательство: цель продукта (Product Goal)
> Product Goal описывает **будущее состояние продукта, которое может служить для Scrum-команды целью при планировании (a future state of the product … to plan against)**.
- Product Goal **находится в Product Backlog**. Остальной бэклог **возникает, чтобы определить, «что» приведёт к достижению Product Goal**.
- Product Goal — **долгосрочная цель Scrum-команды (long-term objective)**. Команда должна **достичь одной цели (или отказаться от неё), прежде чем браться за следующую (fulfill or abandon)**.
- **Продукт — средство доставки ценности (a vehicle to deliver value).** У него **чёткие границы, известные стейкхолдеры, чётко определённые пользователи или клиенты**. Продуктом может быть **услуга, физический продукт или что-то более абстрактное**.
| Пример продукта | Границы | Стейкхолдеры и пользователи |
|---|---|---|
| мобильное приложение университета | расписание, оценки и новости для студентов | студенты, преподаватели, IT-отдел |
| внутренний сервис расчёта зарплаты | расчёт зарплаты и расчётные листки | отделы кадров и бухгалтерии |
| публичный API для партнёров | эндпоинты, которые могут вызывать партнёры | разработчики партнёров, отдел продаж |
- Пример Product Goal: «К концу года студенты могут делать в мобильном приложении всё, что сейчас делают на веб-портале, — расписание, оценки, пересдачи».
> Ловушка экзамена: **одна Product Goal за раз** — команда достигает её или отказывается от неё, прежде чем взять следующую. Product Goal — долгосрочная; **Sprint Goal** — цель одного спринта.
## Бэклог спринта (Sprint Backlog)
> Sprint Backlog состоит из **цели спринта (почему — why)**, **набора элементов Product Backlog, выбранных на спринт (что — what)**, и **конкретного плана поставки инкремента (как — how)**.
- Sprint Backlog — **план разработчиков и для разработчиков (a plan by and for the Developers)**.
- Это **хорошо видимая картина работы в реальном времени (highly visible, real-time picture)**, которую разработчики планируют выполнить за спринт, чтобы достичь цели спринта.
- Поэтому Sprint Backlog **обновляется на протяжении всего спринта по мере того, как узнаётся новое**.
- В нём должно быть **достаточно деталей, чтобы проверять прогресс на Daily Scrum**.
> Ловушка экзамена: лекция 6 определяет sprint backlog как «subset of items from the product backlog»; Guide 2020 добавляет **цель спринта** и **план** — почему + что + как. Sprint Backlog принадлежит **разработчикам**: PO и менеджеры не вписывают в него задачи.
## Обязательство: цель спринта (Sprint Goal)
> Sprint Goal — **единственная цель спринта (the single objective for the Sprint)**.
- Хотя цель спринта — **обязательство разработчиков (a commitment by the Developers)**, она даёт **гибкость в том, какая именно работа нужна для её достижения**.
- Цель спринта также создаёт **согласованность и фокус (coherence and focus)**, побуждая команду **работать вместе, а не над отдельными инициативами**.
- Её **создают на Sprint Planning и затем добавляют в Sprint Backlog**.
- Работая в спринте, разработчики **держат цель спринта в уме**.
- Если работа оказывается не такой, как ожидалось, они **вместе с Product Owner пересогласовывают объём Sprint Backlog внутри спринта, не затрагивая цель спринта**.
- Пример из IT: цель спринта «Покупатель может оплатить заказ картой». На полпути разработчики выясняют, что сохранение карт требует дополнительной работы по безопасности. Вместе с PO они убирают «сохранить карту» из этого спринта; цель — оплата картой — остаётся.
> Ловушка экзамена: **объём гибкий, цель фиксирована**. Конкретные элементы могут меняться по договорённости с PO, цель — нет. Цель спринта — обязательство **разработчиков**, а формулирует её на Planning **вся Scrum-команда**.
## Инкремент (Increment)
> Инкремент — **конкретная ступенька к Product Goal (a concrete stepping stone)**.
- Каждый инкремент **добавляется ко всем предыдущим (additive)** и **тщательно проверен (thoroughly verified)**, так что **все инкременты работают вместе**.
- Чтобы давать ценность, **инкремент должен быть пригоден к использованию (usable)**.
- **За спринт можно создать несколько инкрементов.** Их сумма **представляется на Sprint Review**, что поддерживает эмпиризм.
- Однако **инкремент можно передать стейкхолдерам до окончания спринта**. **Sprint Review никогда не следует считать «воротами» для выпуска ценности (a gate to releasing value).**
- **Работа не может считаться частью инкремента, если она не отвечает Definition of Done.**
> Ловушка экзамена: инкремент — **не** «один на спринт и выпускается только после Review». Команда с непрерывной поставкой может выпустить несколько инкрементов за спринт; Review проверяет их сумму. В лекции 6 он называется «product increment».
## Обязательство: критерии готовности (Definition of Done)
> Definition of Done — **формальное описание состояния инкремента, когда он отвечает мерам качества, требуемым для продукта (a formal description … quality measures)**.
- **В тот момент, когда элемент бэклога отвечает Definition of Done, рождается инкремент (an Increment is born).**
- Definition of Done **создаёт прозрачность**, давая всем **общее понимание того, какая работа завершена** в рамках инкремента.
- Если элемент бэклога не отвечает Definition of Done, его **нельзя выпустить и даже показать на Sprint Review**. Вместо этого он **возвращается в Product Backlog для рассмотрения в будущем**.
- Если Definition of Done для инкремента — **часть стандартов организации**, **все Scrum-команды должны соблюдать его как минимум (as a minimum)**.
- Если это **не стандарт организации**, **Scrum-команда должна создать Definition of Done, подходящий для продукта**.
- **Разработчики обязаны соответствовать Definition of Done.**
- Если над одним продуктом **вместе работают несколько Scrum-команд**, они должны **совместно определить и соблюдать одни и те же Definition of Done**.
| Пример DoD для веб-приложения (иллюстрация, не со слайдов) |
|---|
| код проверен другим разработчиком |
| модульные и интеграционные тесты написаны и проходят |
| у сканера безопасности нет критических предупреждений |
| выложено на тестовый стенд (staging) |
| тексты для пользователя есть на всех поддерживаемых языках |
> Ловушка экзамена: незавершённый элемент **не** показывают на Review «как готовый на 90%» и **не** переносят автоматически в следующий спринт — он **возвращается в Product Backlog**. DoD организации — это **минимум**: команда может сделать его строже, но не мягче. Критерии приёмки (acceptance criteria) одного элемента (термина нет на слайдах) — не DoD, который действует для всех элементов.
## Всё вместе: путь одного элемента
| Шаг | Артефакт / обязательство | Кто |
|---|---|---|
| «Оплата картой» записана и поставлена в порядок ради Product Goal | Product Backlog / Product Goal | Product Owner (может делегировать написание) |
| уточнена: разбита, описана, оценена | Product Backlog | разработчики оценивают; PO объясняет компромиссы |
| выбрана на Sprint Planning, составлен план | Sprint Backlog / Sprint Goal | разработчики в обсуждении с PO |
| сделана, протестирована, отвечает DoD → рождается инкремент | Increment / Definition of Done | разработчики |
| показана на Sprint Review (или выпущена раньше) | Increment | Scrum-команда и ключевые стейкхолдеры |
?? История написана, но в последний день спринта у неё падают интеграционные тесты. Можно ли показать её на Sprint Review как «почти готовую»?
?= Нет. Если элемент бэклога не отвечает Definition of Done, его нельзя выпустить и даже показать на Sprint Review; он возвращается в Product Backlog для рассмотрения в будущем.
?? В компании есть общий Definition of Done. Команда хочет добавить «нагрузочный тест пройден». Можно ли?
?= Да. DoD организации нужно соблюдать как минимум, поэтому команда может добавить более строгие критерии. Если несколько команд работают над одним продуктом, они должны совместно определить и соблюдать одни и те же DoD.
?? Кто оценивает размер элементов бэклога и как на эту оценку может повлиять Product Owner?
?= За оценку отвечают разработчики, которые будут делать работу; Product Owner может повлиять, помогая им понять и выбрать компромиссы (trade-offs).
## Лекция 6 и лекция 7 — артефакты
| Тема | Лекция 6 (Griffiths) | Лекция 7 (Scrum Guide 2020) |
|---|---|---|
| Product Backlog | динамичный, развивающийся **приоритизированный (prioritized)** список, единственный источник **требований** | **возникающий, упорядоченный** список, единственный источник **работы**; обязательство — **Product Goal** |
| Sprint Backlog | подмножество элементов, выбранных как цель спринта | Sprint Goal (почему) + выбранные элементы (что) + план (как); обязательство — **Sprint Goal** |
| Increment | product increment, который показывают ради обратной связи | ступенька: добавляется к предыдущим, проверен, пригоден к использованию; обязательство — **Definition of Done** |
| Уточнение бэклога | встреча (meeting) | **непрерывная деятельность (ongoing activity)** |
## Что спросят на экзамене (Exam focus)
- Артефакты **представляют работу или ценность** и **максимизируют прозрачность**; у каждого есть **обязательство**: Product Backlog → **Product Goal**, Sprint Backlog → **Sprint Goal**, Increment → **Definition of Done**; обязательства **укрепляют эмпиризм и ценности Scrum**.
- Product Backlog: **emergent, ordered**, **единственный источник работы**; **ready for selection** = можно сделать за один спринт; уточнение — **непрерывное**: разбиение и проработка элементов (**описание, порядок, размер**); **размер оценивают разработчики**, PO влияет через **компромиссы**.
- Product Goal: **будущее состояние** продукта, **долгосрочная цель**, находится **в Product Backlog**; достичь **или отказаться**, прежде чем брать следующую; продукт = **средство доставки ценности** с чёткими границами, известными стейкхолдерами, определёнными пользователями.
- Sprint Backlog: **почему + что + как**; **план разработчиков и для разработчиков**; в реальном времени, **обновляется весь спринт**; деталей достаточно для Daily Scrum.
- Sprint Goal: **единственная цель**; обязательство **разработчиков**; гибкость в конкретной работе; объём пересогласуется **с PO, не затрагивая цель**.
- Increment: **ступенька**, **добавляется к предыдущим**, **тщательно проверен**, **пригоден к использованию**; **несколько за спринт** — можно; можно **выпустить до конца** спринта; Review — **никогда не ворота**.
- Definition of Done: **формальное описание** инкремента, отвечающего **мерам качества**; отвечает DoD = **рождается инкремент**; не готово → **не выпускается, не показывается, обратно в Product Backlog**; DoD организации — **минимум**; несколько команд → **одни и те же DoD**.`,
  },
  [
    qx("According to the Scrum Guide, Scrum's artifacts represent:", "work or value", [
      ["time or cost", "Time and cost are constraints from traditional project management; the Guide says artifacts represent work or value.", "Время и стоимость — ограничения из традиционного управления проектами; Guide говорит, что артефакты представляют работу или ценность."],
      ["roles and events", "Accountabilities and events are separate parts of Scrum; artifacts are what they inspect and adapt.", "Зоны ответственности и события — отдельные части Scrum; артефакты — то, что на них проверяют и адаптируют."],
      ["plans or contracts", "Scrum's artifacts are not contracts; they exist to maximize transparency of key information.", "Артефакты Scrum — не контракты; они нужны, чтобы максимизировать прозрачность ключевой информации."],
    ], "\"Scrum's artifacts represent work or value. They are designed to maximize transparency of key information.\"", "«Scrum's artifacts represent work or value. They are designed to maximize transparency of key information» — работа или ценность."),
    qx("Which pairing of an artifact with its commitment is correct?", "Increment — Definition of Done", [
      ["Sprint Backlog — Definition of Done", "The Sprint Backlog's commitment is the Sprint Goal; the DoD belongs to the Increment.", "Обязательство Sprint Backlog — Sprint Goal; DoD относится к инкременту."],
      ["Product Backlog — Sprint Goal", "The Product Backlog's commitment is the Product Goal; the Sprint Goal belongs to the Sprint Backlog.", "Обязательство Product Backlog — Product Goal; Sprint Goal относится к Sprint Backlog."],
      ["Increment — Sprint Goal", "The Increment's commitment is the Definition of Done, not the Sprint Goal.", "Обязательство инкремента — Definition of Done, а не Sprint Goal."],
    ], "Product Backlog → Product Goal; Sprint Backlog → Sprint Goal; Increment → Definition of Done.", "Product Backlog → Product Goal; Sprint Backlog → Sprint Goal; Increment → Definition of Done."),
    qx("The Scrum Guide defines the Product Backlog as:", "an emergent, ordered list of what is needed to improve the product", [
      ["a fixed, prioritized list of requirements signed off by the customer", "The backlog is emergent, not fixed, and the Guide says \"ordered\"; customer sign-off is not part of Scrum.", "Бэклог возникающий, а не фиксированный, и в Guide сказано «ordered»; подпись клиента в Scrum не предусмотрена."],
      ["a list of tasks the Developers plan for the current Sprint", "That describes the plan inside the Sprint Backlog, not the Product Backlog.", "Это описание плана внутри Sprint Backlog, а не Product Backlog."],
      ["the complete specification of the product agreed at the start", "An emergent list is never complete upfront; it changes as more is learned.", "Возникающий список никогда не бывает полным заранее; он меняется по мере того, как узнаётся новое."],
    ], "\"The Product Backlog is an emergent, ordered list of what is needed to improve the product. It is the single source of work undertaken by the Scrum Team.\"", "«The Product Backlog is an emergent, ordered list of what is needed to improve the product» — возникающий, упорядоченный список."),
    qx("According to the Scrum Guide 2020, the Product Backlog is the single source of what?", "Work undertaken by the Scrum Team", [
      ["Requirements signed off by the customer", "\"Single source of requirements\" is Lecture 6's older wording; the 2020 Guide says single source of work.", "«Single source of requirements» — старая формулировка лекции 6; Guide 2020 говорит single source of work."],
      ["Tasks assigned by the Scrum Master", "The Scrum Master does not assign tasks, and the Product Backlog is not a task list.", "Scrum Master не назначает задачи, а Product Backlog — не список задач."],
      ["Bugs reported by users", "Bugs may be in the backlog, but it holds everything needed to improve the product, not only defects.", "Баги могут быть в бэклоге, но в нём всё, что нужно для улучшения продукта, а не только дефекты."],
    ], "\"It is the single source of work undertaken by the Scrum Team.\"", "«It is the single source of work undertaken by the Scrum Team» — единственный источник работы команды."),
    qx("When are Product Backlog items deemed \"ready for selection\" in Sprint Planning?", "When they can be Done by the team within one Sprint", [
      ["When the Product Owner has estimated their size", "Sizing is done by the Developers who will do the work, and readiness depends on fitting into one Sprint.", "Размер оценивают разработчики, которые будут делать работу, а готовность зависит от того, помещается ли элемент в один спринт."],
      ["When every acceptance test has already been automated", "Automating tests is part of doing the work, not a condition for selecting it.", "Автоматизация тестов — часть выполнения работы, а не условие её выбора."],
      ["When they have been in the backlog for one full Sprint", "Time spent in the backlog does not make an item ready; transparency from refinement does.", "Время в бэклоге не делает элемент готовым; готовым его делает прозрачность после уточнения."],
    ], "\"Product Backlog items that can be Done by the Scrum Team within one Sprint are deemed ready for selection in a Sprint Planning event.\"", "«Product Backlog items that can be Done by the Scrum Team within one Sprint are deemed ready for selection» — можно сделать за один спринт."),
    qx("According to the Scrum Guide 2020, Product Backlog refinement is:", "an ongoing activity of breaking down and defining items", [
      ["a formal Scrum event, timeboxed and held once in every Sprint", "Refinement is not one of the five events; Lecture 6 calls it a meeting, the 2020 Guide an ongoing activity.", "Уточнение — не одно из пяти событий; в лекции 6 это встреча, в Guide 2020 — непрерывная деятельность."],
      ["a task done by the Product Owner alone", "The Developers size items and the whole team may refine them; the PO does not refine alone.", "Размер оценивают разработчики, а уточнять может вся команда; PO не уточняет в одиночку."],
      ["a phase that ends before the first Sprint", "The backlog is emergent, so refinement continues throughout — even during the Sprint (\"refined as needed\").", "Бэклог возникающий, поэтому уточнение идёт всё время — даже во время спринта («refined as needed»)."],
    ], "\"Product Backlog refinement is the act of breaking down and further defining Product Backlog items into smaller more precise items. This is an ongoing activity to add details, such as a description, order, and size.\"", "«Product Backlog refinement is the act of breaking down and further defining Product Backlog items into smaller more precise items. This is an ongoing activity…» — непрерывная деятельность."),
    qx("According to the Scrum Guide, who is responsible for sizing Product Backlog items?", "The Developers who will be doing the work", [
      ["The Product Owner, who orders the backlog", "The PO orders the backlog and may influence sizes through trade-offs, but does not size.", "PO упорядочивает бэклог и может влиять на размер через компромиссы, но не оценивает."],
      ["The Scrum Master, as a neutral facilitator", "The Scrum Master may facilitate, but sizing belongs to those who will do the work.", "Scrum Master может помогать вести процесс, но оценка — за теми, кто будет делать работу."],
      ["An estimation team outside the Scrum Team", "There are no outside estimators; those doing the work size it.", "Внешних оценщиков нет; оценивают те, кто делает работу."],
    ], "\"The Developers who will be doing the work are responsible for the sizing.\"", "«The Developers who will be doing the work are responsible for the sizing» — разработчики, которые будут делать работу."),
    qx("The Developers size an item as very large, and the Product Owner thinks it is too expensive. What may the PO do, according to the Scrum Guide?", "Help them understand and select trade-offs", [
      ["Overrule the Developers' estimate and record a smaller size", "Sizing belongs to the Developers; the PO cannot overrule it.", "Оценка принадлежит разработчикам; PO не может её отменить."],
      ["Ask the Scrum Master to re-estimate it", "The Scrum Master does not size items either.", "Scrum Master тоже не оценивает элементы."],
      ["Move it straight into the Sprint anyway", "An item too big for one Sprint is not ready for selection; it needs refinement first.", "Элемент, не помещающийся в спринт, не готов к выбору; сначала его надо уточнить."],
    ], "\"The Product Owner may influence the Developers by helping them understand and select trade-offs.\"", "«The Product Owner may influence the Developers by helping them understand and select trade-offs» — через компромиссы."),
    qx("What does the Product Goal describe?", "A future state of the product to plan against", [
      ["The single objective for the current Sprint", "That is the Sprint Goal, the commitment of the Sprint Backlog.", "Это Sprint Goal — обязательство Sprint Backlog."],
      ["The quality measures required for the product", "Quality measures are described by the Definition of Done.", "Меры качества описывает Definition of Done."],
      ["The list of all features agreed in the contract", "The Product Goal is a target state, not a fixed feature list; the backlog emerges to define what will fulfill it.", "Product Goal — целевое состояние, а не фиксированный список функций; бэклог возникает, чтобы определить, что к нему приведёт."],
    ], "\"The Product Goal describes a future state of the product which can serve as a target for the Scrum Team to plan against.\"", "«The Product Goal describes a future state of the product which can serve as a target for the Scrum Team to plan against» — будущее состояние продукта."),
    qx("What must the Scrum Team do with its current Product Goal before taking on the next one?", "Fulfill it or abandon it", [
      ["Split it into Sprint Goals", "Sprints serve the Product Goal, but splitting it does not finish it; the rule is fulfill or abandon.", "Спринты служат Product Goal, но разбиение её не завершает; правило — достичь или отказаться."],
      ["Pass it to another team", "Teams on one product share the same Product Goal; handing it over is not the rule.", "Команды на одном продукте делят одну Product Goal; передача другой команде — не правило."],
      ["Have stakeholders sign it off", "There is no sign-off rule; the team must fulfill (or abandon) one objective before the next.", "Правила подписания нет; команда должна достичь одной цели (или отказаться от неё) перед следующей."],
    ], "\"The Product Goal is the long-term objective for the Scrum Team. They must fulfill (or abandon) one objective before taking on the next.\"", "«They must fulfill (or abandon) one objective before taking on the next» — достичь или отказаться."),
    qx("Which description of a \"product\" matches the Scrum Guide?", "A vehicle to deliver value with a clear boundary and known users", [
      ["Only a software application that is released to paying external customers", "A product could be a service, a physical product, or something more abstract — not only paid software.", "Продуктом может быть услуга, физический продукт или что-то более абстрактное, а не только платный софт."],
      ["Any set of tasks that a project manager assigns", "Tasks are not a product, and Scrum has no project manager assigning them.", "Задачи — не продукт, и в Scrum нет руководителя проекта, который их раздаёт."],
      ["The sum of all Increments presented at one Review", "That is what the Review inspects; the product is the broader vehicle that Increments build up.", "Это то, что проверяют на Review; продукт — более широкое средство, которое наращивают инкременты."],
    ], "\"A product is a vehicle to deliver value. It has a clear boundary, known stakeholders, well-defined users or customers. A product could be a service, a physical product, or something more abstract.\"", "«A product is a vehicle to deliver value. It has a clear boundary, known stakeholders, well-defined users or customers…» — средство доставки ценности."),
    qx("According to the Scrum Guide 2020, the Sprint Backlog is composed of:", "the Sprint Goal, the selected items and a plan", [
      ["the selected items only, without a goal", "\"Subset of items\" is Lecture 6's older definition; the 2020 Guide adds the Sprint Goal (why) and the plan (how).", "«Подмножество элементов» — старое определение лекции 6; Guide 2020 добавляет Sprint Goal (почему) и план (как)."],
      ["the Product Goal, the full Product Backlog and the DoD", "These belong to the Product Backlog and the Increment, not to the Sprint Backlog.", "Это относится к Product Backlog и инкременту, а не к Sprint Backlog."],
      ["the plan, the burn-down and the velocity", "Burn-downs and velocity are optional practices, not parts of the Sprint Backlog.", "Burn-down и velocity — необязательные практики, а не части Sprint Backlog."],
    ], "\"The Sprint Backlog is composed of the Sprint Goal (why), the set of Product Backlog items selected for the Sprint (what), as well as an actionable plan for delivering the Increment (how).\"", "«The Sprint Backlog is composed of the Sprint Goal (why), the set of Product Backlog items selected for the Sprint (what), as well as an actionable plan for delivering the Increment (how)»."),
    qx("According to the Scrum Guide, the Sprint Backlog is a plan:", "by and for the Developers", [
      ["by the Product Owner, for the Developers", "The PO orders the Product Backlog; the Sprint Backlog plan is made by the Developers themselves.", "PO упорядочивает Product Backlog; план Sprint Backlog составляют сами разработчики."],
      ["by the Scrum Master, for the whole team", "The Scrum Master does not plan the team's work.", "Scrum Master не планирует работу команды."],
      ["for the stakeholders", "It is visible to everyone, but it is the Developers' working plan, not a report for stakeholders.", "Он виден всем, но это рабочий план разработчиков, а не отчёт для стейкхолдеров."],
    ], "\"The Sprint Backlog is a plan by and for the Developers. It is a highly visible, real-time picture of the work…\"", "«The Sprint Backlog is a plan by and for the Developers» — план разработчиков и для разработчиков."),
    qx("Midway through the Sprint, the Developers find that one selected item needs much more work than expected. What does the Scrum Guide say they should do?", "Negotiate the scope with the PO without affecting the Sprint Goal", [
      ["Change the Sprint Goal so that it matches the new reality", "The goal is protected: no changes are made that would endanger the Sprint Goal.", "Цель защищена: не вносятся изменения, угрожающие цели спринта."],
      ["Extend the Sprint by a few days so that every selected item is finished", "Sprints have a fixed length; they are not extended to fit the work.", "У спринтов фиксированная длина; их не продлевают под объём работы."],
      ["Ask the Product Owner to cancel the Sprint immediately", "Cancelling is only for an obsolete Sprint Goal; here the goal is still valid.", "Отмена — только при устаревшей цели спринта; здесь цель по-прежнему актуальна."],
    ], "\"If the work turns out to be different than they expected, they collaborate with the Product Owner to negotiate the scope of the Sprint Backlog within the Sprint without affecting the Sprint Goal.\"", "«…they collaborate with the Product Owner to negotiate the scope of the Sprint Backlog within the Sprint without affecting the Sprint Goal» — объём пересогласуют, цель не трогают."),
    qx("Which statement about the Increment is correct according to the Scrum Guide?", "Several Increments may be created and delivered within one Sprint", [
      ["Exactly one Increment is created at the end of every Sprint", "\"Multiple Increments may be created within a Sprint\"; the Review sees their sum.", "«Multiple Increments may be created within a Sprint»; на Review видят их сумму."],
      ["An Increment may only be released after stakeholders accept it at the Sprint Review", "\"The Sprint Review should never be considered a gate to releasing value.\"", "«The Sprint Review should never be considered a gate to releasing value»."],
      ["An Increment counts even if it only partly meets the DoD", "\"Work cannot be considered part of an Increment unless it meets the Definition of Done.\"", "«Work cannot be considered part of an Increment unless it meets the Definition of Done»."],
    ], "\"Multiple Increments may be created within a Sprint… However, an Increment may be delivered to stakeholders prior to the end of the Sprint.\"", "«Multiple Increments may be created within a Sprint… an Increment may be delivered to stakeholders prior to the end of the Sprint» — несколько инкрементов, выпуск до конца спринта."),
    qx("According to the Scrum Guide, when is an Increment born?", "The moment a backlog item meets the Definition of Done", [
      ["When the Product Owner accepts the item at the Sprint Review", "The Review is not a gate; the Increment exists as soon as the DoD is met.", "Review — не «ворота»; инкремент существует, как только выполнен DoD."],
      ["When the Developers finish coding the item", "Finished code that has not met the DoD (tests, review, etc.) is not yet part of an Increment.", "Готовый код, не отвечающий DoD (тесты, ревью и т. д.), ещё не часть инкремента."],
      ["When the item is released to production", "Release is optional and can come later; the Increment is born when the DoD is met.", "Релиз необязателен и может быть позже; инкремент рождается, когда выполнен DoD."],
    ], "\"The moment a Product Backlog item meets the Definition of Done, an Increment is born.\"", "«The moment a Product Backlog item meets the Definition of Done, an Increment is born»."),
    qx("On the last day of the Sprint, an item still fails its integration tests and does not meet the DoD. What happens to it?", "It returns to the Product Backlog for future consideration", [
      ["It is presented at the Sprint Review and marked as about 90 percent complete", "An item that does not meet the DoD \"cannot be released or even presented at the Sprint Review\".", "Элемент, не отвечающий DoD, «cannot be released or even presented at the Sprint Review»."],
      ["It automatically moves into the next Sprint Backlog", "It goes back to the Product Backlog, where the PO orders it again; nothing moves automatically.", "Он возвращается в Product Backlog, где PO снова определяет его место; ничего не переносится автоматически."],
      ["It is released, and the defects are fixed in a hotfix", "Work that does not meet the DoD cannot be released.", "Работу, не отвечающую DoD, выпускать нельзя."],
    ], "\"If a Product Backlog item does not meet the Definition of Done, it cannot be released or even presented at the Sprint Review. Instead, it returns to the Product Backlog for future consideration.\"", "«…it cannot be released or even presented at the Sprint Review. Instead, it returns to the Product Backlog for future consideration» — обратно в Product Backlog."),
    qx("The organization has a standard Definition of Done. What does the Scrum Guide require of its Scrum Teams?", "All Scrum Teams must follow it as a minimum", [
      ["Each team may replace it with its own DoD", "A team creates its own DoD only if there is no organizational standard.", "Свой DoD команда создаёт, только если стандарта организации нет."],
      ["Only teams without a Scrum Master must follow it", "Every team has a Scrum Master, and the rule applies to all Scrum Teams.", "У каждой команды есть Scrum Master, а правило касается всех Scrum-команд."],
      ["It applies only to teams that release externally", "The Guide makes no such exception: all Scrum Teams follow it as a minimum.", "Guide таких исключений не делает: все Scrum-команды соблюдают его как минимум."],
    ], "\"If the Definition of Done for an increment is part of the standards of the organization, all Scrum Teams must follow it as a minimum. If it is not an organizational standard, the Scrum Team must create a Definition of Done appropriate for the product.\"", "«…all Scrum Teams must follow it as a minimum. If it is not an organizational standard, the Scrum Team must create a Definition of Done appropriate for the product»."),
    tfx("Although the Sprint Goal is a commitment by the Developers, it provides flexibility in terms of the exact work needed to achieve it.", true,
      "Word for word from the Sprint Goal slide. The goal is fixed; the exact items can be renegotiated with the Product Owner.",
      "Дословно со слайда о Sprint Goal. Цель фиксирована; конкретные элементы можно пересогласовать с Product Owner.",
      "\"False\" would mean every selected item is locked in; the Guide allows negotiating the scope of the Sprint Backlog without affecting the goal.",
      "«Неверно» означало бы, что каждый выбранный элемент зафиксирован; Guide разрешает пересогласовать объём Sprint Backlog, не затрагивая цель."),
    tfx("If several Scrum Teams work together on one product, each team may define its own, different Definition of Done.", false,
      "\"If there are multiple Scrum Teams working together on a product, they must mutually define and comply with the same Definition of Done.\"",
      "«If there are multiple Scrum Teams working together on a product, they must mutually define and comply with the same Definition of Done» — одни и те же DoD.",
      "\"True\" would let the integrated Increment have parts of different quality, so nobody would share an understanding of what is Done.",
      "«Верно» позволило бы частям общего инкремента иметь разное качество, и общего понимания «готово» ни у кого бы не было."),
  ],
);

export const lecture7: Lecture = {
  id: "pm-l7",
  title: { en: "Lecture 7 — Scrum framework", ru: "Лекция 7 — Фреймворк Scrum" },
  parts: [p1, p2, p3, p4],
};
