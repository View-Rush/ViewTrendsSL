/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema returned in API responses.
 */
export type ChannelResponse = {
    /**
     * Channel title
     */
    channel_title: string;
    /**
     * Channel description
     */
    channel_description?: (string | null);
    /**
     * Thumbnail image URL
     */
    thumbnail_url?: (string | null);
    /**
     * Country of the channel
     */
    country?: (string | null);
    /**
     * Channel creation date
     */
    published_at?: (string | null);
    /**
     * Type of channel: real or dummy
     */
    type?: ChannelResponse.type;
    id: number;
    user_id: number;
    channel_id: (string | null);
    custom_url: (string | null);
    subscriber_count: number;
    video_count: number;
    view_count: number;
    likes: number;
    is_connected: boolean;
    last_synced_at: (string | null);
    created_at: string;
    updated_at: (string | null);
};
export namespace ChannelResponse {
    /**
     * Type of channel: real or dummy
     */
    export enum type {
        REAL = 'real',
        DUMMY = 'dummy',
    }
}

