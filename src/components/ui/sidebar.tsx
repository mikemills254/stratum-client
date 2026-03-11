import {
    BookOpen,
    Settings,
    LogOut,
    ArrowRightLeft,
    Library,
    Compass,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useSidebarStore } from '../../store/sidebarStore';
import { Role } from '@/types/types';
import { useAuth } from '../../contexts/authContext';

export default function SideBar() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { isCollapsed, toggleSidebar } = useSidebarStore();
    const location = useLocation();
    const { signOut } = useAuth();

    const navItems = [
        { icon: BookOpen, label: 'Workbooks', path: '/workbook' },
        ...(user?.role !== Role.DIRECTOR ? [{ icon: Compass, label: 'Explore', path: '/explore' }] : []),
        { icon: Library, label: 'Library', path: '/library' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className={`flex h-screen flex-col border-r border-border bg-surface relative z-[10] transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className={`flex h-[68px] items-center mb-4 border-b border-black/5 transition-all duration-300 ${isCollapsed ? 'px-4 justify-center' : 'px-6'}`}>
                <div className="flex items-center gap-2.5 group">
                    <div className="flex flex-col gap-[3.5px] w-7 shrink-0">
                        <div className="h-[2.5px] w-full rounded-sm bg-amber" />
                        <div className="h-[2.5px] w-[68%] rounded-sm bg-amber/65 transition-all duration-300 group-hover:w-[85%]" />
                        <div className="h-[2.5px] w-[40%] rounded-sm bg-amber/35 transition-all duration-300 group-hover:w-[60%]" />
                    </div>
                    {!isCollapsed && (
                        <span className="font-syne font-bold text-[19px] tracking-tight text-text animate-in fade-in slide-in-from-left-2 duration-300">Stratum</span>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8 scrollbar-hidden">
                <div>
                    <label className={`px-3 mb-4 font-mono text-[10px] text-amber tracking-[0.15em] uppercase block opacity-70 transition-all duration-300 ${isCollapsed ? 'scale-0 h-0 mb-0 opacity-0' : 'scale-100'}`}>
                        // Menu
                    </label>
                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => navigate(item.path)}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-dm transition-all group relative ${isActive(item.path)
                                    ? 'bg-amber/10 text-amber border border-amber/20'
                                    : 'text-text-mid hover:text-text hover:bg-surface-2 border border-transparent'
                                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                                title={isCollapsed ? item.label : ''}
                            >
                                <item.icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 shrink-0 ${isActive(item.path) ? 'text-amber' : 'text-text-mid'
                                    }`} />
                                {!isCollapsed && (
                                    <span className={`transition-all duration-300 truncate ${isActive(item.path) ? 'font-semibold' : 'font-normal'}`}>{item.label}</span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                <div>
                    <label className={`px-3 mb-4 font-mono text-[10px] text-amber tracking-[0.15em] uppercase block opacity-70 transition-all duration-300 ${isCollapsed ? 'scale-0 h-0 mb-0 opacity-0' : 'scale-100'}`}>
                        // Support
                    </label>
                    <nav className="space-y-1">
                        <button
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-dm text-text-mid hover:text-text hover:bg-surface-2 transition-all group ${isCollapsed ? 'justify-center px-0' : ''}`}
                            title={isCollapsed ? "Settings" : ""}
                        >
                            <Settings className="h-5 w-5 shrink-0" />
                            {!isCollapsed && <span className="truncate">Settings</span>}
                        </button>
                        <button
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-dm text-text-mid hover:text-text hover:bg-surface-2 transition-all group ${isCollapsed ? 'justify-center px-0' : ''}`}
                            title={isCollapsed ? "Transactions" : ""}
                        >
                            <ArrowRightLeft className="h-5 w-5 shrink-0" />
                            {!isCollapsed && <span className="truncate">Transactions</span>}
                        </button>
                    </nav>
                </div>
            </div>

            <div className={`p-4 mt-auto space-y-4 transition-all duration-300 ${isCollapsed ? 'px-2' : ''}`}>
                {
                    user?.role === Role.DIRECTOR && !isCollapsed && (
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-surface-2 to-surface border border-amber/15 relative overflow-hidden group cursor-pointer animate-in zoom-in-95 duration-500">
                            <div className="absolute top-[-20px] right-[-20px] w-16 h-16 bg-amber/5 blur-xl rounded-full group-hover:scale-150 transition-transform duration-500" />
                            <p className="font-syne text-[14px] font-bold text-text mb-1">Stratum Pro</p>
                            <p className="text-[11px] text-text-mid mb-4 leading-relaxed">Unlimited workbooks and collaboration tools.</p>
                            <button className="w-full py-2 bg-gradient-to-br from-amber to-[#ff6b35] text-text rounded-lg text-[12px] font-bold shadow-[0_4px_12px_rgba(232,160,32,0.2)] hover:shadow-[0_8px_20px_rgba(232,160,32,0.3)] hover:-translate-y-px transition-all">
                                Upgrade Now
                            </button>
                        </div>
                    )
                }

                <button
                    onClick={signOut}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-dm text-text-mid hover:text-red-400 hover:bg-red-400/5 transition-all group ${isCollapsed ? 'justify-center px-0' : ''}`}
                    title={isCollapsed ? "Sign Out" : ""}
                >
                    <LogOut className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform shrink-0" />
                    {!isCollapsed && <span className="truncate">Sign Out</span>}
                </button>
            </div>

            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-surface border border-border flex items-center justify-center text-text-dim hover:text-amber hover:border-amber/50 transition-all z-20 shadow-lg"
            >
                {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
            </button>
        </div>
    );
}
