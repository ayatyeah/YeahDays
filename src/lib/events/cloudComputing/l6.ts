import { part, qx, tfx, type Lecture } from "../types";

export const lecture6: Lecture = {
  id: "cc-l6",
  title: {
    en: "Lecture 6 — AWS economics, billing, support and global infrastructure",
    ru: "Лекция 6 — Экономика AWS, счета, поддержка и глобальная инфраструктура",
  },
  parts: [
    part(
      "cc-l6-p1",
      { en: "Cloud concepts and the six advantages of AWS", ru: "Облачные концепции и шесть преимуществ AWS" },
      {
        en: `## What AWS means by cloud computing
**Cloud computing** is the **on-demand delivery** of compute power, databases, storage, applications and other IT resources **through the internet** with **pay-as-you-go pricing**.
- **Infrastructure as software**: servers, networks and storage are created with a few clicks or one API call and deleted just as fast — no buying, racking or wiring of hardware.
- Traditional hardware needs **space, staff, physical security, planning and capital expenditure**, has a long procurement cycle, and its capacity is sized for a **guessed peak**.
- AWS takes over the **undifferentiated heavy lifting** — running hardware that does not set your business apart — so teams can try an idea, keep what works and throw away the rest.
## Service and deployment models in AWS terms
Lecture 1 explained IaaS, PaaS and SaaS; this is how they look on AWS:
| Model | You still manage | AWS example |
|---|---|---|
| IaaS | OS, runtime, data, application | Amazon EC2 |
| PaaS | only your code and data | AWS Elastic Beanstalk |
| SaaS | nothing but your use of the app | a finished web application such as webmail |
AWS describes **three deployment models**:
- **Cloud (all-in, cloud-native)** — every part of the application runs in the cloud.
- **Hybrid** — cloud resources are connected to infrastructure that stays outside the cloud, for example a legacy database in your own data center.
- **On-premises (private cloud)** — resources stay in your own data center and are offered through virtualization and resource-management tools.
## Six advantages of cloud computing
The exam quotes them almost word for word:
| Advantage | What it means |
|---|---|
| **Trade capital expense for variable expense** | no heavy investment in data centers and servers before you know how you will use them; pay only when, and only as much as, you consume |
| **Benefit from massive economies of scale** | usage from **hundreds of thousands of customers is aggregated** in the cloud, so AWS achieves higher economies of scale and charges **lower pay-as-you-go prices** |
| **Stop guessing capacity** | no expensive idle resources and no shortages: take as much or as little as needed and scale in minutes |
| **Increase speed and agility** | new resources are a click away — **minutes instead of weeks** — so experiments are cheap and fast |
| **Stop spending money running and maintaining data centers** | focus on your customers, not on **racking, stacking and powering servers** |
| **Go global in minutes** | deploy to several Regions with a few clicks: lower latency for customers at minimal cost |
> Exam trap: "Pay for racking, stacking and powering servers" appears in the list of benefits as a distractor — it is exactly the work the cloud removes, so it is NOT a benefit.
> Exam trap: economies of scale come from **aggregating many customers** in one cloud — not from many competing providers, from hundreds of services, or from investing heavily in your own data centers.
## Traditional IT and AWS side by side
Most on-premises ideas have an AWS counterpart:
| Area | On-premises | AWS |
|---|---|---|
| Security | firewalls, ACLs, administrators | security groups, network ACLs, AWS IAM |
| Networking | router, network pipeline, switch | Amazon VPC, Elastic Load Balancing |
| Compute | on-premises servers | AMIs and Amazon EC2 instances |
| Storage and databases | DAS, SAN, NAS, RDBMS | Amazon EBS, Amazon EFS, Amazon S3, Amazon RDS |
## Three ways to work with AWS
- **AWS Management Console** — the web interface, point and click.
- **AWS Command Line Interface (AWS CLI)** — commands in a terminal or a script:
= aws ec2 describe-instances --region us-east-1
- **Software Development Kits (SDKs)** — call AWS services from your own code in Python, Java, JavaScript and other languages.
All three call the same AWS APIs underneath, so anything done in the console can also be scripted.
## AWS Cloud Adoption Framework (AWS CAF)
AWS CAF organizes guidance for moving to the cloud into **six perspectives**: three about **business capabilities** and three about **technical capabilities**.
| Perspective | Focus | Typical stakeholders |
|---|---|---|
| Business | IT investments tied to business results | business and finance managers, budget owners |
| People | change management, training, staffing | HR, people managers |
| Governance | IT strategy aligned with business strategy; portfolio and program management | CIO, program managers, enterprise architects |
| Platform | patterns for new cloud solutions and for migrating workloads | CTO, IT managers, solutions architects |
| Security | visibility, auditability, control and agility | CISO, IT security managers and analysts |
| Operations | run, operate and recover workloads at agreed service levels | IT operations and support managers |
Mnemonic: **Business, People, Governance** = business side; **Platform, Security, Operations** = technical side.
?? A company pays for a server room, its air conditioning and two admins who mostly swap failed disks. Which advantage of the cloud targets exactly this?
?= Stop spending money running and maintaining data centers — AWS does the racking, stacking and powering, and the team can work on things its customers notice.
?? Why can AWS charge less than a company pays to run its own data center?
?= Massive economies of scale: usage from hundreds of thousands of customers is aggregated, so AWS buys and operates at a huge volume and passes the savings on as lower pay-as-you-go prices.`,
        ru: `## Что AWS называет облачными вычислениями
**Облачные вычисления (cloud computing)** — это **предоставление по запросу (on-demand delivery)** вычислительной мощности, баз данных, хранилищ, приложений и других IT-ресурсов **через интернет** с **оплатой по факту использования (pay-as-you-go pricing)**.
- **Инфраструктура как программное обеспечение (infrastructure as software)**: серверы, сети и хранилища создаются парой кликов или одним вызовом API и так же быстро удаляются — без покупки оборудования, монтажа в стойки и прокладки кабелей.
- Традиционному оборудованию нужны **помещение, персонал, физическая охрана, планирование и капитальные затраты**, у него долгий цикл закупки, а мощность рассчитывается под **угаданный пик**.
- AWS берёт на себя **undifferentiated heavy lifting** — «тяжёлую работу», которая не отличает ваш бизнес от других, то есть обслуживание железа, — поэтому командам проще попробовать идею, оставить то, что сработало, и выбросить остальное.
## Модели обслуживания и развёртывания в терминах AWS
IaaS, PaaS и SaaS разобраны в лекции 1; вот как они выглядят в AWS:
| Модель | Чем вы ещё управляете | Пример в AWS |
|---|---|---|
| IaaS | ОС, среда выполнения, данные, приложение | Amazon EC2 |
| PaaS | только своим кодом и данными | AWS Elastic Beanstalk |
| SaaS | ничем, кроме работы в приложении | готовое веб-приложение, например веб-почта |
AWS выделяет **три модели развёртывания (deployment models)**:
- **Cloud (all-in, cloud-native)** — все части приложения работают в облаке.
- **Hybrid (гибридная)** — облачные ресурсы связаны с инфраструктурой, которая остаётся вне облака, например со старой базой данных в собственном дата-центре.
- **On-premises (private cloud, частное облако)** — ресурсы остаются в собственном дата-центре и выдаются через средства виртуализации и управления ресурсами.
## Шесть преимуществ облачных вычислений
На экзамене их цитируют почти дословно:
| Преимущество | Что оно значит |
|---|---|
| **Trade capital expense for variable expense** (капитальные затраты → переменные) | не нужно вкладываться в дата-центры и серверы, пока неизвестно, как они понадобятся; платите только тогда и только столько, сколько потребили |
| **Benefit from massive economies of scale** (огромная экономия на масштабе) | использование **сотен тысяч клиентов объединяется (aggregated)** в облаке, поэтому AWS получает большую экономию на масштабе и берёт **более низкие цены pay-as-you-go** |
| **Stop guessing capacity** (хватит угадывать мощность) | нет дорогих простаивающих ресурсов и нет нехватки: берите сколько нужно и масштабируйтесь за минуты |
| **Increase speed and agility** (скорость и гибкость) | новые ресурсы — в один клик, **минуты вместо недель**, поэтому эксперименты дёшевы и быстры |
| **Stop spending money running and maintaining data centers** (хватит тратить деньги на дата-центры) | сосредоточьтесь на клиентах, а не на **монтаже серверов в стойки и их питании (racking, stacking and powering)** |
| **Go global in minutes** (глобально за минуты) | развёртывание в нескольких регионах в пару кликов: меньше задержка для клиентов при минимальных затратах |
> Ловушка экзамена: «Pay for racking, stacking and powering servers» стоит среди преимуществ как отвлекающий вариант — это ровно та работа, от которой избавляет облако, поэтому это НЕ преимущество.
> Ловушка экзамена: экономия на масштабе возникает из-за **объединения множества клиентов** в одном облаке — а не из-за множества конкурирующих провайдеров, сотен сервисов или крупных вложений в собственные дата-центры.
## Традиционная IT и AWS рядом
У большинства локальных (on-premises) решений есть аналог в AWS:
| Область | On-premises | AWS |
|---|---|---|
| Безопасность | firewalls, ACL, администраторы | security groups, network ACLs, AWS IAM |
| Сеть | router, сетевой канал, switch | Amazon VPC, Elastic Load Balancing |
| Вычисления | собственные серверы | AMI и инстансы Amazon EC2 |
| Хранилища и базы данных | DAS, SAN, NAS, RDBMS | Amazon EBS, Amazon EFS, Amazon S3, Amazon RDS |
## Три способа работать с AWS
- **AWS Management Console** — веб-интерфейс, всё мышкой.
- **AWS Command Line Interface (AWS CLI)** — команды в терминале или скрипте:
= aws ec2 describe-instances --region us-east-1
- **Software Development Kits (SDKs)** — вызовы сервисов AWS из собственного кода на Python, Java, JavaScript и других языках.
Все три способа под капотом вызывают одни и те же API AWS, поэтому всё, что делается в консоли, можно и автоматизировать скриптом.
## AWS Cloud Adoption Framework (AWS CAF)
AWS CAF раскладывает рекомендации по переходу в облако на **шесть перспектив (perspectives)**: три — про **бизнес-возможности**, три — про **технические возможности**.
| Перспектива | Фокус | Типичные участники |
|---|---|---|
| Business | IT-инвестиции привязаны к бизнес-результатам | бизнес- и финансовые менеджеры, владельцы бюджета |
| People | управление изменениями, обучение, найм | HR, руководители сотрудников |
| Governance | IT-стратегия согласована с бизнес-стратегией; управление портфелем и программами | CIO, руководители программ, корпоративные архитекторы |
| Platform | шаблоны для новых облачных решений и переноса нагрузок | CTO, IT-менеджеры, архитекторы решений |
| Security | видимость, проверяемость (auditability), контроль и гибкость | CISO, менеджеры и аналитики IT-безопасности |
| Operations | запуск, эксплуатация и восстановление нагрузок на согласованном уровне | руководители IT-эксплуатации и поддержки |
Мнемоника: **Business, People, Governance** — бизнес-сторона; **Platform, Security, Operations** — техническая.
?? Компания платит за серверную, её кондиционеры и двух администраторов, которые в основном меняют сломанные диски. Какое преимущество облака бьёт ровно в это?
?= Stop spending money running and maintaining data centers — монтаж, установку и питание серверов берёт на себя AWS, а команда может заниматься тем, что замечают клиенты.
?? Почему AWS может брать меньше, чем стоит компании собственный дата-центр?
?= Massive economies of scale: использование сотен тысяч клиентов объединяется, AWS закупает и эксплуатирует оборудование в огромных объёмах и передаёт экономию клиентам в виде более низких цен pay-as-you-go.`,
      },
      [
        qx("Which description of cloud computing matches the AWS definition?", "On-demand delivery of IT resources over the internet with pay-as-you-go pricing", [
          ["Renting a fixed set of physical servers in a provider's building on a yearly contract", "A fixed yearly rental is classic hosting; cloud resources come on demand and are billed by use.", "Фиксированная аренда на год — классический хостинг; облачные ресурсы выдаются по запросу и оплачиваются по факту."],
          ["Installing virtualization software on in-house servers so departments can share them", "That is on-premises virtualization; without delivery over the internet and pay-as-you-go it is not the AWS definition.", "Это виртуализация у себя; без доставки через интернет и оплаты по факту это не определение AWS."],
          ["Moving servers to a colocation center to cut power bills", "Colocation still means owning and maintaining the hardware.", "При colocation оборудование по-прежнему ваше, и обслуживаете его вы."],
        ], "AWS defines cloud computing as on-demand delivery of compute, databases, storage, applications and other IT resources through the internet with pay-as-you-go pricing.", "AWS определяет облачные вычисления как предоставление по запросу вычислений, баз данных, хранилищ, приложений и других IT-ресурсов через интернет с оплатой по факту."),
        qx("Which of these is NOT an advantage of cloud computing over on-premises computing?", "Pay for racking, stacking and powering servers", [
          ["Benefit from massive economies of scale", "This is one of the six advantages: aggregated usage of many customers lowers prices.", "Это одно из шести преимуществ: объединённое использование многих клиентов снижает цены."],
          ["Trade capital expense for variable expense", "This is one of the six advantages: no big up-front investment, pay as you consume.", "Это одно из шести преимуществ: без крупных вложений заранее, оплата по мере потребления."],
          ["Stop guessing your infrastructure capacity needs", "This is the 'stop guessing capacity' advantage: scale up or down in minutes.", "Это преимущество «stop guessing capacity»: масштабирование вверх и вниз за минуты."],
        ], "Racking, stacking and powering servers is the heavy lifting AWS takes over; the real advantage is to STOP spending money running and maintaining data centers.", "Монтаж серверов в стойки и их питание — тяжёлая работа, которую берёт на себя AWS; настоящее преимущество — ПЕРЕСТАТЬ тратить деньги на содержание дата-центров."),
        qx("Where do AWS's massive economies of scale come from?", "Hundreds of thousands of customers aggregated in the cloud", [
          ["Many different cloud providers competing for the same customers", "Competition may affect prices, but AWS attributes its economies of scale to aggregated customer usage.", "Конкуренция может влиять на цены, но AWS объясняет экономию на масштабе объединённым использованием клиентов."],
          ["Hundreds of cloud services offered over the internet", "The number of services is not the source; the volume of aggregated usage is.", "Источник не в количестве сервисов, а в объёме объединённого использования."],
          ["Customers investing heavily in their own data centers first", "Heavy up-front investment is the on-premises model that the cloud replaces.", "Крупные вложения заранее — это модель on-premises, которую облако заменяет."],
        ], "Because usage from hundreds of thousands of customers is aggregated, AWS buys and runs infrastructure at a scale that lowers its pay-as-you-go prices.", "Поскольку использование сотен тысяч клиентов объединяется, AWS закупает и эксплуатирует инфраструктуру в таком масштабе, что цены pay-as-you-go снижаются."),
        qx("A retailer sized its servers for the Black Friday peak; the rest of the year they run at 10% load. Which cloud advantage solves this?", "Stop guessing capacity", [
          ["Go global in minutes", "Going global is about deploying to more Regions, not about idle capacity.", "Go global — про развёртывание в других регионах, а не про простаивающую мощность."],
          ["Increase speed and agility", "Agility is about getting resources quickly for experiments; the problem here is capacity sized for a guessed peak.", "Agility — про быстрое получение ресурсов для экспериментов; здесь же беда в мощности, рассчитанной под угаданный пик."],
          ["Benefit from massive economies of scale", "Economies of scale lower unit prices, but the retailer would still pay for idle servers sized for the peak.", "Экономия на масштабе снижает цену единицы, но ритейлер всё равно платил бы за простаивающие серверы под пик."],
        ], "Sizing for a guessed peak leaves expensive idle resources; in the cloud capacity scales up for the sale and back down afterwards.", "Расчёт под угаданный пик оставляет дорогие простаивающие ресурсы; в облаке мощность растёт к распродаже и уменьшается после неё."),
        qx("Developers used to wait six weeks for a test server; on AWS they launch one in minutes and delete it after the experiment. Which advantage is this?", "Increase speed and agility", [
          ["Stop guessing capacity", "Capacity guessing is about sizing for peaks; the point here is how fast resources become available.", "Угадывание мощности — про расчёт под пики; здесь же главное — как быстро появляются ресурсы."],
          ["Go global in minutes", "No new Regions are involved; the gain is speed for the developers.", "Новые регионы здесь ни при чём; выигрыш — в скорости для разработчиков."],
          ["Trade capital expense for variable expense", "Paying per use is a side effect; the advantage described is weeks shrinking to minutes.", "Оплата по факту — побочный эффект; описано преимущество, при котором недели сжимаются до минут."],
        ], "New IT resources are only a click away, so the time to get them drops from weeks to minutes and experimenting becomes cheap.", "Новые IT-ресурсы — в один клик, поэтому время их получения сокращается с недель до минут, а эксперименты становятся дешёвыми."),
        qx("A startup in Almaty wants low latency for new customers in Europe and Asia without building any data centers there. Which advantage helps most?", "Go global in minutes", [
          ["Stop guessing capacity", "Capacity sizing does not bring servers closer to users on other continents.", "Расчёт мощности не приближает серверы к пользователям на других континентах."],
          ["Increase speed and agility", "Agility speeds up experiments; the need here is presence near distant customers.", "Гибкость ускоряет эксперименты; здесь же нужно присутствие рядом с далёкими клиентами."],
          ["Trade capital expense for variable expense", "Paying per use helps the budget, but the latency problem is solved by deploying in other Regions.", "Оплата по факту помогает бюджету, но задержку решает развёртывание в других регионах."],
        ], "With a few clicks the application can be deployed in Regions in Europe and Asia, giving lower latency at minimal cost.", "В пару кликов приложение разворачивается в регионах Европы и Азии — задержка меньше при минимальных затратах."),
        qx("Which advantage means paying only when you consume resources instead of investing heavily in servers before you know how you will use them?", "Trade capital expense for variable expense", [
          ["Benefit from massive economies of scale", "Economies of scale explain why prices are low, not how you pay.", "Экономия на масштабе объясняет, почему цены низкие, а не как вы платите."],
          ["Stop spending money running and maintaining data centers", "That advantage is about handing the heavy lifting to AWS, not about the payment model.", "Это преимущество — про передачу тяжёлой работы AWS, а не про модель оплаты."],
          ["Increase speed and agility", "Agility is about how fast resources arrive.", "Гибкость — про то, как быстро появляются ресурсы."],
        ], "Capital expense (buying hardware up front) is replaced by variable expense: you pay only when, and as much as, you consume.", "Капитальные затраты (покупка оборудования заранее) заменяются переменными: вы платите только тогда и столько, сколько потребили."),
        qx("Which advantage lets a company focus on the projects that set it apart instead of racking, stacking and powering servers?", "Stop spending money running and maintaining data centers", [
          ["Trade capital expense for variable expense", "That one is about the payment model, not about who does the data-center work.", "Это про модель оплаты, а не про то, кто делает работу в дата-центре."],
          ["Benefit from massive economies of scale", "Economies of scale explain lower prices, not the freed-up team time.", "Экономия на масштабе объясняет низкие цены, а не освободившееся время команды."],
          ["Stop guessing your infrastructure capacity needs", "That one is about sizing capacity, not about running the facility.", "Это про расчёт мощности, а не про содержание помещения с серверами."],
        ], "AWS does the racking, stacking and powering, so the company spends its money and time on its own customers.", "Монтаж, установку и питание серверов делает AWS, поэтому компания тратит деньги и время на своих клиентов."),
        qx("What does AWS mean by treating infrastructure as software?", "Servers and networks are created and removed on demand, like code", [
          ["Physical servers are no longer needed anywhere to run applications", "The servers still exist — in AWS data centers; you just do not buy or wire them.", "Серверы никуда не исчезают — они в дата-центрах AWS; просто их не нужно покупать и подключать."],
          ["Every application must be rewritten before it can run on AWS", "Many workloads move as they are, for example onto EC2 instances.", "Многие нагрузки переносятся как есть, например на инстансы EC2."],
          ["Software licenses are bundled free with every hardware purchase", "Licensing is unrelated; in the cloud there is no hardware purchase at all.", "Лицензии тут ни при чём; в облаке оборудование вообще не покупается."],
        ], "Infrastructure becomes something you provision, change and delete quickly through the console, CLI or API — flexible like software, not fixed like bought hardware.", "Инфраструктура становится тем, что быстро создаётся, меняется и удаляется через консоль, CLI или API, — гибко, как программа, а не жёстко, как купленное железо."),
        qx("A bank keeps its core database in its own data center and connects it to new web front ends running on AWS. Which deployment model is this?", "Hybrid deployment model", [
          ["All-in cloud deployment model", "All-in means every part runs in the cloud; here the database stays on-premises.", "All-in значит, что всё работает в облаке; здесь же база остаётся on-premises."],
          ["On-premises private cloud", "A private cloud keeps everything in-house; here part of the system runs on AWS.", "В частном облаке всё остаётся у себя; здесь часть системы работает в AWS."],
          ["Community cloud model", "A community cloud is shared by organizations with common concerns; it does not describe this setup.", "Community cloud делят организации с общими задачами; к этой схеме он не относится."],
        ], "Cloud resources connected to infrastructure that stays outside the cloud form a hybrid deployment.", "Облачные ресурсы, связанные с инфраструктурой вне облака, — это гибридная модель развёртывания."),
        qx("A team wants to upload its code and let AWS handle capacity, load balancing, scaling and OS patching. Which model and service fit?", "PaaS, such as AWS Elastic Beanstalk", [
          ["IaaS, such as Amazon EC2", "With EC2 the team would still manage the OS, patching and scaling itself.", "С EC2 команда сама управляла бы ОС, патчами и масштабированием."],
          ["SaaS, such as a webmail service", "SaaS is a finished application to use, not a place to deploy your own code.", "SaaS — готовое приложение для использования, а не место для своего кода."],
          ["On-premises, such as a private cloud", "A private cloud keeps all the operational work in-house.", "В частном облаке вся эксплуатация остаётся на вас."],
        ], "In PaaS you manage only your code and data; Elastic Beanstalk handles provisioning, load balancing, scaling and the platform.", "В PaaS вы отвечаете только за код и данные; Elastic Beanstalk берёт на себя создание ресурсов, балансировку, масштабирование и платформу."),
        qx("In the traditional-IT-versus-AWS comparison, what takes the place of on-premises firewalls and ACLs?", "Security groups and network ACLs", [
          ["Amazon EC2 instances and AMIs", "These replace on-premises servers (compute).", "Они заменяют собственные серверы (вычисления)."],
          ["Amazon EBS and Amazon EFS", "These replace SAN and NAS storage.", "Они заменяют хранилища SAN и NAS."],
          ["Elastic Load Balancing and Amazon VPC", "These cover the networking row: router, switch and network pipeline.", "Они закрывают строку «сеть»: маршрутизатор, коммутатор и сетевой канал."],
        ], "Security row of the comparison: firewalls, ACLs and administrators map to security groups, network ACLs and IAM.", "Строка «безопасность» в сравнении: firewalls, ACL и администраторы соответствуют security groups, network ACLs и IAM."),
        qx("A company runs SAN and NAS storage on-premises. Which AWS services take over these roles?", "Amazon EBS and Amazon EFS", [
          ["Amazon VPC and ELB", "These belong to the networking row of the comparison.", "Они относятся к строке «сеть»."],
          ["AWS IAM and security groups", "These belong to the security row.", "Они относятся к строке «безопасность»."],
          ["Amazon EC2 and AMIs", "These replace on-premises servers, not storage.", "Они заменяют серверы, а не хранилища."],
        ], "Block storage (SAN) maps to Amazon EBS and shared file storage (NAS) to Amazon EFS; S3 and RDS complete the storage and database row.", "Блочное хранилище (SAN) соответствует Amazon EBS, общее файловое (NAS) — Amazon EFS; S3 и RDS дополняют строку хранилищ и баз данных."),
        qx("A developer wants a Python application to create S3 buckets programmatically at run time. Which way of accessing AWS fits?", "An AWS SDK used inside the application", [
          ["The AWS Management Console in a browser", "The console is point-and-click for people, not for code at run time.", "Консоль — это клики для людей, а не для кода во время работы."],
          ["The AWS Pricing Calculator web page", "The Pricing Calculator only estimates costs; it does not create resources.", "Pricing Calculator только оценивает стоимость и ресурсы не создаёт."],
          ["An AWS Support case on the Developer plan", "Support answers questions; it does not create resources for your app.", "Поддержка отвечает на вопросы, а не создаёт ресурсы для приложения."],
        ], "SDKs let your own code (Python, Java, JavaScript…) call AWS APIs directly.", "SDK позволяют собственному коду (Python, Java, JavaScript…) напрямую вызывать API AWS."),
        tfx("The AWS Management Console, the AWS CLI and the SDKs are three ways to work with the same AWS services.", true,
          "All three call the same AWS APIs underneath, so anything done in the console can also be scripted or coded.",
          "Все три способа вызывают одни и те же API AWS, поэтому всё, что делается в консоли, можно сделать скриптом или кодом.",
          "'False' would mean each tool reaches different services, but they are three interfaces to the same APIs.",
          "Ответ «неверно» значил бы, что каждый инструмент работает со своими сервисами, а это три интерфейса к одним и тем же API."),
        qx("Which AWS CAF perspective covers training, staffing and organizational change management for cloud adoption?", "People", [
          ["Governance", "Governance aligns IT strategy with business strategy and manages portfolios and programs.", "Governance согласует IT-стратегию с бизнес-стратегией и управляет портфелем и программами."],
          ["Operations", "Operations is about running and recovering workloads at agreed service levels.", "Operations — про эксплуатацию и восстановление нагрузок на согласованном уровне."],
          ["Business", "Business ties IT investments to business results.", "Business привязывает IT-инвестиции к бизнес-результатам."],
        ], "The People perspective handles change management, training and staffing; its stakeholders are HR and people managers.", "Перспектива People отвечает за управление изменениями, обучение и найм; её участники — HR и руководители сотрудников."),
        qx("Which three AWS CAF perspectives focus on technical capabilities?", "Platform, Security and Operations", [
          ["Business, People and Governance", "These three are the business-capability perspectives.", "Эти три — перспективы бизнес-возможностей."],
          ["Platform, People and Security", "People is a business perspective (HR, training).", "People — бизнес-перспектива (HR, обучение)."],
          ["Governance, Security and Operations", "Governance is a business perspective (CIO, portfolio management).", "Governance — бизнес-перспектива (CIO, управление портфелем)."],
        ], "Business, People and Governance cover business capabilities; Platform, Security and Operations cover technical ones.", "Business, People и Governance — бизнес-возможности; Platform, Security и Operations — технические."),
        qx("A CISO wants the cloud adoption plan to ensure visibility, auditability, control and agility. Which AWS CAF perspective is this?", "Security", [
          ["Governance", "Governance is about aligning IT and business strategy, led by the CIO.", "Governance — про согласование IT- и бизнес-стратегии, её ведёт CIO."],
          ["Operations", "Operations runs and recovers workloads; it is led by IT operations managers.", "Operations эксплуатирует и восстанавливает нагрузки; её ведут руководители IT-эксплуатации."],
          ["Platform", "Platform gives patterns for building and migrating solutions, led by the CTO and architects.", "Platform даёт шаблоны для построения и переноса решений; её ведут CTO и архитекторы."],
        ], "The Security perspective targets visibility, auditability, control and agility; its stakeholders are the CISO and IT security staff.", "Перспектива Security нацелена на видимость, проверяемость, контроль и гибкость; её участники — CISO и специалисты IT-безопасности."),
        qx("A manager says: 'After moving to AWS we will still rack and power our own servers, just in an AWS building.' What is wrong with this?", "AWS racks and powers the hardware; customers just rent it", [
          ["Nothing — customers ship their own servers to AWS Regions", "Customers do not ship servers to AWS; they launch instances on AWS hardware.", "Клиенты не отправляют серверы в AWS; они запускают инстансы на оборудовании AWS."],
          ["Customers rack the servers, but AWS pays for the power", "Customers do neither; racking and power are both AWS's job.", "Клиенты не делают ни того, ни другого: и монтаж, и питание — забота AWS."],
          ["Only Enterprise Support customers can skip racking servers", "No support plan is needed; no AWS customer racks hardware.", "Никакой план поддержки не нужен: ни один клиент AWS не монтирует железо."],
        ], "Running and maintaining data centers is AWS's job; customers rent capacity and stop spending money on that heavy lifting.", "Содержание дата-центров — работа AWS; клиенты арендуют мощность и перестают тратить деньги на эту тяжёлую работу."),
        qx("A company runs virtualization and resource-management tools in its own data center to give departments self-service VMs. In AWS terms, which deployment model is this?", "On-premises (private cloud)", [
          ["Hybrid cloud deployment model", "Hybrid needs a connection to resources in a public cloud; here everything is in-house.", "Для гибридной модели нужна связь с ресурсами публичного облака; здесь всё своё."],
          ["Cloud (all-in) deployment", "No part of this setup runs in a public cloud.", "Ни одна часть этой схемы не работает в публичном облаке."],
          ["Software as a Service", "SaaS is a service model, not a deployment model, and no finished app is bought here.", "SaaS — модель обслуживания, а не развёртывания, и готовое приложение здесь не покупается."],
        ], "Resources kept in your own data center and offered through virtualization and resource-management tools are the on-premises (private cloud) model.", "Ресурсы в собственном дата-центре, выдаваемые через виртуализацию и средства управления ресурсами, — это модель on-premises (private cloud)."),
      ],
    ),
    part(
      "cc-l6-p2",
      { en: "AWS pricing, TCO and the Pricing Calculator", ru: "Цены AWS, TCO и Pricing Calculator" },
      {
        en: `## Three fundamental drivers of cost
Almost every AWS bill is a mix of three things:
| Driver | How it is charged | Notes |
|---|---|---|
| **Compute** | per hour or per second of running time | the price depends on the instance type; many instances, for example Linux ones, are billed per second with a 60-second minimum |
| **Storage** | typically **per GB** (per GB-month) | Amazon S3, Amazon EBS and others |
| **Data transfer** | **outbound**: per GB, aggregated across services | **inbound**: no charge in most cases |
@diagram cc6-cost-drivers
> Exam trap: "in most cases there is a per-GB charge for inbound data transfer" is false — data coming **in** is generally free, you pay for data going **out**. Compute is not "a monthly fee based on instance type" either: it is metered per hour or per second.
## How you pay for AWS
- **Pay for what you use (pay-as-you-go)** — no long-term contract and no up-front hardware: you pay only for the resources you run, for as long as they run. This is the answer to "how do we avoid large up-front hardware costs?".
- **Pay less when you reserve** — commit to steady usage for **1 or 3 years** with **Reserved Instances (RIs)** and get a large discount compared with On-Demand (up to about 72–75%). The more you pay up front, the bigger the discount:
| RI payment option | Paid up front | Discount |
|---|---|---|
| All Upfront (AURI) | everything | largest |
| Partial Upfront (PURI) | a part | lower |
| No Upfront (NURI) | nothing | smallest |
- **Pay less by using more** — **volume-based discounts**: with tiered pricing the price per GB in Amazon S3, and for outbound data transfer, falls as monthly volume grows.
- **Pay even less as AWS grows** — growing economies of scale let AWS cut its prices again and again.
- **Custom pricing** — available for high-volume projects with unique requirements.
Why AWS is cheaper for **varying workloads**: Amazon EC2 instances can be **launched on demand when needed** and stopped afterwards, so nobody pays to keep peak capacity idle.
## Services with no charge
Some services cost nothing by themselves: **AWS IAM**, **Amazon VPC**, **AWS CloudFormation**, **AWS Elastic Beanstalk** and **Auto Scaling**. You still pay for the resources they create or use — the EC2 instances that Elastic Beanstalk launches or Auto Scaling adds are billed as usual, and some VPC features, such as NAT gateways, have their own price.
## Total Cost of Ownership (TCO)
**TCO** is a **financial estimate** that identifies the **direct and indirect costs** of a system. It is used to:
- **compare** the cost of running a whole environment, or one workload, **on-premises versus on AWS**;
- **budget and build the business case** for moving to the cloud.
An on-premises TCO has **four cost categories**:
| Category | What it includes |
|---|---|
| Server | hardware (servers, rack chassis, power distribution units, top-of-rack switches) and its maintenance; software (OS and virtualization licenses); facilities (space, power, cooling) |
| Storage | storage disks, SAN or Fibre Channel switches, storage administration; facilities |
| Network | LAN switches, load balancers, bandwidth, network administration; facilities |
| IT labor | server administration |
On-premises capacity is **bought for a guessed peak**: too much means paying for idle servers, too little means slow service and **lost customers**. On AWS capacity follows actual demand.
## AWS Pricing Calculator
The **AWS Pricing Calculator** estimates what a **planned** architecture will cost **before you build it**:
- estimate monthly costs and find ways to **reduce** them;
- **model solutions** and compare instance types, Regions and contract terms;
- put services into named **groups** inside one named estimate;
- each estimate shows the **first 12 months total**, the **total up front** and the **total monthly** cost.
> Pricing Calculator = cost **before** you build. Cost Explorer and Budgets (next part) = cost **after** you run.
## Hard and soft benefits
A cloud business case lists two kinds of benefits:
- **Hard benefits** — measurable money: lower spending on compute, storage, networking and security; fewer hardware and software purchases (capex); lower operational, backup and disaster-recovery costs; fewer operations staff.
- **Soft benefits** — real but harder to put a number on: reuse of services and applications, higher **developer productivity**, better **customer satisfaction**, **agile** business processes, wider **global reach**.
?? A workload runs at a steady load 24/7 and will keep doing so for 3 years. Which way of paying gives the biggest discount?
?= Pay less when you reserve: a 3-year Reserved Instance paid All Upfront (AURI).
?? A video site uploads 50 GB of new videos to Amazon S3 and serves 10 TB to viewers each month. What is billed?
?= Storage per GB for the stored videos and outbound data transfer per GB for the 10 TB served; the 50 GB upload is inbound and in most cases free.`,
        ru: `## Три основных драйвера стоимости
Почти любой счёт AWS складывается из трёх вещей:
| Драйвер | Как оплачивается | Замечания |
|---|---|---|
| **Compute (вычисления)** | за час или за секунду работы | цена зависит от типа инстанса; многие инстансы, например Linux, тарифицируются посекундно с минимумом 60 секунд |
| **Storage (хранение)** | как правило, **за ГБ** (за ГБ в месяц) | Amazon S3, Amazon EBS и другие |
| **Data transfer (передача данных)** | **исходящая (outbound)**: за ГБ, суммируется по всем сервисам | **входящая (inbound)**: в большинстве случаев бесплатна |
@diagram cc6-cost-drivers
> Ловушка экзамена: утверждение «in most cases there is a per-GB charge for inbound data transfer» ложно — **входящие** данные, как правило, бесплатны, платят за **исходящие**. И compute — это не «ежемесячная плата по типу инстанса»: он считается по часам или секундам.
## Как платить за AWS
- **Pay for what you use (pay-as-you-go, оплата по факту)** — без долгосрочного контракта и без покупки оборудования заранее: платите только за запущенные ресурсы и только пока они работают. Это и есть ответ на вопрос «как избежать крупных первоначальных затрат на оборудование».
- **Pay less when you reserve (платите меньше, резервируя)** — обязуетесь на стабильное использование на **1 или 3 года** через **Reserved Instances (RIs)** и получаете крупную скидку относительно On-Demand (примерно до 72–75%). Чем больше платите заранее, тем больше скидка:
| Вариант оплаты RI | Заранее | Скидка |
|---|---|---|
| All Upfront (AURI) | всё | наибольшая |
| Partial Upfront (PURI) | часть | ниже |
| No Upfront (NURI) | ничего | наименьшая |
- **Pay less by using more (платите меньше, используя больше)** — **скидки за объём (volume-based discounts)**: при ступенчатых тарифах цена за ГБ в Amazon S3 и за исходящий трафик падает с ростом месячного объёма.
- **Pay even less as AWS grows (платите ещё меньше по мере роста AWS)** — растущая экономия на масштабе позволяет AWS снова и снова снижать цены.
- **Custom pricing (индивидуальные цены)** — для крупных проектов с особыми требованиями.
Почему AWS выгоднее при **меняющейся нагрузке (varying workloads)**: инстансы Amazon EC2 можно **запускать по требованию, когда они нужны (on demand)**, и останавливать после, поэтому никто не платит за простаивающую пиковую мощность.
## Бесплатные сервисы
Некоторые сервисы сами по себе ничего не стоят: **AWS IAM**, **Amazon VPC**, **AWS CloudFormation**, **AWS Elastic Beanstalk** и **Auto Scaling**. Но ресурсы, которые они создают или используют, оплачиваются — инстансы EC2, запущенные Elastic Beanstalk или добавленные Auto Scaling, тарифицируются как обычно, а у некоторых функций VPC, например NAT gateways, своя цена.
## Total Cost of Ownership (TCO, совокупная стоимость владения)
**TCO** — **финансовая оценка**, которая выявляет **прямые и косвенные затраты** системы. Её используют, чтобы:
- **сравнить** стоимость работы всей среды или одной нагрузки **on-premises и в AWS**;
- **спланировать бюджет и обосновать (business case)** переход в облако.
В TCO для on-premises **четыре категории затрат**:
| Категория | Что входит |
|---|---|
| Server (серверы) | оборудование (серверы, стоечные шасси, блоки распределения питания (PDU), коммутаторы top-of-rack) и его обслуживание; ПО (лицензии ОС и виртуализации); помещение (площадь, электричество, охлаждение) |
| Storage (хранилище) | диски, коммутаторы SAN или Fibre Channel, администрирование хранилища; помещение |
| Network (сеть) | LAN-коммутаторы, балансировщики нагрузки, пропускная способность, администрирование сети; помещение |
| IT labor (труд IT-персонала) | администрирование серверов |
Мощность on-premises **покупают под угаданный пик**: слишком много — платите за простаивающие серверы, слишком мало — медленный сервис и **потерянные клиенты**. В AWS мощность следует за реальным спросом.
## AWS Pricing Calculator
**AWS Pricing Calculator** оценивает, сколько будет стоить **запланированная** архитектура, **ещё до её создания**:
- оценить месячные затраты и найти способы их **снизить**;
- **смоделировать решения** и сравнить типы инстансов, регионы и условия контрактов;
- объединять сервисы в именованные **группы** внутри одной именованной оценки (estimate);
- каждая оценка показывает **сумму за первые 12 месяцев (first 12 months total)**, **сумму авансом (total upfront)** и **сумму в месяц (total monthly)**.
> Pricing Calculator — стоимость **до** создания. Cost Explorer и Budgets (следующая часть) — стоимость **после** запуска.
## Hard и soft benefits
В обосновании перехода в облако выделяют два вида выгод:
- **Hard benefits (измеримые)** — деньги, которые можно посчитать: меньше расходы на вычисления, хранение, сеть и безопасность; меньше покупок оборудования и ПО (capex); ниже операционные расходы, затраты на резервное копирование и аварийное восстановление; меньше персонала эксплуатации.
- **Soft benefits (неявные)** — реальные, но их трудно выразить числом: повторное использование сервисов и приложений, выше **продуктивность разработчиков**, лучше **удовлетворённость клиентов**, **гибкие (agile)** бизнес-процессы, шире **глобальный охват**.
?? Нагрузка работает ровно 24/7 и будет работать так ещё 3 года. Какой способ оплаты даёт наибольшую скидку?
?= Pay less when you reserve: Reserved Instance на 3 года с полной предоплатой (All Upfront, AURI).
?? Видеосайт загружает в Amazon S3 50 ГБ новых видео и отдаёт зрителям 10 ТБ в месяц. За что выставят счёт?
?= За хранение видео — за ГБ, и за исходящую передачу 10 ТБ — тоже за ГБ; загрузка 50 ГБ — входящий трафик, в большинстве случаев бесплатный.`,
      },
      [
        qx("Which statement about AWS pricing is true?", "Storage is typically charged per gigabyte stored", [
          ["Inbound data transfer is usually charged per gigabyte", "In most cases inbound data transfer has no charge; outbound transfer is the one billed per GB.", "Входящий трафик в большинстве случаев бесплатен; за ГБ платят за исходящий."],
          ["Compute is charged as a monthly fee per instance type", "Compute is metered per hour or per second of running time, not as a flat monthly fee.", "Вычисления считаются по часам или секундам работы, а не фиксированной месячной платой."],
          ["Outbound data transfer is a flat fee per account", "Outbound transfer is aggregated across services and charged per GB.", "Исходящий трафик суммируется по сервисам и оплачивается за ГБ."],
        ], "The three drivers: compute per hour or second, storage typically per GB, outbound data transfer per GB (inbound mostly free).", "Три драйвера: вычисления — за час или секунду, хранение — как правило, за ГБ, исходящая передача — за ГБ (входящая в основном бесплатна)."),
        qx("Which of these is NOT one of the three fundamental drivers of AWS cost?", "How many IAM users the account has", [
          ["Compute time used by EC2 instances", "Compute is a cost driver, charged per hour or second.", "Вычисления — драйвер стоимости, оплачиваются за час или секунду."],
          ["Gigabytes of data kept in storage", "Storage is a cost driver, typically charged per GB.", "Хранение — драйвер стоимости, как правило, за ГБ."],
          ["Gigabytes of data transferred out", "Outbound data transfer is a cost driver, charged per GB.", "Исходящая передача данных — драйвер стоимости, за ГБ."],
        ], "The drivers are compute, storage and outbound data transfer; IAM itself has no charge, so the number of IAM users costs nothing.", "Драйверы — вычисления, хранение и исходящая передача данных; IAM сам по себе бесплатен, поэтому число пользователей IAM ничего не стоит."),
        qx("A backup service copies 3 TB of customer files into Amazon S3 every month and almost never restores them. Which charge dominates its bill?", "Storage per GB-month for the files kept in S3", [
          ["Inbound data transfer for the 3 TB uploaded", "Data coming into AWS is free in most cases.", "Данные, входящие в AWS, в большинстве случаев бесплатны."],
          ["Outbound data transfer for the uploads", "Uploads go into AWS, so they are inbound; outbound would be restores, which are rare.", "Загрузки идут в AWS, это входящий трафик; исходящим были бы восстановления, а они редки."],
          ["A monthly fee for the S3 bucket itself", "S3 charges for stored data and requests, not a flat fee per bucket.", "S3 берёт плату за хранимые данные и запросы, а не фиксированную плату за бакет."],
        ], "The data piles up month after month, so storage per GB grows; inbound transfer is generally free and outbound is rare here.", "Данные копятся месяц за месяцем, поэтому растёт плата за хранение за ГБ; входящий трафик, как правило, бесплатен, а исходящего здесь почти нет."),
        qx("A company wants to avoid big up-front spending on hardware before launching a new service. Which AWS pricing principle helps?", "Pay-as-you-go pricing", [
          ["Fixed costs", "Fixed costs are what the company wants to escape; AWS charges for actual usage.", "Фиксированных затрат компания как раз хочет избежать; AWS берёт плату за фактическое использование."],
          ["On-premises licensing", "Licensing for your own servers still needs the hardware purchase.", "Лицензирование для своих серверов всё равно требует покупки оборудования."],
          ["Capital expenditure", "Capital expenditure is the up-front spending itself — the opposite of the goal.", "Капитальные затраты — это и есть траты заранее, противоположность цели."],
        ], "Pay-as-you-go means no up-front hardware and no long-term contract: you pay only for what you use, while you use it.", "Pay-as-you-go — это без покупки оборудования заранее и без долгого контракта: вы платите только за то, что используете, и пока используете."),
        qx("Why is AWS more economical than a traditional data center for applications with varying compute workloads?", "EC2 instances are launched on demand only when they are needed", [
          ["Customers keep full administrator access to their EC2 instances", "Admin access is true but has nothing to do with cost.", "Доступ администратора действительно есть, но к стоимости он отношения не имеет."],
          ["Enough instances can run permanently to cover the peak load", "Running peak capacity all the time is exactly the on-premises waste.", "Держать пиковую мощность всё время — ровно та трата, что и on-premises."],
          ["Amazon EC2 is billed as one fixed fee at the end of each month", "EC2 is billed per hour or second of use, not as a fixed monthly fee.", "EC2 тарифицируется за час или секунду использования, а не фиксированной месячной платой."],
        ], "With varying load you start instances when demand rises and stop them when it falls, paying only for the time they run.", "При меняющейся нагрузке инстансы запускают, когда спрос растёт, и останавливают, когда он падает, — платите только за время работы."),
        qx("Which Reserved Instance payment option gives the largest discount?", "All Upfront (AURI)", [
          ["Partial Upfront (PURI)", "Partial Upfront gives a lower discount than paying everything in advance.", "Partial Upfront даёт скидку меньше, чем полная предоплата."],
          ["No Upfront (NURI)", "No Upfront gives the smallest discount of the three.", "No Upfront даёт наименьшую скидку из трёх."],
          ["On-Demand, no commitment", "On-Demand has no reservation at all, so there is no reservation discount.", "On-Demand — это вообще без резервирования, скидки за него нет."],
        ], "The more you pay up front, the bigger the discount: AURI largest, PURI lower, NURI smallest.", "Чем больше платите заранее, тем больше скидка: AURI — наибольшая, PURI — меньше, NURI — наименьшая."),
        qx("For which terms can you commit when you buy Reserved Instances?", "1-year or 3-year terms", [
          ["1-month or 6-month terms", "Reservations are not sold for months; the terms are one or three years.", "Резервирование не продаётся на месяцы; сроки — один или три года."],
          ["6-month or 1-year terms", "Six months is not an RI term.", "Шесть месяцев — не срок RI."],
          ["3-year or 5-year terms", "Five years is not an RI term; the longest is three years.", "Пять лет — не срок RI; самый длинный — три года."],
        ], "Reserved Instances are a 1-year or 3-year commitment to steady usage in exchange for a discount.", "Reserved Instances — обязательство на 1 или 3 года стабильного использования в обмен на скидку."),
        qx("Amazon S3 charges less per GB once a customer stores more data each month. Which pricing principle is this?", "Pay less by using more", [
          ["Pay less when you reserve", "Reserving is about committing in advance (RIs), not about volume tiers.", "Резервирование — про обязательство заранее (RI), а не про ступени объёма."],
          ["Pay for what you use", "That is the basic pay-as-you-go model; the lower per-GB price comes from volume tiers.", "Это базовая модель pay-as-you-go; снижение цены за ГБ даёт ступенчатый тариф по объёму."],
          ["Custom pricing for big projects", "Custom pricing is negotiated for unique high-volume projects; S3 tiers apply to everyone.", "Индивидуальные цены оговаривают для особых крупных проектов; ступени S3 действуют для всех."],
        ], "Volume-based (tiered) discounts: the more you use, the lower the price per unit.", "Скидки за объём (ступенчатые тарифы): чем больше используете, тем ниже цена за единицу."),
        qx("What does 'pay even less as AWS grows' refer to?", "AWS cuts prices as its own economies of scale grow", [
          ["Customers get discounts as their own company grows", "Company size alone gives no discount; volume tiers depend on usage, not headcount.", "Сам размер компании скидки не даёт; ступени тарифа зависят от использования, а не от штата."],
          ["Prices drop automatically after 12 months of use", "There is no automatic discount after a year of use.", "Автоматической скидки после года использования нет."],
          ["Accounts with more IAM users receive cheaper rates", "IAM users have nothing to do with pricing.", "Пользователи IAM к ценам отношения не имеют."],
        ], "As AWS grows, its economies of scale increase and it passes savings on through repeated price reductions.", "По мере роста AWS экономия на масштабе увеличивается, и AWS передаёт её клиентам, снова и снова снижая цены."),
        qx("A team deploys its app with AWS Elastic Beanstalk and Auto Scaling. What appears on its bill?", "The EC2 instances and other resources they create", [
          ["A fee for Elastic Beanstalk itself plus the resources", "Elastic Beanstalk has no charge of its own.", "У Elastic Beanstalk нет собственной платы."],
          ["Nothing, because both services are free of charge", "The services are free, but the EC2 instances, load balancers and storage they create are not.", "Сами сервисы бесплатны, но созданные ими инстансы EC2, балансировщики и хранилища — нет."],
          ["Only an hourly fee for each Auto Scaling group", "Auto Scaling groups have no hourly fee; you pay for the instances in them.", "За группы Auto Scaling почасовой платы нет; платите за инстансы в них."],
        ], "Elastic Beanstalk and Auto Scaling are services with no charge, but every resource they launch is billed as usual.", "Elastic Beanstalk и Auto Scaling — бесплатные сервисы, но каждый запущенный ими ресурс оплачивается как обычно."),
        qx("Which of these services has no charge by itself?", "AWS Identity and Access Management (IAM)", [
          ["Amazon Elastic Compute Cloud (EC2)", "EC2 is compute, charged per hour or second.", "EC2 — вычисления, оплата за час или секунду."],
          ["Amazon Simple Storage Service (S3)", "S3 is storage, charged per GB stored and per request.", "S3 — хранилище, оплата за хранимые ГБ и запросы."],
          ["Amazon Relational Database Service (RDS)", "RDS charges for database instance hours and storage.", "RDS берёт плату за часы работы инстанса БД и хранилище."],
        ], "IAM, Amazon VPC, CloudFormation, Elastic Beanstalk and Auto Scaling have no charge of their own.", "IAM, Amazon VPC, CloudFormation, Elastic Beanstalk и Auto Scaling сами по себе бесплатны."),
        qx("What is Total Cost of Ownership (TCO)?", "A financial estimate of a system's direct and indirect costs", [
          ["The monthly AWS bill summed over all accounts of an organization", "That is consolidated billing; TCO also counts indirect costs such as staff and facilities.", "Это consolidated billing; TCO учитывает и косвенные затраты — персонал и помещение."],
          ["The price of hardware listed on the vendor's invoice", "The invoice is only one direct cost; TCO adds maintenance, power, cooling, space and labor.", "Счёт поставщика — лишь одна прямая затрата; TCO добавляет обслуживание, электричество, охлаждение, площадь и труд."],
          ["A forecast of next year's spending made in Cost Explorer", "Cost Explorer forecasts AWS spending from past usage; TCO compares whole cost pictures.", "Cost Explorer прогнозирует расходы AWS по прошлому использованию; TCO сравнивает полную картину затрат."],
        ], "TCO is a financial estimate that identifies the direct and indirect costs of a system.", "TCO — финансовая оценка, которая выявляет прямые и косвенные затраты системы."),
        qx("Why would a company run a TCO analysis before migrating to AWS?", "To compare on-premises and AWS costs for a business case", [
          ["To get an e-mail alert when monthly spending passes a set budget", "Alerts on spending are the job of AWS Budgets.", "Оповещения о расходах — задача AWS Budgets."],
          ["To find idle EC2 instances in an existing AWS account", "Finding idle resources is a Trusted Advisor cost-optimization check.", "Поиск простаивающих ресурсов — проверка Trusted Advisor в категории cost optimization."],
          ["To split one consolidated bill between departments", "Splitting a bill is a billing task, not a TCO comparison.", "Разделение счёта — задача биллинга, а не сравнение TCO."],
        ], "TCO compares the cost of running an environment on-premises with running it on AWS, and helps budget and build the business case.", "TCO сравнивает стоимость работы среды on-premises и в AWS и помогает спланировать бюджет и обосновать переход."),
        qx("Which four cost categories does an on-premises TCO comparison use?", "Server, storage, network and IT labor costs", [
          ["Compute, storage, data transfer and support", "Compute, storage and data transfer are the AWS cost drivers, not TCO categories.", "Вычисления, хранение и передача данных — драйверы стоимости AWS, а не категории TCO."],
          ["Hardware, software, licenses and taxes", "Hardware and software appear inside the categories; they are not the four categories themselves.", "Оборудование и ПО входят внутрь категорий, но сами четырьмя категориями не являются."],
          ["Regions, zones, edge locations and support", "These are infrastructure terms, not cost categories.", "Это термины инфраструктуры, а не категории затрат."],
        ], "On-premises TCO groups costs into server, storage, network and IT labor; facilities (space, power, cooling) sit inside the first three.", "TCO on-premises делит затраты на серверы, хранилище, сеть и труд IT-персонала; помещение (площадь, электричество, охлаждение) входит в первые три."),
        qx("In an on-premises TCO analysis, which item belongs to server costs?", "Rack chassis and power distribution units", [
          ["Outbound data transfer billed per gigabyte", "That is an AWS cost driver, not part of on-premises server costs.", "Это драйвер стоимости AWS, а не часть затрат на собственные серверы."],
          ["A monthly AWS Business Support subscription", "A support plan is an AWS cost, not on-premises server hardware.", "План поддержки — расход в AWS, а не собственное серверное оборудование."],
          ["Amazon S3 storage billed per GB-month", "S3 is an AWS storage cost, not on-premises server hardware.", "S3 — расход на хранение в AWS, а не собственное серверное оборудование."],
        ], "Server costs include the servers, rack chassis, power distribution units, top-of-rack switches and their maintenance, plus OS licenses and facilities.", "Затраты на серверы включают сами серверы, стоечные шасси, блоки распределения питания, коммутаторы top-of-rack и их обслуживание, а также лицензии ОС и помещение."),
        qx("An on-premises team buys less capacity than its peak demand needs. What is the risk?", "Slow service and lost customers at peak", [
          ["Paying for idle servers for most of the year", "Idle servers are the risk of buying too much, not too little.", "Простаивающие серверы — риск покупки слишком большой мощности, а не слишком малой."],
          ["Higher outbound data transfer fees", "Own servers are not billed per GB of outbound traffic by AWS.", "За собственные серверы AWS не берёт плату за исходящий трафик."],
          ["Losing volume discounts on stored data", "Volume discounts are an AWS pricing feature, unrelated to on-premises capacity.", "Скидки за объём — особенность цен AWS, к мощности on-premises отношения не имеют."],
        ], "Under-provisioning means the system cannot keep up at peak, so service slows down and customers leave; over-provisioning wastes money.", "Недостаточная мощность не справляется с пиком: сервис тормозит, клиенты уходят; избыточная — тратит деньги впустую."),
        qx("Before migrating, an architect must estimate the monthly cost of a planned setup with EC2, RDS and S3. Which tool fits?", "AWS Pricing Calculator", [
          ["AWS Cost Explorer", "Cost Explorer analyzes costs you have already incurred; nothing is running yet.", "Cost Explorer анализирует уже понесённые расходы, а здесь ещё ничего не запущено."],
          ["AWS Budgets", "Budgets alert on actual or forecast spending of running resources.", "Budgets оповещает о фактических или прогнозных расходах работающих ресурсов."],
          ["AWS Cost and Usage Report", "The report lists detailed usage that already happened.", "Отчёт перечисляет подробное использование, которое уже было."],
        ], "The Pricing Calculator models a solution and estimates its cost before you build it.", "Pricing Calculator моделирует решение и оценивает его стоимость до того, как оно построено."),
        qx("Which totals does an AWS Pricing Calculator estimate show?", "First 12 months total, total up front and total monthly", [
          ["Actual hourly usage of each running resource from last month", "Actual usage line items come from the Cost and Usage Report.", "Фактическое использование по строкам даёт Cost and Usage Report."],
          ["Month-to-date spend and the top services by cost", "That is what the Billing dashboard shows.", "Это показывает Billing dashboard."],
          ["Remaining Free Tier usage for each service", "Free Tier tracking is done in Billing and Budgets, not in an estimate.", "Остаток Free Tier отслеживают в Billing и Budgets, а не в оценке."],
        ], "An estimate is summarized as the first 12 months total, the total up front and the total monthly cost.", "Оценка сводится к сумме за первые 12 месяцев, сумме авансом и сумме в месяц."),
        qx("Which item is a soft benefit in a cloud business case?", "Improved developer productivity", [
          ["Lower spending on compute and storage", "Reduced compute and storage spending is measurable money — a hard benefit.", "Снижение расходов на вычисления и хранение — измеримые деньги, hard benefit."],
          ["Fewer hardware purchases", "Fewer hardware purchases (capex) are a hard benefit.", "Меньше покупок оборудования (capex) — hard benefit."],
          ["Lower backup and disaster-recovery costs", "Lower backup and DR costs are a hard benefit.", "Снижение затрат на резервное копирование и DR — hard benefit."],
        ], "Soft benefits are real but hard to put a number on: developer productivity, customer satisfaction, agility, global reach.", "Soft benefits реальны, но их трудно выразить числом: продуктивность разработчиков, удовлетворённость клиентов, гибкость, глобальный охват."),
        tfx("On AWS, compute is typically charged per hour or per second of running time.", true,
          "Compute is metered by running time, and the rate depends on the instance type.",
          "Вычисления считаются по времени работы, а ставка зависит от типа инстанса.",
          "'False' would match a flat monthly fee per instance type — a classic distractor, not how AWS bills compute.",
          "Ответ «неверно» соответствовал бы фиксированной месячной плате за тип инстанса — это типичный отвлекающий вариант, а не то, как AWS считает вычисления."),
      ],
    ),
    part(
      "cc-l6-p3",
      { en: "Organizations, billing tools, Support plans and Trusted Advisor", ru: "Organizations, инструменты биллинга, планы Support и Trusted Advisor" },
      {
        en: `## AWS Organizations
**AWS Organizations** is a **free** account-management service that **consolidates multiple AWS accounts** into an **organization** that you create and **centrally manage**.
- **Root** — the top container of the organization.
- **Organizational units (OUs)** — groups of accounts; an OU can hold accounts and other OUs, forming a tree, and each account sits in exactly one place in it.
- **Management account** — the account that creates the organization and pays the bill; all the others are **member accounts**.
- A policy attached to an OU applies to **every account and OU below it**.
Key features: **policy-based** and **group-based** account management, **APIs** that automate creating and managing accounts, and **consolidated billing**.
## Service control policies (SCPs)
An **SCP** sets the **maximum permissions** for the accounts it is attached to. It **never grants** anything: an IAM policy still has to allow an action, and the SCP can only narrow what is possible.
| Feature | IAM policy | SCP |
|---|---|---|
| Attached to | users, groups, roles | the root, an OU or an account |
| Grants permissions? | yes | no — only sets the upper limit |
| Restricts the root user of a member account? | no | yes |
Setting up: create the organization → create OUs → create SCPs → test the restrictions.
## Consolidated billing
- **One bill** for all accounts of the organization, paid by the management account.
- Usage of all accounts is **combined**, so volume pricing tiers and reservation discounts are reached sooner.
- Each member account's charges stay visible separately, and consolidated billing has **no extra fee**.
## AWS Billing and Cost Management tools
| Tool | What it does | Typical question |
|---|---|---|
| **Billing dashboard** | month-to-date spend, the services that cost the most, the high-level trend | "Where is my money going this month?" |
| **Bills page** | the monthly bill per service, broken down by Region and linked account | "What exactly was I charged for?" |
| **AWS Cost Explorer** | charts costs and usage over time, forecasts future spending, recommends Reserved Instances | "How has spending changed, and where is it heading?" |
| **AWS Budgets** | custom cost or usage budgets with alerts by email or Amazon SNS when actual or **forecast** spend crosses a threshold | "Warn me before I overspend." |
| **AWS Cost and Usage Report** | the most comprehensive data: hourly or daily line items delivered to an **Amazon S3 bucket** | "Give me raw data to analyze." |
> Exam trap: Budgets **alerts**, Cost Explorer **visualizes and forecasts**, the Cost and Usage Report is the **most detailed raw data**, and the Pricing Calculator **estimates before you build**.
## AWS Support plans
The course names **four** plans — **Basic, Developer, Business, Enterprise**. AWS later added **Enterprise On-Ramp** between Business and Enterprise.
| Plan | For whom | Technical support | Fastest response | Trusted Advisor |
|---|---|---|---|---|
| Basic (free) | every account | no technical cases — account and billing customer service, documentation, forums, AWS Health Dashboard | — | core checks |
| Developer | experimenting, early development | email during business hours, one primary contact | under 12 business hours (system impaired) | core checks |
| Business | production workloads | 24/7 phone, email and chat | under 1 hour (production system down) | full set |
| Enterprise On-Ramp | production and business-critical workloads | 24/7, a pool of TAMs, Concierge | under 30 minutes (business-critical system down) | full set |
| Enterprise | business- and mission-critical workloads | 24/7, a designated TAM, Concierge | under 15 minutes (business-critical system down) | full set |
@diagram cc6-support-plans
- **Technical Account Manager (TAM)** — a named expert who gives **proactive guidance**, architecture reviews and ongoing communication.
- **Support Concierge** — **billing and account** experts for enterprise customers.
- **AWS Trusted Advisor** — automated **best-practice** checks of your account.
> Exam trap: "Basic, Startup, Business, Enterprise" or "Free, Bronze, Silver, Gold" are invented; the plans are **Basic, Developer, Business, Enterprise**.
## AWS Trusted Advisor
**Trusted Advisor** is an online tool that inspects your account and gives **real-time guidance** to provision resources by **AWS best practices**. Each check shows **green** (no problem), **yellow** (investigation recommended) or **red** (action recommended). The course lists **five categories**:
| Category | Example checks |
|---|---|
| Cost optimization | idle load balancers, low-utilization EC2 instances, unassociated Elastic IP addresses |
| Performance | high-utilization EC2 instances, CloudFront configuration, too many security-group rules |
| Security | MFA on the root account, IAM access keys that are old or unused, security groups with unrestricted ports, open S3 bucket permissions |
| Fault tolerance | EC2 balance across AZs, Amazon RDS Multi-AZ, age of EBS snapshots |
| Service limits | usage above 80% of a service quota |
The current console adds a sixth category, **operational excellence**. Basic and Developer get the **core checks** (service limits and a few basic security checks); **Business, Enterprise On-Ramp and Enterprise** get the **full set**.
> Exam trap: unused or old IAM access keys, a root user without MFA or port 22 open to the world are flagged **automatically by Trusted Advisor** — not by CloudWatch (metrics and alarms) or CloudTrail (a log of who did what).
?? Finance asks which three services have cost the most so far this month. Where is the quickest answer?
?= The Billing dashboard (month-to-date spend by service); for trends over many months and a forecast, AWS Cost Explorer.
?? An SCP attached to an account allows every action. Why does an IAM user in that account still get nothing new?
?= An SCP never grants permissions — it only sets the maximum; the user still needs an IAM policy that allows the action.`,
        ru: `## AWS Organizations
**AWS Organizations** — **бесплатный** сервис управления аккаунтами, который **объединяет несколько аккаунтов AWS** в **организацию (organization)**, которую вы создаёте и **управляете централизованно**.
- **Root (корень)** — верхний контейнер организации.
- **Organizational units (OUs, организационные единицы)** — группы аккаунтов; в OU могут быть аккаунты и другие OU, получается дерево, и каждый аккаунт находится ровно в одном его месте.
- **Management account (управляющий аккаунт)** — аккаунт, который создал организацию и оплачивает счёт; все остальные — **member accounts (аккаунты-участники)**.
- Политика, привязанная к OU, действует на **все аккаунты и OU ниже неё**.
Ключевые возможности: управление аккаунтами **через политики (policy-based)** и **по группам (group-based)**, **API** для автоматического создания и управления аккаунтами и **consolidated billing (единый счёт)**.
## Service control policies (SCPs)
**SCP** задаёт **максимальные разрешения** для аккаунтов, к которым она привязана. Сама она **ничего не разрешает**: действие всё равно должна разрешить политика IAM, а SCP может только сузить возможное.
| Признак | Политика IAM | SCP |
|---|---|---|
| К чему привязана | пользователи, группы, роли | root, OU или аккаунт |
| Даёт разрешения? | да | нет — только задаёт верхнюю границу |
| Ограничивает root user аккаунта-участника? | нет | да |
Настройка: создать организацию → создать OU → создать SCP → проверить ограничения.
## Consolidated billing (единый счёт)
- **Один счёт** за все аккаунты организации, его оплачивает management account.
- Использование всех аккаунтов **суммируется**, поэтому ступени скидок за объём и скидки за резервирование достигаются быстрее.
- Расходы каждого аккаунта-участника по-прежнему видны отдельно, а consolidated billing **ничего не стоит**.
## Инструменты AWS Billing and Cost Management
| Инструмент | Что делает | Типичный вопрос |
|---|---|---|
| **Billing dashboard** | расходы с начала месяца, самые дорогие сервисы, общий тренд | «Куда уходят деньги в этом месяце?» |
| **Bills page** | месячный счёт по сервисам с разбивкой по регионам и связанным аккаунтам | «За что именно с меня взяли?» |
| **AWS Cost Explorer** | графики затрат и использования во времени, прогноз будущих расходов, рекомендации по Reserved Instances | «Как менялись расходы и куда они идут?» |
| **AWS Budgets** | свои бюджеты по затратам или использованию с оповещением по email или через Amazon SNS, когда фактические или **прогнозные** расходы переходят порог | «Предупреди, пока я не перерасходовал.» |
| **AWS Cost and Usage Report** | самые полные данные: строки по часам или дням, доставляются в **бакет Amazon S3** | «Дай сырые данные для анализа.» |
> Ловушка экзамена: Budgets **оповещает**, Cost Explorer **визуализирует и прогнозирует**, Cost and Usage Report — **самые подробные сырые данные**, а Pricing Calculator **оценивает до создания**.
## Планы AWS Support
В курсе названы **четыре** плана — **Basic, Developer, Business, Enterprise**. Позже AWS добавил **Enterprise On-Ramp** между Business и Enterprise.
| План | Для кого | Техническая поддержка | Самый быстрый ответ | Trusted Advisor |
|---|---|---|---|---|
| Basic (бесплатный) | любой аккаунт | технических обращений нет — обслуживание по аккаунту и счетам, документация, форумы, AWS Health Dashboard | — | базовые (core) проверки |
| Developer | эксперименты, ранняя разработка | email в рабочие часы, один основной контакт | до 12 рабочих часов (system impaired) | базовые проверки |
| Business | рабочие (production) нагрузки | 24/7 телефон, email и чат | до 1 часа (production system down) | полный набор |
| Enterprise On-Ramp | рабочие и критичные для бизнеса нагрузки | 24/7, пул TAM, Concierge | до 30 минут (business-critical system down) | полный набор |
| Enterprise | критичные для бизнеса и миссии нагрузки | 24/7, выделенный TAM, Concierge | до 15 минут (business-critical system down) | полный набор |
@diagram cc6-support-plans
- **Technical Account Manager (TAM, технический менеджер аккаунта)** — закреплённый эксперт: **проактивные рекомендации**, разбор архитектуры и постоянная связь.
- **Support Concierge** — эксперты по **счетам и аккаунтам** для enterprise-клиентов.
- **AWS Trusted Advisor** — автоматические проверки аккаунта на соответствие **лучшим практикам (best practices)**.
> Ловушка экзамена: «Basic, Startup, Business, Enterprise» и «Free, Bronze, Silver, Gold» — выдумка; планы называются **Basic, Developer, Business, Enterprise**.
## AWS Trusted Advisor
**Trusted Advisor** — онлайн-инструмент, который проверяет аккаунт и даёт **рекомендации в реальном времени (real-time guidance)**, чтобы ресурсы создавались по **лучшим практикам AWS**. У каждой проверки статус **зелёный** (проблем нет), **жёлтый** (стоит разобраться) или **красный** (нужно действовать). В курсе **пять категорий**:
| Категория | Примеры проверок |
|---|---|
| Cost optimization (оптимизация затрат) | простаивающие балансировщики, слабо загруженные инстансы EC2, не привязанные Elastic IP |
| Performance (производительность) | перегруженные инстансы EC2, настройка CloudFront, слишком много правил в security group |
| Security (безопасность) | MFA у root-аккаунта, старые или неиспользуемые ключи доступа IAM, security groups с открытыми портами, открытые разрешения бакетов S3 |
| Fault tolerance (отказоустойчивость) | равномерность EC2 по AZ, Amazon RDS Multi-AZ, возраст снимков EBS |
| Service limits (лимиты сервисов) | использование выше 80% квоты сервиса |
В нынешней консоли есть и шестая категория — **operational excellence**. Basic и Developer получают **базовые проверки (core checks)** — лимиты сервисов и несколько простых проверок безопасности; **Business, Enterprise On-Ramp и Enterprise** — **полный набор**.
> Ловушка экзамена: неиспользуемые или старые ключи доступа IAM, root без MFA или открытый всему миру порт 22 **автоматически отмечает Trusted Advisor** — а не CloudWatch (метрики и оповещения) и не CloudTrail (журнал, кто что сделал).
?? Финансовый отдел спрашивает, какие три сервиса обошлись дороже всего с начала месяца. Где быстрее всего найти ответ?
?= В Billing dashboard (расходы с начала месяца по сервисам); для трендов за много месяцев и прогноза — в AWS Cost Explorer.
?? К аккаунту привязана SCP, разрешающая всё. Почему пользователь IAM в этом аккаунте всё равно не получил новых прав?
?= SCP никогда не выдаёт разрешений — она только задаёт максимум; пользователю всё равно нужна политика IAM, разрешающая действие.`,
      },
      [
        qx("What are the four support plans named in the AWS Cloud Foundations course?", "Basic, Developer, Business, Enterprise", [
          ["Basic, Developer, Production, Enterprise", "There is no 'Production' plan; the plan for production workloads is called Business.", "Плана «Production» нет; план для рабочих нагрузок называется Business."],
          ["Basic, Startup, Business, Enterprise", "There is no 'Startup' plan; the second plan is Developer.", "Плана «Startup» нет; второй план — Developer."],
          ["Free, Bronze, Silver, Gold", "These names are invented; only Basic is free.", "Эти названия выдуманы; бесплатный только Basic."],
        ], "AWS Support plans in the course: Basic, Developer, Business and Enterprise (Enterprise On-Ramp was added later).", "Планы AWS Support в курсе: Basic, Developer, Business и Enterprise (Enterprise On-Ramp добавлен позже)."),
        qx("A company wants its own designated Technical Account Manager for proactive guidance. Which support plan does it need?", "Enterprise", [
          ["Business", "Business has 24/7 engineers but no TAM.", "В Business есть инженеры 24/7, но нет TAM."],
          ["Enterprise On-Ramp", "On-Ramp gives access to a pool of TAMs, not a designated one.", "On-Ramp даёт доступ к пулу TAM, а не к закреплённому менеджеру."],
          ["Developer", "Developer offers only business-hours email support.", "Developer — только email-поддержка в рабочие часы."],
        ], "A designated TAM — proactive guidance, architecture reviews, ongoing communication — comes with Enterprise Support.", "Закреплённый TAM — проактивные рекомендации, разбор архитектуры, постоянная связь — входит в Enterprise Support."),
        qx("What does AWS Support Concierge help with?", "Billing and account issues of enterprise accounts", [
          ["Architecture reviews of production workloads", "Architecture reviews and proactive guidance are the TAM's job.", "Разбор архитектуры и проактивные рекомендации — работа TAM."],
          ["Automated best-practice checks of resources", "Automated checks are AWS Trusted Advisor.", "Автоматические проверки — это AWS Trusted Advisor."],
          ["Repairing hardware in a customer's own data center", "AWS Support does not repair customers' on-premises hardware.", "AWS Support не ремонтирует оборудование в собственных дата-центрах клиентов."],
        ], "The Concierge team are billing and account experts who quickly analyze billing and account issues for enterprise customers.", "Команда Concierge — эксперты по счетам и аккаунтам, которые быстро разбирают такие вопросы для enterprise-клиентов."),
        qx("What is the lowest-cost support plan that offers 24/7 phone, email and chat access to Cloud Support Engineers?", "Business", [
          ["Developer", "Developer offers email only, during business hours.", "Developer — только email и только в рабочие часы."],
          ["Enterprise", "Enterprise has 24/7 access too, but it is not the lowest-cost plan that does.", "В Enterprise тоже есть доступ 24/7, но это не самый дешёвый такой план."],
          ["Basic", "Basic has no technical support cases at all.", "В Basic технических обращений нет совсем."],
        ], "Business Support, aimed at production workloads, is the first plan with 24/7 phone, email and chat.", "Business Support, рассчитанный на рабочие нагрузки, — первый план с телефоном, email и чатом 24/7."),
        qx("What does the free Basic Support plan include?", "Account and billing help, documentation and forums", [
          ["Technical support cases answered within 12 hours", "Technical cases start with the Developer plan.", "Технические обращения начинаются с плана Developer."],
          ["A pool of Technical Account Managers on call", "A pool of TAMs comes with Enterprise On-Ramp.", "Пул TAM входит в Enterprise On-Ramp."],
          ["The full set of Trusted Advisor best-practice checks", "Basic gets only the core checks; the full set starts at Business.", "В Basic только базовые проверки; полный набор — с Business."],
        ], "Basic is free for every account: customer service for account and billing, documentation, forums, the AWS Health Dashboard and core Trusted Advisor checks.", "Basic бесплатен для любого аккаунта: обслуживание по аккаунту и счетам, документация, форумы, AWS Health Dashboard и базовые проверки Trusted Advisor."),
        qx("Under Enterprise Support, what is the target response time when a business-critical system is down?", "Under 15 minutes", [
          ["Under 1 hour", "Under 1 hour is the target for a production system down.", "До 1 часа — цель для случая production system down."],
          ["Under 4 hours", "Under 4 hours is the target for a production system impaired.", "До 4 часов — цель для production system impaired."],
          ["Under 30 minutes", "Under 30 minutes is the Enterprise On-Ramp target for the same case.", "До 30 минут — цель Enterprise On-Ramp для того же случая."],
        ], "Business-critical system down: under 15 minutes with Enterprise, under 30 minutes with Enterprise On-Ramp.", "Business-critical system down: до 15 минут в Enterprise и до 30 минут в Enterprise On-Ramp."),
        qx("A student experimenting with AWS wants to email technical questions to support during business hours, as cheaply as possible. Which plan fits?", "Developer", [
          ["Basic", "Basic covers account and billing questions only, with no technical cases.", "Basic покрывает только вопросы по аккаунту и счетам, без технических обращений."],
          ["Business", "Business adds 24/7 phone and chat for production workloads — more than needed and more expensive.", "Business добавляет телефон и чат 24/7 для рабочих нагрузок — больше, чем нужно, и дороже."],
          ["Enterprise On-Ramp", "On-Ramp is for business-critical workloads and costs far more.", "On-Ramp — для критичных нагрузок и стоит намного больше."],
        ], "Developer Support is for experimenting and early development: business-hours email access to support with one primary contact.", "Developer Support — для экспериментов и ранней разработки: email-доступ к поддержке в рабочие часы, один основной контакт."),
        qx("A security audit finds IAM access keys that nobody has used for months. Which AWS service checks for issues like this automatically against best practices?", "AWS Trusted Advisor", [
          ["Amazon CloudWatch", "CloudWatch collects metrics and fires alarms; it does not run best-practice checks on IAM keys.", "CloudWatch собирает метрики и поднимает оповещения; проверки ключей IAM по лучшим практикам он не делает."],
          ["AWS CloudTrail", "CloudTrail logs API calls — who did what — but does not judge your setup against best practices.", "CloudTrail записывает вызовы API — кто что сделал, — но не оценивает настройки по лучшим практикам."],
          ["AWS Well-Architected Tool", "The Well-Architected Tool is a questionnaire-based workload review, not an automatic scan of IAM keys.", "Well-Architected Tool — разбор нагрузки по опроснику, а не автоматическая проверка ключей IAM."],
        ], "Trusted Advisor's security checks automatically flag issues such as old or unused IAM access keys, missing MFA on the root user and unrestricted ports.", "Проверки безопасности Trusted Advisor автоматически отмечают старые или неиспользуемые ключи доступа IAM, отсутствие MFA у root и открытые порты."),
        qx("Which list gives the five Trusted Advisor categories used in the course?", "Cost optimization, performance, security, fault tolerance, service limits", [
          ["Cost optimization, reliability, security, performance efficiency, sustainability", "That resembles the pillars of the Well-Architected Framework, not Trusted Advisor.", "Это похоже на столпы Well-Architected Framework, а не на Trusted Advisor."],
          ["Compute, storage, networking, databases and security", "These are AWS service categories.", "Это категории сервисов AWS."],
          ["Billing, support, security, fault tolerance, service limits", "Billing and support are not Trusted Advisor check categories.", "Billing и support — не категории проверок Trusted Advisor."],
        ], "Trusted Advisor checks fall into cost optimization, performance, security, fault tolerance and service limits (the console now also has operational excellence).", "Проверки Trusted Advisor делятся на cost optimization, performance, security, fault tolerance и service limits (в консоли теперь есть и operational excellence)."),
        qx("Trusted Advisor flags an Elastic IP address that is not associated with any running instance. Which category is this check in?", "Cost optimization", [
          ["Performance", "Performance checks look at overloaded resources and configuration speed-ups.", "Проверки производительности ищут перегруженные ресурсы и способы ускорить работу."],
          ["Fault tolerance", "Fault tolerance checks look at redundancy, such as Multi-AZ and snapshots.", "Проверки отказоустойчивости смотрят на резервирование — Multi-AZ, снимки."],
          ["Service limits", "Service limits checks compare usage with quotas.", "Проверки лимитов сравнивают использование с квотами."],
        ], "An unattached Elastic IP address costs money while doing nothing, so it is a cost optimization finding.", "Непривязанный Elastic IP стоит денег и ничего не делает, поэтому это находка категории cost optimization."),
        qx("A Trusted Advisor check warns that an Amazon RDS database is not deployed in Multi-AZ. Which category does it belong to?", "Fault tolerance", [
          ["Security", "Security checks cover access: MFA, IAM keys, open ports, bucket permissions.", "Проверки безопасности — про доступ: MFA, ключи IAM, открытые порты, разрешения бакетов."],
          ["Performance", "Performance checks look for overloaded or slow resources.", "Проверки производительности ищут перегруженные или медленные ресурсы."],
          ["Cost optimization", "Cost checks look for idle or underused resources.", "Проверки затрат ищут простаивающие или недогруженные ресурсы."],
        ], "Multi-AZ adds redundancy, so a missing standby in another AZ is a fault tolerance finding.", "Multi-AZ добавляет резервирование, поэтому отсутствие резервной копии в другой AZ — находка категории fault tolerance."),
        qx("What does the Trusted Advisor service limits category check?", "Usage that passes 80% of a service quota", [
          ["IAM users who try to exceed their permissions", "Permission problems are not what service limits checks look at.", "Проблемы с разрешениями проверки лимитов не ищут."],
          ["Monthly spend above the budgeted amount", "Spending against a budget is tracked by AWS Budgets.", "Расходы относительно бюджета отслеживает AWS Budgets."],
          ["EC2 instances whose CPU stays above 90%", "High CPU use is a performance check.", "Высокая загрузка CPU — проверка производительности."],
        ], "Service limits checks warn when usage of a resource exceeds 80% of its service quota, before you hit the limit.", "Проверки лимитов предупреждают, когда использование ресурса превышает 80% квоты сервиса, — до того, как вы упрётесь в лимит."),
        tfx("The full set of Trusted Advisor checks is available on every support plan, including Basic.", false,
          "Basic and Developer get only the core checks; the full set comes with Business, Enterprise On-Ramp and Enterprise.",
          "Basic и Developer получают только базовые проверки; полный набор — в Business, Enterprise On-Ramp и Enterprise.",
          "'True' ignores that the full set is a paid feature of the higher plans.",
          "Ответ «верно» не учитывает, что полный набор — платная возможность старших планов."),
        qx("A university has 30 AWS accounts for different labs and wants one bill and central policies for all of them. Which service fits?", "AWS Organizations", [
          ["AWS IAM", "IAM manages identities inside one account; it does not join accounts or merge their bills.", "IAM управляет пользователями внутри одного аккаунта и не объединяет аккаунты и их счета."],
          ["AWS Budgets", "Budgets sends spending alerts; it does not combine accounts.", "Budgets присылает оповещения о расходах, но не объединяет аккаунты."],
          ["AWS Cost Explorer", "Cost Explorer analyzes costs; it does not manage accounts or policies.", "Cost Explorer анализирует затраты, но не управляет аккаунтами и политиками."],
        ], "AWS Organizations groups accounts into OUs, applies SCPs centrally and provides consolidated billing — at no charge.", "AWS Organizations группирует аккаунты в OU, централизованно применяет SCP и даёт consolidated billing — бесплатно."),
        qx("What does a service control policy (SCP) in AWS Organizations do?", "It sets the maximum permissions for the accounts it covers", [
          ["It grants new permissions to every user in an account", "An SCP never grants permissions; IAM policies still must allow the action.", "SCP никогда не выдаёт разрешений; действие всё равно должна разрешить политика IAM."],
          ["It encrypts all the data stored in member accounts", "Encryption is done by services such as AWS KMS, not by SCPs.", "Шифрованием занимаются сервисы вроде AWS KMS, а не SCP."],
          ["It sends an alert when an account overspends its budget", "Spending alerts come from AWS Budgets.", "Оповещения о перерасходе присылает AWS Budgets."],
        ], "An SCP is a guardrail: it limits what IAM policies in the covered accounts can ever allow.", "SCP — ограждение: она ограничивает то, что политики IAM в этих аккаунтах вообще могут разрешить."),
        qx("An SCP that denies deleting S3 buckets is attached to the 'Prod' OU. Who is affected?", "All accounts and OUs under Prod, even root users", [
          ["Only the IAM users who are named inside the SCP itself", "SCPs do not list users; they apply to whole accounts.", "В SCP не перечисляют пользователей; она действует на аккаунты целиком."],
          ["Only the management account of the organization", "SCPs do not affect the management account at all.", "На management account SCP вообще не действует."],
          ["Nobody until each IAM user accepts the policy", "Users do not accept SCPs; the restriction applies at once.", "Пользователи не принимают SCP; ограничение действует сразу."],
        ], "A policy attached to an OU applies to every account and nested OU below it, including the root users of those member accounts.", "Политика, привязанная к OU, действует на все аккаунты и вложенные OU ниже, включая root user этих аккаунтов-участников."),
        qx("Which is a benefit of consolidated billing in AWS Organizations?", "Usage is combined, so volume discounts are reached sooner", [
          ["Each member account still receives its own separate bill", "Consolidated billing means one bill for all accounts.", "Consolidated billing — это один счёт на все аккаунты."],
          ["Every account in the organization gets Enterprise Support", "Support plans are bought separately; billing does not include them.", "Планы поддержки покупаются отдельно, в единый счёт они не входят."],
          ["It costs a small extra fee for each member account", "Consolidated billing has no additional charge.", "Consolidated billing ничего дополнительно не стоит."],
        ], "Usage of all accounts is added up, so volume tiers and reservation discounts kick in sooner — with one bill and no extra fee.", "Использование всех аккаунтов суммируется, поэтому ступени скидок и скидки за резервирование срабатывают раньше — при одном счёте и без доплаты."),
        qx("A team wants an alert by email or Amazon SNS when its forecast monthly cost will exceed $1,000. Which tool fits?", "AWS Budgets", [
          ["AWS Cost Explorer", "Cost Explorer shows and forecasts costs, but alerting on a threshold is the job of Budgets.", "Cost Explorer показывает и прогнозирует затраты, а оповещать о пороге — задача Budgets."],
          ["AWS Cost and Usage Report", "The report delivers raw line items to S3; it sends no alerts.", "Отчёт доставляет сырые строки в S3 и оповещений не шлёт."],
          ["AWS Pricing Calculator", "The calculator estimates costs before you build; it does not watch real spending.", "Калькулятор оценивает стоимость до создания и не следит за реальными расходами."],
        ], "AWS Budgets alerts when actual or forecast cost or usage crosses the amount you set.", "AWS Budgets оповещает, когда фактические или прогнозные затраты или использование переходят заданную сумму."),
        qx("A data team needs the most detailed hourly line items of cost and usage delivered to an S3 bucket for its own analysis. Which tool fits?", "AWS Cost and Usage Report", [
          ["AWS Cost Explorer", "Cost Explorer gives charts and forecasts in the console, not the most detailed raw files in S3.", "Cost Explorer даёт графики и прогнозы в консоли, а не самые подробные сырые файлы в S3."],
          ["The Bills page of the Billing console", "The Bills page summarizes charges per service; it is not hourly raw data.", "Bills page сводит расходы по сервисам; это не почасовые сырые данные."],
          ["AWS Budgets", "Budgets is for alerts on thresholds.", "Budgets — для оповещений о порогах."],
        ], "The Cost and Usage Report is the most comprehensive cost and usage data, as hourly or daily line items delivered to an S3 bucket.", "Cost and Usage Report — самые полные данные о затратах и использовании: строки по часам или дням, доставляемые в бакет S3."),
        qx("A manager wants charts of how AWS costs changed by service over recent months, a forecast of future spend and Reserved Instance recommendations. Which tool?", "AWS Cost Explorer", [
          ["AWS Budgets", "Budgets alerts on thresholds; it is not the tool for exploring past trends.", "Budgets оповещает о порогах, а не исследует прошлые тренды."],
          ["AWS Trusted Advisor", "Trusted Advisor flags optimization chances, but it does not chart past spending or forecast it.", "Trusted Advisor указывает на возможности экономии, но не строит графики прошлых расходов и не прогнозирует их."],
          ["AWS Pricing Calculator", "The calculator estimates a planned design, not actual past costs.", "Калькулятор оценивает запланированную схему, а не фактические прошлые затраты."],
        ], "Cost Explorer visualizes costs and usage over time, forecasts future spending and recommends Reserved Instances to buy.", "Cost Explorer визуализирует затраты и использование во времени, прогнозирует будущие расходы и рекомендует, какие Reserved Instances купить."),
      ],
    ),
    part(
      "cc-l6-p4",
      { en: "AWS global infrastructure and service categories", ru: "Глобальная инфраструктура AWS и категории сервисов" },
      {
        en: `## AWS Global Infrastructure
The **AWS Global Infrastructure** is built to deliver a **flexible, reliable, scalable and secure** cloud environment with high-quality global network performance. From big to small: **Regions → Availability Zones → data centers**, plus **points of presence** close to users.
@diagram cc6-region-azs
## Regions
An **AWS Region** is a **geographical area** — for example **us-east-1** (N. Virginia) or **eu-central-1** (Frankfurt).
- Each Region is **isolated from and independent of** the others. **Data replication across Regions is controlled by you**: AWS does not copy your data to another Region on its own.
- Regions communicate over the **AWS backbone network**, and each Region has full redundancy and network connectivity.
- A Region typically consists of **two or more Availability Zones** (newer Regions have at least three).
- Some Regions have restricted access: **AWS GovCloud (US)** serves US government agencies and workloads with strict compliance requirements.
## Choosing a Region — the reverse question
Lecture 2 gave the four factors: **data governance and legal requirements**, **proximity to customers (latency)**, **services available in the Region** and **cost**. The exam asks it the other way round — what should you NOT consider?
> Exam trap: "availability of reservation options" is NOT a Region-selection factor. Reserved Instances and Savings Plans are ways to pay, not reasons to pick one Region over another.
## Availability Zones
Each Region has **multiple Availability Zones (AZs)**. An AZ is a **fully isolated partition** of the AWS infrastructure:
- it consists of **one or more discrete data centers** with **redundant power, networking and connectivity**, housed in **separate facilities** with backup generators, cooling equipment and uninterruptible power supplies (UPS);
- AZs are **physically distinct** and designed for **fault isolation**: a fire, flood or power cut in one AZ does not take down the others;
- the AZs of a Region are **interconnected with high-speed, low-latency private links**, so data can be replicated between them quickly;
- AZ names add a letter to the Region code: **us-east-1a**, **us-east-1b**;
- **you choose** the AZs for your resources, and AWS **recommends replicating** data and resources **across AZs** for resiliency.
> Exam picture "What are these?": a frame labelled **AWS Region** holds several separate groups of data centers, with notes such as physically distinct, backup generators, cooling equipment, uninterruptible power supply and network connectivity. The groups are the **Availability Zones** of that Region (option "Region availability zones"); "AWS regions" is the trap — the whole frame is one Region.
## Data centers
- Data centers are **where the data lives and where processing happens**.
- Each has **redundant power, networking and connectivity** and is housed in a **separate facility**; a typical AWS data center holds **50,000–80,000 physical servers**.
- They are **designed for security**.
## Points of presence
Beyond the Regions, AWS runs a much larger network of **points of presence**:
- **Edge locations** — used by **Amazon CloudFront** (the content delivery network) to cache content close to viewers, and by **Amazon Route 53** (DNS) to answer queries quickly.
- **Regional edge caches** — fewer but larger caches between the origin and the edge locations; they keep **less frequently accessed** content longer, so an edge location can fetch it without going back to the origin.
## Bringing AWS closer
| Option | What it is | Use it for |
|---|---|---|
| **AWS Local Zones** | an extension of a Region placed in a large city, with compute, storage and database services | single-digit millisecond latency for users in that city |
| **AWS Wavelength Zones** | AWS compute and storage inside telecom 5G networks | ultra-low latency for mobile and connected devices |
| **AWS Outposts** | AWS-managed racks installed in your own data center | AWS services on-premises for low latency or local data processing |
## Infrastructure features
- **Elastic and scalable** — capacity adapts dynamically and grows with you.
- **Fault-tolerant** — keeps operating properly when a component fails, thanks to built-in **redundancy**.
- **Highly available** — high operational performance with **minimal downtime** and no human intervention.
If an application runs in **one AZ**, a power outage there takes it offline; the standard fix is to run it in **multiple AZs of the same Region**. Several Regions are for disaster recovery or global users, not the default fix.
## AWS service categories
AWS groups its services into **categories** such as compute, storage, networking and databases. The ones the course uses:
| Category | Examples |
|---|---|
| Compute | Amazon EC2, AWS Lambda, AWS Elastic Beanstalk, Amazon ECS, Amazon EKS |
| Storage | Amazon S3, Amazon S3 Glacier, Amazon EBS, Amazon EFS |
| Database | Amazon RDS, Amazon Aurora, Amazon DynamoDB, Amazon Redshift |
| Networking and content delivery | Amazon VPC, Elastic Load Balancing, Amazon CloudFront, Amazon Route 53, AWS Direct Connect |
| Security, identity and compliance | AWS IAM, AWS Organizations, AWS KMS, AWS Shield |
| AWS cost management | AWS Cost Explorer, AWS Budgets, AWS Cost and Usage Report |
| Management and governance | AWS Management Console, Amazon CloudWatch, AWS CloudTrail, AWS Config, AWS Trusted Advisor |
?? A diagram shows three boxes inside one "AWS Region" frame, each with backup generators, cooling and UPS. What are the boxes, and what connects them?
?= The Availability Zones of that Region, connected by high-speed, low-latency private links.
?? What is the difference between an edge location and a Regional edge cache?
?= Edge locations are many small caches close to viewers; Regional edge caches are fewer, larger caches between the origin and the edge locations that keep less popular content for longer.`,
        ru: `## Глобальная инфраструктура AWS
**AWS Global Infrastructure** построена так, чтобы давать **гибкую, надёжную, масштабируемую и безопасную** облачную среду с качественной глобальной сетью. От большего к меньшему: **Regions → Availability Zones → дата-центры**, плюс **точки присутствия (points of presence)** рядом с пользователями.
@diagram cc6-region-azs
## Регионы (Regions)
**AWS Region** — **географическая область**, например **us-east-1** (Северная Вирджиния) или **eu-central-1** (Франкфурт).
- Каждый регион **изолирован от других и независим**. **Репликацией данных между регионами управляете вы**: сам AWS не копирует ваши данные в другой регион.
- Регионы связаны через **магистральную сеть AWS (AWS backbone network)**, и в каждом регионе полное резервирование и сетевая связность.
- Регион обычно состоит из **двух или более Availability Zones** (в новых регионах — минимум три).
- Доступ к некоторым регионам ограничен: **AWS GovCloud (US)** обслуживает госорганы США и нагрузки со строгими требованиями соответствия (compliance).
## Выбор региона — вопрос наоборот
В лекции 2 названы четыре фактора: **управление данными и требования закона (data governance, legal requirements)**, **близость к клиентам (proximity, задержка)**, **доступность сервисов в регионе** и **стоимость**. Экзамен спрашивает наоборот — что учитывать НЕ нужно?
> Ловушка экзамена: «availability of reservation options» — НЕ фактор выбора региона. Reserved Instances и Savings Plans — способы оплаты, а не причины предпочесть один регион другому.
## Зоны доступности (Availability Zones)
В каждом регионе **несколько Availability Zones (AZ)**. AZ — **полностью изолированная часть (partition)** инфраструктуры AWS:
- она состоит из **одного или нескольких отдельных дата-центров** с **резервированным питанием, сетью и связностью**, в **отдельных зданиях** с резервными генераторами, системами охлаждения и источниками бесперебойного питания (UPS);
- AZ **физически разнесены** и спроектированы для **изоляции сбоев (fault isolation)**: пожар, наводнение или отключение электричества в одной AZ не роняют остальные;
- AZ одного региона **соединены быстрыми частными каналами с низкой задержкой (low-latency links)**, поэтому данные между ними реплицируются быстро;
- имя AZ — это код региона плюс буква: **us-east-1a**, **us-east-1b**;
- **AZ для ресурсов выбираете вы**, а AWS **рекомендует реплицировать** данные и ресурсы **по нескольким AZ** ради устойчивости.
> Картинка с экзамена «What are these?»: рамка с подписью **AWS Region**, внутри несколько отдельных групп дата-центров и подписи physically distinct, backup generators, cooling equipment, uninterruptible power supply, network connectivity. Эти группы — **Availability Zones** этого региона (вариант «Region availability zones»); «AWS regions» — ловушка: вся рамка — это один регион.
## Дата-центры
- Дата-центры — **место, где лежат данные и идёт их обработка**.
- У каждого **резервированное питание, сеть и связность**, и каждый стоит в **отдельном здании**; типичный дата-центр AWS вмещает **50 000–80 000 физических серверов**.
- Они **спроектированы с упором на безопасность**.
## Точки присутствия (points of presence)
Помимо регионов у AWS намного более широкая сеть **точек присутствия**:
- **Edge locations** — их использует **Amazon CloudFront** (сеть доставки контента, CDN), чтобы кэшировать контент рядом со зрителями, и **Amazon Route 53** (DNS), чтобы быстро отвечать на запросы.
- **Regional edge caches (региональные пограничные кэши)** — их меньше, но они крупнее, стоят между источником (origin) и edge locations; они дольше хранят **редко запрашиваемый** контент, чтобы edge location могла взять его, не обращаясь к источнику.
## Как приблизить AWS
| Вариант | Что это | Для чего |
|---|---|---|
| **AWS Local Zones** | расширение региона в крупном городе с сервисами вычислений, хранения и баз данных | задержка в единицы миллисекунд для пользователей этого города |
| **AWS Wavelength Zones** | вычисления и хранение AWS внутри 5G-сетей операторов связи | сверхнизкая задержка для мобильных и подключённых устройств |
| **AWS Outposts** | стойки под управлением AWS в вашем собственном дата-центре | сервисы AWS on-premises ради низкой задержки или локальной обработки данных |
## Свойства инфраструктуры
- **Elastic and scalable (эластичность и масштабируемость)** — мощность динамически подстраивается и растёт вместе с вами.
- **Fault-tolerant (отказоустойчивость)** — система продолжает правильно работать при отказе компонента благодаря встроенному **резервированию (redundancy)**.
- **Highly available (высокая доступность)** — высокая работоспособность с **минимальным простоем** и без вмешательства людей.
Если приложение работает в **одной AZ**, отключение питания там выводит его из строя; стандартное решение — запускать его в **нескольких AZ одного региона**. Несколько регионов — для аварийного восстановления или пользователей по всему миру, а не решение по умолчанию.
## Категории сервисов AWS
AWS группирует сервисы в **категории (service categories)** — вычисления, хранение, сети, базы данных и другие. Те, что используются в курсе:
| Категория | Примеры |
|---|---|
| Compute | Amazon EC2, AWS Lambda, AWS Elastic Beanstalk, Amazon ECS, Amazon EKS |
| Storage | Amazon S3, Amazon S3 Glacier, Amazon EBS, Amazon EFS |
| Database | Amazon RDS, Amazon Aurora, Amazon DynamoDB, Amazon Redshift |
| Networking and content delivery | Amazon VPC, Elastic Load Balancing, Amazon CloudFront, Amazon Route 53, AWS Direct Connect |
| Security, identity and compliance | AWS IAM, AWS Organizations, AWS KMS, AWS Shield |
| AWS cost management | AWS Cost Explorer, AWS Budgets, AWS Cost and Usage Report |
| Management and governance | AWS Management Console, Amazon CloudWatch, AWS CloudTrail, AWS Config, AWS Trusted Advisor |
?? На схеме внутри одной рамки «AWS Region» три блока, у каждого — резервные генераторы, охлаждение и UPS. Что это за блоки и что их связывает?
?= Это Availability Zones этого региона, связанные быстрыми частными каналами с низкой задержкой.
?? Чем edge location отличается от Regional edge cache?
?= Edge locations — много небольших кэшей рядом со зрителями; Regional edge caches — меньшее число крупных кэшей между источником и edge locations, которые дольше хранят менее популярный контент.`,
      },
      [
        tfx("Networking, storage, compute and databases are examples of service categories that AWS offers.", true,
          "AWS groups its services into categories, and compute, storage, networking and content delivery, and database are among them.",
          "AWS группирует сервисы в категории, и compute, storage, networking and content delivery и database — среди них.",
          "'False' would mean these are single services, but each is a whole category (for example EC2, Lambda and Elastic Beanstalk are all compute).",
          "Ответ «неверно» значил бы, что это отдельные сервисы, а каждое из них — целая категория (например, EC2, Lambda и Elastic Beanstalk — всё compute)."),
        qx("When selecting an AWS Region for a workload, which of these should you NOT consider?", "Availability of reservation options", [
          ["Data governance and legal requirements", "Laws may require data to stay in a territory — a key factor.", "Закон может требовать держать данные на территории — ключевой фактор."],
          ["Proximity to your customers", "Proximity lowers latency — a key factor.", "Близость снижает задержку — ключевой фактор."],
          ["Services available in the Region", "Not every service exists in every Region — a key factor.", "Не каждый сервис есть в каждом регионе — ключевой фактор."],
        ], "The four factors are data governance and legal requirements, proximity to customers, available services and cost; reservation options are a way to pay, not a Region criterion.", "Четыре фактора — управление данными и закон, близость к клиентам, доступные сервисы и стоимость; варианты резервирования — способ оплаты, а не критерий выбора региона."),
        qx("An exam image shows one frame labelled 'AWS Region' with three separate groups of data centers inside, linked by arrows and annotated 'physically distinct', 'backup generators', 'cooling equipment', 'UPS' and 'network connectivity'. What are the groups?", "The Availability Zones of that Region", [
          ["Several AWS Regions in one geographic area", "The whole frame is one Region; the groups inside it are its AZs.", "Вся рамка — один регион; группы внутри неё — его AZ."],
          ["Customer on-premises data centers", "On-premises data centers belong to the customer and are not drawn inside an AWS Region.", "Собственные дата-центры принадлежат клиенту и не рисуются внутри региона AWS."],
          ["CloudFront edge locations", "Edge locations are small caches near users, outside the Regions, without this AZ-level redundancy.", "Edge locations — небольшие кэши рядом с пользователями, вне регионов, без такого резервирования, как у AZ."],
        ], "Physically distinct groups of data centers with their own power, cooling and connectivity inside one Region are Availability Zones.", "Физически разнесённые группы дата-центров со своим питанием, охлаждением и связью внутри одного региона — это Availability Zones."),
        tfx("Availability Zones within a Region are connected through low-latency links.", true,
          "AZs of one Region are interconnected with high-speed, low-latency private networking, so data can be replicated between them.",
          "AZ одного региона соединены быстрой частной сетью с низкой задержкой, поэтому между ними можно реплицировать данные.",
          "'False' confuses physical separation with poor connectivity: AZs are far apart, yet linked by fast private links.",
          "Ответ «неверно» путает физическую разнесённость с плохой связью: AZ далеко друг от друга, но соединены быстрыми частными каналами."),
        qx("Why are the Availability Zones of a Region physically separate from each other?", "So that a failure in one AZ does not affect the others", [
          ["So that each AZ can offer a different set of services", "Separation is about fault isolation, not about service catalogs.", "Разнесённость нужна для изоляции сбоев, а не для разных каталогов сервисов."],
          ["So that AZs in one Region can be priced differently", "Pricing is set per Region; separation is not done for pricing.", "Цены задаются по регионам; разносят AZ не ради цен."],
          ["So that traffic between AZs travels over the internet", "AZs are linked by private low-latency links, not the public internet.", "AZ связаны частными каналами с низкой задержкой, а не публичным интернетом."],
        ], "AZs are designed for fault isolation: a fire, flood or power outage in one AZ does not take down the others.", "AZ спроектированы для изоляции сбоев: пожар, наводнение или отключение питания в одной AZ не роняет остальные."),
        qx("A company keeps its data in eu-central-1. When does that data get copied to another Region?", "Only when the customer sets up replication", [
          ["Automatically every night, to keep it durable", "AWS never copies data across Regions on its own; durability is achieved inside the Region.", "AWS сам не копирует данные между регионами; надёжность обеспечивается внутри региона."],
          ["Whenever one AZ of the Region fails", "An AZ failure does not move data to another Region; that is what multiple AZs inside the Region are for.", "Отказ AZ не переносит данные в другой регион; для этого и нужны несколько AZ внутри региона."],
          ["As soon as Business Support is purchased", "Support plans have nothing to do with data location.", "Планы поддержки не связаны с местом хранения данных."],
        ], "Regions are isolated, and data replication across Regions is controlled by the customer — important for data-residency laws.", "Регионы изолированы, и репликацией данных между регионами управляет клиент — это важно для законов о местонахождении данных."),
        qx("Which identifier names an Availability Zone rather than a Region?", "us-east-1a", [
          ["us-east-1", "us-east-1 is the Region code (N. Virginia).", "us-east-1 — код региона (Северная Вирджиния)."],
          ["eu-central-1", "eu-central-1 is the Frankfurt Region code.", "eu-central-1 — код региона Франкфурт."],
          ["ap-northeast-1", "ap-northeast-1 is the Tokyo Region code.", "ap-northeast-1 — код региона Токио."],
        ], "An AZ name is the Region code plus a letter: us-east-1a, us-east-1b and so on.", "Имя AZ — код региона плюс буква: us-east-1a, us-east-1b и так далее."),
        qx("A retail app runs in one Availability Zone and went offline during a power outage there. What is the best way to prevent this?", "Run the app in several AZs of the same Region", [
          ["Deploy to several AWS Regions by default", "Multi-Region is for disasters or global users; multiple AZs already survive one AZ's outage at lower cost.", "Несколько регионов — для катастроф или глобальных пользователей; несколько AZ уже переживают отказ одной AZ и дешевле."],
          ["Move to a bigger EC2 instance in the same AZ", "A bigger instance in the same AZ goes down with that AZ.", "Более мощный инстанс в той же AZ упадёт вместе с ней."],
          ["Switch from Spot to On-Demand Instances", "The pricing model does not protect against a power outage.", "Модель оплаты не защищает от отключения питания."],
        ], "AZs are isolated from each other's failures, so copies in two or more AZs keep the app running when one AZ loses power.", "AZ изолированы от сбоев друг друга, поэтому копии в двух и более AZ продолжают работать, когда в одной пропадает питание."),
        qx("Which AWS services use edge locations to serve users from nearby?", "Amazon CloudFront and Amazon Route 53", [
          ["Amazon EC2 and Amazon Elastic Block Store", "EC2 and EBS run inside Availability Zones of a Region.", "EC2 и EBS работают внутри Availability Zones региона."],
          ["Amazon RDS and Amazon DynamoDB", "Databases run in Regions, not at edge locations.", "Базы данных работают в регионах, а не в edge locations."],
          ["AWS IAM and AWS Organizations", "IAM and Organizations are global account services, not edge caches.", "IAM и Organizations — глобальные сервисы аккаунта, а не пограничные кэши."],
        ], "CloudFront caches content and Route 53 answers DNS queries from edge locations close to users.", "CloudFront кэширует контент, а Route 53 отвечает на DNS-запросы из edge locations рядом с пользователями."),
        qx("What is a Regional edge cache used for?", "Caching less popular content between origin and edges", [
          ["Running EC2 instances close to users in large cities", "That describes AWS Local Zones.", "Это описание AWS Local Zones."],
          ["Storing a full backup copy of every resource in a Region", "Regional edge caches only cache content for CloudFront; they are not backups.", "Regional edge caches только кэшируют контент для CloudFront и не являются резервными копиями."],
          ["Replicating databases between two Regions", "Cross-Region replication is configured by the customer in the database service.", "Межрегиональную репликацию клиент настраивает в самом сервисе базы данных."],
        ], "Regional edge caches are fewer, larger caches between the origin and edge locations; they keep less frequently accessed content longer.", "Regional edge caches — меньшее число крупных кэшей между источником и edge locations; они дольше хранят редко запрашиваемый контент."),
        qx("Which statement about edge locations is correct?", "There are many more edge locations than Regions", [
          ["Each edge location is a complete small Region", "An edge location is a cache point, without AZs or the full set of services.", "Edge location — точка кэширования, без AZ и полного набора сервисов."],
          ["Edge locations are where your EC2 instances usually run", "EC2 instances run in Availability Zones of a Region.", "Инстансы EC2 работают в Availability Zones региона."],
          ["There is exactly one edge location per AZ", "Edge locations are placed near users, not one per AZ.", "Edge locations ставят рядом с пользователями, а не по одной на AZ."],
        ], "The points-of-presence network — edge locations plus Regional edge caches — is far larger than the number of Regions.", "Сеть точек присутствия — edge locations и Regional edge caches — гораздо больше, чем число регионов."),
        qx("A game studio needs single-digit millisecond latency for players in a big city far from the nearest Region, and owns no data center there. What fits best?", "AWS Local Zones", [
          ["AWS Outposts", "Outposts racks go into your own data center, which the studio does not have.", "Стойки Outposts ставят в собственный дата-центр, а его у студии нет."],
          ["A Regional edge cache", "It caches content for CloudFront but cannot run game servers.", "Он кэширует контент для CloudFront, но не запускает игровые серверы."],
          ["AWS GovCloud (US)", "GovCloud is an isolated Region for US government workloads.", "GovCloud — изолированный регион для госнагрузок США."],
        ], "Local Zones extend a Region into large cities with compute, storage and database services for single-digit millisecond latency.", "Local Zones расширяют регион в крупные города с вычислениями, хранением и базами данных ради задержки в единицы миллисекунд."),
        qx("A factory must keep processing its data on its own premises but wants the same AWS services and APIs there. What fits?", "AWS Outposts", [
          ["AWS Local Zones", "Local Zones are AWS-run sites in big cities, not on the factory's premises.", "Local Zones — площадки AWS в крупных городах, а не на территории завода."],
          ["AWS Wavelength Zones", "Wavelength places compute inside telecom 5G networks.", "Wavelength размещает вычисления внутри 5G-сетей операторов."],
          ["Amazon CloudFront", "CloudFront delivers content to viewers; it does not run local processing.", "CloudFront доставляет контент зрителям и локальную обработку не выполняет."],
        ], "Outposts installs AWS-managed racks in your own data center, so AWS services run on-premises.", "Outposts ставит стойки под управлением AWS в ваш дата-центр, и сервисы AWS работают on-premises."),
        qx("Which AWS infrastructure feature means that a system keeps operating properly when a component fails, thanks to built-in redundancy?", "Fault tolerance", [
          ["Elasticity", "Elasticity is about capacity adapting to demand.", "Эластичность — про подстройку мощности под спрос."],
          ["Scalability", "Scalability is about growing to accommodate more load.", "Масштабируемость — про рост под большую нагрузку."],
          ["Pay-as-you-go pricing", "This is a pricing model, not an infrastructure feature.", "Это модель оплаты, а не свойство инфраструктуры."],
        ], "Fault-tolerant infrastructure continues operating properly in the presence of a failure because components are redundant.", "Отказоустойчивая инфраструктура продолжает правильно работать при сбое, потому что компоненты резервированы."),
        qx("Which AWS Region is isolated for US government agencies and workloads with strict compliance requirements?", "AWS GovCloud (US)", [
          ["US East (N. Virginia)", "us-east-1 is an ordinary commercial Region open to everyone.", "us-east-1 — обычный коммерческий регион, открытый для всех."],
          ["A Local Zone in Washington", "Local Zones extend Regions for latency, not for government isolation.", "Local Zones расширяют регионы ради задержки, а не для изоляции госнагрузок."],
          ["Any Region with Enterprise Support", "Support plans do not create isolated Regions.", "Планы поддержки не создают изолированных регионов."],
        ], "AWS GovCloud (US) is a Region with restricted access for US government and regulated workloads.", "AWS GovCloud (US) — регион с ограниченным доступом для госорганов США и регулируемых нагрузок."),
        qx("A colleague says: 'An Availability Zone is a single data center, and all AZs of a Region share one power supply.' What is wrong?", "An AZ may hold several data centers with their own power", [
          ["Nothing — that is exactly how AWS defines an Availability Zone", "AWS defines an AZ as one or more discrete data centers with redundant power, isolated from other AZs.", "AWS определяет AZ как один или несколько отдельных дата-центров с резервированным питанием, изолированных от других AZ."],
          ["Regions sit inside AZs, not the other way round", "It is the other way round: AZs sit inside a Region.", "Наоборот: AZ находятся внутри региона."],
          ["AZs share power, but each has its own network", "AZs do not share power; independent power is what isolates their failures.", "AZ не делят питание; именно независимое питание изолирует их сбои."],
        ], "An AZ is one or more discrete data centers, each with redundant power, networking and connectivity; sharing power would break fault isolation.", "AZ — один или несколько отдельных дата-центров с резервированным питанием, сетью и связностью; общее питание нарушило бы изоляцию сбоев."),
        qx("Which of these services belongs to the AWS cost management category?", "AWS Budgets", [
          ["AWS Trusted Advisor", "Trusted Advisor is in the management and governance category.", "Trusted Advisor относится к категории management and governance."],
          ["AWS Shield", "Shield protects against DDoS attacks — security, identity and compliance.", "Shield защищает от DDoS-атак — security, identity and compliance."],
          ["Amazon CloudWatch", "CloudWatch monitoring is in management and governance.", "Мониторинг CloudWatch — management and governance."],
        ], "AWS cost management includes AWS Cost Explorer, AWS Budgets and the AWS Cost and Usage Report.", "В AWS cost management входят AWS Cost Explorer, AWS Budgets и AWS Cost and Usage Report."),
        qx("Amazon VPC, Elastic Load Balancing and Amazon CloudFront belong to which AWS service category?", "Networking and content delivery", [
          ["Compute", "Compute covers EC2, Lambda, Elastic Beanstalk and containers.", "Compute — это EC2, Lambda, Elastic Beanstalk и контейнеры."],
          ["Security, identity and compliance", "That category holds IAM, Organizations, KMS and Shield.", "В этой категории IAM, Organizations, KMS и Shield."],
          ["Management and governance", "That category holds CloudWatch, CloudTrail, Config and Trusted Advisor.", "В этой категории CloudWatch, CloudTrail, Config и Trusted Advisor."],
        ], "VPC, ELB, CloudFront, Route 53 and Direct Connect make up networking and content delivery.", "VPC, ELB, CloudFront, Route 53 и Direct Connect составляют networking and content delivery."),
        qx("Which group lists only AWS storage services?", "Amazon S3, Amazon EBS, Amazon EFS, S3 Glacier", [
          ["Amazon S3, Amazon RDS, Amazon EBS, Amazon VPC", "RDS is a database and VPC is networking.", "RDS — база данных, VPC — сеть."],
          ["Amazon EFS, Amazon EC2, Amazon EBS, AWS Lambda", "EC2 and Lambda are compute services.", "EC2 и Lambda — вычислительные сервисы."],
          ["Amazon DynamoDB, Amazon S3, Aurora, Amazon EBS", "DynamoDB and Aurora are databases.", "DynamoDB и Aurora — базы данных."],
        ], "The storage category is Amazon S3, S3 Glacier, Amazon EBS and Amazon EFS.", "Категория storage — Amazon S3, S3 Glacier, Amazon EBS и Amazon EFS."),
        qx("Which category do Amazon CloudWatch, AWS CloudTrail and AWS Config belong to?", "Management and governance", [
          ["Security, identity and compliance", "These tools help with security, but the course places them in management and governance.", "Эти инструменты помогают безопасности, но в курсе они в management and governance."],
          ["AWS cost management", "Cost management is Cost Explorer, Budgets and the Cost and Usage Report.", "Cost management — это Cost Explorer, Budgets и Cost and Usage Report."],
          ["Networking and content delivery", "Networking is VPC, ELB, CloudFront, Route 53 and Direct Connect.", "Сети — это VPC, ELB, CloudFront, Route 53 и Direct Connect."],
        ], "Management and governance includes the Management Console, CloudWatch, CloudTrail, Config, Auto Scaling, the CLI, Trusted Advisor and the Well-Architected Tool.", "Management and governance включает Management Console, CloudWatch, CloudTrail, Config, Auto Scaling, CLI, Trusted Advisor и Well-Architected Tool."),
      ],
    ),
  ],
};
