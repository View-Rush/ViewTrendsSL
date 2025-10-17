import type {Body_login_api_v1_auth_login_post, Token, UserCreate, UserResponse,} from '@/api';
import {AuthenticationService, UsersService} from "@/api";
import type {User} from "@/types";


export const authService = {
    async login(credentials: Body_login_api_v1_auth_login_post): Promise<Token> {
        const token = await AuthenticationService.loginApiV1AuthLoginPost({
            formData: credentials,
        });
        // Optionally store token in localStorage
        localStorage.setItem('token', token.access_token);
        return token;
    },

    async register(data: UserCreate): Promise<UserResponse> {
        return AuthenticationService.registerApiV1AuthRegisterPost({
            requestBody: data,
        });
    },

    async getCurrentUser(): Promise<UserResponse> {
        return UsersService.getCurrentUserInfoApiV1UsersMeGet()
    },

    async initiateGoogleOAuth(): Promise<{ authorization_url: string }> {
        return AuthenticationService.googleLoginApiV1AuthGoogleGet();
    },

    async refreshGoogleToken(): Promise<Token> {
        const token = await AuthenticationService.refreshGoogleTokenApiV1AuthGoogleRefreshTokenPost();
        // Optionally update localStorage
        localStorage.setItem('token', token.access_token);
        return token;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getToken(): string | null {
        return localStorage.getItem('token');
    },

    setToken(token: string) {
        localStorage.setItem('token', token);
    },

    getStoredUser(): User | null {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
        return null;
    },

    setStoredUser(user: User) {
        localStorage.setItem('user', JSON.stringify(user));
    },
};