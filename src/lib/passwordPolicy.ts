/** bcrypt ignores bytes after byte 72. Reject new passwords that would be truncated. */
export function validNewPassword(value: string): boolean {
  return value.length >= 8 && Buffer.byteLength(value, 'utf8') <= 72;
}
