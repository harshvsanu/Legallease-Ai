import { DocumentCategory, DocumentMetadata, DocumentPage } from '../../types';
import { extractTextFromPDF } from './pdfExtractor';
import { extractTextFromDOCX } from './docxExtractor';
import { chunkDocument } from './textChunker';

export function detectDocumentCategory(text: string, fileName: string): DocumentCategory {
  const lower = (text + ' ' + fileName).toLowerCase();

  if (
    lower.includes('lease agreement') ||
    lower.includes('rental agreement') ||
    lower.includes('landlord') ||
    lower.includes('tenant') ||
    lower.includes('premises') ||
    lower.includes('security deposit')
  ) {
    return 'rental';
  }

  if (
    lower.includes('employment agreement') ||
    lower.includes('offer letter') ||
    lower.includes('employee') ||
    lower.includes('employer') ||
    lower.includes('salary') ||
    lower.includes('non-compete') ||
    lower.includes('confidentiality and intellectual property')
  ) {
    return 'employment';
  }

  if (
    lower.includes('services agreement') ||
    lower.includes('master service') ||
    lower.includes('contractor') ||
    lower.includes('statement of work') ||
    lower.includes('client') ||
    lower.includes('consulting') ||
    lower.includes('deliverables')
  ) {
    return 'service';
  }

  if (
    lower.includes('notice to vacate') ||
    lower.includes('default notice') ||
    lower.includes('cease and desist') ||
    lower.includes('cure default') ||
    lower.includes('legal notice') ||
    lower.includes('formal demand')
  ) {
    return 'notice';
  }

  return 'other';
}

export function detectDocumentTitle(text: string, fileName: string): string {
  // Look at the first 300 characters for all-caps or title lines
  const lines = text.slice(0, 400).split('\n').map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    if (line.length >= 8 && line.length <= 80) {
      if (
        line.includes('AGREEMENT') ||
        line.includes('CONTRACT') ||
        line.includes('LEASE') ||
        line.includes('NOTICE') ||
        line.includes('MEMORANDUM') ||
        line.includes('POLICY')
      ) {
        return line.replace(/^[\s\*\#\_\-]+|[\s\*\#\_\-]+$/g, '');
      }
    }
  }

  // Fallback to formatted fileName without extension
  return fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
}

export async function processDocumentFile(
  file: File,
  onProgress?: (status: string, percentage: number) => void
): Promise<DocumentMetadata> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  let pages: DocumentPage[] = [];
  let rawText = '';
  let pageCount = 1;

  if (onProgress) onProgress('Reading file content...', 15);

  if (extension === 'pdf') {
    if (onProgress) onProgress('Parsing PDF text & structure...', 35);
    const pdfRes = await extractTextFromPDF(file, (curr, tot) => {
      if (onProgress) onProgress(`Extracting page ${curr} of ${tot}...`, 35 + Math.round((curr / tot) * 35));
    });
    pages = pdfRes.pages;
    rawText = pdfRes.rawText;
    pageCount = pdfRes.pageCount;

    if (pdfRes.isScannedOrImageOnly) {
      // Add notice about scanned PDF
      rawText += '\n\n[Note: This appears to be a scanned document. Extracted character count is low. Local text heuristics will inspect visible headings.]';
    }
  } else if (extension === 'docx') {
    if (onProgress) onProgress('Converting DOCX document...', 40);
    const docxRes = await extractTextFromDOCX(file);
    pages = docxRes.pages;
    rawText = docxRes.rawText;
    pageCount = docxRes.pageCount;
  } else {
    // Plain text or markdown
    if (onProgress) onProgress('Reading text content...', 40);
    rawText = await file.text();
    const paragraphs = rawText.split(/\n\s*\n/);
    let currentPage = '';
    let pageNum = 1;
    let charIdx = 0;

    for (const para of paragraphs) {
      if (currentPage.length + para.length > 2000 && currentPage) {
        pages.push({
          pageNumber: pageNum++,
          text: currentPage.trim(),
          charStartIndex: charIdx,
          charEndIndex: charIdx + currentPage.length,
        });
        charIdx += currentPage.length + 2;
        currentPage = para;
      } else {
        currentPage = currentPage ? `${currentPage}\n\n${para}` : para;
      }
    }

    if (currentPage.trim()) {
      pages.push({
        pageNumber: pageNum,
        text: currentPage.trim(),
        charStartIndex: charIdx,
        charEndIndex: charIdx + currentPage.length,
      });
    }

    pageCount = pages.length || 1;
  }

  if (onProgress) onProgress('Chunking sections & building citations...', 80);
  const chunks = chunkDocument(pages);

  const wordCount = rawText.split(/\s+/).filter(Boolean).length;
  const category = detectDocumentCategory(rawText, file.name);
  const title = detectDocumentTitle(rawText, file.name);

  if (onProgress) onProgress('Document processed locally.', 100);

  return {
    id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    title,
    fileName: file.name,
    fileType: (extension as any) || 'txt',
    fileSize: file.size,
    pageCount,
    wordCount,
    uploadedAt: new Date().toISOString(),
    category,
    rawText,
    pages,
    chunks,
  };
}
