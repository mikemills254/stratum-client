import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../../components/AuthLayout';

export const ForgotPasswordPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <AuthLayout
            type="forgotpass"
            onBack={() => navigate('/login')}
            title="Reset password"
            sub={<>Enter your email and we'll send you a link to reset your password.</>}
        >
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                    <label className="text-[12px] font-semibold text-text-mid uppercase tracking-widest">Email address</label>
                    <input
                        className="w-full bg-surface border border-border-light rounded-xl px-4 py-3.5 text-text outline-none focus:border-amber focus:ring-4 focus:ring-amber/5 transition-all"
                        type="email"
                        placeholder="you@school.edu"
                        required
                    />
                </div>

                <button className="w-full py-4 bg-gradient-to-br from-amber to-[#ff6b35] text-white rounded-xl text-[15px] font-bold shadow-[0_8px_24px_rgba(232,160,32,0.3)] hover:-translate-y-px hover:shadow-[0_12px_36px_rgba(232,160,32,0.4)] transition-all cursor-pointer mt-2">
                    Send Reset Link →
                </button>
            </form>

            <div className="text-center mt-8">
                <Link to="/login" className="text-text-mid text-sm hover:text-amber transition-colors">
                    ← Back to sign in
                </Link>
            </div>
        </AuthLayout>
    );
};

export default ForgotPasswordPage;
