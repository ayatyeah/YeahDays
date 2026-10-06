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
- **IoT delivers the data, AI powers the insights, the cloud gives the scale.** Blockchain — a trusted, immutable, decentralized source of truth.`,
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
- **IoT даёт данные, AI — выводы, облако — масштаб.** Blockchain — надёжный, неизменяемый, децентрализованный источник истины.`,
};
