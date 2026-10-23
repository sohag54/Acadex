import React, { useState, useRef, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { Bot, Send, User, Sparkles, MessageSquare, Plus, Loader2, Zap } from 'lucide-react';

export const AcadexAIPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'assistant',
      text: "Hello! I am **Acadex AI**, your personal academic study assistant. How can I help you master your semester today?\n\nYou can ask me to explain difficult engineering concepts, analyze your weak topics, or create targeted study schedules!"
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    'Explain recursion simply',
    'Give me 5 practice questions on Data Structures',
    'Create a study plan for my exam',
    'What are my weak topics?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputPrompt;
    if (!query.trim()) return;

    const userMsg = { id: `u-${Date.now()}`, sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      const res = await apiRequest('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ prompt: query, history: messages })
      });
      const aiMsg = { id: `a-${Date.now()}`, sender: 'assistant', text: res.reply };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { id: `err-${Date.now()}`, sender: 'assistant', text: 'I encountered an error processing your prompt. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex gap-6">
      
      {/* Left History & Shortcuts Panel */}
      <div className="hidden md:flex flex-col w-72 shrink-0 glass-panel rounded-3xl p-4 border border-slate-200 dark:border-slate-800 space-y-4">
        <button
          onClick={() => setMessages([{ id: `new-${Date.now()}`, sender: 'assistant', text: 'New chat session started! What concept shall we tackle?' }])}
          className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-md flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> New AI Session
        </button>

        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">
            Suggested Prompts
          </span>
          <div className="space-y-1.5">
            {suggestedPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-2"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">{prompt}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="flex-1 flex flex-col glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Acadex AI Study Assistant</h2>
              <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                ● Online & Ready
              </span>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none font-sans'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-xs font-semibold text-slate-500 animate-pulse">
                Acadex AI is formulating response...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Bar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask Acadex AI to explain a concept or generate practice..."
              className="flex-1 px-4 py-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <button
              type="submit"
              disabled={loading || !inputPrompt.trim()}
              className="p-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
