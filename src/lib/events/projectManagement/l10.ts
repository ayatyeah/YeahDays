import { part, qx, tfx, type Lecture } from "../types";

/*
 * Лекция 10 Project Management (UPr 2301): «Stakeholder Engagement», 43 слайда.
 * Источник — «PM TEST 8 WEEK EVENT/Lecture 10 Stakeholder Engagement.pdf»; слайды почти
 * дословно повторяют главу «Stakeholder Engagement» из Griffiths «PMI-ACP Exam Prep»
 * (2nd ed., RMC, 2018) — она же в списке литературы на последнем слайде.
 * Только картинками на слайдах (в извлечённом тексте их нет), перенесено в конспект:
 * «Sample use case diagram» (с. 14, © Scott Ambler: Student, Registrar; Enroll in university,
 * Register in a seminar, Search for seminars), «Sample wireframe» (с. 15, MoviesOnline Basic
 * Ordering Workflow — три экрана и всплывающие панели), «Sample persona» (с. 16, Bob the
 * Movie Buff — Description и Values целиком), «Effectiveness of different communication
 * channels» (с. 18, график Кокберна: ось Richness/Temperature от cold до hot, ось
 * Effectiveness; кривая без Q&A — Paper, Audio recording, Video recording; кривая с Q&A —
 * E-mail, Instant messaging, Phone, Face-to-face at whiteboard; перенесён схемой
 * pm10-comm-channels; значок Instant messaging на картинке стоит над концом чёрной кривой, но канал
 * интерактивный — отнесён к кривой с Q&A, как у Кокберна), таблица «Green Zone/Red Zone» (с. 28 — в извлечении колонки
 * перемешаны, восстановлена по картинке: четыре пары), «Quadrants of emotional
 * intelligence» (с. 35: Self/Others × Regulate/Recognize, содержимое квадрантов и
 * Z-образная стрелка Self-Awareness → Self-Management → Social Awareness → Social Skills).
 * Страницы 11, 21, 31 пустые (только логотип): после «Agile Versus Non-Agile Charters»
 * таблицы сравнения нет — традиционная сторона дописана из общей практики и помечена.
 * Рисунков уровней конфликта, fist-of-five и Highsmith's decision spectrum на слайдах нет —
 * признаки уровней (Speed Leas), значения пальцев и метки спектра взяты из учебника
 * Griffiths и помечены в конспекте как «beyond the slides».
 */

const p1 = part(
  "pm-l10-p1",
  { en: "Stakeholders and a shared vision", ru: "Стейкхолдеры и общее видение" },
  {
    en: `## Who are stakeholders?
> **Stakeholders:** any people or groups who will be **impacted by** or **have an impact on** the project.
The definition works in both directions. A group that only *feels the consequences* (end users who must learn a new screen) is a stakeholder, and so is a group that only *influences* the project (a security department that can block a release).
The slide lists who stakeholders **can include**:
| Stakeholder (slide) | Example on MoviesOnline (an online movie-rental service, the lecture's sample product) |
|---|---|
| **Customer** | the company that orders and pays for the new movie site |
| **Sponsor** | the executive who funds the project and authorizes its charter |
| **Business representative(s)** | the head of content licensing, the marketing lead |
| **Project manager** | the person who coordinates the project and its stakeholders |
| **Development team** | the developers, testers and designers who build the site |
| **Vendors** | the payment provider, the cloud hosting company, an outsourced QA firm |
| **Others in the organization** | legal, information security, customer support, finance |
| **Product's end users** | viewers like "Bob the Movie Buff" who will rent movies |
> Exam trap: the **project manager** and the **development team** are stakeholders too. A "Which is NOT listed?" question will offer something like "competitors" or "the general public" — they are not on the slide's list.
## Stakeholder stewardship vs stakeholder management
| | Stakeholder stewardship | Stakeholder management |
|---|---|---|
| Slide definition | **safeguards** the project stakeholders and makes sure they **have everything they need to succeed** | **treats people as resources** |
| Attitude | care, service, protection | control, allocation, "handling" people |
| Fits | the agile mindset and servant leadership (Lecture 6) | traditional command-and-control |
| MoviesOnline example | the team makes sure the licensing lead gets a clear demo and the data she needs to negotiate with film studios | the licensing lead is "booked" for two hours of requirements and then left out until the release |
> Memory hook: a **steward** looks after what has been entrusted to him; a stakeholder **manager** moves people around like resources. Agile prefers the word **engagement** (the title of the lecture) and the attitude of stewardship.
## Educating stakeholders about agile
Agile planning looks strange to people used to traditional projects: no full scope up front, plans that change every iteration. The slide lists **common concerns about agile**, group by group:
| Group | Typical concern (slide wording) | How to answer it (illustration) |
|---|---|---|
| **Executives and sponsors** | the **risk of project failure** due to the use of **new practices and counterintuitive planning approaches** | show that short iterations and frequent demos expose problems early; start with a pilot project |
| **Managers** | fear a **loss of control** or **erosion of their role** when projects assume an agile approach | explain their new role (removing impediments, coaching, portfolio decisions); make progress visible to them |
| **Development team** | may **resist** agile methods if they feel that the new approach is **being forced upon them** | involve the team in choosing and adapting the practices; use retrospectives |
| **User community** | worried they **will not get the features they want or require** | show the backlog and its priorities; deliver the most valuable features early; invite users to reviews |
| **Other groups** | an apparent **lack of control**, **continual requests for their involvement**, or the **lack of a clear end point** | agree on a predictable cadence of involvement; show the release plan and the definition of done |
> Exam trap: match the group to its concern. "Loss of control / erosion of their role" belongs to **managers**, not executives. "Risk of failure because of new practices and counterintuitive planning" belongs to **executives and sponsors**. "Forced upon them" is the **development team**. "Will not get the features" is the **user community**. "No clear end point" and "continual requests for involvement" are **other groups**.
## Keeping stakeholders engaged
- **Short iterations** prevent stakeholders from **losing interest** in the process — there is something new to see every one to four weeks.
- **Ongoing dialogue** helps identify potential **risks, defects, and issues** early.
- **Incorporating stakeholder values:** focus on bringing **project priorities into alignment with stakeholder priorities**.
- **Incorporating community values:** the two values that are **shared by Scrum and XP** are **"respect"** and **"courage"**.
| Scrum values (Lecture 7) | XP values | Shared by both |
|---|---|---|
| Commitment, Focus, Openness, **Respect**, **Courage** | Simplicity, Communication, Feedback, **Respect**, **Courage** | **Respect, Courage** |
> Exam trap: "openness", "focus" and "commitment" are Scrum-only values; "simplicity", "communication" and "feedback" are XP-only. Only **respect and courage** belong to both.
## Why the big focus on stakeholders?
Effective communication and stakeholder engagement are **critical to knowledge work projects** to ensure that:
- **team members know what they are building**;
- the team knows **what the customer is asking for**.
In knowledge work (software, design, research) the product is invisible until it is built, and the requirements live in people's heads. Without engaged stakeholders a team can build the wrong thing — perfectly.
## Principles of stakeholder engagement
The slide gives **six principles** — learn them word for word:
| # | Principle (slide) | What it means in practice |
|---|---|---|
| 1 | **Get the right stakeholders** | identify everyone affected and make sure the people involved have the knowledge and authority to decide |
| 2 | **Cement stakeholder involvement** | secure their commitment early and keep them involved; agree who attends the reviews |
| 3 | **Actively manage stakeholder interest** | watch for fading interest or new concerns and react (demos, short updates) |
| 4 | **Frequently discuss what "done" looks like** | revisit the definition of done for stories, releases and the product |
| 5 | **Show progress and capabilities** | demonstrate working software every iteration, not slides about it |
| 6 | **Candidly discuss estimates and projections** | be honest about uncertainty, velocity and forecasts — including bad news |
> Memory hook: **Get → Cement → Manage interest → "Done" → Show → Candid**: find the right people, lock them in, keep them interested, agree on "done", show results, be honest about the numbers.
## Establishing a shared vision
> Purpose of a shared vision: **uncover disconnects in understanding at the lowest possible cost.**
A misunderstanding found on a whiteboard costs five minutes; the same misunderstanding found after a release costs a sprint of rework and an unhappy customer. The slide names six **key tools used to establish a shared vision among stakeholders**:
- **Agile charters**
- **The definition of done**
- **Workshops**
- **Modeling**
- **Wireframes**
- **Personas**
Workshops are covered in Part 2; the other five tools follow here.
## Agile chartering
> **Agile charter:** the **first document produced for a project** that describes the **goal, purpose, composition, and approach** of the project.
- It **provides project authorization from the sponsor** — the charter is the official "go".
- It **acknowledges that scope may change** and **focuses on the goals of the project rather than fully-specified scope**.
**Agile vs non-agile charters.** The slide says: agile charters typically **have less detail, are shorter**, and **focus on how the project will be run rather than exactly what will be built**. (The next slide in the PDF is blank; the traditional column below is added from general project-management practice.)
| | Agile charter | Non-agile (traditional) charter |
|---|---|---|
| Length and detail | shorter, less detail | longer, more detail |
| Focus | **how** the project will be run (approach, team, cadence) and its goals | **what** exactly will be built (scope, deliverables) |
| Scope | expected to change; goals instead of a fully-specified scope | defined up front; changes go through change control |
| Authorization | from the sponsor | from the sponsor |
> Exam trap: both kinds of charter authorize the project, so "provides authorization from the sponsor" does not tell them apart. What makes a charter agile is **shorter, less detail, how rather than what, goals rather than fully-specified scope**.
## Developing an agile charter: W5H
To develop a charter, answer **a subset (or all)** of six questions:
| Question (slide) | MoviesOnline answer |
|---|---|
| **Who** will be engaged? | the sponsor, the licensing lead, a six-person team, the payment vendor, pilot users |
| **What** is this project about? | an online movie-rental and streaming site |
| **Where** will it occur? | the team works in Astana; the pilot is for customers in Kazakhstan |
| **When** will it start and end? | starts on 1 February; the first release in three months |
| **Why** is it being undertaken? | the rental stores are losing customers to streaming services |
| **How** will it be undertaken? | Scrum, two-week sprints, a review with the sponsor every sprint |
> **Project elevator statement:** short descriptions of the **project goals, benefits, and decision attributes** that **quickly describe the project or product** and help stakeholders **explore and cement the project basics**.
It is called an "elevator" statement because it must fit into an elevator ride — about 30 seconds. A popular template (Geoffrey Moore, widely used in agile books; not on the slide) and a MoviesOnline example:
= For [target customer] who [need], the [product] is a [category] that [key benefit]. Unlike [alternative], our product [differentiator].
= For movie fans who hate late fees, MoviesOnline is a streaming service that lets them rent any film from home. Unlike the local rental store, it never charges late fees.
## Definition of "done"
The definition of done is **necessary at every level** of an agile project, including:
| Level (slide) | What "done" may mean for MoviesOnline |
|---|---|
| **User stories** | coded, reviewed, tested, merged and accepted by the product owner |
| **Releases** | all release stories done, regression tests pass, deployed to production, support staff trained |
| **Final project deliverables** | the product is live, documentation handed over, the sponsor has signed the acceptance |
> Slide advice: **make a little progress on every aspect of the goal every day**, rather than reserving the last few days of the sprint for getting the user stories **"done-done."**
"Done-done" means truly finished — not "coded but not tested". A team that codes for eight days and then tries to test, fix and document everything in the last two days builds a mini-waterfall inside the sprint, and problems surface too late. Link to Lecture 7: in Scrum the Definition of Done is a formal description of the state of the Increment when it meets the quality measures required for the product.
## Agile modeling
- The **main value is in the discussion and creation of the model**, rather than the final output.
- Models are **often sketched on whiteboards**.
- They are **lightweight** or **"barely sufficient"** — just enough to understand and decide.
- Agile models can include **use case diagrams**, **data models** and **screen designs**.
**Sample use case diagram (slide image, © Scott Ambler, agilemodeling.com):** a hand sketch with two actors — **Student** and **Registrar** — and three use cases: **Enroll in university**, **Register in a seminar**, **Search for seminars**. Arrows lead from the Student to all three use cases; the Registrar is linked to Register in a seminar and Search for seminars, and a long curved line ties him to Enroll in university as well. Nothing is polished: the sketch is good enough to talk about who does what.
> Exam trap: in agile modeling a photo of the whiteboard may be the only "document" that survives — the value was the conversation. "The main value is a complete, final model" is the wrong answer.
## Wireframes
- A **quick, inexpensive way to get feedback**.
- **Confirms that everyone has a shared understanding of the product.**
- **On software projects, depicts individual screens and flows between screens.**
**Sample wireframe (slide image): "MoviesOnline Basic Ordering Workflow"** — three screens joined by arrows:
| Screen | What the sketch shows |
|---|---|
| 1. Library | header MoviesOnline / Account / Help; tabs Home, New, Recommended and a search box; rows Top 10, Kids and Romance with movie thumbnails |
| 2. Movie details | a preview with a play button; Title, Desc and Actors |
| 3. Playback | the Film area; a pop-up with player controls (back, play, fast-forward, skip), plus Full Screen and Back to Library buttons |
The dashed arrows (from a thumbnail to the details, from the play button to the film) show the **flow** — exactly what a list of requirements cannot show.
## Personas
- **Quick guides of the key project stakeholders and their interests.**
- They **should augment requirements, not replace them**.
- They **help the team prioritize work, stay focused on users, and gain insight into who users will be**.
**Sample persona (slide image): "Bob the Movie Buff"**
| Description | Values |
|---|---|
| Bob loves movies; on average he rents **5 movies a week** from his local rental store | he would like to **order movies from the comfort of his home** |
| his **two children** like to watch the same children's TV shows more than once, so Bob **sometimes has to pay late fees** | he wants to **search for movies by title, actor, genre, and director** and to know **how other viewers rated** a movie |
| **Bob's wife has different movie tastes** and often spends a lot of time choosing a movie | he looks forward to **unlimited movies**, so his children can rewatch shows **without additional fees**; he would appreciate a **"recommended" feature** to help him and his wife choose |
Each value turns into backlog items: search by title, actor, genre and director; viewer ratings; an unlimited plan; recommendations.
> Link to Lecture 8: in the BABOK guide personas are **fictional characters or archetypes** that exemplify the way **typical users interact with a solution**. Lecture 10 (Griffiths) adds the practical rule: a persona **augments** the requirements and never **replaces** them.
?? A sponsor asks for a 60-page charter that lists every screen of MoviesOnline before the project starts. What would an agile coach answer, based on the lecture?
?= Agile charters are shorter, less detailed and focus on how the project will be run and on its goals, not on a fully-specified scope — scope is expected to change. The charter still gives authorization from the sponsor; the screens will be discovered later through wireframes, models and the backlog.
?? A team keeps the last two days of every sprint for "testing and wrapping up". What does the lecture advise instead?
?= Make a little progress on every aspect of the goal every day, rather than reserving the last few days of the sprint for getting the user stories "done-done".
?? Name the six key tools for establishing a shared vision.
?= Agile charters, the definition of done, workshops, modeling, wireframes and personas.
## Exam focus
- Stakeholders: **impacted by or have an impact on** the project; eight listed groups, including the **project manager, the development team, vendors** and the **product's end users**.
- Stewardship **safeguards** stakeholders and gives them what they need to succeed; management **treats people as resources**.
- Five groups and their concerns: executives and sponsors — failure risk from new practices and counterintuitive planning; managers — loss of control, erosion of role; development team — approach forced upon them; user community — not getting the features; other groups — lack of control, continual requests, no clear end point.
- **Respect and courage** are the values shared by Scrum and XP.
- The six principles of stakeholder engagement word for word; the six shared-vision tools; "at the lowest possible cost".
- Agile charter: **first document**; **goal, purpose, composition, approach**; **authorization from the sponsor**; **goals rather than fully-specified scope**; agile = shorter, less detail, **how** rather than **what**.
- W5H — answer **a subset (or all)**; elevator statement = **goals, benefits, decision attributes**.
- Definition of done at three levels: **user stories, releases, final project deliverables**; avoid last-minute "done-done".
- Agile modeling: value in the **discussion**; **barely sufficient**; use case diagrams, data models, screen designs. Wireframes: **screens and flows between screens**. Personas: **augment, not replace** requirements.`,
    ru: `## Кто такие стейкхолдеры?
> **Стейкхолдеры (stakeholders):** любые люди или группы, на которых проект **повлияет (impacted by)** или которые **сами влияют на проект (have an impact on)**.
Определение работает в обе стороны. Группа, которая только *ощущает последствия* (конечные пользователи, которым придётся осваивать новый экран), — стейкхолдер; группа, которая только *влияет* на проект (отдел безопасности, способный остановить релиз), — тоже.
Слайд перечисляет, кто **может входить** в число стейкхолдеров:
| Стейкхолдер (слайд) | Пример в MoviesOnline (онлайн-прокат фильмов — учебный продукт лекции) |
|---|---|
| **Заказчик (Customer)** | компания, которая заказывает и оплачивает новый сайт |
| **Спонсор (Sponsor)** | руководитель, который финансирует проект и утверждает его устав |
| **Представители бизнеса (Business representative(s))** | руководитель отдела лицензирования контента, руководитель маркетинга |
| **Менеджер проекта (Project manager)** | человек, который координирует проект и его стейкхолдеров |
| **Команда разработки (Development team)** | разработчики, тестировщики и дизайнеры, которые делают сайт |
| **Поставщики (Vendors)** | платёжный провайдер, облачный хостинг, внешняя QA-компания |
| **Другие подразделения организации (Others in the organization)** | юристы, информационная безопасность, поддержка клиентов, финансы |
| **Конечные пользователи продукта (Product's end users)** | зрители вроде «Боба-киномана» (Bob the Movie Buff), которые будут брать фильмы напрокат |
> Ловушка экзамена: **менеджер проекта** и **команда разработки** — тоже стейкхолдеры. В вопросе «Which is NOT listed?» предложат что-то вроде «конкуренты» или «широкая публика» — их в списке слайда нет.
## Забота о стейкхолдерах против управления ими (stewardship vs management)
| | Stakeholder stewardship (забота, «попечение») | Stakeholder management (управление) |
|---|---|---|
| Определение слайда | **оберегает (safeguards)** стейкхолдеров проекта и следит, чтобы **у них было всё нужное для успеха** | **относится к людям как к ресурсам (treats people as resources)** |
| Отношение | забота, служение, защита | контроль, распределение, «обработка» людей |
| Подходит к | agile-мышлению и лидерству-служению (servant leadership, лекция 6) | традиционному стилю «приказ и контроль» (command-and-control) |
| Пример в MoviesOnline | команда следит, чтобы руководитель лицензирования получила понятное демо и данные для переговоров с киностудиями | руководителя лицензирования «бронируют» на два часа сбора требований и забывают о ней до релиза |
> Запомнить: **steward** — тот, кто бережёт доверенное ему; **manager** стейкхолдеров переставляет людей, как ресурсы. Agile предпочитает слово **вовлечение (engagement)** — оно в названии лекции — и отношение заботы.
## Как объяснять agile стейкхолдерам (educating stakeholders about agile)
Agile-планирование выглядит странно для тех, кто привык к традиционным проектам: нет полного объёма работ заранее, планы меняются каждую итерацию. Слайд перечисляет **типичные опасения насчёт agile (common concerns about agile)** по группам:
| Группа | Типичное опасение (формулировка слайда) | Как на него ответить (иллюстрация) |
|---|---|---|
| **Руководители и спонсоры (Executives and sponsors)** | **риск провала проекта (risk of project failure)** из-за **новых практик и непривычных, «контринтуитивных» подходов к планированию (new practices and counterintuitive planning approaches)** | показать, что короткие итерации и частые демо рано вскрывают проблемы; начать с пилотного проекта |
| **Менеджеры (Managers)** | боятся **потерять контроль (loss of control)** или того, что **их роль размоется (erosion of their role)**, когда проекты переходят на agile | объяснить их новую роль (убирать препятствия, наставлять, решать вопросы портфеля); сделать ход работ видимым для них |
| **Команда разработки (Development team)** | может **сопротивляться (resist)** agile-методам, если чувствует, что новый подход ей **навязывают (forced upon them)** | вовлечь команду в выбор и настройку практик; проводить ретроспективы |
| **Сообщество пользователей (User community)** | беспокоится, что **не получит нужных или желаемых функций (will not get the features they want or require)** | показать бэклог и приоритеты; самые ценные функции поставлять рано; звать пользователей на обзоры |
| **Другие группы (Other groups)** | кажущееся **отсутствие контроля (lack of control)**, **постоянные просьбы участвовать (continual requests for their involvement)** или **отсутствие ясной точки завершения (lack of a clear end point)** | договориться о предсказуемом ритме участия; показать план релизов и критерии готовности |
> Ловушка экзамена: сопоставляйте группу и опасение. «Потеря контроля / размывание роли» — это **менеджеры**, а не руководители. «Риск провала из-за новых практик и контринтуитивного планирования» — **руководители и спонсоры**. «Навязывают» — **команда разработки**. «Не получим функций» — **сообщество пользователей**. «Нет ясного конца» и «постоянные просьбы участвовать» — **другие группы**.
## Как удерживать вовлечённость стейкхолдеров (keeping stakeholders engaged)
- **Короткие итерации (short iterations)** не дают стейкхолдерам **потерять интерес (losing interest)** к процессу — каждые одну–четыре недели есть что-то новое.
- **Постоянный диалог (ongoing dialogue)** помогает рано выявлять возможные **риски, дефекты и проблемы (risks, defects, and issues)**.
- **Учёт ценностей стейкхолдеров (incorporating stakeholder values):** стремиться **согласовать приоритеты проекта с приоритетами стейкхолдеров (bringing project priorities into alignment with stakeholder priorities)**.
- **Учёт ценностей сообщества (incorporating community values):** две ценности, **общие для Scrum и XP**, — **«уважение» (respect)** и **«смелость» (courage)**.
| Ценности Scrum (лекция 7) | Ценности XP | Общие для обоих |
|---|---|---|
| Commitment, Focus, Openness, **Respect**, **Courage** | Simplicity, Communication, Feedback, **Respect**, **Courage** | **Respect, Courage** |
> Ловушка экзамена: открытость (openness), сосредоточенность (focus) и приверженность (commitment) — ценности только Scrum; простота (simplicity), общение (communication) и обратная связь (feedback) — только XP. Обоим принадлежат лишь **respect и courage**.
## Почему такое внимание к стейкхолдерам? (why the big focus)
Эффективная коммуникация и вовлечение стейкхолдеров **критически важны для проектов интеллектуального труда (knowledge work projects)**, чтобы:
- **члены команды знали, что именно они строят (team members know what they are building)**;
- команда знала, **чего просит заказчик (what the customer is asking for)**.
В интеллектуальном труде (ПО, дизайн, исследования) продукт невидим, пока его не построили, а требования живут в головах людей. Без вовлечённых стейкхолдеров команда может безупречно построить не то.
## Принципы вовлечения стейкхолдеров (principles of stakeholder engagement)
На слайде **шесть принципов** — учите их дословно:
| № | Принцип (слайд) | Что это значит на практике |
|---|---|---|
| 1 | **Get the right stakeholders** — привлечь нужных стейкхолдеров | найти всех, кого затрагивает проект, и убедиться, что у участников есть знания и полномочия решать |
| 2 | **Cement stakeholder involvement** — закрепить участие стейкхолдеров | рано заручиться их обязательством и удерживать их в работе; договориться, кто ходит на обзоры |
| 3 | **Actively manage stakeholder interest** — активно поддерживать интерес | замечать угасание интереса или новые опасения и реагировать (демо, короткие сводки) |
| 4 | **Frequently discuss what "done" looks like** — часто обсуждать, как выглядит «готово» | возвращаться к критериям готовности историй, релизов и продукта |
| 5 | **Show progress and capabilities** — показывать прогресс и возможности | каждую итерацию демонстрировать работающее ПО, а не слайды о нём |
| 6 | **Candidly discuss estimates and projections** — откровенно обсуждать оценки и прогнозы | честно говорить о неопределённости, скорости и прогнозах — в том числе о плохих новостях |
> Запомнить: **Get → Cement → Manage interest → «Done» → Show → Candid**: найти нужных людей, закрепить их участие, удерживать интерес, договориться о «готово», показывать результат, честно говорить о цифрах.
## Общее видение (establishing a shared vision)
> Цель общего видения: **выявить расхождения в понимании с наименьшими возможными затратами (uncover disconnects in understanding at the lowest possible cost).**
Недопонимание, найденное у доски, стоит пять минут; то же недопонимание после релиза стоит спринта переделок и недовольного заказчика. Слайд называет шесть **ключевых инструментов, создающих общее видение у стейкхолдеров (key tools used to establish a shared vision)**:
- **Agile-уставы (agile charters)**
- **Критерии готовности (the definition of done)**
- **Воркшопы (workshops)**
- **Моделирование (modeling)**
- **Вайрфреймы (wireframes)**
- **Персоны (personas)**
Воркшопы разобраны в части 2; остальные пять инструментов — ниже.
## Agile-устав (agile chartering)
> **Agile-устав (agile charter):** **первый документ проекта (first document produced for a project)**, который описывает **цель, назначение, состав и подход (goal, purpose, composition, and approach)** проекта.
- Он **даёт проекту авторизацию от спонсора (provides project authorization from the sponsor)** — устав и есть официальное «поехали».
- Он **признаёт, что объём работ может меняться (acknowledges that scope may change)**, и **сосредоточен на целях проекта, а не на полностью расписанном объёме (goals rather than fully-specified scope)**.
**Agile-уставы и не-agile уставы.** Слайд говорит: agile-уставы обычно **менее детальны, короче (less detail, shorter)** и **сосредоточены на том, как будет вестись проект, а не на том, что именно будет построено (how the project will be run rather than exactly what will be built)**. (Следующий слайд в PDF пустой; традиционный столбец ниже добавлен из общей практики управления проектами.)
| | Agile-устав | Не-agile (традиционный) устав |
|---|---|---|
| Объём и детальность | короче, меньше деталей | длиннее, больше деталей |
| Фокус | **как** будет вестись проект (подход, команда, ритм) и его цели | **что** именно будет построено (объём, результаты) |
| Объём работ (scope) | ожидается, что изменится; цели вместо полностью расписанного объёма | определён заранее; изменения идут через контроль изменений (change control) |
| Авторизация | от спонсора | от спонсора |
> Ловушка экзамена: устав любого вида авторизует проект, поэтому «даёт авторизацию от спонсора» их не различает. Agile-устав отличают **краткость, меньше деталей, «как», а не «что», цели вместо полностью расписанного объёма**.
## Как составить agile-устав: W5H
Чтобы составить устав, отвечают на **часть (или все) (a subset (or all))** из шести вопросов:
| Вопрос (слайд) | Ответ для MoviesOnline |
|---|---|
| **Who** — кто будет вовлечён? | спонсор, руководитель лицензирования, команда из шести человек, платёжный провайдер, пилотные пользователи |
| **What** — о чём этот проект? | сайт онлайн-проката и стриминга фильмов |
| **Where** — где он будет проходить? | команда работает в Астане; пилот — для клиентов в Казахстане |
| **When** — когда начнётся и закончится? | старт 1 февраля; первый релиз через три месяца |
| **Why** — зачем он затевается? | пункты проката теряют клиентов, которые уходят к стриминговым сервисам |
| **How** — как он будет выполняться? | Scrum, двухнедельные спринты, обзор со спонсором каждый спринт |
> **Project elevator statement («питч для лифта»):** короткое описание **целей проекта, выгод и атрибутов для принятия решений (goals, benefits, and decision attributes)**, которое **быстро описывает проект или продукт** и помогает стейкхолдерам **разобраться в основах проекта и закрепить их (explore and cement the project basics)**.
«Для лифта» — потому что он должен уложиться в поездку на лифте, примерно 30 секунд. Популярный шаблон (Джеффри Мур; широко используется в книгах по agile, на слайде его нет) и пример для MoviesOnline:
= For [target customer] who [need], the [product] is a [category] that [key benefit]. Unlike [alternative], our product [differentiator].
= For movie fans who hate late fees, MoviesOnline is a streaming service that lets them rent any film from home. Unlike the local rental store, it never charges late fees.
## Критерии готовности (definition of "done")
Критерии готовности **нужны на каждом уровне (necessary at every level)** agile-проекта, в том числе:
| Уровень (слайд) | Что может значить «готово» в MoviesOnline |
|---|---|
| **Пользовательские истории (user stories)** | код написан, проверен на ревью, протестирован, слит в основную ветку и принят владельцем продукта |
| **Релизы (releases)** | все истории релиза готовы, регрессионные тесты проходят, выкачено в прод, поддержка обучена |
| **Итоговые результаты проекта (final project deliverables)** | продукт работает, документация передана, спонсор подписал приёмку |
> Совет слайда: **каждый день понемногу продвигаться по всем аспектам цели (make a little progress on every aspect of the goal every day)**, а не оставлять последние дни спринта на то, чтобы довести истории до состояния **«done-done»**.
«Done-done» — действительно готово, а не «написано, но не протестировано». Команда, которая восемь дней пишет код, а потом в последние два дня пытается всё протестировать, исправить и задокументировать, строит мини-водопад внутри спринта, и проблемы всплывают слишком поздно. Связь с лекцией 7: в Scrum Definition of Done — формальное описание состояния инкремента, когда он отвечает требованиям качества продукта.
## Agile-моделирование (agile modeling)
- **Главная ценность — в обсуждении и создании модели (discussion and creation of the model)**, а не в итоговом результате.
- Модели **часто рисуют на маркерной доске (often sketched on whiteboards)**.
- Они **лёгкие (lightweight)** или **«едва достаточные» (barely sufficient)** — ровно настолько, чтобы понять и решить.
- Agile-модели могут включать **диаграммы вариантов использования (use case diagrams)**, **модели данных (data models)** и **макеты экранов (screen designs)**.
**Пример диаграммы вариантов использования (картинка слайда, © Scott Ambler, agilemodeling.com):** набросок от руки с двумя актёрами — **Student** и **Registrar** — и тремя вариантами использования: **Enroll in university**, **Register in a seminar**, **Search for seminars**. От студента стрелки ведут ко всем трём вариантам; регистратор связан с Register in a seminar и Search for seminars, а длинная изогнутая линия связывает его и с Enroll in university. Ничего не вылизано: наброска хватает, чтобы обсудить, кто что делает.
> Ловушка экзамена: в agile-моделировании фото доски может оказаться единственным уцелевшим «документом» — ценностью был разговор. «Главная ценность — полная итоговая модель» — неверный ответ.
## Вайрфреймы (wireframes)
- **Быстрый и недорогой способ получить обратную связь (quick, inexpensive way to get feedback)**.
- **Подтверждает, что у всех одинаковое понимание продукта (shared understanding of the product).**
- **В программных проектах изображает отдельные экраны и переходы между ними (individual screens and flows between screens).**
**Пример вайрфрейма (картинка слайда): «MoviesOnline Basic Ordering Workflow»** — три экрана, соединённые стрелками:
| Экран | Что на наброске |
|---|---|
| 1. Библиотека | шапка MoviesOnline / Account / Help; вкладки Home, New, Recommended и строка поиска; ряды Top 10, Kids и Romance с миниатюрами фильмов |
| 2. Карточка фильма | превью с кнопкой воспроизведения; Title, Desc и Actors |
| 3. Просмотр | область Film; всплывающая панель (pop-up) с кнопками плеера (назад, play, перемотка, следующий), а также кнопки Full Screen и Back to Library |
Пунктирные стрелки (от миниатюры к карточке, от кнопки play к фильму) показывают **переходы (flow)** — то, чего не покажет никакой список требований.
## Персоны (personas)
- **Краткие портреты ключевых стейкхолдеров проекта и их интересов (quick guides of the key project stakeholders and their interests).**
- Они **должны дополнять требования, а не заменять их (augment requirements, not replace them)**.
- Они **помогают команде расставлять приоритеты, держать фокус на пользователях и понять, кем будут пользователи (prioritize work, stay focused on users, and gain insight into who users will be)**.
**Пример персоны (картинка слайда): «Bob the Movie Buff» (Боб-киноман)**
| Описание (Description) | Ценности (Values) |
|---|---|
| Боб любит кино; в среднем он берёт **5 фильмов в неделю** в местном пункте проката | он хотел бы **заказывать фильмы, не выходя из дома (from the comfort of his home)** |
| его **двое детей** любят пересматривать одни и те же детские передачи, поэтому Бобу **иногда приходится платить штрафы за просрочку (late fees)** | он хочет **искать фильмы по названию, актёру, жанру и режиссёру** и знать, **как фильм оценили другие зрители** |
| **у жены Боба другие вкусы** — она часто подолгу выбирает фильм | он ждёт **безлимитного доступа (unlimited movies)**, чтобы дети пересматривали передачи **без доплат**; ему пригодилась бы **функция «рекомендуем» (recommended)**, чтобы помочь ему и жене с выбором |
Каждая ценность превращается в элементы бэклога: поиск по названию, актёру, жанру и режиссёру; оценки зрителей; безлимитный тариф; рекомендации.
> Связь с лекцией 8: в руководстве BABOK персоны — это **вымышленные персонажи или архетипы (fictional characters or archetypes)**, показывающие, как **типичные пользователи взаимодействуют с решением**. Лекция 10 (Гриффитс) добавляет практическое правило: персона **дополняет (augments)** требования и никогда их **не заменяет (replaces)**.
?? Спонсор требует до старта проекта 60-страничный устав со списком всех экранов MoviesOnline. Что ответил бы agile-коуч по материалам лекции?
?= Agile-уставы короче, менее детальны и сосредоточены на том, как будет вестись проект, и на его целях, а не на полностью расписанном объёме — объём ожидаемо изменится. Авторизацию от спонсора устав всё равно даёт; экраны же выяснятся позже — через вайрфреймы, модели и бэклог.
?? Команда оставляет последние два дня каждого спринта на «тестирование и доводку». Что советует лекция вместо этого?
?= Каждый день понемногу продвигаться по всем аспектам цели, а не оставлять последние дни спринта на то, чтобы довести истории до «done-done».
?? Назовите шесть ключевых инструментов создания общего видения.
?= Agile-уставы, критерии готовности (definition of done), воркшопы, моделирование, вайрфреймы и персоны.
## Exam focus — что спросят
- Стейкхолдеры: **impacted by or have an impact on** the project; восемь групп в списке, включая **менеджера проекта, команду разработки, поставщиков** и **конечных пользователей продукта**.
- Stewardship **оберегает (safeguards)** стейкхолдеров и даёт им всё нужное для успеха; management **treats people as resources**.
- Пять групп и их опасения: руководители и спонсоры — риск провала из-за новых практик и контринтуитивного планирования; менеджеры — потеря контроля, размывание роли; команда — подход навязан; пользователи — не получат функций; другие группы — нет контроля, постоянные просьбы участвовать, нет ясного конца.
- **Respect и courage** — ценности, общие для Scrum и XP.
- Шесть принципов вовлечения стейкхолдеров дословно; шесть инструментов общего видения; «at the lowest possible cost».
- Agile-устав: **первый документ**; **goal, purpose, composition, approach**; **авторизация от спонсора**; **цели, а не полностью расписанный объём**; agile — короче, меньше деталей, **как**, а не **что**.
- W5H — отвечают на **часть (или все)** вопросы; elevator statement = **goals, benefits, decision attributes**.
- Критерии готовности на трёх уровнях: **user stories, releases, final project deliverables**; никакого «done-done» в последний момент.
- Agile-моделирование: ценность — в **обсуждении**; **barely sufficient**; use case diagrams, data models, screen designs. Вайрфреймы: **экраны и переходы между ними**. Персоны: **дополняют, а не заменяют** требования.`,
  },
  [
    qx("According to the lecture, who are project stakeholders?", "Any people or groups impacted by or having an impact on it", [
      ["Only the people who fund the project and approve its scope", "Funding and approval describe the sponsor; the definition also covers vendors, the team and end users.", "Финансирование и утверждение — это про спонсора; определение охватывает и поставщиков, и команду, и конечных пользователей."],
      ["Only the customer, the sponsor and the product's end users", "The slide's list is wider: it also names the project manager, the development team, vendors and others in the organization.", "Список слайда шире: в нём ещё менеджер проекта, команда разработки, поставщики и другие подразделения."],
      ["Anyone who has signed the contract or the project charter", "Signing a document is not the test; anyone affected by the project or able to affect it is a stakeholder.", "Подпись под документом — не критерий; стейкхолдер — любой, кого проект затрагивает или кто может на него влиять."],
    ], "Slide: stakeholders are any people or groups who will be impacted by or have an impact on the project — the definition works in both directions.", "Слайд: стейкхолдеры — любые люди или группы, на которых проект повлияет или которые влияют на проект; определение работает в обе стороны."),
    qx("Which of the following is NOT listed on the slide as a possible stakeholder?", "Competitors", [
      ["Vendors", "Vendors are on the list (e.g. a payment provider or a hosting company).", "Поставщики (vendors) есть в списке — например, платёжный провайдер или хостинг."],
      ["Project manager", "The project manager is explicitly listed — he or she is affected by the project and affects it.", "Менеджер проекта прямо назван в списке — проект влияет на него, и он влияет на проект."],
      ["Development team", "The development team is listed; a common trap is to forget that the team itself is a stakeholder.", "Команда разработки в списке есть; частая ловушка — забыть, что команда сама является стейкхолдером."],
    ], "The slide lists customer, sponsor, business representatives, project manager, development team, vendors, others in the organization and the product's end users. Competitors are not on it.", "На слайде: заказчик, спонсор, представители бизнеса, менеджер проекта, команда разработки, поставщики, другие подразделения организации и конечные пользователи. Конкурентов там нет."),
    qx("How does stakeholder stewardship differ from stakeholder management?", "Stewardship safeguards stakeholders and gives them what they need", [
      ["Stewardship treats stakeholders as resources to be allocated", "That is the slide's description of stakeholder management, the approach agile avoids.", "Это описание stakeholder management со слайда — подхода, которого agile избегает."],
      ["Stewardship limits stakeholder contact to formal milestone reviews", "Limiting contact is the opposite of engagement; stewardship means looking after stakeholders continuously.", "Ограничение контактов — противоположность вовлечению; забота означает постоянно опекать стейкхолдеров."],
      ["Stewardship hands all stakeholder communication to the sponsor", "Nothing in the lecture moves this work to the sponsor; the whole team engages stakeholders.", "Лекция никуда не передаёт эту работу спонсору; со стейкхолдерами работает вся команда."],
    ], "Slide: stakeholder stewardship safeguards the project stakeholders and makes sure they have everything they need to succeed; stakeholder management treats people as resources.", "Слайд: stakeholder stewardship оберегает стейкхолдеров проекта и следит, чтобы у них было всё нужное для успеха; stakeholder management относится к людям как к ресурсам."),
    qx("A functional manager says: \"If the team plans its own work, what is left for me?\" Which concern from the lecture is this?", "Managers' fear of losing control or of their role eroding", [
      ["Executives' fear of failure due to new planning practices", "Executives and sponsors worry about project failure from new, counterintuitive planning — not about their own role.", "Руководители и спонсоры боятся провала проекта из-за нового контринтуитивного планирования — а не за свою роль."],
      ["The development team's resistance to an approach forced on it", "The speaker is a manager worried about his role, not a team member resisting imposed methods.", "Говорит менеджер, который тревожится за свою роль, а не член команды, сопротивляющийся навязанным методам."],
      ["Other groups' worry about the lack of a clear end point", "\"No clear end point\" is the concern of other groups; this manager is talking about his role.", "«Нет ясного конца» — опасение других групп; этот менеджер говорит о своей роли."],
    ], "Slide: managers may fear a loss of control or erosion of their role when projects assume an agile approach.", "Слайд: менеджеры могут бояться потери контроля или размывания своей роли, когда проекты переходят на agile."),
    qx("According to the slide, what are executives and sponsors typically concerned about?", "Project failure due to new practices and counterintuitive planning", [
      ["Not getting the features they want or require in the final product", "That is the concern of the user community.", "Это опасение сообщества пользователей (user community)."],
      ["Losing control or seeing their role erode under an agile approach", "That is the managers' concern.", "Это опасение менеджеров."],
      ["Having a new working approach forced upon them from above", "That is why the development team may resist agile methods.", "Это причина, по которой может сопротивляться команда разработки."],
    ], "Slide: executives and sponsors may have concern about the risk of project failure due to the use of new practices and counterintuitive planning approaches.", "Слайд: руководители и спонсоры могут опасаться риска провала проекта из-за новых практик и контринтуитивных подходов к планированию."),
    qx("Which two values does the lecture name as shared by Scrum and XP?", "Respect and courage", [
      ["Openness and focus", "Openness and focus are Scrum values only; XP does not list them.", "Открытость и сосредоточенность — ценности только Scrum; в XP их нет."],
      ["Simplicity and feedback", "Simplicity and feedback are XP values; Scrum's five values do not include them.", "Простота и обратная связь — ценности XP; в пяти ценностях Scrum их нет."],
      ["Commitment and communication", "Commitment is a Scrum value and communication an XP value — neither is shared.", "Приверженность — ценность Scrum, общение — ценность XP; ни одна не общая."],
    ], "Incorporating community values: the two values that are shared by Scrum and XP are \"respect\" and \"courage\".", "Учёт ценностей сообщества: две ценности, общие для Scrum и XP, — «respect» и «courage»."),
    qx("According to the slide on keeping stakeholders engaged, what do short iterations do?", "Prevent stakeholders from losing interest in the process", [
      ["Remove the need for an ongoing dialogue with stakeholders", "The same slide says ongoing dialogue is needed — it helps identify risks, defects and issues.", "Тот же слайд говорит, что постоянный диалог нужен — он помогает выявлять риски, дефекты и проблемы."],
      ["Let stakeholders skip the reviews at the end of each sprint", "Short iterations give stakeholders more to look at, not a reason to stay away.", "Короткие итерации дают стейкхолдерам больше поводов посмотреть результат, а не повод не приходить."],
      ["Fix the release scope so that stakeholders cannot change it", "Agile expects scope to change; short iterations make change cheaper, not forbidden.", "Agile ожидает изменения объёма; короткие итерации делают изменения дешевле, а не запрещают их."],
    ], "Slide: short iterations prevent stakeholders from losing interest in the process; ongoing dialogue helps identify potential risks, defects and issues.", "Слайд: короткие итерации не дают стейкхолдерам потерять интерес к процессу; постоянный диалог помогает выявлять риски, дефекты и проблемы."),
    qx("Which of the following is NOT one of the principles of stakeholder engagement?", "Limit contact to protect the team's focus", [
      ["Cement stakeholder involvement", "This is principle 2 on the slide.", "Это второй принцип на слайде."],
      ["Candidly discuss estimates and projections", "This is principle 6 on the slide.", "Это шестой принцип на слайде."],
      ["Show progress and capabilities", "This is principle 5 on the slide.", "Это пятый принцип на слайде."],
    ], "The six principles: get the right stakeholders; cement stakeholder involvement; actively manage stakeholder interest; frequently discuss what \"done\" looks like; show progress and capabilities; candidly discuss estimates and projections. Limiting contact is the opposite of engagement.", "Шесть принципов: get the right stakeholders; cement stakeholder involvement; actively manage stakeholder interest; frequently discuss what “done” looks like; show progress and capabilities; candidly discuss estimates and projections. Ограничивать контакты — противоположность вовлечению."),
    qx("Velocity has dropped for three sprints, but the project manager keeps showing the sponsor the original release date. Which principle is being violated?", "Candidly discuss estimates and projections", [
      ["Get the right stakeholders", "The sponsor is the right stakeholder; the problem is what he is being told.", "Спонсор — как раз нужный стейкхолдер; проблема в том, что ему говорят."],
      ["Cement stakeholder involvement", "The sponsor is involved; he is just receiving an over-optimistic forecast.", "Спонсор вовлечён; просто он получает слишком оптимистичный прогноз."],
      ["Frequently discuss what “done” looks like", "The issue is the honesty of the forecast, not the definition of done.", "Проблема — в честности прогноза, а не в критериях готовности."],
    ], "Hiding a slipping forecast breaks \"candidly discuss estimates and projections\": stakeholders must hear honest numbers, including bad news.", "Скрывать сползающий прогноз — нарушение принципа «candidly discuss estimates and projections»: стейкхолдеры должны слышать честные цифры, включая плохие новости."),
    qx("What is the purpose of establishing a shared vision, according to the slide?", "Uncover disconnects in understanding at the lowest possible cost", [
      ["Fix the full scope of the product before any development work starts", "Agile charters explicitly accept that scope may change; a shared vision is not a frozen scope.", "Agile-устав прямо признаёт, что объём может меняться; общее видение — не замороженный объём."],
      ["Obtain formal project authorization from the sponsor", "Authorization is what the agile charter provides — one of the tools, not the purpose of a shared vision.", "Авторизацию даёт agile-устав — один из инструментов, а не цель общего видения."],
      ["Align each team member's individual performance goals", "The lecture talks about a common understanding among stakeholders, not individual goals.", "Лекция говорит об общем понимании у стейкхолдеров, а не об индивидуальных целях."],
    ], "Slide: establishing a shared vision means uncovering disconnects in understanding at the lowest possible cost — on a whiteboard rather than after release.", "Слайд: создавать общее видение — значит выявлять расхождения в понимании с наименьшими затратами: у доски, а не после релиза."),
    qx("Which of the following is NOT one of the key tools for establishing a shared vision?", "Earned value analysis", [
      ["Wireframes", "Wireframes are one of the six tools on the slide.", "Вайрфреймы — один из шести инструментов на слайде."],
      ["Personas", "Personas are one of the six tools on the slide.", "Персоны — один из шести инструментов на слайде."],
      ["The definition of done", "The definition of done is one of the six tools on the slide.", "Критерии готовности — один из шести инструментов на слайде."],
    ], "The six tools are agile charters, the definition of done, workshops, modeling, wireframes and personas. Earned value analysis measures cost and schedule performance; it does not build a shared vision.", "Шесть инструментов: agile-уставы, критерии готовности, воркшопы, моделирование, вайрфреймы и персоны. Анализ освоенного объёма измеряет выполнение по стоимости и срокам и общего видения не создаёт."),
    qx("Which description of an agile charter matches the slide?", "The first project document: goal, purpose, composition, approach", [
      ["A complete, signed specification of every feature to be built later", "Agile charters focus on goals rather than a fully-specified scope.", "Agile-устав сосредоточен на целях, а не на полностью расписанном объёме."],
      ["A contract that freezes the scope, budget and schedule", "The agile charter acknowledges that scope may change; it does not freeze it.", "Agile-устав признаёт, что объём может меняться, и не замораживает его."],
      ["A summary report produced at the end of each iteration", "The charter is produced first, at the start of the project, not every iteration.", "Устав создаётся первым, в начале проекта, а не каждую итерацию."],
    ], "Slide: the agile charter is the first document produced for a project that describes the goal, purpose, composition and approach of the project; it provides authorization from the sponsor.", "Слайд: agile-устав — первый документ проекта, описывающий его цель, назначение, состав и подход; он даёт авторизацию от спонсора."),
    qx("How do agile charters typically differ from non-agile charters?", "They are shorter and focus on how the project will be run", [
      ["They are longer, because they must describe every iteration", "The slide says the opposite: agile charters are shorter and have less detail.", "Слайд говорит обратное: agile-уставы короче и менее детальны."],
      ["They focus on exactly what will be built in each release", "\"Exactly what will be built\" is the focus agile charters avoid.", "«Что именно будет построено» — как раз то, на чём agile-устав не сосредоточен."],
      ["They do not need any authorization from the project sponsor", "The agile charter provides project authorization from the sponsor.", "Agile-устав как раз даёт авторизацию от спонсора."],
    ], "Slide: agile charters typically have less detail, are shorter, and focus on how the project will be run rather than exactly what will be built.", "Слайд: agile-уставы обычно менее детальны, короче и сосредоточены на том, как будет вестись проект, а не на том, что именно будет построено."),
    qx("When developing an agile charter, which question is NOT among the W5H questions on the slide?", "How much will it cost?", [
      ["Who will be engaged?", "\"Who will be engaged?\" is the first question on the slide.", "«Who will be engaged?» — первый вопрос на слайде."],
      ["Where will it occur?", "\"Where will it occur?\" is on the slide.", "«Where will it occur?» есть на слайде."],
      ["When will it start and end?", "\"When will it start and end?\" is on the slide.", "«When will it start and end?» есть на слайде."],
    ], "The slide lists who will be engaged, what the project is about, where it will occur, when it will start and end, why it is undertaken and how it will be undertaken — answer a subset or all of them. Cost is not one of them.", "На слайде: кто будет вовлечён, о чём проект, где он пройдёт, когда начнётся и закончится, зачем и как он будет выполняться — отвечают на часть или на все. Стоимости среди них нет."),
    qx("What is a project elevator statement?", "A short description of goals, benefits and decision attributes", [
      ["A one-page list of all the user stories sorted in priority order", "That would be a prioritized backlog, not a quick description of the project.", "Это был бы приоритизированный бэклог, а не быстрое описание проекта."],
      ["The sponsor's signed approval of the project budget", "Authorization comes from the charter; the elevator statement only describes the project quickly.", "Авторизацию даёт устав; elevator statement лишь быстро описывает проект."],
      ["A status update sent weekly to the steering committee", "A status report tracks progress; the elevator statement explains what the project is and why.", "Отчёт о статусе отслеживает ход работ; elevator statement объясняет, что за проект и зачем."],
    ], "Slide: short descriptions of the project goals, benefits and decision attributes that quickly describe the project or product and help stakeholders explore and cement the project basics.", "Слайд: короткие описания целей проекта, выгод и атрибутов для решений, которые быстро описывают проект или продукт и помогают стейкхолдерам разобраться в основах проекта и закрепить их."),
    qx("At which levels does the lecture say a definition of done is necessary?", "User stories, releases and final project deliverables", [
      ["Only the user stories accepted at the end-of-sprint review", "The slide says \"at every level\", not only at the story level.", "Слайд говорит «на каждом уровне», а не только для историй."],
      ["Tasks, the sprint backlog and the product vision", "These are not the levels named on the slide.", "Это не те уровни, которые названы на слайде."],
      ["Only the final deliverables accepted by the sponsor", "Final deliverables are one level of three, not the only one.", "Итоговые результаты — один уровень из трёх, а не единственный."],
    ], "Slide: the definition of \"done\" is necessary at every level of an agile project, including user stories, releases and final project deliverables.", "Слайд: критерии готовности нужны на каждом уровне agile-проекта, в том числе для историй, релизов и итоговых результатов проекта."),
    qx("A team writes code for eight days and keeps the last two days of each sprint for testing. What does the lecture recommend?", "Make a little progress on every aspect of the goal every day", [
      ["Extend the sprint by a few days whenever testing is not finished", "Sprints are timeboxed; stretching them hides the problem instead of fixing it.", "Спринты ограничены по времени; растягивать их — прятать проблему, а не решать её."],
      ["Move all testing into a separate hardening sprint", "That turns testing into a late phase — exactly the last-minute \"done-done\" the slide warns about.", "Это превращает тестирование в позднюю фазу — тот самый «done-done» в последний момент, от которого предостерегает слайд."],
      ["Relax the definition of done for the last few stories", "Lowering quality to meet the date breaks the definition of done instead of meeting it.", "Снижать качество ради срока — нарушать критерии готовности, а не выполнять их."],
    ], "Slide: make a little progress on every aspect of the goal every day, rather than reserving the last few days of the sprint for getting the user stories \"done-done\".", "Слайд: каждый день понемногу продвигаться по всем аспектам цели, а не оставлять последние дни спринта на доведение историй до «done-done»."),
    qx("Where does the lecture say the main value of agile modeling lies?", "In the discussion and creation of the model", [
      ["In the completeness of the final diagram", "Agile models are lightweight, \"barely sufficient\" — completeness is not the goal.", "Agile-модели лёгкие, «едва достаточные» — полнота не цель."],
      ["In using a formal, standard modeling notation", "Agile models are often whiteboard sketches; formality is not where the value is.", "Agile-модели — часто наброски на доске; ценность не в формальности."],
      ["In archiving the models for future maintenance", "The final output matters less than the conversation that created it.", "Итоговый результат важен меньше, чем разговор, в котором он появился."],
    ], "Slide: the main value is in the discussion and creation of the model, rather than the final output; models are often sketched on whiteboards and are barely sufficient.", "Слайд: главная ценность — в обсуждении и создании модели, а не в итоговом результате; модели часто рисуют на доске, и они «едва достаточные»."),
    qx("On software projects, what does a wireframe depict?", "Individual screens and the flows between screens", [
      ["The tables, keys and relationships of the database", "That is a data model, another kind of agile model.", "Это модель данных — другой вид agile-модели."],
      ["The actors of the system and their use cases", "That is a use case diagram, like the Student/Registrar sketch.", "Это диаграмма вариантов использования, как набросок со Student и Registrar."],
      ["The key stakeholders and their main interests", "That describes personas — quick guides of key stakeholders and their interests.", "Это описание персон — кратких портретов ключевых стейкхолдеров и их интересов."],
    ], "Slide: wireframes are a quick, inexpensive way to get feedback, confirm a shared understanding, and on software projects depict individual screens and flows between screens.", "Слайд: вайрфреймы — быстрый и недорогой способ получить обратную связь и подтвердить общее понимание; в ПО они изображают отдельные экраны и переходы между ними."),
    tfx("Personas can replace the detailed requirements, because they already describe what the users want.", false,
      "False. The slide says personas should augment requirements, not replace them; they help the team prioritize work, stay focused on users and gain insight into who the users will be.",
      "Неверно. Слайд говорит, что персоны должны дополнять требования, а не заменять их; они помогают расставлять приоритеты, держать фокус на пользователях и понять, кем будут пользователи.",
      "\"True\" contradicts the slide's explicit rule \"augment requirements, not replace them\".",
      "«Верно» противоречит прямому правилу слайда «augment requirements, not replace them»."),
  ],
);

const p2 = part(
  "pm-l10-p2",
  { en: "Communicating and working collaboratively", ru: "Коммуникация и совместная работа" },
  {
    en: `## Communicating with stakeholders
- **Communicate frequently** to ensure everyone is **on the same page and kept up to date**.
- **Many project failures can be traced back to failure of communication.**
- The slide names five **fundamental concepts of agile communication**:
| Concept | Core idea | MoviesOnline example |
|---|---|---|
| **Face-to-face** | highest bandwidth; questions and answers in real time | the product owner and two developers sketch the checkout page at the whiteboard |
| **Two-way communication** | information flows in both directions | developers warn the sponsor that the payment API limits the number of requests |
| **Knowledge sharing** | information is available to everyone who wants it | the sprint demo is open to support and marketing |
| **Information radiators** | highly visible displays of information | a big monitor with the burnup chart in the team room |
| **Social media** | tools that keep remote people up to date | a team channel in a chat tool for quick updates |
> Memory hook: **F-T-K-I-S** — Face-to-face, Two-way, Knowledge sharing, Information radiators, Social media.
## Face-to-face communication
- **Highest bandwidth of all communication forms** — words, tone, gestures and drawings at the same time.
- **Provides opportunities for interactivity in real time.**
- **Participants can ask questions and get immediate feedback.**
This matches the Agile Manifesto principle from Lecture 6: "The most efficient and effective method of conveying information to and within a development team is face-to-face conversation."
## Effectiveness of different communication channels
The slide shows a chart by **Alistair Cockburn** (redrawn in Griffiths' book):
@diagram pm10-comm-channels
- **Horizontal axis — Richness/Temperature**, from **(cold)** on the left to **(hot)** on the right: how much information a channel carries (words, voice, face, gestures, a shared drawing).
- **Vertical axis — Effectiveness** of the communication.
- **Two curves.** The black curve is **"No question and answer capability"**: Paper → Audio recording → Video recording. The green curve is **"Question and answer capability"**: E-mail → Instant messaging → Phone → **Face-to-face at whiteboard**.
| Channel (cold → hot) | Can the listener ask questions? | Where it is on the chart |
|---|---|---|
| Paper | no | black curve — the coldest, least effective point |
| E-mail | yes, but slowly | green curve — its starting point |
| Audio recording | no | black curve |
| Video recording | no | black curve — its last point |
| Instant messaging | yes | green curve |
| Phone | yes, with voice and tone | green curve |
| **Face-to-face at whiteboard** | yes, with voice, face and a shared drawing | green curve — the hottest and most effective point |
How to read it: the warmer (richer) the channel, the more effective it is, and the top right corner — **two people talking at a whiteboard** — beats everything. The black curve rises steeply and crosses the green one: a video carries more than a cold e-mail, but a recording can never answer a question, so the black curve ends while the green one keeps rising.
> Exam trap: the most effective channel on the chart is **face-to-face at a whiteboard** — not "video recording" (rich but one-way) and not "phone" (interactive but without the face and the shared drawing). Paper is the coldest and least effective.
## Two-way communication
- **Ensure that information flows between stakeholders are bi-directional.**
- **Team members may have valuable information that cannot be accessed any other way.**
**Example:** the sponsor sends requirements down and only expects status reports back. One developer knows that the streaming vendor charges per minute of video — a fact that could change the business case. In a one-way flow nobody asks him; in a two-way flow it comes out at the next review.
## Knowledge sharing
- **Information (i.e., knowledge) is the basic commodity of agile projects.**
- **Make information available to everyone who wants to consume it.**
- It **allows for more people to help when things get stuck**.
- It **balances workload between team members**.
**Agile practices that promote knowledge sharing** (examples on the slide): **product demonstrations, Kanban boards, information radiators, personas, wireframes**.
**How to encourage knowledge sharing:**
- **Organization culture** should **encourage and reward the discovery, innovation, and transfer of information**.
- **Base tracking and rewards on team accomplishments rather than individual accomplishments**, so there are **no benefits to hoarding information**.
> Exam trap: a bonus for "the developer who closed the most tickets" rewards individual results — it makes hoarding knowledge profitable. The slide's answer is **team-based** tracking and rewards.
## Information radiators
> **Information radiators:** **highly visible displays of information** (Cockburn's term) — big charts, boards or screens placed where everyone passes by.
Data displayed on an information radiator **can include** (eight items on the slide):
- **Features delivered to date vs. the features remaining to be delivered**
- **Who is working on what**
- **Features selected for the current iteration**
- **Velocity and defect metrics**
- **Retrospective findings**
- **List of threats and issues**
- **Story maps**
- **Burn charts** (burndown and burnup)
An information radiator "radiates" information without anyone having to ask: a stakeholder walking past the team room sees the burnup chart and the open issues without requesting a report.
> Exam trap: a status report e-mailed once a month or a spreadsheet hidden in the manager's folder is **not** an information radiator — the key words are **highly visible**.
## Social media
- **Enable more team members to work remotely while keeping up with project changes and developments.**
- **Some business domains may be too sensitive or confidential for social media tools.**
**Example:** a MoviesOnline channel in a team chat lets a developer working from Almaty follow the decisions made in Astana. A team building software for a defense ministry or a bank's anti-fraud system may be forbidden to use such tools.
## Working collaboratively
**Benefits of collaboration** (five on the slide):
- **Generates wiser decisions**
- **Promotes problem solving**
- **Fosters action**
- **Builds social capital**
- **Fosters ownership of collective problems**
## Green zone / red zone
The slide's table (from Jim Tamm's "Radical Collaboration", quoted by Griffiths) contrasts two states of mind in collaboration:
| A person in the green zone… | A person in the red zone… |
|---|---|
| **takes responsibility** for the circumstances of his or her life | **blames others** for the circumstances of their life |
| **seeks to respond non-defensively** | **responds defensively** |
| **is not easily threatened psychologically** | **feels threatened or wronged** |
| **attempts to build mutual success** | **triggers defensiveness in others** |
**Code review example.** A reviewer writes: "This query will be slow on big tables." A developer in the **green zone** answers: "Good catch — let's measure it and add an index." A developer in the **red zone** answers: "It worked on my machine, the tester's data is wrong" — he blames others, defends himself and makes the reviewer defensive too.
> Exam trap: learn the pairs. "Blames others", "responds defensively", "feels threatened or wronged" and "triggers defensiveness in others" are **red**; "takes responsibility", "non-defensive", "not easily threatened" and "builds mutual success" are **green**.
## Workshops
> **Workshops:** **meetings in which participants get work done** — not meetings where information is only announced.
**Tips to make workshops effective:**
- **Add diverse voices** to facilitate valuable new ideas and solutions.
- **Use a round-robin style or generate ideas on sticky notes** to **prevent dominant individuals and extroverts from taking over**.
- **Start with an activity that gets everyone participating.**
## User story workshops
- The **preferred method for gathering candidate user stories and refining them into well-formed stories**.
- **People are more likely to overstate wishes and gold-plate requirements if their peers aren't present** — in a group, colleagues keep each other realistic.
- They **engage the key stakeholders in the design process**.
**Example:** alone with the analyst, the marketing lead asks for "personal AI recommendations in five languages". In a workshop with support, finance and the team she hears the cost, and the story becomes "show the top 10 films in the viewer's favourite genre".
## Brainstorming
> **Brainstorming:** a **collaborative technique** in which a group tries to **rapidly generate a lot of ideas** about a problem or issue. The **goal is to maximize the number of suggestions generated** — judging comes later.
**The team might brainstorm:**
- **product roles to feature in personas**;
- **features to include in the minimal viable product for a release**;
- **potential risks that could impact the project**;
- **solutions to a problem raised in a retrospective**.
## Brainstorming methods
| Method | How it works (slide) | Strength and risk |
|---|---|---|
| **Quiet writing** | participants are given **five to seven minutes** to generate a list of ideas **individually** before the group gathers to share | introverts get equal time; nobody is anchored by the first loud idea |
| **Round-robin** | people suggest an idea **when a token that is passed around the group reaches them** | everyone gets a turn in order; dominant people cannot take over |
| **Free-for-all** | people **just shout out their ideas spontaneously** | fast and energetic, but extroverts and senior people can dominate |
> Exam trap: "Which method gives every participant time to think alone first?" → **quiet writing (5–7 minutes)**. "Which method uses a token?" → **round-robin**. The workshop tip against dominant individuals and extroverts names **round-robin** or **sticky notes** — never free-for-all.
## Collaboration games
> **Collaboration games:** **facilitated workshop techniques** that give agile stakeholders a **better understanding of complex issues**.
| Game | Purpose (slide) | How it is played (beyond the slides; the first four come from Luke Hohmann's Innovation Games) |
|---|---|---|
| **Remember the Future** | **vision-setting and requirements-elicitation** exercise | participants imagine that the release is over and has been a success, then write down, looking back, what the system did |
| **Prune the Product Tree** | helps stakeholders **gather and shape requirements** | a big tree is drawn: the trunk is the core product, the branches are product areas; stakeholders stick features on it as leaves where they want the product to grow |
| **Speedboat (aka Sailboat)** | goal is to **identify threats and opportunities (risks)** for the project | a boat is drawn; anchors are what slows the project down (threats); in the sailboat version the wind is what pushes it forward (opportunities) and rocks ahead are risks |
| **Buy a Feature** | **prioritization** exercise | stakeholders get a limited amount of play money and features have prices; people buy features and must pool their money for the expensive ones |
| **Bang-for-the-Buck** | looks at **value versus cost** rankings | the team estimates each feature's cost, the business rates its value; high value at low cost goes first |
> Memory hook: **Future** = vision; **Tree** = shape requirements; **Boat** = risks; **Buy** = prioritize; **Bang/Buck** = value vs cost.
?? A sponsor wants to replace the daily whiteboard talk with a recorded weekly video "because video is rich". What does the communication-channels chart say?
?= A video recording is rich but has no question-and-answer capability, so it sits on the lower curve. Face-to-face at a whiteboard is both the hottest and the most effective channel, because people can ask questions and get immediate feedback.
?? In a workshop the senior architect talks over everyone. Which two techniques from the lecture prevent this?
?= A round-robin style (a token passed around the group) or generating ideas on sticky notes, as in quiet writing — both stop dominant individuals and extroverts from taking over.
?? The team wants to find out what could sink the release. Which collaboration game fits best?
?= Speedboat (aka Sailboat) — its goal is to identify threats and opportunities (risks) for the project.
## Exam focus
- Five fundamental concepts of agile communication: **face-to-face, two-way communication, knowledge sharing, information radiators, social media**.
- Face-to-face: **highest bandwidth**, real-time interactivity, immediate feedback. Chart axes: **Richness/Temperature (cold → hot)** and **Effectiveness**; the top point is **face-to-face at whiteboard**; recordings have **no question-and-answer capability**.
- Two-way: **bi-directional** flows; the team may hold information that **cannot be accessed any other way**.
- Knowledge sharing: four points; promoted by **demos, Kanban boards, information radiators, personas, wireframes**; rewards on **team** accomplishments, so there is no benefit to **hoarding information**.
- Information radiators: **highly visible displays of information**; the eight kinds of data.
- Social media: remote work; some domains are **too sensitive or confidential**.
- Five benefits of collaboration; the four green zone / red zone pairs.
- Workshops: **meetings in which participants get work done**; three tips. User story workshops: peers prevent **overstated wishes and gold-plating**.
- Brainstorming goal: **maximize the number of suggestions**; quiet writing **5–7 minutes**, round-robin **token**, free-for-all **shout out spontaneously**.
- Collaboration games: Remember the Future — vision and elicitation; Prune the Product Tree — gather and shape requirements; Speedboat — risks; Buy a Feature — prioritization; Bang-for-the-Buck — value vs cost.`,
    ru: `## Коммуникация со стейкхолдерами (communicating with stakeholders)
- **Общаться часто (communicate frequently)**, чтобы все **понимали одно и то же и были в курсе (on the same page and kept up to date)**.
- **Многие провалы проектов восходят к провалу коммуникации (failure of communication).**
- Слайд называет пять **основных понятий agile-коммуникации (fundamental concepts of agile communication)**:
| Понятие | Суть | Пример в MoviesOnline |
|---|---|---|
| **Лицом к лицу (face-to-face)** | самая широкая полоса; вопросы и ответы в реальном времени | владелец продукта и два разработчика рисуют страницу оплаты у доски |
| **Двусторонняя коммуникация (two-way communication)** | информация идёт в обе стороны | разработчики предупреждают спонсора, что платёжный API ограничивает число запросов |
| **Обмен знаниями (knowledge sharing)** | информация доступна всем, кому она нужна | демо спринта открыто для поддержки и маркетинга |
| **Информационные радиаторы (information radiators)** | хорошо заметные отображения информации | большой монитор с burnup-диаграммой в комнате команды |
| **Социальные медиа (social media)** | инструменты, которые держат удалённых людей в курсе | командный канал в мессенджере для коротких новостей |
> Запомнить: **F-T-K-I-S** — Face-to-face, Two-way, Knowledge sharing, Information radiators, Social media.
## Общение лицом к лицу (face-to-face communication)
- **Самая широкая полоса пропускания из всех форм общения (highest bandwidth of all communication forms)** — слова, тон, жесты и рисунки одновременно.
- **Даёт возможность взаимодействовать в реальном времени (interactivity in real time).**
- **Участники могут задавать вопросы и сразу получать обратную связь (immediate feedback).**
Это совпадает с принципом Agile-манифеста из лекции 6: «Самый эффективный и действенный способ передать информацию команде разработки и внутри неё — разговор лицом к лицу».
## Эффективность разных каналов коммуникации (effectiveness of different communication channels)
На слайде — график **Алистера Кокберна (Alistair Cockburn)**, перерисованный в книге Гриффитса:
@diagram pm10-comm-channels
- **Горизонтальная ось — насыщенность/«температура» (Richness/Temperature)**, от **холодного (cold)** слева до **горячего (hot)** справа: сколько информации несёт канал (слова, голос, лицо, жесты, общий рисунок).
- **Вертикальная ось — эффективность (Effectiveness)** коммуникации.
- **Две кривые.** Чёрная — **«без возможности задать вопрос и получить ответ» (No question and answer capability)**: Paper → Audio recording → Video recording. Зелёная — **«с возможностью вопросов и ответов» (Question and answer capability)**: E-mail → Instant messaging → Phone → **Face-to-face at whiteboard**.
| Канал (от холодного к горячему) | Может ли слушатель задать вопрос? | Где на графике |
|---|---|---|
| Бумага (paper) | нет | чёрная кривая — самая холодная и наименее эффективная точка |
| Электронная почта (e-mail) | да, но медленно | зелёная кривая — её начало |
| Аудиозапись (audio recording) | нет | чёрная кривая |
| Видеозапись (video recording) | нет | чёрная кривая — её последняя точка |
| Мессенджер (instant messaging) | да | зелёная кривая |
| Телефон (phone) | да, с голосом и интонацией | зелёная кривая |
| **Лицом к лицу у доски (face-to-face at whiteboard)** | да, с голосом, лицом и общим рисунком | зелёная кривая — самая горячая и самая эффективная точка |
Как читать: чем «теплее» (насыщеннее) канал, тем он эффективнее, а правый верхний угол — **двое разговаривают у доски** — лучше всего остального. Чёрная кривая круто идёт вверх и пересекает зелёную: видео несёт больше, чем холодное письмо, но запись никогда не ответит на вопрос, поэтому чёрная кривая обрывается, а зелёная продолжает расти.
> Ловушка экзамена: самый эффективный канал на графике — **лицом к лицу у доски**, а не «видеозапись» (насыщенная, но односторонняя) и не «телефон» (интерактивный, но без лица и общего рисунка). Бумага — самый холодный и наименее эффективный канал.
## Двусторонняя коммуникация (two-way communication)
- **Следить, чтобы информационные потоки между стейкхолдерами были двунаправленными (bi-directional).**
- **У членов команды может быть ценная информация, которую нельзя получить никаким другим путём.**
**Пример:** спонсор спускает требования вниз и ждёт в ответ только отчётов о статусе. Один разработчик знает, что стриминговый поставщик берёт плату за каждую минуту видео, — а это может изменить экономику проекта. При одностороннем потоке его никто не спросит; при двустороннем это всплывёт на ближайшем обзоре.
## Обмен знаниями (knowledge sharing)
- **Информация (то есть знание) — основной «товар» (basic commodity) agile-проектов.**
- **Делать информацию доступной каждому, кто хочет ею воспользоваться.**
- Это **позволяет большему числу людей помочь, когда работа застряла**.
- Это **выравнивает нагрузку между членами команды (balances workload)**.
**Agile-практики, которые поддерживают обмен знаниями** (примеры слайда): **демонстрации продукта (product demonstrations), Kanban-доски, информационные радиаторы, персоны, вайрфреймы**.
**Как поощрять обмен знаниями:**
- **Культура организации** должна **поощрять и вознаграждать открытие, инновации и передачу информации (discovery, innovation, and transfer of information)**.
- **Учитывать и вознаграждать достижения команды, а не отдельных людей (team accomplishments rather than individual)** — тогда **копить информацию у себя (hoarding information) невыгодно**.
> Ловушка экзамена: премия «разработчику, закрывшему больше всех задач», награждает личный результат — и делает выгодным придерживать знания. Ответ слайда — учёт и награды **по командному** результату.
## Информационные радиаторы (information radiators)
> **Информационные радиаторы:** **хорошо заметные отображения информации (highly visible displays of information)** — термин Кокберна: большие графики, доски или экраны там, где все проходят мимо.
На информационном радиаторе **могут быть** (восемь пунктов слайда):
- **Функции, поставленные на сегодня, против функций, которые ещё предстоит поставить (features delivered to date vs. remaining)**
- **Кто над чем работает (who is working on what)**
- **Функции, выбранные на текущую итерацию (features selected for the current iteration)**
- **Скорость и метрики дефектов (velocity and defect metrics)**
- **Выводы ретроспектив (retrospective findings)**
- **Список угроз и проблем (list of threats and issues)**
- **Карты историй (story maps)**
- **Burn-диаграммы (burn charts)** (burndown и burnup)
Радиатор «излучает» информацию, и никому не нужно о ней просить: стейкхолдер, проходя мимо комнаты команды, видит burnup-диаграмму и открытые проблемы без всякого запроса отчёта.
> Ловушка экзамена: отчёт о статусе раз в месяц по почте или таблица в личной папке менеджера — **не** информационный радиатор; ключевые слова — **highly visible**.
## Социальные медиа (social media)
- **Позволяют большему числу членов команды работать удалённо и при этом следить за изменениями и новостями проекта.**
- **Некоторые предметные области (business domains) слишком чувствительны или конфиденциальны для социальных медиа.**
**Пример:** канал MoviesOnline в командном мессенджере позволяет разработчику из Алматы следить за решениями, принятыми в Астане. Команде, которая делает ПО для министерства обороны или антифрод-системы банка, такие инструменты могут запретить.
## Совместная работа (working collaboratively)
**Выгоды сотрудничества (benefits of collaboration)** — пять на слайде:
- **Рождает более мудрые решения (generates wiser decisions)**
- **Способствует решению проблем (promotes problem solving)**
- **Побуждает к действию (fosters action)**
- **Создаёт социальный капитал (builds social capital)**
- **Развивает чувство общей ответственности за общие проблемы (fosters ownership of collective problems)**
## Зелёная зона / красная зона (green zone / red zone)
Таблица слайда (из книги Джима Тамма «Radical Collaboration», которую цитирует Гриффитс) противопоставляет два состояния человека в совместной работе:
| Человек в зелёной зоне… | Человек в красной зоне… |
|---|---|
| **берёт ответственность (takes responsibility)** за обстоятельства своей жизни | **обвиняет других (blames others)** в обстоятельствах своей жизни |
| **старается реагировать без защитной реакции (seeks to respond non-defensively)** | **реагирует защитно (responds defensively)** |
| **психологически его нелегко задеть (not easily threatened psychologically)** | **чувствует угрозу или обиду (feels threatened or wronged)** |
| **стремится к взаимному успеху (attempts to build mutual success)** | **вызывает защитную реакцию у других (triggers defensiveness in others)** |
**Пример с код-ревью.** Ревьюер пишет: «Этот запрос будет медленным на больших таблицах». Разработчик в **зелёной зоне** отвечает: «Хорошо подмечено — давай замерим и добавим индекс». Разработчик в **красной зоне** отвечает: «У меня всё работало, это у тестировщика данные неправильные» — он обвиняет других, защищается и заставляет защищаться и ревьюера.
> Ловушка экзамена: учите пары. «Обвиняет других», «реагирует защитно», «чувствует угрозу или обиду» и «вызывает защитную реакцию у других» — это **красная** зона; «берёт ответственность», «без защитной реакции», «нелегко задеть» и «взаимный успех» — **зелёная**.
## Воркшопы (workshops)
> **Воркшопы:** **встречи, на которых участники делают работу (meetings in which participants get work done)**, а не встречи, где информацию лишь объявляют.
**Советы, как сделать воркшоп эффективным:**
- **Добавлять разные голоса (diverse voices)** — это помогает рождению ценных новых идей и решений.
- **Работать по кругу (round-robin) или собирать идеи на стикерах (sticky notes)**, чтобы **доминирующие люди и экстраверты не захватили обсуждение**.
- **Начинать с упражнения, в котором участвуют все.**
## Воркшопы по пользовательским историям (user story workshops)
- **Предпочтительный способ собрать истории-кандидаты и довести их до хорошо сформулированных историй (well-formed stories)**.
- **Люди скорее преувеличат желания и «позолотят» требования (overstate wishes and gold-plate requirements), если рядом нет коллег**, — в группе коллеги держат друг друга в реальности.
- Такие воркшопы **вовлекают ключевых стейкхолдеров в процесс проектирования (design process)**.
**Пример:** наедине с аналитиком руководитель маркетинга просит «персональные ИИ-рекомендации на пяти языках». На воркшопе с поддержкой, финансами и командой она слышит, сколько это стоит, и история превращается в «показывать топ-10 фильмов любимого жанра зрителя».
## Мозговой штурм (brainstorming)
> **Мозговой штурм:** **совместная техника (collaborative technique)**, в которой группа старается **быстро породить много идей** по проблеме или вопросу. **Цель — максимально увеличить число предложений (maximize the number of suggestions generated)**; оценивать будут потом.
**Команда может штурмовать:**
- **роли пользователей продукта для персон (product roles to feature in personas)**;
- **функции для минимально жизнеспособного продукта (minimal viable product) релиза**;
- **возможные риски, которые могут повлиять на проект**;
- **решения проблемы, поднятой на ретроспективе**.
## Методы мозгового штурма (brainstorming methods)
| Метод | Как работает (слайд) | Сила и риск |
|---|---|---|
| **Тихое письмо (quiet writing)** | участникам дают **пять–семь минут**, чтобы **каждый сам** составил список идей, прежде чем группа соберётся делиться | интроверты получают равное время; никто не «зацикливается» на первой громкой идее |
| **По кругу (round-robin)** | человек предлагает идею, **когда до него доходит жетон (token), который передают по кругу** | каждый говорит по очереди; доминирующие люди не захватывают обсуждение |
| **Кто во что горазд (free-for-all)** | люди **просто выкрикивают идеи спонтанно** | быстро и энергично, но экстраверты и старшие по должности могут доминировать |
> Ловушка экзамена: «Какой метод даёт каждому время сначала подумать одному?» → **quiet writing (5–7 минут)**. «Какой метод использует жетон?» → **round-robin**. Совет для воркшопов против доминирующих людей и экстравертов называет **round-robin** или **стикеры** — и никогда free-for-all.
## Игры для совместной работы (collaboration games)
> **Collaboration games:** **фасилитируемые техники воркшопов (facilitated workshop techniques)**, которые дают agile-стейкхолдерам **лучше понять сложные вопросы (better understanding of complex issues)**.
| Игра | Назначение (слайд) | Как играют (сверх слайдов; первые четыре — из Innovation Games Люка Хохманна) |
|---|---|---|
| **Remember the Future («Вспомни будущее»)** | упражнение для **формирования видения и выявления требований (vision-setting and requirements-elicitation)** | участники представляют, что релиз уже позади и прошёл успешно, и, «оглядываясь назад», записывают, что делала система |
| **Prune the Product Tree («Подрежь дерево продукта»)** | помогает стейкхолдерам **собрать и сформировать требования (gather and shape requirements)** | рисуют большое дерево: ствол — ядро продукта, ветви — его области; стейкхолдеры клеят функции-листья туда, куда, по их мнению, продукту стоит расти |
| **Speedboat, он же Sailboat («Катер», «Парусник»)** | цель — **выявить угрозы и возможности (риски) (threats and opportunities (risks))** проекта | рисуют лодку; якоря — то, что тормозит проект (угрозы); в версии с парусником ветер — то, что толкает вперёд (возможности), а скалы впереди — риски |
| **Buy a Feature («Купи функцию»)** | упражнение на **приоритизацию (prioritization)** | стейкхолдеры получают ограниченную сумму игровых денег, у функций есть цены; люди покупают функции, а на дорогие приходится скидываться |
| **Bang-for-the-Buck («Отдача на вложенный рубль»)** | сравнивает ранжирование по **ценности и стоимости (value versus cost)** | команда оценивает стоимость каждой функции, бизнес — её ценность; высокая ценность при низкой стоимости идёт первой |
> Запомнить: **Future** — видение; **Tree** — сформировать требования; **Boat** — риски; **Buy** — приоритизация; **Bang/Buck** — ценность против стоимости.
?? Спонсор хочет заменить ежедневный разговор у доски записанным еженедельным видео, «потому что видео — насыщенный канал». Что говорит график каналов коммуникации?
?= Видеозапись насыщенная, но без возможности задать вопрос и получить ответ, поэтому она на нижней кривой. Разговор лицом к лицу у доски — самый горячий и самый эффективный канал: можно спрашивать и сразу получать обратную связь.
?? На воркшопе старший архитектор всех перебивает. Какие два приёма из лекции этому мешают?
?= Работа по кругу (round-robin, с жетоном, который передают по группе) или сбор идей на стикерах, как в quiet writing, — оба не дают доминирующим людям и экстравертам захватить обсуждение.
?? Команда хочет понять, что может сорвать релиз. Какая игра подходит лучше всего?
?= Speedboat (он же Sailboat) — её цель выявить угрозы и возможности (риски) проекта.
## Exam focus — что спросят
- Пять основных понятий agile-коммуникации: **face-to-face, two-way communication, knowledge sharing, information radiators, social media**.
- Face-to-face: **highest bandwidth**, взаимодействие в реальном времени, немедленная обратная связь. Оси графика: **Richness/Temperature (cold → hot)** и **Effectiveness**; верхняя точка — **face-to-face at whiteboard**; у записей **нет возможности вопросов и ответов**.
- Two-way: **двунаправленные (bi-directional)** потоки; у команды может быть информация, которую **нельзя получить иначе**.
- Обмен знаниями: четыре пункта; его поддерживают **демо, Kanban-доски, информационные радиаторы, персоны, вайрфреймы**; награды за **командные** достижения, чтобы не было выгоды **копить информацию**.
- Информационные радиаторы: **highly visible displays of information**; восемь видов данных.
- Социальные медиа: удалённая работа; некоторые области **слишком чувствительны или конфиденциальны**.
- Пять выгод сотрудничества; четыре пары «зелёная / красная зона».
- Воркшопы: **встречи, на которых участники делают работу**; три совета. Воркшопы по историям: коллеги рядом мешают **преувеличивать желания и «золотить» требования**.
- Цель мозгового штурма: **максимум предложений**; quiet writing — **5–7 минут**, round-robin — **жетон**, free-for-all — **выкрикивают спонтанно**.
- Игры: Remember the Future — видение и выявление требований; Prune the Product Tree — собрать и сформировать требования; Speedboat — риски; Buy a Feature — приоритизация; Bang-for-the-Buck — ценность против стоимости.`,
  },
  [
    qx("Which of the following is NOT one of the five fundamental concepts of agile communication?", "Weekly status reports", [
      ["Information radiators", "Information radiators are one of the five concepts on the slide.", "Информационные радиаторы — одно из пяти понятий на слайде."],
      ["Two-way communication", "Two-way communication is one of the five concepts on the slide.", "Двусторонняя коммуникация — одно из пяти понятий на слайде."],
      ["Social media", "Social media is the fifth concept on the slide.", "Социальные медиа — пятое понятие на слайде."],
    ], "The five concepts are face-to-face, two-way communication, knowledge sharing, information radiators and social media. Weekly status reports are not among them.", "Пять понятий: face-to-face, two-way communication, knowledge sharing, information radiators и social media. Еженедельных отчётов о статусе среди них нет."),
    qx("Why does the lecture single out face-to-face communication?", "It has the highest bandwidth of all communication forms", [
      ["It leaves a complete written record of every decision made", "A record is what documents give; face-to-face is valued for bandwidth and instant feedback.", "Запись дают документы; разговор лицом к лицу ценят за полосу пропускания и мгновенную обратную связь."],
      ["It lets one person reach the largest possible audience", "Reaching many people at once is broadcasting; the slide talks about bandwidth and interactivity.", "Охватить сразу многих — это вещание; слайд говорит о полосе пропускания и интерактивности."],
      ["It is the cheapest channel for a distributed team", "Cost is not the argument; for distributed teams it can even be the hardest channel.", "Стоимость — не аргумент; для распределённой команды это может быть даже самый трудный канал."],
    ], "Slide: face-to-face has the highest bandwidth of all communication forms, provides interactivity in real time, and participants can ask questions and get immediate feedback.", "Слайд: лицом к лицу — самая широкая полоса пропускания из всех форм общения, взаимодействие в реальном времени, можно задавать вопросы и сразу получать обратную связь."),
    qx("On the chart “Effectiveness of different communication channels”, which channel is at the hottest, most effective end?", "Face-to-face at a whiteboard", [
      ["Video recording of a whiteboard session", "A recording is rich but has no question-and-answer capability; the video recording point ends the lower curve.", "Запись насыщенная, но без вопросов и ответов; точка «видеозапись» завершает нижнюю кривую."],
      ["Phone conversation", "The phone is interactive and warm, but below face-to-face at a whiteboard.", "Телефон интерактивен и «тёпл», но ниже разговора лицом к лицу у доски."],
      ["Instant messaging", "Instant messaging is in the middle of the green curve, not at its top.", "Мессенджер — в середине зелёной кривой, а не на её вершине."],
    ], "At the top right of the green (question-and-answer) curve is face-to-face at whiteboard: the richest (hottest) and the most effective channel.", "В правом верхнем углу зелёной кривой (с вопросами и ответами) — лицом к лицу у доски: самый насыщенный («горячий») и самый эффективный канал."),
    qx("On the communication-channels chart, what do paper, audio recording and video recording have in common?", "They have no question-and-answer capability", [
      ["They are the warmest and the richest channels", "Paper is the coldest channel; the hottest one is face-to-face at a whiteboard.", "Бумага — самый холодный канал; самый горячий — лицом к лицу у доски."],
      ["They lie on the green, interactive curve", "The green curve is the question-and-answer one (e-mail, IM, phone, whiteboard).", "Зелёная кривая — с вопросами и ответами (почта, мессенджер, телефон, доска)."],
      ["They are all more effective than the phone", "On the chart the phone is above all three of them.", "На графике телефон выше всех трёх."],
    ], "Paper, audio recording and video recording form the black curve labelled \"No question and answer capability\": the listener cannot ask anything.", "Бумага, аудио- и видеозапись образуют чёрную кривую «No question and answer capability»: слушатель ничего не может спросить."),
    qx("What does the horizontal axis of the communication-channels chart show?", "Richness/temperature, from cold to hot", [
      ["Cost of the channel, from cheap to expensive", "Cost is not on the chart; the axis is richness, labelled cold and hot.", "Стоимости на графике нет; ось — насыщенность с подписями cold и hot."],
      ["Audience size, from one person to many", "The chart compares channels by richness, not by how many people they reach.", "График сравнивает каналы по насыщенности, а не по охвату."],
      ["Effectiveness, from low to high", "Effectiveness is the vertical axis.", "Эффективность — вертикальная ось."],
    ], "Horizontal axis: Richness/Temperature from (cold) to (hot); vertical axis: Effectiveness.", "Горизонтальная ось — Richness/Temperature от (cold) до (hot); вертикальная — Effectiveness."),
    qx("Requirements flow from the sponsor to the team, and nobody ever asks the team what it knows about the risks. Which concept of agile communication is missing?", "Two-way communication", [
      ["Information radiators", "Radiators display progress to everyone; the problem here is that the flow goes in one direction only.", "Радиаторы показывают ход работ всем; проблема здесь в том, что поток идёт только в одну сторону."],
      ["Social media", "Social media help remote people stay updated; they do not fix a one-way flow by themselves.", "Социальные медиа помогают удалённым быть в курсе; сами по себе одностороннего потока не исправят."],
      ["Face-to-face", "Even a face-to-face meeting can be one-way; the missing piece is the bi-directional flow.", "Даже встреча лицом к лицу может быть односторонней; не хватает именно двунаправленного потока."],
    ], "Two-way communication: ensure information flows between stakeholders are bi-directional — team members may have valuable information that cannot be accessed any other way.", "Двусторонняя коммуникация: потоки информации между стейкхолдерами должны быть двунаправленными — у команды может быть ценная информация, которую иначе не получить."),
    qx("A product owner plots each feature's business value against its estimated cost to choose what to build first. Which collaboration game is this?", "Bang-for-the-Buck", [
      ["Buy a Feature", "Buy a Feature is a prioritization game with play money, not a value-versus-cost ranking.", "Buy a Feature — приоритизация с игровыми деньгами, а не ранжирование «ценность против стоимости»."],
      ["Prune the Product Tree", "Prune the Product Tree helps gather and shape requirements.", "Prune the Product Tree помогает собрать и сформировать требования."],
      ["Remember the Future", "Remember the Future is a vision-setting and requirements-elicitation exercise.", "Remember the Future — упражнение для видения и выявления требований."],
    ], "Slide: Bang-for-the-Buck looks at value versus cost rankings.", "Слайд: Bang-for-the-Buck сравнивает ранжирование по ценности и стоимости."),
    qx("How does the slide suggest an organization should encourage knowledge sharing?", "Base rewards on team rather than individual accomplishments", [
      ["Reward the individual who solves the most tickets each month", "Individual rewards make hoarding information profitable — the opposite of the slide.", "Личные награды делают выгодным копить информацию — противоположность слайду."],
      ["Make detailed documentation mandatory for every single task", "The slide talks about culture and team rewards, not mandatory documents.", "Слайд говорит о культуре и командных наградах, а не об обязательных документах."],
      ["Keep sensitive knowledge with a few trusted senior experts", "The slide wants information available to everyone who wants to consume it.", "Слайд хочет, чтобы информация была доступна каждому, кто хочет ею воспользоваться."],
    ], "Slide: base tracking and rewards on team accomplishments rather than individual accomplishments, so there are no benefits to hoarding information; culture should reward discovery, innovation and transfer of information.", "Слайд: учитывать и вознаграждать командные, а не личные достижения, чтобы не было выгоды копить информацию; культура должна поощрять открытие, инновации и передачу информации."),
    qx("Which of the following is NOT listed as an agile practice that promotes knowledge sharing?", "Gantt charts", [
      ["Kanban boards", "Kanban boards are one of the five examples on the slide.", "Kanban-доски — один из пяти примеров на слайде."],
      ["Product demonstrations", "Product demonstrations are one of the five examples on the slide.", "Демонстрации продукта — один из пяти примеров на слайде."],
      ["Personas", "Personas are one of the five examples on the slide.", "Персоны — один из пяти примеров на слайде."],
    ], "The slide's examples: product demonstrations, Kanban boards, information radiators, personas and wireframes. Gantt charts are a traditional scheduling tool and are not listed.", "Примеры слайда: демонстрации продукта, Kanban-доски, информационные радиаторы, персоны и вайрфреймы. Диаграмм Ганта — традиционного инструмента планирования — в списке нет."),
    qx("Which of these is an example of an information radiator?", "A burnup chart on a big screen in the team room", [
      ["A monthly status report e-mailed to the sponsor", "A report pushed to one person is not a highly visible display for everyone.", "Отчёт, отправленный одному человеку, — не хорошо заметное отображение для всех."],
      ["A risk register kept in the PM's private folder", "A hidden document is the opposite of \"highly visible\", even though threats and issues may be on a radiator.", "Спрятанный документ — противоположность «highly visible», хотя угрозы и проблемы на радиаторе бывают."],
      ["A detailed design document stored in the wiki", "A document people must look for does not radiate information.", "Документ, который надо искать, информацию не «излучает»."],
    ], "Information radiators are highly visible displays of information; burn charts are one of the eight kinds of data listed on the slide.", "Информационные радиаторы — хорошо заметные отображения информации; burn-диаграммы — один из восьми видов данных на слайде."),
    qx("Which of the following is NOT listed as data that can be displayed on an information radiator?", "Individual salaries and bonuses", [
      ["Velocity and defect metrics", "Velocity and defect metrics are on the slide's list.", "Скорость и метрики дефектов есть в списке слайда."],
      ["Retrospective findings", "Retrospective findings are on the slide's list.", "Выводы ретроспектив есть в списке слайда."],
      ["Features selected for the current iteration", "Features selected for the current iteration are on the slide's list.", "Функции, выбранные на текущую итерацию, есть в списке слайда."],
    ], "The eight items: features delivered vs remaining, who is working on what, features for the current iteration, velocity and defect metrics, retrospective findings, threats and issues, story maps, burn charts. Pay data is not project progress information.", "Восемь пунктов: поставленные и оставшиеся функции, кто над чем работает, функции текущей итерации, скорость и дефекты, выводы ретроспектив, угрозы и проблемы, карты историй, burn-диаграммы. Зарплаты — не информация о ходе проекта."),
    qx("According to the slide, what is a limitation of using social media tools on a project?", "Some domains are too sensitive or confidential for them", [
      ["They prevent team members from working remotely on the project", "The slide says the opposite: social media enable more people to work remotely.", "Слайд говорит обратное: социальные медиа позволяют большему числу людей работать удалённо."],
      ["They make information radiators completely useless", "Nothing on the slide says social media replace radiators.", "На слайде нет ничего о том, что социальные медиа заменяют радиаторы."],
      ["They are slower than formal written status reports", "Speed is not the limitation named on the slide; confidentiality is.", "Слайд называет ограничением не скорость, а конфиденциальность."],
    ], "Slide: social media enable more team members to work remotely while keeping up with changes; some business domains may be too sensitive or confidential for social media tools.", "Слайд: социальные медиа позволяют большему числу людей работать удалённо и быть в курсе изменений; некоторые области слишком чувствительны или конфиденциальны для таких инструментов."),
    qx("Which of the following is NOT one of the benefits of collaboration listed on the slide?", "Lowers stakeholder involvement", [
      ["Builds social capital", "\"Builds social capital\" is one of the five benefits.", "«Builds social capital» — одна из пяти выгод."],
      ["Fosters ownership of collective problems", "This is one of the five benefits on the slide.", "Это одна из пяти выгод на слайде."],
      ["Generates wiser decisions", "\"Generates wiser decisions\" is the first benefit on the slide.", "«Generates wiser decisions» — первая выгода на слайде."],
    ], "The five benefits: generates wiser decisions, promotes problem solving, fosters action, builds social capital, fosters ownership of collective problems. Collaboration increases stakeholder involvement rather than reducing it.", "Пять выгод: более мудрые решения, решение проблем, побуждение к действию, социальный капитал, общая ответственность за общие проблемы. Сотрудничество усиливает участие стейкхолдеров, а не уменьшает его."),
    qx("In a code review a developer answers: “The bug is the tester's fault — her data was wrong.” How does the green zone/red zone model classify him?", "Red zone: he blames others for the circumstances", [
      ["Green zone: he takes responsibility for the result", "Taking responsibility is the green-zone behaviour he is not showing.", "Брать ответственность — поведение зелёной зоны, которого он как раз не проявляет."],
      ["Green zone: he is building mutual success", "Shifting blame to the tester builds defensiveness, not mutual success.", "Перекладывать вину на тестировщика — значит вызывать защитную реакцию, а не строить взаимный успех."],
      ["Red zone: he is responding non-defensively", "\"Responds non-defensively\" is a green-zone trait; red is \"responds defensively\".", "«Реагирует без защитной реакции» — черта зелёной зоны; в красной — «реагирует защитно»."],
    ], "A person in the red zone blames others for the circumstances of their life, responds defensively, feels threatened or wronged and triggers defensiveness in others.", "Человек в красной зоне обвиняет других в обстоятельствах своей жизни, реагирует защитно, чувствует угрозу или обиду и вызывает защитную реакцию у других."),
    tfx("In the green zone/red zone table, “feels threatened or wronged” describes a person in the red zone.", true,
      "True. Its green-zone pair is \"is not easily threatened psychologically\".",
      "Верно. Её пара в зелёной зоне — «is not easily threatened psychologically».",
      "\"False\" would put it in the green zone — but a green-zone person is not easily threatened.",
      "«Неверно» отнесло бы её к зелёной зоне — но человека в зелёной зоне нелегко задеть."),
    qx("Why are user story workshops preferred to collecting stories from each stakeholder separately?", "Without peers, people overstate wishes and gold-plate", [
      ["Individual interviews always take too much calendar time", "Time is not the slide's argument; the argument is what people ask for when alone.", "Время — не аргумент слайда; аргумент — что люди просят, оставшись одни."],
      ["Workshops remove the need for a product owner role", "Workshops engage stakeholders; they do not replace the product owner.", "Воркшопы вовлекают стейкхолдеров, но не заменяют владельца продукта."],
      ["Workshops fix the release scope once and for all", "Stories gathered in a workshop are still refined and can change.", "Истории с воркшопа всё равно уточняются и могут меняться."],
    ], "Slide: people are more likely to overstate wishes and gold-plate requirements if their peers aren't present; user story workshops are the preferred method and engage key stakeholders in design.", "Слайд: без коллег люди скорее преувеличат желания и «позолотят» требования; воркшопы по историям — предпочтительный способ, они вовлекают ключевых стейкхолдеров в проектирование."),
    qx("Which brainstorming method gives every participant five to seven minutes to list ideas alone before the group shares?", "Quiet writing", [
      ["Round-robin", "Round-robin passes a token around the group; there is no individual writing time.", "В round-robin по кругу передают жетон; отдельного времени на письмо нет."],
      ["Free-for-all", "In free-for-all people shout out ideas spontaneously.", "В free-for-all люди спонтанно выкрикивают идеи."],
      ["Remember the Future", "This is a collaboration game for vision-setting, not a brainstorming method.", "Это игра для формирования видения, а не метод мозгового штурма."],
    ], "Slide: quiet writing — participants are given five to seven minutes to generate a list of ideas individually before the group gathers to share.", "Слайд: quiet writing — участникам дают пять–семь минут, чтобы каждый сам составил список идей, прежде чем группа соберётся делиться."),
    qx("Two extroverts keep taking over a brainstorming session. Which method lets people speak only when a token passed around the group reaches them?", "Round-robin", [
      ["Free-for-all", "Free-for-all is exactly the method in which extroverts dominate.", "Free-for-all — как раз тот метод, где доминируют экстраверты."],
      ["Quiet writing", "Quiet writing also limits domination, but through individual writing time, not a token.", "Quiet writing тоже ограничивает доминирование, но за счёт времени на самостоятельное письмо, а не жетона."],
      ["Buy a Feature", "Buy a Feature is a prioritization game, not a brainstorming method.", "Buy a Feature — игра на приоритизацию, а не метод мозгового штурма."],
    ], "Slide: round-robin — people suggest an idea when a token that is passed around the group reaches them. The workshop tips recommend it to prevent dominant individuals and extroverts from taking over.", "Слайд: round-robin — человек предлагает идею, когда до него доходит жетон. Советы для воркшопов рекомендуют его, чтобы доминирующие люди и экстраверты не захватили обсуждение."),
    qx("Which collaboration game is designed to identify threats and opportunities (risks) for the project?", "Speedboat (aka Sailboat)", [
      ["Prune the Product Tree", "Prune the Product Tree helps stakeholders gather and shape requirements.", "Prune the Product Tree помогает собрать и сформировать требования."],
      ["Remember the Future", "Remember the Future is for vision-setting and requirements elicitation.", "Remember the Future — для видения и выявления требований."],
      ["Bang-for-the-Buck", "Bang-for-the-Buck compares value against cost.", "Bang-for-the-Buck сравнивает ценность и стоимость."],
    ], "Slide: Speedboat (aka Sailboat) — the goal is to identify threats and opportunities (risks) for the project.", "Слайд: Speedboat (он же Sailboat) — цель выявить угрозы и возможности (риски) проекта."),
    tfx("The goal of brainstorming is to select the single best idea as quickly as possible.", false,
      "False. The slide: the goal of brainstorming is to maximize the number of suggestions generated; ideas are evaluated later.",
      "Неверно. Слайд: цель мозгового штурма — максимально увеличить число предложений; оценивают идеи потом.",
      "\"True\" mixes up generating ideas with choosing among them — brainstorming rapidly generates a lot of ideas first.",
      "«Верно» путает порождение идей с выбором из них — мозговой штурм сначала быстро даёт много идей."),
  ],
);

const p3 = part(
  "pm-l10-p3",
  { en: "Interpersonal skills, conflict and decisions", ru: "Навыки общения, конфликты и решения" },
  {
    en: `## Using critical interpersonal skills
- **Poor interpersonal skills can quickly demoralize a technically strong team.**
- **A leader who effectively uses these skills can get amazing results from an average team.**
The rest of the lecture covers these "soft" skills one by one: emotional intelligence, active listening, facilitation, negotiation, conflict resolution and participatory decision making.
## Emotional intelligence
> **Emotional intelligence:** our ability to **identify, assess, and influence the emotions** of **ourselves, other individuals, and groups**.
The slide's figure **"Quadrants of emotional intelligence"** is a 2×2 grid: the columns are **Self** and **Others**, the rows are **Regulate** (top) and **Recognize** (bottom).
| | Self | Others |
|---|---|---|
| **Regulate** | **Self-Management** — Self-Control: conscientiousness, adaptability, drive and motivation | **Social Skills** — Influence: inspirational leadership, developing others, teamwork and collaboration |
| **Recognize** | **Self-Awareness** — Self-Confidence: emotional self-awareness, accurate self-assessment | **Social Awareness** — Empathy: organizational awareness, understanding the environment |
A zig-zag arrow on the figure shows the path of development: **Self-Awareness → Self-Management → Social Awareness → Social Skills** — first recognize, then regulate; first yourself, then others.
> Slide: **start improving emotional intelligence by recognizing our own feelings**, so that we can have **the power to choose the response** to those feelings.
**Example:** a developer feels irritation rising when the product owner changes a story for the third time (self-awareness). He notices it and asks "what changed for the users?" instead of snapping (self-management). He sees that the product owner is under pressure from the sponsor (social awareness) and offers to show both options at the review (social skills).
> Exam trap: "recognize" is the **bottom** row and "regulate" the **top** row. Self-management = regulating **yourself**; social skills = regulating (influencing) **others**; social awareness (empathy) = recognizing **others'** emotions.
## Active listening
> **Active listening:** **hearing what someone is really trying to convey, rather than just the meaning of the words**.
- **Listen for the message.**
- It **can be improved with practice**.
- **Three levels:** Level 1 — **internal listening**; Level 2 — **focused listening**; Level 3 — **global listening**.
The slide only names the levels; the explanations below come from Griffiths' book.
@diagram pm10-listening-levels
| Level | What the listener does | Example: a tester says "The release is fine, I guess…" |
|---|---|---|
| **1 — Internal listening** | hears the words but interprets them through **his own thoughts**: "how does this affect me?" | the PM thinks: "Good, then I can report green to the sponsor" |
| **2 — Focused listening** | puts himself **in the speaker's shoes**, concentrates on the speaker and listens for the emotion and meaning behind the words | the PM notices the hesitation in "I guess" and asks what worries her |
| **3 — Global listening** | adds awareness of **subtle physical and environmental cues**: **body language, tone of voice, gestures, energy** | the PM also sees that she avoids eye contact and keeps looking at the bug board — something is seriously wrong |
> Exam trap: hearing the **tone and body language** is **Level 3, global** listening. Concentrating on the speaker and the feelings behind the words is **Level 2, focused**. Thinking about **yourself** while the other person speaks is **Level 1, internal** — the lowest level.
## Facilitation
When facilitating a meeting or session, keep four things in mind (slide):
| Element | Slide wording | Example |
|---|---|---|
| **Goals** | establish a **clear goal for each meeting** that will keep people engaged | "By 11:00 we have ten prioritized stories for release 1" |
| **Rules** | establish and enforce basic **ground rules** regarding the use of **cell phones, meeting start and end times**, etc. | phones away; we start on time even if someone is late |
| **Timing** | establish the **duration of the session ahead of time** and **designate a timekeeper** | 60 minutes; Aigerim keeps the time |
| **Assisting** | make sure the meeting is **productive** and that **everyone has a chance to contribute** | the facilitator asks the quiet tester for her view |
> Memory hook: **G-R-T-A** — Goals, Rules, Timing, Assisting.
## Negotiation
- Negotiation **occurs most when discussing requirements or priorities of features and what "done" should look like**.
- **Healthy negotiations** allow each party to **investigate options and tradeoffs** and **present alternatives**.
- **Allow each viewpoint to be fully described, noting pros and cons of each.**
- Negotiation is **most effective when interactions are positive and there is room for give and take**.
**Example:** marketing wants the "recommended" feature in release 1; the team says it needs three sprints. In a healthy negotiation both sides lay out the options (a simple "top in your genre" now, personal recommendations later), note the pros and cons of each, and give and take until both can accept the result.
## Conflict resolution
- **Some conflict is healthy** and **ensures ideas are sufficiently tested**.
- **Escalated conflict** can result in a **negative and repressive environment**.
- **Create an environment in which people can use conflict constructively.**
The slide lists **five levels of conflict** (Speed Leas' model). The characteristics and responses are not on the slide — they come from Griffiths' book (Speed Leas, also used by Lyssa Adkins):
@diagram pm10-conflict-levels
| Level | Characteristics | Language | How to respond |
|---|---|---|---|
| **1 — Problem to Solve** | information sharing and collaboration | open and fact-based | collaboration and consensus — the team solves it itself |
| **2 — Disagreement** | personal protection trumps resolving the conflict | guarded and open to interpretation | support: help people feel safe and let the team solve it |
| **3 — Contest** | the aim is to **win**, not to solve the problem | includes personal attacks | accommodate, negotiate, bring the discussion back to the facts |
| **4 — Crusade** | protecting one's own **group** becomes the focus | ideological | diplomacy — de-escalate, often with the help of an outsider |
| **5 — World War** | "destroy the other!" | little or nonexistent | do whatever is necessary to prevent people from harming one another; separate the parties |
**IT example of escalation.** Level 1: "The build is slow — what is causing it?" Level 2: "I'm not saying my module is slow, but…" Level 3: "Your code is always the problem; I was right about the framework." Level 4: "Backend people never care about the frontend." Level 5: the two sub-teams stop talking and block each other's work.
> Exam trap: "the goal is to win rather than to solve the problem" = **Level 3, Contest**. "Protecting one's own group, ideological language" = **Level 4, Crusade**. "Guarded language, personal protection" = **Level 2, Disagreement**. Level 1 is not a "bad" conflict at all — it is the healthy kind that tests ideas.
## Participatory decision making
- **Engage project stakeholders in the process.**
- **The project's performance and team cohesion is impacted by the speed at which decisions are made and the group's level of agreement with the decisions.**
- **Lack of stakeholder involvement in making decisions could lead to reduced commitment and participation.**
## Convergent, shared collaboration
- A **higher level of team empowerment increases stakeholders' satisfaction and productivity**, but also **raises the need for an effective decision-making process**.
- **Convergence:** **collective agreement on the best answer**.
- **Shared collaboration:** strive for **group consensus** rather than **yielding to the will of a single influential individual**.
## Participatory decision models
| Model | Slide description | How it works (beyond the slides, from Griffiths) |
|---|---|---|
| **Simple voting** | **easy technique, but limits opportunities to refine the decision** | for or against; the majority wins, and the minority's concerns are not worked into the decision |
| **Thumbs up/down/sideways** | **quicker approach than simply polling the group for input** | up = I support it; down = I do not support it; sideways = I am undecided and will go along with the group |
| **Fist-of-five voting** | **has the advantage of speed, while allowing people to indicate their degree of agreement** | everyone shows 0–5 fingers at the same time (table below) |
| **Highsmith's decision spectrum** | **allows people to both indicate their support and express reservations at the same time** | each person puts a mark on a scale from full support to "block" |
**Fist-of-five** — one common meaning of the fingers (as in Griffiths):
| Fingers | Meaning |
|---|---|
| 5 | full support — "I love it, I will champion it" |
| 4 | support — "a good idea, I am in" |
| 3 | "I can live with it" — some reservations, but I will support it |
| 2 | "I have concerns we should discuss" |
| 1 | "I have serious concerns" |
| fist (0) | "No — I block this" |
The usual rule: anyone showing **fewer than three fingers** gets the chance to explain the concerns; the group discusses them and votes again. Agreement is reached when **everyone shows at least three fingers**.
**Highsmith's decision spectrum** (Jim Highsmith): a line with positions such as **in favor — OK with reservations — mixed feelings — not in favor, but will commit — block**. Its point is in the slide's wording: a person can say "I will support this decision" **and** "here are my reservations" **at the same time**, so commitment is not mistaken for full agreement.
> Exam trap: match the model to the slide's key phrase. "**Limits opportunities to refine the decision**" = simple voting. "**Quicker than simply polling the group**" = thumbs up/down/sideways. "**Speed + degree of agreement**" = fist-of-five. "**Support and reservations at the same time**" = Highsmith's decision spectrum.
?? In a retrospective a developer says "fine", but looks at the floor and crosses his arms. Which level of listening lets the Scrum Master notice this?
?= Level 3, global listening — it adds awareness of body language, tone and other subtle physical cues to focused listening.
?? Two senior developers argue about frameworks, and each now just wants to prove he was right. Which level of conflict is this, and how should one respond?
?= Level 3, Contest: the aim is to win rather than to solve the problem, and personal attacks appear. Respond by accommodating, negotiating and bringing the discussion back to the facts — for example, a short timeboxed spike that compares both frameworks.
?? A fist-of-five vote shows 5, 4, 3, 3 and 1 fingers. What happens next?
?= The person showing one finger explains the concerns; the group discusses them and votes again. Agreement is usually reached when everyone shows at least three fingers.
## Exam focus
- Interpersonal skills: poor ones **demoralize a technically strong team**; good ones get **amazing results from an average team**.
- Emotional intelligence: **identify, assess, and influence the emotions of ourselves, other individuals, and groups**; quadrants Self/Others × Recognize/Regulate; start by **recognizing our own feelings**.
- Active listening: hear **what someone is really trying to convey**; Level 1 internal, Level 2 focused, Level 3 global (body language, tone).
- Facilitation: **goals, rules, timing (timekeeper), assisting**.
- Negotiation: requirements, priorities, "done"; options and tradeoffs; pros and cons; **give and take**.
- Conflict: some is healthy; five levels — **Problem to Solve, Disagreement, Contest, Crusade, World War**; Contest = the aim is to win.
- Participatory decision making: **speed** and **level of agreement** affect performance and cohesion; no involvement → **reduced commitment and participation**.
- Convergence = collective agreement on the best answer; shared collaboration = group consensus, not the will of one influential person.
- Decision models — simple voting, thumbs up/down/sideways, fist-of-five, Highsmith's decision spectrum — with their key phrases.`,
    ru: `## Ключевые навыки межличностного общения (using critical interpersonal skills)
- **Слабые навыки общения (poor interpersonal skills) могут быстро деморализовать технически сильную команду.**
- **Лидер, который умело пользуется этими навыками, может добиться потрясающих результатов от средней команды.**
Дальше лекция разбирает эти «мягкие» навыки по одному: эмоциональный интеллект, активное слушание, фасилитацию, переговоры, разрешение конфликтов и совместное принятие решений.
## Эмоциональный интеллект (emotional intelligence)
> **Эмоциональный интеллект:** наша способность **распознавать, оценивать и влиять на эмоции (identify, assess, and influence the emotions)** — **свои, других людей и групп (ourselves, other individuals, and groups)**.
Рисунок слайда **«Quadrants of emotional intelligence» (квадранты эмоционального интеллекта)** — сетка 2×2: столбцы **Self (я сам)** и **Others (другие)**, строки **Regulate (управлять)** — сверху и **Recognize (распознавать)** — снизу.
| | Self (я сам) | Others (другие) |
|---|---|---|
| **Regulate (управлять)** | **Self-Management (самоуправление)** — Self-Control: добросовестность (conscientiousness), гибкость (adaptability), напор и мотивация (drive and motivation) | **Social Skills (социальные навыки)** — Influence: вдохновляющее лидерство (inspirational leadership), развитие других (developing others), командная работа и сотрудничество (teamwork and collaboration) |
| **Recognize (распознавать)** | **Self-Awareness (самосознание)** — Self-Confidence: эмоциональное самосознание (emotional self-awareness), точная самооценка (accurate self-assessment) | **Social Awareness (социальная осознанность)** — Empathy: понимание организации (organizational awareness), понимание окружения (understanding the environment) |
Зигзаг-стрелка на рисунке показывает путь развития: **Self-Awareness → Self-Management → Social Awareness → Social Skills** — сначала распознать, потом управлять; сначала собой, потом другими.
> Слайд: **начинать развивать эмоциональный интеллект с распознавания собственных чувств (recognizing our own feelings)** — тогда у нас появляется **возможность выбирать, как на них реагировать (the power to choose the response)**.
**Пример:** разработчик чувствует, как растёт раздражение, когда владелец продукта в третий раз меняет историю (самосознание). Он это замечает и вместо резкости спрашивает: «Что изменилось для пользователей?» (самоуправление). Он видит, что на владельца продукта давит спонсор (социальная осознанность), и предлагает показать оба варианта на обзоре (социальные навыки).
> Ловушка экзамена: «recognize» — **нижняя** строка, «regulate» — **верхняя**. Self-management — управлять **собой**; social skills — управлять (влиять) **другими**; social awareness (эмпатия) — распознавать эмоции **других**.
## Активное слушание (active listening)
> **Активное слушание:** **услышать, что человек на самом деле пытается донести, а не только смысл его слов (what someone is really trying to convey)**.
- **Слушать послание (listen for the message).**
- Этому **можно научиться практикой (can be improved with practice)**.
- **Три уровня:** уровень 1 — **внутреннее слушание (internal listening)**; уровень 2 — **сосредоточенное слушание (focused listening)**; уровень 3 — **глобальное слушание (global listening)**.
Слайд только называет уровни; объяснения ниже — из книги Гриффитса.
@diagram pm10-listening-levels
| Уровень | Что делает слушатель | Пример: тестировщица говорит «С релизом всё нормально, наверное…» |
|---|---|---|
| **1 — Внутреннее (internal)** | слышит слова, но толкует их через **свои мысли**: «как это касается меня?» | менеджер думает: «Отлично, значит, доложу спонсору, что всё зелёное» |
| **2 — Сосредоточенное (focused)** | ставит себя **на место говорящего**, сосредоточен на нём и слышит эмоцию и смысл за словами | менеджер замечает сомнение в «наверное» и спрашивает, что её беспокоит |
| **3 — Глобальное (global)** | добавляет внимание к **тонким физическим сигналам и сигналам обстановки**: **язык тела, тон голоса, жесты, энергия** | менеджер ещё и видит, что она отводит глаза и всё время смотрит на доску с багами, — что-то серьёзно не так |
> Ловушка экзамена: слышать **тон и язык тела** — это **уровень 3, global**. Сосредоточиться на говорящем и на чувствах за словами — **уровень 2, focused**. Думать о **себе**, пока говорит другой, — **уровень 1, internal**, самый низкий.
## Фасилитация (facilitation)
Проводя встречу или сессию, держите в голове четыре вещи (слайд):
| Элемент | Формулировка слайда | Пример |
|---|---|---|
| **Цели (goals)** | поставить **ясную цель каждой встречи**, которая удержит вовлечённость людей | «К 11:00 у нас десять приоритизированных историй для релиза 1» |
| **Правила (rules)** | установить и соблюдать базовые **правила (ground rules)** — о **мобильных телефонах, времени начала и окончания** и т. п. | телефоны убраны; начинаем вовремя, даже если кто-то опаздывает |
| **Время (timing)** | заранее **определить длительность сессии** и **назначить хронометриста (timekeeper)** | 60 минут; за временем следит Айгерим |
| **Помощь (assisting)** | следить, чтобы встреча была **продуктивной** и **у каждого была возможность внести вклад** | фасилитатор спрашивает мнение молчаливой тестировщицы |
> Запомнить: **G-R-T-A** — Goals, Rules, Timing, Assisting.
## Переговоры (negotiation)
- Переговоры **чаще всего идут при обсуждении требований, приоритетов функций и того, как должно выглядеть «готово»**.
- **Здоровые переговоры (healthy negotiations)** позволяют каждой стороне **изучить варианты и компромиссы (options and tradeoffs)** и **предложить альтернативы**.
- **Дать каждой точке зрения прозвучать полностью, отмечая плюсы и минусы каждой (pros and cons).**
- Переговоры **эффективнее всего, когда общение позитивное и есть место для взаимных уступок (give and take)**.
**Пример:** маркетинг хочет функцию «рекомендуем» в релизе 1; команда говорит, что на неё нужно три спринта. В здоровых переговорах обе стороны раскладывают варианты (простой «топ вашего жанра» сейчас, персональные рекомендации потом), отмечают плюсы и минусы каждого и уступают друг другу, пока результат не устроит обоих.
## Разрешение конфликтов (conflict resolution)
- **Немного конфликта — полезно (some conflict is healthy)**: так **идеи проходят достаточную проверку**.
- **Эскалировавший конфликт (escalated conflict)** может привести к **негативной и подавляющей обстановке (negative and repressive environment)**.
- **Создавать среду, где люди могут использовать конфликт конструктивно.**
Слайд перечисляет **пять уровней конфликта (levels of conflict)** — модель Спида Лиса (Speed Leas). Признаков и способов реагирования на слайде нет — они из книги Гриффитса (Speed Leas; ту же модель использует Лисса Адкинс):
@diagram pm10-conflict-levels
| Уровень | Признаки | Язык | Как реагировать |
|---|---|---|---|
| **1 — Problem to Solve (задача, которую надо решить)** | обмен информацией и сотрудничество | открытый, основанный на фактах | сотрудничество и консенсус — команда решает сама |
| **2 — Disagreement (разногласие)** | защитить себя важнее, чем разрешить конфликт | осторожный, допускающий толкования | поддержка: помочь людям почувствовать себя в безопасности и дать команде решить самой |
| **3 — Contest (состязание)** | цель — **победить**, а не решить проблему | с личными выпадами | уступить, договориться, вернуть обсуждение к фактам |
| **4 — Crusade (крестовый поход)** | в центре — защита **своей группы** | идеологический | дипломатия — снижать накал, часто с помощью человека со стороны |
| **5 — World War (мировая война)** | «уничтожить противника!» | почти или совсем отсутствует | сделать всё необходимое, чтобы люди не навредили друг другу; развести стороны |
**IT-пример эскалации.** Уровень 1: «Сборка медленная — из-за чего?» Уровень 2: «Я не говорю, что мой модуль медленный, но…» Уровень 3: «Проблема всегда в твоём коде; я был прав насчёт фреймворка». Уровень 4: «Бэкендерам всегда плевать на фронтенд». Уровень 5: две подкоманды перестают разговаривать и блокируют работу друг друга.
> Ловушка экзамена: «цель — победить, а не решить проблему» = **уровень 3, Contest**. «Защита своей группы, идеологический язык» = **уровень 4, Crusade**. «Осторожный язык, самозащита» = **уровень 2, Disagreement**. Уровень 1 вовсе не «плохой» конфликт — это здоровый вид, который проверяет идеи.
## Совместное принятие решений (participatory decision making)
- **Вовлекать стейкхолдеров проекта в процесс.**
- **На результаты проекта и сплочённость команды (performance and team cohesion) влияют скорость принятия решений и уровень согласия группы с ними (level of agreement).**
- **Если стейкхолдеры не участвуют в принятии решений, это может снизить их приверженность и участие (reduced commitment and participation).**
## Сходящееся совместное сотрудничество (convergent, shared collaboration)
- **Больше полномочий у команды (team empowerment) — выше удовлетворённость и продуктивность стейкхолдеров**, но **выше и потребность в эффективном процессе принятия решений**.
- **Схождение (convergence):** **коллективное согласие о лучшем ответе (collective agreement on the best answer)**.
- **Совместное сотрудничество (shared collaboration):** стремиться к **консенсусу группы (group consensus)**, а не **подчиняться воле одного влиятельного человека (single influential individual)**.
## Модели совместного принятия решений (participatory decision models)
| Модель | Описание слайда | Как работает (сверх слайдов, по Гриффитсу) |
|---|---|---|
| **Простое голосование (simple voting)** | **простая техника, но ограничивает возможности доработать решение (limits opportunities to refine the decision)** | за или против; побеждает большинство, а опасения меньшинства в решение не попадают |
| **Большой палец вверх/вниз/вбок (thumbs up/down/sideways)** | **быстрее, чем просто опрашивать группу (quicker approach than simply polling the group)** | вверх — поддерживаю; вниз — не поддерживаю; вбок — не определился и пойду за группой |
| **Голосование «кулак пяти» (fist-of-five voting)** | **быстрое и при этом позволяет показать степень согласия (degree of agreement)** | все одновременно показывают от 0 до 5 пальцев (таблица ниже) |
| **Спектр решений Хайсмита (Highsmith's decision spectrum)** | **позволяет одновременно выразить поддержку и высказать оговорки (support and reservations at the same time)** | каждый ставит отметку на шкале от полной поддержки до «блокирую» |
**Fist-of-five** — одно из распространённых значений пальцев (как у Гриффитса):
| Пальцы | Значение |
|---|---|
| 5 | полная поддержка — «отлично, буду продвигать» |
| 4 | поддержка — «хорошая идея, я за» |
| 3 | «могу с этим жить» — есть оговорки, но поддержу |
| 2 | «есть опасения, давайте обсудим» |
| 1 | «у меня серьёзные опасения» |
| кулак (0) | «нет — блокирую» |
Обычное правило: тот, кто показывает **меньше трёх пальцев**, объясняет свои опасения; группа их обсуждает и голосует снова. Согласие достигнуто, когда **все показывают не меньше трёх пальцев**.
**Спектр решений Хайсмита** (Джим Хайсмит): линия с позициями вроде **за — согласен с оговорками — смешанные чувства — не за, но буду выполнять — блокирую (in favor — OK with reservations — mixed feelings — not in favor, but will commit — block)**. Смысл — в формулировке слайда: человек может сказать «я поддержу это решение» **и** «вот мои оговорки» **одновременно**, и готовность выполнять не путают с полным согласием.
> Ловушка экзамена: сопоставляйте модель с ключевой фразой слайда. «**Limits opportunities to refine the decision**» — простое голосование. «**Quicker than simply polling the group**» — thumbs up/down/sideways. «**Скорость + степень согласия**» — fist-of-five. «**Поддержка и оговорки одновременно**» — спектр решений Хайсмита.
?? На ретроспективе разработчик говорит «нормально», но смотрит в пол и скрещивает руки. Какой уровень слушания позволяет Scrum-мастеру это заметить?
?= Уровень 3, глобальное слушание (global listening): к сосредоточенному слушанию добавляется внимание к языку тела, тону и другим тонким физическим сигналам.
?? Два старших разработчика спорят о фреймворках, и каждому теперь просто хочется доказать свою правоту. Какой это уровень конфликта и как реагировать?
?= Уровень 3, Contest (состязание): цель — победить, а не решить проблему, появляются личные выпады. Реагировать — уступками, переговорами и возвращением к фактам: например, коротким ограниченным по времени исследованием (spike), которое сравнит оба фреймворка.
?? Голосование fist-of-five показало 5, 4, 3, 3 и 1 палец. Что дальше?
?= Тот, кто показал один палец, объясняет свои опасения; группа их обсуждает и голосует снова. Согласие обычно достигнуто, когда все показывают не меньше трёх пальцев.
## Exam focus — что спросят
- Навыки общения: слабые **деморализуют технически сильную команду**; сильные дают **потрясающие результаты от средней команды**.
- Эмоциональный интеллект: **identify, assess, and influence the emotions of ourselves, other individuals, and groups**; квадранты Self/Others × Recognize/Regulate; начинать с **распознавания собственных чувств**.
- Активное слушание: услышать, **что человек на самом деле пытается донести**; уровень 1 internal, уровень 2 focused, уровень 3 global (язык тела, тон).
- Фасилитация: **goals, rules, timing (хронометрист), assisting**.
- Переговоры: требования, приоритеты, «готово»; варианты и компромиссы; плюсы и минусы; **give and take**.
- Конфликт: немного — полезно; пять уровней — **Problem to Solve, Disagreement, Contest, Crusade, World War**; Contest — цель победить.
- Совместное принятие решений: **скорость** и **уровень согласия** влияют на результаты и сплочённость; без участия → **меньше приверженности и участия**.
- Convergence — коллективное согласие о лучшем ответе; shared collaboration — консенсус группы, а не воля одного влиятельного человека.
- Модели решений — simple voting, thumbs up/down/sideways, fist-of-five, Highsmith's decision spectrum — с их ключевыми фразами.`,
  },
  [
    qx("According to the slide, what can a leader who effectively uses interpersonal skills achieve?", "Amazing results from an average team", [
      ["Results without any team meetings", "The slide says nothing about meetings; its point is what good interpersonal skills do for a team.", "Слайд ничего не говорит о встречах; его мысль — что хорошие навыки общения дают команде."],
      ["A team that no longer needs strong technical skills", "Interpersonal skills complement technical skills; they do not make them unnecessary.", "Навыки общения дополняют технические, а не делают их ненужными."],
      ["A fixed scope delivered without any changes", "Scope control is not what the slide attributes to interpersonal skills.", "Контроль объёма — не то, что слайд приписывает навыкам общения."],
    ], "Slide: poor interpersonal skills can quickly demoralize a technically strong team; a leader who effectively uses these skills can get amazing results from an average team.", "Слайд: слабые навыки общения могут быстро деморализовать технически сильную команду; лидер, умело ими пользующийся, добивается потрясающих результатов от средней команды."),
    qx("How does the lecture define emotional intelligence?", "Identifying, assessing and influencing emotions in self and others", [
      ["Suppressing one's own emotions so as to stay professional at work", "EI is about recognizing and choosing a response to emotions, not suppressing them.", "Эмоциональный интеллект — распознавать эмоции и выбирать реакцию на них, а не подавлять их."],
      ["Measuring the team's mood with a short regular survey in each sprint", "A mood survey is a tool; the definition is about a personal ability.", "Опрос настроения — инструмент; определение говорит о личной способности."],
      ["Reading other people's emotions while ignoring one's own feelings", "The slide includes our own emotions and says to start by recognizing our own feelings.", "Слайд включает и свои эмоции и велит начинать с распознавания собственных чувств."],
    ], "Slide: emotional intelligence is our ability to identify, assess and influence the emotions of ourselves, other individuals and groups.", "Слайд: эмоциональный интеллект — способность распознавать, оценивать и влиять на эмоции — свои, других людей и групп."),
    qx("According to the slide, where should you start improving your emotional intelligence?", "By first recognizing your own feelings", [
      ["By influencing the group's emotions", "Influencing others (social skills) is the last step on the figure's path, not the first.", "Влиять на других (social skills) — последний шаг на пути рисунка, а не первый."],
      ["By studying other people's body language", "Reading others belongs to social awareness; the slide says to start with yourself.", "Читать других — это social awareness; слайд велит начинать с себя."],
      ["By suppressing negative emotions at work", "The goal is to recognize feelings so that you can choose a response, not to suppress them.", "Цель — распознать чувства, чтобы выбирать реакцию, а не подавлять их."],
    ], "Slide: start improving emotional intelligence by recognizing our own feelings so that we can have the power to choose the response to those feelings.", "Слайд: начинать развивать эмоциональный интеллект с распознавания собственных чувств, чтобы иметь возможность выбирать реакцию на них."),
    qx("In the quadrants of emotional intelligence, which quadrant combines “Others” with “Recognize”?", "Social awareness", [
      ["Social skills", "Social skills combine Others with Regulate (influence, leadership, teamwork).", "Social skills — это Others + Regulate (влияние, лидерство, командная работа)."],
      ["Self-awareness", "Self-awareness combines Self with Recognize.", "Self-awareness — это Self + Recognize."],
      ["Self-management", "Self-management combines Self with Regulate.", "Self-management — это Self + Regulate."],
    ], "Social awareness (empathy, organizational awareness, understanding the environment) is recognizing the emotions of others: the Others column, Recognize row.", "Social awareness (эмпатия, понимание организации и окружения) — распознавание эмоций других: столбец Others, строка Recognize."),
    qx("Which quadrant of emotional intelligence contains self-control, conscientiousness, adaptability, and drive and motivation?", "Self-management", [
      ["Self-awareness", "Self-awareness holds self-confidence, emotional self-awareness and accurate self-assessment.", "В self-awareness — уверенность в себе, эмоциональное самосознание и точная самооценка."],
      ["Social skills", "Social skills hold influence, inspirational leadership, developing others, teamwork.", "В social skills — влияние, вдохновляющее лидерство, развитие других, командная работа."],
      ["Social awareness", "Social awareness holds empathy, organizational awareness, understanding the environment.", "В social awareness — эмпатия, понимание организации и окружения."],
    ], "Self-management (Self × Regulate) — self-control: conscientiousness, adaptability, drive and motivation.", "Self-management (Self × Regulate) — самоконтроль: добросовестность, гибкость, напор и мотивация."),
    qx("What is active listening, according to the slide?", "Hearing what someone is really trying to convey", [
      ["Repeating the speaker's words back to him exactly", "Paraphrasing can help, but the definition is about the real message behind the words.", "Пересказ может помочь, но определение — о настоящем послании за словами."],
      ["Writing down every word that is said in the meeting", "Notes capture the words; active listening goes beyond the meaning of the words.", "Записи фиксируют слова; активное слушание идёт дальше смысла слов."],
      ["Waiting silently until the speaker has finished", "Silence alone is not listening for the message.", "Одно молчание — ещё не слушание послания."],
    ], "Slide: active listening is hearing what someone is really trying to convey, rather than just the meaning of the words; listen for the message; it can be improved with practice.", "Слайд: активное слушание — услышать, что человек на самом деле пытается донести, а не только смысл слов; слушать послание; это можно развить практикой."),
    qx("A Scrum Master notices that the tester crosses her arms and keeps glancing at the bug board while saying “all fine”. Which level of listening is this?", "Level 3 — global listening", [
      ["Level 2 — focused listening", "Focused listening concentrates on the speaker and her feelings; noticing body language and the environment is the next level.", "Сосредоточенное слушание — внимание к говорящему и её чувствам; язык тела и обстановка — уже следующий уровень."],
      ["Level 1 — internal listening", "Internal listening is about the listener's own thoughts — the opposite of what happens here.", "Внутреннее слушание — о собственных мыслях слушателя, здесь происходит обратное."],
      ["Level 4 — empathic listening", "The slide has only three levels; there is no Level 4.", "На слайде только три уровня; уровня 4 нет."],
    ], "Global listening (Level 3) adds awareness of subtle physical and environmental cues — body language, gestures, what is around the speaker — to focused listening.", "Глобальное слушание (уровень 3) добавляет к сосредоточенному внимание к тонким физическим сигналам и обстановке — языку тела, жестам, тому, что вокруг говорящего."),
    tfx("In active listening, Level 1 (internal listening) is the highest level, at which the listener reads body language.", false,
      "False. Level 1, internal listening, is the lowest: the listener interprets the words through his own thoughts. Body language belongs to Level 3, global listening.",
      "Неверно. Уровень 1, внутреннее слушание, — самый низкий: слушатель толкует слова через свои мысли. Язык тела — это уровень 3, глобальное слушание.",
      "\"True\" reverses the scale: global listening (Level 3), not internal, is the highest level.",
      "«Верно» переворачивает шкалу: самый высокий уровень — глобальное слушание (уровень 3), а не внутреннее."),
    qx("Which of the following is NOT one of the four facilitation elements on the slide?", "Reporting", [
      ["Timing", "Timing — set the duration ahead of time and designate a timekeeper — is on the slide.", "Timing — заранее задать длительность и назначить хронометриста — есть на слайде."],
      ["Assisting", "Assisting — keep the meeting productive and let everyone contribute — is on the slide.", "Assisting — держать встречу продуктивной и дать всем высказаться — есть на слайде."],
      ["Rules", "Rules — ground rules on cell phones, start and end times — are on the slide.", "Rules — правила о телефонах, времени начала и конца — есть на слайде."],
    ], "The four elements are goals, rules, timing and assisting. Reporting is not one of them.", "Четыре элемента: goals, rules, timing и assisting. Reporting среди них нет."),
    qx("According to the slide, when does negotiation occur most on an agile project?", "When discussing requirements, feature priorities and “done”", [
      ["When team members are hired and assigned to the project", "Staffing is not mentioned; the slide names requirements, priorities and what \"done\" should look like.", "Подбор людей не упоминается; слайд называет требования, приоритеты и то, как должно выглядеть «готово»."],
      ["When the contract with an outside vendor is being signed", "Contracts can involve negotiation, but the slide names a different situation as the most common.", "В контрактах тоже бывают переговоры, но слайд называет самой частой другую ситуацию."],
      ["When the sprint review shows that defects were missed", "Defects are handled through quality practices; the slide's context is requirements and priorities.", "Дефектами занимаются практики качества; контекст слайда — требования и приоритеты."],
    ], "Slide: negotiation occurs most when discussing requirements or priorities of features and what \"done\" should look like.", "Слайд: переговоры чаще всего идут при обсуждении требований или приоритетов функций и того, как должно выглядеть «готово»."),
    qx("Which statement describes a healthy negotiation, according to the lecture?", "Each party explores options and tradeoffs and presents alternatives", [
      ["Each party holds its first position until the other side gives in", "Holding a position until the other side gives in leaves no room for give and take.", "Стоять на своём, пока другая сторона не сдастся, — значит не оставлять места для взаимных уступок."],
      ["The most senior stakeholder decides, and everyone else accepts it", "Yielding to one influential person is what shared collaboration tries to avoid.", "Подчиниться одному влиятельному человеку — именно то, чего избегает shared collaboration."],
      ["Only the strongest viewpoint is described in full, to save time", "The slide says to allow each viewpoint to be fully described, with pros and cons.", "Слайд велит дать полностью прозвучать каждой точке зрения, с плюсами и минусами."],
    ], "Slide: healthy negotiations allow each party to investigate options and tradeoffs and present alternatives; each viewpoint is fully described; most effective when interactions are positive and there is room for give and take.", "Слайд: здоровые переговоры дают каждой стороне изучить варианты и компромиссы и предложить альтернативы; каждая точка зрения звучит полностью; эффективнее всего при позитивном общении и месте для уступок."),
    qx("What does the lecture say about conflict on agile teams?", "Some conflict is healthy: it makes sure ideas are tested", [
      ["All conflict should be stopped by the project manager", "The slide says some conflict is healthy; the aim is to use it constructively, not to suppress it.", "Слайд говорит, что немного конфликта полезно; цель — использовать его конструктивно, а не подавлять."],
      ["Any conflict is a sign that the team is not self-organizing", "Healthy conflict tests ideas; it is not a symptom of failure.", "Здоровый конфликт проверяет идеи; это не симптом провала."],
      ["Conflict appears only at levels four and five of escalation", "Conflict exists at all five levels; Level 1 is a problem to solve.", "Конфликт есть на всех пяти уровнях; уровень 1 — задача, которую надо решить."],
    ], "Slide: some conflict is healthy and ensures ideas are sufficiently tested; escalated conflict can result in a negative and repressive environment; create an environment where conflict is used constructively.", "Слайд: немного конфликта полезно — идеи проходят достаточную проверку; эскалировавший конфликт создаёт негативную и подавляющую обстановку; нужна среда, где конфликт используют конструктивно."),
    qx("Two developers argue about a framework, and each now wants to win rather than to solve the problem. Which level of conflict is this?", "Level 3 — Contest", [
      ["Level 2 — Disagreement", "At Level 2 people protect themselves and speak guardedly; the wish to win marks Level 3.", "На уровне 2 люди защищают себя и говорят осторожно; желание победить — признак уровня 3."],
      ["Level 4 — Crusade", "At Level 4 the focus moves to protecting one's own group, with ideological language.", "На уровне 4 в центре — защита своей группы, язык идеологический."],
      ["Level 1 — Problem to Solve", "At Level 1 people share information and collaborate on the problem.", "На уровне 1 люди делятся информацией и вместе решают задачу."],
    ], "Level 3, Contest: the aim is to win, and the language includes personal attacks (Speed Leas' model in Griffiths).", "Уровень 3, Contest: цель — победить, в языке появляются личные выпады (модель Спида Лиса у Гриффитса)."),
    qx("Which sequence lists the levels of conflict from the lowest to the highest?", "Problem to Solve, Disagreement, Contest, Crusade, World War", [
      ["Disagreement, Problem to Solve, Contest, Crusade, World War", "Problem to Solve is Level 1; Disagreement comes second.", "Problem to Solve — уровень 1; Disagreement идёт вторым."],
      ["Problem to Solve, Contest, Disagreement, Crusade, World War", "Disagreement (Level 2) comes before Contest (Level 3).", "Disagreement (уровень 2) идёт раньше Contest (уровень 3)."],
      ["Problem to Solve, Disagreement, Crusade, Contest, World War", "Contest (Level 3) comes before Crusade (Level 4).", "Contest (уровень 3) идёт раньше Crusade (уровень 4)."],
    ], "Slide: Level 1 Problem to Solve, Level 2 Disagreement, Level 3 Contest, Level 4 Crusade, Level 5 World War.", "Слайд: уровень 1 Problem to Solve, 2 Disagreement, 3 Contest, 4 Crusade, 5 World War."),
    qx("The backend group now talks only about defending “our side” against the frontend group, in ideological terms. Which level of conflict is this?", "Level 4 — Crusade", [
      ["Level 3 — Contest", "At Level 3 individuals want to win; at Level 4 protecting one's group becomes the focus.", "На уровне 3 отдельные люди хотят победить; на уровне 4 в центре — защита своей группы."],
      ["Level 5 — World War", "At Level 5 the aim is to destroy the other side and communication almost stops.", "На уровне 5 цель — уничтожить другую сторону, и общение почти прекращается."],
      ["Level 2 — Disagreement", "At Level 2 people are guarded and protect themselves, not their group's ideology.", "На уровне 2 люди осторожны и защищают себя, а не идеологию своей группы."],
    ], "Level 4, Crusade: protecting one's own group becomes the focus, and the language is ideological. The usual response is diplomacy.", "Уровень 4, Crusade: в центре — защита своей группы, язык идеологический. Обычная реакция — дипломатия."),
    qx("According to the slide, what can a lack of stakeholder involvement in making decisions lead to?", "Reduced commitment and participation", [
      ["Faster decisions and higher team cohesion", "The slide links involvement and agreement to better cohesion, not the lack of involvement.", "Слайд связывает со сплочённостью участие и согласие, а не их отсутствие."],
      ["A more effective decision-making process", "Excluding stakeholders does not make the process more effective; it lowers commitment.", "Исключение стейкхолдеров не делает процесс эффективнее; оно снижает приверженность."],
      ["Fewer defects in the product", "The slide links missing involvement to lower commitment, not to product quality gains.", "Слайд связывает отсутствие участия со снижением приверженности, а не с ростом качества продукта."],
    ], "Slide: lack of stakeholder involvement in making decisions could lead to reduced commitment and participation.", "Слайд: если стейкхолдеры не участвуют в принятии решений, это может снизить их приверженность и участие."),
    qx("What does “shared collaboration” mean on the slide?", "Striving for group consensus over one person's will", [
      ["Collective agreement on the best possible answer", "That is the slide's definition of convergence, the other half of the title.", "Это определение convergence — второй половины заголовка."],
      ["Sharing every project document with all stakeholders", "Shared collaboration is about how decisions are made, not about sharing documents.", "Shared collaboration — о том, как принимают решения, а не о рассылке документов."],
      ["Splitting each decision between the two team leads", "Two leads deciding is still not group consensus.", "Решение двух лидов — всё ещё не консенсус группы."],
    ], "Slide: shared collaboration — strive for group consensus rather than yielding to the will of a single influential individual. Convergence — collective agreement on the best answer.", "Слайд: shared collaboration — стремиться к консенсусу группы, а не подчиняться воле одного влиятельного человека. Convergence — коллективное согласие о лучшем ответе."),
    qx("Which participatory decision model has the advantage of speed while letting people show their degree of agreement?", "Fist-of-five voting", [
      ["Simple voting", "Simple voting is easy but limits opportunities to refine the decision; it shows only for or against.", "Простое голосование лёгкое, но ограничивает доработку решения и показывает лишь «за» или «против»."],
      ["Highsmith's decision spectrum", "The spectrum's key feature is showing support and reservations at the same time.", "Главная черта спектра — показать поддержку и оговорки одновременно."],
      ["Thumbs up/down/sideways", "Its key phrase is \"quicker than simply polling the group\"; it has only three positions.", "Его ключевая фраза — «быстрее, чем просто опрашивать группу»; у него всего три положения."],
    ], "Slide: fist-of-five voting has the advantage of speed, while allowing people to indicate their degree of agreement (the number of fingers shows the level of support).", "Слайд: fist-of-five быстрое и при этом позволяет показать степень согласия (число пальцев — уровень поддержки)."),
    qx("Which decision model allows people to indicate their support and express reservations at the same time?", "Highsmith's decision spectrum", [
      ["Simple majority voting", "Simple voting gives only for or against and limits opportunities to refine the decision.", "Простое голосование даёт лишь «за» или «против» и ограничивает доработку решения."],
      ["Fist-of-five voting", "Fist-of-five shows a degree of agreement quickly; the slide's \"support and reservations at the same time\" is the spectrum.", "Fist-of-five быстро показывает степень согласия; «поддержка и оговорки одновременно» на слайде — это спектр."],
      ["Thumbs up/down/sideways voting", "Thumbs voting is a quick poll with three positions.", "Голосование большим пальцем — быстрый опрос с тремя положениями."],
    ], "Slide: Highsmith's decision spectrum allows people to both indicate their support and express reservations at the same time.", "Слайд: спектр решений Хайсмита позволяет одновременно выразить поддержку и высказать оговорки."),
    tfx("According to the slide, simple voting is an easy technique, but it limits opportunities to refine the decision.", true,
      "True — that is the slide's exact description of simple voting.",
      "Верно — это точное описание простого голосования на слайде.",
      "\"False\" would deny the slide's own wording; the limitation of simple voting is exactly that it leaves little room to refine the decision.",
      "«Неверно» отрицало бы формулировку слайда: ограничение простого голосования как раз в том, что решение почти нельзя доработать."),
  ],
);

export const lecture10: Lecture = {
  id: "pm-l10",
  title: { en: "Lecture 10 — Stakeholder Engagement", ru: "Лекция 10 — Вовлечение стейкхолдеров (Stakeholder Engagement)" },
  parts: [p1, p2, p3],
};
