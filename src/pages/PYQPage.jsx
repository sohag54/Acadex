import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { LoadingState } from '../components/common/LoadingState';
import {
  FileQuestion,
  Search,
  Filter,
  BookOpen,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Download,
  Upload
} from 'lucide-react';

export const PYQPage = () => {
  const [pyqs, setPyqs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await apiRequest('/courses');
        setCourses(res.courses || []);
      } catch (e) {}
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchPYQs = async () => {
      try {
        let url = '/pyq';
        const params = [];
        if (selectedCourse) params.push(`courseCode=${selectedCourse}`);
        if (selectedExamType) params.push(`examType=${selectedExamType}`);
        if (params.length) url += `?${params.join('&')}`;

        const res = await apiRequest(url);
        setPyqs(res.pyqs || []);
      } catch (err) {
        console.error('Error fetching PYQs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPYQs();
  }, [selectedCourse, selectedExamType]);

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Header & Filters */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-amber-500" /> Previous Year Exam Questions (PYQs)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Filter university exam questions by course and exam type, download actual question paper documents, and view step-by-step model solutions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
          >
            <option value="">All Courses</option>
            {courses.map(c => (
              <option key={c._id || c.code} value={c.code}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedExamType}
            onChange={(e) => setSelectedExamType(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
          >
            <option value="">All Exam Types</option>
            <option value="mid">Mid Exam</option>
            <option value="final">Final Exam</option>
          </select>

          <span className="text-xs text-slate-400 font-medium ml-auto">
            Showing {pyqs.length} question paper{pyqs.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading previous year questions..." />
      ) : (
        <div className="space-y-4">
          {pyqs.length === 0 ? (
            <div className="p-12 text-center rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-3">
              <FileQuestion className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No Previous Year Questions Available</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No exam papers have been uploaded for this filter yet. When teachers/admins upload question papers, they will appear here.
              </p>
            </div>
          ) : (
            pyqs.map(p => {
              const isExpanded = expandedId === p._id;
              const fullFileUrl = p.fileUrl ? (p.fileUrl.startsWith('http') ? p.fileUrl : `http://localhost:5000${p.fileUrl}`) : '';

              return (
                <div key={p._id} className="glass-panel p-6 rounded-3xl space-y-3 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-mono">
                        {p.courseCode}
                      </span>
                      <span className="text-xs text-slate-500 font-bold uppercase">
                        {p.year} • {p.examType} Exam
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                      {p.marks} Marks
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                    {p.questionText}
                  </h3>

                  {/* Attached File Download Card */}
                  {p.fileUrl && (
                    <div className="pt-1">
                      <a
                        href={fullFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                      >
                        {p.fileType === 'pdf' && <FileText className="w-4 h-4 text-rose-500 shrink-0" />}
                        {p.fileType === 'image' && <ImageIcon className="w-4 h-4 text-emerald-500 shrink-0" />}
                        {p.fileType === 'doc' && <FileText className="w-4 h-4 text-cyan-500 shrink-0" />}
                        {!['pdf', 'image', 'doc'].includes(p.fileType) && <Upload className="w-4 h-4 text-indigo-500 shrink-0" />}
                        <span className="font-bold underline flex items-center gap-1.5">
                          Download / View Question Paper ({p.fileName || 'Document'})
                          <ExternalLink className="w-3.5 h-3.5" />
                        </span>
                        {p.fileSize && <span className="text-[11px] text-slate-500">[{p.fileSize}]</span>}
                      </a>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                      Key Concept: {p.keyConcept || 'Core Academic Topic'}
                    </span>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : p._id)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs hover:bg-slate-200"
                    >
                      {isExpanded ? 'Hide Solution / Notes' : 'View Solution / Notes'}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs whitespace-pre-wrap mt-3 border border-slate-800 animate-in fade-in">
                      <span className="text-emerald-400 font-bold block mb-2">Model Solution / Explanation:</span>
                      {p.solution}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
};
