import { Search, Bell, ChevronDown, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function TopBar() {
    const { user } = useAuthStore();

    return (
        <div className="flex h-[68px] items-center justify-between border-b border-white/5 px-8 bg-bg/80 backdrop-blur-2xl sticky top-0 z-[100] py-2">
            <div className="flex-1 max-w-md">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim group-focus-within:text-amber transition-colors" />
                    <input
                        type="text"
                        placeholder="Search for workbooks, lessons..."
                        className="w-full h-[38px] pl-10 pr-4 bg-surface-2/50 border border-border rounded-lg text-[13px] text-text-mid outline-none focus:border-amber/50 focus:ring-4 focus:ring-amber/5 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-5">
                <button className="relative p-2 text-text-mid hover:text-text hover:bg-surface-2 rounded-lg transition-all group">
                    <Bell className="h-4.5 w-4.5" />
                    <div className="absolute top-2 right-2.5 h-2 w-2 bg-amber rounded-full border-2 border-bg shadow-[0_0_8px_rgba(232,160,32,0.6)] group-hover:scale-110 transition-transform"></div>
                </button>

                <div className="h-7 w-[1px] bg-border mx-1"></div>

                <button className="flex items-center gap-3 p-1 pl-1.5 pr-2.5 hover:bg-surface-2 rounded-xl transition-all group border border-transparent hover:border-white/5">
                    <div className="h-9 w-9 rounded-lg bg-surface-3 flex items-center justify-center border border-border overflow-hidden shadow-sm group-hover:border-amber/30 transition-colors">
                        {user?.firstName ? (
                            <span className="text-[14px] font-bold text-amber">{user.firstName[0]}</span>
                        ) : user?.email ? (
                            <span className="text-[14px] font-bold text-amber">{user.email[0].toUpperCase()}</span>
                        ) : (
                            <User className="h-4 w-4 text-text-mid" />
                        )}
                    </div>
                    <div className="text-left">
                        <p className="text-[13px] font-semibold text-text leading-none mb-1">
                            {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-[11px] text-text-dim leading-none truncate max-w-[120px] mb-1.5">
                            {user?.email || 'no-email@stratum.com'}
                        </p>
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-text-dim group-hover:translate-y-0.5 transition-transform" />
                </button>
            </div>
        </div>
    );
}