import React, { useState, useEffect } from 'react';
import {
  FileText,
  ArrowLeft,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  CheckSquare,
  MessageSquare,
  Scale,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { AnalysisReport, DocumentMetadata, ExtractedClause, RiskFinding } from '../../types';
import { DocumentViewer } from './DocumentViewer';
import { SummaryTab } from './SummaryTab';
import { ClausesTab } from './ClausesTab';
import { RisksTab } from './RisksTab';
import { ChecklistTab } from './ChecklistTab';
import { ChatTab } from './ChatTab';
import { ComparisonTab } from './ComparisonTab';
import { ExportTab } from './ExportTab';
import { analyzeDocumentWithActiveEngine } from '../../services/ai/adapter';
import { getAnalysis, saveAnalysis } from '../../services/storage/indexedDB';

interface DocumentWorkspaceProps {
  document: DocumentMetadata;
  onBackToDashboard: () => void;
}

export const DocumentWorkspace: React.FC<DocumentWorkspaceProps> = ({
  document,
  onBackToDashboard,
}) => {
  const [activeTab, setActiveTab] = useState<
    'summary' | 'clauses' | 'risks' | 'checklist' | 'chat' | 'comparison' | 'export'
  >('risks');
  const [activePage, setActivePage] = useState<number>(1);
  const [selectedRisk, setSelectedRisk] = useState<RiskFinding | null>(null);
  const [selectedClause, setSelectedClause] = useState<ExtractedClause | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');

  // Load existing analysis or trigger local on-device analysis
  useEffect(() => {
    async function loadOrCreateAnalysis() {
      setIsAnalyzing(true);
      try {
        const cached = await getAnalysis(document.id);
        if (cached) {
          setAnalysis(cached);
          setIsAnalyzing(false);
          return;
        }

        const report = await analyzeDocumentWithActiveEngine(document, (step) => {
          setAnalysisStep(step);
        });
        setAnalysis(report);
        await saveAnalysis(report);
      } catch (err) {
        console.error('Failed to run document analysis:', err);
      } finally {
        setIsAnalyzing(false);
      }
    }
    loadOrCreateAnalysis();
  }, [document.id]);

  const handleJumpToPage = (pageNumber: number) => {
    setActivePage(pageNumber);
  };

  const handleSelectRisk = (risk: RiskFinding) => {
    setSelectedRisk(risk);
    setSelectedClause(null);
    setActivePage(risk.pageNumber);
  };

  const handleSelectClause = (clause: ExtractedClause) => {
    setSelectedClause(clause);
    setSelectedRisk(null);
    setActivePage(clause.pageNumber);
  };

  interface WorkspaceTabItem {
    id: 'risks' | 'summary' | 'clauses' | 'checklist' | 'chat' | 'comparison' | 'export';
    label: string;
    icon: any;
    count?: number;
  }

  const tabs: WorkspaceTabItem[] = [
    { id: 'risks', label: 'Risk Radar', icon: AlertTriangle, count: analysis?.risks.length },
    { id: 'summary', label: 'Summary', icon: Sparkles },
    { id: 'clauses', label: 'Clauses', icon: BookOpen, count: analysis?.clauses.length },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare, count: analysis?.checklist.length },
    { id: 'chat', label: 'Q&A Chat', icon: MessageSquare },
    { id: 'comparison', label: 'Comparison', icon: Scale },
    { id: 'export', label: 'Export', icon: Download },
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 animate-fade-in">
      {/* Workspace Top Header Bar */}
      <div className="bg-white dark:bg-midnight-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-2 rounded-xl text-slate-500 hover:text-midnight-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Back to Dashboard"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white line-clamp-1">
                {document.title}
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-lavender-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shrink-0">
                {document.category}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {document.fileName} • {document.pageCount} Pages • {document.wordCount} words
            </p>
          </div>
        </div>

        {/* Risk Score Pill & Engine info */}
        {analysis && (
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Risk Assessment
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {analysis.riskAssessment}
              </span>
            </div>

            <div
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                analysis.overallRiskScore >= 70
                  ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800'
                  : analysis.overallRiskScore >= 40
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{analysis.overallRiskScore} / 100 Risk</span>
            </div>
          </div>
        )}
      </div>

      {/* Split-Screen Workspace Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[720px]">
        {/* Left Pane: Interactive Paginated Document Viewer */}
        <div className="lg:col-span-5 xl:col-span-6 h-[720px]">
          <DocumentViewer
            document={document}
            activePage={activePage}
            onPageChange={setActivePage}
            selectedRisk={selectedRisk}
            selectedClause={selectedClause}
            onSelectRisk={handleSelectRisk}
          />
        </div>

        {/* Right Pane: AI Legal Copilot Panel */}
        <div className="lg:col-span-7 xl:col-span-6 h-[720px] bg-white dark:bg-midnight-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden shadow-sm">
          {/* Navigation Tabs Header */}
          <div className="p-2.5 bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-white dark:bg-midnight-950 text-indigo-600 dark:text-white shadow-sm font-bold border border-slate-200/60 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-midnight-950 dark:hover:text-white hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Tab Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            {isAnalyzing || !analysis ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                <div className="w-12 h-12 rounded-full border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 animate-spin" />
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    Analyzing Document Locally...
                  </h4>
                  <p className="text-xs text-slate-500">
                    {analysisStep || 'Scanning clauses, covenants, and potential liabilities...'}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {activeTab === 'risks' && (
                  <RisksTab
                    risks={analysis.risks}
                    overallScore={analysis.overallRiskScore}
                    riskAssessment={analysis.riskAssessment}
                    onJumpToPage={handleJumpToPage}
                    onSelectRisk={handleSelectRisk}
                  />
                )}
                {activeTab === 'summary' && <SummaryTab summary={analysis.summary} />}
                {activeTab === 'clauses' && (
                  <ClausesTab
                    clauses={analysis.clauses}
                    onJumpToPage={handleJumpToPage}
                    onSelectClause={handleSelectClause}
                  />
                )}
                {activeTab === 'checklist' && (
                  <ChecklistTab checklist={analysis.checklist} onJumpToPage={handleJumpToPage} />
                )}
                {activeTab === 'chat' && (
                  <ChatTab document={document} onJumpToPage={handleJumpToPage} />
                )}
                {activeTab === 'comparison' && <ComparisonTab />}
                {activeTab === 'export' && (
                  <ExportTab document={document} analysis={analysis} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
