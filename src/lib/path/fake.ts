/**
 * Детерминированная замена ИИ для сквозных тестов на локальной машине.
 *
 * Включается только при PATH_AI_FAKE=1 И адресе сайта на localhost: даже
 * если переменная случайно окажется на сервере, прод её проигнорирует.
 * Верный вариант в тестовых вопросах начинается со слова «Верно» — так
 * сценарий теста может отвечать правильно или ошибаться нарочно.
 */

export function fakeEnabled() {
  if (process.env.PATH_AI_FAKE !== "1") return false;
  try {
    return ["localhost", "127.0.0.1"].includes(new URL(process.env.AUTH_URL ?? "").hostname);
  } catch {
    return false;
  }
}

const mcq = (skill: string, n: number, level: string) => {
  const answer = n % 4;
  const options = [0, 1, 2, 3].map((i) => (i === answer ? `Верно: утверждение ${n} про навык ${skill}` : `Неверно: вариант ${i + 1} к вопросу ${n} (${skill})`));
  return {
    skill,
    stem: `Вопрос ${n} по навыку ${skill}: какое утверждение правильное?`,
    options,
    answer,
    explanation: `Объяснение к вопросу ${n}: так устроен навык ${skill}.`,
    wrongWhy: options.filter((_, i) => i !== answer).map((_, i) => `Этот вариант ${i + 1} не подходит к вопросу ${n}.`),
    hints: [`Подумай о том, как устроен навык ${skill}.`],
    level,
  };
};

const sentence = "Короткое предложение о сути темы для этого видео.";

export function fakeAi(schema: string, input: object): unknown {
  const data = input as Record<string, any>;
  if (schema === "map") {
    const keys = ["s1", "s2", "s3", "s4", "s5"];
    const names = ["Основы", "Ключевые понятия", "Применение", "Типичные ошибки", "Итоговая практика"];
    const material = String(data.material ?? "");
    const quotes = material.split(/(?<=[.!?])\s+/).map((q) => q.trim()).filter((q) => q.length >= 20);
    return {
      title: `Траектория: ${String(data.goal).slice(0, 80)}`,
      skills: keys.map((key, i) => ({ key, name: `${names[i]}`, description: `Навык «${names[i]}» для цели.`, prerequisites: i ? [keys[i - 1]] : [] })),
      units: keys.map((key, i) => ({ title: `Юнит ${i + 1}: ${names[i]}`, objective: `Разобраться: ${names[i].toLowerCase()}`, skills: [key], minutes: 3 + (i % 2), weight: 0.5 + i / 10, sourceQuote: quotes.length ? quotes[i % quotes.length].slice(0, 200) : "" })),
      placement: keys.map((key, i) => mcq(key, 100 + i, "medium")),
    };
  }
  if (schema === "unit") {
    const skill = data.skills?.[0]?.key ?? "s1";
    const para = (i: number) => `Абзац ${i + 1} юнита «${data.unit?.title}». ${"Здесь объясняется важная мысль простыми словами и с примером из жизни. ".repeat(4).trim()}`;
    const levels = ["easy", "easy", "medium", "medium", "hard", "hard"];
    return {
      body: [0, 1, 2].map(para).join("\n\n"),
      questions: levels.map((lv, i) => mcq(skill, i + 1, lv)),
      open: { skill, stem: "Объясни своими словами главную мысль юнита и приведи пример.", rubric: "Засчитывается, если ответ объясняет главную мысль и содержит пример длиной хотя бы в одно предложение.", hints: ["Начни с определения, потом пример."], level: "hard" },
    };
  }
  if (schema === "grade") {
    const answer = String(data.studentAnswer ?? "");
    return answer.length >= 40 ? { score: 92, strength: "Мысль изложена ясно.", improvement: "Добавь ещё один пример." } : { score: 35, strength: "Есть попытка ответа.", improvement: "Раскрой мысль подробнее и приведи пример." };
  }
  if (schema === "script") {
    const count = Math.max(1, data.paragraphs?.length ?? 1);
    const kinds = ["title", "points", "term", "example", "recap"];
    return {
      title: String(data.title ?? "Видео"),
      scenes: kinds.map((kind, i) => ({ kind, heading: `Сцена ${i + 1}`, bullets: i ? [`Пункт ${i}`] : [], sentences: [0, 1, 2, 3].map((j) => ({ text: sentence, ref: (i + j) % count })) })),
    };
  }
  if (schema === "verify") {
    const flagged = (data.sentences ?? []).some((x: { source: string }) => /needs-review/i.test(x.source));
    return { issues: flagged ? [{ sentence: 0, problem: "Факта нет в источнике" }] : [] };
  }
  throw new Error(`fake: неизвестная схема ${schema}`);
}

/** Тихий WAV нужной длины (8 кГц, 16 бит, моно) — вместо голоса в тестах. */
export function fakeSpeech(text: string) {
  const seconds = Math.max(1, Math.round((text.split(/\s+/).length * 0.25) * 10) / 10);
  const rate = 8000;
  const samples = Math.round(seconds * rate);
  const data = Buffer.alloc(44 + samples * 2);
  data.write("RIFF", 0);
  data.writeUInt32LE(36 + samples * 2, 4);
  data.write("WAVEfmt ", 8);
  data.writeUInt32LE(16, 16);
  data.writeUInt16LE(1, 20);
  data.writeUInt16LE(1, 22);
  data.writeUInt32LE(rate, 24);
  data.writeUInt32LE(rate * 2, 28);
  data.writeUInt16LE(2, 32);
  data.writeUInt16LE(16, 34);
  data.write("data", 36);
  data.writeUInt32LE(samples * 2, 40);
  return { data, mime: "audio/wav", seconds };
}
