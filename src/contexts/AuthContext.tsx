import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Session, User } from '@supabase/supabase-js';
import supabase from '../utilities/supabase';
import { useAuthStore } from '../store/authStore';
import { handleRequestTwoFactor } from '../api/auth';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const { setUser: setStoreUser, clearUser: clearStoreUser } = useAuthStore();

    useEffect(() => {
        const syncUser = (supabaseUser: User | null) => {
            const currentStoreUser = useAuthStore.getState().user;

            if (supabaseUser) {
                // If it's the same user, preserve the 2FA status from the store
                const isSameUser = currentStoreUser?.id === supabaseUser.id;
                const is2FaVerified = isSameUser ? currentStoreUser.is2FaVerified : false;

                setStoreUser({
                    id: supabaseUser.id,
                    email: supabaseUser.email ?? null,
                    username: `${supabaseUser.user_metadata.first_name} ${supabaseUser.user_metadata.last_name}`,
                    role: supabaseUser.user_metadata?.role ?? null,
                    isAuthenticated: true,
                    is2FaVerified: is2FaVerified,
                });
            } else {
                clearStoreUser();
            }
        };

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            syncUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            syncUser(session?.user ?? null);
            setLoading(false);

            if (event === 'SIGNED_IN') {
                if (location.pathname === '/login' || location.pathname === '/signup') {
                    // role was saved into user_metadata at signup — read it back now
                    const role = session?.user?.user_metadata?.role ?? null;
                    if (role) {
                        // fire the email; we don't block navigation on failure
                        handleRequestTwoFactor(role).then((result) => {
                            if (!result.success) {
                                console.warn('2FA email failed to send:', result.message);
                            }
                        });
                    }
                    navigate('/auth/2fa');
                }
            }

            if (event === 'SIGNED_OUT') {
                clearStoreUser();
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [location.pathname, navigate, setStoreUser, clearStoreUser]);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const value = {
        session,
        user,
        loading,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
