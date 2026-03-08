import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Play,
    Zap,
    Lock,
    Radio,
    Eye,
    Edit3,
    CheckCircle2,
    Crown,
    BookOpen
} from 'lucide-react';

export const LandingPage: React.FC = () => {
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [ringPos, setRingPos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    // Cursor Logic
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setCursorPos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        let frameId: number;
        const animateRing = () => {
            setRingPos(prev => ({
                x: prev.x + (cursorPos.x - prev.x) * 0.12,
                y: prev.y + (cursorPos.y - prev.y) * 0.12
            }));
            frameId = requestAnimationFrame(animateRing);
        };
        frameId = requestAnimationFrame(animateRing);
        return () => cancelAnimationFrame(frameId);
    }, [cursorPos]);

    useEffect(() => {
        const handleHover = () => setIsHovering(true);
        const handleUnhover = () => setIsHovering(false);

        const elements = document.querySelectorAll('button, a, input, [role="button"]');
        elements.forEach(el => {
            el.addEventListener('mouseenter', handleHover);
            el.addEventListener('mouseleave', handleUnhover);
        });

        return () => {
            elements.forEach(el => {
                el.removeEventListener('mouseenter', handleHover);
                el.removeEventListener('mouseleave', handleUnhover);
            });
        };
    }, []);

    // Scroll Reveal Logic
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('opacity-100', 'translate-y-0');
                        entry.target.classList.remove('opacity-0', 'translate-y-[30px]');
                    }
                });
            },
            { threshold: 0.15 }
        );

        document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-bg text-text selection:bg-amber selection:text-bg cursor-none">
            {/* Custom Cursor */}
            <div
                className="fixed w-2.5 h-2.5 bg-amber rounded-full pointer-events-none z-[9999] mix-blend-screen transition-transform duration-100"
                style={{
                    left: cursorPos.x - 5,
                    top: cursorPos.y - 5,
                    transform: isHovering ? 'scale(2)' : 'scale(1)'
                }}
            />
            <div
                className="fixed w-9 h-9 border border-amber/40 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-colors duration-150"
                style={{
                    left: ringPos.x,
                    top: ringPos.y,
                    transform: `translate(-50%, -50%) ${isHovering ? 'scale(1.5)' : 'scale(1)'}`,
                    borderColor: isHovering ? 'rgba(232,160,32,0.6)' : 'rgba(232,160,32,0.4)'
                }}
            />

            {/* Noise Overlay */}
            <div className="fixed inset-0 z-0 opacity-40 pointer-events-none bg-noise" />

            {/* Hero Glow */}
            <div className="fixed top-[-20vh] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse,rgba(232,160,32,0.08)_0%,transparent_65%)] pointer-events-none z-0" />

            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-[100] px-6 md:px-[60px] h-[68px] flex items-center bg-bg/80 backdrop-blur-2xl border-b border-white/5">
                <div className="flex items-center w-full max-w-[1200px] mx-auto">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="flex flex-col gap-[3.5px] w-7">
                            <div className="h-[2.5px] w-full rounded-sm bg-amber" />
                            <div className="h-[2.5px] w-[68%] rounded-sm bg-amber/65 transition-all duration-300 group-hover:w-[85%]" />
                            <div className="h-[2.5px] w-[40%] rounded-sm bg-amber/35 transition-all duration-300 group-hover:w-[60%]" />
                        </div>
                        <span className="font-syne font-bold text-[19px] tracking-tight">Stratum</span>
                    </Link>

                    <ul className="hidden md:flex items-center gap-9 ml-14">
                        {['Features', 'Roles', 'Pricing', 'Technology'].map((item) => (
                            <li key={item}>
                                <a href={`#${item.toLowerCase()}`} className="text-text-mid text-sm font-normal hover:text-text transition-colors tracking-wide">
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="ml-auto flex items-center gap-3">
                        <Link
                            to="/login"
                            className="px-5 py-2 rounded-lg border border-border-light text-text-mid text-[13px] hover:border-amber hover:text-amber transition-all cursor-pointer"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/signup"
                            className="px-[22px] py-2.5 rounded-lg bg-gradient-to-br from-amber to-[#ff6b35] text-white text-[13px] font-semibold shadow-[0_4px_20px_rgba(232,160,32,0.3)] hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(232,160,32,0.4)] transition-all cursor-pointer"
                        >
                            Start Free →
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative z-[1] pt-[180px] px-6 md:px-[60px] pb-[120px] max-w-[1200px] mx-auto grid md:grid-cols-2 gap-20 items-center">
                <div className="hero-left">
                    <div className="inline-flex items-center gap-2 bg-amber-dim border border-amber/20 rounded-full px-3.5 py-1.5 text-[12px] font-medium text-amber mb-7 tracking-widest uppercase">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse shadow-[0_0_0_5px_rgba(232,160,32,0)]" />
                        Real-time collaboration infrastructure
                    </div>

                    <h1 className="font-instrument text-[68px] leading-[1.0] tracking-[-2px] mb-6">
                        Every role.<br />
                        One living<br />
                        <span className="italic bg-gradient-to-br from-amber to-[#ff6b35] bg-clip-text text-transparent">document.</span>
                    </h1>

                    <p className="text-[18px] text-text-mid leading-relaxed font-light mb-11 max-w-[460px]">
                        Stratum is a role-layered collaborative workbook platform. Directors structure, teachers guide, students learn — all inside one conflict-free, real-time document.
                    </p>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/signup"
                            className="px-8 py-4 rounded-[10px] bg-gradient-to-br from-amber to-[#ff6b35] text-white text-[15px] font-semibold shadow-[0_8px_32px_rgba(232,160,32,0.35)] hover:-translate-y-[2px] hover:shadow-[0_16px_48px_rgba(232,160,32,0.45)] transition-all cursor-pointer"
                        >
                            Get Started Free →
                        </Link>
                        <button className="flex items-center gap-2 px-7 py-4 rounded-[10px] border border-border-light text-text-mid text-[15px] hover:text-text hover:border-border-light transition-all cursor-pointer group">
                            <div className="w-7 h-7 rounded-full bg-surface-3 flex items-center justify-center">
                                <Play size={10} fill="currentColor" />
                            </div>
                            See it live
                        </button>
                    </div>

                    <div className="flex gap-8 mt-14 pt-10 border-t border-border">
                        <div className="flex flex-col gap-1">
                            <span className="font-syne text-[28px] font-extrabold text-gradient">0ms</span>
                            <span className="text-[13px] text-text-dim">Conflict resolution</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="font-syne text-[28px] font-extrabold text-gradient">3</span>
                            <span className="text-[13px] text-text-dim">Role layers</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="font-syne text-[28px] font-extrabold text-gradient">∞</span>
                            <span className="text-[13px] text-text-dim">Simultaneous editors</span>
                        </div>
                    </div>
                </div>

                <div className="hidden md:block relative">
                    {/* Floating Role Badges */}
                    <RoleTag name="Mr. Davis" role="Director" color="var(--color-blue)" className="top-[-18px] right-[40px] delay-0" />
                    <RoleTag name="Ms. Okonkwo" role="Teacher" color="var(--color-green)" className="bottom-[40px] left-[-24px] delay-1000" />
                    <RoleTag name="Jamie" role="Student" color="var(--color-amber)" className="bottom-[-18px] right-[20px] delay-2000" />

                    <div className="bg-surface border border-border-light rounded-2xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
                        <div className="bg-surface-2 p-[14px_18px] flex items-center gap-2.5 border-b border-border">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                                <div className="w-2.5 h-2.5 rounded-full bg-[#28ca41]" />
                            </div>
                            <span className="font-syne text-[12px] font-semibold text-text-mid flex-1 text-center tracking-widest uppercase">
                                stratum.app / workbook / biology-term2
                            </span>
                            <div className="flex ml-[-4px]">
                                {['#1d4ed8', '#065f46', '#92400e'].map((bg, idx) => (
                                    <div key={idx} className="w-[22px] h-[22px] rounded-full border-2 border-surface-2 ml-[-4px] text-[9px] font-bold flex items-center justify-center" style={{ backgroundColor: bg }}>
                                        {['MD', 'AO', 'JK'][idx]}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex gap-1 mb-4">
                                <div className="px-3 py-1.5 rounded-md text-[11px] font-medium bg-amber-dim text-amber">Chapter 1</div>
                                <div className="px-3 py-1.5 rounded-md text-[11px] font-medium text-text-dim">Chapter 2</div>
                                <div className="px-3 py-1.5 rounded-md text-[11px] font-medium text-text-dim">Lab Notes</div>
                            </div>
                            <div className="bg-[#f8f7f4] rounded-lg p-4">
                                <div className="text-[11px] font-semibold text-[#333] mb-2 flex items-start gap-1.5">
                                    <span className="bg-amber/15 text-[#b8730a] rounded px-1 py-[1px] font-mono text-[9px] shrink-0 mt-0.5">Q1</span>
                                    Describe the role of mitochondria in cellular respiration.
                                </div>
                                <div className="bg-white border border-[#e5e3de] rounded-md p-2 text-[10px] text-[#555] leading-relaxed mb-2">
                                    <TypingText text="Mitochondria generate ATP through oxidative phosphorylation. They contain the electron transport chain and use oxygen to produce energy molecules that power the cell's metabolic functions." />
                                </div>
                                <div className="bg-[#fffbee] border-l-2 border-amber rounded px-2 py-1.5 text-[9px] text-[#7a5a10] leading-relaxed">
                                    <div className="font-bold text-[8.5px] text-[#b8860b] mb-0.5">✏️ Ms. Okonkwo</div>
                                    Good — expand on ATP synthesis and the inner membrane.
                                </div>
                                <div className="inline-flex items-center gap-1 bg-green/10 border border-green/25 text-green rounded-full px-2 py-0.5 text-[9px] font-bold mt-1.5">
                                    <CheckCircle2 size={10} /> 87 / 100
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Strata Divider */}
            <div className="relative h-[60px] overflow-hidden opacity-15">
                <div className="absolute left-[-10%] right-[-10%] h-[1px] bg-gradient-to-r from-transparent via-amber/50 to-transparent top-5 skew-y-[-0.8deg]" />
                <div className="absolute left-[-10%] right-[-10%] h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent top-[38px] skew-y-[-1.5deg] opacity-50" />
            </div>

            {/* Features */}
            <section id="features" className="reveal opacity-0 translate-y-[30px] transition-all duration-700 relative z-[1] py-[100px] px-6 md:px-[60px] max-w-[1200px] mx-auto">
                <label className="font-mono text-[11px] text-amber tracking-[0.15em] uppercase mb-4 block">// Core capabilities</label>
                <h2 className="font-instrument text-[52px] leading-[1.05] tracking-[-1.5px] mb-5">Built on the infrastructure<br />of modern collaboration</h2>
                <p className="text-[17px] text-text-mid leading-relaxed max-w-[560px] font-light">
                    Stratum uses CRDTs under the hood — the same technology that powers Figma, Notion, and Linear — with role-level permission gates baked into the sync layer.
                </p>

                <div className="grid md:grid-cols-3 gap-px bg-border border border-border rounded-2xl overflow-hidden mt-16">
                    <FeatureCard
                        icon={<Zap size={20} />}
                        title="Conflict-Free Real-Time Sync"
                        desc="Powered by Yjs CRDTs. Every keystroke from every user merges mathematically — no last-write-wins, no data loss, ever."
                    />
                    <FeatureCard
                        icon={<Lock size={20} />}
                        title="Role-Gated Edit Permissions"
                        desc="Permission checks happen at the WebSocket layer — not just the UI. A student can't touch a worksheet title, even via devtools."
                    />
                    <FeatureCard
                        icon={<Radio size={20} />}
                        title="Offline-First Architecture"
                        desc="Edit without internet. Changes persist in IndexedDB and merge automatically on reconnect — no conflicts, no lost work."
                    />
                    <FeatureCard
                        icon={<Eye size={20} />}
                        title="Live Presence & Cursors"
                        desc="See who's editing what in real time. Color-coded cursors, per-role awareness, and live typing indicators across all open sessions."
                    />
                    <FeatureCard
                        icon={<Edit3 size={20} />}
                        title="Co-Edit Annotations"
                        desc="Teachers annotate student answers with suggested rewrites — tracked changes, Word-style — without overwriting the original."
                    />
                    <FeatureCard
                        icon={<CheckCircle2 size={20} />}
                        title="Structured Grade Approval Flow"
                        desc="Teachers grade, directors approve. A clean async workflow that keeps accountability layered into the document structure itself."
                    />
                </div>
            </section>

            {/* Roles */}
            <section id="roles" className="reveal opacity-0 translate-y-[30px] transition-all duration-700 py-[100px] px-6 md:px-[60px] max-w-[1200px] mx-auto relative z-[1]">
                <label className="font-mono text-[11px] text-amber tracking-[0.15em] uppercase mb-4 block">// Role architecture</label>
                <h2 className="font-instrument text-[52px] leading-[1.05] tracking-[-1.5px] mb-5">Three layers.<br />One document.</h2>
                <p className="text-[17px] text-text-mid leading-relaxed max-w-[560px] font-light">
                    Each role has a precise set of capabilities. The boundaries are enforced at the sync infrastructure level — not the UI.
                </p>

                <div className="grid md:grid-cols-3 gap-5 mt-16">
                    <RoleCard
                        role="Director"
                        icon={<Crown className="text-blue" />}
                        color="border-blue"
                        desc="Owns the workbook structure. Creates and names worksheets, and is the final approver of all grades assigned by teachers."
                        perms={[
                            { ok: true, text: "Create & rename worksheets" },
                            { ok: true, text: "Approve or reject grades" },
                            { ok: true, text: "Full read access to all content" },
                            { ok: false, text: "Cannot add questions" },
                            { ok: false, text: "Cannot edit answers" },
                        ]}
                    />
                    <RoleCard
                        role="Teacher"
                        icon={<Edit3 className="text-green" />}
                        color="border-green"
                        desc="Populates worksheets with questions, reviews student submissions, annotates answers, and assigns grades for approval."
                        perms={[
                            { ok: true, text: "Create & edit questions" },
                            { ok: true, text: "Annotate student answers" },
                            { ok: true, text: "Assign and submit grades" },
                            { ok: false, text: "Cannot create worksheets" },
                            { ok: false, text: "Cannot overwrite answers" },
                        ]}
                    />
                    <RoleCard
                        role="Student"
                        icon={<BookOpen className="text-amber" />}
                        color="border-amber"
                        desc="Sees the structured workbook, writes free-form answers to questions, and views their own approved grade and teacher feedback."
                        perms={[
                            { ok: true, text: "Answer questions (own only)" },
                            { ok: true, text: "View own approved grade" },
                            { ok: true, text: "See teacher annotations" },
                            { ok: false, text: "Cannot edit questions" },
                            { ok: false, text: "Cannot see other students" },
                        ]}
                    />
                </div>
            </section>

            {/* Technology Stack */}
            <section id="tech" className="reveal opacity-0 translate-y-[30px] transition-all duration-700 py-20 px-6 md:px-[60px] relative z-[1] border-y border-border bg-surface">
                <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-20 items-center">
                    <div>
                        <label className="font-mono text-[11px] text-amber tracking-[0.15em] uppercase mb-4 block">// Under the hood</label>
                        <h2 className="font-instrument text-[40px] leading-tight mb-5">Infrastructure-grade<br />sync engine</h2>
                        <p className="text-sm text-text-mid leading-relaxed mb-8 font-light">
                            Stratum is built on Yjs CRDTs with Hocuspocus as the WebSocket sync server. Role authorization is injected directly into the sync pipeline — not bolted on as UI logic.
                        </p>
                        <div className="flex flex-col gap-3">
                            {[
                                { color: 'amber', text: 'Yjs — CRDT document engine' },
                                { color: 'green', text: 'Hocuspocus — Role-aware WebSocket server' },
                                { color: 'blue', text: 'TipTap — Rich text editor, Yjs-native' },
                                { color: '#c792ea', text: 'y-indexeddb — Offline persistence layer' },
                                { color: '#ff6b35', text: 'Next.js + PostgreSQL + Prisma' },
                            ].map((tech, i) => (
                                <div key={i} className="flex items-center gap-2.5 text-[13px] text-text-mid">
                                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: tech.color }} />
                                    {tech.text}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-bg border border-border rounded-xl p-7 font-mono text-[12px] leading-relaxed">
                        <div className="text-text-dim">// Hocuspocus role guard</div>
                        <div className="mt-2.5">
                            <span className="text-[#c792ea]">const</span> <span className="text-blue">server</span> = <span className="text-amber">Server</span>.configure({'{'}
                        </div>
                        <div className="pl-5">
                            <span className="text-amber">onLoadDocument</span>: <span className="text-[#c792ea]">async</span> ({'{'} <span className="text-blue">context</span> {'}'}) ={'>'} {'{'}
                        </div>
                        <div className="pl-10">
                            <span className="text-[#c792ea]">return</span> <span className="text-amber">loadFromDB</span>(<span className="text-blue">context</span>.roomName)
                        </div>
                        <div className="pl-5">{'}'},</div>
                        <div className="pl-5 mt-1.5">
                            <span className="text-amber">onConnect</span>: <span className="text-[#c792ea]">async</span> ({'{'} <span className="text-blue">connection</span>, <span className="text-blue">context</span> {'}'}) ={'>'} {'{'}
                        </div>
                        <div className="pl-10">
                            <span className="text-[#c792ea]">const</span> <span className="text-blue">user</span> = <span className="text-[#c792ea]">await</span> <span className="text-amber">verifyJWT</span>(<span className="text-blue">context</span>.token)
                        </div>
                        <div className="pl-10">
                            <span className="text-blue">connection</span>.readOnly = <span className="text-blue">user</span>.role === <span className="text-green">'student'</span>
                        </div>
                        <div className="pl-5">{'}'},</div>
                        <div className="pl-5 mt-1.5">
                            <span className="text-amber">onBeforeHandleMessage</span>: ({'{'} <span className="text-blue">context</span>, <span className="text-blue">update</span> {'}'}) ={'>'} {'{'}
                        </div>
                        <div className="pl-10">
                            <span className="text-amber">enforceRolePermissions</span>(<span className="text-blue">context</span>.user, <span className="text-blue">update</span>)
                        </div>
                        <div className="pl-5">{'}'}</div>
                        <div>{'}'})</div>
                        <div className="mt-3 pt-3 border-t border-border text-text-dim">
                            <div>// Role checked at the sync layer ✓</div>
                            <div>// Not just in the UI ✓</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="reveal opacity-0 translate-y-[30px] transition-all duration-700 py-[100px] px-6 md:px-[60px] max-w-[1200px] mx-auto relative z-[1]">
                <div className="text-center">
                    <label className="font-mono text-[11px] text-amber tracking-[0.15em] uppercase mb-4 flex justify-center">// Simple pricing</label>
                    <h2 className="font-instrument text-[52px] leading-tight tracking-[-2px] mb-5">Straightforward.<br />No surprises.</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-5 mt-16">
                    <PriceCard
                        plan="Starter"
                        price="$0"
                        desc="Perfect for small classrooms getting started."
                        features={["1 workbook", "Up to 30 users", "All 3 roles", "Real-time sync", "2GB storage"]}
                    />
                    <PriceCard
                        plan="Pro"
                        price="$29"
                        desc="For growing institutions with multiple classes."
                        featured
                        features={["Unlimited workbooks", "Up to 500 users", "Offline-first sync", "Grade approval workflow", "Priority support", "20GB storage"]}
                    />
                    <PriceCard
                        plan="Enterprise"
                        price="Custom"
                        desc="For schools and districts at scale."
                        features={["Unlimited everything", "SSO / SAML", "Self-hosted option", "SLA guarantee", "Dedicated support", "Custom integrations"]}
                    />
                </div>
            </section>

            {/* CTA Banner */}
            <div className="reveal opacity-0 translate-y-[30px] transition-all duration-700 mx-6 md:mx-[60px] mb-[100px] max-w-[1080px] md:mx-auto bg-gradient-to-br from-surface-2 to-surface border border-amber/20 rounded-[24px] py-16 px-8 text-center relative overflow-hidden z-[1]">
                <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(232,160,32,0.1),transparent_60%)] pointer-events-none" />
                <h2 className="font-instrument text-[48px] text-text tracking-[-1.5px] mb-4">Ready to restructure<br />how your team collaborates?</h2>
                <p className="text-[17px] text-text-mid mb-10">Start free. No credit card. All roles, all features, live today.</p>
                <div className="flex flex-col md:flex-row gap-3 justify-center">
                    <Link
                        to="/signup"
                        className="px-8 py-4 rounded-[10px] bg-gradient-to-br from-amber to-[#ff6b35] text-white text-[15px] font-semibold shadow-[0_8px_32px_rgba(232,160,32,0.35)] hover:-translate-y-px transition-all cursor-pointer"
                    >
                        Create Your Workbook →
                    </Link>
                    <Link
                        to="/login"
                        className="px-8 py-4 rounded-[10px] border border-border-light text-text-mid text-[15px] hover:text-text hover:border-border-light transition-all cursor-pointer"
                    >
                        Sign In
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-border py-12 px-6 md:px-[60px] relative z-[1]">
                <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2.5">
                        <div className="flex flex-col gap-[2.5px] w-5">
                            <div className="h-[2px] w-full bg-amber rounded-sm" />
                            <div className="h-[2px] w-[68%] bg-amber/65 rounded-sm" />
                            <div className="h-[2px] w-[40%] bg-amber/35 rounded-sm" />
                        </div>
                        <span className="font-syne font-bold text-[15px] text-text-mid">Stratum</span>
                        <span className="text-[13px] text-text-dim ml-4">© 2025 Stratum Inc.</span>
                    </div>
                    <div className="flex gap-7">
                        {['Privacy', 'Terms', 'Docs', 'GitHub', 'Status'].map(link => (
                            <a key={link} href="#" className="text-[13px] text-text-dim hover:text-text-mid transition-colors">
                                {link}
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

// ── Components

const RoleTag: React.FC<{ name: string; role: string; color: string; className: string }> = ({ name, role, color, className }) => (
    <div className={`absolute bg-surface border border-border-light rounded-lg p-[8px_12px] text-[11px] font-medium flex items-center gap-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.4)] animate-float-y ${className}`}>
        <div className="w-[7px] h-[7px] rounded-full animate-pulse" style={{ backgroundColor: color, boxShadow: `0 0 0 0 ${color}50` }} />
        <span className="text-text-mid">{name} <span style={{ color }}>{role}</span></span>
    </div>
);

const TypingText: React.FC<{ text: string }> = ({ text }) => {
    const [displayed, setDisplayed] = useState('');
    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setDisplayed(text.slice(0, i++));
            if (i > text.length) clearInterval(interval);
        }, 50);
        return () => clearInterval(interval);
    }, [text]);
    return <>{displayed}<span className="inline-block w-[1.5px] h-[11px] bg-amber align-text-bottom animate-blink ml-[1px]" /></>;
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
    <div className="group relative bg-surface p-[36px_32px] hover:bg-surface-2 transition-colors overflow-hidden">
        <div className="w-11 h-11 bg-amber-dim border border-amber/20 rounded-xl flex items-center justify-center text-amber text-xl mb-5">
            {icon}
        </div>
        <div className="font-syne text-base font-bold text-text mb-2.5">{title}</div>
        <p className="text-sm text-text-mid leading-relaxed">{desc}</p>
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber to-[#ff6b35] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
    </div>
);

const RoleCard: React.FC<{ role: string; icon: React.ReactNode; color: string; desc: string; perms: { ok: boolean; text: string }[] }> = ({ role, icon, color, desc, perms }) => (
    <div className={`group bg-surface border border-border rounded-2xl p-[36px_28px] relative overflow-hidden transition-all hover:border-border-light hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]`}>
        <div className={`absolute top-0 left-0 right-0 h-[3px] ${color.replace('border', 'bg')}`} />
        <div className="text-4xl mb-4">{icon}</div>
        <div className={`font-syne text-[20px] font-bold mb-2.5 ${color.replace('border', 'text')}`}>{role}</div>
        <p className="text-sm text-text-mid leading-relaxed mb-6">{desc}</p>
        <div className="flex flex-col gap-2">
            {perms.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-[12px] text-text-mid">
                    <span className={`text-[13px] ${p.ok ? 'text-green' : 'text-text-dim'}`}>{p.ok ? '✓' : '✗'}</span>
                    {p.text}
                </div>
            ))}
        </div>
    </div>
);

const PriceCard: React.FC<{ plan: string; price: string; desc: string; featured?: boolean; features: string[] }> = ({ plan, price, desc, featured, features }) => (
    <div className={`bg-surface border border-border rounded-2xl p-[36px_28px] transition-all relative ${featured ? 'bg-gradient-to-br from-surface-2/50 to-surface border-amber/35 shadow-[0_0_40px_rgba(232,160,32,0.1)]' : 'hover:border-border-light hover:-translate-y-1'}`}>
        {featured && <div className="absolute top-[-12px] left-1/2 -translate-x-1/2 bg-gradient-to-br from-amber to-[#ff6b35] text-white text-[11px] font-bold px-3.5 py-1 rounded-full tracking-wider">MOST POPULAR</div>}
        <div className="font-syne text-[13px] font-bold uppercase tracking-widest text-text-mid mb-5">{plan}</div>
        <div className="font-instrument text-[52px] text-text tracking-tight leading-tight">
            {price}<span className="text-base text-text-mid font-dm">{price.includes('$') ? '/mo' : ''}</span>
        </div>
        <p className="text-[13px] text-text-dim mt-3 mb-6 leading-relaxed">{desc}</p>
        <ul className="flex flex-col gap-2.5 mb-7">
            {features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-[13px] text-text-mid italic before:content-['✓'] before:text-green before:font-bold before:not-italic">{f}</li>
            ))}
        </ul>
        <Link
            to="/signup"
            className={`block text-center w-full py-3 rounded-lg font-dm text-sm font-semibold transition-all cursor-pointer ${featured ? 'bg-gradient-to-br from-amber to-[#ff6b35] text-white shadow-[0_4px_20px_rgba(232,160,32,0.3)] hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(232,160,32,0.4)]' : 'border border-border-light text-text-mid hover:border-amber hover:text-amber'}`}
        >
            {plan === 'Enterprise' ? 'Contact Sales' : featured ? 'Start Free Trial →' : 'Get Started'}
        </Link>
    </div>
);
