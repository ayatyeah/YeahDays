import { describe, expect, it } from 'vitest';
import { findTutorEvent, tutorInstructions } from '@/lib/tutor';
import { cvFinalContext } from './context';
const event = findTutorEvent('computer-vision-final')!;
describe('CV final course grounding', () => {
  it('retrieves a relevant later lecture while an early lecture is open', () => {
    const text = cvFinalContext(event, 'Explain GAN discriminator mode collapse', 'cv-l1-p1');
    expect(text).toContain('Generative models');
    expect(text).toContain('mode collapse');
    expect(text).toContain('published sample');
  });
  it('matches Russian questions and includes the active original exercise', () => {
    const text = cvFinalContext(event, 'Объясни дисбаланс классов и метрики', 'cv-prep-metrics');
    expect(text).toContain('Active preparation unit');
    expect(text).toContain('0.5758');
    expect(text).toContain('Train');
  });
  it('keeps other courses unchanged and bounds long queries', () => {
    expect(cvFinalContext({ ...event, id: 'philosophy-final' }, 'CNN')).toBe('');
    expect(cvFinalContext(event, 'CNN '.repeat(3000)).length).toBeLessThan(30000);
  });
  it('grounds provider instructions in the question, even without screen focus', () => {
    const text = tutorInstructions(event, {}, 'ru', 'Explain attention queries keys values');
    expect(text).toContain('RNNs, attention and transformers');
    expect(text).toContain('Reply in Russian');
    expect(text).toContain('never invent experiments');
  });
});
