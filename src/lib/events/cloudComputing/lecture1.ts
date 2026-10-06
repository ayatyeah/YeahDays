import { part, qx, tfx, type Lecture } from "../types";

export const lecture1: Lecture = {
  id: "cc-l1",
  title: { en: "Lecture 1 — Overview of Cloud Computing", ru: "Лекция 1 — Обзор облачных вычислений" },
  parts: [
    part(
      "cc-l1-p1",
      { en: "Definition and essential characteristics", ru: "Определение и основные характеристики" },
      {
        en: `## What cloud computing is
**Cloud computing**, also called **"the cloud"**, is the **delivery of on-demand computing resources** — everything from applications to data centers — **over the internet** on a **pay-for-use** basis.
Instead of buying and running your own hardware, you rent what you need from a provider, get it in minutes and give it back when you no longer need it.
## The NIST definition
**NIST** — the **US National Institute of Standards and Technology** — gives the common definition that exams quote:
= Cloud computing is a model for enabling convenient, on-demand network access to a shared pool of configurable computing resources that can be rapidly provisioned and released with minimal management effort or service provider interaction.
The key words, one by one:
- **convenient, on-demand network access** — you get resources whenever you ask for them, over the network;
- **shared pool** — the same physical resources serve many customers;
- **configurable computing resources** — networks, servers, storage, applications and services;
- **rapidly provisioned and released** — given to you and taken back quickly;
- **minimal management effort or service provider interaction** — no paperwork, no calls, no waiting for staff.
| Computing resource | What you can rent |
|---|---|
| Networks | virtual networks, IP addresses, load balancers |
| Servers | virtual machines with the CPU and memory you choose |
| Storage | disks, file and object storage |
| Applications | email, office suites, CRM systems |
| Services | managed databases, analytics, machine learning |
## The cloud model: 5 + 3 + 3
NIST describes the cloud model as **five essential characteristics**, **three deployment models** and **three service models**.
| Group | Members |
|---|---|
| 5 essential characteristics | on-demand self-service, broad network access, resource pooling, rapid elasticity, measured service |
| 3 deployment models | public, private, hybrid (often plus community) |
| 3 service models | IaaS, PaaS, SaaS |
## 1. On-demand self-service
You get access to cloud resources such as **processing power, storage and network** through a **simple interface** (a web console or an API), **without requiring human interaction** with each service provider.
- Example: a developer opens the provider's console at night, picks a server size and starts it in two minutes — nobody at the provider has to approve it.
- The opposite: emailing a hosting company and waiting days until an engineer sets up a server.
## 2. Broad network access
Cloud resources can be **accessed via the network** through **standard mechanisms and platforms** such as **mobile phones, tablets, laptops and workstations**.
- Example: you edit the same cloud document on your phone on the bus and on a laptop at home.
## 3. Resource pooling
Resource pooling is what gives cloud providers **economies of scale**, which they **pass on to their customers**, making cloud **cost-efficient**.
- **Multi-tenant model** — computing resources are pooled to serve **multiple consumers (tenants)** at once; each tenant sees only its own applications and OS.
- Resources are **dynamically assigned and reassigned according to demand**.
- Customers do **not need to concern themselves with the physical location** of the resources (at most they pick a country or region).
- Picture from the slide: three users, each with their own app and OS, all running on one shared physical server.
## 4. Rapid elasticity
You can **access more resources when you need them and scale back when you don't**, because resources are **elastically provisioned and released**. To the consumer the capacity often looks unlimited.
- Example: an online shop adds servers for a holiday sale and removes them the next week.
## 5. Measured service
You **only pay for what you use or reserve as you go** — if you are not using resources, you are not paying. Resource usage is **monitored, measured and reported transparently** based on utilization.
- Example: the monthly bill shows 120 hours of one virtual machine and 50 GB of storage.
| Characteristic | In one phrase | Everyday analogy |
|---|---|---|
| On-demand self-service | take it yourself, no human needed | self-checkout in a supermarket |
| Broad network access | reach it from any device over the network | online banking on a phone or laptop |
| Resource pooling | many tenants share one pool | flats in one building sharing a boiler |
| Rapid elasticity | grow and shrink quickly | extra chairs for guests, removed later |
| Measured service | metered, pay for what you use | an electricity meter |
## Technology as a service and pay-as-you-go
Cloud computing is really about using technology **"as a service"**: leveraging **remote systems on demand** over the open internet, **scaling up and scaling back**, and **paying for what you use**.
On the pay-as-you-go slide a **public cloud** offers **servers, storage, network, security and applications**, and the user pays a metered price only for the parts actually taken.
It is called a **revolution** because it changed how the world consumes compute services:
- **cost-efficient** — no idle hardware of your own to pay for;
- **more agile to market change** — organizations react faster to changes in their markets.
![A public cloud web console on a laptop screen showing a 'Launch instance' page: a table of server sizes with vCPU and memory columns, a storage size field and a 'Launch' button](/events/cc/l1-console-launch-instance.webp)
> Five NIST characteristics: self-service, broad network access, resource pooling, rapid elasticity, measured service — every real cloud service has all five.
?? An online shop doubles its servers for a weekend sale and releases them on Monday. Which characteristic is this?
?= Rapid elasticity — resources are provisioned and released as demand changes; measured service then bills only for the days they ran.
?? Why does resource pooling make the cloud cheap?
?= Many tenants share one pool of hardware (the multi-tenant model), so the provider gets economies of scale and passes the savings on to customers.`,
        ru: `## Что такое облачные вычисления
**Cloud computing (облачные вычисления)**, или просто **«облако» (the cloud)**, — это **предоставление вычислительных ресурсов по запросу (on-demand)** — от приложений до целых дата-центров — **через интернет** с **оплатой за использование (pay-for-use)**.
Вместо того чтобы покупать и обслуживать своё оборудование, вы берёте у провайдера в аренду то, что нужно, получаете это за минуты и возвращаете, когда оно больше не нужно.
## Определение NIST
**NIST** — **US National Institute of Standards and Technology (Национальный институт стандартов и технологий США)** — даёт общепринятое определение, которое цитируют на экзаменах:
= Cloud computing is a model for enabling convenient, on-demand network access to a shared pool of configurable computing resources that can be rapidly provisioned and released with minimal management effort or service provider interaction.
Ключевые слова по порядку:
- **convenient, on-demand network access** — удобный доступ по сети к ресурсам в любой момент, когда вы их запросили;
- **shared pool (общий пул)** — одни и те же физические ресурсы обслуживают многих клиентов;
- **configurable computing resources (настраиваемые ресурсы)** — сети, серверы, хранилище, приложения и сервисы;
- **rapidly provisioned and released** — быстро выделяются и так же быстро освобождаются;
- **minimal management effort or service provider interaction** — минимум усилий по управлению и общения с провайдером: без бумаг, звонков и ожидания сотрудников.
| Вычислительный ресурс | Что можно арендовать |
|---|---|
| Networks (сети) | виртуальные сети, IP-адреса, балансировщики нагрузки |
| Servers (серверы) | виртуальные машины с нужными CPU и памятью |
| Storage (хранилище) | диски, файловое и объектное хранилище |
| Applications (приложения) | почта, офисные пакеты, CRM-системы |
| Services (сервисы) | управляемые базы данных, аналитика, машинное обучение |
## Облачная модель: 5 + 3 + 3
NIST описывает облачную модель как **пять основных характеристик (essential characteristics)**, **три модели развёртывания (deployment models)** и **три модели обслуживания (service models)**.
| Группа | Состав |
|---|---|
| 5 essential characteristics | on-demand self-service, broad network access, resource pooling, rapid elasticity, measured service |
| 3 deployment models | public, private, hybrid (часто добавляют community) |
| 3 service models | IaaS, PaaS, SaaS |
## 1. On-demand self-service (самообслуживание по запросу)
Вы получаете облачные ресурсы — **вычислительную мощность, хранилище и сеть** — через **простой интерфейс** (веб-консоль или API), **без участия человека** со стороны провайдера.
- Пример: разработчик ночью открывает консоль провайдера, выбирает размер сервера и запускает его за две минуты — никто у провайдера ничего не согласовывает.
- Противоположность: написать письмо хостинг-компании и несколько дней ждать, пока инженер настроит сервер.
## 2. Broad network access (широкий сетевой доступ)
К облачным ресурсам можно **обращаться по сети** через **стандартные механизмы и платформы**: **мобильные телефоны, планшеты, ноутбуки и рабочие станции**.
- Пример: вы правите один и тот же облачный документ с телефона в автобусе и с ноутбука дома.
## 3. Resource pooling (объединение ресурсов в пул)
Объединение ресурсов даёт провайдерам **экономию на масштабе (economies of scale)**, которую они **передают клиентам**, — поэтому облако **выгодно по цене (cost-efficient)**.
- **Multi-tenant model (мультиарендная модель)** — ресурсы собраны в общий пул и обслуживают **сразу многих потребителей (tenants, арендаторов)**; каждый видит только свои приложения и ОС.
- Ресурсы **динамически выделяются и перераспределяются по спросу**.
- Клиентам **не нужно думать о физическом расположении** ресурсов (максимум — выбрать страну или регион).
- Картинка со слайда: три пользователя, у каждого своё приложение и ОС, а работают все на одном общем физическом сервере.
## 4. Rapid elasticity (быстрая эластичность)
Можно **получить больше ресурсов, когда они нужны, и уменьшить их, когда не нужны**, потому что ресурсы **эластично выделяются и освобождаются**. Для потребителя мощность часто выглядит неограниченной.
- Пример: интернет-магазин добавляет серверы на время праздничной распродажи и убирает их через неделю.
## 5. Measured service (измеряемый сервис)
Вы **платите только за то, что используете или резервируете, по мере использования** — не пользуетесь ресурсами, значит не платите. Использование **отслеживается, измеряется и прозрачно отражается в отчётах** по фактической загрузке.
- Пример: в счёте за месяц — 120 часов работы одной виртуальной машины и 50 ГБ хранилища.
| Характеристика | Одной фразой | Бытовая аналогия |
|---|---|---|
| On-demand self-service | берёшь сам, без участия человека | касса самообслуживания в супермаркете |
| Broad network access | доступ с любого устройства по сети | онлайн-банк с телефона или ноутбука |
| Resource pooling | многие арендаторы делят один пул | квартиры одного дома с общей котельной |
| Rapid elasticity | быстро растёт и сжимается | лишние стулья для гостей, потом их убирают |
| Measured service | со счётчиком, платишь за использование | счётчик электроэнергии |
## Технологии как услуга и pay-as-you-go
Облачные вычисления — это использование технологий **«как услуги» (as a service)**: **удалённые системы по запросу** через открытый интернет, **масштабирование вверх и обратно** и **оплата за то, что используешь**.
На слайде про **pay-as-you-go (оплату по мере использования)** **публичное облако** предлагает **серверы, хранилище, сеть, безопасность и приложения**, а пользователь платит по счётчику только за то, что реально взял.
Это называют **революцией**, потому что облако изменило то, как мир потребляет вычисления:
- **cost-efficient** — не нужно платить за собственное простаивающее оборудование;
- **more agile to market change** — организации быстрее реагируют на изменения своего рынка.
![Веб-консоль публичного облака на экране ноутбука, страница «Launch instance»: таблица размеров серверов с колонками vCPU и памяти, поле размера диска и кнопка «Launch»](/events/cc/l1-console-launch-instance.webp)
> Пять характеристик NIST: self-service, broad network access, resource pooling, rapid elasticity, measured service — у любого настоящего облачного сервиса есть все пять.
?? Интернет-магазин удваивает серверы на выходные распродажи и отдаёт их в понедельник. Какая это характеристика?
?= Rapid elasticity — ресурсы выделяются и освобождаются вслед за спросом; measured service затем выставляет счёт только за дни работы.
?? Почему resource pooling делает облако дешёвым?
?= Многие арендаторы делят один пул оборудования (multi-tenant model), поэтому провайдер получает экономию на масштабе и передаёт её клиентам.`,
      },
      [
        qx("Whose definition of cloud computing does the lecture use as the common reference?", "NIST — National Institute of Standards and Technology", [
          ["ISO — International Organization for Standardization", "ISO publishes general international standards, but the reference cloud definition in the lecture comes from NIST.", "ISO выпускает общие международные стандарты, но опорное определение облака в лекции — от NIST."],
          ["IEEE — Institute of Electrical and Electronics Engineers", "The IEEE writes electrical and networking standards such as 802.11, not the reference definition of the cloud.", "IEEE пишет стандарты электроники и сетей вроде 802.11, а не опорное определение облака."],
          ["IETF — Internet Engineering Task Force", "The IETF maintains internet protocols like TCP/IP; it did not give the cloud definition used here.", "IETF поддерживает интернет-протоколы вроде TCP/IP; определение облака, которое здесь используется, дало не оно."],
        ], "The US National Institute of Standards and Technology (NIST) gives the definition of cloud computing used as a common reference.", "Определение облачных вычислений, на которое все ссылаются, дал Национальный институт стандартов и технологий США (NIST)."),
        qx("According to NIST, cloud computing enables on-demand network access to what?", "A shared pool of configurable computing resources", [
          ["A dedicated physical server reserved for each user", "The NIST definition stresses a shared pool, not hardware dedicated to one user.", "Определение NIST подчёркивает общий пул, а не оборудование, закреплённое за одним пользователем."],
          ["A private data center owned by every customer", "Customers do not own the data centers; they reach the provider's pool over the network.", "Клиенты не владеют дата-центрами; они обращаются к пулу провайдера по сети."],
          ["A fixed set of licensed desktop applications", "The resources are configurable and include networks, servers and storage, not just fixed desktop software.", "Ресурсы настраиваемые и включают сети, серверы и хранилище, а не только фиксированные настольные программы."],
        ], "NIST: on-demand network access to a shared pool of configurable computing resources (networks, servers, storage, applications, services).", "NIST: доступ по сети по запросу к общему пулу настраиваемых вычислительных ресурсов (сети, серверы, хранилище, приложения, сервисы)."),
        qx("Per the NIST definition, resources are rapidly provisioned and released with what?", "Minimal management effort or provider interaction", [
          ["Manual approval by the provider's support engineers", "Needing engineers to approve each request is the opposite of minimal service provider interaction.", "Ручное согласование инженерами — противоположность минимального взаимодействия с провайдером."],
          ["A signed contract for each new resource", "Signing a contract per resource is slow; the definition promises minimal management effort.", "Подписывать договор на каждый ресурс долго; определение обещает минимум усилий по управлению."],
          ["A minimum one-year reservation period", "Resources can be released quickly; a forced one-year term contradicts rapid release.", "Ресурсы можно быстро освободить; обязательный срок в год противоречит быстрому освобождению."],
        ], "The definition ends with: rapidly provisioned and released with minimal management effort or service provider interaction.", "Определение заканчивается так: быстро выделяются и освобождаются с минимальными усилиями по управлению или взаимодействием с провайдером."),
        qx("How many characteristics, deployment models and service models make up the NIST cloud model?", "5 characteristics, 3 deployment, 3 service models", [
          ["3 characteristics, 5 deployment, 3 service models", "The numbers are swapped: there are five characteristics and three deployment models.", "Числа перепутаны: характеристик пять, а моделей развёртывания три."],
          ["5 characteristics, 3 deployment, 4 service models", "There are three service models — IaaS, PaaS and SaaS — not four.", "Моделей обслуживания три — IaaS, PaaS и SaaS, а не четыре."],
          ["4 characteristics, 3 deployment, 3 service models", "There are five essential characteristics, ending with measured service.", "Основных характеристик пять, последняя — measured service."],
        ], "The cloud model = five essential characteristics, three deployment models and three service models.", "Облачная модель = пять основных характеристик, три модели развёртывания и три модели обслуживания."),
        qx("Which of these is NOT one of the five essential characteristics of cloud computing?", "Single-tenant hardware", [
          ["On-demand self-service", "On-demand self-service is the first of the five essential characteristics.", "On-demand self-service — первая из пяти основных характеристик."],
          ["Resource pooling", "Resource pooling is the third essential characteristic, based on a multi-tenant model.", "Resource pooling — третья основная характеристика, основанная на мультиарендной модели."],
          ["Rapid elasticity", "Rapid elasticity is the fourth essential characteristic: scale up and back as needed.", "Rapid elasticity — четвёртая основная характеристика: масштабирование вверх и обратно по мере нужды."],
        ], "The cloud is multi-tenant: resources are pooled for many consumers, so single-tenant hardware is not a characteristic.", "Облако мультиарендное: ресурсы объединены для многих потребителей, поэтому отдельное оборудование на одного клиента — не характеристика облака."),
        qx("A user starts a virtual server from a web console at 2 a.m. without contacting anyone at the provider. Which characteristic is this?", "On-demand self-service", [
          ["Broad network access", "Broad network access is about reaching resources from many kinds of devices, not about doing it without staff.", "Broad network access — про доступ с разных устройств, а не про то, что всё делается без сотрудников."],
          ["Resource pooling", "Resource pooling is about many tenants sharing one pool; the scenario is about serving yourself.", "Resource pooling — про общий пул для многих арендаторов; в сценарии же клиент обслуживает себя сам."],
          ["Measured service", "Measured service is about metering and billing usage, not about how the server was requested.", "Measured service — про учёт и оплату использования, а не про то, как запросили сервер."],
        ], "On-demand self-service: you get resources through a simple interface without human interaction with the provider.", "On-demand self-service: вы получаете ресурсы через простой интерфейс без участия человека со стороны провайдера."),
        qx("Students open the same cloud app from phones, tablets, laptops and lab workstations. Which characteristic does this show?", "Broad network access", [
          ["On-demand self-service", "Self-service is about provisioning without human help; here the point is access from many devices.", "Self-service — про получение ресурсов без помощи людей; здесь же важен доступ с разных устройств."],
          ["Rapid elasticity", "Elasticity is about growing and shrinking capacity, not about the types of devices used.", "Эластичность — про рост и сокращение мощности, а не про типы устройств."],
          ["Resource pooling", "Pooling describes how the provider shares hardware among tenants, not how users reach it.", "Объединение в пул описывает, как провайдер делит оборудование между арендаторами, а не как пользователи к нему обращаются."],
        ], "Broad network access: resources are reached over the network through standard platforms — phones, tablets, laptops, workstations.", "Broad network access: к ресурсам обращаются по сети через стандартные платформы — телефоны, планшеты, ноутбуки, рабочие станции."),
        qx("Which characteristic gives cloud providers economies of scale that they pass on to their customers?", "Resource pooling", [
          ["Rapid elasticity", "Elasticity lets a customer scale up and down; the economies of scale come from sharing one pool.", "Эластичность позволяет клиенту масштабироваться; экономия на масштабе возникает из общего пула."],
          ["Measured service", "Measured service makes billing fair, but the low cost itself comes from pooling resources.", "Measured service делает оплату честной, но сама дешевизна возникает от объединения ресурсов."],
          ["Broad network access", "Access from many devices is convenient, but it is not what creates economies of scale.", "Доступ с разных устройств удобен, но экономию на масштабе создаёт не он."],
        ], "Resource pooling serves many consumers from one pool, giving economies of scale that make cloud cost-efficient.", "Resource pooling обслуживает многих потребителей из одного пула, это даёт экономию на масштабе и делает облако выгодным."),
        qx("What does the multi-tenant model mean in resource pooling?", "One pool of resources serves many consumers at once", [
          ["Each consumer gets a separate physical server", "A separate server per consumer is single tenancy, the opposite of multi-tenant pooling.", "Отдельный сервер на каждого — это single tenancy, противоположность мультиарендного пула."],
          ["Several providers share one customer's hardware", "It is the provider's hardware that is shared by many customers, not the other way round.", "Это оборудование провайдера делят многие клиенты, а не наоборот."],
          ["One consumer rents from several providers at once", "Using several providers is a multi-cloud strategy, not the multi-tenant model.", "Работа с несколькими провайдерами — это стратегия multi-cloud, а не мультиарендная модель."],
        ], "Using a multi-tenant model, computing resources are pooled to serve multiple consumers, assigned and reassigned by demand.", "В мультиарендной модели ресурсы объединены в пул и обслуживают многих потребителей, выделяясь и перераспределяясь по спросу."),
        qx("With resource pooling, what do customers usually NOT need to know about their resources?", "Their exact physical location", [
          ["The amount they are billed for", "Measured service reports usage transparently, so customers do see what they pay for.", "Measured service прозрачно показывает использование, поэтому клиент видит, за что платит."],
          ["The size of the server they chose", "The customer picks the server size through self-service, so they obviously know it.", "Размер сервера клиент выбирает сам через self-service, поэтому, конечно, его знает."],
          ["The OS installed on their own VM", "The customer chooses and runs the operating system on their VM, so they know it.", "Операционную систему на своей ВМ клиент выбирает и обслуживает сам, поэтому знает её."],
        ], "Resources are dynamically assigned without customers needing to concern themselves with their physical location.", "Ресурсы выделяются динамически, и клиентам не нужно думать об их физическом расположении."),
        qx("An online store adds servers for a holiday sale and removes them a week later. Which characteristic makes this possible?", "Rapid elasticity", [
          ["Resource pooling", "Pooling explains why spare capacity exists, but growing and shrinking with demand is elasticity.", "Пул объясняет, откуда берётся свободная мощность, но рост и сокращение по спросу — это эластичность."],
          ["Broad network access", "Broad network access is about reaching services from many devices, not about changing capacity.", "Broad network access — про доступ с разных устройств, а не про изменение мощности."],
          ["On-demand self-service", "Self-service is about getting resources without human help; scaling up and back with demand is elasticity.", "Self-service — про получение ресурсов без помощи людей; масштабирование вслед за спросом — это эластичность."],
        ], "Rapid elasticity: access more resources when you need them and scale back when you don't.", "Rapid elasticity: больше ресурсов, когда они нужны, и меньше, когда не нужны."),
        qx("Which characteristic means resource usage is monitored, measured and reported transparently?", "Measured service", [
          ["Resource pooling", "Pooling is about sharing resources among tenants, not about metering their use.", "Пул — про совместное использование ресурсов арендаторами, а не про учёт их потребления."],
          ["Rapid elasticity", "Elasticity changes how much you use; measuring and reporting that use is measured service.", "Эластичность меняет объём использования; измерять его и отчитываться — дело measured service."],
          ["On-demand self-service", "Self-service is about requesting resources yourself, not about measuring them afterwards.", "Self-service — про самостоятельный запрос ресурсов, а не про их измерение потом."],
        ], "Measured service: you pay for what you use or reserve, and usage is monitored, measured and reported transparently.", "Measured service: вы платите за то, что используете или резервируете, а использование отслеживается, измеряется и прозрачно отражается в отчётах."),
        tfx("With measured service, a resource that you neither use nor reserve still appears on your bill.", false, "Measured service means that if you are not using (or reserving) resources, you are not paying for them.", "Measured service означает: если вы не используете (и не резервируете) ресурсы, вы за них не платите.", "Choosing True would describe owning idle hardware; the cloud bills only actual use or reservations.", "Ответ True описывал бы владение простаивающим оборудованием; облако берёт плату только за фактическое использование или резерв."),
        qx("Which list matches the examples of computing resources given in the lecture?", "Networks, servers, storage, applications, services", [
          ["Routers, cables, monitors, keyboards, printers", "These are physical devices and peripherals, not the resource types listed with the NIST definition.", "Это физические устройства и периферия, а не типы ресурсов, перечисленные при определении NIST."],
          ["Employees, contracts, offices, licenses, budgets", "These are business assets, not computing resources delivered by the cloud.", "Это бизнес-активы, а не вычислительные ресурсы, которые предоставляет облако."],
          ["Mainframes, terminals, tapes, punch cards, disks", "These belong to the history of computing, not to the list of cloud resources.", "Это относится к истории вычислений, а не к списку облачных ресурсов."],
        ], "Examples of computing resources: networks, servers, storage, applications and services.", "Примеры вычислительных ресурсов: сети, серверы, хранилище, приложения и сервисы."),
        qx("Cloud computing delivers on-demand computing resources over the internet on what basis?", "A pay-for-use basis", [
          ["A fixed annual license basis", "A fixed yearly license is the traditional software model; the cloud charges for actual use.", "Фиксированная годовая лицензия — традиционная модель ПО; облако берёт плату за фактическое использование."],
          ["A free-of-charge basis", "Cloud resources are not free; you pay for what you use.", "Облачные ресурсы не бесплатны; вы платите за то, что используете."],
          ["A one-time purchase basis", "A one-time purchase means owning the resource; in the cloud you rent and pay per use.", "Разовая покупка означает владение; в облаке вы арендуете и платите за использование."],
        ], "Cloud computing is the delivery of on-demand computing resources over the internet on a pay-for-use basis.", "Облачные вычисления — это предоставление вычислительных ресурсов по запросу через интернет с оплатой за использование."),
        qx("Why does the lecture call cloud computing a revolution?", "It made compute cheaper and organizations more agile", [
          ["It replaced the public internet with private company networks", "The cloud is reached over the open internet; it did not replace it with private networks.", "К облаку обращаются через открытый интернет; оно не заменило его частными сетями."],
          ["It removed the need for any physical hardware", "Physical hardware still exists — it simply sits in the provider's data centers.", "Физическое оборудование никуда не делось — оно просто стоит в дата-центрах провайдера."],
          ["It made every application free to use", "Cloud services are paid per use; the change is in cost efficiency, not in being free.", "Облачные сервисы оплачиваются по использованию; перемена — в экономичности, а не в бесплатности."],
        ], "It changed how the world consumes compute: more cost-efficient, and organizations became more agile in responding to market changes.", "Облако изменило то, как мир потребляет вычисления: дешевле, а организации стали гибче реагировать на изменения рынка."),
        qx("Which pair of business outcomes does the pay-as-you-go slide highlight?", "Cost-efficient and more agile to market change", [
          ["Guaranteed zero downtime and complete data security", "The slide does not promise zero downtime or total security; data security is even listed as a challenge.", "Слайд не обещает нулевого простоя и полной безопасности; безопасность данных даже названа проблемой."],
          ["Free hardware and unlimited storage for all", "Nothing is free in pay-as-you-go: you pay for each resource you take.", "В pay-as-you-go ничего не бесплатно: вы платите за каждый взятый ресурс."],
          ["Lower salaries and fewer IT employees needed", "Staff costs are not the outcomes shown on the slide; it shows cost efficiency and agility.", "Зарплаты сотрудников на слайде не упоминаются; там показаны экономичность и гибкость."],
        ], "The slide shows two outcomes: cost-efficient, and more agile to market change.", "На слайде два результата: экономичность (cost-efficient) и гибкость к изменениям рынка (more agile to market change)."),
        qx("Which statement about rapid elasticity is true?", "Capacity can grow and shrink quickly with demand", [
          ["Capacity is fixed when the account is created", "Fixed capacity is the opposite of elasticity: cloud resources are provisioned and released as needed.", "Фиксированная мощность — противоположность эластичности: облачные ресурсы выделяются и освобождаются по мере нужды."],
          ["Resources can only be added, never released", "Elasticity works both ways: you scale back when you no longer need the resources.", "Эластичность работает в обе стороны: когда ресурсы не нужны, их уменьшают."],
          ["Each scaling step needs a new contract with the provider", "Scaling is done on demand without paperwork; a contract per step would kill elasticity.", "Масштабирование идёт по запросу без бумаг; договор на каждый шаг убил бы эластичность."],
        ], "Rapid elasticity: resources are elastically provisioned and released, so you scale up when needed and back when not.", "Rapid elasticity: ресурсы эластично выделяются и освобождаются — масштабируетесь вверх, когда нужно, и обратно, когда нет."),
        tfx("Broad network access means cloud resources can be reached only from the provider's own office network.", false, "Broad network access means resources are reachable over the network through standard devices such as phones, tablets, laptops and workstations.", "Broad network access означает, что ресурсы доступны по сети через стандартные устройства: телефоны, планшеты, ноутбуки и рабочие станции.", "Choosing True would limit access to one location, which is the opposite of broad access from any standard device.", "Ответ True ограничил бы доступ одним местом — это противоположность широкого доступа с любого стандартного устройства."),
        qx("Which phrase best summarizes cloud computing as described in the lecture?", "Technology used as a service, on demand, paid by use", [
          ["Software bought once and installed on each PC", "Buying and installing software on each PC is the traditional model the cloud replaces.", "Купить ПО один раз и поставить на каждый ПК — это традиционная модель, которую облако заменяет."],
          ["Hardware leased for years in the customer's building", "Long-term leased hardware on-site lacks on-demand access and pay-per-use.", "Оборудование в долгосрочной аренде у себя в здании не даёт доступа по запросу и оплаты по использованию."],
          ["A single mainframe shared through dumb terminals", "That is 1950s time-sharing, an ancestor of the cloud, not modern cloud computing.", "Это разделение времени 1950-х, предок облака, а не современные облачные вычисления."],
        ], "Cloud is technology 'as a service': remote systems on demand over the internet, scaling up and back, paying for what you use.", "Облако — это технологии «как услуга»: удалённые системы по запросу через интернет, масштабирование вверх и обратно, оплата за использование."),
      ],
    ),
    part(
      "cc-l1-p2",
      { en: "Deployment and service models", ru: "Модели развёртывания и модели обслуживания" },
      {
        en: `## Deployment models: where the cloud runs and who shares it
The lecture first names **three** deployment models — **public, private and hybrid** — and the extended slide adds a fourth, **community cloud**.
@diagram cc-deployment-models
## Public cloud
You **leverage cloud services over the open internet** on **hardware owned by the cloud provider**, but its usage is **shared by other companies**.
- Typically has **massive amounts of available space**, which translates into **easy scalability**.
- Recommended for **software development and collaborative projects**.
- Examples: AWS, Microsoft Azure, Google Cloud Platform, IBM Cloud, Alibaba Cloud.
## Private cloud
The cloud infrastructure is **provisioned for exclusive use by a single organization**.
- It could run **on-premises** (in the company's own data center) or be **owned, managed and operated by a service provider** — what makes it private is **exclusive use**, not location.
- Usually resides **behind a firewall** of the organization.
- Recommended for businesses with **very tight regulatory requirements**, such as banks, government bodies and hospitals.
## Hybrid cloud
A **mix of both public and private clouds, working together seamlessly** — the two platforms interact with each other.
- Recommended for businesses **balancing big data analytics with strict data privacy regulations**: sensitive data stays in the private part, heavy analytics runs in the public part.
- Example: a bank keeps customer records in its private cloud and rents public cloud servers to build its monthly reports.
## Community cloud
A **collaborative, multi-tenant platform** used by **several distinct organizations** to **share the same applications**. The users typically operate **within the same industry or field** and share the same concerns (security, compliance, mission).
- Example from the lecture: a shared **big data analysis platform**, such as **Databricks Community Edition**.
- Other examples: universities sharing one research platform, hospitals sharing one health-records system.
| Model | Who uses it | Who owns the hardware | Recommended for |
|---|---|---|---|
| Public | many companies share it | the cloud provider | development, collaboration, easy scaling |
| Private | one organization only | the organization or a provider | very tight regulatory requirements |
| Hybrid | one organization, public and private together | both sides | big data analytics with strict privacy rules |
| Community | several organizations of one field | the members or a provider | shared applications and shared concerns |
## Service models: what you rent
The three service models are based on the **three layers of a computing stack**: **Infrastructure, Platform and Applications**.
@diagram cc-service-models
## IaaS — Infrastructure as a Service
You get access to **infrastructure and physical computing resources** such as **servers, networking, storage and data center space** — **without the need to manage or operate them**.
- You still install and manage the **operating system, middleware, runtime, your applications and data**.
- Examples: **Amazon EC2**, **Azure Virtual Machines**, **Google Compute Engine**, **IBM Bare Metal Servers**.
## PaaS — Platform as a Service
You get access to the **platform** — the **hardware and software tools** usually needed to **develop and deploy applications** to users over the internet.
- The provider runs the servers, OS and runtime; you bring **only your code and data**.
- Examples: **Google App Engine** (allocates and de-allocates resources automatically), **Azure App Service**, **AWS Elastic Beanstalk**.
## SaaS — Software as a Service
A **software licensing and delivery model** in which software and applications are **centrally hosted** and **licensed on a subscription basis**; it is sometimes called **"on-demand software"**.
- You simply use the finished application in a browser or an app; the provider runs everything underneath.
- Examples: **Microsoft Office 365**, **Google Workspace (G Suite)**, **Salesforce**, **Dropbox**, **Zoom**.
## Who manages what
| Layer | On-premises | IaaS | PaaS | SaaS |
|---|---|---|---|---|
| Applications and data | you | you | you | provider |
| Runtime and middleware | you | you | provider | provider |
| Operating system | you | you | provider | provider |
| Virtualization | you | provider | provider | provider |
| Servers, storage, networking | you | provider | provider | provider |
Moving up from IaaS to PaaS to SaaS you **manage less**, but you also **control less**.
| Model | Typical user | What is rented | Example |
|---|---|---|---|
| IaaS | system administrator | virtual servers, disks, networks | Amazon EC2 |
| PaaS | software developer | a ready platform to run code | Google App Engine |
| SaaS | end user | a finished application | Office 365 |
![A small company server room behind a glass door with a badge reader: two black racks of servers with blinking green lights and a firewall appliance mounted on top](/events/cc/l1-private-cloud-server-room.webp)
> Deployment model = where the cloud lives and who shares it; service model = how much of the stack the provider runs for you.
?? Four hospitals share one patient-records platform built for healthcare rules. Which deployment model is this?
?= Community cloud — several organizations from the same field sharing the same applications.
?? A developer uploads only code; servers, OS and scaling are handled by the provider. Which service model is this?
?= PaaS — Platform as a Service, for example Google App Engine.`,
        ru: `## Модели развёртывания: где работает облако и кто его делит
Сначала в лекции названы **три** модели развёртывания (deployment models) — **public, private и hybrid**, а расширенный слайд добавляет четвёртую — **community cloud**.
@diagram cc-deployment-models
## Public cloud (публичное облако)
Вы **пользуетесь облачными сервисами через открытый интернет** на **оборудовании, которым владеет облачный провайдер**, а **делят это оборудование и другие компании**.
- Обычно располагает **огромным запасом свободных ресурсов**, а значит, **легко масштабируется (easy scalability)**.
- Рекомендуется для **разработки ПО и совместных проектов**.
- Примеры: AWS, Microsoft Azure, Google Cloud Platform, IBM Cloud, Alibaba Cloud.
## Private cloud (частное облако)
Облачная инфраструктура **выделена для исключительного использования одной организацией (exclusive use)**.
- Она может работать **on-premises** (в собственном дата-центре компании) или **принадлежать сервис-провайдеру, который её обслуживает и эксплуатирует**, — частным облако делает **исключительное использование**, а не место.
- Обычно находится **за межсетевым экраном (firewall)** организации.
- Рекомендуется компаниям с **очень жёсткими регуляторными требованиями**: банкам, госорганам, больницам.
## Hybrid cloud (гибридное облако)
**Сочетание публичного и частного облаков, которые бесшовно работают вместе**, — две платформы взаимодействуют друг с другом.
- Рекомендуется компаниям, которым нужно **совмещать анализ больших данных (big data analytics) со строгими требованиями к защите данных**: чувствительные данные остаются в частной части, тяжёлая аналитика идёт в публичной.
- Пример: банк хранит данные клиентов в своём частном облаке, а для ежемесячных отчётов арендует серверы в публичном.
## Community cloud (облако сообщества)
**Совместная мультиарендная (multi-tenant) платформа**, которую используют **несколько разных организаций**, чтобы **делить одни и те же приложения**. Пользователи обычно работают **в одной отрасли или сфере** и имеют общие задачи (безопасность, соответствие требованиям, миссия).
- Пример из лекции: общая **платформа анализа больших данных**, например **Databricks Community Edition**.
- Другие примеры: университеты с общей исследовательской платформой, больницы с общей системой медкарт.
| Модель | Кто пользуется | Чьё оборудование | Для чего рекомендуется |
|---|---|---|---|
| Public | многие компании вместе | облачного провайдера | разработка, совместная работа, лёгкое масштабирование |
| Private | только одна организация | организации или провайдера | очень жёсткие регуляторные требования |
| Hybrid | одна организация, public и private вместе | обеих сторон | аналитика больших данных при строгой защите данных |
| Community | несколько организаций одной сферы | участников или провайдера | общие приложения и общие задачи |
## Модели обслуживания: что вы арендуете
Три модели обслуживания (service models) основаны на **трёх уровнях вычислительного стека**: **Infrastructure, Platform и Applications** (инфраструктура, платформа, приложения).
@diagram cc-service-models
## IaaS — Infrastructure as a Service (инфраструктура как услуга)
Вы получаете доступ к **инфраструктуре и физическим вычислительным ресурсам** — **серверам, сети, хранилищу и площадям дата-центра** — **без необходимости ими управлять и их обслуживать**.
- Сами вы по-прежнему ставите и обслуживаете **операционную систему, middleware, среду выполнения (runtime), свои приложения и данные**.
- Примеры: **Amazon EC2**, **Azure Virtual Machines**, **Google Compute Engine**, **IBM Bare Metal Servers**.
## PaaS — Platform as a Service (платформа как услуга)
Вы получаете доступ к **платформе** — **аппаратным и программным инструментам**, которые обычно нужны, чтобы **разрабатывать и разворачивать приложения** для пользователей через интернет.
- Серверы, ОС и runtime ведёт провайдер; от вас — **только код и данные**.
- Примеры: **Google App Engine** (сам выделяет и освобождает ресурсы), **Azure App Service**, **AWS Elastic Beanstalk**.
## SaaS — Software as a Service (ПО как услуга)
**Модель лицензирования и распространения ПО**, в которой программы и приложения **размещены централизованно** и **лицензируются по подписке (subscription)**; иногда её называют **«on-demand software» (ПО по запросу)**.
- Вы просто пользуетесь готовым приложением в браузере или программе; всё, что под ним, ведёт провайдер.
- Примеры: **Microsoft Office 365**, **Google Workspace (G Suite)**, **Salesforce**, **Dropbox**, **Zoom**.
## Кто чем управляет
| Уровень | On-premises | IaaS | PaaS | SaaS |
|---|---|---|---|---|
| Приложения и данные | вы | вы | вы | провайдер |
| Runtime и middleware | вы | вы | провайдер | провайдер |
| Операционная система | вы | вы | провайдер | провайдер |
| Виртуализация | вы | провайдер | провайдер | провайдер |
| Серверы, хранилище, сеть | вы | провайдер | провайдер | провайдер |
Чем выше от IaaS к PaaS и SaaS, тем **меньше вы управляете**, но и **меньше контролируете**.
| Модель | Типичный пользователь | Что арендуется | Пример |
|---|---|---|---|
| IaaS | системный администратор | виртуальные серверы, диски, сети | Amazon EC2 |
| PaaS | разработчик | готовая платформа для запуска кода | Google App Engine |
| SaaS | конечный пользователь | готовое приложение | Office 365 |
![Небольшая серверная компании за стеклянной дверью со считывателем пропусков: две чёрные стойки серверов с мигающими зелёными огоньками и межсетевой экран, закреплённый сверху](/events/cc/l1-private-cloud-server-room.webp)
> Модель развёртывания = где живёт облако и кто его делит; модель обслуживания = какую часть стека за вас ведёт провайдер.
?? Четыре больницы делят одну платформу медкарт, созданную под правила здравоохранения. Какая это модель развёртывания?
?= Community cloud — несколько организаций одной сферы делят одни и те же приложения.
?? Разработчик загружает только код; серверы, ОС и масштабирование берёт на себя провайдер. Какая это модель обслуживания?
?= PaaS — Platform as a Service, например Google App Engine.`,
      },
      [
        qx("In which deployment model do you use services over the open internet on provider-owned hardware that other companies also use?", "Public cloud", [
          ["Private cloud", "A private cloud is for the exclusive use of one organization, not shared with other companies.", "Частное облако предназначено для одной организации и не делится с другими компаниями."],
          ["Community cloud", "A community cloud is shared only by organizations of one field with common concerns, not by any company.", "Облако сообщества делят только организации одной сферы с общими задачами, а не любые компании."],
          ["Hybrid cloud", "A hybrid cloud mixes public and private parts; the description fits the public part alone.", "Гибридное облако сочетает публичную и частную части; описание подходит только к публичной."],
        ], "Public cloud: services over the open internet on hardware owned by the provider, with usage shared by other companies.", "Публичное облако: сервисы через открытый интернет на оборудовании провайдера, которое делят и другие компании."),
        qx("What makes a cloud 'private', according to the lecture?", "It is provisioned for exclusive use by one organization", [
          ["It always runs on-premises in the company's own data center", "A private cloud can also be owned and operated by a service provider; location does not define it.", "Частное облако может принадлежать и сервис-провайдеру; его определяет не место."],
          ["It is never connected to the internet", "Private clouds can be connected to the internet; they usually sit behind a firewall.", "Частное облако может быть подключено к интернету; обычно оно стоит за межсетевым экраном."],
          ["It is operated only by the company's own staff", "A service provider may own, manage and operate it; what matters is exclusive use.", "Его может обслуживать и сервис-провайдер; важно именно исключительное использование."],
        ], "Private cloud: infrastructure provisioned for exclusive use by a single organization, on-premises or run by a provider.", "Частное облако: инфраструктура для исключительного использования одной организацией — у себя или у провайдера."),
        qx("A bank with very tight regulatory requirements wants cloud infrastructure behind its firewall, used by no one else. Which model fits?", "Private cloud", [
          ["Public cloud", "In a public cloud the hardware is shared with other companies, which the bank wants to avoid.", "В публичном облаке оборудование делится с другими компаниями, а банк хочет этого избежать."],
          ["Hybrid cloud", "A hybrid cloud includes a public part, while the bank wants nothing shared with others.", "В гибридном облаке есть публичная часть, а банк не хочет ничего делить с другими."],
          ["Community cloud", "A community cloud is shared by several organizations, not used by the bank alone.", "Облако сообщества делят несколько организаций, а не один банк."],
        ], "Private clouds usually reside behind a firewall and are recommended for businesses with very tight regulatory requirements.", "Частные облака обычно стоят за межсетевым экраном и рекомендуются бизнесу с очень жёсткими регуляторными требованиями."),
        qx("A business must balance big data analytics with strict data privacy regulations. Which deployment model is recommended?", "Hybrid cloud", [
          ["Public cloud", "A purely public cloud gives scale for analytics but does not keep sensitive data private.", "Чисто публичное облако даёт масштаб для аналитики, но не держит чувствительные данные в частной среде."],
          ["Private cloud", "A purely private cloud protects data but lacks the massive public capacity for big data analytics.", "Чисто частное облако защищает данные, но не даёт огромных публичных мощностей для анализа больших данных."],
          ["Community cloud", "A community cloud is for organizations sharing the same applications, not for this balance inside one business.", "Облако сообщества — для организаций с общими приложениями, а не для такого баланса внутри одной компании."],
        ], "Hybrid cloud combines public and private clouds; it is recommended for balancing big data analytics with strict data privacy.", "Гибридное облако сочетает публичное и частное; его рекомендуют, чтобы совместить анализ больших данных со строгой защитой данных."),
        qx("Several distinct organizations from the same industry share one multi-tenant platform and its applications. Which model is this?", "Community cloud", [
          ["Public cloud", "A public cloud is open to any company, not limited to organizations of one industry.", "Публичное облако открыто любой компании, а не только организациям одной отрасли."],
          ["Hybrid cloud", "A hybrid cloud is one organization mixing public and private clouds, not several organizations sharing apps.", "Гибридное облако — это одна организация, сочетающая публичное и частное, а не несколько организаций с общими приложениями."],
          ["Private cloud for each member", "Separate private clouds would not be shared; here the organizations share one platform.", "Отдельные частные облака не были бы общими; здесь же организации делят одну платформу."],
        ], "Community cloud: a collaborative, multi-tenant platform used by several distinct organizations of the same field to share the same applications.", "Облако сообщества: совместная мультиарендная платформа, которой несколько организаций одной сферы пользуются, чтобы делить одни и те же приложения."),
        qx("Which example does the lecture give for a community cloud?", "A shared big data analysis platform", [
          ["A single company's internal file server", "A file server used by one company is private infrastructure, not a community platform.", "Файловый сервер одной компании — частная инфраструктура, а не платформа сообщества."],
          ["A home NAS drive for family photos", "A home storage device is not a cloud shared by several organizations.", "Домашнее хранилище — не облако, которое делят несколько организаций."],
          ["A public video streaming website", "A streaming site serves the general public; it is not a platform shared by organizations of one field.", "Стриминговый сайт обслуживает всех подряд; это не платформа для организаций одной сферы."],
        ], "The slide's example of a community cloud is a big data analysis platform, such as Databricks Community Edition.", "Пример облака сообщества на слайде — платформа анализа больших данных, например Databricks Community Edition."),
        qx("Which deployment model is recommended for software development and collaborative projects because it scales easily?", "Public cloud", [
          ["Private cloud", "A private cloud is limited to one organization's capacity and is chosen for regulation, not easy scaling.", "Частное облако ограничено мощностями одной организации и выбирается ради требований регуляторов, а не лёгкого масштабирования."],
          ["Hybrid cloud", "Hybrid is recommended for analytics combined with strict privacy, not for general development projects.", "Гибридное облако рекомендуют для аналитики при строгой защите данных, а не для обычных проектов разработки."],
          ["Community cloud", "Community clouds serve organizations of one field sharing apps, not general collaborative development.", "Облако сообщества служит организациям одной сферы с общими приложениями, а не совместной разработке вообще."],
        ], "Public clouds have massive available space, so they scale easily; they are recommended for software development and collaborative projects.", "У публичных облаков огромный запас ресурсов, они легко масштабируются; их рекомендуют для разработки ПО и совместных проектов."),
        tfx("A private cloud can be owned, managed and operated by a third-party service provider.", true, "A private cloud is defined by exclusive use: it can run on-premises or be owned, managed and operated by a service provider.", "Частное облако определяется исключительным использованием: оно может работать у себя или принадлежать сервис-провайдеру, который его обслуживает.", "Choosing False assumes a private cloud must be on-premises, but location does not make a cloud private.", "Ответ False предполагает, что частное облако обязано быть у себя, но частным облако делает не место."),
        qx("The three service models are based on which three layers of a computing stack?", "Infrastructure, Platform, Applications", [
          ["Public cloud, Private cloud, Hybrid cloud", "These are deployment models, which describe where the cloud runs, not layers of the stack.", "Это модели развёртывания — где работает облако, а не уровни стека."],
          ["Servers, Operating systems, Databases", "These are components inside the stack, not the three layers that the service models are named after.", "Это компоненты внутри стека, а не три уровня, по которым названы модели обслуживания."],
          ["Compute, Storage, Networking", "These are all parts of the infrastructure layer only, the bottom of the stack.", "Всё это части только инфраструктурного уровня, нижнего в стеке."],
        ], "IaaS, PaaS and SaaS come from the three layers of a computing stack: Infrastructure, Platform and Applications.", "IaaS, PaaS и SaaS происходят от трёх уровней вычислительного стека: Infrastructure, Platform и Applications."),
        qx("Which service model gives access to servers, networking, storage and data center space without having to manage or operate them?", "IaaS", [
          ["PaaS", "PaaS gives a ready platform with tools to develop and deploy apps, not raw infrastructure.", "PaaS даёт готовую платформу с инструментами для разработки и развёртывания, а не «голую» инфраструктуру."],
          ["SaaS", "SaaS gives a finished application by subscription, not servers and storage.", "SaaS даёт готовое приложение по подписке, а не серверы и хранилище."],
          ["Community cloud", "Community cloud is a deployment model, not a service model.", "Community cloud — модель развёртывания, а не модель обслуживания."],
        ], "IaaS: access to infrastructure and physical computing resources — servers, networking, storage, data center space.", "IaaS: доступ к инфраструктуре и физическим ресурсам — серверам, сети, хранилищу, площадям дата-центра."),
        qx("Which service model provides the hardware and software tools needed to develop and deploy applications over the internet?", "PaaS", [
          ["IaaS", "IaaS gives raw infrastructure; you would still have to build the platform and tools yourself.", "IaaS даёт «голую» инфраструктуру; платформу и инструменты пришлось бы собирать самим."],
          ["SaaS", "SaaS delivers finished applications to end users, not tools for developing new ones.", "SaaS поставляет готовые приложения конечным пользователям, а не инструменты для создания новых."],
          ["Hybrid cloud", "Hybrid cloud is a deployment model mixing public and private, not a service model.", "Гибридное облако — модель развёртывания, сочетающая публичное и частное, а не модель обслуживания."],
        ], "PaaS: access to the platform — the hardware and software tools usually needed to develop and deploy applications.", "PaaS: доступ к платформе — аппаратным и программным инструментам для разработки и развёртывания приложений."),
        qx("Which service model is a licensing and delivery model with centrally hosted software licensed on a subscription basis?", "SaaS", [
          ["PaaS", "PaaS gives developers a platform to build apps, not finished software sold by subscription.", "PaaS даёт разработчикам платформу для создания приложений, а не готовое ПО по подписке."],
          ["IaaS", "IaaS rents infrastructure such as servers and storage, not hosted applications.", "IaaS сдаёт в аренду инфраструктуру — серверы и хранилище, а не размещённые приложения."],
          ["Private cloud", "Private cloud is a deployment model for one organization, not a software licensing model.", "Частное облако — модель развёртывания для одной организации, а не модель лицензирования ПО."],
        ], "SaaS is a software licensing and delivery model: software is centrally hosted and licensed on a subscription basis.", "SaaS — модель лицензирования и распространения ПО: оно размещено централизованно и лицензируется по подписке."),
        qx("What is another name for SaaS mentioned in the lecture?", "On-demand software", [
          ["Bare-metal hosting", "Bare-metal hosting means renting whole physical servers, which is infrastructure, not SaaS.", "Bare-metal hosting — аренда целых физических серверов, это инфраструктура, а не SaaS."],
          ["Utility hardware", "Utility refers to paying per use, and hardware is infrastructure; SaaS is about software.", "Utility — про оплату по использованию, а hardware — инфраструктура; SaaS же — про ПО."],
          ["Platform software", "A platform for building apps is PaaS, not SaaS.", "Платформа для создания приложений — это PaaS, а не SaaS."],
        ], "SaaS is sometimes also referred to as 'on-demand software'.", "SaaS иногда называют «on-demand software» — ПО по запросу."),
        qx("In IaaS, which of these does the customer still manage?", "The operating system and applications", [
          ["The physical servers and storage", "Servers and storage are exactly what the IaaS provider manages for you.", "Серверы и хранилище — именно то, чем в IaaS управляет провайдер."],
          ["The data center building and power", "The data center space is part of the infrastructure that the provider operates.", "Площади дата-центра — часть инфраструктуры, которую обслуживает провайдер."],
          ["The virtualization layer (hypervisor)", "In IaaS the provider runs virtualization; you get ready virtual machines.", "В IaaS виртуализацией управляет провайдер; вы получаете готовые виртуальные машины."],
        ], "In IaaS the provider manages networking, storage, servers and virtualization; you manage the OS, runtime, applications and data.", "В IaaS провайдер ведёт сеть, хранилище, серверы и виртуализацию; вы — ОС, runtime, приложения и данные."),
        qx("In PaaS, what is the customer mainly responsible for?", "Its own application code and data", [
          ["Patching the server operating system", "In PaaS the provider manages the OS; you do not patch it.", "В PaaS операционной системой управляет провайдер; обновлять её не вам."],
          ["Replacing failed disks in the servers", "Physical hardware is always the provider's job in any cloud service model.", "Физическое оборудование в любой облачной модели обслуживания — забота провайдера."],
          ["Installing the hypervisor on the hosts", "Virtualization is managed by the provider already in IaaS, so certainly in PaaS.", "Виртуализацией провайдер управляет уже в IaaS, а в PaaS — тем более."],
        ], "In PaaS the provider runs everything up to the runtime; the customer brings the application and its data.", "В PaaS провайдер ведёт всё вплоть до runtime; клиент приносит приложение и его данные."),
        qx("In SaaS, who manages the application, runtime, operating system and servers?", "The provider manages all of them", [
          ["The customer manages all of them", "That describes on-premises IT, the opposite end from SaaS.", "Это описание своей ИТ-инфраструктуры (on-premises) — противоположность SaaS."],
          ["The customer manages only the OS", "In SaaS the OS is hidden from the customer and run by the provider.", "В SaaS операционная система скрыта от клиента и управляется провайдером."],
          ["The customer manages only the servers", "Servers are run by the provider already in IaaS; in SaaS the customer touches none of them.", "Серверами провайдер управляет уже в IaaS; в SaaS клиент их вообще не касается."],
        ], "In SaaS the provider runs the whole stack; the customer simply uses the finished application.", "В SaaS провайдер ведёт весь стек; клиент просто пользуется готовым приложением."),
        qx("A developer deploys a web app to Google App Engine, which allocates resources automatically. Which service model is this?", "PaaS", [
          ["IaaS", "With IaaS the developer would create and manage virtual machines and their OS themselves.", "В IaaS разработчик сам создавал бы виртуальные машины и управлял их ОС."],
          ["SaaS", "SaaS is a finished application for end users; here the developer deploys their own code.", "SaaS — готовое приложение для пользователей; здесь же разработчик разворачивает свой код."],
          ["Private cloud", "Private cloud is a deployment model; App Engine runs in Google's public data centers.", "Частное облако — модель развёртывания; App Engine работает в публичных дата-центрах Google."],
        ], "Google App Engine is a platform for developing and hosting web apps that allocates and de-allocates resources itself: PaaS.", "Google App Engine — платформа для разработки и размещения веб-приложений, которая сама выделяет и освобождает ресурсы: это PaaS."),
        qx("A school gives every student an Office 365 account to write and share documents. Which service model do the students use?", "SaaS", [
          ["PaaS", "Students do not build or deploy apps; they use a finished application.", "Студенты не создают и не разворачивают приложения; они пользуются готовым."],
          ["IaaS", "Students do not rent servers or install an OS; the provider runs everything.", "Студенты не арендуют серверы и не ставят ОС; всё ведёт провайдер."],
          ["Community cloud", "Community cloud is a deployment model, and Office 365 is a public cloud service.", "Community cloud — модель развёртывания, а Office 365 — сервис публичного облака."],
        ], "Office 365 is centrally hosted software licensed by subscription — a classic SaaS example from education and everyday life.", "Office 365 — централизованно размещённое ПО по подписке, классический пример SaaS из учёбы и повседневной жизни."),
        qx("An admin rents virtual machines and installs the OS and a database on them. Which service model is this?", "IaaS", [
          ["PaaS", "In PaaS the OS and runtime would already be managed by the provider.", "В PaaS ОС и runtime уже вёл бы провайдер."],
          ["SaaS", "In SaaS there is nothing to install; the application is ready to use.", "В SaaS ничего устанавливать не нужно; приложение готово к работе."],
          ["Hybrid cloud", "Hybrid cloud is a deployment model, not a description of who manages the OS.", "Гибридное облако — модель развёртывания, а не описание того, кто управляет ОС."],
        ], "Renting virtual servers and managing the OS and software yourself is Infrastructure as a Service.", "Арендовать виртуальные серверы и самому управлять ОС и ПО — это Infrastructure as a Service."),
        tfx("Moving from IaaS to SaaS, the customer manages more of the stack and gets more control.", false, "Moving up from IaaS to SaaS the provider takes over more layers, so the customer manages less and also controls less.", "При переходе от IaaS к SaaS провайдер забирает всё больше уровней, поэтому клиент меньше управляет и меньше контролирует.", "Choosing True reverses the stack: the most customer control is in IaaS (and on-premises), the least in SaaS.", "Ответ True переворачивает стек: больше всего контроля у клиента в IaaS (и on-premises), меньше всего — в SaaS."),
      ],
    ),
    part(
      "cc-l1-p3",
      { en: "History, virtualization and the business case", ru: "История, виртуализация и экономика облака" },
      {
        en: `## From mainframes to virtual machines
Cloud computing is an **evolution of technology over time**, not a sudden invention.
- **1950s — mainframes.** Large-scale mainframes with **high-volume processing power** became available. To use this expensive power efficiently, the practice of **time-sharing**, or **resource pooling**, evolved. Using **dumb terminals**, whose **sole purpose was to give access to the mainframe**, multiple users reached the **same data storage layer and CPU power** from any terminal.
- **1970s — the VM operating system.** With the release of an operating system called **Virtual Machine (VM)**, mainframes could have **multiple virtual systems, or virtual machines, on a single physical node**.
| Era | What appeared | Why it matters for the cloud |
|---|---|---|
| 1950s | mainframes, time-sharing, dumb terminals | first resource pooling: many users share one CPU and storage |
| 1970s | the Virtual Machine (VM) operating system | several virtual systems on one physical node |
| about 20 years ago | virtualized servers, hypervisors | shared hosting, VPS and virtual dedicated servers |
| then | pay-as-you-go public clouds | rent from a huge pool and pay per use |
## Virtual machines
**Virtual machines (VMs)** are **multiple distinct compute environments on the same physical hardware**. Each VM hosts a **guest operating system** that behaves **as though it had its own memory, CPU and hard drives**, even though these are **shared resources**.
## Virtualization — the catalyst
**Virtualization** became a technology driver and a **huge catalyst** for some of the biggest evolutions in communications and computing.
- Even 20 years ago physical hardware was **quite expensive**.
- As the internet became more accessible and hardware costs had to become viable, servers were virtualized into **shared hosting environments**, **virtual private servers (VPS)** and **virtual dedicated servers**.
- If a company needed x physical systems for its applications, it could take **one physical node and split it into multiple virtual systems**.
## The hypervisor
A **hypervisor** is a **small software layer** that enables **multiple operating systems to run alongside each other, sharing the same physical computing resources**.
- It **separates the VMs logically**, assigning each its **own slice** of the underlying computing power, memory and storage.
- This **isolation** prevents VMs from interfering with each other: if one OS **crashes or suffers a security compromise**, the others **keep working**.
- Examples: **Oracle VirtualBox**, **VMware ESX**, **Citrix XenServer**, **Microsoft Hyper-V**.
@diagram cc-hypervisor-types
| Type | Runs on | Examples | Typical use |
|---|---|---|---|
| Type 1 (bare-metal) | directly on the hardware | VMware ESX/ESXi, Citrix XenServer, Microsoft Hyper-V | data centers and clouds |
| Type 2 (hosted) | on top of a host OS | Oracle VirtualBox, VMware Workstation | a laptop for tests and labs |
## Cloud computing is born
As hypervisors improved and could share and deliver resources reliably, some companies made the cloud's benefits available to users **who did not have an abundance of physical servers**.
- The servers were **already online**, so **spinning up a new instance was instantaneous**.
- Users ordered the resources they needed **from a larger pool** and paid **on a per-use basis** — **Pay-As-You-Go**.
- This **pay-as-you-go**, or **utility computing**, model became **one of the key drivers** behind cloud computing taking off: companies and even individual developers pay for computing **like units of electricity**.
## From CapEx to OpEx
- **CapEx (Capital Expense)** — **high up-front costs**: buying buildings, servers and equipment before you know the real demand.
- **OpEx (Operating Expense)** — **no or low up-front costs**: pay-as-you-go, **as per usage**, a more **cash-flow friendly** model.
The switch appealed to **companies of all sizes** — those with little or no hardware and even those with lots of it. It also lets them **scale workloads during usage peaks and scale down when usage subsides**. This gave rise to modern-day cloud computing.
@diagram cc-capex-opex
| Aspect | CapEx | OpEx |
|---|---|---|
| Up-front cost | high | none or low |
| You pay for | owned hardware, used or idle | actual usage |
| Extra capacity when demand is low | paid for anyway | released and not paid |
| Example | building your own data center | renting cloud servers month by month |
## Key considerations for a cloud strategy
Every organization's transformation journey is **unique**, so its cloud adoption strategy is unique too. **Agility, flexibility and competitiveness** are the key drivers — provided the move causes no **business disruption** and no problems with **security, compliance or performance**.
| Consideration | The question to ask |
|---|---|
| Infrastructure and workloads | Building and running data centers can cost astronomical sums, while low initial cost and pay-as-you-go save a lot. But not every workload is ready for the cloud as-is. |
| SaaS and development platforms | Is paying for application access better than buying off-the-shelf software and paying for upgrades — leasing or buying? |
| Speed and productivity | A new app running in hours on the cloud versus weeks or months on traditional platforms; person-hour savings from cloud dashboards, real-time statistics and active analytics. |
| Risk exposure | What does a wrong decision cost? Buy hardware and software or rent by the hour? A 12-month plan to build and release, or try first with pay-as-you-go? |
## Benefits of cloud adoption
The benefits fall into three groups: **Flexibility, Efficiency and Strategic value**.
- **Flexibility** — scale services back or up to fit your needs; customize applications; access cloud services from anywhere; infrastructure scales on demand for fluctuating workloads; choose your level of control with as-a-service options; pick pre-built tools and features from a menu; **Virtual Private Clouds, encryption and API keys** help keep data secure.
- **Efficiency** — get applications to market quickly without worrying about infrastructure costs or maintenance; apps and data reachable from virtually any internet-connected device; **hardware failures do not result in data loss** because of **networked backups**; no cost of your own servers and equipment, payment on a use basis.
- **Strategic value** — a **competitive advantage**: the provider offers the most innovative technologies and manages the infrastructure, so the organization can **focus on its own priorities**.
## Challenges of cloud adoption
- **Data security** — loss or unavailability of data causing business disruption;
- **Governance and sovereignty** issues;
- **Legal, regulatory and compliance** issues;
- **Lack of standardization** in how constantly evolving technologies integrate and interoperate;
- choosing the **right deployment and service models** for specific needs;
- partnering with the **right cloud service providers**;
- concerns about **business continuity and disaster recovery**.
With the right adoption strategies, technologies, services and providers these risks can be **mitigated** — cloud adoption is no longer something to look at only in the future.
![Black-and-white photo of a 1950s mainframe computer room: rows of tall grey cabinets with reel-to-reel tape drives, and operators in shirts and ties working at a long control console](/events/cc/l1-1950s-mainframe-room.webp)
> Mainframe time-sharing → virtual machines → hypervisors → pay-as-you-go cloud: virtualization made the cloud possible, and the switch from CapEx to OpEx made it popular.
?? Which hypervisor from the lecture is a Type 2 (hosted) hypervisor, and why?
?= Oracle VirtualBox — it is installed on top of an ordinary host OS such as Windows or macOS; ESX, XenServer and Hyper-V run directly on the hardware.
?? A startup is unsure its app will find users. Why is OpEx safer than CapEx for it?
?= It pays only for what it uses, with no big up-front purchase; if the app fails, it simply releases the resources instead of owning idle servers.`,
        ru: `## От мейнфреймов к виртуальным машинам
Облачные вычисления — **результат эволюции технологий**, а не внезапное изобретение.
- **1950-е — мейнфреймы (mainframes).** Появились большие мейнфреймы с **высокой вычислительной мощностью**. Чтобы эффективно использовать эту дорогую мощность, возникла практика **разделения времени (time-sharing)**, или **объединения ресурсов (resource pooling)**. Через **«глупые» терминалы (dumb terminals)**, **единственной задачей которых был доступ к мейнфрейму**, многие пользователи работали с **одним и тем же уровнем хранения данных и одним CPU** с любого терминала.
- **1970-е — ОС VM.** С выходом операционной системы **Virtual Machine (VM)** на мейнфрейме стало возможно держать **несколько виртуальных систем, или виртуальных машин, на одном физическом узле**.
| Эпоха | Что появилось | Почему это важно для облака |
|---|---|---|
| 1950-е | мейнфреймы, time-sharing, dumb terminals | первый resource pooling: многие пользователи делят один CPU и хранилище |
| 1970-е | операционная система Virtual Machine (VM) | несколько виртуальных систем на одном физическом узле |
| около 20 лет назад | виртуализированные серверы, гипервизоры | shared hosting, VPS и virtual dedicated servers |
| затем | публичные облака с pay-as-you-go | аренда из огромного пула и оплата по использованию |
## Виртуальные машины
**Виртуальные машины (virtual machines, VMs)** — это **несколько отдельных вычислительных сред на одном и том же физическом оборудовании**. В каждой ВМ работает **гостевая ОС (guest OS)**, которая ведёт себя **так, будто у неё своя память, свой CPU и свои жёсткие диски**, хотя на деле это **общие ресурсы**.
## Виртуализация — катализатор
**Виртуализация (virtualization)** стала двигателем технологий и **огромным катализатором** крупнейших перемен в связи и вычислениях.
- Даже 20 лет назад физическое оборудование было **довольно дорогим**.
- Когда интернет стал доступнее, а затраты на железо нужно было окупать, серверы виртуализировали в **среды общего хостинга (shared hosting)**, **виртуальные частные серверы (VPS)** и **виртуальные выделенные серверы (virtual dedicated servers)**.
- Если компании нужно было x физических систем для приложений, она могла взять **один физический узел и разделить его на несколько виртуальных систем**.
## Гипервизор (hypervisor)
**Гипервизор** — это **небольшой программный слой**, который позволяет **нескольким операционным системам работать рядом, деля одни и те же физические ресурсы**.
- Он **логически разделяет ВМ**, выделяя каждой **свою долю** вычислительной мощности, памяти и хранилища.
- Такая **изоляция (isolation)** не даёт ВМ мешать друг другу: если одна ОС **падает или её взламывают**, остальные **продолжают работать**.
- Примеры: **Oracle VirtualBox**, **VMware ESX**, **Citrix XenServer**, **Microsoft Hyper-V**.
@diagram cc-hypervisor-types
| Тип | Где работает | Примеры | Типичное применение |
|---|---|---|---|
| Type 1 (bare-metal) | прямо на оборудовании | VMware ESX/ESXi, Citrix XenServer, Microsoft Hyper-V | дата-центры и облака |
| Type 2 (hosted) | поверх основной ОС (host OS) | Oracle VirtualBox, VMware Workstation | ноутбук для тестов и лабораторных |
## Рождение облачных вычислений
Когда гипервизоры стали надёжно делить и выдавать ресурсы, некоторые компании сделали преимущества облака доступными тем, **у кого не было множества собственных физических серверов**.
- Серверы **уже были онлайн**, поэтому **запуск нового экземпляра (instance) происходил мгновенно**.
- Пользователи заказывали нужные ресурсы **из большого общего пула** и платили **за фактическое использование** — **Pay-As-You-Go**.
- Модель **pay-as-you-go**, или **utility computing (вычисления как коммунальная услуга)**, стала **одним из главных двигателей** взлёта облака: компании и даже отдельные разработчики платят за вычисления **как за киловатты электричества**.
## От CapEx к OpEx
- **CapEx (Capital Expense, капитальные затраты)** — **большие затраты заранее**: купить здания, серверы и оборудование, ещё не зная реального спроса.
- **OpEx (Operating Expense, операционные затраты)** — **нет или почти нет затрат заранее**: pay-as-you-go, **по факту использования**, модель, **удобная для денежного потока (cash-flow friendly)**.
Переход привлёк **компании любого размера** — и тех, у кого почти нет оборудования, и тех, у кого его много. Он также позволяет **наращивать нагрузку в пики и уменьшать, когда спрос спадает**. Так и родились современные облачные вычисления.
@diagram cc-capex-opex
| Аспект | CapEx | OpEx |
|---|---|---|
| Затраты заранее | большие | нет или небольшие |
| За что платите | своё оборудование, работает оно или простаивает | фактическое использование |
| Лишняя мощность при низком спросе | оплачена всё равно | освобождается и не оплачивается |
| Пример | построить свой дата-центр | арендовать облачные серверы помесячно |
## Ключевые соображения для облачной стратегии
Путь трансформации каждой организации **уникален**, поэтому и стратегия перехода в облако у каждой своя. Главные двигатели — **agility, flexibility и competitiveness (гибкость, адаптивность и конкурентоспособность)**, при условии, что переход не вызывает **сбоев в бизнесе** и проблем с **безопасностью, соответствием требованиям (compliance) и производительностью**.
| Соображение | Какой вопрос задать |
|---|---|
| Infrastructure and workloads | Строить и содержать дата-центры может быть астрономически дорого, а низкие стартовые затраты и pay-as-you-go дают большую экономию. Но не каждая нагрузка готова к облаку как есть. |
| SaaS and development platforms | Выгоднее платить за доступ к приложению или купить готовое ПО и оплачивать обновления — аренда или покупка? |
| Speed and productivity | Новое приложение за часы в облаке против недель или месяцев на традиционных платформах; экономия человеко-часов благодаря облачным дашбордам, статистике в реальном времени и активной аналитике. |
| Risk exposure | Во что обойдётся неверное решение? Купить железо и ПО или арендовать по часам? План на 12 месяцев до релиза или сначала попробовать с pay-as-you-go? |
## Преимущества перехода в облако
Преимущества делятся на три группы: **Flexibility, Efficiency и Strategic value (гибкость, эффективность и стратегическая ценность)**.
- **Flexibility** — сокращать или наращивать сервисы под свои нужды; настраивать приложения; пользоваться облаком откуда угодно; инфраструктура масштабируется по запросу под меняющуюся нагрузку; самому выбирать уровень контроля через модели as-a-service; брать готовые инструменты и функции из меню; **Virtual Private Clouds, шифрование и API-ключи** помогают защищать данные.
- **Efficiency** — быстро выводить приложения на рынок, не думая о стоимости и обслуживании инфраструктуры; приложения и данные доступны практически с любого устройства с интернетом; **отказ оборудования не приводит к потере данных** благодаря **сетевым резервным копиям (networked backups)**; нет затрат на свои серверы и оборудование, оплата по использованию.
- **Strategic value** — **конкурентное преимущество**: провайдер даёт самые инновационные технологии и сам управляет инфраструктурой, а организация **сосредотачивается на своих приоритетах**.
## Трудности перехода в облако
- **Безопасность данных (data security)** — потеря или недоступность данных, из-за которой встаёт бизнес;
- вопросы **управления и суверенитета данных (governance and sovereignty)**;
- **юридические, регуляторные вопросы и соответствие требованиям (compliance)**;
- **отсутствие стандартизации (lack of standardization)** в том, как постоянно меняющиеся технологии интегрируются и взаимодействуют;
- выбор **подходящих моделей развёртывания и обслуживания** под конкретные задачи;
- выбор **подходящих облачных провайдеров** в партнёры;
- вопросы **непрерывности бизнеса и аварийного восстановления (business continuity and disaster recovery)**.
С правильной стратегией, технологиями, сервисами и провайдерами эти риски можно **снизить (mitigate)** — переход в облако больше не дело далёкого будущего.
![Чёрно-белая фотография машинного зала 1950-х с мейнфреймом: ряды высоких серых шкафов с катушечными ленточными накопителями и операторы в рубашках и галстуках за длинным пультом управления](/events/cc/l1-1950s-mainframe-room.webp)
> Time-sharing на мейнфреймах → виртуальные машины → гипервизоры → облако с pay-as-you-go: виртуализация сделала облако возможным, а переход от CapEx к OpEx — популярным.
?? Какой гипервизор из лекции относится к Type 2 (hosted) и почему?
?= Oracle VirtualBox — его ставят поверх обычной основной ОС, например Windows или macOS; ESX, XenServer и Hyper-V работают прямо на оборудовании.
?? Стартап не уверен, что его приложение найдёт пользователей. Почему OpEx для него безопаснее CapEx?
?= Он платит только за то, что использует, без большой покупки заранее; если приложение не взлетит, он просто освободит ресурсы, а не останется с простаивающими серверами.`,
      },
      [
        qx("In the 1950s, which practice evolved to use the expensive processing power of mainframes efficiently?", "Time-sharing, or resource pooling", [
          ["Pay-as-you-go cloud billing by the hour", "Pay-as-you-go billing arrived much later, with modern public clouds.", "Оплата pay-as-you-go появилась гораздо позже, вместе с современными публичными облаками."],
          ["Hypervisor-based server virtualization", "Hypervisors and server virtualization came decades later; in the 1950s users shared one mainframe directly.", "Гипервизоры и виртуализация серверов появились десятилетиями позже; в 1950-х пользователи делили мейнфрейм напрямую."],
          ["Containerization of applications", "Containers are a modern technology, unrelated to 1950s mainframes.", "Контейнеры — современная технология, не связанная с мейнфреймами 1950-х."],
        ], "To use mainframes efficiently, time-sharing (resource pooling) evolved: many users accessed the same storage and CPU via terminals.", "Чтобы эффективно использовать мейнфреймы, возникло разделение времени (resource pooling): многие пользователи работали с одним хранилищем и CPU через терминалы."),
        qx("What was the sole purpose of a dumb terminal?", "To give users access to the mainframe", [
          ["To run applications on its own CPU", "A dumb terminal had no processing role; all computing happened on the shared mainframe CPU.", "У «глупого» терминала не было вычислительной роли; всё считалось на общем CPU мейнфрейма."],
          ["To store users' data on local disks", "Users shared the mainframe's data storage layer, not local disks in the terminals.", "Пользователи делили уровень хранения мейнфрейма, а не локальные диски терминалов."],
          ["To act as a hypervisor for virtual machines", "Hypervisors are software layers on servers; terminals only provided access.", "Гипервизор — программный слой на сервере; терминалы лишь давали доступ."],
        ], "Dumb terminals existed only to facilitate access to the mainframes; the processing and storage were shared.", "«Глупые» терминалы существовали только для доступа к мейнфреймам; обработка и хранение были общими."),
        qx("What became possible in the 1970s with the release of the Virtual Machine (VM) operating system?", "Multiple virtual machines on one physical node", [
          ["Access to mainframes from dumb terminals", "Terminal access to mainframes already existed in the 1950s.", "Доступ к мейнфреймам с терминалов был уже в 1950-х."],
          ["Renting servers over the public internet by the hour", "Hourly rental over the internet is modern cloud computing, not the 1970s.", "Почасовая аренда через интернет — это современное облако, а не 1970-е."],
          ["Running mobile apps on mainframe hardware", "Mobile apps did not exist in the 1970s; the VM OS was about multiple virtual systems.", "Мобильных приложений в 1970-х не было; ОС VM — про несколько виртуальных систем."],
        ], "The VM operating system let mainframes have multiple virtual systems, or virtual machines, on a single physical node.", "ОС VM позволила мейнфреймам держать несколько виртуальных систем, или виртуальных машин, на одном физическом узле."),
        qx("How does the guest operating system inside each virtual machine behave?", "As if it had its own memory, CPU and hard drives", [
          ["As if it shared one kernel with the other VMs", "Sharing one kernel describes containers; each VM runs its own full guest OS.", "Общее ядро — это про контейнеры; в каждой ВМ своя полноценная гостевая ОС."],
          ["As if it were a dumb terminal of the mainframe", "A dumb terminal only gives access; a guest OS acts like a complete computer.", "Терминал только даёт доступ; гостевая ОС ведёт себя как полноценный компьютер."],
          ["As if it owned the hypervisor and all the hardware", "The hypervisor controls the hardware and gives each VM only its own slice.", "Оборудованием управляет гипервизор, выдавая каждой ВМ лишь её долю."],
        ], "Each VM hosted a guest OS that behaved as though it had its own memory, CPU and hard drives, though these were shared.", "В каждой ВМ работала гостевая ОС, которая вела себя так, будто у неё своя память, CPU и диски, хотя они были общими."),
        qx("What is a hypervisor?", "A small software layer that lets several OSes share hardware", [
          ["A special CPU chip that speeds up virtual machines on servers", "A hypervisor is software, not a hardware chip, even if CPUs can help it.", "Гипервизор — программа, а не микросхема, хотя процессоры и могут ему помогать."],
          ["A physical server that hosts the provider's website", "A hypervisor runs on servers, but it is not itself a physical server.", "Гипервизор работает на серверах, но сам не является физическим сервером."],
          ["An operating system that can run only one application", "A hypervisor exists to run many operating systems side by side, not one app.", "Гипервизор нужен, чтобы запускать рядом много ОС, а не одно приложение."],
        ], "A hypervisor is a small software layer that enables multiple operating systems to run alongside each other on shared physical resources.", "Гипервизор — небольшой программный слой, позволяющий нескольким ОС работать рядом на общих физических ресурсах."),
        qx("One VM on a host crashes after a security compromise. Thanks to the hypervisor, what happens to the other VMs?", "They keep working because they are isolated", [
          ["They are restarted together with the whole physical host", "The hypervisor isolates VMs, so a crash in one does not force the host and others to restart.", "Гипервизор изолирует ВМ, поэтому падение одной не требует перезапуска хоста и остальных."],
          ["They crash too because they share the CPU", "Sharing hardware does not mean sharing failures; each VM has its own logical slice.", "Общее оборудование не означает общих сбоев; у каждой ВМ своя логическая доля."],
          ["They take over the crashed VM's memory", "The hypervisor assigns resources; VMs cannot just grab another VM's memory.", "Ресурсы распределяет гипервизор; ВМ не могут просто забрать память другой ВМ."],
        ], "The hypervisor separates VMs logically, so if one OS crashes or is compromised, the others keep working.", "Гипервизор логически разделяет ВМ, поэтому если одна ОС падает или её взломали, остальные продолжают работать."),
        qx("Which of these is NOT one of the hypervisor examples given in the lecture?", "Kubernetes", [
          ["Oracle VirtualBox", "Oracle VirtualBox is listed in the lecture as a hypervisor example.", "Oracle VirtualBox приведён в лекции как пример гипервизора."],
          ["VMware ESX", "VMware ESX is listed in the lecture as a hypervisor example.", "VMware ESX приведён в лекции как пример гипервизора."],
          ["Microsoft Hyper-V", "Microsoft Hyper-V is listed in the lecture as a hypervisor example.", "Microsoft Hyper-V приведён в лекции как пример гипервизора."],
        ], "Kubernetes orchestrates containers; the hypervisor examples are VirtualBox, VMware ESX, Citrix XenServer and Hyper-V.", "Kubernetes управляет контейнерами; примеры гипервизоров — VirtualBox, VMware ESX, Citrix XenServer и Hyper-V."),
        qx("Which hypervisor from the lecture is a Type 2 (hosted) hypervisor that runs on top of a host OS?", "Oracle VirtualBox", [
          ["VMware ESX", "VMware ESX is a Type 1 bare-metal hypervisor installed directly on the server hardware.", "VMware ESX — гипервизор Type 1 (bare-metal), его ставят прямо на оборудование сервера."],
          ["Citrix XenServer", "Citrix XenServer is a Type 1 hypervisor running directly on the hardware.", "Citrix XenServer — гипервизор Type 1, работающий прямо на оборудовании."],
          ["Microsoft Hyper-V", "Hyper-V is classed as Type 1: it runs directly on the hardware beneath Windows.", "Hyper-V относят к Type 1: он работает прямо на оборудовании, под Windows."],
        ], "Oracle VirtualBox is installed as an application on Windows, macOS or Linux, which makes it a Type 2 (hosted) hypervisor.", "Oracle VirtualBox ставится как приложение в Windows, macOS или Linux — поэтому это гипервизор Type 2 (hosted)."),
        qx("Where does a Type 1 (bare-metal) hypervisor run?", "Directly on the physical hardware", [
          ["On top of a desktop operating system", "Running on top of a host OS is what defines a Type 2 (hosted) hypervisor.", "Работа поверх основной ОС — признак гипервизора Type 2 (hosted)."],
          ["Inside a guest virtual machine", "Guest VMs run on top of the hypervisor, not the other way round.", "Гостевые ВМ работают поверх гипервизора, а не наоборот."],
          ["Inside the user's web browser", "A browser is just an application; a hypervisor sits much lower, next to the hardware.", "Браузер — всего лишь приложение; гипервизор находится гораздо ниже, у самого оборудования."],
        ], "A Type 1 hypervisor runs directly on the hardware with no host OS underneath, which is why clouds use it.", "Гипервизор Type 1 работает прямо на оборудовании, без основной ОС под ним, — поэтому его используют облака."),
        qx("Which three hosting forms appeared when servers were virtualized?", "Shared hosting, virtual private and virtual dedicated servers", [
          ["Bare-metal, colocation and on-premises enterprise data centers", "These involve physical, non-virtualized hardware, the opposite of what virtualization produced.", "Это физическое, невиртуализированное оборудование — противоположность того, что дала виртуализация."],
          ["Public, private and hybrid cloud deployment models", "These are cloud deployment models, not the early forms of virtualized hosting.", "Это модели развёртывания облака, а не ранние формы виртуализированного хостинга."],
          ["IaaS, PaaS and SaaS cloud service models", "These are later cloud service models, not the hosting forms named in the history slide.", "Это более поздние модели обслуживания облака, а не формы хостинга со слайда об истории."],
        ], "Servers were virtualized into shared hosting environments, virtual private servers and virtual dedicated servers.", "Серверы виртуализировали в среды общего хостинга, виртуальные частные серверы и виртуальные выделенные серверы."),
        tfx("Strategic value means the provider manages the infrastructure and offers innovative technology, so the organization can focus on its priorities.", true, "Strategic value is the competitive advantage of getting the most innovative technologies while the provider manages the underlying infrastructure.", "Стратегическая ценность — конкурентное преимущество: самые инновационные технологии, а инфраструктурой управляет провайдер.", "Choosing False would deny the third benefit group; strategic value is exactly this competitive advantage.", "Ответ False отрицал бы третью группу преимуществ; стратегическая ценность — именно такое конкурентное преимущество."),
        qx("The pay-as-you-go model is also called what, because you pay for computing like units of electricity?", "Utility computing", [
          ["Grid computing", "Grid computing links many computers to solve one large task; it is not a billing model.", "Grid computing объединяет много компьютеров для одной большой задачи; это не модель оплаты."],
          ["Edge computing", "Edge computing processes data close to where it is produced; it is not about paying per use.", "Edge computing обрабатывает данные рядом с местом их появления; это не про оплату по использованию."],
          ["Mainframe computing", "Mainframes were bought or time-shared inside one organization, not billed like electricity.", "Мейнфреймы покупали или делили внутри одной организации, а не оплачивали как электричество."],
        ], "The pay-as-you-go, or utility computing, model lets users pay for computing resources as they use them, like units of electricity.", "Модель pay-as-you-go, или utility computing, позволяет платить за ресурсы по мере использования, как за электричество."),
        qx("Moving to the cloud shifts an organization's IT spending from which model to which?", "From CapEx to OpEx", [
          ["From OpEx to CapEx", "This is reversed: the cloud removes big up-front purchases, so spending moves to OpEx.", "Здесь наоборот: облако убирает большие закупки заранее, поэтому траты уходят в OpEx."],
          ["From IaaS to SaaS", "IaaS and SaaS are service models, not types of spending.", "IaaS и SaaS — модели обслуживания, а не виды затрат."],
          ["From private to public", "Private and public are deployment models, not accounting models of spending.", "Private и public — модели развёртывания, а не модели учёта затрат."],
        ], "Pay-as-you-go let organizations switch from a CapEx model to a more cash-flow friendly OpEx model.", "Pay-as-you-go позволил организациям перейти от CapEx к более удобной для денежного потока модели OpEx."),
        qx("Which statement describes CapEx (Capital Expense)?", "High up-front costs for owned hardware", [
          ["No up-front cost, payment as per usage", "That describes OpEx, the pay-as-you-go model.", "Это описание OpEx — модели pay-as-you-go."],
          ["Monthly fees only for resources used", "Paying monthly only for what you use is the operating expense model.", "Ежемесячная плата только за использованное — это модель операционных затрат."],
          ["A discount for reserving cloud resources", "Reservation discounts are a cloud pricing option, still an operating expense.", "Скидки за резервирование — вариант облачных цен, это всё ещё операционные затраты."],
        ], "CapEx means high up-front costs: buying buildings, servers and equipment before using them.", "CapEx — это большие затраты заранее: покупка зданий, серверов и оборудования до начала их использования."),
        qx("A startup is unsure its app will find users. What is the main advantage of OpEx for it?", "No big up-front purchase; pay only for actual use", [
          ["It owns the servers and can resell them later", "Owning servers is CapEx; with OpEx the startup owns nothing and simply stops paying.", "Владение серверами — это CapEx; при OpEx стартап ничем не владеет и просто перестаёт платить."],
          ["Its cloud bill stays exactly the same every month", "OpEx bills follow usage, so they change with demand rather than stay fixed.", "Счета OpEx идут по использованию, поэтому меняются вслед за спросом, а не стоят на месте."],
          ["It gets free hardware upgrades for five years", "No such promise exists; the benefit is low up-front cost and paying per use.", "Такого обещания нет; выгода — низкие затраты заранее и оплата по использованию."],
        ], "OpEx has no or low up-front costs and charges per usage, which lowers the risk exposure of an uncertain project.", "У OpEx нет или почти нет затрат заранее и оплата по использованию — это снижает риск неопределённого проекта."),
        qx("According to the lecture, which are the key drivers for moving to the cloud?", "Agility, flexibility and competitiveness", [
          ["Lower salaries, fewer staff and less training", "Staff cuts are not named as drivers; the lecture names agility, flexibility and competitiveness.", "Сокращение персонала драйвером не названо; в лекции это agility, flexibility и competitiveness."],
          ["Ownership, depreciation and tax write-offs", "These are features of owning hardware (CapEx), which the cloud moves away from.", "Это черты владения оборудованием (CapEx), от которого облако как раз уходит."],
          ["Isolation, single tenancy and fixed capacity", "Single tenancy and fixed capacity contradict the cloud's pooling and elasticity.", "Single tenancy и фиксированная мощность противоречат пулу ресурсов и эластичности облака."],
        ], "Agility, flexibility and competitiveness are the key drivers, provided the move causes no disruption or security, compliance and performance issues.", "Главные двигатели — гибкость, адаптивность и конкурентоспособность, если переход не вызывает сбоев и проблем с безопасностью, compliance и производительностью."),
        qx("Which key consideration asks whether to pay for application access or buy off-the-shelf software and upgrades?", "SaaS and development platforms", [
          ["Infrastructure and workloads", "This consideration is about data center costs and whether workloads are cloud-ready, not about buying software.", "Это соображение — о стоимости дата-центров и готовности нагрузок к облаку, а не о покупке ПО."],
          ["Risk exposure", "Risk exposure is about the cost of a wrong decision in general, not the lease-or-buy choice for apps.", "Risk exposure — о цене неверного решения вообще, а не о выборе «аренда или покупка» для приложений."],
          ["Governance and data sovereignty", "Governance and sovereignty is listed as a challenge of adoption, not one of the four considerations.", "Governance and sovereignty — это трудность перехода, а не одно из четырёх соображений."],
        ], "SaaS and development platforms: is paying for application access more viable than buying software and investing in upgrades?", "SaaS and development platforms: выгоднее платить за доступ к приложению, чем покупать ПО и вкладываться в обновления?"),
        qx("A team weighs a 12-month build plan against trying a service with pay-as-you-go first. Which consideration is that?", "Risk exposure", [
          ["Speed and productivity", "Speed and productivity compares hours versus months to launch, not the cost of a wrong decision.", "Speed and productivity сравнивает часы и месяцы до запуска, а не цену неверного решения."],
          ["Infrastructure and workloads", "This one weighs data center costs and workload readiness, not the risk of a long commitment.", "Здесь взвешивают стоимость дата-центров и готовность нагрузок, а не риск долгих обязательств."],
          ["Business continuity planning", "Business continuity is listed among the challenges, not among the four considerations.", "Непрерывность бизнеса указана среди трудностей, а не среди четырёх соображений."],
        ], "Risk exposure asks what a wrong decision costs: buy or rent, a 12-month plan or a pay-as-you-go trial.", "Risk exposure спрашивает, во что обойдётся ошибка: купить или арендовать, план на 12 месяцев или пробный запуск с pay-as-you-go."),
        qx("Which of these belongs to the Efficiency benefit of cloud adoption?", "Hardware failures do not cause data loss", [
          ["Choosing your level of control as a service", "Choosing your level of control is listed under Flexibility.", "Выбор уровня контроля относится к Flexibility."],
          ["Customizing applications to specific needs", "Customizing applications is listed under Flexibility.", "Настройка приложений относится к Flexibility."],
          ["Lack of standardization between providers", "Lack of standardization is a challenge of cloud adoption, not a benefit.", "Отсутствие стандартизации — трудность перехода в облако, а не преимущество."],
        ], "Efficiency includes: quick time to market, access from any device, no data loss thanks to networked backups, no own server costs.", "К Efficiency относятся: быстрый выход на рынок, доступ с любого устройства, отсутствие потерь данных благодаря сетевым копиям, нет затрат на свои серверы."),
        qx("Which of these is listed as a challenge of cloud adoption?", "Governance and sovereignty issues", [
          ["Networked backups of all data", "Networked backups are an Efficiency benefit: hardware failures do not cause data loss.", "Сетевые резервные копии — преимущество Efficiency: отказ оборудования не ведёт к потере данных."],
          ["Access to services from anywhere", "Access from anywhere is a Flexibility benefit.", "Доступ откуда угодно — преимущество Flexibility."],
          ["Lower up-front infrastructure cost", "Low up-front cost is a reason to adopt the cloud, not a challenge.", "Низкие стартовые затраты — причина перейти в облако, а не трудность."],
        ], "Challenges: data security, governance and sovereignty, legal and compliance, lack of standardization, choosing models and providers, continuity and DR.", "Трудности: безопасность данных, governance и суверенитет, право и compliance, нет стандартизации, выбор моделей и провайдеров, непрерывность и восстановление."),
      ],
    ),
    part(
      "cc-l1-p4",
      { en: "Cloud providers, market and careers", ru: "Облачные провайдеры, рынок и карьера" },
      {
        en: `## Cloud in education and everyday life
You already use the cloud every day — mostly as **SaaS**:
- **Microsoft Office 365** — Word, Excel, PowerPoint, OneNote, Outlook, SharePoint, OneDrive, Yammer, Teams, Skype.
- **G Suite for Education** (today Google Workspace) — Google Drive, Classroom, Gmail, Calendar, Docs, Sheets, Slides, Forms.
Your files live in the provider's data centers, so the same document opens from any device.
## How fast the market grows
Gartner's predictions for 2018 → 2022:
| Segment | 2018 | 2022 | Growth |
|---|---|---|---|
| Public cloud services, total | $182.4B | $331.2B | CAGR 12.6% |
| IaaS | $30.5B | $76.6B | 27.5% a year |
| PaaS | $15.6B | $31.8B | 21.8% a year |
| SaaS | $80B | $143.7B | about 22% a year |
- **SaaS is the largest segment** in money; **IaaS grows fastest**.
- Software investment is shifting from **cloud-first to cloud-only**.
- Cloud is accelerating faster than predicted: the question for businesses is no longer **"if"** they adopt the cloud, but **"what"** their cloud adoption strategy should be.
## Key cloud service providers
The lecture walks through the major providers in alphabetical order; the providers slide also shows **Oracle Cloud** and **SAP**.
- **Alibaba Cloud (Aliyun)** — relatively new, but the **largest Chinese cloud computing provider**. It powers its customers' online businesses and the **Alibaba Group's own e-commerce ecosystem**. Services: compute, network, storage, security, monitoring and managing, communication, analytics, IoT, application development, data migration, web hosting.
- **Amazon Web Services (AWS)** — **one of the first** to enter the cloud computing space. An extensive range of **infrastructure and platform services** for individuals, companies and governments on a **metered pay-as-you-go** basis: compute, DevOps, data, analytics, IoT, machine learning, networking, content delivery, robotics, **serverless** computing.
- **Google Cloud Platform (GCP)** — infrastructure, platform and **serverless** environments. Google uses GCP **internally** for its own products such as **Google Search and YouTube**. Google Cloud includes **G Suite**. **Google App Engine** is a platform for developing and hosting web apps in Google-managed data centers that **automatically allocates and de-allocates resources** to handle demand.
- **IBM Cloud** — a **full-stack** platform spanning **public, private and hybrid** environments: compute, network, storage, management, security, DevOps, databases. Prominent offerings: **Bare Metal Servers**, **VMware** hosting, **Cloud Paks** for application modernization, **Virtual Private Cloud**, and emerging technologies — **AI (Watson)**, IoT, **Blockchain**, data and analytics. With the **acquisition of Red Hat**, IBM positions itself as **the leading hybrid cloud provider**.
- **Microsoft Azure** — a flexible platform for **building, testing, deploying and managing** applications and services through **Microsoft-managed data centers**. Data centers in **many regions** give a **global reach with a local presence**. It offers **SaaS, PaaS and IaaS** and supports both Microsoft-specific and **third-party** languages, tools and frameworks.
- **Salesforce** — **Sales Cloud** (real-time analytics), **Service Cloud** (customer success and support) and **Marketing Cloud** (social platforms): it tracks customer complaints and even listens to customers across social media to route them to the right agent.
- **SAP** — **enterprise software** such as **ERP, CRM, HR and Finance** running in the cloud, plus the **SAP Cloud Platform** for building and extending business applications in a secure environment managed by SAP.
| Provider | Compute | Storage and databases | Other services shown on the slides |
|---|---|---|---|
| AWS | EC2, Lambda | Glacier, Storage Gateway, DynamoDB, RDS, Redshift | CloudFront, VPC, Route 53, IAM, CloudWatch, CloudFormation |
| Google Cloud | Compute Engine, Kubernetes Engine, App Engine | Cloud Storage, Cloud SQL, Spanner, Bigtable | BigQuery, Pub/Sub, Cloud Functions, TensorFlow, Cloud TPU |
| Microsoft Azure | Virtual Machines, Containers | Blob, Files, Disks, SQL Database | Virtual Network, Load Balancer, Active Directory, Key Vault |
| IBM Cloud | Bare Metal Servers, VMware hosting | storage, databases | Watson AI, Blockchain, Cloud Paks, VPC |
| Alibaba Cloud | compute | storage | IoT, analytics, communication, web hosting |
## Gartner Magic Quadrant and market share
**Gartner's Magic Quadrant** (June 2022) compares providers of **cloud infrastructure and platform services (CIPS)**: **standardized, highly automated offerings** in which **infrastructure resources (compute, networking, storage)** are complemented by **integrated platform services**. Its scope covers **IaaS and integrated PaaS**.
- A Magic Quadrant places vendors on two axes — **ability to execute** and **completeness of vision** — which gives four squares: **Leaders, Challengers, Visionaries, Niche Players**.
- **AWS, Microsoft and Google** are placed in the **Leaders** square.
- In the **worldwide market share** of cloud infrastructure services (Statista chart), **AWS is first** with about a third of the market, followed by **Microsoft Azure** and **Google Cloud**; Alibaba Cloud and IBM have much smaller shares.
## Careers in cloud computing
**Gartner TalentNeuron**, a database of **more than one billion** unique job listings, scores the hiring scale for cloud computing skills at **78**: employers find it **"difficult"** to get the right applicants.
| Job role | What the person does |
|---|---|
| Cloud Developer | builds applications that run on cloud services |
| Cloud Integration Specialist | connects cloud services with existing systems |
| Cloud Data Engineer | builds data pipelines and data storage in the cloud |
| Cloud Security Engineer | protects cloud data, identities and networks |
| Cloud DevOps Engineer | automates building, testing and deployment |
| Cloud Solutions Architect | designs the overall cloud solution |
Critical skills for success (Coursera): familiarity with **AWS, Azure and Google Cloud**; knowledge of **operating systems and computer networking**; experience with **data security frameworks**; knowledge of **DevOps and microservices** technologies such as **Kubernetes**.
## Certifications
AWS certifications come in four levels:
- **Foundational** — **Cloud Practitioner**; about **six months** of fundamental AWS Cloud and industry knowledge.
- **Associate** — **Solutions Architect, SysOps Administrator, Developer**; about **one year** of experience.
- **Professional** — **Solutions Architect Professional, DevOps Engineer Professional**; about **two years** of experience.
- **Specialty** — Advanced Networking, Security, Machine Learning, Alexa Skill Builder, Data Analytics, Database.
Cloud certifications are among the **top-paying IT certifications**: in the 2021 list Google's Professional Data Engineer and Professional Cloud Architect came first, and in the 2022 list **AWS Certified Solutions Architect – Professional** was on top (about $168,000 a year).
![Aerial photo of a hyperscale cloud data center campus: several huge windowless grey buildings with rows of cooling units on the roofs, power substations and a parking lot at the edge of a forest](/events/cc/l1-hyperscale-data-center.webp)
> AWS was one of the first and holds the largest share; Azure runs on Microsoft-managed data centers in many regions; GCP also runs Search and YouTube; IBM bets on hybrid with Red Hat; Alibaba Cloud is the largest in China.
?? Which provider positions itself as the leading hybrid cloud provider after acquiring Red Hat?
?= IBM Cloud.
?? In Gartner's predictions, which segment grows fastest and which one is the largest?
?= IaaS grows fastest (27.5% a year); SaaS is the largest ($80B in 2018 → $143.7B in 2022).`,
        ru: `## Облако в учёбе и повседневной жизни
Вы и так каждый день пользуетесь облаком — в основном как **SaaS**:
- **Microsoft Office 365** — Word, Excel, PowerPoint, OneNote, Outlook, SharePoint, OneDrive, Yammer, Teams, Skype.
- **G Suite for Education** (сейчас Google Workspace) — Google Drive, Classroom, Gmail, Calendar, Docs, Sheets, Slides, Forms.
Ваши файлы хранятся в дата-центрах провайдера, поэтому один и тот же документ открывается с любого устройства.
## Как быстро растёт рынок
Прогнозы Gartner на 2018 → 2022:
| Сегмент | 2018 | 2022 | Рост |
|---|---|---|---|
| Публичные облачные сервисы, всего | $182.4B | $331.2B | CAGR 12.6% |
| IaaS | $30.5B | $76.6B | 27.5% в год |
| PaaS | $15.6B | $31.8B | 21.8% в год |
| SaaS | $80B | $143.7B | около 22% в год |
- **SaaS — самый крупный сегмент** по деньгам; **быстрее всех растёт IaaS**.
- Инвестиции в ПО смещаются от **cloud-first к cloud-only** (от «сначала облако» к «только облако»).
- Облако растёт быстрее прогнозов: вопрос для бизнеса уже не **«if»** (переходить ли), а **«what»** — какой должна быть стратегия перехода.
## Ключевые облачные провайдеры
Лекция разбирает крупных провайдеров по алфавиту; на слайде с провайдерами есть ещё **Oracle Cloud** и **SAP**.
- **Alibaba Cloud (Aliyun)** — относительно молодой, но **крупнейший китайский облачный провайдер**. Обслуживает онлайн-бизнес клиентов и **собственную экосистему электронной коммерции Alibaba Group**. Сервисы: вычисления, сеть, хранилище, безопасность, мониторинг и управление, связь, аналитика, IoT, разработка приложений, миграция данных, веб-хостинг.
- **Amazon Web Services (AWS)** — **одним из первых** вышел на рынок облачных вычислений. Огромный набор **инфраструктурных и платформенных сервисов** для частных лиц, компаний и государств с **оплатой по счётчику (metered pay-as-you-go)**: вычисления, DevOps, данные, аналитика, IoT, машинное обучение, сети, доставка контента, робототехника, **serverless** (бессерверные вычисления).
- **Google Cloud Platform (GCP)** — инфраструктура, платформа и **serverless**-среды. Google **сам использует** GCP для своих продуктов — **Google Search и YouTube**. В Google Cloud входит **G Suite**. **Google App Engine** — платформа для разработки и размещения веб-приложений в дата-центрах Google, которая **автоматически выделяет и освобождает ресурсы** под нагрузку.
- **IBM Cloud** — **full-stack** платформа для **публичных, частных и гибридных** сред: вычисления, сеть, хранилище, управление, безопасность, DevOps, базы данных. Заметные предложения: **Bare Metal Servers**, хостинг **VMware**, **Cloud Paks** для модернизации приложений, **Virtual Private Cloud** и новые технологии — **ИИ (Watson)**, IoT, **блокчейн**, данные и аналитика. После **покупки Red Hat** IBM позиционирует себя как **ведущего провайдера гибридного облака**.
- **Microsoft Azure** — гибкая платформа, чтобы **создавать, тестировать, разворачивать и управлять** приложениями и сервисами в **дата-центрах под управлением Microsoft**. Дата-центры во **многих регионах** дают **глобальный охват при локальном присутствии (global reach with a local presence)**. Предлагает **SaaS, PaaS и IaaS** и поддерживает как языки, инструменты и фреймворки Microsoft, так и **сторонние**.
- **Salesforce** — **Sales Cloud** (аналитика в реальном времени), **Service Cloud** (успех и поддержка клиентов) и **Marketing Cloud** (социальные платформы): отслеживает жалобы клиентов и даже «слушает» их в соцсетях, чтобы направить к нужному сотруднику.
- **SAP** — **корпоративное ПО**: **ERP, CRM, HR и финансы** в облаке, а также **SAP Cloud Platform** для создания и расширения бизнес-приложений в защищённой среде под управлением SAP.
| Провайдер | Вычисления | Хранилище и базы данных | Другие сервисы со слайдов |
|---|---|---|---|
| AWS | EC2, Lambda | Glacier, Storage Gateway, DynamoDB, RDS, Redshift | CloudFront, VPC, Route 53, IAM, CloudWatch, CloudFormation |
| Google Cloud | Compute Engine, Kubernetes Engine, App Engine | Cloud Storage, Cloud SQL, Spanner, Bigtable | BigQuery, Pub/Sub, Cloud Functions, TensorFlow, Cloud TPU |
| Microsoft Azure | Virtual Machines, Containers | Blob, Files, Disks, SQL Database | Virtual Network, Load Balancer, Active Directory, Key Vault |
| IBM Cloud | Bare Metal Servers, хостинг VMware | хранилище, базы данных | Watson AI, Blockchain, Cloud Paks, VPC |
| Alibaba Cloud | вычисления | хранилище | IoT, аналитика, связь, веб-хостинг |
## Магический квадрант Gartner и доли рынка
**Magic Quadrant от Gartner** (июнь 2022) сравнивает провайдеров **облачной инфраструктуры и платформенных сервисов (CIPS)**: это **стандартизированные, высоко автоматизированные предложения**, в которых **инфраструктурные ресурсы (вычисления, сеть, хранилище)** дополнены **интегрированными платформенными сервисами**. В охват входят **IaaS и интегрированный PaaS**.
- Magic Quadrant располагает поставщиков по двум осям — **ability to execute (способность реализовать)** и **completeness of vision (полнота видения)**, — получается четыре квадрата: **Leaders, Challengers, Visionaries, Niche Players**.
- **AWS, Microsoft и Google** находятся в квадрате **Leaders**.
- По **мировой доле рынка** облачной инфраструктуры (диаграмма Statista) **первое место у AWS** — около трети рынка, дальше **Microsoft Azure** и **Google Cloud**; у Alibaba Cloud и IBM доли намного меньше.
## Карьера в облачных вычислениях
**Gartner TalentNeuron** — база из **более чем миллиарда** уникальных вакансий — оценивает сложность найма на облачные навыки в **78** баллов: работодателям **«трудно» (difficult)** найти подходящих кандидатов.
| Должность | Чем занимается |
|---|---|
| Cloud Developer | создаёт приложения, работающие на облачных сервисах |
| Cloud Integration Specialist | связывает облачные сервисы с существующими системами |
| Cloud Data Engineer | строит конвейеры и хранилища данных в облаке |
| Cloud Security Engineer | защищает облачные данные, учётные записи и сети |
| Cloud DevOps Engineer | автоматизирует сборку, тестирование и развёртывание |
| Cloud Solutions Architect | проектирует облачное решение целиком |
Ключевые навыки для успеха (Coursera): знакомство с **AWS, Azure и Google Cloud**; знание **операционных систем и компьютерных сетей**; опыт с **фреймворками защиты данных**; знание **DevOps и микросервисов**, например **Kubernetes**.
## Сертификаты
Сертификаты AWS бывают четырёх уровней:
- **Foundational** — **Cloud Practitioner**; около **шести месяцев** базовых знаний AWS Cloud и отрасли.
- **Associate** — **Solutions Architect, SysOps Administrator, Developer**; около **года** опыта.
- **Professional** — **Solutions Architect Professional, DevOps Engineer Professional**; около **двух лет** опыта.
- **Specialty** — Advanced Networking, Security, Machine Learning, Alexa Skill Builder, Data Analytics, Database.
Облачные сертификаты — среди **самых высокооплачиваемых в ИТ**: в списке 2021 года первыми были Professional Data Engineer и Professional Cloud Architect от Google, а в списке 2022 года лидировал **AWS Certified Solutions Architect – Professional** (около $168 000 в год).
![Аэрофотография кампуса гипермасштабного облачного дата-центра: несколько огромных серых зданий без окон с рядами охладителей на крышах, электроподстанции и парковка на краю леса](/events/cc/l1-hyperscale-data-center.webp)
> AWS — один из первых и с самой большой долей; Azure работает в дата-центрах Microsoft во многих регионах; на GCP работают Search и YouTube; IBM делает ставку на гибрид с Red Hat; Alibaba Cloud — крупнейший в Китае.
?? Какой провайдер после покупки Red Hat позиционирует себя как ведущего провайдера гибридного облака?
?= IBM Cloud.
?? Какой сегмент в прогнозах Gartner растёт быстрее всех, а какой самый крупный?
?= Быстрее всех растёт IaaS (27.5% в год); самый крупный — SaaS ($80B в 2018 → $143.7B в 2022).`,
      },
      [
        qx("Office 365 and G Suite for Education are examples of which cloud service model?", "SaaS", [
          ["IaaS", "Students and teachers do not rent servers or manage an OS; they use finished apps.", "Студенты и преподаватели не арендуют серверы и не управляют ОС; они пользуются готовыми приложениями."],
          ["PaaS", "These are finished applications for end users, not a platform for building apps.", "Это готовые приложения для пользователей, а не платформа для создания приложений."],
          ["Private cloud", "Private cloud is a deployment model; these suites are public SaaS offerings.", "Private cloud — модель развёртывания; эти пакеты — публичные SaaS-сервисы."],
        ], "Office 365 and G Suite are centrally hosted applications licensed by subscription — Software as a Service.", "Office 365 и G Suite — централизованно размещённые приложения по подписке, то есть Software as a Service."),
        qx("Which provider is the largest Chinese cloud computing service provider?", "Alibaba Cloud (Aliyun)", [
          ["Google Cloud Platform (GCP)", "GCP is an American provider from Google, not the largest Chinese one.", "GCP — американский провайдер Google, а не крупнейший китайский."],
          ["IBM Cloud", "IBM Cloud is an American provider known for hybrid cloud and Red Hat.", "IBM Cloud — американский провайдер, известный гибридным облаком и Red Hat."],
          ["Oracle Cloud", "Oracle Cloud is an American provider; it is not described as China's largest.", "Oracle Cloud — американский провайдер; крупнейшим в Китае его не называют."],
        ], "Alibaba Cloud, also known as Aliyun, is relatively new but the largest Chinese cloud provider, also powering Alibaba Group's e-commerce.", "Alibaba Cloud, он же Aliyun, относительно молод, но это крупнейший китайский облачный провайдер, обслуживающий и электронную коммерцию Alibaba Group."),
        qx("Which provider was one of the first to enter the cloud space and sells services on a metered pay-as-you-go basis?", "Amazon Web Services", [
          ["Alibaba Cloud", "The lecture calls Alibaba Cloud relatively new, not one of the first.", "Лекция называет Alibaba Cloud относительно молодым, а не одним из первых."],
          ["Google Cloud Platform", "GCP is a major provider, but the lecture names AWS as one of the first entrants.", "GCP — крупный провайдер, но одним из первых в лекции назван AWS."],
          ["Salesforce", "Salesforce is known for SaaS clouds for sales and service, not for metered infrastructure.", "Salesforce известен SaaS-облаками для продаж и поддержки, а не инфраструктурой по счётчику."],
        ], "AWS was one of the first to enter cloud computing, offering infrastructure and platform services on a metered pay-as-you-go basis.", "AWS одним из первых вышел в облачные вычисления, предлагая инфраструктурные и платформенные сервисы с оплатой по счётчику."),
        qx("Google uses its own cloud platform internally for which of its products?", "Google Search and YouTube", [
          ["Office 365 and Teams", "Office 365 and Teams are Microsoft products, not Google's.", "Office 365 и Teams — продукты Microsoft, а не Google."],
          ["Sales Cloud and Service Cloud", "Sales Cloud and Service Cloud are Salesforce products.", "Sales Cloud и Service Cloud — продукты Salesforce."],
          ["Watson and Red Hat OpenShift", "Watson and Red Hat belong to IBM.", "Watson и Red Hat принадлежат IBM."],
        ], "Google also uses GCP internally for its end-user products such as Google Search and YouTube.", "Google сам использует GCP для своих продуктов, например Google Search и YouTube."),
        qx("Which Google service hosts web apps and automatically allocates and de-allocates resources to handle demand?", "Google App Engine", [
          ["Google BigQuery", "BigQuery is an analytics service for querying large datasets, not a web app host.", "BigQuery — сервис аналитики для запросов к большим данным, а не хостинг веб-приложений."],
          ["Google Kubernetes Engine", "Kubernetes Engine runs containers that you configure; the lecture's auto-scaling web platform is App Engine.", "Kubernetes Engine запускает настроенные вами контейнеры; платформа из лекции с автоматическим выделением ресурсов — App Engine."],
          ["Cloud Bigtable", "Bigtable is a NoSQL database for storage, not a platform for hosting web apps.", "Bigtable — NoSQL-база для хранения, а не платформа для веб-приложений."],
        ], "Google App Engine is a platform for developing and hosting web apps that allocates and de-allocates resources automatically.", "Google App Engine — платформа для разработки и размещения веб-приложений, которая автоматически выделяет и освобождает ресурсы."),
        qx("After acquiring Red Hat, which provider positions itself as the leading hybrid cloud provider?", "IBM Cloud", [
          ["Microsoft Azure", "Azure offers hybrid services, but the Red Hat acquisition belongs to IBM.", "У Azure есть гибридные сервисы, но покупка Red Hat — это IBM."],
          ["Oracle Cloud", "Oracle did not acquire Red Hat; IBM did.", "Red Hat купила не Oracle, а IBM."],
          ["Amazon Web Services", "AWS is the market share leader, but it is not the company that bought Red Hat.", "AWS — лидер по доле рынка, но Red Hat купила не она."],
        ], "With the acquisition of Red Hat, IBM positions itself as the leading hybrid cloud provider of our times.", "После покупки Red Hat IBM позиционирует себя как ведущего провайдера гибридного облака."),
        tfx("Microsoft Azure offers only infrastructure services and supports only Microsoft languages and tools.", false, "Azure offers SaaS, PaaS and IaaS and supports both Microsoft-specific and third-party languages, tools and frameworks.", "Azure предлагает SaaS, PaaS и IaaS и поддерживает как языки, инструменты и фреймворки Microsoft, так и сторонние.", "Choosing True ignores Azure's platform and software services and its support for third-party tools.", "Ответ True игнорирует платформенные и программные сервисы Azure и поддержку сторонних инструментов."),
        qx("Which provider is described as offering 'global reach with a local presence' through data centers in many regions?", "Microsoft Azure", [
          ["Salesforce", "Salesforce is described through its Sales, Service and Marketing clouds, not through its regions.", "Salesforce описан через облака Sales, Service и Marketing, а не через регионы."],
          ["SAP Cloud Platform", "SAP is known for enterprise software such as ERP and CRM; the phrase belongs to Azure.", "SAP известен корпоративным ПО вроде ERP и CRM; эта фраза относится к Azure."],
          ["Alibaba Cloud", "Alibaba Cloud is described as the largest Chinese provider, not with this phrase.", "Alibaba Cloud описан как крупнейший китайский провайдер, а не этой фразой."],
        ], "With data centers spread out in many regions, Azure provides a global reach with a local presence.", "Благодаря дата-центрам во многих регионах Azure обеспечивает глобальный охват при локальном присутствии."),
        qx("Sales Cloud, Service Cloud and Marketing Cloud are offered by which company?", "Salesforce", [
          ["SAP", "SAP offers ERP, CRM, HR and Finance software and the SAP Cloud Platform, not these clouds.", "SAP предлагает ERP, CRM, HR, финансы и SAP Cloud Platform, а не эти облака."],
          ["Alibaba Group", "Alibaba's cloud is Aliyun, focused on compute, storage and e-commerce, not these products.", "Облако Alibaba — Aliyun с упором на вычисления, хранилище и e-commerce, а не эти продукты."],
          ["Oracle", "Oracle Cloud is shown on the slide, but these three clouds are Salesforce products.", "Oracle Cloud есть на слайде, но эти три облака — продукты Salesforce."],
        ], "Salesforce offers Sales Cloud, Service Cloud and Marketing Cloud for analytics, customer support and social listening.", "Salesforce предлагает Sales Cloud, Service Cloud и Marketing Cloud для аналитики, поддержки клиентов и мониторинга соцсетей."),
        qx("Which company is known for enterprise software such as ERP, CRM, HR and Finance running in the cloud?", "SAP", [
          ["Alibaba", "Alibaba Cloud is known for compute and e-commerce infrastructure, not ERP suites.", "Alibaba Cloud известен вычислительной инфраструктурой и e-commerce, а не ERP-пакетами."],
          ["Google", "Google offers GCP and G Suite, not the ERP, HR and Finance suites described.", "Google предлагает GCP и G Suite, а не описанные пакеты ERP, HR и финансов."],
          ["VMware", "VMware is a virtualization company (ESX hypervisor), not an ERP vendor.", "VMware — компания виртуализации (гипервизор ESX), а не поставщик ERP."],
        ], "SAP is known for enterprise software (ERP, CRM, HR, Finance) in the cloud and the SAP Cloud Platform.", "SAP известен корпоративным ПО (ERP, CRM, HR, финансы) в облаке и платформой SAP Cloud Platform."),
        qx("Amazon EC2 and AWS Lambda belong to which group of AWS foundation services?", "Compute", [
          ["Database", "AWS databases on the slide are DynamoDB, RDS, Redshift and ElastiCache.", "Базы данных AWS на слайде — DynamoDB, RDS, Redshift и ElastiCache."],
          ["Networking", "AWS networking on the slide is Route 53, VPC and Direct Connect.", "Сетевые сервисы AWS на слайде — Route 53, VPC и Direct Connect."],
          ["Analytics", "AWS analytics on the slide is Kinesis, Data Pipeline and EMR.", "Аналитика AWS на слайде — Kinesis, Data Pipeline и EMR."],
        ], "EC2 (virtual servers) and Lambda (serverless functions) are the Compute foundation services of AWS.", "EC2 (виртуальные серверы) и Lambda (бессерверные функции) — базовые сервисы Compute в AWS."),
        qx("Which group of AWS services from the lecture's chart are all databases?", "DynamoDB, RDS and Redshift", [
          ["Route 53, VPC and Direct Connect", "These are AWS networking services: DNS, virtual networks and dedicated links.", "Это сетевые сервисы AWS: DNS, виртуальные сети и выделенные каналы."],
          ["IAM, CloudTrail and CloudWatch", "These are administration and security services, not databases.", "Это сервисы администрирования и безопасности, а не базы данных."],
          ["EC2, Lambda and CloudFormation", "EC2 and Lambda are compute, and CloudFormation is deployment and management.", "EC2 и Lambda — вычисления, а CloudFormation — развёртывание и управление."],
        ], "On the AWS chart the Database group lists DynamoDB, RDS, Redshift and ElastiCache.", "На схеме AWS в группе Database — DynamoDB, RDS, Redshift и ElastiCache."),
        qx("Which is listed as a critical skill for success in cloud computing careers?", "Knowledge of DevOps and microservices like Kubernetes", [
          ["Mainframe programming in assembly language only", "Mainframes are cloud history; the listed skills are modern platforms, OS, networking, security and DevOps.", "Мейнфреймы — история облака; в списке навыков — современные платформы, ОС, сети, безопасность и DevOps."],
          ["Assembling desktop PCs and repairing office printers", "Hardware repair is not on the list; the cloud provider handles physical hardware.", "Ремонта оборудования в списке нет; физическим оборудованием занимается провайдер."],
          ["Designing logos and marketing banners", "Graphic design is unrelated to the cloud skills listed in the lecture.", "Графический дизайн не связан с облачными навыками из лекции."],
        ], "Critical skills: AWS/Azure/Google Cloud, OS and networking, data security frameworks, DevOps and microservices such as Kubernetes.", "Ключевые навыки: AWS/Azure/Google Cloud, ОС и сети, фреймворки защиты данных, DevOps и микросервисы вроде Kubernetes."),
        qx("What does Gartner's Magic Quadrant for cloud infrastructure and platform services (CIPS) cover?", "IaaS plus integrated PaaS offerings", [
          ["Only SaaS applications such as office suites and email", "SaaS office apps are outside the CIPS scope, which is infrastructure plus platform services.", "Офисные SaaS-приложения не входят в CIPS, который охватывает инфраструктуру и платформенные сервисы."],
          ["Sales of physical servers to data centers", "CIPS is about highly automated cloud services, not about selling hardware.", "CIPS — про высоко автоматизированные облачные сервисы, а не про продажу оборудования."],
          ["Telecom carriers and their 5G networks", "Telecom networks are not part of the CIPS market described by Gartner.", "Телеком-сети не входят в рынок CIPS, описанный Gartner."],
        ], "The scope of the Magic Quadrant for CIPS includes IaaS and integrated PaaS offerings.", "Охват Magic Quadrant для CIPS — предложения IaaS и интегрированного PaaS."),
        qx("In Gartner's Magic Quadrant, which square holds AWS, Microsoft and Google?", "Leaders", [
          ["Challengers", "Challengers execute well but have a weaker vision; the three big providers are Leaders.", "Challengers хорошо исполняют, но с более слабым видением; три крупнейших провайдера — Leaders."],
          ["Visionaries", "Visionaries have strong vision but weaker execution; the big three score high on both.", "Visionaries сильны видением, но слабее в исполнении; у большой тройки высоко и то, и другое."],
          ["Niche Players", "Niche Players focus on a small segment; the big three serve the whole market.", "Niche Players работают на узкий сегмент; большая тройка обслуживает весь рынок."],
        ], "AWS, Microsoft and Google score high on both ability to execute and completeness of vision, so they are Leaders.", "AWS, Microsoft и Google высоко оценены и по способности реализовать, и по полноте видения, поэтому они Leaders."),
        qx("Which provider holds the largest worldwide market share in cloud infrastructure services?", "AWS (Amazon)", [
          ["Azure (Microsoft)", "Microsoft Azure is a strong second, but AWS holds the largest share.", "Microsoft Azure — уверенно второй, но самая большая доля у AWS."],
          ["Google Cloud (Google)", "Google Cloud is third, behind AWS and Azure.", "Google Cloud — третий, после AWS и Azure."],
          ["Aliyun (Alibaba)", "Alibaba Cloud leads in China, but its worldwide share is much smaller than AWS's.", "Alibaba Cloud лидирует в Китае, но его мировая доля намного меньше, чем у AWS."],
        ], "In the worldwide market share chart AWS is first with about a third of the market, followed by Azure and Google Cloud.", "На диаграмме мировых долей рынка AWS первый — около трети рынка, за ним Azure и Google Cloud."),
        qx("In Gartner's 2018–2022 predictions, which cloud segment was expected to grow the fastest?", "IaaS, about 27.5% a year", [
          ["SaaS, about 22% a year", "SaaS is the largest segment in money, but it grows more slowly than IaaS.", "SaaS — самый крупный сегмент по деньгам, но растёт медленнее IaaS."],
          ["PaaS, about 21.8% a year", "PaaS grows quickly, but 21.8% is below IaaS's 27.5%.", "PaaS растёт быстро, но 21.8% меньше, чем 27.5% у IaaS."],
          ["Total market, 12.6% a year", "12.6% is the CAGR of the whole public cloud market, slower than IaaS alone.", "12.6% — CAGR всего рынка публичного облака, медленнее, чем один IaaS."],
        ], "IaaS spending was predicted to grow from $30.5B to $76.6B, about 27.5% a year — the fastest segment.", "Расходы на IaaS по прогнозу растут с $30.5B до $76.6B, около 27.5% в год — быстрее всех сегментов."),
        qx("What size did Gartner predict for the worldwide public cloud service market in 2022?", "$331.2 billion", [
          ["$182.4 billion", "$182.4 billion is the 2018 starting value of the market, not the 2022 forecast.", "$182.4 млрд — стартовое значение рынка в 2018 году, а не прогноз на 2022."],
          ["$143.7 billion", "$143.7 billion is the 2022 forecast for SaaS alone, not the whole market.", "$143.7 млрд — прогноз на 2022 только для SaaS, а не для всего рынка."],
          ["$76.6 billion", "$76.6 billion is the 2022 forecast for IaaS alone.", "$76.6 млрд — прогноз на 2022 только для IaaS."],
        ], "The market was predicted to grow from $182.4B in 2018 to $331.2B in 2022, a CAGR of 12.6%.", "По прогнозу рынок вырастет с $182.4B в 2018 году до $331.2B в 2022 году, CAGR 12.6%."),
        qx("Gartner TalentNeuron scores the hiring scale for cloud skills at 78. What does that mean for employers?", "It is difficult to find the right applicants", [
          ["There are more applicants than open positions", "A high hiring-scale score means the opposite: positions are hard to fill.", "Высокий балл сложности найма означает обратное: вакансии трудно закрыть."],
          ["Cloud jobs are disappearing from the market", "The score measures difficulty of hiring, and demand for cloud skills is growing.", "Балл измеряет сложность найма, а спрос на облачные навыки растёт."],
          ["Most cloud jobs need no special skills", "If no skills were needed, hiring would be easy; the lecture lists critical skills.", "Если бы навыки были не нужны, нанимать было бы легко; в лекции перечислены ключевые навыки."],
        ], "A score of 78 means employers find it 'difficult' to get the right applicants for cloud positions.", "Оценка 78 означает, что работодателям «трудно» найти подходящих кандидатов на облачные вакансии."),
        qx("Which AWS certification is at the Foundational level?", "AWS Certified Cloud Practitioner", [
          ["AWS Certified Solutions Architect – Associate", "Solutions Architect – Associate is an Associate-level certification (about one year of experience).", "Solutions Architect – Associate — сертификат уровня Associate (около года опыта)."],
          ["AWS Certified DevOps Engineer – Professional", "DevOps Engineer is a Professional-level certification (about two years of experience).", "DevOps Engineer — сертификат уровня Professional (около двух лет опыта)."],
          ["AWS Certified Security – Specialty", "Security is a Specialty certification for a specific technical domain.", "Security — сертификат уровня Specialty для конкретной технической области."],
        ], "The Foundational level has one certification, Cloud Practitioner: about six months of fundamental AWS Cloud knowledge.", "На уровне Foundational один сертификат — Cloud Practitioner: около шести месяцев базовых знаний AWS Cloud."),
      ],
    ),
  ],
};
