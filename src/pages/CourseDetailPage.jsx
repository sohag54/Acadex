import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { ProgressBar } from '../components/common/ProgressBar';
import { LoadingState } from '../components/common/LoadingState';
import { Modal } from '../components/common/Modal';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  HelpCircle,
  FileQuestion,
  FolderGit2,
  BrainCircuit,
  ArrowLeft
} from 'lucide-react';

export const CourseDetailPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('mid'); // 'mid' | 'final' | 'pyq' | 'resources'
  const [midSyllabus, setMidSyllabus] = useState(null);
  const [finalSyllabus, setFinalSyllabus] = useState(null);
  const [pyqs, setPyqs] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const loadData = async () => {
    try {
      const [courseRes, midRes, finalRes, pyqRes, resRes] = await Promise.all([
        apiRequest(`/courses/${id}`),
        apiRequest(`/syllabus/${id}?examType=mid`),
        apiRequest(`/syllabus/${id}?examType=final`),
        apiRequest(`/pyq?courseCode=${id}`),
        apiRequest(`/resources?courseCode=${id}`)
      ]);
      setCourse(courseRes.course);
      setMidSyllabus(midRes);
      setFinalSyllabus(finalRes);
      setPyqs(pyqRes.pyqs || []);
      setResources(resRes.resources || []);
    } catch (err) {
      console.error('Error loading course details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleToggleTopic = async (topicId) => {
    try {
      await apiRequest(`/syllabus/topics/${topicId}/progress`, { method: 'PATCH' });
      // Reload syllabus states instantly
      loadData();
    } catch (err) {
      console.error('Toggle topic error:', err);
    }
  };

  if (loading || !course) {
    return <LoadingState message="Loading course syllabus workspace..." />;
  }

  const currentSyllabus = activeTab === 'mid' ? midSyllabus : finalSyllabus;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Back link */}
      <Link to="/my-semester" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400">
        <ArrowLeft className="w-4 h-4" /> Back to Courses
      </Link>

      {/* Course Header */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-mono">
                {course.code}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                {course.credits} Credits • {course.department}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{course.name}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Instructor: {course.instructor}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/practice?course=${course.code}`}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-md shadow-indigo-500/20 flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" /> Practice Topic Questions
            </Link>
          </div>
        </div>

        {/* Dual Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900/50">
            <ProgressBar progress={course.midProgress} label="Midterm Syllabus Progress" color="cyan" />
          </div>
          <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50">
            <ProgressBar progress={course.finalProgress} label="Final Syllabus Progress" color="indigo" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('mid')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'mid'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Mid Syllabus ({midSyllabus?.progressPercentage || 0}%)
        </button>

        <button
          onClick={() => setActiveTab('final')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'final'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Final Syllabus ({finalSyllabus?.progressPercentage || 0}%)
        </button>

        <button
          onClick={() => setActiveTab('pyq')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'pyq'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileQuestion className="w-4 h-4" /> PYQs ({pyqs.length})
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'resources'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FolderGit2 className="w-4 h-4" /> Resources ({resources.length})
        </button>
      </div>

      {/* Tab 1 & 2: Mid / Final Syllabus Accordions */}
      {(activeTab === 'mid' || activeTab === 'final') && (
        <div className="space-y-4">
          {currentSyllabus?.modules.map((module, idx) => (
            <div key={idx} className="glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="bg-slate-100/80 dark:bg-slate-900/80 px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                <span>{module.title}</span>
                <span className="text-xs font-semibold text-slate-500">
                  {module.topics.filter(t => t.isCompleted).length} / {module.topics.length} Complete
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {module.topics.map((topic) => (
                  <div key={topic._id} className="p-4 sm:px-6 flex items-start gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                    {/* Completion Checkbox */}
                    <button
                      onClick={() => handleToggleTopic(topic._id)}
                      className="mt-0.5 text-slate-400 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
                      title={topic.isCompleted ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {topic.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4
                          onClick={() => setSelectedTopic(topic)}
                          className={`text-sm font-bold cursor-pointer hover:text-indigo-600 dark:hover:text-cyan-400 ${
                            topic.isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {topic.title}
                        </h4>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {topic.examType}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {topic.description}
                      </p>

                      <div className="flex items-center gap-3 pt-1">
                        <button
                          onClick={() => setSelectedTopic(topic)}
                          className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          View Details & Learning Objectives
                        </button>
                        <Link
                          to={`/practice?course=${course.code}&topic=${topic.title}`}
                          className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          Practice Topic <Sparkles className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: PYQs */}
      {activeTab === 'pyq' && (
        <div className="space-y-4">
          {pyqs.map(p => (
            <div key={p._id} className="glass-panel p-5 rounded-3xl space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>{p.year} {p.examType.toUpperCase()} EXAM</span>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-mono">
                  {p.marks} Marks
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{p.questionText}</h4>
              <div className="p-3 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs whitespace-pre-wrap">
                <span className="text-emerald-400 font-bold block mb-1">Model Solution:</span>
                {p.solution}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Resources */}
      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {resources.map(r => (
            <div key={r._id} className="glass-panel p-5 rounded-3xl space-y-2">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {r.type} • {r.duration}
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{r.title}</h4>
              <p className="text-xs text-slate-500">{r.description}</p>
              <a
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="inline-block pt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Open External Resource →
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Topic Details Modal */}
      {selectedTopic && (
        <Modal isOpen={!!selectedTopic} onClose={() => setSelectedTopic(null)} title={selectedTopic.title}>
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-600">{selectedTopic.moduleTitle}</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold uppercase">
                {selectedTopic.examType} Syllabus
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{selectedTopic.description}</p>
            
            <div className="space-y-2">
              <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Learning Objectives:
              </h5>
              <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                {(selectedTopic.learningObjectives || []).map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={() => {
                  handleToggleTopic(selectedTopic._id);
                  setSelectedTopic(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
              >
                {selectedTopic.isCompleted ? 'Mark Incomplete' : 'Mark Completed ✓'}
              </button>
              <Link
                to={`/practice?course=${course.code}&topic=${selectedTopic.title}`}
                onClick={() => setSelectedTopic(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700"
              >
                Start Practice Set
              </Link>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
