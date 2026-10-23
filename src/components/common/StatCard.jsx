import React from 'react';

export const StatCard = ({ title, value, subtext, icon: Icon, color = 'indigo', badge }) => {
  const colorMap = {
    indigo: 'from-indigo-500/10 to-indigo-600/5 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/50',
    cyan: 'from-cyan-500/10 to-cyan-600/5 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900/50',
    emerald: 'from-emerald-500/10 to-emerald-600/5 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50',
    amber: 'from-amber-500/10 to-amber-600/5 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50',
    rose: 'from-rose-500/10 to-rose-600/5 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50',
  };

  const style = colorMap[color] || colorMap.indigo;

  return (
    <div className="glass-panel p-5 rounded-2xl relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-xl bg-gradient-to-br ${style} border`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {value}
        </h3>
        {badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            {badge}
          </span>
        )}
      </div>
      {subtext && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
          {subtext}
        </p>
      )}
    </div>
  );
};
