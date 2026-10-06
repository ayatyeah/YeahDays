import { qx, tfx, type Draft } from "../../types";

/** Лекция 1, часть 1 — компоненты сети и типы сетей. Разбор «до косточек». */
export const deepL1P1: Draft[] = [
  qx("Where does a network message originate or get received?", "At an end device", [
    ["At an intermediary device", "Switches and routers only forward messages between end devices; they do not originate or finally receive them.", "Коммутаторы и маршрутизаторы лишь передают сообщения между конечными устройствами, а не создают и не принимают их."],
    ["Inside the network media", "Media (copper, fiber, wireless) only carry the message between source and destination.", "Среда передачи (медь, оптика, радио) лишь несёт сообщение от источника к получателю."],
    ["At the service provider", "A service provider administers WAN links; it is not the endpoint where a user's message starts or ends.", "Провайдер управляет каналами WAN, а не является точкой, где сообщение пользователя начинается или заканчивается."],
  ], "An end device, or host, is where a message originates or where it is received.", "Конечное устройство (хост) — это то, откуда сообщение отправляется или где оно принимается."),

  qx("Which group of devices provides information to end devices?", "Email, web and file servers", [
    ["Switches, routers and firewalls", "These are intermediary devices: they interconnect hosts but do not serve email, pages or files.", "Это промежуточные устройства: они соединяют хосты, но не отдают почту, страницы или файлы."],
    ["Clients requesting web pages", "Clients request information from servers; they consume it rather than provide it.", "Клиенты запрашивают информацию у серверов — они её получают, а не отдают."],
    ["Copper, fiber and wireless media", "Media only carry the signal; they do not store or provide any information.", "Среда передачи лишь несёт сигнал и сама никакой информации не хранит и не отдаёт."],
  ], "Servers provide information to end devices; the lecture names email, web and file servers.", "Серверы отдают информацию конечным устройствам; в лекции названы почтовые, веб- и файловые серверы."),

  qx("A laptop requests a web page from another computer. In this exchange the laptop acts as a...", "Client", [
    ["Server", "The server is the computer that provides the web page; the laptop is asking for it.", "Сервер — тот, кто отдаёт страницу; ноутбук же её запрашивает."],
    ["Intermediary device", "An intermediary device forwards traffic between hosts; the laptop is the source of the request.", "Промежуточное устройство передаёт трафик между хостами; ноутбук — источник запроса."],
    ["Network medium", "The medium is the cable or radio link carrying the request, not the device that sends it.", "Среда — это кабель или радиоканал, несущий запрос, а не устройство, которое его отправляет."],
  ], "Clients send requests to servers to retrieve information such as a web page.", "Клиенты отправляют серверам запросы, чтобы получить информацию, например веб-страницу."),

  qx("In which type of network is a single device both a client and a server at the same time?", "Peer-to-peer network", [
    ["Client-server network", "In a client-server network the roles are separated: dedicated servers answer requests from clients.", "В клиент-серверной сети роли разделены: выделенные серверы отвечают на запросы клиентов."],
    ["Extranet", "An extranet is about who gets access (people from another organization), not about shared client/server roles.", "Экстранет — про то, кому даётся доступ (людям из другой организации), а не про совмещение ролей клиента и сервера."],
    ["Wide area network", "A WAN is defined by its wide geographical area, not by devices playing both roles.", "WAN определяется большой территорией, а не тем, что устройства играют обе роли."],
  ], "In a peer-to-peer network one device is both client and server, with no dedicated server.", "В одноранговой сети одно устройство — и клиент, и сервер, без выделенного сервера."),

  qx("Which is an advantage of a peer-to-peer network?", "It is cheaper and easy to set up", [
    ["It has centralized administration", "Peer-to-peer has no centralized administration; that is listed as one of its disadvantages.", "В одноранговой сети нет централизованного управления — это один из её недостатков."],
    ["It scales to thousands of hosts", "Peer-to-peer is not scalable and suits only very small networks.", "Одноранговая сеть не масштабируется и годится лишь для очень маленьких сетей."],
    ["It is more secure than client-server", "The lecture lists lower security as a disadvantage of peer-to-peer networks.", "В лекции меньшая безопасность названа недостатком одноранговых сетей."],
  ], "Peer-to-peer is easy to set up, less complex and cheaper; its downsides are no central administration, less security, no scalability and slower performance.", "Одноранговая сеть проста в настройке, менее сложна и дешевле; минусы — нет центрального управления, меньше безопасности, нет масштабируемости и ниже скорость."),

  qx("For which situation does the lecture recommend a peer-to-peer network?", "A very small network", [
    ["A campus with hundreds of users", "Peer-to-peer is not scalable and gets slower, so it is unsuitable for hundreds of users.", "Одноранговая сеть не масштабируется и работает медленнее, поэтому для сотен пользователей не подходит."],
    ["A network needing central control", "Peer-to-peer has no centralized administration, so it cannot provide central control.", "В одноранговой сети нет централизованного управления, так что центральный контроль она не даёт."],
    ["A network that needs strong security", "Peer-to-peer is less secure than a client-server design.", "Одноранговая сеть менее безопасна, чем клиент-серверная."],
  ], "Because it is not scalable, less secure and slower, peer-to-peer suits only very small networks.", "Из-за отсутствия масштабируемости, меньшей безопасности и скорости одноранговая сеть годится только для очень маленьких сетей."),

  qx("Which list contains only intermediary devices?", "Switch, access point, router, firewall", [
    ["Web server, switch, router, printer", "A web server and a printer are end devices (hosts), not intermediary devices.", "Веб-сервер и принтер — конечные устройства (хосты), а не промежуточные."],
    ["Laptop, access point, firewall, IP phone", "A laptop and a phone are hosts where messages originate; only the access point and firewall are intermediary.", "Ноутбук и телефон — хосты, где сообщения рождаются; промежуточные здесь только точка доступа и межсетевой экран."],
    ["Switch, router, copper cable, fiber", "Copper cable and fiber are network media, not devices.", "Медный кабель и оптоволокно — среда передачи, а не устройства."],
  ], "The lecture names switches, wireless access points, routers and firewalls as intermediary devices.", "В лекции промежуточными устройствами названы коммутаторы, точки доступа, маршрутизаторы и межсетевые экраны."),

  qx("Which task is performed by an intermediary device?", "Regenerating and retransmitting signals", [
    ["Originating user messages", "Messages originate at end devices; intermediary devices only pass them along.", "Сообщения рождаются на конечных устройствах; промежуточные лишь передают их дальше."],
    ["Providing web pages to requesting clients", "Serving web pages is the job of a web server, which is an end device.", "Отдавать веб-страницы — работа веб-сервера, а это конечное устройство."],
    ["Carrying signals as pulses of light", "Carrying light pulses is what fiber-optic media does, not a device function.", "Нести световые импульсы — задача оптоволоконной среды, а не функция устройства."],
  ], "An intermediary device regenerates and retransmits signals, keeps pathway information and notifies others of errors.", "Промежуточное устройство восстанавливает и передаёт сигнал, хранит сведения о путях и сообщает другим об ошибках."),

  qx("Which statement about intermediary devices is true?", "They keep information about network pathways", [
    ["They are where messages originate", "Messages originate at end devices, not at switches or routers.", "Сообщения рождаются на конечных устройствах, а не на коммутаторах и маршрутизаторах."],
    ["They never notify any other devices of errors", "Notifying other devices of errors is one of the three listed functions of an intermediary device.", "Сообщать другим устройствам об ошибках — одна из трёх названных функций промежуточного устройства."],
    ["They carry data as electromagnetic waves", "Modulated electromagnetic waves are the wireless medium, not something a device 'is'.", "Модулированные электромагнитные волны — это беспроводная среда, а не свойство устройства."],
  ], "Intermediary devices maintain information about the pathways that exist through the network and notify other devices of errors.", "Промежуточные устройства хранят сведения о путях в сети и сообщают другим устройствам об ошибках."),

  qx("Which medium carries a message as a modulation of electromagnetic waves?", "Wireless", [
    ["Metal wires in cables", "Metal wires carry electrical impulses, not modulated radio waves.", "Металлические провода несут электрические импульсы, а не модулированные радиоволны."],
    ["Glass fibers", "Glass fibers carry pulses of light.", "Стеклянные волокна несут импульсы света."],
    ["Plastic fibers", "Plastic fibers, like glass ones, carry pulses of light in a fiber-optic cable.", "Пластиковые волокна, как и стеклянные, несут импульсы света в оптоволоконном кабеле."],
  ], "Wireless transmission encodes the message by modulating electromagnetic waves.", "Беспроводная передача кодирует сообщение модуляцией электромагнитных волн."),

  qx("Which pairing of medium and signal type is correct?", "Fiber-optic cable — pulses of light", [
    ["Metal wires — pulses of light", "Metal wires carry electrical impulses; light pulses travel in glass or plastic fibers.", "Металлические провода несут электрические импульсы; импульсы света идут по стеклянным или пластиковым волокнам."],
    ["Wireless — electrical impulses", "Wireless uses modulation of electromagnetic waves, not electrical impulses in a conductor.", "Беспроводная связь использует модуляцию электромагнитных волн, а не электрические импульсы в проводнике."],
    ["Fiber-optic cable — modulated radio waves", "Fiber carries light, not radio waves; radio waves belong to wireless media.", "Оптоволокно несёт свет, а не радиоволны; радиоволны — это беспроводная среда."],
  ], "Metal wires carry electrical impulses, fibers carry pulses of light, and wireless uses electromagnetic waves.", "Металл несёт электрические импульсы, волокна — импульсы света, беспроводная среда — электромагнитные волны."),

  qx("Which two terms are often used interchangeably when talking about network devices?", "Port and interface", [
    ["Host and switch", "A host is an end device, a switch is an intermediary device; they are different roles.", "Хост — конечное устройство, коммутатор — промежуточное; это разные роли."],
    ["NIC and router", "A NIC is a card inside a host; a router is a separate intermediary device.", "Сетевая карта стоит внутри хоста; маршрутизатор — отдельное промежуточное устройство."],
    ["Medium and topology", "Media are the physical carriers of signals; topology is how the network is laid out.", "Среда — физический носитель сигнала; топология — то, как сеть устроена."],
  ], "The lecture notes that the terms port and interface are often used interchangeably.", "В лекции отмечено, что термины «порт» и «интерфейс» часто означают одно и то же."),

  qx("What does the abbreviation NIC stand for?", "Network Interface Card", [
    ["Network Internet Connection", "NIC refers to the hardware card in a host, not to an internet connection.", "NIC — это аппаратная карта в хосте, а не подключение к интернету."],
    ["Node Identification Code", "There is no such term in the lecture; the NIC is a physical component, not a code.", "Такого термина в лекции нет; NIC — физический компонент, а не код."],
    ["Network Infrastructure Controller", "A NIC does not control the infrastructure; it connects a single host to the medium.", "Сетевая карта не управляет инфраструктурой — она подключает один хост к среде."],
  ], "NIC is the Network Interface Card, the component that gives a host its physical port.", "NIC — сетевая карта (Network Interface Card), компонент, дающий хосту физический порт."),

  qx("Which diagram shows where intermediary devices are placed and how cables are installed?", "Physical topology diagram", [
    ["Logical topology diagram", "The logical diagram shows devices, ports and the addressing scheme, not room locations or cable runs.", "Логическая схема показывает устройства, порты и адресацию, а не расположение в помещениях и прокладку кабелей."],
    ["Addressing scheme spreadsheet", "An addressing scheme lists addresses; it is part of the logical view, not of cable installation.", "Схема адресации перечисляет адреса; это часть логического представления, а не прокладки кабелей."],
    ["Service provider map", "Service providers administer WANs; their map is not what the lecture calls a topology diagram.", "Провайдеры управляют WAN; их карта — не то, что в лекции называется схемой топологии."],
  ], "A physical topology diagram shows the physical location of intermediary devices and the cable installation.", "Схема физической топологии показывает физическое расположение промежуточных устройств и прокладку кабелей."),

  qx("An admin opens a diagram listing device names, port numbers and IP addresses. What kind of diagram is it?", "A logical topology diagram", [
    ["A physical topology diagram", "A physical diagram shows locations and cabling, not the addressing scheme.", "Физическая схема показывает расположение и кабели, а не схему адресации."],
    ["A cable installation plan", "Cable installation belongs to the physical topology, while addresses belong to the logical one.", "Прокладка кабелей относится к физической топологии, а адреса — к логической."],
    ["A rack location diagram", "Rack locations describe where hardware physically sits, which is physical, not logical, information.", "Расположение в стойках описывает, где физически стоит оборудование — это физическая, а не логическая информация."],
  ], "A logical topology diagram shows devices, ports and the addressing scheme.", "Схема логической топологии показывает устройства, порты и схему адресации."),

  qx("Which network size category connects a few computers to each other and to the internet?", "Small home network", [
    ["SOHO network", "A SOHO network's defining feature is connecting home or remote-office computers to a corporate network.", "Отличительная черта SOHO — подключение компьютеров дома или в удалённом офисе к корпоративной сети."],
    ["Medium to large network", "Medium to large networks have many locations with hundreds or thousands of computers.", "Средние и крупные сети — это много площадок с сотнями и тысячами компьютеров."],
    ["World wide network", "A world wide network such as the internet connects hundreds of millions of computers.", "Всемирная сеть, такая как интернет, соединяет сотни миллионов компьютеров."],
  ], "Small home networks connect a few computers to each other and to the internet.", "Малые домашние сети соединяют несколько компьютеров между собой и с интернетом."),

  qx("What is the purpose of a SOHO network?", "Connect a remote office to a corporate network", [
    ["Connect hundreds of millions of computers worldwide", "That describes a world wide network such as the internet.", "Это описание всемирной сети, например интернета."],
    ["Link thousands of computers at many sites", "Many sites with thousands of computers is a medium to large network.", "Много площадок с тысячами компьютеров — это средняя или крупная сеть."],
    ["Connect a few home PCs to each other", "Connecting a few PCs to each other and the internet is a small home network, not SOHO.", "Соединить несколько ПК между собой и с интернетом — это малая домашняя сеть, а не SOHO."],
  ], "A small office / home office network lets computers in a home or remote office connect to a corporate network.", "Сеть малого или домашнего офиса позволяет компьютерам дома или в удалённом офисе подключаться к корпоративной сети."),

  qx("A company has many locations with thousands of interconnected computers. Which size category is this?", "Medium to large network", [
    ["Small home network", "A home network connects only a few computers.", "Домашняя сеть соединяет лишь несколько компьютеров."],
    ["SOHO network", "SOHO is a single home or remote office reaching a corporate network, not many locations.", "SOHO — один дом или удалённый офис с выходом в корпоративную сеть, а не много площадок."],
    ["World wide network", "World wide networks connect hundreds of millions of computers, far more than one company.", "Всемирные сети соединяют сотни миллионов компьютеров — куда больше, чем одна компания."],
  ], "Medium to large networks span many locations with hundreds or thousands of interconnected computers.", "Средние и крупные сети охватывают много площадок с сотнями и тысячами связанных компьютеров."),

  qx("Which network connects hundreds of millions of computers?", "The internet, a world wide network", [
    ["A medium to large network", "Medium to large networks reach hundreds or thousands of computers, not hundreds of millions.", "Средние и крупные сети охватывают сотни и тысячи компьютеров, а не сотни миллионов."],
    ["A small office / home office network", "A SOHO network serves one home or remote office.", "Сеть SOHO обслуживает один дом или удалённый офис."],
    ["A small home network", "A small home network connects just a few computers.", "Малая домашняя сеть соединяет всего несколько компьютеров."],
  ], "World wide networks connect hundreds of millions of computers; the internet is the example.", "Всемирные сети соединяют сотни миллионов компьютеров; пример — интернет."),

  qx("Network infrastructures differ in the area covered, the number of users, the services offered and...", "The area of responsibility", [
    ["The vendor of the equipment", "The lecture's list of differences does not mention equipment vendors.", "В перечне различий из лекции производитель оборудования не упоминается."],
    ["The operating system of the hosts", "Host operating systems are not one of the four listed infrastructure differences.", "Операционные системы хостов не входят в четыре названных различия инфраструктур."],
    ["The length of device hostnames", "Hostname length is a configuration detail, not a property of a network infrastructure.", "Длина имени устройства — деталь настройки, а не свойство сетевой инфраструктуры."],
  ], "Infrastructures differ in size of area, number of users, number and types of services, and area of responsibility.", "Инфраструктуры различаются размером территории, числом пользователей, числом и видами сервисов и зоной ответственности."),

  qx("Which statement about a LAN is true?", "It is administered by one organization or individual", [
    ["It is run by one or more service providers", "Service providers typically administer WANs, not LANs.", "Провайдеры обычно управляют WAN, а не LAN."],
    ["It interconnects LANs across wide regions", "Interconnecting LANs over a wide area is the role of a WAN.", "Соединять LAN на большой территории — роль WAN."],
    ["It usually has slower links than a WAN", "A LAN gives high-speed bandwidth to internal devices; WAN links are usually the slower ones.", "LAN даёт внутренним устройствам высокую скорость; медленнее обычно каналы WAN."],
  ], "A LAN spans a small area, is administered by a single organization or individual and provides high-speed bandwidth.", "LAN охватывает небольшую территорию, управляется одной организацией или человеком и даёт высокую скорость."),

  qx("Which statement correctly describes a WAN?", "It interconnects LANs over a wide geographical area", [
    ["It spans a single building or campus", "A small, limited area is the definition of a LAN.", "Небольшая ограниченная территория — это определение LAN."],
    ["It gives high-speed bandwidth to internal hosts", "High-speed internal bandwidth is a LAN property; WAN links are usually slower.", "Высокая внутренняя скорость — свойство LAN; каналы WAN обычно медленнее."],
    ["It is administered by a single home user", "A WAN is typically administered by one or more service providers.", "WAN обычно управляется одним или несколькими провайдерами."],
  ], "A WAN spans a wide geographical area, interconnects LANs and is typically run by service providers with slower links.", "WAN охватывает большую территорию, соединяет LAN и обычно управляется провайдерами с более медленными каналами."),

  qx("In the LAN/WAN comparison table, which row is correct?", "Role: LAN connects end devices, WAN connects LANs", [
    ["Speed: LAN slower, WAN high bandwidth", "It is the other way round: the LAN has high bandwidth inside, WAN links are usually slower.", "Наоборот: внутри LAN скорость высокая, а каналы WAN обычно медленнее."],
    ["Area: LAN wide, WAN small and limited", "A LAN covers a small, limited area; the WAN covers the wide geographical one.", "LAN охватывает небольшую ограниченную территорию; большая географическая — у WAN."],
    ["Administered by: LAN providers, WAN one person", "The LAN is run by one organization or person; providers run the WAN.", "LAN управляет одна организация или человек; провайдеры управляют WAN."],
  ], "The table says a LAN connects end devices while a WAN connects LANs; LAN is small and fast, WAN wide and slower.", "По таблице LAN соединяет конечные устройства, а WAN — локальные сети; LAN маленькая и быстрая, WAN большая и медленнее."),

  qx("What is the internet?", "A worldwide collection of interconnected LANs and WANs", [
    ["A single giant LAN owned and run by ICANN", "The internet is not one LAN and nobody owns it; ICANN only helps maintain its structure.", "Интернет — не одна LAN, и у него нет владельца; ICANN лишь помогает поддерживать его структуру."],
    ["The private LANs and WANs of one organization", "A private collection for one organization's members is an intranet, not the internet.", "Частное объединение для сотрудников одной организации — это интранет, а не интернет."],
    ["One WAN administered by a single service provider", "The internet consists of many LANs and WANs run by many parties, not one provider's WAN.", "Интернет состоит из множества LAN и WAN разных владельцев, а не из одной WAN одного провайдера."],
  ], "The internet is a worldwide collection of interconnected LANs and WANs that nobody owns.", "Интернет — всемирное объединение связанных LAN и WAN, которое никому не принадлежит."),

  qx("Which organizations help maintain the structure of the internet?", "IETF, ICANN and IAB", [
    ["Cisco, Microsoft and Apple", "These are equipment and software vendors; they do not maintain the internet's structure.", "Это производители оборудования и ПО; они не поддерживают структуру интернета."],
    ["Cable TV, DSL and cellular providers", "Providers sell access connections; they do not govern the internet's structure.", "Провайдеры продают подключения; структурой интернета они не управляют."],
    ["The UN, the EU and the US government", "No government or union owns or runs the internet; the lecture names IETF, ICANN and IAB.", "Ни правительство, ни союз не владеют интернетом; в лекции названы IETF, ICANN и IAB."],
  ], "Nobody owns the internet; IETF, ICANN and IAB help maintain its structure.", "Интернет никому не принадлежит; поддерживать его структуру помогают IETF, ICANN и IAB."),

  tfx("The internet is owned by the service providers that operate its WANs.", false,
    "Nobody owns the internet; providers run individual WANs, while IETF, ICANN and IAB help maintain the overall structure.",
    "Интернет никому не принадлежит; провайдеры управляют отдельными WAN, а IETF, ICANN и IAB помогают поддерживать общую структуру.",
    "Answering True confuses administering a WAN with owning the internet; running links does not make a provider the owner of the whole.",
    "Ответ «верно» путает управление WAN с владением интернетом: обслуживание каналов не делает провайдера владельцем целого."),

  qx("A private collection of LANs and WANs for the members of one organization is called...", "An intranet", [
    ["An extranet", "An extranet gives access to people who work for a different organization.", "Экстранет даёт доступ людям, работающим в другой организации."],
    ["The internet", "The internet is public and worldwide; it is not private to one organization.", "Интернет публичный и всемирный, он не принадлежит одной организации."],
    ["A peer-to-peer network", "Peer-to-peer describes devices acting as both client and server, not who may access the network.", "Одноранговая сеть — про устройства, совмещающие роли клиента и сервера, а не про то, кому открыт доступ."],
  ], "An intranet is a private collection of LANs and WANs for the members of one organization.", "Интранет — частное объединение LAN и WAN для сотрудников одной организации."),

  qx("A supplier's employees need secure access to part of your company network. Which term fits?", "Extranet", [
    ["Intranet", "An intranet is for your own organization's members only, not for outside employees.", "Интранет — только для сотрудников вашей организации, а не для людей извне."],
    ["Internet", "The internet is public; it does not describe controlled, secure access for a partner.", "Интернет публичен; он не описывает контролируемый защищённый доступ для партнёра."],
    ["Local area network", "A LAN is defined by its small area and single owner, not by granting outsiders access.", "LAN определяется небольшой территорией и одним владельцем, а не предоставлением доступа посторонним."],
  ], "An extranet provides secure access to people who work for a different organization.", "Экстранет даёт защищённый доступ людям, работающим в другой организации."),

  qx("What is the key difference between an intranet and an extranet?", "Who the users are: own members or outsiders", [
    ["Speed: intranet fast, extranet slow", "Speed is a LAN versus WAN property, not what separates intranet from extranet.", "Скорость различает LAN и WAN, а не интранет и экстранет."],
    ["Size: intranet small, extranet wide", "Both can include LANs and WANs; the distinction is about users, not geography.", "Оба могут включать LAN и WAN; разница — в пользователях, а не в географии."],
    ["Media: intranet wired, extranet wireless", "The medium used has nothing to do with the intranet/extranet distinction.", "Среда передачи никак не связана с различием интранета и экстранета."],
  ], "An intranet serves one organization's own members; an extranet gives secure access to people from a different organization.", "Интранет — для сотрудников своей организации; экстранет даёт защищённый доступ людям из другой организации."),

  qx("Which home internet connection is offered by the cable television provider?", "Cable", [
    ["DSL", "DSL comes from the telephone company and runs over a telephone line.", "DSL приходит от телефонной компании и идёт по телефонной линии."],
    ["Dial-up", "Dial-up uses a modem over the phone line; it is cheap and low bandwidth.", "Dial-up работает через модем по телефонной линии; дёшево и медленно."],
    ["Satellite", "Satellite service is for rural areas without a wired provider, not from the cable TV company.", "Спутник — для сельской местности без проводного провайдера, а не от кабельного ТВ."],
  ], "Cable internet is offered by cable TV providers and is always on.", "Кабельный интернет предлагают провайдеры кабельного ТВ, он всегда включён."),

  qx("A home user has an always-on connection that runs over the telephone line. Which is it?", "DSL", [
    ["Cable", "Cable uses the cable TV provider's coaxial network, not the telephone line.", "Кабель использует сеть провайдера кабельного ТВ, а не телефонную линию."],
    ["Cellular", "Cellular access uses the mobile phone network, not a wired telephone line.", "Сотовый доступ идёт через сеть мобильного оператора, а не по проводной телефонной линии."],
    ["Dial-up", "Dial-up also uses the phone line but is not always on and has low bandwidth.", "Dial-up тоже идёт по телефонной линии, но не постоянно включён и имеет низкую скорость."],
  ], "DSL is an always-on connection over a telephone line; SDSL is its business variant.", "DSL — постоянное подключение по телефонной линии; SDSL — его бизнес-вариант."),

  qx("Which connection option is most useful in rural areas where no wired provider exists?", "Satellite", [
    ["Cable", "Cable requires the cable TV provider's wiring to reach the home.", "Кабель требует, чтобы до дома дошла проводка провайдера кабельного ТВ."],
    ["DSL", "DSL needs a telephone line from a provider, which rural areas may lack.", "DSL нужна телефонная линия провайдера, которой в селе может не быть."],
    ["Leased line", "A leased line is a business circuit between offices, not a rural home option.", "Арендованная линия — бизнес-канал между офисами, а не вариант для сельского дома."],
  ], "Satellite works where there is no wired provider, which makes it useful in rural areas.", "Спутник работает там, где нет проводного провайдера, поэтому выручает в сельской местности."),

  qx("Which connection is cheap, uses a modem and offers low bandwidth?", "Dial-up", [
    ["Cable", "Cable is an always-on, higher-bandwidth connection from the cable TV provider.", "Кабель — постоянное высокоскоростное подключение от провайдера кабельного ТВ."],
    ["DSL", "DSL is always on with higher bandwidth than dial-up, even though both use the phone line.", "DSL всегда включён и быстрее dial-up, хотя оба используют телефонную линию."],
    ["Ethernet WAN", "Ethernet WAN is a business service that stretches LAN technology over the WAN.", "Ethernet WAN — бизнес-услуга, растягивающая технологию LAN на WAN."],
  ], "Dial-up is cheap and low bandwidth and uses a modem.", "Dial-up — дёшево, низкая скорость, работает через модем."),

  qx("Which row of the connection table is correct?", "Cellular — uses the cell phone network", [
    ["Satellite — over a telephone line", "Satellite does not use a telephone line; DSL and dial-up do.", "Спутник не использует телефонную линию; её используют DSL и dial-up."],
    ["Dial-up — always on, high bandwidth", "Dial-up is cheap and low bandwidth; always-on describes cable and DSL.", "Dial-up дёшев и медленен; «всегда включено» — это про кабель и DSL."],
    ["Cable — reserved circuit between offices", "A reserved circuit between offices is a leased line, not cable TV internet.", "Зарезервированный канал между офисами — это арендованная линия, а не кабельный интернет."],
  ], "Cellular internet access uses the cell phone network and suits home and mobile use.", "Сотовый доступ в интернет идёт через сеть мобильного оператора и подходит дома и в дороге."),

  qx("A company wants a reserved circuit in the provider's network between two offices. Which option?", "Dedicated leased line", [
    ["Ethernet WAN", "Ethernet WAN extends LAN technology into the WAN; it is not defined as a reserved circuit.", "Ethernet WAN продлевает технологию LAN в WAN; это не определяется как зарезервированный канал."],
    ["SDSL", "SDSL is business DSL over a telephone line, not a dedicated circuit between offices.", "SDSL — бизнес-DSL по телефонной линии, а не выделенный канал между офисами."],
    ["Cable from the TV provider", "Cable is a home connection from the cable TV provider.", "Кабель — домашнее подключение от провайдера кабельного ТВ."],
  ], "A dedicated leased line is a reserved circuit in the provider's network linking distant offices.", "Выделенная арендованная линия — зарезервированный канал в сети провайдера между удалёнными офисами."),

  qx("Which business connection extends LAN technology into the WAN?", "Ethernet WAN", [
    ["Dedicated leased line", "A leased line is a reserved circuit, not LAN technology stretched over distance.", "Арендованная линия — зарезервированный канал, а не технология LAN на расстоянии."],
    ["SDSL", "SDSL is a DSL variant over a telephone line.", "SDSL — вариант DSL по телефонной линии."],
    ["Satellite", "Satellite is a wireless link for areas without wired providers.", "Спутник — беспроводной канал для мест без проводных провайдеров."],
  ], "Ethernet WAN extends LAN access technology into the WAN.", "Ethernet WAN продлевает технологию LAN в глобальную сеть."),

  qx("SDSL is an example of which kind of business connection?", "Business DSL", [
    ["Satellite service", "Satellite has nothing to do with DSL; it is a wireless link.", "Спутник никак не связан с DSL; это беспроводной канал."],
    ["Cellular service", "Cellular uses the mobile network; SDSL runs over a telephone line.", "Сотовая связь использует мобильную сеть; SDSL идёт по телефонной линии."],
    ["Dial-up service", "Dial-up is a low-bandwidth home connection with a modem, not a business DSL variant.", "Dial-up — низкоскоростное домашнее подключение через модем, а не бизнес-вариант DSL."],
  ], "The lecture lists SDSL as an example of business DSL.", "В лекции SDSL назван примером бизнес-DSL."),

  tfx("An extranet is for an organization's own staff, while an intranet is for partners from outside.", false,
    "It is the reverse: the intranet serves the organization's own members, the extranet gives secure access to people from a different organization.",
    "Всё наоборот: интранет — для своих сотрудников, экстранет даёт защищённый доступ людям из другой организации.",
    "Marking this True swaps the two terms; remember the callout: intranet — own staff, extranet — partners from outside.",
    "Ответ «верно» меняет термины местами; запомни: интранет — свои сотрудники, экстранет — партнёры извне."),
];
