import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { ProgressBar } from '../components/common/ProgressBar';
import { LoadingState } from '../components/common/LoadingState';
import { BookOpen, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

export const MySemesterPage = () => {
  const [selectedSemester, setSelectedSemester] = useState(5);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSemesterCourses = async () => {
      setLoading(true);
      try {
        const res = await apiRequest(`/courses?semester=${selectedSemester}`);
        setCourses(res.courses || []);
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSemesterCourses();
  }, [selectedSemester]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Semester Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Semester Syllabus Workspace
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Select a semester to inspect course syllabi and track Mid & Final preparation.
          </p>
        </div>

        {/* Semester Buttons 1-8 */}
        <div className="flex items-center gap-1.5 flex-wrap bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <button
              key={sem}
              onClick={() => setSelectedSemester(sem)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedSemester === sem
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Sem {sem}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingState message={`Loading Semester ${selectedSemester} Courses...`} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div key={course.code} className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 hover:border-indigo-500/50 transition-all hover:shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-mono">
                  {course.code}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  {course.credits} Credits • {course.department}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{course.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Instructor: {course.instructor}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">{course.description}</p>
              </div>

              {/* Progress Bars for Mid and Final */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <ProgressBar progress={course.midProgress} label="Midterm Syllabus Progress" color="cyan" />
                <ProgressBar progress={course.finalProgress} label="Final Syllabus Progress" color="indigo" />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {course.completedTopicCount} / {course.totalTopicCount} Topics Completed
                </span>
                <Link
                  to={`/courses/${course.code}`}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all"
                >
                  Track Syllabus <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
