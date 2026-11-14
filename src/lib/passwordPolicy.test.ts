import { expect, it } from 'vitest';
import { validNewPassword } from './passwordPolicy';
it('rejects passwords that bcrypt would silently truncate, including UTF-8', () => {
  expect(validNewPassword('a'.repeat(72))).toBe(true);
  expect(validNewPassword('a'.repeat(73))).toBe(false);
  expect(validNewPassword('Я'.repeat(36))).toBe(true);
  expect(validNewPassword('Я'.repeat(37))).toBe(false);
  expect(validNewPassword('😀'.repeat(19))).toBe(false);
  expect(validNewPassword('short')).toBe(false);
});
