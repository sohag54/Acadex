import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { LoadingState } from '../components/common/LoadingState';
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  XCircle,
  BrainCircuit,
  Sparkles,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export const PracticePage = () => {
  const [searchParams] = useSearchParams();
  const courseParam = searchParams.get('course') || 'CSE-301';
  const topicParam = searchParams.get('topic') || '';

  const [questionType, setQuestionType] = useState('mcq'); // 'mcq' | 'short' | 'long'
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [studentTextAnswer, setStudentTextAnswer] = useState('');
  const [aiEvaluation, setAiEvaluation] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(0);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`/questions?courseCode=${courseParam}&type=${questionType}`);
      setQuestions(res.questions || []);
      setCurrentIndex(0);
      setSelectedOption('');
      setIsAnswerSubmitted(false);
      setStudentTextAnswer('');
      setAiEvaluation(null);
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [courseParam, questionType]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentQ = questions[currentIndex];

  const handleEvaluateAI = async () => {
    if (!studentTextAnswer.trim()) return;
    setEvaluating(true);
    try {
      const res = await apiRequest('/ai/evaluate-answer', {
        method: 'POST',
        body: JSON.stringify({
          courseCode: courseParam,
          questionText: currentQ?.questionText,
          studentAnswer: studentTextAnswer,
          modelAnswer: currentQ?.modelAnswer
        })
      });
      setAiEvaluation(res.evaluation);
    } catch (err) {
      console.error('AI evaluation error:', err);
    } finally {
      setEvaluating(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading practice set..." />;
  }

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-6 rounded-3xl">
        <div>
          <span className="text-xs font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider font-mono">
            {courseParam} {topicParam ? `• ${topicParam}` : ''}
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Topic Practice Engine
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Question Type Switcher */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            {['mcq', 'short', 'long'].map((t) => (
              <button
                key={t}
                onClick={() => setQuestionType(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                  questionType === t
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
            <Clock className="w-4 h-4 text-indigo-500" /> {formatTime(timerSeconds)}
          </div>
        </div>
      </div>

      {!currentQ ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No questions found for this topic filter</h3>
          <p className="text-xs text-slate-500">Try generating custom questions with the AI Question Generator!</p>
          <button onClick={fetchQuestions} className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs">
            Reload Questions
          </button>
        </div>
      ) : (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span className="uppercase px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {currentQ.difficulty || 'medium'}
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentQ.questionText}
          </h2>

          {/* MCQ Options */}
          {questionType === 'mcq' && (
            <div className="space-y-3">
              {(currentQ.options || []).map((opt, i) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt === currentQ.correctAnswer;
                let optStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white hover:border-indigo-500/50';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold';
                  } else if (isSelected && !isCorrect) {
                    optStyle = 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300 font-bold';
                  }
                } else if (isSelected) {
                  optStyle = 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 font-bold';
                }

                return (
                  <button
                    key={i}
                    disabled={isAnswerSubmitted}
                    onClick={() => setSelectedOption(opt)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs transition-all flex items-center justify-between ${optStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswerSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                    {isAnswerSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                  </button>
                );
              })}

              {!isAnswerSubmitted ? (
                <button
                  disabled={!selectedOption}
                  onClick={() => setIsAnswerSubmitted(true)}
                  className="w-full mt-4 py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 disabled:opacity-50 transition-all"
                >
                  Submit Answer
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 space-y-2 mt-4 text-xs">
                  <h4 className="font-bold text-indigo-700 dark:text-indigo-300">Explanation & Concept Note:</h4>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* Short / Long Answer Editors with AI Evaluation */}
          {(questionType === 'short' || questionType === 'long') && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Write Your Answer:
                </label>
                <textarea
                  rows={questionType === 'long' ? 8 : 4}
                  value={studentTextAnswer}
                  onChange={(e) => setStudentTextAnswer(e.target.value)}
                  placeholder="Type your structured answer here..."
                  className="w-full p-4 text-xs rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <button
                onClick={handleEvaluateAI}
                disabled={evaluating || !studentTextAnswer.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-xs hover:opacity-90 shadow-md flex items-center justify-center gap-2"
              >
                <BrainCircuit className="w-4 h-4 text-cyan-300" />
                {evaluating ? 'Acadex AI Evaluating Answer...' : 'Evaluate Answer with Acadex AI'}
              </button>

              {/* AI Evaluation Display Modal / Card */}
              {aiEvaluation && (
                <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 border border-indigo-500/50 shadow-2xl animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" /> Acadex AI Evaluation Result
                    </span>
                    <span className="text-base font-extrabold px-3 py-1 rounded-xl bg-indigo-600 text-white font-mono">
                      Score: {aiEvaluation.score} / {aiEvaluation.maxScore}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 space-y-1">
                      <span className="font-bold text-emerald-400 block">Strengths:</span>
                      <ul className="list-disc pl-4 space-y-1 text-slate-300">
                        {aiEvaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 space-y-1">
                      <span className="font-bold text-rose-400 block">Missing Points:</span>
                      <ul className="list-disc pl-4 space-y-1 text-slate-300">
                        {aiEvaluation.missingPoints.map((m, i) => <li key={i}>{m}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs space-y-2">
                    <span className="font-bold text-amber-400 block">Model Answer:</span>
                    <p className="text-slate-200 leading-relaxed font-mono">{aiEvaluation.modelAnswer}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              disabled={currentIndex === 0}
              onClick={() => {
                setCurrentIndex(prev => prev - 1);
                setSelectedOption('');
                setIsAnswerSubmitted(false);
                setStudentTextAnswer('');
                setAiEvaluation(null);
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs disabled:opacity-50"
            >
              Previous
            </button>

            <button
              disabled={currentIndex === questions.length - 1}
              onClick={() => {
                setCurrentIndex(prev => prev + 1);
                setSelectedOption('');
                setIsAnswerSubmitted(false);
                setStudentTextAnswer('');
                setAiEvaluation(null);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1.5"
            >
              Next Question <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
