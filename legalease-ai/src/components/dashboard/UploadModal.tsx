import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  X,
  AlertCircle,
  CheckCircle2,
  File,
  Sparkles,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { DocumentMetadata } from '../../types';
import { processDocumentFile } from '../../services/extractors';
import { SAMPLE_CONTRACTS } from '../../data/sampleContracts';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentReady: (doc: DocumentMetadata) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onDocumentReady,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = async (file: File) => {
    setErrorMessage('');
    const validExtensions = ['pdf', 'docx', 'txt'];
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (!ext || !validExtensions.includes(ext)) {
      setErrorMessage('Please upload a valid legal document (.PDF, .DOCX, or .TXT).');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File size exceeds 25MB limit. Please upload a smaller document.');
      return;
    }

    setIsProcessing(true);
    try {
      const doc = await processDocumentFile(file, (status, pct) => {
        setProgressStatus(status);
        setProgressPercent(pct);
      });
      setIsProcessing(false);
      onDocumentReady(doc);
    } catch (err: any) {
      console.error('File extraction error:', err);
      setIsProcessing(false);
      setErrorMessage(err.message || 'Failed to parse document text locally. Ensure file is not encrypted.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSampleClick = (sample: DocumentMetadata) => {
    onDocumentReady(sample);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-midnight-950 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-elevated relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close upload modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-medium border border-emerald-200 dark:border-emerald-800">
            <Shield className="w-3.5 h-3.5" /> 100% On-Device Processing
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Upload Legal Document
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Select a contract, rental lease, or legal notice to analyze in private.
          </p>
        </div>

        {/* Processing State */}
        {isProcessing ? (
          <div className="py-12 px-4 text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {progressPercent}%
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="font-semibold text-slate-900 dark:text-white text-base">
                {progressStatus || 'Analyzing document...'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Parsing structure, validating page boundaries, and chunking clauses...
              </p>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 max-w-xs mx-auto overflow-hidden">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Drag & Drop Area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40'
                  : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50/50 dark:hover:bg-slate-900/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3 shadow-sm">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
                Click to browse or drag & drop document
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Supports PDF, DOCX, and TXT (up to 25MB)
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Quick-try Sample Contracts */}
            <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Or Try a Sample Contract (1-Click)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {SAMPLE_CONTRACTS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSampleClick(sample)}
                    className="p-3 text-left rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-lavender-50 dark:hover:bg-indigo-950/60 border border-slate-200/80 dark:border-slate-800 transition-all group"
                  >
                    <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 mb-1">
                      <File className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {sample.category}
                      </span>
                    </div>
                    <div className="font-medium text-xs text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {sample.title}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {sample.pageCount} Pages • Sample
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
