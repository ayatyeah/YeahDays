import { A, Arrow, Box, G, R, S, Svg, type Draw } from "./kit";

/** Схемы лекции 9 курса Project Management: имена с префиксом «pm9-», в конспекте — «@diagram pm9-…». */

// Накопительная диаграмма потока: месяцы апр–сен, функции 0–500 (по рисунку слайда «Project XYZ — Feature Flow»).
const xs = [36, 78, 120, 162, 204, 246];
const total = [50, 50, 40, 40, 18, 18];
const inProgress = [178, 149, 117, 95, 72, 53];
const completed = [178, 165, 146, 127, 101, 76];
const line = (ys: number[]) => xs.map((x, i) => `${x},${ys[i]}`).join(" ");
const back = (ys: number[]) => xs.map((x, i) => `${x},${ys[i]}`).reverse().join(" ");

export const diagrams: Record<string, Draw> = {
  "pm9-kano": (t) => (
    <Svg h={226} label={t("Модель Кано: как функции влияют на удовлетворённость", "Kano model: how features affect customer satisfaction")}>
      <line x1={20} y1={110} x2={242} y2={110} stroke="currentColor" opacity={0.45} />
      <line x1={130} y1={14} x2={130} y2={206} stroke="currentColor" opacity={0.45} />
      <text x={134} y={22} fontSize={9} fill="currentColor" opacity={0.75}>{t("довольны", "satisfied")}</text>
      <text x={134} y={214} fontSize={9} fill="currentColor" opacity={0.75}>{t("недовольны", "dissatisfied")}</text>
      <text x={22} y={128} fontSize={8.5} fill="currentColor" opacity={0.75}>{t("функции нет", "absent")}</text>
      <text x={240} y={128} textAnchor="end" fontSize={8.5} fill="currentColor" opacity={0.75}>{t("сделана полностью", "fully done")}</text>
      <line x1={24} y1={110} x2={236} y2={110} stroke={A} strokeWidth={2} strokeDasharray="5 4" />
      <line x1={24} y1={196} x2={236} y2={24} stroke={S} strokeWidth={2.2} />
      <path d="M24 104 C150 102, 200 88, 236 18" fill="none" stroke={G} strokeWidth={2.2} />
      <path d="M24 204 C50 130, 110 116, 236 113" fill="none" stroke={R} strokeWidth={2.2} />
      {[
        [G, "Delighters", t("восторг, если есть", "delight when present"), false],
        [S, "Satisfiers", t("чем больше, тем лучше", "the more, the better"), false],
        [R, "Dissatisfiers", t("злят, если нет", "anger when absent"), false],
        [A, "Indifferent", t("всё равно", "no effect either way"), true],
      ].map(([c, name, sub, dashed], i) => (
        <g key={name as string}>
          <line x1={254} y1={36 + i * 46} x2={274} y2={36 + i * 46} stroke={c as string} strokeWidth={2.4} strokeDasharray={dashed ? "5 4" : undefined} />
          <text x={278} y={40 + i * 46} fontSize={10} fontWeight={700} fill="currentColor">{name as string}</text>
          <text x={254} y={56 + i * 46} fontSize={8.5} fill="currentColor" opacity={0.8}>{sub as string}</text>
        </g>
      ))}
    </Svg>
  ),
  "pm9-cfd": (t) => (
    <Svg h={236} label={t("Накопительная диаграмма потока: WIP и время цикла", "Cumulative flow diagram: WIP and cycle time")}>
      <polygon points={`${line(total)} ${back(inProgress)}`} fill={G} opacity={0.35} />
      <polygon points={`${line(inProgress)} ${back(completed)}`} fill={A} opacity={0.4} />
      <polygon points={`${line(completed)} 246,178 36,178`} fill={S} opacity={0.4} />
      <polyline points={line(total)} fill="none" stroke={G} strokeWidth={1.8} />
      <polyline points={line(inProgress)} fill="none" stroke={A} strokeWidth={1.5} />
      <polyline points={line(completed)} fill="none" stroke={S} strokeWidth={1.5} />
      <line x1={36} y1={178} x2={250} y2={178} stroke="currentColor" opacity={0.5} />
      <line x1={36} y1={14} x2={36} y2={178} stroke="currentColor" opacity={0.5} />
      {[[0, 178], [250, 98], [500, 18]].map(([v, y]) => (
        <text key={v} x={32} y={y + 3} textAnchor="end" fontSize={8.5} fill="currentColor" opacity={0.7}>{v}</text>
      ))}
      {[t("апр", "Apr"), t("май", "May"), t("июн", "Jun"), t("июл", "Jul"), t("авг", "Aug"), t("сен", "Sep")].map((m, i) => (
        <text key={i} x={xs[i]} y={190} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.7}>{m}</text>
      ))}
      <text x={246} y={12} textAnchor="end" fontSize={8.5} fill={G}>{t("объём вырос: 400 → 500", "scope added: 400 → 500")}</text>
      <Arrow x1={162} y1={111} x2={162} y2={95} color="currentColor" />
      <Arrow x1={162} y1={111} x2={162} y2={127} color="currentColor" />
      <text x={166} y={114} fontSize={10} fontWeight={700} fill="currentColor">B</text>
      <Arrow x1={134} y1={127} x2={107} y2={127} color="currentColor" />
      <Arrow x1={134} y1={127} x2={162} y2={127} color="currentColor" />
      <text x={130} y={123} textAnchor="middle" fontSize={10} fontWeight={700} fill="currentColor">A</text>
      {[
        [G, t("осталось", "remaining")],
        [A, t("в работе", "in progress")],
        [S, t("завершено", "completed")],
      ].map(([c, label], i) => (
        <g key={i}>
          <rect x={256} y={22 + i * 20} width={11} height={11} rx={2} fill={c} opacity={0.6} />
          <text x={272} y={31 + i * 20} fontSize={9.5} fill="currentColor">{label}</text>
        </g>
      ))}
      <text x={256} y={100} fontSize={9.5} fontWeight={700} fill="currentColor">{t("A = время цикла", "A = cycle time")}</text>
      <text x={256} y={112} fontSize={8.5} fill="currentColor" opacity={0.75}>{t("длительность очереди", "queue duration")}</text>
      <text x={256} y={134} fontSize={9.5} fontWeight={700} fill="currentColor">B = WIP</text>
      <text x={256} y={146} fontSize={8.5} fill="currentColor" opacity={0.75}>{t("длина очереди", "queue length")}</text>
      <text x={180} y={210} textAnchor="middle" fontSize={9.5} fill="currentColor">{t("время цикла = WIP / пропускная способность", "cycle time = WIP / throughput")}</text>
      <text x={180} y={226} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.75}>{t("полоса «в работе» шире → больше WIP: ищите узкое место", "wider in-progress band → more WIP: look for a bottleneck")}</text>
    </Svg>
  ),
  "pm9-tdd": (t) => (
    <Svg h={234} label={t("Цикл TDD «красный — зелёный — рефакторинг» и четыре стадии ATDD", "TDD cycle red–green–refactor and the four stages of ATDD")}>
      <Box x={8} y={26} w={116} h={46} label="1. Red" sub={t("тест сначала падает", "test fails first")} stroke={R} />
      <Box x={236} y={26} w={116} h={46} label="2. Green" sub={t("код до прохождения", "code until it passes")} stroke={G} />
      <Box x={122} y={98} w={116} h={46} label="3. Refactor" sub={t("улучшить код", "improve the design")} stroke={S} />
      <Arrow x1={126} y1={49} x2={234} y2={49} color={G} />
      <text x={180} y={42} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.8}>{t("пишем код", "add code")}</text>
      <Arrow x1={294} y1={74} x2={240} y2={112} color={S} />
      <text x={318} y={104} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.8}>{t("тесты зелёные", "tests stay green")}</text>
      <Arrow x1={120} y1={121} x2={66} y2={76} color={R} />
      <text x={64} y={112} textAnchor="end" fontSize={9} fill="currentColor" opacity={0.8}>{t("новый тест", "next test")}</text>
      <text x={180} y={168} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="currentColor">{t("ATDD — четыре стадии", "ATDD — four stages")}</text>
      {[
        ["Discuss", t("требования", "requirements")],
        ["Distill", t("тесты в формат", "format tests")],
        ["Develop", t("код + тесты", "code + tests")],
        ["Demo", t("показать", "show it")],
      ].map(([name, sub], i) => (
        <g key={name}>
          <Box x={6 + i * 90} y={176} w={78} h={38} label={name} sub={sub} stroke={A} size={11} />
          {i < 3 && <Arrow x1={84 + i * 90} y1={195} x2={96 + i * 90} y2={195} color={A} />}
        </g>
      ))}
      <text x={180} y={229} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.75}>{t("TDD — фокус на коде; ATDD — на бизнес-требовании", "TDD: focus on code; ATDD: on the business requirement")}</text>
    </Svg>
  ),
};
