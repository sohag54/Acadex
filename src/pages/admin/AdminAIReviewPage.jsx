import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { LoadingState } from '../../components/common/LoadingState';
import { Sparkles, Check, X, Edit3 } from 'lucide-react';

export const AdminAIReviewPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    try {
      const res = await apiRequest('/questions?limit=20');
      setQuestions(res.questions || []);
    } catch (err) {
      console.error('Error fetching questions for review:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await apiRequest(`/admin/questions/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      fetchQuestions();
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  if (loading) return <LoadingState message="Loading AI content drafts for faculty review..." />;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl space-y-2 border border-rose-200 dark:border-rose-900/40">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-rose-500" /> AI Content Review & Approval Workflow
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Faculty oversight tool for approving, editing, or rejecting AI-generated exam questions.
        </p>
      </div>

      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q._id || q.id} className="glass-panel p-6 rounded-3xl space-y-3 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="font-mono text-indigo-600">{q.courseCode} • {q.examType.toUpperCase()} SYLLABUS</span>
              <span className={`px-2.5 py-0.5 rounded font-extrabold uppercase ${
                q.status === 'approved'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {q.status || 'approved'}
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">{q.questionText}</h3>

            {q.options && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {q.options.map((opt, i) => (
                  <div key={i} className={`p-2 rounded-xl border ${opt === q.correctAnswer ? 'bg-emerald-500/10 border-emerald-500 font-bold text-emerald-700 dark:text-emerald-300' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
                    {opt}
                  </div>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Created by: {q.createdBy || 'AI Generator'}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateStatus(q._id || q.id, 'approved')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus(q._id || q.id, 'rejected')}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
