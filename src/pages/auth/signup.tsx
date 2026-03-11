import React, { useState } from 'react';
import supabase from '../../utilities/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Crown, Edit3, BookOpen } from 'lucide-react';
import { AuthLayout } from '../../components/ui/authLayout';
import { useFormik } from "formik";
import { Role } from '../../types/types';

export const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            role: Role.TEACHER
        },
        onSubmit: async (values, { setSubmitting }) => {
            setError(null);
            try {
                const { error } = await supabase.auth.signUp({
                    email: values.email,
                    password: values.password,
                    options: {
                        data: {
                            first_name: values.firstName,
                            last_name: values.lastName,
                            role: values.role
                        }
                    }
                });
                navigate("/auth/2fa")
                if (error) throw error;
            } catch (err: any) {
                setError(err.message || 'Failed to sign up');
            } finally {
                setSubmitting(false);
            }
        }
    });

    const handleGoogleSignup = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: window.location.origin }
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message || 'Failed to sign up with Google');
        }
    };

    return (
        <AuthLayout
            type="signup"
            onBack={() => navigate('/')}
            title="Create account"
            sub={<>Already have an account? <Link to="/login" className="text-amber font-medium hover:underline">Sign in →</Link></>}
        >
            <button
                onClick={handleGoogleSignup}
                className="w-full py-3 bg-surface border border-border-light rounded-xl text-text-mid text-sm flex items-center justify-center gap-2.5 hover:bg-surface-2 transition-all cursor-pointer"
            >
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                Continue with Google
            </button>

            <div className="flex items-center gap-3 my-6 text-[12px] text-text-dim uppercase tracking-wider before:content-[''] before:flex-1 before:h-[1px] before:bg-border after:content-[''] after:flex-1 after:h-[1px] after:bg-border">
                or sign up with email
            </div>

            <form className="space-y-5" onSubmit={formik.handleSubmit} autoComplete='off' autoCapitalize='off'>
                {error && (
                    <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg">
                        {error}
                    </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[12px] font-semibold text-text-mid uppercase tracking-widest">First Name</label>
                        <input
                            name="firstName"
                            className="w-full bg-surface border border-border-light rounded-xl px-4 py-3.5 text-text outline-none focus:border-amber focus:ring-4 focus:ring-amber/5 transition-all"
                            placeholder="Mike"
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[12px] font-semibold text-text-mid uppercase tracking-widest">Last Name</label>
                        <input
                            name="lastName"
                            className="w-full bg-surface border border-border-light rounded-xl px-4 py-3.5 text-text outline-none focus:border-amber focus:ring-4 focus:ring-amber/5 transition-all"
                            placeholder="Kimani"
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[12px] font-semibold text-text-mid uppercase tracking-widest">Email address</label>
                    <input
                        name="email"
                        className="w-full bg-surface border border-border-light rounded-xl px-4 py-3.5 text-text outline-none focus:border-amber focus:ring-4 focus:ring-amber/5 transition-all"
                        type="email"
                        placeholder="you@school.edu"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[12px] font-semibold text-text-mid uppercase tracking-widest">Password</label>
                    <input
                        name="password"
                        className="w-full bg-surface border border-border-light rounded-xl px-4 py-3.5 text-text outline-none focus:border-amber focus:ring-4 focus:ring-amber/5 transition-all"
                        type="password"
                        placeholder="••••••••"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[12px] font-semibold text-text-mid uppercase tracking-widest">Your Role</label>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { id: Role.DIRECTOR, icon: <Crown size={20} />, name: 'Director', hint: 'Manage structure' },
                            { id: Role.TEACHER, icon: <Edit3 size={20} />, name: 'Teacher', hint: 'Grade & annotate' },
                            { id: Role.STUDENT, icon: <BookOpen size={20} />, name: 'Student', hint: 'Answer & learn' },
                        ].map((role) => (
                            <div
                                key={role.id}
                                onClick={() => formik.setFieldValue('role', role.id)}
                                className={`relative bg-surface border-[1.5px] rounded-xl p-[14px_8px] text-center cursor-pointer transition-all hover:border-amber/30 ${formik.values.role === role.id ? 'border-amber bg-amber-dim' : 'border-border-light'}`}
                            >
                                {formik.values.role === role.id && <div className="absolute top-1.5 right-2 text-amber text-[10px]">✓</div>}
                                <div className={`flex justify-center mb-1.5 ${formik.values.role === role.id ? 'text-amber' : 'text-text-dim'}`}>{role.icon}</div>
                                <div className="text-[12px] font-bold text-text">{role.name}</div>
                                <div className="text-[10px] text-text-dim mt-0.5">{role.hint}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="w-full py-4 bg-gradient-to-br from-amber to-[#ff6b35] text-text rounded-xl text-[15px] font-bold shadow-[0_8px_24px_rgba(232,160,32,0.3)] hover:-translate-y-px hover:shadow-[0_12px_36px_rgba(232,160,32,0.4)] transition-all cursor-pointer mt-2 disabled:opacity-50"
                >
                    {formik.isSubmitting ? 'Creating account...' : 'Create My Account →'}
                </button>
            </form>

            <div className="text-center mt-6 text-[12px] text-text-dim">
                By signing up you agree to our <a href="#" className="text-text-mid hover:text-amber">Terms</a> and <a href="#" className="text-text-mid hover:text-amber">Privacy Policy</a>
            </div>
        </AuthLayout>
    );
};

export default SignupPage;