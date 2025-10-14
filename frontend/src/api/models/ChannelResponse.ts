/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema for channel response.
 */
export type ChannelResponse = {
    /**
     * YouTube channel ID
     */
    channel_id: string;
    /**
     * Channel title
     */
    channel_title: string;
    channel_description?: (string | null);
    custom_url?: (string | null);
    id: number;
    user_id: number;
    subscriber_count: number;
    video_count: number;
    view_count: number;
    thumbnail_url: (string | null);
    country: (string | null);
    published_at: (string | null);
    is_connected: boolean;
    last_synced_at: (string | null);
    created_at: string;
    updated_at: (string | null);
};

