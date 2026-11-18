import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  HardDrive,
  Sparkles,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { AIEngineConfig, DocumentCategory, DocumentMetadata } from '../../types';
import { formatBytes, formatDate } from '../../lib/utils';
import { SAMPLE_CONTRACTS } from '../../data/sampleContracts';

interface DashboardPageProps {
  documents: DocumentMetadata[];
  engineConfig: AIEngineConfig;
  storageStats: { documentCount: number; analysisCount: number; estimatedBytesUsed: number };
  onOpenDocument: (doc: DocumentMetadata) => void;
  onDeleteDocument: (id: string) => void;
  onOpenUpload: () => void;
  onNavigatePrivacy: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  documents,
  engineConfig,
  storageStats,
  onOpenDocument,
  onDeleteDocument,
  onOpenUpload,
  onNavigatePrivacy,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Documents' },
    { id: 'rental', label: 'Rental Leases' },
    { id: 'employment', label: 'Employment' },
    { id: 'service', label: 'Service & MSAs' },
    { id: 'notice', label: 'Legal Notices' },
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Banner & Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: Total Documents */}
        <div className="p-6 rounded-2xl bg-white dark:bg-midnight-950 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Documents
            </span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {documents.length}
            </div>
            <p className="text-xs text-slate-500">
              {documents.filter((d) => d.isSample).length} samples • {documents.filter((d) => !d.isSample).length} custom
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: AI Engine Status */}
        <div
          onClick={onNavigatePrivacy}
          className="p-6 rounded-2xl bg-white dark:bg-midnight-950 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-indigo-400 transition-colors"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              AI Runtime (On-Device)
            </span>
            <div className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
              {engineConfig.activeModelName.split('(')[0]}
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              100% On-Device • Memory: {engineConfig.memoryUsageMB || 22} MB
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Private Storage Quota */}
        <div
          onClick={onNavigatePrivacy}
          className="p-6 rounded-2xl bg-white dark:bg-midnight-950 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-indigo-400 transition-colors"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              IndexedDB Storage
            </span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatBytes(storageStats.estimatedBytesUsed)}
            </div>
            <p className="text-xs text-slate-500">
              Stored locally • Encrypted in browser
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <HardDrive className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Action Header & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Document Workspace Library
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Open any contract to view plain-English summaries, highlighted risks, and interactive checklists.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenUpload}
            className="px-4 py-2.5 rounded-xl bg-midnight-950 hover:bg-slate-900 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold text-sm shadow-soft transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload New Document
          </button>
        </div>
      </div>

      {/* Search & Category Pills */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-midnight-950 dark:bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-midnight-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Document Grid */}
      {filteredDocs.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white dark:bg-midnight-950 border border-slate-200 dark:border-slate-800 p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">
              No documents found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Upload your rental lease, employment contract, or service agreement to begin private on-device analysis.
            </p>
          </div>
          <button
            onClick={onOpenUpload}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" /> Upload Document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => {
            const isHighRisk = doc.id.includes('lease') || doc.id.includes('employment');
            return (
              <div
                key={doc.id}
                className="p-6 rounded-2xl bg-white dark:bg-midnight-950 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-soft hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Category & Sample Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-lavender-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {doc.category}
                    </span>
                    {doc.isSample && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                        Built-in Sample
                      </span>
                    )}
                  </div>

                  {/* Title & File info */}
                  <div>
                    <h3 className="font-semibold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {doc.fileName} • {doc.pageCount} Pages • {doc.wordCount} words
                    </p>
                  </div>

                  {/* Document preview snippet */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 font-serif italic">
                    "{doc.rawText.slice(0, 160).trim()}..."
                  </p>
                </div>

                {/* Footer Actions */}
                <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(doc.uploadedAt)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!doc.isSample && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteDocument(doc.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                        title="Delete document"
                        aria-label="Delete document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => onOpenDocument(doc)}
                      className="px-3 py-1.5 rounded-lg bg-midnight-950 dark:bg-indigo-600 hover:bg-slate-900 dark:hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <span>Analyze</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
