import {
    BookOpen,
    Settings,
    LogOut,
    ArrowRightLeft,
    Library,
    Compass
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function SideBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { signOut } = useAuth();

    const navItems = [
        { icon: BookOpen, label: 'Workbooks', path: '/workbook' },
        { icon: Compass, label: 'Explore', path: '/explore' },
        { icon: Library, label: 'Library', path: '/library' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex h-screen w-64 flex-col border-r border-border bg-surface relative z-[10]">
            <div className="flex h-[68px] items-center px-6 mb-4 border-b border-white/5">
                <div className="flex items-center gap-2.5 group">
                    <div className="flex flex-col gap-[3.5px] w-7">
                        <div className="h-[2.5px] w-full rounded-sm bg-amber" />
                        <div className="h-[2.5px] w-[68%] rounded-sm bg-amber/65 transition-all duration-300 group-hover:w-[85%]" />
                        <div className="h-[2.5px] w-[40%] rounded-sm bg-amber/35 transition-all duration-300 group-hover:w-[60%]" />
                    </div>
                    <span className="font-syne font-bold text-[19px] tracking-tight text-text">Stratum</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8 scrollbar-hidden">
                <div>
                    <label className="px-3 mb-4 font-mono text-[10px] text-amber tracking-[0.15em] uppercase block opacity-70">// Menu</label>
                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => navigate(item.path)}
                                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-dm transition-all group ${isActive(item.path)
                                        ? 'bg-amber-dim text-amber border border-amber/20'
                                        : 'text-text-mid hover:text-text hover:bg-surface-2'
                                    }`}
                            >
                                <item.icon className={`h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110 ${isActive(item.path) ? 'text-amber' : 'text-text-mid'
                                    }`} />
                                <span className={isActive(item.path) ? 'font-semibold' : 'font-normal'}>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div>
                    <label className="px-3 mb-4 font-mono text-[10px] text-amber tracking-[0.15em] uppercase block opacity-70">// Support</label>
                    <nav className="space-y-1">
                        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-dm text-text-mid hover:text-text hover:bg-surface-2 transition-all">
                            <Settings className="h-4.5 w-4.5" />
                            <span>Settings</span>
                        </button>
                        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-dm text-text-mid hover:text-text hover:bg-surface-2 transition-all">
                            <ArrowRightLeft className="h-4.5 w-4.5" />
                            <span>Transactions</span>
                        </button>
                    </nav>
                </div>
            </div>

            <div className="p-4 mt-auto space-y-4">
                <div className="p-5 rounded-xl bg-gradient-to-br from-surface-2 to-surface border border-amber/15 relative overflow-hidden group cursor-pointer">
                    <div className="absolute top-[-20px] right-[-20px] w-16 h-16 bg-amber/5 blur-xl rounded-full group-hover:scale-150 transition-transform duration-500" />
                    <p className="font-syne text-[14px] font-bold text-text mb-1">Stratum Pro</p>
                    <p className="text-[11px] text-text-mid mb-4 leading-relaxed">Unlimited workbooks and collaboration tools.</p>
                    <button className="w-full py-2 bg-gradient-to-br from-amber to-[#ff6b35] text-white rounded-lg text-[12px] font-bold shadow-[0_4px_12px_rgba(232,160,32,0.2)] hover:shadow-[0_8px_20px_rgba(232,160,32,0.3)] hover:-translate-y-px transition-all">
                        Upgrade Now
                    </button>
                </div>

                <button
                    onClick={signOut}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-dm text-text-mid hover:text-red-400 hover:bg-red-400/5 transition-all group"
                >
                    <LogOut className="h-4.5 w-4.5 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
}