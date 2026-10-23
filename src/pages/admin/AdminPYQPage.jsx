import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { LoadingState } from '../../components/common/LoadingState';
import { Modal } from '../../components/common/Modal';
import {
  FileQuestion,
  Plus,
  Trash2,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Upload,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  X,
  Sparkles,
  Edit3
} from 'lucide-react';

export const AdminPYQPage = () => {
  const [pyqs, setPyqs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExtractModal, setShowExtractModal] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extractedQuestions, setExtractedQuestions] = useState([]);
  const [extractedFileInfo, setExtractedFileInfo] = useState({ fileName: '', fileUrl: '' });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const initialForm = {
    courseCode: '',
    courseName: '',
    semester: 5,
    examType: 'mid',
    year: new Date().getFullYear(),
    marks: 10,
    difficulty: 'medium',
    keyConcept: '',
    questionText: '',
    solution: ''
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchCourses = async () => {
    try {
      const res = await apiRequest('/courses');
      const list = res.courses || [];
      setCourses(list);
      if (list.length > 0 && !formData.courseCode) {
        setFormData(prev => ({
          ...prev,
          courseCode: list[0].code,
          courseName: list[0].name,
          semester: list[0].semester || 5
        }));
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchPYQs = async () => {
    setLoading(true);
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

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchPYQs();
  }, [selectedCourse, selectedExamType]);

  const handleCourseChange = (e) => {
    const code = e.target.value;
    const found = courses.find(c => c.code === code);
    setFormData(prev => ({
      ...prev,
      courseCode: code,
      courseName: found ? found.name : code,
      semester: found ? found.semester : prev.semester
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Auto-fill question text if empty
      if (!formData.questionText.trim()) {
        const year = formData.year || new Date().getFullYear();
        const exam = (formData.examType || 'Mid').toUpperCase();
        setFormData(prev => ({
          ...prev,
          questionText: `${prev.courseCode || 'Course'} ${exam} Exam Question Paper (${year})`
        }));
      }
    }
  };

  const handleCreatePYQ = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      const body = new FormData();
      body.append('courseCode', formData.courseCode);
      body.append('courseName', formData.courseName);
      body.append('semester', formData.semester);
      body.append('examType', formData.examType);
      body.append('year', formData.year);
      body.append('marks', formData.marks);
      body.append('difficulty', formData.difficulty);
      body.append('keyConcept', formData.keyConcept);
      body.append('questionText', formData.questionText);
      body.append('solution', formData.solution);

      if (selectedFile) {
        body.append('file', selectedFile);
      }

      await apiRequest('/pyq', {
        method: 'POST',
        body
      });

      setShowAddModal(false);
      setSelectedFile(null);
      setFormData(prev => ({
        ...initialForm,
        courseCode: courses[0]?.code || '',
        courseName: courses[0]?.name || ''
      }));
      setFeedback({ type: 'success', text: 'Previous Year Question & paper uploaded successfully!' });
      fetchPYQs();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to create PYQ.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePYQ = async (id) => {
    if (!window.confirm('Are you sure you want to delete this PYQ?')) return;
    try {
      await apiRequest(`/pyq/${id}`, { method: 'DELETE' });
      setFeedback({ type: 'success', text: 'PYQ deleted successfully.' });
      fetchPYQs();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to delete PYQ.' });
    }
  };

  const handleExtractPDF = async (e) => {
    if (e) e.preventDefault();
    if (!selectedFile) {
      alert('Please select a PDF exam paper file first.');
      return;
    }
    setExtracting(true);
    setFeedback(null);
    try {
      const body = new FormData();
      body.append('file', selectedFile);
      body.append('courseCode', formData.courseCode || (courses[0]?.code || ''));

      const res = await apiRequest('/pyq/extract-pdf', {
        method: 'POST',
        body
      });

      if (res.questions && res.questions.length > 0) {
        setExtractedQuestions(res.questions);
        setExtractedFileInfo({
          fileName: res.fileName || selectedFile.name,
          fileUrl: res.fileUrl || ''
        });
        setShowAddModal(false);
        setShowExtractModal(true);
        setFeedback({
          type: 'success',
          text: `AI successfully extracted ${res.questions.length} questions from ${selectedFile.name}! You can now review and edit each question below.`
        });
      } else {
        alert('Could not automatically identify individual questions in this file. You can still publish it directly as an attached question paper.');
      }
    } catch (err) {
      console.error('Extract PDF error:', err);
      alert(err.message || 'Failed to extract questions from PDF.');
    } finally {
      setExtracting(false);
    }
  };

  const handleUpdateExtractedQ = (index, field, value) => {
    setExtractedQuestions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleDeleteExtractedQ = (index) => {
    setExtractedQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddExtractedQ = () => {
    setExtractedQuestions(prev => [
      ...prev,
      {
        id: `manual-${Date.now()}`,
        questionText: '',
        marks: 10,
        keyConcept: formData.courseCode ? `${formData.courseCode} Core Concept` : 'Core Concept',
        solution: ''
      }
    ]);
  };

  const handleSaveAllExtracted = async () => {
    if (extractedQuestions.length === 0) {
      alert('No questions to save.');
      return;
    }
    setSubmitting(true);
    try {
      await apiRequest('/pyq/bulk-save', {
        method: 'POST',
        body: JSON.stringify({
          courseCode: formData.courseCode,
          courseName: formData.courseName,
          semester: formData.semester,
          examType: formData.examType,
          year: formData.year,
          fileName: extractedFileInfo.fileName,
          fileUrl: extractedFileInfo.fileUrl,
          questions: extractedQuestions
        })
      });

      setShowExtractModal(false);
      setExtractedQuestions([]);
      setSelectedFile(null);
      setFeedback({
        type: 'success',
        text: `Successfully saved ${extractedQuestions.length} verified questions into the Question & Mock Test Bank!`
      });
      fetchPYQs();
    } catch (err) {
      console.error('Bulk save error:', err);
      alert(err.message || 'Failed to save questions.');
    } finally {
      setSubmitting(false);
    }
  };

  const getFileBadge = (pyq) => {
    if (!pyq.fileUrl) return null;
    const isImage = pyq.fileType === 'image';
    const isPDF = pyq.fileType === 'pdf';
    const isDoc = pyq.fileType === 'doc';

    const fullUrl = pyq.fileUrl.startsWith('http') ? pyq.fileUrl : `http://localhost:5000${pyq.fileUrl}`;

    return (
      <a
        href={fullUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-700 dark:text-indigo-300 font-semibold hover:bg-indigo-100 transition-colors"
      >
        {isImage && <ImageIcon className="w-4 h-4 text-emerald-500" />}
        {isPDF && <FileText className="w-4 h-4 text-rose-500" />}
        {isDoc && <FileText className="w-4 h-4 text-cyan-500" />}
        {!isImage && !isPDF && !isDoc && <Upload className="w-4 h-4 text-indigo-500" />}
        <span className="truncate max-w-[200px]">{pyq.fileName || 'Attached Exam Paper'}</span>
        {pyq.fileSize && <span className="text-[10px] text-slate-400">({pyq.fileSize})</span>}
        <ExternalLink className="w-3.5 h-3.5 ml-1" />
      </a>
    );
  };

  if (loading && courses.length === 0) {
    return <LoadingState message="Loading PYQ management system..." />;
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-rose-500" /> Previous Year Questions (PYQ) Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Upload question paper documents (PDF, DOC, Images) and model answers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              if (courses.length === 0) {
                alert('Please create at least one course first in the "Courses Management" tab.');
                return;
              }
              setShowAddModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-700 hover:to-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-500/20 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> ⚡ Auto-Extract Questions from PDF
          </button>
          
          <button
            onClick={() => {
              if (courses.length === 0) {
                alert('Please create at least one course first in the "Courses Management" tab.');
                return;
              }
              setShowAddModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Manual Paper Upload
          </button>
        </div>
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

      {/* PYQ List */}
      {pyqs.length === 0 ? (
        <div className="p-12 text-center rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-3">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Previous Year Questions Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {courses.length === 0
              ? 'Please add courses first before publishing previous year exam questions.'
              : 'Click "Add / Upload Past Exam Paper" above to upload PDF, Word documents or question photos.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pyqs.map((p) => (
            <div
              key={p._id}
              className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-extrabold px-2.5 py-1 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {p.courseCode}
                  </span>
                  <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                    {p.examType} Exam • {p.year}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    Marks: {p.marks}
                  </span>
                </div>

                <button
                  onClick={() => handleDeletePYQ(p._id)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Delete PYQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {p.keyConcept && (
                <div className="text-xs font-semibold text-slate-500">
                  Concept: <span className="text-slate-800 dark:text-slate-200">{p.keyConcept}</span>
                </div>
              )}

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Question / Paper Title:</p>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                  {p.questionText}
                </h4>
              </div>

              {/* Attached file link / badge */}
              {p.fileUrl && (
                <div className="pt-1">
                  <span className="text-xs font-bold text-slate-400 block mb-1">Attached Exam Paper:</span>
                  {getFileBadge(p)}
                </div>
              )}

              {p.solution && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                    Model Solution / Notes:
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-mono">
                    {p.solution}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Upload PYQ Modal */}
      {showAddModal && (
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Upload Past Exam Question Paper">
          <form onSubmit={handleCreatePYQ} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Course</label>
                <select
                  required
                  value={formData.courseCode}
                  onChange={handleCourseChange}
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

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Exam Year</label>
                <input
                  type="number"
                  required
                  min={2018}
                  max={2030}
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>
            </div>

            {/* File Upload Zone */}
            <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Upload Question Paper File (PDF, DOC/DOCX, or Image)
              </label>

              {selectedFile ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                    <FileText className="w-5 h-5" />
                    <div>
                      <p className="font-bold text-xs truncate max-w-[280px]">{selectedFile.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'Document'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="p-1 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900 text-slate-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center py-4 px-2 text-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
                  <Upload className="w-7 h-7 text-indigo-500 mb-1.5" />
                  <span className="font-bold text-slate-700 dark:text-slate-300">Click to choose PDF, Word file, or Image</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">Supports .pdf, .doc, .docx, .png, .jpg, .webp up to 30MB</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,.txt"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>

            {selectedFile && selectedFile.name.toLowerCase().endsWith('.pdf') && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-rose-500/10 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-bold text-xs text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-rose-500" />
                    Auto-Extract Questions & Edit via AI
                  </div>
                  <p className="text-[11px] text-slate-500">
                    AI will extract all individual questions from this PDF for you to review and edit before saving!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExtractPDF}
                  disabled={extracting}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-700 hover:to-rose-700 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {extracting ? 'Extracting Questions...' : '⚡ Extract & Review Questions'}
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Marks</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={100}
                  value={formData.marks}
                  onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Key Concept (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Graph Traversal, Bellman-Ford"
                  value={formData.keyConcept}
                  onChange={(e) => setFormData({ ...formData, keyConcept: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Exam Question / Title {selectedFile ? '(Optional if file is attached)' : '(Required)'}
              </label>
              <textarea
                rows={selectedFile ? 2 : 3}
                placeholder="Enter specific question text or paper title..."
                value={formData.questionText}
                onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Model Solution / Explanation (Optional if paper file is attached)
              </label>
              <textarea
                rows={selectedFile ? 2 : 4}
                placeholder="Write the clear model answer or instructions for students..."
                value={formData.solution}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono"
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
                {submitting ? 'Uploading...' : 'Publish Question Paper'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Review & Edit Extracted Questions Modal */}
      {showExtractModal && (
        <Modal
          isOpen={showExtractModal}
          onClose={() => {
            if (window.confirm('Close question editor? Any unsaved edits will be lost.')) {
              setShowExtractModal(false);
            }
          }}
          title={`Review & Edit Extracted Questions (${extractedQuestions.length})`}
        >
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs space-y-1">
              <span className="font-extrabold text-indigo-800 dark:text-indigo-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-rose-500" /> AI Question Extraction from {extractedFileInfo.fileName}
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                You have full control to edit question text, modify marks, adjust syllabus topics, or add model answers. You can also delete unwanted questions or add new ones.
              </p>
            </div>

            <div className="space-y-4">
              {extractedQuestions.map((q, idx) => (
                <div
                  key={q.id || idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 text-xs">
                    <span className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-indigo-500" /> Question {idx + 1}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">Marks:</label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={q.marks || 10}
                          onChange={(e) => handleUpdateExtractedQ(idx, 'marks', e.target.value)}
                          className="w-16 px-2 py-1 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteExtractedQ(idx)}
                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950 transition-colors"
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Key Concept / Topic</label>
                    <input
                      type="text"
                      placeholder="e.g. Binary Search Tree, Time Complexity"
                      value={q.keyConcept || ''}
                      onChange={(e) => handleUpdateExtractedQ(idx, 'keyConcept', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Question Text</label>
                    <textarea
                      rows="3"
                      value={q.questionText || ''}
                      onChange={(e) => handleUpdateExtractedQ(idx, 'questionText', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Model Solution / Explanation (Optional)</label>
                    <textarea
                      rows="2"
                      value={q.solution || ''}
                      onChange={(e) => handleUpdateExtractedQ(idx, 'solution', e.target.value)}
                      placeholder="Model solution or notes for exam evaluation..."
                      className="w-full px-3 py-2 rounded-xl text-xs font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={handleAddExtractedQ}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Another Question
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowExtractModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAllExtracted}
                  disabled={submitting || extractedQuestions.length === 0}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {submitting ? 'Saving to Bank...' : `Confirm & Save All (${extractedQuestions.length}) Questions`}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
