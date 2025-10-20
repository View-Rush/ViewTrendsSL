import {
    AuthResponse,
    type Body_login_api_v1_auth_login_post,
    OpenAPI,
    type Token,
    type UserCreate,
    type UserResponse,
} from '@/api';
import {AuthenticationService, UsersService} from "@/api";
import type {User} from "@/types";

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const authService = {
    async login(credentials: Body_login_api_v1_auth_login_post): Promise<UserResponse> {
        const response = await AuthenticationService.loginApiV1AuthLoginPost(credentials) as unknown as AuthResponse;

        this.setToken(response.access_token);
        this.setStoredUser(response.user);

        return response.user;
    },

    async register(data: UserCreate): Promise<UserResponse> {
        const response = await AuthenticationService.registerApiV1AuthRegisterPost(data) as unknown as AuthResponse;

        if (response.access_token) {
            this.setToken(response.access_token);
        }
        this.setStoredUser(response.user);

        return response.user;
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

    getToken(): string | null {
        return localStorage.getItem('token');
    },

    setToken(token: string) {
        localStorage.setItem('token', token);
        OpenAPI.TOKEN = token;
    },

    clearToken() {
        localStorage.removeItem(TOKEN_KEY);
        OpenAPI.TOKEN = '';
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

    clearStoredUser() {
        localStorage.removeItem(USER_KEY);
    },

    logout() {
        this.clearToken();
        this.clearStoredUser();
    },
};