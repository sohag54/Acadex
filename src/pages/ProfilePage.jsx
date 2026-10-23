import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Mail, Hash, BookOpen, Sun, Moon, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ProfilePage = () => {
  const { userProfile, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      
      {/* Header Profile Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg">
            {userProfile?.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'S'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">{userProfile?.fullName}</h1>
              {isAdmin && (
                <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-[10px] font-bold">
                  Administrator
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">{userProfile?.email}</p>
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
              {userProfile?.department || 'CSE'} • Batch {userProfile?.batch || '54th'} • Semester {userProfile?.semester || 5}
            </p>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold block">Student ID Number</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
              {userProfile?.studentId || '2023-1-60-089'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold block">Department & Batch</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              {userProfile?.department || 'CSE'} ({userProfile?.batch || '54th'})
            </span>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            System Preferences
          </h3>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Dark Mode Appearance</h4>
              <p className="text-[11px] text-slate-500">Toggle dark visual aesthetic across all pages</p>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
