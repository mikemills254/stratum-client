import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
    id: string | null;
    email: string | null;
    username: string | null;
    role: string | null;
    isAuthenticated: boolean;
    is2FaVerified: boolean;
}

interface AuthStore {
    user: UserState | null;
    setUser: (user: UserState | null) => void;
    set2FaVerified: (isVerified: boolean) => void;
    clearUser: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            set2FaVerified: (isVerified) => set((state) => ({
                user: state.user ? { ...state.user, is2FaVerified: isVerified } : null
            })),
            clearUser: () => set({ user: null }),
        }),
        {
            name: 'stratum-auth-storage',
        }
    )
);
