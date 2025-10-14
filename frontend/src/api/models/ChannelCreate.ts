/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema for creating a channel.
 */
export type ChannelCreate = {
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
    subscriber_count?: (number | null);
    video_count?: (number | null);
    view_count?: (number | null);
    thumbnail_url?: (string | null);
    country?: (string | null);
    published_at?: (string | null);
};

