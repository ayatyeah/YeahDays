import { qx, tfx, type Draft } from "../../types";

export const deepL4P1: Draft[] = [
  qx("Communication between which components is the data link layer responsible for?", "Network interface cards of end devices", [
    ["Applications running on two different hosts", "Application-to-application communication is the job of the upper layers, not Layer 2.", "Связь между приложениями — задача верхних уровней, а не уровня 2."],
    ["Routers located in different IP networks", "Communication across IP networks is a Layer 3 routing task; Layer 2 works on one link.", "Связь между IP-сетями — задача маршрутизации уровня 3; уровень 2 работает на одном участке."],
    ["Transport layer ports on the same host", "Ports belong to the transport layer (Layer 4), which the data link layer never sees.", "Порты относятся к транспортному уровню (4), канальный уровень их не видит."],
  ], "The data link layer is responsible for communication between end-device network interface cards.", "Канальный уровень отвечает за связь между сетевыми картами конечных устройств."),

  qx("What does the data link layer do with a Layer 3 packet before it goes onto the media?", "Encapsulates it into a Layer 2 frame", [
    ["Splits it into Layer 4 segments", "Segmentation happens at the transport layer before the packet even exists.", "Сегментация происходит на транспортном уровне ещё до появления пакета."],
    ["Encrypts it with a shared session key", "Encryption is not a data link layer service described in the notes.", "Шифрование не относится к услугам канального уровня по конспекту."],
    ["Rewrites its source IP address", "IP addresses are Layer 3 fields; Layer 2 adds its own header and trailer instead.", "IP-адреса — поля уровня 3; уровень 2 добавляет собственный заголовок и концевик."],
  ], "Layer 2 lets upper-layer protocols access the media by encapsulating Layer 3 packets into Layer 2 frames.", "Уровень 2 даёт верхним протоколам доступ к среде, упаковывая пакеты уровня 3 в кадры уровня 2."),

  qx("What does the data link layer do when it detects a corrupt frame?", "Rejects (discards) the frame", [
    ["Corrects the bits and passes it up", "Layer 2 only performs error detection; it does not correct the damaged bits.", "Уровень 2 только обнаруживает ошибки, а повреждённые биты не исправляет."],
    ["Asks the sender for a retransmission", "Retransmission is handled by upper layers such as TCP, not by the data link layer.", "Повторную передачу запрашивают верхние уровни (например, TCP), а не канальный."],
    ["Forwards it to the default gateway", "A corrupt frame is never forwarded anywhere; it is dropped on receipt.", "Повреждённый кадр никуда не пересылается — он отбрасывается при получении."],
  ], "The data link layer performs error detection and rejects corrupt frames.", "Канальный уровень обнаруживает ошибки и отбрасывает повреждённые кадры."),

  qx("Which two sublayers make up the data link layer?", "LLC and MAC", [
    ["LLC and PHY", "PHY is the physical layer, not a sublayer of the data link layer.", "PHY — это физический уровень, а не подуровень канального."],
    ["MAC and IP", "IP is a network layer protocol, one layer above the data link layer.", "IP — протокол сетевого уровня, на уровень выше канального."],
    ["ARP and MAC", "ARP is a protocol that resolves addresses; it is not a sublayer of Layer 2.", "ARP — протокол разрешения адресов, а не подуровень уровня 2."],
  ], "The data link layer is divided into the Logical Link Control and Media Access Control sublayers.", "Канальный уровень делится на подуровни LLC (управление логическим каналом) и MAC (управление доступом к среде)."),

  qx("Which IEEE standard defines the LLC sublayer?", "IEEE 802.2", [
    ["IEEE 802.3", "802.3 is Ethernet and belongs to the MAC sublayer, not LLC.", "802.3 — это Ethernet, он относится к подуровню MAC, а не LLC."],
    ["IEEE 802.11", "802.11 is wireless LAN, one of the MAC sublayer standards.", "802.11 — беспроводная сеть, один из стандартов подуровня MAC."],
    ["IEEE 802.15", "802.15 is a MAC sublayer standard (personal area networks), not LLC.", "802.15 — стандарт подуровня MAC (персональные сети), а не LLC."],
  ], "The Logical Link Control sublayer is defined in IEEE 802.2.", "Подуровень LLC определён в стандарте IEEE 802.2."),

  qx("What does the LLC sublayer place into the frame?", "Which network layer protocol is used", [
    ["The physical address of the sending node", "Data link addressing is a function of the MAC sublayer, not LLC.", "Канальная адресация — функция подуровня MAC, а не LLC."],
    ["The time the medium will be busy", "Announcing medium busy time belongs to CSMA/CA media access, not to LLC.", "Сообщение о времени занятости среды — это CSMA/CA, а не LLC."],
    ["The CRC value for error detection", "The error-detection field is part of MAC encapsulation, not of LLC.", "Поле обнаружения ошибок — часть инкапсуляции MAC, а не LLC."],
  ], "LLC places information in the frame that identifies which network layer protocol is being used.", "LLC помещает в кадр сведения о том, какой протокол сетевого уровня используется."),

  qx("Between which two things does the LLC sublayer communicate?", "Upper-layer software and the hardware", [
    ["Two network interface cards on one link", "Communication between NICs is the role of the data link layer as a whole, via MAC.", "Связь между картами — роль канального уровня в целом, через MAC."],
    ["The router and the switch of a LAN", "LLC is a software sublayer inside one device, not a link between two devices.", "LLC — программный подуровень внутри одного устройства, а не связь двух устройств."],
    ["The source and destination IP hosts", "End-to-end communication between hosts is Layer 3 and above, not LLC.", "Сквозная связь между хостами — уровень 3 и выше, а не LLC."],
  ], "LLC communicates between the networking software of the upper layers and the device hardware.", "LLC связывает сетевое ПО верхних уровней с оборудованием."),

  qx("Which standards belong to the MAC sublayer?", "IEEE 802.3, 802.11 and 802.15", [
    ["IEEE 802.2, 802.3 and 802.11", "802.2 is the LLC sublayer, so this list mixes LLC in with MAC standards.", "802.2 — это LLC, так что в список к MAC подмешан стандарт LLC."],
    ["IEEE 802.1, 802.2 and 802.5", "802.2 is LLC, and 802.1 and 802.5 are not the standards named in the notes.", "802.2 — это LLC, а 802.1 и 802.5 в конспекте не упоминаются."],
    ["ITU, ISO and ANSI documents only", "Those bodies define data link protocols in general; the MAC standards named are IEEE.", "Эти организации в целом определяют протоколы, но названные стандарты MAC — от IEEE."],
  ], "The MAC sublayer is defined by IEEE 802.3 (Ethernet), 802.11 (WLAN) and 802.15.", "Подуровень MAC описан в IEEE 802.3 (Ethernet), 802.11 (WLAN) и 802.15."),

  qx("Which functions does the MAC sublayer provide?", "Encapsulation, media access control, addressing", [
    ["Routing, IP addressing and packet fragmentation", "Those are network layer functions, not functions of the MAC sublayer.", "Это функции сетевого уровня, а не подуровня MAC."],
    ["Network layer protocol identification", "Identifying the network layer protocol is the job of LLC, not MAC.", "Определение протокола сетевого уровня — задача LLC, а не MAC."],
    ["Encoding bits into electrical signals", "Signalling is the physical layer, below the data link layer.", "Кодирование битов в сигналы — физический уровень, ниже канального."],
  ], "MAC is responsible for data encapsulation and media access control and provides data link layer addressing.", "MAC отвечает за инкапсуляцию данных и управление доступом к среде и даёт канальную адресацию."),

  qx("Which organizations define data link layer protocols?", "IEEE, ITU, ISO and ANSI", [
    ["IETF, ICANN, IANA and W3C", "Those bodies deal with Internet protocols, names and the web, not Layer 2 standards.", "Эти организации занимаются интернет-протоколами, именами и вебом, а не стандартами уровня 2."],
    ["IEEE, IETF, EIA and TIA", "The notes name IEEE, ITU, ISO and ANSI; IETF, EIA and TIA are not in that list.", "В конспекте названы IEEE, ITU, ISO и ANSI; IETF, EIA и TIA в списке нет."],
    ["ISO, ANSI, Cisco and Microsoft", "Cisco and Microsoft are vendors, not the standards organizations listed.", "Cisco и Microsoft — производители, а не организации по стандартизации из списка."],
  ], "Data link protocols are defined by the IEEE, ITU, ISO and ANSI.", "Протоколы канального уровня определяют IEEE, ITU, ISO и ANSI."),

  qx("What does the physical topology of a network describe?", "Physical connections between devices", [
    ["The IP addressing scheme in use", "IP addressing belongs to the logical topology, not the physical one.", "Схема IP-адресации относится к логической топологии, а не к физической."],
    ["The virtual paths that frames follow", "Virtual connections are what the logical topology describes.", "Виртуальные соединения описывает логическая топология."],
    ["The duplex mode of each interface", "Duplex is a property of a link, not a description of how devices are interconnected.", "Дуплекс — свойство канала, а не описание того, как устройства соединены."],
  ], "The physical topology shows the physical connections and how devices are interconnected.", "Физическая топология показывает физические соединения и то, как устройства связаны между собой."),

  qx("Which of these is part of a network's logical topology?", "Device interfaces and IP addressing scheme", [
    ["The cable runs between the access switches", "Cabling is a physical connection, so it belongs to the physical topology.", "Кабельные трассы — физические соединения, они относятся к физической топологии."],
    ["The location of each device in a rack", "Physical placement describes the physical topology, not the logical one.", "Физическое размещение описывает физическую топологию, а не логическую."],
    ["The type of connectors on the NICs", "Connectors are physical media details, not virtual connections.", "Разъёмы — детали физической среды, а не виртуальные соединения."],
  ], "The logical topology refers to virtual connections, using device interfaces and IP addressing schemes.", "Логическая топология — это виртуальные соединения, с интерфейсами устройств и схемой IP-адресации."),

  qx("Which WAN topology is described as the simplest and most common?", "Point-to-point", [
    ["Hub and spoke WAN", "Hub and spoke links a central site to branches; it is built from point-to-point links but is not the simplest.", "Hub and spoke связывает центр с филиалами; он строится из каналов «точка — точка», но не самый простой."],
    ["Mesh", "Mesh connects every end system to every other, so it is the most complex WAN topology, not the simplest.", "Mesh соединяет каждую систему с каждой — это самая сложная топология WAN, а не простейшая."],
    ["Extended star", "Extended star is a LAN topology, not one of the WAN topologies in the notes.", "Расширенная звезда — топология LAN, а не одна из топологий WAN в конспекте."],
  ], "Point-to-point is the simplest and most common WAN topology: a permanent link between two endpoints.", "«Точка — точка» — самая простая и распространённая топология WAN: постоянный канал между двумя точками."),

  qx("Why can point-to-point WAN protocols be very simple?", "The two nodes do not share media with other hosts", [
    ["The link always runs at the same fixed speed", "Speed is not the reason given; simplicity comes from having no other hosts on the media.", "Скорость здесь ни при чём; простота объясняется отсутствием других хостов в среде."],
    ["Only one node is allowed to transmit at any given time", "That describes half-duplex; point-to-point simplicity is about not sharing the media.", "Это описание полудуплекса; простота «точка — точка» — в том, что среда не делится."],
    ["The link uses a token to control media access", "Token passing is controlled access on Token Ring, not a feature of point-to-point WANs.", "Передача токена — управляемый доступ Token Ring, а не свойство WAN «точка — точка»."],
  ], "On a point-to-point link the two nodes do not share the media with other hosts, so the protocol needs no complex access control.", "На канале «точка — точка» два узла не делят среду с другими хостами, поэтому протоколу не нужно сложное управление доступом."),

  qx("A company connects its headquarters to each branch office with a separate point-to-point link. Which WAN topology is this?", "Hub and spoke", [
    ["Full mesh", "In a mesh every site would connect to every other site, not only to headquarters.", "В полносвязной топологии каждый филиал был бы соединён с каждым, а не только с центром."],
    ["Point-to-point", "A single point-to-point link joins two endpoints; here one central site has many links.", "Один канал «точка — точка» соединяет две точки; здесь у центра много каналов."],
    ["Bus", "Bus is a legacy LAN topology where devices are chained on one cable, not a WAN design.", "Шина — старая топология LAN с устройствами на одном кабеле, а не схема WAN."],
  ], "Hub and spoke has a central site connecting branch sites through point-to-point links, like a star.", "В hub and spoke центральный узел связан с филиалами каналами «точка — точка», как в звезде."),

  qx("What is the main advantage of a mesh WAN topology?", "High availability", [
    ["Lowest number of links", "Mesh requires the most links, because every end system connects to every other.", "Для mesh нужно больше всего каналов, ведь каждая система соединена с каждой."],
    ["Simplest protocols", "Simple protocols are the advantage of point-to-point, not of mesh.", "Простые протоколы — преимущество «точка — точка», а не mesh."],
    ["Lowest cost", "Connecting every site to every other is the most expensive design, not the cheapest.", "Соединять каждый узел с каждым — самый дорогой вариант, а не самый дешёвый."],
  ], "A mesh topology provides high availability, but every end system is connected to every other end system.", "Полносвязная топология даёт высокую доступность, но каждая система соединена с каждой."),

  qx("In a star LAN topology, what do the end devices connect to?", "A central device such as a switch", [
    ["Their two nearest neighbours", "Connecting to neighbours forms a ring, as in legacy Token Ring.", "Соединение с соседями образует кольцо, как в старом Token Ring."],
    ["A single shared cable with terminators", "A shared terminated cable is a bus topology, used in early Ethernet.", "Общий кабель с терминаторами — шинная топология раннего Ethernet."],
    ["Every other device on the LAN", "Every-to-every connections describe a mesh, not a star.", "Связи каждого с каждым — это mesh, а не звезда."],
  ], "In a star (and extended star) topology end devices connect to a central device, typically a switch.", "В звезде (и расширенной звезде) конечные устройства подключены к центральному устройству — обычно коммутатору."),

  qx("Which three advantages does the star topology offer?", "Easy to install, very scalable, easy to troubleshoot", [
    ["Fewest cables, no central device, no collisions at all", "A star needs a central device and a cable per device, so this is the opposite of its design.", "Звезде нужны центральное устройство и кабель на каждый узел, так что это противоположность её устройству."],
    ["High availability through redundant links", "Redundancy through many links is the advantage of mesh, not star.", "Избыточность за счёт множества каналов — преимущество mesh, а не звезды."],
    ["Deterministic access and fixed turn order", "Deterministic access is a property of controlled access (Token Ring), not of a star topology.", "Детерминированный доступ — свойство управляемого доступа (Token Ring), а не звезды."],
  ], "The notes list three advantages of the star: easy to install, very scalable and easy to troubleshoot.", "В конспекте три плюса звезды: легко монтировать, хорошо масштабируется, просто искать неисправности."),

  qx("Which LAN topology chains all end systems together and terminates the cable at each end?", "Bus", [
    ["Ring", "In a ring each system connects to its neighbours to close a loop; there are no terminators.", "В кольце каждая система соединена с соседями, замыкая петлю; терминаторов нет."],
    ["Star", "A star connects every device to a central switch, not to one shared cable.", "В звезде каждое устройство подключено к центральному коммутатору, а не к общему кабелю."],
    ["Extended star", "An extended star links several stars together through central devices, not a single cable.", "Расширенная звезда объединяет несколько звёзд через центральные устройства, а не один кабель."],
  ], "In a bus topology all end systems are chained together and terminated on each end; early Ethernet used it.", "В шине все системы на одной линии с терминаторами на концах; так работал ранний Ethernet."),

  qx("Which legacy technology used the ring LAN topology?", "Token Ring", [
    ["Early Ethernet", "Early Ethernet used a bus topology, not a ring.", "Ранний Ethernet использовал шину, а не кольцо."],
    ["IEEE 802.11 Wi-Fi", "Wi-Fi is a wireless LAN using CSMA/CA; it is not a ring technology.", "Wi-Fi — беспроводная сеть с CSMA/CA, а не кольцевая технология."],
    ["Frame Relay", "Frame Relay is a WAN protocol, not a LAN ring technology.", "Frame Relay — протокол WAN, а не кольцевая технология LAN."],
  ], "In a ring each end system connects to its neighbours; legacy Token Ring used this topology.", "В кольце каждая система соединена с соседями; так работал старый Token Ring."),

  qx("Which topology is listed as a WAN topology rather than a LAN topology?", "Hub and spoke", [
    ["Bus", "Bus is a LAN topology from early Ethernet.", "Шина — топология LAN раннего Ethernet."],
    ["Ring", "Ring is a LAN topology used by legacy Token Ring.", "Кольцо — топология LAN старого Token Ring."],
    ["Extended star", "Extended star is a LAN topology built around central switches.", "Расширенная звезда — топология LAN вокруг центральных коммутаторов."],
  ], "The WAN topologies in the notes are point-to-point, hub and spoke, and mesh; star, bus and ring are LAN topologies.", "Топологии WAN в конспекте — «точка — точка», hub and spoke и mesh; звезда, шина и кольцо — топологии LAN."),

  qx("What does half-duplex communication mean?", "Only one device can send or receive at a time", [
    ["Both devices transmit and receive at once", "Simultaneous two-way transmission is full-duplex, not half-duplex.", "Одновременная передача в обе стороны — полный дуплекс, а не полудуплекс."],
    ["Data flows in one direction only, permanently", "Half-duplex allows both directions, just not at the same time.", "Полудуплекс допускает обе стороны передачи, просто не одновременно."],
    ["Each device gets half of the link bandwidth", "Half-duplex is about taking turns, not splitting bandwidth in two.", "Полудуплекс — про очерёдность, а не про деление полосы пополам."],
  ], "In half-duplex only one device can send or receive at a time.", "В полудуплексе в каждый момент передаёт или принимает только одно устройство."),

  qx("Where is half-duplex communication used according to the notes?", "WLANs and legacy bus topologies with hubs", [
    ["Modern switched Ethernet LANs", "Ethernet switches work in full-duplex, not half-duplex.", "Коммутаторы Ethernet работают в полном дуплексе, а не в полудуплексе."],
    ["Point-to-point WAN links between two routers", "The notes tie half-duplex to WLANs and hubs, not to point-to-point WANs.", "В конспекте полудуплекс связан с WLAN и концентраторами, а не с WAN «точка — точка»."],
    ["Fibre links between data centres", "Fibre links are not named as half-duplex media; hubs and WLANs are.", "Оптические каналы не названы полудуплексной средой; названы концентраторы и WLAN."],
  ], "Half-duplex is used on WLANs and on legacy bus topologies with hubs.", "Полудуплекс применяется в WLAN и старых шинных сетях с концентраторами."),

  qx("Which device type works in full-duplex mode?", "Ethernet switch", [
    ["Ethernet hub", "Hubs belong to legacy half-duplex bus-style networks.", "Концентраторы относятся к старым полудуплексным сетям шинного типа."],
    ["Wireless access point", "WLANs operate in half-duplex, so a Wi-Fi link is not full-duplex.", "WLAN работают в полудуплексе, поэтому Wi-Fi-канал не полнодуплексный."],
    ["Token Ring MAU", "Token Ring used controlled access with a token, not full-duplex transmission.", "Token Ring использовал управляемый доступ с токеном, а не полный дуплекс."],
  ], "Ethernet switches work in full-duplex: both devices transmit and receive simultaneously.", "Коммутаторы Ethernet работают в полном дуплексе: оба устройства передают и принимают одновременно."),

  qx("What is a multiaccess network?", "A network where several devices may access the media at once", [
    ["A network with more than one default gateway", "Gateways are a Layer 3 concept; multiaccess is about devices contending for the medium.", "Шлюзы — понятие уровня 3; множественный доступ — про конкуренцию за среду."],
    ["A network that spans more than one building", "Geographic size has nothing to do with the multiaccess definition.", "Географический размер не имеет отношения к определению множественного доступа."],
    ["A network where every link is point-to-point", "Point-to-point links have only two nodes, so they are not shared multiaccess media.", "На каналах «точка — точка» всего два узла, это не общая среда множественного доступа."],
  ], "A multiaccess network can have two or more end devices trying to access the network at the same time.", "В сети множественного доступа два и более устройств могут одновременно пытаться выйти в среду."),

  qx("How do nodes behave under contention-based access?", "All nodes compete for the medium in half-duplex", [
    ["Each node waits for its assigned turn", "Taking turns is controlled (deterministic) access, not contention.", "Очерёдность — это управляемый (детерминированный) доступ, а не состязательный."],
    ["Both ends send at once on separate pairs", "Sending at once on separate pairs is full-duplex, where no access method is needed.", "Одновременная передача по разным парам — полный дуплекс, где метод доступа не нужен."],
    ["A central controller polls every node", "Polling by a controller is not how contention-based access works; nodes act independently.", "Опрос контроллером — не состязательный доступ; узлы действуют самостоятельно."],
  ], "In contention-based access all nodes compete for the medium while operating in half-duplex.", "При состязательном доступе все узлы конкурируют за среду в полудуплексе."),

  qx("What does the 'CD' in CSMA/CD stand for?", "Collision detection", [
    ["Collision deferral", "CSMA/CD detects collisions after they happen; it does not defer them in advance.", "CSMA/CD обнаруживает коллизии постфактум, а не откладывает их заранее."],
    ["Carrier distribution", "Carrier sense is the 'CS' part; 'CD' refers to detecting collisions.", "Прослушивание несущей — это «CS»; «CD» означает обнаружение коллизий."],
    ["Controlled delivery", "Controlled access is a different, deterministic method used by Token Ring.", "Управляемый доступ — другой, детерминированный метод Token Ring."],
  ], "CSMA/CD is carrier sense multiple access with collision detection, used by legacy bus-topology Ethernet.", "CSMA/CD — множественный доступ с прослушиванием несущей и обнаружением коллизий, старый шинный Ethernet."),

  qx("Two PCs on a hub-based Ethernet LAN transmit at the same time. What happens next under CSMA/CD?", "They detect the collision, wait a random time and retransmit", [
    ["They switch the link to full-duplex and continue", "Hubs cannot provide full-duplex; the devices must back off and retry.", "Концентратор не умеет полный дуплекс; устройства должны выждать и повторить."],
    ["The hub assigns each of them a fixed time slot", "Fixed time slots are controlled access; CSMA/CD relies on random back-off.", "Фиксированные слоты — управляемый доступ; CSMA/CD полагается на случайную паузу."],
    ["Both frames are dropped and never resent", "Frames are retransmitted after the random wait; they are not abandoned.", "Кадры передаются повторно после случайной паузы, их не бросают."],
  ], "Under CSMA/CD devices detect the collision, wait a random time and then retransmit.", "При CSMA/CD устройства обнаруживают коллизию, ждут случайное время и передают снова."),

  qx("Which networks use CSMA/CA?", "IEEE 802.11 wireless LANs", [
    ["Legacy bus Ethernet with hubs", "Legacy half-duplex Ethernet uses CSMA/CD, with collision detection.", "Старый полудуплексный Ethernet использует CSMA/CD с обнаружением коллизий."],
    ["Token Ring and ARCNET", "Token Ring and ARCNET use controlled, deterministic access, not CSMA.", "Token Ring и ARCNET используют управляемый детерминированный доступ, а не CSMA."],
    ["Full-duplex switched Ethernet", "Full-duplex switch ports need no access method at all.", "Портам коммутатора в полном дуплексе метод доступа не нужен вовсе."],
  ], "CSMA/CA (collision avoidance) is the access method of IEEE 802.11 wireless LANs.", "CSMA/CA (предотвращение коллизий) — метод доступа беспроводных сетей IEEE 802.11."),

  qx("How does a CSMA/CA device help others avoid collisions?", "It announces how long it needs the medium", [
    ["It detects collisions and backs off randomly", "Detect-and-back-off is CSMA/CD on wired Ethernet; CA avoids collisions in advance.", "Обнаружить и выждать — это CSMA/CD в проводном Ethernet; CA предотвращает коллизии заранее."],
    ["It waits for a token before transmitting", "Tokens belong to controlled access, not to CSMA/CA.", "Токены относятся к управляемому доступу, а не к CSMA/CA."],
    ["It sends on a separate pair of wires", "Separate pairs are a full-duplex wired feature; Wi-Fi shares one radio medium.", "Разные пары — особенность проводного полного дуплекса; Wi-Fi делит одну радиосреду."],
  ], "A CSMA/CA device includes the time it needs, so other devices know how long the medium will be busy.", "Устройство CSMA/CA сообщает, сколько времени ему нужно, и остальные знают, как долго среда занята."),

  qx("Which statement describes controlled access?", "Each node has its own time on the medium; access is deterministic", [
    ["Nodes compete and collisions are detected", "Competing with collision detection is contention-based CSMA/CD.", "Конкуренция с обнаружением коллизий — состязательный CSMA/CD."],
    ["Nodes announce how long they need the medium", "Announcing needed time is CSMA/CA, a contention-based method.", "Сообщение о нужном времени — CSMA/CA, состязательный метод."],
    ["Both ends send at once, so no method is needed", "That is full-duplex operation on switch ports, not controlled access.", "Это полный дуплекс на портах коммутатора, а не управляемый доступ."],
  ], "Controlled access is deterministic: each node has its own time on the medium, as in Token Ring and ARCNET.", "Управляемый доступ детерминирован: у каждого узла своё время в среде, как в Token Ring и ARCNET."),

  qx("Which pair of legacy technologies used controlled access?", "Token Ring and ARCNET", [
    ["Ethernet and Fast Ethernet", "Ethernet used contention-based CSMA/CD, not controlled access.", "Ethernet использовал состязательный CSMA/CD, а не управляемый доступ."],
    ["Wi-Fi and Bluetooth", "Wi-Fi uses CSMA/CA; neither is named as a controlled access technology.", "Wi-Fi использует CSMA/CA; ни одна из них не названа технологией управляемого доступа."],
    ["PPP and HDLC", "PPP and HDLC are WAN protocols, not controlled-access LAN technologies.", "PPP и HDLC — протоколы WAN, а не технологии управляемого доступа в LAN."],
  ], "Legacy Token Ring and ARCNET used controlled (deterministic) access.", "Старые Token Ring и ARCNET использовали управляемый (детерминированный) доступ."),

  qx("Why does a full-duplex switch port need neither CSMA/CD nor CSMA/CA?", "Both ends send at once on separate pairs, so collisions cannot occur", [
    ["The switch assigns each port a token", "Switches do not use tokens; full-duplex links simply never collide.", "Коммутаторы не используют токены; на полнодуплексных каналах коллизий просто нет."],
    ["The switch detects collisions on behalf of the hosts", "There are no collisions to detect on a full-duplex link.", "На полнодуплексном канале нет коллизий, которые нужно обнаруживать."],
    ["The port announces its busy time to the host", "Announcing busy time is CSMA/CA on Wi-Fi, not something a switch port does.", "Сообщение о занятости — CSMA/CA в Wi-Fi, а не поведение порта коммутатора."],
  ], "On a full-duplex switch port there is one device per end sending and receiving at the same time on separate pairs, so no collisions happen.", "На порту коммутатора в полном дуплексе по одному устройству с каждой стороны передают и принимают одновременно по разным парам, коллизий нет."),

  qx("Fill the gap from the callout: 'CD = wired half-duplex Ethernet, CA = ___.'", "Wi-Fi", [
    ["Token Ring", "Token Ring used controlled access with a token, not CSMA/CA.", "Token Ring использовал управляемый доступ с токеном, а не CSMA/CA."],
    ["Full-duplex switch ports", "Full-duplex switch ports need neither CD nor CA.", "Портам коммутатора в полном дуплексе не нужно ни CD, ни CA."],
    ["Point-to-point WAN links", "Point-to-point WANs do not share media, so they need no CSMA method.", "WAN «точка — точка» не делят среду, поэтому CSMA им не нужен."],
  ], "The callout says: CD is wired half-duplex Ethernet, CA is Wi-Fi, and a full-duplex switch port needs neither.", "В заметке: CD — проводной полудуплексный Ethernet, CA — Wi-Fi, а порту коммутатора в полном дуплексе не нужно ни то, ни другое."),

  tfx("In a hub and spoke WAN topology the branch sites are connected directly to each other.", false,
    "In hub and spoke each branch connects only to the central site through a point-to-point link, like a star.", "В hub and spoke каждый филиал связан только с центром каналом «точка — точка», как в звезде.",
    "Direct branch-to-branch links would make it a mesh; hub and spoke routes everything through the central site.", "Прямые связи между филиалами превратили бы схему в mesh; в hub and spoke всё идёт через центр."),

  tfx("The MAC sublayer provides data link layer addressing.", true,
    "MAC is responsible for data encapsulation and media access control and provides data link layer addressing.", "MAC отвечает за инкапсуляцию, управление доступом к среде и даёт канальную адресацию.",
    "It would be wrong to assign addressing to LLC; LLC only identifies the network layer protocol.", "Приписывать адресацию LLC неверно: LLC лишь определяет протокол сетевого уровня."),

  tfx("A bus topology uses a central switch to connect the end devices.", false,
    "In a bus all end systems are chained on one cable terminated at each end; there is no central device.", "В шине все системы висят на одном кабеле с терминаторами на концах; центрального устройства нет.",
    "A central switch is the defining feature of a star topology, not a bus.", "Центральный коммутатор — признак звезды, а не шины."),
];
