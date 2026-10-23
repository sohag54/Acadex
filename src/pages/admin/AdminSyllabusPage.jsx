import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { LoadingState } from '../../components/common/LoadingState';
import { Modal } from '../../components/common/Modal';
import { BookOpenCheck, Plus, AlertCircle, BookOpen } from 'lucide-react';

export const AdminSyllabusPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    courseCode: '',
    examType: 'mid',
    moduleTitle: 'Chapter 1',
    title: '',
    description: '',
    objectivesText: ''
  });

  // 1. Fetch available admin courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await apiRequest('/courses');
        const list = res.courses || [];
        setCourses(list);
        if (list.length > 0) {
          setSelectedCourse(list[0].code);
          setFormData(prev => ({ ...prev, courseCode: list[0].code }));
        }
      } catch (err) {
        console.error('Error fetching admin courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // 2. Fetch topics for selected course
  const fetchSyllabusTopics = async () => {
    if (!selectedCourse) {
      setTopics([]);
      return;
    }
    try {
      const res = await apiRequest(`/syllabus/${selectedCourse}`);
      const all = [];
      (res.modules || []).forEach(m => {
        m.topics.forEach(t => all.push({ ...t, moduleTitle: m.title }));
      });
      setTopics(all);
    } catch (err) {
      console.error('Error fetching admin syllabus:', err);
      setTopics([]);
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      fetchSyllabusTopics();
    }
  }, [selectedCourse]);

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    try {
      await apiRequest('/admin/topics', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          learningObjectives: formData.objectivesText.split('\n').filter(Boolean)
        })
      });
      setShowAddModal(false);
      setFormData(prev => ({
        ...prev,
        title: '',
        description: '',
        objectivesText: ''
      }));
      fetchSyllabusTopics();
    } catch (err) {
      console.error('Error creating topic:', err);
    }
  };

  if (loading) return <LoadingState message="Loading syllabus topics manager..." />;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-6 rounded-3xl">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-indigo-500" /> Syllabus Topics & Modules Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure independent Mid and Final syllabus structures per course.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {courses.length > 0 && (
            <select
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setFormData(prev => ({ ...prev, courseCode: e.target.value }));
              }}
              className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
            >
              {courses.map(c => (
                <option key={c._id || c.code} value={c.code}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            disabled={courses.length === 0}
            className="px-4 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> Add Syllabus Topic
          </button>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="p-12 text-center rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Courses Added Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Please add courses in the "Course Catalog" tab first before configuring syllabus topics.
          </p>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Exam Type</th>
                  <th className="px-6 py-4">Chapter / Segment No.</th>
                  <th className="px-6 py-4">Chapter Topic / Segment Topic</th>
                  <th className="px-6 py-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                {topics.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-400">
                      No topics added for course {selectedCourse} yet. Click "Add Syllabus Topic" above to create one.
                    </td>
                  </tr>
                ) : (
                  topics.map((t) => (
                    <tr key={t._id}>
                      <td className="px-6 py-4 font-bold uppercase text-indigo-600">{t.examType}</td>
                      <td className="px-6 py-4 font-semibold">{t.moduleTitle}</td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{t.title}</td>
                      <td className="px-6 py-4 text-slate-500">{t.description}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAddModal && (
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Syllabus Topic">
          <form onSubmit={handleCreateTopic} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Course Code</label>
                <select
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
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Exam Type</label>
                <select
                  value={formData.examType}
                  onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                >
                  <option value="mid">Mid Exam</option>
                  <option value="final">Final Exam</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Chapter / Segment No.</label>
              <input
                type="text"
                required
                placeholder="e.g. Chapter 1 or Segment A"
                value={formData.moduleTitle}
                onChange={(e) => setFormData({ ...formData, moduleTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Chapter Topic / Segment Topic</label>
              <input
                type="text"
                required
                placeholder="e.g. Circular Queue Implementation"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea
                rows="2"
                placeholder="Brief summary of the concept and expected mastery"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Learning Objectives (1 per line)
              </label>
              <textarea
                rows="3"
                placeholder="Understand enqueue and dequeue operations&#10;Implement modulo wraparound arithmetic"
                value={formData.objectivesText}
                onChange={(e) => setFormData({ ...formData, objectivesText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
              >
                Save Topic
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
