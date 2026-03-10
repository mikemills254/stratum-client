import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/landing/landing';
import LoginPage from './pages/auth/login';
import SignupPage from './pages/auth/signup';
import TwoFactorPage from './pages/auth/2fa';
import ForgotPasswordPage from './pages/auth/forgotpass';
import WorkbookPage from './pages/workbook/workbooks';
import WorkbookDetail from './pages/workbook/workbook';
import { AuthProvider } from './contexts/authContext';
import { Toaster } from "react-hot-toast"
import ScrollToTop from './components/ui/scrollToTop';
import PublicRoute from './components/ui/publicRoute';
import ProtectedRoute from './components/ui/protectedRoute';

export default function App() {
    return (
        <AuthProvider>
            <ScrollToTop />
            <Toaster />
            <Routes>
                <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
                <Route path="/auth/2fa" element={<TwoFactorPage />} />
                <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
                <Route
                    path="/workbook"
                    element={
                        <ProtectedRoute>
                            <WorkbookPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/workbook/:id"
                    element={
                        <ProtectedRoute>
                            <WorkbookDetail />
                        </ProtectedRoute>
                    }
                />
                {/* Fallback for other routes */}
                <Route path="*" element={<LandingPage />} />
            </Routes>
        </AuthProvider>
    );
}