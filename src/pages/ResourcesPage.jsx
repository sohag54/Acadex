import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { LoadingState } from '../components/common/LoadingState';
import { FolderGit2, Video, FileText, ExternalLink } from 'lucide-react';

export const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await apiRequest('/resources');
        setResources(res.resources || []);
      } catch (err) {
        console.error('Error fetching resources:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  if (loading) return <LoadingState message="Loading learning resources catalog..." />;

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      <div className="glass-panel p-6 rounded-3xl space-y-2">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-emerald-500" /> Topic Learning Resources
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Curated video tutorials, documentation guides, and lecture slides for your courses.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {resources.map((res) => (
          <div key={res._id} className="glass-panel p-6 rounded-3xl space-y-3 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                {res.type} • {res.duration}
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">{res.courseCode}</span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">{res.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{res.description}</p>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">Source: {res.source}</span>
              <a
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 flex items-center gap-1.5"
              >
                Open Link <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
