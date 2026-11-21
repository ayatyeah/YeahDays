import sets from './sets.json';
import {archiveBank} from './grind';
import type {EventQuizQuestion} from '@/components/events/EventQuiz';

// Some printed choices paraphrase the stored answer. Only mark unambiguous choices.
const keys:Record<string,number[]>={
  'vrt-1-02':[1],'vrt-1-06':[2],'vrt-1-09':[0],'vrt-1-11':[2],'vrt-1-14':[2],'vrt-1-18':[1,4],'vrt-1-22':[0],
  'vrt-2-02':[1,4],'vrt-2-07':[1,2,4],'vrt-2-12':[2],'vrt-2-13':[1],'vrt-2-16':[1],'vrt-2-17':[3],'vrt-2-19':[3],
  'vrt-3-03':[3],'vrt-3-04':[3],'vrt-3-08':[3],'vrt-3-10':[0],'vrt-3-16':[2],'vrt-3-18':[1,3,4],'vrt-3-24':[0],
  'vrt-4-05':[3],'vrt-4-07':[0],'vrt-4-16':[1],'vrt-4-17':[0],'vrt-4-20':[1,3,4],'vrt-4-14':[1,4],
};
const normalize=(s:string)=>s.trim().toLowerCase().replace(/[.!]+$/,'');
const lectureFor:Record<number,number>={8:5,9:5,10:5,11:6,12:7,13:7,14:8,15:9,16:10};

export const endtermPaper:EventQuizQuestion[]=sets.map(q=>{
  // Preserve the printed alternatives. State assumptions explicitly when they affect grading.
  const item={q:q.prompt,options:q.options,caution:q.caution};
  let clarified:number[]|undefined;
  if(['vrt-1-19','vrt-3-14'].includes(q.id)){
    item.q+=' Assume the first data byte is numbered 1 and each segment carries 1500 payload bytes.';
    item.caution='Для расчёта явно заданы номер первого байта и размер полезных данных.';
    clarified=[0];
  }else if(q.id==='vrt-2-01'){
    item.q='An IPv4 ping receives ICMP Destination Unreachable (type 3), code 1. What does the code mean?';
    item.caution='Для однозначного ответа указан тип сообщения ICMPv4.';
    clarified=[0];
  }else if(q.id==='vrt-2-20'){
    item.q+=' Count subnet zero as the first subnet.';
    item.caution='В этой задаче нулевая подсеть считается первой.';
    clarified=[0];
  }else if(q.id==='vrt-4-22'){
    item.q+=' Select both correct descriptions.';
    item.caution='Две причины одновременно верны. В тренировке выбери обе.';
    clarified=[0,1];
  }else if(q.id==='vrt-3-25'||q.id==='vrt-4-12'){
    item.q='Which two statements accurately describe UDP? (Choose two.)';
    item.caution='В наборе вариантов два безусловно верных утверждения. Число ответов уточнено.';
    clarified=[0,3];
  }
  const matched=q.answer.split(';').map(a=>q.options.findIndex(o=>normalize(o)===normalize(a)));
  const correct=clarified??keys[q.id]??(!q.caution && matched.every(i=>i>=0)?matched:[]);
  return {id:q.id,...item,correct,why:{ru:q.explanation,en:q.explanationEn},
    source:{kind:'paper',module:q.topic,lecture:lectureFor[q.topic]??0,variant:q.set}};
});

// Lecture exercises revisit the same decisions with changed conditions and numbers.
const exercises:[number,number,string,string[],number,string,string][]=[
  [5,10,'A local console works but remote administration must encrypt the entire session. Which service fits?',['Telnet','SSH','TFTP','HTTP'],1,'SSH шифрует и команды, и учётные данные. Локальная консоль не решает задачу удалённого входа.',"SSH encrypts commands and credentials across the network. A local console provides no remote session."],
  [5,8,'Local devices are reachable but hosts outside the subnet are not. Which host setting should you check first?',['Default gateway','Source TCP port','EtherType','FTP mode'],0,'Для передачи за пределы своей подсети хост отправляет кадр шлюзу. Локальная доставка может работать и при неверном шлюзе.',"A host sends traffic for remote subnets to its default gateway. Local traffic can still work with an incorrect gateway."],
  [6,11,'An ordinary /27 LAN needs an address for every usable host. How many can it accommodate?',['32','62','30','14'],2,'Остаётся 5 бит. Из 32 адресов два заняты адресом сети и broadcast: 30 для узлов.',"A /27 leaves five host bits. Subtract the network and broadcast addresses from 32 to get 30 usable addresses."],
  [6,11,'Which subnet contains 192.168.8.130/26?',['192.168.8.0/26','192.168.8.64/26','192.168.8.192/26','192.168.8.128/26'],3,'Шаг /26 равен 64. Число 130 лежит в диапазоне 128–191, адрес сети заканчивается на 128.',"A /26 has blocks of 64. Address .130 is in the range .128\u2013.191, so .128 is the network address."],
  [7,12,'A host builds its own IPv6 address after a Router Advertisement. Which mechanism is it using?',['Stateful DHCPv6','SLAAC','ARP','NAT'],1,'При SLAAC узел использует префикс из RA и собственный interface ID. Адрес с сервера не арендуется.',"SLAAC combines the advertised prefix with an interface identifier. No DHCPv6 address lease is required."],
  [7,13,'Which field does an IPv6 router decrement before forwarding a packet?',['Hop Limit','Window','Sequence number','EtherType'],0,'Hop Limit уменьшается на каждом роутере. При исчерпании лимита пакет отбрасывается, что позволяет traceroute обнаружить переход.',"Each forwarding router reduces Hop Limit. A packet whose limit expires is discarded."],
  [8,14,'With a 2400-byte receive window and 600 bytes of TCP payload per segment, how many segments fit before any ACK?',['2','3','4','6'],2,'Окно ограничивает количество неподтверждённых байтов. 2400 / 600 = 4, если другие ограничения не мешают передаче.',"The receive window permits 2,400 outstanding bytes. At 600 bytes per segment, four segments fit."],
  [8,14,'A receiver has obtained bytes 101 through 300 in order. Which TCP ACK number should it send?',['100','200','300','301'],3,'ACK называет следующий ожидаемый байт: после 300 это 301.',"A cumulative ACK gives the next expected byte. After byte 300 the receiver expects byte 301."],
  [9,15,'A browser reaches a server by IPv4 address but cannot resolve its name. Which tool tests the failing step directly?',['netstat','nslookup','arp -a','tracert -6'],1,'nslookup запрашивает DNS. Достижимость по IP уже отдельно проверена.',"Use nslookup to query DNS. Reaching the server by address already confirms IP connectivity."],
  [9,15,'Which DNS record helps SMTP find the service accepting mail for a domain?',['MX','AAAA','PTR','CNAME only'],0,'MX указывает почтовый узел домена. SMTP переносит письмо, DNS помогает найти его получателя.',"The MX record identifies the mail exchanger for the domain. SMTP uses that destination to relay mail."],
  [10,16,'A service checks what an already authenticated user may change. Which AAA function is this?',['Authentication','Accounting','Authorization','Availability'],2,'Личность уже подтверждена. Проверка разрешённых действий — authorization; запись выполненных действий — accounting.',"Authorization checks permissions after identity has been established. Accounting records what the user did."],
  [10,16,'Which measure addresses the underlying software weakness used by a worm?',['Changing the host name','Updating the login banner','Disabling DNS','Installing the relevant vendor patch'],3,'Исправление поставщика закрывает конкретную уязвимость. Изменение имени и баннера оставляет уязвимый код на месте.',"Applying the vendor patch removes the software weakness. Changing a host name or banner leaves the vulnerable code in place."],
];
const lectureQuestions=exercises.map(([lecture,module,q,options,index,why,en],i)=>({id:'end-lecture-'+(i+1),q,options,correct:[index],why:{ru:why,en},source:{kind:'lecture',lecture,module}}));
export const endtermRelated:EventQuizQuestion[]=[...archiveBank.flatMap(q=>{
  if(!q.id.startsWith('module-') || !q.correct.length || !q.lesson || q.lesson.module<8)return [];
  return [{...q,source:{kind:'module',module:q.lesson.module,lecture:q.lesson.lecture}}];
}),...lectureQuestions];
