import { DocumentChunk, DocumentMetadata, ChatMessage, Citation } from '../../types';
import { validateCitation } from '../extractors/citationValidator';

interface ScoredChunk {
  chunk: DocumentChunk;
  score: number;
}

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'can\'t', 'cannot',
  'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each',
  'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d',
  'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i',
  'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s',
  'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or',
  'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll',
  'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll',
  'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while',
  'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll',
  'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

export function searchDocumentChunks(query: string, doc: DocumentMetadata, topK: number = 3): ScoredChunk[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const chunks = doc.chunks.length > 0 ? doc.chunks : [
    {
      id: 'full-doc',
      pageNumber: 1,
      text: doc.rawText.slice(0, 3000),
      startChar: 0,
      endChar: doc.rawText.length,
    }
  ];

  const scored: ScoredChunk[] = [];

  for (const chunk of chunks) {
    const chunkTokens = tokenize(chunk.text);
    if (chunkTokens.length === 0) continue;

    let score = 0;
    const tokenFreq: Record<string, number> = {};
    for (const t of chunkTokens) {
      tokenFreq[t] = (tokenFreq[t] || 0) + 1;
    }

    for (const q of queryTokens) {
      if (tokenFreq[q]) {
        // BM25-style term frequency weighting
        const tf = tokenFreq[q];
        score += (tf * 2.2) / (tf + 1.2 * (1 - 0.75 + 0.75 * (chunkTokens.length / 120)));
      }
    }

    // Boost if heading matches query terms
    if (chunk.heading) {
      const headingTokens = tokenize(chunk.heading);
      for (const q of queryTokens) {
        if (headingTokens.includes(q)) {
          score += 2.5;
        }
      }
    }

    if (score > 0) {
      scored.push({ chunk, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

/**
 * Answers questions grounded strictly in document chunks, verifying citations.
 */
export function answerDocumentQuestion(
  question: string,
  doc: DocumentMetadata
): ChatMessage {
  const scoredChunks = searchDocumentChunks(question, doc, 3);
  const topMatch = scoredChunks[0];

  // If score is too low or no matches found, flag insufficient evidence
  if (!topMatch || topMatch.score < 1.0) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date().toISOString(),
      content: `**Insufficient Evidence in Document:**\n\nI searched across all ${doc.pageCount} pages of "${doc.title}", but could not find explicit language or clauses addressing "${question}".\n\n*Note: If this is an important topic (such as parking privileges, remote work stipends, or IP carve-outs) and it is absent from the contract, that means it is currently **unprotected**. You should request to have it explicitly added in writing before signing.*`,
      confidence: 'insufficient_evidence',
      citations: [],
    };
  }

  const citations: Citation[] = [];
  const bulletPoints: string[] = [];

  for (const match of scoredChunks) {
    const c = match.chunk;
    // Extract most relevant sentence from chunk
    const sentences = c.text.split(/(?<=[.?!])\s+/);
    let bestSentence = sentences[0] || c.text.slice(0, 150);
    const qTokens = tokenize(question);

    let highestSScore = -1;
    for (const s of sentences) {
      const sTokens = tokenize(s);
      let overlap = 0;
      for (const t of qTokens) {
        if (sTokens.includes(t)) overlap++;
      }
      if (overlap > highestSScore) {
        highestSScore = overlap;
        bestSentence = s.trim();
      }
    }

    const validated = validateCitation(bestSentence, c.pageNumber, doc.pages);
    citations.push(validated);
    bulletPoints.push(`- **Page ${c.pageNumber}${c.heading ? ` (${c.heading})` : ''}**: "${bestSentence}"`);
  }

  // Synthesize answer based on top matching text
  const primaryChunkText = topMatch.chunk.text;
  let synthesizedAnswer = '';

  const qLower = question.toLowerCase();
  if (qLower.includes('break') || qLower.includes('terminate') || qLower.includes('cancel')) {
    synthesizedAnswer = `Based on the contract text, termination requires strict compliance with the notice provisions outlined in the agreement. Here is the relevant text from **Page ${topMatch.chunk.pageNumber}**:\n\n> "${citations[0]?.excerpt || primaryChunkText.slice(0, 180)}"\n\n**Plain English Analysis:**\nYou should ensure any notice is sent in writing (often certified mail or designated email) well before the specified deadline to avoid automatic renewal or default penalties.`;
  } else if (qLower.includes('deposit') || qLower.includes('money') || qLower.includes('pay') || qLower.includes('rent') || qLower.includes('fee')) {
    synthesizedAnswer = `Regarding financial and payment obligations, the document specifies the following terms on **Page ${topMatch.chunk.pageNumber}**:\n\n> "${citations[0]?.excerpt || primaryChunkText.slice(0, 180)}"\n\n**Plain English Analysis:**\nPayments must be delivered according to the agreed schedule. Review late fee grace periods to ensure you are not penalized unfairly for minor processing delays.`;
  } else if (qLower.includes('renew') || qLower.includes('renewal')) {
    synthesizedAnswer = `The agreement outlines the following renewal mechanism on **Page ${topMatch.chunk.pageNumber}**:\n\n> "${citations[0]?.excerpt || primaryChunkText.slice(0, 180)}"\n\n**Plain English Analysis:**\nCheck if this renewal requires affirmative mutual agreement or if it operates as an automatic rollover unless you proactively give 30 or 60 days advance written notice.`;
  } else {
    synthesizedAnswer = `Here is what the agreement states regarding your inquiry (found on **Page ${topMatch.chunk.pageNumber}**):\n\n> "${citations[0]?.excerpt || primaryChunkText.slice(0, 200)}"\n\n**Plain English Summary:**\nThis clause governs the rights and duties of both parties on this subject. Review the exact wording above to confirm it matches what was verbally discussed.`;
  }

  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    timestamp: new Date().toISOString(),
    content: synthesizedAnswer,
    confidence: topMatch.score > 2.5 ? 'high' : 'medium',
    citations,
  };
}
