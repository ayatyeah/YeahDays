import { part, qx, tfx, type Lecture } from "../types";

/* ─────────────── Part 1 — the shared responsibility model ─────────────── */

const p1 = part(
  "cc-l7-p1",
  { en: "The AWS shared responsibility model", ru: "Модель разделённой ответственности AWS" },
  {
    en: `## Security is shared
Security and compliance on AWS are a **shared responsibility** between AWS and the customer. The dividing line is easy to remember:
- **AWS is responsible for security OF the cloud** — the infrastructure that runs every AWS service.
- **The customer is responsible for security IN the cloud** — everything they put into the cloud and how they configure it.
> Mnemonic: AWS guards **the building, the machines and the cables**; the customer guards **what they run, store and configure** inside.
@diagram cc7-shared-model
## AWS: security OF the cloud
- **Physical security of data centers** — controlled, need-based access; 24/7 security guards; two-factor authentication; access logging and review; video surveillance; disk degaussing and destruction.
- **Hardware infrastructure** — servers, storage devices and other appliances.
- **Software infrastructure** — host operating systems and the **virtualization layer (hypervisor)** that isolates customers from each other.
- **Network infrastructure** — routers, switches, load balancers, firewalls and cabling, continuously monitored at the external boundaries, with redundant links.
- **Global infrastructure** — Regions, Availability Zones and edge locations.
## Customer: security IN the cloud
- **Customer data** — what is stored, how it is classified, whether it is encrypted.
- The **guest operating system** of Amazon EC2 instances, including **updates and security patches**.
- **Applications** the customer installs — passwords, role-based access, configuration.
- **Security group** rules and any OS-level or host-based firewall, including intrusion detection or prevention.
- **Network configuration** — VPCs, subnets, route tables.
- **Account management** — IAM users, groups, roles, permissions and MFA.
- **Encryption** — client-side and server-side encryption, protection of network traffic.
## The line moves with the type of service
The more managed the service, the more AWS takes over. **Data and access control always stay with the customer.**
| Service type | AWS examples | AWS manages | Customer manages |
|---|---|---|---|
| IaaS (infrastructure as a service) | Amazon EC2, Amazon EBS, Amazon VPC | hardware, network, hypervisor | guest OS and patches, apps, security groups, network settings, data, access |
| PaaS (platform as a service) | AWS Lambda, Amazon RDS, AWS Elastic Beanstalk | also OS, database or runtime patching, firewall setup, backups, disaster recovery | code, data, schema design, access control |
| SaaS (software as a service) | AWS Trusted Advisor, AWS Shield, Amazon Chime | everything that runs the service | who uses it and what data goes in |
- **IaaS** gives the most control over networking and storage, so the customer also manages **more of the security**, including access controls.
- With **PaaS** the customer does not manage the underlying infrastructure and can focus on **code and data**.
- **SaaS** is centrally hosted and reached through a browser, mobile app or API; the customer manages none of the infrastructure behind it.
## One database, two answers
| Task | Oracle on Amazon EC2 | Oracle on Amazon RDS |
|---|---|---|
| Patch the operating system | customer | AWS |
| Upgrade and patch the database engine | customer | AWS |
| Provision storage and run automated backups | customer | AWS |
| Design tables, indexes and data structures | customer | customer |
| Create database users and control access | customer | customer |
| Protect the physical server and data center | AWS | AWS |
> Exam trap: with a **fully managed database** (Amazon RDS, Amazon Aurora, Amazon DynamoDB) the customer is responsible for **designing data structures and managing access controls**; **provisioning, scaling, patching and backups** belong to AWS.
## Quick sorting
| Situation | Whose job |
|---|---|
| Install OS security patches on an EC2 instance | customer |
| Keep the hypervisor and host hardware secure | AWS |
| Allow port 22 only from the office IP range | customer |
| An S3 bucket made public by mistake | customer |
| Protect Regions against power and network outages | AWS |
| Keep one customer's traffic isolated from another's | AWS |
| Keep SSH private keys secret | customer |
| Require MFA for every IAM user | customer |
| Make sure the AWS Management Console itself is not hacked | AWS |
| Configure the VPC and its subnets | customer |
> Exam trap: "AWS secures the cloud" does not mean AWS fixes **the customer's misconfiguration**. A public bucket, an open security group or an unpatched guest OS is the customer's problem.
## Proving AWS's half: compliance and AWS Artifact
Customers in regulated industries must show auditors that the infrastructure is under control. AWS works with **independent third-party auditors** and publishes the results.
- **Certifications and attestations** — assessed by an independent auditor: ISO/IEC 27001, 27017, 27018, ISO 9001, SOC reports, PCI DSS.
- **Laws, regulations and privacy** — AWS provides security features and legal agreements that help customers meet, for example, GDPR or HIPAA.
- **Alignments and frameworks** — industry- or government-specific requirements, for example the CIS benchmarks.
- **AWS Artifact** — a self-service portal in the console (Security, Identity & Compliance) with **on-demand access to AWS security and compliance reports** (SOC, PCI, ISO) and **select online agreements**, such as the HIPAA Business Associate Addendum (BAA).
> A PCI DSS or ISO attestation covers **AWS's layer** only. The customer's own workload still has to meet the standard — that work sits in the customer's half of the model.
?? A team moves its PostgreSQL database from EC2 to Amazon RDS. Which security tasks leave the team, and which stay?
?= OS and engine patching, storage provisioning and automated backups move to AWS. Schema design and control over who can access the database stay with the team.
?? An auditor asks for AWS's SOC 2 report. Where can the team get it?
?= In AWS Artifact in the AWS Management Console — it gives on-demand access to AWS compliance reports and agreements.
?? Whose fault is it if an S3 bucket with customer files is readable by anyone?
?= The customer's: bucket access settings are security IN the cloud. New buckets are private by default, so someone opened it.`,
    ru: `## Безопасность — общая
Безопасность и соответствие требованиям (compliance) в AWS — **общая ответственность (shared responsibility)** AWS и клиента. Граница запоминается легко:
- **AWS отвечает за безопасность САМОГО облака (security OF the cloud)** — за инфраструктуру, на которой работают все сервисы AWS.
- **Клиент отвечает за безопасность В облаке (security IN the cloud)** — за всё, что он размещает в облаке, и за то, как это настроено.
> Мнемоника: AWS охраняет **здание, машины и кабели**; клиент охраняет **то, что запускает, хранит и настраивает** внутри.
@diagram cc7-shared-model
## AWS: безопасность САМОГО облака
- **Физическая безопасность дата-центров** — доступ только по служебной необходимости и под контролем; охрана 24/7; двухфакторная аутентификация; журналирование и проверка доступа; видеонаблюдение; размагничивание и уничтожение дисков.
- **Аппаратная инфраструктура** — серверы, устройства хранения и другое оборудование.
- **Программная инфраструктура** — ОС хостов и **слой виртуализации (hypervisor)**, который изолирует клиентов друг от друга.
- **Сетевая инфраструктура** — маршрутизаторы, коммутаторы, балансировщики нагрузки, firewall и кабели; внешние границы постоянно мониторятся, каналы зарезервированы.
- **Глобальная инфраструктура** — регионы (Regions), зоны доступности (Availability Zones) и edge locations.
## Клиент: безопасность В облаке
- **Данные клиента** — что хранится, как классифицировано, зашифровано ли.
- **Гостевая ОС (guest OS)** инстансов Amazon EC2, включая **обновления и патчи безопасности**.
- **Приложения**, которые ставит клиент, — пароли, ролевой доступ, настройки.
- Правила **security groups** и любой firewall на уровне ОС или хоста, включая обнаружение и предотвращение вторжений.
- **Настройка сети** — VPC, подсети, таблицы маршрутов.
- **Управление аккаунтом** — пользователи, группы и роли IAM, права и MFA.
- **Шифрование** — на стороне клиента и на стороне сервера, защита сетевого трафика.
## Граница сдвигается вместе с типом сервиса
Чем более управляемый (managed) сервис, тем больше берёт на себя AWS. **Данные и контроль доступа всегда остаются за клиентом.**
| Тип сервиса | Примеры в AWS | Управляет AWS | Управляет клиент |
|---|---|---|---|
| IaaS (инфраструктура как сервис) | Amazon EC2, Amazon EBS, Amazon VPC | оборудование, сеть, гипервизор | гостевая ОС и патчи, приложения, security groups, сетевые настройки, данные, доступ |
| PaaS (платформа как сервис) | AWS Lambda, Amazon RDS, AWS Elastic Beanstalk | ещё и патчи ОС, базы данных или среды выполнения, настройка firewall, бэкапы, аварийное восстановление | код, данные, проектирование схемы, контроль доступа |
| SaaS (ПО как сервис) | AWS Trusted Advisor, AWS Shield, Amazon Chime | всё, на чём работает сервис | кто им пользуется и какие данные туда попадают |
- **IaaS** даёт больше всего контроля над сетью и хранилищем, поэтому клиент отвечает и за **большую часть безопасности**, включая контроль доступа.
- В **PaaS** клиент не управляет нижележащей инфраструктурой и может сосредоточиться на **коде и данных**.
- **SaaS** размещён централизованно, к нему обращаются через браузер, мобильное приложение или API; инфраструктурой за ним клиент не управляет вовсе.
## Одна база данных — два ответа
| Задача | Oracle на Amazon EC2 | Oracle на Amazon RDS |
|---|---|---|
| Ставить патчи ОС | клиент | AWS |
| Обновлять и патчить движок базы данных | клиент | AWS |
| Выделять хранилище и делать автоматические бэкапы | клиент | AWS |
| Проектировать таблицы, индексы и структуры данных | клиент | клиент |
| Заводить пользователей БД и контролировать доступ | клиент | клиент |
| Защищать физический сервер и дата-центр | AWS | AWS |
> Ловушка экзамена: у **полностью управляемой базы данных (fully managed)** — Amazon RDS, Amazon Aurora, Amazon DynamoDB — клиент отвечает за **проектирование структур данных и управление доступом**; **выделение ресурсов (provisioning), масштабирование, патчи и бэкапы** — на AWS.
## Быстрая сортировка
| Ситуация | Чья задача |
|---|---|
| Поставить патчи безопасности ОС на инстанс EC2 | клиента |
| Защищать гипервизор и оборудование хостов | AWS |
| Разрешить порт 22 только с диапазона IP офиса | клиента |
| S3 bucket по ошибке сделали публичным | клиента |
| Защищать регионы от отключений питания и сети | AWS |
| Изолировать трафик одного клиента от трафика другого | AWS |
| Хранить приватные SSH-ключи в секрете | клиента |
| Требовать MFA для каждого пользователя IAM | клиента |
| Следить, чтобы саму AWS Management Console не взломали | AWS |
| Настраивать VPC и её подсети | клиента |
> Ловушка экзамена: «AWS защищает облако» не значит, что AWS исправит **ошибки настройки клиента**. Публичный bucket, открытая security group или непропатченная гостевая ОС — проблема клиента.
## Как AWS доказывает свою половину: compliance и AWS Artifact
Клиентам из регулируемых отраслей нужно показать аудиторам, что инфраструктура под контролем. AWS работает с **независимыми внешними аудиторами (third-party auditors)** и публикует результаты.
- **Сертификации и аттестации (certifications and attestations)** — их проверяет независимый аудитор: ISO/IEC 27001, 27017, 27018, ISO 9001, отчёты SOC, PCI DSS.
- **Законы, регуляции и приватность** — AWS даёт функции безопасности и юридические соглашения, которые помогают клиентам соответствовать, например, GDPR или HIPAA.
- **Отраслевые рамки (alignments and frameworks)** — требования конкретных отраслей или государства, например CIS benchmarks.
- **AWS Artifact** — портал самообслуживания в консоли (Security, Identity & Compliance) с **доступом по запросу к отчётам AWS о безопасности и соответствии** (SOC, PCI, ISO) и **некоторым онлайн-соглашениям**, например HIPAA Business Associate Addendum (BAA).
> Аттестация PCI DSS или ISO покрывает только **слой AWS**. Собственная нагрузка клиента всё равно должна соответствовать стандарту — эта работа в клиентской половине модели.
?? Команда переносит базу PostgreSQL с EC2 на Amazon RDS. Какие задачи безопасности уходят от команды, а какие остаются?
?= Патчи ОС и движка, выделение хранилища и автоматические бэкапы переходят к AWS. Проектирование схемы и контроль над тем, кто может обращаться к базе, остаются у команды.
?? Аудитор просит отчёт AWS SOC 2. Где команда может его взять?
?= В AWS Artifact в AWS Management Console — там по запросу доступны отчёты AWS о соответствии и соглашения.
?? Чья вина, если S3 bucket с файлами клиентов может читать кто угодно?
?= Клиента: настройки доступа к bucket — это безопасность В облаке. Новые bucket по умолчанию приватные, значит, его кто-то открыл.`,
  },
  [
    qx("Under the AWS shared responsibility model, which phrase describes what AWS is responsible for?", "Security of the cloud", [
      ["Security in the cloud", "That is the customer's half: what they put into the cloud and how they configure it.", "Это половина клиента: то, что он кладёт в облако, и как это настроено."],
      ["Security of customer data", "Customer data is always the customer's responsibility, whatever the service.", "Данные клиента — всегда ответственность клиента, какой бы ни был сервис."],
      ["Security of every guest OS", "The guest OS on EC2 is patched and secured by the customer.", "Гостевую ОС на EC2 патчит и защищает клиент."],
    ], "AWS protects the infrastructure that runs all AWS services — security OF the cloud.", "AWS защищает инфраструктуру, на которой работают все сервисы AWS, — безопасность САМОГО облака."),
    qx("A company runs its web application on Amazon EC2. Who must install security patches on the instance's operating system?", "The customer, since the guest OS is theirs", [
      ["AWS, since it owns the physical host", "Owning the host covers the hardware and the hypervisor, not the guest OS inside the instance.", "Владение хостом — это железо и гипервизор, а не гостевая ОС внутри инстанса."],
      ["AWS, through automatic monthly patching", "EC2 does not patch guest operating systems for the customer.", "EC2 не патчит гостевые ОС за клиента."],
      ["Nobody, because EC2 images are always current", "An AMI is a snapshot in time; it gets outdated and needs patching.", "AMI — снимок на момент создания; он устаревает и требует патчей."],
    ], "On IaaS such as EC2 the guest OS, with its updates and security patches, is security IN the cloud.", "В IaaS, например EC2, гостевая ОС с обновлениями и патчами — безопасность В облаке, то есть задача клиента."),
    qx("Which task is AWS's responsibility no matter which AWS service is used?", "Physical security of the data centers", [
      ["Configuring security group rules", "Security group rules are written by the customer.", "Правила security groups пишет клиент."],
      ["Encrypting the customer's data stored at rest", "Choosing and configuring encryption is part of the customer's half.", "Выбор и настройка шифрования — часть половины клиента."],
      ["Rotating IAM user passwords", "Account management with IAM is the customer's job.", "Управление аккаунтом через IAM — задача клиента."],
    ], "Guards, access control, surveillance and disk destruction in data centers are always security OF the cloud.", "Охрана, контроль доступа, видеонаблюдение и уничтожение дисков в дата-центрах — всегда безопасность САМОГО облака."),
    qx("Which statement describes the responsibilities of customers who use a fully managed AWS database service?", "They design data structures and manage access controls", [
      ["They provision, scale, patch and back up the database hosts", "Those operational tasks are exactly what AWS takes over in a fully managed service.", "Именно эти операционные задачи AWS берёт на себя в полностью управляемом сервисе."],
      ["They install antivirus on the database servers' OS", "Customers have no access to the OS of a fully managed database; AWS secures it.", "У клиента нет доступа к ОС полностью управляемой базы; её защищает AWS."],
      ["They replace failed disks in the database hosts", "Hardware is always AWS's side of the model.", "Оборудование — всегда сторона AWS."],
    ], "With a fully managed database AWS handles provisioning, patching and backups; the data model and who may access it stay with the customer.", "В полностью управляемой базе AWS выделяет ресурсы, ставит патчи и делает бэкапы; модель данных и доступ к ней остаются за клиентом."),
    qx("A team runs Oracle Database on Amazon EC2 instead of Amazon RDS. Who applies Oracle patches and upgrades?", "The team, as with any software on EC2", [
      ["AWS, as with any managed database engine", "The engine is not managed here — the team installed it on its own instance.", "Здесь движок не управляемый: команда сама поставила его на свой инстанс."],
      ["Oracle, through the AWS Support plan", "Neither Oracle nor AWS Support patches software inside a customer's instance.", "Ни Oracle, ни AWS Support не ставят патчи ПО внутри инстанса клиента."],
      ["AWS for minor versions, the team for major", "A split like that resembles RDS; on EC2 every patch is the team's.", "Такое деление похоже на RDS; на EC2 любые патчи — задача команды."],
    ], "Software installed on EC2 is entirely the customer's to patch; on RDS, AWS would patch the engine.", "ПО на EC2 полностью патчит клиент; на RDS движок патчил бы AWS."),
    qx("Which pair of tasks is entirely the customer's responsibility on Amazon EC2?", "Security group rules and guest OS patches", [
      ["Hypervisor updates and guest OS patches", "The hypervisor belongs to AWS's virtualization layer.", "Гипервизор — часть слоя виртуализации AWS."],
      ["Data center access and security group rules", "Physical access to data centers is controlled by AWS.", "Физический доступ в дата-центры контролирует AWS."],
      ["Network cabling and IAM user permissions", "Cabling is part of AWS's network infrastructure.", "Кабели — часть сетевой инфраструктуры AWS."],
    ], "Security groups and the guest OS are both configured by the customer — security IN the cloud.", "Security groups и гостевую ОС настраивает клиент — это безопасность В облаке."),
    qx("Which item belongs to 'security of the cloud'?", "The hypervisor that isolates instances", [
      ["The firewall software on an instance", "A host-based firewall inside the instance is configured by the customer.", "Firewall внутри инстанса настраивает клиент."],
      ["The IAM policies attached to users", "Account management with IAM is the customer's job.", "Управление аккаунтом через IAM — задача клиента."],
      ["The encryption setting of an S3 bucket", "Choosing and configuring encryption is security in the cloud.", "Выбор и настройка шифрования — безопасность в облаке."],
    ], "The virtualization layer is part of the software infrastructure that AWS protects.", "Слой виртуализации — часть программной инфраструктуры, которую защищает AWS."),
    qx("A team moves an API from Amazon EC2 to AWS Lambda. What happens to the team's share of security work?", "It shrinks to code, data and permissions", [
      ["It grows, as serverless code is less isolated", "Lambda functions are isolated by AWS; the customer's share shrinks.", "Функции Lambda изолирует AWS; доля клиента уменьшается."],
      ["It stays the same, as the model is fixed", "The line moves with the service type; it is not fixed.", "Граница сдвигается вместе с типом сервиса; она не фиксирована."],
      ["It disappears, as AWS secures the code too", "The function code, its data and its permissions remain the customer's.", "Код функции, её данные и права остаются за клиентом."],
    ], "With a managed (PaaS-style) service AWS also runs the OS and runtime, so the customer focuses on code, data and permissions.", "В управляемом сервисе (PaaS) AWS отвечает ещё и за ОС и среду выполнения, а клиент — за код, данные и права."),
    qx("Which list contains only infrastructure-as-a-service (IaaS) examples in the AWS model?", "Amazon EC2, Amazon EBS, Amazon VPC", [
      ["AWS Lambda, Amazon RDS, Elastic Beanstalk", "These are PaaS examples: AWS also runs the OS and the platform.", "Это примеры PaaS: AWS ведёт ещё и ОС, и платформу."],
      ["AWS Trusted Advisor, AWS Shield, Amazon Chime", "These are SaaS-style services that the customer simply uses.", "Это сервисы в стиле SaaS, которыми клиент просто пользуется."],
      ["Amazon S3, AWS Lambda, AWS Shield", "Lambda is PaaS and Shield is SaaS-style, so the list is mixed.", "Lambda — PaaS, а Shield — сервис в стиле SaaS, так что список смешанный."],
    ], "EC2, EBS and VPC give the customer control over compute, storage and networking — and the most security work.", "EC2, EBS и VPC дают клиенту контроль над вычислениями, хранилищем и сетью — и больше всего работы по безопасности."),
    qx("An employee makes an S3 bucket with customer records public, and the data leaks. Who is accountable under the model?", "The customer, who set the bucket's access", [
      ["AWS, because S3 is a managed service", "Managed means AWS runs the storage; access settings are still the customer's.", "Управляемый — значит, хранилище ведёт AWS; настройки доступа всё равно у клиента."],
      ["AWS, because it should block such settings", "AWS offers Block Public Access, but turning it off was the customer's choice.", "AWS даёт Block Public Access, но выключил его клиент."],
      ["Both equally, because S3 is fully managed", "The split is not 50/50; bucket permissions are fully the customer's.", "Деление не пополам: права на bucket полностью у клиента."],
    ], "Bucket policies, ACLs and public access settings are security IN the cloud; new buckets are private by default.", "Политики bucket, ACL и настройки публичного доступа — безопасность В облаке; новые bucket по умолчанию приватные."),
    qx("Which responsibility stays with the customer whichever AWS service they use?", "Their data and who is allowed to access it", [
      ["Patching the OS that runs under the service", "With managed services AWS patches the OS.", "В управляемых сервисах ОС патчит AWS."],
      ["Securing the cabling between Availability Zones", "Network cabling is AWS's infrastructure.", "Кабели — инфраструктура AWS."],
      ["Backing up the hypervisor configuration", "The hypervisor is AWS's software layer.", "Гипервизор — программный слой AWS."],
    ], "Even with SaaS-style services the customer decides what data goes in and who can use it.", "Даже в сервисах типа SaaS клиент решает, какие данные туда попадут и кто ими пользуется."),
    qx("A database moves from Amazon EC2 to Amazon RDS. Which task moves from the customer to AWS?", "Applying OS and database engine patches", [
      ["Choosing which database users may connect", "Database access control stays with the customer on RDS.", "Контроль доступа к базе на RDS остаётся у клиента."],
      ["Designing the tables and indexes", "The data model is always designed by the customer.", "Модель данных всегда проектирует клиент."],
      ["Deciding which data is sensitive", "Data classification is part of the customer's data responsibility.", "Классификация данных — часть ответственности клиента за данные."],
    ], "On RDS, AWS patches the OS and the engine, provisions storage and runs automated backups.", "На RDS AWS патчит ОС и движок, выделяет хранилище и делает автоматические бэкапы."),
    qx("Who keeps one customer's network traffic isolated from another customer's on shared AWS hardware?", "AWS, through its own infrastructure", [
      ["Each customer, using security groups", "Security groups filter traffic to the customer's own instances; tenant isolation is below them.", "Security groups фильтруют трафик к инстансам самого клиента; изоляция клиентов друг от друга — уровнем ниже."],
      ["Each customer, using network ACL rules", "Network ACLs filter a subnet's traffic; they do not separate AWS tenants.", "Network ACLs фильтруют трафик подсети; клиентов AWS друг от друга они не отделяют."],
      ["The customers sharing the same host", "Customers cannot even see who shares their host; isolation is the hypervisor's job.", "Клиенты даже не видят, с кем делят хост; изоляция — работа гипервизора."],
    ], "Isolation between customers is provided by AWS's hypervisor and network infrastructure — security OF the cloud.", "Изоляцию клиентов друг от друга обеспечивают гипервизор и сеть AWS — безопасность САМОГО облака."),
    qx("Where can a compliance officer download AWS's SOC and PCI reports on demand?", "AWS Artifact", [
      ["AWS Config", "AWS Config records and evaluates resource configurations; it holds no AWS audit reports.", "AWS Config записывает и проверяет конфигурации ресурсов; отчётов аудита AWS в нём нет."],
      ["AWS CloudTrail", "CloudTrail logs API calls in the customer's account, not AWS's audit reports.", "CloudTrail журналирует вызовы API в аккаунте клиента, а не отчёты аудита AWS."],
      ["AWS Trusted Advisor", "Trusted Advisor gives best-practice checks, not compliance reports.", "Trusted Advisor даёт проверки по лучшим практикам, а не отчёты о соответствии."],
    ], "AWS Artifact is the self-service portal for AWS security and compliance reports (SOC, PCI, ISO) and select agreements.", "AWS Artifact — портал самообслуживания с отчётами AWS о безопасности и соответствии (SOC, PCI, ISO) и некоторыми соглашениями."),
    qx("A retailer's app runs on AWS infrastructure that holds a PCI DSS attestation. What does this mean for the retailer?", "Its own app still needs its own PCI assessment", [
      ["The app automatically becomes PCI compliant", "The attestation covers AWS's layer, not the customer's code and settings.", "Аттестация покрывает слой AWS, а не код и настройки клиента."],
      ["Card data no longer needs to be encrypted", "Encrypting card data is still the customer's job and a PCI requirement.", "Шифровать данные карт — всё ещё задача клиента и требование PCI."],
      ["The retailer must avoid storing any card data", "The attestation forbids nothing; it means the infrastructure was assessed.", "Аттестация ничего не запрещает; она значит, что инфраструктура проверена."],
    ], "Compliance is shared too: AWS proves its infrastructure, and the customer must make its own workload compliant.", "Соответствие тоже общее: AWS подтверждает свою инфраструктуру, а клиент должен привести к стандарту свою нагрузку."),
    qx("Which kind of AWS compliance program is ISO/IEC 27001?", "A certification checked by an independent auditor", [
      ["A privacy law that AWS must follow worldwide", "Laws such as GDPR are a separate category; ISO 27001 is a certification.", "Законы вроде GDPR — отдельная категория; ISO 27001 — сертификация."],
      ["An internal AWS checklist with no outside review", "The point of an ISO certification is an external, independent audit.", "Смысл ISO-сертификации — внешний независимый аудит."],
      ["An industry framework such as the CIS benchmarks", "CIS is an alignment or framework; ISO 27001 is an audited certification.", "CIS — отраслевая рамка; ISO 27001 — сертификация с аудитом."],
    ], "Certifications and attestations such as ISO/IEC 27001, SOC and PCI DSS are assessed by a third-party, independent auditor.", "Сертификации и аттестации вроде ISO/IEC 27001, SOC и PCI DSS проверяет внешний независимый аудитор."),
    qx("Who maintains backup generators, cooling and network links inside AWS data centers?", "AWS, as owner of the physical facilities", [
      ["The customer, by choosing bigger instances", "Instance size has nothing to do with the facility's power and cooling.", "Размер инстанса не связан с питанием и охлаждением здания."],
      ["The customer's internet service provider", "An ISP connects the customer to AWS; it does not run AWS facilities.", "Провайдер соединяет клиента с AWS, но не обслуживает здания AWS."],
      ["AWS and the customer in equal parts", "Customers never touch AWS facilities; this is fully AWS's side.", "Клиенты не касаются зданий AWS; это полностью сторона AWS."],
    ], "Power, cooling, redundant links and physical security of data centers are security OF the cloud.", "Питание, охлаждение, резервные каналы и физическая защита дата-центров — безопасность САМОГО облака."),
    tfx("Configuring security groups is AWS's responsibility, because AWS provides the security group feature.", false,
      "AWS provides the feature, but the rules — which ports and sources are allowed — are configured by the customer.",
      "AWS даёт саму функцию, но правила — какие порты и источники разрешены — настраивает клиент.",
      "'True' confuses providing a tool with using it: port 22 open to the whole world is the customer's mistake, not AWS's.",
      "Ответ «верно» путает предоставление инструмента и его использование: открытый всему миру порт 22 — ошибка клиента, а не AWS."),
    tfx("With Amazon RDS, the customer still decides which database users exist and what each of them may do.", true,
      "Access control and data design stay with the customer even in a fully managed database.",
      "Контроль доступа и проектирование данных остаются у клиента даже в полностью управляемой базе.",
      "'False' assumes AWS manages everything on RDS, but AWS takes over only provisioning, patching and backups.",
      "Ответ «неверно» считает, что на RDS всем управляет AWS, но AWS берёт только выделение ресурсов, патчи и бэкапы."),
    qx("Which statement about SaaS-style AWS services such as AWS Trusted Advisor is correct?", "The customer runs none of their infrastructure", [
      ["The customer patches the servers they run on", "SaaS servers are invisible to the customer; AWS runs and patches them.", "Серверы SaaS клиенту не видны; их ведёт и патчит AWS."],
      ["The customer sets up the hypervisor beneath them", "The hypervisor is always AWS's layer.", "Гипервизор — всегда слой AWS."],
      ["They must be launched into the customer's subnets", "SaaS-style services are not deployed into the customer's VPC.", "Сервисы в стиле SaaS не разворачиваются в VPC клиента."],
    ], "SaaS is centrally hosted and used through a browser, app or API; the customer manages no infrastructure behind it.", "SaaS размещён централизованно, им пользуются через браузер, приложение или API; инфраструктурой за ним клиент не управляет."),
  ],
);

/* ─────────────── Part 2 — IAM identities, the root user and MFA ─────────────── */

const p2 = part(
  "cc-l7-p2",
  { en: "IAM: users, groups, roles and the root user", ru: "IAM: пользователи, группы, роли и root user" },
  {
    en: `## What IAM does
**AWS Identity and Access Management (IAM)** controls **who** can access **which** AWS resources and **how** — which actions they may perform.
- A **resource** is anything in the account you can work with: an EC2 instance, an S3 bucket, a DynamoDB table.
- IAM is a **centralized** way to create identities and manage their permissions, integrated with most AWS services.
- IAM is offered at **no additional charge**.
- IAM is **global**: users, groups, roles and policies apply in **all Regions**, so no Region is chosen for them.
- **Authentication** answers "who are you?" (credentials); **authorization** answers "what may you do?" (policies).
## The four building blocks
| Component | What it is | Example |
|---|---|---|
| IAM user | a person or application that authenticates with **long-term credentials** | an employee, a CI script |
| IAM group | a collection of IAM users that get **identical permissions** | Developers, S3-Support |
| IAM policy | a JSON document that allows or denies actions on resources | AmazonS3ReadOnlyAccess |
| IAM role | an identity with permissions but **no long-term credentials**; it is **assumed** and gives **temporary** credentials | an EC2 instance reading S3 |
## Two ways to authenticate
| Access type | Credentials | Used for |
|---|---|---|
| Programmatic access | **access key ID + secret access key** | AWS CLI, SDKs, direct API calls |
| AWS Management Console access | **account ID or alias + IAM user name + password**, plus an MFA code if enabled | the web console |
- One IAM user can have **either or both** kinds of access.
- The secret access key is shown **only once**, at creation; a lost one is replaced by a new key pair.
- IAM users sign in through the account's own **sign-in URL**:
= https://123456789012.signin.aws.amazon.com/console
> Exam trap: access keys → **programmatic** access (CLI, SDK, API); password → **console**. Never the other way round.
## IAM is not for OS or application logins
IAM controls access to **AWS resources and API actions**. It is **not** meant for signing users in to an **operating system** or to **your own application**.
- Logging in to a Linux EC2 instance uses an **SSH key pair** and OS user accounts; for Windows, the administrator password is decrypted with the key pair.
- Sign-up and sign-in for the end users of a web or mobile app is the job of **Amazon Cognito** (social logins such as Google or Facebook, enterprise identity providers through SAML 2.0) or of the app's own identity system.
> Exam trap: "IAM is appropriate for OS and application authentication" — **False**.
## No permissions by default
- A new IAM user **has no permissions** until a policy grants them — directly or through a group.
- Give only what the job needs — the **principle of least privilege**.
## IAM groups
- Permissions are granted by attaching policies to the group; every member inherits them.
- A user can belong to **several groups** (up to 10); a group contains **only users**.
- Groups **cannot be nested** — no group inside a group.
- There is **no default group** that automatically includes every user.
- A group is **not an identity**: it cannot sign in and cannot be the principal in a resource-based policy.
## IAM roles: temporary access
An **IAM role** is an IAM identity with permission policies, but unlike a user:
- it is **not tied to one person** — it is meant to be **assumed** by whoever needs it;
- it has **no password and no access keys**; whoever assumes it gets **temporary security credentials** that **expire automatically**.
Who can assume a role:
- an IAM user in the **same or another AWS account** (cross-account access);
- an **AWS service**, for example an **EC2 instance** or a **Lambda function**;
- an **external user** signed in through an identity provider compatible with **SAML 2.0 or OpenID Connect** (federation), or through a custom identity broker.
> The IAM entity **specifically designed to provide temporary access** is the **IAM role**.
## Example: an application on EC2 needs DynamoDB or S3
- Write a policy that allows only the needed actions on the needed table or bucket.
- Attach it to a role that **EC2 is trusted to assume**, and attach the role to the instance (through an **instance profile**).
- The SDK in the application picks up **temporary credentials** automatically, and AWS rotates them.
| Option | Verdict |
|---|---|
| Attach an IAM role to the EC2 instance | **most secure** — no stored secrets, credentials rotate on their own |
| Store an IAM user's access keys on the instance or in code | risky — long-term keys leak through snapshots, Git, logs |
| Use the root user's credentials | worst — unlimited access to the whole account |
| A script that copies fresh keys onto the instance | reinvents roles badly — secrets are still stored |
## The root user
Creating an AWS account creates the **AWS account root user** — the email address and password used to open the account.
- It has **complete, unrestricted access** to all resources and billing, and IAM policies **cannot limit** it.
- It is **not for everyday tasks**, not even administrative ones.
Securing a new account, step by step:
- **Stop using the root user** as soon as possible: create an admin group with full permissions and an IAM user in it, and sign in as that user from then on.
- **Delete the root user's access keys** if any exist, and do not create new ones.
- **Enable MFA on the root user** and on IAM users; set a **password policy**.
- **Store the root credentials securely** and use them only for tasks that need root — for example **closing the account** or **changing the AWS Support plan**.
- Turn on **AWS CloudTrail** to track activity and a **billing report** (AWS Cost and Usage Report) to track spending.
> Scenario: a manager signs in as root every day. Best practice: **create IAM users for daily tasks, enable MFA on root and store the root credentials securely** — never share the root password among admins.
## Multi-factor authentication (MFA)
**MFA** adds a second factor: besides the user name and password, the user enters a **one-time code** from a device they have.
| MFA option | Example |
|---|---|
| Virtual MFA app | an authenticator app on a phone (Google Authenticator, Authy) |
| U2F / FIDO security key | a USB key such as YubiKey |
| Hardware MFA device | a key fob or display card that shows codes |
?? A script on a laptop needs to list S3 buckets with the AWS CLI. Which kind of credentials does it use?
?= Programmatic access: an access key ID and a secret access key — never the root user's keys.
?? Why is an IAM role safer than access keys saved on an EC2 instance?
?= The role gives temporary credentials that rotate and expire automatically; nothing long-term is stored on the instance, so there is nothing to leak.
?? Name three things to do right after creating a new AWS account.
?= Enable MFA on the root user, create an IAM admin user in an admin group for daily work, and delete any root access keys.`,
    ru: `## Что делает IAM
**AWS Identity and Access Management (IAM)** определяет, **кто** может обращаться к **каким** ресурсам AWS и **как** — какие действия разрешены.
- **Ресурс (resource)** — всё в аккаунте, с чем можно работать: инстанс EC2, S3 bucket, таблица DynamoDB.
- IAM — **централизованный** способ создавать учётные сущности и управлять их правами; он интегрирован с большинством сервисов AWS.
- IAM предоставляется **без дополнительной платы**.
- IAM **глобальный**: пользователи, группы, роли и политики действуют **во всех регионах**, регион для них не выбирают.
- **Аутентификация (authentication)** отвечает на вопрос «кто вы?» (учётные данные); **авторизация (authorization)** — «что вам можно?» (политики).
## Четыре строительных блока
| Компонент | Что это | Пример |
|---|---|---|
| IAM user (пользователь) | человек или приложение, которое входит с **долгосрочными учётными данными** | сотрудник, CI-скрипт |
| IAM group (группа) | набор пользователей IAM с **одинаковыми правами** | Developers, S3-Support |
| IAM policy (политика) | JSON-документ, который разрешает или запрещает действия над ресурсами | AmazonS3ReadOnlyAccess |
| IAM role (роль) | сущность с правами, но **без долгосрочных учётных данных**; её **принимают (assume)**, и она даёт **временные** учётные данные | инстанс EC2, читающий S3 |
## Два способа аутентификации
| Тип доступа | Учётные данные | Для чего |
|---|---|---|
| Programmatic access (программный) | **access key ID + secret access key** | AWS CLI, SDK, прямые вызовы API |
| Доступ к AWS Management Console | **ID аккаунта или alias + имя пользователя IAM + пароль**, плюс код MFA, если он включён | веб-консоль |
- У одного пользователя IAM может быть **любой из двух видов доступа или оба**.
- Secret access key показывают **только один раз**, при создании; потерянный заменяют новой парой ключей.
- Пользователи IAM входят через собственный **sign-in URL** аккаунта:
= https://123456789012.signin.aws.amazon.com/console
> Ловушка экзамена: ключи доступа → **программный** доступ (CLI, SDK, API); пароль → **консоль**. Никогда не наоборот.
## IAM — не для входа в ОС и приложения
IAM управляет доступом к **ресурсам AWS и действиям API**. Он **не** предназначен для входа пользователей в **операционную систему** или в **ваше собственное приложение**.
- Вход в Linux-инстанс EC2 — через **SSH key pair** и учётные записи ОС; для Windows пароль администратора расшифровывают с помощью key pair.
- Регистрация и вход конечных пользователей веб- или мобильного приложения — задача **Amazon Cognito** (вход через соцсети вроде Google или Facebook, корпоративные провайдеры через SAML 2.0) или собственной системы приложения.
> Ловушка экзамена: «IAM is appropriate for OS and application authentication» — **False (неверно)**.
## По умолчанию прав нет
- У нового пользователя IAM **нет никаких прав**, пока их не выдаст политика — напрямую или через группу.
- Выдают только то, что нужно для работы, — **принцип наименьших привилегий (least privilege)**.
## Группы IAM
- Права выдаются политиками, прикреплёнными к группе; каждый участник их наследует.
- Пользователь может состоять в **нескольких группах** (до 10); в группе — **только пользователи**.
- Группы **нельзя вкладывать** друг в друга.
- **Группы по умолчанию**, куда автоматически попадают все пользователи, **нет**.
- Группа — **не учётная сущность (identity)**: она не может войти в систему и не может быть principal в resource-based политике.
## Роли IAM: временный доступ
**Роль IAM (IAM role)** — сущность IAM с политиками прав, но, в отличие от пользователя:
- она **не привязана к одному человеку** — её **принимает (assume)** тот, кому она нужна;
- у неё **нет пароля и ключей доступа**; тот, кто её принял, получает **временные учётные данные (temporary security credentials)**, которые **истекают сами**.
Кто может принять роль:
- пользователь IAM из **того же или другого аккаунта AWS** (cross-account доступ);
- **сервис AWS**, например **инстанс EC2** или **функция Lambda**;
- **внешний пользователь**, вошедший через провайдера удостоверений с **SAML 2.0 или OpenID Connect** (федерация, federation), или через собственный identity broker.
> Сущность IAM, **специально предназначенная для временного доступа**, — **роль IAM**.
## Пример: приложению на EC2 нужен DynamoDB или S3
- Пишут политику, которая разрешает только нужные действия над нужной таблицей или bucket.
- Прикрепляют её к роли, которую **разрешено принимать EC2**, а роль — к инстансу (через **instance profile**).
- SDK в приложении сам подхватывает **временные учётные данные**, а AWS их ротирует.
| Вариант | Оценка |
|---|---|
| Прикрепить роль IAM к инстансу EC2 | **самый безопасный** — секреты не хранятся, учётные данные ротируются сами |
| Хранить ключи доступа пользователя IAM на инстансе или в коде | рискованно — долгосрочные ключи утекают через снапшоты, Git, логи |
| Использовать учётные данные root user | хуже всего — неограниченный доступ ко всему аккаунту |
| Скрипт, который копирует свежие ключи на инстанс | плохо изобретает роли заново — секреты всё равно хранятся |
## Root user
При создании аккаунта AWS создаётся **AWS account root user** — адрес почты и пароль, с которыми аккаунт открывали.
- У него **полный неограниченный доступ** ко всем ресурсам и к оплате, и политики IAM **не могут его ограничить**.
- Он **не для повседневной работы**, даже административной.
Защита нового аккаунта по шагам:
- **Перестать пользоваться root user** как можно скорее: создать группу администраторов с полными правами и пользователя IAM в ней и дальше входить под ним.
- **Удалить ключи доступа root user**, если они есть, и не создавать новых.
- **Включить MFA для root user** и для пользователей IAM; задать **политику паролей (password policy)**.
- **Надёжно хранить учётные данные root** и использовать их только для задач, где нужен root, — например **закрыть аккаунт** или **сменить план AWS Support**.
- Включить **AWS CloudTrail**, чтобы отслеживать действия, и **отчёт о расходах** (AWS Cost and Usage Report), чтобы следить за затратами.
> Сценарий: менеджер каждый день входит под root. Лучшая практика: **создать пользователей IAM для ежедневной работы, включить MFA на root и надёжно спрятать учётные данные root** — и никогда не раздавать пароль root администраторам.
## Многофакторная аутентификация (MFA)
**MFA** добавляет второй фактор: кроме имени пользователя и пароля нужно ввести **одноразовый код** с устройства, которое есть у пользователя.
| Вариант MFA | Пример |
|---|---|
| Virtual MFA app (приложение) | приложение-аутентификатор на телефоне (Google Authenticator, Authy) |
| U2F / FIDO security key | USB-ключ, например YubiKey |
| Hardware MFA device (аппаратное) | брелок или карта с экраном, показывающие коды |
?? Скрипту на ноутбуке нужно получить список S3 bucket через AWS CLI. Какие учётные данные он использует?
?= Программный доступ: access key ID и secret access key — и никогда не ключи root user.
?? Почему роль IAM безопаснее ключей доступа, сохранённых на инстансе EC2?
?= Роль даёт временные учётные данные, которые сами ротируются и истекают; на инстансе ничего долгосрочного не хранится, поэтому утекать нечему.
?? Назовите три действия сразу после создания нового аккаунта AWS.
?= Включить MFA для root user, создать пользователя-администратора IAM в группе администраторов для ежедневной работы и удалить ключи доступа root, если они есть.`,
  },
  [
    qx("IAM offers users, groups, roles and policies. Which of them is specifically designed to provide temporary access to permissions?", "IAM roles", [
      ["IAM users", "Users have long-term credentials: a password and/or access keys.", "У пользователей долгосрочные учётные данные: пароль и/или ключи доступа."],
      ["IAM groups", "A group only collects users to share permissions; it has no credentials at all.", "Группа только объединяет пользователей ради общих прав; учётных данных у неё нет."],
      ["IAM policies", "A policy is a permissions document; it gives no credentials by itself.", "Политика — документ с правами; сама она учётных данных не даёт."],
    ], "A role is assumed when needed and returns temporary security credentials that expire automatically.", "Роль принимают (assume) по необходимости, и она выдаёт временные учётные данные, которые истекают сами."),
    tfx("AWS IAM is appropriate for operating system and application authentication.", false,
      "IAM controls access to AWS resources and API actions. OS logins use OS accounts and SSH key pairs; app users are handled by Amazon Cognito or the app's own identity system.",
      "IAM управляет доступом к ресурсам AWS и действиям API. Вход в ОС — через учётные записи ОС и SSH-ключи; пользователи приложения — через Amazon Cognito или собственную систему приложения.",
      "'True' mixes up the layers: an IAM user cannot log in to a Linux shell or to a website's login form.",
      "Ответ «верно» смешивает уровни: пользователь IAM не войдёт ни в shell Linux, ни в форму входа на сайте."),
    qx("Your application on EC2 needs to read and write a DynamoDB table. What is the MOST secure way to give it credentials?", "Attach an IAM role with the DynamoDB access to the instance", [
      ["Save an IAM user's access keys in the app's config file", "Long-term keys on disk can leak through snapshots, backups or Git.", "Долгосрочные ключи на диске могут утечь через снапшоты, бэкапы или Git."],
      ["Use the root user's access keys for full DynamoDB access", "Root keys give unlimited access to the whole account; they should not even exist.", "Ключи root дают неограниченный доступ ко всему аккаунту; их вообще не должно быть."],
      ["Run a Lambda function that copies new keys to the instance", "That reinvents roles badly: keys are still stored on the instance.", "Это плохое изобретение ролей заново: ключи всё равно лежат на инстансе."],
    ], "An instance role delivers temporary, automatically rotated credentials to the app — nothing long-term is stored.", "Роль инстанса выдаёт приложению временные, автоматически ротируемые учётные данные — ничего долгосрочного не хранится."),
    qx("A script on a developer's laptop calls the AWS CLI. Which credentials does it need?", "An access key ID and a secret access key", [
      ["An IAM user name and a console password", "A password is for console sign-in, not for the CLI.", "Пароль нужен для входа в консоль, а не для CLI."],
      ["The 12-digit account ID and an MFA code", "The account ID and MFA code alone do not sign API requests.", "Одних ID аккаунта и кода MFA недостаточно, чтобы подписывать запросы API."],
      ["An EC2 key pair used for SSH logins", "A key pair logs in to an instance's OS, not to the AWS API.", "Key pair нужен для входа в ОС инстанса, а не в API AWS."],
    ], "Programmatic access (CLI, SDK, API) uses an access key ID and a secret access key.", "Программный доступ (CLI, SDK, API) использует access key ID и secret access key."),
    qx("What does an IAM user enter to sign in to the AWS Management Console?", "Account ID or alias, user name and password", [
      ["An access key ID and a secret access key", "Access keys are for programmatic access, not for the console form.", "Ключи доступа — для программного доступа, а не для формы входа в консоль."],
      ["The root email address and an SSH key", "The root email signs in the root user, and SSH keys are for instances.", "По почте root входит root user, а SSH-ключи — для инстансов."],
      ["Only the code shown on a registered MFA device", "An MFA code is an extra factor, added to the password, never a replacement.", "Код MFA — дополнительный фактор к паролю, а не его замена."],
    ], "Console access needs the 12-digit account ID (or its alias), the IAM user name and the password — plus an MFA code if enabled.", "Для консоли нужны 12-значный ID аккаунта (или alias), имя пользователя IAM и пароль — плюс код MFA, если он включён."),
    qx("A new IAM user has just been created and added to no group. What can the user do?", "Nothing until a policy grants permissions", [
      ["Read-only actions in every service of the account", "There is no default read-only access; a new user has no permissions.", "Доступа «только чтение» по умолчанию нет; у нового пользователя прав нет."],
      ["Everything except billing and support", "That would be close to admin rights, which must be granted explicitly.", "Это почти права администратора, а их нужно выдать явно."],
      ["Whatever the root user is allowed to do", "Root's unrestricted access is never inherited by IAM users.", "Неограниченный доступ root никогда не наследуется пользователями IAM."],
    ], "By default IAM users have no permissions; everything starts from an implicit deny.", "По умолчанию у пользователей IAM нет прав; всё начинается с неявного запрета."),
    qx("Which statement about IAM groups is correct?", "A user can belong to several groups at once", [
      ["A group can contain other groups", "Groups cannot be nested; a group contains only users.", "Группы нельзя вкладывать; в группе только пользователи."],
      ["Every new user joins a default group", "There is no default group that automatically includes all users.", "Группы по умолчанию, куда автоматически попадают все, нет."],
      ["A group can be the principal in a bucket policy", "A group is not an identity, so it cannot be named as a principal.", "Группа — не identity, поэтому её нельзя указать как principal."],
    ], "A user can be a member of several groups (up to 10) and gets the permissions of all of them.", "Пользователь может состоять в нескольких группах (до 10) и получает права всех этих групп."),
    qx("Twelve developers need exactly the same permissions. What is the best way to grant them?", "Add them to one group and attach the policy to it", [
      ["Attach a copy of an inline policy to each user", "Twelve copies are hard to keep in sync and to audit.", "Двенадцать копий трудно синхронизировать и проверять."],
      ["Create one IAM user and share it among all twelve", "Shared users hide who did what and break accountability.", "Общий пользователь скрывает, кто что сделал, и ломает подотчётность."],
      ["Give them the root credentials protected by MFA", "Root must not be used for daily work, with or without MFA.", "Root нельзя использовать для ежедневной работы — с MFA или без."],
    ], "Groups exist exactly for this: one policy on the group, and every member inherits it.", "Группы ровно для этого: одна политика на группе, и её наследует каждый участник."),
    qx("In which Region are IAM users, groups and roles created?", "None: IAM applies across all Regions", [
      ["In the Region closest to the users", "IAM is not Regional; latency to users does not matter here.", "IAM не региональный; близость к пользователям здесь роли не играет."],
      ["Separately in every Region they work in", "One IAM user works in every Region; nothing is duplicated.", "Один пользователь IAM работает во всех регионах; ничего не дублируется."],
      ["In us-east-1, then copied to other Regions", "There is no copying step; IAM is a global service.", "Никакого копирования нет; IAM — глобальный сервис."],
    ], "IAM is a global service: its identities and policies are valid in every Region.", "IAM — глобальный сервис: его сущности и политики действуют во всех регионах."),
    qx("How does an IAM role differ from an IAM user?", "It has no long-term credentials and is assumed", [
      ["It always belongs to exactly one person", "A user is tied to one person; a role is meant to be assumed by many.", "К одному человеку привязан пользователь; роль могут принимать многие."],
      ["It signs in with a password and an MFA code", "Roles have no password; they are assumed and give temporary credentials.", "У ролей нет пароля; их принимают, и они дают временные учётные данные."],
      ["It can be used only in the Region where it was created", "Roles, like all IAM entities, are global.", "Роли, как и все сущности IAM, глобальные."],
    ], "A role has no password or access keys; whoever assumes it receives temporary security credentials.", "У роли нет пароля и ключей; тот, кто её принял, получает временные учётные данные."),
    qx("Employees already sign in through the company's SAML 2.0 identity provider. They need AWS access without separate IAM users. What fits?", "Federation, where they assume an IAM role", [
      ["Create an IAM user for every employee", "That is exactly the separate-users setup the company wants to avoid.", "Именно отдельных пользователей компания и хочет избежать."],
      ["Share one IAM user among all employees", "A shared user breaks accountability and is a security risk.", "Общий пользователь ломает подотчётность и опасен."],
      ["Add the identity provider to an IAM group", "Groups hold IAM users only; an identity provider cannot be a member.", "В группах только пользователи IAM; провайдер удостоверений не может быть участником."],
    ], "Federated users signed in through SAML 2.0 or OpenID Connect assume a role and get temporary credentials.", "Федеративные пользователи, вошедшие через SAML 2.0 или OpenID Connect, принимают роль и получают временные учётные данные."),
    qx("Your manager logs in to AWS with the root user every day. What is the best security practice?", "IAM users for daily work, MFA on root, root locked away", [
      ["Share the root credentials with every administrator on the team", "Sharing root multiplies the risk and hides who did what.", "Раздавать root — умножать риск и скрывать, кто что сделал."],
      ["Keep using root, but change its password every single week", "A new password does not fix the core problem: root is used daily.", "Новый пароль не решает главную проблему: root используют каждый день."],
      ["Create root access keys and use only the AWS CLI", "Root access keys are the opposite of best practice; they should be deleted.", "Ключи доступа root — противоположность лучшей практике; их надо удалить."],
    ], "Create IAM users (with an admin group) for daily tasks, enable MFA on the root user and store its credentials securely.", "Создать пользователей IAM (с группой администраторов) для ежедневной работы, включить MFA на root и надёжно хранить его учётные данные."),
    qx("Which task genuinely requires signing in as the root user?", "Closing the whole AWS account", [
      ["Launching an EC2 instance", "Any IAM user with EC2 permissions can launch instances.", "Запускать инстансы может любой пользователь IAM с правами на EC2."],
      ["Creating an IAM admin group", "An IAM user with IAM permissions can create groups.", "Группы может создавать пользователь IAM с правами на IAM."],
      ["Viewing CloudTrail event history", "Any user allowed to read CloudTrail can view the history.", "Историю видит любой пользователь с правом читать CloudTrail."],
    ], "A few tasks need root — closing the account, changing the AWS Support plan, changing the root email; everything else is done by IAM users.", "Root нужен для немногих задач — закрыть аккаунт, сменить план AWS Support, сменить почту root; всё остальное делают пользователи IAM."),
    qx("What should be done with access keys of the root user?", "Delete them and do not create new ones", [
      ["Put them into the app's source code", "Keys in code leak easily, and root keys would expose everything.", "Ключи в коде легко утекают, а ключи root открыли бы всё."],
      ["Rotate them every 90 days and keep using them", "Rotation is good for IAM user keys; root should have no keys at all.", "Ротация хороша для ключей пользователей IAM; у root ключей быть не должно вовсе."],
      ["Share them only with the security team", "Sharing root keys, even with a few people, keeps the risk.", "Делиться ключами root даже с немногими — риск остаётся."],
    ], "Root access keys give unrestricted programmatic access; best practice is to delete them.", "Ключи доступа root дают неограниченный программный доступ; лучшая практика — удалить их."),
    qx("What does MFA add to an AWS sign-in?", "A one-time code from a device the user owns", [
      ["A second password that the user picks and memorises", "A second password is the same factor (something you know), not MFA.", "Второй пароль — тот же фактор («что вы знаете»), а не MFA."],
      ["A check of the user's IP address only", "IP checks can be added with policy conditions, but that is not MFA.", "Проверку IP можно добавить условием политики, но это не MFA."],
      ["An email confirmation for every API call", "AWS MFA does not confirm calls by email.", "MFA в AWS не подтверждает вызовы по почте."],
    ], "MFA requires a unique code from a device (app, security key or hardware token) in addition to the user name and password.", "MFA требует уникальный код с устройства (приложение, ключ безопасности или аппаратный токен) в дополнение к имени и паролю."),
    qx("Which of these is NOT an MFA option for signing in to AWS?", "An SSH key pair of an EC2 instance", [
      ["A virtual MFA app on a smartphone", "Authenticator apps are virtual MFA devices.", "Приложения-аутентификаторы — это виртуальные MFA-устройства."],
      ["A U2F security key such as YubiKey", "U2F/FIDO security keys are supported MFA devices.", "Ключи U2F/FIDO — поддерживаемые MFA-устройства."],
      ["A hardware key fob that shows codes", "Hardware tokens are a supported MFA option.", "Аппаратные токены — поддерживаемый вариант MFA."],
    ], "An SSH key pair logs in to an instance's OS; it is not an AWS sign-in factor.", "SSH key pair нужен для входа в ОС инстанса; это не фактор входа в AWS."),
    tfx("An IAM policy in the account can restrict what the AWS account root user is allowed to do.", false,
      "The root user has complete, unrestricted access; IAM policies do not apply to it. Only a service control policy in AWS Organizations can cap a member account's root user.",
      "У root user полный неограниченный доступ, политики IAM на него не действуют. Ограничить root user аккаунта-участника может только service control policy в AWS Organizations.",
      "'True' treats root like an IAM user; that is exactly why root must be protected with MFA and not used daily.",
      "Ответ «верно» считает root обычным пользователем IAM; именно поэтому root защищают MFA и не используют каждый день."),
    qx("The users of your mobile app must sign up and sign in with their Google accounts. Which service fits?", "Amazon Cognito", [
      ["AWS IAM users", "IAM users are for people who work with AWS itself, not for app customers.", "Пользователи IAM — для тех, кто работает с самим AWS, а не для клиентов приложения."],
      ["AWS IAM roles", "Roles give AWS permissions; they are not a sign-up system for app users.", "Роли дают права в AWS; это не система регистрации пользователей приложения."],
      ["AWS Organizations", "Organizations manages AWS accounts, not app users.", "Organizations управляет аккаунтами AWS, а не пользователями приложения."],
    ], "Amazon Cognito adds sign-up, sign-in and access control to web and mobile apps, including Google, Facebook and SAML logins.", "Amazon Cognito добавляет в веб- и мобильные приложения регистрацию, вход и контроль доступа, в том числе через Google, Facebook и SAML."),
    qx("You need a shell on a Linux EC2 instance. What authenticates you to the operating system?", "An SSH key pair and an OS user account", [
      ["Your IAM user name and console password", "Console credentials sign in to AWS, not to the instance's OS.", "Учётные данные консоли — для входа в AWS, а не в ОС инстанса."],
      ["Membership in an IAM group with EC2 access", "IAM permissions control EC2 API actions, not shell logins.", "Права IAM управляют действиями API EC2, а не входом в shell."],
      ["The MFA code of the account root user", "Root MFA protects the AWS account sign-in, not the OS.", "MFA root защищает вход в аккаунт AWS, а не в ОС."],
    ], "OS authentication uses OS accounts and SSH key pairs — IAM is not meant for OS logins.", "Вход в ОС — через учётные записи ОС и SSH key pair; IAM для входа в ОС не предназначен."),
    qx("An IAM user lost the secret access key soon after creating it. What is the right fix?", "Create a new access key and delete the old one", [
      ["Ask AWS Support to show the secret again", "AWS does not store a viewable copy of the secret, so Support cannot show it.", "AWS не хранит секрет в виде, который можно показать, поэтому поддержка не поможет."],
      ["Look it up again on the IAM console's user details page", "The secret is shown only once, at creation.", "Секрет показывают только один раз, при создании."],
      ["Recover it by signing in as the root user", "Even root cannot view an existing secret access key.", "Даже root не может посмотреть существующий secret access key."],
    ], "A secret access key cannot be retrieved later; the fix is a new key pair and deactivating or deleting the lost one.", "Secret access key нельзя получить повторно; решение — новая пара ключей и отключение или удаление потерянной."),
  ],
);

/* ─────────────── Part 3 — IAM policies and Lab 1 ─────────────── */

const p3 = part(
  "cc-l7-p3",
  { en: "IAM policies and Lab 1", ru: "Политики IAM и Lab 1" },
  {
    en: `## What a policy is
An **IAM policy** is a **JSON document** that defines permissions: which **actions** are allowed or denied on which **resources**, and under which **conditions**. A policy does nothing until it is **attached** to an identity or a resource.
## Policy elements
| Element | Meaning | Example |
|---|---|---|
| Version | policy language version | 2012-10-17 |
| Statement | one or more permission blocks | a list of statements |
| Effect | **Allow** or **Deny** | Allow |
| Action | API operations, written service:Action | s3:GetObject, ec2:StopInstances |
| Resource | which resources, by **ARN** (Amazon Resource Name) | arn:aws:s3:::reports-bucket |
| Condition | optional: when the statement applies | source IP range, MFA used, time |
| Principal | **who** gets access — only in resource-based policies | another account or a user ARN |
= {"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Action": ["s3:GetObject", "s3:ListBucket"], "Resource": ["arn:aws:s3:::reports-bucket", "arn:aws:s3:::reports-bucket/*"], "Condition": {"IpAddress": {"aws:SourceIp": "203.0.113.0/24"}}}]}
This statement lets the identity list one bucket and read its objects — and only from the office IP range.
- A wildcard in an action matches many actions at once:
= ec2:Describe*  →  ec2:DescribeInstances, ec2:DescribeVolumes, ec2:DescribeSecurityGroups, …
## Identity-based vs resource-based policies
| | Identity-based policy | Resource-based policy |
|---|---|---|
| Attached to | an IAM user, group or role | a resource, e.g. an S3 bucket (a bucket policy) |
| Says | what **this identity** may do | **who** may do what with **this resource** |
| Principal element | none — the identity it is attached to is the principal | required — names who gets access |
| Kinds | managed or inline | inline only, part of the resource |
| Typical use | give a team or a role its permissions | share a bucket with another account or the public |
## Managed vs inline policies
| Type | Created by | Reuse | Example |
|---|---|---|---|
| **AWS managed** | AWS; customers cannot edit it | attach to many identities in any account | AmazonS3ReadOnlyAccess, AdministratorAccess |
| **Customer managed** | you, in your account | attach to many identities in your account; versioned | ReportsBucketReadOnly |
| **Inline** | you, embedded directly in one user, group or role | **not reusable** — strict one-to-one; deleted together with that identity | EC2-Admin-Policy in Lab 1 |
> Exam phrase: an **inline policy** is "a built-in policy that is **unique to a particular user or group**". "Built-in" means **embedded into** that one identity — not "predefined by AWS" (that would be an AWS managed policy).
- Need to change an AWS managed policy? Copy it into a **customer managed** policy and edit the copy.
## How AWS evaluates a request
@diagram cc7-policy-eval
- By default every request is **denied** — an **implicit deny**.
- If any applicable policy contains a matching **explicit Deny** → **denied**, however many allows exist.
- Otherwise, if some policy contains a matching **explicit Allow** → **allowed**.
- Otherwise → still denied (implicit deny).
> Explicit deny > explicit allow > implicit deny. A Deny always wins.
Example: a user is in group A, which allows all S3 actions, and in group B, which denies s3:DeleteBucket. The user can do everything in S3 **except** delete buckets.
- An implicit deny means "nobody said yes" — adding an Allow fixes it. An explicit deny means "somebody said no" — no Allow can override it.
## Good habits
- **Least privilege**: grant only the actions and resources the task needs.
- Attach policies to **groups** or **roles** rather than to individual users.
- Prefer **managed** policies for reuse; use **inline** only for a strict one-to-one permission that must disappear with its identity.
- Add **Conditions** (MFA, source IP) to sensitive actions.
## Lab 1 — Introduction to AWS IAM
The lab account already contains three users and three groups. The task: put each user into the right group, then sign in as each user and test what works.
@diagram cc7-lab1
| User | Group | Policy on the group | Type | Allowed |
|---|---|---|---|---|
| user-1 | S3-Support | AmazonS3ReadOnlyAccess | AWS managed | view S3 buckets and objects |
| user-2 | EC2-Support | AmazonEC2ReadOnlyAccess | AWS managed | view EC2 resources |
| user-3 | EC2-Admin | EC2-Admin-Policy | **inline** | view, **start and stop** EC2 instances |
The inline policy of EC2-Admin:
= {"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Action": ["ec2:Describe*", "ec2:StartInstances", "ec2:StopInstances"], "Resource": "*"}]}
- **Task 1 — explore**: in the IAM console, look at Users and User groups; the users start with **no groups and no permissions**; open each group's Permissions tab to see its managed or inline policy (Show Policy / JSON).
- **Task 2 — add users to groups**: user-1 → S3-Support, user-2 → EC2-Support, user-3 → EC2-Admin.
- **Task 3 — sign in and test**: copy the **IAM users sign-in URL** from the IAM dashboard, open it in a private browser window and sign in as each user in turn.
| Test | Result | Why |
|---|---|---|
| user-1 opens Amazon S3 | sees the buckets and their contents | S3 read-only allows list and get |
| user-1 opens Amazon EC2 | no instances, "You are not authorized to perform this operation" | no EC2 permissions — implicit deny |
| user-2 opens Amazon EC2 | sees the instance | EC2 read-only allows Describe |
| user-2 tries to stop the instance | error: not authorized | read-only has no StopInstances |
| user-2 opens Amazon S3 | cannot list buckets | no S3 permissions |
| user-3 stops the instance | the instance stops | the inline policy allows StopInstances |
| user-3 tries to terminate it | denied | TerminateInstances is not granted — implicit deny |
> Exam scenario: user-3 can start and stop instances but cannot terminate (delete) them. The most likely reason: **the group's permissions are limited to viewing, starting and stopping — termination is not granted**. It is not an AWS Support lock and not an instance limit.
?? A user's group allows s3:GetObject on all buckets, but a policy attached to the user explicitly denies s3:GetObject on the payroll bucket. Can the user read payroll files?
?= No. An explicit deny overrides any allow.
?? What is the difference between a customer managed policy and an inline policy?
?= A customer managed policy is a standalone policy that can be attached to many identities; an inline policy is embedded in one user, group or role and is deleted with it.
?? Why can user-2 see the instance in Lab 1 but not stop it?
?= AmazonEC2ReadOnlyAccess allows Describe actions only; StopInstances is not allowed anywhere, so it falls under the implicit deny.`,
    ru: `## Что такое политика
**Политика IAM (IAM policy)** — **JSON-документ**, который задаёт права: какие **действия (actions)** разрешены или запрещены над какими **ресурсами (resources)** и при каких **условиях (conditions)**. Пока политику не **прикрепили** к сущности или ресурсу, она ничего не делает.
## Элементы политики
| Элемент | Смысл | Пример |
|---|---|---|
| Version | версия языка политик | 2012-10-17 |
| Statement | один или несколько блоков прав | список утверждений |
| Effect | **Allow** или **Deny** | Allow |
| Action | операции API в виде service:Action | s3:GetObject, ec2:StopInstances |
| Resource | какие ресурсы, по **ARN** (Amazon Resource Name) | arn:aws:s3:::reports-bucket |
| Condition | необязательно: когда утверждение действует | диапазон IP, использован MFA, время |
| Principal | **кто** получает доступ — только в resource-based политиках | другой аккаунт или ARN пользователя |
= {"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Action": ["s3:GetObject", "s3:ListBucket"], "Resource": ["arn:aws:s3:::reports-bucket", "arn:aws:s3:::reports-bucket/*"], "Condition": {"IpAddress": {"aws:SourceIp": "203.0.113.0/24"}}}]}
Это утверждение позволяет смотреть список объектов одного bucket и читать их — и только из диапазона IP офиса.
- Подстановочный знак (wildcard) в действии покрывает сразу много действий:
= ec2:Describe*  →  ec2:DescribeInstances, ec2:DescribeVolumes, ec2:DescribeSecurityGroups, …
## Identity-based и resource-based политики
| | Identity-based политика | Resource-based политика |
|---|---|---|
| К чему прикреплена | к пользователю, группе или роли IAM | к ресурсу, например S3 bucket (bucket policy) |
| Что говорит | что можно **этой сущности** | **кто** и что может делать с **этим ресурсом** |
| Элемент Principal | нет — principal та сущность, к которой она прикреплена | обязателен — называет, кто получает доступ |
| Виды | managed или inline | только inline, часть ресурса |
| Типичное применение | выдать права команде или роли | открыть bucket другому аккаунту или всем |
## Managed и inline политики
| Тип | Кто создаёт | Повторное использование | Пример |
|---|---|---|---|
| **AWS managed** | AWS; клиент не может её изменить | прикрепляется ко многим сущностям в любом аккаунте | AmazonS3ReadOnlyAccess, AdministratorAccess |
| **Customer managed** | вы, в своём аккаунте | прикрепляется ко многим сущностям в вашем аккаунте; есть версии | ReportsBucketReadOnly |
| **Inline** | вы, встроена прямо в одного пользователя, группу или роль | **не переиспользуется** — строго один к одному; удаляется вместе с этой сущностью | EC2-Admin-Policy в Lab 1 |
> Формулировка экзамена: **inline policy** — «a built-in policy that is **unique to a particular user or group**». «Built-in» здесь значит **встроенная в** одну сущность, а не «заранее созданная AWS» (такая была бы AWS managed policy).
- Нужно изменить AWS managed policy? Копируют её в **customer managed** политику и правят копию.
## Как AWS оценивает запрос
@diagram cc7-policy-eval
- По умолчанию любой запрос **запрещён** — это **неявный запрет (implicit deny)**.
- Если в любой применимой политике есть подходящий **явный Deny (explicit deny)** → **запрещено**, сколько бы ни было разрешений.
- Иначе, если в какой-то политике есть подходящий **явный Allow** → **разрешено**.
- Иначе → всё равно запрещено (неявный запрет).
> Явный deny > явный allow > неявный deny. Deny всегда побеждает.
Пример: пользователь в группе A, которая разрешает все действия S3, и в группе B, которая запрещает s3:DeleteBucket. В S3 пользователю можно всё, **кроме** удаления bucket.
- Неявный запрет значит «никто не сказал да» — его снимает добавленный Allow. Явный запрет значит «кто-то сказал нет» — никакой Allow его не перебьёт.
## Хорошие привычки
- **Наименьшие привилегии (least privilege)**: выдавать только те действия и ресурсы, которые нужны задаче.
- Прикреплять политики к **группам** или **ролям**, а не к отдельным пользователям.
- Для повторного использования выбирать **managed** политики; **inline** — только для строгой связи один к одному, которая должна исчезнуть вместе с сущностью.
- Добавлять **Conditions** (MFA, IP-источник) к чувствительным действиям.
## Lab 1 — Introduction to AWS IAM
В аккаунте лабы уже есть три пользователя и три группы. Задача: добавить каждого пользователя в нужную группу, затем войти под каждым и проверить, что работает.
@diagram cc7-lab1
| Пользователь | Группа | Политика группы | Тип | Что разрешено |
|---|---|---|---|---|
| user-1 | S3-Support | AmazonS3ReadOnlyAccess | AWS managed | смотреть bucket и объекты S3 |
| user-2 | EC2-Support | AmazonEC2ReadOnlyAccess | AWS managed | смотреть ресурсы EC2 |
| user-3 | EC2-Admin | EC2-Admin-Policy | **inline** | смотреть, **запускать и останавливать** инстансы EC2 |
Inline-политика группы EC2-Admin:
= {"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Action": ["ec2:Describe*", "ec2:StartInstances", "ec2:StopInstances"], "Resource": "*"}]}
- **Task 1 — изучить**: в консоли IAM открыть Users и User groups; сначала у пользователей **нет групп и нет прав**; на вкладке Permissions каждой группы видно её managed или inline политику (Show Policy / JSON).
- **Task 2 — добавить пользователей в группы**: user-1 → S3-Support, user-2 → EC2-Support, user-3 → EC2-Admin.
- **Task 3 — войти и проверить**: скопировать **IAM users sign-in URL** с дашборда IAM, открыть его в приватном окне браузера и по очереди войти под каждым пользователем.
| Проверка | Результат | Почему |
|---|---|---|
| user-1 открывает Amazon S3 | видит bucket и их содержимое | S3 read-only разрешает list и get |
| user-1 открывает Amazon EC2 | инстансов нет, «You are not authorized to perform this operation» | прав на EC2 нет — неявный запрет |
| user-2 открывает Amazon EC2 | видит инстанс | EC2 read-only разрешает Describe |
| user-2 пытается остановить инстанс | ошибка: нет прав | в read-only нет StopInstances |
| user-2 открывает Amazon S3 | не может получить список bucket | прав на S3 нет |
| user-3 останавливает инстанс | инстанс останавливается | inline-политика разрешает StopInstances |
| user-3 пытается его удалить (terminate) | отказ | TerminateInstances не выдан — неявный запрет |
> Сценарий экзамена: user-3 может запускать и останавливать инстансы, но не может их удалить (terminate). Самая вероятная причина: **права группы ограничены просмотром, запуском и остановкой — terminate не выдан**. Это не блокировка AWS Support и не лимит инстансов.
?? Группа пользователя разрешает s3:GetObject на всех bucket, но политика, прикреплённая к самому пользователю, явно запрещает s3:GetObject на bucket с зарплатами. Может ли пользователь читать файлы о зарплатах?
?= Нет. Явный запрет перебивает любое разрешение.
?? Чем customer managed политика отличается от inline?
?= Customer managed — отдельная политика, которую можно прикрепить ко многим сущностям; inline встроена в одного пользователя, группу или роль и удаляется вместе с ней.
?? Почему в Lab 1 user-2 видит инстанс, но не может его остановить?
?= AmazonEC2ReadOnlyAccess разрешает только действия Describe; StopInstances нигде не разрешён, поэтому срабатывает неявный запрет.`,
  },
  [
    qx("What does an inline policy do?", "Gives permissions unique to one user, group or role", [
      ["Gives the same predefined permissions in every account", "That describes AWS managed policies, which AWS creates and maintains.", "Это описание AWS managed policies, которые создаёт и ведёт AWS."],
      ["Applies only to users from a federated identity provider", "Inline policies are not tied to federation; they are embedded in any user, group or role.", "Inline-политики не связаны с федерацией; их встраивают в любого пользователя, группу или роль."],
      ["Encrypts the traffic between IAM and other services", "Policies define permissions, not encryption.", "Политики задают права, а не шифрование."],
    ], "An inline policy is a built-in (embedded) policy unique to one identity — a strict one-to-one relationship, deleted together with it.", "Inline-политика — встроенная политика, уникальная для одной сущности: строгая связь один к одному, удаляется вместе с ней."),
    qx("user-3 is in the EC2-Admin group. The user can start and stop EC2 instances but cannot terminate them and says this blocks the work. What is the MOST likely reason?", "The group's policy allows viewing, starting and stopping only", [
      ["Termination must first be unlocked by AWS Support", "AWS Support does not unlock IAM permissions; the account's own policies decide.", "AWS Support не открывает права IAM; решают политики самого аккаунта."],
      ["The account has reached its maximum number of instances", "A quota would block launching more instances, not terminating existing ones.", "Квота мешала бы запускать новые инстансы, а не удалять существующие."],
      ["EC2-Admin gives basic console access, not advanced features", "IAM has no 'basic vs advanced' console levels; it allows or denies specific actions.", "В IAM нет уровней «базовый/продвинутый»; он разрешает или запрещает конкретные действия."],
    ], "The inline policy lists ec2:Describe*, StartInstances and StopInstances; TerminateInstances is not allowed, so it is implicitly denied.", "Inline-политика перечисляет ec2:Describe*, StartInstances и StopInstances; TerminateInstances не разрешён, значит, действует неявный запрет."),
    qx("In Lab 1, which policy is attached to the S3-Support group?", "AmazonS3ReadOnlyAccess, an AWS managed policy", [
      ["EC2-Admin-Policy, an inline policy", "That inline policy belongs to the EC2-Admin group.", "Эта inline-политика принадлежит группе EC2-Admin."],
      ["S3-Support-Policy, an inline policy on the group", "The only inline policy in the lab is on EC2-Admin; S3-Support uses an AWS managed one.", "Единственная inline-политика в лабе — у EC2-Admin; S3-Support использует AWS managed."],
      ["A bucket policy, a resource-based policy", "Groups get identity-based policies; bucket policies attach to buckets.", "Группам прикрепляют identity-based политики; bucket policy прикрепляют к bucket."],
    ], "S3-Support gets the AWS managed AmazonS3ReadOnlyAccess, so user-1 can view S3 but not change it.", "S3-Support получает AWS managed AmazonS3ReadOnlyAccess, поэтому user-1 может смотреть S3, но не менять."),
    qx("In Lab 1, user-2 tries to stop the EC2 instance. What happens?", "Not authorized, as read-only lacks StopInstances", [
      ["The instance stops, as EC2-Support manages EC2", "EC2-Support has read-only access; it cannot change instance state.", "У EC2-Support доступ только на чтение; менять состояние инстанса нельзя."],
      ["The instance stops after the root user approves", "IAM has no approval step by the root user.", "В IAM нет шага одобрения со стороны root."],
      ["An authorization error, because user-2 has no MFA", "The error is about missing permissions, not about MFA.", "Ошибка из-за отсутствия прав, а не из-за MFA."],
    ], "AmazonEC2ReadOnlyAccess allows Describe actions only, so StopInstances falls under the implicit deny.", "AmazonEC2ReadOnlyAccess разрешает только Describe, поэтому StopInstances попадает под неявный запрет."),
    qx("In Lab 1, how do the IAM users open the console sign-in page?", "Through the IAM users sign-in URL of the account", [
      ["Through the root user's email address sign-in page", "That page signs in the root user, not IAM users.", "Эта страница — для входа root user, а не пользователей IAM."],
      ["Through an SSH session to the EC2 instance", "SSH logs in to an instance's OS, not to the AWS console.", "SSH — вход в ОС инстанса, а не в консоль AWS."],
      ["Through the aws configure command of the CLI", "aws configure stores access keys for the CLI; it does not open the console.", "aws configure сохраняет ключи для CLI; консоль он не открывает."],
    ], "The IAM dashboard shows a sign-in URL with the account ID; the lab opens it in a private window and signs in as each user.", "На дашборде IAM есть sign-in URL с ID аккаунта; в лабе его открывают в приватном окне и входят под каждым пользователем."),
    qx("A request matches an explicit Allow in one policy and an explicit Deny in another. What is the result?", "Denied, because an explicit deny always wins", [
      ["Allowed, because allows are evaluated first", "Order does not matter; an explicit deny overrides any allow.", "Порядок не важен; явный deny перебивает любой allow."],
      ["Allowed, because the newer policy takes effect", "Policy age plays no role in evaluation.", "Возраст политики в оценке не участвует."],
      ["Denied, unless the Allow comes from a group", "Allows from groups are no stronger; a deny still wins.", "Allow из группы не сильнее; deny всё равно побеждает."],
    ], "Evaluation: explicit deny > explicit allow > implicit deny.", "Порядок оценки: явный deny > явный allow > неявный deny."),
    qx("No policy of a user mentions s3:DeleteObject. What happens when the user calls it?", "It is refused by the default implicit deny", [
      ["It is allowed, since unlisted actions pass", "AWS starts from deny; only listed actions can be allowed.", "AWS начинает с запрета; разрешить можно только перечисленные действия."],
      ["It is allowed if the bucket is private", "Private buckets do not grant anything to users.", "Приватный bucket сам ничего не разрешает пользователям."],
      ["AWS asks the root user to approve it", "IAM has no approval workflow; the request is simply denied.", "В IAM нет процесса одобрения; запрос просто отклоняется."],
    ], "Anything not explicitly allowed is implicitly denied.", "Всё, что не разрешено явно, запрещено неявно."),
    qx("Which policy element appears in a resource-based policy but not in an identity-based one?", "Principal", [
      ["Condition", "Condition can be used in both kinds of policy.", "Condition можно использовать в политиках обоих видов."],
      ["Effect", "Every statement has an Effect, in both kinds.", "Effect есть в каждом утверждении обоих видов."],
      ["Action", "Every statement lists actions, in both kinds.", "Actions перечисляются в каждом утверждении обоих видов."],
    ], "A resource-based policy must say who gets access (Principal); an identity-based policy applies to the identity it is attached to.", "Resource-based политика должна указать, кто получает доступ (Principal); identity-based действует на ту сущность, к которой прикреплена."),
    qx("What does the Effect element of a policy statement contain?", "Either Allow or Deny", [
      ["The ARN of the resource", "Resource ARNs go into the Resource element.", "ARN ресурсов пишут в элемент Resource."],
      ["The name of the API operation", "API operations go into the Action element.", "Операции API пишут в элемент Action."],
      ["The policy language version", "The version goes into the Version element, for example 2012-10-17.", "Версию пишут в элемент Version, например 2012-10-17."],
    ], "Effect is Allow or Deny; Action, Resource and Condition say what, on which resources and when.", "Effect — это Allow или Deny; Action, Resource и Condition говорят, что, над чем и когда."),
    qx("Which of these is a resource-based policy?", "A bucket policy that lets another account read", [
      ["A customer managed policy attached to the Developers group", "Policies attached to groups are identity-based.", "Политики, прикреплённые к группам, — identity-based."],
      ["AmazonEC2ReadOnlyAccess attached to a role", "An AWS managed policy on a role is identity-based.", "AWS managed policy на роли — identity-based."],
      ["The inline policy embedded in user-3's group", "Inline policies on groups are identity-based too.", "Inline-политики групп — тоже identity-based."],
    ], "A bucket policy is attached to the resource itself and names the principal who gets access.", "Bucket policy прикреплена к самому ресурсу и называет principal, который получает доступ."),
    qx("A company needs one policy it can attach to several groups, edit itself and keep versions of. Which type fits?", "A customer managed policy", [
      ["An AWS managed policy", "Customers cannot edit AWS managed policies.", "Клиент не может редактировать AWS managed policies."],
      ["An inline policy on each group", "Inline policies are one-to-one and not reusable.", "Inline-политики — один к одному и не переиспользуются."],
      ["A resource-based bucket policy", "A bucket policy attaches to a bucket, not to groups.", "Bucket policy прикрепляется к bucket, а не к группам."],
    ], "Customer managed policies are standalone, reusable within the account, editable and versioned.", "Customer managed политики — отдельные, переиспользуются в аккаунте, редактируются и имеют версии."),
    qx("What happens to an inline policy when the IAM user it is embedded in is deleted?", "It is deleted together with the user", [
      ["It moves to the user's former groups", "Inline policies never move between identities.", "Inline-политики никогда не переходят между сущностями."],
      ["It turns into a customer managed policy", "There is no automatic conversion.", "Автоматического преобразования нет."],
      ["It stays and can be attached elsewhere", "An inline policy has no life of its own outside its identity.", "У inline-политики нет жизни вне её сущности."],
    ], "An inline policy lives inside a single identity and disappears with it.", "Inline-политика живёт внутри одной сущности и исчезает вместе с ней."),
    qx("A reporting job only needs to read objects from one bucket. Which permission follows least privilege?", "Allow s3:GetObject on that bucket's objects", [
      ["Allow s3:* on every bucket in the whole account", "All S3 actions on all buckets is far more than needed.", "Все действия S3 на всех bucket — намного больше нужного."],
      ["Attach AdministratorAccess to save time", "Admin rights are the opposite of least privilege.", "Права администратора — противоположность наименьших привилегий."],
      ["Allow s3:GetObject on every bucket", "The action is right, but the scope covers buckets the job never needs.", "Действие верное, но охват включает bucket, которые задаче не нужны."],
    ], "Least privilege: only the needed action on only the needed resource.", "Наименьшие привилегии: только нужное действие и только над нужным ресурсом."),
    qx("In the Lab 1 inline policy, what does ec2:Describe* allow?", "Every EC2 action whose name starts with Describe", [
      ["Only the single DescribeInstances action", "The asterisk is a wildcard, so many Describe actions match.", "Звёздочка — подстановочный знак, поэтому подходят многие действия Describe."],
      ["Every EC2 action, including terminating instances", "Only actions starting with Describe match; terminate is not one of them.", "Подходят только действия, начинающиеся с Describe; terminate к ним не относится."],
      ["Describing the IAM users who work with EC2", "The ec2 prefix means EC2 actions, not IAM ones.", "Префикс ec2 означает действия EC2, а не IAM."],
    ], "The wildcard matches DescribeInstances, DescribeVolumes and every other EC2 Describe action — all read-only.", "Wildcard охватывает DescribeInstances, DescribeVolumes и все остальные действия Describe в EC2 — все только на чтение."),
    qx("A user is in group A, which allows all S3 actions, and in group B, which denies s3:DeleteBucket. What can the user do in S3?", "Every S3 action except deleting buckets", [
      ["Nothing, because the two groups conflict", "A conflict does not cancel everything; only the denied action is blocked.", "Конфликт не отменяет всё; блокируется только запрещённое действие."],
      ["Everything, including deleting buckets", "The explicit deny on DeleteBucket wins over group A's allow.", "Явный deny на DeleteBucket побеждает allow группы A."],
      ["Only what both groups explicitly allow", "Permissions from groups add up; the explicit deny then removes one action.", "Права групп складываются, а явный deny затем убирает одно действие."],
    ], "Permissions from all groups combine, and the explicit deny removes just s3:DeleteBucket.", "Права всех групп объединяются, а явный deny убирает только s3:DeleteBucket."),
    tfx("An implicit deny can be overridden by adding an Allow, but an explicit Deny cannot be overridden by any Allow.", true,
      "Implicit deny is just the default 'nobody said yes'; an explicit Deny is a decision that always wins.",
      "Неявный запрет — просто умолчание «никто не сказал да»; явный Deny — решение, которое побеждает всегда.",
      "'False' treats both denies alike, but only the explicit one beats an Allow.",
      "Ответ «неверно» считает оба запрета одинаковыми, но Allow перебивает только явный."),
    qx("In Lab 1, what does user-1 see after opening the EC2 console?", "No instances and a not-authorized message", [
      ["All instances, in read-only mode", "Read-only EC2 access belongs to user-2's group, not user-1's.", "Чтение EC2 есть у группы user-2, а не user-1."],
      ["All instances, with Start and Stop enabled", "Start and stop are allowed only for EC2-Admin.", "Запуск и остановка разрешены только EC2-Admin."],
      ["A prompt to switch to the root user", "AWS does not offer such a prompt; it just denies the request.", "AWS такого не предлагает; он просто отклоняет запрос."],
    ], "user-1 has only S3 read-only rights, so EC2 requests are implicitly denied.", "У user-1 только чтение S3, поэтому запросы к EC2 неявно запрещены."),
    qx("Which Lab 1 group has an inline policy rather than an AWS managed one?", "EC2-Admin", [
      ["EC2-Support", "EC2-Support uses the AWS managed AmazonEC2ReadOnlyAccess.", "EC2-Support использует AWS managed AmazonEC2ReadOnlyAccess."],
      ["S3-Support", "S3-Support uses the AWS managed AmazonS3ReadOnlyAccess.", "S3-Support использует AWS managed AmazonS3ReadOnlyAccess."],
      ["Administrators", "There is no such group in Lab 1.", "Такой группы в Lab 1 нет."],
    ], "EC2-Admin has the inline EC2-Admin-Policy: Describe, Start and Stop.", "У EC2-Admin inline EC2-Admin-Policy: Describe, Start и Stop."),
    qx("A policy must allow ec2:StopInstances only when the request comes from the office IP range. Which element adds that restriction?", "Condition", [
      ["Principal", "Principal names who gets access in resource-based policies, not when.", "Principal называет, кто получает доступ в resource-based политиках, а не когда."],
      ["Resource", "Resource limits which resources, not where the request comes from.", "Resource ограничивает ресурсы, а не откуда пришёл запрос."],
      ["Version", "Version is just the policy language version.", "Version — лишь версия языка политик."],
    ], "Condition adds circumstances such as aws:SourceIp, MFA or time.", "Condition добавляет обстоятельства вроде aws:SourceIp, MFA или времени."),
    tfx("A customer can edit an AWS managed policy such as AmazonS3ReadOnlyAccess to add extra actions.", false,
      "AWS managed policies are maintained by AWS and cannot be edited; copy one into a customer managed policy to change it.",
      "AWS managed policies ведёт AWS, и изменить их нельзя; чтобы поменять, копируют в customer managed политику.",
      "'True' confuses AWS managed with customer managed policies, which are the editable kind.",
      "Ответ «верно» путает AWS managed с customer managed политиками — редактировать можно именно их."),
  ],
);

/* ─────────────── Part 4 — Organizations, data protection, monitoring ─────────────── */

const p4 = part(
  "cc-l7-p4",
  { en: "Organizations, data protection and security monitoring", ru: "Organizations, защита данных и мониторинг безопасности" },
  {
    en: `## AWS Organizations
**AWS Organizations** is an account management service that **consolidates multiple AWS accounts** into an organization you **manage centrally**.
- The **management account** creates the organization; the other accounts are **member accounts**.
- Accounts are grouped into **organizational units (OUs)** — for example Dev, Test and Prod — and policies are attached to an OU or to one account.
- **Consolidated billing**: one bill for all accounts, with usage combined for volume discounts.
- Organizations works together with IAM: a user's effective permissions are the **intersection** of what Organizations allows and what IAM grants in that account.
## Service control policies (SCPs)
- An **SCP** sets the **maximum permissions** — a guardrail — for every account in an OU, or for one account.
- SCPs use the **same JSON syntax** as IAM policies, but an SCP **never grants** anything: users still need IAM policies that allow the action.
- An SCP applies to **all IAM users and roles in a member account, including its root user** (it does not restrict the management account).
= effective permissions = allowed by the SCP ∩ allowed by IAM policies, minus any explicit deny
Example: an SCP on the Sandbox OU allows only Amazon S3 and Amazon CloudWatch. A developer in a sandbox account who has AdministratorAccess still cannot launch an EC2 instance.
> Exam trap: an SCP does not grant access. IAM grants, the SCP caps — the action must be allowed by **both**.
## Protecting data: encryption
- **Data at rest** — stored data: disks, S3 objects, databases, snapshots. Encryption can be enabled in **Amazon S3, Amazon EBS, Amazon EFS, Amazon RDS** and other services integrated with AWS KMS.
- **Data in transit** — data moving across a network. It is protected with **TLS** (Transport Layer Security, the successor of SSL), for example HTTPS; AWS uses TLS 1.2 or later with AES-256.
- **AWS Key Management Service (AWS KMS)** — creates and manages **encryption keys** and controls their use across AWS services and applications; keys are protected by **FIPS 140-2 validated hardware security modules (HSMs)**, and every key use is **logged in AWS CloudTrail**.
- **AWS Certificate Manager (ACM)** — provisions, manages and deploys **SSL/TLS certificates** for HTTPS on load balancers and CloudFront.
- Turning encryption on and deciding who may use the keys is the **customer's** half of the shared responsibility model.
| Need | Use |
|---|---|
| Encrypt EBS volumes, S3 objects or an RDS database with keys under your control | AWS KMS |
| An HTTPS certificate for a load balancer or CloudFront | AWS Certificate Manager |
| Protect data travelling between a browser and the app | TLS (HTTPS) |
## Securing S3 buckets
- New S3 buckets and objects are **private by default**.
- **Block Public Access** — an account-level or bucket-level setting that **overrides** policies and ACLs that would make data public; keep it on for every bucket that must stay private.
- Control access with **IAM policies** (identities in your account), **bucket policies** (resource-based — cross-account or public access) and, rarely, **ACLs**.
- AWS Trusted Advisor has a free **S3 bucket permissions** check.
## Edge protection: AWS Shield and AWS WAF
- **AWS Shield** — managed **DDoS protection**. **Shield Standard** is **automatic and free** for every customer. **Shield Advanced** is a **paid** option against larger, more sophisticated attacks, with a 24/7 DDoS response team, for EC2, Elastic Load Balancing, CloudFront, Global Accelerator and Route 53.
- **AWS WAF** — a **web application firewall**: rules (web ACLs) that inspect HTTP(S) requests at the **application layer** and block, for example, **SQL injection** or **cross-site scripting**, in front of CloudFront, an Application Load Balancer or API Gateway.
- Security groups (instance) and network ACLs (subnet) filter by IP address and port; WAF looks inside web requests; Shield absorbs traffic floods.
## Auditing and monitoring: which service answers which question
| Service | Question it answers | Example |
|---|---|---|
| **AWS CloudTrail** | **Who** did **what**, **when** and from **where**? — records API calls | who deleted an EC2 instance yesterday |
| **Amazon CloudWatch** | How are resources and apps performing **now**? — metrics, logs, **alarms** | alarm when CPU stays above 80%, notify through Amazon SNS |
| **AWS Config** | How is each resource **configured**, how did it change, does it **comply** with rules? | flag unencrypted EBS volumes or public buckets |
| **Amazon Inspector** | Do workloads have **vulnerabilities**? — automated security assessments | an EC2 instance with a known CVE or an exposed port |
| **AWS Trusted Advisor** | What should be fixed to follow **best practices**? — checks for cost, performance, security, fault tolerance, service limits | no MFA on root, unrotated or exposed access keys, unrestricted security group ports |
| **Amazon GuardDuty** | Is something **suspicious** happening? — threat detection from logs | API calls from a known malicious IP address |
- **CloudTrail** keeps **90 days** of event history by default at no cost (CloudTrail console, Event history). To keep logs longer, create a **trail** that delivers log files to an **S3 bucket**.
- **CloudWatch** alarms send notifications through **Amazon SNS**. CloudWatch shows how much and how fast, not who made a change.
- **AWS Config** is a **Regional** service: it records configuration history and evaluates resources against **rules**.
- **Trusted Advisor** core security checks — MFA on root, IAM use, S3 bucket permissions, security groups with unrestricted ports — are available to everyone; the full set comes with Business or Enterprise Support.
> Mnemonic: Trail = **who**; Watch = **how much, how fast**; Config = **what it looks like and did it change**; Inspector = **holes**; Advisor = **advice**.
> Exam trap: "identify the user who deleted an EC2 instance" → **CloudTrail**, not CloudWatch. Risky IAM access keys or no MFA on root, flagged automatically → **Trusted Advisor**.
?? A security group was opened to 0.0.0.0/0 on port 22 last night. Which service shows who changed it, and which one flags the open port as a risk?
?= CloudTrail shows who made the API call (AuthorizeSecurityGroupIngress); Trusted Advisor flags security groups with unrestricted access to ports such as 22.
?? An SCP on an OU allows only Amazon S3. An IAM user in a member account has AdministratorAccess. Can the user launch an EC2 instance?
?= No. The SCP caps the account's maximum permissions; effective permissions are the intersection of the SCP and the IAM policies.`,
    ru: `## AWS Organizations
**AWS Organizations** — сервис управления аккаунтами, который **объединяет несколько аккаунтов AWS** в организацию с **централизованным управлением**.
- Организацию создаёт **management account (управляющий аккаунт)**; остальные — **member accounts (аккаунты-участники)**.
- Аккаунты группируют в **организационные единицы (organizational units, OUs)** — например Dev, Test и Prod — и прикрепляют политики к OU или к отдельному аккаунту.
- **Consolidated billing (единый счёт)**: один счёт на все аккаунты, использование суммируется ради скидок за объём.
- Organizations работает вместе с IAM: итоговые права пользователя — **пересечение** того, что разрешает Organizations, и того, что выдаёт IAM в этом аккаунте.
## Service control policies (SCPs)
- **SCP** задаёт **максимальные права** — ограждение (guardrail) — для всех аккаунтов OU или для одного аккаунта.
- У SCP **тот же JSON-синтаксис**, что у политик IAM, но SCP **никогда ничего не выдаёт**: пользователям всё равно нужны политики IAM, разрешающие действие.
- SCP действует на **всех пользователей и роли IAM в аккаунте-участнике, включая его root user** (управляющий аккаунт она не ограничивает).
= effective permissions = allowed by the SCP ∩ allowed by IAM policies, minus any explicit deny
Пример: SCP на OU Sandbox разрешает только Amazon S3 и Amazon CloudWatch. Разработчик в sandbox-аккаунте с AdministratorAccess всё равно не может запустить инстанс EC2.
> Ловушка экзамена: SCP не выдаёт доступ. IAM выдаёт, SCP ограничивает сверху — действие должно быть разрешено **обоими**.
## Защита данных: шифрование
- **Данные в покое (data at rest)** — хранимые данные: диски, объекты S3, базы данных, снапшоты. Шифрование можно включить в **Amazon S3, Amazon EBS, Amazon EFS, Amazon RDS** и других сервисах, интегрированных с AWS KMS.
- **Данные при передаче (data in transit)** — данные, которые идут по сети. Их защищает **TLS** (Transport Layer Security, преемник SSL), например HTTPS; AWS использует TLS 1.2 или новее с AES-256.
- **AWS Key Management Service (AWS KMS)** — создаёт **ключи шифрования**, управляет ими и контролирует их использование в сервисах AWS и в приложениях; ключи защищены **аппаратными модулями безопасности (HSM), сертифицированными по FIPS 140-2**, а каждое использование ключа **журналируется в AWS CloudTrail**.
- **AWS Certificate Manager (ACM)** — выпускает, хранит и развёртывает **сертификаты SSL/TLS** для HTTPS на балансировщиках и CloudFront.
- Включить шифрование и решить, кто может пользоваться ключами, — **половина клиента** в модели разделённой ответственности.
| Задача | Что использовать |
|---|---|
| Шифровать тома EBS, объекты S3 или базу RDS ключами под своим контролем | AWS KMS |
| HTTPS-сертификат для балансировщика или CloudFront | AWS Certificate Manager |
| Защитить данные между браузером и приложением | TLS (HTTPS) |
## Защита S3 bucket
- Новые S3 bucket и объекты **по умолчанию приватные**.
- **Block Public Access** — настройка на уровне аккаунта или bucket, которая **перекрывает** политики и ACL, способные сделать данные публичными; её держат включённой для каждого bucket, который должен остаться приватным.
- Доступ контролируют **политиками IAM** (сущности вашего аккаунта), **bucket policies** (resource-based — доступ другим аккаунтам или публичный) и изредка **ACL**.
- В AWS Trusted Advisor есть бесплатная проверка **S3 bucket permissions**.
## Защита на краю сети: AWS Shield и AWS WAF
- **AWS Shield** — управляемая **защита от DDoS**. **Shield Standard** включён **автоматически и бесплатно** для всех клиентов. **Shield Advanced** — **платный** вариант против более крупных и сложных атак, с командой реагирования на DDoS 24/7, для EC2, Elastic Load Balancing, CloudFront, Global Accelerator и Route 53.
- **AWS WAF** — **web application firewall (межсетевой экран веб-приложений)**: правила (web ACLs), которые проверяют HTTP(S)-запросы на **прикладном уровне** и блокируют, например, **SQL-инъекции** или **межсайтовый скриптинг (XSS)** перед CloudFront, Application Load Balancer или API Gateway.
- Security groups (инстанс) и network ACLs (подсеть) фильтруют по IP-адресу и порту; WAF смотрит внутрь веб-запросов; Shield поглощает потоки трафика.
## Аудит и мониторинг: какой сервис на какой вопрос отвечает
| Сервис | На какой вопрос отвечает | Пример |
|---|---|---|
| **AWS CloudTrail** | **Кто**, **что**, **когда** и **откуда** сделал? — записывает вызовы API | кто вчера удалил инстанс EC2 |
| **Amazon CloudWatch** | Как ресурсы и приложения работают **сейчас**? — метрики, логи, **алармы (alarms)** | аларм, когда CPU держится выше 80%, уведомление через Amazon SNS |
| **AWS Config** | Как **настроен** каждый ресурс, как менялся, **соответствует** ли правилам? | найти незашифрованные тома EBS или публичные bucket |
| **Amazon Inspector** | Есть ли в нагрузке **уязвимости**? — автоматические оценки безопасности | инстанс EC2 с известной CVE или открытым наружу портом |
| **AWS Trusted Advisor** | Что исправить, чтобы следовать **лучшим практикам**? — проверки по стоимости, производительности, безопасности, отказоустойчивости, лимитам сервисов | нет MFA на root, неротируемые или раскрытые ключи доступа, порты security groups открыты всем |
| **Amazon GuardDuty** | Происходит ли что-то **подозрительное**? — обнаружение угроз по логам | вызовы API с известного вредоносного IP-адреса |
- **CloudTrail** по умолчанию бесплатно хранит **90 дней** истории событий (консоль CloudTrail, Event history). Чтобы хранить дольше, создают **trail**, который доставляет файлы логов в **S3 bucket**.
- Алармы **CloudWatch** отправляют уведомления через **Amazon SNS**. CloudWatch показывает «сколько» и «как быстро», а не кто внёс изменение.
- **AWS Config** — **региональный** сервис: он записывает историю конфигураций и проверяет ресурсы по **правилам (rules)**.
- Базовые проверки безопасности **Trusted Advisor** — MFA на root, использование IAM, права S3 bucket, security groups с портами, открытыми всем, — доступны всем; полный набор — с планами поддержки Business или Enterprise.
> Мнемоника: Trail = **кто**; Watch = **сколько и как быстро**; Config = **как устроено и менялось ли**; Inspector = **дыры**; Advisor = **советы**.
> Ловушка экзамена: «найти пользователя, который удалил инстанс EC2» → **CloudTrail**, а не CloudWatch. Рискованные ключи доступа IAM или отсутствие MFA на root, найденные автоматически, → **Trusted Advisor**.
?? Вчера ночью security group открыли для 0.0.0.0/0 на порт 22. Какой сервис покажет, кто это сделал, а какой отметит открытый порт как риск?
?= CloudTrail покажет, кто сделал вызов API (AuthorizeSecurityGroupIngress); Trusted Advisor отметит security groups с неограниченным доступом к портам вроде 22.
?? SCP на OU разрешает только Amazon S3. У пользователя IAM в аккаунте-участнике есть AdministratorAccess. Может ли он запустить инстанс EC2?
?= Нет. SCP ограничивает максимальные права аккаунта; итоговые права — пересечение SCP и политик IAM.`,
  },
  [
    qx("Which AWS service helps identify the user who deleted an Amazon EC2 instance yesterday?", "AWS CloudTrail", [
      ["Amazon CloudWatch", "CloudWatch tracks metrics, logs and alarms, not which identity made an API call.", "CloudWatch следит за метриками, логами и алармами, а не за тем, кто сделал вызов API."],
      ["Amazon Inspector", "Inspector looks for vulnerabilities in workloads; it does not log user actions.", "Inspector ищет уязвимости в нагрузке; действия пользователей он не журналирует."],
      ["AWS Trusted Advisor", "Trusted Advisor gives best-practice recommendations, not an activity history.", "Trusted Advisor даёт рекомендации по лучшим практикам, а не историю действий."],
    ], "CloudTrail records API calls such as TerminateInstances with the identity, time and source IP address.", "CloudTrail записывает вызовы API вроде TerminateInstances вместе с тем, кто их сделал, временем и IP-адресом."),
    qx("A security review finds IAM access keys that were never rotated and a root user without MFA. Which service flags such issues with built-in best-practice checks?", "AWS Trusted Advisor", [
      ["AWS CloudTrail", "CloudTrail records who did what; it does not judge settings against best practices.", "CloudTrail записывает, кто что сделал; настройки по лучшим практикам он не оценивает."],
      ["Amazon CloudWatch", "CloudWatch watches metrics and alarms, not IAM hygiene.", "CloudWatch следит за метриками и алармами, а не за гигиеной IAM."],
      ["Amazon Inspector", "Inspector scans workloads for vulnerabilities, not account settings such as root MFA.", "Inspector ищет уязвимости в нагрузке, а не настройки аккаунта вроде MFA на root."],
    ], "Trusted Advisor's security checks include MFA on the root account, IAM access key rotation, exposed keys and open security group ports.", "Проверки безопасности Trusted Advisor включают MFA на root, ротацию ключей доступа IAM, раскрытые ключи и открытые порты security groups."),
    qx("You want a notification when an instance's CPU stays above 80% for 10 minutes. Which service do you configure?", "Amazon CloudWatch", [
      ["AWS CloudTrail", "CloudTrail logs API activity; it does not track CPU metrics.", "CloudTrail журналирует действия API; метрики CPU он не отслеживает."],
      ["AWS Trusted Advisor", "Trusted Advisor gives periodic recommendations, not real-time metric alarms.", "Trusted Advisor даёт периодические рекомендации, а не алармы по метрикам в реальном времени."],
      ["AWS Config", "Config tracks configuration, not utilization.", "Config следит за конфигурацией, а не за загрузкой."],
    ], "A CloudWatch alarm watches the CPUUtilization metric and notifies through Amazon SNS.", "Аларм CloudWatch следит за метрикой CPUUtilization и уведомляет через Amazon SNS."),
    qx("A company must check continuously that every EBS volume is encrypted and keep a history of configuration changes. Which service fits?", "AWS Config", [
      ["AWS KMS", "KMS manages encryption keys; it does not audit which volumes use them.", "KMS управляет ключами шифрования; какие тома их используют, он не проверяет."],
      ["AWS CloudTrail", "CloudTrail shows who called which API, not whether resources comply with rules.", "CloudTrail показывает, кто какой API вызвал, а не соответствуют ли ресурсы правилам."],
      ["Amazon Inspector", "Inspector looks for software vulnerabilities, not configuration rules.", "Inspector ищет уязвимости ПО, а не нарушения правил конфигурации."],
    ], "AWS Config records configuration history and evaluates resources against rules such as 'EBS volumes must be encrypted'.", "AWS Config записывает историю конфигураций и проверяет ресурсы по правилам вроде «тома EBS должны быть зашифрованы»."),
    qx("Which service runs automated security assessments that find software vulnerabilities and unintended network exposure on EC2 instances?", "Amazon Inspector", [
      ["AWS Config", "Config checks configuration rules, not software vulnerabilities.", "Config проверяет правила конфигурации, а не уязвимости ПО."],
      ["AWS CloudTrail", "CloudTrail is an audit log of API calls.", "CloudTrail — журнал аудита вызовов API."],
      ["AWS Shield Advanced", "Shield protects against DDoS attacks; it does not scan instances.", "Shield защищает от DDoS-атак; инстансы он не сканирует."],
    ], "Amazon Inspector assesses workloads for known vulnerabilities (CVEs) and network exposure.", "Amazon Inspector оценивает нагрузку на известные уязвимости (CVE) и открытость в сеть."),
    qx("What does a service control policy (SCP) in AWS Organizations do?", "Sets the maximum permissions for accounts in an OU", [
      ["Grants permissions to every user in the member accounts", "An SCP never grants; users still need IAM policies.", "SCP никогда не выдаёт права; пользователям всё равно нужны политики IAM."],
      ["Encrypts the data of every account in the organization", "Encryption is done with KMS and service settings, not SCPs.", "Шифрование делают KMS и настройки сервисов, а не SCP."],
      ["Merges the bills of all accounts into one invoice", "That is consolidated billing, a different Organizations feature.", "Это consolidated billing — другая функция Organizations."],
    ], "An SCP is a guardrail: it limits what accounts in an OU can do, even for admins and the member account's root user.", "SCP — ограждение: она ограничивает, что могут аккаунты в OU, даже администраторы и root user аккаунта-участника."),
    qx("An SCP on the Sandbox OU allows only Amazon S3 actions. A user in a sandbox account has AdministratorAccess. Can the user launch an EC2 instance?", "No, the SCP caps what the account can use", [
      ["Yes, AdministratorAccess overrides any SCP", "IAM policies cannot go beyond the SCP's maximum.", "Политики IAM не могут выйти за максимум SCP."],
      ["Yes, SCPs restrict only the root user", "SCPs restrict all users and roles in member accounts, root included.", "SCP ограничивает всех пользователей и роли в аккаунтах-участниках, включая root."],
      ["No, AdministratorAccess never includes EC2", "AdministratorAccess allows all actions; the SCP is what blocks EC2.", "AdministratorAccess разрешает все действия; EC2 блокирует именно SCP."],
    ], "Effective permissions are the intersection of the SCP and IAM policies; EC2 is outside the SCP.", "Итоговые права — пересечение SCP и политик IAM; EC2 вне SCP."),
    tfx("A service control policy never grants permissions by itself; it only limits them.", true,
      "SCPs define the maximum available permissions; IAM policies still have to allow each action.",
      "SCP задаёт максимум доступных прав; каждое действие всё равно должна разрешить политика IAM.",
      "'False' treats an SCP like an IAM policy that hands out access, but it only sets the ceiling.",
      "Ответ «неверно» считает SCP политикой IAM, которая выдаёт доступ, но она задаёт только потолок."),
    qx("Which AWS Organizations feature groups accounts such as Dev, Test and Prod so that each group gets its own policies?", "Organizational units (OUs)", [
      ["IAM groups shared across accounts", "IAM groups hold users of one account, not accounts.", "Группы IAM содержат пользователей одного аккаунта, а не аккаунты."],
      ["Resource groups with tags", "Resource groups organize resources, not accounts.", "Resource groups объединяют ресурсы, а не аккаунты."],
      ["Availability Zones", "AZs are physical locations, not account groups.", "AZ — физические площадки, а не группы аккаунтов."],
    ], "OUs group accounts inside an organization, and SCPs can be attached to each OU.", "OU объединяют аккаунты внутри организации, и к каждой OU можно прикрепить SCP."),
    qx("Which service creates and manages encryption keys and logs every use of a key in CloudTrail?", "AWS Key Management Service", [
      ["AWS Certificate Manager", "ACM manages SSL/TLS certificates, not general encryption keys.", "ACM управляет сертификатами SSL/TLS, а не ключами шифрования вообще."],
      ["AWS Identity and Access Management", "IAM manages identities and permissions, not encryption keys.", "IAM управляет сущностями и правами, а не ключами шифрования."],
      ["Amazon Cognito", "Cognito handles sign-in for app users.", "Cognito отвечает за вход пользователей приложений."],
    ], "AWS KMS creates and controls keys in FIPS 140-2 validated HSMs and integrates with CloudTrail to log key usage.", "AWS KMS создаёт и контролирует ключи в HSM, сертифицированных по FIPS 140-2, и журналирует их использование через CloudTrail."),
    qx("Data travelling between users' browsers and your web app must be protected. What is used?", "TLS encryption, as in HTTPS", [
      ["Server-side encryption in Amazon S3", "That protects data at rest in S3, not data on the network.", "Это защищает данные в покое в S3, а не данные в сети."],
      ["Amazon EBS snapshots", "Snapshots are backups, not protection in transit.", "Снапшоты — резервные копии, а не защита при передаче."],
      ["AWS Shield Standard", "Shield mitigates DDoS; it does not encrypt traffic.", "Shield отражает DDoS; трафик он не шифрует."],
    ], "Data in transit is protected with TLS (formerly SSL), for example HTTPS.", "Данные при передаче защищают TLS (бывший SSL), например HTTPS."),
    qx("Which statement about encryption under the shared responsibility model is correct?", "The customer decides what to encrypt and who uses keys", [
      ["Encryption is AWS's job alone, because AWS owns and runs the disks", "AWS provides the tools; enabling and controlling encryption is the customer's side.", "AWS даёт инструменты; включать и контролировать шифрование — сторона клиента."],
      ["Only data in transit can be encrypted on AWS", "Data at rest can be encrypted too: S3, EBS, EFS, RDS.", "Данные в покое тоже можно шифровать: S3, EBS, EFS, RDS."],
      ["Keys must be kept outside AWS to be secure", "AWS KMS keeps keys in validated HSMs; external keys are optional.", "AWS KMS хранит ключи в сертифицированных HSM; внешние ключи — лишь вариант."],
    ], "Client-side and server-side encryption and key access are listed under security IN the cloud.", "Шифрование на стороне клиента и сервера и доступ к ключам — это безопасность В облаке."),
    qx("Which AWS Shield tier protects every AWS customer automatically at no additional cost?", "AWS Shield Standard", [
      ["AWS Shield Advanced", "Shield Advanced is a paid option for larger attacks.", "Shield Advanced — платный вариант для более крупных атак."],
      ["AWS Shield Business", "There is no such tier; Shield has Standard and Advanced.", "Такого уровня нет; у Shield есть Standard и Advanced."],
      ["AWS Shield Enterprise", "There is no such tier; Shield has Standard and Advanced.", "Такого уровня нет; у Shield есть Standard и Advanced."],
    ], "Shield Standard is always on for all customers; Shield Advanced adds paid protection and a DDoS response team.", "Shield Standard всегда включён у всех клиентов; Shield Advanced добавляет платную защиту и команду реагирования на DDoS."),
    qx("An online shop wants to block SQL injection and cross-site scripting attempts in HTTP requests. Which option fits?", "AWS WAF rules (web ACLs)", [
      ["AWS Shield Standard DDoS protection", "Shield absorbs floods of traffic; it does not inspect request content.", "Shield поглощает потоки трафика; содержимое запросов он не проверяет."],
      ["A network ACL deny rule", "Network ACLs filter by IP and port, not by what is inside a request.", "Network ACLs фильтруют по IP и порту, а не по содержимому запроса."],
      ["A security group rule", "Security groups allow by IP and port only, with no request inspection.", "Security groups разрешают только по IP и порту, без проверки запросов."],
    ], "AWS WAF inspects web requests at the application layer and blocks patterns such as SQL injection and XSS.", "AWS WAF проверяет веб-запросы на прикладном уровне и блокирует шаблоны вроде SQL-инъекций и XSS."),
    qx("By default, where is AWS CloudTrail event history kept, and for how long?", "In the CloudTrail console, for 90 days", [
      ["In an S3 bucket you create, kept forever", "Delivery to S3 needs a trail that you create; it is not the default.", "Доставка в S3 требует созданного вами trail; это не поведение по умолчанию."],
      ["In CloudWatch Logs, for 7 days", "CloudTrail event history lives in CloudTrail itself.", "История событий CloudTrail хранится в самом CloudTrail."],
      ["Nowhere until a trail is created", "Event history for the last 90 days is on by default.", "История за последние 90 дней включена по умолчанию."],
    ], "Event history covers the last 90 days of management events for free; a trail to S3 keeps logs longer.", "Event history бесплатно хранит management-события за 90 дней; trail в S3 хранит логи дольше."),
    qx("Which statement about newly created S3 buckets is correct?", "They are private until someone grants access", [
      ["They are public until Block Public Access is set", "It is the opposite: buckets start private.", "Наоборот: bucket изначально приватные."],
      ["Every IAM user in the account can read them", "IAM users need a policy that allows S3 access.", "Пользователям IAM нужна политика, разрешающая доступ к S3."],
      ["They are shared with AWS Support by default", "AWS Support has no access to customer buckets.", "У AWS Support нет доступа к bucket клиентов."],
    ], "New buckets and objects are private by default; access is opened with policies or ACLs.", "Новые bucket и объекты по умолчанию приватные; доступ открывают политиками или ACL."),
    qx("A team must share one S3 bucket with a partner company's AWS account. Which tool fits best?", "A bucket policy that names the partner account", [
      ["An IAM group that contains the partner's users", "IAM groups hold users of your own account only.", "Группы IAM содержат только пользователей вашего аккаунта."],
      ["Turning off Block Public Access on the bucket", "That risks exposing data to everyone, not just the partner.", "Это рискует открыть данные всем, а не только партнёру."],
      ["An SCP attached to the partner's account", "An SCP only limits permissions; it cannot grant access to your bucket.", "SCP только ограничивает права; доступ к вашему bucket она не выдаёт."],
    ], "Bucket policies are resource-based and can grant cross-account access by naming the other account as principal.", "Bucket policies — resource-based и могут выдать доступ другому аккаунту, назвав его principal."),
    tfx("Amazon CloudWatch is the service that records which IAM user made each API call in the account.", false,
      "That is AWS CloudTrail; CloudWatch collects metrics and logs and raises alarms.",
      "Это AWS CloudTrail; CloudWatch собирает метрики и логи и поднимает алармы.",
      "'True' mixes up the two similar names: Trail answers who, Watch answers how much.",
      "Ответ «верно» путает похожие названия: Trail отвечает на «кто», Watch — на «сколько»."),
    qx("A company with 15 AWS accounts wants one bill and volume discounts across all of them. Which feature fits?", "Consolidated billing in AWS Organizations", [
      ["A Cost and Usage Report in each account", "Reports show costs but do not merge accounts into one bill.", "Отчёты показывают затраты, но не объединяют аккаунты в один счёт."],
      ["A service control policy that merges usage", "SCPs limit permissions; they have nothing to do with billing.", "SCP ограничивают права и к оплате отношения не имеют."],
      ["Reserved Instances bought in every account", "Reservations lower compute prices but do not consolidate bills.", "Резервирования снижают цену вычислений, но счета не объединяют."],
    ], "Consolidated billing gives one bill for all member accounts and combines usage for volume pricing.", "Consolidated billing даёт один счёт на все аккаунты-участники и суммирует использование для скидок за объём."),
    qx("Which service provisions and renews SSL/TLS certificates for an Application Load Balancer?", "AWS Certificate Manager", [
      ["AWS Key Management Service", "KMS manages encryption keys, not public TLS certificates.", "KMS управляет ключами шифрования, а не публичными TLS-сертификатами."],
      ["AWS Artifact", "Artifact provides compliance reports, not certificates for HTTPS.", "Artifact даёт отчёты о соответствии, а не сертификаты для HTTPS."],
      ["Amazon Inspector", "Inspector scans for vulnerabilities.", "Inspector ищет уязвимости."],
    ], "ACM provisions, manages and deploys SSL/TLS certificates for HTTPS endpoints.", "ACM выпускает, хранит и развёртывает сертификаты SSL/TLS для HTTPS-точек."),
  ],
);

export const lecture7: Lecture = {
  id: "cc-l7",
  title: { en: "Lecture 7 — AWS cloud security and IAM", ru: "Лекция 7 — Безопасность в AWS и IAM" },
  parts: [p1, p2, p3, p4],
};
