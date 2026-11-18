import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { ChatMessage, DocumentMetadata } from '../../types';
import { askQuestionWithActiveEngine } from '../../services/ai/adapter';
import { getChatMessages, saveChatMessages } from '../../services/storage/indexedDB';

interface ChatTabProps {
  document: DocumentMetadata;
  onJumpToPage: (page: number) => void;
}

export const ChatTab: React.FC<ChatTabProps> = ({ document, onJumpToPage }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested prompt chips based on contract category
  const suggestedPrompts = [
    'What happens if I terminate this contract early?',
    'Is there an automatic renewal or evergreen clause?',
    'What are my exact payment deadlines and late penalties?',
    'What are my indemnification and liability responsibilities?',
    'Is there a non-compete or non-solicitation clause?',
  ];

  // Load chat history from IndexedDB on mount
  useEffect(() => {
    async function loadHistory() {
      const history = await getChatMessages(document.id);
      if (history.length > 0) {
        setMessages(history);
      } else {
        // Welcome message
        const welcome: ChatMessage = {
          id: 'welcome',
          sender: 'assistant',
          timestamp: new Date().toISOString(),
          content: `Hello! I have indexed all **${document.pageCount} pages** of **"${document.title}"** into your local browser memory.\n\nYou can ask me specific questions about your rights, obligations, termination rules, or hidden fees. Every answer I provide is verified against the actual text with exact page citations.`,
          confidence: 'high',
        };
        setMessages([welcome]);
      }
    }
    loadHistory();
  }, [document.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (questionText?: string) => {
    const q = (questionText || inputQuestion).trim();
    if (!q || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toISOString(),
      content: q,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const response = await askQuestionWithActiveEngine(q, document, newMessages);
      const updated = [...newMessages, response];
      setMessages(updated);
      await saveChatMessages(document.id, updated);
    } catch (err: any) {
      console.error('Chat Q&A error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        content: 'An error occurred while evaluating the document locally. Please ensure the document text is loaded.',
        confidence: 'insufficient_evidence',
      };
      setMessages([...newMessages, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between space-y-4 animate-fade-in text-sm">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[520px]">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-midnight-950 dark:bg-slate-800 text-indigo-400 border border-indigo-900/40'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-4 space-y-3 ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-midnight-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-sm'
                }`}
              >
                {/* Confidence Badge */}
                {!isUser && msg.confidence && (
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        msg.confidence === 'high'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200'
                          : msg.confidence === 'medium'
                          ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200'
                          : 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200'
                      }`}
                    >
                      {msg.confidence === 'insufficient_evidence'
                        ? 'Insufficient Evidence'
                        : `${msg.confidence} Confidence`}
                    </span>

                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" /> On-Device Verified
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>

                {/* Citations List */}
                {!isUser && msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Grounded Citations:
                    </span>
                    <div className="space-y-1.5">
                      {msg.citations.map((cite, i) => (
                        <div
                          key={i}
                          onClick={() => onJumpToPage(cite.pageNumber)}
                          className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 cursor-pointer transition-colors text-xs flex items-center justify-between gap-2 group"
                        >
                          <div className="truncate flex-1 font-serif italic text-slate-600 dark:text-slate-300">
                            "{cite.excerpt}"
                          </div>
                          <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-[11px] shrink-0 flex items-center gap-1 group-hover:underline">
                            Page {cite.pageNumber} <ExternalLink className="w-3 h-3" />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-midnight-950 dark:bg-slate-800 text-indigo-400 flex items-center justify-center animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-midnight-950 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
              <span>Scanning document chunks and verifying citations on-device...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      {messages.length <= 2 && (
        <div className="space-y-1.5 pt-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
            Suggested Inquiries:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {suggestedPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-lavender-50 dark:hover:bg-indigo-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[11px] transition-colors text-left"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800"
      >
        <input
          type="text"
          placeholder="Ask a question about this contract (e.g. 'Can I terminate early?')..."
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-midnight-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={isLoading || !inputQuestion.trim()}
          className="p-2.5 rounded-xl bg-midnight-950 dark:bg-indigo-600 hover:bg-slate-900 dark:hover:bg-indigo-500 disabled:opacity-40 text-white transition-all shadow-sm"
          title="Send Question"
          aria-label="Send Question"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
