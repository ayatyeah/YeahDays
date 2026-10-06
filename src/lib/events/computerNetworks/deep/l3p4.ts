import { qx, tfx, type Draft } from "../../types";

/** Лекция 3, часть 4 — двоичная и шестнадцатеричная системы: разбор до косточек. */
export const deepL3P4: Draft[] = [
  qx("What are the digits 1 and 0 of the binary system called?", "Bits", [
    ["Bytes", "A byte is a group of 8 bits, not a single binary digit.", "Байт — группа из 8 бит, а не одна двоичная цифра."],
    ["Octets", "An octet is 8 bits, one of the four sections of an IPv4 address.", "Октет — 8 бит, одна из четырёх частей адреса IPv4."],
    ["Hextets", "A hextet is a group of four hex digits in an IPv6 address.", "Хекстет — группа из четырёх шестнадцатеричных цифр в адресе IPv6."],
  ], "Binary uses the digits 1 and 0, which are called bits; decimal uses the digits 0 through 9.", "В двоичной системе цифры 1 и 0 называются битами; в десятичной — цифры от 0 до 9."),

  qx("How many bits does one octet of an IPv4 address contain?", "8", [
    ["4", "Four bits is what one hexadecimal digit represents, not an octet.", "Четыре бита — это одна шестнадцатеричная цифра, а не октет."],
    ["16", "Sixteen bits is a hextet (four hex digits), not an octet.", "Шестнадцать бит — это хекстет (четыре hex-цифры), а не октет."],
    ["32", "Thirty-two bits is the whole IPv4 address, made of four octets.", "Тридцать два бита — весь адрес IPv4, состоящий из четырёх октетов."],
  ], "Each octet has 8 bits (1 byte); four octets make the 32-bit IPv4 address.", "В каждом октете 8 бит (1 байт); четыре октета образуют 32-битный адрес IPv4."),

  qx("How do people normally read and write an IPv4 address?", "As four decimal octets separated by dots", [
    ["As eight hextets separated by colons", "Eight hextets with colons is the IPv6 format.", "Восемь хекстетов через двоеточие — формат IPv6."],
    ["As twelve hex digits separated by dashes", "Twelve hex digits with dashes is a MAC address like 00-1A-2B-3C-4D-5E.", "Двенадцать hex-цифр через дефис — MAC-адрес вида 00-1A-2B-3C-4D-5E."],
    ["As a single 32-digit binary string", "Devices work in binary, but people read IPv4 as dotted decimal.", "Устройства работают в двоичном виде, но люди читают IPv4 как десятичный с точками."],
  ], "An IPv4 address is 32 bits, but it is written for people in dotted decimal: four octets separated by dots.", "Адрес IPv4 — 32 бита, но для людей он записывается десятичным с точками: четыре октета через точку."),

  qx("In the decimal number 1234, what positional value does the digit 2 carry?", "100", [
    ["10", "The 10s position holds the 3; the 2 is one place further left.", "В позиции десятков стоит 3; двойка на одну позицию левее."],
    ["1000", "The 1000s position holds the 1; 1234 = 1 x 1000 + 2 x 100 + 3 x 10 + 4 x 1.", "В позиции тысяч стоит 1; 1234 = 1 x 1000 + 2 x 100 + 3 x 10 + 4 x 1."],
    ["2", "2 is the digit itself; its positional value is 100, giving 2 x 100 = 200.", "2 — сама цифра; её позиционный вес 100, то есть 2 x 100 = 200."],
  ], "Decimal positions are powers of ten: 1234 = 1 x 1000 + 2 x 100 + 3 x 10 + 4 x 1.", "Позиции в десятичной системе — степени десяти: 1234 = 1 x 1000 + 2 x 100 + 3 x 10 + 4 x 1."),

  qx("What are the positional values of the eight bits in an octet, left to right?", "128, 64, 32, 16, 8, 4, 2, 1", [
    ["8, 7, 6, 5, 4, 3, 2, 1", "Positions are powers of two, not a countdown of position numbers.", "Веса — степени двойки, а не обратный отсчёт номеров позиций."],
    ["1000, 100, 10, 1 and so on", "Powers of ten are decimal positions; binary uses powers of two.", "Степени десяти — десятичные позиции; в двоичной системе степени двойки."],
    ["256, 128, 64, 32, 16, 8, 4, 2", "An octet tops out at 128; 256 would need a ninth bit.", "В октете старший вес 128; для 256 нужен девятый бит."],
  ], "Binary positions are powers of two; for one octet the row is 128 64 32 16 8 4 2 1.", "Двоичные позиции — степени двойки; для одного октета ряд такой: 128 64 32 16 8 4 2 1."),

  qx("What is binary 10110000 in decimal?", "176", [
    ["172", "172 is 10101100 = 128 + 32 + 8 + 4, not 10110000.", "172 — это 10101100 = 128 + 32 + 8 + 4, а не 10110000."],
    ["180", "180 would be 10110100 = 128 + 32 + 16 + 4; here the 4 bit is 0.", "180 — это 10110100 = 128 + 32 + 16 + 4; здесь бит 4 равен 0."],
    ["208", "208 is 11010000 = 128 + 64 + 16; here the 64 bit is 0.", "208 — это 11010000 = 128 + 64 + 16; здесь бит 64 равен 0."],
  ], "10110000 has ones in the 128, 32 and 16 positions: 128 + 32 + 16 = 176.", "В 10110000 единицы стоят в позициях 128, 32 и 16: 128 + 32 + 16 = 176."),

  qx("Convert decimal 224 to 8-bit binary.", "11100000", [
    ["11110000", "11110000 = 128 + 64 + 32 + 16 = 240, too much by 16.", "11110000 = 128 + 64 + 32 + 16 = 240, на 16 больше."],
    ["11000000", "11000000 = 128 + 64 = 192; 224 needs the 32 bit too.", "11000000 = 128 + 64 = 192; для 224 нужен ещё бит 32."],
    ["10100000", "10100000 = 128 + 32 = 160, missing the 64 bit.", "10100000 = 128 + 32 = 160, не хватает бита 64."],
  ], "224 = 128 + 64 + 32, so the three left-most bits are 1: 11100000.", "224 = 128 + 64 + 32, значит три старших бита — единицы: 11100000."),

  qx("What is decimal 10 in 8-bit binary?", "00001010", [
    ["00001100", "00001100 = 8 + 4 = 12.", "00001100 = 8 + 4 = 12."],
    ["00001011", "00001011 = 8 + 2 + 1 = 11.", "00001011 = 8 + 2 + 1 = 11."],
    ["00010000", "00010000 = 16, a single bit in the 16 position.", "00010000 = 16, одна единица в позиции 16."],
  ], "10 = 8 + 2, so the 8 and 2 bits are set: 00001010 (the last octet of 192.168.11.10).", "10 = 8 + 2, установлены биты 8 и 2: 00001010 (последний октет адреса 192.168.11.10)."),

  qx("What is binary 00001011 in decimal?", "11", [
    ["13", "13 is 00001101 = 8 + 4 + 1; here the 4 bit is 0 and the 2 bit is 1.", "13 — это 00001101 = 8 + 4 + 1; здесь бит 4 равен 0, а бит 2 — 1."],
    ["10", "10 is 00001010 = 8 + 2; 00001011 also has the 1 bit set.", "10 — это 00001010 = 8 + 2; в 00001011 установлен ещё бит 1."],
    ["12", "12 is 00001100 = 8 + 4.", "12 — это 00001100 = 8 + 4."],
  ], "00001011 = 8 + 2 + 1 = 11, the third octet of 192.168.11.10.", "00001011 = 8 + 2 + 1 = 11, третий октет адреса 192.168.11.10."),

  qx("Convert decimal 200 to 8-bit binary.", "11001000", [
    ["11000100", "11000100 = 128 + 64 + 4 = 196.", "11000100 = 128 + 64 + 4 = 196."],
    ["11001100", "11001100 = 128 + 64 + 8 + 4 = 204.", "11001100 = 128 + 64 + 8 + 4 = 204."],
    ["11010000", "11010000 = 128 + 64 + 16 = 208.", "11010000 = 128 + 64 + 16 = 208."],
  ], "200 >= 128 (left 72), 72 >= 64 (left 8), 8 < 32, 8 < 16, 8 >= 8 (left 0): 11001000.", "200 >= 128 (остаток 72), 72 >= 64 (остаток 8), 8 < 32, 8 < 16, 8 >= 8 (остаток 0): 11001000."),

  qx("What is binary 10000001 in decimal?", "129", [
    ["128", "128 is 10000000; the final 1 adds one more.", "128 — это 10000000; последняя единица добавляет ещё 1."],
    ["130", "130 is 10000010 = 128 + 2; here the last bit is in the 1 position.", "130 — это 10000010 = 128 + 2; здесь последний бит стоит в позиции 1."],
    ["65", "65 is 01000001 = 64 + 1; the first bit here is worth 128, not 64.", "65 — это 01000001 = 64 + 1; первый бит здесь весит 128, а не 64."],
  ], "The outer bits are set: 128 + 1 = 129.", "Установлены крайние биты: 128 + 1 = 129."),

  qx("Convert decimal 254 to 8-bit binary.", "11111110", [
    ["11111111", "11111111 is 255, one more than 254.", "11111111 — это 255, на единицу больше 254."],
    ["11111101", "11111101 = 255 - 2 = 253.", "11111101 = 255 - 2 = 253."],
    ["11111100", "11111100 = 255 - 3 = 252.", "11111100 = 255 - 3 = 252."],
  ], "254 = 255 - 1: every bit is 1 except the 1 position, giving 11111110.", "254 = 255 - 1: все биты единицы, кроме позиции 1, получается 11111110."),

  qx("What is binary 01111111 in decimal?", "127", [
    ["128", "128 is 10000000, the single bit this number lacks.", "128 — это 10000000, единственный бит, которого здесь нет."],
    ["255", "255 is 11111111; here the 128 bit is 0.", "255 — это 11111111; здесь бит 128 равен 0."],
    ["63", "63 is 00111111; this number also has the 64 bit set.", "63 — это 00111111; здесь установлен ещё и бит 64."],
  ], "64 + 32 + 16 + 8 + 4 + 2 + 1 = 127, which is also 255 - 128.", "64 + 32 + 16 + 8 + 4 + 2 + 1 = 127, то есть 255 - 128."),

  qx("Convert decimal 100 to 8-bit binary.", "01100100", [
    ["01100010", "01100010 = 64 + 32 + 2 = 98.", "01100010 = 64 + 32 + 2 = 98."],
    ["01101000", "01101000 = 64 + 32 + 8 = 104.", "01101000 = 64 + 32 + 8 = 104."],
    ["11001000", "11001000 = 128 + 64 + 8 = 200, double the target.", "11001000 = 128 + 64 + 8 = 200, вдвое больше нужного."],
  ], "100 < 128 (0), 100 >= 64 (1, left 36), 36 >= 32 (1, left 4), 4 < 16, 4 < 8, 4 >= 4 (1): 01100100.", "100 < 128 (0), 100 >= 64 (1, остаток 36), 36 >= 32 (1, остаток 4), 4 < 16, 4 < 8, 4 >= 4 (1): 01100100."),

  qx("When converting decimal to binary, at which position do you start?", "128, the most significant bit", [
    ["1, the least significant bit", "The method works from the most significant bit at 128 down to 1.", "Метод идёт от старшего бита с весом 128 вниз до 1."],
    ["255, the largest octet value", "255 is the maximum value, not a positional value in the octet row.", "255 — максимальное значение, а не вес позиции в ряду октета."],
    ["16, the middle of the octet", "Starting in the middle would skip the 128, 64 and 32 decisions.", "Начав с середины, пропустишь решения по 128, 64 и 32."],
  ], "Start at the 128 position (the most significant bit) and move right, down to the position of 1.", "Начинай с позиции 128 (старший бит) и двигайся вправо до позиции 1."),

  qx("In decimal-to-binary conversion, the number is greater than or equal to the positional value. What do you do?", "Write 1 and subtract the value", [
    ["Write 0 and keep the number", "Writing 0 and keeping the number is the step when the number is smaller than the position.", "Писать 0 и оставлять число — шаг для случая, когда число меньше веса позиции."],
    ["Write 1 and keep the number", "If you do not subtract, the next positions would be compared against the wrong remainder.", "Если не вычесть, следующие позиции сравнятся с неверным остатком."],
    ["Write 0 and subtract the value", "A 0 means the position adds nothing, so there is nothing to subtract.", "Ноль означает, что позиция ничего не добавляет, вычитать нечего."],
  ], "Yes: write 1 and subtract the positional value; no: write 0 and move on.", "Да — пиши 1 и вычитай вес позиции; нет — пиши 0 и иди дальше."),

  qx("Converting 168, after writing 1 at the 128 position, which remainder is compared with 64?", "40", [
    ["168", "The 128 was already subtracted: 168 - 128 = 40.", "128 уже вычли: 168 - 128 = 40."],
    ["104", "104 would be 168 - 64, but the first subtraction is 128.", "104 — это 168 - 64, но первым вычитается 128."],
    ["8", "8 is the remainder after also subtracting 32; at the 64 step it is still 40.", "8 — остаток после вычитания ещё и 32; на шаге 64 это пока 40."],
  ], "168 >= 128: write 1, left 40. 40 < 64: write 0. 40 >= 32: write 1, left 8.", "168 >= 128: пишем 1, остаток 40. 40 < 64: пишем 0. 40 >= 32: пишем 1, остаток 8."),

  qx("What is 10101100.00010000.00000001.11111110 in dotted decimal?", "172.16.1.254", [
    ["172.16.1.255", "The last octet is 11111110, which is 254; 255 would be 11111111.", "Последний октет 11111110 — это 254; 255 было бы 11111111."],
    ["168.16.1.254", "168 is 10101000; the first octet here is 10101100 = 128 + 32 + 8 + 4 = 172.", "168 — это 10101000; первый октет здесь 10101100 = 128 + 32 + 8 + 4 = 172."],
    ["172.32.1.254", "00010000 is 16, not 32; 32 would be 00100000.", "00010000 — это 16, а не 32; 32 было бы 00100000."],
  ], "Octet by octet: 128 + 32 + 8 + 4 = 172, 16, 1, and 255 - 1 = 254.", "По октетам: 128 + 32 + 8 + 4 = 172, 16, 1 и 255 - 1 = 254."),

  qx("Which binary string is the address 10.0.0.1?", "00001010.00000000.00000000.00000001", [
    ["00001010.00000000.00000000.00000010", "The last octet 00000010 is 2, giving 10.0.0.2.", "Последний октет 00000010 — это 2, получается 10.0.0.2."],
    ["00001100.00000000.00000000.00000001", "00001100 = 8 + 4 = 12, giving 12.0.0.1.", "00001100 = 8 + 4 = 12, получается 12.0.0.1."],
    ["00001010.00000001.00000000.00000000", "The 1 is in the second octet here, giving 10.1.0.0.", "Единица здесь во втором октете, получается 10.1.0.0."],
  ], "10 = 8 + 2 = 00001010, the zeros stay 00000000, and 1 = 00000001.", "10 = 8 + 2 = 00001010, нули остаются 00000000, а 1 = 00000001."),

  qx("Which binary string is the address 192.168.1.1?", "11000000.10101000.00000001.00000001", [
    ["11000000.10101000.00000001.00000010", "The last octet 00000010 is 2, so this is 192.168.1.2.", "Последний октет 00000010 — это 2, значит это 192.168.1.2."],
    ["11000000.10100000.00000001.00000001", "10100000 = 128 + 32 = 160, so this is 192.160.1.1.", "10100000 = 128 + 32 = 160, значит это 192.160.1.1."],
    ["11100000.10101000.00000001.00000001", "11100000 = 224, so this is 224.168.1.1.", "11100000 = 224, значит это 224.168.1.1."],
  ], "192 = 128 + 64 = 11000000, 168 = 128 + 32 + 8 = 10101000, and 1 = 00000001 twice.", "192 = 128 + 64 = 11000000, 168 = 128 + 32 + 8 = 10101000 и дважды 1 = 00000001."),

  qx("Which statement describes the hexadecimal system?", "Base sixteen, digits 0–9 and letters A–F", [
    ["Base sixteen, digits 0–15 written in full", "Hex needs one symbol per value, so 10–15 become the letters A–F.", "В hex каждому значению нужен один символ, поэтому 10–15 записываются буквами A–F."],
    ["Base ten with the letters A–F added", "Hex is base sixteen; base ten is decimal and has no letters.", "Hex — основание шестнадцать; основание десять — десятичная система, без букв."],
    ["Base eight, digits 0–7", "Base eight is octal, which is not in the notes.", "Основание восемь — восьмеричная система, в конспекте её нет."],
  ], "Hexadecimal is base sixteen: digits 0–9 and letters A–F, where A=10, B=11, C=12, D=13, E=14, F=15.", "Шестнадцатеричная система — основание шестнадцать: цифры 0–9 и буквы A–F, где A=10, B=11, C=12, D=13, E=14, F=15."),

  qx("Which addresses are written in hexadecimal?", "IPv6 and MAC addresses", [
    ["IPv4 and subnet masks", "IPv4 is written in dotted decimal.", "IPv4 записывается десятичным с точками."],
    ["Port numbers and TTL values", "These are not in the notes; hex is listed for IPv6 and MAC.", "Этого в конспекте нет; hex назван для IPv6 и MAC."],
    ["Dotted-decimal octets", "Dotted decimal is IPv4 notation, the opposite of hex.", "Десятичная запись с точками — формат IPv4, противоположность hex."],
  ], "Hexadecimal is used for IPv6 addresses (8 hextets) and MAC addresses (12 hex digits).", "Шестнадцатеричная запись используется для адресов IPv6 (8 хекстетов) и MAC-адресов (12 hex-цифр)."),

  qx("How many hexadecimal digits are needed to write one 8-bit octet?", "2", [
    ["1", "One hex digit covers only four bits, half an octet.", "Одна hex-цифра покрывает лишь четыре бита, половину октета."],
    ["4", "Four hex digits make a 16-bit hextet, two octets.", "Четыре hex-цифры — это 16-битный хекстет, два октета."],
    ["8", "Eight hex digits would be 32 bits, a whole IPv4 address.", "Восемь hex-цифр — это 32 бита, целый адрес IPv4."],
  ], "One hex digit stands for four bits, so two hex digits cover the eight bits of an octet (168 = A8).", "Одна hex-цифра заменяет четыре бита, значит две hex-цифры покрывают восемь бит октета (168 = A8)."),

  qx("How many hexadecimal digits does an IPv6 address contain?", "32", [
    ["8", "Eight is the number of hextets, each of which has four hex digits.", "Восемь — число хекстетов, в каждом по четыре hex-цифры."],
    ["16", "16 hex digits would be only 64 bits, half an IPv6 address.", "16 hex-цифр — лишь 64 бита, половина адреса IPv6."],
    ["128", "128 is the number of bits; each hex digit covers four of them.", "128 — число бит; каждая hex-цифра покрывает четыре."],
  ], "An IPv6 address is 128 bits: 32 hexadecimal digits in eight groups (hextets) of four.", "Адрес IPv6 — 128 бит: 32 шестнадцатеричные цифры в восьми группах (хекстетах) по четыре."),

  qx("How many bits does one hextet represent?", "16", [
    ["4", "Four bits is one hex digit; a hextet has four of them.", "Четыре бита — одна hex-цифра; в хекстете их четыре."],
    ["8", "Eight bits is an octet; a hextet is twice that.", "Восемь бит — октет; хекстет вдвое больше."],
    ["32", "32 bits would be two hextets (or a whole IPv4 address).", "32 бита — это два хекстета (или целый адрес IPv4)."],
  ], "A hextet is four hex digits, and each hex digit is four bits: 4 x 4 = 16 bits; eight hextets give 128.", "Хекстет — четыре hex-цифры по четыре бита: 4 x 4 = 16 бит; восемь хекстетов дают 128."),

  qx("What is hexadecimal C in binary?", "1100", [
    ["1010", "1010 is 10, which is A.", "1010 — это 10, то есть A."],
    ["1101", "1101 is 13, which is D.", "1101 — это 13, то есть D."],
    ["1011", "1011 is 11, which is B.", "1011 — это 11, то есть B."],
  ], "C = 12 = 8 + 4 = 1100.", "C = 12 = 8 + 4 = 1100."),

  qx("What is binary 1110 as a hexadecimal digit?", "E", [
    ["D", "D is 13 = 1101; 1110 has the 2 bit set instead of the 1 bit.", "D — это 13 = 1101; в 1110 установлен бит 2, а не бит 1."],
    ["F", "F is 15 = 1111; 1110 is missing the 1 bit.", "F — это 15 = 1111; в 1110 нет бита 1."],
    ["B", "B is 11 = 1011.", "B — это 11 = 1011."],
  ], "1110 = 8 + 4 + 2 = 14, and 14 is E in hexadecimal.", "1110 = 8 + 4 + 2 = 14, а 14 в шестнадцатеричной — E."),

  qx("What is the decimal value of hexadecimal B?", "11", [
    ["10", "10 is A.", "10 — это A."],
    ["12", "12 is C.", "12 — это C."],
    ["13", "13 is D.", "13 — это D."],
  ], "The letters run A=10, B=11, C=12, D=13, E=14, F=15.", "Буквы идут так: A=10, B=11, C=12, D=13, E=14, F=15."),

  qx("What is hexadecimal 0xC0 in decimal?", "192", [
    ["200", "200 is 11001000 = C8, not C0.", "200 — это 11001000 = C8, а не C0."],
    ["12", "12 is the value of C alone; the trailing 0 shifts it into the high nibble: 12 x 16 = 192.", "12 — значение одной C; завершающий 0 сдвигает её в старшую тетраду: 12 x 16 = 192."],
    ["204", "204 is 11001100 = CC.", "204 — это 11001100 = CC."],
  ], "C0 = 1100 0000 = 128 + 64 = 192, the first octet of 192.168.x.x.", "C0 = 1100 0000 = 128 + 64 = 192, первый октет адресов 192.168.x.x."),

  qx("What is decimal 255 in hexadecimal?", "FF", [
    ["EE", "EE = 1110 1110 = 238.", "EE = 1110 1110 = 238."],
    ["F0", "F0 = 1111 0000 = 240.", "F0 = 1111 0000 = 240."],
    ["0F", "0F = 0000 1111 = 15.", "0F = 0000 1111 = 15."],
  ], "255 = 11111111 = 1111 1111, and each 1111 is F: FF.", "255 = 11111111 = 1111 1111, каждая 1111 — это F: FF."),

  qx("What is decimal 172 in hexadecimal?", "AC", [
    ["CA", "CA = 1100 1010 = 202; the nibbles are swapped.", "CA = 1100 1010 = 202; тетрады перепутаны местами."],
    ["A8", "A8 = 1010 1000 = 168, not 172.", "A8 = 1010 1000 = 168, а не 172."],
    ["BC", "BC = 1011 1100 = 188.", "BC = 1011 1100 = 188."],
  ], "172 = 128 + 32 + 8 + 4 = 10101100 = 1010 1100 = A and C.", "172 = 128 + 32 + 8 + 4 = 10101100 = 1010 1100 = A и C."),

  qx("What is hexadecimal 7F in decimal?", "127", [
    ["128", "128 is 1000 0000 = 80 in hex.", "128 — это 1000 0000 = 80 в hex."],
    ["112", "112 is 0111 0000 = 70; the F adds another 15.", "112 — это 0111 0000 = 70; F добавляет ещё 15."],
    ["79", "79 is a decimal reading of the digits; 7F means 7 x 16 + 15.", "79 — чтение цифр как десятичных; 7F означает 7 x 16 + 15."],
  ], "7F = 0111 1111 = 64 + 32 + 16 + 8 + 4 + 2 + 1 = 127.", "7F = 0111 1111 = 64 + 32 + 16 + 8 + 4 + 2 + 1 = 127."),

  qx("What is hexadecimal 1A in decimal?", "26", [
    ["110", "110 comes from gluing 1 and 10 together; the 1 is worth 16, so 16 + 10 = 26.", "110 получается, если склеить 1 и 10; но 1 весит 16, так что 16 + 10 = 26."],
    ["17", "17 would be 16 + 1; the A is worth 10, not 1.", "17 было бы 16 + 1; но A стоит 10, а не 1."],
    ["42", "42 is 2A = 32 + 10.", "42 — это 2A = 32 + 10."],
  ], "1A = 0001 1010 = 16 + 8 + 2 = 26.", "1A = 0001 1010 = 16 + 8 + 2 = 26."),

  qx("What is hexadecimal 0x0A in 8-bit binary?", "00001010", [
    ["00001100", "00001100 is 12 = 0C.", "00001100 — это 12 = 0C."],
    ["00010000", "00010000 is 16 = 0x10.", "00010000 — это 16 = 0x10."],
    ["10100000", "10100000 is A0 = 160; the A is in the high nibble there.", "10100000 — это A0 = 160; там A стоит в старшей тетраде."],
  ], "0 = 0000 and A = 1010, so 0A = 0000 1010 = 00001010 (decimal 10).", "0 = 0000, A = 1010, значит 0A = 0000 1010 = 00001010 (десятичное 10)."),

  qx("A MAC address such as 00-1A-2B-3C-4D-5E is how many bits long?", "48", [
    ["32", "32 bits is an IPv4 address.", "32 бита — адрес IPv4."],
    ["64", "64 bits is half an IPv6 address, not a MAC.", "64 бита — половина адреса IPv6, а не MAC."],
    ["128", "128 bits is an IPv6 address.", "128 бит — адрес IPv6."],
  ], "A MAC address is 48 bits written as 12 hex digits: 12 x 4 = 48.", "MAC-адрес — 48 бит, записанных 12 hex-цифрами: 12 x 4 = 48."),

  qx("Which address type is written as eight hextets, such as 2001:0db8:…:0001?", "IPv6, 128 bits", [
    ["IPv4, 32 bits", "IPv4 is written as four decimal octets.", "IPv4 записывается четырьмя десятичными октетами."],
    ["MAC, 48 bits", "A MAC address is 12 hex digits with dashes, not hextets with colons.", "MAC-адрес — 12 hex-цифр через дефис, а не хекстеты через двоеточие."],
    ["Octet, 8 bits", "An octet is one 8-bit section of IPv4, not an address type.", "Октет — одна 8-битная часть IPv4, а не тип адреса."],
  ], "An IPv6 address is 128 bits written as eight hextets of four hex digits.", "Адрес IPv6 — 128 бит, записанных восемью хекстетами по четыре hex-цифры."),

  tfx("An IPv4 address has 32 bits, so it consists of eight octets of four bits each.", false,
    "An octet is 8 bits by definition; 32 bits divide into four octets, which is why the address has four dotted-decimal numbers.",
    "Октет по определению — 8 бит; 32 бита делятся на четыре октета, поэтому в адресе четыре числа через точку.",
    "Four bits is one hexadecimal digit, not an octet; eight 4-bit groups would be a hex notation, which IPv4 does not use.",
    "Четыре бита — одна шестнадцатеричная цифра, а не октет; восемь групп по 4 бита — это hex-запись, которую IPv4 не использует."),

  tfx("Binary 11111111 equals decimal 256.", false,
    "128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255; 256 would need a ninth bit.",
    "128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255; для 256 понадобился бы девятый бит.",
    "255 is the largest value an octet can hold, which is why no IPv4 octet is ever 256.",
    "255 — наибольшее значение октета, поэтому ни один октет IPv4 не бывает равен 256."),
];
