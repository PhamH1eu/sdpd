import { describe, expect, it } from 'vitest';
import en from './en.json';
import ptBR from './pt-BR.json';
import vi from './vi.json';
import type { CheatsheetData } from '../../types/cheatsheet';

const enData = en as CheatsheetData;
const ptData = ptBR as CheatsheetData;
const viData = vi as CheatsheetData;
const localizedData = [ptData, viData];

describe('cheatsheet locale parity', () => {
  it('both locales declare schemaVersion 1', () => {
    expect(enData.schemaVersion).toBe(1);
    localizedData.forEach((data) => expect(data.schemaVersion).toBe(1));
  });

  it('both locales have exactly 45 cards', () => {
    expect(enData.cards).toHaveLength(45);
    localizedData.forEach((data) => expect(data.cards).toHaveLength(45));
  });

  it('card ids match exactly, in the same order', () => {
    localizedData.forEach((data) => {
      expect(data.cards.map((c) => c.id)).toEqual(enData.cards.map((c) => c.id));
    });
  });

  it('categories, relatedCaseIds, and conceptId match per card', () => {
    enData.cards.forEach((enCard, i) => {
      localizedData.forEach((data) => {
        const card = data.cards[i];
        expect(card.category).toBe(enCard.category);
        expect(card.relatedCaseIds).toEqual(enCard.relatedCaseIds);
        expect(card.conceptId).toBe(enCard.conceptId);
        expect(card.options).toHaveLength(enCard.options.length);
      });
    });
  });

  it('no card id appears twice within a locale', () => {
    expect(new Set(enData.cards.map((c) => c.id)).size).toBe(enData.cards.length);
    expect(new Set(ptData.cards.map((c) => c.id)).size).toBe(ptData.cards.length);
    expect(new Set(viData.cards.map((c) => c.id)).size).toBe(viData.cards.length);
  });
});
