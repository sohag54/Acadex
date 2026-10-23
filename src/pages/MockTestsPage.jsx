import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { GraduationCap, Clock, Award, ArrowRight, Sparkles, FileQuestion, BookOpen, Layers } from 'lucide-react';

export const MockTestsPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('CSE-301');
  const [selectedExamType, setSelectedExamType] = useState('mid');
  const [questionCount, setQuestionCount] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await apiRequest('/courses');
        const list = res.courses || [];
        setCourses(list);
        if (list.length > 0) {
          setSelectedCourse(list[0].code);
        }
      } catch (err) {
        console.error('Error loading courses for mock tests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleStartDynamicTest = () => {
    navigate(`/mock-tests/dynamic-${selectedCourse}-${selectedExamType}?count=${questionCount}`);
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      
      {/* Page Title */}
      <div className="glass-panel p-6 rounded-3xl space-y-2">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-500" /> Mid & Final Exam Mock Tests
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Simulate official university exam conditions with adaptive 50% past year questions + 50% AI conceptual questions.
        </p>
      </div>

      {/* 50-50 Adaptive Intelligent Mock Test Generator Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/90 via-slate-900 to-rose-950/90 text-white border border-indigo-500/40 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              Dynamic 50-50 Intelligent Exam Engine
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Adaptive Mock Exam Generator
            </h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Synthesizes real university past year questions with AI-generated conceptual questions for authentic exam readiness.
            </p>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-900/90 border border-slate-700/60 text-xs shadow-inner">
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 font-extrabold flex items-center gap-1.5">
              <FileQuestion className="w-3.5 h-3.5" /> 50% Past Questions (PYQ)
            </div>
            <span className="text-slate-500 font-extrabold">+</span>
            <div className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 font-extrabold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 50% AI Generated
            </div>
          </div>
        </div>

        {/* Configuration Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Select Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white font-bold text-xs focus:ring-2 focus:ring-indigo-500"
            >
              {courses.length === 0 ? (
                <option value="CSE-301">CSE-301 — Data Structures</option>
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
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Exam Target</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedExamType('mid')}
                className={`py-2 px-3 rounded-xl font-extrabold text-xs transition-all ${
                  selectedExamType === 'mid'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 ring-1 ring-white/20'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                Mid Exam (45m)
              </button>
              <button
                type="button"
                onClick={() => setSelectedExamType('final')}
                className={`py-2 px-3 rounded-xl font-extrabold text-xs transition-all ${
                  selectedExamType === 'final'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40 ring-1 ring-white/20'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                Final Exam (60m)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Questions Ratio</label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white font-bold text-xs focus:ring-2 focus:ring-indigo-500"
            >
              <option value={10}>10 Questions ({Math.floor(10 / 2)} PYQ + {10 - Math.floor(10 / 2)} AI)</option>
              <option value={16}>16 Questions ({Math.floor(16 / 2)} PYQ + {16 - Math.floor(16 / 2)} AI)</option>
              <option value={20}>20 Questions ({Math.floor(20 / 2)} PYQ + {20 - Math.floor(20 / 2)} AI)</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80">
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" /> {selectedExamType === 'final' ? '60 mins' : '45 mins'} Official Timer
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" /> {questionCount * 10} Total Marks
            </span>
          </div>

          <button
            onClick={handleStartDynamicTest}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-black text-xs shadow-xl shadow-indigo-600/40 flex items-center gap-2 transform hover:scale-[1.02] transition-all cursor-pointer"
          >
            Launch Dynamic 50-50 Mock Exam <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Featured Course Fast-Track Simulations */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-500" /> Standard Course Simulations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map(c => (
            <div key={c._id || c.code} className="glass-panel p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 hover:border-indigo-500/40 transition-all shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {c.code}
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  Semester {c.semester || 5}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{c.name}</h4>
                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{c.description || 'University Engineering Course syllabus test'}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to={`/mock-tests/dynamic-${c.code}-mid?count=10`}
                  className="py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-extrabold text-xs text-center transition-colors"
                >
                  Midterm Mock (45m)
                </Link>
                <Link
                  to={`/mock-tests/dynamic-${c.code}-final?count=10`}
                  className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-extrabold text-xs text-center transition-colors"
                >
                  Final Mock (60m)
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
