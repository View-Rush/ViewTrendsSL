import {
    type PredictionCreate,
    type PredictionResponse,
    type PredictionListResponse,
    type PredictionPerformanceResponse,
    type PredictionStatus,
    type UpdateActualViews,
    PredictionsService,
} from '@/api';

export const predictionsService = {
    async getPredictions(params?: {
        skip?: number;
        limit?: number;
        channelId?: number;
        videoId?: number;
        status?: PredictionStatus;
    }): Promise<PredictionListResponse> {
        return PredictionsService.listPredictionsApiV1PredictionsGet({
            skip: params?.skip,
            limit: params?.limit ?? 100,
            channelId: params?.channelId ?? null,
            videoId: params?.videoId ?? null,
            status: params?.status ?? null,
        });
    },

    async getPrediction(id: number): Promise<PredictionResponse> {
        return PredictionsService.getPredictionApiV1PredictionsPredictionIdGet({ predictionId: id });
    },

    async createPrediction(data: PredictionCreate): Promise<PredictionResponse> {
        return PredictionsService.createPredictionApiV1PredictionsPost({ requestBody: data });
    },

    async updateActualViews(id: number, data: UpdateActualViews): Promise<PredictionResponse> {
        return PredictionsService.updatePredictionActualViewsApiV1PredictionsPredictionIdActualViewsPatch({
            predictionId: id,
            requestBody: data,
        });
    },

    async getPerformance(): Promise<PredictionPerformanceResponse> {
        return PredictionsService.getPredictionPerformanceApiV1PredictionsPerformanceGet();
    },
};
