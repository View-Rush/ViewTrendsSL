/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Body_create_channel_api_v1_channels__post = {
    /**
     * Type of channel: real or dummy
     */
    type?: string;
    channel_title: string;
    channel_description?: (string | null);
    country?: (string | null);
    /**
     * YouTube channel ID (for real channels)
     */
    channel_id?: (string | null);
    custom_url?: (string | null);
    subscriber_count?: (number | null);
    video_count?: (number | null);
    view_count?: (number | null);
    likes?: (number | null);
    thumbnail?: (Blob | null);
};

