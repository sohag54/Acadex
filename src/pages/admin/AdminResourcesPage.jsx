import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { LoadingState } from '../../components/common/LoadingState';
import { Modal } from '../../components/common/Modal';
import {
  FolderGit2,
  Plus,
  Trash2,
  ExternalLink,
  Video,
  FileText,
  BookOpen,
  Link2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export const AdminResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const initialForm = {
    courseCode: '',
    chapterSegment: '',
    topicTitle: '',
    title: '',
    type: 'video',
    url: '',
    source: 'YouTube',
    duration: '15 mins',
    description: ''
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchCourses = async () => {
    try {
      const res = await apiRequest('/courses');
      const list = res.courses || [];
      setCourses(list);
      if (list.length > 0 && !formData.courseCode) {
        setFormData(prev => ({ ...prev, courseCode: list[0].code }));
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchResources = async () => {
    setLoading(true);
    try {
      let url = '/resources';
      const params = [];
      if (selectedCourse) params.push(`courseCode=${selectedCourse}`);
      if (selectedType) params.push(`type=${selectedType}`);
      if (params.length) url += `?${params.join('&')}`;

      const res = await apiRequest(url);
      setResources(res.resources || []);
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchResources();
  }, [selectedCourse, selectedType]);

  const handleCreateResource = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      await apiRequest('/resources', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setShowAddModal(false);
      setFormData(prev => ({
        ...initialForm,
        courseCode: courses[0]?.code || ''
      }));
      setFeedback({ type: 'success', text: 'Learning resource added successfully!' });
      fetchResources();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to create resource.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    try {
      await apiRequest(`/resources/${id}`, { method: 'DELETE' });
      setFeedback({ type: 'success', text: 'Resource deleted successfully.' });
      fetchResources();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to delete resource.' });
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-rose-500" />;
      case 'article':
        return <FileText className="w-4 h-4 text-cyan-500" />;
      case 'docs':
        return <BookOpen className="w-4 h-4 text-emerald-500" />;
      default:
        return <Link2 className="w-4 h-4 text-indigo-500" />;
    }
  };

  if (loading && courses.length === 0) {
    return <LoadingState message="Loading resource management system..." />;
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-rose-500" /> Learning Resources Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Curate tutorials, lecture notes, video lectures and documentation for student courses.
          </p>
        </div>

        <button
          onClick={() => {
            if (courses.length === 0) {
              alert('Please create at least one course first in the "Courses Management" tab.');
              return;
            }
            setShowAddModal(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-md shadow-rose-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Learning Resource
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
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
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
        >
          <option value="">All Types</option>
          <option value="video">Videos</option>
          <option value="article">Articles & Blogs</option>
          <option value="docs">Documentation</option>
          <option value="pdf">PDF Lecture Notes</option>
        </select>

        <span className="text-xs text-slate-400 font-medium ml-auto">
          Showing {resources.length} resource{resources.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Resources Table/List */}
      {resources.length === 0 ? (
        <div className="p-12 text-center rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-3">
          <FolderGit2 className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Learning Resources Added Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {courses.length === 0
              ? 'Please add courses first before curating learning resources.'
              : 'Click "Add Learning Resource" above to add video tutorials, lecture PDFs or official documentation links.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((r) => (
            <div
              key={r._id}
              className="glass-panel p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-extrabold px-2.5 py-1 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {r.courseCode}
                    </span>
                    {r.chapterSegment && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
                        {r.chapterSegment}
                      </span>
                    )}
                    <span className="text-xs uppercase font-bold flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {getTypeIcon(r.type)} {r.type}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteResource(r._id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete Resource"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                  {r.title}
                </h3>

                {r.topicTitle && (
                  <p className="text-xs text-indigo-600 dark:text-cyan-400 font-medium">
                    Chapter Topic / Segment Topic: {r.topicTitle}
                  </p>
                )}

                {r.description && (
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {r.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>{r.source} • {r.duration || 'Flexible'}</span>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-indigo-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                >
                  Open Link <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Resource Modal */}
      {showAddModal && (
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Learning Resource">
          <form onSubmit={handleCreateResource} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Course</label>
                <select
                  required
                  value={formData.courseCode}
                  onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                >
                  {courses.map(c => (
                    <option key={c._id || c.code} value={c.code}>
                      {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Resource Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                >
                  <option value="video">Video Tutorial</option>
                  <option value="article">Article / Tutorial</option>
                  <option value="docs">Official Documentation</option>
                  <option value="pdf">PDF Lecture Notes</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Chapter / Segment No.
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chapter 1 or Segment A"
                  value={formData.chapterSegment}
                  onChange={(e) => setFormData({ ...formData, chapterSegment: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Chapter Topic / Segment Topic
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Binary Search Trees & AVL Rotations"
                  value={formData.topicTitle}
                  onChange={(e) => setFormData({ ...formData, topicTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Resource Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Complete Visual Guide to AVL Trees & Rotations"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Resource URL (Link)
              </label>
              <input
                type="url"
                required
                placeholder="https://youtube.com/watch?v=... or https://drive.google.com/..."
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Source / Platform</label>
                <input
                  type="text"
                  placeholder="e.g. YouTube, MIT OCW, GeeksforGeeks, Google Drive"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Duration / Length</label>
                <input
                  type="text"
                  placeholder="e.g. 18 mins or 24 pages"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Description (Optional)
              </label>
              <textarea
                rows="2"
                placeholder="Brief summary of why this resource is useful..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Save Resource'}
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
