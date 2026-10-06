import { qx, tfx, type Draft } from "../../types";

/** Лекция 3, часть 3 — оптоволокно и беспроводная среда: разбор до косточек. */
export const deepL3P3: Draft[] = [
  qx("Which medium carries data over the longest distances and at the highest bandwidth?", "Fiber-optic cable", [
    ["Unshielded twisted pair", "UTP is limited to 100 m and 10 Gb/s; fiber reaches 100 km and 100 Gb/s.", "UTP ограничен 100 м и 10 Гбит/с; оптика достигает 100 км и 100 Гбит/с."],
    ["Shielded twisted pair", "STP adds noise protection to UTP but keeps the copper distance limits.", "STP добавляет защиту от помех, но сохраняет медные пределы расстояния."],
    ["Coaxial cable", "Coax is used for antennas and cable internet, not for the longest high-bandwidth links.", "Коаксиал — для антенн и кабельного интернета, а не для самых длинных и быстрых каналов."],
  ], "Fiber transmits data over longer distances and at higher bandwidth than any other networking medium.", "Оптика передаёт данные дальше и с большей пропускной способностью, чем любая другая среда."),

  qx("What is a fiber-optic cable made of?", "Flexible, extremely thin strands of very pure glass", [
    ["Twisted pairs of very pure copper wire", "Copper pairs are UTP and STP; fiber carries light, not current.", "Медные пары — это UTP и STP; оптика передаёт свет, а не ток."],
    ["A single copper core inside thick plastic insulation", "A copper core in insulation is coaxial cable.", "Медная жила в изоляции — это коаксиальный кабель."],
    ["Hollow plastic tubes filled with dry air", "Fiber is solid glass strands, not air-filled tubes.", "Оптика — сплошные стеклянные нити, а не трубки с воздухом."],
  ], "Fiber consists of flexible, extremely thin strands of very pure glass that carry pulses of light.", "Оптоволокно состоит из гибких, очень тонких нитей чистого стекла, несущих импульсы света."),

  qx("How are bits encoded on a fiber-optic cable?", "A laser or LED sends them as pulses of light", [
    ["Voltage changes travel along a copper core", "Voltage on copper is how twisted pair and coax work, not fiber.", "Напряжение на меди — принцип витой пары и коаксиала, а не оптики."],
    ["Radio waves are sent at microwave frequencies", "Radio and microwave frequencies belong to wireless media.", "Радио- и микроволновые частоты — это беспроводная среда."],
    ["Magnetic fields are induced in twisted pairs", "Twisted pairs and magnetic cancellation are UTP concepts.", "Витые пары и гашение магнитных полей — понятия UTP."],
  ], "A laser or an LED encodes the bits as pulses of light travelling through the glass strands.", "Лазер или светодиод кодирует биты импульсами света, идущими по стеклянным нитям."),

  qx("Why is fiber not as common as UTP?", "Because of its expense", [
    ["Because it is affected by EMI", "Fiber is completely immune to EMI and RFI; that is a strength, not a reason to avoid it.", "Оптика полностью невосприимчива к EMI и RFI; это плюс, а не причина её избегать."],
    ["Because it cannot exceed 100 m", "100 m is the UTP limit; fiber reaches up to 100,000 m.", "100 м — предел UTP; оптика достигает 100 000 м."],
    ["Because it tops out at 10 Mb/s", "Fiber bandwidth goes up to 100 Gb/s, far beyond 10 Mb/s.", "Пропускная способность оптики доходит до 100 Гбит/с, намного больше 10 Мбит/с."],
  ], "Fiber has the highest costs, installation skill and safety requirements, so UTP remains more common.", "У оптики самые высокие стоимость и требования к монтажу и безопасности, поэтому UTP остаётся распространённее."),

  tfx("Fiber-optic cable is less susceptible to attenuation than copper and completely immune to EMI and RFI.", true,
    "Light in glass is not affected by electromagnetic or radio interference, and it attenuates far less than an electrical signal in copper.",
    "Свет в стекле не подвержен электромагнитным и радиопомехам и затухает намного меньше, чем электрический сигнал в меди.",
    "Only copper media need shielding against EMI/RFI; fiber carries no electrical current to disturb.",
    "Экран от EMI/RFI нужен только медным средам; в оптике нет электрического тока, который можно исказить."),

  qx("Which description matches single-mode fiber?", "Very small core, lasers, long-distance links", [
    ["Larger core, LEDs, links up to 550 m", "That is multimode fiber.", "Это многомодовое волокно."],
    ["Very small core, LEDs, links up to 550 m", "SMF uses lasers, not LEDs, and is not limited to 550 m.", "В SMF лазеры, а не светодиоды, и предел не 550 м."],
    ["Larger core, lasers, long-distance links", "The large core belongs to MMF; SMF has a very small core.", "Толстая сердцевина — у MMF; у SMF она очень тонкая."],
  ], "SMF has a very small core, uses expensive lasers and is built for long-distance applications.", "У SMF очень тонкая сердцевина, дорогие лазеры и назначение — большие расстояния."),

  qx("Which light source does multimode fiber typically use, and why?", "LEDs, because they are cheaper", [
    ["Lasers, because the core is very small", "A very small core with lasers is single-mode fiber.", "Очень тонкая сердцевина с лазерами — это одномодовое волокно."],
    ["LEDs, because they reach 100 km", "LEDs are the cheaper source; the 100 km range belongs to laser-driven SMF.", "Светодиоды — более дешёвый источник; дальность 100 км — у SMF с лазерами."],
    ["Lasers, because they are cheaper", "Lasers are the expensive source used in SMF; MMF saves money with LEDs.", "Лазеры — дорогой источник для SMF; MMF экономит на светодиодах."],
  ], "MMF has a larger core, so cheaper LEDs can be used as the light source.", "У MMF сердцевина толще, поэтому источником света служат более дешёвые светодиоды."),

  qx("Which feature belongs to multimode fiber?", "Light enters the core at different angles", [
    ["The core is very small and driven by lasers", "A very small laser-driven core is single-mode fiber.", "Очень тонкая сердцевина с лазером — одномодовое волокно."],
    ["It reaches 100,000 m for long-haul links", "Long-haul distances are the domain of single-mode fiber.", "Дальняя связь — область одномодового волокна."],
    ["Its patch cords have a yellow jacket", "Yellow marks single-mode; multimode is orange or aqua.", "Жёлтый — одномодовое; многомодовое — оранжевое или аква."],
  ], "In MMF the larger core lets light enter at different angles; the result is more dispersion and a 550 m limit.", "В MMF толстая сердцевина пропускает свет под разными углами; отсюда большая дисперсия и предел 550 м."),

  qx("Two buildings 400 m apart need a 10 Gbps link. Which cable works, and why?", "Multimode fiber: 10 Gbps up to 550 m", [
    ["Cat6 UTP: 10 Gbps up to 100 m", "Cat6 tops out at 100 m, far short of 400 m.", "Cat6 ограничен 100 м, до 400 м далеко."],
    ["Coaxial: made for building links", "Coax is for antennas and cable internet, not 10 Gbps building links.", "Коаксиал — для антенн и кабельного интернета, а не 10-гигабитных каналов между зданиями."],
    ["Single-mode only: multimode stops at 100 m", "Multimode reaches 550 m at 10 Gbps; 100 m is the UTP limit.", "Многомодовое волокно даёт 550 м на 10 Гбит/с; 100 м — предел UTP."],
  ], "MMF carries up to 10 Gbps over 550 meters, so 400 m fits comfortably.", "MMF передаёт до 10 Гбит/с на 550 метров, так что 400 м укладываются с запасом."),

  qx("Which fiber has greater dispersion, and what does it limit?", "Multimode; its distance", [
    ["Single-mode; its distance", "SMF has less dispersion, which is why it goes the farthest.", "У SMF дисперсия меньше, поэтому оно и идёт дальше всех."],
    ["Multimode; its immunity to EMI", "Dispersion is about the light pulse spreading; both fibers stay immune to EMI.", "Дисперсия — расплывание импульса; обе оптики остаются невосприимчивы к EMI."],
    ["Single-mode; its bandwidth", "Dispersion is greater in MMF, and it limits distance (550 m), not SMF bandwidth.", "Дисперсия больше у MMF и ограничивает расстояние (550 м), а не пропускную способность SMF."],
  ], "Dispersion is the spreading of a light pulse over time; MMF has more of it, which caps it at about 550 m.", "Дисперсия — расплывание светового импульса во времени; у MMF она больше, отсюда предел около 550 м."),

  qx("Where is fiber used, according to the notes?", "Enterprise backbones, FTTH, long-haul and submarine links", [
    ["Console port access, antenna feeds and cable internet service", "Console is rollover, antennas and cable internet are coaxial.", "Консоль — rollover, антенны и кабельный интернет — коаксиал."],
    ["Host-to-switch patching in most LANs", "Host to switch is UTP; fiber is too expensive for that role.", "Хост с коммутатором соединяет UTP; оптика для этого слишком дорога."],
    ["Personal area networks and IoT sensors", "WPAN and IoT are wireless: Bluetooth and Zigbee.", "WPAN и интернет вещей — беспроводные: Bluetooth и Zigbee."],
  ], "Fiber serves enterprise backbones, Fiber-to-the-Home, long-haul networks and submarine cable networks.", "Оптика работает в магистралях предприятий, FTTH, сетях дальней связи и подводных кабелях."),

  qx("What does FTTH stand for?", "Fiber-to-the-Home", [
    ["Fiber-to-the-Host", "The H is Home: fiber brought to residential subscribers.", "H означает Home: оптика до жилья абонента."],
    ["Fiber-to-the-Hub", "FTTH ends at the home, not at a hub.", "FTTH заканчивается в доме, а не в хабе."],
    ["Fiber-Through-the-Hall", "There is no such term; FTTH is Fiber-to-the-Home.", "Такого термина нет; FTTH — Fiber-to-the-Home."],
  ], "FTTH, Fiber-to-the-Home, is one of the listed uses of fiber-optic cable.", "FTTH — оптика до дома — одно из перечисленных применений оптоволокна."),

  qx("Which connector is the older bayonet style locked with a twist?", "ST", [
    ["SC", "SC is square and locks with a push-pull motion.", "SC квадратный и фиксируется движением push-pull."],
    ["LC", "LC is the smaller SC variant with a latch like RJ-45.", "LC — уменьшенный SC с защёлкой, как у RJ-45."],
    ["RJ-45", "RJ-45 is a copper twisted-pair connector, not fiber.", "RJ-45 — разъём медной витой пары, а не оптики."],
  ], "ST (straight-tip) is the older bayonet-style fiber connector: twist to lock.", "ST (straight-tip) — старый байонетный оптический разъём: фиксируется поворотом."),

  qx("Which statement describes the LC connector?", "A smaller version of SC, simplex or duplex", [
    ["A round bayonet connector locked by a twist", "Round bayonet twist-lock describes ST.", "Круглый байонет с поворотом — это ST."],
    ["A square connector larger than SC", "LC is smaller than SC, not larger.", "LC меньше SC, а не больше."],
    ["A copper connector used on UTP cable", "The UTP connector is RJ-45; LC is for fiber.", "Разъём UTP — RJ-45; LC — для оптики."],
  ], "LC (Lucent connector) is a smaller version of SC and comes in simplex or duplex form.", "LC (Lucent connector) — уменьшенная версия SC, одиночный или сдвоенный."),

  qx("How does an LC connector lock?", "With a latch, like RJ-45", [
    ["By twisting a bayonet ring", "The bayonet twist is the ST connector.", "Байонетный поворот — у разъёма ST."],
    ["By push-pull of a square body", "Push-pull is the SC connector mechanism.", "Push-pull — механизм разъёма SC."],
    ["By screwing a threaded nut", "No listed fiber connector screws on; LC uses a latch.", "Ни один из перечисленных оптических разъёмов не накручивается; у LC защёлка."],
  ], "The table says LC locks by a latch, like RJ-45; ST twists and SC is push-pull.", "По таблице LC фиксируется защёлкой, как RJ-45; ST — поворотом, SC — push-pull."),

  qx("Which jacket colors indicate multimode fiber?", "Orange or aqua", [
    ["Yellow or white", "Yellow is single-mode; white is not mentioned.", "Жёлтый — одномодовое; белый не упоминается."],
    ["Blue or grey", "Neither color is given in the notes for fiber jackets.", "Ни один из этих цветов в конспекте для оболочек не назван."],
    ["Yellow or aqua", "Aqua is multimode, but yellow marks single-mode.", "Аква — многомодовое, но жёлтый обозначает одномодовое."],
  ], "An orange (or aqua) jacket means multimode; a yellow jacket means single-mode.", "Оранжевая (или аква) оболочка — многомодовое волокно; жёлтая — одномодовое."),

  qx("An LC-LC single-mode patch cord most likely has which jacket and lock?", "Yellow jacket, latch like RJ-45", [
    ["Orange jacket, latch like RJ-45", "The latch is right, but orange means multimode, not single-mode.", "Защёлка верна, но оранжевый — многомодовое, а не одномодовое."],
    ["Yellow jacket, bayonet twist", "Yellow is right, but a bayonet twist is ST, not LC.", "Жёлтый верен, но байонетный поворот — у ST, а не LC."],
    ["Orange jacket, push-pull body", "Orange is multimode and push-pull is SC; neither fits LC single-mode.", "Оранжевый — многомод, push-pull — SC; ни то ни другое не подходит LC одномоду."],
  ], "Single-mode means a yellow jacket, and LC connectors lock with a latch like RJ-45.", "Одномодовое — жёлтая оболочка, а разъёмы LC фиксируются защёлкой, как RJ-45."),

  qx("What is at the two ends of an ST-SC single-mode patch cord?", "A bayonet twist ST and a square push-pull SC", [
    ["Two square push-pull connectors, one at each end", "Two push-pull connectors would be an SC-SC cord.", "Два разъёма push-pull — это шнур SC-SC."],
    ["A latching LC and a bayonet ST", "That would be an ST-LC cord; here the second end is SC.", "Это был бы шнур ST-LC; здесь второй конец — SC."],
    ["Two round bayonet connectors", "Two bayonet connectors would be ST-ST, which is not in the list.", "Два байонетных разъёма — ST-ST, такого в списке нет."],
  ], "Patch cords are named by their two connectors: ST is the bayonet twist type and SC is the square push-pull type.", "Патч-корды называют по двум разъёмам: ST — байонетный с поворотом, SC — квадратный push-pull."),

  qx("What bandwidth range does the comparison table give for fiber?", "10 Mb/s – 100 Gb/s", [
    ["10 Mb/s – 10 Gb/s", "That is the UTP range; fiber goes ten times higher.", "Это диапазон UTP; оптика в десять раз выше."],
    ["100 Mb/s – 1 Gb/s", "The table starts fiber at 10 Mb/s and ends at 100 Gb/s.", "В таблице оптика начинается с 10 Мбит/с и заканчивается 100 Гбит/с."],
    ["1 Gb/s – 1 Tb/s", "No terabit figure appears; the top is 100 Gb/s.", "Терабитной цифры нет; верх — 100 Гбит/с."],
  ], "Bandwidth: UTP 10 Mb/s – 10 Gb/s; fiber 10 Mb/s – 100 Gb/s.", "Пропускная способность: UTP 10 Мбит/с – 10 Гбит/с; оптика 10 Мбит/с – 100 Гбит/с."),

  qx("What distance range does the table give for fiber?", "1 – 100,000 m", [
    ["1 – 100 m", "1 – 100 m is the UTP distance range.", "1 – 100 м — диапазон расстояний UTP."],
    ["1 – 550 m", "550 m is the multimode 10 Gbps figure, not the table's overall fiber range.", "550 м — цифра многомода на 10 Гбит/с, а не общий диапазон оптики в таблице."],
    ["1 – 10,000 m", "The table says 100,000 m (100 km), one order of magnitude more.", "В таблице 100 000 м (100 км), на порядок больше."],
  ], "Distance: UTP 1 – 100 meters; fiber 1 – 100,000 meters.", "Расстояние: UTP 1 – 100 метров; оптика 1 – 100 000 метров."),

  qx("According to the comparison, what is the top bandwidth of UTP?", "10 Gb/s", [
    ["100 Gb/s", "100 Gb/s is the top of the fiber range.", "100 Гбит/с — верх диапазона оптики."],
    ["1 Gb/s", "The UTP range in the table reaches 10 Gb/s, not 1 Gb/s.", "Диапазон UTP в таблице доходит до 10 Гбит/с, а не 1."],
    ["100 Mb/s", "100 Mb/s is well below the 10 Gb/s top of the UTP range.", "100 Мбит/с намного ниже верха диапазона UTP в 10 Гбит/с."],
  ], "The table gives UTP a bandwidth of 10 Mb/s – 10 Gb/s.", "В таблице у UTP пропускная способность 10 Мбит/с – 10 Гбит/с."),

  qx("How do UTP and fiber compare with respect to electrical hazards?", "UTP is affected; fiber is immune", [
    ["UTP is immune; fiber is affected", "This is reversed: copper conducts electricity, glass does not.", "Перепутано: медь проводит электричество, стекло — нет."],
    ["UTP is affected; fiber is affected too", "Fiber carries light in glass, so electrical hazards cannot reach the signal.", "Оптика несёт свет в стекле, электрические риски до сигнала не доходят."],
    ["UTP is immune; fiber is immune too", "UTP is a copper conductor and is affected by electrical hazards.", "UTP — медный проводник, он подвержен электрическим рискам."],
  ], "The table marks UTP as affected by EMI/RFI and electrical hazards, and fiber as immune.", "В таблице UTP подвержена EMI/RFI и электрическим рискам, а оптика невосприимчива."),

  qx("Fiber is mainly used as backbone cabling for which kind of links?", "High-traffic point-to-point links between buildings", [
    ["Patching every desktop PC to its own access switch port", "Desktop patching is UTP; fiber is reserved for high-traffic backbones.", "Подключение рабочих мест — UTP; оптику берегут для нагруженных магистралей."],
    ["Connecting a PC serial port to a console port", "The console connection is a Cisco rollover cable.", "Консольное подключение — кабель Cisco rollover."],
    ["Attaching antennas to wireless access points", "Antenna feeds are coaxial cable.", "Антенны подключают коаксиальным кабелем."],
  ], "Fiber backbones carry high-traffic point-to-point links between data distribution facilities and between campus buildings.", "Оптические магистрали несут нагруженные каналы «точка — точка» между узлами распределения и между зданиями кампуса."),

  qx("Which frequencies does wireless media use to carry signals?", "Radio or microwave", [
    ["Infrared or visible light", "Light pulses are the fiber-optic method; wireless uses radio and microwave.", "Световые импульсы — метод оптики; беспроводная среда использует радио и микроволны."],
    ["Audio or ultrasonic", "Sound is not a networking medium in the notes.", "Звук в конспекте как сетевая среда не фигурирует."],
    ["X-ray or gamma", "Such frequencies are not used for data networks.", "Такие частоты в сетях передачи данных не применяются."],
  ], "Wireless carries electromagnetic signals using radio or microwave frequencies.", "Беспроводная среда передаёт электромагнитные сигналы на радио- или микроволновых частотах."),

  qx("What is the main advantage of wireless media named in the notes?", "The greatest mobility", [
    ["The strongest security", "Security is a wireless limitation: anyone can reach the transmission.", "Безопасность — ограничение беспроводной среды: перехватить передачу может любой."],
    ["Immunity to interference", "Interference is a limitation; many common devices disrupt wireless.", "Помехи — ограничение; многие обычные устройства мешают сигналу."],
    ["Full-duplex throughput", "WLANs are half-duplex, which is a limitation, not an advantage.", "WLAN работают в полудуплексе — это ограничение, а не плюс."],
  ], "Wireless gives the greatest mobility; its limitations are coverage, interference, security and the shared medium.", "Беспроводная среда даёт наибольшую мобильность; ограничения — покрытие, помехи, безопасность и общая среда."),

  qx("What does the coverage area of a wireless network depend on?", "The physical characteristics of the location", [
    ["The IEEE standard number", "The standard defines the technology, not how far a given room lets the signal reach.", "Стандарт задаёт технологию, а не то, как далеко сигнал пройдёт в конкретном помещении."],
    ["The number of users connected to the access point", "User count affects shared bandwidth, not the coverage area.", "Число пользователей влияет на разделяемую полосу, а не на зону покрытия."],
    ["The security policy applied", "Security policies protect access; they do not change radio coverage.", "Политики безопасности защищают доступ, а не меняют радиопокрытие."],
  ], "Coverage area depends on the physical characteristics of the location.", "Зона покрытия зависит от физических особенностей места."),

  qx("Which wireless limitation is caused by many common devices?", "Interference", [
    ["Coverage area", "Coverage depends on the physical location, not on other devices.", "Покрытие зависит от физических условий места, а не от других устройств."],
    ["Security", "Security is about no physical access being needed to reach the medium.", "Безопасность — о том, что для доступа к среде не нужен физический контакт."],
    ["Shared medium", "The shared half-duplex medium is about one device sending at a time.", "Общая полудуплексная среда — о том, что передаёт одно устройство за раз."],
  ], "Interference is listed as a limitation because many common devices can disrupt wireless signals.", "Помехи названы ограничением, потому что многие обычные устройства мешают беспроводному сигналу."),

  qx("Why is security a limitation of wireless media?", "Anyone in range can reach the medium without physical access", [
    ["Access points are unable to encrypt the traffic of their clients", "The notes do not say that; the issue is that the medium is open to anyone in range.", "В конспекте этого нет; проблема в том, что среда доступна всем в радиусе действия."],
    ["Wireless NICs have no MAC addresses", "Wireless NICs do have MAC addresses; this is not the reason.", "У беспроводных адаптеров есть MAC-адреса; причина не в этом."],
    ["Half-duplex blocks authentication", "Half-duplex is the shared-medium limitation, unrelated to authentication.", "Полудуплекс — ограничение общей среды, к аутентификации не относится."],
  ], "Anyone within range can reach the transmission without touching a cable, so strict security policies are required.", "Любой в радиусе действия может перехватить передачу, не касаясь кабеля, поэтому нужны строгие политики безопасности."),

  tfx("On a WLAN two devices can transmit at the same moment because the medium is full-duplex.", false,
    "WLANs are a shared half-duplex medium: only one device can send or receive at a time.",
    "WLAN — общая полудуплексная среда: в каждый момент передаёт или принимает только одно устройство.",
    "If the medium were full-duplex, Wi-Fi would not slow down for everyone as more users connect.",
    "Будь среда полнодуплексной, Wi-Fi не замедлялся бы у всех по мере подключения новых пользователей."),

  qx("Which standard provides point-to-multipoint broadband wireless access?", "IEEE 802.16 (WiMAX)", [
    ["IEEE 802.11 (Wi-Fi)", "802.11 is the wireless LAN standard.", "802.11 — стандарт беспроводной LAN."],
    ["IEEE 802.15 (Bluetooth)", "802.15 is the wireless personal area network standard.", "802.15 — стандарт беспроводной персональной сети."],
    ["IEEE 802.15.4 (Zigbee)", "802.15.4 is low-rate, low-power IoT communication.", "802.15.4 — низкоскоростная энергоэффективная связь для интернета вещей."],
  ], "WiMAX, IEEE 802.16, is point-to-multipoint broadband wireless access.", "WiMAX, IEEE 802.16, — широкополосный доступ «точка — много точек»."),

  qx("Which IEEE number belongs to Zigbee?", "802.15.4", [
    ["802.15", "802.15 alone is Bluetooth; Zigbee adds the .4.", "802.15 без суффикса — Bluetooth; у Zigbee добавляется .4."],
    ["802.16", "802.16 is WiMAX.", "802.16 — WiMAX."],
    ["802.11", "802.11 is Wi-Fi.", "802.11 — Wi-Fi."],
  ], "Zigbee is IEEE 802.15.4: low data rate and low power for the Internet of Things.", "Zigbee — IEEE 802.15.4: низкая скорость и малое энергопотребление для интернета вещей."),

  qx("What kind of network does Bluetooth (IEEE 802.15) build?", "Wireless personal area network", [
    ["Wireless local area network", "WLAN is Wi-Fi, IEEE 802.11.", "WLAN — это Wi-Fi, IEEE 802.11."],
    ["Point-to-multipoint broadband", "Point-to-multipoint broadband is WiMAX, 802.16.", "Широкополосный доступ «точка — много точек» — WiMAX, 802.16."],
    ["Low-power Internet of Things", "Low-rate, low-power IoT is Zigbee, 802.15.4.", "Низкоскоростной энергоэффективный IoT — Zigbee, 802.15.4."],
  ], "Bluetooth, IEEE 802.15, is the wireless personal area network (WPAN) standard.", "Bluetooth, IEEE 802.15, — стандарт беспроводной персональной сети (WPAN)."),

  qx("Which two components does a WLAN need?", "A wireless access point and wireless NIC adapters", [
    ["A rollover cable and a console port", "Those are for console access to a router or switch.", "Это для консольного доступа к маршрутизатору или коммутатору."],
    ["A fiber backbone and SC connectors", "Fiber is backbone cabling; a WLAN needs an AP and wireless NICs.", "Оптика — магистраль; для WLAN нужны точка доступа и беспроводные адаптеры."],
    ["A coaxial antenna feed plus a cable internet modem", "Coax feeds antennas and cable internet; it does not define a WLAN.", "Коаксиал питает антенны и кабельный интернет; WLAN он не определяет."],
  ], "A WLAN needs a wireless access point (AP) and wireless NIC adapters in the end devices.", "Для WLAN нужны беспроводная точка доступа (AP) и беспроводные сетевые адаптеры в устройствах."),

  qx("What does a wireless access point do?", "Concentrates user signals and joins the copper network", [
    ["Converts pulses of light into electrical signals on copper", "That is a fiber transceiver's job, not an AP's.", "Это задача оптического трансивера, а не точки доступа."],
    ["Assigns IEEE standard numbers to clients", "Standards are fixed by the IEEE, not handed out by an AP.", "Стандарты закрепляет IEEE, точка доступа их не раздаёт."],
    ["Replaces the wireless NICs in user devices", "Devices still need their own wireless NICs to reach the AP.", "Устройствам всё равно нужны собственные беспроводные адаптеры, чтобы связаться с AP."],
  ], "The AP concentrates the wireless signals of the users and connects to the existing copper-based network.", "Точка доступа собирает беспроводные сигналы пользователей и подключается к существующей медной сети."),

  qx("What should you check when buying WLAN equipment?", "Compatibility and interoperability", [
    ["Jacket color and connector type", "Jacket color and connectors are fiber patch-cord concerns.", "Цвет оболочки и разъёмы — характеристики оптических патч-кордов."],
    ["Cable category and run length", "Categories and run length apply to UTP, not wireless gear.", "Категории и длина сегмента относятся к UTP, а не к беспроводному оборудованию."],
    ["Core size and light source", "Core size and laser versus LED describe fiber types.", "Размер сердцевины и лазер против светодиода — характеристики оптики."],
  ], "When buying WLAN equipment, check compatibility and interoperability.", "При покупке оборудования WLAN проверяй совместимость и взаимодействие устройств."),

  qx("What must administrators apply to protect a WLAN from unauthorized access?", "Strict security policies", [
    ["Shielded twisted pair uplinks", "Shielding protects copper from noise; it does not secure wireless access.", "Экран защищает медь от помех, а не беспроводной доступ."],
    ["Yellow single-mode patch cords", "Patch cords are fiber hardware, unrelated to WLAN security.", "Патч-корды — оптическое оборудование, к безопасности WLAN не относятся."],
    ["Larger coverage areas", "A larger coverage area makes the signal reachable by more outsiders.", "Большая зона покрытия делает сигнал доступным большему числу посторонних."],
  ], "Because no physical access is needed, administrators must apply strict security policies to a WLAN.", "Поскольку физический доступ не нужен, администраторы обязаны применять строгие политики безопасности к WLAN."),

  qx("You must link two buildings 2 km apart. Which fiber, and why?", "Single-mode: small core and laser carry light far", [
    ["Multimode: LEDs are cheaper", "Cheaper LEDs do not help; MMF dispersion limits it to about 550 m.", "Дешёвые светодиоды не спасут: дисперсия ограничивает MMF примерно 550 м."],
    ["Multimode: light enters the core at many different angles", "Many entry angles mean more dispersion, which is exactly why MMF stops at 550 m.", "Много углов входа — больше дисперсия, поэтому MMF и останавливается на 550 м."],
    ["Single-mode: its jacket is orange", "SMF is right, but its jacket is yellow; orange is multimode.", "SMF верно, но его оболочка жёлтая; оранжевая — многомод."],
  ], "Single-mode's small core and laser carry light over long distances; multimode is limited to about 550 m by dispersion.", "Тонкая сердцевина и лазер одномода несут свет далеко; многомод ограничен примерно 550 м из-за дисперсии."),

  qx("Which set of facts matches the callout for multimode fiber?", "Large core, LED, 550 m, orange", [
    ["Small core, laser, long, yellow", "That is the single-mode line of the callout.", "Это строка про одномодовое волокно."],
    ["Large core, laser, 550 m, yellow", "Multimode uses LEDs and an orange jacket, not lasers and yellow.", "У многомода светодиоды и оранжевая оболочка, а не лазеры и жёлтый."],
    ["Small core, LED, long, orange", "A small core and long reach are single-mode traits; only LED and orange fit multimode.", "Тонкая сердцевина и дальность — признаки одномода; к многомоду подходят лишь светодиод и оранжевый."],
  ], "Multimode: large core, LED, 550 m, orange. Single-mode: small core, laser, long, yellow.", "Многомод: толстая сердцевина, светодиод, 550 м, оранжевый. Одномод: тонкая сердцевина, лазер, далеко, жёлтый."),
];
