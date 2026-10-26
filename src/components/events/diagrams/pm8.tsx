import { A, Arrow, Box, F, G, R, S, Svg, V, Wrap, type Draw } from "./kit";

/** Ячейка шаблона персоны: полоса-заголовок и содержимое (строки разделены «|»). */
function Cell({ x, y, w, h, head, body, c }: { x: number; y: number; w: number; h: number; head: string; body?: string; c: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={F} stroke={c} strokeWidth={1.2} />
      <rect x={x} y={y} width={w} height={16} fill={c} fillOpacity={0.2} stroke={c} strokeWidth={1.2} />
      <text x={x + 6} y={y + 12} fontSize={head.length > 13 && w < 100 ? 8.5 : 9.5} fontWeight={700} fill="currentColor">{head}</text>
      {body?.split("|").map((line, i) => <text key={i} x={x + 6} y={y + 30 + i * 11} fontSize={9} fill="currentColor" opacity={0.8}>{line}</text>)}
    </g>
  );
}

/** Значок «Picture» из шаблонов персоны. */
function Face({ x, y, c }: { x: number; y: number; c: string }) {
  return (
    <g fill={c} opacity={0.85}>
      <circle cx={x} cy={y - 7} r={6} />
      <path d={`M${x - 11} ${y + 11}a11 10 0 0 1 22 0z`} />
    </g>
  );
}

/** Схемы лекции 8 курса Project Management: имена с префиксом «pm8-», в конспекте — «@diagram pm8-…». */
export const diagrams: Record<string, Draw> = {
  "pm8-persona-templates": (t) => (
    <Svg h={292} label={t("Короткий и длинный шаблоны персоны (Figure 1 и Figure 2)", "Short and long persona templates (Figure 1 and Figure 2)")}>
      <text x={6} y={14} fontSize={10.5} fontWeight={700} fill={S}>{t("Figure 1 — короткий шаблон: обзор на 1 странице", "Figure 1 — Short Persona Template: one-page view")}</text>
      <Cell x={6} y={22} w={174} h={56} head={t("Name (имя)", "Name")} c={S} />
      <Face x={40} y={56} c={S} />
      <text x={62} y={60} fontSize={9} fill="currentColor" opacity={0.8}>{t("картинка", "picture")}</text>
      <Cell x={180} y={22} w={174} h={56} head={t("Details or Context", "Details or Context")} body={t("задачи и обязанности|технологии", "tasks and responsibilities|technology")} c={S} />
      <Cell x={6} y={78} w={174} h={56} head={t("Traits and characteristics", "Traits and characteristics")} body={t("возраст · занятие|место", "age · occupation|location")} c={S} />
      <Cell x={180} y={78} w={174} h={56} head={t("Goals (цели)", "Goals")} body="Goal 1 · Goal 2 · Goal 3" c={S} />
      <text x={6} y={156} fontSize={10.5} fontWeight={700} fill={V}>{t("Figure 2 — длинный шаблон: больше подробностей", "Figure 2 — Long Persona Template: in-depth")}</text>
      <rect x={6} y={164} width={56} height={44} fill={F} stroke={V} strokeWidth={1.2} />
      <Face x={34} y={190} c={V} />
      <Cell x={62} y={164} w={136} h={44} head={t("Name, Demographics", "Name, Demographics")} body={t("имя, демография", "who they are")} c={V} />
      <Cell x={198} y={164} w={156} h={44} head={t("Buying motive", "Buying motive")} body={t("почему выбирают решение", "why they choose the solution")} c={V} />
      {[
        ["Traits", t("какой он", "what they|are like")],
        ["Needs", t("конечны", "finite")],
        ["Motivation", t("как и почему", "how and why")],
        ["Differentiators", t("vs другие|персоны", "vs other|personas")],
      ].map(([head, body], i) => (
        <Cell key={head} x={6 + i * 87} y={208} w={87} h={52} head={head} body={body} c={V} />
      ))}
      <text x={180} y={280} textAnchor="middle" fontSize={9.5} fill={A}>{t("дополнительное исследование пользователей: короткий → длинный", "additional user research expands short → long")}</text>
    </Svg>
  ),
  "pm8-invest": (t) => {
    const items: [string, string, string, string][] = [
      ["I", "Independent", t("поставляется независимо от других функций", "delivered independent of other features"), S],
      ["N", "Negotiable", t("команда может договориться, как поставить", "the team can negotiate how to deliver"), S],
      ["V", "Valuable", t("выражает ценность для клиента", "expresses the value to the customer"), G],
      ["E", "Estimable", t("трудозатраты оцениваются по прошлому опыту", "effort estimated from past experience"), G],
      ["S", "Sized Appropriately", t("успеть за одну итерацию; чем меньше, тем лучше", "done in one iteration; the smaller the better"), R],
      ["T", "Testable", t("стейкхолдер может объективно проверить", "validated objectively by a stakeholder"), A],
    ];
    return (
      <Svg h={214} label={t("Критерии INVEST для качественных user stories", "INVEST criteria for quality user stories")}>
        {items.map(([letter, name, sub, c], i) => {
          const x = 6 + (i % 3) * 118;
          const y = 6 + Math.floor(i / 3) * 92;
          return (
            <g key={letter}>
              <rect x={x} y={y} width={112} height={86} rx={8} fill={F} stroke={c} strokeWidth={1.5} />
              <circle cx={x + 18} cy={y + 18} r={12} fill={c} fillOpacity={0.25} stroke={c} />
              <text x={x + 18} y={y + 23} textAnchor="middle" fontSize={14} fontWeight={800} fill="currentColor">{letter}</text>
              {name.split(" ").map((word, k, all) => (
                <text key={k} x={x + 36} y={y + (all.length > 1 ? 16 : 22) + k * 11} fontSize={10} fontWeight={700} fill="currentColor">{word}</text>
              ))}
              <Wrap x={x + 56} y={y + 46} text={sub} max={21} size={8.5} gap={11} />
            </g>
          );
        })}
        <text x={180} y={204} textAnchor="middle" fontSize={9.5} fill={R}>{t("на слайде S = Sized Appropriately, а не «Small»", "on the slide S = Sized Appropriately, not “Small”")}</text>
      </Svg>
    );
  },
  "pm8-three-cs": (t) => (
    <Svg h={214} label={t("Три C пользовательской истории: Card, Conversation, Confirmation", "The 3Cs of a user story: Card, Conversation, Confirmation")}>
      <Box x={4} y={8} w={104} h={36} label="Card" sub={t("карточка", "the written story")} stroke={S} size={11} />
      <Box x={128} y={8} w={104} h={36} label="Conversation" sub={t("разговор", "talk it through")} stroke={G} size={11} />
      <Box x={252} y={8} w={104} h={36} label="Confirmation" sub={t("подтверждение", "check it is met")} stroke={V} size={11} />
      <Arrow x1={108} y1={26} x2={126} y2={26} />
      <Arrow x1={232} y1={26} x2={250} y2={26} />
      <Wrap x={56} y={62} text={t("необязательный заголовок: цель с активным глаголом", "title (optional): active-verb goal phrase")} max={20} size={8.5} />
      <text x={56} y={98} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.8}>{t("формат:", "format:")}</text>
      <text x={56} y={110} textAnchor="middle" fontSize={8.5} fontWeight={600} fill="currentColor">WHO · WHAT · WHY</text>
      <Wrap x={180} y={62} text={t("история намеренно неполная", "story is intentionally incomplete")} max={20} size={8.5} />
      <Wrap x={180} y={96} text={t("хорошая история вызывает разговор в команде", "a well-written story invokes conversation")} max={20} size={8.5} />
      <Wrap x={304} y={62} text={t("acceptance criteria: границы истории", "acceptance criteria: boundaries of the story")} max={20} size={8.5} />
      <Wrap x={304} y={96} text={t("минимум функций; основа для тестов", "minimum function; basis for tests")} max={20} size={8.5} />
      <line x1={4} y1={128} x2={356} y2={128} stroke="currentColor" opacity={0.25} />
      <text x={180} y={146} textAnchor="middle" fontSize={9.5} fontWeight={600} fill="currentColor">{"As a <role>, I need to <feature> so that <goal or value>."}</text>
      <Box x={4} y={158} w={112} h={44} label="WHO" sub={t("роль или персона", "role or persona")} stroke={S} size={11} />
      <Box x={124} y={158} w={112} h={44} label="WHAT" sub={t("действие / функция", "action or feature")} stroke={G} size={11} />
      <Box x={244} y={158} w={112} h={44} label="WHY" sub={t("польза / ценность", "benefit or value")} stroke={A} size={11} />
    </Svg>
  ),
};
