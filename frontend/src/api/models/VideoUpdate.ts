/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema for updating a video.
 */
export type VideoUpdate = {
    title?: (string | null);
    description?: (string | null);
    video_id?: (string | null);
    thumbnail_url?: (string | null);
    thumbnail_analysis?: (Record<string, any> | null);
    duration?: (string | null);
    category_id?: (string | null);
    default_language?: (string | null);
    default_audio_language?: (string | null);
    view_count?: (number | null);
    like_count?: (number | null);
    comment_count?: (number | null);
    tags?: (Array<string> | null);
    topics?: (Array<string> | null);
    published_at?: (string | null);
    privacy_status?: (string | null);
    is_uploaded?: (boolean | null);
    is_draft?: (boolean | null);
};

