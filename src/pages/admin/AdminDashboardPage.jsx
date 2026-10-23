import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../services/api';
import { StatCard } from '../../components/common/StatCard';
import { LoadingState } from '../../components/common/LoadingState';
import { ShieldAlert, Users, Library, HelpCircle, FileQuestion, Sparkles, FolderGit2, BookOpenCheck } from 'lucide-react';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await apiRequest('/admin/stats');
        setStats(res);
      } catch (err) {
        console.error('Admin stats error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) return <LoadingState message="Loading administrator dashboard..." />;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Banner */}
      <div className="glass-panel p-6 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 text-white border border-rose-900/40">
        <div className="flex items-center gap-2 mb-1">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <span className="text-xs font-bold text-rose-300">Administrator Content Management Portal</span>
        </div>
        <h1 className="text-2xl font-extrabold">Faculty Overview</h1>
        <p className="text-xs text-slate-300 mt-1">
          Manage courses, syllabus topics, practice questions, PYQs, and review AI-generated content drafts.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={stats?.totalStudents ?? 0} icon={Users} color="indigo" />
        <StatCard title="Active Courses" value={stats?.totalCourses ?? 0} icon={Library} color="cyan" />
        <StatCard title="Question Pool" value={stats?.totalQuestions ?? 0} icon={HelpCircle} color="emerald" />
        <StatCard title="Pending AI Review" value={stats?.pendingAiReviews ?? 0} icon={Sparkles} color="rose" badge={stats?.pendingAiReviews > 0 ? "Needs Action" : undefined} />
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link to="/admin/courses" className="glass-panel p-6 rounded-3xl space-y-2 hover:border-rose-500/50 transition-colors">
          <Library className="w-6 h-6 text-cyan-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Manage Courses</h3>
          <p className="text-xs text-slate-500">Create, edit, or archive university engineering courses.</p>
        </Link>

        <Link to="/admin/syllabus" className="glass-panel p-6 rounded-3xl space-y-2 hover:border-rose-500/50 transition-colors">
          <BookOpenCheck className="w-6 h-6 text-indigo-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Syllabus & Topics</h3>
          <p className="text-xs text-slate-500">Add Mid & Final syllabus modules and learning objectives.</p>
        </Link>

        <Link to="/admin/ai-review" className="glass-panel p-6 rounded-3xl space-y-2 hover:border-rose-500/50 transition-colors">
          <Sparkles className="w-6 h-6 text-rose-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Content Review</h3>
          <p className="text-xs text-slate-500">Approve or edit AI-generated question drafts before publishing.</p>
        </Link>
      </div>

    </div>
  );
};
