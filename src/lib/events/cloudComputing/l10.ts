import { part, qx, tfx, type Lecture } from "../types";

export const lecture10: Lecture = {
  id: "cc-l10",
  title: { en: "Lecture 10 — Architecting, monitoring and scaling on AWS", ru: "Лекция 10 — Архитектура, мониторинг и масштабирование в AWS" },
  parts: [
    part(
      "cc-l10-p1",
      { en: "Well-Architected Framework and high availability", ru: "Well-Architected Framework и высокая доступность" },
      {
        en: `## AWS Well-Architected Framework
The **AWS Well-Architected Framework** is a **guide for designing infrastructures that are secure, high-performing, resilient and efficient**. It gives a **consistent approach to evaluating and implementing cloud architectures**; its best practices come from **lessons learned by reviewing customer architectures**.
- It is organized into **pillars**; each pillar has a **focus**, **design principles** and **best practice areas**.
- The 2019 course slides show **five** pillars; in **2021** AWS added a sixth — **Sustainability**. Know all six.
- It builds nothing for you: it is a set of **questions and best practices** to check a design against.
## The six pillars
| Pillar | Focus | Exam signal |
|---|---|---|
| Operational excellence | run and monitor systems to deliver business value; continually improve processes and procedures | automate changes, respond to events, operations as code |
| Security | protect information, systems and assets through risk assessment and mitigation | IAM, MFA, encryption, traceability |
| Reliability | recover from infrastructure or service disruptions, acquire resources to meet demand, mitigate disruptions | Multi-AZ, automatic failover, backups, tested recovery |
| Performance efficiency | use computing resources efficiently to meet requirements as demand changes and technologies evolve | right instance type and size, serverless, go global |
| Cost optimization | run systems to deliver business value at the lowest price point | unexpected bills, right-sizing, pay only for what you use |
| Sustainability | minimize the environmental impact of running cloud workloads | maximize utilization, efficient hardware, fewer idle resources |
Mnemonic: **CROPS + S** — Cost, Reliability, Operational excellence, Performance, Security + Sustainability.
## Design principles of each pillar
- **Operational excellence**: perform operations as code; make frequent, small, reversible changes; refine procedures frequently; anticipate failure; learn from all operational failures.
- **Security**: a strong identity foundation; enable traceability; apply security at all layers; automate security best practices; protect data in transit and at rest; keep people away from data; prepare for security events.
- **Reliability**: automatically recover from failure; test recovery procedures; scale horizontally to increase aggregate availability; stop guessing capacity; manage change in automation.
- **Performance efficiency**: democratize advanced technologies; go global in minutes; use serverless architectures; experiment more often; mechanical sympathy (use the technology that fits the goal).
- **Cost optimization**: adopt a consumption model; measure overall efficiency; stop spending money on data center operations; analyze and attribute expenditure; use managed services to reduce cost of ownership.
- **Sustainability**: understand your impact; maximize utilization; adopt more efficient hardware and software; use managed services.
General principles of the whole framework: **stop guessing capacity needs**, **test at production scale**, **automate** to make experiments easy, allow **evolutionary architectures**, **drive architectures with data**, improve through **game days**.
## Scenario → pillar
| Scenario | Pillar |
|---|---|
| a startup fears unexpected bills and wants cost-effective resources without hurting performance | Cost optimization |
| Amazon RDS deployed in multiple AZs with automatic failover | Reliability |
| choose the instance family that fits a CPU-heavy job; move to serverless | Performance efficiency |
| enable MFA, encrypt data, log every API call | Security |
| deploy with scripts, small reversible changes, runbooks for incidents | Operational excellence |
> Exam trap: "cost-effective resources **without affecting performance**" is still **Cost optimization** — the word "performance" is bait. Performance efficiency is about meeting requirements efficiently, not about the bill.
## AWS Well-Architected Tool
The **AWS Well-Architected Tool** in the **AWS Management Console** reviews your **workloads** against current AWS best practices. You define a workload, answer questions for each pillar and get an **improvement plan** with **high-risk and medium-risk issues**; **milestones** track progress. The tool has **no additional charge**.
## Reliability and availability
- **Reliability** — the probability that a system **works as intended**; measured by **mean time between failures (MTBF)** = mean time to failure + mean time to repair.
- **Availability** — the **percentage of time** a system operates normally:
= availability = normal operation time / total time
| Availability | Downtime per year |
|---|---|
| 99% | about 3.65 days |
| 99.9% (three nines) | about 8.76 hours |
| 99.99% (four nines) | about 52.6 minutes |
| 99.999% (five nines) | about 5.26 minutes |
**High availability**: the system is up most of the time, downtime is minimized, little human intervention and little up-front investment are needed. Three factors influence it:
- **Fault tolerance** — built-in **redundancy**, so the app keeps working when some components fail;
- **Scalability** — handling more capacity **without changing the design**;
- **Recoverability** — processes that **restore service** quickly after a catastrophic event.
## Multiple AZs in one Region
An **Availability Zone** can fail as a whole — a power outage, a flood. Therefore:
- run instances in **at least two AZs of the same Region** behind a load balancer;
- use **Amazon RDS Multi-AZ** — a standby copy in another AZ with **automatic failover**;
- a **bigger instance in the same AZ** is still a single point of failure;
- **several Regions** protect against a Region-wide disaster but cost more — not the first answer for an AZ outage.
> Exam trap: "the app ran in one AZ and went offline during a power outage" → **launch resources in multiple AZs within the same Region** — not "multiple Regions by default", not "a larger instance", not "On-Demand instead of Spot".
## AWS Trusted Advisor
**AWS Trusted Advisor** gives **real-time guidance** to provision resources by AWS best practices in five categories: **cost optimization, performance, security, fault tolerance, service limits** — for example idle load balancers, MFA on the root account, open security group ports.
?? An RDS database runs in two AZs with automatic failover. Which pillar and which design principle?
?= Reliability — "automatically recover from failure".
?? How much downtime per year does 99.9% availability allow?
?= About 8.76 hours: 0.1% of 8,760 hours.
?? Why is a larger EC2 instance in the same AZ not a high-availability fix?
?= It is still one instance in one AZ: if the AZ loses power, the app is down anyway. High availability needs redundancy across AZs.`,
        ru: `## AWS Well-Architected Framework
**AWS Well-Architected Framework** — **руководство по проектированию инфраструктуры, которая безопасна, производительна, устойчива и эффективна**. Он даёт **единый подход к оценке и построению облачных архитектур**; его лучшие практики выросли из **опыта разбора архитектур клиентов**.
- Он разбит на **столпы (pillars)**; у каждого есть **фокус**, **принципы проектирования (design principles)** и **области лучших практик (best practice areas)**.
- На слайдах курса 2019 года столпов **пять**; в **2021** AWS добавил шестой — **Sustainability**. Стоит знать все шесть.
- Сам он ничего не строит: это набор **вопросов и лучших практик**, по которым проверяют проект.
## Шесть столпов
| Столп | Фокус | Сигнал в вопросе |
|---|---|---|
| Operational excellence | запускать и мониторить системы ради ценности для бизнеса; постоянно улучшать процессы и процедуры | автоматизация изменений, реакция на события, операции как код |
| Security | защищать информацию, системы и активы через оценку и снижение рисков | IAM, MFA, шифрование, прослеживаемость |
| Reliability | восстанавливаться после сбоев инфраструктуры и сервисов, получать ресурсы под спрос, смягчать сбои | Multi-AZ, автоматический failover, бэкапы, проверенное восстановление |
| Performance efficiency | эффективно использовать вычислительные ресурсы под требования, когда меняются спрос и технологии | правильный тип и размер инстанса, serverless, выход на весь мир |
| Cost optimization | приносить ценность бизнесу по наименьшей цене | неожиданные счета, подбор размера, оплата только за использованное |
| Sustainability | снижать влияние облачных нагрузок на окружающую среду | максимальная загрузка, эффективное железо, меньше простаивающих ресурсов |
Мнемоника: **CROPS + S** — Cost, Reliability, Operational excellence, Performance, Security + Sustainability.
## Принципы проектирования каждого столпа
- **Operational excellence**: операции как код (operations as code); частые, мелкие, обратимые изменения; регулярно улучшать процедуры; предвидеть сбои; учиться на всех операционных сбоях.
- **Security**: прочная основа идентификации (strong identity foundation); прослеживаемость (traceability); защита на всех уровнях; автоматизация лучших практик безопасности; защита данных при передаче и хранении; держать людей подальше от данных; готовиться к инцидентам.
- **Reliability**: автоматически восстанавливаться после сбоев; проверять процедуры восстановления; масштабироваться горизонтально ради общей доступности; перестать угадывать мощность; управлять изменениями через автоматизацию.
- **Performance efficiency**: делать передовые технологии доступными (democratize); выходить на весь мир за минуты; использовать serverless-архитектуры; чаще экспериментировать; mechanical sympathy (брать технологию, которая лучше подходит к цели).
- **Cost optimization**: модель потребления (consumption model); измерять общую эффективность; перестать тратить деньги на эксплуатацию дата-центров; анализировать и распределять расходы; брать управляемые сервисы, чтобы снизить стоимость владения.
- **Sustainability**: понимать своё влияние; максимизировать загрузку; переходить на более эффективное железо и ПО; использовать управляемые сервисы.
Общие принципы всего фреймворка: **перестать угадывать нужную мощность**, **тестировать в масштабе продакшена**, **автоматизировать**, чтобы эксперименты были дешёвыми, допускать **эволюционные архитектуры**, **принимать решения по данным**, тренироваться на **game days**.
## Сценарий → столп
| Сценарий | Столп |
|---|---|
| стартап боится неожиданных счетов и хочет экономичные ресурсы без потери производительности | Cost optimization |
| Amazon RDS развёрнут в нескольких AZ с автоматическим failover | Reliability |
| выбрать семейство инстансов под задачу с большой нагрузкой на CPU; перейти на serverless | Performance efficiency |
| включить MFA, шифровать данные, логировать каждый вызов API | Security |
| развёртывание скриптами, мелкие обратимые изменения, runbooks на случай инцидентов | Operational excellence |
> Ловушка экзамена: «экономичные ресурсы **без ущерба для производительности**» — это всё равно **Cost optimization**: слово «performance» здесь приманка. Performance efficiency — про эффективное выполнение требований, а не про счёт.
## AWS Well-Architected Tool
**AWS Well-Architected Tool** в **AWS Management Console** проверяет ваши **рабочие нагрузки (workloads)** на соответствие актуальным лучшим практикам AWS. Вы описываете нагрузку, отвечаете на вопросы по каждому столпу и получаете **план улучшений (improvement plan)** с **проблемами высокого и среднего риска**; **milestones** фиксируют прогресс. **Отдельной платы** за инструмент нет.
## Надёжность и доступность
- **Reliability (надёжность)** — вероятность того, что система **работает как задумано**; её меряют через **mean time between failures (MTBF)** = среднее время до отказа + среднее время восстановления.
- **Availability (доступность)** — **процент времени**, когда система работает нормально:
= availability = normal operation time / total time
| Доступность | Простой за год |
|---|---|
| 99% | около 3,65 дня |
| 99.9% (три девятки) | около 8,76 часа |
| 99.99% (четыре девятки) | около 52,6 минуты |
| 99.999% (пять девяток) | около 5,26 минуты |
**High availability (высокая доступность)**: система почти всегда работает, простой сведён к минимуму, нужно мало ручного вмешательства и мало вложений заранее. На неё влияют три фактора:
- **Fault tolerance (отказоустойчивость)** — встроенная **избыточность**, чтобы приложение работало при отказе части компонентов;
- **Scalability (масштабируемость)** — выдерживать рост нагрузки **без смены архитектуры**;
- **Recoverability (восстанавливаемость)** — процессы, которые быстро **возвращают сервис** после катастрофы.
## Несколько AZ в одном регионе
**Availability Zone** может отказать целиком — отключение питания, наводнение. Поэтому:
- запускайте инстансы минимум **в двух AZ одного региона** за балансировщиком нагрузки;
- используйте **Amazon RDS Multi-AZ** — резервная копия в другой AZ с **автоматическим failover**;
- **инстанс побольше в той же AZ** — всё та же единая точка отказа;
- **несколько регионов** защищают от аварии целого региона, но стоят дороже — это не первый ответ на сбой одной AZ.
> Ловушка экзамена: «приложение работало в одной AZ и упало при отключении питания» → **запускать ресурсы в нескольких AZ внутри того же региона** — не «по умолчанию в нескольких регионах», не «инстанс побольше», не «On-Demand вместо Spot».
## AWS Trusted Advisor
**AWS Trusted Advisor** даёт **рекомендации в реальном времени**, чтобы ресурсы соответствовали лучшим практикам AWS, по пяти категориям: **cost optimization, performance, security, fault tolerance, service limits** — например, простаивающие балансировщики, MFA на root-аккаунте, открытые порты в security groups.
?? База RDS работает в двух AZ с автоматическим failover. Какой это столп и какой принцип проектирования?
?= Reliability — «automatically recover from failure».
?? Сколько простоя за год допускает доступность 99.9%?
?= Около 8,76 часа: 0,1% от 8 760 часов.
?? Почему инстанс побольше в той же AZ не решает проблему высокой доступности?
?= Это по-прежнему один инстанс в одной AZ: если в AZ пропадёт питание, приложение всё равно ляжет. Высокой доступности нужна избыточность в нескольких AZ.`,
      },
      [
        qx("Which statement best describes the AWS Well-Architected Framework?", "Best practices to design and review cloud architectures", [
          ["A service that deploys infrastructure from JSON templates", "Deploying from templates is AWS CloudFormation; the framework deploys nothing.", "Развёртывание по шаблонам — это AWS CloudFormation; фреймворк сам ничего не развёртывает."],
          ["A billing tool that forecasts and caps monthly spending", "Cost forecasts come from tools such as Cost Explorer; the framework is guidance.", "Прогноз расходов дают инструменты вроде Cost Explorer; фреймворк — это руководство."],
          ["A compliance certificate that AWS issues to customers", "It is guidance for your own designs, not a certificate; compliance reports live in AWS Artifact.", "Это руководство для ваших проектов, а не сертификат; отчёты о соответствии лежат в AWS Artifact."],
        ], "The framework is a consistent approach, with questions and best practices, to evaluate and build secure, high-performing, resilient and efficient architectures.", "Фреймворк — единый подход с вопросами и лучшими практиками, чтобы оценивать и строить безопасные, производительные, устойчивые и эффективные архитектуры."),
        qx("A startup is worried about unexpected AWS bills. It wants guidance on choosing the most cost-effective resources without affecting performance. Which Well-Architected pillar is this?", "Cost Optimization", [
          ["Performance Efficiency", "Performance efficiency is about meeting requirements with the right resources; the worry here is the bill.", "Performance efficiency — про выполнение требований правильными ресурсами; здесь же забота о счёте."],
          ["Operational Excellence", "Operational excellence is about running and improving operations, not about spending.", "Operational excellence — про эксплуатацию и улучшение процессов, а не про расходы."],
          ["Reliability", "Reliability is about recovering from failures and meeting demand, not about cost.", "Reliability — про восстановление после сбоев и покрытие спроса, а не про стоимость."],
        ], "Cost optimization means delivering business value at the lowest price point: cost-effective resources, no overspending. 'Without affecting performance' is only a condition.", "Cost optimization — ценность для бизнеса по наименьшей цене: экономичные ресурсы без перерасхода. «Без ущерба для производительности» — лишь условие."),
        qx("A user deploys an Amazon RDS DB instance in multiple Availability Zones. Which Well-Architected pillar does this strategy support?", "Reliability", [
          ["Cost Optimization", "A standby in a second AZ costs more, so it is not done to save money.", "Резервная копия во второй AZ стоит дороже — это делают не ради экономии."],
          ["Security", "Multi-AZ does not control access or protect data; it keeps the database running.", "Multi-AZ не управляет доступом и не защищает данные — он сохраняет работу базы."],
          ["Performance Efficiency", "The standby does not serve reads or speed queries up; it waits for a failover.", "Резервная копия не обслуживает чтение и не ускоряет запросы — она ждёт failover."],
        ], "A standby copy in another AZ with automatic failover lets the workload recover from a failure — the Reliability pillar.", "Резервная копия в другой AZ с автоматическим failover позволяет восстановиться после сбоя — это столп Reliability."),
        qx("A team picks instance types and sizes that match its workload, monitors performance and revisits the choice as new instance families appear. Which pillar is this?", "Performance Efficiency", [
          ["Cost Optimization", "Cost optimization asks for the lowest price; this team chooses resources to meet requirements efficiently.", "Cost optimization стремится к наименьшей цене; эта команда подбирает ресурсы, чтобы эффективно выполнять требования."],
          ["Operational Excellence", "Operational excellence is about running and improving operations, not choosing instance families.", "Operational excellence — про эксплуатацию и улучшение процессов, а не про выбор семейства инстансов."],
          ["Sustainability", "Sustainability targets environmental impact; the goal here is meeting performance needs.", "Sustainability нацелен на влияние на среду; здесь цель — производительность под требования."],
        ], "Selecting the right resource types and sizes, monitoring performance and keeping efficiency as technology evolves is Performance efficiency.", "Подбор правильных типов и размеров ресурсов, мониторинг производительности и сохранение эффективности по мере развития технологий — это Performance efficiency."),
        qx("Changes are deployed by scripts, in frequent, small and reversible steps, and every incident is reviewed to learn from it. Which pillar's design principles are these?", "Operational Excellence", [
          ["Reliability", "Reliability has 'manage change in automation', but small reversible changes and learning from incidents are operations principles.", "В Reliability есть «manage change in automation», но мелкие обратимые изменения и уроки инцидентов — принципы эксплуатации."],
          ["Security", "Security principles are identity, traceability, protection of data and layers.", "Принципы Security — идентификация, прослеживаемость, защита данных и всех уровней."],
          ["Performance Efficiency", "Performance principles are serverless, going global and experimenting with technologies.", "Принципы Performance — serverless, выход на весь мир, эксперименты с технологиями."],
        ], "Perform operations as code, make frequent small reversible changes, learn from all operational failures — Operational excellence.", "Операции как код, частые мелкие обратимые изменения, уроки всех операционных сбоев — это Operational excellence."),
        qx("Which of these is a design principle of the Security pillar?", "Keep people away from data", [
          ["Go global in minutes", "Going global in minutes is a Performance efficiency principle.", "«Go global in minutes» — принцип Performance efficiency."],
          ["Stop guessing capacity needs", "Stop guessing capacity is a Reliability (and general) principle.", "«Stop guessing capacity» — принцип Reliability (и общий принцип)."],
          ["Adopt a consumption model", "A consumption model is a Cost optimization principle.", "Модель потребления — принцип Cost optimization."],
        ], "Security principles include a strong identity foundation, traceability, security at all layers, protecting data and keeping people away from data.", "Принципы Security: прочная основа идентификации, прослеживаемость, защита на всех уровнях, защита данных и людей — подальше от данных."),
        qx("Which design principle belongs to the Reliability pillar?", "Scale horizontally to raise availability", [
          ["Democratize advanced technologies", "Democratizing technologies is a Performance efficiency principle.", "Democratize advanced technologies — принцип Performance efficiency."],
          ["Enable traceability of every action", "Traceability is a Security principle.", "Прослеживаемость — принцип Security."],
          ["Measure the overall efficiency of spending", "Measuring overall efficiency is a Cost optimization principle.", "Измерять общую эффективность — принцип Cost optimization."],
        ], "Reliability: automatically recover from failure, test recovery, scale horizontally to increase aggregate availability, stop guessing capacity, manage change in automation.", "Reliability: автоматически восстанавливаться, проверять восстановление, масштабироваться горизонтально ради общей доступности, не угадывать мощность, управлять изменениями через автоматизацию."),
        qx("Which pillar did AWS add to the Well-Architected Framework in 2021?", "Sustainability", [
          ["Scalability", "Scalability is a factor of availability, not a pillar.", "Scalability — фактор доступности, а не столп."],
          ["Availability", "Availability is measured inside Reliability; it is not a separate pillar.", "Доступность измеряют внутри Reliability; отдельным столпом она не является."],
          ["Data Governance", "Data governance is covered by Security; there is no such pillar.", "Управление данными входит в Security; такого столпа нет."],
        ], "The five original pillars were extended with Sustainability: minimizing the environmental impact of cloud workloads.", "К пяти исходным столпам добавили Sustainability — снижение влияния облачных нагрузок на окружающую среду."),
        qx("What do you get from the AWS Well-Architected Tool after answering its questions for a workload?", "An improvement plan with high- and medium-risk issues", [
          ["A CloudFormation template that rebuilds the workload", "The tool reviews a workload; it does not generate infrastructure code.", "Инструмент проверяет нагрузку, а не генерирует код инфраструктуры."],
          ["A cost estimate of the workload for the next twelve months", "Estimates come from the AWS Pricing Calculator, not from this review.", "Оценку стоимости даёт AWS Pricing Calculator, а не этот обзор."],
          ["An audit certificate accepted by regulators", "The review is self-assessment guidance, not a certificate.", "Обзор — самооценка по руководству, а не сертификат."],
        ], "The Well-Architected Tool compares your answers with best practices and lists high- and medium-risk issues as an improvement plan; milestones track progress.", "Well-Architected Tool сравнивает ответы с лучшими практиками и выдаёт план улучшений с проблемами высокого и среднего риска; milestones фиксируют прогресс."),
        qx("A retail company runs its e-commerce application in one Availability Zone. During a power outage, the application goes offline. What is the best approach to prevent this?", "Run it in several AZs of the same Region", [
          ["Run it in several AWS Regions by default", "Multi-Region is costly and aimed at Region-wide disasters; an AZ outage is solved inside one Region.", "Несколько регионов — дорого и нужно против аварий целого региона; сбой AZ решается внутри одного региона."],
          ["Use a larger instance in the same AZ", "A bigger instance in the same AZ goes down with that AZ — still one point of failure.", "Инстанс побольше в той же AZ упадёт вместе с ней — точка отказа всё та же."],
          ["Use On-Demand instead of Spot Instances", "The pricing option does not protect against a power outage in the AZ.", "Способ оплаты не защищает от отключения питания в AZ."],
        ], "AZs are isolated from each other's failures; spreading resources across several AZs in one Region keeps the app running when one AZ fails.", "AZ изолированы от сбоев друг друга; ресурсы в нескольких AZ одного региона продолжают работать, когда одна AZ отказывает."),
        qx("A system is promised 99.9% availability. About how much downtime per year does that allow?", "About 8.76 hours", [
          ["About 52.6 minutes", "52.6 minutes per year is four nines, 99.99%.", "52,6 минуты в год — это четыре девятки, 99.99%."],
          ["About 5.26 minutes", "5.26 minutes per year is five nines, 99.999%.", "5,26 минуты в год — пять девяток, 99.999%."],
          ["About 3.65 days", "3.65 days per year is 99%.", "3,65 дня в год — это 99%."],
        ], "A year has 8,760 hours; 0.1% of it is 8.76 hours of downtime.", "В году 8 760 часов; 0,1% от них — 8,76 часа простоя."),
        qx("How is mean time between failures (MTBF) calculated?", "MTTF + MTTR", [
          ["MTTR − MTTF", "Subtracting the two times has no meaning; MTBF adds the time to fail and the time to repair.", "Разность этих времён не имеет смысла; MTBF складывает время до отказа и время ремонта."],
          ["MTTF × MTTR", "MTBF is a sum of times, not a product.", "MTBF — сумма времён, а не произведение."],
          ["Uptime / total time", "Uptime divided by total time is availability, not MTBF.", "Время работы, делённое на всё время, — это доступность, а не MTBF."],
        ], "MTBF = mean time to failure + mean time to repair: one full cycle from a failure to the next one.", "MTBF = среднее время до отказа + среднее время восстановления: полный цикл от одного отказа до следующего."),
        qx("How does the course define availability?", "Normal operation time divided by total time", [
          ["Total time divided by the number of failures", "That is closer to a time between failures, not the share of uptime.", "Это ближе ко времени между отказами, а не к доле времени работы."],
          ["Number of instances divided by number of AZs", "Instance counts do not measure how long a system works.", "Число инстансов не измеряет, сколько времени работает система."],
          ["Repair time divided by operating time", "Repair time measures recoverability, not availability.", "Время ремонта говорит о восстанавливаемости, а не о доступности."],
        ], "Availability is the percentage of time a system operates normally: normal operation time / total time.", "Доступность — процент времени нормальной работы: время нормальной работы / всё время."),
        qx("Which factor of availability means built-in redundancy, so the application keeps running when some components fail?", "Fault tolerance", [
          ["Scalability", "Scalability means handling more capacity without changing the design.", "Scalability — выдерживать рост мощности без смены архитектуры."],
          ["Recoverability", "Recoverability is restoring service after a catastrophic event.", "Recoverability — восстановление сервиса после катастрофы."],
          ["Elastic capacity", "Elastic capacity means growing and shrinking with demand, not redundancy.", "Эластичная мощность — рост и сжатие под спрос, а не избыточность."],
        ], "Fault tolerance is the built-in redundancy of an application's components that keeps it operational during partial failures.", "Fault tolerance — встроенная избыточность компонентов, благодаря которой приложение работает при частичных отказах."),
        tfx("As a factor of availability, scalability means accommodating more capacity needs without changing the application's design.", true,
          "That is the course definition; fault tolerance and recoverability are the other two factors.",
          "Это определение из курса; два других фактора — fault tolerance и recoverability.",
          "'False' would confuse scalability with redesigning the app; scalable designs grow without redesign.",
          "Ответ «неверно» путает масштабируемость с переделкой приложения; масштабируемая архитектура растёт без переделки."),
        qx("Which list matches the five AWS Trusted Advisor check categories?", "Cost, performance, security, fault tolerance, service limits", [
          ["Cost, reliability, security, sustainability, operational excellence", "This mixes up Well-Architected pillars with Trusted Advisor categories.", "Здесь перепутаны столпы Well-Architected и категории Trusted Advisor."],
          ["Compute, storage, networking, databases, analytics", "These are AWS service categories, not Trusted Advisor checks.", "Это категории сервисов AWS, а не проверки Trusted Advisor."],
          ["Billing, support, identity, compliance, logging", "These are areas of AWS, not the five check categories.", "Это области AWS, а не пять категорий проверок."],
        ], "Trusted Advisor checks cost optimization, performance, security, fault tolerance and service limits in real time.", "Trusted Advisor в реальном времени проверяет cost optimization, performance, security, fault tolerance и service limits."),
        tfx("Moving an application from one instance to a larger instance in the same Availability Zone removes its single point of failure.", false,
          "A larger instance is still one instance in one AZ; an AZ outage still stops the app. Redundancy across AZs removes the single point of failure.",
          "Больший инстанс — всё ещё один инстанс в одной AZ; сбой AZ всё равно остановит приложение. Единую точку отказа убирает избыточность в нескольких AZ.",
          "'True' confuses more power with more redundancy: scaling up adds capacity, not a second copy.",
          "Ответ «верно» путает мощность с избыточностью: scale up добавляет мощность, а не вторую копию."),
        qx("Which is a general design principle of the Well-Architected Framework?", "Stop guessing your capacity needs", [
          ["Buy hardware for the expected peak", "Buying for the peak is the on-premises habit the framework tells you to drop.", "Покупать под пик — привычка локальных дата-центров, от которой фреймворк предлагает отказаться."],
          ["Test only on a small staging copy", "The principle is to test systems at production scale.", "Принцип — тестировать системы в масштабе продакшена."],
          ["Make rare, large and final changes", "The framework favours frequent, small, reversible changes.", "Фреймворк советует частые, мелкие, обратимые изменения."],
        ], "General principles: stop guessing capacity, test at production scale, automate, allow evolutionary architectures, drive architectures with data, use game days.", "Общие принципы: не угадывать мощность, тестировать в масштабе продакшена, автоматизировать, допускать эволюцию архитектуры, решать по данным, проводить game days."),
        qx("A team shuts down its test servers every night and pays only for the hours it uses. Which Cost Optimization design principle is this?", "Adopt a consumption model", [
          ["Democratize advanced technologies", "That is a Performance efficiency principle about using managed advanced services.", "Это принцип Performance efficiency — пользоваться передовыми управляемыми сервисами."],
          ["Enable traceability", "Traceability is a Security principle about logging and auditing actions.", "Прослеживаемость — принцип Security о логировании и аудите действий."],
          ["Experiment more often", "Experimenting is a Performance efficiency principle.", "Экспериментировать — принцип Performance efficiency."],
        ], "A consumption model means paying only for the computing resources you use and scaling them with business needs.", "Модель потребления — платить только за те вычислительные ресурсы, которыми пользуешься, и менять их под нужды бизнеса."),
        qx("According to the course, which is a characteristic of a highly available system?", "Little human intervention is needed", [
          ["Downtime is planned for every week", "High availability minimizes downtime instead of scheduling it.", "Высокая доступность сводит простой к минимуму, а не планирует его."],
          ["A large up-front investment is required", "The course lists minimal up-front financial investment.", "В курсе указаны минимальные вложения заранее."],
          ["Everything runs on one powerful server", "One server is a single point of failure, the opposite of high availability.", "Один сервер — единая точка отказа, противоположность высокой доступности."],
        ], "Highly available systems are generally up, downtime is minimized, minimal human intervention and minimal up-front investment are needed.", "Высокодоступные системы почти всегда работают, простой минимален, нужно мало ручного вмешательства и мало вложений заранее."),
      ],
    ),
    part(
      "cc-l10-p2",
      { en: "Elastic Load Balancing and EC2 Auto Scaling", ru: "Elastic Load Balancing и EC2 Auto Scaling" },
      {
        en: `## Elastic Load Balancing
**Elastic Load Balancing (ELB)** automatically **distributes incoming application or network traffic across multiple targets** — EC2 instances, containers, IP addresses, Lambda functions — in **one or more Availability Zones**, and **scales itself** as traffic changes.
- A **listener** checks for connection requests on a **protocol and port** (for example HTTP:80) and forwards them by its rules.
- ALB and NLB send traffic to **target groups**; an **Auto Scaling group can register its instances there automatically**. The Classic Load Balancer registers instances directly.
- **Health checks**: the load balancer regularly probes each target (protocol, port, path such as /index.html) and **routes traffic only to healthy targets**; when a target passes again, traffic resumes. ELB does **not** replace instances — that is the job of Auto Scaling.
| Type | OSI layer | Protocols | Best for |
|---|---|---|---|
| Application Load Balancer (ALB) | 7 — application | HTTP, HTTPS | web apps, microservices, containers; routing by path or host (/api, /images) |
| Network Load Balancer (NLB) | 4 — transport | TCP, UDP, TLS | millions of requests per second, ultra-low latency, spiky traffic |
| Gateway Load Balancer (GWLB) | 3 — network | IP packets | fleets of third-party appliances: firewalls, intrusion detection and prevention |
| Classic Load Balancer (CLB) | 4 and 7 | HTTP, HTTPS, TCP, SSL | previous generation, basic balancing across EC2 instances |
> Exam trap: "send /images and /api to different servers" → **ALB** (only layer 7 reads URLs). "Extreme TCP or UDP performance" → **NLB**. "Put a fleet of firewall appliances in the traffic path" → **GWLB**.
## Scalability and elasticity
- **Scalability** — handling growth without changing the design: scale **out** (more instances) or **up** (a bigger instance).
- **Elasticity** — resources **grow and shrink automatically** with demand, so you pay only for what you use.
> The primary benefit of scalability and elasticity: **grow and shrink resources dynamically based on real-time demand** — not manual sizing for the peak, not permanent growth, not fixed resources.
## Amazon EC2 Auto Scaling
**Amazon EC2 Auto Scaling** helps **maintain application availability** and **automatically adds or removes EC2 instances according to conditions you define**. It also **detects unhealthy instances and replaces them**.
- With **ELB** it forms the scaling pair: Auto Scaling decides **how many** instances run, ELB **spreads traffic** over the healthy ones.
> Exam trap: "Which tools help your application scale up or down based on demand? (select all)" → **Elastic Load Balancing** and **Amazon EC2 Auto Scaling**. **CloudFormation** creates resources from templates but does not react to load; **Availability Zones** are locations; **AWS Config** records configurations.
| Block | Answers | Contains |
|---|---|---|
| Launch template | **what** to launch | AMI, instance type, key pair, security groups, IAM role, EBS volumes, user data |
| Auto Scaling group | **where** and **how many** | subnets (AZs), target group, minimum, desired and maximum capacity, health checks |
| Scaling options | **when** to scale | maintain, manual, scheduled, dynamic, predictive |
- **Launch configurations** are the older form; AWS recommends **launch templates** — they have **versions** and support newer features (several instance types, Spot + On-Demand).
- Rule: **minimum ≤ desired ≤ maximum**. The group keeps the desired number and never leaves the min–max range.
The Lab 6 layout — an ALB in two public subnets, the group in two private subnets:
@diagram cc10-alb-asg
## Scaling options
| Option | Triggered by | Use when |
|---|---|---|
| Maintain current level | health checks | keep N healthy instances, replace failed ones |
| Manual | you change min, max or desired | one-off changes |
| Scheduled actions | date and time | load changes at known times |
| Dynamic (scaling policies) | a CloudWatch metric | load follows demand at unknown times |
| Predictive | machine-learning forecast of daily and weekly patterns | regular cycles: capacity is added before the load |
- **Target tracking** — pick a metric and a **target value**, e.g. **average CPU 50%**. Auto Scaling **creates and manages the CloudWatch alarms itself** and adds or removes instances to stay near the target, like a **thermostat**. AWS recommends it first.
- **Step scaling** — the adjustment **depends on the size of the breach**: CPU 60–70% → +1 instance, above 70% → +3.
- **Simple scaling** — one adjustment per alarm, then a **cooldown** (300 seconds by default).
> Exam trap: "traffic spikes every day at 9 AM; add instances automatically **when CPU is above 70%**" → **target tracking policy** — the trigger is a metric, not the clock. **Scheduled actions** fire at a set time whatever the CPU is; **lifecycle hooks** run custom actions during launch or termination; **CloudWatch Logs** only stores logs. If the question said "add capacity at 8:45 every day", scheduled actions would win.
## Health checks, lifecycle hooks, termination
- Health checks: **EC2 status checks** by default; turn on **ELB health checks** so an instance that fails the load balancer check is replaced too.
- **Lifecycle hooks** hold an instance in **Pending:Wait** (launch) or **Terminating:Wait** (termination) so a script can install software or copy logs first; the default timeout is one hour.
- On scale-in the **default termination policy** keeps AZs **balanced**: it removes an instance from the AZ with the most instances.
?? An ASG has min 2, desired 4, max 6, and one instance fails its health check. What happens?
?= It is terminated and a replacement is launched to get back to the desired 4.
?? Sales start every Friday at 18:00. Which option adds capacity before the rush?
?= A scheduled action — the load is predictable by time (predictive scaling could also learn the weekly pattern).
?? What does an ALB do with a target that fails its health check, and who replaces it?
?= The ALB stops routing to it until it passes again; EC2 Auto Scaling, with ELB health checks turned on, terminates and replaces it.`,
        ru: `## Elastic Load Balancing
**Elastic Load Balancing (ELB)** автоматически **распределяет входящий трафик приложения или сети между несколькими целями (targets)** — инстансами EC2, контейнерами, IP-адресами, функциями Lambda — в **одной или нескольких Availability Zones** и **сам масштабируется** вслед за трафиком.
- **Listener (слушатель)** ждёт подключений на заданных **протоколе и порту** (например, HTTP:80) и пересылает их по своим правилам.
- ALB и NLB отправляют трафик в **target groups (целевые группы)**; **Auto Scaling group может сама регистрировать там свои инстансы**. Classic Load Balancer регистрирует инстансы напрямую.
- **Health checks (проверки работоспособности)**: балансировщик регулярно опрашивает каждую цель (протокол, порт, путь вроде /index.html) и **отправляет трафик только здоровым целям**; когда цель снова проходит проверку, трафик возвращается. ELB **не заменяет** инстансы — это работа Auto Scaling.
| Тип | Уровень OSI | Протоколы | Для чего |
|---|---|---|---|
| Application Load Balancer (ALB) | 7 — прикладной | HTTP, HTTPS | веб-приложения, микросервисы, контейнеры; маршрутизация по пути или хосту (/api, /images) |
| Network Load Balancer (NLB) | 4 — транспортный | TCP, UDP, TLS | миллионы запросов в секунду, сверхнизкая задержка, резкие всплески трафика |
| Gateway Load Balancer (GWLB) | 3 — сетевой | IP-пакеты | парки сторонних виртуальных устройств: firewalls, системы обнаружения и предотвращения вторжений |
| Classic Load Balancer (CLB) | 4 и 7 | HTTP, HTTPS, TCP, SSL | прошлое поколение, простое распределение между инстансами EC2 |
> Ловушка экзамена: «отправлять /images и /api на разные серверы» → **ALB** (URL читает только уровень 7). «Максимальная производительность TCP или UDP» → **NLB**. «Пропустить трафик через парк firewall-устройств» → **GWLB**.
## Масштабируемость и эластичность
- **Scalability (масштабируемость)** — выдерживать рост без смены архитектуры: scale **out** (больше инстансов) или **up** (инстанс мощнее).
- **Elasticity (эластичность)** — ресурсы **сами растут и сжимаются** вслед за спросом, и платить приходится только за использованное.
> Главная польза масштабируемости и эластичности: **динамически наращивать и сокращать ресурсы по реальному спросу** — не ручная подгонка под пик, не постоянный рост, не ресурсы фиксированного размера.
## Amazon EC2 Auto Scaling
**Amazon EC2 Auto Scaling** помогает **сохранять доступность приложения** и **автоматически добавляет или удаляет инстансы EC2 по заданным условиям**. Ещё он **находит нездоровые инстансы и заменяет их**.
- Вместе с **ELB** он образует пару для масштабирования: Auto Scaling решает, **сколько** инстансов работает, ELB **распределяет трафик** между здоровыми.
> Ловушка экзамена: «Какие инструменты помогают приложению масштабироваться вверх и вниз по спросу? (выберите все)» → **Elastic Load Balancing** и **Amazon EC2 Auto Scaling**. **CloudFormation** создаёт ресурсы по шаблонам, но на нагрузку не реагирует; **Availability Zones** — это места размещения; **AWS Config** записывает конфигурации.
| Блок | Отвечает на вопрос | Содержит |
|---|---|---|
| Launch template | **что** запускать | AMI, тип инстанса, key pair, security groups, IAM role, тома EBS, user data |
| Auto Scaling group | **где** и **сколько** | подсети (AZ), target group, минимальная, желаемая и максимальная ёмкость, health checks |
| Scaling options | **когда** масштабировать | maintain, manual, scheduled, dynamic, predictive |
- **Launch configurations** — старый вариант; AWS рекомендует **launch templates**: у них есть **версии** и поддержка новых возможностей (несколько типов инстансов, смесь Spot + On-Demand).
- Правило: **minimum ≤ desired ≤ maximum**. Группа держит желаемое число инстансов и никогда не выходит за пределы min–max.
Схема Lab 6 — ALB в двух публичных подсетях, группа в двух частных:
@diagram cc10-alb-asg
## Варианты масштабирования
| Вариант | Что запускает | Когда подходит |
|---|---|---|
| Maintain current level | health checks | держать N здоровых инстансов, заменять упавшие |
| Manual | вы меняете min, max или desired | разовые изменения |
| Scheduled actions | дата и время | нагрузка меняется в известное время |
| Dynamic (scaling policies) | метрика CloudWatch | нагрузка идёт за спросом в непредсказуемое время |
| Predictive | прогноз машинного обучения по дневным и недельным циклам | регулярные циклы: мощность добавляется до прихода нагрузки |
- **Target tracking** — выбирается метрика и **целевое значение (target value)**, например **средний CPU 50%**. Auto Scaling **сам создаёт и ведёт алармы CloudWatch** и добавляет или убирает инстансы, чтобы держаться у цели, как **термостат**. AWS советует начинать с него.
- **Step scaling** — размер поправки **зависит от того, насколько превышен порог**: CPU 60–70% → +1 инстанс, выше 70% → +3.
- **Simple scaling** — одна поправка на аларм, затем **cooldown** (по умолчанию 300 секунд).
> Ловушка экзамена: «трафик каждый день резко растёт в 9 утра; автоматически добавлять инстансы, **когда CPU выше 70%**» → **target tracking policy** — срабатывание по метрике, а не по часам. **Scheduled actions** срабатывают в заданное время независимо от CPU; **lifecycle hooks** выполняют свои действия при запуске или завершении инстанса; **CloudWatch Logs** только хранит логи. Если бы в вопросе было «добавлять мощность каждый день в 8:45», победили бы scheduled actions.
## Health checks, lifecycle hooks, завершение инстансов
- Health checks: по умолчанию — **EC2 status checks**; стоит включить **ELB health checks**, чтобы заменялся и инстанс, не прошедший проверку балансировщика.
- **Lifecycle hooks** задерживают инстанс в состоянии **Pending:Wait** (запуск) или **Terminating:Wait** (завершение), чтобы скрипт успел поставить ПО или скопировать логи; таймаут по умолчанию — один час.
- При сокращении (scale-in) **default termination policy** держит AZ **сбалансированными**: удаляет инстанс из той AZ, где их больше всего.
?? У ASG min 2, desired 4, max 6, и один инстанс не прошёл health check. Что произойдёт?
?= Его завершат и запустят замену, чтобы вернуться к desired 4.
?? Распродажа начинается каждую пятницу в 18:00. Какой вариант добавит мощность до наплыва?
?= Scheduled action — нагрузка предсказуема по времени (predictive scaling тоже может выучить недельный цикл).
?? Что ALB делает с целью, которая не прошла health check, и кто её заменяет?
?= ALB перестаёт отправлять ей трафик, пока она снова не пройдёт проверку; заменяет её EC2 Auto Scaling с включёнными ELB health checks.`,
      },
      [
        qx("What does Elastic Load Balancing do?", "Spreads traffic across targets in one or more AZs", [
          ["Adds or removes EC2 instances as demand changes", "Changing the number of instances is EC2 Auto Scaling; ELB spreads traffic over them.", "Менять число инстансов — работа EC2 Auto Scaling; ELB распределяет между ними трафик."],
          ["Caches copies of content in edge locations near users", "Caching content at the edge is Amazon CloudFront.", "Кэшировать контент в edge locations — это Amazon CloudFront."],
          ["Translates domain names into IP addresses for users", "Turning names into IP addresses is DNS — Amazon Route 53.", "Превращать имена в IP-адреса — это DNS, Amazon Route 53."],
        ], "ELB distributes incoming application or network traffic across EC2 instances, containers, IP addresses and Lambda functions in one or more AZs.", "ELB распределяет входящий трафик приложения или сети между инстансами EC2, контейнерами, IP-адресами и функциями Lambda в одной или нескольких AZ."),
        qx("An application must send /api requests to one group of containers and /images requests to another. Which load balancer fits?", "Application Load Balancer", [
          ["Network Load Balancer", "An NLB works at layer 4 with TCP and UDP; it does not read URL paths.", "NLB работает на уровне 4 с TCP и UDP и не читает пути URL."],
          ["Gateway Load Balancer", "A GWLB passes traffic through virtual appliances such as firewalls.", "GWLB пропускает трафик через виртуальные устройства вроде firewall."],
          ["Classic Load Balancer", "The CLB is the previous generation without path-based routing to target groups.", "CLB — прошлое поколение без маршрутизации по пути в target groups."],
        ], "Only the ALB works at layer 7 and can route HTTP requests by path or host to different target groups.", "Только ALB работает на уровне 7 и умеет направлять HTTP-запросы по пути или хосту в разные target groups."),
        qx("A game backend must handle millions of TCP and UDP requests per second with ultra-low latency. Which load balancer fits?", "Network Load Balancer", [
          ["Application Load Balancer", "An ALB is built for HTTP and HTTPS at layer 7, not raw UDP traffic.", "ALB рассчитан на HTTP и HTTPS на уровне 7, а не на чистый UDP."],
          ["Gateway Load Balancer", "A GWLB is for inserting virtual appliances, not for serving a game backend.", "GWLB нужен для встраивания виртуальных устройств, а не для игрового бэкенда."],
          ["Classic Load Balancer", "The CLB is an older generation and is not built for this scale or for UDP.", "CLB — старое поколение, не рассчитанное на такой масштаб и на UDP."],
        ], "The NLB works at layer 4 (TCP, UDP, TLS) and handles millions of requests per second with very low latency.", "NLB работает на уровне 4 (TCP, UDP, TLS) и выдерживает миллионы запросов в секунду с очень низкой задержкой."),
        qx("All traffic must pass through a fleet of third-party firewall and intrusion-prevention appliances. Which load balancer is designed for this?", "Gateway Load Balancer", [
          ["Network Load Balancer", "An NLB balances TCP and UDP to targets; inserting appliances is the GWLB's job.", "NLB распределяет TCP и UDP по целям; встраивание устройств — задача GWLB."],
          ["Application Load Balancer", "An ALB routes HTTP requests to apps, not through security appliances.", "ALB направляет HTTP-запросы к приложениям, а не через устройства безопасности."],
          ["Classic Load Balancer", "The CLB only spreads traffic over EC2 instances.", "CLB лишь распределяет трафик между инстансами EC2."],
        ], "The GWLB (layer 3) deploys, scales and balances fleets of virtual appliances such as firewalls and IDS/IPS.", "GWLB (уровень 3) разворачивает, масштабирует и балансирует парки виртуальных устройств — firewall, IDS/IPS."),
        qx("An ALB health check finds that one registered target is failing. What does the load balancer do?", "Stops routing to it until it is healthy", [
          ["Terminates it and launches a replacement", "Replacing instances is EC2 Auto Scaling's job, not the load balancer's.", "Заменять инстансы — работа EC2 Auto Scaling, а не балансировщика."],
          ["Reboots the instance to clear the failure", "A load balancer has no permission or role to reboot targets.", "У балансировщика нет ни роли, ни права перезагружать цели."],
          ["Keeps sending it traffic at a lower weight", "Unhealthy targets get no traffic at all until they pass again.", "Нездоровые цели вообще не получают трафик, пока снова не пройдут проверку."],
        ], "ELB routes only to healthy targets; when the target passes the check again, traffic resumes.", "ELB шлёт трафик только здоровым целям; когда цель снова проходит проверку, трафик возвращается."),
        qx("At which OSI layer does an Application Load Balancer make its routing decisions?", "Layer 7 (application)", [
          ["Layer 4 (transport)", "Layer 4 is where the Network Load Balancer works.", "На уровне 4 работает Network Load Balancer."],
          ["Layer 3 (network)", "Layer 3 is where the Gateway Load Balancer works.", "На уровне 3 работает Gateway Load Balancer."],
          ["Layer 6 (presentation)", "No AWS load balancer is defined at the presentation layer.", "Ни один балансировщик AWS не относят к уровню представления."],
        ], "The ALB reads HTTP and HTTPS requests — paths, hosts, headers — so it works at the application layer, layer 7.", "ALB читает HTTP- и HTTPS-запросы — пути, хосты, заголовки, — поэтому работает на прикладном уровне, уровне 7."),
        qx("Which pair of AWS tools helps your application scale up or down based on demand?", "ELB and Amazon EC2 Auto Scaling", [
          ["AWS CloudFormation and AWS Config", "CloudFormation builds resources from templates and Config records configurations; neither reacts to load.", "CloudFormation строит ресурсы по шаблонам, Config записывает конфигурации; ни один не реагирует на нагрузку."],
          ["Availability Zones and AWS Config", "AZs are locations for high availability, not a scaling tool.", "AZ — места размещения ради высокой доступности, а не инструмент масштабирования."],
          ["CloudFormation and Availability Zones", "Neither adds or removes capacity when demand changes.", "Ни то, ни другое не добавляет и не убирает мощность при изменении спроса."],
        ], "EC2 Auto Scaling changes the number of instances with demand, and ELB spreads traffic over whatever instances are healthy.", "EC2 Auto Scaling меняет число инстансов вслед за спросом, а ELB распределяет трафик между теми, что сейчас здоровы."),
        qx("Traffic spikes every day at 9 AM. The Auto Scaling group must add EC2 instances automatically when CPU usage is above 70%. What do you configure?", "A target tracking policy", [
          ["Lifecycle hooks on launch", "Lifecycle hooks run custom actions while an instance launches or terminates; they do not decide when to scale.", "Lifecycle hooks выполняют действия при запуске или завершении инстанса, но не решают, когда масштабировать."],
          ["CloudWatch Logs subscription", "CloudWatch Logs stores and searches logs; it cannot add instances.", "CloudWatch Logs хранит и ищет логи; добавлять инстансы он не умеет."],
          ["Scheduled scaling actions", "The condition is CPU above 70%, not a clock time; a schedule fires whatever the CPU is.", "Условие — CPU выше 70%, а не время; расписание срабатывает независимо от CPU."],
        ], "A target tracking policy keeps a metric such as average CPU at the target and adds instances when it rises above it — the trigger is the metric.", "Target tracking policy держит метрику вроде среднего CPU у цели и добавляет инстансы, когда она выше, — срабатывание идёт по метрике."),
        qx("What is the primary benefit of scalability and elasticity in AWS?", "Grow and shrink resources with real-time demand", [
          ["Manually adjust resources to match the expected peak usage", "Manual sizing for the peak is the old on-premises approach, not elasticity.", "Ручная подгонка под пик — старый подход локальных дата-центров, а не эластичность."],
          ["Permanently add capacity to support long-term growth", "Elastic resources also shrink; nothing is added permanently.", "Эластичные ресурсы ещё и сжимаются; ничего не добавляется навсегда."],
          ["Create fixed resources that never change size", "Fixed size is the opposite of elasticity.", "Фиксированный размер — противоположность эластичности."],
        ], "Scalability and elasticity let resources grow and shrink dynamically with real-time demand, so you pay only for what you use.", "Масштабируемость и эластичность позволяют ресурсам динамически расти и сжиматься по реальному спросу, и платить только за использованное."),
        qx("A shop knows its sales start every Friday at 18:00 and wants extra capacity ready before the rush. Which option fits best?", "Scheduled scaling actions", [
          ["Target tracking on average CPU", "Target tracking reacts after CPU has already risen, so capacity arrives during the rush.", "Target tracking реагирует, когда CPU уже вырос, и мощность приходит во время наплыва."],
          ["Lifecycle hooks on launch", "Lifecycle hooks customize launches; they do not schedule capacity.", "Lifecycle hooks настраивают запуск инстансов, а не планируют мощность."],
          ["Simple scaling with a cooldown", "Simple scaling also waits for an alarm, which fires only after the load arrives.", "Simple scaling тоже ждёт аларма, а он срабатывает уже после прихода нагрузки."],
        ], "When the load changes at a known date and time, a scheduled action sets the capacity in advance.", "Когда нагрузка меняется в известные дату и время, scheduled action заранее выставляет мощность."),
        qx("Which settings belong in a launch template for EC2 Auto Scaling?", "AMI ID, instance type, security groups", [
          ["Minimum, desired and maximum capacity", "Capacity limits are settings of the Auto Scaling group, not of the template.", "Пределы ёмкости — настройки Auto Scaling group, а не шаблона."],
          ["Scaling policies and their CloudWatch alarms", "Policies say when to scale; the template says what to launch.", "Политики говорят, когда масштабировать; шаблон — что запускать."],
          ["Subnets and the load balancer target group", "Subnets and target groups are chosen in the Auto Scaling group.", "Подсети и target group выбирают в Auto Scaling group."],
        ], "The launch template answers 'what': AMI, instance type, key pair, security groups, IAM role, EBS volumes and user data.", "Launch template отвечает на вопрос «что»: AMI, тип инстанса, key pair, security groups, IAM role, тома EBS и user data."),
        qx("An Auto Scaling group has min 2, desired 4 and max 6. One instance fails its health check. What happens?", "It is replaced to keep 4 instances running", [
          ["The group shrinks to the minimum of 2", "A failed check does not change the desired capacity.", "Проваленная проверка не меняет желаемую ёмкость."],
          ["Nothing happens until a scaling policy fires", "Replacing unhealthy instances happens without any scaling policy.", "Замена нездоровых инстансов происходит и без политики масштабирования."],
          ["The group grows to its maximum of 6", "Auto Scaling replaces one instance; it does not jump to the maximum.", "Auto Scaling заменяет один инстанс, а не прыгает до максимума."],
        ], "Auto Scaling terminates the unhealthy instance and launches a new one to return to the desired capacity of 4.", "Auto Scaling завершает нездоровый инстанс и запускает новый, чтобы вернуться к желаемой ёмкости 4."),
        qx("Which rule must the desired capacity of an Auto Scaling group follow?", "It must lie between the minimum and maximum", [
          ["It must be equal to the maximum capacity", "Desired can be anything from the minimum to the maximum.", "Желаемая ёмкость может быть любой от минимума до максимума."],
          ["It may exceed the maximum during traffic spikes", "The maximum is a hard limit that the group never passes.", "Максимум — жёсткий предел, который группа не переходит."],
          ["It is ignored when a scaling policy exists", "Scaling policies work by changing the desired capacity.", "Политики масштабирования как раз и работают через изменение желаемой ёмкости."],
        ], "Minimum ≤ desired ≤ maximum: the group keeps the desired number and stays within its limits.", "Minimum ≤ desired ≤ maximum: группа держит желаемое число и остаётся в своих пределах."),
        qx("What does a step scaling policy do?", "Adds more instances the further the alarm is breached", [
          ["Keeps a chosen metric as close as possible to a target value", "Holding a metric at a target is target tracking.", "Держать метрику у цели — это target tracking."],
          ["Adds capacity at fixed times of the day", "Fixed times are scheduled actions.", "Фиксированное время — это scheduled actions."],
          ["Forecasts load with machine learning in advance", "Machine-learning forecasts are predictive scaling.", "Прогноз машинным обучением — это predictive scaling."],
        ], "Step scaling has steps: a small breach adds a little capacity, a large breach adds more.", "У step scaling есть ступени: небольшое превышение добавляет немного мощности, большое — больше."),
        tfx("With a target tracking policy, EC2 Auto Scaling creates and manages the CloudWatch alarms for you.", true,
          "You only choose the metric and target value; Auto Scaling creates the alarms and adjusts capacity like a thermostat.",
          "Вы выбираете только метрику и целевое значение; алармы Auto Scaling создаёт сам и регулирует мощность как термостат.",
          "'False' fits step and simple scaling, where you create the alarm yourself — not target tracking.",
          "Ответ «неверно» подходит к step и simple scaling, где аларм создаёте вы, — но не к target tracking."),
        qx("What are Auto Scaling lifecycle hooks used for?", "Running a script while an instance launches or ends", [
          ["Replacing instances that fail the load balancer health check", "Replacement comes from health checks; hooks only pause the launch or termination.", "Замену делают health checks; hooks лишь приостанавливают запуск или завершение."],
          ["Adding instances at a set time each day", "Adding capacity at set times is a scheduled action.", "Добавлять мощность в заданное время — scheduled action."],
          ["Spreading traffic across healthy instances", "Spreading traffic is Elastic Load Balancing.", "Распределять трафик — это Elastic Load Balancing."],
        ], "A hook holds the instance in Pending:Wait or Terminating:Wait so custom actions — install software, copy logs — can finish first.", "Hook держит инстанс в Pending:Wait или Terminating:Wait, чтобы сначала успели выполниться свои действия — поставить ПО, скопировать логи."),
        qx("Which scaling option uses machine learning on past daily and weekly patterns to add capacity before the load arrives?", "Predictive scaling", [
          ["Target tracking scaling", "Target tracking reacts to the current metric; it does not forecast.", "Target tracking реагирует на текущую метрику и ничего не прогнозирует."],
          ["Scheduled scaling", "Scheduled scaling follows times you set by hand, not a learned forecast.", "Scheduled scaling следует времени, которое вы задали вручную, а не выученному прогнозу."],
          ["Step scaling", "Step scaling reacts to the size of an alarm breach.", "Step scaling реагирует на величину превышения порога."],
        ], "Predictive scaling forecasts regular daily and weekly cycles and schedules capacity ahead of them.", "Predictive scaling прогнозирует регулярные дневные и недельные циклы и заранее выставляет мощность."),
        qx("An Auto Scaling group runs 3 instances in AZ a and 2 in AZ b, and now scales in by one. Which instance does the default termination policy remove first?", "One from the AZ with the most instances", [
          ["The newest instance in any of the AZs", "Age is not the first criterion; balance across AZs comes first.", "Возраст — не первый критерий; сначала идёт баланс между AZ."],
          ["The instance with the highest CPU load", "The default policy does not look at CPU load.", "Политика по умолчанию не смотрит на загрузку CPU."],
          ["One from the AZ with the fewest instances first", "Removing from the smaller AZ would make the imbalance worse.", "Удаление из меньшей AZ только усилит дисбаланс."],
        ], "The default termination policy keeps AZs balanced, so it removes an instance from AZ a, which has the most.", "Default termination policy держит AZ сбалансированными, поэтому удаляет инстанс из AZ a, где их больше."),
        qx("Why does AWS recommend launch templates over launch configurations?", "They support versions and newer features", [
          ["They are the only way to choose an AMI", "Launch configurations also specify an AMI.", "В launch configurations тоже указывают AMI."],
          ["They remove the need for an Auto Scaling group", "A template only describes instances; the group still decides where and how many.", "Шаблон лишь описывает инстансы; где и сколько, решает группа."],
          ["They are free while configurations are billed", "Neither has a charge; you pay for the instances.", "Ни то, ни другое не тарифицируется; платят за инстансы."],
        ], "Launch templates keep versions and support newer options such as several instance types and mixing Spot with On-Demand.", "Launch templates хранят версии и поддерживают новые возможности: несколько типов инстансов, смесь Spot и On-Demand."),
        tfx("When an Application Load Balancer health check fails, the load balancer itself terminates the unhealthy instance and launches a new one.", false,
          "The ALB only stops sending traffic to the target; EC2 Auto Scaling (with ELB health checks on) replaces the instance.",
          "ALB лишь перестаёт слать трафик этой цели; заменяет инстанс EC2 Auto Scaling (с включёнными ELB health checks).",
          "'True' mixes the two services: ELB routes traffic, Auto Scaling launches and terminates instances.",
          "Ответ «верно» смешивает два сервиса: ELB направляет трафик, Auto Scaling запускает и завершает инстансы."),
      ],
    ),
    part(
      "cc-l10-p3",
      { en: "CloudWatch, SNS and SQS, Route 53 and CloudFront", ru: "CloudWatch, SNS и SQS, Route 53 и CloudFront" },
      {
        en: `## Amazon CloudWatch
**Amazon CloudWatch** monitors your **AWS resources and the applications you run on AWS in real time**.
- **Metrics** — time-ordered data points such as CPUUtilization or NetworkIn; AWS services publish standard metrics, and you can add **custom metrics**.
- **Alarms** — watch a metric and, when it crosses a threshold, **act**: notify an **Amazon SNS topic**, run an **EC2 Auto Scaling** action or an **EC2 action** (stop, terminate, reboot, recover).
- **Logs** — CloudWatch Logs collects, stores and searches log files; **dashboards** show metrics and alarms in one view; **events** (now Amazon EventBridge) route changes in your environment to targets.
An alarm is defined by a metric, a statistic (Average, Sum, Minimum, Maximum, SampleCount), a period, a threshold and the number of breaching periods. Its state is **OK**, **ALARM** or **INSUFFICIENT_DATA**.
= CPUUtilization > 70 for 2 periods of 5 minutes -> ALARM -> SNS topic + scale out
- EC2 **basic monitoring** sends metrics every **5 minutes** for free; **detailed monitoring** every **1 minute** for a fee.
- **Memory and disk-space usage** inside the OS are **not** default EC2 metrics — install the **CloudWatch agent** to publish them.
@diagram cc10-alarm-flow
| Service | Answers | Example |
|---|---|---|
| Amazon CloudWatch | how are resources and apps performing now? | CPU at 90%, alarms, logs, dashboards |
| AWS CloudTrail | who did what and when — which API call? | which user deleted an EC2 instance yesterday |
| AWS Config | how is a resource configured, is it compliant? | history of security group changes |
## Amazon SNS vs Amazon SQS
**Amazon SNS (Simple Notification Service)** — managed **publish/subscribe**: a message published to a **topic** is **pushed at once** to every **subscriber** — email, SMS, HTTP/HTTPS, **SQS queues**, Lambda, mobile push. SNS **sends the alerts for CloudWatch alarms**.
**Amazon SQS (Simple Queue Service)** — managed **message queue**: a producer puts a message in, a consumer **polls** it **later**, processes it and deletes it. It **decouples** components; messages wait 4 days by default (up to 14). **Standard** queues: at-least-once delivery, best-effort order; **FIFO** queues: exactly-once processing, strict order.
| Feature | Amazon SNS | Amazon SQS |
|---|---|---|
| Model | publish/subscribe, one-to-many | queue, each message handled by one consumer |
| Delivery | push, immediately | consumers poll (pull) when ready |
| Storage | not kept for reading later | stored until processed |
| Typical use | alerts, notifications, fan-out | buffering, decoupling, processing later |
**Fan-out**: SQS queues subscribe to an SNS topic, so one message is pushed **now** to people and **copied into each queue** for workers to process **later**.
> Exam trap — bug tracker: some engineers must be notified **immediately**, others process reports **later** → **Amazon SNS** (with SQS through fan-out). SQS alone only stores messages for polling — it notifies nobody.
## Amazon Route 53
**Amazon Route 53** is a **highly available and scalable cloud DNS web service**: it translates names such as www.example.com into IP addresses and routes users to infrastructure **in AWS or outside it**. It also registers **domain names** and runs **health checks**; with **DNS failover** it answers with a backup endpoint (for example a static site in S3) when the primary is unhealthy. The name comes from **port 53**, the DNS port.
| Policy | Routes by | Typical case |
|---|---|---|
| Simple | one record, no special logic | a single web server |
| Weighted | weights you set, e.g. 90 / 10 | A/B testing, gradual rollout |
| Latency-based | lowest latency to an AWS Region | users in Europe and Asia get the fastest Region |
| Geolocation | the user's continent or country | localized content, legal or licensing rules |
| Geoproximity | location of users and resources, optional bias | shift more traffic to one Region |
| Failover | health of the primary record | active-passive disaster recovery |
| Multivalue answer | up to eight healthy records, random | simple DNS spreading with health checks |
@diagram cc10-latency
> Exam trap: "users in Europe and Asia are slow; route them to the **closest Region automatically**" → **latency-based routing** — "closest" means fastest. **Geolocation** is for when the location itself matters (laws, language, rights); **weighted** splits by percentage; **simple** has no logic. Latency routing helps only if the app also runs in Regions near those users.
## Amazon CloudFront
**Amazon CloudFront** is the AWS **content delivery network (CDN)**: it delivers data, videos, apps and APIs with **low latency** by caching copies in **edge locations** and **regional edge caches**. The **origin** holds the original (an S3 bucket, EC2, a load balancer, any HTTP server); a **distribution** says what to cache; the **TTL** sets for how long. **AWS Shield Standard** DDoS protection is included at no extra cost; you pay as you go.
> Route 53 decides **where** a user is sent (DNS); CloudFront **caches content close to users**, even when the app lives in one Region.
?? Which service emails the team when a CloudWatch alarm enters the ALARM state?
?= Amazon SNS: the alarm action publishes to an SNS topic with an email subscription.
?? Users in Asia are slow, but the app runs only in us-east-1. Will latency-based routing alone fix it?
?= No: it chooses among Regions where the app runs. Deploy a copy in an Asian Region, or cache content with CloudFront.`,
        ru: `## Amazon CloudWatch
**Amazon CloudWatch** отслеживает ваши **ресурсы AWS и приложения, которые работают в AWS, в реальном времени**.
- **Metrics (метрики)** — упорядоченные во времени точки данных, например CPUUtilization или NetworkIn; сервисы AWS публикуют стандартные метрики, а свои можно добавить как **custom metrics**.
- **Alarms (алармы)** — следят за метрикой и при пересечении порога **действуют**: уведомляют **топик Amazon SNS**, запускают действие **EC2 Auto Scaling** или **действие EC2** (stop, terminate, reboot, recover).
- **Logs** — CloudWatch Logs собирает, хранит и ищет лог-файлы; **dashboards** показывают метрики и алармы на одном экране; **events** (теперь Amazon EventBridge) направляют изменения в вашей среде к целям.
Аларм задаётся метрикой, статистикой (Average, Sum, Minimum, Maximum, SampleCount), периодом, порогом и числом периодов с превышением. Его состояние — **OK**, **ALARM** или **INSUFFICIENT_DATA**.
= CPUUtilization > 70 for 2 periods of 5 minutes -> ALARM -> SNS topic + scale out
- **Basic monitoring** EC2 присылает метрики раз в **5 минут** бесплатно; **detailed monitoring** — раз в **1 минуту** за плату.
- **Память и занятое место на диске** внутри ОС **не входят** в стандартные метрики EC2 — для них ставят **CloudWatch agent**.
@diagram cc10-alarm-flow
| Сервис | Отвечает на вопрос | Пример |
|---|---|---|
| Amazon CloudWatch | как ресурсы и приложения работают сейчас? | CPU на 90%, алармы, логи, дашборды |
| AWS CloudTrail | кто, что и когда сделал — какой вызов API? | какой пользователь вчера удалил инстанс EC2 |
| AWS Config | как настроен ресурс и соответствует ли правилам? | история изменений security group |
## Amazon SNS против Amazon SQS
**Amazon SNS (Simple Notification Service)** — управляемый сервис **publish/subscribe**: сообщение, опубликованное в **топик (topic)**, **сразу проталкивается (push)** каждому **подписчику** — email, SMS, HTTP/HTTPS, **очереди SQS**, Lambda, мобильные push-уведомления. Именно SNS **рассылает оповещения по алармам CloudWatch**.
**Amazon SQS (Simple Queue Service)** — управляемая **очередь сообщений**: отправитель кладёт сообщение, получатель **забирает (poll)** его **позже**, обрабатывает и удаляет. Очередь **развязывает (decouples)** компоненты; сообщения ждут 4 дня по умолчанию (до 14). **Standard**-очереди: доставка хотя бы один раз, порядок не гарантирован; **FIFO**-очереди: обработка ровно один раз, строгий порядок.
| Признак | Amazon SNS | Amazon SQS |
|---|---|---|
| Модель | publish/subscribe, один ко многим | очередь, каждое сообщение обрабатывает один получатель |
| Доставка | push, сразу | получатели сами забирают (pull), когда готовы |
| Хранение | не хранится для чтения позже | хранится, пока не обработано |
| Типичное применение | оповещения, уведомления, fan-out | буфер, развязка компонентов, обработка позже |
**Fan-out**: очереди SQS подписываются на топик SNS, и одно сообщение **сразу** уходит людям и **копируется в каждую очередь**, где воркеры обработают его **позже**.
> Ловушка экзамена — баг-трекер: одних инженеров нужно оповестить **сразу**, другие обработают отчёты **позже** → **Amazon SNS** (вместе с SQS через fan-out). Одна SQS лишь хранит сообщения до опроса — она никого не оповещает.
## Amazon Route 53
**Amazon Route 53** — **высокодоступный и масштабируемый облачный DNS-сервис**: переводит имена вроде www.example.com в IP-адреса и направляет пользователей к инфраструктуре **в AWS или вне её**. Ещё он регистрирует **доменные имена** и выполняет **health checks**; при **DNS failover** отвечает адресом резервной точки (например, статического сайта в S3), когда основная нездорова. Имя — от **порта 53**, порта DNS.
| Политика | Маршрутизирует по | Типичный случай |
|---|---|---|
| Simple | одна запись, без особой логики | один веб-сервер |
| Weighted | заданные веса, например 90 / 10 | A/B-тесты, постепенный выпуск версии |
| Latency-based | наименьшей задержке до региона AWS | пользователи в Европе и Азии получают самый быстрый регион |
| Geolocation | континенту или стране пользователя | локализованный контент, юридические или лицензионные ограничения |
| Geoproximity | расположению пользователей и ресурсов, со смещением (bias) | перевести больше трафика в один регион |
| Failover | здоровью основной записи | аварийное переключение active-passive |
| Multivalue answer | до восьми здоровых записей, случайно | простое распределение через DNS с health checks |
@diagram cc10-latency
> Ловушка экзамена: «пользователи в Европе и Азии жалуются на медленную работу; нужно автоматически направлять их в **ближайший регион**» → **latency-based routing**: «ближайший» здесь значит самый быстрый. **Geolocation** выбирают, когда важно само местоположение (законы, язык, права); **weighted** делит трафик по процентам; у **simple** логики нет. Latency routing помогает, только если приложение работает и в регионах рядом с этими пользователями.
## Amazon CloudFront
**Amazon CloudFront** — **сеть доставки контента (CDN)** AWS: она доставляет данные, видео, приложения и API с **низкой задержкой**, храня копии в **edge locations** и **regional edge caches**. **Origin** хранит оригинал (бакет S3, EC2, балансировщик, любой HTTP-сервер); **distribution** задаёт, что кэшировать; **TTL** — как долго. Защита от DDoS **AWS Shield Standard** включена без доплаты; оплата по факту использования.
> Route 53 решает, **куда** отправить пользователя (DNS); CloudFront **кэширует контент рядом с пользователями**, даже если приложение живёт в одном регионе.
?? Какой сервис отправит команде письмо, когда аларм CloudWatch перейдёт в состояние ALARM?
?= Amazon SNS: действие аларма публикует сообщение в топик SNS с подпиской по email.
?? Пользователям в Азии медленно, а приложение работает только в us-east-1. Поможет ли одна latency-based routing?
?= Нет: она выбирает среди регионов, где приложение уже работает. Нужно развернуть копию в азиатском регионе или кэшировать контент через CloudFront.`,
      },
      [
        qx("Which AWS service helps you monitor your AWS resources and the applications that you run on AWS in real time?", "Amazon CloudWatch", [
          ["AWS CloudTrail", "CloudTrail records API calls for auditing — who did what — not real-time performance.", "CloudTrail записывает вызовы API для аудита — кто что сделал, — а не производительность в реальном времени."],
          ["AWS Cloud9", "Cloud9 is a cloud IDE for writing code.", "Cloud9 — облачная среда разработки для написания кода."],
          ["AWS CloudMonitoring", "There is no AWS service with this name; it is a made-up distractor.", "Сервиса AWS с таким названием нет — это выдуманный вариант."],
        ], "CloudWatch collects metrics and logs, raises alarms and shows dashboards for AWS resources and applications in real time.", "CloudWatch собирает метрики и логи, поднимает алармы и показывает дашборды по ресурсам и приложениям AWS в реальном времени."),
        qx("Which service would you use to send alerts based on Amazon CloudWatch alarms?", "Amazon SNS", [
          ["AWS CloudTrail", "CloudTrail logs API activity; it does not deliver notifications.", "CloudTrail логирует активность API и не доставляет уведомления."],
          ["Amazon Route 53", "Route 53 is DNS; it routes users, not alerts.", "Route 53 — это DNS: он направляет пользователей, а не оповещения."],
          ["AWS Trusted Advisor", "Trusted Advisor gives best-practice recommendations, not alarm notifications.", "Trusted Advisor даёт рекомендации по лучшим практикам, а не уведомления по алармам."],
        ], "A CloudWatch alarm action publishes to an SNS topic, and SNS pushes the alert to email, SMS and other subscribers.", "Действие аларма CloudWatch публикует сообщение в топик SNS, а SNS проталкивает его подписчикам — email, SMS и другим."),
        qx("Which AWS service will help a company identify the user who deleted an Amazon EC2 instance yesterday?", "AWS CloudTrail", [
          ["Amazon CloudWatch", "CloudWatch tracks metrics, logs and alarms; it does not record who called which API.", "CloudWatch следит за метриками, логами и алармами, но не записывает, кто вызвал какой API."],
          ["Amazon Inspector", "Inspector scans workloads for vulnerabilities.", "Inspector ищет уязвимости в рабочих нагрузках."],
          ["AWS Trusted Advisor", "Trusted Advisor checks best practices; it keeps no record of user actions.", "Trusted Advisor проверяет лучшие практики и не хранит историю действий пользователей."],
        ], "CloudTrail records every API call with the identity, time and source, so it shows who terminated the instance.", "CloudTrail записывает каждый вызов API с личностью, временем и источником, поэтому покажет, кто удалил инстанс."),
        qx("CloudWatch shows CPU for an EC2 instance but no memory usage. How do you get memory metrics?", "Install the CloudWatch agent on the instance", [
          ["Turn on detailed monitoring for 1-minute data", "Detailed monitoring makes the default metrics more frequent; it does not add memory.", "Detailed monitoring лишь учащает стандартные метрики, памяти среди них не появится."],
          ["Enable AWS CloudTrail logging for the instance", "CloudTrail records API calls, not what happens inside the OS.", "CloudTrail записывает вызовы API, а не то, что происходит внутри ОС."],
          ["Attach a larger EBS volume to the instance", "Disk size has nothing to do with publishing memory metrics.", "Размер диска никак не связан с публикацией метрик памяти."],
        ], "Memory and disk usage are seen only from inside the OS; the CloudWatch agent publishes them as custom metrics.", "Память и занятость диска видны только изнутри ОС; CloudWatch agent публикует их как custom metrics."),
        qx("Which actions can a CloudWatch alarm start directly?", "Notify an SNS topic, scale an ASG, stop or reboot EC2", [
          ["Delete the IAM user and rewrite the security group rules", "Alarms do not change IAM or security groups.", "Алармы не меняют IAM и security groups."],
          ["Create a new VPC in another AWS Region", "Building networks is not an alarm action.", "Создание сетей — не действие аларма."],
          ["Restore an RDS database from a snapshot", "Restoring databases is not one of the alarm actions.", "Восстановление базы данных не входит в действия аларма."],
        ], "Alarm actions are SNS notifications, EC2 Auto Scaling actions and EC2 actions (stop, terminate, reboot, recover).", "Действия аларма — уведомления SNS, действия EC2 Auto Scaling и действия EC2 (stop, terminate, reboot, recover)."),
        qx("Which three states can a CloudWatch alarm be in?", "OK, ALARM, INSUFFICIENT_DATA", [
          ["RUNNING, STOPPED, TERMINATED", "These are EC2 instance states, not alarm states.", "Это состояния инстанса EC2, а не аларма."],
          ["HEALTHY, DEGRADED, UNAVAILABLE", "These sound like health-check results, not alarm states.", "Это похоже на результаты health checks, а не на состояния аларма."],
          ["PENDING, ACTIVE, STOPPED", "These are not CloudWatch alarm states.", "Это не состояния аларма CloudWatch."],
        ], "An alarm is OK, in ALARM, or INSUFFICIENT_DATA when there is not enough data to decide.", "Аларм бывает в OK, ALARM или INSUFFICIENT_DATA, когда данных не хватает для решения."),
        tfx("With EC2 basic monitoring, CloudWatch receives instance metrics every 5 minutes at no extra charge.", true,
          "Basic monitoring is free with 5-minute data; detailed monitoring gives 1-minute data for a fee.",
          "Basic monitoring бесплатен и даёт данные раз в 5 минут; detailed monitoring — раз в минуту за плату.",
          "'False' would swap the two: 1-minute data is the paid detailed monitoring.",
          "Ответ «неверно» перепутал бы режимы: данные раз в минуту — это платный detailed monitoring."),
        qx("Which service records the configuration history of a security group and checks it against compliance rules?", "AWS Config", [
          ["AWS CloudTrail", "CloudTrail records who called the API, not the resulting configuration and its compliance.", "CloudTrail записывает, кто вызвал API, а не получившуюся конфигурацию и её соответствие правилам."],
          ["Amazon CloudWatch", "CloudWatch watches performance metrics and logs.", "CloudWatch следит за метриками производительности и логами."],
          ["AWS Trusted Advisor", "Trusted Advisor gives general best-practice checks, not a configuration history.", "Trusted Advisor даёт общие проверки лучших практик, а не историю конфигураций."],
        ], "AWS Config keeps a history of resource configurations and evaluates them against rules.", "AWS Config хранит историю конфигураций ресурсов и проверяет их по правилам."),
        qx("A software company must notify engineers whenever a new bug is reported. Some need the notice immediately, others will process bug reports later. Which service should it choose?", "Amazon SNS", [
          ["Amazon SQS", "SQS only stores messages until a consumer polls them; it notifies no one immediately. It can be an SNS subscriber for the 'later' group.", "SQS только хранит сообщения, пока их не заберут, и никого сразу не оповещает. Она может быть подписчиком SNS для тех, кто обработает позже."],
          ["Amazon EC2 Message Tool", "There is no AWS service with this name.", "Сервиса AWS с таким названием нет."],
          ["Elastic Load Balancing", "ELB spreads network traffic; it does not send notifications.", "ELB распределяет сетевой трафик и уведомления не отправляет."],
        ], "SNS pushes the message to people at once and, through fan-out to an SQS queue, keeps a copy for those who process it later.", "SNS сразу проталкивает сообщение людям, а через fan-out в очередь SQS оставляет копию для тех, кто обработает позже."),
        qx("Which statement correctly contrasts Amazon SNS and Amazon SQS?", "SNS pushes to all subscribers; SQS keeps messages until polled", [
          ["SQS pushes to all subscribers; SNS keeps messages until polled", "The roles are swapped: SNS pushes, SQS stores.", "Роли перепутаны: SNS проталкивает, SQS хранит."],
          ["Both push messages, but SQS only supports email subscribers", "SQS does not push and has no email subscribers.", "SQS ничего не проталкивает и подписчиков по email не имеет."],
          ["SNS stores messages for 14 days; SQS deletes them at once", "Up to 14 days of storage is an SQS feature; SNS delivers immediately.", "Хранение до 14 дней — свойство SQS; SNS доставляет сразу."],
        ], "SNS is publish/subscribe with immediate push; SQS is a queue where consumers poll messages when they are ready.", "SNS — publish/subscribe с мгновенной доставкой; SQS — очередь, из которой получатели забирают сообщения, когда готовы."),
        qx("What is the SNS fan-out pattern?", "One message to a topic is copied to several subscribed queues", [
          ["One queue message is read by many consumers at the same time", "In SQS each message is handled by one consumer, not by many at once.", "В SQS каждое сообщение обрабатывает один получатель, а не многие сразу."],
          ["Several topics are merged into a single FIFO queue", "Fan-out spreads one message out; it does not merge topics.", "Fan-out размножает одно сообщение, а не сливает топики."],
          ["A load balancer copies each request to all its targets", "A load balancer sends each request to one target.", "Балансировщик отправляет каждый запрос одной цели."],
        ], "SQS queues (and other endpoints) subscribe to one SNS topic, so a single publish lands in every queue for parallel, later processing.", "Очереди SQS (и другие точки) подписаны на один топик SNS, и одна публикация попадает в каждую очередь для параллельной обработки позже."),
        qx("The web tier must keep accepting orders even while the processing workers are slow or offline; workers handle the orders later. What should sit between them?", "Amazon SQS", [
          ["Amazon SNS", "SNS pushes immediately and does not hold messages until workers are ready.", "SNS проталкивает сразу и не держит сообщения, пока воркеры не будут готовы."],
          ["Amazon CloudWatch", "CloudWatch monitors; it does not carry orders between tiers.", "CloudWatch наблюдает, а не передаёт заказы между уровнями."],
          ["Elastic Load Balancing", "ELB needs healthy targets right now; it cannot store requests for later.", "ELB нужны здоровые цели прямо сейчас; хранить запросы на потом он не умеет."],
        ], "An SQS queue decouples the tiers: orders wait in the queue until a worker polls and processes them.", "Очередь SQS развязывает уровни: заказы ждут в очереди, пока воркер не заберёт и не обработает их."),
        tfx("An Amazon SQS queue pushes each new message to every subscriber at the same moment.", false,
          "That describes SNS. In SQS, consumers poll the queue, and each message is processed by one consumer and then deleted.",
          "Это описание SNS. В SQS получатели сами опрашивают очередь, и каждое сообщение обрабатывает один получатель, после чего его удаляют.",
          "'True' mixes up the two services: push to all subscribers is publish/subscribe, i.e. SNS.",
          "Ответ «верно» путает два сервиса: push всем подписчикам — это publish/subscribe, то есть SNS."),
        qx("Users in Europe and Asia get slow responses from a website hosted in a single US Region. The team wants to route users to the closest AWS Region automatically. Which Route 53 routing policy is best?", "Latency-based routing", [
          ["Weighted routing", "Weighted routing splits traffic by percentages you set, not by speed.", "Weighted routing делит трафик по заданным процентам, а не по скорости."],
          ["Geolocation routing", "Geolocation follows the user's country for legal or content reasons, not the lowest latency.", "Geolocation следует стране пользователя ради законов или контента, а не наименьшей задержки."],
          ["Multivalue answer routing", "Multivalue returns several random healthy records with no regard to latency.", "Multivalue возвращает несколько случайных здоровых записей без учёта задержки."],
        ], "Latency-based routing answers with the Region that has the lowest latency for each user, once the app runs in several Regions.", "Latency-based routing отвечает регионом с наименьшей задержкой для каждого пользователя, когда приложение работает в нескольких регионах."),
        qx("A streaming service may show some films only to users in Kazakhstan because of licensing rules. Which routing policy fits?", "Geolocation routing", [
          ["Latency-based routing", "The fastest Region could serve users from another country; licensing needs the user's location.", "Самый быстрый регион может обслужить и пользователей из другой страны; для лицензий важно местоположение."],
          ["Weighted routing", "Weights split traffic by percentage regardless of where users are.", "Веса делят трафик по процентам независимо от того, где пользователи."],
          ["Multivalue answer routing", "Multivalue returns random healthy records, ignoring location.", "Multivalue возвращает случайные здоровые записи без учёта местоположения."],
        ], "Geolocation routing answers by the user's continent or country — for localized content and legal or licensing restrictions.", "Geolocation routing отвечает по континенту или стране пользователя — для локализованного контента и юридических или лицензионных ограничений."),
        qx("A team wants to send 10% of users to a new version of its site and 90% to the old one. Which routing policy fits?", "Weighted routing", [
          ["Failover routing", "Failover sends traffic to a backup only when the primary is unhealthy.", "Failover отправляет трафик на резерв, только когда основная точка нездорова."],
          ["Geolocation routing", "Geolocation splits by country, not by percentage.", "Geolocation делит по странам, а не по процентам."],
          ["Simple routing", "Simple routing has no way to split traffic in proportions.", "Simple routing не умеет делить трафик в пропорциях."],
        ], "Weighted routing assigns weights such as 90 and 10 to records — ideal for A/B tests and gradual rollouts.", "Weighted routing назначает записям веса вроде 90 и 10 — идеально для A/B-тестов и постепенного выпуска."),
        qx("The main site runs in us-east-1. If its health check fails, users must see a static backup page hosted in Amazon S3. Which routing policy fits?", "Failover routing", [
          ["Weighted routing", "Weights split traffic all the time; they do not react to the primary's health.", "Веса делят трафик постоянно и не реагируют на здоровье основной точки."],
          ["Latency-based routing", "Latency routing picks the fastest Region, not a backup for failures.", "Latency routing выбирает самый быстрый регион, а не резерв на случай сбоя."],
          ["Geoproximity routing", "Geoproximity routes by distance and bias, not by health.", "Geoproximity маршрутизирует по расстоянию и смещению, а не по здоровью."],
        ], "Failover routing is active-passive: Route 53 answers with the secondary record when health checks mark the primary unhealthy.", "Failover routing — схема active-passive: Route 53 отвечает резервной записью, когда health checks признают основную нездоровой."),
        qx("Which Route 53 policy routes by the location of both users and resources and lets you shift traffic with a bias?", "Geoproximity routing", [
          ["Geolocation routing", "Geolocation looks only at the user's location and has no bias setting.", "Geolocation смотрит только на местоположение пользователя, настройки bias у него нет."],
          ["Latency-based routing", "Latency routing measures network latency, not geographic distance.", "Latency routing меряет сетевую задержку, а не географическое расстояние."],
          ["Multivalue answer routing", "Multivalue returns random healthy records.", "Multivalue возвращает случайные здоровые записи."],
        ], "Geoproximity uses the locations of users and resources; a bias makes a Region's area bigger or smaller to shift traffic.", "Geoproximity учитывает расположение пользователей и ресурсов; bias увеличивает или уменьшает зону региона, чтобы сместить трафик."),
        qx("Product images load slowly for users worldwide, but the application must stay in one Region. Which service helps most?", "Amazon CloudFront", [
          ["Route 53 latency routing", "Latency routing needs copies of the app in several Regions; here there is only one.", "Latency routing нужны копии приложения в нескольких регионах, а здесь регион один."],
          ["A Network Load Balancer", "An NLB spreads traffic inside the Region; it brings nothing closer to users.", "NLB распределяет трафик внутри региона и ничего не приближает к пользователям."],
          ["A NAT gateway in each AZ", "NAT gateways give private subnets outbound internet access.", "NAT gateways дают частным подсетям выход в интернет."],
        ], "CloudFront caches the images in edge locations near users, so they load fast while the origin stays in one Region.", "CloudFront кэширует картинки в edge locations рядом с пользователями, и они грузятся быстро, хотя origin остаётся в одном регионе."),
        tfx("Latency-based routing helps users in Asia only if the application is also deployed in a Region closer to them.", true,
          "Route 53 can only choose among endpoints that exist; with a single US Region there is nothing faster to send them to.",
          "Route 53 выбирает только среди существующих точек; если регион один, в США, отправить пользователей быстрее некуда.",
          "'False' assumes DNS can make one distant Region faster; it cannot — it only picks a destination.",
          "Ответ «неверно» предполагает, что DNS может ускорить далёкий регион; не может — он лишь выбирает, куда отправить."),
      ],
    ),
    part(
      "cc-l10-p4",
      { en: "Labs 2 and 6: build a VPC, then scale and load balance it", ru: "Лабы 2 и 6: построить VPC, затем масштабировать и балансировать" },
      {
        en: `## Lab 2 — Build your VPC and launch a web server
Goal: build a two-AZ network by hand and run a web server in it — the same network that Lab 6 later scales.
- **Create the VPC** — the VPC wizard creates **Lab VPC** (lab-vpc in newer versions) with CIDR **10.0.0.0/16** in one AZ: **public subnet 10.0.0.0/24**, **private subnet 10.0.1.0/24**, an **internet gateway**, and a **NAT gateway** with an **Elastic IP** in the public subnet.
- **Add subnets in a second AZ** — **public subnet 2: 10.0.2.0/24** and **private subnet 2: 10.0.3.0/24**; associate public subnet 2 with the **public route table** and private subnet 2 with the **private route table**.
- **Create a security group** — **Web Security Group** ("Enable HTTP access"): inbound **HTTP, port 80, source 0.0.0.0/0** ("Permit web requests").
- **Launch the web server** — **Web Server 1** (Amazon Linux) in **public subnet 2**, **auto-assign public IP** enabled, Web Security Group attached; a **user data** script installs Apache and PHP and starts the web app. Then open its **public IPv4 DNS** name in a browser.
| Subnet | AZ | CIDR | Route table |
|---|---|---|---|
| Public subnet 1 | first | 10.0.0.0/24 | public |
| Private subnet 1 | first | 10.0.1.0/24 | private |
| Public subnet 2 | second | 10.0.2.0/24 | public |
| Private subnet 2 | second | 10.0.3.0/24 | private |
= public RT: 10.0.0.0/16 -> local, 0.0.0.0/0 -> igw-id    private RT: 10.0.0.0/16 -> local, 0.0.0.0/0 -> nat-gw-id
## What the lab teaches — and the exam asks
- A subnet is **public** because its route table has **0.0.0.0/0 → internet gateway**. It is not bigger, and it is not "IPv4 only".
- Each subnet sits in **one AZ**; for high availability the lab repeats the public/private pair in a **second AZ**.
- Web Server 1 needs a **public IP** to be **reachable from the internet**, and its security group must allow **port 80**, or the browser times out although the instance runs. If only SSH (22) is open, the simplest fix is to **add an inbound rule for TCP 80** — no new group, no reboot.
- A **private** instance reaches the internet only through the **NAT gateway**: if the NAT gateway is missing, or the private route table has no 0.0.0.0/0 → nat-gw-id route, downloads fail. CloudFront, Direct Connect or an Elastic IP on the private instance do not fix it.
- The **network ACL** is the **optional** security layer at the **subnet** level; the security group works at the instance level.
- **Amazon VPC** is the service that lets you **customize the network configuration**: IP range, subnets, route tables, gateways.
> Exam answer: "What CIDR block was assigned to the main VPC?" → **10.0.0.0/16**. 172.16.0.0/16 and 192.168.0.0/16 are private ranges too, and 100.64.0.0/16 belongs to the shared carrier range — but the lab uses 10.0.0.0/16.
The lecture slides draw other numbers (public 10.0.1.0/24, private 10.0.2.0/24); the lab starts at 10.0.0.0/24. Both live inside the same 10.0.0.0/16.
## The "What is this?" picture
@diagram cc-vpc
A midterm picture shows VPC 10.0.0.0/16 in one AZ: public subnet 10.0.1.0/24, private subnet 10.0.2.0/24, a public and a private route table, and an internet gateway (igw-id). The hidden label belongs to the **round icon inside the public subnet** that the **private route table points to** — the **NAT gateway**. It is the slide "Network address translation (NAT) gateway"; the hidden label reads "NAT gateway (nat-gw-id)".
- **Not VPC peering** — peering joins **two VPCs** through a pcx-id route, and the picture has only one VPC.
- Not Route 53 or CloudFront — global services that are never drawn inside a subnet; "Amazon Firewall" is not an AWS service.
## Lab 6 — Scale and load balance your architecture
It starts from the Lab 2 network: two public and two private subnets in two AZs, with Web Server 1 in public subnet 2.
- **Create an AMI** from Web Server 1 (**Web Server AMI**) — the image every new instance boots from.
- **Create an Application Load Balancer** (LabELB) in **both public subnets**, with the Web Security Group; its **HTTP:80 listener** forwards to a new **target group**. No instances are registered by hand.
- **Create a launch template** — Web Server AMI, a small instance type, Web Security Group.
- **Create the Auto Scaling group** in **private subnets 1 and 2** (10.0.1.0/24, 10.0.3.0/24), attached to the target group, with **ELB health checks** and CloudWatch group metrics on; **min 2, desired 2, max 6**; **target tracking on average CPU utilization, target 60%**.
- **Verify** — two "Lab Instance" targets become **healthy**; the load balancer's **DNS name** opens the app.
- **Test Auto Scaling** — the app's **load test** pushes CPU up; the alarm that target tracking created (**AlarmHigh**) goes into **ALARM**, and the group launches more instances. Finally **Web Server 1 is terminated**: the group now runs the app.
> Lab 6 in one line: AMI → ALB in public subnets → launch template → ASG in private subnets with target tracking → load test → CloudWatch alarm → more instances.
?? In Lab 6 the instances sit in private subnets with no public IPs. How do users reach them?
?= Through the ALB in the public subnets: users open its DNS name, and it forwards requests to healthy targets in the private subnets.
?? In Lab 2, an instance in private subnet 2 cannot download updates. What do you check?
?= That private subnet 2 is associated with the private route table whose 0.0.0.0/0 route targets the NAT gateway.`,
        ru: `## Lab 2 — Build your VPC and launch a web server
Цель: вручную построить сеть в двух AZ и запустить в ней веб-сервер — ту самую сеть, которую потом масштабирует Lab 6.
- **Создать VPC** — мастер VPC (VPC wizard) создаёт **Lab VPC** (в новых версиях — lab-vpc) с CIDR **10.0.0.0/16** в одной AZ: **публичная подсеть 10.0.0.0/24**, **частная подсеть 10.0.1.0/24**, **internet gateway** и **NAT gateway** с **Elastic IP** в публичной подсети.
- **Добавить подсети во второй AZ** — **public subnet 2: 10.0.2.0/24** и **private subnet 2: 10.0.3.0/24**; public subnet 2 связать с **публичной route table**, private subnet 2 — с **частной route table**.
- **Создать security group** — **Web Security Group** («Enable HTTP access»): входящее правило **HTTP, порт 80, источник 0.0.0.0/0** («Permit web requests»).
- **Запустить веб-сервер** — **Web Server 1** (Amazon Linux) в **public subnet 2**, включён **auto-assign public IP**, подключена Web Security Group; скрипт **user data** ставит Apache и PHP и запускает веб-приложение. Затем его **public IPv4 DNS** открывают в браузере.
| Подсеть | AZ | CIDR | Route table |
|---|---|---|---|
| Public subnet 1 | первая | 10.0.0.0/24 | публичная |
| Private subnet 1 | первая | 10.0.1.0/24 | частная |
| Public subnet 2 | вторая | 10.0.2.0/24 | публичная |
| Private subnet 2 | вторая | 10.0.3.0/24 | частная |
= public RT: 10.0.0.0/16 -> local, 0.0.0.0/0 -> igw-id    private RT: 10.0.0.0/16 -> local, 0.0.0.0/0 -> nat-gw-id
## Чему учит лаба — и о чём спрашивает экзамен
- Подсеть **публичная**, потому что в её route table есть **0.0.0.0/0 → internet gateway**. Она не больше по размеру и не «только IPv4».
- Каждая подсеть находится **в одной AZ**; ради высокой доступности лаба повторяет пару public/private **во второй AZ**.
- Web Server 1 нужен **публичный IP**, чтобы быть **доступным из интернета**, а его security group должна пропускать **порт 80**, иначе браузер не дождётся ответа, хотя инстанс работает. Если открыт только SSH (22), проще всего **добавить входящее правило для TCP 80** — без новой группы и без перезагрузки.
- **Частный** инстанс выходит в интернет только через **NAT gateway**: если NAT gateway нет или в частной route table нет маршрута 0.0.0.0/0 → nat-gw-id, загрузки не проходят. CloudFront, Direct Connect или Elastic IP на частном инстансе этого не исправят.
- **Network ACL** — **необязательный** уровень защиты на уровне **подсети**; security group работает на уровне инстанса.
- **Amazon VPC** — сервис, который позволяет **настраивать конфигурацию сети**: диапазон IP, подсети, route tables, шлюзы.
> Ответ на экзамене: «Какой CIDR-блок назначен основному VPC?» → **10.0.0.0/16**. 172.16.0.0/16 и 192.168.0.0/16 — тоже частные диапазоны, а 100.64.0.0/16 входит в общий диапазон операторов связи, — но в лабе используется 10.0.0.0/16.
На слайдах лекции другие числа (публичная 10.0.1.0/24, частная 10.0.2.0/24); лаба начинает с 10.0.0.0/24. И то, и другое лежит внутри одного 10.0.0.0/16.
## Картинка «What is this?»
@diagram cc-vpc
На картинке из мидтерма — VPC 10.0.0.0/16 в одной AZ: публичная подсеть 10.0.1.0/24, частная 10.0.2.0/24, публичная и частная route tables и internet gateway (igw-id). Скрытая подпись относится к **круглому значку в публичной подсети**, на который **указывает частная route table**, — это **NAT gateway**. Это слайд «Network address translation (NAT) gateway»; под закрытым полем написано «NAT gateway (nat-gw-id)».
- **Не VPC peering** — peering соединяет **два VPC** через маршрут на pcx-id, а на картинке VPC только один.
- Не Route 53 и не CloudFront — это глобальные сервисы, их никогда не рисуют внутри подсети; «Amazon Firewall» — вообще не сервис AWS.
## Lab 6 — Scale and load balance your architecture
Она начинается с сети из Lab 2: две публичные и две частные подсети в двух AZ, Web Server 1 — в public subnet 2.
- **Создать AMI** из Web Server 1 (**Web Server AMI**) — образ, с которого стартует каждый новый инстанс.
- **Создать Application Load Balancer** (LabELB) в **обеих публичных подсетях** с Web Security Group; его **слушатель HTTP:80** пересылает запросы в новую **target group**. Вручную инстансы не регистрируют.
- **Создать launch template** — Web Server AMI, небольшой тип инстанса, Web Security Group.
- **Создать Auto Scaling group** в **private subnets 1 и 2** (10.0.1.0/24, 10.0.3.0/24), привязанную к target group, с включёнными **ELB health checks** и метриками группы в CloudWatch; **min 2, desired 2, max 6**; **target tracking по среднему CPU, цель 60%**.
- **Проверить** — две цели «Lab Instance» становятся **healthy**; **DNS-имя** балансировщика открывает приложение.
- **Проверить Auto Scaling** — **нагрузочный тест** приложения поднимает CPU; аларм, созданный target tracking (**AlarmHigh**), переходит в **ALARM**, и группа запускает новые инстансы. В конце **Web Server 1 завершают**: приложение теперь держит группа.
> Lab 6 одной строкой: AMI → ALB в публичных подсетях → launch template → ASG в частных подсетях с target tracking → нагрузочный тест → аларм CloudWatch → больше инстансов.
?? В Lab 6 инстансы стоят в частных подсетях без публичных IP. Как до них доходят пользователи?
?= Через ALB в публичных подсетях: пользователи открывают его DNS-имя, а он пересылает запросы здоровым целям в частных подсетях.
?? В Lab 2 инстанс в private subnet 2 не может скачать обновления. Что проверить?
?= Что private subnet 2 связана с частной route table, где маршрут 0.0.0.0/0 ведёт на NAT gateway.`,
      },
      [
        qx("In Lab 2, what CIDR block was assigned to the main VPC?", "10.0.0.0/16", [
          ["100.64.0.0/16", "100.64.0.0/16 belongs to the shared carrier-grade NAT range; the lab does not use it.", "100.64.0.0/16 входит в общий диапазон carrier-grade NAT; в лабе он не используется."],
          ["192.168.0.0/16", "192.168.0.0/16 is a private range, but the lab VPC is built on 10.0.0.0/16.", "192.168.0.0/16 — частный диапазон, но VPC лабы построен на 10.0.0.0/16."],
          ["172.16.0.0/16", "172.16.0.0/16 is a private range, but not the one the lab assigns.", "172.16.0.0/16 — частный диапазон, но не тот, что назначает лаба."],
        ], "The lab VPC is 10.0.0.0/16, and its four subnets are 10.0.0.0/24, 10.0.1.0/24, 10.0.2.0/24 and 10.0.3.0/24.", "VPC лабы — 10.0.0.0/16, а его четыре подсети — 10.0.0.0/24, 10.0.1.0/24, 10.0.2.0/24 и 10.0.3.0/24."),
        qx("What is the difference between a public and a private subnet?", "Only the public one routes 0.0.0.0/0 to an IGW", [
          ["A public subnet is always larger and has more IP addresses", "Size has nothing to do with it; a public /28 is still public.", "Размер тут ни при чём: публичная /28 всё равно публичная."],
          ["A private subnet only uses IPv6 addresses, never IPv4", "Both kinds use IPv4; IPv6 is optional for either.", "Оба вида используют IPv4; IPv6 необязателен для любого."],
          ["There is no difference; the names are only labels", "The difference is real: the route to the internet gateway.", "Разница настоящая — маршрут на internet gateway."],
        ], "A subnet is public when its route table sends 0.0.0.0/0 to an internet gateway; a private subnet has no such route.", "Подсеть публичная, когда её route table отправляет 0.0.0.0/0 на internet gateway; у частной такого маршрута нет."),
        qx("You deployed an EC2 instance in a private subnet of your VPC. When you try to reach the internet from it, the request fails. What is the MOST likely cause?", "No NAT gateway is provided for the subnet", [
          ["CloudFront must be enabled for outbound traffic", "CloudFront is a CDN for content delivery, not an exit to the internet.", "CloudFront — CDN для доставки контента, а не выход в интернет."],
          ["The VPC needs an AWS Direct Connect link", "Direct Connect links a data center to AWS; it does not give internet access.", "Direct Connect связывает дата-центр с AWS и не даёт выхода в интернет."],
          ["The instance has no Elastic IP attached", "A private subnet has no route to an internet gateway, so even an Elastic IP would not help.", "У частной подсети нет маршрута на internet gateway, так что даже Elastic IP не поможет."],
        ], "Private instances reach the internet only through a NAT gateway in a public subnet, with a 0.0.0.0/0 → nat-gw-id route.", "Частные инстансы выходят в интернет только через NAT gateway в публичной подсети и маршрут 0.0.0.0/0 → nat-gw-id."),
        qx("A diagram shows VPC 10.0.0.0/16 in one AZ: a public subnet 10.0.1.0/24 with a round icon, a private subnet 10.0.2.0/24, public and private route tables, and an internet gateway. The private route table points to the round icon. What is the icon?", "NAT gateway", [
          ["VPC peering", "Peering connects two VPCs through a pcx-id route; this picture has only one VPC.", "Peering соединяет два VPC через маршрут на pcx-id; на этой картинке VPC один."],
          ["Amazon Route 53", "Route 53 is a global DNS service and is never drawn inside a subnet.", "Route 53 — глобальный DNS-сервис, его не рисуют внутри подсети."],
          ["Amazon CloudFront", "CloudFront works at edge locations outside the VPC.", "CloudFront работает в edge locations вне VPC."],
        ], "It is the AWS slide 'Network address translation (NAT) gateway': the NAT gateway sits in the public subnet, and the private route table sends 0.0.0.0/0 to it.", "Это слайд AWS «Network address translation (NAT) gateway»: NAT gateway стоит в публичной подсети, а частная route table отправляет на него 0.0.0.0/0."),
        qx("Your web server is running, but users cannot open it in a browser. Its security group only allows SSH (port 22). What is the simplest fix?", "Add an inbound TCP 80 rule to the group", [
          ["Replace the security group with a new one", "A new group would still need the same port 80 rule; editing the existing one is simpler.", "Новой группе всё равно понадобится то же правило для порта 80; проще поправить существующую."],
          ["Configure an internet gateway for the VPC", "SSH already works, so the internet path exists; the missing piece is port 80.", "SSH уже работает, значит, путь из интернета есть; не хватает порта 80."],
          ["Reboot the instance to refresh firewall rules", "Security group changes apply at once; rebooting adds nothing.", "Изменения security group действуют сразу; перезагрузка ничего не даёт."],
        ], "Browsers use HTTP on port 80; adding an inbound rule for TCP 80 to the existing group opens the site immediately.", "Браузеры ходят по HTTP на порт 80; входящее правило для TCP 80 в существующей группе сразу открывает сайт."),
        qx("Which inbound rule does the Lab 2 'Web Security Group' contain?", "Inbound HTTP, port 80, from 0.0.0.0/0", [
          ["Inbound SSH, port 22, from 0.0.0.0/0", "The lab group is for web requests, so it opens HTTP, not SSH.", "Группа лабы нужна для веб-запросов, поэтому открывает HTTP, а не SSH."],
          ["Outbound HTTP, port 80, to 10.0.1.0/24", "The lab adds an inbound rule; outbound traffic is allowed by default.", "Лаба добавляет входящее правило; исходящий трафик и так разрешён по умолчанию."],
          ["Inbound HTTPS, port 443, from 10.0.0.0/16", "The rule is HTTP 80 from anywhere, not HTTPS from inside the VPC.", "Правило — HTTP 80 откуда угодно, а не HTTPS изнутри VPC."],
        ], "Web Security Group ('Enable HTTP access') allows HTTP on port 80 from anywhere — 'Permit web requests'.", "Web Security Group («Enable HTTP access») разрешает HTTP на порт 80 откуда угодно — «Permit web requests»."),
        qx("Which subnets does Lab 2 add in the second Availability Zone?", "10.0.2.0/24 public and 10.0.3.0/24 private", [
          ["10.0.1.0/24 public and 10.0.2.0/24 private", "10.0.1.0/24 is already private subnet 1 in the first AZ.", "10.0.1.0/24 — это уже private subnet 1 в первой AZ."],
          ["10.1.0.0/24 public and 10.1.1.0/24 private", "10.1.x.x is outside the VPC's 10.0.0.0/16 range.", "10.1.x.x лежит вне диапазона VPC 10.0.0.0/16."],
          ["10.0.0.0/24 public and 10.0.1.0/24 private", "These are the first-AZ subnets created by the wizard.", "Это подсети первой AZ, созданные мастером."],
        ], "The second AZ gets public subnet 2 (10.0.2.0/24) and private subnet 2 (10.0.3.0/24), with no overlap with the first pair.", "Во второй AZ появляются public subnet 2 (10.0.2.0/24) и private subnet 2 (10.0.3.0/24), не пересекаясь с первой парой."),
        qx("After creating public subnet 2 in Lab 2, which route table must it be associated with?", "The public table with 0.0.0.0/0 → IGW", [
          ["The private table with 0.0.0.0/0 → NAT", "That would make the subnet private: no inbound access from the internet.", "Так подсеть стала бы частной — без входящего доступа из интернета."],
          ["No table, since a subnet needs no routes", "Every subnet is associated with a route table; otherwise it falls back to the main one.", "Каждая подсеть связана с route table; иначе она попадает на main."],
          ["A new table with only the local route", "Only the local route keeps traffic inside the VPC — the subnet would not be public.", "Один local route держит трафик внутри VPC — подсеть не станет публичной."],
        ], "Public subnet 2 is public only after it is associated with the public route table that sends 0.0.0.0/0 to the internet gateway.", "Public subnet 2 становится публичной только после связи с публичной route table, которая отправляет 0.0.0.0/0 на internet gateway."),
        qx("Why does an EC2 instance in a public subnet need a public IP address?", "To be accessible from the internet", [
          ["To connect to the private subnets", "Inside the VPC, private IPs and the local route are enough.", "Внутри VPC хватает частных IP и local route."],
          ["To use the NAT gateway", "The NAT gateway serves private subnets; a public instance does not use it.", "NAT gateway обслуживает частные подсети; публичному инстансу он не нужен."],
          ["To run internal processes", "Processes inside the instance need no public address.", "Процессам внутри инстанса публичный адрес не нужен."],
        ], "The internet gateway can reach an instance only through a public IP address; the route alone is not enough.", "Internet gateway может достучаться до инстанса только через публичный IP-адрес; одного маршрута мало."),
        qx("What service enables you to customize the network configuration for your VPC?", "Amazon VPC", [
          ["Amazon VPC Management Service", "There is no service with this name; the service is simply Amazon VPC.", "Сервиса с таким названием нет; это просто Amazon VPC."],
          ["Amazon Cloud Networking", "This is not an AWS service name.", "Это не название сервиса AWS."],
          ["Amazon Subnetting Service", "Subnets are created inside Amazon VPC; there is no separate service.", "Подсети создают в Amazon VPC; отдельного сервиса нет."],
        ], "Amazon VPC lets you choose the IP range, create subnets and configure route tables and gateways.", "Amazon VPC позволяет выбрать диапазон IP, создать подсети и настроить route tables и шлюзы."),
        qx("Which of the following is an optional security control that can be applied at the subnet layer of a VPC?", "Network ACL", [
          ["Firewall", "'Firewall' is a generic word, not the VPC feature at the subnet layer.", "«Firewall» — общее слово, а не функция VPC на уровне подсети."],
          ["Web application firewall", "AWS WAF filters HTTP requests at CloudFront or a load balancer, not at the subnet.", "AWS WAF фильтрует HTTP-запросы на CloudFront или балансировщике, а не на подсети."],
          ["Security group", "A security group acts at the instance level.", "Security group работает на уровне инстанса."],
        ], "A network ACL is an optional extra layer that controls traffic in and out of one or more subnets.", "Network ACL — необязательный дополнительный уровень, который управляет трафиком в одну или несколько подсетей и из них."),
        tfx("In Lab 2 the NAT gateway is placed in a private subnet so that private instances can reach the internet.", false,
          "The NAT gateway sits in the public subnet, with an Elastic IP; the private route table sends 0.0.0.0/0 to it.",
          "NAT gateway стоит в публичной подсети с Elastic IP; частная route table отправляет на него 0.0.0.0/0.",
          "'True' would leave the NAT gateway itself without a route to the internet gateway.",
          "При ответе «верно» у самого NAT gateway не было бы маршрута на internet gateway."),
        qx("Why does Lab 6 begin by creating an AMI from Web Server 1?", "So new instances boot as copies of the configured web server", [
          ["So the load balancer can register Web Server 1 automatically", "Registration is done by the Auto Scaling group, not by an AMI.", "Регистрацию выполняет Auto Scaling group, а не AMI."],
          ["So CloudWatch can collect memory metrics from the server", "Memory metrics need the CloudWatch agent, not an image.", "Метрикам памяти нужен CloudWatch agent, а не образ."],
          ["So the VPC can be copied into a second Region", "An AMI is an instance image, not a copy of the network.", "AMI — образ инстанса, а не копия сети."],
        ], "The launch template uses the Web Server AMI, so every instance the group launches is an identical web server.", "Launch template использует Web Server AMI, поэтому каждый инстанс, запущенный группой, — одинаковый веб-сервер."),
        qx("Where does Lab 6 place the Application Load Balancer?", "In both public subnets, one per Availability Zone", [
          ["In both private subnets, next to the instances", "An internet-facing ALB must be in public subnets to receive user traffic.", "ALB, смотрящий в интернет, должен стоять в публичных подсетях, чтобы принимать трафик пользователей."],
          ["In public subnet 2 only, beside Web Server 1", "The lab selects both AZs and both public subnets for availability.", "Лаба выбирает обе AZ и обе публичные подсети ради доступности."],
          ["Outside the VPC, at a CloudFront edge location", "An ALB lives inside the VPC; edge locations belong to CloudFront.", "ALB живёт внутри VPC; edge locations принадлежат CloudFront."],
        ], "The ALB spans public subnets 1 and 2 in two AZs and forwards requests to targets in the private subnets.", "ALB охватывает public subnets 1 и 2 в двух AZ и пересылает запросы целям в частных подсетях."),
        qx("In which subnets does Lab 6 create the Auto Scaling group?", "Private subnets 1 and 2 (10.0.1.0/24, 10.0.3.0/24)", [
          ["Public subnets 1 and 2 (10.0.0.0/24, 10.0.2.0/24)", "The public subnets hold the load balancer; the app servers stay private.", "В публичных подсетях стоит балансировщик; серверы приложения остаются частными."],
          ["Only public subnet 2, where Web Server 1 is already running", "One subnet in one AZ would lose high availability.", "Одна подсеть в одной AZ лишила бы схему высокой доступности."],
          ["One private subnet in a single AZ (10.0.1.0/24)", "The lab uses two AZs so the group survives an AZ failure.", "Лаба использует две AZ, чтобы группа пережила сбой одной."],
        ], "The group launches instances in both private subnets, across two AZs, behind the ALB.", "Группа запускает инстансы в обеих частных подсетях, в двух AZ, за ALB."),
        qx("During the Lab 6 load test, what makes the Auto Scaling group launch more instances?", "The target tracking alarm on CPU goes into ALARM", [
          ["The ALB health check fails on Web Server 1", "Health checks replace broken instances; they do not add capacity under load.", "Health checks заменяют сломанные инстансы, а не добавляют мощность под нагрузкой."],
          ["A scheduled action fires at the moment the load test starts", "The lab sets no schedule; scaling follows CPU.", "Расписания в лабе нет; масштабирование идёт за CPU."],
          ["Route 53 sends more DNS queries to the Region", "Route 53 is not part of the lab and does not scale instances.", "Route 53 в лабе не участвует и инстансы не масштабирует."],
        ], "Target tracking created a CloudWatch alarm (AlarmHigh); when average CPU passes the target, it fires and the group scales out.", "Target tracking создал аларм CloudWatch (AlarmHigh); когда средний CPU превышает цель, он срабатывает, и группа расширяется."),
        qx("In Lab 6, what does the group's target tracking policy keep near its target value?", "Average CPU utilization of the group", [
          ["Free memory reported by each instance", "Memory is not a default EC2 metric and is not the lab's target.", "Память — не стандартная метрика EC2 и не цель лабы."],
          ["The number of open SSH sessions", "SSH sessions are not a scaling metric.", "Число SSH-сессий — не метрика масштабирования."],
          ["Bytes sent through the NAT gateway", "NAT traffic is not what the lab scales on.", "Трафик через NAT — не то, по чему масштабируется лаба."],
        ], "The lab's policy tracks the average CPU utilization of the group and adds or removes instances to stay near the target.", "Политика лабы следит за средней загрузкой CPU группы и добавляет или убирает инстансы, чтобы держаться у цели."),
        qx("In Lab 6 the web servers sit in private subnets with no public IPs. How do users reach the app?", "Through the DNS name of the load balancer", [
          ["Through each instance's public IP address", "The instances in private subnets have no public IPs.", "У инстансов в частных подсетях нет публичных IP."],
          ["Through the NAT gateway in the public subnet", "A NAT gateway allows only outbound connections from private instances.", "NAT gateway пропускает только исходящие подключения частных инстансов."],
          ["Through an SSH tunnel via Web Server 1", "Users browse over HTTP; Web Server 1 is even terminated at the end.", "Пользователи ходят по HTTP; а Web Server 1 в конце вообще завершают."],
        ], "Users open the ALB's DNS name; the ALB in the public subnets forwards requests to healthy targets in the private subnets.", "Пользователи открывают DNS-имя ALB; ALB в публичных подсетях пересылает запросы здоровым целям в частных подсетях."),
        qx("Why does Lab 6 turn on ELB health checks for the Auto Scaling group?", "So instances failing the ALB check are replaced", [
          ["So the load balancer can launch new instances by itself", "Load balancers never launch instances; Auto Scaling does.", "Балансировщики не запускают инстансы — это делает Auto Scaling."],
          ["So CloudWatch stops charging for metrics", "Health checks have nothing to do with CloudWatch billing.", "Health checks никак не связаны с оплатой CloudWatch."],
          ["So the instances receive public IP addresses", "Health checks do not assign addresses.", "Health checks не назначают адреса."],
        ], "With ELB health checks on, an instance that runs but fails the load balancer's check is terminated and replaced by the group.", "С включёнными ELB health checks инстанс, который работает, но не проходит проверку балансировщика, группа завершает и заменяет."),
        tfx("In Lab 6 you register the Auto Scaling instances in the target group by hand, one by one.", false,
          "The group is attached to the target group and registers every instance it launches automatically.",
          "Группа привязана к target group и сама регистрирует каждый запущенный инстанс.",
          "'True' would break scaling: new instances would get no traffic until someone added them.",
          "При ответе «верно» масштабирование бы не работало: новые инстансы не получали бы трафик, пока их кто-то не добавит."),
      ],
    ),
  ],
};
