/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_upload_thumbnail_api_v1_videos_upload_thumbnail_post } from '../models/Body_upload_thumbnail_api_v1_videos_upload_thumbnail_post';
import type { Body_upload_thumbnail_for_video_api_v1_videos__video_id__upload_thumbnail_post } from '../models/Body_upload_thumbnail_for_video_api_v1_videos__video_id__upload_thumbnail_post';
import type { ThumbnailAnalysisRequest } from '../models/ThumbnailAnalysisRequest';
import type { ThumbnailAnalysisResponse } from '../models/ThumbnailAnalysisResponse';
import type { ThumbnailUploadResponse } from '../models/ThumbnailUploadResponse';
import type { VideoCreate } from '../models/VideoCreate';
import type { VideoListResponse } from '../models/VideoListResponse';
import type { VideoResponse } from '../models/VideoResponse';
import type { VideoSourceType } from '../models/VideoSourceType';
import type { VideoUpdate } from '../models/VideoUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class VideosService {
    /**
     * Create Video
     * Create a new video (draft, uploaded, or synthetic).
     * @param requestBody
     * @returns VideoResponse Successful Response
     * @throws ApiError
     */
    public static createVideoApiV1VideosPost(
        requestBody: VideoCreate,
    ): CancelablePromise<VideoResponse> {
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
     * @param skip
     * @param limit
     * @param channelId
     * @param isDraft
     * @param isUploaded
     * @param sourceType Filter by source type (youtube, manual, or test)
     * @param isSynthetic Filter by whether the video is synthetic
     * @returns VideoListResponse Successful Response
     * @throws ApiError
     */
    public static listVideosApiV1VideosGet(
        skip?: number,
        limit: number = 100,
        channelId?: (number | null),
        isDraft?: (boolean | null),
        isUploaded?: (boolean | null),
        sourceType?: (VideoSourceType | null),
        isSynthetic?: (boolean | null),
    ): CancelablePromise<VideoListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/videos/',
            query: {
                'skip': skip,
                'limit': limit,
                'channel_id': channelId,
                'is_draft': isDraft,
                'is_uploaded': isUploaded,
                'source_type': sourceType,
                'is_synthetic': isSynthetic,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Video
     * Get a specific video.
     * @param videoId
     * @returns VideoResponse Successful Response
     * @throws ApiError
     */
    public static getVideoApiV1VideosVideoIdGet(
        videoId: number,
    ): CancelablePromise<VideoResponse> {
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
     * @param videoId
     * @param requestBody
     * @returns VideoResponse Successful Response
     * @throws ApiError
     */
    public static updateVideoApiV1VideosVideoIdPatch(
        videoId: number,
        requestBody: VideoUpdate,
    ): CancelablePromise<VideoResponse> {
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
     * @param videoId
     * @returns void
     * @throws ApiError
     */
    public static deleteVideoApiV1VideosVideoIdDelete(
        videoId: number,
    ): CancelablePromise<void> {
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
     * @param requestBody
     * @returns ThumbnailAnalysisResponse Successful Response
     * @throws ApiError
     */
    public static analyzeThumbnailApiV1VideosAnalyzeThumbnailPost(
        requestBody: ThumbnailAnalysisRequest,
    ): CancelablePromise<ThumbnailAnalysisResponse> {
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
    /**
     * Import Youtube Video
     * Import a video from YouTube into the user's library.
     * @param inputValue YouTube video ID
     * @returns VideoResponse Successful Response
     * @throws ApiError
     */
    public static importYoutubeVideoApiV1VideosImportPost(
        inputValue: string,
    ): CancelablePromise<VideoResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/videos/import',
            query: {
                'input_value': inputValue,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upload a thumbnail image for a video
     * Uploads a thumbnail to Supabase Storage and returns its public URL.
     * @param formData
     * @returns ThumbnailUploadResponse Successful Response
     * @throws ApiError
     */
    public static uploadThumbnailApiV1VideosUploadThumbnailPost(
        formData: Body_upload_thumbnail_api_v1_videos_upload_thumbnail_post,
    ): CancelablePromise<ThumbnailUploadResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/videos/upload-thumbnail',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upload and attach a thumbnail to a specific video
     * Uploads a thumbnail to Supabase Storage and updates the video record.
     * @param videoId
     * @param formData
     * @returns VideoResponse Successful Response
     * @throws ApiError
     */
    public static uploadThumbnailForVideoApiV1VideosVideoIdUploadThumbnailPost(
        videoId: number,
        formData: Body_upload_thumbnail_for_video_api_v1_videos__video_id__upload_thumbnail_post,
    ): CancelablePromise<VideoResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/videos/{video_id}/upload-thumbnail',
            path: {
                'video_id': videoId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
