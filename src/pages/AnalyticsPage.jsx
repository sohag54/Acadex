import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { LoadingState } from '../components/common/LoadingState';
import { StatCard } from '../components/common/StatCard';
import { BarChart3, TrendingUp, Award, Target, CheckCircle2, Zap } from 'lucide-react';
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

export const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await apiRequest('/analytics/overview');
        setAnalytics(res);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <LoadingState message="Loading performance analytics..." />;

  const summary = analytics?.summary || {};

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl space-y-2">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-500" /> Academic Performance Analytics
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Comprehensive breakdown of your study hours, quiz averages, course completion, and exam readiness metrics.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Overall Syllabus" value={`${summary.overallCompletion ?? 0}%`} subtext={`Mastered ${summary.totalTopicsMastered ?? 0} topics`} icon={CheckCircle2} color="indigo" />
        <StatCard title="Mid Syllabus" value={`${summary.midCompletion ?? 0}%`} subtext="Independent Mid" icon={TrendingUp} color="cyan" />
        <StatCard title="Quiz Average" value={`${summary.quizAverage ?? 0}%`} subtext={analytics?.attemptsCount > 0 ? `From ${analytics.attemptsCount} attempts` : 'No attempts yet'} icon={Award} color="emerald" />
        <StatCard title="Study Streak" value={`${summary.studyStreakDays ?? 0} Days`} subtext={summary.studyStreakDays > 0 ? 'Active daily' : 'Start learning today'} icon={Zap} color="amber" />
      </div>

      {/* Recharts Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Trend */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Weekly Study Time (Hours)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.weeklyProgress || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="hours" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.2} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Comparison */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Mid vs Final Completion per Course</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.courseComparison || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="courseCode" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="midProgress" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Mid %" />
                <Bar dataKey="finalProgress" fill="#10B981" radius={[4, 4, 0, 0]} name="Final %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
