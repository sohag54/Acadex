import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  BrainCircuit,
  FileText,
  Target,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Clock,
  Layers,
  Zap,
  ShieldCheck,
  Award
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="space-y-24 py-8">
      
      {/* 1. HERO SECTION */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-violet-500/20 blur-3xl -z-10 rounded-full"></div>

        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-xs font-bold text-indigo-700 dark:text-indigo-300 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-spin" />
            <span>Next-Gen Academic Tracking & AI Exam Prep</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
            Master Your Semester.{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-cyan-500 to-violet-600 bg-clip-text text-transparent">
              Prepare Smarter.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
            Acadex brings syllabus tracking, AI-powered practice, previous-year questions, learning resources, mock tests, and personalized academic insights into one intelligent platform.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="px-6 py-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all hover:scale-105"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="px-6 py-3.5 rounded-2xl glass-panel text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Explore Features
            </a>
          </div>
        </div>

        {/* Dashboard Preview / Mockup Card */}
        <div className="mt-14 relative max-w-5xl mx-auto rounded-3xl p-3 glass-panel border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
          <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-6">
            
            {/* Header Mock */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Semester 5 • CSE</span>
                <h3 className="text-xl font-bold">Good morning, Siam Chowdhury 👋</h3>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3" /> 12 Day Study Streak
                </span>
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
                  Mid Progress: 72%
                </span>
              </div>
            </div>

            {/* Content Preview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-2">
                <div className="flex justify-between text-xs text-slate-400 font-semibold">
                  <span>CSE-301 Data Structures</span>
                  <span className="text-cyan-400">72%</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 w-[72%] rounded-full"></div>
                </div>
                <p className="text-[11px] text-slate-400">Mid Syllabus: 4/5 topics complete</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-2">
                <div className="flex justify-between text-xs text-slate-400 font-semibold">
                  <span>CSE-303 Computer Networks</span>
                  <span className="text-indigo-400">80%</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[80%] rounded-full"></div>
                </div>
                <p className="text-[11px] text-slate-400">Mid Exam in 5 days</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-2">
                <div className="flex justify-between text-xs text-slate-400 font-semibold">
                  <span>AI Weak Topic Alert</span>
                  <span className="text-amber-400">42% Acc.</span>
                </div>
                <p className="text-xs text-slate-200 font-medium">Binary Search Tree Deletion</p>
                <span className="text-[10px] text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded">Practice 5 MCQs</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. PROBLEM SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-xs font-extrabold text-indigo-600 dark:text-cyan-400 uppercase tracking-widest">
            The Student Challenge
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Why engineering students struggle during exam preparation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-3xl space-y-3">
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 w-fit">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Scattered Syllabi & Resources</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Juggling 6+ heavy engineering courses with separate Mid and Final syllabi scattered across drive folders and lecture notes leads to lost productivity.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 w-fit">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Visibility on Weak Topics</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Students waste hours re-reading concepts they already master, without knowing which specific topics lower their exam performance.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 w-fit">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Lack of Instant Feedback</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Solving short or long practice questions without instant model answer evaluation leaves students guessing whether their answers earn top marks.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center mb-14 space-y-2">
          <h2 className="text-xs font-extrabold text-indigo-600 dark:text-cyan-400 uppercase tracking-widest">
            Core Features
          </h2>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Everything you need for university exam success
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-3xl space-y-3 hover:border-indigo-500/50 transition-colors">
            <BookOpen className="w-7 h-7 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Independent Mid & Final Tracker</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Track completed topics independently for Midterm and Final exams with real-time percentage indicators.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-3 hover:border-indigo-500/50 transition-colors">
            <Sparkles className="w-7 h-7 text-cyan-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Question Generator</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Generate custom MCQs, short questions, and long essay prompts per topic with tailored difficulty.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-3 hover:border-indigo-500/50 transition-colors">
            <FileText className="w-7 h-7 text-violet-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Acadex PDF Tutor (RAG)</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Upload course PDFs or lecture notes and chat with grounded context retrieval and page citations.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-3 hover:border-indigo-500/50 transition-colors">
            <BrainCircuit className="w-7 h-7 text-emerald-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Answer Evaluation</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Submit short or long answers and receive instant scoring, strengths, missing points, and model answers.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-3 hover:border-indigo-500/50 transition-colors">
            <Target className="w-7 h-7 text-rose-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Weak Topic Analysis</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Automated classification of Strong, Average, and Weak topics based on quiz scores and attempt accuracy.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-3 hover:border-indigo-500/50 transition-colors">
            <BarChart3 className="w-7 h-7 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Performance Analytics & PYQs</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Access previous-year exam solutions, mock tests, weekly study trend charts, and leaderboard ranks.
            </p>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-xs font-extrabold text-cyan-400 uppercase tracking-widest">
            Step-by-Step Methodology
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold">How Acadex transforms your exam preparation</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-center">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center mx-auto text-sm">1</div>
            <h4 className="text-xs font-bold">Select Semester</h4>
            <p className="text-[11px] text-slate-400">Choose your department and courses.</p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center mx-auto text-sm">2</div>
            <h4 className="text-xs font-bold">Track Syllabus</h4>
            <p className="text-[11px] text-slate-400">Check completed topics for Mid and Final.</p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center mx-auto text-sm">3</div>
            <h4 className="text-xs font-bold">Practice & Quiz</h4>
            <p className="text-[11px] text-slate-400">Solve MCQs, short, and long PYQs.</p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center mx-auto text-sm">4</div>
            <h4 className="text-xs font-bold">Analyze Analytics</h4>
            <p className="text-[11px] text-slate-400">Review score trends & accuracy.</p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500 text-slate-950 font-extrabold flex items-center justify-center mx-auto text-sm">5</div>
            <h4 className="text-xs font-bold">Fix Weak Topics</h4>
            <p className="text-[11px] text-slate-400">Improve with Acadex AI & PDF Tutor.</p>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        <div className="glass-panel p-10 sm:p-14 rounded-3xl border border-indigo-200 dark:border-indigo-900/50 space-y-4">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Start preparing smarter with Acadex.
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Join engineering students tracking their syllabus and achieving top semester GPA with AI tools.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-500/25 hover:scale-105 transition-transform"
            >
              Get Started Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
