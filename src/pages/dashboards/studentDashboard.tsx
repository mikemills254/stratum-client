import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, Award, CheckCircle2, FileText, Send, ChevronRight, MessageSquare } from 'lucide-react';
import Editor from '../../components/ui/editor';
import ActivityLog from '../../components/dashboard/activityLog';
import { handleGetOrCreateAnswer, handleSubmitAnswer, handleUpdateAnswerText, type IAnswer } from '../../api/answer';
import toast from 'react-hot-toast';
import { api } from '../../utilities/config';
import type { Worksheet } from '../../types/worksheets';


interface StudentDashboardProps {
    workbookId: string;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ workbookId }) => {
    const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
    const [activeWorksheet, setActiveWorksheet] = useState<Worksheet | null>(null);
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
    const [answers, setAnswers] = useState<Record<string, IAnswer>>({});
    const [loading, setLoading] = useState(true);
    const [submittingId, setSubmittingId] = useState<string | null>(null);
    const typingTimeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

    const fetchWorkbook = async () => {
        try {
            const res = await api.get(`/workbook/${workbookId}`);
            const wsData = res.data.data?.worksheets || [];
            setWorksheets(wsData);
            if (wsData.length > 0 && !activeWorksheet) {
                setActiveWorksheet(wsData[0]);
                if (wsData[0].questions?.length > 0) {
                    setSelectedQuestionId(wsData[0].questions[0].id);
                }
            }
        } catch (error) {
            console.error('Error fetching workbook:', error);
            toast.error("Failed to load workbook details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkbook();
    }, [workbookId]);

    // Fetch or create answers when worksheet changes
    useEffect(() => {
        if (!activeWorksheet) return;

        const syncAnswers = async () => {
            const newAnswers: Record<string, IAnswer> = {};
            for (const q of activeWorksheet.questions ?? []) {
                try {
                    const result = await handleGetOrCreateAnswer(q.id);
                    if (result.success && result.data) {
                        newAnswers[q.id] = result.data;
                    }
                } catch (err) {
                    console.error(`Failed to sync answer for question ${q.id}`, err);
                }
            }
            setAnswers(newAnswers);
        };

        syncAnswers();
    }, [activeWorksheet]);

    const handleAnswerSubmission = async (questionId: string) => {
        const answer = answers[questionId];
        if (!answer) return;

        setSubmittingId(questionId);
        try {
            const result = await handleSubmitAnswer(answer.id);
            if (result.success && result.data) {
                setAnswers(prev => ({
                    ...prev,
                    [questionId]: result.data!
                }));
                toast.success("Answer submitted successfully!");
            }
        } catch (error) {
            toast.error("Failed to submit answer");
        } finally {
            setSubmittingId(null);
        }
    };

    const handleTextUpdate = useCallback((questionId: string, text: string) => {
        const answer = answers[questionId];
        if (!answer) return;

        if (typingTimeouts.current[questionId]) {
            clearTimeout(typingTimeouts.current[questionId]);
        }

        typingTimeouts.current[questionId] = setTimeout(async () => {
            try {
                const res = await handleUpdateAnswerText(answer.id, text);
                if (res.success && res.data) {
                    setAnswers(prev => ({ ...prev, [questionId]: res.data! }));
                }
            } catch (error) {
                console.error("Failed to sync answer text", error);
            }
        }, 3000); // 3-second debounce on saving text to DB
    }, [answers]);


    if (loading) return <div className="p-10 text-center font-mono animate-pulse uppercase tracking-widest text-text-dim">Loading Workbook...</div>;

    const calculateProgress = () => {
        if (worksheets.length === 0) return 0;
        const totalQuestions = worksheets.reduce((acc, ws) => acc + (ws.questions?.length ?? 0), 0);
        if (totalQuestions === 0) return 0;

        const submittedAnswers = Object.values(answers).filter(a => a.status === 'SUBMITTED' || a.status === 'GRADED').length;
        return Math.round((submittedAnswers / totalQuestions) * 100);
    };

    const progress = calculateProgress();

    const currentQuestion = activeWorksheet?.questions?.find(q => q.id === selectedQuestionId);
    const currentAnswer = selectedQuestionId ? answers[selectedQuestionId] : null;
    const hasAnnotations = !!currentAnswer?.annotations?.length;

    const handleNextQuestion = () => {
        if (!activeWorksheet?.questions) return;
        const idx = activeWorksheet.questions.findIndex(q => q.id === selectedQuestionId);
        if (idx < activeWorksheet.questions.length - 1) {
            setSelectedQuestionId(activeWorksheet.questions[idx + 1].id);
        }
    };

    const handlePrevQuestion = () => {
        if (!activeWorksheet?.questions) return;
        const idx = activeWorksheet.questions.findIndex(q => q.id === selectedQuestionId);
        if (idx > 0) {
            setSelectedQuestionId(activeWorksheet.questions[idx - 1].id);
        }
    };

    return (
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 relative transition-all duration-700`}>
            {/* Left Sidebar: Navigation & Progress (col-span-3) */}
            <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-8 h-fit">
                <div className="p-5 bg-surface border border-black/5 rounded-2xl">
                    <div className="flex items-center gap-2 text-amber/60 mb-6">
                        <FileText className="h-4 w-4" />
                        <h3 className="font-syne text-[11px] font-bold uppercase tracking-[0.2em]">Curriculum</h3>
                    </div>

                    <div className="space-y-4">
                        {worksheets.map((ws) => (
                            <div key={ws.id} className="space-y-1">
                                <button
                                    onClick={() => {
                                        setActiveWorksheet(ws);
                                        if (ws.questions && ws.questions.length > 0) {
                                            setSelectedQuestionId(ws.questions[0].id);
                                        }
                                    }}
                                    className={`group w-full text-left p-3 rounded-xl transition-all duration-300 border flex items-center justify-between ${activeWorksheet?.id === ws.id
                                        ? 'bg-amber/10 border-amber/20 text-amber'
                                        : 'bg-black/5 border-transparent text-text-dim hover:bg-black/10 hover:text-text'
                                        }`}
                                >
                                    <div className="flex flex-col min-w-0 pr-2">
                                        <span className={`text-[13px] font-bold truncate ${activeWorksheet?.id === ws.id ? 'text-amber' : 'text-text'}`}>{ws.title}</span>
                                        <span className="text-[9px] font-mono opacity-50 uppercase tracking-wider">{ws.questions?.length || 0} Questions</span>
                                    </div>
                                    <ChevronRight className={`h-3.5 w-3.5 transition-transform flex-shrink-0 ${activeWorksheet?.id === ws.id ? 'rotate-90 text-amber' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                                </button>

                                {activeWorksheet?.id === ws.id && ws.questions && (
                                    <div className="pl-4 py-1 space-y-1 animate-in slide-in-from-top-2 duration-300">
                                        {ws.questions.map((q, idx) => {
                                            const isAnswered = answers[q.id]?.status === 'SUBMITTED' || answers[q.id]?.status === 'GRADED';
                                            return (
                                                <button
                                                    key={q.id}
                                                    onClick={() => setSelectedQuestionId(q.id)}
                                                    className={`w-full text-left p-2.5 rounded-lg text-[12px] transition-all flex items-center gap-3 ${selectedQuestionId === q.id
                                                        ? 'bg-white text-amber font-bold border border-black/5'
                                                        : 'text-text-mid hover:text-text hover:bg-black/5 border border-transparent'
                                                        }`}
                                                >
                                                    <div className={`h-5 w-5 rounded-md flex items-center justify-center text-[10px] ${selectedQuestionId === q.id ? 'bg-amber text-white' : isAnswered ? 'bg-emerald-500/20 text-emerald-500' : 'bg-black/5'}`}>
                                                        {isAnswered ? <CheckCircle2 className="h-3 w-3" /> : idx + 1}
                                                    </div>
                                                    <span className="truncate flex-1">{q.text}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 bg-surface-2 border border-black/5 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber/5 blur-2xl rounded-full group-hover:scale-150 transition-transform duration-1000" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-amber/10 text-amber">
                                <Award className="h-4 w-4" />
                            </div>
                            <h4 className="text-[14px] font-bold text-text font-syne uppercase tracking-wider">Overall Progress</h4>
                        </div>

                        <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden border border-black/5 mb-3">
                            <div
                                className="h-full bg-gradient-to-r from-amber to-orange-500 transition-all duration-1000 shadow-[0_0_12px_rgba(232,160,32,0.3)]"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-[10px] font-mono text-text-dim uppercase tracking-widest flex justify-between">
                            <span>Completeness</span>
                            <span className="text-amber">{progress}%</span>
                        </p>
                    </div>
                </div>

                {/* Personal Activity Feed */}
                <ActivityLog workbookId={workbookId} title="My Milestones" limit={5} />
            </div>

            {/* Main Content: Focused Single Question (col-span-6 or col-span-9) */}
            <div className={`lg:transition-all lg:duration-700 ${hasAnnotations ? 'lg:col-span-6' : 'lg:col-span-9'} space-y-8`}>
                {activeWorksheet && currentQuestion ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto w-full">
                        <div className="relative p-10 rounded-[32px] bg-surface border border-black/5 overflow-hidden group shadow-sm">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber/5 blur-[100px] rounded-full" />
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center justify-between">
                                    <label className="font-mono text-[10px] text-amber uppercase tracking-[0.3em] opacity-70">
                                        {activeWorksheet.title} // Question {(activeWorksheet.questions?.findIndex(q => q.id === selectedQuestionId) ?? 0) + 1}
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handlePrevQuestion}
                                            disabled={!activeWorksheet.questions || activeWorksheet.questions.indexOf(currentQuestion) === 0}
                                            className="p-2 rounded-lg hover:bg-black/5 disabled:opacity-30 transition-all"
                                        >
                                            <ChevronRight className="h-4 w-4 rotate-180" />
                                        </button>
                                        <button
                                            onClick={handleNextQuestion}
                                            disabled={!activeWorksheet.questions || activeWorksheet.questions.indexOf(currentQuestion) === activeWorksheet.questions.length - 1}
                                            className="p-2 rounded-lg hover:bg-black/5 disabled:opacity-30 transition-all"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <h1 className="text-2xl font-syne font-bold text-text leading-tight tracking-tight">{currentQuestion.text}</h1>
                                {currentQuestion.isRequired && (
                                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber/10 border border-amber/20">
                                        <div className="h-1 w-1 rounded-full bg-amber animate-pulse" />
                                        <span className="text-[9px] font-mono text-amber uppercase tracking-widest font-bold">Required Response</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="relative group/q">
                                <div className="absolute -left-10 top-0 bottom-0 w-px bg-black/5 group-hover/q:bg-amber/10 transition-colors hidden lg:block" />

                                {currentAnswer?.id ? (
                                    <div className="space-y-6">
                                        {currentAnswer.status === 'GRADED' && (
                                            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-emerald/10 border border-emerald/20 w-fit shadow-sm">
                                                <div className="h-6 w-6 rounded-lg bg-emerald/20 flex items-center justify-center text-emerald font-bold text-[12px]">
                                                    {currentAnswer.grade?.score}
                                                </div>
                                                <div className="flex flex-col text-left">
                                                    <span className="text-[10px] font-mono text-emerald uppercase tracking-widest font-bold leading-none">
                                                        Grade Achieved
                                                    </span>
                                                    <span className="text-[9px] font-mono text-emerald/60 uppercase tracking-[0.1em] mt-1">
                                                        Answer Locked
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="bg-surface rounded-[32px] border border-black/5 shadow-xl shadow-black/[0.02] overflow-hidden min-h-[500px]">
                                            <Editor
                                                key={currentAnswer.id}
                                                documentName={`answer:${currentAnswer.id}`}
                                                placeholder="Start typing your response here..."
                                                readOnly={currentAnswer.status === 'GRADED'}
                                                hideMetadata={true}
                                                onUpdateText={(text) => handleTextUpdate(currentQuestion.id, text)}
                                                onUpdateAnnotations={(newAnns) => {
                                                    setAnswers(prev => ({
                                                        ...prev,
                                                        [currentQuestion.id]: { ...prev[currentQuestion.id], annotations: newAnns }
                                                    }));
                                                }}
                                                initialContent={currentAnswer?.text || ''}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-[400px] flex items-center justify-center bg-surface border border-black/5 rounded-[32px] text-[10px] font-mono text-text-dim uppercase tracking-widest animate-pulse">
                                        Initializing Workspace...
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between p-6 bg-surface/50 rounded-2xl border border-black/5">
                                <div className="flex items-center gap-6 text-[11px] font-mono text-text-dim uppercase tracking-wider">
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5" />
                                        Auto-saving enabled
                                    </span>
                                </div>

                                {currentAnswer?.status !== 'GRADED' && (
                                    <button
                                        onClick={() => handleAnswerSubmission(currentQuestion.id)}
                                        disabled={submittingId === currentQuestion.id}
                                        className="flex items-center gap-3 px-8 py-3 rounded-xl bg-text text-bg font-bold text-[13px] uppercase tracking-widest transition-all hover:bg-amber hover:text-text active:scale-95 disabled:opacity-50 shadow-lg shadow-black/5"
                                    >
                                        {submittingId === currentQuestion.id ? (
                                            <>
                                                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4" />
                                                {currentAnswer?.status === 'SUBMITTED' ? 'Update Submission' : 'Submit Final Answer'}
                                            </>
                                        )}
                                    </button>
                                )}

                                {currentAnswer?.status === 'GRADED' && (
                                    <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-emerald/10 text-emerald text-[12px] font-bold uppercase tracking-widest">
                                        <Award className="h-4.5 w-4.5" />
                                        <span>Grade: {currentAnswer.grade?.score}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-[500px] flex flex-col items-center justify-center border border-black/5 rounded-[40px] bg-surface/50 backdrop-blur-sm p-12 text-center max-w-2xl mx-auto w-full">
                        <div className="h-20 w-20 rounded-3xl bg-black/5 flex items-center justify-center mb-8">
                            <FileText className="h-10 w-10 text-text-dim opacity-20" />
                        </div>
                        <h3 className="text-2xl font-syne font-bold text-text mb-3 tracking-tight">Select a Question</h3>
                        <p className="text-text-dim text-[15px] font-light max-w-sm leading-relaxed">Choose a specific question from the curriculum on the left to begin your response.</p>
                    </div>
                )}
            </div>

            {/* Right Sidebar: Annotations (col-span-3) - Only if selected question has annotations */}
            {hasAnnotations && (
                <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-8 h-fit max-h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar pr-2 animate-in fade-in slide-in-from-right-4 duration-700">
                    <div className="p-5 bg-surface border border-black/5 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 text-blue-500 mb-6">
                            <MessageSquare className="h-4 w-4" />
                            <h3 className="font-syne text-[11px] font-bold uppercase tracking-[0.2em]">Annotations</h3>
                        </div>

                        <div className="space-y-4">
                            {currentAnswer?.annotations?.map((annot) => (
                                <div key={annot.id} className="p-4 rounded-xl relative bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/[0.08] transition-colors">
                                    <div className="flex items-start gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-blue-600 uppercase border border-blue-500/10">
                                            {annot.teacher.username.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[12px] font-bold text-text">{annot.teacher.username}</span>
                                                {/* <span className="text-[9px] font-mono text-text-dim">{new Date(annot.createdAt).toLocaleDateString()}</span> */}
                                            </div>
                                            <p className="text-[13px] text-text-mid leading-relaxed break-words">{annot.comment}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
