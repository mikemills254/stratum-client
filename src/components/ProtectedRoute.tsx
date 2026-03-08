import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user: authUser, loading } = useAuth();
    const { user: storeUser } = useAuthStore();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-background">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber border-t-transparent"></div>
            </div>
        );
    }

    if (!authUser) {
        // Redirect to login but save the current location they were trying to go to
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!storeUser?.is2FaVerified) {
        // Redirect to 2FA if authenticated but not 2FA verified
        return <Navigate to="/auth/2fa" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
