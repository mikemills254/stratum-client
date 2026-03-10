import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { useAuthStore } from '../../store/authStore';

interface PublicRouteProps {
    children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const { user: authUser, loading } = useAuth();
    const { user: storeUser } = useAuthStore();

    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-background">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber border-t-transparent"></div>
            </div>
        );
    }

    if (authUser) {
        if (storeUser?.is2FaVerified) {
            return <Navigate to="/workbook" replace />;
        }
        // If authenticated but not 2FA verified, we allow them to stay on Public pages.
        // This prevents the "2FA trap" where they can't go back to Login/Signup.
    }

    return <>{children}</>;
};

export default PublicRoute;
