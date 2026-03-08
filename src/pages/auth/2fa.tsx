import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/AuthLayout';
import { useAuthStore } from '../../store/authStore';

export const TwoFactorPage: React.FC = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleVerify = async () => {
        setLoading(true);
        setError(null);
        try {
            // Wait for user or implementation details on how OTP is handled in this specific setup
            // For now, assuming email OTP
            const otpString = otp.join('');
            // Note: In a real scenario, we'd need the email here. 
            // If it's a signup flow, Supabase might handle it via the session or we might need to pass email.
            // This is a placeholder for the actual Supabase verification call
            // const { error } = await supabase.auth.verifyOtp({ ... });

            console.log('Verifying OTP:', otpString);
            // Simulate success for now
            useAuthStore.getState().set2FaVerified(true);
            navigate('/workbook');
        } catch (err: any) {
            setError(err.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const isComplete = otp.every(digit => digit !== '');

    return (
        <AuthLayout
            type="2fa"
            onBack={() => navigate('/login')}
            title="Verify identity"
            sub={<>We've sent a 6-digit verification code to your email. Enter it below to continue.</>}
        >
            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleVerify(); }}>
                {error && (
                    <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg">
                        {error}
                    </div>
                )}
                <div className="flex justify-between gap-2.5">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-full aspect-square bg-surface border border-border-light rounded-xl text-center text-xl font-bold text-amber outline-none focus:border-amber focus:ring-4 focus:ring-amber/5 transition-all"
                        />
                    ))}
                </div>

                <div className="space-y-4">
                    <button
                        disabled={!isComplete || loading}
                        className="w-full py-4 bg-gradient-to-br from-amber to-[#ff6b35] text-white rounded-xl text-[15px] font-bold shadow-[0_8px_24px_rgba(232,160,32,0.3)] hover:-translate-y-px hover:shadow-[0_12px_36px_rgba(232,160,32,0.4)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                        {loading ? 'Verifying...' : 'Verify & Continue →'}
                    </button>

                    <button type="button" className="w-full text-[13px] text-text-dim hover:text-amber transition-colors">
                        Didn't receive a code? <span className="text-amber font-medium">Resend</span>
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
};

export default TwoFactorPage;
