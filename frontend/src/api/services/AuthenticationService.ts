/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthResponse } from '../models/AuthResponse';
import type { Body_login_api_v1_auth_login_post } from '../models/Body_login_api_v1_auth_login_post';
import type { GoogleAuthResponse } from '../models/GoogleAuthResponse';
import type { Token } from '../models/Token';
import type { UserCreate } from '../models/UserCreate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationService {
    /**
     * Register
     * Register a new user and return token + user
     * @param requestBody
     * @returns AuthResponse Successful Response
     * @throws ApiError
     */
    public static registerApiV1AuthRegisterPost(
        requestBody: UserCreate,
    ): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Login
     * Login with username/password and get JWT token
     * @param formData
     * @returns AuthResponse Successful Response
     * @throws ApiError
     */
    public static loginApiV1AuthLoginPost(
        formData: Body_login_api_v1_auth_login_post,
    ): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/login',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Google Login
     * Initiate Google OAuth flow
     * @returns GoogleAuthResponse Successful Response
     * @throws ApiError
     */
    public static googleLoginApiV1AuthGoogleGet(): CancelablePromise<GoogleAuthResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/auth/google',
        });
    }
    /**
     * Google Callback
     * Handle Google OAuth callback
     * @returns any Successful Response
     * @throws ApiError
     */
    public static googleCallbackApiV1AuthGoogleCallbackGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/auth/google/callback',
        });
    }
    /**
     * Refresh Google Token
     * Refresh Google access token
     * @returns Token Successful Response
     * @throws ApiError
     */
    public static refreshGoogleTokenApiV1AuthGoogleRefreshTokenPost(): CancelablePromise<Token> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/google/refresh-token',
        });
    }
}
