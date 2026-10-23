import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { Sparkles, BrainCircuit, CheckCircle2, ArrowRight, RefreshCw, Bookmark, AlertCircle, PlusCircle } from 'lucide-react';

export const AIQuestionGenPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [formData, setFormData] = useState({
    courseCode: '',
    examType: 'mid',
    topicTitle: '',
    questionType: 'mcq',
    difficulty: 'medium',
    count: 3
  });

  const [availableTopics, setAvailableTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Fetch only courses added by admin
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await apiRequest('/courses');
        const list = res.courses || [];
        setCourses(list);
        if (list.length > 0) {
          setFormData(prev => ({
            ...prev,
            courseCode: list[0].code
          }));
        }
      } catch (err) {
        console.error('Error loading courses for AI Question Gen:', err);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  // 2. Fetch topics when selected course or examType changes
  useEffect(() => {
    if (!formData.courseCode) return;

    const fetchTopics = async () => {
      setLoadingTopics(true);
      try {
        const res = await apiRequest(`/syllabus/${formData.courseCode}?examType=${formData.examType}`);
        const topics = [];
        (res.modules || []).forEach(m => {
          (m.topics || []).forEach(t => topics.push(t.title));
        });
        setAvailableTopics(topics);
        if (topics.length > 0 && !formData.topicTitle) {
          setFormData(prev => ({ ...prev, topicTitle: topics[0] }));
        }
      } catch (err) {
        setAvailableTopics([]);
      } finally {
        setLoadingTopics(false);
      }
    };

    fetchTopics();
  }, [formData.courseCode, formData.examType]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.courseCode) {
      setErrorMessage('Please select a course to generate questions.');
      return;
    }
    setErrorMessage('');
    setGenerating(true);
    try {
      const res = await apiRequest('/questions/generate', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setGeneratedQuestions(res.questions || []);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to generate questions.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl space-y-2 border border-indigo-200 dark:border-indigo-900/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              AI Question Generator
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Instantly generate targeted academic questions, model answers, and explanations for your courses.
            </p>
          </div>
        </div>
      </div>

      {/* Notice if no courses added by admin */}
      {!loadingCourses && courses.length === 0 && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
            <span>
              <strong>No courses added yet.</strong> Only courses created by the admin appear in this list. Please create courses in the Admin Portal first.
            </span>
          </div>
          <Link
            to="/admin/courses"
            className="px-3 py-1.5 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Add Course in Admin
          </Link>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-medium">
          {errorMessage}
        </div>
      )}

      {/* Generator Controls Form */}
      <form onSubmit={handleGenerate} className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Course
            </label>
            <select
              value={formData.courseCode}
              disabled={courses.length === 0}
              onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-60"
            >
              {courses.length === 0 ? (
                <option value="">No courses available</option>
              ) : (
                courses.map(c => (
                  <option key={c._id || c.code} value={c.code}>
                    {c.code} — {c.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Exam Type
            </label>
            <select
              value={formData.examType}
              onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="mid">Mid Exam Syllabus</option>
              <option value="final">Final Exam Syllabus</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Question Type
            </label>
            <select
              value={formData.questionType}
              onChange={(e) => setFormData({ ...formData, questionType: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="mcq">Multiple Choice (MCQ)</option>
              <option value="short">Short Answer Question</option>
              <option value="long">Long Essay Question</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Topic Title
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={formData.topicTitle}
                onChange={(e) => setFormData({ ...formData, topicTitle: e.target.value })}
                placeholder="e.g. Graph Dijkstra Shortest Path"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              {availableTopics.length > 0 && (
                <select
                  onChange={(e) => {
                    if (e.target.value) setFormData({ ...formData, topicTitle: e.target.value });
                  }}
                  className="px-2 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 max-w-[140px]"
                >
                  <option value="">Pick Syllabus Topic</option>
                  {availableTopics.map((top, i) => (
                    <option key={i} value={top}>{top}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Difficulty & Count
            </label>
            <div className="flex gap-2">
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-1/2 px-2 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <select
                value={formData.count}
                onChange={(e) => setFormData({ ...formData, count: e.target.value })}
                className="w-1/2 px-2 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              >
                <option value={1}>1 Question</option>
                <option value={3}>3 Questions</option>
                <option value={5}>5 Questions</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={generating || courses.length === 0}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-xs hover:opacity-95 shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-cyan-300" />}
          {generating ? 'AI Generating Questions...' : 'Generate Questions Now'}
        </button>
      </form>

      {/* Output Generated Questions List */}
      {generatedQuestions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Generated Questions ({generatedQuestions.length})
            </h3>
            <button
              onClick={() => navigate(`/practice?course=${formData.courseCode}`)}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Start Practice Session <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {generatedQuestions.map((q, idx) => (
            <div key={q.id || idx} className="glass-panel p-6 rounded-3xl space-y-4 border border-indigo-200/60 dark:border-indigo-900/40">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span>Question {idx + 1}</span>
                <span className="uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {q.type} • {q.difficulty}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{q.questionText}</h4>

              {q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, i) => (
                    <div key={i} className={`p-2.5 rounded-xl border ${opt === q.correctAnswer ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-700 dark:text-emerald-300 font-semibold' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
                      {opt}
                    </div>
                  ))}
                </div>
              )}

              {q.explanation && (
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
                  <span className="font-bold block">AI Explanation:</span>
                  <p>{q.explanation}</p>
                </div>
              )}

              {q.modelAnswer && (
                <div className="p-3 rounded-xl bg-slate-900 text-slate-200 text-xs space-y-1 font-mono">
                  <span className="font-bold text-emerald-400 block">Model Answer:</span>
                  <p>{q.modelAnswer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
