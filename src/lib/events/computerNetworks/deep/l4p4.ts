import { qx, tfx, type Draft } from "../../types";

/** Разбор до косточек: лекция 4, часть 4 — таблица MAC-адресов и методы коммутации. */
export const deepL4P4: Draft[] = [
  qx("On what basis does a Layer 2 Ethernet switch make its forwarding decisions?", "MAC addresses only", [
    ["IP addresses only", "IP addresses are Layer 3 information that a router uses; a Layer 2 switch never reads them to forward a frame.", "IP-адреса — информация уровня 3, по ней решает маршрутизатор; коммутатор уровня 2 их для пересылки не читает."],
    ["The protocol inside the data field", "The notes stress that the switch does not look at the protocol carried in the data at all.", "В конспекте подчёркнуто: коммутатор вообще не смотрит, какой протокол внутри данных."],
    ["TCP and UDP port numbers", "Transport port numbers live at Layer 4 and are invisible to a Layer 2 switch.", "Порты транспортного уровня — это уровень 4, коммутатор уровня 2 их не видит."],
  ], "A Layer 2 switch forwards frames based only on MAC addresses and ignores the protocol carried in the data.", "Коммутатор уровня 2 пересылает кадры только по MAC-адресам и не смотрит, какой протокол внутри данных."),

  qx("How does a legacy hub handle the bits it receives on one port?", "Repeats them out all other ports", [
    ["Forwards them out one learned port", "Forwarding to a single learned port requires a MAC table, which a hub does not have.", "Чтобы отправлять в один изученный порт, нужна таблица MAC, а у концентратора её нет."],
    ["Drops them if the CRC is invalid", "Checking the CRC is a store-and-forward switch feature; a hub does not inspect frames at all.", "Проверка CRC — свойство коммутатора store-and-forward; концентратор кадры вообще не разбирает."],
    ["Stores them in its CAM table", "A CAM table belongs to a switch; a hub keeps no table and simply repeats bits.", "Таблица CAM есть у коммутатора; концентратор никакой таблицы не ведёт и просто повторяет биты."],
  ], "A hub is a repeater: every bit that comes in is repeated out all ports, with no table and no decision.", "Концентратор — повторитель: каждый пришедший бит повторяется во все порты, без таблицы и без решений."),

  qx("The MAC address table of a switch is also called the ___ table.", "CAM", [
    ["ARP", "The ARP table maps IP addresses to MACs on a host or router; it is not the switch forwarding table.", "Таблица ARP сопоставляет IP и MAC на хосте или маршрутизаторе, это не таблица пересылки коммутатора."],
    ["routing", "A routing table holds Layer 3 networks and next hops, not MAC-to-port mappings.", "Таблица маршрутизации хранит сети уровня 3 и следующие узлы, а не пары MAC — порт."],
    ["NAT", "A NAT table maps private addresses to public ones on a router; it has nothing to do with switching.", "Таблица NAT сопоставляет частные адреса публичным на маршрутизаторе и к коммутации не относится."],
  ], "The MAC address table is stored in content addressable memory, so it is also known as the CAM table.", "Таблица MAC-адресов хранится в ассоциативной памяти (CAM), поэтому её так и называют — таблица CAM."),

  qx("What does the MAC address table contain right after a switch is powered on?", "Nothing — it is empty", [
    ["The MACs of all connected hosts", "The switch has not yet seen a frame from any host, so it cannot know their MACs.", "Коммутатор ещё не видел ни одного кадра от хостов, поэтому их MAC знать не может."],
    ["Only the MAC of the switch itself", "The table holds learned source MACs of other devices; the switch does not pre-populate it with its own.", "В таблице — выученные MAC источников других устройств; свой адрес коммутатор туда заранее не вносит."],
    ["The entries saved before the reboot", "Dynamic entries are not kept across a power cycle; the table starts from scratch.", "Динамические записи при перезагрузке не сохраняются; таблица начинается с нуля."],
  ], "When a switch is turned on its MAC address table is empty and fills only as frames arrive.", "При включении таблица MAC-адресов пуста и заполняется только по мере поступления кадров."),

  qx("Which command displays the MAC address table on a Cisco switch?", "show mac address-table", [
    ["show ip arp", "show ip arp displays the ARP cache (IP-to-MAC) on a router, not the Layer 2 forwarding table.", "show ip arp показывает кэш ARP (IP — MAC) на маршрутизаторе, а не таблицу пересылки уровня 2."],
    ["show cam-table", "There is no such IOS command; the table is shown with show mac address-table.", "Такой команды в IOS нет; таблицу выводит show mac address-table."],
    ["show interfaces status", "That command lists port status, speed and duplex, but not learned MAC addresses.", "Эта команда выводит состояние, скорость и дуплекс портов, но не выученные MAC-адреса."],
  ], "The CAM table is displayed from privileged EXEC with show mac address-table.", "Таблица CAM выводится из привилегированного EXEC командой show mac address-table."),

  qx("Which two things does a switch record when it learns from an incoming frame?", "The source MAC and the ingress port", [
    ["The destination MAC and the egress port", "The destination MAC is used for forwarding, not learning; the egress port is not known yet.", "MAC назначения нужен для пересылки, а не для изучения; выходной порт ещё неизвестен."],
    ["The source IP and the ingress port", "A switch does not read IP addresses; it learns Layer 2 source MACs.", "Коммутатор IP-адреса не читает; он запоминает MAC источника уровня 2."],
    ["The source MAC and the destination MAC", "Only the source MAC is learned, and it is tied to a port number, not to another MAC.", "Запоминается только MAC источника, и привязывается он к номеру порта, а не к другому MAC."],
  ], "For every frame the switch examines the source MAC and the port on which the frame entered, and stores that pair.", "Для каждого кадра коммутатор смотрит MAC источника и порт входа и сохраняет эту пару."),

  qx("A frame enters port 3 with a source MAC that is not in the table. What happens to the table?", "The MAC is added, mapped to port 3", [
    ["The MAC is added, mapped to the destination port", "Learned entries are tied to the port the frame came in on, not to where it is going.", "Выученная запись привязывается к порту, откуда пришёл кадр, а не к порту назначения."],
    ["Nothing until a reply frame is seen", "Learning happens on the first frame; the switch does not wait for any reply.", "Изучение происходит по первому же кадру; никакого ответа коммутатор не ждёт."],
    ["The whole table is flushed and rebuilt", "A new address is simply added; existing entries are not touched.", "Новый адрес просто добавляется; существующие записи не трогаются."],
  ], "A new source address is added to the table together with the number of the port where the frame arrived.", "Новый адрес источника добавляется в таблицу вместе с номером порта, через который вошёл кадр."),

  qx("A frame arrives with a source MAC already in the table on the same port. What happens to that entry?", "Its refresh timer is reset", [
    ["It is deleted and learned again", "A known address is not removed; only its aging timer is restarted.", "Известный адрес не удаляется; у него лишь перезапускается таймер старения."],
    ["It is flagged as a duplicate address", "Seeing the same MAC on the same port again is normal traffic, not a duplicate.", "Повторное появление того же MAC на том же порту — обычный трафик, а не дубликат."],
    ["Nothing — the entry never changes", "The entry does change: its 5-minute timer is reset so it does not age out.", "Запись меняется: её пятиминутный таймер сбрасывается, чтобы она не устарела."],
  ], "For a known address the switch simply resets the refresh timer, keeping the entry alive for another 5 minutes.", "Для известного адреса коммутатор просто сбрасывает таймер, продлевая запись ещё на 5 минут."),

  qx("By default, how long does an idle entry stay in the MAC address table?", "5 minutes", [
    ["30 seconds", "30 seconds would be far too short; the default aging time is 300 seconds, i.e. 5 minutes.", "30 секунд — слишком мало; время старения по умолчанию 300 секунд, то есть 5 минут."],
    ["60 minutes", "An hour is twelve times the real default; entries age out after 5 minutes.", "Час — в двенадцать раз больше реального значения; записи устаревают через 5 минут."],
    ["Until the switch reboots", "Dynamic entries are not permanent; they are removed after 5 minutes without refresh.", "Динамические записи не вечны; без обновления они удаляются через 5 минут."],
  ], "By default a MAC table entry lives 5 minutes; every frame from that MAC resets the timer.", "По умолчанию запись живёт 5 минут; каждый кадр от этого MAC сбрасывает таймер."),

  qx("The destination unicast MAC is in the table on port 7. Out of which ports is the frame sent?", "Only port 7", [
    ["All ports except the ingress port", "Flooding is for unknown unicasts and broadcasts; a known unicast goes out one port.", "Рассылка — для неизвестных unicast и broadcast; известный unicast идёт в один порт."],
    ["All ports including port 7", "Sending a known unicast everywhere is what a hub does; a switch forwards to one port.", "Рассылать известный unicast всюду — поведение концентратора; коммутатор шлёт в один порт."],
    ["No ports — the frame is filtered", "Filtering applies only when the destination is on the same port the frame came from.", "Фильтрация — только когда назначение на том же порту, откуда пришёл кадр."],
  ], "A unicast destination that is in the table is forwarded out that one port only.", "Unicast-назначение, которое есть в таблице, пересылается только в этот один порт."),

  qx("What is the name for a unicast frame whose destination MAC is not in the table?", "An unknown unicast", [
    ["A limited broadcast", "A broadcast has the all-ones destination MAC; this frame has a normal unicast destination.", "У broadcast адрес назначения из одних единиц; здесь же обычный unicast-адрес."],
    ["A flooded multicast", "A multicast has a group destination address; here the destination is a single, unknown host.", "У multicast групповой адрес назначения; здесь же назначение — один неизвестный хост."],
    ["A collision fragment", "A collision fragment is a damaged frame under 64 bytes; this is a valid frame with an unknown target.", "Фрагмент коллизии — повреждённый кадр короче 64 байт; здесь кадр целый, просто адресат неизвестен."],
  ], "A unicast frame to an address the switch has not learned yet is an unknown unicast and is flooded.", "Unicast-кадр на адрес, который коммутатор ещё не выучил, — неизвестный unicast, он рассылается."),

  qx("A frame to an unknown MAC arrives on port 3 of a 24-port switch. Where is it forwarded?", "Out all ports except port 3", [
    ["Out port 3 only", "Port 3 is where the frame came from; sending it back there would never reach the destination.", "Порт 3 — откуда кадр пришёл; возвращать его туда бессмысленно."],
    ["Out all 24 ports including port 3", "The ingress port is always excluded from flooding; only 23 ports receive it.", "Входящий порт из рассылки всегда исключается; кадр получат только 23 порта."],
    ["Nowhere — the frame is dropped", "Dropping would break communication; the switch floods so the unknown host can be reached.", "Отбрасывание сорвало бы связь; коммутатор рассылает кадр, чтобы неизвестный хост его получил."],
  ], "An unknown unicast is flooded out every port except the one it entered on.", "Неизвестный unicast рассылается во все порты, кроме того, через который он вошёл."),

  qx("How does a switch handle a frame whose destination is a broadcast or multicast MAC?", "Floods it out all ports except ingress", [
    ["Forwards it only to the default gateway", "A switch has no notion of a default gateway; that is a host and router concept.", "У коммутатора нет понятия шлюза по умолчанию; это понятие хоста и маршрутизатора."],
    ["Drops it to prevent loops", "Loops are prevented by STP, not by dropping broadcasts; the frame is flooded.", "Петли предотвращает STP, а не отбрасывание broadcast; кадр рассылается."],
    ["Sends it to the one port in the table", "Broadcast and multicast MACs are never learned as sources, so there is no single port for them.", "Broadcast и multicast MAC никогда не бывают источником и в таблицу не попадают, одного порта для них нет."],
  ], "Broadcast and multicast frames are treated like unknown unicasts: flooded out all ports except the incoming one.", "Broadcast и multicast обрабатываются как неизвестный unicast: рассылаются во все порты, кроме входящего."),

  qx("The destination MAC is in the table on the very port the frame arrived on. What does the switch do?", "Filters the frame and does not forward it", [
    ["Sends it back out the same port", "The destination is already on that segment and has heard the frame; repeating it is pointless.", "Адресат уже на этом сегменте и кадр слышал; повторять его бессмысленно."],
    ["Floods it out all the other ports", "Flooding is for unknown destinations; here the destination is known, just on the ingress port.", "Рассылка — для неизвестных адресатов; здесь адресат известен, просто он на входящем порту."],
    ["Deletes the entry and relearns it", "The entry is correct and is simply refreshed; nothing is deleted.", "Запись верна и просто обновляется; ничего не удаляется."],
  ], "When destination and source are on the same port, the switch filters the frame — it is not forwarded anywhere.", "Если адресат и источник на одном порту, коммутатор фильтрует кадр — никуда его не пересылает."),

  qx("Which forwarding method receives the entire frame and computes the CRC before forwarding?", "Store-and-forward", [
    ["Fast-forward", "Fast-forward starts sending right after the destination MAC, long before the CRC arrives.", "Fast-forward начинает передачу сразу после MAC назначения, задолго до прихода CRC."],
    ["Fragment-free", "Fragment-free checks only the first 64 bytes; the CRC at the end of the frame is never verified.", "Fragment-free проверяет только первые 64 байта; CRC в конце кадра не проверяется."],
    ["Cut-through", "Cut-through by definition forwards before the whole frame is received, so it cannot compute the CRC.", "Cut-through по определению пересылает, не дождавшись всего кадра, поэтому CRC вычислить не может."],
  ], "Store-and-forward buffers the whole frame, verifies the CRC and forwards only if it is valid.", "Store-and-forward принимает кадр целиком, проверяет CRC и пересылает, только если он верен."),

  qx("A store-and-forward switch receives a frame with an invalid CRC. What does it do?", "Discards the frame", [
    ["Forwards it with an error flag", "Ethernet has no error flag to set; a bad frame is simply dropped.", "В Ethernet нет флага ошибки; плохой кадр просто отбрасывается."],
    ["Corrects the error and forwards it", "A CRC only detects errors, it cannot repair the payload.", "CRC только обнаруживает ошибки, исправить данные по ней нельзя."],
    ["Floods it out all ports", "Flooding is a forwarding decision for unknown destinations, not a response to a CRC error.", "Рассылка — решение для неизвестных адресатов, а не реакция на ошибку CRC."],
  ], "Store-and-forward forwards a frame only if the CRC is valid; frames with errors are discarded.", "Store-and-forward пересылает кадр только при верной CRC; кадры с ошибками отбрасываются."),

  qx("Which forwarding method is required for QoS analysis on converged networks?", "Store-and-forward", [
    ["Fast-forward", "Fast-forward reads only the destination MAC, which is not enough to classify traffic for QoS.", "Fast-forward читает только MAC назначения, этого недостаточно для классификации трафика QoS."],
    ["Fragment-free", "Fragment-free looks at 64 bytes and does not hold the full frame needed for QoS analysis.", "Fragment-free смотрит 64 байта и не держит весь кадр, нужный для анализа QoS."],
    ["Shared-memory buffering", "Shared memory is a buffering scheme, not a forwarding method, and is not tied to QoS.", "Общая память — схема буферизации, а не метод пересылки, и к QoS не привязана."],
  ], "The notes state that store-and-forward is required for QoS analysis on converged networks.", "В конспекте указано: store-and-forward нужен для анализа QoS в конвергентных сетях."),

  qx("What is the minimum a cut-through switch must read before it can start forwarding?", "The destination MAC address", [
    ["The entire frame, header to trailer", "Waiting for the entire frame is store-and-forward; cut-through forwards before that.", "Ждать весь кадр — это store-and-forward; cut-through пересылает раньше."],
    ["The source MAC address", "The source MAC is used for learning; forwarding needs the destination address.", "MAC источника нужен для изучения; для пересылки нужен адрес назначения."],
    ["The frame check sequence", "The FCS is at the very end of the frame, so a cut-through switch never waits for it.", "FCS стоит в самом конце кадра, cut-through его никогда не ждёт."],
  ], "Cut-through needs only the destination MAC to pick the egress port and starts forwarding immediately.", "Cut-through нужен только MAC назначения, чтобы выбрать порт, и он сразу начинает пересылку."),

  qx("Which statement about cut-through switching is true?", "It performs no error checking", [
    ["It verifies the CRC of every frame", "The CRC is the last field of the frame; cut-through has already forwarded the frame by then.", "CRC — последнее поле кадра; к этому моменту cut-through уже переслал кадр."],
    ["It has higher latency than store-and-forward", "Cut-through has lower latency precisely because it does not wait for the whole frame.", "У cut-through задержка ниже именно потому, что он не ждёт весь кадр."],
    ["It requires the whole frame before forwarding", "Requiring the whole frame is the definition of store-and-forward, not cut-through.", "Требовать весь кадр — определение store-and-forward, а не cut-through."],
  ], "Cut-through forwards before the frame is fully received, so there is no error checking at all.", "Cut-through пересылает, не дожидаясь всего кадра, поэтому ошибки не проверяются вовсе."),

  qx("Which method forwards immediately after reading the destination address and has the lowest latency?", "Fast-forward", [
    ["Fragment-free", "Fragment-free waits for 64 bytes first, so its latency is medium, not the lowest.", "Fragment-free сначала ждёт 64 байта, поэтому его задержка средняя, а не наименьшая."],
    ["Store-and-forward", "Store-and-forward waits for the whole frame and has the highest latency of the three.", "Store-and-forward ждёт весь кадр и имеет самую большую задержку из трёх."],
    ["Port-based buffering", "Port-based buffering is a memory scheme, not a forwarding method.", "Буфер на порт — схема памяти, а не метод пересылки."],
  ], "Fast-forward is the typical cut-through method: it forwards right after the destination MAC and has the lowest latency.", "Fast-forward — типичный вариант cut-through: пересылает сразу после MAC назначения и даёт наименьшую задержку."),

  qx("How many bytes does fragment-free switching store and check before forwarding?", "The first 64 bytes", [
    ["The first 32 bytes", "32 bytes would not even cover the Ethernet header and the start of the payload; the check is 64 bytes.", "32 байта не покроют даже заголовок Ethernet и начало данных; проверяются 64 байта."],
    ["The first 128 bytes", "128 is twice the real value; the collision window is 64 bytes.", "128 — вдвое больше реального значения; окно коллизий — 64 байта."],
    ["The first 1518 bytes", "1518 bytes is a maximum full frame; checking that much would be store-and-forward.", "1518 байт — максимальный кадр целиком; проверять столько — это уже store-and-forward."],
  ], "Fragment-free stores and checks the first 64 bytes, where most errors and collisions occur.", "Fragment-free сохраняет и проверяет первые 64 байта, где случается большинство ошибок и коллизий."),

  qx("Why does fragment-free check exactly the first part of a frame?", "Most errors and collisions happen there", [
    ["The CRC checksum is always located there", "The CRC is in the trailer at the end of the frame, not in the first 64 bytes.", "CRC находится в трейлере в конце кадра, а не в первых 64 байтах."],
    ["The IP header ends there", "Fragment-free is a Layer 2 method and is not concerned with where the IP header ends.", "Fragment-free — метод уровня 2, где кончается заголовок IP, ему неважно."],
    ["The preamble is stored there", "The preamble precedes the frame and is stripped; it is not what fragment-free checks.", "Преамбула идёт перед кадром и отбрасывается; не её проверяет fragment-free."],
  ], "The first 64 bytes are where most errors and collisions occur, so checking them catches most bad frames cheaply.", "В первых 64 байтах случается большинство ошибок и коллизий, поэтому их проверка дёшево отсекает большинство плохих кадров."),

  qx("Order the methods from lowest to highest latency.", "Fast-forward, fragment-free, store-and-forward", [
    ["Store-and-forward, fragment-free, fast-forward", "This is reversed: store-and-forward waits for the whole frame and is the slowest.", "Порядок перевёрнут: store-and-forward ждёт весь кадр и самый медленный."],
    ["Fragment-free, fast-forward, store-and-forward", "Fast-forward waits for less (just the destination MAC) than fragment-free (64 bytes).", "Fast-forward ждёт меньше (только MAC назначения), чем fragment-free (64 байта)."],
    ["Fast-forward, store-and-forward, fragment-free", "Fragment-free waits for 64 bytes, which is less than the whole frame store-and-forward needs.", "Fragment-free ждёт 64 байта, это меньше целого кадра, который нужен store-and-forward."],
  ], "The less a method waits for, the lower its latency: destination MAC only (lowest), 64 bytes (medium, partial checking), the whole frame (highest).", "Чем меньше метод ждёт, тем ниже задержка: только MAC назначения (самая малая), 64 байта (средняя, частичная проверка), весь кадр (самая большая)."),

  qx("In port-based memory buffering, what can happen when one frame waits for a busy destination port?", "It delays all frames queued behind it", [
    ["It is moved to another port's queue", "Port-based queues are fixed per port; a frame cannot migrate to a different queue.", "Очереди на порт жёстко привязаны к портам; кадр не может перейти в другую очередь."],
    ["It is dropped immediately", "The frame waits in its queue; the problem is the delay it causes, not an instant drop.", "Кадр ждёт в очереди; проблема — в задержке, которую он создаёт, а не в мгновенном отбрасывании."],
    ["It is forwarded without a CRC check", "Buffering has nothing to do with CRC checking; that depends on the forwarding method.", "Буферизация не связана с проверкой CRC; это зависит от метода пересылки."],
  ], "With per-port queues a single frame for a busy port can hold up every frame behind it in that queue.", "При очередях на порт один кадр для занятого порта задерживает все следующие за ним кадры в этой очереди."),

  qx("Which buffering method uses one common buffer that is dynamically shared by all ports?", "Shared memory", [
    ["Port-based memory", "Port-based memory gives each port its own queue instead of one common pool.", "Буфер на порт даёт каждому порту свою очередь вместо одного общего пула."],
    ["Flash memory", "Flash stores the IOS image and configuration, not frames waiting to be forwarded.", "Флеш хранит образ IOS и конфигурацию, а не кадры в ожидании пересылки."],
    ["Content addressable memory", "CAM holds the MAC address table; it is not a frame buffer.", "В CAM лежит таблица MAC-адресов; это не буфер кадров."],
  ], "Shared memory puts all frames into one common buffer allocated dynamically: fewer frames are dropped, which matters for asymmetric switching.", "Общая память складывает все кадры в один динамически выделяемый буфер: теряется меньше кадров, что важно для асимметричной коммутации."),

  qx("What does 'asymmetric switching' mean?", "Different data rates on different ports", [
    ["Different MAC tables on each port", "A switch has one MAC table for all ports; asymmetry refers to port speeds.", "У коммутатора одна таблица MAC на все порты; асимметрия — про скорости портов."],
    ["Half-duplex on one side and full on the other", "That is a duplex mismatch, a fault, not asymmetric switching.", "Это несовпадение дуплекса — неисправность, а не асимметричная коммутация."],
    ["Forwarding frames without a CRC check", "Skipping the CRC describes cut-through forwarding, not port speeds.", "Пропуск проверки CRC описывает cut-through, а не скорости портов."],
  ], "Asymmetric switching means ports operate at different data rates, e.g. a gigabit uplink and 100 Mbps access ports.", "Асимметричная коммутация — это разные скорости на портах, например гигабитный аплинк и порты доступа 100 Мбит/с."),

  qx("Which mechanism lets two connected devices agree on the best speed and duplex?", "Autonegotiation", [
    ["Auto-MDIX", "Auto-MDIX only swaps the transmit and receive pairs for the cable type; it does not set speed or duplex.", "Auto-MDIX лишь меняет местами пары передачи и приёма под тип кабеля; скорость и дуплекс он не выбирает."],
    ["Spanning Tree Protocol", "STP prevents switching loops; it has no role in choosing speed or duplex.", "STP предотвращает петли коммутации; к выбору скорости и дуплекса отношения не имеет."],
    ["Store-and-forward", "Store-and-forward is a frame forwarding method, not a link negotiation process.", "Store-and-forward — метод пересылки кадров, а не процесс согласования канала."],
  ], "Autonegotiation lets both ends of a link agree on the best common speed and duplex mode.", "Автосогласование позволяет обоим концам канала выбрать лучшие общие скорость и режим дуплекса."),

  qx("In which duplex mode can a Gigabit Ethernet port operate?", "Full-duplex only", [
    ["Half-duplex only", "Half-duplex is a legacy 10/100 Mbps mode; Gigabit ports do not use it.", "Половинный дуплекс — устаревший режим 10/100 Мбит/с; гигабитные порты его не используют."],
    ["Either half- or full-duplex", "Only 10/100 Mbps ports can run half-duplex; Gigabit Ethernet is full-duplex only.", "Половинный дуплекс возможен только на портах 10/100 Мбит/с; Gigabit Ethernet — только полный."],
    ["Simplex only", "Simplex is one-way transmission and is not an Ethernet duplex mode at all.", "Симплекс — односторонняя передача, это вообще не режим дуплекса Ethernet."],
  ], "Gigabit Ethernet ports work only in full-duplex mode.", "Порты Gigabit Ethernet работают только в полном дуплексе."),

  qx("One end of a 100 Mbps link is full-duplex, the other half-duplex. What is the likely outcome?", "Poor performance on the link", [
    ["The link does not come up at all", "A duplex mismatch usually leaves the link up but slow and error-prone, not down.", "При несовпадении дуплекса канал обычно поднимается, но работает медленно и с ошибками, а не лежит."],
    ["The switch floods every frame", "Flooding depends on the MAC table, not on duplex settings.", "Рассылка зависит от таблицы MAC, а не от настроек дуплекса."],
    ["The MAC table stops learning", "Learning continues regardless of duplex; the problem is collisions and errors.", "Изучение продолжается при любом дуплексе; проблема в коллизиях и ошибках."],
  ], "A duplex mismatch is one of the most common causes of poor performance on 10/100 Mbps links.", "Несовпадение дуплекса — одна из самых частых причин плохой работы каналов 10/100 Мбит/с."),

  qx("What does Auto-MDIX do on a switch port?", "Detects the cable type and swaps the tx/rx pairs", [
    ["Negotiates the port speed and duplex with the peer", "Speed and duplex are chosen by autonegotiation, not by Auto-MDIX.", "Скорость и дуплекс выбирает автосогласование, а не Auto-MDIX."],
    ["Checks the CRC of every incoming frame", "CRC checking is done by store-and-forward switching, not by the MDIX function.", "Проверку CRC выполняет store-and-forward, а не функция MDIX."],
    ["Ages old entries out of the MAC table", "Aging is handled by the 5-minute refresh timer, unrelated to cabling.", "Старение записей обеспечивает пятиминутный таймер, к кабелям он не относится."],
  ], "Auto-MDIX detects whether the cable is straight-through or crossover and swaps the transmit and receive pairs as needed.", "Auto-MDIX определяет, прямой кабель или перекрёстный, и при необходимости меняет местами пары передачи и приёма."),

  qx("With Auto-MDIX enabled, which cable can connect two switches?", "Either straight-through or crossover", [
    ["Only a crossover cable between the two switches", "Without Auto-MDIX a crossover would be required, but with it either cable works.", "Без Auto-MDIX понадобился бы перекрёстный кабель, но с ним подходит любой."],
    ["Only a straight-through cable", "Auto-MDIX removes the restriction in both directions; a crossover works just as well.", "Auto-MDIX снимает ограничение в обе стороны; перекрёстный подходит так же."],
    ["Only a rollover cable", "A rollover cable is for console access, not for Ethernet links between switches.", "Консольный (rollover) кабель — для доступа к консоли, а не для Ethernet-линков между коммутаторами."],
  ], "Because Auto-MDIX swaps the pairs automatically, both straight-through and crossover cables work.", "Так как Auto-MDIX сам меняет пары местами, подходит и прямой, и перекрёстный кабель."),

  qx("At which prompt is the command 'mdix auto' entered?", "Switch(config-if)#", [
    ["Switch#", "Switch# is privileged EXEC, used for show commands; configuration is not entered there.", "Switch# — привилегированный EXEC для команд show; конфигурацию там не вводят."],
    ["Switch(config)#", "Global configuration mode is one level too high; mdix auto applies to a specific interface.", "Глобальная конфигурация — на уровень выше; mdix auto относится к конкретному интерфейсу."],
    ["Switch>", "Switch> is user EXEC, where no configuration commands are allowed.", "Switch> — пользовательский EXEC, где команды настройки недоступны."],
  ], "mdix auto is an interface setting, so it is entered in interface configuration mode, Switch(config-if)#.", "mdix auto — настройка интерфейса, поэтому вводится в режиме настройки интерфейса Switch(config-if)#."),

  qx("PC-A (port 1) sends a frame to PC-B. The table holds only AA:AA -> 1 (PC-A). What is in the table afterwards?", "Still only AA:AA -> 1", [
    ["AA:AA -> 1 and PC-B's MAC -> 1", "PC-B has not sent anything, so its MAC cannot be learned; and it would not be on port 1 anyway.", "PC-B ничего не отправлял, поэтому его MAC выучить нельзя; да и на порту 1 его бы не было."],
    ["PC-B's MAC on every flooded port", "Flooding sends a frame out; it never adds destination MACs to the table.", "Рассылка отправляет кадр наружу; MAC назначения в таблицу она не добавляет."],
    ["Nothing — the table is flushed", "An unknown destination causes flooding, not a table reset.", "Неизвестный адресат вызывает рассылку, а не сброс таблицы."],
  ], "The switch learns only from sources; AA:AA was already known, so the table is unchanged while the frame is flooded.", "Коммутатор учится только по источникам; AA:AA уже известен, таблица не меняется, а кадр рассылается."),

  qx("When will PC-B's MAC address appear in the switch table?", "When PC-B itself sends a frame", [
    ["When PC-A sends a frame to PC-B", "A frame addressed to PC-B carries PC-B only as destination, and destinations are not learned.", "В кадре для PC-B его адрес стоит только как назначение, а назначения не запоминаются."],
    ["When the switch floods a frame to it", "Flooding is output; learning happens only on frames entering the switch with PC-B as source.", "Рассылка — это вывод; изучение происходит только по входящим кадрам с PC-B в источнике."],
    ["When the 5-minute aging timer expires", "Aging removes entries; it never adds new ones.", "Старение удаляет записи; новые оно не добавляет."],
  ], "An address is learned only from the source field, so PC-B is added when it transmits something.", "Адрес изучается только по полю источника, поэтому PC-B появится, когда сам что-то передаст."),

  tfx("Auto-MDIX is disabled by default on Cisco switch ports and must be enabled manually.", false,
    "Auto-MDIX is enabled by default; the command mdix auto is only needed to re-enable it after it was turned off.",
    "Auto-MDIX включён по умолчанию; команда mdix auto нужна лишь, чтобы включить его заново после отключения.",
    "Answering True confuses the existence of the mdix auto command with the default state — the feature is already on.",
    "Ответ «верно» путает наличие команды mdix auto с состоянием по умолчанию — функция и так включена."),

  tfx("A switch learns addresses from the destination MAC and forwards based on the source MAC.", false,
    "It is the other way round: the switch learns from the source MAC and forwards by the destination MAC.",
    "Всё наоборот: коммутатор учится по MAC источника, а пересылает по MAC назначения.",
    "Answering True swaps the two roles; learning from destinations would never tell the switch where a host actually is.",
    "Ответ «верно» меняет роли местами; изучение по назначениям никогда не показало бы, где хост на самом деле."),

  tfx("Duplex and speed may differ at the two ends of a link as long as autonegotiation is enabled.", false,
    "Duplex and speed must match on both ends; autonegotiation exists precisely to make them agree.",
    "Дуплекс и скорость должны совпадать на обоих концах; автосогласование как раз и нужно, чтобы они совпали.",
    "Answering True ignores that a mismatch — e.g. half on one side, full on the other — causes poor performance.",
    "Ответ «верно» не учитывает, что несовпадение — скажем, half с одной стороны и full с другой — ведёт к плохой работе канала."),
];
