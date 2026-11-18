import { describe, it, expect } from 'vitest';
import {
  findJargonTermsInText,
  LEGAL_JARGON_DICTIONARY,
} from '../services/ai/jargonDatabase';

describe('Legal Jargon Dictionary', () => {
  it('contains essential contract concepts with plain-English translations', () => {
    expect(LEGAL_JARGON_DICTIONARY['indemnification']).toBeDefined();
    expect(LEGAL_JARGON_DICTIONARY['liquidated damages']).toBeDefined();
    expect(LEGAL_JARGON_DICTIONARY['severability']).toBeDefined();
    expect(LEGAL_JARGON_DICTIONARY['force majeure']).toBeDefined();
  });

  it('scans contract text and flags matched legal jargon terms', () => {
    const clauseText = 'Tenant agrees to defend, indemnify, and hold harmless Landlord against liquidated damages.';
    const found = findJargonTermsInText(clauseText);
    expect(found.some((j) => j.term.includes('Indemnif'))).toBe(true);
    expect(found.some((j) => j.term.includes('Liquidated Damages'))).toBe(true);
  });
});
