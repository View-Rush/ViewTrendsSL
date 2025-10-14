/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema for prediction performance metrics.
 */
export type PredictionPerformanceResponse = {
    user_id: number;
    total_predictions: number;
    completed_predictions: number;
    pending_predictions: number;
    average_accuracy: (number | null);
    average_absolute_error: (number | null);
    average_percentage_error: (number | null);
    best_prediction_id: (number | null);
    worst_prediction_id: (number | null);
    last_calculated_at: (string | null);
};

