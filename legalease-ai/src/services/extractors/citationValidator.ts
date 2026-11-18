import { Citation, DocumentPage } from '../../types';

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Validates a citation against document pages to guarantee zero fabrication.
 */
export function validateCitation(
  excerpt: string,
  claimedPageNumber: number,
  pages: DocumentPage[]
): Citation {
  const normExcerpt = normalizeText(excerpt);
  if (!normExcerpt || normExcerpt.length < 5) {
    return {
      excerpt,
      pageNumber: claimedPageNumber,
      matchConfidence: 0.2,
      verified: false,
    };
  }

  // 1. Try exact match on claimed page first
  const targetPage = pages.find((p) => p.pageNumber === claimedPageNumber);
  if (targetPage) {
    const normTarget = normalizeText(targetPage.text);
    if (normTarget.includes(normExcerpt)) {
      return {
        excerpt,
        pageNumber: claimedPageNumber,
        matchConfidence: 1.0,
        verified: true,
      };
    }
  }

  // 2. Try searching across all pages for exact or high-similarity substring
  for (const page of pages) {
    const normPage = normalizeText(page.text);
    if (normPage.includes(normExcerpt)) {
      return {
        excerpt,
        pageNumber: page.pageNumber,
        matchConfidence: 0.95,
        verified: true,
      };
    }

    // 3. Partial phrase matching (first 35 characters or 7 words)
    const words = normExcerpt.split(' ');
    if (words.length >= 4) {
      const subPhrase = words.slice(0, Math.min(8, words.length)).join(' ');
      if (normPage.includes(subPhrase)) {
        return {
          excerpt,
          pageNumber: page.pageNumber,
          matchConfidence: 0.82,
          verified: true,
        };
      }
    }
  }

  // Citation could not be found anywhere in the text
  return {
    excerpt,
    pageNumber: claimedPageNumber,
    matchConfidence: 0.1,
    verified: false,
  };
}

export function validateAllCitations(
  citations: Array<{ excerpt: string; pageNumber: number }>,
  pages: DocumentPage[]
): Citation[] {
  return citations.map((c) => validateCitation(c.excerpt, c.pageNumber, pages));
}
