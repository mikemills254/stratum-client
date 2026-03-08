import React from 'react';
import {
    Plus,
    MoreHorizontal,
    ArrowUpRight,
    Clock,
    Flame,
    Award,
    TrendingUp,
    Library,
    ArrowRightLeft,
    CheckCircle2
} from 'lucide-react';
import Wrapper from '../../components/wrapper';
import { useAuthStore } from '../../store/authStore';

export const WorkbookPage: React.FC = () => {
    const { user } = useAuthStore();
    const isDirector = user?.role?.toLowerCase() === 'director';

    const stats = [
        { label: 'Total Books', value: '12', icon: Library, color: 'bg-blue/10 text-blue', border: 'border-blue/20' },
        { label: 'Active Streak', value: '5 Days', icon: Flame, color: 'bg-amber/10 text-amber', border: 'border-amber/20' },
        { label: 'Points Earned', value: '1,240', icon: Award, color: 'bg-green/10 text-green', border: 'border-green/20' },
        { label: 'Study Hours', value: '24.5h', icon: Clock, color: 'bg-text-mid/10 text-text-mid', border: 'border-white/5' },
    ];

    const workbooks = [
        { title: 'Modern Web Architecture', progress: 65, category: 'Engineering', lastActive: '2h ago', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=200&auto=format&fit=crop', color: 'text-blue bg-blue/5 border-blue/10' },
        { title: 'User Experience Design', progress: 32, category: 'Design', lastActive: '5h ago', image: 'https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?q=80&w=200&auto=format&fit=crop', color: 'text-green bg-green/5 border-green/10' },
        { title: 'Financial Modeling 101', progress: 88, category: 'Finance', lastActive: '1d ago', image: 'https://images.unsplash.com/photo-1611974714658-75d4f1ad646d?q=80&w=200&auto=format&fit=crop', color: 'text-amber bg-amber/5 border-amber/10' },
        { title: 'Global Macro Trends', progress: 12, category: 'Business', lastActive: '3d ago', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=200&auto=format&fit=crop', color: 'text-text-mid bg-white/5 border-white/5' },
    ];

    return (
        <Wrapper>
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <label className="font-mono text-[11px] text-amber tracking-[0.2em] uppercase mb-4 block opacity-70">// User Dashboard</label>
                        <h1 className="font-instrument text-[48px] leading-[1.1] text-text tracking-tight mb-3">
                            Welcome back, <span className="italic text-gradient">{user?.firstName || 'Learner'}</span>
                        </h1>
                        <p className="text-[16px] text-text-mid font-light max-w-[500px]">
                            You're making great progress in your current workbooks. Here's a quick look at your activity.
                        </p>
                    </div>
                    {isDirector && (
                        <button className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-br from-amber to-[#ff6b35] text-white rounded-xl font-bold shadow-[0_8px_32px_rgba(232,160,32,0.3)] hover:shadow-[0_16px_48px_rgba(232,160,32,0.4)] hover:-translate-y-px active:scale-[0.98] transition-all">
                            <Plus className="h-5 w-5" />
                            <span>Create Workbook</span>
                        </button>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className={`p-5 rounded-2xl bg-surface border ${stat.border} hover:border-white/10 transition-all group relative overflow-hidden`}>
                            <div className="flex items-center justify-between mb-5 relative z-10">
                                <div className={`p-2.5 rounded-xl ${stat.color} border border-white/5`}>
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <div className="p-1 px-2.5 rounded-full bg-white/5 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 border border-white/5">
                                    <TrendingUp className="h-3 w-3" />
                                    <span className="tracking-widest">+12.5%</span>
                                </div>
                            </div>
                            <p className="text-[12px] font-medium text-text-mid mb-1.5 relative z-10">{stat.label}</p>
                            <p className="text-2xl font-bold text-text tracking-tight group-hover:text-amber transition-colors relative z-10">{stat.value}</p>

                            {/* Subtle background glow */}
                            <div className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${stat.color.split(' ')[0]}`} />
                        </div>
                    ))}
                </div>

                {/* Main Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Recent Workbooks Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="font-syne text-[18px] font-bold text-text tracking-tight">Active Workbooks</h2>
                            <button className="text-[13px] font-medium text-amber hover:text-amber-bright transition-colors flex items-center gap-1.5 group">
                                View all books
                                <ArrowRightLeft className="h-3.5 w-3.5 rotate-180 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {workbooks.map((book) => (
                                <div key={book.title} className="group p-5 bg-surface border border-border rounded-2xl flex flex-col hover:border-white/10 hover:shadow-[0_24px_64px_rgba(0,0,0,0.4)] transition-all duration-500 relative overflow-hidden">
                                    <div className="flex gap-5 mb-5">
                                        <div className="h-24 w-18 rounded-lg bg-surface-2 border border-border overflow-hidden flex-shrink-0 shadow-lg relative">
                                            <img src={book.image} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-bg/40 to-transparent" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${book.color}`}>{book.category}</span>
                                                <button className="text-text-dim hover:text-text transition-colors"><MoreHorizontal className="h-4 w-4" /></button>
                                            </div>
                                            <h3 className="text-[16px] font-bold text-text leading-snug group-hover:text-amber transition-colors line-clamp-2 pr-4">{book.title}</h3>
                                            <div className="flex items-center gap-1.5 mt-3 text-[11px] text-text-dim font-medium">
                                                <Clock className="h-3 w-3" />
                                                <span>Modified {book.lastActive}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-5 border-t border-white/5">
                                        <div className="flex items-center justify-between mb-2.5">
                                            <span className="text-[11px] font-mono font-bold text-text-mid tracking-tight leading-none group-hover:text-text transition-colors">{book.progress}% COMPLETE</span>
                                            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-surface-2 border border-border group-hover:bg-amber group-hover:text-bg group-hover:border-amber transition-all duration-500">
                                                <ArrowUpRight className="h-3.5 w-3.5" />
                                            </div>
                                        </div>
                                        <div className="h-1.5 w-full bg-surface-3 rounded-full overflow-hidden border border-white/5">
                                            <div
                                                className="h-full bg-gradient-to-r from-amber to-[#ff6b35] transition-all duration-1000 ease-out rounded-full shadow-[0_0_8px_rgba(232,160,32,0.3)]"
                                                style={{ width: `${book.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar: Activity & Recommendations */}
                    <div className="space-y-10">
                        {/* Activity Section */}
                        <div className="space-y-6">
                            <h2 className="font-syne text-[18px] font-bold text-text tracking-tight">Live Updates</h2>
                            <div className="p-7 bg-surface border border-border rounded-2xl relative overflow-hidden">
                                <div className="space-y-8 relative">
                                    {[
                                        { text: 'Finished Lesson 4 in Engineering', time: '12m ago', icon: CheckCircle2 },
                                        { text: 'New assignment added by Director', time: '1h ago', icon: Plus },
                                        { text: 'Achieved a 5-day study streak!', time: '3h ago', icon: Flame },
                                    ].map((item, i, arr) => (
                                        <div key={i} className="flex gap-4 relative">
                                            {i !== arr.length - 1 && <div className="absolute left-2 top-6 bottom-0 w-px bg-white/5"></div>}
                                            <div className="h-4.5 w-4.5 rounded-full bg-amber/10 border border-amber/25 flex items-center justify-center flex-shrink-0 z-10 mt-0.5 shadow-[0_0_12px_rgba(232,160,32,0.1)]">
                                                <div className="h-1.5 w-1.5 rounded-full bg-amber animate-pulse"></div>
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-medium text-text leading-tight mb-1">{item.text}</p>
                                                <p className="font-mono text-[9px] text-text-dim uppercase tracking-widest">{item.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-10 py-3 bg-surface-2 hover:bg-surface-3 border border-white/5 text-[12px] font-bold text-text-mid hover:text-text rounded-lg transition-all">
                                    VIEW FULL AUDIT LOG
                                </button>
                            </div>
                        </div>

                        {/* Recommendation Card */}
                        <div className="p-8 bg-gradient-to-br from-amber to-[#ff6b35] rounded-2xl text-bg shadow-[0_24px_64px_rgba(232,160,32,0.25)] group cursor-pointer overflow-hidden relative border border-white/20">
                            <div className="absolute top-0 left-0 w-full h-full bg-noise opacity-10 pointer-events-none" />
                            <div className="absolute -right-6 -bottom-6 h-32 w-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />

                            <label className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] bg-bg/20 px-2.5 py-1 rounded-full mb-6 inline-block opacity-90 border border-bg/10">// PRO RECOMMENDATION</label>
                            <h3 className="font-instrument text-[28px] font-bold italic mb-3 leading-[1.1] tracking-tight">Advanced Distributed Systems</h3>
                            <p className="text-bg/80 text-[13px] font-medium mb-6 leading-relaxed">Based on your proficiency in Modern Web Architecture.</p>

                            <button className="flex items-center gap-2.5 text-[14px] font-bold group-hover:gap-4 transition-all">
                                <span>Start Module</span>
                                <ArrowRightLeft className="h-4 w-4 rotate-180" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default WorkbookPage;
