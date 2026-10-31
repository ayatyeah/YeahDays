import type { Term, Text } from "../types";

/*
 * Глоссарий и шпаргалка ивента «Project Management — MCQ Test 2» (лекции 4–8:
 * так в описании теста; конспекты лекций 9–10 лежат в ивенте отдельным
 * блоком «вне теста», и их термины и строки шпаргалки отсюда убраны).
 * Формулировки — как в конспектах l4–l8.ts и на слайдах. Где слайды расходятся
 * с общепринятым, держимся решений конспектов: Scrum — по Scrum Guide 2020
 * (лекция 7), EAC = BAC / CPI, INVEST — «Sized Appropriately», в таблице
 * 7 потерь lean на слайде шесть строк (нет Waiting).
 */

const t = (term: string, en: string, ru: string): Term => ({ term, def: { en, ru } });

/** Глоссарий курса — он же колода карточек «термин → определение». */
export const glossary: Term[] = [
  // Лекция 4: контроль затрат и освоенный объём (Kerzner)
  t("MCCS", "Management cost and control system. Cost control is a subsystem of the MCCS rather than a complete system per se; the planning cycle (phase I) plus the four-phase operating cycle (II work authorization and release, III cost data collection and reporting, IV cost analysis, V reporting) form a closed system network.", "Система управления и контроля затрат (management cost and control system). Контроль затрат — подсистема MCCS, а не самостоятельная система; цикл планирования (фаза I) и операционный цикл из четырёх фаз (II — разрешение и запуск работ, III — сбор данных о затратах и отчётность, IV — анализ затрат, V — отчётность) образуют замкнутую сеть (closed system network)."),
  t("Undistributed budget", "Budget associated with contract changes where time constraints prevent the necessary planning to incorporate the change into the performance budget. Not the same as unallocated budget — a logical grouping of contract tasks not yet identified and/or authorized.", "Нераспределённый бюджет: бюджет по изменениям контракта, которые из-за нехватки времени ещё не успели спланировать в рабочий бюджет (performance budget). Не путать с невыделенным бюджетом (unallocated budget) — логической группой задач контракта, ещё не определённых и/или не разрешённых."),
  t("BCWS", "Budgeted cost for work scheduled (planned value): the budgeted cost of the work scheduled to be accomplished in a given time period. Answers “How much work should be done?”", "Плановая стоимость запланированных работ (budgeted cost for work scheduled, planned value): бюджетная стоимость работ, которые по плану должны быть выполнены за период. Отвечает на вопрос «сколько работы должно быть сделано?»."),
  t("BCWP", "Budgeted cost for work performed, sometimes referred to as earned value: the budgeted cost of the work actually completed in a given time period. BCWP = (% complete) x BAC.", "Плановая стоимость выполненных работ (budgeted cost for work performed), её называют освоенным объёмом (earned value): бюджетная стоимость фактически выполненной за период работы. BCWP = (% выполнения) x BAC."),
  t("ACWP", "Actual cost for work performed: the amount reported as actually expended in completing the work accomplished within a given time period.", "Фактическая стоимость выполненных работ (actual cost for work performed): сумма, реально потраченная на работу, выполненную за период."),
  t("Cost variance (CV)", "CV = BCWP - ACWP. A negative CV indicates a cost-overrun condition. Expressed in dollars or hours; to correct it, emphasis is placed on productivity (burn rate).", "Отклонение по стоимости: CV = BCWP - ACWP. Отрицательное CV означает перерасход (cost overrun). Измеряется в долларах или часах; исправляют, повышая производительность (burn rate)."),
  t("Schedule variance (SV)", "SV = BCWP - BCWS. A negative SV indicates a behind-schedule condition. It is expressed in cost units (dollars or hours), not in days.", "Отклонение по срокам: SV = BCWP - BCWS. Отрицательное SV означает отставание от графика (behind schedule). Измеряется в единицах стоимости (доллары или часы), а не в днях."),
  t("Cost performance index (CPI)", "CPI = BCWP / ACWP, a ratio compared with 1.0. CPI < 1: physical progress costs more than forecasted (unfavorable); CPI = 1: perfect; CPI > 1: favorable.", "Индекс выполнения стоимости: CPI = BCWP / ACWP — отношение, сравниваемое с 1.0. CPI < 1 — работа обходится дороже плана (неблагоприятно); CPI = 1 — идеально; CPI > 1 — благоприятно."),
  t("Schedule performance index (SPI)", "SPI = BCWP / BCWS. SPI < 1: physical progress at a slower rate than planned; SPI > 1: faster. New project length = original length / SPI.", "Индекс выполнения сроков: SPI = BCWP / BCWS. SPI < 1 — работа идёт медленнее плана; SPI > 1 — быстрее. Новая длительность проекта = исходная длительность / SPI."),
  t("Estimate at completion (EAC)", "What we now expect the total job to cost: EAC = (ACWP / BCWP) x BAC = BAC / CPI. The slide calls it the “estimated cost-to-complete ratio”, but it is the total expected cost, not the money still needed.", "Оценка по завершении: сколько, по нынешним ожиданиям, будет стоить вся работа: EAC = (ACWP / BCWP) x BAC = BAC / CPI. На слайде — «estimated cost-to-complete ratio», но это полная ожидаемая стоимость, а не остаток денег до конца."),
  t("Variance at completion (VAC)", "VAC = BAC - EAC, where BAC (budget at completion) is what the total job was supposed to cost. A negative VAC means the project is expected to finish over budget.", "Отклонение по завершении: VAC = BAC - EAC, где BAC (budget at completion) — сколько вся работа должна была стоить. Отрицательное VAC — проект, по прогнозу, закончится с перерасходом."),
  // Лекция 4: группы, команды, роли (Gibson)
  t("Formal and informal groups", "Formal groups are created by managerial decision to accomplish the organization's goals: command and task groups. Informal groups arise from individual efforts: interest and friendship groups.", "Формальные группы создаются решением руководства ради целей организации: командные (command) и целевые (task) группы. Неформальные возникают по инициативе самих людей: группы по интересам (interest) и дружеские (friendship)."),
  t("Five-stage model", "Group development in five stages: forming (breaking the ice, loose ground rules), storming (conflict, the hierarchy starts to take shape), norming (the beginning of cohesiveness), performing (the group is mature), adjourning (prepares to disband, sadness).", "Пятиэтапная модель развития группы: формирование (forming — знакомство, нестрогие правила), шторм (storming — конфликт, складывается иерархия), нормирование (norming — начало сплочённости), работа (performing — зрелая группа), расформирование (adjourning — подготовка к роспуску, грусть)."),
  t("Punctuated equilibrium model (PEM)", "Group development in three phases: define tasks and goals; a point of inertia or equilibrium when the group realizes that time is running out and changes its perspective; a final phase to accomplish tasks.", "Модель прерывистого равновесия: развитие группы в три фазы — определение задач и целей; точка инерции или равновесия (inertia or equilibrium), когда группа понимает, что время уходит, и меняет подход; финальная фаза выполнения задач."),
  t("Groupthink", "The desire among cohesive group members to be in agreement, which supersedes considering solutions that are controversial or where unanimous agreement is not possible — a risk of high cohesiveness.", "Групповое мышление: стремление членов сплочённой группы к согласию, которое вытесняет рассмотрение спорных решений или тех, где единогласие невозможно, — риск высокой сплочённости (cohesiveness)."),
  t("Role conflict", "Person–role: the role's requirements clash with the person's own values; intrarole: contradictory expectations inside one role set; interrole: two or more roles held by the same person collide.", "Ролевой конфликт: person–role — требования роли против собственных ценностей человека; intrarole — противоречивые ожидания внутри одной роли; interrole — сталкиваются две или больше ролей одного человека."),
  // Лекция 5: организационные структуры (Kerzner)
  t("Authority", "The power granted to individuals (possibly by their position) so that they can make final decisions.", "Полномочия: власть, данная человеку (возможно, его должностью), чтобы он мог принимать окончательные решения (final decisions)."),
  t("Responsibility", "The obligation incurred by individuals in their roles in the formal organization to effectively perform assignments.", "Ответственность: обязанность (obligation), которую человек несёт в своей роли в формальной организации, — эффективно выполнять поручения."),
  t("Accountability", "Being answerable for the satisfactory completion of a specific assignment. Accountability = authority + responsibility.", "Подотчётность: обязанность отвечать (answerable) за удовлетворительное выполнение конкретного поручения. Accountability = authority + responsibility."),
  t("Traditional (classical) organization", "A functional structure: each employee has one and only one person to report to; easier budgeting and cost control, strong technical control — but no customer focal point, slow response, and no one individual is responsible for the total project.", "Традиционная (классическая, функциональная) организация: у каждого работника один-единственный начальник; проще бюджет и контроль затрат, сильный технический контроль — но нет единой точки контакта с заказчиком (customer focal point), медленная реакция, и никто не отвечает за проект целиком."),
  t("Integrating mechanisms", "Galbraith's four ways to coordinate work without changing the structure: rules and procedures, planning processes, hierarchical referral, direct contact.", "Интегрирующие механизмы (Galbraith) — четыре способа координации без изменения структуры: правила и процедуры, процессы планирования, передача вопроса по иерархии (hierarchical referral), прямой контакт."),
  t("Task force", "Each functional unit places a representative on the task force to jointly solve problems. A giant step toward conflict resolution, but without formal project authority members stayed loyal to their functional organizations, and the project always suffered.", "Целевая группа (task force): каждое функциональное подразделение делегирует представителя, и проблемы решают вместе. Большой шаг к разрешению конфликтов, но без формальных полномочий члены оставались верны своим подразделениям, и страдал всегда проект."),
  t("Liaison department", "The expeditor: a department handling transactions between functional units within an engineering division; its authority comes through the division head and extends only to the outer boundaries of the division.", "Отдел связи (liaison department, the expeditor): отдел, ведущий взаимодействие между функциональными подразделениями внутри инженерного дивизиона; полномочия — через руководителя дивизиона и только до его границ."),
  t("Line/staff organization", "The project coordinator: the project manager reports to the division manager in a staff position and is not controlled by functional managers, but still has no line authority over the workers.", "Линейно-штабная организация (project coordinator): проектный менеджер на штабной должности подчиняется руководителю дивизиона, а не функциональным менеджерам, но линейных полномочий над работниками у него всё ещё нет."),
  t("Pure product (projectized) organization", "A division within a division: the program manager has complete line authority (assigns work and conducts merit reviews); a customer focal point and very rapid reaction — but high cost, no perpetuation of technology and no career continuity.", "Чисто продуктовая (проектная, projectized) организация: «подразделение внутри подразделения»; у руководителя программы полная линейная власть (complete line authority) — он даёт работу и оценивает людей; единая точка контакта с заказчиком и очень быстрая реакция — но высокая стоимость, технологии не развиваются, нет карьерной преемственности."),
  t("Matrix organization", "Combines the advantages of the functional and product forms; the PM's authority comes directly from the general manager, the PM has total responsibility and accountability for project success, functional departments keep technical excellence. The most complex form.", "Матричная организация: сочетает преимущества функциональной и продуктовой форм; полномочия PM — напрямую от генерального директора, PM несёт полную ответственность и подотчётность за успех проекта, функциональные отделы держат технический уровень. Самая сложная форма."),
  t("Strong, weak and balanced matrix", "Strength depends on who has more influence over the daily performance of the workers, seen through the eyes of the project manager: the PM — strong matrix; the line manager — weak matrix; roughly equal — balanced.", "Сильная, слабая и сбалансированная матрица: зависит от того, у кого больше влияния на ежедневную работу людей, глазами проектного менеджера: у PM — сильная (strong); у линейного руководителя — слабая (weak); примерно поровну — сбалансированная (balanced)."),
  // Лекция 6: принципы и мышление Agile (Griffiths)
  t("Knowledge worker", "A person with subject matter expertise who communicates their knowledge and takes part in analysis and/or development efforts — engineers, teachers, scientists, doctors. Agile is ideal for knowledge worker projects.", "Работник знаний (knowledge worker): эксперт в предметной области, который передаёт свои знания и участвует в анализе и/или разработке, — инженеры, учителя, учёные, врачи. Agile идеален для проектов работников знаний."),
  t("Empirical process", "An iterative and incremental process for new or uncertain work, as opposed to a defined process whose steps are known in advance (for example, construction).", "Эмпирический процесс: итеративный и инкрементный, для новой или неопределённой работы — в отличие от определённого процесса (defined process), где шаги известны заранее (например, строительство)."),
  t("Declaration of Interdependence", "The source of six agile mindset characteristics: increase ROI, deliver reliable results, expect uncertainty, unleash creativity and innovation, boost performance, improve effectiveness and reliability.", "Декларация взаимозависимости — источник шести черт agile-мышления: рост ROI, надёжные результаты, ожидание неопределённости, творчество и инновации, рост производительности, эффективность и надёжность."),
  t("Agile Manifesto", "Four values: individuals and interactions over processes and tools; working software over comprehensive documentation; customer collaboration over contract negotiation; responding to change over following a plan — plus 12 principles. The items on the right still have value.", "Манифест Agile: четыре ценности — люди и взаимодействие важнее процессов и инструментов; работающий софт важнее исчерпывающей документации; сотрудничество с заказчиком важнее согласования контракта; реагирование на изменения важнее следования плану — и 12 принципов. Правая часть тоже ценна."),
  t("Agile triangle", "The inverted triangle model: the traditional triangle fixes scope and estimates cost and time; the agile triangle fixes cost and time and lets scope vary by priority.", "Agile-треугольник (перевёрнутый треугольник, inverted triangle): традиционный треугольник фиксирует объём (scope) и оценивает стоимость и сроки; agile фиксирует стоимость и сроки, а объём меняется по приоритету."),
  t("Extreme Programming (XP)", "An agile method with five values — simplicity, communication, feedback, courage, respect — four roles (coach, customer, programmers, testers) and practices such as pair programming, TDD, continuous integration and small releases.", "Экстремальное программирование (XP): пять ценностей — простота, общение, обратная связь, смелость, уважение; четыре роли (coach, customer, programmers, testers); практики — парное программирование, TDD, непрерывная интеграция, малые релизы и другие."),
  t("Collective code ownership", "XP practice: any pair of programmers can change any code. The opposite of FDD's individual class (code) ownership.", "Коллективное владение кодом (XP): любая пара может изменить любой код. Противоположность индивидуальному владению классами (individual class ownership) в FDD."),
  t("Lean software development", "Derived from lean manufacturing; closely aligned with agile, but not an agile methodology. Seven concepts: eliminate waste, empower the team, deliver fast, optimize the whole, build quality in, defer decisions, amplify learning.", "Бережливая разработка (lean): пришла из бережливого производства; близка к agile, но не agile-методология. Семь концепций: устранять потери, наделять команду полномочиями, поставлять быстро, оптимизировать целое, встраивать качество, откладывать решения, усиливать обучение."),
  t("7 Wastes of Lean", "Partially done work, extra processes, extra features (gold-plating), task switching, waiting, motion, defects. The slide's table shows only six rows — waiting is missing.", "Семь потерь lean: незавершённая работа, лишние процессы, лишние функции (gold-plating), переключение между задачами, ожидание (waiting), перемещения (motion), дефекты. В таблице на слайде шесть строк — нет ожидания."),
  t("Kanban", "A lean-derived approach from Toyota (“signboard”). Five principles: visualize the workflow, limit WIP, manage flow, make process policies explicit, improve collaboratively.", "Канбан: подход из lean, родом из Toyota («вывеска», signboard). Пять принципов: визуализировать поток, ограничивать WIP, управлять потоком, делать правила процесса явными, улучшать совместно."),
  t("Feature-Driven Development (FDD)", "Develop an overall model, build a feature list, plan by feature, design by feature, build by feature; practices include domain object modeling, individual class ownership, feature teams, inspections, regular builds.", "Разработка, управляемая функциями (FDD): общая модель → список функций → план по функциям → проектирование по функциям → разработка по функциям; практики — моделирование объектов предметной области, индивидуальное владение классами, команды функций, инспекции, регулярные сборки."),
  t("DSDM", "Dynamic Systems Development Method — eight principles: focus on the business need, deliver on time, collaborate, never compromise quality, build incrementally from firm foundations, develop iteratively, communicate continuously and clearly, demonstrate control.", "Метод разработки динамических систем (DSDM) — восемь принципов: фокус на потребности бизнеса, поставка вовремя, сотрудничество, никаких компромиссов по качеству, инкрементная разработка на прочном фундаменте, итеративность, постоянное и ясное общение, демонстрация контроля."),
  t("Crystal", "A family of methods chosen by criticality and team size: Clear 1–6 people, Yellow 7–20, Orange 21–40, Red 41–100, Magenta 101–200.", "Crystal: семейство методов, выбираемых по критичности (criticality) и размеру команды: Clear — 1–6 человек, Yellow — 7–20, Orange — 21–40, Red — 41–100, Magenta — 101–200."),
  t("Servant leadership", "Agile leadership that serves the team. Four primary duties: shield the team from interruptions, remove impediments, communicate (and re-communicate) the vision, carry food and water.", "Лидерство-служение (servant leadership): лидер служит команде. Четыре главные обязанности: защищать от помех, устранять препятствия, доносить (и повторять) видение, обеспечивать «едой и водой» (нужными ресурсами)."),
  // Лекция 7: Scrum Guide 2020
  t("Scrum", "A lightweight framework that helps people, teams and organizations generate value through adaptive solutions for complex problems. Founded on empiricism and lean thinking; purposefully incomplete.", "Scrum: легковесный фреймворк, который помогает людям, командам и организациям создавать ценность через адаптивные решения сложных проблем. Основан на эмпиризме и бережливом мышлении (lean thinking); намеренно неполон."),
  t("Three pillars of empiricism", "Transparency, inspection, adaptation: transparency enables inspection, inspection enables adaptation. Empiricism — knowledge comes from experience and decisions are based on what is observed.", "Три столпа эмпиризма: прозрачность (transparency), инспекция (inspection), адаптация (adaptation); прозрачность делает возможной инспекцию, инспекция — адаптацию. Эмпиризм — знание из опыта, решения по наблюдаемому."),
  t("Scrum values", "Commitment, Focus, Openness, Respect, Courage. When the team lives them, the pillars come to life and build trust. Openness is a value; transparency is a pillar.", "Ценности Scrum: приверженность (commitment), фокус (focus), открытость (openness), уважение (respect), смелость (courage). Когда команда их воплощает, столпы оживают и рождается доверие. Openness — ценность, transparency — столп."),
  t("Scrum Team", "One Scrum Master, one Product Owner and Developers; no sub-teams or hierarchies; typically 10 or fewer people; cross-functional and self-managing; focused on one objective at a time, the Product Goal.", "Scrum-команда: один Scrum Master, один Product Owner и разработчики (Developers); без подкоманд и иерархий; обычно 10 человек или меньше; кросс-функциональная и самоуправляемая (self-managing); одна цель за раз — цель продукта (Product Goal)."),
  t("Developers", "People in the Scrum Team committed to creating any aspect of a usable Increment each Sprint; accountable for the Sprint Backlog, quality by adhering to the Definition of Done, adapting the plan each day toward the Sprint Goal, and holding each other accountable.", "Разработчики (Developers): участники Scrum-команды, которые каждый спринт создают любую часть пригодного инкремента; отвечают за Sprint Backlog, качество через соблюдение Definition of Done, ежедневную адаптацию плана к цели спринта и взаимную профессиональную ответственность."),
  t("Product Owner", "Accountable for maximizing the value of the product and for effective Product Backlog management (Product Goal, creating and ordering items, transparency). One person, not a committee; to change the backlog, convince the Product Owner.", "Владелец продукта (Product Owner): отвечает за максимизацию ценности продукта и управление Product Backlog (цель продукта, создание и упорядочивание элементов, прозрачность). Один человек, а не комитет; чтобы изменить бэклог, нужно убедить его."),
  t("Scrum Master", "Accountable for establishing Scrum and for the Scrum Team's effectiveness; a true leader who serves the Scrum Team, the Product Owner and the organization; causes the removal of impediments.", "Scrum Master: отвечает за внедрение Scrum и эффективность Scrum-команды; настоящий лидер, который служит (true leader who serves) команде, Product Owner и организации; добивается устранения препятствий."),
  t("Sprint", "The container for all other events: fixed length of one month or less; the next Sprint starts immediately after the previous one. Only the Product Owner may cancel it, if the Sprint Goal becomes obsolete.", "Спринт (Sprint): контейнер для всех событий; фиксированная длина — месяц или меньше; следующий начинается сразу после предыдущего. Отменить может только Product Owner — если цель спринта устарела."),
  t("Sprint Planning", "Starts the Sprint; timeboxed to a maximum of 8 hours for a one-month Sprint. Topics: why is this Sprint valuable (Sprint Goal), what can be Done, how will the work get done (the Developers' decision).", "Планирование спринта (Sprint Planning): открывает спринт; не более 8 часов для месячного спринта. Темы: зачем этот спринт ценен (цель спринта), что можно сделать (Done), как будет сделана работа (решают разработчики)."),
  t("Daily Scrum", "A 15-minute event for the Developers, held at the same time and place every working day, to inspect progress toward the Sprint Goal and adapt the Sprint Backlog. Any structure is allowed.", "Ежедневный Scrum (Daily Scrum): 15-минутное событие для разработчиков, в одно время и в одном месте каждый рабочий день, — проверить движение к цели спринта и скорректировать Sprint Backlog. Структура любая."),
  t("Sprint Review", "Inspects the outcome of the Sprint and determines future adaptations; a working session with stakeholders, not a presentation; the second-to-last event, at most 4 hours for a one-month Sprint.", "Обзор спринта (Sprint Review): проверка результата спринта и решение о дальнейших изменениях; рабочая сессия со стейкхолдерами, а не презентация; предпоследнее событие, не более 4 часов для месячного спринта."),
  t("Sprint Retrospective", "Plans ways to increase quality and effectiveness: individuals, interactions, processes, tools and the Definition of Done. It concludes the Sprint; at most 3 hours for a one-month Sprint.", "Ретроспектива спринта (Sprint Retrospective): поиск способов повысить качество и эффективность — люди, взаимодействие, процессы, инструменты, Definition of Done. Завершает спринт; не более 3 часов для месячного спринта."),
  t("Product Backlog", "An emergent, ordered list of what is needed to improve the product; the single source of work undertaken by the Scrum Team. Refinement is an ongoing activity; the Developers size the items. Commitment: the Product Goal.", "Бэклог продукта (Product Backlog): возникающий (emergent), упорядоченный список того, что нужно для улучшения продукта; единственный источник работы Scrum-команды. Уточнение (refinement) — постоянная деятельность; размер оценивают разработчики. Обязательство — цель продукта."),
  t("Sprint Backlog", "The Sprint Goal (why), the selected Product Backlog items (what) and an actionable plan (how); a plan by and for the Developers, updated throughout the Sprint. Commitment: the Sprint Goal.", "Бэклог спринта (Sprint Backlog): цель спринта (зачем), выбранные элементы бэклога продукта (что) и план действий (как); план разработчиков и для разработчиков, обновляется весь спринт. Обязательство — цель спринта."),
  t("Increment", "A concrete stepping stone toward the Product Goal; additive to all prior Increments, thoroughly verified and usable. Several may be created in a Sprint and delivered before its end. Commitment: the Definition of Done.", "Инкремент (Increment): конкретная ступень к цели продукта; добавляется ко всем прошлым, тщательно проверен и пригоден к использованию. За спринт их может быть несколько, поставить можно и до конца спринта. Обязательство — Definition of Done."),
  t("Product Goal", "The future state of the product — the long-term objective for the Scrum Team; it lives in the Product Backlog. The team must fulfill or abandon one objective before taking on the next.", "Цель продукта (Product Goal): будущее состояние продукта, долгосрочная цель Scrum-команды; находится в Product Backlog. Команда выполняет или отменяет одну цель, прежде чем взять следующую."),
  t("Sprint Goal", "The single objective for the Sprint, a commitment by the Developers; it gives flexibility in the exact work. If the work turns out different, the Developers negotiate the scope with the Product Owner without affecting the goal.", "Цель спринта (Sprint Goal): единственная цель спринта, обязательство разработчиков; даёт гибкость в конкретной работе. Если работа оказывается другой, объём обсуждают с Product Owner, не затрагивая цель."),
  t("Definition of Done", "A formal description of the state of the Increment when it meets the quality measures required for the product. Work that does not meet it is not released or presented — it returns to the Product Backlog.", "Критерии готовности (Definition of Done): формальное описание состояния инкремента, отвечающего требованиям качества продукта. Работа, не отвечающая им, не выпускается и не показывается — она возвращается в Product Backlog."),
  // Лекция 8: персоны и пользовательские истории (Agile Extension to the BABOK Guide)
  t("Persona", "Fictional characters or archetypes that exemplify the way typical users interact with a solution; used to understand and empathize with an intended stakeholder in order to align the solution with the stakeholder need.", "Персона (persona): вымышленный персонаж или архетип, на примере которого видно, как типичные пользователи взаимодействуют с решением; помогает понять предполагаемого стейкхолдера и сопереживать ему, чтобы решение отвечало его потребности."),
  t("Persona templates", "Short template — a one-page quick view of key information (name, details or context, traits, goals); long template — more in-depth details (demographics, buying motive, traits, needs, motivation, differentiators). Additional user research expands short to long.", "Шаблоны персоны: короткий (short template) — быстрый обзор ключевого на одной странице (имя, контекст, черты, цели); длинный (long template) — подробности (демография, мотив покупки, черты, потребности, мотивация, отличия). Дополнительное исследование пользователей превращает короткий в длинный."),
  t("User story", "A small, concise statement of a feature needed to deliver value, used to convey a customer requirement for the delivery team. Format: As a <role>, I need to <feature> so that <goal or value>.", "Пользовательская история (user story): короткое, сжатое описание функции, нужной для поставки ценности; передаёт команде требование заказчика. Формат: As a <role>, I need to <feature> so that <goal or value>."),
  t("INVEST", "Quality criteria for user stories: Independent, Negotiable, Valuable, Estimable, Sized Appropriately (completed in one iteration), Testable (validated objectively by a stakeholder).", "Критерии качества историй INVEST: Independent (независимая), Negotiable (обсуждаемая), Valuable (ценная), Estimable (оцениваемая), Sized Appropriately (подходящего размера — на одну итерацию), Testable (проверяемая объективно стейкхолдером)."),
  t("3Cs", "The elements of a user story: Card (an optional title and the WHO / WHAT / WHY format), Conversation (the story intentionally does not capture everything and invokes discussion), Confirmation (acceptance criteria).", "Три C пользовательской истории: Card (карточка — необязательный заголовок и формат WHO / WHAT / WHY), Conversation (разговор — история намеренно неполна и вызывает обсуждение), Confirmation (подтверждение — критерии приёмки)."),
  t("Acceptance criteria", "Define the boundaries of a user story and help verify and validate that the solution met the need; identify the minimum amount of function; used primarily by the product owner and stakeholders; a basis for acceptance, regression and exploratory tests.", "Критерии приёмки (acceptance criteria): задают границы истории и помогают проверить, что решение закрыло потребность; определяют минимально нужную функциональность; используются в первую очередь владельцем продукта и стейкхолдерами; основа для приёмочных, регрессионных и исследовательских тестов."),
];

/** Шпаргалка «на одну страницу» по всему MCQ Test 2 (лекции 4–8). */
export const cheatSheet: Text = {
  en: `## MCQ Test 2 on one page
- **50 multiple-choice questions, 18 points**, Lectures 4–8 — about 10 questions per lecture. Answer with the slide wording.
- Scrum: if Lecture 6 (Griffiths overview) and Lecture 7 (Scrum Guide 2020) disagree, **Lecture 7 wins**.
## L4 — Earned value (Kerzner)
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
- **BCWS** = work scheduled (PV); **BCWP** = work performed at budgeted cost, earned value (EV); **ACWP** = actual cost (AC); **BAC** = total budget; **EAC / LRE** = what we now expect the total job to cost.
- Negative CV = cost overrun; negative SV = behind schedule; negative VAC = will finish over budget. CV and SV in dollars or hours; CPI and SPI are ratios: < 1 unfavorable, = 1 perfect, > 1 favorable.
- Unfavorable CV / CPI → productivity (burn rate); unfavorable SV / SPI → timeliness of physical progress.
- Slide example: BCWS 1000, BCWP 800, ACWP 700 → CV +100, SV -200, CPI 1.14, SPI 0.80 → under budget, behind schedule.
- Cost control is a **subsystem of the MCCS**. Operating cycle = phases **II–V** (work authorization and release, cost data collection and reporting, cost analysis, reporting); with the planning cycle (I) — a closed system network.
- Budget log: distributed budget, management reserve, undistributed budget (contract changes not yet planned), contract changes. Influence on cost falls: customer/owner → PM → team → users.
## L4 — Groups, teams, roles (Gibson)
- Formal (managerial decision): command, task. Informal (individual efforts): interest, friendship. Groups form for needs (security, social, esteem, self-actualization), proximity, attractions, goals, economics.
| Stage | Key phrase |
|---|---|
| Forming | breaking the ice; loose, but specific, ground rules |
| Storming | conflict; the hierarchy starts to take shape |
| Norming | the beginning of cohesiveness |
| Performing | structure and norms in place; the group is mature |
| Adjourning | prepares to disband; sadness |
- **PEM**: three phases — define tasks and goals → point of inertia or equilibrium (**time is running out**) → final phase. The five-stage model is "too static and unrealistic".
- 7 characteristics: structure, status hierarchy, roles, norms, leadership, cohesiveness, intergroup conflict. **Groupthink** = a risk of high cohesiveness.
- Teams (a type of task group): problem-solving, cross-functional, self-directed; formed **predominantly to enhance productivity**.
- Role conflict: **person–role** (role vs own values), **intrarole** (contradictions in one role), **interrole** (two roles collide).
## L5 — Organizational structures (Kerzner)
- Authority = power to make **final decisions**; responsibility = **obligation** to perform assignments; accountability = **answerable** for completion. Accountability = authority + responsibility.
- Trust: deny → blame → admit responsibility → meet face-to-face → anticipate problems.
- Evolution: integrating mechanisms (rules and procedures, planning processes, hierarchical referral, direct contact) → project leader → task force → liaison department (expeditor) → line/staff (project coordinator) → projectized, matrix.
| | Classical | Projectized | Matrix |
|---|---|---|---|
| PM authority | none; no one owns the total project | complete line authority | from the general manager |
| Strengths | one boss, cost and technical control, career continuity | customer focal point, very rapid reaction | technical excellence within time and cost |
| Weaknesses | no customer focal point, slow response | cost, no perpetuation of technology, no career continuity | the most complex form |
- Who has more influence over the workers' daily performance, through the eyes of the PM: PM → **strong** matrix; line manager → **weak**; about equal → **balanced**.
## L6 — Agile Manifesto and mindset
- Individuals and interactions **over** processes and tools; working software over comprehensive documentation; customer collaboration over contract negotiation; responding to change over following a plan.
| # | Principle | # | Principle |
|---|---|---|---|
| 1 | early and continuous delivery | 7 | working software = primary measure of progress |
| 2 | welcome change, even late | 8 | sustainable, constant pace |
| 3 | deliver frequently, prefer shorter | 9 | technical excellence, good design |
| 4 | business and developers daily | 10 | simplicity: maximize work not done |
| 5 | motivated individuals, trust | 11 | self-organizing teams |
| 6 | face-to-face conversation | 12 | reflect and adjust |
- Mindset → values → principles → practices; **being** agile beats **doing** agile. Agile triangle: fix **cost and time**, let **scope** vary.
## L6 — Agile methods
- XP values: simplicity, communication, feedback, courage, respect. Roles: coach, customer, programmers, testers. Practices: whole team, planning games, small releases, customer tests, collective code ownership, code standards, sustainable pace, metaphor, CI, TDD, refactoring, simple design, pair programming.
- Lean (aligned with agile, **not** an agile methodology): eliminate waste, empower the team, deliver fast, optimize the whole, build quality in, defer decisions, amplify learning.
- Wastes: partially done work, extra processes, extra features, task switching, waiting, motion, defects (the slide table has six rows, no waiting).
- Kanban: visualize the workflow, limit WIP, manage flow, make process policies explicit, improve collaboratively.
- FDD: individual class ownership, feature teams. DSDM: never compromise quality. Crystal: criticality + team size (Clear 1–6 … Magenta 101–200).
- Servant leader: shield from interruptions, remove impediments, communicate the vision, carry food and water.
## L7 — Scrum Guide 2020
- Lightweight framework; empiricism + lean thinking; pillars **transparency, inspection, adaptation**; values **commitment, focus, openness, respect, courage**.
- One Scrum Master, one Product Owner, **Developers**; typically **10 or fewer**; cross-functional, **self-managing**; three **accountabilities**.
| Event | Max (one-month Sprint) | Key fact |
|---|---|---|
| Sprint | one month or less | container; only the PO cancels (goal obsolete) |
| Sprint Planning | 8 hours | why, what, how |
| Daily Scrum | 15 minutes | for the Developers; any structure |
| Sprint Review | 4 hours | inspect the outcome; working session |
| Sprint Retrospective | 3 hours | quality and effectiveness; concludes the Sprint |
- Product Backlog → **Product Goal**; Sprint Backlog → **Sprint Goal**; Increment → **Definition of Done**. Refinement is ongoing, not an event. Not Done → back to the Product Backlog.
## L8 — Personas and user stories (BABOK Agile Extension)
- Persona elements: long and short template, name and image, traits and characteristics, motivations, needs, differentiators.
- **INVEST**: Independent, Negotiable, Valuable, Estimable, **Sized Appropriately**, Testable. **3Cs**: Card, Conversation, Confirmation.
= As a <role>, I need to <feature> so that <goal or value>.`,
  ru: `## MCQ Test 2 на одной странице
- **50 вопросов с выбором ответа, 18 баллов**, лекции 4–8 — примерно по 10 вопросов на лекцию. Отвечать формулировками слайдов.
- Scrum: если лекция 6 (обзор по Griffiths) и лекция 7 (Scrum Guide 2020) расходятся, **права лекция 7**.
## Л4 — Освоенный объём (Kerzner)
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
- **BCWS** — запланированная работа (PV); **BCWP** — выполненная работа по плановой цене, освоенный объём (EV); **ACWP** — фактические затраты (AC); **BAC** — весь бюджет; **EAC / LRE** — сколько, по нынешним ожиданиям, будет стоить вся работа.
- Отрицательное CV — перерасход; отрицательное SV — отставание; отрицательное VAC — проект закончится с перерасходом. CV и SV — в долларах или часах; CPI и SPI — отношения: < 1 плохо, = 1 идеально, > 1 хорошо.
- Плохие CV / CPI → производительность (burn rate); плохие SV / SPI → своевременность физического прогресса.
- Пример слайда: BCWS 1000, BCWP 800, ACWP 700 → CV +100, SV -200, CPI 1.14, SPI 0.80 → в рамках бюджета, но с отставанием.
- Контроль затрат — **подсистема MCCS**. Операционный цикл — фазы **II–V** (разрешение и запуск работ, сбор данных о затратах и отчётность, анализ затрат, отчётность); с циклом планирования (I) — замкнутая сеть.
- Журнал бюджета: distributed budget, management reserve, undistributed budget (изменения контракта, ещё не спланированные), contract changes. Влияние на стоимость падает: заказчик/владелец → PM → команда → пользователи.
## Л4 — Группы, команды, роли (Gibson)
- Формальные (решение руководства): command, task. Неформальные (инициатива людей): interest, friendship. Группы возникают из-за потребностей (security, social, esteem, self-actualization), близости, симпатий, целей, экономики.
| Стадия | Ключевая фраза |
|---|---|
| Forming | знакомство («breaking the ice»); нестрогие, но конкретные правила |
| Storming | конфликт; начинает складываться иерархия |
| Norming | начало сплочённости (cohesiveness) |
| Performing | структура и нормы на месте; группа зрелая |
| Adjourning | подготовка к роспуску; грусть |
- **PEM**: три фазы — задачи и цели → точка инерции или равновесия (**время уходит**) → финальная фаза. Пятиэтапную модель критикуют как «too static and unrealistic».
- 7 характеристик: структура, статусная иерархия, роли, нормы, лидерство, сплочённость, межгрупповой конфликт. **Groupthink** — риск высокой сплочённости.
- Команды (вид целевой группы): problem-solving, cross-functional, self-directed; создаются **прежде всего ради производительности**.
- Ролевой конфликт: **person–role** (роль против своих ценностей), **intrarole** (противоречия внутри одной роли), **interrole** (сталкиваются две роли).
## Л5 — Организационные структуры (Kerzner)
- Authority — право на **окончательные решения**; responsibility — **обязанность** выполнять поручения; accountability — **отвечать** за выполнение. Accountability = authority + responsibility.
- Доверие: отрицание → обвинение → признание ответственности → встреча лицом к лицу → предвидение проблем.
- Эволюция: интегрирующие механизмы (правила и процедуры, планирование, передача по иерархии, прямой контакт) → project leader → task force → liaison department (expeditor) → line/staff (project coordinator) → projectized, matrix.
| | Классическая | Проектная | Матричная |
|---|---|---|---|
| Полномочия PM | нет; за проект целиком не отвечает никто | полная линейная власть | от генерального директора |
| Сильные стороны | один начальник, контроль затрат и техники, карьерная преемственность | точка контакта с заказчиком, очень быстрая реакция | технический уровень в рамках сроков и бюджета |
| Слабые стороны | нет точки контакта с заказчиком, медленная реакция | дорого, технологии не развиваются, нет карьерной преемственности | самая сложная форма |
- У кого больше влияния на ежедневную работу людей, глазами PM: у PM → **сильная** матрица; у линейного руководителя → **слабая**; поровну → **сбалансированная**.
## Л6 — Манифест Agile и мышление
- Люди и взаимодействие **важнее** процессов и инструментов; работающий софт важнее исчерпывающей документации; сотрудничество с заказчиком важнее согласования контракта; реагирование на изменения важнее следования плану.
| # | Принцип | # | Принцип |
|---|---|---|---|
| 1 | ранняя и непрерывная поставка | 7 | работающий софт — главная мера прогресса |
| 2 | изменения приветствуются, даже поздние | 8 | устойчивый, постоянный темп |
| 3 | частая поставка, чем короче, тем лучше | 9 | техническое совершенство, хороший дизайн |
| 4 | бизнес и разработчики — ежедневно вместе | 10 | простота: максимум несделанной работы |
| 5 | мотивированные люди, доверие | 11 | самоорганизующиеся команды |
| 6 | разговор лицом к лицу | 12 | рефлексия и корректировка |
- Мышление → ценности → принципы → практики; **быть** agile лучше, чем **делать** agile. Agile-треугольник: фиксируем **стоимость и сроки**, **объём** меняется.
## Л6 — Agile-методы
- Ценности XP: простота, общение, обратная связь, смелость, уважение. Роли: coach, customer, programmers, testers. Практики: whole team, planning games, small releases, customer tests, collective code ownership, code standards, sustainable pace, metaphor, CI, TDD, refactoring, simple design, pair programming.
- Lean (близок к agile, но **не** agile-методология): устранять потери, наделять команду полномочиями, поставлять быстро, оптимизировать целое, встраивать качество, откладывать решения, усиливать обучение.
- Потери: незавершённая работа, лишние процессы, лишние функции, переключение задач, ожидание, перемещения, дефекты (в таблице слайда шесть строк, без ожидания).
- Канбан: визуализировать поток, ограничивать WIP, управлять потоком, делать правила явными, улучшать совместно.
- FDD: индивидуальное владение классами, команды функций. DSDM: никаких компромиссов по качеству. Crystal: критичность + размер команды (Clear 1–6 … Magenta 101–200).
- Servant leader: защищать от помех, устранять препятствия, доносить видение, «носить еду и воду».
## Л7 — Scrum Guide 2020
- Легковесный фреймворк; эмпиризм + lean-мышление; столпы **transparency, inspection, adaptation**; ценности **commitment, focus, openness, respect, courage**.
- Один Scrum Master, один Product Owner, **Developers**; обычно **10 или меньше**; кросс-функциональная, **self-managing**; три **accountabilities**.
| Событие | Максимум (месячный спринт) | Главное |
|---|---|---|
| Sprint | месяц или меньше | контейнер; отменяет только PO (цель устарела) |
| Sprint Planning | 8 часов | зачем, что, как |
| Daily Scrum | 15 минут | для разработчиков; структура любая |
| Sprint Review | 4 часа | проверка результата; рабочая сессия |
| Sprint Retrospective | 3 часа | качество и эффективность; завершает спринт |
- Product Backlog → **Product Goal**; Sprint Backlog → **Sprint Goal**; Increment → **Definition of Done**. Refinement — постоянная деятельность, а не событие. Не Done → обратно в Product Backlog.
## Л8 — Персоны и пользовательские истории (BABOK Agile Extension)
- Элементы персоны: длинный и короткий шаблон, имя и изображение, черты и характеристики, мотивация, потребности, отличия.
- **INVEST**: Independent, Negotiable, Valuable, Estimable, **Sized Appropriately**, Testable. **3C**: Card, Conversation, Confirmation.
= As a <role>, I need to <feature> so that <goal or value>.`,
};
