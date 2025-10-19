export type Source = 'api' | 'dummy' | 'manual';

export interface ChannelData {
    id?: number; // internal DB id for dummy/real channels in your DB
    youtube_channel_id?: string; // e.g. UC_xxx
    name?: string;
    subscriberCount?: number;
    totalViews?: number;
    totalVideos?: number;
    engagementRate?: number; // fraction e.g. 0.05
    category?: string;
    createdAt?: string;
    source?: Source;
}

export interface VideoData {
    id?: number; // internal DB id if already exists
    video_id?: string; // youtube video id
    title?: string;
    description?: string;
    thumbnail_url?: string;
    thumbnail_file?: File;
    thumbnail_preview?: string;
    duration?: string; // ISO 8601 or "00:03:12"
    category_id?: string;
    default_language?: string;
    view_count?: number;
    like_count?: number;
    comment_count?: number;
    tags?: string[];
    topics?: string[];
    published_at?: string; // ISO
    privacy_status?: string;
    is_uploaded?: boolean;
    is_draft?: boolean;
    source?: Source;
}

export interface PredictionCreateRequest {
    user_id?: number;
    channel: ChannelData;
    video: VideoData;
    meta?: Record<string, any>;
}
