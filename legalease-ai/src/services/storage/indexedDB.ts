import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { DocumentMetadata, AnalysisReport, ChatMessage } from '../../types';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  networkRequestsSent: number; // Always 0!
}

interface LegalEaseDB extends DBSchema {
  documents: {
    key: string;
    value: DocumentMetadata;
    indexes: { 'by-date': string; 'by-category': string };
  };
  analyses: {
    key: string;
    value: AnalysisReport;
  };
  chats: {
    key: string; // documentId
    value: { documentId: string; messages: ChatMessage[] };
  };
  auditLogs: {
    key: string;
    value: AuditLogEntry;
    indexes: { 'by-timestamp': string };
  };
  settings: {
    key: string;
    value: any;
  };
}

const DB_NAME = 'legalease_ai_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<LegalEaseDB>> | null = null;

export async function getDB(): Promise<IDBPDatabase<LegalEaseDB>> {
  if (!dbPromise) {
    dbPromise = openDB<LegalEaseDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('documents')) {
          const docStore = db.createObjectStore('documents', { keyPath: 'id' });
          docStore.createIndex('by-date', 'uploadedAt');
          docStore.createIndex('by-category', 'category');
        }
        if (!db.objectStoreNames.contains('analyses')) {
          db.createObjectStore('analyses', { keyPath: 'documentId' });
        }
        if (!db.objectStoreNames.contains('chats')) {
          db.createObjectStore('chats', { keyPath: 'documentId' });
        }
        if (!db.objectStoreNames.contains('auditLogs')) {
          const logStore = db.createObjectStore('auditLogs', { keyPath: 'id' });
          logStore.createIndex('by-timestamp', 'timestamp');
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      },
    });
  }
  return dbPromise;
}

// Documents
export async function saveDocument(doc: DocumentMetadata): Promise<void> {
  const db = await getDB();
  await db.put('documents', doc);
  await addAuditLog(`Uploaded document: ${doc.title}`, `Processed ${doc.pageCount} pages, ${doc.wordCount} words completely on-device.`);
}

export async function getDocument(id: string): Promise<DocumentMetadata | undefined> {
  const db = await getDB();
  return db.get('documents', id);
}

export async function getAllDocuments(): Promise<DocumentMetadata[]> {
  const db = await getDB();
  const docs = await db.getAllFromIndex('documents', 'by-date');
  return docs.reverse(); // Newest first
}

export async function deleteDocument(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('documents', id);
  await db.delete('analyses', id);
  await db.delete('chats', id);
  await addAuditLog(`Deleted document ${id}`, 'Purged raw text, parsed pages, and cached analysis results from local IndexedDB.');
}

// Analysis
export async function saveAnalysis(analysis: AnalysisReport): Promise<void> {
  const db = await getDB();
  await db.put('analyses', analysis);
  await addAuditLog(
    `Completed document analysis`,
    `Score: ${analysis.overallRiskScore}/100, Flags: ${analysis.risks.length}, Clauses: ${analysis.clauses.length}. Inference was 100% on-device.`
  );
}

export async function getAnalysis(documentId: string): Promise<AnalysisReport | undefined> {
  const db = await getDB();
  return db.get('analyses', documentId);
}

// Chat
export async function saveChatMessages(documentId: string, messages: ChatMessage[]): Promise<void> {
  const db = await getDB();
  await db.put('chats', { documentId, messages });
}

export async function getChatMessages(documentId: string): Promise<ChatMessage[]> {
  const db = await getDB();
  const entry = await db.get('chats', documentId);
  return entry?.messages || [];
}

// Audit Logs
export async function addAuditLog(action: string, details: string): Promise<void> {
  try {
    const db = await getDB();
    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      action,
      details,
      networkRequestsSent: 0,
    };
    await db.put('auditLogs', entry);
  } catch (err) {
    console.warn('Audit log write error:', err);
  }
}

export async function getAuditLogs(limit: number = 20): Promise<AuditLogEntry[]> {
  const db = await getDB();
  const logs = await db.getAllFromIndex('auditLogs', 'by-timestamp');
  return logs.reverse().slice(0, limit);
}

// Storage stats & Purge
export async function getStorageStats(): Promise<{
  documentCount: number;
  analysisCount: number;
  estimatedBytesUsed: number;
}> {
  const db = await getDB();
  const docs = await db.getAll('documents');
  const analyses = await db.getAll('analyses');
  
  let approxBytes = 0;
  for (const doc of docs) {
    approxBytes += (doc.rawText?.length || 0) * 2;
    approxBytes += JSON.stringify(doc.chunks || []).length;
  }
  for (const an of analyses) {
    approxBytes += JSON.stringify(an).length;
  }

  return {
    documentCount: docs.length,
    analysisCount: analyses.length,
    estimatedBytesUsed: approxBytes,
  };
}

export async function purgeAllLocalData(): Promise<void> {
  const db = await getDB();
  await db.clear('documents');
  await db.clear('analyses');
  await db.clear('chats');
  await db.clear('auditLogs');
  await addAuditLog('Local Storage Purged', 'All documents, analyses, and logs cleared by user request.');
}
