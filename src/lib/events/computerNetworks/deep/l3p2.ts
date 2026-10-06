import { qx, tfx, type Draft } from "../../types";

/** Лекция 3, часть 2 — медные кабели и UTP: разбор до косточек. */
export const deepL3P2: Draft[] = [
  qx("Why is copper the most common cabling type?", "It is cheap, easy to install and has low resistance", [
    ["It is completely immune to both EMI and RFI interference", "Only fiber is immune to EMI and RFI; copper needs shielding and grounding against them.", "Полностью невосприимчива к EMI и RFI только оптика; меди для этого нужны экран и заземление."],
    ["It carries a signal for 100 kilometers", "Copper attenuates quickly; a UTP run is limited to 100 meters, not 100 kilometers.", "Медь быстро затухает: сегмент UTP ограничен 100 метрами, а не 100 километрами."],
    ["It needs no connectors on either end", "Copper cables are terminated with connectors such as RJ-45, BNC or F-type.", "Медные кабели оконцовываются разъёмами: RJ-45, BNC или F-разъёмом."],
  ], "The notes list three reasons: copper is cheap, simple to install and offers low resistance to electrical current.", "В конспекте три причины: медь недорогая, проста в монтаже и имеет малое сопротивление току."),

  qx("Which copper limitation is cured by respecting cable length limits?", "Attenuation", [
    ["Crosstalk", "Crosstalk is interference between wires and is cured by twisting the pairs, not by shortening the cable.", "Перекрёстные помехи — наводки между проводами, их лечит скрутка пар, а не укорачивание кабеля."],
    ["EMI", "Electromagnetic interference is cured by metallic shielding and grounding, not by length limits.", "Электромагнитные помехи лечатся экраном и заземлением, а не ограничением длины."],
    ["RFI", "Radio frequency interference is cured by shielding and grounding, not by cable length.", "Радиочастотные помехи лечатся экраном и заземлением, а не длиной кабеля."],
  ], "The longer a signal travels over copper, the weaker it gets; keeping runs within the length limit is the cure.", "Чем дальше идёт сигнал по меди, тем он слабее; лекарство — соблюдать предельную длину сегмента."),

  qx("Metallic shielding and grounding on a copper cable are the cure for which problem?", "EMI and RFI", [
    ["Attenuation", "Attenuation is signal loss with distance; shielding does not stop it, length limits do.", "Затухание — потеря сигнала с расстоянием; экран его не останавливает, помогает ограничение длины."],
    ["Crosstalk", "Crosstalk between the wires of a cable is cured by twisting the pairs together.", "Наводки между проводами внутри кабеля лечатся скруткой пар."],
    ["Dispersion", "Dispersion is the spreading of a light pulse in fiber, not a copper problem.", "Дисперсия — расплывание светового импульса в оптике, к меди это не относится."],
  ], "Electromagnetic and radio frequency interference come from outside the cable, so a metallic shield plus grounding blocks them.", "Электромагнитные и радиочастотные помехи приходят снаружи, поэтому их блокируют металлический экран и заземление."),

  qx("What is crosstalk?", "Interference between the wires inside a cable", [
    ["Weakening of the signal as the cable gets longer", "That is attenuation, not crosstalk.", "Это затухание, а не перекрёстные помехи."],
    ["Noise picked up from nearby radio transmitters", "Noise from radio sources is RFI; crosstalk comes from the cable's own wires.", "Помехи от радиоисточников — это RFI; перекрёстные помехи создают провода самого кабеля."],
    ["Noise induced by nearby electrical machinery", "Noise from electrical fields outside the cable is EMI, not crosstalk.", "Наводки от внешних электрических полей — это EMI, а не crosstalk."],
  ], "Crosstalk is interference between wires of the same cable; twisting the two wires of each pair cancels it.", "Перекрёстные помехи — наводки между проводами одного кабеля; их гасит скрутка двух проводов каждой пары."),

  qx("Which medium is the most common for connecting hosts to switches in a LAN?", "Unshielded twisted pair", [
    ["Shielded twisted pair", "STP is reserved for noisy environments because it is pricier and harder to install.", "STP ставят в шумных местах, потому что он дороже и сложнее в монтаже."],
    ["Coaxial cable", "Coax is used for antennas and cable internet, not for host-to-switch links.", "Коаксиал применяют для антенн и кабельного интернета, а не для подключения хостов к коммутаторам."],
    ["Single-mode fiber", "Fiber is mainly backbone cabling; it is too expensive for most host connections.", "Оптика — в основном магистраль; для большинства хостов она слишком дорога."],
  ], "UTP is the most common networking media: it interconnects hosts with intermediary devices in most LANs.", "UTP — самая распространённая сетевая среда: соединяет хосты с промежуточными устройствами в большинстве LAN."),

  qx("Which connector terminates both UTP and STP cables?", "RJ-45", [
    ["BNC", "BNC is a coaxial connector, not one for twisted pair.", "BNC — разъём коаксиального кабеля, а не витой пары."],
    ["F-type", "F-type is the other coaxial connector listed, used for cable internet.", "F-разъём — второй коаксиальный разъём из таблицы, для кабельного интернета."],
    ["LC", "LC is a fiber-optic connector, a smaller version of SC.", "LC — оптический разъём, уменьшенная версия SC."],
  ], "The table gives RJ-45 for both UTP and STP; only coaxial uses BNC or F-type.", "В таблице у UTP и STP разъём RJ-45; BNC и F-разъём — только у коаксиала."),

  qx("Which parts make up a UTP cable, according to the notes?", "Outer jacket, twisted pairs, color-coded insulation", [
    ["Outer jacket, copper braid, plastic insulation, core", "That is the layered structure of coaxial cable, not UTP.", "Это слоистая структура коаксиального кабеля, а не UTP."],
    ["Braided overall shield plus a foil shield per pair", "Shields belong to STP; UTP is unshielded by definition.", "Экраны — это STP; UTP по определению не экранирован."],
    ["Thin glass strands carrying pulses of light", "Glass strands are fiber-optic cable, not copper twisted pair.", "Стеклянные нити — это оптоволокно, а не медная витая пара."],
  ], "UTP consists of an outer jacket, twisted pairs and color-coded insulation on each wire; it has no shield.", "UTP состоит из внешней оболочки, витых пар и цветной изоляции на каждом проводе; экрана нет."),

  qx("Which statement about STP compared with UTP is true?", "STP protects from noise better but costs more", [
    ["STP is cheaper but easier to damage", "STP is more expensive than UTP, not cheaper.", "STP дороже UTP, а не дешевле."],
    ["STP uses BNC instead of RJ-45", "STP is also terminated with RJ-45; BNC is for coaxial cable.", "STP тоже оконцовывается RJ-45; BNC — для коаксиала."],
    ["STP needs no twisting at all thanks to its shield", "STP is still twisted pair; it adds shields on top of the twisting.", "STP — всё равно витая пара; экраны добавляются поверх скрутки."],
  ], "STP gives better noise protection than UTP, but it is more expensive and harder to install.", "STP защищён от помех лучше UTP, но дороже и сложнее в монтаже."),

  qx("How is STP cable shielded?", "An overall braid or foil plus a foil shield on each pair", [
    ["A woven copper braid wrapped around one central conductor", "A braid around one conductor describes coaxial cable.", "Оплётка вокруг одной жилы — это коаксиальный кабель."],
    ["Twisting of the pairs only, with no metal", "Twisting without a shield is UTP, not STP.", "Скрутка без экрана — это UTP, а не STP."],
    ["Plastic insulation thickened around every wire", "Thicker insulation is not shielding; STP uses metallic braid or foil.", "Толстая изоляция — не экран; в STP используется металлическая оплётка или фольга."],
  ], "STP has a braided or foil overall shield and, in addition, a foil shield around each twisted pair.", "У STP общий экран из оплётки или фольги и дополнительно фольга вокруг каждой витой пары."),

  qx("What role does the woven copper braid play in a coaxial cable?", "It acts as the second wire and as the shield", [
    ["It is the main conductor that carries the data", "The data conductor is the central copper core; the braid surrounds it.", "Основной проводник — центральная медная жила; оплётка её окружает."],
    ["It replaces the outer plastic jacket", "Coax still has an outer jacket; the braid lies under it.", "У коаксиала есть внешняя оболочка; оплётка лежит под ней."],
    ["It cancels crosstalk by twisting the pairs", "Coax has no twisted pairs; cancellation by twisting is a UTP technique.", "В коаксиале нет витых пар; гашение скруткой — приём UTP."],
  ], "In coax the woven copper braid (or foil) is both the second wire of the circuit and the shield around the core.", "В коаксиале медная оплётка (или фольга) — одновременно второй провод цепи и экран вокруг жилы."),

  qx("A technician attaches an external antenna to a wireless device. Which cable is used?", "Coaxial", [
    ["UTP", "UTP connects hosts to intermediary devices, not antennas.", "UTP соединяет хосты с промежуточными устройствами, а не антенны."],
    ["STP", "STP is twisted pair for noisy LAN environments, not an antenna feed.", "STP — витая пара для шумных LAN, а не антенный кабель."],
    ["Rollover", "A rollover cable connects a serial port to a console port.", "Rollover соединяет последовательный порт с консольным."],
  ], "Coaxial cable is used to attach antennas to wireless devices and for cable internet.", "Коаксиальный кабель применяют для подключения антенн к беспроводным устройствам и для кабельного интернета."),

  qx("Which connectors does the table list for coaxial cable?", "BNC and F-type", [
    ["RJ-45 and BNC", "RJ-45 is for twisted pair; coax uses BNC and F-type.", "RJ-45 — для витой пары; у коаксиала BNC и F-разъём."],
    ["LC and SC", "LC and SC are fiber-optic connectors.", "LC и SC — оптические разъёмы."],
    ["RJ-45 and F-type", "RJ-45 never terminates coax; the pair is BNC and F-type.", "RJ-45 коаксиал не оконцовывает; правильная пара — BNC и F-разъём."],
  ], "The cable table gives BNC and F-type connectors for coaxial, used for antennas and cable internet.", "В таблице кабелей у коаксиала разъёмы BNC и F-type — для антенн и кабельного интернета."),

  qx("How many pairs of wires does a UTP cable contain?", "Four", [
    ["Two", "UTP has four color-coded pairs, eight wires in total.", "В UTP четыре цветных пары, всего восемь проводов."],
    ["Eight", "Eight is the number of wires; they form four pairs.", "Восемь — это число проводов; они образуют четыре пары."],
    ["One", "A single pair could not fill the eight positions of an RJ-45 plug.", "Одна пара не заполнит восемь позиций разъёма RJ-45."],
  ], "UTP has four pairs of color-coded copper wires, which is why T568A and T568B list eight wires.", "В UTP четыре пары цветных медных проводов, поэтому в T568A и T568B перечислены восемь проводов."),

  qx("What does cancellation in UTP rely on?", "Opposite polarity on a pair's two twisted wires", [
    ["A foil shield wrapped around each pair", "Foil per pair is STP; UTP has no shielding at all.", "Фольга на каждой паре — это STP; в UTP экрана нет вовсе."],
    ["A grounded copper braid around all pairs", "A grounded braid is a shield; UTP relies on twisting instead.", "Заземлённая оплётка — экран; UTP вместо этого полагается на скрутку."],
    ["Thicker plastic insulation on each of the eight wires", "Insulation thickness does not cancel magnetic fields; twisting does.", "Толщина изоляции магнитные поля не гасит; это делает скрутка."],
  ], "The two wires of a pair carry opposite polarity and are twisted, so their magnetic fields cancel each other and outside EMI/RFI.", "Два провода пары несут противоположную полярность и скручены, поэтому их магнитные поля гасят друг друга и внешние EMI/RFI."),

  tfx("UTP cable relies on a thin foil shield to protect against crosstalk.", false,
    "UTP has no shielding; it fights crosstalk by twisting the wires of each pair so the magnetic fields cancel.",
    "В UTP нет экрана; с наводками он борется скруткой проводов каждой пары, чтобы магнитные поля гасились.",
    "A foil shield on each pair is a feature of STP, not UTP; the U stands for unshielded.",
    "Фольга на каждой паре — признак STP, а не UTP; буква U означает unshielded — неэкранированный."),

  qx("Which standard covers cable types, lengths, connectors, termination and testing?", "TIA/EIA-568", [
    ["IEEE performance categories", "IEEE rates cables by performance (Cat 3, 5, 5e, 6); it does not define termination and testing.", "IEEE делит кабели по характеристикам (Cat 3, 5, 5e, 6), но не задаёт оконцовку и тестирование."],
    ["Cisco proprietary pinout", "The Cisco pinout is only the rollover console cable, not a general cabling standard.", "Разводка Cisco — только консольный кабель rollover, а не общий стандарт кабелей."],
    ["Auto-MDIX", "Auto-MDIX is a port feature that detects the cable type, not a cabling standard.", "Auto-MDIX — функция порта, определяющая тип кабеля, а не стандарт кабелей."],
  ], "TIA/EIA-568 standardizes cable types, lengths, connectors, termination and testing.", "TIA/EIA-568 стандартизирует типы кабелей, длины, разъёмы, оконцовку и тестирование."),

  qx("Which organization rates copper cable by performance category?", "IEEE", [
    ["TIA/EIA", "TIA/EIA-568 covers cable types, connectors and termination; the performance categories come from the IEEE.", "TIA/EIA-568 задаёт типы кабелей, разъёмы и оконцовку; категории по характеристикам — у IEEE."],
    ["Cisco", "Cisco defines only its proprietary rollover cable, not cable categories.", "Cisco определяет только свой кабель rollover, а не категории кабелей."],
    ["ISO", "ISO is not mentioned in the notes; the categories are an IEEE rating.", "ISO в конспекте не упоминается; категории — рейтинг IEEE."],
  ], "The IEEE rates cable by performance: Category 3, 5, 5e and 6.", "IEEE делит кабели по характеристикам: категории 3, 5, 5e и 6."),

  qx("Which cable categories are listed in the notes?", "Cat 3, 5, 5e and 6", [
    ["Cat 1, 2, 3 and 4", "The notes start at Category 3 and go up to 6; 1, 2 and 4 are not listed.", "В конспекте категории начинаются с 3 и доходят до 6; 1, 2 и 4 не перечислены."],
    ["Cat 7, 7a, 8 and 8.1", "None of these higher categories appear in the notes.", "Ни одна из этих старших категорий в конспекте не упоминается."],
    ["Cat 5, 6a, 7 and 8", "Only Cat 5 is in the notes; 6a, 7 and 8 are not listed, and 3 and 5e are missing here.", "Из этого списка в конспекте есть только Cat 5; 6a, 7 и 8 не названы, а 3 и 5e пропущены."],
  ], "The IEEE performance categories named in the notes are 3, 5, 5e and 6.", "В конспекте названы категории IEEE 3, 5, 5e и 6."),

  qx("A Cat5e run must reach a desk 130 m from the switch. What is the problem?", "It exceeds the 100 m limit for a UTP run", [
    ["Only Cat6 cable would reach 130 m or more", "Cat6 has the same 100 m limit as Cat5e.", "У Cat6 тот же предел 100 м, что и у Cat5e."],
    ["It needs T568A instead of T568B", "Wire order does not change the distance limit; attenuation does.", "Порядок проводов не меняет предел длины; его задаёт затухание."],
    ["Nothing; the limit is 185 m", "The UTP limit is 100 m, so 130 m is too long.", "Предел UTP — 100 м, так что 130 м слишком много."],
  ], "The maximum length of a UTP run (Cat5e, Cat6) is 100 meters because of attenuation.", "Максимальная длина сегмента UTP (Cat5e, Cat6) — 100 метров из-за затухания."),

  qx("What is the maximum length of one UTP run, and which limitation sets it?", "100 m, attenuation", [
    ["100 m, crosstalk", "Crosstalk is handled by twisting; distance is limited by attenuation.", "С наводками справляется скрутка; расстояние ограничивает затухание."],
    ["550 m, attenuation", "550 m is the multimode fiber figure; UTP is limited to 100 m.", "550 м — цифра для многомодовой оптики; UTP ограничен 100 м."],
    ["185 m, EMI", "The UTP limit is 100 m and the cause is attenuation, not EMI.", "Предел UTP — 100 м, и причина — затухание, а не EMI."],
  ], "A UTP run is limited to 100 meters because the signal attenuates as it travels.", "Сегмент UTP ограничен 100 метрами, потому что сигнал затухает по мере передачи."),

  qx("Which wire is in position 1 of the T568A pinout?", "White-green", [
    ["White-orange", "White-orange is position 1 of T568B, not T568A.", "Бело-оранжевый — позиция 1 в T568B, а не в T568A."],
    ["Green", "Green is position 2 of T568A, right after white-green.", "Зелёный — позиция 2 в T568A, сразу после бело-зелёного."],
    ["White-blue", "White-blue is position 5 in both standards.", "Бело-синий — позиция 5 в обоих стандартах."],
  ], "T568A begins white-green, green, white-orange, blue, white-blue, orange, white-brown, brown.", "T568A начинается: бело-зелёный, зелёный, бело-оранжевый, синий, бело-синий, оранжевый, бело-коричневый, коричневый."),

  qx("Which wire is in position 6 of the T568B pinout?", "Green", [
    ["Orange", "Orange is position 2 of T568B; position 6 is green.", "Оранжевый — позиция 2 в T568B; позиция 6 — зелёный."],
    ["White-green", "White-green is position 3 of T568B.", "Бело-зелёный — позиция 3 в T568B."],
    ["White-brown", "White-brown is position 7 in both standards.", "Бело-коричневый — позиция 7 в обоих стандартах."],
  ], "T568B is white-orange, orange, white-green, blue, white-blue, green, white-brown, brown; green is sixth.", "T568B: бело-оранжевый, оранжевый, бело-зелёный, синий, бело-синий, зелёный, бело-коричневый, коричневый; зелёный — шестой."),

  qx("Which wires sit in the same positions in both T568A and T568B?", "Blue, white-blue, white-brown, brown", [
    ["Green, white-green, orange, white-orange", "The green and orange pairs are exactly the ones that swap between A and B.", "Зелёная и оранжевая пары — как раз те, что меняются местами между A и B."],
    ["White-green, green, blue, white-blue", "Blue and white-blue stay, but white-green and green move from 1–2 to 3 and 6.", "Синий и бело-синий остаются, а бело-зелёный и зелёный переходят с позиций 1–2 на 3 и 6."],
    ["Orange, white-orange, brown, white-brown", "Brown and white-brown stay, but orange and white-orange change positions.", "Коричневый и бело-коричневый остаются, а оранжевый и бело-оранжевый меняют позиции."],
  ], "Positions 4, 5, 7 and 8 (blue, white-blue, white-brown, brown) are identical; only the green and orange pairs swap.", "Позиции 4, 5, 7 и 8 (синий, бело-синий, бело-коричневый, коричневый) совпадают; меняются только зелёная и оранжевая пары."),

  qx("What is the difference between the T568A and T568B pinouts?", "The green and orange pairs swap places", [
    ["The blue and brown pairs swap places", "Blue and brown stay in positions 4–5 and 7–8 in both standards.", "Синяя и коричневая пары остаются на позициях 4–5 и 7–8 в обоих стандартах."],
    ["T568B uses only four of the eight wires", "Both pinouts specify all eight wires.", "Обе разводки задают все восемь проводов."],
    ["T568A reverses all eight wires end to end", "Reversing all wires describes a rollover cable, not T568A.", "Полный разворот всех проводов — это кабель rollover, а не T568A."],
  ], "In T568A the green pair is in positions 1–2 and 3/6; in T568B the orange pair takes those places and green moves to 3 and 6.", "В T568A зелёная пара стоит на позициях 1–2 и 3/6; в T568B эти места занимает оранжевая, а зелёная уходит на 3 и 6."),

  qx("A cable is wired T568B on both ends. What is it, and where is it used?", "Straight-through; PC to switch", [
    ["Crossover; switch to switch", "A crossover has T568A on one end and T568B on the other.", "У перекрёстного кабеля один конец T568A, другой T568B."],
    ["Rollover; PC to console port", "A rollover uses the Cisco pinout, not T568B on both ends.", "Rollover использует разводку Cisco, а не T568B на обоих концах."],
    ["Straight-through; PC to PC", "The cable is straight-through, but PC to PC is like-to-like and needs a crossover.", "Кабель прямой, но ПК с ПК — одинаковые устройства, им нужен перекрёстный."],
  ], "The same standard on both ends makes a straight-through cable, used between a host and a network device.", "Один стандарт на обоих концах — прямой кабель, его используют между хостом и сетевым устройством."),

  qx("Which link is made with a straight-through cable?", "Switch to router", [
    ["Switch to switch", "Two switches are like devices and need a crossover (unless Auto-MDIX is on).", "Два коммутатора — одинаковые устройства, им нужен перекрёстный кабель (если нет Auto-MDIX)."],
    ["Router to router", "Router to router is like-to-like, so it takes a crossover.", "Маршрутизатор с маршрутизатором — одинаковые устройства, нужен перекрёстный."],
    ["PC to router", "The table lists PC to router under crossover.", "В таблице ПК с маршрутизатором стоит в строке перекрёстного кабеля."],
  ], "Different devices use a straight-through cable: PC to switch and switch to router.", "Разные устройства соединяют прямым кабелем: ПК с коммутатором, коммутатор с маршрутизатором."),

  qx("Which connection uses a crossover cable, according to the table?", "PC to router", [
    ["PC to switch", "PC to switch is host to network device: straight-through.", "ПК с коммутатором — хост с сетевым устройством: прямой кабель."],
    ["Switch to router", "Switch to router is listed under straight-through.", "Коммутатор с маршрутизатором стоит в строке прямого кабеля."],
    ["PC serial port to console port", "The console connection uses a rollover cable.", "Консольное подключение делается кабелем rollover."],
  ], "The crossover row lists PC to PC, switch to switch, router to router and PC to router.", "В строке перекрёстного кабеля: ПК с ПК, коммутатор с коммутатором, маршрутизатор с маршрутизатором и ПК с маршрутизатором."),

  qx("Which pair of connections both use a crossover cable?", "Host to host and router to router", [
    ["PC to switch and switch to router", "Both are different-device links and use straight-through.", "Оба соединения — разные устройства, прямой кабель."],
    ["PC to console and PC to switch", "PC to console is rollover and PC to switch is straight-through.", "ПК с консолью — rollover, ПК с коммутатором — прямой."],
    ["Switch to router and PC to router", "Switch to router is straight-through; only PC to router is crossover.", "Коммутатор с маршрутизатором — прямой; перекрёстный только ПК с маршрутизатором."],
  ], "Crossover is for like-to-like links: host to host, switch to switch, router to router.", "Перекрёстный кабель — для одинаковых устройств: хост с хостом, коммутатор с коммутатором, маршрутизатор с маршрутизатором."),

  qx("Why is the crossover cable considered legacy?", "Auto-MDIX on the ports detects the cable type", [
    ["Fiber uplinks replaced copper between switches", "The notes credit Auto-MDIX, not fiber, for making crossover unnecessary.", "В конспекте причина — Auto-MDIX, а не оптика между коммутаторами."],
    ["T568A was withdrawn from TIA/EIA-568", "T568A is still a valid pinout; the notes list the A and B wire orders side by side.", "T568A по-прежнему действующая разводка; в конспекте есть и A, и B."],
    ["Modern NICs use only four of eight wires", "Wire count has nothing to do with it; Auto-MDIX swaps pairs automatically.", "Число проводов ни при чём; Auto-MDIX сам меняет пары."],
  ], "Auto-MDIX detects which cable is attached and swaps the pairs, so a crossover cable is rarely needed.", "Auto-MDIX определяет подключённый кабель и сам меняет пары, поэтому перекрёстный кабель почти не нужен."),

  qx("Which statement about the rollover cable is true?", "Cisco proprietary; links a serial port to a console port", [
    ["It links two switches together when Auto-MDIX is disabled", "Switch to switch without Auto-MDIX needs a crossover, not a rollover.", "Коммутатор с коммутатором без Auto-MDIX соединяют перекрёстным, а не rollover."],
    ["It is wired T568A on one end and T568B on the other", "A–B wiring is a crossover; rollover uses its own Cisco pinout.", "Разводка A–B — перекрёстный кабель; у rollover своя разводка Cisco."],
    ["It carries data traffic from a PC to a switch port", "PC to switch for data is a straight-through cable; rollover is for the console.", "Данные от ПК к порту коммутатора идут по прямому кабелю; rollover — для консоли."],
  ], "The rollover is a Cisco proprietary cable from a host serial port to the console port of a router or switch.", "Rollover — фирменный кабель Cisco от последовательного порта хоста к консольному порту маршрутизатора или коммутатора."),

  qx("Two switches linked by a straight-through cable work fine. What makes this possible?", "Auto-MDIX detects the cable and swaps the pairs", [
    ["Switches ignore the wire order entirely", "Wire order matters; the link works only because Auto-MDIX compensates.", "Порядок проводов важен; канал работает только потому, что Auto-MDIX компенсирует."],
    ["Straight-through is the standard for like devices", "Like devices need a crossover; straight-through is for different devices.", "Одинаковым устройствам нужен перекрёстный; прямой — для разных."],
    ["The cable uses T568A on both ends", "T568A on both ends is still straight-through; the pinout is not what fixes it.", "T568A на обоих концах — всё равно прямой кабель; разводка тут не спасает."],
  ], "Like devices need a crossover, but Auto-MDIX detects the cable type and swaps the pairs automatically.", "Одинаковым устройствам нужен перекрёстный кабель, но Auto-MDIX определяет кабель и сам меняет пары."),

  tfx("If Auto-MDIX is off, two switches must be connected with a crossover cable.", true,
    "Switch to switch is a like-to-like link; without Auto-MDIX nothing swaps the pairs, so a crossover is required.",
    "Коммутатор с коммутатором — одинаковые устройства; без Auto-MDIX пары никто не поменяет, нужен перекрёстный кабель.",
    "A straight-through cable would only work if Auto-MDIX were on to detect it and swap the pairs.",
    "Прямой кабель сработал бы только при включённом Auto-MDIX, который определит его и поменяет пары."),

  qx("Which rule of thumb from the notes is correct?", "Different devices: straight-through; same devices: crossover", [
    ["Different devices: crossover; same devices: straight-through", "This is reversed: unlike devices take straight-through, like devices crossover.", "Перепутано: разные устройства — прямой, одинаковые — перекрёстный."],
    ["Console: crossover; same devices: rollover", "Console is rollover and same devices is crossover.", "Консоль — rollover, одинаковые устройства — перекрёстный."],
    ["Different devices: rollover; console: straight-through", "Rollover is only for the console port; different devices use straight-through.", "Rollover — только для консольного порта; разные устройства — прямой кабель."],
  ], "Different devices — straight-through. Same devices — crossover. Console — rollover.", "Разные устройства — прямой. Одинаковые — перекрёстный. Консоль — rollover."),

  qx("Twisting the two wires of a pair is the cure for which copper problem?", "Crosstalk", [
    ["Attenuation", "Attenuation is cured by respecting length limits, not by twisting.", "Затухание лечится соблюдением предельной длины, а не скруткой."],
    ["EMI", "External electromagnetic interference is cured by shielding and grounding.", "Внешние электромагнитные помехи лечатся экраном и заземлением."],
    ["RFI", "Radio frequency interference is cured by shielding and grounding.", "Радиочастотные помехи лечатся экраном и заземлением."],
  ], "Twisting opposing circuit pair wires together cancels crosstalk between the wires.", "Скрутка проводов пары гасит перекрёстные помехи между проводами."),

  tfx("Coaxial cable is terminated with RJ-45 connectors.", false,
    "Coax uses BNC or F-type connectors; RJ-45 terminates UTP and STP.",
    "Коаксиал оконцовывается разъёмами BNC или F-type; RJ-45 — для UTP и STP.",
    "RJ-45 fits eight twisted-pair wires, not a single copper core with a braid around it.",
    "RJ-45 рассчитан на восемь проводов витой пары, а не на одну жилу с оплёткой."),

  tfx("Copper cabling has a high resistance to electrical current, which is why it attenuates.", false,
    "The notes list low resistance to electrical current as one of copper's strengths; attenuation is a separate limit tied to distance.",
    "В конспекте малое сопротивление току названо плюсом меди; затухание — отдельное ограничение, связанное с расстоянием.",
    "Low resistance is exactly why copper is a good conductor and the most common cabling type.",
    "Именно малое сопротивление делает медь хорошим проводником и самым распространённым кабелем."),
];
