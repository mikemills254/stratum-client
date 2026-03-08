import React, { useState } from 'react';
import supabase from '../../utilities/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../../components/AuthLayout';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message || 'Failed to sign in with Google');
        }
    };

    return (
        <AuthLayout
            type="signin"
            onBack={() => navigate('/')}
            title="Welcome back"
            sub={<>Don't have an account? <Link to="/signup" className="text-amber font-medium hover:underline">Sign up free →</Link></>}
        >
            <button
                onClick={handleGoogleLogin}
                className="w-full py-3 bg-surface border border-border-light rounded-xl text-text-mid text-sm flex items-center justify-center gap-2.5 hover:bg-surface-2 transition-all cursor-pointer"
            >
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                Continue with Google
            </button>

            <div className="flex items-center gap-3 my-6 text-[12px] text-text-dim uppercase tracking-wider before:content-[''] before:flex-1 before:h-[1px] before:bg-border after:content-[''] after:flex-1 after:h-[1px] after:bg-border">
                or continue with email
            </div>

            <form className="space-y-5" onSubmit={handleEmailLogin}>
                {error && (
                    <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg">
                        {error}
                    </div>
                )}
                <div className="space-y-2">
                    <label className="text-[12px] font-semibold text-text-mid uppercase tracking-widest">Email address</label>
                    <input
                        className="w-full bg-surface border border-border-light rounded-xl px-4 py-3.5 text-text outline-none focus:border-amber focus:ring-4 focus:ring-amber/5 transition-all"
                        type="email"
                        placeholder="you@school.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-[12px] font-semibold text-text-mid uppercase tracking-widest">Password</label>
                        <Link to="/forgot-password" className="text-amber text-[11px] font-medium hover:underline">Forgot password?</Link>
                    </div>
                    <input
                        className="w-full bg-surface border border-border-light rounded-xl px-4 py-3.5 text-text outline-none focus:border-amber focus:ring-4 focus:ring-amber/5 transition-all"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-br from-amber to-[#ff6b35] text-white rounded-xl text-[15px] font-bold shadow-[0_8px_24px_rgba(232,160,32,0.3)] hover:-translate-y-px hover:shadow-[0_12px_36px_rgba(232,160,32,0.4)] transition-all cursor-pointer mt-2 disabled:opacity-50"
                >
                    {loading ? 'Signing in...' : 'Sign In to Stratum →'}
                </button>
            </form>

            <div className="text-center mt-6 text-[12px] text-text-dim">
                By signing in you agree to our <a href="#" className="text-text-mid hover:text-amber">Terms</a> and <a href="#" className="text-text-mid hover:text-amber">Privacy Policy</a>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;
