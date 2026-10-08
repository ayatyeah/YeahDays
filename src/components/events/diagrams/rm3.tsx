import { A, Arrow, B, Box, Device, F, G, R, S, Svg, V, Wrap, type Draw } from "./kit";

/** Схемы лекции «rm3»: имена с префиксом «rm3-», в конспекте — «@diagram rm3-…». */
export const diagrams: Record<string, Draw> = {
  /** Этическая карточка: риск → мера защиты → подтверждение, на двух рисках кейса SafeDrive. */
  "rm3-evidence-chain": (t) => (
    <Svg h={176} label={t("Риск → мера защиты → подтверждение", "Risk → safeguard → evidence")}>
      <Box x={4} y={6} w={100} h={30} label={t("Риск", "Risk")} stroke={R} size={11} />
      <Box x={130} y={6} w={100} h={30} label={t("Мера защиты", "Safeguard")} stroke={G} size={11} />
      <Box x={256} y={6} w={100} h={30} label={t("Подтверждение", "Evidence")} stroke={S} size={11} />
      <Arrow x1={104} y1={21} x2={130} y2={21} />
      <Arrow x1={230} y1={21} x2={256} y2={21} />
      <text x={180} y={54} textAnchor="middle" fontSize={9} fontWeight={600} fill={A}>{t("SafeDrive · видео и геолокация", "SafeDrive · video and location")}</text>
      <Wrap x={54} y={70} text={t("видео и геолокация пишутся по умолчанию", "video and location recorded by default")} max={18} />
      <Wrap x={180} y={70} text={t("запись только по согласию; хранить лишь число сигналов", "opt-in recording; keep only alert counts")} max={20} />
      <Wrap x={306} y={70} text={t("журнал аудита настроек", "settings audit log")} max={18} />
      <Arrow x1={104} y1={76} x2={122} y2={76} color={B} />
      <Arrow x1={238} y1={76} x2={256} y2={76} color={B} />
      <line x1={10} y1={104} x2={350} y2={104} stroke={B} strokeDasharray="4 3" />
      <text x={180} y={118} textAnchor="middle" fontSize={9} fontWeight={600} fill={A}>{t("SafeDrive · согласие", "SafeDrive · consent")}</text>
      <Wrap x={54} y={133} text={t("водители не знают, что идёт запись", "drivers unaware of the recording")} max={18} />
      <Wrap x={180} y={133} text={t("информационный лист + форма согласия", "information sheet + consent form")} max={20} />
      <Wrap x={306} y={133} text={t("подписанные формы согласия", "signed consent records")} max={18} />
      <Arrow x1={104} y1={139} x2={122} y2={139} color={B} />
      <Arrow x1={238} y1={139} x2={256} y2={139} color={B} />
      <text x={180} y={170} textAnchor="middle" fontSize={9} fill={S}>{t("Подтверждение — запись, которую можно проверить, а не обещание", "Evidence = a record someone else can inspect, not a promise")}</text>
    </Svg>
  ),

  /** Лестница проверки источника: снизу вверх READ → OPEN, наверху — два исхода. */
  "rm3-verify-ladder": (t) => (
    <Svg h={214} label={t("Лестница проверки источника", "The source verification ladder")}>
      <Box x={22} y={6} w={160} h={36} label={t("ПРОВЕРЕН", "VERIFIED")} sub={t("запись + метаданные + дата", "record + metadata + date")} stroke={G} size={11} />
      <Box x={190} y={6} w={166} h={36} label={t("НЕ ПОДТВЕРЖДЁН", "UNRESOLVED")} sub={t("не опора для выводов", "do not cite as evidence")} stroke={R} size={11} />
      {[
        ["5 OPEN", t("метод и результат подтверждают вывод", "method and result support the claim"), V],
        ["4 CHECK", t("исправления, отзыв статьи, версия", "corrections, retraction, version"), A],
        ["3 RESOLVE", t("DOI / Crossref: метаданные совпадают", "DOI / Crossref: metadata match"), S],
        ["2 MATCH", t("запись издателя или репозитория", "publisher or repository record"), S],
        ["1 READ", t("название и аннотация по теме", "title and abstract fit the topic"), B],
      ].map(([step, text, color], i) => (
        <g key={step}>
          <Box x={22 + (4 - i) * 6} y={56 + i * 30} w={80} h={24} label={step} stroke={color} size={10} />
          <text x={116 + (4 - i) * 6} y={72 + i * 30} fontSize={9.5} fill="currentColor">{text}</text>
        </g>
      ))}
      <Arrow x1={10} y1={196} x2={10} y2={50} color={G} />
      <text x={180} y={208} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.75}>{t("каждая ступень — отметка в журнале проверки", "every step leaves a line in the verification log")}</text>
    </Svg>
  ),

  /** Mendeley: импорт → проверка → организация → чтение → цитирование в Word. */
  "rm3-mendeley-flow": (t) => (
    <Svg h={172} label={t("Работа с источниками в Mendeley", "The Mendeley workflow")}>
      {[
        ["IMPORT", t("PDF, Web Importer, вручную по DOI", "PDF, Web Importer, manual by DOI"), S],
        ["VERIFY", t("название, авторы, год, издание, DOI", "title, authors, year, venue, DOI"), A],
        ["ORGANISE", t("коллекция, теги, заметки", "collection, tags, notes"), V],
        ["READ", t("выделения и аннотации", "highlights and annotations"), V],
        ["CITE", t("Mendeley Cite в Word", "Mendeley Cite in Word"), G],
      ].map(([step, text, color], i) => (
        <g key={step}>
          <Box x={4 + i * 73} y={8} w={60} h={30} label={step} stroke={color} size={10} />
          <Wrap x={34 + i * 73} y={52} text={text} max={13} size={8.5} gap={10} />
          {i < 4 && <Arrow x1={64 + i * 73} y1={23} x2={77 + i * 73} y2={23} />}
        </g>
      ))}
      <rect x={6} y={96} width={348} height={30} rx={8} fill={F} stroke={R} strokeDasharray="4 3" />
      <text x={180} y={115} textAnchor="middle" fontSize={10} fontWeight={600} fill={R}>{t("Менеджер ссылок ≠ проверка источника", "Reference manager ≠ source verifier")}</text>
      <Device x={36} y={150} kind="pc" label="" />
      <text x={64} y={146} fontSize={9.5} fill="currentColor">{t("Word: ссылка → стиль (APA, IEEE…) → список литературы", "Word: citation → style (APA, IEEE…) → bibliography")}</text>
      <text x={64} y={160} fontSize={9.5} fill={G} fontWeight={600}>{t("→ проверить каждую запись", "→ inspect every entry")}</text>
    </Svg>
  ),
};
