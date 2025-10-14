/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema for video response.
 */
export type VideoResponse = {
    title: string;
    description?: (string | null);
    /**
     * Channel ID (internal)
     */
    channel_id: number;
    id: number;
    user_id: number;
    video_id: (string | null);
    thumbnail_url: (string | null);
    thumbnail_analysis: (Record<string, any> | null);
    duration: (string | null);
    category_id: (string | null);
    default_language: (string | null);
    default_audio_language: (string | null);
    view_count: number;
    like_count: number;
    comment_count: number;
    tags: (Array<string> | null);
    topics: (Array<string> | null);
    published_at: (string | null);
    privacy_status: string;
    is_uploaded: boolean;
    is_draft: boolean;
    created_at: string;
    updated_at: (string | null);
    last_synced_at: (string | null);
};

