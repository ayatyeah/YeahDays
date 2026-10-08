import { part, qx, tfx, type Lecture } from "../types";

/**
 * Реальные вопросы мидтерма «Week 5 / Mid-term» (Moodle, Yersultan Tulebayev):
 * 40 вопросов по AWS Academy Cloud Foundations (модули 1–10) и лабам 1–6.
 * Собраны из сообщения студентов (41 вопрос, без ответов) и 12 скриншотов
 * (25 вопросов, 7 из них — дубли). Ответы определены по фактам AWS, а не по
 * отметкам студентов на скриншотах. Вопросы по картинкам пересказаны словами.
 * Последний вопрос третьей части — тренировочный, «в стиле мидтерма».
 */
export const realMidterm: Lecture = {
  id: "cc-real",
  title: { en: "Real midterm questions", ru: "Реальные вопросы мидтерма" },
  parts: [
    part(
      "cc-real-p1",
      { en: "Cloud value, pricing, global infrastructure, pillars", ru: "Ценность облака, цены, инфраструктура, столпы" },
      {
        en: `## Why the cloud beats on-premises
The course lists **six advantages** of cloud computing — the midterm asks which one is NOT on the list.
- **Trade capital expense for variable expense** — no big upfront purchase of servers; **pay-as-you-go** for what is used.
- **Benefit from massive economies of scale** — usage from **hundreds of thousands of customers is aggregated** in the cloud, so AWS buys cheaper and lowers prices.
- **Stop guessing capacity** — scale up or down with real demand instead of buying for the peak.
- **Increase speed and agility** — new resources in minutes, not weeks.
- **Stop spending money on running and maintaining data centers** — no racking, stacking and powering servers.
- **Go global in minutes** — deploy to several Regions with a few clicks.
> Exam trap: "Pay for racking, stacking and powering servers" is the on-premises burden — it is NOT a cloud benefit.
| Phrase in the question | Correct idea |
|---|---|
| avoid large upfront hardware costs | **pay-as-you-go** (variable expense instead of capital expenditure) |
| varying compute workloads | EC2 instances are **launched on demand when needed** and stopped afterwards |
| scalability and elasticity | **grow and shrink resources dynamically based on real-time demand** |
| economies of scale come from | **customers aggregated in the cloud** |
- Elasticity is not "manual", not "permanent growth" and not "fixed size" — those are the traps.
- **Compute, storage, networking and databases** are all real AWS service categories (True).
## How AWS charges
| Cost driver | How it is billed |
|---|---|
| Compute | per **second or hour** of running time — not a flat monthly fee |
| Storage | **per gigabyte** |
| Data transfer **in** | free in most cases |
| Data transfer **out** | per gigabyte, aggregated across services |
> Exam trap: inbound transfer is the free direction; outbound is the one you pay for.
## AWS Support plans
= Basic · Developer · Business · Enterprise
- **Basic** is free for everyone (documentation, forums, core Trusted Advisor checks); Developer, Business and Enterprise are paid and add technical support with faster response times. There is no "Startup" plan and no "Bronze/Silver/Gold" tiers.
## EC2 purchasing options — scenario to answer
| Scenario | Option |
|---|---|
| New app, unknown usage, **no long-term commitment** | **On-Demand** |
| Steady, predictable, runs **at least 1 year** | **Reserved Instances** (1- or 3-year term) |
| **Stateless**, can be **interrupted**, cost is key | **Spot Instances** (up to 90% off) |
| A job that recurs on a **schedule** (monthly reports) | **Scheduled Reserved Instances** |
| Compliance, **control over the physical server** and placement | **Dedicated Hosts** |
| Discount for an hourly spend commitment, 1 or 3 years | **Savings Plans** |
- Reserved Instances and Savings Plans both need a **commitment** — wrong for "start without commitment".
- Spot capacity can be reclaimed with a two-minute warning — never for a job that must not stop.
- **Multi-tenancy** — each VM is **isolated** but **shares the resources of one host machine** with other customers' VMs. A Dedicated Host removes that sharing.
## Global infrastructure
- A **Region** is a geographic area that contains **multiple Availability Zones**.
- An **Availability Zone** is one or more **physically distinct data centers** with their own **backup generators, cooling equipment, uninterruptible power supply (UPS) and network connectivity**.
- AZs in one Region are connected by **low-latency links** (True), so data can be replicated between them.
> A picture of three separate data-center groups inside one "AWS Region" box shows **Availability Zones**. The Region is the outer box — answering "AWS regions" is the classic mistake.
- Choosing a Region — four factors: **data governance and legal requirements**, **proximity to customers (latency)**, **services available in the Region**, **costs** (prices differ by Region). "Availability of reservation options" is not a factor.
- One AZ lost power and the app went down → run in **multiple AZs within the same Region**. Multi-Region by default is overkill; a bigger instance or another pricing model does not help.
## Well-Architected pillars
| Need in the question | Pillar |
|---|---|
| Unexpected bills, cost-effective resources without hurting performance | **Cost Optimization** |
| RDS in multiple AZs, recover from failure | **Reliability** |
| Right resource types and sizes as demand changes | **Performance Efficiency** |
| Run and monitor systems, improve processes | **Operational Excellence** |
| Protect data, identities and systems | **Security** |
| Reduce environmental impact | **Sustainability** |
?? A team starts a new app tomorrow, has no idea about its traffic and refuses any commitment. Which purchasing option fits?
?= On-Demand Instances — no commitment and no upfront payment; Reserved Instances and Savings Plans need 1–3 years, Spot can be interrupted.
?? What exactly is an Availability Zone, and how are AZs linked?
?= One or more physically separate data centers with their own power (generators, UPS), cooling and networking; the AZs of a Region are connected by low-latency links.
?? Which pillar does 'RDS in multiple AZs' belong to, and which one does 'unexpected bills' belong to?
?= Multi-AZ is Reliability (surviving the failure of one AZ); unexpected bills are Cost Optimization.`,
        ru: `## Почему облако выигрывает у своей инфраструктуры
Курс называет **шесть преимуществ** облака — на мидтерме спрашивают, какого пункта в этом списке НЕТ.
- **Trade capital expense for variable expense** — никаких крупных покупок серверов заранее; **pay-as-you-go** — оплата за то, что использовано.
- **Benefit from massive economies of scale** — потребление **сотен тысяч клиентов собирается** в облаке, поэтому AWS закупает дешевле и снижает цены.
- **Stop guessing capacity** — масштабирование вверх и вниз под реальный спрос вместо покупки под пик.
- **Increase speed and agility** — новые ресурсы за минуты, а не недели.
- **Stop spending money on running and maintaining data centers** — не нужно монтировать, ставить в стойки и питать серверы.
- **Go global in minutes** — развёртывание в нескольких регионах за пару кликов.
> Ловушка экзамена: «Pay for racking, stacking and powering servers» — это бремя своей инфраструктуры, а НЕ преимущество облака.
| Фраза в вопросе | Верная мысль |
|---|---|
| avoid large upfront hardware costs | **pay-as-you-go** (переменные расходы вместо капитальных) |
| varying compute workloads | инстансы EC2 **запускаются по требованию, когда нужны**, и потом останавливаются |
| scalability and elasticity | **ресурсы растут и сжимаются динамически по спросу в реальном времени** |
| economies of scale come from | **клиенты, собранные в облаке** |
- Эластичность — это не «вручную», не «навсегда больше» и не «фиксированный размер»: это ловушки.
- **Compute, storage, networking и databases** — все четыре реальные категории сервисов AWS (True).
## Как AWS берёт деньги
| Статья расходов | Как тарифицируется |
|---|---|
| Вычисления | за **секунду или час** работы — не фиксированная плата в месяц |
| Хранилище | **за гигабайт** |
| Входящий трафик (**in**) | в большинстве случаев бесплатно |
| Исходящий трафик (**out**) | за гигабайт, суммируется по всем сервисам |
> Ловушка экзамена: бесплатное направление — входящий трафик; платят за исходящий.
## Планы поддержки AWS (Support plans)
= Basic · Developer · Business · Enterprise
- **Basic** бесплатен для всех (документация, форумы, базовые проверки Trusted Advisor); Developer, Business и Enterprise платные и добавляют техподдержку с более быстрым ответом. Плана «Startup» и уровней «Bronze/Silver/Gold» нет.
## Варианты покупки EC2 — сценарий и ответ
| Сценарий | Вариант |
|---|---|
| Новое приложение, нагрузка неизвестна, **без долгих обязательств** | **On-Demand** |
| Стабильно, предсказуемо, работает **не меньше года** | **Reserved Instances** (срок 1 или 3 года) |
| **Stateless**, можно **прерывать**, главное — цена | **Spot Instances** (скидка до 90%) |
| Задача повторяется **по расписанию** (ежемесячные отчёты) | **Scheduled Reserved Instances** |
| Compliance, **контроль над физическим сервером** и размещением | **Dedicated Hosts** |
| Скидка за обязательство тратить сумму в час, 1 или 3 года | **Savings Plans** |
- И Reserved Instances, и Savings Plans требуют **обязательства** — не подходят для «начать без обязательств».
- Мощность Spot могут забрать с предупреждением за две минуты — не для задачи, которую нельзя останавливать.
- **Multi-tenancy (мультиарендность)** — каждая VM **изолирована**, но **делит ресурсы одного хоста** с VM других клиентов. Dedicated Host убирает это соседство.
## Глобальная инфраструктура
- **Region (регион)** — географическая область, в которой **несколько Availability Zones**.
- **Availability Zone (AZ)** — один или несколько **физически раздельных дата-центров** со своими **резервными генераторами, охлаждением, ИБП (UPS) и сетевым подключением**.
- AZ одного региона связаны **каналами с низкой задержкой** (True), поэтому данные можно реплицировать между ними.
> Картинка с тремя отдельными группами дата-центров внутри рамки «AWS Region» показывает **Availability Zones**. Регион — это внешняя рамка; ответ «AWS regions» — классическая ошибка.
- Выбор региона — четыре фактора: **data governance и юридические требования**, **близость к клиентам (задержка)**, **сервисы, доступные в регионе**, **стоимость** (цены в регионах разные). «Availability of reservation options» — не фактор.
- В одной AZ пропало питание, и приложение легло → запускать в **нескольких AZ в том же регионе**. Мульти-регион по умолчанию — перебор; инстанс побольше или другая модель оплаты не помогут.
## Столпы Well-Architected
| Потребность в вопросе | Столп (pillar) |
|---|---|
| Неожиданные счета, выгодные ресурсы без потери производительности | **Cost Optimization** |
| RDS в нескольких AZ, восстановление после сбоя | **Reliability** |
| Правильные типы и размеры ресурсов при меняющемся спросе | **Performance Efficiency** |
| Эксплуатация и мониторинг систем, улучшение процессов | **Operational Excellence** |
| Защита данных, учётных записей и систем | **Security** |
| Снижение влияния на окружающую среду | **Sustainability** |
?? Команда запускает новое приложение завтра, о трафике ничего не знает и не хочет обязательств. Какой вариант покупки подходит?
?= On-Demand Instances — без обязательств и предоплаты; Reserved Instances и Savings Plans требуют 1–3 года, Spot могут прервать.
?? Что такое Availability Zone и как связаны AZ между собой?
?= Один или несколько физически раздельных дата-центров со своим питанием (генераторы, ИБП), охлаждением и сетью; AZ одного региона связаны каналами с низкой задержкой.
?? К какому столпу относится «RDS в нескольких AZ», а к какому — «неожиданные счета»?
?= Multi-AZ — это Reliability (пережить отказ одной AZ); неожиданные счета — Cost Optimization.`,
      },
      [
        tfx("True / False? Networking, storage, compute and databases are examples of service categories that AWS offers.", true,
          "AWS groups its services into categories such as compute, storage, networking and content delivery, and databases — all four named here are real categories.",
          "AWS делит сервисы на категории: compute, storage, networking and content delivery, databases и другие — все четыре названные категории существуют.",
          "False would mean one of them is not an AWS category, yet each has a flagship: EC2 (compute), S3 (storage), VPC (networking), RDS (databases).",
          "«False» означало бы, что какая-то из них не категория AWS, но у каждой есть флагман: EC2 (compute), S3 (storage), VPC (networking), RDS (databases)."),
        qx("Which of these is not a benefit of cloud computing over on-premises computing?", "Pay for racking, stacking and powering servers", [
          ["Benefit from massive economies of scale", "This is one of the six advantages: aggregated usage lets AWS charge lower prices.", "Это одно из шести преимуществ: собранное вместе потребление позволяет AWS снижать цены."],
          ["Trade capital expense for variable expense", "This is the first of the six advantages: no upfront hardware, pay only for what is used.", "Это первое из шести преимуществ: без вложений в железо, оплата только за использованное."],
          ["Eliminate guessing on your infrastructure capacity needs", "This is the 'stop guessing capacity' advantage: capacity follows real demand.", "Это преимущество «stop guessing capacity»: мощность следует за реальным спросом."],
        ], "Racking, stacking and powering servers is exactly the on-premises burden. The cloud advantage is the opposite: stop spending money on running and maintaining data centers.", "Монтаж, установка в стойки и питание серверов — как раз бремя своей инфраструктуры. Преимущество облака обратное: не тратить деньги на содержание дата-центров."),
        qx("Economies of scale result from ______. (Select the best answer.)", "having hundreds of thousands of customers aggregated in the cloud", [
          ["having many different cloud providers", "Competition between providers is not what gives AWS its scale; aggregated usage is.", "Масштаб AWS даёт не конкуренция провайдеров, а собранное вместе потребление."],
          ["having hundreds of different cloud services available over the internet", "The number of services is about choice, not about the cost advantage of scale.", "Число сервисов — это выбор, а не ценовое преимущество масштаба."],
          ["having to invest heavily in data centers and servers", "Heavy own investment is the on-premises model that the cloud lets you avoid.", "Крупные собственные вложения — модель on-premises, от которой облако избавляет."],
        ], "Because usage from hundreds of thousands of customers is aggregated in the cloud, AWS achieves higher economies of scale and passes them on as lower pay-as-you-go prices.", "Потребление сотен тысяч клиентов собирается в облаке, поэтому AWS получает большую экономию на масштабе и отдаёт её в виде более низких цен pay-as-you-go."),
        qx("Your company wants to avoid large upfront hardware costs. Which AWS principle helps?", "Pay-as-you-go pricing", [
          ["Fixed costs", "Fixed costs are what the company wants to avoid; AWS costs follow usage.", "Фиксированные расходы — как раз то, от чего хотят уйти; в AWS расходы следуют за потреблением."],
          ["On-Prem licensing", "On-premises licensing still means buying and owning the infrastructure.", "Лицензирование on-premises всё равно означает покупать инфраструктуру и владеть ею."],
          ["Capital expenditure", "Capital expenditure IS the large upfront purchase; the cloud replaces it with variable expense.", "Capital expenditure — это и есть крупная покупка заранее; облако заменяет её переменными расходами."],
        ], "Pay-as-you-go turns capital expense (buying servers upfront) into variable expense: you pay only for what you use, when you use it.", "Pay-as-you-go превращает капитальные затраты (покупку серверов заранее) в переменные: оплачивается только то, что используется, и тогда, когда используется."),
        qx("Why is AWS more economical than traditional data centers for applications with varying compute workloads?", "Amazon EC2 instances can be launched on-demand when needed", [
          ["Customers retain full administrative access to their Amazon EC2 instances", "Admin access is about control, not about cost when the workload changes.", "Админ-доступ — про контроль, а не про стоимость при меняющейся нагрузке."],
          ["Customers can permanently run enough instances to handle peak workloads", "Running capacity for the peak all the time is the expensive on-premises habit.", "Постоянно держать мощность под пик — дорогая привычка своей инфраструктуры."],
          ["Amazon EC2 costs are billed on a monthly basis", "EC2 is billed per second or hour of use; a monthly invoice by itself saves nothing.", "EC2 тарифицируется посекундно или почасово; сам по себе помесячный счёт ничего не экономит."],
        ], "With varying workloads, instances are launched when demand rises and stopped when it falls, so you pay only for the time they run instead of owning peak capacity.", "При меняющейся нагрузке инстансы запускают, когда спрос растёт, и останавливают, когда он падает, — оплачивается только время работы, а не мощность под пик."),
        qx("What is the primary benefit of scalability and elasticity in AWS?", "The ability to grow and shrink resources dynamically based on real-time demand", [
          ["The ability to manually adjust resources based on peak usage", "Elasticity is automatic and follows demand; manual sizing for the peak is the old way.", "Эластичность автоматическая и следует за спросом; ручная подгонка под пик — старый подход."],
          ["The ability to permanently increase the resource capacity for long-term growth", "Elasticity works both ways and also shrinks; a permanent increase is just buying more.", "Эластичность работает в обе стороны и умеет уменьшать; постоянное увеличение — просто докупка."],
          ["The ability to create fixed resources that never change in size", "Resources of a fixed size are the opposite of elasticity.", "Ресурсы фиксированного размера — противоположность эластичности."],
        ], "Scalability and elasticity mean capacity follows real-time demand: resources are added when load rises and released when it drops.", "Масштабируемость и эластичность означают, что мощность следует за спросом в реальном времени: ресурсы добавляются при росте нагрузки и освобождаются при спаде."),
        qx("Which statement is true about the pricing model in AWS? (Select the best answer)", "Storage is typically charged per gigabyte.", [
          ["Outbound charges are free up to a per account limit.", "Outbound data transfer is the direction AWS charges for: it is aggregated across services and billed per gigabyte at the outbound rate.", "Исходящий трафик — именно то направление, за которое AWS берёт деньги: он суммируется по сервисам и тарифицируется за гигабайт."],
          ["Compute is typically charged as a monthly fee based on instance type.", "Compute is charged per second or hour of running time, not as a flat monthly fee.", "Вычисления оплачиваются за секунды или часы работы, а не фиксированной суммой в месяц."],
          ["In most cases, there is a per gigabyte charge for inbound data transfer.", "Inbound data transfer is free in most cases; it is outbound transfer that is charged.", "Входящий трафик в большинстве случаев бесплатен; платят за исходящий."],
        ], "AWS has three cost drivers: compute (per hour or second), storage (per gigabyte) and outbound data transfer (per gigabyte). 'Storage per gigabyte' is the true statement.", "У AWS три статьи расходов: вычисления (за час или секунду), хранилище (за гигабайт) и исходящий трафик (за гигабайт). Верно утверждение «хранилище — за гигабайт»."),
        qx("What are the four support plans offered by AWS Support? (Select the best answer)", "Basic, Developer, Business, Enterprise", [
          ["All support is free.", "Only the Basic plan is free; Developer, Business and Enterprise are paid monthly.", "Бесплатен только Basic; Developer, Business и Enterprise оплачиваются помесячно."],
          ["Basic, Startup, Business, Enterprise", "There is no Startup plan; the second tier is Developer.", "Плана Startup нет; второй уровень — Developer."],
          ["Free, Bronze, Silver, Gold", "These tier names are made up; AWS names its plans by audience.", "Такие названия выдуманы; AWS называет планы по типу клиента."],
        ], "The course's four plans: Basic (free, everyone), Developer (testing and early development), Business (production workloads) and Enterprise (business-critical, with a Technical Account Manager). AWS later added Enterprise On-Ramp, but the classic answer is these four.", "Четыре плана курса: Basic (бесплатно, для всех), Developer (тесты и ранняя разработка), Business (продакшен) и Enterprise (критичные системы, с Technical Account Manager). Позже AWS добавил Enterprise On-Ramp, но классический ответ — эти четыре."),
        qx("A customer is building a new application and is unsure of their usage patterns but expects to grow and stabilize usage over time. They want to start without a long-term commitment. Which pricing option should they use?", "On Demand", [
          ["Spot instances", "Spot capacity can be reclaimed at any time — risky for a new application that must stay up.", "Мощность Spot могут забрать в любой момент — рискованно для нового приложения, которое должно работать."],
          ["Reserved Instances", "Reserved Instances need a 1- or 3-year commitment, which the customer wants to avoid for now.", "Reserved Instances требуют обязательства на 1 или 3 года, а клиент пока хочет без него."],
          ["Savings plans", "Savings Plans also require a 1- or 3-year spend commitment.", "Savings Plans тоже требуют обязательства по расходам на 1 или 3 года."],
        ], "On-Demand has no commitment and no upfront payment — ideal while usage is unknown. Once usage stabilizes, the steady part can move to Reserved Instances or Savings Plans.", "On-Demand — без обязательств и предоплаты, идеально, пока нагрузка неизвестна. Когда потребление стабилизируется, постоянную часть можно перевести на Reserved Instances или Savings Plans."),
        qx("Your startup is running a web app on a single Amazon EC2 instance. The workload is consistent, predictable, and will run for at least 1 year. The finance team asks you to reduce costs. What should you recommend?", "Switch to Reserved Instances with a 1-year term", [
          ["Move to AWS Lambda immediately", "Rewriting the app for serverless is a redesign, not a pricing fix, and nothing about it is immediate.", "Переписать приложение под serverless — это переделка архитектуры, а не смена цены, и быстро это не сделать."],
          ["Keep using On-Demand Instances for flexibility", "On-Demand is the most expensive per hour; a steady workload does not need that flexibility.", "On-Demand — самый дорогой за час; стабильной нагрузке такая гибкость не нужна."],
          ["Use Spot Instances to lower cost", "Spot can be interrupted — wrong for a single web server that must always run.", "Spot могут прервать — не подходит для единственного веб-сервера, который должен работать всегда."],
        ], "Steady, predictable usage for a known period is the textbook case for Reserved Instances: a 1-year term is much cheaper than On-Demand for the same instance.", "Стабильная предсказуемая нагрузка на известный срок — классический случай Reserved Instances: срок на 1 год намного дешевле On-Demand для того же инстанса."),
        qx("You run a stateless analytics job that can be interrupted. Cost optimization is key. Which EC2 option is best?", "Spot Instances", [
          ["Dedicated Hosts", "Dedicated Hosts are the most expensive option, meant for compliance and licensing.", "Dedicated Hosts — самый дорогой вариант, он для compliance и лицензий."],
          ["Reserved Instances", "Reserved Instances suit steady always-on workloads with a 1–3 year commitment.", "Reserved Instances подходят для постоянной нагрузки с обязательством на 1–3 года."],
          ["On-Demand Instances", "On-Demand works but costs far more than Spot for a job that tolerates interruption.", "On-Demand подойдёт, но стоит намного дороже Spot для задачи, которую можно прерывать."],
        ], "Spot Instances use spare EC2 capacity at up to 90% off. AWS can reclaim them with a two-minute warning, which a stateless, interruptible job can tolerate.", "Spot Instances — свободная мощность EC2 со скидкой до 90%. AWS может забрать их с предупреждением за две минуты, а stateless-задача, которую можно прерывать, это переносит."),
        qx("If your project requires monthly reports that iterate through very large amounts of data, which Amazon Elastic Compute Cloud (Amazon EC2) purchasing option should you consider?", "Scheduled Reserved Instances", [
          ["On-Demand Instances", "On-Demand would work, but you would pay full price for a predictable recurring job.", "On-Demand подойдёт, но за предсказуемую повторяющуюся задачу придётся платить полную цену."],
          ["Dedicated Hosts", "Dedicated Hosts address compliance and licensing, not a recurring schedule.", "Dedicated Hosts решают вопросы compliance и лицензий, а не расписания."],
          ["Spot Instances", "Spot may be interrupted in the middle of the report; a recurring big job needs guaranteed capacity on its schedule.", "Spot могут прервать посреди отчёта; большой регулярной задаче нужна гарантированная мощность по расписанию."],
        ], "Scheduled Reserved Instances reserve capacity for a recurring time window (daily, weekly or monthly) at a discount — exactly a monthly reporting run. AWS no longer sells new Scheduled RIs, but this is the course answer.", "Scheduled Reserved Instances резервируют мощность на повторяющееся окно времени (день, неделя, месяц) со скидкой — ровно под ежемесячные отчёты. Новые Scheduled RI AWS больше не продаёт, но в курсе ответ именно такой."),
        qx("A financial services company needs to run sensitive applications that handle confidential customer data and require compliance with industry regulations. They need complete control over the physical server, including instance placement and resource allocation. Which pricing option should they choose?", "Dedicated Hosts", [
          ["On-Demand Instances", "On-Demand instances run on shared hardware, with no control over the physical server.", "On-Demand инстансы работают на общем железе, без контроля над физическим сервером."],
          ["Savings Plans", "Savings Plans are a discount model, not physical isolation.", "Savings Plans — модель скидок, а не физическая изоляция."],
          ["Spot Instances", "Spot is spare shared capacity that can be reclaimed — the opposite of control.", "Spot — свободная общая мощность, которую могут забрать, — противоположность контроля."],
        ], "A Dedicated Host is a whole physical server for one customer: you see its sockets and cores, control instance placement and can bring per-socket licences — this meets compliance needs.", "Dedicated Host — целый физический сервер для одного клиента: видны сокеты и ядра, есть контроль над размещением инстансов, можно использовать свои лицензии на сокет — это закрывает требования compliance."),
        qx("What is multi-tenancy in the context of Amazon EC2 instances?", "Each virtual machine is isolated but shares resources from a host machine", [
          ["Only one user can use the instance at a time", "That describes single-user access, not how VMs share a host.", "Это про доступ одного пользователя, а не про то, как VM делят хост."],
          ["Multiple servers run in the same data center", "That is just data-center density; tenancy is about VMs sharing one host.", "Это просто плотность дата-центра; tenancy — про VM на одном хосте."],
          ["A server can only run one type of application", "Tenancy says nothing about application types.", "Tenancy ничего не говорит о типах приложений."],
        ], "Multi-tenancy: the hypervisor runs VMs of different customers on the same physical host; each VM is isolated, but they share the host's CPU, memory and network. Default EC2 tenancy is shared.", "Multi-tenancy: гипервизор запускает VM разных клиентов на одном физическом хосте; каждая VM изолирована, но они делят CPU, память и сеть хоста. По умолчанию tenancy в EC2 — shared."),
        qx("A diagram shows one AWS Region containing three physically distinct groups of data centers linked to each other. Each group has its own backup generators, cooling equipment, uninterruptible power supply and network connectivity. What are these groups?", "Region availability zones", [
          ["Traditional IT data centers", "Traditional IT data centers are on-premises; the diagram is drawn inside an AWS Region.", "Традиционные дата-центры — это своя инфраструктура; а схема нарисована внутри AWS Region."],
          ["On-premises data centers", "On-premises means the customer's own site, which is never part of an AWS Region.", "On-premises — площадка самого клиента, она не бывает частью AWS Region."],
          ["AWS regions", "The Region is the outer box; the groups inside it are its Availability Zones. A Region contains AZs, not other Regions.", "Регион — это внешняя рамка; группы внутри неё — его Availability Zones. Регион содержит AZ, а не другие регионы."],
        ], "Each Availability Zone is one or more physically distinct data centers with redundant power (generators, UPS), cooling and networking; several AZs linked by low-latency links make up a Region.", "Каждая Availability Zone — один или несколько физически раздельных дата-центров с резервным питанием (генераторы, ИБП), охлаждением и сетью; несколько AZ, связанных каналами с низкой задержкой, образуют регион."),
        tfx("True or False? Availability Zones within a region are connected through low-latency links.", true,
          "AZs in a Region are physically separate but linked by high-bandwidth, low-latency networking, so applications can replicate data between them synchronously.",
          "AZ одного региона физически разнесены, но связаны быстрой сетью с низкой задержкой, поэтому приложения могут синхронно реплицировать данные между ними.",
          "False would make Multi-AZ designs (like RDS Multi-AZ with synchronous replication) impractical — yet they are the standard AWS pattern.",
          "Если бы это было неверно, схемы Multi-AZ (например, RDS Multi-AZ с синхронной репликацией) были бы непрактичны, а это стандартный подход AWS."),
        qx("What should you NOT consider when selecting a region for AWS services?", "Availability of reservation options", [
          ["Costs", "Prices differ from Region to Region, so cost is one of the four factors.", "Цены в регионах разные, поэтому стоимость — один из четырёх факторов."],
          ["Services available within the region", "Not every service exists in every Region, so availability must be checked.", "Не каждый сервис есть в каждом регионе, поэтому их наличие нужно проверять."],
          ["Data governance, legal requirements", "Laws such as data-residency rules can dictate where data may be stored.", "Законы, например о хранении данных в стране, могут диктовать, где хранить данные."],
        ], "The four factors are data governance and legal requirements, proximity to customers (latency), services available in the Region, and costs. Reservation options are not a Region-selection factor.", "Четыре фактора: data governance и юридические требования, близость к клиентам (задержка), сервисы в регионе и стоимость. Варианты резервирования — не фактор выбора региона."),
        qx("A retail company runs its e-commerce application in one Availability Zone. During a power outage, the application goes offline. The CTO asks how AWS can help prevent this in the future. What is the best approach?", "Launch resources in multiple Availability Zones within the same Region", [
          ["Deploy in multiple AWS Regions by default", "Multi-Region adds cost and complexity; AZs in one Region already isolate power failures.", "Мульти-регион добавляет цену и сложность; AZ одного региона уже изолируют сбои питания."],
          ["Switch to On-Demand Instances instead of Spot Instances", "The pricing model does not protect against a power outage in the AZ.", "Модель оплаты не защищает от отключения питания в AZ."],
          ["Use a larger EC2 instance in the same Availability Zone", "A bigger instance in the same AZ goes down with the same outage.", "Инстанс побольше в той же AZ отключится при том же сбое."],
        ], "AZs have independent power, cooling and networking, so spreading the application across several AZs (with a load balancer) keeps it running when one AZ fails.", "У AZ независимые питание, охлаждение и сеть, поэтому приложение, распределённое по нескольким AZ (с балансировщиком), продолжает работать при отказе одной AZ."),
        qx("A startup is concerned about unexpected AWS bills. They want guidance on choosing the most cost-effective resources without affecting performance. Which Well-Architected pillar does this fall under?", "Cost Optimization", [
          ["Performance Efficiency", "Performance Efficiency is about using resources efficiently as demand changes, not about bills.", "Performance Efficiency — об эффективном использовании ресурсов при меняющемся спросе, а не о счетах."],
          ["Operational Excellence", "Operational Excellence is about running, monitoring and improving operations.", "Operational Excellence — об эксплуатации, мониторинге и улучшении процессов."],
          ["Reliability", "Reliability is about recovering from failures and meeting demand.", "Reliability — о восстановлении после сбоев и выдерживании нагрузки."],
        ], "Cost Optimization is about avoiding unnecessary costs: right-sizing, choosing the right pricing model and paying only for what delivers value.", "Cost Optimization — об отказе от лишних расходов: правильный размер ресурсов, подходящая модель оплаты и оплата только того, что приносит пользу."),
        qx("A user deploys an Amazon RDS DB instance in multiple Availability Zones. This strategy involves which pillar of the AWS Well-Architected Framework?", "Reliability", [
          ["Cost Optimization", "A standby in another AZ costs more, not less — it is not a cost measure.", "Резерв в другой AZ стоит дороже, а не дешевле — это не мера экономии."],
          ["Security", "Multi-AZ does not change who can access the data; it protects availability.", "Multi-AZ не меняет, кто имеет доступ к данным; он защищает доступность."],
          ["Performance efficiency", "The standby does not serve traffic, so it does not make the database faster.", "Резервная копия не обслуживает запросы, поэтому база не становится быстрее."],
        ], "Multi-AZ keeps a synchronous standby in another AZ and fails over automatically — the system recovers from a failure, which is the Reliability pillar.", "Multi-AZ держит синхронную резервную копию в другой AZ и автоматически переключается на неё — система восстанавливается после сбоя, а это столп Reliability."),
      ],
    ),
    part(
      "cc-real-p2",
      { en: "Security, IAM, monitoring and VPC networking", ru: "Безопасность, IAM, мониторинг и сети VPC" },
      {
        en: `## Shared responsibility
- **AWS** is responsible for security **of** the cloud: facilities, hardware, network, hypervisor — and for managed services also the OS, patching and backups.
- **The customer** is responsible for security **in** the cloud: data, IAM users and permissions, security groups, the OS on EC2.
- **Fully managed databases** (RDS, DynamoDB): AWS does **provisioning, scaling, patching and backups**; the customer still **designs the data structures and manages access controls**.
> Exam trap: antivirus on the OS of a managed database is impossible — the customer has no access to that OS.
## IAM building blocks
| Element | What it is |
|---|---|
| IAM user | a person or app with **long-term** credentials (password, access keys) |
| IAM group | a set of users; permissions attached once apply to all members |
| IAM policy | a JSON document that allows or denies actions on resources |
| IAM role | an identity with **temporary** credentials, assumed by a user, a service or an **EC2 instance** |
- **Managed policy** — a standalone policy that can be attached to many identities. **Inline policy** — embedded directly in **one** user, group or role and deleted together with it.
- **Lab 1:** user-3 is in the **EC2-Admin** group, whose inline policy allows only **viewing (Describe), starting and stopping** EC2 instances. Stop works, terminate does not — the group's permissions are the reason, not AWS Support and not an instance limit.
- An app on EC2 needs DynamoDB → **attach an IAM role** to the instance. Never root credentials, never IAM user access keys stored on the server.
- IAM controls access to **AWS** (console, CLI, API). It is **not** for logging in to an operating system or authenticating users of your own application (False).
- **Root user** best practice: create **IAM users for daily work**, enable **MFA on root**, store root credentials securely, create no root access keys. The root user cannot be deleted — it is locked away.
> Exam trap: "temporary access to permissions" = **IAM role**. Users have long-term credentials; groups and policies have no credentials at all.
## Who records, who measures, who advises
| Question | Service |
|---|---|
| **Who** deleted the EC2 instance yesterday? | **AWS CloudTrail** — history of API calls |
| Monitor resources and applications **in real time**, metrics, alarms | **Amazon CloudWatch** |
| Flag **unused or exposed IAM access keys**, root without MFA, open ports, idle resources | **AWS Trusted Advisor** — best-practice checks |
| Record configuration changes, check rules you define | **AWS Config** |
- Mnemonic: Cloud**Trail** — a trail of footprints (who did what); Cloud**Watch** — watching the gauges (how it performs).
## VPC networking
- **Amazon VPC** is the service that lets you customize the network: IP range, subnets, route tables, gateways.
- A **subnet** is a part of the VPC's CIDR range in **exactly one Availability Zone** (True).
- **Public subnet** = its route table sends **0.0.0.0/0 to an internet gateway**. A private subnet has no such route. Size and IP version have nothing to do with it.
- An instance in a public subnet also needs a **public IP or Elastic IP** to be **accessible from the internet**.
- **NAT gateway** sits in the **public subnet**; the private route table sends internet-bound traffic to it, so private instances get out (updates, downloads) while the internet cannot open connections in.
= Public route table: 0.0.0.0/0 → igw-id · Private route table: 0.0.0.0/0 → nat-id
- Private instance cannot reach the internet → most likely **no NAT gateway**. An Elastic IP would not help: the private subnet has no route to the internet gateway.
> A diagram of VPC 10.0.0.0/16 with a public subnet 10.0.1.0/24, a private subnet 10.0.2.0/24, two route tables and an internet gateway, where the private subnet's traffic goes through an icon in the public subnet — that icon is the **NAT gateway**.
| Feature | Security group | Network ACL |
|---|---|---|
| Level | instance | **subnet** — optional extra layer |
| State | stateful | stateless |
| Rules | allow only | allow and deny |
- SSH (port 22) works but the browser cannot open the site → add an **inbound rule for TCP port 80** (HTTP) to the existing security group. Changes apply at once — no reboot, no new group.
- **Lab 2:** the main VPC (Lab VPC) uses **10.0.0.0/16**.
## Route 53 routing policies
| Policy | Use it when |
|---|---|
| Simple | one resource, no routing logic |
| Weighted | split traffic by percentages (A/B testing) |
| **Latency-based** | users on several continents → send each to the Region with the **lowest latency** |
| Geolocation | answer by the user's **country or continent** — language, licensing, restrictions |
| Failover | active–passive with health checks |
> Exam trap: "slow responses, route users to the closest Region automatically" → **latency-based**. Geolocation decides by *where* the user is, not by what is fastest.
?? An application on EC2 must read a DynamoDB table. What is the most secure way to give it credentials?
?= Attach an IAM role with DynamoDB permissions to the instance; the app receives temporary credentials automatically, and no keys are stored on the server.
?? Which service answers 'who terminated this instance?' and which one answers 'how high is CPU right now?'
?= CloudTrail records API calls (who did what and when); CloudWatch collects metrics and raises alarms.
?? What makes a subnet public?
?= A route 0.0.0.0/0 to an internet gateway in its route table; instances there also need a public or Elastic IP to be reachable.`,
        ru: `## Модель общей ответственности (shared responsibility)
- **AWS** отвечает за безопасность **самого** облака: здания, железо, сеть, гипервизор — а в управляемых сервисах ещё и ОС, патчи и бэкапы.
- **Клиент** отвечает за безопасность **в** облаке: данные, пользователи и права IAM, security groups, ОС на EC2.
- **Полностью управляемые базы** (RDS, DynamoDB): AWS делает **provisioning, масштабирование, патчи и бэкапы**; клиент по-прежнему **проектирует структуры данных и управляет доступом**.
> Ловушка экзамена: антивирус на ОС управляемой базы поставить невозможно — у клиента нет доступа к этой ОС.
## Из чего состоит IAM
| Элемент | Что это |
|---|---|
| IAM user | человек или приложение с **долгосрочными** учётными данными (пароль, access keys) |
| IAM group | набор пользователей; права, выданные один раз, действуют на всех участников |
| IAM policy | JSON-документ, который разрешает или запрещает действия над ресурсами |
| IAM role | учётная запись с **временными** учётными данными; её принимает пользователь, сервис или **инстанс EC2** |
- **Managed policy** — отдельная политика, которую можно прикрепить ко многим учётным записям. **Inline policy** — встроена прямо в **одного** пользователя, группу или роль и удаляется вместе с ними.
- **Lab 1:** user-3 состоит в группе **EC2-Admin**, чья inline policy разрешает только **просмотр (Describe), запуск и остановку** инстансов EC2. Stop работает, terminate — нет: причина в правах группы, а не в AWS Support и не в лимите инстансов.
- Приложению на EC2 нужен DynamoDB → **прикрепить IAM role** к инстансу. Никогда не root-данные и не access keys пользователя IAM, сохранённые на сервере.
- IAM управляет доступом к **AWS** (консоль, CLI, API). Он **не** для входа в операционную систему и не для аутентификации пользователей своего приложения (False).
- **Root user** — лучшая практика: создать **IAM users для ежедневной работы**, включить **MFA на root**, надёжно хранить root-данные, не создавать root access keys. Удалить root user нельзя — его запирают.
> Ловушка экзамена: «temporary access to permissions» = **IAM role**. У пользователей долгосрочные учётные данные; у групп и политик учётных данных нет вовсе.
## Кто записывает, кто измеряет, кто советует
| Вопрос | Сервис |
|---|---|
| **Кто** удалил инстанс EC2 вчера? | **AWS CloudTrail** — история вызовов API |
| Мониторинг ресурсов и приложений **в реальном времени**, метрики, alarms | **Amazon CloudWatch** |
| Найти **неиспользуемые или раскрытые access keys IAM**, root без MFA, открытые порты, простаивающие ресурсы | **AWS Trusted Advisor** — проверки лучших практик |
| Запись изменений конфигурации, проверка своих правил | **AWS Config** |
- Мнемоника: Cloud**Trail** — след из отпечатков (кто что сделал); Cloud**Watch** — смотреть на приборы (как работает).
## Сети VPC
- **Amazon VPC** — сервис, в котором настраивается сеть: диапазон IP, подсети, таблицы маршрутов, шлюзы.
- **Subnet (подсеть)** — часть диапазона CIDR VPC ровно **в одной Availability Zone** (True).
- **Public subnet** = её route table отправляет **0.0.0.0/0 в internet gateway**. У private subnet такого маршрута нет. Размер и версия IP тут ни при чём.
- Инстансу в public subnet нужен ещё **публичный IP или Elastic IP**, чтобы быть **доступным из интернета**.
- **NAT gateway** стоит в **public subnet**; private route table отправляет в него трафик в интернет, поэтому приватные инстансы выходят наружу (обновления, загрузки), а интернет не может открыть соединение внутрь.
= Public route table: 0.0.0.0/0 → igw-id · Private route table: 0.0.0.0/0 → nat-id
- Приватный инстанс не выходит в интернет → скорее всего **нет NAT gateway**. Elastic IP не поможет: у private subnet нет маршрута к internet gateway.
> Схема VPC 10.0.0.0/16 с public subnet 10.0.1.0/24, private subnet 10.0.2.0/24, двумя route tables и internet gateway, где трафик private subnet идёт через значок в public subnet, — этот значок и есть **NAT gateway**.
| Признак | Security group | Network ACL |
|---|---|---|
| Уровень | инстанс | **подсеть** — дополнительный необязательный слой |
| Состояние | stateful | stateless |
| Правила | только allow | allow и deny |
- SSH (порт 22) работает, а браузер сайт не открывает → добавить в существующую security group **входящее правило TCP 80** (HTTP). Изменения действуют сразу — без перезагрузки и без новой группы.
- **Lab 2:** главная VPC (Lab VPC) использует **10.0.0.0/16**.
## Политики маршрутизации Route 53
| Политика | Когда использовать |
|---|---|
| Simple | один ресурс, без логики маршрутизации |
| Weighted | делить трафик по процентам (A/B-тесты) |
| **Latency-based** | пользователи на разных континентах → каждого в регион с **наименьшей задержкой** |
| Geolocation | ответ по **стране или континенту** пользователя — язык, лицензии, ограничения |
| Failover | active–passive с health checks |
> Ловушка экзамена: «медленные ответы, автоматически направлять пользователей в ближайший регион» → **latency-based**. Geolocation решает по тому, *где* находится пользователь, а не по тому, что быстрее.
?? Приложение на EC2 должно читать таблицу DynamoDB. Как безопаснее всего дать ему учётные данные?
?= Прикрепить к инстансу IAM role с правами на DynamoDB: приложение автоматически получает временные учётные данные, и на сервере не хранится никаких ключей.
?? Какой сервис отвечает на вопрос «кто удалил этот инстанс?», а какой — «какая сейчас загрузка CPU?»
?= CloudTrail записывает вызовы API (кто, что и когда сделал); CloudWatch собирает метрики и поднимает alarms.
?? Что делает подсеть публичной?
?= Маршрут 0.0.0.0/0 в internet gateway в её route table; инстансам там ещё нужен публичный или Elastic IP, чтобы быть доступными.`,
      },
      [
        qx("user-3 is in the EC2-Admin group. While troubleshooting, the user can start and stop EC2 instances but cannot delete them. The user complains that this is blocking their work. What is the MOST likely reason?", "The user’s group permissions are limited to viewing, starting, and stopping instances, but not terminating them", [
          ["The user must contact AWS Support to unlock the terminate feature", "AWS Support does not grant permissions inside your account; IAM policies do.", "AWS Support не выдаёт права внутри аккаунта — это делают политики IAM."],
          ["The group only allows basic EC2 console access and not advanced features", "IAM has no 'basic' or 'advanced' console tiers; permissions are granted per action.", "В IAM нет «базового» и «продвинутого» доступа к консоли; права выдаются по действиям."],
          ["The account has reached the maximum number of EC2 instances allowed", "A quota limits launching new instances, never terminating existing ones.", "Квота ограничивает запуск новых инстансов, но никогда не их удаление."],
        ], "In Lab 1 the EC2-Admin group has an inline policy that allows Describe, Start and Stop on EC2 instances — but not Terminate. IAM denies every action that is not explicitly allowed.", "В Lab 1 у группы EC2-Admin inline policy разрешает Describe, Start и Stop для инстансов EC2, но не Terminate. IAM запрещает всё, что явно не разрешено."),
        qx("What does Inline Policy do?", "This is a built-in policy that is unique to a particular user or group", [
          ["This is a policy for federated users", "Federated users get permissions through roles they assume, not through inline policies.", "Федеративные пользователи получают права через роли, а не через inline policies."],
          ["This is the default policy available to all users", "IAM has no default policy for everyone; a new user has no permissions at all.", "В IAM нет политики по умолчанию для всех; у нового пользователя прав нет вовсе."],
          ["This is a policy for traffic encryption", "IAM policies control permissions; encryption is handled by other services such as KMS.", "Политики IAM управляют правами; шифрованием занимаются другие сервисы, например KMS."],
        ], "An inline policy is embedded (built into) a single user, group or role; it is not reusable and is deleted together with that identity. Managed policies, by contrast, are standalone and reusable.", "Inline policy встроена в одного пользователя, группу или роль; её нельзя переиспользовать, и она удаляется вместе с этой учётной записью. Managed policies, наоборот, отдельные и переиспользуемые."),
        tfx("True or False? AWS Identity and Access Management (IAM) is appropriate for OS and application authentication.", false,
          "IAM manages access to AWS services and resources (console, CLI, API). Logging in to an operating system or to your own application is handled by the OS or the application itself (or services such as Cognito).",
          "IAM управляет доступом к сервисам и ресурсам AWS (консоль, CLI, API). Вход в операционную систему или в собственное приложение обеспечивает сама ОС или приложение (или сервисы вроде Cognito).",
          "True would mean IAM users log in to Linux or Windows on EC2 — they do not; OS access uses key pairs or OS accounts.",
          "«True» означало бы, что пользователи IAM входят в Linux или Windows на EC2, — это не так; доступ к ОС — через key pairs или учётные записи ОС."),
        qx("Your EC2 application needs to access DynamoDB. Which option is the MOST secure way to provide credentials?", "Attach an IAM role to the EC2 instance with DynamoDB permissions", [
          ["Use the root account credentials for DynamoDB", "Root credentials have unlimited power and must never be used by applications.", "У root-данных неограниченные права, приложениям их не дают никогда."],
          ["Store IAM user access keys inside the EC2 instance", "Long-term keys on a server can leak and must be rotated by hand.", "Долгосрочные ключи на сервере могут утечь, и их приходится менять вручную."],
          ["Create a Lambda function to periodically update keys on the EC2 instance", "This rebuilds by hand what a role already does, and keys still sit on the server.", "Это вручную повторяет то, что уже делает роль, а ключи всё равно лежат на сервере."],
        ], "A role attached to the instance (instance profile) gives the app temporary credentials that AWS rotates automatically; nothing secret is stored on the server.", "Роль, прикреплённая к инстансу (instance profile), даёт приложению временные учётные данные, которые AWS сам обновляет; секретов на сервере нет."),
        qx("AWS Identity and Access Management (IAM) provides users, groups, roles, and policies so you can configure access based on your company's specific operational and security needs. Which of these is specifically designed to provide temporary access to permissions?", "IAM roles", [
          ["IAM users", "Users have long-term credentials (password, access keys), not temporary ones.", "У пользователей долгосрочные учётные данные (пароль, access keys), а не временные."],
          ["IAM policies", "Policies define permissions but are not identities and grant no credentials.", "Политики описывают права, но это не учётные записи, и учётных данных они не дают."],
          ["IAM groups", "Groups only bundle users for easier permission management; they cannot be assumed.", "Группы лишь объединяют пользователей для удобства выдачи прав; их нельзя «принять»."],
        ], "A role is assumed by a user, an application or an AWS service and provides temporary security credentials for the session.", "Роль принимает пользователь, приложение или сервис AWS, и она даёт временные учётные данные на время сессии."),
        qx("Your manager logs into AWS using the root account daily. What is the best security practice?", "Create IAM users for daily tasks, enable MFA on root, and store credentials securely", [
          ["Share the root credentials with all administrators", "Sharing root removes accountability and multiplies the risk; each admin needs their own IAM user.", "Общий root убирает подотчётность и умножает риск; каждому админу нужен свой IAM user."],
          ["Keep using the root account daily but rotate its password and access keys every month", "Rotation does not fix daily root use; root should have no access keys and be used only for rare root-only tasks.", "Смена пароля не решает проблему ежедневного root; у root не должно быть access keys, им пользуются только для редких задач."],
          ["Delete the root user and use only IAM users from now on", "The root user cannot be deleted — it is the account owner; it is secured with MFA and locked away.", "Root user удалить нельзя — это владелец аккаунта; его защищают MFA и запирают."],
        ], "Root has unrestricted access, so it is used only for the few tasks that require it. Daily work goes through IAM users with least privilege, and root is protected with MFA.", "У root неограниченный доступ, поэтому им пользуются только для немногих задач, где он обязателен. Ежедневная работа — через IAM users с минимальными правами, а root защищён MFA."),
        qx("During a security review, your team discovers unused IAM access keys that could pose a risk. Which AWS service would have flagged this issue automatically?", "AWS Trusted Advisor", [
          ["AWS Config", "Config records configurations and evaluates rules — but only rules you set up yourself; it is not the built-in best-practice checker.", "Config записывает конфигурации и проверяет правила — но только те, что настроены вручную; это не встроенная проверка лучших практик."],
          ["AWS Well-Architected Tool", "The Well-Architected Tool is a questionnaire for reviewing a workload; it does not scan IAM keys.", "Well-Architected Tool — опросник для разбора системы; ключи IAM он не сканирует."],
          ["AWS CloudWatch", "CloudWatch collects metrics and logs; it does not check security best practices.", "CloudWatch собирает метрики и логи; лучшие практики безопасности он не проверяет."],
        ], "Trusted Advisor inspects the account against best practices in cost, performance, security, fault tolerance and service limits; its security checks include IAM access key rotation, exposed keys and MFA on root.", "Trusted Advisor проверяет аккаунт по лучшим практикам: стоимость, производительность, безопасность, отказоустойчивость, лимиты; среди проверок безопасности — ротация access keys IAM, раскрытые ключи и MFA на root."),
        qx("Which AWS service will help a company to identify the users who deleted an Amazon EC2 instance yesterday?", "AWS CloudTrail", [
          ["Amazon CloudWatch", "CloudWatch shows metrics and alarms — how resources perform, not who made an API call.", "CloudWatch показывает метрики и alarms — как работают ресурсы, а не кто сделал вызов API."],
          ["Amazon Inspector", "Inspector scans instances and images for vulnerabilities; it keeps no history of user actions.", "Inspector ищет уязвимости в инстансах и образах; истории действий пользователей у него нет."],
          ["AWS Trusted Advisor", "Trusted Advisor gives best-practice recommendations, not an audit log.", "Trusted Advisor даёт рекомендации по лучшим практикам, а не журнал аудита."],
        ], "CloudTrail records every API call in the account — who made it, when, from where and what was requested — so TerminateInstances from yesterday is in its event history.", "CloudTrail записывает каждый вызов API в аккаунте — кто, когда, откуда и что запросил, — поэтому вчерашний TerminateInstances есть в истории событий."),
        qx("Which AWS service helps you monitor your AWS resources and the applications that you run on AWS in real-time?", "AWS CloudWatch", [
          ["AWS System Monitoring Service (SMS)", "There is no such AWS service; the name is made up to sound plausible.", "Такого сервиса AWS нет; название выдумано, чтобы звучать правдоподобно."],
          ["AWS Cloud9", "Cloud9 is a cloud IDE for writing code, not a monitoring service.", "Cloud9 — облачная IDE для написания кода, а не мониторинг."],
          ["AWS CloudMonitoring", "There is no service with this name; the real one is CloudWatch.", "Сервиса с таким названием нет; настоящий — CloudWatch."],
        ], "Amazon CloudWatch collects metrics and logs from AWS resources and applications in real time, shows dashboards and raises alarms when thresholds are crossed.", "Amazon CloudWatch собирает метрики и логи ресурсов и приложений в реальном времени, показывает дашборды и поднимает alarms при выходе за пороги."),
        qx("Which statement describes the responsibilities of customers using fully managed AWS database services?", "Customers are responsible for designing data structures and managing access controls.", [
          ["Customers are responsible for monitoring and generating metrics for their data.", "AWS generates the metrics for a managed database and publishes them to CloudWatch.", "Метрики управляемой базы генерирует AWS и отправляет их в CloudWatch."],
          ["Customers are responsible for deploying and managing antivirus solutions on the operating systems of fully managed database services.", "Customers have no access to the OS of a managed database, so they cannot install anything on it.", "У клиента нет доступа к ОС управляемой базы, поэтому ставить туда ничего нельзя."],
          ["Customers are responsible for provisioning, scaling, patching, and backups.", "These are exactly the tasks AWS takes over in a fully managed service.", "Это ровно те задачи, которые AWS забирает на себя в полностью управляемом сервисе."],
        ], "In a fully managed database AWS handles the infrastructure (provisioning, patching, backups, scaling); the customer remains responsible for the data itself: schema and data design, and who may access it.", "В полностью управляемой базе AWS отвечает за инфраструктуру (provisioning, патчи, бэкапы, масштабирование); клиент отвечает за сами данные: схему и структуру и за то, кто к ним имеет доступ."),
        qx("Which of the following is an optional security control that can be applied at the subnet layer of a VPC?", "Network ACL", [
          ["Firewall", "A generic word, not a specific VPC control; the subnet-level firewall in a VPC is the network ACL.", "Общее слово, а не конкретный механизм VPC; файрвол уровня подсети в VPC — это network ACL."],
          ["Web application firewall", "AWS WAF filters HTTP requests at CloudFront, a load balancer or API Gateway, not at a subnet.", "AWS WAF фильтрует HTTP-запросы на CloudFront, балансировщике или API Gateway, а не на подсети."],
          ["Security group", "A security group works at the instance (network interface) level, not the subnet.", "Security group работает на уровне инстанса (сетевого интерфейса), а не подсети."],
        ], "A network ACL is an optional, stateless layer of security that controls traffic in and out of one or more subnets with numbered allow and deny rules.", "Network ACL — необязательный stateless слой защиты, который пропускает или блокирует трафик подсетей по пронумерованным правилам allow и deny."),
        qx("Your web server is running but users cannot access it via a browser. You check and see that the security group only allows SSH (port 22). What is the simplest fix?", "Add an inbound rule for TCP port 80 to the existing security group", [
          ["Replace the security group with a new one", "A new group starts empty, so it needs the same rule anyway — editing the existing one is simpler.", "Новая группа создаётся пустой, и ей всё равно нужно то же правило — проще отредактировать текущую."],
          ["Configure an Internet Gateway", "SSH already reaches the server, so the route to the internet works; the block is the missing HTTP rule.", "SSH до сервера доходит, значит, маршрут в интернет есть; мешает отсутствие правила для HTTP."],
          ["Reboot the EC2 instance to refresh firewall rules", "Security group changes apply immediately, and a reboot does not add rules.", "Изменения security group действуют сразу, а перезагрузка правил не добавляет."],
        ], "Browsers use HTTP on TCP port 80 (HTTPS on 443). The security group denies all inbound traffic that no rule allows, so adding an inbound rule for port 80 opens the site.", "Браузеры ходят по HTTP на TCP-порт 80 (HTTPS — 443). Security group запрещает весь входящий трафик, который не разрешён правилом, поэтому правило для порта 80 открывает сайт."),
        qx("A diagram shows a VPC (10.0.0.0/16) in one Availability Zone with a public subnet (10.0.1.0/24), a private subnet (10.0.2.0/24) holding an instance, a public and a private route table, and an internet gateway. The private route table sends the private subnet's internet traffic to a component in the public subnet; the public route table sends 0.0.0.0/0 to the internet gateway. What is that component?", "NAT gateway", [
          ["VPC peering", "Peering connects two VPCs privately; it has nothing to do with reaching the internet from a private subnet.", "Peering соединяет две VPC между собой; к выходу из private subnet в интернет он отношения не имеет."],
          ["Amazon Firewall", "There is no service called Amazon Firewall (AWS Network Firewall exists, but it inspects traffic rather than giving private subnets internet access).", "Сервиса Amazon Firewall нет (есть AWS Network Firewall, но он проверяет трафик, а не выпускает private subnet в интернет)."],
          ["Amazon CloudFront", "CloudFront is a global CDN at edge locations; it is never placed inside a subnet.", "CloudFront — глобальная CDN в edge locations; внутри подсети его не размещают."],
        ], "A NAT gateway lives in the public subnet with an Elastic IP; the private route table points 0.0.0.0/0 at it, so private instances reach the internet through it while inbound connections from the internet are blocked.", "NAT gateway стоит в public subnet с Elastic IP; private route table направляет на него 0.0.0.0/0, поэтому приватные инстансы выходят в интернет через него, а входящие соединения из интернета блокируются."),
        qx("Why does an EC2 instance in a public subnet need a Public IP?", "To be accessible from the Internet", [
          ["To connect to private subnets", "Instances in one VPC reach each other by private IPs over the local route.", "Инстансы одной VPC связываются по приватным IP через маршрут local."],
          ["To use the NAT Gateway", "A NAT gateway serves private subnets; an instance in a public subnet goes out through the internet gateway.", "NAT gateway обслуживает private subnets; инстанс в public subnet выходит через internet gateway."],
          ["To run internal processes", "Internal processes need no address that is reachable from outside.", "Внутренним процессам не нужен адрес, доступный снаружи."],
        ], "The route to the internet gateway makes the subnet public, but the instance itself also needs a public (or Elastic) IP so that traffic from the internet can reach it.", "Маршрут в internet gateway делает подсеть публичной, но самому инстансу ещё нужен публичный (или Elastic) IP, чтобы трафик из интернета мог до него дойти."),
        qx("What service enables you to customize the network configuration for your VPC?", "Amazon VPC", [
          ["Amazon VPC Management Service", "No such service exists; VPC settings live in Amazon VPC itself.", "Такого сервиса нет; настройки VPC находятся в самом Amazon VPC."],
          ["Amazon Cloud Networking", "No such service exists — the name is invented.", "Такого сервиса нет — название выдумано."],
          ["Amazon Subnetting Service", "No such service exists; subnets are created inside Amazon VPC.", "Такого сервиса нет; подсети создаются внутри Amazon VPC."],
        ], "Amazon VPC lets you define your own isolated network: IP range, subnets, route tables, internet and NAT gateways, security groups and network ACLs.", "Amazon VPC позволяет задать свою изолированную сеть: диапазон IP, подсети, таблицы маршрутов, internet и NAT gateways, security groups и network ACLs."),
        qx("What is the difference between a public and a private subnet?", "A public subnet has a route 0.0.0.0/0 pointing to an Internet Gateway", [
          ["A public subnet is always larger in size", "Size is set by the subnet's CIDR block and is unrelated to being public.", "Размер задаётся CIDR подсети и не связан с тем, публичная ли она."],
          ["A private subnet only uses IPv6", "Both kinds of subnet can use IPv4, IPv6 or both.", "Оба вида подсетей могут использовать IPv4, IPv6 или оба."],
          ["There is no difference", "There is a difference — the route to the internet gateway in the route table.", "Разница есть — маршрут в internet gateway в таблице маршрутов."],
        ], "A subnet is public when its route table sends internet-bound traffic (0.0.0.0/0) to an internet gateway; a private subnet has no such route.", "Подсеть публичная, если её route table отправляет трафик в интернет (0.0.0.0/0) в internet gateway; у приватной подсети такого маршрута нет."),
        tfx("True or False? Subnets belong to a single Availability Zone.", true,
          "Each subnet lives entirely in one Availability Zone and cannot span AZs; for high availability you create subnets in several AZs.",
          "Каждая подсеть целиком находится в одной Availability Zone и не может охватывать несколько AZ; для высокой доступности создают подсети в нескольких AZ.",
          "False confuses subnets with the VPC: the VPC spans all AZs of a Region, but each subnet stays in one.",
          "«False» путает подсеть с VPC: VPC охватывает все AZ региона, а каждая подсеть остаётся в одной."),
        qx("You deployed an EC2 instance in a private subnet of your VPC. When you try to connect to the internet from this instance, the request fails. What is the MOST likely cause?", "NAT Gateway is not provided", [
          ["CloudFront must be enabled for outbound traffic.", "CloudFront delivers content to users; it plays no part in outbound traffic from a subnet.", "CloudFront доставляет контент пользователям; к исходящему трафику из подсети он отношения не имеет."],
          ["The VPC must be configured with a Direct Connect link", "Direct Connect is a private line to an on-premises network, not a way out to the internet.", "Direct Connect — выделенная линия в свою сеть, а не выход в интернет."],
          ["The instance doesn’t have an Elastic IP attached", "Even with an Elastic IP, a private subnet has no route to the internet gateway, so traffic still goes nowhere.", "Даже с Elastic IP у private subnet нет маршрута к internet gateway, и трафику всё равно некуда идти."],
        ], "Private instances reach the internet through a NAT gateway in a public subnet plus a 0.0.0.0/0 route to it in the private route table. Without it, outbound requests fail.", "Приватные инстансы выходят в интернет через NAT gateway в public subnet и маршрут 0.0.0.0/0 к нему в private route table. Без него исходящие запросы не проходят."),
        qx("In Lab 2 (Build your VPC and Launch a Web Server), what CIDR block was assigned to the main VPC?", "10.0.0.0/16", [
          ["100.64.0.0/16", "100.64.0.0/10 is the shared address space used by carrier-grade NAT, not the lab VPC.", "100.64.0.0/10 — общее адресное пространство для carrier-grade NAT, а не VPC лабы."],
          ["192.168.0.0/16", "192.168.0.0/16 is a valid private range, but the lab VPC did not use it.", "192.168.0.0/16 — допустимый частный диапазон, но в лабе использовался не он."],
          ["172.16.0.0/16", "172.16.0.0/16 is also a private range, but not the one created in the lab.", "172.16.0.0/16 — тоже частный диапазон, но в лабе создавали не его."],
        ], "In Lab 2 the Lab VPC is created with 10.0.0.0/16; its subnets are carved from it (10.0.0.0/24, 10.0.1.0/24, 10.0.2.0/24, 10.0.3.0/24).", "В Lab 2 Lab VPC создаётся с 10.0.0.0/16; подсети нарезаются из него (10.0.0.0/24, 10.0.1.0/24, 10.0.2.0/24, 10.0.3.0/24)."),
        qx("Your company has users in both Europe and Asia. Some users complain of slow response times when accessing your website hosted in a single US region. The team wants to route users to the closest AWS Region automatically. Which Route 53 routing policy is BEST to use?", "Latency-based Routing", [
          ["Weighted Routing", "Weighted routing splits traffic by fixed percentages, regardless of where users are or how fast a Region answers.", "Weighted делит трафик по заданным процентам, не глядя, где пользователь и как быстро отвечает регион."],
          ["Geolocation Routing", "Geolocation answers by the user's country or continent (for language or legal reasons); it does not measure which Region is fastest.", "Geolocation отвечает по стране или континенту пользователя (ради языка или законов); какой регион быстрее, он не измеряет."],
          ["Simple Routing", "Simple routing returns one resource with no routing logic, so users would still go to the US.", "Simple возвращает один ресурс без логики маршрутизации — пользователи по-прежнему пойдут в США."],
        ], "Latency-based routing sends each user to the Region that gives them the lowest network latency — exactly 'the closest Region automatically' for users in Europe and Asia.", "Latency-based routing отправляет каждого пользователя в регион с наименьшей для него задержкой — ровно «ближайший регион автоматически» для пользователей в Европе и Азии."),
      ],
    ),
    part(
      "cc-real-p3",
      { en: "Compute, storage, databases and scaling", ru: "Вычисления, хранилище, базы данных и масштабирование" },
      {
        en: `## EC2 instance families
| Family | Built for | Examples |
|---|---|---|
| General purpose | balanced CPU, memory, network — web servers, code repositories | T3, M5 |
| **Compute optimized** | **significant CPU power** — scientific modeling, climate simulations, batch, encoding | C5 |
| **Memory optimized** | **large datasets processed in memory** — real-time analytics, in-memory databases | R5, X1 |
| Storage optimized | high sequential read/write to **local** storage — data warehousing, distributed file systems | I3, D2 |
| Accelerated computing | **hardware accelerators** (GPUs, FPGAs) — machine learning, graphics | P3, G4 |
- **Lab 3** (Introduction to Amazon EC2): the Web Server is launched as **t3.micro** and later resized to **t3.small**. Older versions of the lab used t2.micro → t2.small — trust the version you actually did.
## Block, file and object storage
| Service | Type | What to remember |
|---|---|---|
| **Amazon EBS** | block, one AZ | data **persists when the instance stops**; attaches only to instances in the **same AZ** |
| **EBS snapshot** | backup | **point-in-time, incremental** copy of a volume, stored in **Amazon S3** |
| **EBS Multi-Attach** | block | an io1/io2 volume shared by several instances — **same AZ only** |
| Instance store | block, local | **ephemeral** — data is lost when the instance stops or terminates |
| **Amazon EFS** | file (NFS), Linux | many instances in **many AZs** read and write **at the same time**; **elastic** — grows and shrinks as files are added and removed |
| **Amazon FSx** | file, **Windows (SMB)**, Lustre | shared storage for Windows applications |
| **Amazon S3** | object | **11 nines (99.999999999%) durability**; stores flat files — documents, photos, videos |
> Exam trap: one EBS volume for instances in **different AZs** is impossible — EBS is AZ-scoped, so shared storage means **EFS**. Multi-Attach does not cross AZs.
- EFS is reached through a **mount target** — a network interface in a subnet of each AZ. The boxes that connect to mount targets in a diagram are **EC2 instances**; "EBS instance" and "VPC adapter" do not exist.
- EFS is not the cheapest archive (that is S3 Glacier), not faster than local instance store, and it does not replace backups.
## Databases
- **Amazon RDS** engines: Amazon Aurora, MySQL, MariaDB, PostgreSQL, Oracle, Microsoft SQL Server. **Amazon Redshift** is a separate data-warehouse service, not an RDS engine.
| Feature | What it gives | Serves reads? |
|---|---|---|
| **Multi-AZ deployment** | synchronous standby in another AZ, **automatic failover** | no — the standby only waits |
| **Read replica** | asynchronous copy for **read scaling** | yes — offloads reads |
| Provisioned IOPS | faster, predictable storage I/O | not a copy at all |
- **DynamoDB** operations: **GetItem** — one item by its full primary key; **Query** — items by partition key (of the table or an index); **Scan** — reads **every item** and filters, so it is how you search by a **non-key attribute**; **PutItem** — writes.
## Notifications and scaling
- **Amazon SNS** — publish/subscribe; it **pushes** messages to many subscribers at once (email, SMS, Lambda, SQS). A CloudWatch alarm sends its alerts through an **SNS topic**.
- **Amazon SQS** — a queue; messages wait until a consumer **pulls** them later.
- "Some people must be notified immediately, others process later" → **SNS**: people subscribe directly, and an SQS queue subscribed to the same topic keeps messages for later (fan-out).
- **Elastic Load Balancing** spreads traffic, **Amazon EC2 Auto Scaling** adds and removes instances — together they scale an application with demand. CloudFormation (templates), AWS Config (compliance) and Availability Zones (locations) do not scale anything.
| Auto Scaling feature | Use |
|---|---|
| **Target tracking policy** | keep a metric at a target, e.g. average CPU 70% — adds instances above it, removes them below |
| Scheduled action | scale at a fixed time (every day at 9 AM), regardless of metrics |
| Lifecycle hook | pause an instance while it launches or terminates to run custom actions |
> Exam trap: "spikes every day at 9 AM" tempts toward scheduled actions, but the requirement says "when CPU is above 70%" — a metric target, so **target tracking**.
- The last question of this part is a **practice question in the midterm style** (read replica vs Multi-AZ), not one from the real quiz.
?? A Windows application on EC2 needs shared file storage over SMB. EFS or FSx?
?= Amazon FSx (for Windows File Server); EFS speaks NFS and is meant for Linux.
?? What is the difference between RDS Multi-AZ and a read replica?
?= Multi-AZ keeps a synchronous standby in another AZ for automatic failover (availability); a read replica is an asynchronous copy that serves reads (scaling).
?? Where is an EBS snapshot stored, and what can be done with it?
?= In Amazon S3; it is an incremental point-in-time backup, and a new volume can be created from it in any AZ of the Region (or after copying, in another Region).`,
        ru: `## Семейства инстансов EC2
| Семейство | Для чего | Примеры |
|---|---|---|
| General purpose | баланс CPU, памяти, сети — веб-серверы, репозитории кода | T3, M5 |
| **Compute optimized** | **большая мощность CPU** — научное моделирование, климатические симуляции, batch, кодирование | C5 |
| **Memory optimized** | **большие наборы данных в памяти** — аналитика в реальном времени, in-memory базы | R5, X1 |
| Storage optimized | быстрое последовательное чтение/запись **локального** хранилища — хранилища данных, распределённые ФС | I3, D2 |
| Accelerated computing | **аппаратные ускорители** (GPU, FPGA) — машинное обучение, графика | P3, G4 |
- **Lab 3** (Introduction to Amazon EC2): Web Server запускают как **t3.micro**, а потом меняют на **t3.small**. В старых версиях лабы было t2.micro → t2.small — верить той версии, которая была пройдена.
## Блочное, файловое и объектное хранилище
| Сервис | Тип | Что запомнить |
|---|---|---|
| **Amazon EBS** | блочное, одна AZ | данные **сохраняются при остановке инстанса**; подключается только к инстансам в **той же AZ** |
| **EBS snapshot** | бэкап | **инкрементная** копия тома **на момент времени**, хранится в **Amazon S3** |
| **EBS Multi-Attach** | блочное | том io1/io2 на несколько инстансов — **только в одной AZ** |
| Instance store | блочное, локальное | **ephemeral** — данные пропадают при остановке или удалении инстанса |
| **Amazon EFS** | файловое (NFS), Linux | много инстансов в **разных AZ** читают и пишут **одновременно**; **эластичное** — растёт и сжимается по мере добавления и удаления файлов |
| **Amazon FSx** | файловое, **Windows (SMB)**, Lustre | общее хранилище для Windows-приложений |
| **Amazon S3** | объектное | **durability 11 девяток (99,999999999%)**; хранит файлы целиком — документы, фото, видео |
> Ловушка экзамена: один том EBS для инстансов в **разных AZ** невозможен — EBS привязан к AZ, поэтому общее хранилище — это **EFS**. Multi-Attach не выходит за пределы AZ.
- К EFS подключаются через **mount target** — сетевой интерфейс в подсети каждой AZ. Квадратики, которые на схеме подключены к mount targets, — это **инстансы EC2**; «EBS instance» и «VPC adapter» не существуют.
- EFS — не самый дешёвый архив (это S3 Glacier), не быстрее локального instance store и не заменяет бэкапы.
## Базы данных
- Движки **Amazon RDS**: Amazon Aurora, MySQL, MariaDB, PostgreSQL, Oracle, Microsoft SQL Server. **Amazon Redshift** — отдельный сервис хранилища данных (data warehouse), а не движок RDS.
| Функция | Что даёт | Обслуживает чтение? |
|---|---|---|
| **Multi-AZ deployment** | синхронный резерв в другой AZ, **автоматический failover** | нет — резерв только ждёт |
| **Read replica** | асинхронная копия для **масштабирования чтения** | да — снимает нагрузку чтения |
| Provisioned IOPS | более быстрый и предсказуемый ввод-вывод диска | это вообще не копия |
- Операции **DynamoDB**: **GetItem** — один элемент по полному первичному ключу; **Query** — элементы по partition key (таблицы или индекса); **Scan** — читает **все элементы** и фильтрует, поэтому так ищут по **атрибуту, который не ключ**; **PutItem** — запись.
## Уведомления и масштабирование
- **Amazon SNS** — publish/subscribe; он **сам рассылает (push)** сообщения сразу многим подписчикам (email, SMS, Lambda, SQS). CloudWatch alarm отправляет оповещения через **тему SNS**.
- **Amazon SQS** — очередь; сообщения ждут, пока потребитель **заберёт (pull)** их позже.
- «Одних нужно уведомить сразу, другие обработают позже» → **SNS**: люди подписываются напрямую, а очередь SQS, подписанная на ту же тему, хранит сообщения на потом (fan-out).
- **Elastic Load Balancing** распределяет трафик, **Amazon EC2 Auto Scaling** добавляет и убирает инстансы — вместе они масштабируют приложение по спросу. CloudFormation (шаблоны), AWS Config (соответствие правилам) и Availability Zones (места) ничего не масштабируют.
| Функция Auto Scaling | Для чего |
|---|---|
| **Target tracking policy** | держать метрику на цели, например средний CPU 70% — выше добавляет инстансы, ниже убирает |
| Scheduled action | масштабировать в заданное время (каждый день в 9:00), независимо от метрик |
| Lifecycle hook | придержать инстанс при запуске или удалении, чтобы выполнить свои действия |
> Ловушка экзамена: «пики каждый день в 9:00» подталкивают к scheduled actions, но требование звучит «когда CPU выше 70%» — это цель по метрике, значит **target tracking**.
- Последний вопрос этой части — **тренировочный, в стиле мидтерма** (read replica против Multi-AZ), а не из реального квиза.
?? Windows-приложению на EC2 нужно общее файловое хранилище по SMB. EFS или FSx?
?= Amazon FSx (for Windows File Server); EFS работает по NFS и предназначен для Linux.
?? Чем RDS Multi-AZ отличается от read replica?
?= Multi-AZ держит синхронный резерв в другой AZ для автоматического failover (доступность); read replica — асинхронная копия, которая обслуживает чтение (масштабирование).
?? Где хранится EBS snapshot и что с ним можно сделать?
?= В Amazon S3; это инкрементный бэкап на момент времени, и из него можно создать новый том в любой AZ региона (а после копирования — в другом регионе).`,
      },
      [
        qx("A university research team is running climate modeling simulations that require substantial CPU power to process complex algorithms and analyze large datasets. Why are compute optimized Amazon EC2 instances ideal for this task?", "They are ideal for tasks that require significant CPU power to perform computations", [
          ["They are optimized for handling tasks that require hardware accelerators", "Hardware accelerators (GPUs, FPGAs) are the accelerated computing family.", "Аппаратные ускорители (GPU, FPGA) — это семейство accelerated computing."],
          ["They are designed for workloads that require a high amount of memory to process large datasets efficiently", "A high amount of memory is the memory optimized family.", "Большой объём памяти — это семейство memory optimized."],
          ["They provide high storage throughput, making them ideal for tasks that require fast data retrieval and storage for large datasets", "High storage throughput is the storage optimized family.", "Высокая пропускная способность хранилища — это семейство storage optimized."],
        ], "Compute optimized instances (C family) give a high ratio of CPU to memory for compute-bound work such as scientific modeling, simulations, batch processing and video encoding.", "Compute optimized инстансы (семейство C) дают много CPU относительно памяти для вычислительных задач: научное моделирование, симуляции, пакетная обработка, кодирование видео."),
        qx("A financial institution is running a real-time analytics application that processes large datasets stored across multiple servers to provide quick query results. The application requires fast processing of data with a focus on handling large volumes of information efficiently. Which Amazon EC2 instance type would be the BEST choice for this task?", "Memory optimized", [
          ["Storage optimized", "Storage optimized is for high sequential I/O to local disks (data warehousing); here the stress is on fast real-time processing in memory.", "Storage optimized — для быстрого последовательного ввода-вывода на локальные диски (хранилища данных); здесь же упор на быструю обработку в памяти в реальном времени."],
          ["Compute optimized", "Compute optimized suits CPU-bound calculations, not keeping large datasets in memory for quick queries.", "Compute optimized — для задач, упирающихся в CPU, а не для удержания больших данных в памяти ради быстрых запросов."],
          ["General purpose", "General purpose is a balance for typical apps, not the best fit for large real-time analytics.", "General purpose — баланс для обычных приложений, не лучший выбор для большой аналитики в реальном времени."],
        ], "Memory optimized instances (R, X families) are designed to deliver fast performance for workloads that process large datasets in memory — real-time big-data analytics and in-memory databases.", "Memory optimized инстансы (семейства R, X) созданы для быстрой работы с большими наборами данных в памяти — аналитика больших данных в реальном времени и in-memory базы."),
        qx("In Lab 3 (Introduction to Amazon EC2), which instance type is used initially for the Web Server?", "t3.micro", [
          ["m5.large", "m5.large is a larger general-purpose instance and was not used in the lab.", "m5.large — более крупный инстанс общего назначения, в лабе он не использовался."],
          ["t2.small", "In the current lab the instance is resized to t3.small later; t2.small belongs to older versions of the lab.", "В текущей лабе инстанс позже меняют на t3.small; t2.small — из старых версий лабы."],
          ["t2.micro", "t2.micro was the starting type in older versions of the lab; the current version launches t3.micro.", "t2.micro был стартовым типом в старых версиях лабы; текущая версия запускает t3.micro."],
        ], "This is a lab question: in the current AWS Academy Lab 3 the Web Server is launched as t3.micro and then resized to t3.small. Older lab versions used t2.micro → t2.small — if the lab you did used t2, answer t2.micro.", "Это вопрос по лабе: в текущей версии AWS Academy Lab 3 Web Server запускают как t3.micro, а потом меняют на t3.small. В старых версиях было t2.micro → t2.small — если в пройденной лабе был t2, ответ t2.micro."),
        qx("You stop an EC2 instance that uses an EBS volume as its root disk. What happens to the data on the volume?", "The data persists and is available when the instance restarts", [
          ["The data is only available if backed up to S3", "An EBS volume keeps its data on its own; snapshots to S3 are backups, not a condition for survival.", "Том EBS хранит данные сам; snapshots в S3 — это бэкап, а не условие сохранности."],
          ["The data is deleted automatically when the instance stops", "Losing data on stop is the behaviour of instance store, not EBS.", "Потеря данных при остановке — поведение instance store, а не EBS."],
          ["The data is lost unless the termination protection is enabled", "Termination protection guards against terminating, not stopping — and stopping never deletes EBS data.", "Termination protection защищает от удаления, а не от остановки, — а остановка никогда не стирает данные EBS."],
        ], "EBS is persistent block storage that lives independently of the instance: after stop and start the root volume and its data are still there. (On terminate, the root volume is deleted by default.)", "EBS — постоянное блочное хранилище, независимое от инстанса: после stop и start корневой том и данные на месте. (При terminate корневой том по умолчанию удаляется.)"),
        qx("What is the primary function of an Amazon EBS Snapshot?", "To create a point-in-time, incremental backup of the EBS volume that is stored in Amazon S3.", [
          ["To automatically replicate the volume to a different AWS Region.", "Snapshots stay in their Region; copying one to another Region is a separate, explicit action.", "Snapshots остаются в своём регионе; копирование в другой регион — отдельное явное действие."],
          ["To serve as a high-speed cache for the EBS volume's frequently accessed data.", "A snapshot is a backup, not a cache; it does not speed up the volume.", "Snapshot — бэкап, а не кеш; том он не ускоряет."],
          ["To enable the same EBS volume to be attached to and accessed concurrently by multiple EC2 instances.", "Concurrent access by several instances is EBS Multi-Attach, not snapshots.", "Одновременный доступ нескольких инстансов — это EBS Multi-Attach, а не snapshots."],
        ], "An EBS snapshot is a point-in-time backup stored in S3; after the first full copy, each snapshot saves only the blocks that changed (incremental). New volumes can be restored from it.", "EBS snapshot — бэкап тома на момент времени, хранится в S3; после первой полной копии каждый снимок сохраняет только изменившиеся блоки (инкрементно). Из него можно восстановить новые тома."),
        qx("You want to attach a single EBS volume to multiple EC2 instances in different Availability Zones for shared access. Is this possible?", "No, EBS volumes are AZ-scoped. Use EFS instead for shared storage", [
          ["Yes, if termination protection is enabled", "Termination protection only prevents accidental termination; it has nothing to do with attaching volumes.", "Termination protection только защищает от случайного удаления; к подключению томов отношения не имеет."],
          ["Yes, if snapshots are enabled", "A snapshot can create a new, separate volume in another AZ — not share the same volume.", "Из snapshot можно создать новый, отдельный том в другой AZ, но не общий тот же самый."],
          ["Yes, by using Multi-Attach with Provisioned IOPS (io1/io2) volumes", "Multi-Attach exists for io1/io2, but only for instances in the same Availability Zone.", "Multi-Attach есть для io1/io2, но только для инстансов в той же Availability Zone."],
        ], "An EBS volume exists in one AZ and attaches only to instances in that AZ. For storage shared by instances across AZs, use Amazon EFS.", "Том EBS существует в одной AZ и подключается только к инстансам в этой AZ. Для хранилища, общего для инстансов в разных AZ, используют Amazon EFS."),
        qx("Your company runs Windows applications on EC2 that need shared file storage with SMB protocol support. Which service is BEST?", "Amazon FSx", [
          ["EBS Multi-attach", "Multi-Attach shares a block volume within one AZ and needs a cluster-aware file system; it is not an SMB file share.", "Multi-Attach делит блочный том в пределах одной AZ и требует кластерной ФС; это не файловая шара SMB."],
          ["Amazon EFS", "EFS uses the NFS protocol and is meant for Linux; it does not support SMB.", "EFS работает по протоколу NFS и рассчитан на Linux; SMB он не поддерживает."],
          ["Amazon S3", "S3 is object storage accessed through an API, not a mounted SMB file system.", "S3 — объектное хранилище с доступом через API, а не подключаемая файловая система SMB."],
        ], "Amazon FSx for Windows File Server provides fully managed shared Windows file storage over SMB, integrated with Active Directory.", "Amazon FSx for Windows File Server даёт полностью управляемое общее файловое хранилище Windows по SMB с интеграцией Active Directory."),
        qx("Your team has 10 EC2 instances running in the same VPC. You need shared storage that all instances can read and write to at the same time. Which storage option fits best?", "Amazon EFS", [
          ["Amazon S3", "S3 is object storage over an API; it is not a file system that instances mount and write to concurrently.", "S3 — объектное хранилище через API, а не файловая система, которую инстансы монтируют и одновременно пишут."],
          ["Amazon EBS", "An EBS volume normally attaches to one instance; Multi-Attach is limited to io1/io2 in one AZ and needs a cluster-aware file system.", "Том EBS обычно подключается к одному инстансу; Multi-Attach ограничен io1/io2 в одной AZ и требует кластерной ФС."],
          ["Instance Store", "Instance store is local to one host and ephemeral — it cannot be shared.", "Instance store локален для одного хоста и временный — его нельзя расшарить."],
        ], "Amazon EFS is a shared NFS file system: thousands of instances, even in different AZs, can mount it and read and write at the same time.", "Amazon EFS — общая файловая система NFS: тысячи инстансов, даже в разных AZ, могут смонтировать её и одновременно читать и писать."),
        qx("AnyCompany Financial needs to implement a new data application that will analyze market data. The application must be able to scale compute resources up or down to match traffic demand while maintaining access to the same datasets. What is a benefit of using Amazon EFS as the storage solution for the application described in this scenario?", "Amazon EFS provides elastic storage capacity, automatically scaling up and down as files are added and removed, with no disruption to applications.", [
          ["Amazon EFS provides the lowest cost storage option for infrequently accessed financial data.", "The lowest-cost storage for rarely used data is S3 Glacier, not EFS.", "Самое дешёвое хранилище для редко используемых данных — S3 Glacier, а не EFS."],
          ["Amazon EFS provides faster read access than local instance storage for high-frequency trading algorithms.", "EFS is network storage; local instance store is faster.", "EFS — сетевое хранилище; локальный instance store быстрее."],
          ["Amazon EFS provides automatic global replication of data, eliminating the need for data backups.", "EFS stores data across AZs in one Region; cross-Region replication is optional, and backups are still needed.", "EFS хранит данные в нескольких AZ одного региона; репликация в другой регион — опция, и бэкапы всё равно нужны."],
        ], "EFS grows and shrinks automatically with the files in it, and any number of instances can mount it, so compute can scale up and down while all instances share the same datasets.", "EFS автоматически растёт и сжимается вместе с файлами, а смонтировать его может любое число инстансов, поэтому вычисления масштабируются, а все инстансы видят одни и те же данные."),
        qx("A diagram shows a VPC with three Availability Zones (A, B and C), each with a private subnet. Each private subnet contains a mount target with a network interface, and all mount targets connect to Amazon Elastic File System. Boxes marked '?' (two in AZ A, one in AZ C) have arrows pointing to the mount targets. What are the '?' boxes?", "EC2 instance", [
          ["VPC adapter", "There is no 'VPC adapter' component in AWS.", "Компонента «VPC adapter» в AWS нет."],
          ["EBS instance", "There is no 'EBS instance'; EBS provides volumes, and it is a different storage service from EFS.", "«EBS instance» не бывает; EBS даёт тома, и это другой сервис хранилища, не EFS."],
          ["Network interface", "The network interface is already shown inside each mount target; the boxes are what connects to it.", "Сетевой интерфейс уже нарисован внутри каждого mount target; квадратики — это то, что к нему подключается."],
        ], "EFS is mounted by compute: EC2 instances in each AZ connect to the mount target (an elastic network interface) in their subnet and share one file system.", "EFS монтируют вычислительные ресурсы: инстансы EC2 в каждой AZ подключаются к mount target (сетевому интерфейсу) в своей подсети и делят одну файловую систему."),
        tfx("True or false. Amazon simple storage service S3 is an object storage suitable for the storage of flat files like Microsoft Word documents, photos, etc.", true,
          "S3 stores any file as an object (data plus metadata) in a bucket — documents, photos, videos, backups. It is ideal for whole files that are written once and read many times.",
          "S3 хранит любой файл как объект (данные плюс метаданные) в бакете — документы, фото, видео, бэкапы. Он идеален для файлов целиком, которые пишут один раз и читают много раз.",
          "False would hold for a database or an OS disk (S3 is not block storage), but for flat files like documents and photos S3 is the textbook answer.",
          "«False» было бы верно для базы данных или диска ОС (S3 — не блочное хранилище), но для файлов вроде документов и фото S3 — классический ответ."),
        qx("Which AWS service guarantees 11 nines (99.999999999%) durability?", "Amazon S3", [
          ["Amazon EBS", "EBS volumes are designed for 99.8–99.9% durability (io2 for 99.999%), not 11 nines.", "Тома EBS рассчитаны на durability 99,8–99,9% (io2 — 99,999%), а не 11 девяток."],
          ["Amazon EC2", "EC2 is compute; durability of stored data is a storage property.", "EC2 — вычисления; durability хранимых данных — свойство хранилища."],
          ["Amazon CloudFront", "CloudFront caches copies at edge locations; it is not where the original data is durably kept.", "CloudFront кеширует копии в edge locations; оригиналы данных надёжно хранятся не там."],
        ], "S3 is designed for 99.999999999% durability by storing objects redundantly across at least three Availability Zones.", "S3 рассчитан на durability 99,999999999%: объекты хранятся с избыточностью как минимум в трёх Availability Zones."),
        qx("Which of the following is NOT a database engine supported by Amazon RDS?", "Amazon Redshift", [
          ["MySQL", "MySQL is one of the RDS engines.", "MySQL — один из движков RDS."],
          ["PostgreSQL", "PostgreSQL is one of the RDS engines.", "PostgreSQL — один из движков RDS."],
          ["Microsoft SQL Server", "Microsoft SQL Server is one of the RDS engines.", "Microsoft SQL Server — один из движков RDS."],
        ], "RDS engines are Aurora, MySQL, MariaDB, PostgreSQL, Oracle and SQL Server. Redshift is a separate data-warehouse service for analytics, not an engine you pick in RDS.", "Движки RDS: Aurora, MySQL, MariaDB, PostgreSQL, Oracle и SQL Server. Redshift — отдельный сервис хранилища данных для аналитики, а не движок, который выбирают в RDS."),
        qx("Your e-commerce website uses Amazon RDS (MySQL). The CTO wants automatic failover to another Availability Zone if the primary database fails. Which configuration meets this requirement?", "RDS Multi-AZ Deployment", [
          ["RDS Provisioned IOPS", "Provisioned IOPS makes storage faster; it creates no second copy to fail over to.", "Provisioned IOPS ускоряет диск, но не создаёт второй копии для переключения."],
          ["RDS Read Replica", "A read replica serves reads and is asynchronous; promoting it is a manual step, not automatic failover.", "Read replica обслуживает чтение и асинхронна; её повышение — ручной шаг, а не автоматический failover."],
          ["Amazon DynamoDB Global Table", "Global Tables are a DynamoDB (NoSQL) feature and do not apply to an RDS MySQL database.", "Global Tables — функция DynamoDB (NoSQL), к базе RDS MySQL она не относится."],
        ], "Multi-AZ keeps a synchronous standby in another AZ; if the primary fails, RDS automatically switches the DNS endpoint to the standby.", "Multi-AZ держит синхронный резерв в другой AZ; при отказе основной базы RDS автоматически переключает DNS-адрес на резерв."),
        qx("In Amazon DynamoDB, to find an item in a table using an attribute other than the item's primary key, you would typically use which operation?", "Scan", [
          ["GetItem", "GetItem needs the full primary key of the item.", "GetItem требует полный первичный ключ элемента."],
          ["PutItem", "PutItem writes an item; it does not search.", "PutItem записывает элемент, а не ищет."],
          ["Query", "Query needs a partition key value (of the table or an index); without such an index a non-key attribute cannot be queried.", "Query требует значение partition key (таблицы или индекса); без такого индекса по атрибуту, который не ключ, Query не сделать."],
        ], "Scan reads every item in the table and can filter on any attribute — that is how you find items by a non-key attribute (it is slower and costlier than Query).", "Scan читает все элементы таблицы и может фильтровать по любому атрибуту — так находят элементы по атрибуту, который не ключ (это медленнее и дороже, чем Query)."),
        qx("Which service would you use to send alerts based on Amazon CloudWatch alarms?", "Amazon Simple Notification Service (SNS)", [
          ["AWS CloudTrail", "CloudTrail records API calls; it does not send alarm notifications.", "CloudTrail записывает вызовы API; уведомления по alarms он не отправляет."],
          ["Amazon Route 53", "Route 53 is DNS; its health checks can feed alarms, but notifications go through SNS.", "Route 53 — это DNS; его health checks могут питать alarms, но уведомления идут через SNS."],
          ["Amazon Trusted Advisor", "Trusted Advisor gives best-practice recommendations, not alarm delivery.", "Trusted Advisor даёт рекомендации по лучшим практикам, а не доставляет оповещения."],
        ], "A CloudWatch alarm's action publishes to an SNS topic, and SNS pushes the alert to its subscribers by email, SMS, Lambda or HTTP.", "Действие CloudWatch alarm публикует сообщение в тему SNS, а SNS рассылает оповещение подписчикам по email, SMS, в Lambda или по HTTP."),
        qx("A software development company needs to notify the engineering team whenever a new bug is reported in their bug tracking system. Some team members need to be notified immediately, whereas others can process the bug reports later. Which service should the software development company choose based on the requirements?", "Amazon Simple Notification Service (Amazon SNS)", [
          ["Amazon Simple Queue Service (Amazon SQS)", "SQS holds messages until a consumer polls — it covers 'later', but cannot push instant notifications to people.", "SQS хранит сообщения, пока их не заберёт потребитель, — это закрывает «позже», но мгновенно уведомить людей не может."],
          ["Amazon EC2 Message Tool", "There is no such AWS service.", "Такого сервиса AWS нет."],
          ["Elastic Load Balancing (ELB)", "ELB distributes incoming traffic across targets; it does not send notifications.", "ELB распределяет входящий трафик по целям; уведомлений он не отправляет."],
        ], "SNS publishes each message to all subscribers at once: people who need it immediately subscribe by email or SMS, and an SQS queue subscribed to the same topic keeps the reports for those who process them later (fan-out).", "SNS публикует каждое сообщение сразу всем подписчикам: кому нужно сразу — подписаны по email или SMS, а очередь SQS, подписанная на ту же тему, хранит отчёты для тех, кто обработает их позже (fan-out)."),
        qx("Which pair of AWS tools helps your application scale up or down based on demand?", "Elastic Load Balancing and Amazon EC2 Auto Scaling", [
          ["Amazon EC2 Auto Scaling and AWS CloudFormation", "Auto Scaling is right, but CloudFormation only provisions resources from templates; it does not react to demand.", "Auto Scaling — верно, но CloudFormation только создаёт ресурсы по шаблонам и на спрос не реагирует."],
          ["Elastic Load Balancing and multiple Availability Zones", "ELB is right, but Availability Zones are locations for high availability; they add no capacity by themselves.", "ELB — верно, но Availability Zones — это места для высокой доступности, мощности сами по себе они не добавляют."],
          ["AWS CloudFormation and AWS Config", "CloudFormation provisions from templates and Config tracks configuration compliance — neither scales anything.", "CloudFormation создаёт ресурсы по шаблонам, Config следит за соответствием конфигураций — ни один ничего не масштабирует."],
        ], "EC2 Auto Scaling adds and removes instances as demand changes, and Elastic Load Balancing spreads the traffic across whatever instances are currently running — together they scale the application.", "EC2 Auto Scaling добавляет и убирает инстансы при изменении спроса, а Elastic Load Balancing распределяет трафик по тем, что сейчас работают, — вместе они масштабируют приложение."),
        qx("Your web application traffic spikes every day at 9 AM. You want your Auto Scaling group to add EC2 instances automatically when CPU usage is above 70%. Which feature should you configure?", "Auto Scaling Target Tracking Policy", [
          ["Auto Scaling Lifecycle Hooks", "Lifecycle hooks pause instances during launch or termination for custom actions; they do not decide when to scale.", "Lifecycle hooks придерживают инстансы при запуске или удалении для своих действий; когда масштабироваться, они не решают."],
          ["CloudWatch Logs", "CloudWatch Logs stores log files; scaling uses CloudWatch metrics and alarms, not Logs.", "CloudWatch Logs хранит логи; масштабирование опирается на метрики и alarms CloudWatch, а не на Logs."],
          ["Auto Scaling Scheduled Actions", "Scheduled actions scale at a fixed time whatever the CPU is; the requirement is driven by CPU above 70%.", "Scheduled actions масштабируют в заданное время независимо от CPU; а требование задано через CPU выше 70%."],
        ], "A target tracking policy keeps a metric such as average CPU at a target value (70%): when CPU rises above it, Auto Scaling adds instances, and it removes them when CPU falls.", "Target tracking policy держит метрику, например средний CPU, на целевом значении (70%): когда CPU выше, Auto Scaling добавляет инстансы, а когда ниже — убирает."),
        qx("Practice (midterm style): reporting queries are slowing down your Amazon RDS for MySQL database, and the primary must keep serving the shop. Which change offloads these read-only queries?", "Create a read replica and send the reports to it", [
          ["Convert the instance to a Multi-AZ deployment", "In a Multi-AZ DB instance deployment the standby only waits for failover and serves no queries.", "В развёртывании Multi-AZ DB instance резерв только ждёт failover и запросы не обслуживает."],
          ["Switch the storage to Provisioned IOPS (io1)", "Faster storage may help a little, but every query still hits the same primary.", "Более быстрый диск может немного помочь, но все запросы по-прежнему идут в ту же основную базу."],
          ["Move the reports into a DynamoDB global table", "This means migrating to another (NoSQL) database, not offloading reads from RDS.", "Это переезд на другую (NoSQL) базу, а не разгрузка чтения в RDS."],
        ], "A read replica is an asynchronous copy of the RDS database with its own endpoint; pointing read-only reporting queries at it takes the load off the primary. Multi-AZ is for availability, read replicas are for read scaling.", "Read replica — асинхронная копия базы RDS со своим адресом; если направить на неё отчётные запросы только на чтение, нагрузка с основной базы снимется. Multi-AZ — для доступности, read replicas — для масштабирования чтения."),
      ],
    ),
  ],
};
