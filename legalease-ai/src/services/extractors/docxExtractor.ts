import mammoth from 'mammoth';
import { DocumentPage } from '../../types';

export interface DOCXExtractionResult {
  pages: DocumentPage[];
  rawText: string;
  pageCount: number;
}

export async function extractTextFromDOCX(
  fileOrBuffer: File | ArrayBuffer
): Promise<DOCXExtractionResult> {
  const arrayBuffer = fileOrBuffer instanceof File
    ? await fileOrBuffer.arrayBuffer()
    : fileOrBuffer;

  const result = await mammoth.extractRawText({ arrayBuffer });
  const rawText = result.value.trim();

  // In DOCX, pages are not rigid binary pages like PDF, so we paginate by paragraphs / word volume (~350 words or 2200 chars per standard page)
  const paragraphs = rawText.split(/\n\s*\n/);
  const pages: DocumentPage[] = [];
  
  let currentPageText = '';
  let currentPageNum = 1;
  let charIndex = 0;

  for (const para of paragraphs) {
    const cleanPara = para.trim();
    if (!cleanPara) continue;

    if (currentPageText.length + cleanPara.length > 2200 && currentPageText.length > 0) {
      const start = charIndex;
      const end = start + currentPageText.length;
      pages.push({
        pageNumber: currentPageNum++,
        text: currentPageText.trim(),
        charStartIndex: start,
        charEndIndex: end,
      });
      charIndex = end + 2;
      currentPageText = cleanPara;
    } else {
      currentPageText = currentPageText ? `${currentPageText}\n\n${cleanPara}` : cleanPara;
    }
  }

  if (currentPageText.trim()) {
    const start = charIndex;
    const end = start + currentPageText.length;
    pages.push({
      pageNumber: currentPageNum,
      text: currentPageText.trim(),
      charStartIndex: start,
      charEndIndex: end,
    });
  }

  // Ensure at least 1 page
  if (pages.length === 0) {
    pages.push({
      pageNumber: 1,
      text: rawText || 'Empty document.',
      charStartIndex: 0,
      charEndIndex: rawText.length,
    });
  }

  return {
    pages,
    rawText,
    pageCount: pages.length,
  };
}
