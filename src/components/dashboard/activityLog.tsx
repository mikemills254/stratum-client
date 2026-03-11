import React, { useEffect, useState } from 'react';
import { Clock, Send, CheckCircle2, MessageSquare, Flame, RefreshCw, User } from 'lucide-react';
import { api } from '../../utilities/config';
import { formatDistanceToNow } from 'date-fns';

interface AuditLog {
    id: string;
    type: 'SUBMISSION' | 'GRADING' | 'ANNOTATION' | 'STREAK' | 'WORKBOOK_UPDATE' | 'ENROLLMENT';
    title: string;
    description: string;
    createdAt: string;
    user: {
        username: string;
        avatarUrl?: string;
        role: string;
    };
}

interface ActivityLogProps {
    workbookId?: string;
    limit?: number;
    title?: string;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ workbookId, limit = 10, title = "Recent Activity" }) => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLogs = async () => {
        try {
            const response = await api.get(`/audit-log`, {
                params: { workbookId, limit }
            });
            if (response.data.success) {
                setLogs(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch audit logs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
        // Periodically refresh logs
        const interval = setInterval(fetchLogs, 30000);
        return () => clearInterval(interval);
    }, [workbookId]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'SUBMISSION': return <Send className="h-4 w-4 text-blue-400" />;
            case 'GRADING': return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
            case 'ANNOTATION': return <MessageSquare className="h-4 w-4 text-amber-400" />;
            case 'STREAK': return <Flame className="h-4 w-4 text-orange-500" />;
            case 'WORKBOOK_UPDATE': return <RefreshCw className="h-4 w-4 text-purple-400" />;
            default: return <Clock className="h-4 w-4 text-text-dim" />;
        }
    };

    if (isLoading && logs.length === 0) {
        return (
            <div className="p-8 bg-surface border border-black/5 rounded-3xl animate-pulse">
                <div className="h-4 w-32 bg-black/5 rounded mb-6"></div>
                <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-4">
                            <div className="h-8 w-8 rounded-full bg-black/5"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-full bg-black/5 rounded"></div>
                                <div className="h-2 w-16 bg-black/5 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-surface border border-black/5 rounded-3xl group">
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-syne text-[11px] font-bold text-text-dim uppercase tracking-widest leading-none">{title}</h3>
                <button
                    onClick={fetchLogs}
                    className="p-1.5 rounded-lg hover:bg-black/5 text-text-dim hover:text-text transition-all active:rotate-180 duration-500"
                >
                    <RefreshCw className="h-3.5 w-3.5" />
                </button>
            </div>

            <div className="space-y-8 relative">
                {/* Vertical Timeline Line */}
                <div className="absolute left-[15px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-black/10 via-black/5 to-transparent" />

                {logs.map((log) => (
                    <div key={log.id} className="relative flex gap-5 group/item">
                        <div className="relative z-10 flex-shrink-0 h-8 w-8 rounded-full bg-surface border border-black/10 flex items-center justify-center shadow-xl group-hover/item:border-black/20 transition-colors">
                            {getIcon(log.type)}
                        </div>

                        <div className="space-y-1 pt-1">
                            <div className="flex items-center gap-2">
                                {log.user && (
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-4 w-4 rounded-full bg-black/5 border border-black/10 flex items-center justify-center overflow-hidden">
                                            {log.user.avatarUrl ? (
                                                <img src={log.user.avatarUrl} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <User className="h-2 w-2 text-text-dim" />
                                            )}
                                        </div>
                                        <span className="text-[11px] font-bold text-text/60 group-hover/item:text-text transition-colors">@{log.user.username}</span>
                                    </div>
                                )}
                                <span className="text-[10px] text-text-dim uppercase tracking-widest font-mono">
                                    {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                </span>
                            </div>

                            <p className="text-[13px] text-text font-medium leading-relaxed group-hover/item:translate-x-0.5 transition-transform duration-300">
                                {log.title}
                            </p>
                            {log.description && (
                                <p className="text-[11px] text-text-dim leading-snug line-clamp-2 italic opacity-0 h-0 group-hover/item:opacity-100 group-hover/item:h-auto transition-all duration-300">
                                    {log.description}
                                </p>
                            )}
                        </div>
                    </div>
                ))}

                {logs.length === 0 && (
                    <div className="py-12 text-center">
                        <Clock className="h-8 w-8 text-black/5 mx-auto mb-3" />
                        <p className="text-[12px] text-text-dim italic">The pulse is quiet. No recent activity yet.</p>
                    </div>
                )}
            </div>

            {logs.length > 0 && (
                <button className="w-full mt-10 py-3 rounded-2xl border border-black/5 text-[11px] font-bold text-text-dim hover:bg-black/5 hover:text-text transition-all tracking-widest uppercase">
                    View Full Audit Log
                </button>
            )}
        </div>
    );
};

export default ActivityLog;
