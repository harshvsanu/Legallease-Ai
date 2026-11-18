import * as pdfjsLib from 'pdfjs-dist';
import { DocumentPage } from '../../types';

// Set up PDF.js worker
if (typeof window !== 'undefined' && 'Worker' in window) {
  try {
    // Standard worker source compatible with Vite and bundlers
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  } catch (e) {
    console.warn('Failed to configure pdf.js worker URL:', e);
  }
}

export interface PDFExtractionResult {
  pages: DocumentPage[];
  rawText: string;
  pageCount: number;
  isScannedOrImageOnly: boolean;
}

export async function extractTextFromPDF(
  fileOrBuffer: File | ArrayBuffer,
  onProgress?: (current: number, total: number) => void
): Promise<PDFExtractionResult> {
  const arrayBuffer = fileOrBuffer instanceof File
    ? await fileOrBuffer.arrayBuffer()
    : fileOrBuffer;

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
  });

  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const pages: DocumentPage[] = [];
  let fullText = '';
  let currentCharIndex = 0;
  let totalTextLength = 0;

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Combine text items with spacing based on line positions
    let pageText = '';
    let lastY: number | null = null;

    for (const item of textContent.items as any[]) {
      if ('str' in item) {
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
          pageText += '\n';
        } else if (pageText && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
          pageText += ' ';
        }
        pageText += item.str;
        lastY = item.transform[5];
      }
    }

    const cleanPageText = pageText.trim();
    totalTextLength += cleanPageText.length;

    const startIdx = currentCharIndex;
    const endIdx = startIdx + cleanPageText.length;
    currentCharIndex = endIdx + 2; // account for page break \n\n

    pages.push({
      pageNumber: pageNum,
      text: cleanPageText,
      charStartIndex: startIdx,
      charEndIndex: endIdx,
    });

    if (fullText) {
      fullText += '\n\n' + cleanPageText;
    } else {
      fullText = cleanPageText;
    }

    if (onProgress) {
      onProgress(pageNum, numPages);
    }
  }

  // Detect scanned document if text density is suspiciously low
  const averageCharsPerPage = totalTextLength / Math.max(1, numPages);
  const isScannedOrImageOnly = averageCharsPerPage < 50;

  return {
    pages,
    rawText: fullText,
    pageCount: numPages,
    isScannedOrImageOnly,
  };
}
