// Written tasks are self-checked: several valid VLSM allocations are possible.
export const writtenQuestions = [
  {
    id: '4-26',
    en: 'What is the assignable IPv4 range for the subnet containing 10.40.77.130/21?',
    ru: 'Какой диапазон IPv4-адресов можно назначить хостам в подсети 10.40.77.130/21?',
    answer: '10.40.72.1 – 10.40.79.254',
    whyRu: 'Маска /21 равна 255.255.248.0. Шаг третьего октета равен 8. Число 77 попадает в блок 72–79. Первый адрес блока 10.40.72.0 обозначает сеть, последний 10.40.79.255 служит для broadcast. Хостам доступны адреса между ними.',
    whyEn: 'A /21 mask is 255.255.248.0. Third-octet blocks advance by eight, placing 77 in the 72–79 block. Exclude the network address 10.40.72.0 and broadcast address 10.40.79.255.',
  },
  {
    id: '4-27',
    en: 'Which Cisco IOS command moves you from privileged EXEC to global configuration mode?',
    ru: 'Какой командой Cisco IOS перейти из privileged EXEC в global configuration mode?',
    answer: 'configure terminal',
    whyRu: 'Из приглашения Router# команда configure terminal открывает общие настройки. Приглашение меняется на Router(config)#. Команда enable нужна на предыдущем шаге, чтобы попасть из Router> в Router#.',
    whyEn: 'At Router#, configure terminal opens global settings and changes the prompt to Router(config)#. The enable command belongs to the preceding transition from Router> to Router#.',
  },
  {
    id: '4-28',
    en: 'A host receives 2001:db8:cafe:7::/64 in an RA. Its MAC is 3c:52:82:1f:a0:9e. Build the compressed global unicast address using modified EUI-64.',
    ru: 'Хост получил префикс 2001:db8:cafe:7::/64 в Router Advertisement. Его MAC — 3c:52:82:1f:a0:9e. Запиши полный адрес SLAAC с modified EUI-64 в сокращённой форме.',
    answer: '2001:db8:cafe:7:3e52:82ff:fe1f:a09e',
    whyRu: 'Раздели MAC пополам и вставь ff:fe между 82 и 1f. Инвертируй бит U/L первого байта: 3c XOR 02 = 3e. Собери пары байтов в 3e52:82ff:fe1f:a09e и допиши их после четырёх групп префикса. Полностью нулевых групп здесь нет.',
    whyEn: 'Insert ff:fe between the two halves of the MAC and flip the U/L bit of the first byte (3c XOR 02 = 3e). Pair the bytes to get 3e52:82ff:fe1f:a09e and append these four groups to the /64 prefix. No all-zero hextets remain.',
  },
  {
    id: '4-29',
    en: 'Divide 172.20.48.0/20 into eight equal subnets. Give the new subnet mask and the usable host count per subnet.',
    ru: 'Раздели 172.20.48.0/20 на восемь равных подсетей. Каковы новая маска и число доступных адресов хостов в каждой?',
    answer: '/23 · 255.255.254.0 · 510',
    whyRu: 'Для восьми подсетей нужны три дополнительных сетевых бита (2³ = 8). Получаем /23. Девять бит хоста дают 512 адресов, из которых два зарезервированы для сети и broadcast.',
    whyEn: 'Borrow three bits because 2³ = 8. The prefix becomes /23, leaving nine host bits. Each subnet has 512 addresses, of which 510 can be assigned to hosts.',
  },
  {
    id: '4-30',
    en: 'Allocate 172.20.10.0/24 using VLSM. Design needs 100 hosts, Sales 28, Guest 10 and two point-to-point links need two each. Allocate largest first. Give each prefix, network and broadcast.',
    ru: 'Распредели 172.20.10.0/24 методом VLSM. Design требует 100 хостов, Sales — 28, Guest — 10 и два соединения point-to-point — по два. Начни с крупнейшей сети. Для каждой укажи префикс, адрес сети и broadcast.',
    answer: 'Design  172.20.10.0/25 → 172.20.10.127\nSales   172.20.10.128/27 → 172.20.10.159\nGuest   172.20.10.160/28 → 172.20.10.175\nLink 1  172.20.10.176/30 → 172.20.10.179\nLink 2  172.20.10.180/30 → 172.20.10.183',
    whyRu: 'Для каждой строки выбери минимальный блок, где после вычета сети и broadcast хватает хостов. Получатся блоки на 128, 32, 16, 4 и 4 адреса. В примере каждый начинается после broadcast предыдущего и на границе своего блока. /30 даёт два адреса хостов и отдельный broadcast, как требует таблица.',
    whyEn: 'Choose the smallest block that fits each demand after reserving network and broadcast. Block sizes are 128, 32, 16, 4 and 4. Each starts on an aligned boundary after the preceding broadcast. Each /30 supplies two host addresses and a distinct broadcast as required by the table.',
  },
  {
    id: 'open-26',
    en: 'What is the assignable IPv4 range for the subnet containing 172.20.77.146/20?',
    ru: 'Какой диапазон адресов можно назначить хостам в подсети 172.20.77.146/20?',
    answer: '172.20.64.1 – 172.20.79.254',
    whyRu: 'При /20 третий октет маски равен 240, шаг равен 16. Число 77 лежит в блоке 64–79. Убери адрес сети 172.20.64.0 и broadcast 172.20.79.255.',
    whyEn: 'A /20 has third mask octet 240 and block size 16. The block containing 77 runs from 64 to 79. Exclude 172.20.64.0 and 172.20.79.255 to get the host range.',
  },
  {
    id: 'open-27',
    en: 'A host has the address 192.168.190.205/27. To which subnet does it belong?',
    ru: 'Какой подсети принадлежит хост 192.168.190.205/27?',
    answer: '192.168.190.192/27',
    whyRu: 'Пять бит хоста означают шаг 32 в последнем октете. Ближайшее кратное 32 снизу для 205 — это 192. Подсеть охватывает адреса от .192 до .223.',
    whyEn: 'Five host bits give a last-octet block size of 32. The largest multiple of 32 at or below 205 is 192, so the subnet spans .192 through .223.',
  },
  {
    id: 'open-28',
    en: 'What is the directed broadcast address of the subnet containing 172.20.77.146/20?',
    ru: 'Найди directed broadcast для подсети 172.20.77.146/20.',
    answer: '172.20.79.255',
    whyRu: 'Подсеть начинается с 172.20.64.0, следующая начинается с 172.20.80.0. Адрес перед началом следующей подсети и есть broadcast. В нём все 12 бит хоста равны единице.',
    whyEn: 'This subnet starts at 172.20.64.0 and the next at 172.20.80.0. The preceding address has all twelve host bits set and is the directed broadcast.',
  },
  {
    id: 'open-29',
    en: 'Which Cisco IOS command displays a brief summary of IPv4 addresses and interface status on a router?',
    ru: 'Какая команда Cisco IOS кратко показывает IPv4-адреса и состояние интерфейсов маршрутизатора?',
    answer: 'show ip interface brief',
    whyRu: 'В выводе по одной строке на интерфейс с IPv4-адресом, Status и Protocol. Слово ip выбирает IPv4, а brief задаёт краткую сводку.',
    whyEn: 'The output gives one line per interface with its IPv4 address, status and line protocol. The ip keyword selects IPv4 and brief selects the summary.',
  },
  {
    id: 'open-30',
    en: 'In Cisco IOS interface configuration mode, assign 192.168.30.1 with mask 255.255.255.0. Write the command.',
    ru: 'В режиме настройки интерфейса Cisco IOS назначь ему 192.168.30.1 с маской 255.255.255.0. Запиши команду.',
    answer: 'ip address 192.168.30.1 255.255.255.0',
    whyRu: 'В приглашении Router(config-if)# после ip address указывают адрес интерфейса и маску подсети через пробел. Здесь /24 соответствует 255.255.255.0. Команда no shutdown отдельно включает интерфейс.',
    whyEn: 'At Router(config-if)#, ip address takes the interface address followed by the dotted subnet mask. Here /24 corresponds to 255.255.255.0. Enabling the interface with no shutdown is a separate action.',
  },
];

const variant4Points: Record<string, number> = {
  '4-26': 7, '4-27': 3, '4-28': 4, '4-29': 5, '4-30': 10,
};
export function writtenPoints(id: string): number {
  return variant4Points[id] ?? 5;
}
