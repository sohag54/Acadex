import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { LoadingState } from '../../components/common/LoadingState';
import { Modal } from '../../components/common/Modal';
import { Library, Plus, Pencil, Trash2, AlertCircle, BookOpen, User } from 'lucide-react';

export const AdminCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const initialForm = {
    code: '',
    name: '',
    credits: 3.0,
    department: 'CSE',
    semester: 5,
    instructor: '',
    description: ''
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchCourses = async () => {
    try {
      const res = await apiRequest('/courses');
      setCourses(res.courses || []);
    } catch (err) {
      console.error('Error fetching admin courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setFeedback(null);
    try {
      await apiRequest('/admin/courses', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setShowAddModal(false);
      setFormData(initialForm);
      setFeedback({ type: 'success', text: `Course "${formData.code}" created successfully!` });
      fetchCourses();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Error creating course.' });
    }
  };

  const handleOpenEdit = (course) => {
    setSelectedCourse(course);
    setFormData({
      code: course.code,
      name: course.name,
      credits: course.credits || 3.0,
      department: course.department || 'CSE',
      semester: course.semester || 5,
      instructor: course.instructor || '',
      description: course.description || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setFeedback(null);
    try {
      const courseId = selectedCourse._id || selectedCourse.id || selectedCourse.code;
      await apiRequest(`/admin/courses/${courseId}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      setShowEditModal(false);
      setSelectedCourse(null);
      setFormData(initialForm);
      setFeedback({ type: 'success', text: `Course "${formData.code}" updated successfully!` });
      fetchCourses();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Error updating course.' });
    }
  };

  const handleDeleteCourse = async (course) => {
    if (!window.confirm(`Are you sure you want to delete "${course.code} - ${course.name}"?`)) {
      return;
    }
    setFeedback(null);
    try {
      const courseId = course._id || course.id || course.code;
      await apiRequest(`/admin/courses/${courseId}`, {
        method: 'DELETE'
      });
      setFeedback({ type: 'success', text: `Course "${course.code}" has been deleted.` });
      fetchCourses();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Error deleting course.' });
    }
  };

  if (loading) return <LoadingState message="Loading courses management..." />;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Library className="w-5 h-5 text-cyan-500" /> Course Catalog Administration
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create, update, assign teachers, or delete academic university courses.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData(initialForm);
            setShowAddModal(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-md flex items-center gap-2 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add New Course
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold ${
          feedback.type === 'success'
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
            : 'bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400'
        }`}>
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="ml-auto opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Courses Table / Empty State */}
      {courses.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Courses in Catalog</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              All previous dummy courses have been cleared. Click below to add your real university courses and instructors!
            </p>
          </div>
          <button
            onClick={() => {
              setFormData(initialForm);
              setShowAddModal(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-md inline-flex items-center gap-2 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Your First Course
          </button>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Course Name</th>
                  <th className="px-6 py-4">Credits</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Semester</th>
                  <th className="px-6 py-4">Instructor (Teacher)</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                {courses.map((c) => (
                  <tr key={c.code || c._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{c.code}</td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{c.name}</td>
                    <td className="px-6 py-4">{c.credits} Credits</td>
                    <td className="px-6 py-4 font-semibold">{c.department || 'CSE'}</td>
                    <td className="px-6 py-4">Semester {c.semester}</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{c.instructor || 'Unassigned'}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white dark:bg-indigo-950/50 dark:text-indigo-400 dark:hover:bg-indigo-600 dark:hover:text-white transition-colors"
                          title="Edit / Update Course"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(c)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white dark:bg-rose-950/50 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white transition-colors"
                          title="Delete Course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showAddModal && (
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Create New Course">
          <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Course Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CSE-301"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Course Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Credits</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: parseFloat(e.target.value) || 3.0 })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Semester</label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                >
                  {['CSE', 'EEE', 'CCE', 'ETE', 'BBA', 'QSIS'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Instructor / Teacher Name</label>
              <input
                type="text"
                placeholder="e.g. Dr. Muhammad Ashikur Rahman"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Course Description (Optional)</label>
              <textarea
                rows={2}
                placeholder="Brief summary of syllabus & learning goals..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-md transition-transform active:scale-95"
            >
              Save Course
            </button>
          </form>
        </Modal>
      )}

      {/* Edit Course Modal */}
      {showEditModal && selectedCourse && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title={`Edit Course: ${selectedCourse.code}`}>
          <form onSubmit={handleUpdateCourse} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Course Code</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Course Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Credits</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: parseFloat(e.target.value) || 3.0 })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Semester</label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                >
                  {['CSE', 'EEE', 'CCE', 'ETE', 'BBA', 'QSIS'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Instructor / Teacher Name</label>
              <input
                type="text"
                placeholder="Faculty Name"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Course Description</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-md transition-transform active:scale-95"
              >
                Update Course
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
