import { part, qx, tfx, type Lecture } from "../types";

export const lecture5: Lecture = {
  id: "cc-l5",
  title: { en: "Lecture 5 — Cloud Adoption and Emerging Technologies", ru: "Лекция 5 — Переход в облако и новые технологии" },
  parts: [
    part(
      "cc-l5-p1",
      { en: "Cloud adoption and strategy", ru: "Переход в облако и облачная стратегия" },
      {
        en: `## Cloud adoption is no longer a thing of the future
From a **single individual** to a **global multi-billion-dollar enterprise**, anybody can access the computing capacity they need on the cloud.
- The lag time from **decision to value** is no longer a journey of **years**.
- It no longer needs **high upfront capital**: capacity is rented and paid for as it is used.
- Cloud lets businesses **experiment, fail and learn** faster than ever before, with **low risk exposure**.
- Businesses have greater **freedom to change course** instead of living with the consequences of expensive decisions taken in the past.
@diagram cc-capex-opex
| Before the cloud | With the cloud |
|---|---|
| years from decision to value | value in weeks or even days |
| high upfront capital to buy servers | pay-as-you-go, no big upfront spend |
| a failed experiment is expensive | experiment, fail and learn at low risk |
| stuck with expensive past decisions | freedom to change course |
## Cloud adoption frameworks
Each cloud provider has its own **cloud adoption framework (CAF)**. A framework provides a set of **tools, templates, guidance and narratives** at every stage to accelerate the cloud adoption journey. Examples: the **Microsoft Cloud Adoption Framework for Azure**, the **AWS Cloud Adoption Framework (AWS CAF)** and the **Google Cloud Adoption Framework**.
The **Microsoft CAF** is proven guidance that walks an organization through the questions **why cloud, what to move, where to move, how to move, and how to manage and operate** in the cloud. Its stages:
- **Strategy** — understand the business strategy and the **motivations** for adopting cloud.
- **Plan** — evaluate **readiness** and build the **adoption plan** for the cloud estate.
- **Ready** — set up the **Azure landing zone** and implement best practices for future expansion.
- **Adopt** — discover the **migration, cloud-native or hybrid** scenario for each workload and act on it.
- **Govern** — assess the current and the end state with a vision, and **iteratively add controls** to avoid risk in future.
- **Manage** — document the **operations and management baseline** and the design principles for landing new workloads and supporting existing ones.
| CAF stage | Question it answers | Typical result |
|---|---|---|
| Strategy | why cloud? | business motivations and expected outcomes |
| Plan | what to move? | readiness assessment, adoption plan |
| Ready | where to move? | landing zone with best practices |
| Adopt | how to move? | workloads migrated, rebuilt cloud-native or run hybrid |
| Govern | how to stay in control? | policies and controls added step by step |
| Manage | how to operate? | operations baseline and design principles |
A **landing zone** is a pre-configured cloud environment (accounts, network, identities, security rules) that is ready to receive workloads.
![A team of business and IT staff in a meeting room in front of a whiteboard showing a cloud migration roadmap drawn as six connected boxes labelled Strategy, Plan, Ready, Adopt, Govern, Manage](/events/cc/l5-cloud-adoption-roadmap.webp)
## IBM Institute for Business Value study
- More than **three-quarters** of enterprises use cloud computing to **expand into new industries**.
- **74%** have adopted cloud to **improve customer experience**.
- **71%** use cloud to create **enhanced products and services**, while at the same time **downsizing legacy systems and reducing costs**.
To remain competitive, businesses need to:
- **respond quickly** to marketplace changes;
- use **analytics** to understand the customer experience;
- **adapt** their products and services based on what they learn.
## Today's enablers for growth, agility and innovation
**Product lifecycles have shortened** and **barriers to entry have become lower**, so speed matters more than ever. The enablers are:
- **cognitively-enabled workflows** — business processes in which AI supports or makes decisions;
- applied **exponential technologies**: **AI, Automation, IoT and Blockchain**;
- **applications that span new and legacy** solutions;
- **open, hybrid and secure multicloud** infrastructures.
@diagram cc-deployment-models
Cloud is also an enabler for **proximity to customers**: running workloads in a region close to the users lowers **latency**.
## Big data and digital transformation
The **power, scalability, flexibility and pay-as-you-go economics** of cloud make it the underpinning foundation for **digital transformation**.
- **IDC** (International Data Corporation) predicted that by **2025** the total amount of digital data created worldwide would rise to **163 zettabytes**.
- **One zettabyte = a trillion gigabytes**.
- **30%** of this data will be **real-time** information.
= 1 ZB = 10^12 GB = 10^21 bytes
With so much data produced every day and **data-driven decisions** crucial to any business, cloud computing becomes essential for businesses to **succeed, sustain and compete**.
## A cloud strategy
A **cloud strategy** is more than an IT strategy: today it is the **core component of any business strategy**. Businesses that are not integrating cloud into their business strategy risk lacking:
- **speed** and **agility**;
- **innovation**;
- **decision-making** capacity;
- the ability to respond to **digital disruption**.
The question organizations ask is no longer **whether** to move to the cloud, but **what strategy** to adopt to get there.
> Cloud turns years of waiting and big upfront capital into fast, low-risk experiments; the question is not whether to adopt it, but with which strategy.
?? Which Microsoft CAF stage sets up the Azure landing zone, and which stage comes right after it?
?= Ready sets up the landing zone; Adopt follows, where workloads are migrated, rebuilt cloud-native or run hybrid.
?? According to the IBM IBV study, what share of enterprises adopted cloud to improve customer experience, and what share use it for enhanced products and services?
?= 74% for customer experience, 71% for enhanced products and services.`,
        ru: `## Переход в облако — уже не будущее
От **одного человека (single individual)** до **глобальной компании с оборотом в миллиарды долларов** — любой может получить в облаке столько вычислительных мощностей, сколько ему нужно.
- Путь от **решения до ценности (decision to value)** больше не занимает **годы**.
- Больше не нужен **большой стартовый капитал (high upfront capital)**: мощности арендуются и оплачиваются по мере использования.
- Облако позволяет бизнесу **экспериментировать, ошибаться и учиться (experiment, fail, learn)** быстрее, чем когда-либо, с **низким риском (low risk exposure)**.
- У бизнеса больше **свободы сменить курс**, вместо того чтобы жить с последствиями дорогих решений, принятых в прошлом.
@diagram cc-capex-opex
| До облака | С облаком |
|---|---|
| годы от решения до ценности | ценность за недели или даже дни |
| крупный стартовый капитал на покупку серверов | pay-as-you-go, без больших вложений заранее |
| неудачный эксперимент обходится дорого | экспериментируй, ошибайся и учись с низким риском |
| привязка к дорогим решениям прошлого | свобода сменить курс |
## Фреймворки перехода в облако
У каждого облачного провайдера есть свой **cloud adoption framework (CAF)** — фреймворк перехода в облако. Он даёт набор **инструментов, шаблонов, рекомендаций и описаний (tools, templates, guidance, narratives)** на каждом этапе, чтобы ускорить переход. Примеры: **Microsoft Cloud Adoption Framework for Azure**, **AWS Cloud Adoption Framework (AWS CAF)** и **Google Cloud Adoption Framework**.
**Microsoft CAF** — проверенное руководство, которое проводит организацию через вопросы **why cloud, what to move, where to move, how to move, how to manage and operate**: зачем облако, что переносить, куда, как и как потом этим управлять. Его этапы:
- **Strategy (стратегия)** — понять бизнес-стратегию и **мотивы (motivations)** перехода в облако.
- **Plan (план)** — оценить **готовность (readiness)** и составить **план перехода** для облачной инфраструктуры.
- **Ready (готовность)** — развернуть **Azure landing zone** и внедрить лучшие практики для будущего расширения.
- **Adopt (внедрение)** — выбрать для каждой нагрузки сценарий **migration, cloud-native или hybrid** и выполнить его.
- **Govern (контроль)** — оценить текущее и целевое состояние и **постепенно добавлять средства контроля (controls)**, чтобы избежать рисков в будущем.
- **Manage (эксплуатация)** — задокументировать **базовый уровень эксплуатации и управления (operations baseline)** и принципы проектирования для новых и существующих нагрузок.
| Этап CAF | На какой вопрос отвечает | Типичный результат |
|---|---|---|
| Strategy | зачем облако? | бизнес-мотивы и ожидаемые результаты |
| Plan | что переносить? | оценка готовности, план перехода |
| Ready | куда переносить? | landing zone с лучшими практиками |
| Adopt | как переносить? | нагрузки перенесены, переписаны как cloud-native или работают гибридно |
| Govern | как сохранить контроль? | политики и средства контроля, добавляемые шаг за шагом |
| Manage | как эксплуатировать? | базовый уровень эксплуатации и принципы проектирования |
**Landing zone** — заранее настроенная облачная среда (аккаунты, сеть, учётные записи, правила безопасности), готовая принимать нагрузки.
![Команда бизнес- и ИТ-специалистов в переговорной перед доской, на которой нарисована дорожная карта перехода в облако из шести связанных блоков: Strategy, Plan, Ready, Adopt, Govern, Manage](/events/cc/l5-cloud-adoption-roadmap.webp)
## Исследование IBM Institute for Business Value
- Более **трёх четвертей** компаний используют облако, чтобы **выйти в новые отрасли (expand into new industries)**.
- **74%** перешли в облако, чтобы **улучшить клиентский опыт (customer experience)**.
- **71%** используют облако для создания **улучшенных продуктов и услуг**, одновременно **сокращая устаревшие (legacy) системы и снижая затраты**.
Чтобы оставаться конкурентоспособным, бизнесу нужно:
- **быстро реагировать** на изменения рынка;
- использовать **аналитику (analytics)**, чтобы понимать клиентский опыт;
- **адаптировать** продукты и услуги по итогам того, что удалось узнать.
## Современные драйверы роста, гибкости и инноваций
**Жизненный цикл продуктов сократился**, а **барьеры входа на рынок снизились**, поэтому скорость важна как никогда. Драйверы (enablers):
- **cognitively-enabled workflows** — бизнес-процессы, в которых ИИ помогает принимать решения или принимает их сам;
- прикладные **экспоненциальные технологии (exponential technologies)**: **AI, Automation, IoT и Blockchain**;
- **приложения, объединяющие новые и legacy-решения**;
- **открытая, гибридная и защищённая мультиоблачная инфраструктура (open, hybrid, secure multicloud)**.
@diagram cc-deployment-models
Облако также даёт **близость к клиентам (proximity to customers)**: если нагрузка работает в регионе рядом с пользователями, снижается **задержка (latency)**.
## Big data и цифровая трансформация
**Мощность, масштабируемость, гибкость и экономика pay-as-you-go** делают облако фундаментом **цифровой трансформации (digital transformation)**.
- **IDC** (International Data Corporation) прогнозировала, что к **2025** году общий объём цифровых данных, созданных в мире, вырастет до **163 зеттабайт (zettabytes)**.
- **Один зеттабайт = триллион гигабайт**.
- **30%** этих данных будут данными **реального времени (real-time)**.
= 1 ZB = 10^12 GB = 10^21 bytes
Раз данных каждый день производится так много, а **решения на основе данных (data-driven decisions)** критичны для любого бизнеса, облако становится необходимым, чтобы **преуспевать, удерживаться и конкурировать (succeed, sustain, compete)**.
## Облачная стратегия
**Облачная стратегия (cloud strategy)** — больше, чем ИТ-стратегия: сегодня это **ключевая часть любой бизнес-стратегии**. Бизнес, который не встраивает облако в свою стратегию, рискует остаться без:
- **скорости** и **гибкости (agility)**;
- **инноваций**;
- способности **принимать решения**;
- умения реагировать на **цифровые потрясения (digital disruption)**.
Организации больше не спрашивают, **стоит ли** переходить в облако, — вопрос в том, **какую стратегию** перехода выбрать.
> Облако превращает годы ожидания и большой стартовый капитал в быстрые эксперименты с низким риском; вопрос не в том, переходить ли, а в том, с какой стратегией.
?? На каком этапе Microsoft CAF разворачивают Azure landing zone и какой этап идёт сразу после него?
?= Landing zone разворачивают на этапе Ready; за ним идёт Adopt — нагрузки переносят, переписывают как cloud-native или запускают гибридно.
?? Какая доля компаний в исследовании IBM IBV перешла в облако ради клиентского опыта и какая использует его ради улучшенных продуктов и услуг?
?= 74% — ради клиентского опыта, 71% — ради улучшенных продуктов и услуг.`,
      },
      [
        qx("According to the lecture, what has the cloud removed from the path between a business decision and its value?", "Years of delay and high upfront capital", [
          ["Security reviews and compliance checks", "Security and compliance still matter in the cloud; the slide crosses out 'years' and 'high upfront capital'.", "Безопасность и соответствие требованиям в облаке по-прежнему важны; на слайде зачёркнуты «годы» и «большой стартовый капитал»."],
          ["Software licences and user training", "Licences and training are not what the lecture says has disappeared from the decision-to-value path.", "Лицензии и обучение — не то, что, по словам лекции, исчезло с пути от решения до ценности."],
          ["Network latency and all data transfer fees", "Latency and transfer fees still exist in the cloud; they are not the barrier the lecture talks about.", "Задержка и плата за передачу данных в облаке никуда не делись; лекция говорит не о них."],
        ], "The slide shows Decision to Value with 'years' and 'high upfront capital' crossed out: cloud capacity is available at once and paid for as used.", "На слайде путь «решение → ценность», где зачёркнуты «годы» и «большой стартовый капитал»: облачные мощности доступны сразу и оплачиваются по факту."),
        qx("The lecture says cloud lets businesses experiment, fail and learn. How does it describe doing this?", "Faster than ever, with low risk exposure", [
          ["Slower than before, but with no risk at all", "Cloud makes experimenting faster, not slower, and the lecture says low risk, not zero risk.", "Облако ускоряет эксперименты, а не замедляет их, и речь о низком, а не нулевом риске."],
          ["Only possible for very large enterprises", "The lecture stresses that anyone, from one person to a global enterprise, can use cloud capacity.", "Лекция подчёркивает, что облаком может пользоваться любой — от одного человека до глобальной компании."],
          ["Only with a long hardware contract", "Cloud removes long hardware commitments; resources are rented on demand.", "Облако как раз убирает долгие обязательства по оборудованию: ресурсы арендуются по требованию."],
        ], "Cheap, on-demand resources mean a failed experiment costs little, so businesses can try, fail and learn quickly.", "Дешёвые ресурсы по требованию делают неудачный эксперимент недорогим, поэтому можно быстро пробовать, ошибаться и учиться."),
        qx("An online retailer wants faster page loads for shoppers on another continent. Which cloud benefit from the lecture applies?", "Proximity to customers", [
          ["Downsizing legacy systems", "Retiring legacy systems cuts costs but does not bring servers closer to distant shoppers.", "Сокращение legacy-систем снижает затраты, но не приближает серверы к далёким покупателям."],
          ["Cognitively-enabled workflows", "AI-driven workflows improve decisions, not the network distance to users.", "Процессы с ИИ улучшают решения, а не расстояние по сети до пользователей."],
          ["Blockchain-based traceability", "Traceability records transactions; it does nothing for page-load latency.", "Отслеживаемость фиксирует транзакции и никак не влияет на задержку загрузки страниц."],
        ], "Cloud regions near the users shorten the distance data travels, which lowers latency.", "Регионы облака рядом с пользователями сокращают путь данных, и задержка падает."),
        qx("What does a cloud adoption framework provide at every stage of the journey?", "Tools, templates, guidance and narratives", [
          ["Free compute credits and hardware discounts", "A framework is guidance, not a billing offer; credits are a separate commercial matter.", "Фреймворк — это руководство, а не скидки; кредиты — отдельный коммерческий вопрос."],
          ["A fixed list of services that must be bought", "A framework guides decisions; it does not oblige you to buy a fixed set of services.", "Фреймворк помогает принимать решения и не обязывает покупать фиксированный набор сервисов."],
          ["Automatic migration of every workload", "The framework helps plan and run the migration; it does not move workloads by itself.", "Фреймворк помогает спланировать и провести перенос, но сам нагрузки не переносит."],
        ], "Each provider's CAF gives tools, templates, guidance and narratives to accelerate cloud adoption.", "CAF каждого провайдера даёт инструменты, шаблоны, рекомендации и описания, чтобы ускорить переход в облако."),
        qx("In the Microsoft Cloud Adoption Framework, which stage sets up the Azure landing zone?", "Ready", [
          ["Strategy", "Strategy is about the motivations for moving to cloud, before any environment is built.", "Strategy — про мотивы перехода, до того как что-либо разворачивают."],
          ["Govern", "Govern adds controls over time to limit risk; the landing zone is already built by then.", "Govern постепенно добавляет средства контроля; landing zone к этому времени уже готова."],
          ["Manage", "Manage documents the operations baseline for running workloads, not the initial environment.", "Manage описывает базовый уровень эксплуатации нагрузок, а не первоначальную среду."],
        ], "Ready prepares the landing zone and best practices so that workloads can be moved in the Adopt stage.", "На этапе Ready готовят landing zone и лучшие практики, чтобы на этапе Adopt переносить нагрузки."),
        qx("A company keeps adding policies and controls step by step to avoid future risk in its cloud estate. Which Microsoft CAF stage is this?", "Govern", [
          ["Manage", "Manage is about the operations baseline and supporting workloads, not adding risk controls.", "Manage — про базовый уровень эксплуатации и поддержку нагрузок, а не про средства контроля рисков."],
          ["Adopt", "Adopt is where workloads are migrated, rebuilt cloud-native or run hybrid.", "На этапе Adopt нагрузки переносят, переписывают как cloud-native или запускают гибридно."],
          ["Strategy", "Strategy defines why the company moves to cloud; it does not add controls.", "Strategy определяет, зачем компании облако, и не добавляет средства контроля."],
        ], "Govern assesses the current and end state and iteratively adds controls to avoid tangible risk.", "Govern оценивает текущее и целевое состояние и постепенно добавляет средства контроля, чтобы избежать рисков."),
        qx("Which Microsoft CAF stage picks a migration, cloud-native or hybrid scenario for each workload and acts on it?", "Adopt", [
          ["Plan", "Plan evaluates readiness and drafts the adoption plan; the scenarios are acted on later, in Adopt.", "Plan оценивает готовность и составляет план; сценарии выполняются позже, на этапе Adopt."],
          ["Ready", "Ready builds the landing zone that the workloads will later land in.", "Ready разворачивает landing zone, в которую потом попадут нагрузки."],
          ["Manage", "Manage covers operating workloads once they are already in the cloud.", "Manage — это эксплуатация нагрузок, когда они уже в облаке."],
        ], "Adopt discovers the migration, cloud-native or hybrid scenario for each workload and acts on it.", "Adopt определяет для каждой нагрузки сценарий — migration, cloud-native или hybrid — и выполняет его."),
        qx("Which sequence lists the Microsoft CAF stages in the correct order?", "Strategy, Plan, Ready, Adopt, Govern, Manage", [
          ["Plan, Strategy, Adopt, Ready, Manage, Govern", "You first decide why (Strategy) and only then plan; Ready must also come before Adopt.", "Сначала решают «зачем» (Strategy) и лишь потом планируют; к тому же Ready должен идти до Adopt."],
          ["Strategy, Ready, Plan, Adopt, Manage, Govern", "Readiness is evaluated in Plan before the landing zone is built in Ready.", "Готовность оценивают на этапе Plan, до того как на этапе Ready разворачивают landing zone."],
          ["Ready, Strategy, Plan, Govern, Adopt, Manage", "Building the environment before knowing the strategy reverses the logic of the framework.", "Строить среду, не зная стратегии, — это обратный порядок по отношению к логике фреймворка."],
        ], "Why cloud (Strategy), what to move (Plan), where (Ready), how (Adopt), then Govern and Manage.", "Зачем облако (Strategy), что переносить (Plan), куда (Ready), как (Adopt), затем Govern и Manage."),
        tfx("Only Microsoft offers a cloud adoption framework; customers of other cloud providers have to build their own.", false,
          "The lecture says each cloud provider has its own adoption framework; Microsoft's CAF is the example it walks through.",
          "В лекции сказано, что у каждого облачного провайдера свой фреймворк; Microsoft CAF — лишь пример, который разбирается подробно.",
          "'True' is wrong: every major provider publishes such a framework, for example AWS CAF.",
          "«Верно» — ошибка: такие фреймворки публикует каждый крупный провайдер, например AWS CAF."),
        qx("In the IBM Institute for Business Value study, what share of enterprises adopted cloud to improve customer experience?", "74%", [
          ["71%", "71% is the share that uses cloud to create enhanced products and services.", "71% — доля тех, кто создаёт с помощью облака улучшенные продукты и услуги."],
          ["85%", "85% is a different statistic: businesses that rely on multiple clouds.", "85% — другая цифра: компании, которые используют несколько облаков."],
          ["30%", "30% is IDC's share of real-time data among all data created by 2025.", "30% — доля данных реального времени в прогнозе IDC на 2025 год."],
        ], "IBM IBV: 74% adopted cloud to improve customer experience.", "IBM IBV: 74% перешли в облако ради улучшения клиентского опыта."),
        qx("According to the IBM IBV study, 71% of enterprises use cloud for what purpose?", "To create enhanced products and services", [
          ["To improve the experience of their customers", "Improving customer experience is the 74% figure, not 71%.", "Улучшение клиентского опыта — это 74%, а не 71%."],
          ["To expand into completely new industries", "Expanding into new industries is the 'more than three-quarters' figure.", "Выход в новые отрасли — это цифра «более трёх четвертей»."],
          ["To move all their staff to remote work", "The study does not measure remote work; it is about products, services and customers.", "Исследование не касается удалённой работы; оно о продуктах, услугах и клиентах."],
        ], "71% use cloud to create enhanced products and services while downsizing legacy systems and reducing costs.", "71% создают с помощью облака улучшенные продукты и услуги, одновременно сокращая legacy-системы и затраты."),
        qx("More than three-quarters of enterprises in the IBM IBV study use cloud computing to do what?", "Expand into new industries", [
          ["Replace all on-premise hardware", "The study is about growth and customers, not about replacing every on-premise server.", "Исследование — про рост и клиентов, а не про замену всего локального оборудования."],
          ["Cut their IT staff in half", "No staffing figure appears in the study; the three-quarters figure is about new industries.", "Цифр о персонале в исследовании нет; «три четверти» — про новые отрасли."],
          ["Stop paying for software licences", "Licence costs are not the finding; the finding is expansion into new industries.", "Вывод не о лицензиях, а о выходе в новые отрасли."],
        ], "More than 75% of enterprises use cloud to expand into new industries.", "Более 75% компаний используют облако, чтобы выходить в новые отрасли."),
        qx("Which technologies does the lecture call the applied exponential technologies that enable growth?", "AI, Automation, IoT and Blockchain", [
          ["VMs, Containers, CDN and DNS", "These are infrastructure building blocks, not the exponential technologies on the slide.", "Это строительные блоки инфраструктуры, а не экспоненциальные технологии со слайда."],
          ["ERP, CRM, Email and Office suites", "These are classic business applications, not emerging exponential technologies.", "Это классические бизнес-приложения, а не новые экспоненциальные технологии."],
          ["Mainframes, Tape backup, LAN and Fax", "These are legacy technologies, the opposite of exponential ones.", "Это устаревшие технологии — противоположность экспоненциальным."],
        ], "The slide names AI, Automation, IoT and Blockchain as today's applied exponential technologies.", "На слайде названы AI, Automation, IoT и Blockchain — прикладные экспоненциальные технологии."),
        qx("Which kind of infrastructure does the lecture name as an enabler of growth, agility and innovation?", "Open, hybrid and secure multicloud", [
          ["Closed, single-vendor private data center", "The lecture stresses open and multicloud, the opposite of a closed single-vendor setup.", "Лекция подчёркивает открытость и мультиоблако — противоположность закрытой среде одного вендора."],
          ["Isolated on-premise mainframe clusters", "Isolated mainframes are legacy; the enabler is an open hybrid multicloud.", "Изолированные мейнфреймы — это legacy, а драйвер — открытое гибридное мультиоблако."],
          ["One public region with no backup site", "A single region without backup is a risk, not an enabler named in the lecture.", "Один регион без резерва — это риск, а не драйвер из лекции."],
        ], "Open, hybrid and secure multicloud infrastructures are listed among today's enablers.", "Открытая, гибридная и защищённая мультиоблачная инфраструктура названа среди современных драйверов."),
        qx("Why, according to the lecture, must businesses respond to market changes faster than before?", "Product lifecycles shortened, entry barriers fell", [
          ["Hardware prices rise sharply every single year", "The lecture does not mention rising hardware prices; cloud even lets you avoid buying hardware.", "О росте цен на оборудование в лекции нет; облако вообще позволяет его не покупать."],
          ["Cloud providers force customers to re-migrate yearly", "No provider forces yearly migrations; the pressure comes from the market.", "Ни один провайдер не заставляет переезжать каждый год; давление создаёт рынок."],
          ["Laws now ban products that stay on sale too long", "No such law exists; shorter lifecycles come from competition.", "Такого закона нет; жизненный цикл сокращается из-за конкуренции."],
        ], "Shorter product lifecycles and lower barriers to entry mean competitors appear and move quickly.", "Короче жизненный цикл продуктов и ниже барьеры входа — значит, конкуренты появляются и действуют быстро."),
        qx("IDC predicted how much digital data would be created worldwide by 2025?", "163 zettabytes", [
          ["163 petabytes", "A petabyte is a million times smaller than a zettabyte; the figure is 163 ZB.", "Петабайт в миллион раз меньше зеттабайта; прогноз — 163 ZB."],
          ["16.3 exabytes", "Both the number and the unit are wrong; IDC's figure is 163 zettabytes.", "Неверны и число, и единица: у IDC — 163 зеттабайта."],
          ["1,630 terabytes", "Terabytes are far too small a unit for all data created worldwide.", "Терабайты — слишком мелкая единица для всех данных мира."],
        ], "IDC: 163 zettabytes of digital data by 2025, 30% of it real-time.", "IDC: к 2025 году — 163 зеттабайта цифровых данных, 30% из них — реального времени."),
        qx("How much is one zettabyte, as given in the lecture?", "A trillion gigabytes", [
          ["A billion megabytes", "A billion megabytes is 10^15 bytes, which is one petabyte.", "Миллиард мегабайт — это 10^15 байт, то есть один петабайт."],
          ["A million terabytes", "A million terabytes is 10^18 bytes, which is one exabyte.", "Миллион терабайт — это 10^18 байт, то есть один эксабайт."],
          ["A thousand petabytes", "A thousand petabytes is also one exabyte, a thousand times less than a zettabyte.", "Тысяча петабайт — тоже один эксабайт, в тысячу раз меньше зеттабайта."],
        ], "1 ZB = 10^12 GB = 10^21 bytes.", "1 ZB = 10^12 GB = 10^21 байт."),
        qx("According to IDC, what share of the data created worldwide by 2025 will be real-time information?", "30%", [
          ["3%", "3% is far too low; IDC expects almost a third of all data to be real-time.", "3% — слишком мало: IDC ожидает, что почти треть данных будет реального времени."],
          ["74%", "74% is the IBM IBV figure for improving customer experience.", "74% — цифра IBM IBV об улучшении клиентского опыта."],
          ["50%", "IDC's figure is 30%, not half of all data.", "У IDC — 30%, а не половина всех данных."],
        ], "IDC expects 30% of the 163 ZB to be real-time data, which makes cloud processing power essential.", "IDC ожидает, что 30% из 163 ZB будут данными реального времени, поэтому без вычислительной мощности облака не обойтись."),
        qx("A CEO asks why cloud must be part of the business strategy, not only IT. What risk does the lecture give for ignoring it?", "Lacking speed, agility and response to disruption", [
          ["Losing the right to use open-source software", "Open-source licensing does not depend on having a cloud strategy.", "Право использовать open source не зависит от облачной стратегии."],
          ["Paying higher electricity bills in all offices", "Office electricity is not the risk named; the risk is losing speed, agility and innovation.", "Счета за электричество — не тот риск; риск — потерять скорость, гибкость и инновации."],
          ["Being forced to hire twice as many network engineers", "The lecture names no staffing risk; it warns about competitiveness.", "О найме в лекции ничего нет; предупреждение — о конкурентоспособности."],
        ], "Without cloud in the business strategy, a company may lack the speed, agility, innovation and decision-making needed to compete.", "Без облака в бизнес-стратегии компании может не хватить скорости, гибкости, инноваций и способности принимать решения, чтобы конкурировать."),
        qx("Which qualities make cloud the underpinning foundation for digital transformation, according to the lecture?", "Power, scalability, flexibility, pay-as-you-go", [
          ["Fixed capacity, long contracts, upfront payment", "These describe traditional on-premise IT, which slows transformation down.", "Это черты традиционной локальной ИТ, которая тормозит трансформацию."],
          ["Physical ownership, manual setup, fixed pricing", "Owning and manually setting up hardware is exactly what cloud replaces.", "Владение оборудованием и ручная настройка — именно то, что облако заменяет."],
          ["Single location, private cables, annual billing", "Cloud is global and metered; these are the opposite qualities.", "Облако глобально и тарифицируется по факту; здесь противоположные свойства."],
        ], "The power, scalability, flexibility and pay-as-you-go economics of cloud underpin digital transformation.", "Мощность, масштабируемость, гибкость и экономика pay-as-you-go — фундамент цифровой трансформации."),
      ],
    ),
    part(
      "cc-l5-p2",
      { en: "Case studies: American Airlines, Spotify, Dropbox, Netflix", ru: "Кейсы: American Airlines, Spotify, Dropbox, Netflix" },
      {
        en: `## Why look at case studies
Leading businesses have used cloud technologies to transform the way they work: to provide **better customer service**, **remove barriers to innovation**, achieve **enterprise scale** and **accelerate growth**.
| Company | Theme in the lecture | Direction of the move |
|---|---|---|
| American Airlines | better customer service | monolithic apps to cloud-native microservices |
| Spotify | removing barriers to innovation | own data centers to Google Cloud Platform |
| Dropbox | demand for enterprise scale | from Amazon S3 back to its own servers (US) |
| Netflix | a cloud-scale tech stack | runs on AWS with its own CDN, Open Connect |
## American Airlines — better customer service
In the highly competitive airline industry, **customer experience** is a major point of differentiation, and **digital channels** are increasingly important.
- **Challenge:** improve the customer experience and digital channels, and improve **response time** to customer needs.
- **Solution:** a new **cloud-based technology platform** and a new approach to development for delivering **digital self-service tools** faster across the enterprise.
- The constraints of the existing customer-facing applications, built on **monolithic code**, were removed by moving them to a **cloud-native microservices architecture**.
- **Results:** faster development and release of new apps; better **operational reliability, productivity and end-customer response times**; **cost savings** by avoiding the upgrade costs of the existing systems.
## Spotify — removing barriers to innovation
**Spotify** (est. 2006) is a media services provider focused on its **audio-streaming platform**: users search for, listen to and share music and podcasts.
**Migration objective.** Its massive **in-house data centers** were difficult to provision and maintain, and they did not directly serve the company's goal of being the **'best music service in the world'**. Leadership and engineering agreed to **free engineers to focus on innovation**.
- Planning for the migration to **Google Cloud Platform (GCP)** started in **2015**.
- Goals: minimize **disruption to product development** and minimize the **cost and complexity of hybrid operation** (running on-premise and cloud side by side).
**Migration strategy.**
- **Two years of preparation** before the migration, with a **dedicated Spotify/Google cloud migration team** overseeing the effort.
- The work was split into **two parts, services and data**, which took **about a year each**.
- **Services:** engineering teams moved services to the cloud in focused **two-week sprints**, pausing product development.
- **Data:** each team chose between **forklifting** (moving the data as it is, 'lift and shift') and **rewriting**, whichever fit its needs best.
**Results:** greater **scalability**, with developers **freed to innovate**; **faster time to market** through a cloud platform framework that streamlines development; cloud development resources that are quick, easy and cost-effective to deploy.
**Key takeaways:**
- **Gaining stakeholder buy-in is crucial.** Spotify consulted its engineers about the vision; once they saw what their future jobs would look like, they became all-in advocates.
- **Migration preparation shouldn't be rushed.** The team investigated cloud strategies, built the business use case, **mapped all dependencies** and worked with Google on the right solutions.
- **Focus and dedication pay huge dividends.** A dedicated team kept everything on track and shared lessons learned; teams fully focused on the migration finished faster and reduced the disruption to product development.
## Dropbox — demand for enterprise scale
**Dropbox** (est. 2007) is a file hosting service that provides **cloud storage and file synchronization**.
**Migration objective.** Dropbox built its business on the cloud: file data lived in **Amazon S3 (Simple Storage Service)**, while the **metadata** stayed **on-premise**. Over time it feared becoming **overly dependent on Amazon**:
- **costs kept rising** as its storage needs grew;
- Amazon was planning a similar, competing service, **Amazon WorkDocs**.
So Dropbox decided to **take back its storage** to **reduce costs, increase control and keep its competitive edge**.
**Migration strategy and results.**
- It moved storage **in-house in the US**, but judged that in **Europe AWS is still the best fit**, so the result is a hybrid.
- It designed and built a massive network of **new-breed machines**, orchestrated by software written in an **entirely new programming language**.
- About **90% of its files** moved back to its own servers.
- The expanded in-house capabilities enabled **Project Infinite**: universal compatibility and **unlimited real-time data access** for desktop users.
**Key takeaways:**
- **On-premise infrastructure may still be right for some businesses.** Dropbox's core product depends on fast, reliable data access and storage, so it needs consistently high performance at a sustainable cost; going in-house was a huge investment that may pay back through better performance and lower costs.
- **Size matters.** Cloud businesses are not charities: there is always a margin somewhere. Only a business that is **big enough** can justify building a massive in-house network; for smaller companies, or ones whose growth may stall, it is a huge risk.
| Aspect | Spotify | Dropbox |
|---|---|---|
| Starting point | own data centers | files on Amazon S3, metadata on-premise |
| Moved to | Google Cloud Platform | own servers in the US, AWS kept in Europe |
| Main reason | free engineers to innovate | cost, control, dependence on Amazon |
| How | 2 years of preparation, services then data, 2-week sprints | custom machines, new language, about 90% of files |
| Lesson | buy-in, careful preparation, focus | on-premise can win at very large scale |
## Netflix's tech stack
Netflix shows what a global streaming service built on cloud technologies looks like. Background: Netflix moved from its own data centers to **AWS** after a major database corruption in 2008 and finished the move in 2016.
| Layer | Technologies |
|---|---|
| Mobile and web | **Swift** and **Kotlin** for native apps, **React** for the web |
| Frontend/server communication | **GraphQL** |
| Backend services | **Zuul** (API gateway), **Eureka** (service discovery), **Spring Boot** |
| Databases | **EVCache**, **Cassandra**, **CockroachDB** |
| Messaging/streaming | **Apache Kafka** and **Flink** |
| Video storage | **Amazon S3** and **Open Connect** |
| Data processing | **Flink** and **Spark**, **Tableau** for visualization, **Redshift** for the structured data warehouse |
| CI/CD | **JIRA, Confluence, PagerDuty, Jenkins, Gradle, Chaos Monkey, Spinnaker, Atlas** |
- **Open Connect** is Netflix's own **content delivery network (CDN)**: caching servers placed close to viewers stream the video, while the master copies are kept in S3.
@diagram cc-cdn
- **Chaos Monkey** deliberately terminates random production instances to prove the system survives failures; **Spinnaker** is a continuous-delivery platform for deploying to the cloud; **Atlas** collects monitoring metrics.
![A Netflix Open Connect Appliance: a rack-mounted server with a bright red front panel and a white Netflix logo, installed among other servers in an internet provider's data center rack](/events/cc/l5-netflix-open-connect-appliance.webp)
> Cloud is a strategic choice, not a dogma: Spotify moved in to free its engineers for innovation, while Dropbox moved most files out because at its size owning storage was cheaper.
?? Why did Dropbox move most of its files off Amazon S3, and why is that not advice for everyone?
?= Rising storage costs, the wish for more control and fear of dependence on Amazon, which was planning a rival service (WorkDocs). It only pays off for a business big enough to build its own massive network.
?? How did Spotify organize its move to Google Cloud Platform?
?= Two years of preparation with a dedicated Spotify/Google team, then services and data were migrated in about a year each, services in focused two-week sprints.`,
        ru: `## Зачем разбирать кейсы
Ведущие компании с помощью облачных технологий изменили то, как они работают: чтобы обеспечить **лучшее обслуживание клиентов (better customer service)**, **убрать барьеры для инноваций (remove barriers to innovation)**, достичь **масштаба крупного предприятия (enterprise scale)** и **ускорить рост**.
| Компания | Тема в лекции | Направление переезда |
|---|---|---|
| American Airlines | лучшее обслуживание клиентов | от монолитных приложений к cloud-native микросервисам |
| Spotify | устранение барьеров для инноваций | из своих ЦОД в Google Cloud Platform |
| Dropbox | потребность в масштабе предприятия | из Amazon S3 обратно на свои серверы (США) |
| Netflix | технологический стек облачного масштаба | работает на AWS со своей CDN Open Connect |
## American Airlines — лучшее обслуживание клиентов
В очень конкурентной авиаотрасли **клиентский опыт (customer experience)** — главное отличие от конкурентов, а **цифровые каналы** становятся всё важнее.
- **Задача (challenge):** улучшить клиентский опыт и цифровые каналы и сократить **время реакции (response time)** на запросы клиентов.
- **Решение:** новая **облачная технологическая платформа** и новый подход к разработке, чтобы быстрее выпускать **инструменты цифрового самообслуживания (digital self-service tools)** по всей компании.
- Ограничения существующих клиентских приложений на **монолитном коде (monolithic code)** сняли, переведя их на **облачную микросервисную архитектуру (cloud-native microservices)**.
- **Результаты:** быстрее разработка и выпуск новых приложений; выше **операционная надёжность, производительность и скорость ответа клиентам**; **экономия** за счёт отказа от затрат на обновление старых систем.
## Spotify — устранение барьеров для инноваций
**Spotify** (основана в 2006 году) — поставщик медиасервисов с **платформой потокового аудио (audio streaming)**: пользователи ищут и слушают музыку и подкасты и делятся ими.
**Цель переезда (migration objective).** Огромные **собственные ЦОД (in-house data centers)** было трудно разворачивать и обслуживать, и они не помогали напрямую цели компании — быть **«лучшим музыкальным сервисом в мире»**. Руководство и инженеры решили **освободить инженеров для инноваций**.
- Планирование переезда в **Google Cloud Platform (GCP)** началось в **2015** году.
- Цели: свести к минимуму **помехи для разработки продукта** и **стоимость и сложность гибридной работы (hybrid operation)**, когда одновременно работают свои серверы и облако.
**Стратегия переезда (migration strategy).**
- **Два года подготовки** до самого переезда, с **выделенной командой миграции Spotify/Google**, которая руководила процессом.
- Работу разделили на **две части — сервисы и данные (services and data)**, каждая заняла **около года**.
- **Сервисы:** инженерные команды переносили сервисы в облако сосредоточенными **двухнедельными спринтами**, приостановив разработку продукта.
- **Данные:** каждая команда выбирала между **forklifting** (перенести данные как есть, «lift and shift») и **переписыванием (rewriting)** — как ей удобнее.
**Результаты:** выше **масштабируемость (scalability)**, разработчики **освободились для инноваций**; **быстрее вывод на рынок (time to market)** благодаря облачной платформе, упрощающей разработку; облачные ресурсы для разработки разворачиваются быстро, легко и недорого.
**Главные уроки (key takeaways):**
- **Поддержка заинтересованных сторон (stakeholder buy-in) критична.** Spotify обсуждала замысел со своими инженерами; увидев, как будет выглядеть их работа, они стали горячими сторонниками.
- **Подготовку к переезду нельзя торопить.** Команда изучила облачные стратегии, обосновала выгоду для бизнеса, **описала все зависимости (dependencies)** и вместе с Google подобрала решения.
- **Сосредоточенность и самоотдача окупаются сполна.** Выделенная команда держала всё под контролем и передавала накопленный опыт; команды, полностью занятые переездом, закончили быстрее и меньше мешали разработке продукта.
## Dropbox — потребность в масштабе предприятия
**Dropbox** (основана в 2007 году) — сервис хостинга файлов: **облачное хранилище и синхронизация файлов (cloud storage and file synchronization)**.
**Цель переезда.** Dropbox построила бизнес на облаке: сами файлы лежали в **Amazon S3 (Simple Storage Service)**, а **метаданные (metadata)** — на **своих серверах (on-premise)**. Со временем компания стала опасаться **чрезмерной зависимости от Amazon**:
- **затраты росли** вместе с объёмом хранения;
- Amazon готовила похожий, конкурирующий сервис — **Amazon WorkDocs**.
Поэтому Dropbox решила **забрать хранение к себе**, чтобы **снизить затраты, усилить контроль и сохранить конкурентное преимущество**.
**Стратегия и результаты.**
- Хранилище перенесли **на свои серверы в США**, но решили, что в **Европе AWS по-прежнему лучший вариант**, — итог получился гибридным.
- Компания сама спроектировала и построила огромную сеть **машин нового типа (new-breed machines)**, которыми управляет ПО на **совершенно новом языке программирования**.
- Около **90% файлов** вернулись на собственные серверы.
- Расширенные собственные возможности позволили запустить **Project Infinite** — универсальную совместимость и **неограниченный доступ к данным в реальном времени** для пользователей настольных компьютеров.
**Главные уроки:**
- **Собственная инфраструктура (on-premise) всё ещё может подходить некоторым компаниям.** Основной продукт Dropbox зависит от быстрого и надёжного доступа к данным, поэтому нужна стабильно высокая производительность по разумной цене; переезд к себе потребовал огромных вложений, но может окупиться лучшей производительностью и меньшими затратами.
- **Размер имеет значение (size matters).** Облачные компании — не благотворительность: наценка есть всегда. Строить огромную собственную сеть оправдано только для **достаточно крупного** бизнеса; для небольших компаний или тех, чей рост может остановиться, это огромный риск.
| Аспект | Spotify | Dropbox |
|---|---|---|
| Исходная точка | свои ЦОД | файлы в Amazon S3, метаданные у себя |
| Куда переехали | Google Cloud Platform | на свои серверы в США, AWS остался в Европе |
| Главная причина | освободить инженеров для инноваций | затраты, контроль, зависимость от Amazon |
| Как | 2 года подготовки, сначала сервисы, потом данные, спринты по 2 недели | свои машины, новый язык, около 90% файлов |
| Урок | поддержка, тщательная подготовка, сосредоточенность | при очень большом масштабе своё выгоднее |
## Технологический стек Netflix
Netflix показывает, как выглядит глобальный стриминговый сервис на облачных технологиях. Справка: Netflix перешла из своих ЦОД в **AWS** после крупного повреждения базы данных в 2008 году и закончила переезд в 2016-м.
| Уровень | Технологии |
|---|---|
| Мобильные приложения и веб | **Swift** и **Kotlin** для нативных приложений, **React** для веба |
| Связь фронтенда с сервером | **GraphQL** |
| Бэкенд-сервисы | **Zuul** (API-шлюз), **Eureka** (обнаружение сервисов), **Spring Boot** |
| Базы данных | **EVCache**, **Cassandra**, **CockroachDB** |
| Сообщения и потоки | **Apache Kafka** и **Flink** |
| Хранение видео | **Amazon S3** и **Open Connect** |
| Обработка данных | **Flink** и **Spark**, **Tableau** для визуализации, **Redshift** для хранилища структурированных данных |
| CI/CD | **JIRA, Confluence, PagerDuty, Jenkins, Gradle, Chaos Monkey, Spinnaker, Atlas** |
- **Open Connect** — собственная **сеть доставки контента (CDN)** Netflix: кэширующие серверы рядом со зрителями отдают видео, а мастер-копии хранятся в S3.
@diagram cc-cdn
- **Chaos Monkey** намеренно отключает случайные рабочие инстансы, чтобы доказать, что система переживает сбои; **Spinnaker** — платформа непрерывной доставки (continuous delivery) для развёртывания в облако; **Atlas** собирает метрики мониторинга.
![Сервер Netflix Open Connect Appliance: стоечный сервер с ярко-красной передней панелью и белым логотипом Netflix среди других серверов в стойке дата-центра интернет-провайдера](/events/cc/l5-netflix-open-connect-appliance.webp)
> Облако — стратегический выбор, а не догма: Spotify переехала в облако, чтобы освободить инженеров для инноваций, а Dropbox вывела большую часть файлов, потому что при её размере своё хранилище дешевле.
?? Почему Dropbox увела большую часть файлов из Amazon S3 и почему это не совет для всех?
?= Росли затраты на хранение, хотелось больше контроля, и пугала зависимость от Amazon, которая готовила конкурирующий сервис (WorkDocs). Это окупается только для бизнеса, достаточно крупного, чтобы построить свою огромную сеть.
?? Как Spotify организовала переезд в Google Cloud Platform?
?= Два года подготовки с выделенной командой Spotify/Google, затем сервисы и данные перенесли примерно за год каждую часть, сервисы — сосредоточенными двухнедельными спринтами.`,
      },
      [
        qx("Which theme does the American Airlines case study illustrate in the lecture?", "Better customer service", [
          ["Removing barriers to innovation", "That is the theme of the Spotify case study.", "Это тема кейса Spotify."],
          ["Demand for enterprise scale", "That is the theme of the Dropbox case study.", "Это тема кейса Dropbox."],
          ["Reducing vendor lock-in", "Lock-in worries belong to the Dropbox story, and it is not one of the named themes.", "Опасения насчёт зависимости от вендора — из истории Dropbox, и это не одна из названных тем."],
        ], "American Airlines moved to the cloud to respond faster to customer needs and improve digital self-service.", "American Airlines перешла в облако, чтобы быстрее реагировать на запросы клиентов и улучшить цифровое самообслуживание."),
        qx("American Airlines moved its customer-facing applications from which architecture to which?", "From monolithic code to cloud-native microservices", [
          ["From cloud microservices back to a single monolith", "The move went the other way: away from the monolith.", "Переход был в обратную сторону — от монолита."],
          ["From the public cloud back to a private mainframe", "American Airlines moved into the cloud, not out of it.", "American Airlines перешла в облако, а не ушла из него."],
          ["From mobile apps to desktop-only client software", "Digital channels and self-service were the goal, so mobile apps were not dropped.", "Целью были цифровые каналы и самообслуживание, мобильные приложения никто не убирал."],
        ], "It removed the constraints of its monolithic apps by rebuilding them as cloud-native microservices.", "Ограничения монолитных приложений сняли, переписав их как облачные (cloud-native) микросервисы."),
        qx("Which result did American Airlines get from its move to the cloud?", "Faster development and release of new apps", [
          ["Removal of all its digital self-service tools", "Self-service tools were expanded, not removed; delivering them faster was the goal.", "Инструменты самообслуживания расширили, а не убрали; цель была выпускать их быстрее."],
          ["A return to its original monolithic code base", "The monolith was the problem it moved away from.", "Монолит был проблемой, от которой компания уходила."],
          ["Higher costs for upgrading its old systems", "The opposite: it saved money by avoiding the upgrade costs of the old systems.", "Наоборот: компания сэкономила, избежав затрат на обновление старых систем."],
        ], "Results: faster app releases, better reliability, productivity and response times, and cost savings.", "Итоги: быстрее выпуск приложений, выше надёжность, производительность и скорость ответа, плюс экономия."),
        qx("Why did Spotify decide to leave its own in-house data centers?", "They were hard to run and distracted engineers", [
          ["Its music streaming licence expired in 2015", "Licensing was not the issue; 2015 is when migration planning started.", "Дело не в лицензиях; 2015 год — это начало планирования переезда."],
          ["Amazon was launching a competing music service", "A competing Amazon service is the Dropbox story (WorkDocs), not Spotify's.", "Конкурирующий сервис Amazon — это история Dropbox (WorkDocs), а не Spotify."],
          ["Regulators banned private data centers in Sweden", "No such ban existed; the reason was focus on the product.", "Такого запрета не было; причина — сосредоточиться на продукте."],
        ], "The data centers were hard to provision and maintain and did not serve the goal of being the best music service, so Spotify wanted its engineers free to innovate.", "Собственные ЦОД было трудно разворачивать и обслуживать, и они не помогали стать лучшим музыкальным сервисом, поэтому Spotify хотела освободить инженеров для инноваций."),
        qx("Which cloud provider did Spotify migrate to, and when did planning start?", "Google Cloud Platform, in 2015", [
          ["Amazon Web Services, in 2010", "Spotify chose Google, not AWS; AWS appears in the Dropbox and Netflix stories.", "Spotify выбрала Google, а не AWS; AWS — в историях Dropbox и Netflix."],
          ["Microsoft Azure Cloud, in 2016", "Azure is not part of the Spotify case; planning started in 2015.", "Azure не связан с кейсом Spotify; планирование началось в 2015 году."],
          ["IBM Cloud Platform, in 2018", "Neither the provider nor the year matches; it was GCP and 2015.", "Не совпадают ни провайдер, ни год: это GCP и 2015."],
        ], "Spotify started planning its migration to Google Cloud Platform (GCP) in 2015.", "Spotify начала планировать переезд на Google Cloud Platform (GCP) в 2015 году."),
        qx("How long did Spotify spend preparing before the migration itself began?", "Two years", [
          ["Two weeks", "Two weeks is the length of each services sprint, not of the preparation.", "Две недели — длина одного спринта по сервисам, а не подготовки."],
          ["Six months", "Preparation took much longer: two full years.", "Подготовка заняла гораздо больше — два полных года."],
          ["Five years", "Too long; the preparation took two years, and each migration part about a year.", "Слишком много: подготовка — два года, а каждая часть переезда — около года."],
        ], "Spotify invested two years in preparation with a dedicated Spotify/Google migration team.", "Spotify потратила два года на подготовку с выделенной командой Spotify/Google."),
        qx("Spotify split its migration effort into which two parts?", "Services and data", [
          ["Frontend and backend", "The split was by what moves, services and data, not by application tier.", "Делили по тому, что переносят, — сервисы и данные, а не по уровням приложения."],
          ["Europe and the US", "A geographic split is the Dropbox story: in-house in the US, AWS in Europe.", "Деление по географии — это Dropbox: свои серверы в США, AWS в Европе."],
          ["Music and podcasts", "Content types were not the split; services and data each took about a year.", "Делили не по типу контента; сервисы и данные заняли примерно по году."],
        ], "The two parts, services and data, took about a year each.", "Две части — сервисы и данные — заняли примерно по году."),
        qx("How did Spotify's engineering teams move their services to GCP?", "In focused two-week sprints, pausing product work", [
          ["In one weekend cut-over of the whole platform", "Moving the services alone took about a year, not one weekend.", "Только сервисы переносили около года, а не за одни выходные."],
          ["Slowly over ten years, while shipping new features", "They paused product development to finish faster; it was not a decade-long effort.", "Разработку продукта приостановили, чтобы закончить быстрее; переезд не растянулся на десять лет."],
          ["By outsourcing all services to Google engineers", "A joint Spotify/Google team oversaw the work, but Spotify's own teams moved their services.", "Совместная команда Spotify/Google руководила процессом, но сервисы переносили сами команды Spotify."],
        ], "Teams moved services in focused two-week sprints and paused product development meanwhile.", "Команды переносили сервисы сосредоточенными двухнедельными спринтами, приостановив разработку продукта."),
        qx("During Spotify's data migration, what choice did each team have?", "Forklift the data or rewrite it", [
          ["Delete the data or archive it to tape", "Data was moved to the cloud, not deleted or archived to tape.", "Данные переносили в облако, а не удаляли и не архивировали на ленту."],
          ["Keep data on-premise or buy new disks", "The goal was to leave on-premise, so keeping data there was not the option.", "Цель — уйти с собственных площадок, так что оставлять данные там не предлагалось."],
          ["Encrypt the data or make it public", "Making data public was never an option; the choice was about how to move it.", "Публиковать данные никто не предлагал; выбор был в том, как их переносить."],
        ], "Teams could 'forklift' (lift and shift the data as it is) or rewrite it, whichever fit their needs.", "Команды могли сделать «forklift» — перенести данные как есть (lift and shift) — или переписать их, как им удобнее."),
        qx("A company plans a big migration. Which Spotify lesson says the engineers must first support the vision?", "Gaining stakeholder buy-in is crucial", [
          ["Size matters for in-house infrastructure", "That is a Dropbox lesson about when leaving the cloud pays off.", "Это урок Dropbox о том, когда уход из облака окупается."],
          ["On-premise may still be right for some", "That is also a Dropbox lesson, and it is not about winning over engineers.", "Это тоже урок Dropbox, и он не о поддержке инженеров."],
          ["Migrate as fast as possible, skip planning", "Spotify's lesson is the opposite: preparation shouldn't be rushed.", "Урок Spotify обратный: подготовку нельзя торопить."],
        ], "Spotify consulted its engineers; once they saw their future jobs, they became all-in advocates.", "Spotify советовалась со своими инженерами; увидев свою будущую работу, они стали горячими сторонниками."),
        tfx("One lesson from Spotify is that migration preparation should be kept short so that product work can resume quickly.", false,
          "The lesson is the opposite: preparation shouldn't be rushed. Spotify spent two years, mapped all dependencies and built the business case.",
          "Урок обратный: подготовку нельзя торопить. Spotify потратила два года, описала все зависимости и обосновала выгоду для бизнеса.",
          "'True' is wrong: rushing the preparation is exactly what Spotify warns against.",
          "«Верно» — ошибка: торопить подготовку — как раз то, от чего предостерегает Spotify."),
        qx("Before its move, how did Dropbox split its storage?", "File data on Amazon S3, metadata on-premise", [
          ["Metadata on Amazon S3, file data on-premise", "It was the reverse: the bulky file data lived in S3, the metadata in-house.", "Наоборот: объёмные файлы хранились в S3, а метаданные — у себя."],
          ["Everything on Google Cloud Storage", "Google Cloud is the Spotify story; Dropbox used Amazon S3.", "Google Cloud — это история Spotify; Dropbox пользовалась Amazon S3."],
          ["Everything in its own data centers", "If everything were in-house already, there would have been no move back from S3.", "Если бы всё уже было у себя, не было бы и переезда из S3."],
        ], "Dropbox kept the file data in Amazon S3 (Simple Storage Service) and the metadata on-premise.", "Dropbox хранила файлы в Amazon S3 (Simple Storage Service), а метаданные — на своих серверах."),
        qx("Which two concerns made Dropbox fear becoming overly dependent on Amazon?", "Rising storage costs and Amazon's rival WorkDocs", [
          ["Frequent AWS outages and very slow S3 uploads in Europe", "Reliability was not the reason; Dropbox even kept AWS in Europe.", "Надёжность не была причиной; в Европе Dropbox даже осталась на AWS."],
          ["Strict US privacy laws and export controls", "Laws were not mentioned; the concerns were cost and competition.", "О законах речи нет; опасения касались затрат и конкуренции."],
          ["Lack of S3 regions in the United States", "S3 is available in the US; the move was about cost and control.", "S3 в США есть; переезд был ради затрат и контроля."],
        ], "Costs grew with storage needs, and Amazon was planning a similar service, Amazon WorkDocs.", "Затраты росли вместе с объёмом хранения, а Amazon готовила похожий сервис — Amazon WorkDocs."),
        qx("What share of its files did Dropbox move back to its own servers?", "About 90%", [
          ["About 10%", "Only a small part stayed on AWS, mainly for Europe; most files moved.", "На AWS осталась лишь малая часть, в основном для Европы; большинство файлов переехало."],
          ["About 50%", "Far more than half moved: about 90%.", "Переехало гораздо больше половины — около 90%."],
          ["All 100%", "Not all of them: Dropbox kept AWS in Europe as the best fit there.", "Не все: в Европе Dropbox оставила AWS как лучший вариант."],
        ], "Dropbox moved about 90% of its files to its own custom-built infrastructure.", "Dropbox перенесла около 90% файлов на собственную инфраструктуру."),
        qx("In which region did Dropbox decide that AWS was still the best fit?", "In Europe", [
          ["In the United States", "The US is where Dropbox built its in-house network.", "Именно в США Dropbox построила собственную сеть."],
          ["In Asia-Pacific", "The lecture names Europe, not Asia-Pacific.", "В лекции названа Европа, а не Азиатско-Тихоокеанский регион."],
          ["Nowhere at all", "Dropbox did keep AWS in one region, so its result is hybrid.", "Dropbox всё же оставила AWS в одном регионе, так что итог гибридный."],
        ], "Dropbox went in-house in the US but judged AWS still the best fit in Europe.", "Dropbox перешла на свои серверы в США, но решила, что в Европе лучше остаться на AWS."),
        qx("What did Dropbox's expanded in-house capabilities allow it to offer?", "Project Infinite", [
          ["Amazon WorkDocs", "WorkDocs is Amazon's competing service, one of the reasons Dropbox left.", "WorkDocs — конкурирующий сервис Amazon, одна из причин ухода Dropbox."],
          ["Google Cloud Platform", "GCP is the platform Spotify moved to, not a Dropbox product.", "GCP — платформа, на которую переехала Spotify, а не продукт Dropbox."],
          ["Chaos Monkey", "Chaos Monkey is a Netflix tool for testing resilience.", "Chaos Monkey — инструмент Netflix для проверки устойчивости."],
        ], "Project Infinite gives desktop users universal compatibility and unlimited real-time data access.", "Project Infinite даёт пользователям настольных компьютеров универсальную совместимость и неограниченный доступ к данным в реальном времени."),
        qx("A mid-size startup wants to copy Dropbox and leave the cloud. What does the 'size matters' lesson warn?", "Only very large firms can justify in-house networks", [
          ["Cloud providers legally forbid customers from leaving them", "Customers can leave; the warning is about cost and risk, not law.", "Уйти можно; предупреждение о затратах и риске, а не о законе."],
          ["Smaller firms always save money by leaving", "The lesson says the opposite: for smaller firms it is a huge risk.", "Урок говорит обратное: для небольших компаний это огромный риск."],
          ["In-house servers are cheaper at every scale", "Only at very large scale may in-house beat the provider's margin.", "Лишь при очень большом масштабе свои серверы могут оказаться дешевле наценки провайдера."],
        ], "Cloud businesses are not charities, but a massive in-house network only pays off for a business big enough, and it is risky if growth stalls.", "Облачные компании не благотворительность, но своя огромная сеть окупается только у достаточно крупного бизнеса и рискованна, если рост остановится."),
        qx("In Netflix's tech stack, what is Open Connect used for?", "Storing and delivering video to viewers", [
          ["Service discovery between backend services", "Service discovery is done by Eureka.", "Обнаружение сервисов выполняет Eureka."],
          ["Testing resilience by killing instances", "Killing instances to test resilience is the job of Chaos Monkey.", "Отключать инстансы для проверки устойчивости — задача Chaos Monkey."],
          ["Communication between frontend and server", "Frontend/server communication uses GraphQL.", "Связь фронтенда с сервером идёт через GraphQL."],
        ], "Together with S3, Open Connect, Netflix's own CDN, stores and delivers the video library to screens.", "Вместе с S3 Open Connect — собственная CDN Netflix — хранит и доставляет видеобиблиотеку на экраны."),
        qx("Which Netflix tool deliberately terminates production instances to test resilience?", "Chaos Monkey", [
          ["Apache Kafka", "Kafka handles real-time messaging and streaming.", "Kafka отвечает за обмен сообщениями и потоки в реальном времени."],
          ["Spinnaker", "Spinnaker is a continuous-delivery platform for deployments.", "Spinnaker — платформа непрерывной доставки для развёртываний."],
          ["Eureka", "Eureka is the service-discovery component of the backend.", "Eureka — компонент обнаружения сервисов в бэкенде."],
        ], "Chaos Monkey, part of Netflix's CI/CD toolset, kills random instances so engineers can prove the system survives failures.", "Chaos Monkey из набора CI/CD Netflix отключает случайные инстансы, чтобы доказать, что система переживает сбои."),
        qx("Which databases appear in Netflix's tech stack?", "EVCache, Cassandra and CockroachDB", [
          ["Zuul, Eureka and the Spring Boot framework", "These are backend service components, not databases.", "Это компоненты бэкенд-сервисов, а не базы данных."],
          ["Swift, Kotlin and the React web framework", "These are mobile and web front-end technologies.", "Это технологии мобильных приложений и веба."],
          ["Jenkins, Gradle and the Spinnaker tool", "These are CI/CD tools, not data stores.", "Это инструменты CI/CD, а не хранилища данных."],
        ], "Netflix stores data in EVCache, Cassandra, CockroachDB and other systems.", "Netflix хранит данные в EVCache, Cassandra, CockroachDB и других системах."),
      ],
    ),
    part(
      "cc-l5-p3",
      { en: "IoT, AI and blockchain on the cloud", ru: "IoT, AI и блокчейн в облаке" },
      {
        en: `## Emerging technologies and the cloud
Technologies such as the **Internet of Things (IoT)**, **Big Data**, **Artificial Intelligence (AI)** and **blockchain** are **disrupting existing business models** and industries, while creating unprecedented opportunities for businesses to differentiate themselves and create value for their clients.
The **power, scale, dynamic nature and economics** of cloud resources make cloud computing a **key enabler** for the adoption and evolution of these technologies.
## Internet of Things in the cloud
The **Internet of Things (IoT)** is a giant network of **connected things and people**. It has changed how we drive, make purchases, monitor our personal health and even get energy for our homes. **Smart devices and sensors** continuously track and collect data.
**Smart building example:** a building can have **thousands of sensors** measuring **thermal, optical, structural and environmental** stimuli. Such an unprecedented amount of data puts a tremendous strain on the Internet, and that is where the cloud comes in.
![A modern glass office building at dusk with small wireless sensors on its walls, windows and roof, and a tablet in the foreground showing a building dashboard with temperature, light, vibration and air-quality readings](/events/cc/l5-smart-building-sensors.webp)
The cloud connects the IoT device user to the cloud for:
- **device registration**;
- **device identity**;
- **storing data**;
- **accessing enterprise data**.
## Why IoT data goes to the cloud
- IoT devices can be **in motion**, so the cloud serves as the **collection point in closest proximity**; this **minimizes latency** both when data points are reported and when a response is sent back to the IoT application.
- Cloud supports IoT end to end: **IoT platforms** running entirely on the cloud, the **interfaces** customers use to interact with the devices, and the **backend analytics platforms**.
- Cloud service providers offer **specialized IoT services** that speed up the development of IoT solutions.
| Area where cloud and IoT meet | Examples |
|---|---|
| Industrial, transport, environmental, healthcare | factories, connected cars, recycling, heart-rate monitors |
| Electronic devices and wearables | phones, computers, smart watches, smart glasses, game controllers |
| Smart city | ambulances, CO2 sensors, traffic lights, charging stations |
| Home automation | lighting, heating, thermostats, water-leak sensors |
## AI, IoT and the cloud: a three-way relationship
Making sense of endless streams of data is where **Artificial Intelligence (AI)** comes in. Many of today's AI applications would not be possible without the **scalable, on-demand computing** offered by the cloud.
- **AI acts on the data** produced by IoT devices.
- **IoT devices' behaviour** can be dictated by **AI responses**.
- The **cloud provides scalable, on-demand resources** for both.
Example: a **smart assistant**, a common IoT device, learns the user's preferences as usage grows (favourite songs, home temperature settings, preferred meal times) and over time learns to **anticipate** actions and give insights.
The result is a **symbiotic relationship**: **IoT delivers the data, AI powers the insights**, and both leverage the cloud's **scalability and processing power**.
## AI on the cloud: AWS AI and ML services
**Amazon Web Services** offers a range of AI services built on Amazon's internal experience with AI and machine learning. The lecture groups them by the type of data they process: **audio, tabular, text, image** or all data.
| Service | Data | Use cases |
|---|---|---|
| Amazon SageMaker | all data | build and train your own ML models: regression, classification, clustering, image classification and segmentation |
| Amazon Rekognition | image, video | object and text detection, image moderation, activity detection in video |
| Amazon Comprehend | text | sentiment analysis, topic modeling, key-phrase extraction, entity detection, classification |
| Amazon Textract | documents | document extraction and redaction, table extraction |
| Amazon Lex | text, voice | conversational chatbots, BI chatbots |
| Amazon Polly | text to speech | converting a blog to a podcast, text dictation |
| Amazon Transcribe | speech to text | transcripts, content redaction, vocabulary filtering |
| Amazon Personalize | tabular | recommendations and personalization |
| Amazon Forecast | tabular | retail and demand forecasting |
@diagram cc-service-models
Most of these are **ready-made AI services called through an API**: the provider runs the models and the infrastructure, which is close to **SaaS**. **SageMaker** is a platform for building your own models, which is closer to **PaaS**.
Advantages of using AI in the cloud:
- the best infrastructure for **training and inference** of AI models;
- **monitoring and maintenance** of the infrastructure, ensuring **high availability**;
- **security** of apps and services;
- **scaling up and down** as necessary;
- availability **as a microservice or as an API**;
- readiness for **performance-critical** operations.
![Screenshot of the AWS Management Console services menu with the Machine Learning section open, listing Amazon SageMaker, Amazon Rekognition, Amazon Comprehend, Amazon Lex, Amazon Polly and Amazon Transcribe](/events/cc/l5-aws-ai-services-console.webp)
## O'Reilly survey (2020)
AI efforts are **maturing from prototype to production**, but **company support** and an **AI/ML skills gap** remain obstacles.
| Main bottleneck holding back AI adoption | Share of answers (approx.) |
|---|---|
| Company culture does not yet recognize the need for AI | about 22% (top answer) |
| Difficulties identifying appropriate business use cases | about 20% |
| Lack of skilled people, difficulty hiring the required roles | about 17% |
| Lack of data or data-quality issues | about 16% |
| Technical infrastructure challenges | about 7% |
| Legal concerns, risks or compliance issues | about 3% |
Deep learning applications respondents are most interested in: **computer vision** (13%), **text mining** (11%), enhancing existing data analytics and ML systems (9%); finance and forecasting 3% each, health and medicine and speech technologies 2% each.
## Blockchain and the cloud
**Blockchain** is a **secure, distributed, open** technology that speeds up processes, lowers costs and builds **transparency and traceability** in transactional applications. It is an **immutable network** in which members view **only the transactions relevant to them**. The more open, diverse and distributed the network, the stronger the trust and transparency.
- **85%** of businesses today rely on **multiple clouds** to meet their IT needs.
- **More than 70%** use **more than three** clouds.
- Businesses must move apps and data across clouds easily and securely, so there is growing demand to build and manage apps such as blockchain for the **multicloud** environment.
Blockchain, AI and cloud form another **three-way relationship**:
- **Blockchain** — the trusted, **decentralized source of truth**.
- **AI** — powers the **analytics and decision-making** from the data collected.
- **Cloud** — **globally distributed, scalable and cost-efficient** computing resources for the huge data volumes and processing both need.
**How blockchain benefits AI:** blockchain **records the data and variables** that go into a decision made by an AI algorithm, which gives **greater trust and transparency** in AI conclusions and decisions.
Example from the lecture summary: blockchain on the cloud helps **farmers reduce waste** by building **traceability and transparency in the food supply chain**.
## Analytics on the cloud
Analytics technologies leverage the cloud's **flexibility, scalability and computing resources**:
- **tracking trends on social media** to predict future events;
- **analyzing data to build machine learning models** used in cognitive applications;
- **data analytics and predictive maintenance** solutions for city infrastructure, based on cloud and IoT.
The cloud provides the integrated environment needed to use data for **continuous improvement** and accelerated business growth.
> IoT delivers the data, AI powers the insights, blockchain makes the data trustworthy, and the cloud gives all three the scale and processing power they need.
?? Why is the cloud a good collection point for data from IoT devices that are in motion?
?= It is the collection point in closest proximity, so data goes up and responses come back with minimal latency.
?? How does blockchain make AI more trustworthy, according to the lecture?
?= It records the data and variables that went into each AI decision, so the conclusions are transparent and can be traced.`,
        ru: `## Новые технологии и облако
Такие технологии, как **Internet of Things (IoT, интернет вещей)**, **Big Data**, **Artificial Intelligence (AI, искусственный интеллект)** и **blockchain (блокчейн)**, **ломают существующие бизнес-модели (disrupting business models)** и отрасли и одновременно открывают небывалые возможности выделиться и создать ценность для клиентов.
**Мощность, масштаб, динамичность и экономика** облачных ресурсов делают облако **ключевым драйвером (key enabler)** внедрения и развития этих технологий.
## Интернет вещей в облаке
**Internet of Things (IoT)** — гигантская сеть **связанных между собой вещей и людей**. Она изменила то, как мы водим машину, делаем покупки, следим за здоровьем и даже получаем энергию для дома. **Умные устройства и датчики (sensors)** постоянно отслеживают и собирают данные.
**Пример — умное здание (smart building):** в здании могут быть **тысячи датчиков**, измеряющих **тепловые, оптические, структурные и экологические (thermal, optical, structural, environmental)** воздействия. Такой небывалый объём данных сильно нагружает интернет — и здесь на помощь приходит облако.
![Современное стеклянное офисное здание в сумерках с небольшими беспроводными датчиками на стенах, окнах и крыше; на переднем плане планшет с панелью здания: температура, освещённость, вибрация и качество воздуха](/events/cc/l5-smart-building-sensors.webp)
Облако подключает пользователя IoT-устройства для:
- **регистрации устройств (device registration)**;
- **идентификации устройств (device identity)**;
- **хранения данных (storing data)**;
- **доступа к корпоративным данным (accessing enterprise data)**.
## Почему данные IoT идут в облако
- IoT-устройства могут **двигаться**, поэтому облако служит **ближайшей точкой сбора (collection point in closest proximity)**; это **снижает задержку (latency)** и при отправке данных, и при возврате ответа IoT-приложению.
- Облако поддерживает IoT целиком: **IoT-платформы**, полностью работающие в облаке, **интерфейсы**, через которые клиенты управляют устройствами, и **бэкенд-платформы аналитики**.
- Облачные провайдеры предлагают **специализированные IoT-сервисы**, которые ускоряют разработку IoT-решений.
| Где встречаются облако и IoT | Примеры |
|---|---|
| Промышленность, транспорт, экология, здравоохранение | заводы, подключённые автомобили, переработка отходов, пульсометры |
| Электроника и носимые устройства | телефоны, компьютеры, умные часы, умные очки, игровые контроллеры |
| Умный город | скорая помощь, датчики CO2, светофоры, зарядные станции |
| Домашняя автоматизация | освещение, отопление, термостаты, датчики протечки |
## AI, IoT и облако: тройная связь
Разобраться в бесконечных потоках данных помогает **Artificial Intelligence (AI)**. Многие современные применения AI были бы невозможны без **масштабируемых вычислений по требованию (scalable, on-demand computing)**, которые даёт облако.
- **AI работает с данными**, которые производят IoT-устройства.
- **Поведение IoT-устройств** может определяться **ответами AI**.
- **Облако даёт масштабируемые ресурсы по требованию** для обоих.
Пример: **умный ассистент (smart assistant)**, распространённое IoT-устройство, по мере использования изучает предпочтения пользователя (любимые песни, температуру дома, привычное время еды) и со временем учится **предугадывать** действия и подсказывать.
Итог — **симбиоз (symbiotic relationship)**: **IoT поставляет данные, AI даёт выводы (insights)**, и оба используют **масштабируемость и вычислительную мощность** облака.
## AI в облаке: сервисы AI и ML от AWS
**Amazon Web Services** предлагает набор AI-сервисов, построенных на собственном опыте Amazon в AI и машинном обучении. В лекции они сгруппированы по типу обрабатываемых данных: **аудио, табличные данные, текст, изображения** или любые данные.
| Сервис | Данные | Применение |
|---|---|---|
| Amazon SageMaker | любые данные | создание и обучение своих ML-моделей: регрессия, классификация, кластеризация, классификация и сегментация изображений |
| Amazon Rekognition | изображения, видео | распознавание объектов и текста, модерация изображений, распознавание действий на видео |
| Amazon Comprehend | текст | анализ тональности (sentiment), выделение тем и ключевых фраз, распознавание сущностей, классификация |
| Amazon Textract | документы | извлечение данных из документов и скрытие конфиденциального (redaction), извлечение таблиц |
| Amazon Lex | текст, голос | диалоговые чат-боты, BI-боты |
| Amazon Polly | текст в речь | превратить блог в подкаст, озвучить текст |
| Amazon Transcribe | речь в текст | расшифровки, скрытие конфиденциального, фильтрация слов |
| Amazon Personalize | табличные | рекомендации и персонализация |
| Amazon Forecast | табличные | прогноз продаж и спроса |
@diagram cc-service-models
Большинство из них — **готовые AI-сервисы, вызываемые через API**: модели и инфраструктуру ведёт провайдер, это близко к **SaaS**. **SageMaker** — платформа для создания своих моделей, это ближе к **PaaS**.
Преимущества AI в облаке:
- лучшая инфраструктура для **обучения и инференса (training and inference)** моделей;
- **мониторинг и обслуживание** инфраструктуры с **высокой доступностью (high availability)**;
- **безопасность** приложений и сервисов;
- **масштабирование вверх и вниз** по необходимости;
- доступность **как микросервис или API**;
- готовность к **критичным по производительности (performance-critical)** операциям.
![Снимок экрана AWS Management Console: меню сервисов с открытым разделом Machine Learning, где перечислены Amazon SageMaker, Amazon Rekognition, Amazon Comprehend, Amazon Lex, Amazon Polly и Amazon Transcribe](/events/cc/l5-aws-ai-services-console.webp)
## Опрос O'Reilly (2020)
Проекты AI **переходят от прототипа к продакшну (from prototype to production)**, но **поддержка со стороны компании** и **нехватка навыков AI/ML (skills gap)** остаются препятствиями.
| Главное препятствие для внедрения AI | Доля ответов (примерно) |
|---|---|
| Корпоративная культура пока не видит потребности в AI | около 22% (самый частый ответ) |
| Трудно найти подходящие бизнес-сценарии (use cases) | около 20% |
| Нехватка специалистов, трудно нанять на нужные роли | около 17% |
| Нехватка данных или проблемы с их качеством | около 16% |
| Сложности с технической инфраструктурой | около 7% |
| Юридические вопросы, риски, соответствие требованиям | около 3% |
Применения deep learning, которые больше всего интересуют респондентов: **компьютерное зрение (computer vision)** — 13%, **анализ текста (text mining)** — 11%, улучшение существующей аналитики и ML-систем — 9%; финансы и прогнозирование — по 3%, медицина и речевые технологии — по 2%.
## Блокчейн и облако
**Blockchain** — **защищённая, распределённая, открытая** технология, которая ускоряет процессы, снижает затраты и даёт **прозрачность и отслеживаемость (transparency, traceability)** в транзакционных приложениях. Это **неизменяемая сеть (immutable network)**, в которой участники видят **только относящиеся к ним транзакции**. Чем сеть открытее, разнообразнее и распределённее, тем сильнее доверие и прозрачность.
- **85%** компаний сегодня опираются на **несколько облаков (multiple clouds)** для своих ИТ-задач.
- **Более 70%** используют **больше трёх** облаков.
- Компаниям нужно легко и безопасно переносить приложения и данные между облаками, поэтому растёт спрос на создание и сопровождение приложений вроде блокчейна для **мультиоблачной (multicloud)** среды.
Блокчейн, AI и облако образуют ещё одну **тройную связь**:
- **Blockchain** — доверенный **децентрализованный источник истины (source of truth)**.
- **AI** — отвечает за **аналитику и принятие решений** на основе собранных данных.
- **Облако** — **глобально распределённые, масштабируемые и экономичные** вычислительные ресурсы для огромных объёмов данных и обработки, которые нужны обоим.
**Как блокчейн помогает AI:** блокчейн **записывает данные и переменные**, на которых основано решение алгоритма AI, и это даёт **больше доверия и прозрачности** в выводах и решениях AI.
Пример из итогов лекции: блокчейн в облаке помогает **фермерам сокращать потери**, обеспечивая **отслеживаемость и прозрачность в цепочке поставок продуктов**.
## Аналитика в облаке
Аналитические технологии используют **гибкость, масштабируемость и вычислительные ресурсы** облака:
- **отслеживание трендов в соцсетях**, чтобы предсказывать будущие события;
- **анализ данных для построения моделей машинного обучения** в когнитивных приложениях;
- решения для **аналитики данных и предиктивного обслуживания (predictive maintenance)** городской инфраструктуры на основе облака и IoT.
Облако даёт единую среду, нужную, чтобы использовать данные для **постоянного улучшения** и ускоренного роста бизнеса.
> IoT поставляет данные, AI даёт выводы, блокчейн делает данные достойными доверия, а облако даёт всем троим масштаб и вычислительную мощность.
?? Почему облако — хорошая точка сбора данных от IoT-устройств, которые находятся в движении?
?= Это ближайшая точка сбора: данные уходят, а ответы возвращаются с минимальной задержкой.
?? Как, согласно лекции, блокчейн делает AI более достойным доверия?
?= Он записывает данные и переменные, на которых основано каждое решение AI, поэтому выводы прозрачны и их можно проследить.`,
      },
      [
        qx("In the smart building example, which four kinds of stimuli do the sensors measure?", "Thermal, optical, structural, environmental", [
          ["Audio, video, financial and legal", "Financial and legal data are not physical stimuli measured by building sensors.", "Финансовые и юридические данные — не физические воздействия, которые измеряют датчики здания."],
          ["Network traffic, storage, compute and memory use", "These are IT metrics, not the building stimuli shown on the slide.", "Это ИТ-метрики, а не воздействия на здание со слайда."],
          ["Price, demand, stock and delivery", "These are retail metrics; smart building sensors measure physical conditions.", "Это показатели торговли; датчики умного здания измеряют физические условия."],
        ], "A smart building can have thousands of sensors for thermal, optical, structural and environmental stimuli.", "В умном здании могут быть тысячи датчиков тепловых, оптических, структурных и экологических воздействий."),
        qx("Which of these does the lecture list as a reason to connect IoT devices to the cloud?", "Device registration and device identity", [
          ["Replacing sensors with manual meter readings", "IoT is about automatic sensor data, not manual readings.", "IoT — это автоматические данные датчиков, а не ручное снятие показаний."],
          ["Removing the need to store any device data", "Storing data is itself one of the listed reasons.", "Хранение данных само входит в список причин."],
          ["Blocking access to enterprise data", "The opposite: the cloud gives IoT users access to enterprise data.", "Наоборот: облако даёт IoT-пользователям доступ к корпоративным данным."],
        ], "Cloud connects IoT users for device registration, device identity, storing data and accessing enterprise data.", "Облако нужно IoT для регистрации устройств, их идентификации, хранения данных и доступа к корпоративным данным."),
        qx("IoT devices are often in motion. Why does that make the cloud a good collection point for their data?", "It is the closest collection point, cutting latency", [
          ["It stores data only on the device itself", "Data is sent to the cloud, not kept only on the device.", "Данные отправляются в облако, а не остаются только на устройстве."],
          ["It keeps devices offline to save battery", "Devices stay connected; the cloud's value is a nearby, always-on collection point.", "Устройства остаются на связи; ценность облака — близкая и всегда доступная точка сбора."],
          ["It forces every reading through one central office server", "A single central server would add latency, the opposite of the cloud's role.", "Один центральный сервер добавил бы задержку — противоположность роли облака."],
        ], "Moving devices report to the nearest cloud location, so data goes up and responses come back with minimal latency.", "Движущиеся устройства отправляют данные в ближайшую точку облака, и данные и ответы идут с минимальной задержкой."),
        qx("Which statement describes the symbiotic relationship between IoT, AI and the cloud?", "IoT delivers data, AI powers insights, cloud scales both", [
          ["AI delivers data, IoT powers insights, cloud stores logs", "The roles are swapped: IoT produces the data and AI turns it into insights.", "Роли перепутаны: данные даёт IoT, а выводы из них делает AI."],
          ["Cloud delivers data, IoT trains AI, AI replaces cloud", "AI does not replace the cloud; it relies on the cloud's processing power.", "AI не заменяет облако — он опирается на его вычислительную мощность."],
          ["IoT replaces AI, and cloud is used only for backups", "IoT and AI complement each other, and the cloud does far more than backups.", "IoT и AI дополняют друг друга, а облако делает гораздо больше, чем резервное копирование."],
        ], "IoT delivers the data, AI powers the insights, and both use the cloud's scalability and processing power.", "IoT поставляет данные, AI даёт выводы, и оба используют масштабируемость и вычислительную мощность облака."),
        qx("A smart speaker learns which songs a user likes and when they usually eat, then starts suggesting them. Which idea does this show?", "IoT behaviour shaped by AI learning over time", [
          ["Blockchain recording each song as a transaction", "Nothing here needs an immutable ledger; it is about learning preferences.", "Неизменяемый реестр здесь не нужен; речь об изучении предпочтений."],
          ["Big data stored only on the local device", "The learning relies on cloud-scale AI, not on local storage alone.", "Обучение опирается на AI в облаке, а не только на локальное хранение."],
          ["Edge hardware fully replacing cloud computing", "The lecture shows IoT, AI and cloud working together, not devices replacing the cloud.", "В лекции IoT, AI и облако работают вместе, а не устройства заменяют облако."],
        ], "Smart assistants learn preferences over time and anticipate actions: AI acts on IoT data, and the device behaves according to AI responses.", "Умные ассистенты со временем изучают предпочтения и предугадывают действия: AI работает с данными IoT, а устройство действует по ответам AI."),
        qx("A developer wants to add a conversational chatbot to an app. Which AWS AI service fits best?", "Amazon Lex", [
          ["Amazon Polly", "Polly turns text into speech; it does not hold a conversation.", "Polly превращает текст в речь, но не ведёт диалог."],
          ["Amazon Forecast", "Forecast predicts demand from historical data.", "Forecast прогнозирует спрос по историческим данным."],
          ["Amazon Textract", "Textract extracts text and tables from documents.", "Textract извлекает текст и таблицы из документов."],
        ], "Amazon Lex builds conversational chatbots, including BI chatbots.", "Amazon Lex создаёт диалоговых чат-ботов, в том числе BI-ботов."),
        qx("A blogger wants every post turned into a spoken podcast episode. Which AWS AI service fits?", "Amazon Polly", [
          ["Amazon Transcribe", "Transcribe does the reverse: it turns speech into text.", "Transcribe делает обратное — превращает речь в текст."],
          ["Amazon Comprehend", "Comprehend analyses the meaning of text, such as sentiment; it does not speak.", "Comprehend анализирует смысл текста, например тональность, но не озвучивает его."],
          ["Amazon Lex", "Lex builds chatbots; it is not meant for narrating articles.", "Lex создаёт чат-ботов и не предназначен для озвучивания статей."],
        ], "Amazon Polly is text-to-speech: converting a blog to a podcast or text dictation.", "Amazon Polly — синтез речи из текста: превратить блог в подкаст, озвучить текст."),
        qx("Which AWS service detects objects, text and unsafe content in images and video?", "Amazon Rekognition", [
          ["Amazon Comprehend", "Comprehend works on text, not on images.", "Comprehend работает с текстом, а не с изображениями."],
          ["Amazon Personalize", "Personalize builds recommendations from user behaviour data.", "Personalize строит рекомендации по данным о поведении пользователей."],
          ["Amazon Lex", "Lex builds conversational chatbots.", "Lex создаёт диалоговых чат-ботов."],
        ], "Rekognition does object and text detection, image moderation and activity detection in video.", "Rekognition распознаёт объекты и текст, модерирует изображения и распознаёт действия на видео."),
        qx("A shop wants to measure the sentiment of customer reviews and extract key phrases. Which AWS service fits?", "Amazon Comprehend", [
          ["Amazon Textract", "Textract pulls text out of scanned documents; it does not judge sentiment.", "Textract извлекает текст из сканов, но не оценивает тональность."],
          ["Amazon Rekognition", "Rekognition analyses images and video, not review text.", "Rekognition анализирует изображения и видео, а не текст отзывов."],
          ["Amazon Forecast", "Forecast predicts future demand, not opinions.", "Forecast прогнозирует спрос, а не мнения."],
        ], "Comprehend provides sentiment analysis, topic modeling, key-phrase extraction, entity detection and classification.", "Comprehend выполняет анализ тональности, выделение тем и ключевых фраз, распознавание сущностей и классификацию."),
        qx("An online store wants product recommendations tailored to each shopper. Which AWS service fits?", "Amazon Personalize", [
          ["Amazon Forecast", "Forecast predicts overall demand, not what one shopper will like.", "Forecast прогнозирует общий спрос, а не то, что понравится конкретному покупателю."],
          ["Amazon Rekognition", "Rekognition analyses images, not shopping preferences.", "Rekognition анализирует изображения, а не покупательские предпочтения."],
          ["Amazon Lex", "Lex builds chatbots, not recommendation engines.", "Lex создаёт чат-ботов, а не рекомендательные системы."],
        ], "Amazon Personalize is the service for recommendations and personalization.", "Amazon Personalize — сервис для рекомендаций и персонализации."),
        qx("Which is an advantage of running AI in the cloud named in the lecture?", "Scaling resources up and down as necessary", [
          ["Models never need monitoring or maintenance", "Monitoring is still needed; the advantage is that the provider maintains the infrastructure.", "Мониторинг по-прежнему нужен; плюс в том, что инфраструктуру обслуживает провайдер."],
          ["AI can only be offered as a desktop app", "The opposite: cloud AI is available as a microservice or an API.", "Наоборот: облачный AI доступен как микросервис или API."],
          ["Training no longer needs any infrastructure", "Training still needs infrastructure; the cloud offers the best one for it.", "Обучению по-прежнему нужна инфраструктура; облако даёт для этого лучшую."],
        ], "Cloud AI offers training and inference infrastructure, high availability, security, elastic scaling, API access and readiness for performance-critical work.", "Облачный AI даёт инфраструктуру для обучения и инференса, высокую доступность, безопасность, масштабирование, доступ через API и готовность к критичным нагрузкам."),
        qx("What does the O'Reilly 2020 survey say about the state of AI efforts in companies?", "Maturing to production, but skills gaps remain", [
          ["Mostly abandoned because the cloud is too costly", "The survey reports maturing efforts, not abandonment.", "Опрос говорит о взрослении проектов, а не об отказе от них."],
          ["Fully mature, with no obstacles left at all", "Obstacles remain: company support and the AI/ML skills gap.", "Препятствия остаются: поддержка компании и нехватка навыков AI/ML."],
          ["Still only research prototypes in universities", "AI efforts are moving from prototype to production in companies.", "Проекты AI в компаниях переходят от прототипов к продакшну."],
        ], "AI efforts are maturing from prototype to production, but company support and an AI/ML skills gap remain obstacles.", "Проекты AI переходят от прототипа к продакшну, но поддержка компании и нехватка навыков AI/ML остаются препятствиями."),
        qx("In the O'Reilly survey, what was the top bottleneck holding back further AI adoption?", "Company culture not recognizing the need for AI", [
          ["Difficulties identifying business use cases", "That came second, just behind company culture.", "Это второе место, сразу после корпоративной культуры."],
          ["Technical infrastructure challenges in the cloud", "Infrastructure was a minor bottleneck (about 7%), far behind culture.", "Инфраструктура — небольшое препятствие (около 7%), далеко позади культуры."],
          ["Legal concerns, risks and compliance issues", "Legal and compliance concerns were only about 3% of answers.", "Юридические вопросы и соответствие требованиям — лишь около 3% ответов."],
        ], "The top answer (about 22%) was that company culture does not yet recognize the need for AI.", "Самый частый ответ (около 22%) — корпоративная культура пока не видит потребности в AI."),
        qx("Which deep learning application drew the most interest in the O'Reilly survey results shown?", "Computer vision", [
          ["Text mining", "Text mining came second with 11%.", "Анализ текста — второе место, 11%."],
          ["Speech technologies", "Speech technologies drew only 2%.", "Речевые технологии — всего 2%."],
          ["Health and medicine", "Health and medicine drew only 2%.", "Здравоохранение и медицина — всего 2%."],
        ], "Computer vision led with 13%, ahead of text mining (11%) and enhancing existing analytics and ML (9%).", "Лидирует компьютерное зрение — 13%, затем анализ текста (11%) и улучшение существующей аналитики и ML (9%)."),
        qx("How does the lecture describe blockchain?", "An immutable network; members see only their transactions", [
          ["An editable database that any member can rewrite at will", "Blockchain is immutable; its records cannot simply be rewritten.", "Блокчейн неизменяем: его записи нельзя просто переписать."],
          ["A central ledger owned and controlled by one single bank", "Blockchain is distributed and decentralized, not owned by one party.", "Блокчейн распределённый и децентрализованный, он не принадлежит одной стороне."],
          ["A private cache that deletes all of its records after a day", "Blockchain keeps a permanent record; nothing is deleted.", "Блокчейн хранит записи постоянно; ничего не удаляется."],
        ], "Blockchain is a secure, distributed, open, immutable network where members view only the transactions relevant to them.", "Блокчейн — защищённая, распределённая, открытая и неизменяемая сеть, где участники видят только относящиеся к ним транзакции."),
        qx("What share of businesses rely on multiple clouds, and what share use more than three?", "85% multicloud; over 70% use more than three", [
          ["70% multicloud; over 85% use more than three", "The numbers are swapped: 85% use multiple clouds, over 70% more than three.", "Цифры перепутаны: 85% используют несколько облаков, больше 70% — более трёх."],
          ["30% multicloud; over 10% use more than three", "Far too low; multicloud is now the norm for most businesses.", "Слишком мало: для большинства компаний мультиоблако уже норма."],
          ["100% multicloud; over 50% use more than three", "Not every business is multicloud; the figure is 85%.", "Не все компании используют мультиоблако; цифра — 85%."],
        ], "85% of businesses rely on multiple clouds, and more than 70% use more than three.", "85% компаний опираются на несколько облаков, а более 70% используют больше трёх."),
        qx("In the three-way relationship of blockchain, AI and cloud, what role does blockchain play?", "The trusted, decentralized source of truth", [
          ["The engine that makes decisions from data", "Analytics and decision-making are the role of AI.", "Аналитика и принятие решений — роль AI."],
          ["The scalable, cost-efficient compute layer", "Globally distributed, scalable compute is the role of the cloud.", "Глобально распределённые масштабируемые вычисления — роль облака."],
          ["The sensor network that collects raw data", "Collecting raw sensor data is the job of IoT, not blockchain.", "Сбор данных с датчиков — задача IoT, а не блокчейна."],
        ], "Blockchain is the trusted source of truth, AI powers analytics and decisions, and cloud provides the computing resources.", "Блокчейн — доверенный источник истины, AI отвечает за аналитику и решения, облако даёт вычислительные ресурсы."),
        qx("How does blockchain benefit AI, according to the lecture?", "It records the data and variables behind AI decisions", [
          ["It lets AI models train much faster on cheaper hardware", "Blockchain adds traceability, not training speed.", "Блокчейн добавляет отслеживаемость, а не скорость обучения."],
          ["It removes the need for training data entirely", "AI still needs data; blockchain only records it reliably.", "AI по-прежнему нужны данные; блокчейн лишь надёжно их фиксирует."],
          ["It hides AI decisions from all network members", "The goal is the opposite: more transparency in AI decisions.", "Цель обратная — больше прозрачности в решениях AI."],
        ], "By recording the inputs behind each decision, blockchain gives greater trust and transparency in AI conclusions.", "Записывая исходные данные каждого решения, блокчейн повышает доверие к выводам AI и их прозрачность."),
        qx("A city wants to predict when bridges and water pipes need repair using sensor data. Which cloud use case is this?", "Data analytics and predictive maintenance", [
          ["Blockchain-based food traceability", "Food traceability tracks the supply chain, not the condition of city assets.", "Отслеживание продуктов касается цепочки поставок, а не состояния городских объектов."],
          ["Conversational BI chatbots built with Amazon Lex", "A chatbot answers questions; it does not predict equipment failures.", "Чат-бот отвечает на вопросы, но не прогнозирует поломки."],
          ["Device registration for IoT identity", "Registration identifies devices; it does not analyse their data for repairs.", "Регистрация определяет устройства, но не анализирует их данные для ремонта."],
        ], "The lecture names data analytics and predictive maintenance for city infrastructure, based on cloud and IoT.", "В лекции названы аналитика данных и предиктивное обслуживание городской инфраструктуры на основе облака и IoT."),
        tfx("According to the lecture, blockchain on the cloud can help farmers reduce waste by adding traceability to the food supply chain.", true,
          "The lecture summary gives this example: traceability and transparency in the food supply chain reduce waste.",
          "В итогах лекции приведён этот пример: отслеживаемость и прозрачность в цепочке поставок продуктов сокращают потери.",
          "'False' is wrong: this is exactly the blockchain example the lecture gives.",
          "«Неверно» — ошибка: это именно тот пример блокчейна, который приводится в лекции."),
      ],
    ),
  ],
};
