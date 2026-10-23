import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Library,
  HelpCircle,
  Sparkles,
  Bot,
  FileText,
  FileQuestion,
  GraduationCap,
  TrendingDown,
  Calendar,
  BarChart3,
  Trophy,
  FolderGit2,
  UserCheck,
  Zap
} from 'lucide-react';

export const Sidebar = ({ isMobile, onClose }) => {
  const mainNavLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/my-semester', label: 'My Semester', icon: BookOpen },
    { to: '/courses', label: 'Courses', icon: Library },
    { to: '/practice', label: 'Practice', icon: HelpCircle },
  ];

  const aiNavLinks = [
    { to: '/ai-question-gen', label: 'AI Question Gen', icon: Sparkles, badge: 'AI' },
    { to: '/acadex-ai', label: 'Acadex AI', icon: Bot, badge: 'Pro' },
    { to: '/pdf-tutor', label: 'PDF Tutor (RAG)', icon: FileText, badge: 'RAG' },
    { to: '/weak-topics', label: 'Weak Topics', icon: TrendingDown },
    { to: '/study-plan', label: 'AI Study Plan', icon: Calendar },
  ];

  const examPrepLinks = [
    { to: '/pyqs', label: 'PYQs', icon: FileQuestion },
    { to: '/mock-tests', label: 'Mock Tests', icon: GraduationCap },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { to: '/resources', label: 'Resources', icon: FolderGit2 },
  ];

  const renderNavGroup = (title, links) => (
    <div className="mb-5">
      {title && (
        <h3 className="px-3 mb-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {title}
        </h3>
      )}
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-100'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </div>
              {link.badge && (
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-600 dark:text-cyan-300">
                  {link.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );

  return (
    <aside className={`w-64 shrink-0 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 p-4 overflow-y-auto ${isMobile ? 'h-full' : 'min-h-[calc(100vh-4rem)]'}`}>
      
      {/* Quick AI Booster Banner */}
      <div className="mb-5 p-3 rounded-2xl bg-gradient-to-br from-indigo-900/90 to-slate-900 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-16 h-16 rounded-full bg-cyan-500/20 blur-xl"></div>
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold">Mid Exam Prep</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-tight">
          Keep your study streak active today.
        </p>
      </div>

      {renderNavGroup('Academic Syllabus', mainNavLinks)}
      {renderNavGroup('AI Academic Tools', aiNavLinks)}
      {renderNavGroup('Exam & Analytics', examPrepLinks)}

      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <NavLink
          to="/profile"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
              isActive
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`
          }
        >
          <UserCheck className="w-4 h-4" />
          <span>Profile & Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};
