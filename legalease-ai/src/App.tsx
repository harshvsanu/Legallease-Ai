import React, { useState, useEffect } from 'react';
import { DisclaimerBanner } from './components/layout/DisclaimerBanner';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { DocumentWorkspace } from './components/workspace/DocumentWorkspace';
import { PrivacyCenter } from './components/privacy/PrivacyCenter';
import { UploadModal } from './components/dashboard/UploadModal';
import { AIEngineConfig, DocumentMetadata } from './types';
import { SAMPLE_CONTRACTS } from './data/sampleContracts';
import {
  getAllDocuments,
  saveDocument,
  deleteDocument,
  getStorageStats,
} from './services/storage/indexedDB';
import { getEngineConfig } from './services/ai/adapter';

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'landing' | 'dashboard' | 'workspace' | 'privacy'>('landing');
  const [documents, setDocuments] = useState<DocumentMetadata[]>(SAMPLE_CONTRACTS);
  const [selectedDocument, setSelectedDocument] = useState<DocumentMetadata | null>(SAMPLE_CONTRACTS[0]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [engineConfig, setEngineConfig] = useState<AIEngineConfig>(getEngineConfig());
  const [storageStats, setStorageStats] = useState({
    documentCount: 3,
    analysisCount: 0,
    estimatedBytesUsed: 140000,
  });

  // Dark Mode handling
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('legalease_theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('legalease_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('legalease_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Load documents from IndexedDB
  const refreshDocuments = async () => {
    try {
      const dbDocs = await getAllDocuments();
      if (dbDocs.length > 0) {
        // Merge with samples if not already present
        const combined = [...dbDocs];
        for (const sample of SAMPLE_CONTRACTS) {
          if (!combined.some((d) => d.id === sample.id)) {
            combined.push(sample);
          }
        }
        setDocuments(combined);
      } else {
        // First run: save samples to db
        for (const sample of SAMPLE_CONTRACTS) {
          await saveDocument(sample);
        }
        setDocuments(SAMPLE_CONTRACTS);
      }

      const stats = await getStorageStats();
      setStorageStats(stats);
    } catch (e) {
      console.warn('IndexedDB initial load note:', e);
      setDocuments(SAMPLE_CONTRACTS);
    }
  };

  useEffect(() => {
    refreshDocuments();
  }, []);

  const handleOpenDocument = (doc: DocumentMetadata) => {
    setSelectedDocument(doc);
    setActiveView('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteDocument = async (id: string) => {
    await deleteDocument(id);
    await refreshDocuments();
    if (selectedDocument?.id === id) {
      setSelectedDocument(SAMPLE_CONTRACTS[0]);
    }
  };

  const handleDocumentReady = async (doc: DocumentMetadata) => {
    await saveDocument(doc);
    await refreshDocuments();
    setIsUploadOpen(false);
    setSelectedDocument(doc);
    setActiveView('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSample = (sample: DocumentMetadata) => {
    setSelectedDocument(sample);
    setActiveView('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas-light text-slate-900 dark:bg-canvas-dark dark:text-slate-100 transition-colors">
      {/* Informational Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Main Navbar */}
      <Navbar
        activeView={activeView}
        onNavigate={setActiveView}
        engineConfig={engineConfig}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'landing' && (
          <LandingPage
            onStartAnalysis={() => setIsUploadOpen(true)}
            onOpenSample={handleOpenSample}
          />
        )}

        {activeView === 'dashboard' && (
          <DashboardPage
            documents={documents}
            engineConfig={engineConfig}
            storageStats={storageStats}
            onOpenDocument={handleOpenDocument}
            onDeleteDocument={handleDeleteDocument}
            onOpenUpload={() => setIsUploadOpen(true)}
            onNavigatePrivacy={() => setActiveView('privacy')}
          />
        )}

        {activeView === 'workspace' && selectedDocument && (
          <DocumentWorkspace
            document={selectedDocument}
            onBackToDashboard={() => setActiveView('dashboard')}
          />
        )}

        {activeView === 'privacy' && (
          <PrivacyCenter
            engineConfig={engineConfig}
            onEngineChange={setEngineConfig}
            onRefreshStorage={refreshDocuments}
          />
        )}
      </main>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDocumentReady={handleDocumentReady}
      />

      {/* Footer */}
      <Footer onNavigate={setActiveView} />
    </div>
  );
};

export default App;
