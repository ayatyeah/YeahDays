import { part, q, tf, type Lecture } from "../types";

export const lecture1: Lecture = {
  id: "cn-l1",
  title: { en: "Lecture 1 — Networking Today. Basic Switch and End Device Configuration", ru: "Лекция 1 — Сети сегодня. Базовая настройка коммутатора и конечных устройств" },
  parts: [
    part(
      "cn-l1-p1",
      { en: "Network components and types of networks", ru: "Компоненты сети и типы сетей" },
      {
        en: `## Hosts, clients and servers
Every computer on a network is a **host**, also called an **end device**. An end device is where a message originates or where it is received.
- **Servers** provide information to end devices: email, web and file servers.
- **Clients** send requests to servers to retrieve information, for example a web page.
- In a **peer-to-peer** network one device is both client and server. It is easy to set up, less complex and cheaper, but has no centralized administration, is less secure, not scalable and slower. It suits only very small networks.
## Intermediary devices and media
An **intermediary device** interconnects end devices: switches, wireless access points, routers and firewalls. It regenerates and retransmits signals, keeps information about the pathways in the network, and notifies other devices of errors.
Network **media** carry the message from source to destination:
- **metal wires** in cables — electrical impulses;
- **glass or plastic fibers** (fiber-optic cable) — pulses of light;
- **wireless** — modulation of electromagnetic waves.
@diagram network-components
![Three kinds of media: copper cable, fiber-optic cable and a wireless antenna](/events/cn/network-media.webp)
## Diagrams
Key terms: **Network Interface Card (NIC)**, **physical port**, **interface** (port and interface are often used interchangeably).
- A **physical topology** diagram shows the physical location of intermediary devices and cable installation.
- A **logical topology** diagram shows devices, ports and the **addressing scheme**.
## Networks of many sizes
- **Small home networks** — connect a few computers to each other and to the internet.
- **Small office / home office (SOHO)** — lets computers in a home or remote office connect to a corporate network.
- **Medium to large networks** — many locations with hundreds or thousands of interconnected computers.
- **World wide networks** — connect hundreds of millions of computers; the internet is the example.
Network infrastructures differ in the size of the area covered, the number of users, the number and types of services, and the area of responsibility.
## LAN, WAN and the internet
- A **LAN** spans a small geographical area, is administered by a single organization or individual and gives high-speed bandwidth to internal devices.
- A **WAN** spans a wide geographical area, interconnects LANs, is typically administered by one or more **service providers** and usually has slower links.
- The **internet** is a worldwide collection of interconnected LANs and WANs. Nobody owns it; **IETF, ICANN and IAB** help maintain its structure.
- An **intranet** is a private collection of LANs and WANs for the members of one organization. An **extranet** gives secure access to people who work for a **different** organization.
@diagram lan-wan
| | LAN | WAN |
|---|---|---|
| Area | small, limited | wide geographical |
| Administered by | one organization or person | one or more service providers |
| Speed | high bandwidth inside | usually slower links between LANs |
| Role | connects end devices | connects LANs |
## Internet connections
Home and small office: **cable** (from cable TV providers), **DSL** (over a telephone line), **cellular**, **satellite** (useful in rural areas), **dial-up** (cheap, low bandwidth, uses a modem).
Business: **dedicated leased line** (reserved circuits in the provider's network), **Ethernet WAN** (extends LAN technology into the WAN), business DSL such as **SDSL**, satellite.
| Connection | Where | Note |
|---|---|---|
| Cable | home | from the cable TV provider, always on |
| DSL | home, business (SDSL) | over a telephone line, always on |
| Cellular | home, mobile | uses the cell phone network |
| Satellite | rural areas | works where there is no wired provider |
| Dial-up | home | cheap, low bandwidth, modem |
| Leased line | business | reserved circuit between offices |
| Ethernet WAN | business | LAN technology stretched over the WAN |
?? A partner company's employees need secure access to part of your network. Intranet or extranet?
?= Extranet — it serves people from a different organization. An intranet is for your own members only.
?? Who administers a WAN, and who administers a LAN?
?= A WAN is typically run by one or more service providers; a LAN by a single organization or individual.
> Know the pairs: LAN — one owner, small area; WAN — providers, wide area. Intranet — own staff; extranet — partners from outside.`,
        ru: `## Хосты, клиенты и серверы
Каждый компьютер в сети — это **хост**, он же **конечное устройство**. Конечное устройство — то, откуда сообщение отправляется или где оно принимается.
- **Серверы** отдают информацию конечным устройствам: почтовые, веб- и файловые серверы.
- **Клиенты** отправляют серверам запросы, чтобы получить информацию, например веб-страницу.
- В **одноранговой (peer-to-peer)** сети одно устройство — и клиент, и сервер. Её легко настроить, она проще и дешевле, но в ней нет централизованного управления, она менее безопасна, не масштабируется и работает медленнее. Годится только для очень маленьких сетей.
## Промежуточные устройства и среда передачи
**Промежуточное устройство** соединяет конечные: коммутаторы, точки доступа, маршрутизаторы и межсетевые экраны. Оно восстанавливает и передаёт сигнал дальше, хранит сведения о путях в сети и сообщает другим устройствам об ошибках.
**Среда передачи** несёт сообщение от источника к получателю:
- **металлические провода** в кабелях — электрические импульсы;
- **стеклянные или пластиковые волокна** (оптоволокно) — импульсы света;
- **беспроводная передача** — модуляция электромагнитных волн.
@diagram network-components
![Три вида среды передачи: медный кабель, оптоволокно и беспроводная антенна](/events/cn/network-media.webp)
## Схемы
Термины: **сетевая карта (NIC)**, **физический порт**, **интерфейс** (порт и интерфейс часто означают одно и то же).
- Схема **физической топологии** показывает физическое расположение промежуточных устройств и прокладку кабелей.
- Схема **логической топологии** показывает устройства, порты и **схему адресации**.
## Сети разного размера
- **Малые домашние сети** — соединяют несколько компьютеров между собой и с интернетом.
- **Малый офис / домашний офис (SOHO)** — позволяет компьютерам дома или в удалённом офисе подключаться к корпоративной сети.
- **Средние и крупные сети** — много площадок с сотнями и тысячами связанных компьютеров.
- **Всемирные сети** — соединяют сотни миллионов компьютеров; пример — интернет.
Сетевые инфраструктуры различаются размером территории, числом пользователей, числом и видами сервисов и зоной ответственности.
## LAN, WAN и интернет
- **LAN** охватывает небольшую территорию, управляется одной организацией или человеком и даёт внутренним устройствам высокую скорость.
- **WAN** охватывает большую территорию, соединяет локальные сети, обычно управляется одним или несколькими **провайдерами** и, как правило, имеет более медленные каналы.
- **Интернет** — всемирное объединение связанных между собой LAN и WAN. Он никому не принадлежит; поддерживать его структуру помогают **IETF, ICANN и IAB**.
- **Интранет** — частное объединение LAN и WAN для сотрудников одной организации. **Экстранет** даёт защищённый доступ людям из **другой** организации.
@diagram lan-wan
| | LAN | WAN |
|---|---|---|
| Территория | небольшая, ограниченная | большая географическая |
| Кто управляет | одна организация или человек | один или несколько провайдеров |
| Скорость | высокая внутри | обычно медленнее между LAN |
| Роль | соединяет конечные устройства | соединяет LAN |
## Подключение к интернету
Дом и малый офис: **кабель** (от провайдеров кабельного ТВ), **DSL** (по телефонной линии), **сотовая связь**, **спутник** (выручает в сельской местности), **dial-up** (дёшево, низкая скорость, через модем).
Бизнес: **выделенная арендованная линия** (зарезервированные каналы в сети провайдера), **Ethernet WAN** (технология LAN, продлённая в WAN), бизнес-DSL, например **SDSL**, спутник.
| Подключение | Где | Особенность |
|---|---|---|
| Кабель | дом | от провайдера кабельного ТВ, всегда включено |
| DSL | дом, бизнес (SDSL) | по телефонной линии, всегда включено |
| Сотовая связь | дом, в дороге | через сеть мобильного оператора |
| Спутник | сельская местность | работает там, где нет проводного провайдера |
| Dial-up | дом | дёшево, низкая скорость, модем |
| Арендованная линия | бизнес | зарезервированный канал между офисами |
| Ethernet WAN | бизнес | технология LAN, растянутая на WAN |
?? Сотрудникам компании-партнёра нужен защищённый доступ к части вашей сети. Интранет или экстранет?
?= Экстранет — он для людей из другой организации. Интранет — только для своих.
?? Кто управляет WAN, а кто — LAN?
?= WAN обычно управляют один или несколько провайдеров; LAN — одна организация или человек.
> Запомни пары: LAN — один владелец, малая территория; WAN — провайдеры, большая территория. Интранет — свои сотрудники; экстранет — партнёры извне.`,
      },
      [
        q("What is another name for a host on a network?", "End device", ["Intermediary device", "Network medium", "Service provider"], "Every computer on a network is a host, also called an end device.", "Каждый компьютер в сети — хост, он же конечное устройство."),
        q("Which of the following is an intermediary device?", "Router", ["Web server", "Laptop", "Network printer"], "Switches, access points, routers and firewalls interconnect end devices.", "Коммутаторы, точки доступа, маршрутизаторы и межсетевые экраны соединяют конечные устройства."),
        q("Which is a disadvantage of a peer-to-peer network?", "No centralized administration", ["It is expensive to build", "It is difficult to set up", "It needs a dedicated server"], "Peer-to-peer is cheap and simple, but has no central administration, is less secure and not scalable.", "Одноранговая сеть дешёвая и простая, но без централизованного управления, менее безопасна и не масштабируется."),
        q("How does fiber-optic cable carry data?", "As pulses of light", ["As electrical impulses", "As radio frequency waves", "As sound vibrations"], "Glass or plastic fibers use pulses of light; copper uses electrical impulses.", "Стеклянные или пластиковые волокна передают импульсы света; медь — электрические импульсы."),
        q("Which diagram shows devices, ports and the addressing scheme of a network?", "Logical topology diagram", ["Physical topology diagram", "Cable installation plan", "Rack elevation diagram"], "The logical topology shows devices, ports and addressing; the physical one shows locations and cabling.", "Логическая топология показывает устройства, порты и адресацию; физическая — расположение и кабели."),
        q("Who typically administers a WAN?", "One or more service providers", ["A single home user", "The IT team of one office", "Nobody — it has no owner"], "A LAN has one administrator; a WAN is typically run by service providers.", "У LAN один администратор; WAN обычно управляют провайдеры."),
        q("A company gives a supplier's employees secure access to part of its network. What is this called?", "Extranet", ["Intranet", "Internet", "Peer-to-peer"], "An extranet serves people who work for a different organization but need access to its data.", "Экстранет — для людей из другой организации, которым нужен доступ к данным компании."),
        q("Which internet connection runs over a telephone line and is always on with high bandwidth?", "DSL", ["Cable", "Dial-up", "Satellite"], "DSL is a high-bandwidth, always-on connection over a telephone line; dial-up is low bandwidth.", "DSL — высокоскоростное постоянное подключение по телефонной линии; dial-up — низкоскоростное."),
        tf("The internet is owned and controlled by ICANN.", false, "Nobody owns the internet; IETF, ICANN and IAB only help maintain its structure.", "Интернет никому не принадлежит; IETF, ICANN и IAB лишь помогают поддерживать его структуру."),
        q("Which business connection uses reserved circuits inside the service provider's network to link distant offices?", "Dedicated leased line", ["Ethernet WAN", "Business DSL", "Satellite link"], "A leased line is a reserved circuit that connects distant offices with private voice or data networking.", "Арендованная линия — зарезервированный канал, соединяющий удалённые офисы частной сетью."),
      ],
    ),
    part(
      "cn-l1-p2",
      { en: "Reliable networks and network trends", ru: "Надёжные сети и тенденции" },
      {
        en: `## Converged networks
Before convergence an organization had separate cabling for telephone, video and data, each with its own technologies, rules and standards. A **converged network** carries **data, voice and video** over the **same infrastructure** with the same set of rules and standards.
## Four characteristics of a reliable network
**Network architecture** is the set of technologies that support the infrastructure that moves data. It must address four things:
- **Fault tolerance** — limits the impact of a failure by limiting the number of affected devices. It needs **multiple paths** (redundancy). **Packet switching** splits traffic into packets, and each packet can take a different path. A **circuit-switched** network sets up a dedicated circuit and cannot do this.
- **Scalability** — the network expands quickly to support new users and applications **without hurting** the performance of existing users. Designers follow accepted standards and protocols.
- **Quality of Service (QoS)** — the primary mechanism that ensures reliable delivery of content for all users. Voice and live video need it; breaks and pauses appear when demand for bandwidth is higher than what is available and QoS is not configured.
- **Security** — infrastructure security (physical security of devices and preventing unauthorized access) and information security (protecting the data).
| Characteristic | Question it answers | How |
|---|---|---|
| Fault tolerance | will one failure stop everyone? | multiple paths, packet switching |
| Scalability | can we add users without slowing others? | standards and protocols |
| QoS | will voice and video stay smooth? | prioritizing traffic |
| Security | who can access devices and read data? | infrastructure and information security |
## Three goals of security
- **Confidentiality** — only intended recipients can read the data.
- **Integrity** — the data was not altered during transmission.
- **Availability** — timely and reliable access for authorized users.
## Trends
- **BYOD** — any device, with any ownership, used anywhere.
- **Online collaboration** (Cisco Webex) and **video communication**.
- Collaboration tools such as **Cisco Webex Teams** let people send instant messages and post images, videos and links; collaboration is a very high priority for business and education.
- **Video** calls and conferencing reach anyone regardless of location; video is becoming a critical requirement for collaboration (Cisco TelePresence).
- **Cloud computing** — storing files and running applications on servers over the internet; made possible by **data centers**.
## Four types of clouds
- **Public** — available to the general public, free or pay-per-use.
- **Private** — for a specific organization, such as a government.
- **Hybrid** — two or more cloud types connected by the same architecture.
- **Custom** — built for a specific industry, such as healthcare or media.
![Rows of 19-inch racks in a data center — this is where the cloud physically lives](/events/cn/data-center-racks.webp)
## At home
**Smart home** technology integrates into everyday appliances. **Powerline networking** connects a device to the LAN through an electrical outlet where cables or wireless are not an option. A **WISP** (wireless internet service provider) connects subscribers to access points or hotspots, mostly in rural areas.
> Fault tolerance = redundancy, scalability = growth, QoS = priority, security = CIA.
?? A live lecture stream stutters whenever many students download files. Which characteristic of a reliable network is missing?
?= Quality of Service — it prioritizes voice and video when demand for bandwidth exceeds supply.
?? Name the three goals of network security.
?= Confidentiality (only intended readers), integrity (data not altered), availability (timely access for authorized users).`,
        ru: `## Конвергентные сети
До конвергенции у организации были отдельные кабельные системы для телефона, видео и данных — каждая со своими технологиями, правилами и стандартами. **Конвергентная сеть** передаёт **данные, голос и видео** по **одной инфраструктуре** с единым набором правил и стандартов.
## Четыре характеристики надёжной сети
**Архитектура сети** — это набор технологий, поддерживающих инфраструктуру, по которой движутся данные. Она должна обеспечивать четыре вещи:
- **Отказоустойчивость** — ограничивает последствия сбоя, уменьшая число затронутых устройств. Для неё нужны **несколько путей** (избыточность). **Коммутация пакетов** делит трафик на пакеты, и каждый может пойти своим путём. Сеть с **коммутацией каналов** создаёт выделенный канал и так не умеет.
- **Масштабируемость** — сеть быстро расширяется для новых пользователей и приложений, **не ухудшая** работу существующих. Проектировщики следуют принятым стандартам и протоколам.
- **Качество обслуживания (QoS)** — основной механизм, обеспечивающий надёжную доставку содержимого всем пользователям. Нужен голосу и живому видео; обрывы и паузы появляются, когда запрос на полосу больше доступной, а QoS не настроен.
- **Безопасность** — защита инфраструктуры (физическая защита устройств и запрет несанкционированного доступа) и защита информации (самих данных).
| Характеристика | На какой вопрос отвечает | Как |
|---|---|---|
| Отказоустойчивость | остановит ли один сбой всех? | несколько путей, коммутация пакетов |
| Масштабируемость | можно ли добавить людей, не замедлив остальных? | стандарты и протоколы |
| QoS | останутся ли голос и видео плавными? | приоритеты трафика |
| Безопасность | кто может попасть к устройствам и читать данные? | защита инфраструктуры и информации |
## Три цели безопасности
- **Конфиденциальность** — данные читает только тот, кому они предназначены.
- **Целостность** — данные не изменены при передаче.
- **Доступность** — своевременный и надёжный доступ для авторизованных пользователей.
## Тенденции
- **BYOD** — любое устройство, чьё угодно, где угодно.
- **Совместная работа онлайн** (Cisco Webex) и **видеосвязь**.
- Инструменты вроде **Cisco Webex Teams** позволяют отправлять мгновенные сообщения и публиковать изображения, видео и ссылки; совместная работа — высокий приоритет для бизнеса и образования.
- **Видеозвонки** и конференции доступны независимо от места; видео становится обязательным условием совместной работы (Cisco TelePresence).
- **Облачные вычисления** — хранение файлов и работа приложений на серверах через интернет; возможны благодаря **дата-центрам**.
## Четыре типа облаков
- **Публичное** — доступно всем, бесплатно или с оплатой по использованию.
- **Частное** — для конкретной организации, например правительства.
- **Гибридное** — два и более типа облаков, связанные общей архитектурой.
- **Специализированное (custom)** — под конкретную отрасль, например медицину или медиа.
![Ряды 19-дюймовых стоек в дата-центре — физически облако живёт здесь](/events/cn/data-center-racks.webp)
## Дома
Технологии **умного дома** встраиваются в бытовую технику. **Powerline-сеть** подключает устройство к LAN через электрическую розетку там, где кабель или Wi-Fi не подходят. **WISP** (беспроводной интернет-провайдер) подключает абонентов к точкам доступа или хот-спотам, чаще всего в сельской местности.
> Отказоустойчивость = избыточность, масштабируемость = рост, QoS = приоритет, безопасность = конфиденциальность, целостность, доступность.
?? Трансляция лекции заикается, когда много студентов качают файлы. Какой характеристики надёжной сети не хватает?
?= Качества обслуживания (QoS) — оно отдаёт приоритет голосу и видео, когда полосы не хватает.
?? Назови три цели сетевой безопасности.
?= Конфиденциальность (читает только адресат), целостность (данные не изменены), доступность (своевременный доступ для авторизованных).`,
      },
      [
        q("What does a converged network carry over the same infrastructure?", "Data, voice and video", ["Only encrypted data traffic", "Power and data together", "Wired and wireless signals"], "A converged network delivers data, voice and video with one set of rules and standards.", "Конвергентная сеть передаёт данные, голос и видео по единым правилам и стандартам."),
        q("Which characteristic limits the number of devices affected by a failure?", "Fault tolerance", ["Scalability", "Quality of Service", "Security"], "A fault-tolerant network limits the impact of a failure and needs multiple paths.", "Отказоустойчивая сеть ограничивает последствия сбоя и требует нескольких путей."),
        q("What does a network need in order to be fault tolerant?", "Multiple paths between devices", ["A single high-speed link", "A dedicated circuit per call", "One central server for all users"], "Redundancy comes from multiple paths, which packet switching can use.", "Избыточность дают несколько путей, которыми пользуется коммутация пакетов."),
        q("A network grows from 50 to 500 users and existing users notice no slowdown. Which characteristic is this?", "Scalability", ["Fault tolerance", "Integrity", "Availability"], "A scalable network expands without impacting the performance of existing users.", "Масштабируемая сеть расширяется, не ухудшая работу существующих пользователей."),
        q("A live video keeps pausing because demand for bandwidth exceeds supply. What should be configured?", "Quality of Service", ["Fault tolerance", "Powerline networking", "A private cloud"], "QoS is the primary mechanism for reliable delivery when bandwidth is contended.", "QoS — основной механизм надёжной доставки, когда полосы не хватает."),
        q("Which security goal means that data has not been altered during transmission?", "Integrity", ["Confidentiality", "Availability", "Scalability"], "Integrity is the assurance that data was not changed in transit.", "Целостность — гарантия, что данные не изменились при передаче."),
        q("Which security goal means that only the intended recipients can read the data?", "Confidentiality", ["Integrity", "Availability", "Redundancy"], "Confidentiality restricts reading to the intended recipients.", "Конфиденциальность — данные читает только адресат."),
        q("Which type of cloud is built to meet the needs of a specific industry such as healthcare?", "Custom cloud", ["Public cloud", "Hybrid cloud", "Private cloud"], "Custom clouds serve a specific industry and can be private or public.", "Специализированные облака служат конкретной отрасли и бывают частными или публичными."),
        q("Which technology lets a device join the LAN through an electrical outlet?", "Powerline networking", ["Wireless broadband", "Dial-up access", "Metro Ethernet"], "A powerline adapter sends data on certain frequencies over electrical wiring.", "Powerline-адаптер передаёт данные на определённых частотах по электропроводке."),
        tf("In a packet-switched network every packet of a message must follow the same dedicated path.", false, "Each packet can take a different path; a dedicated circuit is a feature of circuit switching.", "Каждый пакет может идти своим путём; выделенный канал — признак коммутации каналов."),
      ],
    ),
    part(
      "cn-l1-p3",
      { en: "Cisco IOS: access, modes and command structure", ru: "Cisco IOS: доступ, режимы и структура команд" },
      {
        en: `## Operating system
- **Shell** — the user interface that lets you request tasks, through a **CLI** or a **GUI**.
- **Kernel** — communicates between hardware and software and manages how hardware resources are used.
- **Hardware** — the physical part, including the electronics.
A GUI is friendlier, but it can fail or crash, so network devices are usually managed through the **CLI**.
Examples of GUI systems: Windows, macOS, Linux KDE, Apple iOS and Android. A PC operating system lets you use a mouse, enter text and see output on a monitor; a CLI-based network operating system lets a technician run network programs and enter text-based commands from the **keyboard** and see the output on a monitor.
## Access methods
- **Console** — a physical management port; used for maintenance and the **initial configuration**.
- **SSH** — a **secure** remote CLI connection over the network. The recommended remote method.
- **Telnet** — an **insecure** remote connection: authentication, passwords and commands travel in **plaintext**.
Terminal emulation programs: **PuTTY, Tera Term, SecureCRT**.
![A light-blue rollover console cable connected to the console port of a switch](/events/cn/console-cable.webp)
| Method | Secure? | When |
|---|---|---|
| Console | yes — physical access only | initial configuration, maintenance |
| SSH | yes — encrypted | everyday remote management |
| Telnet | no — plaintext | legacy; avoid |
## Command modes
- **User EXEC** — limited basic monitoring commands. Prompt ends with **>**
- **Privileged EXEC** — access to all commands. Prompt ends with **#**
- **Global configuration** — configuration options of the whole device. Prompt **(config)#**
- **Line configuration** — console, SSH, Telnet or AUX access. Prompt **(config-line)#**
- **Interface configuration** — a switch port or router interface. Prompt **(config-if)#**
@diagram ios-modes
![A terminal window: the prompt changes from Switch> to Switch# after enable](/events/cn/putty-terminal.webp)
## Moving between modes
= Switch> enable
= Switch# configure terminal
= Switch(config)# line console 0
= Switch(config-line)# exit
= Switch(config)# interface vlan 1
= Switch(config-if)# end
- **enable** — user EXEC to privileged EXEC.
- **configure terminal** — privileged EXEC to global configuration.
- **exit** — one level back. **end** or **Ctrl+Z** — straight back to privileged EXEC.
## Command structure and help
A command is followed by **keywords** (predefined by the OS) and **arguments** (values you supply). In **ping 10.10.10.5** the argument is the IP address.
Syntax conventions: **boldface** — type as shown; italics — a value you supply; **[x]** — optional; **{x}** — required.
Help: **context-sensitive help** (the **?** key) shows available commands and keywords; the **command syntax check** tells you what is wrong with a command.
## Hot keys
- **Tab** — completes a partial command. **Up Arrow / Ctrl+P** — recalls previous commands.
- **Backspace** — erases the character to the left. **Left Arrow / Ctrl+B** and **Right Arrow / Ctrl+F** — move the cursor one character.
- **Ctrl+C** or **Ctrl+Z** — leave configuration mode and return to privileged EXEC.
- **Ctrl+Shift+6** — all-purpose break: aborts DNS lookups, traceroutes and pings.
- At the **--More--** prompt: **Enter** shows the next line, **Space** the next screen, **any other key** ends the display and returns to privileged EXEC.
Commands can be shortened to the fewest unique characters: **conf** for configure.
| Keystroke | Does |
|---|---|
| Tab | completes the command |
| ? | context-sensitive help |
| Up arrow / Ctrl+P | previous command |
| Ctrl+C, Ctrl+Z | leave configuration mode → privileged EXEC |
| Ctrl+Shift+6 | abort ping, traceroute, DNS lookup |
| Enter / Space at --More-- | next line / next screen |
?? You see the prompt Switch(config-if)# and want to get back to Switch# in one step. Which command?
?= end (or Ctrl+Z). exit would only go one level up, to Switch(config)#.
?? Which access method sends your password across the network in plaintext?
?= Telnet. Use SSH instead.
> The command **hostname** works only in global configuration mode — you need to pass through enable and configure terminal first.`,
        ru: `## Операционная система
- **Оболочка (shell)** — интерфейс, через который ты отдаёшь команды: **CLI** или **GUI**.
- **Ядро (kernel)** — связывает железо и программы и распределяет аппаратные ресурсы.
- **Аппаратная часть** — физическая часть, включая электронику.
GUI удобнее, но может зависнуть или упасть, поэтому сетевыми устройствами обычно управляют через **CLI**.
Примеры систем с GUI: Windows, macOS, Linux KDE, Apple iOS и Android. ОС компьютера позволяет работать мышью, вводить текст и видеть вывод на мониторе; сетевая ОС с CLI позволяет технику запускать сетевые программы и вводить текстовые команды с **клавиатуры** и видеть вывод на мониторе.
## Способы доступа
- **Консоль** — физический порт управления; для обслуживания и **первоначальной настройки**.
- **SSH** — **защищённое** удалённое подключение к CLI по сети. Рекомендуемый удалённый способ.
- **Telnet** — **незащищённое** удалённое подключение: логин, пароли и команды идут **открытым текстом**.
Программы-эмуляторы терминала: **PuTTY, Tera Term, SecureCRT**.
![Голубой консольный кабель rollover, подключённый к консольному порту коммутатора](/events/cn/console-cable.webp)
| Способ | Защищён? | Когда |
|---|---|---|
| Консоль | да — нужен физический доступ | первоначальная настройка, обслуживание |
| SSH | да — шифруется | повседневное удалённое управление |
| Telnet | нет — открытый текст | устаревший; избегать |
## Режимы команд
- **Пользовательский EXEC** — ограниченный набор команд наблюдения. Приглашение кончается на **>**
- **Привилегированный EXEC** — доступ ко всем командам. Приглашение кончается на **#**
- **Глобальная конфигурация** — настройки всего устройства. Приглашение **(config)#**
- **Конфигурация линии** — доступ через консоль, SSH, Telnet или AUX. Приглашение **(config-line)#**
- **Конфигурация интерфейса** — порт коммутатора или интерфейс маршрутизатора. Приглашение **(config-if)#**
@diagram ios-modes
![Окно терминала: после enable приглашение меняется с Switch> на Switch#](/events/cn/putty-terminal.webp)
## Переходы между режимами
= Switch> enable
= Switch# configure terminal
= Switch(config)# line console 0
= Switch(config-line)# exit
= Switch(config)# interface vlan 1
= Switch(config-if)# end
- **enable** — из пользовательского EXEC в привилегированный.
- **configure terminal** — из привилегированного EXEC в глобальную конфигурацию.
- **exit** — на один уровень назад. **end** или **Ctrl+Z** — сразу в привилегированный EXEC.
## Структура команды и справка
За командой идут **ключевые слова** (заданы в ОС) и **аргументы** (значения, которые вводишь ты). В **ping 10.10.10.5** аргумент — IP-адрес.
Обозначения синтаксиса: **жирный** — вводить как написано; курсив — значение подставляешь ты; **[x]** — необязательный элемент; **{x}** — обязательный.
Справка: **контекстная справка** (клавиша **?**) показывает доступные команды и ключевые слова; **проверка синтаксиса** сообщает, что не так с командой.
## Горячие клавиши
- **Tab** — дописывает команду. **Стрелка вверх / Ctrl+P** — прошлые команды.
- **Backspace** — стирает символ слева. **Стрелка влево / Ctrl+B** и **стрелка вправо / Ctrl+F** — сдвигают курсор на символ.
- **Ctrl+C** или **Ctrl+Z** — выйти из режима конфигурации в привилегированный EXEC.
- **Ctrl+Shift+6** — универсальное прерывание: останавливает DNS-поиск, traceroute и ping.
- На приглашении **--More--**: **Enter** — следующая строка, **Пробел** — следующий экран, **любая другая клавиша** прекращает вывод и возвращает в привилегированный EXEC.
Команды можно сокращать до минимума уникальных символов: **conf** вместо configure.
| Клавиши | Что делают |
|---|---|
| Tab | дописывают команду |
| ? | контекстная справка |
| Стрелка вверх / Ctrl+P | предыдущая команда |
| Ctrl+C, Ctrl+Z | выход из режима конфигурации → привилегированный EXEC |
| Ctrl+Shift+6 | прервать ping, traceroute, DNS-поиск |
| Enter / Пробел на --More-- | следующая строка / следующий экран |
?? Ты видишь приглашение Switch(config-if)# и хочешь вернуться в Switch# одним шагом. Какая команда?
?= end (или Ctrl+Z). exit поднял бы только на один уровень, в Switch(config)#.
?? Какой способ доступа передаёт твой пароль по сети открытым текстом?
?= Telnet. Вместо него — SSH.
> Команда **hostname** работает только в режиме глобальной конфигурации — сначала нужны enable и configure terminal.`,
      },
      [
        q("Which command moves a session from User EXEC to Privileged EXEC mode in Cisco IOS?", "enable", ["configure terminal", "system-view", "privilege level 15"], "enable moves from user EXEC (>) to privileged EXEC (#).", "enable переводит из пользовательского EXEC (>) в привилегированный (#)."),
        q("Which mode allows executing 'hostname Sw1'?", "Global Configuration", ["User EXEC", "Privileged EXEC", "Interface Config"], "hostname is a global configuration command: Switch(config)# hostname Sw1.", "hostname — команда глобальной конфигурации: Switch(config)# hostname Sw1."),
        q("Which keyboard shortcut cancels an accidental hung command or DNS lookup in Cisco IOS?", "Ctrl + Shift + 6", ["Ctrl + C", "Ctrl + Alt + Delete", "Esc + Shift"], "Ctrl+Shift+6 is the all-purpose break sequence that aborts DNS lookups, traceroutes and pings.", "Ctrl+Shift+6 — универсальное прерывание: останавливает DNS-поиск, traceroute и ping."),
        q("Which symbol ends the prompt in User EXEC mode?", ">", ["#", "(config)#", "$"], "User EXEC ends with >, privileged EXEC ends with #.", "Пользовательский EXEC кончается на >, привилегированный — на #."),
        q("Which access method is recommended for remote management of a device?", "SSH", ["Telnet", "Console", "AUX"], "SSH gives a secure remote CLI; Telnet sends everything in plaintext.", "SSH даёт защищённый удалённый CLI; Telnet передаёт всё открытым текстом."),
        q("Which access method is normally used for the initial configuration of a new switch?", "Console port", ["SSH session", "Telnet session", "Web browser"], "The console is a physical management port used for maintenance and initial configuration.", "Консоль — физический порт управления для обслуживания и первоначальной настройки."),
        q("Which part of an operating system communicates between hardware and software?", "Kernel", ["Shell", "GUI", "CLI"], "The kernel manages how hardware resources meet software requirements; the shell is the user interface.", "Ядро распределяет аппаратные ресурсы под нужды программ; оболочка — интерфейс пользователя."),
        q("In the command 'ping 10.10.10.5', what is 10.10.10.5?", "An argument", ["A keyword", "A command mode", "A hot key"], "An argument is a value supplied by the user; a keyword is predefined in the OS.", "Аргумент — значение, которое вводит пользователь; ключевое слово задано в ОС."),
        q("Which command returns you from interface configuration straight to privileged EXEC?", "end", ["exit", "enable", "logout"], "end (or Ctrl+Z) returns to privileged EXEC from any configuration mode; exit goes one level back.", "end (или Ctrl+Z) возвращает в привилегированный EXEC из любого режима конфигурации; exit — на уровень назад."),
        q("Which key completes a partially typed command?", "Tab", ["Space Bar", "Enter", "Backspace"], "Tab completes a partial command name entry.", "Tab дописывает частично введённую команду."),
        q("In Cisco syntax notation, what do square brackets [x] indicate?", "An optional element", ["A required element", "A value you must supply", "A literal keyword"], "Square brackets mark an optional element; braces {x} mark a required one.", "Квадратные скобки — необязательный элемент; фигурные {x} — обязательный."),
      ],
    ),
    part(
      "cn-l1-p4",
      { en: "Basic device configuration and saving it", ru: "Базовая настройка устройства и её сохранение" },
      {
        en: `## Device name
The first configuration command on any device should give it a unique **hostname**. The factory default name of a Cisco switch is **Switch**.
A hostname must start with a letter, contain no spaces, end with a letter or digit, use only letters, digits and dashes, and be shorter than 64 characters.
= Switch(config)# hostname Sw-Floor-1
= Sw-Floor-1(config)# no hostname
## Passwords
Use more than eight characters, mix upper and lower case, digits and special characters, do not reuse one password on all devices and avoid common words. Lab passwords such as **cisco** and **class** are weak.
Securing **user EXEC** access (console):
= Sw1(config)# line console 0
= Sw1(config-line)# password cisco
= Sw1(config-line)# login
Securing **privileged EXEC** access:
= Sw1(config)# enable secret class
Securing remote **VTY** access (Telnet or SSH), lines 0 to 15 — 16 lines:
= Sw1(config)# line vty 0 15
= Sw1(config-line)# password cisco
= Sw1(config-line)# login
## Encrypting passwords and the banner
The configuration files show most passwords in plaintext. This command encrypts all plaintext passwords:
= Sw1(config)# service password-encryption
A banner warns unauthorized people. The **#** is the **delimiting character**, typed before and after the message:
= Sw1(config)# banner motd #Authorized access only!#
| Protects | Commands |
|---|---|
| Console (user EXEC) | line console 0 → password … → login |
| Privileged EXEC | enable secret … |
| Remote Telnet/SSH | line vty 0 15 → password … → login |
| All plaintext passwords | service password-encryption |
## Two configuration files
- **running-config** — stored in **RAM**. It is the current configuration; changes take effect immediately. RAM is **volatile** and loses its content when the device is powered off or restarted.
- **startup-config** — stored in **NVRAM**. It is used at startup or reboot and survives a power-off.
Saving the running configuration:
= Sw1# copy running-config startup-config
@diagram config-files
## Undoing changes
- Not saved yet: remove the commands one by one, or **reload** the device (it goes offline for a short time).
- Already saved: **erase startup-config**, then **reload** to clear the running-config from RAM.
- **show running-config** and **show startup-config** display the files; a terminal program can log them to a text file as a backup.
## Capturing the configuration to a text file
- Open terminal software (PuTTY or Tera Term) that is already connected to the switch.
- Enable **logging** in the terminal software and choose a file name and location.
- Run **show running-config** or **show startup-config** at the privileged EXEC prompt — the text goes into the file.
- Disable logging. The file is a record of the configuration; it may need editing before it is used to restore a device.
> RAM = running, NVRAM = startup. "copy running-config startup-config" is typed at the # prompt.
?? You configured a hostname and passwords, then the switch lost power. Everything is gone. What did you forget?
?= copy running-config startup-config — the running-config lives in RAM and is lost on power-off.
?? Which command makes the configuration show encrypted passwords instead of plaintext ones?
?= service password-encryption (global configuration mode).`,
        ru: `## Имя устройства
Первая команда настройки на любом устройстве — дать ему уникальное **имя (hostname)**. Заводское имя коммутатора Cisco — **Switch**.
Имя должно начинаться с буквы, не содержать пробелов, заканчиваться буквой или цифрой, состоять только из букв, цифр и дефисов и быть короче 64 символов.
= Switch(config)# hostname Sw-Floor-1
= Sw-Floor-1(config)# no hostname
## Пароли
Длина больше восьми символов, смешивай регистр, цифры и спецсимволы, не ставь один пароль на все устройства и избегай обычных слов. Лабораторные пароли вроде **cisco** и **class** — слабые.
Защита **пользовательского EXEC** (консоль):
= Sw1(config)# line console 0
= Sw1(config-line)# password cisco
= Sw1(config-line)# login
Защита **привилегированного EXEC**:
= Sw1(config)# enable secret class
Защита удалённого доступа **VTY** (Telnet или SSH), линии с 0 по 15 — 16 линий:
= Sw1(config)# line vty 0 15
= Sw1(config-line)# password cisco
= Sw1(config-line)# login
## Шифрование паролей и баннер
В файлах конфигурации большинство паролей видны открытым текстом. Эта команда шифрует все открытые пароли:
= Sw1(config)# service password-encryption
Баннер предупреждает посторонних. **#** — **символ-разделитель**, он ставится до и после сообщения:
= Sw1(config)# banner motd #Authorized access only!#
| Защищает | Команды |
|---|---|
| Консоль (пользовательский EXEC) | line console 0 → password … → login |
| Привилегированный EXEC | enable secret … |
| Удалённый Telnet/SSH | line vty 0 15 → password … → login |
| Все открытые пароли | service password-encryption |
## Два файла конфигурации
- **running-config** — хранится в **RAM**. Это текущая конфигурация; изменения действуют сразу. RAM **энергозависима** и теряет содержимое при выключении или перезагрузке.
- **startup-config** — хранится в **NVRAM**. Используется при запуске или перезагрузке и переживает выключение.
Сохранение текущей конфигурации:
= Sw1# copy running-config startup-config
@diagram config-files
## Откат изменений
- Ещё не сохранено: убрать команды по одной или выполнить **reload** (устройство ненадолго уйдёт из сети).
- Уже сохранено: **erase startup-config**, затем **reload**, чтобы очистить running-config из RAM.
- **show running-config** и **show startup-config** показывают файлы; терминальная программа может записать их в текстовый файл как резервную копию.
## Сохранение конфигурации в текстовый файл
- Открой терминальную программу (PuTTY или Tera Term), уже подключённую к коммутатору.
- Включи в ней **запись журнала (logging)** и выбери имя и место файла.
- Выполни **show running-config** или **show startup-config** в привилегированном EXEC — текст попадёт в файл.
- Выключи запись. Файл — это запись конфигурации; перед восстановлением устройства его может понадобиться отредактировать.
> RAM = running, NVRAM = startup. «copy running-config startup-config» вводится в приглашении #.
?? Ты настроил имя и пароли, потом коммутатор обесточили. Всё пропало. Что ты забыл?
?= copy running-config startup-config — running-config живёт в RAM и теряется при выключении.
?? Какая команда делает так, что в конфигурации пароли показываются зашифрованными?
?= service password-encryption (режим глобальной конфигурации).`,
      },
      [
        q("Which command saves running-config from RAM to NVRAM?", "copy running-config startup-config", ["save config-file", "write memory startup", "copy startup-config running-config"], "copy running-config startup-config writes the current configuration from RAM to NVRAM.", "copy running-config startup-config записывает текущую конфигурацию из RAM в NVRAM."),
        q("Which command encrypts stored cleartext passwords in Cisco IOS?", "service password-encryption", ["enable secret level 7", "crypto key generate rsa", "ip security encryption"], "service password-encryption encrypts all plaintext passwords in the configuration files.", "service password-encryption шифрует все открытые пароли в файлах конфигурации."),
        q("Where is the running-config stored?", "RAM", ["NVRAM", "Flash", "ROM"], "The running-config lives in volatile RAM; the startup-config lives in NVRAM.", "running-config хранится в энергозависимой RAM; startup-config — в NVRAM."),
        q("What happens to unsaved configuration changes when a switch loses power?", "They are lost", ["They are kept in NVRAM", "They move to flash memory", "They are restored on boot"], "RAM is volatile, so an unsaved running-config disappears on power-off.", "RAM энергозависима, поэтому несохранённый running-config пропадает при выключении."),
        q("Which command secures access to privileged EXEC mode?", "enable secret class", ["line console 0", "password class", "login local"], "enable secret sets the password asked when entering privileged EXEC.", "enable secret задаёт пароль, который спрашивается при входе в привилегированный EXEC."),
        q("Which lines are configured to secure remote Telnet and SSH access?", "line vty 0 15", ["line console 0", "line aux 0", "interface vlan 1"], "VTY lines enable remote access; many Cisco switches have 16 of them, numbered 0 to 15.", "Линии VTY дают удалённый доступ; у многих коммутаторов Cisco их 16, с 0 по 15."),
        q("In 'banner motd #Keep out#', what is the '#' character called?", "The delimiting character", ["The privileged prompt", "The comment marker", "The escape sequence"], "The delimiting character is entered before and after the message.", "Символ-разделитель ставится до и после сообщения."),
        q("Unwanted changes were already saved to the startup-config. How do you return to a clean device?", "erase startup-config, then reload", ["copy running-config startup-config", "no hostname, then exit", "service password-encryption"], "Erase the saved file and reload to clear the running-config from RAM.", "Сотри сохранённый файл и перезагрузи устройство, чтобы очистить running-config из RAM."),
        q("Which hostname follows the Cisco naming guidelines?", "Sw-Floor-1", ["1st-Switch", "Sw Floor 1", "Switch_Floor-"], "A name starts with a letter, has no spaces, ends with a letter or digit and uses only letters, digits and dashes.", "Имя начинается с буквы, не содержит пробелов, кончается буквой или цифрой и состоит только из букв, цифр и дефисов."),
        tf("After 'password cisco' on the console line, the 'login' command is needed to make the device ask for the password.", true, "login enables password checking on the line; without it the password is not requested.", "login включает проверку пароля на линии; без неё пароль не спрашивается."),
      ],
    ),
  ],
};
