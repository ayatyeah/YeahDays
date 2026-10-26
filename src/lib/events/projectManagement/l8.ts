import { part, qx, tfx, type Lecture } from "../types";

/*
 * Лекция 8 PM — «Practices (techniques) in agile frameworks» (31 слайд, два пустых).
 * Источник слайдов — Agile Extension to the BABOK® Guide (2017), IIBA & Agile Alliance,
 * глава 7 «Techniques»: Selecting the Right Technique, 7.7 Personas, 7.21 User Stories.
 * Только картинками на слайдах (в тексте PDF их нет) и перенесено в конспект целиком:
 * Table 1 «Selecting the Right Technique» (Context × «Works well with internal teams» /
 * «Works well with stakeholders external to the team», все 24 техники 7.1–7.24);
 * Figure 1 «Short Persona Template» (Name + Picture, Details or Context, Traits and
 * characteristics, Goals); Figure 2 «Long Persona Template» (Picture, Name, Demographics,
 * Buying motive; столбцы Traits, Needs, Motivation, Differentiators).
 * Неоднозначности слайдов отмечены в конспекте: на слайде Table 1 устроена не как
 * «техника × результат», а как «контекст × внутренняя команда / внешние стейкхолдеры»;
 * нумерация элементов User Stories сбита («1 Card», «2 Format», «2 Conversation»,
 * «3 Confirmation», «5 User Story Management» — Format относится к Card, пункта 4 нет);
 * в INVEST буква S — «Sized Appropriately», а не привычное «Small»; у персон пять пунктов
 * Strengths (а не четыре); «help stakeholders from projecting» — по смыслу «help prevent».
 * Часть 3 — практикум на сквозном примере (бронирование аудиторий), без новых фактов.
 */

const p1 = part(
  "pm-l8-p1",
  { en: "Selecting the right technique and Personas", ru: "Выбор техники и персоны (Personas)" },
  {
    en: `## Where the lecture comes from
The lecture "Practices (techniques) in agile frameworks" follows one source: the **Agile Extension to the BABOK® Guide (2017)**, published by the **International Institute of Business Analysis (IIBA) and the Agile Alliance**. Its chapter 7 describes **24 techniques** an agile business analysis practitioner can use. The slides take three pieces from it: **Selecting the Right Technique** (with **Table 1**), **Personas** and **User Stories**.
Every technique in the guide is described under the same headings, and the slides keep them:
| Heading | What it answers |
|---|---|
| Purpose | why the technique is used — one sentence |
| Description | what it is and how it works |
| Elements | its parts, numbered 1, 2, 3… |
| Usage Considerations | 1 Strengths and 2 Limitations |
> Memory hook: Purpose → Description → Elements → Usage Considerations (Strengths, Limitations). Questions like "the purpose of personas" or "a limitation of user stories" quote exactly these sections.
## Selecting the Right Technique
- "It can be challenging to select the right technique for the situation to get the desired outcome."
- Table 1 provides **general guidance on when to choose a specific technique**.
- "Please note that **many techniques can be used successfully in a variety of contexts**."
- An agile business analysis practitioner uses his or her **domain knowledge, experience, individual competencies, and creativity** when selecting the appropriate technique for the desired outcome.
> **The purpose of Table 1** is to provide **a starting point** when determining which technique might be useful in a given context.
> Exam trap: Table 1 is guidance — a starting point, not a mandatory rule and not a complete list of allowed choices. The final choice rests on the practitioner's domain knowledge, experience, individual competencies and creativity.
## Table 1. Selecting the Right Technique
On the slide the table is a picture. It has three columns: the **Context** (what you are trying to achieve), techniques that **work well with internal teams** and techniques that **work well with stakeholders external to the team**. The numbers are the section numbers of the techniques in the guide.
| Context | Works well with internal teams | Works well with stakeholders external to the team |
|---|---|---|
| Communications | 7.1 Backlog Refinement; 7.8 Planning Workshops; 7.9 Portfolio Kanban; 7.14 Retrospectives; 7.24 Visioning | 7.15 Reviews; 7.24 Visioning |
| Process Analysis | 7.23 Value Stream Mapping | 7.3 Impact Mapping |
| Product Management Refinement | 7.6 Minimal Viable Product; 7.10 Product Roadmap; 7.11 Purpose Alignment Model; 7.12 Real Options | 7.5 Kano Analysis; 7.6 Minimal Viable Product |
| Requirements Management | 7.2 Behaviour Driven Development; 7.4 Job Stories; 7.13 Relative Estimation; 7.16 Spikes; 7.18 Story Decomposition; 7.19 Story Elaboration; 7.20 Story Mapping; 7.21 User Stories | — |
| Understanding your Customer | 7.7 Personas; 7.17 Storyboarding; 7.22 Value Modelling | — |
## How to read Table 1
- **Five contexts:** Communications, Process Analysis, Product Management Refinement, Requirements Management, Understanding your Customer.
- **24 techniques**, numbered 7.1–7.24. The numbers simply follow the alphabet (7.1 Backlog Refinement … 7.24 Visioning), so there is no need to memorise them.
- **In both columns:** only **Visioning** (Communications) and **Minimal Viable Product** (Product Management Refinement).
- **Only in the external column:** **Reviews** (Communications), **Impact Mapping** (Process Analysis) and **Kano Analysis** (Product Management Refinement).
- **Requirements Management** is the largest row (8 techniques); it and **Understanding your Customer** have **nothing** in the external column.
- **Personas (7.7)** → Understanding your Customer, internal teams. **User Stories (7.21)** → Requirements Management, internal teams, in the same row as their helpers **Story Decomposition** and **Story Elaboration**.
| Context | Internal | External | Entries |
|---|---|---|---|
| Communications | 5 | 2 | 7 |
| Process Analysis | 1 | 1 | 2 |
| Product Management Refinement | 4 | 2 | 6 |
| Requirements Management | 8 | 0 | 8 |
| Understanding your Customer | 3 | 0 | 3 |
= 26 entries - 2 repeated (Visioning, Minimal Viable Product) = 24 techniques
> Exam trap: "Personas work well with stakeholders external to the team" is false by Table 1 — Personas are listed only under **internal teams**; the external cell of Understanding your Customer is empty. The same is true of User Stories in Requirements Management.
## The other techniques of Table 1 in one line each
The slides give only the names. The one-line ideas below are for orientation (general agile practice, not slide text), so that the names in the table mean something:
| Technique | Idea in one line |
|---|---|
| Backlog Refinement | keep the backlog ordered and detailed enough for the next iterations |
| Behaviour Driven Development | describe behaviour as concrete examples (Given / When / Then) that become tests |
| Impact Mapping | link a business goal to actors, impacts and deliverables |
| Job Stories | a requirement told from the situation: "When…, I want to…, so I can…" |
| Kano Analysis | sort features by how they affect customer satisfaction |
| Minimal Viable Product | the smallest product that lets the team learn from real users |
| Planning Workshops | collaborative sessions to plan releases and iterations |
| Portfolio Kanban | visualise and limit the flow of initiatives across a portfolio |
| Product Roadmap | the planned evolution of the product over time |
| Purpose Alignment Model | classify features by whether they differentiate the business or are mission critical |
| Real Options | keep options open and decide at the last responsible moment |
| Relative Estimation | size items by comparing them with each other (for example, story points) |
| Retrospectives | the team inspects how it works and agrees on improvements |
| Reviews | show the work to stakeholders and collect feedback |
| Spikes | a short timeboxed investigation that reduces uncertainty |
| Storyboarding | a sequence of pictures of how a user goes through a task |
| Story Decomposition | split a large story into smaller ones |
| Story Elaboration | add detail to a story just before it is built |
| Story Mapping | arrange stories along the user's journey to see the whole product |
| Value Modelling | model what value the customer receives and how |
| Value Stream Mapping | map the flow of work from request to delivery to find waste |
| Visioning | create a shared picture of the desired outcome |
Personas and User Stories are not in this list: the rest of the lecture explains them in full.
## Personas — Purpose and Description
> **Purpose:** Personas are used to **understand and empathize with an intended stakeholder** in order to **align the solution with the stakeholder need**.
> **Description:** Personas are **fictional characters or archetypes** that exemplify the way that **typical users interact with a solution**.
- They are often used in agile approaches to **understand value from the perspective of a particular stakeholder**.
- They allow a team that **may not have direct access to a customer representative** to better understand their needs.
- Work can then **focus on the features of greatest value to a particular persona**.
## What a persona contains
A persona is described **as though it is a real person**. Personas may provide a:
- **name, personality, family, work background, skill level;**
- **preferences, behavior patterns, personal attitudes;**
- **goals and needs.**
They can also include a **picture** and a short **"day in the life" narrative** that helps to visualize the user and their experience.
## Persona vs role or actor description
Business analysis practitioners use personas to gain **a deeper understanding of stakeholders than is generally provided from a role or actor description**.
| | Role / actor description | Persona |
|---|---|---|
| Banking app example | "Customer: has an account, can log in and transfer money" | "Aliya, 29, a night-shift nurse who pays bills from her phone at 3 a.m. and is afraid of sending money to the wrong account" |
| What it tells the team | who may use which function | how a real-looking person behaves, what worries and drives her |
| Depth | the same for everyone in the role | subtle qualities: preferences, attitudes, skill level, context |
- Personas **help improve a solution, a purpose, and usability** because they are **patterned after the subtle qualities of real people** that will interact with the solution and how they do their job.
- **Personas are ranked** to identify those that will **realize the most benefit from the solution design**.
> Exam trap: a persona is fictional, but not made up from nothing — it is patterned after real people and, when data exists, built from demographic data about the user population. And it is not a role: "Customer" is a role; "Aliya, 29, night-shift nurse" is a persona.
## Personas — the six elements
| # | Element | What the slide says |
|---|---|---|
| 1 | Long and Short Template | a **short** template — a one-page quick view of key information; a **long** template — more in-depth details and understanding |
| 2 | Persona Name and Image | a **realistic name** and a **fictional image** increase **relatability** and thereby understanding of and empathy with the intended stakeholder |
| 3 | Traits and Characteristics | **unique, distinguishing, and differentiating** characteristics or traits regarding the intended stakeholder |
| 4 | Motivations | the **underlying motivations** regarding **how and why** the intended stakeholder interacts with the solution |
| 5 | Needs | **very specific needs**: basic (safety, trust, access to food and shelter) or higher level (acceptance and validation) |
| 6 | Differentiators | **why this persona is different from another persona** — what is unique about it |
## Element 1 — Long and Short Template
Business analysis practitioners frequently use **two different templates** when creating personas:
- a **short template** which offers a **one-page quick view of key information**, and
- a **long template** which offers **more in-depth details and understanding**.
**Additional user research** helps expand from the short template to the long template.
Both templates are pictures on the slides (Figure 1 and Figure 2). Their fields:
| Field | Figure 1. Short Persona Template | Figure 2. Long Persona Template |
|---|---|---|
| Picture | yes | yes |
| Name | yes | yes |
| Details or Context: Tasks and responsibilities, Technology | yes | — |
| Traits and characteristics: Age, Occupation, Location | yes | Traits (a column) |
| Goals: Goal 1, Goal 2, Goal 3 | yes | — |
| Demographics | — | yes (next to the name) |
| Buying motive | — | yes |
| Needs | — | yes (a column) |
| Motivation | — | yes (a column) |
| Differentiators | — | yes (a column) |
@diagram pm8-persona-templates
- **Figure 1 layout:** a 2 × 2 grid — **Name** (with the picture) and **Details or Context** on top; **Traits and characteristics** and **Goals** below.
- **Figure 2 layout:** a top row with the **picture**, **Name and Demographics** and **Buying motive**; under it four columns — **Traits, Needs, Motivation, Differentiators**.
> Exam trap: **Goals** and **Details or Context** are in the short template only; **Buying motive, Needs, Motivation and Differentiators** appear only in the long one. Traits are in both.
## Elements 2–6 and the ATM examples
- **2 Persona Name and Image.** Practitioners give personas a realistic name and attach a fictional image in order to increase its relatability and thereby the understanding of and empathy with the intended stakeholder.
- **3 Traits and Characteristics.** Unique, distinguishing, and differentiating characteristics or traits. ATM example: one ATM persona may be **an office manager who deposits cash at the end of the day**; a different ATM persona may be **an individual who likes to get small amounts out at a time**.
- **4 Motivations.** How and why the stakeholder interacts with the solution. ATM example: the **office manager** may be motivated by **reducing risk of fraud or theft**; the **individual withdrawing** from the ATM may be motivated by **withdrawing the minimum amount needed**.
- **5 Needs.** Very specific needs: basic needs such as **safety, trust, or access to food and shelter**, or higher level needs such as **the need for acceptance and validation**. **Needs are finite as compared to wants which are infinite.**
- **6 Differentiators.** They identify specifically **why this persona is different from another persona** and what is unique about it. These could be **generational or experiential differentiators, preference differentiators, or identifying characteristics**.
| ATM persona | Office manager | Individual withdrawing cash |
|---|---|---|
| Trait (slide) | deposits cash at the end of the day | likes to get small amounts out at a time |
| Motivation (slide) | reducing risk of fraud or theft | withdrawing the minimum amount needed |
| Need (our illustration) | safety: the day's cash is not lost or stolen | trust: the machine gives exactly what was requested |
| Differentiator (our illustration) | experiential: handles business cash every day | preference: many small withdrawals instead of one large one |
> Exam trap: **trait** = what the person is like and does; **motivation** = why and how they use the solution; **need** = a specific, finite need (safety, trust, acceptance, validation); **differentiator** = what sets this persona apart from *another* persona.
## Usage Considerations — Strengths
- Personas **facilitate the shared understanding of specific requirements for different sets of users**. These requirements **can be used to develop user stories**.
- **Proposed solutions can be guided by how well they meet the needs of individual user personas.** Features can be **prioritized based on how well they address the needs of one or more personas**.
- They **provide a human "face"** so as to **focus empathy on the people represented by the demographics**.
- If the data is available, using **demographic (or anthropomorphic) data** about the intended user population is a good way to start building personas. However, in some cases it is necessary to **be creative and invent personas based on little more than a few dry facts** about the intended end users. In either case, **a representative pool of personas** should be identified.
- Personas help **keep stakeholders from projecting individual values and biases onto the solution**. They help to **develop compassion for various users**.
> Note on the wording: the slide literally says "help stakeholders from projecting" — the meaning is "help keep stakeholders from projecting" their own values and biases. "Anthropomorphic" is the guide's own word in brackets; the core idea is demographic data about real users. The slides list five strengths.
## Usage Considerations — Limitations
- Personas are **fictional**, so there is a tendency to create personas that **embody traits common to most users**; this creates a **generic user that is not distinct or realistic** and can lead to **solutions that are trying to be everything to everyone**.
- Personas **may not be a good substitute for a real user**. Personas **can distance a team from a user community**.
- Personas **need to be regularly reviewed and updated**.
| Limitation | How it looks in an IT team | What helps |
|---|---|---|
| Generic user | one persona "Average User, 18–65, uses every feature" | several distinct, ranked personas with clear differentiators |
| Not a substitute for a real user | the team argues about "what Aliya wants" and stops talking to real customers | personas plus interviews, reviews and usability tests with real users |
| Needs regular review | a persona written three years ago still "pays only by card" | revisit personas when the user base or market changes |
?? Why does an agile team without direct access to a customer representative still benefit from personas?
?= Personas let it understand value from the perspective of a particular stakeholder and empathize with typical users, so work can focus on the features of greatest value to a particular persona.
?? In Table 1, which techniques work well with stakeholders external to the team?
?= Communications: Reviews and Visioning; Process Analysis: Impact Mapping; Product Management Refinement: Kano Analysis and Minimal Viable Product. Requirements Management and Understanding your Customer have none.
?? "Withdrawing the minimum amount needed" — is it a trait, a motivation, a need or a differentiator?
?= A motivation: it explains why and how the person uses the ATM. The trait on the slide is "likes to get small amounts out at a time".
## Exam focus
- Personas purpose: **understand and empathize with an intended stakeholder → align the solution with the stakeholder need**.
- Personas description: **fictional characters or archetypes**; useful when the team **may not have direct access to a customer representative**; **ranked** by who will realize **the most benefit from the solution design**.
- Six elements in order: **Long and Short Template, Persona Name and Image, Traits and Characteristics, Motivations, Needs, Differentiators**.
- Short template = **one-page quick view of key information**; long = **more in-depth details**; **additional user research** expands short → long.
- **Needs are finite, wants are infinite.** Differentiators: **generational or experiential, preference, identifying characteristics**.
- Limitations (3): **generic user — everything to everyone**; **not a good substitute for a real user, can distance a team**; **must be regularly reviewed and updated**.
- Table 1 is **a starting point**; selection relies on **domain knowledge, experience, individual competencies, creativity**. **Visioning** and **MVP** are in both columns; **Reviews, Impact Mapping, Kano Analysis** are external only.`,
    ru: `## Откуда эта лекция
Лекция «Practices (techniques) in agile frameworks» опирается на один источник: **Agile Extension to the BABOK® Guide (2017)** — его издали **International Institute of Business Analysis (IIBA) и Agile Alliance**. В главе 7 описаны **24 техники (techniques)**, которыми пользуется бизнес-аналитик в agile (agile business analysis practitioner). Слайды берут оттуда три вещи: **выбор подходящей техники (Selecting the Right Technique)** с **таблицей 1 (Table 1)**, **персоны (Personas)** и **пользовательские истории (User Stories)**.
Каждая техника в руководстве описана под одними и теми же заголовками, и слайды их сохраняют:
| Заголовок | На что отвечает |
|---|---|
| Purpose (назначение) | зачем нужна техника — одно предложение |
| Description (описание) | что это и как работает |
| Elements (элементы) | из каких частей состоит, с номерами 1, 2, 3… |
| Usage Considerations (особенности применения) | 1 Strengths (сильные стороны) и 2 Limitations (ограничения) |
> Запомнить: Purpose → Description → Elements → Usage Considerations (Strengths, Limitations). Вопросы вида «назначение персон» или «ограничение user stories» цитируют именно эти разделы.
## Выбор подходящей техники (Selecting the Right Technique)
- «Бывает непросто выбрать технику, подходящую к ситуации, чтобы получить желаемый результат (desired outcome)».
- Таблица 1 даёт **общие ориентиры (general guidance), когда выбирать ту или иную технику**.
- «Обратите внимание: **многие техники успешно применяются в самых разных контекстах (variety of contexts)**».
- Бизнес-аналитик в agile, выбирая технику под желаемый результат, опирается на **знание предметной области (domain knowledge), опыт (experience), личные компетенции (individual competencies) и творческий подход (creativity)**.
> **Назначение таблицы 1** — дать **отправную точку (a starting point)**, когда решаешь, какая техника может пригодиться в данном контексте.
> Ловушка экзамена: таблица 1 — ориентир, отправная точка, а не обязательное правило и не полный список разрешённого. Окончательный выбор — за знанием предметной области, опытом, личными компетенциями и творческим подходом самого аналитика.
## Таблица 1. Selecting the Right Technique
На слайде таблица — картинка. В ней три столбца: **контекст (Context)** — чего вы добиваетесь, техники, которые **хорошо работают с внутренними командами (internal teams)**, и техники, которые **хорошо работают со стейкхолдерами вне команды (stakeholders external to the team)**. Номера — это номера разделов техник в руководстве.
| Контекст (Context) | Works well with internal teams (внутренние команды) | Works well with stakeholders external to the team (внешние стейкхолдеры) |
|---|---|---|
| Communications (коммуникации) | 7.1 Backlog Refinement; 7.8 Planning Workshops; 7.9 Portfolio Kanban; 7.14 Retrospectives; 7.24 Visioning | 7.15 Reviews; 7.24 Visioning |
| Process Analysis (анализ процессов) | 7.23 Value Stream Mapping | 7.3 Impact Mapping |
| Product Management Refinement (уточнение управления продуктом) | 7.6 Minimal Viable Product; 7.10 Product Roadmap; 7.11 Purpose Alignment Model; 7.12 Real Options | 7.5 Kano Analysis; 7.6 Minimal Viable Product |
| Requirements Management (управление требованиями) | 7.2 Behaviour Driven Development; 7.4 Job Stories; 7.13 Relative Estimation; 7.16 Spikes; 7.18 Story Decomposition; 7.19 Story Elaboration; 7.20 Story Mapping; 7.21 User Stories | — |
| Understanding your Customer (понимание клиента) | 7.7 Personas; 7.17 Storyboarding; 7.22 Value Modelling | — |
## Как читать таблицу 1
- **Пять контекстов:** Communications, Process Analysis, Product Management Refinement, Requirements Management, Understanding your Customer.
- **24 техники** с номерами 7.1–7.24. Номера идут просто по алфавиту (7.1 Backlog Refinement … 7.24 Visioning), так что заучивать их не нужно.
- **В обоих столбцах** стоят только **Visioning** (Communications) и **Minimal Viable Product** (Product Management Refinement).
- **Только во внешнем столбце:** **Reviews** (Communications), **Impact Mapping** (Process Analysis) и **Kano Analysis** (Product Management Refinement).
- **Requirements Management** — самая большая строка (8 техник); у неё и у **Understanding your Customer** во внешнем столбце **пусто**.
- **Personas (7.7)** → Understanding your Customer, внутренние команды. **User Stories (7.21)** → Requirements Management, внутренние команды, в одной строке со своими помощниками **Story Decomposition** и **Story Elaboration**.
| Контекст | Внутр. | Внешн. | Всего записей |
|---|---|---|---|
| Communications | 5 | 2 | 7 |
| Process Analysis | 1 | 1 | 2 |
| Product Management Refinement | 4 | 2 | 6 |
| Requirements Management | 8 | 0 | 8 |
| Understanding your Customer | 3 | 0 | 3 |
= 26 entries - 2 repeated (Visioning, Minimal Viable Product) = 24 techniques
> Ловушка экзамена: «Personas хорошо работают со стейкхолдерами вне команды» — по таблице 1 неверно: Personas стоят только в столбце **внутренних команд**, внешняя ячейка Understanding your Customer пуста. То же с User Stories в Requirements Management.
## Остальные техники таблицы 1 — по строчке
На слайдах только названия. Идеи ниже — для ориентира (общая agile-практика, не текст слайдов), чтобы названия в таблице что-то значили:
| Техника | Идея в одну строку |
|---|---|
| Backlog Refinement (уточнение бэклога) | держать бэклог упорядоченным и достаточно детальным для ближайших итераций |
| Behaviour Driven Development (BDD) | описывать поведение конкретными примерами (Given / When / Then), которые становятся тестами |
| Impact Mapping (карта влияния) | связать бизнес-цель с акторами, влияниями и поставляемыми результатами |
| Job Stories | требование от ситуации: «When…, I want to…, so I can…» |
| Kano Analysis (анализ Кано) | разложить функции по тому, как они влияют на удовлетворённость клиента |
| Minimal Viable Product (MVP) | самый маленький продукт, на котором команда учится у реальных пользователей |
| Planning Workshops (планировочные воркшопы) | совместные сессии планирования релизов и итераций |
| Portfolio Kanban | визуализировать и ограничивать поток инициатив по портфелю |
| Product Roadmap (дорожная карта продукта) | запланированное развитие продукта во времени |
| Purpose Alignment Model | делить функции на те, что отличают бизнес, и критичные для работы (mission critical) |
| Real Options (реальные опционы) | держать варианты открытыми и решать в последний ответственный момент |
| Relative Estimation (относительная оценка) | оценивать элементы, сравнивая их друг с другом (например, в story points) |
| Retrospectives (ретроспективы) | команда разбирает, как работает, и договаривается об улучшениях |
| Reviews (обзоры) | показать работу стейкхолдерам и собрать обратную связь |
| Spikes (спайки) | короткое исследование с таймбоксом, чтобы снизить неопределённость |
| Storyboarding (раскадровка) | последовательность картинок: как пользователь проходит задачу |
| Story Decomposition (декомпозиция историй) | разбить большую историю на меньшие |
| Story Elaboration (проработка историй) | добавить истории детали прямо перед реализацией |
| Story Mapping (карта историй) | разложить истории по пути пользователя, чтобы видеть продукт целиком |
| Value Modelling (моделирование ценности) | смоделировать, какую ценность получает клиент и как |
| Value Stream Mapping (карта потока ценности) | нарисовать поток работы от запроса до поставки, чтобы найти потери |
| Visioning (формирование видения) | создать общее представление о желаемом результате |
Personas и User Stories в этом списке нет: их лекция дальше разбирает полностью.
## Персоны — назначение и описание
> **Назначение (Purpose):** персоны нужны, чтобы **понять предполагаемого стейкхолдера и сопереживать ему (understand and empathize with an intended stakeholder)** и так **привести решение в соответствие с его потребностью (align the solution with the stakeholder need)**.
> **Описание (Description):** персоны — это **вымышленные персонажи или архетипы (fictional characters or archetypes)**, на примере которых видно, **как типичные пользователи взаимодействуют с решением (solution)**.
- В agile-подходах их часто используют, чтобы **понять ценность с точки зрения конкретного стейкхолдера**.
- Они помогают команде, у которой **может не быть прямого доступа к представителю заказчика (customer representative)**, лучше понять его потребности.
- Тогда работа может **сосредоточиться на функциях, наиболее ценных для конкретной персоны**.
## Что содержит персона
Персону описывают **так, будто это реальный человек**. В персоне могут быть:
- **имя, характер (personality), семья, опыт работы (work background), уровень навыков (skill level);**
- **предпочтения (preferences), модели поведения (behavior patterns), личные установки (personal attitudes);**
- **цели и потребности (goals and needs).**
Ещё в неё можно добавить **картинку** и короткий **рассказ «один день из жизни» («day in the life»)**, который помогает представить пользователя и его опыт.
## Персона и описание роли или актора
Бизнес-аналитики используют персоны, чтобы **понять стейкхолдеров глубже, чем обычно позволяет описание роли или актора (role or actor description)**.
| | Описание роли / актора | Персона |
|---|---|---|
| Пример: банковское приложение | «Клиент: есть счёт, может войти и перевести деньги» | «Алия, 29 лет, медсестра в ночную смену: платит по счетам с телефона в 3 часа ночи и боится отправить деньги не на тот счёт» |
| Что узнаёт команда | кому какая функция доступна | как ведёт себя похожий на реального человек, что его тревожит и движет им |
| Глубина | одинаково для всех в этой роли | тонкие черты: предпочтения, установки, уровень навыков, контекст |
- Персоны **помогают улучшить решение, его назначение и удобство (a solution, a purpose, and usability)**, потому что **списаны с тонких черт реальных людей (subtle qualities of real people)**, которые будут работать с решением, и с того, как они делают свою работу.
- **Персоны ранжируют (ranked)**, чтобы найти тех, кто **получит наибольшую пользу от проектного решения (the most benefit from the solution design)**.
> Ловушка экзамена: персона вымышлена, но не взята из воздуха — она списана с реальных людей и, если данные есть, строится на демографических данных о пользователях. И это не роль: «Клиент» — роль; «Алия, 29 лет, медсестра в ночную смену» — персона.
## Персоны — шесть элементов (Elements)
| № | Элемент | Что сказано на слайде |
|---|---|---|
| 1 | Long and Short Template (длинный и короткий шаблон) | **короткий** шаблон — обзор ключевой информации на одной странице; **длинный** — больше подробностей и глубины понимания |
| 2 | Persona Name and Image (имя и изображение) | **реалистичное имя** и **вымышленная картинка** повышают **узнаваемость (relatability)**, а с ней понимание стейкхолдера и сопереживание ему |
| 3 | Traits and Characteristics (черты и характеристики) | **уникальные, отличительные и выделяющие (unique, distinguishing, and differentiating)** черты или характеристики предполагаемого стейкхолдера |
| 4 | Motivations (мотивы) | **глубинные мотивы (underlying motivations)**: **как и почему** стейкхолдер взаимодействует с решением |
| 5 | Needs (потребности) | **очень конкретные потребности**: базовые (безопасность, доверие, доступ к еде и крову) или более высокого уровня (принятие и признание) |
| 6 | Differentiators (отличия) | **чем именно эта персона отличается от другой персоны** — что в ней уникального |
## Элемент 1 — длинный и короткий шаблон
Бизнес-аналитики часто используют **два разных шаблона** при создании персон:
- **короткий шаблон (short template)** — **обзор ключевой информации на одной странице (one-page quick view)**, и
- **длинный шаблон (long template)** — **больше подробностей и глубины понимания (in-depth details and understanding)**.
**Дополнительное исследование пользователей (additional user research)** помогает развернуть короткий шаблон в длинный.
Оба шаблона на слайдах — картинки (Figure 1 и Figure 2). Их поля:
| Поле | Figure 1. Short Persona Template | Figure 2. Long Persona Template |
|---|---|---|
| Picture (картинка) | есть | есть |
| Name (имя) | есть | есть |
| Details or Context (детали или контекст): Tasks and responsibilities, Technology | есть | — |
| Traits and characteristics: Age, Occupation, Location (возраст, занятие, место) | есть | Traits (столбец) |
| Goals (цели): Goal 1, Goal 2, Goal 3 | есть | — |
| Demographics (демография) | — | есть (рядом с именем) |
| Buying motive (мотив покупки) | — | есть |
| Needs | — | есть (столбец) |
| Motivation | — | есть (столбец) |
| Differentiators | — | есть (столбец) |
@diagram pm8-persona-templates
- **Как устроен Figure 1:** сетка 2 × 2 — сверху **Name** (с картинкой) и **Details or Context**; снизу **Traits and characteristics** и **Goals**.
- **Как устроен Figure 2:** верхний ряд — **картинка**, **Name и Demographics** и **Buying motive**; под ним четыре столбца — **Traits, Needs, Motivation, Differentiators**.
> Ловушка экзамена: **Goals** и **Details or Context** есть только в коротком шаблоне; **Buying motive, Needs, Motivation и Differentiators** — только в длинном. Traits — в обоих.
## Элементы 2–6 и примеры с банкоматом (ATM)
- **2 Persona Name and Image.** Аналитики дают персоне реалистичное имя и прикрепляют вымышленную картинку, чтобы повысить её узнаваемость, а через неё — понимание предполагаемого стейкхолдера и сопереживание ему.
- **3 Traits and Characteristics.** Уникальные, отличительные и выделяющие черты. Пример с банкоматом: одна персона — **офис-менеджер, который вносит наличные в конце дня**; другая — **человек, который любит снимать понемногу за раз**.
- **4 Motivations.** Как и почему стейкхолдер взаимодействует с решением. Пример: **офис-менеджером** может двигать **снижение риска мошенничества или кражи (reducing risk of fraud or theft)**; **человеком, снимающим деньги**, — **желание снять минимально нужную сумму (withdrawing the minimum amount needed)**.
- **5 Needs.** Очень конкретные потребности: базовые — **безопасность, доверие, доступ к еде и крову (safety, trust, access to food and shelter)** — или более высокого уровня — **потребность в принятии и признании (acceptance and validation)**. **Потребности конечны, а желания (wants) бесконечны.**
- **6 Differentiators.** Определяют, **чем именно эта персона отличается от другой персоны** и что в ней уникального. Это могут быть **поколенческие или связанные с опытом отличия (generational or experiential), отличия в предпочтениях (preference) или опознавательные черты (identifying characteristics)**.
| Персона у банкомата | Офис-менеджер | Человек, снимающий наличные |
|---|---|---|
| Черта (слайд) | вносит наличные в конце дня | любит снимать понемногу за раз |
| Мотив (слайд) | снизить риск мошенничества или кражи | снять минимально нужную сумму |
| Потребность (наша иллюстрация) | безопасность: дневная выручка не пропадёт и не будет украдена | доверие: банкомат выдаст ровно запрошенное |
| Отличие (наша иллюстрация) | по опыту: каждый день работает с деньгами бизнеса | по предпочтению: много маленьких снятий вместо одного крупного |
> Ловушка экзамена: **черта (trait)** — какой человек и что он делает; **мотив (motivation)** — почему и как он пользуется решением; **потребность (need)** — конкретная конечная потребность (безопасность, доверие, принятие, признание); **отличие (differentiator)** — чем эта персона выделяется на фоне *другой* персоны.
## Особенности применения — сильные стороны (Strengths)
- Персоны **помогают выработать общее понимание конкретных требований для разных групп пользователей (shared understanding)**. Из этих требований **можно разработать user stories**.
- **Предлагаемые решения можно направлять тем, насколько хорошо они отвечают потребностям отдельных персон.** Функции можно **приоритизировать по тому, насколько они закрывают потребности одной или нескольких персон**.
- Они **дают человеческое «лицо» (a human "face")**, чтобы **сосредоточить сопереживание на людях, стоящих за демографией**.
- Если данные есть, хорошее начало для персон — **демографические (или «антропоморфные», anthropomorphic) данные** о предполагаемых пользователях. Но иногда приходится **проявить фантазию и придумать персоны, имея лишь несколько сухих фактов (a few dry facts)** о конечных пользователях. В любом случае нужно определить **репрезентативный набор персон (a representative pool of personas)**.
- Персоны помогают **удержать стейкхолдеров от того, чтобы переносить на решение свои ценности и предубеждения (projecting individual values and biases)**. Они помогают **развить сочувствие (compassion) к разным пользователям**.
> О формулировке: на слайде буквально «help stakeholders from projecting» — по смыслу «помогают удержать стейкхолдеров от» переноса своих ценностей и предубеждений. «Anthropomorphic» — слово самого руководства в скобках; суть — демографические данные о реальных пользователях. Сильных сторон на слайдах пять.
## Особенности применения — ограничения (Limitations)
- Персоны **вымышлены**, поэтому есть соблазн собрать в персоне **черты, общие для большинства пользователей**; так получается **обобщённый пользователь (generic user), не отличимый от других и не реалистичный**, а это ведёт к **решениям, которые пытаются быть всем для всех (everything to everyone)**.
- Персоны **могут плохо заменять реального пользователя (not a good substitute for a real user)**. Персоны **могут отдалить команду от сообщества пользователей (distance a team from a user community)**.
- Персоны **нужно регулярно пересматривать и обновлять (regularly reviewed and updated)**.
| Ограничение | Как это выглядит в IT-команде | Что помогает |
|---|---|---|
| Обобщённый пользователь | одна персона «Средний пользователь, 18–65 лет, пользуется всеми функциями» | несколько разных ранжированных персон с ясными отличиями |
| Не замена реальному пользователю | команда спорит, «чего хочет Алия», и перестаёт говорить с реальными клиентами | персоны плюс интервью, обзоры и юзабилити-тесты с реальными пользователями |
| Нужен регулярный пересмотр | персона трёхлетней давности всё ещё «платит только картой» | пересматривать персоны, когда меняются пользователи или рынок |
?? Почему agile-команде без прямого доступа к представителю заказчика всё равно полезны персоны?
?= Персоны позволяют понять ценность с точки зрения конкретного стейкхолдера и сопереживать типичным пользователям, так что работа сосредотачивается на функциях, наиболее ценных для конкретной персоны.
?? Какие техники в таблице 1 хорошо работают со стейкхолдерами вне команды?
?= Communications: Reviews и Visioning; Process Analysis: Impact Mapping; Product Management Refinement: Kano Analysis и Minimal Viable Product. У Requirements Management и Understanding your Customer — ни одной.
?? «Снять минимально нужную сумму» — это черта, мотив, потребность или отличие?
?= Мотив: он объясняет, почему и как человек пользуется банкоматом. Черта на слайде — «любит снимать понемногу за раз».
## Что спросят на экзамене (Exam focus)
- Назначение персон: **понять предполагаемого стейкхолдера и сопереживать ему → привести решение в соответствие с его потребностью**.
- Описание персон: **вымышленные персонажи или архетипы**; полезны, когда у команды **может не быть прямого доступа к представителю заказчика**; **ранжируются** по тому, кто получит **наибольшую пользу от проектного решения**.
- Шесть элементов по порядку: **Long and Short Template, Persona Name and Image, Traits and Characteristics, Motivations, Needs, Differentiators**.
- Короткий шаблон = **обзор ключевой информации на одной странице**; длинный = **больше подробностей**; **дополнительное исследование пользователей** разворачивает короткий в длинный.
- **Потребности конечны, желания бесконечны.** Отличия: **поколенческие или по опыту, по предпочтениям, опознавательные черты**.
- Ограничения (3): **обобщённый пользователь — всем для всех**; **плохо заменяет реального пользователя, может отдалить команду**; **нужно регулярно пересматривать и обновлять**.
- Таблица 1 — **отправная точка**; выбор опирается на **знание предметной области, опыт, личные компетенции, творческий подход**. **Visioning** и **MVP** — в обоих столбцах; **Reviews, Impact Mapping, Kano Analysis** — только во внешнем.`,
  },
  [
    qx("According to the Agile Extension to the BABOK Guide, what is the purpose of personas?", "To understand and empathize with a stakeholder so the solution fits their need", [
      ["To document every function available to a user role in a detailed specification", "That describes a detailed role-based specification. Personas go deeper than a role or actor description and are about empathy, not completeness of functions.", "Это детальная спецификация по ролям. Персоны глубже описания роли или актора и нужны для сопереживания, а не для полноты списка функций."],
      ["To replace interviews with real users once the product backlog has been created", "The slides warn the opposite: personas may not be a good substitute for a real user and can distance a team from the user community.", "Слайды предупреждают об обратном: персоны могут плохо заменять реального пользователя и отдалять команду от сообщества пользователей."],
      ["To estimate the effort of user stories from the team's past experience", "Estimating effort from past experience is the \"E\" (Estimable) in INVEST for user stories, not the purpose of personas.", "Оценка трудозатрат по прошлому опыту — это «E» (Estimable) в INVEST для user stories, а не назначение персон."],
    ], "Purpose (slide): personas are used to understand and empathize with an intended stakeholder in order to align the solution with the stakeholder need.", "Назначение (слайд): персоны нужны, чтобы понять предполагаемого стейкхолдера и сопереживать ему и так привести решение в соответствие с его потребностью."),
    qx("How does the lecture describe personas?", "Fictional archetypes that exemplify how typical users interact with a solution", [
      ["Real customers selected to represent each user group inside the agile delivery team", "Personas are explicitly fictional. A real customer representative is exactly what the team may lack — personas help in that case.", "Персоны прямо названы вымышленными. Реального представителя заказчика у команды как раз может не быть — тогда и помогают персоны."],
      ["Formal role or actor descriptions that list the functions each user may access", "Personas give a deeper understanding of stakeholders than is generally provided from a role or actor description — they are not the same thing.", "Персоны дают более глубокое понимание стейкхолдеров, чем описание роли или актора, — это не одно и то же."],
      ["Statistical summaries of the whole user population produced by market research", "Demographic data is a good way to start building personas, but a persona is a character described as though it is a real person, not a statistic.", "Демографические данные — хорошее начало для персон, но персона — персонаж, описанный как реальный человек, а не статистика."],
    ], "Description (slide): personas are fictional characters or archetypes that exemplify the way that typical users interact with a solution.", "Описание (слайд): персоны — вымышленные персонажи или архетипы, на примере которых видно, как типичные пользователи взаимодействуют с решением."),
    qx("A persona \"may provide\" several kinds of information. Which item is NOT in the slide's list?", "Acceptance criteria for features", [
      ["Skill level and work background", "Both are in the list: name, personality, family, work background, skill level, preferences, behavior patterns, personal attitudes, goals and needs.", "Оба пункта есть в списке: имя, характер, семья, опыт работы, уровень навыков, предпочтения, модели поведения, установки, цели и потребности."],
      ["Preferences and behavior patterns", "Both are listed on the slide as things a persona may provide.", "Оба названы на слайде среди того, что может содержать персона."],
      ["Personal attitudes, goals and needs", "All three end the slide's list of what a persona may provide.", "Все три завершают список на слайде."],
    ], "Acceptance criteria belong to the Confirmation of a user story, not to a persona. A persona may provide a name, personality, family, work background, skill level, preferences, behavior patterns, personal attitudes, goals and needs, plus a picture and a \"day in the life\" narrative.", "Acceptance criteria относятся к Confirmation в user story, а не к персоне. Персона может содержать имя, характер, семью, опыт работы, уровень навыков, предпочтения, модели поведения, установки, цели и потребности, а также картинку и рассказ «один день из жизни»."),
    qx("Why do business analysis practitioners use personas rather than relying only on a role or actor description?", "They give a deeper understanding of stakeholders than a role or actor description", [
      ["They are required by the Scrum Guide for every single item in the Product Backlog", "The Scrum Guide does not mention personas at all; they are a technique of the Agile Extension to the BABOK Guide.", "Scrum Guide персоны вообще не упоминает; это техника из Agile Extension to the BABOK Guide."],
      ["Role and actor descriptions are not allowed in agile approaches at all", "Nothing forbids roles; a user story's WHO is even \"a user role or persona\". Personas simply go deeper.", "Роли никто не запрещает; WHO в user story — это даже «a user role or persona». Персоны просто идут глубже."],
      ["They remove the need to prioritize features by their value to users", "The opposite: features can be prioritized based on how well they address the needs of one or more personas.", "Наоборот: функции приоритизируют по тому, насколько они закрывают потребности одной или нескольких персон."],
    ], "Slide: practitioners use personas to gain a deeper understanding of stakeholders than is generally provided from a role or actor description; personas are patterned after the subtle qualities of real people.", "Слайд: аналитики используют персоны, чтобы понять стейкхолдеров глубже, чем позволяет описание роли или актора; персоны списаны с тонких черт реальных людей."),
    qx("According to the slides, why are personas ranked?", "To identify those that will realize the most benefit from the solution design", [
      ["To decide which developer will own all the user stories written for each persona", "Personas are not assigned to developers; ranking is about who benefits from the solution.", "Персоны не закрепляют за разработчиками; ранжирование — о том, кто получит пользу от решения."],
      ["To find which persona is the most realistic and least generic of all", "Realism matters (a generic user is a limitation), but the slide gives a different reason for ranking.", "Реалистичность важна (обобщённый пользователь — ограничение), но причина ранжирования на слайде другая."],
      ["To order personas by age so the template can be filled in faster", "Age is just a field of the short template; ranking is not about filling templates.", "Возраст — лишь поле короткого шаблона; ранжирование не связано с заполнением шаблонов."],
    ], "Slide: \"Personas are ranked to identify those that will realize the most benefit from the solution design.\"", "Слайд: «Персоны ранжируют, чтобы найти тех, кто получит наибольшую пользу от проектного решения»."),
    qx("Which statement correctly contrasts the two persona templates?", "Short: a one-page quick view of key information; long: more in-depth details", [
      ["Short: more in-depth details; long: a one-page quick view of key information", "The descriptions are swapped: the short template is the one-page quick view.", "Описания перепутаны: обзор на одной странице — это короткий шаблон."],
      ["Short: used with internal teams; long: used with stakeholders outside the team", "That mixes in the columns of Table 1; the templates differ in depth, not audience.", "Здесь подмешаны столбцы таблицы 1; шаблоны различаются глубиной, а не аудиторией."],
      ["Short: used for writing user stories; long: used for the product roadmap", "Neither template is tied to a specific technique; they differ in how much detail they hold.", "Ни один шаблон не привязан к конкретной технике; они различаются объёмом деталей."],
    ], "Slide: a short template offers a one-page quick view of key information; a long template offers more in-depth details and understanding. Additional user research helps expand from short to long.", "Слайд: короткий шаблон — обзор ключевой информации на одной странице; длинный — больше подробностей и глубины. Дополнительное исследование пользователей разворачивает короткий в длинный."),
    qx("Which set of fields makes up the Short Persona Template (Figure 1)?", "Name, Details or Context, Traits and characteristics, Goals", [
      ["Picture, Name and Demographics, Buying motive, Needs, Motivation", "This set comes from the Long Persona Template (Figure 2): Demographics, Buying motive, Needs and Motivation are not in the short one.", "Этот набор — из длинного шаблона (Figure 2): Demographics, Buying motive, Needs и Motivation в коротком нет."],
      ["Traits, Needs, Motivation and Differentiators columns", "These four columns form the lower part of the Long Persona Template.", "Эти четыре столбца — нижняя часть длинного шаблона."],
      ["Role, Feature, Goal or value, Acceptance criteria", "These are parts of a user story (format and confirmation), not of a persona template.", "Это части user story (формат и подтверждение), а не шаблона персоны."],
    ], "Figure 1 is a 2 × 2 grid: Name (with a picture), Details or Context (tasks and responsibilities, technology), Traits and characteristics (age, occupation, location) and Goals (Goal 1–3).", "Figure 1 — сетка 2 × 2: Name (с картинкой), Details or Context (задачи и обязанности, технологии), Traits and characteristics (возраст, занятие, место) и Goals (цели 1–3)."),
    qx("Which field appears in the Long Persona Template (Figure 2) but not in the short one?", "Buying motive", [
      ["Goals", "Goals appear only in the short template (Goal 1, Goal 2, Goal 3).", "Goals есть только в коротком шаблоне (Goal 1, Goal 2, Goal 3)."],
      ["Picture", "Both templates have a picture next to the name.", "Картинка есть в обоих шаблонах рядом с именем."],
      ["Details or Context", "Details or Context (tasks and responsibilities, technology) is a box of the short template only.", "Details or Context (задачи и обязанности, технологии) — блок только короткого шаблона."],
    ], "Figure 2: Picture; Name and Demographics; Buying motive; columns Traits, Needs, Motivation, Differentiators. Buying motive, Needs, Motivation and Differentiators are long-template-only fields.", "Figure 2: картинка; Name и Demographics; Buying motive; столбцы Traits, Needs, Motivation, Differentiators. Buying motive, Needs, Motivation и Differentiators есть только в длинном шаблоне."),
    qx("The slide says an ATM office manager \"may be motivated by reducing risk of fraud or theft\". Which persona element does this illustrate?", "Motivations", [
      ["Traits and characteristics", "The office manager's trait on the slide is that he deposits cash at the end of the day — what he does, not why.", "Черта офис-менеджера на слайде — вносит наличные в конце дня: что он делает, а не почему."],
      ["Needs", "Needs are very specific, finite needs like safety or trust; the slide uses \"reducing risk of fraud or theft\" as the motivation example.", "Needs — очень конкретные конечные потребности вроде безопасности или доверия; «снизить риск мошенничества или кражи» на слайде — пример мотива."],
      ["Differentiators", "Differentiators say why this persona differs from another persona (generational, experiential, preference).", "Differentiators объясняют, чем персона отличается от другой (поколение, опыт, предпочтения)."],
    ], "Element 4, Motivations: the underlying motivations regarding how and why the stakeholder interacts with the solution. ATM: the office manager — reducing risk of fraud or theft; the individual — withdrawing the minimum amount needed.", "Элемент 4, Motivations: глубинные мотивы — как и почему стейкхолдер взаимодействует с решением. Банкомат: офис-менеджер — снизить риск мошенничества или кражи; частный человек — снять минимально нужную сумму."),
    qx("What does the lecture say about needs compared with wants?", "Needs are finite, while wants are infinite", [
      ["Needs are infinite, while wants are finite", "The slide says exactly the reverse.", "На слайде сказано ровно наоборот."],
      ["Needs and wants are one and the same element", "The slide contrasts them; only needs are a persona element.", "Слайд их противопоставляет; элемент персоны — только потребности."],
      ["Wants go in personas, needs go in user stories", "Needs are element 5 of a persona; wants are not a persona element at all.", "Потребности — элемент 5 персоны; желания вообще не элемент персоны."],
    ], "Element 5, Needs: very specific needs — basic (safety, trust, access to food and shelter) or higher level (acceptance and validation). \"Needs are finite as compared to wants which are infinite.\"", "Элемент 5, Needs: очень конкретные потребности — базовые (безопасность, доверие, еда и кров) или более высокого уровня (принятие и признание). «Потребности конечны, а желания бесконечны»."),
    qx("Which of these is a kind of persona differentiator named on the slide?", "Generational or experiential differentiators", [
      ["Financial or contractual differentiators", "The slide names generational or experiential, preference differentiators, or identifying characteristics — not financial ones.", "На слайде названы поколенческие или по опыту, по предпочтениям и опознавательные черты — финансовых нет."],
      ["Technical or architectural differentiators", "Personas describe people, not system architecture.", "Персоны описывают людей, а не архитектуру системы."],
      ["Legal, regulatory or compliance differentiators", "Not on the slide; differentiators are about what makes this persona unique as a person.", "Этого нет на слайде; отличия — о том, чем персона уникальна как человек."],
    ], "Element 6, Differentiators: identify specifically why this persona is different from another persona — generational or experiential differentiators, preference differentiators, or identifying characteristics.", "Элемент 6, Differentiators: чем именно эта персона отличается от другой — поколенческие или по опыту, по предпочтениям, опознавательные черты."),
    qx("A team writes one persona, \"Typical User\", combining traits common to most of its users. Which limitation of personas does this show?", "A generic user that leads to a solution trying to be everything to everyone", [
      ["Personas can distance the whole product team from the real community of its users", "That is a different limitation — about replacing contact with real users, not about generic traits.", "Это другое ограничение — о подмене общения с реальными пользователями, а не об обобщённых чертах."],
      ["Personas need to be regularly reviewed and updated over the product's life", "True as a limitation, but the case is about blending everyone into one persona, not about staleness.", "Это тоже ограничение, но кейс — о смешении всех в одну персону, а не об устаревании."],
      ["Too many personas can inflate the backlog and hide the product vision", "Inflating the backlog is a limitation of user stories (too many stories), not of personas.", "Раздутый бэклог — ограничение user stories (слишком много историй), а не персон."],
    ], "Slide: personas are fictional, so there is a tendency to embody traits common to most users; this creates a generic user that is not distinct or realistic and can lead to solutions trying to be everything to everyone.", "Слайд: персоны вымышлены, поэтому возникает соблазн собрать черты большинства; получается обобщённый пользователь, не отличимый и не реалистичный, и решения пытаются быть всем для всех."),
    qx("A product team trusts its personas so much that it stops meeting actual customers. Which limitation from the slides fits best?", "Personas may not be a good substitute for a real user", [
      ["Personas create a generic user who is not distinct or realistic", "The case is not about a blended persona but about replacing real people with personas.", "Кейс не про смешанную персону, а про замену реальных людей персонами."],
      ["Personas must be reviewed and updated regularly", "Updating is needed, but it does not explain losing contact with real customers.", "Обновлять нужно, но это не объясняет потерю контакта с реальными клиентами."],
      ["Personas push stakeholders to project their biases", "Reversed: a strength of personas is that they help keep stakeholders from projecting their values and biases.", "Наоборот: сила персон в том, что они удерживают стейкхолдеров от переноса своих ценностей и предубеждений."],
    ], "Slide: personas may not be a good substitute for a real user; personas can distance a team from a user community.", "Слайд: персоны могут плохо заменять реального пользователя; персоны могут отдалить команду от сообщества пользователей."),
    qx("What is the purpose of Table 1, \"Selecting the Right Technique\"?", "To provide a starting point for deciding which technique might be useful", [
      ["To prescribe the mandatory technique for each context of an agile project", "The slide calls the table general guidance and a starting point; many techniques work in a variety of contexts.", "Слайд называет таблицу общим ориентиром и отправной точкой; многие техники работают в разных контекстах."],
      ["To rank all agile techniques from the most to the least effective one", "The table groups techniques by context and audience; it does not rank effectiveness.", "Таблица группирует техники по контексту и аудитории; эффективность она не ранжирует."],
      ["To list the techniques that every Scrum team is obliged to use", "Nothing in the table is obligatory, and it does not come from Scrum.", "Ничего в таблице не обязательно, и взята она не из Scrum."],
    ], "Slide: \"The purpose of Table 1 is to provide a starting point when determining which technique might be useful in a given context.\"", "Слайд: «Назначение таблицы 1 — дать отправную точку, когда решаешь, какая техника может пригодиться в данном контексте»."),
    qx("Which of the following is NOT named on the slide as something a practitioner uses when selecting a technique?", "Sponsor approval", [
      ["Domain knowledge", "Named on the slide: domain knowledge, experience, individual competencies, and creativity.", "Названо на слайде: знание предметной области, опыт, личные компетенции и творческий подход."],
      ["Individual competencies", "Named on the slide as one of the four things the practitioner relies on.", "Названо на слайде как одна из четырёх опор аналитика."],
      ["Creativity", "Named on the slide, last in the list of four.", "Названо на слайде, последним из четырёх."],
    ], "Slide: an agile business analysis practitioner uses his or her domain knowledge, experience, individual competencies, and creativity when selecting the appropriate technique. Sponsor approval is not mentioned.", "Слайд: аналитик выбирает технику, опираясь на знание предметной области, опыт, личные компетенции и творческий подход. Одобрение спонсора не упоминается."),
    qx("In Table 1, under which context are Personas listed?", "Understanding your Customer", [
      ["Requirements Management", "This row holds User Stories, Story Decomposition, Story Elaboration and other story techniques — not Personas.", "В этой строке User Stories, Story Decomposition, Story Elaboration и другие техники историй — не Personas."],
      ["Communications", "This row holds Backlog Refinement, Planning Workshops, Portfolio Kanban, Retrospectives, Reviews and Visioning.", "Здесь Backlog Refinement, Planning Workshops, Portfolio Kanban, Retrospectives, Reviews и Visioning."],
      ["Product Management Refinement", "This row holds MVP, Product Roadmap, Purpose Alignment Model, Real Options and Kano Analysis.", "Здесь MVP, Product Roadmap, Purpose Alignment Model, Real Options и Kano Analysis."],
    ], "Table 1: Understanding your Customer → 7.7 Personas, 7.17 Storyboarding, 7.22 Value Modelling (internal teams column).", "Таблица 1: Understanding your Customer → 7.7 Personas, 7.17 Storyboarding, 7.22 Value Modelling (столбец внутренних команд)."),
    qx("In Table 1, which technique works well with stakeholders external to the team in the Product Management Refinement context?", "Kano Analysis", [
      ["Product Roadmap", "Product Roadmap is in the internal-teams column of Product Management Refinement.", "Product Roadmap — в столбце внутренних команд строки Product Management Refinement."],
      ["Real Options", "Real Options is internal-only in Product Management Refinement.", "Real Options — только во внутреннем столбце Product Management Refinement."],
      ["Impact Mapping", "Impact Mapping is external, but in the Process Analysis row.", "Impact Mapping — внешний столбец, но в строке Process Analysis."],
    ], "Table 1, Product Management Refinement, external column: 7.5 Kano Analysis and 7.6 Minimal Viable Product.", "Таблица 1, Product Management Refinement, внешний столбец: 7.5 Kano Analysis и 7.6 Minimal Viable Product."),
    qx("Which technique appears in both columns of Table 1 — internal teams and external stakeholders?", "Visioning", [
      ["Reviews", "Reviews appears only in the external column (Communications).", "Reviews — только во внешнем столбце (Communications)."],
      ["Retrospectives", "Retrospectives appears only in the internal column (Communications).", "Retrospectives — только во внутреннем столбце (Communications)."],
      ["Personas", "Personas appears only in the internal column (Understanding your Customer).", "Personas — только во внутреннем столбце (Understanding your Customer)."],
    ], "Only two techniques sit in both columns: 7.24 Visioning (Communications) and 7.6 Minimal Viable Product (Product Management Refinement).", "В обоих столбцах только две техники: 7.24 Visioning (Communications) и 7.6 Minimal Viable Product (Product Management Refinement)."),
    tfx("In Table 1, Personas are listed as working well with stakeholders external to the team.", false,
      "Personas are only in the \"works well with internal teams\" column (Understanding your Customer); the external cell of that row is empty.",
      "Personas стоят только в столбце «works well with internal teams» (Understanding your Customer); внешняя ячейка этой строки пуста.",
      "\"True\" confuses the purpose of personas (empathy with external stakeholders) with where Table 1 places the technique.",
      "«Верно» путает назначение персон (сопереживание внешним стейкхолдерам) с тем, куда таблица 1 ставит саму технику."),
    qx("Which of the following is listed on the slides as a strength of personas?", "They help keep stakeholders from projecting their values and biases", [
      ["They let the team stop doing user research once they are written", "The opposite: additional user research expands personas, and personas are no substitute for real users.", "Наоборот: дополнительное исследование развивает персоны, а заменой реальным пользователям они не служат."],
      ["They never need to be changed after the first release of the product", "A limitation says personas need to be regularly reviewed and updated.", "Ограничение прямо говорит: персоны нужно регулярно пересматривать и обновлять."],
      ["They make acceptance criteria unnecessary for the related user stories", "Personas feed user stories; acceptance criteria remain the Confirmation of each story.", "Персоны питают user stories; acceptance criteria остаются Confirmation каждой истории."],
    ], "Strength (slide): personas help stakeholders from projecting individual values and biases onto the solution and help develop compassion for various users. Other strengths: shared understanding, guiding and prioritizing solutions, a human \"face\", demographic data as a start.", "Сильная сторона (слайд): персоны удерживают стейкхолдеров от переноса своих ценностей и предубеждений на решение и развивают сочувствие к разным пользователям. Другие: общее понимание, направление и приоритизация решений, человеческое «лицо», демография как старт."),
  ],
);

const p2 = part(
  "pm-l8-p2",
  { en: "User Stories: INVEST, the 3Cs and acceptance criteria", ru: "Пользовательские истории (User Stories): INVEST, три C и критерии приёмки" },
  {
    en: `## User Stories — Purpose and Description
> **Purpose:** User Stories are used to **convey a customer requirement for the delivery team**.
> **Description:** User Stories are **a representation of the customer need** and are expressed as **a small, concise statement of a feature needed to deliver value**. User Stories **facilitate the interaction and collaboration of stakeholders**.
- The user story **expresses a customer need and value desired**.
- Typically, they are **one or more sentences** written by the **customers, product owners, or business analysis practitioners** which describe **something of value to a stakeholder**.
- User Stories provide **a mechanism for the product owner to scope, coordinate, and prioritize the increments of user value for delivery**.
- **A user story is captured on the backlog.**
- User Stories represent stakeholder needs using **short, simple documentation** and **invite exploration of the requirements through conversations, tests, and supplemental requirements representations** as needed.
- They are **concise and easy to change** as stakeholder needs are better understood or as those needs evolve.
| Question | Answer from the slides |
|---|---|
| What for? | to convey a customer requirement for the delivery team |
| What is it? | a small, concise statement of a feature needed to deliver value |
| Who writes it? | customers, product owners, or business analysis practitioners |
| Where does it live? | on the backlog |
| What does it give the product owner? | a mechanism to scope, coordinate, and prioritize increments of user value |
| How is the detail found? | through conversations, tests, and supplemental requirements representations |
> Exam trap: a user story is deliberately **short and incomplete** — "concise and easy to change". A story that tries to be a full specification misses the point; the detail comes later through conversation and tests.
## INVEST — quality criteria for user stories
"A commonly used construct for **ensuring quality in user stories** is the **INVEST criteria**, which calls for user stories to be:"
| Letter | Criterion | Slide definition | Slide example or illustration |
|---|---|---|---|
| I | Independent | represents a feature which can be delivered independent of other features | slide: "ATM PIN entry" is independent from "Withdrawal Amount" |
| N | Negotiable | the team can negotiate how to deliver | illustration: the team decides how PIN entry is built |
| V | Valuable | expresses the value to the customer | slide: "ATM PIN entry" allows only the correct person to access the account |
| E | Estimable | team can estimate effort to deliver based on past experience | illustration: the team has built PIN screens before and can size this one |
| S | Sized Appropriately | for the team to complete in one iteration; in general, the smaller the better | illustration: "PIN entry" fits one iteration, "the whole ATM" does not |
| T | Testable | can be validated objectively by a stakeholder | illustration: "after three wrong PINs the card is blocked" can be checked |
@diagram pm8-invest
> Exam trap: on these slides **S = "Sized Appropriately"**, not "Small" (the word many other sources use). The idea is the same — complete in one iteration, the smaller the better — but if a question quotes the slide, choose **Sized Appropriately**.
> Exam trap: **E is Estimable** — the team *can* estimate effort based on past experience (not "Estimated"); **T is Testable** — validated **objectively by a stakeholder** (not "approved by the developers"); **N** means the team can negotiate **how to deliver** (not that the customer negotiates the price).
- **Not all backlog items are to be written as user stories.** However, User Stories is a common technique used **as they emphasize the customer value**.
| Hint words in a question | INVEST letter |
|---|---|
| "can be delivered without waiting for another feature" | I — Independent |
| "the team decides how to implement it" | N — Negotiable |
| "what the customer gains" | V — Valuable |
| "the team can size it from past experience" | E — Estimable |
| "fits in one iteration" | S — Sized Appropriately |
| "a stakeholder can check it objectively" | T — Testable |
> Memory hook: **I** stand alone, **N**ot fixed on how, **V**alue for the customer, **E**stimate from experience, **S**ized for one iteration, **T**ested objectively.
## Elements — the 3Cs
User Stories follow the **3Cs: Card, Conversation, and Confirmation**.
@diagram pm8-three-cs
| C | What it is | Key slide phrase |
|---|---|---|
| Card | the written story: an optional title and the WHO / WHAT / WHY format | "an active-verb goal phrase" |
| Conversation | the discussion between stakeholders and the delivery team | "intentionally does not capture all there is to know" |
| Confirmation | proof that the delivered item satisfies the need | "most often expressed as acceptance criteria" |
> Exam trap: the slides number the elements unevenly — "1 Card", "2 Format", "2 Conversation", "3 Confirmation", "5 User Story Management" (there is no 4). Title and Format are both parts of the **Card**; the three Cs are still exactly Card, Conversation and Confirmation.
## 1 Card — Title (optional)
- The title of the user story **describes an activity that the user wants to carry out with the solution**.
- Typically, it is **an active-verb goal phrase, similar to the way use cases are titled** — for example "Withdraw cash", "Reset password", "Book a room".
- The title is **optional**.
## Card — Format
**There is no mandatory structure for user stories**; however, the most popular format includes three components:
- **a user role or persona [WHO]**,
- **a necessary action, behavior, or feature [WHAT]**, and
- **the benefit or business value received by the user when the story is implemented [WHY]**.
**Example format 1:**
= As a <role>, I need to <feature> so that <goal or value>.
= As a current bank account holder, I need to access my account, so that I can withdraw cash.
**Example format 2:**
= In order to <business value>, as a <role>, I need to <behavior>.
= In order to withdraw cash from my account, as a current bank account holder, I need access to my account.
| Component | Format 1 | Format 2 | ATM example |
|---|---|---|---|
| WHO | As a <role> | as a <role> | a current bank account holder |
| WHAT | I need to <feature> | I need to <behavior> | access my account |
| WHY | so that <goal or value> | In order to <business value> | withdraw cash |
> Exam trap: format 2 **starts with the value** ("In order to…") and puts the role in the middle; format 1 ends with the value ("so that…"). Both carry the same three parts. Note also "**I need to**" on the slides, where many books write "I want to".
- The WHO can be **a persona** — this is where the two techniques of the lecture meet: personas give the "who", and their requirements "can be used to develop user stories".
## 2 Conversation
- **The intended purpose of User Stories is to communicate between stakeholders and the delivery team.**
- **The user story intentionally does not capture all there is to know about the customer need.**
- **A well-written user story invokes conversation among the team.**
> Key idea: the card is a promise of a conversation. Missing detail is not a defect of the story — it is what makes the team talk to the stakeholders.
## 3 Confirmation
- Business analysis practitioners **confirm the delivered item satisfies the need expressed in the user story**. This is **most often expressed as acceptance criteria**.
- Acceptance criteria **define the boundaries of a user story** and help **verify and validate** the solution met the intended user need.
- Acceptance criteria help the delivery team **identify the minimum amount of function necessary**.
- Acceptance criteria are **primarily used by the product owner and stakeholders to verify and validate**.
- They also serve as **a basis for acceptance tests, regression tests, exploratory tests, and other tests** to be developed in support of the product.
| Acceptance criteria… | Slide wording |
|---|---|
| define | the boundaries of a user story |
| help verify and validate | that the solution met the intended user need |
| help the delivery team identify | the minimum amount of function necessary |
| are primarily used by | the product owner and stakeholders (to verify and validate) |
| serve as a basis for | acceptance tests, regression tests, exploratory tests, and other tests |
ATM illustration (not from the slides) for "access my account": the account opens only with the correct PIN; after three wrong PINs the card is retained; the balance screen opens within 3 seconds. Each line can be checked objectively — which is also what the T in INVEST asks for.
## 5 User Story Management
There are a variety of ways in which user stories are used throughout an agile initiative. **The following techniques are all impacted by User Stories:**
| Technique | Where it is in Table 1 | Link to user stories |
|---|---|---|
| Backlog Refinement | Communications, internal | the stories on the backlog are refined and ordered |
| Product Roadmap | Product Management Refinement, internal | stories are grouped into the planned evolution of the product |
| Story Decomposition | Requirements Management, internal | big stories are split into smaller ones |
| Story Elaboration | Requirements Management, internal | details are added to a story |
| Visioning | Communications, internal and external | stories must serve the shared vision |
> Memory hook: **B-R-D-E-V** — Backlog Refinement, Roadmap, Decomposition, Elaboration, Visioning. Kano Analysis, Story Mapping, Personas and the rest are in Table 1 but **not** in this list of five.
## Usage Considerations — Strengths
- Tied to **small, implementable, and testable slices of functionality** facilitating **rapid delivery and frequent customer feedback**.
- **Easily understandable by stakeholders.**
- Can be developed through **a variety of elicitation techniques**, including but not limited to **facilitated workshops, contextual inquiry, and other ethnographic elicitation techniques**.
- User Stories are **simple enough that people can learn to write them in a few minutes**, being careful about **always delivering business value**.
- **The process of collaborating on defining and exploring stories builds team commitment and shared understanding of the business domain.**
- User Stories **invite conversation for further decomposition and exploration**.
- To facilitate estimating, planning, and delivery, many agile teams **supplement User Stories with analysis models** (such as **a data model, business rules, user acceptance tests, screen mock-ups or prototypes, context diagram, and state diagram**).
## Usage Considerations — Limitations
- This **conversational approach can challenge the team**, since they **do not have all the answers and detailed specifications upfront**.
- **Too many stories can inflate the backlog.**
- User Stories **spawn more User Stories through decomposition**, so the information **must be organized to ensure it is current and relevant**.
- The collection of User Stories **needs to be regularly refined and prioritized**.
- Teams can get **too focused on individual User Stories and lose sight of the vision and product roadmap**.
- This technique includes the desired feature. Teams can form habits **overlooking the value statement (WHY) and instead focus on the feature (WHAT)**.
| Strength | Its flip side (limitation) |
|---|---|
| short, invites conversation | no detailed specifications upfront — challenging for the team |
| small slices, rapid delivery | too many stories inflate the backlog; decomposition spawns more stories |
| focus on one story at a time | the team can lose sight of the vision and product roadmap |
| names the desired feature | the team can focus on WHAT and overlook WHY |
## Personas and user stories together
- A persona's requirements "can be used to develop user stories"; the WHO of a story can be "a user role or persona".
- Stories can be **prioritized by how well they address the needs of one or more personas** — this helps the product owner scope, coordinate, and prioritize the increments of user value.
- In Table 1 both techniques work well with **internal teams**: Personas in Understanding your Customer, User Stories in Requirements Management.
?? A story reads: "As a bank customer, I need a mobile app." Which part of the popular format is missing, and which limitation does it show?
?= The WHY — the benefit or business value. It shows the limitation that teams can overlook the value statement (WHY) and focus on the feature (WHAT).
?? Who primarily uses acceptance criteria, and for what?
?= The product owner and stakeholders, to verify and validate that the delivered item satisfies the need. Acceptance criteria also serve as a basis for acceptance, regression, exploratory and other tests.
?? Why is it fine that a user story does not contain every detail?
?= It intentionally does not capture all there is to know: its purpose is to communicate between stakeholders and the delivery team, and a well-written story invokes conversation.
## Exam focus
- Purpose: **convey a customer requirement for the delivery team**. Description: **a small, concise statement of a feature needed to deliver value**.
- Written by **customers, product owners, or business analysis practitioners**; **captured on the backlog**; the product owner uses them to **scope, coordinate, and prioritize increments of user value**.
- INVEST word for word: **Independent, Negotiable, Valuable, Estimable, Sized Appropriately, Testable**; ATM: PIN entry is independent from Withdrawal Amount (I); PIN entry lets only the correct person access the account (V).
- **Not all backlog items are to be written as user stories.**
- 3Cs: **Card, Conversation, Confirmation**. Title — an **active-verb goal phrase** (optional). Format — **WHO / WHAT / WHY**, with **no mandatory structure**.
- Acceptance criteria: **boundaries**, **minimum amount of function**, used **primarily by the product owner and stakeholders**, a basis for **acceptance, regression, exploratory and other tests**.
- Five techniques impacted by user stories: **Backlog Refinement, Product Roadmap, Story Decomposition, Story Elaboration, Visioning**.
- 7 strengths and 6 limitations; the most quoted limitation — **focus on WHAT, overlook WHY**.`,
    ru: `## Пользовательские истории — назначение и описание
> **Назначение (Purpose):** user stories нужны, чтобы **донести требование заказчика до команды разработки (convey a customer requirement for the delivery team)**.
> **Описание (Description):** user stories — **представление потребности заказчика (customer need)**, выраженное как **небольшое сжатое утверждение о функции, нужной, чтобы принести ценность (a small, concise statement of a feature needed to deliver value)**. User stories **облегчают взаимодействие и сотрудничество стейкхолдеров**.
- Пользовательская история **выражает потребность заказчика и желаемую ценность (value desired)**.
- Обычно это **одно или несколько предложений**, которые пишут **заказчики, владельцы продукта (product owners) или бизнес-аналитики (business analysis practitioners)**, — они описывают **что-то ценное для стейкхолдера**.
- User stories дают **владельцу продукта механизм, чтобы определять объём, координировать и приоритизировать инкременты пользовательской ценности к поставке (scope, coordinate, and prioritize)**.
- **Пользовательская история фиксируется в бэклоге (backlog).**
- User stories передают потребности стейкхолдеров **короткой простой документацией** и **приглашают исследовать требования через разговоры, тесты и дополнительные представления требований (supplemental requirements representations)** по мере надобности.
- Они **сжаты и легко меняются (concise and easy to change)**, когда потребности стейкхолдеров становятся понятнее или сами меняются.
| Вопрос | Ответ по слайдам |
|---|---|
| Зачем? | донести требование заказчика до команды разработки |
| Что это? | небольшое сжатое утверждение о функции, нужной, чтобы принести ценность |
| Кто пишет? | заказчики, владельцы продукта или бизнес-аналитики |
| Где живёт? | в бэклоге |
| Что даёт владельцу продукта? | механизм определять объём, координировать и приоритизировать инкременты пользовательской ценности |
| Откуда берутся детали? | из разговоров, тестов и дополнительных представлений требований |
> Ловушка экзамена: история намеренно **короткая и неполная** — «concise and easy to change». История, которая пытается быть полной спецификацией, теряет смысл; детали появляются позже — в разговоре и тестах.
## INVEST — критерии качества пользовательских историй
«Распространённая конструкция для **обеспечения качества user stories** — **критерии INVEST**: они требуют, чтобы истории были:»
| Буква | Критерий | Определение на слайде | Пример со слайда или иллюстрация |
|---|---|---|---|
| I | Independent (независимая) | описывает функцию, которую можно поставить независимо от других функций | слайд: «ATM PIN entry» (ввод PIN) не зависит от «Withdrawal Amount» (суммы снятия) |
| N | Negotiable (обсуждаемая) | команда может договориться, как поставить | иллюстрация: команда сама решает, как сделать ввод PIN |
| V | Valuable (ценная) | выражает ценность для клиента | слайд: «ввод PIN» даёт доступ к счёту только нужному человеку |
| E | Estimable (оцениваемая) | команда может оценить трудозатраты на поставку по прошлому опыту | иллюстрация: команда уже делала экраны PIN и может оценить этот |
| S | Sized Appropriately (подходящего размера) | чтобы команда успела за одну итерацию; в целом чем меньше, тем лучше | иллюстрация: «ввод PIN» укладывается в итерацию, «весь банкомат» — нет |
| T | Testable (проверяемая) | стейкхолдер может объективно проверить (validated objectively) | иллюстрация: «после трёх неверных PIN карта блокируется» — можно проверить |
@diagram pm8-invest
> Ловушка экзамена: на этих слайдах **S = «Sized Appropriately»**, а не «Small» (как во многих других источниках). Смысл тот же — успеть за одну итерацию, чем меньше, тем лучше, — но если вопрос цитирует слайд, выбирайте **Sized Appropriately**.
> Ловушка экзамена: **E — Estimable**: команда *может* оценить трудозатраты по прошлому опыту (а не «Estimated» — уже оценена); **T — Testable**: **объективно проверяется стейкхолдером** (а не «одобрена разработчиками»); **N** — команда может договориться о том, **как поставить** (а не клиент торгуется о цене).
- **Не все элементы бэклога (backlog items) нужно записывать как user stories.** Но user stories — распространённая техника, **потому что они подчёркивают ценность для клиента**.
| Слова-подсказки в вопросе | Буква INVEST |
|---|---|
| «можно поставить, не дожидаясь другой функции» | I — Independent |
| «команда решает, как реализовать» | N — Negotiable |
| «что получает клиент» | V — Valuable |
| «команда может оценить по прошлому опыту» | E — Estimable |
| «укладывается в одну итерацию» | S — Sized Appropriately |
| «стейкхолдер может объективно проверить» | T — Testable |
> Запомнить: **I** — сама по себе, **N** — «как» не зафиксировано, **V** — ценность для клиента, **E** — оценка по опыту, **S** — по размеру на одну итерацию, **T** — проверка объективна.
## Элементы — три C (3Cs)
User stories следуют правилу **трёх C: Card (карточка), Conversation (разговор) и Confirmation (подтверждение)**.
@diagram pm8-three-cs
| C | Что это | Ключевая фраза слайда |
|---|---|---|
| Card | записанная история: необязательный заголовок и формат WHO / WHAT / WHY | «an active-verb goal phrase» |
| Conversation | обсуждение между стейкхолдерами и командой разработки | «intentionally does not capture all there is to know» |
| Confirmation | подтверждение, что поставленное удовлетворяет потребность | «most often expressed as acceptance criteria» |
> Ловушка экзамена: на слайдах элементы пронумерованы неровно — «1 Card», «2 Format», «2 Conversation», «3 Confirmation», «5 User Story Management» (пункта 4 нет). Заголовок и формат — части **Card**; три C — это по-прежнему ровно Card, Conversation и Confirmation.
## 1 Card — заголовок (Title, необязателен)
- Заголовок пользовательской истории **описывает действие, которое пользователь хочет выполнить с помощью решения**.
- Обычно это **фраза-цель с активным глаголом (active-verb goal phrase), как в названиях вариантов использования (use cases)** — например, «Снять наличные», «Сбросить пароль», «Забронировать аудиторию».
- Заголовок **необязателен (optional)**.
## Card — формат (Format)
**Обязательной структуры у user stories нет (no mandatory structure)**; но самый популярный формат включает три компонента:
- **роль пользователя или персону [WHO — кто]**,
- **нужное действие, поведение или функцию [WHAT — что]**, и
- **пользу или бизнес-ценность, которую пользователь получит, когда история будет реализована [WHY — зачем]**.
**Пример формата 1:**
= As a <role>, I need to <feature> so that <goal or value>.
= As a current bank account holder, I need to access my account, so that I can withdraw cash.
**Пример формата 2:**
= In order to <business value>, as a <role>, I need to <behavior>.
= In order to withdraw cash from my account, as a current bank account holder, I need access to my account.
| Компонент | Формат 1 | Формат 2 | Пример с банкоматом |
|---|---|---|---|
| WHO | As a <role> | as a <role> | действующий владелец банковского счёта |
| WHAT | I need to <feature> | I need to <behavior> | получить доступ к своему счёту |
| WHY | so that <goal or value> | In order to <business value> | снять наличные |
> Ловушка экзамена: формат 2 **начинается с ценности** («In order to…»), а роль стоит в середине; формат 1 заканчивается ценностью («so that…»). Части у обоих одни и те же. И обратите внимание: на слайдах «**I need to**», хотя во многих книгах пишут «I want to».
- WHO может быть **персоной** — здесь встречаются две техники лекции: персоны дают «кто», а их требования «можно использовать для разработки user stories».
## 2 Conversation (разговор)
- **Задуманное назначение user stories — коммуникация между стейкхолдерами и командой разработки.**
- **Пользовательская история намеренно не фиксирует всё, что можно знать о потребности заказчика.**
- **Хорошо написанная история вызывает разговор (invokes conversation) в команде.**
> Главная мысль: карточка — обещание разговора. Недостающие детали — не дефект истории, а то, что заставляет команду поговорить со стейкхолдерами.
## 3 Confirmation (подтверждение)
- Бизнес-аналитики **подтверждают, что поставленный элемент удовлетворяет потребность, выраженную в истории**. Чаще всего это **выражают как критерии приёмки (acceptance criteria)**.
- Критерии приёмки **задают границы истории (boundaries of a user story)** и помогают **верифицировать и валидировать (verify and validate)**, что решение отвечает задуманной потребности пользователя.
- Критерии приёмки помогают команде разработки **определить минимально необходимый объём функций (minimum amount of function necessary)**.
- Критерии приёмки **в первую очередь используют владелец продукта и стейкхолдеры — для верификации и валидации**.
- Они также служат **основой для приёмочных, регрессионных, исследовательских и других тестов (acceptance, regression, exploratory tests)**, которые разрабатываются для продукта.
| Критерии приёмки… | Формулировка слайда |
|---|---|
| задают | границы пользовательской истории |
| помогают верифицировать и валидировать | что решение отвечает задуманной потребности пользователя |
| помогают команде определить | минимально необходимый объём функций |
| в первую очередь используются | владельцем продукта и стейкхолдерами (для верификации и валидации) |
| служат основой для | приёмочных, регрессионных, исследовательских и других тестов |
Иллюстрация с банкоматом (не со слайдов) для «доступ к счёту»: счёт открывается только с верным PIN; после трёх неверных PIN карта задерживается; экран баланса открывается не дольше 3 секунд. Каждую строку можно проверить объективно — этого же требует T в INVEST.
## 5 Управление пользовательскими историями (User Story Management)
User stories используются в agile-инициативе по-разному. **Все следующие техники зависят от user stories (impacted by User Stories):**
| Техника | Где в таблице 1 | Связь с историями |
|---|---|---|
| Backlog Refinement (уточнение бэклога) | Communications, внутр. | истории в бэклоге уточняют и упорядочивают |
| Product Roadmap (дорожная карта продукта) | Product Management Refinement, внутр. | истории группируют в запланированное развитие продукта |
| Story Decomposition (декомпозиция историй) | Requirements Management, внутр. | большие истории разбивают на меньшие |
| Story Elaboration (проработка историй) | Requirements Management, внутр. | к истории добавляют детали |
| Visioning (формирование видения) | Communications, внутр. и внешн. | истории должны служить общему видению |
> Запомнить: **B-R-D-E-V** — Backlog Refinement, Roadmap, Decomposition, Elaboration, Visioning. Kano Analysis, Story Mapping, Personas и прочие есть в таблице 1, но **не** в этом списке из пяти.
## Особенности применения — сильные стороны (Strengths)
- Привязаны к **небольшим, реализуемым и проверяемым срезам функциональности (slices of functionality)**, что помогает **быстрой поставке и частой обратной связи от клиента**.
- **Легко понятны стейкхолдерам.**
- Их можно получать **разными техниками выявления требований (elicitation techniques)**, в том числе **фасилитированными воркшопами, контекстным исследованием (contextual inquiry) и другими этнографическими техниками**.
- User stories **настолько просты, что писать их можно научиться за несколько минут**, следя за тем, чтобы **всегда приносить бизнес-ценность**.
- **Совместная работа над определением и исследованием историй формирует вовлечённость команды (team commitment) и общее понимание предметной области бизнеса.**
- User stories **приглашают к разговору для дальнейшей декомпозиции и исследования**.
- Чтобы облегчить оценку, планирование и поставку, многие agile-команды **дополняют user stories аналитическими моделями (analysis models)** — **моделью данных, бизнес-правилами, пользовательскими приёмочными тестами, макетами экранов или прототипами, контекстной диаграммой и диаграммой состояний**.
## Особенности применения — ограничения (Limitations)
- Такой **разговорный подход может быть трудным для команды**: у неё **нет заранее всех ответов и детальных спецификаций (upfront)**.
- **Слишком много историй может раздуть бэклог (inflate the backlog).**
- User stories **порождают новые истории через декомпозицию**, поэтому информацию **нужно упорядочивать, чтобы она оставалась актуальной и уместной (current and relevant)**.
- Набор user stories **нужно регулярно уточнять и приоритизировать (refined and prioritized)**.
- Команда может **слишком сосредоточиться на отдельных историях и потерять из виду видение и дорожную карту продукта (vision and product roadmap)**.
- Техника включает желаемую функцию. У команды может появиться привычка **упускать утверждение о ценности (WHY) и сосредотачиваться на функции (WHAT)**.
| Сильная сторона | Обратная сторона (ограничение) |
|---|---|
| коротко, приглашает к разговору | нет детальных спецификаций заранее — команде трудно |
| маленькие срезы, быстрая поставка | слишком много историй раздувают бэклог; декомпозиция порождает новые |
| фокус на одной истории за раз | команда может потерять из виду видение и дорожную карту |
| называет желаемую функцию | команда может сосредоточиться на WHAT и упустить WHY |
## Персоны и пользовательские истории вместе
- Требования персоны «можно использовать для разработки user stories»; WHO в истории может быть «ролью пользователя или персоной».
- Истории можно **приоритизировать по тому, насколько они закрывают потребности одной или нескольких персон**, — это помогает владельцу продукта определять объём, координировать и приоритизировать инкременты пользовательской ценности.
- В таблице 1 обе техники хорошо работают с **внутренними командами**: Personas — в Understanding your Customer, User Stories — в Requirements Management.
?? История: «As a bank customer, I need a mobile app». Какой части популярного формата не хватает и какое ограничение это показывает?
?= Не хватает WHY — пользы или бизнес-ценности. Это ограничение «команда упускает утверждение о ценности (WHY) и сосредотачивается на функции (WHAT)».
?? Кто в первую очередь использует критерии приёмки и для чего?
?= Владелец продукта и стейкхолдеры — чтобы верифицировать и валидировать, что поставленное удовлетворяет потребность. Ещё критерии приёмки служат основой для приёмочных, регрессионных, исследовательских и других тестов.
?? Почему нормально, что в пользовательской истории нет всех деталей?
?= Она намеренно не фиксирует всё, что можно знать: её назначение — коммуникация между стейкхолдерами и командой разработки, а хорошо написанная история вызывает разговор.
## Что спросят на экзамене (Exam focus)
- Назначение: **донести требование заказчика до команды разработки**. Описание: **небольшое сжатое утверждение о функции, нужной, чтобы принести ценность**.
- Пишут **заказчики, владельцы продукта или бизнес-аналитики**; **фиксируется в бэклоге**; владелец продукта через истории **определяет объём, координирует и приоритизирует инкременты пользовательской ценности**.
- INVEST дословно: **Independent, Negotiable, Valuable, Estimable, Sized Appropriately, Testable**; банкомат: ввод PIN не зависит от суммы снятия (I); ввод PIN даёт доступ к счёту только нужному человеку (V).
- **Не все элементы бэклога нужно записывать как user stories.**
- Три C: **Card, Conversation, Confirmation**. Заголовок — **фраза-цель с активным глаголом** (необязателен). Формат — **WHO / WHAT / WHY**, **обязательной структуры нет**.
- Критерии приёмки: **границы**, **минимально необходимый объём функций**, используют **в первую очередь владелец продукта и стейкхолдеры**, основа для **приёмочных, регрессионных, исследовательских и других тестов**.
- Пять техник, зависящих от user stories: **Backlog Refinement, Product Roadmap, Story Decomposition, Story Elaboration, Visioning**.
- 7 сильных сторон и 6 ограничений; самое цитируемое ограничение — **фокус на WHAT, упущенное WHY**.`,
  },
  [
    qx("According to the slides, what is the purpose of user stories?", "To convey a customer requirement for the delivery team", [
      ["To record the project budget baseline for the sponsor", "Budget baselines belong to cost management; user stories carry customer requirements to the team.", "Базовый план бюджета — это управление стоимостью; user stories несут команде требования заказчика."],
      ["To describe the system architecture for the developers", "Architecture is a technical design concern; a story states a customer need and its value, not the design.", "Архитектура — вопрос технического проектирования; история говорит о потребности заказчика и ценности, а не о дизайне."],
      ["To replace acceptance testing with team conversations", "Conversation complements Confirmation rather than replacing it: acceptance criteria are the basis for acceptance tests.", "Разговор дополняет Confirmation, а не заменяет его: критерии приёмки — основа приёмочных тестов."],
    ], "Purpose (slide): User Stories are used to convey a customer requirement for the delivery team.", "Назначение (слайд): user stories нужны, чтобы донести требование заказчика до команды разработки."),
    qx("How does the slide describe a user story?", "A small, concise statement of a feature needed to deliver value", [
      ["A complete specification of a feature and its technical design", "The slides stress the opposite: short, simple documentation that intentionally does not capture everything.", "Слайды подчёркивают обратное: короткая простая документация, которая намеренно не фиксирует всё."],
      ["A technical task describing how developers will write the code", "A story describes something of value to a stakeholder; how to build it is left to the team (Negotiable).", "История описывает что-то ценное для стейкхолдера; как это сделать — решает команда (Negotiable)."],
      ["A detailed use case with a main flow and alternative flows", "Only the title is compared to use cases (an active-verb goal phrase); the story itself is short.", "С use cases сравнивается только заголовок (фраза-цель с активным глаголом); сама история короткая."],
    ], "Description (slide): User Stories are a representation of the customer need, expressed as a small, concise statement of a feature needed to deliver value.", "Описание (слайд): user stories — представление потребности заказчика в виде небольшого сжатого утверждения о функции, нужной для ценности."),
    qx("According to the slides, who typically writes user stories?", "Customers, product owners, or business analysis practitioners", [
      ["Only the developers, after they have estimated the effort of the work", "Developers estimate and discuss stories, but the slide names customers, product owners and BA practitioners as the writers.", "Разработчики оценивают и обсуждают истории, но авторами слайд называет заказчиков, владельцев продукта и бизнес-аналитиков."],
      ["The project sponsor together with the project management office", "Neither the sponsor nor the PMO is mentioned as an author of user stories.", "Ни спонсор, ни офис управления проектами не названы авторами историй."],
      ["Testers, once the acceptance tests have been written", "Acceptance criteria are a basis for tests, not the other way round; testers are not named as writers.", "Критерии приёмки — основа тестов, а не наоборот; тестировщики авторами не названы."],
    ], "Slide: user stories are typically one or more sentences written by the customers, product owners, or business analysis practitioners which describe something of value to a stakeholder.", "Слайд: обычно это одно или несколько предложений, которые пишут заказчики, владельцы продукта или бизнес-аналитики, описывая что-то ценное для стейкхолдера."),
    qx("What do user stories provide for the product owner, according to the slides?", "A way to scope, coordinate, and prioritize increments of user value", [
      ["A way to assign tasks to individual developers and track their hours", "Stories are about user value, not about assigning tasks or tracking hours.", "Истории — о пользовательской ценности, а не о раздаче задач и учёте часов."],
      ["A tool to approve the budget and the schedule baseline of the project", "Budget and schedule baselines are not mentioned; the slide speaks of increments of user value.", "Базовые планы бюджета и сроков не упоминаются; слайд говорит об инкрементах пользовательской ценности."],
      ["A method to measure the velocity of each member of the delivery team", "Velocity, and per-person measurement in particular, is not what the slide attributes to stories.", "Скорость, тем более по каждому человеку, слайд историям не приписывает."],
    ], "Slide: User Stories provide a mechanism for the product owner to scope, coordinate, and prioritize the increments of user value for delivery. A user story is captured on the backlog.", "Слайд: user stories дают владельцу продукта механизм определять объём, координировать и приоритизировать инкременты пользовательской ценности к поставке. История фиксируется в бэклоге."),
    qx("In the INVEST criteria as given on the slides, what does the letter S stand for?", "Sized Appropriately", [
      ["Small", "Many other sources use \"Small\", but the slide (Agile Extension to the BABOK Guide) says \"Sized Appropriately\" — for the team to complete in one iteration.", "Во многих других источниках — «Small», но на слайде (Agile Extension to the BABOK Guide) — «Sized Appropriately»: команда успевает за одну итерацию."],
      ["Specific", "\"Specific\" is the S of SMART objectives, not of INVEST.", "«Specific» — это S из SMART-целей, а не из INVEST."],
      ["Sequenced by priority", "Sequencing stories would clash with I — Independent; it is not an INVEST criterion.", "Упорядоченность историй противоречит I — Independent; это не критерий INVEST."],
    ], "Slide: (S) Sized Appropriately — for the team to complete in one iteration. In general, the smaller the better.", "Слайд: (S) Sized Appropriately — чтобы команда успела за одну итерацию. В целом чем меньше, тем лучше."),
    qx("The slide says \"ATM PIN entry\" is independent from \"Withdrawal Amount\". Which INVEST criterion does this example illustrate?", "Independent", [
      ["Negotiable", "Negotiable means the team can negotiate how to deliver; the example is about delivering one feature without the other.", "Negotiable — команда может договориться, как поставить; пример же о поставке одной функции без другой."],
      ["Valuable", "The Valuable example on the slide is that PIN entry allows only the correct person to access the account.", "Пример для Valuable на слайде — ввод PIN даёт доступ к счёту только нужному человеку."],
      ["Sized Appropriately", "Sized Appropriately is about completing the story within one iteration.", "Sized Appropriately — о том, чтобы успеть историю за одну итерацию."],
    ], "Slide: (I) Independent — represents a feature which can be delivered independent of other features. Example: \"ATM PIN entry\" is independent from \"Withdrawal Amount\".", "Слайд: (I) Independent — функция, которую можно поставить независимо от других. Пример: «ввод PIN» не зависит от «суммы снятия»."),
    qx("What does \"Negotiable\" mean in INVEST, according to the slides?", "The team can negotiate how to deliver the story", [
      ["The customer can negotiate the price of each story", "Price is not part of INVEST; Negotiable is about how the story is delivered.", "Цена не входит в INVEST; Negotiable — о том, как поставить историю."],
      ["The product owner can drop the value statement later", "The value (WHY) should stay; overlooking it is a listed limitation, not what Negotiable means.", "Ценность (WHY) должна оставаться; её упускание — названное ограничение, а не смысл Negotiable."],
      ["The iteration length is agreed anew for every story", "Iteration length is not negotiated per story; Sized Appropriately assumes a story fits one iteration.", "Длину итерации не обсуждают под каждую историю; Sized Appropriately предполагает, что история влезает в итерацию."],
    ], "Slide: (N) Negotiable — the team can negotiate how to deliver.", "Слайд: (N) Negotiable — команда может договориться, как поставить."),
    qx("Which definition of \"Estimable\" matches the slide?", "The team can estimate effort to deliver based on past experience", [
      ["The product owner writes a fixed estimate on every story card", "Estimates come from the team, and the criterion is that the team can estimate, not that an estimate is fixed in advance.", "Оценку даёт команда, и критерий в том, что команда может оценить, а не что оценка заранее зафиксирована."],
      ["The sponsor sets a fixed delivery date for each story before planning", "A date set by the sponsor is a schedule constraint, not an estimate of effort.", "Дата от спонсора — ограничение по срокам, а не оценка трудозатрат."],
      ["Effort is measured only after the story has been delivered", "Measuring after delivery is tracking actuals; Estimable is about estimating before delivery.", "Замер после поставки — учёт факта; Estimable — об оценке до поставки."],
    ], "Slide: (E) Estimable — team can estimate effort to deliver based on past experience.", "Слайд: (E) Estimable — команда может оценить трудозатраты на поставку по прошлому опыту."),
    qx("According to the slides, when is a user story \"Testable\"?", "When it can be validated objectively by a stakeholder", [
      ["When developers wrote unit tests before coding it", "Unit tests are a development practice; the slide asks for objective validation by a stakeholder.", "Модульные тесты — практика разработки; слайд требует объективной проверки стейкхолдером."],
      ["When the team subjectively agrees that it looks finished", "\"Subjectively\" is the opposite of the slide's \"objectively\".", "«Субъективно» — прямая противоположность «объективно» на слайде."],
      ["When it can be tested only after the full product release", "Stories are small slices tested within the iteration, not only after the whole release.", "Истории — маленькие срезы, их проверяют в итерации, а не только после всего релиза."],
    ], "Slide: (T) Testable — can be validated objectively by a stakeholder.", "Слайд: (T) Testable — стейкхолдер может объективно проверить."),
    qx("\"ATM PIN entry allows only the correct person to access the account.\" Which INVEST criterion does the slide illustrate with this sentence?", "Valuable", [
      ["Independent", "The Independent example is PIN entry being independent from Withdrawal Amount.", "Пример для Independent — ввод PIN не зависит от суммы снятия."],
      ["Testable", "Testable means validated objectively by a stakeholder; this sentence states the value to the customer.", "Testable — объективная проверка стейкхолдером; это предложение говорит о ценности для клиента."],
      ["Estimable", "Estimable is about the team estimating effort from past experience.", "Estimable — об оценке трудозатрат командой по прошлому опыту."],
    ], "Slide: (V) Valuable — expresses the value to the customer. Example: \"ATM PIN entry\" allows only the correct person to access the account.", "Слайд: (V) Valuable — выражает ценность для клиента. Пример: «ввод PIN» даёт доступ к счёту только нужному человеку."),
    tfx("According to the slides, all backlog items are to be written as user stories.", false,
      "Slide: \"Not all backlog items are to be written as user stories. However, User Stories is a common technique used as they emphasize the customer value.\"",
      "Слайд: «Не все элементы бэклога нужно записывать как user stories. Но это распространённая техника, потому что истории подчёркивают ценность для клиента».",
      "\"True\" ignores the slide's explicit statement; purely technical items, for example, need not be written as stories.",
      "«Верно» игнорирует прямое утверждение слайда: например, чисто технические элементы не обязаны быть историями."),
    qx("Which of the following is NOT one of the 3Cs of user stories?", "Commitment", [
      ["Card", "Card is the first C: the written story with an optional title and the WHO / WHAT / WHY format.", "Card — первая C: записанная история с необязательным заголовком и форматом WHO / WHAT / WHY."],
      ["Conversation", "Conversation is the second C: a well-written story invokes conversation among the team.", "Conversation — вторая C: хорошая история вызывает разговор в команде."],
      ["Confirmation", "Confirmation is the third C: acceptance criteria confirm that the delivered item satisfies the need.", "Confirmation — третья C: критерии приёмки подтверждают, что поставленное удовлетворяет потребность."],
    ], "The 3Cs are Card, Conversation, and Confirmation. Commitment appears on the slides only as a result of collaborating on stories (\"builds team commitment\"), not as one of the Cs.", "Три C — Card, Conversation и Confirmation. Commitment на слайдах есть лишь как результат совместной работы над историями («формирует вовлечённость команды»), а не как одна из C."),
    qx("What does the slide say the (optional) title of a user story typically is?", "An active-verb goal phrase, similar to use case titles", [
      ["A noun naming the system module, similar to a menu item", "A module name says where the function lives, not what the user wants to do; the slide asks for an activity.", "Название модуля говорит, где живёт функция, а не что хочет сделать пользователь; слайд требует действия."],
      ["The ticket number assigned by the backlog tool", "An ID identifies the item but describes no activity.", "Номер идентифицирует элемент, но не описывает действия."],
      ["The name of the developer who will implement it", "The title describes the user's activity, not who builds it.", "Заголовок описывает действие пользователя, а не того, кто его реализует."],
    ], "Slide: the title describes an activity that the user wants to carry out with the solution; typically it is an active-verb goal phrase, similar to the way use cases are titled. The title is optional.", "Слайд: заголовок описывает действие, которое пользователь хочет выполнить с решением; обычно это фраза-цель с активным глаголом, как в названиях use cases. Заголовок необязателен."),
    qx("In the most popular user story format, what does the WHY component contain?", "The benefit or business value received by the user", [
      ["The user role or persona who needs the new feature", "That is the WHO component.", "Это компонент WHO."],
      ["The necessary action, behavior, or feature itself", "That is the WHAT component.", "Это компонент WHAT."],
      ["The acceptance criteria that confirm the story", "Acceptance criteria are the Confirmation C, not part of the WHO / WHAT / WHY format.", "Критерии приёмки — это C «Confirmation», а не часть формата WHO / WHAT / WHY."],
    ], "Slide: WHO — a user role or persona; WHAT — a necessary action, behavior, or feature; WHY — the benefit or business value received by the user when the story is implemented.", "Слайд: WHO — роль пользователя или персона; WHAT — нужное действие, поведение или функция; WHY — польза или бизнес-ценность, которую пользователь получит после реализации."),
    qx("Which template matches \"Example format 2\" on the slides?", "In order to <business value>, as a <role>, I need to <behavior>.", [
      ["As a <role>, I need to <feature> so that <goal or value>.", "This is Example format 1: it ends with the value instead of starting with it.", "Это пример формата 1: он заканчивается ценностью, а не начинается с неё."],
      ["Given <context>, when <event>, then <expected outcome>.", "This is the Given / When / Then style of Behaviour Driven Development, not a story format from the slides.", "Это стиль Given / When / Then из Behaviour Driven Development, а не формат истории со слайдов."],
      ["When <situation>, I want to <motivation>, so I can <expected outcome>.", "This is the Job Stories style — a different technique listed in Table 1.", "Это стиль Job Stories — другая техника из таблицы 1."],
    ], "Slide, Example format 2: \"In order to <business value>, as a <role>, I need to <behavior>.\" — In order to withdraw cash from my account, as a current bank account holder, I need access to my account.", "Слайд, пример формата 2: «In order to <business value>, as a <role>, I need to <behavior>» — In order to withdraw cash from my account, as a current bank account holder, I need access to my account."),
    tfx("A well-written user story captures all there is to know about the customer need.", false,
      "Slide: the user story intentionally does not capture all there is to know about the customer need; a well-written user story invokes conversation among the team.",
      "Слайд: история намеренно не фиксирует всё, что можно знать о потребности заказчика; хорошо написанная история вызывает разговор в команде.",
      "\"True\" turns a story into a full specification — the opposite of the Conversation C.",
      "«Верно» превращает историю в полную спецификацию — прямую противоположность C «Conversation»."),
    qx("According to the slides, what do acceptance criteria define?", "The boundaries of a user story", [
      ["The backlog order of stories", "Ordering comes from refinement and prioritization of the backlog, not from acceptance criteria.", "Порядок задают уточнение и приоритизация бэклога, а не критерии приёмки."],
      ["The team's velocity for the iteration", "Velocity is a planning measure; acceptance criteria describe what the story must do.", "Скорость — мера планирования; критерии приёмки описывают, что должна делать история."],
      ["The technical design of the feature", "Design is how the team delivers (Negotiable); criteria describe the expected result.", "Дизайн — это как команда поставляет (Negotiable); критерии описывают ожидаемый результат."],
    ], "Slide: acceptance criteria define the boundaries of a user story and help verify and validate the solution met the intended user need; they help identify the minimum amount of function necessary.", "Слайд: критерии приёмки задают границы истории и помогают верифицировать и валидировать, что решение отвечает потребности; они помогают определить минимально необходимый объём функций."),
    qx("According to the slides, who primarily uses acceptance criteria to verify and validate?", "The product owner and the stakeholders", [
      ["The developers, to estimate story points", "Developers use criteria to understand the minimum function, but the slide says the primary users are the product owner and stakeholders.", "Разработчикам критерии помогают понять минимум функций, но основные пользователи по слайду — владелец продукта и стейкхолдеры."],
      ["The Scrum Master, to spot impediments", "The Scrum Master is not mentioned on these slides at all.", "Scrum Master на этих слайдах вообще не упоминается."],
      ["The project sponsor, to approve budgets", "Budget approval has nothing to do with acceptance criteria.", "Утверждение бюджета не связано с критериями приёмки."],
    ], "Slide: acceptance criteria are primarily used by the product owner and stakeholders to verify and validate. They also serve as a basis for acceptance, regression, exploratory and other tests.", "Слайд: критерии приёмки в первую очередь используют владелец продукта и стейкхолдеры для верификации и валидации. Ещё они — основа приёмочных, регрессионных, исследовательских и других тестов."),
    qx("Which technique is NOT among the five that the slides say are impacted by user stories (User Story Management)?", "Kano Analysis", [
      ["Backlog Refinement", "Listed: Backlog Refinement, Product Roadmap, Story Decomposition, Story Elaboration, Visioning.", "В списке: Backlog Refinement, Product Roadmap, Story Decomposition, Story Elaboration, Visioning."],
      ["Story Elaboration", "Listed among the five techniques impacted by user stories.", "Входит в пятёрку техник, зависящих от user stories."],
      ["Visioning", "Listed — the last of the five.", "В списке — последняя из пяти."],
    ], "User Story Management (slide): Backlog Refinement, Product Roadmap, Story Decomposition, Story Elaboration, and Visioning are all impacted by User Stories. Kano Analysis is in Table 1 but not in this list.", "User Story Management (слайд): от user stories зависят Backlog Refinement, Product Roadmap, Story Decomposition, Story Elaboration и Visioning. Kano Analysis есть в таблице 1, но не в этом списке."),
    qx("Which of these is listed on the slides as a limitation of user stories?", "Teams can overlook the value (WHY) and focus on the feature (WHAT)", [
      ["Stakeholders find user stories hard to understand without training", "Reversed: a strength is that user stories are easily understandable by stakeholders.", "Наоборот: сильная сторона — истории легко понятны стейкхолдерам."],
      ["People need several weeks of practice before they can write one", "Reversed: stories are simple enough that people can learn to write them in a few minutes.", "Наоборот: истории настолько просты, что писать их учатся за несколько минут."],
      ["They cannot be supplemented with data models or screen mock-ups", "Reversed: many teams supplement stories with analysis models — data model, business rules, mock-ups, context and state diagrams.", "Наоборот: многие команды дополняют истории аналитическими моделями — моделью данных, бизнес-правилами, макетами, контекстной диаграммой и диаграммой состояний."],
    ], "Limitation (slide): this technique includes the desired feature; teams can form habits overlooking the value statement (WHY) and instead focus on the feature (WHAT).", "Ограничение (слайд): техника включает желаемую функцию; у команды может появиться привычка упускать утверждение о ценности (WHY) и сосредотачиваться на функции (WHAT)."),
  ],
);

const p3 = part(
  "pm-l8-p3",
  { en: "Workshop: personas and user stories in practice", ru: "Практикум: персоны и пользовательские истории в деле" },
  {
    en: `## The case: RoomBook
A university IT team builds **RoomBook**, an app where students and lecturers find and book free auditoriums, labs and meeting rooms. Today rooms are booked by asking the dean's office in person, and double bookings happen every week. The dean's office is the external customer; the team can interview a few students and lecturers, but has no customer representative inside the team. This part applies the lecture to the case step by step — no new theory, only the slide concepts in action.
| Step | Lecture concept used |
|---|---|
| 1. Choose techniques | Table 1 — Selecting the Right Technique |
| 2. Describe the users | Personas — short and long template, elements, ranking |
| 3. Write and check stories | User Stories — WHO / WHAT / WHY and INVEST |
| 4. Card, Conversation, Confirmation | the 3Cs and acceptance criteria |
| 5. Split a big story | Story Decomposition (User Story Management) |
| 6. Watch the limitations | limitations of personas and user stories |
## Step 1 — choosing techniques with Table 1
Start from the goal, find its **context** row, then pick the **column**: is the work mainly with the internal team or with stakeholders external to the team?
| RoomBook goal | Context in Table 1 | Internal team | External stakeholders |
|---|---|---|---|
| understand who will use the app and why | Understanding your Customer | Personas, Storyboarding, Value Modelling | — |
| write and manage the requirements | Requirements Management | User Stories, Story Decomposition, Story Elaboration, Story Mapping, BDD, Job Stories, Relative Estimation, Spikes | — |
| show each increment to the dean's office and collect feedback | Communications | — | Reviews |
| agree a shared vision with the dean's office | Communications | Visioning | Visioning |
| decide what goes into the first release | Product Management Refinement | Minimal Viable Product, Product Roadmap, Purpose Alignment Model, Real Options | Kano Analysis, Minimal Viable Product |
| see where the current paper process loses time | Process Analysis | Value Stream Mapping | Impact Mapping |
| improve the team's own way of working | Communications | Retrospectives | — |
> Remember: Table 1 is only **a starting point**. The final choice comes from the team's domain knowledge, experience, individual competencies and creativity — here, for example, Personas and User Stories are used together, because persona requirements "can be used to develop user stories".
## Step 2 — two personas on the short template
The team has interviewed a few students and lecturers and has timetable data, so it starts from real facts and fills the **Short Persona Template** (Figure 1).
| Field of the short template | Persona A | Persona B |
|---|---|---|
| Name + picture | Dana (fictional photo) | Serik Akhmetov (fictional photo) |
| Details or Context — tasks and responsibilities | 3rd-year Software Engineering student; organises team-project meetings | senior lecturer; schedules make-up classes and consultations |
| Details or Context — technology | smartphone only; lives in Telegram | laptop and email; rarely installs apps |
| Traits and characteristics — age, occupation, location | 20; student; campus dormitory | 47; lecturer; teaches in two buildings |
| Goals | find a free room in under a minute; book it for the whole team; get a reminder | book a room with a projector for 30 students; move a booking easily; get a confirmation by email |
Expanding to the long template (Figure 2) needs **additional user research**. After more interviews the team adds:
| Long template field | Dana | Serik Akhmetov |
|---|---|---|
| Buying motive (here: why start using RoomBook) | stop walking between buildings looking for an empty room | stop phoning the dean's office for every make-up class |
| Traits | books late in the evening, decides fast | plans a week ahead, careful |
| Needs | trust: a confirmed room will not be taken by someone else | safety of the schedule: his group is never double-booked |
| Motivation | save time between classes | never bring 30 students to an occupied room |
| Differentiators | generational: grew up with smartphones, never reads email | experiential: 20 years of the old paper process; preference: email over messengers |
**Ranking.** Personas are ranked to identify those that will realize the most benefit from the solution design. A double booking for a lecturer affects a whole group, so the team ranks **Serik first** and plans the first stories for him.
> Avoid the "everything to everyone" trap: the team does **not** merge Dana and Serik into one "University User, 18–65". Their differentiators (smartphone vs email, evening vs a week ahead) lead to different stories.
**Which element is it?** A quick self-test on the case:
| Statement about a persona | Element |
|---|---|
| "Dana is 20 and lives in the campus dormitory" | traits and characteristics |
| "Dana wants to save time between classes" | motivation |
| "Dana needs to trust that a confirmed room will not be taken by someone else" | need |
| "Unlike Serik, Dana grew up with smartphones and never reads email" | differentiator (generational or experiential) |
| "Serik prefers email to messengers" | differentiator (preference) |
| "Book a room with a projector for 30 students" | goal (a field of the short template) |
## Step 3 — eight draft stories and an INVEST review
The product owner and a business analysis practitioner write first drafts on the backlog. Then the team checks each draft against INVEST.
| # | Draft | Problem | INVEST letter |
|---|---|---|---|
| S1 | As a student, I need to see which rooms are free in the next hour, so that I can book one for my team quickly. | none — small, valuable, testable | — |
| S2 | As a user, I need a booking screen, so that there is a booking screen. | the WHY repeats the WHAT; no value to anyone | V — Valuable |
| S3 | As a student, I need to book a room; this can be built only after the admin approval story is finished. | tied to another story | I — Independent |
| S4 | As a lecturer, I need a full university scheduling system for rooms, timetables, exams and equipment, so that everything is in one place. | far too big for one iteration | S — Sized Appropriately |
| S5 | As a lecturer, I need booking to be fast and convenient, so that I do not waste time. | "fast and convenient" cannot be validated objectively | T — Testable |
| S6 | As a lecturer, I need to book Room 305 through a React modal that calls a PostgreSQL stored procedure, so that I can run a make-up class. | prescribes how the team must build it | N — Negotiable |
| S7 | As a student, I need to open the room with the new face-recognition door system, so that I do not need a key. | nobody on the team has worked with that system, so effort cannot be estimated | E — Estimable |
| S8 | Rotate the JWT refresh tokens every 24 hours. | a technical item, not a user story — and that is allowed | — (not all backlog items are user stories) |
**Fixes:**
- **S2 (V)** → "As a student, I need to book a free room for a chosen hour, so that my team has a guaranteed place to meet."
- **S3 (I)** → drop the dependency: "As a student, I need to book a free room, so that my team can meet there"; approval, if really needed, becomes its own story.
- **S4 (S)** → split it into smaller stories (Step 5).
- **S5 (T)** → "As a lecturer, I need to see free rooms with a projector for 30+ people within 2 seconds of opening the search, so that I can plan a make-up class between lectures."
- **S6 (N)** → "As a lecturer, I need to book a specific room for a chosen time, so that I can run a make-up class." React and stored procedures are the team's decision.
- **S7 (E)** → first learn enough about the door system to estimate (a short investigation of this kind is listed in Table 1 as Spikes), then write the story.
- **S8** → keep it as a technical backlog item: "not all backlog items are to be written as user stories".
> Exam trap: one draft can break several letters at once (S4 is also hard to estimate). In a question, pick the letter the wording points to most directly: "only after story X" → I; "using technology X" → N; "nice, fast, convenient" → T; "never done before" → E; "a whole system" → S; "so that there is…" → V.
## Step 4 — the 3Cs for two stories
**Story A — Card.** Title (optional, an active-verb goal phrase): **Find a free room**.
= As a student, I need to see which rooms are free in the next hour, so that I can book one for my team quickly.
= In order to book a room for my team quickly, as a student, I need to see which rooms are free in the next hour.
**Story A — Conversation.** The card intentionally leaves questions open, and the team asks students and the dean's office: does "free" mean free for the whole hour or for at least 30 minutes? All buildings, or the nearest first? Do capacity and a projector matter to students?
**Story A — Confirmation (acceptance criteria):**
- Only rooms with no booking overlapping the chosen hour are shown.
- Each room shows its building, capacity and equipment.
- Rooms closed for repair are not shown.
- Once a room is booked, it disappears from the free list of other users within 5 seconds.
**Story B — Card.** Title: **Cancel a booking**.
= As a lecturer, I need to cancel my booking, so that the room becomes available to others.
**Story B — Confirmation (acceptance criteria):**
- A booking can be cancelled up to the start time of its slot.
- After cancelling, the room appears in the free list at once.
- Everyone invited to the booking receives a notification.
- A lecturer cannot cancel another person's booking.
| Candidate line | Acceptance criterion? | Why |
|---|---|---|
| "After cancelling, the room appears in the free list at once" | yes | objective; sets a boundary of the story |
| "The cancel button should look modern and friendly" | no | cannot be validated objectively |
| "Build the cancel dialog in React" | no | design — how to deliver (Negotiable), not what must be true |
| "The story is finished by Friday" | no | a schedule, not a boundary of the story |
| "A lecturer cannot cancel another person's booking" | yes | a boundary: what the story must not allow |
These criteria are used **primarily by the product owner and stakeholders to verify and validate**, help the team find **the minimum amount of function necessary**, and become the **basis for acceptance, regression and exploratory tests**.
## Step 5 — splitting the big story (Story Decomposition)
S4, "a full university scheduling system", is decomposed into stories that each fit one iteration:
| Smaller story | Value (WHY) |
|---|---|
| As a lecturer, I need to book a room for one slot, so that I can run a make-up class. | a guaranteed room for one class |
| As a lecturer, I need to repeat a booking weekly for the semester, so that my consultations always have a room. | no weekly re-booking |
| As a lecturer, I need to filter rooms by projector and capacity, so that the room fits my group. | the right room the first time |
| As a dean's office officer, I need to block rooms for exam week, so that exams never clash with bookings. | no clashes during exams |
| As a lecturer, I need to see my timetable next to free rooms, so that I pick a slot without conflicts. | fewer scheduling mistakes |
Each new story is Independent, Valuable and Sized Appropriately; the rest of the original idea waits on the backlog. **Story Elaboration** then adds detail to the top story just before it is built.
> Note the limitation: user stories spawn more user stories through decomposition, so the information must be organized to stay current and relevant, and the collection must be regularly refined and prioritized.
## Step 6 — the limitations in this case
| Limitation from the slides | How it shows up in RoomBook | What the team does |
|---|---|---|
| Personas: generic user | a single "University User" persona | keeps Dana and Serik separate and ranked |
| Personas: not a substitute for a real user | the team stops talking to students | still holds reviews with real students and the dean's office |
| Personas: need regular review | a new campus building changes how people book | updates the personas every semester |
| Stories: too many stories inflate the backlog | 140 small stories after decomposition | regular backlog refinement and prioritization |
| Stories: losing sight of the vision | polishing filters while exam booking is still missing | checks stories against the vision and product roadmap |
| Stories: WHAT without WHY | "As a student, I need a dark mode." | asks for the "so that" before accepting a story |
| Stories: no detailed specifications upfront | developers want a full spec before starting | relies on conversation and acceptance criteria instead |
?? Which INVEST letter does "As a lecturer, I need the booking page to be user-friendly" break, and how would you fix it?
?= T — Testable: "user-friendly" cannot be validated objectively by a stakeholder. Fix it with a checkable outcome, for example "book a room in no more than three taps".
?? The team wants to show the first increment to the dean's office and hear their opinion. Which context and column of Table 1 apply, and which technique fits?
?= Communications, the column of stakeholders external to the team: Reviews (Visioning is also there, for agreeing a shared vision).
?? "Dana wants to save time between classes." Which persona element is this?
?= A motivation — it explains why and how she would use the solution. A trait would be, for example, "books late in the evening".
## Exam focus
- Read the case → find the **context** row of Table 1 → pick the **column** (internal team or stakeholders external to the team).
- Persona elements in a case: what the person is like → **trait**; why and how they use the solution → **motivation**; a specific, finite need (safety, trust) → **need**; what separates this persona from another → **differentiator**.
- INVEST letters from the wording: dependency → **I**; prescribed technology → **N**; no value → **V**; never done before → **E**; too big for one iteration → **S**; vague adjective → **T**.
- A correct story has **WHO + WHAT + WHY**; a requirement without a role or without "so that" is incomplete.
- Acceptance criteria are **objective boundaries**, not design choices, deadlines or opinions.
- A story too big for one iteration → **Story Decomposition**; adding detail just before building → **Story Elaboration**.`,
    ru: `## Кейс: RoomBook
IT-команда университета делает **RoomBook** — приложение, где студенты и преподаватели находят и бронируют свободные аудитории, лаборатории и переговорные. Сейчас аудитории бронируют, лично приходя в деканат, и двойные брони случаются каждую неделю. Деканат — внешний заказчик; команда может поговорить с несколькими студентами и преподавателями, но представителя заказчика внутри команды нет. В этой части лекция применяется к кейсу шаг за шагом — без новой теории, только понятия со слайдов в деле.
| Шаг | Понятие из лекции |
|---|---|
| 1. Выбрать техники | таблица 1 — Selecting the Right Technique |
| 2. Описать пользователей | Personas — короткий и длинный шаблон, элементы, ранжирование |
| 3. Написать и проверить истории | User Stories — WHO / WHAT / WHY и INVEST |
| 4. Card, Conversation, Confirmation | три C и критерии приёмки (acceptance criteria) |
| 5. Разбить большую историю | Story Decomposition (User Story Management) |
| 6. Следить за ограничениями | ограничения персон и пользовательских историй |
## Шаг 1 — выбираем техники по таблице 1
Начните с цели, найдите её строку **контекста (Context)**, потом выберите **столбец**: работа идёт в основном с внутренней командой или со стейкхолдерами вне команды?
| Цель в RoomBook | Контекст в таблице 1 | Внутренняя команда | Внешние стейкхолдеры |
|---|---|---|---|
| понять, кто будет пользоваться приложением и зачем | Understanding your Customer | Personas, Storyboarding, Value Modelling | — |
| писать требования и управлять ими | Requirements Management | User Stories, Story Decomposition, Story Elaboration, Story Mapping, BDD, Job Stories, Relative Estimation, Spikes | — |
| показывать каждый инкремент деканату и собирать отзывы | Communications | — | Reviews |
| договориться с деканатом об общем видении | Communications | Visioning | Visioning |
| решить, что войдёт в первый релиз | Product Management Refinement | Minimal Viable Product, Product Roadmap, Purpose Alignment Model, Real Options | Kano Analysis, Minimal Viable Product |
| увидеть, где нынешний бумажный процесс теряет время | Process Analysis | Value Stream Mapping | Impact Mapping |
| улучшать собственный способ работы команды | Communications | Retrospectives | — |
> Помните: таблица 1 — лишь **отправная точка**. Окончательный выбор делают знание предметной области, опыт, личные компетенции и творческий подход команды — здесь, например, Personas и User Stories используются вместе, потому что требования персон «можно использовать для разработки user stories».
## Шаг 2 — две персоны по короткому шаблону
Команда поговорила с несколькими студентами и преподавателями и имеет данные расписания, поэтому начинает с реальных фактов и заполняет **короткий шаблон персоны (Short Persona Template)** (Figure 1).
| Поле короткого шаблона | Персона A | Персона B |
|---|---|---|
| Имя + картинка | Дана (вымышленное фото) | Серик Ахметов (вымышленное фото) |
| Details or Context — задачи и обязанности | студентка 3 курса Software Engineering; собирает встречи по командному проекту | старший преподаватель; назначает отработки и консультации |
| Details or Context — технологии | только смартфон; живёт в Telegram | ноутбук и почта; редко ставит приложения |
| Traits and characteristics — возраст, занятие, место | 20; студентка; общежитие кампуса | 47; преподаватель; ведёт занятия в двух корпусах |
| Goals (цели) | найти свободную аудиторию меньше чем за минуту; забронировать на всю команду; получить напоминание | забронировать аудиторию с проектором на 30 студентов; легко переносить бронь; получать подтверждение на почту |
Чтобы развернуть персону в длинный шаблон (Figure 2), нужно **дополнительное исследование пользователей**. После новых интервью команда добавляет:
| Поле длинного шаблона | Дана | Серик Ахметов |
|---|---|---|
| Buying motive (здесь: почему начать пользоваться RoomBook) | перестать ходить по корпусам в поисках пустой аудитории | перестать звонить в деканат по каждой отработке |
| Traits (черты) | бронирует поздно вечером, решает быстро | планирует на неделю вперёд, осторожен |
| Needs (потребности) | доверие: подтверждённую аудиторию никто не займёт | надёжность расписания: его группу никогда не забронируют дважды |
| Motivation (мотив) | экономить время между парами | никогда не привести 30 студентов в занятую аудиторию |
| Differentiators (отличия) | поколенческое: выросла со смартфоном, почту не читает | по опыту: 20 лет со старым бумажным процессом; по предпочтению: почта вместо мессенджеров |
**Ранжирование.** Персоны ранжируют, чтобы найти тех, кто получит наибольшую пользу от проектного решения. Двойная бронь у преподавателя бьёт по целой группе, поэтому команда ставит **Серика первым** и планирует первые истории под него.
> Не попадитесь в ловушку «всё для всех»: команда **не** сливает Дану и Серика в одного «Пользователя университета, 18–65». Их отличия (смартфон или почта, вечер или неделя вперёд) ведут к разным историям.
**Какой это элемент?** Быстрая самопроверка на кейсе:
| Утверждение о персоне | Элемент |
|---|---|
| «Дане 20 лет, она живёт в общежитии кампуса» | черты и характеристики (traits and characteristics) |
| «Дана хочет экономить время между парами» | мотив (motivation) |
| «Дане нужно доверять тому, что подтверждённую аудиторию никто не займёт» | потребность (need) |
| «В отличие от Серика, Дана выросла со смартфоном и почту не читает» | отличие (differentiator) — поколенческое или по опыту |
| «Серик предпочитает почту мессенджерам» | отличие (differentiator) — по предпочтению |
| «Забронировать аудиторию с проектором на 30 студентов» | цель (goal) — поле короткого шаблона |
## Шаг 3 — восемь черновиков историй и проверка по INVEST
Владелец продукта и бизнес-аналитик пишут первые черновики в бэклог. Затем команда проверяет каждый по INVEST.
| № | Черновик | Проблема | Буква INVEST |
|---|---|---|---|
| S1 | Как студентка, мне нужно видеть, какие аудитории свободны в ближайший час, чтобы быстро забронировать одну для команды. | нет — маленькая, ценная, проверяемая | — |
| S2 | Как пользователь, мне нужен экран бронирования, чтобы был экран бронирования. | WHY повторяет WHAT; ценности ни для кого нет | V — Valuable |
| S3 | Как студентка, мне нужно забронировать аудиторию; это можно сделать только после истории про одобрение администратором. | привязана к другой истории | I — Independent |
| S4 | Как преподаватель, мне нужна полная система расписания университета — аудитории, пары, экзамены, оборудование, — чтобы всё было в одном месте. | слишком велика для одной итерации | S — Sized Appropriately |
| S5 | Как преподаватель, мне нужно, чтобы бронирование было быстрым и удобным, чтобы не терять время. | «быстро и удобно» нельзя проверить объективно | T — Testable |
| S6 | Как преподаватель, мне нужно бронировать аудиторию 305 через React-модалку, вызывающую хранимую процедуру PostgreSQL, чтобы провести отработку. | диктует команде, как это делать | N — Negotiable |
| S7 | Как студентка, мне нужно открывать аудиторию новой системой распознавания лиц на двери, чтобы не нужен был ключ. | никто в команде не работал с этой системой, трудозатраты не оценить | E — Estimable |
| S8 | Ротировать JWT refresh-токены каждые 24 часа. | технический элемент, не user story — и это допустимо | — (не все элементы бэклога — истории) |
**Исправления:**
- **S2 (V)** → «Как студентка, мне нужно забронировать свободную аудиторию на выбранный час, чтобы у команды было гарантированное место для встречи».
- **S3 (I)** → убрать зависимость: «Как студентка, мне нужно забронировать свободную аудиторию, чтобы команда могла там встретиться»; одобрение, если оно правда нужно, — отдельная история.
- **S4 (S)** → разбить на истории поменьше (шаг 5).
- **S5 (T)** → «Как преподаватель, мне нужно видеть свободные аудитории с проектором на 30+ человек не позже 2 секунд после открытия поиска, чтобы спланировать отработку между парами».
- **S6 (N)** → «Как преподаватель, мне нужно забронировать конкретную аудиторию на выбранное время, чтобы провести отработку». React и хранимые процедуры — решение команды.
- **S7 (E)** → сначала разобраться в дверной системе настолько, чтобы оценить (такое короткое исследование в таблице 1 называется Spikes), потом писать историю.
- **S8** → оставить техническим элементом бэклога: «не все элементы бэклога нужно записывать как user stories».
> Ловушка экзамена: один черновик может нарушать сразу несколько букв (S4 ещё и трудно оценить). В вопросе выбирайте букву, на которую формулировка указывает прямее всего: «только после истории X» → I; «на технологии X» → N; «красиво, быстро, удобно» → T; «никогда не делали» → E; «целая система» → S; «чтобы был…» → V.
## Шаг 4 — три C для двух историй
**История A — Card.** Заголовок (необязательный, фраза-цель с активным глаголом): **Find a free room** («Найти свободную аудиторию»).
= As a student, I need to see which rooms are free in the next hour, so that I can book one for my team quickly.
= In order to book a room for my team quickly, as a student, I need to see which rooms are free in the next hour.
**История A — Conversation.** Карточка намеренно оставляет вопросы открытыми, и команда спрашивает студентов и деканат: «свободна» — это на весь час или хотя бы на 30 минут? Все корпуса или сначала ближайший? Важны ли студентам вместимость и проектор?
**История A — Confirmation (критерии приёмки):**
- Показываются только аудитории без броней, пересекающихся с выбранным часом.
- У каждой аудитории указаны корпус, вместимость и оборудование.
- Аудитории на ремонте не показываются.
- Как только аудиторию забронировали, она исчезает из списка свободных у других пользователей не позже чем через 5 секунд.
**История B — Card.** Заголовок: **Cancel a booking** («Отменить бронь»).
= As a lecturer, I need to cancel my booking, so that the room becomes available to others.
**История B — Confirmation (критерии приёмки):**
- Бронь можно отменить до времени начала слота.
- После отмены аудитория сразу появляется в списке свободных.
- Все приглашённые в бронь получают уведомление.
- Преподаватель не может отменить чужую бронь.
| Кандидат в критерии | Критерий приёмки? | Почему |
|---|---|---|
| «После отмены аудитория сразу появляется в списке свободных» | да | объективно; задаёт границу истории |
| «Кнопка отмены должна выглядеть современно и дружелюбно» | нет | нельзя проверить объективно |
| «Сделать диалог отмены на React» | нет | дизайн — как поставить (Negotiable), а не что должно быть верно |
| «История готова к пятнице» | нет | срок, а не граница истории |
| «Преподаватель не может отменить чужую бронь» | да | граница: чего история не должна позволять |
Эти критерии **в первую очередь используют владелец продукта и стейкхолдеры для верификации и валидации**, они помогают команде найти **минимально необходимый объём функций** и становятся **основой для приёмочных, регрессионных и исследовательских тестов**.
## Шаг 5 — разбиваем большую историю (Story Decomposition)
S4, «полную систему расписания университета», раскладывают на истории, каждая из которых укладывается в одну итерацию:
| История поменьше | Ценность (WHY) |
|---|---|
| Как преподаватель, мне нужно забронировать аудиторию на один слот, чтобы провести отработку. | гарантированная аудитория на одно занятие |
| Как преподаватель, мне нужно повторять бронь еженедельно на семестр, чтобы у консультаций всегда была аудитория. | не бронировать каждую неделю заново |
| Как преподаватель, мне нужно фильтровать аудитории по проектору и вместимости, чтобы аудитория подходила группе. | нужная аудитория с первого раза |
| Как сотрудник деканата, мне нужно закрывать аудитории на неделю экзаменов, чтобы экзамены не пересекались с бронями. | никаких накладок в сессию |
| Как преподаватель, мне нужно видеть своё расписание рядом со свободными аудиториями, чтобы выбирать слот без конфликтов. | меньше ошибок в расписании |
Каждая новая история независима (Independent), ценна (Valuable) и подходящего размера (Sized Appropriately); остальное из исходной идеи ждёт в бэклоге. Затем **Story Elaboration** добавляет детали в верхнюю историю прямо перед реализацией.
> Обратите внимание на ограничение: истории порождают новые истории через декомпозицию, поэтому информацию нужно упорядочивать, чтобы она оставалась актуальной и уместной, а весь набор — регулярно уточнять и приоритизировать.
## Шаг 6 — ограничения в этом кейсе
| Ограничение со слайдов | Как проявляется в RoomBook | Что делает команда |
|---|---|---|
| Персоны: обобщённый пользователь | одна персона «Пользователь университета» | держит Дану и Серика раздельно и ранжирует |
| Персоны: не замена реальному пользователю | команда перестаёт говорить со студентами | продолжает проводить обзоры с реальными студентами и деканатом |
| Персоны: нужен регулярный пересмотр | новый корпус меняет то, как бронируют | обновляет персоны каждый семестр |
| Истории: слишком много историй раздувают бэклог | 140 маленьких историй после декомпозиции | регулярное уточнение и приоритизация бэклога |
| Истории: потеря видения | шлифуют фильтры, а бронирования экзаменов всё ещё нет | сверяет истории с видением и дорожной картой продукта |
| Истории: WHAT без WHY | «Как студентка, мне нужна тёмная тема». | требует «чтобы…» до того, как принять историю |
| Истории: нет детальных спецификаций заранее | разработчики хотят полную спецификацию до старта | опирается на разговор и критерии приёмки |
?? Какую букву INVEST нарушает «Как преподаватель, мне нужно, чтобы страница бронирования была удобной», и как это исправить?
?= T — Testable: «удобной» стейкхолдер объективно проверить не может. Исправить проверяемым результатом, например «забронировать аудиторию не больше чем за три касания».
?? Команда хочет показать первый инкремент деканату и услышать его мнение. Какой контекст и столбец таблицы 1 подходят и какая техника?
?= Communications, столбец стейкхолдеров вне команды: Reviews (там же Visioning — чтобы договориться об общем видении).
?? «Дана хочет экономить время между парами». Какой это элемент персоны?
?= Мотив (motivation) — он объясняет, почему и как она будет пользоваться решением. Чертой было бы, например, «бронирует поздно вечером».
## Что спросят на экзамене (Exam focus)
- Читаем кейс → находим строку **контекста** в таблице 1 → выбираем **столбец** (внутренняя команда или стейкхолдеры вне команды).
- Элементы персоны в кейсе: какой человек → **черта (trait)**; почему и как пользуется решением → **мотив (motivation)**; конкретная конечная потребность (безопасность, доверие) → **потребность (need)**; чем персона отличается от другой → **отличие (differentiator)**.
- Буква INVEST по формулировке: зависимость → **I**; навязанная технология → **N**; нет ценности → **V**; никогда не делали → **E**; не влезает в итерацию → **S**; расплывчатое прилагательное → **T**.
- Правильная история — **WHO + WHAT + WHY**; требование без роли или без «so that» неполно.
- Критерии приёмки — **объективные границы**, а не дизайнерские решения, сроки или мнения.
- История не влезает в одну итерацию → **Story Decomposition**; добавить детали прямо перед реализацией → **Story Elaboration**.`,
  },
  [
    qx("RoomBook draft: \"As a student, I need to book a room; this story can be built only after the admin approval story is done.\" Which INVEST criterion is violated most directly?", "Independent", [
      ["Negotiable", "Negotiable is about the team choosing how to deliver; nothing in this draft prescribes the how.", "Negotiable — о том, что команда сама выбирает, как поставить; здесь ничего не навязано."],
      ["Sized Appropriately", "Booking a room is a small slice that can fit one iteration; the problem is the dependency.", "Бронирование аудитории — маленький срез, он влезает в итерацию; проблема в зависимости."],
      ["Testable", "Whether a room was booked can be checked objectively; testability is not the issue.", "Забронирована ли аудитория, можно проверить объективно; проверяемость тут ни при чём."],
    ], "Independent (slide): represents a feature which can be delivered independent of other features. \"Only after the admin approval story\" ties it to another story.", "Independent (слайд): функция, которую можно поставить независимо от других. «Только после истории про одобрение» привязывает её к другой истории."),
    qx("RoomBook draft: \"As a lecturer, I need booking to be fast and convenient, so that I do not waste time.\" Which INVEST criterion is violated most directly?", "Testable", [
      ["Valuable", "The draft does state a value (not wasting time); the weak part is that nothing can be checked.", "Ценность в черновике есть (не терять время); слабость в том, что ничего нельзя проверить."],
      ["Independent", "The draft does not depend on any other story.", "Черновик не зависит ни от какой другой истории."],
      ["Sized Appropriately", "Size is not the problem; \"fast and convenient\" is simply not measurable.", "Дело не в размере: «быстро и удобно» просто не измерить."],
    ], "Testable (slide): can be validated objectively by a stakeholder. \"Fast and convenient\" cannot; a fix is \"free rooms appear within 2 seconds\".", "Testable (слайд): стейкхолдер может объективно проверить. «Быстро и удобно» — нельзя; исправление — «свободные аудитории появляются за 2 секунды»."),
    qx("RoomBook draft: \"As a lecturer, I need a full university scheduling system for rooms, timetables, exams and equipment, so that everything is in one place.\" Which INVEST criterion is violated most directly?", "Sized Appropriately", [
      ["Independent", "The draft does not wait for any other story; it is simply huge.", "Черновик не ждёт другой истории — он просто огромный."],
      ["Negotiable", "It does not prescribe how to build anything; the team is free in the how.", "Он не диктует, как строить; команда свободна в выборе «как»."],
      ["Valuable", "Having everything in one place is a value; the problem is that it cannot be finished in one iteration.", "Всё в одном месте — это ценность; проблема в том, что за одну итерацию это не сделать."],
    ], "Sized Appropriately (slide): for the team to complete in one iteration; in general, the smaller the better. A whole scheduling system is an epic that must be decomposed.", "Sized Appropriately (слайд): чтобы команда успела за одну итерацию; чем меньше, тем лучше. Целая система расписания — эпик, его нужно декомпозировать."),
    qx("RoomBook draft: \"As a lecturer, I need to book Room 305 through a React modal that calls a PostgreSQL stored procedure, so that I can run a make-up class.\" Which INVEST criterion is violated most directly?", "Negotiable", [
      ["Testable", "Whether the lecturer can book Room 305 is checkable; the problem is the dictated implementation.", "Может ли преподаватель забронировать 305-ю, проверить можно; проблема в навязанной реализации."],
      ["Estimable", "A React modal and a stored procedure are familiar technologies, so the team could estimate it.", "React-модалка и хранимая процедура — знакомые технологии, команда сможет оценить."],
      ["Sized Appropriately", "One booking dialog fits one iteration; size is not the issue.", "Один диалог бронирования влезает в итерацию; дело не в размере."],
    ], "Negotiable (slide): the team can negotiate how to deliver. Naming the UI component and the database mechanism takes that choice away; the story should state the need and its value.", "Negotiable (слайд): команда может договориться, как поставить. Указание UI-компонента и механизма базы данных отнимает этот выбор; история должна говорить о потребности и ценности."),
    qx("RoomBook draft: \"As a student, I need to open the booked room through the face-recognition doors the university has just installed, so that I can get in without collecting a key from the porter.\" Nobody on the team has ever worked with that door system, and they cannot say how long it would take. Which INVEST criterion is violated most directly?", "Estimable", [
      ["Valuable", "Opening a room without a key is a real benefit for a student.", "Открыть аудиторию без ключа — реальная польза для студента."],
      ["Independent", "Nothing in the case says it waits for another story.", "В кейсе нет зависимости от другой истории."],
      ["Testable", "A stakeholder can objectively check whether the booked room opens; the stated issue is the missing experience.", "Стейкхолдер может объективно проверить, открывается ли забронированная аудитория; заявленная проблема — нет опыта."],
    ], "Estimable (slide): team can estimate effort to deliver based on past experience. With no past experience, the team first needs to learn enough to estimate.", "Estimable (слайд): команда может оценить трудозатраты по прошлому опыту. Без опыта сначала нужно разобраться настолько, чтобы оценить."),
    qx("RoomBook draft: \"As a user, I need a booking screen, so that there is a booking screen.\" Which INVEST criterion is violated most directly?", "Valuable", [
      ["Testable", "Whether a screen exists is trivially checkable; the problem is that it brings nobody any value.", "Есть ли экран, проверить легко; проблема в том, что он никому не приносит ценности."],
      ["Independent", "The draft depends on no other story.", "Черновик не зависит от других историй."],
      ["Estimable", "A single screen is easy to estimate from past experience.", "Один экран легко оценить по прошлому опыту."],
    ], "Valuable (slide): expresses the value to the customer. Here the WHY just repeats the WHAT; a fix is \"…so that my team has a guaranteed place to meet\".", "Valuable (слайд): выражает ценность для клиента. Здесь WHY повторяет WHAT; исправление — «…чтобы у команды было гарантированное место для встречи»."),
    qx("Which of the following is a correctly formulated user story in the slide's popular format?", "As a student, I need to see free rooms for the next hour, so that my team can meet", [
      ["The system shall display all free rooms for the next hour on the main page of the app", "A \"system shall\" statement has no user role (WHO) and no benefit (WHY).", "Утверждение «система должна» не содержит ни роли (WHO), ни пользы (WHY)."],
      ["As a developer, I need to add an index to the bookings table to speed up queries", "This is a technical backlog item dressed up as a story; not all backlog items need to be user stories.", "Это технический элемент бэклога, переодетый в историю; не все элементы бэклога должны быть историями."],
      ["Show free rooms quickly and nicely, so that students and lecturers are happy", "There is no single user role, and \"quickly and nicely\" is not testable.", "Нет одной роли пользователя, а «быстро и красиво» не проверить."],
    ], "Format 1: As a <role>, I need to <feature> so that <goal or value>. The correct option has the WHO (a student), the WHAT (see free rooms for the next hour) and the WHY (the team can meet).", "Формат 1: As a <role>, I need to <feature> so that <goal or value>. Верный вариант содержит WHO (студентка), WHAT (видеть свободные аудитории на ближайший час) и WHY (команда может встретиться)."),
    qx("RoomBook has three personas. How should the team decide which persona the first stories should serve?", "By who will realize the most benefit from the solution design", [
      ["By whose data was the quickest to collect in the interviews", "Ease of research is convenient for the team but says nothing about benefit to users.", "Лёгкость исследования удобна команде, но ничего не говорит о пользе для пользователей."],
      ["By merging them first into one average university user", "Merging creates a generic user — the \"everything to everyone\" limitation.", "Слияние даёт обобщённого пользователя — ограничение «всё для всех»."],
      ["By which persona the developers personally find most likable", "Personal liking is exactly the bias personas are meant to help keep out of the solution.", "Личная симпатия — как раз то предубеждение, от которого персоны помогают уберечь решение."],
    ], "Slide: personas are ranked to identify those that will realize the most benefit from the solution design.", "Слайд: персоны ранжируют, чтобы найти тех, кто получит наибольшую пользу от проектного решения."),
    qx("Which line is a proper acceptance criterion for the story \"Find a free room\"?", "Only rooms with no booking overlapping the chosen hour are shown", [
      ["The search screen is built with React and a PostgreSQL database view", "This is design — how to deliver, which stays negotiable — not a boundary of the story.", "Это дизайн — как поставить, что остаётся предметом договорённости, — а не граница истории."],
      ["Students will love how quick and modern the new search feels", "An opinion that cannot be validated objectively by a stakeholder.", "Мнение, которое стейкхолдер не может объективно проверить."],
      ["The team will finish this story by the end of next Friday", "A deadline is planning information, not a condition the delivered item must satisfy.", "Срок — информация для планирования, а не условие, которому должен отвечать результат."],
    ], "Acceptance criteria define the boundaries of a user story and help verify and validate that the solution met the need; this line is objective and checkable.", "Критерии приёмки задают границы истории и помогают верифицировать и валидировать, что решение отвечает потребности; эта строка объективна и проверяема."),
    qx("For the story \"Cancel a booking\", which line is NOT a proper acceptance criterion?", "The cancel button should look modern and friendly", [
      ["After cancelling, the room appears in the free list at once", "A proper criterion: objective and it sets a boundary of the story.", "Правильный критерий: объективен и задаёт границу истории."],
      ["Everyone invited to the booking receives a notification", "A proper criterion: a stakeholder can check that the notification arrives.", "Правильный критерий: стейкхолдер может проверить, что уведомление пришло."],
      ["A lecturer cannot cancel another person's booking", "A proper criterion: it marks what the story must not allow.", "Правильный критерий: отмечает, чего история не должна позволять."],
    ], "\"Modern and friendly\" cannot be validated objectively, so it fails as an acceptance criterion; criteria must be usable by the product owner and stakeholders to verify and validate.", "«Современно и дружелюбно» нельзя проверить объективно, значит, это не критерий приёмки; критерии должны позволять владельцу продукта и стейкхолдерам верифицировать и валидировать."),
    qx("RoomBook persona note: \"Dana wants to save time between classes.\" Which persona element is this?", "Motivations", [
      ["Traits and characteristics", "Traits describe what Dana is like (20, student, books late in the evening), not why she uses the app.", "Черты описывают, какая Дана (20 лет, студентка, бронирует вечером), а не почему она пользуется приложением."],
      ["Needs", "Needs are very specific, finite needs such as trust or safety.", "Needs — очень конкретные конечные потребности вроде доверия или безопасности."],
      ["Differentiators", "Differentiators say what sets Dana apart from another persona.", "Differentiators говорят, чем Дана отличается от другой персоны."],
    ], "Motivations (slide): the underlying motivations regarding how and why the stakeholder interacts with the solution — like the ATM user motivated by withdrawing the minimum amount needed.", "Motivations (слайд): глубинные мотивы — как и почему стейкхолдер взаимодействует с решением, как у человека у банкомата, которому важно снять минимально нужную сумму."),
    qx("RoomBook persona note: \"Dana needs to trust that a confirmed room will not be taken by someone else.\" Which column of the long template does this belong in?", "Needs", [
      ["Motivation", "Motivation is why and how she uses the app (to save time); trust is named on the slide as a basic need.", "Motivation — почему и как она пользуется приложением (экономить время); доверие слайд называет базовой потребностью."],
      ["Traits", "Traits describe what she is like, not what she needs from the solution.", "Traits описывают, какая она, а не что ей нужно от решения."],
      ["Differentiators", "This statement does not contrast Dana with another persona.", "Это утверждение не противопоставляет Дану другой персоне."],
    ], "Needs (slide): very specific needs — basic ones such as safety, trust, or access to food and shelter, or higher level ones such as acceptance and validation. Needs are finite.", "Needs (слайд): очень конкретные потребности — базовые (безопасность, доверие, еда и кров) или более высокого уровня (принятие и признание). Потребности конечны."),
    qx("RoomBook persona note: \"Unlike Serik, Dana grew up with smartphones and never reads email.\" Which persona element is this?", "Differentiators", [
      ["Goals", "Goals say what she wants to achieve with the solution; this note compares her with another persona.", "Goals — чего она хочет добиться с помощью решения; эта заметка сравнивает её с другой персоной."],
      ["Motivations", "It does not say why she uses the solution.", "Здесь не сказано, почему она пользуется решением."],
      ["Needs", "It is not a specific need such as safety or trust.", "Это не конкретная потребность вроде безопасности или доверия."],
    ], "Differentiators (slide): identify specifically why this persona is different from another persona — generational or experiential, preference, or identifying characteristics. Growing up with smartphones is generational.", "Differentiators (слайд): чем именно эта персона отличается от другой — поколенческие или по опыту, по предпочтениям, опознавательные черты. Вырасти со смартфоном — поколенческое отличие."),
    qx("The RoomBook team wants to show each new increment to the dean's office — stakeholders outside the team — and collect feedback. Which technique does Table 1 offer for this?", "Reviews", [
      ["Retrospectives", "Retrospectives are in Communications too, but only in the internal-teams column: the team reflects on its own work.", "Retrospectives тоже в Communications, но только во внутреннем столбце: команда разбирает свою работу."],
      ["Planning Workshops", "Planning Workshops are internal-only in Communications.", "Planning Workshops — только во внутреннем столбце Communications."],
      ["Spikes", "Spikes are in Requirements Management, internal teams — not a way to get stakeholder feedback.", "Spikes — в Requirements Management, внутренние команды; это не способ получить отзывы стейкхолдеров."],
    ], "Table 1, Communications, works well with stakeholders external to the team: 7.15 Reviews and 7.24 Visioning.", "Таблица 1, Communications, хорошо работают со стейкхолдерами вне команды: 7.15 Reviews и 7.24 Visioning."),
    qx("Besides Personas, which technique does Table 1 place in the same context, Understanding your Customer?", "Storyboarding", [
      ["Story Mapping", "Story Mapping is in Requirements Management, next to User Stories.", "Story Mapping — в Requirements Management, рядом с User Stories."],
      ["Value Stream Mapping", "Value Stream Mapping is the internal technique of Process Analysis.", "Value Stream Mapping — внутренняя техника строки Process Analysis."],
      ["Kano Analysis", "Kano Analysis is in Product Management Refinement, external column.", "Kano Analysis — в Product Management Refinement, внешний столбец."],
    ], "Table 1, Understanding your Customer: 7.7 Personas, 7.17 Storyboarding, 7.22 Value Modelling — all in the internal-teams column.", "Таблица 1, Understanding your Customer: 7.7 Personas, 7.17 Storyboarding, 7.22 Value Modelling — все во внутреннем столбце."),
    qx("The RoomBook draft \"full university scheduling system\" cannot be finished in one iteration. Which User Story Management technique should the team apply?", "Story Decomposition", [
      ["Story Elaboration", "Elaboration adds detail to a story; it does not make a huge story smaller.", "Elaboration добавляет истории детали, но не делает огромную историю меньше."],
      ["Visioning", "Visioning creates the shared vision; it does not split stories.", "Visioning создаёт общее видение и не разбивает истории."],
      ["Relative Estimation", "Estimating the epic would only confirm it is too big; it would still need splitting.", "Оценка эпика лишь подтвердит, что он слишком велик; разбивать всё равно придётся."],
    ], "Story Decomposition is one of the five techniques impacted by user stories; it splits a story that is not Sized Appropriately into stories that fit one iteration.", "Story Decomposition — одна из пяти техник, зависящих от user stories; она разбивает историю, которая не Sized Appropriately, на истории под одну итерацию."),
    tfx("The backlog item \"Rotate the JWT refresh tokens every 24 hours\" must be rewritten as a user story before the team may work on it.", false,
      "Slide: not all backlog items are to be written as user stories. A purely technical item can stay a technical backlog item.",
      "Слайд: не все элементы бэклога нужно записывать как user stories. Чисто технический элемент может остаться техническим элементом бэклога.",
      "\"True\" would force a fake user role and a fake WHY onto technical work, which the slide does not require.",
      "«Верно» заставило бы придумывать фальшивую роль и фальшивое WHY для технической работы, чего слайд не требует."),
    qx("The RoomBook team has almost no demographic data about part-time evening students. What do the slides suggest for building their personas?", "Invent personas from a few dry facts, keeping a representative pool", [
      ["Postpone all persona work until complete demographic data is collected", "The slide accepts that sometimes personas must be invented from little more than a few dry facts.", "Слайд допускает, что иногда персоны приходится придумывать почти из ничего — по нескольким сухим фактам."],
      ["Create one generic persona that covers every possible type of user", "A generic user is a listed limitation — it leads to solutions trying to be everything to everyone.", "Обобщённый пользователь — названное ограничение: решения пытаются быть всем для всех."],
      ["Skip personas and rely only on role and actor descriptions instead", "Personas exist precisely to go deeper than role or actor descriptions.", "Персоны и нужны, чтобы идти глубже описаний ролей и акторов."],
    ], "Slide: if data is available, demographic data is a good start; however, in some cases it is necessary to be creative and invent personas based on little more than a few dry facts. In either case, a representative pool of personas should be identified.", "Слайд: если данные есть, демография — хорошее начало; но иногда приходится проявить фантазию и придумать персоны по нескольким сухим фактам. В любом случае нужен репрезентативный набор персон."),
    qx("Most RoomBook drafts look like \"As a student, I need a dark mode.\" Which part of the popular story format is missing?", "The benefit or business value (WHY)", [
      ["The user role or persona (WHO)", "The role is there: \"As a student\".", "Роль есть: «As a student»."],
      ["The action, behavior, or feature (WHAT)", "The feature is there: \"a dark mode\".", "Функция есть: «a dark mode»."],
      ["The acceptance criteria (Confirmation)", "Acceptance criteria are a separate C, not part of the WHO / WHAT / WHY sentence.", "Критерии приёмки — отдельная C, а не часть фразы WHO / WHAT / WHY."],
    ], "There is no \"so that…\": the WHY is missing. This is the listed limitation — teams can form habits overlooking the value statement (WHY) and focus on the feature (WHAT).", "Нет «so that…»: не хватает WHY. Это названное ограничение — команда привыкает упускать утверждение о ценности (WHY) и сосредотачивается на функции (WHAT)."),
    qx("Which title for a RoomBook story card follows the slide's guidance?", "Book a study room", [
      ["Rooms module", "A module name says where a function lives, not what the user wants to do.", "Название модуля говорит, где живёт функция, а не что хочет сделать пользователь."],
      ["Booking API v2", "A technical component is not an activity the user carries out.", "Технический компонент — не действие пользователя."],
      ["Story #142 for sprint 3", "An ID and a sprint number describe no activity at all.", "Номер и спринт вообще не описывают действия."],
    ], "Slide: the (optional) title describes an activity the user wants to carry out with the solution — typically an active-verb goal phrase, similar to the way use cases are titled.", "Слайд: (необязательный) заголовок описывает действие, которое пользователь хочет выполнить с решением, — обычно фраза-цель с активным глаголом, как в названиях use cases."),
  ],
);

export const lecture8: Lecture = {
  id: "pm-l8",
  title: { en: "Lecture 8 — Practices (techniques) in agile frameworks", ru: "Лекция 8 — Практики (техники) в agile-фреймворках" },
  parts: [p1, p2, p3],
};
