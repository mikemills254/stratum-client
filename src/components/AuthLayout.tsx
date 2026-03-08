import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Edit3, Radio, Lock, Crown, BookOpen } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    sub: React.ReactNode;
    onBack?: () => void;
    type?: 'signin' | 'signup' | '2fa' | 'forgotpass';
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, sub, onBack, type = 'signin' }) => {
    return (
        <div className="flex flex-col md:grid md:grid-cols-2 min-h-screen bg-bg text-text selection:bg-amber selection:text-bg">
            {onBack && (
                <button
                    onClick={onBack}
                    className="fixed top-6 left-6 z-[200] bg-surface border border-border-light text-text-mid px-4 py-2 rounded-lg text-[13px] flex items-center gap-1.5 hover:text-amber hover:border-amber transition-all cursor-pointer md:hidden"
                >
                    <ArrowRight className="rotate-180" size={14} /> Back
                </button>
            )}

            <div className="hidden md:flex flex-col bg-surface border-r border-border p-12 pr-[60px] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 60px, var(--color-amber) 60px, var(--color-amber) 61px)' }} />

                <div className="relative z-[1] mb-auto">
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="flex flex-col gap-[3.5px] w-7">
                            <div className="h-[2.5px] w-full bg-amber rounded-sm" />
                            <div className="h-[2.5px] w-[68%] bg-amber/65 rounded-sm" />
                            <div className="h-[2.5px] w-[40%] bg-amber/35 rounded-sm" />
                        </div>
                        <span className="font-syne font-bold text-[19px] tracking-tight">Stratum</span>
                    </Link>
                </div>

                <div className="relative z-[1] my-auto">
                    <h2 className="font-instrument text-[38px] leading-[1.15] tracking-tight mb-6">
                        {type === 'signin' || type === '2fa' || type === 'forgotpass' ? (
                            <>The document that<br /><span className="italic text-amber">never conflicts.</span></>
                        ) : (
                            <>One workbook.<br />Every role in its<br /><span className="italic text-amber">exact place.</span></>
                        )}
                    </h2>
                    <ul className="flex flex-col gap-3.5">
                        {type === 'signin' || type === '2fa' || type === 'forgotpass' ? [
                            { icon: <Zap size={13} />, text: "Real-time sync across all roles" },
                            { icon: <Lock size={13} />, text: "Permission-enforced at the sync layer" },
                            { icon: <Radio size={13} />, text: "Works offline, merges on reconnect" },
                            { icon: <Edit3 size={13} />, text: "Co-editing with tracked annotations" },
                        ].map((f, i) => (
                            <li key={i} className="flex items-center gap-2.5 text-sm text-text-mid">
                                <div className="w-7 h-7 rounded-md bg-amber-dim border border-amber/20 flex items-center justify-center text-amber shrink-0">{f.icon}</div>
                                {f.text}
                            </li>
                        )) : [
                            { icon: <Crown size={13} />, text: "Directors control workbook structure" },
                            { icon: <Edit3 size={13} />, text: "Teachers set questions & grade answers" },
                            { icon: <BookOpen size={13} />, text: "Students answer & view feedback" },
                            { icon: <Radio size={13} />, text: "All synced live, conflict-free" },
                        ].map((f, i) => (
                            <li key={i} className="flex items-center gap-2.5 text-sm text-text-mid">
                                <div className="w-7 h-7 rounded-md bg-amber-dim border border-amber/20 flex items-center justify-center text-amber shrink-0">{f.icon}</div>
                                {f.text}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="relative z-[1] mt-12 pt-7 border-t border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue to-green flex items-center justify-center font-bold shrink-0">
                            {type === 'signin' || type === '2fa' || type === 'forgotpass' ? 'AO' : 'MK'}
                        </div>
                        <div>
                            <div className="text-[13px] text-text-mid leading-relaxed italic">
                                {type === 'signin' || type === '2fa' || type === 'forgotpass'
                                    ? '"Stratum replaced our entire grading workflow. Everything lives in one place, everyone sees the right thing."'
                                    : '"I showed this to my interviewer and they stopped the interview just to ask how I built it."'}
                            </div>
                            <div className="text-[12px] text-text-dim mt-1">
                                {type === 'signin' || type === '2fa' || type === 'forgotpass'
                                    ? 'Amina Osei, Head of Biology · Nairobi Academy'
                                    : 'Mike K., Software Engineer'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-6 md:p-[60px] pt-[100px] md:pt-[60px]">
                <div className="w-full max-w-[400px]">
                    <h1 className="font-instrument text-[36px] tracking-tight mb-2">{title}</h1>
                    <p className="text-[15px] text-text-mid mb-10">{sub}</p>
                    {children}
                </div>
            </div>
        </div>
    );
};
