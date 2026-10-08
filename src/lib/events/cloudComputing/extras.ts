import type { Term, Text } from "../types";

const t = (term: string, en: string, ru: string): Term => ({ term, def: { en, ru } });

/** Глоссарий курса — он же колода карточек «термин → определение». */
export const glossary: Term[] = [
  t("Cloud computing", "Per NIST, a model for convenient, on-demand network access to a shared pool of configurable computing resources that are rapidly provisioned and released with minimal management effort.", "По NIST — модель удобного on-demand доступа по сети к общему пулу настраиваемых вычислительных ресурсов, которые быстро выделяются и освобождаются с минимальными усилиями по управлению."),
  t("On-demand self-service", "You provision compute, storage and network yourself through a simple interface, with no human interaction with the provider.", "Вычисления, хранилище и сеть берёшь сам через простой интерфейс, без общения с людьми со стороны провайдера."),
  t("Broad network access", "Resources are reachable over the network from standard devices such as phones, tablets, laptops and workstations.", "Ресурсы доступны по сети со стандартных устройств: телефонов, планшетов, ноутбуков, рабочих станций."),
  t("Resource pooling", "Resources are pooled in a multi-tenant model and dynamically reassigned among customers, which gives the provider economies of scale.", "Ресурсы собраны в общий пул по multi-tenant модели и динамически перераспределяются между клиентами — отсюда экономия на масштабе."),
  t("Rapid elasticity", "Resources are elastically provisioned and released, so you get more when you need them and scale back when you don't.", "Ресурсы эластично выделяются и освобождаются: берёшь больше, когда нужно, и отдаёшь, когда не нужно."),
  t("Measured service", "Usage is monitored, measured and reported transparently, and you pay only for what you use or reserve.", "Потребление отслеживается, измеряется и прозрачно отражается в отчётах; платишь только за то, что используешь или резервируешь."),
  t("Public cloud", "Cloud services over the open internet on provider-owned hardware that is shared with other companies.", "Облачные сервисы через открытый интернет на железе провайдера, которое делится с другими компаниями."),
  t("Private cloud", "Cloud infrastructure provisioned for the exclusive use of a single organization, on-premises or run by a provider.", "Облачная инфраструктура только для одной организации — у себя (on-premises) или у провайдера."),
  t("Hybrid cloud", "A mix of public and private clouds that work together seamlessly.", "Сочетание public и private облаков, которые бесшовно работают вместе."),
  t("IaaS", "Infrastructure as a Service: compute, storage and network on demand, while you manage the OS and everything above it (e.g. Amazon EC2).", "Infrastructure as a Service: вычисления, хранилище и сеть по запросу, а ОС и всё, что выше, настраиваешь ты (например, Amazon EC2)."),
  t("PaaS", "Platform as a Service: hardware and software tools to develop and deploy apps without managing infrastructure (e.g. Elastic Beanstalk, App Engine).", "Platform as a Service: железо и инструменты для разработки и деплоя приложений без управления инфраструктурой (например, Elastic Beanstalk, App Engine)."),
  t("SaaS", "Software as a Service: applications centrally hosted and licensed on a subscription basis, also called on-demand software.", "Software as a Service: приложения, которые размещены централизованно и продаются по подписке, — «on-demand software»."),
  t("CapEx vs OpEx", "The cloud swaps large upfront capital spending on hardware for pay-as-you-go operating expenses.", "Облако заменяет крупные разовые капитальные затраты на железо (CapEx) операционными расходами pay-as-you-go (OpEx)."),
  t("Virtualization", "Creating a software-based, virtual version of compute, storage, networking, servers or applications.", "Создание программной, виртуальной версии вычислений, хранилища, сети, серверов или приложений."),
  t("Hypervisor", "A small software layer that lets several operating systems share one physical machine and keeps the VMs isolated from each other.", "Тонкий программный слой, который позволяет нескольким ОС делить одну физическую машину и изолирует VM друг от друга."),
  t("Type 1 hypervisor", "A bare-metal hypervisor installed directly on the physical server: the most common, most secure and lowest-latency type (ESXi, Hyper-V, KVM).", "Bare-metal гипервизор прямо на физическом сервере: самый распространённый, самый безопасный и с наименьшей задержкой (ESXi, Hyper-V, KVM)."),
  t("Type 2 hypervisor", "A hosted hypervisor that runs on top of a host OS, used for end-user virtualization and having higher latency (VirtualBox, VMware Workstation).", "Hosted гипервизор поверх host OS — для виртуализации на компьютере пользователя, задержка выше (VirtualBox, VMware Workstation)."),
  t("Virtual machine (VM)", "A software-based computer with its own OS and applications that is independent of other VMs and portable between hypervisors.", "Программный компьютер со своей ОС и приложениями, независимый от других VM и легко переносимый между гипервизорами."),
  t("Region", "A geographic area whose data centers are grouped into multiple isolated Availability Zones, chosen by data governance, latency, services and cost.", "Географическая область, дата-центры которой разделены на несколько изолированных Availability Zones; выбирают по data governance, задержке, сервисам и цене."),
  t("Availability Zone (AZ)", "One or more discrete data centers with independent power, cooling and networking, within 100 km of the other AZs in its Region.", "Один или несколько отдельных дата-центров с независимым питанием, охлаждением и сетью, в пределах 100 км от других AZ своего Region."),
  t("Spot (transient) VM", "A heavily discounted VM on unused capacity that the provider can reclaim at any time, suited to testing, stateless and HPC jobs.", "VM с большой скидкой на свободных мощностях, которую провайдер может забрать в любой момент; подходит для тестов, stateless-задач и HPC."),
  t("Reserved instance", "Capacity reserved for a term of 1 or 3 years, guaranteed in the chosen data center and cheaper than hourly or monthly VMs.", "Мощность, зарезервированная на 1 или 3 года: гарантирована в выбранном дата-центре и дешевле почасовых или помесячных VM."),
  t("Bare metal server", "A single-tenant, dedicated physical server without a hypervisor, used for HPC and high-security workloads but slower to provision and pricier than VMs.", "Single-tenant выделенный физический сервер без гипервизора — для HPC и задач с высокими требованиями к безопасности, но выдаётся дольше и стоит дороже VM."),
  t("Container", "An executable unit of software that packages app code with its libraries and dependencies and shares the host OS kernel instead of carrying a guest OS.", "Исполняемый блок ПО: код приложения вместе с библиотеками и зависимостями; использует ядро host OS, а не собственную guest OS."),
  t("Container image", "A template holding an app, its dependencies and user-space libraries but no kernel; a running instance of an image is a container.", "Шаблон с приложением, зависимостями и user-space библиотеками, но без ядра; запущенный экземпляр image — это container."),
  t("Docker", "An open-source platform with a client-server architecture that builds, runs and ships applications as containers.", "Open-source платформа с архитектурой клиент–сервер, которая собирает, запускает и доставляет приложения в виде контейнеров."),
  t("Amazon EC2", "Elastic Compute Cloud: resizable virtual machines (instances) with full control over the guest OS — the AWS IaaS service.", "Elastic Compute Cloud: виртуальные машины (instances) с изменяемым размером и полным контролем над guest OS — IaaS-сервис AWS."),
  t("AMI", "Amazon Machine Image: the template of a root volume, launch permissions and block device mapping used to launch an EC2 instance.", "Amazon Machine Image: шаблон из root volume, launch permissions и block device mapping, из которого запускается EC2 instance."),
  t("Scaling up vs scaling out", "Scaling up (vertical) adds CPU, RAM or disk to one server; scaling out (horizontal) adds more servers to share the load.", "Scaling up (вертикально) — добавить CPU, RAM или диск одному серверу; scaling out (горизонтально) — добавить серверов и разделить нагрузку."),
  t("AWS Lambda", "Serverless, function-based compute that runs code without provisioning servers and charges only for the compute time used.", "Serverless-вычисления на функциях: код работает без выделения серверов, платишь только за затраченное время вычислений."),
  t("AWS Elastic Beanstalk", "The AWS PaaS for web applications: AWS manages the OS and application server so you focus on your code.", "PaaS от AWS для веб-приложений: ОС и сервер приложений берёт на себя AWS, а ты занимаешься кодом."),
  t("Amazon ECS", "Elastic Container Service: AWS orchestration of Docker containers on a managed cluster of EC2 instances.", "Elastic Container Service: оркестрация Docker-контейнеров от AWS на управляемом кластере EC2 instances."),
  t("AWS Fargate", "A serverless launch type for containers where AWS manages the cluster and you only specify CPU, memory and networking.", "Serverless launch type для контейнеров: кластером управляет AWS, а ты задаёшь только CPU, память и сеть."),
  t("Kubernetes", "Open-source container orchestration that automates provisioning, networking, load distribution and scaling across a cluster of nodes.", "Open-source оркестрация контейнеров: автоматизирует развёртывание, сеть, распределение нагрузки и масштабирование на кластере nodes."),
  t("Pod", "The Kubernetes unit of one or more tightly coupled containers that share an IP address, storage and a node.", "Единица Kubernetes из одного или нескольких тесно связанных контейнеров с общим IP-адресом, хранилищем и node."),
  t("Amazon EKS", "Elastic Kubernetes Service: certified-conformant managed Kubernetes on AWS, where AWS runs the control plane for you.", "Elastic Kubernetes Service: managed Kubernetes на AWS с сертифицированной совместимостью — control plane ведёт AWS."),
  t("Direct attached storage", "Local storage inside the server chassis or rack: fast but ephemeral, not shareable, and usually used only for the OS.", "Локальное хранилище в корпусе сервера или в стойке: быстрое, но ephemeral и не делится; обычно только под ОС."),
  t("File storage", "NFS storage mounted over Ethernet: cheaper and slower, its speed varies with load, and many nodes can mount it at once.", "NFS-хранилище по Ethernet: дешевле и медленнее, скорость зависит от нагрузки, зато монтируется сразу на много узлов."),
  t("Block storage", "Volumes delivered over high-speed fibre (SAN) and mounted on one node at a time, with consistently fast I/O for databases and mail servers.", "Тома по быстрой оптике (SAN), монтируются на один узел за раз; стабильно быстрые — для баз данных и почтовых серверов."),
  t("Object storage", "Flat storage in buckets accessed through an API: the cheapest, the slowest and effectively infinite, for static unstructured data.", "Плоское хранилище в бакетах с доступом через API: самое дешёвое, самое медленное и фактически бесконечное — для статичных неструктурированных данных."),
  t("IOPS", "Input/Output Operations Per Second — how fast the disks read and write; too low causes a bottleneck, too high wastes money.", "Input/Output Operations Per Second — скорость чтения и записи дисков; мало — узкое место, много — переплата."),
  t("Snapshot", "A fast point-in-time image of file or block storage that needs no downtime and restores the whole volume, not individual files.", "Быстрый снимок file или block хранилища на момент времени: без простоя, восстанавливает весь том, а не отдельные файлы."),
  t("Amazon S3", "AWS object storage with globally unique bucket names, objects up to 5 TB and 11 nines of durability.", "Объектное хранилище AWS: глобально уникальные имена бакетов, объекты до 5 ТБ, durability 11 девяток."),
  t("CIDR", "Classless Inter-Domain Routing notation such as 192.0.2.0/24, where the number after the slash is how many bits are fixed for the network.", "Classless Inter-Domain Routing — запись вида 192.0.2.0/24, где число после слэша — сколько бит закреплено за сетью."),
  t("Amazon VPC", "A logically isolated virtual network in the AWS Cloud, dedicated to your account, in one Region and spanning multiple AZs.", "Логически изолированная виртуальная сеть в AWS Cloud, выделенная твоему аккаунту: один Region, несколько AZ."),
  t("Subnet", "A range of IP addresses in a VPC that lives in one AZ; it is public if routed to an internet gateway and private otherwise.", "Диапазон IP-адресов внутри VPC в одной AZ; public, если есть маршрут к internet gateway, иначе private."),
  t("Route table", "A set of routes, each with a destination and a target, that directs subnet traffic and always contains an undeletable local route.", "Набор маршрутов (destination и target), направляющих трафик подсети; всегда содержит неудаляемый маршрут local."),
  t("Internet gateway", "A scalable, redundant VPC component that connects the VPC to the internet and performs NAT for instances with public IPv4 addresses.", "Масштабируемый отказоустойчивый компонент VPC: связывает VPC с интернетом и делает NAT для инстансов с публичными IPv4."),
  t("NAT gateway", "Placed in a public subnet with an Elastic IP, it lets private-subnet instances reach the internet while blocking connections started from outside.", "Стоит в public subnet с Elastic IP: инстансы private subnet выходят в интернет, а соединение снаружи начать нельзя."),
  t("VPC peering", "A private connection between two VPCs; their IP ranges cannot overlap and peering is not transitive.", "Приватное соединение двух VPC; диапазоны IP не должны пересекаться, peering не транзитивен."),
  t("AWS Direct Connect", "A dedicated private network connection from your data center to AWS that gives more consistent bandwidth than the internet.", "Выделенное частное подключение от твоего дата-центра к AWS: полоса стабильнее, чем через интернет."),
  t("VPC endpoint", "A private link from a VPC to AWS services with no internet gateway, NAT or VPN: interface (PrivateLink) or gateway (S3, DynamoDB).", "Приватная связь VPC с сервисами AWS без internet gateway, NAT и VPN: interface (PrivateLink) или gateway (S3, DynamoDB)."),
  t("AWS Transit Gateway", "A hub-and-spoke gateway that connects many VPCs and on-premises networks through one central hub instead of point-to-point peering.", "Hub-and-spoke шлюз: соединяет много VPC и on-premises сетей через один центральный узел вместо point-to-point peering."),
  t("Security group", "A stateful virtual firewall at the instance level that supports allow rules only.", "Stateful виртуальный файрвол на уровне инстанса; только allow-правила."),
  t("Network ACL", "A stateless firewall at the subnet level with numbered allow and deny rules evaluated from the lowest number.", "Stateless файрвол на уровне подсети: пронумерованные allow и deny правила проверяются начиная с меньшего номера."),
  t("CDN", "Content Delivery Network: a geographically distributed network of proxy servers that serves cached content from the location nearest the user.", "Content Delivery Network: географически распределённая сеть прокси-серверов, отдающая кешированный контент с ближайшей к пользователю точки."),
  t("SDN", "Software-Defined Networking: moves the control plane into a central controller and programs the whole network through open APIs.", "Software-Defined Networking: control plane выносится в центральный контроллер, а вся сеть программируется через открытые API."),
  t("IoT", "The Internet of Things: connected devices and sensors whose data streams are collected, stored and processed in the cloud.", "Internet of Things: подключённые устройства и датчики, потоки данных которых собираются, хранятся и обрабатываются в облаке."),
  t("Blockchain", "A secure, distributed, immutable ledger that adds transparency and traceability to transactions.", "Защищённый распределённый неизменяемый реестр, который даёт транзакциям прозрачность и отслеживаемость."),
  // Модули AWS Academy Cloud Foundations — термины мидтерма.
  t("Economies of scale", "Usage from hundreds of thousands of customers is aggregated in the cloud, so AWS buys cheaper and offers lower pay-as-you-go prices.", "Потребление сотен тысяч клиентов собирается в облаке, поэтому AWS закупает дешевле и даёт более низкие цены pay-as-you-go."),
  t("Multi-tenancy", "VMs of different customers run on the same physical host: each VM is isolated, but they share the host's CPU, memory and network.", "VM разных клиентов работают на одном физическом хосте: каждая изолирована, но они делят CPU, память и сеть хоста."),
  t("Shared responsibility model", "AWS secures the cloud itself (facilities, hardware, network, hypervisor); the customer secures what is in it (data, IAM, security groups, the OS on EC2).", "AWS защищает само облако (здания, железо, сеть, гипервизор); клиент — то, что в нём (данные, IAM, security groups, ОС на EC2)."),
  t("AWS Support plans", "Basic (free), Developer, Business and Enterprise; the paid plans add technical support with faster response times.", "Basic (бесплатно), Developer, Business и Enterprise; платные планы добавляют техподдержку с более быстрым ответом."),
  t("AWS Trusted Advisor", "Checks your account against best practices in cost, performance, security (e.g. MFA on root, access key rotation, exposed keys), fault tolerance and service limits.", "Проверяет аккаунт по лучшим практикам: стоимость, производительность, безопасность (MFA на root, ротация и утечка access keys), отказоустойчивость, лимиты сервисов."),
  t("On-Demand Instances", "Pay per second or hour with no commitment and no upfront payment; the default for new or unpredictable workloads.", "Оплата за секунду или час без обязательств и предоплаты; вариант по умолчанию для новых или непредсказуемых нагрузок."),
  t("Savings Plans", "A discount for committing to a fixed hourly spend on compute for 1 or 3 years, applied flexibly across instance types and Regions.", "Скидка за обязательство тратить фиксированную сумму в час на вычисления в течение 1 или 3 лет; гибко применяется к разным типам инстансов и регионам."),
  t("Dedicated Hosts", "A whole physical server for one customer: visible sockets and cores, control over instance placement, own per-socket licences; for compliance.", "Целый физический сервер для одного клиента: видны сокеты и ядра, есть контроль над размещением инстансов, свои лицензии на сокет; для compliance."),
  t("Scheduled Reserved Instances", "Reserved capacity for a recurring time window (daily, weekly, monthly) at a discount, e.g. a monthly reporting job; no longer sold for new purchases.", "Резерв мощности на повторяющееся окно (день, неделя, месяц) со скидкой, например под ежемесячные отчёты; новые больше не продаются."),
  t("EC2 instance families", "General purpose (T, M), compute optimized (C, CPU-heavy work), memory optimized (R, X, large datasets in memory), storage optimized (I, D, local I/O), accelerated computing (P, G, GPUs).", "General purpose (T, M), compute optimized (C, много CPU), memory optimized (R, X, большие данные в памяти), storage optimized (I, D, локальный ввод-вывод), accelerated computing (P, G, GPU)."),
  t("Elastic IP address", "A static public IPv4 address that stays with your account and can be remapped between instances; a NAT gateway uses one.", "Статический публичный IPv4-адрес, закреплённый за аккаунтом; его можно перевесить на другой инстанс; NAT gateway использует такой адрес."),
  t("Amazon EBS", "Persistent block storage for EC2 in one Availability Zone; data survives an instance stop, and a volume attaches to instances in the same AZ.", "Постоянное блочное хранилище для EC2 в одной Availability Zone; данные переживают остановку инстанса, том подключается к инстансам в той же AZ."),
  t("EBS snapshot", "A point-in-time, incremental backup of an EBS volume stored in Amazon S3; new volumes can be created from it in any AZ, and it can be copied to another Region.", "Инкрементный бэкап тома EBS на момент времени, хранится в Amazon S3; из него создают новые тома в любой AZ, его можно скопировать в другой регион."),
  t("EBS Multi-Attach", "Attaches one Provisioned IOPS (io1/io2) volume to several Nitro instances at once — only within the same Availability Zone.", "Подключает один том Provisioned IOPS (io1/io2) сразу к нескольким инстансам Nitro — только в пределах одной Availability Zone."),
  t("Instance store", "Temporary block storage on disks physically attached to the host; very fast, but data is lost when the instance stops or terminates.", "Временное блочное хранилище на дисках, физически подключённых к хосту; очень быстрое, но данные пропадают при остановке или удалении инстанса."),
  t("Amazon EFS", "A managed, elastic NFS file system for Linux that many instances in many AZs mount and read and write at the same time; it grows and shrinks automatically.", "Управляемая эластичная файловая система NFS для Linux: её монтируют много инстансов в разных AZ и одновременно читают и пишут; растёт и сжимается сама."),
  t("EFS mount target", "The network interface in a subnet of each AZ through which EC2 instances connect to an EFS file system.", "Сетевой интерфейс в подсети каждой AZ, через который инстансы EC2 подключаются к файловой системе EFS."),
  t("Amazon FSx", "Managed third-party file systems: FSx for Windows File Server (SMB, Active Directory) for Windows apps, FSx for Lustre for high-performance computing.", "Управляемые сторонние файловые системы: FSx for Windows File Server (SMB, Active Directory) для Windows-приложений, FSx for Lustre для HPC."),
  t("S3 storage classes", "Standard (frequent access), Intelligent-Tiering (unknown patterns), Standard-IA and One Zone-IA (infrequent), Glacier classes and Glacier Deep Archive (archive, cheapest).", "Standard (частый доступ), Intelligent-Tiering (неизвестный характер доступа), Standard-IA и One Zone-IA (редкий доступ), классы Glacier и Glacier Deep Archive (архив, дешевле всех)."),
  t("Amazon RDS", "Managed relational databases — Aurora, MySQL, MariaDB, PostgreSQL, Oracle, SQL Server; AWS handles provisioning, patching and backups.", "Управляемые реляционные базы — Aurora, MySQL, MariaDB, PostgreSQL, Oracle, SQL Server; provisioning, патчи и бэкапы берёт на себя AWS."),
  t("RDS Multi-AZ deployment", "A synchronous standby copy in another AZ with automatic failover when the primary fails; for availability, the standby serves no reads.", "Синхронная резервная копия в другой AZ с автоматическим failover при отказе основной базы; для доступности, чтение резерв не обслуживает."),
  t("Read replica", "An asynchronous read-only copy of an RDS database with its own endpoint, used to offload read traffic; promoting it is a manual step.", "Асинхронная копия базы RDS только для чтения со своим адресом, снимает нагрузку чтения; её повышение до основной — ручной шаг."),
  t("Amazon DynamoDB", "A fully managed serverless NoSQL key-value database with single-digit millisecond latency at any scale.", "Полностью управляемая serverless NoSQL-база «ключ–значение» с задержкой в единицы миллисекунд на любом масштабе."),
  t("DynamoDB Query vs Scan", "Query finds items by partition key (of the table or an index); Scan reads every item and filters, so it is used to search by a non-key attribute.", "Query находит элементы по partition key (таблицы или индекса); Scan читает все элементы и фильтрует, поэтому им ищут по атрибуту, который не ключ."),
  t("Amazon Redshift", "A managed petabyte-scale data warehouse for analytics (SQL over columnar storage) — a separate service, not an RDS engine.", "Управляемое хранилище данных петабайтного масштаба для аналитики (SQL поверх колоночного хранения) — отдельный сервис, а не движок RDS."),
  t("AWS root user", "The identity created with the account that has unrestricted access; protect it with MFA, create no access keys, and use IAM users for daily work.", "Учётная запись, созданная вместе с аккаунтом, с неограниченным доступом; её защищают MFA, не создают для неё access keys, а для ежедневной работы используют IAM users."),
  t("IAM user", "A person or application in your account with long-term credentials — a console password and/or access keys.", "Человек или приложение в аккаунте с долгосрочными учётными данными — паролем от консоли и/или access keys."),
  t("IAM group", "A collection of IAM users; permissions attached to the group apply to every member. Groups cannot be nested and have no credentials.", "Набор пользователей IAM; права группы действуют на каждого участника. Группы не вкладываются друг в друга и не имеют учётных данных."),
  t("IAM role", "An identity with temporary credentials that a user, an application or an AWS service (e.g. an EC2 instance) assumes; the secure way to give EC2 access to other services.", "Учётная запись с временными учётными данными, которую принимает пользователь, приложение или сервис AWS (например, инстанс EC2); безопасный способ дать EC2 доступ к другим сервисам."),
  t("Inline policy", "A policy embedded directly in one user, group or role and deleted with it; unlike a managed policy it cannot be reused.", "Политика, встроенная прямо в одного пользователя, группу или роль и удаляемая вместе с ними; в отличие от managed policy её нельзя переиспользовать."),
  t("MFA", "Multi-factor authentication: a one-time code from a device on top of the password; enable it on the root user first.", "Многофакторная аутентификация: одноразовый код с устройства в дополнение к паролю; первым делом включается на root user."),
  t("AWS CloudTrail", "Records every API call in the account — who, when, from where, what — so you can find, for example, who deleted an EC2 instance.", "Записывает каждый вызов API в аккаунте — кто, когда, откуда и что, — например, чтобы найти, кто удалил инстанс EC2."),
  t("AWS Config", "Records resource configurations and their changes over time and evaluates them against rules you define (compliance).", "Записывает конфигурации ресурсов и их изменения во времени и проверяет их по заданным правилам (compliance)."),
  t("Amazon CloudWatch", "Monitors AWS resources and applications in real time: metrics, logs, dashboards and alarms.", "Мониторинг ресурсов AWS и приложений в реальном времени: метрики, логи, дашборды и alarms."),
  t("CloudWatch alarm", "Watches a metric against a threshold and acts when it is crossed — e.g. notifies through an SNS topic or triggers an Auto Scaling policy.", "Следит за метрикой относительно порога и срабатывает при его пересечении — например, уведомляет через тему SNS или запускает политику Auto Scaling."),
  t("Amazon SNS", "Simple Notification Service: publish/subscribe that pushes each message to all subscribers at once (email, SMS, Lambda, HTTP, SQS queues).", "Simple Notification Service: publish/subscribe, который сразу рассылает каждое сообщение всем подписчикам (email, SMS, Lambda, HTTP, очереди SQS)."),
  t("Amazon SQS", "Simple Queue Service: a managed message queue; messages wait until a consumer polls them, which decouples producers from consumers.", "Simple Queue Service: управляемая очередь сообщений; сообщения ждут, пока потребитель их заберёт, — так отправители отвязаны от получателей."),
  t("Elastic Load Balancing", "Distributes incoming traffic across multiple targets (EC2 instances, containers, IPs) in several AZs and sends it only to healthy ones.", "Распределяет входящий трафик по нескольким целям (инстансы EC2, контейнеры, IP) в нескольких AZ и отправляет его только на исправные."),
  t("Amazon EC2 Auto Scaling", "Adds and removes EC2 instances in an Auto Scaling group to keep the desired capacity and follow demand, between a minimum and a maximum.", "Добавляет и убирает инстансы EC2 в Auto Scaling group, чтобы держать нужную мощность и следовать за спросом в пределах минимума и максимума."),
  t("Target tracking policy", "An Auto Scaling policy that keeps a metric at a target value, e.g. average CPU 70%: it adds instances above the target and removes them below.", "Политика Auto Scaling, которая держит метрику на целевом значении, например средний CPU 70%: выше цели добавляет инстансы, ниже — убирает."),
  t("Route 53 routing policies", "Simple, weighted (percentages), latency-based (lowest-latency Region), geolocation (by user's country), geoproximity, failover and multivalue answer.", "Simple, weighted (по процентам), latency-based (регион с наименьшей задержкой), geolocation (по стране пользователя), geoproximity, failover и multivalue answer."),
  t("AWS Well-Architected Framework", "Best practices organized in pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization and Sustainability.", "Лучшие практики, разложенные по столпам: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization и Sustainability."),
];

/** Шпаргалка на одну страницу — то, что стоит перечитать за пять минут до мидтерма. */
export const cheatSheet: Text = {
  en: `## Lecture 1 — Cloud basics and NIST
- **NIST:** on-demand network access to a shared pool of configurable resources, rapidly provisioned and released with minimal management effort.
- **5 characteristics:** on-demand self-service, broad network access, resource pooling (multi-tenant), rapid elasticity, measured service.
- **Deployment models:** public (shared provider hardware), private (one organization), hybrid (public + private together); community is the fourth NIST model.
- **Service models:** **IaaS** (servers, storage, network — EC2), **PaaS** (platform to build and deploy — Elastic Beanstalk, App Engine), **SaaS** (subscription software — Salesforce).
- **Pay-as-you-go** turns **CapEx into OpEx**. History: 1950s mainframes + timesharing → 1970s VM operating system → hypervisors → cloud.
- Drivers: infrastructure and workloads, SaaS and dev platforms, speed and productivity, risk exposure. Benefits: flexibility, efficiency, strategic value.
- Risks: data security, governance and sovereignty, compliance, lack of standards, choosing models and providers, business continuity.
## Lecture 2 — Infrastructure, virtualization, containers
- Global infrastructure = **Regions → Availability Zones → Edge locations**. An AZ is one or more data centers with independent power and cooling; AZs sit within **100 km** of each other.
- Choose a Region by **data governance (GDPR), latency, available services, cost**.
- Azure **regional pair** — two regions in one geography, updated one at a time. A rack holds 30–40 servers; a data center 50–80 thousand.
- **Type 1** hypervisor — bare-metal, on the hardware (ESXi, Hyper-V, KVM), most secure, lowest latency. **Type 2** — hosted on an OS (VirtualBox, VMware Workstation).
- VM types: **shared** (multi-tenant, hourly), **spot/transient** (cheapest, reclaimable any time), **reserved** (1 or 3 years, cheaper), **dedicated host** (single-tenant, compliance and licensing).
- **Bare metal:** single-tenant physical server, no hypervisor, provider manages up to the OS; for HPC, AI, ERP; 20–40 minutes to provision, pricier.
- Cloud network: **VPC → subnets**; **ACLs** guard the subnet, **security groups** the instance; public gateway, VPN, load balancer, Direct Link.
- **Container** = app + libraries + dependencies, shares the host kernel, no guest OS. An **image** is the template; a **container** is its running instance.
- Docker is client–server; containerd controls **runC** (OCI). **docker pull alpine**, **docker run -it alpine sh**, **docker run -d nginx**.
## Lecture 3 — Compute
| Category | AWS service |
|---|---|
| IaaS, virtual machines | **EC2** |
| Serverless, functions | **Lambda** |
| Containers | **ECS, EKS, Fargate, ECR** |
| PaaS for web apps | **Elastic Beanstalk** |
- **EC2** launches from an **AMI** (root volume template, launch permissions, block device mapping). AMI sources: Quick Start, My AMIs, Marketplace, Community (at your own risk).
- **t3.large**: t = family, 3 = generation, large = size; each size step doubles vCPU and memory. T3 burstable, **C5 compute**, **R5 memory**.
- **Scale up** (vertical) = a bigger server; **scale out** (horizontal) = more servers. **EC2 Auto Scaling** launches or terminates instances.
- **ECS** orchestrates Docker on an EC2 cluster; a **task definition** describes up to 10 containers. With **Fargate** AWS manages the cluster.
- **Kubernetes:** nodes run **pods**, the control plane schedules them, **kubelet** talks to the control plane, a Deployment self-heals. **EKS** = managed Kubernetes.
- Azure: Virtual Machines, App Service, Container Instances, AKS, Functions, Virtual Desktop. GCP: Compute Engine, App Engine, Cloud GPUs, **TPU** (Google's ASIC for neural networks).
## Lecture 3 — Storage
| Type | Access | Key fact |
|---|---|---|
| Direct attached | Local disk | Fast, **ephemeral**, OS only |
| File (NFS) | Ethernet | Many nodes, cheaper, speed varies |
| Block (SAN) | Fibre | **One node**, fast, databases |
| Object | **API** | Cheapest, slowest, infinite |
- **IOPS** = disk read/write speed (not the network). Too low — bottleneck; too high — overpaying. Object storage has no IOPS options.
- **Persistent** storage survives the node; **ephemeral** is deleted with it. **Snapshot** — point-in-time, fast, no downtime, not for single files.
- **S3:** buckets with globally unique names, objects up to **5 TB**, **11 nines** of durability, data in **3+ AZs**; flat structure, no buckets inside buckets.
- Classes: **Standard**, **Intelligent-Tiering** (30 days), **Standard-IA**, **One Zone-IA** (one AZ), **Glacier**, **Glacier Deep Archive** (cheapest, restore within 12 h).
## Lecture 4 — Networking
- IPv4 = **32 bits**, IPv6 = **128 bits**. **/24 = 256** addresses, **/16 = 65,536**, **/32** = one host, **0.0.0.0/0** = the whole internet.
- OSI: switches work at **layer 2**, routers at **layer 3**; TCP/UDP at layer 4.
- **VPC** — one Region, many AZs; CIDR from **/16** (largest) to **/28** (smallest), cannot be changed later. **Subnet** — one AZ, subnet CIDRs cannot overlap.
- AWS reserves **5 addresses** in every subnet, so a /24 has **251** usable:
= 10.0.0.0 network · 10.0.0.1 router · 10.0.0.2 DNS · 10.0.0.3 future · 10.0.0.255 broadcast
- **Route table:** destination + target, undeletable **local** route; one route table per subnet. Public subnet: **0.0.0.0/0 → igw**.
- **NAT gateway** sits in a public subnet with an **Elastic IP**: private instances get out, the internet cannot start a connection in.
- **Peering** — no overlapping ranges, **not transitive**. **Transit Gateway** — hub and spoke. **Site-to-Site VPN** — virtual gateway + customer gateway. **Direct Connect** — dedicated line, **802.1q VLAN**.
- **VPC endpoints:** interface (**PrivateLink**, paid) and gateway (**S3 and DynamoDB**, free).
| Attribute | Security group | Network ACL |
|---|---|---|
| Scope | Instance | Subnet |
| Rules | Allow only | Allow and deny |
| State | **Stateful** | **Stateless** |
| Order | All rules evaluated | By number, lowest first |
| Default | Deny in, allow out | Default allows all; custom denies all |
- **CDN** — cached copies served from the nearest location. **SDN** — the control plane moves to a central **controller**; the data plane stays in the switches.
- SDN layers: application, control, infrastructure; **northbound API** (apps ↔ controller), **southbound** (controller ↔ switches, OpenFlow). Downside: **single point of failure**.
## Lecture 5 — Adoption and emerging tech
- Microsoft **CAF**: Strategy, Plan, Ready, Adopt, Govern, Manage.
- **American Airlines** — monolith to microservices for better customer service. **Spotify** — moved to **GCP** (planned from 2015), services and data took a year each, engineers freed to innovate.
- **Dropbox** — left **Amazon S3**, moved about **90%** of files in-house for cost and control: on-premises can still suit a business that is big enough.
- **Netflix** — video on **S3 + Open Connect**, Kafka for streaming, Chaos Monkey and Spinnaker in CI/CD.
- **IoT delivers the data, AI powers the insights, the cloud gives the scale.** Blockchain — a trusted, immutable, decentralized source of truth.
## Midterm: scenario → answer
| Scenario in the question | Answer |
|---|---|
| New app, unknown usage, no long-term commitment | **On-Demand** |
| Steady, predictable workload for at least 1 year | **Reserved Instances** (1-year term) |
| Stateless job that can be interrupted, lowest cost | **Spot Instances** |
| Monthly reports over huge data on a fixed schedule | **Scheduled Reserved Instances** |
| Compliance, full control over the physical server | **Dedicated Hosts** |
| Avoid large upfront hardware costs | **Pay-as-you-go** |
| Three separate data-center groups with own power and cooling inside a Region | **Availability Zones** |
| App went down when one AZ lost power | **Multiple AZs in the same Region** |
| Who deleted the EC2 instance yesterday? | **AWS CloudTrail** |
| Monitor resources and apps in real time | **Amazon CloudWatch** |
| Send alerts from a CloudWatch alarm | **Amazon SNS** |
| Notify some people now, let others process later | **Amazon SNS** (fan-out to SQS) |
| Unused IAM access keys flagged automatically | **AWS Trusted Advisor** |
| EC2 app needs DynamoDB credentials securely | **IAM role** attached to the instance |
| Temporary access to permissions | **IAM role** |
| Manager uses the root account daily | **IAM users** for daily work + **MFA on root** |
| Optional security control at the subnet level | **Network ACL** |
| Site blocked, security group allows only port 22 | Add **inbound TCP 80** to that security group |
| Private instance cannot reach the internet | **NAT gateway** is missing |
| Public subnet vs private subnet | Route **0.0.0.0/0 → internet gateway** |
| Users in Europe and Asia, route to the fastest Region | Route 53 **latency-based** routing |
| 10 instances read and write shared files at once | **Amazon EFS** |
| Shared Windows file storage over SMB | **Amazon FSx** |
| One EBS volume for instances in different AZs | Impossible — EBS is AZ-scoped, use **EFS** |
| 11 nines durability, documents and photos | **Amazon S3** |
| Automatic RDS failover to another AZ | **RDS Multi-AZ** (pillar: **Reliability**) |
| DynamoDB search by a non-key attribute | **Scan** |
| Scale an application with demand | **Elastic Load Balancing + EC2 Auto Scaling** |
| Add instances when CPU is above 70% | **Target tracking** policy |
| Unexpected bills, cost-effective resources | **Cost Optimization** pillar |`,
  ru: `## Лекция 1 — основы облака и NIST
- **NIST:** удобный on-demand доступ по сети к общему пулу настраиваемых ресурсов, которые быстро выделяются и освобождаются с минимальными усилиями по управлению.
- **5 характеристик:** on-demand self-service, broad network access, resource pooling (multi-tenant), rapid elasticity, measured service.
- **Модели развёртывания:** public (общее железо провайдера), private (одна организация), hybrid (public + private вместе); community — четвёртая модель NIST.
- **Модели обслуживания:** **IaaS** (серверы, хранилище, сеть — EC2), **PaaS** (платформа для разработки и деплоя — Elastic Beanstalk, App Engine), **SaaS** (софт по подписке — Salesforce).
- **Pay-as-you-go** превращает **CapEx в OpEx**. История: мейнфреймы 1950-х + timesharing → ОС Virtual Machine 1970-х → гипервизоры → облако.
- Драйверы: инфраструктура и нагрузки, SaaS и платформы разработки, скорость и продуктивность, risk exposure. Плюсы: flexibility, efficiency, strategic value.
- Риски: безопасность данных, governance и суверенитет, compliance, нет стандартов, выбор моделей и провайдеров, непрерывность бизнеса.
## Лекция 2 — инфраструктура, виртуализация, контейнеры
- Глобальная инфраструктура = **Regions → Availability Zones → Edge locations**. AZ — один или несколько дата-центров с независимым питанием и охлаждением; AZ находятся в пределах **100 км** друг от друга.
- Region выбирают по **data governance (GDPR), задержке, набору сервисов, цене**.
- Azure **regional pair** — два региона одной geography, обновляются по очереди. В стойке 30–40 серверов; в дата-центре 50–80 тысяч.
- **Type 1** гипервизор — bare-metal, прямо на железе (ESXi, Hyper-V, KVM), самый безопасный, минимальная задержка. **Type 2** — hosted, поверх ОС (VirtualBox, VMware Workstation).
- Типы VM: **shared** (multi-tenant, почасово), **spot/transient** (дешевле всех, могут забрать в любой момент), **reserved** (на 1 или 3 года, дешевле), **dedicated host** (single-tenant, для compliance и лицензий).
- **Bare metal:** физический single-tenant сервер без гипервизора, провайдер отвечает до уровня ОС; для HPC, AI, ERP; выдаётся за 20–40 минут, дороже.
- Облачная сеть: **VPC → subnets**; **ACL** охраняет подсеть, **security group** — инстанс; public gateway, VPN, load balancer, Direct Link.
- **Container** = приложение + библиотеки + зависимости, делит ядро хоста, без guest OS. **Image** — шаблон; **container** — его запущенный экземпляр.
- Docker устроен как клиент–сервер; containerd управляет **runC** (OCI). **docker pull alpine**, **docker run -it alpine sh**, **docker run -d nginx**.
## Лекция 3 — вычисления
| Категория | Сервис AWS |
|---|---|
| IaaS, виртуальные машины | **EC2** |
| Serverless, функции | **Lambda** |
| Контейнеры | **ECS, EKS, Fargate, ECR** |
| PaaS для веб-приложений | **Elastic Beanstalk** |
- **EC2** запускается из **AMI** (шаблон root volume, launch permissions, block device mapping). Источники AMI: Quick Start, My AMIs, Marketplace, Community (на свой риск).
- **t3.large**: t — семейство, 3 — поколение, large — размер; каждый шаг размера удваивает vCPU и память. T3 — burstable, **C5 — compute**, **R5 — memory**.
- **Scale up** (вертикально) — сервер мощнее; **scale out** (горизонтально) — больше серверов. **EC2 Auto Scaling** запускает и гасит инстансы.
- **ECS** оркестрирует Docker на кластере EC2; **task definition** описывает до 10 контейнеров. С **Fargate** кластером управляет AWS.
- **Kubernetes:** на nodes работают **pods**, control plane их планирует, **kubelet** связывает node с control plane, Deployment сам восстанавливает упавшее. **EKS** = managed Kubernetes.
- Azure: Virtual Machines, App Service, Container Instances, AKS, Functions, Virtual Desktop. GCP: Compute Engine, App Engine, Cloud GPUs, **TPU** (ASIC Google для нейросетей).
## Лекция 3 — хранилище
| Тип | Доступ | Главное |
|---|---|---|
| Direct attached | Локальный диск | Быстро, **ephemeral**, только ОС |
| File (NFS) | Ethernet | Много узлов, дешевле, скорость плавает |
| Block (SAN) | Оптика | **Один узел**, быстро, базы данных |
| Object | **API** | Дешевле всех, медленнее всех, бесконечно |
- **IOPS** = скорость чтения/записи дисков (не сети). Мало — узкое место; много — переплата. У object storage опций IOPS нет.
- **Persistent** хранилище переживает узел; **ephemeral** удаляется вместе с ним. **Snapshot** — снимок на момент времени, быстро, без простоя, не для отдельных файлов.
- **S3:** бакеты с глобально уникальными именами, объекты до **5 ТБ**, durability **11 девяток**, данные в **3+ AZ**; плоская структура, бакет в бакет не вложить.
- Классы: **Standard**, **Intelligent-Tiering** (30 дней), **Standard-IA**, **One Zone-IA** (одна AZ), **Glacier**, **Glacier Deep Archive** (дешевле всех, восстановление до 12 ч).
## Лекция 4 — сети
- IPv4 = **32 бита**, IPv6 = **128 бит**. **/24 = 256** адресов, **/16 = 65 536**, **/32** — один хост, **0.0.0.0/0** — весь интернет.
- OSI: коммутаторы работают на **уровне 2**, маршрутизаторы — на **уровне 3**; TCP/UDP — на уровне 4.
- **VPC** — один Region, много AZ; CIDR от **/16** (самый большой) до **/28** (самый маленький), потом не поменять. **Subnet** — одна AZ, CIDR подсетей не пересекаются.
- AWS резервирует **5 адресов** в каждой подсети, поэтому в /24 доступно **251**:
= 10.0.0.0 network · 10.0.0.1 router · 10.0.0.2 DNS · 10.0.0.3 future · 10.0.0.255 broadcast
- **Route table:** destination + target, неудаляемый маршрут **local**; у подсети одна route table. Public subnet: **0.0.0.0/0 → igw**.
- **NAT gateway** стоит в public subnet с **Elastic IP**: приватные инстансы выходят наружу, а интернет не может начать соединение внутрь.
- **Peering** — диапазоны не пересекаются, **не транзитивен**. **Transit Gateway** — hub and spoke. **Site-to-Site VPN** — virtual gateway + customer gateway. **Direct Connect** — выделенная линия, **802.1q VLAN**.
- **VPC endpoints:** interface (**PrivateLink**, платный) и gateway (**S3 и DynamoDB**, бесплатный).
| Признак | Security group | Network ACL |
|---|---|---|
| Уровень | Инстанс | Подсеть |
| Правила | Только allow | Allow и deny |
| Состояние | **Stateful** | **Stateless** |
| Порядок | Проверяются все правила | По номеру, с меньшего |
| По умолчанию | Вход запрещён, выход разрешён | Default пускает всё; custom запрещает всё |
- **CDN** — кешированные копии с ближайшей точки. **SDN** — control plane уходит в центральный **controller**; data plane остаётся в коммутаторах.
- Уровни SDN: application, control, infrastructure; **northbound API** (приложения ↔ контроллер), **southbound** (контроллер ↔ коммутаторы, OpenFlow). Минус: **single point of failure**.
## Лекция 5 — внедрение и новые технологии
- Microsoft **CAF**: Strategy, Plan, Ready, Adopt, Govern, Manage.
- **American Airlines** — от монолита к микросервисам ради лучшего обслуживания клиентов. **Spotify** — переезд на **GCP** (планировали с 2015), сервисы и данные заняли по году, инженеры освободились для инноваций.
- **Dropbox** — ушёл с **Amazon S3**, перенёс около **90%** файлов к себе ради цены и контроля: своя инфраструктура всё ещё подходит достаточно крупному бизнесу.
- **Netflix** — видео на **S3 + Open Connect**, Kafka для стриминга, Chaos Monkey и Spinnaker в CI/CD.
- **IoT даёт данные, AI — выводы, облако — масштаб.** Blockchain — надёжный, неизменяемый, децентрализованный источник истины.
## Мидтерм: сценарий → ответ
| Сценарий в вопросе | Ответ |
|---|---|
| Новое приложение, нагрузка неизвестна, без долгих обязательств | **On-Demand** |
| Стабильная предсказуемая нагрузка минимум на год | **Reserved Instances** (на 1 год) |
| Stateless-задача, которую можно прерывать, минимальная цена | **Spot Instances** |
| Ежемесячные отчёты по огромным данным по расписанию | **Scheduled Reserved Instances** |
| Compliance, полный контроль над физическим сервером | **Dedicated Hosts** |
| Избежать крупных затрат на железо заранее | **Pay-as-you-go** |
| Три отдельные группы дата-центров со своим питанием и охлаждением внутри региона | **Availability Zones** |
| Приложение легло, когда в одной AZ пропало питание | **Несколько AZ в том же регионе** |
| Кто вчера удалил инстанс EC2? | **AWS CloudTrail** |
| Мониторинг ресурсов и приложений в реальном времени | **Amazon CloudWatch** |
| Отправить оповещения по CloudWatch alarm | **Amazon SNS** |
| Одних уведомить сразу, другим дать обработать позже | **Amazon SNS** (fan-out в SQS) |
| Автоматически найти неиспользуемые access keys IAM | **AWS Trusted Advisor** |
| Приложению на EC2 безопасно нужен доступ к DynamoDB | **IAM role**, прикреплённая к инстансу |
| Временный доступ к правам | **IAM role** |
| Руководитель каждый день входит под root | **IAM users** для работы + **MFA на root** |
| Необязательная защита на уровне подсети | **Network ACL** |
| Сайт не открывается, security group пускает только порт 22 | Добавить **входящий TCP 80** в эту security group |
| Приватный инстанс не выходит в интернет | Нет **NAT gateway** |
| Public subnet против private subnet | Маршрут **0.0.0.0/0 → internet gateway** |
| Пользователи в Европе и Азии, направлять в самый быстрый регион | Route 53 **latency-based** routing |
| 10 инстансов одновременно читают и пишут общие файлы | **Amazon EFS** |
| Общее файловое хранилище Windows по SMB | **Amazon FSx** |
| Один том EBS для инстансов в разных AZ | Невозможно — EBS привязан к AZ, нужен **EFS** |
| Durability 11 девяток, документы и фото | **Amazon S3** |
| Автоматический failover RDS в другую AZ | **RDS Multi-AZ** (столп **Reliability**) |
| Поиск в DynamoDB по атрибуту, который не ключ | **Scan** |
| Масштабировать приложение по спросу | **Elastic Load Balancing + EC2 Auto Scaling** |
| Добавлять инстансы, когда CPU выше 70% | Политика **target tracking** |
| Неожиданные счета, выгодные ресурсы | Столп **Cost Optimization** |`,
};
