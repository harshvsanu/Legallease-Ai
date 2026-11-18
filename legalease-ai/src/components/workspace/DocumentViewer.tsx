import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Search,
  FileText,
  Bookmark,
  Highlighter,
} from 'lucide-react';
import { DocumentMetadata, RiskFinding, ExtractedClause } from '../../types';

interface DocumentViewerProps {
  document: DocumentMetadata;
  activePage: number;
  onPageChange: (page: number) => void;
  selectedRisk?: RiskFinding | null;
  selectedClause?: ExtractedClause | null;
  onSelectRisk?: (risk: RiskFinding) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  activePage,
  onPageChange,
  selectedRisk,
  selectedClause,
  onSelectRisk,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100); // 90%, 100%, 115%
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'paginated' | 'full'>('paginated');

  const currentPage = document.pages.find((p) => p.pageNumber === activePage) || document.pages[0];

  const handleNextPage = () => {
    if (activePage < document.pageCount) {
      onPageChange(activePage + 1);
    }
  };

  const handlePrevPage = () => {
    if (activePage > 1) {
      onPageChange(activePage - 1);
    }
  };

  // Text highlighting logic for search term or selected finding
  const renderHighlightedContent = (rawContent: string) => {
    if (!rawContent) return null;

    let targetSearch = searchTerm.trim();
    if (selectedRisk && selectedRisk.pageNumber === activePage) {
      const cleanExcerpt = selectedRisk.triggerExcerpt.replace(/^["'\.\s]+|["'\.\s]+$/g, '').slice(0, 40);
      if (cleanExcerpt.length > 5) {
        targetSearch = cleanExcerpt;
      }
    }

    if (!targetSearch) {
      return (
        <div className="whitespace-pre-wrap font-serif text-slate-800 dark:text-slate-200 leading-relaxed text-sm select-text">
          {rawContent}
        </div>
      );
    }

    const regex = new RegExp(`(${targetSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = rawContent.split(regex);

    return (
      <div className="whitespace-pre-wrap font-serif text-slate-800 dark:text-slate-200 leading-relaxed text-sm select-text">
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark
              key={i}
              className="bg-amber-200 dark:bg-amber-800/80 text-slate-900 dark:text-white px-1 py-0.5 rounded font-semibold animate-pulse"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-slate-50/70 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Top Controls Toolbar */}
      <div className="p-3 bg-white dark:bg-midnight-950 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Pagination Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevPage}
            disabled={activePage <= 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300"
            title="Previous Page"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-medium text-slate-700 dark:text-slate-300 px-1">
            Page <strong className="text-slate-900 dark:text-white">{activePage}</strong> of{' '}
            {document.pageCount}
          </span>

          <button
            onClick={handleNextPage}
            disabled={activePage >= document.pageCount}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300"
            title="Next Page"
            aria-label="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Search in Document */}
        <div className="relative flex-1 max-w-[200px] sm:max-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search in text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Zoom & View Options */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoomLevel((z) => Math.max(85, z - 10))}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-slate-500 w-9 text-center">
            {zoomLevel}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Document Text Canvas */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center">
        <div
          className="w-full max-w-2xl bg-white dark:bg-midnight-950/90 rounded-xl p-6 sm:p-10 shadow-soft border border-slate-200/80 dark:border-slate-800/80 min-h-[500px] transition-all"
          style={{ fontSize: `${zoomLevel}%` }}
        >
          {/* Virtual Paper Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200/60 dark:border-slate-800/80 text-[11px] text-slate-400 font-mono">
            <span>{document.fileName}</span>
            <span>
              Page {activePage} of {document.pageCount}
            </span>
          </div>

          {/* Page Text Rendering */}
          {currentPage ? (
            renderHighlightedContent(currentPage.text)
          ) : (
            <div className="text-center py-20 text-slate-400 text-sm">
              No page text available.
            </div>
          )}
        </div>
      </div>

      {/* Page Thumbnails Bar */}
      {document.pageCount > 1 && (
        <div className="p-2 bg-white dark:bg-midnight-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 overflow-x-auto text-xs">
          {document.pages.map((p) => (
            <button
              key={p.pageNumber}
              onClick={() => onPageChange(p.pageNumber)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activePage === p.pageNumber
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              P. {p.pageNumber}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
