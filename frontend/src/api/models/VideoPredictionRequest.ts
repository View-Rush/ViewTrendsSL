/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PredictionCreate } from './PredictionCreate';
import type { VideoCreate } from './VideoCreate';
/**
 * Combined request payload for creating a video (if not exists)
 * and generating a prediction.
 */
export type VideoPredictionRequest = {
    /**
     * Video creation payload
     */
    video: VideoCreate;
    /**
     * Prediction creation payload
     */
    prediction: PredictionCreate;
};

