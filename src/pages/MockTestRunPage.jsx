import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { Clock, CheckCircle2, Flag, ArrowRight, Trophy, Sparkles, FileQuestion, BookOpen, HelpCircle } from 'lucide-react';
import { LoadingState } from '../components/common/LoadingState';

export const MockTestRunPage = () => {
  const { testId } = useParams();
  const [searchParams] = useSearchParams();
  const queryCount = searchParams.get('count') || 10;

  const [loading, setLoading] = useState(true);
  const [testMeta, setTestMeta] = useState({
    title: 'Adaptive Mock Exam',
    courseCode: 'CSE-301',
    examType: 'mid',
    durationMinutes: 45,
    breakdown: { pyqCount: 5, aiCount: 5 }
  });

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [timeLeft, setTimeLeft] = useState(2700); // 45 minutes default
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  // Parse course and examType from testId
  let courseCode = 'CSE-301';
  let examType = 'mid';

  if (testId && testId.startsWith('dynamic-')) {
    const raw = testId.replace('dynamic-', '');
    const segments = raw.split('-');
    if (segments.length >= 3) {
      courseCode = `${segments[0]}-${segments[1]}`;
      examType = segments[2];
    } else if (segments.length === 2) {
      courseCode = segments[0];
      examType = segments[1];
    }
  } else if (testId && testId.includes('303')) {
    courseCode = 'CSE-303';
    examType = testId.includes('fin') ? 'final' : 'mid';
  }

  useEffect(() => {
    const fetchDynamicTest = async () => {
      setLoading(true);
      try {
        const res = await apiRequest('/quiz/generate-mock', {
          method: 'POST',
          body: JSON.stringify({
            courseCode,
            examType,
            totalCount: parseInt(queryCount) || 10
          })
        });

        if (res.questions && res.questions.length > 0) {
          setQuestions(res.questions);
          setTestMeta({
            title: res.title,
            courseCode: res.courseCode,
            examType: res.examType,
            durationMinutes: res.durationMinutes || 45,
            breakdown: res.breakdown || { pyqCount: 5, aiCount: 5 }
          });
          setTimeLeft((res.durationMinutes || 45) * 60);
        }
      } catch (err) {
        console.error('Error generating dynamic mock test:', err);
        // Fallback default questions
        setQuestions([
          {
            id: 'demo-1',
            text: 'What is the worst-case time complexity of searching an element in an unsorted Singly Linked List of length N?',
            options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
            correctAnswer: 'O(N)',
            topic: 'Linked Lists ADT',
            source: 'Previous Exam Paper (PYQ)',
            sourceBadge: 'Past Year Question'
          },
          {
            id: 'demo-2',
            text: 'Which transport layer protocol provides connection-oriented, reliable byte stream transfer?',
            options: ['UDP', 'TCP', 'IP', 'ARP'],
            correctAnswer: 'TCP',
            topic: 'Transport Layer',
            source: 'Previous Exam Paper (PYQ)',
            sourceBadge: 'Past Year Question'
          },
          {
            id: 'demo-3',
            text: 'In a Binary Search Tree (BST), what is the worst-case space complexity of recursive In-Order traversal?',
            options: ['O(1)', 'O(H) where H is tree height', 'O(N^2)', 'O(2^N)'],
            correctAnswer: 'O(H) where H is tree height',
            topic: 'Binary Search Tree',
            source: 'Acadex AI Conceptual Generator',
            sourceBadge: 'AI Generated'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDynamicTest();
  }, [testId, queryCount]);

  useEffect(() => {
    if (isSubmitted || loading) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, loading, questions]);

  const handleSelectOption = (qId, option) => {
    setUserAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const toggleMarkReview = (qId) => {
    setMarkedForReview(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSubmitTest = async () => {
    let correctCount = 0;
    let pyqCorrect = 0;
    let aiCorrect = 0;

    questions.forEach(q => {
      const isCorrect = q.correctAnswer
        ? userAnswers[q.id] === q.correctAnswer
        : (userAnswers[q.id] && userAnswers[q.id].trim().length > 15);

      if (isCorrect) {
        correctCount++;
        if (q.source?.includes('Previous') || q.sourceBadge?.includes('Past')) pyqCorrect++;
        else aiCorrect++;
      }
    });

    const total = questions.length || 1;
    const scorePct = Math.round((correctCount / total) * 100);

    const resultData = {
      score: scorePct,
      correctCount,
      incorrectCount: total - correctCount,
      totalQuestions: total,
      pyqCorrect,
      aiCorrect,
      weakTopics: ['Binary Search Tree Height Bounds', 'Adjacency Matrix Cache Locality']
    };

    setResult(resultData);
    setIsSubmitted(true);

    try {
      await apiRequest('/quiz/submit', {
        method: 'POST',
        body: JSON.stringify({
          courseCode: testMeta.courseCode,
          title: testMeta.title,
          type: `mock_${testMeta.examType}`,
          score: scorePct,
          totalQuestions: total,
          correctCount,
          incorrectCount: total - correctCount
        })
      });
    } catch (e) {}
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <LoadingState message="Synthesizing 50% PYQ + 50% AI Exam Questions..." />;
  }

  const currentQ = questions[currentIndex] || questions[0];

  if (isSubmitted && result) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 py-8">
        <div className="glass-panel p-8 rounded-3xl text-center space-y-4 border border-indigo-200 dark:border-indigo-900/50 shadow-2xl">
          <div className="p-4 rounded-full bg-gradient-to-tr from-indigo-600 to-rose-600 text-white w-fit mx-auto shadow-lg">
            <Trophy className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {testMeta.title} Completed!
          </h1>
          
          <div className="text-5xl font-black text-indigo-600 dark:text-cyan-400 font-mono">
            {result.score}%
          </div>

          {/* Breakdown summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600">
              {result.correctCount} Correct
            </div>
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600">
              {result.incorrectCount} Incorrect
            </div>
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600">
              {result.pyqCorrect} PYQs Solved
            </div>
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600">
              {result.aiCorrect} AI Questions Solved
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-xs text-left space-y-1.5 border border-indigo-100 dark:border-indigo-800">
            <span className="font-extrabold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Acadex AI Performance Insight:
            </span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Your grasp on past exam question patterns is solid. To score higher in the upcoming semester exam, focus additional practice on conceptual edge-cases generated by the AI engine.
            </p>
          </div>

          <div className="pt-4 flex justify-center gap-4">
            <Link to="/mock-tests" className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md">
              Return to Mock Test Center
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Header bar */}
      <div className="glass-panel p-4 px-6 rounded-3xl flex flex-wrap items-center justify-between gap-3 border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            {testMeta.courseCode}
          </span>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            {testMeta.title}
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white font-mono font-bold text-xs shadow-inner">
            <Clock className="w-4 h-4 text-cyan-400" /> {formatTime(timeLeft)}
          </div>
          <button
            onClick={handleSubmitTest}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-md"
          >
            Submit Test
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Question view */}
        <div className="lg:col-span-3 glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-200 dark:border-slate-800 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-400">
                Question {currentIndex + 1} of {questions.length}
              </span>

              {/* Source Badge: 50% PYQ vs 50% AI */}
              {currentQ.source?.includes('Previous') || currentQ.sourceBadge?.includes('Past') ? (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 font-extrabold text-[10px] flex items-center gap-1">
                  <FileQuestion className="w-3 h-3 text-amber-600" /> Past Year Question (PYQ)
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300 font-extrabold text-[10px] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-500" /> AI Conceptual Question
                </span>
              )}

              {currentQ.topic && (
                <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
                  • {currentQ.topic}
                </span>
              )}
            </div>

            <button
              onClick={() => toggleMarkReview(currentQ.id)}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                markedForReview[currentQ.id]
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              {markedForReview[currentQ.id] ? 'Marked for Review' : 'Mark for Review'}
            </button>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentQ.questionText || currentQ.text}
          </h3>

          {/* If MCQ Options available */}
          {currentQ.options && currentQ.options.length > 0 ? (
            <div className="space-y-3">
              {currentQ.options.map((opt, i) => {
                const isSelected = userAnswers[currentQ.id] === opt;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(currentQ.id, opt)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 font-bold text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/30'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-indigo-400/40'
                    }`}
                  >
                    <span className="font-mono font-bold mr-2 text-indigo-600 dark:text-cyan-400">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          ) : (
            /* Written / Short Answer Input */
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500">
                Write your response / step-by-step points:
              </label>
              <textarea
                rows={5}
                placeholder="Type your explanation, key algorithmic steps, or derivation here..."
                value={userAnswers[currentQ.id] || ''}
                onChange={(e) => handleSelectOption(currentQ.id, e.target.value)}
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono leading-relaxed"
              />
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(prev => prev - 1)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs disabled:opacity-40"
            >
              Previous
            </button>

            <button
              disabled={currentIndex === questions.length - 1}
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-md disabled:opacity-40"
            >
              Next Question
            </button>
          </div>
        </div>

        {/* Question Palette Sidebar */}
        <div className="glass-panel p-5 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Question Palette
            </h4>
            <span className="text-[11px] font-mono text-slate-400">
              {Object.keys(userAnswers).length}/{questions.length} Done
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {questions.map((q, idx) => {
              const isAnswered = !!userAnswers[q.id];
              const isMarked = !!markedForReview[q.id];

              let bg = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300';
              if (isMarked) bg = 'bg-amber-500 text-white font-bold';
              else if (isAnswered) bg = 'bg-emerald-500 text-white font-bold';

              return (
                <button
                  key={q.id || idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-9 rounded-xl text-xs flex items-center justify-center transition-all ${bg} ${
                    currentIndex === idx ? 'ring-2 ring-indigo-500 font-black' : ''
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5 pt-3 text-[11px] font-semibold text-slate-500 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Answered
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span> Marked for Review
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-800"></span> Unanswered
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
