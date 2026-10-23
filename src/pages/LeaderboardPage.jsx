import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { LoadingState } from '../components/common/LoadingState';
import { Trophy, Medal, Award, Crown, User } from 'lucide-react';

export const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await apiRequest('/analytics/leaderboard');
        setLeaderboard(res.leaderboard || []);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <LoadingState message="Loading student rankings..." />;

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl space-y-2 text-center bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 w-fit mx-auto border border-amber-500/30">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold">Semester Academic Leaderboard</h1>
        <p className="text-xs text-slate-300">
          Top performers ranked by quiz accuracy, mock exam scores, and syllabus completion.
        </p>
      </div>

      {/* Leaderboard Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Student ID</th>
                <th className="px-6 py-4 text-center">Quiz Score</th>
                <th className="px-6 py-4 text-center">Mock Score</th>
                <th className="px-6 py-4 text-center">Overall Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
              {leaderboard.map((st) => (
                <tr key={st.rank} className={st.rank === 3 ? 'bg-indigo-50/50 dark:bg-indigo-950/30 font-bold' : ''}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 font-bold">
                      {st.rank === 1 && <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />}
                      {st.rank === 2 && <Medal className="w-4 h-4 text-slate-400" />}
                      {st.rank === 3 && <Award className="w-4 h-4 text-amber-700" />}
                      <span>#{st.rank}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                      {st.name.charAt(0)}
                    </div>
                    {st.name}
                  </td>
                  <td className="px-6 py-4 font-mono">{st.studentId}</td>
                  <td className="px-6 py-4 text-center font-bold text-emerald-600">{st.quizScore}%</td>
                  <td className="px-6 py-4 text-center font-bold text-cyan-600">{st.mockScore}%</td>
                  <td className="px-6 py-4 text-center font-bold text-indigo-600">{st.overallProgress}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
