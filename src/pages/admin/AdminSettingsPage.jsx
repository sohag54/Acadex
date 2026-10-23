import React from 'react';
import { Settings, ShieldCheck, Database, Server } from 'lucide-react';

export const AdminSettingsPage = () => {
  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      <div className="glass-panel p-6 rounded-3xl space-y-2 border border-rose-200 dark:border-rose-900/40">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-rose-500" /> Admin System Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Environment configuration, Firebase Admin integration, and REST API health metrics.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">REST API Backend Status</span>
          </div>
          <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
            Online (Port 5000)
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-500" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">MongoDB Connection State</span>
          </div>
          <span className="text-xs font-bold text-indigo-500 bg-indigo-500/10 px-2.5 py-0.5 rounded-full">
            In-Memory Fallback Active
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">Firebase Admin SDK</span>
          </div>
          <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
            Development Mode Ready
          </span>
        </div>
      </div>
    </div>
  );
};
