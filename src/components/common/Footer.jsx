import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Col 1: Brand */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-cyan-400">
              Acadex
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Smart Academic Tracking & Exam Preparation System designed for CSE and engineering students. Master your semester with AI syllabus tracking, practice sets, and RAG PDF Tutor.
          </p>
          <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
            "Master Your Semester. Prepare Smarter."
          </p>
        </div>

        {/* Col 2: Platform Links */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Platform</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/courses" className="hover:text-indigo-600 dark:hover:text-indigo-400">Course Catalog</Link></li>
            <li><Link to="/my-semester" className="hover:text-indigo-600 dark:hover:text-indigo-400">Syllabus Tracker</Link></li>
            <li><Link to="/practice" className="hover:text-indigo-600 dark:hover:text-indigo-400">Topic-wise Practice</Link></li>
            <li><Link to="/pyqs" className="hover:text-indigo-600 dark:hover:text-indigo-400">Previous Year Questions</Link></li>
            <li><Link to="/mock-tests" className="hover:text-indigo-600 dark:hover:text-indigo-400">Mock Tests Engine</Link></li>
          </ul>
        </div>

        {/* Col 3: AI Suite */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">AI Suite</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/ai-question-gen" className="hover:text-indigo-600 dark:hover:text-indigo-400">AI Question Generator</Link></li>
            <li><Link to="/acadex-ai" className="hover:text-indigo-600 dark:hover:text-indigo-400">Acadex AI Assistant</Link></li>
            <li><Link to="/pdf-tutor" className="hover:text-indigo-600 dark:hover:text-indigo-400">PDF Tutor (RAG)</Link></li>
            <li><Link to="/weak-topics" className="hover:text-indigo-600 dark:hover:text-indigo-400">Weak Topic Analyzer</Link></li>
            <li><Link to="/study-plan" className="hover:text-indigo-600 dark:hover:text-indigo-400">AI Study Schedule</Link></li>
          </ul>
        </div>

        {/* Col 4: University Info */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Support & Legal</h4>
          <ul className="space-y-2 text-xs mb-4">
            <li><span className="cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400">University Portal Integration</span></li>
            <li><span className="cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400">Privacy Policy</span></li>
            <li><span className="cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400">Terms of Academic Service</span></li>
          </ul>
          <div className="flex items-center gap-3 text-slate-400">
            <Github className="w-4 h-4 hover:text-slate-700 dark:hover:text-white cursor-pointer" />
            <Twitter className="w-4 h-4 hover:text-sky-500 cursor-pointer" />
            <Linkedin className="w-4 h-4 hover:text-blue-600 cursor-pointer" />
            <Mail className="w-4 h-4 hover:text-indigo-500 cursor-pointer" />
          </div>
        </div>

      </div>

      <div className="max-w-[1920px] mx-auto border-t border-slate-100 dark:border-slate-800/80 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
        <p>© 2026 Acadex EdTech Platform. All rights reserved.</p>
        <p>Built for CSE and Engineering Academic Excellence.</p>
      </div>
    </footer>
  );
};
