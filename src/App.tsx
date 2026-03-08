import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/landing/landing';
import LoginPage from './pages/auth/login';
import SignupPage from './pages/auth/signup';
import TwoFactorPage from './pages/auth/2fa';
import ForgotPasswordPage from './pages/auth/forgotpass';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import WorkbookPage from './pages/workbook/workbook';

import { AuthProvider } from './contexts/AuthContext';

export default function App() {
    return (
        <AuthProvider>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/auth/2fa" element={<TwoFactorPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route
                    path="/workbook"
                    element={
                        <ProtectedRoute>
                            <WorkbookPage />
                        </ProtectedRoute>
                    }
                />
                {/* Fallback for other routes */}
                <Route path="*" element={<LandingPage />} />
            </Routes>
        </AuthProvider>
    );
}