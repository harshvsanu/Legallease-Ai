import { describe, it, expect } from 'vitest';
import { validateCitation } from '../services/extractors/citationValidator';
import { DocumentPage } from '../types';

describe('Citation Validator (Anti-Hallucination Guard)', () => {
  const mockPages: DocumentPage[] = [
    {
      pageNumber: 1,
      text: 'This Residential Lease Agreement begins on November 1, 2026. Tenant shall pay monthly rent of $2,450.00.',
      charStartIndex: 0,
      charEndIndex: 104,
    },
    {
      pageNumber: 2,
      text: 'In the event of default, tenant shall forfeit the entire deposit and pay liquidated damages of $3,500.00.',
      charStartIndex: 106,
      charEndIndex: 211,
    },
  ];

  it('validates an exact citation on the claimed page with 1.0 confidence', () => {
    const citation = validateCitation('pay liquidated damages of $3,500.00', 2, mockPages);
    expect(citation.verified).toBe(true);
    expect(citation.matchConfidence).toBe(1.0);
    expect(citation.pageNumber).toBe(2);
  });

  it('corrects the page number if the quote exists on another page', () => {
    const citation = validateCitation('monthly rent of $2,450.00', 2, mockPages);
    expect(citation.verified).toBe(true);
    expect(citation.pageNumber).toBe(1); // Auto-corrected to page 1
  });

  it('rejects fabricated or hallucinated citations not found in document', () => {
    const citation = validateCitation('landlord shall provide free champagne every Friday', 1, mockPages);
    expect(citation.verified).toBe(false);
    expect(citation.matchConfidence).toBeLessThan(0.5);
  });
});
