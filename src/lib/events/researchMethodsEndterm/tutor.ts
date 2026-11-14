import type { StudyEvent } from '../types';
import { cases, scenario, workedAnswers, type CaseId, type Mode } from './content';

export const rmtTutorEvent: StudyEvent = {
  id: 'research-methods-endterm', title: 'Research Methods & Tools · Endterm', course: 'Research Methods and Tools', description: 'Worked research scenarios and methodological reasoning.',
  counts: { part: 0, lecture: 0, final: 0 },
  lectures: [{ id: 'rmt-worked-cases', title: { en: 'Worked research scenarios', ru: 'Разбор исследовательских кейсов' },
    parts: (['A', 'B'] as CaseId[]).flatMap(caseId => (['mixed', 'qualitative', 'quantitative'] as Mode[]).map(mode => {
      const content = `Practice material, not real study evidence. Source data are fictional; alternative designs are adapted exercises.\n\n${scenario(caseId, mode)}\n\n${workedAnswers(caseId, mode).map(answer => `${answer.id}. ${answer.prompt}\n${answer.answer}`).join('\n\n')}`;
      return { id: `rmt-${caseId}-${mode}`, title: { en: `Case ${caseId} · ${cases[caseId].title} · ${mode}`, ru: `Кейс ${caseId} · ${mode}` }, notes: { en: content, ru: content }, questions: [] };
    })) }],
};
