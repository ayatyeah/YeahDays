import { part, qx, tfx, type Lecture } from "../types";

export const lecture3: Lecture = {
  id: "cc-l3",
  title: { en: "Lecture 3 — Cloud Compute and Storage Services", ru: "Лекция 3 — Облачные вычисления и хранилища" },
  parts: [
    part(
      "cc-l3-p1",
      { en: "Compute services and Amazon EC2", ru: "Вычислительные сервисы и Amazon EC2" },
      {
        en: `## Three service models — a recap
A computing stack has three layers, and each service model hands one more layer to the cloud provider:
- **IaaS (Infrastructure as a Service)** — delivers fundamental **compute, network and storage** resources **on-demand, over the internet, on a pay-as-you-go basis**. The provider hosts the infrastructure of an on-premises data center **plus the virtualization (hypervisor) layer**; you get servers, networking, storage and data center space without managing or operating them.
- **PaaS (Platform as a Service)** — access to a platform: the hardware and software tools needed to develop and deploy applications to users over the internet.
- **SaaS (Software as a Service)** — a software licensing and delivery model: applications are centrally hosted and licensed on a **subscription** basis, also called "on-demand software".
@diagram cc-service-models
## Pizza as a Service — shared responsibility
| Model | Pizza analogy | Who does what |
|---|---|---|
| On-premises | made at home | you manage everything: table, soda, gas, oven, fire, dough, sauce, toppings, cheese |
| IaaS | take and bake | the vendor makes the pizza; you bake it with your own oven, fire and gas |
| PaaS | pizza delivered | the vendor also bakes and delivers it; you provide only the table and soda |
| SaaS | dined out | the vendor manages everything |
The more "as a service", the more the vendor manages — this split of duties is the idea of **shared responsibility**.
## AWS compute services
- **Amazon EC2** — resizable virtual machines.
- **Amazon EC2 Auto Scaling** — automatically launches or terminates EC2 instances by conditions you define, to keep the application available.
- **Amazon ECR (Elastic Container Registry)** — stores and retrieves Docker images.
- **Amazon ECS (Elastic Container Service)** — container orchestration that supports Docker.
- **Amazon EKS (Elastic Kubernetes Service)** — managed Kubernetes on AWS.
- **AWS Fargate** — runs containers without you managing servers or clusters.
- **AWS Lambda** — serverless compute; you pay only for the compute time you use.
- **AWS Elastic Beanstalk** — a simple way to run and manage web applications.
- **Amazon Lightsail** — a simple-to-use service for building an application or website.
- **AWS Batch** — runs batch jobs at any scale.
- **AWS Outposts** — runs select AWS services in your on-premises data center.
- **AWS Serverless Application Repository** — discover, deploy and publish serverless applications.
- **VMware Cloud on AWS** — provision a hybrid cloud without custom hardware.
## Four categories of compute services
| Category | Services | Key concepts | Ease of use |
|---|---|---|---|
| IaaS (virtual machines) | Amazon EC2 | instance-based; provision VMs you manage as you choose | a familiar concept to many IT professionals |
| Serverless | AWS Lambda | function-based, low-cost; code runs on a schedule or is triggered by events | new for many IT staff, easy once learned; use when possible |
| Container-based | ECS, EKS, Fargate, ECR | instance-based; spin up and run jobs more quickly | Fargate reduces admin overhead; other options give more control |
| PaaS | AWS Elastic Beanstalk | for web applications; focus on your code; ties into databases, DNS | fast and easy to get started |
- **EC2 (IaaS)** leaves many server management duties to you: you choose the OS and the size and resources of the servers.
- **Lambda** is a **zero-administration** platform: no servers to provision; it supports cloud-native architectures that scale massively at a lower cost than servers running 24/7.
- **Containers** run multiple workloads on a single operating system and spin up faster than VMs.
- **Elastic Beanstalk**: AWS manages the OS, the application server and the infrastructure, so you focus on your application code.
## Why EC2: the problem with on-premises servers
On-premises servers are expensive: hardware is bought from project plans instead of real usage, data centers are costly to build, staff and maintain, and you must permanently own enough hardware for **traffic spikes and peak workloads** — so capacity sits **idle** much of the time.
![A cold aisle of an on-premises data center with tall black server racks, blinking blue and green status lights and bundled network cables](/events/cc/l3-onprem-server-room.webp)
**Amazon EC2** provides secure, resizable compute capacity in the cloud. Typical uses: application, web, database, game, mail, media, catalog, file, computing and proxy servers.
## Scaling up versus scaling out
- **Scaling up (vertical scaling)** — add resources (CPU, memory, disk) to one machine, e.g. 1 GB/1 vCPU → 4 GB/2 vCPU → 32 GB/8 vCPU. The reverse is **scaling down**.
- **Scaling out (horizontal scaling)** — add more servers and spread the workload across more machines. The reverse is **scaling in**.
@diagram cc-scale-up-out
## Amazon EC2 overview
EC2 = **Elastic Compute Cloud**: **Elastic** — you can easily increase or decrease the number of servers automatically and the size of existing servers; **Compute** — hosting applications and processing data needs CPU and RAM; **Cloud** — the instances are hosted in the cloud.
- Provides virtual machines called **EC2 instances** and gives you full administrative control over the **guest operating system** (Windows or Linux: Windows Server 2008–2019, Red Hat, SuSE, Ubuntu, Amazon Linux).
- The **host OS** is installed directly on the server hardware that hosts the VMs; the OS inside a VM is the **guest OS**.
- Launch any number of instances of any size into any **Availability Zone** in the world, with a few clicks or a line of code; they are ready in minutes.
- Instances launch from **Amazon Machine Images (AMIs)**; traffic to and from instances is controlled by **security groups**.
- Choices in the **Launch Instance Wizard**: AMI, instance type, network settings, IAM role, user data, storage options, tags, security group, key pair.
![AWS console Launch an instance page with Quick Start AMI tiles for Amazon Linux, Ubuntu and Windows, and an instance type dropdown set to t3.micro](/events/cc/l3-ec2-launch-wizard.webp)
## Step 1 — select an AMI
An **AMI** is a template used to create an EC2 instance: it contains a Windows or Linux OS and often pre-installed software. You must specify a source AMI, and one AMI can launch many instances. An AMI includes a **template for the root volume** (the OS and everything installed in it), **launch permissions** (which AWS accounts can use it) and a **block device mapping** (volumes to attach at launch).
| AMI source | What it is |
|---|---|
| Quick Start | Linux and Windows AMIs provided by AWS |
| My AMIs | AMIs that you created |
| AWS Marketplace | pre-configured templates from third parties, a catalog of thousands of solutions |
| Community AMIs | shared by others and not checked by AWS — use at your own risk, avoid in production |
## Step 2 — select an instance type
The instance type determines **memory (RAM), processing power (CPU), disk space and type (storage) and network performance**. Name example **t3.large**: **t** = family, **3** = generation (higher = more powerful, better value), **large** = size. Each size step doubles the resources: t3.2xlarge has twice the vCPU and memory of t3.xlarge, which has twice those of t3.large. **Network bandwidth** also grows with size.
| Instance | vCPU | Memory (GB) | Storage |
|---|---|---|---|
| t3.nano | 2 | 0.5 | EBS-only |
| t3.micro | 2 | 1 | EBS-only |
| t3.small | 2 | 2 | EBS-only |
| t3.medium | 2 | 4 | EBS-only |
| t3.large | 2 | 8 | EBS-only |
| t3.xlarge | 4 | 16 | EBS-only |
| t3.2xlarge | 8 | 32 | EBS-only |
## Choosing by use case
| Category | Families | Use case |
|---|---|---|
| General purpose | a1, m4, m5, t2, t3 | broad |
| Compute optimized | c4, c5 | high performance |
| Memory optimized | r4, r5, x1, z1 | in-memory databases |
| Accelerated computing | f1, g3, g4, p2, p3 | machine learning |
| Storage optimized | d2, h1, i3 | distributed file systems |
- **T3** — burstable general purpose: a baseline CPU level with bursts above it; websites, development and test environments, build servers, code repositories, microservices.
- **C5** — compute-intensive work at a low price per compute ratio: scientific modeling, batch processing, ad serving, multiplayer gaming, video encoding.
- **R5** — memory-intensive work: high-performance and in-memory databases, data mining, caches, real-time big data, Hadoop and Spark clusters.
## Launching with the AWS CLI
Instances can also be created programmatically, with the **AWS CLI** or an **SDK**. The minimal command:
= aws ec2 run-instances --image-id ami-1a2b3c4d --count 1 --instance-type c3.large --key-name MyKeyPair --security-groups MySecurityGroup --region us-east-1
- **aws** — the command line utility; **ec2** — the service; **run-instances** — the subcommand.
- **--image-id** — the AMI ID (unique for every AMI); **--count** — how many instances; **--instance-type** — e.g. c3.large; **--key-name** and **--security-groups** — assumed to exist already; **--region** — AMIs live in a Region, so the CLI must know where to look.
- The command succeeds if it is well formed, the resources exist, you have the **permissions** and the account has enough **capacity**; the API answers with the **instance ID**.
> EC2 is IaaS: pick an AMI (what runs) and an instance type (how big); scale up for a bigger machine, scale out for more machines.
?? An application needs a high-performance in-memory database. Which instance category fits?
?= Memory optimized (r4, r5, x1, z1) — R5 is the lecture's example for in-memory databases.
?? How much memory does t3.xlarge have compared with t3.large?
?= Twice as much — 16 GB against 8 GB (and 4 vCPU against 2). Each size step doubles.`,
        ru: `## Три модели обслуживания — повторение
Вычислительный стек состоит из трёх уровней, и каждая модель передаёт провайдеру ещё один уровень:
- **IaaS (Infrastructure as a Service)** — предоставляет базовые ресурсы **compute, network и storage** **по запросу (on-demand), через интернет, с оплатой по факту (pay-as-you-go)**. Провайдер размещает инфраструктуру, которая раньше стояла в собственном дата-центре, **плюс уровень виртуализации (hypervisor)**; вы получаете серверы, сеть, хранилище и место в дата-центре, не управляя ими.
- **PaaS (Platform as a Service)** — доступ к платформе: аппаратным и программным инструментам для разработки и развёртывания приложений через интернет.
- **SaaS (Software as a Service)** — модель лицензирования и доставки ПО: приложения размещены централизованно и продаются по **подписке (subscription)**; её ещё называют «on-demand software».
@diagram cc-service-models
## Pizza as a Service — разделение ответственности
| Модель | Аналогия с пиццей | Кто что делает |
|---|---|---|
| On-premises | готовим дома | всё на вас: стол, газировка, газ, печь, огонь, тесто, соус, начинка, сыр |
| IaaS | take and bake — купил и запёк | пиццу делает продавец; печёте вы в своей печи, на своём огне и газе |
| PaaS | доставка пиццы | продавец ещё и печёт, и привозит; от вас — только стол и газировка |
| SaaS | ужин в ресторане | всем управляет продавец |
Чем больше «as a service», тем больше берёт на себя продавец — это и есть идея **shared responsibility (разделённой ответственности)**.
## Вычислительные сервисы AWS
- **Amazon EC2** — виртуальные машины изменяемого размера.
- **Amazon EC2 Auto Scaling** — сам запускает или завершает EC2-инстансы по заданным вами условиям, чтобы приложение оставалось доступным.
- **Amazon ECR (Elastic Container Registry)** — хранит и выдаёт Docker-образы.
- **Amazon ECS (Elastic Container Service)** — оркестрация контейнеров с поддержкой Docker.
- **Amazon EKS (Elastic Kubernetes Service)** — управляемый Kubernetes в AWS.
- **AWS Fargate** — запускает контейнеры, не заставляя вас управлять серверами или кластерами.
- **AWS Lambda** — бессерверные (serverless) вычисления; платите только за использованное время вычислений.
- **AWS Elastic Beanstalk** — простой способ запускать веб-приложения и управлять ими.
- **Amazon Lightsail** — простой сервис для создания приложения или сайта.
- **AWS Batch** — пакетные задания любого масштаба.
- **AWS Outposts** — избранные сервисы AWS в вашем собственном дата-центре (on-premises).
- **AWS Serverless Application Repository** — поиск, развёртывание и публикация serverless-приложений.
- **VMware Cloud on AWS** — гибридное облако без специального оборудования.
## Четыре категории вычислительных сервисов
| Категория | Сервисы | Ключевые идеи | Простота |
|---|---|---|---|
| IaaS (виртуальные машины) | Amazon EC2 | instance-based; VM, которыми вы управляете как хотите | знакомая идея для большинства IT-специалистов |
| Serverless | AWS Lambda | function-based, дёшево; код запускается по расписанию или по событию | новое для многих, но просто после изучения; используйте, где можно |
| Контейнерные | ECS, EKS, Fargate, ECR | instance-based; задачи стартуют и выполняются быстрее | Fargate снижает административную нагрузку; другие варианты дают больше контроля |
| PaaS | AWS Elastic Beanstalk | для веб-приложений; фокус на коде; легко связать с базами данных, DNS | быстро и легко начать |
- **EC2 (IaaS)** оставляет вам многие обязанности по управлению сервером: вы выбираете ОС, размер и ресурсы серверов.
- **Lambda** — платформа **zero-administration**: серверы создавать не нужно; она поддерживает cloud-native архитектуры, которые масштабируются в огромных пределах и дешевле, чем серверы, работающие 24/7.
- **Контейнеры** запускают несколько рабочих нагрузок на одной ОС и стартуют быстрее VM.
- **Elastic Beanstalk**: AWS управляет ОС, сервером приложений и инфраструктурой, а вы занимаетесь только кодом.
## Зачем EC2: проблема собственных серверов
Свои серверы (on-premises) дороги: оборудование покупают по планам проектов, а не по реальной нагрузке, дата-центры дорого строить, обслуживать и содержать, а железа нужно постоянно держать столько, чтобы выдержать **пики трафика и максимальные нагрузки** — и большую часть времени мощности **простаивают (idle)**.
![Холодный коридор собственного дата-центра: высокие чёрные серверные стойки, мигающие синие и зелёные индикаторы и пучки сетевых кабелей](/events/cc/l3-onprem-server-room.webp)
**Amazon EC2** даёт безопасные вычислительные мощности изменяемого размера в облаке. Типичные применения: серверы приложений, веб, баз данных, игровые, почтовые, медиа, каталогов, файловые, вычислительные и прокси-серверы.
## Scaling up и scaling out
- **Scaling up (вертикальное масштабирование)** — добавить ресурсы (CPU, память, диск) одной машине, например 1 GB/1 vCPU → 4 GB/2 vCPU → 32 GB/8 vCPU. Обратное — **scaling down**.
- **Scaling out (горизонтальное масштабирование)** — добавить серверы и распределить нагрузку по большему числу машин. Обратное — **scaling in**.
@diagram cc-scale-up-out
## Обзор Amazon EC2
EC2 = **Elastic Compute Cloud**: **Elastic** — легко и автоматически увеличивать или уменьшать число серверов и размер существующих; **Compute** — приложениям и обработке данных нужны CPU и RAM; **Cloud** — инстансы размещены в облаке.
- Даёт виртуальные машины — **EC2 instances** — и полный административный контроль над **гостевой ОС (guest OS)**: Windows или Linux (Windows Server 2008–2019, Red Hat, SuSE, Ubuntu, Amazon Linux).
- **Host OS** установлена прямо на железо сервера, на котором работают VM; ОС внутри VM — **guest OS**.
- Сколько угодно инстансов любого размера в любой **Availability Zone** мира — парой кликов или одной строкой кода; они готовы за минуты.
- Инстансы запускаются из **Amazon Machine Images (AMI)**; трафик к ним и от них контролируют **security groups**.
- Выбор в **Launch Instance Wizard**: AMI, instance type, сетевые настройки, IAM role, user data, хранилище, теги, security group, key pair.
![Страница Launch an instance в консоли AWS: плитки Quick Start AMI с Amazon Linux, Ubuntu и Windows и выпадающий список instance type со значением t3.micro](/events/cc/l3-ec2-launch-wizard.webp)
## Шаг 1 — выбрать AMI
**AMI** — шаблон для создания EC2-инстанса: в нём ОС Windows или Linux и часто предустановленное ПО. Исходный AMI указывать обязательно, и из одного AMI можно запустить много инстансов. AMI включает **шаблон корневого тома (root volume)** — ОС и всё установленное в ней, **launch permissions** — какие аккаунты AWS могут его использовать, и **block device mapping** — какие тома подключить при запуске.
| Источник AMI | Что это |
|---|---|
| Quick Start | AMI с Linux и Windows от самой AWS |
| My AMIs | AMI, которые создали вы |
| AWS Marketplace | готовые шаблоны сторонних компаний, каталог из тысяч решений |
| Community AMIs | выложены другими людьми и AWS не проверены — на свой риск, не для продакшена |
## Шаг 2 — выбрать instance type
Instance type определяет **память (RAM), вычислительную мощность (CPU), объём и тип диска (storage) и производительность сети**. Пример имени **t3.large**: **t** = семейство (family), **3** = поколение (generation; выше — мощнее и выгоднее), **large** = размер (size). Каждый шаг размера удваивает ресурсы: у t3.2xlarge вдвое больше vCPU и памяти, чем у t3.xlarge, а у неё — вдвое больше, чем у t3.large. **Пропускная способность сети** тоже растёт с размером.
| Инстанс | vCPU | Память (GB) | Хранилище |
|---|---|---|---|
| t3.nano | 2 | 0.5 | только EBS |
| t3.micro | 2 | 1 | только EBS |
| t3.small | 2 | 2 | только EBS |
| t3.medium | 2 | 4 | только EBS |
| t3.large | 2 | 8 | только EBS |
| t3.xlarge | 4 | 16 | только EBS |
| t3.2xlarge | 8 | 32 | только EBS |
## Выбор по задаче
| Категория | Семейства | Задача |
|---|---|---|
| General purpose | a1, m4, m5, t2, t3 | широкий круг задач |
| Compute optimized | c4, c5 | высокая производительность |
| Memory optimized | r4, r5, x1, z1 | in-memory базы данных |
| Accelerated computing | f1, g3, g4, p2, p3 | машинное обучение |
| Storage optimized | d2, h1, i3 | распределённые файловые системы |
- **T3** — burstable general purpose: базовый уровень CPU с возможностью кратко его превышать; сайты, среды разработки и тестирования, build-серверы, репозитории кода, микросервисы.
- **C5** — вычислительно тяжёлые задачи по низкой цене за единицу вычислений: научное моделирование, пакетная обработка, показ рекламы, многопользовательские игры, кодирование видео.
- **R5** — задачи, которым нужно много памяти: высокопроизводительные и in-memory базы данных, data mining, кэши, обработка big data в реальном времени, кластеры Hadoop и Spark.
## Запуск через AWS CLI
Инстансы можно создавать и программно — через **AWS CLI** или **SDK**. Минимальная команда:
= aws ec2 run-instances --image-id ami-1a2b3c4d --count 1 --instance-type c3.large --key-name MyKeyPair --security-groups MySecurityGroup --region us-east-1
- **aws** — утилита командной строки; **ec2** — сервис; **run-instances** — подкоманда.
- **--image-id** — ID AMI (у каждого AMI свой); **--count** — сколько инстансов; **--instance-type** — например c3.large; **--key-name** и **--security-groups** — считается, что они уже существуют; **--region** — AMI живут в регионе, и CLI должен знать, где искать.
- Команда сработает, если она правильно составлена, нужные ресурсы есть, у вас достаточно **прав (permissions)** и в аккаунте хватает **ёмкости (capacity)**; API отвечает **instance ID**.
> EC2 — это IaaS: выбери AMI (что запускать) и instance type (насколько мощно); scale up — машина побольше, scale out — машин побольше.
?? Приложению нужна высокопроизводительная in-memory база данных. Какая категория инстансов подходит?
?= Memory optimized (r4, r5, x1, z1) — R5 в лекции приведён как пример для in-memory баз данных.
?? Сколько памяти у t3.xlarge по сравнению с t3.large?
?= Вдвое больше — 16 GB против 8 GB (и 4 vCPU против 2). Каждый шаг размера удваивает ресурсы.`,
      },
      [
        qx("In IaaS, what does the cloud provider host in addition to the data center infrastructure?", "The virtualization (hypervisor) layer", [
          ["The customer's application source code", "Application code stays with the customer in IaaS; only SaaS hands the application over.", "В IaaS код приложения остаётся за клиентом; приложение целиком передаётся только в SaaS."],
          ["The guest operating system and its patches", "In IaaS you choose and manage the guest OS yourself.", "В IaaS гостевую ОС выбираете и обслуживаете вы сами."],
          ["The application runtime", "The runtime is taken over by the provider only from PaaS upward.", "Среду выполнения провайдер берёт на себя только начиная с PaaS."],
        ], "IaaS delivers compute, network and storage; the provider hosts the data center components plus the virtualization or hypervisor layer.", "IaaS даёт compute, network и storage; провайдер размещает компоненты дата-центра плюс уровень виртуализации (hypervisor)."),
        qx("In the 'Pizza as a Service' analogy, which model is 'take and bake'?", "IaaS", [
          ["PaaS", "PaaS is 'pizza delivered': the vendor also bakes it.", "PaaS — «доставка пиццы»: продавец ещё и печёт."],
          ["SaaS", "SaaS is 'dined out': the vendor manages everything.", "SaaS — «ужин в ресторане»: всем управляет продавец."],
          ["On-premises", "On-premises is 'made at home': you manage everything.", "On-premises — «готовим дома»: всё делаете вы."],
        ], "You get a ready pizza but bake it in your own oven — like getting infrastructure and running everything on top of it yourself.", "Пиццу дают готовой, но печёте вы в своей печи — как инфраструктура, на которой всё остальное запускаете сами."),
        qx("Which AWS compute service provides resizable virtual machines?", "Amazon EC2", [
          ["AWS Lambda", "Lambda is serverless: it runs functions and gives you no VM to manage.", "Lambda — serverless: он запускает функции, VM у вас нет."],
          ["Amazon ECR", "ECR is a registry that stores and retrieves Docker images.", "ECR — реестр, который хранит и выдаёт Docker-образы."],
          ["AWS Batch", "AWS Batch runs batch jobs at any scale; it is not the VM service.", "AWS Batch запускает пакетные задания любого масштаба; это не сервис VM."],
        ], "EC2 (Elastic Compute Cloud) provides resizable virtual machines called EC2 instances.", "EC2 (Elastic Compute Cloud) даёт виртуальные машины изменяемого размера — EC2 instances."),
        qx("Which AWS service automatically launches or terminates EC2 instances based on conditions you define?", "Amazon EC2 Auto Scaling", [
          ["AWS Elastic Beanstalk", "Elastic Beanstalk is the PaaS for deploying web apps, not the instance-scaling service itself.", "Elastic Beanstalk — PaaS для развёртывания веб-приложений, а не сам сервис масштабирования инстансов."],
          ["AWS Outposts", "Outposts runs select AWS services in your on-premises data center.", "Outposts запускает избранные сервисы AWS в вашем собственном дата-центре."],
          ["AWS Serverless Application Repository", "It is a catalog to discover, deploy and publish serverless apps.", "Это каталог, где ищут, развёртывают и публикуют serverless-приложения."],
        ], "EC2 Auto Scaling supports availability by launching or terminating instances when your conditions are met.", "EC2 Auto Scaling поддерживает доступность: запускает или завершает инстансы при выполнении ваших условий."),
        qx("A team wants code to run only when an event occurs and to pay only for the compute time used. Which service fits?", "AWS Lambda", [
          ["Amazon EC2", "An EC2 instance is a VM that you pay for while it runs, even when idle.", "EC2-инстанс — это VM, за которую платят, пока она работает, даже без нагрузки."],
          ["Amazon ECR", "ECR only stores Docker images; it runs no code.", "ECR только хранит Docker-образы и не выполняет код."],
          ["AWS Outposts", "Outposts brings AWS services to your own data center; it is not event-driven compute.", "Outposts переносит сервисы AWS в ваш дата-центр; это не вычисления по событиям."],
        ], "Lambda is serverless and function-based: code runs on a schedule or when triggered by events, and you pay only for compute time.", "Lambda — serverless и function-based: код запускается по расписанию или по событию, и вы платите только за время вычислений."),
        qx("Which AWS compute service is the platform as a service (PaaS) option for web applications?", "AWS Elastic Beanstalk", [
          ["Amazon EC2 Auto Scaling", "Auto Scaling adds or removes EC2 instances — that is still IaaS.", "Auto Scaling добавляет и убирает EC2-инстансы — это всё ещё IaaS."],
          ["Amazon Elastic Container Service", "ECS belongs to the container-based category.", "ECS относится к контейнерной категории."],
          ["AWS Lambda", "Lambda is serverless computing, a separate category.", "Lambda — бессерверные вычисления, отдельная категория."],
        ], "Elastic Beanstalk provides the OS, application server and infrastructure, so you focus on your code.", "Elastic Beanstalk берёт на себя ОС, сервер приложений и инфраструктуру — вы занимаетесь только кодом."),
        qx("Which group of AWS services forms the container-based compute category?", "ECS, EKS, Fargate and ECR", [
          ["EC2, Lightsail and Outposts", "These provide virtual machines or on-premises hardware, not container orchestration.", "Эти сервисы дают виртуальные машины или оборудование on-premises, а не оркестрацию контейнеров."],
          ["Lambda and Elastic Beanstalk", "Lambda is serverless and Elastic Beanstalk is PaaS.", "Lambda — serverless, а Elastic Beanstalk — PaaS."],
          ["Batch, Auto Scaling and EC2", "These run batch jobs and scale VMs; they are not the container services.", "Они запускают пакетные задания и масштабируют VM; это не контейнерные сервисы."],
        ], "ECS and EKS orchestrate containers, Fargate runs them without servers and ECR stores the images.", "ECS и EKS оркестрируют контейнеры, Fargate запускает их без серверов, а ECR хранит образы."),
        qx("What is scaling up (vertical scaling)?", "Adding CPU, memory or disk to one server", [
          ["Adding more servers to spread the workload", "Adding servers is scaling out (horizontal scaling).", "Добавление серверов — это scaling out (горизонтальное масштабирование)."],
          ["Removing servers when the demand drops", "Removing servers is scaling in.", "Удаление серверов — это scaling in."],
          ["Moving the server to a larger Region", "Changing location does not add resources to the machine.", "Смена расположения не добавляет машине ресурсов."],
        ], "Scaling up adds resources such as CPU, memory and disk to one machine to increase its power.", "Scaling up добавляет одной машине ресурсы — CPU, память и диск, — чтобы сделать её мощнее."),
        qx("A web app is overloaded, so the admin adds four more identical instances behind a load balancer. What is this?", "Scaling out", [
          ["Scaling up", "Scaling up would make one instance bigger instead of adding instances.", "Scaling up сделал бы один инстанс мощнее, а не добавил новые."],
          ["Scaling in", "Scaling in removes instances; here instances are added.", "Scaling in убирает инстансы, а здесь их добавляют."],
          ["Scaling down", "Scaling down reduces the resources of a single machine.", "Scaling down уменьшает ресурсы одной машины."],
        ], "Adding more servers to spread the workload is scaling out, or horizontal scaling.", "Добавить серверы и распределить между ними нагрузку — это scaling out, горизонтальное масштабирование."),
        qx("In the name 'Elastic Compute Cloud', what does 'Elastic' refer to?", "Easily changing the number and size of servers", [
          ["Billing that stretches to fit a fixed budget", "EC2 is pay-as-you-go; 'Elastic' describes capacity, not a fixed budget.", "EC2 оплачивается по факту; «Elastic» говорит о мощностях, а не о фиксированном бюджете."],
          ["Storage that grows inside every instance", "Elastic refers to the servers' number and size, not to automatic disk growth.", "Elastic — про число и размер серверов, а не про автоматический рост диска."],
          ["Instances that keep running when hardware fails", "That is fault tolerance, which is not what the word 'Elastic' means here.", "Это отказоустойчивость, а слово «Elastic» здесь значит другое."],
        ], "Elastic means you can easily increase or decrease the number of servers automatically and the size of existing servers.", "Elastic значит, что можно легко и автоматически менять число серверов и размер существующих."),
        qx("What is an Amazon Machine Image (AMI)?", "A template used to create an EC2 instance", [
          ["A hardware profile of CPU and memory", "CPU and memory are set by the instance type, not by the AMI.", "CPU и память задаёт instance type, а не AMI."],
          ["A key pair used to log in to the instances", "Key pairs are a separate wizard choice for secure login.", "Key pair — отдельный выбор в мастере для безопасного входа."],
          ["A snapshot of an S3 bucket's objects", "An AMI describes an instance's root volume, not bucket contents.", "AMI описывает корневой том инстанса, а не содержимое бакета."],
        ], "An AMI contains a Windows or Linux OS, often with pre-installed software, and is the template for new instances.", "AMI содержит ОС Windows или Linux, часто с предустановленным ПО, и служит шаблоном для новых инстансов."),
        qx("Which AMI source is not checked by AWS and should be avoided in production?", "Community AMIs", [
          ["Quick Start", "Quick Start AMIs are provided by AWS itself.", "AMI из Quick Start предоставляет сама AWS."],
          ["My AMIs", "My AMIs are images you created yourself.", "My AMIs — образы, которые вы создали сами."],
          ["AWS Marketplace", "Marketplace is a catalog of pre-configured templates from third-party vendors.", "Marketplace — каталог готовых шаблонов от сторонних компаний."],
        ], "Community AMIs are shared by people around the world and are not checked by AWS — use them at your own risk.", "Community AMIs выкладывают люди со всего мира, AWS их не проверяет — используйте на свой риск."),
        qx("Which of these is a component of an AMI?", "A template for the instance's root volume", [
          ["The security group rules for the VPC", "Security groups are chosen separately in the launch wizard.", "Security groups выбираются в мастере запуска отдельно."],
          ["The IAM user account that launches the instance", "The AMI controls which accounts may use it, not who the launching user is.", "AMI определяет, какие аккаунты могут им пользоваться, а не кто запускает."],
          ["The instance type and its vCPU count", "The instance type is a separate choice, made after the AMI.", "Instance type — отдельный выбор, после AMI."],
        ], "An AMI includes a root volume template, launch permissions and a block device mapping.", "AMI включает шаблон корневого тома, launch permissions и block device mapping."),
        qx("In the instance type name t3.large, what does the number 3 mean?", "The generation number", [
          ["The number of vCPUs it has", "t3.large has 2 vCPUs; the 3 is not a CPU count.", "У t3.large 2 vCPU; тройка — не число процессоров."],
          ["The size of the instance", "The size is the last part of the name, 'large'.", "Размер — последняя часть имени, «large»."],
          ["The family name", "The family is the letter 't'.", "Семейство — это буква «t»."],
        ], "t is the family, 3 is the generation and large is the size; higher generations are more powerful and better value.", "t — семейство, 3 — поколение, large — размер; более новые поколения мощнее и выгоднее."),
        qx("How does t3.2xlarge compare with t3.xlarge?", "Twice the vCPU and memory", [
          ["Four times the vCPU and memory", "Each size step doubles the resources, it does not quadruple them.", "Каждый шаг размера удваивает ресурсы, а не учетверяет."],
          ["Same vCPU, twice the memory", "Both vCPU and memory double: 4 to 8 vCPU and 16 to 32 GB.", "Удваиваются и vCPU, и память: с 4 до 8 vCPU и с 16 до 32 GB."],
          ["Same resources, newer generation", "The generation is the digit 3 in both names; only the size differs.", "Поколение у обоих — цифра 3; отличается только размер."],
        ], "t3.xlarge has 4 vCPU and 16 GB; t3.2xlarge has 8 vCPU and 32 GB — twice as much.", "У t3.xlarge 4 vCPU и 16 GB, у t3.2xlarge — 8 vCPU и 32 GB, то есть вдвое больше."),
        qx("A company needs EC2 instances with GPUs for machine learning. Which category fits?", "Accelerated computing (p3, g4)", [
          ["Storage optimized (d2, h1, i3)", "Storage optimized fits distributed file systems.", "Storage optimized подходит для распределённых файловых систем."],
          ["Memory optimized (r4, r5, x1)", "Memory optimized fits in-memory databases.", "Memory optimized подходит для in-memory баз данных."],
          ["General purpose (m5, t2, t3)", "General purpose covers broad workloads, without accelerators.", "General purpose — для широкого круга задач, без ускорителей."],
        ], "Accelerated computing families (f1, g3, g4, p2, p3) are the lecture's match for machine learning.", "Семейства accelerated computing (f1, g3, g4, p2, p3) в лекции соответствуют машинному обучению."),
        qx("Which EC2 family offers burstable general purpose performance for websites and development environments?", "T3", [
          ["C5", "C5 is compute optimized for compute-intensive work like video encoding.", "C5 — compute optimized для тяжёлых вычислений вроде кодирования видео."],
          ["R5", "R5 is memory optimized for in-memory databases and big data.", "R5 — memory optimized для in-memory баз данных и big data."],
          ["P3", "P3 is accelerated computing for machine learning.", "P3 — accelerated computing для машинного обучения."],
        ], "T3 gives a baseline CPU level with the ability to burst above it — good for websites, dev and test environments.", "T3 даёт базовый уровень CPU с возможностью кратко его превышать — для сайтов, сред разработки и тестирования."),
        qx("In 'aws ec2 run-instances --image-id ami-1a2b3c4d', what does --image-id specify?", "The AMI to launch the instance from", [
          ["The instance ID returned after launch", "The instance ID is what the API returns; it is not an input.", "Instance ID возвращает API в ответ; это не входной параметр."],
          ["The key pair used to connect", "The key pair is given with --key-name.", "Key pair задаётся параметром --key-name."],
          ["The Region that holds the AMI", "The Region is given with --region.", "Регион задаётся параметром --region."],
        ], "--image-id is followed by an AMI ID; every AMI has a unique ID.", "После --image-id указывают ID AMI; у каждого AMI свой уникальный ID."),
        tfx("When you launch an instance with the AWS CLI, the --region parameter matters because AMIs exist in a Region.", true, "The CLI must know the Region where it will find the AMI and launch the instance.", "CLI должен знать регион, где искать AMI и запускать инстанс.", "Answering 'False' misses that an AMI ID belongs to one Region, so the Region is part of the request.", "Ответ «неверно» упускает, что ID AMI принадлежит одному региону, поэтому регион — часть запроса."),
        tfx("With IaaS such as Amazon EC2, AWS chooses the operating system and server size for you.", false, "In IaaS you choose the OS and the size and resources of the servers; many management duties stay with you.", "В IaaS вы сами выбираете ОС, размер и ресурсы серверов; многие обязанности по управлению остаются за вами.", "Answering 'True' describes PaaS such as Elastic Beanstalk, not EC2.", "Ответ «верно» описывает PaaS вроде Elastic Beanstalk, а не EC2."),
      ],
    ),
    part(
      "cc-l3-p2",
      { en: "Azure and GCP compute, containers and Kubernetes", ru: "Вычисления в Azure и GCP, контейнеры и Kubernetes" },
      {
        en: `## Azure compute services
Azure supports compute for development and testing, running applications and extending your datacenter, with Linux, Windows Server, SQL Server, Oracle, IBM and SAP. The main services: **Azure Virtual Machines**, **Azure App Service**, **Azure Container Instances**, **Azure Kubernetes Service (AKS)**, **Azure Functions** (serverless) and **Azure Virtual Desktop**.
When to use Azure VMs:
- **testing and development** — quickly create different OS and application configurations, then delete the VMs when they are no longer needed;
- **running applications in the cloud** — handle fluctuating demand: shut VMs down or start them quickly, and pay only for what you use;
- **extending your datacenter** — create a virtual network in Azure and add VMs to it, e.g. run SharePoint on an Azure VM;
- **disaster recovery** — if the primary datacenter fails, create VMs on Azure for the critical applications and shut them down when it is back.
**Azure Virtual Desktop** — desktop and application virtualization in the cloud: a cloud-hosted Windows usable from any location, on Windows, Mac, iOS, Android, Linux or a modern browser.
## Google Cloud compute services
- **Compute Engine** — scalable, high-performance VM instances and instance groups in Google's data centers.
- **App Engine** — build and deploy apps on a fully managed, highly scalable (serverless) platform without managing infrastructure.
- **Bare Metal Solution** — hardware for specialized workloads with low latency.
- **Cloud GPUs** — GPUs for machine learning, scientific computing and 3D visualization.
- **Confidential VM** — a Compute Engine VM with enhanced security for high-memory workloads, using **AMD Secure Encrypted Virtualization (SEV)**.
- **Preemptible VMs** (batch jobs, fault-tolerant workloads), **Shielded VMs** (reinforced VMs), **Sole-Tenant Nodes** (dedicated hardware for compliance and licensing), **VMware Engine** (managed VMware Cloud Foundation).
- **Cloud Run** — a fully managed environment for containerized apps; **GKE (Google Kubernetes Engine)** — deploy and scale containerized apps on Kubernetes.
| Need | AWS | Azure | GCP |
|---|---|---|---|
| Virtual machines (IaaS) | EC2 | Virtual Machines | Compute Engine |
| App platform (PaaS) | Elastic Beanstalk | App Service | App Engine |
| Serverless functions | Lambda | Functions | Cloud Functions (not on the slides) |
| Containers without managing servers | Fargate | Container Instances | Cloud Run |
| Managed Kubernetes | EKS | AKS | GKE |
## Tensor Processing Unit (TPU)
A **TPU** is an **AI accelerator ASIC** (application-specific integrated circuit) built by Google for neural network machine learning, especially with its **TensorFlow** software. Google used TPUs internally from **2015** and opened them to third parties in **2018** — through **Cloud TPU** and the notebook services **Kaggle** and **Colaboratory**. **TPU v4** (Google I/O, May 2021): more than **2x** the performance of v3; one v4 pod holds **4,096 chips**.
| Processor | Well suited for |
|---|---|
| TPU | CNNs (convolutional neural networks) |
| GPU | some fully-connected neural networks |
| CPU | RNNs (recurrent neural networks) |
![A Cloud TPU v4 board in a Google data center rack: a green circuit board with four large metal heat sinks over the TPU chips and thick interconnect cables](/events/cc/l3-cloud-tpu-board.webp)
## Containers
A **container** is a method of **operating system virtualization**: it runs an application and its dependencies in **resource-isolated processes**. Code, configurations and dependencies are packed into one object, which gives **environmental consistency, operational efficiency, developer productivity and version control**.
- Containers do **not contain an entire OS** — they share a virtualized OS and hold only what the software needs: code, runtime, libraries, system tools.
- Images are usually **an order of magnitude smaller** than VMs, and a container starts in **hundreds of milliseconds**.
- **Repeatable and self-contained**: software runs the same on a developer's laptop, in test and in production.
## Docker
**Docker** is a software platform that packages software into containers and lets you build, test and deploy applications quickly. It is installed on each server that hosts containers and gives simple commands to build, start or stop them. Containers are created from a template called an **image**.
Use Docker to: **standardize environments**; **reduce conflicts between language stacks and versions**; use containers as a service; run **microservices** with standardized deployments; get **portability** for data processing.
## Containers versus virtual machines
VMs run directly on a **hypervisor**; containers run on any Linux OS with the right kernel features and the **Docker daemon** — so a laptop, a VM, an EC2 instance or a bare metal server can all host them.
- **VM-based**: three apps on three EC2 instances, each with its own guest OS on the AWS hypervisor.
- **Container-based**: one EC2 instance with the **Docker engine** on its Linux guest OS runs three containers; their processes talk directly to the guest OS kernel. A large instance can run **hundreds** of containers.
@diagram cc-vm-vs-container
## Amazon ECS
**Amazon ECS** is a highly scalable, high-performance container management service for Docker that runs applications on a **managed cluster of EC2 instances**. It orchestrates containers, maintains and scales the fleet of nodes and removes the complexity of standing up infrastructure.
- Launches up to **tens of thousands** of containers in seconds, monitors deployments, manages cluster state, schedules with a built-in or third-party scheduler (Apache Mesos, Blox); can use Spot and Reserved Instances.
- Integrates with **Elastic Load Balancing, EC2 security groups, EBS volumes and IAM roles**.
- **Task definition** — a text file, the blueprint of the app: **up to 10 containers**, their ports and data volumes. A **task** is an instantiation of a task definition in a cluster, placed by the **ECS task scheduler**.
| Key question: manage the cluster yourself? | ECS backed by Amazon EC2 | ECS backed by AWS Fargate |
|---|---|---|
| Who manages the instances | you (On-Demand or Spot Instances) | AWS |
| Trade-off | more granular control over infrastructure | easier to maintain, focus on applications |
| What you do | specify EC2 details as for a stand-alone instance | package the app, set CPU and memory, networking and IAM, launch |
## Kubernetes
**Kubernetes** is open source software for **container orchestration**, built on Google's experience. It deploys and manages containerized applications at scale with **the same toolset on premises and in the cloud**.
- **Complements Docker**: Docker runs multiple containers on a single OS host; Kubernetes orchestrates **multiple Docker hosts (nodes)**.
- Automates **container provisioning, networking, load distribution and scaling**.
- A **Deployment** tells Kubernetes how to create and update app instances; the **control plane** schedules them onto nodes; the **Deployment controller** watches them and, if a node fails, replaces the instance on another node — **self-healing**.
- **Pod** — one or more tightly coupled containers with shared resources: **volumes** (storage), a unique **cluster IP address** and how to run each container (image version, ports). Each pod gets an IP address and a DNS name; its containers are co-located and co-scheduled on one node.
- **Node** — a worker machine (virtual or physical) managed by the control plane; it can hold many pods and runs at least the **kubelet** (talks to the control plane, manages pods) and a **container runtime** such as Docker (pulls the image, unpacks it, runs the app).
@diagram cc-kubernetes
## Amazon EKS
- Managed Kubernetes on AWS — no need to install and operate your own **control plane**; unhealthy control plane nodes are detected and replaced automatically.
- **Certified Kubernetes conformant** (easy migration of upstream apps), supports **Linux and Windows containers** and community tools and add-ons; uses Application Load Balancers, IAM and VPC.
- Why both ECS and EKS? Both orchestrate Docker containers — AWS offers both to give customers **flexible options**.
## Benefits of containers
Very little footprint; deployed within milliseconds; run on any computer, infrastructure or cloud; scale up or down with ease; a rich ecosystem; problem containers are easy to isolate; **less memory and CPU than VMs** for similar workloads; higher productivity with reduced overhead.
> A container packs the app with its dependencies and shares the host kernel; Docker runs containers on one host, while Kubernetes, ECS and EKS orchestrate them across many.
?? A developer says 'it works on my laptop', but the app fails in production. How do containers help?
?= The app, its configuration and dependencies travel together in one image, so it runs the same on the laptop, in test and in production.
?? In Kubernetes, what is the difference between a pod and a node?
?= A pod is a group of one or more containers with a shared IP and volumes; a node is the worker machine that runs pods.`,
        ru: `## Вычислительные сервисы Azure
Azure поддерживает вычисления для разработки и тестирования, запуска приложений и расширения вашего дата-центра — с Linux, Windows Server, SQL Server, Oracle, IBM и SAP. Основные сервисы: **Azure Virtual Machines**, **Azure App Service**, **Azure Container Instances**, **Azure Kubernetes Service (AKS)**, **Azure Functions** (serverless) и **Azure Virtual Desktop**.
Когда использовать VM в Azure:
- **тестирование и разработка** — быстро создавать разные конфигурации ОС и приложений и удалять VM, когда они больше не нужны;
- **запуск приложений в облаке** — справляться с колебаниями нагрузки: выключать VM или быстро запускать новые и платить только за использованное;
- **расширение дата-центра** — создать виртуальную сеть в Azure и добавить в неё VM, например запустить SharePoint на VM в Azure;
- **disaster recovery (аварийное восстановление)** — если основной дата-центр отказал, поднять VM в Azure для критичных приложений и выключить их, когда он вернётся.
**Azure Virtual Desktop** — виртуализация рабочих столов и приложений в облаке: Windows из облака в любом месте, на Windows, Mac, iOS, Android, Linux или в современном браузере.
## Вычислительные сервисы Google Cloud
- **Compute Engine** — масштабируемые высокопроизводительные VM и группы инстансов в дата-центрах Google.
- **App Engine** — создание и развёртывание приложений на полностью управляемой, хорошо масштабируемой (serverless) платформе без управления инфраструктурой.
- **Bare Metal Solution** — оборудование для особых нагрузок с низкой задержкой.
- **Cloud GPUs** — GPU для машинного обучения, научных расчётов и 3D-визуализации.
- **Confidential VM** — VM в Compute Engine с усиленной защитой для нагрузок с большим объёмом памяти, на основе **AMD Secure Encrypted Virtualization (SEV)**.
- **Preemptible VMs** (пакетные и отказоустойчивые задачи), **Shielded VMs** (усиленные VM), **Sole-Tenant Nodes** (выделенное железо для требований регуляторов и лицензий), **VMware Engine** (управляемый VMware Cloud Foundation).
- **Cloud Run** — полностью управляемая среда для контейнерных приложений; **GKE (Google Kubernetes Engine)** — развёртывание и масштабирование контейнерных приложений на Kubernetes.
| Задача | AWS | Azure | GCP |
|---|---|---|---|
| Виртуальные машины (IaaS) | EC2 | Virtual Machines | Compute Engine |
| Платформа приложений (PaaS) | Elastic Beanstalk | App Service | App Engine |
| Serverless-функции | Lambda | Functions | Cloud Functions (нет на слайдах) |
| Контейнеры без управления серверами | Fargate | Container Instances | Cloud Run |
| Управляемый Kubernetes | EKS | AKS | GKE |
## Tensor Processing Unit (TPU)
**TPU** — **ASIC-ускоритель для ИИ** (application-specific integrated circuit, специализированная микросхема), созданный Google для машинного обучения нейросетей, особенно на её **TensorFlow**. Внутри Google TPU используют с **2015** года, сторонним компаниям их открыли в **2018** — через **Cloud TPU** и сервисы-блокноты **Kaggle** и **Colaboratory**. **TPU v4** (Google I/O, май 2021): производительность более чем в **2 раза** выше v3; в одном pod v4 — **4096 чипов**.
| Процессор | Хорошо подходит для |
|---|---|
| TPU | CNN (свёрточные нейросети) |
| GPU | некоторых полносвязных нейросетей |
| CPU | RNN (рекуррентные нейросети) |
![Плата Cloud TPU v4 в стойке дата-центра Google: зелёная печатная плата с четырьмя крупными металлическими радиаторами над чипами TPU и толстыми кабелями межсоединений](/events/cc/l3-cloud-tpu-board.webp)
## Контейнеры
**Контейнер** — способ **виртуализации на уровне операционной системы (operating system virtualization)**: приложение и его зависимости работают в **изолированных по ресурсам процессах (resource-isolated processes)**. Код, конфигурация и зависимости упакованы в один объект — это даёт **единообразие среды, операционную эффективность, продуктивность разработчиков и контроль версий**.
- В контейнере **нет целой ОС** — контейнеры делят виртуализированную ОС и несут только нужное программе: код, среду выполнения (runtime), библиотеки, системные утилиты.
- Образы обычно **на порядок меньше** VM, а контейнер стартует за **сотни миллисекунд**.
- **Повторяемость и самодостаточность**: программа работает одинаково на ноутбуке разработчика, в тесте и в продакшене.
## Docker
**Docker** — программная платформа, которая упаковывает ПО в контейнеры и позволяет быстро собирать, тестировать и развёртывать приложения. Его ставят на каждый сервер, где работают контейнеры; простые команды собирают, запускают и останавливают их. Контейнеры создаются из шаблона — **образа (image)**.
Docker нужен, чтобы: **стандартизировать среды**; **снизить конфликты между языковыми стеками и версиями**; использовать контейнеры как сервис; запускать **микросервисы** со стандартным развёртыванием; получить **переносимость (portability)** для обработки данных.
## Контейнеры против виртуальных машин
VM работают прямо на **hypervisor**; контейнеры — на любой Linux с нужными возможностями ядра и **Docker daemon**, поэтому их может запускать ноутбук, VM, EC2-инстанс или физический сервер (bare metal).
- **На VM**: три приложения на трёх EC2-инстансах, у каждого своя гостевая ОС на hypervisor AWS.
- **На контейнерах**: один EC2-инстанс с **Docker engine** на гостевой Linux запускает три контейнера; их процессы обращаются прямо к ядру гостевой ОС. Крупный инстанс может держать **сотни** контейнеров.
@diagram cc-vm-vs-container
## Amazon ECS
**Amazon ECS** — хорошо масштабируемый высокопроизводительный сервис управления Docker-контейнерами, который запускает приложения на **управляемом кластере EC2-инстансов**. Он оркестрирует контейнеры, поддерживает и масштабирует парк узлов и избавляет от сложности развёртывания инфраструктуры.
- Запускает до **десятков тысяч** контейнеров за секунды, следит за развёртыванием, управляет состоянием кластера, планирует размещение встроенным или сторонним планировщиком (Apache Mesos, Blox); умеет работать со Spot и Reserved Instances.
- Интегрирован с **Elastic Load Balancing, security groups EC2, томами EBS и ролями IAM**.
- **Task definition** — текстовый файл, чертёж приложения: **до 10 контейнеров**, их порты и тома данных. **Task** — экземпляр task definition в кластере; размещает его **планировщик задач ECS (task scheduler)**.
| Главный вопрос: управлять кластером самому? | ECS на Amazon EC2 | ECS на AWS Fargate |
|---|---|---|
| Кто управляет инстансами | вы (On-Demand или Spot Instances) | AWS |
| Компромисс | больше контроля над инфраструктурой | проще обслуживать, фокус на приложениях |
| Что делаете вы | задаёте параметры EC2, как для отдельного инстанса | упаковываете приложение, задаёте CPU и память, сеть и IAM, запускаете |
## Kubernetes
**Kubernetes** — open source ПО для **оркестрации контейнеров (container orchestration)**, построенное на опыте Google. Он развёртывает контейнерные приложения и управляет ими в больших масштабах **одним набором инструментов и on-premises, и в облаке**.
- **Дополняет Docker**: Docker запускает несколько контейнеров на одном хосте; Kubernetes оркестрирует **много Docker-хостов (nodes)**.
- Автоматизирует **создание контейнеров, сеть, распределение нагрузки и масштабирование**.
- **Deployment** говорит Kubernetes, как создавать и обновлять экземпляры приложения; **control plane** размещает их по узлам; **Deployment controller** следит за ними и, если узел упал, заменяет экземпляр на другом узле — **самовосстановление (self-healing)**.
- **Pod** — один или несколько тесно связанных контейнеров с общими ресурсами: **тома (volumes)**, уникальный **IP-адрес в кластере** и сведения о запуске каждого контейнера (версия образа, порты). У каждого пода свой IP-адрес и DNS-имя; его контейнеры размещаются и планируются вместе на одном узле.
- **Node** — рабочая машина (виртуальная или физическая) под управлением control plane; на ней может быть много подов, и на ней работают как минимум **kubelet** (общается с control plane, управляет подами) и **container runtime**, например Docker (скачивает образ, распаковывает и запускает приложение).
@diagram cc-kubernetes
## Amazon EKS
- Управляемый Kubernetes в AWS — не нужно ставить и обслуживать свой **control plane**; неисправные узлы control plane обнаруживаются и заменяются автоматически.
- **Certified Kubernetes conformant** (лёгкая миграция приложений из обычного Kubernetes), поддерживает **Linux- и Windows-контейнеры**, инструменты и дополнения сообщества; использует Application Load Balancer, IAM и VPC.
- Зачем и ECS, и EKS? Оба оркестрируют Docker-контейнеры — AWS даёт оба, чтобы у клиентов были **гибкие варианты (flexible options)**.
## Преимущества контейнеров
Очень маленький размер; развёртывание за миллисекунды; работают на любом компьютере, инфраструктуре или облаке; легко масштабируются вверх и вниз; богатая экосистема; проблемный контейнер легко изолировать; **меньше памяти и CPU, чем у VM** с похожей нагрузкой; выше продуктивность при меньших накладных расходах.
> Контейнер упаковывает приложение с зависимостями и делит ядро хоста; Docker запускает контейнеры на одном хосте, а Kubernetes, ECS и EKS оркестрируют их на многих.
?? Разработчик говорит «на моём ноутбуке работает», а в продакшене приложение падает. Как помогают контейнеры?
?= Приложение, его конфигурация и зависимости едут вместе в одном образе, поэтому оно работает одинаково на ноутбуке, в тесте и в продакшене.
?? Чем в Kubernetes pod отличается от node?
?= Pod — группа из одного или нескольких контейнеров с общим IP и томами; node — рабочая машина, на которой работают поды.`,
      },
      [
        qx("An organization runs critical apps on Azure VMs only while its primary datacenter is down. Which VM use case is this?", "Disaster recovery", [
          ["Testing and development", "Test and dev means quickly creating and deleting configurations for testing.", "Test and dev — это быстрое создание и удаление конфигураций для тестирования."],
          ["Extending the datacenter", "Extending means adding Azure VMs to your network permanently, e.g. for SharePoint.", "Расширение — это постоянное добавление VM в Azure к своей сети, например для SharePoint."],
          ["Running apps in the cloud", "That case is about fluctuating demand, not about a failed primary site.", "Этот случай — про колебания нагрузки, а не про отказ основного дата-центра."],
        ], "IaaS-based disaster recovery: start VMs on Azure when the primary datacenter fails, shut them down when it is back.", "Disaster recovery на основе IaaS: запустить VM в Azure при отказе основного дата-центра и выключить их, когда он вернётся."),
        qx("Which Azure service gives users a cloud-hosted version of Windows from any location and device?", "Azure Virtual Desktop", [
          ["Azure App Service", "App Service hosts web apps, not desktops.", "App Service размещает веб-приложения, а не рабочие столы."],
          ["Azure Container Instances", "Container Instances runs containers, not user desktops.", "Container Instances запускает контейнеры, а не рабочие столы."],
          ["Azure Functions", "Functions is serverless code triggered by events.", "Functions — бессерверный код, запускаемый событиями."],
        ], "Azure Virtual Desktop is desktop and application virtualization that works on Windows, Mac, iOS, Android, Linux and browsers.", "Azure Virtual Desktop — виртуализация рабочих столов и приложений; работает на Windows, Mac, iOS, Android, Linux и в браузере."),
        qx("Which Azure service is the serverless computing option?", "Azure Functions", [
          ["Azure Virtual Machines", "Virtual Machines is IaaS: you manage the VMs.", "Virtual Machines — это IaaS: VM обслуживаете вы."],
          ["Azure Kubernetes Service", "AKS is managed Kubernetes for container orchestration.", "AKS — управляемый Kubernetes для оркестрации контейнеров."],
          ["Azure Virtual Desktop", "Virtual Desktop delivers cloud-hosted Windows desktops.", "Virtual Desktop даёт рабочие столы Windows из облака."],
        ], "Azure Functions is the serverless service, the counterpart of AWS Lambda.", "Azure Functions — бессерверный сервис, аналог AWS Lambda."),
        qx("Which Google Cloud service deploys scalable, high-performance VM instances and instance groups?", "Compute Engine", [
          ["App Engine", "App Engine is a fully managed app platform with no VMs to manage.", "App Engine — полностью управляемая платформа приложений, VM там не обслуживают."],
          ["Cloud Run", "Cloud Run is a managed environment for containerized apps.", "Cloud Run — управляемая среда для контейнерных приложений."],
          ["Bare Metal Solution", "Bare Metal provides physical hardware for specialized workloads, not VMs.", "Bare Metal даёт физическое оборудование для особых нагрузок, а не VM."],
        ], "Compute Engine is GCP's IaaS: virtual machines running in Google's data centers.", "Compute Engine — IaaS в GCP: виртуальные машины в дата-центрах Google."),
        qx("A team wants to deploy apps on Google Cloud without managing any underlying infrastructure. Which service fits?", "Google App Engine", [
          ["Google Compute Engine", "Compute Engine gives VMs that you manage yourself.", "Compute Engine даёт VM, которыми управляете вы."],
          ["Shielded VMs", "Shielded VMs are reinforced virtual machines that you still manage.", "Shielded VMs — усиленные виртуальные машины, которыми вы всё равно управляете."],
          ["Preemptible VMs", "Preemptible VMs are cheap VMs for batch and fault-tolerant jobs.", "Preemptible VMs — дешёвые VM для пакетных и отказоустойчивых задач."],
        ], "App Engine is a fully managed, highly scalable platform for building and deploying apps.", "App Engine — полностью управляемая, хорошо масштабируемая платформа для создания и развёртывания приложений."),
        qx("Which Google Cloud option uses AMD Secure Encrypted Virtualization (SEV) for high-memory workloads?", "Confidential VM", [
          ["Shielded VMs", "Shielded VMs are reinforced VMs, but SEV is the feature of Confidential VM.", "Shielded VMs — усиленные VM, но SEV — особенность именно Confidential VM."],
          ["Preemptible VMs", "Preemptible VMs are low-cost instances for batch, fault-tolerant jobs.", "Preemptible VMs — дешёвые инстансы для пакетных и отказоустойчивых задач."],
          ["Sole-Tenant Nodes", "Sole-Tenant Nodes give dedicated hardware, not memory encryption.", "Sole-Tenant Nodes дают выделенное железо, а не шифрование памяти."],
        ], "Confidential VM is a Compute Engine VM with enhanced performance and security using AMD SEV.", "Confidential VM — VM в Compute Engine с повышенной производительностью и защитой на основе AMD SEV."),
        qx("What is a Tensor Processing Unit (TPU)?", "Google's ASIC built to accelerate neural networks", [
          ["A graphics card Google sells for 3D gaming", "A TPU is an AI accelerator, not a gaming graphics card.", "TPU — ускоритель ИИ, а не игровая видеокарта."],
          ["A CPU core type used inside every Compute Engine VM", "A TPU is a separate accelerator chip, not a general-purpose CPU core.", "TPU — отдельный чип-ускоритель, а не ядро процессора общего назначения."],
          ["A container runtime for TensorFlow jobs", "A TPU is hardware; container runtimes are software like Docker.", "TPU — это железо; среда выполнения контейнеров — ПО вроде Docker."],
        ], "A TPU is an AI accelerator application-specific integrated circuit made by Google for neural network machine learning, especially TensorFlow.", "TPU — специализированная микросхема (ASIC)-ускоритель от Google для машинного обучения нейросетей, особенно на TensorFlow."),
        qx("According to the lecture, which processor type is well suited for CNNs?", "TPU", [
          ["CPU", "The lecture says CPUs can have advantages for RNNs.", "По лекции у CPU есть преимущества для RNN."],
          ["GPU", "GPUs are noted for some fully-connected neural networks.", "GPU отмечены для некоторых полносвязных нейросетей."],
          ["FPGA", "FPGAs are not matched to CNNs in the lecture; TPUs are.", "FPGA в лекции с CNN не связывают — связывают TPU."],
        ], "TPUs suit CNNs, GPUs some fully-connected networks, and CPUs can have advantages for RNNs.", "TPU подходят для CNN, GPU — для некоторых полносвязных сетей, а у CPU есть преимущества для RNN."),
        qx("How does a container differ from a virtual machine?", "It shares the host OS kernel, with no guest OS", [
          ["It runs directly on a hypervisor like a VM", "VMs run on a hypervisor; containers run on a host OS with a container engine.", "На hypervisor работают VM; контейнеры — на ОС хоста с движком контейнеров."],
          ["It always carries a complete operating system", "Containers do not contain an entire OS — that is what makes them small.", "В контейнере нет целой ОС — поэтому он и маленький."],
          ["It needs its own physical server for each app", "Hundreds of containers can share one large instance.", "Сотни контейнеров могут работать на одном крупном инстансе."],
        ], "Containers share a virtualized OS and run as resource-isolated processes, so they are smaller and start faster than VMs.", "Контейнеры делят виртуализированную ОС и работают как изолированные процессы, поэтому они меньше и стартуют быстрее VM."),
        qx("How quickly does a container typically start, according to the lecture?", "In hundreds of milliseconds", [
          ["In a few minutes, like a VM", "Minutes is the time to launch an EC2 instance; containers are much faster.", "Минуты — это время запуска EC2-инстанса; контейнеры гораздо быстрее."],
          ["In about half an hour", "Containers spin up far faster than that.", "Контейнеры стартуют несравнимо быстрее."],
          ["Only after the host reboots", "Starting a container does not require rebooting the host.", "Для запуска контейнера перезагружать хост не нужно."],
        ], "Container images are an order of magnitude smaller than VMs, and a container spins up in hundreds of milliseconds.", "Образы контейнеров на порядок меньше VM, и контейнер стартует за сотни миллисекунд."),
        qx("Docker containers are created from a template. What is that template called?", "An image", [
          ["A pod", "A pod is a Kubernetes group of running containers.", "Pod — группа работающих контейнеров в Kubernetes."],
          ["A task", "A task is a running instance of an ECS task definition.", "Task — запущенный экземпляр task definition в ECS."],
          ["A cluster", "A cluster is a group of machines, not a template.", "Кластер — группа машин, а не шаблон."],
        ], "Containers are created from a template called an image; one image can start many identical containers.", "Контейнеры создаются из шаблона — образа (image); из одного образа можно запустить много одинаковых контейнеров."),
        qx("Which is a reason the lecture gives for using Docker?", "Reduce conflicts between language stacks", [
          ["Give each app its own full guest operating system", "That describes virtual machines; containers share the OS.", "Это описание VM; контейнеры делят общую ОС."],
          ["Get stronger isolation than VMs provide", "The lecture does not claim stronger isolation; its reasons are standardization and portability.", "Лекция не обещает изоляцию сильнее VM; её доводы — стандартизация и переносимость."],
          ["Avoid installing anything on the host", "Docker itself must be installed on each server that hosts containers.", "Сам Docker нужно установить на каждый сервер, где работают контейнеры."],
        ], "Docker standardizes environments, reduces conflicts between language stacks and versions, and supports microservices and portability.", "Docker стандартизирует среды, снижает конфликты между языковыми стеками и версиями, помогает с микросервисами и переносимостью."),
        qx("In Amazon ECS, what is a task definition?", "A text file describing up to 10 containers", [
          ["A running copy of containers in a cluster", "A running instantiation is a task, not the task definition.", "Запущенный экземпляр — это task, а не task definition."],
          ["A group of EC2 instances running containers", "A group of instances is the ECS cluster.", "Группа инстансов — это ECS-кластер."],
          ["A scheduler that places tasks on instances", "Placement is done by the ECS task scheduler.", "Размещением занимается планировщик задач ECS."],
        ], "A task definition is the blueprint of the app: which containers (up to ten), which ports and which data volumes.", "Task definition — чертёж приложения: какие контейнеры (до десяти), какие порты и какие тома данных."),
        qx("A team wants to run containers on ECS without provisioning, configuring or scaling the cluster. Which option?", "A cluster backed by AWS Fargate", [
          ["A cluster of EC2 Linux instances", "With the EC2 launch type you manage the instances yourself.", "При EC2 launch type инстансы обслуживаете вы сами."],
          ["A cluster of EC2 Windows instances", "The Windows EC2 option still leaves the instances to you.", "Вариант с Windows EC2 тоже оставляет инстансы вам."],
          ["A cluster of EC2 Spot Instances", "Spot is a purchasing option for EC2 instances that you still manage.", "Spot — способ покупки EC2-инстансов, которыми вы всё равно управляете."],
        ], "With the networking-only Fargate launch type, AWS manages the cluster; you only package the app and set CPU, memory, networking and IAM.", "При варианте Networking only с Fargate кластером управляет AWS; вы только упаковываете приложение и задаёте CPU, память, сеть и IAM."),
        qx("What does Kubernetes add on top of Docker?", "Orchestration of containers on many hosts", [
          ["A file format for container images", "Images are built with Docker; Kubernetes runs and orchestrates them.", "Образы собирают Docker'ом; Kubernetes их запускает и оркестрирует."],
          ["A hypervisor for guest operating systems", "Kubernetes is not a hypervisor; it manages containers, not VMs.", "Kubernetes — не hypervisor; он управляет контейнерами, а не VM."],
          ["A registry that stores Docker images", "Storing images is the job of a registry such as Amazon ECR.", "Хранение образов — работа реестра, например Amazon ECR."],
        ], "Docker runs multiple containers on one OS host; Kubernetes orchestrates multiple Docker hosts (nodes).", "Docker запускает несколько контейнеров на одном хосте; Kubernetes оркестрирует много хостов (nodes)."),
        qx("What is a Kubernetes pod?", "One or more containers sharing storage and an IP", [
          ["A worker machine, virtual or physical, in the cluster", "A worker machine is a node.", "Рабочая машина — это node."],
          ["The agent that talks to the control plane", "That agent is the kubelet.", "Этот агент — kubelet."],
          ["A blueprint for updating app instances", "That describes a Deployment.", "Так описывается Deployment."],
        ], "A pod groups one or more containers with shared volumes, a unique cluster IP and run settings; its containers are co-located.", "Pod объединяет один или несколько контейнеров с общими томами, уникальным IP в кластере и настройками запуска; они размещаются вместе."),
        qx("Which process on every Kubernetes node talks to the control plane and manages the pods there?", "kubelet", [
          ["container runtime", "The container runtime pulls images and runs containers, but does not talk to the control plane.", "Container runtime скачивает образы и запускает контейнеры, но с control plane не общается."],
          ["Deployment controller", "The Deployment controller is part of the control plane, not a node process.", "Deployment controller — часть control plane, а не процесс на узле."],
          ["task scheduler", "The task scheduler belongs to Amazon ECS, not to Kubernetes nodes.", "Task scheduler относится к Amazon ECS, а не к узлам Kubernetes."],
        ], "Every node runs at least the kubelet and a container runtime such as Docker.", "На каждом узле работают как минимум kubelet и container runtime, например Docker."),
        qx("A node that hosts an app instance fails. What does the Kubernetes Deployment controller do?", "Replaces the instance on another node", [
          ["Waits until the node is repaired", "Kubernetes does not wait; it self-heals by rescheduling.", "Kubernetes не ждёт — он восстанавливается сам, перенося экземпляр."],
          ["Deletes the whole Deployment", "The Deployment stays; only the lost instance is recreated.", "Deployment остаётся; заново создаётся только потерянный экземпляр."],
          ["Moves the failed node into a new cluster", "Nodes are not moved; the instance is recreated on a healthy node.", "Узлы никуда не переносят; экземпляр создают заново на исправном узле."],
        ], "The controller continuously monitors instances and replaces failed ones on another node — a self-healing mechanism.", "Контроллер постоянно следит за экземплярами и заменяет упавшие на другом узле — механизм самовосстановления."),
        qx("Why does AWS offer both Amazon ECS and Amazon EKS?", "To give customers flexible options", [
          ["ECS runs only Windows and EKS only Linux", "EKS supports both Linux and Windows containers.", "EKS поддерживает и Linux-, и Windows-контейнеры."],
          ["EKS cannot run Docker containers", "Both services can orchestrate Docker containers.", "Оба сервиса умеют оркестрировать Docker-контейнеры."],
          ["ECS is for VMs and EKS for containers", "Both are container services.", "Оба — контейнерные сервисы."],
        ], "Both orchestrate Docker containers; AWS offers both so customers can choose what best matches their needs.", "Оба оркестрируют Docker-контейнеры; AWS предлагает оба, чтобы клиент выбрал подходящий."),
        tfx("Amazon EKS is certified Kubernetes conformant, so applications that run on upstream Kubernetes are compatible with it.", true, "Conformance means easy migration: existing Kubernetes apps and community tools work on EKS.", "Сертифицированная совместимость означает лёгкую миграцию: существующие приложения и инструменты Kubernetes работают в EKS.", "Answering 'False' ignores that certified conformance is exactly what lets upstream apps move to EKS unchanged.", "Ответ «неверно» не учитывает, что именно сертификат совместимости позволяет переносить приложения в EKS без изменений."),
      ],
    ),
    part(
      "cc-l3-p3",
      { en: "Cloud storage basics, file and block storage", ru: "Основы облачного хранения, файловое и блочное хранилище" },
      {
        en: `## Basics of cloud storage
**Cloud storage** is where you save data and files in the cloud. Some storage must be **attached to a compute node** before it can be accessed; other types can be reached directly over the **public internet or a dedicated private connection**.
- Providers **host, secure, manage and maintain** the storage and its infrastructure, so your data is available when you need it.
- You scale capacity as you need and pay for what you provision, usually **per gigabyte**.
- The rule of thumb: **the faster the read/write speed, the higher the per gigabyte cost**.
## Four main types
Cloud storage comes in four main types: **Direct Attached, File Storage, Block Storage and Object Storage**. They differ in how they are accessed, capacity, cost, the data they suit and read/write speed.
| Type | How it is attached | Speed | Cost | Sharing | Typical use |
|---|---|---|---|---|---|
| Direct attached (local) | inside the server chassis or rack | fast | higher than file storage | not shared, ephemeral | the server's OS |
| File storage | Ethernet network (NFS) | slower, varies with load | low | many nodes at once | file shares, landing zones |
| Block storage | high-speed fibre (SAN), as volumes | fast and consistent | higher | one node at a time | databases, mail servers |
| Object storage | API over HTTP, no compute node | slowest | cheapest | anything that can call the API | static unstructured data, backups |
@diagram cc-storage-types
## Direct-attached storage
**Direct-attached (local) storage** is presented directly to a cloud-based server and sits **within the host server chassis or the same rack**. It is **fast** and is normally used for the server's **operating system**. Why not much else:
- **Ephemeral (temporary)** — it lasts only as long as the compute resource it is attached to;
- **Not shared** — it cannot be shared with other nodes;
- **Non-resilient** — RAID helps, but it is less resilient to failure than other storage types.
## File storage
File storage is typically presented to compute nodes as **NFS (Network File System)** storage: it is connected over a standard **Ethernet** network, so it is also called **Network Attached Storage**. It organizes data in the **hierarchical folder structure** desktop users know.
- **Disadvantage: slower** than direct-attached or block storage, because data travels over Ethernet.
- **Advantages: low cost**, and it can be **attached to multiple servers** at once.
- Like direct-attached storage, it must be **attached to a compute node**. Unlike it, file storage is **less expensive, more resilient to failure, needs less disk management and maintenance**, and much larger amounts can be provisioned.
- It is mounted from remote **storage appliances**: physical disks → storage appliance → compute node. The appliances are resilient to failure, offer **encryption in transit and at rest** and are **managed by the provider**.
- The Ethernet network is normally **dedicated to storage**, but its **speed varies with traffic**, so consistent speed cannot be guaranteed — use file storage where consistently high speed is not required.
- Common workloads (it mounts on many nodes): a **departmental file share**, a **'landing zone'** for incoming files, a **repository of files** for a web service; also **low-cost database storage**, trading away speed.
![A storage appliance rack with rows of hot-swap disk drives and green activity lights, connected to a row of servers by blue Ethernet cables](/events/cc/l3-nas-storage-appliance.webp)
## IOPS
**IOPS — Input/Output Operations Per Second**: the speed at which the **disks** can read and write data (not the speed of the network between storage and node).
- **Higher IOPS = faster underlying disk = higher cost.**
- IOPS too low → the storage becomes a **bottleneck** and the application runs slowly; IOPS too high → you pay more than you need.
- Example: a file share is mounted on **30 compute nodes**; an application writes and requests data **60 times per minute** — on average **1 operation per second**. Nodes differ (0, 1, 2 IOPS), and the share needs about **30 IOPS** on average. Every application has different IOPS requirements.
= 60 operations / 60 seconds = 1 IOPS per node; 30 nodes x 1 IOPS = 30 IOPS
## Block storage
**Block storage** breaks files into **chunks (blocks)** of data and stores each block separately under a **unique address**. It must be **attached to a compute node** before use and, like file storage, is mounted from remote storage appliances — extremely resilient, and the data is more secure (encryption in transit and at rest).
- It is presented through a **SAN (Storage Area Network)** — a dedicated network of **optical fibres** where signals move at the speed of light, so read/write is **faster and consistent**.
- It is provisioned as **volumes**; a volume is mounted onto a compute node, which sees it as **another hard drive**.
- A volume is normally mounted onto **only one compute node at a time** (file storage can serve 80 nodes or more).
- **Higher price-point**: fibre networks are more expensive to build than Ethernet ones.
- Perfect for **low-latency** workloads that need consistently fast disks: **databases and mail servers**. Not suitable for **shared storage** between servers.
- IOPS matters here too: providers let you **specify IOPS** when provisioning and, in some cases, **adjust** it later as requirements and usage change.
![A SAN switch in a data center rack with bright orange fibre optic cables plugged into rows of ports, linking servers to disk arrays](/events/cc/l3-san-fibre-switch.webp)
## Persistence and snapshots
- **Persistence** — what happens to file or block storage when the compute node it is attached to is **terminated**. Set to **persist**: the storage and data are kept and can be mounted onto another node, but **you keep paying**. Set to delete with the node: it becomes **ephemeral** — you stop paying, but the data is lost unless it is backed up.
- **Snapshot** — a **point-in-time image** of file or block storage: **fast to create** (it writes metadata), needs **no downtime**, and later snapshots record **only the changes**. It returns storage to its state at that moment but **cannot recover individual files**.
## File storage versus block storage
In common: both come from **appliances maintained by the provider**, both are **highly available and resilient**, and both often include **encryption at rest and in transit**.
| | File storage | Block storage |
|---|---|---|
| Attached via | Ethernet network (NFS, network attached) | high-speed fibre network (SAN) |
| Speed | reliable, but varies with load | consistent and fast |
| Compute nodes | many at once | one at a time |
| Price | lower | higher |
| Good for | file shares, no need for very fast access, cost matters | apps that need consistent fast disk access, e.g. databases |
Remember: consider the workload's **IOPS requirements** for both types.
> Need sharing and low cost — file storage; need consistent speed for one server's database — block storage; size the IOPS for both.
?? An e-mail server needs fast, consistent disk access, and only one server uses the disk. Which storage type fits?
?= Block storage — a SAN volume over fibre with consistent low latency, mounted on one node.
?? Thirty web servers must read the same set of incoming files. Which storage type fits, and why not block?
?= File storage: it can be mounted on many nodes at once. A block volume is normally attached to only one node at a time.`,
        ru: `## Основы облачного хранения
**Облачное хранилище (cloud storage)** — место, где вы храните данные и файлы в облаке. Одни виды хранилища нужно **подключить к вычислительному узлу (compute node)**, прежде чем к ним обращаться; к другим можно обращаться напрямую через **публичный интернет или выделенное частное подключение**.
- Провайдеры **размещают, защищают, обслуживают и поддерживают** хранилище и его инфраструктуру, чтобы данные были доступны, когда нужны.
- Ёмкость наращиваете по мере надобности и платите за выделенное, обычно **за гигабайт**.
- Общее правило: **чем выше скорость чтения/записи, тем выше цена за гигабайт**.
## Четыре основных типа
Облачное хранилище бывает четырёх основных типов: **Direct Attached, File Storage, Block Storage и Object Storage**. Они различаются способом доступа, ёмкостью, ценой, подходящими данными и скоростью чтения/записи.
| Тип | Как подключено | Скорость | Цена | Совместный доступ | Типичное применение |
|---|---|---|---|---|---|
| Direct attached (локальное) | внутри корпуса сервера или стойки | быстрое | дороже file storage | не делится, ephemeral | ОС сервера |
| File storage | сеть Ethernet (NFS) | медленнее, зависит от нагрузки | низкая | много узлов сразу | общие папки, landing zone |
| Block storage | быстрое оптоволокно (SAN), тома | быстрое и стабильное | выше | один узел за раз | базы данных, почтовые серверы |
| Object storage | API по HTTP, без узла | самое медленное | самая низкая | всё, что умеет вызвать API | статичные неструктурированные данные, бэкапы |
@diagram cc-storage-types
## Direct-attached storage
**Direct-attached (локальное) хранилище** подключено прямо к облачному серверу и находится **в корпусе самого сервера или в той же стойке**. Оно **быстрое** и обычно хранит **операционную систему** сервера. Почему почти ни для чего другого:
- **Ephemeral (временное)** — живёт только столько, сколько вычислительный ресурс, к которому подключено;
- **Не делится** — его нельзя разделить с другими узлами;
- **Неустойчивое (non-resilient)** — RAID помогает, но к сбоям оно менее устойчиво, чем другие типы.
## File storage
File storage обычно предоставляется узлам как хранилище **NFS (Network File System)**: оно подключено по обычной сети **Ethernet**, поэтому его ещё называют **Network Attached Storage**. Данные лежат в привычной пользователям **иерархии папок**.
- **Недостаток: медленнее**, чем direct-attached или block storage, потому что данные идут по Ethernet.
- **Преимущества: низкая цена**, и его можно **подключить к нескольким серверам** сразу.
- Как и direct-attached, его нужно **подключить к вычислительному узлу**. В отличие от него, file storage **дешевле, устойчивее к сбоям, требует меньше обслуживания дисков**, и выделить можно гораздо больший объём.
- Оно монтируется с удалённых **устройств хранения (storage appliances)**: физические диски → storage appliance → вычислительный узел. Устройства устойчивы к сбоям, дают **шифрование при передаче и при хранении (in transit и at rest)** и **обслуживаются провайдером**.
- Сеть Ethernet обычно **выделена под хранилище**, но её **скорость меняется с трафиком**, и стабильную скорость гарантировать нельзя — используйте file storage там, где стабильно высокая скорость не нужна.
- Типичные нагрузки (подключается ко многим узлам): **общая папка отдела**, **«landing zone»** для входящих файлов, **хранилище файлов** для веб-сервиса; а также **дешёвое хранилище для базы данных** ценой скорости.
![Стойка устройства хранения с рядами дисков горячей замены и зелёными индикаторами активности, соединённая синими кабелями Ethernet с рядом серверов](/events/cc/l3-nas-storage-appliance.webp)
## IOPS
**IOPS — Input/Output Operations Per Second**: скорость, с которой **диски** читают и записывают данные (это не скорость сети между хранилищем и узлом).
- **Выше IOPS = быстрее диск = выше цена.**
- IOPS слишком низкий → хранилище становится **узким местом (bottleneck)**, и приложение тормозит; IOPS слишком высокий → вы переплачиваете.
- Пример: общая папка подключена к **30 узлам**; приложение пишет и запрашивает данные **60 раз в минуту** — в среднем **1 операция в секунду**. Узлы различаются (0, 1, 2 IOPS), а хранилищу нужно в среднем около **30 IOPS**. У каждого приложения свои требования к IOPS.
= 60 operations / 60 seconds = 1 IOPS per node; 30 nodes x 1 IOPS = 30 IOPS
## Block storage
**Block storage** делит файлы на **части (blocks)** и хранит каждый блок отдельно под **уникальным адресом**. Его нужно **подключить к вычислительному узлу**, и, как file storage, оно монтируется с удалённых устройств хранения — крайне устойчиво к сбоям, а данные защищены лучше (шифрование in transit и at rest).
- Оно предоставляется через **SAN (Storage Area Network)** — выделенную сеть из **оптических волокон**, где сигнал идёт со скоростью света, поэтому чтение/запись **быстрее и стабильнее**.
- Его выделяют **томами (volumes)**; том монтируется к узлу, и тот видит его как **ещё один жёсткий диск**.
- Том обычно подключают **только к одному узлу за раз** (file storage может обслуживать 80 узлов и больше).
- **Цена выше**: оптоволоконные сети дороже строить, чем Ethernet.
- Идеально для нагрузок с **низкой задержкой (low-latency)**, которым нужны стабильно быстрые диски: **базы данных и почтовые серверы**. Не подходит для **общего хранилища** нескольких серверов.
- IOPS важен и здесь: провайдеры позволяют **задать IOPS** при создании и иногда **изменить** его позже, если меняются требования и характер нагрузки.
![Коммутатор SAN в стойке дата-центра: ярко-оранжевые оптоволоконные кабели в рядах портов соединяют серверы с дисковыми массивами](/events/cc/l3-san-fibre-switch.webp)
## Persistence и snapshots
- **Persistence (сохранность)** — что происходит с file или block storage, когда узел, к которому оно подключено, **удаляют (terminate)**. Настроено **persist**: хранилище и данные сохраняются, их можно подключить к другому узлу, но **платить вы продолжаете**. Настроено удаляться вместе с узлом: оно становится **ephemeral** — платить перестаёте, но данные теряются, если нет резервной копии.
- **Snapshot (снимок)** — **образ хранилища на момент времени** (file или block): **создаётся быстро** (пишутся метаданные), **не требует простоя**, а следующие снимки записывают **только изменения**. Он возвращает хранилище в состояние на тот момент, но **отдельные файлы восстановить не может**.
## File storage против block storage
Общее: оба берутся с **устройств, которые обслуживает провайдер**, оба **высокодоступны и устойчивы**, и оба часто **шифруют данные при хранении и передаче**.
| | File storage | Block storage |
|---|---|---|
| Подключение | сеть Ethernet (NFS, network attached) | быстрая оптоволоконная сеть (SAN) |
| Скорость | надёжная, но зависит от нагрузки | стабильная и высокая |
| Узлы | много сразу | один за раз |
| Цена | ниже | выше |
| Подходит для | общих папок, когда не нужен очень быстрый доступ, важна цена | приложений, которым нужен стабильно быстрый диск, например баз данных |
Помните: для обоих типов учитывайте **требования нагрузки к IOPS**.
> Нужен общий доступ и низкая цена — file storage; нужна стабильная скорость для базы данных одного сервера — block storage; IOPS подбирайте для обоих.
?? Почтовому серверу нужен быстрый и стабильный доступ к диску, и диском пользуется только один сервер. Какой тип хранилища подходит?
?= Block storage — том SAN по оптоволокну со стабильно низкой задержкой, подключённый к одному узлу.
?? Тридцать веб-серверов должны читать один и тот же набор входящих файлов. Какой тип подходит и почему не block?
?= File storage: его можно подключить ко многим узлам сразу. Блочный том обычно подключают только к одному узлу за раз.`,
      },
      [
        qx("Which storage type sits within the host server chassis or the same rack?", "Direct-attached storage", [
          ["File storage over NFS", "File storage is mounted over an Ethernet network from remote appliances.", "File storage подключается по сети Ethernet с удалённых устройств хранения."],
          ["Block storage on a SAN", "Block storage comes from remote appliances over a fibre SAN.", "Block storage приходит с удалённых устройств по оптоволоконной SAN."],
          ["Object storage in a bucket", "Object storage is reached through an API, with no attachment at all.", "К object storage обращаются через API, без всякого подключения."],
        ], "Direct-attached (local) storage is presented directly to the server, in its chassis or rack.", "Direct-attached (локальное) хранилище подключено прямо к серверу — в его корпусе или стойке."),
        qx("Why is direct-attached storage usually used only for the server's operating system?", "It is ephemeral, not shared and not resilient", [
          ["It is the slowest type of cloud storage", "Direct-attached storage is fast; object storage is the slowest.", "Direct-attached хранилище быстрое; самое медленное — object storage."],
          ["It can only be reached through an API", "API access describes object storage.", "Доступ через API — это object storage."],
          ["It must be mounted on many nodes at the same time", "It cannot be shared with other nodes at all.", "Его вообще нельзя разделить с другими узлами."],
        ], "Local storage lasts only as long as its compute node, cannot be shared and is less resilient than other types.", "Локальное хранилище живёт столько же, сколько его узел, не делится с другими и менее устойчиво к сбоям."),
        qx("What does 'ephemeral' storage mean?", "It lasts only as long as its compute node", [
          ["It is copied across three Availability Zones", "Replication across AZs is about durability, the opposite of ephemeral.", "Копирование по AZ — про надёжность, это противоположность ephemeral."],
          ["It is billed only when data is being read", "Ephemeral describes lifetime, not billing.", "Ephemeral — про срок жизни, а не про оплату."],
          ["It can be mounted on several nodes at once", "Sharing between nodes is a feature of file storage.", "Совместное использование узлами — свойство file storage."],
        ], "Ephemeral (temporary) storage disappears with the compute resource it is attached to.", "Ephemeral (временное) хранилище исчезает вместе с вычислительным ресурсом, к которому подключено."),
        qx("Which statement about cloud storage pricing is true?", "Faster read/write means higher cost per GB", [
          ["Every storage type costs the same per GB", "Cost varies by type: object storage is far cheaper than block.", "Цена зависит от типа: object storage намного дешевле block."],
          ["Faster storage is cheaper because it is newer", "The lecture states the opposite: speed costs more.", "Лекция говорит обратное: скорость стоит дороже."],
          ["Storage is billed as a fixed fee per server", "Storage is usually billed per gigabyte, not per server.", "Хранилище обычно оплачивают за гигабайт, а не за сервер."],
        ], "In general, the faster the read/write speed of storage, the higher the per gigabyte cost.", "В целом, чем выше скорость чтения/записи хранилища, тем выше цена за гигабайт."),
        qx("How is file storage typically presented to compute nodes?", "As NFS storage over an Ethernet network", [
          ["As block volumes over a fibre-channel SAN", "Fibre SAN volumes describe block storage.", "Тома по оптоволоконной SAN — это block storage."],
          ["As objects through an HTTP API", "HTTP API access describes object storage.", "Доступ через HTTP API — это object storage."],
          ["As disks inside the server chassis", "Disks in the chassis are direct-attached storage.", "Диски в корпусе сервера — это direct-attached storage."],
        ], "File storage is NFS (Network File System) storage connected over a standard Ethernet network.", "File storage — это NFS-хранилище (Network File System), подключённое по обычной сети Ethernet."),
        qx("A department needs one shared folder that twenty servers can mount at once. Which storage type fits best?", "File storage", [
          ["Block storage", "A block volume is normally mounted on only one node at a time.", "Блочный том обычно подключают только к одному узлу за раз."],
          ["Direct-attached storage", "Local storage cannot be shared with other nodes.", "Локальное хранилище нельзя разделить с другими узлами."],
          ["Object storage", "Object storage is used through an API and is not mounted as a shared folder.", "Object storage используют через API, его не подключают как общую папку."],
        ], "File storage can be mounted on many compute nodes at once — ideal for a departmental file share.", "File storage можно подключить ко многим узлам сразу — идеально для общей папки отдела."),
        qx("Why can the speed of file storage vary?", "Ethernet speed changes with network load", [
          ["Its disks spin down when they are idle", "The lecture blames the shared network, not idle disks.", "Лекция винит сеть, а не простаивающие диски."],
          ["Its data is kept offline on magnetic tape", "Offline storage describes cold vault object tiers.", "Хранение офлайн — это холодные уровни object storage."],
          ["It is limited to a single compute node", "File storage can serve many nodes; block is limited to one.", "File storage обслуживает много узлов; одним ограничен block."],
        ], "The more loaded an Ethernet network is, the more its speed or bandwidth is affected, so consistent speed is not guaranteed.", "Чем сильнее загружена сеть Ethernet, тем больше страдает её скорость, поэтому стабильная скорость не гарантирована."),
        qx("What does IOPS measure?", "Disk read/write operations per second", [
          ["The bandwidth of the network to the storage", "The lecture stresses that IOPS is not the network speed.", "Лекция подчёркивает: IOPS — это не скорость сети."],
          ["How many nodes can mount one volume", "Mount limits are separate from IOPS.", "Ограничения на подключение не связаны с IOPS."],
          ["The total capacity of the volume in GB", "Capacity is measured in gigabytes, not operations.", "Объём измеряют в гигабайтах, а не в операциях."],
        ], "IOPS (Input/Output Operations Per Second) is the speed at which the disks can read and write data.", "IOPS (Input/Output Operations Per Second) — скорость, с которой диски читают и записывают данные."),
        qx("An application runs slowly because the provisioned IOPS is too low. What is happening?", "The storage has become a bottleneck", [
          ["Data is moving to a cheaper tier", "Tier changes belong to object storage archiving rules.", "Смена уровня — это правила архивации object storage."],
          ["The volume is deleted with its node", "Deletion with the node is about persistence, not IOPS.", "Удаление вместе с узлом — вопрос persistence, а не IOPS."],
          ["You are paying more than you need", "Overpaying is the risk of IOPS set too high.", "Переплата — риск слишком высокого IOPS."],
        ], "If IOPS is too low for the application, the storage becomes a bottleneck and the app runs slowly.", "Если IOPS слишком низкий для приложения, хранилище становится узким местом, и приложение тормозит."),
        qx("A file share is mounted on 30 nodes; each node's app does 60 operations per minute. What average IOPS does the share need?", "30 IOPS", [
          ["60 IOPS", "60 is operations per minute for one node, not per second for the share.", "60 — это операции в минуту на одном узле, а не в секунду на всё хранилище."],
          ["1 IOPS", "1 IOPS is the load of a single node, not of all 30.", "1 IOPS — нагрузка одного узла, а не всех тридцати."],
          ["1,800 IOPS", "1,800 is operations per minute for all nodes; divide by 60 seconds.", "1 800 — операций в минуту на все узлы; нужно поделить на 60 секунд."],
        ], "60 operations per minute is 1 per second per node; 30 nodes give about 30 IOPS on average.", "60 операций в минуту — это 1 в секунду на узел; 30 узлов дают в среднем около 30 IOPS."),
        qx("How does block storage store data?", "Splits files into blocks with unique addresses", [
          ["Keeps whole files inside a nested folder hierarchy", "A folder hierarchy describes file storage.", "Иерархия папок — это file storage."],
          ["Saves objects plus metadata in flat buckets", "Flat buckets of objects describe object storage.", "Плоские бакеты с объектами — это object storage."],
          ["Writes complete files one after another onto tape", "Tape is the old backup medium, not block storage.", "Лента — старый носитель для резервных копий, а не block storage."],
        ], "Block storage breaks files into chunks (blocks) and stores each block separately under a unique address.", "Block storage делит файлы на части (blocks) и хранит каждую отдельно под уникальным адресом."),
        qx("How is block storage connected to compute nodes?", "A dedicated fibre network (SAN)", [
          ["A shared Ethernet network (NFS)", "Ethernet and NFS describe file storage.", "Ethernet и NFS — это file storage."],
          ["The public internet through an API", "API access over the internet is object storage.", "Доступ через API по интернету — это object storage."],
          ["A cable inside the server's own chassis", "Disks inside the chassis are direct-attached storage.", "Диски в корпусе сервера — это direct-attached storage."],
        ], "Block storage reaches nodes over a dedicated optical fibre network — a SAN — where signals move at the speed of light.", "Block storage подключается к узлам по выделенной оптоволоконной сети — SAN, где сигналы идут со скоростью света."),
        qx("A company runs a busy database that needs consistent, low-latency disk access. Which storage type fits?", "Block storage", [
          ["File storage", "File storage speed varies with network load.", "Скорость file storage зависит от нагрузки на сеть."],
          ["Object storage", "Object storage is the slowest and is not suitable for databases.", "Object storage самое медленное и для баз данных не подходит."],
          ["Archive object tier", "Archive tiers are for rarely read data and can be very slow.", "Архивные уровни — для редко читаемых данных и могут быть очень медленными."],
        ], "Block storage gives consistent high speed and low latency — perfect for databases and mail servers.", "Block storage даёт стабильно высокую скорость и низкую задержку — идеально для баз данных и почтовых серверов."),
        qx("How many compute nodes is a block storage volume normally mounted on at a time?", "Only one", [
          ["Exactly two", "Block storage is normally limited to a single node.", "Block storage обычно ограничено одним узлом."],
          ["80 or more", "80 or more nodes is the file storage example.", "80 и более узлов — это пример для file storage."],
          ["Any number", "Unlimited access through an API describes object storage.", "Неограниченный доступ через API — это object storage."],
        ], "A block volume is normally mounted onto only one compute node at a time, so it is not for shared storage.", "Блочный том обычно подключают только к одному узлу за раз, поэтому для общего хранилища он не подходит."),
        qx("Storage is set to persist, and its compute node is terminated. What happens to it?", "It is kept, and you keep paying for it", [
          ["It is deleted along with all of its data", "Deletion with the node happens when storage is ephemeral, not persistent.", "Удаление вместе с узлом происходит у ephemeral-хранилища, а не у persistent."],
          ["It is converted into object storage", "Storage does not change type when a node is terminated.", "Тип хранилища при удалении узла не меняется."],
          ["It is kept free of charge for 30 days", "Persistent storage keeps costing money; there is no free period.", "Persistent-хранилище продолжает стоить денег; бесплатного периода нет."],
        ], "Persistent storage survives the node with its data and can be mounted on another node, but you continue to pay for it.", "Persistent-хранилище переживает узел вместе с данными, его можно подключить к другому узлу, но платить за него продолжаете."),
        qx("Which statement about storage snapshots is true?", "Later snapshots record only the changes", [
          ["Taking a snapshot requires downtime", "Snapshots do not require downtime.", "Снимки не требуют простоя."],
          ["A snapshot can restore one individual file", "Snapshots cannot be used to recover individual files.", "Снимок нельзя использовать для восстановления отдельных файлов."],
          ["Each snapshot copies every byte again", "Snapshots are fast because they mostly write metadata and changes.", "Снимки быстрые, потому что пишут в основном метаданные и изменения."],
        ], "A snapshot is a point-in-time image: fast, no downtime, later ones record only changes, but no single-file recovery.", "Снимок (snapshot) — образ на момент времени: быстро, без простоя, следующие пишут только изменения, но отдельный файл не восстановить."),
        qx("Which attribute do file storage and block storage have in common?", "Encryption at rest and in transit", [
          ["Mounting on many nodes at once", "Only file storage mounts on many nodes; block mounts on one.", "На много узлов подключается только file storage; block — на один."],
          ["Access only through an HTTP API", "HTTP API access is object storage, not file or block.", "Доступ через HTTP API — это object storage, а не file или block."],
          ["Consistent speed over fibre channel", "Consistent fibre speed is block only; file uses Ethernet.", "Стабильная скорость по оптоволокну — только у block; file работает по Ethernet."],
        ], "Both come from provider-maintained appliances, are highly available and resilient, and often include encryption at rest and in transit.", "Оба берутся с устройств, которые обслуживает провайдер, оба высокодоступны и устойчивы и часто шифруют данные при хранении и передаче."),
        qx("Why does block storage usually cost more than file storage?", "Its fibre network costs more than Ethernet", [
          ["Block volumes are copied to every Region", "Volumes are not replicated to every Region.", "Тома не копируются во все регионы."],
          ["Block storage includes free compute time", "Storage pricing does not bundle compute time.", "В цену хранилища вычислительное время не входит."],
          ["Every block is also saved on magnetic tape", "Blocks are not written to tape.", "Блоки не записываются на ленту."],
        ], "Block storage runs over dedicated fibre optic networks, which are more expensive to build than the Ethernet behind file storage.", "Block storage работает по выделенным оптоволоконным сетям, которые дороже Ethernet, на котором работает file storage."),
        tfx("When provisioning either file or block storage, you should consider the IOPS requirements of the workload.", true, "IOPS sets disk speed for both types; too low becomes a bottleneck, too high wastes money.", "IOPS задаёт скорость дисков у обоих типов: слишком низкий — узкое место, слишком высокий — лишние траты.", "Answering 'False' ignores the lecture's reminder to consider IOPS for both storage types.", "Ответ «неверно» игнорирует прямое напоминание лекции учитывать IOPS для обоих типов."),
        tfx("Compared with direct-attached storage, file storage is more expensive and less resilient to failure.", false, "It is the opposite: file storage is less expensive, more resilient and needs less disk management.", "Наоборот: file storage дешевле, устойчивее к сбоям и требует меньше обслуживания дисков.", "Answering 'True' mixes them up: direct-attached storage is the non-resilient, ephemeral one.", "Ответ «верно» путает их: неустойчивое и временное — как раз direct-attached хранилище."),
      ],
    ),
    part(
      "cc-l3-p4",
      { en: "Object storage, storage tiers and provider comparison", ru: "Объектное хранилище, уровни хранения и сравнение провайдеров" },
      {
        en: `## What object storage is
**Object storage** is not attached to a compute node: you provision an object storage service instance and use an **API (Application Program Interface)** to upload, download and manage data — anything that can call an API can use it.
- **Least expensive**: typically a couple of US cents per gigabyte per month, or less, depending on the tier.
- **Effectively infinite**: you do not provision a size; you consume what you need, pay per gigabyte used, and it never fills up.
- **Slowest** read and write speeds of all storage types.
- Good for large amounts of **unstructured data**: there is no hierarchical folder structure — objects sit in **buckets** in a **flat** way.
- Use cases: text, audio and video files, IoT data, VM images, backup files, logs, application binaries, data archives — any **static data** where fast read/write is not needed.
- **Not suitable** for operating systems, databases or any content that changes often.
- You can have many buckets but **cannot place buckets within buckets**, and you never set a bucket size. Providers offer bucket types with different charges, based on resilience and availability or on access frequency.
## Amazon S3
**Amazon S3 (Simple Storage Service)** is object-level storage: to change part of a file you must make the change and **re-upload the whole file**.
- Data is stored as **objects in buckets**; storage is virtually unlimited; a single object is up to **5 TB**; it is designed for **11 9s of durability** (99.999999999%).
- An **object** is data plus metadata that describes it, including a URL. A **bucket** is a logical container for objects: you control who can create, delete and list objects, view access logs and pick the **Region**.
- Bucket names are **universal**: unique across all of S3 and **DNS-compliant**; object keys should use URL-safe characters.
- A bucket lives in one Region; data is stored **redundantly across multiple facilities** and devices there and survives concurrent data loss in **two facilities**.
- S3 scales by itself: no storage or throughput to provision, you pay only for what you use; it holds trillions of objects and peaks at millions of requests per second.
- Access via the **AWS Management Console, AWS CLI, SDKs** or **REST endpoints over HTTP/HTTPS**; privately through a **VPC endpoint**.
- Security: **IAM policies, bucket policies, per-object ACLs**; **by default nothing is public**; encryption in transit and server-side encryption.
- **Event notifications** (an object uploaded or deleted) can trigger **AWS Lambda**; **storage class analysis** suggests lifecycle rules, e.g. moving data to Standard-IA.
@diagram cc-region-az
## Bucket URLs — two styles
Example: a bucket in the Tokyo Region, code **ap-northeast-1**, holding the object Preview2.mp4 (the object URL ends with the object name).
= https://s3.ap-northeast-1.amazonaws.com/bucket-name
= https://bucket-name.s3-ap-northeast-1.amazonaws.com
The first is the **path-style** URL (bucket name in the path); the second is the **virtual hosted-style** URL (bucket name in the host name).
![AWS S3 console showing the bucket my-bucket-name in Region ap-northeast-1 with a media folder holding welcome.mp4 and an orange Upload button](/events/cc/l3-s3-bucket-console.webp)
## S3 use cases
- **Application assets** — a shared location any instance can reach: user media, server logs; clients can fetch content directly from S3.
- **Static web hosting** — HTML, CSS, JavaScript and other static files.
- **Backup and disaster recovery** — high durability, plus **cross-Region replication** to another Region.
- **Staging area for big data**. Common scenarios: backup and storage, application hosting, media hosting, software delivery.
## S3 storage classes
| Class | Best for | Key facts |
|---|---|---|
| S3 Standard | frequently accessed data | high durability, availability and performance; websites, content distribution, big data |
| S3 Intelligent-Tiering | unknown or changing access patterns | moves objects unused for 30 days to the infrequent tier and back; small monitoring fee, no retrieval fees |
| S3 Standard-IA | infrequent access, but fast when needed | low per-GB price plus a per-GB retrieval fee; backups, DR files |
| S3 One Zone-IA | infrequent, easily re-creatable data | one Availability Zone instead of at least three; cheaper than Standard-IA |
| S3 Glacier | data archiving | three retrieval options, from minutes to hours; lifecycle policies move data in |
| S3 Glacier Deep Archive | data read once or twice a year, kept 7–10 years | lowest cost; at least three AZs; restore within 12 hours; replaces tape |
## Object storage tiers
Buckets have **tiers (classes)** based on **how frequently the data is accessed**.
| Tier | Access frequency | Cost |
|---|---|---|
| Standard | frequently accessed objects | highest per gigabyte |
| Vault / archive | once or twice a month, or less | lower storage cost |
| Cold vault | once or twice a year | a fraction of a US cent per GB per month; retrieval can take hours |
- **Automatic archiving rules**: an object not accessed for some time is moved to a cheaper tier automatically, based on its metadata.
- **Speed**: object storage has **no IOPS options**; it is slower than file or block storage (downloads take seconds or longer), and **cold vault** data is kept offline, so retrieval can take **hours**. Not for apps that need fast access to files.
- **Costs**: priced **per gigabyte used per month**, plus **retrieval charges** — higher for vault and cold vault tiers, so keep data in the tier that matches its access frequency.
## The S3 API
Object storage is accessed through an **API**. The most common one is the **S3 API**, a standard based on AWS S3; many providers offer **S3-compatible** APIs, so the same code works with several vendors' object storage. It is an **HTTP-based RESTful** API: it manages buckets and objects, **PUT** uploads and **GET** downloads.
= PUT -> upload an object; GET -> download an object
## Backup and disaster recovery
Object storage is an effective **backup and DR** solution and a replacement for **offsite tape** backups: many backup packages write straight to cloud object storage, restores are faster, and there are no tapes to load, remove and ship off-site for geographic redundancy.
![A magnetic tape library cabinet with its door open, showing a robotic arm and rows of LTO tape cartridges in slots](/events/cc/l3-tape-library.webp)
## AWS vs Azure vs Google: storage
| Vendor | Storage services | Database services | Backup services |
|---|---|---|---|
| AWS | S3, EBS, EFS, Storage Gateway, Snowball, Snowball Edge, Snowmobile | Aurora, RDS, DynamoDB, ElastiCache, Redshift, Neptune, Database Migration Service | Glacier |
| Azure | Blob Storage, Queue Storage, File Storage, Disk Storage, Data Lake Store | SQL Database, Database for MySQL and PostgreSQL, Data Warehouse, Server Stretch Database, Cosmos DB, Table Storage, Redis Cache, Data Factory | Archive Storage, Backup, Site Recovery |
| GCP | Cloud Storage, Persistent Disk, Transfer Appliance, Transfer Service | Cloud SQL, Cloud Bigtable, Cloud Spanner, Cloud Datastore | none listed |
Matching the storage types across the three providers:
| Storage type | AWS | Azure | GCP |
|---|---|---|---|
| Object | S3 | Blob Storage | Cloud Storage |
| Block | EBS (Elastic Block Store) | Disk Storage | Persistent Disk |
| File | EFS (Elastic File System) | File Storage | not in the table |
| Archive / backup | Glacier | Archive Storage | none listed |
> Object storage: API access, flat buckets, cheapest and infinite but slowest — choose the tier by how often the data is read.
?? A company keeps compliance records that it reads about once a year. Which tier or S3 class keeps costs lowest?
?= A cold vault tier — in S3, Glacier Deep Archive (lowest cost, restore within 12 hours).
?? Why is object storage a poor choice for a database's data files?
?= It is slow, has no IOPS options and is changed only by re-uploading whole objects; databases need block storage.`,
        ru: `## Что такое object storage
**Object storage (объектное хранилище)** не подключают к вычислительному узлу: вы создаёте экземпляр сервиса объектного хранения и через **API (Application Program Interface)** загружаете, скачиваете данные и управляете ими — пользоваться им может всё, что умеет вызвать API.
- **Самое дешёвое**: обычно пара центов США за гигабайт в месяц или меньше, в зависимости от уровня (tier).
- **Практически бесконечное**: размер не задают; вы используете сколько нужно, платите за занятые гигабайты, и оно никогда не заполняется.
- **Самая низкая** скорость чтения и записи среди всех типов.
- Подходит для больших объёмов **неструктурированных данных**: иерархии папок нет — объекты лежат в **бакетах (buckets)** **плоско (flat)**.
- Применение: текстовые, аудио- и видеофайлы, данные IoT, образы VM, резервные копии, логи, бинарники приложений, архивы — любые **статичные данные**, где не нужна быстрая запись/чтение.
- **Не подходит** для операционных систем, баз данных и любого часто меняющегося содержимого.
- Бакетов может быть много, но **бакет нельзя вложить в бакет**, и размер бакета никогда не задают. Провайдеры предлагают типы бакетов с разной ценой — по устойчивости и доступности или по частоте обращений.
## Amazon S3
**Amazon S3 (Simple Storage Service)** — объектное хранилище (object-level): чтобы изменить часть файла, нужно внести правку и **загрузить весь файл заново**.
- Данные хранятся как **объекты в бакетах**; объём практически не ограничен; один объект — до **5 TB**; расчётная **надёжность (durability) — 11 девяток** (99.999999999%).
- **Объект (object)** — данные плюс описывающие их метаданные, включая URL. **Бакет (bucket)** — логический контейнер для объектов: вы решаете, кто может создавать, удалять и просматривать объекты, смотрите журналы доступа и выбираете **регион (Region)**.
- Имена бакетов **универсальны**: уникальны во всём S3 и **совместимы с DNS (DNS-compliant)**; ключи объектов должны состоять из безопасных для URL символов.
- Бакет живёт в одном регионе; данные хранятся там **с избыточностью на нескольких объектах (facilities)** и устройствах и переживают одновременную потерю данных на **двух объектах**.
- S3 масштабируется сам: ни ёмкость, ни пропускную способность выделять не нужно, платите только за использованное; в нём триллионы объектов и пики в миллионы запросов в секунду.
- Доступ через **AWS Management Console, AWS CLI, SDK** или **REST endpoints по HTTP/HTTPS**; приватно — через **VPC endpoint**.
- Безопасность: **IAM policies, bucket policies, ACL на каждый объект**; **по умолчанию ничего не публично**; шифрование при передаче и на стороне сервера.
- **Event notifications** (объект загружен или удалён) могут запускать **AWS Lambda**; **storage class analysis** подсказывает правила жизненного цикла, например перенос данных в Standard-IA.
@diagram cc-region-az
## URL бакета — два стиля
Пример: бакет в регионе Токио с кодом **ap-northeast-1**, в нём объект Preview2.mp4 (URL объекта заканчивается его именем).
= https://s3.ap-northeast-1.amazonaws.com/bucket-name
= https://bucket-name.s3-ap-northeast-1.amazonaws.com
Первый — **path-style** URL (имя бакета в пути); второй — **virtual hosted-style** URL (имя бакета в имени хоста).
![Консоль AWS S3: бакет my-bucket-name в регионе ap-northeast-1, папка media с файлом welcome.mp4 и оранжевая кнопка Upload](/events/cc/l3-s3-bucket-console.webp)
## Применение S3
- **Ресурсы приложений** — общее место, доступное любому инстансу: пользовательские медиафайлы, логи серверов; клиенты могут забирать содержимое прямо из S3.
- **Статический веб-хостинг** — HTML, CSS, JavaScript и другие статичные файлы.
- **Резервное копирование и disaster recovery** — высокая надёжность плюс **cross-Region replication** в другой регион.
- **Промежуточная площадка для big data**. Типичные сценарии: резервное копирование и хранение, хостинг приложений, медиахостинг, распространение ПО.
## Классы хранения S3
| Класс | Для чего | Главное |
|---|---|---|
| S3 Standard | часто используемые данные | высокая надёжность, доступность и скорость; сайты, раздача контента, big data |
| S3 Intelligent-Tiering | неизвестный или меняющийся характер доступа | переносит объекты, к которым не обращались 30 дней, на редкий уровень и обратно; небольшая плата за мониторинг, без платы за извлечение |
| S3 Standard-IA | редкий доступ, но быстрый, когда нужен | низкая цена за GB плюс плата за извлечение каждого GB; бэкапы, файлы DR |
| S3 One Zone-IA | редкие данные, которые легко воссоздать | одна Availability Zone вместо минимум трёх; дешевле Standard-IA |
| S3 Glacier | архивирование данных | три варианта извлечения — от минут до часов; данные переносят lifecycle policies |
| S3 Glacier Deep Archive | данные, которые читают раз-два в год и хранят 7–10 лет | самая низкая цена; минимум три AZ; восстановление в течение 12 часов; замена ленты |
## Уровни объектного хранения
У бакетов есть **уровни (tiers, classes)**, которые зависят от того, **как часто обращаются к данным**.
| Уровень | Частота доступа | Цена |
|---|---|---|
| Standard | часто используемые объекты | самая высокая за гигабайт |
| Vault / archive | раз-два в месяц или реже | хранение дешевле |
| Cold vault | раз-два в год | доли цента США за GB в месяц; извлечение может занять часы |
- **Правила автоматической архивации (automatic archiving rules)**: объект, к которому долго не обращались, сам переносится на более дешёвый уровень — по его метаданным.
- **Скорость**: у object storage **нет вариантов IOPS**; оно медленнее file и block storage (скачивание занимает секунды и дольше), а данные **cold vault** хранятся офлайн, и извлечение может занять **часы**. Не для приложений, которым нужен быстрый доступ к файлам.
- **Стоимость**: оплата **за гигабайт в месяц** плюс **плата за извлечение (retrieval)** — у vault и cold vault она выше, поэтому держите данные на уровне, который соответствует частоте обращений.
## S3 API
К object storage обращаются через **API**. Самый распространённый — **S3 API**, стандарт на основе AWS S3; многие провайдеры дают **S3-совместимые (S3-compatible)** API, так что один и тот же код работает с хранилищами разных поставщиков. Это **RESTful API поверх HTTP**: он управляет бакетами и объектами, **PUT** загружает, **GET** скачивает.
= PUT -> upload an object; GET -> download an object
## Резервное копирование и disaster recovery
Object storage — эффективное решение для **резервного копирования и DR** и замена **ленточным бэкапам за пределами площадки (offsite tape)**: многие программы резервного копирования пишут прямо в облачное object storage, восстановление быстрее, и не нужно загружать, вынимать и вывозить ленты ради географической избыточности.
![Шкаф ленточной библиотеки с открытой дверцей: роботизированная рука и ряды картриджей LTO в слотах](/events/cc/l3-tape-library.webp)
## AWS, Azure и Google: хранилища
| Поставщик | Сервисы хранения | Сервисы баз данных | Сервисы резервного копирования |
|---|---|---|---|
| AWS | S3, EBS, EFS, Storage Gateway, Snowball, Snowball Edge, Snowmobile | Aurora, RDS, DynamoDB, ElastiCache, Redshift, Neptune, Database Migration Service | Glacier |
| Azure | Blob Storage, Queue Storage, File Storage, Disk Storage, Data Lake Store | SQL Database, Database for MySQL и PostgreSQL, Data Warehouse, Server Stretch Database, Cosmos DB, Table Storage, Redis Cache, Data Factory | Archive Storage, Backup, Site Recovery |
| GCP | Cloud Storage, Persistent Disk, Transfer Appliance, Transfer Service | Cloud SQL, Cloud Bigtable, Cloud Spanner, Cloud Datastore | не указаны |
Соответствие типов хранилищ у трёх провайдеров:
| Тип хранилища | AWS | Azure | GCP |
|---|---|---|---|
| Object | S3 | Blob Storage | Cloud Storage |
| Block | EBS (Elastic Block Store) | Disk Storage | Persistent Disk |
| File | EFS (Elastic File System) | File Storage | нет в таблице |
| Архив / бэкап | Glacier | Archive Storage | не указаны |
> Object storage: доступ через API, плоские бакеты, самое дешёвое и бесконечное, но самое медленное — уровень выбирайте по тому, как часто читают данные.
?? Компания хранит документы для регуляторов и читает их примерно раз в год. Какой уровень или класс S3 обойдётся дешевле всего?
?= Уровень cold vault — в S3 это Glacier Deep Archive (самая низкая цена, восстановление в течение 12 часов).
?? Почему object storage плохо подходит для файлов базы данных?
?= Оно медленное, у него нет вариантов IOPS, а изменить объект можно только загрузив его целиком заново; базам данных нужно block storage.`,
      },
      [
        qx("How do applications access object storage?", "Through an API, with no compute node", [
          ["By mounting it as an NFS file share", "NFS mounting describes file storage.", "Подключение по NFS — это file storage."],
          ["By attaching it as a volume on a SAN", "SAN volumes describe block storage.", "Тома в SAN — это block storage."],
          ["Through the server's internal disk bus", "Internal disks are direct-attached storage.", "Внутренние диски — это direct-attached storage."],
        ], "Object storage is not attached to a compute node; you upload, download and manage data through an API.", "Object storage не подключают к узлу; данные загружают, скачивают и ими управляют через API."),
        qx("Which storage type is the least expensive and effectively infinite in size?", "Object storage", [
          ["Block storage", "Block storage has the highest price-point and a provisioned size.", "У block storage самая высокая цена и заданный при создании размер."],
          ["File storage", "File storage has a provisioned capacity that fills up over time.", "У file storage заданная ёмкость, которая со временем заполняется."],
          ["Direct-attached storage", "Local storage is limited to the disks in the server or rack.", "Локальное хранилище ограничено дисками в сервере или стойке."],
        ], "Object storage costs a couple of US cents per GB per month or less and never fills up — you pay for what you use.", "Object storage стоит пару центов за GB в месяц или меньше и никогда не заполняется — платите за то, что используете."),
        qx("Which workload is a poor fit for object storage?", "A transactional database", [
          ["Storing virtual machine images", "VM images are a listed object storage use case.", "Образы VM — один из названных случаев использования object storage."],
          ["Keeping backup files", "Backups are a classic object storage use case.", "Резервные копии — классический случай для object storage."],
          ["Archiving IoT sensor data", "IoT data is a listed use case for object storage.", "Данные IoT — названный случай использования object storage."],
        ], "Object storage is for static data; it is not suitable for operating systems, databases or frequently changing content.", "Object storage — для статичных данных; для ОС, баз данных и часто меняющегося содержимого оно не подходит."),
        qx("Which statement about buckets is true?", "A bucket cannot be placed inside a bucket", [
          ["Each bucket needs a size set in advance", "You never specify a size for a bucket.", "Размер бакета никогда не задают."],
          ["An account can hold only one bucket", "You can have multiple buckets.", "Бакетов может быть много."],
          ["Buckets keep their objects in nested folders", "Objects are stored in a flat structure, not a folder hierarchy.", "Объекты хранятся плоско, без иерархии папок."],
        ], "You can have many buckets, but not buckets within buckets; objects inside are stored flat and no size is needed.", "Бакетов может быть много, но бакет в бакет не вложить; объекты внутри лежат плоско, размер задавать не нужно."),
        qx("What durability is Amazon S3 designed for?", "11 nines", [
          ["4 nines", "Four nines (99.99%) is far below S3's design target.", "Четыре девятки (99,99%) намного ниже расчётной надёжности S3."],
          ["7 nines", "Seven nines is still less than S3's design target.", "Семь девяток — всё ещё меньше расчётной надёжности S3."],
          ["15 nines", "S3 is designed for 11 nines, not 15.", "S3 рассчитан на 11 девяток, а не на 15."],
        ], "S3 is designed for 11 9s of durability — 99.999999999% — and so is Glacier Deep Archive.", "S3 рассчитан на 11 девяток надёжности (durability) — 99,999999999%, как и Glacier Deep Archive."),
        qx("What is the maximum size of a single object in Amazon S3?", "5 TB", [
          ["5 GB", "5 GB is far too small; S3 even stores database snapshots as objects.", "5 GB слишком мало; S3 хранит как объекты даже снимки баз данных."],
          ["500 GB", "Objects can be much larger than 500 GB.", "Объекты могут быть намного больше 500 GB."],
          ["50 TB", "The single-object limit is 5 TB, not 50.", "Лимит одного объекта — 5 TB, а не 50."],
        ], "A single object is limited to 5 TB, while the total storage is virtually unlimited.", "Один объект — до 5 TB, а общий объём практически не ограничен."),
        qx("Which URL is the virtual hosted-style endpoint for a bucket in the Tokyo Region?", "https://bucket-name.s3-ap-northeast-1.amazonaws.com", [
          ["https://s3.ap-northeast-1.amazonaws.com/bucket-name", "This is the path-style URL: the bucket name is in the path.", "Это path-style URL: имя бакета стоит в пути."],
          ["https://ap-northeast-1.amazonaws.com/s3/bucket-name", "This format is not one of the S3 endpoint styles.", "Такого формата среди стилей endpoint S3 нет."],
          ["https://s3.amazonaws.com/ap-northeast-1/bucket-name", "The Region code is never placed in the path like this.", "Код региона так в путь не ставят."],
        ], "In the virtual hosted-style URL the bucket name is part of the host name, followed by s3 and the Region code.", "В virtual hosted-style URL имя бакета — часть имени хоста, за ним идут s3 и код региона."),
        qx("By default, how is data in an Amazon S3 bucket stored?", "Redundantly across facilities in one Region", [
          ["On a single disk in one data center", "S3 never relies on one disk; it survives the loss of two facilities.", "S3 не держится на одном диске; он переживает потерю двух объектов (facilities)."],
          ["Copied automatically to all the other AWS Regions", "Copying to other Regions needs cross-Region replication to be set up.", "Копирование в другие регионы требует настройки cross-Region replication."],
          ["On the EC2 instance that uploaded it", "S3 data is not associated with any particular server.", "Данные S3 не привязаны ни к какому серверу."],
        ], "A bucket belongs to one Region, and its data is stored redundantly across multiple facilities and devices there.", "Бакет принадлежит одному региону, и данные хранятся в нём с избыточностью на нескольких объектах и устройствах."),
        qx("Which S3 storage class moves objects that have not been accessed for 30 consecutive days to a cheaper tier?", "S3 Intelligent-Tiering", [
          ["S3 Standard-IA", "Standard-IA is a fixed class; it does not move objects by itself.", "Standard-IA — фиксированный класс; он сам объекты не перемещает."],
          ["S3 One Zone-IA", "One Zone-IA stores data in one AZ; it does no automatic tiering.", "One Zone-IA хранит данные в одной AZ; автоматического перемещения нет."],
          ["S3 Glacier Deep Archive", "Deep Archive is the lowest-cost archive class, not an automatic tiering class.", "Deep Archive — самый дешёвый архивный класс, а не класс с автоматическим перемещением."],
        ], "Intelligent-Tiering monitors access for a small fee and moves objects between frequent and infrequent tiers, with no retrieval fees.", "Intelligent-Tiering за небольшую плату следит за обращениями и перемещает объекты между частым и редким уровнями без платы за извлечение."),
        qx("A company needs a cheaper class for easily re-creatable, infrequently accessed data and accepts storage in one AZ. Which class?", "S3 One Zone-IA", [
          ["S3 Standard", "Standard is for frequently accessed data and costs more.", "Standard — для часто используемых данных и стоит дороже."],
          ["S3 Standard-IA", "Standard-IA stores data in at least three AZs and costs more than One Zone-IA.", "Standard-IA хранит данные минимум в трёх AZ и стоит дороже One Zone-IA."],
          ["S3 Intelligent-Tiering", "Intelligent-Tiering is for unknown access patterns, not single-AZ savings.", "Intelligent-Tiering — для непредсказуемого доступа, а не для экономии на одной AZ."],
        ], "One Zone-IA keeps data in a single AZ and costs less than Standard-IA — fine for secondary backups or re-creatable data.", "One Zone-IA хранит данные в одной AZ и стоит меньше Standard-IA — подходит для вторичных копий и данных, которые легко воссоздать."),
        qx("A bank must keep records for 7–10 years, read once or twice a year, at the lowest cost. Which S3 class fits?", "S3 Glacier Deep Archive", [
          ["S3 Standard-IA", "Standard-IA is for rapid access to infrequent data and costs much more.", "Standard-IA — для быстрого доступа к редким данным и стоит намного дороже."],
          ["S3 Glacier", "Glacier archives data too, but Deep Archive is the lowest-cost class.", "Glacier тоже архивный, но самый дешёвый класс — Deep Archive."],
          ["S3 One Zone-Infrequent Access", "One Zone-IA gives rapid access from one AZ and costs more than the archive classes.", "One Zone-IA даёт быстрый доступ из одной AZ и стоит дороже архивных классов."],
        ], "Glacier Deep Archive is the lowest-cost class, made for long-term retention in regulated industries; restores within 12 hours.", "Glacier Deep Archive — самый дешёвый класс для долгого хранения в регулируемых отраслях; восстановление — в течение 12 часов."),
        qx("In generic object storage tiers, which tier fits data that is typically accessed once or twice a year?", "Cold vault tier", [
          ["Standard tier", "Standard is for frequently accessed objects.", "Standard — для часто используемых объектов."],
          ["Vault (archive) tier", "Vault is for data read about once or twice a month or less.", "Vault — для данных, которые читают примерно раз-два в месяц или реже."],
          ["Hot access tier", "A hot tier is for frequent access, the opposite case.", "Горячий уровень — для частого доступа, это обратный случай."],
        ], "Cold vault holds data accessed once or twice a year for a fraction of a US cent per GB per month; retrieval can take hours.", "Cold vault хранит данные, которые читают раз-два в год, за доли цента за GB в месяц; извлечение может занять часы."),
        qx("Which traditional backup method does cloud object storage commonly replace?", "Offsite tape-based backups", [
          ["Local RAID arrays in each server", "RAID protects local disks; the lecture contrasts object storage with tape.", "RAID защищает локальные диски; лекция сравнивает object storage именно с лентой."],
          ["Block storage snapshots", "Snapshots back up block and file storage; they are not what object storage replaces.", "Snapshots — способ резервирования block и file storage, а не то, что заменяет object storage."],
          ["In-memory database caches", "Caches speed up reads; they are not a backup method.", "Кэши ускоряют чтение; это не способ резервного копирования."],
        ], "Object storage replaces offsite tapes, which must be loaded, removed and shipped off-site; restores are faster.", "Object storage заменяет ленты, которые нужно загружать, вынимать и вывозить за пределы площадки; восстановление быстрее."),
        qx("What does an automatic archiving rule in object storage do?", "Moves rarely used objects to a cheaper tier", [
          ["Deletes objects that are older than a year", "Archiving rules move objects to cheaper tiers; they do not delete them.", "Правила архивации перемещают объекты на дешёвые уровни, а не удаляют."],
          ["Copies objects onto a block storage volume", "Objects stay in object storage; only the tier changes.", "Объекты остаются в object storage; меняется только уровень."],
          ["Raises the IOPS for popular objects", "Object storage has no IOPS options.", "У object storage нет настроек IOPS."],
        ], "If an object is not accessed for a period of time, the rule uses its metadata to move it to a cheaper storage tier.", "Если к объекту долго не обращаются, правило по его метаданным переносит его на более дешёвый уровень."),
        qx("Which statement about object storage speed is true?", "It has no IOPS options and is slower than block", [
          ["It beats block storage for busy transactional databases", "Object storage is the slowest type and unsuitable for databases.", "Object storage — самый медленный тип и не подходит для баз данных."],
          ["You can buy extra IOPS for each bucket", "Object storage does not come with IOPS options.", "У object storage нет вариантов IOPS."],
          ["Cold vault data returns within milliseconds", "Cold vault data is kept offline and can take hours.", "Данные cold vault хранятся офлайн, извлечение может занять часы."],
        ], "Object storage has no IOPS options, downloads take seconds or longer, and cold vault retrieval can take hours.", "У object storage нет вариантов IOPS, скачивание занимает секунды и больше, а извлечение из cold vault — часы."),
        qx("What does an 'S3-compatible' API from another provider let developers do?", "Use the same code with several vendors", [
          ["Mount their buckets as local NFS drives", "S3 is an HTTP REST API, not a file-system mount.", "S3 — это HTTP REST API, а не подключение файловой системы."],
          ["Store objects without any bucket", "Objects always live in buckets.", "Объекты всегда хранятся в бакетах."],
          ["Avoid all data retrieval charges", "Compatibility does not change the provider's pricing.", "Совместимость не меняет цены провайдера."],
        ], "Many providers offer S3-compatible APIs, so code written for the S3 API works against multiple vendors' object storage.", "Многие провайдеры дают S3-совместимый API, поэтому код для S3 API работает с object storage разных поставщиков."),
        qx("In the S3 RESTful API, which HTTP method uploads an object?", "PUT", [
          ["GET", "GET downloads an object.", "GET скачивает объект."],
          ["HEAD", "HEAD only reads metadata about an object.", "HEAD читает только метаданные объекта."],
          ["DELETE", "DELETE removes an object.", "DELETE удаляет объект."],
        ], "The HTTP-based RESTful S3 API uses PUT to upload and GET to download objects.", "HTTP REST API S3 использует PUT для загрузки и GET для скачивания объектов."),
        qx("In the AWS vs Azure vs Google storage comparison, which Azure service matches Amazon S3 object storage?", "Blob Storage", [
          ["Disk Storage", "Disk Storage gives VM disks, closer to Amazon EBS.", "Disk Storage даёт диски для VM — ближе к Amazon EBS."],
          ["Queue Storage", "Queue Storage holds messages, not objects like S3.", "Queue Storage хранит сообщения, а не объекты, как S3."],
          ["Table Storage", "Table Storage is listed among the database services.", "Table Storage указан среди сервисов баз данных."],
        ], "Azure Blob Storage is the object store; on GCP the match is Cloud Storage.", "Объектное хранилище Azure — Blob Storage; в GCP аналог — Cloud Storage."),
        tfx("Object storage retrieval charges can be higher for data kept in vault or cold vault tiers.", true, "Storage is cheap there, but access costs more, so keep data in the tier that matches how often it is read.", "Хранить там дёшево, но доступ стоит дороже, поэтому держите данные на уровне, который соответствует частоте чтения.", "Answering 'False' misses the lecture's warning that access charges rise for vault and cold vault tiers.", "Ответ «неверно» упускает предупреждение лекции: плата за доступ у vault и cold vault выше."),
        tfx("In Amazon S3 you can change part of an object in place without uploading the whole file again.", false, "S3 is object-level storage: to change part of a file, you make the change and re-upload the entire file.", "S3 — объектное хранилище: чтобы изменить часть файла, вы правите его и загружаете весь файл заново.", "Answering 'True' confuses S3 with block storage, where individual blocks can be rewritten.", "Ответ «верно» путает S3 с block storage, где можно перезаписывать отдельные блоки."),
      ],
    ),
  ],
};
