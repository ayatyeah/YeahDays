// English exam vocabulary alongside the first Russian mention in each notes section.
const terms:Record<string,string>={
  'хост':'host','хосты':'hosts','конечное устройство':'end device','промежуточное устройство':'intermediary device',
  'серверы':'servers','клиенты':'clients','коммутатор':'switch','коммутаторы':'switches','точки доступа':'access points',
  'маршрутизатор':'router','маршрутизаторы':'routers','межсетевые экраны':'firewalls','среда передачи':'network media',
  'физический порт':'physical port','интерфейс':'interface','физической топологии':'physical topology','логической топологии':'logical topology',
  'отказоустойчивость':'fault tolerance','масштабируемость':'scalability','конфиденциальность':'confidentiality','целостность':'integrity','доступность':'availability',
  'коммутация пакетов':'packet switching','управление потоком':'flow control','коллизия':'collision','сегментация':'segmentation',
  'мультиплексирование':'multiplexing','инкапсуляция':'encapsulation','деинкапсуляция':'decapsulation','кадр':'frame','пакет':'packet',
  'затухание':'attenuation','полудуплекс':'half duplex','полный дуплекс':'full duplex','заголовок':'header','концевик':'trailer',
  'сетевой уровень':'network layer','канальный уровень':'data link layer','транспортный уровень':'transport layer','прикладной уровень':'application layer',
  'префикс':'prefix','маска подсети':'subnet mask','широковещательный адрес':'broadcast address','подсеть':'subnet','маска':'mask',
  'шлюз по умолчанию':'default gateway','маршрут по умолчанию':'default route','таблица маршрутизации':'routing table',
  'следующий переход':'next hop','таблица коммутации':'MAC address table','адрес назначения':'destination address',
  'адрес источника':'source address','подтверждение':'acknowledgment','размер окна':'window size','номер порта':'port number',
  'трёхстороннее рукопожатие':'three-way handshake','доменное имя':'domain name','межсетевой экран':'firewall',
  'аутентификация':'authentication','авторизация':'authorization','шифрование':'encryption','уязвимость':'vulnerability',
};
const pattern=new RegExp('(?<![\\p{L}\\p{N}-])('+Object.keys(terms).sort((a,b)=>b.length-a.length).join('|')+')(?![\\p{L}\\p{N}-])','giu');

export function withNetworkTerms(text:string){
  const seen=new Set<string>();
  let code=false;
  return text.split('\n').map(line=>{
    if(line.startsWith('## ')){seen.clear();return line;}
    if(line.startsWith('```')){code=!code;return line;}
    if(code || /^(= |@|!\[)/.test(line))return line;
    return line.split(/(`[^`]*`)/g).map(part=>part.startsWith('`')?part:part.replace(pattern,(word:string,_term:string,offset:number)=>{
      const key=word.toLowerCase();
      if(seen.has(key))return word;
      seen.add(key);
      return /^\**\s*\([A-Za-z]/.test(part.slice(offset+word.length))?word:word+' ('+terms[key]+')';
    })).join('');
  }).join('\n');
}
