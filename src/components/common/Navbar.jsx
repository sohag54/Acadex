import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  GraduationCap,
  Sun,
  Moon,
  Bell,
  User,
  LogOut,
  ShieldAlert,
  ChevronDown,
  Menu,
  X,
  Search,
  BookOpen
} from 'lucide-react';

export const Navbar = ({ onToggleMobileSidebar }) => {
  const { userProfile, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Exam Countdown', text: 'Computer Networks Mid Exam is in 5 days.', time: '10m ago', unread: true },
    { id: 2, title: 'Weak Topic Alert', text: 'Accuracy in Binary Search Tree is 42%. Review recommended.', time: '1h ago', unread: true },
    { id: 3, title: 'Study Plan Ready', text: 'Your AI Daily Schedule for tomorrow has been updated.', time: '3h ago', unread: false }
  ];

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="mx-auto flex h-16 w-full max-w-[1920px] items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Section: Brand & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-700 bg-clip-text text-transparent dark:from-indigo-400 dark:via-cyan-300 dark:to-cyan-400">
                Acadex
              </span>
              <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 -mt-1 hidden sm:inline">
                Academic Tracker & AI Exam Prep
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search courses, syllabus topics, PYQs, AI tools..."
              className="w-full pl-9 pr-4 py-1.5 text-sm rounded-full bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:bg-white dark:focus:bg-slate-900 transition-all"
            />
          </div>
        </div>

        {/* Right Section: Theme Toggle, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Notifications</h4>
                  <span className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 px-2 py-0.5 rounded-full font-semibold">
                    2 new
                  </span>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                      <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white mb-1">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu / Auth Action */}
          {userProfile ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white text-xs">
                  {userProfile.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'S'}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {userProfile.fullName}
                  </span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                    {userProfile.department || 'CSE'} • Sem {userProfile.semester || 5}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50">
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{userProfile.fullName}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{userProfile.email}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="inline-block text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-slate-600 dark:text-slate-300">
                        ID: {userProfile.studentId || '2023-1-60-089'}
                      </span>
                      {isAdmin && (
                        <span className="inline-block text-[10px] bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 px-1.5 py-0.5 rounded font-bold">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    >
                      <User className="w-4 h-4 text-indigo-500" /> My Profile & Settings
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                      >
                        <ShieldAlert className="w-4 h-4" /> Admin Portal
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-left"
                    >
                      <LogOut className="w-4 h-4 text-slate-400" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/25 transition-all hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
