import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreVertical, UserPlus } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Wrapper from '../../components/ui/wrapper';
import StudentDashboard from '../dashboards/studentDashboard';
import { handleGetWorkBook } from '@/api/workbook';
import type { Workbook } from '@/types/workbooks';
import DirectorDashboard from '../dashboards/directorDashboard';
import TeacherDashboard from '../dashboards/teacherDashboard';
import InviteStudentModal from '@/components/dashboard/inviteStudentModal';

const WorkbookDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [workbook, setWorkBook] = useState<Workbook | null>(null);
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const role = user?.role?.toUpperCase() || 'STUDENT';
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    if (!id) return <div>Workbook ID not found</div>;

    const renderDashboard = () => {
        switch (role) {
            case 'DIRECTOR':
                return <DirectorDashboard workbookId={id} />;
            case 'TEACHER':
                return <TeacherDashboard workbookId={id} />;
            case 'STUDENT':
            default:
                return <StudentDashboard workbookId={id} />;
        }
    };

    const getWorkBook = async () => {
        try {
            const results = await handleGetWorkBook(id)

            if (!results.success) {
                return;
            }


            if (results.data) {
                setWorkBook(results.data);
            } else {
                setWorkBook(null);
            }
        } catch (error) {
            console.error('Error fetching workbook:', error);
        }
    };

    useEffect(() => {
        getWorkBook();
    }, [id]);

    return (
        <Wrapper>
            <div className="space-y-8 animate-in fade-in duration-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
                    <div className="flex items-center gap-5">
                        <button
                            onClick={() => navigate('/workbook')}
                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-surface border border-white/5 text-text-mid hover:text-text hover:border-white/10 transition-all"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-[0.2em] border ${role === 'DIRECTOR' ? 'bg-amber/10 border-amber/20 text-amber' : role === 'TEACHER' ? 'bg-blue-400/10 border-blue-400/20 text-blue-400' : 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400'}`}>
                                    {role} VIEW
                                </span>
                                <div className="h-1 w-1 rounded-full bg-white/20" />
                                <span className="text-[11px] font-mono text-text-dim uppercase tracking-widest">{workbook?.tag}</span>
                            </div>
                            <h1 className="text-[28px] font-instrument italic text-text tracking-tight leading-none">
                                {workbook?.name}
                            </h1>
                            <p className="text-[13px] text-text-dim">{workbook?.description}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {(role === 'DIRECTOR' || role === 'TEACHER') && (
                            <button
                                onClick={() => setIsInviteModalOpen(true)}
                                className="h-10 px-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all font-bold text-[13px]"
                            >
                                <UserPlus className="h-4 w-4" />
                                <span>ENROLL</span>
                            </button>
                        )}
                        <button className="p-2.5 bg-surface border border-white/5 rounded-xl text-text-dim hover:text-text">
                            <MoreVertical className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <InviteStudentModal
                    isOpen={isInviteModalOpen}
                    onClose={() => setIsInviteModalOpen(false)}
                    workbookId={id}
                    onStudentAdded={() => {
                        getWorkBook();
                    }}
                />

                <div className="pt-4">
                    {renderDashboard()}
                </div>
            </div>
        </Wrapper>
    );
};

export default WorkbookDetail;
