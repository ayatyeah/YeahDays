import { A, Arrow, B, F, G, R, S, Svg, V, Wrap, type Draw } from "./kit";

/** Схемы лекции 10 курса Project Management: имена с префиксом «pm10-», в конспекте — «@diagram pm10-…». */
export const diagrams: Record<string, Draw> = {
  // График Кокберна со слайда «Effectiveness of different communication channels».
  "pm10-comm-channels": (t) => {
    const black: [number, number, string, number, number, "start" | "middle" | "end"][] = [
      [54, 196, t("Бумага", "Paper"), 56, 184, "middle"],
      [128, 190, t("Аудиозапись", "Audio recording"), 128, 203, "middle"],
      [222, 114, t("Видеозапись", "Video recording"), 215, 110, "end"],
    ];
    const green: [number, number, string, number, number, "start" | "middle" | "end"][] = [
      [100, 166, "E-mail", 100, 156, "middle"],
      [250, 127, t("Мессенджер", "Instant messaging"), 257, 136, "start"],
      [284, 98, t("Телефон", "Phone"), 291, 104, "start"],
      [332, 20, t("Лицом к лицу у доски", "Face-to-face at whiteboard"), 324, 23, "end"],
    ];
    return (
      <Svg h={246} label={t("Эффективность каналов коммуникации: от бумаги до разговора у доски", "Effectiveness of communication channels: from paper to face-to-face at a whiteboard")}>
        <Arrow x1={34} y1={210} x2={354} y2={210} />
        <Arrow x1={34} y1={210} x2={34} y2={8} />
        <text x={14} y={110} transform="rotate(-90 14 110)" textAnchor="middle" fontSize={10} fill="currentColor">{t("Эффективность", "Effectiveness")}</text>
        <text x={38} y={223} fontSize={9} fill="currentColor" opacity={0.75}>{t("(холодно)", "(cold)")}</text>
        <text x={352} y={223} textAnchor="end" fontSize={9} fill="currentColor" opacity={0.75}>{t("(горячо)", "(hot)")}</text>
        <text x={194} y={239} textAnchor="middle" fontSize={10} fill="currentColor">{t("Насыщенность / «температура»", "Richness / Temperature")}</text>
        <path d="M54 196 C66 195 107 194 128 190 C149 186 166 182 178 175 C190 168 193 159 200 149 C207 139 218 120 222 114" fill="none" stroke="currentColor" strokeWidth={1.5} opacity={0.8} />
        <path d="M100 166 C117 163 175 156 200 149 C225 142 236 136 250 127 C264 118 273 110 284 98 C295 86 310 65 318 52 C326 39 330 25 332 20" fill="none" stroke={G} strokeWidth={2.5} />
        {black.map(([x, y, label, lx, ly, anchor]) => (
          <g key={label}>
            <circle cx={x} cy={y} r={3.5} fill={F} stroke="currentColor" strokeWidth={1.5} />
            <text x={lx} y={ly} textAnchor={anchor} fontSize={9} fill="currentColor">{label}</text>
          </g>
        ))}
        {green.map(([x, y, label, lx, ly, anchor]) => (
          <g key={label}>
            <circle cx={x} cy={y} r={3.5} fill={G} />
            <text x={lx} y={ly} textAnchor={anchor} fontSize={9} fontWeight={600} fill="currentColor">{label}</text>
          </g>
        ))}
        <line x1={226} y1={170} x2={242} y2={170} stroke={G} strokeWidth={2.5} />
        <text x={246} y={173} fontSize={9} fill={G}>{t("есть вопросы и ответы", "Q&A capability")}</text>
        <line x1={226} y1={186} x2={242} y2={186} stroke="currentColor" strokeWidth={1.5} opacity={0.8} />
        <text x={246} y={189} fontSize={9} fill="currentColor" opacity={0.85}>{t("нет вопросов и ответов", "no Q&A capability")}</text>
      </Svg>
    );
  },
  // Три уровня активного слушания (названия — со слайда, пояснения — по Гриффитсу).
  "pm10-listening-levels": (t) => (
    <Svg h={206} label={t("Три уровня активного слушания: внутреннее, сосредоточенное, глобальное", "Three levels of active listening: internal, focused, global")}>
      <circle cx={104} cy={100} r={92} fill={F} stroke={V} strokeWidth={1.5} />
      <circle cx={104} cy={100} r={62} fill={F} stroke={S} strokeWidth={1.5} />
      <circle cx={104} cy={100} r={32} fill={F} stroke={A} strokeWidth={1.5} />
      <text x={104} y={98} textAnchor="middle" fontSize={11} fontWeight={700} fill={A}>1</text>
      <text x={104} y={111} textAnchor="middle" fontSize={9} fill="currentColor">{t("я сам", "me")}</text>
      <text x={104} y={52} textAnchor="middle" fontSize={11} fontWeight={700} fill={S}>2</text>
      <text x={104} y={150} textAnchor="middle" fontSize={9} fill="currentColor">{t("говорящий", "the speaker")}</text>
      <text x={104} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill={V}>3</text>
      <text x={104} y={176} textAnchor="middle" fontSize={9} fill="currentColor">{t("тон, тело, обстановка", "tone, body, setting")}</text>
      {[
        [t("1 Внутреннее", "1 Internal"), t("мои мысли: «что это значит для меня?»", "my own thoughts: “what does it mean for me?”"), A, 18],
        [t("2 Сосредоточенное", "2 Focused"), t("на месте говорящего: эмоции за словами", "in the speaker's shoes: feelings behind the words"), S, 76],
        [t("3 Глобальное", "3 Global"), t("+ язык тела, тон, жесты, энергия", "+ body language, tone, gestures, energy"), V, 134],
      ].map(([title, sub, c, y]) => (
        <g key={title as string}>
          <rect x={206} y={y as number} width={150} height={52} rx={8} fill={F} stroke={c as string} strokeWidth={1.5} />
          <text x={281} y={(y as number) + 15} textAnchor="middle" fontSize={10} fontWeight={700} fill={c as string}>{title}</text>
          <Wrap x={281} y={(y as number) + 28} text={sub as string} max={28} size={8.5} gap={10} />
        </g>
      ))}
    </Svg>
  ),
  // Лестница пяти уровней конфликта (Speed Leas): признаки и реакции — из учебника Гриффитса.
  "pm10-conflict-levels": (t) => (
    <Svg h={222} label={t("Пять уровней конфликта по Спиду Лису: от задачи до мировой войны", "Speed Leas' five levels of conflict: from a problem to solve to world war")}>
      <Arrow x1={12} y1={12} x2={350} y2={12} color={R} />
      <text x={14} y={26} fontSize={9} fill={R}>{t("эскалация", "escalation")}</text>
      {[
        ["Problem to Solve", t("обмен фактами", "share facts"), t("→ консенсус", "→ consensus"), G],
        ["Disagreement", t("защищаю себя", "protect myself"), t("→ поддержка", "→ support"), S],
        ["Contest", t("цель — победить", "aim: to win"), t("→ переговоры", "→ negotiate"), A],
        ["Crusade", t("защищаю свою группу", "protect my group"), t("→ дипломатия", "→ diplomacy"), V],
        ["World War", t("уничтожить другого", "destroy the other"), t("→ развести", "→ separate"), R],
      ].map(([name, sign, reply, c], i) => {
        const h = 44 + i * 20;
        const x = 8 + i * 70;
        return (
          <g key={name}>
            <rect x={x} y={150 - h} width={64} height={h} rx={6} fill={F} stroke={c} strokeWidth={1.5} />
            <text x={x + 32} y={150 - h + 14} textAnchor="middle" fontSize={11} fontWeight={700} fill={c}>{i + 1}</text>
            <Wrap x={x + 32} y={150 - h + 26} text={name} max={10} size={8.5} gap={10} opacity={1} />
            <Wrap x={x + 32} y={164} text={sign} max={11} size={8.5} gap={10} />
            <text x={x + 32} y={194} textAnchor="middle" fontSize={8.5} fontWeight={600} fill={c}>{reply}</text>
          </g>
        );
      })}
      <line x1={4} y1={150} x2={356} y2={150} stroke={B} />
      <text x={180} y={216} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.75}>{t("чем выше ступень, тем труднее вернуться к фактам", "the higher the step, the harder to get back to facts")}</text>
    </Svg>
  ),
};
