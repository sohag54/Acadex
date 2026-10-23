import React from 'react';
import { FolderOpen } from 'lucide-react';

export const EmptyState = ({ title = 'No Data Available', message = 'There are no items matching your criteria.', icon: Icon = FolderOpen, actionText, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center glass-panel rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 my-4">
      <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800/60 text-slate-400 mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4 leading-relaxed">{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
