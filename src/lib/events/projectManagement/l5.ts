import { part, qx, tfx, type Lecture } from "../types";

/*
 * Лекция 5 курса Project Management (UPr 2301, AITU) — «Organizational Structures».
 * Источник — «Lecture 5 Organizational Structures.pdf» (45 слайдов, по Kerzner,
 * «Project Management: A Systems Approach», 12th ed., гл. 3).
 * Только картинками на слайдах: Fig. 1–8 (оргсхемы: traditional, departmental PM,
 * liaison department «The Expeditor», line/staff «Project Coordinator», pure product,
 * director of project management, project engineering in the project office,
 * philosophy of management — кривые technical vs human skills) и Tables 1–3
 * (преимущества и недостатки product form; project management vs project engineering).
 * В тексте слайдов шрифт с подменой символов: «company's», «organization's»,
 * «aren't», «integration» management, «project leader / project manager / manager»,
 * «project-driven», «wasn't», «solid» — восстановлено по картинкам слайдов и Kerzner.
 * Неоднозначности слайдов (обрезанная фраза о liaison department, ссылка
 * «matrix of previous Figure 5») отмечены в конспекте строками «Exam trap».
 */

const p1 = part(
  "pm-l5-p1",
  { en: "Why structure matters: forces, fit and the language of authority", ru: "Зачем нужна структура: силы, соответствие и язык полномочий" },
  {
    en: `## Why organizational structure is a project topic
A project never runs in a vacuum: it runs inside a company that already has divisions, departments, bosses and reporting lines. The **organizational structure** decides who gives orders to the people on the project, who controls the budget, who evaluates the workers and who settles conflicts between the project and the departments.
The lecture follows Kerzner (*Project Management: A Systems Approach*, ch. 3): first **why** companies had to rethink their structures (Wallace, Grinnell and Apple, Sadler), then the **vocabulary** (authority, responsibility, accountability, trust), then the forms themselves — classical, the work-integration positions, projectized and matrix.
## Wallace: four factors behind the organizational revolution
More than forty years ago, **Wallace** identified **four major factors** that caused the onset of the **organizational revolution**:
| # | Factor | What it contains (slide wording) |
|---|---|---|
| 1 | **The technology revolution** | complexity and variety of products, new materials and processes, and the effects of massive research |
| 2 | **Competition and the profit squeeze** | saturated markets, inflation of wage and material costs, and production efficiency |
| 3 | **The high cost of marketing** | no sub-items on the slide |
| 4 | **The unpredictability of consumer demands** | due to high income, wide range of choices available, and shifting tastes |
- In IT terms: new frameworks and cloud services every year (technology revolution), app stores full of competitors and rising developer salaries (profit squeeze), expensive user acquisition and advertising (high cost of marketing), users who switch to another app overnight (unpredictable demand).
- The common thread: a company built for stable, repetitive work cannot react fast enough to this environment, so it has to reorganize around **projects**.
> Memory hook: **T-C-M-U** — Technology revolution, Competition and the profit squeeze, Marketing cost, Unpredictable consumer demands.
> Exam trap: "globalization", "government regulation" or "shortage of project managers" are not on Wallace's list. "Inflation of wage and material costs" is not a separate factor — it sits inside *competition and the profit squeeze*; "shifting tastes" sits inside *unpredictability of consumer demands*; "massive research" sits inside *the technology revolution*.
## Grinnell and Apple: five signs the traditional structure is not adequate
According to **Grinnell and Apple**, there are **five general indications** that the traditional structure may not be adequate for managing projects:
- Management is satisfied with its technical skills, but projects are not meeting **time, cost, and other project requirements**.
- There is a high commitment to getting project work done, but **great fluctuations** in how well performance specifications are met.
- Highly talented specialists involved in the project **feel exploited and misused**.
- Particular technical groups or individuals **constantly blame each other** for failure to meet specifications or delivery dates.
- Projects are **on time and to specifications**, but groups and individuals **aren't satisfied** with the achievement.
Notice the pattern: each sign reads "something is fine, but something else is not". Technical skill is fine, but the project misses its targets; commitment is high, but quality jumps around; even a delivery on time and to spec is a warning if the people are unhappy. The problem lies in the **structure**, not in the talent of the people.
| Sign | What you would see in a software company |
|---|---|
| Good technical skills, missed time and cost | strong engineers, yet every release is late and over budget |
| High commitment, fluctuating performance | everyone works overtime, but one release is solid and the next is full of bugs |
| Specialists feel exploited and misused | the best DevOps engineer is pulled into five projects at once and burns out |
| Groups constantly blame each other | backend says "frontend broke the API contract", QA says "dev handed over late" |
| On time and to spec, but no satisfaction | the release shipped, but nobody owned it and nobody was recognised |
> Exam trap: the fifth sign surprises students — a project can be **on time and to specifications** and still be an indication of a structural problem, because groups and individuals are not satisfied with the achievement.
Grinnell and Apple appear again later in the lecture with a different list — the **four situations** in which it is most practical to consider a **matrix**. Do not mix up the "five indications" (traditional structure may be inadequate) with the "four situations" (consider a matrix).
## Sadler: there is no ideal structure
According to **Sadler**: since the relative influence of these (**sociotechnical**) factors change from situation to situation, **there can be no such thing as an ideal structure** making for effectiveness in organizations of all kinds, or even appropriate to a single type of organization at different stages in its development.
- The sentence makes two claims: no structure is best for **organizations of all kinds**, and no structure stays best for **one organization at different stages of its development**.
- IT example: a five-person startup works well with everyone reporting to the founder; at 300 people with ten parallel client projects the same structure collapses. Neither structure is "ideal" — each one fits a stage.
Sadler has prepared a **six-question checklist** that explores a company's **tasks, social climate, and relationship to the environment**:
| # | Sadler's question | Looks at |
|---|---|---|
| 1 | To what extent does the task of organization call for **close control** if it is to be performed efficiently? | the task |
| 2 | What are the **needs and attitudes of the people** performing the tasks? What are the likely effects of control mechanisms on their motivation and performance? | people |
| 3 | What are the **natural social groupings** with which people identify themselves? To what extent are satisfying social relationships important in relation to motivation and performance? | social climate |
| 4 | What aspect of the organization's activities needs to be **closely integrated** if the overall task is to be achieved? | integration of the task |
| 5 | What organizational measures can be developed that will provide an appropriate measure of **control and integration** of work activities, while at the same time **meeting the needs of people** and providing adequate motivation? | balance of task and people |
| 6 | What **environmental changes** are likely to affect the future trend of company operations? What organizational measures can be taken to insure that the enterprise responds to these effectively? | relationship to the environment |
> Memory hook: Sadler's six questions — **control, people, groups, integration, balance, environment**.
## The vocabulary: authority, responsibility, accountability
In the discussion of organizational structures, the following definitions will be used:
> **Authority** is the power granted to individuals (possibly by their position) so that they can make final decisions.
> **Responsibility** is the obligation incurred by individuals in their roles in the formal organization to effectively perform assignments.
> **Accountability** is being answerable for the satisfactory completion of a specific assignment.
= Accountability = Authority + Responsibility
| Term | Key words to recognise | Question it answers |
|---|---|---|
| Authority | power **granted**, possibly by **position**; make **final decisions** | "Who may decide?" |
| Responsibility | **obligation** incurred in a role in the **formal organization**; effectively **perform assignments** | "Who must do the work?" |
| Accountability | being **answerable** for the **satisfactory completion** of a specific assignment | "Who answers for the result?" |
- Example: a team lead is told to deliver the payment module (responsibility) and is allowed to choose the library, assign tasks and approve overtime (authority). Only with both can she fairly be held **accountable** — answerable for whether the module is completed satisfactorily.
- Responsibility without authority is the classic trap of project managers in functional companies: they must deliver, but they cannot decide who works on the project or in what order.
> Exam trap: accountability is not "responsibility alone", not "authority minus responsibility" and not a synonym for authority. The slide formula is **Accountability = authority + responsibility**. "Final decisions" belongs to authority; "obligation to perform assignments" belongs to responsibility; "answerable for satisfactory completion" belongs to accountability.
## Trust between project and functional managers
Wherever a project manager needs people who belong to functional departments, the two managers have to work together. **Trust is the key to success here.** The normal progression in the growth of trust is as follows:
| Step | What happens (slide wording) |
|---|---|
| 1 | Even though a problem exists, both the project and functional managers **deny** that any problem exists. |
| 2 | When the problem finally surfaces, each manager **blames** the other. |
| 3 | As trust develops, both managers readily **admit responsibility** for the problems. |
| 4 | The project and functional managers **meet face-to-face** to work out the problem. |
| 5 | The project and functional managers begin to formally and informally **anticipate** problems. |
> Memory hook: **Deny → Blame → Admit → Meet → Anticipate**.
- IT example: a database migration is slipping. At first neither the PM nor the head of the DBA team says anything (deny); after the outage each blames the other (blame); later the DBA lead says "we under-estimated the indexes" and the PM says "I gave you the requirements late" (admit); they sit down together to replan (meet); before the next migration they hold a risk review in advance (anticipate).
> Exam trap: the last step is **anticipating** problems, formally and informally — not just solving them. "Meet face-to-face" is step 4, not the end point, and "admit responsibility" comes only after the blaming stage.
?? A software house has excellent engineers, yet every release is late and over budget, and the teams constantly blame each other. Whose list does this match, and what does it suggest?
?= Grinnell and Apple's five indications that the traditional structure may not be adequate for managing projects (good technical skills but missed time and cost; groups blaming each other). It points to a structural problem, not a talent problem.
?? A manager has the obligation to deliver a module and the power to make final decisions about it. What does this combination give?
?= Accountability — being answerable for the satisfactory completion of a specific assignment. Accountability = authority + responsibility.
?? Why does Sadler say there is no ideal organizational structure?
?= Because the relative influence of sociotechnical factors changes from situation to situation, so no structure is effective for organizations of all kinds, or even for one organization at different stages of its development.
## Exam focus
- Wallace: **four** factors of the organizational revolution — the technology revolution; competition and the profit squeeze; the high cost of marketing; the unpredictability of consumer demands. Know which sub-items belong to which factor.
- Grinnell and Apple: **five** indications that the traditional structure may not be adequate — including "on time and to specifications, but not satisfied". Later: **four** situations for a matrix.
- Sadler: no ideal structure, because sociotechnical factors change; a **six-question** checklist on a company's tasks, social climate and relationship to the environment.
- Definitions word for word: authority — power to make **final decisions**; responsibility — **obligation** to perform assignments; accountability — **answerable** for satisfactory completion; **accountability = authority + responsibility**.
- Trust grows in **five** steps: deny → blame → admit responsibility → meet face-to-face → anticipate problems.`,
    ru: `## Почему организационная структура — тема проектного менеджмента
Проект никогда не идёт в вакууме: он идёт внутри компании, где уже есть подразделения, отделы, начальники и линии подчинения. **Организационная структура (organizational structure)** решает, кто отдаёт распоряжения людям проекта, кто управляет бюджетом, кто оценивает работников и кто разрешает конфликты между проектом и отделами.
Лекция идёт по Кернцнеру (*Project Management: A Systems Approach*, гл. 3): сначала **почему** компаниям пришлось пересмотреть свои структуры (Wallace, Grinnell and Apple, Sadler), затем **словарь** (authority, responsibility, accountability, доверие), затем сами формы — классическая, должности интеграции работ, проектная (projectized) и матричная (matrix).
## Уоллес (Wallace): четыре фактора организационной революции
Более сорока лет назад **Уоллес** выделил **четыре главных фактора (four major factors)**, которые вызвали начало **организационной революции (organizational revolution)**:
| № | Фактор | Что в него входит (формулировка слайда) |
|---|---|---|
| 1 | **Технологическая революция (the technology revolution)** | сложность и разнообразие продуктов, новые материалы и процессы, последствия массовых исследований (massive research) |
| 2 | **Конкуренция и сжатие прибыли (competition and the profit squeeze)** | насыщенные рынки, рост зарплат и стоимости материалов (inflation of wage and material costs), эффективность производства |
| 3 | **Высокая стоимость маркетинга (the high cost of marketing)** | подпунктов на слайде нет |
| 4 | **Непредсказуемость потребительского спроса (the unpredictability of consumer demands)** | из-за высоких доходов, широкого выбора и меняющихся вкусов (shifting tastes) |
- В терминах IT: каждый год новые фреймворки и облачные сервисы (технологическая революция), магазины приложений забиты конкурентами, а зарплаты разработчиков растут (сжатие прибыли), привлечение пользователей и реклама дороги (стоимость маркетинга), пользователи за ночь уходят в другое приложение (непредсказуемый спрос).
- Общая нить: компания, построенная под стабильную повторяющуюся работу, не успевает за такой средой, и ей приходится перестраиваться вокруг **проектов**.
> Запомнить: **T-C-M-U** — Technology revolution, Competition and the profit squeeze, Marketing cost, Unpredictable consumer demands.
> Ловушка экзамена: «глобализации», «государственного регулирования» или «нехватки проектных менеджеров» в списке Уоллеса нет. «Рост зарплат и стоимости материалов» — не отдельный фактор, он внутри *конкуренции и сжатия прибыли*; «меняющиеся вкусы» — внутри *непредсказуемости спроса*; «массовые исследования» — внутри *технологической революции*.
## Гриннелл и Эппл (Grinnell and Apple): пять признаков, что традиционная структура не справляется
По **Гриннеллу и Эпплу**, есть **пять общих признаков (five general indications)** того, что традиционная структура может не подходить для управления проектами:
- Руководство довольно своей технической квалификацией, но проекты не укладываются в **сроки, стоимость и другие требования проекта (time, cost, and other project requirements)**.
- Высокая готовность выполнять проектную работу, но **сильные колебания (great fluctuations)** в том, насколько выполняются требования к характеристикам (performance specifications).
- Высококлассные специалисты проекта **чувствуют, что их эксплуатируют и используют не по назначению (feel exploited and misused)**.
- Отдельные технические группы или люди **постоянно обвиняют друг друга (constantly blame each other)** в срыве спецификаций или сроков поставки.
- Проекты идут **в срок и по спецификациям (on time and to specifications)**, но группы и люди **не удовлетворены (aren't satisfied)** результатом.
Обратите внимание на рисунок: каждый признак звучит как «одно в порядке, а другое нет». Квалификация в порядке — но проект срывает цели; готовность высокая — но качество скачет; даже поставка в срок и по спецификации — тревожный сигнал, если люди недовольны. Проблема в **структуре**, а не в таланте людей.
| Признак | Как это выглядит в софтверной компании |
|---|---|
| Хорошая квалификация, сорваны сроки и стоимость | сильные инженеры, но каждый релиз опаздывает и выходит за бюджет |
| Высокая готовность, скачущее качество | все перерабатывают, но один релиз стабилен, а следующий полон багов |
| Специалисты чувствуют себя использованными | лучшего DevOps-инженера тянут в пять проектов сразу, и он выгорает |
| Группы постоянно обвиняют друг друга | бэкенд говорит «фронтенд сломал контракт API», QA — «разработка поздно передала» |
| В срок и по спецификации, но без удовлетворения | релиз вышел, но им никто не владел и никого не отметили |
> Ловушка экзамена: пятый признак удивляет студентов — проект может идти **в срок и по спецификациям** и всё равно указывать на проблему структуры, потому что группы и люди не удовлетворены результатом.
Гриннелл и Эппл появляются в лекции ещё раз — с другим списком: **четыре ситуации (four situations)**, в которых разумнее всего рассмотреть **матрицу**. Не путайте «пять признаков» (традиционная структура может не подходить) и «четыре ситуации» (стоит рассмотреть матрицу).
## Сэдлер (Sadler): идеальной структуры не бывает
По **Сэдлеру**: поскольку относительное влияние этих (**социотехнических, sociotechnical**) факторов меняется от ситуации к ситуации, **не может быть идеальной структуры (no such thing as an ideal structure)**, которая обеспечивала бы эффективность в организациях любого рода или хотя бы подходила одному типу организации на разных стадиях его развития.
- В этой фразе два утверждения: ни одна структура не лучшая для **организаций любого рода**, и ни одна не остаётся лучшей для **одной организации на разных стадиях её развития**.
- Пример из IT: стартапу из пяти человек хорошо, когда все подчиняются основателю; при 300 сотрудниках и десяти параллельных клиентских проектах та же структура разваливается. Ни одна из структур не «идеальна» — каждая подходит своей стадии.
Сэдлер составил **чек-лист из шести вопросов (six-question checklist)**, который исследует **задачи компании, социальный климат и связь с внешней средой (tasks, social climate, and relationship to the environment)**:
| № | Вопрос Сэдлера | О чём он |
|---|---|---|
| 1 | Насколько задача организации требует **плотного контроля (close control)**, чтобы выполняться эффективно? | задача |
| 2 | Каковы **потребности и установки людей (needs and attitudes of the people)**, выполняющих задачи? Как механизмы контроля скорее всего повлияют на их мотивацию и результаты? | люди |
| 3 | С какими **естественными социальными группами (natural social groupings)** люди себя отождествляют? Насколько важны удовлетворяющие социальные отношения для мотивации и результатов? | социальный климат |
| 4 | Какую сторону деятельности организации нужно **тесно интегрировать (closely integrated)**, чтобы общая задача была выполнена? | интеграция задачи |
| 5 | Какие организационные меры дадут нужную степень **контроля и интеграции (control and integration)** работ и при этом **удовлетворят потребности людей (meeting the needs of people)** и обеспечат достаточную мотивацию? | баланс задачи и людей |
| 6 | Какие **изменения внешней среды (environmental changes)** скорее всего повлияют на будущее компании? Какие организационные меры помогут ей эффективно на них отвечать? | связь со средой |
> Запомнить: шесть вопросов Сэдлера — **контроль, люди, группы, интеграция, баланс, среда**.
## Словарь: полномочия, ответственность, подотчётность
При обсуждении организационных структур используются такие определения:
> **Полномочия (authority)** — власть, предоставленная людям (возможно, их должностью), чтобы они могли принимать окончательные решения (make final decisions).
> **Ответственность (responsibility)** — обязанность, которую люди принимают на себя своей ролью в формальной организации, — эффективно выполнять поручения (obligation … to effectively perform assignments).
> **Подотчётность (accountability)** — необходимость отвечать за удовлетворительное выполнение конкретного поручения (being answerable for the satisfactory completion of a specific assignment).
= Accountability = Authority + Responsibility
| Термин | Ключевые слова | На какой вопрос отвечает |
|---|---|---|
| Authority (полномочия) | власть **предоставлена (granted)**, возможно, **должностью (position)**; принимать **окончательные решения** | «Кто вправе решать?» |
| Responsibility (ответственность) | **обязанность (obligation)** по роли в **формальной организации**; эффективно **выполнять поручения** | «Кто обязан сделать работу?» |
| Accountability (подотчётность) | **отвечать (answerable)** за **удовлетворительное выполнение** конкретного поручения | «Кто отвечает за результат?» |
- Пример: тимлиду поручили сдать платёжный модуль (ответственность) и разрешили выбирать библиотеку, распределять задачи и одобрять переработки (полномочия). Только при наличии обоих её можно честно сделать **подотчётной** — отвечающей за то, удовлетворительно ли выполнен модуль.
- Ответственность без полномочий — классическая ловушка проектных менеджеров в функциональных компаниях: сдать результат они обязаны, а решать, кто работает на проекте и в каком порядке, не могут.
> Ловушка экзамена: accountability — это не «одна ответственность», не «полномочия минус ответственность» и не синоним полномочий. Формула слайда: **Accountability = authority + responsibility**. «Окончательные решения» — это authority; «обязанность выполнять поручения» — responsibility; «отвечать за удовлетворительное выполнение» — accountability.
## Доверие между проектным и функциональным менеджерами
Там, где проектному менеджеру нужны люди из функциональных отделов, двум менеджерам приходится работать вместе. **Доверие — ключ к успеху (trust is the key to success).** Обычный путь роста доверия такой:
| Шаг | Что происходит (формулировка слайда) |
|---|---|
| 1 | Хотя проблема есть, и проектный, и функциональный менеджеры **отрицают (deny)**, что она существует. |
| 2 | Когда проблема наконец всплывает, каждый менеджер **обвиняет (blames)** другого. |
| 3 | По мере роста доверия оба охотно **признают ответственность (admit responsibility)** за проблемы. |
| 4 | Проектный и функциональный менеджеры **встречаются лицом к лицу (meet face-to-face)**, чтобы решить проблему. |
| 5 | Проектный и функциональный менеджеры начинают формально и неформально **предвидеть (anticipate)** проблемы. |
> Запомнить: **Отрицать → Обвинять → Признать → Встретиться → Предвидеть**.
- Пример из IT: миграция базы данных буксует. Сначала ни PM, ни руководитель команды DBA ничего не говорят (отрицание); после сбоя каждый обвиняет другого (обвинение); позже лид DBA говорит «мы недооценили индексы», а PM — «я поздно отдал вам требования» (признание); они садятся вместе и перепланируют (встреча); перед следующей миграцией заранее проводят разбор рисков (предвидение).
> Ловушка экзамена: последний шаг — **предвидеть** проблемы, формально и неформально, а не просто решать их. «Встретиться лицом к лицу» — шаг 4, а не конец, а «признать ответственность» наступает только после этапа обвинений.
?? У софтверной компании отличные инженеры, но каждый релиз опаздывает и выходит за бюджет, а команды постоянно обвиняют друг друга. Чьему списку это соответствует и что это значит?
?= Пяти признакам Гриннелла и Эппла, что традиционная структура может не подходить для управления проектами (хорошая квалификация, но сорваны сроки и стоимость; группы обвиняют друг друга). Это указывает на проблему структуры, а не таланта.
?? У менеджера есть обязанность сдать модуль и власть принимать по нему окончательные решения. Что даёт это сочетание?
?= Подотчётность (accountability) — необходимость отвечать за удовлетворительное выполнение конкретного поручения. Accountability = authority + responsibility.
?? Почему Сэдлер говорит, что идеальной организационной структуры не бывает?
?= Потому что относительное влияние социотехнических факторов меняется от ситуации к ситуации, поэтому ни одна структура не эффективна для организаций любого рода и даже для одной организации на разных стадиях её развития.
## Фокус экзамена
- Уоллес: **четыре** фактора организационной революции — технологическая революция; конкуренция и сжатие прибыли; высокая стоимость маркетинга; непредсказуемость потребительского спроса. Знайте, какой подпункт к какому фактору относится.
- Гриннелл и Эппл: **пять** признаков, что традиционная структура может не подходить, — включая «в срок и по спецификациям, но без удовлетворения». Позже: **четыре** ситуации для матрицы.
- Сэдлер: идеальной структуры нет, потому что социотехнические факторы меняются; чек-лист из **шести вопросов** о задачах компании, социальном климате и связи со средой.
- Определения дословно: authority — власть принимать **окончательные решения**; responsibility — **обязанность** выполнять поручения; accountability — **отвечать** за удовлетворительное выполнение; **accountability = authority + responsibility**.
- Доверие растёт в **пять** шагов: отрицание → обвинение → признание ответственности → встреча лицом к лицу → предвидение проблем.`,
  },
  [
    qx("Which of the following is NOT one of the four factors that Wallace says caused the onset of the organizational revolution?", "A shortage of qualified project managers", [
      ["The high cost of marketing", "This is Wallace's third factor, listed on the slide without sub-items.", "Это третий фактор Уоллеса, на слайде он дан без подпунктов."],
      ["The technology revolution", "This is Wallace's first factor: complexity and variety of products, new materials and processes, effects of massive research.", "Это первый фактор Уоллеса: сложность и разнообразие продуктов, новые материалы и процессы, последствия массовых исследований."],
      ["The unpredictability of consumer demands", "This is Wallace's fourth factor: high income, a wide range of choices and shifting tastes.", "Это четвёртый фактор Уоллеса: высокие доходы, широкий выбор и меняющиеся вкусы."],
    ], "Wallace's four factors are the technology revolution, competition and the profit squeeze, the high cost of marketing, and the unpredictability of consumer demands. A shortage of project managers is not on the list.", "Четыре фактора Уоллеса: технологическая революция, конкуренция и сжатие прибыли, высокая стоимость маркетинга и непредсказуемость потребительского спроса. Нехватки проектных менеджеров в списке нет."),
    qx("Saturated markets, inflation of wage and material costs, and production efficiency are grouped by Wallace under which factor?", "Competition and the profit squeeze", [
      ["The technology revolution", "The technology revolution covers complexity and variety of products, new materials and processes, and massive research — not wages or saturated markets.", "Технологическая революция — это сложность и разнообразие продуктов, новые материалы и процессы, массовые исследования, а не зарплаты и насыщенные рынки."],
      ["The high cost of marketing", "This is a separate factor with no sub-items on the slide; saturated markets and wage inflation belong to the profit squeeze.", "Это отдельный фактор без подпунктов; насыщенные рынки и рост зарплат относятся к сжатию прибыли."],
      ["The unpredictability of consumer demands", "Consumer unpredictability comes from high income, a wide range of choices and shifting tastes, not from costs.", "Непредсказуемость спроса вызвана высокими доходами, широким выбором и меняющимися вкусами, а не затратами."],
    ], "Slide: competition and the profit squeeze (saturated markets, inflation of wage and material costs, and production efficiency).", "Слайд: competition and the profit squeeze (насыщенные рынки, рост зарплат и стоимости материалов, эффективность производства)."),
    qx("According to Grinnell and Apple, how many general indications suggest that the traditional structure may not be adequate for managing projects?", "Five", [
      ["Four", "Four is the number of situations in which Grinnell and Apple say a matrix is most practical — a different list.", "Четыре — это число ситуаций, в которых, по Гриннеллу и Эпплу, разумнее всего рассмотреть матрицу; это другой список."],
      ["Six", "Six is the number of questions in Sadler's checklist, not Grinnell and Apple's indications.", "Шесть — число вопросов в чек-листе Сэдлера, а не признаков Гриннелла и Эппла."],
      ["Three", "The slide lists five indications, from missed time and cost targets to groups that are not satisfied.", "На слайде пять признаков — от сорванных сроков и стоимости до неудовлетворённых групп."],
    ], "Grinnell and Apple list five general indications that the traditional structure may not be adequate for managing projects.", "Гриннелл и Эппл называют пять общих признаков, что традиционная структура может не подходить для управления проектами."),
    qx("Which of the following is NOT one of Grinnell and Apple's indications that the traditional structure may be inadequate?", "Specialists complain that their technical skills are outdated", [
      ["Talented specialists on the project feel exploited and misused", "This is the third indication on the slide, word for word.", "Это третий признак со слайда, почти дословно."],
      ["Technical groups constantly blame each other for missed dates", "This is the fourth indication: groups or individuals blame each other for failing specifications or delivery dates.", "Это четвёртый признак: группы или люди обвиняют друг друга в срыве спецификаций или сроков."],
      ["Commitment is high but performance specifications fluctuate", "This is the second indication: high commitment, but great fluctuations in meeting performance specifications.", "Это второй признак: высокая готовность, но сильные колебания в выполнении требований к характеристикам."],
    ], "The first indication is the opposite: management is satisfied with its technical skills, yet projects miss time, cost and other requirements. Outdated skills are not on the list.", "Первый признак говорит обратное: руководство довольно технической квалификацией, но проекты срывают сроки, стоимость и другие требования. Устаревших навыков в списке нет."),
    qx("An IT company delivers its projects on time and to specifications, but the teams say nobody valued their work and they are not satisfied. How do Grinnell and Apple read this?", "A sign the traditional structure may not suit projects", [
      ["Proof that the structure works and needs no change", "Being on time and to spec is not enough: the fifth indication is exactly \"on time and to specifications, but not satisfied\".", "Срока и спецификации мало: пятый признак — ровно «в срок и по спецификациям, но без удовлетворения»."],
      ["A sign that the company should hire stronger engineers", "The indications point to the structure, not to a lack of technical talent; management may well be satisfied with its skills.", "Признаки указывают на структуру, а не на нехватку таланта; руководство вполне может быть довольно квалификацией."],
      ["A normal stage in the growth of trust between managers", "The trust stages (deny, blame, admit, meet, anticipate) are about two managers handling a problem, not about team satisfaction.", "Этапы доверия (отрицать, обвинять, признать, встретиться, предвидеть) — о том, как два менеджера разбираются с проблемой, а не об удовлетворённости команды."],
    ], "The fifth indication: projects are on time and to specifications, but groups and individuals aren't satisfied with the achievement — the traditional structure may not be adequate.", "Пятый признак: проекты в срок и по спецификациям, но группы и люди не удовлетворены результатом — традиционная структура может не подходить."),
    qx("Why does Sadler conclude that there can be no such thing as an ideal organizational structure?", "The influence of sociotechnical factors changes by situation", [
      ["Every structure becomes too costly to run as the company grows", "Cost is the major disadvantage of the projectized form, not Sadler's argument about structures in general.", "Стоимость — главный недостаток проектной структуры, а не довод Сэдлера о структурах вообще."],
      ["Only a matrix can balance technology, time and cost", "Sadler's point is that no single form fits all; the matrix is later called a compromise, not the ideal.", "Сэдлер как раз говорит, что ни одна форма не подходит всем; матрицу позже называют компромиссом, а не идеалом."],
      ["Structures depend only on the number of projects run", "Sadler speaks of sociotechnical factors — tasks, people, social climate, environment — not only project count.", "Сэдлер говорит о социотехнических факторах — задачах, людях, климате, среде, — а не только о числе проектов."],
    ], "Sadler: since the relative influence of sociotechnical factors changes from situation to situation, no structure is ideal for organizations of all kinds, or even for one organization at different stages of its development.", "Сэдлер: раз относительное влияние социотехнических факторов меняется от ситуации к ситуации, ни одна структура не идеальна для организаций любого рода и даже для одной организации на разных стадиях развития."),
    qx("Sadler's six-question checklist explores a company's tasks, its social climate and its…", "relationship to the environment", [
      ["profit centers and cost structure", "Profit centers appear later, in the matrix section (each project is a potential profit center), not in Sadler's checklist.", "Центры прибыли появляются позже, в разделе о матрице (каждый проект — потенциальный центр прибыли), а не в чек-листе Сэдлера."],
      ["product mix and new technology", "Technology is one of Wallace's factors; Sadler's checklist looks at tasks, social climate and the environment.", "Технология — один из факторов Уоллеса; чек-лист Сэдлера смотрит на задачи, социальный климат и среду."],
      ["span of control at each level", "Span of control is not mentioned; close control appears only as one question, about the task.", "Норма управляемости не упоминается; плотный контроль — лишь один из вопросов, о задаче."],
    ], "Slide: Sadler has prepared a six-question checklist that explores a company's tasks, social climate, and relationship to the environment.", "Слайд: Сэдлер составил чек-лист из шести вопросов о задачах компании, социальном климате и связи с внешней средой."),
    qx("Which question is part of Sadler's checklist for designing an organizational structure?", "Which natural social groupings do people identify with?", [
      ["Who has more influence over workers' daily performance?", "This question decides whether a matrix is strong, weak or balanced; it is not one of Sadler's six.", "Этот вопрос определяет, сильная, слабая или сбалансированная матрица; среди шести вопросов Сэдлера его нет."],
      ["Which department should a project leader return to?", "This relates to departmental project management (temporary project leaders), not to Sadler's checklist.", "Это про департаментное управление проектами (временные project leaders), а не про чек-лист Сэдлера."],
      ["How much does duplicating staff on each project cost?", "Duplication of personnel is a disadvantage of the projectized form (Table 2), not a Sadler question.", "Дублирование персонала — недостаток проектной формы (Table 2), а не вопрос Сэдлера."],
    ], "Sadler's third question: what are the natural social groupings with which people identify themselves, and how important are satisfying social relationships to motivation and performance?", "Третий вопрос Сэдлера: с какими естественными социальными группами люди себя отождествляют и насколько важны удовлетворяющие отношения для мотивации и результатов?"),
    qx("Which of Sadler's questions deals with the company's relationship to the environment?", "What environmental changes may affect future operations?", [
      ["What aspect of activities must be closely integrated?", "This is Sadler's fourth question, about integrating the task, not about the environment.", "Это четвёртый вопрос Сэдлера — об интеграции задачи, а не о среде."],
      ["Does the task call for close control to be efficient?", "This is Sadler's first question, about the task and the need for control.", "Это первый вопрос Сэдлера — о задаче и потребности в контроле."],
      ["What are the needs and attitudes of the people doing the tasks?", "This is Sadler's second question, about the people performing the tasks.", "Это второй вопрос Сэдлера — о людях, выполняющих задачи."],
    ], "Sadler's sixth question: what environmental changes are likely to affect the future trend of company operations, and what measures will let the enterprise respond effectively?", "Шестой вопрос Сэдлера: какие изменения среды скорее всего повлияют на будущее компании и какие меры помогут эффективно на них ответить?"),
    qx("\"The power granted to individuals (possibly by their position) so that they can make final decisions\" is the lecture's definition of:", "Authority", [
      ["Responsibility", "Responsibility is the obligation incurred in a role in the formal organization to effectively perform assignments.", "Responsibility — обязанность по роли в формальной организации эффективно выполнять поручения."],
      ["Accountability", "Accountability is being answerable for the satisfactory completion of a specific assignment.", "Accountability — необходимость отвечать за удовлетворительное выполнение конкретного поручения."],
      ["Control", "Control is not one of the three defined terms; the key words \"final decisions\" mark authority.", "Control не входит в три определённых термина; ключевые слова «окончательные решения» указывают на authority."],
    ], "Authority is the power granted to individuals (possibly by their position) so that they can make final decisions.", "Authority — власть, предоставленная людям (возможно, их должностью), чтобы они могли принимать окончательные решения."),
    qx("\"The obligation incurred by individuals in their roles in the formal organization to effectively perform assignments\" defines:", "Responsibility", [
      ["Authority", "Authority is the power to make final decisions, not an obligation to perform.", "Authority — власть принимать окончательные решения, а не обязанность выполнять."],
      ["Accountability", "Accountability adds being answerable for satisfactory completion; it equals authority plus responsibility.", "Accountability — это ещё и ответ за удовлетворительное выполнение; она равна authority плюс responsibility."],
      ["Commitment", "Commitment is not a defined term in the lecture; \"obligation … to perform assignments\" is responsibility.", "Commitment в лекции не определяется; «обязанность выполнять поручения» — это responsibility."],
    ], "Responsibility is the obligation incurred by individuals in their roles in the formal organization to effectively perform assignments.", "Responsibility — обязанность, которую люди принимают своей ролью в формальной организации, эффективно выполнять поручения."),
    qx("Which formula is given in the lecture?", "Accountability = authority + responsibility", [
      ["Authority = responsibility + accountability", "The terms are swapped: authority is one of the two parts of accountability, not their sum.", "Термины переставлены: authority — одна из двух частей accountability, а не их сумма."],
      ["Responsibility = authority + accountability", "Responsibility is the obligation to perform; it is a component of accountability, not the result.", "Responsibility — обязанность выполнять; это составляющая accountability, а не результат."],
      ["Accountability = responsibility − authority", "Authority is added, not subtracted: being answerable needs both the power to decide and the obligation to perform.", "Authority прибавляется, а не вычитается: чтобы отвечать, нужны и власть решать, и обязанность выполнять."],
    ], "Slide: Accountability is being answerable for the satisfactory completion of a specific assignment (Accountability = authority + responsibility).", "Слайд: accountability — отвечать за удовлетворительное выполнение конкретного поручения (Accountability = authority + responsibility)."),
    qx("A team lead must deliver the reporting module but cannot assign developers or approve changes — every decision goes to the department head. What is she missing to be fairly held accountable?", "Authority to make final decisions on the work", [
      ["Responsibility for performing the assignment", "She already has the obligation to deliver — that is responsibility. What is missing is the power to decide.", "Обязанность сдать модуль у неё уже есть — это responsibility. Не хватает власти решать."],
      ["A face-to-face meeting with the department head", "Meeting face-to-face is the fourth stage of trust; it does not give her decision power.", "Встреча лицом к лицу — четвёртый этап доверия; власти решать она не даёт."],
      ["A written six-question checklist from Sadler", "Sadler's checklist is for designing a structure, not for granting a person decision rights.", "Чек-лист Сэдлера нужен для проектирования структуры, а не для передачи человеку права решать."],
    ], "Accountability = authority + responsibility. She has the responsibility (obligation to perform) but not the authority (power to make final decisions), so she cannot fairly be answerable for the result.", "Accountability = authority + responsibility. Ответственность (обязанность выполнить) у неё есть, а полномочий (власти принимать окончательные решения) нет, поэтому честно спрашивать с неё за результат нельзя."),
    qx("In the normal progression in the growth of trust between project and functional managers, what happens first?", "Both managers deny that any problem exists", [
      ["Each manager blames the other for the problem", "Blaming is step 2 — it happens when the problem finally surfaces.", "Обвинения — шаг 2: они начинаются, когда проблема наконец всплывает."],
      ["Both managers readily admit responsibility", "Admitting responsibility is step 3, which comes only as trust develops.", "Признание ответственности — шаг 3, он наступает только по мере роста доверия."],
      ["They meet face-to-face to work out the problem", "Meeting face-to-face is step 4, after the blame and admission stages.", "Встреча лицом к лицу — шаг 4, после этапов обвинения и признания."],
    ], "Step 1: even though a problem exists, both the project and functional managers deny that any problem exists.", "Шаг 1: хотя проблема есть, и проектный, и функциональный менеджеры отрицают, что она существует."),
    qx("What is the final stage in the growth of trust between project and functional managers?", "They formally and informally anticipate problems", [
      ["They meet face-to-face to work out the problem", "This is step 4; the last step goes further — problems are anticipated before they appear.", "Это шаг 4; последний шаг идёт дальше — проблемы предвидят до их появления."],
      ["They readily admit responsibility for problems", "This is step 3, the turning point after blaming, not the end of the progression.", "Это шаг 3, перелом после обвинений, а не конец пути."],
      ["They refer every conflict to the general manager", "Referring conflicts upward is not a trust stage; in the matrix it is how projects reporting to the GM resolve conflicts.", "Передача конфликтов наверх — не этап доверия; так конфликты решаются в матрице, где PM подчиняются генеральному менеджеру."],
    ], "Step 5: the project and functional managers begin to formally and informally anticipate problems.", "Шаг 5: проектный и функциональный менеджеры начинают формально и неформально предвидеть проблемы."),
    qx("Which sequence shows the normal growth of trust between project and functional managers?", "Deny → blame → admit → meet → anticipate", [
      ["Blame → deny → meet → admit → anticipate", "Denial comes first, while the problem is still hidden; blame starts only when it surfaces.", "Сначала отрицание, пока проблема скрыта; обвинения начинаются, только когда она всплывает."],
      ["Deny → admit → blame → meet → anticipate", "Admitting responsibility comes after blaming, as trust develops — not before it.", "Признание ответственности идёт после обвинений, по мере роста доверия, а не до них."],
      ["Deny → blame → meet → admit → anticipate", "Managers admit responsibility (step 3) before they meet face-to-face to work it out (step 4).", "Менеджеры признают ответственность (шаг 3) до того, как встречаются лицом к лицу (шаг 4)."],
    ], "The slide order: deny that a problem exists → blame each other → readily admit responsibility → meet face-to-face → formally and informally anticipate problems.", "Порядок слайда: отрицают проблему → обвиняют друг друга → охотно признают ответственность → встречаются лицом к лицу → формально и неформально предвидят проблемы."),
    qx("After a failed release, the PM says \"I gave QA the build too late\" and the QA lead says \"we skipped the regression suite\". No meeting has been held yet. Which stage of trust is this?", "Step 3 — both readily admit responsibility", [
      ["Step 2 — the problem surfaces and each blames the other", "Here neither blames the other; each owns part of the problem.", "Здесь никто никого не обвиняет: каждый берёт свою часть проблемы."],
      ["Step 4 — they meet face-to-face to work it out", "No meeting has been held yet; meeting face-to-face is the next stage.", "Встречи ещё не было; встреча лицом к лицу — следующий этап."],
      ["Step 5 — they formally anticipate future problems", "They are reacting to a failure that has already happened, not anticipating new ones.", "Они реагируют на уже случившийся сбой, а не предвидят новые."],
    ], "Admitting one's own part (\"as trust develops, both managers readily admit responsibility for the problems\") is step 3; the face-to-face meeting comes next.", "Признать свою часть («по мере роста доверия оба охотно признают ответственность за проблемы») — шаг 3; встреча лицом к лицу — следующий."),
    tfx("According to Sadler, a structure that is effective for a company at one stage of its development may not be appropriate at a later stage.", true,
      "Sadler: there can be no ideal structure for organizations of all kinds, \"or even appropriate to a single type of organization at different stages in its development\".",
      "Сэдлер: не может быть идеальной структуры для организаций любого рода, «и даже подходящей одному типу организации на разных стадиях его развития».",
      "\"False\" would mean one structure stays right as the company grows — Sadler explicitly denies this.",
      "«Неверно» означало бы, что одна структура остаётся правильной по мере роста компании, — Сэдлер прямо это отрицает."),
    tfx("Wallace lists inflation of wage and material costs as a separate, fifth factor of the organizational revolution.", false,
      "Wallace has four factors. Inflation of wage and material costs is a sub-item of \"competition and the profit squeeze\".",
      "У Уоллеса четыре фактора. Рост зарплат и стоимости материалов — подпункт «конкуренции и сжатия прибыли».",
      "\"True\" turns a sub-item into a factor and makes the list five long; the slide has four factors.",
      "«Верно» превращает подпункт в фактор и делает список из пяти; на слайде четыре фактора."),
    tfx("According to Grinnell and Apple, highly talented specialists feeling exploited and misused is one indication that the traditional structure may not be adequate for managing projects.", true,
      "This is the third of the five indications on the slide.",
      "Это третий из пяти признаков на слайде.",
      "\"False\" would drop a listed indication; the slide names exploited and misused specialists explicitly.",
      "«Неверно» выкинуло бы признак из списка; слайд прямо называет эксплуатируемых и неправильно используемых специалистов."),
  ],
);

const p2 = part(
  "pm-l5-p2",
  { en: "The traditional organization and work-integration positions", ru: "Традиционная организация и должности интеграции работ" },
  {
    en: `## The traditional (classical) organization
**Fig. 1 — The traditional management structure** (picture slide): the **executive office** at the top; below it the **divisions** — Engineering, Operations, Financial, Administration, Marketing; each division splits into **departments**, each department into **sections**, and the label **"functional responsibility"** runs down the chain. Every box is a function (a specialty), not a project: nobody in the chart is in charge of a project from start to finish.
- Every employee belongs to one functional line and reports to exactly one boss in it: section → department → division → executive office.
- A project that needs engineering, operations and finance is passed from division to division; decisions climb the vertical chain and come back down.
- IT version: a bank's IT department is split into Development, QA, Infrastructure, Security and Business Analysis, each with its own head. A new mobile banking app needs all five, but no single person owns it.
## Advantages of the traditional organization (11 on the slides)
| # | Advantage (slide wording) | In an IT company |
|---|---|---|
| 1 | Easier budgeting and cost control are possible. | each department has one budget and one owner |
| 2 | Better technical control is possible. | the head of QA sets test standards for all projects |
| 3 | Specialists can be grouped to share knowledge and responsibility. | all security engineers sit together and review each other's work |
| 4 | Personnel can be used on many different projects. | one DBA tunes the databases of five projects |
| 5 | All projects will benefit from the most advanced technology (better utilization of scarce personnel). | the only ML expert helps every project |
| 6 | A broad manpower base to work with. | a big pool of developers to draw from |
| 7 | Continuity in the functional disciplines; policies, procedures, and lines of responsibility are easily defined and understandable. | the frontend department outlives every project and keeps its standards |
| 8 | Admits mass production activities within established specifications. | suits repetitive work, such as routine maintenance releases |
| 9 | Good control over personnel, since each employee has one and only one person to report to. | each developer has one boss — no conflicting orders |
| 10 | Communication channels are vertical and well established. | everyone knows whom to ask: up the chain |
| 11 | Quick reaction capability exists, but may be dependent upon the priorities of the functional managers. | the database team reacts fast — if its head thinks your issue matters |
## Disadvantages of the traditional organization (9 on the slides)
| # | Disadvantage (slide wording) | In an IT company |
|---|---|---|
| 1 | No one individual is directly responsible for the total project (i.e., no formal authority; committee solutions). | the app release is decided by a committee of five department heads |
| 2 | Does not provide the project-oriented emphasis necessary to accomplish the project tasks. | each department optimises its own work, not the project |
| 3 | Coordination becomes complex, and additional lead time is required for approval of decisions. | a UI change needs sign-off from three heads — a week is lost |
| 4 | Decisions normally favor the strongest functional groups. | the powerful backend department wins every trade-off |
| 5 | No customer focal point. | the client does not know whom to call |
| 6 | Response to customer needs is slow. | a change request waits in several departmental queues |
| 7 | Difficulty in pinpointing responsibility; this is the result of little or no direct project reporting, very little project-oriented planning, and no project authority. | after a failed launch nobody can say whose fault it was |
| 8 | Motivation and innovation are decreased. | people do their piece and stop caring about the product |
| 9 | Ideas tend to be functionally oriented with little regard for ongoing projects. | the infrastructure team schedules its migration in the middle of a client launch |
> Exam trap: "**Quick reaction capability exists**" is on the **advantages** list (with the caveat "may be dependent upon the priorities of the functional managers"), while "**Response to customer needs is slow**" is on the **disadvantages** list. Read the exact wording.
> Exam trap: "one and only one person to report to" is an **advantage** of the classical structure (good control over personnel). In a matrix the worker has two bosses — one reason the matrix is harder to run.
## Why projects fall behind in the classical structure
- **Projects have a tendency to fall behind schedule** in the classical organizational structure.
- **Incredibly large lead times are required.** Functional managers attend to those tasks that provide **better benefits to themselves and their subordinates first**.
- With the growth of project management **in the late 1960s**, executives began to realize that many of the problems were the result of **weaknesses in the traditional structure**.
> Memory hook: in a functional company the project is always "someone else's" work, so it waits in every department's queue.
## Developing work integration positions
- As companies grew in size, more emphasis was placed on **multiple ongoing programs with high-technology requirements**.
- Organizational pitfalls soon appeared, especially in the **integration of the flow of work**.
- As management discovered that **the critical point in any program is the interface between functional units**, the new theories of "integration" management developed.
- Because of the interfacing problems, management began searching for innovative methods to coordinate the flow of work between functional units **without modification to the existing organizational structure**.
This coordination was achieved through several **integrating mechanisms** (Galbraith):
| Mechanism | What it means | IT example |
|---|---|---|
| **Rules and procedures** | written standards that tell each unit how to hand work to the next | a definition of done and a release checklist for every team |
| **Planning processes** | joint plans and schedules that set common targets | a quarterly roadmap that every department plans against |
| **Hierarchical referral** | when units disagree, the issue goes up to their common boss | backend and frontend escalate an API dispute to the CTO |
| **Direct contact** | the people involved talk to each other directly | the QA lead walks over to the developer instead of writing a memo |
> Exam trap: the four mechanisms are **rules and procedures, planning processes, hierarchical referral, direct contact**. Task forces, liaison departments and the matrix are **not** on this list — they are the later steps of the evolution described below.
## Where to put the project manager?
- When the need for project managers was acknowledged, the next logical question was **where in the organization to place them**.
- **Executives preferred to keep project managers low in the organization.** After all, if they reported to someone high up, they would **have to be paid more** and would **pose a continuous threat to management**.
## Step 1: departmental project management (project leaders)
- The first attempt to resolve this problem was to develop **project leaders or coordinators within each functional department**.
- **Section-level personnel** were **temporarily assigned** as project leaders and would **return to their former positions at project termination**.
- This is why the term **"project leader"** is used rather than **"project manager"**, as the word **"manager" implies a permanent relationship**.
**Fig. 2 — Departmental project management** (picture slide): a **division manager** over **Department X, Y and Z**; inside each department a box of **project leaders**, and under them the **section level**. Each project leader works only inside his own department.
- IT example: in the QA department a senior tester is named "project leader" for the test part of a new release; after the release he goes back to being a tester. He has no say over development or infrastructure.
- Limit: the project leader integrates work only **inside one department**; the interface between departments — the real critical point — is still unmanaged.
## Step 2: the task force
- The next step in the evolution of project management was the **task force concept**.
- Rationale: **integration could be achieved if each functional unit placed a representative on the task force**.
- The group could then **jointly solve problems as they occurred**, provided that **budget limitations were still adhered to**.
- Theoretically, **decisions could now be made at the lowest possible levels**, thus expediting information and reducing, or even eliminating, delay time.
- It was **a giant step toward conflict resolution**: work was being accomplished on time, schedules were being maintained, and costs were usually within budget.
- **However**, **without formal project authority relationships**, task force members **remained loyal to their functional organizations**, and when conflicts came about between the project and functional organization, **the project always suffered**.
- Verdict: although the task force concept was a step in the right direction, **the disadvantages strongly outweighed the advantages**.
- IT example: a "launch squad" with one person each from backend, mobile, QA and marketing meets daily. It works — until the backend head pulls his developer onto an urgent internal task; the squad has no authority to stop it.
> Exam trap: the task force **did** deliver results (on time, on schedule, usually within budget) — the slide calls it a giant step toward conflict resolution. It failed because members stayed **loyal to their functional organizations without formal project authority**, not because it was slow or over budget.
## Step 3: the liaison department (the expeditor)
- The next step in the evolution of work integration was the establishment of **liaison departments**, particularly in **engineering divisions that perform multiple projects involving a high level of technology**.
- Purpose: **to handle transactions between functional units within the (engineering) division**.
- The liaison personnel **received their authority through the division head**.
- Liaison departments are still in existence in many large companies and **typically handle engineering changes and design problems**.
**Fig. 3 — Engineering division with liaison department (The Expeditor)** (picture slide): under the **engineering division** sit five equal boxes — **Liaison Dept, Electronics, Thermodynamics, Structures, R&D**. Solid lines = **formal authority flow** from the division head; a dashed arrow runs from the liaison department across all the other departments = **informal/reporting authority flow**.
- **Limits:** unfortunately, the liaison department is **simply a scale-up of the project coordinator within the department**. The authority given to it **extends only to the outer boundaries of the division**. If a conflict arose between the **manufacturing and engineering divisions**, for example, it would still be **referred to upper management for resolution**.
- **Today**, liaison departments are synonymous with **project engineering and systems engineering departments**, and the individuals in these departments **have the authority to span the entire organization**.
> Exam trap: one slide sentence is garbled — "The liaison department did not actually worked toward the same requirements and goals." In Kerzner the passage reads: the liaison department **did not actually resolve conflicts**; its prime function was **to ensure that all departments worked toward the same requirements and goals**. So the liaison department coordinates and expedites inside one division; it does not settle conflicts between divisions.
## Step 4: the line/staff organization (project coordinator)
- It soon became obvious that **control of a project must be given to personnel whose first loyalty is directed toward the completion of the project**.
- Thus **the project management position must not be controlled by the functional managers**.
**Fig. 4 — Line/staff organization (Project Coordinator)** (picture slide): the **division manager** at the top with solid lines (**formal authority**) down to two **department managers**. The **project manager** hangs off the division manager's line as a **staff** box beside the chain and is connected to the department managers only by **dashed lines** = **formal or informal authority or information flow**.
- Reading the figure: the project manager now reports to the division manager, **not** to a functional manager, so his first loyalty can go to the project. But he still has **no solid line down to the workers** — he coordinates, monitors and informs through the department managers, which is why the figure is captioned **Project Coordinator**.
- The next steps give the project manager real authority over people: complete line authority in the **pure product (projectized)** form, or shared authority in the **matrix** — part 3.
@diagram pm5-integration-evolution
| Step | Who integrates | Where the integrator sits | Authority over project work | Main limit |
|---|---|---|---|---|
| Integrating mechanisms (Galbraith) | rules, plans, the hierarchy, direct contact | no new position | none — structure unchanged | interfaces still unmanaged |
| Departmental project management (Fig. 2) | **project leader** (temporary) | inside each functional department | only within his own department | the interfaces between departments |
| Task force | a **representative** of each functional unit | a temporary joint group | no formal project authority | members loyal to functional units; the project suffers |
| Liaison department (Fig. 3, the expeditor) | liaison personnel | a department inside the division | through the division head, up to the division boundary | conflicts between divisions go to upper management |
| Line/staff (Fig. 4, project coordinator) | project manager | staff position under the division manager | not controlled by functional managers; dashed lines to departments | still no line authority over the workers |
?? Why did executives keep the first project managers low in the organization, and what title did these people get?
?= If project managers reported high up, they would have to be paid more and would pose a continuous threat to management. Section-level people were temporarily assigned as "project leaders" — not "project managers", because "manager" implies a permanent relationship.
?? The task force kept work on time and costs usually within budget. Why did its disadvantages strongly outweigh its advantages?
?= Without formal project authority relationships, members stayed loyal to their functional organizations, so whenever the project and a functional organization came into conflict, the project always suffered.
?? A liaison department in the engineering division faces a conflict between engineering and manufacturing. What happens?
?= Its authority extends only to the outer boundaries of the division, so the conflict is still referred to upper management for resolution.
## Exam focus
- Classical structure: **11 advantages** and **9 disadvantages** — know which side each item is on ("quick reaction capability" = advantage with a caveat; "response to customer needs is slow" = disadvantage; "one and only one person to report to" = advantage).
- Projects fall behind: incredibly large lead times; functional managers serve their own benefit first; executives saw this in the **late 1960s**.
- The critical point in any program = **the interface between functional units**; the first fixes did not modify the structure.
- Galbraith's **four** integrating mechanisms: rules and procedures, planning processes, hierarchical referral, direct contact.
- Order of evolution: departmental **project leader** → **task force** → **liaison department** (the expeditor) → **line/staff** (project coordinator) → projectized and matrix.
- Exact reasons: PMs kept low (paid more, threat to management); "leader" not "manager" ("manager" = permanent); the task force failed (loyalty without formal authority — the project always suffered); the liaison department is limited to its division; the PM must not be controlled by functional managers (first loyalty to the project).`,
    ru: `## Традиционная (классическая) организация (traditional / classical organization)
**Fig. 1 — традиционная структура управления (the traditional management structure)** (слайд-картинка): наверху **исполнительный офис (executive office)**; под ним **подразделения (divisions)** — Engineering, Operations, Financial, Administration, Marketing; каждое подразделение делится на **отделы (departments)**, каждый отдел — на **секции (sections)**, а вниз по цепочке идёт подпись **«функциональная ответственность» (functional responsibility)**. Каждый блок — это функция (специальность), а не проект: никто на схеме не отвечает за проект от начала до конца.
- Каждый сотрудник входит в одну функциональную линию и подчиняется ровно одному начальнику в ней: секция → отдел → подразделение → исполнительный офис.
- Проект, которому нужны инженеры, производство и финансы, передают из подразделения в подразделение; решения поднимаются по вертикали и спускаются обратно.
- Версия для IT: IT-департамент банка разделён на разработку, QA, инфраструктуру, безопасность и бизнес-анализ, у каждого свой руководитель. Новому мобильному банку нужны все пять, но целиком им не владеет никто.
## Преимущества традиционной организации (на слайдах их 11)
| № | Преимущество (формулировка слайда) | В IT-компании |
|---|---|---|
| 1 | Проще бюджетирование и контроль затрат (easier budgeting and cost control). | у каждого отдела один бюджет и один владелец |
| 2 | Возможен лучший технический контроль (better technical control). | руководитель QA задаёт стандарты тестирования для всех проектов |
| 3 | Специалистов можно сгруппировать, чтобы делиться знаниями и ответственностью. | все инженеры по безопасности сидят вместе и проверяют работу друг друга |
| 4 | Персонал можно использовать на многих разных проектах (personnel can be used on many different projects). | один DBA настраивает базы пяти проектов |
| 5 | Все проекты выигрывают от самых передовых технологий (лучшее использование дефицитного персонала, better utilization of scarce personnel). | единственный ML-эксперт помогает каждому проекту |
| 6 | Широкая кадровая база для работы (a broad manpower base). | большой пул разработчиков, из которого можно брать людей |
| 7 | Преемственность функциональных дисциплин (continuity in the functional disciplines); политики, процедуры и линии ответственности легко определить и понять. | отдел фронтенда переживает любой проект и хранит свои стандарты |
| 8 | Допускает массовое производство в рамках установленных спецификаций (mass production activities within established specifications). | подходит для повторяющейся работы, например плановых релизов поддержки |
| 9 | Хороший контроль над персоналом: у каждого сотрудника один и только один человек, которому он подчиняется (one and only one person to report to). | у каждого разработчика один начальник — нет противоречивых распоряжений |
| 10 | Каналы коммуникации вертикальные и хорошо налажены (vertical and well established). | все знают, кого спрашивать: вверх по цепочке |
| 11 | Есть способность быстро реагировать (quick reaction capability), но она может зависеть от приоритетов функциональных менеджеров. | команда баз данных реагирует быстро — если её руководитель считает ваш вопрос важным |
## Недостатки традиционной организации (на слайдах их 9)
| № | Недостаток (формулировка слайда) | В IT-компании |
|---|---|---|
| 1 | Ни один человек не отвечает напрямую за проект целиком (no one individual is directly responsible for the total project) — то есть нет формальных полномочий; решения принимает комитет (committee solutions). | о выпуске приложения решает комитет из пяти руководителей отделов |
| 2 | Не даёт проектной направленности (project-oriented emphasis), нужной для выполнения задач проекта. | каждый отдел оптимизирует свою работу, а не проект |
| 3 | Координация усложняется, и на согласование решений нужно дополнительное время (additional lead time). | изменение интерфейса подписывают три руководителя — теряется неделя |
| 4 | Решения обычно в пользу самых сильных функциональных групп (favor the strongest functional groups). | сильный отдел бэкенда выигрывает каждый компромисс |
| 5 | Нет единой точки контакта для заказчика (no customer focal point). | клиент не знает, кому звонить |
| 6 | Реакция на нужды заказчика медленная (response to customer needs is slow). | запрос на изменение ждёт в очередях нескольких отделов |
| 7 | Трудно определить, кто отвечает (difficulty in pinpointing responsibility): почти нет прямой отчётности по проекту, очень мало проектного планирования и нет проектных полномочий. | после провального запуска никто не может сказать, чья это вина |
| 8 | Снижаются мотивация и инновации (motivation and innovation are decreased). | люди делают свой кусок и перестают думать о продукте |
| 9 | Идеи ориентированы на функцию и мало учитывают текущие проекты (functionally oriented). | инфраструктура назначает свою миграцию посреди запуска у клиента |
> Ловушка экзамена: «**Есть способность быстро реагировать (quick reaction capability exists)**» стоит в списке **преимуществ** (с оговоркой «может зависеть от приоритетов функциональных менеджеров»), а «**Реакция на нужды заказчика медленная (response to customer needs is slow)**» — в списке **недостатков**. Читайте формулировку точно.
> Ловушка экзамена: «один и только один человек, которому подчиняешься» — **преимущество** классической структуры (хороший контроль над персоналом). В матрице у работника два начальника — одна из причин, почему матрицей сложнее управлять.
## Почему проекты отстают в классической структуре
- **Проекты склонны отставать от графика (fall behind schedule)** в классической организационной структуре.
- **Нужны невероятно большие сроки ожидания (incredibly large lead times).** Функциональные менеджеры сначала занимаются задачами, которые выгоднее **им самим и их подчинённым (better benefits to themselves and their subordinates first)**.
- С ростом проектного менеджмента **в конце 1960-х (late 1960s)** руководители начали понимать, что многие проблемы — следствие **слабостей традиционной структуры (weaknesses in the traditional structure)**.
> Запомнить: в функциональной компании проект всегда «чужая» работа, поэтому он стоит в очереди каждого отдела.
## Развитие должностей интеграции работ (developing work integration positions)
- По мере роста компаний больше внимания уделялось **множеству текущих программ с высокими технологическими требованиями (multiple ongoing programs with high-technology requirements)**.
- Вскоре проявились организационные ловушки, особенно в **интеграции потока работ (integration of the flow of work)**.
- Когда руководство обнаружило, что **критическая точка любой программы — стык между функциональными подразделениями (the interface between functional units)**, появились новые теории «интеграционного» управления (integration management).
- Из-за проблем на стыках руководство стало искать новые способы координировать поток работ между подразделениями **без изменения существующей организационной структуры (without modification to the existing organizational structure)**.
Эта координация достигалась несколькими **интегрирующими механизмами (integrating mechanisms)** (Galbraith):
| Механизм | Что означает | Пример из IT |
|---|---|---|
| **Правила и процедуры (rules and procedures)** | письменные стандарты: как каждое подразделение передаёт работу следующему | definition of done и чек-лист релиза для каждой команды |
| **Процессы планирования (planning processes)** | совместные планы и графики с общими целями | квартальная дорожная карта, по которой планируют все отделы |
| **Обращение по иерархии (hierarchical referral)** | при разногласиях вопрос поднимают к общему начальнику | бэкенд и фронтенд выносят спор об API к CTO |
| **Прямой контакт (direct contact)** | участники говорят друг с другом напрямую | лид QA сам подходит к разработчику, а не пишет служебную записку |
> Ловушка экзамена: четыре механизма — **rules and procedures, planning processes, hierarchical referral, direct contact**. Task force, liaison department и матрица в этот список **не входят** — это следующие шаги эволюции, о которых ниже.
## Куда поставить проектного менеджера?
- Когда потребность в проектных менеджерах признали, следующим логичным вопросом стало, **где в организации их разместить (where in the organization to place them)**.
- **Руководители предпочитали держать проектных менеджеров на низком уровне (low in the organization).** Ведь если бы те подчинялись кому-то высоко, **им пришлось бы больше платить**, и они бы **постоянно угрожали руководству (pose a continuous threat to management)**.
## Шаг 1: департаментное управление проектами (departmental project management, project leaders)
- Первой попыткой решить проблему стали **руководители проектов или координаторы внутри каждого функционального отдела (project leaders or coordinators within each functional department)**.
- **Сотрудников уровня секции (section-level personnel)** **временно назначали** руководителями проектов, и по **завершении проекта они возвращались на прежние должности**.
- Поэтому и используется термин **«project leader»**, а не **«project manager»**: слово **«manager» подразумевает постоянные отношения (implies a permanent relationship)**.
**Fig. 2 — департаментное управление проектами (departmental project management)** (слайд-картинка): **руководитель подразделения (division manager)** над **отделами X, Y и Z**; внутри каждого отдела — блок **project leaders**, под ними — **уровень секций (section level)**. Каждый project leader работает только внутри своего отдела.
- Пример из IT: в отделе QA старшего тестировщика назначают «project leader» тестовой части нового релиза; после релиза он снова тестировщик. На разработку и инфраструктуру он никак не влияет.
- Ограничение: project leader интегрирует работу только **внутри одного отдела**; стык между отделами — та самая критическая точка — по-прежнему никем не управляется.
## Шаг 2: целевая группа (task force)
- Следующим шагом в эволюции проектного менеджмента стала **концепция целевой группы (task force concept)**.
- Логика: **интеграции можно добиться, если каждое функциональное подразделение направит в task force своего представителя (representative)**.
- Тогда группа могла **совместно решать проблемы по мере их появления (jointly solve problems)** — при условии, что **бюджетные ограничения по-прежнему соблюдаются (budget limitations were still adhered to)**.
- Теоретически **решения теперь можно было принимать на самых низких уровнях (at the lowest possible levels)**, ускоряя информацию и сокращая или даже устраняя задержки.
- Это был **гигантский шаг к разрешению конфликтов (a giant step toward conflict resolution)**: работа выполнялась в срок, графики соблюдались, затраты обычно укладывались в бюджет.
- **Однако** **без формальных проектных отношений полномочий (without formal project authority relationships)** члены task force **оставались лояльны своим функциональным организациям**, и при конфликтах между проектом и функциональной организацией **всегда страдал проект (the project always suffered)**.
- Итог: хотя task force была шагом в правильном направлении, **недостатки сильно перевешивали преимущества (the disadvantages strongly outweighed the advantages)**.
- Пример из IT: «команда запуска» — по одному человеку из бэкенда, мобильной разработки, QA и маркетинга — встречается каждый день. Всё работает, пока руководитель бэкенда не забирает своего разработчика на срочную внутреннюю задачу; у команды нет полномочий это остановить.
> Ловушка экзамена: task force **давала** результат (в срок, по графику, обычно в рамках бюджета) — слайд называет её гигантским шагом к разрешению конфликтов. Провалилась она потому, что участники оставались **лояльны своим функциональным организациям без формальных проектных полномочий**, а не из-за медлительности или перерасхода.
## Шаг 3: отдел связи (liaison department, the expeditor)
- Следующим шагом в эволюции интеграции работ стало создание **отделов связи (liaison departments)**, особенно в **инженерных подразделениях, которые ведут много проектов с высоким уровнем технологий (multiple projects involving a high level of technology)**.
- Назначение: **проводить взаимодействие (handle transactions) между функциональными подразделениями внутри (инженерного) подразделения**.
- Персонал отдела связи **получал полномочия через руководителя подразделения (through the division head)**.
- Отделы связи до сих пор есть во многих крупных компаниях и **обычно занимаются инженерными изменениями и проблемами проектирования (engineering changes and design problems)**.
**Fig. 3 — инженерное подразделение с отделом связи (The Expeditor)** (слайд-картинка): под **инженерным подразделением (engineering division)** пять равных блоков — **Liaison Dept, Electronics, Thermodynamics, Structures, R&D**. Сплошные линии = **поток формальных полномочий (formal authority flow)** от руководителя подразделения; пунктирная стрелка идёт от отдела связи через все остальные отделы = **неформальный/отчётный поток полномочий (informal/reporting authority flow)**.
- **Ограничения:** к сожалению, отдел связи — **просто увеличенная версия координатора проекта внутри отдела (a scale-up of the project coordinator)**. Его полномочия **заканчиваются на внешних границах подразделения (the outer boundaries of the division)**. Если, например, возникал конфликт между **производственным и инженерным подразделениями**, его всё равно **передавали высшему руководству (referred to upper management)**.
- **Сегодня** отделы связи — синоним **отделов проектной инженерии и системной инженерии (project engineering and systems engineering departments)**, и их сотрудники **имеют полномочия на всю организацию (span the entire organization)**.
> Ловушка экзамена: одна фраза слайда искажена — «The liaison department did not actually worked toward the same requirements and goals». У Кернцнера сказано: отдел связи **на самом деле не разрешал конфликты (did not actually resolve conflicts)**; его главная функция — **следить, чтобы все отделы работали на одни и те же требования и цели**. Значит, отдел связи координирует и ускоряет работу внутри одного подразделения, но не решает конфликты между подразделениями.
## Шаг 4: линейно-штабная организация (line/staff organization, project coordinator)
- Вскоре стало очевидно, что **контроль над проектом надо отдать людям, чья первая лояльность — завершение проекта (whose first loyalty is directed toward the completion of the project)**.
- Значит, **должность проектного менеджера не должна контролироваться функциональными менеджерами (must not be controlled by the functional managers)**.
**Fig. 4 — линейно-штабная организация (Project Coordinator)** (слайд-картинка): наверху **руководитель подразделения (division manager)**, от него сплошные линии (**формальные полномочия, formal authority**) вниз к двум **руководителям отделов (department managers)**. **Проектный менеджер (project manager)** прикреплён к линии руководителя подразделения как **штабной (staff)** блок сбоку от цепочки и связан с руководителями отделов только **пунктиром** = **формальные или неформальные полномочия или поток информации (formal or informal authority or information flow)**.
- Как читать схему: проектный менеджер теперь подчиняется руководителю подразделения, **а не** функциональному менеджеру, поэтому его первая лояльность может принадлежать проекту. Но у него всё ещё **нет сплошной линии вниз к работникам** — он координирует, отслеживает и информирует через руководителей отделов, поэтому рисунок и подписан **Project Coordinator**.
- Следующие шаги дают проектному менеджеру реальные полномочия над людьми: полные линейные полномочия в **чисто продуктовой (projectized)** форме или разделённые — в **матрице**; это часть 3.
@diagram pm5-integration-evolution
| Шаг | Кто интегрирует | Где сидит интегратор | Полномочия над работой проекта | Главное ограничение |
|---|---|---|---|---|
| Интегрирующие механизмы (Galbraith) | правила, планы, иерархия, прямой контакт | новой должности нет | нет — структура не меняется | стыки по-прежнему без управления |
| Департаментное управление проектами (Fig. 2) | **project leader** (временный) | внутри каждого функционального отдела | только в своём отделе | стыки между отделами |
| Task force | **представитель** каждого подразделения | временная совместная группа | формальных проектных полномочий нет | участники лояльны своим отделам; страдает проект |
| Liaison department (Fig. 3, the expeditor) | персонал отдела связи | отдел внутри подразделения | через руководителя подразделения, до его границы | конфликты между подразделениями уходят наверх |
| Line/staff (Fig. 4, project coordinator) | проектный менеджер | штабная должность при руководителе подразделения | не подчинён функциональным менеджерам; пунктир к отделам | линейных полномочий над работниками всё ещё нет |
?? Почему руководители держали первых проектных менеджеров на низком уровне и как назывались эти люди?
?= Если бы проектные менеджеры подчинялись высоко, им пришлось бы больше платить, и они постоянно угрожали бы руководству. Сотрудников уровня секции временно назначали «project leaders» — не «project managers», потому что «manager» подразумевает постоянные отношения.
?? Task force выполняла работу в срок и обычно укладывалась в бюджет. Почему её недостатки сильно перевесили преимущества?
?= Без формальных проектных отношений полномочий участники оставались лояльны своим функциональным организациям, поэтому при любом конфликте между проектом и функциональной организацией страдал проект.
?? Отдел связи инженерного подразделения столкнулся с конфликтом между инженерами и производством. Что произойдёт?
?= Его полномочия заканчиваются на внешних границах подразделения, поэтому конфликт всё равно передают высшему руководству.
## Фокус экзамена
- Классическая структура: **11 преимуществ** и **9 недостатков** — знайте, на какой стороне каждый пункт («quick reaction capability» — преимущество с оговоркой; «response to customer needs is slow» — недостаток; «one and only one person to report to» — преимущество).
- Проекты отстают: огромные сроки ожидания; функциональные менеджеры сначала обслуживают свою выгоду; руководители осознали это в **конце 1960-х**.
- Критическая точка любой программы — **стык между функциональными подразделениями**; первые решения структуру не меняли.
- **Четыре** интегрирующих механизма Гэлбрейта: rules and procedures, planning processes, hierarchical referral, direct contact.
- Порядок эволюции: департаментный **project leader** → **task force** → **liaison department** (the expeditor) → **line/staff** (project coordinator) → projectized и matrix.
- Точные причины: PM держали низко (больше платить, угроза руководству); «leader», а не «manager» («manager» — постоянно); task force провалилась (лояльность без формальных полномочий — проект всегда страдал); отдел связи ограничен своим подразделением; PM не должен подчиняться функциональным менеджерам (первая лояльность — проекту).`,
  },
  [
    qx("Which of the following is listed as an advantage of the traditional (classical) organization?", "Easier budgeting and cost control are possible", [
      ["A focal point develops for customer relations", "A customer focal point is an advantage of the product (projectized) form, Table 1; the classical form has \"no customer focal point\".", "Точка контакта с заказчиком — преимущество продуктовой формы (Table 1); у классической — «no customer focal point»."],
      ["Personnel demonstrate loyalty to the project", "Loyalty to the project and product identification are in Table 1 for the product form; in the classical form people are loyal to their functional departments.", "Лояльность проекту и идентификация с продуктом — из Table 1 продуктовой формы; в классической люди лояльны своим функциональным отделам."],
      ["One individual is responsible for the total project", "The opposite is true: \"no one individual is directly responsible for the total project\" is the first classical disadvantage.", "Наоборот: «no one individual is directly responsible for the total project» — первый недостаток классической структуры."],
    ], "Easier budgeting and cost control are possible — the first advantage of the traditional (classical) organization on the slides.", "Проще бюджетирование и контроль затрат — первое преимущество традиционной (классической) организации на слайдах."),
    qx("Which of the following is a disadvantage of the traditional (classical) organization?", "Decisions normally favor the strongest functional groups", [
      ["Cost of duplicating personnel on each project is prohibitive", "Duplication of effort, facilities and personnel is a disadvantage of the product (projectized) form, Table 2.", "Дублирование усилий, помещений и персонала — недостаток продуктовой (projectized) формы, Table 2."],
      ["Lack of career continuity for project personnel", "Lack of career continuity is also from Table 2 (product form); the classical form has continuity in the functional disciplines.", "Отсутствие карьерной преемственности — тоже из Table 2 (продуктовая форма); у классической, наоборот, преемственность дисциплин."],
      ["Each worker must report to two bosses at the same time", "Two bosses is a feature of the matrix; in the classical form each employee has one and only one person to report to.", "Два начальника — черта матрицы; в классической форме у каждого ровно один руководитель."],
    ], "\"Decisions normally favor the strongest functional groups\" is the fourth disadvantage of the classical organization on the slides.", "«Decisions normally favor the strongest functional groups» — четвёртый недостаток классической организации на слайдах."),
    qx("A bank's IT department is split into development, QA and infrastructure. A client's change request waits in each department's queue, and the client has no single person to talk to. Which classical disadvantages does this illustrate?", "No customer focal point; slow response to needs", [
      ["Decisions normally favor the strongest groups", "That disadvantage is about internal trade-offs between departments, not about the client's access and waiting time.", "Этот недостаток — о компромиссах между отделами внутри компании, а не о доступе клиента и ожидании."],
      ["Too many people report to more than one boss", "In the classical form each employee reports to one and only one person — that is an advantage, not the problem here.", "В классической форме у каждого ровно один руководитель — это преимущество, а не проблема из кейса."],
      ["Specialists cannot be grouped to share their knowledge", "Grouping specialists to share knowledge is an advantage of the classical form, so it cannot be the disadvantage shown.", "Группировка специалистов для обмена знаниями — преимущество классической формы, так что это не недостаток из кейса."],
    ], "The slides list \"No customer focal point\" and \"Response to customer needs is slow\" as two of the nine classical disadvantages — exactly the client's experience.", "Слайды называют «No customer focal point» и «Response to customer needs is slow» среди девяти недостатков классической формы — это ровно опыт клиента."),
    qx("How do the slides describe \"quick reaction capability\" in the traditional organization?", "An advantage that depends on functional managers' priorities", [
      ["A disadvantage caused by long and slow vertical communication chains", "Vertical, well-established channels are listed as an advantage, and quick reaction is on the advantages list too.", "Вертикальные налаженные каналы указаны как преимущество, и быстрая реакция тоже в списке преимуществ."],
      ["An advantage found only in the pure product form", "Table 1 does list very rapid reaction time for the product form, but the classical slide also lists quick reaction capability.", "Table 1 действительно называет очень быструю реакцию у продуктовой формы, но и слайд классической формы называет quick reaction capability."],
      ["Impossible, because there is no single project authority", "Missing project authority causes slow response to customers, but the slide still claims a quick reaction capability.", "Отсутствие проектных полномочий замедляет ответ клиенту, но слайд всё же называет способность быстро реагировать."],
    ], "Slide: \"Quick reaction capability exists, but may be dependent upon the priorities of the functional managers\" — the last item of the classical advantages.", "Слайд: «Quick reaction capability exists, but may be dependent upon the priorities of the functional managers» — последний пункт преимуществ классической формы."),
    qx("According to the lecture, why do projects tend to fall behind schedule in the classical structure?", "Functional managers first do tasks that benefit their own units", [
      ["Task force members stay loyal to their own functional departments", "Loyalty to functional organizations explains why the task force failed, not the delays of the classical structure.", "Лояльность функциональным организациям объясняет провал task force, а не задержки классической структуры."],
      ["The program manager keeps people on the project long after they are needed", "Holding people too long is a disadvantage of the projectized form (Table 2), not a cause of delays in the classical form.", "Удержание людей слишком долго — недостаток проектной формы (Table 2), а не причина задержек классической."],
      ["Matrix workers receive conflicting orders from two bosses", "Two bosses belong to the matrix; in the classical form each employee has one boss.", "Два начальника — это матрица; в классической форме начальник один."],
    ], "Slide: incredibly large lead times are required; functional managers attend to those tasks that provide better benefits to themselves and their subordinates first.", "Слайд: нужны невероятно большие сроки ожидания; функциональные менеджеры сначала занимаются задачами, которые выгоднее им самим и их подчинённым."),
    qx("When did executives begin to realize that many project problems were the result of weaknesses in the traditional structure?", "In the late 1960s, as project management grew", [
      ["In the early 1950s, with the first mass production", "The slide ties the realization to the growth of project management in the late 1960s.", "Слайд связывает это осознание с ростом проектного менеджмента в конце 1960-х."],
      ["In the 1980s, once the matrix spread", "The realization came before the matrix spread — it is what pushed companies toward new forms.", "Осознание пришло до распространения матрицы — именно оно подтолкнуло компании к новым формам."],
      ["In the late 1990s, with the rise of agile methods", "Agile is not mentioned in this lecture; the date on the slide is the late 1960s.", "Agile в этой лекции не упоминается; дата на слайде — конец 1960-х."],
    ], "Slide: with the growth of project management in the late 1960s, executives began to realize that many of the problems were the result of weaknesses in the traditional structure.", "Слайд: с ростом проектного менеджмента в конце 1960-х руководители начали понимать, что многие проблемы — следствие слабостей традиционной структуры."),
    qx("Which of the following is NOT one of the four integrating mechanisms listed on the lecture slide?", "Liaison departments", [
      ["Hierarchical referral", "Hierarchical referral — sending a disagreement up to the common boss — is the third mechanism on the slide.", "Hierarchical referral — передача разногласия общему начальнику — третий механизм на слайде."],
      ["Planning processes", "Planning processes are the second integrating mechanism on the slide.", "Planning processes — второй интегрирующий механизм на слайде."],
      ["Direct contact", "Direct contact is the fourth integrating mechanism on the slide.", "Direct contact — четвёртый интегрирующий механизм на слайде."],
    ], "The four integrating mechanisms are rules and procedures, planning processes, hierarchical referral and direct contact. Liaison departments came later, as a separate step of the evolution.", "Четыре интегрирующих механизма: rules and procedures, planning processes, hierarchical referral и direct contact. Liaison departments появились позже, как отдельный шаг эволюции."),
    qx("According to the lecture, what did management discover is the critical point in any program?", "The interface between functional units", [
      ["Budget approval by the executive", "Budget approval is not called the critical point; the slide speaks of interfaces between functional units.", "Утверждение бюджета не называется критической точкой; слайд говорит о стыках между подразделениями."],
      ["The merit review of each specialist on the team", "Merit reviews come up in the projectized form (the program manager conducts them), not as the critical point.", "Merit review появляется в проектной форме (её проводит program manager), а не как критическая точка."],
      ["The final handover of the product to the customer", "Handover is not mentioned; the problem described is integrating the flow of work between units.", "Передача продукта не упоминается; проблема — интеграция потока работ между подразделениями."],
    ], "Slide: management discovered that the critical point in any program is the interface between functional units, and theories of integration management developed.", "Слайд: руководство обнаружило, что критическая точка любой программы — стык между функциональными подразделениями, и появились теории интеграционного управления."),
    qx("Because of interfacing problems, how did management first try to coordinate the flow of work between functional units?", "Without modifying the existing organizational structure", [
      ["By moving every specialist into separate project divisions", "Moving people into project divisions is the pure product form — a structural change that came much later.", "Перевод людей в проектные подразделения — это чисто продуктовая форма, структурное изменение гораздо более позднее."],
      ["By appointing a director of project management over all PMs", "A director of project management is a later modification of the matrix (Fig. 6).", "Директор по управлению проектами — более поздняя модификация матрицы (Fig. 6)."],
      ["By training everyone in matrix operations and problem solving", "Training in matrix operations is a requirement for implementing a matrix, not the first coordination attempt.", "Обучение работе в матрице — требование к внедрению матрицы, а не первая попытка координации."],
    ], "Slide: management began searching for innovative methods to coordinate the flow of work between functional units without modification to the existing organizational structure.", "Слайд: руководство стало искать новые способы координации потока работ между подразделениями без изменения существующей организационной структуры."),
    qx("Why did executives prefer to keep project managers low in the organization?", "Higher placement meant higher pay and a threat to management", [
      ["Project managers had to stay close to section-level technical work", "The slide's reason is about pay and power, not about technical closeness.", "Причина на слайде — деньги и власть, а не близость к технической работе."],
      ["Customers preferred dealing with low-level project coordinators", "Customers are not mentioned in this argument at all.", "Заказчики в этом доводе вообще не упоминаются."],
      ["Functional managers had to approve every one of the PM's decisions", "That would be a consequence of a low position, not the executives' stated reason for it.", "Это было бы следствием низкого положения, а не причиной, которую называют руководители."],
    ], "Slide: if project managers reported to someone high up, they would have to be paid more and would pose a continuous threat to management.", "Слайд: если бы проектные менеджеры подчинялись кому-то высоко, им пришлось бы больше платить, и они постоянно угрожали бы руководству."),
    qx("In departmental project management, why was the term \"project leader\" used rather than \"project manager\"?", "\"Manager\" implies a permanent relationship", [
      ["\"Leader\" implies line authority over workers", "The opposite: project leaders had little authority; the reason is about permanence, not power.", "Наоборот: у project leaders было мало полномочий; причина — в постоянстве, а не во власти."],
      ["\"Manager\" is reserved for the top boss", "Department and division managers exist too; the slide's reason is that \"manager\" implies a permanent relationship.", "Руководители отделов и подразделений тоже есть; причина на слайде — «manager» подразумевает постоянные отношения."],
      ["\"Leader\" means outranking the department heads", "Project leaders were section-level people working inside a department, below its head.", "Project leaders были сотрудниками уровня секции внутри отдела, ниже его руководителя."],
    ], "Section-level personnel were only temporarily assigned and returned to their former positions at project termination, so \"leader\" was used: the word \"manager\" implies a permanent relationship.", "Сотрудников уровня секции назначали лишь временно, и после проекта они возвращались на прежние места, поэтому — «leader»: слово «manager» подразумевает постоянные отношения."),
    qx("A company forms a group with one person each from backend, mobile, QA and DevOps to solve integration problems jointly within the budget; every member still reports only to his own department head. What is this?", "A task force of unit representatives", [
      ["A liaison department in the division", "A liaison department is a separate department inside the division that handles transactions between units, not a group of representatives.", "Liaison department — отдельный отдел внутри подразделения, который проводит взаимодействие между отделами, а не группа представителей."],
      ["A pure product (projectized) division", "In a projectized division the program manager has complete line authority; here members report to their department heads.", "В проектном подразделении у program manager полные линейные полномочия; здесь участники подчиняются руководителям отделов."],
      ["A team of departmental project leaders", "Departmental project leaders work inside one department each; this group cuts across departments.", "Департаментные project leaders работают каждый в своём отделе; эта группа объединяет несколько отделов."],
    ], "Task force: each functional unit places a representative on it, and the group jointly solves problems as they occur, provided budget limitations are adhered to — without formal project authority.", "Task force: каждое подразделение направляет представителя, и группа совместно решает проблемы по мере появления, соблюдая бюджет, — без формальных проектных полномочий."),
    qx("Why did the disadvantages of the task force concept strongly outweigh its advantages?", "Members stayed loyal to their functional organizations", [
      ["Its costs regularly went far beyond the approved budget limits", "The slide says costs were usually within budget; overspending was not the problem.", "Слайд говорит, что затраты обычно укладывались в бюджет; перерасход не был проблемой."],
      ["Decisions were pushed up to the highest levels", "The opposite: decisions could be made at the lowest possible levels, which sped things up.", "Наоборот: решения можно было принимать на самых низких уровнях, что ускоряло работу."],
      ["It could not keep work on time or on schedule", "The slide says work was accomplished on time and schedules were maintained.", "Слайд говорит, что работа делалась в срок и графики соблюдались."],
    ], "Without formal project authority relationships, task force members remained loyal to their functional organizations; in conflicts between the project and functional organization, the project always suffered.", "Без формальных проектных отношений полномочий члены task force оставались лояльны функциональным организациям; в конфликтах проекта и функциональной организации всегда страдал проект."),
    qx("What was the purpose of the liaison department?", "Handle transactions between functional units within the division", [
      ["Resolve conflicts between the engineering and manufacturing divisions", "Such conflicts were still referred to upper management: liaison authority stopped at the division boundary.", "Такие конфликты всё равно уходили высшему руководству: полномочия отдела связи кончались на границе подразделения."],
      ["Assign work and conduct merit reviews for all project personnel", "Assigning work and merit reviews describe the program manager in the projectized form.", "Распределение работы и merit review — это program manager в проектной форме."],
      ["Place one representative of each unit on a temporary group", "Placing a representative of each unit on a group is the task force concept.", "Направить представителя каждого подразделения в группу — это концепция task force."],
    ], "Slide: the purpose of the liaison department was to handle transactions between functional units within the (engineering) division; its people received their authority through the division head.", "Слайд: назначение отдела связи — проводить взаимодействие между функциональными подразделениями внутри (инженерного) подразделения; полномочия его сотрудники получали через руководителя подразделения."),
    qx("How far does the authority of the liaison department extend?", "Only up to the outer boundaries of its own division", [
      ["Across the entire organization, over every division", "This describes today's project and systems engineering departments, not the original liaison department.", "Так описаны сегодняшние отделы проектной и системной инженерии, а не исходный отдел связи."],
      ["Only within one section of a single department", "That is closer to the departmental project leader; the liaison department covers the whole division.", "Это ближе к департаментному project leader; отдел связи охватывает всё подразделение."],
      ["Over all projects, but never over their budgets", "The slide sets the limit by organizational boundary (the division), not by budget.", "Слайд задаёт предел организационной границей (подразделение), а не бюджетом."],
    ], "Slide: the authority given to the liaison department extends only to the outer boundaries of the division — conflicts between divisions still go to upper management.", "Слайд: полномочия отдела связи заканчиваются на внешних границах подразделения — конфликты между подразделениями всё равно идут наверх."),
    qx("In the lecture's figures, which structure is labelled \"The Expeditor\"?", "Engineering division with a liaison department", [
      ["Line/staff organization with a project manager", "Fig. 4, the line/staff organization, is labelled \"Project Coordinator\".", "Fig. 4, линейно-штабная организация, подписана «Project Coordinator»."],
      ["Departmental project management with leaders", "Fig. 2 shows project leaders inside departments; it has no \"Expeditor\" label.", "Fig. 2 показывает project leaders внутри отделов; подписи «Expeditor» там нет."],
      ["Pure product structure with product managers", "Fig. 5 is the pure product (projectized) structure, where the program manager has full line authority.", "Fig. 5 — чисто продуктовая структура, где у program manager полные линейные полномочия."],
    ], "Fig. 3: Engineering division with liaison department (The Expeditor). Fig. 4 is the line/staff organization (Project Coordinator).", "Fig. 3: инженерное подразделение с отделом связи (The Expeditor). Fig. 4 — линейно-штабная организация (Project Coordinator)."),
    qx("Which principle led to the line/staff organization (project coordinator)?", "Project control must go to people loyal first to the project", [
      ["Every unit must place a representative on the project", "One representative per unit is the rationale of the task force, the earlier step.", "По представителю от каждого подразделения — логика task force, более раннего шага."],
      ["Project leaders must return to their sections at the end", "Returning to former positions describes departmental project leaders, not the line/staff form.", "Возврат на прежние должности описывает департаментных project leaders, а не линейно-штабную форму."],
      ["The general manager must resolve all conflicts between projects", "That describes the matrix variety in which all program managers report directly to the general manager.", "Так описан вариант матрицы, где все program managers подчиняются генеральному менеджеру."],
    ], "Slide: control of a project must be given to personnel whose first loyalty is directed toward the completion of the project, so the PM position must not be controlled by the functional managers (Fig. 4, line/staff).", "Слайд: контроль над проектом надо отдать людям, чья первая лояльность — завершение проекта, поэтому должность PM не должна контролироваться функциональными менеджерами (Fig. 4, line/staff)."),
    tfx("Although the task force concept was a step in the right direction, its advantages strongly outweighed its disadvantages.", false,
      "The slide says the opposite: the disadvantages strongly outweighed the advantages, because members without formal project authority stayed loyal to their functional organizations.",
      "Слайд говорит обратное: недостатки сильно перевешивали преимущества, потому что участники без формальных проектных полномочий оставались лояльны своим отделам.",
      "\"True\" mixes up the first half of the slide (a step in the right direction) with its verdict.",
      "«Верно» путает первую половину слайда (шаг в правильном направлении) с его итогом."),
    tfx("Today, liaison departments are synonymous with project engineering and systems engineering departments, whose members have the authority to span the entire organization.", true,
      "This is the last point about liaison departments on the slide — unlike the original liaison department, limited to its division.",
      "Это последний пункт об отделах связи на слайде — в отличие от исходного отдела связи, ограниченного подразделением.",
      "\"False\" would confuse today's departments with the original liaison department, whose authority stopped at the division boundary.",
      "«Неверно» спутало бы сегодняшние отделы с исходным отделом связи, чьи полномочия кончались на границе подразделения."),
    tfx("In the classical organization, good control over personnel comes from each employee having one and only one person to report to.", true,
      "This is one of the classical advantages on the slides, word for word.",
      "Это одно из преимуществ классической организации на слайдах, почти дословно.",
      "\"False\" would put a listed advantage on the wrong side; two bosses is a feature of the matrix, not of the classical form.",
      "«Неверно» перенесло бы указанное преимущество не на ту сторону; два начальника — черта матрицы, а не классической формы."),
  ],
);

const p3 = part(
  "pm-l5-p3",
  { en: "Projectized and matrix structures", ru: "Проектная и матричная структуры" },
  {
    en: `## Pure product (projectized) organization
- The pure product organization, as shown in Figure 5, **develops as a division within a division**.
- As long as there exists a **continuous flow of projects**, work is stable, and conflicts are at a minimum.
- The **major advantage** of this organizational flow is that **one individual, the program manager, maintains complete line authority over the entire project**.
- **Not only does he assign work, but he also conducts merit reviews.**
**Fig. 5 — Pure product or projectized structure** (picture slide): the **general manager** at the top; under him **Product A manager, Product B manager, Product C manager**; under **each** product manager its own **Eng.** (engineering) and **Manu.** (manufacturing) units. Every product line has a full set of functions of its own.
- The **major disadvantage** with the pure project form is **the cost of maintaining the organization**.
- There is **no chance for sharing an individual with another project** in order to reduce costs.
- Personnel are usually **attached to these projects long after they are needed**, because once an employee is given up, the project manager **might not be able to get him back**.
- IT example: a game studio has three game teams, each with its own programmers, artists, QA and DevOps. The lead of Game A hires, assigns tasks and writes performance reviews. But the DevOps engineer of Game B is idle half the time and cannot help Game A — and the Game B lead will not release him, fearing he will never get him back.
## Table 1 — advantages of the product organizational form (picture slide)
| # | Advantage (Table 1 wording) |
|---|---|
| 1 | Provides complete line authority over the project (i.e., strong control through a single project authority). |
| 2 | Participants work directly for the project manager. Unprofitable product lines are easily identified and can be eliminated. |
| 3 | Strong communications channels. |
| 4 | Staffs can maintain expertise on a given project without sharing key personnel. |
| 5 | Very rapid reaction time is provided. |
| 6 | Personnel demonstrate loyalty to the project; better morale with product identification. |
| 7 | A focal point develops for out-of-company customer relations. |
| 8 | Flexibility in determining time (schedule), cost, and performance trade-offs. |
| 9 | Interface management becomes easier as unit size is decreased. |
| 10 | Upper-level management maintains more free time for executive decision-making. |
## Table 2 — disadvantages of the product organizational form (picture slide)
| # | Disadvantage (Table 2 wording) |
|---|---|
| 1 | Cost of maintaining this form in a multiproduct company would be prohibitive due to duplication of effort, facilities, and personnel; inefficient usage. |
| 2 | A tendency to retain personnel on a project long after they are needed. Upper-level management must balance workloads as projects start up and are phased out. |
| 3 | Technology suffers because, without strong functional groups, outlook of the future to improve company's capabilities for new programs would be hampered (i.e., no perpetuation of technology). |
| 4 | Control of functional (i.e., organizational) specialists requires top-level coordination. |
| 5 | Lack of opportunities for technical interchange between projects. |
| 6 | Lack of career continuity and opportunities for project personnel. |
> Exam trap: the projectized lists are almost the mirror image of the classical ones. Classical: one boss in a functional line, easy cost control, shared personnel, strong technical control — but **no customer focal point** and slow response. Projectized: **complete line authority**, a **customer focal point**, **very rapid reaction** — but **high cost**, **no perpetuation of technology** and **no career continuity**. When an option sounds right, check whose list it comes from.
## Matrix organizational form
- The matrix organizational form is **an attempt to combine the advantages of the pure functional structure and the product organizational structure**.
- This form is **ideally suited for companies, such as construction, that are "project-driven"**.
- Since **each project represents a potential profit center**, the **power and authority used by the project manager come directly from the general manager**.
- The **project manager has total responsibility and accountability for project success**.
- The **functional departments**, on the other hand, have **functional responsibility to maintain technical excellence on the project**.
> In one line: the **project manager** answers for the **project** (what, when, for how much); the **functional departments** answer for **technical excellence** (how, by whom, to what standard).
The matrix structure therefore becomes **a compromise in an attempt to obtain the best of two worlds**:
| Form | What happened (slide) |
|---|---|
| Pure product management | **technology suffered**, because there wasn't a single group for planning and integration |
| Pure functional organization | **time and schedule were sacrificed** |
| Matrix | an attempt to obtain **maximum technology and performance** in a **cost-effective manner** and **within time and schedule constraints** |
- Obviously, **the matrix structure is the most complex of all organizational forms**: each worker belongs to a functional department and works on one or more projects — in effect, two bosses.
- IT example: in an outsourcing company, developers belong to the Java, Frontend and QA departments (their "home") and are assigned to client projects. The project manager of the bank project decides what must be done and by when; the head of the Java department decides who goes and makes sure the code meets the company's technical standards.
## Grinnell and Apple: when a matrix is most practical
Grinnell and Apple define **four situations** where it is most practical to consider a matrix:
- When **complex, short-run products** are the organization's primary output.
- When a complicated design calls for **both innovation and timely completion**.
- When **several kinds of sophisticated skills** are needed in designing, building, and testing the products — skills then need **constant updating and development**.
- When a **rapidly changing marketplace** calls for significant changes in products, perhaps between the time they are conceived and delivered.
> Memory hook: **complex short-run products, innovation plus deadline, many sophisticated skills, a fast-changing market** — the everyday life of a software outsourcing company.
## What a matrix needs to work
Matrix implementation requires:
- **Training in matrix operations**
- **Training in how to maintain open communications**
- **Training in problem solving**
- **Compatible reward systems**
- **Role definitions**
> Memory hook: **three kinds of training + rewards + roles**. Compatible reward systems matter because a worker's two bosses must not reward opposite behaviour; role definitions matter because two bosses must not give overlapping orders.
## Modification of matrix structures
The matrix can take many forms, but there are basically **three common varieties**. Each type represents **a different degree of authority attributed to the program manager** and **indirectly identifies the relative size of the company**.
| Variety | How it looks | Fits | Who settles conflicts between projects |
|---|---|---|---|
| 1. All program managers report directly to the general manager | PMs sit next to the functional directors, directly under the GM | **small companies that have few projects**; assumes the GM has sufficient time to coordinate activities between his project managers | **the general manager** — all conflicts between projects are referred to him |
| 2. Director of project management (Fig. 6) | a **Director: Project Mgmt** sits next to the directors of engineering and operations; **Project Mgr X, Y, Z** report to him, and their lines cross all functional departments | companies with more projects than the GM can coordinate (Kerzner) | the director of project management (Kerzner; not on the slide) |
| 3. Project engineering in the project office (Fig. 7) | inside **Director: Engineering** there is a **project engineering** unit; project engineer X, Y, Z is paired with Manager X, Y, Z, and each pair forms the **project office** | programs where technical direction must stay with engineering (Table 3) | not stated on the slides |
> Exam trap: the slide says "in the matrix of previous **Figure 5**, all program managers report directly to the general manager". In this deck Fig. 5 is the **pure product** chart (in Kerzner's book the reference is to a matrix figure). Remember the variety itself: **PMs report directly to the GM → small companies, few projects, the GM resolves all conflicts between projects**.
**Fig. 6 — Development of a director of project management** (picture slide): general manager → Director: Project Mgmt, Director: Engineering, Director: Operations, Others; under the director of project management stand **Project Mgr X, Y, Z**, whose horizontal arrows cross the vertical lines of the functional departments — the classic matrix grid.
**Fig. 7 — Placing project engineering in the project office** (picture slide): the same grid, but under Director: Engineering there are **Project Engineering** and **Other Units**; project engineers **X, Y, Z** stand next to **Manager X, Y, Z**, and the dashed box around Manager Z and engineer Z is labelled **project office control**.
## Table 3 — project management compared to project engineering (picture slide)
| Shared by both | Project management only | Project engineering only |
|---|---|---|
| Total project planning | Contract control | Configuration control |
| Cost control | Report preparation and distribution | Fabrication, testing, and production technical leadership support |
| Schedule control | Procurement | — |
| System specifications | Identification of reliability and maintainability requirements | — |
| Logistics support | Staffing | — |
| — | Priority scheduling | — |
| — | Management information systems | — |
- The main reason for separating project management from project engineering is so that **the project engineer will remain "solid" to the director of engineering** in order to have **the full authority to give technical direction to engineering**.
- "Solid" means a solid line on the chart — formal line reporting. The project engineer works in the project office but formally still belongs to engineering, so the engineers accept his technical direction.
- IT parallel: the project manager handles the contract, procurement, staffing, reports and priorities; the solution architect (the project engineer) handles configuration control and technical leadership and stays in the architecture department, so developers treat his technical decisions as binding.
> Exam trap: **configuration control** belongs to project **engineering**, while **contract control, report preparation and distribution, procurement, reliability and maintainability requirements, staffing, priority scheduling and management information systems** belong to project **management**. Total project planning, cost control, schedule control, system specifications and logistics support appear in **both** columns.
## Fig. 8 — Philosophy of management (picture slide)
A chart of skills along the career ladder: **junior clerk → senior clerk → supervisor → middle manager → manager → senior officer → president**.
- The **technical skills** curve (dashed) starts **high** at junior clerk and falls toward president.
- The **human skills** curve (solid) starts **low** at junior clerk and rises toward president.
- The two curves cross around the **middle manager**.
- Lesson (our reading — the slide gives only the chart): the higher the position, the more the job is about people rather than technology. That fits the split above: the project manager works mainly with people, plans and contracts, while technical direction stays with the project engineer.
## The strong, weak, or balanced matrix
- Matrix structures can be **strong, weak, or balanced**.
- The strength of the matrix is based upon **who has more influence over the daily performance of the workers: project manager or line managers**.
- If the **project manager** has more influence over the worker, the matrix structure functions as a **strong matrix** as seen through the eyes of the project manager.
- If the **line manager** has more influence than does the project manager, the organization functions as a **weak matrix** as seen by the project manager.
- **Balanced** (implied, not defined on the slide): the influence of the project manager and of the line managers is roughly equal.
@diagram pm5-matrix-strength
| Matrix | Who has more influence over daily work | What it feels like for a developer |
|---|---|---|
| Weak | the line (functional) manager | the department head sets the priorities; the PM can only ask and coordinate |
| Balanced | roughly equal | the PM sets what and when, the department head sets who and how |
| Strong | the project manager | the PM directs the daily work; the department mainly supplies people and standards |
> Exam trap: strength is **not** decided by the budget, the number of projects or the existence of a project office — it is decided by **who has more influence over the daily performance of the workers**, judged **through the eyes of the project manager**.
## Classical vs projectized vs matrix — the big comparison
@diagram pm5-structures
| Criterion | Traditional (classical / functional) | Pure product (projectized) | Matrix |
|---|---|---|---|
| Who manages the people | functional managers; each employee has **one and only one** person to report to | the **program manager**: assigns work **and** conducts merit reviews | shared: the PM directs the project work, the functional department owns the person and the technical standard |
| PM authority | **none**: no one individual is directly responsible for the total project | **complete line authority** over the entire project | comes **directly from the general manager**; the matrix can be weak, balanced or strong |
| Who answers for the project | nobody — committee solutions | the program manager | the PM has **total responsibility and accountability for project success** |
| Technology | **better technical control**; specialists grouped to share knowledge | **technology suffers**; no perpetuation of technology; no technical interchange | functional departments maintain **technical excellence** |
| Cost | **easier budgeting and cost control**; people used on many projects | **highest** — duplication of effort, facilities and personnel; no sharing | **cost-effective** — people are shared between projects |
| Customer and speed | **no customer focal point**; slow response to customer needs | **customer focal point**; **very rapid reaction time** | aims to stay within time and schedule constraints |
| Careers | **continuity** in the functional disciplines | **lack of career continuity** for project personnel | a permanent home in a functional department |
| Complexity | simple vertical lines | stable while there is a continuous flow of projects | **the most complex** of all forms; needs training, compatible rewards and role definitions |
| Best fit | mass production within established specifications; stable, repetitive work | a continuous flow of large, long projects | Grinnell and Apple's four situations; **project-driven** companies such as construction |
## Choosing a structure: quick cases
| Situation | Best fit | Why |
|---|---|---|
| A company runs many short, complex client projects that need innovation, on-time delivery and constantly updated skills | **Matrix** | Grinnell and Apple's four situations |
| A contractor builds one huge multi-year system with a dedicated team and plenty of budget | **Pure product (projectized)** | a continuous flow of work for one project; complete line authority; the cost is affordable |
| A bank's IT department mostly runs routine maintenance releases to established specifications | **Traditional (classical)** | admits mass production within established specifications; easy cost control |
| A small firm with three projects and a general manager who has time to coordinate them | **Matrix, PMs reporting to the GM** | the variety for small companies with few projects |
?? In a projectized company, who assigns work to an engineer and who conducts her merit review?
?= The program (project) manager does both: he maintains complete line authority over the entire project — not only does he assign work, he also conducts merit reviews.
?? In a matrix, who answers for project success and who answers for technical excellence?
?= The project manager has total responsibility and accountability for project success; the functional departments have functional responsibility to maintain technical excellence on the project.
?? Developers in a matrix take their daily priorities from their department head; the PM can only request work. What kind of matrix is this?
?= A weak matrix as seen by the project manager, because the line manager has more influence over the daily performance of the workers.
?? Why is project management separated from project engineering in Fig. 7?
?= So that the project engineer remains "solid" (formal line reporting) to the director of engineering and keeps the full authority to give technical direction to engineering.
## Exam focus
- Projectized: develops as **a division within a division**; stable while there is a **continuous flow of projects**; **major advantage** — the program manager's **complete line authority** (assigns work **and** conducts merit reviews); **major disadvantage** — **cost**; no sharing of people; people kept long after they are needed.
- Table 1 = **10** advantages; Table 2 = **6** disadvantages — know the items and which list each one is on.
- Matrix: combines the advantages of the functional and product forms; ideal for **project-driven** companies such as **construction**; the PM's authority comes **directly from the general manager**; the PM has **total responsibility and accountability for project success**; functional departments keep **technical excellence**; **the most complex** form.
- Product form — technology suffered; functional form — time and schedule were sacrificed; matrix — maximum technology and performance, cost-effective, within time and schedule constraints.
- Grinnell and Apple's **four** matrix situations; **five** implementation requirements (three kinds of training, compatible reward systems, role definitions).
- **Three** varieties of matrix: PMs report to the GM (small company, few projects, the GM settles conflicts between projects); director of project management (Fig. 6); project engineering in the project office (Fig. 7). Table 3 split; the project engineer stays **"solid"** to the director of engineering.
- Strong / weak / balanced = **who has more influence over the workers' daily performance**, as seen through the eyes of the project manager.`,
    ru: `## Чисто продуктовая (проектная) организация (pure product / projectized organization)
- Чисто продуктовая организация, как на Figure 5, **складывается как подразделение внутри подразделения (a division within a division)**.
- Пока есть **непрерывный поток проектов (continuous flow of projects)**, работа стабильна, а конфликты минимальны.
- **Главное преимущество (major advantage)** этой формы — **один человек, руководитель программы (program manager), сохраняет полные линейные полномочия (complete line authority) над всем проектом**.
- **Он не только распределяет работу, но и проводит оценку работы сотрудников (conducts merit reviews).**
**Fig. 5 — чисто продуктовая, или проектная, структура (pure product or projectized structure)** (слайд-картинка): наверху **генеральный менеджер (general manager)**; под ним **Product A manager, Product B manager, Product C manager**; под **каждым** менеджером продукта — свои **Eng.** (инженерия) и **Manu.** (производство). У каждой продуктовой линии полный собственный набор функций.
- **Главный недостаток (major disadvantage)** чисто проектной формы — **стоимость содержания организации (the cost of maintaining the organization)**.
- **Нет возможности разделить сотрудника с другим проектом (no chance for sharing an individual)**, чтобы снизить затраты.
- Людей обычно **держат на проекте ещё долго после того, как они перестали быть нужны (long after they are needed)**: если отпустить сотрудника, проектный менеджер **может не получить его обратно**.
- Пример из IT: в игровой студии три команды игр, у каждой свои программисты, художники, QA и DevOps. Лид игры A нанимает людей, раздаёт задачи и пишет оценки работы. Но DevOps-инженер игры B половину времени простаивает и не может помочь игре A — а лид игры B его не отпускает, боясь больше не получить обратно.
## Table 1 — преимущества продуктовой организационной формы (слайд-картинка)
| № | Преимущество (формулировка Table 1) |
|---|---|
| 1 | Даёт полные линейные полномочия над проектом (то есть сильный контроль через единый проектный центр власти, single project authority). |
| 2 | Участники работают непосредственно на проектного менеджера. Убыточные продуктовые линии легко выявить и закрыть (unprofitable product lines are easily identified and can be eliminated). |
| 3 | Сильные каналы коммуникации (strong communications channels). |
| 4 | Персонал может сохранять экспертизу по проекту, не делясь ключевыми людьми (without sharing key personnel). |
| 5 | Обеспечивается очень быстрая реакция (very rapid reaction time). |
| 6 | Персонал лоялен проекту; мораль выше благодаря отождествлению с продуктом (product identification). |
| 7 | Появляется единая точка контакта для отношений с внешними заказчиками (a focal point for out-of-company customer relations). |
| 8 | Гибкость в компромиссах между сроком (графиком), стоимостью и характеристиками (time, cost, and performance trade-offs). |
| 9 | Управлять стыками проще, так как подразделение меньше (interface management becomes easier as unit size is decreased). |
| 10 | У высшего руководства остаётся больше времени на стратегические решения (more free time for executive decision-making). |
## Table 2 — недостатки продуктовой организационной формы (слайд-картинка)
| № | Недостаток (формулировка Table 2) |
|---|---|
| 1 | Содержать такую форму в многопродуктовой компании непомерно дорого из-за дублирования усилий, помещений и персонала (duplication of effort, facilities, and personnel); неэффективное использование. |
| 2 | Склонность держать персонал на проекте ещё долго после того, как он нужен. Высшему руководству приходится балансировать нагрузку по мере запуска и закрытия проектов. |
| 3 | Страдает технология (technology suffers): без сильных функциональных групп затруднено развитие возможностей компании для новых программ (то есть нет преемственности технологий, no perpetuation of technology). |
| 4 | Управление функциональными (то есть организационными) специалистами требует координации на высшем уровне (top-level coordination). |
| 5 | Нет возможностей для технического обмена между проектами (technical interchange between projects). |
| 6 | Нет карьерной преемственности и перспектив для персонала проекта (lack of career continuity). |
> Ловушка экзамена: списки проектной формы — почти зеркало классических. Классическая: один начальник в функциональной линии, простой контроль затрат, общий персонал, сильный технический контроль — но **нет точки контакта с заказчиком** и медленная реакция. Проектная: **полные линейные полномочия**, **точка контакта с заказчиком**, **очень быстрая реакция** — но **высокая стоимость**, **нет преемственности технологий** и **нет карьерной преемственности**. Если вариант звучит верно, проверьте, из чьего он списка.
## Матричная организационная форма (matrix organizational form)
- Матричная форма — **попытка совместить преимущества чисто функциональной и продуктовой структур (combine the advantages of the pure functional structure and the product organizational structure)**.
- Эта форма **идеально подходит компаниям, которые «живут проектами» (project-driven), например строительным (construction)**.
- Поскольку **каждый проект — потенциальный центр прибыли (potential profit center)**, **власть и полномочия проектного менеджера исходят непосредственно от генерального менеджера (directly from the general manager)**.
- **Проектный менеджер несёт полную ответственность и подотчётность за успех проекта (total responsibility and accountability for project success)**.
- **Функциональные отделы** же несут **функциональную ответственность за поддержание технического совершенства проекта (technical excellence)**.
> Одной строкой: **проектный менеджер** отвечает за **проект** (что, когда, за сколько); **функциональные отделы** — за **техническое совершенство** (как, кем, по какому стандарту).
Поэтому матрица становится **компромиссом в попытке получить лучшее из двух миров (the best of two worlds)**:
| Форма | Что происходило (слайд) |
|---|---|
| Чисто продуктовое управление | **страдала технология (technology suffered)**, потому что не было единой группы для планирования и интеграции |
| Чисто функциональная организация | **жертвовали сроками и графиком (time and schedule were sacrificed)** |
| Матрица | попытка получить **максимум технологий и характеристик (maximum technology and performance)** **экономически эффективно (cost-effective)** и **в рамках сроков и графика (within time and schedule constraints)** |
- Очевидно, **матрица — самая сложная из всех организационных форм (the most complex of all organizational forms)**: каждый работник числится в функциональном отделе и работает на один или несколько проектов — по сути, у него два начальника.
- Пример из IT: в аутсорсинговой компании разработчики числятся в отделах Java, Frontend и QA (их «дом») и назначаются на клиентские проекты. Проектный менеджер банковского проекта решает, что сделать и к какому сроку; руководитель Java-отдела решает, кто пойдёт, и следит, чтобы код соответствовал техническим стандартам компании.
## Гриннелл и Эппл: когда матрица разумнее всего
Гриннелл и Эппл называют **четыре ситуации (four situations)**, в которых разумнее всего рассмотреть матрицу:
- Когда основной продукт организации — **сложные продукты короткого цикла (complex, short-run products)**.
- Когда сложный проект требует **и инноваций, и своевременного завершения (both innovation and timely completion)**.
- Когда для проектирования, создания и тестирования продуктов нужны **несколько видов сложных навыков (several kinds of sophisticated skills)** — и эти навыки требуют **постоянного обновления и развития**.
- Когда **быстро меняющийся рынок (rapidly changing marketplace)** требует существенных изменений продуктов — возможно, ещё между их замыслом и поставкой.
> Запомнить: **сложные короткие продукты, инновации плюс срок, много сложных навыков, быстро меняющийся рынок** — обычная жизнь софтверной аутсорс-компании.
## Что нужно, чтобы матрица работала
Внедрение матрицы требует (matrix implementation requires):
- **Обучения работе в матрице (training in matrix operations)**
- **Обучения тому, как поддерживать открытую коммуникацию (training in how to maintain open communications)**
- **Обучения решению проблем (training in problem solving)**
- **Совместимых систем вознаграждения (compatible reward systems)**
- **Определения ролей (role definitions)**
> Запомнить: **три вида обучения + вознаграждение + роли**. Совместимые системы вознаграждения важны, потому что два начальника работника не должны поощрять противоположное поведение; определение ролей — потому что два начальника не должны отдавать пересекающиеся распоряжения.
## Модификации матричных структур (modification of matrix structures)
Матрица бывает разной, но в основном есть **три распространённых варианта (three common varieties)**. Каждый тип означает **разную степень полномочий, отданных руководителю программы (program manager)**, и **косвенно указывает на относительный размер компании**.
| Вариант | Как выглядит | Кому подходит | Кто решает конфликты между проектами |
|---|---|---|---|
| 1. Все руководители программ подчиняются напрямую генеральному менеджеру | PM стоят рядом с функциональными директорами, прямо под GM | **небольшим компаниям с немногими проектами**; предполагается, что у GM достаточно времени координировать своих проектных менеджеров | **генеральный менеджер** — ему передают все конфликты между проектами |
| 2. Директор по управлению проектами (Fig. 6) | **Director: Project Mgmt** стоит рядом с директорами инженерии и операций; **Project Mgr X, Y, Z** подчиняются ему, а их линии пересекают все функциональные отделы | компаниям, где проектов больше, чем может координировать GM (Kerzner) | директор по управлению проектами (Kerzner; на слайде не сказано) |
| 3. Проектная инженерия в проектном офисе (Fig. 7) | внутри **Director: Engineering** есть подразделение **project engineering**; инженер проекта X, Y, Z работает в паре с Manager X, Y, Z, и каждая пара образует **проектный офис (project office)** | программам, где техническое руководство должно остаться за инженерией (Table 3) | на слайдах не сказано |
> Ловушка экзамена: слайд говорит «в матрице с предыдущей **Figure 5** все руководители программ подчиняются напрямую генеральному менеджеру». В этой презентации Fig. 5 — схема **чисто продуктовой** структуры (в книге Кернцнера ссылка ведёт на рисунок матрицы). Запомните сам вариант: **PM подчиняются напрямую GM → небольшие компании, немного проектов, все конфликты между проектами решает GM**.
**Fig. 6 — появление директора по управлению проектами (development of a director of project management)** (слайд-картинка): генеральный менеджер → Director: Project Mgmt, Director: Engineering, Director: Operations, Others; под директором по управлению проектами — **Project Mgr X, Y, Z**, чьи горизонтальные стрелки пересекают вертикальные линии функциональных отделов, — классическая сетка матрицы.
**Fig. 7 — проектная инженерия в проектном офисе (placing project engineering in the project office)** (слайд-картинка): та же сетка, но под Director: Engineering — **Project Engineering** и **Other Units**; инженеры проектов **X, Y, Z** стоят рядом с **Manager X, Y, Z**, а пунктирная рамка вокруг Manager Z и инженера Z подписана **project office control**.
## Table 3 — управление проектом и проектная инженерия (project management compared to project engineering, слайд-картинка)
| Общее для обоих | Только project management | Только project engineering |
|---|---|---|
| Общее планирование проекта (total project planning) | Контроль контрактов (contract control) | Управление конфигурацией (configuration control) |
| Контроль затрат (cost control) | Подготовка и рассылка отчётов (report preparation and distribution) | Техническое руководство изготовлением, испытаниями и производством (fabrication, testing, and production technical leadership support) |
| Контроль графика (schedule control) | Закупки (procurement) | — |
| Системные спецификации (system specifications) | Определение требований к надёжности и ремонтопригодности (reliability and maintainability requirements) | — |
| Логистическая поддержка (logistics support) | Подбор персонала (staffing) | — |
| — | Приоритизация графика (priority scheduling) | — |
| — | Управленческие информационные системы (management information systems) | — |
- Главная причина отделить управление проектом от проектной инженерии — чтобы **инженер проекта (project engineer) оставался «solid» — в прямом подчинении — директору по инженерии (director of engineering)** и имел **полные полномочия давать инженерам технические указания (full authority to give technical direction to engineering)**.
- «Solid» — сплошная линия на схеме, то есть формальное линейное подчинение. Инженер проекта работает в проектном офисе, но формально остаётся в инженерии, поэтому инженеры принимают его технические указания.
- Параллель в IT: проектный менеджер ведёт контракт, закупки, подбор людей, отчёты и приоритеты; архитектор решения (инженер проекта) ведёт управление конфигурацией и техническое руководство и остаётся в отделе архитектуры — поэтому разработчики воспринимают его технические решения как обязательные.
> Ловушка экзамена: **configuration control** — это проектная **инженерия**, а **contract control, report preparation and distribution, procurement, reliability and maintainability requirements, staffing, priority scheduling и management information systems** — **управление** проектом. Total project planning, cost control, schedule control, system specifications и logistics support стоят в **обеих** колонках.
## Fig. 8 — философия управления (philosophy of management, слайд-картинка)
График навыков вдоль карьерной лестницы: **junior clerk → senior clerk → supervisor → middle manager → manager → senior officer → president**.
- Кривая **технических навыков (technical skills)** (пунктир) начинается **высоко** у младшего клерка и падает к президенту.
- Кривая **навыков работы с людьми (human skills)** (сплошная) начинается **низко** у младшего клерка и растёт к президенту.
- Кривые пересекаются примерно на уровне **менеджера среднего звена (middle manager)**.
- Вывод (наше прочтение — на слайде только график): чем выше должность, тем больше работа связана с людьми, а не с технологиями. Это согласуется с разделением выше: проектный менеджер работает в основном с людьми, планами и контрактами, а техническое руководство остаётся за инженером проекта.
## Сильная, слабая или сбалансированная матрица (strong, weak, or balanced matrix)
- Матрица может быть **сильной, слабой или сбалансированной**.
- Сила матрицы определяется тем, **у кого больше влияния на ежедневную работу сотрудников (daily performance of the workers): у проектного менеджера или у линейных менеджеров**.
- Если больше влияния на работника у **проектного менеджера**, матрица работает как **сильная (strong matrix)** — глазами проектного менеджера.
- Если у **линейного менеджера (line manager)** влияния больше, чем у проектного, организация работает как **слабая матрица (weak matrix)** — с точки зрения проектного менеджера.
- **Сбалансированная (balanced)** (подразумевается, на слайде не определена): влияние проектного и линейных менеджеров примерно равно.
@diagram pm5-matrix-strength
| Матрица | У кого больше влияния на ежедневную работу | Как это ощущает разработчик |
|---|---|---|
| Слабая (weak) | у линейного (функционального) менеджера | приоритеты задаёт руководитель отдела; PM может только просить и координировать |
| Сбалансированная (balanced) | примерно поровну | PM задаёт «что и когда», руководитель отдела — «кто и как» |
| Сильная (strong) | у проектного менеджера | PM руководит ежедневной работой; отдел в основном поставляет людей и стандарты |
> Ловушка экзамена: силу матрицы определяет **не** бюджет, не число проектов и не наличие проектного офиса, а то, **у кого больше влияния на ежедневную работу сотрудников**, — **глазами проектного менеджера**.
## Классическая vs проектная vs матричная — большое сравнение
@diagram pm5-structures
| Критерий | Традиционная (классическая / функциональная) | Чисто продуктовая (projectized) | Матричная (matrix) |
|---|---|---|---|
| Кто управляет людьми | функциональные менеджеры; у каждого **один и только один** начальник | **руководитель программы**: распределяет работу **и** проводит merit review | совместно: PM руководит работой по проекту, функциональный отдел «владеет» человеком и техническим стандартом |
| Полномочия PM | **нет**: ни один человек не отвечает напрямую за проект целиком | **полные линейные полномочия** над всем проектом | исходят **непосредственно от генерального менеджера**; матрица бывает слабой, сбалансированной или сильной |
| Кто отвечает за проект | никто — решения комитетом | руководитель программы | у PM **полная ответственность и подотчётность за успех проекта** |
| Технология | **лучший технический контроль**; специалисты сгруппированы для обмена знаниями | **технология страдает**; нет преемственности технологий; нет технического обмена | функциональные отделы поддерживают **техническое совершенство** |
| Стоимость | **проще бюджетирование и контроль затрат**; люди работают на многих проектах | **самая высокая** — дублирование усилий, помещений и персонала; людьми не делятся | **экономически эффективно** — людей делят между проектами |
| Заказчик и скорость | **нет точки контакта с заказчиком**; медленная реакция на его нужды | **точка контакта с заказчиком**; **очень быстрая реакция** | стремится уложиться в сроки и график |
| Карьера | **преемственность** функциональных дисциплин | **нет карьерной преемственности** у персонала проекта | постоянный «дом» в функциональном отделе |
| Сложность | простые вертикальные линии | стабильна, пока есть непрерывный поток проектов | **самая сложная** из всех форм; нужны обучение, совместимое вознаграждение и определение ролей |
| Лучше всего подходит | массовое производство по установленным спецификациям; стабильная повторяющаяся работа | непрерывный поток крупных долгих проектов | четыре ситуации Гриннелла и Эппла; компании, **живущие проектами (project-driven)**, например строительные |
## Выбор структуры: быстрые кейсы
| Ситуация | Что подходит | Почему |
|---|---|---|
| Компания ведёт много коротких сложных клиентских проектов, где нужны инновации, сдача в срок и постоянно обновляемые навыки | **Матрица** | четыре ситуации Гриннелла и Эппла |
| Подрядчик строит одну огромную многолетнюю систему с выделенной командой и большим бюджетом | **Чисто продуктовая (projectized)** | непрерывный поток работы по одному проекту; полные линейные полномочия; стоимость по карману |
| IT-департамент банка в основном выпускает плановые релизы поддержки по установленным спецификациям | **Традиционная (классическая)** | допускает массовое производство по установленным спецификациям; простой контроль затрат |
| Небольшая фирма с тремя проектами и генеральным менеджером, у которого есть время их координировать | **Матрица, PM подчиняются GM** | вариант для небольших компаний с немногими проектами |
?? Кто в проектной компании распределяет работу инженеру и кто проводит оценку её работы (merit review)?
?= И то и другое делает руководитель программы (проекта): у него полные линейные полномочия над всем проектом — он не только распределяет работу, но и проводит merit reviews.
?? Кто в матрице отвечает за успех проекта, а кто — за техническое совершенство?
?= У проектного менеджера полная ответственность и подотчётность за успех проекта; у функциональных отделов — функциональная ответственность за поддержание технического совершенства проекта.
?? Разработчики в матрице получают ежедневные приоритеты от руководителя отдела, а PM может только просить о работе. Какая это матрица?
?= Слабая матрица с точки зрения проектного менеджера: у линейного менеджера больше влияния на ежедневную работу сотрудников.
?? Зачем на Fig. 7 управление проектом отделено от проектной инженерии?
?= Чтобы инженер проекта оставался «solid» (в формальном линейном подчинении) у директора по инженерии и сохранял полные полномочия давать инженерам технические указания.
## Фокус экзамена
- Проектная форма: складывается как **подразделение внутри подразделения**; стабильна, пока есть **непрерывный поток проектов**; **главное преимущество** — **полные линейные полномочия** руководителя программы (распределяет работу **и** проводит merit reviews); **главный недостаток** — **стоимость**; людьми нельзя делиться; людей держат дольше, чем нужно.
- Table 1 — **10** преимуществ; Table 2 — **6** недостатков: знайте пункты и в каком списке каждый.
- Матрица: совмещает преимущества функциональной и продуктовой форм; идеальна для компаний, **живущих проектами (project-driven)**, например **строительных**; полномочия PM исходят **непосредственно от генерального менеджера**; у PM — **полная ответственность и подотчётность за успех проекта**; у функциональных отделов — **техническое совершенство**; **самая сложная** форма.
- Продуктовая форма — страдала технология; функциональная — жертвовали сроками и графиком; матрица — максимум технологий и характеристик, экономично, в рамках сроков и графика.
- **Четыре** ситуации для матрицы по Гриннеллу и Эпплу; **пять** требований к внедрению (три вида обучения, совместимые системы вознаграждения, определение ролей).
- **Три** варианта матрицы: PM подчиняются GM (небольшая компания, мало проектов, конфликты между проектами решает GM); директор по управлению проектами (Fig. 6); проектная инженерия в проектном офисе (Fig. 7). Разделение по Table 3; инженер проекта остаётся **«solid»** к директору по инженерии.
- Сильная / слабая / сбалансированная = **у кого больше влияния на ежедневную работу сотрудников**, глазами проектного менеджера.`,
  },
  [
    qx("According to the lecture, what is the major advantage of the pure product (projectized) organization?", "The program manager has complete line authority over the project", [
      ["Personnel can be shared with other projects to reduce costs", "The slide says the opposite: there is no chance for sharing an individual with another project in order to reduce costs.", "Слайд говорит обратное: нет возможности разделить сотрудника с другим проектом, чтобы снизить затраты."],
      ["Strong functional groups ensure the perpetuation of technology", "Table 2 lists the opposite as a disadvantage: technology suffers and there is no perpetuation of technology.", "Table 2 называет обратное недостатком: технология страдает, преемственности технологий нет."],
      ["Each worker answers to both a project manager and a functional boss", "Two bosses describe the matrix; in the projectized form participants work directly for the project manager.", "Два начальника — это матрица; в проектной форме участники работают непосредственно на проектного менеджера."],
    ], "Slide: the major advantage is that one individual, the program manager, maintains complete line authority over the entire project.", "Слайд: главное преимущество — один человек, руководитель программы, сохраняет полные линейные полномочия над всем проектом."),
    qx("In a projectized company, who assigns tasks to a software engineer and conducts her merit review?", "The program (project) manager", [
      ["The functional department manager", "In the classical form the functional manager would do this; in the projectized form the program manager holds complete line authority.", "В классической форме это делал бы функциональный менеджер; в проектной полные линейные полномочия у руководителя программы."],
      ["The director of engineering", "The director of engineering keeps the project engineer \"solid\" in a matrix variety (Fig. 7); he is not the boss in a projectized company.", "Директор по инженерии держит project engineer в «solid»-подчинении в варианте матрицы (Fig. 7); в проектной компании он не начальник."],
      ["The general manager personally", "The general manager sits above the product managers (Fig. 5); work assignment and merit reviews are done by the program manager.", "Генеральный менеджер стоит над менеджерами продуктов (Fig. 5); работу и merit reviews распределяет руководитель программы."],
    ], "Slide: not only does the program manager assign work, but he also conducts merit reviews.", "Слайд: руководитель программы не только распределяет работу, но и проводит merit reviews."),
    qx("What does the lecture name as the major disadvantage of the pure project (projectized) form?", "The cost of maintaining the organization", [
      ["Slow response to customer needs", "Slow response is a classical disadvantage; the projectized form offers very rapid reaction time (Table 1).", "Медленная реакция — недостаток классической формы; проектная даёт очень быструю реакцию (Table 1)."],
      ["No single point of project authority", "The projectized form has exactly that — complete line authority in one program manager.", "У проектной формы как раз есть единый центр — полные линейные полномочия у руководителя программы."],
      ["Decisions favor the strongest functional groups", "This is a disadvantage of the classical organization, where functional groups dominate.", "Это недостаток классической организации, где доминируют функциональные группы."],
    ], "Slide: the major disadvantage with the pure project form is the cost of maintaining the organization; individuals cannot be shared with other projects to reduce costs.", "Слайд: главный недостаток чисто проектной формы — стоимость содержания организации; людей нельзя делить с другими проектами ради экономии."),
    qx("Which of the following is NOT a disadvantage of the product organizational form listed in Table 2?", "Slow reaction to changing customer needs and requests", [
      ["Lack of career continuity for project personnel", "This is the sixth item of Table 2: lack of career continuity and opportunities for project personnel.", "Это шестой пункт Table 2: нет карьерной преемственности и перспектив для персонала проекта."],
      ["Control of specialists requires top-level coordination", "This is the fourth item of Table 2: control of functional specialists requires top-level coordination.", "Это четвёртый пункт Table 2: управление функциональными специалистами требует координации на высшем уровне."],
      ["Lack of technical interchange between projects", "This is the fifth item of Table 2: lack of opportunities for technical interchange between projects.", "Это пятый пункт Table 2: нет возможностей для технического обмена между проектами."],
    ], "The product form provides very rapid reaction time (Table 1); slow response to customer needs is a classical disadvantage, not a Table 2 item.", "Продуктовая форма даёт очень быструю реакцию (Table 1); медленная реакция на нужды заказчика — недостаток классической формы, а не пункт Table 2."),
    qx("According to Table 2, why does technology suffer in the product (projectized) organizational form?", "Without strong functional groups, technology is not perpetuated", [
      ["Specialists are shared across far too many projects at the same time", "Sharing is impossible in this form — each project keeps its own people; over-sharing is not the issue.", "В этой форме делиться людьми невозможно — у каждого проекта свои; проблема не в чрезмерном разделении."],
      ["The general manager makes all the technical decisions", "Table 2 does not say this; the GM's time is actually freed for executive decisions (Table 1).", "Table 2 этого не говорит; наоборот, у GM освобождается время на стратегические решения (Table 1)."],
      ["Project engineers report solid to the project manager", "\"Solid\" reporting comes from the matrix modification (Fig. 7), where the project engineer stays solid to the director of engineering.", "«Solid»-подчинение — из модификации матрицы (Fig. 7), где инженер проекта остаётся «solid» к директору по инженерии."],
    ], "Table 2: technology suffers because, without strong functional groups, the outlook to improve the company's capabilities for new programs is hampered — no perpetuation of technology.", "Table 2: технология страдает, потому что без сильных функциональных групп затруднено развитие возможностей компании для новых программ — нет преемственности технологий."),
    qx("How does the lecture define the matrix organizational form?", "An attempt to combine functional and product form advantages", [
      ["A temporary group of representatives from each functional unit", "This describes the task force, an earlier step in the evolution of work integration.", "Это task force — более ранний шаг эволюции интеграции работ."],
      ["A division within a division with its own complete functions", "\"A division within a division\" is how the pure product (projectized) organization develops.", "«Подразделение внутри подразделения» — так складывается чисто продуктовая организация."],
      ["A staff position that coordinates departments for the division", "This is the line/staff organization with a project coordinator (Fig. 4).", "Это линейно-штабная организация с координатором проекта (Fig. 4)."],
    ], "Slide: the matrix organizational form is an attempt to combine the advantages of the pure functional structure and the product organizational structure.", "Слайд: матричная форма — попытка совместить преимущества чисто функциональной и продуктовой структур."),
    qx("In the matrix form, where do the power and authority used by the project manager come from?", "Directly from the general manager", [
      ["From the functional department heads", "Functional departments keep functional responsibility for technical excellence; they do not grant the PM his authority.", "Функциональные отделы отвечают за техническое совершенство; полномочия PM они не дают."],
      ["From the director of engineering", "The director of engineering directs engineering; in Fig. 7 he keeps the project engineer \"solid\", not the PM.", "Директор по инженерии руководит инженерией; на Fig. 7 он держит в «solid»-подчинении инженера проекта, а не PM."],
      ["From the client's signed contract", "Contract control is a PM function (Table 3), but the slide says authority comes from the general manager.", "Контроль контрактов — функция PM (Table 3), но слайд говорит, что полномочия исходят от генерального менеджера."],
    ], "Slide: since each project represents a potential profit center, the power and authority used by the project manager come directly from the general manager.", "Слайд: поскольку каждый проект — потенциальный центр прибыли, власть и полномочия проектного менеджера исходят непосредственно от генерального менеджера."),
    qx("A software firm delivers many short, complex client systems that need both innovation and on-time delivery, and its engineers' skills must be constantly updated. Which structure do Grinnell and Apple suggest considering?", "The matrix organizational structure", [
      ["The traditional (classical) structure", "In the classical form time and schedule are sacrificed and response is slow — the opposite of what these projects need.", "В классической форме жертвуют сроками и графиком, реакция медленная — противоположность того, что нужно этим проектам."],
      ["The pure product (projectized) form", "Projectized works when there is a continuous flow of projects; for many short-run products duplicating staff would be too costly.", "Проектная форма хороша при непрерывном потоке проектов; для множества коротких продуктов дублировать персонал слишком дорого."],
      ["Departmental project management", "Departmental project leaders work inside one department and cannot integrate several sophisticated skills.", "Департаментные project leaders работают внутри одного отдела и не могут объединить несколько сложных навыков."],
    ], "These are Grinnell and Apple's situations for a matrix: complex short-run products, a design needing both innovation and timely completion, several sophisticated skills that need constant updating.", "Это ситуации Гриннелла и Эппла для матрицы: сложные продукты короткого цикла, проект, требующий и инноваций, и своевременности, несколько сложных навыков, требующих постоянного обновления."),
    qx("Which of the following is NOT one of Grinnell and Apple's four situations where a matrix is most practical?", "When a continuous flow of similar projects keeps work stable", [
      ["When complex, short-run products are the primary output", "This is the first of the four situations on the slide.", "Это первая из четырёх ситуаций на слайде."],
      ["When a complicated design needs innovation and timely completion", "This is the second situation: a complicated design calls for both innovation and timely completion.", "Это вторая ситуация: сложный проект требует и инноваций, и своевременного завершения."],
      ["When a rapidly changing market forces changes in products", "This is the fourth situation: significant product changes, perhaps between conception and delivery.", "Это четвёртая ситуация: существенные изменения продукта, возможно, между замыслом и поставкой."],
    ], "A continuous flow of projects that keeps work stable and conflicts minimal is the condition under which the pure product (projectized) organization works well — not a matrix situation.", "Непрерывный поток проектов, при котором работа стабильна, а конфликты минимальны, — условие для чисто продуктовой (проектной) организации, а не ситуация для матрицы."),
    qx("Which of the following is NOT listed as a requirement for matrix implementation?", "Duplicate facilities for every project", [
      ["Training in how to maintain open communications", "This is the second requirement on the slide.", "Это второе требование на слайде."],
      ["Compatible reward systems", "This is the fourth requirement on the slide.", "Это четвёртое требование на слайде."],
      ["Role definitions", "This is the fifth requirement on the slide.", "Это пятое требование на слайде."],
    ], "Matrix implementation requires training in matrix operations, in open communications and in problem solving, compatible reward systems and role definitions. Duplicate facilities are a cost problem of the projectized form.", "Внедрению матрицы нужны обучение работе в матрице, открытой коммуникации и решению проблем, совместимые системы вознаграждения и определение ролей. Дублирование помещений — проблема стоимости проектной формы."),
    qx("According to the lecture, what was sacrificed in the pure functional organization, and what suffered in pure product management?", "Time and schedule; technology", [
      ["Technology; time and schedule", "The pair is reversed: functional organizations keep technology strong but lose time and schedule.", "Пара перевёрнута: функциональная организация сохраняет сильную технологию, но теряет сроки и график."],
      ["Cost; customer focus", "Cost is the classical form's strength (easier cost control), and customer focus is the product form's strength.", "Стоимость — сильная сторона классической формы (простой контроль затрат), а фокус на заказчике — продуктовой."],
      ["Technical control; cost control", "Both are listed as advantages of the classical organization, not as what it sacrificed.", "Оба указаны как преимущества классической организации, а не как то, чем она жертвует."],
    ], "Slide: in pure product management technology suffered, because there wasn't a single group for planning and integration; in the pure functional organization time and schedule were sacrificed.", "Слайд: в чисто продуктовом управлении страдала технология — не было единой группы для планирования и интеграции; в чисто функциональной организации жертвовали сроками и графиком."),
    qx("In the matrix variety where all program managers report directly to the general manager, which statement is true?", "It suits small companies with few projects", [
      ["It suits large firms running many projects", "It assumes the GM has enough time to coordinate the PMs — realistic only with few projects.", "Он предполагает, что у GM хватает времени координировать PM, — это реально только при немногих проектах."],
      ["A director of project management settles conflicts", "A director of project management is a different variety (Fig. 6); here all conflicts go to the general manager.", "Директор по управлению проектами — другой вариант (Fig. 6); здесь все конфликты идут к генеральному менеджеру."],
      ["The project engineer reports solid to the PM", "The project engineer reports solid to the director of engineering (Fig. 7), and that is another variety.", "Инженер проекта в «solid»-подчинении у директора по инженерии (Fig. 7), и это другой вариант."],
    ], "Slide: this arrangement works best for small companies that have few projects and assumes the general manager has sufficient time; all conflicts between projects are referred to the GM.", "Слайд: такая схема лучше всего подходит небольшим компаниям с немногими проектами и предполагает, что у генерального менеджера достаточно времени; все конфликты между проектами передаются ему."),
    qx("What is the main reason for separating project management from project engineering?", "So the project engineer stays solid to the engineering director", [
      ["So the PM can give engineers technical direction", "The point is the reverse: technical direction stays with the project engineer, who keeps line authority from engineering.", "Смысл обратный: техническое руководство остаётся за инженером проекта, у которого линейные полномочия от инженерии."],
      ["So procurement and staffing move to the engineering department", "Procurement and staffing remain project management functions in Table 3.", "Закупки и подбор персонала в Table 3 остаются функциями управления проектом."],
      ["So the general manager can resolve all conflicts between projects", "Referring all conflicts to the GM belongs to the small-company variety, not to this separation.", "Передача всех конфликтов GM — признак варианта для небольших компаний, а не этого разделения."],
    ], "Slide: the project engineer remains \"solid\" to the director of engineering in order to have the full authority to give technical direction to engineering.", "Слайд: инженер проекта остаётся «solid» к директору по инженерии, чтобы иметь полные полномочия давать инженерам технические указания."),
    qx("In Table 3, which function is listed under project engineering but NOT under project management?", "Configuration control", [
      ["Contract control", "Contract control is listed only under project management.", "Contract control указан только у project management."],
      ["Report preparation and distribution", "Report preparation and distribution is a project management function only.", "Подготовка и рассылка отчётов — функция только project management."],
      ["Priority scheduling", "Priority scheduling is listed only under project management.", "Priority scheduling указан только у project management."],
    ], "Table 3: project engineering alone has configuration control and fabrication, testing and production technical leadership support; contract control, reports, procurement, staffing, priority scheduling and MIS are project management only.", "Table 3: только у project engineering — configuration control и техническое руководство изготовлением, испытаниями и производством; contract control, отчёты, закупки, подбор персонала, priority scheduling и MIS — только у project management."),
    qx("What determines whether a matrix is strong, weak or balanced?", "Who has more influence over workers' daily performance", [
      ["How many projects report directly to the general manager", "The number of PMs reporting to the GM distinguishes matrix varieties by company size, not matrix strength.", "Число PM, подчинённых GM, различает варианты матрицы по размеру компании, а не силу матрицы."],
      ["Whether a director of project management exists", "A director of project management is a structural modification (Fig. 6), not the measure of strength.", "Директор по управлению проектами — структурная модификация (Fig. 6), а не мера силы."],
      ["How large the project budget is compared with costs", "Budgets are not mentioned; strength depends on influence over the workers.", "Бюджет не упоминается; сила зависит от влияния на работников."],
    ], "Slide: the strength of the matrix is based upon who has more influence over the daily performance of the workers — the project manager or the line managers.", "Слайд: сила матрицы определяется тем, у кого больше влияния на ежедневную работу сотрудников — у проектного менеджера или у линейных менеджеров."),
    qx("Developers in a matrix get their daily priorities from their department head; the project manager can only request work and coordinate. How does this organization function, as seen by the PM?", "Weak matrix — the line manager has more influence", [
      ["Strong matrix — the project manager has more influence", "In a strong matrix the PM would have more influence over the daily work; here the department head does.", "В сильной матрице больше влияния на ежедневную работу было бы у PM; здесь — у руководителя отдела."],
      ["Balanced matrix — influence is equal", "Influence is not equal: the department head sets the daily priorities and the PM only requests.", "Влияние не равно: ежедневные приоритеты задаёт руководитель отдела, а PM лишь просит."],
      ["Projectized — the program manager has full authority", "In the projectized form the program manager has complete line authority, the opposite of this case.", "В проектной форме у руководителя программы полные линейные полномочия — противоположность этому кейсу."],
    ], "Slide: if the line manager has more influence than does the project manager, the organization functions as a weak matrix as seen by the project manager.", "Слайд: если у линейного менеджера больше влияния, чем у проектного, организация работает как слабая матрица с точки зрения проектного менеджера."),
    qx("Which structure gives the customer a focal point and very rapid reaction time, but is the most expensive to maintain?", "Pure product (projectized) form", [
      ["Traditional (functional) form", "The classical form has no customer focal point and slow response, but easier budgeting and cost control.", "У классической формы нет точки контакта с заказчиком и медленная реакция, зато проще бюджетирование и контроль затрат."],
      ["Weak matrix organization", "A weak matrix shares people (cost-effective) and gives the PM little influence over daily work.", "Слабая матрица делит людей (экономично) и даёт PM мало влияния на ежедневную работу."],
      ["Line/staff (coordinator) form", "In the line/staff form the PM only coordinates from a staff position; it is not described as very fast or very costly.", "В линейно-штабной форме PM лишь координирует со штабной должности; её не описывают как очень быструю или очень дорогую."],
    ], "Table 1 lists a customer focal point and very rapid reaction time for the product form; its major disadvantage is the cost of maintaining the organization (duplication of effort, facilities and personnel).", "Table 1 называет точку контакта с заказчиком и очень быструю реакцию у продуктовой формы; её главный недостаток — стоимость содержания (дублирование усилий, помещений и персонала)."),
    qx("The lecture says the matrix form is ideally suited for companies that are…", "project-driven, such as construction", [
      ["mass-producing to set specifications", "Mass production within established specifications is an advantage of the classical organization.", "Массовое производство по установленным спецификациям — преимущество классической организации."],
      ["small, with one long-running project", "One long project with a continuous flow of work suits the projectized form; small firms with few projects are one matrix variety, not the general fit.", "Один долгий проект с непрерывным потоком работы подходит проектной форме; небольшие фирмы с немногими проектами — лишь один вариант матрицы."],
      ["functional, stable and repetitive", "Stable, repetitive work fits the traditional structure, where time and schedule may be sacrificed.", "Стабильная повторяющаяся работа подходит традиционной структуре, где можно пожертвовать сроками и графиком."],
    ], "Slide: this form is ideally suited for companies, such as construction, that are \"project-driven\".", "Слайд: эта форма идеально подходит компаниям, «живущим проектами» (project-driven), например строительным."),
    tfx("In the matrix form, the functional departments have total responsibility and accountability for project success.", false,
      "The slide gives total responsibility and accountability for project success to the project manager; the functional departments have functional responsibility to maintain technical excellence.",
      "Слайд отдаёт полную ответственность и подотчётность за успех проекта проектному менеджеру; у функциональных отделов — функциональная ответственность за техническое совершенство.",
      "\"True\" swaps the two roles of the matrix: the PM owns project success, the departments own technical excellence.",
      "«Верно» меняет местами две роли матрицы: успех проекта — у PM, техническое совершенство — у отделов."),
    tfx("In the \"philosophy of management\" figure, the need for technical skills decreases and the need for human skills increases as one moves from junior clerk to president.", true,
      "Fig. 8: the technical skills curve falls from high at junior clerk to low at president, the human skills curve rises from low to high; they cross around the middle manager.",
      "Fig. 8: кривая технических навыков падает от высокого уровня у младшего клерка до низкого у президента, кривая навыков работы с людьми растёт; они пересекаются около менеджера среднего звена.",
      "\"False\" would reverse the curves: technical skills matter most at the bottom of the ladder, human skills at the top.",
      "«Неверно» перевернуло бы кривые: технические навыки важнее всего внизу лестницы, навыки работы с людьми — наверху."),
  ],
);

export const lecture5: Lecture = {
  id: "pm-l5",
  title: { en: "Lecture 5 — Organizational Structures", ru: "Лекция 5 — Организационные структуры" },
  parts: [p1, p2, p3],
};
