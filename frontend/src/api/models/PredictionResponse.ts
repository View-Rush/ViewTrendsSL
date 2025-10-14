/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PredictionStatus } from './PredictionStatus';
/**
 * Schema for prediction response.
 */
export type PredictionResponse = {
    /**
     * Video ID (internal)
     */
    video_id: number;
    /**
     * Channel ID (internal)
     */
    channel_id: number;
    id: number;
    user_id: number;
    prediction_date: string;
    target_date: string;
    days_after_upload: number;
    predicted_views: number;
    confidence_score: (number | null);
    prediction_breakdown: (Record<string, any> | null);
    model_version: (string | null);
    model_features: (Record<string, any> | null);
    actual_views: (number | null);
    accuracy_score: (number | null);
    absolute_error: (number | null);
    percentage_error: (number | null);
    status: PredictionStatus;
    created_at: string;
    updated_at: (string | null);
    completed_at: (string | null);
};

