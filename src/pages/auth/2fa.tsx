import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/ui/authLayout';
import { useAuthStore } from '../../store/authStore';
import { handleVerifyTwoFactor, handleRequestTwoFactor } from '../../api/auth';

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
    const [resending, setResending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resendMessage, setResendMessage] = useState<string | null>(null);

    const handleVerify = async () => {
        setLoading(true);
        setError(null);
        try {
            const code = otp.join('');
            const result = await handleVerifyTwoFactor(code);
            if (!result.success) throw new Error(result.message);
            useAuthStore.getState().set2FaVerified(true);
            navigate('/workbook');
        } catch (err: any) {
            setError(err.message || 'Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setResendMessage(null);
        setError(null);
        try {
            const role = useAuthStore.getState().user?.role;
            if (!role) throw new Error('Could not determine your role. Please sign in again.');
            const result = await handleRequestTwoFactor(role);
            if (!result.success) throw new Error(result.message);
            setResendMessage('A new code has been sent to your email.');
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (err: any) {
            setError(err.message || 'Failed to resend code. Please try again.');
        } finally {
            setResending(false);
        }
    };

    const isComplete = otp.every(digit => digit !== '');


    return (
        <AuthLayout
            type="2fa"
            onBack={() => navigate(-1)}
            title="Verify identity"
            sub={<>We've sent a 6-digit verification code to your email. Enter it below to continue.</>}
        >
            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleVerify(); }}>
                {error && (
                    <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg">
                        {error}
                    </div>
                )}
                {resendMessage && (
                    <div className="p-3 text-xs bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg">
                        {resendMessage}
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

                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={resending}
                        className="w-full text-[13px] text-text-dim hover:text-amber transition-colors disabled:opacity-50"
                    >
                        {resending ? 'Sending...' : <>Didn't receive a code? <span className="text-amber font-medium">Resend</span></>}
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
};

export default TwoFactorPage;
