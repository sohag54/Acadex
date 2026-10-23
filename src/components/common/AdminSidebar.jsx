import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Library,
  BookOpenCheck,
  HelpCircle,
  FileQuestion,
  FolderGit2,
  GraduationCap,
  Sparkles,
  Settings,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';

export const AdminSidebar = () => {
  const adminLinks = [
    { to: '/admin/dashboard', label: 'Admin Overview', icon: LayoutDashboard },
    { to: '/admin/students', label: 'Students', icon: Users },
    { to: '/admin/courses', label: 'Courses Management', icon: Library },
    { to: '/admin/syllabus', label: 'Syllabus & Topics', icon: BookOpenCheck },
    { to: '/admin/questions', label: 'Questions Pool', icon: HelpCircle },
    { to: '/admin/pyqs', label: 'PYQ Management', icon: FileQuestion },
    { to: '/admin/resources', label: 'Resources', icon: FolderGit2 },
    { to: '/admin/mock-tests', label: 'Mock Tests', icon: GraduationCap },
    { to: '/admin/ai-review', label: 'AI Content Review', icon: Sparkles, badge: 'Drafts' },
    { to: '/admin/settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 p-4 min-h-[calc(100vh-4rem)]">
      
      {/* Admin Mode Badge */}
      <div className="mb-6 p-3 rounded-2xl bg-gradient-to-r from-rose-900 via-slate-900 to-indigo-950 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-rose-400" />
          <span className="text-xs font-bold text-rose-300">Admin Control Panel</span>
        </div>
        <p className="text-[11px] text-slate-300">
          Faculty Content & System Management
        </p>
      </div>

      <nav className="space-y-1 mb-6">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                    : 'text-slate-600 hover:bg-rose-50 hover:text-rose-900 dark:text-slate-400 dark:hover:bg-rose-950/30 dark:hover:text-rose-200'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </div>
              {link.badge && (
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-300">
                  {link.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Switch to Student Portal
        </Link>
      </div>
    </aside>
  );
};
