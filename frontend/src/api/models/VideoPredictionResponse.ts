/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PredictionResponse } from './PredictionResponse';
import type { VideoResponse } from './VideoResponse';
/**
 * Combined response payload for video creation + prediction generation.
 */
export type VideoPredictionResponse = {
    /**
     * Created or existing video object
     */
    video: VideoResponse;
    /**
     * Created prediction object
     */
    prediction: PredictionResponse;
};

