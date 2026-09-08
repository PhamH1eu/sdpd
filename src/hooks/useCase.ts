import { useEffect, useState } from 'react';
import type { Case } from '../types/case';
import type { Concept } from '../types/game';
import { useGameState } from './useGameState';

// Lightweight per-case metadata, generated at build/dev time by
// scripts/generate-case-index.mjs (see "predev"/"prebuild" npm scripts).
// Only the fields the Home page / Sidebar / CaseList need — the full case
// body (diagram, diagnosis, brief) is lazy-loaded per case via useCase().
import caseIndexEn from '../data/case-index.json';
import caseIndexPtBR from '../data/case-index.pt-BR.json';
import caseIndexVi from '../data/case-index.vi.json';

// Concepts
import conceptsEn from '../data/concepts.json';
import conceptsPtBR from '../data/concepts-pt-BR.json';
import conceptsVi from '../data/concepts-vi.json';

export interface CaseIndexEntry {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  conceptId: string;
}

// Lazy loaders for full case bodies, keyed by locale. Vite code-splits each
// glob entry into its own chunk automatically — no vite.config.ts change needed.
const loaders: Record<string, Record<string, () => Promise<{ default: Case }>>> = {
  en: import.meta.glob<{ default: Case }>('../data/cases/case-*.json'),
  'pt-BR': import.meta.glob<{ default: Case }>('../data/cases/pt-BR/case-*.json'),
  vi: import.meta.glob<{ default: Case }>('../data/cases/vi/case-*.json'),
};

const caseIndexByLocale: Record<string, CaseIndexEntry[]> = {
  en: caseIndexEn,
  'pt-BR': caseIndexPtBR,
  vi: caseIndexVi,
};

function mergeConcepts(base: Concept[], localized: Concept[]): Concept[] {
  const localizedById = new Map(localized.map((concept) => [concept.id, concept]));
  return base.map((concept) => localizedById.get(concept.id) ?? concept);
}

const conceptsByLocale: Record<string, Concept[]> = {
  en: conceptsEn as Concept[],
  'pt-BR': conceptsPtBR as Concept[],
  vi: mergeConcepts(conceptsEn as Concept[], conceptsVi as Concept[]),
};

function findLoader(locale: string, caseId: string) {
  const localeLoaders = loaders[locale] ?? loaders.en;
  const suffix = `${caseId}.json`;
  const key = Object.keys(localeLoaders).find((k) => k.endsWith(suffix));
  return key ? localeLoaders[key] : undefined;
}

export function useCase(caseId: string | undefined): { caseData: Case | null; loading: boolean } {
  const locale = useGameState((s) => s.locale);
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!caseId) {
      setCaseData(null);
      setLoading(false);
      return;
    }

  const loader = findLoader(locale, caseId) ?? findLoader('en', caseId);
    if (!loader) {
      setCaseData(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setCaseData(null);

    loader()
      .then((mod) => {
        if (cancelled) return;
        setCaseData((mod.default as unknown as Case) ?? null);
      })
      .catch(() => {
        if (cancelled) return;
        setCaseData(null);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [caseId, locale]);

  return { caseData, loading };
}

export function useAllCases(): CaseIndexEntry[] {
  const locale = useGameState((s) => s.locale);
  return caseIndexByLocale[locale] ?? caseIndexByLocale.en;
}

export function useConcepts(): Concept[] {
  const locale = useGameState((s) => s.locale);
  return conceptsByLocale[locale] ?? (conceptsEn as Concept[]);
}
