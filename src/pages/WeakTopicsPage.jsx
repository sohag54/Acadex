import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { LoadingState } from '../components/common/LoadingState';
import { Target, Sparkles, AlertTriangle, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';

export const WeakTopicsPage = () => {
  const [weakTopics, setWeakTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeakTopics = async () => {
      try {
        const res = await apiRequest('/ai/weak-topics');
        setWeakTopics(res.weakTopics || []);
      } catch (err) {
        console.error('Error fetching weak topics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWeakTopics();
  }, []);

  if (loading) {
    return <LoadingState message="Analyzing quiz attempts and accuracy..." />;
  }

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl space-y-2 border border-rose-200 dark:border-rose-900/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-rose-600 text-white shadow-md shadow-rose-500/20">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              AI Weak Topic Analysis
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Automated classification of your quiz attempts and topic accuracy.
            </p>
          </div>
        </div>
      </div>

      {/* Grid or Empty State */}
      {weakTopics.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4 border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No Weak Topics Detected
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
              You haven't attempted any quizzes or practice sets yet. When you solve questions, our AI will automatically evaluate your accuracy and highlight areas needing revision here.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              to="/ai-question-gen"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" /> Start AI Practice Quiz
            </Link>
            <Link
              to="/my-semester"
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" /> View Syllabus
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {weakTopics.map((topic, i) => {
            const isWeak = topic.status === 'Weak';
            const isAverage = topic.status === 'Average';

            return (
              <div
                key={i}
                className={`glass-panel p-6 rounded-3xl border space-y-4 ${
                  isWeak
                    ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/20'
                    : isAverage
                    ? 'border-amber-300 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/20'
                    : 'border-emerald-300 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-slate-900 text-white font-mono">
                    {topic.courseCode}
                  </span>
                  <span
                    className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                      isWeak
                        ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
                        : isAverage
                        ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    {topic.status} • {topic.accuracy}% Accuracy
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {topic.topicTitle}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  <strong>AI Recommendation:</strong> {topic.recommendation}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500">{topic.attempts} Attempted Quizzes</span>
                  <Link
                    to={`/practice?course=${topic.courseCode}&topic=${topic.topicTitle}`}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 flex items-center gap-1.5"
                  >
                    Practice Topic <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
