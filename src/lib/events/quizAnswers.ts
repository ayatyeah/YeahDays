/** Exact-set grading: partial or duplicate selections do not count as correct. */
export function matchesAnswer(selected: number[] | undefined, expected: number[]) {
  return expected.length > 0 && !!selected && selected.length === expected.length && new Set(selected).size === selected.length && expected.every(n => selected.includes(n));
}
