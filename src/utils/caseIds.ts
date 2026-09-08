export const TOTAL_CASE_COUNT = 58;

export function caseIdForNumber(n: number): string {
  return `case-${String(n).padStart(2, '0')}`;
}
