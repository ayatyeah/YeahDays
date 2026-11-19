import sections from './terms.json';

// Distractors stay within the same subject. Keep section/card order stable after release:
// both option positions and persisted answer indexes depend on it.
const sectionOffsets = sections.map((_, index) => sections.slice(0, index).reduce((sum, section) => sum + section.terms.length, 0));
export const termQuestions = sections.flatMap((section, sectionIndex) => section.terms.map((term, index) => {
  const choices = [term, ...[1, 3, 5].map(offset => section.terms[(index + offset) % section.terms.length])];
  const position = (sectionOffsets[sectionIndex] + index) % choices.length;
  const options = [...choices.slice(choices.length - position), ...choices.slice(0, choices.length - position)];
  return {
    id: `term-${term.id}`, category: section.id, name: term.name,
    q: `Какое объяснение точнее всего соответствует «${term.name}»?`,
    options: options.map(option => option.meaning), correct: [position],
    why: { ru: `${term.meaning}\n\nПример: ${term.example}\n\nВажно: ${term.distinction}`, en: `${term.meaning}\n\nПример: ${term.example}\n\nВажно: ${term.distinction}` },
    optionExplanations: options.map(option => option.id === term.id ? `Верно. ${term.example} ${term.distinction}` : `Здесь описан термин «${option.name}»: ${option.example} Вопрос о «${term.name}». Его пример: ${term.example} Различие, которое стоит запомнить: ${term.distinction}`),
    studyLink: { href: '#terms', title: `Словарь: ${term.name}` },
  };
}));
export const termOptionCounts = Object.fromEntries(termQuestions.map(question => [question.id, question.options.length]));
export function termAttempt(category: string, count: number, random: boolean) {
  const pool = termQuestions.filter(question => category === 'all' || question.category === category);
  if (!Number.isFinite(count) || count < 1) return [];
  if (random) for (let index = pool.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[other]] = [pool[other], pool[index]];
  }
  return pool.slice(0, Math.min(Math.floor(count), pool.length));
}
