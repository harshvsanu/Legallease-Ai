import { describe, it, expect } from 'vitest';
import { chunkDocument } from '../services/extractors/textChunker';
import { DocumentPage } from '../types';

describe('Document Text Chunker & Heading Mapper', () => {
  const pages: DocumentPage[] = [
    {
      pageNumber: 1,
      text: `SECTION 1. TERM OF LEASE
The lease term shall be twelve months.

SECTION 2. RENT OBLIGATIONS
Tenant shall pay $2,000 on the first day of each month.`,
      charStartIndex: 0,
      charEndIndex: 120,
    },
  ];

  it('chunks paragraphs preserving headings and page numbers', () => {
    const chunks = chunkDocument(pages, 80, 20);
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[0].pageNumber).toBe(1);
    expect(chunks[0].heading).toContain('SECTION 1');
  });
});
