import Link from "next/link";
import { notFound } from "next/navigation";
import book from "@/lib/events/finals/computer-networks.json";
import notes from "@/lib/events/computerNetworksEndterm/notes.json";
import { labs } from "@/lib/events/networkFinal/labs";
import { groups } from '@/lib/events/networkFinal/quizzes';
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
    {section === "lectures" && <p>В LMS на 20 ноября опубликованы лекции 1–10. На странице Final Test вопросы пока не добавлены. <a href="https://lms.astanait.edu.kz/mod/quiz/view.php?id=75585">Проверить Final Test в LMS</a></p>}
    {section === "lectures" && book.event.lectures.map((lecture, i) => <section key={lecture.id}>
      <h2>{i + 1}. {lecture.title.ru}</h2>
      {lecture.parts.map(part => <p key={part.id}><Link href={`/events/computer-networks-final#${part.id}`}>{part.title.ru} →</Link></p>)}
      {book.sources.filter(source => source.lectureId === lecture.id).map(source => <p key={source.id}><a href={source.url}>Открыть в LMS</a> · <a download href={`/events/network-final/${source.id}.${source.title.split(".").pop()}`}>Скачать {source.title}</a></p>)}
    </section>)}
    {section === "theory" && modules.map(m => <details key={m.id}><summary>Модуль {m.id} · {m.title}</summary><div className={styles.studyText}><a href={`/events/network-final/reading-${m.id}.txt`}>Полный текст сохранённого модуля (EN)</a><p/>{m.body.replace(/^#{1,4} /gm, "").replace(/\*\*/g, "")}</div></details>)}
    {section === "practice" && <>
      <section id="labs">
        <h2>Разбор сданных лабораторных</h2>
        {labs.map(lab => <details key={lab.week}>
          <summary>Неделя {lab.week} · {lab.activity}</summary>
          <h3>{lab.task}</h3>
          <details><summary>Показать разбор</summary><p>{lab.answer}</p></details>
        </details>)}
      </section>
      {[
        {title:"Вопросы из NetAcad", items:groups.filter(g=>g.id.startsWith("module-") || g.id.startsWith("test-"))},
        {title:"Самопроверка с разбором", items:groups.filter(g=>g.id.startsWith("topic-") || g.id.startsWith("vrt-"))},
      ].map(category=><section key={category.title}><h2>{category.title}</h2><ul>{category.items.map(g=><li key={g.id}><Link prefetch={false} href={`/events/courses/computer-networks/practice/${g.id}`}>{g.title} · {g.count} вопросов →</Link></li>)}</ul></section>)}
    </>}
  </article>;
}
