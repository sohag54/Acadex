import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Eye, EyeOff, Lock, Mail, ArrowRight, Zap, ShieldCheck, BookOpen, Brain, BarChart3, FileText, Trophy, Sparkles, Target, Clock, Users } from 'lucide-react';

export const LoginPage = () => {
  const { login, googleLogin, demoStudentLogin, demoAdminLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeFeature, setActiveFeature] = useState(0);

  const formatAuthError = (err) => {
    const code = err.code || err.message || '';
    if (code.includes('api-key-not-valid') || code.includes('invalid-api-key')) {
      return 'Firebase API Key is missing or invalid in frontend/.env. Please configure your Firebase credentials, or use the "⚡ Quick Demo Sign-In" buttons below to test instantly!';
    }
    if (code.includes('user-not-found') || code.includes('wrong-password') || code.includes('invalid-credential')) {
      return 'Invalid email or password. Please verify your credentials.';
    }
    if (code.includes('invalid-email')) {
      return 'Please enter a valid email address.';
    }
    if (code.includes('network-request-failed')) {
      return 'Network connection issue. Please try again.';
    }
    if (code.includes('popup-closed-by-user')) {
      return 'Google sign-in popup was closed before completion.';
    }
    return err.message || 'Login failed. Please check your details.';
  };

  const ADMIN_EMAILS = [
    'muhammadashikurrahman2892@gmail.com'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    try {
      const user = await login(email, password);
      const userEmail = (user?.email || email || '').toLowerCase();
      if (ADMIN_EMAILS.includes(userEmail)) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMessage(formatAuthError(err));
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      const user = await googleLogin();
      const userEmail = (user?.email || '').toLowerCase();
      if (ADMIN_EMAILS.includes(userEmail)) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMessage(formatAuthError(err));
      setLoading(false);
    }
  };

  const handleDemoStudent = async () => {
    setLoading(true);
    await demoStudentLogin();
    navigate('/dashboard');
  };

  const handleDemoAdmin = async () => {
    setLoading(true);
    await demoAdminLogin();
    navigate('/admin/dashboard');
  };

  const features = [
    { icon: BookOpen, title: 'Course & Syllabus Tracking', desc: 'Manage all your semester courses and track syllabus completion in one place.' },
    { icon: Brain, title: 'AI Study Assistant', desc: 'Get instant explanations, smart notes, and AI-generated flashcards.' },
    { icon: FileText, title: 'PYQ Question Bank', desc: 'Practice previous year questions organized by topic and difficulty.' },
    { icon: BarChart3, title: 'Performance Analytics', desc: 'Detailed dashboards showing grades, progress, and study insights.' },
    { icon: Trophy, title: 'Smart Study Plans', desc: 'AI creates personalized schedules based on exams and weak areas.' },
    { icon: Target, title: 'Mock Tests & Quizzes', desc: 'Timed practice tests with instant scoring and detailed solutions.' },
  ];

  // Auto-rotate active feature
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col lg:flex-row" style={{ minHeight: 'calc(100vh - 64px)' }}>

        {/* ===== LEFT SIDE: Brand & Features ===== */}
        <div className="hidden lg:flex lg:w-[55%] xl:w-[55%] relative bg-white dark:bg-slate-950 items-center justify-center px-12 xl:px-20">

          {/* Subtle background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-[0.04] dark:opacity-[0.06]"
              style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
            <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full opacity-[0.03] dark:opacity-[0.05]"
              style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.02] dark:opacity-[0.03]"
              style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
          </div>

          <div className="relative z-10 max-w-lg">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/25">
                <GraduationCap className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Acadex</h1>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Academic Tracker & AI Exam Prep</p>
              </div>
            </div>

            {/* Tagline */}
            <div className="mb-10">
              <h2 className="text-[2.75rem] leading-[1.15] font-extrabold text-slate-900 dark:text-white">
                Master your
                <br />
                semester with
                <br />
                <span className="bg-gradient-to-r from-indigo-600 via-violet-500 to-cyan-500 bg-clip-text text-transparent">
                  AI-powered tools.
                </span>
              </h2>
            </div>

            {/* Feature Cards */}
            <div className="space-y-3">
              {features.map((f, i) => {
                const isActive = i === activeFeature;
                return (
                  <div
                    key={i}
                    onClick={() => setActiveFeature(i)}
                    className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-500 border ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 shadow-md shadow-indigo-500/5'
                        : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/50'
                    }`}
                  >
                    <div className={`flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-500 ${
                      isActive
                        ? 'bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      <f.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-bold transition-colors duration-300 ${
                        isActive ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'
                      }`}>{f.title}</h3>
                      <p className={`text-xs leading-relaxed mt-0.5 transition-all duration-500 overflow-hidden ${
                        isActive ? 'max-h-10 opacity-100 text-slate-600 dark:text-slate-400' : 'max-h-0 opacity-0'
                      }`}>{f.desc}</p>
                    </div>
                    {isActive && (
                      <div className="flex-shrink-0 w-1.5 h-8 rounded-full bg-gradient-to-b from-indigo-500 to-cyan-500" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom stats */}
            <div className="flex items-center gap-6 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-500" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-cyan-500" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">24/7 Access</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Smart Learning</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== RIGHT SIDE: Login Form ===== */}
        <div className="flex-1 lg:w-[45%] xl:w-[45%] flex items-center justify-center px-6 py-12 lg:py-0 bg-slate-50 dark:bg-slate-900 lg:border-l border-slate-200 dark:border-slate-800">
          <div className="w-full max-w-[400px] space-y-6">

            {/* Mobile header */}
            <div className="text-center lg:text-left space-y-2">
              <Link to="/" className="inline-flex items-center gap-2 mb-3 lg:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <span className="font-extrabold text-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                  Acadex
                </span>
              </Link>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign in to your account</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Access your courses, study tools & analytics
              </p>
            </div>

            {/* Quick Demo Login */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block text-center">
                ⚡ Quick Demo Sign-In
              </span>
              <button
                type="button"
                onClick={handleDemoStudent}
                disabled={loading}
                className="w-full py-2.5 px-3 rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5 border border-indigo-100 dark:border-indigo-900"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Student Demo
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-medium text-center">
                {errorMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@acadex.edu"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 active:scale-[0.98] shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <>Sign In <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
              <span className="absolute px-3 bg-slate-50 dark:bg-slate-900 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Or continue with
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2.5 transition-colors shadow-sm"
            >
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Sign in with Google
            </button>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                Create account
              </Link>
            </p>

            {/* Mobile features */}
            <div className="lg:hidden mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 text-center mb-3">What Acadex Offers</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: BookOpen, label: 'Course Tracking' },
                  { icon: Brain, label: 'AI Study Tools' },
                  { icon: FileText, label: 'PYQ Bank' },
                  { icon: BarChart3, label: 'Analytics' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                    <item.icon className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
  );
};

