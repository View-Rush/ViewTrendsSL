/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChannelCreate } from '../models/ChannelCreate';
import type { ChannelListResponse } from '../models/ChannelListResponse';
import type { ChannelResponse } from '../models/ChannelResponse';
import type { ChannelUpdate } from '../models/ChannelUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ChannelsService {
    /**
     * Create Channel
     * Create a new channel or update if exists.
     * @param requestBody
     * @returns ChannelResponse Successful Response
     * @throws ApiError
     */
    public static createChannelApiV1ChannelsPost(
        requestBody: ChannelCreate,
    ): CancelablePromise<ChannelResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/channels/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Channels
     * Get all channels for the current user.
     * @param skip
     * @param limit
     * @param connectedOnly
     * @returns ChannelListResponse Successful Response
     * @throws ApiError
     */
    public static listChannelsApiV1ChannelsGet(
        skip?: number,
        limit: number = 100,
        connectedOnly: boolean = false,
    ): CancelablePromise<ChannelListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/channels/',
            query: {
                'skip': skip,
                'limit': limit,
                'connected_only': connectedOnly,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Channel
     * Get a specific channel.
     * @param channelId
     * @returns ChannelResponse Successful Response
     * @throws ApiError
     */
    public static getChannelApiV1ChannelsChannelIdGet(
        channelId: number,
    ): CancelablePromise<ChannelResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/channels/{channel_id}',
            path: {
                'channel_id': channelId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Channel
     * Update a channel.
     * @param channelId
     * @param requestBody
     * @returns ChannelResponse Successful Response
     * @throws ApiError
     */
    public static updateChannelApiV1ChannelsChannelIdPatch(
        channelId: number,
        requestBody: ChannelUpdate,
    ): CancelablePromise<ChannelResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/channels/{channel_id}',
            path: {
                'channel_id': channelId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Channel
     * Delete a channel.
     * @param channelId
     * @returns void
     * @throws ApiError
     */
    public static deleteChannelApiV1ChannelsChannelIdDelete(
        channelId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/channels/{channel_id}',
            path: {
                'channel_id': channelId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
