export interface CategoryDef {
  key: string;
  range: [number, number];
  color: 'amber' | 'cyan';
}

export const CATEGORIES: CategoryDef[] = [
  { key: 'category.replication', range: [1, 3], color: 'amber' },
  { key: 'category.consistency', range: [4, 8], color: 'cyan' },
  { key: 'category.loadBalancing', range: [9, 13], color: 'amber' },
  { key: 'category.caching', range: [14, 17], color: 'cyan' },
  { key: 'category.messaging', range: [18, 21], color: 'amber' },
  { key: 'category.storage', range: [22, 25], color: 'cyan' },
  { key: 'category.network', range: [26, 29], color: 'amber' },
  { key: 'category.advanced', range: [30, 33], color: 'cyan' },
  { key: 'category.database', range: [34, 39], color: 'amber' },
  { key: 'category.operatingSystems', range: [40, 49], color: 'cyan' },
  { key: 'category.backendReliability', range: [50, 58], color: 'amber' },
];

/** Category-suffix track key (e.g. 'caching') for a given case number, if any. */
export function categorySuffixForCaseNumber(caseNumber: number): string | null {
  const category = CATEGORIES.find((cat) => caseNumber >= cat.range[0] && caseNumber <= cat.range[1]);
  return category ? category.key.replace('category.', '') : null;
}
