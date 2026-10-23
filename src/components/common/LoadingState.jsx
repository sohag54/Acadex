import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({ message = 'Loading Acadex Data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
      <Loader2 className="w-8 h-8 text-indigo-600 dark:text-cyan-400 animate-spin mb-3" />
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
};
