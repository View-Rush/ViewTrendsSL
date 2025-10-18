/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserResponse } from '../models/UserResponse';
import type { UserUpdate } from '../models/UserUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Get Current User Info
     * Get info of the current authenticated user
     * @returns UserResponse Successful Response
     * @throws ApiError
     */
    public static getCurrentUserInfoApiV1UsersMeGet(): CancelablePromise<UserResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/me',
        });
    }
    /**
     * Update Current User
     * Update current user (username/email)
     * @param requestBody
     * @returns UserResponse Successful Response
     * @throws ApiError
     */
    public static updateCurrentUserApiV1UsersMePut(
        requestBody: UserUpdate,
    ): CancelablePromise<UserResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/users/me',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get User By Id
     * Get user by ID (superuser only)
     * @param userId
     * @returns UserResponse Successful Response
     * @throws ApiError
     */
    public static getUserByIdApiV1UsersUserIdGet(
        userId: number,
    ): CancelablePromise<UserResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
