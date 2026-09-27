/** Shared by imports and views; also handles old calendar tasks without source. */
export function isAttendanceTitle(title: string): boolean {
  return /\battendance\b|посещаем|аттенданс|қатысу/i.test(title);
}

export function isLmsDeadline(todo: { title: string; source?: string }): boolean {
  if (isAttendanceTitle(todo.title)) return false;
  // Older imports have no source marker; Moodle's assignment export uses this suffix.
  return todo.source === "lms" || /:\s*.+\bis due\b/i.test(todo.title);
}
