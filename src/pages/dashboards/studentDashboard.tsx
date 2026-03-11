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

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
            {/* Left Sidebar: Navigation & Progress (col-span-3) */}
            <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-8 h-fit">
                <div className="p-5 bg-surface border border-black/5 rounded-2xl">
                    <div className="flex items-center gap-2 text-amber/60 mb-6">
                        <FileText className="h-4 w-4" />
                        <h3 className="font-syne text-[11px] font-bold uppercase tracking-[0.2em]">Curriculum</h3>
                    </div>

                    <div className="space-y-2">
                        {worksheets.map((ws) => (
                            <button
                                key={ws.id}
                                onClick={() => setActiveWorksheet(ws)}
                                className={`group w-full text-left p-3 rounded-xl transition-all duration-300 border flex items-center justify-between ${activeWorksheet?.id === ws.id
                                    ? 'bg-amber/10 border-amber/20 text-amber'
                                    : 'bg-black/5 border-transparent text-text-dim hover:bg-black/10 hover:text-text'
                                    }`}
                            >
                                <div className="flex flex-col min-w-0 pr-2">
                                    <span className="text-[13px] font-medium truncate">{ws.title}</span>
                                    <span className="text-[9px] font-mono opacity-50 uppercase tracking-wider">{ws.questions?.length} Questions</span>
                                </div>
                                <ChevronRight className={`h-3.5 w-3.5 transition-transform flex-shrink-0 ${activeWorksheet?.id === ws.id ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                            </button>
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

            {/* Main Content: Questions & Answers (col-span-6) */}
            <div className="lg:col-span-6 space-y-8">
                {activeWorksheet ? (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <div className="relative p-8 rounded-3xl bg-surface border border-black/5 overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber/5 blur-[100px] rounded-full" />
                            <div className="relative z-10">
                                <label className="font-mono text-[10px] text-amber uppercase tracking-[0.3em] mb-3 block opacity-70">Active Worksheet</label>
                                <h1 className="text-xl font-syne font-bold text-text leading-tight mb-4">{activeWorksheet.title}</h1>
                                <p className="text-text-mid text-[14px] font-light max-w-2xl leading-relaxed">
                                    {activeWorksheet.description || "Read the questions carefully and provide your responses in the interactive editors below. Your work is synced in real-time."}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-16">
                            {(activeWorksheet.questions ?? []).map((q, idx) => {
                                const answer = answers[q.id];
                                const isSubmitted = answer?.status === 'SUBMITTED' || answer?.status === 'GRADED';

                                return (
                                    <div key={q.id} className="group/q space-y-6 relative">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-10 w-10 rounded-2xl flex items-center justify-center font-bold text-[14px] transition-all duration-500 ${isSubmitted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-amber/10 text-amber border border-amber/20'
                                                }`}>
                                                {isSubmitted ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-[18px] font-bold text-text leading-relaxed font-syne">
                                                    {q.text}
                                                </h3>
                                                {q.isRequired && <span className="text-[9px] font-mono text-amber/60 uppercase tracking-widest mt-1 block">Required Response</span>}
                                            </div>
                                        </div>

                                        <div className="pl-14 space-y-6">
                                            <div className="relative">
                                                <div className="absolute -left-14 top-0 bottom-0 w-px bg-black/5 group-hover/q:bg-amber/10 transition-colors" />

                                                {answer?.id ? (
                                                    <div className="space-y-4">
                                                        {answer.status === 'GRADED' && (
                                                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald/10 border border-emerald/20 w-fit">
                                                                <Award className="h-3.5 w-3.5 text-emerald" />
                                                                <span className="text-[10px] font-mono text-emerald uppercase tracking-widest font-bold">
                                                                    Answer Locked (GRADED)
                                                                </span>
                                                            </div>
                                                        )}
                                                        <Editor
                                                            documentName={`answer:${answer.id}`}
                                                            placeholder="Focus your thoughts here..."
                                                            readOnly={answer.status === 'GRADED'}
                                                            onUpdateText={(text) => handleTextUpdate(q.id, text)}
                                                            onUpdateAnnotations={(newAnns) => {
                                                                setAnswers(prev => ({
                                                                    ...prev,
                                                                    [q.id]: { ...prev[q.id], annotations: newAnns }
                                                                }));
                                                            }}
                                                            initialContent={answer?.text || ''}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="h-[140px] flex items-center justify-center bg-surface border border-black/5 rounded-xl text-[10px] font-mono text-text-dim uppercase tracking-widest animate-pulse">
                                                        Initializing Editor...
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-black/5">
                                                <div className="flex items-center gap-4 text-[11px] font-mono text-text-dim uppercase tracking-wider">
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        Estimated: 15 mins
                                                    </span>
                                                </div>

                                                {answer?.status !== 'GRADED' && (
                                                    <button
                                                        onClick={() => handleAnswerSubmission(q.id)}
                                                        disabled={submittingId === q.id}
                                                        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber text-black font-bold text-[12px] uppercase tracking-widest transition-all hover:scale-105 hover:bg-white active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                                                    >
                                                        {submittingId === q.id ? (
                                                            <>
                                                                <div className="h-3 w-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                                                Submitting...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Send className="h-3.5 w-3.5" />
                                                                {answer?.status === 'SUBMITTED' ? 'Update Submission' : 'Submit Answer'}
                                                            </>
                                                        )}
                                                    </button>
                                                )}

                                                {answer?.status === 'GRADED' && (
                                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald/10 border border-emerald/20 text-emerald text-[11px] font-bold uppercase tracking-widest">
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        Graded & Returned
                                                    </div>
                                                )}
                                            </div>

                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="h-[500px] flex flex-col items-center justify-center border border-black/5 rounded-3xl bg-surface/50 backdrop-blur-sm p-12 text-center">
                        <div className="h-16 w-16 rounded-2xl bg-black/5 flex items-center justify-center mb-6">
                            <FileText className="h-8 w-8 text-text-dim opacity-20" />
                        </div>
                        <h3 className="text-xl font-syne font-bold text-text mb-2 tracking-tight">Select a Worksheet</h3>
                        <p className="text-text-dim text-[14px] font-light max-w-xs">Pick a task from the curriculum to begin your educational journey.</p>
                    </div>
                )}
            </div>

            {/* Right Sidebar: Annotations (col-span-3) */}
            <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-8 h-fit max-h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar pr-2">
                <div className="p-5 bg-surface border border-black/5 rounded-2xl">
                    <div className="flex items-center gap-2 text-blue-500 mb-6">
                        <MessageSquare className="h-4 w-4" />
                        <h3 className="font-syne text-[11px] font-bold uppercase tracking-[0.2em]">Teacher Feedback</h3>
                    </div>

                    <div className="space-y-4">
                        {activeWorksheet && activeWorksheet.questions ? (
                            activeWorksheet.questions.map(q => {
                                const answer = answers[q.id];
                                if (!answer?.annotations || answer.annotations.length === 0) return null;

                                return (
                                    <div key={`annotations-group-${q.id}`} className="space-y-3">
                                        <div className="text-[11px] font-mono text-text-dim uppercase tracking-wider border-b border-black/5 pb-1 mb-2">
                                            Q: {q.text.length > 30 ? q.text.substring(0, 30) + '...' : q.text}
                                        </div>
                                        {answer.annotations.map((annot) => (
                                            <div key={annot.id} className="p-4 rounded-xl relative bg-blue-500/5 border border-blue-500/10">
                                                <div className="flex items-start gap-3">
                                                    <div className="h-6 w-6 rounded-md bg-blue-500/20 flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-blue-600 uppercase">
                                                        {annot.teacher.username.charAt(0)}
                                                    </div>
                                                    <div className="flex-1 min-w-0 space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[11px] font-bold text-text">{annot.teacher.username}</span>
                                                            <span className="text-[9px] font-mono text-text-dim">{new Date(annot.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <p className="text-[12px] text-text-mid leading-relaxed break-words">{annot.comment}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-[12px] text-text-dim text-center py-8 px-4 opacity-60">
                                Select a worksheet to review teacher feedback and annotations on your submitted answers.
                            </p>
                        )}
                        {activeWorksheet?.questions?.every(q => !answers[q.id]?.annotations?.length) && (
                            <p className="text-[12px] text-text-dim text-center py-8 px-4 opacity-60">
                                No feedback available for this worksheet yet.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
