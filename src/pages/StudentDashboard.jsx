import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';
import { StatCard } from '../components/common/StatCard';
import { ProgressBar } from '../components/common/ProgressBar';
import { LoadingState } from '../components/common/LoadingState';
import {
  BookOpen,
  Calendar,
  Sparkles,
  TrendingUp,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  Target,
  BrainCircuit,
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const StudentDashboard = () => {
  const { userProfile } = useAuth();
  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const semester = userProfile?.semester || 5;
        const department = userProfile?.department || 'CSE';
        const [coursesRes, analyticsRes] = await Promise.all([
          apiRequest(`/courses?semester=${semester}&department=${department}`),
          apiRequest('/analytics/overview')
        ]);
        setCourses(coursesRes.courses || []);
        setAnalytics(analyticsRes);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, [userProfile?.semester, userProfile?.department]);

  if (loading) {
    return <LoadingState message="Loading your semester workspace..." />;
  }

  const isDemoUser = !userProfile || userProfile.studentId === '2023-1-60-089' || userProfile.email === 'student@acadex.edu';

  const upcomingExams = courses.length > 0 ? courses.slice(0, 3).map((c, i) => ({
    courseCode: c.code,
    courseName: c.name,
    type: 'Mid Exam',
    date: `Week ${i + 6}, Semester ${userProfile?.semester || 5}`,
    daysLeft: (i + 1) * 7,
    color: i === 0 ? 'border-indigo-500' : i === 1 ? 'border-cyan-500' : 'border-amber-500'
  })) : (isDemoUser ? [
    { courseCode: 'CSE-301', courseName: 'Data Structures', type: 'Mid Exam', date: 'Oct 15, 2026', daysLeft: 5, color: 'border-indigo-500' },
    { courseCode: 'CSE-303', courseName: 'Computer Networks', type: 'Mid Exam', date: 'Oct 22, 2026', daysLeft: 12, color: 'border-cyan-500' },
    { courseCode: 'CSE-304', courseName: 'Operating Systems', type: 'Mid Exam', date: 'Oct 25, 2026', daysLeft: 15, color: 'border-amber-500' },
  ] : []);

  const recentActivities = isDemoUser ? [
    { text: 'Completed topic "Stack ADT & Expression Evaluation" in CSE-301', time: '2 hours ago', icon: CheckCircle2, color: 'text-emerald-500' },
    { text: 'Evaluated Short Answer on "TCP 3-Way Handshake" with Acadex AI (Score: 9/10)', time: '5 hours ago', icon: BrainCircuit, color: 'text-indigo-500' },
    { text: 'Uploaded PDF "Lecture 4 - AVL Trees.pdf" to PDF Tutor', time: 'Yesterday', icon: FileText, color: 'text-cyan-500' },
  ] : [];

  const summary = analytics?.summary || {};
  const overallCompletion = summary.overallCompletion ?? 0;
  const midCompletion = summary.midCompletion ?? 0;
  const finalCompletion = summary.finalCompletion ?? 0;
  const totalMastered = summary.totalTopicsMastered ?? 0;
  const totalTopics = summary.totalTopics ?? 0;
  const streakDays = summary.studyStreakDays ?? 0;
  const weakCount = summary.weakTopicsCount ?? 0;
  const weakNames = summary.weakTopicsNames || 'All topics on track';

  return (
    <div className="space-y-6 pb-12">
      
      {/* Welcome Banner */}
      <div className="glass-panel p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden border border-slate-800 shadow-xl">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                {userProfile?.department || 'CSE'} • Semester {userProfile?.semester || 5}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400 fill-amber-400" /> {streakDays} Day Streak
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good morning, {userProfile?.fullName || 'Student'} 👋
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              {overallCompletion > 0 ? (
                <>You're making steady progress! <strong>{totalMastered}</strong> topics completed so far.</>
              ) : (
                <>Welcome to your semester workspace! Start exploring your syllabus and practice with AI tools.</>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/ai-question-gen"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" /> AI Practice
            </Link>
            <Link
              to="/my-semester"
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs hover:bg-slate-700 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" /> View Syllabus
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Syllabus"
          value={`${overallCompletion}%`}
          subtext={`${totalMastered} of ${totalTopics} topics completed`}
          icon={CheckCircle2}
          color="indigo"
          badge={`Semester ${userProfile?.semester || 5}`}
        />
        <StatCard
          title="Mid Preparation"
          value={`${midCompletion}%`}
          subtext="Independent Mid Syllabus"
          icon={TrendingUp}
          color="cyan"
        />
        <StatCard
          title="Final Preparation"
          value={`${finalCompletion}%`}
          subtext="Independent Final Syllabus"
          icon={BookOpen}
          color="emerald"
        />
        <StatCard
          title="Weak Topics Alert"
          value={`${weakCount} Topics`}
          subtext={weakNames}
          icon={Target}
          color={weakCount > 0 ? 'rose' : 'emerald'}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Study Progress Area Chart */}
        <div className="glass-panel p-5 rounded-3xl lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Weekly Study Progress</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Hours spent studying vs topics completed</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-lg">
              This Week: {summary.weeklyStudyHours ?? 0} Hrs
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.weeklyProgress || []}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="hours" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Progress Comparison Bar Chart */}
        <div className="glass-panel p-5 rounded-3xl space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Course Syllabus Split</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Mid vs Final completion %</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.courseComparison || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="courseCode" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px' }} />
                <Bar dataKey="midProgress" fill="#06B6D4" radius={[4, 4, 0, 0]} name="Mid %" />
                <Bar dataKey="finalProgress" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Final %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Courses & Upcoming Exams Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Semester Courses List */}
        <div className="glass-panel p-5 rounded-3xl lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Active Courses — Semester {userProfile?.semester || 5}
            </h3>
            <Link to="/courses" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs space-y-2">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">No courses available for this semester yet</p>
              <p className="text-[11px]">When courses are added by the department admin, they will appear here with syllabus trackers.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courses.slice(0, 4).map(course => (
                <div key={course.code} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3 hover:border-indigo-500/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {course.code}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                      {course.credits} Credits
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{course.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{course.instructor || 'Faculty Assigned'}</p>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <ProgressBar progress={course.midProgress ?? 0} label="Mid Syllabus" size="sm" color="cyan" />
                    <ProgressBar progress={course.finalProgress ?? 0} label="Final Syllabus" size="sm" color="indigo" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Exam Countdowns & Recent Activity */}
        <div className="space-y-6">
          
          {/* Upcoming Exams Card */}
          <div className="glass-panel p-5 rounded-3xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" /> Upcoming Exams
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Countdowns</span>
            </div>

            {upcomingExams.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">No upcoming exams scheduled yet.</p>
            ) : (
              <div className="space-y-2.5">
                {upcomingExams.map(ex => (
                  <div key={ex.courseCode} className={`p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border-l-4 ${ex.color} flex items-center justify-between text-xs`}>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{ex.courseCode} {ex.type}</span>
                      <span className="text-[11px] text-slate-500">{ex.date}</span>
                    </div>
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {ex.daysLeft} days
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="glass-panel p-5 rounded-3xl space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Recent Activity
            </h3>
            {recentActivities.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                No recent activity. Complete syllabus topics or quizzes to see your study log here!
              </p>
            ) : (
              <div className="space-y-3">
                {recentActivities.map((act, i) => {
                  const Icon = act.icon;
                  return (
                    <div key={i} className="flex gap-2.5 items-start text-xs">
                      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${act.color}`} />
                      <div>
                        <p className="text-slate-700 dark:text-slate-300 leading-snug">{act.text}</p>
                        <span className="text-[10px] text-slate-400 font-medium">{act.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
