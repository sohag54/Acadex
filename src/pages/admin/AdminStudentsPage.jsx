import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { LoadingState } from '../../components/common/LoadingState';
import { Users, Search, ShieldCheck } from 'lucide-react';

export const AdminStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await apiRequest('/admin/students');
        setStudents(res.students || []);
      } catch (err) {
        console.error('Error fetching admin students:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) return <LoadingState message="Loading registered students directory..." />;

  return (
    <div className="space-y-6 pb-12">
      <div className="glass-panel p-6 rounded-3xl space-y-2">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-500" /> Student Directory Management
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          View registered student profiles, assigned departments, and roles.
        </p>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Student ID</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Semester</th>
                <th className="px-6 py-4">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
              {students.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    No students registered yet in the system.
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s._id || s.firebaseUid}>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{s.fullName}</td>
                    <td className="px-6 py-4">{s.email}</td>
                    <td className="px-6 py-4 font-mono">{s.studentId || 'N/A'}</td>
                    <td className="px-6 py-4 font-bold">{s.department || '-'}</td>
                    <td className="px-6 py-4">{s.semester ? `Semester ${s.semester}` : '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${s.role === 'admin' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                        {s.role}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
