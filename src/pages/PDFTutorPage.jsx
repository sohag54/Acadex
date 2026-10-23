import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { LoadingState } from '../components/common/LoadingState';
import { FileText, Upload, Send, Bot, CheckCircle2, Bookmark, Paperclip, Loader2 } from 'lucide-react';

export const PDFTutorPage = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'pdf-init',
      sender: 'assistant',
      text: "Welcome to **Acadex PDF Tutor (RAG)**!\n\nUpload course syllabi, lecture slides, or revision notes. I will extract and index text chunks to provide precise, cited answers grounded in your uploaded document!"
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [querying, setQuerying] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(true);

  const fetchDocs = async () => {
    try {
      const res = await apiRequest('/pdf/documents');
      setDocuments(res.documents || []);
      if (res.documents?.length > 0 && !selectedDocId) {
        setSelectedDocId(res.documents[0]._id || res.documents[0].id);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await apiRequest('/pdf/upload', {
        method: 'POST',
        body: formData
      });
      await fetchDocs();
      if (res.document) {
        setSelectedDocId(res.document.id);
        setChatMessages(prev => [
          ...prev,
          {
            id: `doc-up-${Date.now()}`,
            sender: 'assistant',
            text: `Indexed **"${res.document.fileName}"** (${res.document.totalPageCount} pages, ${res.document.chunkCount} text chunks). Ask me anything from this file!`
          }
        ]);
      }
    } catch (err) {
      console.error('PDF upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleQueryPDF = async () => {
    if (!inputQuery.trim()) return;

    const userText = inputQuery;
    setChatMessages(prev => [...prev, { id: `u-${Date.now()}`, sender: 'user', text: userText }]);
    setInputQuery('');
    setQuerying(true);

    try {
      const res = await apiRequest('/pdf/chat', {
        method: 'POST',
        body: JSON.stringify({ documentId: selectedDocId, prompt: userText })
      });

      setChatMessages(prev => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: res.reply,
          citations: res.citations
        }
      ]);
    } catch (err) {
      console.error('PDF query error:', err);
    } finally {
      setQuerying(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl space-y-2 border border-cyan-200 dark:border-cyan-900/40">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-600 text-white">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Acadex PDF Tutor (RAG Engine)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Retrieval-Augmented Generation for grounded academic document Q&A.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload & Document Selector Side */}
        <div className="space-y-4">
          
          {/* Upload Card */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 text-center border-dashed border-2 border-slate-300 dark:border-slate-800">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 w-fit mx-auto">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">Upload Course PDF</h3>
              <p className="text-[11px] text-slate-500">Syllabus, lecture notes, or PDF slides (Max 10MB)</p>
            </div>

            <label className="inline-block px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-md cursor-pointer transition-all">
              {uploading ? 'Extracting Text Chunks...' : 'Choose PDF File'}
              <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" disabled={uploading} />
            </label>
          </div>

          {/* Documents List */}
          <div className="glass-panel p-5 rounded-3xl space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Indexed Documents ({documents.length})
            </h3>

            {loadingDocs ? (
              <p className="text-xs text-slate-400">Loading documents...</p>
            ) : documents.length === 0 ? (
              <p className="text-xs text-slate-400 font-medium">No PDFs uploaded yet.</p>
            ) : (
              <div className="space-y-2">
                {documents.map(doc => {
                  const docId = doc._id || doc.id;
                  const isSelected = selectedDocId === docId;

                  return (
                    <div
                      key={docId}
                      onClick={() => setSelectedDocId(docId)}
                      className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-cyan-50 dark:bg-cyan-950/50 border-cyan-500 font-bold text-cyan-900 dark:text-cyan-200'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-cyan-500 shrink-0" />
                        <span className="truncate">{doc.fileName}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 pl-6">
                        {doc.totalPageCount} Pages • {doc.chunkCount || (doc.chunks || []).length} Chunks
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* PDF RAG Chat Panel */}
        <div className="lg:col-span-2 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col h-[520px] overflow-hidden">
          
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyan-500" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">Grounded PDF Q&A Session</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 font-mono font-bold">
              RAG Active
            </span>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {chatMessages.map(msg => (
              <div
                key={msg.id}
                className={`p-4 rounded-2xl text-xs leading-relaxed max-w-xl ${
                  msg.sender === 'user'
                    ? 'ml-auto bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none font-sans'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                {msg.citations && (
                  <div className="mt-2 text-[10px] font-bold text-cyan-400 font-mono pt-1 border-t border-slate-800">
                    Citations: {msg.citations}
                  </div>
                )}
              </div>
            ))}

            {querying && (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs text-slate-400 flex items-center gap-2 animate-pulse w-fit">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-500" /> Retrieving context & generating answer...
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleQueryPDF();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask a question grounded in your uploaded PDF document..."
                className="flex-1 px-4 py-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              <button
                type="submit"
                disabled={querying || !inputQuery.trim()}
                className="p-3 rounded-xl bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
