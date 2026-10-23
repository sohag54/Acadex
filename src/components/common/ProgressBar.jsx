import React from 'react';

export const ProgressBar = ({ progress = 0, label, showPercentage = true, color = 'indigo', size = 'md' }) => {
  const safeProgress = Math.min(100, Math.max(0, Math.round(progress)));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colorGradients = {
    indigo: 'from-indigo-600 to-indigo-500',
    cyan: 'from-cyan-600 to-cyan-400',
    emerald: 'from-emerald-600 to-teal-400',
    amber: 'from-amber-500 to-orange-400',
    rose: 'from-rose-600 to-pink-500',
    violet: 'from-violet-600 to-purple-500',
  };

  const gradient = colorGradients[color] || colorGradients.indigo;

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1 text-xs">
          {label && <span className="font-semibold text-slate-700 dark:text-slate-300">{label}</span>}
          {showPercentage && <span className="font-bold text-slate-900 dark:text-white font-mono">{safeProgress}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden ${heightClasses[size] || heightClasses.md}`}>
        <div
          className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </div>
  );
};
