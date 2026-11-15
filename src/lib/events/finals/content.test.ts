import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { FINAL_NOTEBOOKS, RETIRED_NOTEBOOK_ROUTES, findFinalEvent } from './index';
import { EVENTS, findEvent } from '../index';
import { EVENT_COURSES } from '../courses';

describe('final preparation and withdrawn assessment material', () => {
  it('covers six courses with bilingual notes and a source for every study unit', () => {
    expect(FINAL_NOTEBOOKS).toHaveLength(6);
    expect(FINAL_NOTEBOOKS.reduce((n, book) => n + book.event.lectures.reduce((m, l) => m + l.parts.length, 0), 0)).toBe(142);
    for (const book of FINAL_NOTEBOOKS) {
      expect(EVENT_COURSES.some(course => course.eventIds.includes(book.event.id))).toBe(true);
      expect(book.guide.en.length).toBeGreaterThan(500);
      expect(book.guide.ru.length).toBeGreaterThan(500);
      const parts = book.event.lectures.flatMap(lecture => lecture.parts);
      expect(new Set(parts.map(part => part.id)).size).toBe(parts.length);
      for (const lecture of book.event.lectures) {
        expect(book.sources.some(source => source.lectureId === lecture.id), lecture.id).toBe(true);
        for (const part of lecture.parts) {
          expect(part.questions, part.id).toEqual([]);
          expect(part.notes.en.length, part.id).toBeGreaterThan(300);
          expect(part.notes.ru.length, part.id).toBeGreaterThan(300);
          expect(part.notes.en, part.id).not.toMatch(/bank question|question.bank study supplement/i);
          expect(part.notes.ru, part.id).not.toMatch(/вопрос банка/);
        }
      }
      for (const source of book.sources) expect(new URL(source.url).origin).toBe('https://lms.astanait.edu.kz');
      if (book.practiceId) expect(findEvent(book.practiceId)).toBeDefined();
    }
  });
  it('does not present missing or combined LMS decks as separate lectures', () => {
    expect(findFinalEvent('research-methods-final')!.event.lectures).toHaveLength(9);
    const cloud = findFinalEvent('cloud-computing-final')!;
    expect(cloud.event.lectures).toHaveLength(9);
    expect(cloud.event.lectures.at(-1)?.title.en).toContain('9–10');
    expect(findFinalEvent('philosophy-final')!.event.lectures).toHaveLength(10);
  });
  it('retires downloadable banks and project-specific question payloads', () => {
    const paths = [
      'src/lib/events/projectDefense/event.ts',
      'src/lib/events/researchMethodsEndterm/content.ts',
      'src/lib/events/cloudComputingEndterm/questions.json',
      'src/lib/events/cloudComputingEndterm/knowledgeChecks.json',
      'src/lib/events/cloudComputingEndterm/examNotes.json',
      'src/lib/events/computerNetworksEndterm/bank.json',
      'src/lib/events/computerNetworksEndterm/vrt.json',
      'src/lib/events/computerNetworksEndterm/question-supplements.json',
      'public/events/computer-networks-endterm/question-bank.md',
      'public/events/computer-networks-endterm/core-250.md',
      'public/events/computer-networks-endterm/sample.pdf',
    ];
    for (const path of paths) expect(existsSync(path), path).toBe(false);
    expect(EVENTS.map(event => event.id)).not.toContain('yeahtrack-defense');
    expect(findEvent('computer-networks-endterm')).toBeUndefined();
    for (const oldId of Object.keys(RETIRED_NOTEBOOK_ROUTES)) expect(findFinalEvent(oldId)?.event.id).toBe(RETIRED_NOTEBOOK_ROUTES[oldId]);
    for (const lang of ['ru', 'en']) expect(readFileSync(`public/events/computer-networks-endterm/notes-${lang}.md`, 'utf8')).not.toMatch(/Question-bank study supplement|Q\d{3}/);
  });
  it('keeps the different final formats explicit', () => {
    expect(findFinalEvent('project-management-final')!.guide.en).toContain('defence of Team Project 2');
    expect(findFinalEvent('philosophy-final')!.guide.en).toContain('350 words');
    expect(findFinalEvent('philosophy-final')!.guide.en).toContain('50 minutes');
    expect(findFinalEvent('computer-vision-final')!.guide.en).toContain('published practice format');
    expect(findFinalEvent('research-methods-final')!.guide.en).toContain('does not replace or modify');
  });
});
