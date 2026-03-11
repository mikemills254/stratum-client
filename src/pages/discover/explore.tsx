import React, { useEffect, useState } from 'react';
import {
    Compass,
    Users,
    FileText,
    Search,
    PlusCircle,
    Lock,
    Globe
} from 'lucide-react';
import Wrapper from '../../components/ui/wrapper';
import { useAuthStore } from '../../store/authStore';
import { handleGetExploreWorkbooks, handleJoinWorkbook } from '@/api/workbook';
import toast from 'react-hot-toast';
import type { Workbook } from '@/types/workbooks';
import { useNavigate } from 'react-router-dom';

export const ExplorePage: React.FC = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [workbooks, setWorkbooks] = useState<Workbook[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [joiningId, setJoiningId] = useState<string | null>(null);

    const fetchExploreData = async () => {
        try {
            setLoading(true);
            const results = await handleGetExploreWorkbooks({ query: searchQuery });
            if (results.success && results.data) {
                setWorkbooks(results.data);
            } else {
                toast.error(results.message);
            }
        } catch (error) {
            console.error("error", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'DIRECTOR') {
            navigate('/workbook');
            return;
        }

        const timer = setTimeout(() => {
            fetchExploreData();
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, user, navigate]);

    const handleJoin = async (workbookId: string) => {
        try {
            setJoiningId(workbookId);
            const res = await handleJoinWorkbook(workbookId);
            if (res.success) {
                toast.success('Joined workbook successfully!');
                navigate(`/workbook/${workbookId}`);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error('Failed to join workbook');
        } finally {
            setJoiningId(null);
        }
    };

    return (
        <Wrapper>
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-amber">
                            <Compass className="h-5 w-5" />
                            <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold">Discover</span>
                        </div>
                        <h1 className="font-instrument text-[48px] leading-[1.1] text-text tracking-tight">
                            Explore <span className="italic text-gradient">Workbooks</span>
                        </h1>
                        <p className="text-[16px] text-text-mid font-light max-w-[500px]">
                            Find new subjects, join communities, and expand your curriculum. Choose from curated public workbooks.
                        </p>
                    </div>

                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim group-focus-within:text-amber transition-colors" />
                        <input
                            type="text"
                            placeholder="Search workbooks or tags..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-surface border border-border rounded-2xl pl-11 pr-4 py-3 text-[14px] text-text focus:outline-none focus:border-amber/50 focus:ring-4 focus:ring-amber/5 transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Grid Section */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-64 bg-surface/50 border border-border animate-pulse rounded-2xl" />
                        ))}
                    </div>
                ) : workbooks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {workbooks.map((book) => (
                            <div key={book.id} className="group p-6 bg-surface border border-border rounded-2xl flex flex-col hover:border-black/10 hover:shadow-xl hover:shadow-amber/5 transition-all duration-500 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-amber/5 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />

                                <div className="relative space-y-4 flex-1">
                                    <div className="flex items-start justify-between">
                                        <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-amber/20 bg-amber/5 text-amber">
                                            {book.tag || 'General'}
                                        </span>
                                        {book.isPrivate ? (
                                            <Lock className="h-3.5 w-3.5 text-text-dim" />
                                        ) : (
                                            <Globe className="h-3.5 w-3.5 text-emerald-500/50" />
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-[18px] font-bold text-text leading-tight group-hover:text-amber transition-colors line-clamp-2">
                                            {book.name}
                                        </h3>
                                        <p className="text-[13px] text-text-dim line-clamp-3 leading-relaxed">
                                            {book.description || "No description provided for this workbook."}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-black/5 flex items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-3.5 w-3.5 text-text-dim" />
                                            <span className="text-[11px] font-bold text-text leading-none">{book._count?.worksheets || 0}</span>
                                            <span className="text-[9px] font-mono text-text-dim uppercase tracking-wider">Sheets</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-3.5 w-3.5 text-text-dim" />
                                            <span className="text-[11px] font-bold text-text leading-none">{book._count?.students || 0}</span>
                                            <span className="text-[9px] font-mono text-text-dim uppercase tracking-wider">Students</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => !book.isPrivate && handleJoin(book.id)}
                                    disabled={joiningId === book.id}
                                    className={`mt-6 w-full py-3.5 rounded-xl font-bold text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${book.isPrivate
                                        ? 'bg-amber/10 text-amber border border-amber/20 hover:bg-amber/20'
                                        : 'bg-text text-bg hover:bg-amber hover:shadow-lg hover:shadow-amber/20'
                                        }`}
                                >
                                    {joiningId === book.id ? (
                                        <div className="h-4 w-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                                    ) : book.isPrivate ? (
                                        <>
                                            <Lock className="h-3.5 w-3.5" />
                                            Request Access
                                        </>
                                    ) : (
                                        <>
                                            <PlusCircle className="h-3.5 w-3.5" />
                                            {user?.role === 'TEACHER' ? 'Request to Grade' : 'Participate'}
                                        </>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 flex flex-col items-center justify-center text-center space-y-4 bg-surface/30 border border-dashed border-border rounded-3xl">
                        <div className="p-5 rounded-full bg-black/5 text-text-dim">
                            <Search className="h-10 w-10" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-[20px] font-syne font-bold text-text">No workbooks found</h3>
                            <p className="text-text-dim text-[14px] max-w-sm">
                                We couldn't find any workbooks matching your search. Try different keywords or check back later!
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Wrapper>
    );
};

export default ExplorePage;
