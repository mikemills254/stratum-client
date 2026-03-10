import React, { useState, useEffect } from 'react';
import { Layout, CheckSquare, BarChart3, Clock, Plus, Users, UserPlus, Check } from 'lucide-react';
import InviteTeacherModal from '../../components/dashboard/inviteTeacherModal';
import ActivityLog from '../../components/dashboard/activityLog';
import { api } from '../../utilities/config';

interface GradeApproval {
    id: string;
    score: number;
    feedback: string;
    answer: {
        student: {
            firstName: string;
            lastName: string;
        };
        question: {
            text: string;
        };
    };
    teacher: {
        username: string;
        email: string;
    };
}

interface WorkbookStats {
    totalQuestions: number;
    teacherCount: number;
    studentCount: number;
    teachers: {
        uid: string;
        username: string;
        email: string;
        avatarUrl: string | null;
        pendingApprovals: number;
    }[];
    students: {
        uid: string;
        username: string;
        email: string;
        avatarUrl: string | null;
        completedCount: number;
        gradedCount: number;
        progress: number;
    }[];
}

interface DirectorDashboardProps {
    workbookId: string;
}

const DirectorDashboard: React.FC<DirectorDashboardProps> = ({ workbookId }) => {
    const [pendingApprovals, setPendingApprovals] = useState<GradeApproval[]>([]);
    const [stats, setStats] = useState<WorkbookStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            const [approvalsRes, statsRes] = await Promise.all([
                api.get('/grade/pending'),
                api.get(`/workbook/${workbookId}/stats`)
            ]);
            setPendingApprovals(approvalsRes.data.data || []);
            setStats(statsRes.data.data || null);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [workbookId]);

    const handleApprove = async (gradeId: string) => {
        try {
            await api.patch(`/grade/${gradeId}/approve`);
            setPendingApprovals(prev => prev.filter(g => g.id !== gradeId));
            // Refresh stats to update progress
            fetchData();
        } catch (error) {
            console.error('Error approving grade:', error);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="h-12 w-12 border-4 border-amber/20 border-t-amber rounded-full animate-spin" />
            <p className="text-[11px] font-mono text-text-dim uppercase tracking-widest animate-pulse">Initializing Managerial View...</p>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 bg-surface border border-white/5 rounded-2xl group hover:border-amber/20 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-amber/10 text-amber rounded-xl border border-amber/10">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-[13px] text-text-mid mb-1">Collaborating Staff</p>
                    <h4 className="text-[28px] font-bold text-text">{stats?.teacherCount || 0} Members</h4>
                </div>
                <div className="p-6 bg-surface border border-white/5 rounded-2xl group hover:border-blue-400/20 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-400/10 text-blue-400 rounded-xl border border-blue-400/10">
                            <Layout className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-[13px] text-text-mid mb-1">Enrolled Students</p>
                    <h4 className="text-[28px] font-bold text-text">{stats?.studentCount || 0} Students</h4>
                </div>
                <div className="p-6 bg-surface border border-white/5 rounded-2xl group hover:border-emerald-400/20 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-400/10 text-emerald-400 rounded-xl border border-emerald-400/10">
                            <CheckSquare className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-[13px] text-text-mid mb-1">Workbook Completion</p>
                    <h4 className="text-[28px] font-bold text-text">
                        {stats?.students.reduce((acc, s) => acc + s.progress, 0) ? Math.round(stats.students.reduce((acc, s) => acc + s.progress, 0) / (stats.studentCount || 1)) : 0}%
                    </h4>
                </div>
                <div className="p-6 bg-surface border border-white/5 rounded-2xl group hover:border-amber/20 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-amber/10 text-amber rounded-xl border border-amber/10">
                            <Clock className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-[13px] text-text-mid mb-1">Pending Approvals</p>
                    <h4 className="text-[28px] font-bold text-text">{pendingApprovals.length} Grades</h4>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Approval Queue & Student Progress */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Approval Queue */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="font-syne text-[18px] font-bold text-text tracking-tight uppercase tracking-wider opacity-80 flex items-center gap-3">
                                <CheckSquare className="h-5 w-5 text-amber" />
                                Grade Approval Queue
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {pendingApprovals.map((grade) => (
                                <div key={grade.id} className="p-6 bg-surface border border-white/5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-2xl transition-all border-l-4 border-l-amber/40">
                                    <div className="space-y-2 max-w-[500px]">
                                        <div className="flex items-center gap-3">
                                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-text-dim uppercase tracking-widest">{grade.answer.student.firstName} {grade.answer.student.lastName}</span>
                                            <div className="h-1 w-1 rounded-full bg-white/20" />
                                            <span className="text-[11px] text-text-mid font-medium italic">Evaluated by @{grade.teacher.username}</span>
                                        </div>
                                        <h3 className="text-[15px] font-bold text-text leading-snug line-clamp-1">
                                            {grade.answer.question.text}
                                        </h3>
                                        <p className="text-[13px] text-text-dim italic line-clamp-1">"{grade.feedback}"</p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <div className="text-[24px] font-bold text-amber leading-none">{grade.score}%</div>
                                            <div className="text-[10px] font-mono text-text-dim uppercase tracking-widest mt-1">Proposed</div>
                                        </div>
                                        <button
                                            onClick={() => handleApprove(grade.id)}
                                            className="h-12 w-12 rounded-xl bg-amber text-bg flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                                        >
                                            <Check className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {pendingApprovals.length === 0 && (
                                <div className="p-12 border border-dashed border-white/10 rounded-3xl text-center bg-white/[0.02]">
                                    <p className="text-text-dim italic font-light">Quality control clear! No grades currently awaiting your approval.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Student Progress Table */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="font-syne text-[18px] font-bold text-text tracking-tight uppercase tracking-wider opacity-80 flex items-center gap-3">
                                <Users className="h-5 w-5 text-blue-400" />
                                Student Progression
                            </h2>
                        </div>

                        <div className="overflow-hidden border border-white/5 rounded-2xl bg-surface">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5">
                                        <th className="px-6 py-4 text-[10px] font-mono text-text-dim uppercase tracking-widest border-b border-white/5">Student</th>
                                        <th className="px-6 py-4 text-[10px] font-mono text-text-dim uppercase tracking-widest border-b border-white/5 text-center">Completion</th>
                                        <th className="px-6 py-4 text-[10px] font-mono text-text-dim uppercase tracking-widest border-b border-white/5 text-center">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-mono text-text-dim uppercase tracking-widest border-b border-white/5 text-right">Progress</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats?.students.map((student) => (
                                        <tr key={student.uid} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4 border-b border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-dim font-bold text-[12px]">
                                                        {student.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-[13px] font-bold text-text">@{student.username}</p>
                                                        <p className="text-[10px] text-text-dim truncate max-w-[120px]">{student.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 border-b border-white/5">
                                                <div className="w-full max-w-[120px] mx-auto space-y-1.5">
                                                    <div className="flex justify-between text-[9px] font-mono text-text-dim">
                                                        <span>{student.completedCount} / {stats.totalQuestions}</span>
                                                        <span>{student.progress}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-400 rounded-full transition-all duration-1000"
                                                            style={{ width: `${student.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 border-b border-white/5 text-center">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${student.completedCount === stats.totalQuestions ? 'bg-emerald/10 text-emerald' : 'bg-amber/10 text-amber'}`}>
                                                    {student.completedCount === stats.totalQuestions ? 'Finished' : 'In Progress'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 border-b border-white/5 text-right">
                                                <div className="text-[11px] font-mono text-text-dim">
                                                    Graded: <span className="text-emerald">{student.gradedCount}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!stats?.students || stats.students.length === 0) && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center italic text-text-dim text-[13px]">
                                                No students enrolled in this workbook yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Managerial staff */}
                <div className="space-y-8">
                    {/* Management Actions */}
                    <div className="p-8 bg-surface border border-white/5 rounded-3xl space-y-6">
                        <h3 className="font-syne text-[16px] font-bold text-text tracking-tight border-b border-white/5 pb-4 uppercase tracking-widest text-[11px] text-text-dim underline decoration-amber decoration-2 underline-offset-8">Administrative Power</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => setIsInviteModalOpen(true)}
                                className="w-full flex items-center justify-between p-4 bg-amber/10 border border-amber/10 rounded-2xl text-left hover:bg-amber/20 transition-all font-bold text-[13px] text-amber group"
                            >
                                <span>Recruit Educators</span>
                                <UserPlus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            </button>
                            <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl text-left hover:bg-white/10 transition-all font-bold text-[13px]">
                                <span>Master Analytics</span>
                                <BarChart3 className="h-4 w-4 text-text-dim" />
                            </button>
                        </div>
                    </div>

                    {/* Teacher Activity Section */}
                    <div className="p-8 bg-surface border border-white/5 rounded-3xl space-y-6">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <h3 className="font-syne text-[11px] font-bold text-text-dim uppercase tracking-widest">Educator Status</h3>
                            <button
                                onClick={() => setIsInviteModalOpen(true)}
                                className="h-6 w-6 rounded-lg bg-amber/10 text-amber flex items-center justify-center hover:bg-amber text-bg transition-all"
                            >
                                <Plus className="h-3.5 w-3.5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {stats?.teachers.map((teacher) => (
                                <div key={teacher.uid} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-dim font-bold overflow-hidden transition-all group-hover:border-amber/40">
                                            {teacher.avatarUrl ? (
                                                <img src={teacher.avatarUrl} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                teacher.username.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-bold text-text leading-none mb-1">@{teacher.username}</p>
                                            <div className="flex items-center gap-1.5 text-text-dim text-[9px] uppercase tracking-tighter">
                                                <div className={`h-1.5 w-1.5 rounded-full ${teacher.pendingApprovals > 0 ? 'bg-amber animate-pulse' : 'bg-emerald-400'}`} />
                                                <span>{teacher.pendingApprovals > 0 ? `${teacher.pendingApprovals} Pending` : 'Up to date'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {teacher.pendingApprovals > 0 && (
                                        <div className="h-6 px-2 rounded-lg bg-amber text-bg text-[10px] font-bold flex items-center justify-center">
                                            {teacher.pendingApprovals}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {(!stats?.teachers || stats.teachers.length === 0) && (
                                <p className="text-center italic text-text-dim text-[11px] py-4">No staff recruited yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <ActivityLog workbookId={workbookId} title="Managerial Logs" />
                </div>
            </div>

            <InviteTeacherModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                workbookId={workbookId}
                onTeacherAdded={fetchData}
            />
        </div>
    );
};

export default DirectorDashboard;
