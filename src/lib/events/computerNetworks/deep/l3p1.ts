import { qx, tfx, type Draft } from "../../types";

export const deepL3P1: Draft[] = [
  qx("What must exist before any network communication can take place?", "A physical connection to a local network, wired or wireless", [
    ["A default gateway address configured on the sending device", "A gateway is needed only to reach remote networks; the notes name the physical connection as the precondition.", "Шлюз нужен лишь для удалённых сетей; в конспекте предпосылкой названо физическое подключение."],
    ["A DNS server reachable from the device", "DNS resolves names; communication at lower layers does not depend on it.", "DNS разрешает имена; связь на нижних уровнях от него не зависит."],
    ["An encrypted session with the destination", "Encryption is a presentation layer function, not a prerequisite for the physical link.", "Шифрование — функция уровня представления, а не условие физического подключения."],
  ], "Before any communication, a physical connection to a local network must exist, either wired or wireless.", "До любого обмена должно существовать физическое подключение к локальной сети — проводное или беспроводное."),

  qx("What connects a device to the network at the physical level?", "A Network Interface Card (NIC)", [
    ["A default gateway (DGW) router", "The gateway is a router interface address for leaving the LAN, not the device's own connector.", "Шлюз — адрес интерфейса маршрутизатора для выхода из LAN, а не разъём самого устройства."],
    ["A DHCP server", "DHCP assigns IP settings; it does not physically attach the device to media.", "DHCP выдаёт IP-настройки и физически не подключает устройство к среде."],
    ["A terminal emulator", "A terminal emulator is software for console access, not a network connection.", "Эмулятор терминала — программа для консольного доступа, а не сетевое подключение."],
  ], "A NIC connects a device to the network; it is the hardware that attaches the host to the media.", "Сетевая карта подключает устройство к сети; это аппаратная часть, соединяющая узел со средой."),

  qx("A laptop has both an Ethernet port and Wi-Fi. What does this illustrate from the notes?", "A device can have several NICs, wired and wireless", [
    ["A device must choose a single NIC and keep it permanently", "Nothing requires one permanent NIC; the notes say several NICs can coexist.", "Ничто не требует одной постоянной карты; в конспекте сказано, что карт может быть несколько."],
    ["Wireless and wired NICs share one MAC address", "Each NIC has its own embedded MAC address.", "У каждой карты свой вшитый MAC-адрес."],
    ["Only the wired NIC can carry a frame", "Both wired and wireless NICs carry frames encoded as signals.", "И проводная, и беспроводная карты передают кадры в виде сигналов."],
  ], "A device can have more than one NIC, for example one wired and one wireless.", "У устройства может быть несколько сетевых карт — например, проводная и беспроводная."),

  qx("Which statement about physical connections is made in the notes?", "Not all physical connections give the same performance", [
    ["Every physical connection delivers identical speed", "The notes explicitly say performance differs between connection types.", "В конспекте прямо сказано, что производительность у разных подключений различается."],
    ["Wireless always outperforms wired links", "The notes make no such claim; they only say performance varies.", "Такого утверждения в конспекте нет; сказано лишь, что производительность разная."],
    ["A physical connection is optional for wireless devices", "Wireless is itself a kind of physical connection; it is still required.", "Беспроводная связь — тоже вид физического подключения; оно по-прежнему обязательно."],
  ], "Not all physical connections offer the same level of performance.", "Не все физические подключения дают одинаковую производительность."),

  qx("Which three kinds of physical connections does a typical home wireless router show?", "Wireless antennas, Ethernet switchports, an internet port", [
    ["A console port, an auxiliary port and a USB storage port", "Those are management ports on enterprise gear, not the three the notes list for a home router.", "Это порты управления корпоративного оборудования, а не три вида из конспекта для домашнего маршрутизатора."],
    ["Fiber port, coaxial port, serial port", "A home router in the notes has antennas, switchports and an internet port, not these.", "У домашнего маршрутизатора в конспекте антенны, порты коммутатора и порт интернета, а не эти."],
    ["Two internet ports and one switchport", "The router has several switchports and only one internet port.", "У маршрутизатора несколько портов коммутатора и только один порт интернета."],
  ], "The home router shows wireless antennas, several Ethernet switchports and one internet port.", "У домашнего маршрутизатора видны антенны Wi-Fi, несколько портов коммутатора Ethernet и один порт интернета."),

  qx("How many internet ports does the home wireless router in the notes have?", "One", [
    ["Two", "There is a single internet port; the multiple ports are the LAN switchports.", "Порт интернета один; несколько портов — это порты коммутатора LAN."],
    ["Four", "Four is the number of LAN switchports in the picture, not internet ports.", "Четыре — число портов LAN на картинке, а не портов интернета."],
    ["None", "The router does have one internet (WAN) port to connect upstream.", "У маршрутизатора есть один порт интернета (WAN) для подключения к провайдеру."],
  ], "The router has several Ethernet switchports but only one internet port.", "У маршрутизатора несколько портов коммутатора Ethernet, но только один порт интернета."),

  qx("Which connector type is shown on the network interface card in the notes?", "RJ-45", [
    ["BNC", "BNC is a coaxial connector, not the one on an Ethernet NIC.", "BNC — коаксиальный разъём, а не разъём сетевой карты Ethernet."],
    ["F-type", "F-type is used for coaxial cable TV and cable internet, not on a NIC.", "F-разъём используется для коаксиального ТВ и кабельного интернета, а не на сетевой карте."],
    ["USB-C", "A USB-C port is not an Ethernet network connector.", "Порт USB-C не является сетевым разъёмом Ethernet."],
  ], "The NIC in the notes has an RJ-45 port, the standard Ethernet copper connector.", "У сетевой карты в конспекте порт RJ-45 — стандартный медный разъём Ethernet."),

  qx("What does the physical layer transport across the network media?", "Bits", [
    ["Frames", "The frame is what the physical layer receives from data link; it then sends bits.", "Кадр — то, что физический уровень получает от канального; дальше он шлёт биты."],
    ["Packets", "Packets are Layer 3 PDUs and are never seen directly by the physical layer.", "Пакеты — PDU уровня 3, и физический уровень напрямую их не видит."],
    ["Segments", "Segments are Layer 4 PDUs; the physical layer deals only with bits.", "Сегменты — PDU уровня 4; физический уровень имеет дело только с битами."],
  ], "The physical layer transports bits across the network media.", "Физический уровень переносит биты по среде передачи."),

  qx("What does the physical layer accept from the data link layer?", "A complete frame", [
    ["A stream of raw bits", "Bits are the physical layer's output onto the medium, not its input from data link.", "Биты — то, что физический уровень выводит в среду, а не то, что получает от канального."],
    ["An IP packet", "The IP packet is already wrapped in a frame by the time it reaches the physical layer.", "К моменту прихода на физический уровень IP-пакет уже обёрнут в кадр."],
    ["A TCP segment", "Segments are handed from transport to network, two layers higher.", "Сегменты передаются от транспортного уровня сетевому, на два уровня выше."],
  ], "The physical layer accepts a complete frame from the data link layer and encodes it as signals.", "Физический уровень принимает готовый кадр от канального уровня и кодирует его в сигналы."),

  qx("What does the physical layer do with the frame it receives?", "Encodes it as a series of signals sent onto the local media", [
    ["Adds a MAC header and a trailer to it before sending it onward", "MAC header and trailer are added by the data link layer before the frame arrives.", "Заголовок и концевик MAC добавляет канальный уровень до прихода кадра."],
    ["Chooses the best path to the destination", "Path selection belongs to the network layer.", "Выбор пути — задача сетевого уровня."],
    ["Splits it into numbered segments", "Segmenting and sequencing are transport layer tasks.", "Сегментация и упорядочивание — задачи транспортного уровня."],
  ], "The physical layer encodes the frame as a series of signals and transmits them onto the local media.", "Физический уровень кодирует кадр в последовательность сигналов и отправляет их в локальную среду."),

  qx("Which step is described as the last step of encapsulation?", "Encoding the frame as signals on the media", [
    ["Adding the Ethernet header and trailer", "Building the frame is the data link step; one more step (signals) follows.", "Создание кадра — шаг канального уровня; за ним есть ещё шаг (сигналы)."],
    ["Adding the IP header to the segment", "Adding the IP header forms the packet, two steps before the end.", "Добавление заголовка IP образует пакет — за два шага до конца."],
    ["Numbering the segments for reassembly", "Sequencing happens at the transport layer, near the top of the process.", "Упорядочивание происходит на транспортном уровне, в начале процесса."],
  ], "Encoding the frame as signals and sending it is the last step of encapsulation, done by the physical layer.", "Кодирование кадра в сигналы и его отправка — последний шаг инкапсуляции, его делает физический уровень."),

  qx("What does the next device do after receiving the bits from the media?", "Re-assembles the frame and decides what to do with it", [
    ["Discards the frame and requests a new copy from the sender", "Receiving bits is normal; nothing is discarded unless the frame is faulty.", "Приём битов — штатная ситуация; ничего не отбрасывается, если кадр не повреждён."],
    ["Converts the bits directly into a web page", "The bits form a frame first; upper layers de-encapsulate it step by step.", "Биты сначала образуют кадр; верхние уровни деинкапсулируют его шаг за шагом."],
    ["Encodes the bits again for the same link", "Re-encoding on the same link would send the data back; the device processes it instead.", "Перекодирование на тот же канал отправило бы данные обратно; устройство их обрабатывает."],
  ], "The receiving device takes the bits, re-assembles the frame and decides how to handle it.", "Принимающее устройство берёт биты, собирает кадр и решает, что с ним делать."),

  qx("How many functional areas do the physical layer standards address?", "Three", [
    ["Two", "There are three areas: physical components, encoding and signaling.", "Областей три: физические компоненты, кодирование и сигнализация."],
    ["Four", "The notes list exactly three areas, not four.", "В конспекте перечислены ровно три области, а не четыре."],
    ["Seven", "Seven is the number of OSI layers, not of physical layer standard areas.", "Семь — число уровней OSI, а не областей стандартов физического уровня."],
  ], "Physical layer standards cover three functional areas: physical components, encoding and signaling.", "Стандарты физического уровня охватывают три области: физические компоненты, кодирование и сигнализацию."),

  qx("Which functional area covers NICs, interfaces, connectors, cable materials and designs?", "Physical components", [
    ["Encoding", "Encoding is about converting bits into a recognizable pattern, not hardware.", "Кодирование — про превращение битов в распознаваемый шаблон, а не про оборудование."],
    ["Signaling", "Signaling is how 1 and 0 are represented on the medium, not the hardware itself.", "Сигнализация — как 1 и 0 представлены в среде, а не само оборудование."],
    ["Bandwidth", "Bandwidth is a capacity measure, not one of the three standard areas.", "Пропускная способность — мера ёмкости, а не одна из трёх областей стандартов."],
  ], "Physical components are the hardware, media and connectors that carry the signals.", "Физические компоненты — оборудование, среда и разъёмы, которые несут сигналы."),

  qx("What does encoding do at the physical layer?", "Turns bits into a predictable pattern the next device can recognize", [
    ["Represents 1 and 0 as electrical, light or microwave signals on media", "That is signaling, the third functional area.", "Это сигнализация — третья область стандартов."],
    ["Encrypts the data so only the receiver can read it", "Encryption is a presentation layer function, not physical layer encoding.", "Шифрование — функция уровня представления, а не кодирование физического уровня."],
    ["Compresses the frame to save bandwidth", "Compression is also a presentation layer job.", "Сжатие — тоже задача уровня представления."],
  ], "Encoding converts the bit stream into a format, a predictable pattern, that the next device can recognize.", "Кодирование превращает поток битов в формат — предсказуемый шаблон, понятный следующему устройству."),

  qx("Which of these lists the encoding methods named in the notes?", "Manchester, 4B/5B, 8B/10B", [
    ["T568A, T568B and Auto-MDIX", "Those are wiring standards and a port feature, not encoding methods.", "Это стандарты разводки и функция порта, а не методы кодирования."],
    ["TCP, UDP, IP", "Those are transport and network layer protocols.", "Это протоколы транспортного и сетевого уровней."],
    ["802.11, 802.15, 802.16", "Those are IEEE wireless standards from the signaling table.", "Это беспроводные стандарты IEEE из таблицы сигнализации."],
  ], "The notes give Manchester, 4B/5B and 8B/10B as examples of encoding.", "В конспекте примеры кодирования — Manchester, 4B/5B и 8B/10B."),

  qx("Which functional area defines how the bit values 1 and 0 are represented on the medium?", "Signaling", [
    ["Encoding", "Encoding shapes the bit stream into a pattern; representing values on the medium is signaling.", "Кодирование придаёт потоку битов шаблон; представление значений в среде — сигнализация."],
    ["Physical components", "Physical components are the hardware and connectors, not the signal representation.", "Физические компоненты — оборудование и разъёмы, а не представление сигнала."],
    ["Multiplexing", "Multiplexing interleaves data streams; it is not a physical layer standard area.", "Мультиплексирование чередует потоки данных и не является областью стандартов физического уровня."],
  ], "Signaling is the method of representing the bit values 1 and 0 on the medium.", "Сигнализация — способ представления значений битов 1 и 0 в среде."),

  qx("How are bits signaled over copper cable?", "As electrical signals", [
    ["As light pulses", "Light pulses are the signaling method for fiber-optic cable.", "Световые импульсы — способ сигнализации в оптоволокне."],
    ["As microwave radio signals", "Microwave signals are used for wireless media.", "Микроволновые сигналы используются в беспроводной среде."],
    ["As magnetic pulses", "The notes do not list magnetic pulses; copper uses electrical impulses.", "Магнитных импульсов в конспекте нет; медь использует электрические импульсы."],
  ], "Over copper, bits are represented by electrical signals (impulses).", "В меди биты представлены электрическими сигналами (импульсами)."),

  qx("Which medium uses microwave signals to represent bits?", "Wireless", [
    ["Copper", "Copper carries electrical impulses.", "Медь несёт электрические импульсы."],
    ["Fiber", "Fiber carries pulses of light from a laser or LED.", "Оптика несёт импульсы света от лазера или светодиода."],
    ["Coaxial cable", "Coaxial is a copper cable and therefore carries electrical signals.", "Коаксиальный кабель — медный и потому несёт электрические сигналы."],
  ], "Wireless media represent bits with microwave (radio) signals.", "Беспроводная среда представляет биты микроволновыми (радио) сигналами."),

  qx("In the media table, what produces the pulses of light on fiber?", "A laser or an LED", [
    ["A radio modulator", "Modulation of radio waves is the wireless row of the table.", "Модуляция радиоволн — строка беспроводной среды в таблице."],
    ["An electrical transformer", "Transformers belong to electrical signaling over copper, not to fiber.", "Трансформаторы относятся к электрической сигнализации в меди, а не к оптике."],
    ["A microwave antenna", "Antennas emit microwave signals for wireless, not light for fiber.", "Антенны излучают микроволны для беспроводной связи, а не свет для оптики."],
  ], "Fiber signals are pulses of light generated by a laser or an LED.", "Сигналы в оптоволокне — импульсы света от лазера или светодиода."),

  qx("Which standards bodies are listed for copper media in the table?", "TIA/EIA cabling and IEEE categories", [
    ["TIA/EIA cabling and ITU-T standards", "TIA/EIA with ITU-T is the fiber row of the table.", "TIA/EIA вместе с ITU-T — строка оптики в таблице."],
    ["IEEE 802.11, 802.15, 802.16", "Those are the wireless standards.", "Это беспроводные стандарты."],
    ["ITU-T and IEEE 802.11", "ITU-T is listed for fiber and 802.11 for wireless, not for copper.", "ITU-T указан для оптики, 802.11 — для радио, а не для меди."],
  ], "Copper cabling is standardized by TIA/EIA, and the IEEE rates cable categories.", "Медные кабели стандартизирует TIA/EIA, а IEEE задаёт категории кабелей."),

  qx("Which standards body appears in the fiber row but not in the copper row?", "ITU-T", [
    ["TIA/EIA", "TIA/EIA appears in both the copper and fiber rows.", "TIA/EIA есть и в строке меди, и в строке оптики."],
    ["IEEE", "IEEE appears for copper categories and for wireless, not for fiber.", "IEEE указан для категорий меди и для радио, а не для оптики."],
    ["IETF", "IETF is not mentioned anywhere in the media table.", "IETF в таблице сред вообще не упоминается."],
  ], "Fiber is standardized by TIA/EIA and ITU-T; ITU-T is unique to the fiber row.", "Оптику стандартизируют TIA/EIA и ITU-T; ITU-T встречается только в строке оптики."),

  qx("Which IEEE standards are listed for wireless media?", "802.11, 802.15, 802.16", [
    ["802.3, 802.1Q, 802.1D", "802.3 is Ethernet and the others are switching standards, not the wireless list in the notes.", "802.3 — Ethernet, остальные — стандарты коммутации, а не беспроводной список из конспекта."],
    ["802.11, 802.3 and 802.5", "802.3 and 802.5 are wired LAN standards, not wireless.", "802.3 и 802.5 — проводные стандарты LAN, а не беспроводные."],
    ["802.15, 802.16, 802.3", "802.3 is wired Ethernet; the wireless trio ends with 802.11, not 802.3.", "802.3 — проводной Ethernet; беспроводная тройка включает 802.11, а не 802.3."],
  ], "The wireless row lists IEEE 802.11, 802.15 and 802.16.", "В строке беспроводной среды указаны IEEE 802.11, 802.15 и 802.16."),

  qx("What is bandwidth?", "The capacity at which a medium can carry data, in bits per second", [
    ["The actual number of bits transferred over a given period of time", "Actual bits transferred is throughput, not bandwidth.", "Реально переданные биты — это throughput, а не bandwidth."],
    ["The time for data to travel from one point to another", "Travel time including delays is latency.", "Время прохождения с задержками — это latency."],
    ["The amount of usable data delivered over a period", "Usable data transferred is goodput.", "Переданные полезные данные — это goodput."],
  ], "Bandwidth is the capacity of a medium to carry data: how many bits can be transmitted per second.", "Пропускная способность — ёмкость среды: сколько битов можно передать за секунду."),

  qx("How many bits per second is 1 Kbps?", "1,000 bps", [
    ["1,024 bps", "The notes use decimal prefixes: 1 Kbps is exactly 1,000 bps.", "В конспекте десятичные приставки: 1 Кбит/с — ровно 1 000 бит/с."],
    ["1,000,000 bps", "One million bps is 1 Mbps.", "Миллион бит/с — это 1 Мбит/с."],
    ["100 bps", "One hundred bps has no prefix in the table; kilo means a thousand.", "Ста бит/с в таблице нет; кило означает тысячу."],
  ], "1 Kbps equals 1,000 bits per second.", "1 Кбит/с равен 1 000 бит в секунду."),

  qx("How many bits per second is 1 Gbps?", "1,000,000,000 bps", [
    ["1,000,000 bps", "One million bps is 1 Mbps, a thousand times less.", "Миллион бит/с — это 1 Мбит/с, в тысячу раз меньше."],
    ["1,000,000,000,000 bps", "One trillion bps is 1 Tbps, a thousand times more.", "Триллион бит/с — это 1 Тбит/с, в тысячу раз больше."],
    ["100,000,000 bps", "One hundred million is a tenth of a gigabit; giga is a billion.", "Сто миллионов — десятая часть гигабита; гига означает миллиард."],
  ], "1 Gbps equals 1,000,000,000 (one billion) bits per second.", "1 Гбит/с равен 1 000 000 000 (одному миллиарду) бит в секунду."),

  qx("Which unit equals 1,000,000,000,000 bps?", "1 Tbps", [
    ["1 Gbps", "1 Gbps is 1,000,000,000 bps, a thousand times smaller.", "1 Гбит/с — 1 000 000 000 бит/с, в тысячу раз меньше."],
    ["1 Mbps", "1 Mbps is 1,000,000 bps.", "1 Мбит/с — 1 000 000 бит/с."],
    ["1 Pbps", "Peta is not in the table; a trillion bps is tera.", "Пета в таблице нет; триллион бит/с — это тера."],
  ], "1 Tbps is one trillion bits per second, 1,000,000,000,000 bps.", "1 Тбит/с — триллион бит в секунду, 1 000 000 000 000 бит/с."),

  qx("By what factor does each step Kbps, Mbps, Gbps, Tbps increase?", "1,000", [
    ["1,024", "The notes use decimal units; each prefix is exactly a thousand times larger.", "В конспекте десятичные единицы; каждая приставка ровно в тысячу раз больше."],
    ["100", "A factor of 100 would make 1 Mbps only 100,000 bps, but it is 1,000,000.", "При множителе 100 1 Мбит/с был бы 100 000 бит/с, а он равен 1 000 000."],
    ["10", "Ten is only one decimal place; kilo to mega is three places.", "Десять — один десятичный разряд; от кило до мега три разряда."],
  ], "Each prefix is 1,000 times the previous one: 1,000; 1,000,000; 1,000,000,000; 1,000,000,000,000.", "Каждая приставка в 1 000 раз больше предыдущей: 1 000; 1 000 000; 1 000 000 000; 1 000 000 000 000."),

  qx("What is latency?", "The time, including delays, for data to travel between two points", [
    ["The capacity of the medium to carry data, measured in bits per second", "Capacity in bits per second is bandwidth.", "Ёмкость в битах в секунду — это bandwidth."],
    ["The measure of bits transferred over a period", "Bits transferred over a period is throughput.", "Переданные за период биты — это throughput."],
    ["The usable data left after overhead", "Usable data after overhead is goodput.", "Полезные данные после вычета служебных — это goodput."],
  ], "Latency is the amount of time, including delays, for data to travel from one given point to another.", "Задержка (latency) — время, включая задержки, за которое данные проходят от одной точки до другой."),

  qx("What is throughput?", "The measure of bits transferred across the media over a period", [
    ["The theoretical maximum capacity of the medium in bits per second", "The theoretical maximum is bandwidth; throughput is what is actually transferred.", "Теоретический максимум — bandwidth; throughput — то, что реально передано."],
    ["The usable data minus retransmissions", "Usable data only is goodput, which is throughput minus overhead.", "Только полезные данные — это goodput, то есть throughput минус служебные."],
    ["The delay before the first bit arrives", "Delay is latency, not throughput.", "Задержка — это latency, а не throughput."],
  ], "Throughput is the measure of the transfer of bits across the media over a given period of time.", "Throughput — сколько битов реально передано через среду за заданный период времени."),

  qx("What is goodput?", "The measure of usable data transferred over a given period", [
    ["The total bits transferred over a period, including all headers", "Total bits including overhead is throughput.", "Все биты вместе со служебными — это throughput."],
    ["The medium's rated capacity in bps", "Rated capacity is bandwidth.", "Паспортная ёмкость — это bandwidth."],
    ["The round-trip time of a packet", "Round-trip time is a latency measure.", "Время туда и обратно — мера задержки."],
  ], "Goodput measures only the usable data transferred over a period of time.", "Goodput измеряет только полезные данные, переданные за период времени."),

  qx("Fill the gap: Goodput = Throughput - ___", "traffic overhead", [
    ["propagation latency", "Latency is a time, not an amount of bits to subtract from throughput.", "Latency — время, а не количество битов, которое вычитают из throughput."],
    ["bandwidth", "Bandwidth is the capacity ceiling, not something subtracted from throughput.", "Bandwidth — потолок ёмкости, а не вычитаемое из throughput."],
    ["encoding", "Encoding is a physical layer function, not a quantity in the formula.", "Кодирование — функция физического уровня, а не величина в формуле."],
  ], "Goodput equals throughput minus the traffic overhead (headers, acknowledgements, retransmissions).", "Goodput равен throughput минус служебный трафик (заголовки, подтверждения, повторы)."),

  qx("A link is sold as 100 Mbps, a transfer shows 60 Mbps and 55 Mbps of that is the file. What is the goodput?", "55 Mbps", [
    ["60 Mbps", "60 Mbps is the throughput, the total bits transferred including overhead.", "60 Мбит/с — throughput, все переданные биты вместе со служебными."],
    ["100 Mbps", "100 Mbps is the bandwidth, the capacity the link is sold at.", "100 Мбит/с — bandwidth, ёмкость, с которой продают канал."],
    ["5 Mbps", "5 Mbps is the overhead (throughput minus goodput), not the goodput.", "5 Мбит/с — служебные данные (throughput минус goodput), а не goodput."],
  ], "Goodput is the usable data: 55 Mbps. Bandwidth is 100 Mbps and throughput is 60 Mbps.", "Goodput — полезные данные: 55 Мбит/с. Bandwidth — 100 Мбит/с, throughput — 60 Мбит/с."),

  qx("A link is sold as 100 Mbps, a transfer shows 60 Mbps and 55 Mbps is the file. Which number is the throughput?", "60 Mbps", [
    ["100 Mbps", "100 Mbps is the bandwidth, what the medium can carry.", "100 Мбит/с — bandwidth, сколько среда может нести."],
    ["55 Mbps", "55 Mbps is the goodput, the usable data only.", "55 Мбит/с — goodput, только полезные данные."],
    ["40 Mbps", "40 Mbps is the unused capacity (bandwidth minus throughput), not a named term.", "40 Мбит/с — неиспользованная ёмкость (bandwidth минус throughput), не именованный термин."],
  ], "Throughput is what the link actually carries during the transfer: 60 Mbps.", "Throughput — сколько канал реально несёт во время передачи: 60 Мбит/с."),

  qx("Which analogy does the table use for bandwidth?", "The width of the road", [
    ["Cars that actually pass", "Cars that actually pass is the analogy for throughput.", "Машины, которые реально проехали, — аналогия для throughput."],
    ["Passengers, not the cars themselves", "Passengers are the analogy for goodput, the useful payload.", "Пассажиры — аналогия для goodput, полезной нагрузки."],
    ["How long one car takes", "How long one car takes is the analogy for latency.", "Сколько едет одна машина — аналогия для latency."],
  ], "Bandwidth is capacity, so it is compared to the width of the road.", "Bandwidth — ёмкость, поэтому сравнивается с шириной дороги."),

  qx("Which term matches the analogy 'passengers, not the cars themselves'?", "Goodput", [
    ["Throughput", "Throughput is the cars that actually pass, including their empty bulk (overhead).", "Throughput — машины, которые проехали, вместе с их «пустым» объёмом (служебными данными)."],
    ["Bandwidth", "Bandwidth is the width of the road.", "Bandwidth — ширина дороги."],
    ["Latency", "Latency is how long one car takes to travel.", "Latency — сколько едет одна машина."],
  ], "Goodput is the useful data only, like passengers rather than the vehicles carrying them.", "Goodput — только полезные данные, как пассажиры, а не везущие их машины."),

  qx("Order these from largest to smallest on a working link: bandwidth, throughput, goodput.", "Bandwidth, throughput, goodput", [
    ["Goodput, throughput, bandwidth", "This is reversed: goodput is the smallest because overhead is removed.", "Порядок обратный: goodput наименьший, так как из него вычтены служебные данные."],
    ["Throughput, bandwidth, goodput", "Throughput cannot exceed bandwidth, the capacity of the medium.", "Throughput не может превышать bandwidth — ёмкость среды."],
    ["Bandwidth, goodput, throughput", "Goodput is throughput minus overhead, so it is below throughput.", "Goodput — это throughput минус служебные данные, поэтому он ниже throughput."],
  ], "Bandwidth is what the medium can carry, throughput is what it actually carries, goodput is what is left after overhead.", "Bandwidth — сколько среда может нести, throughput — сколько реально несёт, goodput — что осталось после служебных данных."),

  tfx("Throughput is usually equal to the bandwidth of the link.", false,
    "Throughput is the actual transfer and is normally lower than bandwidth because of delays and overhead.",
    "Throughput — реальная передача, и обычно он ниже bandwidth из-за задержек и служебного трафика.",
    "Choosing True confuses the medium's capacity with what it actually carries.",
    "Ответ «верно» путает ёмкость среды с тем, сколько она реально несёт."),
];
