/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema for creating a prediction.
 */
export type PredictionCreate = {
    /**
     * Video ID (internal)
     */
    video_id: number;
    /**
     * Channel ID (internal)
     */
    channel_id: number;
    days_after_upload?: (number | null);
    model_version?: (string | null);
};

