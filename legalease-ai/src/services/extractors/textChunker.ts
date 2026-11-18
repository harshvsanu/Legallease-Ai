import { DocumentChunk, DocumentPage } from '../../types';

export function chunkDocument(
  pages: DocumentPage[],
  chunkSize: number = 600, // characters
  chunkOverlap: number = 100
): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];
  let chunkCounter = 1;

  for (const page of pages) {
    const pageText = page.text.trim();
    if (!pageText) continue;

    // Detect paragraphs
    const paragraphs = pageText.split(/\n\s*\n/);
    let currentChunkText = '';
    let currentStartChar = page.charStartIndex;
    let currentHeading = '';

    for (const paragraph of paragraphs) {
      const cleanPara = paragraph.trim();
      if (!cleanPara) continue;

      // Check if this paragraph starts with a heading
      const headingMatch = cleanPara.match(
        /^(?:(?:ARTICLE|SECTION|CLAUSE)\s+[0-9IVXLCDM]+[:\.\-]?\s*|[0-9]{1,2}\.\s+)([A-Z\s,–\-]{3,60})/i
      );
      const detectedHeading = headingMatch ? cleanPara.slice(0, 70) : '';

      if (currentChunkText.length + cleanPara.length > chunkSize && currentChunkText.length > 0) {
        // Push the accumulated chunk with ITS currentHeading
        chunks.push({
          id: `chk-${page.pageNumber}-${chunkCounter++}`,
          pageNumber: page.pageNumber,
          text: currentChunkText.trim(),
          heading: currentHeading || undefined,
          startChar: currentStartChar,
          endChar: currentStartChar + currentChunkText.length,
        });

        // Retain overlap from end of current chunk
        const words = currentChunkText.split(/\s+/);
        const overlapWords = words.slice(-Math.min(15, words.length));
        currentChunkText = overlapWords.join(' ') + ' ' + cleanPara;
        currentStartChar = page.charStartIndex + Math.max(0, pageText.indexOf(cleanPara));
        // Now update heading to the newly detected heading for the new chunk
        currentHeading = detectedHeading || currentHeading;
      } else {
        if (!currentHeading && detectedHeading) {
          currentHeading = detectedHeading;
        } else if (detectedHeading && !currentChunkText) {
          currentHeading = detectedHeading;
        }
        currentChunkText = currentChunkText ? `${currentChunkText}\n\n${cleanPara}` : cleanPara;
      }
    }

    if (currentChunkText.trim()) {
      chunks.push({
        id: `chk-${page.pageNumber}-${chunkCounter++}`,
        pageNumber: page.pageNumber,
        text: currentChunkText.trim(),
        heading: currentHeading || undefined,
        startChar: currentStartChar,
        endChar: currentStartChar + currentChunkText.length,
      });
    }
  }

  return chunks;
}
