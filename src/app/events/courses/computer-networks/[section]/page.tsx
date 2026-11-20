import Link from "next/link";
import { notFound } from "next/navigation";
import book from "@/lib/events/finals/computer-networks.json";
import notes from "@/lib/events/computerNetworksEndterm/notes.json";
import sources from "@/lib/events/networkFinal/sources.json";
import bank from "@/lib/events/networkFinal/practice.json";
import sets from "@/lib/events/networkFinal/sets.json";
import styles from "../../../courses.module.css";

const sections = { practice: "Практика", lectures: "Лекции", theory: "Теория" };
const introductory = [
  ["Современные сети", "Конечные устройства создают и принимают данные. Коммутаторы соединяют устройства в локальной сети, а маршрутизаторы пересылают пакеты между сетями."],
  ["Начальная настройка устройств", "В IOS режим enable открывает привилегированные команды, configure terminal — изменение конфигурации. Сохрани рабочую конфигурацию командой copy running-config startup-config."],
  ["Протоколы и модели", "На отправителе данные приложения получают заголовки транспорта, сети и канального уровня. Получатель снимает их в обратном порядке."],
  ["Физический уровень", "Медь передаёт электрические сигналы, оптоволокно — свет, Wi-Fi — радиосигналы. Пропускная способность канала и фактическая скорость передачи могут отличаться."],
  ["Системы счисления", "Октет IPv4 состоит из восьми бит. Например, 11000000₂ = 128 + 64 = 192. В IPv6 одна шестнадцатеричная цифра кодирует четыре бита."],
  ["Канальный уровень", "Кадр доставляет пакет в пределах одного канала. При передаче через маршрутизатор канальный заголовок меняется для следующего участка пути."],
  ["Коммутация Ethernet", "Коммутатор запоминает входной порт по MAC источника. Если MAC назначения ещё неизвестен, кадр рассылается по остальным портам той же VLAN."],
];
const modules = [
  ...introductory.map(([title, body], i) => ({ id: i + 1, title, body })),
  ...Object.entries(notes).map(([id, text]) => {
    const [heading, ...body] = text.split("\n");
    return { id: Number(id), title: heading.replace(/^## \d+\. /, ""), body: body.join("\n").trim() };
  }),
  { id: 17, title: "Построение небольшой сети", body: "Определи число узлов и требуемые подсети. Назначь каждому интерфейсу адрес и маску, клиентам укажи шлюз и DNS. Проверь связь сначала со шлюзом, затем с удалённым IP и, наконец, по имени. Так можно отличить ошибку локального подключения от ошибки маршрутизации или DNS." },
];

export function generateStaticParams() {
  return Object.keys(sections).map(section => ({ section }));
}

export default async function NetworkSection({ params }: { params: Promise<{section: string}> }) {
  const { section } = await params;
  if (!Object.hasOwn(sections, section)) notFound();
  return <article className={styles.outline} lang="ru" data-no-i18n>
    <Link className={styles.back} href="/events/courses/computer-networks">← Computer Networks</Link>
    <h1>{sections[section as keyof typeof sections]}</h1>
    {section === "lectures" && book.event.lectures.map((lecture, i) => <section key={lecture.id}>
      <h2>{i + 1}. {lecture.title.ru}</h2>
      {lecture.parts.map(part => <p key={part.id}><Link href={`/events/computer-networks-final#${part.id}`}>{part.title.ru} →</Link></p>)}
      {book.sources.filter(source => source.lectureId === lecture.id).map(source => <p key={source.id}><a href={source.url}>Открыть в LMS</a> · <a download href={`/events/network-final/${source.id}.${source.title.split(".").pop()}`}>Скачать {source.title}</a></p>)}
    </section>)}
    {section === "theory" && modules.map(m => <details key={m.id}><summary>Модуль {m.id} · {m.title}</summary><div className={styles.studyText}><a href={`/events/network-final/reading-${m.id}.txt`}>Полный текст сохранённого модуля (EN)</a><p/>{m.body.replace(/^#{1,4} /gm, "").replace(/\*\*/g, "")}</div></details>)}
    {section === "practice" && <>
      <h2>Вопросы из NetAcad</h2><p>Сохранённые варианты от 7 ноября. Рисунки и интерактивные сопоставления открываются в Cisco. В последнем варианте название меню и заголовок теста расходятся.</p><ul>{sources.map(s => <li key={s.file}><a href={`/events/network-final/${s.file}.txt`}>{s.title} · {s.count} вопросов</a></li>)}</ul><h2>Самопроверка с разбором</h2><p>В архивной подборке {bank.length} вопросов по темам и {sets.length} заданий VRT. Открой вопрос, выбери ответ для себя и проверь разбор.</p>
      {modules.filter(m => bank.some(q => q.topic === m.id)).map(m => <details key={m.id}><summary>{m.title} · {bank.filter(q => q.topic === m.id).length}</summary>
        {bank.filter(q => q.topic === m.id).map(q => <section key={q.id}><h3>{q.prompt}</h3><ol>{q.options.map((o,i) => <li key={i}>{o}</li>)}</ol><details><summary>Проверить ответ</summary><strong>{q.answerText}</strong><p>{q.explanation}</p><p>{q.caution}</p><small>{q.source}</small></details></section>)}
      </details>)}
      {Array.from(new Set(sets.map(q => q.set))).map(set => <details key={set}><summary>VRT · вариант {set}</summary>
        {sets.filter(q => q.set === set).map(q => <section key={q.id}><h3>{q.number}. {q.prompt}</h3><ol>{q.options.map((o,i) => <li key={i}>{o}</li>)}</ol><details><summary>Проверить ответ</summary><strong>{q.answer}</strong><p>{q.explanation}</p><p>{q.caution}</p></details></section>)}
      </details>)}
    </>}
  </article>;
}
