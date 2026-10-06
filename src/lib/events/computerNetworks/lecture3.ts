import { part, q, tf, type Lecture } from "../types";
import { deepL3P1 } from "./deep/l3p1";
import { deepL3P2 } from "./deep/l3p2";
import { deepL3P3 } from "./deep/l3p3";
import { deepL3P4 } from "./deep/l3p4";

export const lecture3: Lecture = {
  id: "cn-l3",
  title: { en: "Lecture 3 — Physical Layer. Number Systems", ru: "Лекция 3 — Физический уровень. Системы счисления" },
  parts: [
    part(
      "cn-l3-p1",
      { en: "Purpose and characteristics of the physical layer", ru: "Назначение и характеристики физического уровня" },
      {
        en: `## The physical connection
Before any communication, a physical connection to a local network must exist — wired or wireless. A **Network Interface Card (NIC)** connects a device to the network; a device can have several NICs (wired and wireless). Not all physical connections give the same performance.
A typical home wireless router shows three kinds of physical connections: the **wireless antennas**, several **Ethernet switchports** and one **internet port**.
![The back of a home wireless router: antennas, four LAN switchports and one internet (WAN) port](/events/cn/home-router-ports.webp)
![A network interface card with an RJ-45 port](/events/cn/ethernet-nic.webp)
## What the physical layer does
- Transports **bits** across the network media.
- Accepts a complete **frame** from the data link layer and **encodes it as a series of signals** sent onto the local media.
- This is the **last step of encapsulation**. The next device receives the bits, re-assembles the frame and decides what to do with it.
## Three functional areas of the standards
- **Physical components** — the hardware, media and connectors that carry the signals: NICs, interfaces, connectors, cable materials and designs.
- **Encoding** — converts the stream of bits into a format (a predictable pattern) recognizable by the next device. Examples: **Manchester, 4B/5B, 8B/10B**.
- **Signaling** — how the bit values 1 and 0 are represented on the medium: **electrical signals** over copper, **light pulses** over fiber, **microwave signals** over wireless.
| Medium | Signal | Standard body |
|---|---|---|
| Copper | electrical impulses | TIA/EIA cabling, IEEE categories |
| Fiber | pulses of light (laser or LED) | TIA/EIA, ITU-T |
| Wireless | microwave / radio modulation | IEEE 802.11, 802.15, 802.16 |
## Bandwidth
**Bandwidth** is the capacity at which a medium can carry data: how many bits can be transmitted in a second.
- 1 Kbps = 1,000 bps
- 1 Mbps = 1,000,000 bps
- 1 Gbps = 1,000,000,000 bps
- 1 Tbps = 1,000,000,000,000 bps
## Bandwidth terminology
- **Latency** — the amount of time, including delays, for data to travel from one point to another.
- **Throughput** — the measure of the transfer of bits across the media over a given period of time.
- **Goodput** — the measure of **usable** data transferred over a given period of time.
= Goodput = Throughput - traffic overhead
> Bandwidth is what the medium can carry, throughput is what it actually carries, goodput is what is left after overhead.
| Term | Meaning | Analogy |
|---|---|---|
| Bandwidth | capacity, bits per second | width of the road |
| Throughput | actual bits transferred over time | cars that actually pass |
| Goodput | useful data only | passengers, not the cars themselves |
| Latency | travel time including delays | how long one car takes |
?? A link is sold as 100 Mbps, a file transfer shows 60 Mbps, and 55 Mbps of that is the file itself. Name the three numbers.
?= Bandwidth 100 Mbps, throughput 60 Mbps, goodput 55 Mbps (throughput minus overhead).
?? What is the last step of encapsulation, and which layer does it?
?= Encoding the frame as signals on the media — the physical layer.`,
        ru: `## Физическое подключение
До любого обмена должно существовать физическое подключение к локальной сети — проводное или беспроводное. Устройство подключает к сети **сетевая карта (NIC)**; карт может быть несколько (проводная и беспроводная). Не все физические подключения дают одинаковую производительность.
У типичного домашнего беспроводного маршрутизатора три вида физических подключений: **антенны Wi-Fi**, несколько **портов коммутатора Ethernet** и один **порт интернета**.
![Задняя панель домашнего маршрутизатора: антенны, четыре порта LAN и один порт интернета (WAN)](/events/cn/home-router-ports.webp)
![Сетевая карта с портом RJ-45](/events/cn/ethernet-nic.webp)
## Что делает физический уровень
- Переносит **биты** по среде передачи.
- Принимает готовый **кадр** от канального уровня и **кодирует его в последовательность сигналов**, которые уходят в локальную среду.
- Это **последний шаг инкапсуляции**. Следующее устройство принимает биты, собирает кадр и решает, что с ним делать.
## Три области стандартов
- **Физические компоненты** — оборудование, среда и разъёмы, которые несут сигналы: сетевые карты, интерфейсы, разъёмы, материалы и конструкция кабелей.
- **Кодирование** — превращает поток битов в формат (предсказуемый шаблон), понятный следующему устройству. Примеры: **Manchester, 4B/5B, 8B/10B**.
- **Сигнализация** — как значения 1 и 0 представлены в среде: **электрические сигналы** в меди, **световые импульсы** в оптоволокне, **микроволновые сигналы** в беспроводной среде.
| Среда | Сигнал | Кто стандартизирует |
|---|---|---|
| Медь | электрические импульсы | кабели TIA/EIA, категории IEEE |
| Оптика | импульсы света (лазер или светодиод) | TIA/EIA, ITU-T |
| Радио | модуляция микроволн / радиоволн | IEEE 802.11, 802.15, 802.16 |
## Пропускная способность
**Пропускная способность (bandwidth)** — ёмкость среды: сколько битов можно передать за секунду.
- 1 Кбит/с = 1 000 бит/с
- 1 Мбит/с = 1 000 000 бит/с
- 1 Гбит/с = 1 000 000 000 бит/с
- 1 Тбит/с = 1 000 000 000 000 бит/с
## Термины
- **Задержка (latency)** — время, включая задержки, за которое данные проходят от одной точки до другой.
- **Throughput** — сколько битов реально передано через среду за период времени.
- **Goodput** — сколько **полезных** данных передано за период времени.
= Goodput = Throughput - traffic overhead
> Bandwidth — сколько среда может нести, throughput — сколько реально несёт, goodput — что осталось после служебных данных.
| Термин | Смысл | Аналогия |
|---|---|---|
| Bandwidth | ёмкость, бит в секунду | ширина дороги |
| Throughput | реально переданные биты за время | машины, которые проехали |
| Goodput | только полезные данные | пассажиры, а не сами машины |
| Latency | время в пути с задержками | сколько едет одна машина |
?? Канал продают как 100 Мбит/с, передача файла показывает 60 Мбит/с, из них 55 Мбит/с — сам файл. Назови три величины.
?= Bandwidth 100 Мбит/с, throughput 60 Мбит/с, goodput 55 Мбит/с (throughput минус служебные данные).
?? Какой шаг инкапсуляции последний и какой уровень его делает?
?= Кодирование кадра в сигналы среды — физический уровень.`,
      },
      [
        q("What does the physical layer transport across the network media?", "Bits", ["Frames", "Packets", "Segments"], "The physical layer encodes the frame as signals and moves bits.", "Физический уровень кодирует кадр в сигналы и переносит биты."),
        q("Which three functional areas do physical layer standards address?", "Physical components, encoding, signaling", ["Addressing, routing, switching", "Framing, addressing, error detection", "Encryption, compression, formatting"], "The standards cover the hardware, how bits are coded and how they are represented on the medium.", "Стандарты охватывают оборудование, кодирование битов и их представление в среде."),
        q("Which of these is an encoding method?", "Manchester", ["CSMA/CD", "Auto-MDIX", "T568B"], "Manchester, 4B/5B and 8B/10B are encoding methods.", "Manchester, 4B/5B и 8B/10B — методы кодирования."),
        q("How are bits represented on a fiber-optic cable?", "As pulses of light", ["As electrical signals", "As microwave signals", "As magnetic fields"], "Signaling depends on the medium: light for fiber, electricity for copper, microwaves for wireless.", "Сигнализация зависит от среды: свет в оптике, электричество в меди, микроволны в беспроводной."),
        q("What is the term for the time it takes data to travel from one point to another, including delays?", "Latency", ["Throughput", "Goodput", "Bandwidth"], "Latency is the travel time including delays.", "Latency — время прохождения с учётом задержек."),
        q("What is goodput?", "Throughput minus traffic overhead", ["Bandwidth plus traffic overhead", "Latency divided by bandwidth", "The theoretical capacity of a link"], "Goodput measures usable data: throughput minus overhead.", "Goodput измеряет полезные данные: throughput минус служебные."),
        q("How many bits per second is 1 Mbps?", "1,000,000 bps", ["1,000 bps", "100,000 bps", "1,000,000,000 bps"], "Mega is 10 to the power of 6.", "Мега — это 10 в шестой степени."),
        q("Which device component connects a host to the network?", "Network Interface Card", ["Central Processing Unit", "Power Supply Unit", "Terminal emulator"], "A NIC connects a device to the network; a device may have wired and wireless NICs.", "Сетевая карта подключает устройство к сети; карт может быть несколько."),
        tf("Encoding the frame as signals on the media is the last step of the encapsulation process.", true, "The physical layer accepts the complete frame and sends it as signals.", "Физический уровень принимает готовый кадр и отправляет его в виде сигналов."),
        q("What does throughput measure?", "The actual transfer of bits over a period of time", ["The maximum capacity of the medium", "The delay between two end devices", "The number of devices on the link"], "Throughput is the real transfer rate, usually lower than bandwidth.", "Throughput — реальная скорость передачи, обычно ниже пропускной способности."),
      ],
      deepL3P1,
    ),
    part(
      "cn-l3-p2",
      { en: "Copper cabling and UTP", ru: "Медные кабели и UTP" },
      {
        en: `## Copper: strengths and limits
Copper cabling is the most common type: inexpensive, easy to install, low resistance to electrical current. Its limits:
- **Attenuation** — the longer the signal travels, the weaker it gets. Cure: respect cable **length limits**.
- **EMI and RFI** (electromagnetic and radio frequency interference) — cure: metallic **shielding** and grounding.
- **Crosstalk** — interference between wires — cure: **twisting** opposing circuit pair wires together.
## Three types of copper cable
- **UTP (unshielded twisted pair)** — the most common networking media. Terminated with **RJ-45** connectors. Interconnects hosts with intermediary devices. Outer jacket, twisted pairs, color-coded insulation.
- **STP (shielded twisted pair)** — better noise protection than UTP, but **more expensive and harder to install**. Also RJ-45. A braided or foil shield plus a foil shield for each pair.
- **Coaxial** — outer jacket, woven copper braid or foil (second wire and shield), plastic insulation, copper conductor. Used to attach **antennas** to wireless devices and for **cable internet**.
![A UTP cable stripped to show its four twisted pairs next to an RJ-45 connector](/events/cn/utp-pairs.webp)
![Shielded twisted pair with foil shields and a coaxial cable cross-section](/events/cn/stp-coax.webp)
| Cable | Shield | Connector | Typical use |
|---|---|---|---|
| UTP | none — twisting only | RJ-45 | hosts to switches, most LANs |
| STP | braid or foil, plus foil per pair | RJ-45 | noisy environments; pricier, harder to install |
| Coaxial | copper braid around the core | BNC, F-type | antennas, cable internet |
## How UTP fights crosstalk
UTP has **four pairs** of color-coded copper wires and **no shielding**. It relies on **cancellation**: the two wires of a pair carry opposite polarity, are twisted together, and their magnetic fields cancel each other and outside EMI/RFI.
## Standards
- **TIA/EIA-568** standardizes cable types, lengths, connectors, termination and testing.
- The **IEEE** rates cable by performance: **Category 3, 5, 5e, 6**.
- The maximum length of a UTP run (Cat5e, Cat6) is **100 meters**.
## Wire order
= T568A: white-green, green, white-orange, blue, white-blue, orange, white-brown, brown
= T568B: white-orange, orange, white-green, blue, white-blue, green, white-brown, brown
@diagram t568
## Three cables
- **Straight-through** — both ends T568A or both T568B. **Host to network device** (PC to switch, switch to router).
- **Crossover** — one end T568A, the other T568B. **Like to like**: host to host, switch to switch, router to router. Considered legacy because **Auto-MDIX** detects the cable type.
- **Rollover** — Cisco proprietary. Host serial port to the **console port** of a router or switch.
> Different devices — straight-through. Same devices — crossover. Console — rollover. If Auto-MDIX is off, switch to switch needs a crossover.
@diagram cable-choice
@demo cable
| Cable | Ends | Connects |
|---|---|---|
| Straight-through | T568A–T568A or T568B–T568B | PC to switch, switch to router |
| Crossover | T568A–T568B | PC to PC, switch to switch, router to router, PC to router |
| Rollover | Cisco pinout | PC serial port to console port |
?? Two switches are connected with a straight-through cable and the link does not come up. What is wrong, and why does it usually work anyway?
?= Like devices need a crossover cable; it usually works because Auto-MDIX detects the cable and swaps the pairs.
?? What is the maximum length of one UTP run, and which limitation sets it?
?= 100 meters, because of attenuation.`,
        ru: `## Медь: плюсы и ограничения
Медный кабель — самый распространённый: недорогой, прост в монтаже, с малым сопротивлением току. Ограничения:
- **Затухание** — чем дальше идёт сигнал, тем он слабее. Лечится соблюдением **предельной длины** кабеля.
- **EMI и RFI** (электромагнитные и радиочастотные помехи) — лечится металлическим **экраном** и заземлением.
- **Перекрёстные помехи (crosstalk)** — наводки между проводами — лечится **скруткой** проводов пары.
## Три типа медного кабеля
- **UTP (неэкранированная витая пара)** — самая распространённая сетевая среда. Оконцовывается разъёмами **RJ-45**. Соединяет хосты с промежуточными устройствами. Внешняя оболочка, витые пары, цветная изоляция.
- **STP (экранированная витая пара)** — лучше защищена от помех, чем UTP, но **дороже и сложнее в монтаже**. Тоже RJ-45. Общий экран из оплётки или фольги плюс экран из фольги на каждой паре.
- **Коаксиальный** — внешняя оболочка, медная оплётка или фольга (второй провод и экран), пластиковая изоляция, медная жила. Применяется для подключения **антенн** к беспроводным устройствам и для **кабельного интернета**.
![Зачищенный кабель UTP с четырьмя витыми парами рядом с разъёмом RJ-45](/events/cn/utp-pairs.webp)
![Экранированная витая пара с фольгой и срез коаксиального кабеля](/events/cn/stp-coax.webp)
| Кабель | Экран | Разъём | Где применяют |
|---|---|---|---|
| UTP | нет — только скрутка | RJ-45 | хосты к коммутаторам, большинство LAN |
| STP | оплётка или фольга, плюс фольга на каждой паре | RJ-45 | шумные места; дороже и сложнее в монтаже |
| Коаксиальный | медная оплётка вокруг жилы | BNC, F-разъём | антенны, кабельный интернет |
## Как UTP борется с наводками
В UTP **четыре пары** цветных медных проводов и **нет экрана**. Он полагается на **взаимное гашение (cancellation)**: два провода пары несут противоположную полярность, скручены, и их магнитные поля гасят друг друга и внешние EMI/RFI.
## Стандарты
- **TIA/EIA-568** стандартизирует типы кабелей, длины, разъёмы, оконцовку и тестирование.
- **IEEE** делит кабели по характеристикам: **категории 3, 5, 5e, 6**.
- Максимальная длина сегмента UTP (Cat5e, Cat6) — **100 метров**.
## Порядок проводов
= T568A: white-green, green, white-orange, blue, white-blue, orange, white-brown, brown
= T568B: white-orange, orange, white-green, blue, white-blue, green, white-brown, brown
@diagram t568
## Три кабеля
- **Прямой (straight-through)** — оба конца T568A или оба T568B. **Хост — сетевое устройство** (ПК — коммутатор, коммутатор — маршрутизатор).
- **Перекрёстный (crossover)** — один конец T568A, другой T568B. **Одинаковые устройства**: хост — хост, коммутатор — коммутатор, маршрутизатор — маршрутизатор. Считается устаревшим, потому что **Auto-MDIX** сам определяет тип кабеля.
- **Консольный (rollover)** — фирменный кабель Cisco. От последовательного порта хоста к **консольному порту** маршрутизатора или коммутатора.
> Разные устройства — прямой. Одинаковые — перекрёстный. Консоль — rollover. Если Auto-MDIX выключен, коммутатор с коммутатором соединяют перекрёстным.
@diagram cable-choice
@demo cable
| Кабель | Концы | Соединяет |
|---|---|---|
| Прямой | T568A–T568A или T568B–T568B | ПК с коммутатором, коммутатор с маршрутизатором |
| Перекрёстный | T568A–T568B | ПК с ПК, коммутатор с коммутатором, маршрутизатор с маршрутизатором, ПК с маршрутизатором |
| Rollover | разводка Cisco | последовательный порт ПК с консольным портом |
?? Два коммутатора соединили прямым кабелем, и канал не поднимается. Что не так и почему обычно всё же работает?
?= Одинаковым устройствам нужен перекрёстный кабель; обычно работает потому, что Auto-MDIX сам определяет кабель и меняет пары.
?? Какова максимальная длина одного сегмента UTP и какое ограничение её задаёт?
?= 100 метров, из-за затухания.`,
      },
      [
        q("What is the standard T568B wire ordering start sequence?", "White-Orange, Orange, White-Green...", ["White-Green, Green...", "White-Orange, Green...", "White-Brown, Brown..."], "T568B starts white-orange, orange, white-green; T568A starts white-green, green, white-orange.", "T568B начинается: бело-оранжевый, оранжевый, бело-зелёный; T568A — бело-зелёный, зелёный, бело-оранжевый."),
        q("What cable type connects two switches directly when Auto-MDIX is off?", "Crossover", ["Straight-through", "Rollover", "Coaxial"], "Like devices need a crossover cable unless Auto-MDIX swaps the pairs automatically.", "Одинаковым устройствам нужен перекрёстный кабель, если Auto-MDIX не меняет пары сам."),
        q("What is the maximum distance for Cat6 UTP cabling without repeaters?", "100m", ["50m", "250m", "500m"], "A UTP run is limited to 100 meters because of attenuation.", "Сегмент UTP ограничен 100 метрами из-за затухания."),
        q("Which cable connects a PC serial port to the console port of a Cisco switch?", "Rollover", ["Crossover", "Straight-through", "Fiber patch cord"], "The Cisco proprietary rollover cable is used for console access.", "Фирменный кабель Cisco rollover используется для доступа к консоли."),
        q("Which cable connects a PC to a switch?", "Straight-through", ["Crossover", "Rollover", "Coaxial"], "Host to network device uses a straight-through cable: the same standard on both ends.", "Хост с сетевым устройством соединяет прямой кабель: один стандарт на обоих концах."),
        q("What weakens an electrical signal as the cable gets longer?", "Attenuation", ["Crosstalk", "Cancellation", "Dispersion"], "Attenuation is the loss of signal strength with distance.", "Затухание — потеря мощности сигнала с расстоянием."),
        q("How does UTP cable limit crosstalk?", "By twisting the wires of each pair", ["By a foil shield on each pair", "By a thicker outer jacket", "By using light instead of current"], "UTP has no shielding; twisting gives cancellation of the magnetic fields.", "В UTP нет экрана; скрутка даёт взаимное гашение магнитных полей."),
        q("Which connector terminates UTP cable?", "RJ-45", ["BNC", "LC", "ST"], "Both UTP and STP are terminated with RJ-45 connectors.", "И UTP, и STP оконцовываются разъёмами RJ-45."),
        q("How is a crossover cable terminated?", "T568A on one end, T568B on the other", ["T568A on both ends", "T568B on both ends", "Rolled pinout on one end"], "A straight-through cable has the same standard on both ends; a crossover has different ones.", "У прямого кабеля один стандарт на обоих концах, у перекрёстного — разные."),
        q("Compared with UTP, STP cable is…", "Better protected but more expensive", ["Cheaper and easier to install", "Immune to attenuation", "Limited to coaxial connectors"], "STP gives better noise protection but costs more and is harder to install.", "STP лучше защищён от помех, но дороже и сложнее в монтаже."),
        q("Where is coaxial cable commonly used?", "To attach antennas to wireless devices", ["To connect PCs to access switches", "To link console ports to laptops", "To build long undersea backbones"], "Coax is used in wireless installations and cable internet.", "Коаксиал применяют в беспроводных установках и кабельном интернете."),
      ],
      deepL3P2,
    ),
    part(
      "cn-l3-p3",
      { en: "Fiber-optic cabling and wireless media", ru: "Оптоволокно и беспроводная среда" },
      {
        en: `## Fiber-optic cable
- Transmits data over **longer distances** and at **higher bandwidth** than any other medium.
- Less susceptible to attenuation and **completely immune to EMI and RFI**.
- Made of flexible, extremely thin strands of very pure **glass**; a **laser or LED** encodes bits as pulses of light.
- Not as common as UTP because of the **expense**.
## Two types of fiber
- **Single-mode fiber (SMF)** — very small core, expensive **lasers**, **long-distance** applications.
- **Multimode fiber (MMF)** — larger core, cheaper **LEDs**, light enters at different angles, up to 10 Gbps over **550 meters**.
**Dispersion** is the spreading out of a light pulse over time. MMF has greater dispersion than SMF.
@diagram fiber-types
## Where fiber is used
Enterprise networks (backbone), **Fiber-to-the-Home (FTTH)**, long-haul networks, submarine cable networks.
## Connectors and patch cords
- **ST (straight-tip)** — older bayonet style, twist to lock.
- **SC (subscriber connector)** — square, **push-pull** mechanism.
- **LC (Lucent connector)** — smaller version of SC, simplex or duplex.
A **yellow** jacket means single-mode; **orange (or aqua)** means multimode.
Patch cords are named by their two connectors and the fiber type: **SC-SC multimode, LC-LC single-mode, ST-LC multimode, ST-SC single-mode**.
![ST, SC and LC fiber connectors on yellow single-mode and orange multimode patch cords](/events/cn/fiber-connectors.webp)
| Connector | Looks like | Locks by |
|---|---|---|
| ST | round, bayonet | twist |
| SC | square | push-pull |
| LC | small square, often duplex | latch, like RJ-45 |
## Fiber versus copper
- Bandwidth: UTP 10 Mb/s – 10 Gb/s; fiber 10 Mb/s – 100 Gb/s.
- Distance: UTP 1 – 100 meters; fiber 1 – 100,000 meters.
- Immunity to EMI/RFI and electrical hazards: UTP low; fiber completely immune.
- Costs, installation skills and safety precautions: UTP lowest; fiber highest.
| | UTP | Fiber |
|---|---|---|
| Bandwidth | 10 Mb/s – 10 Gb/s | 10 Mb/s – 100 Gb/s |
| Distance | 1 – 100 m | 1 – 100 000 m |
| EMI/RFI | affected | completely immune |
| Electrical hazards | affected | immune |
| Cost, skills, safety | lowest | highest |
Fiber is mainly used as **backbone cabling** for high-traffic point-to-point links between data distribution facilities and between the buildings of a campus.
## Wireless media
Wireless carries electromagnetic signals using radio or microwave frequencies and gives the **greatest mobility**. Limitations:
- **Coverage area** — depends on the physical characteristics of the location.
- **Interference** — many common devices can disrupt it.
- **Security** — no physical access to the media is needed, so anyone can reach the transmission.
- **Shared medium** — WLANs are **half-duplex**: only one device can send or receive at a time.
## Wireless standards
- **Wi-Fi — IEEE 802.11** — wireless LAN.
- **Bluetooth — IEEE 802.15** — wireless personal area network (WPAN).
- **WiMAX — IEEE 802.16** — point-to-multipoint broadband wireless access.
- **Zigbee — IEEE 802.15.4** — low data rate, low power, for the Internet of Things.
A WLAN needs a **wireless access point (AP)** and **wireless NIC adapters**.
![A ceiling-mounted wireless access point](/events/cn/wireless-ap.webp)
| Standard | Name | For |
|---|---|---|
| IEEE 802.11 | Wi-Fi | wireless LAN |
| IEEE 802.15 | Bluetooth | personal area network |
| IEEE 802.16 | WiMAX | broadband, point-to-multipoint |
| IEEE 802.15.4 | Zigbee | IoT, low power |
The access point concentrates the wireless signals of the users and connects to the existing copper-based network. When buying WLAN equipment, check compatibility and interoperability; administrators must apply strict **security policies** to protect a WLAN from unauthorized access.
> Single-mode: small core, laser, long, yellow. Multimode: large core, LED, 550 m, orange.
?? You need to link two buildings 2 km apart. Which fiber, and why not the other?
?= Single-mode: small core and laser carry light far. Multimode is limited to about 550 m by dispersion.
?? Why does Wi-Fi get slower for everyone when more people connect?
?= It is a shared half-duplex medium: only one device sends or receives at a time.`,
        ru: `## Оптоволоконный кабель
- Передаёт данные на **большие расстояния** и с **большей пропускной способностью**, чем любая другая среда.
- Меньше подвержен затуханию и **полностью невосприимчив к EMI и RFI**.
- Состоит из гибких, очень тонких нитей чистого **стекла**; **лазер или светодиод** кодирует биты импульсами света.
- Встречается реже, чем UTP, из-за **стоимости**.
## Два типа волокна
- **Одномодовое (SMF)** — очень тонкая сердцевина, дорогие **лазеры**, **большие расстояния**.
- **Многомодовое (MMF)** — сердцевина толще, более дешёвые **светодиоды**, свет входит под разными углами, до 10 Гбит/с на **550 метров**.
**Дисперсия** — расплывание светового импульса во времени. У MMF дисперсия больше, чем у SMF.
@diagram fiber-types
## Где применяют оптику
Корпоративные сети (магистраль), **оптика до дома (FTTH)**, магистральные сети дальней связи, подводные кабели.
## Разъёмы и патч-корды
- **ST (straight-tip)** — старый байонетный, фиксируется поворотом.
- **SC (subscriber connector)** — квадратный, механизм **push-pull** (нажал — вытянул).
- **LC (Lucent connector)** — уменьшенная версия SC, одиночный или двойной.
**Жёлтая** оболочка — одномодовое волокно; **оранжевая (или аква)** — многомодовое.
Патч-корды называют по двум разъёмам и типу волокна: **SC-SC многомодовый, LC-LC одномодовый, ST-LC многомодовый, ST-SC одномодовый**.
![Разъёмы ST, SC и LC на жёлтом одномодовом и оранжевом многомодовом патч-кордах](/events/cn/fiber-connectors.webp)
| Разъём | Как выглядит | Фиксация |
|---|---|---|
| ST | круглый, байонет | поворотом |
| SC | квадратный | push-pull |
| LC | маленький квадратный, часто сдвоенный | защёлка, как у RJ-45 |
## Оптика против меди
- Пропускная способность: UTP 10 Мбит/с – 10 Гбит/с; оптика 10 Мбит/с – 100 Гбит/с.
- Расстояние: UTP 1 – 100 метров; оптика 1 – 100 000 метров.
- Устойчивость к EMI/RFI и электрическим рискам: UTP низкая; оптика полностью невосприимчива.
- Стоимость, требования к монтажу и безопасности: у UTP самые низкие; у оптики самые высокие.
| | UTP | Оптика |
|---|---|---|
| Пропускная способность | 10 Мбит/с – 10 Гбит/с | 10 Мбит/с – 100 Гбит/с |
| Расстояние | 1 – 100 м | 1 – 100 000 м |
| EMI/RFI | подвержена | полностью невосприимчива |
| Электрические риски | подвержена | невосприимчива |
| Стоимость, навыки, безопасность | самые низкие | самые высокие |
Оптику применяют в основном как **магистральный кабель** для нагруженных каналов «точка — точка» между узлами распределения и между зданиями кампуса.
## Беспроводная среда
Беспроводная среда передаёт электромагнитные сигналы на радио- или микроволновых частотах и даёт **наибольшую мобильность**. Ограничения:
- **Зона покрытия** — зависит от физических особенностей места.
- **Помехи** — многие обычные устройства мешают сигналу.
- **Безопасность** — физический доступ к среде не нужен, поэтому перехватить передачу может любой.
- **Общая среда** — WLAN работают в **полудуплексе**: в каждый момент передаёт или принимает только одно устройство.
## Беспроводные стандарты
- **Wi-Fi — IEEE 802.11** — беспроводная LAN.
- **Bluetooth — IEEE 802.15** — беспроводная персональная сеть (WPAN).
- **WiMAX — IEEE 802.16** — широкополосный доступ «точка — много точек».
- **Zigbee — IEEE 802.15.4** — низкая скорость, малое энергопотребление, для интернета вещей.
Для WLAN нужны **беспроводная точка доступа (AP)** и **беспроводные сетевые адаптеры**.
![Потолочная беспроводная точка доступа](/events/cn/wireless-ap.webp)
| Стандарт | Название | Для чего |
|---|---|---|
| IEEE 802.11 | Wi-Fi | беспроводная LAN |
| IEEE 802.15 | Bluetooth | персональная сеть |
| IEEE 802.16 | WiMAX | широкополосный доступ «точка — много точек» |
| IEEE 802.15.4 | Zigbee | интернет вещей, малое энергопотребление |
Точка доступа собирает беспроводные сигналы пользователей и подключается к существующей медной сети. При покупке оборудования WLAN проверяй совместимость; администраторы обязаны применять строгие **политики безопасности**, чтобы защитить WLAN от несанкционированного доступа.
> Одномод: тонкая сердцевина, лазер, далеко, жёлтый. Многомод: толстая сердцевина, светодиод, 550 м, оранжевый.
?? Нужно соединить два здания в 2 км друг от друга. Какое волокно и почему не другое?
?= Одномодовое: тонкая сердцевина и лазер несут свет далеко. Многомодовое ограничено примерно 550 м из-за дисперсии.
?? Почему Wi-Fi замедляется у всех, когда подключается больше людей?
?= Это общая полудуплексная среда: в каждый момент передаёт или принимает только одно устройство.`,
      },
      [
        q("Which fiber optic connector type features a push-pull latching mechanism and square housing?", "SC Connector", ["ST Connector", "BNC Connector", "RJ-45 Connector"], "SC is the square push-pull connector; ST is the older twist-lock bayonet type.", "SC — квадратный разъём push-pull; ST — старый байонетный с поворотом."),
        q("Which type of fiber uses a very small core and lasers for long-distance links?", "Single-mode fiber", ["Multimode fiber", "Coaxial fiber", "Plastic twisted fiber"], "SMF has a very small core and expensive lasers; MMF has a larger core and LEDs.", "У SMF тонкая сердцевина и дорогие лазеры; у MMF — толще и светодиоды."),
        q("What is the maximum cable distance usually given for multimode fiber at 10 Gbps?", "550 meters", ["100 meters", "5 kilometers", "100 kilometers"], "MMF has greater dispersion, which limits it to about 550 meters.", "У MMF больше дисперсия, поэтому предел — около 550 метров."),
        q("What jacket color normally marks a single-mode fiber patch cord?", "Yellow", ["Orange", "Aqua", "Grey"], "Yellow is single-mode; orange or aqua is multimode.", "Жёлтый — одномодовое; оранжевый или аква — многомодовое."),
        q("Which interference affects fiber-optic cable?", "None — it is immune to EMI and RFI", ["Crosstalk from nearby fiber pairs", "Radio frequency interference only", "Electromagnetic interference only"], "Fiber carries light, so electrical interference does not affect it.", "Оптика передаёт свет, поэтому электрические помехи на неё не действуют."),
        q("What is dispersion in fiber optics?", "The spreading out of a light pulse over time", ["The loss of signal in copper wires", "The reflection of light at the connector", "The bending of the outer cable jacket"], "More dispersion means more loss of signal strength; MMF has more of it than SMF.", "Больше дисперсия — больше потери сигнала; у MMF она выше, чем у SMF."),
        q("Which IEEE standard defines Wi-Fi?", "802.11", ["802.3", "802.15", "802.16"], "802.11 is WLAN, 802.15 is Bluetooth, 802.16 is WiMAX, 802.3 is Ethernet.", "802.11 — WLAN, 802.15 — Bluetooth, 802.16 — WiMAX, 802.3 — Ethernet."),
        q("Which wireless standard is IEEE 802.15?", "Bluetooth", ["Wi-Fi", "WiMAX", "Ethernet"], "Bluetooth is the WPAN standard 802.15; Zigbee is 802.15.4.", "Bluetooth — стандарт WPAN 802.15; Zigbee — 802.15.4."),
        q("Why does a busy WLAN give each user less bandwidth?", "It is a shared half-duplex medium", ["Its access points use fiber uplinks", "Its frames are larger than Ethernet", "It encrypts every frame twice"], "Only one device can send or receive at a time on a WLAN.", "В WLAN в каждый момент передаёт или принимает только одно устройство."),
        q("Which wireless technology targets low data-rate, low-power IoT communications?", "Zigbee", ["WiMAX", "Wi-Fi", "LTE"], "Zigbee (802.15.4) is designed for low data rate and low power consumption.", "Zigbee (802.15.4) рассчитан на низкую скорость и малое энергопотребление."),
        tf("Compared with UTP, fiber-optic cabling has lower media and connector costs.", false, "Fiber has the highest costs, installation skill and safety requirements.", "У оптики самые высокие стоимость и требования к монтажу и безопасности."),
      ],
      deepL3P3,
    ),
    part(
      "cn-l3-p4",
      { en: "Number systems: binary and hexadecimal", ru: "Системы счисления: двоичная и шестнадцатеричная" },
      {
        en: `## Binary and IPv4
- Binary uses the digits **1 and 0**, called **bits**. Decimal uses the digits 0 through 9.
- An **IPv4 address** is a string of **32 bits**, divided into four sections called **octets**.
- Each octet has **8 bits** (1 byte); octets are separated by a dot. People read it as **dotted decimal**.
## Positional notation
A digit has a different value depending on its position. In decimal the positions are powers of ten:
= 1234 = 1 x 1000 + 2 x 100 + 3 x 10 + 4 x 1
In binary they are powers of two. For one octet the positional values are:
= 128  64  32  16  8  4  2  1
A binary 1 in a position adds that value, a 0 adds nothing.
@diagram binary-weights
@demo binary
= 11000000 = 128 + 64 = 192
= 10101000 = 128 + 32 + 8 = 168
= 11111111 = 255
## Binary to decimal
Convert each octet separately and write the results with dots:
= 11000000.10101000.00001011.00001010 = 192.168.11.10
## Decimal to binary
Start at the **128** position (the most significant bit) and move right.
- Is the number equal to or greater than the positional value? **Yes** — write 1 and subtract the value. **No** — write 0.
- Repeat down to the position of 1.
Example with 168:
= 168 >= 128: 1, left 40
= 40 >= 64: 0
= 40 >= 32: 1, left 8
= 8 >= 16: 0
= 8 >= 8: 1, left 0
= the rest are 0  ->  10101000
## Hexadecimal
- Base **sixteen**: digits **0–9** and letters **A–F** (A=10, B=11, C=12, D=13, E=14, F=15).
- One hex digit stands for **four bits**. Used for **IPv6 addresses** and **MAC addresses**.
- An **IPv6 address** is **128 bits** long: 32 hexadecimal digits in eight groups of four. Each group of four hex digits is a **hextet**.
| Hex | Binary | Decimal |
|---|---|---|
| 0 | 0000 | 0 |
| 8 | 1000 | 8 |
| 9 | 1001 | 9 |
| A | 1010 | 10 |
| B | 1011 | 11 |
| C | 1100 | 12 |
| D | 1101 | 13 |
| E | 1110 | 14 |
| F | 1111 | 15 |
## Decimal to hex and back
Go through binary:
= 168 -> 10101000 -> 1010 1000 -> A8
= D2 -> 1101 0010 -> 11010010 -> 128 + 64 + 16 + 2 = 210
> Memorise the row 128 64 32 16 8 4 2 1 — every conversion question is solved with it.
| Address type | Bits | Written as |
|---|---|---|
| IPv4 | 32 | 4 decimal octets: 192.168.11.10 |
| MAC | 48 | 12 hex digits: 00-1A-2B-3C-4D-5E |
| IPv6 | 128 | 8 hextets: 2001:0db8:…:0001 |
?? Convert 224 to binary.
?= 11100000 — 128 + 64 + 32 = 224.
?? What is hexadecimal 0xC0 in decimal, and where have you seen that number?
?= 1100 0000 = 192 — the first octet of 192.168.x.x.`,
        ru: `## Двоичная система и IPv4
- В двоичной системе цифры **1 и 0** — это **биты**. В десятичной — цифры от 0 до 9.
- **Адрес IPv4** — строка из **32 бит**, разделённая на четыре части — **октеты**.
- В каждом октете **8 бит** (1 байт); октеты разделены точкой. Люди читают адрес как **десятичный с точками**.
## Позиционная запись
Значение цифры зависит от её позиции. В десятичной системе позиции — степени десяти:
= 1234 = 1 x 1000 + 2 x 100 + 3 x 10 + 4 x 1
В двоичной — степени двойки. Для одного октета веса позиций такие:
= 128  64  32  16  8  4  2  1
Единица в позиции добавляет её вес, ноль не добавляет ничего.
@diagram binary-weights
@demo binary
= 11000000 = 128 + 64 = 192
= 10101000 = 128 + 32 + 8 = 168
= 11111111 = 255
## Из двоичной в десятичную
Переводи каждый октет отдельно и записывай результаты через точку:
= 11000000.10101000.00001011.00001010 = 192.168.11.10
## Из десятичной в двоичную
Начинай с позиции **128** (старший бит) и двигайся вправо.
- Число больше или равно весу позиции? **Да** — пиши 1 и вычитай вес. **Нет** — пиши 0.
- Повторяй до позиции 1.
Пример для 168:
= 168 >= 128: 1, left 40
= 40 >= 64: 0
= 40 >= 32: 1, left 8
= 8 >= 16: 0
= 8 >= 8: 1, left 0
= the rest are 0  ->  10101000
## Шестнадцатеричная система
- Основание **шестнадцать**: цифры **0–9** и буквы **A–F** (A=10, B=11, C=12, D=13, E=14, F=15).
- Одна шестнадцатеричная цифра заменяет **четыре бита**. Используется для **адресов IPv6** и **MAC-адресов**.
- **Адрес IPv6** имеет длину **128 бит**: 32 шестнадцатеричные цифры в восьми группах по четыре. Группа из четырёх цифр — **хекстет**.
| Hex | Двоичное | Десятичное |
|---|---|---|
| 0 | 0000 | 0 |
| 8 | 1000 | 8 |
| 9 | 1001 | 9 |
| A | 1010 | 10 |
| B | 1011 | 11 |
| C | 1100 | 12 |
| D | 1101 | 13 |
| E | 1110 | 14 |
| F | 1111 | 15 |
## Из десятичной в шестнадцатеричную и обратно
Переводи через двоичную:
= 168 -> 10101000 -> 1010 1000 -> A8
= D2 -> 1101 0010 -> 11010010 -> 128 + 64 + 16 + 2 = 210
> Выучи ряд 128 64 32 16 8 4 2 1 — им решается любой вопрос на перевод.
| Тип адреса | Бит | Запись |
|---|---|---|
| IPv4 | 32 | 4 десятичных октета: 192.168.11.10 |
| MAC | 48 | 12 шестнадцатеричных цифр: 00-1A-2B-3C-4D-5E |
| IPv6 | 128 | 8 хекстетов: 2001:0db8:…:0001 |
?? Переведи 224 в двоичную систему.
?= 11100000 — 128 + 64 + 32 = 224.
?? Чему равно шестнадцатеричное 0xC0 в десятичной системе и где ты видел это число?
?= 1100 0000 = 192 — первый октет адресов 192.168.x.x.`,
      },
      [
        q("What is decimal 192 in 8-bit binary?", "11000000", ["10101000", "11100000", "10000000"], "192 = 128 + 64, so the two left-most bits are 1.", "192 = 128 + 64, значит два старших бита равны 1."),
        q("What is binary 10101000 in decimal?", "168", ["160", "170", "172"], "128 + 32 + 8 = 168.", "128 + 32 + 8 = 168."),
        q("What is decimal 168 in hexadecimal?", "A8", ["8A", "B8", "A6"], "168 = 10101000 = 1010 1000 = A and 8.", "168 = 10101000 = 1010 1000 = A и 8."),
        q("What is hexadecimal D2 in decimal?", "210", ["202", "212", "132"], "D2 = 1101 0010 = 128 + 64 + 16 + 2 = 210.", "D2 = 1101 0010 = 128 + 64 + 16 + 2 = 210."),
        q("How many bits are in an IPv4 address?", "32", ["8", "48", "128"], "IPv4 has four octets of 8 bits each.", "В IPv4 четыре октета по 8 бит."),
        q("What is the length of an IPv6 address?", "128 bits", ["32 bits", "48 bits", "64 bits"], "IPv6 is 128 bits: 32 hexadecimal digits in eight hextets.", "IPv6 — 128 бит: 32 шестнадцатеричные цифры в восьми хекстетах."),
        q("What is the positional value of the most significant bit in an octet?", "128", ["64", "255", "1"], "The octet row is 128, 64, 32, 16, 8, 4, 2, 1.", "Ряд весов октета: 128, 64, 32, 16, 8, 4, 2, 1."),
        q("How many bits does a single hexadecimal digit represent?", "4", ["2", "8", "16"], "One hex digit stands for four binary bits.", "Одна шестнадцатеричная цифра заменяет четыре бита."),
        q("What is a group of four hexadecimal digits in an IPv6 address called?", "Hextet", ["Octet", "Nibble", "Prefix"], "IPv6 is written as eight hextets; IPv4 as four octets.", "IPv6 записывают восемью хекстетами; IPv4 — четырьмя октетами."),
        q("What is binary 11111111 in decimal?", "255", ["256", "254", "127"], "128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255.", "128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255."),
        q("What is the decimal value of hexadecimal F?", "15", ["16", "14", "10"], "A=10, B=11, C=12, D=13, E=14, F=15.", "A=10, B=11, C=12, D=13, E=14, F=15."),
        q("Which IPv4 address is 11000000.10101000.00001011.00001010?", "192.168.11.10", ["192.168.10.11", "192.160.11.10", "128.168.11.10"], "Convert each octet: 192, 168, 11 (8+2+1) and 10 (8+2).", "Переводим каждый октет: 192, 168, 11 (8+2+1) и 10 (8+2)."),
      ],
      deepL3P4,
    ),
  ],
};
