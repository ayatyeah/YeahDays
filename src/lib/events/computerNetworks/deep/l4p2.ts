import { qx, tfx, type Draft } from "../../types";

export const deepL4P2: Draft[] = [
  qx("Which three parts make up a data link layer frame?", "Header, data and trailer", [
    ["Preamble, packet and FCS", "Preamble and FCS are specific Ethernet fields, not the three generic parts of a frame.", "Преамбула и FCS — конкретные поля Ethernet, а не три общие части кадра."],
    ["Header, segment and footer", "The payload of a frame is a packet, not a segment, and the end part is called a trailer.", "Полезная нагрузка кадра — пакет, а не сегмент, и концевая часть называется трейлером."],
    ["Address, type and checksum", "Those are individual fields inside the header and trailer, not the three parts.", "Это отдельные поля внутри заголовка и концевика, а не три части кадра."],
  ], "The data link layer wraps the packet with a header in front and a trailer behind; the data is the payload.", "Канальный уровень оборачивает пакет заголовком спереди и концевиком сзади; данные — полезная нагрузка."),

  qx("What does the data link layer add around a packet to build a frame?", "A header and a trailer", [
    ["A header only", "Unlike upper layers, Layer 2 also appends a trailer with error detection after the data.", "В отличие от верхних уровней, уровень 2 добавляет ещё и концевик с обнаружением ошибок."],
    ["A trailer only", "A frame also needs a header for addressing and type information in front of the data.", "Кадру нужен и заголовок — с адресацией и типом перед данными."],
    ["A preamble and a port number", "Port numbers are Layer 4; the generic frame structure is a header and a trailer.", "Номера портов — уровень 4; общая структура кадра — заголовок и концевик."],
  ], "The data link layer wraps the packet with a header and a trailer.", "Канальный уровень оборачивает пакет заголовком и концевиком."),

  qx("Which generic frame field marks the beginning and end of the frame?", "Frame start and stop", [
    ["Addressing field", "The addressing field identifies source and destination nodes, not frame boundaries.", "Поле адресации указывает узлы источника и назначения, а не границы кадра."],
    ["Control field", "The control field provides flow control services.", "Поле управления даёт службы управления потоком."],
    ["Error detection field", "Error detection is used to determine transmission errors, not to mark boundaries.", "Обнаружение ошибок служит для выявления ошибок передачи, а не для обозначения границ."],
  ], "The frame start and stop fields indicate the beginning and end of the frame.", "Поля начала и конца кадра отмечают его границы."),

  qx("What does the generic 'Type' field of a frame identify?", "The encapsulated Layer 3 protocol", [
    ["The physical media in use", "The media is decided by the physical layer; the Type field names the upper protocol.", "Среда определяется физическим уровнем; поле Type называет верхний протокол."],
    ["The length of the trailer", "Trailer length is fixed by the protocol; Type says which Layer 3 protocol is inside.", "Длина концевика задана протоколом; Type говорит, какой протокол уровня 3 внутри."],
    ["The vendor of the sending NIC", "The vendor is encoded in the OUI of the MAC address, not in the Type field.", "Производитель зашит в OUI MAC-адреса, а не в поле Type."],
  ], "The Type field identifies the Layer 3 protocol encapsulated in the frame.", "Поле Type определяет вложенный протокол уровня 3."),

  qx("Which service does the generic 'Control' field of a frame provide?", "Flow control", [
    ["Error correction", "Frames provide error detection only; nothing in the frame corrects errors.", "Кадры дают только обнаружение ошибок; исправления в кадре нет."],
    ["Encryption", "Encryption is not one of the generic frame field functions in the notes.", "Шифрование не входит в функции общих полей кадра по конспекту."],
    ["Routing", "Routing is a Layer 3 function and is not performed by any frame field.", "Маршрутизация — функция уровня 3, никакое поле кадра её не выполняет."],
  ], "The Control field is used for flow control services.", "Поле управления используется для служб управления потоком."),

  qx("What is the purpose of the generic 'Error detection' field of a frame?", "To determine whether transmission errors occurred", [
    ["To correct corrupted bits in the payload", "Error detection only finds errors; a corrupt frame is discarded, not repaired.", "Обнаружение ошибок лишь находит ошибки; повреждённый кадр отбрасывается, а не чинится."],
    ["To request a retransmission from the sender", "Retransmission is handled by upper layers such as TCP, not by the frame field.", "Повторную передачу организуют верхние уровни (TCP), а не поле кадра."],
    ["To identify the sending and receiving nodes", "Identifying nodes is the job of the addressing field.", "Узлы определяет поле адресации."],
  ], "The error detection field is used to determine transmission errors.", "Поле обнаружения ошибок служит для выявления ошибок передачи."),

  qx("What is another name for Layer 2 addresses?", "Physical addresses", [
    ["Logical addresses", "Logical addresses are IP addresses at Layer 3.", "Логические адреса — это IP-адреса уровня 3."],
    ["Transport port addresses", "Ports belong to the transport layer, not to the frame header.", "Порты относятся к транспортному уровню, а не к заголовку кадра."],
    ["Network addresses", "Network addresses identify IP networks at Layer 3.", "Сетевые адреса определяют IP-сети на уровне 3."],
  ], "Layer 2 addresses are also called physical addresses and sit in the frame header.", "Адреса уровня 2 называют физическими; они находятся в заголовке кадра."),

  qx("For what are Layer 2 addresses used?", "Local delivery on a single link", [
    ["End-to-end delivery across the internet", "End-to-end delivery is done with Layer 3 IP addresses, not Layer 2 addresses.", "Сквозную доставку обеспечивают IP-адреса уровня 3, а не адреса уровня 2."],
    ["Identifying the application on the host", "Applications are identified by transport layer ports.", "Приложения определяются портами транспортного уровня."],
    ["Selecting the best path through routers", "Path selection is routing at Layer 3.", "Выбор пути — маршрутизация на уровне 3."],
  ], "Layer 2 addresses are used only for local delivery of the frame on the link.", "Адреса уровня 2 нужны только для локальной доставки кадра на участке."),

  qx("What happens to the Layer 2 addresses of a frame as it crosses several routers?", "Each forwarding device updates them", [
    ["They stay the same end to end", "Only Layer 3 addresses stay constant; Layer 2 addresses are rewritten per hop.", "Неизменными остаются адреса уровня 3; адреса уровня 2 переписываются на каждом участке."],
    ["Only the destination MAC is kept", "Both source and destination MAC are replaced on each new link.", "На каждом новом участке меняются и MAC источника, и MAC назначения."],
    ["They are removed until the last hop", "Every link needs Layer 2 addresses for local delivery, so they are never removed.", "На каждом участке нужны адреса уровня 2 для локальной доставки, они не удаляются."],
  ], "Layer 2 addresses are updated by each device that forwards the frame.", "Адреса уровня 2 обновляются каждым устройством, пересылающим кадр."),

  qx("What decides which data link protocol is used on a link?", "The logical topology and the physical media", [
    ["The transport layer protocol", "TCP or UDP has no influence on the Layer 2 protocol chosen for a link.", "TCP или UDP никак не влияют на выбор протокола уровня 2 для канала."],
    ["The size of the IP packet", "Packet size affects padding or fragmentation, not which Layer 2 protocol is used.", "Размер пакета влияет на дополнение или фрагментацию, но не на выбор протокола уровня 2."],
    ["The number of hosts on the LAN", "Host count does not select the protocol; topology and media do.", "Число хостов протокол не выбирает; его определяют топология и среда."],
  ], "The logical topology and the physical media decide which data link protocol is used.", "Какой протокол используется, определяют логическая топология и физическая среда."),

  qx("Which of the following is a list of data link layer protocols from the notes?", "Ethernet, 802.11, PPP, HDLC, Frame Relay", [
    ["IPv4, IPv6, ICMP, ARP, OSPF", "These are network layer protocols, not Layer 2 frame formats.", "Это протоколы сетевого уровня, а не форматы кадров уровня 2."],
    ["TCP, UDP, HTTP, DNS, DHCP", "These are transport and application layer protocols.", "Это протоколы транспортного и прикладного уровней."],
    ["802.2, 802.3, 802.11, 802.15, 802.1Q", "This mixes IEEE standard numbers; the notes list protocols by name including PPP and HDLC.", "Здесь перемешаны номера стандартов IEEE; в конспекте протоколы названы по именам, включая PPP и HDLC."],
  ], "The notes list Ethernet, 802.11 wireless, PPP, HDLC and Frame Relay as LAN and WAN data link protocols.", "В конспекте перечислены Ethernet, беспроводной 802.11, PPP, HDLC и Frame Relay как протоколы LAN и WAN."),

  qx("At which OSI layers does Ethernet operate?", "Data link and physical", [
    ["Network and data link layers", "Ethernet does not operate at the network layer; IP does.", "Ethernet не работает на сетевом уровне — там работает IP."],
    ["Physical layer only", "Ethernet also defines the frame format and MAC addressing at the data link layer.", "Ethernet определяет ещё формат кадра и MAC-адресацию на канальном уровне."],
    ["Data link layer only", "Ethernet also covers the physical layer, defining cabling and signalling.", "Ethernet охватывает и физический уровень — кабели и сигналы."],
  ], "Ethernet works at the data link and physical layers.", "Ethernet работает на канальном и физическом уровнях."),

  qx("Which IEEE standards define the Ethernet family?", "IEEE 802.2 and 802.3", [
    ["IEEE 802.11 and 802.15", "802.11 is wireless LAN and 802.15 is personal area networks, not Ethernet.", "802.11 — беспроводные сети, 802.15 — персональные сети, а не Ethernet."],
    ["IEEE 802.3 and 802.11", "802.11 is Wi-Fi; Ethernet pairs 802.3 with the LLC standard 802.2.", "802.11 — Wi-Fi; Ethernet сочетает 802.3 со стандартом LLC 802.2."],
    ["IEEE 802.1 and 802.2", "802.2 alone is LLC; Ethernet's MAC and physical layers are in 802.3, not 802.1.", "802.2 — только LLC; MAC и физический уровень Ethernet описаны в 802.3, а не 802.1."],
  ], "Ethernet is a family of technologies defined in IEEE 802.2 and 802.3.", "Ethernet — семейство технологий, описанных в IEEE 802.2 и 802.3."),

  qx("How long is the Ethernet preamble?", "7 bytes", [
    ["1 byte", "1 byte is the Start Frame Delimiter that follows the preamble.", "1 байт — это начальный ограничитель кадра (SFD), идущий после преамбулы."],
    ["8 bytes", "8 bytes is the preamble plus the SFD together; the preamble alone is 7.", "8 байт — преамбула вместе с SFD; сама преамбула — 7."],
    ["6 bytes", "6 bytes is the size of a MAC address field, not the preamble.", "6 байт — размер поля MAC-адреса, а не преамбулы."],
  ], "The preamble is 7 bytes and is followed by a 1-byte Start Frame Delimiter.", "Преамбула — 7 байт, за ней идёт начальный ограничитель кадра в 1 байт."),

  qx("How large is the Start Frame Delimiter (SFD)?", "1 byte", [
    ["7 bytes", "7 bytes is the preamble that precedes the SFD.", "7 байт — преамбула, предшествующая SFD."],
    ["2 bytes", "2 bytes is the size of the Type / Length field.", "2 байта — размер поля Тип / длина."],
    ["4 bytes", "4 bytes is the size of the FCS at the end of the frame.", "4 байта — размер FCS в конце кадра."],
  ], "The SFD is a single byte that marks the start of the frame after the 7-byte preamble.", "SFD — один байт, отмечающий начало кадра после 7-байтовой преамбулы."),

  qx("What is the purpose of the preamble and SFD?", "Synchronize the receiver's clock and mark the frame start", [
    ["Identify the sender and the receiver", "Addressing is done by the destination and source MAC fields.", "Адресацию выполняют поля MAC назначения и источника."],
    ["Carry the CRC for error detection", "The CRC is in the FCS field at the end of the frame.", "CRC находится в поле FCS в конце кадра."],
    ["Announce the length of the payload", "Payload length or type is given in the Type / Length field.", "Длину или тип нагрузки задаёт поле Тип / длина."],
  ], "The preamble and SFD synchronize the receiver's clock and mark the start of the frame.", "Преамбула и SFD синхронизируют часы приёмника и отмечают начало кадра."),

  qx("How many bytes does the destination MAC address field occupy?", "6 bytes", [
    ["4 bytes", "4 bytes is the FCS; a MAC address is 48 bits, which is 6 bytes.", "4 байта — FCS; MAC-адрес — 48 бит, то есть 6 байт."],
    ["2 bytes", "2 bytes is the Type / Length field.", "2 байта — поле Тип / длина."],
    ["8 bytes", "8 bytes is the preamble plus SFD, not an address field.", "8 байт — преамбула вместе с SFD, а не поле адреса."],
  ], "Both the destination and the source MAC address fields are 6 bytes each.", "Поля MAC назначения и MAC источника — по 6 байт каждое."),

  qx("Which statement about the source MAC address field is true?", "It is 6 bytes and always holds a unicast address", [
    ["It is 6 bytes and may hold a broadcast address", "Broadcast can only appear as a destination; the source is always unicast.", "Широковещательный адрес бывает только в назначении; источник всегда unicast."],
    ["It is 2 bytes and identifies the upper protocol", "That describes the Type / Length field, not the source MAC.", "Это описание поля Тип / длина, а не MAC источника."],
    ["It is 4 bytes and is checked for errors", "4 bytes with error checking is the FCS, not an address field.", "4 байта с проверкой ошибок — это FCS, а не поле адреса."],
  ], "The source MAC address is a 6-byte field that is always a unicast address.", "MAC источника — 6-байтовое поле, в котором всегда одноадресный адрес."),

  qx("How large is the Type / Length (EtherType) field?", "2 bytes", [
    ["1 byte", "1 byte is the SFD; EtherType values such as 0x0800 need two bytes.", "1 байт — SFD; значения EtherType вроде 0x0800 требуют двух байт."],
    ["4 bytes", "4 bytes is the FCS at the end of the frame.", "4 байта — FCS в конце кадра."],
    ["6 bytes", "6 bytes is the size of a MAC address field.", "6 байт — размер поля MAC-адреса."],
  ], "The Type / Length field is 2 bytes and identifies the upper-layer protocol.", "Поле Тип / длина — 2 байта, оно определяет протокол верхнего уровня."),

  qx("An Ethernet frame carries the EtherType value 0x0800. What is encapsulated?", "An IPv4 packet", [
    ["An IPv6 packet", "IPv6 is signalled by 0x86DD.", "IPv6 обозначается значением 0x86DD."],
    ["An ARP message", "ARP uses EtherType 0x0806.", "ARP использует EtherType 0x0806."],
    ["A padded empty payload", "Padding is about the data length, not the Type value; 0x0800 still means IPv4.", "Дополнение связано с длиной данных, а не с типом; 0x0800 всё равно означает IPv4."],
  ], "EtherType 0x0800 identifies IPv4.", "EtherType 0x0800 означает IPv4."),

  qx("Which EtherType value identifies an IPv6 packet?", "0x86DD", [
    ["0x0800", "0x0800 is IPv4.", "0x0800 — это IPv4."],
    ["0x0806", "0x0806 is ARP.", "0x0806 — это ARP."],
    ["0x8100", "0x8100 is not one of the three EtherType values given in the notes.", "0x8100 не входит в три значения EtherType из конспекта."],
  ], "0x86DD is the EtherType for IPv6; 0x0800 is IPv4 and 0x0806 is ARP.", "0x86DD — EtherType для IPv6; 0x0800 — IPv4, 0x0806 — ARP."),

  qx("A frame's Type field is 0x0806. Which protocol does the payload belong to?", "ARP", [
    ["IPv4", "IPv4 is 0x0800, not 0x0806.", "IPv4 — это 0x0800, а не 0x0806."],
    ["IPv6", "IPv6 is 0x86DD.", "IPv6 — это 0x86DD."],
    ["ICMP", "ICMP travels inside IP packets and has no EtherType of its own in the notes.", "ICMP передаётся внутри IP-пакетов, своего EtherType в конспекте у него нет."],
  ], "EtherType 0x0806 identifies ARP.", "EtherType 0x0806 означает ARP."),

  qx("What is the allowed range of the Data field in an Ethernet frame?", "46 to 1500 bytes", [
    ["64 to 1518 bytes", "64–1518 is the size of the whole frame, not the Data field.", "64–1518 — размер всего кадра, а не поля данных."],
    ["46 to 1518 bytes", "The upper bound 1518 includes 18 bytes of header and trailer; data stops at 1500.", "Верхняя граница 1518 включает 18 байт заголовка и концевика; данные — до 1500."],
    ["64 to 1500 bytes", "64 is the minimum frame size; the data minimum is 46 bytes.", "64 — минимум кадра; минимум данных — 46 байт."],
  ], "The Data field holds 46 to 1500 bytes; shorter payloads are padded to 46.", "Поле данных — от 46 до 1500 байт; более короткая нагрузка дополняется до 46."),

  qx("A host needs to send a 20-byte payload in an Ethernet frame. What happens to the payload?", "It is padded to 46 bytes", [
    ["It is sent as a 20-byte data field", "The data field can never be below 46 bytes; padding is added.", "Поле данных не может быть меньше 46 байт; добавляется дополнение."],
    ["It is padded to 64 bytes", "64 bytes is the minimum for the whole frame; the data field itself is padded to 46.", "64 байта — минимум всего кадра; само поле данных дополняется до 46."],
    ["The frame is dropped as a runt", "A runt is a received frame under 64 bytes; the sender avoids that by padding.", "Runt — принятый кадр короче 64 байт; отправитель избегает этого дополнением."],
  ], "A payload shorter than 46 bytes is padded to 46 bytes.", "Нагрузка короче 46 байт дополняется до 46 байт."),

  qx("What does the FCS field contain and how large is it?", "A 4-byte CRC", [
    ["A 2-byte checksum", "2 bytes is the size of the Type / Length field; the FCS is 4 bytes.", "2 байта — размер поля Тип / длина; FCS занимает 4 байта."],
    ["A 6-byte hash", "6 bytes is a MAC address field size, not the FCS.", "6 байт — размер поля MAC-адреса, а не FCS."],
    ["A 1-byte parity", "1 byte is the SFD; the FCS uses a 4-byte cyclic redundancy check.", "1 байт — SFD; FCS использует 4-байтовую циклическую проверку."],
  ], "The Frame Check Sequence is 4 bytes and holds a CRC used for error detection.", "Контрольная последовательность кадра — 4 байта, в ней CRC для обнаружения ошибок."),

  qx("The FCS of a received frame does not match the calculated value. What does Ethernet do?", "Drops the frame; upper layers such as TCP handle retransmission", [
    ["Corrects the error using the CRC", "A CRC can only detect errors; it has no information to correct them.", "CRC лишь обнаруживает ошибки; исправить их по нему нельзя."],
    ["Sends an Ethernet NAK to the sender", "Ethernet has no acknowledgement or NAK mechanism; the frame is simply discarded.", "В Ethernet нет механизма подтверждений или NAK — кадр просто отбрасывается."],
    ["Forwards the frame with an error flag", "A corrupt frame is never passed on; it is discarded on receipt.", "Повреждённый кадр дальше не передаётся, он отбрасывается при получении."],
  ], "FCS only detects the error; the frame is dropped and upper layers (TCP) take care of retransmission.", "FCS только обнаруживает ошибку; кадр отбрасывается, а повторной передачей занимается верхний уровень (TCP)."),

  qx("What is the minimum size of a valid Ethernet frame?", "64 bytes", [
    ["46 bytes", "46 bytes is the minimum Data field, not the minimum frame.", "46 байт — минимум поля данных, а не кадра."],
    ["72 bytes", "72 would be 64 plus the 8-byte preamble and SFD, but the preamble is not counted.", "72 — это 64 плюс 8 байт преамбулы и SFD, но преамбула не учитывается."],
    ["18 bytes", "18 bytes is the header and trailer overhead (6 + 6 + 2 + 4) without any data.", "18 байт — заголовок и концевик (6 + 6 + 2 + 4) без данных."],
  ], "The minimum Ethernet frame is 64 bytes: 6 + 6 + 2 + 46 + 4.", "Минимальный кадр Ethernet — 64 байта: 6 + 6 + 2 + 46 + 4."),

  qx("What is the maximum size of a standard Ethernet frame?", "1518 bytes", [
    ["1500 bytes", "1500 bytes is the maximum Data field; the frame adds 18 bytes of header and trailer.", "1500 байт — максимум поля данных; кадр добавляет 18 байт заголовка и концевика."],
    ["1526 bytes", "1526 would include the 8-byte preamble and SFD, which are not counted.", "1526 включали бы 8 байт преамбулы и SFD, а они не учитываются."],
    ["1536 bytes", "1536 is not an Ethernet frame limit from the notes.", "1536 — не предел кадра Ethernet по конспекту."],
  ], "The maximum standard frame is 1518 bytes: 1500 bytes of data plus 18 bytes of header and trailer.", "Максимальный стандартный кадр — 1518 байт: 1500 байт данных плюс 18 байт заголовка и концевика."),

  qx("Which fields add up to the 64-byte minimum frame?", "6 + 6 + 2 + 46 + 4", [
    ["7 + 1 + 6 + 6 + 2 + 42", "This counts the preamble and SFD, which are excluded, and shrinks the data below 46.", "Здесь учтены преамбула и SFD, которые исключаются, а данные ужаты ниже 46."],
    ["6 + 6 + 4 + 48", "The Type / Length field is missing and 48 is not the data minimum.", "Не хватает поля Тип / длина, а 48 — не минимум данных."],
    ["8 + 6 + 6 + 2 + 42", "The 8-byte preamble and SFD are not part of the frame size calculation.", "8 байт преамбулы и SFD не входят в расчёт размера кадра."],
  ], "64 bytes = destination MAC 6 + source MAC 6 + Type 2 + minimum data 46 + FCS 4.", "64 байта = MAC назначения 6 + MAC источника 6 + Тип 2 + минимум данных 46 + FCS 4."),

  qx("Is the preamble counted in the 64–1518 byte frame size?", "No, the preamble is not counted", [
    ["Yes, together with the 1-byte SFD", "The 7-byte preamble and 1-byte SFD are excluded from the frame size.", "7 байт преамбулы и 1 байт SFD в размер кадра не входят."],
    ["Only in the minimum size", "The preamble is excluded from both the minimum and the maximum.", "Преамбула исключена и из минимума, и из максимума."],
    ["Only in the maximum size", "Neither limit includes the preamble.", "Ни одна из границ преамбулу не включает."],
  ], "The frame size limits of 64 and 1518 bytes do not count the preamble.", "Размеры кадра 64 и 1518 байт указаны без учёта преамбулы."),

  qx("A switch receives a 50-byte frame. What is it called and what happens to it?", "A runt (collision fragment); it is discarded", [
    ["A baby giant; it is forwarded", "Baby giants are frames with more than 1500 bytes of data, not short frames.", "Baby giant — кадры с данными больше 1500 байт, а не короткие кадры."],
    ["A padded frame; it is forwarded", "Padding happens at the sender to reach 46 data bytes; a received 50-byte frame is invalid.", "Дополнение делает отправитель до 46 байт данных; принятый кадр в 50 байт недействителен."],
    ["A jumbo frame; it is discarded", "A jumbo frame is one that is too large, not a frame under 64 bytes.", "Jumbo — слишком большой кадр, а не кадр меньше 64 байт."],
  ], "Frames shorter than 64 bytes are collision fragments or runt frames and are discarded.", "Кадры короче 64 байт — фрагменты коллизии или runt-кадры, они отбрасываются."),

  qx("What are frames with more than 1500 bytes of data called?", "Jumbo or baby giant frames", [
    ["Runt or collision fragments", "Runts are frames shorter than 64 bytes, the opposite case.", "Runt — кадры короче 64 байт, обратный случай."],
    ["Padded or extended frames", "Padding applies to payloads shorter than 46 bytes, not to oversized ones.", "Дополнение применяется к нагрузке короче 46 байт, а не к слишком большим кадрам."],
    ["Broadcast or multicast frames", "Those terms describe the destination address type, not the frame size.", "Эти термины описывают тип адреса назначения, а не размер кадра."],
  ], "Frames with more than 1500 bytes of data are jumbo or baby giant frames.", "Кадры с данными больше 1500 байт — jumbo или baby giant."),

  qx("What does a receiver do with a frame that is too small or too large?", "Drops it", [
    ["Truncates it to 1518 bytes", "Oversized frames are not trimmed; any frame outside the limits is dropped.", "Слишком большие кадры не обрезаются; кадр вне пределов отбрасывается."],
    ["Pads it to 64 bytes", "Padding is done by the sender before transmission; a received short frame is invalid.", "Дополнение делает отправитель до передачи; принятый короткий кадр недействителен."],
    ["Forwards it with a warning", "Invalid frames are never forwarded.", "Недействительные кадры дальше не передаются."],
  ], "A frame that is too small or too large is dropped by the receiver.", "Слишком маленький или слишком большой кадр приёмник отбрасывает."),

  qx("How many bytes of header and trailer does a standard Ethernet frame add to its payload?", "18 bytes", [
    ["26 bytes", "26 would include the preamble and SFD, which are not counted in the frame size.", "26 включали бы преамбулу и SFD, которые в размер кадра не входят."],
    ["14 bytes", "14 bytes is only the header (6 + 6 + 2); the 4-byte FCS trailer must be added.", "14 байт — только заголовок (6 + 6 + 2); нужно добавить 4-байтовый концевик FCS."],
    ["20 bytes", "20 bytes is a typical IPv4 header, not the Ethernet overhead.", "20 байт — типичный заголовок IPv4, а не накладные расходы Ethernet."],
  ], "6 + 6 + 2 bytes of header plus 4 bytes of FCS give 18 bytes: 1500 + 18 = 1518.", "6 + 6 + 2 байта заголовка плюс 4 байта FCS дают 18 байт: 1500 + 18 = 1518."),

  qx("According to the frame table, what is the purpose of the destination MAC field?", "Identifies who receives the frame on this LAN", [
    ["Identifies the upper-layer protocol", "That is the Type / Length field.", "Это поле Тип / длина."],
    ["Identifies the final host across the internet", "The final host is identified by the IP address; the MAC is for this LAN only.", "Конечный хост определяется IP-адресом; MAC нужен только в этой LAN."],
    ["Carries the CRC used for error detection", "The CRC lives in the FCS field.", "CRC находится в поле FCS."],
  ], "The destination MAC tells who receives the frame on this LAN.", "MAC назначения говорит, кто получает кадр в этой LAN."),

  tfx("The FCS field allows the receiver to correct single-bit errors in the frame.", false,
    "The FCS is a CRC used only for error detection; a frame with a bad FCS is dropped.", "FCS — это CRC только для обнаружения ошибок; кадр с неверным FCS отбрасывается.",
    "Believing the FCS corrects errors confuses detection with correction; Ethernet never repairs frames.", "Считать, что FCS исправляет ошибки, значит путать обнаружение с исправлением; Ethernet кадры не чинит."),

  tfx("The Ethernet payload range is 46–1500 bytes while the whole frame range is 64–1518 bytes.", true,
    "The callout states exactly this: payload 46–1500, whole frame 64–1518.", "В заметке именно так: нагрузка 46–1500, весь кадр 64–1518.",
    "Treating this as false would mix up the data field limits with the frame limits, which differ by 18 bytes.", "Считать это неверным — значит перепутать пределы поля данных с пределами кадра, различающимися на 18 байт."),

  tfx("The FCS can be used to encrypt the contents of an Ethernet frame.", false,
    "FCS = CRC = error detection; it never provides correction or encryption.", "FCS = CRC = обнаружение ошибок; ни исправления, ни шифрования он не даёт.",
    "A CRC is a public checksum, not a cipher, so it cannot hide any data.", "CRC — открытая контрольная сумма, а не шифр, скрыть данные она не может."),
];
