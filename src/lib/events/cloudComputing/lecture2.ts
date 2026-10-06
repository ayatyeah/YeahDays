import { part, qx, tfx, type Lecture } from "../types";

export const lecture2: Lecture = {
  id: "cc-l2",
  title: {
    en: "Lecture 2 — Components of Cloud Computing. Global Infrastructure",
    ru: "Лекция 2 — Компоненты облачных вычислений. Глобальная инфраструктура",
  },
  parts: [
    part(
      "cc-l2-p1",
      { en: "Global infrastructure and data centers", ru: "Глобальная инфраструктура и дата-центры" },
      {
        en: `## Global infrastructure
The **global infrastructure** of a cloud platform is its **physical** infrastructure. It consists of three building blocks:
- **Geographical Regions** — physical locations of data centers around the world;
- **Availability Zones (AZs)** — isolated groups of data centers inside a Region;
- **Network Edge Locations** — points of presence close to end users that deliver content with low latency.
## Data center (DC)
A **data center** is a specialized facility: a connected system of **IT infrastructure** (servers, storage, network) and **engineering infrastructure** (power, cooling, physical security), located in a building or room that is connected to external networks.
Inside, the building blocks go from small to large:
- **Server (node)** — one computer made of a **CPU**, **RAM**, data storage (**HDD/SSD**) and a **network interface card (NIC)**.
- **Rack** — a cabinet containing several nodes and network equipment; there can be **30 to 40 servers** in a rack.
- **Cluster** — several racks connected by a computer network.
- **Data center** — roughly **50–80 thousand servers** in one building.
| Level | What it is | Typical scale |
|---|---|---|
| Node (server) | CPU + RAM + HDD/SSD + NIC | one computer |
| Rack | cabinet of nodes and network equipment | 30–40 servers |
| Cluster | racks linked by a computer network | several racks |
| Data center | building connected to external networks | ~50–80 thousand servers |
![Long aisle inside a hyperscale data center: rows of tall black server racks with blue status lights on both sides, overhead cable trays, a polished grey concrete floor](/events/cc/l2-datacenter-aisle.webp)
## Regions and Availability Zones (AWS)
- A **Region** is a physical location of data centers around the world.
- Each AWS Region consists of **multiple, isolated and physically separate AZs** within a geographic area.
- An **Availability Zone (AZ)** is **one or more discrete data centers** with **independent power, cooling and physical security**, connected by **redundant, low-latency** networking.
- AZs are separated by a **meaningful distance** — many kilometers — from any other AZ, yet all AZs of a Region are within **100 km (60 miles)** of each other.
@diagram cc-region-az
Why it matters: an application **partitioned across AZs** is more **highly available, fault tolerant and scalable** than one in a single data center, and is better protected from power outages, lightning strikes, tornadoes and earthquakes.
## AWS by numbers
At the time of the lecture AWS spanned **81 Availability Zones** within **25 geographic Regions**, with announced plans for **21 more AZs** and **7 more Regions** (Australia, India, Indonesia, Israel, Spain, Switzerland, UAE).
## Selecting a Region
Determine the right Region for your services, applications and data with four factors:
- **Data governance and legal requirements** — local laws may require certain data to stay within geographic boundaries, for example the EU **General Data Protection Regulation (GDPR)**.
- **Proximity to customers (latency)** — run apps and store data as close as possible to the users and systems that access them.
- **Services available within the Region** — not all services are available in all Regions.
- **Costs** — they vary by Region:
= t3.medium Linux On-Demand: US East (Ohio) $0.0416/hour vs Asia Pacific (Tokyo) $0.0544/hour
| Factor | Question to ask | Example |
|---|---|---|
| Governance, legal | May the data leave this territory? | GDPR keeps EU data in the EU |
| Latency | Where are my users? | users in Japan → a Tokyo Region |
| Services | Is the service offered there? | a new service exists in few Regions |
| Cost | What does it cost here? | Ohio is cheaper than Tokyo |
![Screenshot of the AWS Management Console with the Region drop-down menu open in the top-right corner, listing US East (N. Virginia) us-east-1, US East (Ohio) us-east-2, Europe (Frankfurt) eu-central-1 and Asia Pacific (Tokyo) ap-northeast-1](/events/cc/l2-aws-region-picker.webp)
## Microsoft Azure
Azure global infrastructure has two key components — **physical infrastructure** and **connective network components**: **200+ physical datacenters**, arranged into regions and linked by one of the largest interconnected networks on the planet.
- **Region** — a set of datacenters deployed within a **latency-defined perimeter** and connected through a dedicated regional low-latency network.
- **Geography** — an area of the world containing at least one Azure region; a discrete market, typically with two or more regions, that preserves **data residency and compliance** boundaries.
- **Regional pair** — two regions within the same geography. Azure **serializes planned platform updates** across a pair, so only one region of the pair updates at a time; in a multi-region outage at least one region of each pair is **prioritized for recovery**.
- Azure by numbers: **60+ regions**, **150+ zones**, **180+ edge locations**, **200+ datacenters**.
## Google Cloud Platform (GCP)
Google Cloud products are served from specific **regional failure domains** and are fully supported by **Service Level Agreements (SLAs)**. Locations in North America, South America, Europe, Asia and Australia are divided into **regions and zones**; you choose where to place apps to meet **latency, availability and durability** requirements.
- A GCP region usually has **3 zones** (Iowa is the exception with 4).
- GCP by numbers: **28 regions**, **85 zones**, **146 network edge locations**, available in **200+ countries and territories**.
- The **Google Cloud Region Picker** recommends a region by weighing **carbon footprint, price and latency**.
| Provider | Regions | Zones | Edge locations | Also |
|---|---|---|---|---|
| AWS | 25 | 81 AZs | — | +7 Regions and +21 AZs announced |
| Azure | 60+ | 150+ | 180+ | 200+ datacenters, regional pairs |
| GCP | 28 | 85 | 146 | 200+ countries and territories |
## Sustainability
Google matches **100%** of the energy consumed by its global operations with **renewable energy** purchases, so every Google Cloud product has **zero net carbon emissions**. Other figures: **90%** of waste diverted from landfills, data centers **2x** more efficient than typical enterprise ones, **PUE 1.1** (Power Usage Effectiveness — total facility energy divided by IT equipment energy; 1.0 is ideal). All big three providers run programs for renewable energy, positive water use in cooling and waste management.
> Region = a geographic area; AZ = one or more isolated data centers inside it; edge location = a point close to users. Spread a workload across AZs to survive the failure of one.
?? A German retailer must keep customer data in the EU and wants fast pages for German shoppers. Which Region-selection factors decide, and what is a good choice?
?= Data governance / legal requirements (GDPR) and proximity to customers (latency) — an EU Region close to Germany, such as Frankfurt.
?? What makes two Availability Zones of one Region independent of each other?
?= Each has its own power, cooling and physical security, and they are many kilometers apart (yet within 100 km), linked by redundant low-latency networks.`,
        ru: `## Глобальная инфраструктура
**Global infrastructure (глобальная инфраструктура)** облачной платформы — это её **физическая** инфраструктура. Она состоит из трёх элементов:
- **Geographical Regions (географические регионы)** — физические места расположения дата-центров по всему миру;
- **Availability Zones (AZ, зоны доступности)** — изолированные группы дата-центров внутри региона;
- **Network Edge Locations (точки присутствия на границе сети)** — узлы рядом с конечными пользователями, которые доставляют контент с малой задержкой.
## Дата-центр (DC)
**Data center (дата-центр)** — специализированный объект: связанная система **IT-инфраструктуры** (серверы, хранилища, сеть) и **инженерной инфраструктуры** (питание, охлаждение, физическая охрана), размещённая в здании или помещении, подключённом к внешним сетям.
Внутри элементы идут от малого к большому:
- **Server (node, сервер или узел)** — один компьютер: **CPU**, **RAM**, накопитель (**HDD/SSD**) и **сетевая карта (NIC)**.
- **Rack (стойка)** — шкаф с несколькими узлами и сетевым оборудованием; в стойке бывает **от 30 до 40 серверов**.
- **Cluster (кластер)** — несколько стоек, связанных компьютерной сетью.
- **Data center** — примерно **50–80 тысяч серверов** в одном здании.
| Уровень | Что это | Типичный масштаб |
|---|---|---|
| Node (сервер) | CPU + RAM + HDD/SSD + NIC | один компьютер |
| Rack (стойка) | шкаф с узлами и сетевым оборудованием | 30–40 серверов |
| Cluster (кластер) | стойки, связанные компьютерной сетью | несколько стоек |
| Data center | здание, подключённое к внешним сетям | ~50–80 тысяч серверов |
![Длинный проход внутри гипермасштабного дата-центра: по обе стороны ряды высоких чёрных серверных стоек с синими индикаторами, над ними кабельные лотки, пол из полированного серого бетона](/events/cc/l2-datacenter-aisle.webp)
## Регионы и зоны доступности (AWS)
- **Region (регион)** — физическое место расположения дата-центров в мире.
- Каждый регион AWS состоит из **нескольких изолированных и физически разделённых AZ** в одной географической области.
- **Availability Zone (AZ)** — это **один или несколько отдельных дата-центров** с **независимым питанием, охлаждением и физической охраной**, связанных **резервированной сетью с малой задержкой (low-latency)**.
- AZ разнесены на **значительное расстояние** — многие километры — друг от друга, но все AZ одного региона находятся в пределах **100 км (60 миль)** друг от друга.
@diagram cc-region-az
Почему это важно: приложение, **распределённое по нескольким AZ**, более **высокодоступно (highly available), отказоустойчиво (fault tolerant) и масштабируемо**, чем в одном дата-центре, и лучше защищено от отключений питания, ударов молний, торнадо и землетрясений.
## AWS в цифрах
На момент лекции AWS охватывал **81 Availability Zone** в **25 географических регионах** и объявил планы ещё на **21 AZ** и **7 регионов** (Австралия, Индия, Индонезия, Израиль, Испания, Швейцария, ОАЭ).
## Выбор региона
Подходящий регион для сервисов, приложений и данных выбирают по четырём факторам:
- **Data governance and legal requirements (управление данными и законы)** — местные законы могут требовать хранить определённые данные в пределах территории, например европейский **GDPR** (общий регламент по защите данных).
- **Proximity to customers (близость к клиентам, latency)** — запускайте приложения и храните данные как можно ближе к пользователям и системам, которые к ним обращаются.
- **Services available within the Region (доступные в регионе сервисы)** — не все сервисы есть во всех регионах.
- **Costs (стоимость)** — цены различаются по регионам:
= t3.medium Linux On-Demand: US East (Ohio) $0.0416/hour vs Asia Pacific (Tokyo) $0.0544/hour
| Фактор | Какой вопрос задать | Пример |
|---|---|---|
| Законы, управление данными | Можно ли данным покидать территорию? | GDPR держит данные ЕС в ЕС |
| Latency | Где мои пользователи? | пользователи в Японии → регион Tokyo |
| Сервисы | Есть ли там нужный сервис? | новый сервис есть лишь в части регионов |
| Стоимость | Сколько это стоит здесь? | Ohio дешевле, чем Tokyo |
![Скриншот AWS Management Console с открытым в правом верхнем углу выпадающим списком регионов: US East (N. Virginia) us-east-1, US East (Ohio) us-east-2, Europe (Frankfurt) eu-central-1 и Asia Pacific (Tokyo) ap-northeast-1](/events/cc/l2-aws-region-picker.webp)
## Microsoft Azure
Глобальная инфраструктура Azure состоит из двух ключевых частей — **физической инфраструктуры** и **связующих сетевых компонентов**: **200+ физических дата-центров**, сгруппированных в регионы и связанных одной из крупнейших сетей на планете.
- **Region (регион)** — набор дата-центров в пределах **периметра, заданного задержкой (latency-defined perimeter)**, связанных выделенной региональной сетью с малой задержкой.
- **Geography (география)** — область мира, где есть хотя бы один регион Azure; отдельный рынок, обычно с двумя и более регионами, который сохраняет границы **размещения данных и соответствия требованиям (data residency and compliance)**.
- **Regional pair (региональная пара)** — два региона в одной географии. Azure **проводит плановые обновления платформы по очереди (serializes)**: в паре обновляется только один регион за раз; при сбое в нескольких регионах хотя бы один регион каждой пары **восстанавливают в первую очередь**.
- Azure в цифрах: **60+ регионов**, **150+ зон**, **180+ edge locations**, **200+ дата-центров**.
## Google Cloud Platform (GCP)
Продукты Google Cloud обслуживаются из определённых **региональных доменов отказа (regional failure domains)** и полностью покрыты **соглашениями об уровне сервиса (SLA)**. Площадки в Северной и Южной Америке, Европе, Азии и Австралии делятся на **регионы и зоны (regions and zones)**; место для приложения выбирают под требования к **задержке, доступности и долговечности (durability)**.
- В регионе GCP обычно **3 зоны** (исключение — Iowa, там 4).
- GCP в цифрах: **28 регионов**, **85 зон**, **146 network edge locations**, доступен в **200+ странах и территориях**.
- **Google Cloud Region Picker** рекомендует регион, взвешивая **углеродный след, цену и задержку**.
| Провайдер | Регионы | Зоны | Edge locations | Ещё |
|---|---|---|---|---|
| AWS | 25 | 81 AZ | — | объявлены +7 регионов и +21 AZ |
| Azure | 60+ | 150+ | 180+ | 200+ дата-центров, региональные пары |
| GCP | 28 | 85 | 146 | 200+ стран и территорий |
## Экологичность (sustainability)
Google покрывает **100%** энергии своих глобальных операций покупкой **возобновляемой энергии**, поэтому у каждого продукта Google Cloud **нулевые чистые выбросы углерода**. Другие цифры: **90%** отходов не попадает на свалки, дата-центры **в 2 раза** эффективнее типичных корпоративных, **PUE 1.1** (Power Usage Effectiveness — вся энергия объекта, делённая на энергию IT-оборудования; идеал 1.0). У всех трёх крупнейших провайдеров есть программы по возобновляемой энергии, бережному использованию воды для охлаждения и переработке отходов.
> Region = географическая область; AZ = один или несколько изолированных дата-центров в ней; edge location = точка рядом с пользователями. Распределите нагрузку по нескольким AZ, чтобы пережить отказ одной из них.
?? Немецкий магазин должен хранить данные клиентов в ЕС и хочет быстрые страницы для покупателей в Германии. Какие факторы выбора региона решают и какой выбор хорош?
?= Законы и управление данными (GDPR) и близость к клиентам (latency) — регион ЕС рядом с Германией, например Frankfurt.
?? Что делает две Availability Zone одного региона независимыми друг от друга?
?= У каждой своё питание, охлаждение и физическая охрана, они разнесены на многие километры (но в пределах 100 км) и связаны резервированными сетями с малой задержкой.`,
      },
      [
        qx("Which three building blocks make up the global infrastructure of a cloud platform?", "Regions, Availability Zones and edge locations", [
          ["Regions, subnets and virtual private clouds", "Subnets and VPCs are logical networks that users create, not the physical global infrastructure.", "Подсети и VPC — логические сети, которые создают пользователи, а не физическая глобальная инфраструктура."],
          ["Data centers, hypervisors and container runtimes", "Hypervisors and container runtimes are software layers that run inside data centers.", "Гипервизоры и среды запуска контейнеров — программные слои, работающие внутри дата-центров."],
          ["Geographies, tenants and cloud service models", "Tenants and service models describe who uses the cloud and how, not its physical layout.", "Арендаторы и модели сервисов описывают, кто и как пользуется облаком, а не его физическое устройство."],
        ], "Global infrastructure is the physical layer: Geographical Regions, Availability Zones and Network Edge Locations.", "Глобальная инфраструктура — физический уровень: географические регионы, зоны доступности и edge locations."),
        qx("What does a single server (node) in a data center consist of?", "CPU, RAM, HDD/SSD storage and a NIC", [
          ["CPU, hypervisor, guest OS and a vNIC", "A hypervisor, a guest OS and a vNIC are software, not the hardware parts of a node.", "Гипервизор, гостевая ОС и vNIC — программные элементы, а не аппаратные части узла."],
          ["Several nodes plus network equipment in a cabinet", "That describes a rack, the cabinet that holds 30–40 nodes.", "Это описание стойки (rack) — шкафа, где стоят 30–40 узлов."],
          ["GPU, power supply, router and a firewall", "Routers and firewalls are network appliances, not the parts of one server.", "Маршрутизаторы и межсетевые экраны — сетевые устройства, а не части одного сервера."],
        ], "A node is one computer: a central processing unit, random access memory, HDD/SSD storage and a network interface card.", "Узел — один компьютер: процессор, оперативная память, накопитель HDD/SSD и сетевая карта."),
        qx("According to the lecture, how many servers can there be in one rack?", "From 30 to 40", [
          ["From 3 to 4", "A rack holds far more than a handful of servers; 3–4 is ten times too few.", "В стойку помещается гораздо больше серверов; 3–4 — в десять раз меньше."],
          ["From 300 to 400", "That is ten times too many for one cabinet; it is closer to a cluster of racks.", "Для одного шкафа это в десять раз больше; это скорее кластер из стоек."],
          ["From 50 to 80 thousand", "50–80 thousand servers is the size of a whole data center, not a rack.", "50–80 тысяч серверов — размер целого дата-центра, а не стойки."],
        ], "A rack is a cabinet with several nodes and network equipment; it can hold 30 to 40 servers.", "Стойка — шкаф с узлами и сетевым оборудованием; в ней может быть от 30 до 40 серверов."),
        qx("What is a cluster in a data center?", "Several racks connected by a computer network", [
          ["A cabinet that holds several nodes and switches", "A cabinet with nodes and network equipment is a rack; a cluster joins several racks.", "Шкаф с узлами и сетевым оборудованием — это стойка; кластер объединяет несколько стоек."],
          ["One or more discrete data centers with own power", "That is the definition of an Availability Zone, which is much larger than a cluster.", "Это определение Availability Zone, которая намного больше кластера."],
          ["Two regions within the same geography", "That is an Azure regional pair, a concept of global infrastructure.", "Это региональная пара Azure — понятие глобальной инфраструктуры."],
        ], "Node → rack (cabinet of nodes) → cluster (several racks linked by a network) → data center.", "Узел → стойка (шкаф с узлами) → кластер (несколько стоек, связанных сетью) → дата-центр."),
        qx("Approximately how many servers does a large data center hold?", "About 50–80 thousand servers", [
          ["About 30–40 servers", "30–40 servers fit in a single rack, not in a whole data center.", "30–40 серверов помещаются в одну стойку, а не в весь дата-центр."],
          ["About 500–800 servers", "That is only a few clusters; a data center is about a hundred times bigger.", "Это лишь несколько кластеров; дата-центр примерно в сто раз больше."],
          ["About 300–400 thousand servers", "This overstates the slide's figure several times; it gives 50–80 thousand.", "Это в несколько раз больше цифры со слайда: там 50–80 тысяч."],
        ], "The lecture gives the scale of a data center as roughly 50–80 thousand servers.", "В лекции масштаб дата-центра — примерно 50–80 тысяч серверов."),
        qx("Which definition best describes a data center (DC)?", "An IT and engineering facility connected to external networks", [
          ["A single cabinet holding 30–40 servers and a switch", "A cabinet of servers is a rack, only one small part of a data center.", "Шкаф с серверами — это стойка, лишь небольшая часть дата-центра."],
          ["A software layer that pulls host resources and allocates them to VMs", "That describes a hypervisor, software that runs on servers inside a DC.", "Это описание гипервизора — ПО, работающего на серверах внутри дата-центра."],
          ["A small point of presence that caches content near users", "That is a network edge location, not a full data center.", "Это edge location (точка присутствия), а не полноценный дата-центр."],
        ], "A DC is a specialized facility combining IT and engineering infrastructure in a building connected to external networks.", "Дата-центр — специализированный объект, объединяющий IT- и инженерную инфраструктуру в здании, подключённом к внешним сетям."),
        qx("What is an Availability Zone (AZ) in AWS?", "One or more discrete data centers with independent power", [
          ["A single rack with its own power supply and cooling", "An AZ is far larger than a rack; it is one or more entire data centers.", "AZ гораздо больше стойки — это один или несколько целых дата-центров."],
          ["A point of presence that caches content near users", "That is a network edge location, not an Availability Zone.", "Это edge location, а не зона доступности."],
          ["A group of Regions inside one country that share a legal framework", "It is the other way round: a Region contains several AZs.", "Всё наоборот: регион содержит несколько AZ."],
        ], "An AZ is one or more discrete data centers with independent power, cooling and physical security, linked by redundant low-latency networks.", "AZ — один или несколько отдельных дата-центров с независимым питанием, охлаждением и охраной, связанных резервированной сетью с малой задержкой."),
        qx("How far apart are the Availability Zones of one AWS Region?", "Many kilometers apart, but within 100 km of each other", [
          ["In the same building, separated only by firewalls", "AZs must survive local disasters, so they are physically separate sites, not rooms in one building.", "AZ должны переживать местные аварии, поэтому это разные площадки, а не комнаты одного здания."],
          ["At least 1,000 km apart, usually on different continents", "AZs of one Region stay within 100 km to keep latency low; continents separate Regions.", "AZ одного региона держатся в пределах 100 км ради малой задержки; континенты разделяют регионы."],
          ["Exactly 60 km apart, as required by an AWS design rule", "60 miles is the upper bound (100 km), not an exact required distance.", "60 миль — это верхняя граница (100 км), а не точное обязательное расстояние."],
        ], "AZs are separated by a meaningful distance of many kilometers, yet all are within 100 km (60 miles) of each other.", "AZ разнесены на многие километры, но все находятся в пределах 100 км (60 миль) друг от друга."),
        qx("An admin runs a database in two AZs instead of one. What is the main benefit?", "Higher availability and fault tolerance", [
          ["A lower hourly price for each instance", "Running in two AZs usually costs more, not less; the gain is resilience.", "Работа в двух AZ обычно дороже, а не дешевле; выигрыш — в устойчивости."],
          ["No need to pick a Region for the database", "AZs live inside a Region, so a Region still has to be chosen.", "AZ находятся внутри региона, поэтому регион всё равно нужно выбрать."],
          ["Data is automatically kept within the EU", "Legal data residency depends on the Region choice, not on using two AZs.", "Юридическое размещение данных зависит от выбора региона, а не от двух AZ."],
        ], "An app partitioned across AZs survives a power outage, fire or flood in one of them, so it is more available and fault tolerant.", "Приложение, распределённое по AZ, переживает отключение питания, пожар или наводнение в одной из них — оно доступнее и отказоустойчивее."),
        qx("Which figures describe the AWS global infrastructure at the time of the lecture?", "81 Availability Zones within 25 Regions", [
          ["25 Availability Zones within 81 Regions", "The numbers are swapped; each Region contains several AZs, so AZs outnumber Regions.", "Числа перепутаны: в каждом регионе несколько AZ, значит AZ больше, чем регионов."],
          ["85 Availability Zones within 28 Regions", "28 regions and 85 zones are the Google Cloud figures.", "28 регионов и 85 зон — это цифры Google Cloud."],
          ["150 Availability Zones within 60 Regions", "60+ regions and 150+ zones are the Microsoft Azure figures.", "60+ регионов и 150+ зон — это цифры Microsoft Azure."],
        ], "AWS spanned 81 AZs in 25 Regions, with 21 more AZs and 7 more Regions announced.", "AWS охватывал 81 AZ в 25 регионах; были объявлены ещё 21 AZ и 7 регионов."),
        qx("A bank must keep EU customers' data inside the EU. Which Region-selection factor is this?", "Data governance and legal requirements", [
          ["Proximity to customers (latency)", "Latency is about speed for users; the bank's constraint here is a legal one.", "Latency — про скорость для пользователей, а у банка здесь юридическое ограничение."],
          ["Services available within the Region", "Service availability is about features offered, not about where data may legally be stored.", "Доступность сервисов — про набор функций, а не про то, где данные можно хранить по закону."],
          ["Costs that vary from one Region to another", "Price differences do not decide whether data may leave the EU.", "Разница в цене не решает, можно ли данным покидать ЕС."],
        ], "Local laws such as the EU GDPR may require data to stay within geographic boundaries — data governance and legal requirements.", "Местные законы, например GDPR в ЕС, могут требовать хранить данные в пределах территории — это фактор управления данными и законов."),
        qx("The same t3.medium instance costs $0.0416/h in Ohio and $0.0544/h in Tokyo. Which factor does this show?", "Prices differ from Region to Region", [
          ["Latency depends on the distance to users", "The example compares hourly prices, not network delay.", "В примере сравниваются цены за час, а не сетевая задержка."],
          ["Not all services exist in all Regions", "The same instance type is available in both Regions; only its price differs.", "Тот же тип инстанса есть в обоих регионах — отличается только цена."],
          ["Local laws restrict where data is kept", "Nothing in the example is about legal data residency.", "В примере нет ничего о юридическом размещении данных."],
        ], "Cost is one of the four Region-selection factors: the same instance is cheaper in US East (Ohio) than in Asia Pacific (Tokyo).", "Стоимость — один из четырёх факторов выбора региона: тот же инстанс дешевле в US East (Ohio), чем в Asia Pacific (Tokyo)."),
        qx("In Microsoft Azure, what is a regional pair?", "Two regions within the same geography", [
          ["Two Availability Zones within one region", "Zones are inside a region; a regional pair links two whole regions.", "Зоны находятся внутри региона, а региональная пара связывает два целых региона."],
          ["Two datacenters in the same building", "A pair is made of regions, each with many datacenters, not of two datacenters.", "Пару образуют регионы, в каждом из которых много дата-центров, а не два дата-центра."],
          ["A region paired with its nearest edge location", "Edge locations are not part of the regional pair concept.", "Edge locations не входят в понятие региональной пары."],
        ], "A regional pair is two regions within the same geography; updates and recovery are coordinated across the pair.", "Региональная пара — два региона в одной географии; обновления и восстановление согласуются внутри пары."),
        qx("Why does Azure serialize planned platform updates across a regional pair?", "So only one region of the pair updates at a time", [
          ["So both regions update together and finish faster", "Updating both at once could take the whole pair down — exactly what serializing avoids.", "Обновление обоих сразу может уронить всю пару — именно этого и избегают."],
          ["So customer data moves into another geography", "A pair stays within one geography to preserve data residency.", "Пара остаётся в одной географии, чтобы сохранить размещение данных."],
          ["So the two regions are merged into one zone", "Regions in a pair stay separate; nothing is merged.", "Регионы пары остаются раздельными, ничего не объединяется."],
        ], "Serialized updates mean one region of each pair keeps running while the other is being updated.", "Обновления по очереди означают, что один регион пары работает, пока обновляется другой."),
        qx("Which set of numbers matches Microsoft Azure's global infrastructure in the lecture?", "60+ regions, 150+ zones, 200+ datacenters", [
          ["25 regions, 81 zones, 7 planned regions", "25 Regions and 81 AZs are the AWS figures.", "25 регионов и 81 AZ — это цифры AWS."],
          ["28 regions, 85 zones, 146 edge locations", "28 regions, 85 zones and 146 edge locations are the Google Cloud figures.", "28 регионов, 85 зон и 146 edge locations — цифры Google Cloud."],
          ["600+ regions, 1,500+ zones, 2,000+ datacenters", "These are ten times the real Azure figures.", "Это в десять раз больше реальных цифр Azure."],
        ], "Azure: 60+ regions, 150+ zones, 180+ edge locations and 200+ datacenters.", "Azure: 60+ регионов, 150+ зон, 180+ edge locations и 200+ дата-центров."),
        qx("How many network edge locations did Google Cloud list in the lecture?", "146", [
          ["85", "85 is the number of Google Cloud zones.", "85 — число зон Google Cloud."],
          ["28", "28 is the number of Google Cloud regions.", "28 — число регионов Google Cloud."],
          ["200+", "200+ is the number of countries and territories where Google Cloud is available.", "200+ — число стран и территорий, где доступен Google Cloud."],
        ], "Google Cloud: 28 regions, 85 zones, 146 network edge locations, available in 200+ countries and territories.", "Google Cloud: 28 регионов, 85 зон, 146 network edge locations, доступен в 200+ странах и территориях."),
        qx("The Google Cloud Region Picker recommends a region based on which factors?", "Carbon footprint, price and latency", [
          ["Number of racks, CPUs and NICs", "The tool does not ask about hardware; users never pick racks or NICs.", "Инструмент не спрашивает о железе: пользователи не выбирают стойки и сетевые карты."],
          ["Tenancy, billing and operating system", "These are choices made when creating a VM, not inputs of the Region Picker.", "Это параметры при создании VM, а не входные данные Region Picker."],
          ["GDPR, HIPAA and PCI DSS compliance", "The picker's sliders are carbon, price and latency, not compliance standards.", "Ползунки инструмента — углерод, цена и задержка, а не стандарты соответствия."],
        ], "The Region Picker lets you weigh lower carbon footprint, lower price and lower latency.", "Region Picker позволяет взвесить меньший углеродный след, меньшую цену и меньшую задержку."),
        qx("Which sustainability figure about Google is given in the lecture?", "100% renewable energy for all cloud regions", [
          ["50% of all waste is sent to landfills", "The slide says 90% of waste is diverted from landfills.", "На слайде сказано, что 90% отходов не попадает на свалки."],
          ["A PUE of 2.5 for its data centers", "Google's PUE is 1.1; 2.5 would mean a very inefficient data center.", "PUE Google — 1.1; 2.5 означало бы очень неэффективный дата-центр."],
          ["Data centers half as efficient as typical ones", "Google's data centers are 2x more efficient, not half as efficient.", "Дата-центры Google в 2 раза эффективнее, а не вдвое хуже."],
        ], "Google matches 100% of its energy use with renewable energy, diverts 90% of waste and reaches a PUE of 1.1.", "Google покрывает 100% энергии возобновляемой, не отправляет на свалки 90% отходов и достигает PUE 1.1."),
        tfx("A typical Google Cloud region has three zones.", true,
          "The GCP map shows current regions with 3 zones; Iowa is the exception with 4.",
          "На карте GCP регионы показаны с 3 зонами; исключение — Iowa, где их 4.",
          "False is wrong: three zones per region is the normal layout shown in the lecture.",
          "«Неверно» — ошибка: три зоны на регион — обычная схема, показанная в лекции."),
        tfx("Every cloud service is available in every Region of a provider.", false,
          "Not all services are available in all Regions — that is why service availability is a Region-selection factor.",
          "Не все сервисы есть во всех регионах — поэтому доступность сервисов и является фактором выбора региона.",
          "True is wrong: if every service were everywhere, this selection factor would not exist.",
          "«Верно» — ошибка: если бы все сервисы были везде, такого фактора выбора не существовало бы."),
      ],
    ),
    part(
      "cc-l2-p2",
      { en: "Cloud data centers, virtualization and hypervisors", ru: "Облачные дата-центры, виртуализация и гипервизоры" },
      {
        en: `## Overview of cloud infrastructure
After choosing a cloud service model and cloud type, customers plan the **infrastructure architecture**. The infrastructure layer is the **foundation of the cloud**. It is made of **data centers, compute, storage and networking**.
## Cloud data centers
A cloud **data center** is a huge room or warehouse containing cloud infrastructure. It holds **pods and racks** (or standardized containers) of computing resources — **servers, storage and networking equipment**, virtually everything a physical IT environment has.
- **Node** — one server: CPU, RAM, storage, NIC.
- **Rack** — a collection of nodes.
- **Cluster** — racks interconnected over a network.
![Open 42U server rack in a data center: a stack of flat 1U and 2U rack servers with green status LEDs and a top-of-rack network switch with bundles of blue and yellow patch cables](/events/cc/l2-server-rack.webp)
## Computing resources
Cloud providers offer three compute options:
- **Virtual servers (VMs)** — **software-based** computers built with virtualization; most servers in a cloud data center run **hypervisors** to create them.
- **Bare metal servers** — **physical servers** in the racks that are not virtualized.
- **"Serverless"** — an **abstraction** layer on top of virtual machines.
Customers provision VMs and bare metal servers **as and when they need them** and run their workloads on them.
## Storage
Data — files, code, documents, images, videos, backups, snapshots, databases — can live in many storage options.
- VMs and bare metal servers come with **default storage on local drives**. Servers are provisioned and decommissioned on demand, so data on a local drive **can be lost** when you delete the server.
- To **persist** data, choose **block, file or object storage**, depending on how important the data is, how quickly and how often you access it and how secure it must be.
- Block and file storage are common in traditional data centers but **often struggle with scale, performance and distributed characteristics** of the cloud.
- **Object storage** is the most common mode in the cloud because it is **highly distributed and resilient**.
@diagram cc-storage-types
## Networking
A cloud data center has traditional hardware — **routers and switches** — but for cloud users the key is **Software Defined Networking (SDN)**: networking resources are virtualized or made available programmatically through **APIs**. This makes network **provisioning, configuration and management** easier.
- **Public network interfaces** connect servers to the public internet.
- **Private network interfaces** connect servers to your other cloud resources and help keep them secure.
- Interfaces need **IP addresses and subnets**, assigned automatically or configured.
- Controlling which traffic and users reach your resources is even more important: **Security Groups** and **Access Control Lists (ACLs)**.
- More isolation: **VLANs** (Virtual LANs), **VPCs** (Virtual Private Clouds) and **VPNs** (Virtual Private Networks).
- Traditional appliances offered as virtual services: **firewalls, load balancers, gateways, traffic analyzers**.
- **Content Delivery Networks (CDNs)** distribute content to many points around the world, so users get it from the point nearest to them.
| Component | Role | Examples |
|---|---|---|
| Data center | physical home of the cloud | pods, racks, servers |
| Compute | runs the workloads | VMs, bare metal, serverless |
| Storage | keeps the data | local drive, block, file, object |
| Networking | connects resources securely | SDN, SG, ACL, VLAN, VPC, VPN, CDN |
## Virtualization
**Virtualization** is the process of creating a **software-based, or virtual, version** of something — compute, storage, networking, servers or applications. It is a fairly old technology, but still central to cloud computing. It is made feasible by the **hypervisor**: software that runs above the physical server (the **host**), **pulls its resources** and **allocates them** to virtual environments.
- A **traditional server** runs one operating system and its applications directly on the hardware.
- A **virtualized server** runs a hypervisor (for example VMware) with **many VMs**, each with its own OS and apps.
- A **virtual infrastructure** layer pools servers, storage and network, and many VMs run on top of it.
## Hypervisor types
- **Type 1 — bare-metal hypervisor**: installed **directly on the physical server**. The most frequently used, the **most secure**, with **lower latency**. Examples: **VMware ESXi, Microsoft Hyper-V, open-source KVM**.
- **Type 2 — hosted hypervisor**: a **host OS** sits between the physical server and the hypervisor. Much less frequent, mostly for **end-user virtualization**, with **higher latency**. Examples: **Oracle VirtualBox, VMware Workstation**.
@diagram cc-hypervisor-types
| Feature | Type 1 (bare-metal) | Type 2 (hosted) |
|---|---|---|
| Runs on | the hardware directly | a host operating system |
| Latency | lower | higher |
| Security | most secure | less secure |
| Use | servers, cloud data centers | end users, laptops, labs |
| Examples | ESXi, Hyper-V, KVM | VirtualBox, VMware Workstation |
Hypervisor platforms shown on the slides: VMware vSphere, Microsoft Hyper-V, Citrix XenServer, Nutanix, KVM, Red Hat, Oracle VM, Solaris, AIX. Monitoring tools watch VMs from the outside, from the inside and through hypervisor metrics.
## Virtual machines
A **VM** is simply a **software-based computer**. It runs like a physical computer, with an **operating system and applications**. VMs are **completely independent** of one another, yet many of them run on one hypervisor, which manages the resources they get from the physical server.
- Because they are independent, VMs on one host can run **different OSes**: Windows, Linux, UNIX.
- They are **extremely portable**: a VM can move from one hypervisor to another on a completely different machine almost instantaneously.
## Benefits of virtualization and VMs
- **Cost savings** — many virtual environments on one piece of infrastructure: a smaller physical footprint, fewer servers to maintain, less electricity.
- **Agility and speed** — spinning up a VM is quick and simple compared with provisioning a whole new environment for developers.
- **Lower downtime** — if a host goes down, its VMs are quickly moved to a hypervisor on a working machine.
| Benefit (slide) | Meaning |
|---|---|
| Operational flexibility | separate instances of multiple OS types |
| Reducing overhead | many VMs on the same underlying hardware |
| Centralization | consolidate systems to simplify management |
| Scalability | scale the virtual environment as the business grows |
| Disaster recovery | restore data and system states from VM instances |
![Screenshot of the Oracle VirtualBox Manager window on a laptop, listing three virtual machines — Ubuntu, Windows 10 and Debian — one of them running, with its settings panel showing 2 CPUs and 4096 MB of RAM](/events/cc/l2-virtualbox-manager.webp)
> Virtualization is the core of cloud computing: a hypervisor turns one physical server into many independent, portable VMs.
?? A developer wants to try Linux inside a Windows laptop. Which hypervisor type fits, and why?
?= Type 2 (hosted), for example VirtualBox: it runs on top of the existing host OS. Its latency is higher, which is fine for end-user virtualization.
?? Why do cloud providers run Type 1 hypervisors in their data centers?
?= Type 1 is installed directly on the hardware, with no host OS in between, so it is the most secure and has the lowest latency.`,
        ru: `## Обзор облачной инфраструктуры
Выбрав модель сервиса и тип облака, заказчик планирует **архитектуру инфраструктуры**. Уровень инфраструктуры — **фундамент облака**. Он состоит из **дата-центров, вычислений (compute), хранилищ (storage) и сети (networking)**.
## Облачные дата-центры
**Облачный дата-центр** — огромный зал или склад с облачной инфраструктурой. В нём стоят **pods и стойки (racks)** (или стандартные контейнеры) с вычислительными ресурсами — **серверами, хранилищами и сетевым оборудованием**, то есть практически всё, что есть в физической IT-среде.
- **Node (узел)** — один сервер: CPU, RAM, накопитель, NIC.
- **Rack (стойка)** — набор узлов.
- **Cluster (кластер)** — стойки, соединённые сетью.
![Открытая серверная стойка 42U в дата-центре: стопка плоских серверов высотой 1U и 2U с зелёными индикаторами и коммутатор top-of-rack наверху с пучками синих и жёлтых патч-кордов](/events/cc/l2-server-rack.webp)
## Вычислительные ресурсы
Облачные провайдеры предлагают три варианта вычислений:
- **Virtual servers (VM, виртуальные серверы)** — **программные** компьютеры на основе виртуализации; большинство серверов облачного дата-центра запускают **hypervisors (гипервизоры)**, чтобы их создавать.
- **Bare metal servers (выделенные физические серверы)** — **физические серверы** в стойках без виртуализации.
- **«Serverless» (бессерверные вычисления)** — **уровень абстракции** поверх виртуальных машин.
Заказчики создают VM и bare metal серверы **тогда, когда они нужны**, и запускают на них свои нагрузки.
## Хранилища
Данные — файлы, код, документы, изображения, видео, резервные копии, снимки (snapshots), базы данных — можно хранить в разных видах хранилищ.
- VM и bare metal серверы получают **хранилище по умолчанию на локальных дисках**. Серверы создаются и удаляются по запросу, поэтому данные на локальном диске **могут пропасть** при удалении сервера.
- Чтобы **сохранить (persist)** данные, выбирают **block, file или object storage** — в зависимости от важности данных, того, как быстро и как часто к ним обращаются и насколько надёжно их нужно защищать.
- Блочное и файловое хранилища привычны для традиционных дата-центров, но **часто не справляются с масштабом, производительностью и распределённостью** облака.
- **Object storage (объектное хранилище)** — самое распространённое в облаке, потому что оно **сильно распределено и устойчиво (resilient)**.
@diagram cc-storage-types
## Сеть
В облачном дата-центре есть привычное оборудование — **маршрутизаторы и коммутаторы**, — но для пользователей облака главное — **Software Defined Networking (SDN, программно-определяемые сети)**: сетевые ресурсы виртуализированы или доступны программно через **API**. Это упрощает **создание, настройку и управление** сетью.
- **Public network interfaces (публичные интерфейсы)** подключают серверы к публичному интернету.
- **Private network interfaces (частные интерфейсы)** связывают серверы с другими вашими облачными ресурсами и помогают держать их в безопасности.
- Интерфейсам нужны **IP-адреса и подсети (subnets)** — назначенные автоматически или настроенные вручную.
- Ещё важнее настроить, какой трафик и какие пользователи получат доступ к ресурсам: **Security Groups** и **Access Control Lists (ACL)**.
- Дополнительная изоляция: **VLAN** (виртуальные LAN), **VPC** (виртуальные частные облака) и **VPN** (виртуальные частные сети).
- Привычные устройства, доступные как виртуальные сервисы: **межсетевые экраны (firewalls), балансировщики нагрузки (load balancers), шлюзы (gateways), анализаторы трафика**.
- **Content Delivery Networks (CDN)** раздают контент во множество точек по миру, и пользователь получает его из ближайшей.
| Компонент | Роль | Примеры |
|---|---|---|
| Data center | физический дом облака | pods, стойки, серверы |
| Compute | выполняет нагрузки | VM, bare metal, serverless |
| Storage | хранит данные | локальный диск, block, file, object |
| Networking | безопасно связывает ресурсы | SDN, SG, ACL, VLAN, VPC, VPN, CDN |
## Виртуализация
**Virtualization (виртуализация)** — процесс создания **программной, или виртуальной, версии** чего-либо: вычислений, хранилищ, сети, серверов или приложений. Технология довольно старая, но по-прежнему центральная для облаков. Её делает возможной **hypervisor (гипервизор)** — ПО, работающее поверх физического сервера (**хоста**), которое **забирает его ресурсы** и **распределяет их** между виртуальными средами.
- **Традиционный сервер** запускает одну операционную систему и её приложения прямо на железе.
- **Виртуализированный сервер** запускает гипервизор (например, VMware) со **множеством VM**, у каждой своя ОС и приложения.
- Уровень **виртуальной инфраструктуры** объединяет серверы, хранилища и сеть, а поверх него работает множество VM.
## Типы гипервизоров
- **Type 1 — bare-metal hypervisor (гипервизор «на голом железе»)**: ставится **прямо на физический сервер**. Самый распространённый, **самый безопасный**, с **меньшей задержкой (latency)**. Примеры: **VMware ESXi, Microsoft Hyper-V, open-source KVM**.
- **Type 2 — hosted hypervisor (размещённый гипервизор)**: между физическим сервером и гипервизором есть **хостовая ОС (host OS)**. Встречается гораздо реже, в основном для **виртуализации у конечных пользователей**, с **большей задержкой**. Примеры: **Oracle VirtualBox, VMware Workstation**.
@diagram cc-hypervisor-types
| Свойство | Type 1 (bare-metal) | Type 2 (hosted) |
|---|---|---|
| Работает на | железе напрямую | хостовой операционной системе |
| Задержка | меньше | больше |
| Безопасность | самый безопасный | менее безопасный |
| Применение | серверы, облачные дата-центры | конечные пользователи, ноутбуки, лаборатории |
| Примеры | ESXi, Hyper-V, KVM | VirtualBox, VMware Workstation |
Платформы гипервизоров на слайдах: VMware vSphere, Microsoft Hyper-V, Citrix XenServer, Nutanix, KVM, Red Hat, Oracle VM, Solaris, AIX. Инструменты мониторинга следят за VM снаружи, изнутри и по метрикам гипервизора.
## Виртуальные машины
**VM** — это просто **программный компьютер**. Она работает как физический компьютер, с **операционной системой и приложениями**. VM **полностью независимы** друг от друга, но многие из них работают на одном гипервизоре, который управляет выделенными им ресурсами физического сервера.
- Раз они независимы, VM на одном хосте могут работать под **разными ОС**: Windows, Linux, UNIX.
- Они **очень переносимы (portable)**: VM можно почти мгновенно перенести с одного гипервизора на другой на совсем другой машине.
## Преимущества виртуализации и VM
- **Cost savings (экономия)** — много виртуальных сред на одной инфраструктуре: меньше физического оборудования, меньше серверов для обслуживания, меньше электричества.
- **Agility and speed (гибкость и скорость)** — поднять VM быстро и просто по сравнению с подготовкой целой новой среды для разработчиков.
- **Lower downtime (меньше простоев)** — если хост падает, его VM быстро переносят на гипервизор исправной машины.
| Преимущество (слайд) | Смысл |
|---|---|
| Operational flexibility | отдельные экземпляры разных типов ОС |
| Reducing overhead | много VM на одном и том же железе |
| Centralization | объединение систем для простого управления |
| Scalability | масштабирование виртуальной среды по мере роста бизнеса |
| Disaster recovery | восстановление данных и состояния систем из экземпляров VM |
![Скриншот окна Oracle VirtualBox Manager на ноутбуке: список из трёх виртуальных машин — Ubuntu, Windows 10 и Debian, — одна из них запущена, в панели настроек видно 2 CPU и 4096 МБ RAM](/events/cc/l2-virtualbox-manager.webp)
> Виртуализация — ядро облачных вычислений: гипервизор превращает один физический сервер во множество независимых и переносимых VM.
?? Разработчик хочет попробовать Linux на ноутбуке с Windows. Какой тип гипервизора подходит и почему?
?= Type 2 (hosted), например VirtualBox: он работает поверх уже установленной хостовой ОС. Задержка выше, но для виртуализации у конечного пользователя это нормально.
?? Почему облачные провайдеры используют в дата-центрах гипервизоры Type 1?
?= Type 1 ставится прямо на железо, без хостовой ОС посередине, поэтому он самый безопасный и с наименьшей задержкой.`,
      },
      [
        qx("Which four components make up cloud infrastructure in the lecture?", "Data centers, compute, storage and networking", [
          ["IaaS, PaaS, SaaS and serverless function models", "These are service models, not the components the infrastructure is built from.", "Это модели сервисов, а не компоненты, из которых построена инфраструктура."],
          ["Regions, zones, edge locations and pairs", "These describe a provider's global layout, not what one cloud infrastructure consists of.", "Это глобальная география провайдера, а не состав облачной инфраструктуры."],
          ["Hypervisors, VMs, containers and images", "These are virtualization technologies inside the compute component, only one of the four.", "Это технологии виртуализации внутри compute — лишь одного из четырёх компонентов."],
        ], "Cloud infrastructure consists of data centers, storage, networking components and compute resources.", "Облачная инфраструктура состоит из дата-центров, хранилищ, сетевых компонентов и вычислительных ресурсов."),
        qx("Which compute option is an abstraction layer on top of virtual machines?", "Serverless computing", [
          ["Bare metal servers", "Bare metal servers are physical machines with no virtualization layer at all.", "Bare metal серверы — физические машины вообще без слоя виртуализации."],
          ["Dedicated host machines", "A dedicated host is a single-tenant physical host for your VMs, not a layer above them.", "Dedicated host — физический хост одного арендатора для ваших VM, а не слой над ними."],
          ["Type 1 hypervisors", "A Type 1 hypervisor sits below the VMs and creates them; it is not above them.", "Гипервизор Type 1 находится под VM и создаёт их, а не над ними."],
        ], "Cloud users can run workloads on serverless computing resources, which are an abstraction layer on top of virtual machines.", "Нагрузки можно запускать на serverless-ресурсах — это уровень абстракции поверх виртуальных машин."),
        qx("A user saves files on the local drive of a cloud VM and then deletes the VM. What happens to the files?", "They can be lost together with the VM", [
          ["They move to object storage automatically", "Nothing is copied automatically; persistent storage has to be chosen by the user.", "Ничего не копируется само; постоянное хранилище пользователь выбирает сам."],
          ["They stay on the host for the next tenant", "Freed resources go to other users, but the old data is not kept for them.", "Освобождённые ресурсы уходят другим пользователям, но старые данные для них не сохраняются."],
          ["They are kept by the provider for one year", "The lecture warns that local-drive data can be lost; there is no retention period.", "В лекции предупреждают, что данные локального диска могут пропасть; срока хранения нет."],
        ], "Servers are provisioned and decommissioned on demand, so data on a local drive can be lost when the server is deleted.", "Серверы создаются и удаляются по запросу, поэтому данные на локальном диске могут пропасть при удалении сервера."),
        qx("Which storage type is the most common in the cloud because it is highly distributed and resilient?", "Object storage", [
          ["Block storage", "Block storage is common in traditional data centers but struggles with cloud scale.", "Блочное хранилище привычно для традиционных дата-центров, но плохо справляется с облачным масштабом."],
          ["File storage", "File storage also often struggles with the scale and distributed nature of the cloud.", "Файловое хранилище тоже часто не справляется с масштабом и распределённостью облака."],
          ["Local drive storage", "Local drives are the default but can lose data when the server is deleted.", "Локальные диски — вариант по умолчанию, но данные пропадают при удалении сервера."],
        ], "Object storage is the most common mode of storage in the cloud, as it is both highly distributed and resilient.", "Объектное хранилище — самое распространённое в облаке: оно и сильно распределено, и устойчиво."),
        qx("What do block and file storage often struggle with in the cloud, according to the lecture?", "Scale, performance and distributed characteristics", [
          ["Encryption, snapshots and scheduled backups of data", "The lecture does not name these as weak points of block and file storage.", "Лекция не называет это слабыми местами блочного и файлового хранилищ."],
          ["Storing documents, images, videos and source code", "These are simply kinds of data that every storage type can hold.", "Это просто виды данных, которые может хранить любое хранилище."],
          ["Attaching to a server through its network card", "Connecting storage to servers is routine and not the problem described.", "Подключение хранилища к серверу — обычное дело, а не описанная проблема."],
        ], "Block and file storage often struggle with the scale, performance and distributed characteristics of the cloud.", "Блочное и файловое хранилища часто не справляются с масштабом, производительностью и распределённостью облака."),
        qx("What is Software Defined Networking (SDN) in the cloud?", "Network resources virtualized and offered through APIs", [
          ["Routers and switches cabled by hand by technicians in racks", "That is traditional networking hardware, the opposite of software-defined.", "Это традиционное сетевое оборудование — противоположность программно-определяемой сети."],
          ["A CDN that caches content near the end users", "A CDN distributes content; SDN is about programmable network resources.", "CDN раздаёт контент, а SDN — про программно управляемые сетевые ресурсы."],
          ["A hypervisor that runs on top of a host OS", "That describes a Type 2 hypervisor, which virtualizes servers, not networks.", "Это описание гипервизора Type 2, который виртуализирует серверы, а не сеть."],
        ], "With SDN, networking resources are virtualized or made available programmatically through APIs for easier provisioning and management.", "В SDN сетевые ресурсы виртуализированы или доступны программно через API — так проще их создавать и управлять ими."),
        qx("Which network interface connects a cloud server to your other cloud resources and helps keep them secure?", "Private network interface", [
          ["Public internet-facing interface", "A public interface connects the server to the public internet, not to your private resources.", "Публичный интерфейс подключает сервер к интернету, а не к вашим частным ресурсам."],
          ["Network edge location", "An edge location is a point of presence of the provider, not a server interface.", "Edge location — точка присутствия провайдера, а не интерфейс сервера."],
          ["Content delivery network", "A CDN distributes content to users worldwide; it is not a server's interface.", "CDN раздаёт контент пользователям по миру; это не интерфейс сервера."],
        ], "Private network interfaces provide connectivity to your other cloud resources and help keep them secure.", "Частные сетевые интерфейсы связывают сервер с другими вашими облачными ресурсами и помогают их защитить."),
        qx("Which pair of controls configures which network traffic and users can access cloud resources?", "Security Groups and ACLs", [
          ["CDNs and edge locations", "These speed up content delivery; they do not decide who may access resources.", "Они ускоряют доставку контента, но не решают, кто получит доступ к ресурсам."],
          ["Hypervisors and guest OSes", "These run virtual machines; they are not network access controls.", "Они запускают виртуальные машины, а не управляют сетевым доступом."],
          ["Racks and clusters", "Racks and clusters are physical hardware groupings, not access rules.", "Стойки и кластеры — группы физического оборудования, а не правила доступа."],
        ], "Which traffic and users reach your resources is configured with Security Groups and Access Control Lists (ACLs).", "Какой трафик и какие пользователи получат доступ, настраивается через Security Groups и Access Control Lists (ACL)."),
        qx("Which of these traditional hardware appliances can be virtualized and offered as a cloud service?", "A load balancer", [
          ["A rack cabinet", "A rack is a physical cabinet for servers and cannot be delivered as a service.", "Стойка — физический шкаф для серверов, её нельзя предоставить как сервис."],
          ["A cooling unit", "Cooling is engineering infrastructure of the building, not a network appliance.", "Охлаждение — инженерная инфраструктура здания, а не сетевое устройство."],
          ["A diesel generator", "A generator provides backup power; it is not a virtualizable network function.", "Генератор даёт резервное питание; это не сетевая функция для виртуализации."],
        ], "Firewalls, load balancers, gateways and traffic analyzers can be virtualized and offered as cloud services.", "Межсетевые экраны, балансировщики нагрузки, шлюзы и анализаторы трафика можно виртуализировать и предоставлять как облачные сервисы."),
        qx("What is virtualization?", "Creating a software-based version of a physical resource", [
          ["Copying data to several AZs to protect it", "That is replication for availability, not the creation of virtual resources.", "Это репликация ради доступности, а не создание виртуальных ресурсов."],
          ["Running a single OS directly on the hardware, with no extra layers", "That is a traditional, non-virtualized server.", "Это традиционный сервер без виртуализации."],
          ["Renting whole physical servers by the hour", "Renting servers is a billing model, not virtualization.", "Аренда серверов — модель оплаты, а не виртуализация."],
        ], "Virtualization creates a software-based, or virtual, version of compute, storage, networking, servers or applications.", "Виртуализация создаёт программную (виртуальную) версию вычислений, хранилищ, сети, серверов или приложений."),
        qx("What does a hypervisor do?", "Pulls host resources and allocates them to VMs", [
          ["Routes packets between Regions and AZs", "Routing is a networking function done by routers and SDN, not by a hypervisor.", "Маршрутизация — сетевая функция маршрутизаторов и SDN, а не гипервизора."],
          ["Stores objects in highly distributed buckets", "That describes object storage, not a hypervisor.", "Это описание объектного хранилища, а не гипервизора."],
          ["Packages app code with its libraries to run anywhere", "That describes a container, not a hypervisor.", "Это описание контейнера, а не гипервизора."],
        ], "A hypervisor runs above the physical server, pulls its resources and allocates them to the virtual environments.", "Гипервизор работает поверх физического сервера, забирает его ресурсы и распределяет их между виртуальными средами."),
        qx("Which hypervisor type is installed directly on top of the physical server?", "Type 1 (bare-metal)", [
          ["Type 2 (hosted)", "A Type 2 hypervisor needs a host OS between it and the hardware.", "Гипервизору Type 2 нужна хостовая ОС между ним и железом."],
          ["A container runtime", "A container runtime runs on a host OS and does not create VMs.", "Среда запуска контейнеров работает в хостовой ОС и не создаёт VM."],
          ["A guest operating system", "A guest OS runs inside a VM, above the hypervisor.", "Гостевая ОС работает внутри VM, над гипервизором."],
        ], "Type 1 hypervisors are installed directly on the physical server, which is why they are called bare-metal hypervisors.", "Гипервизоры Type 1 ставятся прямо на физический сервер — поэтому их называют bare-metal."),
        qx("Which of these is an example of a Type 2 hypervisor?", "Oracle VirtualBox", [
          ["VMware ESXi", "ESXi is a Type 1 hypervisor installed directly on hardware.", "ESXi — гипервизор Type 1, который ставится прямо на железо."],
          ["Microsoft Hyper-V", "Hyper-V is given in the lecture as a Type 1 example.", "Hyper-V приведён в лекции как пример Type 1."],
          ["Open-source KVM", "KVM is listed as a Type 1 (bare-metal) hypervisor.", "KVM указан как гипервизор Type 1 (bare-metal)."],
        ], "Type 2 (hosted) examples are Oracle VirtualBox and VMware Workstation, used mostly for end-user virtualization.", "Примеры Type 2 (hosted) — Oracle VirtualBox и VMware Workstation, в основном для конечных пользователей."),
        qx("Which statement correctly compares Type 1 and Type 2 hypervisors?", "Type 1 has lower latency and is more secure", [
          ["Type 2 has lower latency thanks to its host OS", "The extra host OS layer adds latency, so Type 2 is slower.", "Дополнительный слой хостовой ОС добавляет задержку, поэтому Type 2 медленнее."],
          ["Type 1 always needs a host OS underneath it", "It is Type 2 that needs a host OS; Type 1 runs on bare hardware.", "Хостовая ОС нужна Type 2; Type 1 работает прямо на железе."],
          ["Type 2 is the most common type in data centers", "Type 2 is much less frequent; data centers mainly use Type 1.", "Type 2 встречается гораздо реже; в дата-центрах используют в основном Type 1."],
        ], "Type 1 hypervisors are the most frequently used, most secure and have lower latency than Type 2.", "Гипервизоры Type 1 самые распространённые, самые безопасные и с меньшей задержкой, чем Type 2."),
        qx("Why can VMs on one host run Windows, Linux and UNIX at the same time?", "Each VM is independent and has its own OS", [
          ["The hypervisor converts them all into Linux", "No conversion happens; each VM really runs its own operating system.", "Никакого преобразования нет — каждая VM действительно работает под своей ОС."],
          ["All VMs share one guest OS kernel", "Sharing one kernel is how containers work; VMs each have their own OS.", "Общее ядро — это принцип контейнеров; у каждой VM своя ОС."],
          ["The host OS runs each one in turn", "VMs run side by side on the hypervisor, not one at a time.", "VM работают параллельно на гипервизоре, а не по очереди."],
        ], "VMs are completely independent of one another, so different VMs can run different operating systems.", "VM полностью независимы друг от друга, поэтому разные VM могут работать под разными ОС."),
        qx("A physical host fails. How does virtualization help keep downtime low?", "Its VMs are moved quickly to another host", [
          ["The VMs keep running on the failed hardware", "Software cannot run on broken hardware; the VMs must move elsewhere.", "ПО не может работать на сломанном железе — VM нужно перенести."],
          ["The provider ships a new server to the user", "Users never receive hardware; recovery happens by moving VMs.", "Пользователи не получают железо; восстановление идёт переносом VM."],
          ["Containers reinstall the hypervisor by themselves", "Containers play no part in moving VMs between hosts.", "Контейнеры не участвуют в переносе VM между хостами."],
        ], "Because VMs are portable, they can be moved quickly to a hypervisor on a working machine when a host goes down.", "VM переносимы, поэтому при отказе хоста их быстро переносят на гипервизор исправной машины."),
        qx("Which benefit of virtualization comes from running many virtual environments on one physical server?", "Cost savings from a smaller physical footprint", [
          ["Higher latency for every application", "Higher latency is a drawback, not a benefit.", "Большая задержка — недостаток, а не преимущество."],
          ["Dependence on a single OS type", "Virtualization removes this dependence: VMs can run different OSes.", "Виртуализация убирает эту зависимость: VM могут работать под разными ОС."],
          ["More physical servers to power, cool and maintain", "Virtualization means fewer physical servers, not more.", "Виртуализация означает меньше физических серверов, а не больше."],
        ], "Running many VMs on one machine shrinks the physical footprint and saves on maintenance and electricity.", "Множество VM на одной машине уменьшает объём оборудования и экономит на обслуживании и электричестве."),
        qx("What does the VM benefit 'centralization' mean?", "Consolidating systems to simplify management", [
          ["Placing every VM in one single Availability Zone", "That would reduce availability; centralization is about management, not placement.", "Это снизило бы доступность; централизация — про управление, а не размещение."],
          ["Running only one OS type on every host", "Operational flexibility means VMs can run many OS types.", "Operational flexibility как раз означает, что VM могут работать под разными ОС."],
          ["Keeping all data on a single local drive", "Local-drive data can be lost; this is not a VM benefit.", "Данные локального диска могут пропасть — это не преимущество VM."],
        ], "Centralization: consolidate systems to simplify management.", "Централизация — объединить системы, чтобы упростить управление."),
        qx("Which networking capability lets users get content from the point nearest to them?", "Content Delivery Network (CDN)", [
          ["Software Defined Network (SDN)", "SDN makes the network programmable; it does not place content near users.", "SDN делает сеть программируемой, но не размещает контент рядом с пользователями."],
          ["Access Control List (ACL)", "An ACL filters traffic; it does not distribute content.", "ACL фильтрует трафик, а не раздаёт контент."],
          ["Virtual Private Network (VPN)", "A VPN creates a secure tunnel; it does not cache content worldwide.", "VPN создаёт защищённый туннель, а не кэширует контент по миру."],
        ], "CDNs distribute content to multiple points throughout the world so users access it from the point nearest to them.", "CDN раздаёт контент во множество точек мира, и пользователь получает его из ближайшей."),
        tfx("Most servers in a cloud data center run hypervisors to create virtual machines.", true,
          "The lecture says most servers in a cloud data center run hypervisors to create VMs; the others are bare metal servers.",
          "В лекции сказано: большинство серверов облачного дата-центра запускают гипервизоры для создания VM, остальные — bare metal.",
          "False is wrong: bare metal servers exist, but they are the minority in the racks.",
          "«Неверно» — ошибка: bare metal серверы есть, но в стойках их меньшинство."),
      ],
    ),
    part(
      "cc-l2-p3",
      { en: "Types of virtual machines and bare metal", ru: "Типы виртуальных машин и bare metal" },
      {
        en: `## Virtual machines in the cloud
**Virtual Machines (VMs)** are also called **virtual servers**, **virtual instances** or simply **instances**, depending on the provider (IBM Cloud, AWS, Google Cloud, Azure). Providers offer VMs in a variety of **configurations and deployment options** to serve different use cases.
When you create a virtual server, you choose:
- the **Region** and **Zone** (or data center) where it is provisioned;
- the **operating system** — UNIX, Windows or Linux;
- **shared (multi-tenant)** or **dedicated (single-tenant)** VMs;
- **hourly or monthly** billing;
- storage and networking options.
![Screenshot of a cloud console 'Create virtual server' form: drop-downs for Region and Zone, a toggle between Shared (multi-tenant) and Dedicated (single-tenant), a billing selector Hourly / Monthly and a list of operating systems Ubuntu, Windows Server and Red Hat](/events/cc/l2-create-server-form.webp)
## Shared or public cloud VMs
- **Provider-managed, multi-tenant** deployments that can be provisioned **on demand** with **predefined sizes**.
- **Multi-tenant** means the underlying physical server is virtualized and **shared with other tenants** (users).
- Sizes range from **a single virtual core and a small amount of RAM** to many virtual cores and much larger amounts of RAM.
- Example configurations: **compute intensive**, **memory intensive**, **high performance I/O**.
- Some providers also offer **custom configurations**: you define the number of cores, RAM and local storage.
Pricing: usually **by the hour** (in some cases even **by the second**), starting at **pennies per hour**. **Monthly** VMs can save money if you run the VM for at least a month, but if you decommission it mid-month you are still charged for the **full month**.
## Transient or spot VMs
- They take advantage of **unused capacity** in a cloud data center and cost **much less** than regular VMs of similar size.
- The provider can **de-provision them at any time** and reclaim the resources for regular, higher-priced VMs.
- Great for: **non-production** workloads, **testing and developing** applications, **stateless** workloads, **testing scalability**, **big data and HPC** workloads at low cost.
- Not for: production systems that must keep running without interruption.
## Reserved virtual server instances
- **Reserve capacity and guarantee resources** for future deployments.
- You reserve an amount of capacity, provision instances from it when you need them, and choose a **term — 1 year or 3 years**.
- The capacity is **guaranteed** in the data center of your choice for the life of the contract.
- A **longer commitment lowers the cost** compared with hourly or monthly instances: 1 year = $$$, 3 years = $.
- Use it when you know you need at least a certain capacity for a specific period; if you exceed the reservation, add **hourly or monthly VMs**.
## Dedicated hosts
- **Single-tenant isolation**: only your VMs run on the host, with **exclusive use** of the full capacity and resources of the hardware.
- You **specify the data center and pod** for the host, then assign VMs to that specific host — **maximum control over workload placement**.
- Typically used to meet **compliance and regulatory requirements** or specific **licensing terms**.
| VM type | Tenancy | Price | Best for |
|---|---|---|---|
| Shared / public | multi-tenant | by the second, hour or month | general on-demand workloads |
| Transient / spot | multi-tenant, spare capacity | much lower, can be reclaimed | dev/test, stateless, big data, HPC |
| Reserved | capacity reserved for 1 or 3 years | lower than hourly or monthly | steady, known baseline usage |
| Dedicated host | single-tenant | higher | compliance, licensing, placement control |
## Bare metal servers
A **bare metal server** is a **single-tenant, dedicated physical server** — in other words, it is dedicated to a single customer. The cloud provider takes the physical server and plugs it into a rack in its data center for the customer.
- The **provider manages the server up to the OS**: if the hardware or rack connection fails, it fixes or replaces it and reboots the server.
- The **customer** administers and manages **everything else** on the server.
- Configuration covers **processors, RAM, hard drives, specialized components and the OS** — either **preconfigured** by the provider for workload packages or **custom-configured** to customer specifications.
- Customers can install **their own OS**, and even **hypervisors** the provider does not offer, to build their own VMs and farms.
- You can **add GPUs** for accelerating scientific computation, data analytics and rendering professional grade virtualized graphics.
- **No hypervisor is required**, so clients have **full access and control** of the machine.
## Provisioning time, cost and availability
= preconfigured bare metal: 20–40 minutes; custom build: about 3–4 hours
- Physical machines take **longer to provision** than virtual servers; the times vary by provider.
- Dedicated to one client at a time, bare metal is **more expensive** than similarly sized VMs.
- Unlike virtual servers, bare metal is **not offered by all cloud providers**.
![Open 2U bare metal server pulled out of a rack with its lid removed: two CPUs under large heat sinks, rows of RAM modules and four full-size GPU cards side by side](/events/cc/l2-bare-metal-gpu-server.webp)
## Bare metal workloads
Bare metal servers are meant for **long-term, high-performance** use in **highly secure and isolated** environments:
- fully customizable, **demanding environments**;
- **dedicated or long-term** usage;
- **High Performance Computing (HPC)** and data-intense apps that need **minimal latency-related delays**, because no hardware is shared with other customers;
- **big data analytics** and **GPU-intensive** solutions.
Example workloads: **ERP, CRM, AI and deep learning, virtualization, HPC, big data analytics, GPU-intensive solutions**. Apps that need a high degree of security control, or that you used to run on-premises, are good candidates.
## VM or bare metal?
| Criterion | Virtual server (VM) | Bare metal server |
|---|---|---|
| Hardware | virtualized; shared or dedicated host | one physical server, single tenant |
| Hypervisor | run by the provider | none required (you may install your own) |
| Provisioning | quick | 20–40 min preconfigured, 3–4 h custom |
| Cost | lower, hourly or monthly | higher than a similar VM |
| Control | OS and applications | full access to the hardware |
| Typical use | web apps, dev/test, elastic workloads | HPC, AI, ERP/CRM, secure isolated apps |
> Spot = cheapest but can be taken away; reserved = cheaper for a 1- or 3-year commitment; dedicated host = a whole host for your VMs; bare metal = your own physical server with no hypervisor.
?? A team runs nightly, stateless image-processing jobs that can simply restart if interrupted. Which VM type is the cheapest good fit?
?= Transient (spot) VMs: they use unused capacity at a big discount, and being reclaimed is acceptable for restartable, stateless work.
?? A company must run software licensed per physical server and must not share hardware. When is a dedicated host enough, and when is bare metal better?
?= Both are single-tenant. A dedicated host fits if provider-managed VMs with placement control are enough; bare metal fits if you need full hardware access, your own OS or hypervisor, or GPUs.`,
        ru: `## Виртуальные машины в облаке
**Virtual Machines (VM)** называют также **virtual servers (виртуальные серверы)**, **virtual instances** или просто **instances (инстансы)** — в зависимости от провайдера (IBM Cloud, AWS, Google Cloud, Azure). Провайдеры предлагают VM во множестве **конфигураций и вариантов развёртывания** под разные задачи.
Создавая виртуальный сервер, вы выбираете:
- **Region** и **Zone** (или дата-центр), где он будет создан;
- **операционную систему** — UNIX, Windows или Linux;
- **shared (multi-tenant, общие)** или **dedicated (single-tenant, выделенные)** VM;
- **почасовую или помесячную** оплату;
- параметры хранилища и сети.
![Скриншот формы «Create virtual server» в облачной консоли: выпадающие списки Region и Zone, переключатель Shared (multi-tenant) / Dedicated (single-tenant), выбор оплаты Hourly / Monthly и список операционных систем Ubuntu, Windows Server и Red Hat](/events/cc/l2-create-server-form.webp)
## Shared, или публичные, облачные VM
- **Управляемые провайдером, multi-tenant (многоарендные)** развёртывания, которые создаются **по запросу (on demand)** с **готовыми размерами (predefined sizes)**.
- **Multi-tenant** означает, что физический сервер виртуализирован и **разделён с другими арендаторами (tenants)**.
- Размеры — от **одного виртуального ядра и небольшого объёма RAM** до многих виртуальных ядер и гораздо большего объёма RAM.
- Примеры конфигураций: **compute intensive (для вычислений)**, **memory intensive (для памяти)**, **high performance I/O (быстрый ввод-вывод)**.
- Некоторые провайдеры предлагают и **custom configurations**: вы сами задаёте число ядер, RAM и локальное хранилище.
Цены: обычно **за час** (иногда даже **за секунду**), начиная с **нескольких центов в час**. **Помесячные** VM могут сэкономить деньги, если VM работает не меньше месяца, но если удалить её в середине месяца, всё равно придётся заплатить за **весь месяц**.
## Transient, или spot, VM (временные)
- Используют **незанятые мощности (unused capacity)** облачного дата-центра и стоят **намного дешевле** обычных VM того же размера.
- Провайдер может **отключить их в любой момент** и забрать ресурсы под обычные, более дорогие VM.
- Хороши для: **непроизводственных (non-production)** нагрузок, **тестирования и разработки** приложений, **stateless** нагрузок (без хранимого состояния), **проверки масштабируемости**, **big data и HPC** с низкой стоимостью.
- Не годятся для: производственных систем, которые должны работать без перерывов.
## Reserved virtual server instances (зарезервированные)
- **Резервируют мощности и гарантируют ресурсы** для будущих развёртываний.
- Вы резервируете объём мощностей, создаёте из него инстансы, когда нужно, и выбираете **срок — 1 год или 3 года**.
- Мощности **гарантированы** в выбранном дата-центре на весь срок контракта.
- **Более долгий срок снижает цену** по сравнению с почасовыми и помесячными инстансами: 1 year = $$$, 3 years = $.
- Подходит, когда известно, что нужен минимум определённых мощностей на конкретный срок; если резерва не хватает, добавляют **почасовые или помесячные VM**.
## Dedicated hosts (выделенные хосты)
- **Single-tenant isolation (изоляция одного арендатора)**: на хосте работают только ваши VM, с **исключительным использованием** всей мощности и ресурсов железа.
- Вы **указываете дата-центр и pod** для хоста, а затем назначаете VM на этот конкретный хост — **максимальный контроль над размещением нагрузок**.
- Обычно используются для выполнения **требований соответствия и регуляторов (compliance)** или особых **условий лицензий**.
| Тип VM | Арендность | Цена | Лучше всего для |
|---|---|---|---|
| Shared / public | multi-tenant | за секунду, час или месяц | обычных нагрузок по запросу |
| Transient / spot | multi-tenant, свободные мощности | намного ниже, могут забрать | dev/test, stateless, big data, HPC |
| Reserved | мощности на 1 или 3 года | ниже почасовой и помесячной | стабильной, заранее известной нагрузки |
| Dedicated host | single-tenant | выше | compliance, лицензий, контроля размещения |
## Bare metal серверы
**Bare metal server** — это **физический сервер одного арендатора (single-tenant), выделенный (dedicated)** — иначе говоря, он принадлежит одному клиенту. Провайдер берёт физический сервер и ставит его в стойку своего дата-центра для клиента.
- **Провайдер управляет сервером до уровня ОС**: если ломается железо или подключение к стойке, он чинит или заменяет его и перезагружает сервер.
- **Клиент** администрирует и управляет **всем остальным** на сервере.
- Конфигурация включает **процессоры, RAM, жёсткие диски, специализированные компоненты и ОС** — либо **preconfigured (преднастроенная)** провайдером под типовые нагрузки, либо **custom-configured (собранная)** по требованиям клиента.
- Клиент может поставить **свою ОС** и даже **гипервизоры**, которых нет у провайдера, и строить свои VM и фермы.
- Можно **добавить GPU** для ускорения научных вычислений, анализа данных и рендеринга профессиональной виртуализированной графики.
- **Гипервизор не нужен**, поэтому у клиента **полный доступ и контроль** над машиной.
## Время создания, цена и доступность
= preconfigured bare metal: 20–40 minutes; custom build: about 3–4 hours
- Физические машины **создаются дольше**, чем виртуальные серверы; время зависит от провайдера.
- Раз сервер отдан одному клиенту, bare metal **дороже** VM сопоставимого размера.
- В отличие от виртуальных серверов, bare metal **есть не у всех облачных провайдеров**.
![Открытый сервер bare metal высотой 2U, выдвинутый из стойки, со снятой крышкой: два процессора под большими радиаторами, ряды модулей RAM и четыре полноразмерные видеокарты GPU рядом друг с другом](/events/cc/l2-bare-metal-gpu-server.webp)
## Нагрузки для bare metal
Bare metal серверы рассчитаны на **долгую и высокопроизводительную** работу в **хорошо защищённых и изолированных** средах:
- полностью настраиваемые, **требовательные среды**;
- **выделенное или долгосрочное** использование;
- **High Performance Computing (HPC)** и приложения с большим объёмом данных, которым нужны **минимальные задержки**, так как железо ни с кем не делится;
- **анализ больших данных (big data analytics)** и решения, **интенсивно использующие GPU**.
Примеры нагрузок: **ERP, CRM, AI и deep learning, виртуализация, HPC, big data analytics, GPU-интенсивные решения**. Хорошие кандидаты — приложения, где нужен высокий контроль безопасности, или те, что раньше работали on-premises.
## VM или bare metal?
| Критерий | Виртуальный сервер (VM) | Bare metal сервер |
|---|---|---|
| Железо | виртуализировано; общий или выделенный хост | один физический сервер, один арендатор |
| Гипервизор | управляет провайдер | не нужен (можно поставить свой) |
| Создание | быстро | 20–40 мин преднастроенный, 3–4 ч собранный |
| Цена | ниже, почасово или помесячно | выше, чем у похожей VM |
| Контроль | ОС и приложения | полный доступ к железу |
| Типичное применение | веб-приложения, dev/test, эластичные нагрузки | HPC, AI, ERP/CRM, защищённые изолированные приложения |
> Spot = дешевле всех, но могут забрать; reserved = дешевле за обязательство на 1 или 3 года; dedicated host = целый хост под ваши VM; bare metal = ваш собственный физический сервер без гипервизора.
?? Команда каждую ночь запускает stateless-задачи обработки изображений, которые можно просто перезапустить при прерывании. Какой тип VM — самый дешёвый подходящий?
?= Transient (spot) VM: они используют незанятые мощности с большой скидкой, а то, что их могут забрать, допустимо для перезапускаемой stateless-работы.
?? Компании нужно запустить ПО с лицензией на физический сервер и нельзя делить железо с другими. Когда хватит dedicated host, а когда лучше bare metal?
?= Оба варианта single-tenant. Dedicated host подходит, если хватает управляемых провайдером VM с контролем размещения; bare metal — если нужен полный доступ к железу, своя ОС или гипервизор, либо GPU.`,
      },
      [
        qx("Depending on the provider, which other names are used for virtual machines?", "Virtual servers, virtual instances or instances", [
          ["Bare metal servers, dedicated hosts or physical nodes", "These are physical, single-tenant options, not other names for VMs.", "Это физические варианты для одного арендатора, а не другие названия VM."],
          ["Containers, pods or container images", "Containers share the host OS; they are a different technology from VMs.", "Контейнеры используют хостовую ОС — это другая технология, не VM."],
          ["Nodes, racks or clusters of servers", "These are physical building blocks of a data center.", "Это физические элементы дата-центра."],
        ], "VMs are also known as virtual servers, virtual instances or simply instances, depending on the cloud provider.", "VM также называют virtual servers, virtual instances или просто instances — в зависимости от провайдера."),
        qx("Which choices do you make when you create a virtual server in the cloud?", "Region and zone, OS, tenancy and billing", [
          ["Rack number, cooling type and power supply", "Users never pick physical rack details; the provider manages the facility.", "Пользователь не выбирает физические детали стойки — объектом управляет провайдер."],
          ["Host OS, BIOS version and hypervisor brand", "The hypervisor and host are managed by the provider, not chosen per VM.", "Гипервизором и хостом управляет провайдер, их не выбирают для каждой VM."],
          ["Edge location, CDN and domain registrar", "These are content-delivery and DNS topics, not VM creation options.", "Это темы доставки контента и DNS, а не параметры создания VM."],
        ], "You specify the Region and Zone, the OS, shared or dedicated tenancy, hourly or monthly billing, plus storage and networking.", "Вы указываете Region и Zone, ОС, общую или выделенную арендность, почасовую или помесячную оплату, а также хранилище и сеть."),
        qx("What does 'multi-tenant' mean for shared (public) cloud VMs?", "The physical server is shared with other users", [
          ["Each user always gets a whole physical server to themselves", "A whole server for one customer is single-tenant, like bare metal.", "Целый сервер для одного клиента — это single-tenant, как bare metal."],
          ["One VM is used by several companies at once", "Each VM belongs to one user; it is the physical host that is shared.", "Каждая VM принадлежит одному пользователю; общий — физический хост."],
          ["The VM is spread across several Regions", "Tenancy is about sharing hardware, not about geographic spread.", "Арендность — про совместное использование железа, а не про географию."],
        ], "Multi-tenant means the underlying physical server is virtualized and shared across other tenants or users.", "Multi-tenant означает, что физический сервер виртуализирован и разделён с другими арендаторами."),
        qx("Which is one of the example predefined configurations for shared VMs?", "Memory intensive", [
          ["Spot reclaimable", "Spot is a separate VM type, not a size configuration of shared VMs.", "Spot — отдельный тип VM, а не конфигурация размера shared VM."],
          ["Single-tenant only", "Shared VMs are multi-tenant by definition.", "Shared VM по определению multi-tenant."],
          ["Hypervisor-free", "Every VM runs on a hypervisor; only bare metal needs none.", "Любая VM работает на гипервизоре; без него обходится только bare metal."],
        ], "Example configurations are compute intensive, memory intensive and high performance I/O.", "Примеры конфигураций — compute intensive, memory intensive и high performance I/O."),
        qx("A user chooses monthly billing for a VM and deletes it after 10 days. What is charged?", "The full month", [
          ["Only the 10 days used", "Per-use charging applies to hourly VMs, not to monthly ones.", "Оплата по факту — для почасовых VM, а не для помесячных."],
          ["Nothing, the first month is free", "The lecture mentions no free month for monthly VMs.", "В лекции нет бесплатного месяца для помесячных VM."],
          ["Half of the monthly price", "There is no pro-rating; decommissioning mid-month still costs the full month.", "Пересчёта нет: удаление в середине месяца всё равно стоит весь месяц."],
        ], "If you decommission a monthly VM in the middle of the month, you are still charged for the full month.", "Если удалить помесячную VM в середине месяца, всё равно придётся заплатить за весь месяц."),
        qx("What makes transient (spot) VMs so cheap?", "They use unused capacity of the data center", [
          ["They run without any operating system", "Spot VMs are normal VMs with an OS; only their availability differs.", "Spot VM — обычные VM с ОС; отличается только их доступность."],
          ["They require a long 3-year commitment from the user", "A 1- or 3-year term is the reserved model, not spot.", "Срок 1 или 3 года — это модель reserved, а не spot."],
          ["They run on a Type 2 hypervisor", "The hypervisor type does not set the price; spare capacity does.", "Цену определяет не тип гипервизора, а свободные мощности."],
        ], "Transient VMs take advantage of unused capacity, which the provider sells at a much lower price.", "Transient VM используют незанятые мощности, которые провайдер продаёт намного дешевле."),
        qx("What is the main risk of using transient (spot) VMs?", "The provider can reclaim them at any time", [
          ["They cannot run a Linux operating system", "Spot VMs can run the usual operating systems.", "Spot VM могут работать под обычными ОС."],
          ["They need a contract of one or three years", "Long contracts belong to reserved instances.", "Долгие контракты — у reserved instances."],
          ["They are single-tenant and very expensive", "Spot VMs are multi-tenant and heavily discounted.", "Spot VM — multi-tenant и с большой скидкой."],
        ], "The provider can de-provision transient VMs at any time to reclaim resources for regular, higher-priced VMs.", "Провайдер может отключить transient VM в любой момент и забрать ресурсы под обычные, более дорогие VM."),
        qx("A team needs cheap VMs to test how a new app scales. Which VM type is the best fit?", "Transient (spot) VMs", [
          ["Dedicated hosts", "Dedicated hosts are for compliance or licensing and cost more.", "Dedicated hosts нужны для compliance или лицензий и стоят дороже."],
          ["Reserved instances for 3 years", "A 3-year commitment makes no sense for a short scalability test.", "Обязательство на 3 года бессмысленно для короткого теста масштабируемости."],
          ["Bare metal servers with GPUs", "Bare metal is the most expensive option and slow to provision.", "Bare metal — самый дорогой вариант, и создаётся он долго."],
        ], "Spot VMs are great for non-production work such as testing scalability, at a low cost.", "Spot VM отлично подходят для непроизводственных задач вроде проверки масштабируемости — и стоят дёшево."),
        qx("Which workload should NOT run on transient (spot) VMs?", "A production payment system that must never stop", [
          ["Testing and developing applications", "Testing and development are listed as ideal spot workloads.", "Тестирование и разработка названы идеальными нагрузками для spot."],
          ["Stateless batch processing", "Stateless work can restart after a reclaim, so it suits spot VMs.", "Stateless-работа перезапускается после отключения, поэтому подходит для spot."],
          ["Big data and HPC jobs that can simply be restarted later", "Low-cost big data and HPC are named as good spot use cases.", "Дешёвые big data и HPC названы хорошими сценариями для spot."],
        ], "Spot VMs can be reclaimed at any moment, so they suit non-production work, not systems that must never stop.", "Spot VM могут забрать в любой момент, поэтому они для непроизводственных задач, а не для систем без права на остановку."),
        qx("Which term options does the lecture give for reserved virtual server instances?", "1 year or 3 years", [
          ["1 hour or 1 day", "Hourly use is the on-demand model, not a reservation term.", "Почасовое использование — модель on demand, а не срок резерва."],
          ["1 week or 1 month", "Monthly billing exists, but reservation terms are years.", "Помесячная оплата существует, но сроки резерва — годы."],
          ["5 years or 10 years", "The slide shows 1 year and 3 years only.", "На слайде только 1 год и 3 года."],
        ], "You choose a term such as 1 year or 3 years; the longer term gives the lower price.", "Выбирается срок 1 год или 3 года; чем дольше срок, тем ниже цена."),
        qx("A company knows it needs 20 VMs all year for the next 3 years. Which option guarantees capacity at a lower cost?", "Reserved instances with a 3-year term", [
          ["Transient (spot) VMs", "Spot VMs can be reclaimed, so capacity is not guaranteed.", "Spot VM могут забрать, поэтому мощности не гарантированы."],
          ["Monthly VMs that are renewed again every single month", "Monthly VMs guarantee nothing for the future and cost more than a long reservation.", "Помесячные VM ничего не гарантируют на будущее и дороже долгого резерва."],
          ["Hourly VMs started on demand", "Hourly is the most flexible but also the most expensive for steady use.", "Почасовые VM самые гибкие, но и самые дорогие при постоянной нагрузке."],
        ], "Reserved instances guarantee capacity for the contract term, and a longer term lowers the cost.", "Reserved instances гарантируют мощности на срок контракта, а более долгий срок снижает цену."),
        qx("What happens when your usage exceeds the reserved capacity?", "You add hourly or monthly VMs for the extra load", [
          ["Extra VMs are blocked until the term ends", "Nothing is blocked; you can supplement the reservation.", "Ничего не блокируется — резерв можно дополнить."],
          ["The reservation is cancelled automatically", "The contract stays valid for its whole term.", "Контракт действует весь свой срок."],
          ["The provider moves all of your VMs to bare metal servers", "Bare metal is a different product and is not used as overflow.", "Bare metal — другой продукт, он не используется для излишков."],
        ], "If you exceed your reserved capacity, you supplement it with hourly or monthly VMs.", "Если резерва не хватает, его дополняют почасовыми или помесячными VM."),
        qx("What does a dedicated host provide?", "A single-tenant host used only by your VMs", [
          ["Spare data center capacity at a big discount", "Spare capacity at a discount describes spot VMs.", "Свободные мощности со скидкой — это spot VM."],
          ["A physical server with no hypervisor at all", "That is bare metal; a dedicated host still runs your VMs on a hypervisor.", "Это bare metal; на dedicated host ваши VM всё ещё работают на гипервизоре."],
          ["A shared server with predefined VM sizes", "Shared, predefined sizes describe public multi-tenant VMs.", "Общий сервер с готовыми размерами — это публичные multi-tenant VM."],
        ], "Dedicated hosts offer single-tenant isolation: only your VMs run on the host and use its full capacity.", "Dedicated hosts дают изоляцию одного арендатора: на хосте работают только ваши VM и используют всю его мощность."),
        qx("Why do companies typically choose dedicated hosts?", "To meet compliance, regulatory or licensing terms", [
          ["To get the lowest possible price per hour", "Exclusive hardware costs more, not less.", "Выделенное железо стоит дороже, а не дешевле."],
          ["To run short tests that may be interrupted by the provider", "Interruptible tests fit spot VMs, not dedicated hosts.", "Прерываемые тесты подходят для spot VM, а не для dedicated hosts."],
          ["To serve content from edge locations", "Edge delivery is a CDN topic, unrelated to dedicated hosts.", "Доставка с edge — тема CDN, не связанная с dedicated hosts."],
        ], "Dedicated hosts are typically used to meet compliance and regulatory requirements or specific licensing terms.", "Dedicated hosts обычно нужны для требований compliance и регуляторов или особых условий лицензий."),
        qx("What is a bare metal server?", "A single-tenant, dedicated physical server", [
          ["A multi-tenant VM with predefined sizes", "That describes a shared public VM.", "Это описание общей публичной VM."],
          ["A VM that runs on a bare-metal (Type 1) hypervisor", "A bare-metal hypervisor creates VMs; a bare metal server is the physical machine itself.", "Bare-metal гипервизор создаёт VM, а bare metal сервер — сама физическая машина."],
          ["A container running on the host kernel", "Containers are processes on a host OS, not physical servers.", "Контейнеры — процессы в хостовой ОС, а не физические серверы."],
        ], "A bare metal server is a single-tenant, dedicated physical server, dedicated to a single customer.", "Bare metal сервер — физический сервер одного арендатора, выделенный одному клиенту."),
        qx("On a bare metal server, what does the cloud provider manage?", "The server up to the operating system", [
          ["Everything, including the customer's apps", "The customer manages everything above the OS level.", "Всё выше уровня ОС клиент администрирует сам."],
          ["Nothing; the customer repairs the hardware", "The provider fixes or replaces failed hardware and reboots the server.", "Провайдер чинит или заменяет сломанное железо и перезагружает сервер."],
          ["Only the applications and their data", "It is the reverse: the provider handles hardware, the customer handles apps.", "Наоборот: провайдер отвечает за железо, клиент — за приложения."],
        ], "The provider manages the server up to the OS; the customer administers and manages everything else.", "Провайдер управляет сервером до уровня ОС; всем остальным занимается клиент."),
        qx("Roughly how long does a preconfigured bare metal server take to provision?", "20 to 40 minutes", [
          ["Less than one second", "Even VMs take longer; physical servers are much slower to provision.", "Даже VM создаются дольше, а физические серверы — тем более."],
          ["3 to 4 hours", "3–4 hours is the time for a custom-built bare metal server.", "3–4 часа — время для bare metal, собранного на заказ."],
          ["2 to 3 weeks", "Cloud bare metal is delivered within hours, not weeks.", "Облачный bare metal выдают за часы, а не за недели."],
        ], "Preconfigured builds take 20 to 40 minutes, custom builds about 3 to 4 hours; times vary by provider.", "Преднастроенные сборки — 20–40 минут, собранные на заказ — около 3–4 часов; время зависит от провайдера."),
        qx("Why would a customer add GPUs to a bare metal server?", "To accelerate scientific computing and graphics", [
          ["To let other tenants share the server's hardware safely", "Bare metal is single-tenant; GPUs do not change that.", "Bare metal всегда single-tenant; GPU этого не меняют."],
          ["To shorten its provisioning time", "Extra components make a custom build, which takes longer, not shorter.", "Дополнительные компоненты — это сборка на заказ, она дольше, а не быстрее."],
          ["To avoid installing an operating system", "A server with GPUs still needs an operating system.", "Серверу с GPU всё равно нужна операционная система."],
        ], "GPUs accelerate scientific computation, data analytics and rendering professional grade virtualized graphics.", "GPU ускоряют научные вычисления, анализ данных и рендеринг профессиональной виртуализированной графики."),
        qx("Which workload is a typical example for bare metal servers?", "Training AI and deep learning models", [
          ["A short-lived test web page", "Short tests are cheaper and faster on VMs.", "Короткие тесты дешевле и быстрее на VM."],
          ["A small static personal blog", "A tiny site does not justify a dedicated physical server.", "Маленький сайт не оправдывает выделенный физический сервер."],
          ["Interruptible batch jobs at the lowest possible cost", "Cheap interruptible work fits spot VMs; bare metal is expensive.", "Дешёвая прерываемая работа подходит spot VM; bare metal дорогой."],
        ], "Example bare metal workloads: ERP, CRM, AI and deep learning, virtualization, HPC, big data and GPU-intensive solutions.", "Примеры нагрузок для bare metal: ERP, CRM, AI и deep learning, виртуализация, HPC, big data и GPU-интенсивные решения."),
        tfx("Every major cloud provider offers bare metal servers, just like virtual servers.", false,
          "Unlike virtual servers, not all cloud providers offer bare metal servers.",
          "В отличие от виртуальных серверов, bare metal есть не у всех облачных провайдеров.",
          "True is wrong: the lecture stresses that bare metal is not available from every provider.",
          "«Верно» — ошибка: в лекции подчёркнуто, что bare metal есть не у каждого провайдера."),
      ],
    ),
    part(
      "cc-l2-p4",
      { en: "Secure networking and containers", ru: "Безопасная сеть и контейнеры" },
      {
        en: `## Why secure cloud networking
As cloud environments gain wider adoption, digital data invites rapidly increasing **cybersecurity threats**, so building **secure networks in the cloud** is crucial.
## Cloud network vs on-premises network
Building a cloud network is not much different from deploying a network in an on-premises data center. The main difference: the cloud uses **logical instances** of networking elements instead of physical devices.
| Aspect | Cloud network | On-premises |
|---|---|---|
| Elements | logical instances | physical devices |
| Network card | vNIC (virtual NIC) | NIC |
| Delivery | networking functions **as a service** | equipment in physical racks |
## VPC and subnets
- Start by defining the **size of the network** — the **IP address range** that sets its boundaries.
- Cloud networks are deployed in logically separated segments such as a **Virtual Private Cloud (VPC)**, which is divided into smaller segments called **subnets**.
- A VPC is a **private carve-out of the cloud**: the **security of a private cloud** with the **scalability of a public cloud**.
- Cloud resources — **VMs or Virtual Server Instances (VSIs)**, storage, network connectivity, load balancers — are **deployed into subnets**.
= Region > VPC > Zone 1 (10.0.0.0/16) > Subnet 1 10.10.0.0/24, Subnet 2 10.20.0.0/24, Subnet 3 10.30.0.0/24
- Subnets let you deploy enterprise apps with the same **multi-tier** concepts used on-premises.
## Security in subnets: ACLs and Security Groups
Subnets are the main area where **security** is implemented in the cloud:
- **Access Control List (ACL)** — protects every subnet; a **subnet-level firewall**.
- **Security Group (SG)** — created within a subnet; security at the **instance level**, for example for VSIs.
## Example: a 3-tier application
- Web-facing VSIs go into **SG 1** (public subnet), application VSIs into **SG 2** and database VSIs into **SG 3** (private subnets).
- Web VSIs need internet access: a **public gateway** enables users' access to the web tier.
- Enterprises extend on-premises resources to the cloud securely with a **Virtual Private Network (VPN)** through a VPN gateway.
- **Load balancers** keep applications responsive by ensuring bandwidth availability across many subnets and workloads.
- **Direct connectivity**: hybrid-cloud enterprises use **dedicated high-speed connections** between on-premises and the cloud — more secure and efficient than public connectivity, for example **IBM Cloud Direct Link**.
| Element | Role | In the 3-tier example |
|---|---|---|
| ACL | subnet-level firewall | one for each subnet |
| Security Group | instance-level security | SG 1 web, SG 2 app, SG 3 DB |
| Public gateway | internet access | for the web tier |
| VPN gateway | secure link to on-premises | enterprise ↔ VPC |
| Direct Link | dedicated high-speed private link | hybrid cloud |
| Load balancer | responsiveness, bandwidth | in front of the tiers |
Building a cloud network means creating a set of **logical constructs** that deliver networking functionality akin to data center networks — for **securing environments** and ensuring **high-performing** business applications.
## Containers
**Operating-system-level virtualization**, or **containerization**, runs multiple **isolated user-space instances** in parallel. Each instance has the **application code, the required libraries and the runtime**, with no external dependencies — these instances are **containers**. On Unix-like systems this is an advanced implementation of the **chroot** mechanism.
A container is an **executable unit of software** in which application code is packaged with its **libraries and dependencies** in common ways, so it can **run anywhere** — desktop, traditional IT or the cloud. Containers are **small, fast and portable**, and unlike VMs they **do not need a guest OS** in every instance: they leverage the features and resources of the **host OS**.
@diagram cc-vm-vs-container
Docker is a **shipping container system for code**: an engine that encapsulates any payload as a lightweight, portable, self-sufficient container that runs consistently on virtually any hardware — a development VM, a QA server, a customer data center, a public cloud, a production cluster, a contributor's laptop.
## Container use cases and container-native applications
- **Lift and shift** existing apps into modern cloud architectures — gives the basic benefits of OS virtualization, but not the full benefits of a modular, container-based architecture.
- **Refactor** existing apps for containers — much more intensive than lift and shift, but unlocks the full benefits.
- **Develop new container-native applications** — also unlocks the full benefits of containers.
- Better support for **microservices** — distributed apps are easier to isolate, deploy and scale as individual container building blocks.
- **DevOps support for CI/CD** — streamlined build, test and deployment from the same container images.
- Easier deployment of **repetitive jobs** that often run in the background, such as **ETL** functions or **batch jobs**.
## Images and containers
- An **image** is the box with the application, its dependencies and the **user-space libraries** (like **glibc**, which enables switching from user space to kernel space). An image contains **no kernel-space components**.
- A **container** is a **running instance** of an image; **many containers** can be spun from **one image**.
- A container runs as a **process on the host's kernel**; it is the host kernel's job to isolate each container and give it resources.
## Container runtimes
- **runC** — the CLI tool for spawning and running containers according to the **OCI** (Open Container Initiative) specifications.
- **rkt** ("rock-it") — an open source, **Apache 2.0**-licensed project from **CoreOS** that implements the **App Container** specification.
- **Docker** uses the **containerd** daemon to control runC containers; Docker is fully supported on Linux.
Docker stack: the user works with the **Docker Engine** (same UI and commands) → the engine talks to **containerd** → containerd spins up **runc** or another OCI-compliant runtime to run containers.
## Docker
**Docker** is an **open source, Apache 2.0-licensed** project. It uses a **client-server architecture**: the Docker client connects to a server (the **Docker Host**) and executes the commands. Parts named on the slide: Docker runtime, **Docker Datacenter** (Docker Trusted Registry, Universal Control Plane), **Docker Cloud** and **Docker Hub**.
@diagram cc-docker-flow
Basic Docker operations:
= $ docker images
= $ docker pull alpine
= $ docker run -it alpine sh
= $ docker run -d nginx
| Command | What it does |
|---|---|
| docker images | lists the locally available images |
| docker pull alpine | downloads the alpine image from a registry |
| docker run -it alpine sh | starts a container interactively with a shell |
| docker run -d nginx | runs an nginx container in the background (-d, detached) |
![Terminal window after running 'docker images', 'docker pull alpine' and 'docker run -d nginx': a table with REPOSITORY, TAG, IMAGE ID, CREATED and SIZE columns listing alpine and nginx, followed by a long hexadecimal container ID](/events/cc/l2-docker-terminal.webp)
## Benefits of containers
| Benefit | Meaning |
|---|---|
| Less overhead | fewer system resources than VMs — no OS image inside |
| Increased portability | deploy to many OSes and hardware platforms, within milliseconds |
| More consistent operation | runs the same on any computer, infrastructure or cloud |
| Greater efficiency | deployed, patched and scaled up or down quickly |
| Better application development | supports agile and DevOps; a very rich ecosystem |
| Easier troubleshooting | a problem container is isolated quickly |
> A VM virtualizes the hardware and carries its own guest OS; a container virtualizes the OS and shares the host kernel. An image is the template, a container is its running instance.
?? Where would you place the database servers of a 3-tier app, and what protects them?
?= In a private subnet, in their own Security Group (instance-level security), with the subnet's ACL acting as a subnet-level firewall; only the app tier should reach them.
?? You run 'docker run -d nginx' three times. How many images and containers do you have?
?= One nginx image and three containers: many containers can be started from the same image.`,
        ru: `## Зачем нужна безопасная облачная сеть
Облака используют всё шире, а цифровые данные притягивают быстро растущие **киберугрозы (cybersecurity threats)**, поэтому строить **безопасные сети в облаке** крайне важно.
## Облачная сеть и сеть on-premises
Строить сеть в облаке — почти то же, что разворачивать её в собственном дата-центре (on-premises). Главное отличие: в облаке используются **логические экземпляры (logical instances)** сетевых элементов, а не физические устройства.
| Аспект | Облачная сеть | On-premises |
|---|---|---|
| Элементы | логические экземпляры | физические устройства |
| Сетевая карта | vNIC (виртуальная NIC) | NIC |
| Как предоставляется | сетевые функции **как сервис** | оборудование в физических стойках |
## VPC и подсети
- Сначала задают **размер сети** — **диапазон IP-адресов**, который определяет её границы.
- Облачные сети разворачивают в логически отделённых сегментах, например в **Virtual Private Cloud (VPC)**, который делится на более мелкие сегменты — **подсети (subnets)**.
- VPC — это **частный «вырез» облака (private carve-out)**: **безопасность частного облака** вместе с **масштабируемостью публичного**.
- Облачные ресурсы — **VM или Virtual Server Instances (VSI)**, хранилища, сетевые подключения, балансировщики нагрузки — **размещаются в подсетях**.
= Region > VPC > Zone 1 (10.0.0.0/16) > Subnet 1 10.10.0.0/24, Subnet 2 10.20.0.0/24, Subnet 3 10.30.0.0/24
- Подсети позволяют разворачивать корпоративные приложения по той же **многоуровневой (multi-tier)** схеме, что и on-premises.
## Безопасность в подсетях: ACL и Security Groups
Подсети — главное место, где в облаке реализуется **безопасность**:
- **Access Control List (ACL)** — защищает каждую подсеть; это **межсетевой экран на уровне подсети (subnet-level firewall)**.
- **Security Group (SG)** — создаётся внутри подсети; безопасность на **уровне экземпляра (instance level)**, например для VSI.
## Пример: трёхуровневое приложение
- Веб-серверы (VSI) — в **SG 1** (публичная подсеть), серверы приложений — в **SG 2**, серверы баз данных — в **SG 3** (частные подсети).
- Веб-серверам нужен интернет: **public gateway (публичный шлюз)** открывает пользователям доступ к веб-уровню.
- Компании безопасно расширяют свои on-premises ресурсы в облако через **Virtual Private Network (VPN)** и VPN-шлюз.
- **Балансировщики нагрузки (load balancers)** сохраняют отзывчивость приложений, обеспечивая полосу пропускания для многих подсетей и нагрузок.
- **Прямое подключение (direct connectivity)**: компании с гибридным облаком используют **выделенные высокоскоростные каналы** между on-premises и облаком — безопаснее и эффективнее публичных подключений, например **IBM Cloud Direct Link**.
| Элемент | Роль | В трёхуровневом примере |
|---|---|---|
| ACL | межсетевой экран уровня подсети | по одному на каждую подсеть |
| Security Group | безопасность уровня экземпляра | SG 1 веб, SG 2 приложение, SG 3 БД |
| Public gateway | доступ в интернет | для веб-уровня |
| VPN gateway | защищённая связь с on-premises | компания ↔ VPC |
| Direct Link | выделенный быстрый частный канал | гибридное облако |
| Load balancer | отзывчивость, полоса пропускания | перед уровнями приложения |
Строить облачную сеть — значит создавать набор **логических конструкций**, которые дают сетевые функции, как в сетях дата-центра, — чтобы **защищать среды** и обеспечивать **высокую производительность** бизнес-приложений.
## Контейнеры
**Виртуализация на уровне ОС (operating-system-level virtualization)**, или **контейнеризация**, запускает параллельно несколько **изолированных экземпляров пользовательского пространства (user space)**. В каждом есть **код приложения, нужные библиотеки и среда выполнения**, без внешних зависимостей — такие экземпляры и называют **контейнерами**. В Unix-подобных ОС это развитая реализация механизма **chroot**.
Контейнер — **исполняемая единица ПО**, в которой код приложения упакован вместе с **библиотеками и зависимостями** стандартным способом, чтобы он **запускался где угодно** — на компьютере, в традиционной IT-среде или в облаке. Контейнеры **маленькие, быстрые и переносимые**, и, в отличие от VM, им **не нужна гостевая ОС** в каждом экземпляре: они используют возможности и ресурсы **хостовой ОС (host OS)**.
@diagram cc-vm-vs-container
Docker — это **«система грузовых контейнеров для кода»**: движок, который упаковывает любую нагрузку в лёгкий, переносимый, самодостаточный контейнер, одинаково работающий почти на любом железе — VM разработчика, QA-сервере, дата-центре клиента, публичном облаке, производственном кластере, ноутбуке участника проекта.
## Сценарии использования и container-native приложения
- **Lift and shift («поднять и перенести»)** существующие приложения в современную облачную архитектуру — даёт базовые плюсы виртуализации ОС, но не все преимущества модульной контейнерной архитектуры.
- **Refactor (переработать)** существующие приложения под контейнеры — гораздо труднее, чем lift and shift, но открывает все преимущества.
- **Создавать новые container-native приложения** — тоже открывает все преимущества контейнеров.
- Лучшая поддержка **микросервисов (microservices)** — распределённые приложения проще изолировать, развёртывать и масштабировать отдельными контейнерами.
- **Поддержка DevOps и CI/CD** — сборка, тестирование и развёртывание из одних и тех же образов контейнеров.
- Простое развёртывание **повторяющихся задач**, которые часто работают в фоне, например **ETL** или **пакетных заданий (batch jobs)**.
## Образы и контейнеры
- **Image (образ)** — «коробка» с приложением, его зависимостями и **библиотеками пользовательского пространства** (например, **glibc**, которая позволяет переходить из user space в kernel space). В образе **нет компонентов пространства ядра (kernel space)**.
- **Container (контейнер)** — **запущенный экземпляр** образа; из **одного образа** можно запустить **много контейнеров**.
- Контейнер работает как **процесс в ядре хоста**; изолировать каждый контейнер и выделять ему ресурсы — задача ядра хоста.
## Среды запуска контейнеров (container runtimes)
- **runC** — CLI-инструмент для создания и запуска контейнеров по спецификациям **OCI** (Open Container Initiative).
- **rkt** («рокит») — open source проект **CoreOS** под лицензией **Apache 2.0**, реализует спецификацию **App Container**.
- **Docker** управляет контейнерами runC через демон **containerd**; Docker полностью поддерживается в Linux.
Стек Docker: пользователь работает с **Docker Engine** (тот же интерфейс и команды) → движок общается с **containerd** → containerd запускает **runc** или другую OCI-совместимую среду, которая и выполняет контейнеры.
## Docker
**Docker** — **open source проект под лицензией Apache 2.0**. Он устроен по **архитектуре клиент-сервер (client-server)**: клиент Docker подключается к серверу (**Docker Host**) и выполняет команды. Части, названные на слайде: Docker runtime, **Docker Datacenter** (Docker Trusted Registry, Universal Control Plane), **Docker Cloud** и **Docker Hub**.
@diagram cc-docker-flow
Базовые операции Docker:
= $ docker images
= $ docker pull alpine
= $ docker run -it alpine sh
= $ docker run -d nginx
| Команда | Что делает |
|---|---|
| docker images | показывает образы, доступные локально |
| docker pull alpine | скачивает образ alpine из реестра |
| docker run -it alpine sh | запускает контейнер интерактивно с оболочкой |
| docker run -d nginx | запускает контейнер nginx в фоне (-d, detached) |
![Окно терминала после команд «docker images», «docker pull alpine» и «docker run -d nginx»: таблица со столбцами REPOSITORY, TAG, IMAGE ID, CREATED и SIZE, где перечислены alpine и nginx, а ниже — длинный шестнадцатеричный идентификатор контейнера](/events/cc/l2-docker-terminal.webp)
## Преимущества контейнеров
| Преимущество | Смысл |
|---|---|
| Less overhead (меньше накладных расходов) | меньше системных ресурсов, чем у VM, — внутри нет образа ОС |
| Increased portability (переносимость) | развёртываются на разных ОС и платформах за миллисекунды |
| More consistent operation (одинаковая работа) | работают одинаково на любом компьютере, инфраструктуре или в облаке |
| Greater efficiency (эффективность) | быстро развёртываются, обновляются и масштабируются вверх или вниз |
| Better application development | поддерживают agile и DevOps; очень богатая экосистема |
| Простая диагностика | проблемный контейнер быстро изолируют |
> VM виртуализирует железо и несёт свою гостевую ОС; контейнер виртуализирует ОС и делит ядро хоста. Образ (image) — шаблон, контейнер — его запущенный экземпляр.
?? Где разместить серверы базы данных трёхуровневого приложения и что их защищает?
?= В частной подсети, в собственной Security Group (безопасность уровня экземпляра), а ACL подсети работает как межсетевой экран уровня подсети; доступ к ним должен быть только у уровня приложения.
?? Вы трижды выполнили «docker run -d nginx». Сколько у вас образов и контейнеров?
?= Один образ nginx и три контейнера: из одного образа можно запустить много контейнеров.`,
      },
      [
        qx("What is the main difference between building a network in the cloud and on-premises?", "The cloud uses logical instances, not physical devices", [
          ["The cloud network needs no IP addresses at all", "Cloud networks start by defining an IP address range, so addresses are still needed.", "Облачная сеть начинается с выбора диапазона IP-адресов, так что адреса всё равно нужны."],
          ["On-premises networks cannot be split into subnets", "Subnets and multi-tier designs come from on-premises practice.", "Подсети и многоуровневые схемы как раз пришли из практики on-premises."],
          ["Cloud networks have no security controls of their own", "Cloud networks have ACLs, Security Groups, VPNs and more.", "В облачных сетях есть ACL, Security Groups, VPN и многое другое."],
        ], "Building a cloud network is similar to on-premises, but uses logical instances of networking elements instead of physical devices.", "Облачная сеть строится похоже на on-premises, но из логических экземпляров сетевых элементов, а не физических устройств."),
        qx("What represents a physical NIC in a cloud network?", "A vNIC", [
          ["A VPC", "A VPC is a whole logically isolated network, not a network card.", "VPC — целая логически изолированная сеть, а не сетевая карта."],
          ["An ACL", "An ACL is a subnet-level firewall, not an interface.", "ACL — межсетевой экран уровня подсети, а не интерфейс."],
          ["A CDN", "A CDN distributes content worldwide; it is not a server's interface.", "CDN раздаёт контент по миру; это не интерфейс сервера."],
        ], "In the cloud, Network Interface Controllers (NICs) are represented by virtual NICs (vNICs).", "В облаке сетевые карты (NIC) представлены виртуальными сетевыми картами (vNIC)."),
        qx("What is the first step when you create a network in the cloud?", "Define the IP address range of the network", [
          ["Order and install physical switches in the rack", "In the cloud networking is delivered as a service, not as rack devices.", "В облаке сеть предоставляется как сервис, а не устройствами в стойках."],
          ["Install a Type 2 hypervisor on a laptop", "Hypervisors are about server virtualization, not network design.", "Гипервизоры — про виртуализацию серверов, а не про проектирование сети."],
          ["Pull a container image from Docker Hub", "Containers are deployed later, into an existing network.", "Контейнеры разворачивают позже, в уже созданную сеть."],
        ], "One starts by defining the size of the network — the IP address range that sets the boundaries of the cloud network.", "Начинают с размера сети — диапазона IP-адресов, который задаёт границы облачной сети."),
        qx("Which statement about a Virtual Private Cloud (VPC) is true?", "It is a private carve-out of the cloud split into subnets", [
          ["It is a physical rack of dedicated network devices", "A VPC is a logical construct, not physical equipment.", "VPC — логическая конструкция, а не физическое оборудование."],
          ["It is a public CDN that caches static content close to users", "A CDN delivers content; a VPC isolates your resources.", "CDN доставляет контент, а VPC изолирует ваши ресурсы."],
          ["It is a container runtime made by CoreOS", "The CoreOS runtime is rkt, which has nothing to do with VPCs.", "Среда запуска от CoreOS — это rkt, к VPC она отношения не имеет."],
        ], "A VPC is a logically separated private carve-out of the cloud, divided into subnets: private-cloud security with public-cloud scale.", "VPC — логически отделённый частный «вырез» облака, разделённый на подсети: безопасность частного облака и масштаб публичного."),
        qx("Which control acts as a subnet-level firewall in the cloud?", "Access Control List (ACL)", [
          ["Security Group (SG)", "A Security Group works at the instance level, inside the subnet.", "Security Group работает на уровне экземпляра, внутри подсети."],
          ["Virtual Private Network (VPN)", "A VPN connects networks securely; it does not filter traffic at the subnet edge.", "VPN безопасно соединяет сети, а не фильтрует трафик на границе подсети."],
          ["Load balancer", "A load balancer spreads traffic for responsiveness; it is not a firewall.", "Балансировщик распределяет трафик ради отзывчивости; это не межсетевой экран."],
        ], "Every subnet is protected by an ACL that serves as a subnet-level firewall.", "Каждую подсеть защищает ACL, который служит межсетевым экраном уровня подсети."),
        qx("Which control provides security at the instance level, for example for each VSI?", "Security Group", [
          ["Access Control List", "An ACL protects the whole subnet, not individual instances.", "ACL защищает всю подсеть, а не отдельные экземпляры."],
          ["VPN gateway", "A VPN gateway connects on-premises networks; it does not secure single instances.", "VPN-шлюз соединяет с on-premises сетями и не защищает отдельные экземпляры."],
          ["Direct Link", "Direct Link is a dedicated connection to the cloud, not an instance firewall.", "Direct Link — выделенный канал в облако, а не защита экземпляра."],
        ], "Within a subnet, Security Groups provide security at the instance level, such as for VSIs.", "Внутри подсети Security Groups обеспечивают безопасность на уровне экземпляра, например VSI."),
        qx("In a 3-tier application, which tier needs a public gateway?", "The web-facing tier", [
          ["The database tier", "The database stays in a private subnet and must not face the internet.", "База данных остаётся в частной подсети и не должна смотреть в интернет."],
          ["The application tier", "The app tier is private; only the web tier talks to users.", "Уровень приложения частный; с пользователями общается только веб-уровень."],
          ["The backup storage tier", "The lecture's example has no such tier, and backups should stay private.", "В примере лекции такого уровня нет, а резервные копии должны оставаться частными."],
        ], "Web-facing VSIs need internet access, so a public gateway is added to enable users' access to the web tier.", "Веб-серверам нужен интернет, поэтому добавляют public gateway, чтобы пользователи попадали на веб-уровень."),
        qx("An enterprise wants to securely extend its on-premises network to a cloud VPC over the internet. What does it use?", "A Virtual Private Network (VPN)", [
          ["A public gateway on the web subnet", "A public gateway gives users internet access to the web tier; it is not a secure site link.", "Public gateway даёт пользователям доступ к веб-уровню, а не защищённую связь площадок."],
          ["A CDN edge location", "An edge location caches content; it does not connect private networks.", "Edge location кэширует контент и не соединяет частные сети."],
          ["A bigger Security Group", "A Security Group filters instance traffic; it does not create a link to on-premises.", "Security Group фильтрует трафик экземпляров и не создаёт связь с on-premises."],
        ], "Enterprises extend on-premises resources to the cloud by securely connecting them with Virtual Private Networks (VPNs).", "Компании расширяют свои on-premises ресурсы в облако, безопасно соединяя их через VPN."),
        qx("A hybrid-cloud bank wants a dedicated high-speed link to the cloud instead of public connectivity. Which option fits?", "A direct link such as IBM Cloud Direct Link", [
          ["A public gateway in the web subnet", "A public gateway is internet access, the opposite of a dedicated private link.", "Public gateway — доступ в интернет, противоположность выделенному частному каналу."],
          ["A VPN tunnel that runs across the public internet", "A VPN still uses public connectivity; the bank wants a dedicated line.", "VPN всё равно идёт через публичную сеть, а банку нужен выделенный канал."],
          ["A larger Security Group for the DB tier", "Security Groups filter traffic; they do not provide a connection.", "Security Groups фильтруют трафик, а не дают подключение."],
        ], "Dedicated high-speed connections such as IBM Cloud Direct Link are more secure and efficient than public connectivity.", "Выделенные высокоскоростные каналы, например IBM Cloud Direct Link, безопаснее и эффективнее публичных подключений."),
        qx("What is a container?", "App code packaged with its libraries and dependencies", [
          ["A VM that carries its own full guest OS", "Containers do not need a guest OS in every instance; VMs do.", "Контейнерам не нужна гостевая ОС в каждом экземпляре — она нужна VM."],
          ["A single-tenant physical server dedicated to one customer", "That is a bare metal server.", "Это bare metal сервер."],
          ["A subnet protected by an ACL", "A subnet is a network segment, not a unit of software.", "Подсеть — сегмент сети, а не единица ПО."],
        ], "A container is an executable unit of software in which app code is packaged with its libraries and dependencies to run anywhere.", "Контейнер — исполняемая единица ПО: код приложения, упакованный с библиотеками и зависимостями, чтобы работать где угодно."),
        qx("Why are containers lighter than virtual machines?", "They use the host OS instead of a guest OS", [
          ["They run with no operating system kernel", "Containers do need a kernel — they share the host's kernel.", "Контейнерам нужно ядро — они используют ядро хоста."],
          ["They carry a smaller guest OS in each instance", "Containers carry no guest OS at all.", "В контейнерах вообще нет гостевой ОС."],
          ["They only run on bare metal servers", "Containers run anywhere: laptops, VMs, data centers and clouds.", "Контейнеры работают где угодно: на ноутбуках, VM, в дата-центрах и облаках."],
        ], "Unlike VMs, containers do not include a guest OS in every instance and simply leverage the host OS.", "В отличие от VM, контейнеры не включают гостевую ОС в каждый экземпляр, а используют хостовую ОС."),
        qx("On Unix-like systems, containerization can be seen as an advanced implementation of which mechanism?", "chroot", [
          ["chmod", "chmod changes file permissions; it does not isolate processes.", "chmod меняет права доступа к файлам и не изолирует процессы."],
          ["crontab", "crontab schedules recurring jobs; it has nothing to do with isolation.", "crontab планирует периодические задания и не связан с изоляцией."],
          ["sudo", "sudo runs commands as another user; it creates no isolated user space.", "sudo запускает команды от имени другого пользователя и не создаёт изолированное пространство."],
        ], "On Unix-like operating systems, containerization is an advanced implementation of the standard chroot mechanism.", "В Unix-подобных ОС контейнеризация — развитая реализация стандартного механизма chroot."),
        qx("What is the difference between an image and a container?", "A container is a running instance of an image", [
          ["An image is a running instance of a container", "This is reversed: the image is the template, the container runs from it.", "Здесь всё наоборот: образ — шаблон, а контейнер запускается из него."],
          ["An image includes the host's kernel", "An image has no kernel-space components; it uses the host kernel at run time.", "В образе нет компонентов ядра; он использует ядро хоста при запуске."],
          ["One image can start only one container", "Many containers can be spun from the same image.", "Из одного образа можно запустить много контейнеров."],
        ], "The box with the app and its dependencies is an image; a running instance of it is a container.", "Коробка с приложением и зависимостями — образ (image); его запущенный экземпляр — контейнер."),
        qx("Which of these does a container image NOT contain?", "Kernel-space components", [
          ["User-space libraries such as glibc", "User-space libraries like glibc are part of the image.", "Библиотеки пользовательского пространства, вроде glibc, входят в образ."],
          ["The application code", "The application itself is the main content of an image.", "Само приложение — основное содержимое образа."],
          ["The app's dependencies", "An image bundles the app together with all its dependencies.", "Образ упаковывает приложение вместе со всеми зависимостями."],
        ], "An image contains the app, its dependencies and user-space libraries, but no kernel-space components.", "Образ содержит приложение, зависимости и библиотеки user space, но не компоненты kernel space."),
        qx("Which tool spawns and runs containers according to the OCI specifications?", "runC", [
          ["rkt", "rkt implements the App Container specification, not OCI.", "rkt реализует спецификацию App Container, а не OCI."],
          ["Docker Hub", "Docker Hub is a registry that stores images; it does not run containers.", "Docker Hub — реестр для хранения образов, он не запускает контейнеры."],
          ["glibc", "glibc is a user-space C library inside images.", "glibc — библиотека C пользовательского пространства внутри образов."],
        ], "runC is the CLI tool for spawning and running containers according to the OCI specifications.", "runC — CLI-инструмент для создания и запуска контейнеров по спецификациям OCI."),
        qx("Which daemon does Docker use to control runC containers?", "containerd", [
          ["kubelet", "kubelet is the Kubernetes node agent, not Docker's daemon for runC.", "kubelet — агент узла Kubernetes, а не демон Docker для runC."],
          ["systemd", "systemd manages Linux services in general, not Docker's runC containers.", "systemd управляет службами Linux в целом, а не контейнерами runC в Docker."],
          ["Docker Hub", "Docker Hub is a registry for images, not a daemon.", "Docker Hub — реестр образов, а не демон."],
        ], "Docker uses the containerd daemon to control runC containers.", "Docker управляет контейнерами runC через демон containerd."),
        qx("Which license and architecture does Docker have?", "Apache 2.0 license, client-server", [
          ["GPL license, peer-to-peer", "Docker is not GPL-licensed and is not peer-to-peer.", "Docker не под GPL и не одноранговый (peer-to-peer)."],
          ["Proprietary license, client-server", "Docker is an open source project, not proprietary.", "Docker — open source проект, а не проприетарный."],
          ["Apache 2.0 license, peer-to-peer", "The license is right, but Docker's client connects to a server, the Docker Host.", "Лицензия верна, но клиент Docker подключается к серверу — Docker Host."],
        ], "Docker is an open source, Apache 2.0-licensed project with a client-server architecture.", "Docker — open source проект под лицензией Apache 2.0 с архитектурой клиент-сервер."),
        qx("Which command runs an nginx container in the background?", "docker run -d nginx", [
          ["docker pull -d nginx", "docker pull only downloads an image; it does not run anything.", "docker pull только скачивает образ и ничего не запускает."],
          ["docker images nginx", "docker images lists local images; it starts no container.", "docker images показывает локальные образы и не запускает контейнер."],
          ["docker run -it nginx sh", "-it starts an interactive session, not a background container.", "-it запускает интерактивный сеанс, а не фоновый контейнер."],
        ], "The -d option runs the container in the background (detached).", "Флаг -d запускает контейнер в фоне (detached)."),
        qx("A company moves an existing app into containers without redesigning it. What is this approach called?", "Lift and shift", [
          ["Refactoring", "Refactoring changes the app's design for containers and is much more intensive.", "Рефакторинг меняет устройство приложения под контейнеры и гораздо труднее."],
          ["Container-native development", "Container-native means building a new app for containers from the start.", "Container-native — создание нового приложения под контейнеры с нуля."],
          ["Microservices decomposition", "Splitting into microservices is a redesign, the opposite of moving as is.", "Деление на микросервисы — это перепроектирование, противоположность переносу как есть."],
        ], "Lift and shift moves existing apps into modern environments; it gives basic benefits but not the full benefits of a modular design.", "Lift and shift переносит приложения в современную среду как есть — даёт базовые плюсы, но не все преимущества модульной архитектуры."),
        tfx("Containers can be deployed very fast, within milliseconds.", true,
          "The lecture lists deployment within milliseconds as part of the increased portability of containers.",
          "В лекции развёртывание за миллисекунды названо частью повышенной переносимости контейнеров.",
          "False is wrong: containers do not boot a guest OS, so they start far faster than VMs.",
          "«Неверно» — ошибка: контейнеры не загружают гостевую ОС, поэтому стартуют гораздо быстрее VM."),
      ],
    ),
  ],
};
