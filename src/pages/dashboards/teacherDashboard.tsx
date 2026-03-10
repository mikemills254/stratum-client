import React, { useState, useEffect, useRef } from 'react';
import { Users, FileText, CheckCircle, MessageSquare, Send, Plus, Pencil, Trash2, ChevronRight, ChevronDown, HelpCircle } from 'lucide-react';
import Editor from '../../components/ui/editor';
import { handleGetWorksheetsByWorkbook, handleDeleteWorksheet } from '../../api/worksheet';
import { handleDeleteQuestion } from '../../api/question';
import { handleGetWorkbookStats } from '../../api/workbook';
import { handleCreateAnnotation, handleDeleteAnnotation, handleUpdateAnnotation } from '../../api/annotation';
import { handleAssignGrade } from '../../api/grade';
import CreateWorksheetModal from '../../components/dashboard/createWorksheetModal';
import EditWorksheetModal from '../../components/dashboard/editWorksheetModal';
import CreateQuestionModal from '../../components/dashboard/createQuestionModal';
import EditQuestionModal from '../../components/dashboard/editQuestionModal';
import ActivityLog from '../../components/dashboard/activityLog';
import { type Worksheet as IWorksheet, type Question as IQuestion } from '../../types/worksheets';

import type { Worksheet, Question } from '../../types/worksheets';
import type { IAnswer } from '../../types/answers';
import type { IWorkbookStats } from '../../types/workbooks';
import { api } from '../../utilities/config';

interface TeacherDashboardProps {
    workbookId: string;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ workbookId }) => {
    const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
    const [selectedWorksheet, setSelectedWorksheet] = useState<Worksheet | null>(null);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
    const [answers, setAnswers] = useState<IAnswer[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<IAnswer | null>(null);
    const [loading, setLoading] = useState(true);
    const [grading, setGrading] = useState({ score: '', feedback: '' });
    const [newAnnotationText, setNewAnnotationText] = useState('');
    const [isSubmittingAnnotation, setIsSubmittingAnnotation] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [worksheetToEdit, setWorksheetToEdit] = useState<IWorksheet | null>(null);
    const [isCreateQuestionModalOpen, setIsCreateQuestionModalOpen] = useState(false);
    const [isEditQuestionModalOpen, setIsEditQuestionModalOpen] = useState(false);
    const [questionToEdit, setQuestionToEdit] = useState<IQuestion | null>(null);
    const [stats, setStats] = useState<IWorkbookStats | null>(null);
    const editorRef = useRef<any>(null);


    const fetchWorksheets = async () => {
        try {
            const results = await handleGetWorksheetsByWorkbook(workbookId);
            if (results.success && results.data) {
                const fetchedWorksheets = results.data as unknown as Worksheet[];
                setWorksheets(fetchedWorksheets);

                // Sync selectedWorksheet with latest data
                if (selectedWorksheet) {
                    const updatedWs = fetchedWorksheets.find(ws => ws.id === selectedWorksheet.id);
                    if (updatedWs) {
                        setSelectedWorksheet(updatedWs as Worksheet);
                        // Also sync selectedQuestion within that worksheet
                        if (selectedQuestion) {
                            const updatedQ = updatedWs.questions?.find(q => q.id === selectedQuestion.id);
                            if (updatedQ) {
                                setSelectedQuestion(updatedQ as Question);
                            }
                        }
                    }
                } else if (fetchedWorksheets.length > 0) {
                    // Default selection on first load
                    const firstWorksheet = fetchedWorksheets[0];
                    setSelectedWorksheet(firstWorksheet as Worksheet);
                    if (firstWorksheet.questions && firstWorksheet.questions.length > 0) {
                        setSelectedQuestion(firstWorksheet.questions[0] as Question);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching worksheets:', error);
        }
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                await fetchWorksheets();
                const statsRes = await handleGetWorkbookStats(workbookId);
                if (statsRes.success && statsRes.data) {
                    setStats(statsRes.data);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [workbookId]);

    useEffect(() => {
        if (selectedQuestion) {
            const fetchAnswers = async () => {
                try {
                    const res = await api.get(`/answer/question/${selectedQuestion.id}`);
                    setAnswers(res.data.data || []);
                    setSelectedAnswer(null); // Reset answer when question changes
                } catch (error) {
                    console.error('Error fetching answers:', error);
                }
            };
            fetchAnswers();
        }
    }, [selectedQuestion]);

    useEffect(() => {
        if (selectedAnswer) {
            setGrading({
                score: selectedAnswer.grade?.score.toString() || '',
                feedback: selectedAnswer.grade?.feedback || ''
            });
        }
    }, [selectedAnswer]);



    const handleGradeSubmit = async () => {
        if (!selectedAnswer) return;
        try {
            const res = await handleAssignGrade({
                answerId: selectedAnswer.id,
                score: Number(grading.score),
                feedback: grading.feedback
            });

            if (res.success && res.data) {
                const updatedAnswer = {
                    ...selectedAnswer,
                    grade: res.data,
                    status: 'GRADED' as any // Backend updates status too
                };
                setSelectedAnswer(updatedAnswer);
                setAnswers(answers.map(a => a.id === updatedAnswer.id ? updatedAnswer : a));
                alert('Grade submitted for approval');
            } else {
                alert(res.message || 'Error submitting grade');
            }
        } catch (error) {
            alert('Error submitting grade');
        }
    };

    const handleAnnotationSubmit = async () => {
        if (!selectedAnswer || !newAnnotationText.trim()) return;
        setIsSubmittingAnnotation(true);
        try {
            const res = await handleCreateAnnotation({
                answerId: selectedAnswer.id,
                comment: newAnnotationText
            });

            if (res.success && res.data) {
                const newAnnotation = res.data;
                // Broadcast via Yjs for instant feedback
                editorRef.current?.addAnnotation(newAnnotation);

                const updatedAnswer = {
                    ...selectedAnswer,
                    annotations: [...(selectedAnswer.annotations || []), newAnnotation]
                };
                setSelectedAnswer(updatedAnswer);
                setAnswers(answers.map(a => a.id === updatedAnswer.id ? updatedAnswer : a));
                setNewAnnotationText('');
            } else {
                alert(res.message || 'Error adding annotation');
            }
        } finally {
            setIsSubmittingAnnotation(false);
        }
    };

    const handleAnnotationDelete = async (annotationId: string) => {
        if (!confirm('Are you sure you want to delete this annotation?')) return;
        try {
            const res = await handleDeleteAnnotation(annotationId);
            if (res.success) {
                if (selectedAnswer) {
                    const updatedAnswer = {
                        ...selectedAnswer,
                        annotations: selectedAnswer.annotations.filter(a => a.id !== annotationId)
                    };
                    setSelectedAnswer(updatedAnswer);
                    setAnswers(answers.map(a => a.id === updatedAnswer.id ? updatedAnswer : a));
                }
            } else {
                alert(res.message);
            }
        } catch (error) {
            alert('Error deleting annotation');
        }
    };

    const handleAnnotationEdit = async (annotationId: string, currentComment: string) => {
        const newComment = prompt('Edit annotation:', currentComment);
        if (newComment === null || newComment === currentComment) return;

        try {
            const res = await handleUpdateAnnotation(annotationId, { comment: newComment });
            if (res.success && res.data) {
                if (selectedAnswer) {
                    const updatedAnswer = {
                        ...selectedAnswer,
                        annotations: selectedAnswer.annotations.map(a => a.id === annotationId ? res.data : a)
                    };
                    setSelectedAnswer(updatedAnswer);
                    setAnswers(answers.map(a => a.id === updatedAnswer.id ? updatedAnswer : a));
                }
            } else {
                alert(res.message);
            }
        } catch (error) {
            alert('Error updating annotation');
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
            try {
                const result = await handleDeleteWorksheet(id);
                if (result.success) {
                    fetchWorksheets();
                    if (selectedWorksheet?.id === id) {
                        setSelectedWorksheet(null);
                        setSelectedQuestion(null);
                    }
                } else {
                    alert(result.message);
                }
            } catch (error) {
                alert('An error occurred while deleting the worksheet');
            }
        }
    };

    const handleEditClick = (ws: Worksheet) => {
        setWorksheetToEdit({
            ...ws,
            workbookId,
            teacherId: '', // Not strictly needed for the edit modal
            createdAt: new Date(),
            updatedAt: new Date()
        } as IWorksheet);
        setIsEditModalOpen(true);
    };

    const handleDeleteQuestionClick = async (id: string, text: string) => {
        if (confirm(`Are you sure you want to delete this question: "${text.substring(0, 30)}..."?`)) {
            try {
                const result = await handleDeleteQuestion(id);
                if (result.success) {
                    fetchWorksheets();
                    if (selectedQuestion?.id === id) {
                        setSelectedQuestion(null);
                        setSelectedAnswer(null);
                    }
                } else {
                    alert(result.message);
                }
            } catch (error) {
                alert('An error occurred while deleting the question');
            }
        }
    };

    const handleEditQuestionClick = (q: Question) => {
        setQuestionToEdit({
            ...q,
            worksheetId: selectedWorksheet?.id || ''
        } as IQuestion);
        setIsEditQuestionModalOpen(true);
    };

    if (loading) return <div className="p-10 text-center font-mono animate-pulse uppercase tracking-widest text-text-dim">Loading Teacher Dashboard...</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[800px]">
            {/* Left Sidebar: Navigator */}
            <div className="lg:col-span-4 space-y-6">
                <div className="p-5 bg-surface border border-white/5 rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-amber">
                            <FileText className="h-4 w-4" />
                            <h3 className="font-syne text-[12px] font-bold uppercase tracking-wider">Curriculum</h3>
                        </div>
                        {stats && (
                            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                                <Users className="h-3 w-3 text-emerald-400" />
                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">{stats.studentCount} Students</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="p-1.5 rounded-lg bg-amber/10 border border-amber/20 text-amber hover:bg-amber/20 transition-all"
                                title="Add Worksheet"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {worksheets.map((ws: Worksheet) => (
                            <div key={ws.id} className="group/ws">
                                {/* Worksheet Item */}
                                <div className={`flex items-center gap-3 p-3 rounded-2xl transition-all border ${selectedWorksheet?.id === ws.id ? 'bg-white/5 border-white/10 shadow-lg' : 'border-transparent hover:bg-white/5'}`}>
                                    <button
                                        onClick={() => setSelectedWorksheet(ws)}
                                        className="flex-1 text-left flex items-center gap-3 min-w-0 cursor-pointer"
                                    >
                                        <div className={`p-2 rounded-xl transition-colors ${selectedWorksheet?.id === ws.id ? 'bg-amber text-bg' : 'bg-white/5 text-text-dim group-hover/ws:text-text'}`}>
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`text-[13px] font-bold truncate ${selectedWorksheet?.id === ws.id ? 'text-text' : 'text-text-mid group-hover/ws:text-text'}`}>
                                                {ws.title}
                                            </p>
                                            <p className="text-[10px] text-text-dim font-mono uppercase tracking-wider">
                                                {ws.questions?.length || 0} Questions
                                            </p>
                                        </div>
                                    </button>

                                    <div className={`flex items-center gap-1 transition-all duration-300 ${selectedWorksheet?.id === ws.id ? 'opacity-100' : 'opacity-0 group-hover/ws:opacity-100'}`}>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleEditClick(ws); }}
                                            className="p-1.5 rounded-lg text-text-dim hover:text-amber hover:bg-amber/10 transition-all"
                                            title="Edit Worksheet"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(ws.id, ws.title); }}
                                            className="p-1.5 rounded-lg text-text-dim hover:text-red-400 hover:bg-red-400/10 transition-all"
                                            title="Delete Worksheet"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Questions Nested List */}
                                {selectedWorksheet?.id === ws.id && (
                                    <div className="mt-2 ml-5 pl-4 border-l-2 border-white/5 space-y-1 relative">
                                        {ws.questions?.map((q: Question, i: number) => (
                                            <div key={q.id} className="group/q flex items-center gap-2 relative cursor-pointer">
                                                <div className="absolute -left-[18px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/10 group-hover/q:bg-amber/40 transition-colors" />

                                                <button
                                                    onClick={() => setSelectedQuestion(q)}
                                                    className={`flex-1 text-left text-[12px] py-2 px-3 rounded-xl transition-all truncate cursor-pointer flex items-center gap-2 ${selectedQuestion?.id === q.id ? 'text-amber font-bold' : 'text-text-dim hover:text-text'}`}
                                                >
                                                    <HelpCircle className="h-3 w-3 opacity-50" />
                                                    <span className="truncate">Q{i + 1}: {q.text}</span>
                                                </button>

                                                <div className={`flex items-center gap-1 transition-all duration-300 ${selectedQuestion?.id === q.id ? 'opacity-100' : 'opacity-0 group-hover/q:opacity-100'}`}>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleEditQuestionClick(q); }}
                                                        className="p-1.5 rounded-lg text-text-dim hover:text-amber hover:bg-amber/10 transition-all"
                                                    >
                                                        <Pencil className="h-3 w-3" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteQuestionClick(q.id, q.text); }}
                                                        className="p-1.5 rounded-lg text-text-dim hover:text-red-400 hover:bg-red-400/10 transition-all"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            onClick={() => setIsCreateQuestionModalOpen(true)}
                                            className="w-full mt-2 text-left text-[11px] font-bold text-amber/40 hover:text-amber px-3 py-2 flex items-center gap-2 rounded-xl hover:bg-amber/5 transition-all border border-dashed border-transparent hover:border-amber/20"
                                        >
                                            <Plus className="h-3 w-3" />
                                            Add New Question
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity Log */}
                <ActivityLog workbookId={workbookId} title="Workbook Activity" limit={8} />
            </div>

            <div className="lg:col-span-8 space-y-6">
                {selectedAnswer ? (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                        {/* Header with Back Button */}
                        <div className="flex items-center justify-between p-6 bg-surface border border-white/5 rounded-2xl shadow-xl shadow-black/20">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setSelectedAnswer(null)}
                                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-text-dim hover:text-text transition-all border border-white/5"
                                    title="Back to submissions"
                                >
                                    <ChevronDown className="h-4 w-4 rotate-90" />
                                </button>
                                <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex flex-shrink-0 items-center justify-center text-emerald-400 font-bold text-lg overflow-hidden">
                                    {selectedAnswer.student?.avatarUrl ? (
                                        <img src={selectedAnswer.student.avatarUrl} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        selectedAnswer.student?.username?.charAt(0).toUpperCase() || '?'
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-[20px] font-bold text-text">
                                        {selectedAnswer.student?.username}
                                    </h2>
                                    <p className="text-[12px] text-text-dim">{selectedAnswer.student?.email}</p>
                                </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${selectedAnswer.status === 'SUBMITTED' ? 'bg-amber/10 border-amber/20 text-amber' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                                {selectedAnswer.status}
                            </div>
                        </div>

                        <div className="p-8 bg-surface border border-white/5 rounded-2xl space-y-6">
                            <div className="flex items-center justify-between mb-2">
                                <label className="font-mono text-[10px] text-text-dim uppercase tracking-[0.2em]">Student Response</label>
                            </div>
                            <Editor
                                ref={editorRef}
                                documentName={`answer:${selectedAnswer.id}`}
                                initialContent={selectedAnswer?.text || ''}
                                readOnly={true}
                            />
                        </div>

                        {/* Grading & Annotations Panel */}
                        <div className="flex flex-col gap-6">
                            <div className="p-6 bg-surface border border-white/5 rounded-2xl space-y-6 flex flex-col h-full">
                                <div className="flex items-center gap-2 text-blue-400">
                                    <MessageSquare className="h-4 w-4" />
                                    <h3 className="font-syne text-[14px] font-bold uppercase tracking-wider">Annotations</h3>
                                </div>
                                <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                    {selectedAnswer.annotations?.length > 0 ? (
                                        selectedAnswer.annotations.map((ann) => (
                                            <div key={ann.id} className="p-4 bg-white/5 border border-white/5 rounded-xl text-left">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-emerald-400 uppercase overflow-hidden">
                                                        {ann.teacher?.avatarUrl ? (
                                                            <img src={ann.teacher.avatarUrl} alt="" className="h-full w-full object-cover" />
                                                        ) : (
                                                            ann.teacher?.username?.charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                    <span className="text-[10px] text-text-mid font-bold">{ann.teacher?.username}</span>
                                                    <span className="text-[9px] font-mono text-text-dim/50 ml-2">
                                                        {new Date(ann.createdAt).toLocaleDateString()}
                                                    </span>

                                                    <div className="ml-auto flex items-center gap-1">
                                                        <button
                                                            onClick={() => handleAnnotationEdit(ann.id, ann.comment)}
                                                            className="p-1 rounded-lg hover:bg-white/10 text-text-dim hover:text-amber transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Pencil className="h-3 w-3" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleAnnotationDelete(ann.id)}
                                                            className="p-1 rounded-lg hover:bg-white/10 text-text-dim hover:text-red-400 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-[13px] text-text leading-relaxed">{ann.comment}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center py-8 text-center opacity-50">
                                            <MessageSquare className="h-6 w-6 text-text-dim mb-3" />
                                            <p className="text-[12px] text-text-mid italic">No annotations yet.</p>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-auto pt-4 border-t border-white/5 flex gap-2">
                                    <input
                                        type="text"
                                        value={newAnnotationText}
                                        onChange={e => setNewAnnotationText(e.target.value)}
                                        placeholder="Add a new annotation..."
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-text focus:outline-none focus:border-amber/50 transition-colors"
                                        onKeyDown={e => e.key === 'Enter' && handleAnnotationSubmit()}
                                    />
                                    <button
                                        onClick={handleAnnotationSubmit}
                                        disabled={!newAnnotationText.trim() || isSubmittingAnnotation}
                                        className="px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center transition-all disabled:opacity-50"
                                    >
                                        <Send className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            {/* Grading Panel */}
                            <div className="p-6 bg-surface border border-white/5 rounded-2xl space-y-6">
                                <div className="flex items-center gap-2 text-amber">
                                    <CheckCircle className="h-4 w-4" />
                                    <h3 className="font-syne text-[14px] font-bold uppercase tracking-wider">Grade</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[12px] text-text-mid mb-2 block">Score (0-100)</label>
                                        <input
                                            type="number"
                                            value={grading.score}
                                            onChange={e => setGrading({ ...grading, score: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-amber/50 transition-colors"
                                            placeholder="Enter score..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[12px] text-text-mid mb-2 block">Teacher Feedback</label>
                                        <textarea
                                            rows={4}
                                            value={grading.feedback}
                                            onChange={e => setGrading({ ...grading, feedback: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-amber/50 transition-colors resize-none"
                                            placeholder="Provide constructive feedback..."
                                        />
                                    </div>
                                    <button
                                        onClick={handleGradeSubmit}
                                        className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-900/20 transition-all hover:-translate-y-px"
                                    >
                                        <Send className="h-4 w-4" />
                                        Submit Grade for Approval
                                    </button>
                                </div>
                            </div>


                        </div>
                    </div>
                ) : selectedQuestion ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Question Detail Banner */}
                        <div className="p-8 bg-gradient-to-br from-surface to-surface-2 border border-white/5 rounded-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber/5 blur-[100px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
                            <div className="relative z-10">
                                <label className="font-mono text-[10px] text-amber uppercase tracking-[0.3em] mb-3 block opacity-70">Currently Viewing Question</label>
                                <h2 className="text-xl font-syne font-semibold text-text leading-tight mb-4 max-w-2xl">
                                    {selectedQuestion.text}
                                </h2>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-[12px] text-text-mid font-medium">{answers.length} Total Submissions</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                                        <span className="text-[12px] text-text-mid font-medium">{answers.filter(a => a.status === 'SUBMITTED').length} Pending Review</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submission Board Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-5">
                            {answers.map((ans: IAnswer) => (
                                <button
                                    key={ans.id}
                                    onClick={() => setSelectedAnswer(ans)}
                                    className="p-5 bg-surface-2 hover:bg-surface border border-white/5 hover:border-amber/40 rounded-3xl text-left transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 group flex flex-col h-full min-h-[160px]"
                                >
                                    <div className="flex items-start justify-between mb-5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm overflow-hidden flex-shrink-0">
                                                {ans.student?.avatarUrl ? (
                                                    <img src={ans.student.avatarUrl} alt="" className="h-full w-full object-cover" />
                                                ) : (
                                                    ans.student?.username?.charAt(0).toUpperCase() || '?'
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-text text-[15px] leading-none mb-1">
                                                    {ans.student?.username}
                                                </div>
                                                <div className="text-[11px] text-text-dim">{ans.student?.email}</div>
                                            </div>
                                        </div>
                                        <div className={`px-2.5 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase flex-shrink-0 ${ans.status === 'SUBMITTED' ? 'bg-amber/10 border border-amber/20 text-amber' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}`}>
                                            {ans.status}
                                        </div>
                                    </div>

                                    <div className="flex-1 mb-6 w-full px-1">
                                        <div className="text-[14px] text-text-mid line-clamp-2 leading-relaxed italic border-l-2 border-amber/30 pl-3">
                                            {ans.text ? `"${ans.text.replace(/<[^>]*>?/gm, '').substring(0, 100)}..."` : <span className="opacity-40">Student has not provided an answer yet.</span>}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto w-full">
                                        <div className="flex items-center gap-4">
                                            {ans.annotations?.length > 0 && (
                                                <div className="flex items-center gap-1.5 text-blue-400 text-[11px] font-bold">
                                                    <MessageSquare className="h-3.5 w-3.5" />
                                                    {ans.annotations.length}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center text-[10px] font-mono text-amber uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                            Review
                                            <ChevronRight className="h-3 w-3 ml-1" />
                                        </div>
                                    </div>
                                </button>
                            ))}

                            {answers.length === 0 && (
                                <div className="col-span-full py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center">
                                    <div className="p-4 rounded-full bg-white/5 mb-4">
                                        <MessageSquare className="h-8 w-8 text-text-dim" />
                                    </div>
                                    <h3 className="text-text font-instrument italic mb-1 text-lg">No submissions yet</h3>
                                    <p className="text-text-dim text-[13px] max-w-[250px]">Once students complete this worksheet, their answers will appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-12 bg-surface/30 border border-dashed border-white/10 rounded-3xl text-center min-h-[500px]">
                        <div className="p-6 rounded-full bg-white/5 border border-white/5 mb-6">
                            <FileText className="h-10 w-10 text-text-dim" />
                        </div>
                        <h2 className="text-xl font-instrument italic text-text mb-2">Select a Question</h2>
                        <p className="text-text-dim max-w-[300px]">Pick a worksheet and question from the sidebar to view student progress and begin grading.</p>
                    </div>
                )}
            </div>

            <CreateWorksheetModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                workbookId={workbookId}
                onWorksheetCreated={fetchWorksheets}
            />

            <EditWorksheetModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setWorksheetToEdit(null);
                }}
                worksheet={worksheetToEdit}
                onWorksheetUpdated={fetchWorksheets}
            />

            <CreateQuestionModal
                isOpen={isCreateQuestionModalOpen}
                onClose={() => setIsCreateQuestionModalOpen(false)}
                worksheetId={selectedWorksheet?.id || ''}
                onQuestionCreated={fetchWorksheets}
            />

            <EditQuestionModal
                isOpen={isEditQuestionModalOpen}
                onClose={() => {
                    setIsEditQuestionModalOpen(false);
                    setQuestionToEdit(null);
                }}
                question={questionToEdit}
                onQuestionUpdated={fetchWorksheets}
            />
        </div >
    );
};

export default TeacherDashboard;
