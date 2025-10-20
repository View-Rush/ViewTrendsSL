import { create } from 'zustand';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';
import type { User } from '@/types';

interface AuthState {
    user: User | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
    signIn: (email: string, password: string) => Promise<{ error: any }>;
    signInWithGoogle: () => Promise<{ error: any }>;
    signOut: () => Promise<void>;
    initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,

    setUser: (user) => set({ user }),
    setLoading: (loading) => set({ loading }),

    initialize: () => {
        // Start initializing
        set({ loading: true });

        const token = authService.getToken();
        const storedUser = authService.getStoredUser();

        // Restore token for the API client
        if (token) {
            authService.setToken(token);
        }

        // Case 1: Token exists
        if (token) {
            // Temporarily set stored user if available (for instant UI load)
            if (storedUser) {
                set({ user: storedUser });
            }

            // Always verify current user with backend
            authService
                .getCurrentUser()
                .then((userData) => {
                    const user = userData as unknown as User;
                    authService.setStoredUser(user);
                    set({ user, loading: false });
                })
                .catch((err) => {
                    console.warn("Auth init failed:", err);
                    authService.logout();
                    set({ user: null, loading: false });
                });
        }
        // Case 2: No token
        else {
            set({ user: null, loading: false });
        }

        // No cleanup needed
        return () => {};
    },

    signUp: async (email: string, password: string, username: string) => {
        try {
            const userData = await authService.register({
                email,
                password,
                full_name: username,
            });

            const user = userData as unknown as User;
            authService.setStoredUser(user);
            set({ user });

            toast.success('Account created successfully!');
            return { error: null };
        } catch (error: any) {
            toast.error(error?.message || 'Registration failed');
            return { error };
        }
    },

    signIn: async (email: string, password: string) => {
        try {
            await authService.login({
                username: email,
                password,
            });

            const userData = await authService.getCurrentUser();
            const user = userData as unknown as User;
            authService.setStoredUser(user);
            set({ user });

            toast.success('Signed in successfully!');
            return { error: null };
        } catch (error: any) {
            toast.error(error?.message || 'Login failed');
            return { error };
        }
    },

    signInWithGoogle: async () => {
        try {
            const { authorization_url } = await authService.initiateGoogleOAuth();
            window.location.href = authorization_url;
            return { error: null };
        } catch (error: any) {
            toast.error(error?.message || 'Google sign-in failed');
            return { error };
        }
    },

    signOut: async () => {
        try {
            authService.logout();
            set({ user: null });
            toast.success('Signed out successfully!');
        } catch (error: any) {
            toast.error(error?.message || 'Sign out failed');
        }
    },
}));
