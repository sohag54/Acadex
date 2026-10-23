import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { Calendar, Clock, CheckCircle2, Circle, Sparkles, Plus } from 'lucide-react';

export const StudyPlanPage = () => {
  const [dailyHours, setDailyHours] = useState(3);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/ai/study-plan', {
        method: 'POST',
        body: JSON.stringify({ dailyHours })
      });
      setTasks(res.studyPlan?.tasks || []);
    } catch (err) {
      console.error('Error loading study plan:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, [dailyHours]);

  const toggleTask = (index) => {
    setTasks(prev =>
      prev.map((t, i) => (i === index ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      {/* Header & Controls */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" /> AI Personalized Study Schedule
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Automated daily revision tasks optimized for your upcoming Mid & Final exams.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Daily Time Available:</span>
            <select
              value={dailyHours}
              onChange={(e) => setDailyHours(parseInt(e.target.value))}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800"
            >
              <option value={2}>2 Hours / Day</option>
              <option value={3}>3 Hours / Day</option>
              <option value={5}>5 Hours / Day</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Today's Target Tasks ({tasks.filter(t => t.completed).length} / {tasks.length} Done)
          </h3>
          <button
            onClick={fetchPlan}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Regenerate Schedule
          </button>
        </div>

        <div className="space-y-3">
          {tasks.map((task, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                task.completed
                  ? 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 opacity-70'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-500/40'
              }`}
            >
              <button
                onClick={() => toggleTask(idx)}
                className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    {task.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {task.timeSlot}
                    </span>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      task.priority === 'High'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                    }`}>
                      {task.priority} Priority
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>{task.courseCode}</span>
                  <span>•</span>
                  <span>{task.activityType} ({task.estimatedMins} mins)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
