/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PredictionCreate } from '../models/PredictionCreate';
import type { PredictionListResponse } from '../models/PredictionListResponse';
import type { PredictionPerformanceResponse } from '../models/PredictionPerformanceResponse';
import type { PredictionResponse } from '../models/PredictionResponse';
import type { PredictionStatus } from '../models/PredictionStatus';
import type { UpdateActualViews } from '../models/UpdateActualViews';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PredictionsService {
    /**
     * Create Prediction
     * Create a new prediction for a video.
     * Uses the ML forecasting model to predict 30-day view count.
     * @returns PredictionResponse Successful Response
     * @throws ApiError
     */
    public static createPredictionApiV1PredictionsPost({
        requestBody,
    }: {
        requestBody: PredictionCreate,
    }): CancelablePromise<PredictionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/predictions/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Predictions
     * Get all predictions for the current user with optional filters.
     * @returns PredictionListResponse Successful Response
     * @throws ApiError
     */
    public static listPredictionsApiV1PredictionsGet({
        skip,
        limit = 100,
        channelId,
        videoId,
        status,
    }: {
        skip?: number,
        limit?: number,
        channelId?: (number | null),
        videoId?: (number | null),
        status?: (PredictionStatus | null),
    }): CancelablePromise<PredictionListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/predictions/',
            query: {
                'skip': skip,
                'limit': limit,
                'channel_id': channelId,
                'video_id': videoId,
                'status': status,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Prediction Performance
     * Get prediction performance metrics for the current user.
     * @returns PredictionPerformanceResponse Successful Response
     * @throws ApiError
     */
    public static getPredictionPerformanceApiV1PredictionsPerformanceGet(): CancelablePromise<PredictionPerformanceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/predictions/performance',
        });
    }
    /**
     * Get Prediction
     * Get a specific prediction.
     * @returns PredictionResponse Successful Response
     * @throws ApiError
     */
    public static getPredictionApiV1PredictionsPredictionIdGet({
        predictionId,
    }: {
        predictionId: number,
    }): CancelablePromise<PredictionResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/predictions/{prediction_id}',
            path: {
                'prediction_id': predictionId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Prediction Actual Views
     * Update actual views for a prediction and calculate accuracy metrics.
     * @returns PredictionResponse Successful Response
     * @throws ApiError
     */
    public static updatePredictionActualViewsApiV1PredictionsPredictionIdActualViewsPatch({
        predictionId,
        requestBody,
    }: {
        predictionId: number,
        requestBody: UpdateActualViews,
    }): CancelablePromise<PredictionResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/predictions/{prediction_id}/actual-views',
            path: {
                'prediction_id': predictionId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
