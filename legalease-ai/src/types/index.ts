export type DocumentCategory = 'rental' | 'employment' | 'service' | 'notice' | 'other';

export interface DocumentPage {
  pageNumber: number;
  text: string;
  charStartIndex: number;
  charEndIndex: number;
}

export interface DocumentChunk {
  id: string;
  pageNumber: number;
  text: string;
  heading?: string;
  startChar: number;
  endChar: number;
}

export interface DocumentMetadata {
  id: string;
  title: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'txt';
  fileSize: number;
  pageCount: number;
  wordCount: number;
  uploadedAt: string;
  category: DocumentCategory;
  isSample?: boolean;
  lastAnalyzedAt?: string;
  rawText: string;
  pages: DocumentPage[];
  chunks: DocumentChunk[];
}

export interface ContractSummary {
  title: string;
  category: DocumentCategory;
  effectiveDate?: string;
  expirationDate?: string;
  governingLaw?: string;
  parties: Array<{
    name: string;
    role: string;
    description?: string;
  }>;
  financials: {
    totalValue?: string;
    paymentSchedule?: string;
    securityDeposit?: string;
    penalties?: string;
    lateFees?: string;
  };
  keyDeadlines: Array<{
    event: string;
    dateOrTimeframe: string;
    importance: 'high' | 'medium' | 'normal';
  }>;
  obligations: Array<{
    party: string;
    obligations: string[];
  }>;
  renewalTerms: {
    hasAutoRenewal: boolean;
    noticePeriodRequired?: string;
    details: string;
  };
  terminationConditions: {
    convenienceNotice?: string;
    forCauseConditions: string[];
    penaltiesOrLiquidatedDamages?: string;
  };
  plainEnglishTakeaway: string;
}

export interface JargonItem {
  term: string;
  definition: string;
}

export interface ExtractedClause {
  id: string;
  title: string;
  category: 'Financial' | 'Termination' | 'Liability' | 'Intellectual Property' | 'Dispute Resolution' | 'Covenants' | 'General';
  rawText: string;
  pageNumber: number;
  plainEnglish: string;
  scenarioExample: string;
  jargonTerms: JargonItem[];
  importance: 'critical' | 'standard' | 'minor';
}

export type RiskSeverity = 'critical' | 'caution' | 'low';

export interface RiskFinding {
  id: string;
  category: 'Ambiguous Wording' | 'Hidden Penalty' | 'Unilateral Right' | 'Automatic Renewal' | 'Uncapped Liability' | 'Missing Protection' | 'Restrictive Covenant';
  severity: RiskSeverity;
  title: string;
  triggerExcerpt: string;
  pageNumber: number;
  plainEnglishMeaning: string;
  legalReasoning: string;
  practicalImpact: string;
  recommendedRevision: string;
  verifiedInDocument: boolean;
}

export interface ChecklistItem {
  id: string;
  title: string;
  category: 'Critical Legal Traps' | 'Financial & Payments' | 'Operational & Duties' | 'Exit & Termination';
  status: 'verified' | 'caution' | 'action_required';
  description: string;
  clauseReference?: string;
  pageNumber?: number;
  actionAdvice: string;
  isCompletedByUser: boolean;
}

export interface Citation {
  excerpt: string;
  pageNumber: number;
  matchConfidence: number;
  verified: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  citations?: Citation[];
  confidence?: 'high' | 'medium' | 'insufficient_evidence';
}

export interface AnalysisReport {
  documentId: string;
  summary: ContractSummary;
  clauses: ExtractedClause[];
  risks: RiskFinding[];
  checklist: ChecklistItem[];
  overallRiskScore: number; // 0 to 100
  riskAssessment: 'Low Risk' | 'Moderate Attention Needed' | 'High Risk Review Recommended' | 'Critical Flaws Detected';
  engineUsed: string;
  timestamp: string;
}

export type EngineType = 'gemma-webgpu' | 'transformers-wasm' | 'desktop-ollama' | 'hybrid-nlp-local';

export interface AIEngineConfig {
  engineType: EngineType;
  isWebGPUSupported: boolean;
  modelStatus: 'unloaded' | 'downloading' | 'ready' | 'error' | 'running';
  downloadProgress?: number;
  errorMessage?: string;
  memoryUsageMB?: number;
  activeModelName: string;
  ollamaEndpoint?: string;
}

export interface BenchmarkComparison {
  clauseName: string;
  category: string;
  currentContractText: string;
  currentRiskLevel: 'Favorable' | 'Standard' | 'Aggressive' | 'Dangerous';
  marketStandardBenchmark: string;
  differenceAnalysis: string;
  suggestedNegotiationAsk: string;
}
