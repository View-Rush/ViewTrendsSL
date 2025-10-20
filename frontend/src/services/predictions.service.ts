import {
    type PredictionCreate,
    type PredictionResponse,
    type PredictionListResponse,
    type PredictionPerformanceResponse,
    type PredictionStatus,
    type UpdateActualViews,
    type VideoPredictionRequest,
    type VideoPredictionResponse,
    PredictionsService,
} from '@/api';

/**
 * Unified Prediction Client
 * Wraps the OpenAPI-generated PredictionsService with
 * clean async/await-style methods for app use.
 */
export const predictionsService = {
    /**
     * Fetch all predictions with optional filters.
     */
    async getPredictions(params?: {
        skip?: number;
        limit?: number;
        channelId?: number;
        videoId?: number;
        status?: PredictionStatus;
    }): Promise<PredictionListResponse> {
        return PredictionsService.listPredictionsApiV1PredictionsGet(
            params?.skip,
            params?.limit ?? 100,
            params?.channelId ?? null,
            params?.videoId ?? null,
            params?.status ?? null
        );
    },

    /**
     * Fetch a single prediction by ID.
     */
    async getPrediction(id: number): Promise<PredictionResponse> {
        return PredictionsService.getPredictionApiV1PredictionsPredictionIdGet(id);
    },

    /**
     * Create a prediction for an existing video.
     */
    async createPrediction(data: PredictionCreate): Promise<PredictionResponse> {
        return PredictionsService.createPredictionApiV1PredictionsPost(data);
    },

    /**
     * Create both a video and prediction together (combined endpoint).
     */
    async createVideoAndPrediction(
        data: VideoPredictionRequest
    ): Promise<VideoPredictionResponse> {
        return PredictionsService.createVideoAndPredictionApiV1PredictionsCreateCombinedPost(
            data
        );
    },

    /**
     * Update actual views and recalculate metrics.
     */
    async updateActualViews(
        id: number,
        data: UpdateActualViews
    ): Promise<PredictionResponse> {
        return PredictionsService.updatePredictionActualViewsApiV1PredictionsPredictionIdActualViewsPatch(
            id,
            data
        );
    },

    /**
     * Fetch prediction performance metrics for current user.
     */
    async getPerformance(): Promise<PredictionPerformanceResponse> {
        return PredictionsService.getPredictionPerformanceApiV1PredictionsPerformanceGet();
    },
};
