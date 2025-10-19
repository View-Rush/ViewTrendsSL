/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VideoSourceType } from './VideoSourceType';
/**
 * Schema for creating a video (draft, uploaded, or synthetic).
 */
export type VideoCreate = {
    title: string;
    description?: (string | null);
    /**
     * Channel ID (internal)
     */
    channel_id: number;
    video_id?: (string | null);
    thumbnail_url?: (string | null);
    thumbnail_analysis?: (Record<string, any> | null);
    duration?: (string | null);
    category_id?: (string | null);
    default_language?: (string | null);
    default_audio_language?: (string | null);
    tags?: (Array<string> | null);
    topics?: (Array<string> | null);
    published_at?: (string | null);
    privacy_status?: (string | null);
    is_uploaded?: boolean;
    is_draft?: boolean;
    is_synthetic?: boolean;
    /**
     * Source of the video (youtube, manual, or test)
     */
    source_type?: VideoSourceType;
    /**
     * Additional metadata related to the video source
     */
    source_metadata?: (Record<string, any> | null);
};

