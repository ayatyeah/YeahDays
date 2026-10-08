import type { FastTrack } from "../types";

/**
 * Фаст-мод Cloud Computing: подготовка к мидтерму (Moodle, 40 вопросов по 1 баллу,
 * ~15 минут) по AWS Academy Cloud Foundations, модули 1–10, и лабам 1–6 — за 2,5 часа.
 * Блоки идут от самых «баллоёмких» тем по реальным вопросам (real.ts); формулировки
 * и факты сверены с лекциями l6–l10, real.ts и шпаргалкой extras.ts.
 */
export const ccFast: FastTrack = {
  hours: 2.5,
  intro: {
    en: "Fast mode for the Cloud Computing midterm: 40 questions in about 15 minutes on AWS Cloud Foundations (modules 1–10) and labs 1–6. Read the blocks in order — the first ones carry the most points — and answer every ?? question aloud before opening the answer. Then go through \"Real midterm questions\" and take the final 40-question quiz at exam pace.",
    ru: "Фаст-мод к мидтерму по Cloud Computing: 40 вопросов примерно за 15 минут по AWS Cloud Foundations (модули 1–10) и лабам 1–6. Блоки стоит читать по порядку — первые дают больше всего баллов, — а на каждый вопрос ?? отвечать вслух, прежде чем открывать ответ. Потом — «Реальные вопросы мидтерма» и итоговый квиз на 40 вопросов в темпе экзамена.",
  },
  sections: [
    {
      id: "cc-fast-1",
      title: { en: "40 questions in 15 minutes: signal → answer", ru: "40 вопросов за 15 минут: сигнал → ответ" },
      minutes: 15,
      notes: {
        en: `## How the midterm works
- Moodle quiz: **40 questions, 1 point each, about 15 minutes** — roughly 20 seconds per question. Most are single choice; some are True/False, a few are "What is this?" pictures and "select all that apply".
- Scope: **AWS Academy Cloud Foundations, modules 1–10, and labs 1–6**. No calculations and no code.
- Almost every question is a short scenario with a **signal phrase** that points to exactly one service or option. Spot the signal → answer → next.
> Tactic: read the **last line** first (what is actually asked), then scan the scenario for the signal. In doubt — choose, **flag**, come back at the end. A blank answer is a guaranteed zero.
## Signal in the question → answer
| Signal in the question | Answer |
|---|---|
| "temporary access", an app on EC2 needs S3 or DynamoDB | **IAM role** |
| the same permissions for many users | **IAM group** with a policy |
| a policy embedded in one user or group, deleted with it | **inline policy** |
| "who deleted / who changed", API call history, audit | **AWS CloudTrail** |
| "monitor in real time", metrics, alarms, logs | **Amazon CloudWatch** |
| "send alerts from CloudWatch alarms", notify subscribers | **Amazon SNS** |
| "process later", a queue, decouple components | **Amazon SQS** |
| "unused access keys", root without MFA, open ports — flagged automatically | **AWS Trusted Advisor** |
| configuration history, compliance rules | **AWS Config** |
| vulnerabilities on EC2 instances | **Amazon Inspector** |
| "closest Region", slow for users on other continents | Route 53 **latency-based** routing |
| route by the user's country, language, licensing | Route 53 **geolocation** routing |
| split traffic by percentages | Route 53 **weighted** routing |
| cache content near users, edge locations | **Amazon CloudFront** |
| "SMB", a Windows file share | **Amazon FSx** (for Windows File Server) |
| "shared by many EC2", read and write at the same time | **Amazon EFS** |
| "11 nines" durability, objects, photos, documents | **Amazon S3** |
| archive, rarely accessed, lowest cost | **S3 Glacier** (Deep Archive) |
| point-in-time incremental backup of a volume | **EBS snapshot** (stored in S3) |
| "automatic failover" of a database to another AZ | **RDS Multi-AZ** |
| offload reads, read-heavy reports | **RDS read replica** |
| DynamoDB: find by a non-key attribute | **Scan** |
| data warehouse, analytics over huge data | **Amazon Redshift** |
| "interruptible", stateless, cost is key | **Spot Instances** |
| "steady for 1+ year", predictable | **Reserved Instances** |
| "no long-term commitment", unknown usage | **On-Demand** |
| a recurring schedule, monthly reports | **Scheduled Reserved Instances** |
| "control over the physical server", compliance | **Dedicated Hosts** |
| substantial CPU, simulations | **compute optimized** |
| large datasets in memory, real-time analytics | **memory optimized** |
| an optional control at the subnet level | **network ACL** |
| an instance-level firewall, stateful | **security group** |
| a private instance cannot reach the internet | the **NAT gateway** is missing |
| what makes a subnet public | a route **0.0.0.0/0 → internet gateway** |
| scale up and down with demand | **Elastic Load Balancing + EC2 Auto Scaling** |
| keep average CPU at 70% | a **target tracking** policy |
| scale at a fixed time, regardless of metrics | a **scheduled action** |
| one AZ lost power, the app went down | **multiple AZs** in the same Region |
| avoid large upfront hardware costs | **pay-as-you-go** |
| unexpected bills | the **Cost Optimization** pillar |
| RDS in multiple AZs | the **Reliability** pillar |
> Exam trap: the most common swap is CloudTrail vs CloudWatch. Trail = **who did it**; Watch = **how it performs right now**.
?? "An application on EC2 must write to DynamoDB. What is the MOST secure way to give it credentials?"
?= Attach an IAM role to the instance: temporary credentials, no keys stored on the server and no root credentials.
?? "Ten EC2 instances must read and write the same files at the same time." EBS, EFS or S3?
?= Amazon EFS — one shared file system for many instances, even across AZs. EBS attaches to an instance in one AZ; S3 is object storage, not a mounted file system.
?? "Users in Europe and Asia complain of slow responses; route them to the closest Region automatically." Which policy?
?= Route 53 latency-based routing. Geolocation chooses by the user's country, not by the lowest latency.`,
        ru: `## Как устроен мидтерм
- Квиз в Moodle: **40 вопросов по 1 баллу, около 15 минут** — примерно 20 секунд на вопрос. В основном один верный вариант; есть True/False, несколько картинок «What is this?» и «select all that apply».
- Охват: **AWS Academy Cloud Foundations, модули 1–10, и лабы 1–6**. Ни расчётов, ни кода.
- Почти каждый вопрос — короткий сценарий с **сигнальной фразой** (signal), которая указывает ровно на один сервис или вариант. Увидеть сигнал → ответить → дальше.
> Тактика: сначала читать **последнюю строку** (что именно спрашивают), потом искать сигнал в сценарии. Есть сомнение — выбрать, **пометить флажком (flag)** и вернуться в конце. Пустой ответ — гарантированный ноль.
## Сигнал в вопросе → ответ
| Сигнал в вопросе | Ответ |
|---|---|
| «temporary access», приложению на EC2 нужен S3 или DynamoDB | **IAM role** |
| одинаковые права для многих пользователей | **IAM group** с политикой |
| политика встроена в одного пользователя или группу и удаляется вместе с ними | **inline policy** |
| «who deleted / who changed», история API-вызовов, аудит | **AWS CloudTrail** |
| «monitor in real time», метрики, alarms, логи | **Amazon CloudWatch** |
| «send alerts from CloudWatch alarms», оповестить подписчиков | **Amazon SNS** |
| «process later», очередь, развязать компоненты | **Amazon SQS** |
| «unused access keys», root без MFA, открытые порты — найдено автоматически | **AWS Trusted Advisor** |
| история конфигурации, правила соответствия (compliance) | **AWS Config** |
| уязвимости на инстансах EC2 | **Amazon Inspector** |
| «closest Region», медленно у пользователей на других континентах | Route 53, **latency-based** routing |
| маршрут по стране пользователя, языку, лицензиям | Route 53, **geolocation** routing |
| разделить трафик в процентах | Route 53, **weighted** routing |
| кэшировать контент рядом с пользователями, edge locations | **Amazon CloudFront** |
| «SMB», файловый ресурс Windows | **Amazon FSx** (for Windows File Server) |
| «shared by many EC2», читать и писать одновременно | **Amazon EFS** |
| надёжность «11 nines», объекты, фото, документы | **Amazon S3** |
| архив, редкий доступ, минимальная цена | **S3 Glacier** (Deep Archive) |
| инкрементная резервная копия тома на момент времени | **EBS snapshot** (хранится в S3) |
| «automatic failover» базы в другую AZ | **RDS Multi-AZ** |
| разгрузить чтение, тяжёлые отчёты | **RDS read replica** |
| DynamoDB: поиск по неключевому атрибуту | **Scan** |
| хранилище данных (data warehouse), аналитика по огромным данным | **Amazon Redshift** |
| «interruptible», без состояния (stateless), главное — цена | **Spot Instances** |
| «steady for 1+ year», предсказуемая нагрузка | **Reserved Instances** |
| «no long-term commitment», нагрузка неизвестна | **On-Demand** |
| повторяющееся расписание, ежемесячные отчёты | **Scheduled Reserved Instances** |
| «control over the physical server», требования регуляторов | **Dedicated Hosts** |
| много CPU, симуляции | **compute optimized** |
| большие данные в памяти, аналитика в реальном времени | **memory optimized** |
| необязательная защита на уровне подсети | **network ACL** |
| firewall на уровне инстанса, stateful | **security group** |
| частный инстанс не выходит в интернет | нет **NAT gateway** |
| что делает подсеть публичной | маршрут **0.0.0.0/0 → internet gateway** |
| масштабироваться вверх и вниз по нагрузке | **Elastic Load Balancing + EC2 Auto Scaling** |
| держать средний CPU на 70% | политика **target tracking** |
| масштабироваться в фиксированное время, без метрик | **scheduled action** |
| одна AZ потеряла питание, приложение упало | **несколько AZ** в одном регионе |
| избежать больших стартовых трат на железо | **pay-as-you-go** |
| неожиданные счета | столп **Cost Optimization** |
| RDS в нескольких AZ | столп **Reliability** |
> Ловушка экзамена: чаще всего путают CloudTrail и CloudWatch. Trail — **кто это сделал**; Watch — **как система работает прямо сейчас**.
?? «Приложение на EC2 должно писать в DynamoDB. Как MOST secure выдать ему учётные данные?»
?= Привязать к инстансу IAM role: временные учётные данные, никаких ключей на сервере и никаких данных root.
?? «Десять инстансов EC2 должны одновременно читать и писать одни и те же файлы». EBS, EFS или S3?
?= Amazon EFS — одна общая файловая система для многих инстансов, даже в разных AZ. EBS подключается к инстансу в одной AZ; S3 — объектное хранилище, а не смонтированная файловая система.
?? «Пользователи в Европе и Азии жалуются на медленные ответы; нужно автоматически направлять их в ближайший регион». Какая политика?
?= Route 53 latency-based routing. Geolocation выбирает по стране пользователя, а не по наименьшей задержке.`,
      },
    },
    {
      id: "cc-fast-2",
      title: { en: "VPC networking, security groups and Route 53", ru: "Сеть VPC, security groups и Route 53" },
      minutes: 15,
      notes: {
        en: `## VPC in six facts
- **Amazon VPC** is the service that lets you **customize the network configuration**: IP range (CIDR), subnets, route tables, gateways. A VPC belongs to **one Region** and spans its AZs.
- A **subnet** is a slice of the VPC's CIDR in **exactly one Availability Zone** (True). For high availability the same pair of subnets is repeated in a second AZ.
- **Public subnet** = its route table sends **0.0.0.0/0 to an internet gateway (IGW)**. A private subnet has no such route. Size and IPv6 have nothing to do with it.
- An instance in a public subnet also needs a **public IPv4 or an Elastic IP** — **to be accessible from the internet**. Private IPs already work inside the VPC.
- A **NAT gateway** sits in a **public** subnet with an Elastic IP; the **private** route table sends 0.0.0.0/0 to it. Private instances can download updates, but the internet cannot open connections to them.
- AWS reserves **5 addresses** in every subnet, so a /24 has 251 usable. A VPC CIDR is between /16 (largest) and /28 (smallest).
= public route table: 0.0.0.0/0 → igw-id · private route table: 0.0.0.0/0 → nat-gw-id
@diagram cc-vpc
> "What is this?" picture: VPC 10.0.0.0/16, public subnet 10.0.1.0/24, private subnet 10.0.2.0/24, two route tables, an internet gateway and a hidden icon **in the public subnet** that the **private route table points to** → **NAT gateway**. Not VPC peering: peering joins **two** VPCs, and the picture has one.
> Exam trap: "an instance in a private subnet cannot reach the internet" → **no NAT gateway** (or no route to it). An Elastic IP, CloudFront or Direct Connect does not fix it.
## Security group vs network ACL
| | Security group | Network ACL |
|---|---|---|
| Works at | the instance (its network interface) | the **subnet** — an **optional** extra layer |
| State | **stateful**: replies are allowed automatically | **stateless**: return traffic needs its own rule |
| Rules | **allow only** | allow **and deny**, numbered, lowest first |
| Default | new group: no inbound, all outbound | the default NACL allows everything |
- The site does not open and the security group allows only SSH (22) → **add an inbound rule for TCP port 80** to the **existing** group. It applies at once: no reboot, no new group, and the internet gateway is not the issue.
- Ports to know: SSH 22, HTTP 80, HTTPS 443, RDP 3389, MySQL 3306.
## Other connections
| Need | Service |
|---|---|
| connect two VPCs privately (not transitive) | **VPC peering** |
| a hub for many VPCs and on-premises networks | **Transit Gateway** |
| an encrypted tunnel to the office over the internet | **Site-to-Site VPN** |
| a dedicated private line from your data center | **AWS Direct Connect** |
| reach S3 or DynamoDB without the internet | **VPC endpoint** |
## Route 53 and CloudFront
| Route 53 policy | Signal |
|---|---|
| Simple | one resource, no logic |
| Weighted | split by percentages, A/B testing |
| **Latency-based** | users on several continents → the Region with the **lowest latency** |
| Geolocation | answer by the user's **country or continent** |
| Failover | active–passive with health checks |
| Multivalue answer | several healthy IP addresses |
- **Route 53** is the AWS **DNS** service: domain registration, routing policies, health checks. **CloudFront** is the **CDN**: it caches content at **edge locations** close to users.
?? What makes a subnet public, and what else does an instance there need to be reachable?
?= A route 0.0.0.0/0 → internet gateway in the subnet's route table, plus a public IPv4 or Elastic IP on the instance.
?? Which security control is optional, works at the subnet level and can deny traffic?
?= The network ACL. Security groups work at the instance level, are stateful and only allow.
?? A web server runs and SSH works, but the browser times out. What is the simplest fix?
?= Add an inbound rule for TCP 80 (HTTP) from 0.0.0.0/0 to the instance's existing security group.`,
        ru: `## VPC в шести фактах
- **Amazon VPC** — сервис, который позволяет **настроить свою сеть (customize the network configuration)**: диапазон IP (CIDR), подсети, таблицы маршрутов, шлюзы. VPC принадлежит **одному региону** и охватывает его AZ.
- **Подсеть (subnet)** — кусок CIDR из VPC **ровно в одной зоне доступности** (True). Для высокой доступности та же пара подсетей повторяется во второй AZ.
- **Публичная подсеть** = её таблица маршрутов отправляет **0.0.0.0/0 на internet gateway (IGW)**. У частной подсети такого маршрута нет. Размер и IPv6 тут ни при чём.
- Инстансу в публичной подсети ещё нужен **публичный IPv4 или Elastic IP** — **чтобы быть доступным из интернета**. Частные IP и так работают внутри VPC.
- **NAT gateway** стоит в **публичной** подсети с Elastic IP; **частная** таблица маршрутов отправляет 0.0.0.0/0 на него. Частные инстансы могут скачивать обновления, но интернет не может открыть к ним соединение.
- AWS резервирует **5 адресов** в каждой подсети, поэтому в /24 доступно 251. CIDR у VPC — от /16 (самый большой) до /28 (самый маленький).
= public route table: 0.0.0.0/0 → igw-id · private route table: 0.0.0.0/0 → nat-gw-id
@diagram cc-vpc
> Картинка «What is this?»: VPC 10.0.0.0/16, публичная подсеть 10.0.1.0/24, частная 10.0.2.0/24, две таблицы маршрутов, internet gateway и скрытая иконка **в публичной подсети**, на которую **указывает частная таблица маршрутов** → **NAT gateway**. Не VPC peering: peering соединяет **две** VPC, а на картинке одна.
> Ловушка экзамена: «инстанс в частной подсети не выходит в интернет» → **нет NAT gateway** (или маршрута к нему). Elastic IP, CloudFront или Direct Connect это не исправят.
## Security group и network ACL
| | Security group | Network ACL |
|---|---|---|
| Где работает | на инстансе (его сетевом интерфейсе) | на **подсети** — **необязательный** дополнительный слой |
| Состояние | **stateful**: ответы разрешаются автоматически | **stateless**: обратному трафику нужно своё правило |
| Правила | **только allow** | allow **и deny**, по номерам, с меньшего |
| По умолчанию | новая группа: входящих нет, исходящие все | NACL по умолчанию пропускает всё |
- Сайт не открывается, а security group разрешает только SSH (22) → **добавить входящее правило TCP 80** в **существующую** группу. Действует сразу: без перезагрузки, без новой группы, и internet gateway тут ни при чём.
- Порты: SSH 22, HTTP 80, HTTPS 443, RDP 3389, MySQL 3306.
## Другие соединения
| Задача | Сервис |
|---|---|
| связать две VPC частным каналом (не транзитивно) | **VPC peering** |
| хаб для многих VPC и локальных сетей | **Transit Gateway** |
| шифрованный туннель в офис через интернет | **Site-to-Site VPN** |
| выделенная частная линия из своего дата-центра | **AWS Direct Connect** |
| доступ к S3 или DynamoDB без интернета | **VPC endpoint** |
## Route 53 и CloudFront
| Политика Route 53 | Сигнал |
|---|---|
| Simple | один ресурс, без логики |
| Weighted | деление в процентах, A/B-тесты |
| **Latency-based** | пользователи на разных континентах → регион с **наименьшей задержкой** |
| Geolocation | ответ по **стране или континенту** пользователя |
| Failover | active–passive с проверками здоровья (health checks) |
| Multivalue answer | несколько исправных IP-адресов |
- **Route 53** — сервис **DNS** в AWS: регистрация доменов, политики маршрутизации, health checks. **CloudFront** — **CDN**: кэширует контент в **edge locations** рядом с пользователями.
?? Что делает подсеть публичной и что ещё нужно инстансу в ней, чтобы до него можно было достучаться?
?= Маршрут 0.0.0.0/0 → internet gateway в таблице маршрутов подсети, плюс публичный IPv4 или Elastic IP у инстанса.
?? Какая защита необязательна, работает на уровне подсети и умеет запрещать трафик?
?= Network ACL. Security groups работают на уровне инстанса, stateful и только разрешают.
?? Веб-сервер работает, SSH подключается, а браузер ждёт до таймаута. Какое исправление самое простое?
?= Добавить в существующую security group инстанса входящее правило TCP 80 (HTTP) от 0.0.0.0/0.`,
      },
    },
    {
      id: "cc-fast-3",
      title: { en: "Amazon EC2: purchase options, families, lifecycle", ru: "Amazon EC2: варианты покупки, семейства, жизненный цикл" },
      minutes: 15,
      notes: {
        en: `## Purchase options — about six questions on the real midterm
| Signal in the scenario | Option | Key fact |
|---|---|---|
| a new app, unsure of usage, **no long-term commitment** | **On-Demand** | per second or hour, no upfront |
| consistent, predictable, runs **at least 1 year** | **Reserved Instances** | 1 or 3 years, up to ~72% off |
| a job on a **recurring schedule** (monthly reports) | **Scheduled RI** | capacity for a time window, 1 year |
| commit to **dollars per hour** of spend, keep flexibility | **Savings Plans** | 1 or 3 years, also covers Lambda and Fargate |
| **stateless**, can be **interrupted**, cost is key | **Spot Instances** | up to 90% off, 2-minute notice |
| compliance, **control over the physical server** and placement, BYOL | **Dedicated Hosts** | a whole server is yours |
| only "no other customers on our hardware" | Dedicated Instances | no control of the host |
> Exam trap: "unsure of usage, will grow and stabilize, start without a long-term commitment" → **On-Demand** now. RIs and Savings Plans need a commitment; Spot can be taken away.
> Exam trap: one production web server, steady for a year → **1-year RI**. Not Spot (an interruption takes the site down), not "move to Lambda" (a rewrite, not a pricing option).
- RI payment: All Upfront, Partial Upfront, No Upfront — more upfront and a longer term give a bigger discount.
## Instance families
| Family | Signal in the scenario | Examples |
|---|---|---|
| General purpose | balanced, web server, code repository, start small | t3, m5 |
| Compute optimized | **substantial CPU power**, simulations, climate modeling, batch, encoding | c5 |
| Memory optimized | **large datasets processed in memory**, **real-time analytics**, quick queries | r5, x1 |
| Storage optimized | very high IOPS on **local** disks, data warehouse, NoSQL | i3, d2 |
| Accelerated computing | **hardware accelerators**: GPU, FPGA, ML training | p3, g4dn |
= t3.micro = family t + generation 3 + size micro
> Exam trap: "real-time analytics on large datasets with quick query results" → **memory optimized**. "Large datasets" alone does not mean storage optimized.
## Lifecycle: what survives
@diagram cc8-lifecycle
| Action | EBS root volume | Instance store | Public IPv4 |
|---|---|---|---|
| Reboot | kept | kept | kept |
| Stop → start | **kept** | **lost** | a new one (unless Elastic IP) |
| Terminate | deleted by default | lost | released |
- A **stopped** instance costs nothing for compute, but its EBS volumes are still billed. The instance type can be changed **only while stopped**.
- **Termination protection** blocks terminate from the console and the API — disable it first. An **Elastic IP** is a static public IPv4 that survives stop and start.
- **User data** — a script that runs **once at first boot** as root (Lab 3 installs Apache with it). An **AMI** is Region-specific.
## Multi-tenancy
**Multi-tenancy**: each virtual machine is **isolated** but **shares the resources of one host machine** with other customers' VMs; the hypervisor (AWS Nitro) enforces the isolation. It is not "only one user per instance" and not "many servers in one data center". A Dedicated Host removes the sharing.
?? A project needs monthly reports that iterate through very large amounts of data. Which purchasing option?
?= Scheduled Reserved Instances — capacity reserved for a recurring time window.
?? You stop an instance whose root disk is an EBS volume. What happens to the data?
?= It persists and is available after the restart; only instance store data is lost on stop.
?? A university runs climate simulations that need a lot of CPU. Why compute optimized?
?= They are built for tasks that need significant CPU power; memory optimized is for data held in memory, accelerated computing for GPUs.`,
        ru: `## Варианты покупки — около шести вопросов на реальном мидтерме
| Сигнал в сценарии | Вариант | Главный факт |
|---|---|---|
| новое приложение, нагрузка неизвестна, **no long-term commitment** | **On-Demand** | посекундно или почасово, без предоплаты |
| ровная, предсказуемая, работает **минимум 1 год** | **Reserved Instances** | 1 или 3 года, скидка до ~72% |
| задача по **повторяющемуся расписанию** (ежемесячные отчёты) | **Scheduled RI** | мощность на окно времени, 1 год |
| обязательство на **сумму в час**, с гибкостью | **Savings Plans** | 1 или 3 года, покрывает и Lambda, и Fargate |
| **stateless**, можно **прервать**, главное — цена | **Spot Instances** | скидка до 90%, предупреждение за 2 минуты |
| compliance, **контроль над физическим сервером** и размещением, BYOL | **Dedicated Hosts** | весь сервер — свой |
| только «никаких чужих клиентов на нашем железе» | Dedicated Instances | без контроля над хостом |
> Ловушка экзамена: «нагрузка неизвестна, вырастет и стабилизируется, начать без долгосрочных обязательств» → сейчас **On-Demand**. RI и Savings Plans требуют обязательства; Spot могут отобрать.
> Ловушка экзамена: один боевой веб-сервер, ровная нагрузка на год → **RI на 1 год**. Не Spot (прерывание уронит сайт), не «перейти на Lambda» (это переписывание, а не вариант оплаты).
- Оплата RI: All Upfront, Partial Upfront, No Upfront — чем больше вперёд и длиннее срок, тем больше скидка.
## Семейства инстансов
| Семейство | Сигнал в сценарии | Примеры |
|---|---|---|
| General purpose | баланс, веб-сервер, репозиторий кода, начать с малого | t3, m5 |
| Compute optimized | **много CPU**, симуляции, климатические модели, пакетная обработка, кодирование | c5 |
| Memory optimized | **большие данные, обрабатываемые в памяти**, **аналитика в реальном времени**, быстрые запросы | r5, x1 |
| Storage optimized | очень высокий IOPS на **локальных** дисках, хранилище данных, NoSQL | i3, d2 |
| Accelerated computing | **аппаратные ускорители**: GPU, FPGA, обучение ML | p3, g4dn |
= t3.micro = family t + generation 3 + size micro
> Ловушка экзамена: «аналитика в реальном времени по большим данным с быстрыми ответами на запросы» → **memory optimized**. Одни только «большие данные» ещё не значат storage optimized.
## Жизненный цикл: что сохраняется
@diagram cc8-lifecycle
| Действие | Корневой том EBS | Instance store | Публичный IPv4 |
|---|---|---|---|
| Reboot | сохраняется | сохраняется | сохраняется |
| Stop → start | **сохраняется** | **теряется** | новый (если нет Elastic IP) |
| Terminate | удаляется по умолчанию | теряется | освобождается |
- За **остановленный** инстанс не платят как за вычисления, но тома EBS по-прежнему оплачиваются. Тип инстанса меняется **только в остановленном состоянии**.
- **Termination protection** блокирует удаление из консоли и через API — сначала её надо выключить. **Elastic IP** — постоянный публичный IPv4, который переживает stop и start.
- **User data** — скрипт, который выполняется **один раз при первой загрузке** от root (в Lab 3 им ставят Apache). **AMI** привязан к региону.
## Мультиарендность (multi-tenancy)
**Multi-tenancy**: каждая виртуальная машина **изолирована**, но **делит ресурсы одного физического хоста** с VM других клиентов; изоляцию обеспечивает гипервизор (AWS Nitro). Это не «одним инстансом пользуется только один человек» и не «много серверов в одном дата-центре». Dedicated Host убирает это совместное использование.
?? Проекту нужны ежемесячные отчёты, которые перебирают очень большие объёмы данных. Какой вариант покупки?
?= Scheduled Reserved Instances — мощность, зарезервированная на повторяющееся окно времени.
?? Инстанс с корневым томом EBS остановили. Что будет с данными?
?= Они сохраняются и доступны после запуска; при stop теряются только данные instance store.
?? Университет запускает климатические симуляции, которым нужно много CPU. Почему compute optimized?
?= Они созданы для задач, которым нужна большая вычислительная мощность CPU; memory optimized — для данных в памяти, accelerated computing — для GPU.`,
      },
    },
    {
      id: "cc-fast-4",
      title: { en: "Security: shared responsibility, IAM and audit services", ru: "Безопасность: разделённая ответственность, IAM и сервисы аудита" },
      minutes: 15,
      notes: {
        en: `## Shared responsibility
@diagram cc7-shared-model
- **AWS — security OF the cloud**: data centers, hardware, network, hypervisor, Regions and AZs; for managed services also the OS, engine patching and backups.
- **Customer — security IN the cloud**: data, IAM users and permissions, **guest OS patches on EC2**, security groups, VPC settings, encryption, applications.
| Task | Database on EC2 | Managed database (RDS, DynamoDB) |
|---|---|---|
| OS and engine patching | customer | AWS |
| provisioning, scaling, backups | customer | AWS |
| designing data structures, managing access controls | customer | customer |
> Exam trap: "deploying antivirus on the OS of a fully managed database" is impossible — the customer has no access to that OS. The right answer: the customer **designs data structures and manages access controls**.
## IAM in one table
| Element | What it is | Signal |
|---|---|---|
| IAM user | a person or app with **long-term** credentials (password, access keys) | one employee, one CLI tool |
| IAM group | a set of users; a policy attached once applies to all; no credentials | many users with the same job |
| IAM role | an identity with **temporary** credentials, assumed by a user, a service or an **EC2 instance** | "temporary access", EC2 → S3 or DynamoDB |
| IAM policy | a JSON document: Effect, Action, Resource | what is allowed or denied |
- **Managed policy** — a standalone policy attached to many identities (AWS managed or customer managed). **Inline policy** — embedded in **one** user, group or role and deleted with it.
- Evaluation: **explicit Deny > explicit Allow > implicit deny**. Anything not allowed is denied.
= {"Effect": "Allow", "Action": "ec2:StopInstances", "Resource": "*"}
- IAM controls access to **AWS** (console, CLI, API). It is **not** for logging in to an operating system or to your own application (False).
- **Root user**: full access to everything, created with the account. Best practice: **enable MFA on root**, create **IAM users for daily work**, no root access keys, root credentials locked away. **Least privilege** for everyone.
> Exam trap: "temporary access to permissions" = **IAM role** — not users (long-term credentials), not groups or policies (no credentials at all). "IAM TempoAccess" does not exist.
## Who records, who watches, who advises
| Question | Service |
|---|---|
| **who** deleted the instance, API history | **AWS CloudTrail** |
| performance **now**: metrics, alarms, logs | **Amazon CloudWatch** |
| configuration history, compliance rules | **AWS Config** |
| vulnerabilities and exposure of EC2 | **Amazon Inspector** |
| best-practice checks: unused or exposed keys, MFA on root, open ports | **AWS Trusted Advisor** |
| threat detection from logs | **Amazon GuardDuty** |
| encryption keys | **AWS KMS** |
| AWS compliance reports (SOC, PCI, ISO) | **AWS Artifact** |
| DDoS protection | **AWS Shield** |
?? What is the difference between a managed policy and an inline policy?
?= A managed policy is standalone and can be attached to many users, groups or roles; an inline policy is embedded in one identity and is deleted with it.
?? A manager logs in with the root account every day. What is the best practice?
?= Create IAM users for daily tasks, enable MFA on the root user and store the root credentials securely.
?? A review finds unused IAM access keys. Which service would have flagged them automatically?
?= AWS Trusted Advisor — its security checks cover access keys, MFA on root and open ports.`,
        ru: `## Разделённая ответственность (shared responsibility)
@diagram cc7-shared-model
- **AWS — безопасность САМОГО облака (OF the cloud)**: дата-центры, оборудование, сеть, гипервизор, регионы и AZ; у управляемых сервисов — ещё ОС, патчи движка и резервные копии.
- **Клиент — безопасность В облаке (IN the cloud)**: данные, пользователи IAM и права, **патчи гостевой ОС на EC2**, security groups, настройки VPC, шифрование, приложения.
| Задача | База на EC2 | Управляемая база (RDS, DynamoDB) |
|---|---|---|
| патчи ОС и движка | клиент | AWS |
| выделение ресурсов, масштабирование, резервные копии | клиент | AWS |
| проектирование структур данных, управление доступом | клиент | клиент |
> Ловушка экзамена: «ставить антивирус на ОС полностью управляемой базы» невозможно — доступа к этой ОС у клиента нет. Верный ответ: клиент **проектирует структуры данных и управляет доступом**.
## IAM одной таблицей
| Элемент | Что это | Сигнал |
|---|---|---|
| IAM user | человек или приложение с **долгосрочными** учётными данными (пароль, access keys) | один сотрудник, один CLI-инструмент |
| IAM group | набор пользователей; политика, привязанная один раз, действует на всех; своих учётных данных нет | много людей с одной работой |
| IAM role | сущность с **временными** учётными данными; её принимает пользователь, сервис или **инстанс EC2** | «temporary access», EC2 → S3 или DynamoDB |
| IAM policy | JSON-документ: Effect, Action, Resource | что разрешено и что запрещено |
- **Managed policy** — отдельная политика, которую можно привязать ко многим сущностям (AWS managed или customer managed). **Inline policy** — встроена в **одного** пользователя, группу или роль и удаляется вместе с ними.
- Порядок решения: **явный Deny > явный Allow > неявный запрет**. Всё, что не разрешено, запрещено.
= {"Effect": "Allow", "Action": "ec2:StopInstances", "Resource": "*"}
- IAM управляет доступом к **AWS** (консоль, CLI, API). Для входа в операционную систему или в собственное приложение он **не** предназначен (False).
- **Root user**: полный доступ ко всему, создаётся вместе с аккаунтом. Правильно: **включить MFA на root**, завести **IAM users для ежедневной работы**, не создавать access keys для root, спрятать данные root. **Минимальные привилегии (least privilege)** для всех.
> Ловушка экзамена: «temporary access to permissions» = **IAM role** — не users (долгосрочные данные), не groups и не policies (учётных данных у них нет вовсе). «IAM TempoAccess» не существует.
## Кто записывает, кто следит, кто советует
| Вопрос | Сервис |
|---|---|
| **кто** удалил инстанс, история API | **AWS CloudTrail** |
| работа **сейчас**: метрики, alarms, логи | **Amazon CloudWatch** |
| история конфигурации, правила соответствия | **AWS Config** |
| уязвимости и открытость EC2 | **Amazon Inspector** |
| проверки лучших практик: неиспользуемые или открытые ключи, MFA на root, открытые порты | **AWS Trusted Advisor** |
| обнаружение угроз по логам | **Amazon GuardDuty** |
| ключи шифрования | **AWS KMS** |
| отчёты AWS о соответствии (SOC, PCI, ISO) | **AWS Artifact** |
| защита от DDoS | **AWS Shield** |
?? Чем managed policy отличается от inline policy?
?= Managed policy — отдельная, её можно привязать ко многим пользователям, группам или ролям; inline policy встроена в одну сущность и удаляется вместе с ней.
?? Менеджер каждый день входит под root. Как правильно?
?= Завести IAM users для ежедневных задач, включить MFA на root и надёжно хранить данные root.
?? Проверка нашла неиспользуемые access keys IAM. Какой сервис отметил бы их автоматически?
?= AWS Trusted Advisor — его проверки безопасности охватывают access keys, MFA на root и открытые порты.`,
      },
    },
    {
      id: "cc-fast-5",
      title: { en: "Cloud value, pricing, TCO and support plans", ru: "Ценность облака, цены, TCO и планы поддержки" },
      minutes: 14,
      notes: {
        en: `## Cloud computing in one line
**Cloud computing** is the **on-demand delivery** of compute, storage, databases and other IT resources **over the internet** with **pay-as-you-go** pricing. Networking, storage, compute and databases are all AWS service categories (True).
- Service models: **IaaS** (EC2 — you manage the OS), **PaaS** (Elastic Beanstalk — only your code), **SaaS** (a finished application). Deployment models: **cloud (all-in)**, **hybrid**, **on-premises (private cloud)**.
## Six advantages — the "which is NOT" question
| Advantage | Key words |
|---|---|
| Trade capital expense for variable expense | no big upfront purchase, **pay-as-you-go** |
| Benefit from massive economies of scale | **hundreds of thousands of customers aggregated** → lower prices |
| Stop guessing capacity | scale with real demand, no idle hardware bought for the peak |
| Increase speed and agility | resources in minutes, not weeks |
| Stop spending money running and maintaining data centers | no **racking, stacking and powering** servers |
| Go global in minutes | several Regions in a few clicks |
> Exam trap: "Pay for racking, stacking and powering servers" is the on-premises burden — **NOT** a benefit.
> Exam trap: economies of scale come from **aggregating customers** — not from many providers, hundreds of services or heavy investment in your own data centers.
- **Scalability and elasticity** = the ability to **grow and shrink resources dynamically based on real-time demand** — not manual, not permanent, not fixed.
- Varying workloads are cheaper on AWS because **EC2 instances can be launched on demand when needed** and stopped afterwards.
## How AWS charges
@diagram cc6-cost-drivers
| Cost driver | Billing |
|---|---|
| Compute | per hour or second of running time — not a monthly fee |
| Storage | **per GB** (GB-month) |
| Data transfer **in** | free in most cases |
| Data transfer **out** | per GB, aggregated across services |
- Pricing principles: pay for what you use; pay less when you **reserve**; pay less per unit when you **use more**; pay even less as AWS grows.
- No charge for the service itself: Amazon VPC, IAM, Elastic Beanstalk, CloudFormation, Auto Scaling, consolidated billing — you pay for the resources they create.
## TCO and cost tools
- **Total Cost of Ownership (TCO)** compares **all** on-premises costs — servers, storage, network, IT labor, power, cooling, space — with the cost on AWS, not just the price of hardware.
- **AWS Pricing Calculator** — estimate a planned architecture. **AWS Budgets** — alerts when cost passes a threshold. **Cost Explorer** — charts of past spend. **AWS Organizations** — **consolidated billing** for many accounts: one bill and volume discounts.
## Support plans
= Basic · Developer · Business · Enterprise
@diagram cc6-support-plans
- **Basic** — free: documentation, forums, core Trusted Advisor checks. **Developer** — business-hours email. **Business** — 24/7 phone and chat, under 1 hour for a production system down, full Trusted Advisor. **Enterprise** — a Technical Account Manager (TAM), Concierge, under 15 minutes for a business-critical outage.
> Exam trap: there is no "Startup" plan and no "Free, Bronze, Silver, Gold"; and support is not all free.
?? Which statement about AWS pricing is true: inbound transfer per GB, storage per GB, or compute as a monthly fee?
?= Storage is typically charged per gigabyte. Inbound transfer is mostly free, and compute is billed per second or hour.
?? A company wants to avoid large upfront hardware costs. Which principle helps?
?= Pay-as-you-go pricing — trading capital expense for variable expense.`,
        ru: `## Облачные вычисления одной строкой
**Облачные вычисления (cloud computing)** — это **доставка по запросу (on-demand delivery)** вычислений, хранилищ, баз данных и других ИТ-ресурсов **через интернет** с оплатой **pay-as-you-go**. Сеть, хранение, вычисления и базы данных — всё это категории сервисов AWS (True).
- Модели сервиса: **IaaS** (EC2 — ОС на клиенте), **PaaS** (Elastic Beanstalk — только свой код), **SaaS** (готовое приложение). Модели развёртывания: **cloud (all-in)**, **hybrid**, **on-premises (private cloud)**.
## Шесть преимуществ — вопрос «что из этого НЕ преимущество»
| Преимущество | Ключевые слова |
|---|---|
| Trade capital expense for variable expense | без крупной закупки заранее, **pay-as-you-go** |
| Benefit from massive economies of scale | **сотни тысяч клиентов объединены (aggregated)** → ниже цены |
| Stop guessing capacity | масштаб по реальной нагрузке, без простаивающего железа под пик |
| Increase speed and agility | ресурсы за минуты, а не недели |
| Stop spending money running and maintaining data centers | никакого **racking, stacking and powering** серверов |
| Go global in minutes | несколько регионов в пару кликов |
> Ловушка экзамена: «Pay for racking, stacking and powering servers» — это бремя своего дата-центра, а **НЕ** преимущество.
> Ловушка экзамена: экономия масштаба возникает из **объединения клиентов** — не из множества провайдеров, не из сотен сервисов и не из крупных вложений в свои дата-центры.
- **Масштабируемость и эластичность (scalability and elasticity)** = способность **динамически наращивать и сокращать ресурсы по реальной нагрузке** — не вручную, не навсегда, не фиксированно.
- Переменная нагрузка на AWS дешевле, потому что **инстансы EC2 запускаются по запросу, когда нужны**, и останавливаются потом.
## Как AWS берёт деньги
@diagram cc6-cost-drivers
| Статья расходов | Как считается |
|---|---|
| Вычисления (compute) | за час или секунду работы — не помесячная плата |
| Хранение (storage) | **за ГБ** (ГБ в месяц) |
| Входящий трафик (**in**) | в большинстве случаев бесплатно |
| Исходящий трафик (**out**) | за ГБ, суммарно по сервисам |
- Принципы цен: платить за то, что используется; платить меньше при **резервировании**; платить меньше за единицу, когда **используется больше**; платить ещё меньше по мере роста AWS.
- Сам сервис бесплатен: Amazon VPC, IAM, Elastic Beanstalk, CloudFormation, Auto Scaling, consolidated billing — платят за ресурсы, которые они создают.
## TCO и инструменты стоимости
- **Совокупная стоимость владения (TCO, Total Cost of Ownership)** сравнивает **все** расходы своего дата-центра — серверы, хранилища, сеть, работу ИТ-персонала, электричество, охлаждение, площади — со стоимостью в AWS, а не только цену железа.
- **AWS Pricing Calculator** — оценка планируемой архитектуры. **AWS Budgets** — оповещения при превышении порога. **Cost Explorer** — графики прошлых расходов. **AWS Organizations** — **consolidated billing** для многих аккаунтов: один счёт и объёмные скидки.
## Планы поддержки (support plans)
= Basic · Developer · Business · Enterprise
@diagram cc6-support-plans
- **Basic** — бесплатно: документация, форумы, базовые проверки Trusted Advisor. **Developer** — e-mail в рабочие часы. **Business** — круглосуточно телефон и чат, меньше 1 часа при падении боевой системы, полный Trusted Advisor. **Enterprise** — свой Technical Account Manager (TAM), Concierge, меньше 15 минут при сбое критичной для бизнеса системы.
> Ловушка экзамена: плана «Startup» нет, как нет и «Free, Bronze, Silver, Gold»; и поддержка не вся бесплатная.
?? Какое утверждение о ценах AWS верно: входящий трафик за ГБ, хранение за ГБ или вычисления помесячно?
?= Хранение обычно оплачивается за гигабайт. Входящий трафик почти всегда бесплатен, а вычисления считаются посекундно или почасово.
?? Компания хочет избежать больших стартовых трат на железо. Какой принцип помогает?
?= Оплата pay-as-you-go — замена капитальных расходов переменными.`,
      },
    },
    {
      id: "cc-fast-6",
      title: { en: "Storage: EBS, instance store, S3, EFS, FSx, Glacier", ru: "Хранилища: EBS, instance store, S3, EFS, FSx, Glacier" },
      minutes: 15,
      notes: {
        en: `## Choose storage by the signal
| Service | Type | Signal in the question |
|---|---|---|
| **Amazon EBS** | block, one AZ | root disk, a database on one instance; data **persists when the instance stops** |
| **Instance store** | block, disks on the host | temporary: cache, buffers, scratch; **lost** on stop or terminate |
| **Amazon EFS** | file (NFS), Linux | **many instances read and write at the same time**, across AZs; **elastic** |
| **Amazon FSx** | file: **Windows (SMB)**, Lustre | shared storage for **Windows applications** |
| **Amazon S3** | object | **11 nines (99.999999999%) durability**; flat files: Word documents, photos, videos, backups |
| **S3 Glacier** | object, archive | rarely accessed, lowest cost, retrieval in minutes to hours |
@diagram cc-storage-types
## EBS: one AZ, snapshots in S3
- A volume lives in **one AZ** and attaches only to instances in **that AZ**; AWS replicates it inside the AZ. Usually one volume ↔ one instance; one instance can have many volumes.
- Types: **gp3/gp2** General Purpose SSD (most workloads, boot), **io2/io1** Provisioned IOPS SSD (critical databases), **st1/sc1** HDD (throughput, cold data — cannot boot).
- **Snapshot** = a **point-in-time, incremental** backup **stored in Amazon S3**. From it — a new volume in any AZ of the Region; it can also be copied to another Region.
- **Multi-Attach**: one io1/io2 volume to up to 16 instances — **in the same AZ only**.
> Exam trap: "attach a single EBS volume to instances in **different AZs**" → **No, EBS volumes are AZ-scoped — use EFS**. Snapshots, termination protection or Multi-Attach do not change that.
## S3 essentials
- **Buckets** (globally unique names, created in a Region) hold **objects** up to 5 TB; data is stored across at least three AZs. Access through the API or a URL; buckets are **private by default**.
| Storage class | Use |
|---|---|
| S3 Standard | frequently accessed data |
| S3 Intelligent-Tiering | unknown or changing access — moves objects automatically |
| S3 Standard-IA | infrequent access, but fast when needed |
| S3 One Zone-IA | infrequent, re-creatable data, one AZ only |
| S3 Glacier (Instant or Flexible Retrieval) | archives |
| S3 Glacier Deep Archive | the cheapest; restore within 12 hours |
- **Lifecycle policies** move objects to cheaper classes over time; **versioning** keeps old versions; S3 can host a **static website**.
## EFS and FSx
@diagram cc9-efs-mount-targets
- EFS is reached through a **mount target** — a **network interface** in a subnet of each AZ. In the midterm picture the "?" boxes connected to the mount targets are **EC2 instances**; "EBS instance" and "VPC adapter" do not exist.
- EFS **grows and shrinks automatically** as files are added and removed, with no disruption; you pay for the storage used. It is not the cheapest archive (Glacier) and not faster than a local instance store.
- **FSx for Windows File Server** — SMB and Active Directory; **FSx for Lustre** — high-performance computing.
?? Windows applications on EC2 need shared file storage over SMB. Which service?
?= Amazon FSx for Windows File Server. EFS uses NFS and is meant for Linux; EBS is not shared; S3 is object storage.
?? What is the primary function of an EBS snapshot?
?= A point-in-time, incremental backup of the volume, stored in Amazon S3.
?? True or false: S3 is object storage suitable for flat files such as Word documents and photos.
?= True — S3 stores whole objects (files) in buckets, with 11 nines of durability.`,
        ru: `## Выбор хранилища по сигналу
| Сервис | Тип | Сигнал в вопросе |
|---|---|---|
| **Amazon EBS** | блочное, одна AZ | корневой диск, база на одном инстансе; данные **сохраняются при остановке инстанса** |
| **Instance store** | блочное, диски хоста | временное: кэш, буферы, черновые данные; **теряется** при stop или terminate |
| **Amazon EFS** | файловое (NFS), Linux | **многие инстансы одновременно читают и пишут**, в разных AZ; **эластичное** |
| **Amazon FSx** | файловое: **Windows (SMB)**, Lustre | общее хранилище для **Windows-приложений** |
| **Amazon S3** | объектное | **надёжность 11 девяток (99.999999999%)**; плоские файлы: документы Word, фото, видео, бэкапы |
| **S3 Glacier** | объектное, архив | редкий доступ, минимальная цена, извлечение от минут до часов |
@diagram cc-storage-types
## EBS: одна AZ, snapshots в S3
- Том живёт в **одной AZ** и подключается только к инстансам **этой AZ**; AWS реплицирует его внутри AZ. Обычно один том ↔ один инстанс; у инстанса может быть много томов.
- Типы: **gp3/gp2** General Purpose SSD (большинство задач, загрузочный диск), **io2/io1** Provisioned IOPS SSD (критичные базы), **st1/sc1** HDD (пропускная способность, холодные данные — загружаться с них нельзя).
- **Snapshot** = **инкрементная** резервная копия **на момент времени**, **хранится в Amazon S3**. Из неё — новый том в любой AZ региона; её можно и скопировать в другой регион.
- **Multi-Attach**: один том io1/io2 — к 16 инстансам максимум, **только в той же AZ**.
> Ловушка экзамена: «подключить один том EBS к инстансам в **разных AZ**» → **нет, тома EBS привязаны к AZ — нужен EFS**. Snapshots, termination protection или Multi-Attach этого не меняют.
## Главное об S3
- **Бакеты (buckets)** — имена уникальны глобально, создаются в регионе — хранят **объекты** до 5 ТБ; данные лежат минимум в трёх AZ. Доступ через API или URL; бакеты **по умолчанию закрыты (private)**.
| Класс хранения | Когда |
|---|---|
| S3 Standard | частый доступ |
| S3 Intelligent-Tiering | доступ неизвестен или меняется — объекты переносятся автоматически |
| S3 Standard-IA | редкий доступ, но быстро, когда нужно |
| S3 One Zone-IA | редкий доступ к данным, которые можно пересоздать, только одна AZ |
| S3 Glacier (Instant или Flexible Retrieval) | архивы |
| S3 Glacier Deep Archive | самый дешёвый; восстановление в течение 12 часов |
- **Lifecycle policies** со временем переносят объекты в более дешёвые классы; **versioning** хранит старые версии; S3 может раздавать **статический сайт**.
## EFS и FSx
@diagram cc9-efs-mount-targets
- К EFS подключаются через **mount target** — **сетевой интерфейс** в подсети каждой AZ. На картинке мидтерма блоки «?», подключённые к mount targets, — это **инстансы EC2**; «EBS instance» и «VPC adapter» не существуют.
- EFS **сам растёт и сжимается** по мере добавления и удаления файлов, без перерывов в работе; платят за занятый объём. Это не самый дешёвый архив (это Glacier) и не быстрее локального instance store.
- **FSx for Windows File Server** — SMB и Active Directory; **FSx for Lustre** — высокопроизводительные вычисления.
?? Windows-приложениям на EC2 нужно общее файловое хранилище по SMB. Какой сервис?
?= Amazon FSx for Windows File Server. EFS работает по NFS и рассчитан на Linux; EBS не общий; S3 — объектное хранилище.
?? Какова основная функция EBS snapshot?
?= Инкрементная резервная копия тома на момент времени, хранящаяся в Amazon S3.
?? Верно ли: S3 — объектное хранилище, подходящее для плоских файлов вроде документов Word и фото?
?= Верно — S3 хранит целые объекты (файлы) в бакетах с надёжностью 11 девяток.`,
      },
    },
    {
      id: "cc-fast-7",
      title: { en: "Architecture: Well-Architected, ELB, Auto Scaling, CloudWatch, SNS and SQS", ru: "Архитектура: Well-Architected, ELB, Auto Scaling, CloudWatch, SNS и SQS" },
      minutes: 15,
      notes: {
        en: `## Well-Architected Framework — six pillars
| Pillar | Signal in the question |
|---|---|
| Operational excellence | run and monitor systems, operations as code, small reversible changes |
| Security | IAM, MFA, encryption, traceability |
| Reliability | **RDS Multi-AZ**, automatic recovery from failure, backups, tested recovery |
| Performance efficiency | the right instance type and size, serverless, go global |
| Cost optimization | **unexpected bills**, cost-effective resources, right-sizing |
| Sustainability | minimize the environmental impact |
> Exam trap: "cost-effective resources **without affecting performance**" is still **Cost Optimization** — the word "performance" is bait.
- High availability: run in **at least two AZs of one Region** behind a load balancer. "One AZ lost power" → **multiple AZs in the same Region** — not multiple Regions by default, not a bigger instance.
## Elastic Load Balancing and EC2 Auto Scaling
@diagram cc10-alb-asg
- **ELB** spreads incoming traffic across healthy instances in several AZs and runs **health checks**. **Application LB** — HTTP/HTTPS (layer 7), routing by path or host; **Network LB** — TCP/UDP (layer 4), very low latency; **Gateway LB** — third-party appliances; Classic — legacy.
- **EC2 Auto Scaling** = a **launch template** (AMI, instance type, security group) + an **Auto Scaling group** (subnets, **min / desired / max**) + a **scaling policy**.
| Auto Scaling feature | When |
|---|---|
| **Target tracking** | keep a metric at a target, e.g. average CPU 70% |
| Step or simple scaling | add or remove N instances when an alarm fires |
| **Scheduled action** | a fixed time — every day at 9 AM — regardless of metrics |
| Predictive scaling | forecast from past traffic |
| **Lifecycle hook** | pause an instance while it launches or terminates to run custom actions |
> Exam trap: "traffic spikes every day at 9 AM; add instances **when CPU is above 70%**" → **target tracking** — the requirement is a metric, not a clock.
- "Which tools help an application scale up or down with demand? (select all)" → **Elastic Load Balancing** and **Amazon EC2 Auto Scaling**. Not CloudFormation (templates), not AWS Config (compliance), not Availability Zones (locations).
## CloudWatch, SNS and SQS
@diagram cc10-alarm-flow
- **CloudWatch** monitors resources and applications **in real time**: metrics (basic — every 5 minutes, free; detailed — every minute), **alarms** (OK, ALARM, INSUFFICIENT_DATA), logs, dashboards, events. Memory usage needs the CloudWatch agent.
- An alarm acts by **notifying an SNS topic**, triggering Auto Scaling or an EC2 action.
| | Amazon SNS | Amazon SQS |
|---|---|---|
| Model | publish/subscribe — **push** | a queue — consumers **pull** |
| Delivery | to many subscribers at once: email, SMS, Lambda, SQS, HTTP | the message waits until it is processed |
| Signal | notify, alert, fan-out | decouple, buffer, process later |
- "Some team members must be notified immediately, others process the reports later" → **SNS**: people subscribe by email or SMS, and an SQS queue subscribed to the same topic keeps the messages for later.
?? An RDS database is deployed in multiple AZs. Which pillar?
?= Reliability — the database recovers automatically from the failure of one AZ.
?? Which service sends the alerts when a CloudWatch alarm fires?
?= Amazon SNS — the alarm publishes to an SNS topic, and the topic pushes to its subscribers.`,
        ru: `## Well-Architected Framework — шесть столпов
| Столп | Сигнал в вопросе |
|---|---|
| Operational excellence | запускать и мониторить системы, операции как код, мелкие обратимые изменения |
| Security | IAM, MFA, шифрование, прослеживаемость |
| Reliability | **RDS Multi-AZ**, автоматическое восстановление после сбоя, резервные копии, проверенное восстановление |
| Performance efficiency | правильный тип и размер инстанса, serverless, глобальный охват |
| Cost optimization | **неожиданные счета**, экономичные ресурсы, подбор размера (right-sizing) |
| Sustainability | снизить влияние на окружающую среду |
> Ловушка экзамена: «экономичные ресурсы **без ущерба для производительности**» — это всё равно **Cost Optimization**; слово «performance» — приманка.
- Высокая доступность: работать **минимум в двух AZ одного региона** за балансировщиком. «Одна AZ потеряла питание» → **несколько AZ в том же регионе** — не несколько регионов по умолчанию и не инстанс побольше.
## Elastic Load Balancing и EC2 Auto Scaling
@diagram cc10-alb-asg
- **ELB** распределяет входящий трафик по исправным инстансам в нескольких AZ и выполняет **health checks**. **Application LB** — HTTP/HTTPS (уровень 7), маршрутизация по пути или хосту; **Network LB** — TCP/UDP (уровень 4), очень низкая задержка; **Gateway LB** — сторонние сетевые устройства; Classic — устаревший.
- **EC2 Auto Scaling** = **launch template** (AMI, тип инстанса, security group) + **Auto Scaling group** (подсети, **min / desired / max**) + **scaling policy**.
| Возможность Auto Scaling | Когда |
|---|---|
| **Target tracking** | держать метрику на цели, например средний CPU 70% |
| Step или simple scaling | добавить или убрать N инстансов, когда срабатывает alarm |
| **Scheduled action** | фиксированное время — каждый день в 9:00 — независимо от метрик |
| Predictive scaling | прогноз по прошлому трафику |
| **Lifecycle hook** | приостановить инстанс при запуске или удалении, чтобы выполнить свои действия |
> Ловушка экзамена: «трафик подскакивает каждый день в 9:00; добавлять инстансы, **когда CPU выше 70%**» → **target tracking**: условие — метрика, а не часы.
- «Какие инструменты помогают приложению масштабироваться по нагрузке? (select all)» → **Elastic Load Balancing** и **Amazon EC2 Auto Scaling**. Не CloudFormation (шаблоны), не AWS Config (соответствие правилам), не Availability Zones (места размещения).
## CloudWatch, SNS и SQS
@diagram cc10-alarm-flow
- **CloudWatch** следит за ресурсами и приложениями **в реальном времени**: метрики (basic — раз в 5 минут, бесплатно; detailed — раз в минуту), **alarms** (OK, ALARM, INSUFFICIENT_DATA), логи, дашборды, события. Для памяти нужен агент CloudWatch.
- Alarm действует так: **отправляет уведомление в SNS topic**, запускает Auto Scaling или действие над EC2.
| | Amazon SNS | Amazon SQS |
|---|---|---|
| Модель | publish/subscribe — **push** (толкает) | очередь — потребители **забирают сами (pull)** |
| Доставка | сразу многим подписчикам: email, SMS, Lambda, SQS, HTTP | сообщение ждёт, пока его обработают |
| Сигнал | уведомить, оповестить, fan-out | развязать, буферизовать, обработать позже |
- «Одних членов команды надо уведомить сразу, другие обработают отчёты позже» → **SNS**: люди подписываются по email или SMS, а очередь SQS, подписанная на тот же topic, хранит сообщения на потом.
?? База RDS развёрнута в нескольких AZ. Какой столп?
?= Reliability — база автоматически восстанавливается после отказа одной AZ.
?? Какой сервис рассылает оповещения, когда срабатывает alarm CloudWatch?
?= Amazon SNS — alarm публикует сообщение в SNS topic, а topic толкает его подписчикам.`,
      },
    },
    {
      id: "cc-fast-8",
      title: { en: "Global infrastructure: Regions, AZs, edge locations", ru: "Глобальная инфраструктура: регионы, AZ, edge locations" },
      minutes: 8,
      notes: {
        en: `## Three levels
@diagram cc6-region-azs
| Level | What it is | Used for |
|---|---|---|
| **Region** | a geographic area with **multiple Availability Zones** (usually three or more), isolated from other Regions | where your resources and data live |
| **Availability Zone (AZ)** | **one or more physically distinct data centers** with their own power, backup generators, UPS, cooling and network | redundancy inside a Region |
| **Edge location** | a point of presence close to users | CloudFront caching, Route 53 DNS |
- AZs within a Region are connected by **low-latency, high-throughput private links** (True), so data can be replicated between them synchronously.
- Data stays in its Region unless you copy it out; each Region has its own prices and its own list of services.
- There are many more edge locations than Regions; **regional edge caches** sit between edge locations and the origin.
> "What are these?" picture: three dashed groups of data centers inside a box labelled "AWS Region", with notes "physically distinct, backup generators, uninterruptible power supply, cooling equipment, network connectivity" → **Availability Zones**. The Region is the outer box — answering "AWS regions" is the classic mistake.
## Choosing a Region — four factors
| Factor | Example |
|---|---|
| Data governance and legal requirements | EU personal data must stay in the EU (GDPR) |
| Proximity to customers (latency) | users in Asia → a Region in Asia |
| Services available in the Region | new services reach some Regions first |
| Costs | prices differ from Region to Region |
> Exam trap: "Availability of reservation options" is **NOT** a factor for choosing a Region.
- An app in **one AZ** went down during a power outage → launch resources in **multiple AZs within the same Region**. Multiple Regions are for disaster recovery or global users, not the first answer.
?? What exactly is an Availability Zone?
?= One or more physically separate data centers with their own power, backup generators, cooling and networking; the AZs of a Region are linked by low-latency connections.
?? Which is not a Region selection factor: costs, reservation options, available services, proximity, data governance?
?= Availability of reservation options.`,
        ru: `## Три уровня
@diagram cc6-region-azs
| Уровень | Что это | Зачем |
|---|---|---|
| **Регион (Region)** | географическая область с **несколькими зонами доступности** (обычно три и больше), изолированная от других регионов | где живут ресурсы и данные |
| **Зона доступности (Availability Zone, AZ)** | **один или несколько физически отдельных дата-центров** со своим питанием, резервными генераторами, ИБП, охлаждением и сетью | резервирование внутри региона |
| **Edge location** | точка присутствия рядом с пользователями | кэш CloudFront, DNS Route 53 |
- AZ одного региона связаны **частными каналами с низкой задержкой и высокой пропускной способностью** (True), поэтому данные между ними можно реплицировать синхронно.
- Данные остаются в своём регионе, пока их не скопировать наружу; у каждого региона свои цены и свой список сервисов.
- Edge locations гораздо больше, чем регионов; **regional edge caches** стоят между edge locations и исходным сервером (origin).
> Картинка «What are these?»: три пунктирные группы дата-центров внутри рамки с подписью «AWS Region» и пометками «physically distinct, backup generators, uninterruptible power supply, cooling equipment, network connectivity» → **Availability Zones**. Регион — это внешняя рамка; ответ «AWS regions» — классическая ошибка.
## Выбор региона — четыре фактора
| Фактор | Пример |
|---|---|
| Управление данными и требования закона (data governance) | персональные данные из ЕС должны оставаться в ЕС (GDPR) |
| Близость к клиентам (задержка) | пользователи в Азии → регион в Азии |
| Сервисы, доступные в регионе | новые сервисы появляются сначала в некоторых регионах |
| Стоимость | цены отличаются от региона к региону |
> Ловушка экзамена: «Availability of reservation options» — **НЕ** фактор выбора региона.
- Приложение в **одной AZ** упало при отключении питания → разворачивать ресурсы в **нескольких AZ того же региона**. Несколько регионов — для аварийного восстановления или глобальной аудитории, это не первый ответ.
?? Что такое зона доступности?
?= Один или несколько физически отдельных дата-центров со своим питанием, резервными генераторами, охлаждением и сетью; AZ одного региона связаны каналами с низкой задержкой.
?? Что из этого не фактор выбора региона: стоимость, варианты резервирования, доступные сервисы, близость, управление данными?
?= Availability of reservation options — доступность вариантов резервирования.`,
      },
    },
    {
      id: "cc-fast-9",
      title: { en: "Databases: RDS, Aurora, DynamoDB, Redshift", ru: "Базы данных: RDS, Aurora, DynamoDB, Redshift" },
      minutes: 12,
      notes: {
        en: `## Managed vs unmanaged
- **Unmanaged** — a database you install on **EC2**: you patch the OS and the engine, run backups, and build high availability and scaling yourself.
- **Managed** — Amazon RDS, Aurora, DynamoDB, Redshift: AWS handles **provisioning, scaling, patching and backups**; the customer **designs data structures and manages access controls**.
## Amazon RDS
- Relational engines: **Amazon Aurora, MySQL, MariaDB, PostgreSQL, Oracle, Microsoft SQL Server**.
> Exam trap: **Amazon Redshift is NOT an RDS engine** — it is a separate data warehouse service. DynamoDB is not one either (NoSQL).
| | Multi-AZ deployment | Read replica |
|---|---|---|
| Purpose | **availability** — automatic failover | **read scaling** |
| Replication | **synchronous** to a standby in another AZ | **asynchronous** |
| Serves reads? | no — the standby only waits | yes |
| On failure | RDS promotes the standby; the endpoint stays the same | promoted manually |
@diagram cc9-rds-multiaz
- "Automatic failover to another AZ if the primary fails" → **Multi-AZ**. A read replica is for performance, Provisioned IOPS is faster storage, DynamoDB global tables are a different database.
- RDS runs in a VPC, in a **DB subnet group** with subnets in at least two AZs; automated backups allow point-in-time recovery.
## Amazon Aurora
A MySQL- and PostgreSQL-compatible engine built by AWS: up to 5× the throughput of MySQL and 3× of PostgreSQL, **six copies of the data across three AZs**, continuous backup to S3. Managed through RDS, pay-as-you-go.
## Amazon DynamoDB
A serverless **NoSQL** (key-value and document) database: single-digit millisecond latency at any scale, automatic scaling, no servers to manage. A table holds **items**; each item has **attributes**; the **primary key** is a partition key, optionally with a sort key.
| Operation | What it does |
|---|---|
| **GetItem** | one item by its full primary key |
| **Query** | items by partition key (of the table or an index) — efficient |
| **Scan** | reads **every item** and filters — the way to search by a **non-key attribute** |
| **PutItem** | writes an item |
## Amazon Redshift
A **data warehouse**: columnar storage, SQL analytics (OLAP) over terabytes to petabytes, BI reports.
| Need | Service |
|---|---|
| relational data, transactions, an existing MySQL app | **RDS** |
| high-performance MySQL or PostgreSQL compatible | **Aurora** |
| key-value at massive scale, millisecond latency | **DynamoDB** |
| analytics over huge historical data | **Redshift** |
?? The CTO wants automatic failover of an RDS MySQL database to another AZ. Which configuration?
?= An RDS Multi-AZ deployment — a synchronous standby in another AZ that RDS promotes automatically.
?? In DynamoDB, which operation finds items by an attribute that is not the primary key?
?= Scan — it reads every item and filters; GetItem and Query need the key.`,
        ru: `## Управляемые и неуправляемые
- **Неуправляемая (unmanaged)** — база, установленная на **EC2**: патчи ОС и движка, резервные копии, высокая доступность и масштабирование — всё на клиенте.
- **Управляемая (managed)** — Amazon RDS, Aurora, DynamoDB, Redshift: AWS берёт на себя **выделение ресурсов, масштабирование, патчи и резервные копии**; клиент **проектирует структуры данных и управляет доступом**.
## Amazon RDS
- Реляционные движки: **Amazon Aurora, MySQL, MariaDB, PostgreSQL, Oracle, Microsoft SQL Server**.
> Ловушка экзамена: **Amazon Redshift — НЕ движок RDS**, это отдельный сервис хранилища данных. DynamoDB тоже не движок RDS (NoSQL).
| | Multi-AZ deployment | Read replica |
|---|---|---|
| Зачем | **доступность** — автоматический failover | **масштабирование чтения** |
| Репликация | **синхронная** на резервную копию (standby) в другой AZ | **асинхронная** |
| Обслуживает чтение? | нет — standby только ждёт | да |
| При сбое | RDS делает standby основной; endpoint тот же | повышают вручную |
@diagram cc9-rds-multiaz
- «Автоматический failover в другую AZ, если основная база упала» → **Multi-AZ**. Read replica — про производительность, Provisioned IOPS — более быстрое хранилище, DynamoDB global tables — вообще другая база.
- RDS работает в VPC, в **DB subnet group** с подсетями минимум в двух AZ; автоматические резервные копии позволяют восстановиться на момент времени.
## Amazon Aurora
Совместимый с MySQL и PostgreSQL движок от AWS: до 5× производительности MySQL и 3× PostgreSQL, **шесть копий данных в трёх AZ**, непрерывное резервное копирование в S3. Управляется через RDS, оплата pay-as-you-go.
## Amazon DynamoDB
Бессерверная (serverless) база **NoSQL** (ключ-значение и документы): задержка в единицы миллисекунд при любом масштабе, автоматическое масштабирование, серверами управлять не нужно. Таблица хранит **items**; у каждого item есть **attributes**; **первичный ключ** — partition key, иногда с sort key.
| Операция | Что делает |
|---|---|
| **GetItem** | один item по полному первичному ключу |
| **Query** | items по partition key (таблицы или индекса) — эффективно |
| **Scan** | читает **все items** и фильтрует — так ищут по **неключевому атрибуту** |
| **PutItem** | записывает item |
## Amazon Redshift
**Хранилище данных (data warehouse)**: колоночное хранение, SQL-аналитика (OLAP) по терабайтам и петабайтам, BI-отчёты.
| Задача | Сервис |
|---|---|
| реляционные данные, транзакции, готовое приложение на MySQL | **RDS** |
| высокопроизводительная совместимая с MySQL или PostgreSQL | **Aurora** |
| ключ-значение в огромном масштабе, задержка в миллисекунды | **DynamoDB** |
| аналитика по огромным историческим данным | **Redshift** |
?? CTO хочет автоматический failover базы RDS MySQL в другую AZ. Какая конфигурация?
?= RDS Multi-AZ deployment — синхронная резервная копия в другой AZ, которую RDS автоматически делает основной.
?? Какая операция DynamoDB находит items по атрибуту, который не входит в первичный ключ?
?= Scan — она читает все items и фильтрует; GetItem и Query требуют ключ.`,
      },
    },
    {
      id: "cc-fast-10",
      title: { en: "Labs 1–6: the facts the quiz asks about", ru: "Лабы 1–6: факты, о которых спрашивает квиз" },
      minutes: 12,
      notes: {
        en: `## Lab 1 — Introduction to AWS IAM
@diagram cc7-lab1
| User | Group | Policy | What works |
|---|---|---|---|
| user-1 | S3-Support | AmazonS3ReadOnlyAccess (AWS managed) | view S3 |
| user-2 | EC2-Support | AmazonEC2ReadOnlyAccess (AWS managed) | view EC2, cannot stop |
| user-3 | EC2-Admin | **inline** EC2-Admin-Policy: Describe, Start, Stop | view, start, stop — **not terminate** |
> Exam answer: user-3 can start and stop but cannot delete instances → **the group's permissions are limited to viewing, starting and stopping, not terminating**. Not an AWS Support lock and not an instance limit.
- Users sign in through the **IAM users sign-in URL** of the account; everything that is not allowed is implicitly denied.
## Lab 2 — Build your VPC and launch a web server
- **Lab VPC = 10.0.0.0/16**. Public subnet 1 10.0.0.0/24 and private subnet 1 10.0.1.0/24; then public subnet 2 10.0.2.0/24 and private subnet 2 10.0.3.0/24 in a second AZ.
- An internet gateway; a **NAT gateway** with an Elastic IP in public subnet 1; the public route table sends 0.0.0.0/0 to the IGW, the private one to the NAT gateway.
- **Web Security Group**: inbound **HTTP, port 80, from 0.0.0.0/0**. **Web Server 1** runs in public subnet 2 with a public IP; user data installs Apache and PHP.
## Lab 3 — Introduction to Amazon EC2
- Launch "Web Server": Amazon Linux, a micro burstable type — **t3.micro** in the current version (t2.micro in older lab text) — Lab VPC, **termination protection enabled**, user data that installs Apache.
- The browser cannot open the page → add **inbound HTTP (TCP 80)** to the security group.
- **Resize**: stop → change the type one step up to **small** (t3.small, or t2.small in old versions) → grow the EBS volume from 8 to 10 GiB → start.
- Terminate fails until **termination protection is disabled**.
## Lab 4 — Working with EBS
- Create a **1 GiB** volume in the **same AZ** as the instance → attach as /dev/sdf → create a file system and mount → **snapshot** → new volume from the snapshot → attach as /dev/sdg and mount **without mkfs**.
= sudo mkfs -t ext3 /dev/sdf
= sudo mount /dev/sdf /mnt/data-store
## Lab 5 — Build a database server
- **DB Security Group**: inbound **MySQL/Aurora, TCP 3306**, from the **Web Security Group**. **DB subnet group**: the private subnets in **two AZs**.
- **RDS MySQL**, **Multi-AZ**, Dev/Test template, identifier lab-db; the web app connects through the **endpoint**.
## Lab 6 — Scale and load balance your architecture
- **AMI** from Web Server 1 → **Application Load Balancer** in both public subnets → **launch template** → **Auto Scaling group** in the private subnets: min 2, desired 2, max 6, **target tracking on average CPU, 60%**.
- A load test pushes CPU up → the CloudWatch alarm (AlarmHigh) fires → the group launches more instances; finally Web Server 1 is terminated.
?? What CIDR block was assigned to the main VPC in the labs?
?= 10.0.0.0/16.
?? Why can user-3 stop an instance but not terminate it?
?= The EC2-Admin group's inline policy allows only Describe, Start and Stop; TerminateInstances is not granted, so IAM denies it implicitly.
?? Why does the DB security group in Lab 5 use the Web Security Group as its source instead of IP addresses?
?= Then only the web servers can reach port 3306, including new ones with new IPs, and nothing from the internet.`,
        ru: `## Lab 1 — Introduction to AWS IAM
@diagram cc7-lab1
| Пользователь | Группа | Политика | Что работает |
|---|---|---|---|
| user-1 | S3-Support | AmazonS3ReadOnlyAccess (AWS managed) | просмотр S3 |
| user-2 | EC2-Support | AmazonEC2ReadOnlyAccess (AWS managed) | просмотр EC2, остановить нельзя |
| user-3 | EC2-Admin | **inline** EC2-Admin-Policy: Describe, Start, Stop | просмотр, запуск, остановка — **но не удаление** |
> Ответ на экзамене: user-3 может запускать и останавливать, но не удалять инстансы → **права группы ограничены просмотром, запуском и остановкой, без terminate**. Это не блокировка AWS Support и не лимит инстансов.
- Пользователи входят по **IAM users sign-in URL** аккаунта; всё, что не разрешено, неявно запрещено.
## Lab 2 — Build your VPC and launch a web server
- **Lab VPC = 10.0.0.0/16**. Public subnet 1 10.0.0.0/24 и private subnet 1 10.0.1.0/24; затем public subnet 2 10.0.2.0/24 и private subnet 2 10.0.3.0/24 во второй AZ.
- Internet gateway; **NAT gateway** с Elastic IP в public subnet 1; публичная таблица маршрутов отправляет 0.0.0.0/0 на IGW, частная — на NAT gateway.
- **Web Security Group**: входящее **HTTP, порт 80, от 0.0.0.0/0**. **Web Server 1** работает в public subnet 2 с публичным IP; user data ставит Apache и PHP.
## Lab 3 — Introduction to Amazon EC2
- Запуск «Web Server»: Amazon Linux, burstable-тип размера micro — **t3.micro** в текущей версии (t2.micro в старом тексте лабы), Lab VPC, **включённая termination protection**, user data ставит Apache.
- Браузер не открывает страницу → добавить в security group **входящее HTTP (TCP 80)**.
- **Смена размера**: stop → тип на ступень выше, **small** (t3.small, в старых версиях t2.small) → том EBS увеличить с 8 до 10 GiB → start.
- Terminate не проходит, пока **termination protection не выключена**.
## Lab 4 — Working with EBS
- Создать том **1 GiB** в **той же AZ**, что и инстанс → подключить как /dev/sdf → создать файловую систему и смонтировать → **snapshot** → новый том из snapshot → подключить как /dev/sdg и смонтировать **без mkfs**.
= sudo mkfs -t ext3 /dev/sdf
= sudo mount /dev/sdf /mnt/data-store
## Lab 5 — Build a database server
- **DB Security Group**: входящее **MySQL/Aurora, TCP 3306** от **Web Security Group**. **DB subnet group**: частные подсети в **двух AZ**.
- **RDS MySQL**, **Multi-AZ**, шаблон Dev/Test, идентификатор lab-db; веб-приложение подключается через **endpoint**.
## Lab 6 — Scale and load balance your architecture
- **AMI** из Web Server 1 → **Application Load Balancer** в обеих публичных подсетях → **launch template** → **Auto Scaling group** в частных подсетях: min 2, desired 2, max 6, **target tracking по среднему CPU, 60%**.
- Нагрузочный тест поднимает CPU → срабатывает alarm CloudWatch (AlarmHigh) → группа запускает новые инстансы; в конце Web Server 1 удаляют.
?? Какой CIDR-блок был у главной VPC в лабах?
?= 10.0.0.0/16.
?? Почему user-3 может остановить инстанс, но не удалить его?
?= Inline policy группы EC2-Admin разрешает только Describe, Start и Stop; TerminateInstances не выдан, поэтому IAM неявно запрещает его.
?? Почему в Lab 5 источник правила DB security group — Web Security Group, а не IP-адреса?
?= Так до порта 3306 достают только веб-серверы, включая новые с новыми IP, и ничего из интернета.`,
      },
    },
    {
      id: "cc-fast-11",
      title: { en: "Final checklist for the last 15 minutes", ru: "Финальный чек-лист на последние 15 минут" },
      minutes: 10,
      notes: {
        en: `## Plan for the quiz itself
- **Pass 1** (about 10 minutes): answer every question in under 20 seconds; anything doubtful — pick the best guess and **flag** it.
- **Pass 2** (the remaining minutes): only the flagged ones. Change an answer only for a concrete reason.
- "Select all that apply": choose every option that fits and none that does not.
- "What is this?" pictures: AZs inside a Region box → **Availability Zones**; an icon in the public subnet used by the private route table → **NAT gateway**; boxes connected to EFS mount targets → **EC2 instances**.
## "NOT" questions — the full list
| Question | The option that is NOT |
|---|---|
| benefits of the cloud | pay for racking, stacking and powering servers |
| Region selection factors | availability of reservation options |
| RDS database engines | Amazon Redshift |
| what IAM is for | OS and application authentication |
| charged per GB | inbound data transfer (mostly free) |
| support plans | Startup, Free, Bronze, Silver, Gold |
| scaling tools | CloudFormation, AWS Config, Availability Zones |
## Pairs that are easy to swap
| Pair | Difference |
|---|---|
| CloudTrail vs CloudWatch | who did it vs how it performs now |
| SNS vs SQS | push to many now vs a queue for later |
| Security group vs network ACL | instance, stateful, allow only vs subnet, stateless, allow and deny |
| Multi-AZ vs read replica | failover vs read scaling |
| EFS vs FSx | Linux NFS vs Windows SMB |
| EBS vs instance store | persists on stop vs lost on stop |
| Latency vs geolocation | the fastest Region vs the user's country |
| Target tracking vs scheduled action | a metric target vs a fixed time |
| Reserved Instances vs Savings Plans | an instance configuration vs dollars per hour of spend |
| Dedicated Host vs Dedicated Instance | you control the server vs the hardware is simply not shared |
| IAM role vs IAM user | temporary vs long-term credentials |
| Trusted Advisor vs AWS Config | best-practice advice vs configuration history and rules |
> Last rule: when two options both sound right, take the one that matches the **exact signal** in the question — "temporary", "real time", "who", "automatic failover", "interruptible", "SMB".
## After this block
- Open **"Real midterm questions"** — the questions students brought from the actual quiz, with explanations of the right answers.
- Then take the **final 40-question quiz** at exam pace: 15 minutes, no notes. For every miss, reread the matching row of the signal table in block 1.
?? Which two services answer "scale with demand" in a select-all question?
?= Elastic Load Balancing and Amazon EC2 Auto Scaling.
?? What are the four AWS Support plans in the course?
?= Basic, Developer, Business and Enterprise.`,
        ru: `## План на сам квиз
- **Проход 1** (около 10 минут): на каждый вопрос не больше 20 секунд; сомнительное — выбрать лучший вариант и **пометить флажком (flag)**.
- **Проход 2** (оставшиеся минуты): только помеченные. Менять ответ — только при конкретной причине.
- «Select all that apply»: отметить все подходящие варианты и ни одного лишнего.
- Картинки «What is this?»: AZ внутри рамки региона → **Availability Zones**; иконка в публичной подсети, через которую идёт частная таблица маршрутов → **NAT gateway**; блоки, подключённые к mount targets EFS → **EC2 instances**.
## Вопросы с «NOT» — полный список
| Вопрос | Вариант, который НЕ подходит |
|---|---|
| преимущества облака | pay for racking, stacking and powering servers |
| факторы выбора региона | availability of reservation options |
| движки баз RDS | Amazon Redshift |
| для чего IAM | аутентификация в ОС и приложениях |
| оплата за ГБ | входящий трафик (почти всегда бесплатен) |
| планы поддержки | Startup, Free, Bronze, Silver, Gold |
| инструменты масштабирования | CloudFormation, AWS Config, Availability Zones |
## Пары, которые легко перепутать
| Пара | Разница |
|---|---|
| CloudTrail и CloudWatch | кто сделал и как работает сейчас |
| SNS и SQS | толкнуть многим сейчас и очередь на потом |
| Security group и network ACL | инстанс, stateful, только allow и подсеть, stateless, allow и deny |
| Multi-AZ и read replica | failover и масштабирование чтения |
| EFS и FSx | Linux NFS и Windows SMB |
| EBS и instance store | сохраняется при stop и теряется при stop |
| Latency и geolocation | самый быстрый регион и страна пользователя |
| Target tracking и scheduled action | цель по метрике и фиксированное время |
| Reserved Instances и Savings Plans | конфигурация инстанса и сумма расходов в час |
| Dedicated Host и Dedicated Instance | сервер под контролем клиента и просто железо без соседей |
| IAM role и IAM user | временные и долгосрочные учётные данные |
| Trusted Advisor и AWS Config | советы по лучшим практикам и история конфигурации с правилами |
> Последнее правило: если два варианта звучат верно, выбирать тот, что совпадает с **точным сигналом** в вопросе — «temporary», «real time», «who», «automatic failover», «interruptible», «SMB».
## После этого блока
- Открыть **«Реальные вопросы мидтерма»** — вопросы, которые студенты принесли с настоящего квиза, с разбором верных ответов.
- Потом пройти **итоговый квиз на 40 вопросов** в темпе экзамена: 15 минут, без конспекта. Каждую ошибку — перечитать нужную строку таблицы сигналов в блоке 1.
?? Какие два сервиса — ответ на «scale with demand» в вопросе select-all?
?= Elastic Load Balancing и Amazon EC2 Auto Scaling.
?? Какие четыре плана AWS Support даёт курс?
?= Basic, Developer, Business и Enterprise.`,
      },
    },
  ],
};
