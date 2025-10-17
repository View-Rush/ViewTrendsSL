import { create } from 'zustand';
import type {User} from '@/types';
import { authService } from '@/services/auth.service.ts';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    login: (token: string, user: User) => void;
    logout: () => void;
    initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: authService.getStoredUser(),
    token: authService.getToken(),
    isAuthenticated: !!authService.getToken(),
    isLoading: false,

    setUser: (user) => set({ user }),

    setToken: (token) => set({ token, isAuthenticated: !!token }),

    login: (token, user) => {
        authService.setToken(token);
        authService.setStoredUser(user);
        set({ token, user, isAuthenticated: true });
    },

    logout: () => {
        authService.logout();
        set({ user: null, token: null, isAuthenticated: false });
    },

    initialize: async () => {
        const token = authService.getToken();
        if (!token) {
            set({ user: null, token: null, isAuthenticated: false });
            return;
        }

        set({ isLoading: true });

        try {
            // Fetch current user from API
            const userResponse = await authService.getCurrentUser();

            // Extract minimal user info to store
            const user: User = {
                id: userResponse.id,
                email: userResponse.email,
                username: userResponse.username,
                is_active: userResponse.is_active,
                is_superuser: userResponse.is_superuser,
                has_youtube_access: userResponse.has_youtube_access,
                google_id: userResponse.google_id ?? undefined,
                created_at: userResponse.created_at,
                updated_at: userResponse.updated_at ?? undefined,
            };

            // Store in localStorage
            authService.setStoredUser(user);

            set({ user, token, isAuthenticated: true });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            // If API fails (token invalid/expired), logout
            authService.logout();
            set({ user: null, token: null, isAuthenticated: false });
        } finally {
            set({ isLoading: false });
        }
    },
}));