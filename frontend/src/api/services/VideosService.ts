/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ThumbnailAnalysisRequest } from '../models/ThumbnailAnalysisRequest';
import type { ThumbnailAnalysisResponse } from '../models/ThumbnailAnalysisResponse';
import type { VideoCreate } from '../models/VideoCreate';
import type { VideoListResponse } from '../models/VideoListResponse';
import type { VideoResponse } from '../models/VideoResponse';
import type { VideoUpdate } from '../models/VideoUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class VideosService {
    /**
     * Create Video
     * Create a new video (draft or uploaded).
     * @returns VideoResponse Successful Response
     * @throws ApiError
     */
    public static createVideoApiV1VideosPost({
        requestBody,
    }: {
        requestBody: VideoCreate,
    }): CancelablePromise<VideoResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/videos/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Videos
     * Get all videos for the current user with optional filters.
     * @returns VideoListResponse Successful Response
     * @throws ApiError
     */
    public static listVideosApiV1VideosGet({
        skip,
        limit = 100,
        channelId,
        isDraft,
        isUploaded,
    }: {
        skip?: number,
        limit?: number,
        channelId?: (number | null),
        isDraft?: (boolean | null),
        isUploaded?: (boolean | null),
    }): CancelablePromise<VideoListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/videos/',
            query: {
                'skip': skip,
                'limit': limit,
                'channel_id': channelId,
                'is_draft': isDraft,
                'is_uploaded': isUploaded,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Video
     * Get a specific video.
     * @returns VideoResponse Successful Response
     * @throws ApiError
     */
    public static getVideoApiV1VideosVideoIdGet({
        videoId,
    }: {
        videoId: number,
    }): CancelablePromise<VideoResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/videos/{video_id}',
            path: {
                'video_id': videoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Video
     * Update a video.
     * @returns VideoResponse Successful Response
     * @throws ApiError
     */
    public static updateVideoApiV1VideosVideoIdPatch({
        videoId,
        requestBody,
    }: {
        videoId: number,
        requestBody: VideoUpdate,
    }): CancelablePromise<VideoResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/videos/{video_id}',
            path: {
                'video_id': videoId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Video
     * Delete a video.
     * @returns void
     * @throws ApiError
     */
    public static deleteVideoApiV1VideosVideoIdDelete({
        videoId,
    }: {
        videoId: number,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/videos/{video_id}',
            path: {
                'video_id': videoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Analyze Thumbnail
     * Analyze a thumbnail image.
     * TODO: Implement actual thumbnail analysis logic using computer vision.
     * This is a placeholder that returns mock data.
     * @returns ThumbnailAnalysisResponse Successful Response
     * @throws ApiError
     */
    public static analyzeThumbnailApiV1VideosAnalyzeThumbnailPost({
        requestBody,
    }: {
        requestBody: ThumbnailAnalysisRequest,
    }): CancelablePromise<ThumbnailAnalysisResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/videos/analyze-thumbnail',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
