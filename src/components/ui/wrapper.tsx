import SideBar from "./sidebar";
import TopBar from "./topbar";

export default function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-full bg-bg text-text selection:bg-amber selection:text-bg overflow-hidden relative">
            {/* Noise Overlay */}
            <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none bg-noise" />

            <SideBar />

            <div className="flex-1 h-screen overflow-y-auto flex flex-col relative z-[1] transition-all duration-300 ease-in-out">
                {/* Background Decor */}
                <div className="fixed top-[-10vh] right-[-10vw] w-[600px] h-[600px] bg-[radial-gradient(ellipse,rgba(232,160,32,0.05)_0%,transparent_70%)] pointer-events-none -z-10" />
                <div className="fixed bottom-[-10vh] left-[20vw] w-[500px] h-[500px] bg-[radial-gradient(ellipse,rgba(44,136,255,0.02)_0%,transparent_70%)] pointer-events-none -z-10" />

                <TopBar />

                <main className="flex-1 p-8 md:p-12 relative">
                    <div className="max-w-[1200px] mx-auto">
                        {children}
                    </div>
                </main>

                <footer className="px-12 py-8 border-t border-black/5 opacity-40 hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex flex-col gap-[2px] w-4">
                                <div className="h-[1.5px] w-full bg-amber rounded-sm opacity-50" />
                                <div className="h-[1.5px] w-[70%] bg-amber rounded-sm opacity-35" />
                            </div>
                            <span className="text-[10px] font-mono text-text-dim tracking-widest uppercase">Stratum.infra v0.1.0</span>
                        </div>
                        <p className="text-[10px] text-text-dim font-medium tracking-tight">
                            © 2026 Stratum Inc. Built for technical collaboration.
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
}