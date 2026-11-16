export const ESSAY_CONSENT = 'philosophy-feedback-gemini-v1';
export type PracticeMode = 'plan' | 'paragraph' | 'essay';
export const countWords = (text: string) => (text.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu) || []).length;
export const RUBRIC = [
  { id: 'problem', en: 'Philosophical problem', ru: 'Философская проблема', max: 10 },
  { id: 'analysis', en: 'Three perspectives', ru: 'Три перспективы анализа', max: 45 },
  { id: 'concepts', en: 'Concepts & arguments', ru: 'Понятия и аргументы', max: 20 },
  { id: 'position', en: 'Your position', ru: 'Твоя позиция', max: 15 },
  { id: 'clarity', en: 'Structure & clarity', ru: 'Структура и ясность', max: 10 },
] as const;
// Adapted practice scenarios from the teacher's case-study.pdf, not final exam questions.
export const CASES = [
  { id: 'digital-twin', title: { en: 'A digital twin that watches you', ru: 'Цифровой двойник наблюдает за тобой' }, source: 'Seminar 1 · Case 2', text: { en: 'A fictional “Digital Twin Psychologist” app continuously analyses camera and microphone data to infer emotions and offer advice. Its supporters claim it could protect mental health. Critics worry about mistaken interpretations, loss of privacy and commercial use of intimate data. Should the app be introduced, and under which conditions?', ru: 'Учебный кейс: приложение «Цифровой двойник-психолог» постоянно анализирует камеру и микрофон, определяет эмоции и даёт советы. Сторонники считают, что оно поможет заботиться о психическом здоровье. Критики опасаются ошибочных выводов, потери приватности и продажи личных данных. Стоит ли внедрять такое приложение и при каких условиях?' } },
  { id: 'ai-benefits', title: { en: 'Efficient, but fair?', ru: 'Эффективно — значит справедливо?' }, source: 'Seminar 1 · Case 1', text: { en: 'In a fictional scenario, an AI allocates salaries and benefits to meet basic needs. Its efficiency objective removes extra support for sick children because the model assigns them no economic productivity. The calculations meet the chosen objective. Does this make the decision justified, and who should define the objective?', ru: 'Учебный кейс: ИИ распределяет зарплаты и пособия ради удовлетворения базовых потребностей. Ради эффективности он убирает дополнительную помощь больным детям, которым модель не приписывает экономической продуктивности. Расчёт соответствует заданной цели. Оправдано ли решение и кто должен выбирать цель?' } },
  { id: 'code-responsibility', title: { en: 'Who is responsible for the code?', ru: 'Кто отвечает за опубликованный код?' }, source: 'Seminar 1 · Case 3', text: { en: 'A student publishes code that can alter grades in an electronic gradebook, adding “Do not use for harm.” Another student uses it to gain an award at a classmate’s expense. Does the author share responsibility? Analyse what the code is, what its author could know and which duties matter.', ru: 'Студент публикует код, позволяющий менять оценки в электронном журнале, с припиской «Не использовать во вред». Другой студент применяет его и получает награду вместо одногруппника. Разделяет ли автор ответственность? Разбери природу инструмента, доступное автору знание и его обязанности.' } },
  { id: 'virtual-property', title: { en: 'Virtual land, real loss', ru: 'Виртуальная земля, настоящая потеря' }, source: 'Seminar 2 · Case 2', text: { en: 'Consider a virtual world where users spend real money on digital land, build businesses and form relationships. If the platform closes, their virtual property disappears. What kind of reality does this property have? What establishes ownership, and which responsibilities follow for the platform?', ru: 'В виртуальном мире пользователи тратят реальные деньги на цифровую землю, строят бизнес и отношения. Если платформа закрывается, виртуальное имущество исчезает. В каком смысле оно реально? Как обосновывается владение и какие обязанности есть у платформы?' } },
  { id: 'testing-truth', title: { en: '50,000 tests: proof of reliability?', ru: '50 000 тестов: доказательство надёжности?' }, source: 'Seminar 4 · Case 1', text: { en: 'A team tests a financial application for six months and records 50,000 successful tests. Consider a claim that the application therefore cannot fail. Analyse the difference between a model and reality, the limits of induction, and the responsibility involved in communicating uncertainty to users.', ru: 'Команда полгода тестирует финансовое приложение и получает 50 000 успешных тестов. Рассмотри утверждение, что приложение поэтому не может дать сбой. Разбери различие модели и реальности, границы индукции и ответственность за сообщение пользователям о неопределённости.' } },
] as const;
export type EssayFeedback = {
  summary: string; strength: string;
  criteria: { id: string; score: number; reason: string }[];
  fixes: { quote: string; explanation: string; example: string }[];
  nextSteps: string[];
};
export function validateFeedback(value: unknown): EssayFeedback {
  const v = value as EssayFeedback;
  const text = (s: unknown, max = 1800) => typeof s === 'string' && s.trim().length > 0 && s.length <= max;
  if (!v || !text(v.summary) || !text(v.strength) || !Array.isArray(v.criteria) || v.criteria.length !== 5 ||
      !RUBRIC.every(r => v.criteria.filter(c => c.id === r.id).length === 1 && v.criteria.some(c => c.id === r.id && Number.isInteger(c.score) && c.score >= 0 && c.score <= r.max && text(c.reason))) ||
      !Array.isArray(v.fixes) || v.fixes.length < 1 || v.fixes.length > 3 || !v.fixes.every(f => text(f.quote, 600) && text(f.explanation) && text(f.example, 1000)) ||
      !Array.isArray(v.nextSteps) || v.nextSteps.length !== 3 || !v.nextSteps.every(s => text(s, 700))) throw Error('invalid_feedback');
  return v;
}
