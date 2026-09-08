import { describe, expect, it } from 'vitest';
import type { Case } from '../types/case';
import type { Concept } from '../types/game';
import conceptsEn from './concepts.json';
import conceptsVi from './concepts-vi.json';
import caseIndexEn from './case-index.json';
import caseIndexVi from './case-index.vi.json';
import { TOTAL_CASE_COUNT } from '../utils/caseIds';

const enModules = import.meta.glob<{ default: Case }>('./cases/case-*.json', { eager: true });
const viModules = import.meta.glob<{ default: Case }>('./cases/vi/case-*.json', { eager: true });

const enCases = Object.values(enModules).map((module) => module.default);
const viCases = Object.values(viModules).map((module) => module.default);

function validateCase(caseData: Case): void {
  const validIds = [`case-${caseData.number}`, `case-${String(caseData.number).padStart(2, '0')}`];
  expect(validIds).toContain(caseData.id);
  expect(caseData.brief.symptoms.length).toBeGreaterThanOrEqual(3);
  expect(caseData.diagram.nodes.length).toBeGreaterThanOrEqual(3);
  expect(caseData.diagnosis.rootCause.options.filter((option) => option.correct)).toHaveLength(1);
  expect(caseData.diagnosis.fix.options.filter((option) => option.correct)).toHaveLength(1);
  expect(new Set(caseData.diagnosis.rootCause.options.map((option) => option.text)).size).toBe(
    caseData.diagnosis.rootCause.options.length,
  );
  expect(new Set(caseData.diagnosis.fix.options.map((option) => option.text)).size).toBe(
    caseData.diagnosis.fix.options.length,
  );

}

function validateNoAnswerLeak(caseData: Case): void {
  const evidence = JSON.stringify(caseData.diagram);
  const rootCause = caseData.diagnosis.rootCause.options.find((option) => option.correct)?.text;
  const fix = caseData.diagnosis.fix.options.find((option) => option.correct)?.text;
  expect(evidence).not.toContain(rootCause);
  expect(evidence).not.toContain(fix);
}

describe('backend curriculum data', () => {
  it('keeps the complete English index contiguous and exposes the same Vietnamese index', () => {
    expect(caseIndexEn).toHaveLength(TOTAL_CASE_COUNT);
    expect(caseIndexVi).toHaveLength(TOTAL_CASE_COUNT);
    expect(caseIndexEn.map((entry) => entry.number)).toEqual(
      Array.from({ length: TOTAL_CASE_COUNT }, (_, index) => index + 1),
    );
    expect(caseIndexVi.map((entry) => entry.id)).toEqual(caseIndexEn.map((entry) => entry.id));
  });

  it('provides valid English and Vietnamese bodies for the complete curriculum', () => {
    expect(enCases.filter((caseData) => caseData.number >= 34)).toHaveLength(25);
    expect(viCases).toHaveLength(TOTAL_CASE_COUNT);
    viCases.forEach(validateCase);
    [...enCases.filter((caseData) => caseData.number >= 34), ...viCases.filter((caseData) => caseData.number >= 34)]
      .forEach(validateNoAnswerLeak);
  });

  it('provides a concept guide for every expansion case in both languages', () => {
    const enConceptIds = new Set((conceptsEn as Concept[]).map((concept) => concept.id));
    const viConceptIds = new Set((conceptsVi as Concept[]).map((concept) => concept.id));

    for (const caseData of enCases.filter((entry) => entry.number >= 34)) {
      expect(enConceptIds.has(caseData.conceptId)).toBe(true);
      expect(viConceptIds.has(caseData.conceptId)).toBe(true);
    }
  });
});
